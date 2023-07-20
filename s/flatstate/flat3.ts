
import {maptool} from "../tools/maptool.js"
import {CircularFlatstateError} from "./parts/errors.js"

const make_map = <K, V>() => new Map<K, V>()
const make_set = <X>() => new Set<X>()

export class Flatstate {
	#tracking: Tracking = new WeakMap()
	#stoppers = new Map<symbol, () => void>()
	#stop(symbol: symbol) {
		const stop = this.#stoppers.get(symbol)
		if (stop) {
			this.#stoppers.delete(symbol)
			stop()
		}
	}

	#recording: false | Recording = false
	#record(fun: () => void) {
		this.#recording = make_map()
		fun()
		const recording = this.#recording
		this.#recording = false
		return recording
	}

	#locked = false
	#lock(fun: () => void) {
		this.#locked = true
		fun()
		this.#locked = false
	}

	get #is_locked_or_recording() {
		return this.#locked || !!this.#recording
	}

	#proxy_handlers: ProxyHandler<any> = {
		get: (state, key: string) => {
			record_key(this.#recording, state, key)
			return state[key]
		},
		set: (state, key: string, value: any) => {
			if (this.#is_locked_or_recording)
				throw new CircularFlatstateError(key)

			state[key] = value

			const keymap = maptool(this.#tracking).grab(state, make_map)
			const symbolmap = maptool(keymap).grab(key, make_map)

			const todo: [symbol, Reaction][] = []

			for (const entry of symbolmap.entries()) {
				const [,reaction] = entry
				this.#lock(reaction.responder)
				todo.push(entry)
			}

			for (const [symbol, reaction] of todo) {
				this.#stop(symbol)
				const recorded = this.#record(reaction.collector)
				this.#stoppers.set(
					symbol,
					save_reaction(symbol, recorded, this.#tracking, reaction),
				)
			}

			return true
		},
	}

	get wait() {
		return Promise.resolve()
	}

	state<S extends {}>(state: S) {
		return new Proxy(state, this.#proxy_handlers)
	}

	manual(reaction: Reaction) {
		const symbol = Symbol()
		const recorded = this.#record(reaction.collector)
		this.#stoppers.set(
			symbol,
			save_reaction(symbol, recorded, this.#tracking, reaction)
		)
		return () => this.#stop(symbol)
	}

	reaction<D>(collector: () => D, responder?: (data: D) => void) {
		return this.manual({
			collector,
			responder: responder
				? () => responder(collector())
				: collector,
		})
	}
}

type KeySet = Set<string>
type Recording = Map<{}, KeySet>

type Reaction = {collector: () => void, responder: () => void}
type SymbolMap = Map<symbol, Reaction>
type KeyMap = Map<string, SymbolMap>
type Tracking = WeakMap<{}, KeyMap>

function record_key(
		recording: false | Recording,
		state: {},
		key: string,
	) {
	if (recording) {
		const keyset = maptool(recording).grab(state, make_set)
		keyset.add(key)
	}
}

function save_reaction(
		symbol: symbol,
		recording: Recording,
		tracking: Tracking,
		reaction: Reaction,
	) {

	const stoppers: (() => void)[] = []

	for (const [state, keyset] of recording.entries()) {
		const keymap = maptool(tracking).grab(state, make_map)

		for (const key of keyset) {
			const symbolmap = maptool(keymap).grab(key, make_map)
			symbolmap.set(symbol, reaction)
			stoppers.push(() => symbolmap.delete(symbol))
		}
	}

	return () => stoppers.forEach(stop => stop())
}


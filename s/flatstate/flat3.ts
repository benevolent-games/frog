
import {maptool} from "../tools/maptool.js"
import {debounce} from "../tools/debounce.js"
import {CircularFlatstateError} from "./parts/errors.js"

const make_map = <K, V>() => new Map<K, V>()
const make_set = <X>() => new Set<X>()

class Scheduler {
	#queue = new Map<symbol, () => void>()
	#wait: Promise<void> = Promise.resolve()

	#actuate = debounce(0, () => {
		const functions = [...this.#queue.values()]
		this.#queue = new Map()
		for (const fun of functions)
			fun()
	})

	get wait() {
		return this.#wait
	}

	add(symbol: symbol, fun: () => void) {
		this.#queue.set(symbol, fun)
		this.#wait = this.#actuate()
	}
}

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

	#locked = false
	#lock(fun: () => void) {
		this.#locked = true
		fun()
		this.#locked = false
	}

	#recording?: Recording
	#record(fun: () => void) {
		this.#recording = make_map()
		this.#lock(fun)
		const recording = this.#recording
		this.#recording = undefined
		return recording
	}

	#scheduler = new Scheduler()

	#respond_and_run_discovery([symbol, reaction]: [symbol, Reaction]) {
		this.#lock(reaction.responder)

		if (reaction.discover) {
			this.#stop(symbol)
			const recorded = this.#record(reaction.collector)
			this.#stoppers.set(
				symbol,
				save_reaction(symbol, recorded, this.#tracking, reaction),
			)
		}
	}

	#proxy_handlers: ProxyHandler<any> = {

		get: (state, key: string) => {
			record_key(this.#recording, state, key)
			return state[key]
		},

		set: (state, key: string, value: any) => {
			if (this.#locked)
				throw new CircularFlatstateError(key)

			state[key] = value

			const keymap = maptool(this.#tracking).grab(state, make_map)
			const symbolmap = maptool(keymap).grab(key, make_map)

			for (const entry of [...symbolmap.entries()]) {
				const [symbol, reaction] = entry

				if (reaction.debounce)
					this.#scheduler.add(symbol, () => this.#respond_and_run_discovery(entry))
				else
					this.#respond_and_run_discovery(entry)
			}

			return true
		},
	}

	get wait() {
		return this.#scheduler.wait
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

	auto<D>({debounce, discover, collector, responder}: {
			debounce: boolean
			discover: boolean
			collector: () => D
			responder?: (data: D) => void
		}) {
		return this.manual({
			debounce,
			discover,
			collector,
			responder: responder
				? () => responder(collector())
				: collector,
		})
	}

	reaction<D>(collector: () => D, responder?: (data: D) => void) {
		return this.auto({
			debounce: true,
			discover: true,
			collector,
			responder,
		})
	}

	reaction_lean<D>(collector: () => D, responder?: (data: D) => void) {
		return this.auto({
			debounce: true,
			discover: false,
			collector,
			responder,
		})
	}
}

type KeySet = Set<string>
type Recording = Map<{}, KeySet>

type Reaction = {
	collector: () => void
	responder: () => void
	discover: boolean
	debounce: boolean
}

type SymbolMap = Map<symbol, Reaction>
type KeyMap = Map<string, SymbolMap>
type Tracking = WeakMap<{}, KeyMap>

function record_key(
		recording: Recording | undefined,
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



import {maptool} from "../tools/maptool.js"
import {readonly} from "./parts/readonly.js"
import {CircularFlatstateError} from "./parts/errors.js"

type Target = {}
type Keyset = Set<string>
type Collector = () => void
type Responder = () => void
type ReactionMap = Map<symbol, [Collector, Responder]>
type ReactionsByKeys = Map<string, ReactionMap>

const make_map = <K, V>() => new Map<K, V>()
const make_set = <X>() => new Set<X>()

export class Flatstate {
	static readonly = readonly

	#lock = false
	#active_tracking: undefined | Map<Target, Keyset>
	#tracking = new WeakMap<Target, ReactionsByKeys>()

	get wait() {
		return Promise.resolve()
	}

	state<S extends {}>(target: S) {
		return new Proxy(target, {

			get: (target, key: string) => {
				if (this.#active_tracking) {
					const keyset = maptool(this.#active_tracking).grab(target, make_set)
					keyset.add(key)
				}
				return target[key as keyof S]
			},

			set: (target, key: string, value: any) => {
				if (this.#lock || this.#active_tracking)
					throw new CircularFlatstateError(key)

				target[key as keyof S] = value

				const reactions_by_keys = maptool(this.#tracking).grab(target, make_map)
				const reactions = maptool(reactions_by_keys).grab(key, make_map)
				this.#lock = true

				for (const [symbol, [collector, responder]] of reactions.entries()) {
					responder()
					this.#record_state_property_access(symbol, collector, responder)
				}

				this.#lock = false
				return true
			},
		}) as S
	}

	#record_state_property_access(
			symbol: symbol,
			collector: () => void,
			responder: () => void,
		) {

		this.#active_tracking = new Map()
		collector()

		const stoppers: (() => void)[] = []

		for (const [target, keyset] of this.#active_tracking.entries()) {
			const reactions_by_keys = maptool(this.#tracking).grab(target, make_map)

			for (const key of keyset) {
				const reactions = maptool(reactions_by_keys).grab(key, make_map)
				reactions.set(symbol, [collector, responder])
				stoppers.push(() => reactions.delete(symbol))
			}
		}

		this.#active_tracking = undefined
		return () => stoppers.forEach(stop => stop())
	}

	reaction_core(collector: () => void, responder: () => void) {
		const symbol = Symbol()
		this.#active_tracking = new Map()
		collector()

		const stoppers: (() => void)[] = []

		for (const [target, keyset] of this.#active_tracking.entries()) {
			const reactions_by_keys = maptool(this.#tracking).grab(target, make_map)

			for (const key of keyset) {
				const reactions = maptool(reactions_by_keys).grab(key, make_map)
				reactions.set(symbol, [collector, responder])
				stoppers.push(() => reactions.delete(symbol))
			}
		}

		this.#active_tracking = undefined
		return () => stoppers.forEach(stop => stop())
	}

	reaction<D>(collector: () => D, responder?: (data: D) => void) {
		return this.reaction_core(
			collector,
			responder
				? () => responder(collector())
				: collector
		)
	}

	clear() {
		this.#tracking = new WeakMap()
	}
}


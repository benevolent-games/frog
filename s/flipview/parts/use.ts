
import {Flat} from "../../flatstate/flat.js"

export class Use {
	#counter: {count: number}
	#flat: Flat
	#states: Map<number, {}>
	#setdowns: Map<number, () => void>

	constructor(
			flat: Flat,
			counter: {count: number},
			states: Map<number, {}>,
			setdowns: Map<number, () => void>,
		) {
		this.#counter = counter
		this.#flat = flat
		this.#states = states
		this.#setdowns = setdowns
	}

	setup(up: () => () => void) {
		const count = this.#counter.count++
		if (!this.#setdowns.has(count)) {
			const down = up()
			this.#setdowns.set(count, down)
		}
	}

	state<S extends {}>(init: S | (() => S)): S {
		const count = this.#counter.count++
		let state = this.#states.get(count)
		if (!state) {
			state = this.#flat.state(
				typeof init === "function"
					? (init as () => S)()
					: init
			)
			this.#states.set(count, state)
		}
		return state as S
	}
}


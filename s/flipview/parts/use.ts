
import {Flat} from "../../flatstate/flat.js"

export class Use {
	#counter: {count: number}
	#flat: Flat
	#states: Map<number, {}>
	#setdata: Map<number, any>
	#setdowns: Map<number, () => void>
	readonly element: HTMLElement

	constructor(
			flat: Flat,
			counter: {count: number},
			states: Map<number, {}>,
			setdata: Map<number, any>,
			setdowns: Map<number, () => void>,
			element: HTMLElement,
		) {

		this.#counter = counter
		this.#flat = flat
		this.#states = states
		this.#setdata = setdata
		this.#setdowns = setdowns
		this.element = element
	}

	setup<R>(up: () => {result?: R, setdown?: () => void}): R {
		const count = this.#counter.count++
		if (!this.#setdowns.has(count)) {
			const {result, setdown = () => {}} = up()
			this.#setdowns.set(count, setdown)
			return result as R
		}
		return this.#setdata.get(count) as R
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


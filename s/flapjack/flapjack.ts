
import {TemplateResult} from "lit"
import {Flat} from "../flatstate/flat"
import {AsyncDirective, directive} from "lit/async-directive.js"

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

export function make_hooks(flat: Flat) {
	const counter = {count: 0}
	const states = new Map<number, {}>()
	const setdowns = new Map<number, () => void>()
	const use = new Use(
		flat,
		counter,
		states,
		setdowns,
	)

	return {
		use,
		setdown() {
			for (const [id, down] of [...setdowns.entries()]) {
				down()
				setdowns.delete(id)
			}
		},
		reset() {
			counter.count = 0
		},
	}
}

export function flapjack<P extends any[]>(flat: Flat, rend: (use: Use) => (...props: P) => TemplateResult | void) {
	return directive(class extends AsyncDirective {
		#recent_input!: P
		#hooks = make_hooks(flat)
		#stop: (() => void) | undefined

		render(...props: P) {
			this.#recent_input = props

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					this.#hooks.reset()
					result = rend(this.#hooks.use)(...props)
				},
				responder: () => {
					this.render(...this.#recent_input)
				},
			})

			this.setValue(result!)
			return result!
		}

		disconnected() {
			if (this.#stop) {
				this.#stop()
				this.#stop = undefined
			}
			this.#hooks.setdown()
		}
	}) as (...props: P) => TemplateResult | void
}


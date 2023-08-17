
import {CSSResultGroup, Part, TemplateResult} from "lit"

import {Flat} from "../flatstate/flat.js"
import {make_root} from "./parts/make_root.js"
import {AsyncDirective} from "lit/async-directive.js"
import {apply_details} from "../flatview/parts/apply_details.js"
import {Flatview, FlatviewInput, ShadowableTag} from "../flatview/flatview.js"
import {custom_directive_with_detail_input} from "../flatview/parts/custom_directive_with_detail_input.js"

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
		wrap<F extends (...args: any[]) => any>(fun: F) {
			return ((...args: any[]) => {
				counter.count = 0
				return fun(...args)
			}) as F
		},
	}
}

export type FlapjackOptions<P extends any[]> = {
	flat: Flat
	type?: "shadow" | "light"
	styles: CSSResultGroup
	tag?: ShadowableTag
	name?: string
	render: (use: Use) => (...props: P) => TemplateResult | void
}

export function flapjack<P extends any[]>({
		flat,
		name,
		styles,
		tag = "div",
		type = "shadow",
		render,
	}: FlapjackOptions<P>) {

	return custom_directive_with_detail_input(class extends AsyncDirective {
		#recent_input?: FlatviewInput<P>
		#hooks = make_hooks(flat)
		#renderize = this.#hooks.wrap(render)
		#stop: (() => void) | undefined
		#root = make_root(type, name, tag, styles)

		update(_: Part, props: [FlatviewInput<P>]) {
			return this.#root.render_into_root(this.render(...props))
		}

		render(input: FlatviewInput<P>) {
			apply_details(this.#root.container, input.details, this.#recent_input?.details)
			this.#recent_input = input

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					result = this.#renderize(this.#hooks.use)(...this.#recent_input!.props)
				},
				responder: () => {
					this.setValue(
						this.#root.render_into_root(
							this.render(this.#recent_input!)
						)
					)
				},
			})

			return result
		}

		disconnected() {
			if (this.#stop) {
				this.#stop()
				this.#stop = undefined
			}
			this.#hooks.setdown()
		}
	}) as Flatview<P>
}


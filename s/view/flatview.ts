
import {directive} from "lit/directive.js"
import {obtool} from "@chasemoskal/magical"
import {CSSResultGroup, TemplateResult} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {Flatstate} from "../flatstate/flatstate.js"

export type FlatviewRenderer<S extends {}, A extends {}, P extends any[]> = (
	(o: {state: S, actions: A}) => (...props: P) => TemplateResult | void
)

export type FlatviewOptions = {
	flat: Flatstate
	shadow: boolean
	strict: boolean
}

export type Flatview<P extends any[]> = (...props: P) => TemplateResult | void

export type DeferredFlatviewGroup = {
	[key: string]: (flat: Flatstate) => Flatview<any>
}

export type UnwrapDeferredFlatviewGroup<F extends DeferredFlatviewGroup> = {
	[P in keyof F]: ReturnType<F[P]>
}

function final<S extends {}, A extends {}, P extends any[]>({
		css,
		renderer,
		initstate,
		initactions,
		...options
	}: FlatviewOptions & {
		initstate: S
		initactions: (s: S) => A
		renderer: FlatviewRenderer<S, A, P>
		css?: CSSResultGroup
	}) {

	const state = options.strict
		? Flatstate.readonly(options.flat.state(initstate))
		: options.flat.state(initstate)
	const actions = initactions(state)
	const render = renderer({state, actions})

	return directive(class extends AsyncDirective {
		#recent_props?: P
		#stop?: () => void

		render(...props: P) {
			this.#recent_props = props

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = options.flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					result = render(...props)
				},
				responder: () => {
					this.setValue(
						this.render(...this.#recent_props!)
					)
				},
			})

			return result
		}

		disconnected() {
			if (this.#stop)
				this.#stop()

			this.#stop = undefined
		}
	}) as Flatview<P>
}

export function flatview(options: FlatviewOptions) {
	return {
		state: <S extends {}>(initstate: S) => ({
			actions: <A extends {}>(initactions: (state: S) => A) => ({
				render: <P extends any[]>(renderer: FlatviewRenderer<S, A, P>) => ({
					css: (css?: CSSResultGroup) => (
						final({...options, initstate, initactions, renderer, css})
					)
				})
			})
		})
	}
}

flatview.provide = function<F extends DeferredFlatviewGroup>(flat: Flatstate) {
	return (group: F) => (
		obtool(group)
			.map(view => view(flat)) as UnwrapDeferredFlatviewGroup<F>
	)
}



import {obtool} from "../tools/obtool.js"
import {Flatstate} from "../flatstate/flatstate.js"

import {directive} from "lit/directive.js"
import {CSSResultGroup, TemplateResult} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

export type View<P extends any[]> = (...props: P) => TemplateResult | void
export type FlatViews = {[key: string]: (flat: Flatstate) => View<any[]>}
export type UnwrapFlatViews<F extends FlatViews> = {[P in keyof F]: ReturnType<F[P]>}

export type ViewOptions<S extends {}, P extends any[]> = {
	state: S
	flat: Flatstate
	shadow?: boolean
	css?: CSSResultGroup
	render(state: S, ...props: P): TemplateResult | void
}

export function flatview<S extends {}, P extends any[]>(options: ViewOptions<S, P>) {
	const state = options.flat.state(options.state)

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
					result = options.render(state, ...props)
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
	}) as (...props: P) => TemplateResult | void
}

flatview.defer = function<S extends {}, P extends any[]>(options: Omit<ViewOptions<S, P>, "flat">) {
	return (flat: Flatstate) => flatview({...options, flat})
}

export function provide_flat<F extends FlatViews>(flat: Flatstate) {
	return (flatviews: F) => (
		obtool(flatviews)
			.map(flatview => flatview(flat)) as UnwrapFlatViews<F>
	)
}


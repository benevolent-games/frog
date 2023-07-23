
import {CSSResultGroup, Part, TemplateResult} from "lit"

import {make_view_root} from "./root.js"
import {Flat} from "../../flatstate/flat.js"
import {make_view_context} from "./context.js"
import {AsyncDirective, directive} from "lit/async-directive.js"
import {Flatview, FlatviewOptions, FlatviewRenderer, FlatviewSetup} from "./types.js"

export function make_view_directive<S extends {}, A extends {}, P extends any[]>({
		css,
		setup,
		renderer,
		initstate,
		initactions,
		flat = new Flat(),
		strict = false,
	}: FlatviewOptions & {
		initstate: S
		initactions: (s: S) => A
		setup: FlatviewSetup<S, A>
		renderer: FlatviewRenderer<S, A, P>
		css?: CSSResultGroup
	}) {

	return directive(class extends AsyncDirective {
		#root = make_view_root(css)
		#context = make_view_context({flat, strict, initstate, initactions})
		#render_content = renderer(this.#context)

		#recent_props?: P
		#unsetup?: void | (() => void)
		#stop?: () => void

		update(_: Part, props: P) {
			return this.#root.render_into_shadow(this.render(...props))
		}

		render(...props: P) {
			this.#recent_props = props

			if (!this.#unsetup)
				this.#unsetup = setup(this.#context)

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					result = this.#render_content(...props)
				},
				responder: () => {
					this.setValue(
						this.#root.render_into_shadow(
							this.render(...this.#recent_props!)
						)
					)
				},
			})

			return result
		}

		disconnected() {
			if (this.#unsetup) {
				this.#unsetup()
				this.#unsetup = undefined
			}
			if (this.#stop) {
				this.#stop()
				this.#stop = undefined
			}
		}
	}) as Flatview<P>
}

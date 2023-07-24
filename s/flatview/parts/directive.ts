
import {CSSResultGroup, Part, TemplateResult} from "lit"

import {make_view_root} from "./root.js"
import {Flat} from "../../flatstate/flat.js"
import {make_view_context} from "./context.js"
import {AsyncDirective} from "lit/async-directive.js"
import {Flatview, FlatviewInput, FlatviewRenderer, FlatviewSetup} from "./types.js"
import {custom_directive_with_detail_input} from "./custom_directive_with_detail_input.js"

export function make_view_directive<S extends {}, A extends {}, P extends any[]>({
		flat,
		strict,
		css,
		setup,
		renderer,
		initstate,
		initactions,
	}: {
		flat: Flat
		strict: boolean
		initstate: S
		initactions: (s: S) => A
		setup: FlatviewSetup<S, A>
		renderer: FlatviewRenderer<S, A, P>
		css?: CSSResultGroup
	}) {

	return custom_directive_with_detail_input(class extends AsyncDirective {
		#root = make_view_root(css)
		#context = make_view_context({flat, strict, initstate, initactions})
		#render_content = renderer(this.#context)

		#recent_input!: FlatviewInput<P>
		#unsetup?: void | (() => void)
		#stop?: () => void

		update(_: Part, props: [FlatviewInput<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
		}

		render(input: FlatviewInput<P>) {
			this.#recent_input = input
			this.#root.container.setAttribute("part", input.details.part ?? "")
			this.#root.container.setAttribute("exportparts", input.details.exportparts ?? "")

			if (!this.#unsetup)
				this.#unsetup = setup(this.#context)

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					result = this.#render_content(...input.props)
				},
				responder: () => {
					this.setValue(
						this.#root.render_into_shadow(
							this.render(this.#recent_input)
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


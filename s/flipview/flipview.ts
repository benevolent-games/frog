
import {Part, TemplateResult} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {hooks} from "./parts/hooks.js"
import {make_view_root} from "./parts/root.js"
import {apply_details} from "./parts/apply_details.js"
import {Flipview, FlipviewData, FlipviewOptions} from "./parts/types.js"
import {custom_directive_with_detail_input} from "./parts/custom_directive_with_detail_input.js"

export function flipview<P extends any[]>({
		flat,
		name,
		styles,
		default_auto_exportparts,
		render,
	}: FlipviewOptions<P>) {

	return custom_directive_with_detail_input(class extends AsyncDirective {
		#recent_input?: FlipviewData<P>
		#hooks = hooks(flat)
		#renderize = this.#hooks.wrap(render)
		#stop: (() => void) | undefined
		#root = make_view_root(name, styles)

		update(_: Part, props: [FlipviewData<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
		}

		render(input: FlipviewData<P>) {
			apply_details(this.#root.container, input, this.#recent_input)
			this.#recent_input = input
			this.#root.auto_exportparts = (
				input.auto_exportparts ?? default_auto_exportparts
			)

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					const props = this.#recent_input!.props
					result = this.#renderize(this.#hooks.use)(...props)
				},
				responder: () => {
					this.setValue(
						this.#root.render_into_shadow(
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
	}) as Flipview<P>
}


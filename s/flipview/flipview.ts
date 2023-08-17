
import {Part, TemplateResult} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {hooks} from "./parts/hooks.js"
import {make_view_root} from "./parts/root.js"
import {apply_details} from "./parts/apply_details.js"
import {auto_export_parts} from "./parts/auto_export_parts.js"
import {FlatviewInput, Flipview, FlipviewOptions} from "./parts/types.js"
import {custom_directive_with_detail_input} from "./parts/custom_directive_with_detail_input.js"

export function flipview<P extends any[]>({
		flat,
		tag,
		name,
		styles,
		render,
	}: FlipviewOptions<P>) {

	return custom_directive_with_detail_input(class extends AsyncDirective {
		#recent_input?: FlatviewInput<P>
		#hooks = hooks(flat)
		#renderize = this.#hooks.wrap(render)
		#stop: (() => void) | undefined
		#root = make_view_root(tag, name, styles, auto_export_parts)

		update(_: Part, props: [FlatviewInput<P>]) {
			return this.#root.render_into_shadow(this.render(...props))
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


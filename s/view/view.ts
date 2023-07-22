
import {directive} from "lit/directive.js"
import {CSSResultGroup, TemplateResult} from "lit"
import {AsyncDirective} from "lit/async-directive.js"

import {Flatstate} from "../flatstate/flatstate.js"

export function flatview<S extends {}, P extends any[]>(options: {
		css?: CSSResultGroup,
		state: S,
		render(state: S, ...props: P): TemplateResult | void
	}) {

	const flat = new Flatstate()
	const state = flat.state(options.state)

	return directive(class extends AsyncDirective {
		#recent_props?: P
		#stop?: () => void

		render(...props: P) {
			this.#recent_props = props

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void

			this.#stop = flat.manual({
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

			return options.render(state, ...props)
		}

		disconnected() {
			if (this.#stop)
				this.#stop()

			this.#stop = undefined
		}
	}) as (...props: P) => TemplateResult | void
}


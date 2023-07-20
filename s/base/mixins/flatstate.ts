
import {TemplateResult} from "lit"

import {BaseElementClass} from "../element.js"
import {Flatstate} from "../../flatstate/flatstate.js"

export function mixinFlatstate(flat: Flatstate) {
	return function<C extends BaseElementClass>(Base: C): C {
		return class extends Base {
			#stop: void | (() => void) = undefined

			constructor(...args: any[]) {
				super(...args)
				Object.defineProperty(this, "updateComplete", {
					get: async() => {
						await flat.wait
						await super.updateComplete
					},
					set: () => {
						throw new Error("updateComplete is readonly")
					},
				})
			}

			render() {
				if (this.#stop)
					this.#stop()

				let result: void | TemplateResult = undefined

				this.#stop = flat.reaction_core(
					() => { result = super.render() },
					() => { this.requestUpdate() },
				)

				return result
			}

			disconnectedCallback() {
				super.disconnectedCallback()

				if (this.#stop)
					this.#stop()

				this.#stop = undefined
			}
		}
	}
}


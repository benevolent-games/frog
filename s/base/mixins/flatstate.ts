
import {TemplateResult} from "lit"

import {BaseElementClass} from "../element.js"
import {Flatstate} from "../../flatstate/flatstate.js"

/*

this flatstate mixin uses a bizarre strategy for optimizaton purposes.

+ on every render, we stop/reassign a new manual reaction.
+ discover is false, because we essentially emulate it
	by assigning a new reaction every render,
	using the current render as a new collector.
+ debounce is false, because lit's requestUpdate does that.

*/

export function mixinFlatstate(flat: Flatstate) {
	return function<C extends BaseElementClass>(Base: C): C {
		return class extends Base {
			#stop: void | (() => void) = undefined

			render() {
				if (this.#stop)
					this.#stop()

				let result: void | TemplateResult = undefined

				this.#stop = flat.manual({
					debounce: false,
					discover: false,
					collector: () => {
						result = super.render()
					},
					responder: () => {
						this.requestUpdate()
					},
				})

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


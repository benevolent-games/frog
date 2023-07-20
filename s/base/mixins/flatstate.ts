
import {TemplateResult} from "lit"

import {BaseElementClass} from "../element.js"
import {Flatstate} from "../../flatstate/flatstate.js"

export function mixinFlatstate(...flats: Flatstate[]) {
	return function<C extends BaseElementClass>(Base: C): C {
		return class extends Base {
			#untracks: (() => void)[] = []

			get flatwait() {
				return Promise
					.all(flats.map(flat => flat.wait))
					.then(() => {})
			}

			connectedCallback() {
				super.connectedCallback()

				for (const flat of flats) {
					this.#untracks.push(flat.reaction_core(
						() => { this.render() },
						() => { this.requestUpdate() },
					))
				}
			}

			disconnectedCallback() {
				super.disconnectedCallback()

				for (const untrack of this.#untracks)
					untrack()

				this.#untracks = []
			}
		}
	}
}

export function mixinFlatstate2(flat: Flatstate) {
	return function<C extends BaseElementClass>(Base: C): C {
		return class extends Base {
			#stop: void | (() => void) = undefined

			constructor(...args: any[]) {
				super(...args)
				Object.defineProperty(this, "updateComplete", {
					async get() {
						await flat.wait
						await super.updateComplete
					},
					set() {
						throw new Error("updateComplete is readonly")
					},
				})
			}

			render() {
				if (this.#stop) this.#stop()
				let result: void | TemplateResult = undefined

				this.#stop = flat.reaction_core(
					() => { result = super.render() },
					() => { this.requestUpdate() },
				)

				return result
			}
		}
	}
}


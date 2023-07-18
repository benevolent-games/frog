
import {Flat} from "../../flatstate/flat.js"
import {BaseElementClass} from "../element.js"

export function mixinFlatstate(...flats: Flat[]) {
	return function<C extends BaseElementClass>(Base: C): C {
		return class extends Base {
			#untracks: (() => void)[] = []

			get flatwait() {
				return Promise.all(flats.map(flat => flat.wait))
			}

			connectedCallback() {
				super.connectedCallback()

				for (const flat of flats) {
					this.#untracks.push(flat.reaction(
						() => this.render(),
						() => this.requestUpdate(),
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


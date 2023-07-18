
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


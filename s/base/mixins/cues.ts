
import {CueGroup} from "../../cues/group.js"
import {BaseElementClass} from "../element.js"

export function mixinCues(group: CueGroup) {
	return function<C extends BaseElementClass>(Base: C): C {
		return class extends Base {
			#untracks: (() => void)[] = []

			connectedCallback() {
				super.connectedCallback()

				this.#untracks.push(group.track(
					() => this.render(),
					() => this.requestUpdate(),
				))
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



import {CueGroup} from "../../cues/group.js"
import {BaseElement} from "../../base/element.js"

export function cue_facility_for_element(element: BaseElement) {
	const cues = new CueGroup()
	let untracks: (() => void)[] = []

	return {
		cues,

		on_connected() {
			untracks.push(cues.track(
				() => element.render(),
				() => element.requestUpdate(),
			))
		},

		on_disconnected() {
			for (const untrack of untracks)
				untrack()

			untracks = []
		}
	}
}


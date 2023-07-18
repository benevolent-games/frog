
import {ActiveTracking, Keymap, Trackers} from "../../types.js"

export function trigger_reactions(
		active_tracking: undefined | ActiveTracking,
		trackers: Trackers,
		target: {},
		key: string,
	) {

	if (active_tracking)
		throw new Error("forbidden flatstate circularity; please don't set a flatstate value within a react/track responder")

	const keymap: Keymap = trackers.get(target) ?? new Map()
	const keytracks = keymap.get(key)

	if (keytracks) {
		for (const [collector, responders] of keytracks.entries()) {
			if (responders.size > 0) {
				const substate = collector()
				for (const responder of responders)
					if (responder)
						responder(substate)
			}
		}
	}
}


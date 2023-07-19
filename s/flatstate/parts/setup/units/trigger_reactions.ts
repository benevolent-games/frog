
import {CircularFlatstateError} from "../../errors.js"
import {ActiveTracking, Keymap, Trackers} from "../../types.js"

export function trigger_reactions(
		active_tracking: undefined | ActiveTracking,
		trackers: Trackers,
		target: {},
		key: string,
	) {

	if (active_tracking)
		throw new CircularFlatstateError(key)

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


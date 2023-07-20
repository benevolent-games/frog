
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
	const responders = keymap.get(key)

	for (const responder of (responders ?? []))
		responder()
}


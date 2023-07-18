
import {ActiveTracking} from "../../types.js"
import {maptool} from "../../../../tools/maptool.js"

export function record_in_active_tracking_that_key_was_accessed(
		target: {},
		key: string,
		active_tracking: ActiveTracking,
	) {

	const keys = maptool(active_tracking)
		.grab(target, () => new Set)

	keys.add(key)
}


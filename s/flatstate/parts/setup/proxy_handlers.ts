
import {ActiveTracking, Trackers} from "../types.js"
import {trigger_reactions} from "./units/trigger_reactions.js"
import {record_in_active_tracking_that_key_was_accessed} from "./units/record_in_active_tracking_that_key_was_accessed.js"

export function setup_proxy_handlers(
		trackers: Trackers,
		get_active_tracking: () => (undefined | ActiveTracking),
	): ProxyHandler<{[key: string]: any}> {
	return {

		get: (target, key: string) => {
			const active_tracking = get_active_tracking()
			if (active_tracking)
				record_in_active_tracking_that_key_was_accessed(
					target,
					key,
					active_tracking,
				)
			return target[key]
		},

		set: (target, key: string, value) => {
			trigger_reactions(
				get_active_tracking(),
				trackers,
				target,
				key,
			)
			target[key] = value
			return true
		},
	}
}


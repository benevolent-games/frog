
import {debounce} from "@chasemoskal/magical"

import {ActiveTracking, Trackers} from "../types.js"
import {trigger_reactions} from "./units/trigger_reactions.js"
import {record_in_active_tracking_that_key_was_accessed} from "./units/record_in_active_tracking_that_key_was_accessed.js"

export function setup_accessors(
		get_trackers: () => Trackers,
		get_active_tracking: () => (undefined | ActiveTracking),
	) {

	const debounced_trigger_reaction = debounce(0, trigger_reactions)
	let promise: Promise<void>

	const proxy_handlers: ProxyHandler<{[key: string]: any}> = {

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
			promise = debounced_trigger_reaction(
				get_active_tracking(),
				get_trackers(),
				target,
				key,
			)
			target[key] = value
			return true
		},
	}

	return {
		proxy_handlers,
		get wait_for_debouncer(): Promise<void> {
			return promise
		},
	}
}


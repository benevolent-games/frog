
import {maptool} from "../../tools/maptool.js"
import {ActiveTracking, Responder, Trackers} from "./types.js"

const make_map = <K, V>() => new Map<K, V>()
const make_set = <X>() => new Set<X>()

export function save_active_tracking_to_trackers(
		trackers: Trackers,
		active_tracking: ActiveTracking,
		responder: Responder,
	) {

	const undos: (() => void)[] = []

	for (const [proxy, keys] of active_tracking.entries()) {
		const keymap = maptool(trackers).grab(proxy, make_map)
		for (const key of keys) {
			const responders = maptool(keymap).grab(key, make_set)
			responders.add(responder)
			undos.push(() => responders.delete(responder))
		}
	}

	return () => undos.forEach(undo => undo())
}


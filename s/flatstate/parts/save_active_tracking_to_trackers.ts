
import {maptool, weakmaptool} from "../../tools/maptool.js"
import {ActiveTracking, Collector, CollectorMeta, Responder, Trackers} from "./types.js"

const make_map = <K, V>() => new Map<K, V>()
const make_set = <X>() => new Set<X>()
const make_collector_meta = (lean: boolean): CollectorMeta => ({
	lean,
	responders: make_set(),
})

export function save_active_tracking_to_trackers<S>(
		trackers: Trackers,
		active_tracking: ActiveTracking,
		collector: Collector<S>,
		lean: boolean,
		responder?: Responder<S>,
	) {

	const undos: (() => void)[] = []

	for (const [proxy, keys] of active_tracking.entries()) {
		const keymap = weakmaptool(trackers).grab(proxy, make_map)
		for (const key of keys) {
			const keytracks = maptool(keymap).grab(key, make_map)
			const meta = maptool(keytracks).grab(collector, () => make_collector_meta(lean))
			meta.responders.add(responder)
			undos.push(() => meta.responders.delete(responder))
		}
	}

	return () => undos.forEach(undo => undo())
}


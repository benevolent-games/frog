
import {setup_accessors} from "./parts/setup/accessors.js"
import {ActiveTracking, Collector, Keymap, Responder, Trackers} from "./parts/types.js"
import {save_active_tracking_to_trackers} from "./parts/save_active_tracking_to_trackers.js"

export class Flat {
	#trackers: Trackers = new WeakMap<{}, Keymap>()
	#active_tracking: undefined | ActiveTracking

	#accessors = setup_accessors(
		this.#trackers,
		() => this.#active_tracking,
	)

	get wait() {
		return this.#accessors.wait_for_debouncer
	}

	state<S extends {}>(init: S) {
		const target: S = {...init}
		return new Proxy(target, this.#accessors.proxy_handlers)
	}

	reaction<S>(
			collector: Collector<S>,
			responder?: Responder<S>,
		) {

		this.#active_tracking = new Map()
		collector()

		const stop = save_active_tracking_to_trackers(
			this.#trackers,
			this.#active_tracking,
			collector,
			responder,
		)

		this.#active_tracking = undefined
		return stop
	}
}


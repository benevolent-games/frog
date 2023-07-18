
import {setup_proxy_handlers} from "./parts/setup/proxy_handlers.js"
import {ActiveTracking, Collector, Keymap, Responder, Trackers} from "./parts/types.js"
import {save_active_tracking_to_trackers} from "./parts/save_active_tracking_to_trackers.js"

export class Flat {
	#trackers: Trackers = new WeakMap<{}, Keymap>()
	#active_tracking: undefined | ActiveTracking

	#proxy_handlers = setup_proxy_handlers(
		this.#trackers,
		() => this.#active_tracking,
	)

	state<S extends {}>(init: S) {
		const target: S = {...init}
		return new Proxy(target, this.#proxy_handlers)
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


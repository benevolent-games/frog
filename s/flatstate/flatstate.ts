
import {readonly} from "./parts/readonly.js"
import {setup_accessors} from "./parts/setup/accessors.js"
import {ActiveTracking, Keymap, Trackers} from "./parts/types.js"
import {save_active_tracking_to_trackers} from "./parts/save_active_tracking_to_trackers.js"

export class Flatstate {
	static readonly = readonly

	#trackers: Trackers = new WeakMap<{}, Keymap>()
	#active_tracking: undefined | ActiveTracking

	#accessors = setup_accessors(
		() => this.#trackers,
		() => this.#active_tracking,
	)

	get wait() {
		return this.#accessors.wait_for_debouncer
	}

	state<S extends {}>(init: S) {
		const target: S = {...init}
		return new Proxy(target, this.#accessors.proxy_handlers) as S
	}

	reaction_core(collector: () => void, responder: () => void) {
		this.#active_tracking = new Map()
		collector()

		const stop = save_active_tracking_to_trackers(
			this.#trackers,
			this.#active_tracking,
			responder,
		)

		this.#active_tracking = undefined
		return stop
	}

	reaction<D>(collector: () => D, responder?: (data: D) => void) {
		return this.reaction_core(
			collector,
			responder
				? () => responder(collector())
				: collector
		)
	}

	reaction2<D>(collector: () => D, responder?: (data: D) => void) {
		const true_responder = responder
			? () => responder(collector())
			: collector

		let stop: undefined | (() => void)

		const next_collector = () => {
			if (stop)
				stop()

			let data = undefined as D

			stop = this.reaction_core(
				() => {
					data = collector()
				},
				true_responder,
			)

			return data
		}

		return this.reaction_core(
			collector,
			responder
				? () => responder(next_collector())
				: next_collector
		)
	}

	clear() {
		this.#trackers = new WeakMap()
	}
}


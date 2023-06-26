
import {debounce} from "@chasemoskal/magical"
import {TemplateResult, adoptStyles, render} from "lit"

import {BaseElement} from "../base/element.js"
import {explode_promise} from "../tools/explode_promise.js"
import {finalize_styles} from "../base/utils/finalize_styles.js"
import {cue_facility_for_element} from "../base/utils/cue_facility_for_element.js"

export class QuickElement extends HTMLElement implements BaseElement {
	#root: ShadowRoot
	#update_promise?: Promise<void>
	#cue_facility = cue_facility_for_element(this)
	#update_promise_initial = explode_promise<void>()

	constructor() {
		super()
		this.#root = this.attachShadow({mode: "open"})
		const styles = finalize_styles((this.constructor as any).styles)
		adoptStyles(this.#root, styles)
	}

	get cues() {
		return this.#cue_facility.cues
	}

	get root() {
		return this.#root
	}

	get wait() {
		return this.#update_promise ?? this.#update_promise_initial.promise
	}

	#render = () => {
		const root = this.#root
		const template = this.render()
		render(template, root, {host: this})
	}

	#render_debounced = debounce(0, this.#render)

	async update() {
		const promise = this.#render_debounced()

		if (!this.#update_promise)
			promise.then(this.#update_promise_initial.resolve)

		this.#update_promise = promise
		return promise
	}

	async requestUpdate() {
		await this.update()
	}

	connectedCallback() {
		this.update()
		this.#cue_facility.on_connected()
	}

	disconnectedCallback() {
		this.#cue_facility.on_disconnected()
	}

	render(): TemplateResult | void {
		return undefined
	}
}



import {CSSResultGroup, TemplateResult, render} from "lit"

import {debounce} from "../tools/debounce.js"
import {BaseElement} from "../base/element.js"
import {attributes} from "../base/utils/attributes.js"
import {explode_promise} from "../tools/explode_promise.js"
import {apply_styles_to_shadow} from "../base/utils/apply_styles_to_shadow.js"
import {cue_facility_for_element} from "../base/utils/cue_facility_for_element.js"

export class QuickElement extends HTMLElement implements BaseElement {
	#root: ShadowRoot
	#update_promise?: Promise<void>
	#cue_facility = cue_facility_for_element(this)
	#update_promise_initial = explode_promise<void>()

	static styles?: CSSResultGroup

	constructor() {
		super()
		this.#root = this.attachShadow({mode: "open"})
		apply_styles_to_shadow(this.#root, (this.constructor as typeof QuickElement).styles)
	}

	readonly attr = attributes(this)

	get cues() {
		return this.#cue_facility.cues
	}

	get root() {
		return this.#root
	}

	get wait() {
		return this.#update_promise ?? this.#update_promise_initial.promise
	}

	get updateComplete() {
		return this.wait
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


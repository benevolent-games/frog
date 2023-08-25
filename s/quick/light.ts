
import {TemplateResult, render} from "lit"

import {debounce} from "../tools/debounce.js"
import {BaseElement} from "../base/element.js"
import {explode_promise} from "../tools/explode_promise.js"

export class LightElement extends HTMLElement implements BaseElement {
	#init? = explode_promise<void>()
	#wait = this.#init!.promise

	init() {}

	constructor() {
		super()
		this.init()
	}

	get wait() {
		return this.#wait
	}

	get updateComplete() {
		return this.#wait
	}

	render(): TemplateResult | void {
		return undefined
	}

	#render_debounced = debounce(0, () => {
		const template = this.render()
		render(template, this, {host: this})
	})

	async update() {
		const promise = this.#render_debounced()

		if (this.#init) {
			promise.then(this.#init.resolve)
			this.#init = undefined
		}

		this.#wait = promise
		return promise
	}

	async requestUpdate() {
		await this.update()
	}

	connectedCallback() {
		this.update()
	}

	disconnectedCallback() {}
}


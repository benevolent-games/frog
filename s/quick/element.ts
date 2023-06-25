
import {debounce} from "@chasemoskal/magical"
import {TemplateResult, adoptStyles, html, render} from "lit"

import {BaseElement} from "../base/element.js"
import {explode_promise} from "../tools/explode_promise.js"
import {finalize_styles} from "../base/utils/finalize_styles.js"

export class QuickElement<S> extends HTMLElement implements BaseElement {
	#state!: S
	#root: ShadowRoot
	#update_promise?: Promise<void>
	#update_promise_initial = explode_promise<void>()

	constructor() {
		super()
		this.#root = this.attachShadow({mode: "open"})
		const styles = finalize_styles((this.constructor as any).styles)
		adoptStyles(this.#root, styles)
		this.state = this.init_state()
	}

	init_state() {
		return undefined as S
	}

	get root() {
		return this.#root
	}

	get state(): S {
		return this.#state
	}

	set state(s: S) {
		this.#state = s
		this.update()
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
	}

	disconnectedCallback() {}

	render(): TemplateResult | void {
		return html``
	}
}


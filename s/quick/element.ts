
import {CSSResultGroup, TemplateResult, render} from "lit"

import {debounce} from "../tools/debounce.js"
import {BaseElement} from "../base/element.js"
import {explode_promise} from "../tools/explode_promise.js"
import {apply_styles_to_shadow} from "../base/utils/apply_styles_to_shadow.js"

export class QuickElement extends HTMLElement implements BaseElement {
	static styles?: CSSResultGroup

	#root: ShadowRoot
	#init? = explode_promise<void>()
	#wait = this.#init!.promise

	#setups = new Set<() => () => void>()
	#setdowns: (() => void)[] = []
	setup(setup: () => () => void) {
		this.#setups.add(setup)
	}

	init() {}

	constructor() {
		super()
		this.#root = this.attachShadow({mode: "open"})
		apply_styles_to_shadow(this.#root, (this.constructor as typeof QuickElement).styles)
		this.init()
	}

	get root() {
		return this.#root
	}

	get wait() {
		return this.#wait
	}

	get updateComplete() {
		return this.wait
	}

	#render_debounced = debounce(0, () => {
		const root = this.#root
		const template = this.render()
		if (template)
			render(template, root, {host: this})
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
		for (const setup of this.#setups)
			this.#setdowns.push(setup())

		this.update()
	}

	disconnectedCallback() {
		for (const setdown of this.#setdowns)
			setdown()

		this.#setdowns = []
	}

	render(): TemplateResult | void {
		return undefined
	}
}


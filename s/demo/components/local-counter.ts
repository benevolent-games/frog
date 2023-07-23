
import {html} from "lit"

import {Context} from "../context.js"
import {common_styles} from "../common-styles.js"
import {QuickElement} from "../../quick/element.js"
import {attributes} from "../../base/addons/attributes.js"

export const LocalCounter = (_: Context) => class extends QuickElement {
	static styles = common_styles

	attr = attributes<{count: string}>(this as QuickElement)

	get count() {
		return this.attr.number.count ?? 0
	}

	#increment = () => {
		this.attr.number.count = this.count + 1
	}

	render() {
		return html`
			<p class=tag>&lt;local-counter&gt;</p>
			<p class=count>${this.attr.number.count}</p>
			<button @click=${this.#increment}>increment</button>
		`
	}
}


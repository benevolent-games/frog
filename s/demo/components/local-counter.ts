
import {html} from "lit"
import {common_styles} from "../common-styles.js"
import {QuickElement} from "../../quick/element.js"

export const LocalCounter = () => class extends QuickElement {

	static styles = common_styles

	count = this.cues.create(0)

	#increment = () => {
		this.count.value += 1
	}

	render() {
		return html`
			<p class=tag>&lt;local-counter&gt;</p>
			<p class=count>${this.count.value}</p>
			<button @click=${this.#increment}>increment</button>
		`
	}
}


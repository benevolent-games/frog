
import {html} from "lit"

import {Context} from "../context.js"
import {common_styles} from "../common-styles.js"
import {QuickElement} from "../../quick/element.js"

export const FlatCounter = (context: Context) => class extends QuickElement {
	static styles = common_styles

	#increment = () => {
		context.state.flatcount += 1
	}

	local = context.flat.state({
		localcount: 0,
	})

	#increment_local = () => {
		this.local.localcount += 1
	}

	render() {
		console.log("render")
		return html`
			<p class=tag>&lt;flat-counter&gt;</p>
			<p class=count>${context.state.flatcount}</p>
			<button @click=${this.#increment}>increment</button>
			<p class=count>${this.local.localcount}</p>
			<button @click=${this.#increment_local}>increment local</button>
		`
	}
}


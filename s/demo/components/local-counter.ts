
import {html} from "lit"
import {QuickElement} from "../../quick/element.js"
import {common_styles} from "../common-styles.js"

export const LocalCounter = () => class extends QuickElement<{count: number}> {

	static styles = common_styles

	init_state() {
		return {count: 0}
	}

	#increment = () => {
		const count = this.state.count += 1
		this.state = {...this.state, count}
	}

	render() {
		return html`
			<p class=tag>&lt;local-counter&gt;</p>
			<p class=count>${this.state.count}</p>
			<button @click=${this.#increment}>increment</button>
		`
	}
}



import {html} from "lit"
import {Context} from "../context.js"
import {common_styles} from "../common-styles.js"
import {QuickElement} from "../../quick/element.js"

export const AppCounterButton = (context: Context) => class extends QuickElement<void> {

	static styles = common_styles

	#increment = () => {
		context.count.value += 1
	}

	render() {
		return html`
			<p class=tag>&lt;app-counter-button&gt;</p>
			<button @click=${this.#increment}>increment</button>
		`
	}
}


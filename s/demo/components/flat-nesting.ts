
import {html} from "lit"

import {Context} from "../context.js"
import {common_styles} from "../common-styles.js"
import {QuickElement} from "../../quick/element.js"

export const FlatNesting = (context: Context) => class extends QuickElement {
	static styles = common_styles

	#add_egg = () => {
		context.state.nest = [
			...context.state.nest,
			context.flat.state({count: 0}),
		]
	}

	#increment = () => {
		const egg = context.state.nest.at(-1)
		if (egg)
			egg.count++
	}

	#weird = async() => {
		const [first] = context.state.nest
		context.state.nest = []
		await context.flat.wait
		await this.updateComplete
		if (first)
			first.count = 999
	}

	render() {
		return html`
			<p class=tag>&lt;flat-nesting&gt;</p>
			${context.state.nest.map(egg => egg.count.toString()).join(",")}
			<button @click=${this.#add_egg}>add_egg</button>
			<button @click=${this.#increment}>+</button>
			<button @click=${this.#weird}>?</button>
		`
	}
}


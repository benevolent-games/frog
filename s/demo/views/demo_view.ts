
import {css, html} from "lit"

import {theme} from "../theme.js"
import {Flat} from "../../flatstate/flat.js"
import {flipview} from "../../flipview/flipview.js"

export const DemoView = flipview({
	flat: new Flat(),
	name: "demo",
	render: use => (greeting: string) => {
		const state = use.state({count: 0})
		const increment = () => state.count++

		use.setup(() => {
			const interval = setInterval(increment, 1000)
			return () => clearInterval(interval)
		})

		return html`
			<p>${greeting}</p>
			<p>count: ${state.count}</p>
			<button @click=${increment}>increment</button>
		`
	},
	styles: [theme, css`
		:host {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 0.5em;
		}
	`],
})


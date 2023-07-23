
import {css, html} from "lit"

import {theme} from "../theme.js"
import {flatview} from "../../flatview/flatview.js"

export const DemoView = flatview({strict: true})

	.state({count: 0})

	.actions(state => ({
		increment() {
			state.count++
		}
	}))

	.setup(({actions}) => {
		// const interval = setInterval(actions.increment, 1000)
		// return () => clearInterval(interval)
		return () => {}
	})

	.render(({state, actions}) => (greeting: string) => html`
		<p>${greeting}</p>
		<p>count: ${state.count}</p>
		<button @click=${actions.increment}>increment</button>
	`)

	.css(theme, css`
		:host {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 0.5em;
		}
	`)


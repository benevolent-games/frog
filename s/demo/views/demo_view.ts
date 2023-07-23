
import {css, html} from "lit"

import {theme} from "../theme.js"
import {Flat} from "../../flatstate/flat.js"
import {flatview} from "../../view/flatview.js"

export const PlainView = flatview()
	.state()
	.actions()
	.setup()
	.render(() => () => html``)
	.css()

export const DemoView = flatview({flat: new Flat(), strict: true})
	.state({count: 0})
	.actions(state => ({
		increment() {
			state.count++
		}
	}))
	.setup(({actions}) => {
		const interval = setInterval(actions.increment, 1000)
		return () => clearInterval(interval)
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


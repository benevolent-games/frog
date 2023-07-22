
import {html} from "lit"
import {flatview} from "../../view/flatview.js"
import {Flat} from "../../flatstate/flat.js"

export const DemoView = flatview({flat: new Flat(), shadow: false, strict: true})
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
	.css()


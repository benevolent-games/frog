
import {html} from "lit"
import {Context} from "../context.js"
import {common_styles} from "../common-styles.js"
import {QuickElement} from "../../quick/element.js"

export const AppCounterDisplay = (context: Context) => class extends QuickElement {

	static styles = common_styles

	render() {
		return html`
			<p class=tag>&lt;app-counter-display&gt;</p>
			<p class=count>${context.count.value}</p>
		`
	}
}


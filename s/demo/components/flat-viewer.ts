
import {html} from "lit"

import {Context} from "../context.js"
import {DemoView} from "../views/demo_view.js"
import {common_styles} from "../common-styles.js"
import {QuickElement} from "../../quick/element.js"

export const FlatViewer = (_: Context) => class extends QuickElement {
	static styles = common_styles

	render() {
		return html`
			<p class=tag>&lt;flat-viewer&gt;</p>
			${DemoView({part: "demo", props: ["greetings"]})}
		`
	}
}


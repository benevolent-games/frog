
import {html} from "lit"
import {flatview} from "../../flatview/flatview.js"

export const PlainView = flatview()
	.state()
	.actions()
	.setup()
	.render(() => () => html``)
	.css()


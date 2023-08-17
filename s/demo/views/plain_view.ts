
import {html} from "lit"
import {Flat} from "../../flatstate/flat.js"
import {flipview} from "../../flipview/flipview.js"

export const PlainView = flipview({
	flat: new Flat(),
	name: "plain",
	styles: [],
	auto_exportparts: true,
	render: () => () => html``,
})


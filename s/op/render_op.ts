
import {Op} from "./op.js"
import {TemplateResult, html} from "lit"

export function render_op<X>(op: Op.For<X>, on_ready: (value: X) => TemplateResult | void) {
	return Op.select(op, {
		loading: () => html`..loading..`,
		error: reason => html`error! ${reason}`,
		ready: on_ready,
	})
}


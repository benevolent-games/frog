
import {CSSResultGroup, TemplateResult, render} from "lit"
import {apply_styles_to_shadow} from "../../base/utils/apply_styles_to_shadow.js"

export function make_view_root(css: CSSResultGroup | undefined) {
	const container = document.createElement("span")
	const shadow = container.attachShadow({mode: "open"})
	apply_styles_to_shadow(shadow, css)

	return {
		container,
		shadow,
		render_into_shadow(content: TemplateResult | void) {
			render(content, shadow)
			return container
		},
	}
}


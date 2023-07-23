
import {finalize_styles} from "../../base/utils/finalize_styles.js"
import {CSSResultGroup, TemplateResult, adoptStyles, render} from "lit"

export function make_view_root(css: CSSResultGroup | undefined) {
	const container = document.createElement("span")
	const shadow = container.attachShadow({mode: "open"})

	const styles = finalize_styles(css)
	adoptStyles(shadow, styles)

	return {
		container,
		shadow,
		render_into_shadow(content: TemplateResult | void) {
			render(content, shadow)
			return container
		},
	}
}


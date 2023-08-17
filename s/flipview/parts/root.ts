
import {ShadowableTag} from "./types.js"
import {CSSResultGroup, TemplateResult, render} from "lit"
import {apply_styles_to_shadow} from "../../base/utils/apply_styles_to_shadow.js"

export function make_view_root(
		tag: ShadowableTag,
		name: string,
		css: CSSResultGroup | undefined,
		on_render: (container: HTMLElement, shadow: ShadowRoot, name: string) => void,
	) {

	const container = document.createElement(tag)
	container.setAttribute("data-view", name)

	const shadow = container.attachShadow({mode: "open"})
	apply_styles_to_shadow(shadow, css)

	return {
		container,
		shadow,
		render_into_shadow(content: TemplateResult | void) {
			render(content, shadow)
			on_render(container, shadow, name)
			return container
		},
	}
}


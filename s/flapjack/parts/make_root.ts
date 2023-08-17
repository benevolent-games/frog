
import {ShadowableTag} from "../../flatview/flatview.js"
import {finalize_styles} from "../../base/utils/finalize_styles.js"
import {CSSResultGroup, CSSResultOrNative, TemplateResult, adoptStyles, render} from "lit"

export function make_root(
		type: "shadow" | "light",
		name: string | undefined,
		tag: ShadowableTag | undefined,
		css: CSSResultGroup | undefined,
	) {

	const container = document.createElement(tag ?? "div")
	container.setAttribute("data-view", name ?? "")

	const root = type === "shadow"
		? container.attachShadow({mode: "open"})
		: container

	if (css)
		apply_styles(root, css)

	return {
		container,
		root,
		render_into_root(content: TemplateResult | void) {
			render(content, root)
			if (type === "shadow")
				auto_export_parts(container, root, name)
			return container
		}
	}
}

function auto_export_parts(
		container: HTMLElement,
		root: HTMLElement | ShadowRoot,
		prefix: string | undefined,
	) {

	const gpart_elements = Array.from(root.querySelectorAll("[data-gparts]"))
	const part_elements = Array.from(root.querySelectorAll("[part]"))
	const exportpart_elements = Array.from(root.querySelectorAll("[exportparts]"))

	const exportparts = new Set<string>()
	const gparts = new Set<string>()

	for (const element of gpart_elements) {
		for (const gpart of element.getAttribute("data-gparts")!.split(/\s+/))
			if (gpart)
				gparts.add(gpart)
	}

	for (const element of part_elements) {
		for (const part of element.getAttribute("part")!.split(/\s+/))
			if (part)
				exportparts.add(part)
	}

	for (const element of exportpart_elements) {
		const exports = element.getAttribute("exportparts")!
			.split(",")
			.map(r => r.trim())
			.filter(r => !!r)

		const singles = exports
			.filter(e => !e.includes(":"))

		const doubles = exports
			.filter(e => e.includes(":"))

		for (const single of singles)
			exportparts.add(single)

		for (const double of doubles) {
			const [,part] = double.split(":").map(s => s.trim())
			exportparts.add(part)
		}
	}

	const exportparts2: string[] = []

	for (const part of exportparts) {
		const prefixed_part = prefix
			? `${part}:${prefix}-${part}`
			: part
		exportparts2.push(prefixed_part)
		if (gparts.has(part))
			exportparts2.push(part)
	}

	container.setAttribute("exportparts", exportparts2.join(", "))
	container.setAttribute("data-gparts", [...gparts].join(" "))
}

function apply_styles(
		root: HTMLElement | ShadowRoot,
		css: CSSResultGroup,
	) {

	const styles = finalize_styles(css)

	if (root instanceof ShadowRoot)
		adoptStyles(root, styles)
	else
		append_style_elements(root, styles)
}

function append_style_elements(
		root: HTMLElement,
		styles: CSSResultOrNative[],
	) {

	for (const style of styles) {
		const element = document.createElement("style")

		if (style instanceof CSSStyleSheet)
			write_stylesheet_to_style_element(
				element,
				style,
			)
		else
			element.textContent = style.cssText

		root.appendChild(element)
	}
}

function write_stylesheet_to_style_element(
		element: HTMLStyleElement,
		style: CSSStyleSheet,
	) {

	let text = ""

	for (const rule of Array.from(style.cssRules))
		text += rule.cssText;

	element.textContent = text
}


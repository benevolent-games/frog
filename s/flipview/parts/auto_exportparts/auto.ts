
import {parse_exportparts, parse_part, parse_prefixes, query_attributes, stitch_exportparts_together} from "./utils.js"

export function auto_exportparts(
		container: HTMLElement,
		root: HTMLElement | ShadowRoot,
	) {

	const prefixes = parse_prefixes(container.getAttribute("part"))

	const attrs = query_attributes(root, {
		part: "part",
		exportparts: "exportparts",
		gpart: "data-gpart",
		exportgparts: "data-exportgparts",
	})

	const parts = new Set<string>([
		...attrs.part.flatMap(parse_part),
		...attrs.exportparts.flatMap(parse_exportparts),
	])

	const gparts = new Set<string>([
		...attrs.gpart.flatMap(parse_part),
		...attrs.exportgparts.flatMap(parse_part),
	])

	container.setAttribute(
		"exportparts",
		[...prefixes]
			.flatMap(stitch_exportparts_together(parts, gparts))
			.join(", "),
	)

	container.setAttribute(
		"data-exportgparts",
		[...gparts].join(" "),
	)
}


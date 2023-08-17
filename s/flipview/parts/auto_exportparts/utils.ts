
export function parse_prefixes(part: string | null) {
	const prefixes = new Set<string>()

	const view_parts = (part ?? "")
		.split(/\s+/)
		.map(p => p.trim())
		.filter(p => !!p)

	for (const part of view_parts)
		prefixes.add(part)

	return prefixes
}

export function query_attributes<Q extends {[key: string]: string}>(
		container: HTMLElement | ShadowRoot,
		attributes: Q,
	) {

	return Object.fromEntries(
		Object.entries(attributes).map(([key, attr]) => [
			key,
			Array.from(container.querySelectorAll(`[${attr}]`))
				.map(e => e.getAttribute(attr)!),
		])
	) as any as {[P in keyof Q]: string[]}
}

export function parse_part(attr: string) {
	return attr
		.split(/\s+/)
		.map(s => s.trim())
		.filter(s => !!s)
}

export function parse_exportparts(attr: string) {
	return attr
		.split(",")
		.map(s => s.trim())
		.filter(s => !!s)
		.map(s => s.includes(":")
			? s.split(":").map(s => s.trim())[1]
			: s)
}

export function stitch_exportparts_together(parts: Set<string>, gparts: Set<string>) {
	return (
		(prefix: string) =>
			[...parts].flatMap(part => [
				`${part}:${prefix}-${part}`,
				...(gparts.has(part) ?[part] :[]),
			])
	)
}



export function auto_export_parts(
		container: HTMLElement,
		root: HTMLElement | ShadowRoot,
	) {

	const prefixes = new Set<string>()
	{
		const view_parts = (container.getAttribute("part") ?? "")
			.split(/\s+/)
			.map(p => p.trim())
			.filter(p => !!p)
		for (const part of view_parts)
			prefixes.add(part)
	}

	const part_elements = Array.from(root.querySelectorAll("[part]"))
	const exportpart_elements = Array.from(root.querySelectorAll("[exportparts]"))

	const gpart_elements = Array.from(root.querySelectorAll("[data-gpart]"))
	const exportgpart_elements = Array.from(root.querySelectorAll("[data-exportgparts]"))

	const exportparts = new Set<string>()
	const gparts = new Set<string>()

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

	////

	for (const element of gpart_elements) {
		for (const gpart of element.getAttribute("data-gpart")!.split(/\s+/))
			if (gpart)
				gparts.add(gpart)
	}

	for (const element of exportgpart_elements) {
		const exports = element.getAttribute("data-exportgparts")!
			.split(",")
			.map(r => r.trim())
			.filter(r => !!r)
		for (const gpart of exports) {
			gparts.add(gpart)
		}
	}

	////

	const exportparts2: string[] = []

	for (const part of exportparts) {
		for (const prefix of prefixes) {
			const prefixed_part = prefix
				? `${part}:${prefix}-${part}`
				: part
			exportparts2.push(prefixed_part)
			if (gparts.has(part))
				exportparts2.push(part)
		}
	}

	if (exportparts2.length)
		container.setAttribute("exportparts", exportparts2.join(", "))

	if (gparts.size)
		container.setAttribute("data-exportgparts", [...gparts].join(" "))
}



export function auto_export_parts(
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


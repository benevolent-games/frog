
import {render} from "lit"
import {FlatviewDetails} from "./types.js"

export function apply_details(element: HTMLElement, fresh: FlatviewDetails, old?: FlatviewDetails) {

	function actuate<V>(freshvalue: V, oldvalue: V, name: string, value: () => string) {
		if (freshvalue !== oldvalue) {
			if (freshvalue === undefined)
				element.removeAttribute(name)
			else
				element.setAttribute(name, value())
		}
	}

	actuate(fresh.class, old?.class, "class", () => fresh.class!)
	actuate(fresh.part, old?.part, "part", () => fresh.part!)
	// // TODO WUT DO!?
	// actuate(fresh.exportparts, old?.exportparts, "exportparts", () => fresh.exportparts!)

	if (fresh.content)
		render(fresh.content, element, {host: element})
}


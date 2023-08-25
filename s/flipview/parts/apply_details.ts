
import {render} from "lit"
import {FlipData} from "./types.js"

export function apply_details(element: HTMLElement, fresh: FlipData<any>, old?: FlipData<any>) {

	function actuate<V>(freshvalue: V, oldvalue: V, name: string, value: () => string) {
		if (freshvalue !== oldvalue) {
			if (freshvalue === undefined)
				element.removeAttribute(name)
			else
				element.setAttribute(name, value())
		}
	}

	actuate(
		fresh.class,
		old?.class,
		"class",
		() => fresh.class!,
	)

	actuate(
		fresh.part,
		old?.part,
		"part",
		() => fresh.part!,
	)

	actuate(
		fresh.gpart,
		old?.gpart,
		"data-gpart",
		() => fresh.gpart!,
	)

	if (fresh.content)
		render(fresh.content, element, {host: element})
}



import {render} from "lit"
import {FlipviewInput} from "./types.js"

export function apply_details(element: HTMLElement, fresh: FlipviewInput<any>, old?: FlipviewInput<any>) {

	function actuate<V>(freshvalue: V, oldvalue: V, name: string, value: () => string) {
		if (freshvalue !== oldvalue) {
			if (freshvalue === undefined)
				element.removeAttribute(name)
			else
				element.setAttribute(name, value())
		}
	}

	actuate(
		fresh.settings.class,
		old?.settings.class,
		"class",
		() => fresh.settings.class!,
	)

	actuate(
		fresh.settings.part,
		old?.settings.part,
		"part",
		() => fresh.settings.part!,
	)

	actuate(
		fresh.settings.gpart,
		old?.settings.gpart,
		"data-gpart",
		() => fresh.settings.gpart!,
	)

	if (fresh.content)
		render(fresh.content, element, {host: element})
}


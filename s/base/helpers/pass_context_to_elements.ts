
import {obtool} from "@chasemoskal/magical"
import {BaseElementClass} from "../element.js"

type ElementFuncs<C> = {[key: string]: (context: C) => BaseElementClass}

export function pass_context_to_elements<C, E extends ElementFuncs<C>>(
		context: C,
		elements: E,
	) {

	return obtool(elements).map(
		fun => fun(context)
	) as {[P in keyof E]: ReturnType<E[P]>}
}


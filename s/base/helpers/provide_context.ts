
import {obtool} from "../../tools/obtool.js"
import {BaseElementClass} from "../element.js"

type ElementFuncs<C> = {[key: string]: (context: C) => BaseElementClass}

export function provide_context<C>(context: C) {
	return <E extends ElementFuncs<C>>(elements: E) => obtool(elements).map(
		fun => fun(context)
	) as {[P in keyof E]: ReturnType<E[P]>}
}


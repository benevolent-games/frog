
import {obtool} from "@chasemoskal/magical"

import {Flat} from "../../flatstate/flat.js"
import {BaseElementClass} from "../element.js"
import {mixinFlatstate} from "../mixins/flatstate.js"

type Elements = {[key: string]: BaseElementClass}

export function mix_flatstate_reactivity_into_elements<E extends Elements>(
		flat: Flat,
		elements: E,
	) {

	return obtool(elements).map(
		(Element: any) => mixinFlatstate(flat)(Element)
	) as E
}


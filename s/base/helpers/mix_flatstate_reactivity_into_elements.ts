
import {obtool} from "@chasemoskal/magical"

import {BaseElementClass} from "../element.js"
import {mixinFlatstate} from "../mixins/flatstate.js"
import {Flatstate} from "../../flatstate/flatstate.js"

type Elements = {[key: string]: BaseElementClass}

export function mix_flatstate_reactivity_into_elements<E extends Elements>(
		flat: Flatstate,
		elements: E,
	) {

	return obtool(elements).map(
		(Element: any) => mixinFlatstate(flat)(Element)
	) as E
}


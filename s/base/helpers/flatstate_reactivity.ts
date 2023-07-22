
import {obtool} from "../../tools/obtool.js"
import {Elements} from "../utils/elements.js"
import {mixinFlatstate} from "../mixins/flatstate.js"
import {Flat} from "../../flatstate/flat.js"

export function flatstate_reactivity(flat: Flat) {
	return <E extends Elements>(elements: E) => obtool(elements).map(
		(Element: any) => mixinFlatstate(flat)(Element)
	) as E
}


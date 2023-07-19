
import {obtool} from "../../tools/obtool.js"
import {Elements} from "../utils/elements.js"
import {mixinFlatstate} from "../mixins/flatstate.js"
import {Flatstate} from "../../flatstate/flatstate.js"

export function flatstate_reactivity(flat: Flatstate) {
	return <E extends Elements>(elements: E) => obtool(elements).map(
		(Element: any) => mixinFlatstate(flat)(Element)
	) as E
}


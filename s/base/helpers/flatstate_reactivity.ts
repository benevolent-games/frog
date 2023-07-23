
import {Elements} from "../utils/types.js"
import {Flat} from "../../flatstate/flat.js"
import {obtool} from "../../tools/obtool.js"
import {mixinFlatstate} from "../mixins/flatstate.js"

export function flatstate_reactivity(flat: Flat) {
	return <E extends Elements>(elements: E) => obtool(elements).map(
		(Element: any) => mixinFlatstate(flat)(Element)
	) as E
}


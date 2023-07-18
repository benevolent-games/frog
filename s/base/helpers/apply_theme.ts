
import {CSSResultGroup} from "lit"
import {obtool} from "@chasemoskal/magical"

import {mixinCss} from "../mixins/css.js"
import {Elements} from "../utils/elements.js"

export const apply_theme = (theme: CSSResultGroup) => {
	return <E extends Elements>(elements: E) => obtool(elements).map(
		Element => mixinCss(theme)(Element)
	)
}


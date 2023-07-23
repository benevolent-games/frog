
import {CSSResultGroup} from "lit"

import {mixinCss} from "../mixins/css.js"
import {Elements} from "../utils/types.js"
import {obtool} from "../../tools/obtool.js"

export const apply_theme = (theme: CSSResultGroup) => {
	return <E extends Elements>(elements: E) => obtool(elements).map(
		Element => mixinCss(theme)(Element)
	)
}


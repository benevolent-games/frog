
import {obtool} from "@chasemoskal/magical"

import {mixinCues} from "../mixins/cues.js"
import {CueGroup} from "../../cues/group.js"
import {BaseElementClass} from "../element.js"

type Elements = {[key: string]: BaseElementClass}

export function cue_reactivity<E extends Elements>(
		cues: CueGroup,
		elements: E,
	) {

	return obtool(elements).map(
		(Element: any) => mixinCues(cues)(Element)
	) as E
}


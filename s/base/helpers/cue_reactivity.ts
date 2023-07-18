
import {obtool} from "@chasemoskal/magical"

import {mixinCues} from "../mixins/cues.js"
import {CueGroup} from "../../cues/group.js"
import {Elements} from "../utils/elements.js"

export function cue_reactivity(cues: CueGroup) {
	return <E extends Elements>(elements: E) => obtool(elements).map(
		(Element: any) => mixinCues(cues)(Element)
	) as E
}


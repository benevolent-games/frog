
import {obtool} from "@chasemoskal/magical"
import {Snapstate} from "@chasemoskal/snapstate"

import {mixinSnap} from "../mixins/snap.js"
import {Elements} from "../utils/elements.js"

export function snap_reactivity(snaps: Snapstate<any>[]) {
	return <E extends Elements>(elements: E) => obtool(elements).map(
		(Element: any) => mixinSnap(...snaps)(Element)
	) as E
}


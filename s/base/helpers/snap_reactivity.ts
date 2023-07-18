
import {obtool} from "@chasemoskal/magical"
import {Snapstate} from "@chasemoskal/snapstate"

import {mixinSnap} from "../mixins/snap.js"
import {BaseElementClass} from "../element.js"

type Elements = {[key: string]: BaseElementClass}

export function snap_reactivity<E extends Elements>(
		snaps: Snapstate<any>[],
		elements: E,
	) {

	return obtool(elements).map(
		(Element: any) => mixinSnap(...snaps)(Element)
	) as E
}


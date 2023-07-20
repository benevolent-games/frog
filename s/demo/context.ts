
import {CueGroup} from "../cues/group.js"
import {Flatstate} from "../flatstate/flatstate.js"

export class Context {
	cues = new CueGroup()
	count = this.cues.create(0)

	flat = new Flatstate()
	state = this.flat.state({
		flatcount: 0,
		nest: [] as {count: number}[],
	})
}


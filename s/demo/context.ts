
import {CueGroup} from "../cues/group.js"
import {Flat} from "../flatstate/flat.js"

export class Context {
	cues = new CueGroup()
	count = this.cues.create(0)

	flat = new Flat()
	state = this.flat.state({flatcount: 0})
}



import {CueGroup} from "../cues/group.js"

export class Context {
	cues = new CueGroup()
	count = this.cues.create(0)
}



import {Cue} from "./cue.js"
import {obtool} from "../tools/obtool.js"
import {debounce} from "../tools/debounce.js"

export class CueGroup {
	#cues = new Set<Cue<any>>()

	create<S>(s: S) {
		const cue = new Cue(s)
		this.#cues.add(cue)
		return cue
	}

	many<S extends {[key: string]: any}>(states: S) {
		return (
			obtool(states).map(state => this.create(state))
		) as any as {[P in keyof S]: Cue<S[P]>}
	}

	track(reader: () => any, actor: () => any) {
		const cues_that_were_accessed: Cue<any>[] = []
		const actuate = debounce(0, actor)

		for (const cue of this.#cues) {
			cue.accessed = false
			reader()
			if (cue.accessed)
				cues_that_were_accessed.push(cue)
		}

		const unsubscribe_functions = cues_that_were_accessed
			.map(cue => cue.subscribe(() => actuate()))

		return () => unsubscribe_functions
			.forEach(unsub => unsub())
	}
}


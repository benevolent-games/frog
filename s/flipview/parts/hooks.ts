
import {Use} from "./use.js"
import {Flat} from "../../flatstate/flat.js"

export function hooks(flat: Flat) {
	const counter = {count: 0}
	const states = new Map<number, {}>()
	const setdowns = new Map<number, () => void>()
	const use = new Use(
		flat,
		counter,
		states,
		setdowns,
	)

	return {
		use,
		setdown() {
			for (const [id, down] of [...setdowns.entries()]) {
				down()
				setdowns.delete(id)
			}
		},
		wrap<F extends (...args: any[]) => any>(fun: F) {
			return ((...args: any[]) => {
				counter.count = 0
				return fun(...args)
			}) as F
		},
	}
}


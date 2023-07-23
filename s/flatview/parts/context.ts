
import {FlatviewContext} from "./types.js"
import {Flat} from "../../flatstate/flat.js"

export function make_view_context<S extends {}, A extends {}>({
		flat,
		strict,
		initstate,
		initactions,
	}: {
		flat: Flat
		strict: boolean
		initstate: S
		initactions: (s: S) => A
	}): FlatviewContext<S, A> {

	const state = flat.state(initstate)
	const actions = initactions(state)

	return {
		actions,
		state: strict
			? Flat.readonly(state)
			: state,
	}
}



import {obtool} from "./obtool.js"

export type Requirement<X, Y> = (x: X) => Y

export function requirement<X>() {
	return function<Y>(fun: Requirement<X, Y>) {
		return fun
	}
}

requirement.provide = <X>(x: X) => (
	<Group extends {[key: string]: Requirement<X, any>}>(group: Group) => {
		return obtool(group)
			.map(lol => lol(x)) as {[P in keyof Group]: ReturnType<Group[P]>}
	}
)



import {obtool} from "./obtool.js"

export type Requirement<X, Y> = (x: X) => Y
export type GroupRequirement<X, Y> = {[key: string]: Requirement<X, Y>}

export type ProvideRequirement<R extends Requirement<any, any>> = ReturnType<R>
export type GroupProvideRequirement<G extends GroupRequirement<any, any>> = {
	[P in keyof G]: ProvideRequirement<G[P]>
}

/**
 * establish a pattern for creating many things that have a common requirement.
 *  - `const contextual = requirement<Context>()<Flipview<any>>`
 *  - now you can use `contextual` as a template for creating things that require context
 *  - `const MyView = contextual(context => flipview())`
 *  - in that example, the requirement enforces the types for context and the view
 */
export function requirement<X>() {
	return function<Y>(fun: Requirement<X, Y>) {
		return fun
	}
}

/**
 * provide a requirement to a group of things.
 */
requirement.provide = <X>(x: X) => (
	<G extends GroupRequirement<X, any>>(group: G) => (
		obtool(group).map(fun => fun(x)) as GroupProvideRequirement<G>
	)
)


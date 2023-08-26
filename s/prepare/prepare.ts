
import {CSSResultGroup} from "lit"

import {Pipe} from "../tools/pipe.js"
import {Flat} from "../flatstate/flat.js"
import {flipview} from "../flipview/flipview.js"
import {BaseElementClass} from "../base/element.js"
import {apply_theme} from "../base/helpers/apply_theme.js"
import {FlipRender, Flipview} from "../flipview/parts/types.js"
import {flatstate_reactivity} from "../base/helpers/flatstate_reactivity.js"
import {requirement, RequirementGroup, RequirementGroupProvided} from "../tools/requirement.js"

export type BaseContext = {flat: Flat, theme: CSSResultGroup}

export const prepare = <C extends BaseContext>(options: {
		default_auto_exportparts: boolean
	}) => {

	function component<E extends BaseElementClass>(fun: (context: C) => E) {
		return (context: C) => fun(context)
	}

	component.views = <V extends RequirementGroup<C, Flipview<any>>>(views: V) => ({
		element: <E extends BaseElementClass>(
				fun: (context: C) => (views: RequirementGroupProvided<V>) => E,
			) => (
			(context: C) => fun(context)(requirement.provide(context)(views))
		),
	})

	return ({
		component,

		components: <E extends RequirementGroup<C, BaseElementClass>>(e: E) => (
			(context: C) => (Pipe.with(e)
				.to(requirement.provide(context))
				.to(flatstate_reactivity(context.flat))
				.to(apply_theme(context.theme))
				.done() as RequirementGroupProvided<E>
			)
		),

		view: <V extends RequirementGroup<C, Flipview<any>>>(o: {
				views: V
				name: string
				styles: CSSResultGroup
				default_auto_exportparts?: boolean
			}) => ({
			render: <P extends any[]>(
					rend: (context: C) => (views: RequirementGroupProvided<V>) => FlipRender<P>
				) => (
				(context: C) => {
					const views = requirement.provide(context)(o.views)
					const {
						styles,
						default_auto_exportparts = options.default_auto_exportparts,
					} = o
					return flipview<P>({
						name: o.name,
						flat: context.flat,
						default_auto_exportparts,
						render: rend(context)(views),
						styles: [
							context.theme,
							...(Array.isArray(styles) ? styles : [styles]),
						],
					})
				}
			)
		}),

		views: <V extends RequirementGroup<C, Flipview<any>>>(
			context: C,
			viewgroup: V,
		) => requirement.provide(context)(viewgroup),
	})
}


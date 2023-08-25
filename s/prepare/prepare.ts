
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

export const prepare = <C extends BaseContext>() => (
	<E extends RequirementGroup<C, BaseElementClass>>(options: {
			elements: E
			views: {
				default_auto_exportparts: boolean
			}
		}) => ({

		component: () => requirement<C>()<BaseElementClass>,

		elements: (context: C) => (Pipe.with(options.elements)
			.to(requirement.provide(context))
			.to(flatstate_reactivity(context.flat))
			.to(apply_theme(context.theme))
			.done() as RequirementGroupProvided<E>
		),

		view: <V extends RequirementGroup<C, Flipview<any>>>(o: {
				name: string
				styles: CSSResultGroup
				views: V
				default_auto_exportparts?: boolean
			}) => ({
			render: <P extends any[]>(rend: (context: C, views: RequirementGroupProvided<V>) => FlipRender<P>) => (
				(context: C) => {
					const views = requirement.provide(context)(o.views)
					const {
						styles,
						default_auto_exportparts = options.views.default_auto_exportparts,
					} = o
					return flipview<P>({
						name: o.name,
						flat: context.flat,
						default_auto_exportparts,
						render: rend(context, views),
						styles: [
							context.theme,
							...(Array.isArray(styles) ? styles : [styles]),
						],
					})
				}
			)
		}),

		views: (context: C) => requirement.provide(context)<RequirementGroup<C, Flipview<any>>>,
	})
)


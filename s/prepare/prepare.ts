
import {CSSResultGroup, TemplateResult} from "lit"

import {Pipe} from "../tools/pipe.js"
import {Flat} from "../flatstate/flat.js"
import {flipview} from "../flipview/flipview.js"
import {BaseElementClass} from "../base/element.js"
import {apply_theme} from "../base/helpers/apply_theme.js"
import {FlipRender, Flipview} from "../flipview/parts/types.js"
import {flatstate_reactivity} from "../base/helpers/flatstate_reactivity.js"
import {requirement, Requirement, RequirementGroup, RequirementGroupProvided} from "../tools/requirement.js"
import { PrepperRender } from "../flipview/prepper.js"
import { FlipUse } from "../flipview/parts/use.js"

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

		view: <P extends any[]>(name: string, fun: Requirement<C, {
				styles: CSSResultGroup
				render: FlipRender<P>
				default_auto_exportparts?: boolean
			}>) => requirement<C>()<Flipview<P>>(context => {

			const {
				styles,
				render,
				default_auto_exportparts = options.views.default_auto_exportparts,
			} = fun(context)

			return flipview<P>({
				name,
				render,
				default_auto_exportparts,
				flat: context.flat,
				styles: [
					context.theme,
					...(Array.isArray(styles) ? styles : [styles]),
				],
			})
		}),

		view2: (
				name: string,
				{default_auto_exportparts = options.views.default_auto_exportparts}: {
					default_auto_exportparts?: boolean
				} = {},
			) => ({
			render: <P extends any[]>(render: PrepperRender<C, P>) => ({
				styles: (...styles: CSSResultGroup[]) => (context: C) => flipview<P>({
					name,
					flat: context.flat,
					default_auto_exportparts,
					render: (use: FlipUse) => (...props: P) => render(context)(use)(...props),
					styles: [
						context.theme,
						...(Array.isArray(styles) ? styles : [styles]),
					],
				}),
			}),
		}),

	})
)


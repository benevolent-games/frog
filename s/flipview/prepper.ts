
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./parts/use.js"
import {flipview} from "./flipview.js"
import {Flat} from "../flatstate/flat.js"

export type BaseContext = {flat: Flat, theme?: CSSResultGroup}

export type Render<C extends BaseContext, P extends any[]> = (
	(context: C) => (use: Use) => (...props: P) => (TemplateResult | void)
)

export type FlippyOptions = {
	auto_exportparts?: boolean
}

export function flipview_context_prepper<C extends BaseContext>() {
	return (name: string, {auto_exportparts = true}: FlippyOptions = {}) => ({
		render: <P extends any[]>(render: Render<C, P>) => ({
			styles: (...styles: CSSResultGroup[]) => (context: C) => flipview<P>({
				flat: context.flat,
				name,
				auto_exportparts,
				render: (use: Use) => (...props: P) => render(context)(use)(...props),
				styles: context.theme
					? [context.theme, ...styles]
					: styles,
			})
		})
	})
}


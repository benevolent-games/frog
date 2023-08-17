
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./parts/use.js"
import {flipview} from "./flipview.js"
import {Flat} from "../flatstate/flat.js"

export type BaseContext = {flat: Flat, theme?: CSSResultGroup}

export type Render<C extends BaseContext, P extends any[]> = (
	(context: C) => (use: Use) => (...props: P) => (TemplateResult | void)
)

export function flipview_context_prepper<C extends BaseContext>() {
	return (name: string) => ({
		render: <P extends any[]>(render: Render<C, P>) => ({
			styles: (...styles: CSSResultGroup[]) => (context: C) => flipview<P>({
				flat: context.flat,
				name,
				render: (use: Use) => (...props: P) => render(context)(use)(...props),
				styles: context.theme
					? [context.theme, ...styles]
					: styles,
			})
		})
	})
}


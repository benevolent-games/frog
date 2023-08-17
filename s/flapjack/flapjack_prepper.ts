
import {CSSResultGroup, TemplateResult} from "lit"

import {Flat} from "../flatstate/flat.js"
import {Use, flapjack} from "./flapjack.js"
import {ShadowableTag} from "../flatview/parts/types.js"

export type BaseContext = {flat: Flat, theme?: CSSResultGroup}

export type Render<C extends BaseContext, P extends any[]> = (
	(context: C) => (use: Use) => (...props: P) => (TemplateResult | void)
)

export function flapjack_prepper<C extends BaseContext>({type}: {
		type: "shadow" | "light",
	}) {
	return (tag: ShadowableTag, name: string) => ({
		render: <P extends any[]>(render: Render<C, P>) => ({
			styles: (...styles: CSSResultGroup[]) => (context: C) => flapjack<P>({
				flat: context.flat,
				type,
				tag,
				name,
				styles: (type === "shadow" && context.theme)
					? [context.theme, ...styles]
					: styles,
				render: render(context),
			})
		})
	})
}


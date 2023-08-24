
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./parts/use.js"
import {flipview} from "./flipview.js"
import {Flat} from "../flatstate/flat.js"

export type PrepperContext = {flat: Flat, theme?: CSSResultGroup}

export type PrepperRender<C extends PrepperContext, P extends any[]> = (
	(context: C) => (use: Use) => (...props: P) => (TemplateResult | void)
)

type Options = {
	default_auto_exportparts: boolean
}

export function flipview_prepper<C extends PrepperContext>(o: Options) {
	return (name: string, {default_auto_exportparts = o.default_auto_exportparts}: Partial<Options> = {}) => ({
		render: <P extends any[]>(render: PrepperRender<C, P>) => ({
			styles: (...styles: CSSResultGroup[]) => (context: C) => flipview<P>({
				name,
				flat: context.flat,
				default_auto_exportparts,
				render: (use: Use) => (...props: P) => render(context)(use)(...props),
				styles: context.theme
					? [context.theme, ...styles]
					: styles,
			})
		})
	})
}

export function flipview_prepper2<C extends PrepperContext>(
		options: {default_auto_exportparts: boolean}
	) {

	return <P extends any[]>(
			name: string,
			styles: CSSResultGroup,
			render: PrepperRender<C, P>
		) => (context: C) => flipview<P>({

		name,
		flat: context.flat,
		render: use => (...props) => render(context)(use)(...props),
		default_auto_exportparts: options.default_auto_exportparts,
		styles: context.theme
			? [context.theme, ...(Array.isArray(styles) ? styles : [styles])]
			: styles,
	})
}


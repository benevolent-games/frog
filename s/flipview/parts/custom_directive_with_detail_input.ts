
import {TemplateResult} from "lit"
import {DirectiveClass, DirectiveResult} from "lit/async-directive.js"
import {Flipview, FlipviewInput, FlipviewSettings} from "./types.js"

export const custom_directive_with_detail_input = (
	<C extends DirectiveClass>(c: C) => (
		(settings: FlipviewSettings = {}) => (...props: any[]) => (content?: TemplateResult): DirectiveResult<C> => ({
			['_$litDirective$']: c,
			values: [
				{props, settings, content} satisfies FlipviewInput<any>
			],
		})
	) as Flipview<any>
)



import {Flipview, FlipviewDetails, FlatviewInput} from "./types.js"
import {DirectiveClass, DirectiveResult} from "lit/async-directive.js"

export const custom_directive_with_detail_input = (
	<C extends DirectiveClass>(c: C) => (
		(details: FlipviewDetails = {}) => (...props: any[]): DirectiveResult<C> => ({
			['_$litDirective$']: c,
			values: [
				{props, details} satisfies FlatviewInput<any>
			],
		})
	) as Flipview<any>
)


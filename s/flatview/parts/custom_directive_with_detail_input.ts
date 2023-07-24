
import {Flatview, FlatviewDetails, FlatviewInput} from "./types.js"
import {DirectiveClass, DirectiveResult} from "lit/async-directive.js"

export const custom_directive_with_detail_input = (
	<C extends DirectiveClass>(c: C) => (
		(details: FlatviewDetails = {}) => (...props: any[]): DirectiveResult<C> => ({
			['_$litDirective$']: c,
			values: [
				{props, details} satisfies FlatviewInput<any>
			],
		})
	) as Flatview<any>
)


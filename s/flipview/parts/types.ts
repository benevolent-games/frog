
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./use.js"
import {Flat} from "../../flatstate/flat.js"

export type ShadowableTag = (
	| "article"
	| "aside"
	| "blockquote"
	| "body"
	| "div"
	| "footer"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "header"
	| "main"
	| "nav"
	| "p"
	| "section"
	| "span"
)

export type Flipview<P extends any[]> = (
	(details?: FlipviewDetails) => (...props: P) => TemplateResult | void
)

export type FlipviewDetails = {
	class?: string
	part?: string
	content?: TemplateResult
}

export type FlatviewInput<P extends any[]> = {
	props: P
	details: FlipviewDetails
}

export type FlipviewOptions<P extends any[]> = {
	flat: Flat
	tag: ShadowableTag
	name: string
	styles: CSSResultGroup
	render: (use: Use) => (...props: P) => TemplateResult | void
}


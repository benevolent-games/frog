
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
	(settings?: FlipviewSettings) =>
		(...props: P) =>
			(content?: TemplateResult) =>
				TemplateResult | void
)

export type FlipviewSettings = {
	class?: string
	part?: string
	"data-gpart"?: string
}

export type FlipviewInput<P extends any[]> = {
	props: P
	settings: FlipviewSettings
	content?: TemplateResult
}

export type FlipviewOptions<P extends any[]> = {
	flat: Flat
	tag: ShadowableTag
	name: string
	styles: CSSResultGroup
	render: (use: Use) => (...props: P) => TemplateResult | void
}


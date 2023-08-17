
import {CSSResultGroup, TemplateResult} from "lit"

import {Flat} from "../../flatstate/flat.js"
import {Use} from "../../flipview/parts/use.js"

export type FlipviewOptions<P extends any[]> = {
	flat: Flat
	type?: "shadow" | "light"
	styles: CSSResultGroup
	tag?: ShadowableTag
	name?: string
	render: (use: Use) => (...props: P) => TemplateResult | void
}

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

export type Flatview<P extends any[]> = (
	(details?: FlatviewDetails) => (...props: P) => TemplateResult | void
)

export type FlatviewOptions = {
	tag?: ShadowableTag
	strict?: boolean
	name?: string
}

export type FlatviewDetails = {
	class?: string
	part?: string
	exportparts?: string
	content?: TemplateResult
}

export type FlatviewInput<P extends any[]> = {
	props: P
	details: FlatviewDetails
}

export type FlatviewSetup<S extends {}, A extends {}> = (
	(context: FlatviewContext<S, A>) => () => void
)

export type FlatviewContext<S extends {}, A extends {}> = {
	state: S
	actions: A
}

export type FlatviewRenderer<S extends {}, A extends {}, P extends any[]> = (
	(context: FlatviewContext<S, A>) => (
		(...props: P) => TemplateResult | void
	)
)



import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./use.js"
import {Flat} from "../../flatstate/flat.js"

export type Flipview<P extends any[]> = (
	(settings?: FlipviewSettings) =>
		(...props: P) =>
			(content?: TemplateResult) =>
				TemplateResult | void
)

export type FlipviewSettings = {
	class?: string
	part?: string
	gpart?: string
}

export type FlipviewInput<P extends any[]> = {
	props: P
	settings: FlipviewSettings
	content?: TemplateResult
}

export type FlipviewOptions<P extends any[]> = {
	flat: Flat
	name: string
	styles: CSSResultGroup
	auto_exportparts: boolean
	render: (use: Use) => (...props: P) => TemplateResult | void
}


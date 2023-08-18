
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./use.js"
import {Flat} from "../../flatstate/flat.js"

export type FlipviewSettings = {
	class?: string
	part?: string
	gpart?: string
	auto_exportparts?: boolean
}

export type FlipviewData<P extends any[]> = FlipviewSettings & {
	props: P,
	content?: TemplateResult | void,
}

export type Flipview<P extends any[]> = (data: FlipviewData<P>) => (TemplateResult | void)

export type FlipviewOptions<P extends any[]> = {
	flat: Flat
	name: string
	styles: CSSResultGroup
	default_auto_exportparts: boolean
	render: (use: Use) => (...props: P) => TemplateResult | void
}


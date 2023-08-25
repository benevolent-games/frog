
import {CSSResultGroup, TemplateResult} from "lit"

import {FlipUse} from "./use.js"
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

export type FlipviewRender<P extends any[]> = (
	(use: FlipUse) => (...props: P) => (TemplateResult | void)
)

export type FlipviewOptions<P extends any[]> = {
	flat: Flat
	name: string
	styles: CSSResultGroup
	default_auto_exportparts: boolean
	render: FlipviewRender<P>
}

export type Flipview<P extends any[]> = (data: FlipviewData<P>) => (TemplateResult | void)

export type FlipUseSetupDetails<R> = {
	result: R
	setdown: () => void
}

export type FlipUseSetup<R> = () => FlipUseSetupDetails<R>


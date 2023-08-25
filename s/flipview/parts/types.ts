
import {CSSResultGroup, TemplateResult} from "lit"

import {FlipUse} from "./use.js"
import {Flat} from "../../flatstate/flat.js"

export type FlipSettings = {
	class?: string
	part?: string
	gpart?: string
	auto_exportparts?: boolean
}

export type FlipData<P extends any[]> = FlipSettings & {
	props: P,
	content?: TemplateResult | void,
}

export type FlipRender<P extends any[]> = (
	(use: FlipUse) => (...props: P) => (TemplateResult | void)
)

export type FlipOptions<P extends any[]> = {
	flat: Flat
	name: string
	styles: CSSResultGroup
	default_auto_exportparts: boolean
	render: FlipRender<P>
}

export type Flipview<P extends any[]> = (data: FlipData<P>) => (TemplateResult | void)

export type FlipSetupDetails<R> = {
	result: R
	setdown: () => void
}

export type FlipSetup<R> = () => FlipSetupDetails<R>


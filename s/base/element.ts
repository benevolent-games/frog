
import {CSSResultGroup, TemplateResult} from "lit"

export type BaseElement = HTMLElement & {
	connectedCallback(): void
	disconnectedCallback(): void
	render(): TemplateResult | void
	requestUpdate(): Promise<void>
}

export type BaseElementClass = {
	new(...args: any[]): BaseElement
	styles?: CSSResultGroup
}


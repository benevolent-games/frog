
import {TemplateResult} from "lit"
import {Flat} from "../../flatstate/flat.js"

export type FlatviewContext<S extends {}, A extends {}> = {state: S, actions: A}

export type FlatviewRenderer<S extends {}, A extends {}, P extends any[]> = (
	(context: FlatviewContext<S, A>) => (...props: P) => TemplateResult | void
)

export type FlatviewOptions = {
	flat?: Flat
	strict?: boolean
}

export type Flatview<P extends any[]> = (...props: P) => TemplateResult | void

export type FlatviewSetup<S extends {}, A extends {}> = (context: FlatviewContext<S, A>) => () => void


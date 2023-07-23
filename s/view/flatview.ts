
import {directive} from "lit/directive.js"
import {AsyncDirective} from "lit/async-directive.js"
import {CSSResultArray, CSSResultGroup, Part, TemplateResult, adoptStyles, render} from "lit"

import {Flat} from "../flatstate/flat.js"
import {finalize_styles} from "../base/utils/finalize_styles.js"

export type FlatviewContext<S extends {}, A extends {}> = {state: S, actions: A}

export type FlatviewRenderer<S extends {}, A extends {}, P extends any[]> = (
	(context: FlatviewContext<S, A>) => (...props: P) => TemplateResult | void
)

export type FlatviewOptions = {
	flat?: Flat
	strict?: boolean
}

export type Flatview<P extends any[]> = {
	(...props: P): TemplateResult<any> | void
	add_css(css: CSSResultGroup): void
}

export type FlatviewDeferredFlat<P extends any[]> = (flat: Flat) => Flatview<P>
export type FlatviewDeferredCss<P extends any[]> = (...css: CSSResultArray) => Flatview<P>

export type FlatviewGroup = {
	[key: string]: Flatview<any>
}

export type UnwrapDeferredFlatviewGroup<F extends {[key: string]: (...args: any[]) => Flatview<any>}> = {
	[P in keyof F]: ReturnType<F[P]>
}

export type FlatviewSetup<S extends {}, A extends {}> = (context: FlatviewContext<S, A>) => () => void

function final<S extends {}, A extends {}, P extends any[]>({
		css,
		setup,
		renderer,
		initstate,
		initactions,
		flat = new Flat(),
		strict = false,
	}: FlatviewOptions & {
		initstate: S
		initactions: (s: S) => A
		setup: FlatviewSetup<S, A>
		renderer: FlatviewRenderer<S, A, P>
		css?: CSSResultGroup
	}) {

	const state = flat.state(initstate)
	const actions = initactions(state)

	const o = {
		actions,
		state: strict
			? Flat.readonly(state)
			: state,
	}

	const realize = renderer(o)

	const root = (() => {
		const container = document.createElement("span")
		const shadow = container.attachShadow({mode: "open"})

		const styles = finalize_styles(css)
		adoptStyles(shadow, styles)

		return {
			container,
			shadow,
			render(content: TemplateResult | void) {
				render(content, shadow)
				return container
			},
		}
	})()

	return directive(class extends AsyncDirective {
		#recent_props?: P
		#unsetup?: void | (() => void)
		#stop?: () => void

		update(_: Part, props: P) {
			return root.render(this.render(...props))
		}

		render(...props: P) {
			if (!this.#unsetup)
				this.#unsetup = setup(o)

			this.#recent_props = props

			if (this.#stop)
				this.#stop()

			let result: TemplateResult | void = undefined

			this.#stop = flat.manual({
				debounce: true,
				discover: false,
				collector: () => {
					result = realize(...props)
				},
				responder: () => {
					this.setValue(
						root.render(this.render(...this.#recent_props!))
					)
				},
			})

			return result
		}

		disconnected() {
			if (this.#stop) {
				this.#stop()
				this.#stop = undefined
			}
			if (this.#unsetup) {
				this.#unsetup()
				this.#unsetup = undefined
			}
		}
	}) as Flatview<P>
}

export function flatview(options: FlatviewOptions = {}) {
	return {
		state: <S extends {}>(initstate: S = {} as any) => ({
			actions: <A extends {}>(initactions: (state: S) => A = () => ({} as any)) => ({
				setup: (setup: FlatviewSetup<S, A> = () => () => {}) => ({
					render: <P extends any[]>(renderer: FlatviewRenderer<S, A, P>) => ({
						css: (...css: CSSResultArray) => (
							final<S, A, P>({...options, initstate, initactions, setup, renderer, css})
						)
					})
				})
			})
		})
	}
}


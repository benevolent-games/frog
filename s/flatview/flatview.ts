
import {CSSResultArray} from "lit"
import {Flat} from "../flatstate/flat.js"
import {make_view_directive} from "./parts/directive.js"
import {FlatviewOptions, FlatviewRenderer, FlatviewSetup} from "./parts/types.js"

export * from "./parts/types.js"

export const flatview = (
		flat: Flat = new Flat(),
		{strict = true}: FlatviewOptions = {},
	) => ({

	state: <S extends {}>(initstate: S = {} as any) => ({

		actions: <A extends {}>(
				initactions: (state: S) => A = () => ({} as any)
			) => ({

			setup: (setup: FlatviewSetup<S, A> = () => () => {}) => ({

				render: <P extends any[]>(renderer: FlatviewRenderer<S, A, P>) => ({

					css: (...css: CSSResultArray) => (

						make_view_directive<S, A, P>({
							flat,
							strict,
							initstate,
							initactions,
							setup,
							renderer,
							css,
						})
					)
				})
			})
		})
	})
})


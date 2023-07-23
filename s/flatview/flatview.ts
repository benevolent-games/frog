
import {CSSResultArray} from "lit"
import {make_view_directive} from "./parts/directive.js"
import {FlatviewOptions, FlatviewRenderer, FlatviewSetup} from "./parts/types.js"

export {Flatview, FlatviewOptions, FlatviewSetup, FlatviewContext, FlatviewRenderer} from "./parts/types.js"

export const flatview = (options: FlatviewOptions = {}) => ({

	state: <S extends {}>(initstate: S = {} as any) => ({

		actions: <A extends {}>(initactions: (state: S) => A = () => ({} as any)) => ({

			setup: (setup: FlatviewSetup<S, A> = () => () => {}) => ({

				render: <P extends any[]>(renderer: FlatviewRenderer<S, A, P>) => ({

					css: (...css: CSSResultArray) => (

						make_view_directive<S, A, P>({
							...options,
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


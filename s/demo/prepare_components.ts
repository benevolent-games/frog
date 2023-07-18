
import {css} from "lit"

import {Context} from "./context.js"
import {Pipe} from "../tools/pipe.js"
import {FlatCounter} from "./components/flat-counter.js"
import {LocalCounter} from "./components/local-counter.js"
import {apply_theme} from "../base/helpers/apply_theme.js"
import {AppCounterButton} from "./components/app-counter-button.js"
import {AppCounterDisplay} from "./components/app-counter-display.js"
import {provide_context} from "../base/helpers/provide_context.js"
import {cue_reactivity} from "../base/helpers/cue_reactivity.js"
import {flatstate_reactivity} from "../base/helpers/flatstate_reactivity.js"

export const elements = {
	LocalCounter,
	AppCounterButton,
	AppCounterDisplay,
	FlatCounter,
}

export const default_theme = css`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
`

export function prepare_components(context: Context, theme = default_theme) {
	return new Pipe(elements)
		.to(elements => provide_context(context, elements))
		.to(elements => cue_reactivity(context.cues, elements))
		.to(elements => flatstate_reactivity(context.flat, elements))
		.to(elements => apply_theme(theme, elements))
		.done()
}



import {css} from "lit"

import {Context} from "./context.js"
import {Pipe} from "../tools/pipe.js"
import {FlatCounter} from "./components/flat-counter.js"
import {LocalCounter} from "./components/local-counter.js"
import {theme_elements} from "../base/helpers/theme_elements.js"
import {AppCounterButton} from "./components/app-counter-button.js"
import {AppCounterDisplay} from "./components/app-counter-display.js"
import {pass_context_to_elements} from "../base/helpers/pass_context_to_elements.js"
import {update_elements_on_cue_changes} from "../base/helpers/update_elements_on_cue_changes.js"
import {mix_flatstate_reactivity_into_elements} from "../base/helpers/mix_flatstate_reactivity_into_elements.js"

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
		.to(elements => pass_context_to_elements(context, elements))
		.to(elements => update_elements_on_cue_changes(context.cues, elements))
		.to(elements => mix_flatstate_reactivity_into_elements(context.flat, elements))
		.to(elements => theme_elements(theme, elements))
		.done()
}


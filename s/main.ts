
import {registerElements} from "@chasemoskal/magical"

import {Context} from "./demo/context.js"
import {prepare_components} from "./demo/prepare_components.js"

registerElements(
	prepare_components(new Context())
)

console.log("🐸")


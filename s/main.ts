
import {Context} from "./demo/context.js"
import {prepare_components} from "./demo/prepare_components.js"
import {register_elements} from "./base/helpers/register_elements.js"

register_elements(
	prepare_components(new Context())
)

console.log("🐸")


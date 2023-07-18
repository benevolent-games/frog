
import {Context} from "./demo/context.js"
import {prepare_components} from "./demo/prepare_components.js"
import {register_to_dom} from "./base/helpers/register_to_dom.js"

register_to_dom(
	prepare_components(new Context())
)

console.log("🐸")


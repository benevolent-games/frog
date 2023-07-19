
import {ForbiddenWriteFlatstateError} from "./errors.js"

export function readable<S extends {}>(s: S) {
	return new Proxy(s, {

		get(target, key: string) {
			return target[key as keyof S]
		},

		set(_, key: string) {
			throw new ForbiddenWriteFlatstateError(key)
		},
	})
}


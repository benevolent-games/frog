
import {BaseElement} from "../../base/element.js"

type AnyAttrs = {[key: string]: string}
type AttrsFor<A extends AnyAttrs, V> = {[P in keyof A]: V}

/**
 * @deprecated please use `attrs` instead
 */
export function attributes<A extends AnyAttrs>(element: BaseElement) {
	const observer = new MutationObserver(() => element.requestUpdate())
	observer.observe(element, {attributes: true})

	function low_level_attribute_proxy<V>({read, write}: {
			read: (name: string) => V | void
			write: (name: string, value: V) => void
		}) {
		return new Proxy({}, {
			get: (_, name: string) => read(name),
			set: (_, name: string, value: any) => {
				write(name, value)
				return true
			},
		}) as AttrsFor<A, V>
	}

	function simple_attribute_conversion_proxy<V>({to, from}: {
			to: (v: V) => string
			from: (s: string) => V
		}) {
		return low_level_attribute_proxy<V>({
			read: name => {
				const string = element.getAttribute(name)
				return (string === null)
					? undefined
					: from(string)
			},
			write: (name, value) => {
				if (value === undefined || value === null)
					element.removeAttribute(name)
				else
					element.setAttribute(name, to(value))
			},
		}) as AttrsFor<A, V>
	}

	return {

		string: simple_attribute_conversion_proxy<string>({
			to: s => s,
			from: s => s,
		}),

		number: simple_attribute_conversion_proxy<number>({
			to: n => n.toString(),
			from: s => Number(s),
		}),

		boolean: low_level_attribute_proxy<boolean>({
			read: name => element.hasAttribute(name),
			write: (name, value) => {
				if (value)
					element.setAttribute(name, "")
				else
					element.removeAttribute(name)
			},
		}),
	}
}


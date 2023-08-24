
import {BaseElement} from "../element.js"

type Strings = {[key: string]: string}

export class Attrs<A extends Strings> {

	static base<A extends Strings>(element: BaseElement) {
		return new this<A>(element, () => element.requestUpdate())
	}

	#element: HTMLElement

	constructor(element: HTMLElement, on_change: () => void) {
		this.#element = element
		const observer = new MutationObserver(on_change)
		observer.observe(element, {attributes: true})
	}

	#setty(name: string, str: string | void) {
		if (str === undefined || str === null)
			this.#element.removeAttribute(name)
		else
			this.#element.setAttribute(name, str)
	}

	string = ezproxy<string>({
		read: name => this.#element.getAttribute(name) ?? undefined,
		write: (name, str) => this.#setty(name, str),
	}) as AttrFor<string, A>

	number = ezproxy<number>({
		read: name => Number(this.#element.getAttribute(name) ?? 0),
		write: (name, num) => this.#setty(name, num?.toString()),
	}) as AttrFor<number, A>

	boolean = ezproxy<boolean>({
		read: name => this.#element.hasAttribute(name),
		write: (name, bool) => {
			if (bool)
				this.#element.setAttribute(name, "")
			else
				this.#element.removeAttribute(name)
		},
	}) as AttrFor<boolean, A>
}

type AttrFor<T, A> = {[P in keyof A]: T}

function ezproxy<T>({read, write}: {
		read: (name: string) => T | undefined,
		write: (name: string, value: T | void) => void,
	}) {

	return new Proxy({}, {
		get: (_, name: string) => read(name),
		set: (_, name: string, value: T | void) => {
			write(name, value)
			return true
		},
	})
}


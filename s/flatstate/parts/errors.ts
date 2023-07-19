
export class FlatstateError extends Error {
	name = this.constructor.name
}

export class CircularFlatstateError extends FlatstateError {
	constructor(key: string) {
		super(`forbidden circularity, rejected assignment to "${key}"`)
	}
}

export class ForbiddenWriteFlatstateError extends FlatstateError {
	constructor(key: string) {
		super(`forbidden write to readonly state, rejected assignment to "${key}"`)
	}
}


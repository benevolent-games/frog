
export namespace Op {
	export type Mode = "loading" | "err" | "ready"
	export type Loading = {mode: "loading"}
	export type Err = {mode: "err", reason: string}
	export type Ready<X> = {mode: "ready", payload: X}

	export type Any<X> = Loading | Err | Ready<X>
	export type Setter<X> = (op: Any<X>) => void

	export const loading = (): Loading => ({mode: "loading"})
	export const err = (reason: string): Err => ({mode: "err", reason})
	export const ready = <X>(payload: X): Ready<X> => ({mode: "ready", payload})

	export const is = Object.freeze({
		loading: (op: Any<any>) => op.mode === "loading",
		err: (op: Any<any>) => op.mode === "err",
		ready: (op: Any<any>) => op.mode === "ready",
	})

	export function payload<X>(op: Any<X>) {
		return (op.mode === "ready")
			? op.payload
			: undefined
	}

	type Choices<X, R> = {
		loading: () => R
		err: (reason: string) => R
		ready: (payload: X) => R
	}

	export function select<X, R>(op: Any<X>, choices: Choices<X, R>) {
		switch (op.mode) {

			case "loading":
				return choices.loading()

			case "err":
				return choices.err(op.reason)

			case "ready":
				return choices.ready(op.payload)

			default:
				console.error("op", op)
				throw new Error("invalid op mode")
		}
	}

	export async function run<X>(set_op: Setter<X>, fun: () => Promise<X>) {
		set_op(loading())

		try {
			const payload = await fun()
			set_op(ready(payload))
		}
		catch (error) {
			const reason = (error instanceof Error)
				? error.message
				: (typeof error === "string")
					? error
					: "error"
			set_op(err(reason))
		}
	}
}


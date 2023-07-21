
export function collectivize<S>(state: S) {
	return function<D>(collector: (state: S) => D) {
		return () => collector(state)
	}
}


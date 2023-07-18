
export function maptool<K, V>(map: Map<K, V>) {
	return new MapTool(map)
}

export function weakmaptool<K extends {}, V>(map: WeakMap<K, V>) {
	return new MapTool<K, V>(map as Map<K, V>)
}

export class MapTool<K, V> {
	constructor(public readonly map: Map<K, V>) {}

	grab(key: K, make: () => V) {
		const {map} = this
		if (map.has(key))
			return map.get(key)!
		else {
			const value = make()
			map.set(key, value)
			return value
		}
	}
}


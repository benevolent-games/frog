
export type Collector<S> = () => S
export type Responder<S> = (substate: S) => void

export type Keytracks = Map<Collector<any>, Set<void | Responder<any>>>
export type Keymap = Map<string, Keytracks>
export type Trackers = WeakMap<{}, Keymap>

export type ActiveTracking = Map<{}, Set<string>>


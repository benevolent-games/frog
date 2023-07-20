
export type Fun = () => void
export type Collector = Fun
export type Responder = Fun

export type Keymap = Map<string, Set<Responder>>
export type Trackers = WeakMap<{}, Keymap>

export type ActiveTracking = Map<{}, Set<string>>


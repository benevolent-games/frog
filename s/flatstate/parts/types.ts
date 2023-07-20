
export type Fun = () => void
export type Collector = Fun
export type Responder = Fun

export type Keytracks = Map<Collector, Set<Responder>>
export type Keymap = Map<string, Keytracks>
export type Trackers = WeakMap<{}, Keymap>

export type ActiveTracking = Map<{}, Set<string>>


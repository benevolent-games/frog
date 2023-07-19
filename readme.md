
![](./assets/frog-circle.webp)

# 🐸 frog – frontend web framework

🕹️ live demo: https://frog.benev.gg/  
📦 frog is an npm package: [`@benev/frog`](https://www.npmjs.com/package/@benev/frog)  
📜 documentation coming sooner or later..  
❤️ frog is free and open source  

<br/>

## 🥞 flatstate

- flatstate helps you create state objects and reaction functions which are called when properties change.

- flatstate is inspired by mobx and snapstate, but designed to be really simple: flatstate only works on *flat* state objects, only the direct properties of state objects are tracked for reactivity.

### flatstate basics

- create a flatstate tracking context
  ```ts
  import {Flatstate} from "@benev/frog"

  const flat = new Flatstate()
  ```
- make a flat state object
  ```ts
  const state = flat.state({count: 0})
  ```
- setup a reaction
  ```ts
  flat.reaction(() => console.log(state.count))
    //-> 0

  state.count++
    //-> 1
  ```
  - flatstate records which state properties your reaction reads
  - flatstate calls your reaction whenever those specific properties change
  - your reaction can listen to more than one state object

### flatstate details

- reactions are debounced -- so you may have to wait to see state changes
  ```ts
  const flat = new Flatstate()
  const state = flat.state({amount: 100})

  state.amount = 101
  console.log(state.amount) //-> 100 (old value)

  await flat.wait
  console.log(state.amount) //-> 101 (now it's ready)
  ```
- you can stop a reaction
  ```ts
  const stop = flat.reaction(() => console.log(state.count))

  stop() // end this particular reaction
  ```
- clear all reactions on a flatstate instance
  ```ts
  // clear all reactions on this flat instance
  flat.clear()
  ```

### flatstate advanced

- multiple flatstate instances are totally isolated from each other
  ```ts
  const flat1 = new Flatstate()
  const flat2 = new Flatstate()
  ```
- create readonly access to a state object
  ```ts
  const state = flat.state({count: 0})
  const rstate = Flatstate.readable(state)

  state.count = 1
  await flat.wait
  console.log(rstate.count) //-> 1

  rstate.count = 2 //!! ForbiddenWriteFlatstateError
  ```

### flatstate integration with frontend elements

- let your components rerender on flat state changes
  ```ts
  import {flatstate_reactivity} from "@benev/frog"

  const elements = flatstate_reactivity(flat)(elements)
  ```

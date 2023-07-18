
![](./assets/frog-circle.webp)

# 🐸 frog – frontend web framework

🕹️ live demo: https://frog.benev.gg/  
📦 frog is an npm package: [`@benev/frog`](https://www.npmjs.com/package/@benev/frog)  
📜 documentation coming sooner or later..  
❤️ frog is free and open source  

<br/>

## 🥞 flatstate

flatstate helps you create state objects and reaction functions which are called when properties change.

flatstate is inspired by mobx and snapstate, but designed to be really simple: flatstate only works on *flat* state objects, only the direct properties of state objects are tracked for reactivity.

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
  flat.reaction(() => console.log("count", state.count))
    //-> count 0

  state.count++
    //-> count 1
  ```
  - flatstate records which state properties your reaction reads
  - flatstate calls your reaction whenever those specific properties change
  - your reaction can listen to more than one state object
- let your components rerender on flat state changes
  ```ts
  import {mix_flatstate_reactivity_into_elements} from "@benev/frog"

  const elements = mix_flatstate_reactivity_into_elements(flat, elements)
  ```

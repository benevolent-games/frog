
![](./assets/frog-circle.webp)

# 🐸 frog – frontend web framework

🕹️ live demo: https://frog.benev.gg/  
📦 frog is an npm package: [`@benev/frog`](https://www.npmjs.com/package/@benev/frog)  
📜 documentation coming sooner or later..  
❤️ frog is free and open source  

<br/>

## flatstate

- create a flatstate context
  ```ts
  import {Flatstate} from "@benev/frog"

  const flat = new Flatstate()
  ```
- make a state object
  ```ts
  const state = flat.state({
    count: 0,
  })
  ```
- setup a reaction
  ```ts
  flat.reaction(() => console.log("count", state.count))
    //-> count 0

  state.count++
    //-> count 1
  ```
- mix flatstate updates into your elements
  ```ts
  import {mix_flatstate_reactivity_into_elements} from "@benev/frog"

  const elements = mix_flatstate_reactivity_into_elements(flat, elements)
  ```

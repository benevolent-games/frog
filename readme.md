
![](./assets/frog-circle.webp)

# 🐸 frog – frontend web framework

🕹️ live demo: https://frog.benev.gg/  
📦 frog is an npm package: [`@benev/frog`](https://www.npmjs.com/package/@benev/frog)  
📜 documentation coming sooner or later..  
❤️ frog is free and open source  

<br/>
<br/>

## 🥞 Flatstate

flatstate helps you create state objects and reaction functions which are called when properties change.

flatstate is inspired by mobx and snapstate, but designed to be really simple: flatstate only works on *flat* state objects, only the direct properties of state objects are tracked for reactivity.

### flatstate basics

- create a flatstate tracking context
  ```ts
  import {Flat} from "@benev/frog"

  const flat = new Flat()
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
  const flat = new Flat()
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

### flatstate reactions

- so first, there's a simple one-function reaction:
  ```ts
  flat.reaction(() => console.log(state.count))
  ```
  - flatstate immediately runs the function, and records which properties it reads
  - then, anytime one of those properties changes, it runs your function again
- you can also do a two-function reaction:
  ```ts
  flat.reaction(
    () => ({count: state.count}),
    ({count}) => console.log(count),
  )
  ```
  - now there's a separation between your "collector" and your "responder"
  - the collector "passes" relevant data to the responder function
  - flatstate calls the responder whenever that data changes
- there's also this helper called "collectivize" if you prefer the syntax sugar:
  ```ts
  const c = Flat.collectivize(state)

  flat.reaction(
    c(({count}) => ({count})),
    ({count}) => console.log(count)
  )
  ```
- there's also something called "deepReaction"
  ```ts
  flat.deepReaction(() => console.log(state.count))
  ```
  - it's the same as "reaction", but it has "discovery" enabled
  - discovery means the collector is checked again for every responder call
  - it's less efficient, but allows you to respond to deeply nested recursive structures
- there's also `.auto` and `.manual` reactions
  - these allow you to set options like `discovery` and `debounce` (you can turn off the debouncer)
  - but that's bigbrain stuff that you'll have to read the sourcecode about

### flatstate advanced

- multiple flatstate instances are totally isolated from each other
  ```ts
  const flat1 = new Flat()
  const flat2 = new Flat()
  ```
- create readonly access to a state object
  ```ts
  const state = flat.state({count: 0})
  const rstate = Flat.readonly(state)

  state.count = 1
  await flat.wait
  console.log(rstate.count) //-> 1

  rstate.count = 2 // !! ReadonlyError !!
  ```
  - btw, you can use readonly on anything, not just flatstate

### flatstate integration with frontend elements

- let your components rerender on flat state changes
  ```ts
  import {flatstate_reactivity} from "@benev/frog"

  const elements = flatstate_reactivity(flat)(elements)
  ```

<br/>
<br/>

## 🪈 Pipe

- pipe data through a series of functions
- maybe you've done silly nesting like this:
  ```ts
  // bad
  register_to_dom(
    mixin_flatstate_reactivity(flat)(
      apply_theme(theme)(
        provide_context(context)(elements)
      )
    )
  )
  ```
- now you can do this instead:
  ```ts
  import {Pipe} from "@benev/frog"

  // good
  Pipe.with(elements)
    .to(provide_context(context))
    .to(apply_theme(theme))
    .to(flatstate_reactivity(flat))
    .to(register_to_dom)
  ```

<br/>
<br/>

## 💫 Op

utility for ui loading/err/ready states.

useful for implementing async operations that involve loading indicators.

- ops are just plain objects, and they have a `mode` string (loading/err/ready)
  ```ts
  import {Op} from "@benev/frog"

  console.log(Op.make.loading())
    //-> {mode: "loading"}

  console.log(Op.make.err("a fail occurred"))
    //-> {mode: "err", reason: "a fail occurred"}

  console.log(Op.make.ready(123))
    //-> {mode: "ready", payload: 123}
  ```
- you can run an async operation that will update your op accordingly
  ```ts
  let my_op = Op.make.loading()

  await Op.run(op => my_op = op, async() => {
    await nap(1000)
    return 123
  })
  ```
- functions to interrogate an op
  ```ts
    //        type for op in any mode
    //                 v
  function lol(op: Op.Any<number>) {

    // branching based on the op's mode
    Op.select(op, {
      loading: () => console.log("op is loading"),
      err: reason => console.log("op is err", reason),
      ready: payload => console.log("op is ready", payload)
    })

    const payload = Op.payload(op)
      // if the mode=ready, return the payload
      // otherwise, return undefined
  }
  ```

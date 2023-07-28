
- flatview
  - (!) flatview usage syntax changed:
    - used to be like `DemoView("hello")`
    - is now like `DemoView()("hello")`
    - you can pass exportparts and part into the first parens
    - like this `DemoView({part: "button", exportparts: "a"})("hello")`
  - (!) add `tag` option to flatview
    - default is now `div` (was `span`)
  - add `name` option to flatview
    - it appears on the element as `data-view`
- op
  - (!) rename stuff in Op
    - `err` renamed to `error`
    - `Op.Any<any>` renamed to `Op.For<any>`

## v0.3.0 – 2023-07-23

- (!) flatview signature changes
  - `flat` now comes first, like `flatview(flat, {strict: true})`
  - `strict` is now `true` by default (was false)
- (!) gutted `QuickElement`
  - cues ripped out of QuickElement
  - attributes addon ripped out QuickElement
  - goal is to make quickelement agnostic about state management etc
  - added `add_setup` method, which make it easy to create setups/setdowns
  - added overridable `init() {}` method, runs in constructor
- export `Elements` type
- export `attributes` addon for base elements
- add `apply_styles_to_shadow`

## v0.2.0 – 2023-07-22

- (!) rename `Flatstate` to `Flat`
- add `flatview`
- add `requirement` tool

## v0.1.0 – 2023-07-19

- (!) rework and rename all the base element helpers
  - now they all use curry syntax, intended to be used with `Pipe`
    - old syntax:
      ```ts
      theme_elements(theme, pass_context_to_elements(context, elements))
      ```
    - new syntax:
      ```ts
      apply_theme(theme)(provide_context(context)(elements))
      ```
    - but you should really use pipes now:
      ```ts
      Pipe.with(elements)
        .to(provide_context(context))
        .to(apply_theme(theme))
      ```
  - renames
    - `mix_flatstate_reactivity_into_elements` 🡪 `flatstate_reactivity`
    - `pass_context_to_elements` 🡪 `provide_context`
    - `register_elements` 🡪 `register_to_dom`
    - `theme_elements` 🡪 `apply_theme`
    - `update_elements_on_cue_changes` 🡪 `cue_reactivity`
    - `update_elements_on_snap_changes` 🡪 `snap_reactivity`
- (!) remove `Op.make`
  - `Op.make.loading` is now just `Op.loading`
  - `Op.make.err` is now just `Op.err`
  - `Op.make.ready` is now just `Op.ready`

## v0.0.1 - 2023-07-18

- add flatstate
- add op
- add pipe


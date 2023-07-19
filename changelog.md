
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


# com.pantrixui:annotations

Annotations that describe a Pantrix UI component and its examples.

## Paket com.pantrixui.annotations

### PantrixComponent

`import com.pantrixui.annotations.PantrixComponent`, `com.pantrixui:annotations` içinden

```kotlin
annotation class PantrixComponent(
    public val name: String,
    public val category: String,
    public val description: String,
    public val keywords: Array<String>
)
```

Marks a composable as a Pantrix component and describes it for tooling.

Every component carries one, on its primary overload, with two or more `PantrixExample`s, and a new component gets them in the same change. At build time the demo catalogue counts them, detekt's `UnmarkedComponent` checks that every component carries them, and the documents for coding assistants are written from them (docs/guide/ai/AI_GUIDE.md): a component's name, group, description and keywords are what an assistant is told of it first, and its examples what it copies. They are written with the component because the description is cheapest to capture from the person who wrote it, while the reasons are still in their head: one written later says what the code does rather than what the component is for.

Binary retention, so a tool can read them from a published klib as well as from sources in the same build.

Parametreler:

- `name: String`: the component's name without the `Pantrix` prefix, e.g. `Button`
- `category: String`: the package group under `com.pantrixui.components` it lives in, e.g. `elements`
- `description: String`: one sentence on what it is for, not how it is drawn
- `keywords: Array<String>`: the words someone looking for the component would use that its name does not say, so that a search finds it by them: what other design systems and platforms call it, and what it is used for, e.g. `toast` and `undo` for a snackbar. Three to eight, in English and in lower case; a keyword of more than one word has a space between them. The documents for coding assistants stop the build on a component that gives none.

### PantrixExample

`import com.pantrixui.annotations.PantrixExample`, `com.pantrixui:annotations` içinden

```kotlin
annotation class PantrixExample(
    public val title: String,
    public val code: String
)
```

A usage example for a `PantrixComponent`. Repeatable: a component carries two or more.

`code` is a snippet a reader could paste into a composable, not a complete file. User-facing text in it comes from resources rather than string literals, because examples are what gets copied. The compiler never reads `code`: the documents for coding assistants check, at every build, that each argument it gives by name to the library's own functions and constructors is a parameter of one of their forms, and the rest is kept in step with the component's signature by hand.

Parametreler:

- `title: String`: what the example shows, in a few words
- `code: String`: the snippet

### PantrixComponentPart

`import com.pantrixui.annotations.PantrixComponentPart`, `com.pantrixui:annotations` içinden

```kotlin
annotation class PantrixComponentPart(
    public val of: String
)
```

Marks a public composable as a part of a component, in place of `PantrixComponent`: a variant of it, or a piece that is only used inside it, such as a menu's item or a divider drawn across.

A part has no examples of its own: its component's examples show it. detekt's `UnmarkedComponent` accepts it where it would ask for a `PantrixComponent`.

Parametreler:

- `of: String`: the name of the component it belongs to, without the `Pantrix` prefix, e.g. `Menu`

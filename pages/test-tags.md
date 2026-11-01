# Test tags

The tag automation finds a component by: `Section.Component_key`. The tag comes from a key that is the same in every language, not from the visible text: the tests do not break when the app opens in another language.

## Features

- **Key.** A component's `tagKey`, and in a form-bound component the field's `id`: `PantrixButton(tagKey = "pay")` becomes `Button_pay`. Left out, a key is derived from the place of the call.
- **Section.** `TestScope("Checkout") { … }` puts the section's name in front of the tags in it; nested sections join: `Checkout.Payment.Button_pay`. `LocalTestScope` is the section at that point.
- **Policy.** `TestTagPolicy.Stable` tags, `Off` tags nothing; `PantrixTheme(testTagPolicy = …)` or `LocalTestTagPolicy`.
- **Your own component.** `rememberPantrixTestTag(component, tagKey)` gives a tag by the same rule, `Modifier.pantrixTestTag(tag)` sets it. The key of a control built on a component is `derivedTagKey`.
- **What a test looks for.** `pantrixTestTagOf(component, tagKey, scope)` gives the tag a component carries with a key and in a section, without building the screen: a test or a device automation flow looks for this tag.

## Examples

### A button in a section

A button's tag inside two sections. The button was given only `tagKey = "pay"`; the sections (`TestScope`) put their names in front of the tag. The line underneath builds the same tag with `rememberPantrixTestTag("Button", "pay")`, and reads the section from `LocalTestScope` and the policy from `LocalTestTagPolicy`.

```kotlin
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.LocalTestScope
import com.pantrixui.foundation.testing.LocalTestTagPolicy
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

TestScope("Checkout") {
    TestScope("Payment") {
        PantrixButton(text = "Pay", onClick = {}, tagKey = "pay")
        val tag = rememberPantrixTestTag(component = "Button", tagKey = "pay")
        PantrixText(
            text = "Tag: $tag · section: ${LocalTestScope.current} · policy: ${LocalTestTagPolicy.current.name}",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Your own component's tag

The app's own component is tagged by the same rule: `PriceRow` builds its tag with `rememberPantrixTestTag` and sets it with `pantrixTestTag`. The button in it is built on the row: its key is `derivedTagKey("total", "edit")`, `total_edit`. The line underneath writes the tags.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.derivedTagKey
import com.pantrixui.foundation.testing.pantrixTestTag
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

PriceRow(label = "Total", amount = "TRY 1,240", tagKey = "total")

@Composable
private fun PriceRow(
    label: String,
    amount: String,
    tagKey: String
) {
    val tag = rememberPantrixTestTag(component = "PriceRow", tagKey = tagKey)
    val editKey = derivedTagKey(tagKey, "edit")
    Row(
        modifier = Modifier.pantrixTestTag(tag),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = "$label: $amount")
        PantrixButton(text = "Edit", onClick = {}, tagKey = editKey)
    }
    PantrixText(
        text = "Row: $tag · the button's key: $editKey",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}
```

### A release with no tags

A release with no tags: a theme given `TestTagPolicy.Off` puts no tag in the tree. A component still knows its tag, and its events go with it: `rememberPantrixTestTag` builds the tag, `Modifier.pantrixTestTag` does not put it in the tree. A `Modifier.testTag` the app sets itself still stays: for the few tags an outside tool expects.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.TestTagPolicy
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

PantrixTheme(testTagPolicy = TestTagPolicy.Off) {
    val tag = rememberPantrixTestTag(component = "Button", tagKey = "save")
    PantrixText(text = "The events' tag: $tag · in the tree: none", style = PantrixTheme.typography.footnote)
}
```

### The tag a test looks for

The tag a test looks for, without building the screen: `pantrixTestTagOf("Button", "Save draft", scope = "Editor")`. The key goes into the tag in small letters, with `_` in the place of what is not a letter or a digit: `Editor.Button_save_draft`. It is the tag the button carries on the screen too.

```kotlin
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.testing.pantrixTestTagOf
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

TestScope("Editor") {
    PantrixButton(text = "Save draft", onClick = {}, tagKey = "Save draft")
    val carried = rememberPantrixTestTag(component = "Button", tagKey = "Save draft")
    val lookedFor = pantrixTestTagOf(component = "Button", tagKey = "Save draft", scope = "Editor")
    PantrixText(
        text = "Looked for: $lookedFor · carried: $carried",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}
```

## API

### TestScope

`import com.pantrixui.foundation.testing.TestScope`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun TestScope(
    name: String,
    content: @Composable () -> Unit
)
```

Names a screen or section so tags inside it are qualified: `TestScope("LoginScreen") { ... }`.

Nesting concatenates, which is what makes a tag readable in a test failure without the reader having to know where in the tree the component sat.

Parameters:

- `name: String`: the screen's or the section's name, put before the tags inside it: `LoginScreen.Button_save`.
- `content: @Composable () -> Unit`: the screen or the section, whose components' tags `name` qualifies.

### LocalTestScope

`import com.pantrixui.foundation.testing.LocalTestScope`, from `com.pantrixui:foundation`

```kotlin
val LocalTestScope: ProvidableCompositionLocal<String?>
```

The enclosing `TestScope` chain, e.g. `Checkout.PaymentForm`.

### TestTagPolicy

`import com.pantrixui.foundation.testing.TestTagPolicy`, from `com.pantrixui:foundation`

```kotlin
enum class TestTagPolicy
```

Whether components put their automation tags in the semantics tree, where tests and the platform's UI automation find them, and what they build a tag from.

Entries:

- `Stable`: The key — `tagKey`, or the field id in form-bound overloads — then the call-site key.
- `Off`: Pantrix puts no tag in the semantics tree. A component still knows its tag, and its analytics events carry it: a release build that keeps its tags out of the tree still tells its events apart. A `Modifier.testTag` the app sets itself is unaffected, which is how a release build keeps the few tags an external tool depends on.

### LocalTestTagPolicy

`import com.pantrixui.foundation.testing.LocalTestTagPolicy`, from `com.pantrixui:foundation`

```kotlin
val LocalTestTagPolicy: ProvidableCompositionLocal<TestTagPolicy>
```

Whether the components here put their automation tags in the semantics tree: `PantrixTheme(testTagPolicy = …)`. Its readers follow it: a tag's node takes its tag out of the tree, or puts it back, when the policy around it changes.

### rememberPantrixTestTag

`import com.pantrixui.foundation.testing.rememberPantrixTestTag`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberPantrixTestTag(
    component: String,
    tagKey: String? = null
): String
```

Produces a component's automation tag: `Scope.Component_key`.

The key is `tagKey` — form-bound overloads pass their field's id — and without one, the call-site key: `Scope.Component#1k3z9`. **Visible text is never a source**: a tag derived from translated text changes when the app runs in another language, which silently breaks every automation suite the moment a second locale ships.

There is deliberately no parameter for a finished tag. A caller that must match an id an external suite already uses sets it with Compose's own `Modifier.testTag` in the component's `modifier`, which replaces this tag in the semantics tree.

The tag is built whatever the `TestTagPolicy`: the component's analytics events carry it either way, and `pantrixTestTag` puts it in the semantics tree only while the policy is `TestTagPolicy.Stable`.

Parameters:

- `component: String`: component name, e.g. `Button`
- `tagKey: String?`: a locale-independent developer key, e.g. `save`: written in small letters and digits, of which the tag carries the first `MAX_TAG_KEY_LENGTH`. The key of a control built on this one is made with `derivedTagKey`.

### Modifier.pantrixTestTag

`import com.pantrixui.foundation.testing.pantrixTestTag`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.pantrixTestTag(tag: String?): Modifier
```

Sets `tag` as the test tag while the `TestTagPolicy` where it stands is `TestTagPolicy.Stable`, and nothing while it is `TestTagPolicy.Off` or for null: no node at all is added to the semantics tree then.

While the theme's diagnostics are on, a tag that two nodes of the window carry for a second and a half is reported as `PantrixCheck.DuplicateTestTag`: a test that looks for it would find them both. A page transition, which shows the page that goes and the one that comes with the same tags, is over before then.

Parameters:

- `tag: String?`

### derivedTagKey

`import com.pantrixui.foundation.testing.derivedTagKey`, from `com.pantrixui:foundation`

```kotlin
fun derivedTagKey(
    tagKey: String,
    part: String
): String
```

The key of a control that another control is built on: the select of a page size, the menu of a breadcrumb. It is the outer control's own `tagKey` and, after it, `part`, the name of the inner one: `orders` and `page_size` are `orders_page_size`, and the select is tagged `Select_orders_page_size`.

A tag carries no more than the first `MAX_TAG_KEY_LENGTH` characters of a key. Joined by hand, a long key would lose the part's name to that cut, and two parts of one control would come to the same key. Here the outer key is what gives way: it is cut as short as leaves `part` whole.

Parameters:

- `tagKey: String`: the outer control's key, as its caller wrote it.
- `part: String`: what the inner control is in the outer one, in the letters a key is written in: `page_size`.

### pantrixTestTagOf

`import com.pantrixui.foundation.testing.pantrixTestTagOf`, from `com.pantrixui:foundation`

```kotlin
fun pantrixTestTagOf(
    component: String,
    tagKey: String,
    scope: String? = null
): String
```

The automation tag a component given `tagKey` carries inside `scope`: what a test, or a flow of the platform's UI automation, finds it by. A `Button` given `save` is `Button_save`, and inside `TestScope("Checkout")` it is `Checkout.Button_save`. `rememberPantrixTestTag` builds a keyed tag with this, so a tag built here is the one the component carries.

Parameters:

- `component: String`: the component's name, e.g. `Button`.
- `tagKey: String`: the key the component was given, as its caller wrote it: the tag writes it in small letters and digits, as the component does.
- `scope: String?`: the chain of `TestScope`s the component stands in, e.g. `Checkout.PaymentForm`; null outside one.

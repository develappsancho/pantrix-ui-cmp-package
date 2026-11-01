# Diagnostics Inspector

What the theme's diagnostics have found, over the app: a button with the number of findings, and on its press a list; the node of the finding chosen in the list is outlined on the screen. This app is under one too: the button at the bottom right is for the app's own findings.

- `PantrixDiagnosticsInspector` (`com.pantrixui.components.overlay.inspector`, `com.pantrixui:components`): What a theme's diagnostics have found, shown over the app: a button with their number, a list of them, and an outline around the node of the one chosen. Keywords: debug overlay, accessibility checker, findings list, dev tools, audit.

## Features

- **It wraps the app.** `PantrixDiagnosticsInspector(findings) { App() }`: the content is laid out as it would be without it, and gets every press.
- **Unseen while nothing is found.** The button comes with the first finding and goes when the list is cleared.
- **Outline.** The node of the finding chosen in the list is outlined until the screen is next pressed; a finding without a node says that it is not on the screen.
- **Where it stands.** `alignment` chooses the button's corner; the default is the bottom of the end edge.

## Usage

### Over the screen of a debug build

```kotlin
val findings = remember { PantrixFindings(then = PantrixDiagnostics.Log) }
PantrixTheme(diagnostics = if (debug) findings else PantrixDiagnostics.Off) {
    if (debug) PantrixDiagnosticsInspector(findings) { App() } else App()
}
```

### Its button at the top, beside a bar's actions

```kotlin
PantrixDiagnosticsInspector(findings, alignment = Alignment.TopEnd, tagKey = "inspector") {
    Screen()
}
```

## Examples

### Over a screen

A screen with two findings: a button in a pale colour and an icon button with a blank name. Press the button at the bottom right, and choose a finding in the list: its node is outlined.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.inspector.PantrixDiagnosticsInspector
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixDiagnosticsInspector(findings, modifier = Modifier.height(240.dp), tagKey = "orders") {
        Screen(tagKey = "orders")
    }
}

@Composable
private fun Screen(tagKey: String) {
    PantrixCard(modifier = Modifier.fillMaxSize(), variant = CardVariant.Outlined) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixText(text = "Orders", style = PantrixTheme.typography.headline)
            PantrixText(text = "Three orders are waiting to be sent.")
            PantrixButton(
                text = "Send",
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonColors(container = Color(0xFFFFE082), content = Color.White),
                tagKey = "${tagKey}_send"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "",
                onClick = {},
                tagKey = "${tagKey}_more"
            )
        }
    }
}
```

### Its button at the top

The button at the top, where it can stand beside a bar's actions.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.inspector.PantrixDiagnosticsInspector
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixDiagnosticsInspector(
        findings,
        modifier = Modifier.height(240.dp),
        alignment = Alignment.TopEnd,
        tagKey = "orders_top"
    ) {
        Screen(tagKey = "orders_top")
    }
}

@Composable
private fun Screen(tagKey: String) {
    PantrixCard(modifier = Modifier.fillMaxSize(), variant = CardVariant.Outlined) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixText(text = "Orders", style = PantrixTheme.typography.headline)
            PantrixText(text = "Three orders are waiting to be sent.")
            PantrixButton(
                text = "Send",
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonColors(container = Color(0xFFFFE082), content = Color.White),
                tagKey = "${tagKey}_send"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "",
                onClick = {},
                tagKey = "${tagKey}_more"
            )
        }
    }
}
```

## API

### PantrixDiagnosticsInspector

`import com.pantrixui.components.overlay.inspector.PantrixDiagnosticsInspector`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixDiagnosticsInspector(
    findings: PantrixFindings,
    modifier: Modifier = Modifier,
    alignment: Alignment = Alignment.BottomEnd,
    tagKey: String? = null,
    content: @Composable () -> Unit
)
```

Shows over an app what its theme's diagnostics have found: a button with the number of findings, and on its press a sheet that lists them, each with its check, where it was found and what puts it right. A finding chosen in the list is outlined where its node stands, until the screen is next pressed. While nothing has been found, nothing is shown.

It holds the app's screen: `content` is laid out as it would be without it, and gets every press, the one that takes an outline away among them. A release build leaves it out, as it leaves the diagnostics off.

Parameters:

- `findings: PantrixFindings`: what the theme's diagnostics have found: the `diagnostics` of the theme around `content`.
- `modifier: Modifier`: applied to the box that holds `content` and the inspector over it.
- `alignment: Alignment`: where the button stands over `content`.
- `tagKey: String?`: a locale-independent key for automation: the inspector's tag is `DiagnosticsInspector_<tagKey>`, and its button's, its list's and its findings' are made from the key.
- `content: @Composable () -> Unit`: the app's screen.

# Showcase Scaffold

A screen that stands outside the app's shell: sign in, sign up, a password reset, an invitation, a welcome, a page not found. A showcase stands on one side, a picture, a quote or slides, and the form on the other. In a narrow room only the form is left. The screens on this page stand inside a bordered surface; the card's window picker shows the same screen narrow and wide.

- `PantrixShowcaseScaffold` (`com.pantrixui.components.container.showcase`, `com.pantrixui:components`): A screen outside the app's shell, sign in or sign up: a showcase on one side and the form on the other, only the form in a narrow room. Keywords: sign in, login, sign up, auth screen, onboarding, split screen, marketing.

## Features

- **Showcase.** `showcase` stands beside the form once the scaffold is as wide as `showcaseFrom`, Expanded by default; `showcaseSide` says which side it stands on. In a narrower room it is not composed at all: its slides do not turn and its pictures are not loaded. The scaffold goes by its own width, not the window's.
- **The showcase's background.** `showcaseBackground` fills the showcase to its edges, a picture or a gradient, under the system's bars; what `showcase` holds keeps clear of them. `scrim` deepens the background so that what is written on it reads. The showcase is drawn in its own colours (`ShowcaseScaffoldColors`).
- **Form.** `content` is the form, in the middle of its side and no wider than the style's form width. `header` stands above it, a heading; `footer` under it, a way to sign up. `formLayout` keeps the three together in the middle of the side's height, or apart: the header at the top, the footer at the foot.
- **Bars.** `topBar` is a row across the top of the form's side, a logo at its start and a language at its end; `bottomBar` a row across its foot, a line of copyright. They stay where they are as the form scrolls between them. Where the showcase is not shown, a line parts each bar from the form; a bar with nothing in it takes no room. Each knows whether the showcase is shown (`showcaseShown`): the logo the showcase carries in a wide window moves to the start of the top bar in a narrow one.
- **Frame.** With `ShowcaseFrame.Adaptive`, from Large on, the scaffold is a card in the middle of `backdrop`; a card with no showcase is the form's width and as tall as what it holds. In a narrower window, and with `ShowcaseFrame.Edge` at every width, it reaches the window's edges.
- **Foldable.** At an upright fold the showcase is in one half and the form in the other; the two meet at the fold. At a fold lying across only the form is left.
- **Room and keyboard.** The scaffold stands outside the shell, so it keeps clear of the system's bars and the display's cut-out itself (`windowInsets`). Only the form's side scrolls; it ends above the keyboard, and a field that takes the focus stays in view.
- **What it remembers.** The form and the showcase are each composed in one place whatever the layout: what is typed in a field and a slide's place stay as a phone is turned on its side or the window widens into a card. Type in a field and switch the window picker from "Narrow" to "Wide".
- **The window's title, screen reader, event and tags.** `title` is not drawn: it is the window's and the tab's name, and the screen's name for a screen reader. The form is read first, and takes the focus first, wherever the showcase stands. A screen given a `tagKey` reports a `show` event each time it opens; what is put in it is inside `TestScope(tagKey)`.

## Usage

### Sign in beside a quote

```kotlin
PantrixShowcaseScaffold(
    showcase = { Testimonial(quote) },
    title = stringResource(Res.string.sign_in),
    topBar = {
        if (!showcaseShown) AppLogo()
        Spacer(Modifier.weight(1f))
        LanguageMenu(language, onLanguageChange)
    },
    footer = { SignUpInstead(onSignUp) },
    bottomBar = { if (!showcaseShown) Copyright() },
    tagKey = "sign_in"
) {
    SignInForm(form, onSignIn)
}
```

### A card on a picture, the showcase at the end

```kotlin
PantrixShowcaseScaffold(
    showcase = { Highlights(features) },
    showcaseBackground = { Image(painterResource(Res.drawable.mountains), null, contentScale = ContentScale.Crop) },
    backdrop = { Image(painterResource(Res.drawable.mountains), null, contentScale = ContentScale.Crop) },
    showcaseSide = ShowcaseSide.End,
    scrim = ShowcaseScrim.Bottom,
    tagKey = "sign_up"
) {
    SignUpForm(form, onSignUp)
}
```

## Examples

### Signing in to an admin panel

An admin panel's sign-in screen. The showcase is navy and reaches the edges (`frame = ShowcaseFrame.Edge`): the logo at the top, a customer's words in the middle, the figures and the copyright line at the bottom. The language menu stands at the end of the form side's top bar (`topBar`); the chosen language has a check beside it (`PantrixMenuItem`'s `selected`). Switch the window picker to "Short" or "Wide": the showcase comes beside the form. In "Narrow" the showcase goes; the logo moves to the start of the top bar and the copyright line into the bottom bar (`bottomBar`), each looking at whether the showcase is shown (`showcaseShown`), and a line parts each bar from the form. "Sign in" is enabled once both fields are filled.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.showcase.ShowcaseFrame
import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = { AdminShowcase() },
        title = "Sign in",
        topBar = {
            if (!showcaseShown) Logo()
            Spacer(Modifier.weight(1f))
            LanguageMenu()
        },
        footer = { SignUpInstead() },
        bottomBar = { if (!showcaseShown) Copyright(inABar = true) },
        frame = ShowcaseFrame.Edge,
        // The example is not a window but a box in the page: the room of the system's bars is the app's.
        windowInsets = WindowInsets(0),
        colors = ShowcaseScaffoldColors(showcase = NAVY, showcaseContent = Color.White),
        tagKey = "admin_sign_in"
    ) {
        SignInForm()
    }
}

@Composable
private fun AdminShowcase() {
    Column(modifier = Modifier.fillMaxSize()) {
        Logo()
        Spacer(Modifier.weight(1f))
        PantrixText(
            text = "“Pantrix changed how we understand our mobile users. The insights we gained helped us increase " +
                "retention by 40 percent in three months.”",
            style = PantrixTheme.typography.title.copy(fontStyle = FontStyle.Italic)
        )
        PantrixText(text = "— Head of product, a game studio", modifier = Modifier.padding(top = 12.dp))
        Spacer(Modifier.weight(1f))
        Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
            Figure(value = "10M+", label = "Events tracked")
            Figure(value = "500+", label = "Active projects")
            // How a percentage is written depends on the language; with no letters in it, the translation file does not know it.
            Figure(value = said(tr = "%99,9", en = "99.9%"), label = "Uptime")
        }
        Copyright(modifier = Modifier.padding(top = 24.dp))
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun Copyright(
    modifier: Modifier = Modifier,
    inABar: Boolean = false
) {
    PantrixText(
        text = "© 2026 Pantrix. All rights reserved. by @developersancho.",
        modifier = modifier,
        style = PantrixTheme.typography.footnote,
        color = if (inABar) PantrixTheme.colors.textSecondary else Color.Unspecified,
        textAlign = if (inABar) TextAlign.Center else null
    )
}

@Composable
private fun LanguageMenu() {
    var open by remember { mutableStateOf(false) }
    var language by rememberSaveable { mutableStateOf("tr") }
    PantrixMenu(
        visible = open,
        onDismissRequest = { open = false },
        anchor = {
            PantrixIconButton(
                imageVector = DemoIcons.Globe,
                contentDescription = "Language",
                onClick = { open = true },
                tagKey = "language"
            )
        },
        alignment = PopoverAlignment.End,
        tagKey = "language"
    ) {
        PantrixMenuItem(text = "Türkçe", onClick = { language = "tr" }, tagKey = "tr", selected = language == "tr")
        PantrixMenuItem(text = "English", onClick = { language = "en" }, tagKey = "en", selected = language == "en")
    }
}

@Composable
private fun ColumnScope.SignInForm() {
    val report = LocalExampleEvents.current
    val email = rememberTextFieldState()
    val password = remember { TextFieldState() }
    var keep by rememberSaveable { mutableStateOf(false) }
    Heading(title = "Welcome back", line = "Sign in to your account to continue")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(
        state = email,
        modifier = Modifier.fillMaxWidth(),
        label = "Email",
        placeholder = "name@example.com",
        leadingIcon = { PantrixIcon(DemoIcons.Mail, contentDescription = null) },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
        tagKey = "email"
    )
    Spacer(Modifier.height(16.dp))
    PantrixSecureTextField(
        state = password,
        modifier = Modifier.fillMaxWidth(),
        label = "Password",
        leadingIcon = { PantrixIcon(DemoIcons.Lock, contentDescription = null) },
        tagKey = "password"
    )
    PantrixLink(
        text = "Forgot your password?",
        onClick = { report("A password reset was asked for") },
        modifier = Modifier.align(Alignment.End).padding(vertical = 12.dp),
        tagKey = "forgot"
    )
    PantrixCheckbox(checked = keep, onCheckedChange = { keep = it }, label = "Remember me", tagKey = "remember")
    Spacer(Modifier.height(16.dp))
    PantrixButton(
        text = "Sign in",
        onClick = { report("Signed in: ${email.text}") },
        enabled = email.text.isNotEmpty() && password.text.isNotEmpty(),
        fullWidth = true,
        shape = PantrixTheme.shapes.full,
        tagKey = "sign_in"
    )
}

@Composable
private fun SignUpInstead() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        PantrixHorizontalDivider(label = "DON'T HAVE AN ACCOUNT?")
        PantrixButton(
            text = "Sign up",
            onClick = {},
            variant = ButtonVariant.Outline,
            fullWidth = true,
            shape = PantrixTheme.shapes.full,
            tagKey = "sign_up"
        )
    }
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val NAVY = Color(0xFF131F4B)

@Composable
private fun Figure(
    value: String,
    label: String
) {
    Column {
        PantrixText(text = value, style = PantrixTheme.typography.headline)
        PantrixText(text = label, style = PantrixTheme.typography.footnote)
    }
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

What the code calls of the demo app itself, which an app writes for itself:

- `said`: A text written in two languages, as it reads in the app's current language: for the shell's own texts, and in an example for a text the translation files do not know because it has no letters in it, as a percentage. The text's two languages stand side by side where it is used; whoever changes a button's name sees both together.
- `DemoIcons`: The sample app's own icons: for the sections in the navigation and the buttons on the top bar. The library's icons (`PantrixIcons`) are as many as a component library cannot do without; an app's home, grid or settings icon is its own.
- `LocalExampleEvents`: Where an example tells its card what happens in it: a button pressed, a row chosen, a dialog closed. The card writes the last thing told under the example, on its "Last event" line.

### Signing in beside slides

Slides that turn in the showcase (`PantrixCarousel`): each a heading and a sentence. With `showcaseFrom = WindowWidthClass.Medium` the showcase is shown from 600 dp on, in "Medium" too. In "Book" the showcase is in one half and the form in the other, and they meet at the fold; in "Tabletop" only the form is left. In "Narrow" the showcase is not composed at all: its slides do not turn.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = { Highlights() },
        title = "Sign in",
        header = { Logo() },
        showcaseFrom = WindowWidthClass.Medium,
        windowInsets = WindowInsets(0),
        tagKey = "slides_sign_in"
    ) {
        ShortSignIn()
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun Highlights() {
    var page by rememberSaveable { mutableIntStateOf(0) }
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        PantrixCarousel(
            pageCount = HIGHLIGHTS.size,
            currentPage = page,
            onPageChange = { page = it },
            loop = true,
            autoAdvanceMillis = 5000,
            contentDescription = "Highlights",
            tagKey = "highlights"
        ) { index ->
            val (title, line) = HIGHLIGHTS[index]
            Column(modifier = Modifier.fillMaxWidth().padding(24.dp)) {
                PantrixText(text = title, style = PantrixTheme.typography.headline)
                PantrixText(text = line, modifier = Modifier.padding(top = 8.dp))
            }
        }
    }
}

@Composable
private fun ColumnScope.ShortSignIn() {
    val email = rememberTextFieldState()
    val password = remember { TextFieldState() }
    Heading(title = "Sign in", line = "Your team is waiting for you")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(state = email, modifier = Modifier.fillMaxWidth(), label = "Email", tagKey = "email")
    Spacer(Modifier.height(16.dp))
    PantrixSecureTextField(state = password, modifier = Modifier.fillMaxWidth(), label = "Password", tagKey = "password")
    Spacer(Modifier.height(24.dp))
    PantrixButton(text = "Sign in", onClick = {}, fullWidth = true, tagKey = "sign_in")
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp

private val HIGHLIGHTS = listOf(
    "One design on every platform" to "Android, iOS, desktop and the web are drawn with the same components.",
    "A layout for the window" to "Screens grow simpler in a narrow window and open up as it widens.",
    "Accessible from the start" to "The screen reader, the keyboard and contrast are inside every component."
)
```

What the code calls of the demo app itself, which an app writes for itself:

- `DemoIcons`: The sample app's own icons: for the sections in the navigation and the buttons on the top bar. The library's icons (`PantrixIcons`) are as many as a component library cannot do without; an app's home, grid or settings icon is its own.

### Signing up on a picture

Signing up on a picture. A gradient stands where the picture would: the showcase's background (`showcaseBackground`) and what the card stands on (`backdrop`). The showcase is at the end (`showcaseSide = ShowcaseSide.End`); `scrim = ShowcaseScrim.Bottom` deepens the background towards its foot so that the line at the bottom reads. The showcase stands in the card with corners of its own (`showcaseInset`). In "Wide" the layout is a card, which `ShowcaseFrame.Adaptive` draws from Large on; in "Short" it reaches the edges.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors
import com.pantrixui.components.container.showcase.ShowcaseScaffoldStyle
import com.pantrixui.components.container.showcase.ShowcaseScrim
import com.pantrixui.components.container.showcase.ShowcaseSide
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val picture = remember { Brush.linearGradient(SUNSET) }
ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = { PictureCaption() },
        showcaseBackground = { Box(Modifier.fillMaxSize().background(picture)) },
        title = "Sign up",
        header = { Logo() },
        footer = { SignInInstead() },
        backdrop = { Box(Modifier.fillMaxSize().background(picture)) },
        showcaseSide = ShowcaseSide.End,
        scrim = ShowcaseScrim.Bottom,
        windowInsets = WindowInsets(0),
        colors = ShowcaseScaffoldColors(showcaseContent = Color.White),
        style = ShowcaseScaffoldStyle(showcaseInset = 12.dp),
        tagKey = "sign_up"
    ) {
        SignUpForm()
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun ColumnScope.SignInInstead() {
    PantrixLink(
        text = "Have an account? Sign in",
        onClick = {},
        modifier = Modifier.align(Alignment.CenterHorizontally),
        tagKey = "sign_in_instead"
    )
}

@Composable
private fun PictureCaption() {
    Column(modifier = Modifier.fillMaxSize()) {
        Spacer(Modifier.weight(1f))
        PantrixText(text = "Bring your team together", style = PantrixTheme.typography.headline)
        PantrixText(text = "Your product, your data and your team in one place.", modifier = Modifier.padding(top = 8.dp))
    }
}

@Composable
private fun ColumnScope.SignUpForm() {
    val name = rememberTextFieldState()
    val email = rememberTextFieldState()
    val password = remember { TextFieldState() }
    Heading(title = "Create an account", line = "Get started in a few steps")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(state = name, modifier = Modifier.fillMaxWidth(), label = "Name", tagKey = "name")
    Spacer(Modifier.height(16.dp))
    PantrixTextField(state = email, modifier = Modifier.fillMaxWidth(), label = "Email", tagKey = "email")
    Spacer(Modifier.height(16.dp))
    PantrixSecureTextField(state = password, modifier = Modifier.fillMaxWidth(), label = "Password", tagKey = "password")
    Spacer(Modifier.height(24.dp))
    PantrixButton(text = "Sign up", onClick = {}, fullWidth = true, tagKey = "sign_up")
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val SUNSET = listOf(Color(0xFFF59E0B), Color(0xFFDB2777), Color(0xFF4C1D95))

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

What the code calls of the demo app itself, which an app writes for itself:

- `DemoIcons`: The sample app's own icons: for the sections in the navigation and the buttons on the top bar. The library's icons (`PantrixIcons`) are as many as a component library cannot do without; an app's home, grid or settings icon is its own.

### Password reset

A screen with no showcase: the form alone. In "Wide" the form is a card of its own width in the middle of the backdrop; in a narrower window it reaches the edges. `footer` is the way back to signing in.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        title = "Password reset",
        header = { Logo() },
        footer = {
            PantrixLink(
                text = "Back to sign in",
                onClick = {},
                modifier = Modifier.align(Alignment.CenterHorizontally),
                tagKey = "back_to_sign_in"
            )
        },
        windowInsets = WindowInsets(0),
        tagKey = "reset"
    ) {
        ResetForm()
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun ColumnScope.ResetForm() {
    val email = rememberTextFieldState()
    var sent by rememberSaveable { mutableStateOf(false) }
    Heading(title = "Reset your password", line = "We will send a link to your email address")
    Spacer(Modifier.height(24.dp))
    PantrixTextField(state = email, modifier = Modifier.fillMaxWidth(), label = "Email", tagKey = "email")
    Spacer(Modifier.height(24.dp))
    PantrixButton(
        text = if (sent) "Link sent" else "Send the link",
        onClick = { sent = true },
        enabled = email.text.isNotEmpty() && !sent,
        fullWidth = true,
        tagKey = "send"
    )
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

What the code calls of the demo app itself, which an app writes for itself:

- `DemoIcons`: The sample app's own icons: for the sections in the navigation and the buttons on the top bar. The library's icons (`PantrixIcons`) are as many as a component library cannot do without; an app's home, grid or settings icon is its own.

### A page not found

A page not found, with `formLayout = ShowcaseFormLayout.Spread`: the logo at the top, the words in the middle of the side, the help link under them and the copyright line in the bottom bar (`bottomBar`). The showcase is a large "404" in the theme's neutral colour: a colour that is the theme's brings the colour of what is written on it with it.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold
import com.pantrixui.components.container.showcase.ShowcaseFormLayout
import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

ShowcaseExampleFrame {
    PantrixShowcaseScaffold(
        showcase = {
            PantrixText(
                text = "404",
                modifier = Modifier.align(Alignment.Center),
                style = PantrixTheme.typography.display
            )
        },
        title = "Page not found",
        header = { Logo() },
        footer = { PantrixLink(text = "Help centre", onClick = {}, tagKey = "help") },
        bottomBar = { Copyright(inABar = true) },
        formLayout = ShowcaseFormLayout.Spread,
        windowInsets = WindowInsets(0),
        colors = ShowcaseScaffoldColors(showcase = PantrixTheme.colors.neutral.container),
        tagKey = "not_found"
    ) {
        PantrixText(
            text = "The page you are looking for is not here",
            style = PantrixTheme.typography.headline,
            role = TextRole.Heading(level = 1)
        )
        PantrixText(
            text = "The address may be mistyped, or the page may have moved.",
            color = PantrixTheme.colors.textSecondary
        )
    }
}

@Composable
private fun Logo() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.md),
            contentAlignment = Alignment.Center
        ) {
            PantrixIcon(DemoIcons.Chart, contentDescription = null, tint = PantrixTheme.colors.primary.onColor)
        }
        PantrixText(text = "Pantrix", style = PantrixTheme.typography.title)
    }
}

@Composable
private fun Copyright(
    modifier: Modifier = Modifier,
    inABar: Boolean = false
) {
    PantrixText(
        text = "© 2026 Pantrix. All rights reserved. by @developersancho.",
        modifier = modifier,
        style = PantrixTheme.typography.footnote,
        color = if (inABar) PantrixTheme.colors.textSecondary else Color.Unspecified,
        textAlign = if (inABar) TextAlign.Center else null
    )
}

@Composable
private fun ColumnScope.Heading(
    title: String,
    line: String
) {
    PantrixText(
        text = title,
        modifier = Modifier.align(Alignment.CenterHorizontally),
        style = PantrixTheme.typography.headline,
        role = TextRole.Heading(level = 1)
    )
    PantrixText(
        text = line,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(top = 8.dp),
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun ShowcaseExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(SHOWCASE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val SHOWCASE_EXAMPLE_HEIGHT = 640.dp
```

What the code calls of the demo app itself, which an app writes for itself:

- `DemoIcons`: The sample app's own icons: for the sections in the navigation and the buttons on the top bar. The library's icons (`PantrixIcons`) are as many as a component library cannot do without; an app's home, grid or settings icon is its own.

## API

### PantrixShowcaseScaffold

`import com.pantrixui.components.container.showcase.PantrixShowcaseScaffold`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixShowcaseScaffold(
    modifier: Modifier = Modifier,
    showcase: (@Composable BoxScope.() -> Unit)? = null,
    showcaseBackground: (@Composable BoxScope.() -> Unit)? = null,
    title: String? = null,
    topBar: (@Composable ShowcaseBarScope.() -> Unit)? = null,
    header: (@Composable ShowcaseScaffoldScope.() -> Unit)? = null,
    footer: (@Composable ShowcaseScaffoldScope.() -> Unit)? = null,
    bottomBar: (@Composable ShowcaseBarScope.() -> Unit)? = null,
    backdrop: (@Composable BoxScope.() -> Unit)? = null,
    showcaseSide: ShowcaseSide = ShowcaseSide.Start,
    showcaseFrom: WindowWidthClass = WindowWidthClass.Expanded,
    frame: ShowcaseFrame = ShowcaseFrame.Adaptive,
    formLayout: ShowcaseFormLayout = ShowcaseFormLayout.Centered,
    scrim: ShowcaseScrim = ShowcaseScrim.None,
    windowInsets: WindowInsets = WindowInsets.systemBars.union(WindowInsets.displayCutout),
    colors: ShowcaseScaffoldColors? = null,
    style: ShowcaseScaffoldStyle? = null,
    tagKey: String? = null,
    content: @Composable ShowcaseScaffoldScope.() -> Unit
)
```

A screen that stands outside the app's shell: sign in, sign up, a password reset, an invitation, a welcome, a page not found. A showcase stands on one side, a picture, a quote or slides, and the form on the other; in a narrow room only the form is left.

- **Showcase.** `showcase` stands beside the form once the scaffold is as wide as `showcaseFrom`, Expanded by default, on the side `showcaseSide` says. Narrower, it is not composed at all: its slides do not turn and its pictures are not loaded. The scaffold goes by its own width, not the window's. `showcaseBackground` fills the showcase to its edges, a picture or a gradient, under the system's bars, while what `showcase` holds keeps clear of them; `scrim` shades the background under what is written on it. The showcase is drawn in its own colours.

- **Form.** `content` is the form, no wider than the style's form width, in the middle of its side. `header` stands above it, a heading, and `footer` under it, a way to sign up instead. `formLayout` puts the header, the form and the footer together in the middle of the side's height, or apart: the header at the top and the footer at the foot.

- **Bars.** `topBar` is a row across the top of the form's side, a logo at its start and a language at its end; `bottomBar` is a row across its foot, a line of copyright. They stay where they are as the form scrolls between them. Where the showcase is not shown, a line parts each bar from the form; a bar with nothing in it takes no room. The bars and the form's parts are each told whether the showcase is shown, so that the logo the showcase carries in a wide window can stand in the top bar of a narrow one.

- **Frame.** With `ShowcaseFrame.Adaptive`, from the Large class on, the scaffold is a card in the middle of the window, no wider and no taller than its style says, on its `backdrop`; a card with no showcase is the form's width and as tall as what it holds. Narrower, and with `ShowcaseFrame.Edge` at every width, it reaches the window's edges.

- **Folds.** Where a fold upright divides the room, a device held like a book, the showcase is in one half and the form in the other, and they meet at the fold. A fold across the room, a device on a table, leaves only the form.

- **Room.** The scaffold keeps clear of the system's bars and the display's cut-out itself, as `windowInsets` says: it stands outside the app's shell, where nothing else does. Only the form's side scrolls; it ends above the keyboard, and a field that takes the focus is brought into view.

- **What it remembers.** The form and the showcase are each composed in one place whatever the layout: what they remember, a typed address or a slide's place, stays as the room changes, a phone turned on its side or a window widened into a card. A showcase a narrow room hides forgets, as it is not composed there.

- **The window's title.** With a `title`, the scaffold names the window after the screen while it is shown: the browser's tab on the web, the title bar on the desktop. The title is not drawn: the form has its own heading. A scaffold inside a page's content, as an example of one is, leaves the window's title to the page.

- **Screen reader and focus.** The form is read first, and takes the focus first, wherever the showcase stands; the showcase is read after it, as one group. The title is the screen's name as it comes into view, which TalkBack says on Android.

- **Reported shown.** A scaffold with a `tagKey` reports a `show` event to the theme's analytics each time it comes into the composition.

- **Automation.** The scaffold is tagged `ShowcaseScaffold_<tagKey>`, its sides `ShowcaseScaffold_<tagKey>.Pane_form` and `ShowcaseScaffold_<tagKey>.Pane_showcase`. What the app puts in it stands in `TestScope(tagKey)`: a button tagged `sign_in` there is `sign_in.Button_sign_in` on a scaffold keyed `sign_in`.

- **Reading direction.** The start and the end are the language's: `ShowcaseSide.Start` is on the right where the language is read from right to left.

The scaffold takes the room it is given, which is to be bounded both ways: the window, or `Modifier.fillMaxSize()`.

Parameters:

- `modifier: Modifier`: the scaffold's modifier.
- `showcase: (@Composable BoxScope.() -> Unit)?`: what stands beside the form in a wide room: a quote, a picture's caption, slides. Null for a screen with only its form.
- `showcaseBackground: (@Composable BoxScope.() -> Unit)?`: what fills the showcase to its edges, under what it holds: a picture or a gradient.
- `title: String?`: the screen's name: the window's title, and the screen's for a screen reader. Not drawn.
- `topBar: (@Composable ShowcaseBarScope.() -> Unit)?`: the row across the top of the form's side: a logo, a language, a way back.
- `header: (@Composable ShowcaseScaffoldScope.() -> Unit)?`: what stands above the form: a heading.
- `footer: (@Composable ShowcaseScaffoldScope.() -> Unit)?`: what stands under the form: another way in, as signing up instead.
- `bottomBar: (@Composable ShowcaseBarScope.() -> Unit)?`: the row across the foot of the form's side: a line of copyright, the terms.
- `backdrop: (@Composable BoxScope.() -> Unit)?`: what the card stands on in a wide window, with `ShowcaseFrame.Adaptive`: a picture or a gradient.
- `showcaseSide: ShowcaseSide`: which side the showcase stands on: the start or the end.
- `showcaseFrom: WindowWidthClass`: the narrowest class of width the showcase is shown in.
- `frame: ShowcaseFrame`: whether the scaffold is a card on its backdrop in a wide window, or reaches the window's edges.
- `formLayout: ShowcaseFormLayout`: whether the header, the form and the footer stand together or apart.
- `scrim: ShowcaseScrim`: what shades the showcase's background, so that what is written on it reads.
- `windowInsets: WindowInsets`: what the scaffold keeps clear of: the system's bars and the display's cut-out by default.
- `colors: ShowcaseScaffoldColors?`: what the scaffold is painted with, over the theme's.
- `style: ShowcaseScaffoldStyle?`: the scaffold's geometry, over the theme's.
- `tagKey: String?`: the screen's automation key, the same in every language: what the scaffold and its sides are tagged by, the TestScope of what it holds, and the screen its `show` event is of.
- `content: @Composable ShowcaseScaffoldScope.() -> Unit`: the form, in a column.

### ShowcaseSide

`import com.pantrixui.components.container.showcase.ShowcaseSide`, from `com.pantrixui:components`

```kotlin
enum class ShowcaseSide
```

Which side of a `PantrixShowcaseScaffold` its showcase stands on, beside the form.

Entries:

- `Start`: At the start: on the left, and on the right where the language is read from right to left.
- `End`: At the end: on the right, and on the left where the language is read from right to left.

### ShowcaseFrame

`import com.pantrixui.components.container.showcase.ShowcaseFrame`, from `com.pantrixui:components`

```kotlin
enum class ShowcaseFrame
```

Whether a `PantrixShowcaseScaffold` stands as a card on a backdrop in a wide window, or reaches its edges.

Entries:

- `Adaptive`: A card in the middle of the backdrop from the Large class on, no wider and no taller than its style says; narrower, it reaches the window's edges.
- `Edge`: It reaches the window's edges at every width.

### ShowcaseFormLayout

`import com.pantrixui.components.container.showcase.ShowcaseFormLayout`, from `com.pantrixui:components`

```kotlin
enum class ShowcaseFormLayout
```

How the form side of a `PantrixShowcaseScaffold` lays its header, its form and its footer out, top to bottom.

Entries:

- `Centered`: The header, the form and the footer together, as one block in the middle of the side's height.
- `Spread`: The header at the top, the form in the middle and the footer at the foot.

### ShowcaseScrim

`import com.pantrixui.components.container.showcase.ShowcaseScrim`, from `com.pantrixui:components`

```kotlin
enum class ShowcaseScrim
```

What a `PantrixShowcaseScaffold` lays over its showcase's background so that what is written on it reads.

Entries:

- `None`: Nothing: the showcase's background is shown as it is.
- `Bottom`: A shade that deepens towards the foot, under a line written at the bottom of a picture.
- `Full`: A shade over the whole background, under what is written anywhere on a picture.

### ShowcaseScaffoldScope

`import com.pantrixui.components.container.showcase.ShowcaseScaffoldScope`, from `com.pantrixui:components`

```kotlin
interface ShowcaseScaffoldScope : ColumnScope
```

Where the form side of a `PantrixShowcaseScaffold` lays out its header, its form and its footer, each in a column.

Members:

- `showcaseShown: Boolean`: Whether the showcase is shown beside the form now.

### ShowcaseBarScope

`import com.pantrixui.components.container.showcase.ShowcaseBarScope`, from `com.pantrixui:components`

```kotlin
interface ShowcaseBarScope : RowScope
```

Where a bar of the form side of a `PantrixShowcaseScaffold` lays out what it holds: a row across the side, its parts a little apart and together in its middle; a part with a weight pushes the others to the ends.

Members:

- `showcaseShown: Boolean`: Whether the showcase is shown beside the form now. A logo or a line the showcase carries in a wide window goes in a bar when it is not: the logo at the top bar's start, the copyright in the bottom bar.

### ShowcaseScaffoldStyle

`import com.pantrixui.components.container.showcase.ShowcaseScaffoldStyle`, from `com.pantrixui:components`

```kotlin
class ShowcaseScaffoldStyle(
    public val showcaseShare: Float = Float.NaN,
    public val formMaxWidth: Dp = Dp.Unspecified,
    public val formPadding: Dp = Dp.Unspecified,
    public val sectionGap: Dp = Dp.Unspecified,
    public val showcasePadding: Dp = Dp.Unspecified,
    public val showcaseInset: Dp = Dp.Unspecified,
    public val showcaseShape: ShapeSpec = ShapeSpec.Unspecified,
    public val cardMaxWidth: Dp = Dp.Unspecified,
    public val cardMaxHeight: Dp = Dp.Unspecified,
    public val cardMargin: Dp = Dp.Unspecified,
    public val cardShape: ShapeSpec = ShapeSpec.Unspecified,
    public val cardElevation: Dp = Dp.Unspecified,
    public val barPadding: Dp = Dp.Unspecified
) : PantrixStyle<ShowcaseScaffoldStyle>
```

`PantrixShowcaseScaffold`'s geometry: how the room is shared between the showcase and the form, how wide the form is, the rooms inside each side, and the card it stands as in a wide window.

The rooms follow the density; the widths, the corners and the shadow do not. Its colours are not part of its style: they are `ShowcaseScaffoldColors`.

Parameters:

- `showcaseShare: Float`: How much of the room the showcase takes beside the form, more than nought and less than one: half on every platform. A fold that divides the room shares it instead.
- `formMaxWidth: Dp`: How wide the form, its header and its footer are at the most, in the middle of their side: 440dp.
- `formPadding: Dp`: The room between the edges of the form's side and what it holds: 24dp on Android and iOS, 40dp on desktop and the web.
- `sectionGap: Dp`: The room between the header, the form and the footer: 24dp on Android and iOS, 32dp on desktop and the web.
- `showcasePadding: Dp`: The room between the edges of the showcase and what it holds: 24dp on Android and iOS, 40dp on desktop and the web. The showcase's background runs to its edges.
- `showcaseInset: Dp`: The room around the showcase, inside its side, where it stands as a panel of its own: none on every platform, so that it reaches its side's edges.
- `showcaseShape: ShapeSpec`: The showcase's corners where it is inset: large on every platform. Not inset, it has the corners of what it stands in.
- `cardMaxWidth: Dp`: How wide the card the scaffold stands as in a wide window is at the most: 1120dp.
- `cardMaxHeight: Dp`: How tall that card is at the most: 760dp. A card with no showcase is as tall as its form.
- `cardMargin: Dp`: The room between that card and the window's edges, past the system's bars: 32dp.
- `cardShape: ShapeSpec`: That card's corners: large on every platform.
- `cardElevation: Dp`: The shadow under that card: 2dp on Android, none on iOS, 1dp on desktop and the web.
- `barPadding: Dp`: The room above and below what a bar of the form's side holds: 12dp on Android and iOS, 16dp on desktop and the web.

### ShowcaseScaffoldColors

`import com.pantrixui.components.container.showcase.ShowcaseScaffoldColors`, from `com.pantrixui:components`

```kotlin
data class ShowcaseScaffoldColors(
    public val showcase: Color = Color.Unspecified,
    public val showcaseContent: Color = Color.Unspecified,
    public val form: Color = Color.Unspecified,
    public val backdrop: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

What `PantrixShowcaseScaffold` is painted with: a colour that is set is used, and one that is left out is the theme's.

```kotlin
PantrixShowcaseScaffold(
    showcase = { Testimonial() },
    colors = ShowcaseScaffoldColors(showcase = brand.navy, showcaseContent = Color.White)
) {
    SignInForm(form)
}
```

Parameters:

- `showcase: Color`: The showcase's fill, under its background: the theme's primary colour.
- `showcaseContent: Color`: What the showcase holds is drawn in, unless a child sets a colour of its own: the colour the theme pairs with `showcase` where that is one of its own, and the one on its primary colour otherwise. A fill the theme does not have is to be given its content too.
- `form: Color`: The form's side: the theme's surface, as a card's.
- `backdrop: Color`: What the card stands on in a wide window, under the backdrop the scaffold is given: the theme's background.
- `scrim: Color`: The shade laid over the showcase's background with a `ShowcaseScrim`: the theme's scrim.

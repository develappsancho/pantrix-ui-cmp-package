# Filled Text Area

Text of several lines in a filled box: a comment, a message, a note. The label is inside the box: it rests in the first line's place while the field is empty and without the focus, and rises above the text when the field takes the focus or holds text. While it is empty the box is its least lines tall; it grows a line at a time as it is typed in, at its most lines the text scrolls inside the box, and the thin bar at the box's end shows how far. Its box and supporting text are `PantrixFilledTextField`'s, and it takes that field's style and colours.

- `PantrixFilledTextArea` (`com.pantrixui.components.inputs.filledtextarea`, `com.pantrixui:components`): A filled text input of several lines on a TextFieldState, with a floating label inside the box, that grows with its text and then scrolls, with a handle that resizes it, a soft or hard character limit with its count, a submit on Ctrl or Cmd and Enter, supporting and error text, icons, a clear button and form binding. Keywords: filled textarea, multiline filled input, floating label textarea, comment box, long text.

## Features

- **Three overloads.** The one that takes a `state` keeps the text in a `TextFieldState`. The one that takes a `value` and an `onValueChange` keeps the text in its caller; the text field underneath does not tell how far it is scrolled, so its box has no bar. The one that takes a `field` takes its value, its error and its name from the form's field.
- **Lines.** `minLines` (3 by default) says how many lines the box is at the least, and `maxLines` (8 by default) at the most. A `Modifier.height` given to the field takes the place of the lines, and the text scrolls inside the box.
- **Enter is a new line.** The keyboard's action key is always the new line. Sending is `onSubmit`'s: Ctrl+Enter or Cmd+Enter on a hardware keyboard. Tab moves the focus on and types no tab.
- **A soft limit.** `maxLength` can be passed (`TextLimit.Allow`): past it the count says how far past in words ("12 over the limit"), and the count and the outline turn to the error's colour. A form is not submitted with a bound field's text past the limit. `TextLimit.Block` turns an edit past the limit down whole. A screen reader is told the count once typing stops, at the limit and past it.
- **Icons and the clear button.** `leadingIcon`, `trailingIcon` and `showClearButton` stand at the first line.
- **The handle that resizes.** On a desktop and on the web the handle in the box's bottom corner drags the box taller and shorter; a phone has no handle. `resizable = false` takes the handle away.
- **Style, colours and direction.** `style` (`FilledTextFieldStyle`) and `colors` (`FilledTextFieldColors`) are the filled text field's. In a right-to-left layout the handle is in the bottom corner at the left.

## Usage

### A comment that grows with its text

```kotlin
val comment = rememberTextFieldState()
PantrixFilledTextArea(
    state = comment,
    label = stringResource(Res.string.comment),
    placeholder = stringResource(Res.string.comment_hint),
    maxLength = 500,
    tagKey = "comment"
)
```

### A message sent with Ctrl or Cmd and Enter

```kotlin
val message = rememberTextFieldState()
PantrixFilledTextArea(
    state = message,
    label = stringResource(Res.string.message),
    minLines = 2,
    maxLines = 6,
    onSubmit = { viewModel.send(message.text.toString()) },
    tagKey = "message"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
val bio = form.field("bio", initial = "")
PantrixFilledTextArea(
    field = bio,
    form = form,
    label = stringResource(Res.string.bio),
    maxLength = 160
)
```

### Held as a String, with a limit that blocks

```kotlin
var note by remember { mutableStateOf("") }
PantrixFilledTextArea(
    value = note,
    onValueChange = { note = it },
    label = stringResource(Res.string.note),
    maxLength = 200,
    overLimit = TextLimit.Block,
    tagKey = "note"
)
```

## Examples

### A comment that grows

A comment field: three lines while it is empty, with its label resting in the first line's place; a press on the field raises the label above the text, and the placeholder shows. As it is typed in the box grows a line at a time, and at eight lines the text scrolls inside the box. A sentence starts with a capital: the keyboard opens that way.

`maxLength = 500` writes the count under the box. The line below reads `comment.text` as it is typed.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.foundation.theme.PantrixTheme

val comment = rememberTextFieldState()
PantrixFilledTextArea(
    state = comment,
    modifier = Modifier.fillMaxWidth(),
    label = "Comment",
    placeholder = "What did you think of the product?",
    supportingText = "Your comment is public",
    maxLength = 500,
    tagKey = "filled_comment"
)
PantrixText(
    text = "Lines: ${comment.text.lines().size}",
    color = PantrixTheme.colors.textSecondary
)
```

### A field given a height

A height given to the field is the whole field's: `Modifier.height(200.dp)`. The box fills what the count leaves of it; that height takes the place of the lines, and a text that does not fit scrolls inside the box.

The second field is given `heightIn`: the handle drags the box only within that range. A fixed height leaves the handle nothing to move.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState(DELIVERY_NOTES),
    modifier = Modifier.fillMaxWidth().height(200.dp),
    label = "Delivery instructions",
    showClearButton = true,
    maxLength = 400,
    tagKey = "filled_instructions"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth().heightIn(max = 320.dp),
    label = "Extra note",
    supportingText = "The handle makes it 320dp tall at the most",
    tagKey = "filled_extra_note"
)

private const val DELIVERY_NOTES =
    "Use the back door of the building; the bell on the front door does not work. The lift is serviced on Fridays, " +
        "take the stairs to the third floor. If I am out, leave the parcel with the porter, Mr Hasan. Thank you!"
```

### A soft limit and the count

The limit is soft: the text may pass 140 characters. Past it the count says how far past in words ("6 over the limit"), the count and the outline turn to the error's colour, and a screen reader is told the field's error, "Too long". Paste a long text: it is taken whole, and you can cut it where you choose.

Type and stop with a screen reader on: the count is told once, after typing stops.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.common.TextLimit
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState(ALMOST_A_POST),
    modifier = Modifier.fillMaxWidth(),
    label = "Post",
    supportingText = "140 characters at the most",
    minLines = 2,
    maxLength = 140,
    // The default: the text may pass the limit.
    overLimit = TextLimit.Allow,
    tagKey = "filled_post"
)

private const val ALMOST_A_POST =
    "The new version is out! A dark theme, faster search and an offline mode are here. Tell us what you think; " +
        "your comments guide us."
```

### A limit that blocks, on a field whose text is a String

`overLimit = TextLimit.Block` turns down an edit past the limit whole: typing stops at the limit, and a paste that does not fit is not put in at all.

This field holds its text as a `String`: `value` and `onValueChange`. An edit past the limit is never asked of `onValueChange`. The text field underneath does not tell how far it is scrolled, so this overload's box has no bar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.common.TextLimit
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

var reason by remember { mutableStateOf("") }
PantrixFilledTextArea(
    value = reason,
    onValueChange = { reason = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Reason for the return",
    placeholder = "In a few words",
    minLines = 2,
    maxLines = 4,
    maxLength = 80,
    overLimit = TextLimit.Block,
    tagKey = "filled_return_reason"
)
```

### Sending with Ctrl/Cmd+Enter

`onSubmit` is called by Ctrl+Enter or Cmd+Enter on a hardware keyboard; Enter alone starts a new line. A software keyboard has no such keys, so a "Send" button stands beside it as well. Type a message and press Ctrl+Enter: the app's snackbar says the message was sent, and the field is emptied.

The send is reported as an event (`submit`); what was typed never is.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val message = rememberTextFieldState()
val send = {
    if (message.text.isNotBlank()) {
        scope.launch { snackbars?.show(message = "Message sent", tagKey = "filled_message_sent") }
        message.clearText()
    }
}
PantrixFilledTextArea(
    state = message,
    modifier = Modifier.fillMaxWidth(),
    label = "Message",
    placeholder = "Send with Ctrl+Enter or Cmd+Enter",
    minLines = 2,
    maxLines = 6,
    onSubmit = send,
    tagKey = "filled_message"
)
PantrixButton(text = "Send", onClick = send, tagKey = "filled_send_message")
```

### Bound to a form's field

The `PantrixFilledTextArea` that takes a `field` takes its value, its error and its name from the form's field: no `tagKey` is given, the field's `id` is the automation key (`FilledTextArea_<id>`). With `form` given, Ctrl+Enter or Cmd+Enter submits the form through the "Save" button.

The limit is soft, but the form is not submitted with a text past it: the field is in error with "Too long", the count says how far past, and the focus goes to the field. Leave the field empty, or go past 160 characters, and press "Save".

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixFilledTextArea(
    field = form.field("filled_bio", initial = "", Rules.notBlank("Tell us about yourself in a few sentences")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "About me",
    supportingText = "Shown on your profile",
    maxLength = 160
)
PantrixButton(
    text = "Save",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Profile saved", tagKey = "filled_bio_saved") } }
    },
    form = form,
    tagKey = "filled_save_bio"
)
```

### Disabled and read-only

`enabled = false` draws the field in the theme's disabled colours: it takes no focus, cannot be typed into, has no handle, and a screen reader is told it is disabled.

`readOnly = true` only stops changes: the field is focused, its text selected, copied and scrolled; it can be made taller with the handle and read.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState("Your order has shipped; no note can be added."),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Shipping note",
    minLines = 2,
    tagKey = "filled_shipping_note"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(RETURN_POLICY),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Return policy",
    maxLines = 4,
    tagKey = "filled_return_policy"
)

private const val RETURN_POLICY =
    "You can return the product within 14 days of the day you received it. It must be unused, with its labels " +
        "still on and in its original packaging. We pay for the return shipping. Your money goes back to the card you " +
        "paid with within 3 working days of the product reaching our warehouse."
```

### Its own colours and style

`colors` and `style` are the filled text field's: `FilledTextFieldColors` and `FilledTextFieldStyle`. The colours that are given are used, and the rest stay the theme's roles. The first field's outline with the focus, its caret and its scroll bar are the app's own purple; the handle and the clear button take the icon's colour.

The second field's style draws the box rounder with `ShapeRole.Large` and gives it more padding.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldColors
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

val own = ownColors()
PantrixFilledTextArea(
    state = rememberTextFieldState(DELIVERY_NOTES),
    modifier = Modifier.fillMaxWidth(),
    label = "Note",
    showClearButton = true,
    maxLines = 4,
    colors = FilledTextFieldColors(
        focusedOutline = own.color,
        cursor = own.color,
        icon = own.color,
        scrollBar = own.color
    ),
    tagKey = "filled_own_colors"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Description",
    style = FilledTextFieldStyle(shape = ShapeRole.Large, horizontalPadding = 20.dp, verticalPadding = 16.dp),
    tagKey = "filled_own_style"
)

private const val DELIVERY_NOTES =
    "Use the back door of the building; the bell on the front door does not work. The lift is serviced on Fridays, " +
        "take the stairs to the third floor. If I am out, leave the parcel with the porter, Mr Hasan. Thank you!"
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### The handle that resizes

On a desktop and on the web, drag the handle in the box's bottom corner: the box gets taller or shorter, and the pointer turns to an up-and-down resize arrow. A dragged box keeps that height and does not grow with its text; nor is it ever shorter than its least lines. A phone has no handle.

The second field has `resizable = false`: no handle, and the box grows with its text alone.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea

PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Meeting notes",
    supportingText = "Make it taller with the handle in the bottom corner",
    tagKey = "filled_meeting_notes"
)
PantrixFilledTextArea(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Short note",
    minLines = 2,
    maxLines = 4,
    resizable = false,
    tagKey = "filled_short_note"
)
```

### Right to left

In a right-to-left layout the icon and the clear button swap places, the handle moves to the bottom corner at the left, and the scroll bar stands at the box's left: that is where a line ends. Each paragraph takes its direction from its own first letter.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea
import com.pantrixui.components.inputs.filledtextfield.FilledTextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
    PantrixFilledTextArea(
        state = rememberTextFieldState(ARABIC_NOTE),
        modifier = Modifier.fillMaxWidth(),
        label = "ملاحظة",
        leadingIcon = {
            PantrixIcon(
                imageVector = PantrixIcons.Person,
                contentDescription = null,
                size = PantrixTheme.style(FilledTextFieldStyle).iconSize
            )
        },
        showClearButton = true,
        maxLines = 3,
        maxLength = 200,
        tagKey = "filled_arabic_note"
    )
}

private const val ARABIC_NOTE = "يرجى ترك الطرد عند البواب إذا لم أكن في المنزل. شكراً لكم!"
```

## API

### PantrixFilledTextArea

`import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledTextArea(
    state: TextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minLines: Int = 3,
    maxLines: Int = 8,
    resizable: Boolean = true,
    maxLength: Int? = null,
    overLimit: TextLimit = TextLimit.Allow,
    showCharacterCount: Boolean = true,
    onSubmit: (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A filled text area: a field for text of several lines, a comment, a message or a note, on a filled box that grows with what is typed and then scrolls, with its label inside the box, and help or an error's message below it and a count of its characters.

The label rests in the place of the first line while the field is empty and without the focus, and rises above the text as the field takes the focus or holds text, as a filled text field's does.

The box is `minLines` lines tall while it is empty and grows a line at a time with its text, up to `maxLines`. Past them the text scrolls in the box, and a thin bar at the box's end shows how far. Where the platform is used with a pointer, a handle in the box's bottom corner drags it taller or shorter, and the box then keeps the height it was left at whatever its text, down to its least lines.

Enter starts a new line on every keyboard: a software keyboard always shows its key for one, and never an action in its place. A text that is sent takes `onSubmit`, which Ctrl and Enter, or Cmd and Enter, call from a hardware keyboard; a screen gives it a button as well, since a software keyboard has no such keys. Tab moves the focus on, and does not type a tab, which would leave a keyboard no way forward out of the field.

A `maxLength` is soft unless told otherwise: the text may pass it, and the count then says how far past it the text is, in words, with the border in the error's colour. A paste that does not fit is kept whole, for the user to cut where they choose. `TextLimit.Block` turns an edit past the limit down instead, as a text field's limit does.

On iOS a field of several lines has no key that puts the keyboard away: `Modifier.clearFocusOnTap()` on the screen puts it away when the user taps outside the field.

It is the box and the supporting text of `PantrixFilledTextField`, and takes that component's `style` and `colors`: a product that restyles its filled text fields restyles its filled text areas with them. It is built on a `TextFieldState`, and has an overload that takes a `value` and an `onValueChange`, and one for a form's field.

Parameters:

- `state: TextFieldState`: the text and the selection. Create it with `rememberTextFieldState()`, and read what was typed from it: `state.text` where the text is used, or `snapshotFlow { state.text.toString() }` to follow it as it changes.
- `modifier: Modifier`: the modifier of the whole field: its box and what is under it. `fillMaxWidth()` makes the box as wide as its parent. A height is the whole field's as well, in place of its lines: the box fills what the supporting text leaves of it, and its text scrolls in it. The handle moves the box only within such a height, so a field that is to be dragged is given `heightIn` and not `height`.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn in the disabled colours, has no handle and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected, copied, scrolled and dragged taller.
- `label: String?`: what the field is for, inside the box: in the place of the first line while the field is empty and without the focus, and above the text otherwise. It is the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty. It is no label: it goes as soon as the user types.
- `supportingText: String?`: help under the box, in a smaller type. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the outline, the supporting text and the caret turn to the danger role, and a screen reader is told. A text past a soft `maxLength` is drawn in error as well.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text, at its first line, in the secondary text colour. A slot does not size what is put in it: `PantrixIcon(size = PantrixTheme.style(FilledTextFieldStyle).iconSize)` is the platform's size.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text at its first line, and after the clear button.
- `showClearButton: Boolean`: shows a button at the first line that empties the field, while the field can be typed into and is not empty. It leaves the caret in the field. It is no stop for Tab, and a screen reader still reaches it as a button.
- `minLines: Int`: how many lines tall the box is at the least: while it is empty, and when it is dragged its shortest. At least one.
- `maxLines: Int`: how many lines tall the box grows to with its text before the text scrolls in it. No fewer than `minLines`: the two the same give a box that keeps its height.
- `resizable: Boolean`: whether a handle in the box's bottom corner drags it taller or shorter. Only where the platform is used with a pointer, a desktop's or a browser's: on a phone a finger on the box scrolls its text.
- `maxLength: Int?`: the most characters the text should hold, counted as `String.length` counts them, so that an emoji can count as two. What an edit past it does is `overLimit`'s. It has to be positive.
- `overLimit: TextLimit`: what an edit past `maxLength` does: `TextLimit.Allow` takes it and shows that the text is too long, and `TextLimit.Block` turns it down whole.
- `showCharacterCount: Boolean`: shows the count under the box while `maxLength` is set: `120/500`, and past the limit how far past it, `12 over the limit`. A screen reader is told it once typing pauses, at the limit and past it.
- `onSubmit: (() -> Unit)?`: called for Ctrl and Enter, or Cmd and Enter, on a hardware keyboard: the text is sent. Null leaves both keys to the field. It is reported, and the text never is.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals and its corrections: a sentence starts with a capital unless told otherwise. The keyboard's action is always the new line, whatever is named here.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it. With a `maxLength` that blocks, it comes first and the limit applies to what it lets through.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it.
- `style: FilledTextFieldStyle?`: this call's own style, the filled text field's: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FilledTextFieldColors?`: this call's own colours, the filled text field's, in place of the theme's roles: the ones it sets are used, and the rest stay the theme's. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field: its name where it has no `label`. A `placeholder` that says the same is then left to the eye, so that the field is not named twice while it is empty.
- `tagKey: String?`: the field's automation key: the field is `FilledTextArea_<tagKey>`, its clear button `FilledTextAreaClear_<tagKey>` and its handle `FilledTextAreaResize_<tagKey>`. The field reports that it took the focus, that it was cleared and that it was submitted, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted: its focus, its hover and its presses. It keeps a source of its own when this is null.

### PantrixFilledTextArea

`import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledTextArea(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minLines: Int = 3,
    maxLines: Int = 8,
    resizable: Boolean = true,
    maxLength: Int? = null,
    overLimit: TextLimit = TextLimit.Allow,
    showCharacterCount: Boolean = true,
    onSubmit: (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text area whose text is a `String` its caller holds: `value` is what it shows, and `onValueChange` is asked for every change the user makes.

It looks, measures and behaves as the text area on a `TextFieldState` does, and underneath it is Foundation's text field of a value and a callback, with what that brings. The text the callback is given has to come back as `value` by the next frame, or the field shows the old text again and the caret jumps: keep the text in state that the callback writes at once, and take the `TextFieldState` overload when the text lives in a flow or is changed away from the screen. That text field does not tell how far its text is scrolled, so its box has no bar that shows it.

Parameters:

- `value: String`: the text the field shows.
- `onValueChange: (String) -> Unit`: asked for each change the user makes, with the whole new text, and by the clear button with an empty one.
- `modifier: Modifier`: the modifier of the whole field: its box and what is under it. A height is the whole field's, in place of its lines.
- `enabled: Boolean`: whether the field can be typed into. One that cannot takes no focus, is drawn in the disabled colours, has no handle and says so.
- `readOnly: Boolean`: whether the text can only be read: it can still be focused, selected and copied.
- `label: String?`: what the field is for, inside the box: in the place of the first line while the field is empty and without the focus, and above the text otherwise. It is the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty, once the label has risen above it.
- `supportingText: String?`: help under the box. With `error` it is the message that says what to put right, which a screen reader announces as the error.
- `error: Boolean`: whether the text is wrong: the outline, the supporting text and the caret turn to the danger role, and a screen reader is told. A text past a soft `maxLength` is drawn in error as well.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text, at its first line.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text at its first line, and after the clear button.
- `showClearButton: Boolean`: shows a button at the first line that asks for an empty text, while the field can be typed into and is not empty. It leaves the caret in the field, and is no stop for Tab.
- `minLines: Int`: how many lines tall the box is at the least. At least one.
- `maxLines: Int`: how many lines tall the box grows to with its text before the text scrolls in it. No fewer than `minLines`.
- `resizable: Boolean`: whether a handle in the box's bottom corner drags it taller or shorter, where the platform is used with a pointer.
- `maxLength: Int?`: the most characters the text should hold, counted as `String.length` counts them. What an edit past it does is `overLimit`'s. It has to be positive.
- `overLimit: TextLimit`: what an edit past `maxLength` does: `TextLimit.Allow` asks for it and shows that the text is too long, and `TextLimit.Block` turns it down before `onValueChange` is asked.
- `showCharacterCount: Boolean`: shows the count under the box while `maxLength` is set, and past the limit how far past it.
- `onSubmit: (() -> Unit)?`: called for Ctrl and Enter, or Cmd and Enter, on a hardware keyboard. Null leaves both keys to the field.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals and its corrections. The keyboard's action is always the new line, whatever is named here.
- `style: FilledTextFieldStyle?`: this call's own style, the filled text field's: over every enclosing one and under the density.
- `colors: FilledTextFieldColors?`: this call's own colours, the filled text field's, in place of the theme's roles. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `tagKey: String?`: the field's automation key: the field is `FilledTextArea_<tagKey>`, its clear button `FilledTextAreaClear_<tagKey>` and its handle `FilledTextAreaResize_<tagKey>`. The field reports that it took the focus, that it was cleared and that it was submitted, and never its text.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.

### PantrixFilledTextArea

`import com.pantrixui.components.inputs.filledtextarea.PantrixFilledTextArea`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFilledTextArea(
    field: FormField<String>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    minLines: Int = 3,
    maxLines: Int = 8,
    resizable: Boolean = true,
    maxLength: Int? = null,
    overLimit: TextLimit = TextLimit.Allow,
    showCharacterCount: Boolean = true,
    onSubmit: (() -> Unit)? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    style: FilledTextFieldStyle? = null,
    colors: FilledTextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

A text area bound to a form's field: its text, its error and its name come from `field`.

The field's value and the text on screen stay in step both ways: typing changes the field, and a change made to the field in code, such as a reset, replaces the text. When the focus leaves, the field is marked touched and checked, which is when an error first shows. While the field is in error its message takes the place of `supportingText`. A text past a soft `maxLength` puts the field in error as well, so that the form is not submitted with it: the message is `PantrixStrings.tooLong`, and the count says how far past the limit the text is. The field's id is the automation key, `FilledTextArea_<id>`, and the form can send the focus here when it is submitted with this field in error.

Parameters:

- `field: FormField<String>`: the field the text area shows and changes.
- `modifier: Modifier`: the modifier of the whole field.
- `form: FormState?`: given, Ctrl and Enter, or Cmd and Enter, submit the form through the button registered with it: the form is checked, and then submitted or the focus sent to its first field in error. Enter alone starts a new line. An `onSubmit` of the caller's own takes the place of the form's submit.
- `enabled: Boolean`: whether the field can be typed into.
- `readOnly: Boolean`: whether the text can only be read.
- `label: String?`: what the field is for, inside the box: the field's name for a screen reader.
- `placeholder: String?`: shown in the box while it is empty.
- `supportingText: String?`: help under the box, while the field has no error to show there.
- `leadingIcon: (@Composable () -> Unit)?`: what stands before the text, at its first line.
- `trailingIcon: (@Composable () -> Unit)?`: what stands after the text at its first line, and after the clear button.
- `showClearButton: Boolean`: shows a button that empties the field, while it can be typed into and is not empty.
- `minLines: Int`: how many lines tall the box is at the least. At least one.
- `maxLines: Int`: how many lines tall the box grows to with its text before the text scrolls in it. No fewer than `minLines`.
- `resizable: Boolean`: whether a handle in the box's bottom corner drags it taller or shorter, where the platform is used with a pointer.
- `maxLength: Int?`: the most characters the text should hold. It has to be positive.
- `overLimit: TextLimit`: what an edit past `maxLength` does: `TextLimit.Allow` takes it and puts the field in error, and `TextLimit.Block` turns it down whole.
- `showCharacterCount: Boolean`: shows the count under the box while `maxLength` is set, and past the limit how far past it.
- `onSubmit: (() -> Unit)?`: called for Ctrl and Enter, or Cmd and Enter, on a hardware keyboard, in place of the form's submit.
- `keyboardOptions: KeyboardOptions`: the keyboard's type, its capitals and its corrections. The keyboard's action is always the new line, whatever is named here.
- `inputTransformation: InputTransformation?`: what is done to the text as the user types it.
- `outputTransformation: OutputTransformation?`: how the text is shown, without changing it.
- `style: FilledTextFieldStyle?`: this call's own style, the filled text field's: over every enclosing one and under the density.
- `colors: FilledTextFieldColors?`: this call's own colours, the filled text field's, in place of the theme's roles. A disabled field is drawn in the theme's disabled colours whatever is given.
- `contentDescription: String?`: what a screen reader says for the field where it has no `label`.
- `interactionSource: MutableInteractionSource?`: the field's interactions, hoisted. It keeps a source of its own when this is null.

### TextLimit

`import com.pantrixui.components.inputs.common.TextLimit`, from `com.pantrixui:components`

```kotlin
enum class TextLimit
```

What a text area does with an edit that takes its text past its `maxLength`: takes it and shows that the text is too long, or turns it down.

Entries:

- `Allow`: The edit is taken, and the field shows that the text is too long: the count says in words how far past the limit it is, and the border and the count turn to the error's colour. A paste is kept whole, for the user to cut where they choose, rather than cut where the limit falls. A form the field is bound to is not submitted while its text is past the limit.
- `Block`: The edit is turned down whole, as a text field's limit turns it down: typing stops at the limit, and a paste that does not fit is not put in.

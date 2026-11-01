# File Drop

Where the user gives the app a file: a zone with a dashed edge that opens the platform's picker when pressed and takes the files dropped on it. Choosing and reading are the same on every platform, with foundation's file API.

- `PantrixFileDrop` (`com.pantrixui.components.elements.filedrop`, `com.pantrixui:components`): A zone that opens the platform's file picker when pressed and takes the files dropped on it, screened by kind, size and number. Keywords: upload, dropzone, file picker, drag and drop, file input, attachment.
- `PantrixFileItem` (`com.pantrixui.components.elements.filedrop`, `com.pantrixui:components`): A row for a file the app took: its name, its size or error, how far it is sent, and a button that removes it. Keywords: upload progress, attachment row, file row, uploaded file, remove file.

## Features

- **Pressing works everywhere.** Pressing the zone (or Enter or Space while it has the focus) opens the platform's picker: the documents on Android, Files on iOS, the system's window on the desktop, the browser's on the web. Where only pictures are taken, Android and iOS open the photo picker. None of them asks for a permission.
- **Dropping is a pointer's work.** On the desktop and the web files are dragged over the zone and dropped; on Android and the iPad from an app beside it too. While something is dragged over it the zone turns the primary role's colour and says "Drop to add". Its words follow suit: on the desktop and the web they put dropping first, on a phone choosing.
- **Screening.** `accept` sets the kinds taken, `maxSize` the largest size, `multiple` more than one file. Files that do not fit go to `onRejected` with their reasons (kind, size, number), the rest to `onFiles`; what to say is the app's.
- **The zone keeps no state.** The app keeps the files taken and lists them under the zone as `PantrixFileItem` rows: the name (its middle cut when long), the size in the language's way, the remove button, an optional progress and an error.
- **Reading.** A `PantrixFile` carries its name, size and type, and reads its bytes when `readBytes()` asks. The platform's own file is there too: `uri` on Android, `url` on iOS, `file` on the desktop, `domFile` on the web.
- **Screen reader.** The whole zone is one button. How many files were taken and how many were not is announced politely; with `error` the supporting text is read as the error.
- **Platform.** The zone is 140dp tall on a phone and 120dp on the desktop and the web; the rows are 56dp on a phone and 44dp under a pointer.

## Usage

### Attachments on a form

```kotlin
var attachments by remember { mutableStateOf(emptyList<PantrixFile>()) }
PantrixFileDrop(
    onFiles = { attachments += it },
    accept = listOf(PantrixFileType.Pdf, PantrixFileType.Images),
    multiple = true,
    maxSize = 10_000_000,
    supportingText = stringResource(Res.string.pdf_or_image_up_to_10_mb),
    tagKey = "attachments"
)
attachments.forEach { file ->
    PantrixFileItem(name = file.name, size = file.size, onRemove = { attachments -= file })
}
```

### A refusal, with its reason

```kotlin
var refused by remember { mutableStateOf<List<RejectedFile>>(emptyList()) }
PantrixFileDrop(
    onFiles = { avatar = it.single(); refused = emptyList() },
    accept = listOf(PantrixFileType.Images),
    maxSize = 2_000_000,
    onRejected = { refused = it },
    error = refused.isNotEmpty(),
    supportingText = if (refused.isEmpty()) stringResource(Res.string.image_up_to_2_mb)
        else stringResource(Res.string.image_too_large),
    tagKey = "avatar"
)
```

### The files of a drop zone

```kotlin
attachments.forEach { file ->
    PantrixFileItem(name = file.name, size = file.size, onRemove = { attachments -= file }, tagKey = file.name)
}
```

### A file being sent, and one that failed

```kotlin
PantrixFileItem(name = "Contract.pdf", size = 1_250_000, progress = 0.4f)
PantrixFileItem(name = "Scan.png", size = 8_400_000, error = stringResource(Res.string.too_large), onRemove = {})
```

## Examples

### Attachments: kinds, size and rows

A form's attachments: PDF or pictures, several, each at most 10 MB. Every file taken becomes a row and gets a bar that fills as if it were being sent; the remove button deletes the row. The ones not taken are written in the supporting text with their reasons.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.filedrop.FileRejection
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.filedrop.PantrixFileItem
import com.pantrixui.components.elements.filedrop.RejectedFile
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

val attachments = remember { mutableStateListOf<PantrixFile>() }
val sent = remember { mutableStateMapOf<PantrixFile, Float>() }
var refused by remember { mutableStateOf(emptyList<RejectedFile>()) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixFileDrop(
        onFiles = { files ->
            attachments += files
            refused = emptyList()
        },
        accept = listOf(PantrixFileType.Pdf, PantrixFileType.Images),
        multiple = true,
        maxSize = TEN_MEGABYTES,
        onRejected = { refused = it },
        supportingText = if (refused.isEmpty()) "PDF or a picture, each at most 10 MB" else reasonOf(refused),
        error = refused.isNotEmpty(),
        tagKey = "attachments"
    )
    attachments.forEach { file ->
        key(file) {
            SendingLater(file, sent)
            PantrixFileItem(
                name = file.name,
                size = file.size,
                onRemove = {
                    attachments -= file
                    sent -= file
                },
                progress = sent[file]?.takeIf { it < 1f },
                tagKey = file.name
            )
        }
    }
}

@Composable
private fun SendingLater(
    file: PantrixFile,
    sent: MutableMap<PantrixFile, Float>
) {
    LaunchedEffect(file) {
        if (file in sent) return@LaunchedEffect
        repeat(STEPS + 1) { step ->
            sent[file] = step / STEPS.toFloat()
            delay(STEP_MILLIS)
        }
    }
}

private fun reasonOf(refused: List<RejectedFile>): String = refused.groupBy { it.reason }.entries.joinToString(" · ") {
    val names = it.value.joinToString { rejected -> rejected.file.name }
    when (it.key) {
        FileRejection.Type -> "This kind is not taken: $names"
        FileRejection.Size -> "Too large: $names"
        FileRejection.Count -> "Only one file is taken: $names"
    }
}

private const val TEN_MEGABYTES = 10_000_000L

private const val STEPS = 10

private const val STEP_MILLIS = 150L
```

### One picture and the reason it was refused

One picture, at most 2 MB: a profile picture. On a phone the photo picker opens. The chosen picture is read and shown; a larger one, or a file that is no picture, is refused, and why is written under the zone as an error.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.filedrop.FileRejection
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.filedrop.PantrixFileItem
import com.pantrixui.components.elements.filedrop.RejectedFile
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.decodeToImageBitmap

var avatar by remember { mutableStateOf<PantrixFile?>(null) }
var refused by remember { mutableStateOf<RejectedFile?>(null) }
var picture by remember { mutableStateOf<ImageBitmap?>(null) }
LaunchedEffect(avatar) {
    // The bytes are read only when asked for: here, once the zone's work is done.
    picture = avatar?.let { file -> runCatching { file.readBytes().decodeToImageBitmap() }.getOrNull() }
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixFileDrop(
        onFiles = { files ->
            avatar = files.single()
            refused = null
        },
        accept = listOf(PantrixFileType.Images),
        maxSize = TWO_MEGABYTES,
        onRejected = { refused = it.first() },
        label = "Choose a profile picture",
        supportingText = refused?.let { reasonOf(listOf(it)) } ?: "PNG, JPEG or WebP, at most 2 MB",
        error = refused != null,
        tagKey = "avatar"
    )
    picture?.let {
        PantrixImage(bitmap = it, contentDescription = "The chosen picture", modifier = Modifier.size(PICTURE_SIZE))
    }
    avatar?.let { PantrixFileItem(name = it.name, size = it.size, onRemove = { avatar = null }, tagKey = "avatar") }
}

private fun reasonOf(refused: List<RejectedFile>): String = refused.groupBy { it.reason }.entries.joinToString(" · ") {
    val names = it.value.joinToString { rejected -> rejected.file.name }
    when (it.key) {
        FileRejection.Type -> "This kind is not taken: $names"
        FileRejection.Size -> "Too large: $names"
        FileRejection.Count -> "Only one file is taken: $names"
    }
}

private val PICTURE_SIZE = 96.dp

private const val TWO_MEGABYTES = 2_000_000L
```

### The zone's own words, colours, and disabled

The zone's own words and colours: the caller writes its first line, and its fill and edge are the app's own colour. While the switch is off the zone takes nothing: it is not pressed, what is dropped on it is not taken, and it is drawn faint.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.filedrop.FileDropColors
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(true) }
var taken by remember { mutableStateOf(0) }
val own = ownColors()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = open, onCheckedChange = { open = it }, label = "The zone takes files", tagKey = "accepting")
    PantrixFileDrop(
        onFiles = { taken += it.size },
        multiple = true,
        label = "Drop your reports here",
        enabled = open,
        colors = FileDropColors(container = own.container, border = own.color, action = own.color),
        tagKey = "reports"
    )
    PantrixText(
        text = "Files taken: $taken",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "taken"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### A low area and dense rows in their own style

In their own style: `FileDropStyle` gives the drop area's height, its dashed line and its corners, `FileItemStyle` a file row's height and its progress line. Every field not given is the platform's preset.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.filedrop.FileDropStyle
import com.pantrixui.components.elements.filedrop.FileItemStyle
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.filedrop.PantrixFileItem
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val files = remember { mutableStateListOf<PantrixFile>() }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixFileDrop(
        onFiles = { files += it },
        multiple = true,
        style = FileDropStyle(minHeight = 72.dp, shape = ShapeRole.Large, dashLength = 4.dp, dashGap = 4.dp),
        tagKey = "low"
    )
    files.forEach { file ->
        key(file) {
            PantrixFileItem(
                name = file.name,
                size = file.size,
                onRemove = { files -= file },
                style = FileItemStyle(minHeight = 40.dp, verticalPadding = 4.dp, progressHeight = 2.dp),
                tagKey = file.name
            )
        }
    }
}
```

## API

### PantrixFileDrop

`import com.pantrixui.components.elements.filedrop.PantrixFileDrop`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFileDrop(
    onFiles: (List<PantrixFile>) -> Unit,
    modifier: Modifier = Modifier,
    accept: List<PantrixFileType> = listOf(PantrixFileType.Any),
    multiple: Boolean = false,
    maxSize: Long? = null,
    onRejected: (List<RejectedFile>) -> Unit = {},
    label: String? = null,
    supportingText: String? = null,
    enabled: Boolean = true,
    error: Boolean = false,
    picker: FilePicker = rememberFilePicker(),
    interactionSource: MutableInteractionSource? = null,
    style: FileDropStyle? = null,
    colors: FileDropColors? = null,
    tagKey: String? = null
)
```

Somewhere to give the app a file: a zone with a dashed edge that opens the platform's picker when it is pressed, and takes the files dropped on it from the platform's files, another app or another window.

The press is the way in on every platform, and the only one where nothing is dragged in: a phone, a keyboard, a screen reader. The zone says so in its words, which put the drop first under a pointer, on the desktop and the web, and the picker first on a phone. Where only pictures are taken (`PantrixFileType.Images`), Android and iOS open their photo picker.

What is chosen or dropped is screened before the app is handed it: a file of a kind not in `accept`, one larger than `maxSize`, and, where only one is taken, every one after the first go to `onRejected` with the reason, and the rest to `onFiles`. The zone keeps nothing: what was taken is the app's to list, with `PantrixFileItem`s under the zone, and what was not is the app's to say, in `supportingText` with `error`. A screen reader is told politely how many files the zone took and how many it did not.

Nothing is read here: a `PantrixFile` reads its bytes when the app asks it to, which a large file should be read for off the screen's work, and sent where it goes as it is read.

```kotlin
PantrixFileDrop(
    onFiles = { files -> attachments += files },
    accept = listOf(PantrixFileType.Pdf),
    multiple = true,
    maxSize = 10_000_000,
    onRejected = { refused = it },
    supportingText = stringResource(Res.string.pdf_up_to_10_mb),
    tagKey = "attachments"
)
```

Parameters:

- `onFiles: (List<PantrixFile>) -> Unit`: handed the files the zone took, at least one, in the order they came.
- `modifier: Modifier`: the zone's modifier, with its supporting text. The zone fills the width it is given.
- `accept: List<PantrixFileType>`: the kinds of file the zone takes. The picker shows only these, where the platform's can filter.
- `multiple: Boolean`: whether the zone takes more than one file at a time.
- `maxSize: Long?`: the most bytes a file the zone takes may have, or null for any size.
- `onRejected: (List<RejectedFile>) -> Unit`: handed the files the zone did not take, each with why, at least one.
- `label: String?`: what the zone says first, in place of the platform's words.
- `supportingText: String?`: a line under the zone: what it takes and how large, or what was wrong.
- `enabled: Boolean`: whether the zone takes anything: a press or a drop. A zone that does not is drawn faint.
- `error: Boolean`: whether the zone shows that what it was given was not right: its edge and its supporting text in the danger colour. A screen reader hears the supporting text as the error.
- `picker: FilePicker`: what a press opens: the platform's own picker, or a test's.
- `interactionSource: MutableInteractionSource?`: the zone's interactions: its press, its hover and its focus.
- `style: FileDropStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: FileDropColors?`: this zone's own colours: the ones it sets, with the theme's for the rest.
- `tagKey: String?`: the zone's automation key: it is `FileDrop_<tagKey>`.

### PantrixFileItem

`import com.pantrixui.components.elements.filedrop.PantrixFileItem`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixFileItem(
    name: String,
    modifier: Modifier = Modifier,
    size: Long? = null,
    onRemove: (() -> Unit)? = null,
    progress: Float? = null,
    error: String? = null,
    icon: ImageVector = PantrixIcons.File,
    enabled: Boolean = true,
    style: FileItemStyle? = null,
    tagKey: String? = null
)
```

A file the app took, in a row: its icon, its name, its size or what went wrong with it, how far it is sent, and the button that takes it away. The rows stand under a `PantrixFileDrop`, each for a file the app keeps.

A long name is cut in its middle, so that its start and its extension both show: `Quarterly rep….pdf`. The size is written as the language writes one, `1,2 MB` in Turkish; an `error` stands in its place, in the danger colour, and the row's edge turns that colour too. A `progress` draws a bar under the words, filled from the start of the reading direction, and a screen reader hears it as one.

A screen reader hears the row as one thing, its name and its size or error, and the button apart from it, named for what it removes: `Remove report.pdf`.

```kotlin
PantrixFileItem(name = file.name, size = file.size, onRemove = { attachments -= file }, progress = sent[file])
```

Parameters:

- `name: String`: what the file is called.
- `modifier: Modifier`: the row's modifier. The row fills the width it is given.
- `size: Long?`: how many bytes the file has, or null to say nothing of it.
- `onRemove: (() -> Unit)?`: what the remove button does, or null for a row with no button.
- `progress: Float?`: how much of the file is sent, from nought to one, or null for no bar.
- `error: String?`: what went wrong with the file, in the place of its size, or null.
- `icon: ImageVector`: what stands before the name: a file by default.
- `enabled: Boolean`: whether the remove button can be pressed. A row that cannot is drawn faint.
- `style: FileItemStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `tagKey: String?`: the row's automation key: it is `FileItem_<tagKey>`, and its button's `IconButton_remove` inside it. Tagged only when given one.

### FileDropStyle

`import com.pantrixui.components.elements.filedrop.FileDropStyle`, from `com.pantrixui:components`

```kotlin
class FileDropStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val dashLength: Dp = Dp.Unspecified,
    public val dashGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<FileDropStyle>
```

`PantrixFileDrop`'s geometry: the zone, its dashed edge and what stands in it.

No platform has a drop zone of its own. The zone is tall enough to be a target from across a screen, taller on a phone, where a thumb presses it, than under a pointer; its corners are a card's, and its edge is dashed: a solid edge reads as a card, a dashed one as a place to put something.

The least height, the room inside, the gaps and the dashes' gaps follow the density. The edge's width, the dashes' length, the corners and the icon do not.

Parameters:

- `shape: ShapeSpec`: The zone's corners: a step of the brand's shape scale, or a fixed shape.
- `minHeight: Dp`: The least height of the zone. A larger type makes it taller.
- `padding: Dp`: The room between the zone's edge and what stands in it.
- `borderWidth: Dp`: The width of the dashed edge.
- `dashLength: Dp`: The length of each of the edge's dashes.
- `dashGap: Dp`: The room between two dashes.
- `iconSize: Dp`: The width and height of the icon over the zone's words.
- `gap: Dp`: Between the icon and the words, and between the two lines of words.

### FileDropColors

`import com.pantrixui.components.elements.filedrop.FileDropColors`, from `com.pantrixui:components`

```kotlin
data class FileDropColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val action: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val overContainer: Color = Color.Unspecified,
    public val overContent: Color = Color.Unspecified,
    public val overBorder: Color = Color.Unspecified,
    public val error: Color = Color.Unspecified,
    public val supporting: Color = Color.Unspecified
)
```

What a `PantrixFileDrop` is painted with, in place of the theme's colours: a colour that is set is used, and one that is left out stays the theme's.

A `container` given here that is one of the theme's role colours brings the colour the theme pairs with it for what is written in the zone, unless `content` is given too, and an `overContainer` brings its pair for the zone something is dragged over, unless `overContent` is given. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The zone's fill. The theme's `surface`.
- `content: Color`: The zone's first line and its icon. The theme's `textPrimary`, or the colour a role's fill given as `container` gives what stands on it.
- `action: Color`: The second line, the press that opens the picker, as a link is. The primary role's `color` on the theme's own grounds, and `content` on another fill.
- `border: Color`: The dashed edge. The theme's `border`, `borderHover` under a pointer, on its own grounds; a share of `content` on another fill, as a line on a fill is.
- `overContainer: Color`: The zone's fill while something is dragged over it. The primary role's `container`.
- `overContent: Color`: What is written in it then. The primary role's `onContainer`.
- `overBorder: Color`: The edge then. The primary role's `color`.
- `error: Color`: The edge and the supporting text of a zone that shows an error. The danger role's `color`.
- `supporting: Color`: The supporting text under the zone. The theme's `textSecondary`.

### FileItemStyle

`import com.pantrixui.components.elements.filedrop.FileItemStyle`, from `com.pantrixui:components`

```kotlin
class FileItemStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val progressHeight: Dp = Dp.Unspecified
) : PantrixStyle<FileItemStyle>
```

`PantrixFileItem`'s geometry: a row for a file the app took, with its icon, its name and size, and the button that takes it away.

The row is a list's row: as tall as one on each platform, 56dp on a phone, where a thumb presses its button, and 44dp under a pointer. Its corners and its edge are a card's, a step lower than the zone's on a phone.

The least height, the room inside, the gap and the progress bar's height follow the density. The edge's width, the corners and the icon do not.

Parameters:

- `shape: ShapeSpec`: The row's corners.
- `minHeight: Dp`: The least height of the row. A larger type, a progress bar or an error makes it taller.
- `horizontalPadding: Dp`: The room between the row's sides and what it holds.
- `verticalPadding: Dp`: The room above and below what it holds.
- `borderWidth: Dp`: The width of the row's edge.
- `iconSize: Dp`: The width and height of the file's icon.
- `gap: Dp`: Between the icon, the words and the button, and between the words and the progress bar.
- `progressHeight: Dp`: The height of the progress bar under the words.

### RejectedFile

`import com.pantrixui.components.elements.filedrop.RejectedFile`, from `com.pantrixui:components`

```kotlin
class RejectedFile(
    public val file: PantrixFile,
    public val reason: FileRejection
)
```

A file a `PantrixFileDrop` did not take, and why: what the app says to the user, in the zone's supporting text, is its own to word.

Parameters:

- `file: PantrixFile`: the file the zone did not take.
- `reason: FileRejection`: why it did not.

### FileRejection

`import com.pantrixui.components.elements.filedrop.FileRejection`, from `com.pantrixui:components`

```kotlin
enum class FileRejection
```

Why a drop zone did not take a file.

Entries:

- `Type`: The file is of no kind the zone takes.
- `Size`: It is larger than the most the zone takes.
- `Count`: The zone takes one file, and this one came after the one it took.

### PantrixFile

`import com.pantrixui.foundation.files.PantrixFile`, from `com.pantrixui:foundation`

```kotlin
class PantrixFile
```

A file the user gave the app: chosen in the platform's picker (`rememberFilePicker`) or dropped on a drop target (`fileDropTarget`), on every platform the same.

Common Compose has no file of its own: a chosen or a dropped file comes in each platform's own type, a content `Uri` on Android, an `NSURL` on iOS, a `java.io.File` on the desktop and a `File` of the browser on the web. This is the one an app's common code takes, and the platform's own is still there for the code that needs it: `uri`, `url`, `file` and `domFile`, each in its platform's source set.

Nothing is read until `readBytes` is called. A file is not a value: two files of one name and one size are two files, as two sheets of paper are.

```kotlin
picker.pick(FilePickRequest(accept = listOf(PantrixFileType.Pdf))) { files ->
    scope.launch { upload(files.first().name, files.first().readBytes()) }
}
```

Parameters:

- `name: String`: what the file is called, with its extension where it has one, and without the folders it is in.
- `size: Long?`: how many bytes the file has, or null where the platform does not say.
- `mimeType: String`: what the file holds, as a MIME type: what the platform says, or what its extension does, or `application/octet-stream`.

Another constructor:

```kotlin
constructor(
    name: String,
    bytes: ByteArray,
    mimeType: String = mimeTypeOf(name)
)
```

A file held in memory: one the app made itself, or a test's, in the place of one the user chose.

Its parameters:

- `name: String`: what the file is called.
- `bytes: ByteArray`: what it holds. They are copied: changing the array afterwards does not change the file.
- `mimeType: String`: what it holds, as a MIME type: by default the one its name's extension stands for. `mimeTypeOf`: The MIME type a file named `name` holds by its extension, or `application/octet-stream`: for a file whose platform did not say, and for one made in memory.

Members:

- `suspend fun readBytes(): ByteArray`: Reads the whole file into memory, off the main thread where the platform reads from a disk. A file that is no longer there, or that the app may no longer read, throws the platform's error.

### PantrixFileType

`import com.pantrixui.foundation.files.PantrixFileType`, from `com.pantrixui:foundation`

```kotlin
class PantrixFileType(
    public val mimeType: String,
    public val extensions: List<String> = emptyList()
)
```

A kind of file an app takes: a MIME type, whose subtype may be a wildcard (`image` with any subtype is `Images`'s), and the extensions files of that kind are named with.

Each platform's picker is told the kind its own way: Android and the web by the MIME type, iOS by the uniform type the MIME type and the extensions stand for, and the desktop's window by the extensions. A file fits the kind when its MIME type does or its extension is one of `extensions`, so a file whose platform could not say what it holds is still known by its name.

```kotlin
val spreadsheets = PantrixFileType("text/csv", listOf("csv"))
```

Parameters:

- `mimeType: String`: the kind's MIME type: `type/subtype`, either of which may be `*`.
- `extensions: List<String>`: the extensions files of the kind are named with, without their dot, in any case.

Members:

- `fun accepts(file: PantrixFile): Boolean`: Whether `file` is of this kind: its MIME type is, or its name ends in one of the extensions.

On the type:

- `PantrixFileType.Any: PantrixFileType`: Every file.
- `PantrixFileType.Images: PantrixFileType`: Pictures: photos, screenshots, drawings. Where only these are taken, a phone opens its photo picker.
- `PantrixFileType.Videos: PantrixFileType`: Films and recordings with pictures.
- `PantrixFileType.Audio: PantrixFileType`: Sound: music, voice notes.
- `PantrixFileType.Pdf: PantrixFileType`: PDF documents.
- `PantrixFileType.Text: PantrixFileType`: Plain text, of any kind: notes, logs, comma-separated values.

### FilePicker

`import com.pantrixui.foundation.files.FilePicker`, from `com.pantrixui:foundation`

```kotlin
fun interface FilePicker
```

Opens the platform's own picker for files, and hands the app what the user chose.

`rememberFilePicker` gives the platform's: Android's documents (`ACTION_OPEN_DOCUMENT`), iOS's Files, the desktop's own window and the browser's. Where only pictures are asked for (`FilePickRequest.imagesOnly`), Android and iOS open their photo picker instead. None of them asks for a permission.

A test, or a screen shown before a picker exists, gives one of its own:

```kotlin
val picker = FilePicker { _, onPicked -> onPicked(listOf(PantrixFile("report.pdf", bytes))) }
```

Members:

- `fun pick(request: FilePickRequest, onPicked: (List<PantrixFile>) -> Unit)`: Opens the picker for `request`. `onPicked` is called on the main thread with what the user chose, in the order the platform gives it, and is not called when the user chose nothing.

### FilePickRequest

`import com.pantrixui.foundation.files.FilePickRequest`, from `com.pantrixui:foundation`

```kotlin
class FilePickRequest(
    public val accept: List<PantrixFileType> = listOf(PantrixFileType.Any),
    public val multiple: Boolean = false
)
```

What a picker is asked for: the kinds of file it shows, and whether the user may choose more than one.

Parameters:

- `accept: List<PantrixFileType>`: the kinds of file the picker shows. A file of none of them cannot be chosen, where the platform's picker can tell: the desktop's window on Windows cannot, and shows every file.
- `multiple: Boolean`: whether the user may choose more than one file.

Members:

- `fun accepts(file: PantrixFile): Boolean`: Whether `file` is of a kind the picker shows.
- `imagesOnly: Boolean`: Whether only pictures are asked for: every kind is an image's. Android and iOS then open their photo picker, where a user's pictures are, in place of their files.

### rememberFilePicker

`import com.pantrixui.foundation.files.rememberFilePicker`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFilePicker(): FilePicker
```

The platform's own picker for files: see `FilePicker`. On Android it needs an activity that keeps results, a `ComponentActivity`, as every Compose activity is. Where `LocalFilePicker` gives a picker, it is that one.

### Modifier.fileDropTarget

`import com.pantrixui.foundation.files.fileDropTarget`, from `com.pantrixui:foundation`

```kotlin
fun Modifier.fileDropTarget(
    enabled: Boolean = true,
    onOver: (Boolean) -> Unit = {},
    onFiles: (List<PantrixFile>) -> Unit
): Modifier
```

Takes the files dropped on this element, from the platform's files, another app or another window, as `PantrixFile`s.

Compose hands a drop over in each platform's own type: a `DragEvent` whose `ClipData` holds content `Uri`s on Android, `UIDragItem`s whose providers still have to load their files on iOS, a list of file addresses on the desktop, and a `DataTransfer` on the web whose files can be read only while the drop lasts. This turns each into the same list. On Android it asks the activity for the right to read what another app dropped, which a drop that is not asked for loses; on iOS it copies each file into the app's temporary folder, as a provider's file is gone when its loading ends.

Dragging a file in is a pointer's gesture, and some platforms never have one: a phone with no other app beside it. A drop target is never the only way to give an app a file: put a `FilePicker` beside it, on the same press.

```kotlin
Box(Modifier.fileDropTarget(onOver = { over = it }) { files -> attach(files) })
```

Parameters:

- `enabled: Boolean`: whether a drop is taken. A target that is not does not light up either: it is never told something is over it.
- `onOver: (Boolean) -> Unit`: told true when something that may hold files is dragged over this element, and false when it leaves, is dropped or the drag ends somewhere else.
- `onFiles: (List<PantrixFile>) -> Unit`: handed the files of a drop, on the main thread. It is not called for a drop that held none; on iOS it is called once the files are loaded, a moment after the drop.

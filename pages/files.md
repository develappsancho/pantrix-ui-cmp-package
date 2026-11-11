# Files

Files, without a component: the platform's own file picker and files dropped on a place. `PantrixFileDrop` is built on these two; a screen that wants a look of its own uses them directly.

## Features

- **Picker.** `rememberFilePicker()` gives the platform's picker (`FilePicker`); `pick(request) { files -> … }` opens it and hands over what was chosen. `FilePickRequest` says what is shown (`accept`) and whether several files can be chosen (`multiple`). Where only pictures are asked for, Android and iOS open their photo picker.
- **Dropping.** `Modifier.fileDropTarget(onOver, onFiles)` takes the files dropped on an element: on the desktop and the web, from another app or another window. `onOver` says `true` while files are over it.
- **Saving.** `rememberFileSaver()` gives the platform's window for saving a file (`FileSaver`); `save(file) { result -> … }` writes the file where the user chooses and says what became of it (`FileSaveResult`): the window for a new document on Android, Files on iOS, the save dialog on the desktop, the browser's download on the web.
- **File.** `PantrixFile` carries its name, size and type; its content is read when it is asked for.
- **A screen's picker.** Where `LocalFilePicker` gives a picker, `rememberFilePicker()` returns it in the place of the platform's: a preview or a test gives every picker of a screen the same one at once. `LocalFileSaver` does the same for the saver.

## Examples

### Having a file chosen

The platform's own picker: "Choose PDFs" shows only PDFs and lets several files be chosen (`FilePickRequest(accept = listOf(PantrixFileType.Pdf), multiple = true)`). The chosen ones are written underneath with their names and sizes; on a cancel the list comes empty.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FilePickRequest
import com.pantrixui.foundation.files.FilePicker
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.files.rememberFilePicker
import com.pantrixui.foundation.theme.PantrixTheme

val picker: FilePicker = rememberFilePicker()
var chosen by remember { mutableStateOf(emptyList<PantrixFile>()) }
PantrixButton(
    text = "Choose PDFs",
    onClick = {
        picker.pick(FilePickRequest(accept = listOf(PantrixFileType.Pdf), multiple = true)) { files ->
            chosen = files
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "pick_pdf"
)
FileLines(files = chosen, empty = "No file chosen")

@Composable
private fun FileLines(
    files: List<PantrixFile>,
    empty: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (files.isEmpty()) {
            PantrixText(text = empty, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
        }
        files.forEach { file ->
            val size = file.size?.let { bytes -> " · ${(bytes + 1023) / 1024} KB" }.orEmpty()
            PantrixText(text = "${file.name}$size", style = PantrixTheme.typography.footnote)
        }
    }
}
```

### Files dropped on a place

Files dropped on a place: the box carries `fileDropTarget`. On the desktop or the web, drag a file over the box: the box takes a colour while it is over it, and on a drop the files are written underneath. On a phone files are not dropped; the picker is used there.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.fileDropTarget
import com.pantrixui.foundation.theme.PantrixTheme

var over by remember { mutableStateOf(false) }
var dropped by remember { mutableStateOf(emptyList<PantrixFile>()) }
val colors = PantrixTheme.colors
Box(
    modifier = Modifier
        .fillMaxWidth()
        .height(96.dp)
        .background(if (over) colors.primary.container else Color.Transparent, PantrixTheme.shapes.md)
        .border(1.dp, if (over) colors.primary.color else colors.border, PantrixTheme.shapes.md)
        .fileDropTarget(onOver = { over = it }, onFiles = { files -> dropped = files }),
    contentAlignment = Alignment.Center
) {
    PantrixText(text = if (over) "Drop" else "Drag files here", color = colors.textSecondary)
}
FileLines(files = dropped, empty = "No file dropped")

@Composable
private fun FileLines(
    files: List<PantrixFile>,
    empty: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (files.isEmpty()) {
            PantrixText(text = empty, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
        }
        files.forEach { file ->
            val size = file.size?.let { bytes -> " · ${(bytes + 1023) / 1024} KB" }.orEmpty()
            PantrixText(text = "${file.name}$size", style = PantrixTheme.typography.footnote)
        }
    }
}
```

### A screen with sample files

Giving a screen its picker from outside: while "Sample files" is on, the screen gets a sample picker through `LocalFilePicker`, and "Choose an offer" gives two sample files without opening the platform's picker; while it is off, the platform's picker opens. The screen itself does not change, it calls `rememberFilePicker()`: a preview or a test checks it this way. `PantrixFileDrop` takes its default picker from here too.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FilePickRequest
import com.pantrixui.foundation.files.FilePicker
import com.pantrixui.foundation.files.LocalFilePicker
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.files.rememberFilePicker
import com.pantrixui.foundation.theme.PantrixTheme

var samples by remember { mutableStateOf(true) }
val sample = remember {
    FilePicker { _, onPicked ->
        onPicked(listOf(PantrixFile("offer.pdf", ByteArray(48_000)), PantrixFile("attachment.pdf", ByteArray(12_000))))
    }
}
PantrixSwitchButton(
    checked = samples,
    onCheckedChange = { samples = it },
    label = "Sample files",
    tagKey = "sample_files"
)
CompositionLocalProvider(LocalFilePicker provides sample.takeIf { samples }) {
    OfferScreen()
}

@Composable
private fun OfferScreen() {
    val picker = rememberFilePicker()
    var chosen by remember { mutableStateOf(emptyList<PantrixFile>()) }
    PantrixButton(
        text = "Choose an offer",
        onClick = {
            picker.pick(FilePickRequest(accept = listOf(PantrixFileType.Pdf), multiple = true)) { chosen = it }
        },
        variant = ButtonVariant.Outline,
        tagKey = "pick_offer"
    )
    FileLines(files = chosen, empty = "No offer chosen")
}

@Composable
private fun FileLines(
    files: List<PantrixFile>,
    empty: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (files.isEmpty()) {
            PantrixText(text = empty, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
        }
        files.forEach { file ->
            val size = file.size?.let { bytes -> " · ${(bytes + 1023) / 1024} KB" }.orEmpty()
            PantrixText(text = "${file.name}$size", style = PantrixTheme.typography.footnote)
        }
    }
}
```

### Having a file saved

Handing the user a file the app made: "Save the note" opens the platform's window for saving, the file is written where the user chose, and what became of it is written underneath: saved, cancelled, or on the web the download started.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FileSaveResult
import com.pantrixui.foundation.files.FileSaver
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.rememberFileSaver
import com.pantrixui.foundation.theme.PantrixTheme

val saver: FileSaver = rememberFileSaver()
var result by remember { mutableStateOf<FileSaveResult?>(null) }
PantrixButton(
    text = "Save the note",
    onClick = {
        val note = PantrixFile("note.txt", "Monday: go over the design".encodeToByteArray())
        saver.save(note) { result = it }
    },
    variant = ButtonVariant.Outline,
    tagKey = "save_note"
)
SaveLine(result, tagKey = "note_result")

@Composable
private fun SaveLine(
    result: FileSaveResult?,
    tagKey: String
) {
    PantrixText(
        text = when (result) {
            null -> "Not saved yet"
            FileSaveResult.Saved -> "Saved"
            FileSaveResult.Cancelled -> "Cancelled"
            FileSaveResult.Started -> "The download started"
            FileSaveResult.Failed -> "Could not be saved"
        },
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}
```

### A screen with a sample saver

Giving a screen its saver from outside: while "Sample saver" is on, the screen is given a saver through `LocalFileSaver`, and "Save the report" takes the file without opening a window and says it was saved; while it is off, the platform's window opens. A preview or a test checks a screen this way, without changing it.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FileSaveResult
import com.pantrixui.foundation.files.FileSaver
import com.pantrixui.foundation.files.LocalFileSaver
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.rememberFileSaver
import com.pantrixui.foundation.theme.PantrixTheme

var sample by remember { mutableStateOf(true) }
val kept = remember { FileSaver { _, onResult -> onResult(FileSaveResult.Saved) } }
PantrixSwitchButton(
    checked = sample,
    onCheckedChange = { sample = it },
    label = "Sample saver",
    tagKey = "sample_saver"
)
CompositionLocalProvider(LocalFileSaver provides kept.takeIf { sample }) {
    ReportScreen()
}

@Composable
private fun ReportScreen() {
    val saver = rememberFileSaver()
    var result by remember { mutableStateOf<FileSaveResult?>(null) }
    PantrixButton(
        text = "Save the report",
        onClick = { saver.save(PantrixFile("report.csv", "month,visits\noctober,1200".encodeToByteArray())) { result = it } },
        variant = ButtonVariant.Outline,
        tagKey = "save_report"
    )
    SaveLine(result, tagKey = "report_result")
}

@Composable
private fun SaveLine(
    result: FileSaveResult?,
    tagKey: String
) {
    PantrixText(
        text = when (result) {
            null -> "Not saved yet"
            FileSaveResult.Saved -> "Saved"
            FileSaveResult.Cancelled -> "Cancelled"
            FileSaveResult.Started -> "The download started"
            FileSaveResult.Failed -> "Could not be saved"
        },
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}
```

## API

### rememberFilePicker

`import com.pantrixui.foundation.files.rememberFilePicker`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFilePicker(): FilePicker
```

The platform's own picker for files: see `FilePicker`. On Android it needs an activity that keeps results, a `ComponentActivity`, as every Compose activity is. Where `LocalFilePicker` gives a picker, it is that one.

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

### LocalFilePicker

`import com.pantrixui.foundation.files.LocalFilePicker`, from `com.pantrixui:foundation`

```kotlin
val LocalFilePicker: ProvidableCompositionLocal<FilePicker?>
```

The picker `rememberFilePicker` gives inside it: what a test or a preview puts in the place of the platform's, for every file drop zone of a screen at once. Null, the default, leaves the platform's.

### rememberFileSaver

`import com.pantrixui.foundation.files.rememberFileSaver`, from `com.pantrixui:foundation`

```kotlin
@Composable
fun rememberFileSaver(): FileSaver
```

The platform's own window for saving a file: see `FileSaver`. On Android it needs an activity that keeps results, a `ComponentActivity`, as every Compose activity is. Where `LocalFileSaver` gives a saver, it is that one.

### FileSaver

`import com.pantrixui.foundation.files.FileSaver`, from `com.pantrixui:foundation`

```kotlin
fun interface FileSaver
```

Hands the user a file the app made, to keep where they choose: the platform's own window for saving a file, the other half of `FilePicker`.

`rememberFileSaver` gives the platform's: Android's documents (`ACTION_CREATE_DOCUMENT`), iOS's Files, the desktop's own window and the browser's download. None of them asks for a permission: the user's choice of a place is the leave to write there.

```kotlin
val saver = rememberFileSaver()
PantrixButton(
    text = stringResource(Res.string.download_theme),
    onClick = { saver.save(PantrixFile("Theme.kt", source.encodeToByteArray())) { result -> show(result) } }
)
```

A test, or a screen shown before a saver exists, gives one of its own:

```kotlin
val saver = FileSaver { file, onResult -> kept += file; onResult(FileSaveResult.Saved) }
```

Members:

- `fun save(file: PantrixFile, onResult: (FileSaveResult) -> Unit)`: Asks the user where to keep `file`, under its name and as its type, and writes it there. `onResult` is called once, on the main thread, with what became of it. The browser's saver is called from a user's press, as its picker is: a browser may hold back a download no press asked for.

### FileSaveResult

`import com.pantrixui.foundation.files.FileSaveResult`, from `com.pantrixui:foundation`

```kotlin
enum class FileSaveResult
```

What became of a file given to `FileSaver.save`.

Entries:

- `Saved`: The user chose a place, and the file was written there.
- `Cancelled`: The user closed the platform's window without choosing a place: nothing was written.
- `Started`: The file was handed to the browser, which keeps it as its user has it set to: in the downloads folder, or where it asks. A page is told no more than that.
- `Failed`: The file could not be read, or the place the user chose could not be written.

### LocalFileSaver

`import com.pantrixui.foundation.files.LocalFileSaver`, from `com.pantrixui:foundation`

```kotlin
val LocalFileSaver: ProvidableCompositionLocal<FileSaver?>
```

The saver `rememberFileSaver` gives inside it: what a test or a preview puts in the place of the platform's. Null, the default, leaves the platform's.

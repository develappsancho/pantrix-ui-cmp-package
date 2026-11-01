# com.pantrixui:testing

Test helpers for apps built on Pantrix UI: finding components by their tags, a test theme and doubles.

## Paket com.pantrixui.testing

### ComposeUiTest.assertNoFindings

`import com.pantrixui.testing.assertNoFindings`, `com.pantrixui:testing` içinden

```kotlin
fun ComposeUiTest.assertNoFindings(findings: PantrixFindings)
```

Asserts that the theme's diagnostics found nothing on the screen: no control without a name, no words too faint to read on what they stand on, no touch target squeezed, no tag on two nodes. A squeezed touch target is reported once it has lasted half a second and a tag on two nodes once it has lasted a second and a half, so the test's clock is moved on past that first. `findings` is the sink the screen's theme was given, as `PantrixTestTheme`'s `findings`.

Parametreler:

- `findings: PantrixFindings`

### SemanticsNodeInteraction.assertHasName

`import com.pantrixui.testing.assertHasName`, `com.pantrixui:testing` içinden

```kotlin
fun SemanticsNodeInteraction.assertHasName(name: String): SemanticsNodeInteraction
```

Asserts that a screen reader names the node `name`: by what describes it where something does, its content description, and otherwise by its text. A control a screen reader names by nothing is a finding of the diagnostics as well.

Parametreler:

- `name: String`

### SemanticsNodeInteraction.assertTouchTargetOf

`import com.pantrixui.testing.assertTouchTargetOf`, `com.pantrixui:testing` içinden

```kotlin
fun SemanticsNodeInteraction.assertTouchTargetOf(platform: PlatformType): SemanticsNodeInteraction
```

Asserts that a finger has as much of the node to press, each way, as `platform` asks of a control: `PantrixPlatform.forType`'s, 48dp on Android, 44pt on iOS and 32dp for a mouse on the desktop and the web. What counts is the region that takes a press, which may reach past what is drawn.

Parametreler:

- `platform: PlatformType`

### SemanticsNodeInteraction.performShortcut

`import com.pantrixui.testing.performShortcut`, `com.pantrixui:testing` içinden

```kotlin
fun SemanticsNodeInteraction.performShortcut(
    shortcut: PantrixShortcut,
    system: OperatingSystem
): SemanticsNodeInteraction
```

Presses `shortcut` on the node as a keyboard of `system` does: Command leads it on Apple's systems and Control on the others, so that one test of `PantrixShortcut(Key.K, command = true)` presses `⌘K` on a Mac and `Ctrl+K` elsewhere. The screen answers it where it is typed on `system` too: `PantrixTestTheme`'s `system`. The node takes the keys where it has the focus or holds what has it.

Parametreler:

- `shortcut: PantrixShortcut`
- `system: OperatingSystem`

### SemanticsNodeInteraction.readText

`import com.pantrixui.testing.readText`, `com.pantrixui:testing` içinden

```kotlin
fun SemanticsNodeInteraction.readText(): String
```

The text the node shows: what it holds where it is a text field, and otherwise its texts and those of what it merges, in their order, one to a line. Empty where it shows none.

### hasPantrixTag

`import com.pantrixui.testing.hasPantrixTag`, `com.pantrixui:testing` içinden

```kotlin
fun hasPantrixTag(
    component: String,
    tagKey: String? = null,
    scope: String? = null
): SemanticsMatcher
```

Whether a node carries the automation tag of the Pantrix component `component` given `tagKey`, inside `scope`: `hasPantrixTag("Button", "save", scope = "Checkout")` is the node tagged `Checkout.Button_save`. A test names the component and its key as the screen's code does, and the tag is built as the component builds it, so that a key written `Save draft` is found as `Button_save_draft`.

Without `tagKey`, a node of the component matches whatever its key, and so does one of a component given none: every button of the scope. Without `scope`, the tag has none, and a component inside a `TestScope` is found by naming its scope. A part of a control with a key stands inside the control's tag: the segment `newest` of a segment button keyed `sort` is `hasPantrixTag("Segment", "newest", scope = "SegmentButton_sort")`.

Parametreler:

- `component: String`: the component's name, as its tag begins: `Button`, `TextField`, `Chart`.
- `tagKey: String?`: the key the component was given, as the screen's code wrote it; null for any key.
- `scope: String?`: the chain of `TestScope`s the component stands in, `Checkout.Payment`, or the tag of the control a part stands in; null outside one.

### SemanticsNodeInteractionsProvider.onPantrixNode

`import com.pantrixui.testing.onPantrixNode`, `com.pantrixui:testing` içinden

```kotlin
fun SemanticsNodeInteractionsProvider.onPantrixNode(
    component: String,
    tagKey: String? = null,
    scope: String? = null,
    useUnmergedTree: Boolean = false
): SemanticsNodeInteraction
```

The one node of the screen that carries the automation tag of `component` given `tagKey`, inside `scope`: see `hasPantrixTag`. What is done with it fails where there is none, or more than one.

Parametreler:

- `component: String`
- `tagKey: String?`
- `scope: String?`
- `useUnmergedTree: Boolean`: whether to look in the tree of every node, rather than in the one a screen reader reads, in which a node that merges what it holds stands for all of it.

### SemanticsNodeInteractionsProvider.onAllPantrixNodes

`import com.pantrixui.testing.onAllPantrixNodes`, `com.pantrixui:testing` içinden

```kotlin
fun SemanticsNodeInteractionsProvider.onAllPantrixNodes(
    component: String,
    tagKey: String? = null,
    scope: String? = null,
    useUnmergedTree: Boolean = false
): SemanticsNodeInteractionCollection
```

Every node of the screen that carries the automation tag of `component` given `tagKey`, inside `scope`, in the order of the tree: see `hasPantrixTag`. Without a key, every one of the component in that scope.

Parametreler:

- `component: String`
- `tagKey: String?`
- `scope: String?`
- `useUnmergedTree: Boolean`: whether to look in the tree of every node, rather than in the one a screen reader reads, in which a node that merges what it holds stands for all of it.

### SemanticsNodeInteractionsProvider.pantrixTags

`import com.pantrixui.testing.pantrixTags`, `com.pantrixui:testing` içinden

```kotlin
fun SemanticsNodeInteractionsProvider.pantrixTags(useUnmergedTree: Boolean = true): List<String>
```

The Pantrix automation tags the screen carries, in the order of its tree: what a test, or a flow of the platform's UI automation such as Maestro, finds its nodes by. A tag is written as Pantrix writes one, the chain of its scopes and then a name and a key, `Checkout.Button_pay`. A component given no key takes its tag from where it is called, `Button#1k3z9`, and that tag changes when the code moves: give the component a `tagKey`. A tag of another shape, as an app's own `Modifier.testTag("login")`, is left out.

Parametreler:

- `useUnmergedTree: Boolean`: whether to look in the tree of every node, as by default, rather than in the one a screen reader reads, in which a node that merges what it holds hides the tags inside it.

### PantrixTestTheme

`import com.pantrixui.testing.PantrixTestTheme`, `com.pantrixui:testing` içinden

```kotlin
@Composable
fun PantrixTestTheme(
    platform: PlatformType = PlatformType.Android,
    system: OperatingSystem = platform.system,
    dark: Boolean = false,
    locale: PantrixLocale = PantrixLocale.English,
    density: PantrixDensity = PantrixDensity.Comfortable,
    fontScale: Float = 1f,
    window: PantrixWindow? = null,
    findings: PantrixFindings? = null,
    analytics: PantrixAnalytics = PantrixAnalytics.NoOp,
    haptics: PantrixHaptics = PantrixHaptics.NoOp,
    clipboard: TestClipboard? = null,
    filePicker: FilePicker? = null,
    clock: TestClock? = null,
    content: @Composable () -> Unit
)
```

Pantrix's theme as a test sees a screen: the same on every machine and in every run, whatever the device under the test. By default the screen is on Android, in the light theme and in English, at the comfortable density and a font scale of one, with motion reduced so that nothing is caught moving; each is a parameter where a test needs another.

The diagnostics are on: what they find goes to `findings`, which `assertNoFindings` reads, or to the log where the test gives no sink. The platform's services are the test's own: `analytics` and `haptics` keep what the screen tells them where the test gives recorders, `clipboard` keeps what it copies, `filePicker` answers its pickers and `clock` is the time it reads. Left out, the clipboard and the picker are the theme's own, so that nothing of the machine's is written to or opened; the clock is the device's. The screen's file saver is always the theme's own, a `TestFileSaver`: a test that reads what was saved gives its own through `LocalFileSaver`, inside the theme.

```kotlin
val findings = PantrixFindings()
val analytics = RecordingAnalytics()
setContent { PantrixTestTheme(findings = findings, analytics = analytics) { CheckoutScreen() } }
onPantrixNode("Button", "pay").performClick()
assertEquals(listOf("click"), analytics.eventsOf("Button").map { it.action })
assertNoFindings(findings)
```

Parametreler:

- `platform: PlatformType`: the platform the screen is shown as: its touch targets, its focus rings and its own ways.
- `system: OperatingSystem`: the operating system the screen is typed on, which says whether its shortcuts lead with Command or Control: by default the platform's own, and Windows on the desktop and the web.
- `dark: Boolean`: whether the theme is the dark one.
- `locale: PantrixLocale`: the language the screen is in, and with it the direction of its writing.
- `density: PantrixDensity`: how close together the screen's controls stand.
- `fontScale: Float`: how much larger the system writes than the theme's sizes: `2f` for Android's largest.
- `window: PantrixWindow?`: the window the screen is told it is in, its size and its folds: a phone's, a tablet's, one half of a foldable; null for the one the test draws in.
- `findings: PantrixFindings?`: where the diagnostics' findings are kept; null to write them to the log.
- `analytics: PantrixAnalytics`: what the screen's components report to.
- `haptics: PantrixHaptics`: what the screen's components play their feedback with.
- `clipboard: TestClipboard?`: the clipboard the screen copies to, with the traits it has; null for one of the theme's own.
- `filePicker: FilePicker?`: the picker the screen's pickers open, `rememberFilePicker()` and the file drop zones; null for one of the theme's own, which never answers, as a user who closes it.
- `clock: TestClock?`: the time the screen reads: its today, the hour a time picker opens at, a chart's moments; null for the device's.
- `content: @Composable () -> Unit`: the screen.

### ComposeUiTest.onEachPlatform

`import com.pantrixui.testing.onEachPlatform`, `com.pantrixui:testing` içinden

```kotlin
fun ComposeUiTest.onEachPlatform(
    content: @Composable (platform: PlatformType) -> Unit,
    check: ComposeUiTest.(platform: PlatformType) -> Unit
)
```

Looks at `content` on each platform in turn, in the one run of the test: `content` is composed anew for each, in the order of `PlatformType`, and `check` follows it.

One run, and not a run for each platform: on the web a run is a promise the test hands back, and a test that starts several from a loop hands back none of them, so that nothing waits for them and what fails in them fails no test.

```kotlin
onEachPlatform({ platform -> PantrixTestTheme(platform = platform) { SaveButton() } }) { platform ->
    onPantrixNode("Button", "save").assertTouchTargetOf(platform)
}
```

Parametreler:

- `content: @Composable (platform: PlatformType) -> Unit`: the screen as it is shown on a platform.
- `check: ComposeUiTest.(platform: PlatformType) -> Unit`: what is asserted of it there.

### RecordingAnalytics

`import com.pantrixui.testing.RecordingAnalytics`, `com.pantrixui:testing` içinden

```kotlin
class RecordingAnalytics : PantrixAnalytics
```

Analytics that keep what the screen's components report, in order: what a test reads to see that a press, an open or a choice was told. `PantrixTestTheme` gives them to the screen as its `analytics`.

```kotlin
val analytics = RecordingAnalytics()
setContent { PantrixTestTheme(analytics = analytics) { CheckoutScreen() } }
onPantrixNode("Button", "pay").performClick()
assertEquals(listOf("click"), analytics.eventsOf("Button").map { it.action })
```

Üyeleri:

- `events: List<PantrixUiEvent>`: Every event reported since these were made or last cleared, in order: a copy, which later events leave alone.
- `fun eventsOf(component: String): List<PantrixUiEvent>`: The events `component` reported, in order: `eventsOf("Button")`.
- `fun clear()`: Forgets every event reported so far.

### RecordingHaptics

`import com.pantrixui.testing.RecordingHaptics`, `com.pantrixui:testing` içinden

```kotlin
class RecordingHaptics : PantrixHaptics
```

Haptics that keep the feedback the screen's components play, in order, and play none on the device: what a test reads to see that a long press or a choice was felt. `PantrixTestTheme` gives them to the screen as its `haptics`.

Üyeleri:

- `played: List<HapticType>`: Every feedback played since these were made or last cleared, in order: a copy, which later ones leave alone.
- `fun clear()`: Forgets every feedback played so far.

### TestClipboard

`import com.pantrixui.testing.TestClipboard`, `com.pantrixui:testing` içinden

```kotlin
class TestClipboard(
    public val traits: ClipboardTraits = ClipboardTraits()
) : Clipboard
```

A clipboard of the test's own, in the place of the machine's: it keeps what the screen copies, and touches nothing the machine has copied. `PantrixTestTheme` gives it to the screen as Compose's clipboard and `traits` as the platform's, so that a test sees a screen on Android 13, whose system shows a copy itself, by `ClipboardTraits(announcedBySystem = true)`, and in a page served over plain http, which has no clipboard, by `ClipboardTraits(writable = false)`.

```kotlin
val clipboard = TestClipboard()
setContent { PantrixTestTheme(clipboard = clipboard) { InviteScreen() } }
onPantrixNode("Button", "copy_link").performClick()
assertEquals("https://example.com/invite/42", clipboard.text())
```

Parametreler:

- `traits: ClipboardTraits`: what the clipboard is like, as the screen is told.

Üyeleri:

- `entries: List<ClipEntry?>`: What was put on the clipboard, in order and in the platform's own type: null where it was cleared.
- `suspend fun texts(): List<String>`: The plain texts put on the clipboard, in order: what the screen copied. On the web a text is read as the browser reads it, which is waited for; an entry that holds no plain text is left out.
- `suspend fun text(): String?`: The plain text on the clipboard now, or null while it holds none.
- `fun clear()`: Forgets what was put on the clipboard.

### TestClock

`import com.pantrixui.testing.TestClock`, `com.pantrixui:testing` içinden

```kotlin
class TestClock(
    now: Instant,
    public val utcOffset: (Instant) -> Duration = { Duration.ZERO }
) : Clock
```

A clock of the test's own: it shows the moment the test sets, and moves only when the test moves it. `PantrixTestTheme` gives it to the screen as the screen's clock, at the offset from UTC that `utcOffset` gives: the screen reads its today, the hour a time picker opens at and a chart's moments by it.

It is the time the screen reads, and not the frames of the test: a screen that waits until midnight waits on the test's own clock as well, `mainClock.advanceTimeBy(…)`.

```kotlin
val clock = TestClock(Instant.parse("2026-10-17T21:59:00Z")) { 3.hours }
setContent { PantrixTestTheme(clock = clock) { BookingScreen() } }
clock.advanceBy(1.minutes)
mainClock.advanceTimeBy(60_000)
```

Parametreler:

- `now: Instant`: the moment the clock shows at first.
- `utcOffset: (Instant) -> Duration`: how far the clock is ahead of UTC at a moment: three hours in Istanbul, less than nought west of Greenwich; by default none, the clock of UTC.

Üyeleri:

- `now: Instant`: The moment the clock shows, which the test may set.
- `fun advanceBy(duration: Duration)`: Moves the clock on by `duration`, or back where `duration` is less than nought.

### TestFilePicker

`import com.pantrixui.testing.TestFilePicker`, `com.pantrixui:testing` içinden

```kotlin
class TestFilePicker(
    public var files: List<PantrixFile> = emptyList()
) : FilePicker
```

A file picker of the test's own: it answers a pick with the `files` the test gives it, as a user who chooses them, and keeps what each pick asked for. It answers with the files of the kinds the pick shows and no others, and with the first of them alone where the pick takes one, as the platform's picker lets a user choose; with none of those it does not answer, as a user who closes the picker. `PantrixTestTheme` gives it to the screen in the place of the platform's.

```kotlin
val picker = TestFilePicker(listOf(PantrixFile("offer.pdf", bytes)))
setContent { PantrixTestTheme(filePicker = picker) { OfferScreen() } }
onPantrixNode("FileDrop", "offer").performClick()
assertEquals(listOf(PantrixFileType.Pdf), picker.requests.single().accept)
```

Parametreler:

- `files: List<PantrixFile>`: what a user chooses at a pick, until the test gives others.

Üyeleri:

- `requests: List<FilePickRequest>`: Every pick asked for since the picker was made, in order: the kinds of file it showed and how many it took.

### TestFileSaver

`import com.pantrixui.testing.TestFileSaver`, `com.pantrixui:testing` içinden

```kotlin
class TestFileSaver(
    public var result: FileSaveResult = FileSaveResult.Saved
) : FileSaver
```

A file saver of the test's own: it keeps every file it is given, as a user who chooses a place for each, and answers with `result`. `PantrixTestTheme` gives one of its own to the screen in the place of the platform's, so that no window for saving opens and nothing is written to the machine; a test that reads what was saved gives its own, inside the theme.

```kotlin
val saver = TestFileSaver()
setContent {
    PantrixTestTheme { CompositionLocalProvider(LocalFileSaver provides saver) { ThemeBuilderScreen() } }
}
onPantrixNode("Button", "download").performClick()
assertEquals(listOf("Theme.kt"), saver.files.map { it.name })
```

Parametreler:

- `result: FileSaveResult`: what each save answers: saved, unless the test makes the user cancel or the place fail.

Üyeleri:

- `files: List<PantrixFile>`: Every file given to be saved since the saver was made, in order.

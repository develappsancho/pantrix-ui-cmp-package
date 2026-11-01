# Language and words

What the components say by themselves: "Close", "Loading", "Per page", everything said to a screen reader. The theme takes them from its language; the app's own texts are the app's.

## Features

- **Language.** `PantrixLocale` is a language and the direction of its script; `forLanguageTag("ar-EG")` works the direction out from the tag. `PantrixTheme(locale = …)` gives the language to what is in it, and `PantrixTheme.locale` is the nearest theme's.
- **Words.** `PantrixStrings` is the components' words. Turkish, English and Arabic packs come with it (`PantrixStrings.forLocale(locale)`); another language is given by a pack's `copy`: `PantrixTheme(strings = …)`.
- **The words of time.** `PantrixTimeWords` is the words that count time: "Last 15 minutes", "~ 2 hours ago", "in 3 days"; a pack's `timeWords`.

## Examples

### Three packs

The words of three packs: each line is a pack's "Close", its "Loading" and how it writes a number. Arabic writes in its own digits. The pack is found from the language: `PantrixStrings.forLocale(PantrixLocale.forLanguageTag("ar-EG"))` is Arabic's.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

val packs = listOf(
    "tr" to PantrixStrings.Turkish,
    "en" to PantrixStrings.English,
    "ar-EG" to PantrixStrings.forLocale(PantrixLocale.forLanguageTag("ar-EG"))
)
packs.forEach { (tag, strings) ->
    PantrixText(
        text = "$tag · ${strings.close} · ${strings.loading} · ${strings.number(1_234_567)}",
        style = PantrixTheme.typography.footnote
    )
}
```

### A language Pantrix does not know

A language Pantrix has no pack for: German. The inner theme was given `PantrixLocale.forLanguageTag("de-DE")` and a copy of the English pack translated into German. The page size picker reads its word from the new pack. The line underneath reads the language and "Close" straight from the locals (`LocalPantrixLocale`, `LocalPantrixStrings`).

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPageSize
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.l10n.LocalPantrixLocale
import com.pantrixui.foundation.l10n.LocalPantrixStrings
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.l10n.PantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme

var pageSize by remember { mutableIntStateOf(25) }
PantrixTheme(locale = PantrixLocale.forLanguageTag("de-DE"), strings = GERMAN) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixPageSize(pageSize = pageSize, onPageSizeChange = { pageSize = it }, tagKey = "german_size")
        PantrixText(
            text = "${LocalPantrixLocale.current.languageTag} · ${LocalPantrixStrings.current.close}",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}

private val GERMAN = PantrixStrings.English.copy(
    close = "Schließen",
    loading = "Wird geladen",
    perPage = "Pro Seite",
    goToPage = "Gehe zu Seite"
)
```

### The words of time

The words of time in three languages: a range ("last 15 minutes"), an approximate past ("~ 2 hours ago") and a future ("in 3 days"). After a number the noun stays singular in Turkish, takes the plural in English, and changes with the number in Arabic.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.date.PantrixTimeUnit
import com.pantrixui.foundation.l10n.PantrixTimeWords
import com.pantrixui.foundation.theme.PantrixTheme

listOf(PantrixTimeWords.Turkish, PantrixTimeWords.English, PantrixTimeWords.Arabic).forEach { words ->
    PantrixText(
        text = "${words.last(15, PantrixTimeUnit.Minutes)} · " +
            "${words.ago(2, PantrixTimeUnit.Hours, approximate = true)} · " +
            words.fromNow(3, PantrixTimeUnit.Days, approximate = false),
        style = PantrixTheme.typography.footnote
    )
}
```

## API

### PantrixLocale

`import com.pantrixui.foundation.l10n.PantrixLocale`, from `com.pantrixui:foundation`

```kotlin
data class PantrixLocale(
    public val languageTag: String,
    public val layoutDirection: LayoutDirection,
    public val firstDayOfWeek: Int = firstDayOfWeekOf(languageTag)
)
```

A language, the direction its script runs in, and the day its calendars start a week on. `forLanguageTag` works the direction out from the tag.

Parameters:

- `languageTag: String`: The language as a BCP 47 tag, e.g. `tr`, `en-GB`, `ar`.
- `layoutDirection: LayoutDirection`: The direction the language's script runs in: right to left for Arabic.
- `firstDayOfWeek: Int`: The day a week starts on in the language's calendars, as ISO 8601 numbers the days: 1 is Monday and 7 is Sunday. Unless given, Monday in Turkish, Saturday in Arabic, and Sunday in English and in every other language. A date picker that is given no first day of its own starts its weeks on this one. `firstDayOfWeekOf`: The day `languageTag`'s calendars start a week on: Monday in Turkish, Saturday in Arabic, Sunday otherwise.

Members:

- `language: String`: The primary subtag, lower-cased: `en-GB` -> `en`.

On the type:

- `PantrixLocale.English: PantrixLocale`: English, written from left to right, its weeks starting on Sunday.
- `PantrixLocale.Turkish: PantrixLocale`: Turkish, written from left to right, its weeks starting on Monday.
- `PantrixLocale.Arabic: PantrixLocale`: Arabic, written from right to left, its weeks starting on Saturday.
- `PantrixLocale.forLanguageTag(tag: String): PantrixLocale`: Builds a locale from a tag, inferring direction.

  `tag`: the language as a BCP 47 tag, `tr`, `en-GB` or `ar`: its primary subtag decides the direction and the day a week starts on.

### PantrixTimeWords

`import com.pantrixui.foundation.l10n.PantrixTimeWords`, from `com.pantrixui:foundation`

```kotlin
interface PantrixTimeWords
```

The phrases that count time: "Last 15 minutes", "~ 2 hours ago", "in 3 days".

A function for each phrase rather than a template: languages put the number, the unit and the direction in orders of their own, a noun's form follows the number by each language's rules of plurals, and Arabic says two of something by a dual that takes no number. Each function writes its number in the language's own digits.

`English`, `Turkish` and `Arabic` come with their packs. An app with words of its own, or a fourth language, writes one and gives it with its strings: `PantrixStrings.English.copy(timeWords = MyTimeWords)`. An amount is a count of units and never less than nought; the phrase says which way it goes.

Members:

- `now: String`: "now" inside a phrase: the end of "~ 15 minutes ago to now".
- `fun unit(unit: PantrixTimeUnit, count: Int): String`: The unit alone, in the form that goes with `count`: "minutes" beside a 15, in a choice of units.

  `unit`: the unit of time named.
- `fun unitAgo(unit: PantrixTimeUnit, count: Int): String`: The unit and "ago" beside a number: "minutes ago".

  `unit`: the unit of time named.

  `count`: the number the unit stands beside, which picks its form: "minute" beside a 1, "minutes" beside a 15.
- `fun unitFromNow(unit: PantrixTimeUnit, count: Int): String`: The unit and "from now" beside a number: "minutes from now".

  `unit`: the unit of time named.

  `count`: the number the unit stands beside, which picks its form: "minute" beside a 1, "minutes" beside a 15.
- `fun last(amount: Int, unit: PantrixTimeUnit): String`: A range that ends now: "Last 15 minutes".

  `amount`: how many of `unit` the range runs back from now: the 15 of "Last 15 minutes".

  `unit`: the unit the range is counted in.
- `fun next(amount: Int, unit: PantrixTimeUnit): String`: A range that starts now: "Next 15 minutes".

  `amount`: how many of `unit` the range runs on from now: the 15 of "Next 15 minutes".

  `unit`: the unit the range is counted in.
- `fun ago(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: A moment before now: "15 minutes ago", or "~ 2 hours ago" where `approximate`.

  `amount`: how many of `unit` the moment lies before now.

  `unit`: the unit the moment is counted in.
- `fun fromNow(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: A moment after now: "in 15 minutes", or "~ in 2 hours" where `approximate`.

  `amount`: how many of `unit` the moment lies after now.

  `unit`: the unit the moment is counted in.
- `fun roundTo(unit: PantrixTimeUnit): String`: The switch that rounds a moment: "Round to the minute".

  `unit`: the unit a moment is rounded to: "minute" in "Round to the minute".
- `fun roundedTo(phrase: String, unit: PantrixTimeUnit): String`: A `phrase` whose ends were rounded to `unit`: "Last 15 minutes, rounded to the minute".
- `fun range(start: String, end: String): String`: Two ends of a range, each already in words: "~ 15 minutes ago to now".

  `start`: the range's start, already in words: "~ 15 minutes ago".

  `end`: the range's end, already in words: "now".

On the type:

- `PantrixTimeWords.English: PantrixTimeWords`: A noun takes an s unless the count is one: "1 minute", "0 minutes", "15 minutes".
- `PantrixTimeWords.Turkish: PantrixTimeWords`: A noun after a number stays as it is: "15 dakika önce".
- `PantrixTimeWords.Arabic: PantrixTimeWords`: One and two are said by the noun alone, "دقيقة" and "دقيقتين"; 3 to 10 take the plural, "٣ دقائق"; 11 to 99 the singular in the accusative, "١٥ يومًا"; and 100 and more the singular, "١٠٠ يوم". "About" is a word, "حوالي", where the other languages write a tilde.

### LocalPantrixLocale

`import com.pantrixui.foundation.l10n.LocalPantrixLocale`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixLocale: ProvidableCompositionLocal<PantrixLocale>
```

The language in effect, which `PantrixTheme` provides: what `PantrixTheme.locale` reads. Outside a theme, English.

### LocalPantrixStrings

`import com.pantrixui.foundation.l10n.LocalPantrixStrings`, from `com.pantrixui:foundation`

```kotlin
val LocalPantrixStrings: ProvidableCompositionLocal<PantrixStrings>
```

The components' own words in effect, which `PantrixTheme` provides: what `PantrixTheme.strings` reads. Outside a theme, `PantrixStrings.English`.

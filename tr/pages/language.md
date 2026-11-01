# Dil ve sözler

Bileşenlerin kendiliğinden söyledikleri: "Kapat", "Yükleniyor", "Sayfada", bir ekran okuyucuya söylenen her şey. Tema onları dilinden alır; uygulamanın kendi metinleri uygulamanındır.

## Özellikler

- **Dil.** `PantrixLocale` bir dil ve yazısının yönüdür; `forLanguageTag("ar-EG")` yönü etiketten çıkarır. `PantrixTheme(locale = …)` dili içindekilere verir, `PantrixTheme.locale` en yakın temanınkidir.
- **Sözler.** `PantrixStrings` bileşenlerin sözleridir. Türkçe, İngilizce ve Arapça paketleri gelir (`PantrixStrings.forLocale(locale)`); başka bir dil bir paketin `copy`'siyle verilir: `PantrixTheme(strings = …)`.
- **Zamanın sözleri.** `PantrixTimeWords` zamanı sayan sözlerdir: "Son 15 dakika", "~ 2 saat önce", "3 gün sonra"; bir paketin `timeWords`'ü.

## Örnekler

### Üç paket

Üç paketin sözleri: her satır bir paketin "Kapat"ı, "Yükleniyor"u ve bir sayıyı yazışı. Arapça kendi rakamlarıyla yazar. Paket dilden bulunur: `PantrixStrings.forLocale(PantrixLocale.forLanguageTag("ar-EG"))` Arapçanınkidir.

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

### Pantrix'in bilmediği bir dil

Pantrix'in paketi olmayan bir dil: Almanca. İçteki temaya `PantrixLocale.forLanguageTag("de-DE")` ve İngilizce paketin Almancaya çevrilmiş bir kopyası verildi. Sayfa boyu seçicisi sözünü yeni paketten okur. Alttaki satır dili ve "Kapat"ı doğrudan yerellerden okur (`LocalPantrixLocale`, `LocalPantrixStrings`).

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

### Zamanın sözleri

Zamanın sözleri üç dilde: bir aralık ("son 15 dakika"), yaklaşık bir geçmiş ("~ 2 saat önce") ve bir gelecek ("3 gün sonra"). Türkçede sayıdan sonra ad tekil kalır, İngilizcede çoğul olur, Arapçada sayıya göre değişir.

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

`import com.pantrixui.foundation.l10n.PantrixLocale`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixLocale(
    public val languageTag: String,
    public val layoutDirection: LayoutDirection,
    public val firstDayOfWeek: Int = firstDayOfWeekOf(languageTag)
)
```

Bir dil, yazısının yönü ve takvimlerinin haftayı başlattığı gün. `forLanguageTag` yönü etiketten çıkarır.

Parametreler:

- `languageTag: String`: BCP 47 etiketi olarak dil, örneğin `tr`, `en-GB`, `ar`.
- `layoutDirection: LayoutDirection`: Dilin yazısının yönü: Arapça için sağdan sola.
- `firstDayOfWeek: Int`: Dilin takvimlerinde haftanın başladığı gün, ISO 8601'in numaralarıyla: 1 Pazartesi, 7 Pazar. Verilmezse Türkçede Pazartesi, Arapçada Cumartesi, İngilizcede ve öteki bütün dillerde Pazar. Kendi ilk günü verilmeyen bir tarih seçici haftalarını bu günden başlatır. `firstDayOfWeekOf`: `languageTag`'in takvimlerinin haftayı başlattığı gün: Türkçede Pazartesi, Arapçada Cumartesi, ötekilerde Pazar.

Üyeleri:

- `language: String`: Birincil alt etiket, küçük harfle: `en-GB` -> `en`.

Tipin kendisinde:

- `PantrixLocale.English: PantrixLocale`: İngilizce: soldan sağa yazılır, haftaları pazar günü başlar.
- `PantrixLocale.Turkish: PantrixLocale`: Türkçe: soldan sağa yazılır, haftaları pazartesi günü başlar.
- `PantrixLocale.Arabic: PantrixLocale`: Arapça: sağdan sola yazılır, haftaları cumartesi günü başlar.
- `PantrixLocale.forLanguageTag(tag: String): PantrixLocale`: Bir etiketten bir dil kurar; yazı yönünü etiketten çıkarır.

  `tag`: dil, bir BCP 47 etiketi olarak: `tr`, `en-GB` ya da `ar`. Birincil alt etiketi yönü ve haftanın başladığı günü belirler.

### PantrixTimeWords

`import com.pantrixui.foundation.l10n.PantrixTimeWords`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixTimeWords
```

Zamanı sayan sözler: "Son 15 dakika", "~ 2 saat önce", "3 gün sonra".

Her söz için bir kalıp değil bir işlev: diller sayıyı, birimi ve yönü kendi sıralarına koyar, bir adın biçimi sayıya her dilin çoğul kurallarıyla uyar ve Arapça ikiyi sayı almayan bir ikil ile söyler. Her işlev sayısını dilin kendi rakamlarıyla yazar.

`English`, `Turkish` ve `Arabic` paketleriyle gelir. Kendi sözleri olan ya da dördüncü bir dili olan bir uygulama birini yazar ve sözleriyle birlikte verir: `PantrixStrings.English.copy(timeWords = MyTimeWords)`. Bir miktar birimlerin sayısıdır ve hiçbir zaman sıfırdan küçük değildir; ne yöne gittiğini söz söyler.

Üyeleri:

- `now: String`: Bir sözün içindeki "şimdi": "~ 15 dakika önceden şimdiye"nin sonu.
- `fun unit(unit: PantrixTimeUnit, count: Int): String`: Birim tek başına, `count` ile giden biçimiyle: birimler arasında bir seçimde 15'in yanındaki "dakika".

  `unit`: adı söylenen zaman birimi.
- `fun unitAgo(unit: PantrixTimeUnit, count: Int): String`: Bir sayının yanında birim ve "önce": "dakika önce".

  `unit`: adı söylenen zaman birimi.

  `count`: birimin yanında durduğu sayı; birimin biçimini o seçer: İngilizcede 1'in yanında "minute", 15'in yanında "minutes".
- `fun unitFromNow(unit: PantrixTimeUnit, count: Int): String`: Bir sayının yanında birim ve "sonra": "dakika sonra".

  `unit`: adı söylenen zaman birimi.

  `count`: birimin yanında durduğu sayı; birimin biçimini o seçer: İngilizcede 1'in yanında "minute", 15'in yanında "minutes".
- `fun last(amount: Int, unit: PantrixTimeUnit): String`: Şimdi biten bir aralık: "Son 15 dakika".

  `amount`: aralığın şimdiden geriye kaç `unit` gittiği: "Son 15 dakika"daki 15.

  `unit`: aralığın sayıldığı birim.
- `fun next(amount: Int, unit: PantrixTimeUnit): String`: Şimdi başlayan bir aralık: "Sonraki 15 dakika".

  `amount`: aralığın şimdiden ileriye kaç `unit` gittiği: "Sonraki 15 dakika"daki 15.

  `unit`: aralığın sayıldığı birim.
- `fun ago(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: Şimdiden önce bir an: "15 dakika önce", `approximate` olduğunda "~ 2 saat önce".

  `amount`: anın şimdiden kaç `unit` önce olduğu.

  `unit`: anın sayıldığı birim.
- `fun fromNow(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: Şimdiden sonra bir an: "15 dakika sonra", `approximate` olduğunda "~ 2 saat sonra".

  `amount`: anın şimdiden kaç `unit` sonra olduğu.

  `unit`: anın sayıldığı birim.
- `fun roundTo(unit: PantrixTimeUnit): String`: Bir anı yuvarlayan anahtar: "Dakikaya yuvarla".

  `unit`: bir anın yuvarlandığı birim: "Dakikaya yuvarla"daki "dakika".
- `fun roundedTo(phrase: String, unit: PantrixTimeUnit): String`: Uçları `unit`'e yuvarlanmış bir `phrase`: "Son 15 dakika, dakikaya yuvarlanmış".
- `fun range(start: String, end: String): String`: Bir aralığın iki ucu, ikisi de söze dökülmüş: "~ 15 dakika önceden şimdiye".

  `start`: aralığın başı, sözle yazılmış hâliyle: "~ 15 dakika önce".

  `end`: aralığın sonu, sözle yazılmış hâliyle: "şimdi".

Tipin kendisinde:

- `PantrixTimeWords.English: PantrixTimeWords`: Bir ad, sayı bir olmadıkça s alır: "1 minute", "0 minutes", "15 minutes".
- `PantrixTimeWords.Turkish: PantrixTimeWords`: Sayıdan sonraki ad olduğu gibi kalır: "15 dakika önce".
- `PantrixTimeWords.Arabic: PantrixTimeWords`: Bir ve iki yalnızca adla söylenir, "دقيقة" ve "دقيقتين"; 3'ten 10'a çoğul alır, "٣ دقائق"; 11'den 99'a belirtme hâlinde tekil, "١٥ يومًا"; 100 ve fazlası tekil, "١٠٠ يوم". "Yaklaşık" bir sözcüktür, "حوالي": öteki dillerin tilde yazdığı yerde.

### LocalPantrixLocale

`import com.pantrixui.foundation.l10n.LocalPantrixLocale`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixLocale: ProvidableCompositionLocal<PantrixLocale>
```

Geçerli dil; `PantrixTheme` sağlar ve `PantrixTheme.locale` bunu okur. Bir temanın dışında İngilizce.

### LocalPantrixStrings

`import com.pantrixui.foundation.l10n.LocalPantrixStrings`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixStrings: ProvidableCompositionLocal<PantrixStrings>
```

Bileşenlerin geçerli kendi sözleri; `PantrixTheme` sağlar ve `PantrixTheme.strings` bunları okur. Bir temanın dışında `PantrixStrings.English`.

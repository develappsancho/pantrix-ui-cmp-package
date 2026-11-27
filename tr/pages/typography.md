# Tipografi

Temanın yazı ölçeği: `PantrixTheme.typography`. Dokuz stil, büyükten küçüğe. Bir metin boyutunu punto ile değil işiyle ister: sayfanın başlığı `display`'dir, bir kartın başlığı `title`, bir düğmenin etiketi `label`. O işin hangi boyutta ve ağırlıkta yazıldığını tema söyler.

Bu sayfadaki ölçüler elle yazılmadı. Her örneğin üstündeki satır stilin adını ve ölçülerini temadaki `TextStyle`'dan okur: `boyut / satır yüksekliği · ağırlık · harf aralığı`. Tip ölçeği ya da yazı tipi değişince burası da kendiliğinden değişir.

## Özellikler

- **Dokuz stil.** Başlıklar için `display`, `headline` ve `title`; metin için `callout`, `body`, `label`, `footnote` ve `caption`; kimlik taşıyan metin için `code`.
- **Stili verilmeyen yazı `label`'dır.** `PantrixText`, `PantrixLink` ve `PantrixAutoText` kendilerine `style` verilmediğinde temel yazıyla, `LocalPantrixTextStyle` ile yazılır. Tema onu `label`'la başlatır: bir kontrolün etiketinin stili. Bir bölüm kendi temel yazısını `ProvidePantrixTextStyle` ile verir. Compose Foundation'ın `BasicText`'i bu değeri okumaz: stili verilmeyen `BasicText` sistemin yazı tipiyle yazar.
- **Rolüyle anılan stil.** `TypeRole` ölçeğin bir rolüdür; `PantrixTheme.typography[TypeRole.Body]` onun stilidir. Bir bileşenin stili yazı tipi tutmadan rolü söyler: metin alanları `TextFieldStyle.textRole` ile yazar, Android'de ve iOS'ta `body`, masaüstünde ve web'de `label`.
- **Ölçek ve yazı tipi ayrıdır.** `buildPantrixTypography(fontFamily = …)` ölçeği korur ve yazı tipini değiştirir: bir markanın ailesi verilir, boyutlar ve ağırlıklar aynı kalır.
- **Üç aile.** `fontFamily` metnin, `headingFontFamily` `display`, `headline` ve `title`'ın, `monoFamily` `code`'un ailesidir. Verilmeyen başlık ailesi metninkidir; verilmeyen eş aralıklı aile `FontFamily.Monospace`'tir.
- **Pantrix'in kendi yazı tipi.** `rememberPantrixTypography()` ölçeği kütüphanenin kendi kaynaklarından yüklenen Plus Jakarta Sans ile verir. Uygulamanın temasına tipografi verilmezse o kullanılır.
- **Ağırlıklar.** Kütüphanenin yazı tipi tek bir değişken fonttur: ağırlık ekseni 200'den 800'e uzanır.
- **Bir uygulamanın yazı tipi.** `PantrixTypeface` bir yazı tipini font dosyalarıyla söyler; her dosya, ağırlığıyla bir `PantrixFont`'tur. `rememberPantrixTypography(typeface)` ölçeği o yazı tipiyle verir; `codeTypeface` kodu kendi yazı tipiyle yazdırır.
- **Yedek yazı tipleri.** Tarayıcıda Compose, uygulamanın fontlarında olmayan bir karakteri Google'ın sunucularından indirdiği bir Noto fontuyla çizer. `PantrixTypeface`'in `fallbacks`'i o karakterlerin fontlarıdır: yazı tipiyle birlikte okunur ve hiçbir şey indirilmez. Kütüphanenin yazı tipi, Mac tuşlarının işaretleri (`⌘ ⇧ ⌥`) için Pantrix Symbols'ı taşır.
- **Tarayıcıda.** Tarayıcı yazı tipini indirir ve gelene dek metni yedek bir yazı tipiyle çizer. `PantrixTypefaceGate` uygulamayı yazı tipi geldikten sonra çizer; `rememberPantrixTypography(typeface)` yazı tipi değişirken eskisinde kalır ve yenisi gelince bir kez değişir. Geldiğini `areTypefacesLoaded(…)` söyler.
- **Bir bölümün yazı tipi.** `PantrixTheme(typography = …)` içindeki her bileşene o tipografiyi verir: uygulamanın tamamına ya da yalnızca bir bölümüne.
- **Stil görünüştür, rol değil.** Başlık stiliyle yazılan metin ekran okuyucu için başlık olmaz: onu `PantrixText`'in `role` parametresi söyler, `TextRole.Heading(level)`.
- **Sistemin yazı boyutu.** Ölçeğin boyutları, satır yükseklikleri ve harf aralıkları sp ile verilir: sistemin yazı boyutu büyütüldüğünde yazı da onunla büyür.

## Örnekler

### Başlıklar

Ölçeğin üç başlık stili. `display` sayfanın başlığıdır, çoğunlukla ekranda bir tane olur. `headline` bir bölümün başlığıdır. `title` bir kartın, bir panelin ya da bir dialog'un başlığıdır.

Her örneğin üstündeki satır stilin adını ve ölçülerini temadan okur. Üçü, ölçek kurulurken verilen başlık ailesiyle yazılır (`headingFontFamily`).

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

val type = PantrixTheme.typography
TypeSpecimen(name = "display", style = type.display, text = "Tasarım sistemi")
TypeSpecimen(name = "headline", style = type.headline, text = "Son siparişler")
TypeSpecimen(name = "title", style = type.title, text = "Ödeme yöntemi")

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · harf aralığı ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

### Metin stilleri

Metnin beş stili, büyükten küçüğe, her biri kullanılacağı yerde göreceği türden bir metinle. `callout` öne çıkan gövdedir: bir giriş paragrafı, boş bir ekranın açıklaması. `body` gövde metnidir: bir paragraf, bir açıklama, bir alana yazılan. `label` bir kontrolün etiketidir: düğme, sekme, form alanının adı. `footnote` yardım metnidir: bir formun yardım metni, bir hatanın açıklaması. `caption` üst veridir: bir zaman, bir sayaç, bir tablo hücresinin ayrıntısı.

Gövde örneğinde Türkçe harflerin hepsi var ve paragraf birden çok satır sürer: satır yüksekliği orada görünür.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

val type = PantrixTheme.typography
TypeSpecimen(
    name = "callout",
    style = type.callout,
    text = "Henüz bir siparişin yok. İlk siparişini verdiğinde burada görünecek."
)
TypeSpecimen(
    name = "body",
    style = type.body,
    text = "Pijamalı hasta yağız şoföre çabucak güvendi. " +
        "Bu paragraf, satır yüksekliğinin birden çok satırda nasıl durduğunu gösterir."
)
TypeSpecimen(name = "label", style = type.label, text = "Sepete ekle")
TypeSpecimen(name = "footnote", style = type.footnote, text = "Şifren en az 8 karakter olmalı.")
TypeSpecimen(name = "caption", style = type.caption, text = "2 dakika önce güncellendi · 3 / 5")

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · harf aralığı ${letterSpacing.formatted()}"

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}
```

### Kod ve eş aralıklı aile

`code` kimlik taşıyan metnin stilidir: bir sipariş numarası, bir olay adı, bir kod parçası. Eş aralıklı bir aileyle yazılır.

Aile `buildPantrixTypography`'nin `monoFamily` parametresidir. Bir cümlenin içindeki tek bir kimlik için stilin tamamı değil yalnızca ailesi alınır: ikinci satırdaki numara `code`'un ailesiyle, cümlenin kendi boyutunda yazıldı.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

val type = PantrixTheme.typography
TypeSpecimen(name = "code", style = type.code, text = "order_id = 8F2A-19C4")
PantrixText(
    text = buildAnnotatedString {
        append("Sipariş ")
        withStyle(SpanStyle(fontFamily = type.code.fontFamily)) { append("8F2A-19C4") }
        append(" kargoya verildi.")
    },
    style = type.body
)

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · harf aralığı ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

### Stili verilmeyen yazı

İlk yazıya stil verilmedi, ikincisine `label` verildi: ikisi aynı çizilir. `PantrixText` kendisine `style` verilmediğinde temanın `label` stiliyle yazılır; `PantrixLink` ve `PantrixAutoText` de öyle.

`label` bir kontrolün etiketinin stilidir. Bir paragraf, bir başlık ya da bir dipnot stilini açıkça ister: `style = PantrixTheme.typography.body`.

```kotlin
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

PantrixText(text = "Stil verilmedi: Sepete ekle", tagKey = "no_style")
PantrixText(text = "Stil label: Sepete ekle", style = PantrixTheme.typography.label, tagKey = "label_style")
PantrixText(
    text = "label · ${PantrixTheme.typography.label.metrics()}",
    style = PantrixTheme.typography.caption,
    color = PantrixTheme.colors.textSecondary
)

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · harf aralığı ${letterSpacing.formatted()}"

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}
```

### Bir bölümün temel yazısı

Bir bölüm içindeki stili verilmeyen yazının stilini kendisi verir: `ProvidePantrixTextStyle`. Burada bir paragraf bölümü `body` ile yazıyor. İçindeki bir bölüm yalnız kalınlığı verir: verdiği alan çevresindekinin üstüne gelir, vermediği boyut ve satır yüksekliği olduğu gibi kalır. Stili açıkça verilen yazı yine kendi stilindedir.

Bir bölümün temel yazısını `LocalPantrixTextStyle` söyler: son satır onu okur.

```kotlin
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle
import com.pantrixui.foundation.token.typography.ProvidePantrixTextStyle
import com.pantrixui.foundation.token.typography.get
import kotlin.math.abs
import kotlin.math.roundToInt

ProvidePantrixTextStyle(PantrixTheme.typography.body) {
    PantrixText(text = "Bu bölümde stili verilmeyen yazı body ile yazılır.", tagKey = "part_body")
    ProvidePantrixTextStyle(TextStyle(fontWeight = FontWeight.Bold)) {
        PantrixText(text = "İçindeki bir bölüm yalnız kalınlığını değiştirir.", tagKey = "part_bold")
    }
    PantrixText(
        text = "Stili açıkça verilen yazı kendi stilindedir.",
        style = PantrixTheme.typography.footnote,
        tagKey = "part_footnote"
    )
    PantrixText(
        text = "Bu bölümün temel yazısı: ${LocalPantrixTextStyle.current.metrics()}",
        style = PantrixTheme.typography.caption,
        color = PantrixTheme.colors.textSecondary
    )
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · harf aralığı ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

### Ağırlıklar

Bir stil yerinde değiştirilebilir: `copy(fontWeight = …)` stilin boyutunu ve satır yüksekliğini korur, ağırlığını değiştirir. Burada `body` stili yedi ağırlıkta.

Yazı tipi burada temadan alınmadı, `rememberPantrixTypography()` ile kütüphanenin kendisinden alındı: o tek bir değişken fonttur ve ağırlık ekseni 200'den 800'e uzanır; buradaki yedi ağırlığın her biri o eksende bir noktadır. `Thin` ve `Black` eksenin dışındadır: en yakın ağırlıklarla, `ExtraLight` ve `ExtraBold` ile çizilirler.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.ui.text.font.FontWeight
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixTypography

val body = rememberPantrixTypography().body
val weights = listOf(
    "ExtraLight" to FontWeight.ExtraLight,
    "Light" to FontWeight.Light,
    "Normal" to FontWeight.Normal,
    "Medium" to FontWeight.Medium,
    "SemiBold" to FontWeight.SemiBold,
    "Bold" to FontWeight.Bold,
    "ExtraBold" to FontWeight.ExtraBold
)
Column {
    weights.forEach { (name, weight) ->
        PantrixText(text = "$name · Pijamalı hasta yağız şoföre güvendi", style = body.copy(fontWeight = weight))
    }
}
```

### Kendi yazı tipin

Uygulamanın kendi yazı tipi: `buildPantrixTypography(fontFamily = …)` Pantrix'in ölçeğini korur ve yazı tipini değiştirir. Burada aile Poppins'tir, uygulamanın kendi font dosyalarından; `PantrixTheme(typography = …)` onu içindeki her bileşene verir.

Her örneğin üstündeki satır ölçülerin aynı kaldığını gösterir: boyut, satır yüksekliği, ağırlık ve harf aralığı ölçeğinkilerdir, değişen yalnızca harflerin kendisidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.PantrixTypography
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily
import kotlin.math.abs
import kotlin.math.roundToInt

val poppins = rememberPantrixFontFamily(Poppins)
val typography: PantrixTypography = remember(poppins) { buildPantrixTypography(fontFamily = poppins) }
PantrixTheme(typography = typography) {
    val type = PantrixTheme.typography
    TypeSpecimen(name = "headline", style = type.headline, text = "Son siparişler")
    TypeSpecimen(name = "body", style = type.body, text = "Pijamalı hasta yağız şoföre çabucak güvendi.")
    TypeSpecimen(name = "label", style = type.label, text = "Sepete ekle")
}

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · harf aralığı ${letterSpacing.formatted()}"

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `Poppins`: Uygulamanın kendi dosyalarından Poppins: yedi ağırlık, her biri ayrı bir dosya. SemiBold'u yoktur: o ağırlıktaki bir metin komşu bir ağırlıkla çizilir. Lisansı, SIL Open Font License 1.1, dosyaların yanında: `files/licenses/poppins_ofl.txt`. Mac tuşlarının işaretleri kütüphanenin yedeğinden çizilir.

### Başlıklar başka bir ailede

Başlıklar ve metin ayrı ailelerde olabilir. `headingFontFamily` yalnızca `display`, `headline` ve `title`'ın ailesidir; gerisi `fontFamily` ile yazılır. Burada başlık Poppins, altındaki paragraf Plus Jakarta Sans.

`headingFontFamily` verilmezse başlıklar da `fontFamily` ile yazılır.

```kotlin
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily

val text = rememberPantrixFontFamily(PlusJakartaSans)
val headings = rememberPantrixFontFamily(Poppins)
val typography = remember(text, headings) {
    buildPantrixTypography(fontFamily = text, headingFontFamily = headings)
}
PantrixTheme(typography = typography) {
    PantrixText(text = "Son siparişler", style = PantrixTheme.typography.headline)
    PantrixText(
        text = "Henüz bir siparişin yok. İlk siparişini verdiğinde burada görünecek.",
        style = PantrixTheme.typography.body
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `PlusJakartaSans`: Uygulamanın kendi dosyalarından Plus Jakarta Sans: yedi ağırlık, her biri ayrı bir dosya.
- `Poppins`: Uygulamanın kendi dosyalarından Poppins: yedi ağırlık, her biri ayrı bir dosya. SemiBold'u yoktur: o ağırlıktaki bir metin komşu bir ağırlıkla çizilir. Lisansı, SIL Open Font License 1.1, dosyaların yanında: `files/licenses/poppins_ofl.txt`. Mac tuşlarının işaretleri kütüphanenin yedeğinden çizilir.

### Uygulamanın üç tipografisi

Bu uygulamanın üç tipografisi var: kütüphanenin kendisi (`rememberPantrixTypography()`), uygulamanın kendi dosyalarından Plus Jakarta Sans ve Poppins. Üçü de aynı ölçektir. İlk ikisi yazı tipi olarak da aynıdır: kütüphanenin kendi yazı tipi de Plus Jakarta Sans'tır, değişen yalnızca font dosyalarıdır. Harfleri başka olan Poppins'tir. Burada her biri kendi temasının içinde, alt alta duruyor; "seçili" yazan, uygulamanın şu anki tipografisidir.

"Ayarlar"daki "Yazı tipi" seçimi ve üst bar'daki menü uygulamanın tamamını ötekine geçirir. Seçim bir state'tir: değiştiğinde tema yeniden kurulur ve her sayfa yeni yazı tipiyle çizilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.get

val chosen = LocalDemoSettings.current.typography
TypographyStyle.entries.forEach { style ->
    PantrixTheme(typography = defaultTypography(style)) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixText(
                text = if (style == chosen) "${style.title.here} · seçili" else style.title.here,
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixText(text = "Son siparişler", style = PantrixTheme.typography.headline)
            PantrixText(
                text = "Pijamalı hasta yağız şoföre çabucak güvendi.",
                style = PantrixTheme.typography.body
            )
        }
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalDemoSettings`: Uygulamanın ayarları, içindeki her ekrana: üst bar'daki düğmeler ve "Ayarlar" sayfası onları buradan okur ve değiştirir. Uygulamanın dışında, bir testte tek başına çizilen bir sayfada varsayılan ayarlardır.
- `TypographyStyle`: Uygulamada kullanılacak tipografi kaynağını belirler.
- `defaultTypography`: `style` seçiminin tipografisi: Pantrix'in ölçeği, seçilen yazı tipiyle.

### Rolüyle bir stil

Ölçeğin dokuz rolü, işleriyle: `TypeRole` bir yazının ne olduğunu söyler, `typography[role]` onun stilini verir. Bir bileşenin stili de yazısını böyle, bir rolle söyler: tema değişince stil değil, rolün stili değişir.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.TypeRole
import com.pantrixui.foundation.token.typography.get

val typography = PantrixTheme.typography
TypeRole.entries.forEach { role ->
    PantrixText(text = role.name, style = typography[role], tagKey = "role_${role.name.lowercase()}")
}
```

### Dosyalarından bir yazı tipi

Bir yazı tipi dosyalarından kurulur: her `PantrixFont` bir font dosyası ve onun ağırlığıdır, bir `PantrixTypeface` onların listesidir. `rememberPantrixFontFamily` dosyaları okur ve bir aile verir. Poppins'te olmayan tuş işaretleri (`⌘K`) yedekten, kütüphanenin Pantrix Symbols'ından çizilir: `fallbacks`.

Web'de dosyalar gelene kadar yazı başka bir yazı tipiyle çizilir. `areTypefacesLoaded(…)` dosyaların okunup okunmadığını, `isPantrixTypefaceLoaded()` kütüphanenin kendi yazı tipininkini söyler. `PantrixTypefaceGate` içindekini yazı tipi okunana kadar çizmez: uygulamanın kökünde, yazının bir an başka yazı tipiyle görünmemesi için.

```kotlin
import androidx.compose.ui.text.font.FontWeight
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.PantrixFont
import com.pantrixui.foundation.token.typography.PantrixTypeface
import com.pantrixui.foundation.token.typography.PantrixTypefaceGate
import com.pantrixui.foundation.token.typography.areTypefacesLoaded
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.isPantrixTypefaceLoaded
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.poppins_bold
import pantrixui.app.shared.generated.resources.poppins_regular

val family = rememberPantrixFontFamily(HEADINGS)
val loaded = areTypefacesLoaded(HEADINGS)
PantrixText(
    text = "Başlık dosyaları okundu mu: ${if (loaded) "evet" else "hayır"} · " +
        "Pantrix'in yazı tipi: ${if (isPantrixTypefaceLoaded()) "evet" else "hayır"}",
    style = PantrixTheme.typography.caption,
    color = PantrixTheme.colors.textSecondary
)
PantrixTypefaceGate(loaded = loaded) {
    PantrixText(text = "Kış koleksiyonu ⌘K", style = PantrixTheme.typography.headline.copy(fontFamily = family))
}

private val HEADINGS = PantrixTypeface(
    fonts = listOf(
        PantrixFont(Res.font.poppins_regular, FontWeight.Normal),
        PantrixFont(Res.font.poppins_bold, FontWeight.Bold)
    ),
    fallbacks = PantrixTypeface.Default.fallbacks
)
```

### Kodun kendi yazı tipi

Kodun yazı tipi metninkinden ayrı verilir: `rememberPantrixTypography(typeface, codeTypeface)` ölçeği `typeface` ile, `code` stilini `codeTypeface` ile kurar. Verilmezse kod `FontFamily.Monospace` ile yazılır. Bir marka burada kendi eş aralıklı yazı tipini verir; bu demo yalnızca iki aile taşıdığı için kod Poppins'le yazıldı.

Yazı tiplerini bir listede tutan uygulama, hepsinin gelip gelmediğini listeyle sorar: `areTypefacesLoaded(list)`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.isUnspecified
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.areTypefacesLoaded
import com.pantrixui.foundation.token.typography.get
import com.pantrixui.foundation.token.typography.rememberPantrixTypography
import kotlin.math.abs
import kotlin.math.roundToInt

val typefaces = remember { listOf(PlusJakartaSans, Poppins) }
val type = rememberPantrixTypography(PlusJakartaSans, codeTypeface = Poppins)
PantrixText(
    text = "İki yazı tipi de okundu mu: ${if (areTypefacesLoaded(typefaces)) "evet" else "hayır"}",
    style = PantrixTheme.typography.caption,
    color = PantrixTheme.colors.textSecondary
)
TypeSpecimen(name = "body", style = type.body, text = "Sipariş kargoya verildi.")
TypeSpecimen(name = "code", style = type.code, text = "order_id = 8F2A-19C4")

@Composable
private fun TypeSpecimen(
    name: String,
    style: TextStyle,
    text: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(
            text = "$name · ${style.metrics()}",
            style = PantrixTheme.typography.caption,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixText(text = text, style = style)
    }
}

private fun TextStyle.metrics(): String = "${fontSize.formatted()} / ${lineHeight.formatted()} · " +
    "${fontWeight.label()} · harf aralığı ${letterSpacing.formatted()}"

private fun TextUnit.formatted(): String {
    if (isUnspecified) return "-"
    val hundredths = (value * 100).roundToInt()
    val sign = if (hundredths < 0) "-" else ""
    val whole = abs(hundredths) / 100
    val fraction = abs(hundredths) % 100
    val number = when {
        fraction == 0 -> "$whole"
        fraction % 10 == 0 -> "$whole.${fraction / 10}"
        else -> "$whole.${fraction.toString().padStart(2, '0')}"
    }
    return if (isEm) "$sign$number em" else "$sign$number"
}

private fun FontWeight?.label(): String = when (val weight = this?.weight) {
    null -> "-"
    100 -> "Thin"
    200 -> "ExtraLight"
    300 -> "Light"
    400 -> "Normal"
    500 -> "Medium"
    600 -> "SemiBold"
    700 -> "Bold"
    800 -> "ExtraBold"
    900 -> "Black"
    else -> "$weight"
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `PlusJakartaSans`: Uygulamanın kendi dosyalarından Plus Jakarta Sans: yedi ağırlık, her biri ayrı bir dosya.
- `Poppins`: Uygulamanın kendi dosyalarından Poppins: yedi ağırlık, her biri ayrı bir dosya. SemiBold'u yoktur: o ağırlıktaki bir metin komşu bir ağırlıkla çizilir. Lisansı, SIL Open Font License 1.1, dosyaların yanında: `files/licenses/poppins_ofl.txt`. Mac tuşlarının işaretleri kütüphanenin yedeğinden çizilir.

## API

### PantrixTypography

`import com.pantrixui.foundation.token.typography.PantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixTypography(
    val display: TextStyle,
    val headline: TextStyle,
    val title: TextStyle,
    val callout: TextStyle,
    val body: TextStyle,
    val label: TextStyle,
    val footnote: TextStyle,
    val caption: TextStyle,
    val code: TextStyle
)
```

Dokuz yazı stili: büyükten küçüğe sekizi, `display > headline > title > callout > body > label > footnote > caption`, ve yanlarında `code`: label boyutunda, eş aralıklı bir ailede.

Parametreler:

- `display: TextStyle`: Sayfa başlığı. Çoğunlukla ekranda bir tane olur.
- `headline: TextStyle`: Bölüm başlığı.
- `title: TextStyle`: Kart, panel ya da dialog başlığı.
- `callout: TextStyle`: Öne çıkan gövde: bir giriş paragrafı, boş bir ekranın açıklaması.
- `body: TextStyle`: Gövde metni: bir paragraf, bir açıklama, Android'de ve iOS'ta bir alana yazılan.
- `label: TextStyle`: Kontrol etiketi: düğme, gezinme öğesi, form alanının etiketi, sekme; masaüstünde ve web'de bir alana yazılan. Temel yazı: tema `LocalPantrixTextStyle`'ı bununla başlatır, bu yüzden stil verilmeyen bir `PantrixText` bununla yazılır.
- `footnote: TextStyle`: Yardım metni: form yardımı, hata açıklaması, ikincil yönlendirme.
- `caption: TextStyle`: Üst veri: zaman damgası, sayaç, tablo hücresinin ayrıntısı.
- `code: TextStyle`: Kimlik taşıyan metin: ID'ler, olay adları, kod parçaları; bir kod bloğunun ve bir JSON görünümünün yazıldığı stil.

### TypeRole

`import com.pantrixui.foundation.token.typography.TypeRole`, `com.pantrixui:foundation` içinden

```kotlin
enum class TypeRole
```

Yazı ölçeğinin bir rolü, işine göre: bir bileşenin stilinin, yazılarından birinin hangi türde yazıldığını yazı tipi tutmadan söylediği ad. Her birinin ne olduğunu temanın `PantrixTypography`'si söyler: `typography[TypeRole.Body]`.

Değerleri:

- `Display`: `PantrixTypography.display`.
- `Headline`: `PantrixTypography.headline`.
- `Title`: `PantrixTypography.title`.
- `Callout`: `PantrixTypography.callout`.
- `Body`: `PantrixTypography.body`.
- `Label`: `PantrixTypography.label`.
- `Footnote`: `PantrixTypography.footnote`.
- `Caption`: `PantrixTypography.caption`.
- `Code`: `PantrixTypography.code`.

### LocalPantrixTextStyle

`import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixTextStyle: ProvidableCompositionLocal<TextStyle>
```

Stil verilmeyen yazının yazıldığı stil, onu sağlayanın içindeki her şey için: `PantrixText`, `PantrixLink` ve `PantrixAutoText`'e stil verilmediğinde aldıkları. Tema onu ölçeğinin `PantrixTypography.label`'ıyla başlatır: her platformda temel yazı. Bir ekranın başka bir rolde okunan bir bölümü, body ile yazılan bir düz yazı sayfası gibi, onu `ProvidePantrixTextStyle` ile verir.

Compose Foundation'ın kendi `BasicText`'i böyle bir değer okumaz: stil verilmediğinde metnini `TextStyle.Default` ile, sistemin yazı tipiyle 14sp yazar. Uygulamanın Pantrix'in olmayan kendi bir yazısı bunu kendisi alır: `BasicText(text, style = LocalPantrixTextStyle.current)`. Bir `PantrixTheme`'in dışında bunun tuttuğu da `TextStyle.Default`'tur.

### ProvidePantrixTextStyle

`import com.pantrixui.foundation.token.typography.ProvidePantrixTextStyle`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ProvidePantrixTextStyle(
    style: TextStyle,
    content: @Composable () -> Unit
)
```

`content`'teki stil verilmeyen yazıyı, çevresindekinin üstüne `style` ile yazdırır: `style`'ın verdiği kazanır, vermediği olduğu gibi kalır; böylece `TextStyle(fontWeight = FontWeight.SemiBold)` çevresindeki yazıyı kalınlaştırır ve boyutunu korur.

Parametreler:

- `style: TextStyle`
- `content: @Composable () -> Unit`

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixTypography(): PantrixTypography
```

Pantrix'in yazı ölçeği, kendi yazı tipi Plus Jakarta Sans ile. Yazı tipi kütüphanenin kaynaklarından yüklenir.

Tarayıcı yazı tipini indirir ve gelene dek yedek bir yazı tipiyle çizer: geldiğini `isPantrixTypefaceLoaded` söyler.

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixTypography(
    typeface: PantrixTypeface,
    codeTypeface: PantrixTypeface? = null
): PantrixTypography
```

Pantrix'in yazı ölçeği, bir uygulamanın kendi `typeface`'iyle: ölçeğin boyutları ve ağırlıkları, yazı tipinin adını verdiği fontlarda; `codeTypeface` verilirse `code`'u onda.

Değişen bir yazı tipi gelince değişir. Tarayıcı bir yazı tipinin dosyalarını indirir ve onlar okunana kadar o yazı tipindeki metin yedek bir yazı tipiyle çizilir: bu yüzden `typeface` ya da `codeTypeface` yoldayken bu, ölçeği önceden verdiği yazı tiplerinde vermeyi sürdürür ve hepsi okununca bir kez yenilerinde verir. Önceden bir şey verilmediyse, bir uygulamanın ilk karesinde, yedek yazı tipinde verilir: `PantrixTypefaceGate` yazı tipleri gelene kadar ekranı bekletir.

```kotlin
val typography = rememberPantrixTypography(Brand, codeTypeface = BrandMono)
PantrixTheme(typography = typography) { App() }
```

Parametreler:

- `typeface: PantrixTypeface`: `code` dışındaki her rolün yazıldığı yazı tipi.
- `codeTypeface: PantrixTypeface?`: `code`'un yazıldığı yazı tipi: kimlikler, değerler, bir kod bloğunun satırları. Verilmezse platformun eş aralıklı ailesi; tarayıcıda ise böyle bir aile yoktur: Compose web'de sistemin yazı tiplerine ulaşmaz ve `code` orada sütunları hizalanmayan orantılı bir yedekle çizilir. Web için bir uygulama bir tane verir.

### buildPantrixTypography

`import com.pantrixui.foundation.token.typography.buildPantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
fun buildPantrixTypography(
    fontFamily: FontFamily = FontFamily.Default,
    headingFontFamily: FontFamily = fontFamily,
    monoFamily: FontFamily = FontFamily.Monospace
): PantrixTypography
```

Pantrix'in yazı ölçeği, `fontFamily` ile yazılmış hâliyle. Display, headline ve title için `headingFontFamily`, code için `monoFamily` kullanılır. Ölçeği koruyup yazı tipini değiştirmek için bir markanın aileleri verilir.

Parametreler:

- `fontFamily: FontFamily`
- `headingFontFamily: FontFamily`
- `monoFamily: FontFamily`

### PantrixTypeface

`import com.pantrixui.foundation.token.typography.PantrixTypeface`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixTypeface(
    val fonts: List<PantrixFont>,
    val fallbacks: List<PantrixFont> = emptyList()
)
```

Bir yazı tipi, onu oluşturan font dosyalarıyla ve bir tarayıcının onlarda olmayan karakterleri çizdiği fontlarla.

```kotlin
val Brand = PantrixTypeface(
    PantrixFont(Res.font.brand_regular),
    PantrixFont(Res.font.brand_bold, FontWeight.Bold)
)
```

`rememberPantrixTypography(Brand)` Pantrix'in yazı ölçeğini o yazı tipiyle verir, `rememberPantrixFontFamily` yalnızca ailesini. Android, iOS ve masaüstü dosyalarını istendikleri yerde okur. Tarayıcı onları indirir ve gelene dek yedek bir yazı tipiyle çizer: geldiklerini `areTypefacesLoaded` söyler, `PantrixTypefaceGate` de bir ekranı o zamana dek bekletir.

Tarayıcıda Compose, uygulamanın hiçbir fontunda olmayan bir karakteri Google'ın sunucularından indirdiği bir Noto fontuyla çizer: her ziyaretçinin tarayıcısı onu Google'dan ister, çevrimdışı bir sayfada karakter boş kalır ve bir içerik güvenliği politikası sayfanın Google'a ulaşmasına izin vermek zorunda kalır. `fallbacks`'te verilen ve karakteri taşıyan bir font bunun yerine yazı tipiyle birlikte okunur ve onun için hiçbir şey indirilmez. Mac tuşlarının işaretlerini yazan bir marka Pantrix'inkini verir:

```kotlin
val Brand = PantrixTypeface(
    fonts = listOf(PantrixFont(Res.font.brand_regular), PantrixFont(Res.font.brand_bold, FontWeight.Bold)),
    fallbacks = PantrixTypeface.Default.fallbacks
)
```

Parametreler:

- `fonts: List<PantrixFont>`: Fontları: her biri ağırlığı ve stiliyle bir dosya. En az bir tane.
- `fallbacks: List<PantrixFont>`: Bir tarayıcının, `fonts`'un hiçbirinde olmayan bir karakteri çizdiği fontlar; onlarla birlikte okunur: yazı tipinin kapsamadığı bir yazı, Arapça gibi, ya da işaretler, Mac tuşlarınınki gibi. Her biri, metnin ağırlığı ne olursa olsun, olduğu gibi çizilir. Android'de, iOS'ta ve masaüstünde böyle bir karakteri sistemin fontları çizer ve bunlar okunmaz.

Başka bir kurucu:

```kotlin
constructor(vararg fonts: PantrixFont)
```

Parametreleri:

- `vararg fonts: PantrixFont`

Tipin kendisinde:

- `PantrixTypeface.Default: PantrixTypeface`: Pantrix'in kendi yazı tipi, Plus Jakarta Sans, kütüphanenin kaynaklarından: tipografi verilmeyen bir temanın çizdiği yazı tipi. Yedeği Pantrix Symbols, Noto'nunkilerden kesilmiş birkaç kilobaytlık bir font, bir kısayolun Apple'ın sistemlerinde yazıldığı ve Plus Jakarta Sans'ta olmayan işaretleri taşır: `⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`.

### PantrixFont

`import com.pantrixui.foundation.token.typography.PantrixFont`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixFont(
    val resource: FontResource,
    val weight: FontWeight = FontWeight.Normal,
    val style: FontStyle = FontStyle.Normal,
    val variationSettings: FontVariation.Settings = FontVariation.Settings(weight, style)
)
```

Bir yazı tipinin bir fontu: uygulamanın kaynaklarından bir dosya, ve bir ailenin onu kaydettiği ağırlık ile stil.

Compose kaynaklarının `Font(resource, weight, style)` fonksiyonunun aldığı şeydir, bir değer olarak tutulur: böylece tek bir font listesi hem aileyi kurar hem de okunup okunmadığı sorulur, ikisi birbirinden ayrılamaz. Değişken bir font tek dosyadır ve çizileceği her ağırlık için bir kez verilir.

Parametreler:

- `resource: FontResource`: Font dosyası, uygulamanın üretilen `Res.font`'unun verdiği adla.
- `weight: FontWeight`: Dosyanın çizildiği ağırlık.
- `style: FontStyle`: Dik ya da italik.
- `variationSettings: FontVariation.Settings`: Fontun, değişken bir fontun eksenlerinde nerede çizildiği. Verilmezse `weight` ve `style` ne diyorsa odur; başka eksenleri olan bir fonta (bir genişlik, bir optik boyut) onlar burada verilir.

### rememberPantrixFontFamily

`import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixFontFamily(typeface: PantrixTypeface): FontFamily
```

`typeface`'in ailesi: fontlarının her biri, dosyasından okunmuş olarak.

Tarayıcıda henüz gelmemiş bir font yedek yazı tipidir ve aile, fontları geldikçe değişir. `rememberPantrixTypography(typeface)` bir ekranın bunu göstermesini önler.

Parametreler:

- `typeface: PantrixTypeface`

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun areTypefacesLoaded(vararg typefaces: PantrixTypeface): Boolean
```

`typefaces`'in her fontu, yedekleri de, okundu mu.

Android, iOS ve masaüstü bir fontu istendiği yerde okur ve bu, ilk kareden itibaren doğrudur. Tarayıcı dosyaları indirir: gelene dek onlarla yazılan her metin çizicinin taşıdığı yedek yazı tipiyle çizilir ve geldiklerinde yeniden yerleştirilir. Bir yazı tipinin yedekleri fontlarının yanında okunur ve okununca Compose'un metnine verilir; böylece yalnızca onlarda olan bir karakter ilk kareden onlarla çizilir.

Okumayı başlatan sormaktır ve her font birlikte istenir. Bu yüzden bir ekranın gerek duyduğu yazı tipleri tek çağrıda verilir: `&&` ile bağlanan iki çağrı, ilki gelmeden ikinci yazı tipini istemezdi. Bir dosyanın okunamadığı yerde yanlış kalır; bu yüzden ona bakarak bekleyen bir süre bekler, daha fazla değil.

Parametreler:

- `vararg typefaces: PantrixTypeface`

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun areTypefacesLoaded(typefaces: List<PantrixTypeface>): Boolean
```

`typefaces`'in her fontunun okunup okunmadığı: bir uygulamanın ilk karesinin beklediği şeylerin listesi için, onu bir diziye yaymadan `areTypefacesLoaded`.

```kotlin
PantrixTypefaceGate(loaded = areTypefacesLoaded(AppTypefaces.all)) { App() }
```

Parametreler:

- `typefaces: List<PantrixTypeface>`

### isPantrixTypefaceLoaded

`import com.pantrixui.foundation.token.typography.isPantrixTypefaceLoaded`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun isPantrixTypefaceLoaded(): Boolean
```

Pantrix'in kendi yazı tipi okundu mu: okunduysa `rememberPantrixTypography` onunla çizer.

Android, iOS ve masaüstü bir yazı tipini istendiği yerde okur ve bu, ilk kareden itibaren doğrudur. Tarayıcı dosyayı indirir: gelene dek her metin çizicinin taşıdığı yedek yazı tipiyle çizilir ve yazı tipi geldiğinde onunla yeniden yerleştirilir; okuyan bunu, sayfa açıldıktan bir an sonra harflerin değişmesi olarak görür. Bunu göstermek istemeyen bir web uygulaması ekranını bu doğru olunca çizer, o zamana dek de dilediğini:

```kotlin
if (isPantrixTypefaceLoaded()) App() else Splash()
```

Okumayı başlatan sormaktır; temanın yazı tipini sonradan hemen bulmasını sağlayan da odur: ilk kompozisyonda, bekleyecek ekrandan önce sorulur. Dosyanın okunamadığı yerde yanlış kalır; bu yüzden ona bakarak bekleyen bir uygulama bir süre bekler, daha fazla değil.

### PantrixTypefaceGate

`import com.pantrixui.foundation.token.typography.PantrixTypefaceGate`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTypefaceGate(
    loaded: Boolean = isPantrixTypefaceLoaded(),
    timeoutMillis: Int = 3000,
    onShown: () -> Unit = {},
    content: @Composable () -> Unit
)
```

`content`'i, çizileceği yazı tipi okunduktan sonra çizer; o zamana dek hiçbir şey çizmez.

Tarayıcıdaki bir uygulama içindir ve uygulamanın tamamını sarar. Android, iOS ve masaüstü bir fontu istendiği yerde okur; orada `content` ilk karede çizilir. Tarayıcı fontu indirir ve gelene dek yedek bir yazı tipiyle çizer: o arada çizilen bir uygulamanın harfleri, açıldıktan bir an sonra değişir ve her metin yeniden yerleşir. Burada uygulama bir kez, kendi harfleriyle çizilir; beklerken sayfa uygulamadan önce gösterdiğini, kendi yükleme işaretini gösterir.

Hiç gelmeyen bir yazı tipi (dosya yok, ağ kesik) `timeoutMillis` kadar beklenir, daha fazla değil: uygulama o zaman yedek yazı tipiyle çizilir, çünkü boş bir sayfa yanlış harflerden kötüdür. Bir kez çizilen `content` yerinde kalır: sonradan değişen hiçbir şey onu kaldırmaz.

Parametreler:

- `loaded: Boolean`: Yazı tipi okundu mu: verilmezse Pantrix'in kendi yazı tipi için, bir uygulamanınki için `areTypefacesLoaded(…)`. Okumayı başlatan sormaktır.
- `timeoutMillis: Int`: Yazı tipi için beklenen en uzun süre.
- `onShown: () -> Unit`: `content`'i taşıyan kare çizildiğinde bir kez çağrılır: sayfa yükleme işaretini burada kaldırır ve altında boş bir sayfa değil, uygulama vardır.
- `content: @Composable () -> Unit`: Yazı tipini bekleyen: uygulamanın kendisi.

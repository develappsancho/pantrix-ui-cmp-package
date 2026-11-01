# İç içe tema

İç içe tema: ekranın bir bölümü farklı görünecekse o bölüm ikinci bir `PantrixTheme` ile sarılır ve yalnızca değişen şey verilir. İçteki tema, kendisine verilmeyen her ayarı dıştakinden alır; verilen onun olur.

Örneklerde temanın o noktadaki değerleri satır satır yazar. Dıştaki temanınkinden farklı olan satırın sonunda "(değişti)" durur: içteki temanın neyi değiştirdiği, neyi dıştakinden aldığı oradan okunur.

## Özellikler

- **Yalnızca verilen değişir.** Uygulamanın temasına söylediği platform, yoğunluk, dil ve metinleri, stiller ve olayların gittiği yer içteki temada da dıştakinindir.
- **Koyu ya da açık bölüm.** `darkTheme` verilmeyen bir tema, çevresindeki kadar koyudur ve onun renklerini korur. Açık bir temanın içinde koyu olması söylenirse dıştaki temanın kurulduğu preset'in koyu renklerini, preset yoksa Pantrix'in kendi koyu setini alır.
- **Kendi renkleri.** `colors` verilen bölüm o setle çizilir: tek bir rolü değişmiş bir set de olabilir.
- **Yoğunluk bir kez uygulanır.** `density` boşlukları ve yükseklikleri içteki temanın yoğunluğuyla ölçekler: dıştakinin üstüne değil, onun yerine. `Compact` dokunma hedefini küçültmez.
- **Dil ve yazı yönü.** `locale` verilen bölümde bileşenlerin kendiliğinden söyledikleri o dildedir ve yazı yönü o dilin yönüdür.
- **Olaylar.** `analytics` verilmeyen bir bölümün bileşenleri olaylarını dıştaki temanın verdiği yere bildirir.
- **Preset.** `PantrixTheme(preset = …)` bir bölümü bir markanın görünüşüne sokar: renkler, tipografi, şekiller ve bileşen ayarları preset'indir, gerisi dıştaki temanın. Bölüm, sistem ne derse desin, çevresindeki tema kadar koyudur.
- **Okurun seçtiği koyuluk.** `rememberPantrixColors(preset, darkTheme)` preset'in açık ya da koyu setini verir. En dıştaki tema Android'in çubuklarını ve iOS'un durum çubuğunu, klavyesini ve kontrollerini kendi koyuluğuna uydurur; çubuklarını kendisi ayarlayan uygulama `followSystemBars = false` verir.
- **Tema zemin çizmez.** Koyu bir bölümün zeminini, temanın içine konan bir `PantrixSurface` ya da bir kart çizer.
- **Tema bir düzen değildir.** İçindekileri, temanın içinde durduğu düzen yerleştirir: tema orada yokmuş gibi.

## Örnekler

### Tersi renkte bölüm

Çevresinin tersi renkte bir bölüm: açık temada koyu, koyu temada açık. İçteki temaya yalnızca `darkTheme` verilir; yoğunluk, dokunma hedefi ve dil dıştaki temanınkidir. Satırlara bak: yalnızca "Renkler" değişti.

Tema zemin çizmez. Bölümün zeminini içindeki `PantrixSurface` çizer: içteki temanın `surface` rengiyle. Yazı, checkbox ve satırlar da renklerini içteki temadan okur.

Anahtarı kapat: bölüme çevresinin kendi rengi söylenir, tema dıştakinin renklerini korur ve hiçbir satır değişmez.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val outer = themeValues()
var opposite by rememberSaveable { mutableStateOf(true) }
var subscribed by rememberSaveable { mutableStateOf(false) }
// Bölüm çevresinin tersidir: adı da çevresine göre söylenir.
val named = if (outer.isDark) "Açık" else "Koyu"
val dark = if (opposite) !outer.isDark else outer.isDark
PantrixSwitchButton(
    checked = opposite,
    onCheckedChange = { opposite = it },
    label = "Bölüm sayfanın tersi renkte olsun",
    tagKey = "opposite_colors"
)
PantrixTheme(darkTheme = dark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth().testTag("dark_part_ground")) {
        Column(
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = "$named bölüm: yalnızca renkler değişir", style = PantrixTheme.typography.callout)
            ThemeValueLines(tagKey = "dark_part", outer = outer)
            PantrixCheckbox(
                checked = subscribed,
                onCheckedChange = { subscribed = it },
                label = "Bültene abone ol",
                tagKey = "subscribe_in_dark_part"
            )
        }
    }
}
PantrixText(
    text = "PantrixTheme(darkTheme = $dark) { PantrixSurface { … } }",
    style = PantrixTheme.typography.code
)

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Renkler", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Yoğunluk", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Boşluk (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Dokunma hedefi",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Dil", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "Bileşenin kendi metni",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Koyu" else "Açık",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (değişti)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

private const val HALF_LUMINANCE = 0.5f
```

### Dıştaki temaya giden olaylar

Dıştaki temaya yalnızca bileşenlerin olaylarını sayan bir `analytics` verildi. Satırlar onun içinde yazar: renkler, yoğunluk ve dil uygulamanın temasından gelir, hiçbiri değişmedi.

Onun içindeki bölüm de bir temadır ve ona yalnızca `darkTheme` verildi. "Kaydet"e bas: olay, bölümün temasının içinden, dıştaki temanın sayacına gider. Bölümün teması `analytics` vermez; dıştakininkini alır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var reported by rememberSaveable { mutableIntStateOf(0) }
var lastEvent by rememberSaveable { mutableStateOf("") }
val counter = remember {
    PantrixAnalytics { event ->
        reported++
        lastEvent = "${event.component} · ${event.action}"
    }
}
PantrixTheme(analytics = counter) {
    val around = themeValues()
    ThemeValueLines(tagKey = "page")
    PantrixTheme(darkTheme = !around.isDark) {
        PantrixSurface(modifier = Modifier.fillMaxWidth()) {
            PantrixButton(
                text = "Kaydet",
                onClick = {},
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                tagKey = "save_in_dark_part"
            )
        }
    }
}
PantrixText(text = "Raporlanan olay: $reported", tagKey = "reported")
if (lastEvent.isNotEmpty()) {
    PantrixText(
        text = "Son olay: $lastEvent",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "last_event"
    )
}

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Renkler", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Yoğunluk", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Boşluk (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Dokunma hedefi",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Dil", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "Bileşenin kendi metni",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (değişti)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Koyu" else "Açık",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

private const val HALF_LUMINANCE = 0.5f
```

### Sıkışık bölüm: yalnızca yoğunluk değişir

Aynı kontroller, önce sayfanın yoğunluğunda, sonra `Compact` bir bölümde: sıkışık bir tablo ya da bir araç çubuğu için. İçteki temaya yalnızca `density` verilir. Yoğunluk havayı ölçekler: boşlukları ve yükseklikleri. Renkler ve dil dıştaki temanınkidir.

Yoğunluk bir kez uygulanır, dıştakinin üstüne değil: uygulamanın yoğunluğu "Ferah" iken de sıkışık bölümün boşluğu `Compact`'in boşluğudur. "Ayarlar"da yoğunluğu değiştirip satırlara bak.

Dokunma hedefi ayrı durur: `Spacious` onu büyütür, `Compact` küçültmez. Platformun değeri bir tabandır; sıkışık bir bölümde de parmağın basacağı yer küçülmez.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity
import kotlin.math.roundToInt

val outer = themeValues()
PantrixText(text = "Sayfanın yoğunluğunda")
Controls(tagKey = "page_density")
PantrixText(text = "Compact")
PantrixTheme(density = PantrixDensity.Compact) {
    Controls(tagKey = "compact")
    ThemeValueLines(tagKey = "dense_part", outer = outer)
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Onayla", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Vazgeç", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filtre", onClick = {}, tagKey = "filter_$tagKey")
    }
}

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Renkler", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Yoğunluk", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Boşluk (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Dokunma hedefi",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Dil", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "Bileşenin kendi metni",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (değişti)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Koyu" else "Açık",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

private const val HALF_LUMINANCE = 0.5f
```

### Başka dilde bölüm: bileşenlerin kendi metinleri değişir

Uygulamanın konuşmadığı dilde bir bölüm: uygulama Türkçeyken İngilizce, İngilizceyken Türkçe. İçteki temaya yalnızca `locale` verilir: bileşenlerin kendiliğinden söyledikleri ("Yükleniyor", "Kapat") o dilinkilerdir. Satırlarda dil ve bileşenin kendi metni değişti; renkler, yoğunluk ve gerisi dıştaki temanınkidir.

Uygulamanın kendi yazdığı metinleri tema çevirmez: satırların adları uygulamanın dilinde kaldı.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.luminance
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val outer = themeValues()
// Bölüm çevresinin dilinde değildir: dili de çevresine göre seçilir.
val other = if (PantrixTheme.locale.language == "en") PantrixLocale.Turkish else PantrixLocale.English
PantrixTheme(locale = other) {
    ThemeValueLines(tagKey = "language_part", outer = outer)
}

@Composable
private fun ThemeValueLines(
    tagKey: String,
    outer: ThemeValues? = null
) {
    val now = themeValues()
    Column {
        ValueLine(name = "Renkler", now = now.colors, outer = outer?.colors, tagKey = "${tagKey}_colors")
        ValueLine(name = "Yoğunluk", now = now.density, outer = outer?.density, tagKey = "${tagKey}_density")
        ValueLine(name = "Boşluk (spacing.md)", now = now.spacing, outer = outer?.spacing, tagKey = "${tagKey}_spacing")
        ValueLine(
            name = "Dokunma hedefi",
            now = now.touchTarget,
            outer = outer?.touchTarget,
            tagKey = "${tagKey}_touch_target"
        )
        ValueLine(name = "Dil", now = now.language, outer = outer?.language, tagKey = "${tagKey}_language")
        ValueLine(
            name = "Bileşenin kendi metni",
            now = now.loading,
            outer = outer?.loading,
            tagKey = "${tagKey}_loading"
        )
    }
}

@Composable
private fun ValueLine(
    name: String,
    now: String,
    outer: String?,
    tagKey: String
) {
    val changed = outer != null && outer != now
    PantrixText(
        text = if (changed) "$name: $now (değişti)" else "$name: $now",
        style = PantrixTheme.typography.footnote,
        color = if (changed) PantrixTheme.colors.textPrimary else PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

private data class ThemeValues(
    val isDark: Boolean,
    val colors: String,
    val density: String,
    val spacing: String,
    val touchTarget: String,
    val language: String,
    val loading: String
)

@Composable
@ReadOnlyComposable
private fun themeValues(): ThemeValues {
    val isDark = PantrixTheme.colors.background.luminance() < HALF_LUMINANCE
    return ThemeValues(
        isDark = isDark,
        colors = if (isDark) "Koyu" else "Açık",
        density = PantrixTheme.density.name,
        spacing = "${PantrixTheme.spacing.md.value.roundToInt()} dp",
        touchTarget = "${PantrixTheme.platform.minTouchTarget.value.roundToInt()} dp",
        language = PantrixTheme.locale.languageTag,
        loading = PantrixTheme.strings.loading
    )
}

private const val HALF_LUMINANCE = 0.5f
```

### Sağdan sola bölüm

Yazı yönü dilden gelir: tema, kendisine verilen dilin yönünü içindekilere söyler. `PantrixLocale.Arabic` sağdan sola yazılır; bu bölümde satırın başı sağdadır ve "Birinci" düğmesi orada durur. Satıra ve düğmelere yön verilmedi: bir bileşen dile bakmaz, yönü temanın söylediği yerden, Compose'un `LocalLayoutDirection`'ından okur.

Bölümün içeriği temanın içindeki bir `Column`'dadır. Tema bir düzen olmadığı için yönü içindeki düzenler okur: sütun satırlarını, satır düğmelerini sağdan başlatır. Alttaki satır temanın dilini ve o noktadaki yazı yönünü yazar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme

PantrixTheme(locale = PantrixLocale.Arabic) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixButton(text = "Birinci", onClick = {}, tagKey = "rtl_first")
            PantrixButton(text = "İkinci", onClick = {}, variant = ButtonVariant.Outline, tagKey = "rtl_second")
        }
        PantrixText(
            text = "Dil: ${PantrixTheme.locale.languageTag} · Yön: ${LocalLayoutDirection.current.name}",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary,
            tagKey = "rtl_part"
        )
    }
}
```

### Kendi renginde bölüm

`colors` verilen tema içindekilere o seti verir. Burada dıştaki temanın renkleri alınır ve yalnızca `primary` rolü uygulamanın kendi moruyla değiştirilir: `PantrixTheme.colors.copy(primary = …)`. Bölümdeki düğmelere ve chip'e renk verilmedi; `primary`'yi okuyan, moru alır.

Yoğunluk, dil ve gerisi dıştaki temanınkidir: iki satırdaki kontroller yalnızca renkleriyle ayrılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixText(text = "Sayfanın renklerinde")
Controls(tagKey = "page_colors")
PantrixText(text = "primary rolü değişmiş bir temada")
PantrixTheme(colors = PantrixTheme.colors.copy(primary = own)) {
    Controls(tagKey = "own_colors")
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Onayla", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Vazgeç", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filtre", onClick = {}, tagKey = "filter_$tagKey")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Tema bir düzen değildir

İçteki temanın içeriğini, temanın içinde durduğu düzen yerleştirir: tema araya bir kutu koymaz. "İleri" ve "Bitir" bir temanın içindedir ama "Geri" ile aynı `Row`'un çocuklarıdır; yan yana dizilirler ve aralarını `Row` verir.

Sıkışık olan yalnızca içteki temanın iki düğmesidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButton(text = "Geri", onClick = {}, variant = ButtonVariant.Outline, tagKey = "row_back")
    PantrixTheme(density = PantrixDensity.Compact) {
        PantrixButton(text = "İleri", onClick = {}, tagKey = "row_next")
        PantrixButton(text = "Bitir", onClick = {}, tagKey = "row_finish")
    }
}
```

### Bir markanın hazır ayarı

Bir markanın görünüşü tek bir yerde: bir `DesignPreset` renklerini (açık ve koyu), tipografisini, şekillerini ve bileşen ayarlarını verir. `PantrixTheme(preset = Harbor)` bölümü o markaya sokar; gerisi, dil, yoğunluk, olaylar, dıştaki temanındır. Bölüm çevresi kadar koyudur: koyu bir sayfada markanın koyu renkleriyle çizilir.

Markanın renkleri temanın dışında da okunur: `rememberPantrixColors(Harbor)` sistemin açık ya da koyu oluşuna göre markanın setini verir, bir sistem çubuğunun ya da bir bildirimin rengi için. Alttaki çizgi onun ana rengidir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.theme.preset.DesignPreset
import com.pantrixui.foundation.token.color.Dark
import com.pantrixui.foundation.token.color.Light
import com.pantrixui.foundation.token.color.PantrixColor
import com.pantrixui.foundation.token.color.PantrixColors
import com.pantrixui.foundation.token.color.PantrixPalette
import com.pantrixui.foundation.token.color.rememberPantrixColors
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ComponentTokenOverrides
import com.pantrixui.foundation.token.typography.PantrixTypeface
import com.pantrixui.foundation.token.typography.PantrixTypography
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily

PantrixTheme(preset = Harbor) {
    PantrixSurface(border = PantrixTheme.colors.divider) {
        Column(
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = Harbor.name, style = PantrixTheme.typography.title)
            Controls(tagKey = "preset")
        }
    }
}
val brand = rememberPantrixColors(Harbor).primary.color
Box(Modifier.fillMaxWidth().height(4.dp).background(brand, PantrixTheme.shapes.full))

private object Harbor : DesignPreset {
    override val name: String = "Harbor"

    override fun colors(dark: Boolean): PantrixColors {
        val teal = PantrixPalette.Teal
        return if (dark) {
            PantrixColors.Dark.copy(
                primary = PantrixColor(
                    color = teal.shade400,
                    onColor = teal.shade950,
                    container = teal.shade900,
                    onContainer = teal.shade100
                )
            )
        } else {
            PantrixColors.Light.copy(
                primary = PantrixColor(
                    color = teal.shade700,
                    onColor = Color.White,
                    container = teal.shade100,
                    onContainer = teal.shade900
                )
            )
        }
    }

    @Composable
    override fun typography(): PantrixTypography {
        val text = rememberPantrixFontFamily(PantrixTypeface.Default)
        val headings = rememberPantrixFontFamily(Poppins)
        return remember(text, headings) { buildPantrixTypography(fontFamily = text, headingFontFamily = headings) }
    }

    @Composable
    override fun shapes(): PantrixShapes = remember {
        PantrixShapes(md = RoundedCornerShape(4.dp), lg = RoundedCornerShape(6.dp), xl = RoundedCornerShape(8.dp))
    }

    override fun componentOverrides(): ComponentTokenOverrides =
        ComponentTokenOverrides(shapes = mapOf("button.shape" to ShapeRole.Small))
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Onayla", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Vazgeç", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filtre", onClick = {}, tagKey = "filter_$tagKey")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `Poppins`: Uygulamanın kendi dosyalarından Poppins: yedi ağırlık, her biri ayrı bir dosya. SemiBold'u yoktur: o ağırlıktaki bir metin komşu bir ağırlıkla çizilir. Lisansı, SIL Open Font License 1.1, dosyaların yanında: `files/licenses/poppins_ofl.txt`. Mac tuşlarının işaretleri kütüphanenin yedeğinden çizilir.

### Okurun seçtiği koyuluk

Okur koyu ya da açık temayı uygulamanın kendi ayarından seçer: preset'in o koyuluktaki seti `rememberPantrixColors(Harbor, darkTheme = dark)` ile alınır ve temaya verilir. Sistemin modu ne derse desin bölüm seçilen koyuluktadır.

Uygulamanın kökündeki, en dıştaki tema sistemin çizdiği parçaları da bu seçime uydurur: Android'in çubuklarının simgelerini, iOS'un durum çubuğunu, klavyesini ve kontrollerini. Buradaki tema içte durduğu için çubuklara dokunmaz. Çubuklarını kendisi boyayan bir uygulama en dıştaki temaya `followSystemBars = false` verir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.theme.preset.DesignPreset
import com.pantrixui.foundation.token.color.Dark
import com.pantrixui.foundation.token.color.Light
import com.pantrixui.foundation.token.color.PantrixColor
import com.pantrixui.foundation.token.color.PantrixColors
import com.pantrixui.foundation.token.color.PantrixPalette
import com.pantrixui.foundation.token.color.rememberPantrixColors
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ComponentTokenOverrides
import com.pantrixui.foundation.token.typography.PantrixTypeface
import com.pantrixui.foundation.token.typography.PantrixTypography
import com.pantrixui.foundation.token.typography.buildPantrixTypography
import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily

var dark by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = dark,
    onCheckedChange = { dark = it },
    label = "Koyu tema",
    tagKey = "chosen_dark"
)
PantrixTheme(preset = Harbor, colors = rememberPantrixColors(Harbor, darkTheme = dark)) {
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        Column(
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = if (dark) "Koyu" else "Açık", style = PantrixTheme.typography.title)
            Controls(tagKey = "chosen")
        }
    }
}

private object Harbor : DesignPreset {
    override val name: String = "Harbor"

    override fun colors(dark: Boolean): PantrixColors {
        val teal = PantrixPalette.Teal
        return if (dark) {
            PantrixColors.Dark.copy(
                primary = PantrixColor(
                    color = teal.shade400,
                    onColor = teal.shade950,
                    container = teal.shade900,
                    onContainer = teal.shade100
                )
            )
        } else {
            PantrixColors.Light.copy(
                primary = PantrixColor(
                    color = teal.shade700,
                    onColor = Color.White,
                    container = teal.shade100,
                    onContainer = teal.shade900
                )
            )
        }
    }

    @Composable
    override fun typography(): PantrixTypography {
        val text = rememberPantrixFontFamily(PantrixTypeface.Default)
        val headings = rememberPantrixFontFamily(Poppins)
        return remember(text, headings) { buildPantrixTypography(fontFamily = text, headingFontFamily = headings) }
    }

    @Composable
    override fun shapes(): PantrixShapes = remember {
        PantrixShapes(md = RoundedCornerShape(4.dp), lg = RoundedCornerShape(6.dp), xl = RoundedCornerShape(8.dp))
    }

    override fun componentOverrides(): ComponentTokenOverrides =
        ComponentTokenOverrides(shapes = mapOf("button.shape" to ShapeRole.Small))
}

@Composable
private fun Controls(tagKey: String) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Onayla", onClick = {}, tagKey = "confirm_$tagKey")
        PantrixButton(text = "Vazgeç", onClick = {}, variant = ButtonVariant.Outline, tagKey = "cancel_$tagKey")
        PantrixChip(label = "Filtre", onClick = {}, tagKey = "filter_$tagKey")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `Poppins`: Uygulamanın kendi dosyalarından Poppins: yedi ağırlık, her biri ayrı bir dosya. SemiBold'u yoktur: o ağırlıktaki bir metin komşu bir ağırlıkla çizilir. Lisansı, SIL Open Font License 1.1, dosyaların yanında: `files/licenses/poppins_ofl.txt`. Mac tuşlarının işaretleri kütüphanenin yedeğinden çizilir.

### Temanın yerelleri

Temanın her değeri bir `CompositionLocal`'dır: `PantrixTheme.spacing` `LocalPantrixSpacing`'i okur, `PantrixTheme.colors` `LocalPantrixColors`'ı. Satırlar aynı değerleri doğrudan yerellerden okur. Bir önizleme ya da bir test bir yereli tek başına da verebilir: alttaki düğme `LocalPantrixShapes provides PantrixShapes.Pill` ile çizildi. Uygulamada bir bölümü değiştirmenin yolu yine iç içe bir temadır: tema verdiği değerleri birbirine uydurur, boşlukları yoğunlukla ölçekler; tek bir yerel bunu yapmaz.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.LocalPantrixPlatform
import com.pantrixui.foundation.adaptive.LocalPantrixLayouts
import com.pantrixui.foundation.l10n.LocalPantrixLocale
import com.pantrixui.foundation.l10n.LocalPantrixStrings
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.LocalPantrixColors
import com.pantrixui.foundation.token.density.LocalPantrixDensity
import com.pantrixui.foundation.token.elevation.LocalPantrixElevation
import com.pantrixui.foundation.token.motion.LocalPantrixMotion
import com.pantrixui.foundation.token.shape.LocalPantrixShapes
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.spacing.LocalPantrixSpacing
import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle
import com.pantrixui.foundation.token.typography.LocalPantrixTypography

localLines().forEach { line ->
    PantrixText(text = line, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
}
CompositionLocalProvider(LocalPantrixShapes provides PantrixShapes.Pill) {
    PantrixButton(
        text = "Yalnız şekilleri hap",
        onClick = {},
        variant = ButtonVariant.Outline,
        tagKey = "pill_preview"
    )
}

@Composable
private fun localLines(): List<String> {
    val sameColors = LocalPantrixColors.current == PantrixTheme.colors
    return listOf(
        "LocalPantrixColors · PantrixTheme.colors ile ${if (sameColors) "aynı" else "farklı"}",
        "LocalPantrixTypography · body ${LocalPantrixTypography.current.body.fontSize.value.toInt()}sp",
        "LocalPantrixTextStyle · ${LocalPantrixTextStyle.current.fontSize.value.toInt()}sp",
        "LocalPantrixSpacing · lg ${LocalPantrixSpacing.current.lg.value.toInt()}dp",
        "LocalPantrixElevation · lg ${LocalPantrixElevation.current.lg.value.toInt()}dp",
        "LocalPantrixMotion · normal ${LocalPantrixMotion.current.normal} ms",
        "LocalPantrixDensity · ${LocalPantrixDensity.current.name}",
        "LocalPantrixPlatform · ${LocalPantrixPlatform.current.type.name}",
        "LocalPantrixLayouts · compact ${LocalPantrixLayouts.current.compact.margin.value.toInt()}dp",
        "LocalPantrixLocale · ${LocalPantrixLocale.current.languageTag}",
        "LocalPantrixStrings · ${LocalPantrixStrings.current.close}"
    )
}
```

## API

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTheme(
    preset: DesignPreset,
    colors: PantrixColors = rememberPantrixColors(preset, darkTheme = inheritedDarkThemeOrSystem()),
    typography: PantrixTypography = preset.typography(),
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = preset.shapes(),
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides = preset.componentOverrides(),
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

Bir markanın tek yerde toplanmış görünüşü olan `preset` üstüne kurulan tema: sistem nasılsa öyle açık ya da koyudur.

Preset veren çağrı buraya gelir. Öteki her çağrı, `PantrixTheme { … }` de içinde, `PantrixColors` alan biçimdir.

Tema, içeriğine içinde çizildiği pencereyi de söyler: `PantrixTheme.window`. Bu, `window` başka bir pencere vermedikçe Compose'un bildirdiği penceredir, başka bir temanın içindeyse o temanın penceresidir. `layouts`, o pencerenin her sınıfı için sayfanın kenar boşluğu ve sütun arasıdır. `PantrixTheme.layout` pencerenin bulunduğu sınıfınkileri verir.

**Başka bir temanın içinde**,  alan biçim gibi, kendisine verilmeyen her şeyi o temadan alır. Preset'e ait olanlar, yani renkler, tipografi, şekiller ve bileşen ayarları preset'indir. Tema çevresindeki tema kadar koyudur: sistem ne derse desin, koyu bir temada preset'in koyu renkleri kullanılır.

Parametreler:

- `preset: DesignPreset`
- `colors: PantrixColors`: renk rolleri: `preset`'inkiler; çevresindeki tema kadar koyu, çevresinde tema yoksa sistem kadar. `inheritedDarkThemeOrSystem`: Bu çağrının çevresindeki tema koyu mu, çevresinde tema yoksa sistem koyu mu: koyu bir temanın içindeki tema, sistem ne derse desin, aksi söylenmedikçe koyudur.
- `typography: PantrixTypography`: yazı ölçeği: `preset`'inki.
- `density: PantrixDensity`: bileşenlerin boşluğunu ölçekleyen arayüz yoğunluğu: dıştaki bir temanınki ya da `Comfortable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `shapes: PantrixShapes`: köşe yarıçapları: `preset`'inkiler.
- `motion: PantrixMotion`: süreler ve yumuşatmalar: dıştaki bir temanınkiler ya da Pantrix'in kendileri; sistem daha az hareket isterken her süre sıfırdır. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `spacing: PantrixSpacing`: boşluk ölçeği, yoğunluk onu ölçeklemeden önceki hâliyle: dıştaki bir temaya verilen ya da Pantrix'in kendisi. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `elevation: PantrixElevation`: gölgelerin derinlikleri: dıştaki bir temanınkiler ya da Pantrix'in kendileri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `platform: PantrixPlatform`: bileşenlerin geleneklerini izlediği platform; dokunma alanı, odak halkası ve ön ayarlarıyla: dıştaki bir temaya verilen ya da sistemin bildirdiği gibi uygulamanın çalıştığı platform. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `window: PantrixWindow`: `inheritedPantrixWindow`: Bu çağrının çevresindeki bir temanın ya da bir sağlayıcının verdiği pencere, yoksa null. Başka bir temanın içindeki tema, kendisine pencere verilmediğinde bunu alır: böylece bir testin sabitlediği pencere içteki temada kaybolmaz.
- `layouts: PantrixLayouts`: `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `componentOverrides: ComponentTokenOverrides`: markanın tek tek bileşenlere token ayarları: `preset`'inkiler.
- `styles: PantrixStyles`: bileşenlerin, ön ayarlarının üstüne aldığı stil ayarları: dıştaki bir temanınkiler ya da hiçbiri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `locale: PantrixLocale`: bileşenlerin konuştuğu ve yerleştiği dil: dıştaki bir temanınki ya da sistemin dili. Temanın içindeki her şeyin yerleşme yönü yalnızca onun `layoutDirection`'ıdır, temanın çevresinde verilen bir `LocalLayoutDirection`'ın üstünde: sağdan sola bir yerleşim, sağdan sola yazılan bir dille istenir, örneğin `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `strings: PantrixStrings`: bileşenlerin kendi sözleri: `locale`'in dilini konuşuyorsa dıştaki bir temanınkiler, değilse Pantrix'in o dile ait paketi. `inheritedStringsOr`: Bu çağrının çevresindeki temanın dili `locale` ise o temanın metinleri; dili başkaysa ya da çevresinde tema yoksa `locale`'in kendi metinleri. Bir uygulamanın temasına verdiği metinler temanın içinde korunur, başka bir dil verilen tema ise o dilin metinlerini alır.
- `testTagPolicy: TestTagPolicy`: bileşenlerin otomasyon etiketlerini anlam ağacına koyup koymadığı: dıştaki bir temanınki ya da `TestTagPolicy.Stable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `analytics: PantrixAnalytics`: bileşenlerin kullanıcının onlarla yaptığını bildirdiği yer: dıştaki bir temanınki ya da hiçbir yer (`PantrixAnalytics.NoOp`). `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `haptics: PantrixHaptics`: bileşenlerin dokunsal geri bildirimini çalan: dıştaki bir temanınki ya da cihazın kendisi. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `diagnostics: PantrixDiagnostics`: çalışan ekranın denetimlerinin bulgularını gönderdiği yer; okunmayan renkler ve fazla küçük dokunma alanları da bu bulgulardandır: dıştaki bir temanınki ya da kapalı. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `followSystemBars: Boolean`: En dıştaki temanın sistemin çizdiklerini sistemin koyu modu yerine kendi renklerine uydurup uydurmadığı: Android'in çubuklarının simgeleri, iOS'un durum çubuğu, klavyesi ve kontrolleri. Başka bir temanın içindeki tema buna dokunmaz. Bunları kendisi ayarlayan ya da çubukları renkli olan bir uygulama bunu kapatır. Tamamı docs/guide/system-bars/SYSTEM_BARS_GUIDE.md'dedir.
- `content: @Composable () -> Unit`: temanın geçerli olduğu içerik.

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTheme(
    darkTheme: Boolean = inheritedDarkThemeOrSystem(),
    colors: PantrixColors = inheritedColorsOrOwn(darkTheme),
    typography: PantrixTypography = inheritedOr(LocalPantrixTypography) { rememberPantrixTypography() },
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = inheritedOr(LocalPantrixShapes) { rememberPantrixShapes() },
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides =
        inheritedOr(LocalComponentTokenOverrides) { ComponentTokenOverrides.None },
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

Preset'i olmayan tema, Pantrix'in kendi görünüşünde: `darkTheme` ne diyorsa öyle açık ya da koyudur, verilmezse sistem nasılsa öyle.

`PantrixTheme { … }` buraya gelir, preset vermeyen her çağrı da. `DesignPreset` alan biçimde preset'in varsayılanı yoktur, bu yüzden hiçbir çağrı ikisine birden uymaz.

`window` ve `layouts`, `DesignPreset` alan biçimdeki gibidir.

**Başka bir temanın içinde**, kendisine verilmeyen her şeyi o temadan alır: açık bir ekranın koyu bölümü `PantrixTheme(darkTheme = true) { … }`'dir ve içinde renklerden başka hiçbir şey değişmez. Uygulamanın temasına söylediği platform, yoğunluk, dil ve metinleri, stiller, olayların bildirildiği yer ve bulguların gittiği yer içteki temada da dıştakinindir. Ona verilen ise kendisinindir. `darkTheme` aksini söylemedikçe çevresindeki tema kadar koyudur ve öyle olduğu sürece o temanın renklerini korur. Açık bir temanın içinde koyu olması söylenirse o temanın görünüşünün üstüne kurulduğu preset'in koyu renklerini, görünüş bir preset üstüne kurulmamışsa Pantrix'in kendi koyu setini ya da kendisine verilen `colors`'ı alır. Tema zemin çizmez: koyu bölümün zemini, içindeki bir yüzey ya da bir karttır. Tema bir düzen de değildir: içindekileri, temanın içinde durduğu şey yerleştirir, tema orada yokmuş gibi.

Parametreler:

- `darkTheme: Boolean`: `inheritedDarkThemeOrSystem`: Bu çağrının çevresindeki tema koyu mu, çevresinde tema yoksa sistem koyu mu: koyu bir temanın içindeki tema, sistem ne derse desin, aksi söylenmedikçe koyudur.
- `colors: PantrixColors`: `inheritedColorsOrOwn`: Bu çağrının çevresindeki temanın renkleri `darkTheme`'in istediği kadar koyuysa o renkler. Başka bir temanın içindeki tema, açık bir temada koyu ya da koyu bir temada açık olması söylenmedikçe renklerini korur. Bir markanın renkleri de buna dahildir.

  Öyle söylenirse o türden seti, çevresindeki görünüşün üstüne kurulduğu preset'ten alır: bir markanın açık temasındaki koyu bölüm markanın koyu renklerindedir. Görünüş bir preset üstüne kurulmamışsa ya da çağrının çevresinde tema yoksa set Pantrix'in kendi setidir.
- `typography: PantrixTypography`: yazı ölçeği: dıştaki bir temanınki ya da Pantrix'in kendisi. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `density: PantrixDensity`: bileşenlerin boşluğunu ölçekleyen arayüz yoğunluğu: dıştaki bir temanınki ya da `Comfortable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `shapes: PantrixShapes`: köşe yarıçapları: dıştaki bir temanınkiler ya da Pantrix'in kendileri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `motion: PantrixMotion`: süreler ve yumuşatmalar: dıştaki bir temanınkiler ya da Pantrix'in kendileri; sistem daha az hareket isterken her süre sıfırdır. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `spacing: PantrixSpacing`: boşluk ölçeği, yoğunluk onu ölçeklemeden önceki hâliyle: dıştaki bir temaya verilen ya da Pantrix'in kendisi. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `elevation: PantrixElevation`: gölgelerin derinlikleri: dıştaki bir temanınkiler ya da Pantrix'in kendileri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `platform: PantrixPlatform`: bileşenlerin geleneklerini izlediği platform; dokunma alanı, odak halkası ve ön ayarlarıyla: dıştaki bir temaya verilen ya da sistemin bildirdiği gibi uygulamanın çalıştığı platform. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `window: PantrixWindow`: `inheritedPantrixWindow`: Bu çağrının çevresindeki bir temanın ya da bir sağlayıcının verdiği pencere, yoksa null. Başka bir temanın içindeki tema, kendisine pencere verilmediğinde bunu alır: böylece bir testin sabitlediği pencere içteki temada kaybolmaz.
- `layouts: PantrixLayouts`: `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `componentOverrides: ComponentTokenOverrides`: markanın tek tek bileşenlere token ayarları: dıştaki bir temanınkiler ya da hiçbiri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `styles: PantrixStyles`: bileşenlerin, ön ayarlarının üstüne aldığı stil ayarları: dıştaki bir temanınkiler ya da hiçbiri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `locale: PantrixLocale`: bileşenlerin konuştuğu ve yerleştiği dil: dıştaki bir temanınki ya da sistemin dili. Temanın içindeki her şeyin yerleşme yönü yalnızca onun `layoutDirection`'ıdır, temanın çevresinde verilen bir `LocalLayoutDirection`'ın üstünde: sağdan sola bir yerleşim, sağdan sola yazılan bir dille istenir, örneğin `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `strings: PantrixStrings`: bileşenlerin kendi sözleri: `locale`'in dilini konuşuyorsa dıştaki bir temanınkiler, değilse Pantrix'in o dile ait paketi. `inheritedStringsOr`: Bu çağrının çevresindeki temanın dili `locale` ise o temanın metinleri; dili başkaysa ya da çevresinde tema yoksa `locale`'in kendi metinleri. Bir uygulamanın temasına verdiği metinler temanın içinde korunur, başka bir dil verilen tema ise o dilin metinlerini alır.
- `testTagPolicy: TestTagPolicy`: bileşenlerin otomasyon etiketlerini anlam ağacına koyup koymadığı: dıştaki bir temanınki ya da `TestTagPolicy.Stable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `analytics: PantrixAnalytics`: bileşenlerin kullanıcının onlarla yaptığını bildirdiği yer: dıştaki bir temanınki ya da hiçbir yer (`PantrixAnalytics.NoOp`). `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `haptics: PantrixHaptics`: bileşenlerin dokunsal geri bildirimini çalan: dıştaki bir temanınki ya da cihazın kendisi. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `diagnostics: PantrixDiagnostics`: çalışan ekranın denetimlerinin bulgularını gönderdiği yer; okunmayan renkler ve fazla küçük dokunma alanları da bu bulgulardandır: dıştaki bir temanınki ya da kapalı. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `followSystemBars: Boolean`: En dıştaki temanın sistemin çizdiklerini sistemin koyu modu yerine kendi renklerine uydurup uydurmadığı: Android'in çubuklarının simgeleri, iOS'un durum çubuğu, klavyesi ve kontrolleri. Başka bir temanın içindeki tema buna dokunmaz. Bunları kendisi ayarlayan ya da çubukları renkli olan bir uygulama bunu kapatır. Tamamı docs/guide/system-bars/SYSTEM_BARS_GUIDE.md'dedir.
- `content: @Composable () -> Unit`: temanın geçerli olduğu içerik.

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, `com.pantrixui:foundation` içinden

```kotlin
data object PantrixTheme
```

Temanın değerleri, bir composable'ın onları okuduğu yerde: `PantrixTheme.colors.primary` ya da `PantrixTheme.spacing.md`. Her biri, çevredeki en yakın `PantrixTheme { … }` ne sağlıyorsa odur.

Üyeleri:

- `colors: PantrixColors`: Geçerli renk rolleri: `PantrixTheme.colors.primary.color`, `PantrixTheme.colors.surface`.
- `typography: PantrixTypography`: Geçerli yazı ölçeği: `PantrixTheme.typography.body`.
- `density: PantrixDensity`: Bileşenlerin boşluğunu ölçekleyen geçerli arayüz yoğunluğu.
- `shapes: PantrixShapes`: Geçerli köşe yarıçapları: `PantrixTheme.shapes.md`.
- `motion: PantrixMotion`: Geçerli süreler ve yumuşatmalar; sistem daha az hareket isterken her süre sıfırdır.
- `spacing: PantrixSpacing`: Yoğunlukla ölçeklenmiş geçerli boşluk ölçeği: `PantrixTheme.spacing.md`.
- `elevation: PantrixElevation`: Gölgelerin geçerli derinlikleri.
- `platform: PantrixPlatform`: Gelenekleri geçerli olan platform: dokunma alanı, odak halkası ve bileşenlerin ön ayarları.
- `window: PantrixWindow`: İçeriğin çizildiği pencere: genişlik ve yükseklik sınıfı, boyutu ve cihazının nasıl katlandığı. Bir düzen ona göre seçer, `PantrixTheme.window.widthClass >= WindowWidthClass.Expanded`, ve sınıf değişince yeniden kurulur.
- `layout: PantrixLayout`: Geçerli pencerede bir sayfanın yerleştirildiği ölçüler: yanlardaki kenar boşluğu ve sütun arası, pencerenin genişlik sınıfına göre. Bir telefonun kenar boşluğu 16dp, bir masaüstü penceresininki 32dp'dir.

  ```kotlin
  Column(Modifier.padding(horizontal = PantrixTheme.layout.margin)) { … }
  ```

  Okuyan, sınıf değişince yeniden kurulur; pencere sınıfın içinde boyut değiştirirken kurulmaz. Ölçüler temanın `layouts`'ından gelir ve temanın yoğunluğu onları ölçekler.
- `@Composable fun layout(window: PantrixWindow): PantrixLayout`: Geçerli pencerenin değil `window`'un ölçüleri: bir bileşen bunu kendi kutusu için sorar, çünkü kutunun yeri pencereninki değildir.

  ```kotlin
  BoxWithPantrixWindow(modifier) { box ->
      Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout(box).gutter)) { … }
  }
  ```
- `locale: PantrixLocale`: Geçerli dil: bileşenlerin konuştuğu ve yerleştiği dil.
- `strings: PantrixStrings`: Bileşenlerin geçerli kendi sözleri, `locale`'in dilinde.
- `analytics: PantrixAnalytics`: Bileşenlerin kullanıcının onlarla yaptığını bildirdiği yer.
- `haptics: PantrixHaptics`: Bileşenlerin dokunsal geri bildirimini çalan.
- `isUnderModal: Boolean`: Bunun okunduğu içeriğin üstünde modal bir katman gösteriliyor mu: bir dialog, bir sheet ya da uygulamanın bir `PantrixModalLayer` içindeki kendi katmanı. Böyle bir katmanın altında kalan, katman kapanana kadar ne tuş ne tıklama alır ve alıyormuş gibi de görünmemelidir. Odak katmanın altında olduğu yerde kalır, böylece katman kapanınca yine oradadır. O sırada orada odak halkası çizilmez.

  Bir katmanın içeriği o katmanın altında değildir, ondan sonra açılan bir katmanın ise altındadır.
- `componentOverrides: ComponentTokenOverrides`: Markanın geçerli bileşen ayarları. Bu temanın içindeki bir tema, kendisine başkaları verilmedikçe onları korur.
- `styles: PantrixStyles`: Geçerli stil ayarları: temanın `styles`'ı ve çevredeki her `ProvidePantrixStyles`'ın ayarları.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>): S`: `key`'in etkin platformdaki stili, markanın, temanın ve çevredeki her `ProvidePantrixStyles`'ın ayarları uygulanmış hâliyle: `PantrixTheme.style(ButtonStyle).pressedScale`.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>, override: S?): S`: `key`'in stili, `override` öteki her katmanın üstünde olmak üzere. Stilini parametre olarak alan bir bileşen bununla çizer, `PantrixButton(style = ButtonStyle(…))` gibi.

  Verilen stil, çağrının çevresindeki bir `ProvidePantrixStyles` onu nereye koyacaksa oraya konur: markanın, temanın ve çevredeki her birinin ayarlarını ezer. Yoğunluktan önce gelir: burada verilen bir yükseklik de ötekiler gibi ölçeklenir. Her platformda geçerlidir. Yalnızca verdiği alanlar değişir, `null` hiçbir şeyi değiştirmez.

### PantrixDensity

`import com.pantrixui.foundation.token.density.PantrixDensity`, `com.pantrixui:foundation` içinden

```kotlin
enum class PantrixDensity(public val scale: Float)
```

Arayüzün yoğunluğu: uygulama `PantrixTheme`'e başkasını vermedikçe `Comfortable`. `Compact` imleçle kullanıma uygundur, çünkü imleç daha küçük hedeflere isabet edebilir; `Spacious` ise dokunduğunun çevresinde daha çok yer isteyen bir okura.

Parametreler:

- `scale: Float`: Yoğunluğun bir stilin havasını çarptığı sayı: yüksekliklerini, iç boşluklarını, aralıklarını ve kenar boşluklarını. Çizgi kalınlıkları, kenarlar ve ikon boyutları olduğu gibi kalır.

Değerleri:

- `Compact`: Daha az boşluk, 0,85'i: daha küçük hedeflere isabet eden imleçle kullanım için. Bir dokunma alanı platformunkinin altına hiç inmez.
- `Comfortable`: Varsayılan: her stil olduğu gibi.
- `Spacious`: Daha çok boşluk, 1,15'i; dokunma alanları da o kadar büyür.

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

### PantrixAnalytics

`import com.pantrixui.foundation.analytics.PantrixAnalytics`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixAnalytics
```

`PantrixUiEvent`'lerin gittiği yer.

Varsayılanı hiçbir şey yapmaz. Böylece bileşenlerin olaylarını koşulsuz bildirmesinin maliyeti, boş bir gövdeye yapılan tek bir sanal çağrıdır. Ürünler kendi SDK'larını `PantrixTheme(analytics = ...)` ile bağlar. Pantrix'in kendisi hiçbir analitik sağlayıcısına bağımlı değildir.

Bir Pantrix kontrolünün üstüne kurulan bir bileşen, iki metin alanı üstüne kurulan bir tarih alanı gibi, o kontrolün olaylarını kendi olaylarının yanında duyar ve tek bir basış iki kez sayılır. Bileşen kontrole `LocalPantrixAnalytics` ile kendi alıcısını verir: bu alıcı bileşenin kendi bildirdiğini atar, kalanını bileşenin adıyla iletir. `PantrixPageSize`, üstüne kurulduğu select ile böyle yapar.

Üyeleri:

- `fun track(event: PantrixUiEvent)`: Bir bileşenin bildirdiği her `event` ile, bildirildiği anda ve UI thread'inde çağrılır. Olayların gittiği yer olayı iletir ve döner: zaman alan iş, en başta göndermek, bu thread'in dışında yapılır.

Tipin kendisinde:

- `PantrixAnalytics.NoOp: PantrixAnalytics`: Her olayı bırakan alıcı: kendisine bir alıcı verilmeyen bir temanın bildirdiği yer.

### PantrixUiEvent

`import com.pantrixui.foundation.analytics.PantrixUiEvent`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixUiEvent(
    public val component: String,
    public val action: String,
    public val testTag: String?,
    public val screen: String?,
    public val props: Map<String, String> = emptyMap()
)
```

Arayüzdeki bir etkileşim, içeriğiyle değil kimliğiyle tarif edilir: hangi bileşen olduğu, ne olduğu ve hangi ekranda olduğu.

**Kullanıcının yazdığı ya da okuduğu metin buraya asla girmez.** Bir alan odağı aldığını ya da temizlendiğini bildirir, içinde ne olduğunu asla; metin alan her bileşenin bir testi bunu tutar. Kapalı bir kümeden gelen bir değer girer: bir seçim, seçilenin anahtarıyla, bir sayfa numarasıyla bildirilir. `props`'un bir kısmı uygulamanın kendi anahtarlarıdır; anahtarları kişisel veri olan bir uygulama o veriyi onlarla gönderir: onları bildiren bileşenleri `docs/guide/analytics/ANALYTICS_GUIDE.md` sayar.

Parametreler:

- `component: String`: Bileşenin adı, örneğin `Button`.
- `action: String`: Ne olduğu, bileşenin kendi sözcüğüyle: `click`, `toggle`, `select`, `open`, `dismiss`, `focus`, `expand` ve rehberin bileşen bileşen saydığı ötekiler.
- `testTag: String?`: Bileşenin otomasyon etiketi, yani testlerin bağlandığı kimliğin aynısı, `TestTagPolicy` ne olursa olsun: `tagKey`'inden, yoksa çağrıldığı yerden kurulur; o yer de çevresindeki kodla değişir. Bir uygulamanın etiketsiz bildirdiği bir olayda null.
- `screen: String?`: Çevresindeki `TestScope` zinciri, örneğin `Checkout.PaymentForm`. Bir `TestScope`'un dışındaysa null.
- `props: Map<String, String>`: Olayın değerleri, üç türde: Pantrix'in kendi sözcükleri ve evet ya da hayır değerleri, `variant`, `via` ve `state` gibi; sayılar, `index`, `page` ve `count` gibi; uygulamanın bileşene verdiği anahtarlar, `row`, `option` ve `destination` gibi.

### DesignPreset

`import com.pantrixui.foundation.theme.preset.DesignPreset`, `com.pantrixui:foundation` içinden

```kotlin
interface DesignPreset
```

Bir markanın görünüşü, tek yerde: renkleri, tipografisi, şekilleri ve bileşen ayarları. `PantrixTheme(preset = …)` ondan bir tema kurar.

Üyeleri:

- `name: String`: Preset'in adı, bir seçicinin ya da bir log'un gösterdiği hâliyle.
- `fun colors(dark: Boolean = false): PantrixColors`: Renkler: `dark` ise koyu set.
- `@Composable fun typography(): PantrixTypography`: Yazı ölçeği, markanın yazı tipleriyle.
- `@Composable fun shapes(): PantrixShapes`: Şekil ölçeği.
- `fun componentOverrides(): ComponentTokenOverrides`: Her bileşenin token ayarları. Markanın ayarı yoksa hiçbiri.

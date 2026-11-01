# Yoğunluk

Arayüzün yoğunluğu: bir ekranın ne kadar havası olduğu. Yoğunluk bileşenlerin yüksekliklerini, iç boşluklarını ve aralıklarını, temanın boşluk ölçeğini ve sayfa kenarlarını birlikte çarpar; çizgiler, kenarlar, ikonlar ve gölgeler olduğu gibi kalır.

## Özellikler

- **Üç yoğunluk.** `Compact` 0,85, `Comfortable` 1, `Spacious` 1,15 kat (`scale`). Varsayılanı `Comfortable`'dır (`rememberPantrixDensity()`); bir fareyle kullanılan ekran sıkı yoğunluğu kaldırır.
- **Bir temanın tamamı.** `PantrixTheme(density = …)` yoğunluğu içindeki her şeye verir: bir ayarlar ekranı ya da bir veri tablosu sıkı, bir karşılama ekranı geniş olabilir. `PantrixTheme.density` en yakın temanınkidir.
- **Dokunma alanı.** Geniş yoğunluk dokunma alanını büyütür, sıkı yoğunluk onu küçültmez.
- **Kendi ölçün.** Uygulamanın kendi ölçüsü de yoğunlukla çarpılabilir: `scaledForDensity(scale)`.

## Örnekler

### Üç yoğunluk

Aynı form üç yoğunlukta. Bir yoğunluk seç: içteki tema onu metin alanına, onay kutusuna, düğmelere ve aralarındaki boşluğa birlikte verir. Yazılar ve ikonlar aynı boyda kalır; değişen, aralarındaki havadır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity
import kotlin.math.roundToInt

var density by remember { mutableStateOf(PantrixDensity.Compact) }
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixSegmentButton(
        options = DENSITIES,
        selected = density,
        onSelect = { density = it },
        tagKey = "density"
    )
    PantrixTheme(density = density) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
            PantrixText(
                text = "${PantrixTheme.density.name}: ölçülerin %${(PantrixTheme.density.scale * 100).roundToInt()}'i",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixTextField(
                state = rememberTextFieldState(),
                modifier = Modifier.fillMaxWidth(),
                label = "E-posta",
                tagKey = "density_email"
            )
            PantrixCheckbox(checked = true, onCheckedChange = {}, label = "Beni hatırla", tagKey = "density_remember")
            Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                PantrixButton(text = "Giriş yap", onClick = {}, tagKey = "density_sign_in")
                PantrixButton(
                    text = "Vazgeç",
                    onClick = {},
                    variant = ButtonVariant.Outline,
                    tagKey = "density_cancel"
                )
            }
        }
    }
}

private val DENSITIES = listOf(
    SegmentOption(PantrixDensity.Compact, "Sıkı", tagKey = "compact"),
    SegmentOption(PantrixDensity.Comfortable, "Rahat", tagKey = "comfortable"),
    SegmentOption(PantrixDensity.Spacious, "Geniş", tagKey = "spacious")
)
```

### Kendi ölçün de

Uygulamanın kendi satırı da yoğunluğa uyar: yüksekliği 56dp'dir ve `scaledForDensity(PantrixTheme.density.scale)` onu en yakın temanın yoğunluğuyla çarpar. Ortadaki tema kütüphanenin varsayılanındadır (`rememberPantrixDensity()`); soldaki sıkı, sağdaki geniş.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.density.PantrixDensity
import com.pantrixui.foundation.token.density.rememberPantrixDensity
import com.pantrixui.foundation.token.style.scaledForDensity

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTheme(density = PantrixDensity.Compact) { OwnRow() }
    PantrixTheme(density = rememberPantrixDensity()) { OwnRow() }
    PantrixTheme(density = PantrixDensity.Spacious) { OwnRow() }
}

@Composable
private fun OwnRow() {
    val height = 56.dp.scaledForDensity(PantrixTheme.density.scale)
    Box(
        modifier = Modifier
            .width(120.dp)
            .height(height)
            .background(PantrixTheme.colors.primary.container, PantrixTheme.shapes.md)
            .padding(horizontal = PantrixTheme.spacing.sm),
        contentAlignment = Alignment.CenterStart
    ) {
        PantrixText(
            text = "${PantrixTheme.density.name}\n${height.value.toInt()}dp",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.primary.onContainer
        )
    }
}
```

## API

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

### rememberPantrixDensity

`import com.pantrixui.foundation.token.density.rememberPantrixDensity`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixDensity(): PantrixDensity
```

Varsayılan yoğunluk, `PantrixDensity.Comfortable`.

### Dp.scaledForDensity

`import com.pantrixui.foundation.token.style.scaledForDensity`, `com.pantrixui:foundation` içinden

```kotlin
fun Dp.scaledForDensity(scale: Float): Dp
```

Arayüz yoğunluğuyla ölçeklenmiş bir ölçü.

`Dp.Unspecified` NaN'dır ve NaN çarpı herhangi bir şey NaN'dır; yani bu, denetim olmadan da çalışırdı. Denetim burada, çünkü "verilmemiş verilmemiş kalır" kısmi bir stili kısmi tutan kuraldır ve yalnızca rastlantıyla tutan bir kural, tutmamayı bekleyen bir kuraldır.

Parametreler:

- `scale: Float`: arayüz yoğunluğunun ölçeği, `PantrixDensity.scale`.

### LocalPantrixDensity

`import com.pantrixui.foundation.token.density.LocalPantrixDensity`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixDensity: ProvidableCompositionLocal<PantrixDensity>
```

Geçerli arayüz yoğunluğu; `PantrixTheme` sağlar ve `PantrixTheme.density` bunu okur. Bir temanın dışında `PantrixDensity.Comfortable`.

# Boşluklar

Boşluk ölçeği: bir ekranın aralıkları ve iç boşlukları bu yedi adımdan kurulur. Bileşenlerin kendi boşlukları stillerindedir; ölçek ekranın kendi düzeni içindir: bir kartın iç boşluğu, iki satırın arası, bir sütunun kenarı.

## Özellikler

- **Adımlar.** `none` 0, `xs` 4, `sm` 8, `md` 12, `lg` 16, `xl` 24, `xxl` 32dp. `PantrixTheme.spacing` en yakın temanın ölçeğidir.
- **Yoğunluk.** Tema ölçeği yoğunlukla çarpar (`scaled`): sıkı yoğunlukta her adım 0,85 katı, geniş yoğunlukta 1,15 katıdır; `none` sıfır kalır.
- **Kendi ölçeğin.** `PantrixTheme(spacing = PantrixSpacing(…))` adımların bir kısmını ya da hepsini değiştirir; verilmeyen adım varsayılanındadır. `rememberPantrixSpacing()` kütüphanenin kendi ölçeğidir.

## Örnekler

### Yedi adım

Ölçeğin yedi adımı, temanın verdiği gibi: her çubuk bir adımın genişliğindedir. Adımları bir yoğunluk ölçekler; "Yoğunluk" sayfasında sıkı ya da geniş bir temanın içinde aynı çubuklar kısalır ya da uzar.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.spacing.PantrixSpacing
import kotlin.math.roundToInt

val spacing = PantrixTheme.spacing
Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
    spacingSteps(spacing).forEach { (name, step) ->
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(spacing.md)
        ) {
            PantrixText(
                text = "$name · ${step.written()}",
                modifier = Modifier.width(88.dp),
                style = PantrixTheme.typography.footnote
            )
            Box(
                Modifier
                    .size(width = step, height = 12.dp)
                    .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.xs)
            )
        }
    }
}

private fun spacingSteps(spacing: PantrixSpacing): List<Pair<String, Dp>> = listOf(
    "none" to spacing.none,
    "xs" to spacing.xs,
    "sm" to spacing.sm,
    "md" to spacing.md,
    "lg" to spacing.lg,
    "xl" to spacing.xl,
    "xxl" to spacing.xxl
)

private fun Dp.written(): String {
    val tenths = (value * 10).roundToInt()
    return if (tenths % 10 == 0) "${tenths / 10}dp" else "${tenths / 10}.${tenths % 10}dp"
}
```

### Kendi ölçeğin

Aynı kart iki ölçekle. Kartın kendisi yalnızca ölçeğin adımlarını adıyla okur: iç boşluğu `lg`, satır arası `sm`, düğmesinin önü `md`. Soldaki kütüphanenin kendi ölçeğindedir (`rememberPantrixSpacing()`); sağdaki tema iki adımı değiştirir, `PantrixSpacing(sm = 12.dp, lg = 24.dp)`, ve kart başka bir şey yapmadan ferahlar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.spacing.PantrixSpacing
import com.pantrixui.foundation.token.spacing.rememberPantrixSpacing
import kotlin.math.roundToInt

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixTheme(spacing = rememberPantrixSpacing()) {
        SpacedCard(title = "Kütüphanenin ölçeği", tagKey = "library_scale")
    }
    PantrixTheme(spacing = PantrixSpacing(sm = 12.dp, lg = 24.dp)) {
        SpacedCard(title = "Kendi ölçeğin", tagKey = "own_scale")
    }
}

@Composable
private fun SpacedCard(
    title: String,
    tagKey: String
) {
    val spacing = PantrixTheme.spacing
    PantrixSurface(modifier = Modifier.width(220.dp), border = PantrixTheme.colors.divider) {
        Column(
            modifier = Modifier.padding(spacing.lg),
            verticalArrangement = Arrangement.spacedBy(spacing.sm)
        ) {
            PantrixText(text = title, style = PantrixTheme.typography.title)
            PantrixText(
                text = "İç boşluk ${spacing.lg.written()}, satır arası ${spacing.sm.written()}",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixButton(
                text = "Aç",
                onClick = {},
                modifier = Modifier.padding(top = spacing.md),
                size = ButtonSize.Small,
                tagKey = tagKey
            )
        }
    }
}

private fun Dp.written(): String {
    val tenths = (value * 10).roundToInt()
    return if (tenths % 10 == 0) "${tenths / 10}dp" else "${tenths / 10}.${tenths % 10}dp"
}
```

## API

### PantrixSpacing

`import com.pantrixui.foundation.token.spacing.PantrixSpacing`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixSpacing(
    val none: Dp = 0.dp,
    val xs: Dp = 4.dp,
    val sm: Dp = 8.dp,
    val md: Dp = 12.dp,
    val lg: Dp = 16.dp,
    val xl: Dp = 24.dp,
    val xxl: Dp = 32.dp
)
```

Boşluk ölçeği: düzenlerin kurulduğu aralıklar ve iç boşluklar. `scaled` arayüz yoğunluğunu `none` dışındaki her adıma uygular.

Parametreler:

- `none: Dp`: Boşluk yok.
- `xs: Dp`: Varsayılanı 4dp.
- `sm: Dp`: Varsayılanı 8dp: bir düğmenin ikonuyla etiketi arasındaki boşluk.
- `md: Dp`: Varsayılanı 12dp.
- `lg: Dp`: Varsayılanı 16dp.
- `xl: Dp`: Varsayılanı 24dp.
- `xxl: Dp`: Varsayılanı 32dp, en geniş adım.

Üyeleri:

- `fun scaled(factor: Float): PantrixSpacing`: Yoğunluk burada uygulanır, her çağrıda değil; böylece tek bir ayar bütün sistemi yeniden ölçekler.

  `factor`: arayüz yoğunluğunun ölçeği: her basamak onunla çarpılır.

### rememberPantrixSpacing

`import com.pantrixui.foundation.token.spacing.rememberPantrixSpacing`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixSpacing(): PantrixSpacing
```

Pantrix'in boşluk ölçeği.

### LocalPantrixSpacing

`import com.pantrixui.foundation.token.spacing.LocalPantrixSpacing`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixSpacing: ProvidableCompositionLocal<PantrixSpacing>
```

Geçerli boşluk ölçeği; `PantrixTheme` sağlar ve `PantrixTheme.spacing` bunu okur. Bir temanın dışında Pantrix'in kendisi.

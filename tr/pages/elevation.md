# Yükselti

Yükselti ölçeği: bir yüzeyin altındakinden ne kadar ayrıldığı, gölgesiyle. Bir kart, bir menü, bir dialog bu ölçeğin bir adımında durur; uygulamanın kendi yüzeyi de adımını buradan alır.

## Özellikler

- **Adımlar.** `none` 0, `sm` 1, `md` 2, `lg` 4, `xl` 8dp. `PantrixTheme.elevation` en yakın temanın ölçeğidir.
- **Kendi ölçeğin.** `PantrixTheme(elevation = PantrixElevation(…))` adımları değiştirir; verilmeyen adım varsayılanındadır. `rememberPantrixElevation()` kütüphanenin kendi ölçeğidir.
- **Yoğunluk.** Yoğunluk gölgeleri ölçeklemez: sıkı bir ekran daha az havası olan bir ekrandır, gölgesi daha sığ olan değil.

## Örnekler

### Beş adım

Ölçeğin beş adımı: her kare bir adımın yükseltisinde bir `PantrixSurface`'tir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val elevation = PantrixTheme.elevation
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    ElevationSwatch("none", elevation.none)
    ElevationSwatch("sm", elevation.sm)
    ElevationSwatch("md", elevation.md)
    ElevationSwatch("lg", elevation.lg)
    ElevationSwatch("xl", elevation.xl)
}

@Composable
private fun ElevationSwatch(
    name: String,
    elevation: Dp
) {
    PantrixSurface(modifier = Modifier.size(88.dp), elevation = elevation) {
        PantrixText(
            text = "$name\n${elevation.value.toInt()}dp",
            modifier = Modifier.align(Alignment.Center),
            style = PantrixTheme.typography.footnote
        )
    }
}
```

### Kendi ölçeğin

Aynı iki yüzey iki ölçekle. Yüzeyler yükseltilerini adıyla okur, `md` ve `xl`. Soldakiler kütüphanenin kendi ölçeğindedir (`rememberPantrixElevation()`); sağdaki tema adımları iki katına çıkarır ve yüzeyler daha belirgin ayrılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.elevation.PantrixElevation
import com.pantrixui.foundation.token.elevation.rememberPantrixElevation

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixTheme(elevation = rememberPantrixElevation()) {
        ElevationSwatch("md", PantrixTheme.elevation.md)
        ElevationSwatch("xl", PantrixTheme.elevation.xl)
    }
    PantrixTheme(elevation = PantrixElevation(sm = 2.dp, md = 4.dp, lg = 8.dp, xl = 16.dp)) {
        ElevationSwatch("md", PantrixTheme.elevation.md)
        ElevationSwatch("xl", PantrixTheme.elevation.xl)
    }
}

@Composable
private fun ElevationSwatch(
    name: String,
    elevation: Dp
) {
    PantrixSurface(modifier = Modifier.size(88.dp), elevation = elevation) {
        PantrixText(
            text = "$name\n${elevation.value.toInt()}dp",
            modifier = Modifier.align(Alignment.Center),
            style = PantrixTheme.typography.footnote
        )
    }
}
```

## API

### PantrixElevation

`import com.pantrixui.foundation.token.elevation.PantrixElevation`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixElevation(
    val none: Dp = 0.dp,
    val sm: Dp = 1.dp,
    val md: Dp = 2.dp,
    val lg: Dp = 4.dp,
    val xl: Dp = 8.dp
)
```

Yükselti ölçeği: bir yüzeyin altındakinden ne kadar ayrıldığı.

Parametreler:

- `none: Dp`: Altındakinin üstünde düz.
- `sm: Dp`: Varsayılanı 1dp.
- `md: Dp`: Varsayılanı 2dp.
- `lg: Dp`: Varsayılanı 4dp.
- `xl: Dp`: Varsayılanı 8dp, en yüksek adım.

### rememberPantrixElevation

`import com.pantrixui.foundation.token.elevation.rememberPantrixElevation`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixElevation(): PantrixElevation
```

Pantrix'in yükselti ölçeği.

### LocalPantrixElevation

`import com.pantrixui.foundation.token.elevation.LocalPantrixElevation`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixElevation: ProvidableCompositionLocal<PantrixElevation>
```

Gölgelerin geçerli derinlikleri; `PantrixTheme` sağlar ve `PantrixTheme.elevation` bunları okur. Bir temanın dışında Pantrix'in kendileri.

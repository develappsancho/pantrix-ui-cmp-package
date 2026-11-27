# Şekiller

Şekil ölçeği: köşelerin ne kadar yuvarlak olduğu, kareden tam yuvarlağa. Bir bileşenin stili bir şekil değil, ölçeğin bir adımını söyler (`ShapeRole`); adımın ne kadar yuvarlak olduğunu marka verir.

## Özellikler

- **Adımlar.** `xs` 2, `sm` 4, `md` 8, `lg` 12, `xl` 16dp; iki uç, `none` (kare) ve `full` (tam yuvarlak), her markada aynıdır. `PantrixTheme.shapes` en yakın temanın ölçeğidir.
- **Hazır ölçekler.** `PantrixShapes.Sharp` her adımı kareler, `PantrixShapes.Pill` her adımı tam yuvarlak yapar. `rememberPantrixShapes()` kütüphanenin kendi ölçeğidir.
- **Rol ve şekil.** `ShapeRole` ölçeğin bir adımıdır; `ShapeSpec.Fixed` ölçeğe uymayan tek bir şekildir. İkisi de bir `ShapeSpec`'tir ve `toShape()` onu en yakın temanın ölçeğinde bir `Shape`'e çevirir.

## Örnekler

### Ölçek

Ölçeğin yedi şekli, temanın verdiği gibi: iki ucun arasında markanın beş adımı.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val shapes = PantrixTheme.shapes
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    ShapeSwatch("none", shapes.none)
    ShapeSwatch("xs", shapes.xs)
    ShapeSwatch("sm", shapes.sm)
    ShapeSwatch("md", shapes.md)
    ShapeSwatch("lg", shapes.lg)
    ShapeSwatch("xl", shapes.xl)
    ShapeSwatch("full", shapes.full)
}

@Composable
private fun ShapeSwatch(
    name: String,
    shape: Shape
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
    ) {
        Box(Modifier.size(56.dp).background(PantrixTheme.colors.primary.container, shape))
        PantrixText(text = name, style = PantrixTheme.typography.footnote)
    }
}
```

### Keskin ve hap

Aynı üç bileşen üç ölçekle: kütüphanenin kendisi (`rememberPantrixShapes()`), `PantrixShapes.Sharp` ve `PantrixShapes.Pill`. Bileşenler bir şekil almadı: her biri stilinin söylediği adımı temanın ölçeğinden okur. Kart, metin alanı ve etiket bu yüzden markayla birlikte köşelerini değiştirir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.PantrixShapes
import com.pantrixui.foundation.token.shape.rememberPantrixShapes

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixTheme(shapes = rememberPantrixShapes()) { ShapedParts("Varsayılan", "default") }
    PantrixTheme(shapes = PantrixShapes.Sharp) { ShapedParts("Sharp", "sharp") }
    PantrixTheme(shapes = PantrixShapes.Pill) { ShapedParts("Pill", "pill") }
}

@Composable
private fun ShapedParts(
    title: String,
    tagKey: String
) {
    PantrixCard(modifier = Modifier.width(200.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixText(text = title, style = PantrixTheme.typography.title)
            PantrixTextField(
                state = rememberTextFieldState(),
                modifier = Modifier.fillMaxWidth(),
                placeholder = "Ara",
                contentDescription = "Ara",
                tagKey = tagKey
            )
            PantrixTag(text = "Yeni", tagKey = tagKey)
        }
    }
}
```

### Bir rolün ve sabit bir şeklin

Uygulamanın kendi kutusu da ölçekten şekil alır. Bir `ShapeRole` adımın adıdır: `ShapeRole.Large.toShape()` en yakın temanın `lg`'sidir ve marka değişince o da değişir. Ölçeğe uymayan bir şekil `ShapeSpec.Fixed` ile verilir: burada köşeleri kesik bir bilet, her markada aynı. İkisi de bir `ShapeSpec`'tir: bir bileşenin stiline de böyle verilir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CutCornerShape
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.shape.ShapeSpec
import com.pantrixui.foundation.token.style.toShape

val roles: List<Pair<String, ShapeSpec>> = listOf("ShapeRole.Large" to ShapeRole.Large, "ShapeSpec.Fixed" to TICKET)
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    roles.forEach { (name, spec) ->
        Box(
            modifier = Modifier
                .size(width = 160.dp, height = 72.dp)
                .background(PantrixTheme.colors.info.container, spec.toShape()),
            contentAlignment = Alignment.Center
        ) {
            PantrixText(text = name, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.info.onContainer)
        }
    }
}

private val TICKET: ShapeSpec = ShapeSpec.Fixed(CutCornerShape(12.dp))
```

## API

### PantrixShapes

`import com.pantrixui.foundation.token.shape.PantrixShapes`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixShapes(
    val xs: Shape = RoundedCornerShape(2.dp),
    val sm: Shape = RoundedCornerShape(4.dp),
    val md: Shape = RoundedCornerShape(8.dp),
    val lg: Shape = RoundedCornerShape(12.dp),
    val xl: Shape = RoundedCornerShape(16.dp)
)
```

Markanın köşe yarıçapları, kareden tam yuvarlağa. Bir bileşen stili bir adımı bir `ShapeRole` ile adlandırır; o adımın ne kadar yuvarlak olduğuna marka karar verir: `Sharp` her adımı kareler, `Pill` her adımı tam yuvarlak yapar.

Ölçeğin iki ucu, `none` ve `full`, her markada aynıdır. Parametre değildirler; onları ne bir marka ne de `copy` oynatabilir.

Parametreler:

- `xs: Shape`: En küçük yuvarlaklık, varsayılanı 2dp: `ShapeRole.ExtraSmall`.
- `sm: Shape`: Varsayılanı 4dp: `ShapeRole.Small`.
- `md: Shape`: Varsayılanı 8dp: `ShapeRole.Medium`, iOS'ta bir düğmenin şekli.
- `lg: Shape`: Varsayılanı 12dp: `ShapeRole.Large`.
- `xl: Shape`: Varsayılanı 16dp.

Üyeleri:

- `none: Shape`: Kare köşeler, her markada.
- `full: Shape`: Tam yuvarlak uçlar, her markada: `ShapeRole.Full`, Android'de, masaüstünde ve web'de bir düğmenin şekli.

Tipin kendisinde:

- `PantrixShapes.Sharp: PantrixShapes`: Her adım karelenmiş. `full` her markada olduğu gibi yuvarlak kalır.
- `PantrixShapes.Pill: PantrixShapes`: Her adım tam yuvarlak: hap biçimli düğmeler, yuvarlak avatarlar.

### ShapeRole

`import com.pantrixui.foundation.token.shape.ShapeRole`, `com.pantrixui:foundation` içinden

```kotlin
enum class ShapeRole : ShapeSpec
```

`PantrixShapes`'in, markanın şekil ölçeğinin bir adımı.

Bir bileşenin hazır ayarı somut bir `Shape` değil, adımı saklar; böylece tek bir hazır ayar her markaya yeter: Pantrix'in `lg`'si kendisinin, nötr markanınki de onunkidir.

Değerleri:

- `ExtraSmall`: Markanın en küçük yuvarlaklığı, `xs`: Pantrix'in kendi ölçeğinde 2dp.
- `Small`: Markanın `sm`'i: Pantrix'in kendi ölçeğinde 4dp.
- `Medium`: Markanın `md`'si: Pantrix'in kendi ölçeğinde 8dp.
- `Large`: Markanın `lg`'si: Pantrix'in kendi ölçeğinde 12dp.
- `Full`: Tam yuvarlak uçlar, `full`: her markada aynı.

### ShapeSpec

`import com.pantrixui.foundation.token.shape.ShapeSpec`, `com.pantrixui:foundation` içinden

```kotlin
sealed interface ShapeSpec
```

Bir bileşen stilinin istediği şekil: markanın şekil ölçeğinin bir adımı ya da sabit bir şekil.

Platform hazır ayarları bir `ShapeRole` kullanır: bir hazır ayar her markaya hizmet eder ve her adımın ne kadar yuvarlak olduğuna marka karar verir. Ölçeğin dışında bir şekil isteyen bir uygulama, yalnızca iOS düğmelerinde 10dp'lik bir köşe gibi, `Fixed` verir.

Üyeleri:

- `fun resolve(shapes: PantrixShapes): Shape`: Etkin markanın ölçeği `shapes` üstündeki somut şekil.

#### ShapeSpec.Fixed

```kotlin
class Fixed(public val shape: Shape) : ShapeSpec
```

Markanın ölçeğine uymayan bir şekil.

Parametreler:

- `shape: Shape`: Şekil, her markada aynı.

#### ShapeSpec.Unspecified

```kotlin
data object Unspecified : ShapeSpec
```

Şekil yok. Ezme olarak kullanılan bir stilde alanı alttaki stile bırakır. Hazır ayarlar onu hiç kullanmaz; tek başına çözülünce kare köşeler verir.

### ShapeSpec.toShape

`import com.pantrixui.foundation.token.style.toShape`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ShapeSpec.toShape(): Shape
```

Bu şekil, etkin markanın ölçeğinde.

### rememberPantrixShapes

`import com.pantrixui.foundation.token.shape.rememberPantrixShapes`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixShapes(): PantrixShapes
```

Pantrix'in kendi şekil ölçeği: varsayılanlarıyla `PantrixShapes`.

### LocalPantrixShapes

`import com.pantrixui.foundation.token.shape.LocalPantrixShapes`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixShapes: ProvidableCompositionLocal<PantrixShapes>
```

Geçerli köşe yarıçapları; `PantrixTheme` sağlar ve `PantrixTheme.shapes` bunları okur. Bir temanın dışında Pantrix'in kendileri.

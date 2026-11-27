# Surface

Bir rengi bir şeklin içine boyayan ve içeriğini o şekle kırpan en yalın kapsayıcı; istenirse 1dp'lik bir kenarı ve bir gölgesi olur. Bir panel, renkli bir bant, bir slaydın zemini.

Asıl işi içerik rengidir. Kütüphanenin kuralı şudur: bir dolgu, üstüne ne renkle yazıldığını söyler; temanın kendi zeminleri söylemez. Bir rolün dolgusuyla boyanan yüzeyin içindeki `PantrixText` ve `PantrixIcon`, o dolguda okunan rengi kendilerine söylenmeden alır.

- `PantrixSurface` (`com.pantrixui.components.container.surface`, `com.pantrixui:components`): İçindeki her şeye üstünde okunan içerik rengini veren, temalı bir zemin. Anahtar sözcükler: yüzey, zemin, arka plan, kap, temalı arka plan.

## Özellikler

- **Dolgu.** `color` yüzeyin rengidir; verilmezse temanın `surface`'ıdır.
- **Bir rolün dolgusunda.** Rolün `color`'ı üstünde içindekiler `onColor` ile, `container`'ı üstünde `onContainer` ile çizilir.
- **Zeminlerde.** Temanın `surface`'ı ve `background`'u üstünde yüzey içerik rengi vermez: her bileşen kendi varsayılanıyla çizilir, yazı `textPrimary`, ikon `onSurface` ile.
- **Temanın bilmediği renkte.** Hiçbir rolde olmayan bir dolguda da yüzey renk vermez; üstünde okunan renk `contentColor` ile verilir.
- **Dolgunun içindeki zemin.** Bir dolgunun üstünde duran zemin renkli yüzey yeniden bir zemindir: dolgunun içindekilere verdiği renk orada biter.
- **Şekil.** `shape` köşeleri belirler, varsayılanı temanın `md` şeklidir. İçerik o şekle kırpılır.
- **Kenar.** `border` bir renk aldığında yüzeyin çevresine 1dp'lik bir çizgi çizilir.
- **Gölge.** `elevation` yüzeyin altına bir gölge koyar; varsayılanı sıfırdır.
- **İçerik bir kutudadır.** `content` bir `BoxScope`'tur: çocuklar üst üste durur ve `Modifier.align` ile yerleşir. Yüzeyin kendi iç boşluğu yoktur.

## Kullanım

### Tinted container

```kotlin
PantrixSurface(color = PantrixTheme.colors.primary.container) {
    PantrixText(
        text = stringResource(Res.string.trial_ends_soon),
        modifier = Modifier.padding(PantrixTheme.spacing.lg)
    )
}
```

### Outlined panel

```kotlin
PantrixSurface(border = PantrixTheme.colors.divider, shape = PantrixTheme.shapes.lg) {
    PanelContent()
}
```

## Örnekler

### En yalın hâli

En az yazılan hâli: içeriğiyle bir `PantrixSurface`. Rengi temanın `surface`'ı, şekli temanın `md` şeklidir; kenarı ve gölgesi yoktur. Yüzey içeriği kadar yer kaplar ve kendi iç boşluğu yoktur: boşluğu içindeki yazı verir.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface {
    PantrixText(text = "Varsayılan yüzey", modifier = Modifier.padding(PantrixTheme.spacing.lg))
}
```

### Bir rolün dolgusunda

`color` bir rolün dolgusu olduğunda yüzey, içindekilere o dolguyla eşleşen rengi verir: rolün `color`'ı üstünde `onColor`, `container`'ı üstünde `onContainer`. Satırlardaki ikona ve yazıya renk verilmedi; ikisi de yüzeyin verdiğini alır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val primary = PantrixTheme.colors.primary
val success = PantrixTheme.colors.success
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = primary.color) {
    SurfaceLine(text = "primary.color: içindekiler onColor ile çizilir")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = primary.container) {
    SurfaceLine(text = "primary.container: içindekiler onContainer ile çizilir")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = success.container) {
    SurfaceLine(text = "success.container: kural her rolde aynıdır")
}

@Composable
private fun SurfaceLine(text: String) {
    Row(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
        PantrixText(text = text)
    }
}
```

### Zeminlerde ve temanın bilmediği renkte

Temanın kendi zeminlerinde, `surface` ve `background`, yüzey içerik rengi vermez: her bileşen kendi varsayılanıyla çizilir, yazı `textPrimary`, ikon `onSurface` ile.

Hiçbir rolde olmayan bir dolguda da öyledir: tema o rengin üstünde ne okunduğunu bilemez. Üçüncü yüzey uygulamanın kendi moruyla boyandı ve içindekiler yine varsayılanlarıyla çizildi. Dördüncüsüne `contentColor` verildi: üstünde okunan rengi böyle bir dolguda çağıran söyler.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val own = ownColors()
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.surface, border = colors.divider) {
    SurfaceLine(text = "surface: içerik rengi yok")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.background, border = colors.divider) {
    SurfaceLine(text = "background: içerik rengi yok")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = own.color) {
    SurfaceLine(text = "Temanın bilmediği renk: içerik rengi yok")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = own.color, contentColor = own.onColor) {
    SurfaceLine(text = "Aynı renk: contentColor verildi")
}

@Composable
private fun SurfaceLine(text: String) {
    Row(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
        PantrixText(text = text)
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Dolgunun içinde bir zemin

Bir dolgunun üstündeki zemin renkli yüzey yeniden bir zemindir. Dıştaki yüzey içindekilere `onColor` verir; içteki yüzey temanın `surface`'ıdır ve o rengi içeri taşımaz: içindeki yazı yeniden `textPrimary`, ikon `onSurface` ile çizilir. Dolgunun verdiği renk o zeminde okunmazdı.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.color) {
    Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
        SurfaceLine(text = "Dolgunun üstünde")
        PantrixSurface(modifier = Modifier.fillMaxWidth()) {
            SurfaceLine(text = "İçteki yüzeyde: yeniden zemin")
        }
    }
}

@Composable
private fun SurfaceLine(text: String) {
    Row(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
        PantrixText(text = text)
    }
}
```

### İçerik rengini okumak

İçerik rengi `LocalPantrixContentColor` ile taşınır; kendi çizdiğin bir şey de onu okuyabilir. Buradaki nokta bir `Box`'tır ve rengini oradan alır. Zeminlerde değer `Color.Unspecified`'dır: nokta orada kendi varsayılanını seçer.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.takeOrElse
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor

val danger = PantrixTheme.colors.danger
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixSurface(color = danger.color) { SurfaceDot() }
    PantrixSurface(color = danger.container) { SurfaceDot() }
    PantrixSurface(border = PantrixTheme.colors.divider) { SurfaceDot() }
}

@Composable
private fun SurfaceDot() {
    val color = LocalPantrixContentColor.current.takeOrElse { PantrixTheme.colors.onSurface }
    Box(modifier = Modifier.padding(PantrixTheme.spacing.lg).size(16.dp).background(color, CircleShape))
}
```

### Şekil ve kırpma

`shape` yüzeyin köşeleridir: temanın şekillerinden biri ya da herhangi bir `Shape`. Kare yüzeyler temanın şekillerinden beşini gösterir; varsayılan `md`'dir.

İçerik yüzeyin şekline kırpılır. En alttaki yüzeyin içindeki bant kenardan kenara bir dikdörtgendir; köşelerini yüzeyin `xl` şekli kesti.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val shapes = PantrixTheme.shapes
val info = PantrixTheme.colors.info
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    listOf("none" to shapes.none, "sm" to shapes.sm, "md" to shapes.md, "xl" to shapes.xl, "full" to shapes.full)
        .forEach { (name, shape) ->
            PantrixSurface(modifier = Modifier.size(72.dp), color = info.container, shape = shape) {
                PantrixText(text = name, modifier = Modifier.align(Alignment.Center))
            }
        }
}
PantrixSurface(
    modifier = Modifier.widthIn(max = 360.dp),
    shape = shapes.xl,
    border = PantrixTheme.colors.divider
) {
    Column {
        Box(modifier = Modifier.fillMaxWidth().height(64.dp).background(info.color))
        PantrixText(
            text = "Bandın köşelerini yüzeyin şekli kesti",
            modifier = Modifier.padding(PantrixTheme.spacing.lg)
        )
    }
}
```

### Kenar

`border` bir renk aldığında yüzeyin çevresine, şeklini izleyen 1dp'lik bir çizgi çizilir; verilmezse kenar yoktur. Bir panelin kenarı çoğunlukla temanın `divider` rengidir. Kalınlık değişmez: yalnızca rengi verilir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixSurface(modifier = Modifier.fillMaxWidth(), shape = PantrixTheme.shapes.lg, border = colors.divider) {
    PantrixText(text = "divider renginde kenar", modifier = Modifier.padding(PantrixTheme.spacing.lg))
}
PantrixSurface(
    modifier = Modifier.fillMaxWidth(),
    color = colors.primary.container,
    shape = PantrixTheme.shapes.lg,
    border = colors.primary.color
) {
    PantrixText(text = "Dolgu ve rolün renginde kenar", modifier = Modifier.padding(PantrixTheme.spacing.lg))
}
```

### Gölge

`elevation` yüzeyin altına, şeklini izleyen bir gölge koyar. Burada temanın yükseklik ölçeğinin beş basamağı var: `PantrixTheme.elevation`, 0dp'den 8dp'ye. Gölge yüzeyin sınırlarının dışına çizilir: çevresinde ona yer gerekir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val elevation = PantrixTheme.elevation
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)
) {
    listOf(
        "none" to elevation.none,
        "sm" to elevation.sm,
        "md" to elevation.md,
        "lg" to elevation.lg,
        "xl" to elevation.xl
    ).forEach { (name, depth) ->
        PantrixSurface(modifier = Modifier.size(72.dp), elevation = depth) {
            PantrixText(text = name, modifier = Modifier.align(Alignment.Center))
        }
    }
}
```

### İçerik bir kutudadır

`content` bir `BoxScope`'tur: çocuklar alt alta dizilmez, üst üste durur ve her biri `Modifier.align` ile yerini seçer. Alt alta dizmek için içine bir `Column` konur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val spacing = PantrixTheme.spacing
PantrixSurface(
    modifier = Modifier.fillMaxWidth().height(120.dp),
    color = PantrixTheme.colors.neutral.container
) {
    PantrixText(text = "TopStart", modifier = Modifier.align(Alignment.TopStart).padding(spacing.md))
    PantrixText(text = "Center", modifier = Modifier.align(Alignment.Center))
    PantrixText(text = "BottomEnd", modifier = Modifier.align(Alignment.BottomEnd).padding(spacing.md))
}
```

## API

### PantrixSurface

`import com.pantrixui.components.container.surface.PantrixSurface`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSurface(
    modifier: Modifier = Modifier,
    color: Color = PantrixTheme.colors.surface,
    contentColor: Color = Color.Unspecified,
    shape: Shape = PantrixTheme.shapes.md,
    border: Color = Color.Unspecified,
    elevation: Dp = 0.dp,
    content: @Composable BoxScope.() -> Unit
)
```

`color` rengini `shape` şeklinin içine boyayan ve içeriğini o şekle kırpan bir kapsayıcı. İstenirse `border` ile 1dp'lik bir kenarı, `elevation` ile bir gölgesi olur.

İçindekiler `contentColor` ile çizilir. O verilmezse, `color` bir rolün dolgusu olduğunda onun üstünde okunan renkle çizilir: içindeki bir `PantrixText` ya da `PantrixIcon` bu rengi kendisine söylenmeden alır. Temanın `surface`'ı ve `background`'u üstünde, bir de temada olmayan bir renkte yüzey içerik rengi vermez, kendisi neyin üstünde durursa dursun: içindeki her bileşen kendi varsayılanıyla çizilir, yazı `textPrimary`, ikon `onSurface` ile.

Parametreler:

- `modifier: Modifier`: yüzeyin modifier'ı: boyutu ve yeri.
- `color: Color`
- `contentColor: Color`
- `shape: Shape`
- `border: Color`
- `elevation: Dp`
- `content: @Composable BoxScope.() -> Unit`: yüzeyin taşıdığı içerik; içerik renginde çizilir ve `shape`'e kırpılır.

### PantrixColors.contentColorFor

`import com.pantrixui.foundation.token.color.contentColorFor`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixColors.contentColorFor(container: Color): Color
```

`container` üstüne çizilen her şeyin aldığı tek renk: bir rolün renginin üstünde o rolün `onColor`'ı, container'ının üstünde `onContainer`'ı. Setin bunun için tek bir rengi olmadığı yerde `Color.Unspecified`: kendi zeminlerinde, yani arka zeminde ve yüzeyde, ve sette olmayan bir renkte.

Set, kendi zeminlerinde her tür içeriğe ayrı bir renk verir: yazı `textPrimary`'dir, ikon `onSurface`. Bu yüzden bir zeminle doldurulmuş kapsayıcı içindekilere içerik rengi vermez ve her bileşen orada kendi varsayılanıyla çizilir. Bir dolguda ise hepsi, o dolguda okunan tek rengi alır.

Yalnızca renge bakar ve bir tema aynı rengi iki kez kullanabilir: koyu tema devre dışı bir kontrolü nötr rolün container'ının rengiyle doldurur. Bu yüzden devre dışı çifte en son bakılır. Bir rolün dolgusu, üstünde okunan rengi, yani o rolün içerik rengini alır. Devre dışı içerik rengi ise yalnızca devre dışı container'dan başka bir şey olmayan dolgunun cevabıdır. Devre dışı olan, `disabledContent`'i kendisi ister.

Parametreler:

- `container: Color`

### LocalPantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixContentColor: ProvidableCompositionLocal<Color>
```

Yazının ve ikonların, kendilerine renk verilmediğinde çizildiği renk. Onu sağlayanın içindeki her şey için geçerlidir. Bir dolgu boyayan bileşen, o dolguda okunan rengi sağlar: dolu bir düğme rolünün `onColor`'ını, bir rolün rengiyle doldurulmuş bir yüzey o renkle eşlenen rengi.

Temanın başlangıç değeri olan `Color.Unspecified`, çevrede hiçbir şeyin renk sağlamadığı anlamına gelir. Temanın kendi zeminleri de bunu sağlar: arka zemindeki bir scaffold, bir yüzey, bir kart. Onların üstünde her bileşen kendi varsayılanıyla çizilir: `PantrixText` `textPrimary` ile, `PantrixIcon` `onSurface` ile, `PantrixSpinner` markanın rengiyle.

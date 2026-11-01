# Renkler

Temanın renkleri: `PantrixTheme.colors`. Bir bileşen rengini adıyla değil işiyle ister: ana iş `primary`'dir, bir hata `danger`, bir kartın zemini `surface`. O işin hangi renk olduğunu tema söyler; açık temadan koyuya geçildiğinde bileşenin kodu değişmez, rengi değişir.

Rollerin, zeminlerin ve çizgilerin örnekleri renklerini `PantrixTheme.colors`'tan okur, bir renk kodu yazmaz: "Ayarlar"da tema açıktan koyuya çevrildiğinde onunla birlikte değişirler. Palet temaya bakmaz: skalaları iki temada da aynıdır.

## Özellikler

- **Altı rol.** `primary` markanın rolüdür: ana iş ve seçili olan. `success`, `info`, `warning` ve `danger` bir durumu söyler; `neutral` kendi rengi olmayan, göze batmaması gerekenin rolüdür.
- **Bir rolün dört rengi.** Her rol bir `PantrixColor`'dır: `color` rolün tam gücü, `container` yumuşağı; `onColor` ve `onContainer` onların üstüne çizilen yazının ve ikonun rengi.
- **İki zemin.** `background` uygulamanın arka zeminidir; `surface` öne çıkan ya da gruplanan alanın: bir kart, bir sheet, bir dialog, bir menü.
- **Yazı renkleri.** Zeminlerin üstünde asıl metin `textPrimary`, yardım metni `textSecondary`, kullanılamayanın metni `textDisabled` ile yazılır. `textInverse` temanın tersi tonda bir dolgunun üstündeki yazıdır.
- **Kenarlar ve çizgiler.** `border` bir kutunun yumuşak kenarı, `borderHover` imlecin altındaki hâli, `borderStrong` yalnızca işaretinden ibaret bir kontrolün işareti, `divider` öğelerin arasındaki çizgidir.
- **Devre dışı, odak, scrim.** `disabledContainer` ve `disabledContent` kullanılamayan bir kontrolün dolgusu ve üstündekidir; `focusRing` klavye odağındakinin çevresindeki halka, `scrim` bir modalın arkasına serilen renk.
- **İçerik rengi.** Bir dolgu, üstüne ne renkle yazıldığını içindekilere söyler: renk verilmeyen yazı ve ikon onu alır. `contentColorFor` bir dolgunun eşini temadan bulur.
- **Grafik renkleri.** `chart`, bir grafiğin serilerini birbirinden ayırdığı renklerdir, dağıtıldıkları sırayla. Bir rol değildirler: serinin ne olduğunu söylemezler, yalnızca onu ötekilerden ayırırlar.
- **Palet.** `PantrixPalette` on sekiz rengin her birini on bir basamakta verir. Roller basamaklarını oradan seçer; bileşenler rolleri okur, paleti değil.
- **Kendi renklerin.** `PantrixColors` bir `data class`'tır: `PantrixColors.Light` ve `PantrixColors.Dark` hazır iki settir, `copy` bir setin tek bir rolünü değiştirir, `PantrixTheme(colors = …)` seti temaya verir.

## Örnekler

### Altı rol

Her satır bir rol, her kutu o rolün bir dolgusu. Soldaki `color`, rolün tam gücüdür: dolu bir düğmenin dolgusu. Sağdaki `container`, rolün yumuşağıdır: yumuşak bir düğmenin ya da renklendirilmiş bir alanın dolgusu. Kutunun içindeki iki satır o dolgunun üstünde okunan renkle yazıldı: `color`'ın üstünde `onColor`, `container`'ın üstünde `onContainer`.

Renklerin hiçbiri burada yazılı değil, hepsi `PantrixTheme.colors`'tan okunur. "Ayarlar"da temayı koyuya çevir: aynı altı rol, koyu zeminde okunan renkleriyle gelir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val roles = listOf(
    "primary" to colors.primary,
    "success" to colors.success,
    "info" to colors.info,
    "warning" to colors.warning,
    "danger" to colors.danger,
    "neutral" to colors.neutral
)
roles.forEach { (name, role) ->
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = name, modifier = Modifier.width(72.dp))
        ColorSwatch(
            name = "color",
            fill = role.color,
            ink = role.onColor,
            modifier = Modifier.weight(1f),
            inkName = "onColor"
        )
        ColorSwatch(
            name = "container",
            fill = role.container,
            ink = role.onContainer,
            modifier = Modifier.weight(1f),
            inkName = "onContainer"
        )
    }
}

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

### Zeminler ve yazı renkleri

Temanın iki zemini var. `background` uygulamanın arka zeminidir, her şeyin arkasında durur. `surface` öne çıkan ya da gruplanan alanın zeminidir: bir kart, bir sheet, bir dialog, bir menü. İkisinin üstünde de yazı aynı renklerle yazılır: asıl metin `textPrimary`, yardım metni `textSecondary`, kullanılamayan bir şeyin metni `textDisabled`. Yazı olmayan, başka bir şeyin renk vermediği bir ikon gibi, `onSurface` ile çizilir.

Alttaki kutu temanın tersi tonda bir dolgudur: üstündeki yazı `textInverse`'tür, açık temada beyaz, koyuda siyaha yakın. Tooltip böyle çizilir: dolgusu `onSurface`, yazısı `textInverse`.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    listOf("background" to colors.background, "surface" to colors.surface).forEach { (name, ground) ->
        PantrixSurface(modifier = Modifier.weight(1f), color = ground, border = colors.border) {
            Column(
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
            ) {
                PantrixText(text = name, style = PantrixTheme.typography.callout)
                PantrixText(text = "textPrimary", color = colors.textPrimary)
                PantrixText(text = "textSecondary", color = colors.textSecondary)
                PantrixText(text = "textDisabled", color = colors.textDisabled)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, tint = colors.onSurface)
                    PantrixText(text = "onSurface")
                }
            }
        }
    }
}
ColorSwatch(
    name = "textInverse",
    fill = colors.onSurface,
    ink = colors.textInverse,
    modifier = Modifier.fillMaxWidth(),
    inkName = "onSurface dolgusunun üstünde"
)

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

### Kenarlar ve çizgiler

`border` bir kutunun kenarıdır: bir metin alanının, bir chip'in. Bilerek yumuşaktır: `divider`'dan güçlü, yazıdan çok daha sessiz. `borderHover` aynı kenarın imlecin altındaki hâlidir, bir basamak güçlüsü. `borderStrong` yalnızca işaretinden ibaret bir kontrolün işaretidir: bir checkbox'ın kutusu, bir radio button'ın halkası, kapalı bir switch. Durduğu zemine karşı 3:1'dir (WCAG 1.4.11): kontrol seçilmeden önce de görünür. Alttaki checkbox'ın boş kutusu onunla çizilir.

`border` o 3:1'in altındadır. Alanlarının kenarı için bunu karşılaması gereken bir ürün temasına burada daha güçlü bir renk verir.

`divider` öğelerin ya da bölümlerin arasındaki çizgidir, `border`'dan açıktır: ayırır, bir kontrolün kenarı değildir. Renk verilmeyen bir `PantrixHorizontalDivider` temanın zeminlerinde onunla çizilir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
var checked by rememberSaveable { mutableStateOf(false) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    listOf(
        "border" to colors.border,
        "borderHover" to colors.borderHover,
        "borderStrong" to colors.borderStrong
    ).forEach { (name, edge) ->
        PantrixSurface(border = edge) {
            PantrixText(text = name, modifier = Modifier.padding(PantrixTheme.spacing.md))
        }
    }
}
PantrixCheckbox(
    checked = checked,
    onCheckedChange = { checked = it },
    label = "Boş kutunun kenarı: borderStrong",
    tagKey = "border_strong"
)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(text = "Profil")
    PantrixHorizontalDivider()
    PantrixText(text = "Güvenlik")
    PantrixHorizontalDivider()
    PantrixText(text = "Aradaki çizgiler: divider", color = colors.textSecondary)
}
```

### Devre dışı, odak halkası ve scrim

Kullanılamayan bir kontrolün dolgusu `disabledContainer`, üstündeki yazı ve ikon `disabledContent`'tir: yanındaki devre dışı düğme o ikisiyle çizilir. Bir dolgunun üstünde durmayan devre dışı metin `textDisabled`'dır: devre dışı bir checkbox'ın etiketi.

`focusRing` klavye odağını alan bileşenin çevresindeki halkanın rengidir. Buradaki kutunun kenarı o renkle ve halkanın kalınlığıyla (`PantrixTheme.platform.focusRingWidth`) çizildi. `scrim` bir modalın, bir dialog'un ya da bir sheet'in arkasında uygulamanın üstüne serilen renktir: son kutunun yazısı onun altında kalır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    ColorSwatch(
        name = "disabledContainer",
        fill = colors.disabledContainer,
        ink = colors.disabledContent,
        inkName = "disabledContent"
    )
    PantrixButton(text = "Devre dışı düğme", onClick = {}, enabled = false, tagKey = "disabled_button")
}
PantrixCheckbox(
    checked = false,
    onCheckedChange = {},
    enabled = false,
    label = "Devre dışı etiket: textDisabled",
    tagKey = "disabled_label"
)
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixText(
        text = "focusRing",
        modifier = Modifier
            .border(PantrixTheme.platform.focusRingWidth, colors.focusRing, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    )
    Box {
        PantrixText(text = "scrim'in altındaki yazı", modifier = Modifier.padding(PantrixTheme.spacing.md))
        Box(modifier = Modifier.matchParentSize().background(colors.scrim, PantrixTheme.shapes.md))
    }
}

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

### Dolgunun söylediği içerik rengi

Bir dolgu, üstüne ne renkle yazıldığını içindekilere söyler. `PantrixSurface` bir rolün rengiyle doldurulduğunda temanın o renkle eşlediğini içerik rengi olarak verir: `color` için `onColor`, `container` için `onContainer`. İlk iki kutunun içindeki ikona, yazıya ve çizgiye renk verilmedi; üçü de o rengi aldı. Çizgi o rengin yüzde otuzudur.

Temanın kendi zeminleri bir içerik rengi vermez. Üçüncü kutu `surface` ile dolu: içindeki her bileşen kendi varsayılanıyla çizilir, yazı `textPrimary`, ikon `onSurface`, çizgi `divider` ile.

Son kutunun dolgusu temanın hiçbir rolünde yok. Tema onun üstünde neyin okunduğunu bilemez: içerik rengini çağıran verir, `contentColor` ile.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val own = ownColors()
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.primary.color) {
    FillContent(name = "primary.color")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.success.container) {
    FillContent(name = "success.container")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = colors.surface, border = colors.divider) {
    FillContent(name = "surface")
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = own.color, contentColor = own.onColor) {
    FillContent(name = "Temada olmayan bir renk")
}

@Composable
private fun FillContent(name: String) {
    Column(
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
            PantrixText(text = name)
        }
        PantrixHorizontalDivider()
        PantrixText(text = "Bu yazıya, ikona ve çizgiye renk verilmedi.", style = PantrixTheme.typography.footnote)
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Grafik renkleri

`chart`, bir grafiğin serilerine dağıttığı renklerdir: ilk seri ilkini alır, ikinci ikincisini. Seri sayısı renk sayısını geçerse `chartColor(index)` baştan başlar. Varsayılan setlerde on renk vardır.

Üç şey gözetilerek seçildiler. Her biri temanın iki zemininde de bir çizginin ya da bir çubuğun görünmesine yetecek kadar ayrışır: en az 3:1. Açık set ile koyu set aynı renk ailelerini aynı sırada taşır: tema değişince bir seri rengini değil, yalnızca tonunu değiştirir. Sıra da, yan yana gelen iki rengin kırmızıyla yeşili ya da maviyle sarıyı ayırmayan bir göz için de ayrı kalacağı biçimde kuruldu; basamakların bir kısmının komşusundan bir açık ya da bir koyu olması bundandır.

Yine de on seriyi yalnızca renk taşımaz, hiçbir göz için: çok serili bir grafik serilerini renkten fazlasıyla işaretler. Kendi markanın renkleri için `PantrixTheme.colors.copy(chart = listOf(…))` yeter.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixTheme.colors.chart.forEachIndexed { index, color ->
        Column(
            modifier = Modifier.weight(1f),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
        ) {
            Box(modifier = Modifier.fillMaxWidth().height(40.dp).background(color, PantrixTheme.shapes.sm))
            PantrixText(text = strings.number(index + 1), style = PantrixTheme.typography.caption)
        }
    }
}
```

### Paletin skalaları

`PantrixPalette` temanın renklerinin seçildiği ham skalalardır: on sekiz renk, her biri on bir basamakta, soldan sağa 50, 100, 200 ve yüzer yüzer 900'e, sonra 950. Hepsi `PantrixPalette.all` ile adlarıyla birlikte gelir.

Varsayılan temalarda bir rolün `color`'ı açık temada skalasının 600'ü ya da 700'üdür, koyuda 400'ü; `container`'ı açık temada 100'ü, koyuda 900'üdür, `neutral` için 800'ü. Orada `primary` rolü `Blue`, `success` rolü `Green`, `info` rolü `Cyan`, `warning` rolü `Amber`, `danger` rolü `Red` skalasındandır; `neutral` rolü, zeminler, yazı ve çizgiler `Slate` skalasından. Açık temadaki beyazlar hiçbir skalanın basamağı değildir: `surface`, `textInverse` ve rollerin `onColor`'ı.

Bir bileşen paleti okumaz, rolleri okur. Palet, bir temanın rollerini kurarken basamak seçmek içindir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColorScale
import com.pantrixui.foundation.token.color.PantrixPalette

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixPalette.all.forEach { (name, scale) ->
        Row(verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = name, modifier = Modifier.width(64.dp), style = PantrixTheme.typography.footnote)
            scale.shades().forEach { shade ->
                Box(modifier = Modifier.weight(1f).height(24.dp).background(shade))
            }
        }
    }
}

private fun PantrixColorScale.shades(): List<Color> = listOf(
    shade50,
    shade100,
    shade200,
    shade300,
    shade400,
    shade500,
    shade600,
    shade700,
    shade800,
    shade900,
    shade950
)
```

### Paletten kurulan kendi rolün

Temanın altı rolünde olmayan bir renk gerektiğinde rol paletten kurulur: bir `PantrixColor`, dört rengiyle. Burada `Violet` skalasından, temanın kendi rollerinin basamaklarıyla: açık temada 600 ve üstünde beyaz, koyu temada 400 ve üstünde 950. Böylece renk iki temada da zeminden ayrılır ve üstündeki yazı okunur. Uygulama temasının koyu olup olmadığını kendisi bilir; bu uygulamada `LocalDemoDarkTheme` söyler.

Kurulan rol temanın rolleri gibi kullanılır: `buttonColors(variant)` ondan bir düğmenin renklerini çıkarır. Öteki sayfalardaki "uygulamanın kendi rengi" örnekleri bu mordur.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor
import com.pantrixui.foundation.token.color.PantrixPalette

val violet = PantrixPalette.Violet
val own = if (LocalDemoDarkTheme.current) {
    PantrixColor(
        color = violet.shade400,
        onColor = violet.shade950,
        container = violet.shade900,
        onContainer = violet.shade100
    )
} else {
    PantrixColor(
        color = violet.shade600,
        onColor = Color.White,
        container = violet.shade100,
        onContainer = violet.shade900
    )
}
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    ColorSwatch(
        name = "color",
        fill = own.color,
        ink = own.onColor,
        modifier = Modifier.weight(1f),
        inkName = "onColor"
    )
    ColorSwatch(
        name = "container",
        fill = own.container,
        ink = own.onContainer,
        modifier = Modifier.weight(1f),
        inkName = "onContainer"
    )
}
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Kampanyaya katıl",
        onClick = {},
        colors = own.buttonColors(ButtonVariant.Solid),
        tagKey = "own_solid"
    )
    PantrixButton(
        text = "Ayrıntılar",
        onClick = {},
        colors = own.buttonColors(ButtonVariant.Soft),
        tagKey = "own_soft"
    )
    PantrixButton(
        text = "Vazgeç",
        onClick = {},
        colors = own.buttonColors(ButtonVariant.Outline),
        tagKey = "own_outline"
    )
}

@Composable
private fun ColorSwatch(
    name: String,
    fill: Color,
    ink: Color,
    modifier: Modifier = Modifier,
    inkName: String? = null
) {
    Column(
        modifier = modifier
            .background(fill, PantrixTheme.shapes.md)
            .padding(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = name, color = ink)
        if (inkName != null) PantrixText(text = inkName, style = PantrixTheme.typography.caption, color = ink)
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalDemoDarkTheme`: Uygulamanın teması şu an koyu mu: ayar "Sistem"deyken sistemin modu, değilken ayarın kendisi.

### Markanın rengini değiştiren tema

Markanın rengi `primary` rolüdür ve onu tema verir. `PantrixColors` bir `data class` olduğu için `copy` ile tek bir rol değiştirilir; `PantrixTheme(colors = …)` yeni seti içindekilere verir. Buradaki düğmelere, checkbox'a ve switch'e renk verilmedi: `primary`'yi okurlar ve temanın verdiği morla çizilirler.

Uygulamanın tamamı için aynı şey en dıştaki temada yapılır. `focusRing` ayrı bir renktir: `primary` değişince o değişmez, istenirse o da verilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var agreed by rememberSaveable { mutableStateOf(true) }
var notify by rememberSaveable { mutableStateOf(true) }
PantrixTheme(colors = PantrixTheme.colors.copy(primary = own)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Kaydet", onClick = {}, tagKey = "brand_save")
        PantrixButton(text = "Önizle", onClick = {}, variant = ButtonVariant.Soft, tagKey = "brand_preview")
        PantrixButton(text = "Vazgeç", onClick = {}, variant = ButtonVariant.Outline, tagKey = "brand_cancel")
    }
    PantrixCheckbox(
        checked = agreed,
        onCheckedChange = { agreed = it },
        label = "Koşulları kabul ediyorum",
        tagKey = "brand_agree"
    )
    PantrixSwitchButton(
        checked = notify,
        onCheckedChange = { notify = it },
        label = "Bildirim gönder",
        tagKey = "brand_notify"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi bileşeninin içerik rengi

Uygulamanın kendi bileşeni de içerik rengini temadan bulur. `Pill` bir dolgu alır ve üstüne çizeceğinin rengini `contentOn` ile sorar: dolgu bir rolün rengiyse onunla eşlenen renk (`contentColorFor`'un bulduğu), temanın zeminiyse `textPrimary`, temanın bilmediği bir renkse bileşenin kendi varsayılanı. `ProvidePantrixContentColor` o rengi içindekilere verir: yazıya ve ikona renk verilmedi, ikisi de onu aldı.

Alttaki satır `contentColorFor`'u doğrudan sorar: başarının dolgusunda `onColor` verir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.contentColorFor
import com.pantrixui.foundation.token.color.contentOn
import com.pantrixui.foundation.token.contentcolor.ProvidePantrixContentColor

val colors = PantrixTheme.colors
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    Pill(text = "Kaydedildi", fill = colors.success.color)
    Pill(text = "Taslak", fill = colors.warning.container)
    Pill(text = "Zeminde", fill = colors.surface)
}
val onFill = colors.contentColorFor(colors.success.color)
PantrixText(
    text = "contentColorFor(success.color) onColor mı: ${if (onFill == colors.success.onColor) "evet" else "hayır"}",
    style = PantrixTheme.typography.footnote,
    color = colors.textSecondary
)

@Composable
private fun Pill(
    text: String,
    fill: Color
) {
    val colors = PantrixTheme.colors
    val content = colors.contentOn(given = fill, usual = colors.surface, otherwise = colors.textPrimary)
    Row(
        modifier = Modifier
            .background(fill, PantrixTheme.shapes.full)
            .border(1.dp, colors.divider, PantrixTheme.shapes.full)
            .padding(horizontal = PantrixTheme.spacing.md, vertical = PantrixTheme.spacing.xs),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ProvidePantrixContentColor(content) {
            PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null, size = 16.dp)
            PantrixText(text = text, style = PantrixTheme.typography.footnote)
        }
    }
}
```

### Pantrix'in iki seti

Pantrix'in kendi iki seti: `rememberPantrixColors(darkTheme)` açık ya da koyu olanı verir, uygulamanın markası ne olursa olsun. İkisi `PantrixColors.Light` ve `PantrixColors.Dark` olarak da okunur: bir uygulama kendi setini onlardan `copy` ile kurar. Burada iki bölüm iki seti alıyor; her biri zeminini kendi `surface`'iyle çizer.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.Dark
import com.pantrixui.foundation.token.color.PantrixColors
import com.pantrixui.foundation.token.color.rememberPantrixColors

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    listOf(false, true).forEach { dark ->
        val set = rememberPantrixColors(darkTheme = dark)
        PantrixTheme(darkTheme = dark, colors = set) {
            PantrixSurface(border = PantrixTheme.colors.divider) {
                Column(
                    modifier = Modifier.padding(PantrixTheme.spacing.md),
                    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
                ) {
                    PantrixText(text = if (set == PantrixColors.Dark) "PantrixColors.Dark" else "PantrixColors.Light")
                    PantrixButton(text = "Devam", onClick = {}, tagKey = if (dark) "dark_set" else "light_set")
                }
            }
        }
    }
}
```

## API

### PantrixColors

`import com.pantrixui.foundation.token.color.PantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixColors(
    val primary: PantrixColor,
    val success: PantrixColor,
    val info: PantrixColor,
    val warning: PantrixColor,
    val danger: PantrixColor,
    val neutral: PantrixColor,
    val background: Color,
    val surface: Color,
    val onSurface: Color,
    val disabledContainer: Color,
    val disabledContent: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textDisabled: Color,
    val textInverse: Color,
    val border: Color,
    val borderHover: Color,
    val borderStrong: Color,
    val divider: Color,
    val focusRing: Color,
    val scrim: Color,
    val chart: List<Color>
)
```

Bir Pantrix temasının renkleri: altı rol, arka zemin ve yüzeyler, onların üstüne çizilen yazı, çizgiler ve işaretler, ve bir grafiğin serilerini birbirinden ayırdığı renkler. Her rol bir `PantrixColor`'dır ve `roles()` onları listeler.

Parametreler:

- `primary: PantrixColor`: Markanın rolü: ana iş ve seçili olan.
- `success: PantrixColor`: İyi gidenin rolü: tamamlanan bir adım, kaydedilen bir değişiklik.
- `info: PantrixColor`: Nötr bilginin rolü: bir ipucu, bir duyuru.
- `warning: PantrixColor`: Soruna dönüşmeden önce dikkat isteyenin rolü.
- `danger: PantrixColor`: Ters gidenin ya da geri alınamayanın rolü: bir hata, geri alınamayan işin düğmesi.
- `neutral: PantrixColor`: Kendi rengi olmayan, göze batmaması gerekenin rolü.
- `background: Color`: Uygulamanın kendi arka zemini, her şeyin arkasında: bir scaffold'un doldurduğu zemin.
- `surface: Color`: Öne çıkan ya da gruplanan bir alan: bir kart, bir sheet, bir dialog, bir menü, bir sidebar, bir metin alanının kutusu.
- `onSurface: Color`: Temanın kendi zeminlerinde, `background`'da da `surface`'ta da, yazı olmayan her şeyin çizildiği renk: başka hiçbir şeyin renk vermediği bir ikon, bir checkbox'ın üstüne çizilen basış. Orada yazı `textPrimary`'dir. İki zeminin böyle tek bir ortak rengi vardır, tek bir asıl metin rengi olduğu gibi.
- `disabledContainer: Color`: Kullanılamayan bir kontrolün dolgusu: devre dışı bir düğme, devre dışı bir switch'in izi.
- `disabledContent: Color`: `disabledContainer`'ın üstüne çizilenler, ayrıca devre dışı olan her şeyin işaretleri ve kenarları: devre dışı bir düğmenin etiketi, devre dışı bir radio button'ın halkası, devre dışı bir alanın kenarı.
- `textPrimary: Color`: Asıl metin: bir yazı, kendisine renk verilmedikçe temanın kendi zeminlerinde, `background` ve `surface` üstünde, bu renkle yazılır. Bir dolgunun üstündeki yazı o dolguda okunan rengi alır.
- `textSecondary: Color`: Daha az ağırlıklı metin: yardım metni, bir ayırıcı çizginin etiketi.
- `textDisabled: Color`: Kullanılamayanın metni, bir dolgunun üstünde durmadığı yerde: devre dışı bir checkbox'ın etiketi, devre dışı bir bağlantı, devre dışı bir sekme. Varsayılan temalar ona `disabledContent`'in rengini verir.
- `textInverse: Color`: Temanın tersi tonda bir dolgunun üstündeki yazı: varsayılan açık temada beyaz, koyuda siyaha yakın.
- `border: Color`: Ne olduğunu içindekinin söylediği bir kutunun kenarı: bir metin alanı, bir chip. Bilerek yumuşak bir çizgidir: `divider`'dan güçlü, yazıdan çok daha sessiz. WCAG 1.4.11'in bir kontrolü tek başına belli eden kenardan istediği 3:1'in altındadır: alanları için bunu karşılaması gereken bir ürün burada daha güçlü bir renk verir.
- `borderHover: Color`: O kenarın imlecin altındaki hâli: `border`'dan bir basamak güçlü.
- `borderStrong: Color`: Yalnızca işaretinden ibaret bir kontrolün işareti: bir checkbox'ın kutusu, bir radio button'ın halkası, kapalı bir switch. Durduğu zemine karşı 3:1'dir (WCAG 1.4.11): kontrol seçilmeden önce de görünür.
- `divider: Color`: Öğelerin ya da bölümlerin arasındaki çizgi, `border`'dan açık: ayırır, bir kontrolün kenarını belli etmez.
- `focusRing: Color`: Klavye odağındakinin çevresindeki halka.
- `scrim: Color`: Bir modalın arkasında uygulamanın üstüne serilen yarı saydam renk: bir dialog'un, bir sheet'in, bir çekmecenin arkasında.
- `chart: List<Color>`: Bir grafiğin serilerini çizdiği renkler, onları dağıttığı sırayla: ilk seri ilkini alır, serisi renginden çok olan bir grafikte de `chartColor` baştan başlar. Bir rolün yaptığı gibi serinin ne olduğunu söylemezler: ters giden bir seri, kendi rengi olarak `danger` ile çizilir. Varsayılan setlerde on renk vardır: her biri setin zeminlerine karşı 3:1'dedir (WCAG 1.4.11), açık sette ve koyu sette aynı renk aileleridir, sıraları da yan yana gelenleri her tür renk görüşü için ayrı tutar. On seriyi yalnızca renk taşımaz, hiçbir göz için: çok serili bir grafik onları renklerinden fazlasıyla işaretler.

Üyeleri:

- `fun chartColor(index: Int): Color`: Bir grafiğin `index` sırasındaki serisinin rengi, sıfırdan sayılarak: `chart`'ın renkleri sırasıyla, sonuncudan sonra yine ilkinden.

### PantrixColor

`import com.pantrixui.foundation.token.color.PantrixColor`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixColor(
    val color: Color,
    val onColor: Color,
    val container: Color,
    val onContainer: Color
)
```

Tek bir renk rolü: tam gücüyle renk, aynı rengin daha yumuşak bir container'ı ve her birinin üstüne çizilenler.

Parametreler:

- `color: Color`: Rolün tam gücü: dolu bir düğmenin dolgusu.
- `onColor: Color`: `color` üstündeki yazı ve ikonlar.
- `container: Color`: Rolün yumuşağı: yumuşak bir düğmenin dolgusu, renklendirilmiş bir alan.
- `onContainer: Color`: `container` üstündeki yazı ve ikonlar.

### PantrixColors.roles

`import com.pantrixui.foundation.token.color.roles`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixColors.roles(): List<PantrixColor>
```

Bu setteki her rol, tanımlandıkları sırayla.

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

### PantrixColors.contentOn

`import com.pantrixui.foundation.token.color.contentOn`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixColors.contentOn(
    given: Color,
    usual: Color,
    otherwise: Color
): Color
```

Bir bileşene bir dolgu verilip üstüne çizilecekler için renk verilmediğinde o dolgunun üstüne çizilecek renk. `given` bir rolün rengiyse bu setin onunla eşlediği renktir, `contentColorFor` onu bulur. Setin zeminlerinden biriyse `textPrimary`'dir. İkisi de değilse `otherwise`.

Bir chip'i bir rolün rengiyle doldurup başka bir şey söylemeyen çağıran, rolün içerik rengini de kasteder; bir yüzey de onu böyle alır. Bileşenin her zamanki içerik rengi o dolguda okunamazdı. Setin arka zemininde ya da yüzeyinde bir bileşenin çizdiği, orada bir yazı nasıl yazılıyorsa öyle yazılır. Sette olmayan bir dolgu, üstünde neyin okunduğunu söylemez: içerik rengini çağıran verir.

Parametreler:

- `given: Color`: Çağıranın verdiği dolgu, vermediyse `Color.Unspecified`.
- `usual: Color`: Dolgu verilmediğinde bileşenin kendiliğinden aldığı dolgu. Yeniden verilirse hiçbir şeyi değiştirmez: bir bileşenin her zamanki dolgusunun üstüne çizdiği, her zaman o dolgunun eşi değildir. Bir segment düğmesinin hapının üstündeki etiket de değildir.
- `otherwise: Color`: Bileşenin her zamanki dolgusunun üstüne ve bu sette eşi olmayan bir dolgunun üstüne çizdiği renk.

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixColors(darkTheme: Boolean): PantrixColors
```

Pantrix'in kendi renkleri: `darkTheme` ise koyu set, değilse açık set.

Parametreler:

- `darkTheme: Boolean`

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixColors(preset: DesignPreset): PantrixColors
```

`preset`'in renkleri: sistem koyuyken koyudur ve sistem değişince onu izler.

Parametreler:

- `preset: DesignPreset`

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixColors(
    preset: DesignPreset,
    darkTheme: Boolean
): PantrixColors
```

`preset`'in renkleri, `darkTheme` ise koyu seti: okuruna açık ya da koyu temayı seçtiren bir uygulama için ve sistem kadar değil çevresindeki tema kadar koyu olan, bir başka temanın içindeki tema için.

```kotlin
val dark = settings.dark ?: isSystemInDarkTheme()
PantrixTheme(preset = Brand, colors = rememberPantrixColors(Brand, darkTheme = dark)) { App() }
```

Parametreler:

- `preset: DesignPreset`: Renklerin kimin olduğu.
- `darkTheme: Boolean`: Koyu setin verilip verilmediği.

### LocalPantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixContentColor: ProvidableCompositionLocal<Color>
```

Yazının ve ikonların, kendilerine renk verilmediğinde çizildiği renk. Onu sağlayanın içindeki her şey için geçerlidir. Bir dolgu boyayan bileşen, o dolguda okunan rengi sağlar: dolu bir düğme rolünün `onColor`'ını, bir rolün rengiyle doldurulmuş bir yüzey o renkle eşlenen rengi.

Temanın başlangıç değeri olan `Color.Unspecified`, çevrede hiçbir şeyin renk sağlamadığı anlamına gelir. Temanın kendi zeminleri de bunu sağlar: arka zemindeki bir scaffold, bir yüzey, bir kart. Onların üstünde her bileşen kendi varsayılanıyla çizilir: `PantrixText` `textPrimary` ile, `PantrixIcon` `onSurface` ile, `PantrixSpinner` markanın rengiyle.

### ProvidePantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.ProvidePantrixContentColor`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ProvidePantrixContentColor(
    color: Color,
    content: @Composable () -> Unit
)
```

`content`'i `color` rengiyle çizer. Bir bileşen yuvalarını bununla sarar.

Parametreler:

- `color: Color`
- `content: @Composable () -> Unit`

### PantrixPalette

`import com.pantrixui.foundation.token.color.PantrixPalette`, `com.pantrixui:foundation` içinden

```kotlin
data object PantrixPalette
```

Renk setlerinin seçildiği ham renk skalaları. Bir setin rolleri basamaklarını buradan seçer. Bileşenler rolleri okur, bunları asla.

Üyeleri:

- `Slate: PantrixColorScale`: Maviye çalan soğuk bir gri: varsayılan `neutral`, ayrıca yüzeyler, yazı ve çizgiler.
- `Zinc: PantrixColorScale`: Hafifçe sıcağa çalan nötr bir gri.
- `Neutral: PantrixColorScale`: Renksiz, saf gri.
- `Red: PantrixColorScale`: Varsayılan `danger`.
- `Orange: PantrixColorScale`: Turuncu, kırmızı ile kehribar arasında: grafiğin ikinci rengi.
- `Amber: PantrixColorScale`: Varsayılan `warning`.
- `Yellow: PantrixColorScale`: Sarı, kehribardan açık. Varsayılan olarak hiçbir rol ve hiçbir grafik rengi onu almaz.
- `Green: PantrixColorScale`: Varsayılan `success`.
- `Emerald: PantrixColorScale`: Mavimsi bir yeşil: grafiğin üçüncü rengi.
- `Teal: PantrixColorScale`: Zümrüt ile camgöbeği arasında bir mavi yeşil: grafiğin renklerinden biri.
- `Cyan: PantrixColorScale`: Varsayılan `info`.
- `Sky: PantrixColorScale`: Camgöbeği ile mavi arasında açık bir mavi: grafiğin son rengi.
- `Blue: PantrixColorScale`: Varsayılan `primary` ve `focusRing`.
- `Indigo: PantrixColorScale`: Mora çalan koyu bir mavi: grafiğin renklerinden biri.
- `Violet: PantrixColorScale`: Mavimsi bir mor. Varsayılan olarak hiçbir rol ve hiçbir grafik rengi onu almaz.
- `Purple: PantrixColorScale`: Menekşe ile pembe arasında bir mor. Varsayılan olarak hiçbir rol ve hiçbir grafik rengi onu almaz.
- `Pink: PantrixColorScale`: Pembe: grafiğin renklerinden biri.
- `Rose: PantrixColorScale`: Pembe bir kırmızı: grafiğin renklerinden biri.
- `all: Map<String, PantrixColorScale>`: Burada tanımlı her skala, özelliğinin adıyla: bir katalog ve testler için.

### PantrixColorScale

`import com.pantrixui.foundation.token.color.PantrixColorScale`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixColorScale(
    val shade50: Color,
    val shade100: Color,
    val shade200: Color,
    val shade300: Color,
    val shade400: Color,
    val shade500: Color,
    val shade600: Color,
    val shade700: Color,
    val shade800: Color,
    val shade900: Color,
    val shade950: Color
)
```

On bir basamakta tek bir renk, neredeyse beyazdan neredeyse siyaha.

Varsayılan temalarda bir rolün rengi açık temada skalanın 600'ü ya da 700'üdür, koyuda 400'ü. Container'ı açık temada 100'ü, koyuda 900'üdür, `neutral` için Slate'in 800'ü.

Parametreler:

- `shade50: Color`: En açık basamak, neredeyse beyaz.
- `shade100: Color`: Soluk bir ton.
- `shade200: Color`: Açık bir ton.
- `shade300: Color`: Açık tonların sonuncusu.
- `shade400: Color`: Açık bir orta basamak.
- `shade500: Color`: Skalanın ortası.
- `shade600: Color`: Koyu bir orta basamak.
- `shade700: Color`: Koyu bir basamak.
- `shade800: Color`: Daha koyu bir basamak.
- `shade900: Color`: Skalanın sonuna yakın, derin bir basamak.
- `shade950: Color`: En koyu basamak, neredeyse siyah.

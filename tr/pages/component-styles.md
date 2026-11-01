# Bileşen stilleri

Bir bileşenin ölçüleri ve biçimi, stilidir: yüksekliği, iç boşluğu, köşesi, ikonunun boyu. Her stilin her platformda bir hazır ayarı vardır; üstüne sırayla markanınki, temanınki ve bir bölümünki biner. Bir bileşenin kendi parametresi hepsinden önce gelir.

## Özellikler

- **Uygulamanın tamamı.** `PantrixTheme(styles = pantrixStyles(…))` stilleri içindeki her yere verir. Bir stilin ezmesini anahtarı kurar: `ButtonStyle.override(all = …, ios = …)`; her biri yalnızca değiştirdiği alanları söyler.
- **Bir bölüm.** `ProvidePantrixStyles(styles) { … }` stilleri yalnızca içindekilere verir, dıştakilerin üstüne.
- **Platforma göre.** `override`'ın `android`, `ios`, `desktop` ve `web` parametreleri o platformun ezmesidir, `all`'ın üstünde.
- **Markanın yolları.** `ComponentTokenOverrides` bir markanın değişikliklerini yolla söyler: `"button.shape"`, `"icon.size"`. Bir hazır ayar onları taşır; `PantrixTheme(componentOverrides = …)` da verir.
- **Okumak.** `PantrixTheme.style(ButtonStyle)` bir stilin o yerde geçerli hâlidir: hazır ayar, marka, tema, bölüm ve yoğunluk birlikte.
- **Kendi bileşenin.** Bir `PantrixStyle` ve onun `PantrixStyleKey`'i uygulamanın kendi bileşenini de aynı düzene sokar: platformlara göre hazır ayarı olur, temada ve bölümde ezilir, yoğunlukla ölçeklenir.

## Örnekler

### Uygulamanın stilleri

Uygulamanın tamamına stiller: dıştaki `PantrixTheme`'e `styles = pantrixStyles(…)` verilir. Burada içteki tema aynı şeyi bir bölüme yapıyor: düğmelerin köşesi küçük (`ShapeRole.Small`), ikonlar 28dp. Hiçbir bileşene parametre verilmedi; ikinci satır stilleri değişmemiş hâliyle aynı bileşenler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.IconStyle
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.PantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles: PantrixStyles = remember {
    pantrixStyles(
        ButtonStyle.override(all = ButtonStyle(shape = ShapeRole.Small)),
        IconStyle.override(all = IconStyle(size = 28.dp))
    )
}
PantrixTheme(styles = styles) { StyledRow("styled") }
StyledRow("plain")

@Composable
private fun StyledRow(tagKey: String) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(text = "Kaydet", onClick = {}, tagKey = "${tagKey}_save")
        PantrixButton(text = "Vazgeç", onClick = {}, variant = ButtonVariant.Outline, tagKey = "${tagKey}_cancel")
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = "Yıldız")
    }
}
```

### Bir bölüm ve bir platform

Bir bölüm ve bir platform. `ProvidePantrixStyles` stilleri yalnızca içindekilere verir, dıştaki stillerin üstüne. Ezme platforma göre de verilir: kartın köşesi her platformda küçük (`ShapeRole.Small`), iOS'ta büyük (`ShapeRole.Large`); bu sayfayı hangi platformda açtıysan onunki çizilir.

```kotlin
import androidx.compose.runtime.remember
import com.pantrixui.components.container.card.CardStyle
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles = remember {
    pantrixStyles(
        CardStyle.override(
            all = CardStyle(shape = ShapeRole.Small),
            ios = CardStyle(shape = ShapeRole.Large)
        )
    )
}
ProvidePantrixStyles(styles) {
    PantrixCard {
        PantrixText(text = "Bu platform: ${PantrixTheme.platform.type.name}")
        PantrixText(
            text = "Kartın köşesi bu bölümün stilinden",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Markanın yolları

Bir markanın değişiklikleri yolla söylenir: ilk parça stilin adı, gerisi alanı. `ComponentTokenOverrides` onları şekiller ve ölçüler olarak taşır; bir markanın hazır ayarı (`DesignPreset`) da böyle verir. Burada düğmeler `"button.shape"` ile orta yuvarlak, ikonlar `"icon.size"` ile 16dp. `PantrixTheme.style(ButtonStyle)` geçerli stili okur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.style.ComponentTokenOverrides

PantrixTheme(componentOverrides = BRAND) {
    StyledRow("brand")
    val button = PantrixTheme.style(ButtonStyle)
    PantrixText(
        text = "Orta düğmenin yüksekliği: ${button.medium.height.value.toInt()}dp",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun StyledRow(tagKey: String) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(text = "Kaydet", onClick = {}, tagKey = "${tagKey}_save")
        PantrixButton(text = "Vazgeç", onClick = {}, variant = ButtonVariant.Outline, tagKey = "${tagKey}_cancel")
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = "Yıldız")
    }
}

private val BRAND = ComponentTokenOverrides(
    shapes = mapOf("button.shape" to ShapeRole.Medium),
    dimensions = mapOf("icon.size" to 16.dp)
)
```

### Kendi bileşenin stili

Uygulamanın kendi bileşeni de stillenir. `PromoStyle` bir `PantrixStyle`'dır: her alanının bir "verilmedi" değeri vardır, `merge` verilenleri üstüne alır, `scaled` havasını yoğunlukla çarpar (`scaledForDensity`). Eşlik eden nesnesi `PantrixStyleKey`'idir: her platformdaki hazır ayarı (`PlatformPresets`) ve markanın yollarını (`"promo.padding"`) okur. Bileşen stilini `PantrixTheme.style(PromoStyle)` ile alır, şeklini `toShape()` ile.

Üstteki kutu hazır ayarındadır; alttakinin bölümü onu `PromoStyle.override(…)` ile hap biçimine sokar.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole
import com.pantrixui.foundation.token.shape.ShapeSpec
import com.pantrixui.foundation.token.shape.takeOrElse
import com.pantrixui.foundation.token.style.ComponentTokenOverrides
import com.pantrixui.foundation.token.style.PantrixStyle
import com.pantrixui.foundation.token.style.PantrixStyleKey
import com.pantrixui.foundation.token.style.PlatformPresets
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles
import com.pantrixui.foundation.token.style.scaledForDensity
import com.pantrixui.foundation.token.style.toShape

Promo("Kış indirimi: kargo bedava")
ProvidePantrixStyles(remember { pantrixStyles(PromoStyle.override(all = PromoStyle(shape = ShapeRole.Full))) }) {
    Promo("Bugün sipariş verene ertesi gün teslim")
}

@Immutable
private data class PromoStyle(
    val padding: Dp = Dp.Unspecified,
    val shape: ShapeSpec = ShapeSpec.Unspecified
) : PantrixStyle<PromoStyle> {
    override fun merge(other: PromoStyle?): PromoStyle = if (other == null) {
        this
    } else {
        PromoStyle(
            padding = if (other.padding.isSpecified) other.padding else padding,
            shape = other.shape.takeOrElse { shape }
        )
    }

    override fun scaled(scale: Float): PromoStyle = copy(padding = padding.scaledForDensity(scale))

    /** Stilin anahtarı: adı `"promo"`, her platformdaki hazır ayarı ve markanın yolları. */
    companion object Key : PantrixStyleKey<PromoStyle>("promo") {
        override val presets: PlatformPresets<PromoStyle> = PlatformPresets(
            android = PromoStyle(padding = 16.dp, shape = ShapeRole.Large),
            ios = PromoStyle(padding = 16.dp, shape = ShapeRole.Medium),
            desktop = PromoStyle(padding = 12.dp, shape = ShapeRole.Medium),
            web = PromoStyle(padding = 12.dp, shape = ShapeRole.Medium)
        )

        override fun brandOverride(overrides: ComponentTokenOverrides): PromoStyle? =
            if (overrides.hasOverridesFor(name)) {
                PromoStyle(padding = overrides.dimension("promo.padding"), shape = overrides.shape("promo.shape"))
            } else {
                null
            }
    }
}

@Composable
private fun Promo(text: String) {
    val style = PantrixTheme.style(PromoStyle)
    PantrixSurface(color = PantrixTheme.colors.success.container, shape = style.shape.toShape()) {
        Column(modifier = Modifier.padding(style.padding)) {
            PantrixText(text = text, color = PantrixTheme.colors.success.onContainer)
        }
    }
}
```

## API

### PantrixStyles

`import com.pantrixui.foundation.token.style.PantrixStyles`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixStyles
```

İstenen sayıda bileşen için, platform platform stil ezmeleri.

Uygulamanın tamamı için `PantrixTheme(styles = …)`'a, bir bölümü için `ProvidePantrixStyles`'a verilir. Bir bileşenin stili platform hazır ayarıdır; üstüne markanın ezmeleri, sonra temanınkiler, sonra dıştan içe her `ProvidePantrixStyles` gelir. `PantrixButton(shape = …)` gibi bir parametre yine hepsinden önce gelir.

```kotlin
PantrixTheme(
    styles = pantrixStyles(
        ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium)),
        IconStyle.override(all = IconStyle(size = 20.dp))
    )
) { App() }
```

Üyeleri:

- `fun <S : PantrixStyle<S>> overrideFor(key: PantrixStyleKey<S>, platform: PlatformType): S?`: `key`'in `platform`'daki ezmesi, ya da bu ezmeler ona dokunmuyorsa null.
- `operator fun plus(other: PantrixStyles): PantrixStyles`: Bu ezmeler, `other`'ınkiler üstlerinde: ikisi de bir alanı veriyorsa `other` kazanır.

Tipin kendisinde:

- `PantrixStyles.None: PantrixStyles`: Ezme yok: her bileşen hazır ayarını ve markasının ezmelerini korur.

### pantrixStyles

`import com.pantrixui.foundation.token.style.pantrixStyles`, `com.pantrixui:foundation` içinden

```kotlin
fun pantrixStyles(vararg overrides: PantrixStyleOverride<*>): PantrixStyles
```

Bileşen başına bir stil ezmesi. İki kez verilen bir bileşen sonraki ezmeyi öncekinin üstüne alır.

Parametreler:

- `vararg overrides: PantrixStyleOverride<*>`: ezmeler; her biri bir stilin `override`'ıyla yapılır: `ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium))`.

### ProvidePantrixStyles

`import com.pantrixui.foundation.token.style.ProvidePantrixStyles`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ProvidePantrixStyles(
    styles: PantrixStyles,
    content: @Composable () -> Unit
)
```

Stilleri yalnızca `content` için ezer: bir ayarlar ekranında daha sık satırlar, bir dialog'da hap biçimli düğmeler. Ezmeler zaten geçerli olanlara, temanınkilere ve dıştaki her çağrınınkilere eklenir; ikisi de bir alanı veriyorsa kazanır.

Parametreler:

- `styles: PantrixStyles`: `content` için ezmeler; `pantrixStyles` ile yapılır.
- `content: @Composable () -> Unit`

### PantrixStyle

`import com.pantrixui.foundation.token.style.PantrixStyle`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixStyle<S>
```

Bir bileşenin stili: bir platform hazır ayarının belirlediği, bir markanın, bir temanın ya da ağacın bir bölümünün değiştirebileceği geometri ve görünüş.

Her alanın bir "verilmedi" değeri vardır (`Dp.Unspecified`, `Float.NaN`, `ShapeSpec.Unspecified`, `null`); böylece tek bir tür, `TextStyle` gibi, hem eksiksiz bir hazır ayar hem kısmi bir ezmedir: `ButtonStyle(shape = ShapeRole.Medium)` şekli değiştirir, öteki alanları alttaki stile bırakır.

Üyeleri:

- `fun merge(other: S?): S`: Bu stil, `other`'ın verdiği her alan `other`'dan alınarak; `null` bunu döndürür.
- `fun scaled(scale: Float): S`: Bu stil, **havası** arayüz yoğunluğuyla çarpılmış olarak; başka hiçbir şeyi değil.

  Yükseklikler, iç boşluklar, aralıklar ve kenarlar ölçeklenir; çizgiler, kenarlıklar, ayırıcılar, yükseltiler, ikon boyları ve noktalar ölçeklenmez. Sıkı bir ekran içinde daha az hava olan bir ekrandır; ince çizgileri bir ince çizginin 0,85'i olan, ikonları bulanık ve gölgeleri sığ bir ekran değil. Bu ayrım genel olarak yapılamaz; bu yüzden her stil onu kendisi yapar.

  `1f` ölçeği bununla eşit bir stil döndürmelidir: `PantrixDensity.Comfortable` varsayılandır ve onda kaydedilmiş bir ekran görüntüsü tabanı bu geldiğinde kımıldamamalıdır.

  `scaledForDensity` kullan: verilmemiş bir ölçüyü verilmemiş bırakır. Kısmi bir ezme ölçeklendikten sonra da kısmi kalmalıdır; yoksa ezme olmaktan çıkar, bir değer olur.

  `scale`: arayüz yoğunluğunun ölçeği, `PantrixDensity.scale`.

### PantrixStyleKey

`import com.pantrixui.foundation.token.style.PantrixStyleKey`, `com.pantrixui:foundation` içinden

```kotlin
abstract class PantrixStyleKey<S : PantrixStyle<S>>(public val name: String)
```

Bir bileşenin stilini adlandırır ve platform hazır ayarlarını tutar.

Bir stil anahtarını eşlik eden nesnesi olarak bildirir; böylece stil türü kendini adlandırır: `PantrixTheme.style(ButtonStyle)` onu okur, `ButtonStyle.override(ios = …)` onu ezer. Anahtar bileşeniyle birlikte durur; çekirdekte bileşenleri sayan bir şey yoktur.

Parametreler:

- `name: String`: Stilin adı, ve bir markanın onu ezdiği yolların ilk parçası: `"button.shape"`'teki `"button"`.

Üyeleri:

- `presets: PlatformPresets<S>`: Her platformdaki stil. Eksiksizdir: her alanı verilmiştir.
- `open fun brandOverride(overrides: ComponentTokenOverrides): S?`: `overrides`'ın bu stil için verdiği alanlar, ya da hiç vermiyorsa null.
- `fun override(all: S? = null, android: S? = null, ios: S? = null, desktop: S? = null, web: S? = null): PantrixStyleOverride<S>`: `PantrixStyle` için bu stilin bir ezmesi. `all` her platformda geçerlidir, bir platformun kendi argümanı onun üstüne gelir; her biri yalnızca değiştirdiği alanları söyler.

  `android`: Android'de değişen alanlar, `all`'ınkilerin üstünde.

  `ios`: iOS'ta değişen alanlar, `all`'ınkilerin üstünde.

  `desktop`: masaüstünde değişen alanlar, `all`'ınkilerin üstünde.

  `web`: bir tarayıcıda değişen alanlar, `all`'ınkilerin üstünde.
- `fun resolve(platform: PlatformType, componentOverrides: ComponentTokenOverrides = ComponentTokenOverrides.None, styles: PantrixStyles = PantrixStyles.None, density: PantrixDensity = PantrixDensity.Comfortable): S`: `platform`'da geçerli stil: hazır ayarı, markanın `componentOverrides`'ı, temanın ve alt ağacın `styles`'ı, en son da `density`. Kompozisyonu olmayan kod için `PantrixTheme.style`'ın verdiği.

  Yoğunluk ilk değil en son gelir: bir yükseklik veren uygulama ölçeklenmemiş değil ölçeklenmiş bir yükseklik alır. Ayar ekranı kullanan kişinindir ve ekranın ne karar verdiyse ona uygulanır.

### PlatformPresets

`import com.pantrixui.foundation.token.style.PlatformPresets`, `com.pantrixui:foundation` içinden

```kotlin
class PlatformPresets<S : PantrixStyle<S>>(
    public val android: S,
    public val ios: S,
    public val desktop: S,
    public val web: S
)
```

Her platform için bir stil.

Parametreler:

- `android: S`: Android'deki stil.
- `ios: S`: iOS'taki stil.
- `desktop: S`: Masaüstündeki stil.
- `web: S`: Web'deki stil.

Üyeleri:

- `operator fun get(platform: PlatformType): S`: `platform`'un stili: `presets[PlatformType.Ios]`.

### ComponentTokenOverrides

`import com.pantrixui.foundation.token.style.ComponentTokenOverrides`, `com.pantrixui:foundation` içinden

```kotlin
class ComponentTokenOverrides(
    public val shapes: Map<String, ShapeRole> = emptyMap(),
    public val dimensions: Map<String, Dp> = emptyMap()
)
```

Bir markanın bileşen stillerindeki değişiklikleri, yollarıyla: ilk parça stili, gerisi alanı adlandırır, `"button.shape"` ya da `"icon.size"` gibi. Her stil kendininkileri `PantrixStyleKey.brandOverride`'da okur; hiçbir stilin okumadığı bir yol bir şey değiştirmez.

Parametreler:

- `shapes: Map<String, ShapeRole>`: Markanın verdiği şekiller, şekil ölçeğinin adımları olarak.
- `dimensions: Map<String, Dp>`: Markanın verdiği ölçüler: yükseklikler, iç boşluklar, ikon boyları.

Üyeleri:

- `fun hasOverridesFor(component: String): Boolean`: Bir yolun `component`'e, `"button"` gibi bir stil adına, ait olup olmadığı.
- `fun shape(path: String): ShapeSpec`: `path`'te verilen şekil, ya da hazır ayarınkini bırakan `ShapeSpec.Unspecified`.
- `fun dimension(path: String): Dp`: `path`'te verilen ölçü, ya da hazır ayarınkini bırakan `Dp.Unspecified`.

Tipin kendisinde:

- `ComponentTokenOverrides.None: ComponentTokenOverrides`: Ezme yok: her stil platform hazır ayarını korur.

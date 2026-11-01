# Platform ve sistem

Kodun çalıştığı platform ve sistemin erişilebilirlik ayarları. Tema bunları kendisi okur ve bileşenlere söyler; uygulama da aynı yerden okuyabilir.

## Özellikler

- **Platform.** `currentPlatformType()` Android, iOS, masaüstü ya da web'dir; `currentOperatingSystem()` işletim sistemidir, tarayıcıda tarayıcının çalıştığı sistem.
- **Platformun kuralları.** `PantrixPlatform` erişilebilirlik kararlarıdır: en küçük dokunma alanı, odak halkasının kalınlığı ve yalnızca klavyede mi görüneceği, dokunmayla mı kullanıldığı. `rememberPantrixPlatform()` bu cihazınkini, `PantrixPlatform.forType(…)` bir platformunkini verir; `PantrixTheme(platform = …)` onları içindekilere verir.
- **Sistem ayarları.** Hareketi azaltmak, yüksek karşıtlık, renkten başka işaretlerle ayırmak, dokunmatik bir işaretçi, sistemin dili ve saatinin UTC'den farkı: her biri bir `system…` işlevidir.
- **İmleç şekilleri.** `PantrixPointerIcons`, sürüklenince bir şeyi büyüten ya da küçülten bir denetimin üstündeki imleçtir: yana ve yukarı aşağı. Compose'un kendi dört imlecinde yoktur.

## Örnekler

### Bu cihaz

Bu cihaz: kodun çalıştığı platform, işletim sistemi ve platformun kuralları (`rememberPantrixPlatform()`). Temanın söylediği platform (`PantrixTheme.platform`) başka olabilir: bu uygulamanın "Ayarlar"ından bir başka platformun görünüşü seçilebilir; cihazın kendisi değişmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.Dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.a11y.rememberPantrixPlatform
import com.pantrixui.foundation.platform.currentOperatingSystem
import com.pantrixui.foundation.platform.currentPlatformType
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val device = rememberPantrixPlatform()
val system = currentOperatingSystem()
Lines(
    "Platform: ${currentPlatformType().name}",
    "İşletim sistemi: ${system.name}${if (system.isApple) " (Apple)" else ""}",
    "En küçük dokunma alanı: ${device.minTouchTarget.value.toInt()}dp",
    "Odak halkası: ${device.focusRingWidth.written()}, yalnız klavyede: ${yesNo(device.showFocusRingOnlyForKeyboard)}",
    "Dokunmayla kullanılıyor: ${yesNo(device.isTouch)}",
    "Temanın platformu: ${PantrixTheme.platform.type.name}"
)

@Composable
private fun Lines(vararg lines: String) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        lines.forEach { line -> PantrixText(text = line, style = PantrixTheme.typography.footnote) }
    }
}

private fun Dp.written(): String {
    val tenths = (value * 10).roundToInt()
    return if (tenths % 10 == 0) "${tenths / 10}dp" else "${tenths / 10}.${tenths % 10}dp"
}

private fun yesNo(value: Boolean): String = if (value) "evet" else "hayır"
```

### Sistem ayarları

Sistemin ayarları, okundukları anda: hareketi azaltmak, karşıtlığı artırmak, renkten başka işaretlerle ayırmak (iOS'ta "Renksiz Ayırt Et"), işaretçinin bir parmak olup olmadığı, sistemin dili ve saatinin UTC'den farkı. Ayar değişince satırlar da değişir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.systemDifferentiatesWithoutColor
import com.pantrixui.foundation.platform.systemIsInHighContrast
import com.pantrixui.foundation.platform.systemPantrixLocale
import com.pantrixui.foundation.platform.systemPointerIsTouch
import com.pantrixui.foundation.platform.systemReduceMotion
import com.pantrixui.foundation.platform.systemUtcOffset
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.time.Clock

val offset = systemUtcOffset(Clock.System.now())
val hours = offset.inWholeMinutes / 60.0
Lines(
    "Hareketi azalt: ${yesNo(systemReduceMotion())}",
    "Karşıtlığı artır: ${yesNo(systemIsInHighContrast())}",
    "Renksiz ayırt et: ${yesNo(systemDifferentiatesWithoutColor())}",
    "Dokunmatik işaretçi: ${yesNo(systemPointerIsTouch())}",
    "Sistemin dili: ${systemPantrixLocale().languageTag}",
    "UTC'den fark: ${if (hours >= 0) "+" else ""}${if (hours % 1.0 == 0.0) hours.toInt() else hours} saat"
)

@Composable
private fun Lines(vararg lines: String) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        lines.forEach { line -> PantrixText(text = line, style = PantrixTheme.typography.footnote) }
    }
}

private fun yesNo(value: Boolean): String = if (value) "evet" else "hayır"
```

### Başka bir platformun kuralları

Bir başka platformun kuralları, bu cihazda: içteki temaya `PantrixPlatform.forType(…)` verildi. Bileşenler o platformun görünüşüyle ve dokunma alanıyla çizilir: iOS'ta 44dp, Android'de 48dp, fareyle kullanılan bir masaüstünde 32dp. Bir platform seç ve metin alanıyla düğmenin yüksekliğine bak.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.a11y.PantrixPlatform
import com.pantrixui.foundation.platform.PlatformType
import com.pantrixui.foundation.theme.PantrixTheme

var type by remember { mutableStateOf(PlatformType.Ios) }
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixSegmentButton(options = PLATFORMS, selected = type, onSelect = { type = it }, tagKey = "platform")
    PantrixTheme(platform = PantrixPlatform.forType(type)) {
        PantrixText(
            text = "Dokunma alanı: ${PantrixTheme.platform.minTouchTarget.value.toInt()}dp",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
        PantrixTextField(
            state = rememberTextFieldState(),
            modifier = Modifier.fillMaxWidth(),
            label = "Ad",
            tagKey = "platform_name"
        )
        PantrixSwitchButton(checked = true, onCheckedChange = {}, label = "Bildirimler", tagKey = "platform_notify")
        PantrixButton(text = "Kaydet", onClick = {}, tagKey = "platform_save")
    }
}

private val PLATFORMS = listOf(
    SegmentOption(PlatformType.Android, "Android", tagKey = "android"),
    SegmentOption(PlatformType.Ios, "iOS", tagKey = "ios"),
    SegmentOption(PlatformType.Desktop, "Masaüstü", tagKey = "desktop"),
    SegmentOption(PlatformType.Web, "Web", tagKey = "web")
)
```

### Yeniden boyutlandırma imleci

Bir paneli kenarından sürükleyerek genişletmek, alt kenarından sürükleyerek uzatmak. Tutamacın üstünde işaretçi, sürükleyince neyin değişeceğini söyleyen imleçtir: `pointerHoverIcon(PantrixPointerIcons.ResizeHorizontal)` ve `ResizeVertical`. İmleç masaüstünde, web'de ve Android'de fareyle görünür; iOS'ta Compose imleci hiç değiştirmez, parmağın altında da imleç yoktur. Gerçek bir tutamaç klavyeye ve ekran okuyucuya da açık olmalıdır: `PantrixListDetailScaffold(resizable = true)`'nun tutamacı öyledir.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.PantrixPointerIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var size by remember { mutableStateOf(DpSize(240.dp, 120.dp)) }
// Sağdan okunan bir dilde panelin sonu sol kenarıdır; panel sola doğru büyür.
val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
PantrixSurface(modifier = Modifier.size(size), border = PantrixTheme.colors.border) {
    PantrixText(
        text = "${size.width.value.roundToInt()} × ${size.height.value.roundToInt()} dp",
        modifier = Modifier.align(Alignment.Center),
        style = PantrixTheme.typography.footnote
    )
    ResizeGrip(
        orientation = Orientation.Horizontal,
        modifier = Modifier.align(Alignment.CenterEnd).width(GRIP).fillMaxHeight()
    ) { by ->
        val wider = size.width + if (rtl) -by else by
        size = size.copy(width = wider.coerceIn(PANEL_LEAST.width, PANEL_MOST.width))
    }
    ResizeGrip(
        orientation = Orientation.Vertical,
        modifier = Modifier.align(Alignment.BottomCenter).fillMaxWidth().height(GRIP)
    ) { by ->
        size = size.copy(height = (size.height + by).coerceIn(PANEL_LEAST.height, PANEL_MOST.height))
    }
}

@Composable
private fun ResizeGrip(
    orientation: Orientation,
    modifier: Modifier,
    onDrag: (by: Dp) -> Unit
) {
    val density = LocalDensity.current
    val drag by rememberUpdatedState(onDrag)
    val across = orientation == Orientation.Horizontal
    val color = PantrixTheme.colors.textSecondary
    Box(
        modifier = modifier
            .pointerHoverIcon(if (across) PantrixPointerIcons.ResizeHorizontal else PantrixPointerIcons.ResizeVertical)
            .draggable(state = rememberDraggableState { drag(with(density) { it.toDp() }) }, orientation = orientation)
            .drawBehind {
                val long = MARK_LONG.toPx()
                val thick = MARK_THICK.toPx()
                val mark = if (across) Size(thick, long) else Size(long, thick)
                drawRoundRect(
                    color = color,
                    topLeft = Offset((size.width - mark.width) / 2, (size.height - mark.height) / 2),
                    size = mark,
                    cornerRadius = CornerRadius(thick / 2)
                )
            }
    )
}

private val PANEL_LEAST = DpSize(160.dp, 80.dp)

private val PANEL_MOST = DpSize(320.dp, 200.dp)

private val GRIP = 12.dp

private val MARK_LONG = 24.dp

private val MARK_THICK = 4.dp
```

## API

### currentPlatformType

`import com.pantrixui.foundation.platform.currentPlatformType`, `com.pantrixui:foundation` içinden

```kotlin
fun currentPlatformType(): PlatformType
```

Kodun gerçekte hangi platformda çalıştığı.

Bu yalnızca `PantrixTheme(platform = ...)`'nın *varsayılanıdır*. Onu ezmek desteklenen ve amaçlanan bir şeydir: bir önizleme masaüstünde iOS geometrisini böyle gösterir, bir ürün her yerde tek bir görünüşü böyle yayınlar.

### currentOperatingSystem

`import com.pantrixui.foundation.platform.currentOperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
fun currentOperatingSystem(): OperatingSystem
```

Kodun çalıştığı işletim sistemi; tarayıcıda, tarayıcının çalıştığı sistem.

`currentPlatformType` gibi bir tema varsayılanı değildir: masaüstündeki bir iOS geometrisi önizlemesi yine masaüstünün sisteminde çalışır ve masaüstünün klavyesiyle yazılır.

### PlatformType

`import com.pantrixui.foundation.platform.PlatformType`, `com.pantrixui:foundation` içinden

```kotlin
enum class PlatformType
```

Bir temanın kurallarına uyduğu platform: dokunma hedefleri, bileşen preset'leri. `currentPlatformType` kodun çalıştığı platformdur, `PantrixTheme(platform = …)` ile bir başkası istenebilir.

Değerleri:

- `Android`: Android'in gelenekleri: Material'ın 48dp'lik dokunma alanı ve bileşenlerin Android ön ayarları.
- `Ios`: iOS'un gelenekleri: Apple'ın 44pt'lik dokunma alanı ve bileşenlerin iOS ön ayarları.
- `Desktop`: Bir masaüstünün gelenekleri: bir imlecin dokunma alanı ve bileşenlerin masaüstü ön ayarları.
- `Web`: Bir tarayıcının gelenekleri: bir imlecin dokunma alanı ve bileşenlerin web ön ayarları.

### OperatingSystem

`import com.pantrixui.foundation.platform.OperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
enum class OperatingSystem
```

`currentOperatingSystem`'in bildirdiği bir işletim sistemi. Platformun geometrisinin karar vermediğini belirler: bir kısayolun Command ile mi Control ile mi başladığı gibi.

Değerleri:

- `Android`: Android: bir telefonda, bir tablette ya da katlanabilir bir cihazda.
- `Ios`: iOS ve iPadOS.
- `MacOs`: macOS: klavye kısayollarının başında Command tuşu durur.
- `Windows`: Windows: klavye kısayollarının başında Control tuşu durur.
- `Linux`: Linux, ChromeOS ve burada sayılmayan her sistem.

Üyeleri:

- `isApple: Boolean`: Sistemin, klavye kısayollarının Command tuşuyla başladığı Apple sistemlerinden biri olup olmadığı.

### PantrixPlatform

`import com.pantrixui.foundation.a11y.PantrixPlatform`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixPlatform(
    public val type: PlatformType,
    public val minTouchTarget: Dp,
    public val showFocusRingOnlyForKeyboard: Boolean,
    public val focusRingWidth: Dp,
    public val isTouch: Boolean = type.isTouchByNature
)
```

Görsel değil, erişilebilirlik kararı olan platform kuralları.

Parametreler:

- `type: PlatformType`: Bu kuralların ait olduğu platform.
- `minTouchTarget: Dp`: Bir kontrolün en küçük dokunma hedefi: yerleşimde kapladığı yer de, bir dokunuşun ona ulaştığı yer de, ikisi birden. `Modifier.minTouchTarget` bir kontrole bu yeri verir.
- `showFocusRingOnlyForKeyboard: Boolean`: Odak halkasının yalnızca klavyeyle gezinirken görünüp görünmediği. Bugün her yerde true'dur: fare tıklamalarını izleyen bir halka gürültüdür, ona ihtiyacı olanlar da klavyeyle gezinir. Bir yasa değil, bir ürün kararı olduğu için bayrak olarak tutulur.
- `focusRingWidth: Dp`: Halkanın kalınlığı. Sabit değil token'dır, çünkü yüksek kontrast onu kalınlaştırır.
- `isTouch: Boolean`: Platformun dokunarak kullanılıp kullanılmadığı, yani asıl işaretçisinin parmak olup olmadığı. Android'de, iOS'ta ve bir telefonun ya da tabletin tarayıcısında true; asıl işaretçinin fare ya da trackpad olduğu yerde, masaüstünde ve masaüstündeki tarayıcıda false. Web için `type`'ın söyleyemediği şeydir ve platforma göre değil işaretçiye göre belirlenen her şeye o karar verir: bir parmak hareketi ya da bir kısayol için ipucu, işaretçinin üstüne gelmesini bekleyen ya da beklemeyen bir şey. Verilmezse platformun doğasından gelir: Android'de ve iOS'ta dokunmatik.

Üyeleri:

- `focusRingReach: Dp`: Bir odak halkasının öğesinden ne kadar taştığı: halka kadar bir boşluk ve halkanın kendisi. Kayan bir içeriğin, sonlarında duran öğenin halkası için bıraktığı yer budur; lazy bir liste de onu içerik boşluğuna katar ve öğelerine `Modifier.scrollPadding` ile söyler.
- `fun scaled(density: PantrixDensity): PantrixPlatform`: Dokunma hedefine uygulanan yoğunluk: Spacious onu büyütür, Compact hiçbir zaman küçültmez.

  Platformun değeri bir başlangıç noktası değil, bir tabandır. Compact, fare kullananlar için boşlukları sıkıştırmak üzere vardır; bir parmağın, ya da titreyen bir elin, basmak zorunda olduğu bölgeyi platformun kendi en küçük değerinin altına indirmemelidir.

  `density`: temaya verilen arayüz yoğunluğu.

Tipin kendisinde:

- `PantrixPlatform.forType(type: PlatformType, highContrast: Boolean = false, isTouch: Boolean = type.isTouchByNature): PantrixPlatform`: `type`'ın alışkanlıkları. Dokunma hedefi Android'de (48dp, Material) ve iOS'ta (44pt, Apple HIG), onlara ne dokunursa dokunsun, platformun kılavuzundaki en küçük ölçüdür. Hiçbir kılavuzun kapsamadığı masaüstü ve web işaretçiye bakar: fare için 32dp, parmak için de Android'de parmağa verilen ölçü, 48dp. Odak halkası 2dp'dir, `highContrast`'ta 3dp'ye kalınlaşır.

  `isTouch` platformun dokunarak kullanılıp kullanılmadığını söyler. Verilmezse platformun doğasıdır: Android'de ve iOS'ta dokunma, masaüstünde ve tarayıcıda işaretçi. Telefondaki bir tarayıcı ve dokunmatik ekrandaki bir masaüstü uygulaması bunu söyler:

  ```kotlin
  PantrixPlatform.forType(PlatformType.Web, isTouch = true)
  ```

  `rememberPantrixPlatform` sisteme sorar; böylece platform verilmeyen bir tema, telefonun tarayıcısında da doğrudur.

### rememberPantrixPlatform

`import com.pantrixui.foundation.a11y.rememberPantrixPlatform`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixPlatform(): PantrixPlatform
```

Bu cihazın kuralları: `PlatformType`'ınınkiler, sistem yüksek karşıtlıktayken kalınlaşmış odak halkasıyla, ve onu işaret edenin dokunma alanıyla: tarayıcıda telefonda bir parmağınki, masada bir farenin. İkisi de değiştikçe izlenir.

### systemReduceMotion

`import com.pantrixui.foundation.platform.systemReduceMotion`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemReduceMotion(): Boolean
```

İşletim sisteminin "hareketi azalt" ayarı.

Her süreyi sıfıra indiren `PantrixMotion.reduceMotion`'ı besler. Bileşenler bunu hiçbir zaman kendileri denetlemez; `motion.duration(...)`'a sorarlar; böylece ayara uymak, her bileşenin hatırlaması gereken bir kural değil tek bir karardır.

### systemIsInHighContrast

`import com.pantrixui.foundation.platform.systemIsInHighContrast`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemIsInHighContrast(): Boolean
```

İşletim sisteminin "karşıtlığı artır" erişilebilirlik ayarı.

Koyu tema bu dosyada bilerek yoktur: Compose Multiplatform ortak kodda `isSystemInDarkTheme()`'i zaten verir ve onu her platform için yeniden yazmak, kaynağında bakımı yapılan bir şeyin daha kötü bir kopyası olurdu.

### systemDifferentiatesWithoutColor

`import com.pantrixui.foundation.platform.systemDifferentiatesWithoutColor`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemDifferentiatesWithoutColor(): Boolean
```

Sistemin şeyleri renklerinden fazlasıyla ayırmaya ayarlı olup olmadığı: iOS'un "Renksiz Ayırt Et"i ve Android'de renk körü bir kullanıcının açtığı renk düzeltmesi.

Böyle bir ayardan bir şey söylemeyen masaüstünde ve tarayıcıda her zaman false'tur. Stili onları sisteme bıraktığında bir grafiğin desenlerini besler: bir sonrakinden yalnızca rengiyle ayrılan bir seri bir dokuyla da ayrılır.

### systemPointerIsTouch

`import com.pantrixui.foundation.platform.systemPointerIsTouch`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemPointerIsTouch(): Boolean
```

Sistemin dokunmayla kullanılıp kullanılmadığı: ana işaretçisi, fareden daha az kesin olan ve daha büyük bir hedef isteyen bir parmaktır.

Android'de ve iOS'ta her zaman true'dur, JVM'in dokunmatik bir ekrandan bir şey söylemediği masaüstünde her zaman false. Bir tarayıcı iki tür cihazda da çalışır: orada `pointer: coarse` ortam sorgusudur; bir telefonda ve bir tablette true, üstünde dokunmatik ekran olsun olmasın bir dizüstünde false'tur ve değiştikçe izlenir.

`rememberPantrixPlatform` aracılığıyla `PantrixPlatform.isTouch`'ı, onunla da bir tarayıcının aldığı dokunma alanını besler.

### systemPantrixLocale

`import com.pantrixui.foundation.platform.systemPantrixLocale`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemPantrixLocale(): PantrixLocale
```

İşletim sisteminin dili, yazı yönüyle birlikte.

### systemUtcOffset

`import com.pantrixui.foundation.platform.systemUtcOffset`, `com.pantrixui:foundation` içinden

```kotlin
fun systemUtcOffset(moment: Instant): Duration
```

Cihazın saatinin `moment` anında UTC'den ne kadar ileride olduğu: İstanbul'da üç saat, Greenwich'in batısında sıfırdan az. Bir an için sorulur, çünkü saatlerin yaz için ileri alındığı yerlerde değişir.

Elde bir saat dilimi kütüphanesi yokken bir günün ve günün bir saatinin hesaplandığı şey: bir an ve bu, cihazın kendi saatinin gösterdiği günü ve saati verir. `PantrixClock.System`'in farkıdır; bir test ya da önizleme başkasını vermedikçe bir ekran o saatle okunur.

Parametreler:

- `moment: Instant`

### PantrixPointerIcons

`import com.pantrixui.foundation.platform.PantrixPointerIcons`, `com.pantrixui:foundation` içinden

```kotlin
object PantrixPointerIcons
```

Sürüklenince bir şeyi büyüten ya da küçülten bir denetimin imleç şekilleri: iki panelin arasındaki tutamaç, bir tablo kolonunun ucu, bir panelin kenarı. Compose'un kendi `PointerIcon`'unda her platformda dört şekil vardır, ok, artı imleci, metin imleci ve el; bunlar onların arasında yoktur. Her platformda kendi adlarıyla bulunurlar; bu nesne onları tek adla verir.

```kotlin
Box(Modifier.pointerHoverIcon(PantrixPointerIcons.ResizeHorizontal).draggable(…))
```

Android'de sistemin çift okudur, fareyle görünür; masaüstünde AWT'nin boyutlandırma imleci; tarayıcıda CSS'in `col-resize` ya da `row-resize` dediği imleç. Compose iOS'ta hiçbir imleci şekillendirmez, kendi dördünü bile; iPad'in imleci orada kendi şeklini korur. Parmağın altında şekillendirilecek bir imleç yoktur, bir şey değişmez.

Tamamı docs/guide/pointer-icons/POINTER_ICONS_GUIDE.md'dedir; bu kütüphane olmadan aynısı da oradadır.

Üyeleri:

- `ResizeHorizontal: PointerIcon`: Yana sürüklenip bir şeyi genişleten ya da daraltan bir denetimin üstünde: iki panelin arasındaki tutamaç.
- `ResizeVertical: PointerIcon`: Yukarı aşağı sürüklenip bir şeyi uzatan ya da kısaltan bir denetimin üstünde: bir panelin üstündeki tutamaç.

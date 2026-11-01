# Segment Button

Yan yana duran birkaç seçenek tek bir kontrolde, biri seçili. Tek bir kontrol olarak çizilmiş bir radyo grubudur ve seçim, çevresindeki ekranı hemen değiştirir: bir listenin sırasını, bir grafiğin aralığını, bir haritanın katmanını.

Bir iki sözcüklük, iki ila beş seçenek içindir. Daha çok ya da daha uzun seçenek için radyo grubu, bir seçim değil de işler için düğmeler kullanılır. Kontrol kendiliğinden bir şey seçmez: `selected` hangi değeri söylüyorsa o seçilidir; basış ve ok tuşları istenen değeri `onSelect` ile bildirir.

- `PantrixSegmentButton` (`com.pantrixui.components.elements.segmentbutton`, `com.pantrixui:components`): Tek bir kontrolde yan yana duran, biri seçili küçük bir seçenek kümesi: tek bir kontrol olarak çizilmiş bir radyo grubu, seçime kayan bir hapla. Anahtar sözcükler: bölümlü kontrol, bölümlü düğme, geçiş grubu, tek seçim, sekmeli seçim.

## Özellikler

- **Kayan hap.** Seçili segmentin altındaki hap oraya kayar ve etiketi `primary` renginde yazılır. Seçili segmente yeniden basmak bir şey yapmaz.
- **Genişlik.** `fullWidth` (varsayılan) kontrolü verilen genişliğe yayar ve segmentlere eşit pay verir: etiketler başka bir dilde ne derse desin segmentler yerinde kalır. `fullWidth = false` her segmenti etiketi kadar yapar.
- **İkonlar.** `SegmentOption(icon = …)` etiketin önüne, etiketin renginde bir ikon koyar; ekran okuyucu onu atlar.
- **Seçilemeyen segment.** `SegmentOption(enabled = false)` tek bir segmenti kapatır: basılmaz ve ok tuşları onu atlar. Kontrolün `enabled = false`'u hepsini kapatır; hap yerinde kalır ve seçim okunmaya devam eder.
- **Hiçbiri seçili değilken.** `selected` hiçbir seçeneğin değeri değilse, null da öyledir, hiçbir segment seçili değildir ve hap çizilmez.
- **Klavye.** Kontrol Tab için tek duraktır, seçili segmentte. Ok tuşları sonraki ya da önceki segmenti seçer, sondan başa döner ve seçilemeyeni atlar; sağdan sola düzende yönler değişir.
- **Ekran okuyucu.** Bir radyo düğmeleri grubu okunur: her segment etiketiyle adlandırılır, biri seçilidir.
- **Platform.** Android'de 40dp yüksekliğinde tam yuvarlak bir haptır. iOS'ta 32dp, masaüstünde 30dp, web'de 34dp yüksekliğinde, orta yuvarlak köşeli bir dikdörtgendir.
- **Kendi renkleri ve stil.** `SegmentButtonColors` izin, hapın ve seçili ile seçili olmayan etiketlerin rengini, `SegmentButtonStyle` izin şeklini, yüksekliğini ve iç boşluklarını verir. `labelStyle` etiketlerin yazısını değiştirir; renkleri segmentin durumundan gelir.
- **Yazı ölçeği.** İz stilin dediği yüksekliktedir ve çevresinde platformun dokunma hedefi kadar yer ayrılır. Sistemin yazı boyutu büyütülünce izden uzun olan etiket izi de uzatır.

## Kullanım

### A list's sort order

```kotlin
var sort by rememberSaveable { mutableStateOf(Sort.Newest) }
PantrixSegmentButton(
    options = listOf(
        SegmentOption(Sort.Newest, stringResource(Res.string.newest), tagKey = "newest"),
        SegmentOption(Sort.Cheapest, stringResource(Res.string.cheapest), tagKey = "cheapest"),
        SegmentOption(Sort.Nearest, stringResource(Res.string.nearest), tagKey = "nearest")
    ),
    selected = sort,
    onSelect = { sort = it },
    tagKey = "sort"
)
```

### In a toolbar, sized to its labels

```kotlin
PantrixSegmentButton(
    options = spans.map { SegmentOption(it, it.label, tagKey = it.name) },
    selected = span,
    onSelect = { span = it },
    fullWidth = false,
    tagKey = "span"
)
```

### With icons, and a choice that is not open yet

```kotlin
PantrixSegmentButton(
    options = listOf(
        SegmentOption("list", stringResource(Res.string.list), icon = PantrixIcons.Menu, tagKey = "list"),
        SegmentOption("map", stringResource(Res.string.map), PantrixIcons.Search, enabled = false, tagKey = "map")
    ),
    selected = view,
    onSelect = { view = it },
    tagKey = "view"
)
```

### A pill in colours of its own

```kotlin
val primary = PantrixTheme.colors.primary
PantrixSegmentButton(
    options = sorts,
    selected = sort,
    onSelect = { sort = it },
    colors = SegmentButtonColors(pill = primary.color, selectedContent = primary.onColor),
    tagKey = "sort"
)
```

## Örnekler

### Genişliği eşit paylaşan segmentler

En yalın hâli: seçenekler, seçili değer ve `onSelect`. Kontrol verilen genişliğe yayılır ve üç segment onu eşit paylaşır (`fullWidth`, varsayılan). Seçim hemen uygulanır: altındaki satır seçilenle birlikte değişir.

Seçili segmentin altındaki hap oraya kayar ve etiketi `primary` renginde yazılır. Klavyede kontrol tek bir Tab durağıdır; ok tuşları seçimi bir sonrakine ya da bir öncekine taşır.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var sort by rememberSaveable { mutableStateOf("newest") }
PantrixSegmentButton(
    options = SORTS,
    selected = sort,
    onSelect = { sort = it },
    modifier = Modifier.widthIn(max = 480.dp),
    tagKey = "sort"
)
PantrixText(
    text = "Sıralama: ${SORTS.first { it.value == sort }.label}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "sort_result"
)

private val SORTS = listOf(
    SegmentOption("newest", "En yeni", tagKey = "newest"),
    SegmentOption("cheapest", "En ucuz", tagKey = "cheapest"),
    SegmentOption("nearest", "En yakın", tagKey = "nearest")
)
```

### Etiketleri kadar geniş

`fullWidth = false` her segmenti etiketi kadar geniş yapar: bir araç çubuğunda ya da bir başlığın yanında kontrol yalnızca gerektiği kadar yer tutar. Yer hepsine yetmezse kısa etiketler bütün kalır, uzun olanlar kalanı paylaşır.

İki kontrol de böyledir: dört seçenekli bir zaman aralığı ve üç seçenekli bir platform seçimi.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var span by rememberSaveable { mutableStateOf("week") }
var platform by rememberSaveable { mutableStateOf("web") }
PantrixSegmentButton(
    options = SPANS,
    selected = span,
    onSelect = { span = it },
    fullWidth = false,
    tagKey = "span"
)
PantrixText(
    text = "Gösterilen: son ${SPANS.first { it.value == span }.label.lowercase()}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "span_result"
)
PantrixSegmentButton(
    options = PLATFORMS,
    selected = platform,
    onSelect = { platform = it },
    fullWidth = false,
    tagKey = "platform"
)

private val SPANS = listOf(
    SegmentOption("day", "Gün", tagKey = "day"),
    SegmentOption("week", "Hafta", tagKey = "week"),
    SegmentOption("month", "Ay", tagKey = "month"),
    SegmentOption("year", "Yıl", tagKey = "year")
)

private val PLATFORMS = listOf(
    SegmentOption("android", "Android", tagKey = "android"),
    SegmentOption("ios", "iOS", tagKey = "ios"),
    SegmentOption("web", "Web", tagKey = "web")
)
```

### İkonlar ve seçilemeyen bir segment

`SegmentOption(icon = …)` etiketin önüne bir ikon koyar: ikon etiketin rengindedir ve ekran okuyucu onu atlar.

"Klasörler" henüz açık değil (`enabled = false`): devre dışı renkle yazılır, basılmaz ve ok tuşları onu atlar.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.icons.PantrixIcons

var view by rememberSaveable { mutableStateOf("list") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption("list", "Liste", icon = PantrixIcons.Menu, tagKey = "list"),
        SegmentOption("search", "Ara", icon = PantrixIcons.Search, tagKey = "search"),
        SegmentOption("folders", "Klasörler", icon = PantrixIcons.Folder, enabled = false, tagKey = "folders")
    ),
    selected = view,
    onSelect = { view = it },
    modifier = Modifier.widthIn(max = 480.dp),
    tagKey = "view"
)
```

### Hiçbiri seçili değilken

`selected` hiçbir seçeneğin değeri değilse hiçbir segment seçili değildir ve hap çizilmez; null da böyle bir değerdir. Bir cevabın önceden seçilmemesi gereken yerde kullanılır.

Birine bas: hap orada belirir. Bundan sonra seçim iki segment arasında kayar; kontrol seçimi kendiliğinden kaldırmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText

var helpful by rememberSaveable { mutableStateOf<String?>(null) }
PantrixText(text = if (helpful == null) "Bu sayfa işinize yaradı mı?" else "Cevabınız kaydedildi")
PantrixSegmentButton(
    options = listOf(
        SegmentOption("yes", "Evet", tagKey = "yes"),
        SegmentOption("no", "Hayır", tagKey = "no")
    ),
    selected = helpful,
    onSelect = { helpful = it },
    fullWidth = false,
    tagKey = "helpful"
)
```

### Kendi renkleri

`colors` yalnızca verilen alanları değiştirir: burada hap uygulamanın kendi morundadır (`pill`), üstündeki etiket o morun üstünde okunan renktedir (`selectedContent`); iz ve seçili olmayan etiketler temanın renginde kalır.

Uygulamanın moru temanın hiçbir rolünde yok: böyle bir hapın üstünde okunan rengi de çağıran verir. Devre dışı bir kontrolün izi ve seçilemeyen bir segment, renk verilse de temanın renkleriyle çizilir.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentButtonColors
import com.pantrixui.components.elements.segmentbutton.SegmentOption

val own = ownColors()
var span by rememberSaveable { mutableStateOf("week") }
PantrixSegmentButton(
    options = SPANS,
    selected = span,
    onSelect = { span = it },
    modifier = Modifier.widthIn(max = 480.dp),
    colors = SegmentButtonColors(pill = own.color, selectedContent = own.onColor),
    tagKey = "span_own"
)

private val SPANS = listOf(
    SegmentOption("day", "Gün", tagKey = "day"),
    SegmentOption("week", "Hafta", tagKey = "week"),
    SegmentOption("month", "Ay", tagKey = "month"),
    SegmentOption("year", "Yıl", tagKey = "year")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Devre dışı

`enabled = false` her segmenti kapatır: iz ve etiketler devre dışı renklerle çizilir, kontrol basış ve odak almaz. Hap yerinde kalır: hangi seçeneğin seçili olduğu yine okunur.

Bu kontrolün seçenekleri ilk örnektekilerle aynıdır. Segmentler kontrolün test etiketi içinde adlandırıldığı için çakışmazlar: oradaki `SegmentButton_sort.Segment_newest`, buradaki `SegmentButton_locked.Segment_newest`'tir.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

PantrixSegmentButton(
    options = SORTS,
    selected = "newest",
    onSelect = {},
    modifier = Modifier.widthIn(max = 480.dp),
    enabled = false,
    tagKey = "locked"
)

private val SORTS = listOf(
    SegmentOption("newest", "En yeni", tagKey = "newest"),
    SegmentOption("cheapest", "En ucuz", tagKey = "cheapest"),
    SegmentOption("nearest", "En yakın", tagKey = "nearest")
)
```

### Stil

`style` tek bir kontrolün geometrisini değiştirir: izin şekli (`shape`) ve yüksekliği (`height`), izin kenarıyla hap arasındaki boşluk (`trackPadding`), etiketin iki yanındaki boşluk (`segmentPadding`). Yalnızca verilen alanlar değişir; gerisi temanın ve platformun stilinden gelir.

Hapın kendi şekli yoktur: izin şeklidir, her köşesi `trackPadding` kadar küçültülmüş. Böylece ikisinin köşeleri aynı merkezin çevresinde döner.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentButtonStyle
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.token.shape.ShapeRole

var size by rememberSaveable { mutableStateOf("m") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption("s", "Küçük", tagKey = "s"),
        SegmentOption("m", "Orta", tagKey = "m"),
        SegmentOption("l", "Büyük", tagKey = "l")
    ),
    selected = size,
    onSelect = { size = it },
    fullWidth = false,
    style = SegmentButtonStyle(
        shape = ShapeRole.Small,
        height = 48.dp,
        trackPadding = 6.dp,
        segmentPadding = 20.dp
    ),
    tagKey = "size"
)
```

### Kendi yazısıyla

Dar bir sütunda kendi yazısıyla: üç seçenek temanın `footnote` yazısıyla (`labelStyle`) sığar. Yazının rengi segmentindir: seçili olanınki ana renk, ötekilerinki sessiz.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var mode by rememberSaveable { mutableStateOf("auto") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption("light", "Açık", tagKey = "light"),
        SegmentOption("dark", "Koyu", tagKey = "dark"),
        SegmentOption("auto", "Sistem", tagKey = "auto")
    ),
    selected = mode,
    onSelect = { mode = it },
    modifier = Modifier.widthIn(max = 220.dp),
    tagKey = "mode",
    labelStyle = PantrixTheme.typography.footnote
)
```

## API

### PantrixSegmentButton

`import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixSegmentButton(
    options: List<SegmentOption<T>>,
    selected: T?,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    fullWidth: Boolean = true,
    style: SegmentButtonStyle? = null,
    colors: SegmentButtonColors? = null,
    tagKey: String? = null,
    labelStyle: TextStyle = PantrixTheme.typography.label
)
```

Bir segment düğmesi: tek bir kontrolde yan yana duran birkaç seçenek, biri seçili.

Tek bir kontrol olarak çizilmiş bir radyo grubudur. Ekran okuyucu, biri seçili olan bir radyo düğmeleri grubu duyar. Bir seçim, çevresindeki ekranı hemen değiştirir: bir listenin sırasını, bir grafiğin aralığını, bir haritanın katmanını. Seçili segmente bir hap kayar ve segmentin etiketi primary rengini alır. Zaten seçili olan segmenti seçmek bir şey yapmaz.

Kontrol Tab için tek duraktır, seçili segmentte. Ok tuşları sonraki ya da önceki segmenti seçer, sağdan sola düzende yönler değişir. Sondan başa dönerler ve seçilemeyen bir segmenti atlarlar. Basışın odağı taşıyabildiği yerde bir basış odağı kontrole götürür.

İz stilin dediği yüksekliktedir ve çevresinde platformun dokunma hedefi kadar yer ayrılır. Büyük bir yazı ölçeğinde izden büyük yazılan etiket izi yükseltir. Bir iki sözcüklük, iki ila beş seçenek için kullanılır: daha çok ya da daha uzun seçenek için radyo grubu, bir seçim değil de işler için düğmeler kullanılır.

Parametreler:

- `options: List<SegmentOption<T>>`: Seçenekler, sırasıyla. Boş bir liste hiçbir şey çizmez.
- `selected: T?`: Seçili segmentin değeri. Her seçeneğin değeriyle `==` ile karşılaştırılır. Hiçbir seçeneğin taşımadığı bir değer, null da böyledir, hiçbirini seçmez: hiçbir segment seçili olmaz ve hap çizilmez.
- `onSelect: (T) -> Unit`: Kullanıcının bir basışla ya da bir tuşla seçtiği segmentin değeriyle çağrılır, o segment zaten seçili değilse. Kontrol kendiliğinden bir şey seçmez: `selected` hangi değeri söylüyorsa o segment seçilidir.
- `modifier: Modifier`: Kontrolün modifier'ı. Kontrolün ayırdığı dokunma hedefinin dışına uygulanır.
- `enabled: Boolean`: False verilirse her segment devre dışı kalır. Hap yerinde kalır ki seçim yine okunsun.
- `fullWidth: Boolean`: True verilirse kontrol kendisine verilen genişliğe yayılır ve her segment eşit pay alır: böylece etiketler başka bir dilde ne derse desin segmentler yerinde kalır. False her segmenti etiketi kadar geniş yapar. Buna yetmeyecek kadar dar bir yerde kısa etiketler bütün kalır, uzun olanlar kalanı paylaşır.
- `style: SegmentButtonStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: SegmentButtonColors?`: Bu kontrolün kendi renkleri: verdiği renkler kullanılır, gerisi temanınkilerdir. Devre dışı bir kontrolün izi ve seçilemeyen bir segment temanın renklerinde kalır.
- `tagKey: String?`: Kontrolün otomasyon anahtarı: kontrol `SegmentButton_<tagKey>`'dir ve segmentleri onun içinde adlandırılır, `SegmentButton_<tagKey>.Segment_<key>`. Böylece seçenekleri aynı olan iki kontrol birbirinden ayırt edilir. Bir seçim `SegmentButton` olayı olarak bildirilir: `select`. Olay segmentin anahtarını, anahtarı yoksa sırasını taşır, etiketini hiçbir zaman taşımaz.
- `labelStyle: TextStyle`: etiketlerin yazı stili: verilmezse temanın `label` stili. İzden büyük yazılan bir etiket, büyük bir yazı ölçeğinin yaptığı gibi izi uzatır.

### SegmentOption

`import com.pantrixui.components.elements.segmentbutton.SegmentOption`, `com.pantrixui:components` içinden

```kotlin
class SegmentOption<out T>(
    public val value: T,
    public val label: String,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

`PantrixSegmentButton`'ın bir seçeneği: karşılık geldiği değer, etiketi, etiketin önündeki ikon ve otomasyon için bir anahtar.

Parametreler:

- `value: T`: Segment seçilince kontrolün `onSelect`'ine verdiği ve `selected`'ıyla `==` ile karşılaştırdığı değer.
- `label: String`: Görünen metin ve ekran okuyucu için segmentin adı.
- `icon: ImageVector?`: Etiketin önüne, etiketin renginde çizilir. İkon olmayacaksa null verilir. Ekran okuyucu onu atlar.
- `enabled: Boolean`: Segmentin seçilip seçilemeyeceği. Seçilemeyen bir segmente basmak bir şey yapmaz ve ok tuşları onu atlar.
- `tagKey: String?`: Segmentin her dilde aynı olan otomasyon anahtarı: segment `Segment_<tagKey>`'dir, anahtar verilmezse `Segment_<index>`. Anahtarı olan bir kontrolün etiketinin içinde durur: `SegmentButton_sort.Segment_newest`.

### SegmentButtonStyle

`import com.pantrixui.components.elements.segmentbutton.SegmentButtonStyle`, `com.pantrixui:components` içinden

```kotlin
class SegmentButtonStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val trackPadding: Dp = Dp.Unspecified,
    public val segmentPadding: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<SegmentButtonStyle>
```

`PantrixSegmentButton`'ın geometrisi: iz, içinde kayan hap ve her segmentin etiketine ayırdığı yer.

Hapın kendi şekli yoktur: izin şeklidir, her köşesi `trackPadding` kadar küçültülmüş. Böylece ikisinin köşeleri, her markanın şekil ölçeğinde aynı merkezlerin çevresinde döner. İz kadar yuvarlak bir hap, içinde durduğu yerden daha yuvarlak görünürdü.

Android'de kontrol Material 3'ün segmented button'ıdır: 40dp yüksekliğinde ve bütünüyle bir hap. iOS'ta `UISegmentedControl`'dur: 32pt yüksekliğinde, hapı kenarına yakın duran yuvarlak köşeli bir dikdörtgen. Masaüstününki imleç için daha alçaktır, 30dp; web'inki 34dp'dir.

İkonun boyutu düğmelerinkine uyar: hapın küçük bir düğme kadar yüksek olduğu Android'de 20dp, öteki platformların daha alçak haplarında 18dp. Bu, küçük bir düğmenin ikonuyla çok küçük bir düğmenin ikonu arasındadır.

Yükseklik, iki iç boşluk ve aralık yoğunlukla ölçeklenir, çünkü bunlar etiketlerin çevresindeki yerdir. İkonun boyutu ve şekil ölçeklenmez.

Parametreler:

- `shape: ShapeSpec`: İzin şekli: markanın şekil ölçeğinin bir adımı ya da sabit bir şekil.
- `height: Dp`: İzin yüksekliği. Büyük bir yazı ölçeğinde bu yüksekliğe sığmayan etiket izi yükseltir.
- `trackPadding: Dp`: İzin kenarıyla hap arasındaki boşluk.
- `segmentPadding: Dp`: Bir segmentin etiketinin iki yanındaki boşluk.
- `iconGap: Dp`: Bir segmentin ikonuyla etiketi arasındaki aralık.
- `iconSize: Dp`: Bir segmentin ikonunun genişliği ve yüksekliği.

### SegmentButtonColors

`import com.pantrixui.components.elements.segmentbutton.SegmentButtonColors`, `com.pantrixui:components` içinden

```kotlin
data class SegmentButtonColors(
    public val track: Color = Color.Unspecified,
    public val pill: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val unselectedContent: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir kontrol için `PantrixSegmentButton`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temanın rolünde kalır.

```kotlin
PantrixSegmentButton(
    options = sorts,
    selected = sort,
    onSelect = { sort = it },
    colors = SegmentButtonColors(pill = brand, selectedContent = onBrand)
)
```

Bunlar seçilebilen segmentlerin renkleridir. Devre dışı bir kontrolün izi ve seçilemeyen bir segment, burada ne verilirse verilsin, temanın devre dışı rolleriyle çizilir. Hap rengini korur ki seçim yine okunsun.

Burada verilen dolgu temanın kendi renklerinden biriyse, üstüne çizilenlerin rengi de ayrıca verilmediği sürece, temanın o dolguyla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `track: Color`: Segmentlerin üstünde durduğu iz. Neutral rolünün `container`'ı.
- `pill: Color`: Seçili segmentin altındaki hap. Temanın `surface` rengi.
- `selectedContent: Color`: Seçili segmentin etiketi ve ikonu: `pill`'in üstünde okunan renk. Temanın `primary` rengi.
- `unselectedContent: Color`: Öteki segmentlerin etiketi ve ikonu: `track`'in üstünde okunan renk. Temanın `textSecondary` rengi.

# Gauge

Bir ölçekte tek bir değer: bir yayın ne kadarını doldurduğuyla okunur. Bir hız, bir yük, bir kotanın kullanılan payı: en azına ve en çoğuna göre okunan bir ölçüm.

Ölçek, turun dörtte üçü boyunca saat yönünde döner: sol altta `min`, sağ altta `max`; ikisi de uçların altına yazılır. Değer, yayı ölçeğin başından kendisine kadar doldurur ve göstergenin ortasına yazılır.

- `PantrixGauge` (`com.pantrixui.components.chart.gauge`, `com.pantrixui:components`): Bir ölçekte tek bir okuma, ona kadar dolan bir yay ya da onu gösteren bir ibre olarak: ölçeğin kendi renklerindeki aralıkları ve ekran okuyucuya bulunduğu aralıkla söylenen okuma. Anahtar sözcükler: gösterge, kadran, ölçer, hız göstergesi, kpi, ibre, yay.

## Özellikler

- **Ölçek.** `min` ve `max` ölçeğin uçlarıdır. Ucu aşan değer o uçta durur ve olduğu gibi yazılır. Değeri olmayan gösterge (`null`) yalnızca ölçeğini gösterir.
- **Aralıklar.** `segments`, ölçeğin parçalarına bir renk ve bir ad verir: iyi olan aralık, fazla olan aralık. Her `GaugeSegment` nerede bittiğini söyler (`upTo`); ilki ölçeğin başından başlar, ötekiler bir öncekinin bittiği yerden. Yay, değerin ulaştığı aralığın rengiyle dolar; aralıkların kendisi soluk renkleriyle altında durur.
- **İbre.** `needle` ile ortadan değere bir ibre uzanır ve değer ibrenin altına yazılır. Hem ibresi hem aralıkları olan göstergede aralıklar tam renkleriyle çizilir ve yay dolmaz: ibre onlara göre okunur.
- **Yazım.** `format` değerin ve ölçeğin iki ucunun nasıl yazılacağını söyler; verilmezse temanın diliyle sayı olarak yazılırlar. `center` değerin yazısının yerine kendi içeriğini koyar.
- **Ekran okuyucu.** Gösterge tek bir şeydir: `description`'ı, ardından yazıldığı gibi değer ve, adı varsa, içinde olduğu aralığın adı.
- **Boyut ve hareket.** Gösterge verilen yer kadar geniş, grafik stilinin söylediği kadar yüksektir; yay bu yere sığan en büyük yaydır. Değer değişince yay ve ibre yeni değere gider; sistem azaltılmış hareket istiyorsa gitmez, orada olur.
- **Yön.** Ölçek sağdan sola okunan dilde de aynı yöne döner.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `Gauge_<tagKey>`.

## Kullanım

### A reading on a scale

```kotlin
PantrixGauge(
    value = usedGigabytes,
    max = 50,
    format = { "${it.toInt()} GB" },
    description = stringResource(Res.string.storage_used),
    tagKey = "storage"
)
```

### A needle read against ranges

```kotlin
PantrixGauge(
    value = load,
    segments = listOf(
        GaugeSegment(upTo = 60, name = normal),
        GaugeSegment(upTo = 85, name = high),
        GaugeSegment(upTo = 100, name = critical)
    ),
    needle = true,
    description = stringResource(Res.string.processor_load),
    tagKey = "load"
)
```

## Örnekler

### Bir ölçekte bir değer

En yalın hâli: bir değer ve ölçeğin sonu. Elli gigabaytlık bir depolamanın otuz ikisi dolu; `format` değeri ve ölçeğin iki ucunu birimiyle yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.PantrixGauge

PantrixGauge(
    value = 32,
    max = 50,
    format = { "${it.toInt()} GB" },
    description = "Kullanılan depolama",
    tagKey = "plain"
)
```

### Aralıklar

Ölçeğin üç aralığı var: altmışa kadar olağan, seksen beşe kadar yüksek, ondan sonra kritik. Yay, değerin ulaştığı aralığın rengiyle dolar; aralıklar soluk renkleriyle altında görünür.

Bir değer seç: yay oraya gider ve rengi ulaştığı aralığa göre değişir. Ekran okuyucu değerden sonra aralığın adını da söyler: "%72, Yüksek". Değeri `format` temanın diliyle yazıyor (`PantrixTheme.strings.percent`).

Aralıklar burada renklerini kendileri söylüyor: temanın başarı, uyarı ve tehlike renkleri. Rengi verilmeyen aralık temanın sıradaki grafik rengini alır; o renkler bir anlam taşımaz.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.GaugeSegment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var load by remember { mutableStateOf(72) }
val strings = PantrixTheme.strings
PantrixSegmentButton(
    options = loadReadings(),
    selected = load,
    onSelect = { load = it },
    fullWidth = false,
    tagKey = "gauge_load"
)
PantrixGauge(
    value = load,
    segments = loadRanges(),
    format = { strings.percent(it / 100) },
    description = "İşlemci yükü",
    tagKey = "segments"
)

@Composable
private fun loadRanges(): List<GaugeSegment> {
    val colors = PantrixTheme.colors
    return listOf(
        GaugeSegment(upTo = 60, color = colors.success.color, name = "Olağan"),
        GaugeSegment(upTo = 85, color = colors.warning.color, name = "Yüksek"),
        GaugeSegment(upTo = 100, color = colors.danger.color, name = "Kritik")
    )
}

@Composable
private fun loadReadings(): List<SegmentOption<Int>> {
    val strings = PantrixTheme.strings
    return listOf(40 to "low", 72 to "high", 93 to "critical").map { (load, key) ->
        SegmentOption(value = load, label = strings.percent(load / 100.0), tagKey = key)
    }
}
```

### İbre

İbreli gösterge: ortadan değere bir ibre uzanır, değer ibrenin altına yazılır. Aralıklar tam renkleriyle çizilir ve yay dolmaz: ibre onlara göre okunur.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.GaugeSegment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.foundation.theme.PantrixTheme

var load by remember { mutableStateOf(40) }
val strings = PantrixTheme.strings
PantrixSegmentButton(
    options = loadReadings(),
    selected = load,
    onSelect = { load = it },
    fullWidth = false,
    tagKey = "gauge_needle_load"
)
PantrixGauge(
    value = load,
    segments = loadRanges(),
    needle = true,
    format = { strings.percent(it / 100) },
    description = "İşlemci yükü",
    tagKey = "needle"
)

@Composable
private fun loadRanges(): List<GaugeSegment> {
    val colors = PantrixTheme.colors
    return listOf(
        GaugeSegment(upTo = 60, color = colors.success.color, name = "Olağan"),
        GaugeSegment(upTo = 85, color = colors.warning.color, name = "Yüksek"),
        GaugeSegment(upTo = 100, color = colors.danger.color, name = "Kritik")
    )
}

@Composable
private fun loadReadings(): List<SegmentOption<Int>> {
    val strings = PantrixTheme.strings
    return listOf(40 to "low", 72 to "high", 93 to "critical").map { (load, key) ->
        SegmentOption(value = load, label = strings.percent(load / 100.0), tagKey = key)
    }
}
```

### Sıfırdan başlamayan ölçek

Aralıksız, ibreli bir gösterge: yay değere kadar dolar ve ibre de değeri gösterir. Ölçek sıfırdan başlamak zorunda değildir: bu termometre eksi yirmiden kırka gider.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixGauge(
    value = 7.5,
    min = -20,
    max = 40,
    needle = true,
    format = { "${strings.decimal(it, fractionDigits = 1)}°" },
    description = "Dış sıcaklık",
    tagKey = "below_zero"
)
```

### Ortada kendi içeriğin

`center`, değerin yazısının yerine kendi içeriğini koyar: burada değerin altında birimi. İçerik, yayın ortasında bıraktığı yere sığar.

Ekran okuyucu değeri göstergenin kendisinden duyar (`description` ve `format`); ortadaki yazılar gözün içindir.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixGauge(
    value = 86,
    max = 120,
    format = { "${it.toInt()} km/sa" },
    center = {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            PantrixText(text = "86", style = PantrixTheme.typography.headline)
            PantrixText(text = "km/sa", color = PantrixTheme.colors.textSecondary)
        }
    },
    description = "Hız",
    tagKey = "own_center"
)
```

### Kendi ölçülerin

Bir göstergenin kendi ölçüleri: yay daha ince (`gaugeWidth`) ve gösterge daha alçak (`height`). Aralıkların arası kapalı (`sliceGap`). Verilmeyen alan temanınki kalır.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.gauge.GaugeSegment
import com.pantrixui.components.chart.gauge.PantrixGauge
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixGauge(
    value = 54,
    segments = loadRanges(),
    format = { strings.percent(it / 100) },
    description = "İşlemci yükü",
    style = ChartStyle(gaugeWidth = 8.dp, height = 160.dp, sliceGap = 0.dp),
    tagKey = "own_look"
)

@Composable
private fun loadRanges(): List<GaugeSegment> {
    val colors = PantrixTheme.colors
    return listOf(
        GaugeSegment(upTo = 60, color = colors.success.color, name = "Olağan"),
        GaugeSegment(upTo = 85, color = colors.warning.color, name = "Yüksek"),
        GaugeSegment(upTo = 100, color = colors.danger.color, name = "Kritik")
    )
}
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Ortadaki değer dosyada da yazılıdır; ortaya `center` ile konan bir içerik ise dosyaya çıkmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.gauge.PantrixGauge

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixGauge(
    value = 32,
    max = 50,
    format = { "${it.toInt()} GB" },
    description = "Kullanılan depolama",
    tagKey = "exported",
    export = ChartExport(fileName = "depolama") { file = it }
)
ExportedFile(file, tagKey = "exported")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixGauge

`import com.pantrixui.components.chart.gauge.PantrixGauge`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixGauge(
    value: Number?,
    modifier: Modifier = Modifier,
    min: Number = 0,
    max: Number = 100,
    segments: List<GaugeSegment> = emptyList(),
    needle: Boolean = false,
    format: ((Double) -> String)? = null,
    center: (@Composable () -> Unit)? = null,
    description: String? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

Bir gösterge: bir ölçekte tek bir değer, bir yayın ne kadarını dolandığıyla. Bir hız, bir yük, bir kotanın payı: olabileceği en aza ve en çoğa göre okunan bir değer.

Ölçek, turun dörtte üçü boyunca saat yönünde döner: sol altta `min`'den sağ altta `max`'e; ikisi de uçlarının altına yazılır. `value`, yayı ölçeğin başından kendisine kadar doldurur ve göstergenin ortasına yazılır; ölçeğin bir ucunu aşan değer o uçta durur ve olduğu gibi yazılır.

**Aralıklar.** `segments`, ölçeğin parçalarına bir renk ve bir ad verir: iyi olan aralık, fazla olan aralık. Yay o zaman değerin ulaştığı aralığın rengiyle çizilir; aralıkların kendisi, kendi renklerinin soluk bir tonuyla altında durur.

**İbre.** `needle` ile göstergenin ortasından değere, bir kadrandaki gibi, bir ibre uzanır ve değer onun altına, yayın iki ucunun arasına yazılır. Hem ibresi hem aralıkları olan gösterge aralıkları tam renkleriyle gösterir ve yayı doldurmaz: ibre onlara göre okunur.

**Ekran okuyucu için** gösterge tek bir şeydir: `description`'ı, sonra yazıldığı gibi değer ve, aralığın adı varsa, içinde olduğu aralığın adı.

**Boyutu.** Gösterge kendisine verilen yer kadar geniştir ve, modifier'ı bir yükseklik vermedikçe, grafiğin stilinin söylediği kadar yüksektir; yay bu yere sığan en büyük yaydır ve yerin ortasındadır. Değerdeki bir değişiklik yayı ve ibreyi ona götürür; sistem azaltılmış hareket istiyorsa götürmez.

Ölçek sağdan okunan bir dilde de aynı yöne döner: bir kadran bir yazı satırı değildir.

```kotlin
PantrixGauge(
    value = 72,
    segments = listOf(
        GaugeSegment(upTo = 60, name = "Normal"),
        GaugeSegment(upTo = 85, name = "High"),
        GaugeSegment(upTo = 100, name = "Critical")
    ),
    format = { "${it.toInt()}%" },
    description = "Processor load",
    tagKey = "load"
)
```

Parametreler:

- `value: Number?`: ölçüm. `null` ve sayı olmayan şey ölçüm değildir: gösterge ölçeğini gösterir, üstünde hiçbir şey göstermez.
- `modifier: Modifier`: göstergenin modifier'ı. Buradaki bir yükseklik göstergenindir.
- `min: Number`: ölçeğin başladığı yer.
- `max: Number`: ölçeğin bittiği yer: `min`'den büyük.
- `segments: List<GaugeSegment>`: ölçeğin bir rengi ve bir adı olan parçaları, ölçek boyunca durdukları sırayla; her biri bir öncekinin bittiği yerden ötede biter. Hiç yoksa yay grafiğin renklerinin ilkiyle çizilir.
- `needle: Boolean`: değeri bir ibrenin gösterip göstermediği.
- `format: ((Double) -> String)?`: bir değerin nasıl yazıldığı: ölçüm ve ölçeğin iki ucu. Verilmezse temanın diliyle sayı olarak yazılırlar.
- `center: (@Composable () -> Unit)?`: göstergede, yazıldığı hâliyle ölçümün yerinde duran: altında birimiyle ölçüm, bir ikon. Yayın ortasında bıraktığı yer onundur; göstergenin ibresi varsa yayın iki ucunun arasındaki yer.
- `description: String?`: göstergenin neyi ölçtüğü, birkaç sözcükle, ekran okuyucu için: gösterge hakkında söylediği ilk şey.
- `style: ChartStyle?`: bu göstergenin kendi geometrisi: burada verilen alanlar, gerisi temanınkiyle.
- `colors: ChartColors?`: bu göstergenin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: göstergenin otomasyon anahtarı: gösterge `Gauge_<tagKey>` olur.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur. Ortada duran, `center`, dosyada yoktur; göstergenin oraya kendi yazdığı değer vardır.

### GaugeSegment

`import com.pantrixui.components.chart.gauge.GaugeSegment`, `com.pantrixui:components` içinden

```kotlin
class GaugeSegment(
    public val upTo: Number,
    public val color: Color = Color.Unspecified,
    public val name: String? = null,
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixGauge`'ın ölçeğinin, kendi rengi ve adı olan bir parçası: ölçümün iyi olduğu aralık, yüksek olduğu aralık.

```kotlin
GaugeSegment(upTo = 60, name = "Normal")
```

Bir göstergenin aralıkları, ölçeği boyunca durdukları sırayla verilir: ilki ölçeğin başladığı yerden başlar, ötekilerin her biri bir öncekinin bittiği yerden.

Kuruldukları her şey aynı olan iki aralık aynı aralıktır; bir tam sayı ile kesri sıfır olan aynı sayı tek bir değerdir.

Parametreler:

- `upTo: Number`: Aralığın bittiği yer: bu değere kadar olan ölçüm, değerin kendisi de içinde, aralığındır.
- `color: Color`: Aralığın çizildiği renk. Verilmezse, göstergenin aralıkları arasındaki yerine düşen tema grafik rengidir.
- `name: String?`: Aralıktaki bir ölçümün adı; ekran okuyucu ölçümden sonra söyler: "Olağan", "Yüksek". Verilmezse ölçüm tek başına söylenir.
- `pattern: ChartPattern?`: Bölümün, ve dolu yay o bölüme ulaştığı sürece yayın, renginin yanında çizildiği desen. Verilmezse hiçbiri; ölçerin desenleri açıksa (`ChartStyle.patterns`), bölümler arasındaki yerine göre sırasındaki desen: ilkinin hiçbiri.

### ChartStyle

`import com.pantrixui.components.chart.common.ChartStyle`, `com.pantrixui:components` içinden

```kotlin
class ChartStyle(
    public val height: Dp = Dp.Unspecified,
    public val lineWidth: Dp = Dp.Unspecified,
    public val markerSize: Dp = Dp.Unspecified,
    public val selectedMarkerSize: Dp = Dp.Unspecified,
    public val gridWidth: Dp = Dp.Unspecified,
    public val labelGap: Dp = Dp.Unspecified,
    public val tickSpacing: Dp = Dp.Unspecified,
    public val legendGap: Dp = Dp.Unspecified,
    public val legendItemGap: Dp = Dp.Unspecified,
    public val swatchSize: Dp = Dp.Unspecified,
    public val swatchGap: Dp = Dp.Unspecified,
    public val tooltipShape: ShapeSpec = ShapeSpec.Unspecified,
    public val tooltipHorizontalPadding: Dp = Dp.Unspecified,
    public val tooltipVerticalPadding: Dp = Dp.Unspecified,
    public val tooltipGap: Dp = Dp.Unspecified,
    public val tooltipElevation: Dp = Dp.Unspecified,
    public val barGap: Dp = Dp.Unspecified,
    public val barMaxWidth: Dp = Dp.Unspecified,
    public val barRadius: Dp = Dp.Unspecified,
    public val sliceGap: Dp = Dp.Unspecified,
    public val selectedSliceOffset: Dp = Dp.Unspecified,
    public val gaugeWidth: Dp = Dp.Unspecified,
    public val meterHeight: Dp = Dp.Unspecified,
    public val trackerHeight: Dp = Dp.Unspecified,
    public val bubbleMinSize: Dp = Dp.Unspecified,
    public val bubbleMaxSize: Dp = Dp.Unspecified,
    public val navigatorHeight: Dp = Dp.Unspecified,
    public val barBandShare: Float = Float.NaN,
    public val markLineWidth: Dp = Dp.Unspecified,
    public val markBandAlpha: Float = Float.NaN,
    public val patterns: Boolean? = null,
    public val nodeWidth: Dp = Dp.Unspecified,
    public val nodeGap: Dp = Dp.Unspecified
) : PantrixStyle<ChartStyle>
```

Bir grafiğin geometrisi: hiçbir şey söylemediğinde ne kadar yüksek olduğu, çizgilerinin ne kadar kalın, işaretlerinin ne kadar büyük olduğu ve parçalarının arasındaki boşluk; ve dolgularının renklerinin yanında desen alıp almadığı.

Bir grafik telefonda çevresindekilere yer bırakacak kadar yüksektir, yeri bol bir pencerede daha yüksek. Parmağın altında değerlerinin çizgileri, imlecin altındakinden biraz daha aralıklı durur.

Parçaların arasındaki boşluklar yoğunlukla ölçeklenir, çubukların ve dilimlerin arasındakiler de. Yükseklik, çizgilerin kalınlıkları, işaretlerin ve balonların boyutları, bir çubuğun genişliği ile köşeleri, gösterilen dilimin ne kadar dışarı taştığı, bir göstergenin yayının kalınlığı, bir ölçüm grubunun çubuğunun, bir durum izleyicinin bloklarının ve bir gezgin şeridinin yüksekliği ve tooltip'in köşeleriyle gölgesi ölçeklenmez: bir grafiğin çizgileri sık bir düzende de ferah bir düzende de aynı kalınlıktadır.

Parametreler:

- `height: Dp`: Grafiğin modifier'ı ona bir yükseklik vermediğinde çizim alanının, eksenleriyle birlikte, ne kadar yüksek olduğu. Çizim alanının üstündeki ya da altındaki bir lejant kendi yüksekliğini ekler.
- `lineWidth: Dp`: Bir serinin çizgisinin kalınlığı.
- `markerSize: Dp`: Bir noktadaki işaretin genişliği ve yüksekliği.
- `selectedMarkerSize: Dp`: Aynısı, gösterilen noktadaki işaret için.
- `gridWidth: Dp`: Kılavuz çizgilerinin, eksenler boyunca çizilen çizgilerin ve gösterilen yeri işaretleyen çizginin kalınlığı. Sıfır hiçbirini çizmez.
- `labelGap: Dp`: Çizim alanıyla yanına ve altına yazılanın arası, ve onunla bir eksenin başlığının arası.
- `tickSpacing: Dp`: Değerlerin ekseni boyunca işaretlenen iki değerin arasındaki en az boşluk: eksen söylemediğinde kaç tanesinin işaretleneceğine karar veren şey.
- `legendGap: Dp`: Lejantla yanında durduğu grafiğin arası.
- `legendItemGap: Dp`: Lejantın bir kaydıyla sonrakinin arası.
- `swatchSize: Dp`: Bir serinin lejanttaki ve tooltip'teki örneğinin ne kadar geniş olduğu: çizgisinin kısa bir parçası ya da dolgusunun bir yaması.
- `swatchGap: Dp`: O örnekle ardındaki adın arası.
- `tooltipShape: ShapeSpec`: Tooltip'in köşeleri: markanın şekil ölçeğinin bir basamağı ya da sabit bir şekil.
- `tooltipHorizontalPadding: Dp`: Tooltip'in yanlarıyla içindekinin arası.
- `tooltipVerticalPadding: Dp`: Üstü ve altıyla içindekinin arası, ve başlığıyla satırlarının arası.
- `tooltipGap: Dp`: Gösterilen yerle yanındaki tooltip'in arası.
- `tooltipElevation: Dp`: Tooltip'in gölgesi.
- `barGap: Dp`: Bir yerde yan yana duran iki çubuğun arası. Bunun için fazla ince olan çubuklar daha yakın durur.
- `barMaxWidth: Dp`: Bir çubuğun en fazla ne kadar geniş olduğu, yerinin ne kadar yeri olursa olsun: üç yerli bir grafik üç kalas değildir.
- `barRadius: Dp`: Bir çubuğun ucunun, sıfırdan uzak ucunun, köşelerinin ne kadar yuvarlak olduğu.
- `sliceGap: Dp`: Bir pastanın yan yana duran iki dilimi arasında; pastanın ortasından kenarına kadar aynı genişlikte.
- `selectedSliceOffset: Dp`: Bir pastanın gösterilen diliminin, pastanın kenarından ne kadar dışarı taştığı. Pasta çevresinde bu kadar yer bırakır: dilimin duracağı yer olsun.
- `gaugeWidth: Dp`: Bir göstergenin yayının kalınlığı. Bir yay, yarıçapının yarısından kalın olmaz.
- `meterHeight: Dp`: Bir ölçüm grubunun çubuğunun yüksekliği.
- `trackerHeight: Dp`: Bir durum izleyicinin bloklarının yüksekliği.
- `bubbleMinSize: Dp`: Bir saçılım grafiğinin en küçük balonunun genişliği: büyüklüğü hiç olmayan ya da bir alan olarak görülemeyecek kadar az olan nokta da bir noktadır.
- `bubbleMaxSize: Dp`: En büyük balonunun genişliği: büyüklüğü grafiğin en büyüğü olanın.
- `navigatorHeight: Dp`: Zoom'unda gezgin şeridi olan bir grafikte, çizim alanının altındaki şeridin yüksekliği: grafiğin görünen kısmı onun üstünde işaretlenir ve kaydırılır. Yerleri yanından aşağı dizilen grafikte şerit çizim alanının yanında durur ve bu onun genişliğidir.
- `barBandShare: Float`: Bir yerin çubuklarının bandından aldığı pay, sıfırdan çok ve en fazla bir: kalanı bir yerin çubuklarıyla sonrakininkiler arasındaki boşluktur. Çubuklar yine de `barMaxWidth`'ten geniş olmaz.
- `markLineWidth: Dp`: Bir işaretin çizgisinin kalınlığı: bir hedefin, bir sınırın, bir günün. Sıfır çizgi çizmez; işaretin yazısı yine yazılır.
- `markBandAlpha: Float`: Bir işaretin bandının renginin ne kadarıyla çizildiği, sıfırdan bire: bant serilerin arkasında durur ve bir tondur.
- `patterns: Boolean?`: Bir grafiğin serilerinin, dilimlerinin ve karolarının dolgularının renklerinin yanında desenlerle, çizgilerinin de sırayla kesik çizilip çizilmediği (`ChartPattern`): renkleri ayırt edemeyen bir okuyucu için onları ayıran şey. Verilmezse sistemin ayarına uyulur: sistem şeyleri renksiz ayırt etmeye ayarlıysa açık (iOS'ta "Differentiate Without Color", Android'de renk düzeltme), değilse kapalı.
- `nodeWidth: Dp`: Bir sankey düğümünün ne kadar geniş olduğu.
- `nodeGap: Dp`: Bir sankey kolonunun iki düğümü arası.

### ChartColors

`import com.pantrixui.components.chart.common.ChartColors`, `com.pantrixui:components` içinden

```kotlin
data class ChartColors(
    public val series: List<Color> = emptyList(),
    public val grid: Color = Color.Unspecified,
    public val axis: Color = Color.Unspecified,
    public val label: Color = Color.Unspecified,
    public val crosshair: Color = Color.Unspecified,
    public val tooltipContainer: Color = Color.Unspecified,
    public val tooltipBorder: Color = Color.Unspecified,
    public val tooltipText: Color = Color.Unspecified,
    public val tooltipLabel: Color = Color.Unspecified,
    public val rising: Color = Color.Unspecified,
    public val falling: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir grafik için, onun neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// A chart in the brand's two colours, whatever the theme's chart colours are:
PantrixChart(series = series, colors = ChartColors(series = listOf(brand, accent)))
```

Bir grafiğin kendi dolgusu yoktur: üstünde durduğu şeyin üstüne çizilir. Temanın kendi zeminlerinde çizgileri ve yazıları temanındır. Üstünde durana bir renk veren bir dolguda temanınkilerin okunacağı bilinmez: yazılar o renkle yazılır, çizgiler onun bir payıyla çizilir. Serilerin renkleri, grafik nerede dursa da verildikleri gibi çizilir; bir dolguda hangilerinin okunduğunu bilen çağırandır.

Parametreler:

- `series: List<Color>`: Serilerin çizildiği renkler, dağıtıldıkları sırayla, kendi rengini söylemeyen seriler için. Boşsa temanın grafik renkleridir.
- `grid: Color`: Bir eksenin işaretlerinde grafik boyunca çizilen çizgiler. Temanın `divider`'ı.
- `axis: Color`: Bir eksen boyunca çizilen çizgi. Temanın `border`'ı.
- `label: Color`: Eksenlerin yanına yazılanlar: değerler, yerler ve eksenlerin başlıkları, bir de lejanttaki adlar. Temanın `textSecondary`'si.
- `crosshair: Color`: Gösterilen yeri işaretleyen çizgi. Temanın `borderHover`'ı: içinden geçtiği kılavuz çizgilerinden güçlü, arkasında durduğu serilerden sessiz.
- `tooltipContainer: Color`: Tooltip'in dolgusu. Temanın `surface`'i.
- `tooltipBorder: Color`: Tooltip'in kenarı. Temanın `border`'ı.
- `tooltipText: Color`: Tooltip'in başlığı ve değerleri. Temanın `textPrimary`'si.
- `tooltipLabel: Color`: Tooltip'teki seri adları. Temanın `textSecondary`'si.
- `rising: Color`: Yukarı giden bir değerin çizildiği renk: bir şelalenin ekleyen adımı. Temanın `success`'i.
- `falling: Color`: Aşağı giden bir değerin çizildiği renk: bir şelalenin götüren adımı. Temanın `danger`'ı.

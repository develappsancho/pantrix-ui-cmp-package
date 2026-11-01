# Meter Group

Bir bütünün birkaç miktarı, tek bir çubukta yan yana: bir depolamanın neyle dolduğu, bir bütçenin nereye gittiği. Parçalar birbirine ve kalana göre okunur.

Çubuk `max` kadar uzundur. Her `MeterItem` çubuktan değeri kadar yer alır; parçalar satırın başından sırayla dizilir ve her biri, kendi rengini söylemedikçe, temanın sıradaki grafik rengiyle çizilir. Hiçbir parçanın almadığı yer çubuğun izini gösterir.

- `PantrixMeterGroup` (`com.pantrixui.components.chart.metergroup`, `com.pantrixui:components`): Tek bir bütünün birkaç miktarı, tek bir çubukta yan yana; her miktarı renginin yanına yazan bir lejantla. Anahtar sözcükler: yığılmış ilerleme, kullanım çubuğu, depolama çubuğu, bölümlü çubuk, kota.

## Özellikler

- **Değerler.** Bir parçanın değeri `max` ile aynı birimdendir. Değeri olmayan ya da sıfırı aşmayan parça çubukta yer almaz, lejantta adı durur. Parçaların toplamı `max`'i aşarsa fazlası çubuğun ucunda kesilir.
- **Lejant.** Her parçanın adını, ardından değerini, renginin yanında yazar. Çubuğun üstünde ya da altında durur: başta duran lejant üstte, sonda duran altta sayılır. Kayıtları burada anahtar değildir: çubuk kendisine verileni gösterir.
- **Yazım.** `format` bir değerin lejantta nasıl yazılacağını söyler; verilmezse temanın diliyle sayı olarak yazılır.
- **Ekran okuyucu.** Çubuk `description`'ıyla bir resimdir; parçaları lejantın kayıtları söyler. Lejantı olmayan çubuk parçalarını kendisi söyler.
- **Yön.** Sağdan sola okunan dilde ilk parça sağda durur.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `MeterGroup_<tagKey>`; çubuk `.Bar`, lejantın kayıtları `.Legend_<parçanın anahtarı>`.

## Kullanım

### What a whole is filled with

```kotlin
PantrixMeterGroup(
    items = usage.map { MeterItem(it.id, it.name, it.gigabytes) },
    max = capacity,
    format = { "${it.toInt()} GB" },
    description = stringResource(Res.string.storage),
    tagKey = "storage"
)
```

### With its legend above it

```kotlin
PantrixMeterGroup(
    items = spending.map { MeterItem(it.id, it.name, it.share) },
    legend = ChartLegend(position = ChartLegendPosition.Top, alignment = ChartLegendAlignment.Start),
    tagKey = "budget"
)
```

## Örnekler

### Bir bütünü dolduranlar

En yalın hâli: altmış dört gigabaytlık bir depolamayı dolduran dört şey. Çubuğun dolmayan ucu boş kalan yeri gösterir; lejant her parçayı değeriyle yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup

PantrixMeterGroup(
    items = METER_STORAGE,
    max = 64,
    format = { "${it.toInt()} GB" },
    description = "Depolama",
    tagKey = "plain"
)

private val METER_STORAGE = listOf(
    MeterItem("apps", "Uygulamalar", 16),
    MeterItem("photos", "Fotoğraflar", 24),
    MeterItem("messages", "Mesajlar", 8),
    MeterItem("system", "Sistem", 10)
)
```

### Lejant üstte

Lejant çubuğun üstünde ve satırın başında (`ChartLegend(position = Top, alignment = Start)`). Değerler bütünün payı olarak, temanın diliyle yazılıyor.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendAlignment
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixMeterGroup(
    items = METER_BUDGET,
    format = { strings.percent(it / 100) },
    legend = ChartLegend(position = ChartLegendPosition.Top, alignment = ChartLegendAlignment.Start),
    description = "Bütçenin dağılımı",
    tagKey = "legend_above"
)

private val METER_BUDGET = listOf(
    MeterItem("rent", "Kira", 40),
    MeterItem("food", "Mutfak", 25),
    MeterItem("transport", "Ulaşım", 15),
    MeterItem("savings", "Birikim", 20)
)
```

### Yalnızca çubuk

Lejantsız bir çubuk (`legend = null`): bir satırın içinde, yanındaki yazı neyi gösterdiğini zaten söylerken. Ekran okuyucu parçaları çubuğun kendisinden duyar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup

PantrixMeterGroup(
    items = METER_STORAGE,
    max = 64,
    format = { "${it.toInt()} GB" },
    legend = null,
    description = "Depolama",
    tagKey = "bar_only"
)

private val METER_STORAGE = listOf(
    MeterItem("apps", "Uygulamalar", 16),
    MeterItem("photos", "Fotoğraflar", 24),
    MeterItem("messages", "Mesajlar", 8),
    MeterItem("system", "Sistem", 10)
)
```

### Kendi renklerin ve ölçülerin

Bir çubuğun kendi görünüşü: her parça kendi rengini söylüyor, çubuk daha kalın (`meterHeight`), uçları köşeli (`barRadius`) ve parçaların arası kapalı (`sliceGap`). Verilmeyen alan temanınki kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup
import com.pantrixui.foundation.token.color.PantrixPalette

val violet = PantrixPalette.Violet
PantrixMeterGroup(
    items = listOf(
        MeterItem("done", "Biten", 18, color = violet.shade700),
        MeterItem("doing", "Süren", 9, color = violet.shade500),
        MeterItem("waiting", "Bekleyen", 13, color = violet.shade300)
    ),
    max = 40,
    description = "İşlerin durumu",
    style = ChartStyle(meterHeight = 16.dp, barRadius = 0.dp, sliceGap = 0.dp),
    tagKey = "own_look"
)
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada çubuk ve altında lejant durur: her parçanın adı ve değeri.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.metergroup.MeterItem
import com.pantrixui.components.chart.metergroup.PantrixMeterGroup

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixMeterGroup(
    items = METER_STORAGE,
    max = 64,
    format = { "${it.toInt()} GB" },
    description = "Depolama",
    tagKey = "exported",
    export = ChartExport(fileName = "depolama") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val METER_STORAGE = listOf(
    MeterItem("apps", "Uygulamalar", 16),
    MeterItem("photos", "Fotoğraflar", 24),
    MeterItem("messages", "Mesajlar", 8),
    MeterItem("system", "Sistem", 10)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixMeterGroup

`import com.pantrixui.components.chart.metergroup.PantrixMeterGroup`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixMeterGroup(
    items: List<MeterItem>,
    modifier: Modifier = Modifier,
    max: Number = 100,
    format: ((Double) -> String)? = null,
    legend: ChartLegend? = ChartLegend(),
    description: String? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null
)
```

Bir ölçüm grubu: bir bütünün birkaç miktarı, tek bir çubukta yan yana. Bir depolamanın neyle dolduğu, bir bütçenin nasıl harcandığı: parçalar birbirine ve kalana göre okunur.

Çubuk `max` kadar uzundur. `items`'ın her biri çubuktan değeri kadar yer alır; satırın başından sırayla dizilirler ve her biri, kendi rengini söylemedikçe, temanın yerine düşen grafik rengiyle çizilir. Hiçbir parçanın almadığı yer çubuğun izini gösterir. Parçaların `max`'i aşan toplamı çubuğun ucunda kesilir.

`legend` her parçanın adını, ardından değerini, renginin bir örneğinin yanında yazar. Çubuğun üstünde ya da altında durur: başta duran lejant üstte, sonda duran alttadır. Kayıtları burada anahtar değildir: bir ölçüm grubu kendisine verileni gösterir.

**Ekran okuyucu için** çubuk, `description`'ıyla bir resimdir; parçaları lejantın kayıtları söyler. Lejantı olmayan grup parçaları çubukla birlikte söyler.

Sağdan okunan bir dilde ilk parça sağda durur.

```kotlin
PantrixMeterGroup(
    items = listOf(
        MeterItem("apps", "Apps", 16),
        MeterItem("photos", "Photos", 24),
        MeterItem("system", "System", 10)
    ),
    max = 64,
    format = { "${it.toInt()} GB" },
    description = "Storage",
    tagKey = "storage"
)
```

Parametreler:

- `items: List<MeterItem>`: miktarlar, çubukta durdukları sırayla. Anahtarları onları birbirinden ayırır; aynı anahtarı taşıyan iki parça reddedilir.
- `modifier: Modifier`: grubun modifier'ı.
- `max: Number`: çubuğun tamamının ne kadar olduğu: sıfırdan büyük.
- `format: ((Double) -> String)?`: bir değerin lejantta nasıl yazıldığı. Verilmezse temanın diliyle sayı olarak yazılır.
- `legend: ChartLegend?`: parçaların adlarının durduğu yer: çubuğun üstü ya da altı. `null` hiçbirini göstermez.
- `description: String?`: çubuğun neyi ölçtüğü, birkaç sözcükle, ekran okuyucu için.
- `style: ChartStyle?`: bu grubun kendi geometrisi: burada verilen alanlar, gerisi temanınkiyle.
- `colors: ChartColors?`: bu grubun kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grubun otomasyon anahtarı: grup `MeterGroup_<tagKey>`, çubuğu `MeterGroup_<tagKey>.Bar` ve bir parçanın lejant kaydı `MeterGroup_<tagKey>.Legend_<item's key>` olur.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur. Lejant dosyada çubuğun altında durur.

### MeterItem

`import com.pantrixui.components.chart.metergroup.MeterItem`, `com.pantrixui:components` içinden

```kotlin
class MeterItem(
    public val key: String,
    public val name: String,
    public val value: Number?,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixMeterGroup`'un çubuğunda yan yana koyduğu miktarlardan biri.

```kotlin
MeterItem("photos", "Photos", 24)
```

Kuruldukları her şey aynı olan iki parça aynı parçadır; bir tam sayı ile kesri sıfır olan aynı sayı tek bir değerdir.

Parametreler:

- `key: String`: Parçayı grubunun ötekilerinden ayıran ve değeri değişirken aynı kalan şey. Bir test etiketinin anahtarı gibi yazılır, küçük harflerle ve rakamlarla.
- `name: String`: Parçanın adı: lejantta ve ekran okuyucuda.
- `value: Number?`: Parçanın çubuktan ne kadar yer aldığı, çubuğun `max`'i neyle sayılıyorsa onunla. Değeri sayı olmayan ya da sıfırı aşmayan parça hiç yer almaz, lejanttaki adı durur.
- `color: Color`: Parçanın çizildiği renk. Verilmezse, grubun parçaları arasındaki yerine düşen tema grafik rengidir.
- `pattern: ChartPattern?`: Öğenin renginin yanında çizildiği desen. Verilmezse hiçbiri; grubun desenleri açıksa (`ChartStyle.patterns`), öğeler arasındaki yerine göre sırasındaki desen: ilkinin hiçbiri.

### ChartLegend

`import com.pantrixui.components.chart.common.ChartLegend`, `com.pantrixui:components` içinden

```kotlin
data class ChartLegend(
    public val position: ChartLegendPosition = ChartLegendPosition.Bottom,
    public val alignment: ChartLegendAlignment = ChartLegendAlignment.Center,
    public val toggles: Boolean = true,
    public val always: Boolean = false
)
```

Bir grafiğin lejantı: serilerinin adlarının, her biri serinin nasıl çizildiğini gösteren bir örneğin yanında durduğu yer.

Tek serili bir grafiğin lejantı yoktur: o tek çizginin ne olduğu grafiğin çevresindeki yazıya aittir. `always` yine de bir lejant verir.

Bir kayıt, serisinin anahtarıdır. Basılınca seriyi grafikten çıkarır ve grafik kalan seriler için çizilir; yeniden basılınca seriyi geri getirir. Kayıt, soluk çizilerek yerinde kalır ki çıkarılan geri getirilebilsin. Ekran okuyucu her kaydı bir anahtar olarak, serinin adıyla ve açık olup olmadığıyla duyar.

Parametreler:

- `position: ChartLegendPosition`: Lejantın grafiğin hangi yanında durduğu. Üstünde ve altında kayıtlar bir satırda, gerektiği kadar çok satıra bölünerek durur; yanında alt alta dururlar.
- `alignment: ChartLegendAlignment`: Lejantın, kendisine ayrılan yerde nerede durduğu: üstte ve altta grafiğin genişliği boyunca, yanda grafiğin tepesinden başlayarak.
- `toggles: Boolean`: Bir kayda basmanın serisini grafikten çıkarıp geri getirip getirmediği.
- `always: Boolean`: Tek serili bir grafiğin de lejantının olup olmadığı.

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

# Chart

Bir dizi yer boyunca değerler: her serinin her yerdeki değerinden geçen çizgiler ve dolgulu alanlar, altlarında yerlerin, yanlarında değerlerin ekseniyle. Bir ölçümün aylar içindeki seyri, iki şeyin yan yana gidişi böyle gösterilir.

Grafik serilerini alır ve her seri kendi satırlarını taşır: neyden çizildiğini, bir satırın nerede durduğunu ve değerinin ne olduğunu. Eksenler, lejant ve tooltip grafiğin parçalarıdır: her biri kendisini tarif eden değerle verilir, `null` ile kaldırılır.

- `PantrixChart` (`com.pantrixui.components.chart.cartesian`, `com.pantrixui:components`): Bir dizi yer boyunca değerler çizgiler, dolgulu alanlar ve çubuklar olarak, yan yana ya da üst üste: eksenler, ikinci bir değer ekseni, serileri okumak için çizgiler ve bantlar, işaretlerinde yazan değerler, serileri çıkarıp geri getiren bir lejant, gösterilen yer için bir tooltip; her yere tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: grafik, çizelge, karma grafik, zaman serisi, eksenli grafik, birleşik grafik.

## Özellikler

- **Seriler.** Bir `LineSeries` bir çizgidir; `fill` ile çizginin altı dolar ve bir alan olur. Bir `BarSeries` her yerde bir çubuktur. Her seri bir anahtar (`key`), bir ad, satırları ve o satırlardan iki şeyi okuyan iki fonksiyon alır: `x` satırın yerini, `y` değerini. Değeri olmayan satır `null` verir. Farklı türden seriler aynı grafikte çizilir: çubukların üstünde bir çizgi.
- **Yığma.** Aynı `stack` adını veren seriler her yerde üst üste durur: çubuklar tek bir çubukta, alanlar birbirinin üstünde. Ad vermeyen seri sıfırın üstünde tek başına durur.
- **Yerler.** Yer, satırın `x`'inin verdiği şeydir: bir ad, bir gün, kendisine eşit olan herhangi bir şey. Grafik, serilerinden herhangi birinin adını verdiği her yeri, ilk verildiği sırayla dizer. Seriler aynı listeden okunmak zorunda değildir ve aynı yerlerde durmak zorunda da değildir.
- **Zaman ekseni.** Her yeri bir an olan grafik (`kotlin.time.Instant`) yerlerini zamana göre dizer: satırların sırası ne olursa olsun zaman sırasıyla, anları ne kadar uzaksa o kadar aralıklı. Eksen yuvarlak anlara işaretlenir (saat, gün, ay) ve bir yer tarih olarak yazılır: cihazın saatiyle ve temanın diliyle, `xAxis`'in `time`'ı (`ChartTime`) başka söylemedikçe. Tarih kütüphanesi gerekmez.
- **Eksenler.** `xAxis` yerlerin, `yAxis` değerlerin eksenidir. Bir `ChartAxis` başlığını, yazılıp yazılmayacağını, çizgisini ve kılavuz çizgilerini söyler; değerlerin ekseni ayrıca en azını, en çoğunu, sıfırdan başlayıp başlamayacağını ve kaç değerin işaretleneceğini. Değerler yuvarlak sayılara işaretlenir.
- **İkinci eksen.** İki türden değeri olan grafikte (bir sayı ve bir oran) `axis = ChartYAxis.Second` diyen seri kendi ölçeğiyle çizilir; o ölçeğin ekseni (`secondYAxis`) grafiğin öbür yanında yazılır ve işaretleri ilk eksenin kılavuz çizgilerinin üstünde durur. Her değer kendi ekseninin yazımıyla yazılır. Bir yığın tek bir eksenin serilerinden oluşur.
- **Yazım.** Değerler temanın diliyle yazılır: eksenin yanında on binden itibaren kısa (`12 B`), tooltip'te tam. `format` bir eksenin değerlerinin, `label` yerlerinin nasıl yazılacağını söyler.
- **İşaretler.** `marks`, serilerin neye göre okunacağını çizer: bir değerde ya da bir yerde bir çizgi (`ChartReferenceLine`), iki değer ya da iki yer arasında gölgeli bir bant (`ChartReferenceBand`). Bir değerdeki işaret eksenini kendisini gösterecek kadar uzatır. Etiketi olan işaret ekran okuyucuya da söylenir.
- **Değer etiketleri.** Bir serinin `labels`'ı değerlerini işaretlerinin yanına yazar: çizginin noktasının üstüne, çubuğun ucuna, yığının çubuğunun içine. Yeri olmayan etiket atlanır.
- **Lejant.** Serilerin adları, her biri serinin nasıl çizildiğini gösteren bir örneğin yanında. Tek serili grafiğin lejantı yoktur. Bir kayda basmak seriyi grafikten çıkarır, yeniden basmak geri getirir; eksen kalan serilere göre yeniden kurulur. Lejant grafiğin dört yanından birinde durur.
- **Tooltip.** Gösterilen yerdeki değerler, yerin yanında küçük bir kartta. `shared` ile o yerdeki bütün serilerin değerleri birlikte, kapalıyken yalnızca imlece en yakın serinin değeri gösterilir. `format` kartın değerleri nasıl yazacağını söyler; verilmezse eksenin `format`'ı yazar. `content` kartın içini ekrana bırakır. Yanında yeri olmayan dar bir grafikte kart yerin üstünde, değerlerin olmadığı uçta durur.
- **Bir yeri göstermek.** İmleç grafiğin üstündeyken en yakın yeri gösterir. Parmak dokunarak ya da grafik boyunca sürüklenerek gösterir; gösterdiği yere yeniden dokununca bırakır. Yer bir çizgiyle işaretlenir; çubuğu olan grafikte yerin bandı gölgelenir.
- **Klavye.** Grafik Tab için tek bir duraktır. Yön tuşları yerden yere gider, Home ve End ilk ve son yere, Escape bırakır; Enter ve Space gösterilen değere basar. Tooltip serileri ayırıyorsa yukarı ve aşağı oklar bir serinin değerinden ötekine geçer.
- **Durum.** `ChartState` okuyucunun gizlediği serileri ve gösterdiği yeri tutar. Ekran onu `rememberChartState` ile kurup grafiğe verirse ikisini de okur ve söyler; aynı durumu alan iki grafik birlikte davranır.
- **Yakınlaştırma.** `zoom` verilen grafik (`ChartZoom`) yerlerinin bir kısmını çizim alanının genişliğinde gösterir ve geri kalanı boyunca kaydırılır. Fareyle: Ctrl (Mac'te Command) basılıyken tekerlek imlecin altındaki yere yakınlaşır, yana çevrilen tekerlek ve sürükleme yerler boyunca kaydırır; tuşsuz tekerlek sayfanındır. İki parmak açılarak yakınlaştırır, birlikte kaydırılarak yerleri taşır; tek parmak her grafikteki gibi bir yeri gösterir. Klavyede artı ve eksi yakınlaştırıp uzaklaştırır, sıfır bütün yerleri geri getirir, oklar gittikleri yeri görünüme getirir. Bunların hiçbirini kullanmayan için düğmeler (`buttons`) ve çizim alanının altında bütün yerlerin durduğu gezgin şeridi (`navigator`) vardır. Görünen kısım `ChartState`'tedir (`window`, `zoomTo`, `resetZoom`): aynı durumu alan iki grafik birlikte yakınlaşır. Değer eksenleri bütün değerlere göre kalır ve kaydırırken oynamaz; `fitValues = true` onları görünen yerlerin değerlerine göre yeniden kurar, gezgin şeridi yine bütün değerlerin ekseninde kalır. `zoom` verilmeyen grafik bunların hiçbirini yapmaz.
- **Dışa aktarma.** `export` verilen grafik (`ChartExport`) düğmelerinin arasına bir dışa aktarma düğmesi koyar: okuyucu türü seçer (PNG, SVG, PDF), grafik dosyayı üretir ve `onExport`'a verir. Dosyanın nereye gideceğini uygulama söyler: telefonda paylaşılır, pencerede kaydedilir, tarayıcıda indirilir. Dosya grafiği ekrandaki hâliyle gösterir: çıkarılan seri çıkmıştır, yakından bakılan grafiğin görünen kısmı vardır; gösterilen yer, tooltip ve düğmeler yoktur, lejant çizimin altındadır. SVG ve PDF çizgi ve şekildir, her boyutta keskindir; yazıları dosyayı açanın yazı tipiyle yazılır. `export` verilmeyen grafikte düğme de yoktur.
- **Çok nokta.** Piksel başına ikiden çok noktası olan çizgi seyreltilir (`decimation`, `ChartDecimation`): varsayılan `DecimationAlgorithm.MinMax` her piksel kolonunun ilk, en yüksek, en düşük ve son noktasından geçer, aynı pikselleri boyar, çok daha az iş yapar; `DecimationAlgorithm.Lttb` piksel başına bir nokta tutar ve çizginin şeklini korur. `threshold` kaç noktadan sonra seyreltileceğini söyler; `decimation = null` her noktayı çizer. Seyrelen çizgi düz çizilir ve noktalarının işaretleri çizilmez. Yakından bakılan grafik yalnızca görünen yerlerini çizer.
- **Boyut.** Grafik kendisine verilen genişliği doldurur. `modifier` ile verilen yükseklik grafiğin tamamınındır; verilmezse çizim alanı stilin söylediği kadar yüksektir ve üstteki ya da alttaki lejant ona eklenir. Yazılacak yeri kalmayan yer adları bir kuralla atlanır: her ikinci, her üçüncü.
- **Hareket.** Grafik yerlerin başladığı yandan çizilerek gelir; değerler değişince her biri eski yerinden yenisine gider. Sistem hareketi azaltmayı istiyorsa hiçbiri oynamaz.
- **Renk.** Bir seri kendi rengini söylemezse temanın grafik renklerinden sırasındakini alır; gizlenen seri yerini ve rengini korur. Kılavuz çizgileri ve yazılar temanındır; grafik bir dolgunun üstünde duruyorsa orada okunan renkten türerler.
- **Desenler.** `ChartStyle(patterns = true)` serileri renkten başka bir şeyle de ayırır: ilk seri düz kalır, ötekilerin dolgusuna sırayla bir desen oyulur (`ChartPattern`), çizgiler sırayla kesik ve noktalı çizilir, dördüncü çizgiden sonra noktalarına işaret konur. Şelalenin götüren adımı ve düşen mum da desen alır. Lejant, tooltip ve dışa aktarılan dosya aynı deseni gösterir. Söylenmezse sistem ayarına uyulur: iOS'ta "Renksiz Ayırt Et", Android'de renk düzeltme açıksa desenler de açıktır. Bir seri kendi desenini `pattern`, kendi kesiğini `dash` ile söyler; söylenen her zaman geçerlidir.
- **Yazı yönü.** Sağdan sola yazılan dilde yerler sağdan başlar ve değerler sağda yazılır.
- **Ekran okuyucu.** Grafik önce `description` ile verilen açıklamasını söyler, sonra her yeri, serilerin oradaki değerleriyle. Lejantın kayıtları birer anahtardır. İki yüzden çok yeri olan grafik yalnızca açıklamasıyla okunur.
- **Otomasyon.** `tagKey` ile grafik `Chart_<tagKey>`, çizim alanı `Chart_<tagKey>.Plot`, bir yeri `Chart_<tagKey>.Point_<numara>`, bir serinin lejant kaydı `Chart_<tagKey>.Legend_<serinin anahtarı>`, tooltip `Chart_<tagKey>.Tooltip` olur. Yakınlaştırma düğmeleri `Chart_<tagKey>.Zoom_in`, `.Zoom_out`, `.Zoom_all`, `.Zoom_back` ve `.Zoom_on`, gezgin şeridi `Chart_<tagKey>.Navigator`, dışa aktarma düğmesi `Chart_<tagKey>.Export` olur. Bir değere basmak `select`, bir lejant kaydına basmak `toggle`, bir yakınlaştırma düğmesine ya da tuşuna basmak `zoom`, bir dosya üretmek türüyle birlikte `export` olarak bildirilir; değerlerden hiçbir şey bildirilmez.

## Kullanım

### Two series read from the same rows

```kotlin
PantrixChart(
    series = listOf(
        LineSeries("visits", stringResource(Res.string.visits), days, x = { it.day }, y = { it.visits }),
        LineSeries("orders", stringResource(Res.string.orders), days, x = { it.day }, y = { it.orders })
    ),
    modifier = Modifier.height(240.dp),
    description = stringResource(Res.string.traffic_of_the_month),
    tagKey = "traffic"
)
```

### A filled area with its values written short, and no legend

```kotlin
val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        LineSeries(
            key = "revenue",
            name = stringResource(Res.string.revenue),
            data = months,
            x = { it.name },
            y = { it.revenue },
            curve = ChartCurve.Smooth,
            fill = ChartFill.Gradient
        )
    ),
    yAxis = ChartAxis(format = { strings.compact(it) }),
    legend = null,
    tagKey = "revenue"
)
```

### A count and a rate on two axes, with a target line

```kotlin
val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        BarSeries("orders", stringResource(Res.string.orders), months, x = { it.name }, y = { it.orders }),
        LineSeries(
            key = "returned",
            name = stringResource(Res.string.return_rate),
            data = months,
            x = { it.name },
            y = { it.returnRate },
            axis = ChartYAxis.Second
        )
    ),
    secondYAxis = ChartAxis(format = { strings.percent(it) }),
    marks = listOf(ChartReferenceLine(y = 400, label = stringResource(Res.string.target))),
    tagKey = "orders"
)
```

## Örnekler

### İki seri

En yalın hâli: aynı satırlardan okunan iki seri. Her `LineSeries` anahtarını, adını, satırları ve o satırlardan yeri (`x`) ve değeri (`y`) okuyan iki fonksiyonu alır.

Gerisi kendiliğinden gelir: altta ayların, yanda yuvarlak değerlerin ekseni, değerlerde kılavuz çizgileri, iki seri olduğu için bir lejant ve gösterilen yerin tooltip'i. İmleci grafiğin üstünde gezdir ya da parmağını grafik boyunca sürükle; lejanttaki bir ada basıp seriyi çıkar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartSeries
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart

val series: List<ChartSeries> = listOf(
    LineSeries("desktop", "Masaüstü", VISITS, x = { it.month }, y = { it.desktop }),
    LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile })
)
PantrixChart(
    series = series,
    description = "Aylara göre masaüstü ve mobil ziyaretler",
    tagKey = "two_series"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

### Kendi satırlarından seriler

Seriler aynı listeden okunmak zorunda değildir. Burada ölçülen değerler bir listeden, tahmin başka bir listeden gelir ve ikisi yalnızca Eylül'de buluşur. Grafik, serilerinden herhangi birinin adını verdiği her yeri ilk verildiği sırayla dizer; bir serinin değer vermediği yerde çizgisi yoktur.

Tahmin kesik çizgiyle çizildi (`dash`) ve noktaları işaretlendi (`marker`): ölçülenden renginden fazlasıyla ayrılır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartMarker

PantrixChart(
    series = listOf(
        LineSeries("measured", "Ölçülen", MEASURED, x = { it.first }, y = { it.second }),
        LineSeries(
            key = "forecast",
            name = "Tahmin",
            data = FORECAST,
            x = { it.first },
            y = { it.second },
            marker = ChartMarker.Circle,
            dash = ChartDash.Dashed
        )
    ),
    description = "Yılın ölçülen ve tahmin edilen satışları",
    tagKey = "own_rows"
)

private val MEASURED = listOf(
    "Oca" to 42,
    "Şub" to 48,
    "Mar" to 45,
    "Nis" to 57,
    "May" to 61,
    "Haz" to 58,
    "Tem" to 66,
    "Ağu" to 71,
    "Eyl" to 69
)

private val FORECAST = listOf("Eyl" to 69, "Eki" to 74, "Kas" to 80, "Ara" to 88)
```

### Çubukların üstünde bir çizgi

Türler aynı grafikte karışır: her ayın siparişi bir çubuk (`BarSeries`), üç aylık ortalaması bir çizgi (`LineSeries`). Çubuğu olan grafikte her yerin bir bandı vardır ve çizgi bantların ortasından geçer. Sonra verilen seri öncekinin üstüne çizilir: çizgiyi çubuklardan sonra ver.

Tooltip yerin iki değerini birlikte yazar; lejantta çubuk bir yama, çizgi işaretli kısa bir çizgidir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker

PantrixChart(
    series = listOf(
        BarSeries("orders", "Sipariş", HALF_YEAR, x = { it.first }, y = { it.second }),
        LineSeries(
            key = "average",
            name = "Üç aylık ortalama",
            data = HALF_YEAR,
            x = { it.first },
            y = { it.third },
            marker = ChartMarker.Circle
        )
    ),
    description = "Aylara göre sipariş ve üç aylık ortalaması",
    tagKey = "bars_and_line"
)

private val HALF_YEAR = listOf(
    Triple("Oca", 310, 298),
    Triple("Şub", 285, 302),
    Triple("Mar", 342, 312),
    Triple("Nis", 398, 342),
    Triple("May", 371, 370),
    Triple("Haz", 426, 398)
)
```

### İki eksen

İki türden değer tek grafikte: her ayın siparişi bir sayı, iade oranı bir pay. Aynı eksende çizilseler oran sıfıra yapışırdı. `axis = ChartYAxis.Second` diyen seri ikinci eksenle okunur; o eksen grafiğin öbür yanında yazılır (`secondYAxis`) ve işaretleri ilk eksenin kılavuz çizgilerinin üstünde durur.

Her değer kendi ekseninin yazımıyla yazılır: tooltip'te sipariş bir sayı, oran bir yüzdedir; ekran okuyucu da öyle söyler. `secondYAxis = null` ekseni çizmez, seri yine kendi ölçeğiyle durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartYAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        BarSeries("orders", "Sipariş", RETURNS, x = { it.first }, y = { it.second }),
        LineSeries(
            key = "returned",
            name = "İade oranı",
            data = RETURNS,
            x = { it.first },
            y = { it.third },
            marker = ChartMarker.Circle,
            axis = ChartYAxis.Second
        )
    ),
    yAxis = ChartAxis(title = "Sipariş"),
    secondYAxis = ChartAxis(title = "İade oranı", format = { strings.percent(it, fractionDigits = 1) }),
    description = "Aylara göre sipariş sayısı ve iade oranı",
    tagKey = "two_axes"
)

private val RETURNS = listOf(
    Triple("Oca", 310, 0.042),
    Triple("Şub", 285, 0.051),
    Triple("Mar", 342, 0.038),
    Triple("Nis", 398, 0.036),
    Triple("May", 371, 0.047),
    Triple("Haz", 426, 0.031)
)
```

### Hedef çizgisi ve bantlar

Seriler bir şeye göre okunur: bir hedefe, olağan bir aralığa, bir kampanyanın aylarına. `marks`, grafiğin serilerin yanında çizdiği işaretleri alır.

- `ChartReferenceLine(y = …)` bir değerde çizim alanı boyunca bir çizgi, `ChartReferenceLine(x = …)` bir yerde yukarı doğru bir çizgidir.

- `ChartReferenceBand(y1 = …, y2 = …)` iki değerin, `ChartReferenceBand(x1 = …, x2 = …)` iki yerin arasında gölgeli bir banttır. Tek ucu verilen bant eksenin sonuna kadar gider.

Çizgiler serilerin üstüne, bantlar arkasına çizilir; `inFront` bunu değiştirir. Bir değerdeki işaret eksenini kendisini gösterecek kadar uzatır: buradaki hedef, ziyaretlerin hiçbirinin ulaşmadığı 450'de. Etiketi olan işaret, ekran okuyucuya grafiğin açıklamasından sonra söylenir.

İşaretin yazısı serilerin üstünde, tooltip renginde bir zeminin üstüne yazılır: bir çizginin ya da çubuğun üstünde de okunur. `labelPosition` yazının işaret boyunca yerini söyler: çizginin yazısı kendiliğinden sonundadır, bandınki başında. Burada "Olağan" bandın sonunda, "Yeni site" çizginin dibinde.

Çizgilerin kalınlığı ve bantların tonu stilin: burada iki dp ve rengin beşte biri (`markLineWidth`, `markBandAlpha`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartMark
import com.pantrixui.components.chart.cartesian.ChartMarkLabelPosition
import com.pantrixui.components.chart.cartesian.ChartReferenceBand
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.foundation.theme.PantrixTheme

val marks: List<ChartMark> = listOf(
    ChartReferenceBand(y1 = 200, y2 = 300, label = "Olağan", labelPosition = ChartMarkLabelPosition.End),
    ChartReferenceBand(x1 = "Haz", x2 = "Ağu", label = "Yaz kampanyası"),
    ChartReferenceLine(
        x = "Eki",
        label = "Yeni site",
        dash = ChartDash.Dotted,
        labelPosition = ChartMarkLabelPosition.Start
    ),
    ChartReferenceLine(y = 450, label = "Hedef", color = PantrixTheme.colors.success.color)
)
PantrixChart(
    series = listOf(LineSeries("desktop", "Masaüstü", VISITS, x = { it.month }, y = { it.desktop })),
    marks = marks,
    description = "Aylara göre masaüstü ziyaretleri",
    style = ChartStyle(markLineWidth = 2.dp, markBandAlpha = 0.2f),
    tagKey = "marks"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

### Eksenler

Bir eksen `ChartAxis` ile tarif edilir. Burada değerlerin ekseninin bir başlığı var ve değerlerini temanın diliyle kısa yazıyor (`format`); yerlerin ekseninin de bir başlığı var.

Çizgilerden oluşan bir grafiğin ekseni sıfırdan başlamaz: okunan, çizginin inişi ve çıkışıdır. `startFromZero` ekseni sıfıra indirir; anahtarı çevir, aynı değerlerin iki eksende nasıl göründüğüne bak. Dolgulu bir serisi olan grafik kendiliğinden sıfırdan başlar: bir alanın yüksekliği miktar olarak okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var fromZero by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = fromZero,
    onCheckedChange = { fromZero = it },
    label = "Değerlerin ekseni sıfırdan başlasın",
    tagKey = "chart_from_zero"
)
PantrixChart(
    series = listOf(LineSeries("revenue", "Gelir", REVENUE, x = { it.first }, y = { it.second })),
    xAxis = ChartAxis(title = "2026"),
    yAxis = ChartAxis(title = "Gelir (TL)", startFromZero = fromZero, format = { strings.compact(it) }),
    description = "2026 yılının aylık geliri",
    tagKey = "axes"
)

private val REVENUE = listOf(
    "Oca" to 1_240_000,
    "Şub" to 1_310_000,
    "Mar" to 1_285_000,
    "Nis" to 1_420_000,
    "May" to 1_390_000,
    "Haz" to 1_510_000,
    "Tem" to 1_640_000,
    "Ağu" to 1_585_000,
    "Eyl" to 1_720_000,
    "Eki" to 1_790_000,
    "Kas" to 1_865_000,
    "Ara" to 1_950_000
)
```

### Lejantın yeri

Lejant grafiğin dört yanından birinde durur. Üstte ve altta kayıtlar bir satıra dizilir ve sığmazsa alt satıra geçer; yanlarda alt alta dururlar. `alignment` lejantın kendi yanındaki yerini söyler.

Her kayıt serisinin bir anahtarıdır: basınca seri grafikten çıkar ve eksen kalanlara göre yeniden kurulur, kayıt soluk çizilerek yerinde kalır. Çıkan seri rengini korur; ötekilerin rengi de değişmez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var place by remember { mutableStateOf(ChartLegendPosition.Top) }
PantrixSegmentButton(
    options = LEGEND_PLACES,
    selected = place,
    onSelect = { place = it },
    fullWidth = false,
    tagKey = "legend_place"
)
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Masaüstü", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile }),
        LineSeries("tablet", "Tablet", VISITS, x = { it.month }, y = { it.tablet })
    ),
    legend = ChartLegend(position = place),
    description = "Aylara göre üç cihazın ziyaretleri",
    tagKey = "legend"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)

private val LEGEND_PLACES = listOf(
    SegmentOption(value = ChartLegendPosition.Top, label = "Üstte", tagKey = "top"),
    SegmentOption(value = ChartLegendPosition.Bottom, label = "Altta", tagKey = "bottom"),
    SegmentOption(value = ChartLegendPosition.Start, label = "Başta", tagKey = "start"),
    SegmentOption(value = ChartLegendPosition.End, label = "Sonda", tagKey = "end")
)
```

### Tooltip: birlikte ya da tek tek

Tooltip iki türlü okur. `shared` açıkken gösterilen yerdeki bütün serilerin değerleri birlikte gelir: grafik bir yerde böyle okunur ve parmağın nişan alması gerekmez. Kapalıyken tooltip yalnızca imlece en yakın serinin değeridir; klavyede yukarı ve aşağı oklar bir serinin değerinden ötekine geçer.

`crosshair` gösterilen yerden geçen çizgidir. Tooltip'in yerine `null` verilirse kart hiç gösterilmez; yer yine işaretlenir ve grafiğin durumuna yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var shared by remember { mutableStateOf(true) }
var crosshair by remember { mutableStateOf(true) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSwitchButton(
        checked = shared,
        onCheckedChange = { shared = it },
        label = "Seriler birlikte",
        tagKey = "tooltip_shared"
    )
    PantrixSwitchButton(
        checked = crosshair,
        onCheckedChange = { crosshair = it },
        label = "Yerden geçen çizgi",
        tagKey = "tooltip_crosshair"
    )
}
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Masaüstü",
            data = VISITS,
            x = { it.month },
            y = { it.desktop },
            marker = ChartMarker.Circle
        ),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile }, marker = ChartMarker.Square)
    ),
    tooltip = ChartTooltip(shared = shared, crosshair = crosshair),
    description = "Aylara göre masaüstü ve mobil ziyaretler",
    tagKey = "tooltip"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

### Kendi tooltip'in

Kartın içi ekranın olabilir: `content`, gösterilen yerdeki değerleri alır ve onlardan istediğini çizer. Burada iki serinin değeri toplanıyor ve mobilin payı yüzde olarak yazılıyor; ikisi de temanın sayı biçimiyle.

Kartın kendisi, dolgusu, kenarı ve yeri grafiğin kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Masaüstü", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile })
    ),
    tooltip = ChartTooltip(
        content = { points ->
            val total = points.sumOf { it.value }
            val mobile = points.firstOrNull { it.series == "mobile" }?.value ?: 0.0
            PantrixText(text = points.first().label, style = PantrixTheme.typography.footnote)
            PantrixText(text = "${strings.decimal(total)} ziyaret", style = PantrixTheme.typography.label)
            PantrixText(
                text = "Mobilin payı ${strings.percent(mobile / total)}",
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
        }
    ),
    description = "Aylara göre toplam ziyaret ve mobilin payı",
    tagKey = "own_tooltip"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

### Durumu paylaşan iki grafik

`ChartState` okuyucunun gizlediği serileri ve gösterdiği yeri tutar. Ekran onu `rememberChartState` ile kurup grafiğe verirse ikisini de okur: alttaki satır gösterilen ayı durumdan yazıyor.

Aynı durumu alan iki grafik birlikte davranır. Üsttekinde bir ayı göster: alttaki de aynı ayı işaretler. Birinin lejantında gizlenen seri ötekinde de gizlenir, çünkü iki grafiğin serileri aynı anahtarları taşır.

Durum ekrandan da yazılır: düğme `state.selection`'a `ChartSelection(x = "Mar")` verir ve iki grafik de Mart'ı gösterir.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.common.ChartSelection
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberChartState()
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Masaüstü", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile })
    ),
    modifier = Modifier.height(200.dp),
    state = state,
    description = "Aylara göre ziyaretler",
    tagKey = "shared_visits"
)
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Masaüstü",
            data = VISITS,
            x = { it.month },
            y = { it.desktop * 3 / 100 },
            fill = ChartFill.Solid
        ),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile * 2 / 100 }, fill = ChartFill.Solid)
    ),
    modifier = Modifier.height(160.dp),
    legend = null,
    state = state,
    description = "Aylara göre siparişler",
    tagKey = "shared_orders"
)
PantrixText(
    text = state.selection?.let { "Gösterilen ay: ${it.x}" } ?: "Bir ay gösterilmiyor",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
PantrixButton(
    text = "Mart'ı göster",
    onClick = { state.selection = ChartSelection(x = "Mar") },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "show_march"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

### Bir değere basmak

`onSelect`, basılan değeri verir: serisini, yerini, değerini ve grafiğin onu nasıl yazdığını. Bir değere bas ya da klavyeyle bir yere gidip Enter'a bas: kartın altındaki satır basılanı yazar.

Tooltip burada serileri ayırıyor (`shared = false`), böylece basılan, gösterilen serinin değeridir. Seriler birlikte gösterilirken basılan, basışa en yakın serinin değeridir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartPoint
import com.pantrixui.components.chart.common.ChartTooltip

val report = LocalExampleEvents.current
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Masaüstü",
            data = VISITS,
            x = { it.month },
            y = { it.desktop },
            marker = ChartMarker.Circle
        ),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile }, marker = ChartMarker.Circle)
    ),
    tooltip = ChartTooltip(shared = false),
    description = "Aylara göre masaüstü ve mobil ziyaretler",
    onSelect = { point: ChartPoint -> report("${point.label}, ${point.name}: ${point.text}") },
    tagKey = "pressed"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Eksik değerler

Değeri olmayan bir satırda çizginin ne yapacağını `missing` söyler. Bu sensör Nisan'da ve Ağustos'ta ölçüm vermedi. `Gap` çizgiyi orada keser: eksik olanın eksik olduğu görülür. `Connect` bir önceki noktadan bir sonrakine sürer. `Zero` satırı sıfır sayar.

Öncesinde ve sonrasında nokta olmayan bir değer, işareti verilmemiş olsa da bir noktayla çizilir: tek bir noktadan geçen çizginin gösterecek bir şeyi yoktur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartMissing
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var missing by remember { mutableStateOf(ChartMissing.Gap) }
PantrixSegmentButton(
    options = MISSING_KINDS,
    selected = missing,
    onSelect = { missing = it },
    fullWidth = false,
    tagKey = "missing"
)
PantrixChart(
    series = listOf(
        LineSeries(
            key = "sensor",
            name = "Sıcaklık",
            data = SENSOR,
            x = { it.first },
            y = { it.second },
            marker = ChartMarker.Circle,
            missing = missing
        )
    ),
    description = "Sensörün aylık ortalama sıcaklığı",
    tagKey = "missing"
)

private val SENSOR: List<Pair<String, Double?>> = listOf(
    "Oca" to 4.5,
    "Şub" to 6.1,
    "Mar" to 9.8,
    "Nis" to null,
    "May" to 18.2,
    "Haz" to 23.4,
    "Tem" to 26.9,
    "Ağu" to null,
    "Eyl" to 21.3,
    "Eki" to 15.6,
    "Kas" to 10.2,
    "Ara" to 5.9
)

private val MISSING_KINDS = listOf(
    SegmentOption(value = ChartMissing.Gap, label = "Boşluk", tagKey = "gap"),
    SegmentOption(value = ChartMissing.Connect, label = "Birleştir", tagKey = "connect"),
    SegmentOption(value = ChartMissing.Zero, label = "Sıfır say", tagKey = "zero")
)
```

### Boş grafik

Değeri olmayan grafik, çizim alanının ortasına temanın sözünü ("Veri yok") yazar. `empty` o sözün yerine kendi içeriğini koyar: burada ne olduğunu söyleyen bir satır ve verileri getiren bir düğme. Ekran okuyucuya da "Veri yok" söylenmez; içerik kendini söyler. Değerler gelince içerik gider.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loaded by remember { mutableStateOf(false) }
PantrixChart(
    series = listOf(
        BarSeries(
            key = "desktop",
            name = "Masaüstü",
            data = if (loaded) VISITS.take(6) else emptyList(),
            x = { it.month },
            y = { it.desktop }
        )
    ),
    empty = {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            PantrixText(
                text = "Bu dönemde ziyaret yok",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixButton(
                text = "Örnek verileri yükle",
                onClick = { loaded = true },
                variant = ButtonVariant.Outline,
                size = ButtonSize.Small,
                tagKey = "no_data_load"
            )
        }
    },
    description = "Masaüstü ziyaretleri",
    tagKey = "no_data"
)
if (loaded) {
    PantrixButton(
        text = "Verileri kaldır",
        onClick = { loaded = false },
        variant = ButtonVariant.Soft,
        size = ButtonSize.Small,
        tagKey = "no_data_clear"
    )
}

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

### Çok yer

Doksan gün. Günlerin adları yan yana sığmaz; grafik onları bir kuralla atlar, her altıncı ya da her onuncu, ve pencere daralıp genişledikçe aynı kuralı yeniden kurar. Değerlerin hepsi yerinde durur: imleçle ya da parmakla her günün değeri gösterilir.

Çizgi yumuşak geçiyor (`ChartCurve.Smooth`): noktalarının arasında kalır, değerlerin sahip olmadığı bir tepe ya da çukur göstermez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.common.ChartFill

PantrixChart(
    series = listOf(
        LineSeries(
            key = "sessions",
            name = "Oturum",
            data = DAILY,
            x = { it.first },
            y = { it.second },
            curve = ChartCurve.Smooth,
            fill = ChartFill.Gradient
        )
    ),
    xAxis = ChartAxis(label = { "$it. gün" }),
    description = "Son doksan günün günlük oturum sayısı",
    tagKey = "many"
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### Zaman ekseni

Yerleri an olan bir grafik: bir sunucunun bir gün içinde düzensiz aralıklarla ölçülen yanıt süresi. Satırların `x`'i bir `kotlin.time.Instant` verdiği için grafik onları zamana göre dizer: sık ölçülen saatler sıkışık, seyrek ölçülenler aralıklı durur, ve eksen ölçümlere değil yuvarlak saatlere işaretlenir.

Çizgi ve bant da anlarda durur, bir satırın anı olsun olmasın: dağıtımın yapıldığı an ve bakım penceresi. Ölçümlerden sonraki bir işaret, ertesi sabahki bakım, ekseni kendisine kadar uzatır; bir değer eksenini uzatan hedef çizgisi gibi. Saatler UTC'ye göre okunuyor (`ChartTime`'ın `offset`'i); verilmezse cihazın saatiyle okunur.

Anlar da uygulamanın kendi yazdığı gibi yazılıyor (`ChartTime`'ın `format`'ı): eksenin saat başı işaretleri "saat 14" diye, bir ölçümün anı ipucunda dakikasıyla. `format`'a verilen `ChartTimeUnit` neyin yazıldığını söyler: eksenin işaretleri aralarındaki birimle, bir yer ise yerlerin ayrıldığı en ince birimle sorulur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceBand
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.cartesian.ChartTimeUnit
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import kotlin.time.Duration
import kotlin.time.Instant

PantrixChart(
    series = listOf(
        LineSeries(
            key = "response",
            name = "Yanıt süresi (ms)",
            data = RESPONSE_TIMES,
            x = { momentAt(it.first) },
            y = { it.second },
            marker = ChartMarker.Circle
        )
    ),
    xAxis = ChartAxis(time = ChartTime(format = ::clockOfUtc, offset = { Duration.ZERO })),
    marks = listOf(
        ChartReferenceBand(x1 = momentAt("02:00"), x2 = momentAt("04:00"), label = "Bakım"),
        ChartReferenceLine(x = momentAt("13:20"), label = "Dağıtım"),
        ChartReferenceLine(x = Instant.parse("2026-10-14T03:00:00Z"), label = "Sonraki bakım")
    ),
    description = "Bir sunucunun bir gün içindeki yanıt süresi, ölçüldüğü anlarda",
    tagKey = "time"
)

private val RESPONSE_TIMES = listOf(
    "00:10" to 182,
    "01:40" to 176,
    "02:30" to 240,
    "03:30" to 262,
    "05:00" to 190,
    "08:00" to 205,
    "09:00" to 231,
    "09:30" to 248,
    "10:00" to 236,
    "10:30" to 259,
    "11:00" to 244,
    "12:00" to 228,
    "13:00" to 252,
    "13:30" to 171,
    "14:00" to 158,
    "15:00" to 149,
    "17:30" to 144,
    "21:00" to 139,
    "23:30" to 133
)

private fun momentAt(time: String): Instant = Instant.parse("2026-10-13T$time:00Z")

private fun clockOfUtc(moment: Instant, unit: ChartTimeUnit): String {
    val minute = moment.epochSeconds.floorDiv(SECONDS_IN_A_MINUTE).mod(MINUTES_IN_A_DAY)
    val hour = (minute / MINUTES_IN_AN_HOUR).toString().padStart(2, '0')
    val ofTheHour = (minute % MINUTES_IN_AN_HOUR).toString().padStart(2, '0')
    return if (unit >= ChartTimeUnit.Hour) "saat $hour" else "$hour:$ofTheHour"
}

private const val SECONDS_IN_A_MINUTE = 60

private const val MINUTES_IN_AN_HOUR = 60

private const val MINUTES_IN_A_DAY = 24 * 60
```

### Yakınlaştırma

`zoom = ChartZoom()` grafiğe yakından bakmayı açar: doksan günün bir kısmı çizim alanının tamamını doldurur ve geri kalanı boyunca kaydırılır. Çizim alanının üstündeki düğmeler sırayla geri ve ileri kaydırır, uzaklaştırır, yakınlaştırır ve bütün günleri geri getirir; yapacak işi olmayan düğme soluk durur.

Fareyle Ctrl (Mac'te Command) basılıyken tekerleği çevir: imlecin altındaki gün yerinde kalır. Yakınlaşınca grafiği sürükle. Dokunmatik ekranda iki parmağını aç, sonra birlikte kaydır; tek parmak yine bir günü gösterir. Klavyede grafiğe gelip artı, eksi ve sıfıra bas: yakınlaşınca daha çok günün adı yazılacak yer bulur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartZoom

PantrixChart(
    series = listOf(
        LineSeries("sessions", "Oturum", DAILY, x = { it.first }, y = { it.second }, marker = ChartMarker.Circle)
    ),
    xAxis = ChartAxis(label = { "$it. gün" }),
    zoom = ChartZoom(),
    description = "Son doksan günün günlük oturum sayısı, yakından bakılabilir",
    tagKey = "zoomed"
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### Gezgin şeridi

Gezgin şeridi (`navigator = true`) çizim alanının altında durur ve bütün yerleri taşır: seriler üstünde küçük çizilir, görünen kısım işaretlidir. İşaretli kısmı ortasından tutup sürükle; iki ucundaki tutamaklarla genişlet ya da daralt; şeridin başka bir yerine bas, kısım oraya gelsin. Klavyede şeride gelince oklar kısmı kaydırır, Home ve End başa ve sona götürür.

Yerler burada an: altmış günün saatlik ölçümleri. Yakınlaştıkça eksenin işaretleri aylardan günlere, günlerden saatlere iner. Ekran okuyucu şeridi "görünen aralık" olarak, görünen ilk ve son anla söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.common.ChartZoom
import kotlin.math.PI
import kotlin.math.sin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Instant

PantrixChart(
    series = listOf(
        LineSeries(
            key = "load",
            name = "Yük (%)",
            data = HOURLY,
            x = { hourAt(it.first) },
            y = { it.second },
            fill = ChartFill.Gradient
        )
    ),
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO })),
    yAxis = ChartAxis(min = 0.0, max = 100.0),
    zoom = ChartZoom(navigator = true),
    description = "Bir sunucunun altmış gün boyunca saatlik yükü",
    tagKey = "navigated"
)

private val HOURLY: List<Pair<Int, Int>> = List(HOURS) { hour ->
    val weekend = (hour / A_DAY) % WEEK.size >= WEEK.size - 2
    hour to (if (weekend) 36 else 52) + (wave(hour, A_DAY) * 26).toInt() + hour * 7 % 9
}

private const val HOURS = 24 * 60

private const val A_DAY = 24

private fun hourAt(hour: Int): Instant = Instant.parse("2026-08-15T00:00:00Z") + hour.hours

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)

private fun wave(
    step: Int,
    period: Int
): Double = sin(step * 2 * PI / period)
```

### Birlikte yakınlaşan iki grafik

Aynı `ChartState`'i alan iki grafik birlikte yakınlaşır: görünen kısım durumda tutulur ve ikisi de onu gösterir. Üstteki grafiği yakınlaştır ya da alttakinin gezgin şeridini sürükle: öteki de aynı günleri gösterir. Bir günü göstermek de ortaktır.

Düğmeler üstteki grafikte, şerit alttakinde: `ChartZoom(buttons = false, navigator = true)`. İki grafiğin yerleri aynı olduğu için aynı kısım aynı günlerdir.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState

val state = rememberChartState()
PantrixChart(
    series = listOf(LineSeries("sessions", "Oturum", DAILY, x = { it.first }, y = { it.second })),
    modifier = Modifier.height(220.dp),
    xAxis = ChartAxis(label = { "$it. gün" }),
    zoom = ChartZoom(),
    state = state,
    description = "Son doksan günün günlük oturum sayısı",
    tagKey = "together_sessions"
)
PantrixChart(
    series = listOf(
        LineSeries(
            key = "conversion",
            name = "Dönüşüm (%)",
            data = CONVERSION,
            x = { it.first },
            y = { it.second },
            fill = ChartFill.Solid
        )
    ),
    modifier = Modifier.height(220.dp),
    xAxis = ChartAxis(label = { "$it. gün" }),
    zoom = ChartZoom(buttons = false, navigator = true),
    state = state,
    description = "Son doksan günün günlük dönüşüm oranı",
    tagKey = "together_conversion"
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private val CONVERSION: List<Pair<Int, Double>> = List(DAYS) { day ->
    (day + 1) to 3.2 - WEEK[day % WEEK.size] / 100.0 + day / 120.0
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### Ekranın kendi düğmeleri

Görünen kısmı ekran da söyler: `ChartState.zoomTo`, yerlerin başından sonuna sıfırdan bire iki pay alır, `resetZoom` hepsini geri getirir. Buradaki üç seçenek grafiğin kendi düğmelerinin yerine geçiyor (`ChartZoom(buttons = false)`); fare, parmak ve klavye yine çalışır.

Durum okunur da: alttaki satır `state.window`'u yazıyor. Görünen kısım, gizlenen serilerle birlikte ekran döndürülünce de korunur (`rememberChartState`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberChartState()
var span by remember { mutableStateOf(DAYS) }
PantrixSegmentButton(
    options = SPANS,
    selected = span,
    onSelect = { days ->
        span = days
        // Günler grafiğin başından sonuna eşit aralıklarla durur: son `days` gün, sondan o kadar geride başlar.
        if (days == DAYS) state.resetZoom() else state.zoomTo(1f - (days - 1f) / (DAYS - 1f), 1f)
    },
    fullWidth = false,
    tagKey = "zoom_span"
)
PantrixChart(
    series = listOf(
        LineSeries("sessions", "Oturum", DAILY, x = { it.first }, y = { it.second }, marker = ChartMarker.Circle)
    ),
    xAxis = ChartAxis(label = { "$it. gün" }),
    zoom = ChartZoom(buttons = false),
    state = state,
    description = "Son doksan günün günlük oturum sayısı",
    tagKey = "zoom_from_screen"
)
val from = (state.window.start * PERCENT).toInt()
val to = (state.window.endInclusive * PERCENT).toInt()
PantrixText(
    text = if (state.zoomed) "Görünen kısım: %$from – %$to" else "Bütün günler görünüyor",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private val SPANS = listOf(
    SegmentOption(value = DAYS, label = "Tümü", tagKey = "all"),
    SegmentOption(value = 30, label = "Son 30 gün", tagKey = "month"),
    SegmentOption(value = 7, label = "Son 7 gün", tagKey = "week")
)

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)

private const val PERCENT = 100
```

### On binlerce nokta

Elli bin nokta: bir sensörün otuz beş gün boyunca dakikada bir ölçtüğü değer. Çizim alanı birkaç yüz piksel genişliğinde olduğu için çizgi her piksel kolonunun ilk, en yüksek, en düşük ve son noktasından geçer: ekrandaki çizgi bütün noktalardan geçenle aynı pikselleri boyar, tepeler ve çukurlar kaybolmaz.

Yakınlaştır: yalnızca görünen dakikalar çizilir, ve piksel başına iki noktadan aza inince her nokta kendisi çizilir. `closest` grafiğe en çok ne kadar yakından bakılacağını söyler: burada bin kat, yani elli dakika.

"LTTB ile seyrelt" (`ChartDecimation(algorithm = DecimationAlgorithm.Lttb)`) çizgiyi piksel başına bir noktadan geçirir ve şeklini korur; tutulan iki nokta arasında kalan bir dakikalık titreme çizilmez, çizgi daha yumuşak görünür. "Eksen görünen kısma otursun" (`ChartZoom(fitValues = true)`) yakınlaşınca değer eksenini yalnızca görünen dakikalara göre kurar: birkaç saatin bir iki derecelik değişimi çizim alanını doldurur. Kapalıyken eksen bütün günlere göre kalır ve kaydırırken oynamaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartTime
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDecimation
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.DecimationAlgorithm
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import kotlin.math.PI
import kotlin.math.sin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Instant

var lttb by remember { mutableStateOf(false) }
var fit by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = lttb,
    onCheckedChange = { lttb = it },
    label = "LTTB ile seyrelt",
    tagKey = "many_points_lttb"
)
PantrixSwitchButton(
    checked = fit,
    onCheckedChange = { fit = it },
    label = "Eksen görünen kısma otursun",
    tagKey = "many_points_fit"
)
PantrixChart(
    series = listOf(
        LineSeries("temperature", "Sıcaklık (°C)", MINUTES, x = { minuteAt(it.first) }, y = { it.second })
    ),
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO })),
    zoom = ChartZoom(closest = 1000f, navigator = true, fitValues = fit),
    decimation = ChartDecimation(algorithm = if (lttb) DecimationAlgorithm.Lttb else DecimationAlgorithm.MinMax),
    description = "Bir sensörün otuz beş gün boyunca dakikada bir ölçtüğü sıcaklık",
    tagKey = "many_points"
)

private val MINUTES: List<Pair<Int, Double>> by lazy {
    List(MANY_MINUTES) { minute ->
        minute to 18.0 + wave(minute, A_DAY * 60) * 6.0 + minute / 20_000.0 + (minute * 7919 % 41 - 20) / 25.0
    }
}

private const val MANY_MINUTES = 50_000

private const val A_DAY = 24

private fun minuteAt(minute: Int): Instant = Instant.parse("2026-09-08T00:00:00Z") + minute.minutes

private fun wave(
    step: Int,
    period: Int
): Double = sin(step * 2 * PI / period)
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin düğmelerinin arasına bir dışa aktarma düğmesi koyar. Bas ve türü seç: grafik dosyayı üretir ve `onExport`'a verir. Dosyanın nereye gideceği uygulamanındır: bu örnek adını, türünü ve boyunu söyler, PNG ise resmi altında geri gösterir, ve "Dosyayı kaydet" onu platformun kaydetme penceresiyle verir (`rememberFileSaver`): Android'de yeni belge penceresi, iOS'ta Dosyalar, masaüstünde kaydetme penceresi, web'de indirme.

Dosya grafiği ekrandaki hâliyle gösterir: lejanttan bir seriyi çıkar ve yeniden dışa aktar. Gösterilen yer ve tooltip'i dosyada yoktur; lejant çizimin altında durur. SVG ve PDF her boyutta keskindir ve birkaç kilobayttır.

```kotlin
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartDash
import com.pantrixui.components.chart.common.ChartFill
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.export.ChartExportFormat
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.rememberFileSaver
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.decodeToImageBitmap

var file by remember { mutableStateOf<ChartExportFile?>(null) }
val saver = rememberFileSaver()
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Masaüstü", VISITS, x = { it.month }, y = { it.desktop }, fill = ChartFill.Gradient),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile }, dash = ChartDash.Dashed)
    ),
    export = ChartExport(fileName = "ziyaretler") { file = it },
    description = "Aylara göre masaüstü ve mobil ziyaretler",
    tagKey = "exported"
)
val made = file
PantrixText(
    text = made?.let { "${it.name} · ${it.mimeType} · ${it.bytes.size / KILOBYTE + 1} KB" }
        ?: "Henüz bir dosya üretilmedi",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
if (made != null) {
    PantrixButton(
        text = "Dosyayı kaydet",
        onClick = { saver.save(PantrixFile(made.name, made.bytes, made.mimeType)) {} },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "exported_save"
    )
}
if (made != null && made.format == ChartExportFormat.Png) {
    val picture = remember(made) { made.bytes.decodeToImageBitmap() }
    PantrixImage(
        bitmap = picture,
        modifier = Modifier.fillMaxWidth().aspectRatio(picture.width.toFloat() / picture.height),
        contentDescription = "Üretilen resim"
    )
}

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)

private const val KILOBYTE = 1024
```

### Görünen kısım, tek tür

Tek bir tür verilince düğme seçim açmaz: basınca o dosyayı üretir. Burada yalnızca PNG, dp başına üç pikselle (`scale = 3f`) ve beyaz bir zeminde (`background`); zemin verilmezse temanın zeminidir, koyu temada koyu.

Grafik yakınlaştırılabiliyor: yakınlaş ve dışa aktar. Dosyaya görünen kısım çıkar, gezgin şeridi ve düğmeler çıkmaz. Üretilen resim altta gösteriliyor; grafiğin çevresindeki boşluk dosyanın kendi payıdır (`padding`).

```kotlin
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFormat
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.decodeToImageBitmap

var picture by remember { mutableStateOf<ImageBitmap?>(null) }
val state = rememberChartState()
// Grafik son otuz altı günü göstererek açılır.
LaunchedEffect(state) { state.zoomTo(start = 0.6f, end = 1f) }
PantrixChart(
    series = listOf(BarSeries("sessions", "Oturum", DAILY, x = { it.first }, y = { it.second })),
    xAxis = ChartAxis(label = { "$it. gün" }),
    zoom = ChartZoom(navigator = true),
    export = ChartExport(
        formats = listOf(ChartExportFormat.Png),
        fileName = "oturumlar",
        scale = 3f,
        background = Color.White
    ) { picture = it.bytes.decodeToImageBitmap() },
    state = state,
    description = "Son doksan günün günlük oturum sayısı, dışa aktarılabilir",
    tagKey = "exported_part"
)
picture?.let { made ->
    PantrixImage(
        bitmap = made,
        modifier = Modifier.fillMaxWidth().aspectRatio(made.width.toFloat() / made.height),
        contentDescription = "Üretilen resim"
    )
}

private val DAILY: List<Pair<Int, Int>> = List(DAYS) { day ->
    (day + 1) to BASE + day * GROWTH + WEEK[day % WEEK.size]
}

private const val DAYS = 90

private const val BASE = 320

private const val GROWTH = 3

private val WEEK = listOf(40, 62, 55, 70, 48, -90, -120)
```

### Renk körlüğü için desenler

Renk körlüğü için desenler (`ChartStyle(patterns = true)`): ilk seri düz kalır, ötekilerin çubuklarına sırayla bir desen oyulur ve çizgiler sırayla kesik ve noktalı çizilir; lejant ve tooltip aynı deseni gösterir. Anahtarı kapat: desenler gider, seriler yalnızca renkleriyle ayrılır.

Bir seri kendi desenini `pattern` ile söyleyebilir (`ChartPattern`); söylenen desen anahtar kapalıyken de çizilir: burada tabletin çubuklarındaki noktalar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.BarSeries
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartPattern
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var patterns by remember { mutableStateOf(true) }
val half = VISITS.take(6)
PantrixSwitchButton(
    checked = patterns,
    onCheckedChange = { patterns = it },
    label = "Desenler",
    tagKey = "chart_patterns"
)
PantrixChart(
    series = listOf(
        BarSeries("desktop", "Masaüstü", half, x = { it.month }, y = { it.desktop }),
        BarSeries("mobile", "Mobil", half, x = { it.month }, y = { it.mobile }),
        BarSeries("tablet", "Tablet", half, x = { it.month }, y = { it.tablet }, pattern = ChartPattern.Dots)
    ),
    description = "İlk altı ayın cihaza göre ziyaretleri, desenli çubuklarla",
    style = ChartStyle(patterns = patterns),
    tagKey = "patterns"
)
PantrixChart(
    series = listOf(
        LineSeries("desktop", "Masaüstü", VISITS, x = { it.month }, y = { it.desktop }),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile }),
        LineSeries("tablet", "Tablet", VISITS, x = { it.month }, y = { it.tablet })
    ),
    description = "Aylara göre cihazların ziyaretleri, sırayla kesik çizgilerle",
    style = ChartStyle(patterns = patterns),
    tagKey = "patterns_lines"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

### Kendi renklerin ve ölçülerin

Bir grafiğin kendi renkleri ve ölçüleri. `ChartColors.series` serilere sırayla dağıtılan renklerdir; burada temanın grafik renkleri yerine paletten iki mor. Kılavuz çizgileri de bu grafikte daha soluk.

`ChartStyle` ölçüleri verir: çizgi daha kalın, işaretler daha büyük. Verilmeyen alan temanınki kalır. Bütün grafikler için aynı şey temaya verilir: renkler `PantrixColors.chart` ile, ölçüler temanın `styles`'ı ile.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.cartesian.LineSeries
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.common.ChartColors
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixPalette

val dark = LocalDemoDarkTheme.current
val violet = PantrixPalette.Violet
val pink = PantrixPalette.Pink
PantrixChart(
    series = listOf(
        LineSeries(
            key = "desktop",
            name = "Masaüstü",
            data = VISITS,
            x = { it.month },
            y = { it.desktop },
            marker = ChartMarker.Diamond
        ),
        LineSeries("mobile", "Mobil", VISITS, x = { it.month }, y = { it.mobile }, marker = ChartMarker.Triangle)
    ),
    description = "Aylara göre masaüstü ve mobil ziyaretler",
    style = ChartStyle(lineWidth = 3.dp, markerSize = 10.dp),
    colors = ChartColors(
        series = if (dark) listOf(violet.shade400, pink.shade300) else listOf(violet.shade600, pink.shade500),
        grid = PantrixTheme.colors.divider.copy(alpha = 0.5f)
    ),
    tagKey = "own_look"
)

private data class Visits(
    val month: String,
    val desktop: Int,
    val mobile: Int,
    val tablet: Int
)

private val VISITS = listOf(
    Visits("Oca", desktop = 186, mobile = 80, tablet = 40),
    Visits("Şub", desktop = 305, mobile = 200, tablet = 62),
    Visits("Mar", desktop = 237, mobile = 120, tablet = 58),
    Visits("Nis", desktop = 173, mobile = 190, tablet = 51),
    Visits("May", desktop = 209, mobile = 130, tablet = 66),
    Visits("Haz", desktop = 214, mobile = 140, tablet = 70),
    Visits("Tem", desktop = 280, mobile = 170, tablet = 76),
    Visits("Ağu", desktop = 310, mobile = 210, tablet = 83),
    Visits("Eyl", desktop = 268, mobile = 232, tablet = 90),
    Visits("Eki", desktop = 342, mobile = 250, tablet = 96),
    Visits("Kas", desktop = 390, mobile = 286, tablet = 91),
    Visits("Ara", desktop = 420, mobile = 301, tablet = 120)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalDemoDarkTheme`: Uygulamanın teması şu an koyu mu: ayar "Sistem"deyken sistemin modu, değilken ayarın kendisi.

## API

### PantrixChart

`import com.pantrixui.components.chart.cartesian.PantrixChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixChart(
    series: List<ChartSeries>,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    secondYAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    stacking: ChartStacking = ChartStacking.Normal,
    orientation: ChartOrientation = ChartOrientation.Vertical,
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    zoom: ChartZoom? = null,
    decimation: ChartDecimation? = ChartDecimation(),
    export: ChartExport? = null,
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null
)
```

Bir dizi yer boyunca değerlerin grafiği: her serinin her yerdeki değerinden geçen çizgiler ve dolgulu alanlar, o değerlere çıkan çubuklar, altlarında yerlerin, yanlarında değerlerin ekseniyle.

Grafiğe `series` verilir ve her biri kendi satırlarını taşır: serinin neyden çizildiğini, bir satırın nerede durduğunu ve değerinin ne olduğunu. Grafik, herhangi birinin adını verdiği her yeri, ilk adlandırıldıkları sırayla dizer. Farklı türden seriler tek grafikte çizilir, çubukların üstünde bir çizgi gibi, ve aynı satırlardan okunmaları gerekmez. Aynı `stack`'i adlandıran seriler birbirinin üstünde durur: değerleri olarak ya da `stacking`'in söylediği gibi, yığının her yerdeki toplamından aldıkları paylar olarak, her yığın ötekiler kadar yüksek.

Serilerin çevresinde grafiğin parçaları durur; her biri onu tarif eden değerle verilir ve `null` ile kaldırılır: iki eksen, `legend` ve `tooltip`. Oldukları gibi bırakıldıklarında eksenler yerleri ve yuvarlak değerleri, onlarda grafik boyunca çizgilerle yazar; lejant serileri ikincisinden itibaren listeler; tooltip gösterilen yerdeki değerleri gösterir.

**Değerlerin ikinci ekseni.** İkinci eksenle okunduğunu söyleyen bir seri, grafiğin öbür yanında yazılan kendi ölçeğiyle dizilir: bir miktar ve onun bir payı, bir sayı ve bir fiyat, tek grafikte. İşaretleri ilk eksenin çizgilerinde durur; böylece tek bir kılavuz ikisine de yeter. Her değer kendi ekseninin yazdığı gibi yazılır, tooltip'te ve ekran okuyucuda da.

**Aralıklar, adımlar ve mumlar.** Bir `RangeSeries`'in her yerde iki değeri vardır ve aralarında kalanı çizer: yerden yere bir bant olarak, ya da hiçbir eksenin üstünde durmayan bir çubuk olarak. Bir `WaterfallSeries` her değerini, bir öncekinin bittiği yerden başlayan bir adım olarak, toplamlarını da sıfırın üstünde çizer. Bir `CandlestickSeries`'in her yerde dört değeri vardır: neyle açılıp neyle kapandığı, ve aradaki en yüksek ile en düşük.

**An olan yerler.** Grafiğin her yeri bir `kotlin.time.Instant` ise yerler zamana göre dizilir: satırların sırası ne olursa olsun zaman sırasıyla, anları birbirinden ne kadar uzaksa o kadar aralıklı; satırı olmayan bir gün bir boşluk olur. Eksen, yeri olduğu kadar yuvarlak anlara, saatlere, günlere, aylara işaretlenir ve bir yer tarih olarak yazılır. İkisi de, yer ekseni `time`'ıyla başka bir şey söylemedikçe ekranın saatiyle (`LocalPantrixClock`) okunur ve temanın dilinde yazılır: bkz. `ChartTime`. Anların arasında bir ad olursa yerler yine eşit aralıklı adlar olur. Boşluksuz (gapless) yerler de eşit aralıklarla durur, bir borsanın kapalı olduğu günler için boşluk bırakılmaz; eksen her günün, haftanın ya da ayın ilk yerine işaretlenir.

**Sayı olan yerler.** Sayılar da her ad gibidir, satırların adlandırdığı sırayla eşit aralıklarla dizilir; yer ekseni `numeric` ise başka: yerler sayılarına göre, sıralarıyla ve birbirlerinden ne kadar uzaklarsa o kadar aralıklı dizilir, eksen yeri olan yuvarlak sayılara işaretlenir ve bir işaret herhangi bir sayıda durur.

**İşaretler.** Bir değerdeki ya da bir yerdeki çizgi, ve ikisinin arasındaki bant, seriler onlara göre okunsun diye serilerle birlikte çizilir: bir hedef, bir sınır, bir kampanyanın haftaları. Yerleri an olan grafikte bir işaret herhangi bir anda durur, bir satırın anı olsun olmasın. Bkz. `ChartMark`.

**Bir yeri göstermek.** Grafiğin üstündeki imleç en yakın yeri gösterir; parmak bir dokunuşla ya da grafik boyunca sürüklenerek gösterir, gösterdiği yere bir dokunuş da onu bırakır. Klavyeyle grafik Tab için tek bir duraktır: grafik boyunca oklar yerden yere gider, Home ve End ilkine ve sonuncusuna, Escape bırakır. Tooltip serileri ayırıyorsa yukarı ve aşağı oklar bir serinin değerinden ötekine gider. Yer işaretlenir, tooltip onun için gösterilir ve `state`'e söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra serilerin oradaki değerleriyle her yer, yerlerin sırasıyla; bir parmak da onları grafiğe dokunarak bulur. Lejantın kayıtları birer anahtardır. İki yüzden çok yeri olan bir grafik yalnızca açıklamasıyla anlatılır.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir. Modifier'ındaki bir yükseklik grafiğin tamamınındır, lejantınki de içinde; verilmezse çizim alanı grafiğin stilinin söylediği kadar yüksektir ve üstündeki ya da altındaki bir lejant kendi yüksekliğini ekler. Yazılacak yeri olmayan yerler bir kuralla atlanır, her ikincisi, her üçüncüsü: grafiğin değerleri oldukları yerde kalır.

Sağdan sola yazılan bir dilde yerler sağdan başlar ve değerler sağda yazılır.

```kotlin
PantrixChart(
    series = listOf(
        LineSeries("visits", "Visits", days, x = { it.day }, y = { it.visits }),
        LineSeries("orders", "Orders", days, x = { it.day }, y = { it.orders }, dash = ChartDash.Dashed)
    ),
    modifier = Modifier.height(240.dp),
    description = "Visits and orders of the last thirty days",
    tagKey = "traffic"
)
```

Parametreler:

- `series: List<ChartSeries>`: seriler, çizildikleri ve listelendikleri sırayla: sonraki, öncekinin üstüne çizilir. Anahtarları onları ayırır ve aynı anahtarı taşıyan iki seri geri çevrilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `xAxis: ChartAxis?`: yerlerin ekseni, grafiğin altında, yatay grafikte yanında. `null` ondan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin yanında, yatay grafikte altında. `null` ondan hiçbir şey çizmez.
- `secondYAxis: ChartAxis?`: değerlerin ikinci ekseni, grafiğin öbür yanında, yatay grafikte üstünde: bir seri, ya da bir değerdeki bir işaret, onunla okunuyorsa çizilir, yoksa çizilmez. `null` ondan hiçbir şey çizmez; onunla okunan yine ona göre dizilir.
- `marks: List<ChartMark>`: serilerin yanında çizim alanına çizilen çizgiler ve bantlar.
- `stacking: ChartStacking`: bir yığının serilerinin birbirinin üstünde nasıl durduğu: değerleri olarak ya da yığından aldıkları paylar olarak.
- `orientation: ChartOrientation`: yerlerin hangi yöne gittiği: grafiğin altı boyunca, sütunlar olarak, ya da yanından aşağı, yatay çubuklar olarak; her ad bir satırlık yerde yatay yazılır. Yakından bakılan yatay grafik yerlerinde yukarı ve aşağı gider, gezgin şeridi çizim alanının yanında durur.
- `legend: ChartLegend?`: serilerin adlarının durduğu yer. `null` hiç göstermez.
- `tooltip: ChartTooltip?`: gösterilen yer için gösterilen şey. `null` hiç göstermez.
- `zoom: ChartZoom?`: okuyucunun yerlerin bir kısmına yakından bakmasını ve geri kalanı boyunca kaydırmasını sağlayan şey. Grafiğe verilmedikçe `null`'dır; `null` bütün yerleri gösterir, başka bir şey yapmaz.
- `decimation: ChartDecimation?`: görünen noktaları çizim alanının yer bulduğundan çok olan bir çizginin, onların daha azından nasıl çizileceği. `null` her noktayı, kaç tane olursa olsun, çizer.
- `export: ChartExport?`: okuyucunun grafiği uygulamadan bir dosya olarak çıkarmasını sağlayan şey: bir resim, ya da her boyutta keskin bir çizim. Grafiğe verilmedikçe `null`'dır, ve grafiğin böyle bir düğmesi olmaz.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken çizim alanında gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar. Grafiğin dışa aktarıldığı dosya sözü yazar.
- `state: ChartState`: okuyucunun gizledikleri ve gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik serilerinin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan değerle çağrılır: gösterilen değerle, ya da yerin değerleri birlikte gösteriliyorsa basışa en yakın serinin değeriyle.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi için temanınkiler.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `Chart_<tagKey>`, çizim alanı `Chart_<tagKey>.Plot`, bir yeri, birden sayılarak, `Chart_<tagKey>.Point_<number>`, bir serinin lejant kaydı `Chart_<tagKey>.Legend_<series' key>` ve tooltip `Chart_<tagKey>.Tooltip` olur. Bir değere basış, serinin anahtarıyla bir `Chart` `select` olayı olarak, bir lejant kaydına basış da anahtarla ve serinin gösterilip gösterilmediğiyle bir `toggle` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.

### ChartSeries

`import com.pantrixui.components.chart.cartesian.ChartSeries`, `com.pantrixui:components` içinden

```kotlin
sealed class ChartSeries
```

Bir `PantrixChart`'taki bir değer dizisi: onun için ne çizildiği ve hangi satırlardan okunduğu.

Bir seri kendi satırlarını taşır. Bir grafiğin iki serisi tek bir listeden de, iki ayrı listeden de okunabilir ve aynı yerlerde durmak zorunda değildir: grafik, herhangi birinin adını verdiği her yeri ilk verildiği sırayla dizer; bir serinin ad vermediği yerde değeri yoktur.

Seri türleri, bir grafiğin çizdiği işaret türleridir: dolgulu olduğunda bir alan da olan `LineSeries`, `BarSeries`, bir yerde iki değeri olan `RangeSeries`, adımlardan oluşan `WaterfallSeries` ve bir yerde dört değeri olan `CandlestickSeries`. Türler aynı grafikte karışır.

Üyeleri:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `stack: String?`: Serinin neyle yığıldığı. Bir grafiğin aynı yığının adını veren serileri her yerde, verildikleri sırayla üst üste durur: ilki sıfırın üstünde, ötekilerin her biri bir öncekinin üstünde. Sıfırın altındaki bir değer sıfırdan aşağı iner, yığınının aşağı inen ötekilerinin altına. Null ise seri sıfırın üstünde tek başına durur. Bir yığın tek bir eksenin serilerinden oluşur: aynı yığının adını verip farklı eksenlerle okunan iki seri ayrı durur.
- `axis: ChartYAxis`: Serinin, grafiğin değer eksenlerinden hangisiyle okunduğu. İkinci eksendeki seri, grafiğin öbür yanında yazılan kendi ölçeğiyle dizilir: ilk eksenin değerlerinden başka türden ya da başka büyüklükte değerler için, bir miktarın yanında bir pay.
- `labels: ChartDataLabels?`: Serinin değerleri, verilmişse, işaretlerinin yanına yazılır: null ise hiçbiri yazılmaz.

### LineSeries

`import com.pantrixui.components.chart.cartesian.LineSeries`, `com.pantrixui:components` içinden

```kotlin
class LineSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    override val color: Color = Color.Unspecified,
    public val curve: ChartCurve = ChartCurve.Linear,
    public val fill: ChartFill = ChartFill.None,
    public val marker: ChartMarker = ChartMarker.None,
    public val dash: ChartDash? = null,
    public val missing: ChartMissing = ChartMissing.Gap,
    override val stack: String? = null,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null,
    public val pattern: ChartPattern? = null
) : ChartSeries()
```

Noktalarından geçen bir çizgi olarak, çizginin altı doldurulduğunda da bir alan olarak çizilen seri.

```kotlin
LineSeries("visits", "Visits", days, x = { it.day }, y = { it.visits })
```

`x` bir satırın grafik boyunca nerede durduğunu söyler: bir ad, bir gün, kendisine eşit olan herhangi bir şey, bir kategori olarak; grafik onu ekseninin `label`'ıyla yazar, o verilmediyse kendini yazdığı gibi. Grafiğin her satırı bir an, bir `kotlin.time.Instant` verdiğinde yerler zamana göre dizilir: bkz. `ChartTime`. `y` satırın değeridir, değeri yoksa null: çizginin orada ne yaptığını `missing` söyler. Sayı olmayan ya da sonu olmayan bir değer yok sayılır.

Kuruldukları her şey aynı olan iki seri, iki fonksiyon da dahil, aynı seridir: çağıranı serilerini her seferinde yeniden kuran bir grafik bunun için yeniden çizilmez.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar, çizginin onlardan geçtiği sırayla.
- `x: (T) -> Any`: Bir satırın grafik boyunca nerede durduğu.
- `y: (T) -> Number?`: Bir satırın değeri, yoksa null.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `curve: ChartCurve`: Çizginin bir noktadan ötekine nasıl gittiği.
- `fill: ChartFill`: Çizgiyle sıfırın arasını neyin doldurduğu: bir çizgi için hiçbir şey.
- `marker: ChartMarker`: Her noktayı neyin işaretlediği. Öncesinde ve sonrasında nokta olmayan bir nokta her zaman işaretlenir: tek bir noktadan geçen çizginin gösterecek bir şeyi yoktur. Grafiğin desenleri açıksa (`ChartStyle.patterns`), noktalarını hiçbir şeyle işaretlemeyen bir çizgi, grafiğinin dördüncü çizgisinden başlayarak sırayla bir işaret alır.
- `dash: ChartDash?`: Çizginin bütün mü, kesik mi, noktalı mı çizildiği: bir seriyi renginden fazlasıyla ayırmanın bir yolu ve bir tahmini ya da bir hedefi ölçülenden ayıran şey. Null ise bütün çizilir; grafiğin desenleri açıksa, grafiğin serileri arasındaki yerine göre bütün, kesik ya da noktalı.
- `missing: ChartMissing`: Bir satırın değeri olmadığında çizginin ne yaptığı.
- `stack: String?`: Serinin neyle yığıldığı: bir yığının çizgileri değerlerinin toplamlarından geçer ve dolgulu olduklarında her biri, üstünde durduğu çizgiye kadar dolar.
- `axis: ChartYAxis`: Serinin, grafiğin değer eksenlerinden hangisiyle okunduğu.
- `labels: ChartDataLabels?`: Serinin değerleri, noktalarının üstüne yazılır. Null hiçbirini yazmaz.
- `pattern: ChartPattern?`: Çizgi ile sıfır arasındaki yer doluysa, renginin yanında doldurulduğu desen. Null ise hiçbiri; grafiğin desenleri açıksa, grafiğin serileri arasındaki yerine göre sırasındaki desen.

### BarSeries

`import com.pantrixui.components.chart.cartesian.BarSeries`, `com.pantrixui:components` içinden

```kotlin
class BarSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    override val color: Color = Color.Unspecified,
    override val stack: String? = null,
    public val behind: Boolean = false,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null,
    public val pattern: ChartPattern? = null
) : ChartSeries()
```

Yerlerinin her birinde, sıfırdan değerine kadar bir çubuk olarak çizilen seri.

```kotlin
BarSeries("revenue", "Revenue", months, x = { it.name }, y = { it.revenue })
```

Bir grafiğin serilerinin çubukları bir yerde yan yana durur, her biri serisinin renginde; aynı `stack` adını veren seriler orada tek bir çubuğu paylaşır, her biri bir öncekinin üstünde. Çubuk, sıfırın üstündeki bir değer için sıfırdan yukarı, altındaki için aşağı gider; değeri olmayan satırın çubuğu yoktur.

Çubuğu olan bir grafik her yere genişliğinden bir bant verir ve aynı grafiğin bir çizgisi bantların ortasından geçer. Değer ekseni, eksen başka türlü söylemedikçe sıfırdan başlar: bir çubuğun boyu miktar olarak okunur ve sıfırın üstünden kesilen bir çubuk olduğundan azını gösterir.

Diğerlerinin arkasında (`behind`) duran bir seri, bir yerde kendine ait bir çubuk almaz: çubuğu o yerin yan yana duran bütün çubukları kadar geniştir ve arkada olmayan her seriden önce çizilir; bir günün hacmi, mumunun altında. Arkada duran iki seriden sonra verilen, öbürünün üstüne çizilir.

Kuruldukları her şey aynı olan iki seri, iki fonksiyon da dahil, aynı seridir.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar.
- `x: (T) -> Any`: Bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `y: (T) -> Number?`: Bir satırın değeri, yoksa null.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `stack: String?`: Serinin neyle yığıldığı. Bir grafiğin aynı yığının adını veren serileri her yerde, verildikleri sırayla üst üste durur: ilki sıfırın üstünde, ötekilerin her biri bir öncekinin üstünde. Sıfırın altındaki bir değer sıfırdan aşağı iner, yığınının aşağı inen ötekilerinin altına. Null ise seri sıfırın üstünde tek başına durur. Bir yığın tek bir eksenin serilerinden oluşur: aynı yığının adını verip farklı eksenlerle okunan iki seri ayrı durur.
- `behind: Boolean`: Serinin çubuklarının öbür serilerinkinin yanında değil, arkasında, hepsi kadar geniş durup durmadığı. Arkada duran bir seri hiçbir `stack`'te değildir.
- `axis: ChartYAxis`: Serinin, grafiğin değer eksenlerinden hangisiyle okunduğu.
- `labels: ChartDataLabels?`: Serinin değerleri, çubuklarının ucuna ve bir yığının çubuklarının içine yazılır. Null hiçbirini yazmaz.
- `pattern: ChartPattern?`: Çubukların renklerinin yanında çizildiği desen. Null ise hiçbiri; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki yerine göre sırasındaki desen.

### ChartAxis

`import com.pantrixui.components.chart.cartesian.ChartAxis`, `com.pantrixui:components` içinden

```kotlin
class ChartAxis(
    public val title: String? = null,
    public val labels: Boolean = true,
    public val line: Boolean? = null,
    public val grid: Boolean? = null,
    public val ticks: Int = 0,
    public val values: List<Double>? = null,
    public val min: Double? = null,
    public val max: Double? = null,
    public val startFromZero: Boolean? = null,
    public val format: ((Double) -> String)? = null,
    public val label: ((Any) -> String)? = null,
    public val time: ChartTime? = null,
    public val numeric: Boolean = false
)
```

Bir `PantrixChart`'ın bir ekseni: boyunca ne yazıldığı, ondan çizilen çizgiler ve, değerlerin ekseni için, nereye kadar gittiği.

Bir grafiğin, serilerinin boyunca durduğu bir ekseni vardır, satırlarının adını verdiği yerler, bir de orada sahip oldukları değerlerin ekseni; serileri iki türden değer taşıyan bir grafiğin, bir miktar ve onun bir payı, öbür yanında değerlerin ikinci bir ekseni vardır. Her biri kendisine uyanı alır, gerisini bırakır: yerlerin en azı ve en çoğu yoktur, değerlerin `label`'ı.

```kotlin
val strings = PantrixTheme.strings
PantrixChart(series = series, yAxis = ChartAxis(title = "Visits", format = { strings.compact(it) }))
```

Bir eksenin yerine `null` verilirse ondan hiçbir şey çizilmez: ne yazı, ne çizgi, ne kılavuz çizgisi. Seriler yine ona göre dizilir.

Parametreler:

- `title: String?`: Eksenin neyi ölçtüğü, yanına yazılır: yerlerin altına, ve değerlerin yanı boyunca döndürülerek. Verilmezse başlık yoktur.
- `labels: Boolean`: Yerlerin, ya da kılavuz çizgilerindeki değerlerin, yazılıp yazılmadığı. Yerlerin hepsine yer olmadığında her ikincisi ya da üçüncüsü yazılır; grafiğin genişliği az değiştikçe yine aynıları.
- `line: Boolean?`: Eksen boyunca bir çizgi çizilip çizilmediği. Verilmezse yerlerin altında bir çizgi vardır, değerlerin yoktur.
- `grid: Boolean?`: Eksenin her işaretinde grafik boyunca bir çizgi çizilip çizilmediği. Verilmezse değerlerin vardır, yerlerin yoktur; ikinci değer ekseninin ise ilk eksen çizilmediğinde, kendi işaretlerinde vardır.
- `ticks: Int`: Değerlerin ekseni boyunca yaklaşık kaç değerin işaretlendiği. Yuvarlak sayılarda dururlar ve birbirlerine o kadarının duracağından yakın olmazlar: daha az olabilirler. Sıfır, yer olduğu kadarını işaretler. Değerlerin ikinci ekseninin bunda sözü yalnızca kendi başına işaretlendiğinde vardır: bir ucunu verdiğinde ya da kendi `values`'u olduğunda. Öbür durumda işaretleri ilkinin çizgilerinde durur.
- `values: List<Double>?`: Değerlerin ekseni boyunca, yuvarlak adımların yerine işaretlenen değerler: günün saatleri için `listOf(0.0, 6.0, 12.0, 18.0, 24.0)`. Eksenin uçları arasında kalanlar işaretlenir; verilmeyen uç, bunların ve eksenin gösterdiği değerlerin en uzağına kadar gider. `ticks` okunmaz. Kendi değerleri verilen ikinci değer ekseni kendi başına işaretlenir ve kılavuz çizgileri ilkinin kalır.
- `min: Double?`: Eksenin gösterdiği en az değer. Verilmezse değerlerin en azının altındaki yuvarlak bir sayıdır, ya da `startFromZero` öyle diyorsa sıfır. Bir ucunu veren ikinci değer ekseni kendi başına işaretlenir.
- `max: Double?`: Eksenin gösterdiği en çok değer. Verilmezse değerlerin en çoğunun üstündeki yuvarlak bir sayıdır.
- `startFromZero: Boolean?`: Değerlerin ekseninin, her değer çok üstünde olsa da sıfırdan başlayıp başlamadığı, ya da her değer altında olsa da orada bitip bitmediği. Verilmezse bir seri dolguluysa başlar, çünkü dolgulu bir alanın yüksekliği miktar olarak okunur; yalnızca çizgiler varsa başlamaz, çünkü onlarda okunan iniş ve çıkıştır.
- `format: ((Double) -> String)?`: Eksenin bir değerinin nasıl yazıldığı: eksenin yanında, tooltip'te ve ekran okuyucuda. Verilmezse eksenin yanında bir değer on binden itibaren kısa yazılır (`12K`), başka her yerde tam, temanın diliyle.
- `label: ((Any) -> String)?`: Bir yerin nasıl yazıldığı, bir serinin `x`'inin o yer için verdiği şeyle: grafiğin altında, tooltip'in başlığı olarak ve ekran okuyucuya. Verilmezse kendini yazdığı gibi yazılır, tam sayıysa temanın rakamlarıyla. Yerleri an olan grafikte bir yerin tooltip'te ve ekran okuyucuda nasıl yazıldığını söyler; eksenin işaretlerini yazmak `time`'ındır.
- `time: ChartTime?`: Yerleri an olan, her biri bir `kotlin.time.Instant` olan grafik için: nasıl yazıldıkları ve hangi saate göre okundukları. Verilmezse temanın diliyle ve ekranın saatiyle (`LocalPantrixClock`). Bir değer ekseni bunun hiçbirini okumaz.
- `numeric: Boolean`: Yerlerinin hepsi sayı olan bir yer ekseninin onları sayılarına göre dizip dizmediği: sıralarıyla, birbirlerinden ne kadar uzaklarsa o kadar aralıklı; eksen yuvarlak sayılara işaretlenir ve her biri `format`'ın söylediği gibi yazılır, `label` bir şey söylemedikçe yerler de öyle; grafiğin bir işareti de aralarındaki herhangi bir sayıda durur. Verilmezse sayılar da her ad gibidir: satırların adlandırdığı sırayla, eşit aralıklarla dizilir; yıllar, haftaların numaraları gibi. Bir değer ekseni bunun hiçbirini okumaz.

### ChartYAxis

`import com.pantrixui.components.chart.cartesian.ChartYAxis`, `com.pantrixui:components` içinden

```kotlin
enum class ChartYAxis
```

Bir serinin, ya da bir değerdeki bir işaretin, grafiğin değer eksenlerinden hangisiyle okunduğu.

Değerleri:

- `First`: Grafiğin değer ekseni, satırların başladığı yanda yazılır: `yAxis`'i.
- `Second`: Grafiğin ikinci değer ekseni, öbür yanında yazılır: `secondYAxis`'i.

### ChartTime

`import com.pantrixui.components.chart.cartesian.ChartTime`, `com.pantrixui:components` içinden

```kotlin
class ChartTime(
    public val format: ((Instant, ChartTimeUnit) -> String)? = null,
    public val offset: ((Instant) -> Duration)? = null,
    public val gapless: Boolean = false
)
```

Yerleri an olan bir grafiğin onları nasıl yazdığı ve hangi saate göre okuduğu: yerlerin eksenine `time`'ı olarak verilen şey.

Bir grafiğin yerleri, her biri bir `kotlin.time.Instant` olduğunda andır. Böyle bir grafik yerlerini anlarının olduğu yere dizer, satırlarının sırası ne olursa olsun zaman sırasıyla: iki gün arayla duranlar, bir gün arayla duranların iki katı uzaktır, ve satırı olmayan gün bir boşluktur. Ekseni yuvarlak anlara işaretlenir, her saate, her güne, her aya, yeri olduğu kadarına, ve her işaret neyle sayılıyorsa onunla yazılır.

```kotlin
PantrixLineChart(
    data = readings,
    x = { it.at },
    series = listOf(ChartValue("temperature", "Temperature") { it.degrees }),
    xAxis = ChartAxis(time = ChartTime(offset = { Duration.ZERO }))
)
```

Hiçbir şey verilmek zorunda değildir: verilmezse anlar temanın diliyle yazılır ve ekranın saatiyle (`LocalPantrixClock`) okunur; bir test ya da önizleme başkasını vermedikçe cihazınkiyle.

Bir borsa bazı günler açık, bazı günler kapalıdır ve fiyatlarının grafiğinde kapalı olduğu yerler boşluk olur. `gapless` olan yerler bunun yerine eşit aralıklarla, adlar gibi zaman sırasıyla art arda durur; eksen de her yuvarlak zaman diliminin, her günün, her haftanın, her ayın ilk yerine, yeri olduğu kadar işaretlenir.

Parametreler:

- `format: ((Instant, ChartTimeUnit) -> String)?`: Bir anın nasıl yazıldığı, anın kendisi ve neye kadar yazıldığıyla: eksenin bir işareti, işaretlerin arasındaki birime kadar; bir yer de, tooltip'te ve ekran okuyucuda, grafiğin yerlerini birbirinden ayıran en ince birime kadar. Verilmezse bir işaret kısa yazılır, bir saat `14:00`, bir gün `13 Eki`, bir ay adıyla ve bir ocak yılıyla; bir yer de tam yazılır, `13 Eki 2026 14:00`; hepsi temanın diliyle. Bir yerin nasıl yazıldığı için önce eksenin `label`'ına sorulur.
- `offset: ((Instant) -> Duration)?`: Grafiğin okunduğu saatin bir anda UTC'den ne kadar ileride olduğu: bir anın hangi güne ait olduğunu ve bir günün nerede başladığını söyleyen şey. Verilmezse ekranın saatidir (`LocalPantrixClock`), bir test ya da önizleme başkasını vermedikçe cihazınki. Satırları UTC günleri olan veri için `{ Duration.ZERO }`'dur; bir saat dilimi kütüphanesi olan uygulama, gösterdiği dilimi ona sorar.
- `gapless: Boolean`: Yerlerin, satırların bir şey taşımadığı aradaki zaman için boşluk bırakmadan eşit aralıklarla durup durmadığı: bir borsanın kapalı olduğu günler. Grafiğin iki yer arasındaki bir andaki işareti aralarında, zamanda her birine ne kadar uzaksa o kadar uzakta durur; ilk yerden önceki ya da son yerden sonraki işaret çizilmez.

### ChartTimeUnit

`import com.pantrixui.components.chart.cartesian.ChartTimeUnit`, `com.pantrixui:components` içinden

```kotlin
enum class ChartTimeUnit
```

Bir grafiğin zaman ekseninin, bir anı yazarken neyle saydığı: en inceden en kabaya.

Değerleri:

- `Second`: Saniyeler: eksenin saydığı en ince birim.
- `Minute`: Dakikalar.
- `Hour`: Saatler.
- `Day`: Günler.
- `Month`: Aylar.
- `Year`: Yıllar: eksenin saydığı en kaba birim.

### ChartMark

`import com.pantrixui.components.chart.cartesian.ChartMark`, `com.pantrixui:components` içinden

```kotlin
sealed class ChartMark
```

Bir `PantrixChart`'ın, serilerinin yanında, onlara göre okunsunlar diye çizim alanına çizdiği şey: bir değerde ya da bir yerde bir çizgi, ikisinin arasında bir bant.

```kotlin
PantrixChart(
    series = series,
    marks = listOf(
        ChartReferenceLine(y = 500, label = "Target"),
        ChartReferenceBand(x1 = "Jun", x2 = "Aug", label = "Summer")
    )
)
```

Bir değerdeki işaret, adını verdiği değer eksenine göre çizilir ve o eksen onu gösterecek kadar uzar. Grafiğin hiçbir serisinin adını vermediği bir yerdeki işaret çizilmez. Etiketi olan işaret, ekran okuyucuya grafiğin açıklamasından sonra, durduğu değerle ya da yerle söylenir.

Yerleri an, her biri bir `kotlin.time.Instant` olan bir grafikte bir yerdeki işaret, bir satır o anı adlandırsın ya da adlandırmasın, herhangi bir anda durur; bir bant da bir andan ötekine gider: bir sürümün saati, bir tatilin günleri. Zaman ekseni, satırlardan önce ya da sonra duran bir işarete kadar uzar; bir değer ekseninin bir değerdeki işarete kadar uzaması gibi. Yerleri eşit aralıklarla duran eksen (`ChartTime.gapless`) uzamaz ve satırlarının dışındaki işaret çizilmez. Sayı olan bir yer ekseninde (`ChartAxis.numeric`) bir işaret aynı biçimde herhangi bir sayıda durur.

Bir saçılım grafiği de onları çizer. Onun iki ekseni de değer eksenidir: bir yerdeki işaret orada grafik boyunca uzanan eksenin bir değerinde, bir sayıda durur ve o eksen onu gösterecek kadar uzar.

Üyeleri:

- `label: String?`: İşaretin yanına yazılan ve ekran okuyucuya onun için söylenen şey. Verilmezse işaretin sözü yoktur.
- `color: Color`: İşaretin çizildiği renk. Verilmezse eksenlerin yazıldığı renktir.
- `axis: ChartYAxis`: İşaretin değerlerinin, grafiğin değer eksenlerinden hangisiyle okunduğu. Bir yerdeki işaretin bununla işi yoktur.
- `labelPosition: ChartMarkLabelPosition`: Etiketin işaret boyunca yazıldığı yer.
- `inFront: Boolean`: İşaretin serilerin arkasına değil üstüne çizilip çizilmediği. Etiketi her iki durumda da serilerin üstüne, tooltip renginde bir zeminin üstüne yazılır: bir çubuğun üstünde ve bir çizginin üzerinde de okunsun diye.

### ChartReferenceLine

`import com.pantrixui.components.chart.cartesian.ChartReferenceLine`, `com.pantrixui:components` içinden

```kotlin
class ChartReferenceLine(
    public val y: Number? = null,
    public val x: Any? = null,
    override val label: String? = null,
    override val color: Color = Color.Unspecified,
    public val dash: ChartDash = ChartDash.Dashed,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labelPosition: ChartMarkLabelPosition = ChartMarkLabelPosition.End,
    override val inFront: Boolean = true
) : ChartMark()
```

Çizim alanından geçen bir çizgi: `y` değerinde boydan boya, ya da `x` yerinde yukarı doğru; ikisinden biri.

```kotlin
ChartReferenceLine(y = 500, label = "Target")
ChartReferenceLine(x = "Mar", label = "Launch", dash = ChartDash.Dotted)
```

Aksi söylenmedikçe serilerin üstüne, stilin `markLineWidth` değeri kadar kalın çizilir. Etiketi, çizim alanı boyunca uzanan bir çizginin üstüne, alanın tepesine çok yakınsa altına; yukarı doğru bir çizginin yanına yazılır. Aksi söylenmedikçe sonunda: çizgilerin bittiği yanda ve yukarı doğru bir çizginin tepesinde.

Kuruldukları her şey aynıysa iki çizgi aynı çizgidir.

Parametreler:

- `y: Number?`: Çizginin durduğu değer.
- `x: Any?`: Çizginin durduğu yer: bir serinin `x`'inin o yer için verdiği şey.
- `label: String?`: İşaretin yanına yazılan ve ekran okuyucuya onun için söylenen şey. Verilmezse işaretin sözü yoktur.
- `color: Color`: İşaretin çizildiği renk. Verilmezse eksenlerin yazıldığı renktir.
- `dash: ChartDash`: Çizginin bütün mü, kesik mi, noktalı mı çizildiği.
- `axis: ChartYAxis`: İşaretin değerlerinin, grafiğin değer eksenlerinden hangisiyle okunduğu. Bir yerdeki işaretin bununla işi yoktur.
- `labelPosition: ChartMarkLabelPosition`: Etiketin işaret boyunca yazıldığı yer.
- `inFront: Boolean`: İşaretin serilerin arkasına değil üstüne çizilip çizilmediği. Etiketi her iki durumda da serilerin üstüne, tooltip renginde bir zeminin üstüne yazılır: bir çubuğun üstünde ve bir çizginin üzerinde de okunsun diye.

### ChartMarkLabelPosition

`import com.pantrixui.components.chart.cartesian.ChartMarkLabelPosition`, `com.pantrixui:components` içinden

```kotlin
enum class ChartMarkLabelPosition
```

Bir `ChartMark`'ın etiketinin işaret boyunca yazıldığı yer.

Çizim alanı boyunca uzanan bir çizgide ve her bantta çizgilerin gittiği yöne gider: çizgilerin başladığı yandan bittiği yana. Yukarı doğru bir çizgide değerlerin gittiği yöne, çizginin dibinden tepesine gider.

Değerleri:

- `Start`: Çizgilerin başladığı yanda ya da yukarı doğru bir çizginin dibinde.
- `Center`: Yolun yarısında.
- `End`: Çizgilerin bittiği yanda ya da yukarı doğru bir çizginin tepesinde.

### ChartStacking

`import com.pantrixui.components.chart.cartesian.ChartStacking`, `com.pantrixui:components` içinden

```kotlin
enum class ChartStacking
```

Bir `PantrixChart`'ta bir yığının serilerinin birbirinin üstünde nasıl durduğu: değerleri olarak ya da yığının her yerdeki toplamından aldıkları paylar olarak.

Değerleri:

- `Normal`: Değerleri olarak: bir yığın, serilerinin değerlerinin toplamı kadar yüksektir.
- `Percent`: Payları olarak: her yığın ötekiler kadar, yüzde yüz yüksektir ve her seri ondan payını alır: değerinin, yığınının o yerdeki değerlerinin toplamına oranı, sıfırın altında ya da üstünde. Yığınların okunduğu eksen, kendi yazımı yoksa pay yazar; tooltip bir değeri ardından payıyla, etiket payı yazar. Hiçbir yığında olmayan seri yine de değerleri olarak çizilir: onu ikinci eksenle oku.

### ChartReferenceBand

`import com.pantrixui.components.chart.cartesian.ChartReferenceBand`, `com.pantrixui:components` içinden

```kotlin
class ChartReferenceBand(
    public val y1: Number? = null,
    public val y2: Number? = null,
    public val x1: Any? = null,
    public val x2: Any? = null,
    override val label: String? = null,
    override val color: Color = Color.Unspecified,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labelPosition: ChartMarkLabelPosition = ChartMarkLabelPosition.Start,
    override val inFront: Boolean = false
) : ChartMark()
```

Çizim alanının gölgelenmiş bir bandı: `y1` ile `y2` değerlerinin arasında boydan boya, ya da `x1` ile `x2` yerlerinin arasında yukarı doğru; ikisinden biri.

```kotlin
ChartReferenceBand(y1 = 300, y2 = 450, label = "Usual")
ChartReferenceBand(x1 = "Jun", x2 = "Aug", label = "Summer")
ChartReferenceBand(y1 = 900, label = "Too many")
```

Tek ucu olan bant oradan eksenin sonuna gider: yalnızca `y1` eksenin tepesine kadar, yalnızca `y2` ayağından başlayarak, yalnızca `x1` son yere kadar, yalnızca `x2` ilk yerden başlayarak. Çubuğu olan bir grafiğin iki yeri arasında ikisinin de çubuklarını içine alır.

Aksi söylenmedikçe serilerin arkasına, renginin stilin `markBandAlpha` değerinin söylediği kadarıyla bir tonunda çizilir. Etiketi içine, tepesine yazılır: aksi söylenmedikçe çizgilerin başladığı yandaki köşesine.

Kuruldukları her şey aynıysa iki bant aynı banttır.

Parametreler:

- `y1: Number?`: Bandın başladığı değer.
- `y2: Number?`: Bittiği değer.
- `x1: Any?`: Bandın başladığı yer: bir serinin `x`'inin o yer için verdiği şey.
- `x2: Any?`: Bittiği yer.
- `label: String?`: İşaretin yanına yazılan ve ekran okuyucuya onun için söylenen şey. Verilmezse işaretin sözü yoktur.
- `color: Color`: İşaretin çizildiği renk. Verilmezse eksenlerin yazıldığı renktir.
- `axis: ChartYAxis`: İşaretin değerlerinin, grafiğin değer eksenlerinden hangisiyle okunduğu. Bir yerdeki işaretin bununla işi yoktur.
- `labelPosition: ChartMarkLabelPosition`: Etiketin işaret boyunca yazıldığı yer.
- `inFront: Boolean`: İşaretin serilerin arkasına değil üstüne çizilip çizilmediği. Etiketi her iki durumda da serilerin üstüne, tooltip renginde bir zeminin üstüne yazılır: bir çubuğun üstünde ve bir çizginin üzerinde de okunsun diye.

### ChartDataLabels

`import com.pantrixui.components.chart.common.ChartDataLabels`, `com.pantrixui:components` içinden

```kotlin
class ChartDataLabels(
    public val format: ((Double) -> String)? = null,
    public val position: ChartDataLabelPosition = ChartDataLabelPosition.Auto,
    public val total: Boolean = false
)
```

Bir serinin grafiğe yazılan değerleri, her biri işaretinin yanında: bir çizginin noktasının üstünde, bir çubuğun ucunda ve bir yığının çubuğunun içinde; orada siyahla beyazdan, çubuğun renginde daha iyi okunanıyla.

```kotlin
BarSeries("revenue", "Revenue", months, x = { it.name }, y = { it.revenue }, labels = ChartDataLabels())
BarSeries("online", "Online", months, x = { it.name }, y = { it.online }, stack = "sales",
    labels = ChartDataLabels(position = ChartDataLabelPosition.InsideEnd, total = true))
```

Bir değerin etiketi, etiketin yeri olan yerde yazılır. Kendi yerini bulan bir etiket, başka birinin üstüne gelecekse ya da grafikten taşacaksa noktasının altına ya da çubuğunun ucunun içine yazılır; orada da yeri yoksa atlanır, bir çubuğun tutamayacağı kadar büyük olan da. `position`'ın söylediği yere yazılanın başka yeri yoktur. Değer tooltip'te ve ekran okuyucuda yine durur. İki yüzden çok yeri olan grafik hiçbirini yazmaz.

Grafiğin değerleri okumak için çizdiği bir çizgi bir etiketin içinden geçiyorsa etiketin olduğu yerde örtülür: etiket bir zeminin üstüne yazılır, çubuğun dışında tooltip renginde, içinde çubuğun renginde.

`position` ve `total` eksenli bir grafiğindir: pasta ve ısı haritası etiketlerini kendi yerlerine yazar.

Bir değeri aynı biçimde, aynı yere yazan iki etiket aynıdır.

Parametreler:

- `format: ((Double) -> String)?`: Bir değerin nasıl yazılacağı. Verilmezse serinin okunduğu eksenin değerlerini yazdığı gibi, o da bir şey söylemiyorsa temanın dilinde, on binden sonra kısa yazılır. Paylar olarak duran bir yığında bir değerin payı verilir; verilmezse pay yüzde olarak yazılır.
- `position: ChartDataLabelPosition`: Bir değerin çubuğunda nereye yazılacağı. Bir çizginin noktasının etiketi, bu ne derse desin, noktanın üstüne, orada yeri yoksa altına yazılır.
- `total: Boolean`: Serinin bir yığınının her yerdeki toplamının, yığının ucunun ötesine yazılıp yazılmadığı: toplam sıfır ya da üstündeyse yığının üstüne, altındaysa altına. `format`'ın söylediği gibi yazılır; ama paylar olarak duran bir yığında temanın dilinde, çünkü o bir pay değildir. Yığının bir serisinin istemesi yeter.

### ChartDataLabelPosition

`import com.pantrixui.components.chart.common.ChartDataLabelPosition`, `com.pantrixui:components` içinden

```kotlin
enum class ChartDataLabelPosition
```

Bir değerin etiketinin çubuğunda nereye yazıldığı. Bir çubuk boyunca uç değerinin olduğu yer, baş da çubuğun durduğu yerdir: sıfır, yığınındaki bir önceki çubuk, bir aralığın alt değeri.

Değerleri:

- `Auto`: Yeri olan yerde: tek başına duran çubuğun ucunun ötesinde, orada yeri yoksa o ucun içinde; bir yığının çubuğunda ortasında.
- `Outside`: Çubuğun ucunun ötesinde. Bir yığında, bir sonraki değerin çubuğunun durduğu yerde, onun yerine kendi çubuğunun ucunun içine yazılır.
- `InsideEnd`: Çubuğun içinde, ucunda.
- `Center`: Çubuğun ortasında.
- `InsideStart`: Çubuğun içinde, başında.

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

### ChartLegendPosition

`import com.pantrixui.components.chart.common.ChartLegendPosition`, `com.pantrixui:components` içinden

```kotlin
enum class ChartLegendPosition
```

Bir grafiğin lejantının hangi yanında durduğu.

Değerleri:

- `Top`: Grafiğin üstünde.
- `Bottom`: Grafiğin altında: başka bir şey söylenmedikçe bir lejantın durduğu yer.
- `Start`: Satırların başladığı yer: grafiğin solu, sağdan sola yazılan bir dilde sağı.
- `End`: Satırların bittiği yer.

### ChartLegendAlignment

`import com.pantrixui.components.chart.common.ChartLegendAlignment`, `com.pantrixui:components` içinden

```kotlin
enum class ChartLegendAlignment
```

Bir lejantın, grafiğin kendi yanında ona ayrılan yerde nerede durduğu.

Değerleri:

- `Start`: Kendi kenarının başında: solda, sağdan okunan bir dilde sağda.
- `Center`: Kendi kenarının ortasında: başka bir şey söylenmedikçe durduğu yer.
- `End`: Kendi kenarının sonunda.

### ChartTooltip

`import com.pantrixui.components.chart.common.ChartTooltip`, `com.pantrixui:components` içinden

```kotlin
class ChartTooltip(
    public val shared: Boolean = true,
    public val crosshair: Boolean = true,
    public val format: ((Double) -> String)? = null,
    public val content: (@Composable (points: List<ChartPoint>) -> Unit)? = null
)
```

Bir grafiğin tooltip'i: gösterilen yerdeki değerler, yerin yanındaki küçük bir kartta.

İmlecin altında, parmağın grafiğe dokunduğu ya da grafik boyunca sürüklendiği yerde ve ok tuşlarının gittiği yerde açılır. İmleç ayrılınca, yere ikinci kez dokununca ve Escape ile kapanır. Grafiğin içinde, yerin yanında, kendisine yer olan yanda durur. İki yanında da yeri olmayacak kadar dar bir grafikte yerin üstünde, çizim alanının o yerin değerlerinin olmadığı ucunda durur. Basış almaz: altındaki, o orada değilmiş gibi basılır.

Yerine `null` verilirse hiç gösterilmez. Gösterilen yer yine işaretlenir ve yine grafiğin durumuna söylenir.

Parametreler:

- `shared: Boolean`: Tooltip'in yerin mi olduğu, her serinin oradaki değeriyle, yoksa imlece en yakın tek serinin mi. Birlikte, bir grafiğin bir yerde nasıl okunduğudur ve parmağın nişan almasını istemez; ayrı ayrı, serileri tek tek okunan bir grafiğe uyar.
- `crosshair: Boolean`: Yerin grafik boyunca işaretlenip işaretlenmediği: içinden geçen bir çizgiyle, çubuğu olan bir grafikte de bandının üstündeki bir gölgeyle.
- `format: ((Double) -> String)?`: Bir değerin tooltip'te ve ekran okuyucuya nasıl yazıldığı, eksenin yazdığı gibi değilse: değer ekseni olmayan bir grafik sayılarının ne olduğunu burada söyler. Verilmezse eksenin `format`'ı yazar, eksenin de yoksa temanın dili.
- `content: (@Composable (points: List<ChartPoint>) -> Unit)?`: Kartın kendi içeriği, başlığın ve satırların yerine: yerdeki değerleri alır, seriler ayrılıyorsa gösterileni. Çevresindeki kart grafiğin kalır.

### ChartZoom

`import com.pantrixui.components.chart.common.ChartZoom`, `com.pantrixui:components` içinden

```kotlin
class ChartZoom(
    public val closest: Float = 20f,
    public val buttons: Boolean = true,
    public val navigator: Boolean = false,
    public val fitValues: Boolean = false
)
```

Okuyucunun bir grafiğin bir kısmına yakından bakmasını sağlayan şey: grafiğe `zoom` olarak verilir ve okuyucu grafiğin yerlerinin bir kısmını, grafik genişliğinde, görünüme getirir ve geri kalanı boyunca kaydırır.

Görünen kısım grafiğin `ChartState`'inde, `window` olarak tutulur: ekran onu oradan okur ve `zoomTo` ile `resetZoom` ile söyler. Aynı durumu alan iki grafik yerlerinin aynı kısmını gösterir; böylece birine yakından bakılınca ötekine de bakılır. `zoom` verilen bir Gantt grafiği zamanına aynı yolla yakından bakar, bir scatter grafik de iki değerine; dikeydeki kısım durumun `valueWindow`'unda tutulur. İkisinin de gezgin şeridi yoktur.

- Fareyle: Ctrl ya da Mac'te Command basılıyken çevrilen tekerlek imlecin altındaki yere yakınlaşır, yerler boyunca çevrilen tekerlek yerler boyunca kaydırır: yana, ya da yerleri yanından aşağı dizilen grafikte yukarı ve aşağı; yerlerin bir kısmı görünürken sürüklemek de öyle. Başka her çevirme sayfaya bırakılır; görünen kısmı daha öteye götürmeyen, yerlerin bir ucundaki çevirme de.

- Parmakla: birbirinden uzaklaşan iki parmak aralarındaki noktaya yakınlaşır, grafik boyunca birlikte kayan iki parmak yerleri de götürür. Tek parmak her grafikteki gibi bir yeri gösterir.

- Klavyeyle, grafiğin üstünde: artı yakınlaştırır, eksi uzaklaştırır, ikisi de gösterilen yerin çevresinde; sıfır bütün yerleri yeniden gösterir, oklar gittikleri yeri görünüme getirir.

- Düğmelerle (`buttons`), bunların hiçbiri olmayan ya da sürüklemek istemeyen için: yerler boyunca geri ve ileri, uzaklaştır, yakınlaştır ve bütün yerler.

- Gezgin şeridiyle (`navigator`), grafiğin altında, yerleri yanından aşağı dizilen grafikte ise yanında, bütün yerlerin üstünde durduğu bir şerit: görünen kısım onun üstünde işaretlidir, şerit boyunca sürüklenir ve iki ucundan genişletilip daraltılır.

Değer eksenleri bütün değerlerin gerektirdiği gibi kalır; böylece okuyucu yerler boyunca kaydırırken oynamazlar. Grafik `fitValues` ile değerlere oturacaksa, yakından bakıldıkça eksenler görünen değerlere göre yeniden kurulur ve az değişen bir bölüm çizim alanını doldurur. Gezgin şeridinin çizgileri bütün değerlerin eksenlerinde kalır.

```kotlin
PantrixLineChart(data = days, x = { it.day }, values = visits, zoom = ChartZoom(navigator = true))
```

Parametreler:

- `closest: Float`: Grafiğe, bütün yerlerine göre en çok kaç kat yakından bakılabileceği: yirmi, yerlerin yirmide birini gösterir. Bir ya da daha çok.
- `buttons: Boolean`: Grafiğin düğme satırı olup olmadığı: çizim alanının üstünde, satırların bittiği yanda.
- `navigator: Boolean`: Grafiğin, çizim alanının altındaki, yerleri yanından aşağı dizilen grafikte ise yanındaki şeridi olup olmadığı. Şerit grafiğin stilinin söylediği kadar yüksek, yandaysa o kadar geniştir: `navigatorHeight`.
- `fitValues: Boolean`: Yerlerin bir kısmı görünürken değer eksenlerinin görünen yerlerin değerlerine ve işaretlere göre kurulup kurulmadığı: bütün yerler için kurulan bir eksen gibi, sıfırı içine alan eksende sıfırdan, uçları verilmiş eksende o uçlar arasında.

### ChartDecimation

`import com.pantrixui.components.chart.common.ChartDecimation`, `com.pantrixui:components` içinden

```kotlin
class ChartDecimation(
    public val threshold: Int? = null,
    public val algorithm: DecimationAlgorithm = DecimationAlgorithm.MinMax
)
```

Görünen noktaları ayrı ayrı çizilemeyecek kadar çok olan bir çizgiye grafiğin ne yaptığı: grafiğe `decimation` olarak verilince çizgiyi onların bir kısmından, birinden ötekine düz olarak geçirir ve noktaların işaretleri çizilmez. Hiçbiri verilmeyen grafik her noktayı, kaç tane olursa olsun, çizer.

```kotlin
PantrixLineChart(data = readings, x = { it.time }, values = levels, decimation = ChartDecimation(threshold = 2000))
```

Parametreler:

- `threshold: Int?`: Bir çizginin kaç yeri görünürken seyreltileceği. Verilmezse, çizim alanının piksel genişliğinin iki katı.
- `algorithm: DecimationAlgorithm`: Noktalardan hangilerinin tutulacağı.

### DecimationAlgorithm

`import com.pantrixui.components.chart.common.DecimationAlgorithm`, `com.pantrixui:components` içinden

```kotlin
enum class DecimationAlgorithm
```

Görünen noktaları çizim alanının yer bulduğundan çok olan bir çizginin, onların daha azından nasıl çizileceği.

Değerleri:

- `MinMax`: Çizim alanının bir piksel kolonunda duran noktalardan ilki, en yükseği, en düşüğü ve sonuncusu: çizgi, bütün noktalardan geçen çizginin boyayacağı her pikseli boyar, tepeleri ve çukurları da.
- `Lttb`: Çizim alanı kaç piksel genişse o kadar nokta; her biri, payına düşen noktalardan, kendinden önce tutulan noktayla ve sonraki payla en büyük üçgeni kuran (Largest-Triangle-Three-Buckets, Steinarsson, 2013): çizgi piksel başına bir noktayla şeklini korur, ama tutulan iki nokta arasındaki bir tepe kesilir.

### ChartPattern

`import com.pantrixui.components.chart.common.ChartPattern`, `com.pantrixui:components` içinden

```kotlin
enum class ChartPattern
```

Bir grafiğin dolgusunun renginin yanında çizildiği bir desen: renklerini ayırt edemeyen bir okuyucu için iki seriyi birbirinden ayıran şey; ekranda, lejantta, tooltip'te ve grafiğin dışa aktarıldığı dosyada.

Desen, dolgunun içine grafiğin üstünde durduğu şeyin renginde oyuk gibi oyulur: bir çubuk kendi renginde kalır, üstünde çizgiler ya da noktalar olur.

Bir grafiğin stili desenleri açtığında (`ChartStyle.patterns`), desen söylemeyen her seri, dilim ya da karo sırayla birini alır: ilki hiçbirini, sonrakiler `Diagonal`'dan başlayarak burada sayıldıkları sırayla. Desen söyleyen, grafiğin desenleri açık da olsa kapalı da olsa onu alır; `None` dolguyu düz bırakır.

Değerleri:

- `None`: Desen yok: dolgu yalnızca renginden ibarettir.
- `Diagonal`: Soldan yükselen çizgiler, eğik çizgi yönünde.
- `Dots`: Sıra sıra noktalar, her ikinci sıra yarım adım kaydırılmış.
- `HorizontalLines`: Yatay çizgiler.
- `Crosshatch`: Soldan yükselen ve alçalan çizgiler, kesişerek.
- `DiagonalReverse`: Soldan alçalan çizgiler, ters eğik çizgi yönünde.
- `VerticalLines`: Dikey çizgiler.
- `Grid`: Yatay ve dikey çizgiler.
- `Zigzag`: Sıra sıra zikzaklar.

### ChartExport

`import com.pantrixui.components.chart.export.ChartExport`, `com.pantrixui:components` içinden

```kotlin
class ChartExport(
    public val formats: List<ChartExportFormat> = ChartExportFormat.entries,
    public val fileName: String = "chart",
    public val scale: Float = 2f,
    public val background: Color = Color.Unspecified,
    public val padding: Dp = 12.dp,
    public val onExport: (ChartExportFile) -> Unit
)
```

Okuyucunun bir grafiği uygulamadan dosya olarak çıkarmasını sağlayan şey: grafiğe `export` olarak verilir ve grafiğin kendi düğmelerinin arasına bir düğme koyar; düğme dosyayı üretir ve `onExport`'a verir. Verilmeyen grafiğin böyle bir düğmesi olmaz ve bunların hiçbiri orada değildir.

Grafik dosyayı üretir ve onunla bir şey yapmaz: bir dosyanın nereye gideceğini uygulama söyler, ve bu her platformda başka bir şeydir. Telefon onu paylaşır, pencere nereye kaydedileceğini sorar, tarayıcı indirir. `onExport`'a verilen şeyde dosyanın adı, türü ve baytları vardır; bu yolların her birinin aldığı da budur.

Dosya grafiği ekrandaki hâliyle, okuyucunun ona yaptıklarıyla gösterir: çıkardıkları seriler çıkmıştır, yakından bakılan grafiğin görünen kısmı vardır. Gösterilen yer ve tooltip'i dosyada yoktur, grafiğin düğmeleri de; lejant çizim alanının altında durur.

```kotlin
PantrixLineChart(
    data = months,
    x = { it.name },
    values = revenue,
    export = ChartExport(fileName = "revenue") { file -> share(file.name, file.mimeType, file.bytes) }
)
```

Parametreler:

- `formats: List<ChartExportFormat>`: Okuyucunun aralarından seçtiği dosya türleri, sunuldukları sırayla. Tek bir tür, seçim yapılmadan, düğmeye basılınca üretilir.
- `fileName: String`: Dosyanın adı, türünün eklediği uzantı olmadan.
- `scale: Float`: Bir PNG'nin, grafiğin her dp'si için kaç pikseli olduğu: iki, dp başına bir pikseli olan ekranın iki katı keskindir. Bir SVG ve bir PDF grafiğin dp olarak boyutundadır ve her boyutta keskindir.
- `background: Color`: Dosyadaki resmin üstünde durduğu şey. Belirtilmezse temanın `background`'u: bir grafiğin kendi dolgusu yoktur ve yazıları temanın zeminlerinde okunmak üzere yazılır. `Color.Transparent` resmin altında hiçbir şey bırakmaz.
- `padding: Dp`: Resmin grafiğin çevresinde, her yanında ve `background`'unda bıraktığı pay: bir grafiğin kendi kutusu yazılarının bittiği yerde biter, ve orada kesilen bir resimde yazılar tam kenarda durur. Verilmezse 12dp.
- `onExport: (ChartExportFile) -> Unit`: Dosya üretilince ona verilir.

### ChartExportFormat

`import com.pantrixui.components.chart.export.ChartExportFormat`, `com.pantrixui:components` içinden

```kotlin
enum class ChartExportFormat
```

Bir grafiğin uygulamadan çıkarıldığı dosya türü.

Değerleri:

- `Png`: Piksellerden bir resim: her uygulamanın gösterdiği, ve üretildiğinden keskin olmayan şey.
- `Svg`: Çizgilerden ve şekillerden bir resim, her boyutta keskin: bir tarayıcının ve bir çizim programının açtığı şey.
- `Pdf`: Çizgilerden ve şekillerden bir sayfa, her boyutta keskin: yazdırılan ve bir rapora konan şey.

### ChartExportFile

`import com.pantrixui.components.chart.export.ChartExportFile`, `com.pantrixui:components` içinden

```kotlin
class ChartExportFile(
    public val name: String,
    public val mimeType: String,
    public val format: ChartExportFormat,
    public val bytes: ByteArray
)
```

Dosya olarak bir grafik.

Parametreler:

- `name: String`: Dosyanın adı, türünün uzantısıyla: `revenue.svg`.
- `mimeType: String`: Türü, web'in türleri adlandırdığı gibi: `image/png`, `image/svg+xml` ya da `application/pdf`.
- `format: ChartExportFormat`: Dosyanın türü.
- `bytes: ByteArray`: İçindekiler. Bir SVG, UTF-8 ile yazılmış metindir.

### ChartState

`import com.pantrixui.components.chart.common.ChartState`, `com.pantrixui:components` içinden

```kotlin
class ChartState(hidden: Set<String> = emptySet())
```

Bir okuyucunun bir grafiğe yaptığı: lejantından gözden çıkardığı seriler ve imlecin, parmağın ya da tuşların üstünde olduğu yer.

Bir grafik kendisi için bir tane tutar. İkisinden birini bilmek ya da söylemek isteyen bir ekran, kendisininkini `rememberChartState` ile kurar ve grafiğe verir. Aynı durumu alan iki grafik okuyucusu için tektir: birinde gizlenen seri ötekinde de gizlidir ve birinde gösterilen yer, ikisinde de varsa, ikisinde de işaretlenir.

`zoom` verilen eksenli bir grafik, yerlerinin görünen kısmını da burada, `window` olarak tutar: aynı durumu alan böyle iki grafiğe birlikte yakından bakılır. Bir Gantt grafiği zamanının görünen kısmını orada, bir scatter grafik değerlerinin yataydaki kısmını `window`'da, dikeydeki kısmını `valueWindow`'da tutar.

Bir pasta için dilimleri, eksenli bir grafik için serileri neyse odur: bir dilim anahtarıyla gözden çıkarılır ve gösterilen dilim, `x`'i o anahtar olan seçimdir.

Bir saçılım grafiğinde gösterilen nokta, `series`'i serisinin anahtarı, `x`'i de o serinin satırları arasındaki sıfırdan sayılan yeri olan seçimdir.

Parametreler:

- `hidden: Set<String>`: baştan gözden çıkarılmış serilerin anahtarları.

Üyeleri:

- `hidden: Set<String>`: Çizilmeyen serilerin anahtarları: lejantın kayıtlarının açıp kapadığı şey.
- `selection: ChartSelection?`: Gösterilen ve tooltip'in onun için açıldığı yer: hiçbiri gösterilmezken null. Grafiğin üstündeki imleç, üstündeki parmak ve ok tuşları onu verir; ayrılan bir imleç ve Escape onu boşaltır.
- `window: ClosedFloatingPointRange<Float>`: Grafiğin yerlerinin görünen kısmı, yerler boyunca bir paydan ötekine: grafiğe yakından bakılmadıkça `0f..1f`, yani hepsi. `zoom` verilen eksenli bir grafik onu okuyucusuna değiştirtir; ekran `zoomTo` ve `resetZoom` ile değiştirir.
- `zoomed: Boolean`: Grafiğin yerlerinin ya da değerlerinin hepsinin değil, bir kısmının görünüp görünmediği.
- `fun toggle(series: String)`: Anahtarı `series` olan seriyi çiziliyorsa gözden çıkarır, çizilmiyorsa geri getirir.
- `fun zoomTo(start: Float, end: Float)`: Yerlerin `start`'tan `end`'e kadar olan kısmını görünüme getirir; ikisi de yerler boyunca sıfırdan bire birer paydır: `zoomTo(0.5f, 1f)` sonraki yarıyı gösterir. İkisi sıraya konur ve bütünün içinde tutulur; bütünün binde birinden dar bir kısım o kadara genişletilir.
- `fun resetZoom()`: Bütün yerleri ve bütün değerleri yeniden gösterir.
- `valueWindow: ClosedFloatingPointRange<Float>`: Grafiğin değerlerinin dikeyde görünen kısmı, değerlerin bir payından ötekine: grafiğe yakından bakılmadıkça `0f..1f`, hepsi. Değerlerine dikeyde yakından bakan yalnızca `zoom` verilen scatter grafiktir; ekran kısmı `zoomValuesTo` ve `resetZoom` ile değiştirir.
- `fun zoomValuesTo(start: Float, end: Float)`: Değerlerin dikeyde `start`'tan `end`'e kadarki kısmını görünüre getirir; ikisi de değerlerin sıfırdan bire bir payıdır: `zoomValuesTo(0f, 0.5f)` alt yarıyı gösterir. İkisi `zoomTo`'nun ikisi gibi alınır.

### rememberChartState

`import com.pantrixui.components.chart.common.rememberChartState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberChartState(hidden: Set<String> = emptySet()): ChartState
```

Bir grafiğin durumu: ekran durdukça, gizlenen serileri de ekranın saklanan durumu durdukça tutulur.

Parametreler:

- `hidden: Set<String>`: baştan gözden çıkarılmış serilerin anahtarları.

### ChartSelection

`import com.pantrixui.components.chart.common.ChartSelection`, `com.pantrixui:components` içinden

```kotlin
data class ChartSelection(
    public val x: Any,
    public val series: String? = null
)
```

Bir grafikte gösterilen bir yer.

Parametreler:

- `x: Any`: Yer, serilerin satırlarının adlandırdığı gibi: `x`'lerinin verdiği şey. Bir pastada, dilimin anahtarı. Bir saçılım grafiğinde, noktanın serisinin satırları arasındaki sıfırdan sayılan yeri. Bir ısı haritasında, hücreyi dolduran verinin grafiğin verisi içindeki sıfırdan sayılan yeri. Bir ağaç haritasında, karonun anahtarı.
- `series: String?`: Orada gösterilen serinin anahtarı, grafik serileri ayırıyorsa; yerdeki bütün seriler birlikte gösteriliyorsa ve bir pastada null.

### ChartPoint

`import com.pantrixui.components.chart.common.ChartPoint`, `com.pantrixui:components` içinden

```kotlin
data class ChartPoint(
    public val series: String,
    public val name: String,
    public val x: Any,
    public val label: String,
    public val value: Double,
    public val text: String,
    public val color: Color,
    public val from: Double? = null,
    public val high: Double? = null,
    public val low: Double? = null
)
```

Bir grafiğin bir değeri, bir ekranın onunla yaptığı şeye verildiği gibi: üstüne bir basış, ekranın kendi tooltip'i.

Bir pastanın bir dilimi de böyle verilir: anahtarı `series`'i ve `x`'idir, adı `name`'i ve `label`'ı, `text`'i de ardında bütündeki payıyla değeri.

Bir saçılım grafiğinin noktası da öyledir: `x`'i serisinin satırları arasındaki sıfırdan sayılan yeri, `label`'ı noktanın adı ya da, bir adı yoksa, serisinin adı, `value`'su da yukarı doğru değeridir.

Bir ısı haritasının hücresi de öyledir: `x`'i verisinin grafiğin verisi içindeki sıfırdan sayılan yeri, `label`'ı grafiğin yazdığı biçimiyle kolonu, `name`'i satırıdır; hiçbir serinin değildir ve `series`'i boştur.

Bir ağaç haritasının karosu da: anahtarı `series`'i ve `x`'idir, adı `name`'i ve `label`'ı, `text`'i de ardında bütündeki payıyla değeridir.

Bir aralık üst değeriyle verilir, alt değeri `from`'undadır; `text`'i ikisini aralarında bir çizgiyle taşır. Bir şelalenin adımı adımın eklediğidir, başladığı seviye `from`'undadır; `text`'i adımın işaretini taşır. Bir şelalenin toplamı vardığı yerdir. Bir mum kapanışıyla verilir, açılışı `from`'unda, fitilinin iki ucu `high`'ında ve `low`'undadır; `text`'i dördünü, her birini adıyla taşır.

Bir yığının bir yerdeki toplamı, o yerin tooltip'inin yığının değerlerinden sonra yazdığı, tooltip'in kendi içeriğine de bir nokta olarak verilir: hiçbir serinin değildir ve `series`'i boştur; adı temanın toplam için kullandığı sözcük, `value`'su yığının değerlerinin toplamı, rengi belirsizdir. Paylar olarak duran bir yığında bir değerin `text`'inin ardında payı vardır.

Parametreler:

- `series: String`: Değerin ait olduğu serinin anahtarı.
- `name: String`: O serinin adı.
- `x: Any`: Değerin durduğu yer, serilerin satırlarının adlandırdığı gibi.
- `label: String`: O yer, grafiğin yazdığı gibi.
- `value: Double`: Değer.
- `text: String`: Değer, grafiğin yazdığı gibi.
- `color: Color`: Serinin çizildiği renk; bir şelalenin adımında, adımın gittiği yönün rengi.
- `from: Double?`: Değerin işaretinin başladığı yer: sıfırdan da bir yığının üstünden de çizilmeyen bir değer için. Bir aralığın alt değeri, bir şelale adımının başladığı seviye, ve bir mumun açılışı. Başka her değer için null.
- `high: Double?`: Bir mumun vardığı en yüksek değer. Başka her değer için null.
- `low: Double?`: Bir mumun vardığı en düşük değer. Başka her değer için null.

### ChartCurve

`import com.pantrixui.components.chart.common.ChartCurve`, `com.pantrixui:components` içinden

```kotlin
enum class ChartCurve
```

Bir çizginin bir noktadan ötekine nasıl gittiği.

Değerleri:

- `Linear`: Noktadan noktaya düz.
- `Smooth`: Noktalardan yuvarlanarak geçer ama onları aşmaz: iki noktanın arasında çizgi onların iki değerinin arasında kalır; değerlerin sahip olmadığı bir tepe ya da çukur göstermez.
- `Step`: Her noktanın değerinde düz; bir sonrakine ikisinin tam ortasında basamak atar.
- `StepBefore`: Bir noktanın değerine bir önceki noktada geçer: her noktadan önce düzdür.
- `StepAfter`: Her noktadan sonra, bir sonrakine dek düz: değişene kadar yerinde duran bir değer.

### ChartFill

`import com.pantrixui.components.chart.common.ChartFill`, `com.pantrixui:components` içinden

```kotlin
enum class ChartFill
```

Bir çizgiyle sıfırın arasını neyin doldurduğu.

Değerleri:

- `None`: Hiçbir şey: bir çizgi.
- `Solid`: Serinin renginin yumuşak bir tonu, çizgiden aşağı her yerde aynı.
- `Gradient`: Serinin rengi, çizgiden aşağı solarak, sıfırda hiçe varana dek.

### ChartDash

`import com.pantrixui.components.chart.common.ChartDash`, `com.pantrixui:components` içinden

```kotlin
enum class ChartDash
```

Bir çizginin bütün mü, kesik mi çizildiği.

Değerleri:

- `Solid`: Bütün bir çizgi.
- `Dashed`: Kesik çizgilerden bir çizgi.
- `Dotted`: Noktalardan bir çizgi.

### ChartMarker

`import com.pantrixui.components.chart.common.ChartMarker`, `com.pantrixui:components` içinden

```kotlin
enum class ChartMarker
```

Bir çizginin bir noktasını neyin işaretlediği. Şekiller, renklerin tek başına ayıramayacağı serileri ayırır.

Değerleri:

- `None`: İşaret yok; yalnızca tek başına duran bir nokta işaretlenir.
- `Circle`: Yuvarlak bir işaret.
- `Square`: Kare bir işaret.
- `Diamond`: Köşelerinden birinin üstünde duran kare bir işaret.
- `Triangle`: Üçgen bir işaret.

### ChartMissing

`import com.pantrixui.components.chart.common.ChartMissing`, `com.pantrixui:components` içinden

```kotlin
enum class ChartMissing
```

Değeri olmayan bir satırda çizginin ne yaptığı.

Değerleri:

- `Gap`: Çizgi ondan önce durur ve ondan sonra yeniden başlar.
- `Connect`: Çizgi ondan önceki noktadan sonraki noktaya sürer.
- `Zero`: Satırın değeri sıfır sayılır.

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

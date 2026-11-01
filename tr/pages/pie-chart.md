# Pie Chart

Bir bütünün parçaları, bir dairenin dilimleri olarak: her dilim, değerinin toplamdaki payı kadar yer tutar. Ortası oyulunca (`hole`) bir halka olur ve oyukta bir toplam ya da bir başlık için yer açılır.

Grafik dilimlerini alır: her `PieSlice` bir anahtar, bir ad ve bir değerdir. Dilimler verildikleri sırayla, saat on ikiden başlayıp saat yönünde dizilir; her biri, kendi rengini söylemedikçe, temanın sıradaki grafik rengiyle çizilir. Lejant, tooltip ve durum, eksenli grafiklerle aynı parçalardır ve "Chart" sayfasında anlatıldığı gibi verilir.

- `PantrixPieChart` (`com.pantrixui.components.chart.pie`, `com.pantrixui:components`): Bir bütünün parçaları bir pastanın ya da ortasında toplamı yazan bir halkanın dilimleri olarak: dilimleri çıkarıp geri getiren bir lejant, gösterilen dilim için bir tooltip; her dilime tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: pasta grafik, halka grafik, simit grafik, pay, oran, dilimler.

## Özellikler

- **Açı.** `startAngle` ilk dilimin başladığı yerdir, saat on ikiden saat yönünde derece; `sweepAngle` dilimlerin birlikte tuttuğu dönüştür: 360 tam pasta, 180 yarım pasta. Yarım pasta kutusunun izin verdiği kadar geniştir.
- **Sıra ve küçük dilimler.** `sort` dilimleri verildikleri gibi, büyükten küçüğe ya da küçükten büyüğe dizer. `others` bütünün bir payından küçük dilimleri sonda tek bir dilimde toplar; o dilimin tooltip'i ve ekran okuyucuya söylenişi içindekileri tek tek yazar.
- **Değerler.** Bir dilimin değeri bir miktardır; payını grafik hesaplar. Değeri olmayan ya da sıfırı aşmayan dilimin pastada yeri yoktur, lejantta adı durur.
- **Halka.** `hole` yarıçapın ne kadarının oyulacağını söyler: sıfır tam bir pasta, onda altı içine yazı sığan bir halka. `center` oyuğun içinde, oyuğa sığan en büyük kutuda durur; yarım halkada çizilen yarının oyuğunda.
- **Gösterilen dilim.** İmlecin altındaki ya da dokunulan dilim pastanın kenarından dışarı taşar ve tooltip değerini ve payını yazar. Parmakla, gösterilen dilime yeniden dokunmak onu bırakır.
- **Klavye.** Pasta, Tab için tek duraktır: oklar dilimden dilime geçer ve son dilimden sonra yine ilkine döner; Home ve End ilk ve son dilime gider, Escape bırakır, Enter ve boşluk gösterilen dilime basar. Masaüstünde ve web'de pastaya bir basış odağı ona verir: ardından gelen oklar bu pastada gezer.
- **Lejant.** Dilimlerin adları, her biri kendi renginin yanında. Bir kayda basmak dilimi pastadan çıkarır; kalan dilimler bütünü yeniden paylaşır.
- **Etiketler.** `labels` her dilimin payını dilimin üstüne yazar, dilimin renginde daha iyi okunan siyahla ya da beyazla; `format` verilirse değeri. Yazısı sığmayan dilimin etiketi dışarıya, dilimin adıyla yazılır ve dilimin renginde bir çizgi onu dilimine bağlar. `position` bunu değiştirir: `Outside` hepsini dışarıya, `Center` yalnızca içeriye yazar. Pasta dışarıdaki yazılara iki yanında yer açar; o yer pastayı yarısından küçük bırakacaksa yazılar yalnızca içeride kalır.
- **Ekran okuyucu.** Grafik önce `description`'ını, ardından her dilimi adı, değeri ve payıyla söyler.
- **Yön.** Pasta sağdan sola okunan dilde de saat yönünde döner; lejantı okuma yönüne uyar.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** Grafik `PieChart_<tagKey>`; pasta `.Plot`, dilimler `.Slice_<sıra>`, lejantın kayıtları `.Legend_<dilimin anahtarı>`, tooltip `.Tooltip`.

## Kullanım

### The shares of a whole

```kotlin
PantrixPieChart(
    slices = sources.map { PieSlice(it.id, it.name, it.visits) },
    description = stringResource(Res.string.visits_by_source),
    tagKey = "sources"
)
```

### A ring with its total in the middle and the shares written on it

```kotlin
PantrixPieChart(
    slices = sources.map { PieSlice(it.id, it.name, it.visits) },
    hole = 0.6f,
    center = { PantrixText(text = total, style = PantrixTheme.typography.title) },
    labels = ChartDataLabels(),
    legend = ChartLegend(position = ChartLegendPosition.End),
    tagKey = "sources"
)
```

## Örnekler

### Bir bütünün payları

En yalın hâli: dilimler, her biri anahtarı, adı ve değeriyle. İlk dilim saat on ikiden başlar, ötekiler saat yönünde onu izler; lejant grafiğin altında durur.

İmleci bir dilimin üstüne getir ya da dilime dokun: dilim dışarı taşar ve tooltip ziyaret sayısını ve toplamdaki payını yazar. Lejanttaki bir ada bas: dilim çıkar ve kalanlar bütünü yeniden paylaşır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice

PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    description = "Kaynaklara göre ziyaret",
    tagKey = "plain"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

### Ortasında toplamı olan halka

Ortası oyulmuş pasta bir halkadır: yarıçapın onda altısı oyuldu (`hole`) ve oyuğa toplam yazıldı (`center`).

Lejanttan bir dilimi çıkar: ortadaki sayı kalan dilimlerin toplamı olur. Ekran grafiğin durumunu kendisi tutuyor (`rememberChartState`) ve gizlenen dilimleri ondan okuyor.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.chart.common.rememberChartState
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberChartState()
val strings = PantrixTheme.strings
val total = VISIT_SOURCES.filter { it.key !in state.hidden }.sumOf { it.visits }
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    center = {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            PantrixText(text = strings.decimal(total), style = PantrixTheme.typography.title)
            PantrixText(text = "ziyaret", color = PantrixTheme.colors.textSecondary)
        }
    },
    state = state,
    description = "Kaynaklara göre ziyaret, ortasında toplamıyla",
    tagKey = "ring"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

### Payları dilimlerin üstünde

Paylar dilimlerin üstünde (`labels`): her dilime toplamdaki payı yazılır, dilimin renginde daha iyi okunan siyahla ya da beyazla. Anahtarı çevir: etiketler payı değil değeri yazar (`ChartDataLabels(format = …)`).

Yazısı dilime sığmayan etiket dışarıya, dilimin adıyla yazılır; bir çizgi onu dilimine bağlar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var values by remember { mutableStateOf(false) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = values,
    onCheckedChange = { values = it },
    label = "Değerleri yaz",
    tagKey = "pie_labels_values"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    labels = if (values) ChartDataLabels(format = { strings.decimal(it) }) else ChartDataLabels(),
    description = "Kaynaklara göre ziyaret, paylarıyla",
    tagKey = "labels"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

### Etiketlerin yeri

Etiketlerin yeri (`ChartDataLabels(position = …)`). "Otomatik" (`Auto`) her payı dilimin üstüne, sığmayanı dışarıya yazar; "Dışarıda" (`Outside`) her dilimin adını ve payını pastanın yanına yazar; "İçeride" (`Center`) sığmayanı atlar. Dışarıdaki yazıyı dilimine kendi renginde bir çizgi bağlar ve pasta onlara iki yanında yer açar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabelPosition
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var place by remember { mutableStateOf(ChartDataLabelPosition.Outside) }
PantrixSegmentButton(
    options = PIE_LABEL_PLACES,
    selected = place,
    onSelect = { place = it },
    fullWidth = false,
    tagKey = "pie_label_place"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    labels = ChartDataLabels(position = place),
    legend = null,
    description = "Kaynaklara göre ziyaret, paylarıyla",
    tagKey = "label_place"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)

private val PIE_LABEL_PLACES = listOf(
    SegmentOption(value = ChartDataLabelPosition.Auto, label = "Otomatik", tagKey = "auto"),
    SegmentOption(value = ChartDataLabelPosition.Outside, label = "Dışarıda", tagKey = "outside"),
    SegmentOption(value = ChartDataLabelPosition.Center, label = "İçeride", tagKey = "inside")
)
```

### Yarım halka

Yarım bir halka: dilimler saat dokuzdan başlar (`startAngle = 270f`) ve dönüşün yarısını tutar (`sweepAngle = 180f`). Halka kutusunun izin verdiği kadar geniştir ve toplam, çizilen yarının oyuğunda durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val total = PantrixTheme.strings.decimal(VISIT_SOURCES.sumOf { it.visits })
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    startAngle = 270f,
    sweepAngle = 180f,
    center = { PantrixText(text = total, style = PantrixTheme.typography.title) },
    description = "Kaynaklara göre ziyaret, yarım halka",
    tagKey = "half"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

### Sıralama ve küçük dilimler

Tarayıcılara göre ziyaret, büyükten küçüğe (`sort = PieSort.Descending`). Bütünün yüzde beşinden küçük dilimler sonda tek bir dilimde toplanır (`others = PieOthers(share = 0.05f)`); adı temanın sözcüğüdür. Toplanan dilimin üstüne gel ya da ona dokun: tooltip içindekileri tek tek yazar. Anahtarı kapat: bütün dilimler görünür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieOthers
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.chart.pie.PieSort
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var gathered by remember { mutableStateOf(true) }
PantrixSwitchButton(
    checked = gathered,
    onCheckedChange = { gathered = it },
    label = "Küçükleri topla",
    tagKey = "pie_gathered"
)
PantrixPieChart(
    slices = BROWSER_VISITS.map { PieSlice(it.key, it.name, it.visits) },
    sort = PieSort.Descending,
    others = if (gathered) PieOthers(share = 0.05f) else null,
    labels = ChartDataLabels(),
    legend = ChartLegend(position = ChartLegendPosition.End),
    description = "Tarayıcılara göre ziyaret",
    tagKey = "gathered"
)

private data class Browser(
    val key: String,
    val name: String,
    val visits: Int
)

private val BROWSER_VISITS = listOf(
    Browser("safari", "Safari", 198),
    Browser("firefox", "Firefox", 42),
    Browser("chrome", "Chrome", 612),
    Browser("opera", "Opera", 24),
    Browser("edge", "Edge", 54),
    Browser("uc", "UC", 17),
    Browser("samsung", "Samsung", 31),
    Browser("yandex", "Yandex", 22)
)
```

### Lejantın yeri

Lejant grafiğin dört yanından birinde durur. Üstte ve altta kayıtlar bir satıra dizilir ve sığmazsa alt satıra geçer; yanlarda alt alta dururlar ve genişliğin onda dördünden fazlasını almazlar. Pasta, lejanttan kalan yerin ortasında, oraya sığan en büyük dairedir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartLegend
import com.pantrixui.components.chart.common.ChartLegendPosition
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var place by remember { mutableStateOf(ChartLegendPosition.End) }
PantrixSegmentButton(
    options = PIE_LEGEND_PLACES,
    selected = place,
    onSelect = { place = it },
    fullWidth = false,
    tagKey = "pie_legend_place"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    legend = ChartLegend(position = place),
    description = "Kaynaklara göre ziyaret",
    tagKey = "legend"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)

private val PIE_LEGEND_PLACES = listOf(
    SegmentOption(value = ChartLegendPosition.Top, label = "Üstte", tagKey = "top"),
    SegmentOption(value = ChartLegendPosition.Bottom, label = "Altta", tagKey = "bottom"),
    SegmentOption(value = ChartLegendPosition.Start, label = "Başta", tagKey = "start"),
    SegmentOption(value = ChartLegendPosition.End, label = "Sonda", tagKey = "end")
)
```

### Bir dilime basmak

`onSelect`, basılan dilimi verir: anahtarını, adını, değerini ve grafiğin onu nasıl yazdığını. Bir dilime bas ya da klavyeyle bir dilime gidip Enter'a bas: kartın altındaki satır basılanı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice

val report = LocalExampleEvents.current
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    description = "Kaynaklara göre ziyaret",
    onSelect = { point -> report("${point.name}: ${point.text}") },
    tagKey = "pressed"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Değişen değerler

Değerler değişince dilimler eski yerlerinden yenilerine gider. Anahtarı çevir: grafik geçen yılın ziyaretlerini gösterir. Dilimleri anahtarları eşler: adı ya da değeri değişen dilim aynı dilimdir, rengini ve lejanttaki yerini korur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var before by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = before,
    onCheckedChange = { before = it },
    label = "Geçen yıl",
    tagKey = "pie_before"
)
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, if (before) it.before else it.visits) },
    hole = 0.6f,
    labels = ChartDataLabels(),
    description = if (before) "Geçen yıl kaynaklara göre ziyaret" else "Bu yıl kaynaklara göre ziyaret",
    tagKey = "changing"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

### Kendi renklerin ve ölçülerin

Bir grafiğin kendi görünüşü. Her dilim kendi rengini söylüyor (`PieSlice(color = …)`): temanın grafik renkleri yerine paletten tek bir morun tonları. `ChartStyle` ölçüleri verir: dilimlerin arası kapalı (`sliceGap`) ve grafik daha alçak (`height`). Verilmeyen alan temanınki kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.foundation.token.color.PantrixPalette

val dark = LocalDemoDarkTheme.current
val violet = PantrixPalette.Violet
val tones = if (dark) {
    listOf(violet.shade300, violet.shade400, violet.shade500, violet.shade600, violet.shade700)
} else {
    listOf(violet.shade800, violet.shade600, violet.shade500, violet.shade400, violet.shade300)
}
PantrixPieChart(
    slices = VISIT_SOURCES.mapIndexed { index, source ->
        PieSlice(source.key, source.name, source.visits, color = tones[index])
    },
    labels = ChartDataLabels(),
    description = "Kaynaklara göre ziyaret",
    style = ChartStyle(sliceGap = 0.dp, height = 180.dp),
    tagKey = "own_look"
)

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalDemoDarkTheme`: Uygulamanın teması şu an koyu mu: ayar "Sistem"deyken sistemin modu, değilken ayarın kendisi.

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada pasta ekrandaki hâliyle, lejant altında durur; gösterilen dilim ve tooltip'i dosyada yoktur. Deliğe `center` ile konan da dosyaya çıkmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.pie.PantrixPieChart
import com.pantrixui.components.chart.pie.PieSlice
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixPieChart(
    slices = VISIT_SOURCES.map { PieSlice(it.key, it.name, it.visits) },
    hole = 0.6f,
    center = { PantrixText(text = "Ziyaret", color = PantrixTheme.colors.textSecondary) },
    description = "Kaynaklara göre ziyaret",
    tagKey = "exported",
    export = ChartExport(fileName = "ziyaret-kaynaklari") { file = it }
)
ExportedFile(file, tagKey = "exported")

private data class VisitSource(
    val key: String,
    val name: String,
    val visits: Int,
    val before: Int
)

private val VISIT_SOURCES = listOf(
    VisitSource("direct", "Doğrudan", visits = 420, before = 380),
    VisitSource("search", "Arama", visits = 310, before = 240),
    VisitSource("social", "Sosyal", visits = 150, before = 260),
    VisitSource("mail", "E-posta", visits = 80, before = 90),
    VisitSource("other", "Diğer", visits = 40, before = 30)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixPieChart

`import com.pantrixui.components.chart.pie.PantrixPieChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixPieChart(
    slices: List<PieSlice>,
    modifier: Modifier = Modifier,
    hole: Float = 0f,
    center: (@Composable () -> Unit)? = null,
    labels: ChartDataLabels? = null,
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    startAngle: Float = 0f,
    sweepAngle: Float = 360f,
    sort: PieSort = PieSort.Given,
    others: PieOthers? = null,
    export: ChartExport? = null
)
```

Bir pasta grafiği: bir bütünün parçaları, bir dairenin dilimleri olarak; her biri, değerinin toplamdaki payı kadar dönüş tutar. Ortasında bir `hole` olunca bir halkadır: oyuğunda bir toplam ya da bir başlık için yer vardır.

Pastaya `slices` verilir; her birinin bir anahtarı, bir adı ve bir değeri vardır. Verildikleri sırayla ya da `sort`'un söylediği sırayla, `startAngle`'dan başlayıp saat yönünde dizilirler ve bütün bir dönüşü ya da verilen `sweepAngle`'ı tutarlar: yarım bir pasta için dönüşün yarısını. Her biri, kendi rengini söylemedikçe, temanın yerine düşen grafik rengiyle çizilir. Değeri sayı olmayan ya da sıfırı aşmayan dilimin pastada payı yoktur, lejanttaki yeri durur. Pastaya `others` verilince en küçük dilimleri sonda tek bir dilimde toplanır.

Pastanın çevresinde eksenli bir grafiğin parçaları durur; her biri kendisini tarif eden değerle verilir, `null` ile kaldırılır: dilimleri sayan ve kaydına basılınca dilimi pastadan çıkaran `legend`, ve gösterilen dilimin değerini ve bütündeki payını gösteren `tooltip`.

**Bir dilimi göstermek.** Bir dilimin üstündeki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği dilime bir dokunuş da onu bırakır. Klavyeyle pasta Tab için tek bir duraktır: oklar pastanın çevresinde dilimden dilime gider ve sonuncudan sonra yine ilkine; Home ve End ilkine ve sonuncusuna, Escape bırakır. Dilim pastanın kenarından dışarı taşar, tooltip onun için gösterilir ve `state`'e söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır. Bir pencerede ve bir tarayıcıda pastaya bir basış, bir düğmeye basış gibi, odağı alır; böylece ardından gelen oklar bu pastada gezer.

**Ekran okuyucu için** pasta `description`'ıdır, sonra değeri ve payıyla her dilim, dilimlerin sırasıyla. Lejantın kayıtları birer anahtardır.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir. Modifier'ındaki bir yükseklik grafiğin tamamınındır, lejantınki de içinde; verilmezse grafik stilinin söylediği kadar yüksektir ve üstündeki ya da altındaki bir lejant kendi yüksekliğini ekler. Pasta, lejanttan kalan yere sığan en büyüğüdür ve o yerin ortasındadır: yarım bir pastanın çizilen yarısı. Etiketleri dışına yazılınca iki yanında onlara yer açar; o yer onu yarısından küçük bırakacaksa yalnızca dilimlerinin üstüne yazar.

Pasta sağdan okunan bir dilde de aynı yöne döner; lejantı ve tooltip'i okuma yönüne uyar.

```kotlin
PantrixPieChart(
    slices = listOf(
        PieSlice("direct", "Direct", 420),
        PieSlice("search", "Search", 310),
        PieSlice("social", "Social", 150)
    ),
    hole = 0.6f,
    description = "Visits by where they came from",
    tagKey = "sources"
)
```

Parametreler:

- `slices: List<PieSlice>`: dilimler, `sort` sıralarını koruduğunda pastada durdukları sırayla, `startAngle`'dan başlayıp saat yönünde. Anahtarları onları birbirinden ayırır; aynı anahtarı taşıyan iki dilim reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `hole: Float`: pastanın yarıçapının ne kadarının ortasından oyulduğu: tam bir pasta için sıfır, içine yazı sığan bir halka için onda altı. Onda dokuzdan çok olamaz.
- `center: (@Composable () -> Unit)?`: bir halkanın oyuğunda duran: bir toplam, bir başlık. Oyuğa sığan en büyük kutu onundur; yarım bir halkada çizilen yarının oyuğunda. Tam bir pastada ona yer yoktur.
- `labels: ChartDataLabels?`: dilimler hakkında yazılan: her dilimin bütündeki payı, ya da etiketlerin `format`'ının yazdığı gibi değeri. Dilimin üstünde siyahla ya da beyazla yazılır, dilimin üstünde hangisi okunuyorsa; dışında dilimin adı önüne gelir ve dilimin renginde bir çizgi ona götürür. Nereye yazılacağını `position`'ları söyler: `Outside` her dilimin dışına, `Auto` yazısını tutan her dilimin üstüne ve ötekilerin dışına, ötekiler yalnızca dilimlerin üstüne; yazısına yeri olmayan küçük dilimin etiketi yoktur. Dıştaki yazılar her yanda bir sütunda durur; bir yanda hepsine alt alta yer yoksa oradaki en küçük dilimlerin yazısı yoktur. `null` dilimler hakkında hiçbir şey yazmaz.
- `legend: ChartLegend?`: dilimlerin adlarının durduğu yer. `null` hiçbirini göstermez.
- `tooltip: ChartTooltip?`: gösterilen dilim için gösterilen: değeri, tooltip'in `format`'ının yazdığı gibi ya da temanın diliyle, ve bütündeki payı. `null` hiçbirini göstermez. Bir tooltip'in `shared` olup olmadığı ve `crosshair`'i olup olmadığı bir pastaya bir şey söylemez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gizlediği ve gösterdiği: verilmezse grafiğin kendisininki. Bir dilim anahtarıyla gizlenir ve `x`'i o anahtar olan bir seçimle gösterilir.
- `description: String?`: pastanın ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik dilimlerinin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan dilimle çağrılır: noktanın `series`'i ve `x`'i olarak anahtarı, adı, değeri ve pastanın onun için yazdığı.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi temanınkiyle.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `PieChart_<tagKey>`, pasta `PieChart_<tagKey>.Plot`, bir dilim, birden sayılarak, `PieChart_<tagKey>.Slice_<number>`, bir dilimin lejant kaydı `PieChart_<tagKey>.Legend_<slice's key>` ve tooltip `PieChart_<tagKey>.Tooltip` olur. Bir dilime basış, dilimin anahtarıyla bir `PieChart` `select` olayı olarak, bir lejant kaydına basış da anahtarla ve dilimin gösterilip gösterilmediğiyle bir `toggle` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `startAngle: Float`: ilk dilimin başladığı yer, saat on ikiden saat yönünde derece olarak: 270 saat dokuzdan başlar.
- `sweepAngle: Float`: dilimlerin birlikte kaç derece tuttuğu: bütün bir dönüş, 360, ya da yarım bir pasta için 180; sıfırın üstünden bütün bir dönüşe kadar.
- `sort: PieSort`: dilimlerin dizildiği sıra: verildikleri gibi, en büyüğü önce ya da en küçüğü önce.
- `others: PieOthers?`: en küçük dilimlerin tek bir dilimde nasıl toplandığı. `null` hiçbirini toplamaz.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur. Delikte duran, `center`, dosyada yoktur.

### PieSlice

`import com.pantrixui.components.chart.pie.PieSlice`, `com.pantrixui:components` içinden

```kotlin
class PieSlice(
    public val key: String,
    public val name: String,
    public val value: Number?,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixPieChart`'ın bir dilimi: pastanın gösterdiği bütünün parçalarından biri.

```kotlin
PieSlice("search", "Search", 310)
```

Kuruldukları her şey aynı olan iki dilim aynı dilimdir; bir tam sayı ile kesri sıfır olan aynı sayı tek bir değerdir.

Parametreler:

- `key: String`: Dilimi pastasının öteki dilimlerinden ayıran ve değeri değişirken aynı kalan şey: lejantın gizli bir dilimi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği. Bir test etiketinin anahtarı gibi yazılır, küçük harflerle ve rakamlarla.
- `name: String`: Dilimin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `value: Number?`: Dilimin bütünün ne kadarı olduğu. Değeri sayı olmayan ya da sıfırı aşmayan dilimin pastada payı yoktur: bir bütünün payı hiçten az olmaz.
- `color: Color`: Dilimin çizildiği renk. Verilmezse, pastanın dilimleri arasındaki yerine düşen tema grafik rengidir: ilki için ilki.
- `pattern: ChartPattern?`: Dilimin renginin yanında çizildiği desen. Verilmezse hiçbiri; grafiğin desenleri açıksa (`ChartStyle.patterns`), dilimler arasındaki yerine göre sırasındaki desen: ilkinin hiçbiri.

### PieSort

`import com.pantrixui.components.chart.pie.PieSort`, `com.pantrixui:components` içinden

```kotlin
enum class PieSort
```

Bir pastanın dilimlerinin, başladıkları yerden itibaren dizildiği sıra.

Değerleri:

- `Given`: Verildikleri gibi.
- `Descending`: En büyüğü önce.
- `Ascending`: En küçüğü önce.

### PieOthers

`import com.pantrixui.components.chart.pie.PieOthers`, `com.pantrixui:components` içinden

```kotlin
class PieOthers(
    public val share: Float = 0.03f,
    public val name: String? = null,
    public val color: Color = Color.Unspecified
)
```

Bir pastanın en küçük dilimlerini tek bir dilimde nasıl topladığı; böylece bir yığın ince dilim tek bir dilim olarak okunur: bütünün `share`'inden daha az olan her dilim, ötekilerin hepsinden sonra gelen bir dilime girer; tooltip ve ekran okuyucu bu dilimi içindeki dilimlere açar. O kadar küçük tek bir dilim kendi yerini korur.

```kotlin
PieOthers(share = 0.05f)
```

Toplanan dilimin anahtarı `others`'tır: toplayan bir pasta bu anahtarı ona ayırır ve bu anahtarı taşıyan kendi dilimini reddeder. Lejanttaki kaydı toplanan dilimleri birlikte çıkarır.

Parametreler:

- `share: Float`: Bir dilimin kendi başına durması için bütünün en az ne kadarı olduğu: yüzde üç; sıfırdan, hiçbiri toplanmazken, bire kadar.
- `name: String?`: Toplanan dilimin adı. Verilmezse temanın onun için sözcüğüdür (`PantrixStrings.others`, "Other").
- `color: Color`: Toplanan dilimin rengi. Verilmezse temanın yerine düşen grafik rengidir: sonuncusu.

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

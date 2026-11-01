# Scatter Chart

İki değere göre dizilmiş noktalar: biri grafik boyunca, öteki yukarı doğru. İki şeyin birlikte nasıl gittiğini gösterir: sıcaklık arttıkça satış artıyor mu, fiyatı yüksek olanın puanı da yüksek mi. Her noktaya üçüncü bir değerle bir büyüklük verilirse bir balon grafiği olur.

Grafiğe serileri verilir; her `ScatterSeries` kendi satırlarını taşır: satırın boyuna yeri (`x`), yukarı yeri (`y`) ve, balonlar için, büyüklüğü (`size`). İki eksen de değer eksenidir: her biri değerlerinin altındaki yuvarlak bir sayıdan üstündekine gider ve aradaki yuvarlak değerleri işaretler.

- `PantrixScatterChart` (`com.pantrixui.components.chart.scatter`, `com.pantrixui:components`): İki değerle dizilen noktalar, üçüncüsüyle boyutlanan baloncuklar: iki değer ekseni, onları okumak için çizgiler ve bantlar, serileri çıkarıp geri getiren bir lejant, gösterilen nokta için bir tooltip; her noktaya tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: dağılım grafiği, saçılım grafiği, baloncuk grafik, xy grafik, korelasyon, nokta bulutu.

## Özellikler

- **Balonlar.** `size` verilen serinin noktaları balondur. Bir balonun alanı, büyüklüğünün grafikteki en büyük büyüklüğe oranı kadardır: iki katı değer iki katı alan. En küçük ve en büyük balonun ölçüsü grafik stilindedir (`bubbleMinSize`, `bubbleMaxSize`). Balonlu grafik, eksenlerinin uçlarında en büyük balona yer bırakır.
- **Noktanın adı.** `label`, bir noktanın ne diye anıldığını söyler: bir ülke, bir ürün. Tooltip'in başlığı ve ekran okuyucunun söylediği odur.
- **Eksenler.** `xAxis` ve `yAxis`, eksenli grafiğin `ChartAxis`'idir: başlık, biçim, uçlar, kılavuz çizgileri. Başlıklar tooltip'te değerlerin adı olur. `sizeAxis` büyüklüğün adını (`title`), yazımını (`format`) ve en büyük balonun karşıladığı değeri (`max`) söyler; ondan bir şey çizilmez.
- **İşaretler.** `marks` ile bir değerde çizgi ya da iki değer arasında bant çizilir; burada bir işaretin `x`'i grafik boyunca uzanan eksenin bir değeridir.
- **Gösterilen nokta.** İmlecin altındaki ya da yakınındaki, parmakla dokunulan nokta gösterilir: çevresinde bir halka, içinden geçen iki çizgi ve değerlerini yazan tooltip. Üst üste duran noktalardan en küçüğü gösterilir.
- **Klavye.** Grafik, Tab için tek duraktır: sağ ve sol oklar serinin noktaları arasında grafik boyunca gider, yukarı ve aşağı oklar önceki ve sonraki seriye geçer, Home ve End serinin ilk ve son noktasına gider, Escape bırakır, Enter ve boşluk gösterilen noktaya basar.
- **Durum ve basmak.** Gösterilen nokta `ChartState`'te, `x`'i satırın serisindeki yeri ve `series`'i serinin anahtarı olan bir seçim olarak durur. `onSelect` basılan noktayı aynı yerle verir.
- **Ekran okuyucu.** Grafik `description`'ını, ardından seri seri her noktayı adı ve değerleriyle söyler. İki yüzden çok noktası olan grafik yalnızca açıklamasıyla anlatılır.
- **Yön.** Sağdan sola okunan dilde boyuna değerler sağdan başlar, yukarı değerler sağa yazılır.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Yakınlaşma.** `zoom` ile iki değere birden yakından bakılır: tekerlek (Ctrl ya da Command ile), iki parmak, artı ve eksi tuşları ve düğmeler yakınlaşır; sürükleme görüneni her yöne taşır.
- **Otomasyon.** `ScatterChart_<tagKey>`; çizim alanı `.Plot`, noktalar `.Point_<seri>_<sıra>`, lejant kayıtları `.Legend_<seri>`, tooltip `.Tooltip`.

## Kullanım

### Two groups of points

```kotlin
PantrixScatterChart(
    series = listOf(
        ScatterSeries("trial", stringResource(Res.string.trial), trial, x = { it.dose }, y = { it.response }),
        ScatterSeries("control", stringResource(Res.string.control), control, x = { it.dose }, y = { it.response })
    ),
    xAxis = ChartAxis(title = stringResource(Res.string.dose)),
    yAxis = ChartAxis(title = stringResource(Res.string.response)),
    tagKey = "study"
)
```

### Bubbles, each called by its name, with a line at the average

```kotlin
val strings = PantrixTheme.strings
PantrixScatterChart(
    series = listOf(
        ScatterSeries(
            key = "countries",
            name = stringResource(Res.string.countries),
            data = countries,
            x = { it.income },
            y = { it.lifeExpectancy },
            size = { it.population },
            label = { it.name }
        )
    ),
    xAxis = ChartAxis(title = stringResource(Res.string.income), format = { strings.compact(it) }),
    yAxis = ChartAxis(title = stringResource(Res.string.life_expectancy)),
    sizeAxis = ChartAxis(title = stringResource(Res.string.population), format = { strings.compact(it) }),
    marks = listOf(ChartReferenceLine(y = 72, label = stringResource(Res.string.world_average))),
    legend = null,
    tagKey = "countries"
)
```

## Örnekler

### İki değer, iki grup

Bir kafenin elli günü: günün sıcaklığı ve o gün satılan soğuk içecek. Hafta içi ve hafta sonu ayrı seriler; noktalar sıcaklıkla birlikte yukarı gidiyor, hafta sonları daha da yukarıda.

İmleci bir noktanın yakınına getir ya da noktaya dokun: tooltip günün iki değerini eksenlerin başlıklarıyla yazar. Lejanttaki bir kayda basmak o seriyi grafikten çıkarır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

PantrixScatterChart(
    series = listOf(
        ScatterSeries("weekdays", "Hafta içi", cafeDays(weekend = false), x = { it.heat }, y = { it.sold }),
        ScatterSeries("weekend", "Hafta sonu", cafeDays(weekend = true), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Sıcaklık (°C)"),
    yAxis = ChartAxis(title = "Soğuk içecek"),
    description = "Sıcaklığa göre satılan soğuk içecek",
    tagKey = "plain"
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

### Balonlar

Bir mağazanın ürünleri: fiyatı, puanı ve, balonun büyüklüğü olarak, ay içinde satılan adet. Her nokta ürünün adıyla anılıyor (`label`); `sizeAxis` büyüklüğün ne olduğunu söylüyor.

Alan değere göre büyür: iki katı satan ürünün balonu iki katı alan kaplar, iki katı genişlik değil. Üst üste gelen balonların altındaki görünsün diye balonlar yarı saydam çizilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixScatterChart(
    series = listOf(
        ScatterSeries(
            key = "products",
            name = "Ürünler",
            data = shopProducts(),
            x = { it.price },
            y = { it.rating },
            size = { it.sold },
            label = { it.name }
        )
    ),
    xAxis = ChartAxis(title = "Fiyat", format = { "${strings.decimal(it)} ₺" }),
    yAxis = ChartAxis(title = "Puan", min = 3.0, max = 5.0),
    sizeAxis = ChartAxis(title = "Satış", format = { "${strings.decimal(it)} adet" }),
    description = "Ürünlerin fiyatı, puanı ve satışı",
    tagKey = "bubbles"
)

internal fun shopProducts(): List<ShopProduct> = listOf(
    ShopProduct("Kulaklık", 1450.0, 4.6, 820),
    ShopProduct("Klavye", 980.0, 4.3, 540),
    ShopProduct("Fare", 420.0, 4.4, 1260),
    ShopProduct("Monitör", 5200.0, 4.7, 310),
    ShopProduct("Web kamerası", 760.0, 3.9, 280),
    ShopProduct("Hoparlör", 1890.0, 4.1, 190),
    ShopProduct("Mikrofon", 2350.0, 4.5, 150),
    ShopProduct("Şarj aleti", 310.0, 4.0, 1640),
    ShopProduct("Kablo", 120.0, 3.6, 2100),
    ShopProduct("Tablet kalemi", 1150.0, 4.2, 95),
    ShopProduct("Laptop standı", 640.0, 4.8, 470),
    ShopProduct("Harici disk", 2780.0, 4.4, 360)
)

internal class ShopProduct(
    val name: String,
    val price: Double,
    val rating: Double,
    val sold: Int
)
```

### Çizgiler ve bantlar

Noktaları okumaya yardım eden işaretler: ortalama sıcaklıkta bir çizgi, günün hedefinde bir çizgi ve en sıcak günlerin üstünde bir bant. Bir işaretin `x`'i burada bir yer adı değil, grafik boyunca uzanan eksenin bir değeridir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartReferenceBand
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

PantrixScatterChart(
    series = listOf(
        ScatterSeries("days", "Günler", cafeDays(weekend = false), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Sıcaklık (°C)"),
    yAxis = ChartAxis(title = "Soğuk içecek"),
    marks = listOf(
        ChartReferenceBand(x1 = 28, label = "Sıcak günler"),
        ChartReferenceLine(y = 150, label = "Hedef"),
        ChartReferenceLine(x = 21, label = "Ortalama")
    ),
    description = "Sıcaklığa göre satılan soğuk içecek, hedefle birlikte",
    tagKey = "marks"
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

### Biçimle ayırmak

Seriler yalnızca renkle değil biçimle de ayrılır: her seri kendi işaretiyle çizilir (`marker`). Renkleri ayırt edemeyen biri için de, siyah beyaz bir çıktıda da okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartMarker
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

val days = cafeDays(weekend = false)
PantrixScatterChart(
    series = listOf(
        ScatterSeries("cold", "Soğuk içecek", days, x = { it.heat }, y = { it.sold }),
        ScatterSeries("hot", "Sıcak içecek", days, x = { it.heat }, y = { it.hot }, marker = ChartMarker.Square),
        ScatterSeries("food", "Yiyecek", days, x = { it.heat }, y = { it.food }, marker = ChartMarker.Triangle)
    ),
    xAxis = ChartAxis(title = "Sıcaklık (°C)"),
    yAxis = ChartAxis(title = "Satış"),
    description = "Sıcaklığa göre üç ürün grubunun satışı",
    tagKey = "markers"
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

### Bir noktaya basmak

`onSelect`, basılan noktayı verir: `x`'i satırın serisindeki yeridir, `label`'ı noktanın adı. Bir balona bas ya da klavyeyle bir balona gidip Enter'a bas, kartın altındaki satır basılan ürünü yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

val report = LocalExampleEvents.current
val products = shopProducts()
PantrixScatterChart(
    series = listOf(
        ScatterSeries(
            key = "products",
            name = "Ürünler",
            data = products,
            x = { it.price },
            y = { it.rating },
            size = { it.sold },
            label = { it.name }
        )
    ),
    xAxis = ChartAxis(title = "Fiyat"),
    yAxis = ChartAxis(title = "Puan", min = 3.0, max = 5.0),
    sizeAxis = ChartAxis(title = "Satış"),
    onSelect = { point -> report("${point.label}: ${products[point.x as Int].sold} adet") },
    description = "Ürünlerin fiyatı, puanı ve satışı",
    tagKey = "pressed"
)

internal fun shopProducts(): List<ShopProduct> = listOf(
    ShopProduct("Kulaklık", 1450.0, 4.6, 820),
    ShopProduct("Klavye", 980.0, 4.3, 540),
    ShopProduct("Fare", 420.0, 4.4, 1260),
    ShopProduct("Monitör", 5200.0, 4.7, 310),
    ShopProduct("Web kamerası", 760.0, 3.9, 280),
    ShopProduct("Hoparlör", 1890.0, 4.1, 190),
    ShopProduct("Mikrofon", 2350.0, 4.5, 150),
    ShopProduct("Şarj aleti", 310.0, 4.0, 1640),
    ShopProduct("Kablo", 120.0, 3.6, 2100),
    ShopProduct("Tablet kalemi", 1150.0, 4.2, 95),
    ShopProduct("Laptop standı", 640.0, 4.8, 470),
    ShopProduct("Harici disk", 2780.0, 4.4, 360)
)

internal class ShopProduct(
    val name: String,
    val price: Double,
    val rating: Double,
    val sold: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada eksenler, noktalar ve altında lejant durur; gösterilen nokta ve tooltip'i dosyada yoktur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixScatterChart(
    series = listOf(
        ScatterSeries("weekdays", "Hafta içi", cafeDays(weekend = false), x = { it.heat }, y = { it.sold }),
        ScatterSeries("weekend", "Hafta sonu", cafeDays(weekend = true), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Sıcaklık (°C)"),
    yAxis = ChartAxis(title = "Soğuk içecek"),
    description = "Sıcaklığa göre satılan soğuk içecek",
    tagKey = "exported",
    export = ChartExport(fileName = "soguk-icecek") { file = it }
)
ExportedFile(file, tagKey = "exported")

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

### Yakınlaşma

`zoom = ChartZoom()` iki değere birden yakından bakmayı sağlar: Ctrl ya da Command ile tekerlek ve iki parmak aralarındaki noktaya, grafikteyken artı ve eksi gösterilen noktaya, düğmeler ortaya yakınlaşır. Fareyle sürükleme görüneni her yöne taşır; oklarla gidilen nokta görünüre gelir.

İki eksen görünen değerler için yeniden işaretlenir, çizim alanının kenarlarının dışı kesilir. Yataydaki kısım `state.window`, dikeydeki `state.valueWindow`'dur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.scatter.PantrixScatterChart
import com.pantrixui.components.chart.scatter.ScatterSeries

PantrixScatterChart(
    series = listOf(
        ScatterSeries("weekdays", "Hafta içi", cafeDays(weekend = false), x = { it.heat }, y = { it.sold }),
        ScatterSeries("weekend", "Hafta sonu", cafeDays(weekend = true), x = { it.heat }, y = { it.sold })
    ),
    xAxis = ChartAxis(title = "Sıcaklık (°C)"),
    yAxis = ChartAxis(title = "Soğuk içecek"),
    description = "Sıcaklığa göre satılan soğuk içecek",
    tagKey = "zoomed",
    zoom = ChartZoom()
)

internal fun cafeDays(weekend: Boolean): List<CafeDay> = List(50) { it }
    .filter { (it % 7 >= 5) == weekend }
    .map { day ->
        val heat = 12.0 + (day * 7 % 19) + (day % 4) * 0.5
        val wobble = (day * 37 % 29) - 14
        val busy = if (weekend) 45 else 0
        CafeDay(
            heat = heat,
            sold = (heat * 6.5 - 40 + wobble + busy).toInt().coerceAtLeast(4),
            hot = (190 - heat * 4.5 + wobble).toInt().coerceAtLeast(4),
            food = 85 + wobble + busy / 3
        )
    }

internal class CafeDay(
    val heat: Double,
    val sold: Int,
    val hot: Int,
    val food: Int
)
```

## API

### PantrixScatterChart

`import com.pantrixui.components.chart.scatter.PantrixScatterChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixScatterChart(
    series: List<ScatterSeries<*>>,
    modifier: Modifier = Modifier,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    sizeAxis: ChartAxis? = null,
    marks: List<ChartMark> = emptyList(),
    legend: ChartLegend? = ChartLegend(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    export: ChartExport? = null,
    zoom: ChartZoom? = null
)
```

Bir saçılım grafiği: iki değere göre dizilmiş noktalar, biri grafik boyunca, öteki yukarı doğru; ikisinin birlikte nasıl gittiğini gösterir. Her noktanın büyüklüğü için üçüncü bir değerle bir balon grafiği olur.

Grafiğe `series` verilir ve her biri kendi satırlarını taşır: bir satırın grafik boyunca nerede durduğu, yukarı doğru nerede durduğu ve, balonlar için, ne kadar büyük olduğu. İki ekseni de değer eksenidir: her biri değerlerinin en küçüğünün altındaki yuvarlak bir sayıdan en büyüğünün üstündekine gider ve aradaki yuvarlak değerleri işaretler. Balonlu bir grafik, eksenlerinin uçlarında en büyük balona yer bırakır; böylece hiçbiri çizim alanının kenarında kesilmez.

Noktaların çevresinde, yerleri olan bir grafiğin parçaları durur; her biri onu tarif eden değerle verilir ve `null` ile kaldırılır: iki eksen, serileri listeleyen ve kaydına basılınca bir seriyi grafikten çıkaran `legend` ve gösterilen noktanın değerlerini gösteren `tooltip`.

**İşaretler.** İki eksenden birinin bir değerinde bir çizgi ve iki değerin arasında bir bant, noktalar onlara göre okunsun diye noktalarla birlikte çizilir: bir ortalama, bir sınır, grafiğin önemli olan çeyreği. Bir işaretin `x`'i burada grafik boyunca uzanan eksenin bir değeridir. Bkz. `ChartMark`.

**Bir noktayı göstermek.** Bir noktanın üstündeki ya da yakınındaki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği noktaya bir dokunuş da onu bırakır. Noktalar üst üste durduğunda imlecin altındakilerin en küçüğü gösterilir. Klavyeyle grafik Tab için tek bir duraktır: grafik boyunca oklar bir serinin noktaları arasında, grafik boyunca durdukları sırayla gider; yukarı ve aşağı oklar önceki ve sonraki seriye, Home ve End serinin ilk ve son noktasına gider, Escape bırakır. Nokta işaretlenir, tooltip onun için gösterilir ve `state`'e, `x`'i serisinin satırları arasındaki sıfırdan sayılan yeri, `series`'i serisinin anahtarı olan bir seçim olarak söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra seri seri, adı ve değerleriyle her nokta; lejantın kayıtları birer anahtardır. İki yüzden çok noktası olan bir grafik yalnızca açıklamasıyla anlatılır.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir. Modifier'ındaki bir yükseklik grafiğin tamamınındır, lejantınki de içinde; verilmezse çizim alanı grafiğin stilinin söylediği kadar yüksektir ve üstündeki ya da altındaki bir lejant kendi yüksekliğini ekler.

Sağdan sola yazılan bir dilde grafik boyunca değerler sağdan başlar ve yukarı doğru olanlar sağda yazılır.

```kotlin
PantrixScatterChart(
    series = listOf(
        ScatterSeries("europe", "Europe", europe, x = { it.income }, y = { it.lifeExpectancy }),
        ScatterSeries("asia", "Asia", asia, x = { it.income }, y = { it.lifeExpectancy })
    ),
    xAxis = ChartAxis(title = "Income"),
    yAxis = ChartAxis(title = "Life expectancy"),
    description = "Life expectancy by income",
    tagKey = "countries"
)
```

Parametreler:

- `series: List<ScatterSeries<*>>`: seriler, listelendikleri sırayla. Anahtarları onları birbirinden ayırır; aynı anahtarlı iki seri reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `xAxis: ChartAxis?`: grafik boyunca uzanan değerlerin ekseni, grafiğin altında. Başlığı, o değerlerin tooltip'te ve ekran okuyucuda ne diye anıldığıdır. `null` ondan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: yukarı doğru değerlerin ekseni, grafiğin yanında. `null` ondan hiçbir şey çizmez.
- `sizeAxis: ChartAxis?`: balonların büyüklüklerinin neyi ölçtüğü: `title`'ı bir büyüklüğün tooltip'te ve ekran okuyucuda ne diye anıldığı, `format`'ı nasıl yazıldığı, `max`'ı da, grafikteki en büyük büyüklük değilse, en büyük balonun karşıladığı büyüklüktür. Ondan hiçbir şey çizilmez ve başka hiçbir şeyi okunmaz.
- `marks: List<ChartMark>`: noktaların yanında çizim alanına çizilen çizgiler ve bantlar.
- `legend: ChartLegend?`: serilerin adlarının durduğu yer. `null` hiç göstermez.
- `tooltip: ChartTooltip?`: gösterilen nokta için gösterilen: başlığı noktanın adıdır, altında da değerlerinin her biri için bir satır. `crosshair`'i noktanın içinden çizim alanı boyunca ve yukarı doğru geçen birer çizgidir, `format`'ı yukarı doğru değeri yazar; bir noktanın paylaşacağı bir yeri yoktur, `shared` okunmaz. Tooltip'in kendi `content`'ine noktanın değerleri verilir, önce grafik boyunca olanı. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gizledikleri ve gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik serilerinin adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan noktayla çağrılır: `x`'i serisinin satırları arasındaki sıfırdan sayılan yeri, `label`'ı adı, `value`'su yukarı doğru değeridir.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi için temanınkiler.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `ScatterChart_<tagKey>`, çizim alanı `ScatterChart_<tagKey>.Plot`, bir nokta `ScatterChart_<tagKey>.Point_<series' key>_<number>` (sayı, satırının birden sayılan yeridir), bir serinin lejant kaydı `ScatterChart_<tagKey>.Legend_<series' key>` ve tooltip `ScatterChart_<tagKey>.Tooltip` olur. Bir noktaya basış, serinin anahtarıyla bir `ScatterChart` `select` olayı olarak, bir lejant kaydına basış da anahtarla ve serinin gösterilip gösterilmediğiyle bir `toggle` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur.
- `zoom: ChartZoom?`: grafiğin değerlerinin bir kısmına, yatayda ve dikeyde birlikte yakından bakmayı sağlayan şey (bkz. `ChartZoom`): Ctrl ya da Command ile tekerlek ve iki parmak aralarındaki noktaya, grafikteyken artı ve eksi gösterilen noktaya, düğmeler ortaya yakınlaşır; fareyle sürükleme görüneni her yöne, düğmeler yatayda taşır, oklar gittikleri noktayı görünüre getirir. İki eksen görünen değerler için yeniden işaretlenir, çizim alanının kenarlarının dışı kesilir. Kısımlar `state`'te, `window` ve `valueWindow` olarak tutulur. Scatter grafiğin gezgin şeridi yoktur: `navigator` ve `fitValues` okunmaz. `null`, grafik bütün değerlerini gösterir.

### ScatterSeries

`import com.pantrixui.components.chart.scatter.ScatterSeries`, `com.pantrixui:components` içinden

```kotlin
class ScatterSeries<T>(
    public val key: String,
    public val name: String,
    public val data: List<T>,
    public val x: (T) -> Number?,
    public val y: (T) -> Number?,
    public val size: ((T) -> Number?)? = null,
    public val label: ((T) -> String?)? = null,
    public val color: Color = Color.Unspecified,
    public val marker: ChartMarker? = null,
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixScatterChart`'taki bir nokta grubu: okunduğu satırlar, her birinin grafik boyunca ve yukarı doğru nerede durduğu ve, balonlar için, her birinin ne kadar büyük olduğu.

```kotlin
ScatterSeries("europe", "Europe", countries, x = { it.income }, y = { it.lifeExpectancy })
```

`x` ve `y` sayıdır ve bir satır ikisinin koyduğu yerde durur. İkisinden biri için sayısı olmayan ya da sonu olmayan bir sayısı olan satırın noktası yoktur. `size` ile her nokta bir balondur: alanı, büyüklüğünün grafikteki en büyük büyüklüğe oranı kadar, en büyük balonun alanından pay alır; böylece bir başkasının iki katı olan değer onun iki katı alandır. `label` bir noktanın adıdır, bir ülke, bir ürün: tooltip'inin başlığı ve ekran okuyucunun onun hakkında söylediği.

Kuruldukları her şey aynı olan iki seri, fonksiyonlar da dahil, aynı seridir: çağıranı serilerini her seferinde yeniden kuran bir grafik bunun için yeniden çizilmez.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve satırları değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar.
- `x: (T) -> Number?`: Bir satırın grafik boyunca durduğu yer.
- `y: (T) -> Number?`: Yukarı doğru durduğu yer.
- `size: ((T) -> Number?)?`: Bir satırın noktasının büyüklüğü, balonlu bir grafik için. Verilmezse serinin noktaları tek boyda işaretlerdir. Büyüklüğü sayı olmayan ya da sıfırın üstünde olmayan satır en küçük balondur.
- `label: ((T) -> String?)?`: Bir satırın noktasının adı. Verilmezse nokta serisinin adıyla anılır.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `marker: ChartMarker?`: Serinin bir noktasının ne olarak çizildiği. Biçimler, renklerin tek başına ayıramayacağı serileri ayırır. Bir balon, bu ne derse desin dairedir. Null ise daire; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki yerine göre daire, kare, karo ya da üçgen.
- `pattern: ChartPattern?`: Balonlarının renklerinin yanında çizildiği desen. Null ise hiçbiri; grafiğin desenleri açıksa, grafiğin serileri arasındaki yerine göre sırasındaki desen. İşaret olan bir noktanın deseni yoktur.

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

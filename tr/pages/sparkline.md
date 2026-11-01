# Sparkline

Bir sayının gidişi, bir sözcüğün yerinde: ait olduğu sayının yanında durur. Ekseni, lejantı ve gösterilecek bir yeri yoktur: sayının ne yöne gittiğini gösterir, gerisini bir grafik gösterir.

- `PantrixSparkline` (`com.pantrixui.components.chart.sparkline`, `com.pantrixui:components`): Bir sayının seyri, bir sözcük kadar yerde, bir çizgi, bir alan ya da çubuklar olarak; eksensiz ve gösterilecek bir şeyi olmadan. Anahtar sözcükler: mini grafik, satır içi grafik, eğilim çizgisi, küçük grafik, sözcük boyutunda grafik.

## Özellikler

- **Değerler.** Değerler satırın başından sonuna eşit adımlarla dizilir. Çizgi ve alan, değerlerin en azı ile en çoğu arasında çizilir: gidiş, sahip olduğu yüksekliği doldurur. Çubuklar sıfırdan çizilir.
- **Uçlar.** `min` yüksekliğin dibindeki, `max` tepesindeki değerdir: birkaç gidiş aynı ölçekte okunur. Uçların dışında kalan değer kutunun kenarında kesilir. Verilmeyen uç değerlerden ve referans çizgisinden gelir.
- **Eğri.** `curve` çizginin ve alanın bir değerden ötekine nasıl gittiğini söyler (`ChartCurve`): düz, değerlerin dışına taşmadan yuvarlak ya da basamaklı. Çubukların eğrisi yoktur.
- **Son değer.** `markLast = true` son değeri işaretler: çizgide ve alanda bir nokta, çubuklarda son çubuk tam renkte, ötekiler daha soluk. Son değer, sayı olan son değerdir.
- **Referans çizgisi.** `reference` değerlerin arkasına, grafiklerin yazı renginde kesikli bir çizgi çizer: bir hedef ya da gidişin başladığı yer.
- **Stil.** `style` temanın ölçülerinin üstüne konur: çizginin kalınlığı (`lineWidth`), çubukların arası (`barGap`), son değerin noktası (`markerSize`), referans çizgisinin kalınlığı (`markLineWidth`).
- **Tür.** `SparklineKind.Line` bir çizgi, `Area` altı soluk dolu bir çizgi, `Bar` her değer için bir çubuktur.
- **Eksik değer.** `null` olan ya da sayı olmayan değer çizgide bir boşluk, çubuklarda boş bir yerdir.
- **Boyut ve renk.** Modifier başka söylemedikçe 96dp genişliğinde ve 32dp yüksekliğindedir; `color` ile, verilmezse temanın ilk grafik rengiyle çizilir.
- **Ekran okuyucu.** `contentDescription` verilirse o adla bir resimdir; verilmezse hiç okunmaz: aynı şeyi söyleyen bir sayının yanındaki gidiş için uygun olan budur.
- **Yön.** Sağdan sola okunan dilde ilk değer sağda durur.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `Sparkline_<tagKey>`.

## Kullanım

### Beside the number it belongs to

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = total, style = PantrixTheme.typography.title)
    PantrixSparkline(values = lastThirtyDays, contentDescription = null)
}
```

### A rounded line with its last value and a target

```kotlin
PantrixSparkline(
    values = temperatures,
    curve = ChartCurve.Smooth,
    markLast = true,
    reference = 20,
    contentDescription = stringResource(Res.string.temperature_today)
)
```

### Bars, for amounts that are counted from nought

```kotlin
PantrixSparkline(
    values = ordersByDay,
    kind = SparklineKind.Bar,
    contentDescription = stringResource(Res.string.orders_this_week),
    tagKey = "orders"
)
```

## Örnekler

### Bir sayının yanında

En yalın hâli: bir sayının yanında, o sayının son on iki haftadaki gidişi. Sayı ve adı yanında yazdığı için gidişin ekran okuyucuya ayrıca söyleyeceği bir şey yok (`contentDescription = null`).

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    Column {
        PantrixText(text = "Ziyaret", color = PantrixTheme.colors.textSecondary)
        PantrixText(text = strings.decimal(SPARK_VISITS.last()), style = PantrixTheme.typography.title)
    }
    PantrixSparkline(values = SPARK_VISITS, tagKey = "plain")
}

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

### Çizgi, alan, çubuk

Aynı değerler üç türde: çizgi, altı dolu çizgi ve çubuklar. Çubuklar sıfırdan başlar; çizgi en az değerden.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(values = SPARK_VISITS, contentDescription = "Ziyaretler, çizgi", tagKey = "line")
    PantrixSparkline(
        values = SPARK_VISITS,
        kind = SparklineKind.Area,
        contentDescription = "Ziyaretler, alan",
        tagKey = "area"
    )
    PantrixSparkline(
        values = SPARK_VISITS,
        kind = SparklineKind.Bar,
        contentDescription = "Ziyaretler, çubuk",
        tagKey = "bar"
    )
}

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

### Eksik değerler ve sıfırın altı

Ölçüm gelmeyen haftalar (`null`) çizgide bir boşluktur; öncesi ve sonrası olmayan tek değer bir noktadır. Sıfırın altına inen değerlerin çubukları sıfırdan aşağı iner.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(values = SPARK_GAPS, contentDescription = "Eksik haftalarıyla ölçüm", tagKey = "gaps")
    PantrixSparkline(
        values = SPARK_BALANCE,
        kind = SparklineKind.Bar,
        contentDescription = "Aylık kâr ve zarar",
        tagKey = "balance"
    )
}

private val SPARK_GAPS = listOf(12, 15, 14, null, null, 18, 21, 19, null, 24)

private val SPARK_BALANCE = listOf(64, 31, -12, -38, 22, 47, 58, 87)
```

### Kendi boyutun ve rengin

Boyutu modifier verir, rengi `color`: yükselen bir gidiş başarı renginde, düşen bir gidiş tehlike renginde, daha geniş bir yerde.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(
        values = SPARK_VISITS,
        modifier = Modifier.size(160.dp, 48.dp),
        kind = SparklineKind.Area,
        color = colors.success.color,
        contentDescription = "Yükselen ziyaretler",
        tagKey = "up"
    )
    PantrixSparkline(
        values = SPARK_VISITS.reversed(),
        modifier = Modifier.size(160.dp, 48.dp),
        kind = SparklineKind.Area,
        color = colors.danger.color,
        contentDescription = "Düşen ziyaretler",
        tagKey = "down"
    )
}

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

### Eğri, son değer ve hedef

`curve` çizginin bir değerden ötekine nasıl gittiğini söyler: `Smooth` değerlerin dışına taşmadan yuvarlar, `StepAfter` her değeri bir sonrakine kadar tutar. `markLast = true` son değeri bir noktayla işaretler; çubuklarda son çubuk tam renkte, ötekiler daha soluk çizilir. `reference` arkaya kesikli bir çizgi çizer: burada sıcaklıkta 20 derece, siparişte günlük hedef.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartCurve
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.chart.sparkline.SparklineKind
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSparkline(
        values = SPARK_TEMPERATURE,
        contentDescription = "Bugünün sıcaklığı",
        tagKey = "smooth",
        curve = ChartCurve.Smooth,
        markLast = true,
        reference = 20
    )
    PantrixSparkline(
        values = SPARK_TEMPERATURE,
        contentDescription = "Bugünün sıcaklığı, basamaklı",
        tagKey = "steps",
        curve = ChartCurve.StepAfter,
        markLast = true
    )
    PantrixSparkline(
        values = SPARK_ORDERS,
        kind = SparklineKind.Bar,
        contentDescription = "Bu haftanın siparişleri",
        tagKey = "orders",
        markLast = true,
        reference = 40
    )
}

private val SPARK_TEMPERATURE = listOf(12.5, 11.8, 13.2, 16.4, 19.8, 22.6, 24.1, 23.4, 21.0, 18.2, 16.9, 15.7)

private val SPARK_ORDERS = listOf(32, 45, 38, 51, 29, 47, 43)
```

### Ortak ölçek ve kendi stili

`min` ve `max` yüksekliğin uçlarını verir: iki sunucunun işlemci kullanımı aynı ölçekte, sıfırdan yüze. Biri az çalışıyor, öteki dolu; uçlar verilmeseydi ikisi de kendi en az ve en çok değeri arasında, aynı yükseklikte görünürdü. Kesikli çizgi ikisinde de yüzde seksendeki uyarı eşiği (`reference`). `style` çizgiyi kalınlaştırır, son değerin noktasını büyütür.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.common.ChartStyle
import com.pantrixui.components.chart.sparkline.PantrixSparkline
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val style = ChartStyle(lineWidth = 3.dp, markerSize = 10.dp)
val servers = listOf(Triple("Sunucu A", SPARK_QUIET, "quiet"), Triple("Sunucu B", SPARK_BUSY, "busy"))
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    servers.forEach { (name, load, key) ->
        Row(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(text = name, modifier = Modifier.width(80.dp))
            PantrixSparkline(
                values = load,
                modifier = Modifier.size(160.dp, 40.dp),
                contentDescription = "$name, işlemci kullanımı",
                tagKey = key,
                style = style,
                markLast = true,
                reference = 80,
                min = 0,
                max = 100
            )
            PantrixText(text = PantrixTheme.strings.percent(load.last() / 100.0))
        }
    }
}

private val SPARK_QUIET = listOf(12, 18, 15, 22, 19, 14, 25, 21, 17, 23)

private val SPARK_BUSY = listOf(71, 78, 84, 80, 92, 88, 95, 99, 90, 86)
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Küçük bir çizgi de dışa aktarılır: düğme çizginin üstünde durur, dosya yalnızca çizgidir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.sparkline.PantrixSparkline

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixSparkline(
    values = SPARK_VISITS,
    contentDescription = "Son on iki günün ziyareti",
    tagKey = "exported",
    export = ChartExport(fileName = "ziyaret") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val SPARK_VISITS = listOf(8200, 8650, 8400, 9100, 9800, 9300, 10400, 10100, 11200, 11800, 11500, 12480)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixSparkline

`import com.pantrixui.components.chart.sparkline.PantrixSparkline`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSparkline(
    values: List<Number?>,
    modifier: Modifier = Modifier,
    kind: SparklineKind = SparklineKind.Line,
    color: Color = Color.Unspecified,
    contentDescription: String? = null,
    tagKey: String? = null,
    export: ChartExport? = null,
    style: ChartStyle? = null,
    curve: ChartCurve = ChartCurve.Linear,
    markLast: Boolean = false,
    reference: Number? = null,
    min: Number? = null,
    max: Number? = null
)
```

Bir sparkline: bir sayının gidişi, bir sözcüğün yerinde; ait olduğu sayının yanında. Ekseni, lejantı ve gösterilecek bir şeyi yoktur: sayının ne yöne gittiğini gösterir, gerisini bir grafik gösterir.

`values` satırın başından sonuna eşit adımlarla dizilir. Yüksekliği `min`'den `max`'a uzanır; bunlar verilmezse çizgi ve alan değerlerin en azından en çoğuna uzanır, böylece gidiş sahip olduğu yüksekliği doldurur; çubuklar sıfırdan, sıfırın altında bir değer varsa en azından. Bir `reference` çizgisi de hesaba katılır. Verilen bir ucun ötesindeki değer kutunun kenarında kesilir. `null` olan ya da sayı olmayan değer çizgide bir boşluk, çubuklarda çubuğu olmayan bir yerdir.

Modifier'ı başka söylemedikçe 96dp genişliğinde ve 32dp yüksekliğindedir; `color` ile ya da temanın grafik renklerinin ilkiyle, `style`'ın `lineWidth`'i kalınlığında çizilir. Sağdan okunan bir dilde ilk değeri sağda durur.

**Ekran okuyucu için** adı `contentDescription` olan bir resimdir; ad verilmezse hiç orada değildir: aynı şeyi söyleyen bir sayının yanındaki sparkline için uygun olan budur.

```kotlin
PantrixSparkline(values = visits, contentDescription = "Visits, last thirty days")
PantrixSparkline(values = temperature, curve = ChartCurve.Smooth, markLast = true, reference = 20)
```

Parametreler:

- `values: List<Number?>`: değerler, okundukları sırayla.
- `modifier: Modifier`: sparkline'ın modifier'ı. Buradaki bir boyut sparkline'ındır.
- `kind: SparklineKind`: değerlerin bir çizgi mi, bir alan mı, çubuklar mı olduğu.
- `color: Color`: çizildiği renk.
- `contentDescription: String?`: gidişin neyin gidişi olduğu, birkaç sözcükle, ekran okuyucu için. `null` onu ekran okuyucunun okuduklarının dışında bırakır.
- `tagKey: String?`: sparkline'ın otomasyon anahtarı: sparkline `Sparkline_<tagKey>` olur.
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur.
- `style: ChartStyle?`: temanınkilerin üstüne konan, çizildiği ölçüler: çizginin kalınlığı (`lineWidth`), iki çubuğun arası (`barGap`), son değerin işareti (`markerSize`) ve referans çizgisinin kalınlığı (`markLineWidth`).
- `curve: ChartCurve`: çizginin ya da alanın bir değerden ötekine nasıl gittiği. Çubukların eğrisi yoktur.
- `markLast: Boolean`: son değerin işaretlenip işaretlenmediği: çizgide ya da alanda stilin `markerSize`'ı büyüklüğünde bir nokta, çubuklarda son çubuk `color` ile, ötekiler onun daha soluk bir payıyla. Son değer, sayı olan son değerdir.
- `reference: Number?`: sparkline'ın boyunca, değerlerinin arkasına, grafiklerin yazı renginde kesikli bir çizginin çizildiği değer: bir hedef ya da gidişin başladığı yer. `null` hiçbirini çizmez.
- `min: Number?`: sparkline'ın dibindeki değer, ya da değerlerinin en azı için `null`. Bir sayıdır ve `max`'tan küçüktür.
- `max: Number?`: tepesindeki değer, ya da değerlerinin en çoğu için `null`.

### SparklineKind

`import com.pantrixui.components.chart.sparkline.SparklineKind`, `com.pantrixui:components` içinden

```kotlin
enum class SparklineKind
```

Bir `PantrixSparkline`'ın değerlerini nasıl çizdiği.

Değerleri:

- `Line`: Değerlerden geçen bir çizgi.
- `Area`: Değerlerden geçen bir çizgi; altı, renginin soluk bir payıyla doludur.
- `Bar`: Her değer için bir çubuk: sıfırdan yukarı ya da sıfırdan aşağı.

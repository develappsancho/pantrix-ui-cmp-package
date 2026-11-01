# Funnel Chart

Gittikçe daha azının geçtiği bir yolun aşamalarını gösteren grafik: aşamalar alt alta durur ve her biri, ona ulaşanların sayısı kadar geniştir. Ötekilerin nerede kaybedildiğini gösterir: ziyaret edenlerden üye olanlar, üye olanlardan deneyenler, deneyenlerden ödeyenler.

- `PantrixFunnelChart` (`com.pantrixui.components.chart.funnel`, `com.pantrixui:components`): Gitgide daha azının geçtiği bir şeyin aşamaları, alt alta, her biri ona ulaşan sayı kadar geniş, ilkinin içindeki payıyla: gösterilen aşama için bir tooltip; her aşamaya tuşlarla ve ekran okuyucuyla ulaşılır. Anahtar sözcükler: huni grafik, dönüşüm, satış hunisi, boru hattı, kayıp, aşamalar.

## Özellikler

- **Biçim.** En büyük aşama grafik kadar geniştir; her aşama, kendinden sonrakinin genişliğine doğru daralır ve aşamalar tek bir huni oluşturur. Sonuncu genişliğini korur. Kendinden öncekinden büyük olan aşama daralmaz, genişler: grafik kendisine verileni çizer. `shape = FunnelShape.Bars` her aşamayı değeri kadar geniş bir çubuk olarak çizer; `horizontal` aşamaları satırların başladığı yandan yan yana dizer, her biri değeri kadar yüksektir.
- **Yazılar.** Aşamanın adı ve değeri içine yazılır; değerin yanında payı durur: ilk aşamaya göre, bir öncekine göre ya da ikisi (`rate`). Yazısına dar gelen aşamanın adı ve değeri yanına, yatay hunide altına yazılır; ikisine de yer yoksa yalnızca adı kalır. `labels = null` hiçbir şey yazmaz.
- **Gösterilen aşama.** İmlecin ya da parmağın satırında durduğu aşama bir halkayla işaretlenir ve tooltip onun adını, değerini ve payını yazar. Klavyede oklar aşamadan aşamaya geçer: yukarı ve aşağı, yatay hunide sağ ve sol.
- **Renkler.** Her aşama, sırasına göre temanın grafik renklerinden birini alır; `FunnelStage`'in `color` alanı bir aşamaya kendi rengini verir.
- **Ekran okuyucu.** Önce grafiğin açıklaması, sonra sırasıyla her aşama: adı, değeri ve payları. İlk aşamaya göre pay tek başına yazılıyorsa çıplak okunur, öbür durumlarda her pay neyin payı olduğuyla.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** Grafik `Funnel_<tagKey>`, bir aşama `Funnel_<tagKey>.Stage_<numara>` olarak etiketlenir. Bir aşamaya basış, aşamanın anahtarıyla bir `select` olayı olarak bildirilir.

## Kullanım

### From a visit to a payment

```kotlin
PantrixFunnelChart(
    stages = listOf(
        FunnelStage("visits", stringResource(Res.string.visits), report.visits),
        FunnelStage("signups", stringResource(Res.string.signups), report.signups),
        FunnelStage("trials", stringResource(Res.string.trials), report.trials),
        FunnelStage("paid", stringResource(Res.string.paid), report.paid)
    ),
    description = stringResource(Res.string.sales_funnel),
    tagKey = "sales"
)
```

### Values written short, and a stage that is pressed

```kotlin
val strings = PantrixTheme.strings
PantrixFunnelChart(
    stages = steps.map { FunnelStage(it.id, it.name, it.count) },
    labels = ChartDataLabels(format = { strings.compact(it) }),
    onSelect = { stage -> openStep(stage.series) },
    tagKey = "checkout"
)
```

## Örnekler

### Ziyaretten ödemeye

En yalın hâli: sırasıyla verilen aşamalar. Her aşamanın anahtarı, adı ve değeri vardır.

İmleci bir aşamanın satırına getir ya da aşamaya dokun: aşama halkalanır ve tooltip değerini, ilk aşamaya göre payıyla birlikte yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart

PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    description = "Bir ziyaretin ödemeye varana kadar geçtiği aşamalar",
    tagKey = "plain"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Ziyaret", 3000),
    FunnelStage("signups", "Üyelik", 1240),
    FunnelStage("trials", "Deneme", 520),
    FunnelStage("paid", "Ödeme", 310)
)
```

### Biçim ve yön

Aşamaların biçimi ve yönü. "Çubuk" her aşamayı değeri kadar geniş bir çubuk olarak çizer (`shape = FunnelShape.Bars`); anahtarı çevir: aşamalar yan yana durur (`horizontal = true`), her biri değeri kadar yüksek. Klavyede oklar o zaman sağa ve sola gider.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelShape
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var shape by remember { mutableStateOf(FunnelShape.Funnel) }
var horizontal by remember { mutableStateOf(false) }
PantrixSegmentButton(
    options = FUNNEL_SHAPES,
    selected = shape,
    onSelect = { shape = it },
    fullWidth = false,
    tagKey = "funnel_shape"
)
PantrixSwitchButton(
    checked = horizontal,
    onCheckedChange = { horizontal = it },
    label = "Yatay",
    tagKey = "funnel_horizontal"
)
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    shape = shape,
    horizontal = horizontal,
    description = "Bir ziyaretin ödemeye varana kadar geçtiği aşamalar",
    tagKey = "shape"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Ziyaret", 3000),
    FunnelStage("signups", "Üyelik", 1240),
    FunnelStage("trials", "Deneme", 520),
    FunnelStage("paid", "Ödeme", 310)
)

private val FUNNEL_SHAPES = listOf(
    SegmentOption(value = FunnelShape.Funnel, label = "Huni", tagKey = "funnel"),
    SegmentOption(value = FunnelShape.Bars, label = "Çubuk", tagKey = "bars")
)
```

### Dönüşüm oranları

Dönüşüm oranları (`rate`). "İlkine göre" her aşamanın ilk aşamadaki payını, "Öncekine göre" bir önceki aşamaya ulaşanların ne kadarının bu aşamaya geçtiğini, "İkisi" ikisini birden yazar. Aşamanın üstünde paylar yalın durur, ikisi bir noktayla ayrılır; tooltip ve ekran okuyucu her payın neye göre olduğunu söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelRate
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var rate by remember { mutableStateOf(FunnelRate.Previous) }
PantrixSegmentButton(
    options = FUNNEL_RATES,
    selected = rate,
    onSelect = { rate = it },
    fullWidth = false,
    tagKey = "funnel_rate"
)
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    rate = rate,
    description = "Bir ziyaretin ödemeye varana kadar geçtiği aşamalar, dönüşüm oranlarıyla",
    tagKey = "rates"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Ziyaret", 3000),
    FunnelStage("signups", "Üyelik", 1240),
    FunnelStage("trials", "Deneme", 520),
    FunnelStage("paid", "Ödeme", 310)
)

private val FUNNEL_RATES = listOf(
    SegmentOption(value = FunnelRate.First, label = "İlkine göre", tagKey = "first"),
    SegmentOption(value = FunnelRate.Previous, label = "Öncekine göre", tagKey = "previous"),
    SegmentOption(value = FunnelRate.Both, label = "İkisi", tagKey = "both")
)
```

### Kısa yazılan değerler

Büyük sayılar kısa yazılır (`ChartDataLabels`'ın `format`'ı): aşamaların içinde yer kalır. Anahtarı çevir: yazılar kalkar (`labels = null`) ve değerler yalnızca tooltip'te ve ekran okuyucuda durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var written by remember { mutableStateOf(true) }
val strings = PantrixTheme.strings
PantrixSwitchButton(
    checked = written,
    onCheckedChange = { written = it },
    label = "Yazılar",
    tagKey = "funnel_labels"
)
PantrixFunnelChart(
    stages = CAMPAIGN_STEPS,
    labels = if (written) ChartDataLabels(format = { strings.compact(it) }) else null,
    description = "Bir kampanyanın gösterimden satışa aşamaları",
    tagKey = "labels"
)

private val CAMPAIGN_STEPS = listOf(
    FunnelStage("shown", "Gösterim", 1_250_000),
    FunnelStage("clicks", "Tıklama", 410_000),
    FunnelStage("carts", "Sepet", 96_000),
    FunnelStage("orders", "Sipariş", 38_500),
    FunnelStage("repeat", "Yeniden alan", 9_200)
)
```

### Bir aşamaya basmak

Bir basış, aşamayı alır: anahtarı `series`'inde, adı `name`'inde, değeri `value`'sunda, grafiğin yazdığı metin `text`'indedir. Bir aşamaya bas: alttaki satır basılanı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.components.elements.text.PantrixText

var pressed by remember { mutableStateOf<String?>(null) }
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    onSelect = { pressed = "${it.name}: ${it.text}" },
    description = "Bir ziyaretin ödemeye varana kadar geçtiği aşamalar",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Bir aşamaya bas")

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Ziyaret", 3000),
    FunnelStage("signups", "Üyelik", 1240),
    FunnelStage("trials", "Deneme", 520),
    FunnelStage("paid", "Ödeme", 310)
)
```

### Genişleyen bir aşama

Bir aşama kendinden öncekinden büyük olabilir: aranan kişiler, başvuranlardan çok. Grafik sırayı da sayıyı da değiştirmez; o aşama daralmak yerine genişler ve payı yüzde yüzü geçer.

Son aşama yazısına dar geldiği için adı ve değeri yanında durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart

PantrixFunnelChart(
    stages = listOf(
        FunnelStage("leads", "Başvuru", 800),
        FunnelStage("calls", "Arama", 950),
        FunnelStage("offers", "Teklif", 300),
        FunnelStage("won", "Satış", 40)
    ),
    description = "Başvurudan satışa: aramalar başvurulardan çok",
    tagKey = "widening"
)
```

### Kendi renklerin

Aşamaların kendi renkleri: temanın bir rolü, aşamadan aşamaya açılarak. Her `FunnelStage` rengini kendi taşır; verilmeyen aşama sırasının grafik rengini alır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart
import com.pantrixui.foundation.theme.PantrixTheme

val tone = PantrixTheme.colors.primary.color
PantrixFunnelChart(
    stages = FUNNEL_STEPS.mapIndexed { place, stage ->
        FunnelStage(stage.key, stage.name, stage.value, tone.copy(alpha = 1f - place * 0.2f))
    },
    description = "Bir ziyaretin ödemeye varana kadar geçtiği aşamalar, tek renkte",
    tagKey = "own_colors"
)

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Ziyaret", 3000),
    FunnelStage("signups", "Üyelik", 1240),
    FunnelStage("trials", "Deneme", 520),
    FunnelStage("paid", "Ödeme", 310)
)
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada aşamalar, değerleri ve oranları durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.funnel.FunnelStage
import com.pantrixui.components.chart.funnel.PantrixFunnelChart

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixFunnelChart(
    stages = FUNNEL_STEPS,
    description = "Bir ziyaretin ödemeye varana kadar geçtiği aşamalar",
    tagKey = "exported",
    export = ChartExport(fileName = "ziyaretten-odemeye") { file = it }
)
ExportedFile(file, tagKey = "exported")

private val FUNNEL_STEPS = listOf(
    FunnelStage("visits", "Ziyaret", 3000),
    FunnelStage("signups", "Üyelik", 1240),
    FunnelStage("trials", "Deneme", 520),
    FunnelStage("paid", "Ödeme", 310)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixFunnelChart

`import com.pantrixui.components.chart.funnel.PantrixFunnelChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFunnelChart(
    stages: List<FunnelStage>,
    modifier: Modifier = Modifier,
    labels: ChartDataLabels? = ChartDataLabels(),
    tooltip: ChartTooltip? = ChartTooltip(),
    empty: (@Composable () -> Unit)? = null,
    state: ChartState = rememberChartState(),
    description: String? = null,
    onSelect: ((ChartPoint) -> Unit)? = null,
    style: ChartStyle? = null,
    colors: ChartColors? = null,
    tagKey: String? = null,
    shape: FunnelShape = FunnelShape.Funnel,
    horizontal: Boolean = false,
    rate: FunnelRate = FunnelRate.First,
    export: ChartExport? = null
)
```

Bir huni: gittikçe daha azının geçtiği bir şeyin aşamaları, alt alta, her biri ona ulaşanların sayısı kadar geniş. Ötekilerin nerede kaybedildiğini gösterir: üye olan ziyaretçiler, deneyen üyeler, ödeyen deneyenler.

Grafik `stages`'ini, birbirini izledikleri sırayla alır. En büyüğü grafik kadar geniştir ve her biri, kendinden sonrakinin genişliğine doğru daralır; böylece aşamalar tek bir huni oluşturur. Sonuncusu genişliğini korur. Kendinden öncekinden büyük olan aşama daralmak yerine genişler: huni kendisine verileni çizer. `FunnelShape.Bars` olarak çizilince her aşama değeri kadar geniş bir çubuktur. `horizontal` bir huni aşamalarını satırların başladığı yandan yan yana dizer, her biri değeri kadar yüksektir.

Bir aşamanın adı ve değeri içine yazılır, değerin ardında `rate`'in söylediği paylarıyla, renginin üstünde daha iyi okunan siyahla ya da beyazla. Yazısına küçük gelen aşamanın yazısı yanında, yatay bir hunide altında durur; kolonu tek satıra dar geliyorsa ad üstte, değer altta. Bu yerlerin hiçbirinde yeri yoksa adı tek başına yazılır, ona da yeri olmayan aşamaya hiçbir şey yazılmaz. `tooltip` ve ekran okuyucu ikisini de her zaman taşır.

**Bir aşamayı göstermek.** Bir aşamanın satırının üstündeki imleç onu gösterir; parmak bir dokunuşla gösterir, gösterdiği aşamaya bir dokunuş da onu bırakır. Klavyeyle grafik Tab için tek bir duraktır: oklar aşamadan aşamaya gider, yukarı ve aşağı, yatay bir hunide sağa ve sola; Home ve End ilkine ve sonuncusuna gider, Escape bırakır. Aşama halkalanır, tooltip onun için gösterilir ve `state`'e, `x`'i aşamanın anahtarı olan bir seçim olarak söylenir. Üstünde bir basış, Enter ya da Space `onSelect`'i çağırır.

**Ekran okuyucu için** grafik `description`'ıdır, sonra sırasıyla her aşama, adı, değeri ve paylarıyla: bir pay neye göre olduğunu söyler, huninin yalnızca ilk aşamaya göre payı yazdığı yer dışında.

**Boyutu.** Grafik kendisine verilen yer kadar geniştir; modifier'ının söylediği kadar, yükseklik verilmediyse grafiğin stilinin söylediği kadar yüksektir.

```kotlin
PantrixFunnelChart(
    stages = listOf(
        FunnelStage("visits", "Visits", 3000),
        FunnelStage("signups", "Sign-ups", 1240),
        FunnelStage("paid", "Paid", 310)
    ),
    description = "From a visit to a payment",
    tagKey = "sales"
)
```

Parametreler:

- `stages: List<FunnelStage>`: aşamalar, birbirini izledikleri sırayla. Anahtarları onları ayırır; aynı anahtarı taşıyan iki aşama reddedilir.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir.
- `labels: ChartDataLabels?`: aşamalara yazılan: her aşamanın adı ve değeri, `format`'ın söylediği gibi ya da o bir şey söylemiyorsa temanın diliyle, paylarıyla. `null` hiçbir şey yazmaz.
- `tooltip: ChartTooltip?`: gösterilen aşama için gösterilen: adı ve değeri, paylarıyla. İki pay yazılırken değer aşamanın satırında tek başına durur, her pay da altında kendi satırında; çağıranın kendi tooltip'ine bu satırlar, payla adlandırılmış, değeri pay olan ve yazısı olmayan birer aşama noktası olarak verilir. Bir aşamanın paylaşılacak bir yeri ve içinden geçen bir çizgisi yoktur: `shared` ve `crosshair` okunmaz. `null` hiç göstermez.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için: grafik hakkında söylediği ilk şey. Verilmezse grafik aşamalarının adlarıyla duyurulur.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan aşamayla çağrılır: anahtarı `series`'i ve `x`'idir, adı `name`'i ve `label`'ı, `text`'i de ardında paylarıyla değeridir.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi: burada verilen alanlar, gerisi temanınkiyle. İki aşamanın arası bir `sliceGap` kadardır.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı: grafik `Funnel_<tagKey>`, aşamaları birlikte `Funnel_<tagKey>.Plot`, bir aşama birden sayılarak `Funnel_<tagKey>.Stage_<number>`, tooltip `Funnel_<tagKey>.Tooltip`'tir. Bir aşamaya basış, aşamanın anahtarıyla bir `Funnel` `select` olayı olarak bildirilir. Değerlerden hiçbir şey bildirilmez.
- `shape: FunnelShape`: aşamaların nasıl çizildiği: tek bir huni olarak ya da çubuklar olarak.
- `horizontal: Boolean`: aşamaların alt alta değil, satırların başladığı yandan yan yana durup durmadığı.
- `rate: FunnelRate`: bir aşamanın değerinin hangi paylarla yazıldığı: ilk aşamaya göre, kendinden önceki aşamaya göre ya da ikisi. Aşamada değerin ardında ayraç içinde dururlar, ikisi bir noktayla ayrılır; tooltip ve ekran okuyucu için öncekine göre olan pay ve ikisinin her biri neye göre olduğunu söyler (`PantrixStrings.shareOfFirst` ve `shareOfPrevious`).
- `export: ChartExport?`: grafiği uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: grafiğin üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, grafikte böyle bir düğme yoktur.

### FunnelStage

`import com.pantrixui.components.chart.funnel.FunnelStage`, `com.pantrixui:components` içinden

```kotlin
class FunnelStage(
    public val key: String,
    public val name: String,
    public val value: Number,
    public val color: Color = Color.Unspecified,
    public val pattern: ChartPattern? = null
)
```

Bir `PantrixFunnelChart`'ın bir aşaması: izlenen şeyin bir adımı, ve ona kaç kişinin ulaştığı.

```kotlin
FunnelStage("signups", "Sign-ups", 1240)
```

Parametreler:

- `key: String`: Aşamayı hunisinin ötekilerinden ayıran, değeri değişirken aynı kalan şey: bir seçimin söylediği ve bir olayın bildirdiği. Bir test etiketinin anahtarı gibi yazılır: küçük harfler ve rakamlarla.
- `name: String`: Aşamanın adı: aşamanın yanında, tooltip'te ve ekran okuyucuda.
- `value: Number`: Aşamaya kaç kişinin ulaştığı. Sayı olmayan, sonu olmayan ya da sıfırın altındaki bir değer hiçbir şey saymaz.
- `color: Color`: Aşamanın çizildiği renk. Verilmezse, aşamaların arasındaki sırasına göre temanın grafik rengidir.
- `pattern: ChartPattern?`: Aşamanın renginin yanında çizildiği desen. Verilmezse hiçbiri; grafiğin desenleri açıksa (`ChartStyle.patterns`), aşamalar arasındaki yerine göre sırasındaki desen: ilkinin hiçbiri.

### FunnelShape

`import com.pantrixui.components.chart.funnel.FunnelShape`, `com.pantrixui:components` içinden

```kotlin
enum class FunnelShape
```

Bir `PantrixFunnelChart`'ın aşamalarının nasıl çizildiği.

Değerleri:

- `Funnel`: Tek bir huni olarak: her aşama kendinden sonraki aşamanın büyüklüğüne doğru daralır ya da genişler.
- `Bars`: Çubuklar olarak: her biri satırı boyunca değeri kadar büyük.

### FunnelRate

`import com.pantrixui.components.chart.funnel.FunnelRate`, `com.pantrixui:components` içinden

```kotlin
enum class FunnelRate
```

Bir `PantrixFunnelChart`'ta bir aşamanın değerinin hangi paylarla yazıldığı.

Değerleri:

- `First`: İlk aşamaya göre: izlenenlerin hepsinden ne kadarının ona ulaştığı.
- `Previous`: Kendinden önceki aşamaya göre: ona ulaşanların ne kadarının bu aşamaya geçtiği. İlk aşamanın böyle bir payı yoktur.
- `Both`: İlk aşamaya göre ve kendinden öncekine göre.

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

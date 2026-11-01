# Waterfall Chart

Bir miktarın adım adım nasıl oluştuğunu gösteren grafik: her çubuk bir öncekinin bittiği yerden başlar; satırın eklediği kadar yukarı, götürdüğü kadar aşağı gider. Bir dönemin nakit akışı, bir bütçenin kalemleri, bir stokun giriş ve çıkışları içindir.

Tek bir `WaterfallSeries` taşıyan bir `PantrixChart`'ın kısa yazılışıdır. Eksenler, tooltip, durum, klavye ve ekran okuyucu "Chart" sayfasında anlatıldığı gibidir.

- `PantrixWaterfallChart` (`com.pantrixui.components.chart.waterfall`, `com.pantrixui:components`): Bir miktarın adım adım nasıl oluştuğu: her çubuk bir öncekinin bittiği yerden başlar, eklenen için yukarı, çıkarılan için aşağı; toplamlar sıfırın üstünde durur. Tek bir şelalenin grafiğinin kısa yolu. Anahtar sözcükler: şelale grafik, köprü grafik, basamak, fark, kümülatif toplam, kâr zarar.

## Özellikler

- **Adımlar.** Satırın değeri eklediği miktardır; sıfırın altındaysa götürdüğü. Ekleyen adım grafiğin `rising` renginde, götüren adım `falling` renginde çizilir: temanın `success` ve `danger` renkleri, `colors` başka söylemedikçe.
- **Toplamlar.** `total`'ın toplam dediği satır sıfırın üstünde durur ve kendinden önceki adımların vardığı yeri gösterir; kendi değeri sorulmaz. Kendi değeri olan bir toplam, sayımın yeniden başladığı yerdir: ilk adımdan önceki açılış tutarı gibi. Toplamlar serinin kendi renginde çizilir (`color`).
- **Bağlantı çizgileri.** Her çubuğun ucundan bir sonrakinin başladığı yere ince bir çizgi gider (`connectors`).
- **Sıfır.** Değer ekseni sıfırı içine alır: toplamlar onun üstünde durur.
- **Tooltip ve ekran okuyucu.** Bir adım eklediğiyle, işaretiyle yazılır ("+310"); bir toplam vardığı yerle. Bir basış, noktanın `value`'sunda adımı, `from`'unda adımın başladığı seviyeyi alır.
- **Değer etiketleri.** `labels` her çubuğun neyi gösterdiğini ucuna yazar: yukarı gidenin üstüne, aşağı gidenin altına.
- **Yatay.** `horizontal = true` kalemleri grafiğin yanından aşağı dizer; her çubuk üstündekinin bittiği yerden başlar, ekleyen sağa, götüren sola gider (sağdan sola okunan dilde tersi). Değerler grafiğin altına yazılır.
- **Otomasyon.** Grafik, olduğu `PantrixChart` gibi etiketlenir: `Chart_<tagKey>`. Tek serisinin anahtarı `steps`'tir.

## Kullanım

### From the opening amount to the closing one

```kotlin
PantrixWaterfallChart(
    data = moves,
    x = { it.name },
    y = { it.amount },
    name = stringResource(Res.string.cash),
    total = { it.isTotal },
    description = stringResource(Res.string.cash_of_the_quarter),
    tagKey = "cash"
)
```

### Each step written at its bar, in the brand's own colours

```kotlin
PantrixWaterfallChart(
    data = moves,
    x = { it.name },
    y = { it.amount },
    name = stringResource(Res.string.cash),
    total = { it.isTotal },
    labels = ChartDataLabels(),
    colors = ChartColors(rising = brand.gain, falling = brand.loss),
    tagKey = "cash_labelled"
)
```

## Örnekler

### Açılıştan kapanışa

Bir çeyreğin nakit akışı: açılış tutarı, gelirler, giderler ve kapanış. Açılış, kendi değeri olan bir toplamdır: sayım ondan başlar. Kapanışın değeri yoktur: adımların vardığı yeri gösterir.

İmleci bir çubuğun üstüne getir ya da çubuğa dokun: tooltip adımı işaretiyle yazar. Çubukların arasındaki ince çizgiler her adımın bir öncekinin bittiği yerden başladığını gösterir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Nakit (bin TL)",
    total = { it.total },
    description = "Bir çeyreğin nakit akışı, açılıştan kapanışa",
    tagKey = "plain"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Açılış", amount = 420, total = true),
    CashMove("Satış", amount = 310),
    CashMove("Hizmet", amount = 120),
    CashMove("Maaş", amount = -260),
    CashMove("Kira", amount = -90),
    CashMove("Vergi", amount = -70),
    CashMove("Kapanış", amount = null, total = true)
)
```

### Ara toplamlar

Yolun ortasında ara toplamlar: her çeyreğin sonunda, o ana kadar varılan yer. Ara toplam sıfırın üstünde durur ve sayım ondan sonra kaldığı yerden sürer.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = HALF_YEAR_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Nakit (bin TL)",
    total = { it.total },
    description = "Bir yarıyılın aylık nakit değişimi, çeyrek sonlarında ara toplamla",
    tagKey = "subtotals"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val HALF_YEAR_CASH = listOf(
    CashMove("Oca", amount = 180),
    CashMove("Şub", amount = -60),
    CashMove("Mar", amount = 140),
    CashMove("1. çeyrek", amount = null, total = true),
    CashMove("Nis", amount = -110),
    CashMove("May", amount = 90),
    CashMove("Haz", amount = 210),
    CashMove("2. çeyrek", amount = null, total = true)
)
```

### Değerler çubukların ucunda

Her çubuğun neyi gösterdiği ucuna yazılır (`labels`): ekleyen adımın üstüne, götüren adımın altına, işaretiyle; toplamın üstüne, olduğu gibi.

Yeri olmayan etiket atlanır; değer tooltip'te ve ekran okuyucuda durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Nakit (bin TL)",
    total = { it.total },
    labels = ChartDataLabels(),
    description = "Bir çeyreğin nakit akışı, değerleriyle",
    tagKey = "labels"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Açılış", amount = 420, total = true),
    CashMove("Satış", amount = 310),
    CashMove("Hizmet", amount = 120),
    CashMove("Maaş", amount = -260),
    CashMove("Kira", amount = -90),
    CashMove("Vergi", amount = -70),
    CashMove("Kapanış", amount = null, total = true)
)
```

### Yatay

Aynı çeyrek yatay (`horizontal = true`): kalemler grafiğin yanından aşağı dizilir ve her çubuk üstündekinin bittiği yerden başlar. Kalemlerin adları uzun ya da kalemler çok olduğunda yatay şelale daha kolay okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart

PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Nakit (bin TL)",
    total = { it.total },
    horizontal = true,
    labels = ChartDataLabels(),
    description = "Bir çeyreğin nakit akışı, yatay çubuklarla",
    tagKey = "horizontal_steps"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Açılış", amount = 420, total = true),
    CashMove("Satış", amount = 310),
    CashMove("Hizmet", amount = 120),
    CashMove("Maaş", amount = -260),
    CashMove("Kira", amount = -90),
    CashMove("Vergi", amount = -70),
    CashMove("Kapanış", amount = null, total = true)
)
```

### Kendi renklerin

Adımların iki rengi grafiğin renklerinden gelir (`ChartColors`'ın `rising` ve `falling` alanları), toplamların rengi serinin kendisinden (`color`). Anahtarı çevir: çubukların arasındaki çizgiler kalkar (`connectors`).

Renk tek başına anlam taşımamalı: bir adımın yönü çubuğun nereden nereye gittiğinden ve değerinin işaretinden de okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.common.ChartColors
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var connectors by remember { mutableStateOf(true) }
val theme = PantrixTheme.colors
PantrixSwitchButton(
    checked = connectors,
    onCheckedChange = { connectors = it },
    label = "Bağlantı çizgileri",
    tagKey = "waterfall_connectors"
)
PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Nakit (bin TL)",
    total = { it.total },
    connectors = connectors,
    color = theme.neutral.color,
    colors = ChartColors(rising = theme.info.color, falling = theme.warning.color),
    description = "Bir çeyreğin nakit akışı, kendi renkleriyle",
    tagKey = "own_colors"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Açılış", amount = 420, total = true),
    CashMove("Satış", amount = 310),
    CashMove("Hizmet", amount = 120),
    CashMove("Maaş", amount = -260),
    CashMove("Kira", amount = -90),
    CashMove("Vergi", amount = -70),
    CashMove("Kapanış", amount = null, total = true)
)
```

### Bir adıma basmak

Bir basış adımı ve başladığı seviyeyi alır: noktanın `value`'su adımın eklediği, `from`'u adımın başladığı seviyedir; ikisinin toplamı adımdan sonra varılan yerdir. Toplamın `from`'u yoktur. Bir çubuğa bas: alttaki satır basılanı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var pressed by remember { mutableStateOf<String?>(null) }
val strings = PantrixTheme.strings
PantrixWaterfallChart(
    data = QUARTER_CASH,
    x = { it.name },
    y = { it.amount },
    name = "Nakit (bin TL)",
    total = { it.total },
    onSelect = { point ->
        val start = point.from
        pressed = if (start == null) {
            "${point.label}: toplam ${point.text}"
        } else {
            "${point.label}: ${point.text}, sonrasında ${strings.decimal(start + point.value)}"
        }
    },
    description = "Bir çeyreğin nakit akışı",
    tagKey = "press"
)
PantrixText(text = pressed ?: "Bir çubuğa bas")

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Açılış", amount = 420, total = true),
    CashMove("Satış", amount = 310),
    CashMove("Hizmet", amount = 120),
    CashMove("Maaş", amount = -260),
    CashMove("Kira", amount = -90),
    CashMove("Vergi", amount = -70),
    CashMove("Kapanış", amount = null, total = true)
)
```

### Uzun yazılış

Kısa yazılışın açtığı grafik: tek bir `WaterfallSeries` taşıyan bir `PantrixChart`. Kısa yazılışın `horizontal = true`'su uzun yazılışta `orientation = ChartOrientation.Horizontal`'dır; seri anahtarını ve adını kendisi taşır. Şelaleyi başka şeylerle bir arada isteyen ekran bu yazılışı kullanır: burada kapanış hedefini gösteren bir çizgi.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.cartesian.ChartOrientation
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.PantrixChart
import com.pantrixui.components.chart.cartesian.WaterfallSeries

PantrixChart(
    series = listOf(
        WaterfallSeries(
            key = "cash",
            name = "Nakit (bin TL)",
            data = QUARTER_CASH,
            x = { it.name },
            y = { it.amount },
            total = { it.total }
        )
    ),
    orientation = ChartOrientation.Horizontal,
    marks = listOf(ChartReferenceLine(y = 500, label = "Hedef")),
    description = "Bir çeyreğin nakit akışı ve kapanış hedefi, yatay çubuklarla",
    tagKey = "as_series"
)

private data class CashMove(
    val name: String,
    val amount: Int?,
    val total: Boolean = false
)

private val QUARTER_CASH = listOf(
    CashMove("Açılış", amount = 420, total = true),
    CashMove("Satış", amount = 310),
    CashMove("Hizmet", amount = 120),
    CashMove("Maaş", amount = -260),
    CashMove("Kira", amount = -90),
    CashMove("Vergi", amount = -70),
    CashMove("Kapanış", amount = null, total = true)
)
```

## API

### PantrixWaterfallChart

`import com.pantrixui.components.chart.waterfall.PantrixWaterfallChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixWaterfallChart(
    data: List<T>,
    x: (T) -> Any,
    y: (T) -> Number?,
    name: String,
    modifier: Modifier = Modifier,
    total: ((T) -> Boolean)? = null,
    connectors: Boolean = true,
    color: Color = Color.Unspecified,
    horizontal: Boolean = false,
    labels: ChartDataLabels? = null,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    tooltip: ChartTooltip? = ChartTooltip(),
    zoom: ChartZoom? = null,
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

Bir şelale grafiği: bir miktarın adım adım nasıl oluştuğu. Her çubuk bir öncekinin bittiği yerden başlar; satırın eklediği kadar yukarı, götürdüğü kadar aşağı gider. Bir toplam sıfırın üstünde durur ve kendinden önceki adımların vardığı yeri gösterir.

Tek bir `WaterfallSeries` taşıyan bir `PantrixChart`'tır, daha kısa yazılmış: bir grafiğin yaptığı her şeyi yapar. Ekleyen adım grafiğin `rising` renginde, götüren adım `falling` renginde çizilir: `colors` başka söylemedikçe temanın `success`'i ve `danger`'ı. Bir toplam `color`'da çizilir. Her çubuğun ucundan bir sonrakinin başladığı yere ince bir çizgi gider. `horizontal` ise yerler grafiğin yanından birbirinin altında aşağı dizilir, çubuklar boyunca uzanır; her biri üstündekinin bittiği yerden başlar.

**Toplamlar.** `total`'ın toplam dediği satırın değere ihtiyacı yoktur: o ana kadarki sayımı gösterir. Değeri olan bir toplam, sayımın yeniden başladığı yerdir; ilk adımdan önceki bir açılış tutarı böyledir. Toplam olmayan ve değeri olmayan satır hiçbir şey eklemeyen bir adımdır ve çubuğu yoktur.

Tooltip'te ve ekran okuyucuda bir adım eklediğiyle, işaretiyle yazılır; bir toplam vardığı yerle. Bir basış, noktanın `value`'sunda adımı, `from`'unda adımın başladığı seviyeyi alır.

```kotlin
PantrixWaterfallChart(
    data = moves,
    x = { it.name },
    y = { it.amount },
    name = "Cash",
    total = { it.isTotal },
    tagKey = "cash"
)
```

Parametreler:

- `data: List<T>`: satırlar, adımlarının sayıldığı sırayla.
- `x: (T) -> Any`: bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `y: (T) -> Number?`: bir satırın eklediği, sıfırın altındaysa götürdüğü, ya da değeri yoksa null. Bir toplam için, sayımın yeniden başladığı tutar, ya da kendinden önceki adımların vardığı yer için null.
- `name: String`: tutarların neyin tutarı olduğu: tooltip'in onlara verdiği ad, ve `description`'ı olmayan grafiğin ekran okuyucudaki adı.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir.
- `total: ((T) -> Boolean)?`: bir satırın toplam olup olmadığı. `null` ise grafiğin toplamı yoktur.
- `connectors: Boolean`: her çubuğun ucundan bir sonrakine bir çizgi gidip gitmediği.
- `color: Color`: toplamların çizildiği renk. Verilmezse grafiğin renklerinin ilkidir.
- `horizontal: Boolean`: yerlerin grafiğin altı boyunca dizilip çubukların yukarı uzanması yerine, yanından aşağı dizilip çubukların boyunca uzanıp uzanmadığı.
- `labels: ChartDataLabels?`: her çubuğun neyi gösterdiği, ucuna yazılmış: bir adım işaretiyle, bir toplam olduğu gibi, yeri olduğunda. `null` hiçbirini yazmaz.
- `xAxis: ChartAxis?`: yerlerin ekseni, grafiğin altında, `horizontal` ise yanında. `null` ondan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin yanında, `horizontal` ise altında. `null` ondan hiçbir şey çizmez.
- `marks: List<ChartMark>`: adımların yanında çizim alanına çizilen çizgiler ve bantlar: bir hedef, bir sınır.
- `tooltip: ChartTooltip?`: gösterilen yer için gösterilen şey. `null` hiç göstermez.
- `zoom: ChartZoom?`: okuyucunun yerlerin bir kısmına yakından bakmasını ve geri kalanı boyunca kaydırmasını sağlayan şey. Grafiğe verilmedikçe `null`'dır; `null` bütün yerleri gösterir, başka bir şey yapmaz.
- `export: ChartExport?`: okuyucunun grafiği uygulamadan bir dosya olarak çıkarmasını sağlayan şey: bir resim, ya da her boyutta keskin bir çizim. Grafiğe verilmedikçe `null`'dır, ve grafiğin böyle bir düğmesi olmaz.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken çizim alanında gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar. Grafiğin dışa aktarıldığı dosya sözü yazar.
- `state: ChartState`: okuyucunun gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan adımla ya da toplamla çağrılır.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde: `rising` ve `falling` da aralarında.
- `tagKey: String?`: grafiğin otomasyon anahtarı. Grafik, olduğu `PantrixChart` gibi etiketlenir, `Chart_<tagKey>`, ve parçaları ile olayları o grafiğinkilerdir; tek serisinin anahtarı `steps`'tir.

### WaterfallSeries

`import com.pantrixui.components.chart.cartesian.WaterfallSeries`, `com.pantrixui:components` içinden

```kotlin
class WaterfallSeries<T>(
    override val key: String,
    override val name: String,
    public val data: List<T>,
    public val x: (T) -> Any,
    public val y: (T) -> Number?,
    public val total: ((T) -> Boolean)? = null,
    override val color: Color = Color.Unspecified,
    public val connectors: Boolean = true,
    override val axis: ChartYAxis = ChartYAxis.First,
    override val labels: ChartDataLabels? = null
) : ChartSeries()
```

Değerleri adım olan bir seri: her çubuk bir öncekinin bittiği yerden başlar; böylece grafik bir miktarın nasıl oluştuğunu, yolda ona ne eklendiğini ve ondan ne götürüldüğünü gösterir.

```kotlin
WaterfallSeries("cash", "Cash", moves, x = { it.name }, y = { it.amount }, total = { it.isTotal })
```

Bir satırın değeri satırın eklediğidir; sıfırın altındaysa götürdüğü. Adımlar grafiğin yerleri boyunca, onların sırasıyla sayılır. Ekleyen adım grafiğin `rising` renginde, götüren adım `falling` renginde çizilir; bunları grafiğin `colors`'ı söyler. Her çubuğun ucundan bir sonrakinin başladığı yere ince bir çizgi gider.

**Toplamlar.** `total`'ın toplam dediği satır sıfırın üstünde durur ve kendinden önceki adımların vardığı yeri gösterir: kendi değeri sorulmaz. Değeri olan bir toplam sayımın yeniden başladığı yerdir: ilk adımdan önceki bir açılış tutarı, ya da bilinen bir rakamdan yeniden alınan bir sayım. Toplamlar serinin kendi `color`'ında çizilir.

Değeri olmayan satır hiçbir şey eklemeyen bir adımdır ve çubuğu yoktur. Bir şelale yığılmaz, ve ekseni sıfırı içine alır: toplamları onun üstünde durur.

Tooltip'te ve ekran okuyucuda bir adım eklediğiyle, işaretiyle yazılır; bir toplam vardığı yerle. Bir basış, noktanın `value`'sunda adımı, `from`'unda adımın başladığı seviyeyi alır: sayımın ondan sonra vardığı yer ikisinin toplamıdır.

Kuruldukları her şey aynı olan iki seri, üç fonksiyon da dahil, aynı seridir.

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey: lejantın gizlenen seriyi onunla tuttuğu, bir seçimin adını verdiği ve bir olayın bildirdiği anahtar. Bir test etiketinin anahtarı gibi, küçük harflerle ve rakamlarla yazılır.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `data: List<T>`: Satırlar, adımlarının sayıldığı sırayla.
- `x: (T) -> Any`: Bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `y: (T) -> Number?`: Bir satırın eklediği, sıfırın altındaysa götürdüğü, ya da değeri yoksa null. Bir toplam için, sayımın yeniden başladığı tutar, ya da kendinden önceki adımların vardığı yer için null.
- `total: ((T) -> Boolean)?`: Bir satırın toplam olup olmadığı. Null ise serinin toplamı yoktur.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir: ilk seri için ilki.
- `connectors: Boolean`: Her çubuğun ucundan bir sonrakine bir çizgi gidip gitmediği.
- `axis: ChartYAxis`: Serinin, grafiğin değer eksenlerinden hangisiyle okunduğu.
- `labels: ChartDataLabels?`: Her çubuğun neyi gösterdiği, ucuna yazılmış: bir adım işaretiyle, bir toplam olduğu gibi. Null hiçbirini yazmaz.

### ChartOrientation

`import com.pantrixui.components.chart.cartesian.ChartOrientation`, `com.pantrixui:components` içinden

```kotlin
enum class ChartOrientation
```

Bir grafiğin yerlerinin, ve böylece değerlerinin, hangi yöne gittiği.

Değerleri:

- `Vertical`: Yerler grafiğin altı boyunca, satırların başladığı yandan; değerler yanı boyunca yukarı: sütunlar.
- `Horizontal`: Yerler grafiğin yanından aşağı, tepesinden; değerler altı boyunca, satırların başladığı yandan: çubuklar. Uzun adlar her biri bir satırlık yerde, yatay yazılır.

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

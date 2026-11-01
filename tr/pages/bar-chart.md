# Bar Chart

Bir kez verilen satırlardan bir çubuk grafiği: satırların adını verdiği her yerde, satırlardan okunan her değer için bir çubuk. Yer yer karşılaştırılan miktarlar içindir: ayların satışı, kanalların payı.

Serilerinin hepsi çubuk olan ve hepsi aynı satırlardan okunan bir `PantrixChart`'ın kısa yazılışıdır. Eksenler, lejant, tooltip, durum, klavye ve ekran okuyucu "Chart" sayfasında anlatıldığı gibidir.

- `PantrixBarChart` (`com.pantrixui.components.chart.bar`, `com.pantrixui:components`): Tek bir satır listesinden okunan her değer için, yer yer karşılaştırılan miktarlar için yan yana ya da üst üste bir çubuk: serilerinin hepsi çubuk olan bir grafiğin kısa yolu. Anahtar sözcükler: çubuk grafik, sütun grafik, histogram, yığılmış çubuk, gruplu çubuk.

## Özellikler

- **Yan yana ya da yığılı.** Bir yerin çubukları yan yana durur; `stacked` ile üst üste biner, `values`'ın sırasıyla. Yan yana, her yerde karşılaştırılan birkaç değere uyar; yığılı, bir bütünün parçalarına: bütün de okunur. Yığının tooltip'i değerlerin ardından toplamı yazar.
- **Paylar.** `stacking = ChartStacking.Percent` her yığını yüzde yüz sayar: bütün değil, parçaların payı okunur. Eksen yüzde yazar, tooltip her değerin yanına payını ekler, etiket payı yazar.
- **Sıfır.** Çubuk grafiğinin değer ekseni sıfırdan başlar: bir çubuğun boyu miktar olarak okunur. Sıfırın altındaki değer sıfırdan aşağı iner; yığında, aşağı inen ötekilerin altına.
- **Bant.** Her yerin, grafiğin genişliğinden bir bandı vardır ve çubukları o bandın ortasında durur. Bir çubuk, ne kadar yeri olursa olsun belli bir genişliği aşmaz (`ChartStyle.barMaxWidth`); dar yerde çubuklar incelir.
- **Yatay.** `horizontal = true` yerleri grafiğin yanından aşağı dizer, çubuklar soldan (sağdan sola okunan dilde sağdan) uzanır: bir sıralama ya da uzun adlı yerler için. Her ad kendi satırında, yatay yazılır; kutunun üçte birinden geniş ad kısaltılır. Değerler grafiğin altına, ikinci eksen üstüne yazılır. Oklardan aşağı ve yukarı yerler arasında, sağa ve sola değerler arasında gezer. Yakından bakılan yatay grafik (`zoom`) yerlerinde yukarı ve aşağı gider; gezgin şeridi grafiğin yanında, çizgilerin bittiği tarafta dikey durur.
- **Gösterilen yer.** İmlecin ya da parmağın altındaki yerin bandı gölgelenir ve tooltip o yerin değerlerini gösterir. Tooltip serileri ayırıyorsa (`shared = false`) imlecin üstündeki çubuğun çevresine bir halka çizilir.
- **Çizgiyle birlikte.** Çubukların üstünde bir çizgi isteyen grafik bir `PantrixChart`'tır: her çubuk dizisi için bir `BarSeries`, çizgi için bir `LineSeries` alır. Örneği "Chart" sayfasındadır.
- **Değer etiketleri.** `labels` değerleri çubukların ucuna, yığılı çubuklarda içine yazar; `position` başka bir yer söyler, `total` yığının toplamını ucunun ötesine yazar. Yeri olmayan etiket atlanır.
- **İşaretler.** `marks` bir hedef çizgisini ya da bir aralığın bandını çizer; "Chart" sayfasında anlatıldığı gibidir.
- **Otomasyon.** Grafik, olduğu `PantrixChart` gibi etiketlenir: `Chart_<tagKey>`.

## Kullanım

### One amount for each month

```kotlin
PantrixBarChart(
    data = months,
    x = { it.name },
    values = listOf(ChartValue("orders", stringResource(Res.string.orders)) { it.orders }),
    description = stringResource(Res.string.orders_of_the_year),
    tagKey = "orders"
)
```

### Parts of a whole, stacked

```kotlin
PantrixBarChart(
    data = quarters,
    x = { it.name },
    values = listOf(
        ChartValue("online", stringResource(Res.string.online)) { it.online },
        ChartValue("stores", stringResource(Res.string.stores)) { it.stores }
    ),
    stacked = true,
    tagKey = "sales"
)
```

## Örnekler

### Tek bir miktar

En yalın hâli: satırlar, satırın yerini veren `x` ve tek bir değer. Tek serili grafiğin lejantı yoktur.

İmleci bir ayın üstüne getir ya da aya dokun: ayın bandı gölgelenir ve tooltip o ayın satışını yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(ChartValue("online", "İnternet") { it.online }),
    description = "Aylara göre internet satışı",
    tagKey = "plain"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)
```

### Yan yana ya da yığılı

Üç satış kanalı, her ay yan yana: her ayda hangisinin önde olduğu okunur. Anahtarı çevir: çubuklar üst üste biner (`stacked`) ve her ayın toplamı da okunur; kanalların payı renklerden görülür.

Lejanttaki bir ada bas: kanal çıkar, kalan çubuklar genişler ya da yığın alçalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var stacked by remember { mutableStateOf(false) }
PantrixSwitchButton(
    checked = stacked,
    onCheckedChange = { stacked = it },
    label = "Üst üste",
    tagKey = "bar_stacked"
)
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "İnternet") { it.online },
        ChartValue("stores", "Mağazalar") { it.stores },
        ChartValue("partners", "Bayiler") { it.partners }
    ),
    stacked = stacked,
    description = "Aylara göre üç kanalın satışı",
    tagKey = "stacked"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)
```

### Sıfırın altına inen değerler

Sıfırın iki yanında değerler: bir ayın kârı ya da zararı. Kâr sıfırdan yukarı, zarar sıfırdan aşağı iner; sıfırda bir çizgi çizilir. Değerler kısa yazılıyor (`format`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixBarChart(
    data = BALANCE,
    x = { it.first },
    values = listOf(ChartValue("balance", "Kâr") { it.second }),
    yAxis = ChartAxis(format = { strings.compact(it) }),
    description = "Aylara göre kâr ve zarar",
    tagKey = "below_zero"
)

private val BALANCE = listOf(
    "Oca" to 64_000,
    "Şub" to 31_000,
    "Mar" to -12_000,
    "Nis" to -38_000,
    "May" to 22_000,
    "Haz" to 87_000
)
```

### Tek tek okunan çubuklar

Tooltip serileri ayırıyor (`shared = false`): imlecin üstündeki çubuk bir halkayla işaretlenir ve tooltip yalnızca onun değerini yazar. Klavyede yukarı ve aşağı oklar bir çubuktan ötekine geçer. Bir çubuğa bas: alttaki satır basılanı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartTooltip
import com.pantrixui.components.elements.text.PantrixText

var pressed by remember { mutableStateOf<String?>(null) }
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "İnternet") { it.online },
        ChartValue("stores", "Mağazalar") { it.stores }
    ),
    tooltip = ChartTooltip(shared = false),
    onSelect = { pressed = "${it.label}, ${it.name}: ${it.text}" },
    description = "Aylara göre internet ve mağaza satışı",
    tagKey = "one_by_one"
)
PantrixText(text = pressed ?: "Bir çubuğa bas")

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)
```

### Çok yer

Otuz gün. Her günün bandı dardır ve çubuklar ona göre incelir; günlerin adları bir kuralla atlanır. Değerlerin hepsi yerinde durur: imleçle ya da parmakla her günün değeri gösterilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue

PantrixBarChart(
    data = DAYS,
    x = { it.first },
    values = listOf(ChartValue("orders", "Sipariş") { it.second }),
    xAxis = ChartAxis(label = { "$it. gün" }),
    description = "Son otuz günün günlük sipariş sayısı",
    tagKey = "many_places"
)

private val DAYS = List(30) { day -> (day + 1) to 120 + day * 4 - (if (day % 7 >= 5) 45 else 0) + (day * 37) % 23 }
```

### Uzun adlar

Uzun adlı yerler: bir mağazanın en çok satan sekiz ürünü. Adlar yan yana sığmayınca, eğik yazıldıklarında daha çoğu sığıyorsa sekizde bir tur eğik yazılır ve ucları yerlerinin altında durur; eğik de sığmayan olursa yine her ikinci, her üçüncü yazılır. İlk ve son ad hep yazılır. Çok uzun bir ad, grafiğin yüksekliğinin üçte birinden aşağı inmeyecek kadar, kutunun kenarına gelen ad da kutuda kalacak kadar kısaltılır. Kısa adlar düz kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue

PantrixBarChart(
    data = BEST_SELLERS,
    x = { it.first },
    values = listOf(ChartValue("sold", "Satış (adet)") { it.second }),
    description = "En çok satan sekiz ürünün bu ayki satışı",
    tagKey = "long_names"
)

private val BEST_SELLERS = listOf(
    "Kablosuz kulaklık" to 412,
    "Akıllı saat" to 356,
    "Taşınabilir şarj aleti" to 298,
    "Bluetooth hoparlör" to 251,
    "Oyun faresi" to 214,
    "Mekanik klavye" to 187,
    "Yüksek çözünürlüklü web kamerası" to 143,
    "USB-C çoklayıcı" to 121
)
```

### Yatay çubuklar

Aynı sekiz ürün, yatay çubuklarla (`horizontal = true`): adlar grafiğin yanında, her biri kendi satırında, yatay yazılır; çubuklar soldan uzanır ve değerleri uçlarına yazılır (`labels`). Hedef çizgisi (`marks`) değer ekseninde durduğu için grafiği yukarıdan aşağı keser.

İmleci bir ürünün üstüne getir ya da ürüne dokun: satırı gölgelenir ve tooltip değerini yazar. Klavyede grafiğe gelince aşağı ve yukarı oklar ürünler arasında gezer.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabels

PantrixBarChart(
    data = BEST_SELLERS,
    x = { it.first },
    values = listOf(ChartValue("sold", "Satış (adet)") { it.second }),
    horizontal = true,
    labels = ChartDataLabels(),
    marks = listOf(ChartReferenceLine(y = 300, label = "Hedef")),
    description = "En çok satan sekiz ürünün bu ayki satışı, yatay çubuklarla",
    tagKey = "horizontal"
)

private val BEST_SELLERS = listOf(
    "Kablosuz kulaklık" to 412,
    "Akıllı saat" to 356,
    "Taşınabilir şarj aleti" to 298,
    "Bluetooth hoparlör" to 251,
    "Oyun faresi" to 214,
    "Mekanik klavye" to 187,
    "Yüksek çözünürlüklü web kamerası" to 143,
    "USB-C çoklayıcı" to 121
)
```

### Yatay ve yığılı

Yatay çubuklar da yan yana ya da yığılı durur: burada üç kanalın aylık satışı, yığılı. Lejant bir kanalı çıkarır; yığının toplamı her çubuğun ucuna yazılır (`total`).

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabels

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "İnternet") { it.online },
        ChartValue("stores", "Mağazalar") { it.stores },
        ChartValue("partners", "Bayiler") { it.partners }
    ),
    stacked = true,
    horizontal = true,
    labels = ChartDataLabels(total = true),
    description = "Aylara göre üç kanalın satışı, yatay ve yığılı çubuklarla",
    tagKey = "horizontal_stacked"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)
```

### Uzun bir sıralama

Kırk ilin mağaza sayısı, büyükten küçüğe: bu kadar satır grafiğin yüksekliğine sığmaz. Yakından bakılan yatay grafikte (`zoom`) ilk on il çizim alanını doldurur (`ChartState.zoomTo`); gezgin şeridi (`navigator = true`) grafiğin sağında dikey durur ve bütün illeri gösterir, görünen kısım şeritte sürüklenir ya da uçlarından büyütülür.

Fareyle grafiği yukarı aşağı sürükle, tekerleği çevir ya da iki parmakla kaydır; Ctrl ile tekerlek ve iki parmağı açıp kapamak yakınlaştırır. Düğmeler yukarı ve aşağı götürür, uzaklaştırır, yakınlaştırır ve bütün illeri yeniden gösterir. Klavyede aşağı ok bir sonraki ile gider; görünmeyen bir ile gelince görünen kısım kayar.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartZoom
import com.pantrixui.components.chart.common.rememberChartState

val state = rememberChartState()
LaunchedEffect(state) { state.zoomTo(start = 0f, end = 0.25f) }
PantrixBarChart(
    data = PROVINCES,
    x = { it.first },
    values = listOf(ChartValue("stores", "Mağaza") { it.second }),
    modifier = Modifier.height(360.dp),
    horizontal = true,
    zoom = ChartZoom(navigator = true),
    state = state,
    description = "Kırk ilin mağaza sayısı, büyükten küçüğe",
    tagKey = "long_ranking"
)

private val PROVINCES = PROVINCE_NAMES.mapIndexed { place, name -> name to 2400 / (place + 3) + 5 }

private val PROVINCE_NAMES = (
    "İstanbul Ankara İzmir Bursa Antalya Konya Adana Gaziantep Şanlıurfa Kocaeli " +
        "Mersin Diyarbakır Hatay Manisa Kayseri Samsun Balıkesir Kahramanmaraş Van Aydın " +
        "Tekirdağ Sakarya Denizli Muğla Eskişehir Mardin Trabzon Malatya Ordu Erzurum " +
        "Afyonkarahisar Sivas Tokat Zonguldak Adıyaman Elazığ Batman Çorum Kütahya Şırnak"
).split(" ")
```

### Değerleri çubukların üstünde

Değerler çubukların yanına yazılır (`labels`): tek başına duran çubuğun ucunun üstüne, sıfırın altına inen çubuğun altına. Anahtarı çevir: yığılı çubuklarda değer çubuğun içine, çubuğun renginde daha iyi okunan siyahla ya da beyazla yazılır, yığının toplamı da ucunun üstüne (`total`). Çizgi, hiçbir ayın ulaşmadığı bir hedefi gösteriyor (`marks`); bir etiketin içinden geçtiği yerde etiket bir zeminin üstüne yazılır ve çizgi orada örtülür. Hedefin yazısı çizginin başında (`labelPosition`): sonunda, en yüksek ayların etiketlerinin yerini alırdı.

Düğmelerden biriyle etiketin yerini seç (`position`): "Kendi" yeri olan yerdir; ötekiler çubuğun dışı, ucu, ortası ve dibidir. Yığılı çubuğun dışı bir sonraki çubuktur: orada etiket kendi çubuğunun ucuna yazılır.

Bir etiket yeri olan yerde yazılır: başka bir etiketin üstüne gelecek, grafikten taşacak ya da çubuğuna sığmayacak etiket atlanır; değer tooltip'te ve ekran okuyucuda durur. `ChartDataLabels(format = …)` değerin nasıl yazılacağını söyler; verilmezse eksenin yazımı geçerlidir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartMarkLabelPosition
import com.pantrixui.components.chart.cartesian.ChartReferenceLine
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabelPosition
import com.pantrixui.components.chart.common.ChartDataLabels
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var stacked by remember { mutableStateOf(false) }
var position by remember { mutableStateOf(ChartDataLabelPosition.Auto) }
PantrixSwitchButton(
    checked = stacked,
    onCheckedChange = { stacked = it },
    label = "Üst üste",
    tagKey = "bar_labels_stacked"
)
PantrixSegmentButton(
    options = LABEL_PLACES,
    selected = position,
    onSelect = { position = it },
    fullWidth = false,
    tagKey = "label_place"
)
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "İnternet") { it.online },
        ChartValue("stores", "Mağazalar") { it.stores }
    ),
    stacked = stacked,
    labels = ChartDataLabels(position = position, total = stacked),
    marks = listOf(
        ChartReferenceLine(
            y = if (stacked) 140 else 75,
            label = "Hedef",
            labelPosition = ChartMarkLabelPosition.Start
        )
    ),
    description = "Aylara göre internet ve mağaza satışı, değerleriyle",
    tagKey = "labels"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)

private val LABEL_PLACES = listOf(
    SegmentOption(value = ChartDataLabelPosition.Auto, label = "Kendi", tagKey = "auto"),
    SegmentOption(value = ChartDataLabelPosition.Outside, label = "Dışı", tagKey = "outside"),
    SegmentOption(value = ChartDataLabelPosition.InsideEnd, label = "Ucu", tagKey = "inside_end"),
    SegmentOption(value = ChartDataLabelPosition.Center, label = "Ortası", tagKey = "center"),
    SegmentOption(value = ChartDataLabelPosition.InsideStart, label = "Dibi", tagKey = "inside_start")
)
```

### Paylar olarak yığılı

Üç kanalın her aydaki payı: her ayın çubuğu yüzde yüzdür ve kanallar ondan paylarını alır (`stacking = ChartStacking.Percent`). Satışın kendisi değil, nasıl paylaşıldığı okunur: hangi ayda internetin payı arttı. Eksen yüzde yazar, etiketler payı; tooltip her kanalın satışını payıyla birlikte, ardından da ayın toplamını yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartStacking
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartDataLabels

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "İnternet") { it.online },
        ChartValue("stores", "Mağazalar") { it.stores },
        ChartValue("partners", "Bayiler") { it.partners }
    ),
    stacked = true,
    stacking = ChartStacking.Percent,
    labels = ChartDataLabels(),
    description = "Aylara göre üç kanalın satıştaki payı",
    tagKey = "shares"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)
```

### İkinci eksen

İki türlü bir değer: satış bin lira, internetin payı yüzde. Pay ikinci eksenle okunur (`ChartValue(axis = ChartYAxis.Second)`); o eksen grafiğin öbür yanında, kendi yazımıyla durur (`secondYAxis`). İki eksen de sıfırdan başlar ve sıfırları aynı çizgidedir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartAxis
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.cartesian.ChartYAxis
import com.pantrixui.foundation.theme.PantrixTheme

val strings = PantrixTheme.strings
PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "İnternet") { it.online },
        ChartValue("share", "İnternetin payı", axis = ChartYAxis.Second) {
            it.online.toDouble() / (it.online + it.stores)
        }
    ),
    secondYAxis = ChartAxis(format = { strings.percent(it) }),
    description = "Aylara göre internet satışı ve satışın içindeki payı",
    tagKey = "second_axis"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)
```

### Kendi ölçülerin

Bir grafiğin kendi ölçüleri: çubukların ucu köşeli (`barRadius`), en fazla yirmi dört dp genişliğinde (`barMaxWidth`), yan yana duranların arası açık (`barGap`) ve bir ayın bandının onda dokuzunu alıyorlar (`barBandShare`). Verilmeyen alan temanınki kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.chart.common.ChartStyle

PantrixBarChart(
    data = SALES,
    x = { it.month },
    values = listOf(
        ChartValue("online", "İnternet") { it.online },
        ChartValue("stores", "Mağazalar") { it.stores }
    ),
    description = "Aylara göre internet ve mağaza satışı",
    style = ChartStyle(barRadius = 0.dp, barMaxWidth = 24.dp, barGap = 6.dp, barBandShare = 0.9f),
    tagKey = "own_look"
)

private data class Sales(
    val month: String,
    val online: Int,
    val stores: Int,
    val partners: Int
)

private val SALES = listOf(
    Sales("Oca", online = 42, stores = 58, partners = 21),
    Sales("Şub", online = 51, stores = 49, partners = 18),
    Sales("Mar", online = 48, stores = 61, partners = 26),
    Sales("Nis", online = 63, stores = 55, partners = 24),
    Sales("May", online = 70, stores = 52, partners = 31),
    Sales("Haz", online = 66, stores = 64, partners = 29)
)
```

## API

### PantrixBarChart

`import com.pantrixui.components.chart.bar.PantrixBarChart`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixBarChart(
    data: List<T>,
    x: (T) -> Any,
    values: List<ChartValue<T>>,
    modifier: Modifier = Modifier,
    stacked: Boolean = false,
    stacking: ChartStacking = ChartStacking.Normal,
    horizontal: Boolean = false,
    labels: ChartDataLabels? = null,
    xAxis: ChartAxis? = ChartAxis(),
    yAxis: ChartAxis? = ChartAxis(),
    secondYAxis: ChartAxis? = ChartAxis(),
    marks: List<ChartMark> = emptyList(),
    legend: ChartLegend? = ChartLegend(),
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

Bir kez verilen satırlardan bir çubuk grafiği: satırların adını verdiği her yerde, onlardan okunan `values`'ın her biri için bir çubuk; yan yana, ya da `stacked` ise üst üste.

Serilerinin hepsi aynı satırlardan okunan çubuklar olan bir `PantrixChart`'tır, daha kısa yazılmış: bir grafiğin yaptığı her şeyi yapar. Değer ekseni, eksen başka türlü söylemedikçe sıfırdan başlar: bir çubuğun boyu miktar olarak okunur. Çubuklarının üstünde bir çizgi olan ya da çubukları farklı listelerden gelen bir grafik, her çubuk dizisi için bir `BarSeries`, çizgi için bir `LineSeries` alan bir `PantrixChart`'tır.

Yan yana, her yerde karşılaştırılan birkaç değere uyar; yığılı, bütünün de okunduğu, bir bütünü oluşturan parçalara. Sıfırın altındaki değer sıfırdan aşağı iner, bir yığında aşağı inen ötekilerin altına. Parçalar bütünden önemliyse, `stacking` ile paylar olarak yığmak her çubuğu ötekiler kadar yüksek yapar. `horizontal` çubuklar grafiğin yanından boyunca uzanır, bir yer ötekinin altında: bir sıralama ya da uzun adlı yerler için; her ad bir satırlık yerde yatay yazılır.

```kotlin
PantrixBarChart(
    data = months,
    x = { it.name },
    values = listOf(
        ChartValue("online", "Online") { it.online },
        ChartValue("stores", "Stores") { it.stores }
    ),
    stacked = true,
    tagKey = "sales"
)
```

Parametreler:

- `data: List<T>`: satırlar.
- `x: (T) -> Any`: bir satırın grafik boyunca nerede durduğu: bir ad, bir gün, kendisine eşit olan herhangi bir şey.
- `values: List<ChartValue<T>>`: seriler: her birinin bir satırdan ne okuduğu, nasıl adlandırıldığı ve hangi renkte çizildiği. Bir çubuğun, bir değerin adını verebileceği kesik çizgisi de işareti de yoktur.
- `modifier: Modifier`: grafiğin modifier'ı. Buradaki bir yükseklik grafiğindir, lejantınki de içinde.
- `stacked: Boolean`: bir yerin çubuklarının yan yana değil, `values`'ın sırasıyla üst üste durup durmadığı.
- `stacking: ChartStacking`: yığılı çubukların birbirinin üstünde nasıl durduğu: değerleri olarak ya da yığından aldıkları paylar olarak. `stacked` olmayan çubukların buna göre duracak bir yığını yoktur.
- `horizontal: Boolean`: yerlerin grafiğin altı boyunca dizilip çubukların yukarı uzanması yerine, yanından aşağı dizilip çubukların boyunca uzanıp uzanmadığı.
- `labels: ChartDataLabels?`: değerler, yerleri olduğunda, çubukların ucuna ya da bir yığının çubuklarının içine yazılır. `null` hiçbirini yazmaz.
- `xAxis: ChartAxis?`: yerlerin ekseni, grafiğin altında, `horizontal` ise yanında. `null` ondan hiçbir şey çizmez.
- `yAxis: ChartAxis?`: değerlerin ekseni, grafiğin yanında, `horizontal` ise altında. `null` ondan hiçbir şey çizmez.
- `secondYAxis: ChartAxis?`: grafiğin öbür yanındaki, `horizontal` ise üstündeki ikinci değer ekseni: bir değer onunla okunuyorsa çizilir (`ChartValue.axis`), okunmuyorsa çizilmez. `null` ondan hiçbir şey çizmez.
- `marks: List<ChartMark>`: serilerin yanında çizim alanına çizilen çizgiler ve bantlar: bir hedef, bir sınır, bir dizi yer.
- `legend: ChartLegend?`: serilerin adlarının durduğu yer. `null` hiç göstermez.
- `tooltip: ChartTooltip?`: gösterilen yer için gösterilen şey. `null` hiç göstermez.
- `zoom: ChartZoom?`: okuyucunun yerlerin bir kısmına yakından bakmasını ve geri kalanı boyunca kaydırmasını sağlayan şey. Grafiğe verilmedikçe `null`'dır; `null` bütün yerleri gösterir, başka bir şey yapmaz.
- `export: ChartExport?`: okuyucunun grafiği uygulamadan bir dosya olarak çıkarmasını sağlayan şey: bir resim, ya da her boyutta keskin bir çizim. Grafiğe verilmedikçe `null`'dır, ve grafiğin böyle bir düğmesi olmaz.
- `empty: (@Composable () -> Unit)?`: grafiğin çizecek değeri yokken çizim alanında gösterdiği şey: temanın bunun için yazdığı sözün ("Veri yok") yerine; o zaman ekran okuyucuya da o söz söylenmez. `null` sözü yazar. Grafiğin dışa aktarıldığı dosya sözü yazar.
- `state: ChartState`: okuyucunun gizledikleri ve gösterdiği yer: verilmezse grafiğin kendisininki.
- `description: String?`: grafiğin ne gösterdiği, birkaç sözcükle, ekran okuyucu için.
- `onSelect: ((ChartPoint) -> Unit)?`: basılan değerle çağrılır.
- `style: ChartStyle?`: bu grafiğin kendi geometrisi.
- `colors: ChartColors?`: bu grafiğin kendi renkleri, temanınkiler olmadıkları yerde.
- `tagKey: String?`: grafiğin otomasyon anahtarı. Grafik, olduğu `PantrixChart` gibi etiketlenir, `Chart_<tagKey>`, ve parçaları ile olayları o grafiğinkilerdir.

### ChartValue

`import com.pantrixui.components.chart.cartesian.ChartValue`, `com.pantrixui:components` içinden

```kotlin
class ChartValue<T>(
    public val key: String,
    public val name: String,
    public val color: Color = Color.Unspecified,
    public val dash: ChartDash? = null,
    public val marker: ChartMarker = ChartMarker.None,
    public val axis: ChartYAxis = ChartYAxis.First,
    public val pattern: ChartPattern? = null,
    public val y: (T) -> Number?
)
```

Bir grafiğin okunduğu satırların bir değeri, onun bir serisi olarak: satırlarını bir kez alan ve her seriyi bir satırdan okuduğuyla adlandıran grafikler için.

```kotlin
ChartValue("desktop", "Desktop") { it.desktop }
```

Parametreler:

- `key: String`: Seriyi grafiğinin öteki serilerinden ayıran ve değerleri değişirken aynı kalan şey.
- `name: String`: Serinin adı: lejantta, tooltip'te ve ekran okuyucuda.
- `color: Color`: Serinin çizildiği renk. Verilmezse, grafiğin serileri arasındaki yerine düşen tema grafik rengidir.
- `dash: ChartDash?`: Çizgisinin bütün mü, kesik mi, noktalı mı çizildiği. Bir çubuğun çizgisi yoktur. Null ise bütün; grafiğin desenleri açıksa (`ChartStyle.patterns`), grafiğin serileri arasındaki sırasının söylediği gibi.
- `marker: ChartMarker`: Noktalarının her birini neyin işaretlediği. Bir çubuğun işareti yoktur.
- `axis: ChartYAxis`: Serinin grafiğin hangi değer ekseniyle okunduğu: ilkinden başka türde bir değer için, bir miktarın yanındaki bir pay için, grafiğin öbür yanındaki ikincisi.
- `pattern: ChartPattern?`: Çubuklarının, ya da doluysa çizgisinin altındaki yerin, renginin yanında çizildiği desen. Null ise hiçbiri; grafiğin desenleri açıksa, grafiğin serileri arasındaki sırasındaki desen.
- `y: (T) -> Number?`: Bir satırın değeri, yoksa null.

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

### ChartStacking

`import com.pantrixui.components.chart.cartesian.ChartStacking`, `com.pantrixui:components` içinden

```kotlin
enum class ChartStacking
```

Bir `PantrixChart`'ta bir yığının serilerinin birbirinin üstünde nasıl durduğu: değerleri olarak ya da yığının her yerdeki toplamından aldıkları paylar olarak.

Değerleri:

- `Normal`: Değerleri olarak: bir yığın, serilerinin değerlerinin toplamı kadar yüksektir.
- `Percent`: Payları olarak: her yığın ötekiler kadar, yüzde yüz yüksektir ve her seri ondan payını alır: değerinin, yığınının o yerdeki değerlerinin toplamına oranı, sıfırın altında ya da üstünde. Yığınların okunduğu eksen, kendi yazımı yoksa pay yazar; tooltip bir değeri ardından payıyla, etiket payı yazar. Hiçbir yığında olmayan seri yine de değerleri olarak çizilir: onu ikinci eksenle oku.

### ChartOrientation

`import com.pantrixui.components.chart.cartesian.ChartOrientation`, `com.pantrixui:components` içinden

```kotlin
enum class ChartOrientation
```

Bir grafiğin yerlerinin, ve böylece değerlerinin, hangi yöne gittiği.

Değerleri:

- `Vertical`: Yerler grafiğin altı boyunca, satırların başladığı yandan; değerler yanı boyunca yukarı: sütunlar.
- `Horizontal`: Yerler grafiğin yanından aşağı, tepesinden; değerler altı boyunca, satırların başladığı yandan: çubuklar. Uzun adlar her biri bir satırlık yerde, yatay yazılır.

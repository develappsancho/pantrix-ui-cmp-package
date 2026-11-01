# Data Table

Kayıtları satır satır, değerlerini kolon kolon gösteren tablo: siparişler, kullanıcılar, faturalar. Başlığı satırları sıralar, kutuları satırları seçtirir, satırları açılır, kolonları yerinde durur ya da yana kayar; dar bir ekranda kayıtların listesine döner.

Satırlar çağıranındır. Tablo `rows` ile verilen satırları verildikleri sırayla gösterir ve kendiliğinden hiçbir şeyi değiştirmez: bir başlığa basılınca istenen sıra `onSortChange` ile, bir kutuya basılınca seçilecek satırlar `onSelectionChange` ile, bir oka basılınca açılacak satırlar `onExpandedChange` ile bildirilir. Aynı tablo böylece hem ekranın elinde tuttuğu ve kendi sıraladığı satırları, hem de sunucunun sıralayıp sayfa sayfa gönderdiği satırları gösterir.

- `PantrixDataTable` (`com.pantrixui.components.data.datatable`, `com.pantrixui:components`): Sütunlarda kayıt satırları: sıralama, seçim, açılan satırlar, sabitlenen ve boyutu değişen sütunlar, yana kaydırma, yükleniyor ve boş hâller, dar ekranda bir kayıt listesi. Anahtar sözcükler: veri tablosu, tablo, ızgara, kayıtlar, satırlar ve sütunlar, sıralanabilir sütunlar.

## Özellikler

- **Kolonlar.** Bir kolon `DataTableColumn` ile tanımlanır: anahtarı (`key`), başlığı (`header`) ve bir satırın o kolonda ne gösterdiği (`cell`). Düz yazı gösteren kolon `DataTableColumn.text` ile kısaca yazılır: uzun yazı üç noktayla kesilir. Hücre herhangi bir içerik olabilir: bir rozet, bir düğme, bir avatar.
- **Genişlik.** `width` verilen kolon o genişliktedir. Verilmeyenler kalan yeri `weight` paylarına göre bölüşür ve `minWidth`'ten, o da verilmediyse stilin `columnMinWidth`'inden dar olmaz. `alignment` başlığı ve değerleri kolonun bir yanına yaslar: sayılar sona yaslanır ki basamakları alt alta gelsin.
- **Yana kaydırma.** Kolonlar en dar hâlleriyle de tabloya sığmıyorsa tablo yana kayar: parmakla sürükleyerek, tekerlekle, imlecin olduğu yerde satırların altındaki çubukla ve klavyeyle: odağı alan hücre görünür yere getirilir.
- **Sabit kolonlar.** `pin = DataTablePin.Start` kolonu tablonun başında, `DataTablePin.End` sonunda tutar: ötekiler onların altından kayar. Kayan bir tablonun yarısından çoğu yerinde duracaksa sabit kolonlar da ötekilerle kayar, yalnızca kutular yerinde kalır.
- **Sıralama.** `sortable = true` olan ya da bir `comparator` verilen kolonun başlığı bir düğmedir. İlk basış küçükten büyüğe, ikincisi büyükten küçüğe sıralar, üçüncüsü sırayı kaldırır. Ok yukarıyı gösteriyorsa küçük olan öndedir. `multiSort = true` basılan kolonu sıraya ekler: satırlar ilk kolona göre dizilir, onun eşit saydıklarını sonraki ayırır; başlıklarda kolonun sıradaki yeri yazar. Satırları sıralamak çağıranın işidir: `sort.comparator(columns)` kolonların karşılaştırıcılarından tek bir karşılaştırıcı kurar. Yazı kolonu, dilin alfabesine göre sıralansın diye `textOrder` alır: `rememberTextOrder()` temanın dilininkini verir.
- **Seçim.** `onSelectionChange` verilen tablonun her satırında bir kutu vardır; seçili satırların anahtarları `selected` ile verilir. Başlıktaki kutu gösterilen satırların hepsini seçer ya da bırakır ve başka sayfalarda seçilmiş olanlara dokunmaz; bir kısmı seçiliyken çizgilidir. `DataTableSelection.Single` kutuların yerine radyo düğmeleri koyar: bir satır seçilince öteki bırakılır.
- **Açılan satırlar.** `rowDetail` ve `onExpandedChange` verilen tablonun her satırında bir ok vardır: basılınca satırın altında, tablonun genişliğinde ayrıntısı açılır. Açık satırların anahtarları `expanded` ile verilir. Ok satırın sonunda durur ve kolonlar kayarken yerinde kalır; `DataTableStyle(expander = DataTableExpander.Start)` onu başa alır.
- **Basılan satırlar.** `onRowClick` her satırı tablonun genişliğinde bir düğme yapar.
- **Kapalı satırlar.** `rowEnabled` bir satırı kapatır: soluk çizilir, seçilemez ve basılamaz, başlıktaki kutu onu ne seçer ne bırakır. Oku onu yine açar; hücrelerindeki düğmeleri kapatmak çağıranın işidir.
- **Tonlar.** `rowTone` bir satırı temanın rollerinden birinin yumuşak dolgusuna yatırır ve yazısını o dolguyla eşlenen renge çevirir; bir kolonun `tone`'u başlığını boyar. Rengin söylediği satırda sözle de yazılmalıdır.
- **Yükseklik.** Yüksekliği söylenmeyen tablo satırları kadar yüksektir ve hepsini kurar: kayan bir sayfadaki bir sayfa satır içindir, ve başlığı sayfayla birlikte kayar. Yüksekliği söylenen tablonun başlığı yerinde durur, satırları altında kayar ve yalnızca görünenler kurulur: binlerce satırı taşır. Başlığı yerinde dursun istenen tabloya yükseklik söylenir.
- **Durum.** Satırların ve kolonların nereye kaydırıldığı ve kolonların sürüklendiği genişlikler bir `DataTableState`'te durur. Ekran onu `rememberDataTableState()` ile kendi tutarsa genişlikleri okur, saklar, sıfırlar (`columnWidths`) ve bir kolona kaydırır (`animateScrollToColumn`).
- **Dar yerde.** `DataTableLayout.Auto` tablosu, kendi genişliği stilin `compactWidth`'inden (600dp) dar olduğunda kayıtların listesidir: her satır bir blok, her değerin önünde kolonunun adı. Kutular, oklar ve sıralama kalır. `showInList = false` bir kolonu listenin dışında tutar; `listContent` bir kaydı kendi bildiği gibi çizer.
- **Yüklenirken ve boşken.** `loading = true` satırların yerine, tablonun kolonlarında, iskelet satırları koyar. Satırı olmayan tablo temanın "Satır yok" sözünü ya da `empty` ile verileni gösterir.
- **Araç çubuğu ve ayak.** `toolbar` başlığın üstünde, `footer` satırların altında, tablonun kenarının içinde durur: bir başlık ve seçilenlerle yapılacak iş; bir `PantrixPagination`.
- **Görünüm.** `DataTableVariant.Plain` satırların arasına birer çizgi çeker, `Bordered` tablonun çevresine bir kenar daha, `Grid` kolonların arasına da çizgi çeker. `striped = true` her iki satırdan birini soluk bir dolguya yatırır.
- **Genişliği değişen kolonlar.** `resizable = true` olan kolonun başlığının sonu imleçle sürüklenir. Klavye oraya kolonun adından sonra Tab ile gelir ve satır boyunca ok tuşları kolonu genişletir ya da daraltır; ekran okuyucuya genişlik, değiştirilebilen bir değer olarak söylenir. Parmakla kullanılan ekranlarda sürüklenecek bir tutamak yoktur.
- **Kolonları seçtirme.** Hangi kolonların hangi sırayla görüneceği `columns` listesinin kendisidir: bir kolonu gizleyen ya da yerini değiştiren ekran tabloya başka bir liste verir.
- **Başlıkların yazısı.** `headerTextStyle` başlıkların yazı stilidir. Başlıklar yazıldıkları gibi yazılır: küçük, aralıklı büyük harfler isteyen tablo stili verir ve başlıklarını büyük harfle yazar.
- **Renkler.** `DataTableColors` tablonun dolgusunu, yazısını, başlığın şeridini ve yazısını, şeridi, seçili satırın dolgusunu ve çizgileri ayrı ayrı boyar; verilmeyen temanınkidir.
- **Klavye.** Tab sıralayan başlıklardan, kutulardan, oklardan, basılan satırlardan ve hücrelerin içindekilerden geçer; ok tuşları odağı o yöndeki en yakın olana taşır. Basılacak bir şey tutmayan hücre durak değildir: bu, okunan ve üstünde iş yapılan bir tablodur, hücre hücre gezilen bir ızgara değil. İmlecin olduğu yerde, tablo kayıyorsa, satırların penceresi de bir duraktır: orada ok tuşları, Page Up, Page Down, Home ve End tabloyu kaydırır.
- **Ekran okuyucu.** Bir başlık, başlık olduğunu ve kolonuna göre nasıl sıralandığını söyler. `rowLabel` verilirse bir satırın kutusu satırın adıyla okunur: "Ada Lovelace satırını seç". Bir hücre kaçıncı satırda ve kolonda olduğunu söyler.
- **Otomasyon.** `tagKey` verilen tablo `DataTable_<tagKey>` olur ve parçaları onun içinde adlandırılır: `Header_<kolon>`, `Row_<satır>`, `Cell_<satır>/<kolon>`, `Select_<satır>`, `Toggle_<satır>`, `Detail_<satır>`. Basışlar `DataTable` olayı olarak bildirilir: `sort`, `select`, `selectAll`, `expand`, `collapse`, `open`.

## Kullanım

### Sorted by a press on a header

```kotlin
var sort by remember { mutableStateOf(listOf(DataTableSort("total", descending = true))) }
val columns = remember {
    listOf(
        DataTableColumn.text<Order>(key = "customer", header = customer, sortable = true) { it.customer },
        DataTableColumn.text(key = "total", header = total, alignment = Alignment.End, sortable = true) { it.total }
    )
}
PantrixDataTable(
    rows = remember(orders, sort) { orders.sortedWith(sort.comparator(columns)) },
    columns = columns,
    sort = sort,
    onSortChange = { sort = it },
    tagKey = "orders"
)
```

### Rows that are chosen, with what is done with them over the header

```kotlin
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixDataTable(
    rows = orders,
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.customer },
    selected = chosen,
    onSelectionChange = { chosen = it },
    toolbar = { PantrixText(PantrixTheme.strings.selectedCount(chosen.size)) },
    variant = DataTableVariant.Bordered,
    tagKey = "orders"
)
```

### A page of rows from a server, with its pages under it

```kotlin
PantrixDataTable(
    rows = page.orders,
    columns = columns,
    rowKey = { it.id },
    sort = sort,
    onSortChange = { viewModel.orderBy(it) },
    loading = page.loading,
    footer = { PantrixPagination(page = page.number, pageCount = page.count, onPageChange = viewModel::open) },
    modifier = Modifier.height(480.dp),
    tagKey = "orders"
)
```

## Örnekler

### Satırlar ve kolonlar

En yalın hâli: satırlar (`rows`) ve kolonlar (`columns`). Dört kolonun dördü de düz yazıdır ve `DataTableColumn.text` ile yazılır; adet ve tutar sona yaslanır ki basamakları alt alta gelsin.

Kolonlara genişlik verilmedi: tablonun genişliğini eşit paylaşırlar. Dar bir ekranda, dik tutulan bir telefonda, tablo kendiliğinden kayıtların listesine döner: her sipariş bir blok olur ve her değerin önünde kolonunun adı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.PantrixDataTable

PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember {
        listOf(
            DataTableColumn.text(key = "customer", header = "Müşteri") { it.customer },
            DataTableColumn.text(key = "city", header = "Şehir") { it.city },
            DataTableColumn.text(key = "items", header = "Adet", alignment = Alignment.End) { "${it.items}" },
            DataTableColumn.text(key = "total", header = "Tutar", alignment = Alignment.End) { "${it.total} ₺" }
        )
    },
    tagKey = "plain"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Başlığa basarak sıralama

`sortable = true` olan kolonun başlığı bir düğmedir. Bir başlığa bas: satırlar o kolona göre küçükten büyüğe dizilir ve başlığın yanında yukarıyı gösteren bir ok belirir. Yeniden bas: büyükten küçüğe. Üçüncü basış sırayı kaldırır ve satırlar verildikleri sıraya döner.

Sıra ekranın durumudur (`sort`); tablo yalnızca istenen sırayı bildirir (`onSortChange`). Satırları sıralamak da ekranın işidir: `sort.comparator(columns)` kolonların karşılaştırıcılarından tek bir karşılaştırıcı kurar. Yazı kolonları yazılarına göre, büyük küçük harf ayırmadan ve dilin alfabesine göre sıralanır (`textOrder`, `rememberTextOrder()`): Müşteri'ye bas, "İpek Güneş" "Emre Koç" ile "Kerem Aksoy" arasına girer; verilmeseydi "İ" ile başladığı için en sona, "Zeynep Demir"den sonraya düşerdi. Adet ve tutar sayıdır ve kendi karşılaştırıcılarını verir: yazı olarak "10", "9"dan önce gelirdi.

"Birden çok kolon" açıkken basılan kolon sıraya eklenir: önce Şehir'e, sonra Tutar'a bas. Siparişler şehirlere göre dizilir, aynı şehirdekiler tutarlarına göre; başlıklarda kolonun sıradaki yeri yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.l10n.rememberTextOrder

val report = LocalExampleEvents.current
var sort by remember { mutableStateOf(listOf(DataTableSort("total", descending = true))) }
var several by rememberSaveable { mutableStateOf(false) }
val order = rememberTextOrder()
val columns = remember(order) { orderColumns(textOrder = order) }
PantrixSwitchButton(
    checked = several,
    onCheckedChange = { several = it },
    label = "Birden çok kolon",
    tagKey = "several"
)
PantrixDataTable(
    rows = remember(sort) { TABLE_ORDERS.sortedWith(sort.comparator(columns)) },
    columns = columns,
    sort = sort,
    onSortChange = { asked ->
        sort = asked
        report(asked.joinToString { "${it.columnKey} ${if (it.descending) "↓" else "↑"}" }.ifEmpty { "sıra yok" })
    },
    multiSort = several,
    tagKey = "sorted"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Satır seçme ve araç çubuğu

`onSelectionChange` verilen tablonun her satırında bir kutu vardır. Seçili satırların anahtarları ekranın durumudur (`selected`); satırları birbirinden `rowKey` ayırır. Başlıktaki kutu satırların hepsini seçer ya da bırakır; bir kısmı seçiliyken çizgilidir.

Tablonun üstündeki araç çubuğu (`toolbar`) kaç satırın seçildiğini temanın sözleriyle yazar (`PantrixTheme.strings.selectedCount`) ve seçilenleri bırakan bir düğme taşır. `rowLabel` kutuları ekran okuyucuya satırın adıyla okutur: "Deniz Arslan satırını seç".

"Tek satır" açıkken kutuların yerini radyo düğmeleri alır (`DataTableSelection.Single`): bir satır seçilince öteki bırakılır ve başlıkta kutu kalmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableSelection
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var chosen by remember { mutableStateOf(setOf("1042")) }
var single by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = single,
    onCheckedChange = {
        single = it
        chosen = chosen.take(1).toSet()
    },
    label = "Tek satır",
    tagKey = "single"
)
PantrixDataTable(
    rows = TABLE_ORDERS.take(6),
    columns = remember { orderColumns() },
    rowKey = { it.id },
    rowLabel = { it.customer },
    selected = chosen,
    onSelectionChange = { asked ->
        chosen = asked
        report("${asked.size} satır seçili")
    },
    selection = if (single) DataTableSelection.Single else DataTableSelection.Multiple,
    toolbar = {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(text = PantrixTheme.strings.selectedCount(chosen.size), tagKey = "chosen")
            PantrixButton(
                text = "Seçimi bırak",
                onClick = { chosen = emptySet() },
                variant = ButtonVariant.Text,
                size = ButtonSize.Small,
                enabled = chosen.isNotEmpty(),
                tagKey = "clear"
            )
        }
    },
    variant = DataTableVariant.Bordered,
    tagKey = "selected"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Açılan ve basılan satırlar

`rowDetail` ve `onExpandedChange` verilen tablonun her satırının başında bir ok vardır. Oka bas: satırın altında, tablonun genişliğinde ayrıntısı açılır ve ok döner; yeniden basınca kapanır. Açık satırların anahtarları ekranın durumudur (`expanded`): ekran bir satırı kendisi de açabilir.

`onRowClick` satırın kendisini de bir düğme yapar: satıra basınca hangi siparişin açıldığı kartın "Son olay" satırına yazılır. Ok ve satır ayrı ayrı basılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var open by remember { mutableStateOf(setOf("1043")) }
PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember { orderColumns() },
    rowKey = { it.id },
    rowLabel = { it.customer },
    expanded = open,
    onExpandedChange = { open = it },
    rowDetail = { order ->
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
            PantrixText(text = "Sipariş #${order.id}", style = PantrixTheme.typography.body)
            PantrixText(
                text = "${order.items} ürün, ${order.city} adresine gönderilecek. Durumu: ${order.status}.",
                color = PantrixTheme.colors.textSecondary
            )
        }
    },
    onRowClick = { report("#${it.id} açıldı") },
    tagKey = "expandable"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Sabit kolonlar ve yana kaydırma

Yedi kolonun her birine genişlik verildi ve toplamları tablodan geniş: tablo yana kayar. Parmakla sürükle, tekerleği yana çevir ya da, imlecin olduğu yerde, satırların altındaki çubuğu sürükle.

Müşteri kolonu başa, düğmenin kolonu sona sabitlendi (`pin`): ötekiler onların altından kayar ve bir şey altlarına girdiğinde kenarlarında birer çizgi belirir. Dik tutulan bir telefonda sabit kolonlar tablonun yarısından çoğunu tutardı: orada onlar da ötekilerle kayar.

Şehir ve Durum kolonlarının başlıklarının sonu imleçle sürüklenir (`resizable`): kolon genişler ya da daralır ve tablo o genişliği tutar. Klavyeyle: Tab ile başlığın sonuna gel, sağ ve sol ok tuşlarıyla genişlet ya da daralt. Tab ile düğmelere git: odağı alan düğme, sabit bir kolonun altında kalmışsa, görünür yere kaydırılır.

Tablonun durumunu ekran tutuyor (`rememberDataTableState()`). "Tutar'a kaydır" kolonları o kolon görünene kadar kaydırır (`animateScrollToColumn`); "Genişlikleri sıfırla" sürüklenen genişlikleri bırakır (`columnWidths`).

Örnek her genişlikte tablodur (`DataTableLayout.Table`): dar ekranda listeye dönmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableLayout
import com.pantrixui.components.data.datatable.DataTablePin
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.rememberDataTableState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val table = rememberDataTableState()
val scope = rememberCoroutineScope()
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Tutar'a kaydır",
        onClick = { scope.launch { table.animateScrollToColumn("total") } },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "to_total"
    )
    PantrixButton(
        text = "Genişlikleri sıfırla",
        onClick = { table.columnWidths = emptyMap() },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        enabled = table.columnWidths.isNotEmpty(),
        tagKey = "reset_widths"
    )
}
PantrixDataTable(
    rows = TABLE_ORDERS.take(6),
    columns = remember(report) {
        listOf(
            DataTableColumn.text(key = "customer", header = "Müşteri", width = 160.dp, pin = DataTablePin.Start) {
                it.customer
            },
            DataTableColumn.text(key = "id", header = "Sipariş", width = 110.dp) { "#${it.id}" },
            DataTableColumn.text(key = "city", header = "Şehir", width = 140.dp, resizable = true) { it.city },
            DataTableColumn.text(key = "status", header = "Durum", width = 160.dp, resizable = true) { it.status },
            DataTableColumn.text(key = "date", header = "Tarih", width = 130.dp) { it.date },
            DataTableColumn.text(key = "items", header = "Adet", width = 100.dp, alignment = Alignment.End) {
                "${it.items}"
            },
            DataTableColumn.text(key = "total", header = "Tutar", width = 130.dp, alignment = Alignment.End) {
                "${it.total} ₺"
            },
            DataTableColumn(key = "open", header = "", width = 112.dp, pin = DataTablePin.End, showInList = false) {
                PantrixButton(
                    text = "Aç",
                    onClick = { report("#${it.id} açıldı") },
                    variant = ButtonVariant.Text,
                    size = ButtonSize.Small,
                    tagKey = "open_${it.id}"
                )
            }
        )
    },
    rowKey = { it.id },
    variant = DataTableVariant.Bordered,
    layout = DataTableLayout.Table,
    state = table,
    tagKey = "pinned"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Sayfa sayfa, yüklenirken iskeletle

Sunucudan sayfa sayfa gelen bir liste: tablo yalnızca ekrandaki sayfanın satırlarını bilir. Ayağında (`footer`) kaç siparişin göründüğü, temanın sözleriyle (`PantrixTheme.strings.rowRange`), ve bir `PantrixPagination` durur.

Başka bir sayfaya git: satırlar gelene kadar tablo yüklenir (`loading`) ve satırların yerinde, tablonun kolonlarında, iskelet satırları durur; başlık ve ayak yerindedir. Burada bekleme yarım saniyelik bir gecikmeyle taklit ediliyor; "Yüklenirken tut" iskeleti bakmak için yerinde tutar.

Tablonun yüksekliği söylendi (320dp): başlık yerinde durur, satırlar altında kayar ve yalnızca görünenler kurulur. Son sayfada iki sipariş vardır; tablo aynı yükseklikte kalır ve ayağı yerinden oynamaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.time.Duration.Companion.milliseconds

var page by rememberSaveable { mutableIntStateOf(1) }
var loading by remember { mutableStateOf(false) }
var shown by rememberSaveable { mutableIntStateOf(1) }
var held by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = held,
    onCheckedChange = { held = it },
    label = "Yüklenirken tut",
    tagKey = "hold_loading"
)
// Sunucunun yerine: istenen sayfa yarım saniye sonra gelir.
LaunchedEffect(page) {
    if (page != shown) {
        loading = true
        delay(LOAD_MILLIS.milliseconds)
        shown = page
        loading = false
    }
}
val first = (shown - 1) * PAGE_SIZE
val rows = TABLE_ORDERS.drop(first).take(PAGE_SIZE)
PantrixDataTable(
    rows = rows,
    columns = remember { orderColumns(sortable = false) },
    modifier = Modifier.height(320.dp),
    rowKey = { it.id },
    loading = loading || held,
    loadingRows = PAGE_SIZE,
    footer = {
        FlowRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            itemVerticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(
                text = PantrixTheme.strings.rowRange(first + 1, first + rows.size, TABLE_ORDERS.size),
                color = PantrixTheme.colors.textSecondary,
                tagKey = "range"
            )
            PantrixPagination(
                page = page,
                pageCount = (TABLE_ORDERS.size + PAGE_SIZE - 1) / PAGE_SIZE,
                onPageChange = { page = it },
                tagKey = "pages"
            )
        }
    },
    variant = DataTableVariant.Bordered,
    tagKey = "paged"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private const val PAGE_SIZE = 5

private const val LOAD_MILLIS = 500L

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Satırı olmayan tablo

Satırı olmayan tablo. İlkine bir şey verilmedi: temanın sözü yazar, "Satır yok". İkincisi kendi içeriğini verir (`empty`): ne olduğunu söyleyen bir yazı ve ne yapılacağını söyleyen bir düğme. İkisinde de başlık yerindedir ve tablo birkaç satır yüksekliğindedir: bir süzgecin boşalttığı tablo başlığına kadar katlanmaz.

Başlıktaki kutu, seçilecek satır olmadığı için basılmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val columns = remember { orderColumns(sortable = false) }
PantrixDataTable(rows = emptyList(), columns = columns, variant = DataTableVariant.Bordered, tagKey = "empty")
PantrixDataTable(
    rows = emptyList(),
    columns = columns,
    rowKey = { it.id },
    onSelectionChange = {},
    empty = {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText(text = "Bu süzgece uyan sipariş yok", color = PantrixTheme.colors.textSecondary)
            PantrixButton(
                text = "Süzgeci kaldır",
                onClick = { report("Süzgeç kaldırıldı") },
                variant = ButtonVariant.Outline,
                size = ButtonSize.Small,
                tagKey = "reset"
            )
        }
    },
    variant = DataTableVariant.Bordered,
    tagKey = "empty_own"
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Görünümler, şeritler ve renkler

Aynı tablonun üç görünümü. `Plain` satırların arasına birer çizgi çeker ve çevresine bir şey çizmez: bir kartın içindeki tablo için. `Bordered` tablonun çevresine, stilin şekliyle, bir kenar çeker. `Grid` kolonların arasına da çizgi çeker: gözün satır boyunca olduğu kadar kolon boyunca da okuduğu sık bir rapor için.

"Şeritli" her iki satırdan birini soluk bir dolguya yatırır (`striped`): geniş bir tabloda göz satırını yitirmez. "Başlık şeridi" başlığın arkasına temanın nötr dolgusunu koyar (`DataTableColors.headerContainer`); başlığın yazısı temanın o dolguyla eşleştirdiği renge döner.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var variant by rememberSaveable { mutableStateOf(DataTableVariant.Grid) }
var striped by rememberSaveable { mutableStateOf(true) }
var band by rememberSaveable { mutableStateOf(true) }
PantrixSegmentButton(
    options = remember { DataTableVariant.entries.map { SegmentOption(value = it, label = it.name) } },
    selected = variant,
    onSelect = { variant = it },
    tagKey = "variant"
)
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixSwitchButton(
        checked = striped,
        onCheckedChange = { striped = it },
        label = "Şeritli",
        tagKey = "striped"
    )
    PantrixSwitchButton(checked = band, onCheckedChange = { band = it }, label = "Başlık şeridi", tagKey = "band")
}
PantrixDataTable(
    rows = TABLE_ORDERS.take(6),
    columns = remember { orderColumns(sortable = false) },
    variant = variant,
    striped = striped,
    colors = DataTableColors(headerContainer = PantrixTheme.colors.neutral.container).takeIf { band },
    tagKey = "variants"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Dar yerde kayıtların listesi

Aynı satırlar, üç düzende. `Auto` tablonun kendi genişliğine bakar: 600dp'den darsa liste, değilse tablo. `Table` her genişlikte tablodur: kolonlar en dar hâllerini korur ve tablo yana kayar. `List` her genişlikte listedir.

Listede her sipariş bir bloktur ve her değerin önünde kolonunun adı yazar. Kutular ve sıralama kalır: listenin üstündeki şeritte hepsini seçen kutu ve sıralanabilen kolonların adları durur.

Düzeni pencere değil, tabloya kalan genişlik belirler: geniş bir ekranın dar bir panelindeki tablo da listedir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableLayout
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var layout by rememberSaveable { mutableStateOf(DataTableLayout.List) }
var sort by remember { mutableStateOf(emptyList<DataTableSort>()) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
val columns = remember { orderColumns() }
PantrixSegmentButton(
    options = remember { DataTableLayout.entries.map { SegmentOption(value = it, label = it.name) } },
    selected = layout,
    onSelect = { layout = it },
    tagKey = "layout"
)
PantrixDataTable(
    rows = remember(sort) { TABLE_ORDERS.take(4).sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.customer },
    sort = sort,
    onSortChange = { sort = it },
    selected = chosen,
    onSelectionChange = { chosen = it },
    variant = DataTableVariant.Bordered,
    layout = layout,
    tagKey = "as_list"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Tonlar ve kapalı satırlar

`rowTone` bir satırı temanın rollerinden birinin yumuşak dolgusuna yatırır: iptal edilen siparişler tehlike, hazırlananlar uyarı tonundadır, ve satırın yazısı temanın o dolguyla eşlediği renge döner. Ton şeridin üstündedir; seçili satırın boyası tonun da üstüne gelir. Rengin söylediğini Durum kolonu sözle de söyler: renk, görmeyene bir şey söylemez.

Bir kolonun `tone`'u başlığını boyar: Tutar başlığı bilgi tonundadır.

Teslim edilen siparişler kapalıdır (`rowEnabled`): soluk çizilirler, kutuları basılmaz ve başlıktaki kutu onları ne seçer ne bırakır. Başlıktaki kutuya bas: yalnızca açık satırlar seçilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator

val report = LocalExampleEvents.current
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixDataTable(
    rows = TABLE_ORDERS.take(7),
    columns = remember { orderColumns(sortable = false, totalTone = DataTableTone.Info) },
    rowKey = { it.id },
    rowLabel = { it.customer },
    rowEnabled = {
        when (it.status) {
            "Teslim edildi" -> false
            else -> true
        }
    },
    rowTone = {
        when (it.status) {
            "İptal edildi" -> DataTableTone.Danger
            "Hazırlanıyor" -> DataTableTone.Warning
            else -> null
        }
    },
    selected = chosen,
    onSelectionChange = { asked ->
        chosen = asked
        report("${asked.size} satır seçili")
    },
    variant = DataTableVariant.Bordered,
    striped = true,
    tagKey = "tones"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kolonları seçtirme

Hangi kolonların, hangi sırayla görüneceği `columns` listesinin kendisidir: bir kolonu gizlemek onu listeden çıkarmak, yerini değiştirmek listeyi yeniden dizmektir. Tablo bunun için ayrı bir şey tutmaz.

Üstteki çoklu seçim kutusu gösterilecek kolonları seçtirir; tablo, kolonların tamamından seçilenleri alır. Seçim ekranın durumudur: saklanırsa kullanıcı tabloyu bıraktığı gibi bulur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableTone
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

val all = remember { orderColumns() }
var shown by remember { mutableStateOf(setOf("customer", "city", "total")) }
PantrixMultiSelect(
    options = remember(all) { all.map { SelectOption(value = it.key, label = it.header) } },
    selected = shown,
    onSelectionChange = { shown = it },
    label = "Kolonlar",
    tagKey = "columns"
)
PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember(all, shown) { all.filter { it.key in shown } },
    variant = DataTableVariant.Bordered,
    tagKey = "chosen"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private fun orderColumns(
    sortable: Boolean = true,
    textOrder: Comparator<String>? = null,
    totalTone: DataTableTone? = null
): List<DataTableColumn<TableOrder>> = listOf(
    DataTableColumn.text(
        key = "customer",
        header = "Müşteri",
        weight = 1.4f,
        sortable = sortable,
        textOrder = textOrder
    ) { it.customer },
    DataTableColumn.text(key = "city", header = "Şehir", sortable = sortable, textOrder = textOrder) { it.city },
    DataTableColumn.text(key = "status", header = "Durum", weight = 1.2f) { it.status },
    DataTableColumn.text(
        key = "items",
        header = "Adet",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.items }.takeIf { sortable }
    ) { "${it.items}" },
    DataTableColumn.text(
        key = "total",
        header = "Tutar",
        alignment = Alignment.End,
        comparator = compareBy<TableOrder> { it.total }.takeIf { sortable },
        tone = totalTone
    ) { "${it.total} ₺" }
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Kendi stiliyle sık satırlar

Kendi stiliyle sık bir tablo: `DataTableStyle` satırların ve başlığın en az yüksekliğini, hücrelerin iç boşluğunu ve kutunun köşesini verir. `expander = DataTableExpander.End` açılan satırın okunu satırın sonuna, bir listenin okunun durduğu yere koyar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableExpander
import com.pantrixui.components.data.datatable.DataTableStyle
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.foundation.token.shape.ShapeRole

PantrixDataTable(
    rows = TABLE_ORDERS.take(5),
    columns = remember {
        listOf(
            DataTableColumn.text(key = "customer", header = "Müşteri") { it.customer },
            DataTableColumn.text(key = "city", header = "Şehir") { it.city },
            DataTableColumn.text(key = "total", header = "Tutar", alignment = Alignment.End) { "${it.total} ₺" }
        )
    },
    style = DataTableStyle(
        shape = ShapeRole.Small,
        headerMinHeight = 36.dp,
        rowMinHeight = 32.dp,
        cellPadding = 8.dp,
        cellVerticalPadding = 4.dp,
        expander = DataTableExpander.End
    ),
    tagKey = "dense"
)

private val TABLE_ORDERS = listOf(
    TableOrder("1041", "Deniz Arslan", "İzmir", "Hazırlanıyor", "3 Ekim", items = 3, total = 1240),
    TableOrder("1042", "Elif Kaya", "Ankara", "Yolda", "3 Ekim", items = 1, total = 320),
    TableOrder("1043", "Mert Yıldız", "İstanbul", "Teslim edildi", "2 Ekim", items = 12, total = 8750),
    TableOrder("1044", "Zeynep Demir", "Bursa", "İptal edildi", "2 Ekim", items = 2, total = 460),
    TableOrder("1045", "Can Öztürk", "İzmir", "Yolda", "1 Ekim", items = 5, total = 2100),
    TableOrder("1046", "Ayşe Şahin", "Antalya", "Teslim edildi", "1 Ekim", items = 9, total = 5600),
    TableOrder("1047", "Burak Çelik", "Ankara", "Hazırlanıyor", "30 Eylül", items = 4, total = 990),
    TableOrder("1048", "Selin Aydın", "İstanbul", "Yolda", "30 Eylül", items = 7, total = 3480),
    TableOrder("1049", "Emre Koç", "Adana", "Teslim edildi", "29 Eylül", items = 10, total = 6120),
    TableOrder("1050", "Naz Polat", "Bursa", "Hazırlanıyor", "29 Eylül", items = 6, total = 2890),
    TableOrder("1051", "Kerem Aksoy", "İzmir", "Teslim edildi", "28 Eylül", items = 8, total = 4300),
    TableOrder("1052", "İpek Güneş", "Antalya", "Yolda", "28 Eylül", items = 11, total = 7050)
)

private data class TableOrder(
    val id: String,
    val customer: String,
    val city: String,
    val status: String,
    val date: String,
    val items: Int,
    val total: Int
)
```

### Projeler: zengin hücreler ve kapalı satırlar

Bir ürünün projeleri: her hücre düz yazıdan fazlasıdır. Proje kolonunda harfli bir karo, ad ve eş aralıklı paket adı; platformlar renkli noktalarla; örnekleme ve saklama birer etiketle; tarihin altında yaşı durur. Hücreye herhangi bir içerik konur: `DataTableColumn`'un `cell`'i bir bileşimdir.

Başlıklar küçük, aralıklı büyük harflerdir: yazı stili `headerTextStyle` ile verilir, başlıkların kendisi büyük harfle yazılır (tablo bir başlığı kendiliğinden büyük harfe çevirmez: "ı" ile "i" her dilde aynı büyümez). Başlığın arkasındaki şerit `DataTableColors.headerContainer`'dır.

Pasif iki proje kapalıdır (`rowEnabled`): satırın gösterdiği her şey soluk çizilir. API anahtarı olmayan projede sayının yanında bir uyarı işareti durur; rengin söylediğini adı da söyler.

Dar bir ekranda tablo kayıtların listesine döner ve her proje `listContent` ile verilen kartla çizilir: üstte ad ve durum, altında platformlar ve anahtarlar, en altta etiketler ve tarih.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val columns = remember { projectColumns() }
PantrixDataTable(
    rows = SHOWCASE_PROJECTS,
    columns = columns,
    rowKey = { it.bundle },
    rowLabel = { it.name },
    rowEnabled = { it.active },
    listContent = { ProjectCard(it) },
    variant = DataTableVariant.Bordered,
    headerTextStyle = smallCapitals(),
    colors = DataTableColors(headerContainer = PantrixTheme.colors.surface, container = PantrixTheme.colors.surface),
    tagKey = "projects"
)

@Composable
private fun smallCapitals(): TextStyle =
    PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Medium, letterSpacing = 0.8.sp)

private fun projectColumns(): List<DataTableColumn<ShowcaseProject>> = listOf(
    DataTableColumn(key = "project", header = "PROJE", weight = 2.2f, minWidth = 230.dp) { ProjectName(it) },
    DataTableColumn(key = "platform", header = "PLATFORM", weight = 1.2f, minWidth = 160.dp) {
        Platforms(it.platforms)
    },
    DataTableColumn(key = "keys", header = "API ANAHTARI", width = 124.dp, alignment = Alignment.End) {
        ApiKeys(it.apiKeys)
    },
    DataTableColumn(key = "sampling", header = "ÖRNEKLEME VE SAKLAMA", width = 208.dp) { SamplingAndRetention(it) },
    DataTableColumn(key = "status", header = "DURUM", width = 116.dp) { ActivePill(it.active) },
    DataTableColumn(key = "created", header = "OLUŞTURULMA", width = 132.dp, alignment = Alignment.End) { Created(it) }
)

@Composable
private fun ProjectCard(project: ShowcaseProject) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.weight(1f)) { ProjectName(project) }
            ActivePill(project.active)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.weight(1f)) { Platforms(project.platforms) }
            PantrixText(
                text = "API anahtarı",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            ApiKeys(project.apiKeys)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            SamplingAndRetention(project)
            PantrixText(
                text = "${project.created} · ${project.age}",
                modifier = Modifier.weight(1f),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                textAlign = TextAlign.End,
                maxLines = 1
            )
        }
    }
}

private val SHOWCASE_PROJECTS = listOf(
    ShowcaseProject(
        name = "Pantrix Shop",
        bundle = "io.pantrix.shop",
        platforms = listOf(ShowcasePlatform.Android, ShowcasePlatform.Ios),
        apiKeys = 4,
        sampling = 100,
        retentionDays = 90,
        active = true,
        created = "12 Mar 2024",
        age = "18 ay",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Seller",
        bundle = "io.pantrix.seller",
        platforms = listOf(ShowcasePlatform.Android, ShowcasePlatform.Ios),
        apiKeys = 3,
        sampling = 100,
        retentionDays = 90,
        active = true,
        created = "4 Haz 2024",
        age = "15 ay",
        tint = ShowcaseTint.Green
    ),
    ShowcaseProject(
        name = "Pantrix Courier",
        bundle = "io.pantrix.courier",
        platforms = listOf(ShowcasePlatform.Android),
        apiKeys = 2,
        sampling = 10,
        retentionDays = 30,
        active = true,
        created = "22 Eyl 2024",
        age = "11 ay",
        tint = ShowcaseTint.Orange
    ),
    ShowcaseProject(
        name = "Pantrix Web",
        bundle = "io.pantrix.web",
        platforms = listOf(ShowcasePlatform.Web),
        apiKeys = 2,
        sampling = 100,
        retentionDays = 30,
        active = true,
        created = "8 Oca 2025",
        age = "8 ay",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Pay",
        bundle = "io.pantrix.pay",
        platforms = listOf(ShowcasePlatform.Android, ShowcasePlatform.Ios, ShowcasePlatform.Web),
        apiKeys = 2,
        sampling = 10,
        retentionDays = 90,
        active = true,
        created = "14 Şub 2025",
        age = "6 ay",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Ops Console",
        bundle = "io.pantrix.ops",
        platforms = listOf(ShowcasePlatform.Web),
        apiKeys = 1,
        sampling = 10,
        retentionDays = 30,
        active = true,
        created = "3 Nis 2025",
        age = "5 ay",
        tint = ShowcaseTint.Blue
    ),
    ShowcaseProject(
        name = "Pantrix Labs Sandbox",
        bundle = "io.pantrix.labs.sandbox",
        platforms = listOf(ShowcasePlatform.Android),
        apiKeys = 0,
        sampling = 10,
        retentionDays = 30,
        active = false,
        created = "27 May 2025",
        age = "3 ay",
        tint = ShowcaseTint.Neutral
    ),
    ShowcaseProject(
        name = "Pantrix Kiosk",
        bundle = "io.pantrix.kiosk",
        platforms = listOf(ShowcasePlatform.Android),
        apiKeys = 0,
        sampling = 100,
        retentionDays = 30,
        active = false,
        created = "19 Ağu 2025",
        age = "3 hafta",
        tint = ShowcaseTint.Neutral
    )
)

private enum class ShowcasePlatform(val label: String) {
    Android("Android"),
    Ios("iOS"),
    Web("Web")
}

private enum class ShowcaseTint {
    Blue,
    Green,
    Orange,
    Neutral
}

private data class ShowcaseProject(
    val name: String,
    val bundle: String,
    val platforms: List<ShowcasePlatform>,
    val apiKeys: Int,
    val sampling: Int,
    val retentionDays: Int,
    val active: Boolean,
    val created: String,
    val age: String,
    val tint: ShowcaseTint
)

@Composable
private fun ProjectName(project: ShowcaseProject) {
    val role = when (project.tint) {
        ShowcaseTint.Blue -> PantrixTheme.colors.primary
        ShowcaseTint.Green -> PantrixTheme.colors.success
        ShowcaseTint.Orange -> PantrixTheme.colors.warning
        ShowcaseTint.Neutral -> PantrixTheme.colors.neutral
    }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier.size(36.dp).background(role.container, RoundedCornerShape(10.dp)),
            contentAlignment = Alignment.Center
        ) {
            PantrixText(
                text = project.name.substringAfter(' ').take(1),
                style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold),
                color = role.onContainer
            )
        }
        Column {
            PantrixText(
                text = project.name,
                style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.SemiBold),
                maxLines = 1
            )
            PantrixText(
                text = project.bundle,
                style = PantrixTheme.typography.code,
                color = PantrixTheme.colors.textSecondary,
                maxLines = 1
            )
        }
    }
}

@Composable
private fun Platforms(platforms: List<ShowcasePlatform>) {
    val names = platforms.joinToString { it.label }
    Row(
        modifier = Modifier.semantics { contentDescription = names },
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (platforms.size > 2) PantrixText(text = "${platforms.size}")
        platforms.forEach { platform ->
            val color = when (platform) {
                ShowcasePlatform.Android -> PantrixTheme.colors.success.color
                ShowcasePlatform.Ios -> PantrixTheme.colors.primary.color
                ShowcasePlatform.Web -> PantrixTheme.colors.warning.color
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                ShowcaseDot(color)
                if (platforms.size <= 2) PantrixText(text = platform.label, maxLines = 1)
            }
        }
    }
}

@Composable
private fun ApiKeys(count: Int) {
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(text = "$count", style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold))
        if (count == 0) {
            PantrixIcon(
                imageVector = PantrixIcons.Warning,
                contentDescription = "Anahtar yok",
                size = 16.dp,
                tint = PantrixTheme.colors.warning.color
            )
        }
    }
}

@Composable
private fun SamplingAndRetention(project: ShowcaseProject) {
    val colors = PantrixTheme.colors
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixTag(
            text = "%${project.sampling}",
            tone = if (project.sampling == 100) TagTone.Success else TagTone.Warning
        )
        PantrixTag(
            text = "${project.retentionDays} gün",
            tone = if (project.retentionDays >= 90) TagTone.Info else TagTone.Neutral,
            icon = PantrixIcons.Inbox
        )
    }
}

@Composable
private fun ActivePill(active: Boolean) {
    PantrixTag(
        text = if (active) "Aktif" else "Pasif",
        tone = if (active) TagTone.Success else TagTone.Neutral,
        dot = true
    )
}

@Composable
private fun Created(project: ShowcaseProject) {
    Column(horizontalAlignment = Alignment.End) {
        PantrixText(text = project.created, maxLines = 1)
        PantrixText(
            text = project.age,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary,
            maxLines = 1
        )
    }
}

@Composable
private fun ShowcaseDot(color: Color) {
    Box(modifier = Modifier.size(8.dp).background(color, CircleShape))
}

private fun size(request: ShowcaseRequest): String {
    val tenths = request.bytes / 100
    return when {
        request.bytes == 0 -> "0 B"
        tenths < 1000 -> "${tenths / 10},${tenths % 10} KB"
        else -> "${tenths / 10} KB"
    }
}

private data class ShowcaseRequest(
    val id: String,
    val status: Int,
    val method: String,
    val url: String,
    val source: String,
    val millis: Int,
    val bytes: Int,
    val minutes: Int,
    val network: String = "Wi-Fi"
) {
    /** İki saniyeden uzun süren istek yavaştır. */
    val slow: Boolean get() = millis >= 2000

    /** 4xx ya da 5xx dönen istek başarısızdır. */
    val failed: Boolean get() = status >= 400
}
```

### Çökme grupları: sıralama ve satırın ayrıntısı

Bir uygulamanın çökme grupları: çok görülen en üstte. Sayı, kullanıcı ve son görülme kolonları sıralanır; başlıktaki ok büyükten küçüğe aşağıyı, küçükten büyüğe yukarıyı gösterir. Her kolonun en büyük değeri kalın yazılır.

Satırın sonundaki oka bas: çökmenin ayrıntısı satırın altında, tablonun genişliğinde açılır. Ok satırın sonunda durur, kolonlar yana kaysa da yerinde kalır; başında durması istenirse stil söyler (`DataTableStyle(expander = DataTableExpander.Start)`). Ayrıntıda yığın izi eş aralıklı bir blokta, yanında ileti ve çökmenin en çok görüldüğü cihazlar vardır; geniş yerde yan yana, dar yerde alt alta dizilirler.

Tablonun üstündeki başlık ve "kaç gruptan kaçı" yazısı araç çubuğundadır (`toolbar`). Dar bir ekranda her grup bir karttır: istisnanın adı ve yeri, altında önem ve durum etiketleri, en altta sayılar.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagColors
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var sort by remember { mutableStateOf(listOf(DataTableSort("count", descending = true))) }
var open by remember { mutableStateOf(setOf(SHOWCASE_CRASHES.first().id)) }
val columns = remember { crashColumns() }
PantrixDataTable(
    rows = remember(sort) { SHOWCASE_CRASHES.sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.exception },
    sort = sort,
    onSortChange = { sort = it },
    expanded = open,
    onExpandedChange = { open = it },
    rowDetail = { CrashDetail(it) },
    toolbar = {
        ShowcaseTitle(
            title = "Çökme Grupları",
            note = "312 gruptan ${SHOWCASE_CRASHES.size} tanesi gösteriliyor",
            noteAtTheEnd = true
        )
    },
    listContent = { CrashCard(it) },
    variant = DataTableVariant.Bordered,
    headerTextStyle = smallCapitals(),
    colors = DataTableColors(headerContainer = PantrixTheme.colors.surface, container = PantrixTheme.colors.surface),
    tagKey = "crashes"
)

@Composable
private fun smallCapitals(): TextStyle =
    PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Medium, letterSpacing = 0.8.sp)

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ShowcaseTitle(
    title: String,
    note: String,
    noteAtTheEnd: Boolean = false
) {
    FlowRow(
        modifier = Modifier.padding(vertical = 4.dp).then(if (noteAtTheEnd) Modifier.fillMaxWidth() else Modifier),
        horizontalArrangement = if (noteAtTheEnd) Arrangement.SpaceBetween else Arrangement.spacedBy(12.dp),
        itemVerticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = title, style = PantrixTheme.typography.title)
        PantrixText(text = note, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
    }
}

private fun crashColumns(): List<DataTableColumn<ShowcaseCrash>> {
    val mostCount = SHOWCASE_CRASHES.maxOf { it.count }
    val mostUsers = SHOWCASE_CRASHES.maxOf { it.users }
    return listOf(
        DataTableColumn(key = "exception", header = "İSTİSNA", weight = 3f, minWidth = 300.dp) { CrashName(it) },
        DataTableColumn(
            key = "count",
            header = "SAYI",
            width = 104.dp,
            alignment = Alignment.End,
            comparator = compareBy { it.count }
        ) { Amount(it.count, strong = it.count == mostCount) },
        DataTableColumn(
            key = "users",
            header = "KULLANICI",
            width = 124.dp,
            alignment = Alignment.End,
            comparator = compareBy { it.users }
        ) { Amount(it.users, strong = it.users == mostUsers) },
        DataTableColumn(key = "severity", header = "ÖNEM", width = 136.dp) { SeverityPill(it.severity) },
        DataTableColumn(key = "status", header = "DURUM", width = 148.dp) { CrashStatusPill(it.status) },
        DataTableColumn(
            key = "seen",
            header = "SON GÖRÜLME",
            width = 148.dp,
            alignment = Alignment.End,
            // Son görülen önce: az dakika, "büyük" olandır.
            comparator = compareByDescending { it.seenMinutes }
        ) { PantrixText(text = ago(it.seenMinutes), color = PantrixTheme.colors.textSecondary, maxLines = 1) }
    )
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun CrashDetail(crash: ShowcaseCrash) {
    val report = LocalExampleEvents.current
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(24.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column(
            modifier = Modifier.weight(1.4f).widthIn(min = 300.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            SectionLabel("YIĞIN İZİ")
            StackFrames(crash)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                PantrixButton(
                    text = "Ayrıntıları göster",
                    onClick = { report("${crash.exception}: ayrıntılar istendi") },
                    variant = ButtonVariant.Outline,
                    size = ButtonSize.Small,
                    tagKey = "details_${crash.id}"
                )
                PantrixButton(
                    text = "Yok say",
                    onClick = { report("${crash.exception}: yok sayıldı") },
                    variant = ButtonVariant.Text,
                    size = ButtonSize.Small,
                    leadingIcon = { PantrixIcon(imageVector = PantrixIcons.EyeOff, contentDescription = null) },
                    tagKey = "ignore_${crash.id}"
                )
            }
        }
        Column(modifier = Modifier.weight(1f).widthIn(min = 260.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            SectionLabel("İLETİ")
            PantrixText(text = crash.message)
            Spacer(Modifier.height(4.dp))
            SectionLabel("CİHAZ")
            SHOWCASE_DEVICES.forEach { (device, share) ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(text = device, modifier = Modifier.weight(1f), maxLines = 1)
                    PantrixText(text = "%$share", color = PantrixTheme.colors.textSecondary)
                }
            }
        }
    }
}

@Composable
private fun CrashCard(crash: ShowcaseCrash) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        CrashName(crash)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            SeverityPill(crash.severity)
            CrashStatusPill(crash.status)
            PantrixText(
                text = ago(crash.seenMinutes),
                modifier = Modifier.weight(1f),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                textAlign = TextAlign.End,
                maxLines = 1
            )
        }
        PantrixText(
            text = "${grouped(crash.count)} çökme · ${grouped(crash.users)} kullanıcı",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}

private val SHOWCASE_CRASHES = listOf(
    ShowcaseCrash(
        id = "npe",
        exception = "java.lang.NullPointerException",
        location = "com.pantrix.checkout.CartFragment.onBindViewHolder",
        count = 4812,
        users = 1204,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 4,
        message = "Attempt to invoke virtual method 'java.lang.String com.pantrix.model.CartLine.getSku()' on a " +
            "null object reference"
    ),
    ShowcaseCrash(
        id = "ise",
        exception = "java.lang.IllegalStateException",
        location = "com.pantrix.payment.PaymentSheet.commitTransaction",
        count = 2966,
        users = 884,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Investigating,
        seenMinutes = 12,
        message = "Can not perform this action after onSaveInstanceState"
    ),
    ShowcaseCrash(
        id = "anr_input",
        exception = "ANR: Input dispatching timed out",
        location = "com.pantrix.home.HomeActivity.onCreate",
        count = 2184,
        users = 1912,
        severity = ShowcaseSeverity.Anr,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 21,
        message = "Input dispatching timed out: waited 5008ms for MotionEvent"
    ),
    ShowcaseCrash(
        id = "sigsegv",
        exception = "EXC_BAD_ACCESS (SIGSEGV)",
        location = "Pantrix.ProductGalleryView.layoutSubviews",
        count = 1740,
        users = 662,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 38,
        message = "KERN_INVALID_ADDRESS at 0x0000000000000010"
    ),
    ShowcaseCrash(
        id = "cme",
        exception = "java.util.ConcurrentModificationException",
        location = "com.pantrix.sync.OrderSyncWorker.doWork",
        count = 1402,
        users = 517,
        severity = ShowcaseSeverity.NonFatal,
        status = ShowcaseCrashStatus.Investigating,
        seenMinutes = 52,
        message = "java.util.ArrayList\$Itr.checkForComodification"
    ),
    ShowcaseCrash(
        id = "sqlite_full",
        exception = "android.database.sqlite.SQLiteFullException",
        location = "com.pantrix.data.CatalogDao.insertAll",
        count = 1118,
        users = 396,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 60,
        message = "database or disk is full (code 13 SQLITE_FULL)"
    ),
    ShowcaseCrash(
        id = "oom",
        exception = "java.lang.OutOfMemoryError",
        location = "com.pantrix.media.ImageLoader.decodeBitmap",
        count = 964,
        users = 802,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 75,
        message = "Failed to allocate a 48771084 byte allocation with 16777216 free bytes"
    ),
    ShowcaseCrash(
        id = "ns_invalid",
        exception = "NSInvalidArgumentException",
        location = "Pantrix.CheckoutCoordinator.presentSheet",
        count = 812,
        users = 254,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Resolved,
        seenMinutes = 120,
        message = "Application tried to present modally a view controller that is already being presented"
    ),
    ShowcaseCrash(
        id = "http_503",
        exception = "retrofit2.HttpException: HTTP 503",
        location = "com.pantrix.network.ApiClient.execute",
        count = 704,
        users = 611,
        severity = ShowcaseSeverity.NonFatal,
        status = ShowcaseCrashStatus.Investigating,
        seenMinutes = 135,
        message = "HTTP 503 Service Unavailable"
    ),
    ShowcaseCrash(
        id = "anr_broadcast",
        exception = "ANR: Broadcast of Intent",
        location = "com.pantrix.push.NotificationReceiver.onReceive",
        count = 596,
        users = 428,
        severity = ShowcaseSeverity.Anr,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 180,
        message = "Broadcast of Intent { act=com.google.android.c2dm.intent.RECEIVE } timed out"
    ),
    ShowcaseCrash(
        id = "security",
        exception = "java.lang.SecurityException",
        location = "com.pantrix.location.StorePickerFragment.requestFix",
        count = 431,
        users = 158,
        severity = ShowcaseSeverity.NonFatal,
        status = ShowcaseCrashStatus.Ignored,
        seenMinutes = 300,
        message = "Client must have ACCESS_FINE_LOCATION permission to request PRIORITY_HIGH_ACCURACY locations"
    ),
    ShowcaseCrash(
        id = "kotlin_npe",
        exception = "kotlin.KotlinNullPointerException",
        location = "com.pantrix.profile.AddressBookViewModel.select",
        count = 388,
        users = 141,
        severity = ShowcaseSeverity.Fatal,
        status = ShowcaseCrashStatus.Open,
        seenMinutes = 360,
        message = "Required value was null"
    )
)

private fun size(request: ShowcaseRequest): String {
    val tenths = request.bytes / 100
    return when {
        request.bytes == 0 -> "0 B"
        tenths < 1000 -> "${tenths / 10},${tenths % 10} KB"
        else -> "${tenths / 10} KB"
    }
}

@Composable
private fun SectionLabel(text: String) {
    PantrixText(text = text, style = smallCapitals(), color = PantrixTheme.colors.textSecondary)
}

private fun ago(minutes: Int): String = if (minutes < 60) "$minutes dk önce" else "${minutes / 60} sa önce"

private fun grouped(number: Int): String = number.toString().reversed().chunked(3).joinToString(" ").reversed()

private enum class ShowcaseSeverity(val label: String) {
    Fatal("Ölümcül"),
    Anr("ANR"),
    NonFatal("Ölümcül değil")
}

private enum class ShowcaseCrashStatus(val label: String) {
    Open("Açık"),
    Investigating("İnceleniyor"),
    Resolved("Çözüldü"),
    Ignored("Yok sayıldı")
}

private data class ShowcaseCrash(
    val id: String,
    val exception: String,
    val location: String,
    val count: Int,
    val users: Int,
    val severity: ShowcaseSeverity,
    val status: ShowcaseCrashStatus,
    val seenMinutes: Int,
    val message: String
)

@Composable
private fun CrashName(crash: ShowcaseCrash) {
    Column {
        PantrixText(text = crash.exception, style = PantrixTheme.typography.code, maxLines = 1)
        PantrixText(
            text = crash.location,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary,
            maxLines = 1
        )
    }
}

@Composable
private fun Amount(
    number: Int,
    strong: Boolean
) {
    PantrixText(
        text = grouped(number),
        style = PantrixTheme.typography.label.copy(fontWeight = if (strong) FontWeight.Bold else FontWeight.Medium),
        maxLines = 1
    )
}

@Composable
private fun SeverityPill(severity: ShowcaseSeverity) {
    val tone = when (severity) {
        ShowcaseSeverity.Fatal -> TagTone.Danger
        ShowcaseSeverity.Anr -> TagTone.Info
        ShowcaseSeverity.NonFatal -> TagTone.Warning
    }
    PantrixTag(text = severity.label, tone = tone)
}

@Composable
private fun CrashStatusPill(status: ShowcaseCrashStatus) {
    val colors = PantrixTheme.colors
    val tone = when (status) {
        ShowcaseCrashStatus.Open, ShowcaseCrashStatus.Ignored -> TagTone.Neutral
        ShowcaseCrashStatus.Investigating -> TagTone.Primary
        ShowcaseCrashStatus.Resolved -> TagTone.Success
    }
    PantrixTag(
        text = status.label,
        tone = tone,
        variant = TagVariant.Outline,
        dot = true,
        colors = TagColors(
            content = colors.textPrimary,
            border = colors.divider,
            dot = if (status == ShowcaseCrashStatus.Ignored) colors.disabledContent else Color.Unspecified
        )
    )
}

@Composable
private fun StackFrames(crash: ShowcaseCrash) {
    val colors = PantrixTheme.colors
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.neutral.container, RoundedCornerShape(12.dp))
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        val owner = crash.location.substringBeforeLast('.').substringAfterLast('.')
        listOf(
            "${crash.location} ($owner.kt:184)",
            "androidx.recyclerview.widget.RecyclerView\$Adapter.bindViewHolder (RecyclerView.java:7532)",
            "com.pantrix.checkout.CartLineAdapter.submitList (CartLineAdapter.kt:61)"
        ).forEach { frame ->
            PantrixText(
                text = "at $frame",
                style = PantrixTheme.typography.code,
                color = colors.neutral.onContainer,
                maxLines = 1
            )
        }
    }
}

private val SHOWCASE_DEVICES = listOf(
    "Samsung Galaxy A54 · Android 13" to 41,
    "Xiaomi Redmi Note 12 · Android 12" to 23,
    "Samsung Galaxy S21 · Android 14" to 11
)

private data class ShowcaseRequest(
    val id: String,
    val status: Int,
    val method: String,
    val url: String,
    val source: String,
    val millis: Int,
    val bytes: Int,
    val minutes: Int,
    val network: String = "Wi-Fi"
) {
    /** İki saniyeden uzun süren istek yavaştır. */
    val slow: Boolean get() = millis >= 2000

    /** 4xx ya da 5xx dönen istek başarısızdır. */
    val failed: Boolean get() = status >= 400
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### İstekler: tablo ya da kartlar

Yakalanan ağ istekleri. Durum kodu rengiyle, yöntem bir etiketle, adres eş aralıklı yazıyla durur; uzun adresin başı ve sonu görünür, ortası kesilir. Süre kolonunda değerin yanında bir çubuk vardır: yavaş istek turuncu, hata dönen istek kırmızıdır, ve yavaş olanın adresinin yanında "YAVAŞ" yazar.

Araç çubuğundaki "Tablo" ve "Kartlar" düğmeleri düzeni seçer (`layout`): tablo her genişlikte tablodur ve sığmayınca yana kayar; kartlar her genişlikte kayıtların listesidir. Dar bir pencerede örnek kartlarla açılır.

Kartlarda her isteği `listContent` çizer: üstte durum kodu, yöntem ve sonuç; altında adres; onun altında boyut, ağ ve zaman, sonda süre; en altta kaydın genişliğinde süre çubuğu. Kayıtların çerçevesi, aralarındaki çizgi, sondaki ok ve açılan ayrıntı tablonundur: iki düzen aynı `rowDetail`'i gösterir, ve birinde açılan istek ötekinde de açıktır.

İstekler duruma, süreye, boyuta ve zamana göre sıralanır: başlığa basınca o kolona göre dizilirler, bir daha basınca sıra ters döner, üçüncüsünde kalkar. Kartlarda başlık yoktur; sıralayan kolonların adları kayıtların üstündeki şeritte durur ve aynı düğmelerdir. Bunu tablo yapar, örnek yalnızca `sort` ile `onSortChange`'i ve kolonların `comparator`'ını verir. Her kolon hücresindeki yazıyla değil arkasındaki sayıyla karşılaştırır: yazı olarak "412 KB", "84,1 KB"den önce gelirdi. Örnek en yeni istek üstte açılır.

Şeritte ok yalnızca sıralı kolonun adının yanında durur. Adlar sığmazsa şerit yana kayar, taştığı uca doğru solar ve sıralı olanın adı görünür yere gelir; dar bir telefonda dört ad yan yana sığar. Kaynak kolonu da sıralar, ama yalnızca tabloda: kartlar kaynağı göstermez, ve `showInList = false` ile adı şeritte durmaz.

Satırın ya da kaydın sonundaki ok isteğin tanımlayıcılarını ve adresin tamamını açar; adres seçilip kopyalanabilir. Bir istek açılınca açık olan kapanır: `expansion = DataTableExpansion.Single` ile aynı anda tek satır açık durur. Söylenmezse tablo açılan her satırı açık tutar.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pantrixui.components.data.datatable.DataTableColors
import com.pantrixui.components.data.datatable.DataTableColumn
import com.pantrixui.components.data.datatable.DataTableExpansion
import com.pantrixui.components.data.datatable.DataTableLayout
import com.pantrixui.components.data.datatable.DataTableSort
import com.pantrixui.components.data.datatable.DataTableVariant
import com.pantrixui.components.data.datatable.PantrixDataTable
import com.pantrixui.components.data.datatable.comparator
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.theme.PantrixTheme

val compact = PantrixTheme.window.widthClass == WindowWidthClass.Compact
var cards by rememberSaveable(compact) { mutableStateOf(compact) }
var sort by remember { mutableStateOf(listOf(DataTableSort("time", descending = true))) }
var open by remember { mutableStateOf(setOf(SHOWCASE_REQUESTS.first().id)) }
val columns = remember { requestColumns() }
PantrixDataTable(
    rows = remember(sort) { SHOWCASE_REQUESTS.sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    rowLabel = { it.url },
    sort = sort,
    onSortChange = { sort = it },
    expanded = open,
    onExpandedChange = { open = it },
    expansion = DataTableExpansion.Single,
    rowDetail = { RequestDetail(it) },
    toolbar = {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.weight(1f)) {
                ShowcaseTitle(
                    title = "İstekler",
                    note = "18.402 istekten ${SHOWCASE_REQUESTS.size} tanesi gösteriliyor"
                )
            }
            PantrixSegmentButton(
                options = remember {
                    listOf(
                        SegmentOption(value = false, label = "Tablo"),
                        SegmentOption(value = true, label = "Kartlar")
                    )
                },
                selected = cards,
                onSelect = { cards = it },
                fullWidth = false,
                tagKey = "view"
            )
        }
    },
    listContent = { RequestCard(it) },
    variant = DataTableVariant.Bordered,
    layout = if (cards) DataTableLayout.List else DataTableLayout.Table,
    headerTextStyle = smallCapitals(),
    colors = DataTableColors(headerContainer = PantrixTheme.colors.surface, container = PantrixTheme.colors.surface),
    tagKey = "requests"
)

@Composable
private fun smallCapitals(): TextStyle =
    PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Medium, letterSpacing = 0.8.sp)

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ShowcaseTitle(
    title: String,
    note: String,
    noteAtTheEnd: Boolean = false
) {
    FlowRow(
        modifier = Modifier.padding(vertical = 4.dp).then(if (noteAtTheEnd) Modifier.fillMaxWidth() else Modifier),
        horizontalArrangement = if (noteAtTheEnd) Arrangement.SpaceBetween else Arrangement.spacedBy(12.dp),
        itemVerticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = title, style = PantrixTheme.typography.title)
        PantrixText(text = note, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
    }
}

private fun requestColumns(): List<DataTableColumn<ShowcaseRequest>> = listOf(
    DataTableColumn(
        key = "status",
        header = "DURUM",
        width = 104.dp,
        comparator = compareBy { it.status }
    ) { StatusCode(it.status) },
    DataTableColumn(key = "request", header = "İSTEK", weight = 3f, minWidth = 280.dp) { RequestLine(it) },
    DataTableColumn.text(
        key = "source",
        header = "KAYNAK",
        width = 164.dp,
        sortable = true,
        showInList = false
    ) { it.source },
    DataTableColumn(
        key = "duration",
        header = "SÜRE",
        width = 168.dp,
        comparator = compareBy { it.millis }
    ) { Duration(it) },
    DataTableColumn.text(
        key = "size",
        header = "BOYUT",
        width = 104.dp,
        alignment = Alignment.End,
        comparator = compareBy { it.bytes }
    ) { size(it) },
    DataTableColumn(
        key = "time",
        header = "ZAMAN",
        width = 112.dp,
        alignment = Alignment.End,
        // Yeni olan "büyük"tür: az dakika önce olan sırada sonra gelir.
        comparator = compareByDescending { it.minutes }
    ) { PantrixText(text = ago(it.minutes), color = PantrixTheme.colors.textSecondary, maxLines = 1) }
)

private fun size(request: ShowcaseRequest): String {
    val tenths = request.bytes / 100
    return when {
        request.bytes == 0 -> "0 B"
        tenths < 1000 -> "${tenths / 10},${tenths % 10} KB"
        else -> "${tenths / 10} KB"
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun RequestDetail(request: ShowcaseRequest) {
    val colors = PantrixTheme.colors
    val box = RoundedCornerShape(12.dp)
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SectionLabel("TANIMLAYICILAR")
        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.neutral.container, box)
                .border(1.dp, colors.divider, box)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(32.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            maxItemsInEachRow = 3
        ) {
            listOf(
                "İstek" to request.id,
                "İz" to "4bf92f3577b34da6",
                "Oturum" to "ses_a3f21c4d",
                "Kullanıcı" to "u_84f21a",
                "Cihaz" to "dev_9c14be",
                "Sürüm" to "4.2.1 (1842)"
            ).forEach { (name, value) ->
                // Bir satır en az 200dp ister: sığdıkları kadarı yan yana durur ve satırı aralarında paylaşır.
                Row(
                    modifier = Modifier.weight(1f).widthIn(min = 200.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    PantrixText(
                        text = name,
                        modifier = Modifier.weight(1f),
                        color = colors.neutral.onContainer.copy(alpha = QUIET_ON_A_FILL)
                    )
                    PantrixText(text = value, style = PantrixTheme.typography.code, color = colors.neutral.onContainer)
                }
            }
        }
        PantrixText(
            text = "https://${request.url}",
            style = PantrixTheme.typography.code,
            color = colors.textSecondary,
            selectable = true
        )
    }
}

@Composable
private fun RequestCard(request: ShowcaseRequest) {
    val colors = PantrixTheme.colors
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            StatusCode(request.status)
            MethodPill(request.method)
            Spacer(Modifier.weight(1f))
            PantrixTag(
                text = if (request.failed) "HATA" else "OK",
                tone = if (request.failed) TagTone.Danger else TagTone.Success
            )
        }
        Address(url = request.url, tail = CARD_URL_TAIL, modifier = Modifier.fillMaxWidth())
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            PantrixText(
                text = "${size(request)} · ${request.network} · ${ago(request.minutes)}",
                modifier = Modifier.weight(1f),
                style = PantrixTheme.typography.footnote,
                color = colors.textSecondary,
                maxLines = 1
            )
            PantrixText(
                text = duration(request),
                style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold),
                maxLines = 1
            )
        }
        DurationBar(request = request, modifier = Modifier.fillMaxWidth(), height = 6.dp)
    }
}

private val SHOWCASE_REQUESTS = listOf(
    ShowcaseRequest(
        id = "req_n18f4c21",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/catalog/facets?category=grocery&locale=tr-TR&page=2",
        source = "CatalogRepository",
        millis = 284,
        bytes = 38_400,
        minutes = 2
    ),
    ShowcaseRequest(
        id = "req_p27c9d04",
        status = 201,
        method = "POST",
        url = "api.pantrix.io/v3/cart/lines?cartId=8f21ac&source=product-detail",
        source = "CartRepository",
        millis = 412,
        bytes = 1_200,
        minutes = 2
    ),
    ShowcaseRequest(
        id = "req_q51a77be",
        status = 503,
        method = "GET",
        url = "api.pantrix.io/v3/checkout/quote?cartId=8f21ac&promo=WELCOME10",
        source = "QuoteRepository",
        millis = 4020,
        bytes = 400,
        minutes = 2
    ),
    ShowcaseRequest(
        id = "req_i90e3f12",
        status = 200,
        method = "GET",
        url = "cdn.pantrix.io/products/SH-2841/hero@3x.webp?v=1842&fit=cover",
        source = "ImageLoader",
        millis = 1180,
        bytes = 412_000,
        minutes = 3,
        network = "5G"
    ),
    ShowcaseRequest(
        id = "req_a44d0c6a",
        status = 401,
        method = "POST",
        url = "api.pantrix.io/v3/auth/refresh?grant=refresh_token&client=android",
        source = "AuthInterceptor",
        millis = 196,
        bytes = 600,
        minutes = 3
    ),
    ShowcaseRequest(
        id = "req_o73b21d9",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/orders?status=open&limit=25&cursor=eyJpZCI6MTIzfQ",
        source = "OrdersViewModel",
        millis = 642,
        bytes = 84_100,
        minutes = 4,
        network = "4G"
    ),
    ShowcaseRequest(
        id = "req_d08f5a37",
        status = 204,
        method = "DELETE",
        url = "api.pantrix.io/v3/cart/lines/SH-2841?cartId=8f21ac&reason=user",
        source = "CartRepository",
        millis = 231,
        bytes = 0,
        minutes = 4
    ),
    ShowcaseRequest(
        id = "req_s62c18f0",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/search?q=zeytinyagi&facets=brand,price&page=1&sort=relevance",
        source = "SearchViewModel",
        millis = 2280,
        bytes = 56_800,
        minutes = 5,
        network = "5G"
    ),
    ShowcaseRequest(
        id = "req_u15e9b42",
        status = 200,
        method = "GET",
        url = "api.pantrix.io/v3/users/me/addresses?include=default",
        source = "ProfileRepository",
        millis = 158,
        bytes = 2_900,
        minutes = 6
    ),
    ShowcaseRequest(
        id = "req_t39a6c58",
        status = 500,
        method = "POST",
        url = "api.pantrix.io/v3/payments/intents?provider=iyzico&installments=3",
        source = "PaymentRepository",
        millis = 936,
        bytes = 900,
        minutes = 7,
        network = "4G"
    )
)

@Composable
private fun SectionLabel(text: String) {
    PantrixText(text = text, style = smallCapitals(), color = PantrixTheme.colors.textSecondary)
}

private fun ago(minutes: Int): String = if (minutes < 60) "$minutes dk önce" else "${minutes / 60} sa önce"

private data class ShowcaseRequest(
    val id: String,
    val status: Int,
    val method: String,
    val url: String,
    val source: String,
    val millis: Int,
    val bytes: Int,
    val minutes: Int,
    val network: String = "Wi-Fi"
) {
    /** İki saniyeden uzun süren istek yavaştır. */
    val slow: Boolean get() = millis >= 2000

    /** 4xx ya da 5xx dönen istek başarısızdır. */
    val failed: Boolean get() = status >= 400
}

@Composable
private fun StatusCode(status: Int) {
    val colors = PantrixTheme.colors
    val color = when {
        status >= 500 -> colors.danger.color
        status >= 400 -> colors.warning.color
        else -> colors.success.color
    }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        ShowcaseDot(color)
        PantrixText(text = "$status", style = PantrixTheme.typography.code, color = color, maxLines = 1)
    }
}

@Composable
private fun MethodPill(method: String) {
    val tone = when (method) {
        "POST" -> TagTone.Success
        "DELETE" -> TagTone.Danger
        else -> TagTone.Info
    }
    PantrixTag(text = method, tone = tone)
}

@Composable
private fun RequestLine(request: ShowcaseRequest) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
        MethodPill(request.method)
        Address(url = request.url, tail = URL_TAIL, modifier = Modifier.weight(1f))
        if (request.slow) PantrixTag(text = "YAVAŞ", tone = TagTone.Warning)
    }
}

@Composable
private fun Address(
    url: String,
    tail: Int,
    modifier: Modifier = Modifier
) {
    Row(modifier = modifier.semantics(mergeDescendants = true) {}) {
        PantrixText(
            text = url.dropLast(tail),
            modifier = Modifier.weight(1f, fill = false),
            style = PantrixTheme.typography.code,
            maxLines = 1
        )
        PantrixText(text = url.takeLast(tail), style = PantrixTheme.typography.code, maxLines = 1)
    }
}

private fun duration(request: ShowcaseRequest): String = if (request.millis < 1000) {
    "${request.millis} ms"
} else {
    "${request.millis / 1000},${(request.millis % 1000 / 10).toString().padStart(2, '0')} sn"
}

@Composable
private fun Duration(request: ShowcaseRequest) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
        PantrixText(
            text = duration(request),
            modifier = Modifier.width(64.dp),
            style = PantrixTheme.typography.label.copy(fontWeight = FontWeight.SemiBold),
            textAlign = TextAlign.End,
            maxLines = 1
        )
        DurationBar(request = request, modifier = Modifier.weight(1f))
    }
}

@Composable
private fun DurationBar(
    request: ShowcaseRequest,
    modifier: Modifier = Modifier,
    height: Dp = 4.dp
) {
    val colors = PantrixTheme.colors
    val fill = when {
        request.slow -> colors.warning.color
        request.failed -> colors.danger.color
        else -> colors.primary.color
    }
    Box(modifier = modifier.height(height).background(colors.neutral.container, CircleShape)) {
        Box(
            modifier = Modifier
                .fillMaxWidth((request.millis / LONGEST_MILLIS).coerceIn(0.06f, 1f))
                .height(height)
                .background(fill, CircleShape)
        )
    }
}

private const val CARD_URL_TAIL = 18

private const val QUIET_ON_A_FILL = 0.7f

@Composable
private fun ShowcaseDot(color: Color) {
    Box(modifier = Modifier.size(8.dp).background(color, CircleShape))
}

private const val URL_TAIL = 14

private const val LONGEST_MILLIS = 4020f
```

## API

### PantrixDataTable

`import com.pantrixui.components.data.datatable.PantrixDataTable`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixDataTable(
    rows: List<T>,
    columns: List<DataTableColumn<T>>,
    modifier: Modifier = Modifier,
    rowKey: ((row: T) -> String)? = null,
    rowLabel: ((row: T) -> String)? = null,
    rowEnabled: ((row: T) -> Boolean)? = null,
    rowTone: ((row: T) -> DataTableTone?)? = null,
    sort: List<DataTableSort> = emptyList(),
    onSortChange: ((List<DataTableSort>) -> Unit)? = null,
    multiSort: Boolean = false,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    selection: DataTableSelection = DataTableSelection.Multiple,
    expanded: Set<String> = emptySet(),
    onExpandedChange: ((Set<String>) -> Unit)? = null,
    expansion: DataTableExpansion = DataTableExpansion.Multiple,
    rowDetail: (@Composable (row: T) -> Unit)? = null,
    onRowClick: ((row: T) -> Unit)? = null,
    loading: Boolean = false,
    loadingRows: Int = 5,
    empty: (@Composable () -> Unit)? = null,
    toolbar: (@Composable () -> Unit)? = null,
    footer: (@Composable () -> Unit)? = null,
    listContent: (@Composable (row: T) -> Unit)? = null,
    variant: DataTableVariant = DataTableVariant.Plain,
    striped: Boolean = false,
    layout: DataTableLayout = DataTableLayout.Auto,
    headerTextStyle: TextStyle = PantrixTheme.typography.label.copy(fontWeight = FontWeight.SemiBold),
    state: DataTableState = rememberDataTableState(),
    style: DataTableStyle? = null,
    colors: DataTableColors? = null,
    tagKey: String? = null
)
```

Kayıtları satır satır, değerlerini kolon kolon gösterir: satırları sıralayan bir başlık, onları seçtiren kutular, açılan satırlar, ötekiler kayarken yerinde duran kolonlar ve tabloya yer olmayan yerde kayıtların listesi.

```kotlin
var sort by remember { mutableStateOf(listOf(DataTableSort("total", descending = true))) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
val columns = remember {
    listOf(
        DataTableColumn.text<Order>(key = "customer", header = customer, sortable = true) { it.customer },
        DataTableColumn.text(key = "total", header = total, alignment = Alignment.End, sortable = true) { it.total }
    )
}
PantrixDataTable(
    rows = remember(orders, sort) { orders.sortedWith(sort.comparator(columns)) },
    columns = columns,
    rowKey = { it.id },
    sort = sort,
    onSortChange = { sort = it },
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "orders"
)
```

**Satırlar çağıranındır.** Tablo `rows` ile verilen satırları verildikleri sırayla gösterir ve kendiliğinden hiçbir şeyi değiştirmez: bir başlığa basılınca istenen sıra `onSortChange` ile, bir kutuya basılınca seçim `onSelectionChange` ile, bir oka basılınca açılacak satır `onExpandedChange` ile bildirilir. Aynı tablo böylece hem ekranın elinde tuttuğu ve comparator ile kendi sıraladığı satırları, hem de sunucunun sıralayıp sayfa sayfa gönderdiği satırları gösterir. Verilen satırlar sayfadır: başlıktaki kutu onları seçer ve başka sayfalarda seçilmiş olanları tutar.

**Kolonlar.** Bir `DataTableColumn` ne kadar geniş olduğunu söyler ya da kalanı paylaşır. Kolonlar en dar hâlleriyle sığmıyorsa tablo yana kayar: sürükleyerek, tekerlekle, imlecin olduğu yerde satırların altındaki çubukla ve odağı alan hücreyi görünür yere getiren klavyeyle. Bir kenara sabitlenen kolon, ötekiler altından geçerken orada durur. Genişliği değiştirilebilen bir kolonun başlığının sonu imleçle sürüklenir, Tab oraya geldiğinde de ok tuşlarıyla oynatılır. Hangi kolonların, hangi sırayla olduğu listenin kendisidir: okurunun bir kolonu gizlemesine ya da yerini değiştirmesine izin veren ekran tabloya başka bir liste verir.

**Yükseklik.** Yüksekliği söylenmeyen tablo satırları kadar yüksektir ve hepsini kurar: kayan bir ekrandaki bir sayfa satır içindir, ve başlığı satırlarla birlikte sayfayla yukarı gider. Yüksekliği söylenen tablo başlığını yerinde tutar, satırlarını onun altında kaydırır ve yalnızca görünenleri kurar; böylece binlerce satırı taşır: başlığı yerinde dursun istenen tabloya yükseklik söylenir. Aşamayacağı bir yükseklik de bir yüksekliktir: çevresinde kayan bir şey olmadan doğrudan bir pencereye konan tablo pencereden yüksek olmaz; bir sütunu başka şeylerle paylaşan tabloya da, bir lazy listeye olduğu gibi, `Modifier.weight` verilir.

**Durum.** Satırların nereye kaydırıldığı, kolonların ne kadar kaydırıldığı ve sürüklendikleri genişlikler bir `DataTableState`'te tutulur; ekran onu, bunları okumak, saklamak ve bir kolona kaydırmak için kendisi tutar.

**Dar yerde.** `DataTableLayout.Auto` tablosu, stilin `compactWidth`'inden dar olduğunda kayıtların listesidir: her satır bir blok, her değerin önünde kolonunun adı. Kutular, oklar ve sıra kalır: sıralayan kolonların adları listenin üstünde bir şeritte durur, her biri başlıktaki düğmedir. Adlar sığmazsa şerit yana kayar, taştığı uca doğru solar ve kayıtların sıralandığı kolonun adını gösterir. Listede olmayan kolonun orada adı da yoktur.

**Klavye ve ekran okuyucu.** Tab sıralayan başlıklardan, kutulardan, oklardan, basılabilen satırlardan ve hücrelerin içindekilerden geçer; ok tuşları odağı o yöndeki en yakın olana taşır. Basılacak bir şey tutmayan hücre durak değildir: bu, okunan ve üstünde iş yapılan bir tablodur, hücre hücre gezilen bir ızgara değil. İmlecin olduğu yerde, tablo kayarken satırların penceresi de bir duraktır; böylece düz değerlerden oluşan bir tablo da klavyeyle kaydırılır: ok tuşlarıyla, Page Up ve Page Down ile, Home ve End ile. Bir başlık, başlık olduğunu, bir "heading" olarak, ve kolonunun nasıl sıralandığını söyler; bir kutu, `rowLabel` satırları adlandırıyorsa, hangi satırı seçtiğini, bir hücre de kaçıncı satırda ve kolonda olduğunu söyler.

Parametreler:

- `rows: List<T>`: satırlar, gösterildikleri sırayla.
- `columns: List<DataTableColumn<T>>`: kolonlar, gösterildikleri sırayla. İkisinin anahtarı aynı olamaz. Listeyi bir `remember` içinde tut: her bileşimde kolonları yeniden verilen bir tablo her satırı yeniden yerleştirir.
- `modifier: Modifier`: tablonun modifier'ı. Tablo kendisine verilen yer kadar geniştir.
- `rowKey: ((row: T) -> String)?`: bir satırı ötekilerden ayıran ve satır aynı kaldıkça değişmeyen şey: `selected` ve `expanded` bunları tutar, satırın otomasyon anahtarı da budur. Seçilen ya da açılan satırlara gerekir. Verilmezse satır yeriyle bilinir.
- `rowLabel: ((row: T) -> String)?`: ekran okuyucunun bir satırı ne diye çağırdığı: hepsi `Select row` diyen yirmi kutunun yerine `Select Ada Lovelace`.
- `rowEnabled: ((row: T) -> Boolean)?`: bir satırın seçilip basılabildiği. Seçilemeyen satır soluk çizilir, kutusu kapalıdır ve başlıktaki kutu onu ne seçer ne bırakır. Oku onu yine açar; hücrelerinin tuttuklarını kapatmak çağıranın işidir. Her satırı kapalı olan tabloya `{ false }` verilir.
- `rowTone: ((row: T) -> DataTableTone?)?`: bir satırın ne anlama geldiği, ya da ötekiler gibi bir satır için null: satır, tonun rolünün yumuşak dolgusuna, varsa şeridin üstüne yatar ve gösterdiği, temanın o dolguyla eşlediği renkte yazılır.
- `sort: List<DataTableSort>`: satırların sırası: sıranın baktığı kolonlar, ilki başta. Başlıklarda çizilir.
- `onSortChange: ((List<DataTableSort>) -> Unit)?`: sıralanabilen bir kolonun başlığına basılınca istenen sırayla çağrılır: önce küçükten büyüğe, sonra büyükten küçüğe, sonra sırasız. Null başlıkları yalnızca ad olarak bırakır.
- `multiSort: Boolean`: bir basışın kolonunu sıraya ekleyip eklemediği: yalnızca o kolona göre sıralamak yerine, önceki kolonların eşit saydığı satırları ayırmak için.
- `selected: Set<String>`: seçili satırların anahtarları.
- `onSelectionChange: ((Set<String>) -> Unit)?`: bir kutuya basıldıktan sonra seçili olması gereken anahtarlarla çağrılır. Null tabloyu kutusuz bırakır.
- `selection: DataTableSelection`: çok satırın mı, tek satırın mı seçildiği.
- `expanded: Set<String>`: açık satırların anahtarları.
- `onExpandedChange: ((Set<String>) -> Unit)?`: bir oka basıldıktan sonra açık olması gereken anahtarlarla çağrılır. Null satırları oksuz bırakır: `expanded` içinde adı geçen satırlar yine açıktır.
- `expansion: DataTableExpansion`: çok satırın mı, tek satırın mı açık durduğu. Tek olduğunda bir satırı açan ok yalnızca o satırı ister ve açık olan satır kapanır; `expanded` içinde adı geçen satırlar verildiği gibi açıktır.
- `rowDetail: (@Composable (row: T) -> Unit)?`: açık bir satırın altında, tablonun genişliğinde gösterdiği şey.
- `onRowClick: ((row: T) -> Unit)?`: basılan satırla çağrılır. Her satırı bir düğme yapar.
- `loading: Boolean`: satırların hâlâ yolda olup olmadığı: yerlerinde, tablonun kolonlarında, bloklar durur.
- `loadingRows: Int`: orada kaç satır blok durduğu.
- `empty: (@Composable () -> Unit)?`: satırı olmayan tablonun onların yerinde, temanın bunun için söylediği sözün yerine gösterdiği şey.
- `toolbar: (@Composable () -> Unit)?`: tablonun kenarının içinde, başlığın üstünde duran şey: bir başlık, bir arama alanı, seçilen satırlarla yapılacak iş.
- `footer: (@Composable () -> Unit)?`: tablonun kenarının içinde, satırların altında duran şey: bir `PantrixPagination`, bir sayı.
- `listContent: (@Composable (row: T) -> Unit)?`: listenin bir kaydının, kolonlarının adları ve değerleri yerine gösterdiği şey.
- `variant: DataTableVariant`: satırların çevresine ne kadar çizildiği.
- `striped: Boolean`: gözü satırında tutmak için her iki satırdan birinin soluk bir dolguya yatırılıp yatırılmadığı.
- `layout: DataTableLayout`: bunun bir tablo mu, bir liste mi, yoksa genişliğinin el verdiği mi olduğu.
- `headerTextStyle: TextStyle`: kolon adlarının yazıldığı yazı stili: kontrol etiketinin stili, biraz daha kalın. Başlıkları küçük, aralıklı büyük harfler olan tablo o stili burada verir ve başlıklarını büyük harfle yazar.
- `state: DataTableState`: satırların ve kolonların nereye kaydırıldığı ve kolonların sürüklendiği genişlikler.
- `style: DataTableStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Her platformda yalnızca verdiği alanlar değişir.
- `colors: DataTableColors?`: bu tablonun kendi renkleri, temanınkiler olmadıkları yerde: burada verilenler, gerisi için temanınkiler.
- `tagKey: String?`: tablonun otomasyon anahtarı: tablo `DataTable_<tagKey>` olur; içinde bir başlık `Header_<column>`, bir satır `Row_<row>`, bir hücre `Cell_<row>/<column>`, bir satırın kutusu `Select_<row>`, oku `Toggle_<row>` ve açtığı şey `Detail_<row>` olur. Bir basış `DataTable` olayı olarak bildirilir: `sort`, `select`, `selectAll`, `expand`, `collapse` ve `open`.

### DataTableColumn

`import com.pantrixui.components.data.datatable.DataTableColumn`, `com.pantrixui:components` içinden

```kotlin
class DataTableColumn<T>(
    public val key: String,
    public val header: String,
    public val width: Dp = Dp.Unspecified,
    public val weight: Float = 1f,
    public val minWidth: Dp = Dp.Unspecified,
    public val alignment: Alignment.Horizontal = Alignment.Start,
    public val sortable: Boolean = false,
    public val comparator: Comparator<T>? = null,
    public val pin: DataTablePin = DataTablePin.None,
    public val resizable: Boolean = false,
    public val showInList: Boolean = true,
    public val tone: DataTableTone? = null,
    public val cell: @Composable (row: T) -> Unit
)
```

Bir `PantrixDataTable`'ın bir kolonu: başlığı, ne kadar geniş olduğu ve bir satırın onda ne gösterdiği.

```kotlin
DataTableColumn(key = "state", header = stringResource(Res.string.state), width = 120.dp) { order ->
    PantrixBadge(text = order.state.label)
}
```

Düz yazı gösteren bir kolon `DataTableColumn.text` ile daha kısa yazılır: uzun yazıyı üç noktayla keser ve satırları ona göre sıralar.

**Genişlik.** `width` verilen kolon o genişliktedir. Verilmeyen, sabit kolonların bıraktığını `weight` payına göre paylaşır ve `minWidth`'ten dar olmaz. Kolonlar en dar hâlleriyle tabloya sığmıyorsa o genişlikleri korurlar ve tablo yana kayar.

Parametreler:

- `key: String`: Bu kolonu ötekilerden ayıran ve her dilde aynı olan şey: bir `DataTableSort` bunu adlandırır, kolonun otomasyon anahtarı da budur. Bir tablonun iki kolonunun anahtarı aynı olamaz.
- `header: String`: Kolonun adı: satırların üstünde bir kez, dar bir tablonun dönüştüğü listede ise her değerin önünde yazar. Verildiği gibi yazılır: bir başlık bir stil olmadan önce bir dilin sözüdür ve tablo onu büyük harfe çevirmez.
- `width: Dp`: Sabit bir genişlik, ya da kalandan bir pay için `Dp.Unspecified`.
- `weight: Float`: `width` verilmediğinde, sabit kolonların bıraktığından bu kolona düşen pay.
- `minWidth: Dp`: Paylaşan bir kolonun en dar hâli, ya da stilin `columnMinWidth`'i için `Dp.Unspecified`.
- `alignment: Alignment.Horizontal`: Başlığın ve bir satırın gösterdiğinin kolonda nerede durduğu. Sayılar kolonun sonunda biter ki basamakları alt alta gelsin.
- `sortable: Boolean`: Başlığa basmanın satırları bu kolonun sırasıyla isteyip istemediği. `comparator` verilen kolon bu olmadan da sıralanabilir. Sıralayan kolonun başlığı, satırlar onun sırasında olsun olmasın, adının yanında sıranın okunun yerini tutar: ada ancak yeten bir `width` adı keser.
- `comparator: Comparator<T>?`: İki satırın bu kolona göre nasıl karşılaştırıldığı, küçük olan önce: bütün satırlarını elinde tutan ve onları comparator ile kendisi sıralayan bir ekran için. Sırası başka yerde, bir sunucuda olduğu gibi, kurulan tablo bunu vermez.
- `pin: DataTablePin`: Ötekiler yana kayarken kolonun bir kenarda durup durmadığı.
- `resizable: Boolean`: Kolonun genişliğinin, başlığının sonundan imleçle sürüklenip sürüklenemediği. Tablo sürüklendiği genişliği tutar.
- `showInList: Boolean`: Kolonun, dar bir tablonun dönüştüğü listede olup olmadığı: bir kaydın satırlarından biri, ve sıralıyorsa listenin üstünde onu sıralayan adlardan biri. Tablonun biçimi için orada duran bir kolon, bir satırın eylemleri gibi, dışarıda bırakılır. Kendi yoluyla çizilen bir kaydın göstermediği kolon da öyle: tabloda sıralar, ve liste göstermediği şeye göre sıralanmaz.
- `tone: DataTableTone?`: Kolonun başlığının neyle boyandığı, ya da ötekiler gibi bir başlık için null: kolonun adının arkasında temanın rollerinden birinin yumuşak dolgusu; ad, temanın o dolguyla eşlediği renkte yazılır. Yalnızca başlığı işaretler. Satırların onun altında gösterdiğini boyamak `cell`'in işidir.
- `cell: @Composable (row: T) -> Unit`: Bir satırın bu kolonda gösterdiği şey.

Tipin kendisinde:

- `DataTableColumn.<T> text(key: String, header: String, width: Dp = Dp.Unspecified, weight: Float = 1f, minWidth: Dp = Dp.Unspecified, alignment: Alignment.Horizontal = Alignment.Start, sortable: Boolean = false, comparator: Comparator<T>? = null, pin: DataTablePin = DataTablePin.None, resizable: Boolean = false, showInList: Boolean = true, tone: DataTableTone? = null, maxLines: Int = 1, textOrder: Comparator<String>? = null, text: (row: T) -> String): DataTableColumn<T>`: Düz yazı gösteren bir kolon: `text` bir satırın ne gösterdiğini söyler; yazı en çok `maxLines` satırdır, daha uzunsa üç noktayla kesilir ve kontrol etiketinin yazı stiliyle yazılır.

  ```kotlin
  DataTableColumn.text(key = "customer", header = stringResource(Res.string.customer)) { it.customer }
  ```

  `sortable = true` verilir ve `comparator` verilmezse satırları o yazıya göre, büyük küçük harf ayırmadan sıralar. Yazı olarak yazılan sayıların kolonu kendi `comparator`'ını verir: yazı olarak `10`, `9`'dan önce gelir.

  Söylenmedikçe yazılar harf harf, Unicode'un harflere verdiği sayılarla karşılaştırılır: her platformda aynıdır ve hiçbir dilin alfabesi değildir; `ç`, `z`'den sonra gelir. Okurun alfabesine göre aradığı adlara dilin kendi sırası `textOrder` ile verilir:

  ```kotlin
  val order = rememberTextOrder()
  val columns = remember(order) {
      listOf(
          DataTableColumn.text<Order>(key = "name", header = name, sortable = true, textOrder = order) {
              it.customer
          }
      )
  }
  ```

  `key`: bu kolonu ötekilerden ayıran ve her dilde aynı olan şey: bir `DataTableSort` bunu adlandırır, kolonun otomasyon anahtarı da budur. Bir tablonun iki kolonunun anahtarı aynı olamaz.

  `header`: kolonun adı: satırların üstünde bir kez, dar bir tablonun dönüştüğü listede ise her değerin önünde yazar. Verildiği gibi yazılır: tablo onu büyük harfe çevirmez.

  `width`: sabit bir genişlik, ya da kalandan bir pay için `Dp.Unspecified`.

  `weight`: `width` verilmediğinde, sabit kolonların bıraktığından bu kolona düşen pay.

  `minWidth`: paylaşan bir kolonun en dar hâli, ya da stilin `columnMinWidth`'i için `Dp.Unspecified`.

  `alignment`: başlığın ve bir satırın gösterdiğinin kolonda nerede durduğu. Sayılar kolonun sonunda biter ki basamakları alt alta gelsin.

  `sortable`: başlığa basmanın satırları bu kolonun sırasıyla isteyip istemediği. `comparator` verilen kolon bu olmadan da sıralanabilir. Sıralayan kolonun başlığı adının yanında sıranın okunun yerini tutar: ada ancak yeten bir `width` adı keser.

  `pin`: ötekiler yana kayarken kolonun bir kenarda durup durmadığı.

  `resizable`: kolonun genişliğinin, başlığının sonundan imleçle sürüklenip sürüklenemediği. Tablo sürüklendiği genişliği tutar.

  `showInList`: kolonun, dar bir tablonun dönüştüğü listede olup olmadığı: bir kaydın satırlarından biri, ve sıralıyorsa listenin üstünde onu sıralayan adlardan biri.

  `tone`: kolonun başlığının neyle boyandığı, ya da ötekiler gibi bir başlık için null: kolonun adının arkasında temanın rollerinden birinin yumuşak dolgusu; ad, temanın o dolguyla eşlediği renkte yazılır. Yalnızca başlığı işaretler.

  `maxLines`: bir satırın yazısının en çok kaç satır olduğu.

  `textOrder`: satırları yazısına göre sıralayan bir kolon için iki yazının nasıl karşılaştırıldığı: bir dilin sırası, `PantrixLocale.textOrder` ve `rememberTextOrder`'ın verdiği gibi.

  `text`: bir satırın bu kolonda gösterdiği şey.

### DataTableSort

`import com.pantrixui.components.data.datatable.DataTableSort`, `com.pantrixui:components` içinden

```kotlin
data class DataTableSort(
    public val columnKey: String,
    public val descending: Boolean = false
)
```

Bir `PantrixDataTable`'ın satırlarının hangi kolona göre ve hangi yönde sıralandığı.

Parametreler:

- `columnKey: String`: Kolonun `DataTableColumn.key`'i.
- `descending: Boolean`: En büyüğün önce gelip gelmediği. Verilmezse en küçük önce gelir.

### DataTablePin

`import com.pantrixui.components.data.datatable.DataTablePin`, `com.pantrixui:components` içinden

```kotlin
enum class DataTablePin
```

Bir `PantrixDataTable`'ın bir kolonunun, ötekiler yana kayarken nerede durduğu.

Değerleri:

- `None`: Ötekilerle birlikte: kolonlar tabloya sığmadığında yana kayar.
- `Start`: Tablonun başında, kayan her kolondan önce: bir satırı adlandıran kolon. Ötekiler kenarının altından kayarken orada durur. Sağdan sola düzende sağ kenardır.
- `End`: Tablonun sonunda, kayan her kolondan sonra: bir satırın eylemleri.

### DataTableVariant

`import com.pantrixui.components.data.datatable.DataTableVariant`, `com.pantrixui:components` içinden

```kotlin
enum class DataTableVariant
```

Bir `PantrixDataTable`'ın satırlarının çevresine ne kadar çizdiği.

Değerleri:

- `Plain`: Bir satırla sonraki arasında bir çizgi; tablonun çevresinde bir şey yok: bir kartın içindeki ya da bir sayfadaki tablo için.
- `Bordered`: Bütün tablonun çevresinde, stilin şekliyle, tek bir kenar; içinde satırların arasında birer çizgi.
- `Grid`: O kenar, ve kolonların arasında da birer çizgi: gözün satır boyunca olduğu kadar kolon boyunca da okuduğu sık bir rapor için.

### DataTableLayout

`import com.pantrixui.components.data.datatable.DataTableLayout`, `com.pantrixui:components` içinden

```kotlin
enum class DataTableLayout
```

Bir `PantrixDataTable`'ın tablo olarak mı, kayıtların listesi olarak mı çizildiği.

Değerleri:

- `Auto`: Yeri olan yerde tablo, tablonun kendisi stilin `compactWidth`'inden dar olduğunda liste: altı kolonlu bir tablonun telefonda dönüşmesi gereken şey.
- `Table`: Yeri ne kadar dar olursa olsun hep tablo: kolonları en dar hâllerini korur ve yana kayar.
- `List`: Hep liste: her kayıt kendi bloğu, her değerin önünde kolonunun başlığı.

### DataTableSelection

`import com.pantrixui.components.data.datatable.DataTableSelection`, `com.pantrixui:components` içinden

```kotlin
enum class DataTableSelection
```

Bir `PantrixDataTable`'ın aynı anda kaç satırının seçilebildiği.

Değerleri:

- `Multiple`: İstenildiği kadar satır: her biri kendi onay kutusuyla, hepsi birden başlıktaki onay kutusuyla.
- `Single`: Tek satır, bir radyo düğmesiyle: bir başkasını seçmek ilkini bırakır.

### DataTableTone

`import com.pantrixui.components.data.datatable.DataTableTone`, `com.pantrixui:components` içinden

```kotlin
enum class DataTableTone
```

Bir `PantrixDataTable` satırının ya da bir kolonun başlığının ne anlama geldiği: temanın rollerinden birinin yumuşak dolgusuyla çizilir, temanın onunla eşlediği renkte yazılır.

Bir boya, onu göremeyene bir şey söylemez: ne anlama geldiği satırda sözle de yazar.

Değerleri:

- `Info`: İyi ya da kötü olmayan, bilinmeye değer bir şey.
- `Success`: İşleyen ya da yolunda olan bir şey.
- `Warning`: Sorun olmadan önce bakılacak bir şey.
- `Danger`: Başarısız olan ya da gecikmiş bir şey.
- `Neutral`: İçinde bir yargı olmadan ayrı tutulan: bir toplam satırı, başka türden bir kolon.

### DataTableExpander

`import com.pantrixui.components.data.datatable.DataTableExpander`, `com.pantrixui:components` içinden

```kotlin
enum class DataTableExpander
```

Bir `PantrixDataTable` satırını açan düğmenin nerede durduğu.

Değerleri:

- `Start`: İlk kolondan önce, satırı seçen kutudan sonra.
- `End`: Son kolondan sonra, satırın sonunda, bir listenin satırında okun durduğu yerde. Kolonlar kayarken orada kalır.

### DataTableState

`import com.pantrixui.components.data.datatable.DataTableState`, `com.pantrixui:components` içinden

```kotlin
class DataTableState(public val listState: LazyListState = LazyListState())
```

Bir `PantrixDataTable`'ın bir bileşimden ötekine tuttuğu, onu okuyan, saklayan ya da değiştiren bir ekran için: satırların nereye kaydırıldığı, kolonların yana ne kadar kaydırıldığı ve kolonlara sürüklenerek verilen genişlikler.

```kotlin
val table = rememberDataTableState()
val scope = rememberCoroutineScope()
PantrixDataTable(rows = orders, columns = columns, state = table)
PantrixButton(text = total, onClick = { scope.launch { table.animateScrollToColumn("total") } })
PantrixButton(text = reset, onClick = { table.columnWidths = emptyMap() })
```

Bir durum bir tablonundur: aynı durum verilen iki tablo birbirinin kolonlarını kaydırırdı.

Parametreler:

- `listState: LazyListState`: Tabloya yükseklik söylendiğinde satırların içinde kaydığı listenin durumu.

Üyeleri:

- `columnWidths: Map<String, Dp>`: Tablo kolonları yerleştirdikten sonra onlara verilen genişlikler, anahtarlarına göre: genişliği değiştirilebilen bir kolonun başlığının sonundaki sürüklemeyle, oradaki ok tuşlarıyla ya da ekranın kendisince; ekran bunları yazabilir. Son ziyaretten saklanan bir genişlik buraya konur; boş bir harita her kolona tablonun verdiği genişliği geri verir. Adı geçmeyen kolon tablonun verdiği genişliktedir.
- `columnScroll: Float`: Kolonların başlarından ne kadar kaydırıldığı, piksel olarak: dururken sıfır. Tablo sağdan okunuyorsa başları sağdadır.
- `columnScrollRange: Float`: Kolonların ne kadar kaydırılabildiği, piksel olarak: her kolon tabloya sığarken sıfır.
- `suspend fun scrollColumnsBy(pixels: Float): Float`: Kolonları bir anda başlarından `pixels` kadar öteye, eksi bir uzaklıkla da başlarına doğru kaydırır; iki uçlarından öteye değil. Ne kadar gittiklerini döner.
- `suspend fun animateScrollColumnsBy(pixels: Float): Float`: Kolonları `scrollColumnsBy` gibi, bir tekerlek dönüşünün hareketiyle kaydırır.

  `pixels`: kolonların piksel olarak ne kadar kaydığı: başlangıçlarından uzağa, ya da sıfırdan küçükse başlangıçlarına doğru.
- `suspend fun scrollToColumn(columnKey: String)`: `columnKey` anahtarlı kolonu bir anda, kısa yoldan ve gerektiğinden öteye gitmeden görünür yere getirir. Zaten görünen, sabitlenmiş ya da tabloda olmayan bir kolon için hiçbir şey olmaz.
- `suspend fun animateScrollToColumn(columnKey: String)`: `columnKey` anahtarlı kolonu `scrollToColumn` gibi, bir hareketle görünür yere getirir.

Tipin kendisinde:

- `DataTableState.saver(listState: LazyListState): Saver<DataTableState, Any>`: Olduğu gibi geri gelecek bir durum için kolonların ne kadar kaydırıldığını ve onlara verilen genişlikleri saklar: `rememberSaveable(saver = DataTableState.saver(listState)) { DataTableState(listState) }`. Satırların nerede olduğunu saklamak `listState`'in kendi işidir.

### rememberDataTableState

`import com.pantrixui.components.data.datatable.rememberDataTableState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberDataTableState(listState: LazyListState = rememberLazyListState()): DataTableState
```

Saklanan bir durumun korunduğu her şeyde korunan bir `DataTableState`: ekranın dönmesi, başka bir ekrana gidip geri gelmek.

Parametreler:

- `listState: LazyListState`: satırların içinde kaydığı listenin durumu, onu kendisi tutan bir ekran için.

### DataTableStyle

`import com.pantrixui.components.data.datatable.DataTableStyle`, `com.pantrixui:components` içinden

```kotlin
class DataTableStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val headerMinHeight: Dp = Dp.Unspecified,
    public val rowMinHeight: Dp = Dp.Unspecified,
    public val cellPadding: Dp = Dp.Unspecified,
    public val cellVerticalPadding: Dp = Dp.Unspecified,
    public val columnMinWidth: Dp = Dp.Unspecified,
    public val sortIconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val compactWidth: Dp = Dp.Unspecified,
    public val expander: DataTableExpander? = null
) : PantrixStyle<DataTableStyle>
```

`PantrixDataTable`'ın geometrisi: bir başlığın ve bir satırın en az ne kadar yüksek olduğu, bir hücrenin gösterdiğinin çevresindeki boşluk ve kenar.

Android'de satırlar Material'ın veri tablosu satırlarıdır: 56dp'lik bir başlığın altında 52dp, hücrenin iki yanında 16dp. iOS'ta izlenecek bir tablo yoktur ve satır bir listenin 44pt'lik satırıdır: orada parmağa verilen en az yer. Masaüstü ve web, imleç için, daha sıkıdır: fareyle okunan bir tablo bir buçuk katı kadar satır gösterir.

Yükseklikler ve hücredeki boşluk yoğunluğu izler: sıkı bir ekran adını en çok tabloda hak eder. Sıralama okunun boyu, çizginin kalınlığı, şekil ve düzenin baktığı genişlikler izlemez.

Parametreler:

- `shape: ShapeSpec`: `DataTableVariant.Bordered` ve `DataTableVariant.Grid` tablosunun çevresindeki kenarın köşeleri: markanın şekil ölçeğinin bir adımı ya da sabit bir şekil.
- `headerMinHeight: Dp`: Başlığın en az yüksekliği. İki satıra yazılan bir başlık adı onu yükseltir.
- `rowMinHeight: Dp`: Bir satırın en az yüksekliği. Bir hücrenin gösterdiği satırını yükseltir; bir kontrol taşıyan satır da platformun dokunma hedefinden alçak olmaz.
- `cellPadding: Dp`: Bir hücrenin yanları ile gösterdiği arasındaki boşluk.
- `cellVerticalPadding: Dp`: Bir hücrenin gösterdiğinin üstündeki ve altındaki boşluk: gösterdiği, en az yükseklikten çoğuna gerek duyduğunda.
- `columnMinWidth: Dp`: Tablonun genişliğini paylaşan ve kendi en dar hâlini söylemeyen bir kolonun en az genişliği. Tablo kolonlara dar geldiğinde kolonlar bunu korur ve tablo yana kayar.
- `sortIconSize: Dp`: Satırların sıralandığı kolonun başlığının yanındaki okun eni ve boyu.
- `borderWidth: Dp`: Satırların ve kolonların arasındaki çizgilerin ve kenarın kalınlığı. Sıfır hiçbirini çizmez.
- `compactWidth: Dp`: Bundan dar olan bir `DataTableLayout.Auto` tablosu kayıtların listesi olarak çizilir.
- `expander: DataTableExpander?`: Satırı açan düğmenin nerede durduğu: her platformda satırın sonunda, bir listenin okunun durduğu gibi. Null olduğu gibi bırakır.

### DataTableColors

`import com.pantrixui.components.data.datatable.DataTableColors`, `com.pantrixui:components` içinden

```kotlin
data class DataTableColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val headerContainer: Color = Color.Unspecified,
    public val headerContent: Color = Color.Unspecified,
    public val stripe: Color = Color.Unspecified,
    public val selected: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir `PantrixDataTable`'ın neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// The grey band a report's header usually has, written in what the theme pairs with it.
PantrixDataTable(…, colors = DataTableColors(headerContainer = PantrixTheme.colors.neutral.container))
```

Burada verilen bir `container` ya da `headerContainer` temanın rol renklerinden biriyse, `content` ya da `headerContent` de verilmedikçe, temanın onunla eşleştirdiği rengi getirir. Hiçbir rolün olmayan bir dolgu getirmez: üstünde neyin okunacağını vermek çağıranın işidir.

Parametreler:

- `container: Color`: Bütün tablonun arkasındaki dolgu. Verilmezse yoktur: tablo arkasındakinin, bir kartın yüzeyinin ya da bir sayfanın üstünde durur.
- `content: Color`: Bir hücreye, gösterdiği kendi rengini vermediğinde verilen renk ve bir satırın kendi işaretlerinin çizildiği renk: onu açan ok, üstündeki imlecin izi. Temanın `textPrimary`'si; tablonun olmayan bir dolgunun üstünde ise o dolgunun üstünde durana verdiği renk.
- `headerContainer: Color`: Başlığın arkasındaki dolgu. Verilmezse yoktur.
- `headerContent: Color`: Başlıkların adları ve sıralama oku. Temanın kendi zeminlerinde temanın `textSecondary`'si, `headerContainer` bir rolün rengiyse onunla eşleşen renk, başka yerde `content`.
- `stripe: Color`: Şeritli bir tablonun her iki satırından birinin arkasındaki dolgu: verilmezse `content`'in soluk bir payı.
- `selected: Color`: Seçili bir satırın arkasındaki dolgu: temanın kendi zeminlerinde temanın `primary`'sinin, bir dolgunun üstünde ise `content`'in soluk bir payı.
- `divider: Color`: Satırların ve kolonların arasındaki çizgiler ve kenar. Temanın kendi zeminlerinde temanın `divider`'ı. O çizginin okunmayacağı bir dolgunun üstünde `content`'in bir payı: soluk bir düğmenin kenarı gibi.

### List<DataTableSort>.comparator

`import com.pantrixui.components.data.datatable.comparator`, `com.pantrixui:components` içinden

```kotlin
fun <T> List<DataTableSort>.comparator(columns: List<DataTableColumn<T>>): Comparator<T>
```

İki satırın bu sırada nasıl karşılaştırıldığı: adı geçen ilk kolona göre, o eşit dediğinde sonrakine göre. Her kolon kendi `DataTableColumn.comparator`'ıyla karşılaştırır; sıra azalansa tersine çevrilir. Karşılaştırıcısı olmayan ya da `columns` arasında bulunmayan bir kolon bir şey söylemez. Hiç sıra yoksa her iki satır eşittir; eşit satırları oldukları gibi bırakan bir sıralama, `sortedWith` gibi, listeyi olduğu gibi bırakır.

```kotlin
PantrixDataTable(rows = remember(orders, sort) { orders.sortedWith(sort.comparator(columns)) }, …)
```

Parametreler:

- `columns: List<DataTableColumn<T>>`

### PantrixLocale.textOrder

`import com.pantrixui.foundation.l10n.textOrder`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixLocale.textOrder(): Comparator<String>
```

Bu dilde iki yazının nasıl karşılaştırıldığı: o dilin okurunun bir adı aradığı sıra.

```kotlin
names.sortedWith(PantrixLocale.Turkish.textOrder()) // cam, Çay, çilek, ılık, iğne, şeker, zeytin
names.sorted()                                      // cam, iğne, zeytin, Çay, çilek, ılık, şeker
```

Kotlin iki yazıyı Unicode'un harflerine verdiği sayılarla karşılaştırır. Bu her platformda aynıdır ve hiçbir dilin alfabesi değildir: her büyük harf her küçük harften önce gelir, `ç`, `ö` ve `ş` de `z`'den sonra. Bunun yerine her platformun kendi sıralaması gelir: Android'de ve masaüstünde `java.text.Collator`, iOS'ta `NSString`'in yerelleştirilmiş karşılaştırması, tarayıcıda `Intl.Collator`.

Yalnızca büyüklüğü küçüklüğü farklı olan harfler eşit sayılır; böylece `ada` ile `Ada` yan yana durur ve eşitleri oldukları gibi bırakan bir sıralama, `sortedWith` gibi, onları geldikleri sırada bırakır. Aksanlı bir harf aksansızından ayırt edilir. Rakamlar harfler gibi karşılaştırılır: `10`, `9`'dan önce gelir; sayılardan oluşan bir yazı bununla değil, sayılarıyla sıralanır.

Sıra platformundur, ve platformlar her dilin her harfinde anlaşmaz: burada sıralanan bir liste ile bir sunucunun sıraladığı bir iki harfte ayrılabilir. Tam da bir sunucunun sırasında olması gereken listeyi sunucu sıralar.

Dönen şeyi sakla: bir tane kurmak bedava değildir ve bir sıralama ona binlerce kez sorar. Bir bileşimde onu `rememberTextOrder` saklar.

### rememberTextOrder

`import com.pantrixui.foundation.l10n.rememberTextOrder`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberTextOrder(locale: PantrixLocale = PantrixTheme.locale): Comparator<String>
```

`locale`'in `textOrder`'ı, dil aynı kaldıkça saklanır: söylenmedikçe temanın kendi dili.

```kotlin
val order = rememberTextOrder()
val sorted = remember(names, order) { names.sortedWith(order) }
```

Parametreler:

- `locale: PantrixLocale`

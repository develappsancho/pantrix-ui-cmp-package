# Lazy Tree View

Kendi alanında kayan, binlerce satırlık bir hiyerarşi: bir belgenin değerleri, bir projenin dosyaları, binlerce başlıklı bir taslak. Yalnızca görünen satırlar kompoze edilir; yüz bin açık satırlı bir ağaç ekranın gösterdiği kadarını kurar. Kaydıran bir sayfada duran birkaç düzine satırlık ağaç `PantrixTreeView`'dür.

- `PantrixLazyTreeView` (`com.pantrixui.components.data.lazytreeview`, `com.pantrixui:components`): Yalnızca görünen satırlarını kompoze eden, kayan, çok satırlı bir hiyerarşi: bir belgenin değerleri, bir projenin dosyaları; anahtarıyla görünüme getirilir. Anahtar sözcükler: büyük ağaç, tembel ağaç, sanallaştırılmış ağaç, belge taslağı, json ağacı, kayan ağaç.

## Özellikler

- **Kardeşi.** Satırları `PantrixTreeView`'ünkilerle aynıdır: açık dallar ve seçili satırlar ekranın durumudur (`expanded`, `selected`), seçim, onay kutuları, açınca yükleme (`loading`), süzme (`filter`) ve kılavuz çizgileri (`guides`) orada nasılsa burada da öyledir.
- **Kaydırma.** `rememberTreeViewState()` satırların nereye kaydığını tutar. `state.scrollToKey(key)` görünen bir satırı en kısa yoldan görünüme getirir: aşağıdaki satır alta, yukarıdaki üste gelir, görünendeki yerinde kalır. Kapalı bir dalın içindeki satır, dalı açılıp ağaç yeniden kompoze edildikten sonra getirilir: bunu dalı açan değişikliğin bir efekti yapar, `LaunchedEffect(key) { state.scrollToKey(key) }`.
- **Bir satırın taşıdıkları.** `TreeNode.styledLabel` etiketi kendi biçimleriyle çizer, bir belgenin sözdizimi renkleri gibi; metni `label`'ınkiyle aynıdır, süzmenin bulduğu harfler onun üstüne işaretlenir. `TreeViewStyle`'ın `labelRole`'ü etiketleri başka bir yazıyla, kodunkiyle yazar. `trailing` her satırın sonuna, düğümün kendi yazısından sonra bir şey çizer: bir etiket, bir değerin türü. Satırla birlikte okunur, kendi basışı yoktur.
- **Klavye.** Ağaç Tab için tek duraktır: odağın en son durduğu satır görünürdeyse o, değilse görünürdeki seçili satır ya da görünürdeki ilk satır; odak gözden uzak bir satıra gönderilmez. Oklar, Home, End, harfler ve `*` kardeşindeki gibi gezer, ağaç vardıkları satıra kayar.
- **Hareket.** Açılan ve kapanan dalların satırları temanın hareketiyle gelip gider, altlarındaki satırlar onunla kayar.
- **Boyut.** Ağaç verilen genişlik kadar geniştir. Verilen alana kadar açık satırları kadar uzun ya da modifier'ın verdiği boydadır; satırları onun içinde kayar. Kaydıran bir sütunda kendi boyu verilir. Satırların sonunda bir kaydırma çubuğu durur.
- **Bir kaynaktan.** Bir liste olarak verilemeyecek kadar büyük bir ağaç `source` alır: bir `TreeSource` her açık dalın kaç çocuğu olduğunu ve sıradaki çocuğunu verir, ağaç yalnızca görünen satırların düğümünü ister. Süzme ve onay kutuları bütün düğümleri okuyacağı için bu biçimde yoktur.
- **Otomasyon.** `tagKey` ile ağaç `LazyTreeView_<tagKey>`, bir satırı `LazyTreeView_<tagKey>.Node_<key>`, oku `LazyTreeView_<tagKey>.Twisty_<key>` olur. Basışlar düğümün anahtarıyla `LazyTreeView` olayı olarak bildirilir.

## Kullanım

### A document's values, the chosen one brought into view

```kotlin
var open by rememberSaveable { mutableStateOf(setOf("$")) }
var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val tree = rememberTreeViewState()
val scope = rememberCoroutineScope()
PantrixLazyTreeView(
    nodes = document,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.height(360.dp),
    state = tree,
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "document"
)
PantrixButton(
    text = "Go to the chosen one",
    onClick = { scope.launch { chosen.firstOrNull()?.let { tree.scrollToKey(it) } } },
    tagKey = "reveal"
)
```

### Keys in the code's type, their values' kinds at the row's end

```kotlin
PantrixLazyTreeView(
    nodes = listOf(
        TreeNode(
            key = "$.name",
            label = "name: \"Ada\"",
            styledLabel = buildAnnotatedString {
                withStyle(SpanStyle(color = PantrixTheme.colors.primary.color)) { append("name") }
                append(": \"Ada\"")
            }
        )
    ),
    expanded = emptySet(),
    onExpandedChange = {},
    modifier = Modifier.height(240.dp),
    style = TreeViewStyle(labelRole = TypeRole.Code),
    trailing = { node -> PantrixTag(text = kindOf(node)) },
    tagKey = "values"
)
```

## Örnekler

### On bin satırlık bir belge

Yüz siparişin her birinde yüz kalem: on bin satırdan fazlası, yalnızca görünenleri kompoze edilir. "Seçiliye git" seçili kalemi görünüme getirir. "Sipariş 73, kalem 42" o siparişin dalını açar, kalemi seçer ve ağaç onu gösterdikten sonra bir efektle oraya kayar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.lazytreeview.TreeViewState
import com.pantrixui.components.data.lazytreeview.rememberTreeViewState
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

var open by rememberSaveable { mutableStateOf(setOf("orders")) }
var chosen by rememberSaveable { mutableStateOf(setOf(itemKey(order = 2, item = 5))) }
val tree: TreeViewState = rememberTreeViewState()
val scope = rememberCoroutineScope()
// Dalı açılan kalem, ağaç onu gösterdikten sonra görünüme getirilir.
var target by remember { mutableStateOf<String?>(null) }
LaunchedEffect(target) {
    target?.let { tree.scrollToKey(it) }
    target = null
}
PantrixLazyTreeView(
    nodes = ORDER_TREE,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(360.dp),
    state = tree,
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    guides = true,
    tagKey = "orders"
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Seçiliye git",
        onClick = { scope.launch { chosen.firstOrNull()?.let { tree.scrollToKey(it) } } },
        variant = ButtonVariant.Outline,
        tagKey = "reveal"
    )
    PantrixButton(
        text = "Sipariş 73, kalem 42",
        onClick = {
            val key = itemKey(order = 73, item = 42)
            open = open + "order73"
            chosen = setOf(key)
            target = key
        },
        variant = ButtonVariant.Outline,
        tagKey = "jump"
    )
}
PantrixText(
    text = "Seçilen: ${chosen.firstOrNull() ?: "yok"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val ORDER_TREE: List<TreeNode> = listOf(
    TreeNode(
        key = "orders",
        label = "Siparişler",
        children = (1..ORDER_COUNT).map { order ->
            TreeNode(
                key = "order$order",
                label = "Sipariş $order",
                children = (1..ITEMS_EACH).map { item ->
                    TreeNode(
                        key = itemKey(order, item),
                        label = "Kalem $item",
                        trailing = "${(order * item) % 90 + 10} TL"
                    )
                }
            )
        }
    )
)

private fun itemKey(
    order: Int,
    item: Int
): String = "order$order.item$item"

private const val ORDER_COUNT = 100

private const val ITEMS_EACH = 100
```

### Kod yazısında anahtarlar, sonda türleri

Bir kişinin JSON belgesi: anahtarlar temanın birincil renginde (`styledLabel`), etiketler kodun yazısında (`TreeViewStyle(labelRole = TypeRole.Code)`), her değerin türü satırın sonunda bir etiketle (`trailing`).

Bir bağlantı olan değerin satırının bir eylemi var (`rowAction`): sondaki düğme bağlantıyı açar ve satırı seçmez. Klavyede odaktaki satırda Shift+Enter, ekran okuyucuda satırın eylemleri aynı işi görür. Örnek bağlantıyı açmaz, açılacak adresi altına yazar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeRowAction
import com.pantrixui.components.data.treeview.TreeViewStyle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.TypeRole

var open by rememberSaveable { mutableStateOf(setOf("$", "$.address")) }
var asked by rememberSaveable { mutableStateOf<String?>(null) }
val key = PantrixTheme.colors.primary.color
val nodes = remember(key) { personOf(key) }
PantrixLazyTreeView(
    nodes = nodes,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(320.dp),
    guides = true,
    trailing = { node -> KINDS[node.key]?.let { PantrixTag(text = it) } },
    style = TreeViewStyle(labelRole = TypeRole.Code),
    tagKey = "person",
    rowAction = { node ->
        LINKS[node.key]?.let { address ->
            TreeRowAction(icon = PantrixIcons.ExternalLink, label = "Bağlantıyı aç") { asked = address }
        }
    }
)
PantrixText(
    text = "Açılacak bağlantı: ${asked ?: "yok"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private fun personOf(key: Color): List<TreeNode> {
    fun value(
        at: String,
        name: String,
        value: String = "",
        children: List<TreeNode> = emptyList(),
        tag: String? = null
    ) = TreeNode(
        key = at,
        label = if (value.isEmpty()) name else "$name: $value",
        children = children,
        tagKey = tag,
        styledLabel = buildAnnotatedString {
            withStyle(SpanStyle(color = key)) { append(name) }
            if (value.isNotEmpty()) append(": $value")
        }
    )
    return listOf(
        value(
            "$",
            "kişi",
            children = listOf(
                value("$.name", "ad", "\"Ada\""),
                value("$.web", "web", "\"https://example.com/ada\"", tag = "web"),
                value("$.born", "doğum", "1815"),
                value(
                    "$.address",
                    "adres",
                    children = listOf(
                        value("$.address.city", "şehir", "\"Londra\""),
                        value("$.address.zip", "posta", "\"W1\"")
                    )
                ),
                value("$.tags", "etiketler", children = listOf(value("$.tags[0]", "0", "\"matematik\""))),
                value("$.alive", "yaşıyor", "false")
            )
        )
    )
}

private val KINDS = mapOf(
    "$" to "nesne",
    "$.name" to "metin",
    "$.web" to "bağlantı",
    "$.born" to "sayı",
    "$.address" to "nesne",
    "$.address.city" to "metin",
    "$.address.zip" to "metin",
    "$.tags" to "dizi",
    "$.tags[0]" to "metin",
    "$.alive" to "mantıksal"
)

private val LINKS = mapOf("$.web" to "https://example.com/ada")
```

### On bin satırda süzme

On bin satırda süzme: alana yazılan, adlarda aranır; bulunan kalemler ve durdukları siparişler görünür, bulunan harfler işaretlenir. "kalem 42" yazınca yüz siparişin her birinden bir kalem kalır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
var open by rememberSaveable { mutableStateOf(setOf("orders")) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Kalemlerde ara",
    showClearButton = true,
    contentDescription = "Kalemlerde ara",
    tagKey = "order_search"
)
PantrixLazyTreeView(
    nodes = ORDER_TREE,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(320.dp),
    filter = query.text.toString(),
    tagKey = "orders_filtered"
)

private val ORDER_TREE: List<TreeNode> = listOf(
    TreeNode(
        key = "orders",
        label = "Siparişler",
        children = (1..ORDER_COUNT).map { order ->
            TreeNode(
                key = "order$order",
                label = "Sipariş $order",
                children = (1..ITEMS_EACH).map { item ->
                    TreeNode(
                        key = itemKey(order, item),
                        label = "Kalem $item",
                        trailing = "${(order * item) % 90 + 10} TL"
                    )
                }
            )
        }
    )
)

private fun itemKey(
    order: Int,
    item: Int
): String = "order$order.item$item"

private const val ORDER_COUNT = 100

private const val ITEMS_EACH = 100
```

### Bir kaynaktan yüz bin kayıt

Bir kaynaktan yüz bin kayıt (`source`, `TreeSource`): ağaç her açık dalın kaç çocuğu olduğunu ve sıradaki çocuğunu kaynaktan ister, düğümü yalnızca satırı görünmek üzereyken kurar; kaydırılıp geçilen satırlar hiç kurulmaz. "Kayıt 50000'e git" o kaydın yerini kaynağın anahtardan söylediği sıradan bulur (`TreeSource.indexOf`).

"Arşiv"in çocukları henüz yüklenmedi: düğümü kaç tane olacağını söyler (`TreeNode.childCount`) ve ekran okuyucu kapalı satırda bunu duyar. Açınca yerinde bir yükleme göstergesi döner.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView
import com.pantrixui.components.data.lazytreeview.TreeSource
import com.pantrixui.components.data.lazytreeview.rememberTreeViewState
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import kotlinx.coroutines.launch

val source = remember { RecordsSource(count = 100_000) }
var open by rememberSaveable { mutableStateOf(setOf("records")) }
val tree = rememberTreeViewState()
val scope = rememberCoroutineScope()
PantrixLazyTreeView(
    source = source,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxWidth().height(320.dp),
    state = tree,
    loading = setOf("archive").intersect(open),
    tagKey = "records"
)
PantrixButton(
    text = "Kayıt 50000'e git",
    onClick = { scope.launch { tree.scrollToKey("record/49999") } },
    variant = ButtonVariant.Outline,
    tagKey = "go_to_record"
)

private class RecordsSource(private val count: Int) : TreeSource {
    override fun childCount(parent: TreeNode?): Int = when {
        parent == null -> 2
        parent.key == "records" -> count
        parent.key.startsWith("record/") -> RECORD_FIELDS.size
        else -> 0
    }

    override fun childAt(
        parent: TreeNode?,
        index: Int
    ): TreeNode = when {
        parent == null && index == 0 -> TreeNode("records", "Kayıtlar", hasChildren = true, trailing = "$count")
        parent == null -> TreeNode("archive", "Arşiv", hasChildren = true, childCount = 1_200)
        parent.key == "records" -> TreeNode("record/$index", "Kayıt ${index + 1}", hasChildren = true)
        else -> TreeNode("${parent.key}/${RECORD_FIELDS[index]}", RECORD_FIELDS[index])
    }

    override fun indexOf(
        parent: TreeNode?,
        key: String
    ): Int = when {
        parent == null -> listOf("records", "archive").indexOf(key)
        parent.key == "records" -> key.removePrefix("record/").toIntOrNull()?.takeIf { it in 0 until count } ?: -1
        else -> RECORD_FIELDS.indexOf(key.removePrefix("${parent.key}/"))
    }
}

private val RECORD_FIELDS = listOf("ad", "şehir", "tutar")
```

## API

### PantrixLazyTreeView

`import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixLazyTreeView(
    nodes: List<TreeNode>,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    state: TreeViewState = rememberTreeViewState(),
    selection: TreeSelection = TreeSelection.None,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    loading: Set<String> = emptySet(),
    filter: String = "",
    guides: Boolean = false,
    trailing: (@Composable RowScope.(TreeNode) -> Unit)? = null,
    style: TreeViewStyle? = null,
    colors: TreeViewColors? = null,
    rowAction: ((TreeNode) -> TreeRowAction?)? = null,
    tagKey: String? = null
)
```

Kendi alanında kayan, çok satırlı bir hiyerarşi: bir belgenin değerleri, bir projenin dosyaları, binlerce başlıklı bir taslak. Yalnızca görünen satırlar kompoze edilir: yüz bin açık satırlı bir ağaç ekranın gösterdiğini kompoze eder. Kaydıran bir sayfada duran birkaç düzine satırlık ağaç bir `PantrixTreeView`'dür.

`PantrixTreeView`'ün kardeşidir, satırları aynıdır: hangi dalların açık, hangi satırların seçili olduğu çağıranın durumudur (`expanded`, `selected`); bir basış `selection` nasıl diyorsa seçer, işaretler ya da açıp kapatır; çocukları henüz gelmemiş bir dal, anahtarı `loading`'deyken dönen bir gösterge gösterir; `filter` onu taşıyanı işaretleyerek ve durduğu dallarla gösterir. Bir düğümün biçimli etiketi, stilin etiketler için yazısı, `trailing`'in her satırın sonuna çizdiği ve `rowAction`'ın orada yaptığı orada nasılsa öyledir.

**Kaydırma.** `state` satırların nereye kaydığını tutar: `state.scrollToKey(key)` görünen bir satırı görünüme getirir; okuyucunun bir belgenin metninde seçtiğini ya da bir aramanın bulduğunu. Açılan ve kapanan dallar temanın hareketiyle gelip gider, altlarındaki satırlar onunla aşağı yukarı kayar.

**Klavyeyle** Tab için tek duraktır: odağın en son durduğu satır görünürdeyse o, değilse görünürdeki seçili satır ya da görünürdeki ilk satır; çünkü odak gözden uzak bir satıra gönderilmez. Oklar, Home ve End, harfler ve `*` satırlarda kardeşindeki gibi gezer, ağaç vardıkları satıra kayar. Enter ve Space satıra basar, Shift+Enter satırın eylemini çalıştırır.

**Ekran okuyucuya** bir satır, temanın sözleriyle etiketi, sonunda duranlar, kapalı bir dalın kaç çocuğu olduğu ve ne kadar derinde durduğudur; ağaç kayan bir listedir ve satırları durdukları sırayla okunur.

**Boyutu.** Ağaç kendisine verilen yer kadar geniştir. Verilen yere kadar açık satırları kadar uzun ya da `modifier`'ın verdiği boydadır, satırları onun içinde kayar; kaydıran bir sütunda kendi boyu verilir. Satırlarının sonunda bir kaydırma çubuğu durur.

```kotlin
var open by rememberSaveable { mutableStateOf(setOf("$")) }
var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val tree = rememberTreeViewState()
PantrixLazyTreeView(
    nodes = document,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxSize(),
    state = tree,
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "document"
)
```

Parametreler:

- `nodes: List<TreeNode>`: ağacın en üstündeki düğümler, gösterildikleri sırayla. Ağacın iki düğümü aynı anahtarı taşımaz.
- `expanded: Set<String>`: açık dalların anahtarları.
- `onExpandedChange: (Set<String>) -> Unit`: bir dal açılınca ya da kapanınca açık olması gereken anahtarlarla çağrılır. Ağaç kendiliğinden bir şey değiştirmez.
- `modifier: Modifier`: ağacın modifier'ı. Ağaç kendisine verilen yer kadar geniştir; boyu yukarıda söylenir.
- `state: TreeViewState`: satırların nereye kaydığı; onu okuyan ya da bir satırı görünüme getiren bir ekran için.
- `selection: TreeSelection`: satırların nasıl seçildiği: hiç, birer birer ya da onay kutularıyla.
- `selected: Set<String>`: seçili satırların ya da işaretlilerin anahtarları.
- `onSelectionChange: ((Set<String>) -> Unit)?`: bir basıştan sonra seçili ya da işaretli olması gereken anahtarlarla çağrılır. `null` satırları `selected`'ın tuttuğu gibi bırakır; bir satıra basmak dalını açar ya da kapatır.
- `loading: Set<String>`: çocukları yüklenen dalların anahtarları: oklarının yerinde dönen bir gösterge durur.
- `filter: String`: satırların gösterilmesi için etiketlerinin taşıması gereken, ya da hepsi için hiçbir şey.
- `guides: Boolean`: açık her dalın okundan altındakilerin boyunca soluk bir çizginin inip inmediği.
- `trailing: (@Composable RowScope.(TreeNode) -> Unit)?`: her satırın kendi düğümü için sonuna, düğümün kendi sondaki yazısından sonra çizdiği, ya da hiçbir şey için null. Satırla birlikte okunur, kendi basışını almaz.
- `style: TreeViewStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: TreeViewColors?`: bu ağacın, temanınkilerden ayrı kendi renkleri: burada verilenler, gerisi için temanınkiler.
- `rowAction: ((TreeNode) -> TreeRowAction?)?`: bir düğümün satırının seçilmekten başka yaptığı iş, ya da başka bir şey yapmayan satır için null: satırın sonunda bir simge düğmesi; bir basış onu satırı seçmeden çalıştırır, etiketi `LazyTreeView_<tagKey>.Action_<key>`'dir. Satırda Shift+Enter onu çalıştırır, ekran okuyucuya satırın eylemleri arasında sunulur.
- `tagKey: String?`: ağacın otomasyon anahtarı: ağaç `LazyTreeView_<tagKey>`, içindeki bir satır `LazyTreeView_<tagKey>.Node_<key>`, oku `LazyTreeView_<tagKey>.Twisty_<key>` olur. Bir basışın yaptığı, düğümün anahtarıyla bir `LazyTreeView` olayı olarak bildirilir: `expand`, `collapse`, `select`, `check`, `uncheck` ve bir satırın eylemi için `action`.

### PantrixLazyTreeView

`import com.pantrixui.components.data.lazytreeview.PantrixLazyTreeView`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixLazyTreeView(
    source: TreeSource,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    state: TreeViewState = rememberTreeViewState(),
    selection: TreeSelection = TreeSelection.None,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    loading: Set<String> = emptySet(),
    guides: Boolean = false,
    trailing: (@Composable RowScope.(TreeNode) -> Unit)? = null,
    style: TreeViewStyle? = null,
    colors: TreeViewColors? = null,
    rowAction: ((TreeNode) -> TreeRowAction?)? = null,
    tagKey: String? = null
)
```

Düğümlerini gösterirken `source`'tan alan bir `PantrixLazyTreeView`, bir liste olarak verilemeyecek kadar büyük bir ağaç için: yüz bin değerli bir belge, bir diskin klasörleri. Ağaç kendini dizerken yalnızca açık dalların sayıları, bir düğüm de yalnızca satırı görünmek üzereyken istenir: kaydırılıp geçilen satırlar hiç kurulmaz, yüz bin çocuklu bir dal ekrandaki satırlar kadar tutar.

`TreeNode`'ların ağacının yaptığını yapar, her düğümü okuyacak olanlar dışında: süzgeci yoktur, satırlarını birer birer seçer ya da hiç seçmez, çünkü bir onay kutusu bir dalın altında duranı söyler. Bir satırda yazılan bir harf, onunla başlayan bir etiketi sonraki iki bin satır arasında arar. `expanded`'da açılan bir dalın ve `TreeViewState.scrollToKey`'in görünüme getirdiği bir satırın nerede durduğu onu gösteren bir satırdan bilinir; yoksa kaynağa `TreeSource.indexOf`'u ile sorulur.

```kotlin
val values = remember(document) { ValuesSource(document) }
var open by rememberSaveable { mutableStateOf(setOf("$")) }
PantrixLazyTreeView(
    source = values,
    expanded = open,
    onExpandedChange = { open = it },
    modifier = Modifier.fillMaxSize(),
    tagKey = "document"
)
```

Parametreler:

- `source: TreeSource`: ağacın düğümlerini aldığı yer. Başka bir kaynak, buna eşit olmayan biri, baştan dizilen bir ağaçtır: düğümlerde değişen başka bir kaynak olarak verilir.
- `expanded: Set<String>`: açık dalların anahtarları.
- `onExpandedChange: (Set<String>) -> Unit`: bir dal açılınca ya da kapanınca açık olması gereken anahtarlarla çağrılır. Ağaç kendiliğinden bir şey değiştirmez.
- `modifier: Modifier`: ağacın modifier'ı. Ağaç verilen yer kadar geniştir; verilen yere kadar açık satırları kadar uzun ya da bunun verdiği boydadır.
- `state: TreeViewState`: satırların nereye kaydığı; onu okuyan ya da bir satırı görünüme getiren bir ekran için.
- `selection: TreeSelection`: satırların nasıl seçildiği: hiç ya da birer birer. `TreeSelection.Checkbox` reddedilir.
- `selected: Set<String>`: seçili satırların anahtarları.
- `onSelectionChange: ((Set<String>) -> Unit)?`: bir basıştan sonra seçilecek anahtarlarla çağrılır. `null` satırları `selected`'ın tuttuğu gibi bırakır, bir satıra basmak da dalını açar ya da kapatır.
- `loading: Set<String>`: çocukları yüklenen dalların anahtarları: oklarının yerinde dönen bir gösterge durur.
- `guides: Boolean`: açık her dalın okundan altındakilerin boyunca soluk bir çizginin inip inmediği.
- `trailing: (@Composable RowScope.(TreeNode) -> Unit)?`: her satırın kendi düğümü için sonuna, düğümün kendi sondaki yazısından sonra çizdiği, ya da hiçbir şey için null. Satırla birlikte okunur, kendi basışını almaz.
- `style: TreeViewStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: TreeViewColors?`: bu ağacın, temanınkilerden ayrı kendi renkleri: burada verilenler, gerisi için temanınkiler.
- `rowAction: ((TreeNode) -> TreeRowAction?)?`: bir düğümün satırının seçilmekten başka ne yaptığı, başka bir şey yapmayan bir satır için null: düğüm ağacındaki gibi, sonunda bir ikon düğmesi.
- `tagKey: String?`: ağacın otomasyon anahtarı: ağaç `LazyTreeView_<tagKey>`, içindeki bir satır `LazyTreeView_<tagKey>.Node_<key>`, oku `LazyTreeView_<tagKey>.Twisty_<key>` olur. Bir basışın yaptığı, düğüm ağacındaki gibi, bir `LazyTreeView` olayı olarak bildirilir.

### TreeViewState

`import com.pantrixui.components.data.lazytreeview.TreeViewState`, `com.pantrixui:components` içinden

```kotlin
class TreeViewState(public val listState: LazyListState = LazyListState())
```

Bir `PantrixLazyTreeView`'ün bir kompozisyondan ötekine tuttuğu, onu okuyan ya da kaydıran bir ekran için: satırlarının nereye kaydığı ve bir satırı görünüme getirmenin yolu.

```kotlin
val tree = rememberTreeViewState()
PantrixLazyTreeView(nodes = document, expanded = open, onExpandedChange = { open = it }, state = tree)
// The row the reader chose in the text, brought into view once the tree shows it.
LaunchedEffect(chosen) { tree.scrollToKey(chosen) }
```

Bir durum bir ağacındır: aynısı verilen iki ağaç birbirini kaydırırdı.

Parametreler:

- `listState: LazyListState`: Satırların içinde kaydığı listenin durumu: ne kadar kaydıkları ve hangilerinin görünürde olduğu.

Üyeleri:

- `suspend fun scrollToKey(key: String)`: `key`'in satırını hemen, en kısa yoldan ve gerektiğinden fazla gitmeden görünüme getirir: yukarıdaki bir satır üste, aşağıdaki alta gelir. Zaten görünürdeki bir satır için ve gösterilmeyen bir düğüm için hiçbir şey olmaz: kapalı bir daldaki ya da bir süzmenin dışarıda bıraktığı.

  Dalları aynı anda açılan bir satır, ağaç onlarla kompoze edildikten sonra gösterilir: ekran onu o değişikliğin bir efektinden görünüme getirir, `LaunchedEffect(key) { state.scrollToKey(key) }` gibi. Hangi satırların görünürde olduğu ağaç yerleştikten sonra bilinir: ondan önce, ağacı ilk kez gösteren ekranın efektinden istenen bir anahtar ağacın kompoze edilip yerleşmesini bekler, ve o zaman görünürde olan bir satır yerinde kalır.

### rememberTreeViewState

`import com.pantrixui.components.data.lazytreeview.rememberTreeViewState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberTreeViewState(listState: LazyListState = rememberLazyListState()): TreeViewState
```

Kaydedilen bir durumun korunduğu her şeyde, listesininki gibi korunan bir `TreeViewState`: ekranın dönmesi, başka bir ekrana gidip dönmek.

Parametreler:

- `listState: LazyListState`: satırların içinde kaydığı listenin durumu, onu kendisi tutan bir ekran için.

### TreeNode

`import com.pantrixui.components.data.treeview.TreeNode`, `com.pantrixui:components` içinden

```kotlin
class TreeNode(
    public val key: String,
    public val label: String,
    public val children: List<TreeNode> = emptyList(),
    public val icon: ImageVector? = null,
    public val trailing: String? = null,
    public val enabled: Boolean = true,
    public val hasChildren: Boolean = children.isNotEmpty(),
    public val styledLabel: AnnotatedString? = null,
    public val childCount: Int? = null,
    public val tagKey: String? = null
)
```

Bir `PantrixTreeView`'ün ya da bir `PantrixLazyTreeView`'ün bir düğümü ve onun altındaki düğümler.

```kotlin
TreeNode(
    key = "src",
    label = "src",
    icon = PantrixIcons.Folder,
    children = listOf(TreeNode(key = "src/main.kt", label = "main.kt", trailing = "4 KB"))
)
```

Parametreler:

- `key: String`: Bu düğümü ağaçtaki her düğümden ayıran şey: ağacın `expanded`'ının ve `selected`'ının onun için tuttuğu. Her dilde aynıdır, böylece çevrilmiş bir ekran aynı düğümleri açar ve seçer; bir ağaçta iki düğüm aynı anahtarı taşımaz.
- `label: String`: Satırın yazdığı ve düğümün ekran okuyucuya söylenen adı.
- `children: List<TreeNode>`: Bunun altındaki düğümler, gösterildikleri sırayla. Hiç çocuğu olmayan düğüm bir yapraktır, `hasChildren` çocuklarının daha geleceğini söylemedikçe.
- `icon: ImageVector?`: Adın önüne çizilen, ya da hiçbiri için null: bir klasör, bir dosyanın türü. Ekran okuyucu onu okumaz.
- `trailing: String?`: Satırın sonunda kısa bir yazı, ya da hiçbiri için null: düğümün kaç şey tuttuğu, bir dosyanın ne kadar büyük olduğu. Adla birlikte okunur.
- `enabled: Boolean`: Düğümün seçilip işaretlenebilip işaretlenemeyeceği. Seçilemeyen düğüm devre dışı yazının rengiyle yazılır, dalı yine açılıp kapanır.
- `hasChildren: Boolean`: Düğümün bir dal olup olmadığı: `children` henüz boşken bile oku çizilir ve açılır; açılınca bir seviyesini yükleyen ağaç için.
- `styledLabel: AnnotatedString?`: Kendi biçimleriyle `label`, ya da onu olduğu gibi çizmek için null: bir belgenin sözdizimi renkleri, kalın yazılmış bir parça. Metni `label`'ınkidir, başka bir şey değil; böylece bir süzmenin bulduğu, biçimlerinin üstüne işaretlenir. Ekran okuyucu ve süzme `label`'ı okur. Seçili satır ve seçilemeyen bir satır onun renkleri dışındaki biçimlerini korur ve onu kendi renkleriyle yazar: aynı düğüm, satır seçili olsun olmasın işini görür. `background`'u olan bir biçim, uygulamanın kendi işareti, orada da rengini korur: dolgusunun üstünde okunan renk odur.
- `childCount: Int?`: Çocukları henüz gelmemiş bir dalın, düğüm biliyorsa, kaç çocuğu olacağı: ekran okuyucuya kapalı satırda, bir dalın tuttuğu çocukların sayısı gibi söylenen. Null, varsayılan, `children`'ı ya da ağacın kaynağının düğümün altında tuttuğunu sayar.
- `tagKey: String?`: Satırın otomasyon anahtarı, her dilde aynı, `key`'den başka olması gerektiğinde: satır, anahtarı olan bir ağacın etiketinin içinde `Node_<tagKey>` olur, `TreeView_files.Node_src` gibi.

Başka bir kurucu:

```kotlin
constructor(
    key: String,
    label: String,
    children: List<TreeNode> = emptyList(),
    icon: ImageVector? = null,
    trailing: String? = null,
    enabled: Boolean = true,
    hasChildren: Boolean = children.isNotEmpty(),
    tagKey: String? = null
)
```

Parametreleri:

- `key: String`
- `label: String`
- `children: List<TreeNode>`
- `icon: ImageVector?`
- `trailing: String?`
- `enabled: Boolean`
- `hasChildren: Boolean`
- `tagKey: String?`

### TreeViewStyle

`import com.pantrixui.components.data.treeview.TreeViewStyle`, `com.pantrixui:components` içinden

```kotlin
class TreeViewStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val rowHeight: Dp = Dp.Unspecified,
    public val indent: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val guideWidth: Dp = Dp.Unspecified,
    public val labelRole: TypeRole? = null
) : PantrixStyle<TreeViewStyle>
```

`PantrixTreeView`'ün ve bir `PantrixLazyTreeView`'ün geometrisi: bir satırın ne kadar yüksek olduğu, her seviyenin ne kadar içeri girdiği, okun ne kadar büyük olduğu ve etiketlerin hangi yazıyla yazıldığı.

Bir satır, ağacın yapıldığı şey olan platformun kendi listesinin satırıdır: Android'de 48dp ve iOS'ta 44pt, oralarda bir parmağa verilenin en azı; masaüstünde ve web'de 32dp, bir işaretçiye verilenin en azı. Satır hiçbir zaman platformun dokunma hedefinden alçak olmaz; dokunmayla kullanılan bir masaüstü ya da web sayfası ona bir parmağınkini verir.

Satırın yüksekliği, ara ve iç boşluk yoğunluğu izler, sözcüklerin çevresindeki yer olarak. Girinti, ikonun boyu, kılavuzların kalınlığı, şekil ve etiketlerin yazısı izlemez.

Parametreler:

- `shape: ShapeSpec`: Seçili bir satırın dolgusunun köşeleri: markanın şekil ölçeğinden bir adım ya da sabit bir şekil.
- `rowHeight: Dp`: Bir satırın en az yüksekliği. Platformun dokunma hedefinden düşükse ona çıkarılır: 36dp istenen bir satır Android'de ve dokunmayla kullanılan bir sayfada 48dp, iOS'ta 44pt, işaretçinin altında 36dp'dir. Daha büyük bir yazı onu uzatır.
- `indent: Dp`: Bir seviyenin altında durduğu seviyeden ne kadar içeri girdiği.
- `iconSize: Dp`: Okun, bir düğümün kendi ikonunun ve yüklenen bir dalın dönen göstergesinin genişliği ve yüksekliği.
- `gap: Dp`: Ok, onay kutusu, ikon, ad ve satırın sonundaki yazı arasında.
- `horizontalPadding: Dp`: Bir satırın kenarlarıyla tuttuğu şeyler arasındaki yer.
- `guideWidth: Dp`: Ağaç onları çiziyorsa açık bir daldan aşağı inen çizgilerin kalınlığı.
- `labelRole: TypeRole?`: Satırların etiketlerinin yazıldığı yazı: her platformda gövde yazısı; bir belgenin anahtarları için harf harf alt alta duran kod yazısı.

### TreeRowAction

`import com.pantrixui.components.data.treeview.TreeRowAction`, `com.pantrixui:components` içinden

```kotlin
class TreeRowAction(
    public val icon: ImageVector,
    public val label: String,
    public val onClick: () -> Unit
)
```

Bir `PantrixTreeView`'ün ya da `PantrixLazyTreeView`'ün bir satırının, verildiği düğüm için seçilmekten başka yaptığı iş: bir değerin taşıdığı bağlantıyı açmak, bir dosyayı klasöründe göstermek. Ağaç onu satırın sonunda, orada durandan sonra bir simge düğmesi olarak çizer.

- **Basış.** Düğmeye bir parmak ya da işaretçi `onClick`'i çalıştırır ve satırı seçmez.

- **Klavye.** Odaktaki satırda Shift+Enter onu çalıştırır: ağaç Tab için tek durak kalır, oklar satırlarda eskisi gibi gezer.

- **Ekran okuyucu.** Satır onu kendi eylemlerinden biri olarak, `label` adıyla sunar; düğme satırdan ayrı okunmaz.

```kotlin
PantrixLazyTreeView(
    nodes = document,
    expanded = open,
    onExpandedChange = { open = it },
    rowAction = { node ->
        links[node.key]?.let { address -> TreeRowAction(PantrixIcons.ExternalLink, "Open link") { open(address) } }
    }
)
```

Parametreler:

- `icon: ImageVector`: Düğmenin çizdiği.
- `label: String`: Eylemin adı: düğmenin adı ve ekran okuyucunun satırda sunduğu eylem.
- `onClick: () -> Unit`: Eylemin yaptığı.

### TreeSource

`import com.pantrixui.components.data.lazytreeview.TreeSource`, `com.pantrixui:components` içinden

```kotlin
interface TreeSource
```

Bir `PantrixLazyTreeView`'in düğümlerini gösterirken aldığı yer, bir liste olarak verilemeyecek kadar büyük bir ağaç için: yüz bin değerli bir belge, bir diskin klasörleri. Ağaç her açık dalın altında kaç düğüm durduğunu sorar, bir düğümü de yalnızca satırı görünmek üzereyken ister: kaydırılıp geçilen satırlar hiç kurulmaz.

```kotlin
class ValuesSource(private val document: Value) : TreeSource {
    override fun childCount(parent: TreeNode?): Int = valueOf(parent).children.size
 
    override fun childAt(parent: TreeNode?, index: Int): TreeNode = nodeOf(valueOf(parent).children[index])
}
```

Bir kaynak her sorulduğunda bir düğüm için aynı şeyi söyler. Değişen, düzenlenen bir belge, yüklenen bir seviye, ağaca başka bir kaynak olarak, buna eşit olmayan biri olarak verilir: `remember(document) { ValuesSource(document) }`. Düğümlerinin anahtarları bir düğüm ağacındakiler gibidir, her dilde aynı ve hiçbiri bir diğeri gibi değil; ağaç onları denetlemek için bütün kaynağı dolaşmaz. Bir düğümün kendi `TreeNode.children`'ı okunmaz: altında duran kaynağındır, `TreeNode.hasChildren`'ı da onun bir dal olduğunu söyler.

Üyeleri:

- `fun childCount(parent: TreeNode?): Int`: `parent`'ın altında, `parent` null ise en üstte kaç düğüm durduğu. Ağaç kendini dizerken her açık daldan, ekran okuyucuya söylenecek olan için de kapalı bir daldan sorulur.
- `fun childAt(parent: TreeNode?, index: Int): TreeNode`: `parent`'ın altındakilerin, `parent` null ise en üsttekilerin `index`'teki düğümü, 0'dan ve `childCount`'un altından sayılarak.
- `fun indexOf(parent: TreeNode?, key: String): Int`: `key`'in düğümünün `parent`'ın altındakiler, `parent` null ise en üsttekiler arasında nerede durduğu: sırası, hiçbiri değilse -1. Ağaç bunu henüz göstermediği bir anahtar için, `expanded`'da açılan bir dal ya da `TreeViewState.scrollToKey`'in görünüme getirdiği bir satır için, nerede durduğunu bulmak üzere sorar. Varsayılan olarak `parent`'ın altındaki düğümleri `childAt` ile dolaşır; çok düğümlü bir kaynak bunu anahtardan yanıtlar, `$[2048]` anahtarı sırasını söylediği gibi.

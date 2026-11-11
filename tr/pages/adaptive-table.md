# Tablo

Örnek vaka: bir sipariş tablosu. Yer genişken sütunlu düz bir tablo, dar yerde kartlardan bir liste.

Bu bir ekran değil bileşendir, o yüzden pencereye değil kendisine verilen yere bakar. Aynı tablo geniş bir pencerede dar bir panelin içine konabilir; pencereye sorsaydı orada da tablo çizer ve sığmazdı. Bileşen kendi yerini `BoxWithPantrixWindow` ile öğrenir: kutu, içeriğine verilen yeri bir pencere gibi söyler ve bir ekranın pencereye sorduğu her şeyi kutu için cevaplar.

## Özellikler

- **Kendi yeri.** `BoxWithPantrixWindow(modifier) { box -> ... }` içeriğine alabileceği en fazla yeri söyler: altında `BoxWithConstraints` vardır, söylediği onun `maxWidth` ve `maxHeight`'ıdır.
- **Aynı yardımcılar.** `box` bir `PantrixWindow`'dur: `box.isNarrow`, `box.byWidth(...)`, `box.widthClass >= WindowWidthClass.Expanded`. Ekran pencereye ne soruyorsa bileşen kutusuna onu sorar.
- **Pencerenin sınırları.** Kutu, temanın penceresi hangi sınırlarla sınıflanıyorsa onlarla sınıflanır; bileşenin kendi eşikleri `breakpoints` ile verilir.
- **Gereksiz yere kurulmaz.** Kutunun bir sınıfını okuyan içerik o sınıf değişince yeniden kurulur, `BoxWithConstraints`'in içeriği gibi her boyutta değil. `size` okuyan her değişimi izler.
- **Yükseklik pencereden.** Kaydırılan bir sayfada kutunun alabileceği yüksekliğin sonu yoktur: yükseklik sınıfı `Expanded` okunur ve kutu hiçbir zaman kısa değildir. Genişlik kutuya, yükseklik pencereye sorulur.
- **Kutu düzdür.** Kat yeri pencerenindir: duruş pencereye sorulur. Kutuyu nerede kestiğini `rememberFoldsInNode()` söyler; "İki panel" sayfası onu anlatır.
- **Kutunun ölçüleri.** `PantrixTheme.layout(box)` kenar boşluğunu ve sütun arasını pencerenin değil kutunun sınıfına göre verir.
- **İçindekilere pencere olarak.** Kutunun içinde `PantrixTheme.window` ve `responsive` yine pencereye sorar; her şey kutuya sorsun istenirse kutu `LocalPantrixWindow` ile içeriğe verilir.
- **İçeriğin yeri.** `contentAlignment` kutudan küçük içeriği yerleştirir; `propagateMinConstraints` içeriği en az kutunun en küçük boyutu kadar yapar.
- **Ölçülürken kurulur.** `BoxWithConstraints` gibi içeriğini ölçülürken kurar: `IntrinsicSize` ile boyutlanan bir satırın ya da sütunun içine konmaz.

## Örnekler

### Aynı bileşen, iki ayrı yerde

`OrdersTable` iki kez durur: sayfanın genişliğinde ve 280 dp'lik bir kutuda. Bileşen pencereye değil kendi kutusuna sorar (`box.isNarrow`): 600 dp'den dar yerde liste, 600 dp'den itibaren tablodur. Tarih sütunu 840 dp'den itibaren görünür.

Telefonda ikisi de listedir. Telefonu çevirince ya da pencereyi genişletince üstteki, kendisine 600 dp kaldığında tabloya döner; alttaki liste kalır. Karttaki pencere seçicisi aynı şeyi pencereye dokunmadan gösterir: "Dar"da ikisi de listedir, "Geniş"te üstteki tablo, alttaki listedir. "Gerçek"te üstteki, pencere `Medium` okurken de liste olabilir: yan menü ve sayfanın kenarları pencerenin genişliğinden pay alır. Pencereye sorsaydı kalan o dar yere tablo dizerdi.

Seçili sipariş bileşenin dışında, iki görünümün üstünde tutulur: içlerinde dursaydı görünüm değişince kaybolurdu. Alttaki listede bir karta bas: aynı sipariş üstteki görünümde de seçilidir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

var selectedId by rememberSaveable { mutableStateOf<String?>(null) }
PantrixText(text = "Sayfanın genişliğinde", style = PantrixTheme.typography.label)
OrdersTable(
    orders = ORDERS,
    selectedId = selectedId,
    onSelect = { selectedId = it },
    modifier = Modifier.fillMaxWidth(),
    tagKey = "page"
)
PantrixText(text = "Aynı bileşen, 280 dp'lik bir kutuda", style = PantrixTheme.typography.label)
OrdersTable(
    orders = ORDERS,
    selectedId = selectedId,
    onSelect = { selectedId = it },
    modifier = Modifier.width(280.dp),
    tagKey = "box"
)
PantrixText(text = "Seçili sipariş: ${selectedId?.let { "#$it" } ?: "yok"}", tagKey = "selected_order")

@Composable
internal fun OrdersTable(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    tagKey: String = "orders"
) {
    // Bileşenin kendi kutusu, pencere gibi. İçerik kutunun boyutu her değiştiğinde değil, burada okunan genişlik
    // sınıfı değiştiğinde yeniden kurulur.
    BoxWithPantrixWindow(modifier = modifier) { box ->
        if (box.isNarrow) {
            OrderList(orders, selectedId, onSelect, tagKey)
        } else {
            // Orta genişlikte dört sütun; tarih, Expanded'dan itibaren beşinci sütundur.
            OrderGrid(orders, selectedId, onSelect, tagKey, showDate = box.widthClass >= WindowWidthClass.Expanded)
        }
    }
}

@Composable
private fun OrderList(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String
) {
    val spacing = PantrixTheme.spacing
    Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
        orders.forEach { order ->
            PantrixCard(
                modifier = Modifier.fillMaxWidth(),
                // Seçili kartın zemini dolar: seçim iki görünümde de görünür.
                variant = if (order.id == selectedId) CardVariant.Filled else CardVariant.Outlined,
                onClick = { onSelect(order.id) },
                contentPadding = PaddingValues(spacing.md),
                tagKey = "${tagKey}_card_${order.id}"
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = order.customer,
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.label
                    )
                    PantrixText(text = order.total)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = "#${order.id} · ${order.date}",
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.footnote,
                        color = PantrixTheme.colors.textSecondary
                    )
                    PantrixChip(label = order.status, onClick = null)
                }
            }
        }
    }
}

@Composable
private fun OrderGrid(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String,
    showDate: Boolean
) {
    val colors = PantrixTheme.colors
    PantrixSurface(border = colors.border, shape = PantrixTheme.shapes.md) {
        Column {
            OrderRow(modifier = Modifier.testTag("${tagKey}_header")) {
                HeaderCell("Sipariş", weight = ID_WEIGHT)
                HeaderCell("Müşteri", weight = CUSTOMER_WEIGHT)
                if (showDate) HeaderCell("Tarih", weight = DATE_WEIGHT)
                HeaderCell("Durum", weight = STATUS_WEIGHT)
                HeaderCell("Tutar", weight = TOTAL_WEIGHT, align = TextAlign.End)
            }
            orders.forEach { order ->
                val selected = order.id == selectedId
                PantrixHorizontalDivider()
                OrderRow(
                    modifier = Modifier
                        .testTag("${tagKey}_row_${order.id}")
                        .selectable(selected = selected, onClick = { onSelect(order.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    Cell("#${order.id}", weight = ID_WEIGHT, color = text)
                    Cell(order.customer, weight = CUSTOMER_WEIGHT, color = text)
                    if (showDate) Cell(order.date, weight = DATE_WEIGHT, color = text)
                    Cell(order.status, weight = STATUS_WEIGHT, color = text)
                    Cell(order.total, weight = TOTAL_WEIGHT, color = text, align = TextAlign.End)
                }
            }
        }
    }
}

@Composable
private fun OrderRow(
    modifier: Modifier = Modifier,
    cells: @Composable RowScope.() -> Unit
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = PantrixTheme.spacing.md, vertical = PantrixTheme.spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically,
        content = cells
    )
}

@Composable
private fun RowScope.HeaderCell(
    text: String,
    weight: Float,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(
        text = text,
        modifier = Modifier.weight(weight),
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        textAlign = align,
        maxLines = 1
    )
}

@Composable
private fun RowScope.Cell(
    text: String,
    weight: Float,
    color: Color,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(text = text, modifier = Modifier.weight(weight), color = color, textAlign = align, maxLines = 1)
}

private const val ID_WEIGHT = 0.8f

private const val CUSTOMER_WEIGHT = 2f

private const val DATE_WEIGHT = 1.2f

private const val STATUS_WEIGHT = 1.4f

private const val TOTAL_WEIGHT = 1f

internal data class Order(
    val id: String,
    val customer: String,
    val date: String,
    val status: String,
    val total: String
)

internal val ORDERS = listOf(
    Order("1042", "Ayşe Yılmaz", "02.10.2026", "Hazırlanıyor", "1.240 TL"),
    Order("1041", "Mehmet Demir", "02.10.2026", "Kargoda", "380 TL"),
    Order("1040", "Zeynep Kaya", "01.10.2026", "Teslim edildi", "2.915 TL"),
    Order("1039", "Can Öztürk", "30.09.2026", "Teslim edildi", "640 TL"),
    Order("1038", "Elif Şahin", "29.09.2026", "İptal", "95 TL")
)
```

### Genişliği seçilen kutu

Bileşenin üç hâli, pencereye dokunmadan: kutunun genişliği seçilir. 320 dp'de liste, 700 dp'de dört sütunlu tablo, 900 dp'de tarih sütunuyla beş sütun. Kutu ekrandan genişse yana kaydırılır.

Pencere hiç değişmedi; değişen, bileşene verilen yerdir. Listeyi `box.isNarrow`, tarih sütununu `box.widthClass >= WindowWidthClass.Expanded` seçer. Bir satır seç ve genişliği değiştir: seçim kalır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

var width by rememberSaveable { mutableIntStateOf(320) }
var selectedId by rememberSaveable { mutableStateOf<String?>(null) }
PantrixSegmentButton(
    options = listOf(
        SegmentOption(value = 320, label = "320 dp", tagKey = "320"),
        SegmentOption(value = 700, label = "700 dp", tagKey = "700"),
        SegmentOption(value = 900, label = "900 dp", tagKey = "900")
    ),
    selected = width,
    onSelect = { width = it },
    tagKey = "box_width"
)
HorizontalScrollFrame {
    OrdersTable(
        orders = ORDERS,
        selectedId = selectedId,
        onSelect = { selectedId = it },
        modifier = Modifier.width(width.dp),
        tagKey = "sized"
    )
}

@Composable
internal fun OrdersTable(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    modifier: Modifier = Modifier,
    tagKey: String = "orders"
) {
    // Bileşenin kendi kutusu, pencere gibi. İçerik kutunun boyutu her değiştiğinde değil, burada okunan genişlik
    // sınıfı değiştiğinde yeniden kurulur.
    BoxWithPantrixWindow(modifier = modifier) { box ->
        if (box.isNarrow) {
            OrderList(orders, selectedId, onSelect, tagKey)
        } else {
            // Orta genişlikte dört sütun; tarih, Expanded'dan itibaren beşinci sütundur.
            OrderGrid(orders, selectedId, onSelect, tagKey, showDate = box.widthClass >= WindowWidthClass.Expanded)
        }
    }
}

internal val ORDERS = listOf(
    Order("1042", "Ayşe Yılmaz", "02.10.2026", "Hazırlanıyor", "1.240 TL"),
    Order("1041", "Mehmet Demir", "02.10.2026", "Kargoda", "380 TL"),
    Order("1040", "Zeynep Kaya", "01.10.2026", "Teslim edildi", "2.915 TL"),
    Order("1039", "Can Öztürk", "30.09.2026", "Teslim edildi", "640 TL"),
    Order("1038", "Elif Şahin", "29.09.2026", "İptal", "95 TL")
)

@Composable
private fun OrderList(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String
) {
    val spacing = PantrixTheme.spacing
    Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
        orders.forEach { order ->
            PantrixCard(
                modifier = Modifier.fillMaxWidth(),
                // Seçili kartın zemini dolar: seçim iki görünümde de görünür.
                variant = if (order.id == selectedId) CardVariant.Filled else CardVariant.Outlined,
                onClick = { onSelect(order.id) },
                contentPadding = PaddingValues(spacing.md),
                tagKey = "${tagKey}_card_${order.id}"
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = order.customer,
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.label
                    )
                    PantrixText(text = order.total)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    PantrixText(
                        text = "#${order.id} · ${order.date}",
                        modifier = Modifier.weight(1f),
                        style = PantrixTheme.typography.footnote,
                        color = PantrixTheme.colors.textSecondary
                    )
                    PantrixChip(label = order.status, onClick = null)
                }
            }
        }
    }
}

@Composable
private fun OrderGrid(
    orders: List<Order>,
    selectedId: String?,
    onSelect: (String) -> Unit,
    tagKey: String,
    showDate: Boolean
) {
    val colors = PantrixTheme.colors
    PantrixSurface(border = colors.border, shape = PantrixTheme.shapes.md) {
        Column {
            OrderRow(modifier = Modifier.testTag("${tagKey}_header")) {
                HeaderCell("Sipariş", weight = ID_WEIGHT)
                HeaderCell("Müşteri", weight = CUSTOMER_WEIGHT)
                if (showDate) HeaderCell("Tarih", weight = DATE_WEIGHT)
                HeaderCell("Durum", weight = STATUS_WEIGHT)
                HeaderCell("Tutar", weight = TOTAL_WEIGHT, align = TextAlign.End)
            }
            orders.forEach { order ->
                val selected = order.id == selectedId
                PantrixHorizontalDivider()
                OrderRow(
                    modifier = Modifier
                        .testTag("${tagKey}_row_${order.id}")
                        .selectable(selected = selected, onClick = { onSelect(order.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    Cell("#${order.id}", weight = ID_WEIGHT, color = text)
                    Cell(order.customer, weight = CUSTOMER_WEIGHT, color = text)
                    if (showDate) Cell(order.date, weight = DATE_WEIGHT, color = text)
                    Cell(order.status, weight = STATUS_WEIGHT, color = text)
                    Cell(order.total, weight = TOTAL_WEIGHT, color = text, align = TextAlign.End)
                }
            }
        }
    }
}

internal data class Order(
    val id: String,
    val customer: String,
    val date: String,
    val status: String,
    val total: String
)

@Composable
private fun OrderRow(
    modifier: Modifier = Modifier,
    cells: @Composable RowScope.() -> Unit
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = PantrixTheme.spacing.md, vertical = PantrixTheme.spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically,
        content = cells
    )
}

@Composable
private fun RowScope.HeaderCell(
    text: String,
    weight: Float,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(
        text = text,
        modifier = Modifier.weight(weight),
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        textAlign = align,
        maxLines = 1
    )
}

@Composable
private fun RowScope.Cell(
    text: String,
    weight: Float,
    color: Color,
    align: TextAlign = TextAlign.Start
) {
    PantrixText(text = text, modifier = Modifier.weight(weight), color = color, textAlign = align, maxLines = 1)
}

private const val ID_WEIGHT = 0.8f

private const val CUSTOMER_WEIGHT = 2f

private const val DATE_WEIGHT = 1.2f

private const val STATUS_WEIGHT = 1.4f

private const val TOTAL_WEIGHT = 1f
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `HorizontalScrollFrame`: Yana kayan bir çerçeve: içeriği yerine sığmadığında altında bir kaydırma çubuğu çizer.

### Kutunun sınırları

Kutu, temanın penceresi hangi sınırlarla sınıflanıyorsa onlarla sınıflanır: ürün pencereye kendi sınırlarını verdiyse bileşenleri de onlara uyar, bir şey yazmak gerekmez. Bileşenin kendi eşikleri varsa `breakpoints` ile verilir.

İki kutu da 240 dp genişliğindedir. İlki pencerenin sınırlarıyla sınıflanır ve `Compact`'tır. İkincisine `Medium`'u 200 dp'de başlayan sınırlar verildi: aynı genişlikte `Medium` okunur ve dar değildir. Pencerenin boyutu ikisini de değiştirmez.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.PantrixBreakpoints
import com.pantrixui.foundation.theme.PantrixTheme

val frame = Modifier.width(240.dp).border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
BoxWithPantrixWindow(modifier = frame) { box ->
    PantrixText(
        text = "Pencerenin sınırlarıyla: ${box.widthClass.name}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_window_breakpoints"
    )
}
BoxWithPantrixWindow(modifier = frame, breakpoints = PantrixBreakpoints(medium = 200.dp)) { box ->
    PantrixText(
        text = "Medium 200 dp'de başlarsa: ${box.widthClass.name}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_own_breakpoints"
    )
}
```

### Genişlik kutudan, yükseklik pencereden

Kaydırılan bir sayfanın içinde bir kutunun alabileceği yüksekliğin sonu yoktur: yükseklik sınıfı `Expanded` okunur ve `box.isShort` hiçbir zaman true olmaz. Bu yüzden bileşen genişliği kutusuna, yüksekliği pencereye sorar.

İlk kutu bu sayfanın içinde, yüksekliği verilmeden durur. İkincisine 72 dp yükseklik verildi: yüksekliği sınırlı bir kutu kendi yüksekliğini söyler ve kısadır. Son satır pencerenin cevabıdır: yatay tutulan bir telefonda ya da 480 dp'den kısa bir pencerede evet yazar. Karttaki pencere seçicisinden "Kısa"yı seç: son satır değişir, iki kutunun cevabı değişmez.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val frame = Modifier.fillMaxWidth().border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
BoxWithPantrixWindow(modifier = frame) { box ->
    PantrixText(
        text = "Yüksekliği verilmeyen kutu: ${box.heightClass.name}, isShort: " +
            if (box.isShort) "evet" else "hayır",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_free_height"
    )
}
BoxWithPantrixWindow(modifier = frame.height(72.dp)) { box ->
    PantrixText(
        text = "72 dp'lik kutu: ${box.heightClass.name}, isShort: " + if (box.isShort) "evet" else "hayır",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        tagKey = "box_fixed_height"
    )
}
val window = PantrixTheme.window
PantrixText(
    text = "Pencere: ${window.heightClass.name}, isShort: " + if (window.isShort) "evet" else "hayır",
    tagKey = "window_height"
)
```

### Kutunun ölçüleri

`PantrixTheme.layout` ölçüleri pencerenin sınıfına göre verir. Kendi kutusuna bakan bir bileşen `PantrixTheme.layout(box)` diye sorar ve kutunun sınıfının ölçülerini alır: kutunun yeri pencereninki değildir.

Kutu 240 dp genişliğindedir, içindeki iki dikdörtgenin arası onun sütun arasıdır. Altındaki satırlar ikisini yan yana yazar: 840 dp'den itibaren pencerenin sütun arası büyür, kutununki aynı kalır. Ondan dar bir pencerede ikisi eşittir. Karttaki pencere seçicisinden "Dar" ve "Geniş"i dene: yalnızca pencereninki değişir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

BoxWithPantrixWindow(modifier = Modifier.width(240.dp)) { box ->
    val gutter = PantrixTheme.layout(box).gutter
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        Row(horizontalArrangement = Arrangement.spacedBy(gutter)) {
            repeat(2) {
                PantrixSurface(
                    modifier = Modifier.weight(1f).height(48.dp),
                    color = PantrixTheme.colors.neutral.container
                ) {}
            }
        }
        PantrixText(text = "Kutunun sütun arası: ${gutter.value.roundToInt()} dp", tagKey = "box_gutter")
        PantrixText(
            text = "Pencerenin sütun arası: ${PantrixTheme.layout.gutter.value.roundToInt()} dp",
            tagKey = "window_gutter"
        )
    }
}
```

### Kutuyu içindekilere pencere olarak vermek

Kutunun içinde `PantrixTheme.window` ve `responsive(...)` yine pencereye sorar. İçteki her şey kutuya sorsun isteniyorsa, içeriği kendi başına bir ekran olan bir panelde olduğu gibi, kutu içeriğe pencere olarak verilir: `CompositionLocalProvider(LocalPantrixWindow provides box)`.

Kutu 240 dp genişliğindedir. İlk satır `responsive`'i olduğu gibi çağırır: cevabı pencereninkidir. İkincisi kutu verildikten sonra çağırır: cevabı kutununkidir, dar. Dar bir pencerede iki satır aynı şeyi yazar; farkı görmek için karttaki pencere seçicisinden "Geniş"i seç, telefonu çevir ya da pencereyi en az 600 dp genişliğinde yap.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.adaptive.LocalPantrixWindow
import com.pantrixui.foundation.adaptive.responsive
import com.pantrixui.foundation.theme.PantrixTheme

BoxWithPantrixWindow(modifier = Modifier.width(240.dp)) { box ->
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixText(
            text = "Pencereye sorar: ${responsive(compact = "dar", medium = "geniş")}",
            tagKey = "asks_window"
        )
        CompositionLocalProvider(LocalPantrixWindow provides box) {
            PantrixText(
                text = "Kutuya sorar: ${responsive(compact = "dar", medium = "geniş")}",
                tagKey = "asks_box"
            )
        }
    }
}
```

### İçeriğin kutudaki yeri

`contentAlignment` kutudan küçük içeriği kutunun içinde yerleştirir: ilk kutuda yazı ortadadır. `propagateMinConstraints` kutunun en küçük boyutunu içeriğe de verir: ikinci kutunun yüksekliği 72 dp'dir ve içindeki yüzey, kendisine bir boyut verilmediği hâlde, kutuyu doldurur.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow
import com.pantrixui.foundation.theme.PantrixTheme

val frame = Modifier
    .fillMaxWidth()
    .height(72.dp)
    .border(1.dp, PantrixTheme.colors.border, PantrixTheme.shapes.md)
BoxWithPantrixWindow(modifier = frame, contentAlignment = Alignment.Center) { box ->
    PantrixText(text = "Ortadaki içerik, ${box.widthClass.name} bir kutuda", tagKey = "box_centered")
}
BoxWithPantrixWindow(modifier = frame, propagateMinConstraints = true) { box ->
    PantrixSurface(color = PantrixTheme.colors.primary.container) {
        PantrixText(
            text = "Kutuyu dolduran içerik, ${box.widthClass.name} bir kutuda",
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            tagKey = "box_filled"
        )
    }
}
```

## API

### BoxWithPantrixWindow

`import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun BoxWithPantrixWindow(
    modifier: Modifier = Modifier,
    contentAlignment: Alignment = Alignment.TopStart,
    propagateMinConstraints: Boolean = false,
    breakpoints: PantrixBreakpoints = LocalPantrixWindow.current.breakpoints,
    content: @Composable (box: PantrixWindow) -> Unit
)
```

İçeriğine, kendisine verilen yeri bir pencere gibi söyleyen kutu: pencereye göre değil, kendi yerine göre değişen bir bileşen içindir. Dar yerde liste olan bir tablo kendi kutusuna sorar, çünkü geniş bir pencerenin dar bir panelinde pencere yine geniştir:

```kotlin
BoxWithPantrixWindow(modifier) { box ->
    val withDate = box.widthClass >= WindowWidthClass.Expanded
    if (box.isNarrow) OrderList(orders) else OrderTable(orders, withDate)
}
```

Kutunun altında `BoxWithConstraints` vardır ve söylediği, alabileceği en fazla yerdir: onun `maxWidth` ve `maxHeight`'ı. Bir ekran pencereye ne soruyorsa `content` de kendisine verilen pencereye onu sorar: `isNarrow`, `byWidth`, `widthClass >= …`.

- Kutu `breakpoints` ile sınıflanır; verilmezse bunlar geçerli pencerenin sınırlarıdır: penceresini kendi sınırlarıyla sınıflayan bir ürünün bileşenleri de aynı sınırlarla sınıflanır.

- Kutunun bir sınıfını okuyan, o sınıf değişince yeniden kurulur; `BoxWithConstraints`'in içeriği gibi her boyutta değil. `size`'ını okuyan her değişimi izler. Yeri değişirken kutu aynı nesnedir.

- Kaydırılan bir sayfanın içinde bir kutunun alabileceği yüksekliğin sonu yoktur: yükseklik sınıfı Expanded'dır ve kutu hiçbir zaman kısa değildir. Genişlik kutuya, yükseklik pencereye sorulur.

- Kutu düzdür. Kat yeri pencerenindir ve kutuyu nerede kestiği burada bilinmez: pencereye sorulur.

- Kutunun içinde `PantrixTheme.window` ve `responsive` yine pencereye sorar. İçteki her şeyin kutuya sorması isteniyorsa, içeriği kendi başına bir ekran olan bir panelde olduğu gibi, kutu içeridekilere aktarılır: `CompositionLocalProvider(LocalPantrixWindow provides box) { … }`.

`BoxWithConstraints` gibi kutu da içeriğini ölçülürken kurar, bu yüzden ona intrinsic boyutu sorulamaz: `IntrinsicSize` ile boyutlanan bir satırın ya da sütunun içine konmaz.

Parametreler:

- `modifier: Modifier`: Kutunun kendi modifier'ı. Kutunun söylediği yer, bu modifier'ın ona bıraktığı yerdir.
- `contentAlignment: Alignment`: İçerik kutudan küçükse kutunun içinde nereye yerleştirildiği.
- `propagateMinConstraints: Boolean`: İçeriğin en az kutunun en küçük boyutu kadar büyük olup olmayacağı.
- `breakpoints: PantrixBreakpoints`: Kutunun sınıflandığı sınırlar.
- `content: @Composable (box: PantrixWindow) -> Unit`: Kutunun içeriği; yer ona bir pencere olarak verilir.

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixWindow
```

İçeriğin çizildiği pencere, bir düzenin bilmesi gereken hâliyle: ne kadar geniş ve ne kadar yüksek olduğu, cihazının nasıl katlandığı. `PantrixTheme` onu sağlar, `PantrixTheme.window` okur: kurulumu yoktur.

Cihaz ya da ekran değil, penceredir: bölünmüş ekranın yarısındaki, boyutu değiştirilmiş bir masaüstü penceresindeki ya da bir tarayıcı sekmesindeki uygulama o kadar geniştir. Bir düzen boyuta değil sınıfa sorar:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

Tema durduğu sürece pencere tek bir nesnedir ve değerleri sorulduğunda okunur. `widthClass` ya da `heightClass` okuyan, sınıf değişince yeniden kurulur, daha önce değil. `size` okuyan her değişimi izler: bir dönüşün her karesini, sürüklenen pencere kenarının her pikselini.

Kendi başına bir panel olan bileşen, bir scaffold ya da bir sheet, pencereye sormaz, kendisine verilen yeri ölçer: dar bir panelin içinde pencere yine geniştir. `BoxWithPantrixWindow` bir bileşene o yeri bir pencere olarak söyler.

Masaüstünde ve web'de içerik ilk kez kurulurken pencerenin henüz boyutu yoktur ve o tek kompozisyon Compact bir pencere bulur. Android ve iOS boyutu baştan söyler. Sınıf kullanıldığı yerde okunur, başta ne olduğu saklanmaz.

Üyeleri:

- `size: DpSize`: Pencerenin boyutu. Android'de sistem çubuklarıyla birlikte penceredir, web'de uygulamanın çizildiği kutu. Platform söyleyene kadar sıfırdır ya da belirtilmemiştir: sınıflar o zamana kadar Compact'tır.
- `isSizeKnown: Boolean`: Platform pencerenin boyutunu söyledi mi: hem genişliğini hem yüksekliğini.

  Android'de ve iOS'ta ilk kompozisyondan itibaren true'dur. Masaüstünde ve web'de ilk kompozisyonda false'tur: içerik orada pencerenin boyutu gelmeden bir kez kurulur. Sonraki kompozisyondan itibaren true'dur. O zamana kadar pencere iki yönde de Compact okunur, bu yüzden bir kez verilip saklanan her karar, bir başlangıç sayfası ya da hatırlanan bir seçim, bunu bekler:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  Okuyan, cevap değişince yeniden kurulur; pencere boyut değiştirirken kurulmaz.
- `widthClass: WindowWidthClass`: Pencerenin genişlik sınıfı: düzen buna göre seçilir.
- `heightClass: WindowHeightClass`: Pencerenin yükseklik sınıfı: `WindowHeightClass.Compact` yatay tutulan bir telefondur.
- `posture: WindowPosture`: Pencerenin cihazının nasıl katlandığı. Kat yeri olmayan yerde `WindowPosture.Flat`'tir.
- `verticalBar: WindowVerticalBar?`: Sistemin pencerenin bir kenarı boyunca dik duran bar'lar için ayırdığı sütun, ya da ayırmadığı yerde null: iPhone Duo'nun dış ekranı dışında her ekranda olduğu gibi. Yerleri pencerenin koordinatlarındadır: bir düzen onun kendi yanında nerede durduğunu `rememberVerticalBarInNode` ile sorar.
- `breakpoints: PantrixBreakpoints`: Bu pencerenin sınıflarının başladığı yer: pencerenin sınıflandığı sınırlar. Elle sınıflanan bir boyut da aynı sınırlara uyar, `BoxWithPantrixWindow`'un bir bileşene verilen yeri sınıflaması gibi:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

Değerleri sabit bir pencere, gerçeğinin doğru cevabı vermediği yerler için: bir düzenin belli bir boyuttaki testi ya da önizlemesi ve native bir ekranın bir parçasına gömülen Compose. Orada yer o parçanındır.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

Pikselle verilen bir `verticalBar`, sistemin sütunu olan bir ekranın, iPhone Duo'nun dış ekranının nasıl göründüğünü, sütunun olmadığı yerde çizer.

Parametreler:

- `size: DpSize`: pencerenin boyutu; genişlik ve yükseklik sınıfları ondan gelir.
- `posture: WindowPosture`: pencerenin cihazının nasıl katlandığı: bir kat verilmedikçe düz, katı olmayan her cihaz gibi.
- `breakpoints: PantrixBreakpoints`: her sınıfın başladığı genişlikler ve yükseklikler: ürünün kendi sınırları yoksa Android'in pencere boyutu sınıfları.
- `verticalBar: WindowVerticalBar?`

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Pencere dar mı: genişlik sınıfı `WindowWidthClass.Compact` mı. Dikey tutulan telefon böyledir. Tek panelli ve gezinmesi altta olan düzenin sorusudur.

`widthClass == WindowWidthClass.Compact` için bir addır, kod uyduğu kural gibi okunsun diye: `if (window.isNarrow) BottomBar()`. "Şu genişlikten itibaren" için sınıf karşılaştırılır: `widthClass >= Expanded`.

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isShort: Boolean
```

Pencere kısa mı: yükseklik sınıfı `WindowHeightClass.Compact` mı. Yatay tutulan telefon böyledir. Böyle bir pencere çoğu zaman geniştir, genişliğine göre Medium ya da Expanded'dır, ama bar'ları üst üste dizecek yüksekliği yoktur: ana eylem alttaki bir bar'a değil başlığa gider ve alt kenardan hiçbir şey açılmaz.

`heightClass == WindowHeightClass.Compact` için bir addır:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

Bu pencerenin genişlik sınıfı için verilen değer. Verilmeyen sınıf bir küçüğünün değerini alır, bu yüzden bir düzen yalnızca değiştiği genişlikleri yazar:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parametreler:

- `compact: T`: Compact bir pencerede, en dar sınıfta değer.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede değer; verilmezse `medium`'unki.
- `large: T`: Large bir pencerede değer; verilmezse `expanded`'ınki.
- `extraLarge: T`: ExtraLarge bir pencerede, en geniş sınıfta değer; verilmezse `large`'ınki.

### LocalPantrixWindow

`import com.pantrixui.foundation.adaptive.LocalPantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixWindow: ProvidableCompositionLocal<PantrixWindow>
```

Geçerli pencere: en yakın `PantrixTheme`'in sağladığı pencere. Çevrede tema yoksa Compose'un bildirdiği penceredir, varsayılan sınırlarla sınıflanır ve düzdür.

`PantrixTheme.window` onu okur. Ekranın bir parçasına ikinci bir tema olmadan kendi penceresini vermek için sağlanır: içeriği panelin genişliğine bakması gereken bir panele.

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowWidthClass
```

Bir pencerenin ne kadar geniş olduğu, beş sınıftan biri olarak. Bir düzen bu sınıfa göre seçer: gezinmesinin biçimini, panel sayısını, bir ızgaranın sütunlarını.

Sınıflar sıralıdır, bu yüzden bir genişlikten itibaren geçerli olan kural bir karşılaştırmadır: `widthClass >= WindowWidthClass.Expanded`. Her birinin nerede başladığını `PantrixBreakpoints` söyler.

Değerleri:

- `Compact`: 600dp'den dar: dikey tutulan bir telefon, bir katlanabilirin kapak ekranı, dar bir tarayıcı penceresi.
- `Medium`: 600dp'den itibaren: açık bir katlanabilir, dikey tutulan bir tablet, bölünmüş ekran.
- `Expanded`: 840dp'den itibaren: yatay tutulan bir tablet ve yatay tutulan çoğu telefon (bkz. `WindowHeightClass.Compact`).
- `Large`: 1200dp'den itibaren: bir masaüstü penceresi, bir tarayıcı, büyük bir tablet.
- `ExtraLarge`: 1600dp'den itibaren: geniş bir masaüstü penceresi, harici bir ekran.

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowHeightClass
```

Bir pencerenin ne kadar yüksek olduğu, üç sınıftan biri olarak.

Bir düzen önce genişliğe bakar. Yükseklik, üst üste dizecek yer kalmadığını söyler: `Compact` bir pencere yatay tutulan bir telefondur, bir tablet kadar geniştir ve yüksekliği onun yarısından azdır. Orada ekran boyunca uzanan her bar ekranın yedide birini alır.

Değerleri:

- `Compact`: 480dp'den kısa: yatay tutulan bir telefon.
- `Medium`: 480dp'den itibaren: dikey tutulan çoğu telefon, yatay tutulan bir tablet.
- `Expanded`: 900dp'den itibaren: dikey tutulan bir tablet, bir masaüstü penceresi ve dikey tutulan uzun bir telefon.

### PantrixBreakpoints

`import com.pantrixui.foundation.adaptive.PantrixBreakpoints`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixBreakpoints(
    public val medium: Dp = 600.dp,
    public val expanded: Dp = 840.dp,
    public val large: Dp = 1200.dp,
    public val extraLarge: Dp = 1600.dp,
    public val heightMedium: Dp = 480.dp,
    public val heightExpanded: Dp = 900.dp
)
```

Her pencere sınıfının başladığı yer: Medium, Expanded, Large ve ExtraLarge bir pencerenin en küçük genişliği, Medium ve Expanded bir pencerenin en küçük yüksekliği. `medium`'dan dar bir pencere Compact'tır, `heightMedium`'dan kısa olan da öyle.

Varsayılanlar Android'in pencere boyutu sınıflarıdır. Düzenleri başka yerlerde değişen bir ürün kendi sınırlarını `rememberPantrixWindow`'a verir.

Parametreler:

- `medium: Dp`: `WindowWidthClass.Medium` bir pencerenin en küçük genişliği.
- `expanded: Dp`: `WindowWidthClass.Expanded` bir pencerenin en küçük genişliği.
- `large: Dp`: `WindowWidthClass.Large` bir pencerenin en küçük genişliği.
- `extraLarge: Dp`: `WindowWidthClass.ExtraLarge` bir pencerenin en küçük genişliği.
- `heightMedium: Dp`: `WindowHeightClass.Medium` bir pencerenin en küçük yüksekliği.
- `heightExpanded: Dp`: `WindowHeightClass.Expanded` bir pencerenin en küçük yüksekliği.

Üyeleri:

- `fun widthClassOf(width: Dp): WindowWidthClass`: `width` genişliğindeki bir pencerenin sınıfı: en küçük genişliğine ulaştığı en yüksek sınıf. Henüz bilinmeyen bir genişlik, sıfır ya da belirtilmemiş, Compact'tır.
- `fun heightClassOf(height: Dp): WindowHeightClass`: `height` yüksekliğindeki bir pencerenin sınıfı: en küçük yüksekliğine ulaştığı en yüksek sınıf. Henüz bilinmeyen bir yükseklik, sıfır ya da belirtilmemiş, Compact'tır.

Tipin kendisinde:

- `PantrixBreakpoints.Default: PantrixBreakpoints`: 600, 840, 1200 ve 1600dp genişlikte; 480 ve 900dp yükseklikte.

### PantrixLayout

`import com.pantrixui.foundation.adaptive.PantrixLayout`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixLayout(
    val margin: Dp,
    val gutter: Dp,
    val columns: Int = 4,
    val maxContentWidth: Dp = Dp.Infinity
)
```

Tek bir genişlik sınıfındaki pencerede bir sayfanın düzenlendiği ölçüler. `PantrixTheme.layout` geçerli pencerenin ölçülerini verir:

```kotlin
Column(Modifier.padding(horizontal = PantrixTheme.layout.margin).maxContentWidth()) { … }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout.gutter)) { … }
```

Kenar boşluğu ve sütun arası boşluktur: arayüz yoğunluğu onları boşluğu ölçeklediği gibi ölçekler. Sütunlar bir sayı, içeriğin en fazla genişliği içeriğin ölçüsüdür; yoğunluk ikisini de ölçeklemez.

Parametreler:

- `margin: Dp`: Pencerenin ya da bir panelin kenarı ile içerik arasındaki boşluk: bir sayfanın içeriğine yanlarında verdiği iç boşluk.
- `gutter: Dp`: Bir ızgaranın sütunları arasındaki ve yan yana duran paneller arasındaki boşluk.
- `columns: Int`: Bir sayfanın ızgarasının yerinde kaç sütun olduğu: sayfanın bir parçası bunlardan birkaçına yayılır, ne kadar geniş olduğunu `spanWidth` söyler. Telefonda 4, tablette 8, daha geniş bir pencerede 12.
- `maxContentWidth: Dp`: Bir sayfanın içeriğinin en fazla ne kadar genişlediği: ötesinde geniş bir pencerenin yeri içeriğin yanında boş kalır, çünkü bir masaüstü penceresi boyunca uzanan bir satır okunmaz. İçeriğin elindeki bütün yeri aldığı yerde `Dp.Infinity`. `Modifier.maxContentWidth()` içeriği ona göre tutar.

Üyeleri:

- `fun scaled(factor: Float): PantrixLayout`: Bir arayüz yoğunluğunda bu ölçüler: kenar boşluğu ve sütun arası `factor` ile çarpılır, sütunlar ve içeriğin en fazla genişliği olduğu gibi kalır.
- `fun spanWidth(available: Dp, span: Int): Dp`: `span` kadar `columns`'a yayılan bir parçanın `available` yerde ne kadar geniş olduğu: sütunları ve aralarındaki sütun araları. Sütunlar birbiri kadar geniştir, her ikisinin arasında bir sütun arası durur:

  ```kotlin
  BoxWithConstraints {
      val layout = PantrixTheme.layout
      Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
          Article(Modifier.width(layout.spanWidth(maxWidth, span = 8)))
          Related(Modifier.width(layout.spanWidth(maxWidth, span = 4)))
      }
  }
  ```

  Sütun aralarına dar gelen bir yer sütunlara genişlik bırakmaz: parça o zaman yayıldığı sütun araları kadar geniştir.

  `available`: sütunların paylaştığı yer, sayfanın içeriği kadar geniş: kenar boşluklarının içinde.

  `span`: parçanın kaç sütuna yayıldığı, 1'den `columns`'a kadar.

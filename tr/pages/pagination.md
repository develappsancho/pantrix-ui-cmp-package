# Pagination

Uzun bir listenin ya da bir tablonun sayfaları arasında gezdiren satır: önceki, numaralarıyla sayfalar ve sonraki. Bir arama sonucunun, bir sipariş tablosunun ya da bir arşivin altında durur.

Hangi sayfanın ekranda olduğu ekranın durumudur: satıra ekrandaki sayfanın numarası (`page`, birden sayılır) ve kaç sayfa olduğu (`pageCount`) verilir; bir sayfa istenince numarası `onPageChange` ile bildirilir. Satır kendiliğinden hiçbir şeyi değiştirmez: istenen sayfayı, `page` onu söylediğinde gösterir.

Numaralar satıra sığdıkça durur. Onlara dar gelen bir yerde satır önce daha az numara gösterir; numaralı hiçbir satırın sığmadığı yerde, dik tutulan bir telefonda ya da bir tablonun dar ayağında, önceki, "Sayfa 3 / 10" ve sonraki olarak dizilir; yeri olduğunda yeniden numaralarıyla.

Bir tablonun ayağında iki yardımcısı yanında durur: `PantrixPageSize` bir sayfada kaç satır gösterileceğini seçtirir, `PantrixPageJump` numarası yazılan sayfaya götürür.

- `PantrixPageJump` (`com.pantrixui.components.data.pagination`, `com.pantrixui:components`): Uzun bir listenin bir sayfasına numarasıyla gider: onu adlandıran sözlerin yanındaki kısa bir alana yazılır; bir tablonun altında sayfalamanın eşlikçisi. Anahtar sözcükler: sayfaya git, sayfa numarası, sayfaya atla, sayfa girişi.
- `PantrixPageSize` (`com.pantrixui.components.data.pagination`, `com.pantrixui:components`): Bir liste sayfasının kaç satır göstereceğini, onu adlandıran sözlerin yanındaki bir boyut seçiminden seçer; bir tablonun altında sayfalamanın eşlikçisi. Anahtar sözcükler: sayfa başına satır, sayfa başına öğe, sayfa boyutu, sayfa başına.
- `PantrixPagination` (`com.pantrixui.components.data.pagination`, `com.pantrixui:components`): Uzun bir listenin sayfaları arasında gezinir: önceki, uzak olanları boşluklara katlanmış numaralarıyla sayfalar ve sonraki; satır fazla darsa daha az numara, sonra önceki, kaçıncı sayfada olunduğu ve sonraki. Anahtar sözcükler: sayfalama, sayfa numaraları, sayfalayıcı, önceki sonraki, sayfa gezinmesi.

## Özellikler

- **Numaralar ve boşluklar.** İlk ve son `boundaryCount` sayfa ile ekrandaki sayfanın iki yanındaki `siblingCount` sayfa gösterilir; aradakiler üç noktalı bir boşluğa katlanır. İkisi de verilmezse birdir. Bir boşluk en az iki sayfanın yerini tutar: arada tek sayfa kaldıysa o sayfanın kendisi gösterilir. Katlanacak kadar sayfa olduğunda satırda, hangi sayfa ekranda olursa olsun, aynı sayıda öğe vardır: bir uca yakınken o yanda daha çok sayfa durur.
- **Dar yerde.** Numaralarına dar gelen satır adım adım katlanır: önce ekrandaki sayfanın yanında daha az sayfa gösterir, sığdığı kadarını; o da sığmazsa uçlarda daha az sayfa, bire kadar. Numaralı hiçbir satırın sığmadığı yerde önceki, "Sayfa 3 / 10" ve sonraki olarak dizilir. Yer, satırın en geniş olduğu sayfa için sorulur: satır her sayfada aynı katlanır ve sayfa değiştikçe düzeni değişmez. Nasıl dizileceğini pencere değil, satıra kalan genişlik belirler. `PaginationLayout.Compact` kısa satırı her genişlikte ister. Düğmelerinden de dar bir yerde kısa satır küçülerek çizilir: düğmeleri kesilmez.
- **İlk ve son sayfa.** `firstAndLast = true` öncekinin ve sonrakinin dışına birer düğme daha koyar: biri ilk sayfaya, öteki son sayfaya gider. İlk sayfada baştaki iki düğme, son sayfada sondaki iki düğme basılmaz. Dört düğme numaralara kalan yeri azaltır.
- **Ekrandaki sayfa.** Dolgusuyla ayrılır ve düğme değildir: ona basmak hiçbir şey bildirmez.
- **Uçlar.** İlk sayfada önceki, son sayfada sonraki basılmaz. Sayfaların dışında kalan bir `page` en yakın sayfa sayılır. Birin altındaki bir `pageCount` bir sayılır: içinde hiçbir şey olmayan listenin tek, boş bir sayfası vardır ve satırın okları basılmaz.
- **Basılmayan satır.** `enabled = false` satırın tamamını kapatır: hiçbir parçası basılmaz ve satır temanın devre dışı renkleriyle çizilir. Klavyenin odağı satırın bir parçasındayken satır kapanırsa odak orada kalır; satır yeniden açıldığında kaldığı yerden devam edilir.
- **Klavye.** Numaralar ve oklar Tab'ın birer durağıdır; Enter ve boşluk basar. Ekrandaki sayfa da bir duraktır ve klavyenin üstüne koyduğu odağı korur: klavyeyle açılan sayfada odak yerinde kalır. Satır bir ucuna geldiğinde, artık basılamayan düğmenin odağını ekrandaki sayfa alır; kısa satırda öteki yandaki düğme alır.
- **Ölçüler.** `PaginationStyle.itemSize` bir numaranın, öncekinin ve sonrakinin boyudur: Android'de 40dp, iOS'ta 36dp, masaüstünde ve web'de 32dp. Ona sığmayan uzun bir numara öğesini genişletir; önceki ve sonrakinin ikonu öğenin yarısından 4dp büyüktür. `itemShape` köşeleri verir: Android'de ve iOS'ta tam yuvarlak, masaüstünde ve web'de küçük. `itemGap` iki komşunun arasıdır ve yoğunlukla ölçeklenir. Her öğenin çevresinde platformun dokunma hedefi kadar yer ayrılır; satır öğeleri kadar geniş, en az o hedef kadar yüksektir.
- **Yazı.** `textStyle` numaraların ve kısa satırın sözlerinin yazı stilidir, verilmezse temanın `label` stili. Stil öğeyi büyütünce yazı kendiliğinden büyümez: büyük öğeye büyük yazı da verilir.
- **Rakamlar.** Numaralar, kısa satırın sözlerindeki sayılar ve ekran okuyucuya söylenen adlardaki sayılar temanın dilinin rakamlarıyla yazılır (`PantrixStrings.digits`): Arapça pakette Arap rakamlarıyla. `onPageChange` her dilde aynı sayıyı bildirir.
- **Renkler.** `PaginationColors` numaraları ve kısa satırın sözlerini (`content`), önceki, sonraki ve boşluk işaretlerini (`control`), ekrandaki sayfanın dolgusunu ve numarasını (`selectedContainer`, `selectedContent`) ayrı ayrı boyar. Bir dolgunun üstünde renk verilmeyen satırın tamamı dolgunun üstüne yazılan renktedir; ekrandaki sayfa, o rengin bir payı olan dolgusuyla ayrılır.
- **Ekran okuyucu.** Bir numara, açtığı sayfayla adlandırılan bir düğmedir: "Sayfa 4". Ekrandaki sayfa düğme değildir ve okuyucuya basılacak bir şey sunmaz: "Geçerli sayfa" durumuyla okunur. Boşluklar okunmaz. İlk ve son sayfaya giden düğmelerin adı "İlk sayfa" ve "Son sayfa"dır. Kısa satırın sözleri her değiştiğinde okuyucuya söylenir. Satır "Sayfalama" adlı bir gruptur. iOS'ta grubun adı yoktur: oradaki okuyucu bir grubun adını içindekilerden sonra okur.
- **Sağdan sola.** Sağdan sola okunan dillerde satır sağdan başlar ve oklar döner.
- **Sayfa boyu.** `PantrixPageSize` "Sayfa başına" sözleri ve yanında boyların select'idir. Seçilen boy çağıranındır: `pageSize` ile verilir, başka bir boy seçilince `onPageSizeChange` ile bildirilir; seçili boyu yeniden seçmek bir şey bildirmez. Boylar verilmezse 10, 25, 50 ve 100'dür (`DefaultPageSizes`); `pageSizes` başkalarını verir. Boylardan biri olmayan bir `pageSize` da seçili gösterilir ve listede, kendisinden büyük ilk boyun önünde durur. Select en uzun boyun gerektirdiği kadar geniştir: seçim değiştikçe satır yerinde durur.
- **Sayfaya git.** `PantrixPageJump` "Sayfaya git" sözleri ve yanında kısa bir alandır. Enter ya da ekran klavyesinin eylemi yazılan sayfayı `onPageChange` ile bildirir ve alanı boşaltır; odak alanda kalır. Sayfaların dışında kalan bir numara en yakın sayfa sayılır; boş alan bir şey bildirmez. Alan yalnızca rakam alır, Batı rakamlarını ve temanın dilinin rakamlarını, ve son sayfanın numarasındaki kadar hane tutar.
- **Yardımcıların sözleri.** İkisinde de sözler kontrolün önünde, satırın başladığı yandadır ve göz içindir: ekran okuyucuya, adı o sözler olan tek bir kontrol verilir. `label` sözleri değiştirir. Dar yerde sözler kısalır, kontrol kısalmaz. `enabled = false` sözleri devre dışı yazı rengiyle yazar ve kontrolü kapatır.
- **Otomasyon.** `tagKey` verilen satır `Pagination_<tagKey>` olur ve parçaları onun içinde adlandırılır: `Pagination_orders.Page_4`, `Pagination_orders.Step_previous`, `Pagination_orders.Step_next`, `Pagination_orders.Step_first`, `Pagination_orders.Step_last`, kısa satırın sözleri `Pagination_orders.Text_position`. İstenen her sayfa, numarasıyla ve onu neyin istediğiyle (`page`, `previous`, `next`, `first`, `last`), `select` olarak bildirilir. Yardımcılar `PageSize_<tagKey>` ve `PageJump_<tagKey>` olur; içlerindeki select `Select_<tagKey>_page_size`, alan `TextField_<tagKey>_page_jump` etiketini taşır.

## Kullanım

### In a table's foot, after the pagination

```kotlin
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixPagination(
        page = orders.page,
        pageCount = orders.pageCount,
        onPageChange = onPageChange,
        tagKey = "orders"
    )
    PantrixPageJump(
        pageCount = orders.pageCount,
        onPageChange = onPageChange,
        tagKey = "orders"
    )
}
```

### Words of its own, while the list is loading

```kotlin
PantrixPageJump(
    pageCount = archive.pageCount,
    onPageChange = { page -> viewModel.openPage(page) },
    label = stringResource(Res.string.go_to_issue),
    enabled = !loading,
    tagKey = "archive"
)
```

### In a table's foot, beside the pagination

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixPageSize(
        pageSize = orders.pageSize,
        onPageSizeChange = { size -> onPageSizeChange(size) },
        tagKey = "orders"
    )
    Spacer(Modifier.weight(1f))
    PantrixPagination(
        page = orders.page,
        pageCount = orders.pageCount,
        onPageChange = onPageChange,
        tagKey = "orders"
    )
}
```

### Sizes and words of its own, while the list is loading

```kotlin
PantrixPageSize(
    pageSize = pageSize,
    onPageSizeChange = { pageSize = it },
    pageSizes = listOf(12, 24, 48),
    label = stringResource(Res.string.cards_per_page),
    enabled = !loading,
    tagKey = "gallery"
)
```

### Under the results of a search

```kotlin
PantrixPagination(
    page = results.page,
    pageCount = results.pageCount,
    onPageChange = { page -> onOpenPage(page) },
    tagKey = "results"
)
```

### An archive, with two pages on each side of the one on screen and buttons to its two ends

```kotlin
PantrixPagination(
    page = page,
    pageCount = archive.pageCount,
    onPageChange = onPageChange,
    siblingCount = 2,
    firstAndLast = true,
    tagKey = "archive"
)
```

### In the foot of a table, always as previous, the page's place and next

```kotlin
PantrixPagination(
    page = page,
    pageCount = pageCount,
    onPageChange = onPageChange,
    enabled = !loading,
    style = PaginationStyle(layout = PaginationLayout.Compact),
    tagKey = "orders"
)
```

### The short row on every phone, as a row laid out by the platform has it

```kotlin
PantrixTheme(
    styles = pantrixStyles(
        PaginationStyle.override(
            android = PaginationStyle(layout = PaginationLayout.Compact),
            ios = PaginationStyle(layout = PaginationLayout.Compact)
        )
    )
) {
    PantrixPagination(page = page, pageCount = pageCount, onPageChange = onPageChange, tagKey = "orders")
}
```

## Örnekler

### Sayfalar arasında gezinme

En yalın hâli: ekrandaki sayfa (`page`), kaç sayfa olduğu (`pageCount`) ve bir sayfa istenince ne olacağı (`onPageChange`). Hangi sayfada olunduğu ekranın durumudur; satır onu tutmaz, istenen sayfanın numarasını bildirir ve `page` onu söylediğinde gösterir.

Bir numaraya ya da iki uçtaki oklara bas: istenen sayfa kartın "Son olay" satırına yazılır. Ekrandaki sayfa dolguludur ve düğme değildir: ona basınca bir şey bildirilmez. İlk sayfada önceki, son sayfada sonraki basılmaz.

On sayfa var: satır ilk ve son sayfayı, ekrandakini ve iki yanındakileri gösterir, aradakileri üç noktalı bir boşluğa katlar. Dik tutulan bir telefonda bu kadarı sığmaz. Satır orada, telefonun genişliğine göre, ya daha az numara gösterir ya da kısa hâlindedir: önceki, "Sayfa 1 / 10" ve sonraki.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination

val report = LocalExampleEvents.current
var page by rememberSaveable { mutableIntStateOf(1) }
PantrixPagination(
    page = page,
    pageCount = 10,
    onPageChange = { asked ->
        page = asked
        report("$asked. sayfa istendi")
    },
    tagKey = "plain"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Sayfa sayfa gösterilen bir liste

Kırk sekiz siparişlik bir liste, sayfada beş sipariş: on sayfa eder ve sonuncusunda üç sipariş kalır. Sayfa sayısı listenin kendisinden hesaplanır. Satır yalnızca hangi sayfanın istendiğini bildirir; o sayfanın siparişlerini göstermek ekranın işidir.

Sonrakine bas, numaraların sığdığı yerde bir numaraya da basabilirsin: liste o sayfanın siparişlerine geçer ve altındaki yazı kaçıncı siparişlerin göründüğünü söyler. Son sayfaya git: orada üç sipariş vardır ve sonraki basılmaz.

Liste her sayfada beş sipariş yüksekliğindedir: son sayfada siparişi olmayan iki satır boş durur. Liste kısalsaydı altındaki satır yukarı kayar, basan parmağın altından çıkardı.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

var page by rememberSaveable { mutableIntStateOf(1) }
val first = (page - 1) * ORDERS_PER_PAGE + 1
val last = minOf(page * ORDERS_PER_PAGE, ORDER_COUNT)
OrderRows(first = first, last = last, rows = ORDERS_PER_PAGE, tagKey = "order")
PantrixText(
    text = "$ORDER_COUNT siparişten $first–$last arası",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "orders_shown"
)
PantrixPagination(
    page = page,
    pageCount = (ORDER_COUNT + ORDERS_PER_PAGE - 1) / ORDERS_PER_PAGE,
    onPageChange = { page = it },
    tagKey = "orders"
)

@Composable
private fun OrderRows(
    first: Int,
    last: Int,
    rows: Int,
    tagKey: String
) {
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        Column {
            for (order in first until first + rows) {
                val listed = order <= last
                // Boş satırın çizgisi de yerini tutar, ama çizilmez.
                val line = if (listed) Color.Unspecified else Color.Transparent
                if (order > first) PantrixHorizontalDivider(color = line)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    if (listed) {
                        PantrixText(text = "Sipariş #${FIRST_ORDER + order}", tagKey = "${tagKey}_$order")
                        PantrixText(text = "${1 + order % 4} ürün", color = PantrixTheme.colors.textSecondary)
                    } else {
                        // Boş bir yazı da bir satır yüksekliğindedir; ekran okuyucuya söylenecek bir şeyi yoktur.
                        PantrixText(text = "", role = TextRole.Decorative)
                    }
                }
            }
        }
    }
}

private const val ORDER_COUNT = 48

private const val ORDERS_PER_PAGE = 5

private const val FIRST_ORDER = 4800
```

### Ekrandaki sayfanın yanında ve uçlarda kaç sayfa

`siblingCount` ekrandaki sayfanın iki yanında, `boundaryCount` satırın iki ucunda kaç sayfanın gösterileceğini söyler; ikisi de verilmezse birdir. Yirmi sayfalık dört satır aynı sayfayı gösterir: birinde bir sayfaya basınca dördü de oraya gider.

İlk satıra ikisi de verilmedi. İkincisi ekrandaki sayfanın iki yanında ikişer, üçüncüsü iki uçta ikişer sayfa gösterir. Sonuncusunda ikisi de sıfırdır: ortada yalnızca ekrandaki sayfa kalır ve ötekilere oklarla gidilir.

Bir satırda, hangi sayfa ekranda olursa olsun, aynı sayıda öğe vardır. İlk satırda 1'e bas: bir uca gelince boşluklardan biri kalkar ve yerini o uçtaki sayfalar alır; son satırda ilk sayfanın yanında ikincisi de durur.

Satırlar yana kayan bir çerçevededir: orada genişliğin sonu yoktur ve satırlar dar bir ekranda da numaralarıyla durur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var page by rememberSaveable { mutableIntStateOf(10) }
val secondary = PantrixTheme.colors.textSecondary
HorizontalScrollFrame(tagKey = "around") {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixText(text = "İkisi de verilmedi: yanlarda birer, uçlarda birer sayfa", color = secondary)
        PantrixPagination(page = page, pageCount = 20, onPageChange = { page = it }, tagKey = "around_usual")
        PantrixText(text = "siblingCount = 2", color = secondary)
        PantrixPagination(
            page = page,
            pageCount = 20,
            onPageChange = { page = it },
            siblingCount = 2,
            tagKey = "around_siblings"
        )
        PantrixText(text = "boundaryCount = 2", color = secondary)
        PantrixPagination(
            page = page,
            pageCount = 20,
            onPageChange = { page = it },
            boundaryCount = 2,
            tagKey = "around_boundaries"
        )
        PantrixText(text = "siblingCount = 0, boundaryCount = 0", color = secondary)
        PantrixPagination(
            page = page,
            pageCount = 20,
            onPageChange = { page = it },
            siblingCount = 0,
            boundaryCount = 0,
            tagKey = "around_none"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `HorizontalScrollFrame`: Yana kayan bir çerçeve: içeriği yerine sığmadığında altında bir kaydırma çubuğu çizer.

### İlk ve son sayfaya giden düğmelerle

`firstAndLast = true` öncekinin ve sonrakinin dışına birer düğme daha koyar: biri ilk sayfaya, öteki son sayfaya gider. Sayfası çok olan bir listede, bir arşivde, bir ucundan ötekine tek basışla gitmek içindir.

Son sayfa düğmesine bas: satır kırkıncı sayfaya gider; orada sonraki de son sayfa düğmesi de basılmaz. İlk sayfa düğmesi birinci sayfaya götürür ve orada baştaki iki düğme basılmaz. İstenen sayfa kartın "Son olay" satırına yazılır.

Dört düğme numaralara kalan yeri azaltır: bu satır, aynı genişlikte, iki düğmeli olandan önce katlanır. Dik tutulan bir telefonda kısa hâlindedir: iki düğme, "Sayfa 12 / 40" ve iki düğme. Dört düğmenin yanında sözlere yer kalmayan en dar telefonlarda sözlerin sonu kesilir, düğmeler kesilmez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination

val report = LocalExampleEvents.current
var page by rememberSaveable { mutableIntStateOf(12) }
PantrixPagination(
    page = page,
    pageCount = 40,
    onPageChange = { asked ->
        page = asked
        report("$asked. sayfa istendi")
    },
    firstAndLast = true,
    tagKey = "ends"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Numaralara dar gelen yerde

Aynı satır üç genişlikte: ilki örneğin genişliğinde, ikincisi 320dp'lik, üçüncüsü 240dp'lik bir çerçevede. Satır yerine adım adım uyar. İlk çerçeve on sayfanın yedi öğesine dar gelir: satır orada ekrandaki sayfanın yanlarındaki sayfalardan vazgeçer ve beş öğeyle durur. İkinci çerçeveye o da sığmaz: satır önceki, "Sayfa 3 / 10" ve sonraki olarak dizilir. Bunun için hiçbir şey verilmedi: satır pencereye değil, kendisine kalan genişliğe bakar.

Üçü aynı sayfayı gösterir: çerçevelerden birindeki sonrakine bas, üçü de o sayfaya gider. Bir satır her sayfada aynı katlanır: sayfa değiştikçe hiçbirinin düzeni değişmez. Pencereyi daralt: üstteki satır da önce daha az numara gösterir, sonra kısa hâline geçer.

Çerçevelerin genişliği masaüstünün ve web'in 32dp'lik öğelerine göre seçildi. Telefonda öğeler daha büyüktür ve çevrelerinde dokunma hedefi kadar yer ayrılır: orada iki çerçeve de numaralara dar gelir ve ikisinde de kısa satır durur. Üstteki satır, telefonun genişliğine göre, ya daha az numara gösterir ya da o da kısadır.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.theme.PantrixTheme

var page by rememberSaveable { mutableIntStateOf(3) }
PantrixPagination(page = page, pageCount = 10, onPageChange = { page = it }, tagKey = "roomy")
PantrixSurface(modifier = Modifier.width(320.dp), border = PantrixTheme.colors.divider) {
    PantrixPagination(
        page = page,
        pageCount = 10,
        onPageChange = { page = it },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "fewer"
    )
}
PantrixSurface(modifier = Modifier.width(240.dp), border = PantrixTheme.colors.divider) {
    PantrixPagination(
        page = page,
        pageCount = 10,
        onPageChange = { page = it },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "narrow"
    )
}
```

### Her genişlikte kısa satır

`PaginationStyle(layout = PaginationLayout.Compact)` kısa satırı her genişlikte ister: numaraların sığacağı yerde de satır önceki, sayfanın yeri ve sonrakidir. Bir numaraya atlanmayan, sayfadan sayfaya ilerlenen yerde, bir tablonun ayağında kullanılır.

Sonrakine bas: sözler "Sayfa 2 / 5" olur; ekran okuyucuya değişen sözler kendiliğinden söylenir. Beşinci sayfada sonraki, ilk sayfada önceki basılmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PaginationLayout
import com.pantrixui.components.data.pagination.PaginationStyle
import com.pantrixui.components.data.pagination.PantrixPagination

var page by rememberSaveable { mutableIntStateOf(1) }
PantrixPagination(
    page = page,
    pageCount = 5,
    onPageChange = { page = it },
    style = PaginationStyle(layout = PaginationLayout.Compact),
    tagKey = "compact"
)
```

### Liste yüklenirken basılmayan satır

`enabled = false` satırın tamamını kapatır: numaralar, önceki ve sonraki basılmaz ve satır temanın devre dışı renkleriyle çizilir. Bir sayfa yüklenirken ikinci bir sayfa istenmesin diye kullanılır: `enabled = !loading`.

Anahtar açıkken liste yükleniyor sayılır: sonrakine ya da, numaraların sığdığı yerde, bir numaraya bas; kartın "Son olay" satırı değişmez. Anahtarı kapat ve yeniden bas: istenen sayfa bildirilir. Ekrandaki sayfa basılmayan satırda da bellidir: numaralı satırda dolgusuyla, kısa satırda sözleriyle.

Klavyeyle bir numaranın ya da bir okun üstündeyken liste yüklenmeye başlarsa odak orada kalır: üstünde durulan basılmaz, ama liste gelince klavye kaldığı yerden devam eder.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

val report = LocalExampleEvents.current
var loading by rememberSaveable { mutableStateOf(true) }
var page by rememberSaveable { mutableIntStateOf(4) }
PantrixSwitchButton(
    checked = loading,
    onCheckedChange = { loading = it },
    label = "Liste yükleniyor",
    tagKey = "list_loading"
)
PantrixPagination(
    page = page,
    pageCount = 10,
    onPageChange = { asked ->
        page = asked
        report("$asked. sayfa istendi")
    },
    enabled = !loading,
    tagKey = "while_loading"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Bir tablonun ayağında: sayfa boyu ve sayfaya git

Bir tablonun ayağı: `PantrixPageSize` bir sayfada kaç sipariş gösterileceğini seçtirir, `PantrixPagination` sayfalar arasında gezdirir, `PantrixPageJump` numarası yazılan sayfaya götürür. Üçü bir `FlowRow`'dadır: yeri olan yerde yan yana durur, dar yerde sığmayan alt satıra iner; dik tutulan bir telefonda üçü alt alta durur. Bir `Row` sığmayanı alt satıra indirmez: sonda duranı kalan yere sıkıştırır. Üçünün yüksekliği aynı olmayabilir: `itemVerticalAlignment` onları ortalarından hizalar.

Üçü de ekranın durumunu okur ve birbirini bilmez. Sayfa boyunu değiştir: kırk sekiz sipariş üçer üçer on altı, onar onar beş sayfa eder; satırın numaraları ve alanın aldığı hane sayısı yeni sayfa sayısına uyar. Boy değişirken görünen ilk sipariş ekranda kalır: açılan sayfa, o siparişin yeni boyda düştüğü sayfadır. Dördüncü sayfada, 16–20 arası görünürken 10'u seç: ikinci sayfa, 11–20 arası gelir. Kırk sekiz sipariş için boylar küçük: hazır boyların (`DefaultPageSizes`) ilkinden, 10'dan önce 3 ve 5.

Alana bir numara yaz ve Enter'a bas: o sayfa açılır, alan boşalır ve odak alanda kalır. Son sayfadan büyük bir numara son sayfayı açar; alan rakamdan başkasını almaz. İstenen sayfa, neyle istenirse istensin, kartın "Son olay" satırına yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.DefaultPageSizes
import com.pantrixui.components.data.pagination.PantrixPageJump
import com.pantrixui.components.data.pagination.PantrixPageSize
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var pageSize by rememberSaveable { mutableIntStateOf(ORDERS_PER_PAGE) }
var page by rememberSaveable { mutableIntStateOf(1) }
val pageCount = (ORDER_COUNT + pageSize - 1) / pageSize
val first = (page - 1) * pageSize + 1
val last = minOf(page * pageSize, ORDER_COUNT)
val open: (Int) -> Unit = { asked ->
    page = asked
    report("$asked. sayfa istendi")
}
OrderRows(first = first, last = last, rows = pageSize, tagKey = "row")
PantrixText(
    text = "$ORDER_COUNT siparişten $first–$last arası",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "foot_shown"
)
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixPageSize(
        pageSize = pageSize,
        onPageSizeChange = { size ->
            // Görünen ilk sipariş yeni boyda hangi sayfaya düşüyorsa o sayfa açılır: sipariş ekranda kalır.
            val kept = (first - 1) / size + 1
            pageSize = size
            page = kept
            report("Sayfada $size sipariş: $kept. sayfa açıldı")
        },
        pageSizes = listOf(3, 5) + DefaultPageSizes.first(),
        tagKey = "foot"
    )
    PantrixPagination(page = page, pageCount = pageCount, onPageChange = open, tagKey = "foot")
    PantrixPageJump(pageCount = pageCount, onPageChange = open, tagKey = "foot")
}

@Composable
private fun OrderRows(
    first: Int,
    last: Int,
    rows: Int,
    tagKey: String
) {
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        Column {
            for (order in first until first + rows) {
                val listed = order <= last
                // Boş satırın çizgisi de yerini tutar, ama çizilmez.
                val line = if (listed) Color.Unspecified else Color.Transparent
                if (order > first) PantrixHorizontalDivider(color = line)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    if (listed) {
                        PantrixText(text = "Sipariş #${FIRST_ORDER + order}", tagKey = "${tagKey}_$order")
                        PantrixText(text = "${1 + order % 4} ürün", color = PantrixTheme.colors.textSecondary)
                    } else {
                        // Boş bir yazı da bir satır yüksekliğindedir; ekran okuyucuya söylenecek bir şeyi yoktur.
                        PantrixText(text = "", role = TextRole.Decorative)
                    }
                }
            }
        }
    }
}

private const val ORDER_COUNT = 48

private const val ORDERS_PER_PAGE = 5

private const val FIRST_ORDER = 4800
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Arapçada: sağdan başlayan satır ve Arap rakamları

Arapça bir bölümde aynı satır: içteki temaya yalnızca `locale` verildi, `PantrixLocale.Arabic`. Satır sağdan başlar: önceki sağdadır, oklar döner ve numaralar sola doğru büyür. Numaralar Arap rakamlarıyla yazılır: dilin paketi rakamlarını da taşır (`PantrixStrings.digits`). Alttaki, kısa satırdır: sözleri Arapçadır ve sayıları aynı rakamlarla yazılır.

Bir sayfaya bas: kartın "Son olay" satırı istenen sayfayı uygulamanın dilinde yazar. Rakamlar yalnızca yazılışı değiştirir: `onPageChange` her dilde aynı sayıyı bildirir. Ekran okuyucuya söylenen adlar da Arapçadır ve aynı rakamlarla yazılır.

Dik tutulan bir telefonda üstteki satır da, telefonun genişliğine göre, daha az numara gösterir ya da kısadır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.pagination.PaginationLayout
import com.pantrixui.components.data.pagination.PaginationStyle
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var page by rememberSaveable { mutableIntStateOf(3) }
val open: (Int) -> Unit = { asked ->
    page = asked
    report("$asked. sayfa istendi")
}
PantrixTheme(locale = PantrixLocale.Arabic) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixPagination(page = page, pageCount = 10, onPageChange = open, tagKey = "arabic")
        PantrixPagination(
            page = page,
            pageCount = 10,
            onPageChange = open,
            style = PaginationStyle(layout = PaginationLayout.Compact),
            tagKey = "arabic_short"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kendi renkleriyle ve bir dolgunun üstünde

`colors` numaraların ve kısa satırın sözlerinin (`content`), önceki, sonraki ve boşluk işaretlerinin (`control`), ekrandaki sayfanın dolgusunun ve numarasının (`selectedContainer`, `selectedContent`) rengini ayrı ayrı alır; verilmeyen temanınki kalır. İlk satırda oklar ve ekrandaki sayfanın dolgusu temanın hiçbir rolünde olmayan, uygulamanın kendi morundadır. Tema tanımadığı bir dolgunun üstünde neyin okunduğunu bilemez: numarasının rengi de verildi. Öteki numaralar verilmedi ve temanın yazı renginde kaldı.

İkinci satır temanın zemini olmayan bir dolgunun üstündedir ve hiçbir renk verilmedi: dolgu, üstüne ne renkle yazıldığını söyler ve satırın tamamı o renkle yazılır. Ekrandaki sayfa, aynı rengin bir payı olan dolgusuyla ayrılır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.pagination.PaginationColors
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var page by rememberSaveable { mutableIntStateOf(2) }
PantrixPagination(
    page = page,
    pageCount = 3,
    onPageChange = { page = it },
    colors = PaginationColors(control = own.color, selectedContainer = own.color, selectedContent = own.onColor),
    tagKey = "own"
)
PantrixSurface(
    modifier = Modifier.fillMaxWidth(),
    color = PantrixTheme.colors.primary.color,
    shape = PantrixTheme.shapes.md
) {
    PantrixPagination(
        page = page,
        pageCount = 3,
        onPageChange = { page = it },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "filled"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Ölçüler ve şekil

`style` satırın ölçülerini verir; yalnızca verilen alanlar değişir. `itemSize` bir numaranın, öncekinin ve sonrakinin boyu, `itemShape` köşeleri, `itemGap` iki komşunun arasıdır. Okların ikonu öğeyle birlikte büyür ve küçülür: öğenin yarısından 4dp büyüktür.

Ortadaki satır hiçbir şey verilmemiş hâlidir. Üstteki 24dp'lik, tam yuvarlak öğelerle ve aralarına boşluk konmadan kuruldu; alttaki 48dp'lik öğelerle, orta köşelerle ve 8dp aralıkla. Küçük öğelerin çevresinde de platformun dokunma hedefi kadar yer ayrılır: öğeler küçülür ama birbirine o hedeften fazla yaklaşmaz.

Öğe büyüyünce yazı kendiliğinden büyümez: alttaki satıra `textStyle` ile temanın `title` stili de verildi.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.pagination.PaginationStyle
import com.pantrixui.components.data.pagination.PantrixPagination
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

var page by rememberSaveable { mutableIntStateOf(2) }
PantrixPagination(
    page = page,
    pageCount = 3,
    onPageChange = { page = it },
    style = PaginationStyle(itemSize = 24.dp, itemShape = ShapeRole.Full, itemGap = 0.dp),
    tagKey = "small"
)
PantrixPagination(page = page, pageCount = 3, onPageChange = { page = it }, tagKey = "usual")
PantrixPagination(
    page = page,
    pageCount = 3,
    onPageChange = { page = it },
    textStyle = PantrixTheme.typography.title,
    style = PaginationStyle(itemSize = 48.dp, itemShape = ShapeRole.Medium, itemGap = 8.dp),
    tagKey = "large"
)
```

## API

### PantrixPagination

`import com.pantrixui.components.data.pagination.PantrixPagination`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixPagination(
    page: Int,
    pageCount: Int,
    onPageChange: (page: Int) -> Unit,
    modifier: Modifier = Modifier,
    siblingCount: Int = 1,
    boundaryCount: Int = 1,
    firstAndLast: Boolean = false,
    enabled: Boolean = true,
    textStyle: TextStyle = PantrixTheme.typography.label,
    style: PaginationStyle? = null,
    colors: PaginationColors? = null,
    tagKey: String? = null
)
```

Uzun bir listenin ya da bir tablonun sayfaları arasında gezdirir.

Numaralı bir satırda önceki, ilk ve son `boundaryCount` sayfa, ekrandaki sayfanın iki yanında `siblingCount` sayfa ve sonraki vardır; aradaki sayfalar boşluklara katlanır. Hangi sayfa ekranda olursa olsun satırda aynı sayıda öğe vardır ve her biri aynı yeri tutar: böylece sayfa değiştikçe satır yerinde durur; yalnızca üç ya da daha çok haneli bir numara kendi öğesini genişletir.

Satır kendini platforma ya da pencereye değil, kendisine verilen yere uydurur. Numaralar istendiği gibi sığmıyorsa önce ekrandaki sayfanın yanında daha az sayfa gösterir, sığdığı kadarını; sonra uçlarda daha az sayfa, bire kadar. Hiçbir numaralı satırın sığmadığı yerde önceki, "Sayfa 3 / 10" ve sonraki olarak dizilir: dik tutulan bir telefonda ve bir tablonun dar ayağında aynı satır böyledir, yeri olan yerde ise yeniden numaralı satırdır. Yer, satırın en geniş olduğu sayfadaki hâli için sorulur: satır her sayfada aynıdır. `PaginationStyle.layout` kısa satırı her yerde ister: onu telefonlarına veren bir tema, platforma göre dizilen bir satırın yaptığını yapar. Düğmelerinden dar bir yerde kısa satır küçülerek çizilir ve ikisini de bütün tutar.

Bir sayfanın numarası, ekran okuyucunun açtığı sayfayla adlandırdığı bir düğmedir: "Sayfa 4". Ekrandaki sayfa düğme değildir ve basılmak üzere sunulmaz: geçerli sayfa olduğu söylenir. Klavyenin üstüne koyduğu odağı korur ve Tab'ın bir durağıdır: satıra bulunulan yerden girilir. Satırı sonuna getiren bir düğme artık basılamaz ve odağını ekrandaki sayfaya, kısa satırda ise öteki yandaki bir düğmeye verir. Klavye öğelerinden birinin üstündeyken `enabled` olmaktan çıkan satır, odağı orada, hiçbir şey yapmayan o öğede bırakır; satır yeniden basılabilir olana dek. Boşluklar bir şey söylemez. Satır tek bir gruptur ve temanın dilinde sayfalama diye adlandırılır. iOS'ta adı olmayan bir gruptur: oradaki ekran okuyucu bir grubun kendi adını grubun içindekilerden sonra okur.

Sayılar temanın dilinin rakamlarıyla yazılır. Satır öğeleri kadar geniştir ve tek satırdır; en az platformun dokunma hedefi kadar yüksektir. Kendisinden geniş bir yerde, yerin başladığı kenardan başlar. Orada başlayan, ilk düğmesidir: ona basışın yeri. Ok o yerin ortasında durur; satırın üstündeki bir yazının başladığı kenarın biraz içinde, her düğmedeki ikon gibi. Ok o kenara çizilseydi düğmenin dolgusu, halkası ve parmağın bastığı yerin yarısı satırın dışında kalırdı.

Parametreler:

- `page: Int`: Ekrandaki sayfa, satırda yazıldığı gibi birden sayılır: bir sayfalayıcının ya da bir carousel'in sırası sıfırdan sayılır ve bunun bir eksiğidir. Sayfaların dışında kalan bir sayı en yakın sayfa sayılır.
- `pageCount: Int`: Kaç sayfa olduğu. İçinde hiçbir şey olmayan listenin tek, boş bir sayfası vardır: birin altındaki sayı bir sayılır.
- `onPageChange: (page: Int) -> Unit`: İstenen sayfayla çağrılır: sayfa numarasıyla ya da bir düğmeyle istenmiş olabilir. Satır onu, `page` öyle söylediğinde gösterir.
- `modifier: Modifier`: Satıra uygulanır.
- `siblingCount: Int`: Numaralı bir satırda, yeri olduğunda ekrandaki sayfanın her iki yanında kaç sayfanın gösterildiği: sıfır ya da daha çok. Sayfa sayısından büyükse sayfaların hepsi gösterilir.
- `boundaryCount: Int`: Numaralı bir satırda, yeri olduğunda iki uçta her zaman kaç sayfanın gösterildiği: sıfır ya da daha çok.
- `firstAndLast: Boolean`: Satırda, önceki ile sonrakinin dışında, ilk sayfaya ve son sayfaya giden iki düğmenin olup olmadığı.
- `enabled: Boolean`: Satırın basılıp basılamadığı: basılamayan satır temanın devre dışı renkleriyle çizilir.
- `textStyle: TextStyle`: Numaraların ve sözlerin yazı stili: verilmezse temanın `label` stili. Stilin büyüttüğü bir öğe kendiliğinden daha büyük yazılmaz.
- `style: PaginationStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: PaginationColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar. Satırın test etiketi `Pagination_<tagKey>` olur ve parçaları onun içinde adlandırılır: `Pagination_<tagKey>.Page_<number>`, `Pagination_<tagKey>.Step_previous`, `Pagination_<tagKey>.Step_next`, `Pagination_<tagKey>.Step_first`, `Pagination_<tagKey>.Step_last` ve numarasız bir satırın sözleri için `Pagination_<tagKey>.Text_position`.

### PantrixPageSize

`import com.pantrixui.components.data.pagination.PantrixPageSize`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixPageSize(
    pageSize: Int,
    onPageSizeChange: (pageSize: Int) -> Unit,
    modifier: Modifier = Modifier,
    pageSizes: List<Int> = DefaultPageSizes,
    label: String = PantrixTheme.strings.perPage,
    enabled: Boolean = true,
    tagKey: String? = null
)
```

Bir listenin bir sayfasında kaç satır gösterileceğini seçtirir: "Sayfa başına" sözleri ve yanında boyların select'i.

Bir tablonun ayağında bir `PantrixPagination`'ın yanında durur. Seçilen boy kontrolün değil, çağıranındır: `pageSize` ile verilir ve başka bir boy `onPageSizeChange` ile istenir. Zaten seçili olan boyu seçmek bir şey istemez. `pageSizes`'ın hiçbiri olmayan bir `pageSize`, önceki bir ziyaretten saklanmış bir boy öyle olabilir, yine de seçili gösterilir ve boylarla birlikte, kendisinden büyük ilk boyun önünde listelenir.

Boylar temanın dilinin rakamlarıyla yazılır. Sözler select'in önünde, satırın başladığı yanda durur: sağdan okunan bir dilde sağda. Göz içindir. Ekran okuyucuya tek bir kontrol verilir: adı o sözler olan select; bir yazı ve ardından adsız bir kontrol değil.

Select, kutusunda da listesinin satırlarında da, en uzun boyunun gerektirdiği kadar geniştir: seçim değiştikçe satır yerinde durur ve listede hiçbir boy kesilmez. Satır tek satırdır; select kadar yüksek, sözleri ve select'i kadar geniştir. Kendisinden geniş bir yerde, yerin başladığı kenardan başlar. Kendisine dar gelen bir yerde sözler yer verir, select vermez.

Parametreler:

- `pageSize: Int`: Bir sayfanın şu an kaç satır gösterdiği.
- `onPageSizeChange: (pageSize: Int) -> Unit`: Seçilen boyla çağrılır, o boy `pageSize`'dan başkaysa. Select onu, `pageSize` öyle söylediğinde gösterir.
- `modifier: Modifier`: Satıra uygulanır.
- `pageSizes: List<Int>`: Aralarından seçilecek boylar, listelendikleri sırayla: verilmezse `DefaultPageSizes`. İki kez verilen boy bir kez listelenir. En az bir boy vardır ve her biri en az bir satırdır: boş bir liste ya da birin altında bir sayı içeren liste reddedilir.
- `label: String`: Select'in önündeki sözler ve select'in ekran okuyucudaki adı: verilmezse temanın "Sayfa başına" sözleri.
- `enabled: Boolean`: Bir boyun seçilip seçilemediği: kullanılamayan satırın sözleri devre dışı yazı rengindedir ve select'i devre dışıdır; odak almaz ve bunu söyler.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar. Satırın test etiketi `PageSize_<tagKey>`, sözlerininki `PageSize_<tagKey>.Text_label` olur. İçindeki select'in anahtarı `<tagKey>_page_size`'dır ve bir select gibi etiketlenir: `Select_<tagKey>_page_size`, listesi `SelectList_<tagKey>_page_size`, listedeki bir boy `Select_<tagKey>_page_size.SelectOption_<size>`. Bir etikete sığmayacak kadar uzun bir anahtar kesilir, `_page_size` bütün kalır. Bir seçim, boyuyla birlikte `PageSize` olarak bildirilir. Boyların listesinin açıldığı da satırın etiketiyle `PageSize` olarak bildirilir: satır tek bir bileşendir ve tek bir adla bildirir.

### PantrixPageJump

`import com.pantrixui.components.data.pagination.PantrixPageJump`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixPageJump(
    pageCount: Int,
    onPageChange: (page: Int) -> Unit,
    modifier: Modifier = Modifier,
    label: String = PantrixTheme.strings.goToPage,
    enabled: Boolean = true,
    tagKey: String? = null
)
```

Uzun bir listenin bir sayfasına numarasıyla götürür: "Sayfaya git" sözleri ve yanında numaranın yazıldığı kısa bir alan.

Bir tablonun ayağında bir `PantrixPagination`'ın yanında durur: sayfaları tek tek ilerlenemeyecek kadar çok olan bir liste içindir. Enter ya da ekran klavyesinin eylemi, yazılan sayfayı `onPageChange` ile ister ve alanı sonraki numara için boşaltır. Odak alanda kalır: ikinci bir sayfa, yeniden basmadan yazılır. Hiçbir sayfanın olmayan bir numara en yakın sayfa sayılır: sıfır ilk sayfadır, sonuncudan büyük bir numara son sayfa. Boş alan bir şey istemez.

Alan yalnızca rakam alır: Batı rakamlarını ve temanın dilinin sayılarını yazdığı rakamları. İkisi de olmayan bir işaret yazılırken de, yapıştırılan bir metnin içinden de atılır. Son sayfanın numarasındaki haneden fazlasını almaz, bu yüzden bir numara hiçbir zaman alandan uzun olmaz: yazma orada durur ve daha çok haneli yapıştırılan bir numara alana konmaz; bir metin alanı sığmayan bir yapıştırmayı böyle geri çevirir. Telefonda, eylemi "git" olan bir sayı klavyesi açar (`numberKeyboardOptions`): iPhone'da sayılar ve noktalama klavyesini, çünkü oradaki sayı tuş takımında eylem tuşu yoktur.

Alan, son sayfanın numarasının en geniş rakamla gerektirdiği kadar ve bir hane fazlası kadar geniştir: birkaç hane, bir metin alanının genişliği değil. Platformun dokunma hedefinden ve kendi yüksekliğinden dar olmaz. Sözler alanın önünde, satırın başladığı yanda durur: sağdan okunan bir dilde sağda. Göz içindir. Ekran okuyucuya tek bir kontrol verilir: adı o sözler olan alan. Satır tek satırdır ve alan kadar yüksektir. Kendisinden geniş bir yerde, yerin başladığı kenardan başlar. Kendisine dar gelen bir yerde sözler yer verir, alan vermez.

Parametreler:

- `pageCount: Int`: Kaç sayfa olduğu: bir numaranın sayılabileceği son sayfa ve alanın tuttuğu hane sayısı. Birin altındaki sayı bir sayılır, `PantrixPagination`'da olduğu gibi.
- `onPageChange: (page: Int) -> Unit`: İstenen sayfayla çağrılır: numarasıyla, birden sayılarak.
- `modifier: Modifier`: Satıra uygulanır.
- `label: String`: Alanın önündeki sözler ve alanın ekran okuyucudaki adı: verilmezse temanın "Sayfaya git" sözleri.
- `enabled: Boolean`: Bir numaranın yazılıp yazılamadığı: kullanılamayan satırın sözleri devre dışı yazı rengindedir ve alanı devre dışıdır; odak almaz ve bunu söyler.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar. Satırın test etiketi `PageJump_<tagKey>`, sözlerininki `PageJump_<tagKey>.Text_label` olur. İçindeki alanın anahtarı `<tagKey>_page_jump`'tır ve bir metin alanı gibi etiketlenir: `TextField_<tagKey>_page_jump`. Bir etikete sığmayacak kadar uzun bir anahtar kesilir, `_page_jump` bütün kalır. İstenen sayfa, sayfasıyla birlikte `PageJump` olarak bildirilir; yazılan hiçbir zaman bildirilmez. Alanın odağı aldığı da satırın etiketiyle `PageJump` olarak bildirilir: satır tek bir bileşendir ve tek bir adla bildirir.

### PaginationStyle

`import com.pantrixui.components.data.pagination.PaginationStyle`, `com.pantrixui:components` içinden

```kotlin
class PaginationStyle(
    public val layout: PaginationLayout? = null,
    public val itemSize: Dp = Dp.Unspecified,
    public val itemShape: ShapeSpec = ShapeSpec.Unspecified,
    public val itemGap: Dp = Dp.Unspecified
) : PantrixStyle<PaginationStyle>
```

`PantrixPagination`'ın dizilişi ve geometrisi.

Her öğe, yani bir sayfanın numarası, önceki ve sonraki, en az `itemSize` boyunda bir karedir, `itemShape` şeklindedir ve yanındakinden `itemGap` uzakta durur; çevresinde platformun dokunma hedefi kadar yer boş tutulur. Aradaki boşluk yoğunlukla ölçeklenir, öğeler ölçeklenmez.

Parametreler:

- `layout: PaginationLayout?`: Sayfaların nasıl dizildiği: her platformda, yeri olan bir satırda numaralarıyla.
- `itemSize: Dp`: Bir sayfanın numarası, önceki ve sonraki: Android'de 40dp, iOS'ta 36dp, masaüstünde ve web'de 32dp. Ona sığmayan uzun bir numara öğesini genişletir. Önceki ve sonrakinin ikonları bunun yarısından 4dp büyüktür.
- `itemShape: ShapeSpec`: Bir öğenin, ekrandaki sayfa olduğunda dolgusunun ve odak halkasının köşeleri: Android'de ve iOS'ta yuvarlak, masaüstünde ve web'de küçük.
- `itemGap: Dp`: Satırdaki iki komşunun arası.

### PaginationLayout

`import com.pantrixui.components.data.pagination.PaginationLayout`, `com.pantrixui:components` içinden

```kotlin
enum class PaginationLayout
```

Bir `PantrixPagination`'ın sayfalarını nasıl dizdiği.

Değerleri:

- `Numbered`: Önceki, uzaktakileri boşluklara katlanmış olarak numaralarıyla sayfalar ve sonraki: sayfalar arasında atlanan yerler için. Buna dar gelen bir satır `Compact` olarak dizilir.
- `Compact`: Önceki, "Sayfa 3 / 10" ve sonraki: bir sayfadan ardındakine ilerlenen yerler için.

### PaginationColors

`import com.pantrixui.components.data.pagination.PaginationColors`, `com.pantrixui:components` içinden

```kotlin
data class PaginationColors(
    public val content: Color = Color.Unspecified,
    public val control: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir satır için `PantrixPagination`'ın renkleri: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
PantrixPagination(…, colors = PaginationColors(selectedContainer = PantrixTheme.colors.success.container))
```

Satırın kendi dolgusu yoktur, arkasında ne varsa onun üstünde durur. Bir dolgu, üstüne ne renkle yazıldığını söyler ve dolgunun üstündeki satırın tamamı o renkle yazılır: temanın yazı renkleri ve markasının dolgusu temanın kendi zeminleri içindir. Orada ekrandaki sayfa, aynı rengin bir payı olan bir dolguyla ayrılır.

Parametreler:

- `content: Color`: Ekranda olmayan sayfaların numaraları ve numaralara yeri olmayan bir satırın sözleri. Temanın `textPrimary` rengi.
- `control: Color`: Önceki ve sonraki, bir de katlanan sayfaların yerinde duran işaretler. Temanın `textSecondary` rengi.
- `selectedContainer: Color`: Ekrandaki sayfanın dolgusu. `primary` rolünün `container`'ı.
- `selectedContent: Color`: Ekrandaki sayfanın numarası: temanın `selectedContainer` ile eşlediği renk. Satırın kendiliğinden aldığı dolgunun üstünde bu, `primary` rolünün `onContainer`'ıdır. Temanın hiçbir rolünde olmayan bir dolgunun eşi yoktur ve tema onun üstüne satırın kendi dolgusundaki gibi yazar: böyle bir dolguya numarasının rengini de verin.

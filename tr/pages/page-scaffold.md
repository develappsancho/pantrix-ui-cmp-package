# Page Scaffold

Bir uygulamanın kabuğunun içindeki bir ekran: başında adı ve yapabildikleri, altında gösterdiği. Kabuk bir kez bir `PantrixScaffold` ile kurulur, gezinmesi dar pencerede altta, geniş pencerede yanda; her ekranı bu çerçeveler. Bu sayfadaki sayfalar kenarlı bir yüzeyin içindedir: sınırları böyle görünür. Kartın pencere seçicisiyle aynı sayfanın dar ve geniş hâli görülür.

- `PantrixPageScaffold` (`com.pantrixui.components.container.page`, `com.pantrixui:components`): Uygulamanın kabuğunun içinde bir ekran: üstte başlığı ve eylemleri, bir üst bölüm, ve barlardan ve klavyeden uzak tutulan, iyi okunduğu kadar geniş içeriği. Anahtar sözcükler: ekran, sayfa düzeni, sayfa başlığı, uygulama barı, araç çubuğu, ekran çerçevesi.

## Özellikler

- **Bar.** Sayfa kendi `PantrixTopBar`'ını çizer, scaffold çizmez: sayfa değişirken başlık da sayfayla gider. Bar'da `title`, `subtitle`, `onBack` verilince bir geri düğmesi ve eylemler durur. Bar'ın başlığı içerikle aynı hizadan, sayfanın kenar boşluğundan başlar. İçerik bar'ın altına kayınca bar'ın alt kenarına bir çizgi çekilir.
- **Geniş sayfada başlık.** `titlePlacement = PageTitlePlacement.Adaptive` ile Expanded'dan itibaren bar yoktur: başlık içeriğin başında büyük yazılır, altında alt başlık, yanında eylemler etiketli düğmelerdir. Daha dar sayfada bar'dadırlar.
- **Büyük başlık.** `largeTitle` ile başlık bar'ın altında büyük yazılır ve içerik kaydıkça bar'a çıkar; her platformda aynı.
- **Başlığın altındakiler.** `header` başlığın altında içerikle birlikte kayar: bir açıklama, bir uyarı. `stickyHeader` bar'ın altında durur: sekmeler, arama, süzgeçler. Çizgi o zaman onun altındadır.
- **Eylemler.** `actions` yere göre dizilir: geniş sayfada etiketli düğmeler, birincil olan dolu; Compact'ta ikonlar, adları tooltip'te ve ekran okuyucuda. Sığmayan, Compact'ta ikonu olmayan, verildiği sırayla "…" menüsündedir. `onAction` basılanın anahtarını alır. `trailing` her zaman onların arkasındadır: uygulamanın kendi düğmeleri.
- **Kaydırma.** `PageScroll.Page` ile başlık, `header` ve içerik birlikte kayar. `PageScroll.None` ile içerik bar'ın altındaki yeri doldurur ve kendisi kayar, bırakacağı payı `contentPadding` ile alır. Bir listenin sayfası `PantrixLazyPageScaffold`'dur: başlığı ve `header`'ı listenin ilk satırlarıdır.
- **Genişlik.** Sayfa varsayılan olarak (`PageWidth.Full`) geniş pencerede de bütün genişliği alır: kartlar, bir tablo, bir pano. `PageWidth.Content` okunan bir sayfayı temanın içerik genişliğinde, başlığın hizasında tutar.
- **Paylar ve klavye.** Sayfa çevresindeki `PantrixScaffold`'un payını kendisi okur (`LocalPantrixScaffoldPadding`) ve içindekilere geçirmez: bir sayfanın içindeki sayfa aynı payı bir daha bırakmaz. Sayfa klavyenin üstünde biter; odak alan bir alan alt bar'ın arkasında kalmaz.
- **Pencerenin başlığı.** Sayfa web'de sekmenin, masaüstünde pencerenin başlığını kendi adıyla değiştirir (`PantrixWindowTitle`); uygulama adını `LocalPantrixWindowTitleFormat` ile ekler. Bir sayfanın içindeki sayfa, bu sayfadaki örnekler gibi, başlığı dıştakine bırakır.
- **Ekran okuyucu, olay ve etiketler.** Başlık sayfanın başlığı ve bölmenin adıdır. `tagKey` verilen sayfa her açılışında bir `show` olayı bildirir, başlığını değil etiketini; içine konanlar `TestScope(tagKey)` içindedir.

## Kullanım

### A page of the app's admin

```kotlin
PantrixPageScaffold(
    title = stringResource(Res.string.orders),
    subtitle = stringResource(Res.string.orders_open, openCount),
    actions = listOf(
        PageAction(key = "new", label = stringResource(Res.string.new_order), icon = PantrixIcons.Plus, primary = true),
        PageAction(key = "export", label = stringResource(Res.string.export), icon = PantrixIcons.Download)
    ),
    onAction = { key -> if (key == "new") onNewOrder() else onExport() },
    titlePlacement = PageTitlePlacement.Adaptive,
    tagKey = "orders"
) {
    OrdersSummary(orders)
}
```

### Tabs that stay under the bar, and a table that scrolls itself

```kotlin
PantrixPageScaffold(
    title = stringResource(Res.string.products),
    onBack = onBack,
    stickyHeader = { ProductTabs(tab, onTabChange = { tab = it }) },
    scroll = PageScroll.None,
    tagKey = "products"
) {
    ProductsTable(products, contentPadding = contentPadding)
}
```

## Örnekler

### Bir yönetim sayfası

Bir yönetim panelinin siparişler sayfası. `titlePlacement = PageTitlePlacement.Adaptive`: kartın seçicisinde "Geniş"e geç, başlık ve eylemler içeriğin başına iner ve bar kalkar; "Dar"da bar'dadırlar ve eylemler ikonlara döner. "Arşivle"nin ikonu yoktur: dar sayfada "…" menüsündedir. Basılan eylemin anahtarı sayfanın içinde yazar.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.page.PageAction
import com.pantrixui.components.container.page.PageTitlePlacement
import com.pantrixui.components.container.page.PantrixPageScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var pressed by rememberSaveable { mutableStateOf<String?>(null) }
PageExampleFrame {
    PantrixPageScaffold(
        title = "Siparişler",
        subtitle = "12 açık",
        actions = listOf(
            PageAction(key = "new", label = "Yeni sipariş", icon = PantrixIcons.Plus, primary = true),
            PageAction(key = "export", label = "Dışa aktar", icon = PantrixIcons.Download),
            PageAction(key = "archive", label = "Arşivle")
        ),
        onAction = { pressed = it },
        header = {
            PantrixText("Son 30 günün siparişleri", color = PantrixTheme.colors.textSecondary)
        },
        titlePlacement = PageTitlePlacement.Adaptive,
        tagKey = "orders"
    ) {
        PantrixText(pressed?.let { "Son basılan: $it" } ?: "Henüz bir eyleme basılmadı")
        repeat(5) { index ->
            PantrixCard(modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                PantrixText("Sipariş #${1040 + index}", modifier = Modifier.padding(16.dp))
            }
        }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### Bar'ın altında sekmeler, kendi kayan bir liste

Sekmeler bar'ın altında durur (`stickyHeader`), liste kendisi kayar (`scroll = PageScroll.None`) ve sayfanın bıraktığı payı `contentPadding` ile alır: son satırı payın içinde, kenar boşluğu satırların içinde. Listeyi kaydır: çizgi sekmelerin altında belirir. Geri düğmesine basınca alt başlık sayar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.page.PageScroll
import com.pantrixui.components.container.page.PantrixPageScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var tab by rememberSaveable { mutableIntStateOf(0) }
var backs by rememberSaveable { mutableIntStateOf(0) }
val tabs = listOf(TabItem("Tümü"), TabItem("Satışta"), TabItem("Tükendi"))
PageExampleFrame {
    PantrixPageScaffold(
        title = "Ürünler",
        subtitle = if (backs == 0) null else "Geri'ye $backs kez basıldı",
        onBack = { backs++ },
        stickyHeader = { PantrixTabs(tabs = tabs, selectedIndex = tab, onSelect = { tab = it }, tagKey = "stock") },
        scroll = PageScroll.None,
        tagKey = "products"
    ) {
        LazyColumn(contentPadding = contentPadding, verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(List(20) { "${tabs[tab].label}: ürün ${it + 1}" }) { product -> PantrixText(product) }
        }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### Büyük başlık ve bir liste

Bir listenin sayfası: `PantrixLazyPageScaffold`. Satırlar göründükçe kurulur; `header` listenin ilk satırıdır. `largeTitle = true`: başlık bar'ın altında büyük yazılır, liste kaydıkça bar'a çıkar. `trailing` bar'ın sonuna uygulamanın kendi düğmesini koyar. `width = PageWidth.Content`: okunan bir liste geniş pencerede temanın içerik genişliğinde kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.page.PageWidth
import com.pantrixui.components.container.page.PantrixLazyPageScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PageExampleFrame {
    PantrixLazyPageScaffold(
        title = "Gelen kutusu",
        trailing = {
            PantrixIconButton(PantrixIcons.Search, contentDescription = "Ara", onClick = {}, tagKey = "search")
        },
        header = { PantrixText("4 okunmamış ileti", color = PantrixTheme.colors.textSecondary) },
        largeTitle = true,
        width = PageWidth.Content,
        verticalArrangement = Arrangement.spacedBy(12.dp),
        tagKey = "inbox"
    ) {
        items(List(30) { "İleti ${it + 1}" }) { message -> PantrixText(message) }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### Kabuğun içinde, kendi ölçüleriyle

Kabuğun içinde bir sayfa: `PantrixScaffold`'un alt bar'ı var, sayfa onun payını kendisi okur ve son satırını bar'ın üstünde bırakır. `padding` verilmese de odur (`LocalPantrixScaffoldPadding.current`); burada açıkça yazılı. `style` sayfanın kenar boşluğunu ve bölümlerin arasını değiştirir.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.page.PageScaffoldStyle
import com.pantrixui.components.container.page.PantrixPageScaffold
import com.pantrixui.components.container.scaffold.LocalPantrixScaffoldPadding
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PageExampleFrame {
    PantrixScaffold(
        bottomBar = { insets ->
            PantrixSurface(modifier = Modifier.fillMaxWidth().padding(insets).height(56.dp)) {
                PantrixText("Alt bar", modifier = Modifier.align(Alignment.Center))
            }
        }
    ) {
        PantrixPageScaffold(
            title = "Ayarlar",
            header = { PantrixText("Kenar boşluğu 24 dp, bölümlerin arası 8 dp") },
            padding = LocalPantrixScaffoldPadding.current,
            style = PageScaffoldStyle(horizontalPadding = 24.dp, sectionGap = 8.dp),
            tagKey = "settings"
        ) {
            repeat(12) { index -> PantrixText("Ayar ${index + 1}", modifier = Modifier.padding(vertical = 8.dp)) }
        }
    }
}

@Composable
private fun PageExampleFrame(content: @Composable () -> Unit) {
    PantrixSurface(
        modifier = Modifier.fillMaxWidth().height(PAGE_EXAMPLE_HEIGHT),
        border = PantrixTheme.colors.divider
    ) {
        Box { content() }
    }
}

private val PAGE_EXAMPLE_HEIGHT = 420.dp
```

### Pencerenin başlığı

Pencerenin başlığı bir sayfa olmadan da verilir: `PantrixWindowTitle` ekranın adını, `LocalPantrixWindowTitleFormat` onu pencereye nasıl yazacağını söyler. Anahtarı aç: web'de sekmenin, masaüstünde pencerenin başlığı "Raporlar — Yönetim" olur; kapatınca bu sayfanınki geri gelir. Android'de ve iOS'ta kullanıcıya görünen bir pencere başlığı yoktur.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.platform.LocalPantrixWindowTitleFormat
import com.pantrixui.foundation.platform.PantrixWindowTitle
import com.pantrixui.foundation.platform.PantrixWindowTitleFormat

var named by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = named,
    onCheckedChange = { named = it },
    label = "Pencereye \"Raporlar\" adını ver",
    tagKey = "window_title"
)
if (named) {
    CompositionLocalProvider(LocalPantrixWindowTitleFormat provides PantrixWindowTitleFormat { "$it — Yönetim" }) {
        PantrixWindowTitle("Raporlar")
    }
}
```

## API

### PantrixPageScaffold

`import com.pantrixui.components.container.page.PantrixPageScaffold`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixPageScaffold(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    onBack: (() -> Unit)? = null,
    actions: List<PageAction> = emptyList(),
    onAction: (key: String) -> Unit = {},
    trailing: (@Composable RowScope.() -> Unit)? = null,
    header: (@Composable () -> Unit)? = null,
    stickyHeader: (@Composable () -> Unit)? = null,
    titlePlacement: PageTitlePlacement = PageTitlePlacement.Bar,
    largeTitle: Boolean = false,
    width: PageWidth = PageWidth.Full,
    scroll: PageScroll = PageScroll.Page,
    padding: PaddingValues = LocalPantrixScaffoldPadding.current,
    style: PageScaffoldStyle? = null,
    tagKey: String? = null,
    content: @Composable PageScaffoldScope.() -> Unit
)
```

Bir uygulamanın kabuğunun içindeki bir ekran: başında başlığı ve yapabildikleri, altında gösterdiği; kabuğun bar'larından, klavyeden ve pencerenin kenarlarından uzakta. Bir uygulama kabuğunu bir kez bir `PantrixScaffold` ile kurar, gezinmesi dar pencerede altta, geniş pencerede yanda; her ekranını bununla.

- **Bar.** Sayfa kendi `PantrixTopBar`'ını çizer, scaffold hiçbirini: bir sayfa ötekinin üstüne kayarken başlık kendi sayfasıyla gider. Bar'da sayfanın `title`'ı ve `subtitle`'ı, `onBack` verilmişse bir geri düğmesi ve `actions` durur. Başlığı içeriğin başladığı yerden, sayfanın kenar boşluğundan başlar. İçerik altına kaydığında bar alt kenarına bir çizgi çeker.

- **Geniş sayfada başlık.** `PageTitlePlacement.Adaptive` ile Expanded'dan itibaren sayfanın bar'ı yoktur: başlığı içeriğinin başında büyük yazılmış bir başlıktır, altında alt başlık, ardında eylemler etiketli düğmeler olarak; içerikle birlikte kayar. Daha darda bar'dadır. Sayfa, bir scaffold gibi, pencerenin değil kendi genişliğine bakar: bir pencerenin bir parçasındaki sayfa kendini sahip olduğu yere göre dizer.

- **Büyük başlık.** `largeTitle` ile bar'ın başlığı altında büyük yazılmış durur ve içerik kaydıkça bar'a çıkar, her platformda.

- **Üst kısım.** `header` başlığın altında, içeriğin üstünde durur ve onlarla kayar: bir ekmek kırıntısı, sayfanın ne için olduğunu söyleyen bir satır, bir uyarı. `stickyHeader` bar'ın altında durur ve orada kalır: sekmeler, bir arama, süzgeçler. Kaydırılmış sayfanın çizgisi o zaman yapışan üst kısmın altındadır.

- **Eylemler.** `actions` yere göre dizilir: geniş bir sayfada her biri etiketli bir düğme, birincil olan dolu; Compact bir sayfada her biri ikonu, etiketi tooltip'te ve ekran okuyucu için. Yeri olmayan, Compact sayfada ikonu da olmayan, verildiği sırayla bir "…" düğmesinin arkasındaki menüdedir. `onAction` basılanın anahtarını alır. `trailing` her zaman onların ardında durur: uygulamanın kendi düğmeleri, bir hesap.

- **Kaydırma.** `PageScroll.Page` ile başlık, üst kısım ve içerik birlikte kayar. `PageScroll.None` ile içerik bar'ın altındaki yeri doldurur ve kendisi kayar, bir tablo ya da bir harita; bırakacağı payı `contentPadding` olarak alır. Bar'ın çizgisi ve büyük başlık onun kaymasını izler. Bir listenin sayfası bir `PantrixLazyPageScaffold`'dur.

- **Genişlik.** Varsayılan `PageWidth.Full` ile sayfanın gösterdiği, geniş pencerede de, sayfanın genişliğini alır. `PageWidth.Content` ile temanın içerik genişliğinden, `PantrixTheme.layout.maxContentWidth`, geniş olmaz ve başta, başlığın altında durur: okunan bir sayfa. İçindeki daha dar bir form yerleşimin sütunlarını kullanır.

- **Pay.** Sayfa `padding`'in söylediğinden uzak durur, verilmezse çevreleyen `PantrixScaffold`'unkinden: bar'larından ve pencerenin paylarından, üstte bar'ın, altta bir bar'ın yerinden. Yanlarında temanın pencerenin sınıfıyla büyüyen sayfa kenar boşluğunu, içeriğinin üstünde ve altında stilin payını bırakır. Tuttuklarına scaffold'un payından hiçbir şey geçirmez: içindeki bir sayfa o payı bir daha bırakmaz.

- **Klavye ve odak.** Sayfa klavyenin üstünde biter; alta yakın odak alan bir alan alttaki bir bar'ın arkasına değil, üstüne getirilir. Klavye açılırken sayfa sıçramaz.

- **Pencerenin başlığı.** Sayfa gösterildiği sürece pencereye kendi adını verir: web'de tarayıcının sekmesine, masaüstünde başlık çubuğuna (`PantrixWindowTitle`). Bir uygulama kendi adını `LocalPantrixWindowTitleFormat` ile ardına yazar. Başka bir sayfanın içeriğindeki bir sayfa, bir sayfanın örneği gibi, pencerenin başlığını içinde durduğu sayfaya bırakır.

- **Ekran okuyucu.** Başlık sayfanın başlığıdır ve sayfa görünüme girerken adıdır; Android'de TalkBack onu söyler. Compose bir bölmenin adını VoiceOver'a söylemez.

- **Gösterildi bildirimi.** `tagKey`'i olan bir sayfa her kompozisyona girişinde temanın analitiğine bir `show` olayı bildirir: bir uygulama ekranlarının görüntülenmesini onunla sayar. Android'de yeniden kurulan bir activity, cihaz döndüğünde olduğu gibi, kompozisyona yeniden girer. Başlık olayda hiç yoktur.

- **Otomasyon.** Sayfa `PageScaffold_<tagKey>`, bar'ı `TopBar_<tagKey>`, bir eylem `PageScaffold_<tagKey>.Action_<key>` ve "…" düğmesi `PageScaffold_<tagKey>.More_actions` etiketini taşır; menüsü `Menu_<tagKey>_actions`'dır. Uygulamanın sayfaya koyduğu, üst kısmı, yapışan üst kısmı, içeriği ve `trailing`, `TestScope(tagKey)` içindedir: orada `save` etiketli bir düğme `orders.Button_save`'dir ve bildirdiği olay `orders` ekranındadır. Bir sayfa yerini ötekine bırakırken, bir geri hareketi tutulurken de, iki sayfa birlikte durur: ikisinin de gösterdiği bir düğme, her sayfanın `trailing`'indeki gibi, her sayfanın kendi `tagKey`'i yoksa iki kez etiketlenir.

- **Okuma yönü.** Sayfa baştan dizilir: dil sağdan sola okunuyorsa sağdan.

Sayfa kendisine verilen yeri alır; o yer iki yönde de sınırlı olmalıdır: bir scaffold'un içeriği ya da `Modifier.fillMaxSize()`.

Parametreler:

- `title: String`: sayfanın adı: bar'ında ya da başlığında, ekran okuyucu için adı ve pencereninki.
- `modifier: Modifier`: sayfanın modifier'ı.
- `subtitle: String?`: başlığın altında bir satır, bir sayı ya da bir durum; yoksa null.
- `onBack: (() -> Unit)?`: sayfanın geri döndüğü yer, bar'ının geri düğmesi olarak; dönülecek bir yer yoksa null. Sistemin geri hareketini, bir el hareketini ya da bir tuşu uygulamanın gezinmesi dinler.
- `actions: List<PageAction>`: sayfanın yapabildikleri, en çok kullanılan başta: yere göre dizilir, geri kalanı bir menüdedir. Her birinin aralarında kendine ait bir anahtarı vardır.
- `onAction: (key: String) -> Unit`: basılan eylemin anahtarını alır.
- `trailing: (@Composable RowScope.() -> Unit)?`: eylemlerin ardında her zaman duran, bir satırda: uygulamanın kendi düğmeleri.
- `header: (@Composable () -> Unit)?`: başlığın altında, içeriğin üstünde duran ve onlarla kayan.
- `stickyHeader: (@Composable () -> Unit)?`: bar'ın altında duran ve sayfa kayarken orada kalan.
- `titlePlacement: PageTitlePlacement`: başlığın her genişlikte bar'da mı, geniş bir sayfada içerikte mi olduğu.
- `largeTitle: Boolean`: bar'ın başlığının altında büyük yazılmış durup durmadığı ve sayfa kaydıkça bar'a çıkıp çıkmadığı.
- `width: PageWidth`: sayfanın gösterdiğinin genişliği: sayfanınki ya da temanın içerik genişliği.
- `scroll: PageScroll`: sayfanın mı kaydığı, yoksa içeriğinin mi kendisi kaydığı.
- `padding: PaddingValues`: sayfanın kenarlarında uzak durduğu: verilmezse çevreleyen scaffold'un payı.
- `style: PageScaffoldStyle?`: sayfanın geometrisi, temanınkinin üstünde.
- `tagKey: String?`: sayfanın otomasyon anahtarı, her dilde aynı: sayfanın ve parçalarının etiketlendiği, tuttuklarının TestScope'u ve `show` olayının ait olduğu sayfa.
- `content: @Composable PageScaffoldScope.() -> Unit`: sayfanın gösterdiği, bir sütunda; `PageScroll.None` ile bırakacağı payı `PageScaffoldScope.contentPadding` olarak alır.

### PantrixLazyPageScaffold

`import com.pantrixui.components.container.page.PantrixLazyPageScaffold`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixLazyPageScaffold(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    onBack: (() -> Unit)? = null,
    actions: List<PageAction> = emptyList(),
    onAction: (key: String) -> Unit = {},
    trailing: (@Composable RowScope.() -> Unit)? = null,
    header: (@Composable () -> Unit)? = null,
    stickyHeader: (@Composable () -> Unit)? = null,
    titlePlacement: PageTitlePlacement = PageTitlePlacement.Bar,
    largeTitle: Boolean = false,
    width: PageWidth = PageWidth.Full,
    state: LazyListState = rememberLazyListState(),
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    padding: PaddingValues = LocalPantrixScaffoldPadding.current,
    style: PageScaffoldStyle? = null,
    tagKey: String? = null,
    content: LazyListScope.() -> Unit
)
```

İçeriği bir liste olan bir `PantrixPageScaffold`: satırları görünüme girdikçe kurulur, başlığı ve üst kısmı listenin onunla kayan ilk satırlarıdır. Geri kalan her şey sayfanınkidir: bar, eylemler, yapışan üst kısım, bıraktığı pay, klavye, pencerenin başlığı, olay ve etiketler.

Parametreler:

- `title: String`: sayfanın adı: bar'ında ya da başlığında, ekran okuyucu için adı ve pencereninki.
- `modifier: Modifier`: sayfanın modifier'ı.
- `subtitle: String?`: başlığın altında bir satır, bir sayı ya da bir durum; yoksa null.
- `onBack: (() -> Unit)?`: sayfanın geri döndüğü yer, bar'ının geri düğmesi olarak; dönülecek bir yer yoksa null.
- `actions: List<PageAction>`: sayfanın yapabildikleri, en çok kullanılan başta: yere göre dizilir, geri kalanı bir menüdedir.
- `onAction: (key: String) -> Unit`: basılan eylemin anahtarını alır.
- `trailing: (@Composable RowScope.() -> Unit)?`: eylemlerin ardında her zaman duran, bir satırda: uygulamanın kendi düğmeleri.
- `header: (@Composable () -> Unit)?`: başlığın altında listenin ilk satırı olarak duran ve onunla kayan.
- `stickyHeader: (@Composable () -> Unit)?`: bar'ın altında duran ve liste kayarken orada kalan.
- `titlePlacement: PageTitlePlacement`: başlığın her genişlikte bar'da mı, geniş bir sayfada içerikte mi olduğu.
- `largeTitle: Boolean`: bar'ın başlığının altında büyük yazılmış durup durmadığı ve liste kaydıkça bar'a çıkıp çıkmadığı.
- `width: PageWidth`: satırların genişliği: sayfanınki ya da baştan itibaren temanın içerik genişliği. Liste her iki durumda da sayfanın bütün genişliğinde kayar.
- `state: LazyListState`: listenin kayması: `rememberLazyListState` ile tutulur, listenin nerede olduğu ondan okunur.
- `verticalArrangement: Arrangement.Vertical`: satırların liste boyunca nasıl durduğu: verilmezse alt alta.
- `padding: PaddingValues`: sayfanın kenarlarında uzak durduğu: verilmezse çevreleyen scaffold'un payı.
- `style: PageScaffoldStyle?`: sayfanın geometrisi, temanınkinin üstünde.
- `tagKey: String?`: sayfanın otomasyon anahtarı, `PantrixPageScaffold`'unki gibi.
- `content: LazyListScope.() -> Unit`: listenin satırları, bir `LazyColumn`'unkiler gibi.

### PageAction

`import com.pantrixui.components.container.page.PageAction`, `com.pantrixui:components` içinden

```kotlin
class PageAction(
    public val key: String,
    public val label: String,
    public val icon: ImageVector? = null,
    public val primary: Boolean = false,
    public val enabled: Boolean = true,
    public val destructive: Boolean = false,
    public val tagKey: String? = null
)
```

Bir sayfanın yapabildiği, başında gösterilen bir şey: dışa aktarmak, süzmek, yeni bir sipariş.

Sayfa eylemlerini yerine göre dizer. Geniş bir sayfada her biri `label`'ı yazan bir düğmedir, `primary` olan dolu; dar bir sayfada her biri `icon`'udur, etiketi ekran okuyucunun ve tooltip'in söylediğidir. Yeri olmayan, dar sayfada ikonu da olmayan, bir "…" düğmesinin arkasındaki menüdedir, eylemlerin verildiği sırayla: ilk verilen en son katlanır.

Parametreler:

- `key: String`: Eyleme basılınca sayfanın `onAction`'ının bildirdiği. Her dilde aynıdır; aynı eylemin anahtarı nerede gösterilirse gösterilsin aynıdır.
- `label: String`: Eylemin adı: düğmenin metni ve ekran okuyucu için adı.
- `icon: ImageVector?`: Yalnızca ikonuna yer olan yerde eylemin yerini tutan, menüde etiketinin önünde duran; hep yazıyla gösterilen bir eylem için null, o eylem dar sayfada menüdedir.
- `primary: Boolean`: Sayfanın asıl bunun için olup olmadığı: geniş sayfada dolu bir düğme. Bir sayfanın en çok bir eylemi birincildir.
- `enabled: Boolean`: Eyleme şimdi basılıp basılamayacağı. Basılamayan, devre dışı metnin rengiyle çizilir.
- `destructive: Boolean`: Eylemin geri alınamayacak bir şeyi silip silmediği ya da bozup bozmadığı: tehlike rengiyle çizilir.
- `tagKey: String?`: Eylemin otomasyon anahtarı, her dilde aynı, `key`'den başka olacaksa: eylem `Action_<tagKey>`'dir, anahtarı olan bir sayfanın etiketinin içinde, `PageScaffold_orders.Action_export` gibi.

### PageTitlePlacement

`import com.pantrixui.components.container.page.PageTitlePlacement`, `com.pantrixui:components` içinden

```kotlin
enum class PageTitlePlacement
```

Bir `PantrixPageScaffold`'un başlığını, alt başlığını ve eylemlerini yazdığı yer.

Değerleri:

- `Bar`: Sayfanın üst bar'ında, genişliği ne olursa olsun.
- `Adaptive`: Sayfa Expanded'dan darken üst bar'da; Expanded'dan itibaren içeriğinin başında büyük yazılmış bir başlık olarak, bar olmadan: bir uygulamanın yönetim sayfasının masaüstünde okunduğu gibi.

### PageWidth

`import com.pantrixui.components.container.page.PageWidth`, `com.pantrixui:components` içinden

```kotlin
enum class PageWidth
```

Bir `PantrixPageScaffold`'un içeriğinin genişliği.

Değerleri:

- `Content`: En çok temanın içerik genişliği, `PantrixTheme.layout.maxContentWidth`, baştan itibaren: okunan bir sayfa, çünkü geniş bir pencereyi baştan sona geçen bir satır okunmaz.
- `Full`: Sayfa kadar geniş, varsayılan: kartların sayfası, bir tablo ya da bir pano olan bütün yeri kullanır.

### PageScroll

`import com.pantrixui.components.container.page.PageScroll`, `com.pantrixui:components` içinden

```kotlin
enum class PageScroll
```

Bir `PantrixPageScaffold`'da kayan.

Değerleri:

- `Page`: Sayfa: başlığı, üst kısmı ve içeriği bar'ın altında birlikte kayar.
- `None`: Sayfanın kendisinden hiçbir şey: içerik bar'ın altındaki yeri doldurur ve kendisi kayar, bir tablo, bir harita ya da sayfanın tutmadığı bir liste; bırakacağı payı `PageScaffoldScope.contentPadding` ile alır.

### PageScaffoldScope

`import com.pantrixui.components.container.page.PageScaffoldScope`, `com.pantrixui:components` içinden

```kotlin
interface PageScaffoldScope : ColumnScope
```

Bir `PantrixPageScaffold`'un içeriğine verilen: içinde dizileceği bir sütun ve bırakacağı pay.

Üyeleri:

- `contentPadding: PaddingValues`: İçeriğin kendisinin bıraktığı pay: sayfa kayıyorsa sıfır, çünkü payı o zaman sayfa bırakır. `PageScroll.None` ile yanlarda sayfanın kenar boşlukları, üstte ve altta sayfanın payı ve alttaki bir bar'ın payıdır; bir liste son satırlarını kendi `contentPadding`'iyle bunun dışına kaydırır.

### PageScaffoldStyle

`import com.pantrixui.components.container.page.PageScaffoldStyle`, `com.pantrixui:components` içinden

```kotlin
class PageScaffoldStyle(
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val sectionGap: Dp = Dp.Unspecified,
    public val actionGap: Dp = Dp.Unspecified,
    public val topBar: TopBarStyle? = null
) : PantrixStyle<PageScaffoldStyle>
```

`PantrixPageScaffold`'un geometrisi: sayfanın tuttuklarının çevresindeki ve parçalarının arasındaki yer.

Sayfanın yanlarındaki yer, `horizontalPadding` bir tane vermedikçe temanın sayfa kenar boşluğudur, `PantrixTheme.layout.margin`; pencerenin sınıfıyla büyür. Bar'ın başlığı içeriğin başladığı yerden, o boşluktan başlar. Yerler yoğunluğu izler. Sayfanın renkleri temanındır: zemini ve bar'ın yüzeyi.

Parametreler:

- `horizontalPadding: Dp`: Sayfanın yanlarıyla tuttukları arasındaki yer, scaffold'un payından sonra: verilmezse belirsizdir, yani temanın sayfa kenar boşluğudur.
- `verticalPadding: Dp`: Sayfanın tuttuklarının üstündeki ve altındaki yer: Android'de ve iOS'ta 16dp, masaüstünde ve web'de 24dp.
- `sectionGap: Dp`: Sayfanın başlığı, üst kısmı ve içeriği arasındaki yer: Android'de ve iOS'ta 16dp, masaüstünde ve web'de 24dp.
- `actionGap: Dp`: Sayfanın iki eylemi arasındaki ve eylemlerle yanlarındaki arasındaki yer: 8dp.
- `topBar: TopBarStyle?`: Sayfanın bar'ının kendi geometrisi, temanınkinin üstünde. Bu bir yer vermedikçe bar'ın başlığı `horizontalPadding`'den başlar.

### LocalPantrixScaffoldPadding

`import com.pantrixui.components.container.scaffold.LocalPantrixScaffoldPadding`, `com.pantrixui:components` içinden

```kotlin
val LocalPantrixScaffoldPadding: ProvidableCompositionLocal<PaddingValues>
```

Çevreleyen `PantrixScaffold`'un içeriğine verdiği pay, `content`'ine verildiği gibi: bir ekranı bar'lardan ve paylardan uzak tutan. Scaffold'un derinindeki bir ekran, aralarında bir `PantrixPageScaffold`, onu kendisine aşağı taşınmasını beklemeden burada okur. Bir scaffold'un dışında sıfırdır.

### PantrixWindowTitle

`import com.pantrixui.foundation.platform.PantrixWindowTitle`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixWindowTitle(title: String)
```

Pencereye, o ekran kompozisyonda kaldıkça, içinde gösterilen ekranın adını verir: web'de tarayıcı sekmesinin başlığı, masaüstünde başlık çubuğununki. Tek pencereli, çok ekranlı bir uygulama yoksa ne gösterilirse gösterilsin açıldığı adı taşır: tarayıcının her sekmesi uygulamanın adını söyler, geçmişinin her girdisi de.

```kotlin
PantrixWindowTitle(stringResource(Res.string.orders))
```

- **Nasıl yazılır.** `LocalPantrixWindowTitleFormat` `title`'ı pencereninki olarak yazar: bir uygulama onu bir kez, kökünde verir ve kendi adını her ekranınkinin ardına koyar, `Siparişler · Yönetim`.

- **Aynı anda birkaç.** Biri ötekinin üstüne kayarken iki ekran kompozisyonda birliktedir, yan yana bir liste ve ayrıntısı da: pencereye en son gelen ad verir. O çıkınca ondan öncesi yine ad verir; hiçbiri kalmayınca pencerenin kendi başlığı geri gelir, web'de sayfanın `<title>`'ı, masaüstünde `Window`'una verilen.

- **Android ve iOS.** İkisi de kullanıcısına bir pencere başlığı göstermez: orada bir şey yapmaz.

Tamamı docs/guide/window-title/WINDOW_TITLE_GUIDE.md'dedir; bu kütüphane olmadan aynısı da oradadır.

Parametreler:

- `title: String`: ekranın adı, kendi başlığının söylediği gibi: `Siparişler`.

### PantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.PantrixWindowTitleFormat`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixWindowTitleFormat
```

Bir ekranın başlığının penceresininki olarak nasıl yazıldığı: `PantrixWindowTitleFormat { "$it · Admin" }` uygulamanın adını ardına koyar. Bir uygulama onu `LocalPantrixWindowTitleFormat` ile verir.

Üyeleri:

- `fun format(title: String): String`: Adı `title` olan bir ekran için pencerenin başlığı.

Tipin kendisinde:

- `PantrixWindowTitleFormat.Plain: PantrixWindowTitleFormat`: Ekranın başlığı olduğu gibi: bir uygulama başka bir biçim vermedikçe pencerenin adı.

### LocalPantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.LocalPantrixWindowTitleFormat`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixWindowTitleFormat: ProvidableCompositionLocal<PantrixWindowTitleFormat>
```

`PantrixWindowTitle`'ın bir ekranın başlığını penceresininki olarak nasıl yazdığı: verilmezse `PantrixWindowTitleFormat.Plain`.

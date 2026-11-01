# Tabs

Aynı içeriğin görünümleri arasında geçen bir sekme satırı: biri seçilidir ve bir işaret, bir sonraki seçilene kayar.

Sekmeler yalnızca satırdır; seçilen görünümü uygulama, satırın altında kendisi çizer. Hangi sekmenin seçili olduğu da ekranın durumudur: satıra sırası verilir (`selectedIndex`), kullanıcının seçtiği geri bildirilir (`onSelect`). Satır kendiliğinden bir şey seçmez.

- `PantrixTabs` (`com.pantrixui.components.container.tab`, `com.pantrixui:components`): Aynı içeriğin görünümleri arasında geçiş yapan, biri seçili bir sekme satırı; ok tuşları seçimi taşır. Anahtar sözcükler: sekmeler, sekme satırı, sekmeli görünüm, sekme düzeni, sayfa sekmeleri.

## Özellikler

- **İşaret.** Seçili sekmeyi stilin `indicator`'ı işaretler: altında bir çizgi, üstünde bir çizgi, arkasında bir hap ya da yalnızca rengi. İşaret seçim değişince kayar; hareketin azaltıldığı temada yerine hemen geçer.
- **Paylaşılan ya da kayan satır.** Sekmeler satırın genişliğini paylaşır. `scrollable` ile her biri etiketi kadar geniştir ve satır yana kayar: seçili sekmede açılır, sonra seçileni ortasına getirir.
- **İkon ve rozet.** `TabItem.icon` etiketin önünde, `TabItem.badge` arkasında durur: bir sayı ya da bir nokta. Sekme dar kaldığında kısaltılan etikettir, rozet bütün kalır.
- **Devre dışı sekme.** `enabled`'ı false olan sekmeye basmak bir şey yapmaz, ok tuşları onu atlar ve hangi renk verilirse verilsin temanın devre dışı yazı rengiyle çizilir.
- **Klavye.** Satır Tab tuşu için tek bir duraktır, seçili sekmenin üstünde. Ok tuşları sonraki ve önceki sekmeyi seçer, sağdan sola düzende ters yönde; Home ve End ilkini ve sonuncuyu. Bir sekme odaktayken odak seçimle birlikte gider.
- **Ekran okuyucu.** Her sekme, seçili olup olmadığını söyleyen bir sekmedir ve hepsi tek bir gruptur. Rozetin açıklaması etiketten sonra, sekmenin parçası olarak okunur.
- **Platform.** Bir sekmenin en az yüksekliği Android'de 48dp, iOS'ta 44dp, masaüstünde ve web'de 40dp'dir; sekme hiçbir zaman platformun dokunma hedefinden alçak olmaz.
- **Renk.** Satırın kendi dolgusu yoktur: sayfanın ya da bir yüzeyin üstünde durur. `TabsColors` seçili ve seçili olmayan sekmelerin, işaretin ve alttaki ince çizginin rengini verir.
- **Otomasyon.** `tagKey` ile satır `Tabs_<tagKey>`, sekmeleri `Tabs_<tagKey>.Tab_<key>` olur. Bir seçim, sekmenin sırasıyla ve basışla mı tuşla mı yapıldığıyla bildirilir; etiketiyle hiçbir zaman.

## Kullanım

### Views of one account

```kotlin
var tab by rememberSaveable { mutableIntStateOf(0) }
Column {
    PantrixTabs(
        tabs = listOf(
            TabItem(stringResource(Res.string.overview), tagKey = "overview"),
            TabItem(stringResource(Res.string.activity), tagKey = "activity"),
            TabItem(stringResource(Res.string.settings), tagKey = "settings")
        ),
        selectedIndex = tab,
        onSelect = { tab = it },
        tagKey = "account"
    )
    when (tab) {
        0 -> AccountOverview()
        1 -> AccountActivity()
        else -> AccountSettings()
    }
}
```

### Many categories in a row that scrolls

```kotlin
PantrixTabs(
    tabs = categories.map { TabItem(it.name, icon = it.icon, tagKey = it.id) },
    selectedIndex = categories.indexOf(current),
    onSelect = { current = categories[it] },
    scrollable = true,
    tagKey = "categories"
)
```

### A count on a tab, which a screen reader hears after its label

```kotlin
PantrixTabs(
    tabs = listOf(
        TabItem(stringResource(Res.string.all), tagKey = "all"),
        TabItem(
            label = stringResource(Res.string.unread),
            tagKey = "unread",
            badge = TabBadge(
                contentDescription = pluralStringResource(Res.plurals.unread_messages, unread, unread),
                count = unread
            )
        )
    ),
    selectedIndex = tab,
    onSelect = { tab = it },
    tagKey = "inbox"
)
```

### A pill for the selected tab, as a segmented control has

```kotlin
PantrixTabs(
    tabs = listOf(
        TabItem(stringResource(Res.string.day), tagKey = "day"),
        TabItem(stringResource(Res.string.week), tagKey = "week"),
        TabItem(stringResource(Res.string.month), tagKey = "month")
    ),
    selectedIndex = period.ordinal,
    onSelect = { period = Period.entries[it] },
    style = TabsStyle(indicator = TabIndicator.Pill),
    tagKey = "period"
)
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixTabs(
    tabs = views,
    selectedIndex = view,
    onSelect = { view = it },
    colors = TabsColors(selectedContent = success.color, indicator = success.color),
    tagKey = "account"
)
```

## Örnekler

### Bir profilin görünümleri

En yalın hâli: satırın genişliğini eşit paylaşan üç sekme ve altında seçilen görünüm. Seçili sekmenin sırası ekranın durumudur; `rememberSaveable` ile tutulur ve ekran dönünce kaybolmaz.

Görünümü sekmeler çizmez: altındaki metin burada, `when` ile seçilir. Varsayılan işaret seçili sekmenin altındaki çizgidir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var tab by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = listOf(
        TabItem(label = "Genel", tagKey = "general"),
        TabItem(label = "Güvenlik", tagKey = "security"),
        TabItem(label = "Bildirimler", tagKey = "notifications")
    ),
    selectedIndex = tab,
    onSelect = { tab = it },
    tagKey = "profile"
)
PantrixText(
    text = when (tab) {
        0 -> "Ad, e-posta ve dil"
        1 -> "Parola ve iki adımlı doğrulama"
        else -> "Hangi bildirimlerin geleceği"
    },
    color = PantrixTheme.colors.textSecondary
)
```

### Rozetli sekmeler

`TabItem.badge` etiketin arkasına bir `TabBadge` koyar: `count` verilirse bir sayı, verilmezse bir nokta. "Hareketler" sekmesi görülmemiş hareketlerin sayısını gösterir; sekme açılınca sayı sıfırlanır ve rozet kalkar. "Ayarlar"daki nokta bekleyen bir güncellemeyi söyler.

Ekran okuyucu rozetin `contentDescription`'ını sekmenin adından sonra okur: "Hareketler, 3 yeni hareket". Tek başına bir sayı neyi saydığını söylemez; bu yüzden açıklamanın varsayılanı yoktur, null vermek bir karardır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabBadge
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var view by rememberSaveable { mutableIntStateOf(0) }
var unseen by rememberSaveable { mutableIntStateOf(3) }
PantrixTabs(
    tabs = listOf(
        TabItem(label = "Özet", tagKey = "overview"),
        TabItem(
            label = "Hareketler",
            tagKey = "activity",
            badge = if (unseen > 0) TabBadge(contentDescription = "$unseen yeni hareket", count = unseen) else null
        ),
        TabItem(
            label = "Ayarlar",
            tagKey = "settings",
            badge = TabBadge(contentDescription = "Güncelleme var", tone = BadgeTone.Primary)
        )
    ),
    selectedIndex = view,
    onSelect = { chosen ->
        view = chosen
        if (chosen == 1) unseen = 0
    },
    tagKey = "account"
)
PantrixText(
    text = when (view) {
        0 -> "Hesabın özeti: bakiye ve son hareketler"
        1 -> "Son otuz günün hareketleri"
        else -> "Bildirimler, dil ve gizlilik"
    },
    color = PantrixTheme.colors.textSecondary
)
```

### Seçili sekmenin işareti

Seçili sekmeyi neyin işaretlediğini stil söyler: `TabsStyle(indicator = ...)`. Dört satır aynı seçimi gösterir ve her birinin üstünde işaretinin adı yazar; birinde başka bir sekmeye bas, dördü birlikte değişir.

`Underline` her platformda varsayılandır: seçili sekmenin alt kenarında bir çizgi. `Top` aynı çizgiyi üst kenara koyar, değiştirdiği içeriğin altında duran bir satır için. `Pill` seçili sekmenin arkasına `primary` rolünün soluk dolgusunda bir hap koyar ve satırın altındaki ince çizgiyi çizmez: iOS'taki bölümlü denetimin çizimidir, burada bir grafiğin dönemini seçer. `None` işaret çizmez; seçili sekmeyi yalnızca rengi söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabIndicator
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.container.tab.TabsStyle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var period by rememberSaveable { mutableIntStateOf(1) }
val caption = PantrixTheme.typography.caption
val quiet = PantrixTheme.colors.textSecondary
PantrixText(text = "Underline", style = caption, color = quiet)
PantrixTabs(tabs = PERIODS, selectedIndex = period, onSelect = { period = it }, tagKey = "underline")
PantrixText(text = "Top", style = caption, color = quiet)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.Top),
    tagKey = "top"
)
PantrixText(text = "Pill", style = caption, color = quiet)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.Pill),
    tagKey = "period"
)
PantrixText(text = "None", style = caption, color = quiet)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.None),
    tagKey = "none"
)

private val PERIODS = listOf(
    TabItem(label = "Gün", tagKey = "day"),
    TabItem(label = "Hafta", tagKey = "week"),
    TabItem(label = "Ay", tagKey = "month")
)
```

### Yana kayan, ikonlu kategoriler

Satıra sığmayacak kadar çok kategori, her biri ikonuyla. `scrollable = true` ile her sekme etiketi kadar geniştir ve satır yana kayar. Seçilen sekme satırın ortasına gelir, böylece iki yanındaki sekmeler de görünür ve basılır.

"Gelen kutusu"ndaki sayı yazılan en büyük sayıyı aşar: "99+". Son kategori devre dışıdır: basılamaz ve ok tuşları onu atlar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabBadge
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.foundation.icons.PantrixIcons

var category by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = CATEGORIES,
    selectedIndex = category,
    onSelect = { category = it },
    scrollable = true,
    tagKey = "categories"
)

private val CATEGORIES = listOf(
    TabItem(
        label = "Gelen kutusu",
        icon = PantrixIcons.Inbox,
        tagKey = "inbox",
        badge = TabBadge(contentDescription = "99'dan fazla okunmamış ileti", count = 128)
    ),
    TabItem(label = "Yıldızlı", icon = PantrixIcons.Star, tagKey = "starred"),
    TabItem(label = "Klasörler", icon = PantrixIcons.Folder, tagKey = "folders"),
    TabItem(label = "Kişiler", icon = PantrixIcons.Person, tagKey = "people"),
    TabItem(label = "Takvim", icon = PantrixIcons.Calendar, tagKey = "calendar"),
    TabItem(label = "Arama", icon = PantrixIcons.Search, tagKey = "search"),
    TabItem(label = "Arşiv", icon = PantrixIcons.Folder, enabled = false, tagKey = "archive")
)
```

### Kaydırılan sayfalarla birlikte

Seçimi kullanıcı kadar uygulama da değiştirir. Burada seçili sekme bir pager'ın sayfasıdır: sayfayı yana kaydır, işaret yeni sekmeye kayar. Bir sekmeye basıldığında sekmeler yalnızca basılanı bildirir; sayfayı çeviren `onSelect`'teki koddur.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.text.PantrixText
import kotlinx.coroutines.launch

val pager = rememberPagerState { 3 }
val scope = rememberCoroutineScope()
PantrixTabs(
    tabs = listOf(
        TabItem(label = "Fotoğraflar", tagKey = "photos"),
        TabItem(label = "Videolar", tagKey = "videos"),
        TabItem(label = "Belgeler", tagKey = "documents")
    ),
    selectedIndex = pager.currentPage,
    onSelect = { scope.launch { pager.animateScrollToPage(it) } },
    tagKey = "library"
)
HorizontalPager(state = pager, modifier = Modifier.height(96.dp)) { page ->
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        PantrixText(
            text = when (page) {
                0 -> "248 fotoğraf"
                1 -> "12 video"
                else -> "37 belge"
            }
        )
    }
}
```

### Seçili sekme olmadan

`selectedIndex` sekmelerin dışında bir sıra olduğunda hiçbir sekme seçili değildir ve işaret çizilmez: uygulama, sekmelerden hiçbirinin görünümü olmayan bir yerdedir. Düğmeye bas: seçim kalkar. Bir sekmeye bas: geri gelir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var view by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = listOf(
        TabItem(label = "Akış", tagKey = "feed"),
        TabItem(label = "Keşfet", tagKey = "explore"),
        TabItem(label = "Kayıtlar", tagKey = "saved")
    ),
    selectedIndex = view,
    onSelect = { view = it },
    tagKey = "home"
)
PantrixButton(
    text = "Arama sonuçlarını aç",
    onClick = { view = -1 },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "tabs_open_search"
)
PantrixText(
    text = if (view < 0) "Arama sonuçları açık: hiçbir sekme seçili değil" else "Bir sekmenin görünümü açık",
    color = PantrixTheme.colors.textSecondary
)
```

### Kendi renkleriyle

`colors` satıra temanın değil, verilen renkleri verir. İlk satıra seçili sekmenin ve çizginin rengi verildi; seçili olmayanlar ve alttaki ince çizgi temanın renginde kalır. "Bekleyen" sekmesinin rozeti de tonunun değil, kendisine verilen rengin dolgusuyla çizilir.

İkinci satır bir hap satırı ve yalnızca hapın dolgusu verildi. O dolgu temanın bir rolünün rengi olduğu için seçili etiketin rengini tema eşleştirir. Hiçbir rolde olmayan bir dolguda `selectedContent` de verilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.tab.PantrixTabs
import com.pantrixui.components.container.tab.TabBadge
import com.pantrixui.components.container.tab.TabIndicator
import com.pantrixui.components.container.tab.TabItem
import com.pantrixui.components.container.tab.TabsColors
import com.pantrixui.components.container.tab.TabsStyle
import com.pantrixui.components.elements.badge.BadgeColors
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var order by rememberSaveable { mutableIntStateOf(0) }
var period by rememberSaveable { mutableIntStateOf(0) }
PantrixTabs(
    tabs = listOf(
        TabItem(
            label = "Bekleyen",
            tagKey = "pending",
            badge = TabBadge(
                contentDescription = "2 bekleyen sipariş",
                count = 2,
                colors = BadgeColors(container = own.color, content = own.onColor)
            )
        ),
        TabItem(label = "Kargoda", tagKey = "shipped"),
        TabItem(label = "Teslim edildi", tagKey = "delivered")
    ),
    selectedIndex = order,
    onSelect = { order = it },
    colors = TabsColors(selectedContent = own.color, indicator = own.color),
    tagKey = "orders"
)
PantrixTabs(
    tabs = PERIODS,
    selectedIndex = period,
    onSelect = { period = it },
    style = TabsStyle(indicator = TabIndicator.Pill),
    colors = TabsColors(indicator = PantrixTheme.colors.success.container),
    tagKey = "success_pill"
)

private val PERIODS = listOf(
    TabItem(label = "Gün", tagKey = "day"),
    TabItem(label = "Hafta", tagKey = "week"),
    TabItem(label = "Ay", tagKey = "month")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixTabs

`import com.pantrixui.components.container.tab.PantrixTabs`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTabs(
    tabs: List<TabItem>,
    selectedIndex: Int,
    onSelect: (index: Int) -> Unit,
    modifier: Modifier = Modifier,
    scrollable: Boolean = false,
    style: TabsStyle? = null,
    colors: TabsColors? = null,
    tagKey: String? = null
)
```

Aynı içeriğin görünümleri arasında geçen bir sekme satırı: biri seçilidir ve bir işaret, bir sonraki seçilene kayar.

Seçili sekmeyi stilin `TabsStyle.indicator`'ı işaretler: altında bir çizgi, üstünde bir çizgi, arkasında bir hap ya da yalnızca rengi. İşaret, sekmesi neredeyse oradadır. Satırın boyutu değişince sekmesini izler, yalnızca seçim değişince kayar: hareket azaltılmışsa yerine hemen geçer.

Satır, Tab tuşu için seçili sekmenin üstünde tek bir duraktır: WAI-ARIA'nın sekme kalıbında olduğu gibi. Ok tuşları sonraki ya da önceki sekmeyi seçer, sağdan sola düzende ters yönde. Home ve End ilk ve son sekmeyi seçer. Devre dışı sekme atlanır. Bir sekme odaktayken odak seçimle birlikte gider, seçimi kim yaparsa yapsın: bir tuş, bir basış ya da uygulama, bir pager sonraki görünüme kaydırıldığında olduğu gibi. Bir sekmeye basmak onu ister ve odak, basışın odağı götürebildiği yerde, satırın tek durağına, seçili sekmeye gider. Ekran okuyucu için her sekme, seçili olup olmadığını söyleyen bir sekmedir ve hepsi tek bir gruptadır.

Bir sekme, etiketinin arkasında bir rozet taşıyabilir: bir sayı ya da bir nokta, `TabItem.badge`. Ekran okuyucu rozetin açıklamasını etiketten sonra, sekmenin parçası olarak okur.

`scrollable` ile her sekme etiketi kadar geniştir ve satır yana kayar. Satır seçili sekmede açılır ve sonra seçileni ortasına getirir: böylece iki yanındaki sekmeler de görünür ve onlara basılabilir.

Bir sekme, stilin yüksekliği ve yoğunluk ne derse desin, en az platformun dokunma hedefi kadar yüksektir. Satırın kendi dolgusu yoktur: sayfanın ya da bir yüzeyin üstünde durur, etiketleri ikisinde de okunur. Sekmeler yalnızca satırdır: `selectedIndex`'in gösterdiği görünümü uygulama, satırın altında kendisi çizer.

Parametreler:

- `tabs: List<TabItem>`: Sekmeler, sırayla.
- `selectedIndex: Int`: Seçili sekmenin sırası. `tabs`'in dışında bir sıra verilirse hiçbir sekme seçili olmaz ve işaret çizilmez.
- `onSelect: (index: Int) -> Unit`: Kullanıcının basarak ya da tuşlarla seçtiği sekmenin sırasıyla çağrılır, o sekme zaten seçili olsa da. Satır kendiliğinden bir şey seçmez: bir sekme, `selectedIndex` öyle dediğinde seçilidir.
- `modifier: Modifier`: Satırın modifier'ı. Satır kendisine verilen genişliği doldurur.
- `scrollable: Boolean`: False iken sekmeler satırın genişliğini paylaşır. True iken her biri etiketi kadar, en az da stilin `minTabWidth`'i kadar geniştir: satır yana kayar ve seçili sekmeyi ortasında tutar.
- `style: TabsStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TabsColors?`: Bu satırın kendi renkleri: verdikleri kullanılır, gerisi temanınkidir. Devre dışı sekme temanın renginde kalır.
- `tagKey: String?`: Satırın otomasyon anahtarı: satır `Tabs_<tagKey>` olur, sekmeleri de onun içinde adlandırılır, `Tabs_<tagKey>.Tab_<key>`. Böylece aynı sekmeleri taşıyan iki satır birbirinden ayrılır. Bir seçim `Tabs` olayı olarak bildirilir: olay sekmenin sırasını ve seçimin basışla mı tuşla mı yapıldığını taşır, etiketini hiçbir zaman taşımaz.

### TabItem

`import com.pantrixui.components.container.tab.TabItem`, `com.pantrixui:components` içinden

```kotlin
class TabItem(
    public val label: String,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null,
    public val badge: TabBadge? = null
)
```

`PantrixTabs`'in bir sekmesi: etiketi, önünde bir ikon, arkasında bir rozet ve otomasyon için bir anahtar.

Parametreler:

- `label: String`: Görünen metin ve sekmenin ekran okuyucu için adı.
- `icon: ImageVector?`: Etiketin önünde, etiketin renginde çizilir. İkon yoksa null.
- `enabled: Boolean`: Sekmenin seçilip seçilemediği. Seçilemeyen sekmeye basmak bir şey yapmaz ve ok tuşları onu atlar.
- `tagKey: String?`: Sekmenin otomasyon anahtarı, her dilde aynıdır: sekme `Tab_<tagKey>`, anahtar verilmezse `Tab_<index>` olur. Anahtarı olan bir satırda satırın etiketinin içindedir: `Tabs_mail.Tab_inbox`.
- `badge: TabBadge?`: Etiketin arkasında bir sayı ya da bir nokta. Rozet yoksa null.

### TabBadge

`import com.pantrixui.components.container.tab.TabBadge`, `com.pantrixui:components` içinden

```kotlin
class TabBadge(
    public val contentDescription: String?,
    public val count: Int? = null,
    public val tone: BadgeTone = BadgeTone.Danger,
    public val colors: BadgeColors? = null
)
```

`PantrixTabs`'in bir sekmesindeki rozet: bir sayı, sayılacak bir şey yoksa bir nokta.

Rozet sekmenin etiketinden sonra gelir ve sekme dar kaldığında yerini etiketten alır: uzun etiket kısaltılır, rozet bütün kalır. Rozet bir `PantrixBadge`'dir: sekme hangi durumda olursa olsun onun boyutunda ve onun renklerindedir.

Ekran okuyucu `contentDescription`'ı sekmenin etiketinden sonra, sekmenin parçası olarak okur: "Gelen kutusu, 3 okunmamış". Tek başına bir sayı neyi saydığını söylemez, bu yüzden açıklaması olmayan rozet sessiz kalır. Bu ancak etiket onu zaten söylüyorsa doğrudur. Varsayılanının olmaması bundandır: null vermek bir karardır.

Parametreler:

- `contentDescription: String?`: Ekran okuyucunun rozet için, sekmenin etiketinden sonra söylediği. Hiçbir şey söylememesi için null.
- `count: Int?`: Gösterilecek sayı; nokta için null. Bir rozetinki gibi sınırlanır: `99+`.
- `tone: BadgeTone`: Rozetin dolgusunu aldığı renk rolü.
- `colors: BadgeColors?`: Rozetin, tonunun renkleri yerine kendi renkleri: verdikleri kullanılır, gerisi tonunkidir.

### TabIndicator

`import com.pantrixui.components.container.tab.TabIndicator`, `com.pantrixui:components` içinden

```kotlin
enum class TabIndicator
```

`PantrixTabs`'in seçili sekmeyi nasıl işaretlediği.

Değerleri:

- `Underline`: Seçili sekmenin alt kenarı boyunca bir çizgi: satırın altındaki ince çizginin üstüne çizilir. Her platformda varsayılandır.
- `Top`: Aynı çizgi, sekmenin üst kenarı boyunca: değiştirdiği içeriğin altında duran bir satır için.
- `Pill`: Seçili sekmenin arkasında, `primary` rolünün soluk dolgusunda bir hap. Kenarlardan stilin `indicatorPadding`'i kadar içeride durur. Hap satırı ince çizgi çizmez: içeriğin üstünde bir başlık değil, kendi başına bir kontroldür.
- `None`: İşaret çizilmez: seçili sekmeyi yalnızca rengi işaretler.

### TabsStyle

`import com.pantrixui.components.container.tab.TabsStyle`, `com.pantrixui:components` içinden

```kotlin
class TabsStyle(
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val indicatorHeight: Dp = Dp.Unspecified,
    public val minTabWidth: Dp = Dp.Unspecified,
    public val edgePadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val indicator: TabIndicator? = null,
    public val indicatorPadding: Dp = Dp.Unspecified
) : PantrixStyle<TabsStyle>
```

`PantrixTabs`'in geometrisi ve seçili sekmeyi nasıl işaretlediği.

Sabit sekmeler satırın genişliğini paylaşır. Kayan sekmeler etiketleri kadar, en az da `minTabWidth` kadar geniştir. İlkinden önce ve sonuncudan sonra `edgePadding` kadar boşluk kalır. Hava yoğunlukla ölçeklenir: `height`, `horizontalPadding`, `edgePadding`, `iconGap` ve `indicatorPadding`. İşaretin kalınlığı, ikonun boyutu ve bir sekmenin en az genişliği ölçeklenmez. Sekmelerin renkleri stilin parçası değildir: temadan gelir, satırın kendi renkleri varsa `TabsColors`'tan.

Android, Material 3'ün birincil sekmelerini izler, ikon etiketin önündedir. iOS'un kendi sekme satırı yoktur: orada bu işi bölümlü denetim yapar, onu da `TabIndicator.Pill` çizer. iOS'un ve masaüstünün değerleri Pantrix'in kendisinindir.

Parametreler:

- `height: Dp`: Bir sekmenin en az yüksekliği: Android'de 48dp, iOS'ta 44dp, masaüstünde ve web'de 40dp. Burada ne verilirse verilsin sekme hiçbir zaman platformun dokunma hedefinden alçak olmaz.
- `horizontalPadding: Dp`: Sekmenin içinde, ikonundan ya da etiketinden önceki ve etiketinden sonraki boşluk.
- `indicatorHeight: Dp`: Bir `TabIndicator.Underline` ya da `TabIndicator.Top` çizgisinin kalınlığı.
- `minTabWidth: Dp`: Kayan bir sekmenin en az genişliği.
- `edgePadding: Dp`: Kayan sekmelerin ilkinden önceki ve sonuncusundan sonraki boşluk.
- `iconSize: Dp`: Bir sekmenin ikonunun boyutu.
- `iconGap: Dp`: Bir sekmenin ikonu ile etiketi ve etiketi ile rozeti arasındaki aralık.
- `indicator: TabIndicator?`: Seçili sekmeyi neyin işaretlediği.
- `indicatorPadding: Dp`: Bir `TabIndicator.Pill` ile işaretlediği sekmenin kenarları arasındaki boşluk.

### TabsColors

`import com.pantrixui.components.container.tab.TabsColors`, `com.pantrixui:components` içinden

```kotlin
data class TabsColors(
    public val selectedContent: Color = Color.Unspecified,
    public val unselectedContent: Color = Color.Unspecified,
    public val indicator: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir satır için `PantrixTabs`'in neyle boyandığı: verilen renk kullanılır, verilmeyen temanın rolünde kalır.

```kotlin
PantrixTabs(
    tabs = views,
    selectedIndex = view,
    onSelect = { view = it },
    colors = TabsColors(selectedContent = brand, indicator = brand)
)
```

Bunlar seçilebilen sekmelerin renkleridir. Devre dışı sekme, burada ne verilirse verilsin temanın devre dışı yazı rengiyle çizilir.

Parametreler:

- `selectedContent: Color`: Seçili sekmenin etiketi ve ikonu. Temanın `primary` rengidir. Bir hapın üstünde ise `primary` rolünün `onContainer`'ıdır: hapın dolgusuyla eşleşen renk. Hapa `indicator` olarak temanın kendi renklerinden biri verilirse temanın onunla eşleştirdiği renk kendiliğinden gelir. Hiçbir rolde olmayan bir renk verilirse bu da onunla birlikte verilir.
- `unselectedContent: Color`: Öteki sekmelerin etiketi ve ikonu. Temanın `textSecondary` rengidir.
- `indicator: Color`: Seçili sekmeyi işaretleyen şey: altındaki ya da üstündeki çizgi ya da arkasındaki hap. Temanın `primary` rengidir, hap için `primary` rolünün `container`'ıdır.
- `divider: Color`: Satırın altındaki ince çizgi. Hap satırı bu çizgiyi çizmez. Temanın kendi zeminlerinde temanın `divider` rengidir. Sekme satırının kendi dolgusu yoktur: bir dolgunun üstünde, o çizginin okunmayacağı yerde, orada yazılan rengin bir payıdır.

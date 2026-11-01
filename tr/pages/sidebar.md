# Sidebar

Bir uygulamanın yanındaki hedefler sütunu: gruplar, içinde hedefleri olan bölümler ve yer daraldığında indiği ikon rayı. Geniş bir pencerenin gezinmesidir: bu uygulamanın 600dp'den geniş bir penceredeki yan menüsü de bir `PantrixSidebar`'dır.

Sidebar bulunduğu yerin boyu kadardır. Gerçek bir ekranda `PantrixScaffold`'un yan çubuğudur: pencere boyundadır ve scaffold'un verdiği `insets` ile satırlarını sistem çubuklarının dışında tutar. Burada kayan bir sayfanın içinde durduğu için her örnek boyu belli bir kutudadır; yanındaki alan açık olan hedefi yazar.

- `PantrixSidebar` (`com.pantrixui.components.navigation.sidebar`, `com.pantrixui:components`): Bir uygulamanın yanı boyunca hedeflerin sütunu: gruplar, yerinde açılan iki düzey derin bölümler, sayfa dar olunca kendiliğinden katlandığı bir ikon rayı ve rayın açtığı şey. Anahtar sözcükler: kenar çubuğu, yan menü, gezinme çekmecesi, çekmece, yan gezinme, katlanır menü.

## Özellikler

- **İki düzey.** Satırlar gruplar hâlinde verilir (`SidebarGroup`) ve gruplar arasına bir çizgi çekilir; adı olan bir grubun adı satırlarının üstünde yazar. Çocukları olan satır bir bölümdür, hedef değildir: basılınca yerinde açılır ya da kapanır. Daha derini yoktur: bir çocuğun çocukları çizilmez.
- **Durum uygulamanındır.** Bulunulan hedef (`selected`) ve açık bölümler (`expanded`) çağıranın durumudur; bir satıra basmak yalnızca ister (`onSelect`, `onExpandedChange`). Kendi durumunu tutan bir sidebar geri tuşuyla, bir bağlantıyla açılan sayfayla ve geri yüklenen bir süreçle çatışırdı.
- **Tek bölüm açık.** `singleExpanded` ile, ki varsayılandır, bir bölümü açmak açık olanı kapatır: altı bölümlü bir sidebar altı satır boyunda kalır. false verilince birden çok bölüm açık kalabilir.
- **İkon rayı.** `collapsed` sidebar'ı ikonlardan bir raya indirir: bir hedefin adını ikonu taşır ve bir tooltip gösterir. Bir bölüm içindekileri rayın yanında açar (`flyout`): bir kartta ya da sayfayı yana iten bir sütunda. İkonu olmayan bir üst düzey satır rayda bir ok olarak çizilir: her birine ikon ver.
- **Kendiliğinden daralır.** `adaptive` ile, ki varsayılandır, sidebar sütununun yanında sayfaya 840dp kalmıyorsa kendiliğinden raya iner.
- **Başlık, sabit hedefler, alt bilgi.** `header` satırların üstünde, `footerItems` ve `footer` altında durur; hiçbiri kaymaz. Başlık ve alt bilgi hangi hâlde olduklarını `SidebarSlotScope.collapsed` ile öğrenir.
- **Nerede olunduğu.** Bulunulan hedef üç yolla belli olur: dolgusu, daha kalın yazısı ve ekran okuyucu için seçili durumu. Onu tutan bölümün adı da kalın yazılır; rayda o bölüm dolguyu ve kenardaki çubuğu taşır.
- **Boy ve kaydırma.** Satırlar başlıkla sabit hedeflerin arasında kalan yeri alır ve sığmadığında kendi içinde kayar; masaüstünde ve web'de kenarında Pantrix'in kaydırma çubuğu durur. Bir satır platformun dokunma hedefinden alçak olmaz ve büyüyen yazıyla birlikte uzar.
- **Renkler ve stil.** `SidebarColors` dolguyu, yazıyı, seçili satırı, çizgileri ve raydaki çubuğu boyar; `SidebarStyle` genişliği, satırları ve köşeleri verir. Sütun her platformda 248dp genişliğindedir. `textStyle` satırların, `titleTextStyle` grup başlıklarının yazısını verir; bulunulan hedef verilen yazıdan bir kademe kalındır.
- **Ekran okuyucu ve klavye.** Bir bölüm açık olup olmadığını söyler; kapalı bir bölüm içindekileri hiç kurmaz. Rayın açtığı sütun Escape ile kapanır ve odak bölümün satırına döner.

## Kullanım

### A sidebar with sections

```kotlin
PantrixSidebar(
    groups = listOf(
        SidebarGroup(overview, projects),
        SidebarGroup(analytics, quality)
    ),
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "main"
)
```

### Collapsed to a rail, its sections opening a column beside it

```kotlin
PantrixSidebar(
    groups = groups,
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    collapsed = true,
    flyout = SidebarFlyout.Panel,
    tagKey = "main"
)
```

### With a header, pinned destinations and a footer

```kotlin
PantrixSidebar(
    groups = groups,
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    header = { WorkspaceSwitcher(compact = collapsed) },
    footerItems = listOf(settings, help),
    // The avatar alone on the rail, the name beside it in the column.
    footer = { AccountCard(compact = collapsed) },
    tagKey = "main"
)
```

### A dark sidebar in a light app

```kotlin
PantrixSidebar(
    groups = groups,
    selected = where,
    onSelect = { where = it },
    expanded = open,
    onExpandedChange = { open = it },
    colors = SidebarColors(
        container = Navy,
        content = Color.White,
        selectedContainer = NavyLight,
        selectedContent = Color.White,
        divider = NavyLine,
        marker = Sky
    ),
    tagKey = "main"
)
```

## Örnekler

### Gruplar ve bölümler

En yalın hâli: gruplar hâlinde satırlar (`groups`), bulunulan hedefin anahtarı (`selected`), açık bölümlerin anahtarları (`expanded`) ve ikisinin değişmesini isteyen iki geri bildirim. Sidebar kendiliğinden bir şey değiştirmez; durum burada `rememberSaveable` ile tutulur ve ekran dönünce kaybolmaz.

"Kalite" ve "Sürümler" birer bölümdür: basılınca yerinde açılır, biri açılınca öteki kapanır. "Çökmeler"i seç ve "Kalite"yi kapat: bölümün adı kalın kalır, kapalıyken de nerede olunduğu belli olur. "Arşiv" ve "Faturalar" basılamaz.

`adaptive = false` verildi: sidebar burada bir kutunun içinde durur ve varsayılan hâliyle raya inerdi; bunu "Kendiliğinden daralır" örneği gösterir. Kutunun boyu 480dp: sidebar bulunduğu yerin boyu kadardır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        tagKey = "plain"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

### Birden çok bölüm açık kalabilir

`singleExpanded = false`: bir bölümü açmak ötekini kapatmaz. "Sürümler"i aç: "Kalite" de açık kalır.

Sidebar, satırları kutusuna sığmadığında onları kendi içinde kaydırır: telefonda iki bölüm birden açılınca 480dp'lik kutuda böyle olur.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        singleExpanded = false,
        tagKey = "many"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

### Adı olan gruplar

Bir grubun adı satırlarının üstünde durur: `SidebarGroup(items, title = "Rehberler")`. Ad küçük, büyük harflerle ve sessiz renkte yazılır, ekran okuyucu onu bir başlık olarak duyar: bir belgelemenin "Başlarken" ve "Rehberler" bölümleri gibi. Adı olmayan bir grup yalnızca bir çizgiyle ayrılır.

Rayda adlara yer yoktur: "Raya çevir"e bas, gruplar yine bir çizgiyle ayrılır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var rail by rememberSaveable { mutableStateOf(false) }
var where by rememberSaveable { mutableStateOf("installation") }
PantrixButton(
    text = if (rail) "Sütuna çevir" else "Raya çevir",
    onClick = { rail = !rail },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "titled_shape"
)
SidebarFrame(height = 400.dp) {
    PantrixSidebar(
        groups = TITLED,
        selected = where,
        onSelect = { where = it },
        expanded = emptySet(),
        onExpandedChange = {},
        collapsed = rail,
        adaptive = false,
        tagKey = "titled"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

### Basılamayan satırlar

`enabled = false` satırı temanın devre dışı yazı rengiyle yazar; satır basış almaz. "Faturalar" basılamayan bir hedeftir.

"Raporlar" basılamayan bir bölümdür: açılıp kapanmaz, `expanded` ne diyorsa öyle kalır; burada açık. İçindeki hedeflerin her biri kendi `enabled`'ına bakar: "Haftalık" basılır, "Aylık" basılmaz.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
SidebarFrame(height = 320.dp) {
    PantrixSidebar(
        groups = listOf(
            SidebarGroup(
                SidebarItem(key = "overview", label = "Genel bakış", icon = PantrixIcons.Star),
                SidebarItem(key = "invoices", label = "Faturalar", icon = PantrixIcons.Person, enabled = false),
                SidebarItem(
                    key = "reports",
                    label = "Raporlar",
                    icon = PantrixIcons.Calendar,
                    children = listOf(
                        SidebarItem(key = "weekly", label = "Haftalık"),
                        SidebarItem(key = "monthly", label = "Aylık", enabled = false)
                    ),
                    enabled = false
                )
            )
        ),
        selected = where,
        onSelect = { where = it },
        expanded = setOf("reports"),
        onExpandedChange = {},
        adaptive = false,
        tagKey = "disabled"
    )
    PantrixVerticalDivider()
    PantrixText(
        text = "Seçili hedefin anahtarı: $where",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}
```

### Başlık, sabit hedefler ve alt bilgi

`header` satırların üstünde durur ve kaymaz: uygulamanın işareti, bir çalışma alanı seçici. `footerItems` satırların altına sabitlenen hedeflerdir: ayarlar, yardım. Bölüm olamazlar: çocuğu olan biri reddedilir. `footer` en altta durur: bir hesap, bir plan. Her biri bir çizgiyle ayrılır; aradaki satırlar kalan yeri alır.

Başlık ve alt bilgi çağıranındır. İçlerindeki yazı, kendi rengini söylemedikçe, sidebar'ın yazı rengindedir. İkisi de `SidebarSlotScope` içinde çizilir ve sidebar'ın hangi hâlde olduğunu `collapsed` ile öğrenir: burada sütunda ad, rayda yalnızca baş harfler. Rayı bir sonraki örnek gösterir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarSlotScope
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 740.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        header = { WorkspaceHeader() },
        footerItems = PINNED,
        footer = { AccountFooter() },
        tagKey = "main"
    )
    OpenPage(where)
}

@Composable
private fun SidebarSlotScope.WorkspaceHeader() {
    if (collapsed) {
        RailLetters("A")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Acme", style = PantrixTheme.typography.title)
            PantrixText(text = "Üretim ortamı", style = PantrixTheme.typography.caption)
        }
    }
}

@Composable
private fun SidebarSlotScope.AccountFooter() {
    if (collapsed) {
        RailLetters("AL")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Ada Lovelace", style = PantrixTheme.typography.label)
            PantrixText(
                text = "ada@acme.example",
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

@Composable
private fun ColumnScope.RailLetters(text: String) {
    PantrixText(
        text = text,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(vertical = PantrixTheme.spacing.lg),
        style = PantrixTheme.typography.label
    )
}

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)
```

### İkon rayı: bölüm yanında bir kart açar

`collapsed` sidebar'ı ikonlardan bir raya indirir. Bir hedefin adını ikonu taşır: üzerinde bekleyen bir imleç, klavye odağı ya da uzun basış adını bir tooltip'te gösterir. Bir bölüm içindekileri rayın yanında açar; `SidebarFlyout.Popup` ile bu bir karttır. İmleç bölümün üzerinde durunca gelir, imleç gidince gider; imleç yokken, parmakla, klavyeyle ya da ekran okuyucuyla basınca açılır ve kapatılana kadar kalır. İçinden bir hedef seçilince kapanır.

Bir satırın `detail`'i ("87 açık") yalnızca burada, yer olan yerde yazılır; bölümünki ("3 uyarı") kartın başında, adının yanındadır. Sütunda yazılmaz: sütun gidilecek yerlerin listesidir, yanından aşağı inen rakamlar veri gibi okunurdu.

"Sütuna çevir" aynı sidebar'ı sütuna çevirir: biçim hemen değişir, genişlik temanın hareketiyle onu izler ve yanındaki sayfa onunla birlikte kayar. Başlık ve alt bilgi rayda yalnızca bir iki harf çizer.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarFlyout
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarSlotScope
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var rail by rememberSaveable { mutableStateOf(true) }
var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
PantrixButton(
    text = if (rail) "Sütuna çevir" else "Raya çevir",
    onClick = { rail = !rail },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "sidebar_shape"
)
SidebarFrame(height = 740.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        collapsed = rail,
        adaptive = false,
        flyout = SidebarFlyout.Popup,
        header = { WorkspaceHeader() },
        footerItems = PINNED,
        footer = { AccountFooter() },
        tagKey = "rail"
    )
    OpenPage(where)
}

@Composable
private fun SidebarSlotScope.WorkspaceHeader() {
    if (collapsed) {
        RailLetters("A")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Acme", style = PantrixTheme.typography.title)
            PantrixText(text = "Üretim ortamı", style = PantrixTheme.typography.caption)
        }
    }
}

@Composable
private fun SidebarSlotScope.AccountFooter() {
    if (collapsed) {
        RailLetters("AL")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Ada Lovelace", style = PantrixTheme.typography.label)
            PantrixText(
                text = "ada@acme.example",
                style = PantrixTheme.typography.caption,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

@Composable
private fun ColumnScope.RailLetters(text: String) {
    PantrixText(
        text = text,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(vertical = PantrixTheme.spacing.lg),
        style = PantrixTheme.typography.label
    )
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)
```

### İkon rayı: bölüm yanında bir sütun açar

`SidebarFlyout.Panel` ile bölümün hedefleri rayın yanında, kendi sütununda açılır: sütunun genişliğinde ve rayın boyunda. Sidebar o kadar genişler; sayfa örtülmez, yana itilir.

"Kalite"ye bas. Sütun bir basışla açılır, imleç geçerken açılmaz. Bölüme yeniden basmak, bir hedef seçmek ve Escape onu kapatır; başka bir bölüme basmak onunkini gösterir. Klavyeyle açıldığında odak sütunun ilk hedefine gider, kapanınca bölümün satırına döner.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarFlyout
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        collapsed = true,
        adaptive = false,
        flyout = SidebarFlyout.Panel,
        tagKey = "panel"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

### Kendiliğinden daralır: dar yerde ray, geniş yerde sütun

`adaptive`, ki varsayılanı true'dur, sidebar'ı sütunu sayfayı sıkıştıracağı yerde kendiliğinden raya indirir: kendisine verilen genişlikten sütunun 248dp'si çıkınca geriye 840dp kalmıyorsa. 840dp, altında bir sayfada iki bölmeye yer olmayan genişliktir. Yani sidebar'a 1088dp'den az yer düşüyorsa ray, düşmüyorsa sütun görünür.

Seçici, sidebar'ın durduğu kutunun genişliğini değiştirir: 1200dp'lik kutuda sütun, 700dp'lik kutuda ray görünür. Sidebar pencereye değil kendisine verilen yere bakar: pencere aynı kalır, yalnızca kutu daralır ve sidebar raya iner. Kutu sayfaya sığmadığında yana kayar ve altında bir kaydırma çubuğu çıkar.

Uygulamanın kendi yan menüsü de `adaptive` bir `PantrixSidebar`'dır: pencereyi daralt, raya iner; 600dp'nin altında yerini alt kenardaki bar alır.

Öteki örneklerde `adaptive = false`: biçimi yalnızca `collapsed` belirler. Bir çekmecenin içindeki sidebar için de doğrusu budur: çekmece sayfayı örter, sıkıştırmaz. `adaptive` bir sidebar kendisine verilen yeri ölçer; boyutunu `IntrinsicSize` ile soran bir üst öğenin altında kapatılmalıdır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
var room by rememberSaveable { mutableStateOf(1200) }
PantrixSegmentButton(
    options = ROOMS,
    selected = room,
    onSelect = { room = it },
    fullWidth = false,
    tagKey = "room"
)
HorizontalScrollFrame(tagKey = "adaptive") {
    SidebarFrame(height = 480.dp, width = room.dp) {
        PantrixSidebar(
            groups = GROUPS,
            selected = where,
            onSelect = { where = it },
            expanded = open.toSet(),
            onExpandedChange = { open = it.toList() },
            adaptive = true,
            tagKey = "adaptive"
        )
        OpenPage(where)
    }
}

private val ROOMS = listOf(
    SegmentOption(value = 1200, label = "Geniş yer · 1200dp", tagKey = "wide"),
    SegmentOption(value = 700, label = "Dar yer · 700dp", tagKey = "narrow")
)

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `HorizontalScrollFrame`: Yana kayan bir çerçeve: içeriği yerine sığmadığında altında bir kaydırma çubuğu çizer.

### Seçili satır bir rolün renginde

Yalnızca seçili satırın dolgusu verildi: `selectedContainer`. Temanın bir rolünün rengi olduğu için üstünde neyin okunduğunu tema bilir: `selectedContent` verilmeden rolün eşlenik rengi gelir. Verilmeyen her renk temanınki kalır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarColors
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        colors = SidebarColors(selectedContainer = PantrixTheme.colors.success.container),
        tagKey = "role"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

### Kendi renkleriyle

Uygulamanın kendi rengiyle dolu bir sidebar. Tema bu rengi tanımaz ve üstünde neyin okunduğunu bilemez: dolguyla (`container`) birlikte yazının (`content`), seçili satırın dolgusunun ve yazısının rengi de verilir.

Çizgiler verilmedi: dolgunun üstünde yazının renginden bir pay olarak çizilirler. Basılamayan satırlar da o rengin bir payıyla yazılır. Bir rayın açtığı kart ve sütun da aynı renklerle çizilir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarColors
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 480.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        colors = SidebarColors(
            container = own.color,
            content = own.onColor,
            selectedContainer = own.container,
            selectedContent = own.onContainer
        ),
        tagKey = "own"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Stil: genişlik, satırlar ve köşeler

`style` sidebar'ın geometrisini değiştirir; yalnızca verilen alanlar değişir, gerisi platformun hazır stilinden gelir. Burada sütun 216dp, satırlar 52dp, bölümün içindeki satırlar 48dp ve satırın dolgusunun köşeleri tam yuvarlak.

Hazır stilde sütun her platformda 248dp'dir; satırlar Android'de ve iOS'ta 44dp, masaüstünde 36dp, web'de 40dp. Bir satır hiçbir zaman platformun dokunma hedefinden alçak olmaz. Renkler stilin parçası değildir: onları tema ve `SidebarColors` verir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
SidebarFrame(height = 540.dp) {
    PantrixSidebar(
        groups = GROUPS,
        selected = where,
        onSelect = { where = it },
        expanded = open.toSet(),
        onExpandedChange = { open = it.toList() },
        adaptive = false,
        style = SidebarStyle(width = 216.dp, rowHeight = 52.dp, childRowHeight = 48.dp, shape = ShapeRole.Full),
        tagKey = "styled"
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

### Kendi yazısıyla

Kendi yazısıyla: satırlar temanın `body` yazısıyla, yarı kalın (`textStyle`), grup başlıkları `footnote` ile, çok kalın (`titleTextStyle`). Bulunulan hedef verilen yazıdan bir kademe kalın yazılır; yazıların rengi satırındır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("installation") }
SidebarFrame(height = 360.dp) {
    PantrixSidebar(
        groups = TITLED,
        selected = where,
        onSelect = { where = it },
        expanded = emptySet(),
        onExpandedChange = {},
        adaptive = false,
        tagKey = "own_text",
        textStyle = PantrixTheme.typography.body.copy(fontWeight = FontWeight.SemiBold),
        titleTextStyle = PantrixTheme.typography.footnote.copy(fontWeight = FontWeight.ExtraBold)
    )
    OpenPage(where)
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

### Sistem çubuklarının arkasında

`insets` sidebar'ın kenarlarında boş bıraktığı paydır: dolgu payın arkasına uzanır, başlık ve satırlar payın dışında kalır. Gerçek bir ekranda payı `PantrixScaffold` yan çubuğuna verir (`sideBar = { insets -> … }`) ve satırlar sistem çubuklarının dışında durur. Uygulamanın kendi yan menüsü de payını scaffold'dan alır.

Burada scaffold yok: üstteki 24dp'lik şerit sistemin durum çubuğunun yerini tutuyor. Sidebar'ın dolgusu şeridin arkasında sürer, başlığı şeridin altında başlar.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.sidebar.PantrixSidebar
import com.pantrixui.components.navigation.sidebar.SidebarGroup
import com.pantrixui.components.navigation.sidebar.SidebarItem
import com.pantrixui.components.navigation.sidebar.SidebarSlotScope
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("overview") }
var open by rememberSaveable { mutableStateOf(listOf("quality")) }
Box(modifier = Modifier.clip(PantrixTheme.shapes.md)) {
    SidebarFrame(height = 480.dp) {
        PantrixSidebar(
            groups = GROUPS,
            selected = where,
            onSelect = { where = it },
            expanded = open.toSet(),
            onExpandedChange = { open = it.toList() },
            adaptive = false,
            header = { WorkspaceHeader() },
            insets = PaddingValues(top = 24.dp),
            tagKey = "insets"
        )
        OpenPage(where)
    }
    // Sistemin durum çubuğunun yerinde bir şerit: sidebar'ın dolgusu arkasında sürer.
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(24.dp)
            .background(PantrixTheme.colors.textSecondary.copy(alpha = 0.16f))
    )
}

@Composable
private fun SidebarFrame(
    height: Dp,
    width: Dp = Dp.Unspecified,
    content: @Composable RowScope.() -> Unit
) {
    val shape = PantrixTheme.shapes.md
    Row(
        modifier = (if (width.isSpecified) Modifier.width(width) else Modifier.fillMaxWidth())
            .height(height)
            .clip(shape)
            .border(1.dp, PantrixTheme.colors.border, shape),
        content = content
    )
}

@Composable
private fun OpenPage(where: String) {
    PantrixVerticalDivider()
    PantrixText(
        text = "Açık sayfa: ${NAMES.getValue(where)}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun SidebarSlotScope.WorkspaceHeader() {
    if (collapsed) {
        RailLetters("A")
    } else {
        Column(Modifier.padding(PantrixTheme.spacing.lg)) {
            PantrixText(text = "Acme", style = PantrixTheme.typography.title)
            PantrixText(text = "Üretim ortamı", style = PantrixTheme.typography.caption)
        }
    }
}

private val GROUPS = listOf(
    SidebarGroup(
        SidebarItem("overview", "Genel bakış", PantrixIcons.Star),
        SidebarItem("projects", "Projeler", PantrixIcons.Folder),
        SidebarItem("inbox", "Gelen kutusu", PantrixIcons.Inbox)
    ),
    SidebarGroup(
        SidebarItem(
            key = "quality",
            label = "Kalite",
            icon = PantrixIcons.Search,
            children = listOf(
                SidebarItem("crashes", "Çökmeler", detail = "87 açık"),
                SidebarItem("networks", "Ağ istekleri", detail = "48,2 Mn"),
                SidebarItem("archive", "Arşiv", enabled = false)
            ),
            detail = "3 uyarı"
        ),
        SidebarItem(
            key = "releases",
            label = "Sürümler",
            icon = PantrixIcons.Calendar,
            children = listOf(SidebarItem("planned", "Planlanan"), SidebarItem("shipped", "Yayınlanan"))
        ),
        SidebarItem("billing", "Faturalar", PantrixIcons.Person, enabled = false)
    )
)

@Composable
private fun ColumnScope.RailLetters(text: String) {
    PantrixText(
        text = text,
        modifier = Modifier.align(Alignment.CenterHorizontally).padding(vertical = PantrixTheme.spacing.lg),
        style = PantrixTheme.typography.label
    )
}

private val NAMES: Map<String, String> = ((GROUPS + TITLED).flatMap { it.items } + PINNED)
    .flatMap { listOf(it) + it.children }
    .associate { it.key to it.label }

private val TITLED = listOf(
    SidebarGroup(
        items = listOf(
            SidebarItem("installation", "Kurulum", PantrixIcons.Download),
            SidebarItem("theming", "Tema", PantrixIcons.Star)
        ),
        title = "Başlarken"
    ),
    SidebarGroup(
        items = listOf(
            SidebarItem("forms", "Formlar", PantrixIcons.File),
            SidebarItem("testing", "Test etmek", PantrixIcons.Check)
        ),
        title = "Rehberler"
    )
)

private val PINNED = listOf(
    SidebarItem("settings", "Ayarlar", PantrixIcons.Menu),
    SidebarItem("help", "Yardım", PantrixIcons.Info)
)
```

## API

### PantrixSidebar

`import com.pantrixui.components.navigation.sidebar.PantrixSidebar`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSidebar(
    groups: List<SidebarGroup>,
    selected: String?,
    onSelect: (String) -> Unit,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    collapsed: Boolean = false,
    adaptive: Boolean = true,
    flyout: SidebarFlyout = SidebarFlyout.Popup,
    singleExpanded: Boolean = true,
    style: SidebarStyle? = null,
    colors: SidebarColors? = null,
    header: (@Composable SidebarSlotScope.() -> Unit)? = null,
    footerItems: List<SidebarItem> = emptyList(),
    footer: (@Composable SidebarSlotScope.() -> Unit)? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.label,
    titleTextStyle: TextStyle = PantrixTheme.typography.caption.copy(fontWeight = FontWeight.Bold)
)
```

Bir uygulamanın yanındaki, uygulamanın bölümlerini de tutan hedefler sütunu.

Bir sidebar iki düzeydir, daha derini yoktur: bölümler ve içlerindeki hedefler. Bir bölüm yerinde açılır ve kapanır. Varsayılan olarak bir bölümü açmak açık olanı kapatır (`singleExpanded`), böylece altı bölümlü bir sidebar, uygulamanın gösterebileceği her şeyin değil, altı satırın boyunda kalır. Başlıkla sabit hedeflerin arasındaki satırlar, sığmadıklarında kayar.

`collapsed` iken ikonlardan bir raydır. O zaman bir hedefin adını ikonu taşır ve bir tooltip gösterir. Bir bölüm de içindekileri rayın yanında açar (`flyout`): bir kartta ya da sayfayı yana iten kendi sütununda. Kart, imleç bölümün üzerinde durunca, imleç olmayan yerde ise bir basışla açılır. İkisi de içinden bir hedef seçilince kapanır, bir satırın `SidebarItem.detail`'i de orada yazılır. İkonu olmayan bir üst düzey satır rayda bir ok olarak çizilir: her birine ikon ver.

Varsayılan olarak sidebar, sütununun sayfayı sıkıştıracağı yerde kendiliğinden raya iner (`adaptive`): açık bir katlanır telefonda, dik tutulan bir tablette ve dar bir pencerede ray, geniş bir pencerede sütun görünür. Başlık ve alt bilgi hangisinin göründüğünü `SidebarSlotScope.collapsed` ile öğrenir.

Hangi hedefte bulunulduğu ve hangi bölümlerin açık olduğu çağıranın durumudur: gezinme uygulamanındır ve kendi durumunu tutan bir sidebar geri tuşuyla, bir bağlantıyla açılan sayfayla ve geri yüklenen bir süreçle çatışırdı.

```kotlin
var where by rememberSaveable { mutableStateOf("crashes") }
var open by rememberSaveable { mutableStateOf(setOf("quality")) }
PantrixScaffold(
    sideBar = { insets ->
        PantrixSidebar(
            groups = groups,
            selected = where,
            onSelect = { where = it },
            expanded = open,
            onExpandedChange = { open = it },
            insets = insets,
            tagKey = "main"
        )
    }
) { padding -> Page(where, padding) }
```

Bulunulan hedef üç yolla söylenir: dolgusu, ötekilerden bir kademe kalın etiketi ve ekran okuyucu için seçili durumu. Onu tutan bölüm de daha kalın yazılır ve rayda dolguyu ve rayın kenarındaki çubuğu taşır: kapalı bir bölüm de uygulamanın nerede olduğunu söyler. Bir bölüm ekran okuyucuya açık olup olmadığını söyler ve kapalı olan içindekilerden hiçbirini kurmaz. Bir satır platformun dokunma hedefinden hiç alçak olmaz ve daha büyük bir yazıyla uzar. Sığmayan satırlar kayar; okuyanın bir imleci olan yerde sidebar'ın sonunda Pantrix'in kaydırma çubuğu durur.

Parametreler:

- `groups: List<SidebarGroup>`: Satırlar, gruplar hâlinde ve sırasıyla. Bir grupla sonraki arasına bir çizgi çizilir.
- `selected: String?`: Uygulamanın gösterdiği hedefin anahtarı; hiçbirini göstermiyorsa null.
- `onSelect: (String) -> Unit`: Basılan hedefin anahtarıyla çağrılır. Sidebar kendiliğinden hiçbir şey değiştirmez.
- `expanded: Set<String>`: Sütunda açık olan bölümlerin anahtarları. Ray bir bölümü kendi yanında açar ve hangisini açtığını kendisi tutar: uygulamanın bundan geri yükleyeceği bir şey yoktur.
- `onExpandedChange: (Set<String>) -> Unit`: Sütunun bir bölümüne basıldıktan sonra açık olması gereken bölümlerin anahtarlarıyla çağrılır.
- `modifier: Modifier`: Sidebar'ın modifier'ı. Sidebar stilinin söylediği kadar geniştir, yanlarındaki `insets` kadar da genişler. Boyu kendisine verilen yerin boyudur: satırları başlığın, sabit hedeflerin ve alt bilginin bıraktığı yeri alır ve o yerin içinde kayar. Yerin sonu yoksa, yani kayan bir sayfanın içinde, kendi boyu gerekir.
- `collapsed: Boolean`: Sidebar'ın, genişlik ne olursa olsun, ray olarak çizilip çizilmediği. Biçim hemen değişir, sidebar'ın genişliği temanın hareketiyle onu izler ve yanındaki sayfa onunla birlikte kayar.
- `adaptive: Boolean`: Sütunun sayfayı sıkıştıracağı yerde sidebar'ın kendiliğinden raya inip inmediği: kendisine verilen genişlikten sütunun genişliği çıkınca kalan, pencerenin Expanded sınırının altındaysa iner; pencerenin sınırları başkasını söylemedikçe bu 840dp'dir. O sınırın altında bir sayfada iki bölmeye yer yoktur. Değeri false ise biçimi yalnızca `collapsed` belirler: bu, sayfayı örten ve hiçbir şeyi sıkıştırmayan bir çekmecedeki sidebar ya da kullanıcısının sütunu sabitlemesine izin veren bir uygulama içindir. Kendisine verilen yeri ölçer, bu yüzden intrinsic boyutu sorulamaz: boyutu `IntrinsicSize` ile belirlenen bir üst öğenin altında kapat.
- `flyout: SidebarFlyout`: Rayın bir bölümünün ne açtığı: `SidebarFlyout.Popup` bölümün yanında bir kart, `SidebarFlyout.Panel` rayın yanında, sayfayı yana iten bir sütun açar. Sidebar sütun hâlindeyken bölümlerini iki durumda da yerinde açar.
- `singleExpanded: Boolean`: Sütunun bir bölümünü açmanın, açık olan bölümü kapatıp kapatmadığı.
- `style: SidebarStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: SidebarColors?`: Bu sidebar'ın, temanınkilerden farklı olan kendi renkleri: burada verilenler kullanılır, gerisi temanınki kalır. Bir rayın bölümünün açtığı kart ya da sütun da bu renklerle çizilir.
- `header: (@Composable SidebarSlotScope.() -> Unit)?`: Satırların üstünde durur ve kaymaz: uygulamanın işareti, bir çalışma alanı seçici. Bir çizgiyle ayrılır. `SidebarSlotScope.collapsed`'a bakarak elindeki genişliğe göre yerleşir.
- `footerItems: List<SidebarItem>`: Satırların altına, bir çizgiden sonra sabitlenen hedefler: ayarlar, yardım. Bölüm olamazlar: çocuğu olan biri reddedilir.
- `footer: (@Composable SidebarSlotScope.() -> Unit)?`: En altta, `footerItems`'ın ve bir çizginin altında durur ve kaymaz: bir hesap, bir plan. Başlık gibi, elindeki genişliğe göre yerleşir.
- `insets: PaddingValues`: Sidebar'ın kenarlarında boş bıraktığı pay. Dolgusu bu payın arkasına uzanır. Bir scaffold'un yan bar'ına verdiği paydır: böylece satırlar sistem çubuklarının dışında durur.
- `tagKey: String?`: Sidebar'ın otomasyon anahtarı: sidebar `Sidebar_<tagKey>`, içindeki bir hedef nerede gösterilirse gösterilsin `Sidebar_<tagKey>.Item_<key>`, bir bölüm `Sidebar_<tagKey>.Section_<key>` olur; bir rayın bölümünün açtığı ise `Sidebar_<tagKey>.Flyout_<key>` ya da `Sidebar_<tagKey>.Panel_<key>`. Bir basış `Sidebar` olayı olarak bildirilir: `select` hedefin anahtarını ve sidebar'ın o sırada ray olup olmadığını, `expand` ile `collapse` bölümün anahtarını taşır.
- `textStyle: TextStyle`: bir satırın adının yazı stili; sütunda, bir bölümün içinde ve rayın bir bölümünün açtığında: verilmezse temanın `label` stili. Bulunulan hedef ve onu tutan bölüm ondan bir kademe kalın yazılır. İçindeki bir renk satırın değildir; satırın rengi durumundandır.
- `titleTextStyle: TextStyle`: bir grubun başlığının büyük harflerle yazıldığı stil: verilmezse temanın `caption` stili, kalın. İçinde hangi renk olursa olsun sidebar'ın sessiz rengiyle yazılır.

### SidebarGroup

`import com.pantrixui.components.navigation.sidebar.SidebarGroup`, `com.pantrixui:components` içinden

```kotlin
class SidebarGroup(
    public val items: List<SidebarItem>,
    public val title: String? = null
)
```

Bir `PantrixSidebar`'ın satırlarından bir dizi; bir sonrakiyle arasında bir çizgi ya da üstünde `title`'ı durur.

Gruplar, bir sidebar'ın hangi hedeflerin birlikte olduğunu, uygulamanın üstte ne olduğunu ve altta neyi ölçtüğünü söyleme yoludur. Adı olmayan bir grup yalnızca bir çizgiyle ayrılır ve tek böyle gruplu bir sidebar hiç çizgi çizmez. Adı olan bir grup, bir belgelemenin "Başlarken" ve "Rehberler" bölümleri gibi, küçük büyük harflerle ve sessiz renkte yazılan adıyla başlar; rayda sözcüklere yer yoktur ve orada onun yerine çizgi çizilir.

Parametreler:

- `items: List<SidebarItem>`: Grubun satırları, sırasıyla.
- `title: String?`: Grubun adı: sütunda satırlarının üstünde durur; null verilirse yalnızca bir çizgi olur. Temanın dilinin kurallarıyla büyük harfle yazılır ve ekran okuyucu onu bir başlık olarak duyar.

Başka bir kurucu:

```kotlin
constructor(vararg items: SidebarItem)
```

A group of `items`, in the order they are given, without a title.

Parametreleri:

- `vararg items: SidebarItem`

### SidebarItem

`import com.pantrixui.components.navigation.sidebar.SidebarItem`, `com.pantrixui:components` içinden

```kotlin
class SidebarItem(
    public val key: String,
    public val label: String,
    public val icon: ImageVector? = null,
    public val children: List<SidebarItem> = emptyList(),
    public val detail: String? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

Bir `PantrixSidebar`'ın bir satırı: bir hedef ya da içinde hedefleri olan bir bölüm.

Parametreler:

- `key: String`: Sidebar'ın `selected`'ında tutulan ve `onSelect`'iyle bildirilen, bir bölüm için de `expanded`'ında tutulan değer. Her dilde aynıdır, böylece çevrilmiş bir ekran da nerede olduğunu bilir.
- `label: String`: Görünen yazı ve satırın ekran okuyucudaki adı.
- `icon: ImageVector?`: Etiketin önüne, etiketin renginde çizilir. İkon olmayacaksa null verilir. Ekran okuyucu onu atlar.
- `children: List<SidebarItem>`: Bu satırın içindeki hedefler. Çocuğu olan satır bir bölümdür, kendisi hedef değildir: basılınca açılır ya da kapanır. Sidebar iki düzeydir, daha derini yoktur. Bu yüzden bir çocuğun kendi çocukları çizilmez.
- `detail: String?`: Etiketin yanında bir sayı ya da bir durum: "87 açık", "48,2 Mn istek"; yoksa null. Bir rayın bölümünün açtığı kartta ya da sütunda yazılır: orada ona yer vardır. Sütun gidilecek yerlerin listesidir, yanından aşağı inen rakamlar veri gibi okunurdu.
- `enabled: Boolean`: Satıra basılıp basılamadığı. Basılamayan satır devre dışı yazı rengiyle yazılır. Basılamayan bir bölüm, sidebar'ın `expanded`'ı ne diyorsa öyle, açık ya da kapalı kalır, içindeki her hedef de kendi değerine uyar.
- `tagKey: String?`: Satırın otomasyon anahtarı. Her dilde aynıdır ve `key`'den başka olması istendiğinde verilir: anahtarı olan bir sidebar'ın test etiketinin içinde bir hedef `Item_<tagKey>`, bir bölüm `Section_<tagKey>` olur, `Sidebar_main.Item_crashes` gibi.

### SidebarSlotScope

`import com.pantrixui.components.navigation.sidebar.SidebarSlotScope`, `com.pantrixui:components` içinden

```kotlin
interface SidebarSlotScope : ColumnScope
```

Bir sidebar'ın başlığının ve alt bilgisinin içinde yerleştirildiği yer: sidebar kadar geniş, sidebar'ın hangi biçimde çizildiğini bilen bir sütun.

Bir başlık elindeki genişliğe göre yerleşir: rayda yalnızca bir işaret, sütunda işaret ve yanında bir ad. Bir alt bilgi aynısını bir avatarla yapar.

Üyeleri:

- `collapsed: Boolean`: Sidebar'ın ray olarak çizilip çizilmediği: çağıran öyle dediği için ya da adaptive bir sidebar kendiliğinden raya indiği için.

### SidebarFlyout

`import com.pantrixui.components.navigation.sidebar.SidebarFlyout`, `com.pantrixui:components` içinden

```kotlin
enum class SidebarFlyout
```

Daraltılmış bir `PantrixSidebar`'da, yani rayda, bir bölümün hedeflerini göstermek için açtığı şey.

Değerleri:

- `Popup`: Bölümün yanında, içindekiler kadar yüksek bir kart. İmleç olan yerde, imleç bölümün ya da kartın üzerinde durduğu sürece açıktır. Böylece imleç raydan aşağı inerken her bölüm sırayla okunur. İmleçsiz bir basış, yani parmağın, klavyenin ya da ekran okuyucunun basışı, kartı açar ve klavyeyi kartın içine alır, kart da kapatılana kadar açık kalır.
- `Panel`: Bölümün hedefleri, raya bitişik kendi sütunlarında: sütunun genişliğinde ve rayın boyunda. Sidebar'ın bir parçasıdır ve sidebar o kadar genişler. Böylece yanındaki sayfa örtülmez, yana itilir. Bir basışla açılır, imleç geçerken açılmaz. Bir hedef seçmek, bölüme yeniden basmak ve Escape onu kapatır; başka bir bölüme basmak onunkini gösterir.

### SidebarStyle

`import com.pantrixui.components.navigation.sidebar.SidebarStyle`, `com.pantrixui:components` içinden

```kotlin
class SidebarStyle(
    public val width: Dp = Dp.Unspecified,
    public val collapsedWidth: Dp = Dp.Unspecified,
    public val rowHeight: Dp = Dp.Unspecified,
    public val childRowHeight: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val collapsedIconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val childIndent: Dp = Dp.Unspecified,
    public val guideWidth: Dp = Dp.Unspecified,
    public val markerSize: Dp = Dp.Unspecified
) : PantrixStyle<SidebarStyle>
```

`PantrixSidebar`'ın geometrisi: sütun ve ray olarak genişliği, iki düzeydeki satırları ve bir bölümün hedeflerinin onun içinde olduğunu söyleyen çizgi.

Sütunun genişliği her platformda aynıdır: bir sidebar'ın içindekiler aynıdır, genişliğini değiştiren bir sidebar da uygulamanın bütün düzenini kendisiyle birlikte oynatırdı. Satırlar ve içlerindeki boşluk yoğunlukla ölçeklenir; genişlikler, ikonlar, girinti, köşeler, çizgi ve çubuk ölçeklenmez. Bir sidebar'ın renkleri stilinin parçası değildir: renkleri tema verir, kendi renkleri olan bir sidebar'da ise `SidebarColors`.

Parametreler:

- `width: Dp`: Sidebar'ın sütun olarak genişliği ve bir rayın bölümünün yanında açtığı sütunun genişliği: 248dp.
- `collapsedWidth: Dp`: Sidebar'ın ikon rayı olarak genişliği: Android'de ve iOS'ta 76dp, masaüstünde 68dp, web'de 72dp.
- `rowHeight: Dp`: Üst düzey bir satırın, bir hedefin ya da bir bölümün, en az yüksekliği: Android'de ve iOS'ta 44dp, masaüstünde 36dp, web'de 40dp. Bir satır hiçbir zaman platformun dokunma hedefinden alçak olmaz.
- `childRowHeight: Dp`: Bir bölümün içindeki hedefin en az yüksekliği: Android'de ve iOS'ta 40dp, masaüstünde 32dp, web'de 36dp. O da hiçbir zaman platformun dokunma hedefinden alçak olmaz.
- `shape: ShapeSpec`: Bir satırın dolgusunun köşeleri: Android'de ve iOS'ta orta, masaüstünde ve web'de küçük.
- `horizontalPadding: Dp`: Sidebar'ın kenarıyla bir satırın dolgusu arasındaki, bir de dolgunun kenarıyla satırın içindekiler arasındaki boşluk: Android'de ve iOS'ta 12dp, masaüstünde ve web'de 10dp.
- `iconSize: Dp`: Bir satırın ikonu ve bir bölümün oku: Android'de ve iOS'ta 20dp, masaüstünde ve web'de 18dp.
- `collapsedIconSize: Dp`: Rayda, satırın ikondan ibaret olduğu yerde, bir satırın ikonu: Android'de ve iOS'ta 24dp, masaüstünde ve web'de 22dp.
- `iconGap: Dp`: Bir satırın ikonuyla etiketinin arası: Android'de ve iOS'ta 12dp, masaüstünde ve web'de 10dp.
- `childIndent: Dp`: Bir bölümün içindeki hedefin, bölümünün başladığı yere göre ne kadar içeriden başladığı: Android'de ve iOS'ta 32dp, masaüstünde ve web'de 28dp.
- `guideWidth: Dp`: Açık bir bölümün hedefleri boyunca inen çizginin kalınlığı: 1dp.
- `markerSize: Dp`: Rayın kenarında, uygulamanın bulunduğu satırın yanındaki çubuğun kalınlığı: 4dp.

### SidebarColors

`import com.pantrixui.components.navigation.sidebar.SidebarColors`, `com.pantrixui:components` içinden

```kotlin
data class SidebarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified,
    public val marker: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir sidebar için `PantrixSidebar`'ın renkleri: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// The current destination in the success role, the rest as the theme has it.
PantrixSidebar(…, colors = SidebarColors(selectedContainer = PantrixTheme.colors.success.container))
```

Burada verilen `container` temanın rol renklerinden biriyse satırlar için temanın onunla eşlediği renk de gelir, `content` ayrıca verilmedikçe. `selectedContainer` da bulunulan hedef için eşlenik rengini getirir, `selectedContent` verilmedikçe. Hiçbir rolde olmayan bir dolgu bunu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Sidebar'ın dolgusu. Temanın `surface` rengi.
- `content: Color`: Bir bölümün ikonu ve adı, bir de başlıkla alt bilginin içindekilerden kendi rengini vermeyenler. Temanın `textPrimary` rengi. Bulunulan hedefin dışındaki hedefler ve bir bölümün oku, temanın kendi dolgusunda temanın `textSecondary` rengindedir, çağıranın dolgusunda ise bu renkte.
- `selectedContainer: Color`: Bulunulan hedefin arkasındaki dolgu. `primary` rolünün `container`'ı.
- `selectedContent: Color`: Bulunulan hedefin ikonu ve etiketi: `selectedContainer`'ın üstünde okunan renk. `primary` rolünün `onContainer`'ı.
- `divider: Color`: Başlığın, grupların, sabit hedeflerin ve alt bilginin arasındaki çizgiler, açık bir bölümün hedefleri boyunca inen çizgi ve bir rayın bölümünün açtığı kartın ya da sütunun kenarı. Temanın kendi zeminlerinde temanın `divider` rengi. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `content`'in bir payı: Subtle bir düğmenin kenarı gibi.
- `marker: Color`: Rayın kenarında, uygulamanın bulunduğu satırın yanındaki çubuk. Temanın kendi dolgusunda `primary` rolünün `color`'ı, çağıranın dolgusunda `content`.

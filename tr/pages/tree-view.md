# Tree View

Dalları açılıp kapanan bir hiyerarşi: klasörler ve dosyalar, kategoriler, bir belgenin başlıkları.

Hangi dalların açık olduğu ekranın durumudur: ağaca açık dalların anahtarları verilir (`expanded`), bir dal açılınca ya da kapanınca açık olması gereken yeni küme geri bildirilir (`onExpandedChange`). Hangi satırların seçili olduğu da öyledir (`selected`, `onSelectionChange`). Ağaç kendiliğinden bir şey değiştirmez.

- `PantrixTreeView` (`com.pantrixui.components.data.treeview`, `com.pantrixui:components`): Dalları açılıp kapanan bir hiyerarşi: teker teker ya da onay kutularıyla seçilen satırlar, açılınca yüklenen dallar ve aranan şeyi taşıyanları tutan bir süzgeç. Anahtar sözcükler: ağaç görünümü, dosya ağacı, hiyerarşi, iç içe liste, klasör ağacı, açılır liste.

## Özellikler

- **Düğümler.** Bir `TreeNode`'un `key`'i her dilde aynıdır ve bir ağaçta iki düğüm aynı anahtarı taşımaz. Satırda önce `icon`, sonra `label`, sonunda kısa bir yazı (`trailing`: bir sayı, bir dosyanın boyu) durur.
- **Seçim.** `TreeSelection.None` satıra basınca dalı açar ya da kapatır. `Single` basılan satırı seçer; `Checkbox` satırın onay kutusunu işaretler. Seçim varken satırın başındaki ok kendi basışıyla dalı açıp kapatır. Bir dalın onay kutusu altındaki işaretlenebilen her şeyi işaretler, hepsi işaretliyse temizler; altındakilerin yalnızca bir kısmı işaretli olan dal bir çizgi gösterir. `onSelectionChange` işaretli bütün düğümleri verir.
- **Devre dışı.** `enabled = false` olan düğüm seçilemez ve işaretlenemez, soluk yazılır; dalı yine açılıp kapanır.
- **Açınca yükleme.** `hasChildren = true` ve çocukları henüz boş olan düğümün oku çizilir; açılınca ekran çocuklarını yükler. Anahtarı `loading`'deyken okun yerinde dönen bir gösterge durur.
- **Süzme.** `filter` boşluktan fazlasını tutarken ağaç adında onu taşıyan satırları ve onların durduğu dalları gösterir; bulunan harfler işaretlenir, büyük küçük harf temanın diline göre karşılaştırılır (Türkçede İ ile i, I ile ı). Bu dallar süzme boyunca açıktır, okuyucu yine kapatabilir. Aranan şeyi taşıyan düğümün altındakilerin hepsi görünür. Hiçbir şey bulunmazsa ağaç satır göstermez; ne söyleneceği ekranın işidir.
- **Kılavuz çizgileri.** `guides` açık her dalın okundan altındakilerin boyunca soluk bir çizgi indirir.
- **Klavye.** Ağaç Tab için tek duraktır. Aşağı ve yukarı ok satırdan satıra, Home ve End ilk ve son satıra gider. Satır yönünde ok dalı açar, açık dalda ilk çocuğa gider; öteki ok açık dalı kapatır, başka bir satırda üstündeki dala gider. Bir harf o harfle başlayan sonraki satıra gider, `*` yanındaki bütün dalları açar. Enter ve Space satıra basar.
- **Ekran okuyucu.** Bir satır adını, sonundaki yazıyı, kapalı bir dalın kaç çocuğu olduğunu ve kaçıncı seviyede durduğunu temanın sözleriyle söyler; basışın ne yapacağı (seçmek, işaretlemek, açmak ya da kapatmak) sunulur, bir dal açık olup olmadığını söyler.
- **Boyut.** Ağaç verilen genişlik kadar geniş, açık satırları kadar uzundur ve kaydırmaz: kaydıran bir sayfada durur. Açık her satır kompoze edilir; binlerce açık satırı olan bir ağaç kendi listesini ister. Bir dalın çocukları temanın hareketiyle gelip gider.
- **Platform.** Satır platformun liste satırıdır: Android'de 48dp, iOS'ta 44pt, masaüstünde ve web'de 32dp; platformun dokunma hedefinden alçak olmaz, dokunmayla kullanılan bir masaüstünde ya da web sayfasında parmağınkini alır. Her seviye Android'de 24dp, iOS'ta 20pt, masaüstünde ve web'de 16dp içeri girer.
- **Renk.** `TreeViewColors` dolguyu, yazıyı, seçili satırı, kılavuz çizgilerini ve bulunan harflerin zeminini verir. Dolgusu olmayan ağaç arkasındakinin üstünde durur ve bir dolgunun üstünde o dolgunun verdiği renkle yazılır.
- **Otomasyon.** `tagKey` ile ağaç `TreeView_<tagKey>`, bir satırı `TreeView_<tagKey>.Node_<key>`, oku `TreeView_<tagKey>.Twisty_<key>` olur. Basışlar düğümün anahtarıyla `expand`, `collapse`, `select`, `check` ve `uncheck` olarak bildirilir.

## Kullanım

### Folders and files, one chosen

```kotlin
var open by remember { mutableStateOf(setOf("src")) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixTreeView(
    nodes = listOf(
        TreeNode(
            key = "src",
            label = "src",
            icon = PantrixIcons.Folder,
            children = listOf(TreeNode(key = "src/App.kt", label = "App.kt", trailing = "4 KB"))
        )
    ),
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "files"
)
```

### Checkboxes, and a filter

```kotlin
PantrixTreeView(
    nodes = permissions,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Checkbox,
    selected = granted,
    onSelectionChange = { granted = it },
    filter = query,
    guides = true,
    tagKey = "permissions"
)
```

## Örnekler

### Klasörler ve dosyalar

Bir projenin klasörleri ve dosyaları, biri seçili. Satıra basmak onu seçer; klasörün önündeki ok onu açar ya da kapatır. Her dosyanın boyu satırın sonunda yazar. Açık klasörler ve seçilen dosya ekranın durumudur ve `rememberSaveable` ile tutulur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("app", "app/src")) }
var chosen by rememberSaveable { mutableStateOf(setOf("app/src/App.kt")) }
PantrixTreeView(
    nodes = PROJECT_FILES,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "files"
)
PantrixText(
    text = "Seçilen: ${chosen.firstOrNull() ?: "yok"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val PROJECT_FILES = listOf(
    TreeNode(
        key = "app",
        label = "app",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(
                key = "app/src",
                label = "src",
                icon = PantrixIcons.Folder,
                children = listOf(
                    TreeNode(key = "app/src/App.kt", label = "App.kt", trailing = "4 KB"),
                    TreeNode(key = "app/src/Theme.kt", label = "Theme.kt", trailing = "2 KB"),
                    TreeNode(key = "app/src/Screens.kt", label = "Screens.kt", trailing = "9 KB")
                )
            ),
            TreeNode(
                key = "app/test",
                label = "test",
                icon = PantrixIcons.Folder,
                children = listOf(TreeNode(key = "app/test/AppTest.kt", label = "AppTest.kt", trailing = "3 KB"))
            ),
            TreeNode(key = "app/build.gradle.kts", label = "build.gradle.kts", trailing = "1 KB")
        )
    ),
    TreeNode(
        key = "docs",
        label = "docs",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(key = "docs/README.md", label = "README.md", trailing = "6 KB"),
            TreeNode(key = "docs/CHANGELOG.md", label = "CHANGELOG.md", trailing = "12 KB")
        )
    ),
    TreeNode(key = "settings.gradle.kts", label = "settings.gradle.kts", trailing = "1 KB")
)
```

### Onay kutularıyla izinler

Onay kutularıyla izinler. Bir dalı işaretlemek altındaki her izni işaretler; altındakilerin bir kısmı işaretli olan dal bir çizgi gösterir. "Kullanıcıları sil" devre dışıdır: işaretlenemez, dalı onu değiştirmez, ve onun yüzünden Kullanıcılar dalı hiçbir zaman tam işaretli olmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("users", "billing")) }
var granted by rememberSaveable { mutableStateOf(setOf("billing.view")) }
PantrixTreeView(
    nodes = PERMISSIONS,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Checkbox,
    selected = granted,
    onSelectionChange = { granted = it },
    tagKey = "permissions"
)
PantrixText(
    text = "İşaretli: ${granted.size}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)

private val PERMISSIONS = listOf(
    TreeNode(
        key = "users",
        label = "Kullanıcılar",
        children = listOf(
            TreeNode(key = "users.view", label = "Kullanıcıları görüntüle"),
            TreeNode(key = "users.edit", label = "Kullanıcıları düzenle"),
            TreeNode(key = "users.delete", label = "Kullanıcıları sil", enabled = false)
        )
    ),
    TreeNode(
        key = "billing",
        label = "Faturalar",
        children = listOf(
            TreeNode(key = "billing.view", label = "Faturaları görüntüle"),
            TreeNode(key = "billing.pay", label = "Fatura öde"),
            TreeNode(key = "billing.refund", label = "İade et")
        )
    ),
    TreeNode(
        key = "settings",
        label = "Ayarlar",
        children = listOf(
            TreeNode(key = "settings.general", label = "Genel"),
            TreeNode(key = "settings.security", label = "Güvenlik")
        )
    )
)
```

### Süzme ve kılavuz çizgileri

`filter` alana yazılanı adlarda arar: bulunan satırlar ve durdukları dallar görünür, bulunan harfler işaretlenir. Büyük küçük harf temanın diline göre karşılaştırılır: Türkçede "ı" yazınca "Işıklandırma" bulunur. Kılavuz çizgileri (`guides`) açık dalların altındakileri birbirine bağlar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
var open by rememberSaveable { mutableStateOf(setOf("home")) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Kategorilerde ara",
    showClearButton = true,
    contentDescription = "Kategorilerde ara",
    tagKey = "category_search"
)
PantrixTreeView(
    nodes = CATEGORIES,
    expanded = open,
    onExpandedChange = { open = it },
    filter = query.text.toString(),
    guides = true,
    tagKey = "categories"
)

private val CATEGORIES = listOf(
    TreeNode(
        key = "home",
        label = "Ev ve yaşam",
        children = listOf(
            TreeNode(key = "home.kitchen", label = "Mutfak", trailing = "128"),
            TreeNode(key = "home.light", label = "Işıklandırma", trailing = "64"),
            TreeNode(key = "home.bath", label = "Banyo", trailing = "41")
        )
    ),
    TreeNode(
        key = "tech",
        label = "Elektronik",
        children = listOf(
            TreeNode(key = "tech.phone", label = "Telefon", trailing = "212"),
            TreeNode(
                key = "tech.computer",
                label = "Bilgisayar",
                children = listOf(
                    TreeNode(key = "tech.computer.laptop", label = "Dizüstü", trailing = "96"),
                    TreeNode(key = "tech.computer.desktop", label = "Masaüstü", trailing = "38"),
                    TreeNode(key = "tech.computer.tablet", label = "Tablet", trailing = "57")
                )
            )
        )
    ),
    TreeNode(
        key = "wear",
        label = "Giyim",
        children = listOf(
            TreeNode(key = "wear.women", label = "Kadın", trailing = "340"),
            TreeNode(key = "wear.men", label = "Erkek", trailing = "295"),
            TreeNode(key = "wear.inner", label = "İç giyim", trailing = "87")
        )
    )
)
```

### Açınca yüklenen dallar

Açınca yüklenen dallar. Klasörlerin çocukları baştan bilinmez (`hasChildren = true`, `children` boş); bir klasör açılınca ekran onu `loading`'e koyar ve çocuklarını yükler, bu sırada okun yerinde dönen bir gösterge durur. Burada yükleme yarım saniye bekleyerek taklit edilir.

```kotlin
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.foundation.icons.PantrixIcons
import kotlinx.coroutines.delay

var open by rememberSaveable { mutableStateOf(emptySet<String>()) }
var loaded by rememberSaveable { mutableStateOf(emptyMap<String, Int>()) }
var loading by rememberSaveable { mutableStateOf(emptySet<String>()) }
LaunchedEffect(loading) {
    if (loading.isNotEmpty()) {
        delay(500)
        loaded = loaded + loading.associateWith { 3 }
        loading = emptySet()
    }
}
PantrixTreeView(
    nodes = listOf("documents" to "Belgeler", "pictures" to "Resimler", "music" to "Müzik").map { (key, label) ->
        lazyFolder(key, label, loaded)
    },
    expanded = open,
    onExpandedChange = { next ->
        loading = loading + (next - open).filter { it !in loaded }
        open = next
    },
    loading = loading,
    tagKey = "lazy"
)

private fun lazyFolder(
    key: String,
    label: String,
    loaded: Map<String, Int>
): TreeNode = TreeNode(
    key = key,
    label = label,
    icon = PantrixIcons.Folder,
    hasChildren = true,
    children = (1..(loaded[key] ?: 0)).map { TreeNode(key = "$key/$it", label = "$label $it") }
)
```

### Bir belgenin başlıkları

Seçimi olmayan bir ağaç, bir belgenin başlıkları: satıra basmak bölümü açar ya da kapatır. Klavyeyle ağaca Tab ile gelinir; oklar satırlarda gezer, bir harf o harfle başlayan başlığa gider, `*` yanındaki bütün bölümleri açar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode

var open by rememberSaveable { mutableStateOf(setOf("setup")) }
PantrixTreeView(
    nodes = OUTLINE,
    expanded = open,
    onExpandedChange = { open = it },
    guides = true,
    tagKey = "outline"
)

private val OUTLINE = listOf(
    TreeNode(key = "intro", label = "Giriş"),
    TreeNode(
        key = "setup",
        label = "Kurulum",
        children = listOf(
            TreeNode(key = "setup.gradle", label = "Gradle"),
            TreeNode(key = "setup.theme", label = "Tema")
        )
    ),
    TreeNode(
        key = "parts",
        label = "Bileşenler",
        children = listOf(
            TreeNode(key = "parts.buttons", label = "Düğmeler"),
            TreeNode(
                key = "parts.data",
                label = "Veri",
                children = listOf(
                    TreeNode(key = "parts.data.table", label = "Tablo"),
                    TreeNode(key = "parts.data.tree", label = "Ağaç")
                )
            )
        )
    ),
    TreeNode(key = "faq", label = "Sık sorulanlar")
)
```

### Bir dolgunun üstünde, kendi ölçüleriyle

Bir dolgunun üstünde ve kendi ölçüleriyle: ağacın dolgusu yoktur, birincil rolün yumuşak dolgusunun üstünde o dolgunun verdiği renkle yazılır. `TreeViewStyle` satırları alçaltır ve girintiyi büyütür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeViewStyle
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("setup", "parts")) }
PantrixSurface(color = PantrixTheme.colors.primary.container) {
    PantrixTreeView(
        nodes = OUTLINE,
        expanded = open,
        onExpandedChange = { open = it },
        guides = true,
        style = TreeViewStyle(rowHeight = 36.dp, indent = 28.dp),
        tagKey = "on_a_fill"
    )
}

private val OUTLINE = listOf(
    TreeNode(key = "intro", label = "Giriş"),
    TreeNode(
        key = "setup",
        label = "Kurulum",
        children = listOf(
            TreeNode(key = "setup.gradle", label = "Gradle"),
            TreeNode(key = "setup.theme", label = "Tema")
        )
    ),
    TreeNode(
        key = "parts",
        label = "Bileşenler",
        children = listOf(
            TreeNode(key = "parts.buttons", label = "Düğmeler"),
            TreeNode(
                key = "parts.data",
                label = "Veri",
                children = listOf(
                    TreeNode(key = "parts.data.table", label = "Tablo"),
                    TreeNode(key = "parts.data.tree", label = "Ağaç")
                )
            )
        )
    ),
    TreeNode(key = "faq", label = "Sık sorulanlar")
)
```

### Kendi renkleriyle

Kendi renkleriyle: `TreeViewColors` ağacın zeminini, yazısını, seçili satırı, girinti çizgilerini ve aramada bulunan yazıyı boyar. Burada seçili satır markanın değil bilginin rengindedir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.treeview.PantrixTreeView
import com.pantrixui.components.data.treeview.TreeNode
import com.pantrixui.components.data.treeview.TreeSelection
import com.pantrixui.components.data.treeview.TreeViewColors
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("app")) }
var chosen by rememberSaveable { mutableStateOf(setOf("app/build.gradle.kts")) }
PantrixTreeView(
    nodes = PROJECT_FILES,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    colors = TreeViewColors(
        selectedContainer = PantrixTheme.colors.info.container,
        selectedContent = PantrixTheme.colors.info.onContainer,
        guide = PantrixTheme.colors.info.color
    ),
    tagKey = "info_files"
)

private val PROJECT_FILES = listOf(
    TreeNode(
        key = "app",
        label = "app",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(
                key = "app/src",
                label = "src",
                icon = PantrixIcons.Folder,
                children = listOf(
                    TreeNode(key = "app/src/App.kt", label = "App.kt", trailing = "4 KB"),
                    TreeNode(key = "app/src/Theme.kt", label = "Theme.kt", trailing = "2 KB"),
                    TreeNode(key = "app/src/Screens.kt", label = "Screens.kt", trailing = "9 KB")
                )
            ),
            TreeNode(
                key = "app/test",
                label = "test",
                icon = PantrixIcons.Folder,
                children = listOf(TreeNode(key = "app/test/AppTest.kt", label = "AppTest.kt", trailing = "3 KB"))
            ),
            TreeNode(key = "app/build.gradle.kts", label = "build.gradle.kts", trailing = "1 KB")
        )
    ),
    TreeNode(
        key = "docs",
        label = "docs",
        icon = PantrixIcons.Folder,
        children = listOf(
            TreeNode(key = "docs/README.md", label = "README.md", trailing = "6 KB"),
            TreeNode(key = "docs/CHANGELOG.md", label = "CHANGELOG.md", trailing = "12 KB")
        )
    ),
    TreeNode(key = "settings.gradle.kts", label = "settings.gradle.kts", trailing = "1 KB")
)
```

## API

### PantrixTreeView

`import com.pantrixui.components.data.treeview.PantrixTreeView`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTreeView(
    nodes: List<TreeNode>,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    selection: TreeSelection = TreeSelection.None,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    loading: Set<String> = emptySet(),
    filter: String = "",
    guides: Boolean = false,
    style: TreeViewStyle? = null,
    colors: TreeViewColors? = null,
    tagKey: String? = null
)
```

Dalları açılıp kapanan bir hiyerarşi: klasörler ve dosyalar, kategoriler, bir belgenin başlıkları.

Hangi dalların açık olduğu, bir accordion'ın bölümleri gibi, çağıranın durumudur: `expanded` verilir ve `onExpandedChange` ile davranılır. Hangi satırların seçili olduğu da öyledir: `selected` verilir ve `onSelectionChange` ile davranılır. Bir ekranın bir bağlantının gösterdiği dalı açabilmesini, ağacı ekran dönünce bırakıldığı gibi tutabilmesini ya da kendi düğmesiyle hepsini kapatabilmesini sağlayan budur.

**Seçmek.** `TreeSelection.None` ile bir satıra basmak dalını açar ya da kapatır. `TreeSelection.Single` ile basmak satırı seçer, `TreeSelection.Checkbox` ile satırın onay kutusunu işaretler; satırın başındaki ok o zaman dalı açıp kapatan kendi basışıdır. Bir dalın onay kutusu altındaki işaretlenebilen her şeyi işaretler, hepsi işaretliyse temizler; çocuklarının hepsi işaretli olmayan dal bir çizgi gösterir, hepsi işaretli olan kendisi de işaretlidir. Bu türde `onSelectionChange`'e verilen, dallarıyla birlikte işaretli her düğümdür. `enabled` olmayan bir düğüm seçilemez ve işaretlenemez, dalı yine açılıp kapanır.

**Seviye seviye yüklemek.** `hasChildren`'ı true olan ve `children`'ı henüz boş olan düğümün oku vardır; onu açmak çağırana çocuklarını yüklemesini söyler. Anahtarı `loading`'deyken okunun yerinde dönen bir gösterge durur.

**Süzmek.** `filter` boşluklardan fazlasını tutarken ağaç, adı onu temanın dilinde tutan düğümleri, onu tutan harfler işaretlenmiş olarak, ve durdukları dalları gösterir; bu dallar süzme verildikçe açılır, okuyucu birini yine kapatabilir. Onu tutan bir düğümün altında ağaç, kendi dalları açık oldukça her şeyi gösterir. Hiçbir şeyin onu tutmadığı ağaç hiç satır göstermez; o zaman ne söyleneceği çağıranın işidir.

**Klavyeyle** ağaç Tab için tek duraktır: odağın en son durduğu satır, yoksa seçili olan ya da ilki. Aşağı ve yukarı ok satırdan satıra, Home ve End ilk ve son satıra gider; satırların başladığı yerin tersini gösteren ok bir dalı açar, açık bir dalda ilk çocuğuna gider, öteki açık bir dalı kapatır, başka bir satırda durduğu dala gider. Bir harf adı onunla başlayan sonraki satıra gider, `*` satırın yanındaki her dalı açar. Enter ve Space satıra basar.

**Ekran okuyucuya** bir satır, adı, sonundaki yazı, kapalı bir dalın kaç çocuğu olduğu ve satırın ne kadar derinde durduğudur, hepsi temanın sözleriyle. Ona basmanın ne yaptığı sunulur: seçmek, işaretlemek ya da açıp kapatmak; bir dal açık olup olmadığını söyler: Android'de o eylemle, başka yerde temanın sözleriyle. Satırlar, derinlikleri sınırlarına ne yaparsa yapsın durdukları sırayla okunur.

**Boyutu.** Ağaç kendisine verilen yer kadar geniş, açık satırları kadar uzundur ve kaydırmaz: kaydıran bir sayfada durur. Açık her satır kompoze edilir; bu yüzden binlerce açık satırı olan bir ağaç kendi listesini ister. Bir dalın çocukları temanın hareketiyle gelip gider.

```kotlin
var open by remember { mutableStateOf(setOf("src")) }
var chosen by remember { mutableStateOf(emptySet<String>()) }
PantrixTreeView(
    nodes = files,
    expanded = open,
    onExpandedChange = { open = it },
    selection = TreeSelection.Single,
    selected = chosen,
    onSelectionChange = { chosen = it },
    tagKey = "files"
)
```

Parametreler:

- `nodes: List<TreeNode>`: ağacın en üstündeki düğümler, gösterildikleri sırayla. Ağaçta iki düğüm aynı anahtarı taşımaz.
- `expanded: Set<String>`: açık dalların anahtarları.
- `onExpandedChange: (Set<String>) -> Unit`: bir dal açıldıktan ya da kapandıktan sonra açık olması gereken anahtarlarla çağrılır. Ağaç kendiliğinden bir şey değiştirmez.
- `modifier: Modifier`: ağacın modifier'ı. Ağaç kendisine verilen yer kadar geniş, açık satırları kadar uzundur.
- `selection: TreeSelection`: satırların nasıl seçildiği: hiç, bir seferde bir tane ya da onay kutularıyla.
- `selected: Set<String>`: seçili satırların, ya da işaretli olanların anahtarları.
- `onSelectionChange: ((Set<String>) -> Unit)?`: bir basıştan sonra seçili, ya da işaretli olması gereken anahtarlarla çağrılır. `null` satırları `selected`'ın tuttuğu gibi bırakır ve bir satıra basmak dalını açar ya da kapatır.
- `loading: Set<String>`: çocukları yüklenen dalların anahtarları: oklarının yerinde dönen bir gösterge durur.
- `filter: String`: satırların gösterilmesi için adlarının tutması gereken, ya da hepsi için hiçbir şey.
- `guides: Boolean`: açık her dalın okundan tuttuklarının boyunca soluk bir çizginin inip inmediği.
- `style: TreeViewStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar, her platformda, değişir.
- `colors: TreeViewColors?`: bu ağacın kendi renkleri, temanınkiler olmadıkları yerde: burada verilenler, gerisi için temanınkiler.
- `tagKey: String?`: ağacın otomasyon anahtarı: ağaç `TreeView_<tagKey>`, içindeki bir satır `TreeView_<tagKey>.Node_<key>` ve oku `TreeView_<tagKey>.Twisty_<key>` olur. Bir basışın ne yaptığı düğümün anahtarıyla bir `TreeView` olayı olarak bildirilir: `expand`, `collapse`, `select`, `check` ve `uncheck`.

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
    public val tagKey: String? = null
)
```

Bir `PantrixTreeView`'un bir düğümü ve onun altındaki düğümler.

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
- `tagKey: String?`: Satırın otomasyon anahtarı, her dilde aynı, `key`'den başka olması gerektiğinde: satır, anahtarı olan bir ağacın etiketinin içinde `Node_<tagKey>` olur, `TreeView_files.Node_src` gibi.

### TreeSelection

`import com.pantrixui.components.data.treeview.TreeSelection`, `com.pantrixui:components` içinden

```kotlin
enum class TreeSelection
```

Bir `PantrixTreeView`'un satırlarının nasıl seçildiği.

Değerleri:

- `None`: Hiçbiri seçilmez: bir satıra basmak dalını açar ya da kapatır.
- `Single`: Bir seferde bir satır: basmak onu seçer ve önce seçileni bırakır.
- `Checkbox`: İstenildiği kadar satır, her biri bir onay kutusuyla: bir dal altındaki her şeyi işaretler; altındakilerin yalnızca bir kısmı işaretliyse bir çizgi gösterir.

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
    public val guideWidth: Dp = Dp.Unspecified
) : PantrixStyle<TreeViewStyle>
```

`PantrixTreeView`'un geometrisi: bir satırın ne kadar yüksek olduğu, her seviyenin ne kadar içeri girdiği ve okun ne kadar büyük olduğu.

Bir satır, ağacın yapıldığı şey olan platformun kendi listesinin satırıdır: Android'de 48dp ve iOS'ta 44pt, oralarda bir parmağa verilenin en azı; masaüstünde ve web'de 32dp, bir işaretçiye verilenin en azı. Satır hiçbir zaman platformun dokunma hedefinden alçak olmaz; dokunmayla kullanılan bir masaüstü ya da web sayfası ona bir parmağınkini verir.

Satırın yüksekliği, ara ve iç boşluk yoğunluğu izler, sözcüklerin çevresindeki yer olarak. Girinti, ikonun boyu, kılavuzların kalınlığı ve şekil izlemez.

Parametreler:

- `shape: ShapeSpec`: Seçili bir satırın dolgusunun köşeleri: markanın şekil ölçeğinden bir adım ya da sabit bir şekil.
- `rowHeight: Dp`: Bir satırın en az yüksekliği. Daha büyük bir yazı onu uzatır.
- `indent: Dp`: Bir seviyenin altında durduğu seviyeden ne kadar içeri girdiği.
- `iconSize: Dp`: Okun, bir düğümün kendi ikonunun ve yüklenen bir dalın dönen göstergesinin genişliği ve yüksekliği.
- `gap: Dp`: Ok, onay kutusu, ikon, ad ve satırın sonundaki yazı arasında.
- `horizontalPadding: Dp`: Bir satırın kenarlarıyla tuttuğu şeyler arasındaki yer.
- `guideWidth: Dp`: Ağaç onları çiziyorsa açık bir daldan aşağı inen çizgilerin kalınlığı.

### TreeViewColors

`import com.pantrixui.components.data.treeview.TreeViewColors`, `com.pantrixui:components` içinden

```kotlin
data class TreeViewColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val guide: Color = Color.Unspecified,
    public val match: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir ağaç için `PantrixTreeView`'un neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// The chosen row in the success role, the rest as the theme has it.
PantrixTreeView(…, colors = TreeViewColors(selectedContainer = PantrixTheme.colors.success.container))
```

Burada verilen ve temanın rol renklerinden biri olan bir `container`, `content` de verilmedikçe satırlar için temanın onunla eşlediği rengi getirir; bir `selectedContainer` da `selectedContent` verilmedikçe seçili satır için kendi eşini getirir. Hiçbir rolün olmayan bir dolgu getirmez: onun üstünde neyin okunacağını çağıran verir.

Parametreler:

- `container: Color`: Satırların arkasındaki dolgu. Yok: ağaç arkasındakinin üstünde durur.
- `content: Color`: Bir satırın adı ve ikonu. Temanın `textPrimary`'si, ya da ağacın olmayan bir dolgunun üstünde o dolgunun üstündekilere verdiği renk. Ok ve satırın sonundaki yazı temanın kendi zeminlerinde temanın `textSecondary`'si, başka yerde ve bu renk verildiğinde bu renktir.
- `selectedContainer: Color`: Seçili satırın arkasındaki dolgu. Birincil rolün `container`'ı.
- `selectedContent: Color`: Seçili satırın adı, ikonu ve oku: `selectedContainer`'ın üstünde okunan renk. Birincil rolün `onContainer`'ı.
- `guide: Color`: Açık bir daldan aşağı inen çizgiler. Temanın kendi zeminlerinde temanın `divider`'ı. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `content`'in bir payı.
- `match: Color`: Süzmenin bulduğu harflerin arkasına konan. Temanın uyarı rolü yumuşatılmış, temanın onunla eşlediğiyle yazılır; bir dolgunun üstünde orada yazılanın bir payı, rengini koruyan harflerin altında. Seçilemeyen bir satır bunun bir payını, satırın soluk rengini koruyan harflerin altına koyar.

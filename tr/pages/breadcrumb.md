# Breadcrumb

Ekrandaki sayfanın üstündeki sayfaların izi: her biri oraya dönen bir bağlantı, sonuncusu ekrandaki sayfanın kendisi. Bir klasör yolunda, bir belgenin bölümlerinde ya da bir katalogda okuyana nerede olduğunu ve bir üste nasıl çıkacağını söyler. Bu sayfanın başındaki satır da bir `PantrixBreadcrumb`'dır.

İz tek satırdır ve alt satıra geçmez. Satıra sığmadığında kendiliğinden katlanır: ilk sayfadan sonrakiler, gerektiği kadarı, bir düğmenin arkasına geçer ve düğme onları bir menüde açar.

- `PantrixBreadcrumb` (`com.pantrixui.components.navigation.breadcrumb`, `com.pantrixui:components`): Ekrandakinin üstündeki sayfaların izi: her biri ona dönen bir bağlantı, sonda ekrandaki sayfa; satırına sığmayacak kadar uzun bir iz ortasını bir menüye katlar. Anahtar sözcükler: içerik haritası, ekmek kırıntısı, iz, yol, konum, hiyerarşi.

## Özellikler

- **Bağlantılar ve ekrandaki sayfa.** Üstteki sayfalar altı çizili birer bağlantıdır; birine basılınca `onSelect` anahtarını bildirir. Son sayfa ekrandaki sayfadır: yazıdır, basılmaz ve anahtarı hiç bildirilmez.
- **Kendiliğinden katlanır.** Satır dar geldiğinde iz ilk sayfasını ve son sayfalarını tutar, aradakiler üç noktalı düğmenin açtığı menüye geçer. İlk ve son sayfa düğmenin yanına da sığmıyorsa uzun adlar aynı genişliğe kesilir, kısa ad olduğu gibi kalır.
- **En çok kaç sayfa.** `maxItems` verilirse satır, yeri olsa da o kadardan çok sayfa göstermez. En az iki olmalıdır: iz ilk ve son sayfasını her zaman gösterir.
- **İkonlar.** `BreadcrumbItem.icon` sayfanın adından önce durur; `iconOnly` ile adının yerine geçer ve sayfa, adını ekran okuyucuya söyleyen bir düğme olur.
- **Yazı ve ölçüler.** `textStyle` adların yazı stilidir, verilmezse temanın `label` stili. `BreadcrumbStyle` adlarla işaretlerin arasını, işaretin ve ikonun boyunu verir; bunlar her platformda aynıdır. `minHeight` satırı dokunma hedefinden alçak kurar, `linkUnderline` bağlantıların altının ne zaman çizildiğini söyler.
- **Renkler.** `BreadcrumbColors` bağlantıları, ekrandaki sayfayı ve işaretleri ayrı ayrı boyar. Bir dolgunun üstünde renk verilmeyen izin tamamı, dolgunun üstüne yazılan renktedir.
- **Ekran okuyucu.** Satır "Gezinti yolu" adlı bir gruptur, son sayfa "Geçerli sayfa" durumuyla okunur, aradaki işaretler okunmaz. iOS'ta grubun adı yoktur: oradaki okuyucu bir grubun adını içindekilerden sonra okur.
- **Sağdan sola.** Sağdan sola okunan dillerde iz sağdan başlar ve işaretler döner.
- **Otomasyon.** `tagKey` verilen izin sayfaları ve katlanmış sayfaların düğmesi onun içinde adlandırılır: `Breadcrumb_docs.Item_components`, `Breadcrumb_docs.More_pages`.

## Kullanım

### Over a page of the documentation

```kotlin
PantrixBreadcrumb(
    items = listOf(
        BreadcrumbItem(key = "home", label = stringResource(Res.string.home)),
        BreadcrumbItem(key = "components", label = stringResource(Res.string.components)),
        BreadcrumbItem(key = "breadcrumb", label = stringResource(Res.string.breadcrumb))
    ),
    onSelect = { key -> onOpen(key) },
    tagKey = "docs"
)
```

### Folders, the first shown by its icon alone and never more than four in the row

```kotlin
PantrixBreadcrumb(
    items = listOf(BreadcrumbItem(key = "root", label = rootName, icon = PantrixIcons.Folder, iconOnly = true)) +
        folders.map { BreadcrumbItem(key = it.id, label = it.name) },
    onSelect = onOpenFolder,
    maxItems = 4,
    tagKey = "folders"
)
```

## Örnekler

### Klasörlerde gezinme

En yalın hâli: izin sayfaları (`items`) ve birine basılınca ne olacağı (`onSelect`). Hangi sayfada olunduğu ekranın durumudur; iz onu tutmaz, yalnızca basılan sayfanın anahtarını bildirir.

Üstteki bir klasöre bas: oraya çıkılır ve iz o klasörde biter. "Alt klasöre in" yolu yeniden uzatır. Son sayfa basılmaz: orası zaten bulunulan yerdir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

var depth by rememberSaveable { mutableIntStateOf(FOLDERS.size) }
PantrixBreadcrumb(
    items = FOLDERS.take(depth),
    onSelect = { key -> depth = FOLDERS.indexOfFirst { it.key == key } + 1 },
    tagKey = "folders"
)
FolderControls(depth = depth, onDeeper = { depth++ }, tagKey = "folders_deeper")

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Ana sayfa"),
    BreadcrumbItem(key = "documents", label = "Belgeler"),
    BreadcrumbItem(key = "projects", label = "Projeler"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Tasarım")
)

@Composable
private fun FolderControls(
    depth: Int,
    onDeeper: () -> Unit,
    tagKey: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(
            text = "Alt klasöre in",
            onClick = onDeeper,
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            enabled = depth < FOLDERS.size,
            tagKey = tagKey
        )
        PantrixText(text = "Buradasın: ${FOLDERS[depth - 1].label}", color = PantrixTheme.colors.textSecondary)
    }
}
```

### En çok üç sayfa gösteren bir satır

`maxItems = 3`: satır, yeri olsa da üçten çok sayfa göstermez. İlk sayfa ve son ikisi kalır; aradakiler üç noktalı düğmenin arkasındadır.

Düğmeye bas: katlanan klasörler izdeki sırayla bir menüde açılır. Menüden seçilen klasör de satırdaki gibi `onSelect` ile bildirilir ve oraya çıkılır. Yol üç sayfaya inince düğme kalkar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

var depth by rememberSaveable { mutableIntStateOf(FOLDERS.size) }
PantrixBreadcrumb(
    items = FOLDERS.take(depth),
    onSelect = { key -> depth = FOLDERS.indexOfFirst { it.key == key } + 1 },
    maxItems = 3,
    tagKey = "folded"
)
FolderControls(depth = depth, onDeeper = { depth++ }, tagKey = "folded_deeper")

@Composable
private fun FolderControls(
    depth: Int,
    onDeeper: () -> Unit,
    tagKey: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixButton(
            text = "Alt klasöre in",
            onClick = onDeeper,
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            enabled = depth < FOLDERS.size,
            tagKey = tagKey
        )
        PantrixText(text = "Buradasın: ${FOLDERS[depth - 1].label}", color = PantrixTheme.colors.textSecondary)
    }
}

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Ana sayfa"),
    BreadcrumbItem(key = "documents", label = "Belgeler"),
    BreadcrumbItem(key = "projects", label = "Projeler"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Tasarım")
)
```

### İkonlar: adın önünde ya da adın yerine

`icon` sayfanın adından önce durur ve adın rengindedir. İkon ile ad tek bir bağlantıdır: ikona basmak ada basmaktır, klavye için ikinci bir durak ve okuyucu için ikinci bir şey değildir.

İlk izde ilk sayfa `iconOnly` ile yalnızca ikonuyla gösterilir: adını ekran okuyucuya söyleyen bir düğmedir. İkonu olmayan sayfa, `iconOnly` ne derse desin adıyla yazılır.

İkinci izde yalnızca ikonuyla gösterilen iki sayfa katlanmış durumda. Üç noktalı düğmeye bas: menü her sayfanın ikonunun yanına adını da yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.icons.PantrixIcons

PantrixBreadcrumb(
    items = listOf(
        BreadcrumbItem(key = "files", label = "Dosyalar", icon = PantrixIcons.Folder, iconOnly = true),
        BreadcrumbItem(key = "starred", label = "Yıldızlılar", icon = PantrixIcons.Star),
        BreadcrumbItem(key = "schedule", label = "Takvim", icon = PantrixIcons.Calendar)
    ),
    onSelect = {},
    tagKey = "icons"
)
PantrixBreadcrumb(
    items = listOf(
        BreadcrumbItem(key = "files", label = "Dosyalar", icon = PantrixIcons.Folder, iconOnly = true),
        BreadcrumbItem(key = "starred", label = "Yıldızlılar", icon = PantrixIcons.Star, iconOnly = true),
        BreadcrumbItem(key = "schedule", label = "Takvim", icon = PantrixIcons.Calendar, iconOnly = true),
        BreadcrumbItem(key = "today", label = "Bugün")
    ),
    onSelect = {},
    maxItems = 2,
    tagKey = "icons_folded"
)
```

### Satıra sığmayan yol kendiliğinden katlanır

`maxItems` verilmedi: iz, kendisine kalan genişliğe göre katlanır. Önce ilk sayfadan sonrakiler, gerektiği kadarı, düğmenin arkasına geçer; iz başladığı ilk sayfayı ve bulunduğu son sayfaları tutar. İlk ve son sayfa düğmenin yanına da sığmıyorsa uzun adlar aynı genişliğe kesilir, kısa ad olduğu gibi kalır.

Aynı yol üç genişlikte: ilki örneğin genişliğinde, ötekiler en çok 480dp ve 240dp genişliğindeki çerçevelerde. Ortadaki çerçevede aradaki sayfa düğmenin arkasındadır; dar çerçevede son sayfanın adı da kesilir. Pencereyi daralt: ilk iz de aynı sırayla katlanır.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

PantrixBreadcrumb(items = LONG_PATH, onSelect = {}, tagKey = "long")
PantrixSurface(modifier = Modifier.width(480.dp), border = PantrixTheme.colors.divider) {
    PantrixBreadcrumb(
        items = LONG_PATH,
        onSelect = {},
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "long_medium"
    )
}
PantrixSurface(modifier = Modifier.width(240.dp), border = PantrixTheme.colors.divider) {
    PantrixBreadcrumb(
        items = LONG_PATH,
        onSelect = {},
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "long_narrow"
    )
}

private val LONG_PATH = listOf(
    BreadcrumbItem(key = "home", label = "Ana sayfa"),
    BreadcrumbItem(key = "systems", label = "Tasarım sistemleri ve bileşen kitaplıkları"),
    BreadcrumbItem(key = "navigation", label = "Geniş ve dar pencereler için gezinme")
)
```

### Bir dolgunun üstünde

Temanın zemini olmayan bir dolgunun üstünde iz. Renk verilmedi: dolgu, üstüne ne renkle yazıldığını söyler ve izin tamamı, bağlantılar, ekrandaki sayfa ve işaretler, o renkle yazılır. Temanın bağlantı ve yazı renkleri temanın kendi zeminleri içindir; burada bağlantı, ekrandaki sayfadan altındaki çizgiyle ayrılır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(
    modifier = Modifier.fillMaxWidth(),
    color = PantrixTheme.colors.primary.color,
    shape = PantrixTheme.shapes.md
) {
    PantrixBreadcrumb(
        items = FOLDERS,
        onSelect = {},
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.md),
        maxItems = 3,
        tagKey = "filled"
    )
}

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Ana sayfa"),
    BreadcrumbItem(key = "documents", label = "Belgeler"),
    BreadcrumbItem(key = "projects", label = "Projeler"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Tasarım")
)
```

### Yazı stili ve ölçüler

`textStyle` adların yazı stilidir: verilmeyen iz temanın `label` stiliyle yazılır. `style` ise ölçüleri verir: `itemGap` bir adla yanındaki işaretin ve bir ikonla adının arası, `separatorSize` işaretin ve katlanmış sayfaların düğmesinin, `iconSize` sayfanın kendi ikonunun boyu. Yalnızca verilen alanlar değişir.

Ortadaki iz hiçbir şey verilmemiş hâlidir: 16dp'lik işaretler ve ikonlar, adlardan 4dp uzakta. Üstündeki küçük, altındaki büyük yazılmış aynı izdir. Üçünün satırı da en az platformun dokunma hedefi kadar yüksektir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixBreadcrumb(
    items = PLACES,
    onSelect = {},
    textStyle = PantrixTheme.typography.footnote,
    style = BreadcrumbStyle(itemGap = 2.dp, separatorSize = 12.dp, iconSize = 12.dp),
    tagKey = "small"
)
PantrixBreadcrumb(items = PLACES, onSelect = {}, tagKey = "usual")
PantrixBreadcrumb(
    items = PLACES,
    onSelect = {},
    textStyle = PantrixTheme.typography.callout,
    style = BreadcrumbStyle(itemGap = 8.dp, separatorSize = 20.dp, iconSize = 20.dp),
    tagKey = "large"
)

private val PLACES = listOf(
    BreadcrumbItem(key = "files", label = "Dosyalar", icon = PantrixIcons.Folder),
    BreadcrumbItem(key = "starred", label = "Yıldızlılar", icon = PantrixIcons.Star),
    BreadcrumbItem(key = "schedule", label = "Takvim", icon = PantrixIcons.Calendar)
)
```

### Bir başlığın üstünde, alçak ve çizgisiz

Bir belge sayfasının başlığının üstündeki iz: bir satır yazı kadar alçak ve altı çizgisiz. `minHeight` satırın en az yüksekliğidir; verilmezse platformun dokunma hedefidir. Daha alçak bir satırda da bir sayfanın yanına dokunmak ona ulaşır: tema küçük bir hedefe dokunuş için düzende yer kaplamayan bir pay verir.

`linkUnderline = LinkUnderline.OnHover` bağlantıların altını yalnızca işaretçi üstündeyken ve odaktayken çizer: iz bir cümlenin içinde durmaz ve işaretleri bağlantıları ekrandaki sayfadan zaten ayırır. Dokunarak kullanılan platformda altları yine her zaman çizilidir.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.link.LinkUnderline
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Column {
    PantrixBreadcrumb(
        items = PLACES,
        onSelect = {},
        textStyle = PantrixTheme.typography.footnote,
        style = BreadcrumbStyle(minHeight = 20.dp, linkUnderline = LinkUnderline.OnHover),
        tagKey = "over_a_title"
    )
    PantrixText(text = PLACES.last().label, style = PantrixTheme.typography.headline)
}

private val PLACES = listOf(
    BreadcrumbItem(key = "files", label = "Dosyalar", icon = PantrixIcons.Folder),
    BreadcrumbItem(key = "starred", label = "Yıldızlılar", icon = PantrixIcons.Star),
    BreadcrumbItem(key = "schedule", label = "Takvim", icon = PantrixIcons.Calendar)
)
```

### Kendi renkleri, küçük yazı ve küçük işaretlerle

`colors` bağlantıların (`link`), ekrandaki sayfanın (`current`) ve işaretlerin (`separator`) rengini ayrı ayrı alır; verilmeyen temanınki kalır. Burada bağlantılar ve işaretler temanın hiçbir rolünde olmayan, uygulamanın kendi morundadır; ekrandaki sayfa verilmedi ve temanın yazı renginde kaldı.

Yazı `footnote`, işaretler 12dp ve adlardan 6dp uzakta: renk, yazı stili ve ölçüler birbirinden bağımsız verilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbColors
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem
import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle
import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixBreadcrumb(
    items = FOLDERS.take(3),
    onSelect = {},
    textStyle = PantrixTheme.typography.footnote,
    style = BreadcrumbStyle(itemGap = 6.dp, separatorSize = 12.dp),
    colors = BreadcrumbColors(link = own.color, separator = own.color),
    tagKey = "own"
)

private val FOLDERS = listOf(
    BreadcrumbItem(key = "home", label = "Ana sayfa"),
    BreadcrumbItem(key = "documents", label = "Belgeler"),
    BreadcrumbItem(key = "projects", label = "Projeler"),
    BreadcrumbItem(key = "pantrix", label = "Pantrix"),
    BreadcrumbItem(key = "design", label = "Tasarım")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixBreadcrumb

`import com.pantrixui.components.navigation.breadcrumb.PantrixBreadcrumb`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixBreadcrumb(
    items: List<BreadcrumbItem>,
    onSelect: (key: String) -> Unit,
    modifier: Modifier = Modifier,
    maxItems: Int = Int.MAX_VALUE,
    textStyle: TextStyle = PantrixTheme.typography.label,
    style: BreadcrumbStyle? = null,
    colors: BreadcrumbColors? = null,
    tagKey: String? = null
)
```

Ekrandaki sayfanın üstündeki sayfaların izi: her biri oraya dönen bir bağlantıdır ve iz ekrandaki sayfayla biter.

Üstteki sayfalar altı çizili bağlantılardır ve bağlantı olarak duyurulur. Sonuncusu ekrandaki sayfadır: durumunu ekran okuyucunun geçerli sayfa diye söylediği bir yazı. Bir sayfanın adından önce ya da adının yerine bir ikonu olabilir: yalnızca ikonuyla gösterilen sayfa, adını sayfadan alan bir düğmedir. Sayfaların arasındaki işaretler izin okunduğu yönü gösterir ve ekran okuyucuya bir şey söylemez. Satır tek bir gruptur ve temanın dilinde gezinti yolu diye adlandırılır. iOS'ta adı olmayan bir gruptur: oradaki ekran okuyucu bir grubun kendi adını grubun içindekilerden sonra okur, izin sonundaki bir şey daha gibi.

İz tek satırdır, en az platformun dokunma hedefi kadar yüksek ve sayfaları kadar geniştir: altındaki metnin başladığı yerde başlar. Alt satıra hiç geçmez. Satır izin tamamına dar geldiğinde ilk sayfadan sonrakiler, gerektiği kadarı, onları bir menüde açan bir düğmenin arkasına katlanır: iz, başladığı yer olan ilk sayfasını ve bulunduğu yer olan son sayfalarını tutar. İlk ve son sayfa o düğmenin yanına da sığmıyorsa en uzun adlar aynı genişliğe kesilir, kısa bir ad ise olduğu gibi kalır.

`maxItems` sığacak bir izi de katlar: satır hiçbir zaman ondan çok sayfa göstermez. Menüden seçilen bir sayfa, satırda basılan bir sayfa gibi bildirilir.

Parametreler:

- `items: List<BreadcrumbItem>`: En üstteki sayfadan başlayıp ekrandaki sayfayla biten iz.
- `onSelect: (key: String) -> Unit`: Satırda ya da menüde basılan sayfanın anahtarıyla çağrılır. Son sayfanınkiyle hiç çağrılmaz: uygulama zaten oradadır.
- `modifier: Modifier`: Satıra uygulanır.
- `maxItems: Int`: Satırın, ne kadar yeri olursa olsun, en çok kaç sayfa gösterdiği: en az iki.
- `textStyle: TextStyle`: Sayfaların yazıldığı yazı stili: verilmezse temanın `label` stili.
- `style: BreadcrumbStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: BreadcrumbColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar. Satırın test etiketi `Breadcrumb_<tagKey>` olur. Sayfaları da, katlanmış sayfaları gösteren düğme de onun içinde adlandırılır: `Breadcrumb_<tagKey>.Item_<page's key>` ve `Breadcrumb_<tagKey>.More_pages`. Menü `Menu_<tagKey>_more` olur ve katlanmış her sayfa için bir satırı vardır.

### BreadcrumbItem

`import com.pantrixui.components.navigation.breadcrumb.BreadcrumbItem`, `com.pantrixui:components` içinden

```kotlin
class BreadcrumbItem(
    public val key: String,
    public val label: String,
    public val icon: ImageVector? = null,
    public val iconOnly: Boolean = false,
    public val tagKey: String? = null
)
```

Bir `PantrixBreadcrumb`'ın izindeki bir sayfa.

Parametreler:

- `key: String`: Sayfaya basılınca izin `onSelect`'inin bildirdiği değer. Her dilde aynıdır: böylece çevrilmiş bir ekran da hangi sayfanın istendiğini bilir.
- `label: String`: Sayfanın adı: yazıldığı ve ekran okuyucunun söylediği hâliyle.
- `icon: ImageVector?`: Sayfanın, adından önce duran resmi: bir izin ilk sayfasının önündeki ev gibi.
- `iconOnly: Boolean`: Sayfanın yalnızca `icon`'uyla gösterilip gösterilmediği. O zaman ekran okuyucu sayfa için `label`'ını söyler, katlanmış sayfaların menüsü de ikonun yanına onu yazar. İkonu olmayan bir sayfa, bu ne derse desin adıyla yazılır.
- `tagKey: String?`: Sayfanın, her dilde aynı olan otomasyon anahtarı: `key`'den başka bir anahtar olması istendiğinde verilir. Sayfa, anahtarı olan bir izin test etiketinin içinde `Item_<tagKey>` olur: `Breadcrumb_docs.Item_components` gibi.

### BreadcrumbStyle

`import com.pantrixui.components.navigation.breadcrumb.BreadcrumbStyle`, `com.pantrixui:components` içinden

```kotlin
class BreadcrumbStyle(
    public val itemGap: Dp = Dp.Unspecified,
    public val separatorSize: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val linkUnderline: LinkUnderline? = null
) : PantrixStyle<BreadcrumbStyle>
```

`PantrixBreadcrumb`'ın geometrisi: bir sayfayla yanındaki işaretin arası, o işaretin boyu ve sayfanın kendi ikonunun boyu. Her platformda aynıdır: sayfaların izi bir satır yazıdır, işaretleri ve ikonları 16dp'dir ve adlardan 4dp uzakta durur. Aradaki boşluk yoğunlukla ölçeklenir, işaret ve ikon ölçeklenmez.

Parametreler:

- `itemGap: Dp`: Bir sayfanın adıyla onu sonrakinden ayıran işaretin arası ve bir sayfanın ikonuyla adının arası.
- `separatorSize: Dp`: İki sayfa arasındaki işaret ve izin katladığı sayfaların yerinde duran düğme.
- `iconSize: Dp`: Sayfanın kendi ikonu: adından önce ya da adının yerinde.
- `minHeight: Dp`: İzin satırının en az yüksekliği: verilmezse platformun dokunma hedefi; böylece bir sayfanın yanındaki dokunuşun altında başka bir şey kalmaz. Daha alçak bir değer izi bir sayfa başlığının üstündeki bir satır yazıya uydurur; tema küçük bir hedefe düzende yer kaplamayan bir dokunma payı verdiği için bir sayfanın yanına dokunmak yine ona ulaşır.
- `linkUnderline: LinkUnderline?`: Ekrandaki sayfanın üstündeki sayfaların altının ne zaman çizildiği: verilmezse `Always`. Bir iz hiçbir cümlenin içinde durmaz ve işaretleri de bağlantılarını ekrandaki sayfadan ayırır: `LinkUnderline.OnHover` onların altını işaretçinin altında ve klavye odağında, parmağın altında her zaman çizer.

### BreadcrumbColors

`import com.pantrixui.components.navigation.breadcrumb.BreadcrumbColors`, `com.pantrixui:components` içinden

```kotlin
data class BreadcrumbColors(
    public val link: Color = Color.Unspecified,
    public val current: Color = Color.Unspecified,
    public val separator: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir iz için `PantrixBreadcrumb`'ın renkleri: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
PantrixBreadcrumb(…, colors = BreadcrumbColors(link = PantrixTheme.colors.success.color))
```

İzin kendi dolgusu yoktur, arkasında ne varsa onun üstünde durur. Bir dolgu, üstüne ne renkle yazıldığını söyler ve dolgunun üstündeki izin tamamı o renkle yazılır: temanın bağlantı, yazı ve işaret renkleri temanın kendi zeminleri içindir. Orada bağlantı, ekrandaki sayfadan altındaki çizgiyle ayrılır.

Parametreler:

- `link: Color`: Ekrandaki sayfanın üstündeki, bağlantı olan sayfalar ve ikonları. `primary` rolünün `color`'ı.
- `current: Color`: Ekrandaki sayfa, yani izin son sayfası, ve ikonu. Temanın `textPrimary` rengi.
- `separator: Color`: İki sayfa arasındaki işaretler ve uzun bir izin katladığı sayfaları gösteren düğme. Temanın `textSecondary` rengi.

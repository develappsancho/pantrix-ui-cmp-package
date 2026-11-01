# Navigation Rail

Uygulamanın üst düzey hedefleri, geniş bir pencerenin başlangıç kenarında, alt alta: navigation bar'ın tablet, açık katlanır telefon ve masaüstü penceresindeki yeri. Ray, bar'ın hedeflerini ve renklerini alır: dar pencerede bar'ı, geniş pencerede rayı gösteren bir ekran ikisine de aynı listeyi verir.

Burada raylar sayfanın içinde, boyu belli ve kenarlı bir çerçevede durur. Gerçek bir ekranda ray `PantrixScaffold`'un yan bar'ıdır: pencerenin boyu kadardır, dolgusu sistem çubuklarının arkasına uzanır.

- `PantrixNavigationRail` (`com.pantrixui.components.navigation.navigationrail`, `com.pantrixui:components`): Geniş bir pencerenin baş kenarı boyunca uygulamanın üst düzey hedefleri, biri uygulamanın bulunduğu yer olarak işaretli, isteğe bağlı bir üst bölümün altında: yan yatırılmış bir gezinme barının hedefleri. Anahtar sözcükler: yan gezinme, ray, gezinme rayı, dikey gezinme, tablet gezinmesi.

## Özellikler

- **Bar ile aynı hedefler.** `items` bir `NavigationItem` listesidir: ikon, etiket, rozet, seçiliyken başka ikon ve basılamayan hedef bar'daki gibidir. Bir ray üç ile yedi hedef taşır.
- **Durum ekranındır.** `selected` bulunulan hedefin anahtarıdır, `onSelect` basılanınkini bildirir; bulunulan hedefe yeniden basmak da bildirilir. `selected` null ise hiçbir hedef işaretlenmez.
- **Başlık.** `header` hedeflerin üstünde, rayın ortasında durur: menüyü açan bir düğme ya da ekranın ana işi.
- **Kayan hedefler.** Hedefler raydan uzunsa kendi içinde kayar; başlık yerinde kalır.
- **Boy.** Ray kendisine verilen yerin boyu kadardır ve o yerin bir sonu olmalıdır: bir scaffold'un yan bar'ının vardır, kayan bir sayfanın içinde boyu belli bir kutu gerekir.
- **Hap ya da yalnızca renk.** Bulunulan hedef ikonunun arkasındaki hapla işaretlenir; `NavigationRailStyle`'ın `indicator` alanı `NavigationIndicator.None` ise yalnızca rengiyle.
- **Her platformda aynı.** 80dp genişliğinde, bitiş kenarında ince bir çizgi; hedefler 56dp yüksekliğinde ve 4dp arayla. Ölçüleri `style`, etiketin yazısını `labelStyle` değiştirir.
- **Renkler.** `NavigationColors` bar'ınkiyle aynı sınıftır: iki bileşeni de tek bir renk kümesi boyar.
- **Sistem çubukları.** `insets` rayın üstte, altta ve başlangıç kenarında boş bıraktığı paydır: dolgu arkasına uzanır, hedefler dışında kalır.
- **Ekran okuyucu ve sağdan sola.** Bir hedef sekme olarak okunur: adı, rozetinin söylediği ve seçili olup olmadığı. Sağdan sola okunan dillerde ray sağ kenardadır ve çizgisi sol kenarına geçer.

## Kullanım

### A rail in a wide window and a bar in a narrow one, from one list

```kotlin
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Start ->
                PantrixNavigationRail(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
            ScaffoldNavigationPlacement.Bottom ->
                PantrixNavigationBar(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
            ScaffoldNavigationPlacement.VerticalBar -> PantrixNavigationBar(
                items = destinations,
                selected = where,
                onSelect = onNavigate,
                orientation = NavigationBarOrientation.Vertical
            )
        }
    }
) { padding ->
    Destination(where, Modifier.padding(padding))
}
```

### A menu button over the destinations

```kotlin
PantrixNavigationRail(
    items = destinations,
    selected = where,
    onSelect = onNavigate,
    header = {
        PantrixIconButton(
            imageVector = PantrixIcons.Menu,
            contentDescription = stringResource(Res.string.open_menu),
            onClick = onOpenMenu,
            tagKey = "menu"
        )
    },
    tagKey = "main"
)
```

## Örnekler

### Üç hedef

En yalın hâli: hedeflerin listesi (`items`), bulunulan hedefin anahtarı (`selected`) ve basılan hedefin anahtarını alan `onSelect`. Hedefler üstten başlayarak alt alta durur; her biri ray kadar geniştir, ikonun yanına basmak da hedefe basmaktır.

Ray, çerçevenin boyu kadardır (240dp): boyu olmayan bir yerde, kayan bir sayfanın içinde, ona bir boy vermek gerekir.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val destinations = listOf(
    NavigationItem(key = "files", label = "Dosyalar", icon = PantrixIcons.Folder),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "profile", label = "Profil", icon = PantrixIcons.Person)
)
var where by rememberSaveable { mutableStateOf("files") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(240.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = destinations,
            selected = where,
            onSelect = { where = it },
            tagKey = "plain"
        )
        PantrixText(
            text = "Açık hedef: ${destinations.first { it.key == where }.label}",
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Menü düğmesinin altında üç hedef

`header` hedeflerin üstünde, rayın ortasında durur: burada menüyü açan bir düğme. Basınca yandaki alan sayar.

Hedefler bir posta uygulamasınındır. "Gelen"deki rozet okunmamışları sayar: hedef açılınca sayı sıfırlanır ve rozet kalkar. Ekran okuyucu rozeti hedefin adından sonra okur: "Gelen, 3 okunmamış".

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("starred") }
var unread by rememberSaveable { mutableIntStateOf(3) }
var menus by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(440.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = listOf(
                NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
                NavigationItem(
                    key = "inbox",
                    label = "Gelen",
                    icon = PantrixIcons.Inbox,
                    badge = if (unread > 0) NavigationBadge("$unread okunmamış", count = unread) else null
                ),
                NavigationItem(key = "profile", label = "Profil", icon = PantrixIcons.Person)
            ),
            selected = where,
            onSelect = { key ->
                where = key
                if (key == "inbox") unread = 0
            },
            header = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Menu,
                    contentDescription = "Menüyü aç",
                    onClick = { menus++ },
                    tagKey = "rail_menu"
                )
            },
            tagKey = "mail"
        )
        PantrixText(
            text = when (where) {
                "starred" -> "Yıldızlı iletiler"
                "inbox" -> "Gelen kutusu: okunmamış kalmadı"
                else -> "Profil ve ayarlar"
            } + if (menus > 0) "\nMenü $menus kez açıldı" else "",
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Kısa bir rayda hedefler kayar

Yedi hedef, 220dp'lik bir rayda: bir rayın taşıdığı en çok hedef, hepsini gösteremeyecek kadar kısa bir yerde. Hedefler kendi içinde kayar; başlıktaki düğme kaymaz, yerinde kalır. Rayı yukarı kaydır: "Hakkında"ya kadar iner.

"Klasörler"deki rozet bir noktadır, "Profil"deki 128 "99+" olur, "Takvim" basılamaz.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(220.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN,
            selected = where,
            onSelect = { where = it },
            header = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Menu,
                    contentDescription = "Menüyü aç",
                    onClick = {},
                    tagKey = "short_menu"
                )
            },
            tagKey = "short"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Klasörler",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "Yeni dosyalar var")
    ),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Takvim", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profil",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 bildirim", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Gelen", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "Hakkında", icon = PantrixIcons.Info)
)
```

### Yalnızca renk ile

`NavigationIndicator.None` ile hap çizilmez: bulunulan hedefin ikonu ve etiketi temanın `primary` rengindedir, ötekiler ikincil yazı renginde. Basış ve odak halkası yine hapın yerinde çizilir.

Çerçeve 440dp: yedi hedef hazır ölçüleriyle sığar ve ray kaymaz.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.NavigationRailStyle
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(440.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN,
            selected = where,
            onSelect = { where = it },
            style = NavigationRailStyle(indicator = NavigationIndicator.None),
            tagKey = "tint"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Klasörler",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "Yeni dosyalar var")
    ),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Takvim", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profil",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 bildirim", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Gelen", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "Hakkında", icon = PantrixIcons.Info)
)
```

### Stil: genişlik, aralıklar ve etiket yazısı

`style` rayın ölçülerini, `labelStyle` etiketlerin yazı stilini değiştirir; yalnızca verilen alanlar değişir. İlk ray hazır hâlidir: 80dp genişliğinde, hedefleri 56dp ve 4dp arayla. İkincisi 96dp genişliğinde, hedefleri 64dp ve 12dp arayla, üstten ve alttan 16dp içeride; etiketleri `caption` ile yazılı.

İkinci rayın bitiş kenarında çizgi de yok: `divider = false`.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.NavigationRailStyle
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val destinations = SEVEN.take(4)
var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(340.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = destinations,
            selected = where,
            onSelect = { where = it },
            tagKey = "usual"
        )
        PantrixNavigationRail(
            items = destinations,
            selected = where,
            onSelect = { where = it },
            labelStyle = PantrixTheme.typography.caption,
            style = NavigationRailStyle(
                width = 96.dp,
                itemMinHeight = 64.dp,
                itemSpacing = 12.dp,
                verticalPadding = 16.dp,
                divider = false
            ),
            tagKey = "wide"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Klasörler",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "Yeni dosyalar var")
    ),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Takvim", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profil",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 bildirim", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Gelen", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "Hakkında", icon = PantrixIcons.Info)
)
```

### Bir rolün dolgusunda, başlığıyla

`container` temanın bir rolünün rengi olduğunda üstünde neyin okunduğunu tema bilir: `content` verilmedi, hedefler rolün eşlenik rengiyle yazıldı. Basılamayan hedef o rengin bir payıyla yazılır, kenardaki çizgi de ondan çıkar.

Başlıktaki ikon ve yazı da renk söylemiyor: temanın kendi dolgusunda kendi varsayılan renklerinde olurlardı, burada rayın üstüne yazılan renktedirler.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(340.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN.take(4),
            selected = where,
            onSelect = { where = it },
            colors = NavigationColors(container = PantrixTheme.colors.primary.color),
            header = {
                PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
                PantrixText(text = "Acme", style = PantrixTheme.typography.footnote)
            },
            tagKey = "role"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Klasörler",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "Yeni dosyalar var")
    ),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Takvim", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profil",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 bildirim", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Gelen", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "Hakkında", icon = PantrixIcons.Info)
)
```

### Kendi renkleriyle

Temada olmayan bir renkte ray: uygulamanın kendi moru. Dolgu (`container`) ve üstünde okunan renk (`content`) birlikte verilir; öteki hedefler, basılamayan hedef ve kenardaki çizgi o renkten çıkar. Hap ve üstündeki ikon da ayrıca verildi (`selectedContainer`, `selectedContent`).

Aynı `NavigationColors` bir `PantrixNavigationBar`'a da verilebilir: bar ile ray tek bir renk kümesiyle boyanır.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(440.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN,
            selected = where,
            onSelect = { where = it },
            colors = NavigationColors(
                container = own.color,
                content = own.onColor,
                selectedContainer = own.container,
                selectedContent = own.onContainer
            ),
            tagKey = "own"
        )
    }
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Klasörler",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "Yeni dosyalar var")
    ),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Takvim", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profil",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 bildirim", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Gelen", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "Hakkında", icon = PantrixIcons.Info)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Sistem çubuklarının arkasında

`insets` rayın üstte, altta ve başlangıç kenarında boş bıraktığı paydır: dolgu payın arkasına uzanır, başlık ve hedefler payın dışında kalır. Gerçek bir ekranda payı `PantrixScaffold` yan bar'ına verir ve ray sistem çubuklarının arkasına uzanır.

Burada scaffold yok: üstteki 24dp'lik şerit sistemin durum çubuğunun yerini tutuyor. Rayın dolgusu şeridin arkasında sürer, menü düğmesi şeridin altında başlar.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth().height(340.dp), border = PantrixTheme.colors.divider) {
    Row {
        PantrixNavigationRail(
            items = SEVEN.take(4),
            selected = where,
            onSelect = { where = it },
            header = {
                PantrixIconButton(imageVector = PantrixIcons.Menu, contentDescription = "Menüyü aç", onClick = {}, tagKey = "menu")
            },
            insets = PaddingValues(top = 24.dp),
            tagKey = "insets"
        )
    }
    // Sistemin durum çubuğunun yerinde bir şerit: rayın dolgusu arkasında sürer.
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(24.dp)
            .background(PantrixTheme.colors.textSecondary.copy(alpha = 0.16f))
    )
}

private val SEVEN = listOf(
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(
        key = "folders",
        label = "Klasörler",
        icon = PantrixIcons.Folder,
        badge = NavigationBadge(contentDescription = "Yeni dosyalar var")
    ),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "calendar", label = "Takvim", icon = PantrixIcons.Calendar, enabled = false),
    NavigationItem(
        key = "profile",
        label = "Profil",
        icon = PantrixIcons.Person,
        badge = NavigationBadge(contentDescription = "128 bildirim", count = 128)
    ),
    NavigationItem(key = "inbox", label = "Gelen", icon = PantrixIcons.Inbox),
    NavigationItem(key = "info", label = "Hakkında", icon = PantrixIcons.Info)
)
```

## API

### PantrixNavigationRail

`import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixNavigationRail(
    items: List<NavigationItem>,
    selected: String?,
    onSelect: (key: String) -> Unit,
    modifier: Modifier = Modifier,
    labelStyle: TextStyle = PantrixTheme.typography.footnote,
    style: NavigationRailStyle? = null,
    colors: NavigationColors? = null,
    header: (@Composable ColumnScope.() -> Unit)? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null
)
```

Uygulamanın üst düzey hedefleri, geniş bir pencerenin başlangıç kenarında alt alta, uygulamanın bulunduğu hedef işaretli olarak: tablette, açık bir katlanır telefonda ya da bir masaüstü penceresinde navigation bar'ın yerini tutar.

Bir bar'ın hedeflerini alır ve uygulamanın nerede olduğunu bar gibi öğrenir: bulunulan hedefin anahtarı `selected` ile verilir, bir basış `onSelect` ile bildirilir, bulunulan hedefe basılması da. Dar pencerede bar, geniş pencerede ray gösteren bir ekran ikisine de aynı listeyi ve aynı renk kümesini verir.

Hedefler üstten başlayarak alt alta durur, isteğe bağlı bir `header`'ın altında: menüyü açan bir düğme ya da ekranın ana işi. Raydan uzun olduklarında kayarlar, başlık yerinde kalır. Ekran okuyucu için bir hedef sekmedir: okuyucu etiketini, sonra rozetinin söylediğini ve seçili olup olmadığını söyler.

Ray kendisine verilen yerin boyu kadardır ve o yerin bir sonu olmalıdır: bir scaffold'un yan bar'ının vardır. Orada raya scaffold'un `insets`'i verilir: dolgusu sistem çubuklarının arkasına uzanır, içindekiler çubukların dışında kalır.

Parametreler:

- `items: List<NavigationItem>`: Hedefler, sırasıyla: bir ray üç ile yedi hedef için yapılmıştır, ama onları hiçbir şey saymaz.
- `selected: String?`: Uygulamanın bulunduğu hedefin anahtarı; uygulama hiçbirinde değilse null.
- `onSelect: (key: String) -> Unit`: Basılan hedefin anahtarıyla çağrılır, bulunulan hedefe basılınca da.
- `modifier: Modifier`: Raya uygulanır.
- `labelStyle: TextStyle`: Etiketlerin yazı stili: verilmezse temanın `footnote` stili. Renklerini ray verir.
- `style: NavigationRailStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: NavigationColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `header: (@Composable ColumnScope.() -> Unit)?`: Hedeflerin üstünde, rayın genişliğinin ortasında durur. İçindeki bir yazı ya da ikon kendi rengini söylemiyorsa temanın dolgusunda kendi varsayılan rengindedir, çağıranın dolgusunda ise rayın üstüne yazılan renkte.
- `insets: PaddingValues`: Rayın üstte, altta ve başlangıç kenarında boş bıraktığı pay. Dolgusu bu payın arkasına uzanır. Bir scaffold'un yan bar'ına verdiği paydır.
- `tagKey: String?`: Otomasyon için, dilden bağımsız bir anahtar: rayın test etiketi `NavigationRail_<tagKey>` olur, hedefleri de onun içinde adlandırılır: `NavigationRail_<tagKey>.Item_<destination's key>`.

### NavigationItem

`import com.pantrixui.components.navigation.common.NavigationItem`, `com.pantrixui:components` içinden

```kotlin
class NavigationItem(
    public val key: String,
    public val label: String,
    public val icon: ImageVector,
    public val selectedIcon: ImageVector? = null,
    public val badge: NavigationBadge? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

Uygulamanın üst düzey hedeflerinden biri: bir ikon ve altında etiketi. Navigation bar ile ray aynı hedefleri alır. Böylece bir ekran aynı listeyi dar bir pencerenin alt kenarında, geniş bir pencerenin yanında gösterebilir.

Parametreler:

- `key: String`: Bar'ın ya da rayın `selected`'ında tutulan ve `onSelect`'iyle bildirilen değer. Her dilde aynıdır. Böylece çevrilmiş bir ekran da nerede olduğunu bilir ve aynı hedef, nerede gösterilirse gösterilsin, aynı anahtarı taşır.
- `label: String`: İkonun altında görünen yazı ve hedefin ekran okuyucudaki adı.
- `icon: ImageVector`: Etiketin üstünde, hedefin durumunun renginde çizilir. Ekran okuyucu onu okumaz.
- `selectedIcon: ImageVector?`: Uygulama bu hedefteyken `icon`'un yerine çizilir: onun dolu bir biçimi. Aynı ikon için null.
- `badge: NavigationBadge?`: İkonun üstünde bir sayı ya da bir nokta; yoksa null.
- `enabled: Boolean`: Hedefe basılıp basılamadığı. Basılamayan hedef devre dışı yazı rengiyle çizilir.
- `tagKey: String?`: Hedefin otomasyon anahtarı. Her dilde aynıdır ve `key`'den başka olması istendiğinde verilir: hedef, anahtarı olan bir bar'ın ya da rayın test etiketinin içinde `Item_<tagKey>` olur, `NavigationBar_main.Item_inbox` gibi.

### NavigationBadge

`import com.pantrixui.components.navigation.common.NavigationBadge`, `com.pantrixui:components` içinden

```kotlin
class NavigationBadge(
    public val contentDescription: String?,
    public val count: Int? = null,
    public val tone: BadgeTone = BadgeTone.Danger,
    public val colors: BadgeColors? = null
)
```

Bir navigation bar'ın ya da bir rayın bir hedefindeki rozet: bir sayı, sayacak bir şey yoksa bir nokta.

Rozet hedefin ikonunun üstünde, satırların bittiği köşededir ve üstü ikonun üstüyle aynı hizadadır: bir bar'ın içinde kalır. Bir `PantrixBadge`'dir: hedef hangi durumda olursa olsun onun boyunda ve onun renklerindedir.

Ekran okuyucu `contentDescription`'ı hedefin etiketinden sonra, hedefin bir parçası olarak okur: "Gelen kutusu, 3 okunmamış". Rozet etiketin üstündedir ve ad önce gelsin diye ikisini hedef kendisi söyler. Tek başına bir sayı neyi saydığını söylemez, bu yüzden açıklaması olmayan rozet sessizdir. Bu, yalnızca etiketin bunu zaten söylediği yerde doğrudur. Bu nedenle varsayılanı yoktur: null bir karardır.

Parametreler:

- `contentDescription: String?`: Ekran okuyucunun rozet için, hedefin etiketinden sonra söylediği; hiçbir şey söylememesi için null.
- `count: Int?`: Gösterilecek sayı; nokta için null. Bir rozetinki gibi sınırlanır: `99+`.
- `tone: BadgeTone`: Rozetin dolgusunu aldığı renk rolü.
- `colors: BadgeColors?`: Rozetin, tonunun renkleri yerine kendi renkleri: verdikleri kullanılır, gerisi tonunkidir.

### NavigationIndicator

`import com.pantrixui.components.navigation.common.NavigationIndicator`, `com.pantrixui:components` içinden

```kotlin
enum class NavigationIndicator
```

Bir navigation bar'da ya da bir rayda uygulamanın bulunduğu hedefi neyin işaretlediği.

Değerleri:

- `Pill`: Hedefin ikonunun arkasında, `primary` rolünün container renginde bir hap: her platformun hazır bar'ı ve rayı böyledir.
- `None`: Şekil yok: hedefin ikonu ve etiketi markanın rengindedir, iOS'taki sekme çubuğunda olduğu gibi. Bunu isteyen stil alır; hiçbir platformun hazır bar'ı ya da rayı seçmez.

### NavigationRailStyle

`import com.pantrixui.components.navigation.navigationrail.NavigationRailStyle`, `com.pantrixui:components` içinden

```kotlin
class NavigationRailStyle(
    public val width: Dp = Dp.Unspecified,
    public val indicatorWidth: Dp = Dp.Unspecified,
    public val indicatorHeight: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val labelGap: Dp = Dp.Unspecified,
    public val itemMinHeight: Dp = Dp.Unspecified,
    public val itemSpacing: Dp = Dp.Unspecified,
    public val headerGap: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val indicator: NavigationIndicator? = null,
    public val divider: Boolean? = null
) : PantrixStyle<NavigationRailStyle>
```

`PantrixNavigationRail`'in geometrisi ve uygulamanın bulunduğu hedefi nasıl işaretlediği.

Ray her platformda aynıdır ve hedefleri bir navigation bar'ın hedefleridir: 80dp genişliğindedir ve bitiş kenarında ince bir çizgi vardır. Bulunulan hedefin ikonunun arkasında 56dp'ye 28dp'lik bir hap, 20dp'lik bir ikon ve etiketin üstünde 4dp boşluk bulunur. Hedefler üstten başlayarak alt alta durur: her biri 56dp yüksekliğinde, 4dp arayla, 8dp üstlerindeki bir başlığın altında.

Basış ve odak halkası, hap çizilen yerde de çizilmeyen yerde de hapın yerinde çizilir. Genişlik, yükseklikler ve aralıklar yoğunlukla ölçeklenir, hap ve ikon ölçeklenmez.

Parametreler:

- `width: Dp`: Rayın, boş bıraktığı payların yanındaki genişliği.
- `indicatorWidth: Dp`: Bulunulan hedefin ikonunun arkasındaki hapın ve bir basışın çizildiği yerin genişliği.
- `indicatorHeight: Dp`: O hapın yüksekliği.
- `iconSize: Dp`: Bir hedefin ikonu.
- `labelGap: Dp`: Hapın yeriyle altındaki etiketin arası.
- `itemMinHeight: Dp`: Bir hedefin en az yüksekliği. Hedef hiçbir zaman platformun dokunma hedefinden alçak olmaz ve büyüyen yazıyla birlikte uzar.
- `itemSpacing: Dp`: Bir hedefle sonrakinin arası.
- `headerGap: Dp`: Başlıkla ilk hedefin arası.
- `verticalPadding: Dp`: Başlığın ya da ilk hedefin üstündeki ve son hedefin altındaki boşluk.
- `indicator: NavigationIndicator?`: Bulunulan hedefi neyin işaretlediği.
- `divider: Boolean?`: Rayın bitiş kenarı boyunca, genişliğinin içinde ince bir çizgi olup olmadığı.

### NavigationColors

`import com.pantrixui.components.navigation.common.NavigationColors`, `com.pantrixui:components` içinden

```kotlin
data class NavigationColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val selectedTint: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

Temanın renklerini almadığı yerde bir navigation bar'ın ya da bir rayın renkleri: verilen renk kullanılır, verilmeyen temanınki kalır. İkisi aynı renkleri alır. Böylece pencerenin genişliğine göre birini ya da ötekini gösteren bir ekran ikisini de tek bir renk kümesiyle boyar.

```kotlin
// The current destination in the success role, the rest as the theme has it.
val colors = NavigationColors(selectedContainer = PantrixTheme.colors.success.container)
PantrixNavigationBar(…, colors = colors)
```

Burada verilen `container` temanın rol renklerinden biriyse hedefler için temanın onunla eşlediği renk de gelir, `content` ayrıca verilmedikçe. `selectedContainer` da üstündeki ikon için eşlenik rengini getirir, `selectedContent` verilmedikçe. Hiçbir rolde olmayan bir dolgu bunu getirmez: üstünde okunan rengi çağıran verir.

Bulunulan hedef bir hapla, stil öyle diyorsa yalnızca renkle işaretlenir ve burada ikisinin de kendi renkleri vardır: `selectedContainer` ile `selectedContent` hap ve üstündekidir, `selectedTint` ise hap olmayan yerdeki renk. Biri verilince ötekinin çizildiği yerde bir şey değişmez.

Parametreler:

- `container: Color`: Dolgu. Boş bırakılan payların arkasına da uzanır. Temanın `surface` rengi.
- `content: Color`: Dolgunun üstüne yazılanlar: uygulamanın bulunduğu hedefin, hapının altındaki etiketi ve öteki hedeflerin ikonlarıyla etiketleri. Temanın kendi dolgusunda ilki temanın `textPrimary`, ötekiler `textSecondary` rengindedir. Çağıranın dolgusunda ve bu renk verildiğinde hepsi bu renktedir. Bulunulan hedefi bir hap işaretlemiyorsa ötekiler bu rengin bir payındadır.
- `selectedContainer: Color`: Stil hap çiziyorsa, bulunulan hedefin ikonunun arkasındaki hap. `primary` rolünün `container`'ı.
- `selectedContent: Color`: Bulunulan hedefin, hapının üstündeki ikonu: `selectedContainer`'ın üstünde okunan renk. `primary` rolünün `onContainer`'ı.
- `selectedTint: Color`: Stilin hap çizmediği, hedefi yalnızca rengin işaretlediği yerde bulunulan hedefin ikonu ve etiketi: `container`'ın üstünde okunan bir renk. `content` verilmemişse temanın kendi dolgusunda `primary` rolünün `color`'ı; `content` verilmişse ya da dolgu çağıranınsa `content`: orada marka renginin okunduğunu söyleyen bir şey yoktur.
- `divider: Color`: Stil çizgi çiziyorsa, bir bar'ın üst kenarı ya da bir rayın bitiş kenarı boyunca uzanan ince çizgi. Temanın kendi zeminlerinde temanın `divider` rengi. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `content`'in bir payı: Subtle bir düğmenin kenarı gibi.

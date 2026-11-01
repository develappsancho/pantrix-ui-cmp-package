# Navigation Bar

Uygulamanın üst düzey hedefleri, ekranın alt kenarında: üç ile beş hedef, biri uygulamanın o an bulunduğu yer. Telefonun ve dar pencerenin gezinmesidir. Bu uygulamanın kendi gezinmesi de 600dp'den dar bir pencerede bir `PantrixNavigationBar`'dır.

Burada bar'lar sayfanın içinde, kenarlı bir çerçevede durur. Gerçek bir ekranda bar `PantrixScaffold`'un alt çubuğudur: scaffold'un verdiği boşlukları alır, dolgusu sistemin gezinme çubuğunun arkasına uzanır.

- `PantrixNavigationBar` (`com.pantrixui.components.navigation.navigationbar`, `com.pantrixui:components`): Uygulamanın üst düzey hedefleri ekranın altı boyunca, biri uygulamanın bulunduğu yer olarak işaretli: ikonunun arkasındaki bir hapla, ya da stil öyle diyorsa yalnızca rengiyle. Anahtar sözcükler: alt gezinme, sekme barı, alt bar, alt sekmeler, hedefler, gezinme barı.

## Özellikler

- **Durum ekranındır.** Bar'a bulunulan hedefin anahtarı verilir (`selected`), bir hedefe basılınca anahtarı geri bildirilir (`onSelect`). Bulunulan hedefe yeniden basmak da bildirilir: uygulama o hedefi genellikle başına döndürür. `selected` null ise hiçbir hedef işaretlenmez.
- **Hap ya da yalnızca renk.** Bulunulan hedef ikonunun arkasındaki bir hapla işaretlenir; `NavigationBarStyle`'ın `indicator` alanı `NavigationIndicator.None` ise yalnızca rengiyle.
- **Rozet.** `NavigationBadge` hedefin ikonuna bir sayı ya da bir nokta koyar. Rozetin üstü ikonun üstüyle aynı hizadadır: bar'ın dışına taşmaz. Sayı bir rozetinki gibi sınırlanır: "99+".
- **Seçiliyken başka ikon.** `NavigationItem.selectedIcon` uygulama o hedefteyken `icon`'un yerine çizilir.
- **Basılamayan hedef.** `enabled = false` hedefi temanın devre dışı yazı rengiyle çizer; hedef basış almaz.
- **Her platformda aynı.** 64dp yüksekliğinde, üstünde ince bir çizgi; 56×28dp'lik hap, 20dp'lik ikon ve `footnote` ile yazılan etiket. Ölçüleri `style`, etiketin yazısını `labelStyle` değiştirir.
- **Renkler.** `NavigationColors` dolguyu, üstündeki yazıyı, hapı, hapın üstündeki ikonu ve hap yokken işaretleyen rengi ayrı ayrı alır. `PantrixNavigationRail` aynı renkleri ve aynı hedef listesini alır.
- **Sistem çubuğu.** `insets` bar'ın alt kenarda ve yanlarda boş bıraktığı paydır: dolgu payın arkasına uzanır, hedefler dışında kalır.
- **Dik duran bar.** `orientation = NavigationBarOrientation.Vertical` hedefleri alt alta, bar'ın dolgusundan bir kapsülde dizer: iPhone Duo'nun dış ekranında sistemin dikey bar'ındaki sekmeler gibi. `PantrixScaffold` onu orada sütunun dibine kendisi koyar. Dik bar'da hedefler yalnızca ikonlarıyladır; `showLabels = true` adlarını da yazar. Yatay bar'da da `showLabels = false` ikonları yalnız bırakır.
- **Etiketsiz hedef.** Adı ekran okuyucuya söylenir ve işaretçi üstünde beklerken, klavyenin odağındayken ya da uzun basınca bir tooltip'te görünür: yatay bar'da hedefin üstünde, dik bar'da başında.
- **Ekran okuyucu.** Bir hedef sekme olarak okunur: adı, rozetinin söylediği ve seçili olup olmadığı. "Gelen kutusu, 3 okunmamış".
- **Otomasyon.** `tagKey` verilen bar'ın hedefleri onun içinde adlandırılır: `NavigationBar_main.Item_inbox`.

## Kullanım

### Three destinations, with a count on one

```kotlin
var where by rememberSaveable { mutableStateOf("starred") }
PantrixNavigationBar(
    items = listOf(
        NavigationItem(key = "starred", label = stringResource(Res.string.starred), icon = PantrixIcons.Star),
        NavigationItem(
            key = "inbox",
            label = stringResource(Res.string.inbox),
            icon = PantrixIcons.Inbox,
            badge = NavigationBadge(contentDescription = stringResource(Res.string.unread, unread), count = unread)
        ),
        NavigationItem(key = "profile", label = stringResource(Res.string.profile), icon = PantrixIcons.Person)
    ),
    selected = where,
    onSelect = { where = it },
    tagKey = "main"
)
```

### In a scaffold's bottom bar, behind the system's navigation bar

```kotlin
PantrixScaffold(
    bottomBar = { insets ->
        PantrixNavigationBar(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
    }
) { padding ->
    Destination(where, Modifier.padding(padding))
}
```

### The current destination in a role's colours

```kotlin
val success = PantrixTheme.colors.success
PantrixNavigationBar(
    items = destinations,
    selected = where,
    onSelect = onNavigate,
    // The pill where the platform draws one, and the colour that marks alone where it does not.
    colors = NavigationColors(selectedContainer = success.container, selectedTint = success.color)
)
```

### Upright, in the system's vertical bar

```kotlin
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Bottom ->
                PantrixNavigationBar(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
            // The column along the side of the iPhone Duo's outer screen: icons, and their labels when asked for.
            ScaffoldNavigationPlacement.VerticalBar -> PantrixNavigationBar(
                items = destinations,
                selected = where,
                onSelect = onNavigate,
                orientation = NavigationBarOrientation.Vertical
            )
            ScaffoldNavigationPlacement.Start ->
                PantrixNavigationRail(items = destinations, selected = where, onSelect = onNavigate, insets = insets)
        }
    }
) { padding ->
    Destination(where, Modifier.padding(padding))
}
```

## Örnekler

### Üç hedef

En yalın hâli: hedeflerin listesi (`items`), bulunulan hedefin anahtarı (`selected`) ve basılan hedefin anahtarını alan `onSelect`. Bar kendiliğinden bir şey seçmez; nerede olunduğunu ekran tutar. Hedefler bar'ın genişliğini paylaşır.

Bir hedefe bas, sonra aynı hedefe yeniden bas: o da bildirilir. Üstteki satır bunu sayar; gerçek bir uygulama o hedefi başına döndürür.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val destinations = listOf(
    NavigationItem(key = "files", label = "Dosyalar", icon = PantrixIcons.Folder),
    NavigationItem(key = "search", label = "Ara", icon = PantrixIcons.Search),
    NavigationItem(key = "profile", label = "Profil", icon = PantrixIcons.Person)
)
var where by rememberSaveable { mutableStateOf("files") }
var pressedAgain by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Column {
        PantrixText(
            text = "Açık hedef: ${destinations.first { it.key == where }.label}. " +
                "Aynı hedefe yeniden basıldı: $pressedAgain kez.",
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
        PantrixNavigationBar(
            items = destinations,
            selected = where,
            onSelect = { key -> if (key == where) pressedAgain++ else where = key },
            tagKey = "plain"
        )
    }
}
```

### Üç hedef, birinde sayı

Posta uygulamasının üç hedefi. "Gelen kutusu"ndaki rozet okunmamışları sayar: `NavigationBadge(contentDescription, count)`. Hedef açılınca sayı sıfırlanır ve rozet kalkar: sayacak bir şey kalmadığında `badge` null verilir. "Yıldızlı"nın `selectedIcon`'u vardır: seçiliyken yıldızın yerine o çizilir. Bir uygulama oraya ikonun dolu hâlini verir; `PantrixIcons`'ta dolu hâller olmadığı için burada başka bir ikon duruyor.

Rozetin `contentDescription`'ı zorunludur ve hedefin adından sonra okunur: "Gelen kutusu, 3 okunmamış". Tek başına bir sayı neyi saydığını söylemez; null vermek, adın bunu zaten söylediği yerde verilen bir karardır.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("starred") }
var unread by rememberSaveable { mutableIntStateOf(3) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Column {
        PantrixText(
            text = when (where) {
                "starred" -> "Yıldızlı iletiler"
                "inbox" -> "Gelen kutusu: okunmamış kalmadı"
                else -> "Profil ve ayarlar"
            },
            modifier = Modifier.padding(PantrixTheme.spacing.lg),
            color = PantrixTheme.colors.textSecondary
        )
        PantrixNavigationBar(
            items = listOf(
                NavigationItem(
                    key = "starred",
                    label = "Yıldızlı",
                    icon = PantrixIcons.Star,
                    selectedIcon = PantrixIcons.Success
                ),
                NavigationItem(
                    key = "inbox",
                    label = "Gelen kutusu",
                    icon = PantrixIcons.Inbox,
                    badge = if (unread > 0) {
                        NavigationBadge(contentDescription = "$unread okunmamış", count = unread)
                    } else {
                        null
                    }
                ),
                NavigationItem(key = "profile", label = "Profil", icon = PantrixIcons.Person)
            ),
            selected = where,
            onSelect = { key ->
                where = key
                if (key == "inbox") unread = 0
            },
            tagKey = "mail"
        )
    }
}
```

### Hap ile: beş hedef, biri basılamaz

Beş hedef: bir bar'ın taşıdığı en çok hedef. Bulunulan hedef ikonunun arkasındaki hapla işaretlenir (`NavigationIndicator.Pill`): her platformda varsayılan budur, burada açıkça yazıldı. Basış ve odak halkası da hapın yerinde çizilir, hedefin tamamında değil.

"Klasörler"deki rozet bir noktadır (`count` verilmedi); "Profil"deki 128, yazılan en büyük sayıyı aşar ve "99+" olur. "Takvim" basılamaz: `enabled = false`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(indicator = NavigationIndicator.Pill),
        tagKey = "pill"
    )
}

private val FIVE = listOf(
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
    )
)
```

### Yalnızca renk ile

Aynı bar, `NavigationIndicator.None` ile: hap çizilmez, bulunulan hedefin ikonu ve etiketi temanın `primary` rengindedir, ötekiler ikincil yazı renginde. iOS'un sekme çubuğu hedefini böyle işaretler; hiçbir platformun hazır stili bunu seçmez, isteyen stil verir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(indicator = NavigationIndicator.None),
        tagKey = "tint"
    )
}

private val FIVE = listOf(
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
    )
)
```

### Stil: başka ölçüler ve etiket yazısı

`style` bar'ın ölçülerini değiştirir, `labelStyle` etiketlerin yazı stilini. Hazır bar her platformda 64dp'dir; Android'in kendi bar'ı 80dp ve hapı daha büyüktür, iOS'un sekme çubuğu 49pt'dir ve hapı yoktur. İkisi de hazır stil değildir, ama bir stil ikisini de isteyebilir.

Üstteki bar 80dp, hapı 64×32dp, ikonu 24dp. Alttaki 49dp, hapsız, etiketleri `caption` ile yazılı ve ikonla etiketin arası daha dar (`labelGap = 2.dp`). Yalnızca verilen alanlar değişir. Bir hedef hiçbir zaman platformun dokunma hedefinden alçak olmaz.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
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
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(
            height = 80.dp,
            indicatorWidth = 64.dp,
            indicatorHeight = 32.dp,
            iconSize = 24.dp
        ),
        tagKey = "tall"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        labelStyle = PantrixTheme.typography.caption,
        style = NavigationBarStyle(height = 49.dp, labelGap = 2.dp, indicator = NavigationIndicator.None),
        tagKey = "low"
    )
}

private val FIVE = listOf(
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
    )
)
```

### Bulunulan hedef bir rolün renginde

Yalnızca bulunulan hedefin rengi değişti, gerisi temanın. `selectedContainer` hapı boyar; temanın bir rolünün rengi verildiğinde üstündeki ikonun rengi de o rolden gelir, `selectedContent` ayrıca verilmedikçe. `selectedTint` hap çizilmeyen stilde hedefi işaretleyen renktir.

İkisinin de kendi yeri vardır: biri verilince ötekinin çizildiği yerde bir şey değişmez. Aynı `colors` haplı ve hapsız iki bar'a verildi.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationIndicator
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val success = PantrixTheme.colors.success
val colors = NavigationColors(selectedContainer = success.container, selectedTint = success.color)
var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        colors = colors,
        tagKey = "role"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        style = NavigationBarStyle(indicator = NavigationIndicator.None),
        colors = colors,
        tagKey = "role_tint"
    )
}

private val FIVE = listOf(
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
    )
)
```

### Kendi renkleriyle

Temada olmayan bir renkte bar: uygulamanın kendi moru. Tema bu dolgunun üstünde neyin okunduğunu bilemez; dolguyla (`container`) birlikte üstündeki renk de (`content`) verilir. Öteki hedefler o renkle yazılır, basılamayan hedef onun bir payıyla, üstteki çizgi de ondan çıkar.

Hap ve üstündeki ikon ayrıca verildi (`selectedContainer`, `selectedContent`). Hap çizmeyen bir stilde bunlar kullanılmaz: bulunulan hedef bar'ın yazı rengindedir, ötekiler onun bir payında.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationColors
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var where by rememberSaveable { mutableStateOf("folders") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixNavigationBar(
        items = FIVE,
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

private val FIVE = listOf(
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
    )
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Sistem çubuğunun arkasında

`insets` bar'ın alt kenarda ve yanlarda boş bıraktığı paydır: dolgu payın arkasına uzanır, hedefler payın dışında kalır. Gerçek bir ekranda payı `PantrixScaffold` verir (`bottomBar = { insets -> … }`) ve sistemin gezinme çubuğu bar'ın dolgusunun üstünde durur. Uygulamanın kendi alt bar'ı payını böyle alır.

Burada scaffold yok: payın yerini 24dp tutuyor, içindeki çizgi de sistemin hareket çubuğunu. Hedefler çizginin üstünde kalır, bar'ın dolgusu altına kadar iner.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Box(contentAlignment = Alignment.BottomCenter) {
        PantrixNavigationBar(
            items = FIVE,
            selected = where,
            onSelect = { where = it },
            insets = PaddingValues(bottom = 24.dp),
            tagKey = "insets"
        )
        // Sistemin hareket çubuğunun yerinde bir çizgi: bar'ın dolgusunun üstünde, hedeflerin altında.
        Box(
            modifier = Modifier
                .padding(bottom = 10.dp)
                .size(width = 120.dp, height = 4.dp)
                .background(PantrixTheme.colors.textSecondary, PantrixTheme.shapes.full)
        )
    }
}

private val FIVE = listOf(
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
    )
)
```

### Dik duran bar

Bar dik durur: hedefler alt alta, bar'ın dolgusundan bir kapsülde ve kapsülün çevresinde ince bir çizgiyle. iPhone Duo'nun dış ekranında sistem sağ kenar boyunca böyle bar'lar için bir sütun ayırır; `PantrixScaffold` gezinmeyi o sütunun dibine koyar ve ona `ScaffoldNavigationPlacement.VerticalBar` der ("Scaffold" sayfasında bir örneği var).

Soldaki yalnızca ikonlarıyladır, UIKit'in o sütundaki sekmeleri gibi: bir hedefin üstünde bekle ya da uzun bas, adı başındaki tooltip'te görünür; ekran okuyucu da adını söyler. Sağdaki `showLabels = true` ile adlarını da yazar ve en uzun adı kadar geniştir. İkisi aynı durumu paylaşır: birinde bir hedefe basınca öteki de o hedefi işaretler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.navigation.common.NavigationBadge
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var where by rememberSaveable { mutableStateOf("search") }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xxl)) {
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        orientation = NavigationBarOrientation.Vertical,
        tagKey = "upright_icons"
    )
    PantrixNavigationBar(
        items = FIVE,
        selected = where,
        onSelect = { where = it },
        orientation = NavigationBarOrientation.Vertical,
        showLabels = true,
        tagKey = "upright_labels"
    )
}

private val FIVE = listOf(
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
    )
)
```

## API

### PantrixNavigationBar

`import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixNavigationBar(
    items: List<NavigationItem>,
    selected: String?,
    onSelect: (key: String) -> Unit,
    modifier: Modifier = Modifier,
    orientation: NavigationBarOrientation = NavigationBarOrientation.Horizontal,
    showLabels: Boolean = orientation == NavigationBarOrientation.Horizontal,
    labelStyle: TextStyle = PantrixTheme.typography.footnote,
    style: NavigationBarStyle? = null,
    colors: NavigationColors? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null
)
```

Uygulamanın üst düzey hedefleri, ekranın alt kenarında: üç ile beş hedef, uygulamanın bulunduğu hedef işaretli olarak.

Uygulamanın hangi hedefte olduğu ekranın durumudur: bar'a o hedefin anahtarı `selected` ile verilir, bar da bir basışı `onSelect` ile bildirir. Bulunulan hedefe basılması da bildirilir: bir uygulama o hedefi çoğunlukla başına döndürür.

Hedefler bar'ın genişliğini paylaşır. Bulunulan hedefi neyin işaretlediğini stilin `NavigationBarStyle.indicator`'ı söyler: ikonunun arkasında bir hap, stil öyle diyorsa yalnızca rengi. Ekran okuyucu için bir hedef sekmedir: okuyucu etiketini, sonra rozetinin söylediğini ve seçili olup olmadığını söyler.

`PantrixNavigationRail` aynı hedefleri ve aynı renkleri alır: dar pencerede bar'ı, geniş pencerede rayı gösteren bir ekran ikisine de aynı listeyi verir.

`PantrixScaffold`'un alt bar'ında bar'a scaffold'un `insets`'i verilir: dolgusu sistemin gezinme çubuğunun arkasına uzanır, hedefleri çubuğun dışında kalır.

**Dik duran.** Sistemin bir dikey bar'ı olduğu yerde, iPhone Duo'nun dış ekranının kenarındaki sütunda, bar orada `NavigationBarOrientation.Vertical` olarak durur: hedefler alt alta, bar'ın dolgusundan bir kapsülde; stil üst kenar boyunca bir ince çizgi çiziyorsa kapsülün çevresinde de. Uyarlanabilir gezinmesi olan bir `PantrixScaffold` nerede olduğunu söyler, `ScaffoldNavigationPlacement.VerticalBar`, ve onu sütunun dibine koyar.

**Etiketler.** Her hedef, `showLabels` aksini söylemedikçe ikonunun altında etiketini gösterir; dik duran bir bar ise istenmedikçe göstermez: sistemin sütunu ikonlar taşır. Etiketi olmayan bir hedefin adı ekran okuyucuya etiketidir ve bir tooltip onu işaretçi ikonun üstünde beklerken, klavyenin odağındayken ve uzun bir basıştan sonra gösterir: alt kenardaki bir bar'da hedefin üstünde, dik duran bir bar'da başında.

Parametreler:

- `items: List<NavigationItem>`: Hedefler, sırasıyla: bir bar üç ile beş hedef için yapılmıştır, ama onları hiçbir şey saymaz.
- `selected: String?`: Uygulamanın bulunduğu hedefin anahtarı; uygulama hiçbirinde değilse null.
- `onSelect: (key: String) -> Unit`: Basılan hedefin anahtarıyla çağrılır, bulunulan hedefe basılınca da.
- `modifier: Modifier`: Bar'a uygulanır.
- `orientation: NavigationBarOrientation`: bar'ın hangi yöne uzandığı: alt kenar boyunca, ya da sistemin dikey bar'ında dik.
- `showLabels: Boolean`: her hedefin ikonunun altında etiketini gösterip göstermediği: alt kenarda aksi söylenmedikçe gösterir, dik duran bar'da istenmedikçe göstermez.
- `labelStyle: TextStyle`: Etiketlerin yazı stili: verilmezse temanın `footnote` stili. Renklerini bar verir.
- `style: NavigationBarStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: NavigationColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `insets: PaddingValues`: bar'ın alt kenarda ve yanlarında boş tuttuğu yer, dolgusu arkasında: bir scaffold'un alt bar'ına verdiği. Dik duran bir bar onu kapsülünün çevresinde boş tutar, arkasında bir şey olmadan.
- `tagKey: String?`: Otomasyon için, dilden bağımsız bir anahtar: bar'ın test etiketi `NavigationBar_<tagKey>` olur, hedefleri de onun içinde adlandırılır: `NavigationBar_<tagKey>.Item_<destination's key>`.

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

### NavigationBarStyle

`import com.pantrixui.components.navigation.navigationbar.NavigationBarStyle`, `com.pantrixui:components` içinden

```kotlin
class NavigationBarStyle(
    public val height: Dp = Dp.Unspecified,
    public val indicatorWidth: Dp = Dp.Unspecified,
    public val indicatorHeight: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val labelGap: Dp = Dp.Unspecified,
    public val indicator: NavigationIndicator? = null,
    public val divider: Boolean? = null,
    public val uprightIndicatorWidth: Dp = Dp.Unspecified
) : PantrixStyle<NavigationBarStyle>
```

`PantrixNavigationBar`'ın geometrisi ve uygulamanın bulunduğu hedefi nasıl işaretlediği.

Bar her platformda aynıdır: 64dp yüksekliğindedir ve üst kenarında ince bir çizgi vardır. Bulunulan hedefin ikonunun arkasında 56dp'ye 28dp'lik bir hap, 20dp'lik bir ikon ve etiketin üstünde 4dp boşluk bulunur. Bir hap, bir aralık ve bir satır etiket, üstlerinde ve altlarında 8dp bırakır. Android'in kendi bar'ı 80dp'dir ve hapı daha büyüktür, iOS'ta sekme çubuğu 49pt'dir ve hapı yoktur. İkisi de buradaki hazır stil değildir, ama uygulamanın bir stili ikisini de isteyebilir.

Basış ve odak halkası, hap çizilen yerde de çizilmeyen yerde de hapın yerinde çizilir. Yükseklik ve aralık yoğunlukla ölçeklenir, hap ve ikon ölçeklenmez.

Sistemin dikey bar'ında dik dururken bir hedef bir dokunuş kadar yüksektir ve hapı 40dp genişliğindedir; böylece ikonların kapsülü 48dp genişliğinde olur, UIKit'in o sütundaki sekme bar'ı gibi. Daha öteye uzanan bir rozet kapsülü uzandığı kadar genişletir: içinde kalır.

Parametreler:

- `height: Dp`: Bar'ın, boş bıraktığı payların üstündeki yüksekliği. Bir hedef hiçbir zaman platformun dokunma hedefinden alçak olmaz ve büyüyen yazıyla birlikte uzar.
- `indicatorWidth: Dp`: Bulunulan hedefin ikonunun arkasındaki hapın ve bir basışın çizildiği yerin genişliği.
- `indicatorHeight: Dp`: O hapın yüksekliği.
- `iconSize: Dp`: Bir hedefin ikonu.
- `labelGap: Dp`: Hapın yeriyle altındaki etiketin arası.
- `indicator: NavigationIndicator?`: Bulunulan hedefi neyin işaretlediği.
- `divider: Boolean?`: Bar'ın üst kenarı boyunca, yüksekliğinin içinde ince bir çizgi olup olmadığı; dik dururken kapsülünün çevresinde.
- `uprightIndicatorWidth: Dp`: Dik duran bir bar'da hapın genişliği ve orada bir basışın çizildiği yer. Orada bir hedef hapı ve etiketi kadar geniştir.

### NavigationBarOrientation

`import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation`, `com.pantrixui:components` içinden

```kotlin
enum class NavigationBarOrientation
```

Bir `PantrixNavigationBar`'ın hangi yöne uzandığı.

Değerleri:

- `Horizontal`: Ekranın alt kenarı boyunca: hedefler yan yana, bar'ın genişliğini paylaşarak.
- `Vertical`: Sistemin dikey bar'ında dik: hedefler alt alta, onlar kadar geniş bir kapsülde; iPhone Duo'nun dış ekranının sekmelerini tuttuğu gibi. `PantrixScaffold` onu oradaki sütunun dibine koyar.

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

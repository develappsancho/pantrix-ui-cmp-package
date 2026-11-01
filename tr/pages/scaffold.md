# Scaffold

Bir ekranın düzeni: içeriğin çevresinde bir üst bar, bir alt bar ve bir yan bar, içeriğin üstünde uygulamanın snackbar'ları. Bar'ları ve pencerenin paylarını ölçer, içeriğe onlardan kaçınması için gereken boşluğu verir.

Sınırlı bir alanı doldurur, çoğunlukla pencereyi: kaydırılan bir kapsayıcının ona verecek yüksekliği yoktur. Bu sayfadaki örnekler bu yüzden yüksekliği verilmiş bir kutudadır ve "Pencerenin payları" dışında hepsinde `windowInsets` sıfırdır: kutu pencere değildir, sistem çubuklarının payı uygulamanın kendi scaffold'undadır. O scaffold da gerçek bir kullanımdır: uygulamanın kabuğu (`App.kt`, `shell/DemoNavigation.kt`) gezinmesini dar pencerede alt bar'a, geniş pencerede yan menüye koyar.

- `PantrixScaffold` (`com.pantrixui.components.container.scaffold`, `com.pantrixui:components`): Bir ekranın düzeni: içeriğin çevresinde barlar, genişlikle değişebilen gezinme ve içeriğin üstünde uygulamanın snackbar'ları. Anahtar sözcükler: ekran düzeni, sayfa düzeni, uygulama kabuğu, iskele, uygulama yapısı.

## Özellikler

- **Üç bar.** `topBar`, `bottomBar` ve `sideBar`. Yan bar scaffold'un tam yüksekliğinde, başlangıç kenarında durur, sağdan sola düzende sağda; üst ve alt bar kalan genişliğe yayılır.
- **İçeriğin payı.** İçerik bar'ların altına kadar uzanır. `content`'e verilen `padding` her kenarda bar'ın boyu ya da bar'ı olmayan kenarın pencere payıdır, hangisi büyükse. Bir listeye `contentPadding` olarak verilir: liste bar'ların altından kayar.
- **Pencere payları.** Her yuvaya, dokunduğu pencere kenarlarının payı `insets` olarak verilir: bar dolgusunu sistem çubuğunun arkasına uzatır, içeriğini güvenli alanda tutar. Üstteki bir kapsayıcının tükettiği pay yeniden verilmez.
- **Klavye.** `windowInsets` sistem çubukları ve ekran çentiğidir, klavye içinde değildir: metin alanı olan ekran içeriğine `Modifier.consumeWindowInsets(padding).imePadding()` ekler.
- **Odak.** Bar'ın altından kayan içerikte odağı alan öğe kaydırma alanının kenarına getirilir, ve o kenar bar'ın arkasıdır. İçerik, sonlarında bıraktığı boşluğu `Modifier.scrollPadding` ile söyler: odak bar'ların arasında kalır.
- **Uyarlanabilir gezinme.** `navigation` alan ikinci `PantrixScaffold`, gezinmeyi kendi genişliğine göre taşır: 600dp'den darken alt kenarda, o genişlikten itibaren başlangıç kenarında. Eşik `ScaffoldStyle` ile değişir.
- **Masadaki katlanır cihaz.** Yarı açık ve katı yatay duran bir cihazda gezinme, genişlik ne olursa olsun altta kalır.
- **Sistemin dikey bar'ı.** iPhone Duo'nun dış ekranında sistem, sağ kenar boyunca dik duran bar'lar için bir sütun ayırır; tepesinde durum çubuğu durur. O sütuna uzanan scaffold gezinmeyi sütunun dibine koyar (`ScaffoldNavigationPlacement.VerticalBar`): orada dik duran bir `PantrixNavigationBar` çizilir. İçindeki bir `PantrixTopBar` da geri düğmesini ve eylemlerini sütunun tepesine, durum çubuğunun altına verir; başlığı yerinde kalır. Bunu yalnızca dik duran ve menteşesi olmayan bir pencerede yapar: iç ekranda ve yatayda sütunda durum çubuğu yalnız kalır, gezinme ve düğmeler her zamanki yerindedir. İç içe iki scaffold'dan sütunu dıştaki tutar.
- **Snackbar'lar.** `snackbars` verilen scaffold onları içeriğin üstünde, bar'ların arasında gösterir ve içindeki her şeye `LocalPantrixSnackbars` ile verir.
- **Renk.** `containerColor` her şeyin arkasına, sistem çubuklarının da arkasına çizilir. Temanın zeminlerinde scaffold içerik rengi vermez; bir rolün dolgusunda o dolguyla eşleşen rengi verir.
- **Sıra.** Klavye ve ekran okuyucu yan bar'dan üst bar'a, dikey bar'daki düğmelere, içeriğe, alt bar'a ve snackbar'lara doğru gezer. Bar'lar ve snackbar'lar içeriğin üstüne çizilir.

## Kullanım

### Bars drawn behind the system bars

```kotlin
PantrixScaffold(
    topBar = { insets ->
        InboxTopBar(Modifier.background(PantrixTheme.colors.surface).padding(insets))
    },
    bottomBar = { insets ->
        InboxTabs(Modifier.background(PantrixTheme.colors.surface).padding(insets))
    }
) { padding ->
    LazyColumn(contentPadding = padding) {
        items(conversations, key = { it.id }) { ConversationRow(it, Modifier.scrollPadding(padding)) }
    }
}
```

### Bars that apply the insets themselves

```kotlin
PantrixScaffold(
    topBar = { MailToolbar(Modifier.windowInsetsPadding(WindowInsets.safeDrawing)) },
    sideBar = { MailFolders(Modifier.windowInsetsPadding(WindowInsets.safeDrawing)) }
) { padding ->
    Mailbox(Modifier.padding(padding))
}
```

### Navigation that moves with the width

```kotlin
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Bottom -> AppTabs(destination, onNavigate, Modifier.padding(insets))
            ScaffoldNavigationPlacement.VerticalBar -> AppTabs(destination, onNavigate, upright = true)
            ScaffoldNavigationPlacement.Start -> AppSidebar(destination, onNavigate, Modifier.padding(insets))
        }
    },
    topBar = { insets -> AppTopBar(destination, Modifier.padding(insets)) }
) { padding ->
    DestinationScreen(destination, Modifier.padding(padding))
}
```

### Snackbars from any screen

```kotlin
val snackbars = rememberPantrixSnackbarState()
PantrixScaffold(snackbars = snackbars) { padding ->
    Inbox(Modifier.padding(padding))
}

// Anywhere inside Inbox:
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.archive),
    onClick = {
        archive(conversation)
        scope.launch {
            snackbars?.show(message = getString(Res.string.conversation_archived), tagKey = "archived")
        }
    },
    tagKey = "archive"
)
```

## Örnekler

### Üst bar ve içeriğin payı

Bir üst bar ve altında kayan bir liste. `topBar` bir `insets` alır ve bar'a verir. İçerik scaffold'un tamamını doldurur, bar'ın altını da: `content`'e gelen `padding` listeye `contentPadding` olarak verildi, böylece ilk satır bar'ın altında başlar ve liste kaydıkça bar'ın altından geçer. Liste başından ayrılınca bar alt kenarına bir çizgi çeker (`scrolled`).

Scaffold sayfanın içinde olduğu için yüksekliği verildi ve `windowInsets` sıfırlandı; bir ekranda ikisi de yazılmaz.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val list = rememberLazyListState()
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets ->
        PantrixTopBar(
            title = "Gelen Kutusu",
            scrolled = list.canScrollBackward,
            insets = insets,
            tagKey = "scaffold_inbox"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    LazyColumn(modifier = Modifier.fillMaxSize(), state = list, contentPadding = padding) {
        items(20) { index ->
            PantrixText(text = "Konuşma ${index + 1}", modifier = Modifier.padding(PantrixTheme.spacing.lg))
        }
    }
}
```

### Alt bar

`bottomBar` içeriğin altında, kalan genişliğe yayılır: burada üç hedefli bir `PantrixNavigationBar`. Hangi hedefte olunduğu ekranın durumudur; bar yalnızca basılanı bildirir.

İçerik iki bar'dan da `padding` ile kaçınır: üst pay üst bar'ın, alt pay alt bar'ın yüksekliğidir. Ortadaki satır scaffold'un verdiği değerleri yazar.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Posta", insets = insets) },
    bottomBar = { insets ->
        PantrixNavigationBar(
            items = DESTINATIONS,
            selected = destination,
            onSelect = { destination = it },
            insets = insets,
            tagKey = "scaffold_bottom"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    Column(
        modifier = Modifier.fillMaxSize().padding(padding),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Bar'ın boyu bir ekranda tam bir dp sayısı olmayabilir: en yakın tam sayısı yazılır.
        val top = padding.calculateTopPadding().value.roundToInt()
        val bottom = padding.calculateBottomPadding().value.roundToInt()
        PantrixText(text = "Açık hedef: ${DESTINATIONS.first { it.key == destination }.label}")
        PantrixText(text = "Üst pay ${top}dp, alt pay ${bottom}dp", color = PantrixTheme.colors.textSecondary)
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Bar'ın altından kayan listede odak

İçerik bar'ların altından kayarken klavyeyle odaklanan öğe bar'ın arkasında kalmaz. Compose odağı alan öğeyi listenin kenarına getirir, ve liste bar'ların altına uzandığı için o kenar bar'ın arkasıdır. Burada her öğe, listenin sonlarında ne kadar boşluk bıraktığını söyler (`Modifier.scrollPadding`): odağı alan öğe o boşluğun içine, iki bar'ın arasına getirilir.

Boşluk scaffold'un verdiği pay ile bir odak halkasının yeridir (`PantrixTheme.platform.focusRingReach`). Bir sütunda halka yerini kendisi ister; lazy bir listede isteyemez, liste o yeri `contentPadding`'ine katar ve aynı değeri öğelerine söyler.

Bir klavyeyle Tab'a basarak aşağı, Shift ile Tab'a basarak yukarı gez: her düğme halkasıyla birlikte iki bar'ın arasında görünür.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.a11y.scrollPadding
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var destination by rememberSaveable { mutableStateOf("inbox") }
val ring = PantrixTheme.platform.focusRingReach
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Etiketler", insets = insets) },
    bottomBar = { insets ->
        PantrixNavigationBar(
            items = DESTINATIONS,
            selected = destination,
            onSelect = { destination = it },
            insets = insets,
            tagKey = "scaffold_focus"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    // Bar'ların payı ve, üstünde ve altında, bir halkanın yeri: listenin boşluğu, öğelerinin söylediği.
    val room = padding + PaddingValues(vertical = ring)
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = room,
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        items(12) { index ->
            PantrixButton(
                text = "Etiket ${index + 1}",
                onClick = {},
                modifier = Modifier.scrollPadding(room),
                variant = ButtonVariant.Outline,
                tagKey = "scaffold_label_${index + 1}"
            )
        }
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Yan bar

`sideBar` scaffold'un tam yüksekliğinde, başlangıç kenarında durur: burada bir `PantrixNavigationRail`. Üst bar onun yanında kalan genişliğe yayılır, üstüne uzanmaz. Sağdan sola düzende yan bar sağdadır.

Klavye ve ekran okuyucu önce yan bar'a, sonra üst bar'a, sonra içeriğe gelir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Posta", insets = insets) },
    sideBar = { insets ->
        PantrixNavigationRail(
            items = DESTINATIONS,
            selected = destination,
            onSelect = { destination = it },
            insets = insets,
            tagKey = "scaffold_side"
        )
    },
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "Açık hedef: ${DESTINATIONS.first { it.key == destination }.label}")
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Genişlikle yer değiştiren gezinme

`navigation` alan `PantrixScaffold` gezinmenin yerini kendisi seçer ve gezinmeye söyler (`placement`): 600dp'den darken alt kenarda, o genişlikten itibaren başlangıç kenarında. Gezinme aynı hedefleri altta bir navigation bar, başlangıç kenarında bir ray olarak çizer.

Genişlik pencerenin değil scaffold'un kendi genişliğidir: bir kutudaki scaffold kutunun genişliğine bakar. Kutu 600dp'den darsa gezinme altta, değilse başlangıç kenarındadır. "Dar"ı seç: kutu 360dp olur ve gezinme alta iner. Dar bir pencerede kutu iki seçimde de 600dp'ye ulaşmaz ve gezinme altta kalır.

Gezinme yer değiştirirken içerik aynı kompozisyonda kalır: sayaca bas, sonra genişliği değiştir; sayı yerindedir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var wide by rememberSaveable { mutableStateOf(true) }
var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixSegmentButton(
    options = listOf(
        SegmentOption(value = false, label = "Dar", tagKey = "narrow"),
        SegmentOption(value = true, label = "Geniş", tagKey = "wide")
    ),
    selected = wide,
    onSelect = { wide = it },
    fullWidth = false,
    tagKey = "scaffold_width"
)
val width = if (wide) Modifier.fillMaxWidth() else Modifier.width(360.dp)
PantrixScaffold(
    navigation = { placement, insets ->
        ScaffoldDestinations(placement, insets, selected = destination, tagKey = "scaffold_adaptive") {
            destination = it
        }
    },
    modifier = width.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Posta", insets = insets) },
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        var count by remember { mutableIntStateOf(0) }
        PantrixButton(
            text = "Sayaç: $count",
            onClick = { count += 1 },
            variant = ButtonVariant.Soft,
            tagKey = "scaffold_count"
        )
    }
}

@Composable
private fun ScaffoldDestinations(
    placement: ScaffoldNavigationPlacement,
    insets: PaddingValues,
    selected: String,
    tagKey: String,
    onSelect: (String) -> Unit
) {
    when (placement) {
        ScaffoldNavigationPlacement.Bottom -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.Start -> {
            PantrixNavigationRail(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.VerticalBar -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                orientation = NavigationBarOrientation.Vertical,
                tagKey = tagKey
            )
        }
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Gezinmenin taşındığı genişlik

Gezinmenin başlangıç kenarına geçtiği genişlik scaffold'un stilindedir: `ScaffoldStyle.sideNavigationMinWidth`, her platformda 600dp. Bu scaffold'a `style` ile 280dp verildi: kutu 280dp ya da daha genişse gezinme başlangıç kenarındadır, 600dp'den dar bir pencerede de.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement
import com.pantrixui.components.container.scaffold.ScaffoldStyle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    navigation = { placement, insets ->
        ScaffoldDestinations(placement, insets, selected = destination, tagKey = "scaffold_threshold") {
            destination = it
        }
    },
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    windowInsets = WindowInsets(0),
    style = ScaffoldStyle(sideNavigationMinWidth = 280.dp)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "Açık hedef: ${DESTINATIONS.first { it.key == destination }.label}")
    }
}

@Composable
private fun ScaffoldDestinations(
    placement: ScaffoldNavigationPlacement,
    insets: PaddingValues,
    selected: String,
    tagKey: String,
    onSelect: (String) -> Unit
) {
    when (placement) {
        ScaffoldNavigationPlacement.Bottom -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.Start -> {
            PantrixNavigationRail(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                insets = insets,
                tagKey = tagKey
            )
        }

        ScaffoldNavigationPlacement.VerticalBar -> {
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = selected,
                onSelect = onSelect,
                orientation = NavigationBarOrientation.Vertical,
                tagKey = tagKey
            )
        }
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Sistemin dikey bar'ında

iPhone Duo'nun dış ekranında, iOS 27.1'den itibaren, sistem sağ kenar boyunca dik duran bar'lar için bir sütun ayırır: tepesinde durum çubuğu, altında uygulamanın bar'ları. "Kapak"ı seç: soluk şerit durum çubuğunun yeridir. Scaffold o sütuna uzandığı için gezinmeyi sütunun dibine koyar ve ona `ScaffoldNavigationPlacement.VerticalBar` der; burada dik duran bir `PantrixNavigationBar` çizilir. İçerikteki `PantrixTopBar` geri düğmesini ve iki eylemini sütunun tepesine, durum çubuğunun altına verir, başlığı yerinde kalır. Uygulamanın kendi kabuğu da Duo'nun dış ekranında böyle durur.

Dik bar'da hedefler yalnızca ikonlarıyladır, UIKit'in o sütundaki sekmeleri gibi: bir ikonun üstünde bekle ya da uzun bas, adı bir tooltip'te görünür. "Etiketler"i aç: adları ikonların altında da yazar (`showLabels`). Öteki pencerelerde sütun yoktur: gezinme genişliğe göre altta ya da başlangıç kenarındadır, düğmeler üst bar'dadır. Duo'nun iç ekranında ve yatayda sistem sütunu yine ayırır, ama scaffold onu durum çubuğuna bırakır ve bu hâl kalır.

Scaffold'un yüksekliği dış ekranınki kadardır, 678dp; sütundaki yer pencereye göre ölçülür ve scaffold pencerenin tepesinden başlar.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.NavigationBarOrientation
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.navigation.navigationrail.PantrixNavigationRail
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var labels by rememberSaveable { mutableStateOf(false) }
var destination by rememberSaveable { mutableStateOf("inbox") }
PantrixScaffold(
    navigation = { placement, insets ->
        when (placement) {
            ScaffoldNavigationPlacement.Bottom -> PantrixNavigationBar(
                items = DESTINATIONS,
                selected = destination,
                onSelect = { destination = it },
                insets = insets,
                tagKey = "scaffold_upright"
            )

            ScaffoldNavigationPlacement.VerticalBar -> PantrixNavigationBar(
                items = DESTINATIONS,
                selected = destination,
                onSelect = { destination = it },
                orientation = NavigationBarOrientation.Vertical,
                showLabels = labels,
                tagKey = "scaffold_upright"
            )

            ScaffoldNavigationPlacement.Start -> PantrixNavigationRail(
                items = DESTINATIONS,
                selected = destination,
                onSelect = { destination = it },
                insets = insets,
                tagKey = "scaffold_upright"
            )
        }
    },
    modifier = Modifier.fillMaxWidth().height(678.dp),
    windowInsets = WindowInsets(0)
) { padding ->
    Column(modifier = Modifier.fillMaxSize()) {
        // Bar scaffold'un tüm genişliğindedir, UIKit'in üst bar'ı gibi; içerik sütundan payıyla kaçınır.
        PantrixTopBar(
            title = DESTINATIONS.first { it.key == destination }.label,
            navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "scaffold_upright_back") },
            actions = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Search,
                    contentDescription = "Ara",
                    onClick = {},
                    tagKey = "scaffold_upright_search"
                )
                PantrixIconButton(
                    imageVector = PantrixIcons.MoreHorizontal,
                    contentDescription = "Daha fazla",
                    onClick = {},
                    tagKey = "scaffold_upright_more"
                )
            },
            tagKey = "scaffold_upright"
        )
        PantrixSwitchButton(
            checked = labels,
            onCheckedChange = { labels = it },
            modifier = Modifier.padding(padding).padding(PantrixTheme.spacing.lg),
            label = "Etiketler",
            tagKey = "scaffold_upright_labels"
        )
    }
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Snackbar'lar

`snackbars` verilen scaffold onları içeriğin üstünde ve içeriğe verdiği payın içinde gösterir: bar'ların arasında. Aynı durumu içindeki her şeye `LocalPantrixSnackbars` ile verir; bir ekran snackbar göstermek için durumu parametreyle almaz. Buradaki düğme scaffold'un içinde ayrı bir composable'dır ve durumu oradan okur.

"Arşivle"ye bas: snackbar uygulamanın penceresinde değil, bu kutudaki scaffold'un içinde belirir. Yeri platforma göredir: Android'de altta ortada, iOS'ta üstte, masaüstünde ve web'de alt bitiş köşesinde. `snackbars` verilmeyen scaffold çevresindeki düzenin `LocalPantrixSnackbars`'ını korur: öteki örneklerdeki kutular uygulamanınkini görür.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = rememberPantrixSnackbarState()
PantrixScaffold(
    modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider),
    topBar = { insets -> PantrixTopBar(title = "Gelen Kutusu", insets = insets) },
    bottomBar = { insets ->
        PantrixNavigationBar(
            items = DESTINATIONS,
            selected = "inbox",
            onSelect = {},
            insets = insets,
            tagKey = "scaffold_snackbars"
        )
    },
    snackbars = snackbars,
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        ScaffoldArchiveButton()
    }
}

@Composable
private fun ScaffoldArchiveButton() {
    val snackbars = LocalPantrixSnackbars.current
    val scope = rememberCoroutineScope()
    PantrixButton(
        text = "Arşivle",
        onClick = { scope.launch { snackbars?.show(message = "Konuşma arşivlendi", tagKey = "scaffold_archived") } },
        tagKey = "scaffold_archive"
    )
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Pencerenin payları

Bir pencerede `windowInsets` yazılmaz: scaffold sistem çubuklarının ve ekran çentiğinin payını kendisi okur. Bu kutunun sistem çubuğu olmadığı için iki pay elle verildi: üstte 28dp, altta 20dp; yerlerinde birer yazı duruyor.

Her bar, dokunduğu kenarın payını `insets` olarak alır. Üst bar ve alt bar onu kendi içine boşluk olarak koyar: dolguları payın arkasına uzanır, başlık ve hedefler payın dışında kalır. İçeriğin payı da buna göre büyür: ortadaki satırdaki değerler bar'ın yüksekliği ile pencere payının toplamıdır.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.navigation.common.NavigationItem
import com.pantrixui.components.navigation.navigationbar.PantrixNavigationBar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val caption = PantrixTheme.typography.caption
val quiet = PantrixTheme.colors.textSecondary
Box(modifier = Modifier.height(320.dp).border(1.dp, PantrixTheme.colors.divider)) {
    PantrixScaffold(
        topBar = { insets -> PantrixTopBar(title = "Ayarlar", insets = insets) },
        bottomBar = { insets ->
            PantrixNavigationBar(
                items = DESTINATIONS,
                selected = "inbox",
                onSelect = {},
                insets = insets,
                tagKey = "scaffold_insets"
            )
        },
        windowInsets = WindowInsets(top = 28.dp, bottom = 20.dp)
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
            val top = padding.calculateTopPadding().value.roundToInt()
            val bottom = padding.calculateBottomPadding().value.roundToInt()
            PantrixText(text = "Üst pay ${top}dp, alt pay ${bottom}dp")
        }
    }
    PantrixText(
        text = "durum çubuğunun yeri",
        modifier = Modifier.align(Alignment.TopCenter).padding(top = 6.dp),
        style = caption,
        color = quiet
    )
    PantrixText(
        text = "sistem çubuğunun yeri",
        modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 2.dp),
        style = caption,
        color = quiet
    )
}

private val DESTINATIONS = listOf(
    NavigationItem(key = "inbox", label = "Mesajlar", icon = PantrixIcons.Inbox),
    NavigationItem(key = "starred", label = "Yıldızlı", icon = PantrixIcons.Star),
    NavigationItem(key = "people", label = "Kişiler", icon = PantrixIcons.Person)
)
```

### Zemin ve içerik rengi

`containerColor` scaffold'un zeminidir; varsayılanı temanın `background`'udur. Temanın zeminlerinde scaffold içerik rengi vermez: her bileşen kendi varsayılanıyla çizilir. Üstteki scaffold bir rolün dolgusuyla boyandı ve içindeki yazıya o dolguyla eşleşen rengi kendisi verdi.

Alttakinin rengi temada yok, uygulamanın kendi moru: üstünde ne okunacağını tema bilemez, `contentColor` ile verilir.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.plus
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixScaffold(
    modifier = Modifier.height(96.dp),
    containerColor = PantrixTheme.colors.primary.container,
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "Bir rolün dolgusu: içerik rengini scaffold verdi")
    }
}
PantrixScaffold(
    modifier = Modifier.height(96.dp),
    containerColor = own.color,
    contentColor = own.onColor,
    windowInsets = WindowInsets(0)
) { padding ->
    Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
        PantrixText(text = "Temada olmayan renk: contentColor verildi")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixScaffold

`import com.pantrixui.components.container.scaffold.PantrixScaffold`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixScaffold(
    modifier: Modifier = Modifier,
    topBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    bottomBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    sideBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    snackbars: PantrixSnackbarState? = null,
    snackbarHost: @Composable () -> Unit = { if (snackbars != null) PantrixSnackbarHost(snackbars) },
    containerColor: Color = PantrixTheme.colors.background,
    contentColor: Color = Color.Unspecified,
    windowInsets: WindowInsets = WindowInsets.systemBars.union(WindowInsets.displayCutout),
    content: @Composable (padding: PaddingValues) -> Unit
)
```

Bir ekranın düzeni: içeriğin çevresinde bir üst bar, bir alt bar ve bir yan bar, içeriğin üstünde uygulamanın snackbar'ları.

Yan bar başlangıç kenarında, scaffold'un tam yüksekliğinde durur, sağdan sola düzende sağ kenarda; üst bar ve alt bar kalan genişliğe yayılır. İçerik de o kalan yeri doldurur ve bar'ların altına kadar uzanır; böylece bir liste bar'ların altından kayar: `content`'e verilen pay listeye içerik payı olarak verilir. Scaffold `containerColor`'ı kenardan kenara, pencerenin sistem çubuklarının arkasına da çizer.

**Pencere payları.** Her yuvaya, dokunduğu pencere kenarlarının payları boşluk olarak verilir: yan bar'a başlangıç, üst ve alt pay; üst bar'a üst pay, alt bar'a alt pay, ikisine de bitiş payı, yan bar yoksa başlangıç payı da. Bu payları içeriğinin çevresine boşluk olarak koyan bir bar, dolgusunu sistem çubuğunun arkasına çizer ve içeriğini güvenli alanda tutar. Bir bar bunun yerine payları kendisi de uygulayabilir, `Modifier.windowInsetsPadding` ile: scaffold bir yuvanın dokunmadığı kenarların paylarını tüketir, böylece bar yalnızca kendi paylarını alır. `content`'e verilen pay her kenarda bar'ın yüksekliği ya da bar'ı olmayan kenarın pencere payıdır, hangisi büyükse. Üstteki bir kapsayıcının `consumeWindowInsets` ya da bir `windowInsetsPadding` ile zaten tükettiği paylar hesaba katılmaz. Scaffold, Material'ınki gibi, içeriği için payları tüketmez: içinde başka bir scaffold, bir snackbar yeri ya da pencere paylarıyla boşluk bırakan başka bir şey tutan içerik, kendisine verileni `Modifier.padding(padding).consumeWindowInsets(padding)` ile tüketir; yoksa o paylar içeride ikinci kez eklenir.

**Snackbar'lar.** `snackbars` verilen scaffold onları bir `PantrixSnackbarHost` içinde, içeriğin üstünde ve içeriğe verilen payın içinde gösterir: bar'ların arasında, yan bar'ın yanında ve pencere paylarının dışında. Onları içindeki her şeye `LocalPantrixSnackbars` olarak da verir; böylece bir ekran, durumu parametreyle almadan snackbar gösterir. `snackbarHost` o yere bunun yerine uygulamanın kendi sunucusunu koyar.

**Renk.** Temanın kendi zeminlerinde, yani varsayılan olan arka zemininde ve yüzeyinde, scaffold içerik rengi vermez: orada her bileşen kendi varsayılanıyla çizilir, metin `textPrimary` ile, spinner markanın rengiyle. Bir rolün dolgusunda o dolguyla eşleşen rengi verir.

**Sistemin dikey bar'ında.** Pencerenin bir kenarında dik duran bar'lar için bir sütun olduğunda, iPhone Duo'nun dış ekranında iOS 27.1'den itibaren olduğu gibi, ve scaffold ona uzandığında, scaffold'un içindeki bir `PantrixTopBar` geri düğmesini ve eylemlerini verir: sütunda, durum çubuğunun altında alt alta dururlar, UIKit'in bir gezinme bar'ının düğmelerini oraya koyduğu gibi; üst bar başlığını tutar. İçerik sütundan payıyla uzak durur. İç içe iki scaffold'dan sütunu dıştaki tutar. Scaffold sütunu yalnızca dik duran ve içinden menteşe geçmeyen bir pencerede tutar, dış ekranın tutulduğu gibi: iç ekranda ve yana çevrilen iki ekranda da sütun vardır, ve scaffold orada onu durum çubuğuna bırakır.

**Sıra.** Klavye kullanan biri yan bar'dan üst bar'a, dikey bar'daki düğmelere, içeriğe, alt bar'a ve snackbar'lara doğru gezer, ekran okuyucu da bu sırayla okur. Bar'lar ve snackbar'lar içeriğin üstüne çizilir.

**Odak.** Bir bar'ın altından kayan bir liste, odağı alan öğeyi kendi kenarına getirir, ve o kenar bar'ın arkasıdır. Listenin içeriği, sonlarında bıraktığı boşluğu `Modifier.scrollPadding` ile söyler, bir sütunun içeriğinde ya da lazy bir listenin her öğesinde, ve odağı alan öğe bar'ların arasında gösterilir (docs/guide/scroll-padding/SCROLL_PADDING_GUIDE.md).

Scaffold sınırlı bir alanı doldurur, çoğunlukla pencereyi: kaydırılan bir kapsayıcının ona verecek yüksekliği yoktur.

Parametreler:

- `modifier: Modifier`: Scaffold'un modifier'ı. Scaffold kendisine verilen alanı doldurur.
- `topBar: (@Composable (insets: PaddingValues) -> Unit)?`: İçeriğin üstündeki bar; dokunduğu kenarların pencere payları ona verilir.
- `bottomBar: (@Composable (insets: PaddingValues) -> Unit)?`: İçeriğin altındaki bar; dokunduğu kenarların pencere payları ona verilir.
- `sideBar: (@Composable (insets: PaddingValues) -> Unit)?`: Başlangıç kenarındaki bar; scaffold'un tam yüksekliğindedir ve dokunduğu kenarların pencere payları ona verilir.
- `snackbars: PantrixSnackbarState?`: Uygulamanın snackbar'ları: içeriğin üstünde gösterilir ve içerideki her şeye `LocalPantrixSnackbars` olarak verilir. Verilmezse scaffold kendi snackbar'larını göstermez ve çevresindeki düzenin `LocalPantrixSnackbars`'ını korur.
- `snackbarHost: @Composable () -> Unit`: Snackbar'ları içeriğin üstünde gösteren şey: varsayılanı `snackbars` için bir `PantrixSnackbarHost`'tur.
- `containerColor: Color`: Her şeyin arkasına, pencerenin sistem çubuklarının da arkasına çizilir.
- `contentColor: Color`: Kendi rengini vermeyen metnin ve ikonların rengi. Varsayılanı, `containerColor` bir rolün dolgusuysa onunla eşleşen renktir; temanın arka zemininde, yüzeyinde ya da temanın tanımadığı bir renkte ise hiçbiri. Böyle bir renkle birlikte, bileşenlerin kendi varsayılanları üstünde okunmuyorsa, bir içerik rengi de verilir.
- `windowInsets: WindowInsets`: Scaffold'un yuvalarına verdiği, içeriği ve snackbar'ları da dışında tuttuğu pencere payları: varsayılanı sistem çubukları ve ekran çentiğidir; üstteki bir kapsayıcının zaten tükettiği paylar hesaba katılmaz. Klavye bunların içinde değildir: metin alanı olan bir ekran içeriğine `Modifier.consumeWindowInsets(padding).imePadding()` ekler.
- `content: @Composable (padding: PaddingValues) -> Unit`: Ekran; ona bar'lardan ve pencere paylarından kaçınması için gereken pay verilir.

### PantrixScaffold

`import com.pantrixui.components.container.scaffold.PantrixScaffold`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixScaffold(
    navigation: @Composable (placement: ScaffoldNavigationPlacement, insets: PaddingValues) -> Unit,
    modifier: Modifier = Modifier,
    topBar: (@Composable (insets: PaddingValues) -> Unit)? = null,
    snackbars: PantrixSnackbarState? = null,
    snackbarHost: @Composable () -> Unit = { if (snackbars != null) PantrixSnackbarHost(snackbars) },
    containerColor: Color = PantrixTheme.colors.background,
    contentColor: Color = Color.Unspecified,
    windowInsets: WindowInsets = WindowInsets.systemBars.union(WindowInsets.displayCutout),
    style: ScaffoldStyle? = null,
    content: @Composable (padding: PaddingValues) -> Unit
)
```

Gezinmesi genişliğiyle birlikte yer değiştiren bir ekranın düzeni: scaffold, varsayılanı 600dp olan `ScaffoldStyle.sideNavigationMinWidth`'ten darken gezinme alt kenardadır, o genişlikten itibaren başlangıç kenarında.

`navigation`'a nerede olduğu söylenir; böylece aynı hedefleri altta bir navigation bar, başlangıç kenarında bir ray ya da bir sidebar olarak çizebilir. Başlangıç kenarında scaffold'un tam yüksekliğinde durur ve `topBar` kalan genişliğe yayılır; altta ise içeriğin altında, genişlik boyunca uzanır. Genişlik pencerenin değil, scaffold'un kendi genişliğidir: pencerenin bir bölümündeki scaffold kendi alanına göre karar verir. Gezinme yer değiştirirken tek bir kompozisyon olarak kalır, içerik de öyle: hatırladıkları, bir seçim ya da bir kaydırma konumu, pencere yeniden boyutlandırıldıktan sonra da yerindedir. Kaydettikleri ise, cihaz çevrilince ekranın baştan kurulduğu yerde geri gelir.

**Masada.** Masadaki bir dizüstü gibi yarı açık tutulan, katı yatay duran katlanır bir cihazda gezinme, genişlik ne olursa olsun alt kenarda kalır: eller alt yarıdadır ve başlangıç kenarındaki bir sütun katın üstünden geçerdi. Duruş pencerenindir: `PantrixTheme.window`. O pencerenin bir yarısına sığacak kadar kısa bir scaffold orada bir bölme sayılır ve genişliğine göre davranır.

**Sistemin dikey bar'ında.** Pencerenin bir kenarında dik duran bar'lar için bir sütun olduğunda, iPhone Duo'nun dış ekranında iOS 27.1'den itibaren olduğu gibi, pencere dik durup içinden menteşe geçmediğinde ve scaffold sütuna uzandığında, gezinme genişlik ne olursa olsun o sütunun dibinde durur: `navigation`'a `ScaffoldNavigationPlacement.VerticalBar` söylenir ve orada dik duran bir navigation bar çizer, UIKit'in bir sekme bar'ını koyduğu gibi. Ona pay verilmez: sütunun bar'lara ayrılan yeri durum çubuğundan ve ana ekran çizgisinden uzaktır. Bir üst bar'ın düğmeleri, ayrı bar'lı `PantrixScaffold`'daki gibi sütunun tepesinde durur.

Paylar, snackbar'lar, renk ve sıra ayrı bar'lı `PantrixScaffold`'daki gibi çalışır: gezinmeye, bulunduğu yerde dokunduğu kenarların payları verilir; bulunduğu yerde okunur ve ulaşılır: başlangıçta ilk, altta ve dikey bar'da içerikten sonra.

Parametreler:

- `navigation: @Composable (placement: ScaffoldNavigationPlacement, insets: PaddingValues) -> Unit`: Uygulamanın hedefleri; onlara nerede oldukları söylenir ve orada dokundukları kenarların pencere payları verilir.
- `modifier: Modifier`: Scaffold'un modifier'ı. Scaffold kendisine verilen alanı doldurur.
- `topBar: (@Composable (insets: PaddingValues) -> Unit)?`: İçeriğin üstündeki bar; dokunduğu kenarların pencere payları ona verilir.
- `snackbars: PantrixSnackbarState?`: Uygulamanın snackbar'ları: içeriğin üstünde gösterilir ve içerideki her şeye `LocalPantrixSnackbars` olarak verilir. Verilmezse scaffold kendi snackbar'larını göstermez ve çevresindeki düzenin `LocalPantrixSnackbars`'ını korur.
- `snackbarHost: @Composable () -> Unit`: Snackbar'ları içeriğin üstünde gösteren şey: varsayılanı `snackbars` için bir `PantrixSnackbarHost`'tur.
- `containerColor: Color`: Her şeyin arkasına, pencerenin sistem çubuklarının da arkasına çizilir.
- `contentColor: Color`: Kendi rengini vermeyen metnin ve ikonların rengi. Varsayılanı, `containerColor` bir rolün dolgusuysa onunla eşleşen renktir; temanın arka zemininde, yüzeyinde ya da temanın tanımadığı bir renkte ise hiçbiri.
- `windowInsets: WindowInsets`: Scaffold'un yuvalarına verdiği, içeriği ve snackbar'ları da dışında tuttuğu pencere payları: varsayılanı sistem çubukları ve ekran çentiğidir, klavye içinde değildir; üstteki bir kapsayıcının zaten tükettiği paylar hesaba katılmaz.
- `style: ScaffoldStyle?`: Bu çağrının kendi stili; gezinmenin hangi genişlikten itibaren başlangıç kenarına geçtiğini söyler ve çevresindeki her stili ezer. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `content: @Composable (padding: PaddingValues) -> Unit`: Ekran; ona bar'lardan ve pencere paylarından kaçınması için gereken pay verilir.

### ScaffoldNavigationPlacement

`import com.pantrixui.components.container.scaffold.ScaffoldNavigationPlacement`, `com.pantrixui:components` içinden

```kotlin
enum class ScaffoldNavigationPlacement
```

Uyarlanabilir gezinmesi olan bir `PantrixScaffold`'un gezinmeyi koyduğu yer.

Değerleri:

- `Bottom`: Alt kenarda, içeriğin altında: bir navigation bar. Scaffold'un dar olduğu yerde ve masadaki bir dizüstü gibi tutulan katlanır bir cihazda.
- `Start`: Başlangıç kenarında, scaffold'un tam yüksekliğinde: bir ray ya da bir sidebar. Sağdan sola düzende sağ kenarda.
- `VerticalBar`: Sistemin dikey bar'ının dibinde, dik: iPhone Duo'nun dış ekranının kenarında durum çubuğu ve bir uygulamanın bar'ları için tuttuğu sütun. `NavigationBarOrientation.Vertical` olarak çizilen bir navigation bar. Pencerede böyle bir sütun olduğu, pencere dik durup içinden menteşe geçmediği ve scaffold sütuna uzandığı yerde, scaffold'un genişliği ne olursa olsun.

### ScaffoldStyle

`import com.pantrixui.components.container.scaffold.ScaffoldStyle`, `com.pantrixui:components` içinden

```kotlin
class ScaffoldStyle(
    public val sideNavigationMinWidth: Dp = Dp.Unspecified
) : PantrixStyle<ScaffoldStyle>
```

`PantrixScaffold`'un kendi verdiği tek karar: uyarlanabilir gezinmesinin alt kenardan başlangıç kenarına geçmesi için ne kadar geniş olması gerektiği.

Scaffold pencerenin değil, kendi genişliğini ölçer: daha geniş bir pencerenin bir bölmesindeki scaffold kendi alanına göre karar verir. Bu genişlik yoğunlukla ölçeklenmez. Masadaki bir dizüstü gibi tutulan katlanır bir cihazda gezinme her genişlikte alt kenarda kalır: bu bir stil değil, pencerenin duruşudur. Bir scaffold'un renkleri stilinin parçası değildir: zemini varsayılan olarak `background`'dur, pencere payları da pencereden gelir.

Parametreler:

- `sideNavigationMinWidth: Dp`: Uyarlanabilir gezinmesi başlangıç kenarında duran bir scaffold'un olabileceği en dar genişlik; daha dar bir scaffold gezinmeyi alt kenara koyar. Her platformda 600dp'dir: Material 3'ün gezinmeyi bar'dan raya taşıdığı genişlik.

### LocalPantrixSnackbars

`import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars`, `com.pantrixui:components` içinden

```kotlin
val LocalPantrixSnackbars: ProvidableCompositionLocal<PantrixSnackbarState?>
```

Bu composable'ın çevresindeki düzenin snackbar'ları; onları veren bir şey yoksa null.

İçeriğinin üstüne bir `PantrixSnackbarHost` koyan düzen, sunucunun durumunu burada verir. Böylece içindeki bir ekran, durum kendisine geçirilmeden snackbar gösterir: bir coroutine içinde `LocalPantrixSnackbars.current?.show(...)`. `snackbars` verilen bir `PantrixScaffold` onları verir.

### Modifier.scrollPadding

`import com.pantrixui.foundation.a11y.scrollPadding`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.scrollPadding(padding: PaddingValues): Modifier
```

Bir kaydırıcının içeriğinin sonlarında ne kadar boşluk bıraktığını söyler; böylece gösterilmesi istenen şey o boşluğun içinde gösterilir: içeriğin altından kaydığı bar'ın üstünde, kaydırıcının tam kenarında değil.

Bir öğeyi kaydıran her şey, öğe odağı alınca onu görünür alana getirir, ama kaydırıcının kendi kenarından öteye değil. İçerik bir bar'ın altından kayıyorsa, bar'ların payı kadar boşluk verilen bir scaffold içeriğinde olduğu gibi, o kenar bar'ın arkasıdır: klavyenin odağı görünmeyen bir yere gider ve sayfa WCAG 2.2'nin 2.4.11 ölçütünü (Focus Not Obscured) karşılamaz. Bu modifier içeriğin üstündeyken, içindeki bir şeyi gösterme isteklerinin her biri, odağınki de başkası da, geçerken `padding` kadar büyütülür ve kaydırıcı öğeyi kenarından o kadar içeride gösterir: bar'ın üstünde.

Kaydırılanın üstüne, kaydırıcının içine konur ve kendisi boşluk eklemez: içeriğin bıraktığı boşluğu söyler.

- Kayan bir satırın ya da sütunun içeriğinde, kaydırmadan sonra ve sözünü ettiği boşluktan önce: `Modifier.verticalScroll(state).scrollPadding(padding).padding(padding)`.

- `contentPadding`'i `padding` olan bir lazy listenin ya da ızgaranın her öğesinde.

Kendisinde olandan fazlası istenen bir kaydırıcı hiçbir şeyi kaydırmaz ve artanı kullanıcının bir sürüklemesi olarak üstündekine geçirir; bu, içinde durduğu bir sheet'i oynatır. Bu yüzden bir satırda ya da sütunda içeriğin uzandığından fazlası istenmez: kaydırılan içerik boyundan bulunur, yerinden büyüktür, ve en sondaki öğe kenardan, ardında ne kadar içerik varsa o kadar içeride gösterilir. Lazy bir listede ve içeriğin kaydırıcısına sığdığı yerde içeriğin nereye kadar uzandığı bilinemez ve `padding`'in tamamı istenir: içeriğin sonlarında o kadar boşluk olmalıdır; aynı boşluk verildiyse vardır. İçerideki bir kaydırıcıya dokunulmaz: öğeyi kendi başına gösterdiği gibi gösterir, çevresindekinden istenen ise buradan geçer.

Odak halkası, içerik o kadar uzanıyorsa kendi yerini kendisi ister (`focusRing`). Lazy bir listede isteyemez: orada listenin içerik boşluğu ve bu değer halkanın yerini de içerir, `PantrixPlatform.focusRingReach`.

Bütünü docs/guide/scroll-padding/SCROLL_PADDING_GUIDE.md'dedir; bu kütüphaneyi kullanmayan bir proje için aynısı da orada.

Parametreler:

- `padding: PaddingValues`: İçeriğin her kenarda, kaydırıcının içinde bıraktığı boşluk: bir scaffold'un içeriğine verdiği bar payı, bir lazy listenin `contentPadding`'i. Baş ve son, düzenin yönünü izler. Kaydırıcının kendisi klavyenin üstünde bitiyorsa, `imePadding` ile olduğu gibi, altındaki bar klavyenin arkasındadır ve kaydırıcının hiçbir yerini örtmez: orada klavyenin payı düşülür, `padding - WindowInsets.ime.asPaddingValues()`, yoksa yazılan şey bir bar boyu fazla yukarıda gösterilir.

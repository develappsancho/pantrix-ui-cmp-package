# Top Bar

Ekranın üstündeki bar: ekranın adı, başında bir gezinme ikonu, sonunda eylemler.

Bar bulunduğu yerin genişliğindedir ve stilinin söylediği yüksekliktedir; yalnızca içindeki gerektirdiğinde uzar, daha büyük yazılmış bir başlıkta olduğu gibi. Bir ekranda çoğunlukla `PantrixScaffold`'un `topBar` yuvasında durur. Bu sayfadaki bar'lar ekranın üst kenarında durmadığı için kenarlı bir yüzeyin içindedir: sınırları böyle görünür.

- `PantrixBackButton` (`com.pantrixui.components.container.topbar`, `com.pantrixui:components`): Önceki ekrana dönen düğme, bir üst barın gezinme ikonu için: platformun oku ya da köşeli oku, temanın dilinde “Geri” adıyla. Anahtar sözcükler: geri, geri dön, yukarı, önceki ekran, geri oku.
- `PantrixTopBar` (`com.pantrixui.components.container.topbar`, `com.pantrixui:components`): Bir ekranın üstündeki bar: başlığı, önünde bir gezinme ikonu ve arkasında eylemler; başlık, platformdaki gibi başta ya da ortada. Anahtar sözcükler: üst bar, uygulama barı, araç çubuğu, başlık barı, eylem barı, büyük başlık.

## Özellikler

- **Başlık ve alt başlık.** `title` ekranın adıdır ve tek satırdır; `subtitle` altında, daha küçük yazılır: bir sayı, bir durum. İkisi de gezinme ikonu ile eylemlerin arasındaki yere sığmadığında kısaltılır, onların altına girmez. Yazı stilleri `titleStyle` ve `subtitleStyle` ile verilir; verilmezse temanın `title` ve `footnote` stilleridir.
- **Platform.** Başlık Android'de, masaüstünde ve web'de başta, iOS'ta bar'ın ortasında durur. Ortadaki başlık sığdığı sürece bar'ın tam ortasındadır; sığmayınca geniş olan yandan uzaklaşır. Bar Android'de ve iOS'ta 54dp, masaüstünde ve web'de 56dp yüksekliğindedir.
- **Gezinme ikonu ve eylemler.** `navigationIcon` başlığın önünde durur: bir geri düğmesi ya da bir menüyü açan düğme. `actions` başlığın arkasında bir satırdır: ekranın yapabildikleri için ikon düğmeleri, en çok kullanılan başta.
- **Geri düğmesi.** `PantrixBackButton` platformun ikonunu çizer: Android'de, masaüstünde ve web'de ok, iOS'ta ok başı; ikisi de sağdan sola düzende döner. Ekran okuyucu ona temanın dilinde "Geri" der.
- **Kayan içeriğin çizgisi.** `scrolled` true iken bar'ın alt kenarında bir çizgi çizilir. Çizgi bar'ın yüksekliğinin içindedir; belirip kaybolurken hiçbir şey yerinden oynamaz.
- **Çöken başlık.** `state` verilen bar açıkken başlığı, satırın altındaki bir bantta büyük yazar; içerik yukarı kaydıkça bant kapanır ve başlık satıra geçer. İçerik kaydırmasını bar'a `Modifier.topBarScroll(state)` ile verir.
- **Paylar.** `insets` bar'ın kenarlarında açık bıraktığı yerdir: durum çubuğunun ve çentiğin payı. Bar'ın dolgusu onların arkasına uzanır.
- **Renk.** Bar temanın `surface`'ındadır, başlık `textPrimary`, alt başlık `textSecondary` ile yazılır. `TopBarColors` dolguyu, içeriğin rengini ve çizgiyi verir; dolgulu bir bar'da hepsi tek renkle yazılır.
- **Okuma sırası.** Ekran okuyucu ve Tab tuşu bar'ı okunduğu sırayla gezer: gezinme ikonu, başlık ve altındaki alt başlık, eylemler. Başlık ekran okuyucu için ekranın başlığıdır.
- **Otomasyon.** `tagKey` ile bar `TopBar_<tagKey>`, çöken bar'ın büyük başlığı `TopBar_<tagKey>.Title_large` olur. Geri düğmesi bir ikon düğmesidir: `IconButton_<tagKey>` etiketini taşır ve basışı öyle bildirilir.

## Kullanım

### In a top bar

```kotlin
PantrixTopBar(
    title = stringResource(Res.string.settings),
    navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
    tagKey = "settings"
)
```

### On the first screen of a flow, where there is nowhere to go back to

```kotlin
PantrixBackButton(onClick = onBack, enabled = step > 0, tagKey = "back")
```

### A screen with a back button and an action

```kotlin
val list = rememberLazyListState()
PantrixScaffold(
    topBar = { insets ->
        PantrixTopBar(
            title = stringResource(Res.string.conversation),
            navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
            actions = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Search,
                    contentDescription = PantrixTheme.strings.search,
                    onClick = onSearch,
                    tagKey = "search"
                )
            },
            scrolled = list.canScrollBackward,
            insets = insets,
            tagKey = "conversation"
        )
    }
) { padding ->
    LazyColumn(state = list, contentPadding = padding) {
        items(messages, key = { it.id }) { MessageRow(it) }
    }
}
```

### A title that collapses as the list scrolls

```kotlin
val topBar = rememberPantrixTopBarState()
val list = rememberLazyListState()
PantrixScaffold(
    topBar = { insets ->
        PantrixTopBar(
            title = stringResource(Res.string.inbox),
            navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
            scrolled = list.canScrollBackward,
            state = topBar,
            insets = insets,
            tagKey = "inbox"
        )
    }
) { padding ->
    LazyColumn(modifier = Modifier.topBarScroll(topBar), state = list, contentPadding = padding) {
        items(conversations, key = { it.id }) { ConversationRow(it) }
    }
}
```

### A title and a subtitle in types of their own

```kotlin
PantrixTopBar(
    title = stringResource(Res.string.projects),
    subtitle = stringResource(Res.string.open_projects, open),
    titleStyle = PantrixTheme.typography.callout,
    subtitleStyle = PantrixTheme.typography.caption,
    tagKey = "projects"
)
```

### A title with a subtitle, in the brand's colour

```kotlin
PantrixTopBar(
    title = stringResource(Res.string.inbox),
    subtitle = stringResource(Res.string.unread, unread),
    colors = TopBarColors(container = PantrixTheme.colors.primary.color),
    tagKey = "inbox"
)
```

## Örnekler

### Yalnızca başlık

En az yazılan hâli: yalnızca `title`. Gezinme ikonu olmadığında başta duran başlık bar'ın kendi iç boşluğundan başlar; iOS'ta başlık ortadadır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(title = "Gelen Kutusu", tagKey = "plain")
}
```

### Geri düğmesi, eylemler ve altında kayan içerik

Bir konuşma ekranı: geri düğmesi, iki eylem ve bar'ın altında kayan bir liste. `navigationIcon` başlığın önüne bir `PantrixBackButton` koyar; geri düğmesine kaç kez basıldığı alt başlıkta yazar. `actions` başlığın arkasına iki ikon düğmesi koyar: kendi hâlleriyle, markanın renginde.

Listeyi kaydır: liste başından ayrılınca bar'ın alt kenarında bir çizgi belirir (`scrolled`) ve liste geri kayabildiği sürece görünür. Çizgi bar'ın yüksekliğinin içindedir; belirip kaybolurken hiçbir şey yerinden oynamaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val list = rememberLazyListState()
var back by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    Column(modifier = Modifier.height(220.dp)) {
        PantrixTopBar(
            title = "Konuşma",
            subtitle = if (back == 0) null else "Geri'ye $back kez basıldı",
            navigationIcon = { PantrixBackButton(onClick = { back++ }, tagKey = "back") },
            actions = {
                PantrixIconButton(
                    imageVector = PantrixIcons.Search,
                    contentDescription = "Ara",
                    onClick = {},
                    tagKey = "search"
                )
                PantrixIconButton(
                    imageVector = PantrixIcons.MoreHorizontal,
                    contentDescription = "Diğer",
                    onClick = {},
                    tagKey = "more"
                )
            },
            scrolled = list.canScrollBackward,
            tagKey = "conversation"
        )
        LazyColumn(
            // Liste bar kadar geniştir: dar kalsaydı yanındaki boşluğa basan parmak listeyi değil sayfayı
            // kaydırırdı.
            modifier = Modifier.fillMaxWidth(),
            state = list,
            contentPadding = PaddingValues(PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
        ) {
            items(12) { index -> PantrixText(text = "Mesaj ${index + 1}") }
        }
    }
}
```

### Alt başlık

`subtitle` başlığın altına daha küçük yazılan bir satır koyar: bir sayı, bir durum. Gezinme ikonu burada bir geri düğmesi değil, bir menüyü açan ikon düğmesidir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Projeler",
        subtitle = "12 açık",
        navigationIcon = {
            PantrixIconButton(
                imageVector = PantrixIcons.Menu,
                contentDescription = "Menüyü aç",
                onClick = {},
                tagKey = "menu"
            )
        },
        tagKey = "subtitle"
    )
}
```

### Başlık ve alt başlık kendi yazı stilleriyle

Başlığın ve alt başlığın yazı stili verilebilir: `titleStyle` ve `subtitleStyle`. Verilmezse temanın `title` ve `footnote` stilleridir; burada `callout` ve `caption` verildi. Stilin kendi rengi yoksa yazı bar'ın renginde kalır. Daha büyük bir stil bar'ı satırının gerektirdiği kadar uzatır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Projeler",
        subtitle = "12 açık",
        titleStyle = PantrixTheme.typography.callout,
        subtitleStyle = PantrixTheme.typography.caption,
        navigationIcon = {
            PantrixIconButton(
                imageVector = PantrixIcons.Menu,
                contentDescription = "Menüyü aç",
                onClick = {},
                tagKey = "type_menu"
            )
        },
        tagKey = "own_type"
    )
}
```

### Sığmayan başlık kısaltılır

Başlık gezinme ikonunun ve eylemlerin altına girmez: aralarında kalan yere sığmayan başlık kısaltılır. Bar burada en fazla 360dp genişliğindedir; başlık geri düğmesi ile yıldızın arasına sığmaz ve sonu kesilir.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.widthIn(max = 360.dp), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Üçüncü çeyreğin raporları, yönetim kuruluna gönderildiği hâliyle",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "long_back") },
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Star,
                contentDescription = "Favorilere ekle",
                onClick = {},
                tagKey = "favourite"
            )
        },
        tagKey = "long"
    )
}
```

### Başlığın yeri: başta ve ortada

Başlığın yeri platforma göredir: Android'de, masaüstünde ve web'de başta, iOS'ta bar'ın ortasında. Burada aynı bar iki kez çizildi ve yer `style` ile verildi: `TopBarStyle(titleAlignment = ...)`. Hangi platformda bakılırsa bakılsın ikisi de görünür.

Ortadaki başlık, yanında ne durursa dursun bar'ın ortasındadır: geri düğmesi onu yana itmez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarStyle
import com.pantrixui.components.container.topbar.TopBarTitleAlignment
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Ayarlar",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "start_back") },
        style = TopBarStyle(titleAlignment = TopBarTitleAlignment.Start),
        tagKey = "start"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Ayarlar",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "center_back") },
        style = TopBarStyle(titleAlignment = TopBarTitleAlignment.Center),
        tagKey = "center"
    )
}
```

### Geri düğmesinin ikonu

`PantrixBackButton` hangi ikonu çizeceğini bar'ın stilinden alır: `TopBarStyle.backIcon`. Platformun kendi ikonu Android'de, masaüstünde ve web'de ok, iOS'ta ok başıdır. Burada iki bar'a `style` ile birer ikon verildi; bir bar'ın `navigationIcon`'ındaki geri düğmesi o bar'a verilen stili kullanır.

İkisi de sağdan sola düzende döner: uygulamanın üst bar'ındaki "Yazı tipi ve yön" menüsünden yazı yönünü çevirip bak.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.BackButtonIcon
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarStyle
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Ok",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "arrow_back") },
        style = TopBarStyle(backIcon = BackButtonIcon.Arrow),
        tagKey = "arrow"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Ok başı",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "chevron_back") },
        style = TopBarStyle(backIcon = BackButtonIcon.Chevron),
        tagKey = "chevron"
    )
}
```

### Dönülecek yer yokken

Bir akışın ilk ekranında dönülecek yer yoktur: `PantrixBackButton`'ın `enabled`'ı false olur ve düğme basılamaz. Sondaki düğmeyle ilerle: geri düğmesi ikinci adımdan itibaren açılır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var step by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Adım ${step + 1} / 3",
        navigationIcon = { PantrixBackButton(onClick = { step -= 1 }, enabled = step > 0, tagKey = "step_back") },
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.ArrowForward,
                contentDescription = "Sonraki adım",
                onClick = { step += 1 },
                enabled = step < 2,
                tagKey = "step_next"
            )
        },
        tagKey = "steps"
    )
}
```

### Liste kaydıkça çöken büyük başlık

Çöken başlık: durum uygulamanındır ve `rememberPantrixTopBarState()` ile tutulur; liste kaydırmasını bar'a `Modifier.topBarScroll(state)` ile verir. Bar açıkken başlık, satırın altındaki bir bantta temanın `headline` stiliyle büyük yazılır. Büyük başlık her platformda bar'ın başında durur; satırdaki başlık platformun yerinde, iOS'ta ortada.

Listeyi yukarı kaydır: önce bant kapanır, başlık satıra geçer, liste ancak ondan sonra kayar. Bar yeniden yalnızca liste başına dönünce açılır. Bir parmak onu iki yüksekliğin arasında bırakırsa yakın olana gider; fare tekerleğinden sonra tekerleğin son çevrildiği yöne gider. Ekran okuyucu satırdaki başlığı okur: o hep oradadır ve başlık iki kez okunmaz.

Bar ile liste bir scaffold'un içindedir, bir uygulamada olduğu gibi: liste scaffold'un tamamını doldurur ve bar'ın yüksekliği ona üst pay olarak gelir. Bar kapanıp açılırken listenin kendisi yerinde durur, yalnızca payı değişir. Alttaki düğme listeyi başa alır ve `collapsedFraction`'ı sıfırlayarak bar'ı açar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.scaffold.PantrixScaffold
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.rememberPantrixTopBarState
import com.pantrixui.components.container.topbar.topBarScroll
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val topBar = rememberPantrixTopBarState()
val list = rememberLazyListState()
val scope = rememberCoroutineScope()
val spacing = PantrixTheme.spacing
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixScaffold(
        modifier = Modifier.height(320.dp),
        topBar = { insets ->
            PantrixTopBar(
                title = "Gelen Kutusu",
                subtitle = "3 okunmamış",
                navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "collapsing_back") },
                actions = {
                    PantrixIconButton(
                        imageVector = PantrixIcons.Search,
                        contentDescription = "Ara",
                        onClick = {},
                        tagKey = "collapsing_search"
                    )
                },
                scrolled = list.canScrollBackward,
                state = topBar,
                insets = insets,
                tagKey = "collapsing"
            )
        },
        containerColor = PantrixTheme.colors.surface,
        // Sayfanın içindeki bir kutu: sistem çubukları sayfanın scaffold'undadır, bunun payı yoktur.
        windowInsets = WindowInsets(0, 0, 0, 0)
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().topBarScroll(topBar),
            state = list,
            contentPadding = PaddingValues(
                start = spacing.lg,
                top = padding.calculateTopPadding() + spacing.lg,
                end = spacing.lg,
                bottom = spacing.lg
            ),
            verticalArrangement = Arrangement.spacedBy(spacing.md)
        ) {
            items(24) { index -> PantrixText(text = "Konuşma ${index + 1}") }
        }
    }
}
PantrixButton(
    text = "Başa dön ve bar'ı aç",
    onClick = {
        scope.launch {
            list.scrollToItem(0)
            topBar.collapsedFraction = 0f
        }
    },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "collapsing_to_top"
)
```

### Bar'ın açık bıraktığı pay

`insets` bar'ın kenarlarında açık bıraktığı paydır: durum çubuğunun ve çentiğin yeri. Bir `PantrixScaffold` bunu üst bar'ına kendisi verir; burada elle 28dp'lik bir üst pay verildi. Bar'ın dolgusu payın arkasına uzanır, başlık ve geri düğmesi payın altında kalır: bar, stilinin yüksekliğine ek olarak pay kadar uzundur.

```kotlin
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarColors
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Ayarlar",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "insets_back") },
        colors = TopBarColors(container = PantrixTheme.colors.primary.container),
        insets = PaddingValues(top = 28.dp),
        tagKey = "insets"
    )
}
```

### Kendi renkleriyle

`colors` bar'a temanın değil, verilen renkleri verir. İlk bar'ın dolgusu temanın bir rolünün rengi ve yalnızca o verildi: başlığın, alt başlığın ve geri düğmesinin rengini tema eşleştirir.

İkinci bar temada olmayan bir renkte, uygulamanın kendi morunda: üstünde okunan renk `content` ile verilir. Başlık, alt başlık ve geri düğmesi `content` rengini alır. İkon düğmesinin kendi renkleri vardır: dolgunun üstünde okunan renk ona ayrıca verilir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.container.topbar.TopBarColors
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Gelen Kutusu",
        subtitle = "Yalnızca dolgu verildi",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "role_back") },
        colors = TopBarColors(container = PantrixTheme.colors.primary.color),
        tagKey = "role"
    )
}
PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
    PantrixTopBar(
        title = "Gelen Kutusu",
        subtitle = "3 okunmamış",
        navigationIcon = { PantrixBackButton(onClick = {}, tagKey = "own_back") },
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Search,
                contentDescription = "Ara",
                onClick = {},
                colors = ButtonColors(container = Color.Transparent, content = own.onColor),
                tagKey = "own_search"
            )
        },
        colors = TopBarColors(container = own.color, content = own.onColor),
        tagKey = "own"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixTopBar

`import com.pantrixui.components.container.topbar.PantrixTopBar`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTopBar(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    titleStyle: TextStyle = PantrixTheme.typography.title,
    subtitleStyle: TextStyle = PantrixTheme.typography.footnote,
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: (@Composable RowScope.() -> Unit)? = null,
    scrolled: Boolean = false,
    state: PantrixTopBarState? = null,
    style: TopBarStyle? = null,
    colors: TopBarColors? = null,
    insets: PaddingValues = PaddingValues(),
    tagKey: String? = null
)
```

Ekranın üstündeki bar: ekranın başlığı, önünde bir gezinme ikonu ve arkasında eylemler.

Başlığın yeri platforma göredir (`TopBarStyle.titleAlignment`): Android'de, masaüstünde ve web'de başta, iOS'ta bar'ın ortasında. Ortadaki başlık, yanında ne durursa dursun, sığdığı sürece bar'ın ortasındadır. Oraya sığmayan başlık, geniş olan yandan uzaklaşır. Baştaki başlık da ortadaki başlık da gezinme ikonunun ya da eylemlerin altına girmez: aralarındaki yere sığmayan başlık kısaltılır, altındaki `subtitle` da öyle. Başlık, ekran okuyucu için ekranın başlığıdır.

Bar bulunduğu yerin genişliğindedir. Yüksekliği, açık bıraktığı `insets` payının altında stilinin söylediği kadardır. Yalnızca içindeki gerektirdiğinde uzar, daha büyük yazılmış bir başlıkta olduğu gibi: başlığın satırları bar'ın üst ve alt kenarından biraz içeride durur.

```kotlin
val list = rememberLazyListState()
PantrixScaffold(
    topBar = { insets ->
        PantrixTopBar(
            title = stringResource(Res.string.conversation),
            navigationIcon = { PantrixBackButton(onClick = onBack, tagKey = "back") },
            scrolled = list.canScrollBackward,
            insets = insets,
            tagKey = "conversation"
        )
    }
) { padding -> Messages(list, padding) }
```

`state` verilen bar'ın başlığı çöker. Bar `TopBarStyle.expandedHeight` yüksekliğinde başlar: büyük yazılan başlık ve altındaki alt başlık, gezinme ikonu ile eylemlerin altında kendi bantlarında, her platformda bar'ın başında durur. Bar'ın altındaki içerik yukarı kaydıkça bant kapanır ve bar `TopBarStyle.height` yüksekliğine iner: banttaki başlık giderken satırdaki başlık gelir. İçerik kaydırmasını bar'a `Modifier.topBarScroll(state)` ile verir. Ekran okuyucu, hep orada olan satırdaki başlığı okur ve başlıkla iki kez karşılaşmaz.

Ekran okuyucu ve Tab tuşu bar'ı okunduğu sırayla gezer: gezinme ikonu, başlık ve altındaki alt başlık, eylemler.

**Sistemin dikey bar'ında.** iPhone Duo'nun dış ekranının kenarında tuttuğu sütunu tutan bir `PantrixScaffold`'un içinde bar, gezinme ikonunu ve eylemlerini oraya verir: sütunun tepesinde, durum çubuğunun altında dururlar; gezinme ikonu bar'ın dolgusundan bir kapsülde, eylemler bir başkasında alt alta, UIKit'in bir gezinme bar'ının düğmelerini oraya koyduğu gibi. Bar başlığını tutar; başlık o zaman bar'ın genişliğindedir. Aynı anda düğmelerini veren iki bar'dan, bir sayfa ötekinin üstüne kayarken olduğu gibi, sütun en son geleninkini gösterir.

Parametreler:

- `title: String`: Ekranın adı, tek satırda.
- `modifier: Modifier`: Bar'ın modifier'ı.
- `subtitle: String?`: Başlığın altında daha küçük yazılan bir satır: bir sayı, bir durum. Alt başlık yoksa null.
- `titleStyle: TextStyle`: Satırdaki başlığın yazı stili: verilmezse temanın `title` stilidir. Daha büyük bir stil bar'ı satırının gerektirdiği kadar uzatır. Yazı stilinin kendi rengi yoksa başlık bar'ın rengindedir. Çöken bir bar'ın büyük başlığı, burada ne verilirse verilsin temanın `headline` stilindedir.
- `subtitleStyle: TextStyle`: Alt başlığın satırdaki ve çöken bir bar'ın bandındaki yazı stili: verilmezse temanın `footnote` stilidir. Yazı stilinin kendi rengi yoksa alt başlık bar'ın rengindedir.
- `navigationIcon: (@Composable () -> Unit)?`: Başlığın önünde duran şey: bir `PantrixBackButton` ya da bir çekmeceyi açan düğme. Gezinme ikonu yoksa null: başlık o zaman bar'ın kendi iç boşluğundan başlar.
- `actions: (@Composable RowScope.() -> Unit)?`: Başlığın arkasında bir satırda duranlar: ekranın yapabildikleri için ikon düğmeleri, en çok kullanılan başta. Bir düğme kendi renkleriyle çizilir, başka renk verilmezse markanın rengiyle. Kendi dolgusu olan bir bar'da her düğmeye orada okunan renk verilir.
- `scrolled: Boolean`: Bar'ı altında kayan içerikten ayırmak için alt kenarı boyunca bir çizgi çizilip çizilmediği. İçeriğin geri kayıp kayamadığı verilir: `listState.canScrollBackward` gibi. Çizgi bar'ın yüksekliğinin içindedir, belirip kaybolurken hiçbir şey yerinden oynamaz.
- `state: PantrixTopBarState?`: Bar'a çöken bir başlık verir. `rememberPantrixTopBarState` ile tutulur, içeriğin kaydırması ona `Modifier.topBarScroll` ile verilir. Null iken bar tek yüksekliktedir.
- `style: TopBarStyle?`: Bu bar'ın kendi geometrisi. `navigationIcon` içindeki bir `PantrixBackButton` da onunla çizilir. Her platformda yalnızca verdiği alanlar değişir.
- `colors: TopBarColors?`: Bu bar'ın kendi renkleri. Null iken temanın renkleri kullanılır: bar temanın `surface`'ındadır, başlık `textPrimary`, alt başlık `textSecondary` ile yazılır.
- `insets: PaddingValues`: Bar'ın kenarlarında açık bıraktığı pay: durum çubuğunun ve çentiğin yeri, bir `PantrixScaffold`'un üst bar'ına verdiği gibi. Bar'ın dolgusu payın arkasına uzanır.
- `tagKey: String?`: Bar'ın otomasyon anahtarı, her dilde aynıdır: bar `TopBar_<tagKey>` olarak, çöken bir bar'ın büyük başlığı `TopBar_<tagKey>.Title_large` olarak etiketlenir.

### PantrixBackButton

`import com.pantrixui.components.container.topbar.PantrixBackButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixBackButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    tagKey: String? = null
)
```

Bir `PantrixTopBar`'ın gezinme ikonu için, önceki ekrana dönen düğme: ekran okuyucunun temanın dilinde "Geri" dediği bir ikon düğmesi.

Platformun kendi ikonunu çizer (`TopBarStyle.backIcon`): Android'de, masaüstünde ve web'de ok, iOS'ta ok başı. İkisi de sağdan sola düzende döner. Bir üst bar'ın `navigationIcon`'ındayken o bar'a verilen stili alır.

Bir `PantrixIconButton`'dır ve temanın zeminlerinde onun gibi çizilir: markanın renginde. Bir dolgunun üstünde ve içindekiler için renk verilmiş bir bar'da o renkle çizilir. `IconButton_<tagKey>` olarak etiketlenir ve bir `IconButton` `click`'i bildirir.

Parametreler:

- `onClick: () -> Unit`: Basıldığında çağrılır: önceki ekrana dönülür.
- `modifier: Modifier`: Düğmenin modifier'ı.
- `enabled: Boolean`: Düğmeye basılıp basılamadığı.
- `tagKey: String?`: Düğmenin otomasyon anahtarı, her dilde aynıdır.

### rememberPantrixTopBarState

`import com.pantrixui.components.container.topbar.rememberPantrixTopBarState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberPantrixTopBarState(): PantrixTopBarState
```

Çöken başlıklı bir `PantrixTopBar` için, yapılandırma değişikliğinde kaybolmayan bir `PantrixTopBarState`.

### PantrixTopBarState

`import com.pantrixui.components.container.topbar.PantrixTopBarState`, `com.pantrixui:components` içinden

```kotlin
class PantrixTopBarState(collapsedFraction: Float = 0f)
```

Çöken başlıklı bir `PantrixTopBar`'ın ne kadar çöktüğü ve onu çökerten kaydırma.

Durum verilen bar `TopBarStyle.expandedHeight` yüksekliğindedir ve başlığını gezinme ikonu ile eylemlerin altındaki bir bantta büyük yazar. Altındaki içerik yukarı kaydıkça bant kapanır, başlık satıra geçer ve bar `TopBarStyle.height` yüksekliğine iner. İçerik kaydırmasını bar'a `topBarScroll` ile verir: bar içerik yerinden oynamadan önce çöker ve ancak içerik başına dönünce yeniden açılır, böylece büyük başlık bir listenin ortasında geri gelmez. Parmak bar'ı iki yüksekliğinin arasında bırakırsa bar yakın olana gider. Fare tekerleğinden sonra ise tekerleğin son çevrildiği yöne gider.

Durum uygulamanındır, bir kaydırma durumu gibi: `rememberPantrixTopBarState` ile tutulur ve yapılandırma değişikliğinde kaybolmaz. Bar'ı izleyen başka her şey için `collapsedFraction` okunur.

Parametreler:

- `collapsedFraction: Float`: Bar'ın başlangıçta ne kadar çökmüş olduğu. Verilmezse 0'dır: bar tümüyle açıktır.

Üyeleri:

- `collapsedFraction: Float`: Bar tümüyle açıkken 0, çöktüğünde 1'dir. Verilen değer bu ikisinin arasında tutulur. 0 verilirse bar açılır: başına yeni dönmüş bir ekran böyle yapar.

Tipin kendisinde:

- `PantrixTopBarState.Saver: Saver<PantrixTopBarState, Float>`: Bar'ın ne kadar kapandığını bir yapılandırma değişikliği boyunca saklar.

### Modifier.topBarScroll

`import com.pantrixui.components.container.topbar.topBarScroll`, `com.pantrixui:components` içinden

```kotlin
fun Modifier.topBarScroll(state: PantrixTopBarState): Modifier
```

Uygulandığı içeriğin kaydırmasını `state`'e verir: böylece içeriğin üstündeki üst bar, içerik yukarı kaydıkça çöker ve içerik başına dönünce yeniden açılır. İçeriğin üstünde çevrilen fare tekerleğini de izler: tekerlek kaydırmasının ne zaman bittiğini söylemez, başındaki içeriğin de yukarı çevrilen tekerlekle yapacağı bir şey yoktur.

```kotlin
val topBar = rememberPantrixTopBarState()
LazyColumn(modifier = Modifier.topBarScroll(topBar), contentPadding = padding) { ... }
```

Parametreler:

- `state: PantrixTopBarState`

### TopBarTitleAlignment

`import com.pantrixui.components.container.topbar.TopBarTitleAlignment`, `com.pantrixui:components` içinden

```kotlin
enum class TopBarTitleAlignment
```

Bir `PantrixTopBar`'ın başlığını nereye koyduğu.

Değerleri:

- `Start`: Başta, gezinme ikonundan sonra: Android'in, masaüstünün ve web'in üst bar'ları.
- `Center`: Yanında ne durursa dursun, sığdığı sürece bar'ın ortasında: iOS'un gezinme bar'ı.

### BackButtonIcon

`import com.pantrixui.components.container.topbar.BackButtonIcon`, `com.pantrixui:components` içinden

```kotlin
enum class BackButtonIcon
```

Bir `PantrixBackButton`'ın çizdiği ikon.

Değerleri:

- `Arrow`: Ok: Android'in, masaüstünün ve web'in geri düğmesi.
- `Chevron`: Ok başı: iOS'un geri düğmesi.

### TopBarStyle

`import com.pantrixui.components.container.topbar.TopBarStyle`, `com.pantrixui:components` içinden

```kotlin
class TopBarStyle(
    public val height: Dp = Dp.Unspecified,
    public val expandedHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val titleInset: Dp = Dp.Unspecified,
    public val titleGap: Dp = Dp.Unspecified,
    public val titleAlignment: TopBarTitleAlignment? = null,
    public val backIcon: BackButtonIcon? = null
) : PantrixStyle<TopBarStyle>
```

`PantrixTopBar`'ın geometrisi ve `PantrixBackButton`'ın çizdiği ikon.

`titleInset`, başlığı yanında bir şey olmayan kenardan uzak tutar. Gezinme ikonunun ya da eylemlerin yanında başlık onlardan `titleGap` kadar uzaktadır. Bar yalnızca içindeki gerektirdiğinde `height`'tan yüksektir. Yükseklikler ve bar'ın içindeki boşluklar yoğunlukla ölçeklenir. Başlığın yeri ve geri ikonunun hangisi olduğu yoğunluğa bağlı değildir. Bir üst bar'ın renkleri stilinin parçası değildir: temanın renkleridir, bar'ın kendi renkleri varsa `TopBarColors`'tır.

Parametreler:

- `height: Dp`: Bar'ın, açık bıraktığı payların altındaki yüksekliği: Android'de ve iOS'ta 54dp, masaüstünde ve web'de 56dp.
- `expandedHeight: Dp`: Çöken başlıklı bir bar'ın çökmeden önceki yüksekliği: `height` ve onun altında, başlığı büyük yazan bant. Android'de ve iOS'ta 106dp, masaüstünde ve web'de 104dp: bant 52dp, masaüstünde ve web'de 48dp'dir. Bant yalnızca içindeki satırlar gerektirdiğinde daha yüksek olur. Bunu `height`'tan yüksek vermeyen bir stilin bandı yoktur: bar'ı, durum verilse de verilmese de tek yüksekliktedir.
- `horizontalPadding: Dp`: Bar'ın kenarları ile gezinme ikonu ve eylemler arasındaki boşluk: 8dp.
- `titleInset: Dp`: Gezinme ikonu yokken başlığın bar'ın başlangıç kenarına, eylemler yokken bitiş kenarına uzaklığı: 16dp. Başlık hiçbir kenara `horizontalPadding`'den yakın olmaz.
- `titleGap: Dp`: Gezinme ikonu ile başlık ve başlık ile eylemler arasındaki aralık: 8dp.
- `titleAlignment: TopBarTitleAlignment?`: Başlığın yeri: iOS'ta ortada, öteki platformlarda başta.
- `backIcon: BackButtonIcon?`: Bir `PantrixBackButton`'ın ne çizdiği: iOS'ta ok başı, öteki platformlarda ok.

### TopBarColors

`import com.pantrixui.components.container.topbar.TopBarColors`, `com.pantrixui:components` içinden

```kotlin
data class TopBarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir bar için `PantrixTopBar`'ın neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki olarak kalır.

```kotlin
// A bar in the brand's own colour, written in what the theme pairs with it.
PantrixTopBar(title = title, colors = TopBarColors(container = PantrixTheme.colors.primary.color))
```

Buraya verilen `container` temanın rol renklerinden biriyse, bar'ın içindekiler için temanın onunla eşleştirdiği renk kendiliğinden gelir, `content` de verilmediği sürece. Hiçbir rolde olmayan bir dolguda gelmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Bar'ın dolgusu. Bar'ın açık bıraktığı payların arkasına uzanır. Temanın `surface`'ıdır.
- `content: Color`: Başlık, alt başlık ve gezinme ikonu ile eylemlerdeki ikonlardan kendi rengini vermeyenler. Temanın kendi dolgusunda başlık temanın `textPrimary`, alt başlık `textSecondary` rengindedir, ikon da kendi varsayılanındadır.
- `divider: Color`: İçerik bar'ın altına kaymışken alt kenarı boyunca çizilen çizgi. Temanın kendi zeminlerinde temanın `divider` rengidir. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `content`'in bir payıdır: Subtle bir düğmenin kenarı gibi.

# Menteşede katmanlar

Katmanlar katlanabilir bir cihazda: dialog, sheet, popover, menü, komut paleti ve snackbar kat yerinin bir yarısında kalır, hiçbiri kat yerinin üstüne düşmez.

Kurallar katmanların ortak kodundadır; bileşenlere yeni bir parametre gerekmez. Bir katlanabilir yarı açık tutulduğunda ya da iki ekranın arasında bir menteşe olduğunda geçerlidir; düz açık bir katlanabilir tek parça bir ekrandır.

## Özellikler

- **Dialog.** Açıldığı yarının ortasındadır: son basılan yerin yarısında, klavyeyle açıldıysa odaktaki denetimin yarısında. İkisi de bilinmiyorsa kitapta başlangıç yarısında, masada alt yarıda: eller orada.
- **Sheet'ler.** Masada alttan sheet alt yarıyı alır, tam ekran sheet alt yarının tamamını. Kitapta alttan sheet açıldığı yarıda, o yarının genişliğindedir; yan sheet tam son yarıdır: kat yerinin şeridinden pencerenin sonuna.
- **Bağlı katmanlar.** Popover, menü, tooltip ve select'in listesi bağlandığı denetimin yarısında kalır: sığmazsa önce öbür yana geçer, sonra kayar, en son küçülüp kaydırılır.
- **Komut paleti.** Kitapta dialog gibi açıldığı yarıdadır; masada üst yarıdadır, yüksekliği o yarıyla sınırlı.
- **Snackbar.** Kitapta snackbar bir yarıda kalır: son köşedeki son yarıda, ötekiler başlangıç yarısında. Telefon genişliğindeki bir snackbar köşede de kat yerini aşardı.
- **Çerçevede açılan katmanlar.** Bu sayfadaki "Kitap" ve "Masa" kartın içinde çizilen bir pencere çerçevesidir (`PantrixWindowFrame`): içinde açılan katman çerçeveyi kendi penceresi sayar. Scrim çerçeveyi örter, sheet çerçevenin kenarından gelir, kat yeri çerçevenin kat yeridir; küçültülmüş bir çerçevede katman da küçülür.
- **Örten menteşe.** `Modifier.keepClearOfFolds()` iki ekranlı bir cihazda ekranı örten menteşenin şeridinden içeriği uzak tutar: bir düğümün kenarına yakın menteşenin öbür yanı boş kalır.
- **Kendi katmanın.** `rememberOverlayWindow()` bir katmanın penceresini, kat yerlerini ve nereden açıldığını söyler: kendi `Dialog`'unu ya da `Popup`'ını gösteren bir uygulama da aynı kurala göre yerleşir.

## Örnekler

### Açıldığı yarıda dialog

İki köşede birer düğme aynı dialog'u açar. "Kitap"ta soldaki düğme dialog'u sol yarıda, sağdaki sağ yarıda açar; "Masa"da üstteki üst yarıda, alttaki alt yarıda. Düz bir pencerede dialog her zaman ortadadır.

"Kitap"ta ve "Masa"da örnek pencere kadar uzundur: kat yeri onu keser ve dialog pencerenin bir yarısında açılır.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.foundation.theme.PantrixTheme

var open by remember { mutableStateOf(false) }
Box(Modifier.fillMaxWidth().height(foldExampleHeight()).padding(PantrixTheme.spacing.md)) {
    PantrixButton(
        text = "Buradan aç",
        onClick = { open = true },
        modifier = Modifier.align(Alignment.TopStart),
        tagKey = "fold_dialog_start"
    )
    PantrixButton(
        text = "Buradan aç",
        onClick = { open = true },
        modifier = Modifier.align(Alignment.BottomEnd),
        tagKey = "fold_dialog_end"
    )
}
PantrixDialog(
    visible = open,
    onDismissRequest = { open = false },
    title = "Dosya silinsin mi?",
    message = "Dosya her cihazdan kaldırılır. Bu geri alınamaz.",
    actions = {
        PantrixButton(
            text = "Vazgeç",
            onClick = { open = false },
            variant = ButtonVariant.Outline,
            tagKey = "fold_dialog_cancel"
        )
        PantrixButton(text = "Sil", onClick = { open = false }, tagKey = "fold_dialog_delete")
    },
    tagKey = "fold_dialog"
)

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### Kat yerinin yanında popover ve menü

Kat yerinin hemen önündeki bir düğmenin popover'ı sağına açılmak ister; "Kitap"ta sağı kat yerinin öbür yanı olduğu için soluna açılır. Kat yerinin hemen üstündeki bir düğmenin menüsü altına açılmak ister; "Masa"da altı kat yerinin öbür yanı olduğu için üstüne açılır.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.menu.PantrixMenu
import com.pantrixui.components.overlay.menu.PantrixMenuItem
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverSide
import com.pantrixui.foundation.theme.PantrixTheme

var details by remember { mutableStateOf(false) }
var actions by remember { mutableStateOf(false) }
Box(Modifier.fillMaxWidth().height(foldExampleHeight())) {
    Box(Modifier.align(Alignment.Center).offset(x = (-56).dp, y = (-56).dp)) {
        PantrixPopover(
            visible = details,
            onDismissRequest = { details = false },
            anchor = {
                PantrixButton(text = "Kargo", onClick = { details = !details }, tagKey = "fold_popover_anchor")
            },
            side = PopoverSide.End,
            title = "Kargo durumu",
            tagKey = "fold_popover"
        ) {
            PantrixText("Salı günü dokuz ile on iki arasında gelir; kurye on dakika önce arar.")
        }
    }
    Box(Modifier.align(Alignment.Center).offset(x = 96.dp, y = (-56).dp)) {
        PantrixMenu(
            visible = actions,
            onDismissRequest = { actions = false },
            anchor = {
                PantrixButton(
                    text = "İşlemler",
                    onClick = { actions = !actions },
                    variant = ButtonVariant.Outline,
                    tagKey = "fold_menu_anchor"
                )
            },
            tagKey = "fold_menu"
        ) {
            PantrixMenuItem(text = "Kopyala", onClick = {}, tagKey = "fold_menu_copy")
            PantrixMenuItem(text = "Paylaş", onClick = {}, tagKey = "fold_menu_share")
            PantrixMenuItem(text = "Yeniden adlandır", onClick = {}, tagKey = "fold_menu_rename")
            PantrixMenuItem(text = "Sil", onClick = {}, destructive = true, tagKey = "fold_menu_delete")
        }
    }
}

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### Kat yerinde sheet'ler

Üç düğme üç sheet açar. "Masa"da alttan sheet de tam ekran sheet de kat yerinin altında kalır; yan sheet de. "Kitap"ta alttan sheet'ler düğmelerin yarısında, o yarının genişliğinde açılır; yan sheet tam sağ yarıdır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

// Hangi sheet'in açıldığı kapanırken de hatırlanır: kapanan yan sheet yan kenardan çıkar, alttan değil.
var open by remember { mutableStateOf(false) }
var kind by remember { mutableStateOf(FoldSheet.Bottom) }
val show = { sheet: FoldSheet ->
    kind = sheet
    open = true
}
Column(
    modifier = Modifier.fillMaxWidth().height(foldExampleHeight()).padding(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Alttan sheet", onClick = { show(FoldSheet.Bottom) }, tagKey = "fold_sheet_bottom")
    PantrixButton(
        text = "Tam ekran sheet",
        onClick = { show(FoldSheet.FullScreen) },
        variant = ButtonVariant.Outline,
        tagKey = "fold_sheet_full"
    )
    PantrixButton(
        text = "Yan sheet",
        onClick = { show(FoldSheet.Side) },
        variant = ButtonVariant.Outline,
        tagKey = "fold_sheet_side"
    )
}
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Sırala",
    edge = if (kind == FoldSheet.Side) SheetEdge.End else SheetEdge.Bottom,
    fullScreen = kind == FoldSheet.FullScreen,
    tagKey = "fold_sheet"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        listOf("En yeni", "En eski", "Ada göre", "Boyuta göre").forEachIndexed { index, order ->
            PantrixButton(
                text = order,
                onClick = { open = false },
                modifier = Modifier.fillMaxWidth(),
                variant = ButtonVariant.Subtle,
                tagKey = "order_$index"
            )
        }
    }
}

private enum class FoldSheet { Bottom, FullScreen, Side }

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### Komut paleti ve snackbar

Komut paleti "Masa"da kat yerinin üstünde açılır, yüksekliği üst yarıyla sınırlıdır: liste uzunsa kayar. "Kaydet" bir snackbar gösterir; snackbar burada her platformda alt kenarın ortasındadır ve "Kitap"ta sol yarının ortasına geçer.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.components.overlay.snackbar.PantrixSnackbarHost
import com.pantrixui.components.overlay.snackbar.SnackbarPlacement
import com.pantrixui.components.overlay.snackbar.SnackbarStyle
import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

var palette by remember { mutableStateOf(false) }
val snackbars = rememberPantrixSnackbarState()
val scope = rememberCoroutineScope()
Box(Modifier.fillMaxWidth().height(foldExampleHeight())) {
    Column(
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixButton(text = "Komut paleti", onClick = { palette = true }, tagKey = "fold_palette_open")
        PantrixButton(
            text = "Kaydet",
            onClick = {
                scope.launch { snackbars.show(message = "Değişiklikler kaydedildi", tagKey = "fold_saved") }
            },
            variant = ButtonVariant.Outline,
            tagKey = "fold_save"
        )
    }
    PantrixSnackbarHost(snackbars, style = SnackbarStyle(placement = SnackbarPlacement.BottomCenter))
}
PantrixCommandPalette(
    visible = palette,
    onDismissRequest = { palette = false },
    commands = FoldCommands,
    onRun = { palette = false },
    placeholder = "Bir komut ara",
    tagKey = "fold_palette"
)

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FoldCommands = listOf(
    PantrixCommand(key = "new", label = "Yeni dosya"),
    PantrixCommand(key = "open", label = "Dosya aç"),
    PantrixCommand(key = "save", label = "Kaydet"),
    PantrixCommand(key = "share", label = "Paylaş"),
    PantrixCommand(key = "print", label = "Yazdır"),
    PantrixCommand(key = "rename", label = "Yeniden adlandır"),
    PantrixCommand(key = "duplicate", label = "Çoğalt"),
    PantrixCommand(key = "move", label = "Taşı"),
    PantrixCommand(key = "archive", label = "Arşivle"),
    PantrixCommand(key = "delete", label = "Sil")
)

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### Kendi katmanın: rememberOverlayWindow

Kendi `Dialog`'unu ya da `Popup`'ını gösteren bir uygulama, Pantrix'in katmanlarının yerleştiği bilgiyi `rememberOverlayWindow()` ile alır: katmanın penceresi (burada kartın çerçevesi), kat yerleri ve nereden açıldığı. İki köşedeki düğmeye bas: ortadaki yazı son basılanın kat yerinin hangi yanında olduğunu, kendi katmanının hangi yarıda açılacağını söyler. "Kitap"ta sol ve sağ, "Masa"da üst ve alt; düz bir pencerede kat yeri yoktur.

`openedFrom()` ile kat yerlerinin yerleri aynı koordinatlardadır, uygulamanın penceresinin pikselleri: ikisi doğrudan karşılaştırılır.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.OverlayWindow
import com.pantrixui.foundation.adaptive.rememberOverlayWindow
import com.pantrixui.foundation.theme.PantrixTheme

val overlay = rememberOverlayWindow()
var said by remember { mutableStateOf("Bir köşedeki düğmeye bas.") }
Box(Modifier.fillMaxWidth().height(foldExampleHeight()).padding(PantrixTheme.spacing.md)) {
    PantrixButton(
        text = "Buradan",
        onClick = { said = halfOpenedFrom(overlay) },
        modifier = Modifier.align(Alignment.TopStart),
        tagKey = "fold_own_start"
    )
    PantrixText(text = said, modifier = Modifier.align(Alignment.Center), tagKey = "fold_own_said")
    PantrixButton(
        text = "Buradan",
        onClick = { said = halfOpenedFrom(overlay) },
        modifier = Modifier.align(Alignment.BottomEnd),
        tagKey = "fold_own_end"
    )
}

internal fun halfOpenedFrom(overlay: OverlayWindow): String {
    val from = overlay.openedFrom() ?: return "Henüz basılan bir yer yok."
    val fold = overlay.folds.firstOrNull { it.isSeparating }
        ?: return "Bu pencerede kat yeri yok: katman pencerenin ortasında açılır."
    val vertical = fold.orientation == FoldOrientation.Vertical
    return when {
        vertical && from.x < fold.bounds.center.x -> "Kat yerinin solundan basıldı: katman sol yarıda açılır."
        vertical -> "Kat yerinin sağından basıldı: katman sağ yarıda açılır."
        from.y < fold.bounds.center.y -> "Kat yerinin üstünden basıldı: katman üst yarıda açılır."
        else -> "Kat yerinin altından basıldı: katman alt yarıda açılır."
    }
}

@Composable
private fun foldExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.separatingFold != null) window.size.height else FOLD_EXAMPLE_HEIGHT
}

private val FOLD_EXAMPLE_HEIGHT = 280.dp
```

### İki ekranlı cihazda keepClearOfFolds

İki ekranlı bir cihaz: iki ekranın arasında, görüntüyü örten bir menteşe. Sipariş kartı cihazın genişliğinin üçte ikisidir ve menteşenin üstünden geçer. `keepClearOfFolds()` açıkken kart sol ekranda kalır, menteşenin öbür yanı boştur; kapalıyken yazının bir kısmı menteşenin altında kalır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.PantrixWindow
import com.pantrixui.foundation.adaptive.PantrixWindowFrame
import com.pantrixui.foundation.adaptive.WindowFold
import com.pantrixui.foundation.adaptive.WindowPosture
import com.pantrixui.foundation.adaptive.keepClearOfFolds
import com.pantrixui.foundation.theme.PantrixTheme

var keepClear by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixSwitchButton(
        checked = keepClear,
        onCheckedChange = { keepClear = it },
        label = "keepClearOfFolds()",
        tagKey = "fold_keep_clear"
    )
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        val width = maxWidth.coerceAtMost(DUAL_SCREEN_WIDTH)
        val density = LocalDensity.current
        val window = remember(width, density) { dualScreenWindow(DpSize(width, DUAL_SCREEN_HEIGHT), density) }
        PantrixWindowFrame(
            window = window,
            modifier = Modifier.size(width, DUAL_SCREEN_HEIGHT).border(1.dp, PantrixTheme.colors.border)
        ) {
            PantrixCard(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(width * 2 / 3)
                    .then(if (keepClear) Modifier.keepClearOfFolds() else Modifier),
                variant = CardVariant.Outlined
            ) {
                PantrixText("Sipariş 1042", style = PantrixTheme.typography.title)
                PantrixText("Üç ürün, salı günü teslim edilecek. Kargo ücreti alınmadı; fatura e-postayla geldi.")
            }
            Hinge(window)
        }
    }
}

internal fun dualScreenWindow(
    size: DpSize,
    density: Density
): PantrixWindow = with(density) {
    val left = (size.width / 2 - HINGE_WIDTH / 2).toPx()
    val right = (size.width / 2 + HINGE_WIDTH / 2).toPx()
    val hinge = WindowFold(
        bounds = Rect(left = left, top = 0f, right = right, bottom = size.height.toPx()),
        orientation = FoldOrientation.Vertical,
        isHalfOpened = false,
        isSeparating = true,
        isOccluding = true
    )
    PantrixWindow(size, posture = WindowPosture(listOf(hinge)))
}

@Composable
private fun Hinge(window: PantrixWindow) {
    val hinge = window.posture.folds.first().bounds
    val density = LocalDensity.current
    with(density) {
        Box(
            Modifier
                .offset(x = hinge.left.toDp())
                .size(width = hinge.width.toDp(), height = DUAL_SCREEN_HEIGHT)
                .background(PantrixTheme.colors.textPrimary)
        )
    }
}

private val DUAL_SCREEN_WIDTH = 520.dp

private val DUAL_SCREEN_HEIGHT = 200.dp

private val HINGE_WIDTH = 16.dp
```

## API

### OverlayWindow

`import com.pantrixui.foundation.adaptive.OverlayWindow`, `com.pantrixui:foundation` içinden

```kotlin
class OverlayWindow
```

Burada açılan bir katmanın üstünde gösterildiği pencere, kat yerinden uzak duran bir katmanın kendini yerleştirdiği bilgiyle: o pencerenin nerede olduğu, kat yerleri, ve katmanın nereden açıldığı.

Bu, uygulamanın içinde olduğu penceredir ya da içeriğin çizildiği `PantrixWindowFrame`. Bir çerçevenin içinde açılan katman çerçeveyi kendi penceresi sayar, katlanabilir bir önizlemede açılan dialog o önizlemede açıldığı gibi: scrim'i çerçeveyi örter, sheet çerçevenin kenarlarından gelir, kat yeri çerçevenin kat yeridir. Bir iskelenin bir paneline pencere diye söylediği yer böyle bir pencere değildir: bir panelde açılan dialog panelin içinde olduğu pencerenin üstünde gösterilir.

Pantrix'in kendi katmanları kendilerini buna göre yerleştirir. Uygulamanın kendi katmanı, kendisinin gösterdiği bir `Dialog` ya da `Popup`, de öyle yapar:

```kotlin
val overlay = rememberOverlayWindow()
// Asked as the dialog opens: where it was opened from, and the fold the window is in two pieces at.
val openedFrom = remember { overlay.openedFrom() }
val fold = overlay.folds.firstOrNull { it.isSeparating }
val onTheLeft = fold != null && openedFrom != null && openedFrom.x < fold.bounds.center.x
```

Yerleri uygulamanın içinde olduğu pencerenin koordinatlarında ve pikseldir: o pencereyi dolduran bir `Dialog`'un tuttuklarını yerleştirdiği yer. Uygulamanınkinin yanında kendine ait bir pencere olan bir katman, Android'de bir popup gibi, onları uygulamanın penceresinin ekrandaki yerine göre kaydırır.

Üyeleri:

- `window: PantrixWindow`: Katmanın üstünde gösterildiği pencere, katmanın gösterdiklerine söylenmesi gerektiği gibi: çerçevenin penceresi, yoksa en dıştaki `PantrixTheme`'in temsil ettiği pencere. Katmanın açıldığı bir panelin yeri değil.
- `frame: Rect?`: Çerçevenin görüldüğü yer, çizildiği gibi: uygulamanın içinde olduğu penceredeki sınırları, piksel olarak, görünen kısmına kesilmiş. Sayfası kısmen kaymış bir çerçeve hâlâ görünen kısmıdır ve üstündeki katman daha fazlasını örtmez: sayfanın barının durduğu yeri örtmez. Uygulamanın penceresinin üstünde null'dır, bir katman onu bütünüyle örter; çerçeve yerleşene kadar da null'dır.

  Çerçevenin şu anki yeridir: çerçeve kaydıkça onu izleyen bir katman yeniden sorar.
- `scale: Float`: Çerçevenin ne kadar büyük çizildiği: kendi boyutunun hangi payında çizildiği, onu küçük çizen bir katmanda 1'den az. Üstündeki katman da o kadar küçük çizilir, çerçevenin tuttukları gibi. Uygulamanın penceresinin üstünde 1'dir.
- `folds: List<WindowFold>`: Pencerenin kat yerleri, uygulamanın içinde olduğu pencerede durdukları yerde: sınırları ve boş bırakılan şeritleri piksel olarak, küçük çizilen bir çerçeveninkiler o kadar küçük. Henüz yerleşmemiş bir çerçevenin kat yeri yoktur.
- `fun openedFrom(): Offset?`: Şimdi açılan bir katmanın nereden açıldığı, uygulamanın içinde olduğu pencerede ve piksel olarak: penceredeki son basışın düştüğü yer, ondan sonra bir tuşa basıldıysa odağı tutan denetimin ortası. İkisi de bilinmiyorsa null'dır, hiçbir şeye basılmadan açılan bir katmanda olduğu gibi.

  Katman açılırken bir kez sorulur: katmanın içindeki bir basış bir sonrakinin açıldığı yerdir. Pencerenin katmanlarının köklerinde duyulur: en dıştaki `PantrixTheme`'inkinde, ve `pantrixTransientsRoot` taşıyan bir katmanın düğümünde.

### rememberOverlayWindow

`import com.pantrixui.foundation.adaptive.rememberOverlayWindow`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberOverlayWindow(): OverlayWindow
```

Burada açılan bir katmanın üstünde gösterildiği pencere: içeriğin çizildiği `PantrixWindowFrame`, ya da uygulamanın içinde olduğu pencere.

### Modifier.keepClearOfFolds

`import com.pantrixui.foundation.adaptive.keepClearOfFolds`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.keepClearOfFolds(): Modifier
```

Bu düğümün tuttuklarını, düğümü kesen ve pencerenin bir şeridini örten bir menteşeden uzak tutar: menteşenin düğüme daha az yer kalan yanı boş bırakılır, düğümün tuttukları öbür yana yerleşir.

İki ekranlı bir cihazın iki ekranı arasında böyle bir menteşe vardır (`WindowFold.isOccluding`), altına çizilen görünmez. Onun biraz ötesine uzanan bir düğüm, bir ekrandan biraz geniş bir liste ya da bütün bir kenar boyunca bir çubuk, tuttuklarını çoğunun durduğu ekrana koyar. Hiçbir şeyi örtmeyen bir kat yerinden, nasıl tutulursa tutulsun tek ekran olan katlanabilirinkinden, uzak durulmaz: üstüne çizilen görünür.

```kotlin
Box(Modifier.fillMaxSize()) {
    Inbox()
    // A bar along the whole bottom edge keeps to one screen of the two.
    Toolbar(Modifier.align(Alignment.BottomCenter).fillMaxWidth().keepClearOfFolds())
}
```

Menteşe bir düğümün tam ortasından geçiyorsa ondan uzak durmak düğümü yarıya indirir: orada `PantrixTwoPane` düğümün tuttuklarını iki yanına dizer. Burada düğüm bir yanda kalır, iki yanın yeri eşitse başlangıç yanında.

Düğüm en son yerleştiği yere göre ölçülür: yer değiştirip yeniden yerleşince, menteşenin üstüne ya da dışına, yeniden ölçülür. Uzak durduğu menteşenin kestiği eksende, içindekilerin boyutu ne olursa olsun, kendisine verilen yerin tamamını alır: yoksa boş bırakılan yan onu her geçişte büyütür ve menteşenin daha da üstüne taşırdı. O eksende sınırsız bir yerde, kayan bir satırdaki gibi, hiçbir şeyden uzak durmaz.

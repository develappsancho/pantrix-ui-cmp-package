# Masa duruşu

Bakılan bir içerik ve ona dokunulan denetimler, katlanabilirin nasıl tutulduğuna göre: video ve oynatıcının düğmeleri, görüntülü görüşme ve düğmeleri, kameranın görüntüsü ve deklanşörü.

`PantrixTabletopLayout` iki parça alır: `content` ve `controls`. Katlanabilir masaya yarı açık konunca (menteşe yatay) içerik kat yerinin üstündeki yarıyı, denetimler alttaki yarıyı doldurur: bakılan yukarıda, eller aşağıda. Kitap gibi tutulunca ikisi kat yerinin iki yanında durur. Katlanmayan bir ekranda denetimler içeriğin altında ya da üstündedir.

- `PantrixTabletopLayout` (`com.pantrixui.components.container.tabletop`, `com.pantrixui:components`): İçerik ve kontrolleri: masaya konmuş bir katlanmanın yarılarında, düz durunca kontroller altında ya da üstünde. Anahtar sözcükler: katlanabilir, masa duruşu, yarı katlı, esnek kip, dizüstü duruşu.

## Özellikler

- **Düzken.** `flatControls` varsayılanı `Below`: denetimler kendi yüksekliğinde altta, içerik kalan yeri alır. `Overlay`: içerik bütün yeri alır, denetimler onun altına, üstüne biner.
- **Masada.** İçerik kat yerinin üstündeki yarıyı, denetimler alttaki yarıyı doldurur; kat yerinin şeridi boş kalır. Denetimler alt yarının tamamını alır, kendilerini nasıl dizeceklerine kendileri karar verir.
- **Kitap gibi.** İçerik kat yerinin başında, denetimler öbür yanında.
- **Panellere söylenen.** İki parça da `TabletopScope` içinde kurulur: `arrangement` `Flat`, `Tabletop` ya da `Book`'tur. Denetimler masada daha büyük çizilmeyi seçebilir.
- **Kendi yerine bakar.** Kat yeri düzenin kendi yerini kesmiyorsa düzen düz davranır.
- **Durum korunur.** Duruş değişince iki parça kompozisyonda yerinde kalır, bir anda ve hareketsiz: video kaldığı yerden sürer.
- **Her parça bir pencere.** Parçanın içindeki her şey parçanın yerini pencere olarak okur.
- **Okuma yönü.** Sağdan sola bir dilde kitap gibi tutulunca içerik kat yerinin sağındadır.

## Kullanım

### A video and its player

```kotlin
PantrixTabletopLayout(
    content = { Video(player) },
    controls = { PlayerControls(player, large = arrangement == TabletopArrangement.Tabletop) },
    modifier = Modifier.fillMaxSize()
)
```

### Controls over the video while the screen is flat

```kotlin
PantrixTabletopLayout(
    content = { Video(player) },
    controls = { PlayerControls(player, onVideo = arrangement == TabletopArrangement.Flat) },
    modifier = Modifier.fillMaxSize(),
    flatControls = TabletopControls.Overlay
)
```

## Örnekler

### Video oynatıcı

Bir video ve oynatıcısı. Düzken düğmeler videonun altında, kendi yüksekliklerinde durur.

Karttaki pencere seçicisinden "Masa"yı seç: video kat yerinin üstüne, düğmeler altına geçer ve alt yarıyı alır; orada `arrangement == Tabletop` olduğu için düğmeler büyür ve videonun adı da yazılır. Oynat'a bas ve pencereyi değiştir: video kaldığı yerden sürer, iki parça da kompozisyondan çıkmaz.

Masa duruşunda kat yeri 951dp'lik pencerenin ortasındadır: örnek orada pencere kadar uzundur ki kat yeri onu kessin. Bir ekranda düzen zaten `Modifier.fillMaxSize()` ile bütün pencereyi alır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopArrangement
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.math.roundToInt

var playing by remember { mutableStateOf(false) }
var position by remember { mutableFloatStateOf(VIDEO_START) }
Playing(playing) { position = (position + VIDEO_STEP) % 1f }
PantrixTabletopLayout(
    content = { VideoPane(playing = playing, position = position, tagKey = "player") },
    controls = {
        PlayerControls(
            playing = playing,
            position = position,
            onPlay = { playing = !playing },
            // Masada alt yarının tamamı denetimlerindir: düğmeler büyür, videonun adı da yazılır.
            large = arrangement == TabletopArrangement.Tabletop,
            tagKey = "player"
        )
    },
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    tagKey = "player"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun Playing(
    playing: Boolean,
    step: () -> Unit
) {
    LaunchedEffect(playing) {
        while (playing) {
            delay(VIDEO_TICK_MILLIS)
            step()
        }
    }
}

@Composable
private fun VideoPane(
    playing: Boolean,
    position: Float,
    tagKey: String
) {
    Box(modifier = Modifier.fillMaxSize().background(VIDEO_GROUND), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (!playing) PantrixIcon(PantrixIcons.Play, contentDescription = null, size = 48.dp, tint = Color.White)
            PantrixText(text = timeOf(position), color = Color.White, tagKey = "${tagKey}_time")
        }
    }
}

@Composable
private fun PlayerControls(
    playing: Boolean,
    position: Float,
    onPlay: () -> Unit,
    large: Boolean,
    tagKey: String,
    onVideo: Boolean = false
) {
    val spacing = PantrixTheme.spacing
    val ink = if (onVideo) Color.White else PantrixTheme.colors.textPrimary
    Column(
        modifier = Modifier.fillMaxWidth().padding(spacing.md),
        verticalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterVertically)
    ) {
        if (large) PantrixText(text = "Boğaz'da bir gün", style = PantrixTheme.typography.headline, color = ink)
        Progress(position = position, ink = ink)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val size = if (large) ButtonSize.Large else ButtonSize.Medium
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronBack,
                contentDescription = "Geri sar",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_back"
            )
            PantrixIconButton(
                imageVector = if (playing) PantrixIcons.Pause else PantrixIcons.Play,
                contentDescription = if (playing) "Duraklat" else "Oynat",
                onClick = onPlay,
                variant = ButtonVariant.Solid,
                size = size,
                tagKey = "${tagKey}_play"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronForward,
                contentDescription = "İleri sar",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_forward"
            )
        }
    }
}

private const val VIDEO_START = 0.35f

private const val VIDEO_STEP = 0.004f

@Composable
private fun Progress(
    position: Float,
    ink: Color
) {
    val primary = PantrixTheme.colors.primary.color
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier
                .weight(1f)
                .height(PROGRESS_HEIGHT)
                .drawBehind {
                    val corner = CornerRadius(size.height / 2)
                    drawRoundRect(color = ink.copy(alpha = TRACK_ALPHA), cornerRadius = corner)
                    val played = Size(size.width * position, size.height)
                    drawRoundRect(color = primary, size = played, cornerRadius = corner)
                }
        )
        // Dakikalar soldan sağa yazılır, sağdan sola bir dilde de.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                text = "${timeOf(position)} / ${timeOf(1f)}",
                style = PantrixTheme.typography.footnote,
                color = ink
            )
        }
    }
}

private fun timeOf(position: Float): String {
    val seconds = (position * VIDEO_SECONDS).roundToInt()
    return "${seconds / 60}:${(seconds % 60).toString().padStart(2, '0')}"
}

private val VIDEO_GROUND = Color(0xFF1E2A3A)

private const val VIDEO_TICK_MILLIS = 250L

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp

private val PROGRESS_HEIGHT = 4.dp

private const val TRACK_ALPHA = 0.3f

private const val VIDEO_SECONDS = 240
```

### Denetimler videonun üstünde

Aynı oynatıcı, `flatControls = TabletopControls.Overlay` ile: düzken video bütün yeri alır, düğmeler onun altına, üstüne biner. Masada yine kat yerinin altına geçerler. Düğmeler videonun üstündeyken (`arrangement == Flat`) okunabilsinler diye yarı saydam koyu bir zemin çizerler.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopArrangement
import com.pantrixui.components.container.tabletop.TabletopControls
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlin.math.roundToInt

var playing by remember { mutableStateOf(false) }
var position by remember { mutableFloatStateOf(VIDEO_START) }
Playing(playing) { position = (position + VIDEO_STEP) % 1f }
PantrixTabletopLayout(
    content = { VideoPane(playing = playing, position = position, tagKey = "overlay") },
    controls = {
        val onVideo = arrangement == TabletopArrangement.Flat
        Box(modifier = if (onVideo) Modifier.background(SCRIM_ON_VIDEO) else Modifier) {
            PlayerControls(
                playing = playing,
                position = position,
                onPlay = { playing = !playing },
                large = arrangement == TabletopArrangement.Tabletop,
                onVideo = onVideo,
                tagKey = "overlay"
            )
        }
    },
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    flatControls = TabletopControls.Overlay,
    tagKey = "overlay"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun Playing(
    playing: Boolean,
    step: () -> Unit
) {
    LaunchedEffect(playing) {
        while (playing) {
            delay(VIDEO_TICK_MILLIS)
            step()
        }
    }
}

@Composable
private fun VideoPane(
    playing: Boolean,
    position: Float,
    tagKey: String
) {
    Box(modifier = Modifier.fillMaxSize().background(VIDEO_GROUND), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (!playing) PantrixIcon(PantrixIcons.Play, contentDescription = null, size = 48.dp, tint = Color.White)
            PantrixText(text = timeOf(position), color = Color.White, tagKey = "${tagKey}_time")
        }
    }
}

@Composable
private fun PlayerControls(
    playing: Boolean,
    position: Float,
    onPlay: () -> Unit,
    large: Boolean,
    tagKey: String,
    onVideo: Boolean = false
) {
    val spacing = PantrixTheme.spacing
    val ink = if (onVideo) Color.White else PantrixTheme.colors.textPrimary
    Column(
        modifier = Modifier.fillMaxWidth().padding(spacing.md),
        verticalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterVertically)
    ) {
        if (large) PantrixText(text = "Boğaz'da bir gün", style = PantrixTheme.typography.headline, color = ink)
        Progress(position = position, ink = ink)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(spacing.sm, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val size = if (large) ButtonSize.Large else ButtonSize.Medium
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronBack,
                contentDescription = "Geri sar",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_back"
            )
            PantrixIconButton(
                imageVector = if (playing) PantrixIcons.Pause else PantrixIcons.Play,
                contentDescription = if (playing) "Duraklat" else "Oynat",
                onClick = onPlay,
                variant = ButtonVariant.Solid,
                size = size,
                tagKey = "${tagKey}_play"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.ChevronForward,
                contentDescription = "İleri sar",
                onClick = {},
                size = size,
                tagKey = "${tagKey}_forward"
            )
        }
    }
}

private val SCRIM_ON_VIDEO = Color(0x99000000)

private const val VIDEO_START = 0.35f

private const val VIDEO_STEP = 0.004f

@Composable
private fun Progress(
    position: Float,
    ink: Color
) {
    val primary = PantrixTheme.colors.primary.color
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Box(
            modifier = Modifier
                .weight(1f)
                .height(PROGRESS_HEIGHT)
                .drawBehind {
                    val corner = CornerRadius(size.height / 2)
                    drawRoundRect(color = ink.copy(alpha = TRACK_ALPHA), cornerRadius = corner)
                    val played = Size(size.width * position, size.height)
                    drawRoundRect(color = primary, size = played, cornerRadius = corner)
                }
        )
        // Dakikalar soldan sağa yazılır, sağdan sola bir dilde de.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                text = "${timeOf(position)} / ${timeOf(1f)}",
                style = PantrixTheme.typography.footnote,
                color = ink
            )
        }
    }
}

private fun timeOf(position: Float): String {
    val seconds = (position * VIDEO_SECONDS).roundToInt()
    return "${seconds / 60}:${(seconds % 60).toString().padStart(2, '0')}"
}

private val VIDEO_GROUND = Color(0xFF1E2A3A)

private const val VIDEO_TICK_MILLIS = 250L

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp

private val PROGRESS_HEIGHT = 4.dp

private const val TRACK_ALPHA = 0.3f

private const val VIDEO_SECONDS = 240
```

### Görüntülü görüşme

Görüntülü bir görüşme: kişiler üstte, düğmeler altta. Mikrofon ve kameranın durumu örnekte tutulur; kişilerin kutuları onu okur.

"Masa"da kişiler kat yerinin üstünde kalır, düğmeler altta yan yana büyür: telefon masada dururken eller oradadır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopArrangement
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var muted by remember { mutableStateOf(false) }
var cameraOff by remember { mutableStateOf(false) }
PantrixTabletopLayout(
    content = { CallPeople(muted = muted, cameraOff = cameraOff) },
    controls = {
        val size = if (arrangement == TabletopArrangement.Tabletop) ButtonSize.Large else ButtonSize.Medium
        Row(
            modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixButton(
                text = if (muted) "Sesi aç" else "Sessize al",
                onClick = { muted = !muted },
                variant = ButtonVariant.Outline,
                size = size,
                tagKey = "call_mute"
            )
            PantrixButton(
                text = if (cameraOff) "Kamerayı aç" else "Kamerayı kapat",
                onClick = { cameraOff = !cameraOff },
                variant = ButtonVariant.Outline,
                size = size,
                tagKey = "call_camera"
            )
            PantrixButton(text = "Bitir", onClick = {}, size = size, tagKey = "call_end")
        }
    },
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    tagKey = "call"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun CallPeople(
    muted: Boolean,
    cameraOff: Boolean
) {
    Row(
        modifier = Modifier.fillMaxSize().padding(PantrixTheme.spacing.md),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        CALL_PEOPLE.forEachIndexed { index, person ->
            val you = index == 0
            PersonTile(
                name = if (you) "Sen" else person.first,
                initials = person.second,
                note = if (you && muted) "Sessizde" else null,
                camera = !(you && cameraOff),
                modifier = Modifier.weight(1f).fillMaxSize()
            )
        }
    }
}

@Composable
private fun PersonTile(
    name: String,
    initials: String,
    note: String?,
    camera: Boolean,
    modifier: Modifier
) {
    PantrixSurface(
        modifier = modifier,
        color = if (camera) VIDEO_GROUND else PantrixTheme.colors.neutral.container
    ) {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
        ) {
            PantrixAvatar(contentDescription = null, initials = initials)
            PantrixText(text = name, color = if (camera) Color.White else Color.Unspecified)
            if (note != null) {
                PantrixText(
                    text = note,
                    style = PantrixTheme.typography.footnote,
                    color = if (camera) Color.White else PantrixTheme.colors.textSecondary
                )
            }
        }
    }
}

private val CALL_PEOPLE = listOf("Sen" to "SN", "Deniz Aksoy" to "DA", "Can Öztürk" to "CÖ")

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp

private val VIDEO_GROUND = Color(0xFF1E2A3A)
```

### Katlanan cihazda: parçalar ölçülerini yazar

Her parça kendi ölçüsünü ve pencere sınıfını yazar. "Kitap"ta 951dp'lik pencere kat yerinde ikiye ayrılır: içerik solda, denetimler sağda. "Masa"da içerik kat yerinin üstünde, denetimler altında; ikisi de 669dp genişliğindedir. Düz bir pencerede denetimler kendi yüksekliğindedir.

```kotlin
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.tabletop.PantrixTabletopLayout
import com.pantrixui.components.container.tabletop.TabletopScope
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

// İki parça da bir `TabletopScope` içinde kurulur: `arrangement` düzenin şu anki hâlini söyler.
val controls: @Composable TabletopScope.() -> Unit = {
    MeasuredPart(name = "Denetimler", tall = false, tagKey = "measured_controls")
}
PantrixTabletopLayout(
    content = { MeasuredPart(name = "İçerik", tall = true, tagKey = "measured_content") },
    controls = controls,
    modifier = Modifier.fillMaxWidth().height(tabletopExampleHeight()),
    tagKey = "measured"
)

@Composable
private fun tabletopExampleHeight(): Dp {
    val window = PantrixTheme.window
    return if (window.posture.isTabletop) window.size.height else TABLETOP_EXAMPLE_HEIGHT
}

@Composable
private fun MeasuredPart(
    name: String,
    tall: Boolean,
    tagKey: String
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    val room = if (tall) Modifier.fillMaxSize() else Modifier.fillMaxWidth()
    PartSurface(modifier = room.onSizeChanged { size = it }) {
        // Ölçüler soldan sağa yazılır: sağdan sola bir paragrafta genişlik ile yükseklik yer değiştirmiş okunurdu.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                // Parça kendi penceresidir: sınıfı parçanın genişliğine göredir.
                text = "$name: $words dp · ${PantrixTheme.window.widthClass.name}",
                modifier = Modifier.align(Alignment.Center).padding(PantrixTheme.spacing.lg),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                tagKey = tagKey
            )
        }
    }
}

@Composable
private fun PartSurface(
    modifier: Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier, border = PantrixTheme.colors.border) { content() }
}

private val TABLETOP_EXAMPLE_HEIGHT = 420.dp
```

## API

### PantrixTabletopLayout

`import com.pantrixui.components.container.tabletop.PantrixTabletopLayout`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTabletopLayout(
    content: @Composable TabletopScope.() -> Unit,
    controls: @Composable TabletopScope.() -> Unit,
    modifier: Modifier = Modifier,
    flatControls: TabletopControls = TabletopControls.Below,
    tagKey: String? = null
)
```

Bakılan bir içerik ve dokunulan denetimler, bir katlanabilirin nasıl tutulduğuna göre yerleştirilir: bir masada, menteşe yatay ve yarı açıkken içerik kat yerinin üstündeki yarıyı, denetimler ellerin olduğu alttaki yarıyı doldurur; kitap gibi tutulunca ikisi kat yerinin iki yanında durur; katlanmayan bir ekranda denetimler, `flatControls`'ın dediği gibi içeriğin altında ya da üstündedir. Bir video ve oynatıcısının düğmeleri, görüntülü bir görüşme ve düğmeleri, bir kameranın görüntüsü ve deklanşörü.

- **Kendi yeri.** Düzen kat yerini pencerede değil, kendi yerini kestiği yerde arar: tamamen kat yerinin bir yanında kalan bir düzen düz yerleşir.

- **Kat yerinin şeridi.** Masada ve kitap gibi tutulunca kat yerinin boş bıraktığı şeride hiçbir şey konmaz; yerin ortasındaki bir şerit iki yarıyı eşit bırakır.

- **Korunan durum.** Duruş değişirken iki parça kompozisyonda yerinde kalır, bir anda ve hareketsiz: bir video oynamayı sürdürür, denetimlerin hatırladığı korunur.

- **Her parça bir pencere.** Bir parçanın içindekine o parçanın yeri pencere olarak söylenir: `PantrixTheme.window`, sınıfları ve `PantrixTheme.layout` parçaya göre cevap verir. Duruş pencerenin kalır.

- **Ekran okuyucu.** Her parça bir grup olarak okunur: önce içerik, sonra denetimler.

- **Okuma yönü.** Kitap gibi tutulunca içerik kat yerinin başındadır: sağdan sola okunan bir dilde sağında.

- **Otomasyon.** Düzenin etiketi `TabletopLayout_<tagKey>`, parçalarınki `TabletopContent_<tagKey>` ve `TabletopControls_<tagKey>`'dir.

Düzen kendisine verilen yeri alır; bu yer iki yönde de sınırlı olmalıdır: bir ekranda `Modifier.fillMaxSize()`.

Parametreler:

- `content: @Composable TabletopScope.() -> Unit`: bakılan: bir video, bir görüşmenin kişileri, bir kameranın görüntüsü.
- `controls: @Composable TabletopScope.() -> Unit`: dokunulan: bir oynatıcının düğmeleri ve ilerleyişi, bir görüşmenin düğmeleri, bir deklanşör.
- `modifier: Modifier`: iki parçanın yeri.
- `flatControls: TabletopControls`: hiçbir kat yeri yeri bölmüyorken denetimlerin nerede olduğu.
- `tagKey: String?`: düzenin otomasyon etiketlerinin anahtarı.

### TabletopScope

`import com.pantrixui.components.container.tabletop.TabletopScope`, `com.pantrixui:components` içinden

```kotlin
interface TabletopScope
```

Bir `PantrixTabletopLayout`'un iki parçasına içinde durdukları düzen hakkında söylenen.

Üyeleri:

- `arrangement: TabletopArrangement`: Düzenin parçalarını nasıl yerleştirdiği: ekranın yarısı onların olduğu için masada daha büyük çizilen denetimler, ya da denetimlerin üstünde durduğunu bilen bir video.

### TabletopArrangement

`import com.pantrixui.components.container.tabletop.TabletopArrangement`, `com.pantrixui:components` içinden

```kotlin
enum class TabletopArrangement
```

Bir `PantrixTabletopLayout`'un, yerinin kat yeri neyse ona göre iki parçasını nasıl yerleştirdiği.

Değerleri:

- `Flat`: Hiçbir kat yeri yeri bölmüyor: denetimler içeriğin altında ya da üstünde.
- `Tabletop`: Masaya konmuş bir katlanabilir: içerik kat yerinin üstündeki yarıyı, denetimler alttaki yarıyı doldurur.
- `Book`: Kitap gibi tutulan bir katlanabilir: içerik kat yerinin başında, denetimler öbür yanında.

### TabletopControls

`import com.pantrixui.components.container.tabletop.TabletopControls`, `com.pantrixui:components` içinden

```kotlin
enum class TabletopControls
```

Hiçbir kat yeri yerini bölmüyorken bir `PantrixTabletopLayout`'un denetimlerinin nerede olduğu.

Değerleri:

- `Below`: İçeriğin altında, kendi yüksekliklerinde: içerik yerin geri kalanını alır.
- `Overlay`: İçeriğin üstünde, altında, kendi yüksekliklerinde: içerik bir videonunki gibi bütün yeri alır.

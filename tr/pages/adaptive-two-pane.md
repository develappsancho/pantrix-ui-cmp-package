# İki panel

İki paneli bir arada yan yana ya da alt alta dizen `PantrixTwoPane`, ve bir düzenin kaç panel göstereceğini, katlanan bir cihazın kat yerinin nerede olduğunu söyleyen yardımcılar.

Geniş bir pencerede yan yana duran çoğu zaman iki şeydir: bir liste ve seçileni, bir belge ve özellikleri, bir video ve kontrolleri. `PantrixTwoPane` ikisini aynı yere dizer: birinciye verilen payı ya da genişliği verir, aralarına düzenin sütun arasını koyar. Katlanan bir cihazda kat yeri yeri ikiye ayırıyorsa paneller tam orada buluşur: biri kat yerinin bir yanında, öteki öbür yanında; hiçbir şey kat yerinin üstüne düşmez.

- `PantrixTwoPane` (`com.pantrixui.components.container.twopane`, `com.pantrixui:components`): Yan yana ya da üst üste iki bölme; pencerenin bir katlanması yeri ikiye bölüyorsa orada buluşurlar. Anahtar sözcükler: bölünmüş görünüm, çift bölme, katlanabilir, yan yana, bölünmüş ekran.

## Özellikler

- **Yan yana ya da alt alta.** `TwoPaneOrientation.SideBySide` birinci paneli başa, ikinciyi sona koyar; `TwoPaneOrientation.Stacked` birinciyi üste, ikinciyi alta.
- **Pay ya da sabit boyut.** `PaneSize.Fraction(0.4f)` birinciye yerin %40'ını, `PaneSize.Fixed(320.dp)` 320 dp verir; ikinci geri kalanı alır. Aradaki boşluk `gap`'tir, varsayılanı `PantrixTheme.layout.gutter`.
- **Kat yeride buluşur.** Kitap gibi tutulan bir katlanabilirde dikey kat yeri yan yana iki paneli, masaya konunca yatay kat yeri alt alta iki paneli ayırır. O zaman pay da boşluk da geçmez: bölünme kat yerindedir, aradaki boşluk sistemin kat yerinin çevresinde boş istediği şerittir, `WindowFold.clearance`. iPhone'da şerit kat yerinin iki yanında 20 pt'dir; Android ve tarayıcılar şerit istemez.
- **Okuma yönü.** Sağdan sola okunan bir dilde yan yana iki panelin birincisi sağdadır. Kat yeri ekranda olduğu yerde kalır; birinci panel onun baş tarafındadır.
- **Kaç panel.** `PantrixTheme.window.paneCount()` pencerenin kaç panele yer verdiğini söyler: `Compact` ve `Medium` bir, `Expanded` iki, `Large`'dan itibaren üç; kitap gibi tutulan bir katlanabilirde her genişlikte en az iki. `PantrixTwoPane` hep ikisini çizer; birini ne zaman göstereceğine düzen karar verir.
- **Kendi düzenin.** `rememberFoldsInNode()` kat yerlerini bir düğümün kendi koordinatlarında verir: kat yerine göre dizilen kendi düzenini yazan, onun `modifier`'ını düğüme koyar ve ölçerken `folds`'u okur.
- **Önizleme ve test.** `PantrixWindowFrame` bir kutuyu kendi başına bir pencere yapar: içindekilere verilen pencereyi söyler, kat yerini o kutunun köşesinden ölçer. Bu sayfadaki kartların "Kitap" ve "Masa" pencereleri böyle çizilir.
- **Nereden okunur.** Kat yeri Android'de WindowManager'dan, bunu bildiren tarayıcılarda ekranın parçalarından, iOS 27.1'den itibaren UIKit'ten okunur. Masaüstünde ve katlanmayan cihazlarda pencere düzdür; paneller payla bölünür.

## Kullanım

### A list beside what is chosen in it

```kotlin
PantrixTwoPane(
    first = { Inbox(onOpen = { opened = it }) },
    second = { Message(opened) },
    modifier = Modifier.fillMaxSize(),
    firstSize = PaneSize.Fixed(360.dp)
)
```

### On a table: the photo above the fold, the tools below

```kotlin
PantrixTwoPane(
    first = { Photo(photo) },
    second = { EditingTools(photo) },
    modifier = Modifier.fillMaxSize(),
    orientation = TwoPaneOrientation.Stacked,
    firstSize = PaneSize.Fraction(0.6f)
)
```

## Örnekler

### Liste ve açılan, yan yana

Bir gelen kutusu ve açılan ileti, yan yana: liste 300 dp, ileti geri kalanı. Bir iletiye bas: yanındaki panel onu gösterir.

Karttaki pencere seçicisinden "Kitap"ı seç: kat yeri ortadadır ve paneller tam orada ayrılır. Liste artık 300 dp değil, kat yerine kadardır; aradaki boşluk kat yerinin iki yanındaki 20'şer dp'lik şerittir. Örneğin üstündeki soluk şerit ve çizgi kat yerinin yeridir. Öteki pencerelerde liste 300 dp'dir ve aralarında düzenin sütun arası durur. "Dar"da iletiye yer kalmaz: bir sonraki örnek orada tek panel gösterir.

```kotlin
import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var opened by rememberSaveable { mutableStateOf(MAILS.first().id) }
val scroll = rememberScrollState()
PantrixTwoPane(
    first = { Inbox(opened = opened, onOpen = { opened = it }, scroll = scroll, tagKey = "inbox") },
    second = { Message(mail = MAILS.first { it.id == opened }) },
    modifier = Modifier.fillMaxWidth().height(INBOX_HEIGHT),
    firstSize = PaneSize.Fixed(300.dp),
    tagKey = "inbox"
)

@Composable
private fun Inbox(
    opened: String?,
    onOpen: (String) -> Unit,
    scroll: ScrollState,
    tagKey: String
) {
    val colors = PantrixTheme.colors
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = colors.border) {
        Column(modifier = Modifier.verticalScroll(scroll)) {
            MAILS.forEachIndexed { index, mail ->
                if (index > 0) PantrixHorizontalDivider()
                val selected = mail.id == opened
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .selectable(selected = selected, onClick = { onOpen(mail.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                        .padding(PantrixTheme.spacing.md),
                    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    PantrixText(text = mail.from, style = PantrixTheme.typography.callout, color = text, maxLines = 1)
                    PantrixText(
                        text = mail.subject,
                        style = PantrixTheme.typography.footnote,
                        color = if (selected) text else colors.textSecondary,
                        maxLines = 1,
                        tagKey = "${tagKey}_mail_${mail.id}"
                    )
                }
            }
        }
    }
}

@Composable
private fun Message(
    mail: Mail,
    onBack: (() -> Unit)? = null
) {
    val spacing = PantrixTheme.spacing
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
            verticalArrangement = Arrangement.spacedBy(spacing.sm)
        ) {
            if (onBack != null) {
                PantrixButton(
                    text = "Gelen kutusu",
                    onClick = onBack,
                    variant = ButtonVariant.Text,
                    leadingIcon = { PantrixIcon(PantrixIcons.ArrowBack, contentDescription = null) },
                    tagKey = "back"
                )
            }
            PantrixText(text = mail.subject, style = PantrixTheme.typography.headline, tagKey = "message_subject")
            PantrixText(
                text = mail.from,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixText(text = mail.body)
        }
    }
}

private val MAILS = listOf(
    Mail("1", "Elif Kaya", "Yarınki toplantı", "Toplantıyı saat 10'a aldım. Sunumu bir gün önce paylaşır mısın?"),
    Mail("2", "Can Demir", "Sürüm notları", "1.4 sürümünün notlarını ekledim. Eksik gördüğün bir şey olursa yaz."),
    Mail("3", "Ayşe Yılmaz", "Tasarım incelemesi", "Yeni ayarlar ekranının taslakları hazır; perşembe bakalım mı?"),
    Mail("4", "Mert Şahin", "Fatura", "Ekim faturası ektedir. Ödeme ayın 30'una kadar yapılabilir."),
    Mail("5", "Zeynep Arslan", "Test sonuçları", "Gece çalışan testlerin hepsi geçti; tablet ekranında bir uyarı var."),
    Mail("6", "Deniz Aydın", "Öğle yemeği", "Cuma günü ekipçe dışarıda yiyelim mi? Yer önerisi olan yazsın."),
    Mail("7", "Burak Çelik", "Erişilebilirlik", "Ekran okuyucuyla bütün akışı denedim; iki düğmenin adı eksik."),
    Mail("8", "Selin Koç", "Yeni katılan", "Pazartesi ekibe yeni bir geliştirici katılıyor; ilk haftayı planlayalım."),
    Mail("9", "Emre Öztürk", "Sunucu bakımı", "Cumartesi gece 02:00 ile 04:00 arasında sunucular bakımda olacak."),
    Mail("10", "Ece Polat", "Kullanıcı görüşmeleri", "Bu hafta beş kullanıcıyla konuştum; notlar paylaşılan klasörde.")
)

private val INBOX_HEIGHT = 420.dp

private class Mail(
    val id: String,
    val from: String,
    val subject: String,
    val body: String
)
```

### Bir panel ya da iki: paneCount

Kaç panel gösterileceğini pencere söyler: `PantrixTheme.window.paneCount()`. İki panele yer varsa liste ve ileti yan yana durur. Yoksa biri görünür: önce liste, bir iletiye basınca ileti, "Gelen kutusu" düğmesiyle yine liste.

Panel sayısı değişince liste başka bir yerden çağrılır ve yeniden kurulur. Kaydırma yeri yine kaybolmaz: onu liste değil örnek hatırlar, `rememberScrollState()`, ve listeye verir. Listeyi kaydır, bir iletiyi aç, sonra karttaki pencere seçicisinden "Dar" ile "Geniş" arasında geç: açılan ileti de listenin yeri de kalır.

"Dar" ve "Orta" bir panel, "Kısa", "Geniş" ve "Kitap" iki panel yazar. "Kitap"ın 951 dp'si zaten `Expanded`'dır; daha dar bir katlanabilir de kitap gibi tutulunca iki panel alır. "Masa"da kat yeri yataydır ve yan yana iki paneli ayırmaz: 669 dp'lik pencere `Medium`'dur ve tek panel gösterir.

```kotlin
import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.paneCount
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var opened by rememberSaveable { mutableStateOf<String?>(null) }
val scroll = rememberScrollState()
val panes = PantrixTheme.window.paneCount()
val mail = MAILS.firstOrNull { it.id == opened }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(
        text = "paneCount(): $panes",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "pane_count"
    )
    Box(modifier = Modifier.fillMaxWidth().height(INBOX_HEIGHT)) {
        when {
            panes >= 2 -> {
                PantrixTwoPane(
                    first = { Inbox(opened = opened, onOpen = { opened = it }, scroll = scroll, tagKey = "count") },
                    second = { if (mail != null) Message(mail = mail) else NothingOpened() },
                    modifier = Modifier.fillMaxSize(),
                    firstSize = PaneSize.Fixed(300.dp),
                    tagKey = "count"
                )
            }

            // Tek panelde açık bir ileti listenin yerini alır; liste kapanınca da kaydırma yeri durur.
            mail != null -> {
                Message(mail = mail, onBack = { opened = null })
            }

            else -> {
                Inbox(opened = null, onOpen = { opened = it }, scroll = scroll, tagKey = "count")
            }
        }
    }
}

@Composable
private fun Inbox(
    opened: String?,
    onOpen: (String) -> Unit,
    scroll: ScrollState,
    tagKey: String
) {
    val colors = PantrixTheme.colors
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = colors.border) {
        Column(modifier = Modifier.verticalScroll(scroll)) {
            MAILS.forEachIndexed { index, mail ->
                if (index > 0) PantrixHorizontalDivider()
                val selected = mail.id == opened
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .selectable(selected = selected, onClick = { onOpen(mail.id) })
                        .background(if (selected) colors.primary.container else Color.Transparent)
                        .padding(PantrixTheme.spacing.md),
                    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
                ) {
                    val text = if (selected) colors.primary.onContainer else Color.Unspecified
                    PantrixText(text = mail.from, style = PantrixTheme.typography.callout, color = text, maxLines = 1)
                    PantrixText(
                        text = mail.subject,
                        style = PantrixTheme.typography.footnote,
                        color = if (selected) text else colors.textSecondary,
                        maxLines = 1,
                        tagKey = "${tagKey}_mail_${mail.id}"
                    )
                }
            }
        }
    }
}

@Composable
private fun Message(
    mail: Mail,
    onBack: (() -> Unit)? = null
) {
    val spacing = PantrixTheme.spacing
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
            verticalArrangement = Arrangement.spacedBy(spacing.sm)
        ) {
            if (onBack != null) {
                PantrixButton(
                    text = "Gelen kutusu",
                    onClick = onBack,
                    variant = ButtonVariant.Text,
                    leadingIcon = { PantrixIcon(PantrixIcons.ArrowBack, contentDescription = null) },
                    tagKey = "back"
                )
            }
            PantrixText(text = mail.subject, style = PantrixTheme.typography.headline, tagKey = "message_subject")
            PantrixText(
                text = mail.from,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
            PantrixText(text = mail.body)
        }
    }
}

@Composable
private fun NothingOpened() {
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        PantrixText(
            text = "Okumak için bir ileti seç",
            modifier = Modifier.align(Alignment.Center),
            color = PantrixTheme.colors.textSecondary,
            tagKey = "nothing_opened"
        )
    }
}

private val MAILS = listOf(
    Mail("1", "Elif Kaya", "Yarınki toplantı", "Toplantıyı saat 10'a aldım. Sunumu bir gün önce paylaşır mısın?"),
    Mail("2", "Can Demir", "Sürüm notları", "1.4 sürümünün notlarını ekledim. Eksik gördüğün bir şey olursa yaz."),
    Mail("3", "Ayşe Yılmaz", "Tasarım incelemesi", "Yeni ayarlar ekranının taslakları hazır; perşembe bakalım mı?"),
    Mail("4", "Mert Şahin", "Fatura", "Ekim faturası ektedir. Ödeme ayın 30'una kadar yapılabilir."),
    Mail("5", "Zeynep Arslan", "Test sonuçları", "Gece çalışan testlerin hepsi geçti; tablet ekranında bir uyarı var."),
    Mail("6", "Deniz Aydın", "Öğle yemeği", "Cuma günü ekipçe dışarıda yiyelim mi? Yer önerisi olan yazsın."),
    Mail("7", "Burak Çelik", "Erişilebilirlik", "Ekran okuyucuyla bütün akışı denedim; iki düğmenin adı eksik."),
    Mail("8", "Selin Koç", "Yeni katılan", "Pazartesi ekibe yeni bir geliştirici katılıyor; ilk haftayı planlayalım."),
    Mail("9", "Emre Öztürk", "Sunucu bakımı", "Cumartesi gece 02:00 ile 04:00 arasında sunucular bakımda olacak."),
    Mail("10", "Ece Polat", "Kullanıcı görüşmeleri", "Bu hafta beş kullanıcıyla konuştum; notlar paylaşılan klasörde.")
)

private val INBOX_HEIGHT = 420.dp

private class Mail(
    val id: String,
    val from: String,
    val subject: String,
    val body: String
)
```

### Masada: üstte video, altta kontroller

Masaya konan bir katlanabilir için: üstte bakılan, altta kontroller. `TwoPaneOrientation.Stacked` birinci paneli üste koyar; burada üstteki yerin %60'ını alır.

Karttaki pencere seçicisinden "Masa"yı seç: pencere 669 × 951 dp'dir ve kat yeri ortasında yatay durur. Düzen masa duruşunda pencerenin bütün yüksekliğini alır, `byPosture(flat = 360.dp, tabletop = window.size.height)`, ve paneller tam kat yerinde ayrılır: video üst yarıda, kontroller alt yarıda. Öteki pencerelerde düzen 360 dp yüksekliğindedir ve payla bölünür. "Kitap"ta kat yeri dikeydir, alt alta iki paneli ayırmaz: pay geçer.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.container.twopane.TwoPaneOrientation
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byPosture
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
var playing by rememberSaveable { mutableStateOf(false) }
var second by rememberSaveable { mutableIntStateOf(VIDEO_START) }
PantrixTwoPane(
    first = { Player(playing = playing, second = second) },
    second = {
        PlayerControls(
            playing = playing,
            onPlay = { playing = !playing },
            onBack = { second = (second - SKIP).coerceAtLeast(0) },
            onForward = { second = (second + SKIP).coerceAtMost(VIDEO_LENGTH) }
        )
    },
    modifier = Modifier.fillMaxWidth().height(window.byPosture(flat = 360.dp, tabletop = window.size.height)),
    orientation = TwoPaneOrientation.Stacked,
    firstSize = PaneSize.Fraction(0.6f),
    tagKey = "player"
)

@Composable
private fun Player(
    playing: Boolean,
    second: Int
) {
    PantrixSurface(modifier = Modifier.fillMaxSize(), color = PantrixTheme.colors.textPrimary) {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixIcon(
                imageVector = if (playing) PantrixIcons.Pause else PantrixIcons.Play,
                contentDescription = null,
                size = 48.dp,
                tint = PantrixTheme.colors.background
            )
            PantrixText(
                text = "${clock(second)} / ${clock(VIDEO_LENGTH)}",
                color = PantrixTheme.colors.background,
                tagKey = "video_time"
            )
        }
    }
}

@Composable
private fun PlayerControls(
    playing: Boolean,
    onPlay: () -> Unit,
    onBack: () -> Unit,
    onForward: () -> Unit
) {
    PantrixSurface(modifier = Modifier.fillMaxSize(), border = PantrixTheme.colors.border) {
        Row(
            modifier = Modifier.align(Alignment.Center),
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixButton(text = "10 sn geri", onClick = onBack, variant = ButtonVariant.Outline, tagKey = "rewind")
            PantrixButton(text = if (playing) "Duraklat" else "Oynat", onClick = onPlay, tagKey = "play")
            PantrixButton(text = "10 sn ileri", onClick = onForward, variant = ButtonVariant.Outline, tagKey = "skip")
        }
    }
}

private const val VIDEO_START = 83

private const val VIDEO_LENGTH = 225

private const val SKIP = 10

private fun clock(seconds: Int): String =
    "${(seconds / MINUTE).toString().padStart(2, '0')}:${(seconds % MINUTE).toString().padStart(2, '0')}"

private const val MINUTE = 60
```

### Pay, sabit boyut, yön ve okuma yönü

Panellerin ölçüsü ve yönü. Seçicilerle birincinin payını, panellerin yönünü ve okuma yönünü değiştir: her panel kendi boyutunu yazar.

- **Pay.** `PaneSize.Fraction(0.3f)` birinciye, aradaki boşluk düşüldükten sonra kalan yerin %30'unu verir.

- **Sabit.** `PaneSize.Fixed(200.dp)` birinciye 200 dp verir; yer bundan darsa birinci bütün yeri alır.

- **Alt alta.** `TwoPaneOrientation.Stacked`'da pay ve sabit boyut yüksekliğe uygulanır.

- **Sağdan sola.** Yan yana iki panelde birinci sağa geçer; alt alta ikisi yerinde kalır. Uygulama okuma yönünü dilinden alır; burada `LocalLayoutDirection` ile yalnızca bu iki panele verildi.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PaneSize
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.container.twopane.TwoPaneOrientation
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var size by rememberSaveable { mutableIntStateOf(0) }
var stacked by rememberSaveable { mutableStateOf(false) }
var rtl by rememberSaveable { mutableStateOf(false) }
val spacing = PantrixTheme.spacing
Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) {
    PantrixSegmentButton(
        options = SIZES.mapIndexed { index, (label, _) -> SegmentOption(index, label, tagKey = "size_$index") },
        selected = size,
        onSelect = { size = it },
        tagKey = "size"
    )
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "Yan yana", tagKey = "side_by_side"),
            SegmentOption(true, "Alt alta", tagKey = "stacked")
        ),
        selected = stacked,
        onSelect = { stacked = it },
        tagKey = "orientation"
    )
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "Soldan sağa", tagKey = "ltr"),
            SegmentOption(true, "Sağdan sola", tagKey = "rtl")
        ),
        selected = rtl,
        onSelect = { rtl = it },
        tagKey = "direction"
    )
}
val direction = if (rtl) LayoutDirection.Rtl else LayoutDirection.Ltr
CompositionLocalProvider(LocalLayoutDirection provides direction) {
    PantrixTwoPane(
        first = { MeasuredPane(name = "Birinci", color = PantrixTheme.colors.primary.container) },
        second = { MeasuredPane(name = "İkinci", color = PantrixTheme.colors.surface) },
        modifier = Modifier.fillMaxWidth().height(240.dp),
        orientation = if (stacked) TwoPaneOrientation.Stacked else TwoPaneOrientation.SideBySide,
        firstSize = SIZES[size].second,
        tagKey = "sizes"
    )
}

private val SIZES = listOf(
    "Yarı yarıya" to PaneSize.Fraction(0.5f),
    "%30" to PaneSize.Fraction(0.3f),
    "200 dp" to PaneSize.Fixed(200.dp)
)

@Composable
private fun MeasuredPane(
    name: String,
    color: Color
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PantrixSurface(
        modifier = Modifier.fillMaxSize().onSizeChanged { size = it },
        color = color,
        border = PantrixTheme.colors.border
    ) {
        // Ölçüler soldan sağa yazılır: sağdan sola bir paragrafta genişlik ile yükseklik yer değiştirmiş okunurdu.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            Column(modifier = Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                PantrixText(text = name, style = PantrixTheme.typography.callout)
                PantrixText(text = "$words dp", style = PantrixTheme.typography.footnote)
            }
        }
    }
}
```

### Kendi düzenin: rememberFoldsInNode

Kat yeriye göre dizilen kendi düzenini yazmak için: `rememberFoldsInNode()` kat yerlerini bir düğümün kendi koordinatlarında, pikselle verir. `modifier`'ını düğüme koy ve ölçerken `folds`'u oku: düğüm yer değiştirdikçe, pencere değiştikçe ve cihaz katlandıkça düzen yeniden ölçülür. Düğümü kesmeyen kat yeri listede yoktur.

Buradaki araç çubuğu düğmelerini ortaya dizer. Dikey bir kat yeri onu kesiyorsa düğmelerin yarısı kat yerinin önüne, yarısı arkasına geçer: hiçbir düğme kat yerine düşmez. Karttaki pencere seçicisinden "Kitap"ı seç: düğmeler kat yerinin iki yanına ayrılır ve alttaki satır kat yerinin çubuktaki yerini yazar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.platform.LocalDensity
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.rememberFoldsInNode
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val folds = rememberFoldsInNode()
val density = LocalDensity.current
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FoldAwareToolbar(modifier = Modifier.fillMaxWidth().then(folds.modifier)) {
        TOOLS.forEachIndexed { index, tool ->
            PantrixButton(text = tool, onClick = {}, variant = ButtonVariant.Soft, tagKey = "tool_$index")
        }
    }
    val fold = folds.separatingFold
    val words = if (fold == null) {
        "Bu çubuğu kesen bir kat yeri yok"
    } else {
        with(density) {
            val start = fold.clearance.left.toDp().value.roundToInt()
            val end = fold.clearance.right.toDp().value.roundToInt()
            "Kat yeri çubuğun $start–$end dp'sinde, ${fold.orientation.name}"
        }
    }
    PantrixText(
        text = words,
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "fold_in_node"
    )
}

@Composable
private fun FoldAwareToolbar(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val folds = rememberFoldsInNode()
    val gap = PantrixTheme.spacing.sm
    Layout(content = content, modifier = modifier.then(folds.modifier)) { measurables, constraints ->
        val buttons = measurables.map { it.measure(constraints.copy(minWidth = 0)) }
        val space = gap.roundToPx()
        val width = constraints.maxWidth
        val height = buttons.maxOf { it.height }
        val fold = folds.separatingFold?.takeIf { it.orientation == FoldOrientation.Vertical }
        layout(width, height) {
            if (fold == null) {
                // Kat yeri yok: hepsi ortada.
                val row = buttons.sumOf { it.width } + space * (buttons.size - 1)
                var x = (width - row) / 2
                buttons.forEach { button ->
                    button.placeRelative(x, (height - button.height) / 2)
                    x += button.width + space
                }
            } else {
                // Kat yeri var: yarısı şeridin önünde ona dayalı, yarısı arkasında. Kat yeri ekranda olduğu yerde
                // durduğu için düğmeler ekrandaki yerlerine konur.
                val before = buttons.take(buttons.size / 2)
                var x = fold.clearance.left.roundToInt() - before.sumOf { it.width + space }
                (before + buttons.drop(before.size)).forEachIndexed { index, button ->
                    if (index == before.size) x = fold.clearance.right.roundToInt() + space
                    button.place(x, (height - button.height) / 2)
                    x += button.width + space
                }
            }
        }
    }
}

private val TOOLS = listOf("Kes", "Kopyala", "Yapıştır", "Sil")
```

### Önizlemede katlanan bir pencere

Bir önizlemede ya da bir testte katlanan bir pencere: `PantrixWindowFrame` bir kutuyu kendi başına pencere yapar. İçindekiler `PantrixTheme.window` ile ona verilen pencereyi okur, kat yerini de kutunun köşesinden ölçer. Burada 280 × 160 dp'lik, ortasında kitap gibi yarı açık bir kat yeri olan bir pencere kuruldu: içindeki iki panel tam kat yerinde ayrılır ve dar pencere kitap duruşunda iki panel yazar.

Kat yerinin yeri pikselledir. `WindowFold`'un `bounds`'u kat yerinin kendisidir; katlanan bir telefonda kalınlığı olmayan bir çizgi. `clearance` dokunulanların boş bıraktığı şerittir: Android'de kat yerinin kendisi, iOS'ta iki yanında 20 pt daha. Bu pencerede şerit iki yanda 12 dp'dir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.twopane.PantrixTwoPane
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.PantrixWindow
import com.pantrixui.foundation.adaptive.PantrixWindowFrame
import com.pantrixui.foundation.adaptive.WindowFold
import com.pantrixui.foundation.adaptive.WindowPosture
import com.pantrixui.foundation.adaptive.paneCount
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val density = LocalDensity.current
val window = remember(density) { bookWindow(DpSize(280.dp, 160.dp), margin = 12.dp, density = density) }
PantrixWindowFrame(
    window = window,
    modifier = Modifier.size(280.dp, 160.dp).border(1.dp, PantrixTheme.colors.border)
) {
    PantrixTwoPane(
        first = { MeasuredPane(name = "Sol sayfa", color = PantrixTheme.colors.surface) },
        second = { MeasuredPane(name = "Sağ sayfa", color = PantrixTheme.colors.surface) },
        modifier = Modifier.fillMaxSize(),
        tagKey = "framed"
    )
}
PantrixText(
    text = "${window.widthClass.name} genişlik · paneCount(): ${window.paneCount()} · " +
        "isBook: ${if (window.posture.isBook) "evet" else "hayır"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "framed_window"
)

internal fun bookWindow(
    size: DpSize,
    margin: Dp,
    density: Density
): PantrixWindow = with(density) {
    val middle = size.width.toPx() / 2
    val height = size.height.toPx()
    val fold = WindowFold(
        bounds = Rect(left = middle, top = 0f, right = middle, bottom = height),
        orientation = FoldOrientation.Vertical,
        isHalfOpened = true,
        isSeparating = true,
        isOccluding = false,
        clearance = Rect(left = middle - margin.toPx(), top = 0f, right = middle + margin.toPx(), bottom = height)
    )
    PantrixWindow(size, posture = WindowPosture(listOf(fold)))
}

@Composable
private fun MeasuredPane(
    name: String,
    color: Color
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PantrixSurface(
        modifier = Modifier.fillMaxSize().onSizeChanged { size = it },
        color = color,
        border = PantrixTheme.colors.border
    ) {
        // Ölçüler soldan sağa yazılır: sağdan sola bir paragrafta genişlik ile yükseklik yer değiştirmiş okunurdu.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            Column(modifier = Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                PantrixText(text = name, style = PantrixTheme.typography.callout)
                PantrixText(text = "$words dp", style = PantrixTheme.typography.footnote)
            }
        }
    }
}
```

## API

### PantrixTwoPane

`import com.pantrixui.components.container.twopane.PantrixTwoPane`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTwoPane(
    first: @Composable () -> Unit,
    second: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    orientation: TwoPaneOrientation = TwoPaneOrientation.SideBySide,
    firstSize: PaneSize = PaneSize.Fraction(0.5f),
    gap: Dp = PantrixTheme.layout.gutter,
    tagKey: String? = null
)
```

Aynı yerde iki panel: yan yana ya da alt alta. Pencerenin bir kat yeri bu yeri ayırıyorsa oradan bölünür.

- **Nerede buluşurlar.** Yeri panellerin durduğu yönde ayıran bir kat yeri, yan yana paneller için dikey, alt alta paneller için yatay olanı, panellerin buluştuğu yerdir: her panel onun bir yanındadır ve sistemin çevresinde boş istediği şerit, kat yerinin `clearance`'ı, aradaki boşluktur. Başka her yerde birinci panelin ne kadar aldığını `firstSize` söyler ve aralarında `gap` durur.

- **Hangi kat yeri.** Kat yeri pencerenindir ve bu yeri kestiği yerde sayılır: pencerenin bir parçasındaki iki panel, kat yeri ancak içlerinden geçiyorsa oradan bölünür. Kitap gibi tutulan bir katlanabilir yan yana panelleri, masaya konan alt alta panelleri böler.

- **Okuma yönü.** Yan yana iki panelin birincisi baştadır: sağdan sola okunan bir dilde sağda. Kat yeri ekranda olduğu yerde kalır; birinci panel onun baş tarafındadır.

- **Yer.** Paneller bölünmeye dik yönde bütün yeri alır: yan yana iki panel yer kadar yüksektir, yerin yüksekliği sınırsızsa uzun olanı kadar. Bölünme yönünde yer sınırlı olmalıdır.

- **Hep ikisi.** İki panel her zaman gösterilir. İkisine yer olmayan yerde birini gösteren bir düzen önce pencereye sorar: `PantrixTheme.window.paneCount()`.

- **Otomasyon.** Panel çiftinin etiketi `TwoPane_<tagKey>`'dir.

Parametreler:

- `first: @Composable () -> Unit`: birinci panel: ikincinin yanındayken başta, alt altayken üstte.
- `second: @Composable () -> Unit`: ikinci panel.
- `modifier: Modifier`: iki panelin paylaştığı yer.
- `orientation: TwoPaneOrientation`: panellerin hangi yönde durduğu.
- `firstSize: PaneSize`: yeri bir kat yeri ayırmıyorsa birinci panelin ne kadar aldığı: varsayılanı yarısı.
- `gap: Dp`: yeri bir kat yeri ayırmıyorsa paneller arasındaki boşluk: varsayılanı düzenin sütun arası.
- `tagKey: String?`: panel çiftinin otomasyon etiketinin anahtarı.

### TwoPaneOrientation

`import com.pantrixui.components.container.twopane.TwoPaneOrientation`, `com.pantrixui:components` içinden

```kotlin
enum class TwoPaneOrientation
```

İki panelin hangi yönde durduğu: yan yana ya da alt alta.

Değerleri:

- `SideBySide`: Birinci panel başta, ikincisi sonda: bir liste ve onda seçilen.
- `Stacked`: Birinci panel üstte, ikincisi altta: bakılan ve altında kontrolleri.

### PaneSize

`import com.pantrixui.components.container.twopane.PaneSize`, `com.pantrixui:components` içinden

```kotlin
sealed interface PaneSize
```

Panellerin nerede buluşacağını bir kat yeri söylemiyorsa birinci panelin yerden ne kadar aldığı. İkinci panel boşluktan sonra kalanı alır.

#### PaneSize.Fraction

```kotlin
data class Fraction(public val fraction: Float) : PaneSize
```

Panellerin paylaştığı yerden, boşluk düşüldükten sonra bir pay: `0.5f` her birine yarısıdır.

Parametreler:

- `fraction: Float`: Birinci panelin payı, 0 ile 1 arasında.

#### PaneSize.Fixed

```kotlin
data class Fixed(public val size: Dp) : PaneSize
```

Kendine ait bir boyut: pencere ne olursa olsun 360dp genişliğinde bir liste. Yer bu boyut ile boşluktan küçükse birinci panel olanın hepsini alır.

Parametreler:

- `size: Dp`: Birinci panelin, ikincinin yanındayken genişliği, üstündeyken yüksekliği.

### PantrixWindow.paneCount

`import com.pantrixui.foundation.adaptive.paneCount`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixWindow.paneCount(maxPanes: Int = 2): Int
```

Bir düzenin bu pencerede yan yana dizdiği panel sayısı, en çok `maxPanes`: Compact ve Medium bir pencerede bir, Expanded'dan itibaren iki, Large'dan itibaren üç. Dikey bir kat yerinin ayırdığı pencere, kitap gibi tutulan bir katlanabilir ya da iki ekran arasındaki bir menteşe, her genişlikte iki alır: kat yerinin iki yanında birer tane.

```kotlin
if (PantrixTheme.window.paneCount() >= 2) InboxAndMessage() else Inbox()
```

Paneller arasındaki boşluk düzenin sütun arasıdır, `PantrixTheme.layout.gutter`. Bir kat yeri pencereyi ayırıyorsa paneller orada buluşur ve aradaki boşluk kat yerinin `clearance`'ıdır.

Parametreler:

- `maxPanes: Int`: düzenin en çok kaç paneli olduğu: bir liste ve detayı için iki, yanlarında bir panel daha varsa üç.

### rememberFoldsInNode

`import com.pantrixui.foundation.adaptive.rememberFoldsInNode`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFoldsInNode(window: PantrixWindow = LocalPantrixWindow.current): FoldsInNode
```

`window`'un kat yerleri, `FoldsInNode.modifier`'ın konduğu düğümü kestikleri yerde.

Parametreler:

- `window: PantrixWindow`: kat yerleri sorulan pencere: verilmezse içeriğe bildirilen pencere.

### FoldsInNode

`import com.pantrixui.foundation.adaptive.FoldsInNode`, `com.pantrixui:foundation` içinden

```kotlin
class FoldsInNode
```

Pencerenin kat yerleri, bir düğümü kestikleri yerde, düğümün kendi koordinatlarında ve piksel cinsinden: yerini bir kat yerinden bölen bir düzenin ölçerken baktığı. `modifier`'ı düğüme koyun; `folds` düğüm yer değiştirdikçe ve boyutu değiştikçe, pencere değiştikçe ve cihaz katlandıkça onu izler.

Kat yerinin kesmediği bir düğümün kat yeri yoktur. Düğüm ilk kez yerleştirilene kadar kat yerleri, pencereyi dolduran bir düğüm gibi pencerenin köşesinden başlayan bir düğümde olacakları yerdedir.

Üyeleri:

- `modifier: Modifier`: Kat yerleri sorulan düğüme konur. Düğümün penceredeki yerini izler: bir sayfanın kat yerinin önünden kaydırdığı düğüm, kaydıkça yeniden ölçülür.
- `folds: List<WindowFold>`: Düğümü kesen kat yerleri; sınırları ve boş şeritleri düğümün koordinatlarında.
- `separatingFold: WindowFold?`: Düğümü ayıran kat yeri, varsa: `folds`'un ayıran ilki.

### PantrixWindowFrame

`import com.pantrixui.foundation.adaptive.PantrixWindowFrame`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixWindowFrame(
    window: PantrixWindow?,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
)
```

Kendi başına bir pencere olan kutu: içeriğine içinde durduğu pencere olarak `window` bildirilir ve `window`'un kat yerleri, kutunun üst baş köşesi pencereninki olarak, bu kutuda yerlerindedir. Bir ekranın belli bir boyuttaki önizlemesi, bir tasarım aracının çerçevesi ya da bir kataloğun pencere seçicisi bir pencereyi bunun içinde çizer.

```kotlin
val book = PantrixWindow(DpSize(951.dp, 669.dp), posture = WindowPosture(listOf(fold)))
PantrixWindowFrame(book, Modifier.size(951.dp, 669.dp)) { Inbox() }
```

Uygulamanın içinde durduğu pencerenin kat yerleri o pencerenin koordinatlarındadır; bir çerçevenin içinde çerçevenin koordinatlarında. Bir kat yerinden bölen düzen onu, nerede çizilirse çizilsin, `rememberFoldsInNode` ile bulur. Ölçeklenmiş bir katmanda küçük ya da büyük çizilen çerçeve, içeriğinin kat yerlerini içerikte oldukları yerde tutar: kat yeri içerikle birlikte ölçeklenir.

Parametreler:

- `window: PantrixWindow?`: içeriğe bildirilen pencere; kutunun içinde durduğu pencere için null. Böylece gerçek pencereyi uydurulmuş pencerelerin yanında sunan bir seçici, hangisi seçilirse seçilsin, içeriği kompozisyondaki yerinde ve durumuyla birlikte tutar.
- `modifier: Modifier`: kutunun modifier'ı. Pencerenin üst baş köşesi içeriğinin başladığı yerdir: modifier'ın iç boşluğunun ve kenarlığının içinde.
- `content: @Composable () -> Unit`: pencerenin içindekiler.

### WindowFold

`import com.pantrixui.foundation.adaptive.WindowFold`, `com.pantrixui:foundation` içinden

```kotlin
data class WindowFold(
    public val bounds: Rect,
    public val orientation: FoldOrientation,
    public val isHalfOpened: Boolean,
    public val isSeparating: Boolean,
    public val isOccluding: Boolean,
    public val clearance: Rect = bounds
)
```

Penceredeki bir kat yeri ya da menteşe.

Parametreler:

- `bounds: Rect`: Nerede olduğu, piksel cinsinden ve pencerenin koordinatlarında. Tek ekrandaki bir kat yerinin kalınlığı yoktur: sınırları sıfır genişliğinde bir çizgidir. İki ekran arasındaki bir menteşe aradaki boşluk kadar geniştir.
- `orientation: FoldOrientation`: Hangi yönde uzandığı.
- `isHalfOpened: Boolean`: Cihaz kısmen açık mı tutuluyor, iki yarı birbirine açılı mı. Düz açılmışsa değildir.
- `isSeparating: Boolean`: Pencere burada, üstüne hiçbir şey yerleştirilemeyecek biçimde iki parça mı: yarı açık tutulan bir kat yeri ya da hangi açıda olursa olsun iki ekran arasındaki bir menteşe böyledir. Düz açılmış bir kat yeri hiçbir şeyi ayırmaz.
- `isOccluding: Boolean`: Pencerenin bir şeridini gizliyor mu: iki ekran arasındaki bir menteşe gizler.
- `clearance: Rect`: Çevresinde dokunulanların boş bıraktığı şerit, piksel cinsinden ve pencerenin koordinatlarında: `bounds` ve sistemin iki yanında istediği pay. iOS bir pay ister, katlanan bir iPhone'un kat yerinin iki yanında 20pt; Android ve tarayıcılar istemez ve şerit `bounds`'un kendisidir. Kat yerinden bölünen iki panel aralarında bu şeridi bırakır.

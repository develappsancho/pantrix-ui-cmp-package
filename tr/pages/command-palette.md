# Command Palette

Uygulamanın bütün komutları tek bir yerde, adlarıyla bulunur ve klavyeden çalıştırılır: Cmd+K ya da Ctrl+K'nın açtığı panel. Bu demo'da da her sayfada Cmd+K (Mac'te) ya da Ctrl+K bütün sayfaları listeleyen bir palet açar.

- `PantrixCommandPalette` (`com.pantrixui.components.overlay.commandpalette`, `com.pantrixui:components`): Uygulamanın her komutu, pencerenin üstündeki modal bir panelde: yazıldıkça adıyla bulunur ve klavyeden çalıştırılır; gruplarıyla ve kısayollarıyla. Anahtar sözcükler: komut paleti, komut menüsü, başlatıcı, hızlı aç, kısayollar, cmd+k.

## Özellikler

- **Modal bir panel.** Bir dialog gibi: arkasında bir scrim, odak içinde; geri, Esc ve scrim'e tıklama kapatmak ister. Gösterilip gösterilmediği ekranın durumudur (`visible`, `onDismissRequest`); palet kendini kapatmaz. `onRun`, komut işini yapmadan önce paletin kapatıldığı yerdir.
- **Üstte durur.** Pencerenin üst kısmında, ortada: yazdıkça liste altında kısalır ve uzar, alan yerinde kalır. Telefonda kenar payları kadar geniştir ve klavyenin üstünde biter.
- **Komutlar.** Bir `PantrixCommand`'ın `key`'i her dilde aynıdır; `label` okunan adı, `group` altında durduğu başlığı, `icon` önündeki ikonu, `shortcut` sonundaki kısayolu, `keywords` onu bulduran başka sözleri, `supportingText` etiketin altındaki ikinci satırı verir.
- **Arama.** Yazılan her söz etiket, grup, anahtar sözcükler ya da ikinci satırda aranır; büyük küçük harf temanın diline göre karşılaştırılır (Türkçede İ ile i, I ile ı). Grupların sırası korunur, her grubun içinde baştan ve bir sözün başından eşleşenler öne geçer; bulunan harfler kalın yazılır.
- **Klavye.** Alan odağı tutar; aşağı ve yukarı ok çalıştırılabilen komutlar arasında gider ve uçlarda durur, Page Down ve Page Up bir sayfa atlar, fare üstünden geçtiği satırı vurgular. Enter, klavyenin eylemi ve satıra basmak komutu çalıştırır. Her açılışta alan boştur ve vurgu ilk çalıştırılabilen komuttadır.
- **Devre dışı.** `enabled = false` olan komut listededir, soluk yazılır; oklar onu atlar ve çalışmaz.
- **Kısayollar.** `PantrixShortcut` bir tuşu ve onunla basılanları tutar; `command` Apple'da Command, başka yerde Control'dür. Satırın sonunda sistemin yazdığı gibi yazılır: ⇧⌘K ya da Ctrl+Shift+K. `Modifier.onShortcut` bir kısayolu, `Modifier.commandShortcuts` listedeki her komutun kısayolunu bağlar; pencerenin kökündeki `Modifier.shortcutRoot` hiçbir şey odakta değilken de kısayolların duyulmasını sağlar.
- **Ekran okuyucu.** Palet açılınca temanın komut listesi adıyla duyurulur. Vurgulanan satır seçilidir, gruplar başlıktır, kısayol satırın durumu olarak okunur; yazdıkça kaç komut kaldığı söylenir.
- **Platform.** Panel bir dialog'unkidir, satırlar platformun liste satırı: Android'de 48dp, iOS'ta 44pt, masaüstünde ve web'de 36dp. Masaüstünde ve web'de panel üstten biraz daha aşağıdadır.

## Kullanım

### Opened with Cmd+K or Ctrl+K

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { open = true }) {
    PantrixCommandPalette(
        visible = open,
        onDismissRequest = { open = false },
        commands = commands,
        onRun = { command ->
            open = false
            run(command.key)
        },
        tagKey = "commands"
    )
}
```

### Commands with groups, shortcuts and keywords

```kotlin
val commands = listOf(
    PantrixCommand(
        key = "rename",
        label = stringResource(Res.string.rename),
        group = stringResource(Res.string.file),
        shortcut = PantrixShortcut(Key.R, command = true)
    ),
    PantrixCommand(
        key = "delete",
        label = stringResource(Res.string.delete),
        group = stringResource(Res.string.file),
        enabled = selection.isNotEmpty()
    ),
    PantrixCommand(
        key = "appearance",
        label = stringResource(Res.string.appearance),
        group = stringResource(Res.string.view),
        keywords = listOf("theme", "dark")
    )
)
```

## Örnekler

### Gruplar, kısayollar ve anahtar sözcükler

Bir dosya düzenleyicisinin komutları, gruplarıyla. Düğmeyle açılır; yazdıkça liste daralır, oklarla gezilir, Enter vurgulanan komutu çalıştırır ve palet kapanır. "Sil" şu an çalıştırılamaz: listededir ama oklar onu atlar. "Görünüm"ü "tema" ya da "karanlık" yazarak da bulursun: anahtar sözcükleri bunlardır. İki komutun etiketinin altında ne yaptığını söyleyen ikinci bir satır var (`supportingText`); arama onu da okur: "adres" yaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var ran by rememberSaveable { mutableStateOf<String?>(null) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixButton(text = "Komut paletini aç", onClick = { open = true }, tagKey = "open_editor")
    PantrixText(
        text = "Son çalıştırılan: ${ran ?: "yok"}",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "ran_editor"
    )
}
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = EDITOR_COMMANDS,
    onRun = { command ->
        open = false
        ran = command.label
    },
    tagKey = "editor"
)

private val EDITOR_COMMANDS = listOf(
    PantrixCommand(
        key = "new",
        label = "Yeni dosya",
        group = "Dosya",
        icon = PantrixIcons.Plus,
        shortcut = PantrixShortcut(Key.N, command = true)
    ),
    PantrixCommand(
        key = "open",
        label = "Dosya aç",
        group = "Dosya",
        icon = PantrixIcons.Folder,
        shortcut = PantrixShortcut(Key.O, command = true)
    ),
    PantrixCommand(
        key = "rename",
        label = "Yeniden adlandır",
        group = "Dosya",
        shortcut = PantrixShortcut(Key.R, command = true, shift = true)
    ),
    PantrixCommand(key = "delete", label = "Sil", group = "Dosya", enabled = false),
    PantrixCommand(
        key = "copy",
        label = "Bağlantıyı kopyala",
        group = "Dosya",
        icon = PantrixIcons.Copy,
        keywords = listOf("link", "paylaş"),
        supportingText = "Dosyayı görebilenler için bir adres"
    ),
    PantrixCommand(
        key = "zoom_in",
        label = "Yakınlaştır",
        group = "Görünüm",
        icon = PantrixIcons.ZoomIn,
        shortcut = PantrixShortcut(Key.Equals, command = true)
    ),
    PantrixCommand(
        key = "zoom_out",
        label = "Uzaklaştır",
        group = "Görünüm",
        icon = PantrixIcons.ZoomOut,
        shortcut = PantrixShortcut(Key.Minus, command = true)
    ),
    PantrixCommand(
        key = "appearance",
        label = "Görünüm ayarları",
        group = "Görünüm",
        icon = PantrixIcons.Eye,
        keywords = listOf("tema", "karanlık", "açık"),
        supportingText = "Tema, yazı boyutu, satır aralığı"
    ),
    PantrixCommand(
        key = "search",
        label = "Dosyalarda ara",
        icon = PantrixIcons.Search,
        shortcut = PantrixShortcut(Key.F, command = true, shift = true)
    )
)
```

### Komutların kendi kısayolları

Komutların kendi kısayolları: aynı liste hem paletin gösterdiği hem klavyenin çalıştırdığıdır. Alana yazarken ⌘B ya da Ctrl+B "Kalın"ı, ⌘I ya da Ctrl+I "İtalik"i çalıştırır; harf alana yazılmaz. Odak bu kartın içindeyken duyulurlar: bütün pencere için kökte durmaları gerekir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.components.overlay.commandpalette.commandShortcuts
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var ran by rememberSaveable { mutableStateOf<String?>(null) }
val note = rememberTextFieldState()
val run = { command: PantrixCommand -> ran = command.label }
Column(
    modifier = Modifier.fillMaxWidth().commandShortcuts(TEXT_COMMANDS, onRun = run),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(
        state = note,
        modifier = Modifier.fillMaxWidth(),
        label = "Not",
        placeholder = "Buraya yaz, sonra ⌘B ya da Ctrl+B",
        tagKey = "note"
    )
    PantrixButton(
        text = "Biçim komutları",
        onClick = { open = true },
        variant = ButtonVariant.Outline,
        tagKey = "open_text"
    )
    PantrixText(
        text = "Son çalıştırılan: ${ran ?: "yok"}",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "ran_text"
    )
}
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = TEXT_COMMANDS,
    onRun = { command ->
        open = false
        run(command)
    },
    tagKey = "text"
)

private val TEXT_COMMANDS = listOf(
    PantrixCommand(
        key = "bold",
        label = "Kalın",
        group = "Biçim",
        shortcut = PantrixShortcut(Key.B, command = true)
    ),
    PantrixCommand(
        key = "italic",
        label = "İtalik",
        group = "Biçim",
        shortcut = PantrixShortcut(Key.I, command = true)
    ),
    PantrixCommand(
        key = "clear",
        label = "Biçimi temizle",
        group = "Biçim",
        shortcut = PantrixShortcut(Key.Backslash, command = true)
    )
)
```

### Kendi sözleri ve kendi renkleri

Paletin kendi sözleri ve kendi renkleri: alanın yer tutucusu ve hiçbir şey eşleşmediğinde yazılan söz çağıranın, vurgulanan satır uygulamanın kendi morunda. "zzz" yazınca boş listenin sözü görünür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.commandpalette.CommandPaletteColors
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(false) }
val own = ownColors()
PantrixButton(text = "Bir yere git", onClick = { open = true }, variant = ButtonVariant.Outline, tagKey = "open_go")
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = PLACES,
    onRun = { open = false },
    placeholder = "Bir sayfanın adını yaz…",
    emptyText = "Bu adla bir sayfa yok",
    colors = CommandPaletteColors(highlightedContainer = own.container, highlightedContent = own.onContainer),
    tagKey = "go"
)

private val PLACES = listOf(
    PantrixCommand(key = "home", label = "Ana sayfa", icon = PantrixIcons.Inbox),
    PantrixCommand(key = "profile", label = "Profil", icon = PantrixIcons.Person),
    PantrixCommand(key = "favourites", label = "Favoriler", icon = PantrixIcons.Star),
    PantrixCommand(key = "calendar", label = "Takvim", icon = PantrixIcons.Calendar)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stiliyle

Kendi stiliyle: `CommandPaletteStyle` paletin genişliğini, köşesini ve satırlarını değiştirir. Burada palet en çok 420dp genişlikte, köşeleri orta yuvarlak ve satırları 40dp yüksekliğindedir; verilmeyen her alan platformun ön ayarıdır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.commandpalette.CommandPaletteStyle
import com.pantrixui.components.overlay.commandpalette.PantrixCommand
import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixButton(text = "Dar paleti aç", onClick = { open = true }, tagKey = "open_narrow")
PantrixCommandPalette(
    visible = open,
    onDismissRequest = { open = false },
    commands = EDITOR_COMMANDS,
    onRun = { open = false },
    style = CommandPaletteStyle(maxWidth = 420.dp, shape = ShapeRole.Medium, itemHeight = 40.dp, iconGap = 12.dp),
    tagKey = "narrow"
)

private val EDITOR_COMMANDS = listOf(
    PantrixCommand(
        key = "new",
        label = "Yeni dosya",
        group = "Dosya",
        icon = PantrixIcons.Plus,
        shortcut = PantrixShortcut(Key.N, command = true)
    ),
    PantrixCommand(
        key = "open",
        label = "Dosya aç",
        group = "Dosya",
        icon = PantrixIcons.Folder,
        shortcut = PantrixShortcut(Key.O, command = true)
    ),
    PantrixCommand(
        key = "rename",
        label = "Yeniden adlandır",
        group = "Dosya",
        shortcut = PantrixShortcut(Key.R, command = true, shift = true)
    ),
    PantrixCommand(key = "delete", label = "Sil", group = "Dosya", enabled = false),
    PantrixCommand(
        key = "copy",
        label = "Bağlantıyı kopyala",
        group = "Dosya",
        icon = PantrixIcons.Copy,
        keywords = listOf("link", "paylaş"),
        supportingText = "Dosyayı görebilenler için bir adres"
    ),
    PantrixCommand(
        key = "zoom_in",
        label = "Yakınlaştır",
        group = "Görünüm",
        icon = PantrixIcons.ZoomIn,
        shortcut = PantrixShortcut(Key.Equals, command = true)
    ),
    PantrixCommand(
        key = "zoom_out",
        label = "Uzaklaştır",
        group = "Görünüm",
        icon = PantrixIcons.ZoomOut,
        shortcut = PantrixShortcut(Key.Minus, command = true)
    ),
    PantrixCommand(
        key = "appearance",
        label = "Görünüm ayarları",
        group = "Görünüm",
        icon = PantrixIcons.Eye,
        keywords = listOf("tema", "karanlık", "açık"),
        supportingText = "Tema, yazı boyutu, satır aralığı"
    ),
    PantrixCommand(
        key = "search",
        label = "Dosyalarda ara",
        icon = PantrixIcons.Search,
        shortcut = PantrixShortcut(Key.F, command = true, shift = true)
    )
)
```

## API

### PantrixCommandPalette

`import com.pantrixui.components.overlay.commandpalette.PantrixCommandPalette`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCommandPalette(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    commands: List<PantrixCommand>,
    onRun: (PantrixCommand) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    emptyText: String? = null,
    style: CommandPaletteStyle? = null,
    colors: CommandPaletteColors? = null,
    tagKey: String? = null
)
```

Uygulamanın her komutu, adıyla bulunur ve klavyeden çalıştırılır: Cmd+K ya da Ctrl+K'nın açtığı.

Palet bir dialog gibi modaldır: uygulamanın üstünde bir scrim, odak içinde; geri, Escape ve scrim'e tıklama kapatmak ister. Gösterilip gösterilmediği çağıranın işidir: `visible`'ı ver, `onDismissRequest`'e ve `onRun`'a göre davran; `onRun`, komut işini yapmadan önce paletin kapatıldığı yerdir. Pencerenin üst kısmında durur; alanı orada kalır, altındaki liste uzayıp kısalırken.

**Bulmak.** Alan palet açılırken odağı alır, telefonda da, ve liste gezilirken tutar. Hiçbir şey yazılmamışken her komut grubunun altında listelenir. Yazılan, listeyi etiketi, grubu ya da anahtar sözcükleri yazılanın her sözünü tutan komutlara daraltır, temanın dilinde karşılaştırılarak; bir grubun içinde etiketi onunla başlayanlar önce gelir ve bulunan harfler işaretlenir. Her açılışta alan boştur.

**Çalıştırmak.** Bir komut vurgulanır, başta çalıştırılabilen ilki. Aşağı ve yukarı ok vurguyu çalıştırılabilen komutlar üstünde taşır ve uçlarda durur, Page Down ve Page Up bir sayfa atlar, işaretçi de üstünden geçtiği satıra taşır. Enter, klavyenin eylemi ve bir satıra basmak komutu çalıştırır. `enabled` olmayan bir komut listededir, soluktur ve çalıştırılmaz.

**Kısayollar.** Bir komutun `PantrixCommand.shortcut`'ı satırının sonunda sistemin yazdığı gibi yazılır. Palet uygulamanın bir kısayoluyla açılır, komutlar da kendilerininkiyle çalışır; pencerenin kökünde `commandShortcuts` ile.

**Ekran okuyucuya** palet, temanın bir komut listesine verdiği adla duyurulur. Vurgulanan satır seçilidir, gruplar başlıktır ve yazılan listeyi daralttıkça kalan komutların sayısı söylenir.

```kotlin
var open by rememberSaveable { mutableStateOf(false) }
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { open = true }) {
    …
    PantrixCommandPalette(
        visible = open,
        onDismissRequest = { open = false },
        commands = commands,
        onRun = { command ->
            open = false
            run(command.key)
        },
        tagKey = "commands"
    )
}
```

Parametreler:

- `visible: Boolean`: paletin gösterilip gösterilmediği. Kendini asla gizlemez.
- `onDismissRequest: () -> Unit`: geri, Escape ve scrim'e tıklama için çağrılır.
- `commands: List<PantrixCommand>`: her komut, gruplarının altında listelendikleri sırayla. İkisi aynı anahtarı taşımaz.
- `onRun: (PantrixCommand) -> Unit`: çalıştırılan komutla çağrılır; Enter, klavyenin eylemi ya da bir basışla. Paleti burada kapat.
- `modifier: Modifier`: panelin modifier'ı.
- `placeholder: String?`: boş alanın gösterdiği, ya da temanın komut aramak için sözleri için null.
- `emptyText: String?`: hiçbir şey eşleşmezken listenin yerinde duran, ya da temanın bunun için sözleri için null.
- `style: CommandPaletteStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: CommandPaletteColors?`: bu paletin temanınkiler olmayan kendi renkleri: burada verilenler, geri kalanlar için temanınkiler.
- `tagKey: String?`: paletin otomasyon anahtarı: panel `CommandPalette_<tagKey>`, alanı `CommandPalette_<tagKey>.TextField_query` ve bir komutun satırı `CommandPalette_<tagKey>.Command_<key>` olur. Yapılan bir `CommandPalette` olayı olarak bildirilir: `open`, `via` (`back` ya da `scrim`) ile `dismiss`, ve komutun anahtarı ile `via` (`key` ya da `click`) ile `run`. Yazılan asla bildirilmez.

### PantrixCommand

`import com.pantrixui.components.overlay.commandpalette.PantrixCommand`, `com.pantrixui:components` içinden

```kotlin
class PantrixCommand(
    public val key: String,
    public val label: String,
    public val group: String? = null,
    public val icon: ImageVector? = null,
    public val shortcut: PantrixShortcut? = null,
    public val keywords: List<String> = emptyList(),
    public val enabled: Boolean = true,
    public val tagKey: String? = null,
    public val supportingText: String? = null
)
```

Bir `PantrixCommandPalette`'in bir komutu: kullanıcının okuduğu, altında listelendiği yer ve onu başka neyin bulduğu.

```kotlin
PantrixCommand(
    key = "rename",
    label = stringResource(Res.string.rename),
    group = stringResource(Res.string.file),
    shortcut = PantrixShortcut(Key.R, command = true)
)
```

Parametreler:

- `key: String`: komutun kendi anahtarı, her dilde aynı: `PantrixCommandPalette`'in `onRun`'ına ve `run` olayına verilen, `tagKey` verilmedikçe de satırının otomasyon anahtarı. Bir paletin iki komutu aynı anahtarı taşımaz.
- `label: String`: komutun ne yaptığı, kullanıcının okuduğu gibi.
- `group: String?`: komutun altında listelendiği başlık, ya da hiçbir başlık altında listelenmeyen için null.
- `icon: ImageVector?`: etiketten önce çizilir.
- `shortcut: PantrixShortcut?`: aynı şeyi çalıştıran tuşlar; satırın sonunda sistemin yazdığı gibi yazılır. Onları bağlamak `Modifier.commandShortcuts`'ın işidir.
- `keywords: List<String>`: komutu bulduran başka sözler: başka bir uygulamanın ona dediği, bir kullanıcının onun için yazdığı bir söz.
- `enabled: Boolean`: komutun şimdi çalıştırılıp çalıştırılamayacağı. Çalıştırılamayan listede, soluk durur ve oklar onu atlar.
- `tagKey: String?`: satırın otomasyon anahtarı, `key` değilse.
- `supportingText: String?`: etiketin altında, daha küçük ve sessiz ikinci bir satır: komutun neyi açtığı ya da nereye götürdüğü. Ekran okuyucu onu etiketten sonra duyar; arama da komutu bir anahtar sözcükle bulduğu gibi onunla bulur.

### CommandPaletteStyle

`import com.pantrixui.components.overlay.commandpalette.CommandPaletteStyle`, `com.pantrixui:components` içinden

```kotlin
class CommandPaletteStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val topSpace: Dp = Dp.Unspecified,
    public val itemHeight: Dp = Dp.Unspecified,
    public val itemHorizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified
) : PantrixStyle<CommandPaletteStyle>
```

`PantrixCommandPalette`'in geometrisi: panel, durduğu yer ve listesinin satırları.

Hiçbir platformun kendi komut paleti yoktur. Panel bir dialog'unkidir, köşeleri ve gölgesi platformun dialog'unda olduğu gibi; satırlar platformun liste satırlarıdır: Android'de 48dp, iOS'ta 44pt, bir işaretçinin altında 36dp. Bir satır hiçbir zaman platformun dokunma hedefinden alçak olmaz.

Panel pencerenin üst kısmında durur; içine yazılan alan orada kalır, altındaki liste uzayıp kısalırken: telefonda kenar payının altında, masaüstünde ve web'de `topSpace` kadar daha aşağıda.

Boşluklar, satırların yüksekliği ve aralar yoğunluğa uyar. Panelin boyutu, köşeleri, gölgesi ve ikonlar uymaz.

Parametreler:

- `shape: ShapeSpec`: Panelin köşeleri: markanın şekil ölçeğinden bir adım, ya da sabit bir şekil.
- `maxWidth: Dp`: Panelin geniş bir pencerede büyüyebildiği en geniş hâl.
- `maxHeight: Dp`: Panelin uzun bir pencerede büyüyebildiği en uzun hâl. Daha dar bir pencere ve klavye onu kısaltır.
- `elevation: Dp`: Panelin gölgesi. iOS bir paneli yalnızca karartmayla ayırır.
- `margin: Dp`: Panel ile pencerenin güvenli alanı arasındaki en az boşluk.
- `topSpace: Dp`: Panelin üstündeki boşluk, `margin`'in ötesinde.
- `itemHeight: Dp`: Bir komut satırının en az yüksekliği. Daha büyük bir yazı onu uzatır.
- `itemHorizontalPadding: Dp`: Bir satırın kenarlarıyla içindekiler arasındaki boşluk, bir başlığınki de.
- `iconSize: Dp`: Bir komutun ikonunun genişliği ve yüksekliği.
- `iconGap: Dp`: Bir komutun ikonu, etiketi ve kısayolu arasında.

### CommandPaletteColors

`import com.pantrixui.components.overlay.commandpalette.CommandPaletteColors`, `com.pantrixui:components` içinden

```kotlin
data class CommandPaletteColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val highlightedContainer: Color = Color.Unspecified,
    public val highlightedContent: Color = Color.Unspecified,
    public val heading: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

Bir `PantrixCommandPalette`'in temanın renkleri yerine boyandığı renkler: verilen bir renk kullanılır, bırakılan temanınki kalır.

Burada verilen ve temanın rol renklerinden biri olan bir `container`, panelde yazılanlar için temanın onunla eşlediği rengi getirir, `content` de verilmedikçe; bir `highlightedContainer` de vurgulanan satır için kendi eşini getirir, `highlightedContent` verilmedikçe. Hiçbir rolün sahip olmadığı bir dolgu getirmez: onun üstünde neyin okunacağını vermek çağıranın işidir.

Parametreler:

- `container: Color`: Panelin dolgusu. Temanın `surface`'ı.
- `content: Color`: Bir komutun etiketi ve ikonu, bir de yazılan. Temanın `textPrimary`'si, ya da `container` olarak verilen bir rol dolgusunun üstünde duranlara verdiği renk.
- `highlightedContainer: Color`: Enter'ın çalıştırdığı komutun arkasındaki dolgu. Birincil rolün `container`'ı.
- `highlightedContent: Color`: O komutun etiketi, ikonu ve kısayolu: `highlightedContainer` üstünde okunan renk. Birincil rolün `onContainer`'ı.
- `heading: Color`: Bir grubun başlığı, bir kısayol ve hiçbir şey eşleşmediğinde listenin yerinde duran. Temanın kendi zeminlerinde `textSecondary`'si, başka bir dolguda `content`.
- `scrim: Color`: Paletin arkasında uygulamanın üstüne serilen karartma, kendi alfasıyla. Temanın `scrim`'i.

### Modifier.commandShortcuts

`import com.pantrixui.components.overlay.commandpalette.commandShortcuts`, `com.pantrixui:components` içinden

```kotlin
fun Modifier.commandShortcuts(
    commands: List<PantrixCommand>,
    onRun: (PantrixCommand) -> Unit
): Modifier
```

`commands`'ın kısayolu olan her komutunu, odak bu düğümdeyken ya da içindeyken, o kısayolla `onRun` aracılığıyla çalıştırır: paletin gösterdiği ile klavyenin çalıştırdığı aynı komut listesidir.

`enabled` olmayan bir komut tuşlarını geçirir. Aynı kısayolu olan iki komuttan ilki çalışır. Bunu bir pencerenin köküne `shortcutRoot` ile birlikte koy; o, başka hiçbir şey odakta değilken odağı tutar, öyle ki kısayollar o zaman da duyulur:

```kotlin
Box(Modifier.shortcutRoot().commandShortcuts(commands, onRun = { run(it.key) })) { … }
```

Bir palet ya da Pantrix'in başka bir modal'ı açıkken tuşlar onundur ve bu kısayollar duyulmaz.

Parametreler:

- `commands: List<PantrixCommand>`: komutlar, palete verildikleri gibi.
- `onRun: (PantrixCommand) -> Unit`: kısayolu basılan komutla çağrılır.

### PantrixShortcut

`import com.pantrixui.foundation.keyboard.PantrixShortcut`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixShortcut(
    public val key: Key,
    public val command: Boolean = false,
    public val shift: Boolean = false,
    public val alt: Boolean = false
)
```

Bir tuş ve onunla birlikte basılı tutulan değiştiriciler: bir komutu klavyeden çalıştıran şey; Mac'te `⌘K`, başka yerde `Ctrl+K`.

`command`, bir sistemin kısayollarının başladığı tuştur: Apple'ın sistemlerinde Command, ötekilerde Control; böylece bir kısayol her platform için bir kez yazılır. Bir kısayol, tuşu değiştiricileri basılıyken ve başka hiçbiri basılı değilken indiğinde basılmış olur: `⌘K`'ya `⇧⌘K` basmaz, Mac'te `⌃K` de basmaz.

```kotlin
val search = PantrixShortcut(Key.K, command = true)
search.writtenOn(OperatingSystem.MacOs) // "⌘K"
search.writtenOn(OperatingSystem.Windows) // "Ctrl+K"
```

Harflerin, rakamların, okların, işlev tuşlarının, Enter'ın, Escape'in, Tab'ın, boşluğun, Backspace'in, Delete'in, Home'un, End'in, sayfa tuşlarının ve yaygın işaretlerin kendi adları vardır. Başka bir tuş numarasıyla yazılır.

Parametreler:

- `key: Key`: basılan tuş.
- `command: Boolean`: Apple'ın sistemlerinde Command'ın, ötekilerde Control'ün basılı olup olmadığı.
- `shift: Boolean`: Shift'in basılı olup olmadığı.
- `alt: Boolean`: Apple'ın sistemlerinde Option'ın, ötekilerde Alt'ın basılı olup olmadığı.

Üyeleri:

- `fun isPressedBy(event: KeyEvent, system: OperatingSystem): Boolean`: `event`'in bu kısayolu `system`'de basıp basmadığı: tuşunun inmesi, değiştiricileri basılıyken ve başka hiçbiri basılı değilken.
- `fun keysOn(system: OperatingSystem): List<String>`: Bu kısayolun tuşları, `system`'in yazdığı gibi, her biri bir tuş kapağına, onun sırasıyla: Apple'ın sistemlerinde Option, Shift, Command ve tuş (`⌥`, `⇧`, `⌘`, `K`); ötekilerde Control, Alt, Shift ve tuş.
- `fun writtenOn(system: OperatingSystem): String`: Bu kısayolun `system`'de yazılışı: Apple'ın sistemlerinde `⌥⇧⌘K`, ötekilerde `Ctrl+Alt+Shift+K`.

### Modifier.onShortcut

`import com.pantrixui.foundation.keyboard.onShortcut`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.onShortcut(
    shortcut: PantrixShortcut,
    enabled: Boolean = true,
    onTrigger: () -> Unit
): Modifier
```

Odak bu düğümdeyken ya da içindeyken `shortcut` basılınca `onTrigger`'ı çalıştırır; odaktaki kontrole tuş verilmeden önce: odaktaki bir alan, çalıştırdığı kısayolun harfini yazmaz.

Bir tuş yalnızca odaktaki kontrole ve çevresindeki düğümlere verilir. Bütün pencerenin bir kısayolu için bunu pencerenin köküne, `shortcutRoot` ile birlikte koy; o, başka hiçbir şey odakta değilken odağı tutar: o olmadan bir kısayol, bir şey odaklanana dek duyulmaz.

```kotlin
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { palette = true }) { … }
```

Bir tuşun bastığı iki kısayoldan dıştaki çalışır. Bir kısayol çalıştıktan sonra tuşun kalkışı da odaktaki kontrolden saklanır; öyle ki Enter ile basılan bir düğme onu kendi basışı sanmaz. Temanın tanılaması açıkken, bunun çevresindeki bir düğümün de duyduğu bir kısayol `PantrixCheck.ShadowedShortcut` olarak bildirilir: burada hiç çalışmaz.

Parametreler:

- `shortcut: PantrixShortcut`: onu çalıştıran tuş ve değiştiriciler.
- `enabled: Boolean`: çalışıp çalışmadığı: çalışmayan, tuşunu geçirir.
- `onTrigger: () -> Unit`: çalıştırdığı.

### Modifier.shortcutRoot

`import com.pantrixui.foundation.keyboard.shortcutRoot`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.shortcutRoot(): Modifier
```

İçinde hiçbir şey odakta değilken bu düğümün odağı tutmasını sağlar; böylece üstündeki ve çevresindeki kısayollara o sırada basılan tuşlar verilir.

Bir tuş, odaktaki kontrole ve o kontrolün çevresindeki düğümlere verilir. Hiçbir şey odakta değilken, başta, henüz hiçbir şey odaklanmadan ve odak kaldırıldıktan sonra, hiçbirine verilmez ve bir pencerenin kökündeki kısayol duyulmaz. Bu düğüm o zamanlarda odağı alır ve onu isteyen neyse ona bırakır. Hiçbir şey çizmez, ekran okuyucuya bir şey söylemez ve Tab için bir durak değildir: ondan Tab, tuttuklarının içine gider.

Bunu bir pencerenin köküne, pencerenin kısayollarıyla (`onShortcut`) birlikte bir kez koy. Pantrix'in bir modal'ı bunun üstünde kendi penceresidir; açıkken altındaki odak olduğu yerde kalır. Bir pencerede iki kök yan yana durduğunda, biri ötekine yerini bırakırken iki ekranın bir an durduğu gibi, odağı tutan onu bırakmaz.

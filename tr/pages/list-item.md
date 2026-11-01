# List Item

Bir listenin satırı: bir başlık, onu başlatan ve bitiren şey, altında bir iki satır. Bir gelen kutusunun, ayarların ya da arama sonuçlarının satırı.

- `PantrixListItem` (`com.pantrixui.components.data.listitem`, `com.pantrixui:components`): Bir listenin satırı: üst yazılı bir başlık, bir yardım metni ve bir son yazı, onu başlatan ve bitiren, bir köşeli ok, bir basış, seçili hâli ve altında bir çizgi; her platformun liste yükseklikleriyle. Anahtar sözcükler: liste satırı, liste öğesi, tablo hücresi, ayar satırı, gelen kutusu satırı, iki satırlı liste, hücre.

## Özellikler

- **Satırlar.** `headline` satırın adıdır; `supportingText` altında daha küçük ve sessiz bir iki satır, `overline` üstünde kısa bir satır, `trailingText` başlığın satırının sonunda, onun taban çizgisinde kısa bir yazıdır: bir saat, bir sayı, bir ayarın değeri. Açıklama `supportingMaxLines` satırda kesilir, varsayılanı iki.
- **Başı ve sonu.** `leading` satırı başlatır (ikon, avatar, resim), `trailing` bitirir (rozet, etiket, anahtar). İkisi de satırın sessiz rengini alır. `chevron` satırın sonuna başka bir ekrana götürdüğünü söyleyen bir ok başı koyar; sağdan sola düzende döner ve okunmaz.
- **Basmak ve seçmek.** `onClick` verilen satır tek bir hedeftir, en az platformun dokunma hedefi kadar yüksektir, basışı, imlecin altında hafif bir dolguyu ve odak halkasını kendi kenarlarının içinde gösterir. `selected` satırı ana rolün container rengiyle doldurur ve ekran okuyucuya seçili olduğunu söyler.
- **Tek düğüm.** Ekran okuyucu satırı bir bütün olarak duyar: üst satır, başlık, sondaki yazı, açıklama. Sondaki bir anahtar ya da düğme kendi düğümü olarak kalır.
- **Çizgi.** `divider` satırın altına çizgi çizer: `Full` boydan boya, `Inset` yazının başladığı yerden, iOS'un listelerindeki gibi.
- **Platform.** Android'de Material 3'ün satırları (56, 72, 88dp), iOS'ta iOS'unkiler (44, 60, 76), masaüstünde ve web'de daha sık satırlar (36/52/68 ve 40/56/72). Başlık telefonda gövde yazısıyla, masaüstünde ve web'de etiket yazısıyla yazılır; `headlineStyle`, `supportingTextStyle` ve `trailingTextStyle` onları değiştirir.

## Kullanım

### An inbox: who wrote, when and about what

```kotlin
LazyColumn {
    items(messages, key = { it.id }) { message ->
        PantrixListItem(
            headline = message.from,
            supportingText = message.subject,
            trailingText = message.time,
            leading = { PantrixAvatar(contentDescription = null, initials = message.initials) },
            selected = message.id == open,
            onClick = { open = message.id },
            divider = ListItemDivider.Inset,
            tagKey = "message_" + message.id
        )
    }
}
```

### Settings that lead on

```kotlin
PantrixListItem(
    headline = stringResource(Res.string.downloads),
    trailingText = stringResource(Res.string.wifi_only),
    leading = { PantrixIcon(PantrixIcons.Download, contentDescription = null) },
    chevron = true,
    onClick = { navigate(Screen.Downloads) },
    tagKey = "downloads"
)
```

### Three lines, read and not pressed

```kotlin
PantrixListItem(
    headline = order.title,
    overline = order.date,
    supportingText = order.summary,
    trailing = { PantrixTag(text = order.status) },
    tagKey = "order_" + order.id
)
```

## Örnekler

### Gelen kutusu

Bir gelen kutusu: kim yazdı, ne zaman, ne hakkında. Bir satıra basmak onu seçer; seçili satır dolar. Çizgiler avatarların sütununu bölmeden yazının başladığı yerden çizilir.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.listitem.ListItemDivider
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.avatar.PantrixAvatar

var open by remember { mutableStateOf("0") }
Column {
    INBOX.forEachIndexed { index, mail ->
        PantrixListItem(
            headline = mail.from,
            supportingText = mail.subject,
            trailingText = mail.time,
            leading = { PantrixAvatar(contentDescription = null, initials = mail.initials) },
            selected = open == "$index",
            onClick = { open = "$index" },
            divider = ListItemDivider.Inset,
            tagKey = "mail_$index"
        )
    }
}

private class InboxMessage(
    val from: String,
    val initials: String,
    val subject: String,
    val time: String
)

private val INBOX = listOf(
    InboxMessage("Ayşe Demir", "AD", "Pazartesi toplantısının gündemi", "12:40"),
    InboxMessage("Mert Kaya", "MK", "Tasarım dosyaları hazır", "11:05"),
    InboxMessage("Elif Şahin", "EŞ", "Fatura: Ekim", "Dün")
)
```

### Ayarlar

Ayarlar: başka bir ekrana götüren satırların sonunda değerleri ve bir ok başı var. Bildirimlerin satırı basılmaz; sonundaki anahtar kendi başına bir denetimdir. Kapalı bir satır basılmaz ve soluk yazılır.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.listitem.ListItemDivider
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.icons.PantrixIcons

var notify by remember { mutableStateOf(true) }
Column {
    PantrixListItem(
        headline = "İndirmeler",
        trailingText = "Yalnızca Wi-Fi",
        leading = { PantrixIcon(PantrixIcons.Download, contentDescription = null) },
        chevron = true,
        onClick = {},
        divider = ListItemDivider.Full,
        tagKey = "downloads"
    )
    PantrixListItem(
        headline = "Bildirimler",
        supportingText = "Yeni bir mesaj gelince",
        leading = { PantrixIcon(PantrixIcons.Inbox, contentDescription = null) },
        trailing = {
            PantrixSwitchButton(
                checked = notify,
                onCheckedChange = { notify = it },
                contentDescription = "Bildirimler",
                tagKey = "notify"
            )
        },
        divider = ListItemDivider.Full,
        tagKey = "notifications"
    )
    PantrixListItem(
        headline = "Yedekleme",
        supportingText = "Planınızda yok",
        leading = { PantrixIcon(PantrixIcons.Upload, contentDescription = null) },
        chevron = true,
        onClick = {},
        enabled = false,
        tagKey = "backup"
    )
}
```

### Üç satır

Üç satır, okunur ve basılmaz: üstte tarih, altta iki satıra kadar açıklama, sonda bir etiket. Üç satırlık satırda baştaki ve sondaki öğe satırın üstünde durur.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.listitem.ListItemDivider
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone

Column {
    PantrixListItem(
        headline = "Sipariş 1042",
        overline = "28 Ekim",
        supportingText = "İki kitap ve bir defter. Kargoya verildi, yarın teslim edilmesi bekleniyor.",
        trailing = { PantrixTag(text = "Yolda", tone = TagTone.Info) },
        divider = ListItemDivider.Full,
        tagKey = "order_1042"
    )
    PantrixListItem(
        headline = "Sipariş 1039",
        overline = "21 Ekim",
        supportingText = "Bir kulaklık.",
        trailing = { PantrixTag(text = "Teslim edildi", tone = TagTone.Success) },
        tagKey = "order_1039"
    )
}
```

### Aramanın bulduğu

Bir arama sonucu: başlıkta aranan söz kalın yazılır (`AnnotatedString` alan aşırı yükleme), açıklama nerede bulunduğunu söyler.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons

val typed = "Area"
Column {
    listOf("Text Area", "Filled Text Area").forEachIndexed { index, title ->
        val at = title.indexOf(typed)
        PantrixListItem(
            headline = buildAnnotatedString {
                append(title.take(at))
                withStyle(SpanStyle(fontWeight = FontWeight.ExtraBold)) { append(typed) }
                append(title.drop(at + typed.length))
            },
            supportingText = "Bileşen · Form",
            leading = { PantrixIcon(PantrixIcons.Search, contentDescription = null) },
            onClick = {},
            tagKey = "found_$index"
        )
    }
}
```

### Kendi stili ve renkleri

Kendi stili ve renkleri: daha sık satırlar (`ListItemStyle`), başlık temanın `callout` rolüyle, seçili satır bir başarı rengiyle (`ListItemColors`), açıklama `footnote` yazısıyla (`supportingTextStyle`), fiyat kod yazısıyla (`trailingTextStyle`).

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.listitem.ListItemColors
import com.pantrixui.components.data.listitem.ListItemStyle
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.typography.TypeRole

val success = PantrixTheme.colors.success
var chosen by remember { mutableStateOf(0) }
Column {
    listOf("Haftalık" to "29 ₺", "Aylık" to "99 ₺", "Yıllık" to "990 ₺").forEachIndexed { index, (plan, price) ->
        PantrixListItem(
            headline = plan,
            supportingText = if (index == 2) "İki ay bizden" else null,
            trailingText = price,
            selected = chosen == index,
            onClick = { chosen = index },
            style = ListItemStyle(oneLineHeight = 40.dp, twoLineHeight = 52.dp, headlineRole = TypeRole.Callout),
            colors = ListItemColors(selectedContainer = success.container, selectedContent = success.onContainer),
            supportingTextStyle = PantrixTheme.typography.footnote,
            trailingTextStyle = PantrixTheme.typography.code,
            tagKey = "plan_$index"
        )
    }
}
```

## API

### PantrixListItem

`import com.pantrixui.components.data.listitem.PantrixListItem`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixListItem(
    headline: String,
    modifier: Modifier = Modifier,
    supportingText: String? = null,
    overline: String? = null,
    trailingText: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    chevron: Boolean = false,
    onClick: (() -> Unit)? = null,
    selected: Boolean = false,
    enabled: Boolean = true,
    divider: ListItemDivider = ListItemDivider.None,
    supportingMaxLines: Int = 2,
    style: ListItemStyle? = null,
    colors: ListItemColors? = null,
    tagKey: String? = null,
    headlineStyle: TextStyle? = null,
    supportingTextStyle: TextStyle? = null,
    trailingTextStyle: TextStyle? = null
)
```

Bir listenin satırı: bir başlık, onu başlatan ve bitiren şeyle ve altında bir iki satırla; mesajların, ayarların ya da sonuçların bir listesindeki gibi.

Satırın yaptığı her şey için `AnnotatedString` başlık alan aşırı yüklemeye bakın: bu, `headline`'ı olduğu gibi yazar.

Parametreler:

- `headline: String`: satırın ne olduğu, birkaç sözle: ekran okuyucu için adı.
- `modifier: Modifier`: satırın modifier'ı. Satır kendisine verilen genişlikte ve en az, stilinin taşıdığı satır sayısı için verdiği yükseklikte olur.
- `supportingText: String?`: başlığın altında daha küçük ve sessiz bir yazıyla bir iki satır: satırın fazladan söylediği.
- `overline: String?`: başlığın üstünde, temanın caption yazısıyla kısa bir satır: bir kategori, bir tarih.
- `trailingText: String?`: başlığın satırının sonunda, onun taban çizgisinde, `trailingTextStyle` ile yazılan kısa bir yazı: bir saat, bir sayı, bir ayarın değeri.
- `leading: (@Composable () -> Unit)?`: satırı başlatan: bir ikon, bir avatar, bir resim. Satırın sessiz rengini alır.
- `trailing: (@Composable () -> Unit)?`: satırı bitiren: bir rozet, bir düğme, bir anahtar. Satırın sessiz rengini alır.
- `chevron: Boolean`: başka bir ekrana götüren bir satır için, `trailing`'den sonra, satırın bir ok başıyla bitip bitmediği.
- `onClick: (() -> Unit)?`: satıra basmanın ne yaptığı. Null onu okunan ama basılmayan bir satır yapar.
- `selected: Boolean`: satırın seçili olan olup olmadığı, bir listenin yanında gösterilen mesaj gibi.
- `enabled: Boolean`: satırın basılabilip basılamadığı. Basılamayan devre dışı renkle yazılır.
- `divider: ListItemDivider`: satırın kendi altına çizdiği çizgi.
- `supportingMaxLines: Int`: `supportingText`'in kesilmeden önce kaç satıra uzadığı.
- `style: ListItemStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında.
- `colors: ListItemColors?`: bu satırın, temanınki olmayan kendi renkleri.
- `tagKey: String?`: satırın otomasyon anahtarı: satır `ListItem_<tagKey>`'dir.
- `headlineStyle: TextStyle?`: başlığın yazı stili: verilmezse stilin `headlineRole`'ü.
- `supportingTextStyle: TextStyle?`: açıklamanın yazı stili: verilmezse stilin `supportingRole`'ü.
- `trailingTextStyle: TextStyle?`: `trailingText`'in yazı stili: verilmezse `supportingTextStyle`; bir mesajın başlığının yanındaki saat, mesajın kendi küçük yazısıyla yazıldığı gibi.

### PantrixListItem

`import com.pantrixui.components.data.listitem.PantrixListItem`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixListItem(
    headline: AnnotatedString,
    modifier: Modifier = Modifier,
    supportingText: String? = null,
    overline: String? = null,
    trailingText: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    chevron: Boolean = false,
    onClick: (() -> Unit)? = null,
    selected: Boolean = false,
    enabled: Boolean = true,
    divider: ListItemDivider = ListItemDivider.None,
    supportingMaxLines: Int = 2,
    style: ListItemStyle? = null,
    colors: ListItemColors? = null,
    tagKey: String? = null,
    headlineStyle: TextStyle? = null,
    supportingTextStyle: TextStyle? = null,
    trailingTextStyle: TextStyle? = null
)
```

Başlığında sözlerden fazlası olan bir liste satırı: bir aramanın bulduğu yerde işaretlenmiş bir söz, kalın yazılmış bir parça.

Satır başlığını bir iki satırla yazar: üstünde bir `overline`, altında bir `supportingText`, satırının sonunda bir `trailingText`. `leading` ile `trailing`'in tuttuğu onların yanında durur; bir ya da iki satırlık bir satırın ortasında, üç satırlık bir satırın üstünde. Bir `chevron` satırın başka bir yere götürdüğünü söyler.

`onClick`'i olan satıra tek bir hedef olarak basılır, en az platformun dokunma hedefi kadar yüksektir: basışı, imlecin altında bir dolguyu ve kenarlarının içinde bir odak halkasını gösterir ve bir basışı, sözleri olmadan, bir `ListItem` olayı, `click`, olarak bildirir. `selected` bir satır ana rolün container rengiyle dolar, onunla eşlenen renkle yazılır ve bunu ekran okuyucuya söyler. Ekran okuyucu satırı tek bir düğüm olarak duyar: üst satır, başlık, sondaki yazı ve açıklama, bu sırayla. `trailing`'deki bir denetim, bir anahtar ya da düğme, kendi düğümü olarak kalır.

```kotlin
PantrixListItem(
    headline = buildAnnotatedString {
        append(entry.title.take(found.first))
        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append(entry.title.substring(found)) }
        append(entry.title.drop(found.last + 1))
    },
    supportingText = entry.where,
    onClick = { open(entry) }
)
```

Parametreler:

- `headline: AnnotatedString`: satırın ne olduğu, aralıklarıyla: ekran okuyucu için adı.
- `modifier: Modifier`: satırın modifier'ı. Satır kendisine verilen genişlikte ve en az, stilinin taşıdığı satır sayısı için verdiği yükseklikte olur.
- `supportingText: String?`: başlığın altında daha küçük ve sessiz bir yazıyla bir iki satır: satırın fazladan söylediği.
- `overline: String?`: başlığın üstünde, temanın caption yazısıyla kısa bir satır: bir kategori, bir tarih.
- `trailingText: String?`: başlığın satırının sonunda, onun taban çizgisinde, `trailingTextStyle` ile yazılan kısa bir yazı: bir saat, bir sayı, bir ayarın değeri.
- `leading: (@Composable () -> Unit)?`: satırı başlatan: bir ikon, bir avatar, bir resim. Satırın sessiz rengini alır.
- `trailing: (@Composable () -> Unit)?`: satırı bitiren: bir rozet, bir düğme, bir anahtar. Satırın sessiz rengini alır.
- `chevron: Boolean`: başka bir ekrana götüren bir satır için, `trailing`'den sonra, satırın bir ok başıyla bitip bitmediği. Satırın sessiz renginde çizilir, düzenin sağdan okunduğu yerde döner ve okunmaz.
- `onClick: (() -> Unit)?`: satıra basmanın ne yaptığı. Null onu okunan ama basılmayan bir satır yapar.
- `selected: Boolean`: satırın seçili olan olup olmadığı, bir listenin yanında gösterilen mesaj gibi.
- `enabled: Boolean`: satırın basılabilip basılamadığı. Basılamayan basış almaz ve devre dışı renkle yazılır.
- `divider: ListItemDivider`: satırın kendi altına çizdiği çizgi: hiç, satırı boydan boya geçen ya da yazısının başladığı yerden başlayan.
- `supportingMaxLines: Int`: `supportingText`'in üç noktayla kesilmeden önce kaç satıra uzadığı.
- `style: ListItemStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar, her platformda değişir.
- `colors: ListItemColors?`: bu satırın kendi renkleri: verdikleri, geri kalanlar için temanınkilerle.
- `tagKey: String?`: satırın otomasyon anahtarı: satır `ListItem_<tagKey>`'dir.
- `headlineStyle: TextStyle?`: başlığın yazı stili: verilmezse stilin `headlineRole`'ü. İçindeki bir renk başlığın değildir; başlığın rengi satırınkidir.
- `supportingTextStyle: TextStyle?`: açıklamanın yazı stili: verilmezse stilin `supportingRole`'ü.
- `trailingTextStyle: TextStyle?`: `trailingText`'in yazı stili: verilmezse `supportingTextStyle`; bir mesajın başlığının yanındaki saat, mesajın kendi küçük yazısıyla yazıldığı gibi.

### ListItemDivider

`import com.pantrixui.components.data.listitem.ListItemDivider`, `com.pantrixui:components` içinden

```kotlin
enum class ListItemDivider
```

Bir `PantrixListItem`'ın kendi altına çizdiği, onu altındaki satırdan ayıran çizgi.

Değerleri:

- `None`: Çizgi yok: satırları aralarındaki boşluk ya da listenin aralarına çizdiği ayırır.
- `Full`: Bütün satırın altında, bir yanından öteki yanına bir çizgi.
- `Inset`: Satırın altında, onu başlatanı geçip yazısının başladığı yerden başlayan bir çizgi, iOS'un listelerinin çizdiği gibi: satırların avatarları ya da ikonları kesintisiz bir sütunda durur.

### ListItemStyle

`import com.pantrixui.components.data.listitem.ListItemStyle`, `com.pantrixui:components` içinden

```kotlin
class ListItemStyle(
    public val oneLineHeight: Dp = Dp.Unspecified,
    public val twoLineHeight: Dp = Dp.Unspecified,
    public val threeLineHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val chevronSize: Dp = Dp.Unspecified,
    public val headlineRole: TypeRole? = null,
    public val supportingRole: TypeRole? = null
) : PantrixStyle<ListItemStyle>
```

`PantrixListItem`'ın geometrisi ve yazısı: bir, iki ve üç satırlık bir satırın en az ne kadar yüksek olduğu, içindekilerin çevresindeki ve arasındaki boşluk, dolgusunun köşeleri ve yazdığı yazılar.

Her platformun kendi listesi vardır: Android'de Material 3'ün satırları (56, 72 ve 88dp, kenarlardan 16dp içeride, başlık gövde yazısıyla), iOS'ta iOS'unkiler (44, 60 ve 76) ve bir imlecin yönettiği yerde daha sık satırlar, masaüstünde 36, 52 ve 68, web'de 40, 56 ve 72, başlıkları etiket yazısıyla. İçindekiler daha çok yer istediğinde, daha büyük bir yazının istediği gibi, satır uzar. Telefonda dolgu satırın kenarlarına kadar uzanır; masaüstünde ve web'de köşeleri yuvarlaktır.

Yükseklikler ve boşluklar yoğunluğa uyar. Köşeler, ok başı ve yazılar uymaz.

Parametreler:

- `oneLineHeight: Dp`: Yalnızca başlığından oluşan bir satırın en az yüksekliği.
- `twoLineHeight: Dp`: Bir başlık ve bir satırdan daha oluşan bir satırın en az yüksekliği: bir üst satır ya da bir açıklama.
- `threeLineHeight: Dp`: Bir başlık, bir üst satır ve bir açıklamadan oluşan bir satırın en az yüksekliği.
- `horizontalPadding: Dp`: Satırın kenarlarıyla içindekiler arasındaki boşluk.
- `verticalPadding: Dp`: Satır en az yüksekliğinden uzun olduğunda, içindekilerin üstündeki ve altındaki boşluk.
- `gap: Dp`: Satırı başlatan, yazısı ve onu bitiren arasındaki boşluk.
- `shape: ShapeSpec`: Satırın dolgusunun köşeleri: Android'de ve iOS'ta yok, masaüstünde ve web'de küçük.
- `chevronSize: Dp`: Başka bir yere götüren bir satırın sonundaki ok başının genişliği ve yüksekliği.
- `headlineRole: TypeRole?`: Başlığın yazısı: Android'de ve iOS'ta gövde, masaüstünde ve web'de etiket.
- `supportingRole: TypeRole?`: Açıklamanın ve sondaki yazının yazısı: Android'de ve iOS'ta etiket, masaüstünde ve web'de dipnot (footnote).

### ListItemColors

`import com.pantrixui.components.data.listitem.ListItemColors`, `com.pantrixui:components` içinden

```kotlin
data class ListItemColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val supportingContent: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

Bir `PantrixListItem`'ın, temanınki olmayan yerlerde boyandığı renkler: verilen bir renk kullanılır, bırakılan temanınki kalır.

```kotlin
PantrixListItem(
    headline = message.from,
    supportingText = message.subject,
    selected = message.id == open,
    onClick = { open = message.id },
    colors = ListItemColors(selectedContainer = brand.container, selectedContent = brand.onContainer)
)
```

`container` verilmedikçe satırın kendi dolgusu yoktur: onu tutanın üstünde durur ve orada yazılan renkle yazılır; temanın zeminlerinde temanın yazısıyla, çevresindeki bir dolgunun üstünde o dolgunun verdiği renkle.

Parametreler:

- `container: Color`: Satırın kendi dolgusu: varsayılanı yok.
- `content: Color`: Başlık ve sondaki yazı: temanın zeminlerinde temanın birincil yazısı, bir dolgunun üstünde orada okunan renk.
- `supportingContent: Color`: Üst satır, açıklama ve ok başı: temanın zeminlerinde temanın ikincil yazısı, bir dolgunun üstünde `content`.
- `selectedContainer: Color`: Seçili bir satırın dolgusu: ana rolün `container`'ı.
- `selectedContent: Color`: Seçili bir satırın yazıldığı renk: temanın `selectedContainer` ile eşlediği.
- `divider: Color`: Çizgi çizen bir satırın altındaki çizgi: temanın zeminlerinde temanın ayırıcısı, bir dolgunun üstünde `content`'in bir payı.

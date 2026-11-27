# Text

Temanın yazı ölçeğinde bir metin: bir paragraf, bir başlık, bir etiket. `style` metnin nasıl yazıldığını, `role` ekran okuyucunun onu ne olarak duyduğunu söyler: ikisi ayrı şeylerdir ve biri ötekinin yerini tutmaz.

Metin stilinin boyutunda yazılır; yerine sığmayan kısmı kesilir. Sığmak için küçülmesi gereken metin `PantrixAutoText`'tir.

- `PantrixText` (`com.pantrixui.components.elements.text`, `com.pantrixui:components`): Temanın yazı rollerinden birindeki yazı; ekran okuyucu onu düz yazı, başlık ya da etiket olarak duyar, ya da hiç duymaz. Anahtar sözcükler: yazı, metin, etiket, paragraf, başlık, tipografi, açıklama yazısı.

## Özellikler

- **Yazı ölçeği.** `style` temanın dokuz stilinden birini alır: büyükten küçüğe `display`'den `caption`'a sekiz stil, ve eş aralıklı `code`. Stil verilmeyen metin `label` stilinde yazılır.
- **Rol.** `role` metnin ne olduğunu söyler: düz yazı (`Paragraph`, varsayılan), başlık (`Heading`), etiket (`Label`) ya da süs (`Decorative`). Başlık gibi yazılmış ama başlık olarak işaretlenmemiş bir metne, ekran okuyucuyla başlıktan başlığa gezen kullanıcı uğramaz.
- **Renk.** Sırayla: `color`, stilin kendi rengi, metnin durduğu yerin içerik rengi, temanın `textPrimary`'si. Sayfada, bir yüzeyde ve bir kartta metin `textPrimary` ile yazılır; bir dolgunun üstünde, orada okunan rengi kendiliğinden alır.
- **Satırlar ve taşma.** `maxLines` metnin en çok, `minLines` en az kaç satır tutacağını söyler. Sığmayan kısım `overflow`'un dediği gibi kesilir: varsayılanı üç noktadır.
- **Hizalama.** `textAlign` satırları metnin kendi genişliği içinde hizalar.
- **Seçilebilir metin.** `selectable` ile kullanıcı metni seçer ve kopyalar.
- **Biçimli metin.** `AnnotatedString` alan ikinci bir `PantrixText` vardır: bir cümlenin içinde kalın, renkli ya da başka boyda parçalar, bağlantılar, ve `inlineContent` ile satırın içine yerleşen bir ikon.
- **Otomasyon.** `tagKey` verilen metin `Text_<tagKey>` etiketini taşır. Anahtar verilmeyen metin etiketlenmez.

## Kullanım

### Section heading

```kotlin
PantrixText(
    text = stringResource(Res.string.account),
    style = PantrixTheme.typography.headline,
    role = TextRole.Heading(level = 2)
)
```

### Muted supporting text

```kotlin
PantrixText(
    text = stringResource(Res.string.sync_hint),
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

## Örnekler

### Stil verilmeyen metin

En az yazılan hâli: yalnızca metin. Stil verilmediği için temanın `label` stilinde, renk verilmediği için temanın `textPrimary` rengiyle yazılır. İkinci satır aynı metnin `label` stili açıkça verilmiş hâlidir: ikisi aynıdır.

`label` bir kontrolün etiketinin stilidir. Bir paragrafa `body`, bir başlığa `title` ya da `headline` stilini sen verirsin: üçüncü satır `body` ile yazıldı.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixText(text = "Siparişin yola çıktı", tagKey = "no_style")
PantrixText(text = "Siparişin yola çıktı", style = PantrixTheme.typography.label)
PantrixText(text = "Siparişin yola çıktı", style = PantrixTheme.typography.body)
```

### Yazı ölçeği

Temanın dokuz stili, büyükten küçüğe: her satır kendi stiliyle yazıldı ve o stilin ne için olduğunu söylüyor. Bir stil yazının boyutunu, satır yüksekliğini, ağırlığını ve harf aralığını birlikte taşır.

`code` eş aralıklı bir yazıyla yazılır. Stillerin ölçüleri "Tipografi" sayfasında, temadan okunarak yazar.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val typography = PantrixTheme.typography
PantrixText(text = "display: sayfanın başlığı", style = typography.display)
PantrixText(text = "headline: bölüm başlığı", style = typography.headline)
PantrixText(text = "title: kartın, panelin, dialog'un başlığı", style = typography.title)
PantrixText(text = "callout: öne çıkan gövde metni, boş bir ekranın açıklaması", style = typography.callout)
PantrixText(text = "body: gövde metni, bir paragraf, bir açıklama", style = typography.body)
PantrixText(text = "label: bir kontrolün etiketi, stil verilmeyen metin", style = typography.label)
PantrixText(text = "footnote: yardımcı metin, bir alanın altındaki açıklama", style = typography.footnote)
PantrixText(text = "caption: küçük bilgi, bir saat, bir sayaç", style = typography.caption)
PantrixText(text = "code: order_id = 8F2A-19C4", style = typography.code)
```

### Roller

`role` metnin ne olduğunu söyler; nasıl göründüğünü `style` söyler. `TextRole.Heading` metni ekran okuyucuya başlık olarak bildirir: okuyucuyla başlıktan başlığa gezen kullanıcı ona uğrar. `level` başlığın derinliğidir: 1 sayfanın başlığı, 2 bölümleri. Büyük ve kalın yazılmış ama rolü verilmemiş bir metin okuyucu için düz yazıdır.

`Paragraph` ve `Label` oldukları gibi okunur. `Decorative` metin okuyucudan gizlenir ve sözleri hiç okunmaz: başka bir şeyin zaten söylediğini yineleyen metin içindir. Burada büyük "%72", altındaki cümlenin resmidir; okuyucu yalnızca cümleyi okur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

val typography = PantrixTheme.typography
PantrixText(
    text = "Hesap",
    style = typography.headline,
    role = TextRole.Heading(level = 1),
    tagKey = "heading_account"
)
PantrixText(
    text = "Depolama",
    style = typography.title,
    role = TextRole.Heading(level = 2),
    tagKey = "heading_storage"
)
PantrixText(text = "%72", style = typography.display, role = TextRole.Decorative, tagKey = "share")
PantrixText(text = "Depolama alanının yüzde 72'si dolu.", style = typography.body)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(text = "Plan", role = TextRole.Label)
    PantrixText(text = "Aylık, 50 GB", color = PantrixTheme.colors.textSecondary)
}
```

### Renk ve durduğu yerin rengi

Renk verilmeyen metin sayfada temanın `textPrimary` rengiyle yazılır. `color` onu değiştirir: ikincil bir bilgiye `textSecondary`, bir hataya `danger` rolünün rengi.

Bir dolgunun üstünde renk yine verilmez. `PantrixSurface` bir rolün rengiyle doldurulunca içindeki metin, o dolgunun üstünde okunan rengi kendiliğinden alır: ilk kutuda `primary.onColor`, ikincisinde `success.onContainer`. Temanın kendi yüzeyi bir dolgu değil, bir zemindir: üçüncü kutudaki metin yine `textPrimary` ile yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val inside = Modifier.padding(PantrixTheme.spacing.md)
PantrixText(text = "Renk verilmedi")
PantrixText(text = "Son güncelleme: 2 dakika önce", color = colors.textSecondary)
PantrixText(text = "Kart numarası geçersiz", color = colors.danger.color, tagKey = "error")
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixSurface(color = colors.primary.color) {
        PantrixText(text = "primary dolgusunda", modifier = inside)
    }
    PantrixSurface(color = colors.success.container) {
        PantrixText(text = "success.container dolgusunda", modifier = inside)
    }
    PantrixSurface(border = colors.divider) {
        PantrixText(text = "Temanın yüzeyinde", modifier = inside)
    }
}
```

### En çok satır ve taşma

Aynı paragraf üç kez, en fazla 320dp genişliğinde bir sütunda. İlki istediği kadar satır tutar. İkincisi `maxLines = 2` ile iki satırda kalır ve sığmayan kısmı üç noktayla biter: `overflow`'un varsayılanı `TextOverflow.Ellipsis`'tir. Üçüncüsü tek satırdır ve `TextOverflow.Clip` ile, üç nokta konmadan kesilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val paragraph = "Siparişin kargoya verildi. Teslimat adresine yarın 09:00 ile 18:00 arasında ulaşacak; kurye " +
    "kapıya gelmeden önce seni arayacak."
Column(
    modifier = Modifier.widthIn(max = 320.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixText(text = paragraph, style = PantrixTheme.typography.body)
    PantrixText(text = paragraph, style = PantrixTheme.typography.body, maxLines = 2, tagKey = "two_lines")
    PantrixText(
        text = paragraph,
        style = PantrixTheme.typography.body,
        maxLines = 1,
        overflow = TextOverflow.Clip,
        tagKey = "clipped"
    )
}
```

### En az satır

`minLines` kısa bir metne de o kadar satırlık yer tutturur. Yan yana duran iki kutunun başlıkları `minLines = 2` ve `maxLines = 2` ile yazıldı: biri tek satıra sığar, öteki iki satırdan uzundur, ama ikisi de iki satır yer tutar. Böylece altlarındaki fiyatlar aynı hizada durur ve kutular aynı boydadır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val spacing = PantrixTheme.spacing
Row(
    modifier = Modifier.widthIn(max = 420.dp),
    horizontalArrangement = Arrangement.spacedBy(spacing.md)
) {
    PantrixSurface(modifier = Modifier.weight(1f), border = colors.divider) {
        Column(modifier = Modifier.padding(spacing.md), verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(text = "Çay", style = PantrixTheme.typography.callout, maxLines = 2, minLines = 2)
            PantrixText(text = "45,00 TL", color = colors.textSecondary)
        }
    }
    PantrixSurface(modifier = Modifier.weight(1f), border = colors.divider) {
        Column(modifier = Modifier.padding(spacing.md), verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = "Soğuk demlenmiş, tarçınlı ve portakallı filtre kahve",
                style = PantrixTheme.typography.callout,
                maxLines = 2,
                minLines = 2
            )
            PantrixText(text = "120,00 TL", color = colors.textSecondary)
        }
    }
}
```

### Hizalama

`textAlign` satırları metnin kendi genişliği içinde hizalar. Bu yüzden metinlere `fillMaxWidth()` verildi: yalnızca sözleri kadar geniş bir metnin içinde hizalanacak yer yoktur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import com.pantrixui.components.elements.text.PantrixText

PantrixText(text = "Başa hizalı", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Start)
PantrixText(text = "Ortalanmış", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center)
PantrixText(text = "Sona hizalı", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.End)
```

### Seçilebilir metin

`selectable = true` ile kullanıcı metni seçer ve kopyalar. Başka bir yere taşınacak metin içindir: bir sipariş numarası, bir IBAN, bir hata kodu. Ekran okuyucu onu öteki metinler gibi okur.

İkinci satırdaki numarayı seçmeyi dene; üstündeki etiket seçilemez.

```kotlin
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

PantrixText(text = "Sipariş numarası", style = PantrixTheme.typography.footnote, role = TextRole.Label)
PantrixText(
    text = "PX-2026-0001-8F2A-19C4",
    style = PantrixTheme.typography.code,
    selectable = true,
    tagKey = "order_number"
)
```

### Biçimli metin

`AnnotatedString` alan `PantrixText`: tek bir metnin içinde ayrı biçimde parçalar. Stili, rengi, satırları ve rolü düz metindekiyle aynıdır.

İlk satırda tutarın kuruşu `0.6.em` ile yazıldı: `em`, çevresindeki yazının boyutunun payıdır. İkinci satırda bir parça kalın, bir parça `danger` rolünün renginde. Üçüncü satırda bir bağlantı var; altı çizilidir, çünkü cümlesinden yalnızca renkle ayrılan bir bağlantıyı renkleri ayırt edemeyen göremez. Bağlantıya bas: uygulamanın snackbar'ı haber verir.

```kotlin
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextLinkStyles
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withLink
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.em
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val colors = PantrixTheme.colors
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val price = buildAnnotatedString {
    append("1.250")
    withStyle(SpanStyle(fontSize = 0.6.em)) { append(",00 TL") }
}
val notice = buildAnnotatedString {
    append("Ödemen ")
    withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append("28 Ekim") }
    append(" tarihinde alınacak. ")
    withStyle(SpanStyle(color = colors.danger.color)) { append("Kartının süresi dolmak üzere.") }
}
val linkStyles = TextLinkStyles(
    style = SpanStyle(color = colors.primary.color, textDecoration = TextDecoration.Underline)
)
val terms = buildAnnotatedString {
    append("Devam ederek ")
    withLink(
        LinkAnnotation.Clickable(tag = "terms", styles = linkStyles) {
            scope.launch { snackbars?.show(message = "Kullanım koşulları açıldı") }
        }
    ) {
        append("kullanım koşullarını")
    }
    append(" kabul etmiş olursun.")
}
PantrixText(text = price, style = PantrixTheme.typography.headline, tagKey = "price")
PantrixText(text = notice, style = PantrixTheme.typography.body)
PantrixText(text = terms, style = PantrixTheme.typography.body, tagKey = "terms")
```

### Satırın içinde bir ikon

`inlineContent` satırın içine metin olmayan bir şey koyar. Metinde `appendInlineContent` ile bir yer ayrılır; `inlineContent` o yerin anahtarına ne çizileceğini ve ne kadar yer tutacağını söyler. Burada cümlenin ortasında bir ikon var: yazıyla aynı satırda durur.

`appendInlineContent`'in ikinci değeri o yerin metindeki karşılığıdır: ekran okuyucu ikonu bu sözle okur.

```kotlin
import androidx.compose.foundation.text.InlineTextContent
import androidx.compose.foundation.text.appendInlineContent
import androidx.compose.ui.text.Placeholder
import androidx.compose.ui.text.PlaceholderVerticalAlign
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val hint = buildAnnotatedString {
    append("Bir ürün bulmak için ")
    appendInlineContent(id = "search", alternateText = "arama")
    append(" düğmesine bas.")
}
PantrixText(
    text = hint,
    style = PantrixTheme.typography.body,
    inlineContent = mapOf(
        "search" to InlineTextContent(
            placeholder = Placeholder(
                width = 1.25.em,
                height = 1.25.em,
                placeholderVerticalAlign = PlaceholderVerticalAlign.TextCenter
            )
        ) {
            PantrixIcon(imageVector = PantrixIcons.Search, contentDescription = null, size = 20.dp)
        }
    ),
    tagKey = "hint"
)
```

## API

### PantrixText

`import com.pantrixui.components.elements.text.PantrixText`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixText(
    text: String,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = Int.MAX_VALUE,
    minLines: Int = 1,
    overflow: TextOverflow = TextOverflow.Ellipsis,
    softWrap: Boolean = true,
    role: TextRole = TextRole.Paragraph,
    selectable: Boolean = false,
    onTextLayout: ((TextLayoutResult) -> Unit)? = null,
    tagKey: String? = null
)
```

Temanın yazı ölçeğinde bir metin. `style` verilmezse temel yazıdır, `LocalPantrixTextStyle`: label stili ya da ekranın çevresindeki bölümünün verdiği. `role` ekran okuyucuya metnin ne olduğunu söyler: bir başlık, bir etiket ya da süs. `selectable` ile kullanıcı metni seçer ve kopyalar.

Renk `color`'dır. Verilmezse stilin rengi, o da yoksa temanın `textPrimary`'sidir: temanın kendi zeminlerinde, yani sayfada, bir yüzeyde ve bir kartta metin birincil yazı rengiyle yazılır. Bunu yalnızca bir dolgu değiştirir: dolu bir düğmenin, bir rolün rengiyle doldurulmuş bir kartın ya da içeriğine renk veren başka bir şeyin üstünde metin o rengi alır. Orada okunan renk odur.

Metin stilinin söylediği boyutta yazılır ve sığmayan kısmı `overflow`'un dediği gibi kesilir. Yerine sığmak için küçülmesi gereken metin `PantrixAutoText`'tir.

Parametreler:

- `text: String`: metin.
- `modifier: Modifier`: metnin modifier'ı.
- `style: TextStyle`
- `color: Color`
- `textAlign: TextAlign?`: satırların metnin genişliği içinde nasıl hizalandığı.
- `maxLines: Int`: metnin en çok kaç satır aldığı; onları aşan kısım `overflow`'un dediği gibi kesilir.
- `minLines: Int`: metnin en az kaç satır yüksekliğinde olduğu.
- `overflow: TextOverflow`
- `softWrap: Boolean`: metnin, genişliğinin bittiği yerde satırlara bölünüp bölünmediği.
- `role: TextRole`
- `selectable: Boolean`
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: metin yerleştirilirken onunla çağrılır.
- `tagKey: String?`: metnin otomasyon anahtarı: metin `Text_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.

### PantrixText

`import com.pantrixui.components.elements.text.PantrixText`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixText(
    text: AnnotatedString,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = Int.MAX_VALUE,
    minLines: Int = 1,
    overflow: TextOverflow = TextOverflow.Ellipsis,
    softWrap: Boolean = true,
    role: TextRole = TextRole.Paragraph,
    selectable: Boolean = false,
    inlineContent: Map<String, InlineTextContent> = emptyMap(),
    onTextLayout: ((TextLayoutResult) -> Unit)? = null,
    tagKey: String? = null
)
```

`AnnotatedString` alan `PantrixText`: metnin biçimli parçalarını ve bağlantılarını çizer, metnin adını verdiği yer tutucular için de `inlineContent` alır.

Parametreler:

- `text: AnnotatedString`: metin, aralıkları ve bağlantılarıyla.
- `modifier: Modifier`: metnin modifier'ı.
- `style: TextStyle`: temel metin: verilmezse `LocalPantrixTextStyle`, yani label rolü ya da ekranın çevresindeki bir parçanın sağladığı.
- `color: Color`: metnin rengi, yoksa stilin rengi, o da yoksa temanın `textPrimary`'si; bir dolgunun üstünde, oraya yazılan renk.
- `textAlign: TextAlign?`: satırların metnin genişliği içinde nasıl hizalandığı.
- `maxLines: Int`: metnin en çok kaç satır aldığı; onları aşan kısım `overflow`'un dediği gibi kesilir.
- `minLines: Int`: metnin en az kaç satır yüksekliğinde olduğu.
- `overflow: TextOverflow`: `maxLines`'tan uzun bir metnin nasıl kesildiği: başka bir şey söylenmedikçe üç noktayla.
- `softWrap: Boolean`: metnin, genişliğinin bittiği yerde satırlara bölünüp bölünmediği.
- `role: TextRole`: metnin ekran okuyucu için ne olduğu: düz yazı, bir başlık, bir etiket ya da süs.
- `selectable: Boolean`: kullanıcının metni seçip kopyalayıp kopyalayamayacağı.
- `inlineContent: Map<String, InlineTextContent>`
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: metin yerleştirilirken onunla çağrılır.
- `tagKey: String?`: metnin otomasyon anahtarı: metin `Text_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.

### TextRole

`import com.pantrixui.components.elements.text.TextRole`, `com.pantrixui:components` içinden

```kotlin
sealed interface TextRole
```

Bir metnin ne *olduğu*: ekran okuyucunun ona nasıl davranacağını bu belirler.

Görsel bir stil bunun yerini tutmaz: başlık gibi yazılmış ama başlık olarak işaretlenmemiş bir metin başlıktan başlığa gezinmede görünmez, oysa ekran okuyucu kullanan herkes bir sayfaya göz gezdirmek için bu gezinmeye güvenir.

#### TextRole.Paragraph

```kotlin
data object Paragraph : TextRole
```

Düz yazı.

#### TextRole.Heading

```kotlin
data class Heading(val level: Int) : TextRole
```

`level` düzeyinde bir başlık (1 = sayfanın başlığı). Başlıktan başlığa gezinmeyi sağlar.

Parametreler:

- `level: Int`: Başlığın derinliği: sayfanın başlığı için 1, bölümleri için 2, ve böyle aşağı doğru.

#### TextRole.Label

```kotlin
data object Label : TextRole
```

Bir kontrolü ya da bir değeri adlandırır.

#### TextRole.Decorative

```kotlin
data object Decorative : TextRole
```

Yalnızca görseldir: yardımcı teknolojilerden gizlenir.

Başka bir şeyin zaten duyurduğu metin içindir: içerik açıklaması kişinin tam adı olan bir avatarın içindeki harf gibi. Sözleri semantik ağacına girmez, böylece tek bir öğe olarak duyulan bir üst öğe onları kendi sözleriyle birlikte okumaz: bir test onu etiketiyle bulur.

### PantrixTypography

`import com.pantrixui.foundation.token.typography.PantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixTypography(
    val display: TextStyle,
    val headline: TextStyle,
    val title: TextStyle,
    val callout: TextStyle,
    val body: TextStyle,
    val label: TextStyle,
    val footnote: TextStyle,
    val caption: TextStyle,
    val code: TextStyle
)
```

Dokuz yazı stili: büyükten küçüğe sekizi, `display > headline > title > callout > body > label > footnote > caption`, ve yanlarında `code`: label boyutunda, eş aralıklı bir ailede.

Parametreler:

- `display: TextStyle`: Sayfa başlığı. Çoğunlukla ekranda bir tane olur.
- `headline: TextStyle`: Bölüm başlığı.
- `title: TextStyle`: Kart, panel ya da dialog başlığı.
- `callout: TextStyle`: Öne çıkan gövde: bir giriş paragrafı, boş bir ekranın açıklaması.
- `body: TextStyle`: Gövde metni: bir paragraf, bir açıklama, Android'de ve iOS'ta bir alana yazılan.
- `label: TextStyle`: Kontrol etiketi: düğme, gezinme öğesi, form alanının etiketi, sekme; masaüstünde ve web'de bir alana yazılan. Temel yazı: tema `LocalPantrixTextStyle`'ı bununla başlatır, bu yüzden stil verilmeyen bir `PantrixText` bununla yazılır.
- `footnote: TextStyle`: Yardım metni: form yardımı, hata açıklaması, ikincil yönlendirme.
- `caption: TextStyle`: Üst veri: zaman damgası, sayaç, tablo hücresinin ayrıntısı.
- `code: TextStyle`: Kimlik taşıyan metin: ID'ler, olay adları, kod parçaları; bir kod bloğunun ve bir JSON görünümünün yazıldığı stil.

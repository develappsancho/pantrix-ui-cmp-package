# Auto Text

Görünür kalmak için küçülen metin: bir tutar, bir başlık, bir ad. Yerine sığdığı sürece stilinin boyutundadır; sığmadığında, bütünü görünecek en büyük boyuta iner ve kısaldıkça yeniden büyür.

Geri kalan her şeyde `PantrixText`'tir: temanın yazı ölçeği, durduğu yerin rengi, ekran okuyucuya söylediği rol.

- `PantrixAutoText` (`com.pantrixui.components.elements.autotext`, `com.pantrixui:components`): Kendisine verilen genişliğe, yüksekliğe ve satırlara sığmak için küçülen, kısaldıkça yeniden büyüyen yazı; tek satırda ya da birkaçında, en küçük bir boyuta kadar. Anahtar sözcükler: otomatik boyut, sığdır, küçülen yazı, sığan yazı, duyarlı yazı, tutar.

## Özellikler

- **Tek satır.** Aksi söylenmedikçe metin tek satırdır (`maxLines = 1`) ve verilen genişliğe sığdırılır.
- **Birden çok satır.** `maxLines` büyütülünce metin önce satırlara bölünür, satırlar yetmeyince küçülür. Küçülen metnin satırları da birbirine o kadar yaklaşır: satır yüksekliği yazının boyutunu izler.
- **Kutusuna sığan metin.** `maxLines = Int.MAX_VALUE` satır sayısını yüksekliğe bırakır: metin verilen genişliğe ve yüksekliğe birlikte sığdırılır.
- **En küçük boyut.** Metin `minFontSize`'a inince küçülmeyi bırakır ve sığmayan kısmı `overflow`'un dediği gibi kesilir. Verilmezse temanın `footnote` boyutudur; `sp` ile ya da stilin boyutunun payı olarak `em` ile verilir.
- **Sığacağı yer.** Metne bir genişlik verilmelidir: `fillMaxWidth()`, bir `weight` ya da bir boyut; satır sayısı serbestse bir yükseklik de. Önüne istediği kadar genişlik konan metin hiç küçülmez.
- **Biçimli metin.** `AnnotatedString` alan ikinci bir `PantrixAutoText` vardır. Bir parçanın `em` ile verilen boyutu metinle birlikte küçülür; `sp` ile verilen olduğu gibi kalır.
- **İlk karede.** Boyut metin yerleştirilirken bulunur: metin ilk karede de sığmış hâliyle çizilir.
- **Otomasyon.** `tagKey` verilen metin `AutoText_<tagKey>` etiketini taşır. Anahtar verilmeyen metin etiketlenmez.

## Kullanım

### A balance on one line

```kotlin
PantrixAutoText(
    text = balance,
    modifier = Modifier.fillMaxWidth(),
    style = PantrixTheme.typography.display,
    tagKey = "balance"
)
```

### A title on two lines at the most

```kotlin
PantrixAutoText(
    text = article.title,
    modifier = Modifier.fillMaxWidth(),
    style = PantrixTheme.typography.headline,
    minFontSize = PantrixTheme.typography.body.fontSize,
    maxLines = 2,
    role = TextRole.Heading(level = 2)
)
```

### As large as its box lets it be

```kotlin
PantrixAutoText(
    text = stringResource(Res.string.quote),
    modifier = Modifier.size(width = 240.dp, height = 120.dp),
    style = PantrixTheme.typography.title,
    maxLines = Int.MAX_VALUE
)
```

## Örnekler

### Yerine sığan metin

Aynı ad, giderek daralan üç yerde, `title` stiliyle. Yeri yettiği sürece metin stilinin boyutundadır. Yetmeyince tek satırda, bütünü görünecek en büyük boyuta iner. En küçük boyutunda, temanın `footnote` boyutunda da sığmazsa küçülmeyi bırakır ve sığmayan kısmı üç noktayla kesilir.

Yeri metne `modifier` verir: burada bir genişlik. Gri zemin o yeri gösterir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.foundation.theme.PantrixTheme

val name = "Selim Karaosmanoğlu"
val room = PantrixTheme.colors.neutral.container
PantrixAutoText(
    text = name,
    modifier = Modifier.width(320.dp).background(room),
    style = PantrixTheme.typography.title,
    tagKey = "name_wide"
)
PantrixAutoText(
    text = name,
    modifier = Modifier.width(160.dp).background(room),
    style = PantrixTheme.typography.title,
    tagKey = "name_narrow"
)
PantrixAutoText(
    text = name,
    modifier = Modifier.width(72.dp).background(room),
    style = PantrixTheme.typography.title,
    tagKey = "name_narrowest"
)
```

### Tek satırda küçülen bakiye

En büyük stilde bir bakiye. "Hane ekle" tutarı uzatır: tutar satıra sığdığı sürece stilinin boyutundadır, sığmayınca tek satırda kalacak kadar küçülür; "Hane sil" ile yeniden büyür. Altındaki soluk satır aynı metnin küçülmeyen hâlidir, bir `PantrixText`: sığmayınca kesilir.

Kuruş ve para birimi tutarın yarı boyutundadır. Boyutları `em` ile verildi: çevresindeki yazının payıdır, tutar küçülünce onunla birlikte küçülür ve her platformda yarısı kadar kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.em
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var digits by rememberSaveable { mutableIntStateOf(4) }
val balance = buildAnnotatedString {
    append("1".padEnd(digits, '0').groupedInThousands())
    withStyle(SpanStyle(fontSize = 0.5.em)) { append(",00 TL") }
}
PantrixAutoText(
    text = balance,
    modifier = Modifier.fillMaxWidth(),
    style = PantrixTheme.typography.display,
    tagKey = "balance"
)
PantrixText(
    text = balance,
    style = PantrixTheme.typography.display,
    color = PantrixTheme.colors.textSecondary,
    maxLines = 1,
    tagKey = "balance_cut"
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Hane ekle",
        onClick = { digits++ },
        enabled = digits < 24,
        tagKey = "add_digit"
    )
    PantrixButton(
        text = "Hane sil",
        onClick = { digits-- },
        variant = ButtonVariant.Outline,
        enabled = digits > 1,
        tagKey = "remove_digit"
    )
}

private fun String.groupedInThousands(): String = reversed().chunked(3).joinToString(".").reversed()
```

### En çok iki satırda bir başlık

En çok iki satıra sığdırılan bir başlık: `maxLines = 2`. Metin önce iki satıra bölünür; iki satır yetmeyince küçülür ve satır aralığı da yazıyla birlikte daralır. `minFontSize` temanın `body` boyutudur: başlık ondan küçük yazılmaz, orada da sığmazsa üç noktayla kesilir.

Küçülse de bir başlıktır: `role = TextRole.Heading(level = 2)` ekran okuyucuya öyle bildirilir. Sütun en fazla 420dp genişliğindedir, başlık onu doldurur.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme

Column(modifier = Modifier.widthIn(max = 420.dp)) {
    PantrixAutoText(
        text = "Kredi kartı ekstreniz kesildi: son ödeme tarihi ayın yirmi sekizi",
        modifier = Modifier.fillMaxWidth(),
        style = PantrixTheme.typography.headline,
        minFontSize = PantrixTheme.typography.body.fontSize,
        maxLines = 2,
        role = TextRole.Heading(level = 2),
        tagKey = "statement_title"
    )
}
```

### Kutusuna sığan paragraf

Yüksekliği belli bir kutuya sığdırılan bir paragraf. `maxLines = Int.MAX_VALUE` satır sayısını kutunun yüksekliğine bırakır: metin, stilinin boyutunu aşmadan, 96dp'lik kutunun genişliğine ve yüksekliğine birlikte sığacak en büyük boyutta yazılır. Pencereyi daralt: kutu daraldıkça yazı küçülür.

Kutunun zemini ve iç boşluğu metnin kendi `modifier`'ındadır; metin, boşluktan kalan yere sığdırılır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixAutoText(
    text = "Bir tasarım sistemi, aynı kararı her ekranda yeniden vermemek için vardır: bir kez verilir, her " +
        "yerde aynı görünür.",
    modifier = Modifier
        .fillMaxWidth()
        .height(96.dp)
        .background(PantrixTheme.colors.neutral.container)
        .padding(PantrixTheme.spacing.sm),
    style = PantrixTheme.typography.title,
    textAlign = TextAlign.Center,
    maxLines = Int.MAX_VALUE,
    tagKey = "quote"
)
```

### En küçük boyut

Aynı metin, aynı 200dp'lik yerde üç kez; yalnızca `minFontSize` farklı. Metin o boyuta inince küçülmeyi bırakır: en küçük boyut ne kadar küçükse metin o kadar küçülebilir ve o kadar çoğu görünür.

İlkinin en küçük boyutu `16.sp`'dir. İkincisine verilmedi: temanın `footnote` boyutudur. Üçüncüsününki `0.4.em`: `em` stilin kendi boyutunun payıdır, burada `title` boyutunun onda dördü.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.foundation.theme.PantrixTheme

val airport = "Sabiha Gökçen Uluslararası Havalimanı"
val room = Modifier.width(200.dp).background(PantrixTheme.colors.neutral.container)
PantrixAutoText(
    text = airport,
    modifier = room,
    style = PantrixTheme.typography.title,
    minFontSize = 16.sp,
    tagKey = "min_16sp"
)
PantrixAutoText(text = airport, modifier = room, style = PantrixTheme.typography.title, tagKey = "min_default")
PantrixAutoText(
    text = airport,
    modifier = room,
    style = PantrixTheme.typography.title,
    minFontSize = 0.4.em,
    tagKey = "min_em"
)
```

### Yan yana kutularda, bir dolgunun üstünde

Yan yana iki kutuda birer sayı, `headline` stiliyle. Kutular genişliği `weight` ile paylaşır ve her sayı kendi kutusuna sığdırılır: kısa olan stilinin boyutunda kalır, uzun olan küçülür.

Renk verilmedi. `PantrixText` gibi, metin durduğu yerin içerik rengini alır: `primary` ile doldurulmuş kutuda o dolgunun üstünde okunan renkle yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.autotext.PantrixAutoText
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val spacing = PantrixTheme.spacing
Row(
    modifier = Modifier.widthIn(max = 360.dp),
    horizontalArrangement = Arrangement.spacedBy(spacing.md)
) {
    PantrixSurface(modifier = Modifier.weight(1f), color = colors.primary.color) {
        Column(modifier = Modifier.padding(spacing.md)) {
            PantrixText(text = "Bu ayki ciro", style = PantrixTheme.typography.footnote)
            PantrixAutoText(
                text = "1.284.500,75 TL",
                modifier = Modifier.fillMaxWidth(),
                style = PantrixTheme.typography.headline,
                tagKey = "revenue"
            )
        }
    }
    PantrixSurface(modifier = Modifier.weight(1f), border = colors.divider) {
        Column(modifier = Modifier.padding(spacing.md)) {
            PantrixText(text = "Sipariş", style = PantrixTheme.typography.footnote)
            PantrixAutoText(
                text = "32",
                modifier = Modifier.fillMaxWidth(),
                style = PantrixTheme.typography.headline,
                tagKey = "orders"
            )
        }
    }
}
```

## API

### PantrixAutoText

`import com.pantrixui.components.elements.autotext.PantrixAutoText`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAutoText(
    text: String,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = 1,
    minLines: Int = 1,
    overflow: TextOverflow = TextOverflow.Ellipsis,
    softWrap: Boolean = true,
    role: TextRole = TextRole.Paragraph,
    selectable: Boolean = false,
    onTextLayout: ((TextLayoutResult) -> Unit)? = null,
    tagKey: String? = null
)
```

Görünür kalmak için küçülen metin: kendisine verilen yerde bütünüyle okunan bir tutar, bir başlık ya da bir ad.

Metin, sığdığı sürece `style`'ın dediği boyuttadır. Yerine sığmayacak kadar uzun metin daha küçük bir boyutta yazılır: bütününün göründüğü en büyük boyutta. Bu boyutta metin verilen genişlikten geniş, verilen yükseklikten yüksek değildir ve `maxLines` satırdan fazla tutmaz. Aksi söylenmedikçe tek satırdır. Birden çok satır verilince metin önce satırlara bölünür, satırlar yetmeyince küçülür. `minFontSize`'a inince küçülmeyi bırakır ve hâlâ sığmayan kısmı `overflow`'un dediği gibi kesilir.

Metne sığacağı bir yer gerekir: üst öğesinden ya da `modifier`'ından gelen bir genişlik, satır sayısı serbestse bir yükseklik de. Önüne istediği kadar genişlik konan metin her satırı sığdırır ve hiç küçülmez.

Küçülen metnin satırları da birbirine o kadar yaklaşır: stilin satır yüksekliği boyutu izler. Parçalarının em ile verdiği boyutlar da onu izler, sp ile verilen boyut olduğu gibi kalır. Geri kalan her şeyde `PantrixText`'tir: temanın yazı ölçeği, durduğu yerin rengi ve ekran okuyucuya söylenenler. Boyut metin yerleştirilirken bulunur: metin ilk karede de, yerinin daraldığı, genişlediği ya da alçaldığı her karede de sığmış hâliyle görünür. Yeri yalnızca yükseldiğinde metin buna bir kare sonra uyar.

Parametreler:

- `text: String`: Metin.
- `modifier: Modifier`: Metnin modifier'ı: metne sığdırılacağı yeri `fillMaxWidth()`, bir `weight` ya da bir boyut verir.
- `style: TextStyle`: Metnin en büyük hâlindeki stili: temanın tipografisinin stillerinden biri. Verilmezse, `PantrixText`'te olduğu gibi, temel yazıdır, `LocalPantrixTextStyle`. Boyutu sp ile verilmeyen bir stilde metnin yazılacağı daha küçük bir boyut yoktur ve metin küçültülmez.
- `minFontSize: TextUnit`: Metnin ineceği en küçük boyut: sp ile ya da stilin kendi boyutunun payı olan em ile verilir. Verilmezse temanın footnote boyutudur. Stilin kendi boyutunda ya da onun üstünde metin hiç küçülmez, sıfırda ise sığana kadar, en çok stilin boyutunun 256'da birine kadar küçülür.
- `color: Color`: Metnin rengi. Verilmezse stilin rengi, metnin durduğu yerin içerik rengi ya da birincil yazı rengidir.
- `textAlign: TextAlign?`: Satırların metnin genişliği içinde nasıl hizalandığı.
- `maxLines: Int`: Metnin en çok kaç satır tutacağı: aksi söylenmedikçe bir. `Int.MAX_VALUE` satır sayısını metne verilen yüksekliğe bırakır.
- `minLines: Int`: Metnin, en büyük boyutunda, en az kaç satır yüksekliğinde olacağı.
- `overflow: TextOverflow`: En küçük boyutunda da sığmayan metnin nasıl kesileceği.
- `softWrap: Boolean`: Metnin, genişliğinin bittiği yerde satırlara bölünüp bölünmediği. Bölünmeyen metin en uzun satırına göre sığdırılır.
- `role: TextRole`: Metnin ekran okuyucu için ne olduğu: düz yazı, başlık, etiket ya da süs.
- `selectable: Boolean`: Kullanıcının seçip kopyalayabileceği bir metin olup olmadığı.
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: Metnin, yazıldığı boyutta yerleştirilmiş hâliyle çağrılır.
- `tagKey: String?`: Metnin otomasyon anahtarı: metin `AutoText_<tagKey>` etiketini taşır. Anahtar verilmeyen metin etiketlenmez.

### PantrixAutoText

`import com.pantrixui.components.elements.autotext.PantrixAutoText`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAutoText(
    text: AnnotatedString,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    minFontSize: TextUnit = PantrixTheme.typography.footnote.fontSize,
    color: Color = Color.Unspecified,
    textAlign: TextAlign? = null,
    maxLines: Int = 1,
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

Parçaları ve bağlantılarıyla bir `AnnotatedString` alan `PantrixAutoText`. `inlineContent`, bu metnin adını verdiği yer tutucular içindir. Bir parçanın em ile verilen boyutu metnin boyutunu izler, sp ile verilen olduğu gibi kalır.

Parametreler:

- `text: AnnotatedString`: metin, aralıkları ve bağlantılarıyla.
- `modifier: Modifier`: Metnin modifier'ı: metne sığdırılacağı yeri `fillMaxWidth()`, bir `weight` ya da bir boyut verir.
- `style: TextStyle`: Metnin en büyük hâlindeki stili: temanın tipografisinin stillerinden biri. Verilmezse, `PantrixText`'te olduğu gibi, temel yazıdır, `LocalPantrixTextStyle`. Boyutu sp ile verilmeyen bir stilde metnin yazılacağı daha küçük bir boyut yoktur ve metin küçültülmez.
- `minFontSize: TextUnit`: Metnin ineceği en küçük boyut: sp ile ya da stilin kendi boyutunun payı olan em ile verilir. Verilmezse temanın footnote boyutudur. Stilin kendi boyutunda ya da onun üstünde metin hiç küçülmez, sıfırda ise sığana kadar, en çok stilin boyutunun 256'da birine kadar küçülür.
- `color: Color`: Metnin rengi. Verilmezse stilin rengi, metnin durduğu yerin içerik rengi ya da birincil yazı rengidir.
- `textAlign: TextAlign?`: Satırların metnin genişliği içinde nasıl hizalandığı.
- `maxLines: Int`: Metnin en çok kaç satır tutacağı: aksi söylenmedikçe bir. `Int.MAX_VALUE` satır sayısını metne verilen yüksekliğe bırakır.
- `minLines: Int`: Metnin, en büyük boyutunda, en az kaç satır yüksekliğinde olacağı.
- `overflow: TextOverflow`: En küçük boyutunda da sığmayan metnin nasıl kesileceği.
- `softWrap: Boolean`: Metnin, genişliğinin bittiği yerde satırlara bölünüp bölünmediği. Bölünmeyen metin en uzun satırına göre sığdırılır.
- `role: TextRole`: Metnin ekran okuyucu için ne olduğu: düz yazı, başlık, etiket ya da süs.
- `selectable: Boolean`: Kullanıcının seçip kopyalayabileceği bir metin olup olmadığı.
- `inlineContent: Map<String, InlineTextContent>`
- `onTextLayout: ((TextLayoutResult) -> Unit)?`: Metnin, yazıldığı boyutta yerleştirilmiş hâliyle çağrılır.
- `tagKey: String?`: Metnin otomasyon anahtarı: metin `AutoText_<tagKey>` etiketini taşır. Anahtar verilmeyen metin etiketlenmez.

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

# Tag

Bir verinin üstündeki kısa bir etiket: bir durum, bir kategori, bir sürüm. Etiket okunur, basılmaz: basılan, kaldırılan ya da seçilen şey bir chip'tir, başka bir öğenin üstündeki sayı ya da nokta bir rozettir.

- `PantrixTag` (`com.pantrixui.components.data.tag`, `com.pantrixui:components`): Bir veri parçasının üstünde kısa bir etiket, bir durum, bir kategori ya da bir sürüm, bir rolün renginde: okunur, hiç basılmaz. Anahtar sözcükler: etiket, durum, hap, kategori, sürüm, durum etiketi.

## Özellikler

- **Altı ton.** `tone` etiketi temanın bir rolüyle çizer: `Primary`, `Info`, `Success`, `Warning`, `Danger` ve varsayılan `Neutral`. Marka rengi değişince bütün etiketler onunla değişir.
- **Üç biçim.** `Soft` rolün soluk dolgusudur ve varsayılandır; `Solid` rolün dolu rengidir, bir satırın asıl durumu için; `Outline` dolgusuzdur, kenarı ve yazısı rolün dolu rengindedir. Tema o rengi iki modunda da zeminlerinde okunacak biçimde seçer.
- **İkon ve nokta.** `icon` yazının önünde, yazının renginde durur. `dot` yazının önüne rolün dolu renginde küçük bir daire koyar: bir satırın içinde bulunduğu durum. İkon verildiyse nokta çizilmez.
- **Sözler, renk değil.** Anlamı yazı taşır: kırmızı bir "Gecikmiş", kırmızıyı göremeyen birine de aynı şeyi söyler. Ekran okuyucu etiketi tek bir şey olarak, sözleriyle duyar; `contentDescription` onların yerine geçer.
- **Basılmaz.** Etiket odak almaz, dokunma hedefi yoktur ve her platformda bir chip'ten alçaktır: bir satırın içinde satırı ele geçirmeden durur.
- **Yazı.** Sözler tek satırdır, `textStyle` verilmedikçe temanın `footnote` stiliyle yazılır ve yer bittiği yerde "…" ile kesilir. Yazı büyüyünce etiket de uzar; rengi her zaman etiketinkidir.
- **Dolgunun üstünde.** `Soft` ve `Solid` kendi zeminlerini getirir, her yerde rolün renkleriyle çizilir. Temanın zemini olmayan bir dolgunun üstünde `Outline`'ın kenarı ve yazısı orada yazılan renktedir.
- **Kendi renkleri.** `colors` tonun renklerinin yerine geçer: verilen kullanılır, verilmeyen tonun kalır. Bir rolün dolgusu verilince temanın onunla eşlediği renk de gelir.
- **Platform.** Android'de 24dp, iOS'ta, masaüstünde ve web'de 22 yüksekliğindedir. iOS'ta uçları yuvarlaktır, iOS'un kendi etiketleri gibi; öteki platformlarda köşeleri az yuvarlaktır ve onu chip'ten ayırır.

## Kullanım

### The state of a row

```kotlin
PantrixTag(text = stringResource(Res.string.overdue), tone = TagTone.Danger, dot = true, tagKey = "state")
```

### Topics beside a title

```kotlin
FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
    PantrixText(text = article.title)
    article.topics.forEach { PantrixTag(text = it.name, variant = TagVariant.Outline) }
}
```

## Örnekler

### Tonlar ve biçimler

Her satırda bir biçim, her biçimde altı ton: `Soft`, `Solid` ve `Outline`. Her etiketin sözü, tonun ne anlattığını söyler; renk onu yalnızca destekler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    TagVariant.entries.forEach { variant ->
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            TONE_WORDS.forEach { (tone, words) ->
                PantrixTag(text = words, tone = tone, variant = variant, tagKey = "${variant.name}_${tone.name}")
            }
        }
    }
}

private val TONE_WORDS = listOf(
    TagTone.Primary to "Öne çıkan",
    TagTone.Info to "Bilgi",
    TagTone.Success to "Ödendi",
    TagTone.Warning to "Süresi doluyor",
    TagTone.Danger to "Gecikmiş",
    TagTone.Neutral to "Taslak"
)
```

### İkon ve nokta

İkon yazının önünde, yazının renginde durur ve ekran okuyucuya bir şey söylemez. Nokta rolün dolu rengindedir ve bir durumu söyler: çevrimiçi, kesinti, çevrimdışı. İkisi birden verildiğinde ikon çizilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixTag(text = "Doğrulandı", tone = TagTone.Success, icon = PantrixIcons.Check)
        PantrixTag(text = "Beta", tone = TagTone.Info, icon = PantrixIcons.Info)
        PantrixTag(text = "Az stok", tone = TagTone.Warning, icon = PantrixIcons.Warning)
        PantrixTag(text = "Öne çıkan", tone = TagTone.Primary, variant = TagVariant.Solid, icon = PantrixIcons.Star)
    }
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixTag(text = "Çevrimiçi", tone = TagTone.Success, dot = true, tagKey = "online")
        PantrixTag(text = "Kesinti", tone = TagTone.Danger, variant = TagVariant.Solid, dot = true)
        PantrixTag(text = "Çevrimdışı", dot = true)
        PantrixTag(text = "Aktif", tone = TagTone.Success, variant = TagVariant.Outline, dot = true)
    }
}
```

### Bir satırın durumu

Etiketin asıl yeri bir satırın sonu: faturanın durumu. Satır etiket kadar alçalmaz; etiket satırın içinde, satırı ele geçirmeden durur ve ona basılmaz. Satıra basmak bir şey yapacaksa onu satır yapar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    INVOICES.forEach { invoice ->
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixText(text = invoice.number, modifier = Modifier.weight(1f), maxLines = 1)
            PantrixText(text = invoice.amount, color = PantrixTheme.colors.textSecondary, maxLines = 1)
            PantrixTag(
                text = invoice.state.words,
                tone = invoice.state.tone,
                dot = true,
                tagKey = "state_${invoice.key}"
            )
        }
    }
}

private val INVOICES = listOf(
    Invoice("1042", "Fatura #1042", "1 240 ₺", InvoiceState.Paid),
    Invoice("1043", "Fatura #1043", "860 ₺", InvoiceState.Due),
    Invoice("1044", "Fatura #1044", "3 125 ₺", InvoiceState.Overdue),
    Invoice("1045", "Fatura #1045", "410 ₺", InvoiceState.Draft)
)

private enum class InvoiceState(val words: String, val tone: TagTone) {
    Paid("Ödendi", TagTone.Success),
    Due("Vadesi yakın", TagTone.Warning),
    Overdue("Gecikmiş", TagTone.Danger),
    Draft("Taslak", TagTone.Neutral)
}

private class Invoice(val key: String, val number: String, val amount: String, val state: InvoiceState)
```

### Bir başlığın yanında

Bir yazının konuları, başlığının yanında: dolgusuz etiketler, renkli bir sayfada göze batmaz. Sığmayan etiketler alt satıra geçer; bunu `FlowRow` yapar, etiket değil. En alttaki etiketin yeri dardır ve sözü "…" ile kesilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        itemVerticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = "Compose Multiplatform'da tema", style = PantrixTheme.typography.title)
        TOPICS.forEach { topic -> PantrixTag(text = topic, variant = TagVariant.Outline) }
    }
    PantrixTag(
        text = "Onay bekleyen üç değişiklik var",
        modifier = Modifier.widthIn(max = NARROW_WIDTH.dp),
        tone = TagTone.Warning,
        tagKey = "narrow"
    )
}

private val TOPICS = listOf("Kotlin", "Tasarım", "Erişilebilirlik")

private const val NARROW_WIDTH = 160
```

### Bir dolgunun üstünde

Temanın zemini olmayan bir dolgunun üstünde, burada birincil rolün dolu renginde: `Soft` ve `Solid` kendi zeminlerini getirir, rolün renkleriyle çizilir. Dolgusuz `Outline` ise orada yazılan renkte, burada beyazdır: rolün kendi rengi o dolgunun üstünde okunmayabilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(color = PantrixTheme.colors.primary.color) {
    FlowRow(
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixTag(text = "Yeni", tone = TagTone.Success)
        PantrixTag(text = "Sınırlı", tone = TagTone.Warning, variant = TagVariant.Solid)
        PantrixTag(text = "Sürüm 2.4", variant = TagVariant.Outline, tagKey = "outline_on_fill")
        PantrixTag(text = "Canlı", variant = TagVariant.Outline, dot = true)
    }
}
```

### Kendi renkleri ve kendi açıklaması

`colors`, temanın hiçbir rolünde olmayan bir renk verir: burada uygulamanın kendi moru. Verilmeyen renkler tonun kalır. Son etiketin `contentDescription`'ı vardır: ekran okuyucu "Gecikmiş" yerine "Ödeme durumu: gecikmiş" der.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagColors
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.data.tag.TagVariant
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixTag(
        text = "Kampanya",
        colors = TagColors(container = own.container, content = own.onContainer, dot = own.color),
        dot = true,
        tagKey = "own"
    )
    PantrixTag(
        text = "Kampanya",
        variant = TagVariant.Outline,
        colors = TagColors(content = own.onContainer, border = own.color)
    )
    PantrixTag(
        text = "Gecikmiş",
        tone = TagTone.Danger,
        contentDescription = "Ödeme durumu: gecikmiş",
        tagKey = "described"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stiliyle

Kendi stiliyle: `TagStyle` etiketin yüksekliğini, iç boşluğunu, köşesini ve noktasını verir. Burada etiketler hap biçiminde, 32dp yüksekliğinde ve 10dp'lik noktalıdır; verilmeyen her alan platformun ön ayarıdır. Sözlerin yazısını `textStyle` verir: burada temanın `label`'ı, kalın.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagStyle
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val style = TagStyle(shape = ShapeRole.Full, height = 32.dp, horizontalPadding = 14.dp, dotSize = 10.dp)
val words = PantrixTheme.typography.label.copy(fontWeight = FontWeight.Bold)
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixTag(
        text = "Çevrimiçi",
        tone = TagTone.Success,
        dot = true,
        style = style,
        tagKey = "online_pill",
        textStyle = words
    )
    PantrixTag(
        text = "Bakımda",
        tone = TagTone.Warning,
        dot = true,
        style = style,
        tagKey = "maintenance_pill",
        textStyle = words
    )
}
```

## API

### PantrixTag

`import com.pantrixui.components.data.tag.PantrixTag`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTag(
    text: String,
    modifier: Modifier = Modifier,
    tone: TagTone = TagTone.Neutral,
    variant: TagVariant = TagVariant.Soft,
    icon: ImageVector? = null,
    dot: Boolean = false,
    contentDescription: String? = null,
    style: TagStyle? = null,
    colors: TagColors? = null,
    tagKey: String? = null,
    textStyle: TextStyle = PantrixTheme.typography.footnote
)
```

Bir verinin üstündeki kısa bir etiket: bir durum, bir kategori, bir sürüm.

Etiket okunur, basılmaz. Basılan, kaldırılan ya da seçilen şey bir chip'tir; başka bir öğenin üstündeki sayı ya da nokta bir rozettir. Ona hiçbir şey basmadığı için etiket odak almaz, dokunma hedefi yoktur ve her platformda bir chip'ten alçaktır: bir satırın içinde, satırı ele geçirmeden durur.

Anlamı renk değil sözler taşır: tehlike tonundaki "Gecikmiş", onun kırmızı olduğunu göremeyen birine de aynı şeyi söyler. Sözü bir rengin adı olan etiketin söyleyecek bir şeyi yoktur.

Sözler tek satırdır, `textStyle` ile, verilmezse temanın footnote stiliyle yazılır ve yer bittiği yerde kesilir. Yazı büyüyünce etiket de uzar. Sözlerin önünde, satırın başında bir `icon` ya da bir `dot` durur; sağdan sola bir düzende orası sağdır. Ekran okuyucu etiketi tek bir şey olarak duyar: sözlerini, ya da onların yerine `contentDescription`'ı.

```kotlin
PantrixTag(text = stringResource(Res.string.overdue), tone = TagTone.Danger, dot = true, tagKey = "state")
```

Parametreler:

- `text: String`: etiketin söylediği: bir iki söz.
- `modifier: Modifier`: etiketin modifier'ı.
- `tone: TagTone`: etiketin çizildiği renk rolü.
- `variant: TagVariant`: etiketin rolün ne kadarını giydiği.
- `icon: ImageVector?`: sözlerin önüne, onların renginde çizilir. Ekran okuyucuya bir şey söylemez.
- `dot: Boolean`: `icon` olmadığında sözlerin önünde rolün dolu renginde küçük bir daire durup durmadığı: bir satırın içinde bulunduğu durum.
- `contentDescription: String?`: ekran okuyucunun etiket için sözlerinin yerine söylediği, ya da sözler için null.
- `style: TagStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: TagColors?`: bu etiketin tonununkilerin yerine kendi renkleri: verdikleri, geri kalanlar için tonunkiler.
- `tagKey: String?`: etiketin otomasyon anahtarı: etiket `Tag_<tagKey>` olur, ve yalnızca bir anahtar verildiğinde test etiketi alır.
- `textStyle: TextStyle`: sözlerin yazı stili: verilmezse temanın `footnote` stili. Renklerini etiket verir.

### TagTone

`import com.pantrixui.components.data.tag.TagTone`, `com.pantrixui:components` içinden

```kotlin
enum class TagTone
```

Bir etiketin ne anlattığı: temanın renk rollerinden biri, böylece bir marka bütün etiketleri bir kerede değiştirir.

Ton rolü seçer, `TagVariant` de etiketin ondan ne kadar giydiğini. Bir ton kendi başına bir şey söylemez: ekran okuyucu etiketin rengini değil sözlerini duyar, bu yüzden rengin anlattığı sözlerde de olmalıdır.

Değerleri:

- `Primary`: Markanın rengi: bir sıradaki etiketlerden en önemlisi.
- `Info`: Ne iyi ne kötü, bilinmeye değer bir şey: bir tür, bir kanal.
- `Success`: İşe yarayan ya da yolunda olan bir şey: ödendi, stokta, geçiyor.
- `Warning`: Sorun olmadan önce bakılacak bir şey: süresi doluyor, az stok.
- `Danger`: Başarısız olan ya da geri alınamayan bir şey: gecikmiş, reddedildi.
- `Neutral`: İçinde bir yargı olmayan bir kategori: bir konu, bir sürüm. Varsayılan.

### TagVariant

`import com.pantrixui.components.data.tag.TagVariant`, `com.pantrixui:components` içinden

```kotlin
enum class TagVariant
```

Bir etiketin sayfadan ne kadar yer kapladığı: anlamı değil, ağırlığı.

Değerleri:

- `Soft`: Rolün soluk dolgusu, temanın onunla eşlediği renkte yazılır. Varsayılan: bağırmadan okunur.
- `Solid`: Rolün dolu rengi, eşinde yazılır: bir satırın asıl durumu için.
- `Outline`: Dolgu yok; kenar ve sözler rolün dolu renginde: içinde zaten renk olan bir sayfa için. Temanın zemini olmayan bir dolgunun üstünde kenar ve sözler orada yazılan renktedir.

### TagStyle

`import com.pantrixui.components.data.tag.TagStyle`, `com.pantrixui:components` içinden

```kotlin
class TagStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val dotSize: Dp = Dp.Unspecified
) : PantrixStyle<TagStyle>
```

`PantrixTag`'in geometrisi: bir satırın içinde, onu ele geçirmeden duracak kadar küçük bir etiket.

Etiket her platformda bir chip'ten alçaktır, çünkü chip'e basılır, etiket okunur: Android'de 24dp; iOS'ta, masaüstünde ve web'de 22. Köşeleri de onu chip'ten ayırır; iOS dışında: orada platformun kendi etiketlerinin uçları da chip'lerininki gibi yuvarlaktır.

Yükseklik ve sözlerin çevresindeki boşluk yoğunluğa uyar. İkon, nokta, kenar ve köşeler uymaz.

Parametreler:

- `shape: ShapeSpec`: Etiketin köşeleri: markanın şekil ölçeğinden bir adım, ya da sabit bir şekil.
- `height: Dp`: Bir etiketin en az yüksekliği. Daha büyük bir yazı onu uzatır.
- `horizontalPadding: Dp`: Etiketin kenarlarıyla içindekiler arasındaki boşluk.
- `iconPadding: Dp`: İkon ya da nokta ile sözler arasında.
- `iconSize: Dp`: İkonun genişliği ve yüksekliği.
- `borderWidth: Dp`: `TagVariant.Outline`'ın kenarının ve `TagColors`'ta verilen bir kenarın genişliği.
- `dotSize: Dp`: Noktanın genişliği ve yüksekliği.

### TagColors

`import com.pantrixui.components.data.tag.TagColors`, `com.pantrixui:components` içinden

```kotlin
data class TagColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val dot: Color = Color.Unspecified
)
```

Bir `PantrixTag`'in tonunun renkleri yerine boyandığı renkler: verilen bir renk kullanılır, bırakılan tonunki kalır.

```kotlin
// A campaign's own colours, which no role of the theme has.
PantrixTag(text = campaign.name, colors = TagColors(container = campaign.color, content = campaign.onColor))
```

Burada verilen ve temanın rol renklerinden biri olan bir `container`, sözler, ikon ve nokta için temanın onunla eşlediği rengi getirir, onlar da verilmedikçe. Hiçbir rolün sahip olmadığı bir dolgu getirmez: onun üstünde neyin okunacağını vermek çağıranın işidir.

Parametreler:

- `container: Color`: Etiketin dolgusu. `TagVariant.Soft`'ta rolün `container`'ı, `TagVariant.Solid`'de `color`'ı, `TagVariant.Outline`'da yok.
- `content: Color`: Sözler ve ikon: `container`'ın üstünde okunan renk. `TagVariant.Soft`'ta rolün `onContainer`'ı, `TagVariant.Solid`'de `onColor`'ı, `TagVariant.Outline`'da temanın zeminlerinde okunan `color`'ı. Temanın zemini olmayan bir dolgunun üstündeki çerçeveli etiket orada yazılan renkte yazılır.
- `border: Color`: Etiketin kenarı: `TagVariant.Outline`'ınki, `content` renginde. Başka bir biçimdeki etiketin kenarı, burada verildiyse olur.
- `dot: Color`: Nokta: rolün `color`'ı, rolün dolu rengi üstünde ise onun `onColor`'ı. Temanın zemini olmayan bir dolgunun üstünde çerçeveli etiketin noktası `content` renginde.

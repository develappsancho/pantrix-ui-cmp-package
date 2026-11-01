# Accordion

İçeriği başlığının altında açılıp kapanan bölümler: uzun bir sayfa böylece parça parça okunur.

Hangi bölümlerin açık olduğu ekranın durumudur: accordion'a açık bölümlerin anahtarları verilir (`expanded`), bir başlığa basılınca açık olması gereken yeni küme geri bildirilir (`onExpandedChange`). Accordion kendiliğinden bir şey değiştirmez. Böylece ekran bir bağlantının gösterdiği bölümü açabilir, ekran dönünce açık olanı koruyabilir ya da kendi düğmesiyle hepsini kapatabilir.

- `PantrixAccordion` (`com.pantrixui.components.container.accordion`, `com.pantrixui:components`): İçeriği başlıklarının altına katlanan bölümler: onları ayırmanın üç yolu, bir seferde biri ya da birkaçı açık. Anahtar sözcükler: akordeon, katlanır, açılır kapanır, genişleyen panel, sss, katlanır bölüm.

## Özellikler

- **Üç varyant.** `variant` bölümlerin nasıl ayrıldığını söyler: `Plain` aralarına bir çizgi koyar, `Bordered` hepsini tek bir kenarla sarar, `Separated` her bölümü kendi kartı yapar.
- **Tek ya da çok bölüm.** İstenildiği kadar bölüm aynı anda açık kalır; `singleExpanded` ile birini açmak açık olanı kapatır.
- **Başlığın parçaları.** Bir `AccordionSection`'ın başlığında `title`, altında `subtitle`, önünde `icon`, sonunda `trailing` durur. `trailing` başlığın düğmesinin parçasıdır ve onunla birlikte okunur: bir sayı, bir rozet; kendi başına bir denetim oraya konmaz.
- **Anahtarlar.** Her bölümün `key`'i her dilde aynıdır ve bir accordion'da iki bölüm aynı anahtarı taşımaz.
- **Kapalı bölüm oluşturulmaz.** Bir bölümün içeriği yalnızca bölüm açıkken kompoze edilir; `rememberSaveable` ile tuttuğu şey bölüm yeniden açıldığında yerindedir.
- **Devre dışı.** Accordion'ın `enabled`'ı bütün başlıkları, bir bölümün kendi `enabled`'ı yalnızca onu basılamaz yapar; bölüm açık ya da kapalı, olduğu gibi kalır.
- **Ekran okuyucu.** Başlık bir düğmedir ve bölümünün adını taşıyan bir başlıktır. Ekran okuyucuya basışın ne yapacağı sunulur, bölümü genişletmek ya da daraltmak, ve bölümün açık olup olmadığı söylenir. Ok bunun resmidir, okunmaz.
- **Platform.** Başlık bir liste satırıdır: Android'de 56dp, iOS'ta ve web'de 44dp, masaüstünde 40dp; platformun dokunma hedefinden alçak olmaz, uzun bir başlıkla ve büyük yazıyla uzar. Köşeler kartınkilerdir.
- **Renk.** `AccordionColors` dolguyu, yazının rengini ve çizgileri verir. Dolgusu olmayan varyantlar arkasındakinin üstünde durur: bir dolgunun üstünde, o dolgunun içindekilere verdiği renkle yazılır.
- **Otomasyon.** `tagKey` ile accordion `Accordion_<tagKey>`, bir başlığı `Accordion_<tagKey>.Header_<key>`, açtığı içerik `Accordion_<tagKey>.Content_<key>` olur. Bir basış, bölümün anahtarıyla `expand` ya da `collapse` olarak bildirilir.

## Kullanım

### Questions and answers

```kotlin
var open by remember { mutableStateOf(emptySet<String>()) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "delivery", title = stringResource(Res.string.when_will_it_arrive)) {
            PantrixText(stringResource(Res.string.delivery_answer))
        },
        AccordionSection(key = "returns", title = stringResource(Res.string.how_do_i_return)) {
            PantrixText(stringResource(Res.string.returns_answer))
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "faq"
)
```

### One open at a time, each a card of its own

```kotlin
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "account",
            title = stringResource(Res.string.account),
            subtitle = stringResource(Res.string.account_summary),
            icon = PantrixIcons.Person
        ) { AccountSettings() },
        AccordionSection(key = "billing", title = stringResource(Res.string.billing), icon = PantrixIcons.Folder) {
            BillingSettings()
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    singleExpanded = true,
    tagKey = "settings"
)
```

### Inside one edge, with a count at a header's end

```kotlin
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "open",
            title = stringResource(Res.string.open_orders),
            trailing = { PantrixText(text = orders.size.toString(), style = PantrixTheme.typography.footnote) }
        ) { Orders(orders) }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "orders"
)
```

## Örnekler

### Sık sorulan sorular: aralarında çizgi

En yalın hâli, soru ve cevaplar. Açık bölümlerin anahtarları ekranın durumudur ve `rememberSaveable` ile tutulur; accordion onu `expanded` ile alır, bir başlığa basılınca yeni kümeyi `onExpandedChange` ile bildirir. İstenildiği kadar bölüm aynı anda açık kalır.

Varyant verilmedi: `Plain`, bölümlerin arasında bir çizgi ve çevrelerinde hiçbir şey. Satıra sığmayan uzun başlık alt satıra iner ve başlık onunla uzar. Son bölümün `enabled`'ı false: basılamaz, devre dışı yazının rengiyle yazılır ve kapalı kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText

var open by rememberSaveable { mutableStateOf(setOf("delivery")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "delivery", title = "Siparişim ne zaman gelir?") {
            PantrixText(text = "İki iş günü içinde. Öğleden önce verilen siparişler ertesi gün teslim edilir.")
        },
        AccordionSection(key = "returns", title = "Nasıl iade ederim?") {
            PantrixText(text = "Otuz gün içinde, kutusuyla birlikte. Kargo ücreti bizden.")
        },
        AccordionSection(
            key = "gift",
            title = "Hediye paketi yaptırabilir miyim, paketin içine bir not ekletebilir miyim?"
        ) { PantrixText(text = "Evet. Ödeme adımında hediye paketi seçeneğini işaretleyin.") },
        AccordionSection(key = "invoice", title = "Kurumsal fatura", subtitle = "Yakında", enabled = false) {
            PantrixText(text = "Henüz açık değil.")
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "faq"
)
```

### Tek kenarın içinde, başlığın sonunda bir sayı

`AccordionVariant.Bordered` bölümleri tek bir kenarın içine alır; aralarında yine bir çizgi vardır.

Başlığın önündeki `icon` başlığın rengiyle çizilir ve ekran okuyucu onu atlar. Başlığın sonundaki sayı `trailing` ile verildi: başlık ile ok arasında durur, başlığın düğmesinin parçasıdır ve ekran okuyucu onu başlıkla birlikte okur. Burada küçük yazıyla yazıldı ve ona renk verilmedi.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("open")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "open",
            title = "Açık siparişler",
            icon = PantrixIcons.Folder,
            trailing = { PantrixText(text = "2", style = PantrixTheme.typography.footnote) }
        ) {
            PantrixText(text = "SIP-2026-0914 · Yolda")
            PantrixText(text = "SIP-2026-0921 · Hazırlanıyor")
        },
        AccordionSection(
            key = "past",
            title = "Geçmiş siparişler",
            icon = PantrixIcons.Calendar,
            trailing = { PantrixText(text = "14", style = PantrixTheme.typography.footnote) }
        ) { PantrixText(text = "Son sipariş: 12 Eylül") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "orders"
)
```

### Her bölüm bir kart, aynı anda yalnızca biri açık

`AccordionVariant.Separated` her bölümü kendi kartı yapar, aralarında bir boşlukla. `singleExpanded` ile aynı anda yalnızca bir bölüm açık kalır: birini açmak açık olanı kapatır. İki açık bölümün gerisini ekranın dışına ittiği sayfalar içindir.

`subtitle` başlığın altındaki ikinci satırdır ve bölümün özetini söyler: anahtarları değiştir, "Bildirimler"in alt satırı "Açık" ile "Kapalı" arasında değişir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons

var open by rememberSaveable { mutableStateOf(setOf("notifications")) }
var email by rememberSaveable { mutableStateOf(true) }
var push by rememberSaveable { mutableStateOf(false) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(
            key = "notifications",
            title = "Bildirimler",
            subtitle = if (email || push) "Açık" else "Kapalı",
            icon = PantrixIcons.Star
        ) {
            PantrixSwitchButton(
                checked = email,
                onCheckedChange = { email = it },
                label = "E-posta",
                tagKey = "email"
            )
            PantrixSwitchButton(checked = push, onCheckedChange = { push = it }, label = "Anlık", tagKey = "push")
        },
        AccordionSection(
            key = "account",
            title = "Hesap",
            subtitle = "ada@pantrix.io",
            icon = PantrixIcons.Person
        ) { PantrixText(text = "Üyelik: 2024'ten beri") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    singleExpanded = true,
    tagKey = "settings"
)
```

### Kapanan bölüm yazılanı saklar

Kapalı bir bölümün içeriği hiç oluşturulmaz; ama bölüm, geri yüklenmek üzere saklanan her şeyi kapalıyken de tutar. Alan metnini `rememberTextFieldState()` ile tutar ve bu durum saklanır.

"Teslimat notu" bölümüne bir şey yaz, bölümü kapat ve yeniden aç: bölüm kapanınca alan ekrandan kalkar, yeniden açılınca yazdığın yerindedir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField

var open by rememberSaveable { mutableStateOf(setOf("note")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "note", title = "Teslimat notu") {
            PantrixTextField(
                state = rememberTextFieldState(),
                modifier = Modifier.fillMaxWidth(),
                label = "Kurye notu",
                placeholder = "Zil çalışmıyor, kapıyı çalın",
                tagKey = "accordion_note"
            )
        },
        AccordionSection(key = "address", title = "Teslimat adresi") {
            PantrixText(text = "Pantrix A.Ş., Maslak, İstanbul")
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "remembers"
)
```

### Dışarıdan açıp kapamak

Açık bölümler ekranın durumu olduğu için accordion'ın dışından da değişir. Üstteki iki düğme başlıklara basmaz, yalnızca kümeyi değiştirir: biri bütün anahtarları koyar, öteki kümeyi boşaltır. Accordion yeni kümeyi çizer.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(emptySet<String>()) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Hepsini aç",
        onClick = { open = setOf("monday", "tuesday", "wednesday") },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "accordion_open_all"
    )
    PantrixButton(
        text = "Hepsini kapat",
        onClick = { open = emptySet() },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        tagKey = "accordion_close_all"
    )
}
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "monday", title = "Pazartesi") { PantrixText(text = "09.00 Haftalık plan") },
        AccordionSection(key = "tuesday", title = "Salı") { PantrixText(text = "14.00 Tasarım değerlendirmesi") },
        AccordionSection(key = "wednesday", title = "Çarşamba") { PantrixText(text = "Toplantı yok") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Bordered,
    tagKey = "week"
)
```

### Tümü devre dışı

`enabled = false` bütün başlıkları basılamaz yapar ve her bölümü olduğu gibi tutar: açık olan açık, kapalı olan kapalı kalır. Başlıklar devre dışı yazının rengiyle yazılır. Tek bir bölüm için aynısını bölümün kendi `enabled`'ı yapar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText

PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "summary", title = "Sipariş özeti", subtitle = "Onaylandı") {
            PantrixText(text = "Sipariş onaylandı; artık değiştirilemez.")
        },
        AccordionSection(key = "payment", title = "Ödeme") { PantrixText(text = "Kart ile ödendi") }
    ),
    expanded = setOf("summary"),
    onExpandedChange = {},
    variant = AccordionVariant.Bordered,
    enabled = false,
    tagKey = "locked"
)
```

### Kendi renkleriyle

`colors` accordion'a temanın değil, verilen renkleri verir: burada temada olmayan bir renkte kartlar. Dolgu `container` ile verilir; başlıklar ve içerik `content` rengini alır, çizgi ayrıca `divider` ile verilir. Verilmeyen renk temanınki kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.accordion.AccordionColors
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText

val own = ownColors()
var open by rememberSaveable { mutableStateOf(setOf("plan")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "plan", title = "Plan", subtitle = "Takım") {
            PantrixText(text = "On kullanıcıya kadar, aylık faturalandırılır.")
        },
        AccordionSection(key = "usage", title = "Kullanım") { PantrixText(text = "Bu ay 48,2 milyon istek") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    colors = AccordionColors(container = own.container, content = own.onContainer, divider = own.color),
    tagKey = "own"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Bir dolgunun üstünde

`Plain` ve `Bordered` varyantların kendi dolgusu yoktur: arkalarındakinin üstünde dururlar. Burada accordion bir rolün dolgusuyla boyanmış bir yüzeyin içinde ve renk verilmedi: başlıklar, alt satır ve ok o dolgunun içindekilere verdiği renkle yazılır, çizgiler de o rengin bir payıyla çizilir. Temanın çizgisi bu dolguda okunmazdı.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(setOf("shipping")) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.container) {
    PantrixAccordion(
        sections = listOf(
            AccordionSection(key = "shipping", title = "Kargo", subtitle = "Ücretsiz", icon = PantrixIcons.Inbox) {
                PantrixText(text = "Yarın öğleden önce yola çıkar.")
            },
            AccordionSection(key = "warranty", title = "Garanti") { PantrixText(text = "İki yıl") }
        ),
        expanded = open,
        onExpandedChange = { open = it },
        modifier = Modifier.padding(PantrixTheme.spacing.sm),
        tagKey = "on_a_fill"
    )
}
```

### Kendi stiliyle

`style` accordion'ın geometrisini değiştirir; yalnızca verilen alanlar değişir, gerisi platformun stilinden gelir. Burada başlığın en az yüksekliği 64dp, kartların arası 16dp verildi; köşeler markanın şekil ölçeğinden bir basamak değil, sabit 20dp: `ShapeSpec.Fixed`.

```kotlin
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.accordion.AccordionSection
import com.pantrixui.components.container.accordion.AccordionStyle
import com.pantrixui.components.container.accordion.AccordionVariant
import com.pantrixui.components.container.accordion.PantrixAccordion
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.token.shape.ShapeSpec

var open by rememberSaveable { mutableStateOf(setOf("first")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "first", title = "Birinci adım") { PantrixText(text = "Hesabını oluştur.") },
        AccordionSection(key = "second", title = "İkinci adım") { PantrixText(text = "E-postanı doğrula.") }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    variant = AccordionVariant.Separated,
    style = AccordionStyle(
        shape = ShapeSpec.Fixed(RoundedCornerShape(20.dp)),
        headerMinHeight = 64.dp,
        sectionGap = 16.dp
    ),
    tagKey = "own_style"
)
```

## API

### PantrixAccordion

`import com.pantrixui.components.container.accordion.PantrixAccordion`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAccordion(
    sections: List<AccordionSection>,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    variant: AccordionVariant = AccordionVariant.Plain,
    singleExpanded: Boolean = false,
    enabled: Boolean = true,
    style: AccordionStyle? = null,
    colors: AccordionColors? = null,
    tagKey: String? = null
)
```

İçeriği başlığının altında açılıp kapanan bölümler: uzun bir sayfa böylece parça parça okunur.

Hangi bölümlerin açık olduğu, sidebar'da olduğu gibi, çağıranın durumudur: `expanded` verilir, `onExpandedChange`'in bildirdiği uygulanır. Böylece bir ekran, bir bağlantının gösterdiği bölümü açabilir, ekran dönünce açık olanı koruyabilir ya da kendi düğmesiyle hepsini kapatabilir.

Başlık bir düğmedir ve bölümünün adını taşıyan bir başlıktır. Ekran okuyucuya basışın ne yapacağı sunulur: bölümü genişletmek ya da daraltmak. Bölümün açık olup olmadığı da söylenir: Android'de o eylemle, öteki platformlarda temanın sözleriyle. Ok bunun resmidir, ekran okuyucu onu atlar. Başlık hiçbir zaman platformun dokunma hedefinden alçak olmaz; daha uzun bir başlık metniyle ve daha büyük yazıyla uzar.

Bir bölümün içeriği yalnızca bölüm açıkken kurulur. `rememberSaveable` ile tuttuğu şey, bölüm yeniden açıldığında yerindedir. Accordion kendisine verilen genişliği doldurur ve kaymaz: kayan bir sayfanın içinde durur.

```kotlin
var open by remember { mutableStateOf(setOf("delivery")) }
PantrixAccordion(
    sections = listOf(
        AccordionSection(key = "delivery", title = stringResource(Res.string.when_will_it_arrive)) {
            PantrixText(stringResource(Res.string.delivery_answer))
        },
        AccordionSection(key = "returns", title = stringResource(Res.string.how_do_i_return)) {
            PantrixText(stringResource(Res.string.returns_answer))
        }
    ),
    expanded = open,
    onExpandedChange = { open = it },
    tagKey = "faq"
)
```

Parametreler:

- `sections: List<AccordionSection>`: Bölümler, gösterildikleri sırayla. İki bölüm aynı anahtarı taşımaz.
- `expanded: Set<String>`: Açık bölümlerin anahtarları.
- `onExpandedChange: (Set<String>) -> Unit`: Bir başlığa basıldığında, bundan sonra açık olması gereken bölümlerin anahtarlarıyla çağrılır. Accordion kendiliğinden hiçbir şeyi değiştirmez.
- `modifier: Modifier`: Accordion'ın modifier'ı. Accordion kendisine verilen yer kadar geniştir; yüksekliği başlıkları ile açık bölümlerin içeriği kadardır.
- `variant: AccordionVariant`: Bölümlerin nasıl ayrıldığı: aralarında bir çizgiyle, hepsinin çevresinde tek bir kenarla ya da her biri kendi kartı olarak.
- `singleExpanded: Boolean`: Bir bölümü açmanın açık olanı kapatıp kapatmayacağı: iki açık bölümün gerisini ekranın dışına iteceği sayfalar içindir.
- `enabled: Boolean`: Başlıklara basılıp basılamayacağı. Değeri false ise her bölüm olduğu gibi kalır; tek bir bölüm aynı şeyi yalnızca kendisi için söyler.
- `style: AccordionStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: AccordionColors?`: Bu accordion'ın, temadan gelmeyen kendi renkleri: burada verilenler kullanılır, gerisi temanınki kalır.
- `tagKey: String?`: Accordion'ın otomasyon anahtarı: accordion `Accordion_<tagKey>`, içindeki bir başlık `Accordion_<tagKey>.Header_<key>`, o başlığın açtığı içerik `Accordion_<tagKey>.Content_<key>` olarak etiketlenir. Bir basış `Accordion` olayı olarak bildirilir: `expand` ya da `collapse`, bölümün anahtarıyla.

### AccordionSection

`import com.pantrixui.components.container.accordion.AccordionSection`, `com.pantrixui:components` içinden

```kotlin
class AccordionSection(
    public val key: String,
    public val title: String,
    public val subtitle: String? = null,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null,
    public val trailing: (@Composable () -> Unit)? = null,
    public val content: @Composable ColumnScope.() -> Unit
)
```

Bir `PantrixAccordion`'ın tek bir bölümü: başlığı ve başlığın açtığı içerik.

```kotlin
AccordionSection(key = "delivery", title = stringResource(Res.string.when_will_it_arrive)) {
    PantrixText(stringResource(Res.string.delivery_answer))
}
```

Parametreler:

- `key: String`: Accordion'ın `expanded`'ında bu bölüm için tutulan değer. Her dilde aynıdır, böylece çevrilmiş bir ekran da aynı bölümü açar; bir accordion'da iki bölüm aynı anahtarı taşımaz.
- `title: String`: Başlığın metni ve bölümün ekran okuyucudaki adı.
- `subtitle: String?`: Başlık metninin altında ikinci bir satır; yoksa null.
- `icon: ImageVector?`: Başlık metninin önüne, onun rengiyle çizilir; yoksa null. Ekran okuyucu onu atlar.
- `enabled: Boolean`: Başlığa basılıp basılamayacağı. Basılamayan başlık devre dışı yazının rengiyle yazılır; bölümü de accordion'ın `expanded`'ı ne diyorsa öyle kalır, açık ya da kapalı.
- `tagKey: String?`: Bölümün otomasyon anahtarı; her dilde aynıdır ve `key`'den başka bir şey olması istendiğinde verilir: başlık `Header_<tagKey>`, başlığın açtığı içerik `Content_<tagKey>` olarak etiketlenir. Anahtarı olan bir accordion'da bu etiket accordion'ın etiketinin içinde durur: `Accordion_faq.Header_delivery` gibi.
- `trailing: (@Composable () -> Unit)?`: Başlık metni ile ok arasında duran şey: bir sayı, bir rozet. Bir şey durmayacaksa null. Başlığın düğmesinin parçasıdır ve onunla birlikte okunur: kendi başına bir kontrol oraya konmaz.
- `content: @Composable ColumnScope.() -> Unit`: Bölümün açıkken gösterdiği içerik; bir kartta olduğu gibi alt alta durur, aralarında temanın küçük boşluğu vardır. Kapalı bir bölüm bunların hiçbirini kurmaz.

### AccordionVariant

`import com.pantrixui.components.container.accordion.AccordionVariant`, `com.pantrixui:components` içinden

```kotlin
enum class AccordionVariant
```

Bir `PantrixAccordion`'ın bölümlerinin nasıl ayrıldığı.

Değerleri:

- `Plain`: Bölümlerin arasında bir çizgi, çevrelerinde hiçbir şey: sayfanın kendi sütunu içindir.
- `Bordered`: Hepsinin çevresinde tek bir kenar, içindeki bölümlerin arasında bir çizgi.
- `Separated`: Her bölüm kendi kartıdır, aralarında bir boşluk vardır.

### AccordionStyle

`import com.pantrixui.components.container.accordion.AccordionStyle`, `com.pantrixui:components` içinden

```kotlin
class AccordionStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val headerMinHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val contentPadding: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val sectionGap: Dp = Dp.Unspecified
) : PantrixStyle<AccordionStyle>
```

`PantrixAccordion`'ın geometrisi: bir bölümün başlığındaki ve başlığın açtığı içeriğin çevresindeki boşluklar, bir de kenar.

Başlık bir liste satırıdır. Android'de Material 3'ün tek satırlı liste öğesidir: 56dp yüksekliğinde, yanlarında 16dp. iOS'ta 44pt'lik bir satırdır: orada bir parmağa verilen en az yer. Masaüstü ve web, imleç için daha sıkıdır; web'de başlık 44dp'den alçak olmaz: tarayıcı dokunmatik bir ekranda açılmış olabilir.

Köşeler her platformda kartın köşeleridir, çünkü `AccordionVariant.Separated`'ın bir bölümü bir karttır: Android'de orta, iOS'ta büyük, masaüstünde ve web'de küçük.

Başlığın yüksekliği, iç boşluklar ve aralıklar yoğunlukla ölçeklenir, çünkü bunlar sözcüklerin çevresindeki boşluktur. İkonun boyutu, kenarın kalınlığı ve şekil ölçeklenmez.

Parametreler:

- `shape: ShapeSpec`: `AccordionVariant.Bordered`'da hepsinin çevresindeki kenarın, `AccordionVariant.Separated`'da her bölümün çevresindeki kenarın köşeleri: markanın şekil ölçeğinden bir basamak ya da sabit bir şekil.
- `headerMinHeight: Dp`: Bir başlığın en az yüksekliği. İki satır tutan bir başlık metni, bir alt satır ya da daha büyük yazı başlığı uzatır; alt sınırı platformun dokunma hedefidir.
- `horizontalPadding: Dp`: Bir başlığın yan kenarları ile içindekiler arasındaki boşluk.
- `verticalPadding: Dp`: Satırları en az yüksekliğe sığmayan bir başlıkta, satırların üstündeki ve altındaki boşluk.
- `contentPadding: Dp`: Açık bir bölümün içeriğinin yanlarındaki ve altındaki boşluk.
- `iconGap: Dp`: Bir başlığın ikonu, metni, sonunda duranı ve oku arasındaki aralık.
- `iconSize: Dp`: Bir başlığın ikonunun ve okunun genişliği ve yüksekliği.
- `borderWidth: Dp`: Bölümlerin arasındaki çizgilerin ve kenarların kalınlığı. Sıfır verilirse hiçbiri çizilmez.
- `sectionGap: Dp`: `AccordionVariant.Separated`'da bir bölüm ile sonraki arasındaki boşluk.

### AccordionColors

`import com.pantrixui.components.container.accordion.AccordionColors`, `com.pantrixui:components` içinden

```kotlin
data class AccordionColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val divider: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir `PantrixAccordion`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// Each section a card in the primary role's soft fill, written in what the theme pairs with it.
PantrixAccordion(…, colors = AccordionColors(container = PantrixTheme.colors.primary.container))
```

Burada verilen `container` temanın rol renklerinden biriyse, `content` de verilmediği sürece, temanın onunla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Bölümlerin arkasındaki dolgu. `AccordionVariant.Plain` ve `AccordionVariant.Bordered`'da yoktur: ikisi de arkalarındakinin üstünde durur. `AccordionVariant.Separated`'ın her bölümünün altında temanın `surface`'ıdır.
- `content: Color`: Bir başlığın metni ve ikonu, bir de bölümün gösterdiklerinden kendi rengini vermeyenler. Temanın `textPrimary`'sidir; accordion kendi dolgusu olmayan bir dolgunun üstündeyse, o dolgunun üstünde duranlara verdiği renktir. Alt satır ve ok, temanın kendi zeminlerinde temanın `textSecondary`'sidir; başka yerde ve bu renk verildiğinde bu renktedir.
- `divider: Color`: Bölümlerin arasındaki çizgiler ve kenarlar. Temanın kendi zeminlerinde temanın `divider`'ıdır. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `content`'in bir payıdır: Subtle düğmenin kenarı gibi.

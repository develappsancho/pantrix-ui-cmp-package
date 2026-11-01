# Link

Tek başına duran bağlantı: bir cümlenin içindeki bir sözcük değil, kendi başına bir yazı. Bir işi çalıştırır ya da bir web sayfasını açar: bir giriş formunun altındaki "Şifremi unuttum", bir sayfanın altındaki "Gizlilik politikası". Altı çizilidir ve temanın `primary` rengindedir.

- `PantrixLink` (`com.pantrixui.components.elements.link`, `com.pantrixui:components`): Bir cümlenin dışında tek başına duran bağlantı: bir eylemi çalıştıran ya da bir web sayfasını açan, birincil renkte altı çizili yazı. Anahtar sözcükler: bağlantı, köprü, adres, web bağlantısı, tarayıcıda aç.

## Özellikler

- **İki biçim.** `onClick` alan bağlantı bir işi çalıştırır. `url` alan, adresi platformun `UriHandler`'ıyla açar: tarayıcıda ya da o adresi karşılayan uygulamada.
- **Altı çizili.** Bağlantı yalnızca rengiyle ayrılmaz: iki rengi ayırt edemeyen biri onu altındaki çizgiden tanır. Bir cümlenin içinde durmayan, yerinden tanınan bağlantı `underline = LinkUnderline.OnHover` alır: altı işaretçi üstündeyken ve odaktayken, dokunarak kullanılan platformda her zaman çizilir.
- **Kendi rengi.** `color` yazıyı, alt çizgiyi ve işaretçi üstündeyken ya da basılıyken altında beliren tonu belirler. Verilmezse temanın `primary` rengidir, bir dolgunun üstünde de: orada okunan rengi çağıran verir.
- **Yazı stili.** `style` verilmezse temanın `label` stilidir, stil verilmemiş bir `PantrixText`'in stili: bir metnin yanındaki bağlantı o metinle aynı boydadır.
- **Dokunma hedefi.** Yüksekliği platformun en küçük dokunma hedefinden az olmaz: Android'de 48dp, iOS'ta 44dp, fareyle kullanılan masaüstünde ve web'de 32dp. Genişliği yazısı kadardır ve üstündeki metinle aynı hizada başlar.
- **Devre dışı.** `enabled = false` bağlantıyı temanın devre dışı yazı renginde çizer ve bağlantı basış almaz. Alt çizgisi kalır: izlenemeyen bir bağlantı olarak okunur, düz bir yazı olarak değil.
- **Fare ve klavye.** İşaretçi üstündeyken ve basılıyken yazının altında bağlantının renginde soluk bir ton belirir. Bağlantı klavye odağını da alır: odaktayken o ton odak halkasının rengindedir.
- **Analitik.** Her tıklama temanın `analytics`'ine `Link` bileşeninin `click` olayı olarak bildirilir. Olay bağlantının bir adres açıp açmadığını söyler, adresin kendisini hiçbir zaman.
- **Otomasyon.** `tagKey` test etiketini kurar: `tagKey = "forgot_password"` verilen bağlantının etiketi `Link_forgot_password`'dır.

## Kullanım

### Under a sign-in form

```kotlin
PantrixLink(
    text = stringResource(Res.string.forgot_password),
    onClick = onForgotPassword,
    style = PantrixTheme.typography.footnote,
    tagKey = "forgot_password"
)
```

### A web page

```kotlin
PantrixLink(
    text = stringResource(Res.string.privacy_policy),
    url = "https://example.com/privacy",
    tagKey = "privacy_policy"
)
```

### On a fill the primary colour would not read on

```kotlin
val primary = PantrixTheme.colors.primary
PantrixSurface(color = primary.color) {
    PantrixLink(
        text = stringResource(Res.string.learn_more),
        onClick = onLearnMore,
        color = primary.onColor,
        tagKey = "learn_more"
    )
}
```

## Örnekler

### Bir işi çalıştıran bağlantı

En yalın hâli: bir yazı ve basılınca çalışan `onClick`. Bağlantı temanın `primary` renginde ve altı çizili yazılır. "Şifremi unuttum"a bas: uygulamanın snackbar'ı haber verir.

`tagKey` verildi: bu bağlantı otomasyonda `Link_forgot_password` etiketiyle bulunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixLink(
    text = "Şifremi unuttum",
    onClick = { scope.launch { snackbars?.show(message = "Sıfırlama bağlantısı gönderildi") } },
    tagKey = "forgot_password"
)
```

### Bir adresi açan bağlantı

İkinci biçim `onClick` yerine `url` alır. Basılınca adres platformun `UriHandler`'ıyla açılır: tarayıcıda ya da o adresi karşılayan uygulamada. Görünüşü ve öteki parametreleri ilk biçimle aynıdır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink

PantrixLink(text = "Gizlilik politikası", url = "https://example.com/privacy", tagKey = "privacy_policy")
```

### Kendi renginde

`color` bağlantının kendi rengidir: yazısını, alt çizgisini ve işaretçi üstüne gelince ya da basınca altında beliren tonu belirler. İlk bağlantının rengi temanın hiçbir rolünde olmayan, uygulamanın kendi moru; ikincisininki temanın `danger` rolü.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val own = ownColors()
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixLink(
        text = "Kampanya koşulları",
        onClick = { scope.launch { snackbars?.show(message = "Kampanya koşulları açıldı") } },
        color = own.color,
        tagKey = "campaign_terms"
    )
    PantrixLink(
        text = "Hesabımı sil",
        onClick = {},
        color = PantrixTheme.colors.danger.color,
        tagKey = "delete_account"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Bir dolgunun üstünde

Bağlantı çevresindeki içerik rengine bakmaz: renk verilmezse bir dolgunun üstünde de temanın `primary` rengindedir. Dolgu `primary`'nin kendisi olduğunda o renk okunmaz; orada okunan rengi `color` ile çağıran verir, burada rolün `onColor`'ını.

Yanındaki `PantrixText`'e renk verilmedi: dolgunun içerik rengini kendiliğinden alır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val primary = PantrixTheme.colors.primary
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = primary.color) {
    Row(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixText(text = "Yeni sürüm hazır.")
        PantrixLink(text = "Daha fazla bilgi", onClick = {}, color = primary.onColor, tagKey = "learn_more")
    }
}
```

### Bir metnin yanında ve yazı stili

`style` verilmeyen bağlantı temanın `label` stilindedir, stil verilmemiş bir `PantrixText` gibi: üst satırda ikisi yan yana, aynı boyda durur.

Alttaki bağlantıya `style = PantrixTheme.typography.footnote` verildi: bir formun altındaki küçük bağlantı. Yazı küçülse de bağlantının yüksekliği platformun dokunma hedefinden az olmaz; genişliği yazısı kadardır ve üstündeki satırla aynı hizada başlar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixText(text = "Hesabın yok mu?")
    PantrixLink(text = "Kayıt ol", onClick = {}, tagKey = "sign_up")
}
PantrixLink(
    text = "Kullanım koşulları",
    onClick = {},
    style = PantrixTheme.typography.footnote,
    tagKey = "terms_of_use"
)
```

### Bir satırdaki bağlantılar

Bir cümlenin içinde durmayan bağlantılar: bir sayfanın altındaki satır. Yerleri onları zaten bağlantı diye söyler; `underline = LinkUnderline.OnHover` ile altları yalnızca işaretçi üstündeyken ve klavye odağındayken çizilir.

Dokunarak kullanılan platformda ikisi de olmaz: Android'de ve iOS'ta bu bağlantıların da altı her zaman çizilidir. Bir cümlenin içindeki bağlantı ise varsayılanda, `LinkUnderline.Always`'te kalır: rengi tek başına onu ayırt edemeyene ulaşmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.LinkUnderline
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
    PantrixLink(text = "Gizlilik", onClick = {}, underline = LinkUnderline.OnHover, tagKey = "privacy")
    PantrixLink(text = "Koşullar", onClick = {}, underline = LinkUnderline.OnHover, tagKey = "terms")
    PantrixLink(text = "İletişim", onClick = {}, underline = LinkUnderline.OnHover, tagKey = "contact")
}
```

### Dokunma hedefi

Bağlantının kapladığı alan burada boyandı. Yüksekliği en az platformun dokunma hedefi kadardır: Android'de 48dp, iOS'ta 44dp, fareyle kullanılan masaüstünde ve web'de 32dp. Genişliği yazısı kadardır.

İkinci bağlantı `caption` stilinde: yazı küçülür, alanın yüksekliği aynı kalır. Kısa bir bağlantının hemen yanına dokunmak da ona ulaşır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.foundation.theme.PantrixTheme

val area = PantrixTheme.colors.neutral.container
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixLink(text = "Yardım", onClick = {}, modifier = Modifier.background(area), tagKey = "help_body")
    PantrixLink(
        text = "Yardım",
        onClick = {},
        modifier = Modifier.background(area),
        style = PantrixTheme.typography.caption,
        tagKey = "help_caption"
    )
}
```

### Devre dışı

`enabled = false` bağlantıyı temanın devre dışı yazı renginde çizer ve bağlantı basış almaz. Alt çizgisi kalır: çizgisiz kalsaydı düz bir yazı gibi okunurdu. "Kodu yeniden gönder"e bas: bağlantı beş saniye devre dışı kalır.

İkinci bağlantıya `color` da verildi. Devre dışı bir bağlantı, ne verilirse verilsin, temanın devre dışı rengindedir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

var waiting by remember { mutableStateOf(false) }
LaunchedEffect(waiting) {
    if (waiting) {
        delay(5_000)
        waiting = false
    }
}
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixLink(
        text = "Kodu yeniden gönder",
        onClick = { waiting = true },
        enabled = !waiting,
        tagKey = "resend_code"
    )
    PantrixLink(
        text = "Yakında",
        onClick = {},
        color = ownColors().color,
        enabled = false,
        tagKey = "coming_soon"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Tıklamanın bildirimi

Her tıklama temanın `analytics`'ine bir olay olarak bildirilir: bileşeni `Link`, eylemi `click`. Olayın `external` değeri bağlantının bir işi mi çalıştırdığını (`false`), bir adresi mi açtığını (`true`) söyler; adresin kendisi olayda yoktur.

Buradaki iki bağlantı, yalnızca `analytics` verilen bir temanın içinde: gelen son olay altlarında yazar. Birine bas.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.link.PantrixLink
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.theme.PantrixTheme

var lastEvent by remember { mutableStateOf("Henüz bir olay gelmedi") }
val analytics = remember {
    PantrixAnalytics { event ->
        val external = event.props["external"]
        lastEvent = "${event.component} · ${event.action} · ${event.testTag} · external=$external"
    }
}
PantrixTheme(analytics = analytics) {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
        PantrixLink(text = "Yardım", onClick = {}, tagKey = "help")
        PantrixLink(text = "Destek sayfası", url = "https://example.com/support", tagKey = "support")
    }
}
PantrixText(text = lastEvent, color = PantrixTheme.colors.textSecondary, tagKey = "link_event")
```

## API

### PantrixLink

`import com.pantrixui.components.elements.link.PantrixLink`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixLink(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    enabled: Boolean = true,
    tagKey: String? = null,
    underline: LinkUnderline = LinkUnderline.Always
)
```

`onClick`'i çalıştıran, tek başına duran bir bağlantı: `text` primary renginde ve altı çizili yazılır, platformun en küçük dokunma hedefi kadar yüksek bir satırda; böylece yazının üstüne ya da altına bir dokunuş da ona ulaşır. Tıklama temanın analitiğine bir `Link` `click` olayı olarak bildirilir. `enabled` değilken hiçbir şey yapmaz. Alt çizgisi devre dışı yazı renginde kalır ki yine bir bağlantı olarak okunsun.

`color`, temanın `primary` renginde olmayan bir bağlantının kendi rengidir: yazısının rengi, bir de işaretçi üstündeyken ve basılıyken altında beliren ton. Devre dışı bir bağlantı, ne verilirse verilsin, temanın devre dışı yazı renginde kalır. `style` verilmezse temel yazıdır, `LocalPantrixTextStyle`, yani bir `PantrixText`'in kendiliğinden aldığı yazı stili: bir metnin yanındaki bağlantı o metinle aynı boydadır.

Parametreler:

- `text: String`
- `onClick: () -> Unit`
- `modifier: Modifier`: bağlantının modifier'ı.
- `style: TextStyle`
- `color: Color`
- `enabled: Boolean`
- `tagKey: String?`: bağlantının otomasyon anahtarı: bağlantı `Link_<tagKey>`'dır, anahtar yoksa çağrıldığı yerden bir anahtar alır. Görünen metin hiçbir zaman anahtar olmaz.
- `underline: LinkUnderline`: Bağlantının altının ne zaman çizildiği: söylenmezse her zaman; `OnHover` bir cümlenin içinde durmayan bağlantı içindir: altı işaretçinin altında ve klavye odağındayken, dokunarak kullanılan platformda her zaman çizilir.

### PantrixLink

`import com.pantrixui.components.elements.link.PantrixLink`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixLink(
    text: String,
    url: String,
    modifier: Modifier = Modifier,
    style: TextStyle = LocalPantrixTextStyle.current,
    color: Color = Color.Unspecified,
    enabled: Boolean = true,
    tagKey: String? = null,
    underline: LinkUnderline = LinkUnderline.Always
)
```

`url`'i platformun `UriHandler`'ıyla açan, tek başına duran bir bağlantı: adres tarayıcıda ya da o adresi karşılayan uygulamada açılır.

Gerisi öteki `PantrixLink`'inkiyle aynıdır. `click` olayı bağlantının bir dış bağlantı olduğunu söyler, hangi adresi açtığını hiçbir zaman söylemez.

Cihazda hiçbir şeyin açamadığı bir adres, Compose'un kendi metnindeki bağlantılarda yaptığı gibi (`TextLinkScope`) bırakılır: basış hiçbir şey yapmaz ve uygulama sürer.

Parametreler:

- `text: String`: bağlantının söylediği.
- `url: String`
- `modifier: Modifier`: bağlantının modifier'ı.
- `style: TextStyle`: bağlantının yazı tipi: verilmezse `LocalPantrixTextStyle`; böylece bir metnin yanındaki bağlantı o metin kadar büyük olur.
- `color: Color`: bağlantının, temanın `primary`'si olmadığı yerde kendi rengi.
- `enabled: Boolean`: bağlantıya basılıp basılamayacağı: basılamayan bağlantı altı çizili kalır, devre dışı yazı renginde.
- `tagKey: String?`: bağlantının otomasyon anahtarı: bağlantı `Link_<tagKey>`'dır, anahtar yoksa çağrıldığı yerden bir anahtar alır. Görünen metin hiçbir zaman anahtar olmaz.
- `underline: LinkUnderline`: Bağlantının altının ne zaman çizildiği, öteki `PantrixLink`'teki gibi.

### LinkUnderline

`import com.pantrixui.components.elements.link.LinkUnderline`, `com.pantrixui:components` içinden

```kotlin
enum class LinkUnderline
```

Bir bağlantının altının ne zaman çizildiği: onu çevresindeki yazıdan renginden başka ayıran şey.

Bir cümlenin içindeki bağlantının altı her zaman çizilir: yalnızca rengiyle ayrılan bağlantı iki rengi ayırt edemeyen biri için kaybolur (WCAG 1.4.1). Bir bağlantı satırındaki ya da bir breadcrumb izindeki gibi ayrı duran bir bağlantı yerinden tanınır ve altı yalnızca bir işaretçinin altında ya da klavye odağındayken çizilebilir. Dokunarak kullanılan platformda ikisi de yoktur; orada altı her zaman çizilir.

Değerleri:

- `Always`: Altı her zaman çizili: varsayılan budur ve bir cümlenin içindeki bağlantının istediği de budur.
- `OnHover`: Altı işaretçinin altında ve klavye odağını tuttuğu sürece, dokunarak kullanılan platformda her zaman çizili: bir cümlenin içinde durmayan bir bağlantı için.

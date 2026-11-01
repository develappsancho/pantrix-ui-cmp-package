# Checkbox

İşaretli ya da boş bir kutu ve yanındaki etiket. Birbirinden bağımsız seçenekler içindir: bir bültene abone olmak, bir koşulu kabul etmek, bir listeden birkaç satırı seçmek. `PantrixTriStateCheckbox` üçüncü bir durumu da gösterir: altındaki satırların bir kısmı seçiliyken ne işaretli ne boş olan "tümünü seç" kutusu.

Kutu kendiliğinden bir şey değiştirmez: `checked` ne diyorsa odur. Basış, istenen değeri `onCheckedChange` ile bildirir; durumu çağıran tutar.

- `PantrixCheckbox` (`com.pantrixui.components.elements.checkbox`, `com.pantrixui:components`): Etiketi, yardım metni ve hata hâli olan iki durumlu bir onay kutusu; denetimli ya da bir formun alanına bağlı. Anahtar sözcükler: onay kutusu, işaret kutusu, kabul ediyorum, onay, izin, evet hayır, koşullar.
- `PantrixTriStateCheckbox` (`com.pantrixui.components.elements.checkbox`, `com.pantrixui:components`): Belirsiz de olabilen bir onay kutusu: satırları kısmen seçili bir “tümünü seç” için. Anahtar sözcükler: belirsiz, tümünü seç, kısmi seçim, karışık durum, üç durumlu.

## Özellikler

- **Tek hedef.** Kutu, etiket ve yardım metni tek bir hedeftir: yazıya basmak da kutuyu değiştirir. Kutu ne kadar küçük olursa olsun satır, platformun dokunma hedefi kadar yer tutar.
- **Etiket ve yardım metni.** `label` kutunun yanında, `supportingText` onun altında daha küçük bir yazıyla durur. Kutu, yazı kaç satır sürerse sürsün, etiketin ilk satırındadır.
- **Üç durum.** `PantrixTriStateCheckbox` bir `ToggleableState` alır: işaretli, boş ya da belirsiz. Belirsiz kutu bir çizgi çizer ve ekran okuyucuya boş diye değil, belirsiz diye okunur. Basışın neye yol açacağını çağıran söyler.
- **Hata.** `error` kutuyu ve yardım metnini temanın `danger` rolüne çevirir; ekran okuyucuya girdinin geçersiz olduğu söylenir.
- **Form.** `field` alan `PantrixCheckbox` değerini, hatasını ve adını formun alanından alır. Kuralın mesajı ilk değişiklikten sonra ya da form gönderilmek istendiğinde görünür ve yardım metninin yerine geçer.
- **Salt okunur ve devre dışı.** `onCheckedChange` null ise kutu salt okunurdur: basış ve odak almaz, adını ve durumunu yine söyler. `enabled = false` kutuyu devre dışı renklerle çizer.
- **Kendi renkleri.** `CheckboxColors` dolguyu, işareti ve kenarı ayrı ayrı alır; verilmeyen temanın rolünde kalır. Devre dışı ve hatalı kutu, renk verilse de temanın renkleriyle çizilir.
- **Stil.** `CheckboxStyle` kutunun boyunu, köşelerini ve çizgi kalınlığını değiştirir. Kutu 18dp'dir, iOS'ta 22dp; köşeleri şekil ölçeğinin küçük adımıdır.
- **Kutu sonda.** `controlPosition = ControlPosition.End` kutuyu etiketin sonuna koyar: satıra bir genişlik verilince kutu onun sonunda durur.
- **Ekran okuyucu.** Tek bir onay kutusu okunur: adı etiketidir, durumu temanın diliyle söylenir. Etiketi olmayan kutunun adını `contentDescription` verir.
- **Hareket.** İşaret çizilerek gelir ve gider, dolgu onunla birlikte belirir ve solar. Hareketin azaltıldığı temada ikisi de bir anda olur.

## Kullanım

### Controlled

```kotlin
var subscribed by rememberSaveable { mutableStateOf(false) }
PantrixCheckbox(
    checked = subscribed,
    onCheckedChange = { subscribed = it },
    label = stringResource(Res.string.subscribe),
    supportingText = stringResource(Res.string.once_a_week),
    tagKey = "subscribe"
)
```

### Consent, bound to a form's field

```kotlin
val form = rememberFormState()
val terms = form.field("terms", initial = false, Rules.mustBeTrue(stringResource(Res.string.terms_required)))
PantrixCheckbox(field = terms, label = stringResource(Res.string.accept_terms))
```

### Without a label, in a table's row

```kotlin
PantrixCheckbox(
    checked = order.id in selected,
    onCheckedChange = { onSelect(order.id, it) },
    contentDescription = stringResource(Res.string.select_order, order.number),
    tagKey = "order_" + order.id
)
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixCheckbox(
    checked = organic,
    onCheckedChange = { organic = it },
    label = stringResource(Res.string.organic_only),
    colors = CheckboxColors(checked = success.color, checkmark = success.onColor),
    tagKey = "organic_only"
)
```

### Select all

```kotlin
val state = when (selected.size) {
    0 -> ToggleableState.Off
    rows.size -> ToggleableState.On
    else -> ToggleableState.Indeterminate
}
PantrixTriStateCheckbox(
    state = state,
    onClick = { selected = if (state == ToggleableState.On) emptySet() else rows.toSet() },
    label = stringResource(Res.string.select_all),
    tagKey = "select_all"
)
```

### A summary that cannot be pressed

```kotlin
PantrixTriStateCheckbox(state = ToggleableState.Indeterminate, onClick = null, label = summary)
```

## Örnekler

### Etiket ve yardım metni

En yalın hâli: `checked` durumu okur, `onCheckedChange` istenen değeri bildirir. `label` kutunun yanında, `supportingText` altında durur ve üçü tek bir hedeftir. Yazıya bas: kutu yine değişir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

var newsletter by rememberSaveable { mutableStateOf(true) }
PantrixCheckbox(
    checked = newsletter,
    onCheckedChange = { newsletter = it },
    label = "Haftalık bülten",
    supportingText = "Haftada bir e-posta; istediğiniz zaman bırakabilirsiniz",
    tagKey = "newsletter"
)
```

### Üç durum: tümünü seç

`PantrixTriStateCheckbox` üçüncü bir durumu çizer. Altındaki kutuların bir kısmı seçiliyken "Tüm bildirimler" ne işaretli ne boştur: bir çizgi gösterir ve ekran okuyucuya öyle okunur.

Durumu kutu değil, çağıran hesaplar: hepsi seçiliyse `On`, hiçbiri seçili değilse `Off`, arada `Indeterminate`. `onClick` yalnızca basıldığını bildirir; burada hepsini seçer, hepsi seçiliyken hepsini bırakır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.state.ToggleableState
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.checkbox.PantrixTriStateCheckbox
import com.pantrixui.foundation.theme.PantrixTheme

val notifications = listOf("Kargo durumu", "Kampanyalar", "Hesap güvenliği")
var chosen by remember { mutableStateOf(setOf(notifications.first())) }
val all = when (chosen.size) {
    0 -> ToggleableState.Off
    notifications.size -> ToggleableState.On
    else -> ToggleableState.Indeterminate
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixTriStateCheckbox(
        state = all,
        onClick = { chosen = if (all == ToggleableState.On) emptySet() else notifications.toSet() },
        label = "Tüm bildirimler",
        tagKey = "all_notifications"
    )
    Column(modifier = Modifier.padding(start = PantrixTheme.spacing.xl)) {
        notifications.forEachIndexed { index, name ->
            PantrixCheckbox(
                checked = name in chosen,
                onCheckedChange = { on -> chosen = if (on) chosen + name else chosen - name },
                label = name,
                tagKey = "notification_$index"
            )
        }
    }
}
```

### Hata

`error` kutuyu ve yardım metnini temanın `danger` rolüne çevirir ve ekran okuyucuya girdinin geçersiz olduğu söylenir. Hata sürerken yardım metni mesajın kendisidir: neyin düzeltileceğini o söyler.

Burada hatayı örnek kendisi hesaplar: kutu boşken `error` true'dur. Kutuyu işaretle: renk ve metin eski hâline döner.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

var read by rememberSaveable { mutableStateOf(false) }
PantrixCheckbox(
    checked = read,
    onCheckedChange = { read = it },
    label = "Gizlilik bildirimini okudum",
    supportingText = if (read) "Teşekkürler" else "Devam etmek için bu kutuyu işaretleyin",
    error = !read,
    tagKey = "privacy"
)
```

### Bir forma bağlı onay

`field` alan `PantrixCheckbox` bir formun alanına bağlıdır: değerini, hatasını ve adını alandan alır; `checked` ve `onCheckedChange` verilmez. Alanın kimliği otomasyon anahtarıdır: bu kutu `Checkbox_terms`'tir.

Kutuyu işaretlemeden "Gönder"e bas: `Rules.mustBeTrue` kuralının mesajı yardım metninin yerine geçer ve odak kutuya gider. Kutu işaretlenince mesaj kalkar; form gönderilince uygulamanın snackbar'ı haber verir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixCheckbox(
    field = form.field("terms", initial = false, Rules.mustBeTrue("Devam etmek için koşulları kabul edin")),
    label = "Kullanım koşullarını kabul ediyorum",
    supportingText = "Göndermeden önce okuyabilirsiniz"
)
PantrixButton(
    text = "Gönder",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Form gönderildi", tagKey = "form_sent") } }
    },
    form = form,
    tagKey = "send"
)
```

### Devre dışı ve salt okunur

`enabled = false` kutuyu devre dışı renklerle çizer: kutu basış almaz ve ekran okuyucuya devre dışı olduğu söylenir.

`onCheckedChange = null` ise kutu salt okunurdur: basış ve odak almaz, renkleri değişmez, adını ve durumunu yine söyler. Yalnızca neyin seçildiğini göstermek içindir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

PantrixCheckbox(checked = true, onCheckedChange = {}, enabled = false, label = "Devre dışı", tagKey = "off")
PantrixCheckbox(
    checked = true,
    onCheckedChange = null,
    label = "Salt okunur",
    supportingText = "Basılmaz; yalnızca durumunu gösterir",
    tagKey = "read_only"
)
```

### Etiketsiz: bir listenin satırında

Etiketi olmayan kutu: bir tablonun ya da bir listenin satırında yazı zaten satırın içindedir. Kutunun adını ekran okuyucuya `contentDescription` söyler: "1042 numaralı siparişi seç".

Satırdaki yazı kutunun parçası değildir: basılan yer kutu ve çevresinde ayrılan dokunma hedefidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var selected by rememberSaveable { mutableStateOf(setOf("1042")) }
Column(modifier = Modifier.widthIn(max = 360.dp)) {
    listOf("1042", "1043", "1044").forEach { number ->
        Row(
            horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
            verticalAlignment = Alignment.CenterVertically
        ) {
            PantrixCheckbox(
                checked = number in selected,
                onCheckedChange = { on -> selected = if (on) selected + number else selected - number },
                contentDescription = "$number numaralı siparişi seç",
                tagKey = "order_$number"
            )
            PantrixText(text = "Sipariş $number", modifier = Modifier.weight(1f))
            PantrixText(text = "Hazırlanıyor", color = PantrixTheme.colors.textSecondary)
        }
    }
}
PantrixText(text = "${selected.size} sipariş seçili", color = PantrixTheme.colors.textSecondary)
```

### Kendi renkleri

`colors` yalnızca verilen alanları değiştirir: "Hediye paketi" kutusunun dolgusu uygulamanın kendi morundadır, işareti o morun üstünde okunan renktedir; kenarı temanın renginde kalır. Kutuyu boşalt: kenarı öteki kutularınkiyle aynıdır.

Bu renkler basılabilen ve hatasız bir kutunundur. İkinci kutuya da aynı renkler verildi, ama devre dışıdır: temanın devre dışı renkleriyle çizilir. Hatalı bir kutu da temanın `danger` rolünde kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.checkbox.CheckboxColors
import com.pantrixui.components.elements.checkbox.PantrixCheckbox

val own = ownColors()
var giftWrap by rememberSaveable { mutableStateOf(true) }
PantrixCheckbox(
    checked = giftWrap,
    onCheckedChange = { giftWrap = it },
    label = "Hediye paketi",
    supportingText = "Kutunun dolgusu ve işareti dışarıdan verildi",
    colors = CheckboxColors(checked = own.color, checkmark = own.onColor),
    tagKey = "gift_wrap"
)
PantrixCheckbox(
    checked = true,
    onCheckedChange = {},
    enabled = false,
    label = "Hediye notu",
    supportingText = "Aynı renkler verildi; devre dışı kutu temanın renginde kalır",
    colors = CheckboxColors(checked = own.color, checkmark = own.onColor),
    tagKey = "gift_note"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Stil

`style` tek bir kutunun geometrisini değiştirir: `size` kutunun boyu, `shape` köşeleri, `strokeWidth` kenarın ve işaretin çizgi kalınlığıdır. Yalnızca verilen alanlar değişir; gerisi temanın ve platformun stilinden gelir.

İlk kutu 24dp'dir ve çizgisi 3dp; ikincinin köşeleri yuvarlatılmamıştır. Kutunun rengi stilin parçası değildir: o durumdan ve `colors`'tan gelir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.CheckboxStyle
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.foundation.token.shape.ShapeSpec

var large by rememberSaveable { mutableStateOf(true) }
var square by rememberSaveable { mutableStateOf(true) }
PantrixCheckbox(
    checked = large,
    onCheckedChange = { large = it },
    label = "Büyük kutu, kalın çizgi",
    style = CheckboxStyle(size = 24.dp, strokeWidth = 3.dp),
    tagKey = "large"
)
PantrixCheckbox(
    checked = square,
    onCheckedChange = { square = it },
    label = "Köşeli kutu",
    style = CheckboxStyle(shape = ShapeSpec.Fixed(RectangleShape)),
    tagKey = "square"
)
```

### Kutu sonda

Kutu etiketin sonunda (`controlPosition = ControlPosition.End`): bir listenin seçenekleri, kutular sütunun sonunda alt alta. Satırlar sütunun genişliğini alır (`Modifier.fillMaxWidth()`).

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.selection.ControlPosition

var photos by rememberSaveable { mutableStateOf(true) }
var contacts by rememberSaveable { mutableStateOf(false) }
Column(Modifier.widthIn(max = 360.dp)) {
    PantrixCheckbox(
        checked = photos,
        onCheckedChange = { photos = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Fotoğrafları yedekle",
        tagKey = "photos_end",
        controlPosition = ControlPosition.End
    )
    PantrixCheckbox(
        checked = contacts,
        onCheckedChange = { contacts = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Kişileri yedekle",
        tagKey = "contacts_end",
        controlPosition = ControlPosition.End
    )
}
```

## API

### PantrixCheckbox

`import com.pantrixui.components.elements.checkbox.PantrixCheckbox`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCheckbox(
    checked: Boolean,
    onCheckedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: CheckboxStyle? = null,
    colors: CheckboxColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Bir onay kutusu: işaretli ya da boş bir kutu ve o kutunun etiketi.

Kutu, etiket ve yardım metni tek bir hedeftir. Üstlerinde herhangi bir yere basmak kutuyu değiştirir, çünkü telefonda parmağın basabildiği yerin çoğu yazıdır. Ekran okuyucu da tek bir onay kutusu duyar: adı etiketidir ve işaretli olup olmadığını söyler. Kutu, etiket ve yardım metni kaç satır sürerse sürsün, etiketin ilk satırında durur. Kutu ne kadar küçük olursa olsun satır, platformun dokunma hedefi kadar yer tutar.

`onCheckedChange` verilmeyen onay kutusu salt okunurdur: basış ve odak almaz, adını ve durumunu yine söyler. `error` kutuyu ve yardım metnini danger rolüne çevirir ve duyurulur. Kutu işaretlenirken ve boşaltılırken işaret çizilerek gelir ve gider, dolgu da o sırada belirir ve solar: azaltılmış harekette bir anda.

Parametreler:

- `checked: Boolean`: Kutunun işaretli olup olmadığı.
- `onCheckedChange: ((Boolean) -> Unit)?`: Kullanıcının istediği değerle, `checked`'in tersiyle çağrılır. Onay kutusu kendiliğinden bir şey değiştirmez: `checked` öyle diyorsa işaretlidir. Null onu salt okunur yapar.
- `modifier: Modifier`: Satırın modifier'ı.
- `enabled: Boolean`: Onay kutusunun değiştirilip değiştirilemediği. Değiştirilemeyen kutu devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `label: String?`: Kutunun yanındaki yazı: hedefin bir parçasıdır ve ekran okuyucu için onay kutusunun adıdır.
- `supportingText: String?`: Etiketin altında, daha küçük bir yazıyla duran yardım. `error` true iken mesajın kendisidir.
- `error: Boolean`: Değerin yanlış olup olmadığı. Yanlışsa kutu ve yardım metni danger rolüne döner, ekran okuyucuya girdinin geçersiz olduğu söylenir.
- `style: CheckboxStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: CheckboxColors?`: Bu onay kutusunun kendi renkleri. Verdiği renkler kullanılır, gerisi temadan gelir. Devre dışı kutu ve hatalı kutu temanın renklerinde kalır.
- `contentDescription: String?`: Ekran okuyucunun onay kutusu için söylediği: bir tablo satırındaki gibi `label` verilmeyen kutunun adıdır ya da etiketin yerine okunur.
- `tagKey: String?`: Onay kutusunun otomasyon anahtarı: satır `Checkbox_<tagKey>` etiketini taşır. Her değişiklik bir `Checkbox` olayı olarak bildirilir: olay kutunun basıldığı andaki durumunu taşır, etiketini hiçbir zaman taşımaz.
- `interactionSource: MutableInteractionSource?`: Onay kutusunun dışarı taşınan etkileşimleri. Null verilirse kutu kendi kaynağını tutar.
- `controlPosition: ControlPosition`: kutunun durduğu yer: bir seçenek listesindeki gibi etiketin önü ya da arkası. Arkasındaysa kutu satıra verilen genişliğin sonunda durur, `Modifier.fillMaxWidth()` onu ötekilerle hizalar; satıra genişlik verilmemişse etiketin hemen ardındadır. Etiket kutunun bıraktığı yerde sarar.

### PantrixCheckbox

`import com.pantrixui.components.elements.checkbox.PantrixCheckbox`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCheckbox(
    field: FormField<Boolean>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    style: CheckboxStyle? = null,
    colors: CheckboxColors? = null,
    contentDescription: String? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Bir formun alanına bağlı onay kutusu: değeri, hatası ve adı `field`'dan gelir.

Kutuyu değiştirmek alanı değiştirir ve alanı dokunulmuş sayar. Böylece bir kuralın mesajı kimsenin dokunmadığı bir formda değil, ilk değişiklikten sonra ya da form gönderildiğinde görünür. Alan hatadayken mesaj `supportingText`'in yanında durmaz, yerine geçer. Alanın kimliği onay kutusunun otomasyon anahtarıdır, `Checkbox_<id>`. Form bu alan hatadayken gönderilirse odağı buraya yollayabilir.

Kontrollü biçimin bir parametresi değil, ayrı bir overload'dur: böylece bir değer ile bir alan birlikte verilemez.

Parametreler:

- `field: FormField<Boolean>`: Onay kutusunun gösterdiği ve değiştirdiği alan.
- `modifier: Modifier`: Satırın modifier'ı.
- `enabled: Boolean`: Onay kutusunun değiştirilip değiştirilemediği.
- `label: String?`: Kutunun yanındaki yazı: hedefin bir parçasıdır ve ekran okuyucu için onay kutusunun adıdır.
- `supportingText: String?`: Alanın orada gösterecek bir hatası yokken etiketin altında duran yardım.
- `style: CheckboxStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: CheckboxColors?`: Bu onay kutusunun kendi renkleri. Verdiği renkler kullanılır, gerisi temadan gelir. Devre dışı kutu ve hatalı kutu temanın renklerinde kalır.
- `contentDescription: String?`: Ekran okuyucunun, `label` verilmeyen onay kutusu için ya da etiketin yerine söylediği.
- `controlPosition: ControlPosition`: kutunun durduğu yer: bir seçenek listesindeki gibi etiketin önü ya da arkası. Arkasındaysa kutu satıra verilen genişliğin sonunda durur, `Modifier.fillMaxWidth()` onu ötekilerle hizalar; satıra genişlik verilmemişse etiketin hemen ardındadır. Etiket kutunun bıraktığı yerde sarar.

### PantrixTriStateCheckbox

`import com.pantrixui.components.elements.checkbox.PantrixTriStateCheckbox`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTriStateCheckbox(
    state: ToggleableState,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: CheckboxStyle? = null,
    colors: CheckboxColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Üçüncü bir durumu olan onay kutusu: işaretli, boş ya da ikisinden de biraz.

Üçüncü durum, bir kısmı seçili bir listenin üstündeki "tümünü seç" kutusunun gösterdiği durumdur. Bir çizgi çizer ve ekran okuyucu onu boş diye değil, olduğu gibi duyar. Bir basışın neye yol açacağını çağıran söyler: `onClick` yalnızca sorar. Geri kalan her şeyde `PantrixCheckbox`'tır: etiketiyle birlikte tek bir hedeftir, etiketin ilk satırında durur, geri çağrı verilmezse salt okunurdur.

Parametreler:

- `state: ToggleableState`: İşaretli, boş ya da belirsiz.
- `onClick: (() -> Unit)?`: Kullanıcı onay kutusuna basınca çağrılır. Null onu salt okunur yapar.
- `modifier: Modifier`: Satırın modifier'ı.
- `enabled: Boolean`: Onay kutusuna basılıp basılamadığı. Basılamayan kutu devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `label: String?`: Kutunun yanındaki yazı: hedefin bir parçasıdır ve ekran okuyucu için onay kutusunun adıdır.
- `supportingText: String?`: Etiketin altında, daha küçük bir yazıyla duran yardım. `error` true iken mesajın kendisidir.
- `error: Boolean`: Değerin yanlış olup olmadığı. Yanlışsa kutu ve yardım metni danger rolüne döner, ekran okuyucuya girdinin geçersiz olduğu söylenir.
- `style: CheckboxStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: CheckboxColors?`: Bu onay kutusunun kendi renkleri. Verdiği renkler kullanılır, gerisi temadan gelir. Devre dışı kutu ve hatalı kutu temanın renklerinde kalır.
- `contentDescription: String?`: Ekran okuyucunun, `label` verilmeyen onay kutusu için ya da etiketin yerine söylediği.
- `tagKey: String?`: Onay kutusunun otomasyon anahtarı: satır `Checkbox_<tagKey>` etiketini taşır.
- `interactionSource: MutableInteractionSource?`: Onay kutusunun dışarı taşınan etkileşimleri. Null verilirse kutu kendi kaynağını tutar.
- `controlPosition: ControlPosition`: kutunun durduğu yer: bir seçenek listesindeki gibi etiketin önü ya da arkası. Arkasındaysa kutu satıra verilen genişliğin sonunda durur, `Modifier.fillMaxWidth()` onu ötekilerle hizalar; satıra genişlik verilmemişse etiketin hemen ardındadır. Etiket kutunun bıraktığı yerde sarar.

### CheckboxStyle

`import com.pantrixui.components.elements.checkbox.CheckboxStyle`, `com.pantrixui:components` içinden

```kotlin
class CheckboxStyle(
    public val size: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified
) : PantrixStyle<CheckboxStyle>
```

`PantrixCheckbox`'un kutusu: boyu, köşeleri ve kenarı.

Kutu her platformda bir karedir ve köşeleri şekil ölçeğinin küçük adımıdır, varsayılan olarak 4dp. Material 3'teki gibi 18dp'dir, iOS'ta ise 22dp. iOS'un kendi onay kutusu yoktur ve kutu orada da yuvarlak değildir: daire bir radyo düğmesidir, boş bir daire de kutulardan yalnızca birinin seçilebileceğini söylerdi.

Üçü de yoğunlukla ölçeklenmez: kutu, köşeleri ve kenarı hava değildir. Kutuyla etiketi arasındaki boşluk ölçeklenir, çünkü temanın boşluk ölçeğinden gelir. Onay kutusunun renkleri stilinin parçası değildir: durumundan gelir, kendi renkleri olan bir kutuda `CheckboxColors`'tan da.

Parametreler:

- `size: Dp`: Kutunun genişliği ve yüksekliği, kenarıyla birlikte.
- `shape: ShapeSpec`: Kutunun köşeleri: markanın şekil ölçeğinin bir adımı. Böylece köşeleri keskin olan bir markanın kutuları da keskin köşeli olur.
- `strokeWidth: Dp`: Kutunun kenarının kalınlığı. İşaret ve çizgi de bu kalınlıkta çizilir.

### CheckboxColors

`import com.pantrixui.components.elements.checkbox.CheckboxColors`, `com.pantrixui:components` içinden

```kotlin
data class CheckboxColors(
    public val checked: Color = Color.Unspecified,
    public val checkmark: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir onay kutusu için `PantrixCheckbox`'un boyandığı renkler: verilen renk kullanılır, verilmeyen temanın rolünde kalır. Bir ürün yalnızca değiştirdiği renkleri verir:

```kotlin
PantrixCheckbox(
    checked = accepted,
    onCheckedChange = { accepted = it },
    label = stringResource(Res.string.accept_terms),
    colors = CheckboxColors(checked = brand, checkmark = onBrand)
)
```

Bunlar basılabilen ve hatasız bir onay kutusunun renkleridir. Burada ne verilirse verilsin, devre dışı bir kutu temanın devre dışı rolleriyle, hatalı bir kutu da temanın danger rolüyle çizilir: ikisi de bir üründe her yerde aynı görünsün diye.

Burada verilen dolgu temanın kendi renklerinden biriyse, üstüne çizilenlerin rengi de ayrıca verilmediği sürece, temanın o dolguyla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `checked: Color`: İşaretli ya da belirsiz kutunun dolgusu. Temanın `primary` rengi.
- `checkmark: Color`: Dolgunun üstündeki işaret ve çizgi: `checked`'in üstünde okunan renk. Primary rolünün `onColor`'ı.
- `border: Color`: İşaretli olmayan kutunun kenarı. Temanın `borderStrong` rengi: boş bir kutu kenarından ibarettir.

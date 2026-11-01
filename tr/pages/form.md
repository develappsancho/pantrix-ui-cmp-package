# Form

Bir formun alanları, kuralları ve gönderilişi. Bileşenlerin kendisi değil, onları bir arada tutan durumdur: hangi alanın hatalı olduğunu, gönderilirken neyin beklediğini ve Enter'ın ne yaptığını bileşenler tek tek değil, form bilir.

## Özellikler

- **Alanlar.** `rememberFormState()` bir formun durumunu kurar, `form.field(id, initial, kurallar…)` bir alanını. Alanın `id`'si formdaki adı ve ona bağlanan bileşenin otomasyon etiketidir: formdaki bileşen `tagKey` istemez.
- **Bağlanan bileşenler.** Metin alanları, onay kutusu, radyo grubu, anahtar, Select, MultiSelect, tarih ve saat alanları bir `field` alır: değeri gösterir, değişince `onValueChange`'i, odaktan çıkınca `onFocusLost`'u çağırır ve hatayı kutunun altına yazar. Bunlardan biri olmayan bir bileşen alana elle bağlanır.
- **Kurallar.** Bir `Rule` değerin hatasını ya da null'u verir. `Rules` en sık olanları taşır: `notBlank`, `required`, `mustBeTrue`, `minLength`, `maxLength`, `matches` ve başka bir şeye bakan kural için `satisfies`. Alanın kuralları sırayla denenir; ilk geçmeyen, hatayı verir.
- **Hata ne zaman görünür.** Dokunulmamış alan hata göstermez: hata alan odaktan çıkınca ya da form gönderilince görünür. Dokunulmuş alan her değişiklikte yeniden denetlenir, düzeltilen hata hemen kalkar.
- **Gönderme.** `form.submit { … }` önce bütün alanları denetler; geçmeyen varsa ilk hatalı alana odak gider ve blok çalışmaz. Blok sürerken `isSubmitting` doğrudur: `form` verilen düğme o sürede yükleniyor görünür ve ikinci basışı almaz.
- **Enter.** `form` verilen bir metin alanında klavyenin eylem tuşu formu gönderir: `form` verilen düğmenin işiyle, ya da `RegisterSubmit` ile verilen işle. Birden çok düğme varsa son kaydolan kazanır.
- **Elle.** `validateAll()` bütün alanları denetler ve dokunulmuş sayar, `focusFirstError()` ilk hatalı alana odak verir, `isValid` hiçbir hata göstermeden formun geçip geçmediğini söyler, `reset()` formu başa döndürür. `field.reset(değer)` bir alana yeni bir başlangıç değeri verir: sunucudan gelen kayıtlı bir adres gibi.

## Örnekler

### Bir kayıt formu

Bir kayıt formu, `Rules`'ın her kuralıyla: ad boş geçilmez (`notBlank`), e-posta bir desene uyar (`matches`), parola en az sekiz, en çok altmış dört karakterdir (`minLength`, `maxLength`), ikinci parola birinciye bakar (`satisfies`), doğum günü ve ülke seçilmeden geçilmez (`required`), koşullar kabul edilir (`mustBeTrue`).

Hiçbir şey yazmadan "Hesap aç"a bas: bütün hatalar birlikte görünür ve odak ilk hatalı alana gider. Bir alanı doldur: hatası yazarken kalkar. Form geçerliyse düğme gönderilirken yükleniyor görünür; son alanda Enter da aynı işi yapar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.pantrixui.components.date.datetextfield.PantrixDateTextField
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.securetextfield.PantrixSecureTextField
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.date.PantrixDate
import com.pantrixui.foundation.date.rememberToday
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
val name = form.field("name", initial = "", Rules.notBlank("Adınızı yazın"))
val email = form.field(
    "email",
    initial = "",
    Rules.notBlank("E-posta adresinizi yazın"),
    Rules.matches(EMAIL, "Bu bir e-posta adresi değil")
)
val password = form.field(
    "password",
    initial = "",
    Rules.minLength(8, "Parola en az 8 karakter olmalı"),
    Rules.maxLength(64, "Parola en çok 64 karakter olabilir")
)
val again = form.field(
    "password_again",
    initial = "",
    Rules.notBlank("Parolayı yeniden yazın"),
    Rules.satisfies<String>("Parolalar aynı değil") { it == password.value }
)
val birthday = form.field<PantrixDate?>("birthday", initial = null, Rules.required("Doğum gününüzü yazın"))
val country = form.field<String?>("country", initial = null, Rules.required("Bir ülke seçin"))
val terms = form.field("terms", initial = false, Rules.mustBeTrue("Koşulları kabul edin"))
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(field = name, modifier = Modifier.fillMaxWidth(), form = form, label = "Ad")
    PantrixTextField(
        field = email,
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "E-posta",
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
    )
    PantrixSecureTextField(
        field = password,
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "Parola",
        supportingText = "En az 8 karakter"
    )
    PantrixSecureTextField(
        field = again,
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "Parola, yeniden"
    )
    PantrixDateTextField(field = birthday, form = form, label = "Doğum günü", maxDate = rememberToday())
    PantrixSelect(
        field = country,
        options = COUNTRIES,
        modifier = Modifier.fillMaxWidth(),
        label = "Ülke",
        placeholder = "Seçin"
    )
    PantrixCheckbox(field = terms, label = "Kullanım koşullarını kabul ediyorum")
    PantrixButton(
        text = "Hesap aç",
        onClick = {
            scope.launch {
                form.submit {
                    delay(SUBMIT_MILLIS)
                    report("Hesap açıldı: ${email.value}")
                }
            }
        },
        modifier = Modifier.fillMaxWidth(),
        form = form,
        tagKey = "sign_up"
    )
}

private val COUNTRIES = listOf(
    SelectOption("TR", "Türkiye"),
    SelectOption("DE", "Almanya"),
    SelectOption("NL", "Hollanda"),
    SelectOption("GB", "Birleşik Krallık")
)

private val EMAIL = Regex("[^@\\s]+@[^@\\s]+\\.[^@\\s]+")

private const val SUBMIT_MILLIS = 1_200L
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kendi kuralın

Uygulamanın kendi kuralı: `Rule`, değerin hatasını ya da null'u veren tek bir işlevdir. Burada kullanıcı adının üç kuralı var: en az üç karakter (`Rules.minLength`), yalnız küçük harf, rakam ve alt çizgi (`Rules.matches`), ve uygulamanın kendisi: ad alınmış olmamalı. Kurallar sırayla denenir; ilk geçmeyen hatayı verir.

"Denetle" formu elle denetler: `validateAll()` bütün alanları dokunulmuş sayıp denetler, geçmeyen varsa `focusFirstError()` odağı ilk hatalı alana verir. "admin", "pantrix" ya da "destek" yaz ve dene.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rule
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val form = rememberFormState()
val handle = form.field(
    "handle",
    initial = "",
    Rules.minLength(3, "Kullanıcı adı en az 3 karakter olmalı"),
    Rules.matches(HANDLE, "Yalnız küçük harf, rakam ve alt çizgi"),
    FreeHandle
)
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(
        field = handle,
        modifier = Modifier.fillMaxWidth(),
        label = "Kullanıcı adı",
        supportingText = "Örneğin ayse_42"
    )
    PantrixButton(
        text = "Denetle",
        onClick = {
            if (form.validateAll()) report("“${handle.value}” boşta") else form.focusFirstError()
        },
        variant = ButtonVariant.Outline,
        tagKey = "check_handle"
    )
}

private val HANDLE = Regex("[a-z0-9_]+")

private val FreeHandle = Rule<String> { value -> "“$value” alınmış".takeIf { value.lowercase() in TAKEN_HANDLES } }

private val TAKEN_HANDLES = setOf("admin", "pantrix", "destek")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Enter ve kendi gönderme düğmen

Bir yorum satırı: gönderen, `form` alan bir `PantrixButton` değil, satırın sonundaki ikon düğmesidir. `RegisterSubmit` Enter'ı onun işine bağlar; `form` verilen metin alanında Enter formu o işle gönderir.

`isSubmitting` gönderme sürerken doğrudur: ikon düğmesinin yerinde bir spinner durur. İş bitince `reset()` alanı başa döndürür: yeni bir yorum hatasız ve boş başlar. Boş bir yorumu göndermeyi dene: hata görünür, odak alanda kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.form.RegisterSubmit
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
val comment = form.field(
    "comment",
    initial = "",
    Rules.notBlank("Bir şey yazın"),
    Rules.maxLength(280, "Yorum en çok 280 karakter olabilir")
)
val send: () -> Unit = {
    scope.launch {
        form.submit {
            delay(SUBMIT_MILLIS)
            report("Gönderildi: ${comment.value}")
            form.reset()
        }
    }
}
form.RegisterSubmit(send)
Row(
    modifier = Modifier.widthIn(max = 480.dp),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.Top
) {
    PantrixTextField(
        field = comment,
        modifier = Modifier.weight(1f),
        form = form,
        placeholder = "Bir yorum yaz",
        contentDescription = "Yorum"
    )
    if (form.isSubmitting) {
        PantrixSpinner(contentDescription = "Gönderiliyor")
    } else {
        PantrixIconButton(
            imageVector = PantrixIcons.ArrowForward,
            contentDescription = "Gönder",
            onClick = send,
            variant = ButtonVariant.Solid,
            tagKey = "send"
        )
    }
}

private const val SUBMIT_MILLIS = 1_200L
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Formun durumu ve başa dönmek

Formun durumunu okumak: `isValid` hiçbir hata göstermeden formun geçip geçmediğini, `fields` alanlarını söyler; her alanın `isValid()`'i, `touched`'ı ve `error`'u vardır. Alttaki satırlar yazdıkça değişir.

"Kayıtlı adresi getir" alanlara `reset(değer)` ile yeni bir başlangıç değeri verir: sunucudan gelen bir kayıt gibi, dokunulmamış ve hatasız. "Baştan başla" `form.reset()` ile her alanı ilk değerine döndürür.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val form = rememberFormState()
val street = form.field("street", initial = "", Rules.notBlank("Sokağı yazın"))
val city = form.field("city", initial = "", Rules.notBlank("Şehri yazın"))
val postcode = form.field("postcode", initial = "", Rules.matches(POSTCODE, "Posta kodu beş rakamdır"))
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(field = street, modifier = Modifier.fillMaxWidth(), label = "Sokak")
    PantrixTextField(field = city, modifier = Modifier.fillMaxWidth(), label = "Şehir")
    PantrixTextField(
        field = postcode,
        modifier = Modifier.fillMaxWidth(),
        label = "Posta kodu",
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
    )
    val missing = form.fields.filterNot { it.isValid() }.map { ADDRESS_LABELS.getValue(it.id) }
    PantrixText(
        text = if (form.isValid) "Adres tam" else "Eksik: ${missing.joinToString()}",
        style = PantrixTheme.typography.footnote,
        tagKey = "address_state"
    )
    PantrixText(
        text = "Dokunulan alan: ${form.fields.count { it.touched }} / ${form.fields.size}, " +
            "hata gösteren: ${form.fields.count { it.error != null }}",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(
            text = "Kayıtlı adresi getir",
            onClick = {
                street.reset("Atatürk Bulvarı 12")
                city.reset("Ankara")
                postcode.reset("06690")
            },
            variant = ButtonVariant.Outline,
            tagKey = "saved_address"
        )
        PantrixButton(
            text = "Baştan başla",
            onClick = form::reset,
            variant = ButtonVariant.Text,
            tagKey = "start_over"
        )
    }
}

private val POSTCODE = Regex("[0-9]{5}")

private val ADDRESS_LABELS = mapOf("street" to "sokak", "city" to "şehir", "postcode" to "posta kodu")
```

### Elle bağlanan bir bileşen

Bir `field` almayan bileşen de forma katılır: alanın `value`'sunu gösterir, değişince `onValueChange`'i, odaktan çıkınca `onFocusLost`'u çağırır, `error`'u kendisi yazar. `focusRequester` ona bağlanınca `focusFirstError()` odağı oraya da verebilir. Burada teslimat zamanı bir `PantrixSegmentButton`'dur ve seçilmeden sipariş verilmez.

Bir zaman seçmeden "Siparişi ver"e bas: segmentin altında hata görünür ve odak segmente gider.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
val form = rememberFormState()
val slot = form.field<String?>("delivery", initial = null, Rules.required("Bir teslimat zamanı seçin"))
val note = form.field("note", initial = "", Rules.maxLength(80, "Not en çok 80 karakter olabilir"))
var hadFocus by remember { mutableStateOf(false) }
Column(
    modifier = Modifier.widthIn(max = 400.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Teslimat zamanı", style = PantrixTheme.typography.footnote)
        PantrixSegmentButton(
            options = DELIVERY_SLOTS,
            selected = slot.value,
            onSelect = slot::onValueChange,
            modifier = Modifier
                .focusRequester(slot.focusRequester)
                .onFocusChanged { focus ->
                    if (hadFocus && !focus.hasFocus) slot.onFocusLost()
                    hadFocus = focus.hasFocus
                },
            tagKey = slot.id
        )
        slot.error?.let { error ->
            PantrixText(
                text = error,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.danger.color
            )
        }
    }
    PantrixTextField(field = note, modifier = Modifier.fillMaxWidth(), form = form, label = "Kuryeye not")
    PantrixButton(
        text = "Siparişi ver",
        onClick = {
            val chosen = DELIVERY_SLOTS.first { it.value == slot.value }
            report("Sipariş verildi: ${chosen.label}")
        },
        form = form,
        tagKey = "order"
    )
}

private val DELIVERY_SLOTS = listOf(
    SegmentOption<String?>("morning", "Sabah", tagKey = "morning"),
    SegmentOption<String?>("afternoon", "Öğleden sonra", tagKey = "afternoon"),
    SegmentOption<String?>("evening", "Akşam", tagKey = "evening")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

## API

### FormState

`import com.pantrixui.components.elements.form.FormState`, `com.pantrixui:components` içinden

```kotlin
class FormState
```

Bir formun alanları ve gönderilişinin akışı.

Bileşenlerin yoksa her birinin ayrı ayrı ve farklı biçimde yeniden icat edeceği üç şeyi tutar: doğrulama geçmeyince hangi alanın odağı alacağını, bir gönderimin sürüp sürmediğini ve Enter'ın ne yaptığını.

`@Stable`, derleyicinin kanıtlayamadığı ama sınıfın uyduğu bir iddiadır: bir composable'ın okuduğu her şey snapshot durumudur, ve tek düz alan, gönderme işi, kompozisyonda hiç okunmaz. O olmasa derleyici sınıfı kararsız sayar ve derleyici ölçümlerinin kapısı `form` alan her bileşeni geri çevirir.

Üyeleri:

- `fields: List<FormField<*>>`: Formun alanları, tanımlandıkları sırayla: bir gönderimde hatalı ilk alan odağı alır.
- `isSubmitting: Boolean`: `submit` çalışırken true.

  `PantrixButton(form = ...)` yükleniyor durumu için bunu okur: sabırsız ikinci bir basış formu iki kez gönderemez. Devre dışı durumu, birinin ayarlamayı hatırlaması gereken ayrı bir bayraktan değil, spinner ile aynı kaynaktan gelir.
- `isValid: Boolean`: Hiçbir şeyi dokunulmuş saymadan, her alanın şu an geçip geçmediği.
- `fun validateAll(): Boolean`: Her şeyi doğrular ve her alanı dokunulmuş sayar: hatalar görünür olur.

  Gönderirken dokunulmuş saymak, "boş bir formda gönder'e basmak" hataların her denemede birer birer değil, hepsinin birden görünmesini sağlar.
- `fun focusFirstError(): Boolean`: Odağı hatalı ilk alana taşır. Odaklanacak bir şey yoksa false döner.

  Uzun bir formu sorunun olduğu yere kaydırmak, düzeltilebilir bir hatayla hiçbir şey yapmayan bir gönder düğmesine bakakalan bir kullanıcı arasındaki farktır. Bileşeni şu an kompozisyonda olmayan alanları atlar: bağlı olmayan bir FocusRequester'dan odak istemek hata fırlatır.
- `suspend fun submit(block: suspend () -> Unit)`: Doğrular, her şey geçtiyse `block`'u çalıştırır.

  Çağrı boyunca `isSubmitting`'i kendisi tutar: bayrak, erken bir dönüşle ya da bir hatayla açık kalamaz. Elle yazılan form gönderiminin en yaygın hatası budur.
- `fun reset()`: Formu baştan başlatır. Ekrandaki her alan ilk değerine döner, dokunulmamış ve hatasız; doğrulanmaya devam eder. Ekrandan çıkmış alanlar unutulur; geri gelen yeniden kaydolur.
- `fun requestSubmit()`: Bir alan Enter'a basıldığını bildirince çağrılır.

### rememberFormState

`import com.pantrixui.components.elements.form.rememberFormState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberFormState(): FormState
```

Yeniden kurulmalar boyunca korunan bir `FormState`. Kaydedilen bir durum değildir. Alanları `field` ile tanımlanır.

### FormState.field

`import com.pantrixui.components.elements.form.field`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> FormState.field(
    id: String,
    initial: T,
    vararg rules: Rule<T>
): FormField<T>
```

Bir alan tanımlar.

`id` ile hatırlanır: değer yeniden kurulmada korunur, ama gerçekten farklı bir alan, örneğin dinamik bir listenin başka bir satırı, kendi durumunu alır.

Parametreler:

- `id: String`
- `initial: T`: alanın başladığı değer; alan sıfırlanınca da ona döner.
- `vararg rules: Rule<T>`: değerin sırayla denetlendiği kurallar: tutmayan ilki alanın mesajını verir.

### FormField

`import com.pantrixui.components.elements.form.FormField`, `com.pantrixui:components` içinden

```kotlin
class FormField<T>
```

Bir formdaki bir alan: değeri, kuralları ve şu an hatalı olup olmadığı.

`id` aynı zamanda bileşenin otomasyon etiketidir: forma bağlı bir bileşen `tagKey` istemez, alan zaten değişmeyen ve dilden bağımsız bir ad taşır.

`@Stable`, `FormState`'teki nedenle: `value`, `error` ve `touched` snapshot durumudur; `isAttached` ise kompozisyonun hiç okumadığı bir kayıttır.

Parametreler:

- `id: String`: Alanın formdaki adı, ve ona bağlanan bileşenin otomasyon etiketi.

Üyeleri:

- `value: T`: Alanın şu anda tuttuğu: kullanıcı başka bir değer verene kadar ilk değeri, sıfırlandıktan sonra yine o değer.
- `error: String?`: Gösterilecek mesaj, ya da null.

  Alan dokunulana (`touched`) ya da form gönderilene kadar null kalır. Form açılır açılmaz "Zorunlu" göstermek, kullanıcıya daha bir şey yapmadan yanlış bir şey yaptığını söyler.
- `touched: Boolean`: Kullanıcı bu alanla bir kez etkileştiğinde true.
- `focusRequester: FocusRequester`: Alanın odaklandığı şey: alana bağlı bileşen onu bağlar ve alanı hatalı bulan bir gönderim odağı oraya taşır.
- `fun onValueChange(newValue: T)`: Bileşenler değişiklikte çağırır. Alanı yalnızca dokunulduktan sonra yeniden doğrular.

  `newValue`: kullanıcının alana verdiği değer.
- `fun onFocusLost()`: Bileşenler odak gidince çağırır. Alanı dokunulmuş sayar ve doğrular: bir hatayı göstermenin olağan anı budur.
- `fun validate(): Boolean`: Her kuralı çalıştırır ve geçmeyen ilkini yayımlar. Alan geçerliyse true döner.
- `fun isValid(): Boolean`: Kullanıcının henüz hak etmediği bir hatayı yayımlamadan alanın geçip geçmeyeceği.
- `fun reset(newValue: T)`: Alanı kullanıcı dokunmadan önceki hâline döndürür: değeri `newValue`, hatası yok.

### Rule

`import com.pantrixui.components.elements.form.Rule`, `com.pantrixui:components` içinden

```kotlin
fun interface Rule<in T>
```

Bir doğrulama kuralı. Hata mesajını, değer kabul edilebilirse null döner.

Kurallar bir hata kodu değil, kendi mesajlarını taşır: mesajı formu yazan çevirmek zorundadır. Kütüphane, `code` adlı bir alanın "Geçersiz giriş" değil "6 haneli kodu girin" istediğini bilemez.

Üyeleri:

- `fun check(value: T): String?`: `value` için hata mesajı, ya da `value` kabul edilebilirse null.

### Rules

`import com.pantrixui.components.elements.form.Rules`, `com.pantrixui:components` içinden

```kotlin
object Rules
```

Hemen her formda karşılaşılan kurallar.

Üyeleri:

- `fun notBlank(message: String): Rule<String>`: Null olmayan metin içindir. Yalnızca boşluk karakterlerinden oluşan girdiyi reddeder, oysa `isEmpty` onu geçirirdi.

  `message`: alanın metni boşken söylediği.
- `fun <T : Any> required(message: String): Rule<T?>`: Null olabilen değerler içindir: hiçbir şey seçilmemiş bir select, verilmemiş bir tarih.

  `message`: hiçbir şey seçilmemişken alanın söylediği.
- `fun mustBeTrue(message: String): Rule<Boolean>`: Rıza alınan onay kutuları içindir: "koşulları kabul et" için bir değerin olması yetmez.

  `message`: işaretlenmemişken alanın söylediği.
- `fun minLength(length: Int, message: String): Rule<String>`: En az `length` karakter. Baştaki ve sondaki boşluklar sayılmaz.

  `message`: metni `length`'ten kısayken alanın söylediği.
- `fun maxLength(length: Int, message: String): Rule<String>`: En çok `length` karakter. Boşluklar da sayılır.

  `message`: metni `length`'ten uzunken alanın söylediği.
- `fun matches(pattern: Regex, message: String): Rule<String>`: Değerin tamamı `pattern` ile eşleşir. Bir parçasının eşleşmesi yetmez.

  `message`: metni `pattern`'e uymazken alanın söylediği.
- `fun <T> satisfies(message: String, predicate: (T) -> Boolean): Rule<T>`: Alanın dışındaki bir şeye bağlı kurallar için çıkış yolu: bir şifre tekrarı, bir tarih aralığı, sunucuda önceden yapılmış bir benzersizlik denetimi.

  `message`: `predicate` değerini kabul etmezken alanın söylediği.

  `predicate`: bir değerin kabul edilip edilmediği.

### FormState.RegisterSubmit

`import com.pantrixui.components.elements.form.RegisterSubmit`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun FormState.RegisterSubmit(onSubmit: () -> Unit)
```

Enter'ı bir gönderme işine yöneltir.

Son kaydolan kazanır. "Kaydet" ile "Kaydet ve yenisini ekle"nin birlikte durduğu bir formda kullanıcının beklediği de budur: Enter ana işi çalıştırır, ana iş de altlıkta en son bildirilendir.

Parametreler:

- `onSubmit: () -> Unit`: formun bir alanında Enter'ın yaptığı: formun birincil eylemi.

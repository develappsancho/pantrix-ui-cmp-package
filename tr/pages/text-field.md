# Text Field

Kullanıcının yazdığı metin: bir ad, bir e-posta adresi, birkaç satırlık bir not. Etiketi kutunun üstünde durur ve yerinden oynamaz: yer tutucuyu örtmez, yazarken de okunur. Kutunun altında yardım metni ya da hatanın mesajı, iki ucunda ikonlar, sonunda alanı boşaltan bir düğme ve altında bir karakter sayacı olabilir.

Alan bir `TextFieldState` üstüne kuruludur: metni, seçimi ve klavyenin o an yazmakta olduğunu birlikte tutar. Bu yüzden klavyeye eskimiş bir metin verilmez: bazı klavyelerde harf kaybettiren ve imleci sıçratan budur. Metnini `String` olarak tutan kod için `value` ve `onValueChange` alan, bir formun alanı için `field` alan birer `PantrixTextField` daha vardır.

- `PantrixTextField` (`com.pantrixui.components.inputs.textfield`, `com.pantrixui:components`): Bir TextFieldState üzerinde, tek satırlık ya da çok satırlık bir yazı alanı: etiket, yer tutucu, yardım ve hata metni, ikonlar, temizle düğmesi, karakter sayacı ve form bağlantısıyla. Anahtar sözcükler: yazı alanı, metin alanı, giriş alanı, form alanı, girdi, çerçeveli alan.

## Özellikler

- **Üç biçim.** `state` alan biçimde metin durumdan okunur: kullanılacağı yerde `state.text`, yazıldıkça izlemek için `snapshotFlow { state.text.toString() }`. `value` ve `onValueChange` alan biçim metni çağıranda tutar ve süzmeyi `onValueChange` yapar. `field` alan biçim değerini, hatasını ve adını formdaki alanından alır.
- **Etiket ve yer tutucu.** `label` kutunun üstünde yazar ve alanın ekran okuyucudaki adıdır; etikete basmak da imleci kutuya koyar. `placeholder` alan boşken görünür. Etiketi olmayan alanın adını `contentDescription` söyler.
- **Yardım metni ve hata.** `supportingText` kutunun altında yazar. `error` kenarlığı, etiketi, yardım metnini ve imleci `danger` rolüne çevirir; yardım metni o zaman neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucuya hata olarak bildirilir.
- **İkonlar ve temizleme düğmesi.** `leadingIcon` metnin önünde, `trailingIcon` arkasında durur. `showClearButton` alan boş değilken onu boşaltan bir düğme gösterir: düğme imleci alanda bırakır ve Tab durağı değildir.
- **Uzunluk sınırı.** `maxLength` sınırı aşacak değişikliği bütünüyle geri çevirir ve kutunun altına sayacı yazar ("12/120"); `showCharacterCount = false` sayacı gizler.
- **Birkaç satır.** `lineLimits = TextFieldLineLimits.MultiLine(...)` ile kutu metniyle birlikte uzar ve Enter yeni satır açar. Alana yükseklik verilirse kutu onu doldurur ve sığmayan metin kutunun içinde kayar.
- **Klavye ve dönüşümler.** `keyboardOptions` klavyenin türünü ve eylem tuşunu seçer, `onKeyboardAction` o tuşa basılınca çağrılır. Sayı yazılan ve eylemi olan alan klavyesini `numberKeyboardOptions` ile ister: iPhone'un sayı tuş takımında eylem tuşu yoktur. `inputTransformation` yazılanı alana girmeden değiştirir ya da geri çevirir; `outputTransformation` metni değiştirmeden nasıl gösterileceğini söyler. `contentType` platforma alanın ne tuttuğunu söyler: alanı o doldurabilsin diye.
- **Odak, devre dışı ve salt okunur.** Odağı kutunun kenarlığı gösterir: `primary` renginde ve daha kalın, ayrıca bir halka çizilmez. Bir dialog'un ya da sheet'in altında kalan alan odağını korur, ama dinlenirken ve imleçsiz çizilir. `enabled = false` alan odak almaz; `readOnly` alan odaklanır, metni seçilir ve kopyalanır.
- **Stil ve renkler.** `style` (`TextFieldStyle`) kutunun şeklini, ölçülerini ve kenarlığını, `colors` (`TextFieldColors`) renklerini değiştirir: yalnızca verilen alanlar. Devre dışı alan ne verilirse verilsin temanın devre dışı renklerindedir.
- **Yazının boyu.** Yazılan yazı ve yer tutucu stilin `textRole`'üyle yazılır: Android'de ve iOS'ta `body` (16sp), Material 3'teki ve iOS'taki gibi; masaüstünde ve web'de `label` (14sp), işaretçiyle kullanılan bir sayfadaki gibi. Select'in kutusu ve sayfaya atlama alanı da onunla yazar.
- **Yazı yönü.** Her paragraf yönünü kendi ilk harfinden alır: Arapça bir formda yazılan e-posta adresi `ada@` diye okunur, `@ada` diye değil. Metin düzenin yanına hizalanır ve etiketinin tarafında kalır.

## Kullanım

### An e-mail address

```kotlin
val email = rememberTextFieldState()
PantrixTextField(
    state = email,
    label = stringResource(Res.string.email),
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
    contentType = ContentType.EmailAddress,
    tagKey = "email"
)
```

### Its text, to a view model as it is typed

```kotlin
val initial = remember(viewModel) { viewModel.uiState.value }
val username = rememberTextFieldState(initial.username)
LaunchedEffect(username) {
    snapshotFlow { username.text.toString() }.collectLatest { viewModel.updateUsername(it) }
}
PantrixTextField(
    state = username,
    label = stringResource(Res.string.username),
    tagKey = "username"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
val name = form.field("name", initial = "", Rules.notBlank(stringResource(Res.string.name_required)))
PantrixTextField(
    field = name,
    form = form,
    label = stringResource(Res.string.name),
    maxLength = 40
)
```

### Held as a String, with a password's dots

```kotlin
var password by remember { mutableStateOf("") }
PantrixTextField(
    value = password,
    onValueChange = { password = it },
    label = stringResource(Res.string.password),
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
    visualTransformation = PasswordVisualTransformation(),
    tagKey = "password"
)
```

### A search field, with no label

```kotlin
val query = rememberTextFieldState()
PantrixTextField(
    state = query,
    placeholder = stringResource(Res.string.search_orders),
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Search,
            contentDescription = null,
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
    onKeyboardAction = { onSearch(query.text.toString()) },
    contentDescription = stringResource(Res.string.search_orders),
    tagKey = "search"
)
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
val coupon = rememberTextFieldState()
PantrixTextField(
    state = coupon,
    label = stringResource(Res.string.coupon),
    colors = TextFieldColors(border = success.color, focusedBorder = success.color, cursor = success.color),
    tagKey = "coupon"
)
```

## Örnekler

### En yalın hâli

En az yazılan: bir `TextFieldState` ve bir etiket. Durum `rememberTextFieldState()` ile kurulur ve yazılan metin ondan okunur; alttaki satır `name.text`'i yazıldıkça gösterir.

Etiket kutunun üstünde durur ve yerinden oynamaz; etikete basmak da imleci kutuya koyar. Odağı kutunun kenarlığı gösterir. `tagKey` alanın test etiketini kurar: `TextField_<tagKey>`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val name = rememberTextFieldState()
PantrixTextField(
    state = name,
    modifier = Modifier.fillMaxWidth(),
    label = "Ad",
    tagKey = "name"
)
PantrixText(
    text = if (name.text.isEmpty()) "Henüz bir şey yazılmadı" else "Yazılan: ${name.text}",
    color = PantrixTheme.colors.textSecondary
)
```

### Etiketsiz bir arama alanı

Etiketi olmayan bir arama alanı: adını ekran okuyucuya `contentDescription` söyler. Yer tutucu da aynı şeyi söylediği için okuyucuya ayrıca okunmaz: alan boşken adı iki kez söylenmez.

`leadingIcon` metnin önünde durur. Yuva içine konanı boyutlandırmaz; ikon, alanın stilindeki boyutu alır: `PantrixTheme.style(TextFieldStyle).iconSize`. `showClearButton` alan boş değilken onu boşaltan düğmeyi gösterir; düğme imleci alanda bırakır.

`keyboardOptions` klavyenin eylem tuşunu "Ara" yapar, `onKeyboardAction` o tuşa basılınca çağrılır. Bir şey yazıp klavyenin "Ara" tuşuna ya da Enter'a bas: uygulamanın snackbar'ı arananı söyler.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val query = rememberTextFieldState()
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Sipariş ara",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Search,
            contentDescription = null,
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
    onKeyboardAction = { scope.launch { snackbars?.show(message = "Aranan: ${query.text}", tagKey = "searched") } },
    contentDescription = "Sipariş ara",
    tagKey = "search"
)
```

### Önde ve arkada ikon

`leadingIcon` metnin önünde, `trailingIcon` arkasında durur: sağdan sola bir düzende yer değiştirirler. İkisi de ikincil yazı rengini alır; yuvaya konan bir yazı da, ikinci alandaki "kg" gibi, o renkte çizilir.

Temizleme düğmesi `trailingIcon`'dan önce durur ve Tab durağı değildir: her alandan sonra bir durak, bir formu geçmek için gereken basışı ikiye katlardı. Ekran okuyucu düğmeye yine de bir düğme olarak ulaşır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val iconSize = PantrixTheme.style(TextFieldStyle).iconSize
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Kullanıcı adı",
    leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Person, contentDescription = null, size = iconSize) },
    tagKey = "username"
)
PantrixTextField(
    state = rememberTextFieldState("72"),
    modifier = Modifier.fillMaxWidth(),
    label = "Ağırlık",
    trailingIcon = { PantrixText(text = "kg") },
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
    tagKey = "weight"
)
```

### Yardım metni ve hata

`supportingText` kutunun altında, küçük yazıyla durur. `error = true` olunca kenarlık, etiket, yardım metni ve imleç `danger` rolüne döner; yardım metni o zaman neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucuya hata olarak bildirilir. Birkaç harf yaz: şifre sekiz karakterden kısa kaldıkça alan hatadadır ve kaç karakterin eksik olduğunu söyler.

Bu alan metnini `TextFieldState` yerine bir `String` olarak tutar: `value` gösterilir, her değişiklik `onValueChange` ile sorulur. Şifre `visualTransformation` ile nokta nokta çizilir. `remember` ile tutulur, `rememberSaveable` ile değil: kaydedilen durum diske yazılabilir. Metnini gösteren düğmesi olan şifre alanı `PantrixSecureTextField`'dır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import com.pantrixui.components.inputs.textfield.PantrixTextField

var password by remember { mutableStateOf("") }
val missing = 8 - password.length
val tooShort = password.isNotEmpty() && missing > 0
PantrixTextField(
    value = password,
    onValueChange = { password = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Şifre",
    supportingText = if (tooShort) "$missing karakter daha" else "En az 8 karakter",
    error = tooShort,
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
    visualTransformation = PasswordVisualTransformation(),
    contentType = ContentType.NewPassword,
    tagKey = "password"
)
```

### Metnini String olarak tutan alan

`value` ve `onValueChange` alan `PantrixTextField`: alan `value`'yu gösterir ve kullanıcının her değişikliğini `onValueChange` ile sorar. Geri çağrının almadığı değişiklik gösterilmez: süzme orada yapılır, bu biçim `inputTransformation` almaz. Sorulan metin bir sonraki kareye kadar `value` olarak geri dönmelidir, yoksa alan eski metni gösterir ve imleç sıçrar: metni, geri çağrının hemen yazdığı bir durumda tut; metin bir akışta yaşıyorsa `state` alan biçimi seç.

Bu biçim satırlarını `singleLine`, `minLines` ve `maxLines` ile alır ve söylenmedikçe tek satırdır. Buradaki alana, başka bir yerden yapıştırılmış gibi, iki satırlık bir adres verildi: alan satır sonunu boşluk olarak gösterir ve ikinci satır kesilmez; tutulan metin olduğu gibi kalır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.textfield.PantrixTextField

var address by remember { mutableStateOf("Bağdat Cad. No: 12\nKat 3, Daire 8") }
PantrixTextField(
    value = address,
    onValueChange = { address = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Adres (tek satır)",
    supportingText = "Metindeki satır sonu boşluk olarak görünür",
    showClearButton = true,
    tagKey = "address_line"
)
```

### String biçiminde satırlar ve eylem tuşu

Metnini `String` olarak tutan biçim, satırlarını `lineLimits` ile değil `singleLine`, `minLines` ve `maxLines` ile alır. İlk alan iki satır boyundadır ve dört satıra kadar uzar; oradan sonra metni içinde kaydırır.

Klavyenin eylem tuşunu da `onKeyboardAction` değil `keyboardActions` karşılar: `keyboardOptions`'ın adlandırdığı eylem için ne yapılacağını söyler. İkinci alana bir şey yazıp klavyenin eylem tuşuna bas: uygulamanın snackbar'ı yazılanı söyler.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var message by remember { mutableStateOf("") }
var nickname by remember { mutableStateOf("") }
PantrixTextField(
    value = message,
    onValueChange = { message = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Mesaj",
    singleLine = false,
    minLines = 2,
    maxLines = 4,
    tagKey = "message"
)
PantrixTextField(
    value = nickname,
    onValueChange = { nickname = it },
    modifier = Modifier.fillMaxWidth(),
    label = "Takma ad",
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
    keyboardActions = KeyboardActions(
        onDone = { scope.launch { snackbars?.show(message = "Takma ad: $nickname") } }
    ),
    tagKey = "nickname"
)
```

### Birkaç satır ve karakter sayacı

`lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3)` kutuyu üç satır boyunda başlatır; kutu metniyle birlikte uzar ve Enter yeni satır açar. Tab bir sekme yazmaz, odağı ilerletir: yoksa klavyeyle alandan ileri çıkılamazdı.

`maxLength = 120` sınırı aşacak değişikliği bütünüyle geri çevirir: yazı sınırda durur, sığmayan bir yapıştırma hiç alınmaz. Karakterler `String.length`'in saydığı gibi sayılır, bu yüzden bir emoji iki sayılabilir. Sayaç kutunun altında, yardım metninin karşısında yazar. Kodla verilen metin kesilmez: sınırı aşıyorsa kullanıcı onu yine kısaltabilir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.textfield.PantrixTextField

PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Kurye notu",
    placeholder = "Zil çalışmıyor, kapıyı çalın",
    supportingText = "Kuryeye iletilir",
    maxLength = 120,
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 3),
    tagKey = "note"
)
```

### Yüksekliği verilen alan

Alana verilen yükseklik alanın bütününündür: `Modifier.height(160.dp)`. Etiket üstte, yardım metni ve sayaç altta kalır; kutu ikisinin bıraktığı yüksekliği doldurur ve sığmayan metin kutunun içinde kayar. Alanın hiçbir parçası verilen yüksekliğin dışına taşmaz.

Temizleme düğmesine bas: metin boşalınca da kutu aynı boydadır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.PantrixTextField

PantrixTextField(
    state = rememberTextFieldState(INSTRUCTIONS),
    modifier = Modifier.fillMaxWidth().height(160.dp),
    label = "Teslimat talimatı",
    supportingText = "Alanın yüksekliği sabit: metin kutunun içinde kayar",
    showClearButton = true,
    maxLength = 400,
    lineLimits = TextFieldLineLimits.MultiLine(),
    tagKey = "instructions"
)

private const val INSTRUCTIONS = "Apartmanın sokak kapısı kilitli olur: zile iki kez basın.\n" +
    "Kimse açmazsa bekçi kulübesine bırakın.\n" +
    "Koli ağırsa asansörü kullanın, üçüncü kat.\n" +
    "Kapıda köpek var: havlar ama ısırmaz.\n" +
    "Akşam altıdan sonra evde olurum.\n" +
    "Ulaşamazsanız kapıcıyı arayın."
```

### Giriş ve çıkış dönüşümleri

`inputTransformation` kullanıcının her değişikliğini alana girmeden görür: buradaki, rakam olmayan bir şey içeren değişikliği bütünüyle geri çevirir. `maxLength` ile birlikte önce dönüşüm çalışır, sınır onun geçirdiğine uygulanır.

`outputTransformation` metni değiştirmeden nasıl gösterileceğini söyler: numaranın boşlukları yalnızca çizilir. "5321234567" yaz: kutuda "532 123 45 67" görünür, alttaki satırın okuduğu `phone.text` ise boşluksuzdur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.OutputTransformation
import androidx.compose.foundation.text.input.insert
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val phone = rememberTextFieldState()
PantrixTextField(
    state = phone,
    modifier = Modifier.fillMaxWidth(),
    label = "Cep telefonu",
    placeholder = "5XX XXX XX XX",
    supportingText = "Başında sıfır olmadan, on rakam",
    maxLength = 10,
    showCharacterCount = false,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
    inputTransformation = DigitsOnly,
    outputTransformation = PhoneSpaces,
    tagKey = "phone"
)
PantrixText(text = "Tutulan metin: \"${phone.text}\"", color = PantrixTheme.colors.textSecondary)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}

private val PhoneSpaces = OutputTransformation {
    // Sondan başa: sonra eklenen her boşluk, önce eklenenlerin solunda kalır ve yerlerini kaydırmaz.
    listOf(8, 6, 3).forEach { at -> if (length > at) insert(at, " ") }
}
```

### Sayı alanı ve eylem tuşu

Sayı yazılan ve yazılınca bir şey yapan alan klavyesini `numberKeyboardOptions` ile ister: klavyenin türünü ve eylem tuşunu birlikte verir. Android'de sayı klavyesinin bir eylem tuşu vardır. iPhone'un sayı tuş takımında yoktur: on rakam ve bir silme tuşu. Orada `KeyboardType.Number` ile istenen alana yazılan sayı gönderilemez; `numberKeyboardOptions` onun yerine sayılar ve noktalama klavyesini ister: rakamlarıyla açılır ve eylem tuşu vardır.

Bir adet yaz ve klavyenin eylem tuşuna ya da Enter'a bas: uygulamanın snackbar'ı adedi söyler. iPhone'daki klavyede işaretler ve, bir basış ötede, harfler de vardır: onları alan geri çevirir (`inputTransformation`).

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.InputTransformation
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.platform.numberKeyboardOptions
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val quantity = rememberTextFieldState()
PantrixTextField(
    state = quantity,
    modifier = Modifier.fillMaxWidth(),
    label = "Adet",
    maxLength = 4,
    showCharacterCount = false,
    keyboardOptions = numberKeyboardOptions(ImeAction.Done),
    onKeyboardAction = {
        scope.launch { snackbars?.show(message = "Adet: ${quantity.text}", tagKey = "quantity") }
    },
    inputTransformation = DigitsOnly,
    tagKey = "quantity"
)

private val DigitsOnly = InputTransformation {
    if (!asCharSequence().all(Char::isDigit)) revertAllChanges()
}
```

### Forma bağlı alanlar

`field` alan `PantrixTextField` değerini, hatasını ve adını formdaki alanından alır. `tagKey` verilmez: alanın `id`'si otomasyon anahtarıdır (`TextField_<id>`). Boş bir alanın dışına çıkılırsa kuralın mesajı yardım metninin yerine geçer; hata ilk kez o zaman görünür.

`form` verilen alanda klavyenin eylem tuşu formu gönderir. İlk alanda "İleri" tuşu odağı sonraki alana taşır; ikincide eylem tuşu formu "Kaydet" düğmesi üzerinden gönderir ve hatalı bir alan varsa odak ona gider. İki alanı da boş bırakıp "Kaydet"e bas.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixTextField(
    field = form.field("full_name", initial = "", Rules.notBlank("Adınızı yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "Ad soyad",
    supportingText = "Kartınızda yazdığı gibi",
    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words, imeAction = ImeAction.Next),
    contentType = ContentType.PersonFullName
)
PantrixTextField(
    field = form.field("email", initial = "", Rules.matches(EMAIL, "Geçerli bir e-posta adresi yazın")),
    modifier = Modifier.fillMaxWidth(),
    form = form,
    label = "E-posta",
    placeholder = "ad@ornek.com",
    showClearButton = true,
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
    contentType = ContentType.EmailAddress
)
PantrixButton(
    text = "Kaydet",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Bilgiler kaydedildi", tagKey = "profile_saved") } }
    },
    form = form,
    tagKey = "save_profile"
)

private val EMAIL = Regex("""\S+@\S+\.\S+""")
```

### Devre dışı ve salt okunur

`enabled = false` alanı temanın devre dışı renkleriyle çizer: alan odak almaz, yazılamaz ve ekran okuyucuya devre dışı olduğu söylenir.

`readOnly = true` yalnızca değiştirmeyi kapatır: alan odaklanır, metni seçilir ve kopyalanır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.inputs.textfield.PantrixTextField

PantrixTextField(
    state = rememberTextFieldState("Pantrix A.Ş."),
    modifier = Modifier.fillMaxWidth(),
    enabled = false,
    label = "Devre dışı",
    supportingText = "Kuruluşunuz belirler",
    tagKey = "company"
)
PantrixTextField(
    state = rememberTextFieldState("SIP-2026-0914"),
    modifier = Modifier.fillMaxWidth(),
    readOnly = true,
    label = "Salt okunur",
    supportingText = "Değiştirilemez; seçilip kopyalanabilir",
    tagKey = "order_no"
)
```

### Kendi renkleri

`colors` ile verilen renkler kullanılır, verilmeyenler temadaki rolünde kalır. İlk alanın renkleri sabit yazılmaz, temanın `success` rolünden alınır: koyu temada da yerini bulur. Kutunun dolgusu rolün yumuşak tonudur; yazı ve ikon o tonun üstünde okunan renktedir; kenarlık ve imleç rolün kendi rengidir. Etiket, yardım metni ve hata rengi verilmemiştir: temadaki hâlleriyle kalır.

İkinci alanda yalnızca iki renk verildi, uygulamanın kendi moru: odaktaki kenarlık ve imleç. Alana bas ve bir şey yazıp seç: seçimin tutamaçları ve zemini de imlecin rengini alır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val success = PantrixTheme.colors.success
PantrixTextField(
    state = rememberTextFieldState("PANTRIX10"),
    modifier = Modifier.fillMaxWidth(),
    label = "İndirim kodu",
    supportingText = "Kod geçerli: %10 indirim",
    leadingIcon = {
        PantrixIcon(
            imageVector = PantrixIcons.Check,
            contentDescription = null,
            size = PantrixTheme.style(TextFieldStyle).iconSize
        )
    },
    showClearButton = true,
    colors = TextFieldColors(
        container = success.container,
        border = success.color,
        hoveredBorder = success.color,
        focusedBorder = success.color,
        text = success.onContainer,
        icon = success.onContainer,
        cursor = success.color
    ),
    tagKey = "coupon"
)
val own = ownColors()
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Davet kodu",
    placeholder = "PX-0000",
    colors = TextFieldColors(focusedBorder = own.color, cursor = own.color),
    tagKey = "own_colors"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stili

`style` bu çağrının kendi stilidir: yalnızca verdiği alanlar değişir, gerisi temanın ve platformun stilinden gelir.

İlk alan tam yuvarlak bir kutudur: `TextFieldStyle(shape = ShapeRole.Full)`. İkincisi aynı stili alır ama birkaç satırlıdır: tam yuvarlak bir kutunun eğrisi metnin ilk satırına gireceği için alan `ShapeRole.Large` ile çizilir. Üçüncüsünde `height` kutunun en az yüksekliğini büyütür; tek satır kutunun ortasında durur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.foundation.token.shape.ShapeRole

PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Ürün ara",
    showClearButton = true,
    style = TextFieldStyle(shape = ShapeRole.Full),
    contentDescription = "Ürün ara",
    tagKey = "pill"
)
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Yorum",
    lineLimits = TextFieldLineLimits.MultiLine(minHeightInLines = 2),
    style = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "pill_comment"
)
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Başlık",
    style = TextFieldStyle(height = 56.dp),
    tagKey = "tall"
)
```

### Etkileşimleri dışarıdan izlemek

`interactionSource` alanın etkileşimlerini dışarı taşır: odağını, üstündeki fareyi ve basışlarını. Verilmezse alan kendi kaynağını tutar. Alttaki satır aynı kaynaktan okur: alana bas, sonra fareyi kutunun üstüne getir.

Fareyi kutu bildirir: etiketin ve yardım metninin üstündeki fare sayılmaz.

```kotlin
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.theme.PantrixTheme

val interactions = remember { MutableInteractionSource() }
val focused by interactions.collectIsFocusedAsState()
val hovered by interactions.collectIsHoveredAsState()
PantrixTextField(
    state = rememberTextFieldState(),
    modifier = Modifier.fillMaxWidth(),
    label = "Konu",
    supportingText = "Fare yalnızca kutunun üstündeyken sayılır",
    interactionSource = interactions,
    tagKey = "observed"
)
PantrixText(
    text = "Odakta: ${if (focused) "evet" else "hayır"} · Fare üstünde: ${if (hovered) "evet" else "hayır"}",
    color = PantrixTheme.colors.textSecondary
)
```

## API

### PantrixTextField

`import com.pantrixui.components.inputs.textfield.PantrixTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTextField(
    state: TextFieldState,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    lineLimits: TextFieldLineLimits = TextFieldLineLimits.SingleLine,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    contentType: ContentType? = null,
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Metin alanı: kullanıcının yazdığı tek ya da birkaç satırlık metin. Üstünde bir etiket, altında yardım metni ya da bir hatanın mesajı, iki ucunda ikonlar, onu temizleyen bir düğme ve karakterlerinin sayacıyla birlikte gelir.

Bir değer ve bir geri çağrı üstüne değil, bir `TextFieldState` üstüne kuruludur. Durum metni, seçimi ve klavyenin o an yazmakta olduğunu birlikte tutar, bu yüzden klavyeye hiçbir zaman eskimiş bir metin verilmez: bazı klavyelerde harf kaybettiren ve imleci sıçratan budur. Metnini `String` olarak tutan kod için `value` ve `onValueChange` alan bir overload, bir formun alanı için de ayrı bir overload vardır.

Etiket kutunun üstünde durur ve orada kalır. Hiç yerinden oynamayan bir etiket yer tutucuyu hiç örtmez ve kullanıcı yazarken de okunur. Alanın bütünü tek bir hedeftir: etikete basmak imleci kutuya koyar.

Odağı gösteren kenarlıktır: odak nasıl gelmiş olursa olsun primary rolünün renginde ve daha kalın çizilir. Basışla gelen odak da Tab ile gelen kadar gösterilir. Kutunun çevresine ayrıca bir halka çizilmez: ikinci bir kenarlık gibi görünürdü. Bir modalın altında alan odağı korur, modal kapanınca yeniden onda olsun diye. Bu sırada dinlenirken olduğu gibi ve imleçsiz çizilir: o zamana kadar kullanıcı modaldadır.

Her paragraf okuma yönünü kendi ilk harfinden alır, bu yüzden Arapça bir forma yazılan e-posta adresi `ada@` diye okunur, `@ada` diye değil. Metin düzenin yönüne hizalanır, bu yüzden hangi alfabeyle yazılırsa yazılsın etiketin tarafında kalır.

Parametreler:

- `state: TextFieldState`: Metin ve seçim. `rememberTextFieldState()` ile kurulur ve yazılan ondan okunur: metnin kullanıldığı yerde `state.text`, değiştikçe izlemek için `snapshotFlow { state.text.toString() }`.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin. `fillMaxWidth()` kutuyu üst öğesi kadar geniş yapar. Verilen yükseklik de alanın bütününündür: kutu, etiketin ve yardım metninin bıraktığı yüksekliği doldurur. Tek satır kutunun ortasında durur, birkaç satır üstünden başlar ve kutuya sığmayan metin içinde kayar.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir. Etiket değildir: kullanıcı yazmaya başlar başlamaz kaybolur.
- `supportingText: String?`: Kutunun altındaki yardım metni, daha küçük bir yazıyla. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kenarlık, etiket, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur ve ikincil yazı rengindedir. Yuva içine konanı boyutlandırmaz: `PantrixIcon(size = PantrixTheme.style(TextFieldStyle).iconSize)` platformun boyutundadır.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir. Düğme imleci alanda bırakır. Tab durağı değildir, çünkü her alandan sonra bir durak, bir formu geçmek için gereken basışı ikiye katlar. Ekran okuyucu ona yine de bir düğme olarak ulaşır.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır, bu yüzden bir emoji iki sayılabilir. Sınırı aşacak bir değişiklik bütünüyle geri çevrilir: yazı sınırda durur, sığmayan bir yapıştırma hiç alınmaz. Kodla verilen metin kesilmez ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`: ikincisinde kutu metniyle birlikte uzar ve Enter yeni satır açar. En çok satırını geçince metin kayar ve kutunun sonundaki ince bir çubuk ne kadar kaydığını gösterir. İkonları ve temizleme düğmesi ilk satırının hizasında durur. İkisinde de Tab odağı ilerletir: birkaç satırlı bir alan sekme yazmaz, yoksa klavyeyle alandan ileri çıkılamazdı.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu. Eylemi olan bir sayı alanı `numberKeyboardOptions(imeAction)` alır: iPhone'un sayı tuş takımında eylem tuşu yoktur. Bir eylem veren birkaç satırlı alan Android'de yeni satır tuşunu kaybeder, çünkü klavye onun yerine eylemi gösterir: böyle bir alan eylemi vermez ya da bir `PantrixTextArea`'dır.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca çağrılır: ekran klavyesinde `keyboardOptions`'ın adlandırdığı eylem için gösterilen tuş, fiziksel klavyede ise tek satırlı bir alandaki Enter. Yalnızca adlandırılmış bir eylem için çağrılır, çünkü varsayılan eylem hiçbir işleyiciye ulaşmaz. Null verilirse platformun yaptığı kalır: `Next` odağı ilerletir, `Done` klavyeyi kapatır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem. `maxLength` ile birlikte önce bu çalışır ve sınır onun geçirdiğine uygulanır.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği: bir telefon numarasının boşlukları gibi.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye: `ContentType.EmailAddress` ve benzerleri.
- `style: TextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alan, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: bir arama alanı gibi `label` verilmeyen alanın adıdır. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze kalır: alan boşken adı iki kez söylenmesin diye.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `TextField_<tagKey>`, temizleme düğmesi `TextFieldClear_<tagKey>` diye etiketlenir. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.

### PantrixTextField

`import com.pantrixui.components.inputs.textfield.PantrixTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    singleLine: Boolean = true,
    minLines: Int = 1,
    maxLines: Int = if (singleLine) 1 else Int.MAX_VALUE,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    contentType: ContentType? = null,
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Metni, çağıranın tuttuğu bir `String` olan metin alanı: alan `value`'yu gösterir ve kullanıcının her değişikliğini `onValueChange`'e sorar.

`TextFieldState` üstüne kurulu alan gibi görünür ve ölçülür. Altında ise Foundation'ın bir değer ve bir geri çağrı alan metin alanı vardır, getirdikleriyle birlikte. Geri çağrıya verilen metin bir sonraki kareye kadar `value` olarak geri dönmelidir, yoksa alan eski metni yeniden gösterir ve imleç sıçrar: metin, geri çağrının hemen yazdığı bir durumda tutulur. Metin bir akışta yaşıyorsa ya da ekranın dışında değiştiriliyorsa `TextFieldState` alan overload seçilir. Geri dönen metin sorulandan farklı olabilir. Bu overload böyle süzer: geri çağrının almadığı değişiklik gösterilmez.

Altındaki metin alanının sözcüklerini kullanır: satırları için `singleLine`, `minLines` ve `maxLines`, klavyenin eylem tuşu için `keyboardActions`, metnin nasıl gösterildiği için de `visualTransformation`. Bir şifrenin noktaları da bu gösterimlerden biridir. Giriş dönüşümü almaz: bir değişiklik `onValueChange` içinde geri çevrilir ya da düzeltilir.

Parametreler:

- `value: String`: Alanın gösterdiği metin.
- `onValueChange: (String) -> Unit`: Kullanıcının her değişikliğinde yeni metnin bütünüyle sorulur. Temizleme düğmesi de boş bir metinle sorar.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı. Yazılamayan alan odak almaz, devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı: alan yine odaklanır, metni seçilir ve kopyalanır.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Metnin yanlış olup olmadığı: kenarlık, etiket, yardım metni ve imleç danger rolüne döner ve ekran okuyucuya bildirilir.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur. Yuva içine konanı boyutlandırmaz.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, boş bir metin isteyen bir düğme gösterir. Düğme imleci alanda bırakır ve Tab durağı değildir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı: karakterler `String.length`'in saydığı gibi sayılır. Sınırı aşacak bir değişiklik, `onValueChange`'e sorulmadan önce bütünüyle geri çevrilir. Sınırı aşan bir `value` olduğu gibi gösterilir ve kullanıcı onu yine kısaltabilir. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `singleLine: Boolean`: Alanın tek satır tutup tutmadığı: tek satır yana doğru kayar. Aksi söylenmedikçe tek satır tutar: `TextFieldState` alan overload da böyledir, Foundation'ın kendi metin alanı ise birkaç satırla başlar. `value` içindeki bir satır sonu o zaman, o overload'un gösterdiği gibi, boşluk olarak gösterilir, `value` ise onu korur.
- `minLines: Int`: Birkaç satırlı bir alanda kutunun en az kaç satır boyunda olduğu.
- `maxLines: Int`: Birkaç satırlı bir alanda kutunun, metni kaymadan önce en çok kaç satıra kadar uzadığı.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `keyboardActions: KeyboardActions`: Klavyenin eylem tuşunun, `keyboardOptions`'ın adlandırdığı eylem için ne yaptığı. O eylem için bir şey verilmemişse platform kendi yaptığını yapar: `Next` odağı ilerletir, `Done` klavyeyi kapatır.
- `visualTransformation: VisualTransformation`: Metnin, değiştirilmeden nasıl gösterileceği: `PasswordVisualTransformation()` her karakter için bir nokta çizer.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye: `ContentType.Password` ve benzerleri.
- `style: TextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alan, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır. Aynı şeyi söyleyen bir `placeholder` o zaman yalnızca göze kalır, ekran okuyucuya okunmaz.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `TextField_<tagKey>`, temizleme düğmesi `TextFieldClear_<tagKey>` diye etiketlenir. Alan odağı aldığını ve temizlendiğini bildirir, metnini asla.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.

### PantrixTextField

`import com.pantrixui.components.inputs.textfield.PantrixTextField`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixTextField(
    field: FormField<String>,
    modifier: Modifier = Modifier,
    form: FormState? = null,
    enabled: Boolean = true,
    readOnly: Boolean = false,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    showClearButton: Boolean = false,
    maxLength: Int? = null,
    showCharacterCount: Boolean = true,
    lineLimits: TextFieldLineLimits = TextFieldLineLimits.SingleLine,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    onKeyboardAction: KeyboardActionHandler? = null,
    inputTransformation: InputTransformation? = null,
    outputTransformation: OutputTransformation? = null,
    contentType: ContentType? = null,
    style: TextFieldStyle? = null,
    colors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir formun alanına bağlı metin alanı: metni, hatası ve adı `field`'dan gelir.

Form alanının değeri ile ekrandaki metin iki yönde de birbirini izler: yazmak form alanını değiştirir, form alanında kodla yapılan bir değişiklik de, örneğin bir sıfırlama, ekrandaki metni değiştirir. Odak metin alanından çıkınca form alanı dokunulmuş sayılır ve denetlenir: bir hata ilk kez o zaman görünür. Alan hatadayken hatanın mesajı `supportingText`'in yanında durmaz, onun yerine geçer. Alanın kimliği otomasyon anahtarıdır: `TextField_<id>`. Form, bu alan hatadayken gönderilirse odağı buraya yollayabilir.

Kendi başına bir overload'dur, durum alan overload'un bir parametresi değildir: böylece bir durum ile bir form alanı birlikte verilemez.

Parametreler:

- `field: FormField<String>`: Metin alanının gösterdiği ve değiştirdiği form alanı.
- `modifier: Modifier`: Alanın bütününün modifier'ı.
- `form: FormState?`: Verilirse klavyenin eylem tuşu formu, forma kayıtlı düğme üzerinden gönderir: form denetlenir, sonra ya gönderilir ya da odak formun hatalı ilk alanına yollanır. `Next` ya da `Previous` eylemi odağı her zamanki gibi taşır. Eylem adlandırmayan tek satırlı bir alan `ImeAction.Done` alır, çünkü varsayılan eylem hiçbir işleyiciye ulaşmaz ve Enter hiçbir şey göndermezdi. Birkaç satırlı bir alan olduğu gibi bırakılır: orada Enter yeni satır açar. Çağıranın kendi `onKeyboardAction`'ı gönderimin yerine geçer.
- `enabled: Boolean`: Alana yazılıp yazılamayacağı.
- `readOnly: Boolean`: Metnin salt okunur olup olmadığı.
- `label: String?`: Alanın ne için olduğu. Kutunun üstünde yazar ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Kutu boşken içinde gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `leadingIcon: (@Composable () -> Unit)?`: Metnin önünde durur.
- `trailingIcon: (@Composable () -> Unit)?`: Metnin ve temizleme düğmesinin arkasında durur.
- `showClearButton: Boolean`: Alana yazılabildiği ve alan boş olmadığı sürece, alanı boşaltan bir düğme gösterir.
- `maxLength: Int?`: Kullanıcının girebileceği en çok karakter sayısı. Pozitif olmalıdır.
- `showCharacterCount: Boolean`: `maxLength` verilmişken kutunun altında `count/maxLength` gösterir.
- `lineLimits: TextFieldLineLimits`: Tek satır ya da `TextFieldLineLimits.MultiLine`. İkisinde de Tab odağı ilerletir.
- `keyboardOptions: KeyboardOptions`: Klavyenin türü, büyük harfleri, düzeltmeleri ve eylem tuşu.
- `onKeyboardAction: KeyboardActionHandler?`: Klavyenin eylem tuşuna basılınca, formun gönderimi yerine çağrılır.
- `inputTransformation: InputTransformation?`: Kullanıcı yazarken metne yapılan işlem.
- `outputTransformation: OutputTransformation?`: Metnin, değiştirilmeden nasıl gösterileceği.
- `contentType: ContentType?`: Platforma alanın ne tuttuğunu söyler, alanı o doldurabilsin diye.
- `style: TextFieldStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: TextFieldColors?`: Bu çağrının kendi renkleri, temanın rollerinin yerine: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir alan, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: `label` verilmeyen alan için ekran okuyucunun söylediği.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Null verilirse alan kendi kaynağını tutar.

### TextFieldStyle

`import com.pantrixui.components.inputs.textfield.TextFieldStyle`, `com.pantrixui:components` içinden

```kotlin
class TextFieldStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val focusedBorderWidth: Dp = Dp.Unspecified,
    public val textRole: TypeRole? = null
) : PantrixStyle<TextFieldStyle>
```

`PantrixTextField`'ın kutusu: şekli, en az yüksekliği ve genişliği, metninin çevresindeki boşluk, ikonları ve kenarlığı.

`height` yalnızca kutunun yüksekliğidir. Etiket kutunun içinde değil üstünde durur, bu yüzden tek bir yükseklik hem etiketli hem etiketsiz alana uyar. Bu, en az yüksekliktir: birkaç satırlı bir alan ya da büyük bir yazı ölçeği kutuyu uzatır ve metni asla kesmez. Her preset'in `verticalPadding`'i, her yoğunlukta, yüksekliğinden geriye en az body rolünün bir satırını bırakır. Böylece tek satırlı bir alan tam stilinin söylediği yüksekliktedir.

İkon, kutunun kenarına yaslı, `iconSize + 2 × iconPadding` boyutunda bir yuvada durur. Yuvanın yanındaki metin ondan `horizontalPadding − iconPadding` uzakta başlar. Android'de bu, 44dp'lik bir yuvadır: ikon kenardan 10dp, metin 48dp uzaktadır.

Kutunun köşeleri her platformda şekil ölçeğinin orta adımıdır.

Parametreler:

- `shape: ShapeSpec`: Kutunun şekli. Tam yuvarlak bir şekil, `ShapeRole.Full`, yalnızca alan tek satır tutarken bir haptır: birkaç satırlı bir alan onun yerine `ShapeRole.Large` alır, çünkü bir kapsülün eğrisi metninin ilk satırına girer.
- `height: Dp`: Kutunun en az yüksekliği.
- `minWidth: Dp`: Kutunun en az genişliği: boş bir alanın, kullanıcı içine yazdıkça genişlemesini önler.
- `horizontalPadding: Dp`: İkon olmayan yerde, kutunun kenarı ile metni arasındaki boşluk.
- `verticalPadding: Dp`: Metnin ilk satırının üstündeki ve son satırının altındaki boşluk.
- `iconPadding: Dp`: Yuvasındaki bir ikonun çevresindeki boşluk.
- `iconSize: Dp`: Yuvadaki bir ikonun alması gereken boyut. Yuva, içine konanı boyutlandırmaz.
- `borderWidth: Dp`: Kutunun kenarlığının kalınlığı.
- `focusedBorderWidth: Dp`: Alan odaktayken kenarlığın kalınlığı: odağı gösteren kenarlıktır.
- `textRole: TypeRole?`: Metnin yazıldığı, yer tutucunun da yazıldığı yazı ölçeği rolü: Android'de ve iOS'ta body, 16sp, Material 3'ün ve iOS'un bir alana yazdığı gibi; masaüstünde ve web'de label, 14sp, işaretçiyle kullanılan bir sayfadaki gibi. Bir select'in kutusu ve bu stille kurulan alanlar da onu alır.

### TextFieldColors

`import com.pantrixui.components.inputs.textfield.TextFieldColors`, `com.pantrixui:components` içinden

```kotlin
data class TextFieldColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val hoveredBorder: Color = Color.Unspecified,
    public val focusedBorder: Color = Color.Unspecified,
    public val error: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val label: Color = Color.Unspecified,
    public val placeholder: Color = Color.Unspecified,
    public val supportingText: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val cursor: Color = Color.Unspecified,
    public val scrollBar: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir alan için `PantrixTextField`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temadaki rolünde kalır. Bir ürün yalnızca değiştirdiği renkleri verir, başkasını vermez:

```kotlin
PantrixTextField(
    state = state,
    label = stringResource(Res.string.email),
    colors = TextFieldColors(focusedBorder = brand, cursor = brand)
)
```

Bunlar, salt okunur olsun olmasın, etkin bir alanın renkleridir. Devre dışı bir alan, burada ne verilirse verilsin temanın devre dışı rolleriyle çizilir: devre dışı bir alan ürünün her yerinde aynı görünsün diye.

Parametreler:

- `container: Color`: Kutunun dolgusu. Temanın `surface` rengi.
- `border: Color`: Dinlenirken kutunun kenarlığı. Temanın `border` rengi.
- `hoveredBorder: Color`: Fare üstündeyken kenarlık. Temanın `borderHover` rengi: `border`'dan bir basamak güçlüsü.
- `focusedBorder: Color`: Alan odaktayken kenarlık. Temanın `primary` rengi.
- `error: Color`: Metnin yanlış olduğunu söyleyenler: kenarlık, etiket, kutunun altındaki mesaj, imleç ve sınırını aştığında sayaç. Temanın `danger` rengi.
- `text: Color`: Yazılan metin. Temanın `textPrimary` rengi.
- `label: Color`: Kutunun üstündeki etiket. Verilmezse, alanın durduğu yerde herhangi bir metin nasıl çiziliyorsa öyle çizilir, çünkü etiket kutunun dışında, alan neyin üstüne konmuşsa onun üstündedir: temanın kendi zemininde `textPrimary` ile, bir dolgunun üstünde o dolgunun içerik rengiyle.
- `placeholder: Color`: Yer tutucu. Temanın `textSecondary` rengi.
- `supportingText: Color`: Kutunun altındaki yardım metni ve sayaç. Temanın `textSecondary` rengi.
- `icon: Color`: Yuvadaki bir ikonun, kendi rengini vermedikçe çizildiği renk ve temizleme düğmesinin çarpısı. Temanın `textSecondary` rengi.
- `cursor: Color`: İmleç ve onunla birlikte bir seçimin tutamaçları ile zemini. Temanın `primary` rengi.
- `scrollBar: Color`: Birkaç satırlı bir kutunun metninin ne kadar kaydığını gösteren çubuk. Temanın `borderStrong`'u: metnin yanında bir işarettir ve kutunun yumuşak kenarı orada görünmezdi.

### numberKeyboardOptions

`import com.pantrixui.foundation.platform.numberKeyboardOptions`, `com.pantrixui:foundation` içinden

```kotlin
fun numberKeyboardOptions(
    imeAction: ImeAction = ImeAction.Default,
    decimal: Boolean = false
): KeyboardOptions
```

Sayı yazılan bir alanın klavyesi; `imeAction` klavyenin bir tuşundadır.

Sayı alanı `KeyboardType.Number` ister; sayı yazılınca yapacak bir şeyi varsa, bir sayfayı açmak ya da sonraki alana geçmek gibi, yanında bir `ImeAction` da ister. Android'de sayı klavyesinin eylem için bir tuşu vardır, tuşlu bir klavyede de Enter. iPhone'un sayı tuş takımında ikisi de yoktur: on rakam ve bir silme tuşu. Eylemin orada tuşu yoktur ve yazılan hiçbir zaman gönderilemez (simülatörde görüldü, Compose Multiplatform 1.12.1).

Bu yüzden iOS'ta eylemi olan bir sayı, sayılar ve noktalama klavyesinde yazılır: rakamlarıyla açılır ve eylemi gösteren bir return tuşu vardır. O klavye yazı yazmak içindir: düzeltme kapalı olarak istenir, bu da tuşlarının üstünde önerdiği sözcük çubuğunu kaldırır. İşaretleri ve, bir basış ötede, harfleri de yazılabilir; sayı olmayanı alanın kendisi dışarıda tutar, bir `InputTransformation` ile olduğu gibi. Eylemi olmayan bir sayının (`ImeAction.Default`, `ImeAction.None`) sayı tuş takımında bir eksiği yoktur ve iOS'ta da onu alır.

Başka her yerde seçenekler istenen tür ve istenen eylemdir, fazlası değil.

Bütünü docs/guide/number-keyboard/NUMBER_KEYBOARD_GUIDE.md'dedir; bu kütüphaneyi kullanmayan bir proje için aynısı da orada.

Parametreler:

- `imeAction: ImeAction`: Klavyenin eylem tuşunun yaptığı ve gösterdiği: `ImeAction.Go`, `ImeAction.Next`, `ImeAction.Done`.
- `decimal: Boolean`: Sayının kesirli olup olmadığı: `KeyboardType.Number` yerine `KeyboardType.Decimal`, bu da sayı tuş takımına bir ondalık ayırıcı koyar.

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

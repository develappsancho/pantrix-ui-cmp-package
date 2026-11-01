# Switch Button

Açık ya da kapalı olan ve hemen uygulanan bir ayar: bir iz, üstünde kayan bir başparmak ve yanındaki etiket. Bildirimler, Wi-Fi, pil tasarrufu gibi. Yanlış olabilen bir cevap için onay kutusu kullanılır: anahtar bir ayardır.

Anahtar kendiliğinden bir şey değiştirmez: `checked` ne diyorsa odur. Basış, tuş ve sürükleme, istenen değeri `onCheckedChange` ile bildirir; durumu çağıran tutar.

- `PantrixSwitchButton` (`com.pantrixui.components.elements.switchbutton`, `com.pantrixui:components`): Hemen etki eden açık ya da kapalı bir ayar: etiketi, yardım metni ve sürüklenebilen bir topuzu olur; denetimli ya da bir formun alanına bağlı. Anahtar sözcükler: anahtar, aç kapa, açık kapalı, ayar, tercih.

## Özellikler

- **Tek hedef.** İz, etiket ve yardım metni tek bir hedeftir: yazıya basmak da anahtarı çevirir. İz ne kadar küçük olursa olsun satır, platformun dokunma hedefi kadar yer tutar.
- **Sürüklenen başparmak.** Başparmak izin ortasını geçip bırakılırsa anahtar açılır, geçmeden bırakılırsa kapanır; başladığı yanda bırakılırsa yerine kayar ve hiçbir şey bildirilmez. Sürükleme okuma yönüyle gider: sağdan sola düzende açık uç soldadır.
- **Platform.** Android'de başparmak kapalıdan açığa büyür, tutulurken daha da büyür. iOS'ta, masaüstünde ve web'de tek boydadır; iOS'ta her zaman beyazdır, altında bir gölge vardır ve izin kenarı yoktur.
- **Ekran okuyucu.** Tek bir anahtar okunur: adı etiketidir, açık mı kapalı mı olduğu temanın diliyle söylenir. Etiketi olmayan anahtarın adını `contentDescription` verir.
- **Hata.** `error` yalnızca yardım metnini temanın `danger` rolüne çevirir ve ekran okuyucuya söylenir. Anahtarın kendisi renklerini korur.
- **Form.** `field` alan `PantrixSwitchButton` değerini, hatasını ve adını formun alanından alır. Kuralın mesajı ilk değişiklikten sonra ya da form gönderilmek istendiğinde görünür ve yardım metninin yerine geçer.
- **Salt okunur ve devre dışı.** `onCheckedChange` null ise anahtar salt okunurdur: basış, sürükleme ve odak almaz, adını ve durumunu yine söyler. `enabled = false` anahtarı devre dışı renklerle çizer.
- **Kendi renkleri.** `SwitchColors` açık ve kapalı izin, açık ve kapalı başparmağın ve kenarın rengini ayrı ayrı alır; verilmeyen temanın rolünde kalır. Devre dışı anahtar, renk verilse de temanın renkleriyle çizilir.
- **Stil.** `SwitchStyle` izin enini ve boyunu, başparmağın kapalı, açık ve basılı hâldeki boyunu, kenarın kalınlığını ve başparmağın gölgesini verir. Etiketin yazısını `labelStyle` verir; iz o yazının ilk satırında durur.
- **Anahtar sonda.** `controlPosition = ControlPosition.End` izi etiketin sonuna koyar, bir ayarlar ekranındaki gibi: satıra bir genişlik verilince iz onun sonunda durur ve etiket kalan yerde sarar.
- **Hareket.** Başparmak kayar ve iz onunla birlikte `primary` rengine döner. Hareketin azaltıldığı temada ikisi de bir anda olur.

## Kullanım

### Controlled

```kotlin
var notifications by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = notifications,
    onCheckedChange = { notifications = it },
    label = stringResource(Res.string.notifications),
    supportingText = stringResource(Res.string.notifications_help),
    tagKey = "notifications"
)
```

### Bound to a form's field

```kotlin
val form = rememberFormState()
val marketing = form.field("marketing", initial = false)
PantrixSwitchButton(field = marketing, label = stringResource(Res.string.marketing_emails))
```

### Without a label, at the end of a row that has the words

```kotlin
Row(verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = stringResource(Res.string.wifi), modifier = Modifier.weight(1f))
    PantrixSwitchButton(
        checked = wifi,
        onCheckedChange = onWifiChange,
        contentDescription = stringResource(Res.string.wifi),
        tagKey = "wifi"
    )
}
```

### In colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixSwitchButton(
    checked = batterySaver,
    onCheckedChange = { batterySaver = it },
    label = stringResource(Res.string.battery_saver),
    colors = SwitchColors(checkedTrack = success.color, checkedThumb = success.onColor),
    tagKey = "battery_saver"
)
```

## Örnekler

### Etiket ve yardım metni

En yalın hâli: `checked` durumu okur, `onCheckedChange` istenen değeri bildirir. İz, etiket ve yardım metni tek bir hedeftir: yazıya basmak da anahtarı çevirir.

Başparmağı sürükle: izin ortasını geçip bırakılırsa anahtar döner. Ortayı geçmeden bırakılırsa yerine kayar ve hiçbir şey bildirilmez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var notifications by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = notifications,
    onCheckedChange = { notifications = it },
    label = "Bildirimler",
    supportingText = "Sipariş güncellemeleri ve hatırlatmalar",
    tagKey = "notifications"
)
```

### Etiketsiz: uygulamanın kendi satırında

Sözcükleri başta, anahtarı sonda olan bir satır uygulamanın kendi satırıdır: yazı ayrı bir `PantrixText`'tir, anahtar etiketsizdir. Anahtarın adını ekran okuyucuya `contentDescription` söyler.

Bu düzende yazı hedefin parçası değildir: basılan yer anahtar ve çevresinde ayrılan dokunma hedefidir.

```kotlin
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText

var wifi by rememberSaveable { mutableStateOf(false) }
Row(modifier = Modifier.widthIn(max = 360.dp), verticalAlignment = Alignment.CenterVertically) {
    PantrixText(text = "Wi-Fi", modifier = Modifier.weight(1f))
    PantrixSwitchButton(
        checked = wifi,
        onCheckedChange = { wifi = it },
        contentDescription = "Wi-Fi",
        tagKey = "wifi"
    )
}
```

### Hata

`error` yardım metnini temanın `danger` rolüne çevirir ve ekran okuyucuya girdinin geçersiz olduğu söylenir. Anahtarın kendisi renklerini korur: anahtar bir ayardır, yanlış olabilen bir cevap onay kutusunun işidir.

Burada hatayı örnek kendisi hesaplar: anahtar kapalıyken `error` true'dur. Anahtarı aç: metin eski rengine döner.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var location by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = location,
    onCheckedChange = { location = it },
    label = "Konum",
    supportingText = if (location) "Yakınınızdaki mağazalar gösterilir" else "Konum kapalıyken mağaza aranamaz",
    error = !location,
    tagKey = "location"
)
```

### Bir forma bağlı ayar

`field` alan `PantrixSwitchButton` bir formun alanına bağlıdır: değerini, hatasını ve adını alandan alır; `checked` ve `onCheckedChange` verilmez. Alanın kimliği otomasyon anahtarıdır: test etiketi `SwitchButton_two_step` olur.

İki adımlı giriş kapalıyken "Kaydet"e bas: `Rules.mustBeTrue` kuralının mesajı yardım metninin yerine geçer ve odak anahtara gider. Anahtarı açıp yeniden dene: uygulamanın snackbar'ı ayarların kaydedildiğini söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixSwitchButton(
    field = form.field("two_step", initial = false, Rules.mustBeTrue("Kuruluşunuz bunu şart koşuyor")),
    label = "İki adımlı giriş",
    supportingText = "Her girişte kısa mesajla bir kod gelir"
)
PantrixButton(
    text = "Kaydet",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Ayarlar kaydedildi", tagKey = "saved") } }
    },
    form = form,
    tagKey = "save_settings"
)
```

### Devre dışı ve salt okunur

`enabled = false` anahtarı devre dışı renklerle çizer: basış ve sürükleme almaz, ekran okuyucuya devre dışı olduğu söylenir. Açık mı kapalı mı olduğunu başparmağın yeri yine gösterir.

`onCheckedChange = null` ise anahtar salt okunurdur: basış, sürükleme ve odak almaz, renkleri değişmez, adını ve durumunu yine söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

PantrixSwitchButton(checked = true, onCheckedChange = {}, enabled = false, label = "Devre dışı", tagKey = "off")
PantrixSwitchButton(
    checked = true,
    onCheckedChange = null,
    label = "Salt okunur",
    supportingText = "Çevrilmez; yalnızca durumunu gösterir",
    tagKey = "read_only"
)
```

### Kendi renkleri

`colors` yalnızca verilen alanları değiştirir: burada açık izin ve açık başparmağın rengi verildi. Anahtarı kapat: iz, başparmak ve kenar temanın renklerindedir. Arada, başparmak kaydıkça iz ve başparmak bir renkten ötekine döner.

Uygulamanın moru temanın hiçbir rolünde yok; böyle bir izin üstündeki başparmağın rengini de çağıran verir. Devre dışı bir anahtar, renk verilse de temanın renkleriyle çizilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.switchbutton.SwitchColors

val own = ownColors()
var batterySaver by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = batterySaver,
    onCheckedChange = { batterySaver = it },
    label = "Pil tasarrufu",
    supportingText = "Açıkken izin ve başparmağın rengi dışarıdan verildi; kapalıyken temanınkiler",
    colors = SwitchColors(checkedTrack = own.color, checkedThumb = own.onColor),
    tagKey = "battery_saver"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Stil

`style` tek bir anahtarın geometrisini değiştirir. Yalnızca verilen alanlar değişir; gerisi temanın ve platformun stilinden gelir.

İlk anahtara iOS stilinin üç alanı verildi ve her platformda öyle çizilir: başparmak hep beyazdır (`thumbAlwaysLight`), altında bir gölge vardır (`thumbShadow`) ve kapalı izin kenarı yoktur (`strokeWidth = 0.dp`). İkincisi daha büyük bir izdir: izin eni ve boyu ile başparmağın üç hâldeki boyu birlikte verildi. Etiketi de `labelStyle` ile temanın `callout`'uyla, kalın yazıldı; iz o yazının ilk satırında durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.switchbutton.SwitchStyle
import com.pantrixui.foundation.theme.PantrixTheme

var lightThumb by rememberSaveable { mutableStateOf(true) }
var largeTrack by rememberSaveable { mutableStateOf(false) }
PantrixSwitchButton(
    checked = lightThumb,
    onCheckedChange = { lightThumb = it },
    label = "Beyaz başparmak, gölgeli ve kenarsız",
    style = SwitchStyle(strokeWidth = 0.dp, thumbAlwaysLight = true, thumbShadow = 2.dp),
    tagKey = "light_thumb"
)
PantrixSwitchButton(
    checked = largeTrack,
    onCheckedChange = { largeTrack = it },
    label = "Büyük iz",
    style = SwitchStyle(
        trackWidth = 64.dp,
        trackHeight = 36.dp,
        thumbSizeOff = 28.dp,
        thumbSizeOn = 28.dp,
        thumbSizePressed = 28.dp
    ),
    tagKey = "large_track",
    labelStyle = PantrixTheme.typography.callout.copy(fontWeight = FontWeight.Bold)
)
```

### Anahtar sonda

Bir ayarlar ekranı: iz etiketin sonunda (`controlPosition = ControlPosition.End`). Satırlar sütunun genişliğini alır (`Modifier.fillMaxWidth()`), izler alt alta, sütunun sonunda durur; uzun bir etiket kalan yerde sarar.

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
import com.pantrixui.components.elements.selection.ControlPosition
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var wifi by rememberSaveable { mutableStateOf(true) }
var saver by rememberSaveable { mutableStateOf(false) }
Column(Modifier.widthIn(max = 360.dp)) {
    PantrixSwitchButton(
        checked = wifi,
        onCheckedChange = { wifi = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Wi-Fi",
        tagKey = "wifi_end",
        controlPosition = ControlPosition.End
    )
    PantrixSwitchButton(
        checked = saver,
        onCheckedChange = { saver = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Pil tasarrufu",
        supportingText = "Arka plandaki yenilemeleri ve bazı görsel etkileri kısar",
        tagKey = "saver_end",
        controlPosition = ControlPosition.End
    )
}
```

## API

### PantrixSwitchButton

`import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSwitchButton(
    checked: Boolean,
    onCheckedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: SwitchStyle? = null,
    colors: SwitchColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    labelStyle: TextStyle = PantrixTheme.typography.label,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Bir anahtar: açık ya da kapalı olan ve hemen uygulanan bir ayar ile neyin anahtarı olduğunu söyleyen etiketi.

İz, etiket ve yardım metni tek bir hedeftir. Üstlerinde herhangi bir yere basmak anahtarı çevirir, çünkü telefonda parmağın basabileceği yerin çoğu yazıdır. Ekran okuyucu da tek bir anahtar okur: adı etiketidir ve açık olup olmadığını söyler. Etiket ile yardım metni kaç satır tutarsa tutsun, iz etiketin ilk satırının hizasında durur. İz ne kadar küçük olursa olsun satır, platformun dokunma hedefi kadar yer tutar.

Başparmak sürüklenebilir de. İzin ortasını geçip bırakılırsa anahtarı açar, ortaya varmadan bırakılırsa kapatır: başladığı yanda bırakılan başparmak yerine geri kayar ve hiçbir şey bildirilmez. Sürükleme okuma yönüyle gider: sağdan sola düzende açık uç soldaki uçtur, yani bir basışın başparmağı gönderdiği uç. Basış, tuş ve sürükleme anahtarı aynı yoldan değiştirir: tek bir dokunsal geri bildirim ve tek bir olayla.

Başparmak kayar. İz de onunla birlikte, başparmak nerede olursa olsun, primary rolünün rengine döner: onu sürükleyen bir parmağın altındayken de. Azaltılmış harekette ikisi de bir anda olur.

`onCheckedChange` olmadan anahtar salt okunurdur: basış, sürükleme ve odak almaz, adını ve durumunu yine söyler. `error` yardım metnini danger rolüne çevirir ve duyurulur. Anahtarın kendisi renklerini korur: anahtar bir ayardır, yanlış olabilen bir cevap ise onay kutusunun işidir.

Parametreler:

- `checked: Boolean`: Anahtarın açık olup olmadığı.
- `onCheckedChange: ((Boolean) -> Unit)?`: Kullanıcının istediği değerle, yani `checked`'in tersiyle çağrılır. Anahtar kendiliğinden bir şey değiştirmez: `checked` ne diyorsa odur. Null verilirse anahtar salt okunurdur.
- `modifier: Modifier`: Satırın modifier'ı.
- `enabled: Boolean`: Anahtarın çevrilip çevrilemeyeceği. Çevrilemeyen anahtar devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `label: String?`: İzin yanındaki metin: hedefin parçasıdır ve ekran okuyucu için anahtarın adıdır.
- `supportingText: String?`: Etiketin altında, daha küçük bir yazıyla duran yardım. `error` true iken mesajın kendisidir.
- `error: Boolean`: Değerin yanlış olup olmadığı: yardım metni danger rolüne döner ve ekran okuyucuya girdinin geçersiz olduğu söylenir.
- `style: SwitchStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: SwitchColors?`: Bu anahtarın kendi renkleri: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir anahtar temanın renklerini korur.
- `contentDescription: String?`: Ekran okuyucunun anahtar için söylediği. `label` verilmeyen anahtarın adıdır: sözcükleri başka bir yerinde duran, uygulamanın kendi satırında olduğu gibi. Etiket varsa onun yerine söylenir.
- `tagKey: String?`: Anahtarın otomasyon anahtarı: satır `SwitchButton_<tagKey>` diye etiketlenir. Bir değişiklik, yeni değeri taşıyan bir `SwitchButton` olayı olarak bildirilir. Olay, anahtarın etiket metnini asla taşımaz.
- `interactionSource: MutableInteractionSource?`: Anahtarın dışarı taşınan etkileşimleri: basışları, sürüklemeleri ve odağı. Null verilirse anahtar kendi kaynağını tutar.
- `labelStyle: TextStyle`: etiketin yazı stili: verilmezse temanın `label` stili. İz, her boyda onun ilk satırında durur. İçindeki bir renk, anahtar etkinken etiketin rengidir; devre dışı bir anahtar etiketi devre dışı renkle yazar.
- `controlPosition: ControlPosition`: izin durduğu yer: etiketin önü ya da bir ayarlar ekranındaki gibi arkası. Arkasındaysa iz satıra verilen genişliğin sonunda durur, `Modifier.fillMaxWidth()` onu ötekilerle hizalar; satıra genişlik verilmemişse etiketin hemen ardındadır. Etiket izin bıraktığı yerde sarar.

### PantrixSwitchButton

`import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSwitchButton(
    field: FormField<Boolean>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    style: SwitchStyle? = null,
    colors: SwitchColors? = null,
    contentDescription: String? = null,
    labelStyle: TextStyle = PantrixTheme.typography.label,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Bir formun alanına bağlı anahtar: değeri, hatası ve adı `field`'dan gelir.

Bir değişiklik alanın değerini kurar ve alanı dokunulmuş olarak işaretler. Böylece bir kuralın mesajı ilk değişiklikten sonra ya da form gönderildiğinde görünür, kimsenin dokunmadığı bir formda görünmez. Alan hatadayken mesaj `supportingText`'in yanında durmaz, onun yerine geçer. Alanın kimliği anahtarın otomasyon anahtarıdır: `SwitchButton_<id>`. Form bu alan hatadayken gönderilirse odağı buraya gönderebilir.

Kontrollü biçimin bir parametresi değil, ayrı bir overload'dur: böylece bir değer ile bir alan birlikte verilemez.

Parametreler:

- `field: FormField<Boolean>`: Anahtarın gösterdiği ve değiştirdiği alan.
- `modifier: Modifier`: Satırın modifier'ı.
- `enabled: Boolean`: Anahtarın çevrilip çevrilemeyeceği.
- `label: String?`: İzin yanındaki metin: hedefin parçasıdır ve ekran okuyucu için anahtarın adıdır.
- `supportingText: String?`: Alanın orada gösterecek bir hatası yokken etiketin altında duran yardım.
- `style: SwitchStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: SwitchColors?`: Bu anahtarın kendi renkleri: verilenler kullanılır, gerisi temanın renklerinde kalır. Devre dışı bir anahtar temanın renklerini korur.
- `contentDescription: String?`: `label` verilmeyen anahtar için, ya da etiketin yerine, ekran okuyucunun söylediği.
- `labelStyle: TextStyle`: etiketin yazı stili: verilmezse temanın `label` stili.
- `controlPosition: ControlPosition`: izin durduğu yer: etiketin önü ya da bir ayarlar ekranındaki gibi arkası. Arkasındaysa iz satıra verilen genişliğin sonunda durur, `Modifier.fillMaxWidth()` onu ötekilerle hizalar; satıra genişlik verilmemişse etiketin hemen ardındadır. Etiket izin bıraktığı yerde sarar.

### SwitchStyle

`import com.pantrixui.components.elements.switchbutton.SwitchStyle`, `com.pantrixui:components` içinden

```kotlin
class SwitchStyle(
    public val trackWidth: Dp = Dp.Unspecified,
    public val trackHeight: Dp = Dp.Unspecified,
    public val thumbSizeOff: Dp = Dp.Unspecified,
    public val thumbSizeOn: Dp = Dp.Unspecified,
    public val thumbSizePressed: Dp = Dp.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified,
    public val thumbAlwaysLight: Boolean? = null,
    public val thumbShadow: Dp = Dp.Unspecified
) : PantrixStyle<SwitchStyle>
```

`PantrixSwitchButton`'ın izi ve başparmağı: her birinin ne kadar büyük olduğu, izin kenarı ve başparmağın görünüşü.

Başparmağın üç boyutu vardır. Material 3'te başparmak kapalıdan açığa büyür, tutulurken daha da büyür: bu değişim anahtarın kendi hareketidir, bu yüzden Android'in preset'inde üç boyut vardır. iOS'un anahtarı başparmağının boyutunu hiç değiştirmez, imlecin altında boyut değiştiren bir başparmak da gürültüdür. Bu yüzden iOS'ta, masaüstünde ve web'de üçü tek bir boyuttur. Bileşen hangi platformda olduğunu hiç sormaz.

Başparmak her boyutta izin yuvarlak ucunun ortasında durur: uca uzaklığı, yanlara uzaklığı kadardır. Çevresindeki boşluk izin boyunun bıraktığıdır, kendine ait bir değeri yoktur.

`strokeWidth` kapalı bir izin kenarıdır. Bu kenar, kenar rengindedir: o renk kontrolün yerini, durduğu zemine karşı 3:1 ile belli eder. Material 3 böyle bir kenar çizer, Windows da çizer: Android'in preset'inde Material'ın kenarı, masaüstünün ve web'in preset'lerinde ise daha ince bir kenar vardır, çünkü onların izi daha küçüktür. iOS kenar çizmez: soluk bir iz ile beyaz bir başparmak ve gölgesini bırakır. Pantrix bunu iOS'ta korur.

Bunların hiçbiri yoğunluğu izlemez: iz, başparmağı ve kenarı hava değildir. İz ile etiketi arasındaki boşluk ise izler, çünkü temanın boşluklarından gelir. Anahtarın renkleri stilinin parçası değildir: durumundan, kendi renkleri olan anahtarda da `SwitchColors`'tan gelir.

Parametreler:

- `trackWidth: Dp`: İzin eni, kenarı dahil.
- `trackHeight: Dp`: İzin boyu, kenarı dahil. İzin uçları boyu kadar yuvarlaktır.
- `thumbSizeOff: Dp`: Anahtar kapalıyken başparmağın eni ve boyu.
- `thumbSizeOn: Dp`: Anahtar açıkken başparmağın eni ve boyu.
- `thumbSizePressed: Dp`: Basılıyken ya da sürüklenirken başparmağın eni ve boyu.
- `strokeWidth: Dp`: Kapalı bir izin kenarının kalınlığı. Sıfır verilirse kenar çizilmez.
- `thumbAlwaysLight: Boolean?`: True, iOS'taki gibi, tema ve durum ne olursa olsun başparmağı beyaz tutar. False, Material'daki gibi, başparmağı kapalıyken kenar renginde, açıkken izin dolgusuyla eşlenen renkte çizer. Null belirtilmemiş demektir.
- `thumbShadow: Dp`: Başparmağın izden ne kadar yüksekte durduğu: altındaki gölgenin boyutu. Sıfır verilirse gölge çizilmez.

### SwitchColors

`import com.pantrixui.components.elements.switchbutton.SwitchColors`, `com.pantrixui:components` içinden

```kotlin
data class SwitchColors(
    public val checkedTrack: Color = Color.Unspecified,
    public val checkedThumb: Color = Color.Unspecified,
    public val uncheckedTrack: Color = Color.Unspecified,
    public val uncheckedThumb: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir anahtarda `PantrixSwitchButton`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temanın rolünde kalır.

```kotlin
PantrixSwitchButton(
    checked = notifications,
    onCheckedChange = { notifications = it },
    label = stringResource(Res.string.notifications),
    colors = SwitchColors(checkedTrack = brand)
)
```

Bunlar çevrilebilen bir anahtarın renkleridir. Devre dışı bir anahtar, burada ne verilirse verilsin temanın devre dışı rolleriyle çizilir. Kapalı ile açık arasında, başparmak ilerledikçe iz ve başparmak bir renkten ötekine döner.

Burada verilen iz rengi temanın kendi renklerinden biriyse, temanın o renkle eşlediği başparmak rengini de getirir. Başparmak rengi de verilmişse ya da stil başparmağı açık renkli tutuyorsa getirmez. Hiçbir rolde olmayan bir iz rengi de getirmez: o izin üstündeki başparmağın rengini çağıran verir.

Parametreler:

- `checkedTrack: Color`: Anahtar açıkken izin dolgusu. Verilmezse temanın `primary` rengidir.
- `checkedThumb: Color`: Anahtar açıkken başparmak: `checkedTrack` üstünde belirgin duran renk. Verilmezse primary rolünün `onColor`'ıdır, stil başparmağı açık renkli tutuyorsa beyazdır.
- `uncheckedTrack: Color`: Anahtar kapalıyken izin dolgusu. Verilmezse temanın `borderStrong` renginin soluk bir tonudur.
- `uncheckedThumb: Color`: Anahtar kapalıyken başparmak: `uncheckedTrack` üstünde belirgin duran renk. Verilmezse temanın `borderStrong` rengidir, stil başparmağı açık renkli tutuyorsa beyazdır.
- `border: Color`: Stil bir kenar çiziyorsa, kapalı bir izin kenarı. Verilmezse temanın `borderStrong` rengidir: kapalı bir anahtar, kenarı ve başparmağıyla görülür.

### ControlPosition

`import com.pantrixui.components.elements.selection.ControlPosition`, `com.pantrixui:components` içinden

```kotlin
enum class ControlPosition
```

Bir onay kutusunun kutusunun, bir radyo düğmesinin halkasının ya da bir anahtarın izinin etiketine göre durduğu yer: bir seçenek listesindeki gibi önünde ya da bir ayarlar ekranındaki anahtar gibi arkasında, satırın sonunda.

Değerleri:

- `Start`: Etiketin önünde, satırın başında: solda, düzenin sağdan okunduğu yerde sağda.
- `End`: Etiketin arkasında: satıra verilen genişliğin sonunda, ya da genişlik verilmemişse etiketin hemen ardında. Etiket ve yardım metni denetimin bıraktığı yerde sarar ve onu hiç itmez.

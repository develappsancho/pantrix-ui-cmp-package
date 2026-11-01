# Radio Button

Birkaç seçenekten biri: bir halka ve yanındaki etiket. Neredeyse her zaman `PantrixRadioGroup` ile kullanılır: grup seçenekleri dizer, ok tuşlarıyla seçimi taşır ve bir formun alanına bağlanır. `PantrixRadioButton` tek başına, grubun kuramayacağı bir düzen içindir: her seçeneğin bir kart olduğu bir liste gibi.

Grup kendiliğinden bir şey seçmez: `selected` hangi değeri söylüyorsa o seçilidir. Basış ve ok tuşları, istenen seçeneğin değerini `onSelect` ile bildirir; seçimi çağıran tutar.

- `PantrixRadioButton` (`com.pantrixui.components.elements.radiobutton`, `com.pantrixui:components`): Tek seçimli bir seçimin bir seçeneği, etiketi, yardım metni ve hata hâliyle; PantrixRadioGroup birkaçını dizer ve seçimi ok tuşlarıyla taşır. Anahtar sözcükler: radyo düğmesi, seçenek, tek seçim, seçim.
- `PantrixRadioGroup` (`com.pantrixui.components.elements.radiobutton`, `com.pantrixui:components`): Birkaç seçenek arasından tek bir seçim, alt alta ya da yan yana; denetimli ya da bir formun alanına bağlı; ok tuşları seçimi taşır. Anahtar sözcükler: radyo grubu, tek seçim, seçenek grubu, seçenek listesi, seçim.

## Özellikler

- **Seçenekler.** Bir seçenek bir `RadioOption`'dır: değeri, etiketi, etiketin altında ne olduğunu söyleyen metni, seçilebilir olup olmadığı ve otomasyon anahtarı.
- **Alt alta ya da yan yana.** `orientation` seçenekleri alt alta (`Orientation.Vertical`, varsayılan) ya da yan yana dizer (`Orientation.Horizontal`): satıra sığdığı kadarı yan yana durur, kalanı alt satıra geçer.
- **Klavye.** Grup Tab için tek duraktır: odak seçili seçeneğe, hiçbiri seçili değilken seçilebilen ilk seçeneğe gelir. Ok tuşları sonraki ve önceki seçeneği seçer, sondan başa döner ve seçilemeyeni atlar; sağdan sola düzende sol ve sağ yer değiştirir.
- **Tek hedef.** Halka, etiket ve altındaki metin tek bir hedeftir: yazıya basmak da seçer. Halka ne kadar küçük olursa olsun satır, platformun dokunma hedefi kadar yer tutar.
- **Hata.** `error` halkaları ve grubun altındaki metni temanın `danger` rolüne çevirir; hatayı ekran okuyucuya grup, bir kez söyler.
- **Form.** `field` alan `PantrixRadioGroup` seçimini, hatasını ve adını formun alanından alır. Yapılması zorunlu bir seçim, null ile başlayan bir alan ve `Rules.required` ile kurulur.
- **Devre dışı ve salt okunur.** `RadioOption(enabled = false)` tek bir seçeneği, grubun `enabled = false`'u hepsini kapatır. `onClick`'i null olan `PantrixRadioButton` salt okunurdur: basış ve odak almaz, seçili olduğunu söyler.
- **Kendi renkleri ve stil.** `RadioColors` seçili ve seçili olmayan halkanın rengini, `RadioStyle` halkanın ve içindeki noktanın boyunu ve çizgi kalınlığını verir. Halka 20dp, noktası 10dp'dir; iOS'ta 22dp ve 12dp.
- **Halka sonda.** `controlPosition = ControlPosition.End` halkayı etiketin sonuna koyar; alt alta bir grupta seçenekler grubun genişliğini alır ve halkalar bir sütunda durur.
- **Ekran okuyucu.** Her seçenek, seçili olup olmadığını söyleyen bir radyo düğmesidir; grubun adı `label`'dır. Tek başına kullanılan düğmeler `Modifier.selectableGroup()` içine alınır ki tek bir seçim olarak duyulsun.
- **Hareket.** Seçilen halkanın noktası büyür ve halka onunla birlikte `primary` rengine döner. Hareketin azaltıldığı temada ikisi de bir anda olur.

## Kullanım

### Options in a layout of the app's own

```kotlin
Row(Modifier.selectableGroup()) {
    PantrixRadioButton(
        selected = sort == Sort.Newest,
        onClick = { sort = Sort.Newest },
        label = stringResource(Res.string.newest_first),
        tagKey = "newest"
    )
    PantrixRadioButton(
        selected = sort == Sort.Oldest,
        onClick = { sort = Sort.Oldest },
        label = stringResource(Res.string.oldest_first),
        tagKey = "oldest"
    )
}
```

### Read-only, to show what was chosen

```kotlin
PantrixRadioButton(selected = true, onClick = null, label = plan.name, supportingText = plan.price)
```

### Without a label, in a card that is the option

```kotlin
PantrixRadioButton(
    selected = address.id == chosen,
    onClick = { onChoose(address.id) },
    contentDescription = stringResource(Res.string.deliver_to, address.name),
    tagKey = "address_" + address.id
)
```

### Controlled, with what each option means under its label

```kotlin
var delivery by rememberSaveable { mutableStateOf("standard") }
PantrixRadioGroup(
    options = listOf(
        RadioOption(
            value = "standard",
            label = stringResource(Res.string.standard),
            supportingText = stringResource(Res.string.standard_takes),
            tagKey = "standard"
        ),
        RadioOption(
            value = "express",
            label = stringResource(Res.string.express),
            supportingText = stringResource(Res.string.express_takes),
            tagKey = "express"
        )
    ),
    selected = delivery,
    onSelect = { delivery = it },
    label = stringResource(Res.string.delivery),
    tagKey = "delivery"
)
```

### A choice that has to be made, bound to a form's field and laid out side by side

```kotlin
val form = rememberFormState()
val size = form.field<String?>("size", initial = null, Rules.required(stringResource(Res.string.size_required)))
PantrixRadioGroup(
    field = size,
    options = sizes.map { RadioOption(value = it.id, label = it.name, tagKey = it.id) },
    orientation = Orientation.Horizontal,
    label = stringResource(Res.string.size)
)
```

### In colours of its own

```kotlin
PantrixRadioGroup(
    options = plans.map { RadioOption(value = it.id, label = it.name, tagKey = it.id) },
    selected = plan,
    onSelect = { plan = it },
    colors = RadioColors(selected = PantrixTheme.colors.success.color),
    tagKey = "plan"
)
```

## Örnekler

### Bir grup ve seçenekleri

`PantrixRadioGroup` seçenekleri `label`'ın altında alt alta dizer, en altına `supportingText`'i yazar. Her seçenek bir `RadioOption`'dır; burada her birinin altında ne anlama geldiği yazar. "Mağazadan teslim" seçilemez (`enabled = false`): basılmaz ve ok tuşları onu atlar.

Klavyeyle dene: Tab gruba bir kez girer ve seçili seçenekte durur. Aşağı ve yukarı ok seçimi ve odağı birlikte taşır, sondan başa döner.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

var delivery by rememberSaveable { mutableStateOf("standard") }
PantrixRadioGroup(
    options = DELIVERIES,
    selected = delivery,
    onSelect = { delivery = it },
    label = "Teslimat",
    supportingText = "Sipariş kargoya verilene kadar değiştirebilirsiniz",
    tagKey = "delivery"
)

private val DELIVERIES = listOf(
    RadioOption("standard", "Standart", supportingText = "Üç ila beş iş günü", tagKey = "standard"),
    RadioOption("express", "Hızlı", supportingText = "Ertesi iş günü", tagKey = "express"),
    RadioOption(
        value = "pickup",
        label = "Mağazadan teslim",
        supportingText = "Şehrinizde henüz yok",
        enabled = false,
        tagKey = "pickup"
    )
)
```

### Yan yana

`orientation = Orientation.Horizontal` seçenekleri yan yana dizer: satıra sığdığı kadarı yan yana durur, kalanı alt satıra geçer. Halkalar, altlarında bir metin olsun olmasın, etiketlerinin ilk satırında hizalanır.

Sol ve sağ ok da seçimi taşır; sağdan sola düzende yönleri değişir. Aşağı ve yukarı ok iki dizilişte de sonraki ve önceki seçenektir.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

var digest by rememberSaveable { mutableStateOf("weekly") }
PantrixRadioGroup(
    options = listOf(
        RadioOption("daily", "Her gün", tagKey = "daily"),
        RadioOption("weekly", "Haftada bir", tagKey = "weekly"),
        RadioOption("monthly", "Ayda bir", tagKey = "monthly"),
        RadioOption("never", "Hiç", tagKey = "never")
    ),
    selected = digest,
    onSelect = { digest = it },
    orientation = Orientation.Horizontal,
    label = "Özet e-postası",
    tagKey = "digest"
)
```

### Bir forma bağlı beden seçimi

`field` alan `PantrixRadioGroup` bir formun alanına bağlıdır: seçimini, hatasını ve adını alandan alır. Yapılması zorunlu bir seçim böyle kurulur: alan null ile başlar ve `Rules.required` taşır. Alanın kimliği otomasyon anahtarıdır: grup `RadioGroup_size`'dır, seçenekleri onun içinde adlandırılır.

Beden seçmeden "Sepete ekle"ye bas: kuralın mesajı yardım metninin yerine geçer, halkalar hata rengine döner ve odak gruba gider. Bedenler yan yana dizildi; tükenen "XL" seçilemez.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
PantrixRadioGroup(
    field = form.field<String?>("size", initial = null, Rules.required("Devam etmek için bir beden seçin")),
    options = SIZES,
    orientation = Orientation.Horizontal,
    label = "Beden",
    supportingText = "Kalıbı dardır; arada kaldıysanız bir büyüğünü seçin"
)
PantrixButton(
    text = "Sepete ekle",
    onClick = {
        scope.launch { form.submit { snackbars?.show(message = "Sepete eklendi", tagKey = "added_to_cart") } }
    },
    form = form,
    tagKey = "add_to_cart"
)

private val SIZES = listOf("XS", "S", "M", "L", "XL", "XXL").map { size ->
    RadioOption(value = size.lowercase(), label = size, enabled = size != "XL", tagKey = size.lowercase())
}
```

### Hata

`error` halkaları ve grubun altındaki metni temanın `danger` rolüne çevirir; ekran okuyucuya girdinin geçersiz olduğunu grup, bir kez söyler. Seçeneklerin altındaki metinler rengini korur: onlar seçeneğin ne olduğunu söyler, neyin yanlış olduğunu değil.

Burada hatayı örnek kendisi hesaplar: hiçbiri seçili değilken `error` true'dur. Birini seç: halkalar ve alttaki metin eski hâline döner.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

var invoice by rememberSaveable { mutableStateOf<String?>(null) }
PantrixRadioGroup(
    options = listOf(
        RadioOption("personal", "Bireysel", supportingText = "Fatura adınıza kesilir", tagKey = "personal"),
        RadioOption("company", "Kurumsal", supportingText = "Vergi numarası istenir", tagKey = "company")
    ),
    selected = invoice,
    onSelect = { invoice = it },
    label = "Fatura türü",
    supportingText = if (invoice == null) "Devam etmek için bir tür seçin" else "Sonradan değiştirebilirsiniz",
    error = invoice == null,
    tagKey = "invoice"
)
```

### Devre dışı ve salt okunur

Grubun `enabled = false`'u her seçeneği kapatır; etiket ve yardım metni de devre dışı yazı rengiyle yazılır. Hangi seçeneğin seçili olduğu yine görünür.

`onClick = null` verilen `PantrixRadioButton` salt okunurdur: basış ve odak almaz, renkleri değişmez, adını ve seçili olduğunu yine söyler.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioButton
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption

PantrixRadioGroup(
    options = listOf(
        RadioOption("card", "Kart", tagKey = "card"),
        RadioOption("transfer", "Havale", tagKey = "transfer")
    ),
    selected = "card",
    onSelect = {},
    orientation = Orientation.Horizontal,
    enabled = false,
    label = "Ödeme",
    supportingText = "Devre dışı: kayıtlı kartınızla ödenecek",
    tagKey = "payment"
)
PantrixRadioButton(
    selected = true,
    onClick = null,
    label = "Salt okunur",
    supportingText = "Basılmaz; yalnızca neyin seçildiğini gösterir",
    tagKey = "read_only"
)
```

### Tek başına: kartların içinde

`PantrixRadioButton` tek başına, grubun kuramayacağı bir düzen içindir: burada her seçenek bir kartın içindedir. Seçimi çağıran tutar: her düğme seçili olup olmadığını `selected` ile alır, basılınca `onClick` ile sorar.

Düğmeler `Modifier.selectableGroup()` taşıyan bir sütunun içindedir: ekran okuyucu onları tek bir seçim olarak duyar. Ok tuşlarıyla gezmek grubun işidir, burada yoktur: her düğme Tab için ayrı bir duraktır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.radiobutton.PantrixRadioButton
import com.pantrixui.foundation.theme.PantrixTheme

var plan by rememberSaveable { mutableStateOf("monthly") }
Column(
    modifier = Modifier.widthIn(max = 360.dp).selectableGroup(),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
        PantrixRadioButton(
            selected = plan == "monthly",
            onClick = { plan = "monthly" },
            modifier = Modifier.fillMaxWidth(),
            label = "Aylık",
            supportingText = "Her ay yenilenir; istediğiniz zaman bırakabilirsiniz",
            tagKey = "plan_monthly"
        )
    }
    PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
        PantrixRadioButton(
            selected = plan == "yearly",
            onClick = { plan = "yearly" },
            modifier = Modifier.fillMaxWidth(),
            label = "Yıllık",
            supportingText = "Yılda bir kez ödenir",
            tagKey = "plan_yearly"
        )
    }
}
```

### Kendi renkleri

`colors` grubun her seçeneğini boyar. Burada yalnızca seçili halkanın rengi verildi (`RadioColors(selected = …)`): seçili halka ve noktası uygulamanın kendi morundadır, ötekiler temanın renginde kalır.

Bu renkler seçilebilen ve hatasız bir halkanındır. Devre dışı bir seçenek ve hatalı bir grup, renk verilse de temanın renkleriyle çizilir.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioColors
import com.pantrixui.components.elements.radiobutton.RadioOption

var wrapping by rememberSaveable { mutableStateOf("gift") }
PantrixRadioGroup(
    options = listOf(
        RadioOption("plain", "Sade", tagKey = "plain"),
        RadioOption("gift", "Hediye paketi", tagKey = "gift")
    ),
    selected = wrapping,
    onSelect = { wrapping = it },
    orientation = Orientation.Horizontal,
    label = "Paket",
    supportingText = "Seçili halkanın rengi dışarıdan verildi; ötekiler temanın renginde",
    colors = RadioColors(selected = ownColors().color),
    tagKey = "wrapping"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Stil

`style` grubun her seçeneğinin halkasını değiştirir: `size` halkanın, `dotSize` içindeki noktanın boyudur, `strokeWidth` halkanın çizgi kalınlığı. Yalnızca verilen alanlar değişir; gerisi temanın ve platformun stilinden gelir.

Buradaki halka 28dp, noktası 14dp, çizgisi 3dp'dir. Halkanın rengi stilin parçası değildir: o durumdan ve `colors`'tan gelir.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.elements.radiobutton.RadioStyle

var seat by rememberSaveable { mutableStateOf("window") }
PantrixRadioGroup(
    options = listOf(
        RadioOption("window", "Cam kenarı", tagKey = "window"),
        RadioOption("aisle", "Koridor", tagKey = "aisle")
    ),
    selected = seat,
    onSelect = { seat = it },
    orientation = Orientation.Horizontal,
    label = "Koltuk",
    style = RadioStyle(size = 28.dp, dotSize = 14.dp, strokeWidth = 3.dp),
    tagKey = "seat"
)
```

### Halkalar sonda

Halkalar seçeneklerin sonunda (`controlPosition = ControlPosition.End`): alt alta seçenekler grubun genişliğini alır ve halkalar grubun sonunda bir sütunda durur.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.elements.selection.ControlPosition

var delivery by rememberSaveable { mutableStateOf("standard") }
PantrixRadioGroup(
    options = DELIVERIES,
    selected = delivery,
    onSelect = { delivery = it },
    modifier = Modifier.widthIn(max = 360.dp),
    label = "Teslimat",
    tagKey = "delivery_end",
    controlPosition = ControlPosition.End
)

private val DELIVERIES = listOf(
    RadioOption("standard", "Standart", supportingText = "Üç ila beş iş günü", tagKey = "standard"),
    RadioOption("express", "Hızlı", supportingText = "Ertesi iş günü", tagKey = "express"),
    RadioOption(
        value = "pickup",
        label = "Mağazadan teslim",
        supportingText = "Şehrinizde henüz yok",
        enabled = false,
        tagKey = "pickup"
    )
)
```

## API

### PantrixRadioButton

`import com.pantrixui.components.elements.radiobutton.PantrixRadioButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixRadioButton(
    selected: Boolean,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: RadioStyle? = null,
    colors: RadioColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Bir radyo düğmesi: seçili ya da seçili olmayan bir halka ve o halkanın etiketi. Biri seçilen birkaç seçenekten biridir.

Neredeyse her zaman `PantrixRadioGroup` ile kullanılır: grup seçenekleri dizer, seçimi ok tuşlarıyla taşır ve bir formun alanına bağlar. Tek başına, bir grubun kuramayacağı bir düzendeki seçenekler içindir, her seçeneğin bir kart olduğu bir düzen gibi. Böyle seçenekler `Modifier.selectableGroup()` içine alınır ki ekran okuyucu onları tek bir seçim olarak duysun.

Halka, etiket ve yardım metni tek bir hedeftir. Bunların herhangi bir yerine basmak seçeneği ister, çünkü telefonda parmağın basabildiği yerin çoğu yazıdır. Ekran okuyucu da adı etiketi olan ve seçili olup olmadığını söyleyen tek bir radyo düğmesi duyar. Etiket ve yardım metni kaç satır sürerse sürsün halka, etiketin ilk satırında durur. Halka ne kadar küçük olursa olsun satır, platformun dokunma hedefi kadar yer tutar.

`onClick` olmadan radyo düğmesi salt okunurdur: basış ve odak almaz, adını ve seçili olup olmadığını yine söyler. `error` halkayı ve yardım metnini danger rolüne çevirir ve duyurulur. Seçilince nokta büyür ve halka onunla birlikte primary rolünün rengine döner, seçim kalkınca ikisi de geri döner. Azaltılmış harekette ikisi de bir anda olur.

Parametreler:

- `selected: Boolean`: Bu seçeneğin seçili olup olmadığı.
- `onClick: (() -> Unit)?`: Kullanıcı radyo düğmesine basınca çağrılır, düğme zaten seçili olsa da olmasa da. Radyo düğmesi kendiliğinden bir şey değiştirmez: `selected` ne diyorsa odur. Null verilirse salt okunur olur.
- `modifier: Modifier`: Satırın modifier'ı.
- `enabled: Boolean`: Radyo düğmesinin seçilip seçilemeyeceği. Seçilemeyen düğme devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `label: String?`: Halkanın yanındaki metin: hedefin parçasıdır ve ekran okuyucu için radyo düğmesinin adıdır.
- `supportingText: String?`: Etiketin altında, daha küçük bir yazıyla duran yardım. `error` true iken mesajın kendisidir.
- `error: Boolean`: Seçimin yanlış ya da eksik olup olmadığı: halka ve yardım metni danger rolüne döner, ekran okuyucuya girdinin geçersiz olduğu söylenir.
- `style: RadioStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: RadioColors?`: Bu radyo düğmesinin kendi renkleri: verdiği renkler kullanılır, gerisi temanınkilerdir. Devre dışı bir halka ve hatalı bir halka temanın renklerinde kalır.
- `contentDescription: String?`: Ekran okuyucunun radyo düğmesi için söylediği söz: `label` yoksa düğmenin adıdır, seçeneğin kendisi olan bir kartta olduğu gibi. `label` varsa onun yerine söylenir.
- `tagKey: String?`: Radyo düğmesinin otomasyon anahtarı: satır `RadioButton_<tagKey>`'dir. Bir basış `RadioButton` olayı olarak bildirilir, etiketiyle hiçbir zaman bildirilmez.
- `interactionSource: MutableInteractionSource?`: Radyo düğmesinin dışarı taşınan etkileşimleri. Null ise düğme kendi kaynağını tutar.
- `controlPosition: ControlPosition`: halkanın durduğu yer: bir seçenek listesindeki gibi etiketin önü ya da arkası. Arkasındaysa halka satıra verilen genişliğin sonunda durur, `Modifier.fillMaxWidth()` onu ötekilerle hizalar; satıra genişlik verilmemişse etiketin hemen ardındadır. Etiket halkanın bıraktığı yerde sarar.

### PantrixRadioGroup

`import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixRadioGroup(
    options: List<RadioOption<T>>,
    selected: T?,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
    orientation: Orientation = Orientation.Vertical,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    style: RadioStyle? = null,
    colors: RadioColors? = null,
    tagKey: String? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Bir radyo düğmeleri grubu: `options` arasından birinin seçimi. Üstünde bir etiket, altında yardım metni ya da bir hatanın mesajı durur.

Seçenekler alt alta durur, `Orientation.Horizontal` ile yan yana: genişliğe sığdığı kadarı bir satırda, kalanı sonraki satırda. Her biri, halkası etiketinin ilk satırında duran bir `PantrixRadioButton`'dır.

Grup, WAI-ARIA'nın radyo grubu kalıbındaki gibi, Tab için tek duraktır ve durak seçili seçenektedir: hiçbiri seçili değilken seçilebilen ilk seçenekte. Ok tuşları sonraki ve önceki seçeneği seçer, sağdan sola düzende sol ve sağ yer değiştirir. Sondan başa dönerler ve devre dışı bir seçeneği atlarlar. Yalnızca odağı taşımazlar, seçerler: bir seçenek odaktayken odak, seçimi kim yaparsa yapsın, seçimle birlikte gider. Böylece ekran okuyucunun üstünde durduğu seçenek, seçili olandır. Basışın odağı taşıyabildiği yerde, bir seçeneğe basmak odağı o seçeneğe götürür.

Ekran okuyucu için her seçenek, adı `label` olan tek bir grubun içinde, seçili olup olmadığını söyleyen bir radyo düğmesidir. `error` her halkayı ve grubun mesajını danger rolüne çevirir ve grup onu bir kez duyurur.

Parametreler:

- `options: List<RadioOption<T>>`: Seçenekler, sırasıyla.
- `selected: T?`: Seçili seçeneğin değeri. Null ya da hiçbir seçeneğin taşımadığı bir değer hiçbirini seçmez.
- `onSelect: (T) -> Unit`: Kullanıcının bir basışla ya da tuşlarla seçtiği seçeneğin değeriyle çağrılır. Grup kendiliğinden bir şey seçmez: `selected` hangi değeri söylüyorsa o seçenek seçilidir. Seçili olan seçeneğe basmak onu yeniden ister, bir ok tuşu ise yalnızca başka bir seçeneği ister.
- `modifier: Modifier`: Grubun modifier'ı.
- `orientation: Orientation`: Alt alta seçenekler için `Orientation.Vertical`, yan yana seçenekler için `Orientation.Horizontal`.
- `enabled: Boolean`: False verilirse her seçenek devre dışı kalır, etiket ve yardım metni de devre dışı yazı rengiyle yazılır.
- `label: String?`: Seçimin ne olduğunu söyler ve seçeneklerin üstüne yazılır: ekran okuyucu için grubun adıdır.
- `supportingText: String?`: Seçeneklerin altında, daha küçük bir yazıyla duran yardım metni: `error` true iken mesajın kendisidir.
- `error: Boolean`: Seçimin yanlış ya da eksik olup olmadığı: halkalar ve yardım metni danger rolüne döner, ekran okuyucuya girdinin geçersiz olduğu söylenir.
- `style: RadioStyle?`: Bu çağrının kendi stili, her seçeneğin çizildiği stil: çevresindeki bütün stilleri ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: RadioColors?`: Temanın renkleri kullanılmayacaksa her seçeneğin çizildiği renkler: burada verilenler kullanılır, gerisi temanınkilerdir. Devre dışı bir seçenek ve hatalı bir grup temanın renklerinde kalır.
- `tagKey: String?`: Grubun otomasyon anahtarı: grup `RadioGroup_<tagKey>`'dir ve seçenekleri onun içinde adlandırılır, `RadioGroup_<tagKey>.RadioButton_<key>`. Böylece seçenekleri aynı olan iki grup birbirinden ayırt edilir. Bir seçim bir kez, bir `RadioGroup` olayı olarak bildirilir: olay seçeneğin sırasını taşır, değerini ya da etiketini hiçbir zaman taşımaz.
- `controlPosition: ControlPosition`: her seçeneğin halkasının durduğu yer: etiketinin önü ya da arkası. Arkasındaysa, alt alta seçeneklerin her biri grubu boydan boya kaplar ve halkalar grubun sonunda hizalanır; yan yana seçeneklerde her halka etiketinin ardından gelir.

### PantrixRadioGroup

`import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixRadioGroup(
    field: FormField<T>,
    options: List<RadioOption<T>>,
    modifier: Modifier = Modifier,
    orientation: Orientation = Orientation.Vertical,
    enabled: Boolean = true,
    label: String? = null,
    supportingText: String? = null,
    style: RadioStyle? = null,
    colors: RadioColors? = null,
    controlPosition: ControlPosition = ControlPosition.Start
)
```

Bir formun alanına bağlı radyo grubu: seçimi, hatası ve adı `field`'den gelir.

Bir seçim alanı değiştirir ve alanı dokunulmuş sayar. Böylece bir kuralın mesajı kimsenin dokunmadığı bir formda değil, ilk seçimden sonra ya da form gönderildiğinde görünür. Alan hatalıyken mesaj `supportingText`'in yanında durmaz, onun yerine geçer. Alanın kimliği grubun otomasyon anahtarıdır, `RadioGroup_<id>`, seçenekleri de onun içindedir. Form bu alan hatalıyken gönderilirse odağı buraya yollayabilir: odak grubun tek durağına gider.

Yapılması zorunlu bir seçim, null olabilen ve null ile başlayan bir değerin alanıdır ve `Rules.required` taşır. Seçenekleri değerin kendisinin seçenekleridir: bir `RadioOption<String>`, bir `FormField<String?>`'in seçeneğidir.

Kontrollü biçimin bir parametresi değil, kendi başına bir overload'dır: böylece bir seçim ile bir alan birlikte verilemez.

Parametreler:

- `field: FormField<T>`: Grubun gösterdiği ve değiştirdiği alan.
- `options: List<RadioOption<T>>`: Seçenekler, sırasıyla.
- `modifier: Modifier`: Grubun modifier'ı.
- `orientation: Orientation`: Alt alta seçenekler için `Orientation.Vertical`, yan yana seçenekler için `Orientation.Horizontal`.
- `enabled: Boolean`: False verilirse her seçenek devre dışı kalır.
- `label: String?`: Seçimin ne olduğunu söyler ve seçeneklerin üstüne yazılır: ekran okuyucu için grubun adıdır.
- `supportingText: String?`: Seçeneklerin altındaki yardım metni. Alanın orada gösterilecek bir hatası yokken görünür.
- `style: RadioStyle?`: Bu çağrının kendi stili, her seçeneğin çizildiği stil: çevresindeki bütün stilleri ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: RadioColors?`: Temanın renkleri kullanılmayacaksa her seçeneğin çizildiği renkler: burada verilenler kullanılır, gerisi temanınkilerdir. Devre dışı bir seçenek ve hatalı bir grup temanın renklerinde kalır.
- `controlPosition: ControlPosition`: her seçeneğin halkasının durduğu yer: etiketinin önü ya da arkası. Arkasındaysa, alt alta seçeneklerin her biri grubu boydan boya kaplar ve halkalar grubun sonunda hizalanır; yan yana seçeneklerde her halka etiketinin ardından gelir.

### RadioOption

`import com.pantrixui.components.elements.radiobutton.RadioOption`, `com.pantrixui:components` içinden

```kotlin
class RadioOption<out T>(
    public val value: T,
    public val label: String,
    public val supportingText: String? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

`PantrixRadioGroup`'un bir seçeneği: karşılık geldiği değer, etiketi ve otomasyon için bir anahtar.

Parametreler:

- `value: T`: Seçenek seçilince grubun `onSelect`'ine verdiği ve `selected`'ıyla `==` ile karşılaştırdığı değer.
- `label: String`: Görünen metin ve ekran okuyucu için seçeneğin adı.
- `supportingText: String?`: Etiketin altına daha küçük bir yazıyla yazılır ve seçeneğin ne olduğunu söyler: bir fiyat, bir teslimatın ne kadar süreceği. Seçeneğin hedefinin ve ekran okuyucunun seçenek için söylediğinin parçasıdır. Grup hatalıyken rengini korur.
- `enabled: Boolean`: Seçeneğin seçilip seçilemeyeceği. Seçilemeyen bir seçeneğe basmak bir şey yapmaz ve ok tuşları onu atlar.
- `tagKey: String?`: Seçeneğin her dilde aynı olan otomasyon anahtarı: seçenek `RadioButton_<tagKey>`'dir, anahtar verilmezse `RadioButton_<index>`. Anahtarı olan bir grubun etiketinin içinde durur: `RadioGroup_plan.RadioButton_pro`.

### RadioStyle

`import com.pantrixui.components.elements.radiobutton.RadioStyle`, `com.pantrixui:components` içinden

```kotlin
class RadioStyle(
    public val size: Dp = Dp.Unspecified,
    public val dotSize: Dp = Dp.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified
) : PantrixStyle<RadioStyle>
```

`PantrixRadioButton`'ın halkası ve içindeki nokta: her birinin boyu ve halkanın kalınlığı.

Halka, Material 3'teki gibi, 10dp'lik bir noktanın çevresinde 20dp'dir. Onay kutusunun da 22dp olduğu iOS'ta 12dp'lik bir noktanın çevresinde 22dp'dir. iOS'un kendi radyo düğmesi yoktur: bir listenin seçilen tek satırını bir onay işaretiyle gösterir. Pantrix aynı halkayı her platformda çizer ki tek seçeneğin seçildiği bir seçim, nerede yapılırsa yapılsın, öyle görünsün.

Üçü de yoğunlukla ölçeklenmez: halka, noktası ve çizgisi hava değildir. Halkayla etiketi arasındaki boşluk ölçeklenir, çünkü temanın boşluk ölçeğinden gelir. Radyo düğmesinin renkleri stilinin parçası değildir: durumundan gelir, kendi renkleri olan bir radyo düğmesinde `RadioColors`'tan da.

Parametreler:

- `size: Dp`: Halkanın genişliği ve yüksekliği, çizgisiyle birlikte.
- `dotSize: Dp`: Seçili bir halkanın içindeki noktanın genişliği ve yüksekliği.
- `strokeWidth: Dp`: Halkanın çizgisinin kalınlığı.

### RadioColors

`import com.pantrixui.components.elements.radiobutton.RadioColors`, `com.pantrixui:components` içinden

```kotlin
data class RadioColors(
    public val selected: Color = Color.Unspecified,
    public val unselected: Color = Color.Unspecified
)
```

Temanın renklerini almayanlar için `PantrixRadioButton`'ın ve `PantrixRadioGroup` seçeneklerinin boyandığı renkler: verilen renk kullanılır, verilmeyen temanın rolünde kalır.

```kotlin
PantrixRadioGroup(
    options = plans,
    selected = plan,
    onSelect = { plan = it },
    colors = RadioColors(selected = brand)
)
```

Bunlar seçilebilen ve hatasız bir radyo düğmesinin renkleridir. Burada ne verilirse verilsin, devre dışı bir düğme temanın devre dışı rolüyle, hatalı bir düğme de temanın danger rolüyle çizilir.

Parametreler:

- `selected: Color`: Seçilen seçeneğin halkası ve noktası. Temanın `primary` rengi.
- `unselected: Color`: Seçili olmayan bir seçeneğin halkası. Temanın `borderStrong` rengi: boş bir halka çizgisinden ibarettir.

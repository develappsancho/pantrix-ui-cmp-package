# Button

Bir işi başlatan düğme: kaydet, gönder, sil. Bir ekranın en çok basılan bileşenidir ve her platformda o platformun ölçüleriyle çizilir: köşeleri Android'de, masaüstünde ve web'de tam yuvarlak, iOS'ta orta yuvarlaktır.

- `PantrixButton` (`com.pantrixui.components.elements.button`, `com.pantrixui:components`): Asıl eylemi başlatan düğme: altı tür, beş boyut, bir yükleniyor hâli ve form gönderme. Anahtar sözcükler: düğme, buton, eylem, gönder, kaydet, harekete geçirici, yükleniyor, sil.

## Özellikler

- **Altı varyant.** `variant` düğmenin ne kadar öne çıktığını söyler: ekrandaki tek ana iş `Solid`, ikincil işler `Outline`, `Soft` ve `Subtle`, üçüncül işler `Text`, geri alınamayan iş `Destructive`.
- **Beş boyut.** `size` yüksekliği, iç boşluğu ve etiketin yazı stilini birlikte seçer: 24dp'den 56dp'ye, 8'er dp arayla. Yükseklik en az yüksekliktir: sistemin yazı boyutu büyütülünce düğme etiketiyle birlikte uzar.
- **İkonlar.** `leadingIcon` etiketin önünde, `trailingIcon` arkasında durur ve etiketin rengini alır.
- **Yükleniyor.** `loading` öndeki ikonun yerine bir spinner koyar ve iş bitene kadar basışları durdurur.
- **Form.** `form` verilen düğmeye basılınca önce form doğrulanır: bir alan geçersizken `onClick` çağrılmaz, o alan odağı alır. Form gönderilirken düğme kendiliğinden yükleniyor görünür.
- **Her rolde.** Varsayılan renk temanın `primary` rolüdür, `Destructive`'te `danger` rolü; `PantrixColor.buttonColors(variant)` aynı varyantı başka bir rolde, `ButtonColors` tamamen kendi renginde verir.
- **Kendi içeriği.** Etiket yerine bir içerik alan ikinci bir `PantrixButton` vardır: bir sayaç, iki satır, bir rozet. Onda `contentDescription` zorunludur.
- **Erişilebilirlik.** `contentDescription` etiketin yerine okunur, ardından değil: yalnızca etiket düğmenin ne yaptığını söylemiyorsa verilir, "+" gibi.

## Kullanım

### Primary action

```kotlin
PantrixButton(
    text = stringResource(Res.string.save),
    onClick = onSave,
    tagKey = "save"
)
```

### Submitting a form

```kotlin
val form = rememberFormState()
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.save),
    onClick = { scope.launch { form.submit { repository.save() } } },
    form = form,
    tagKey = "save"
)
```

### A destructive action beside its cancel

```kotlin
PantrixButton(
    text = stringResource(Res.string.cancel),
    onClick = onDismiss,
    variant = ButtonVariant.Text,
    tagKey = "cancel"
)
PantrixButton(
    text = stringResource(Res.string.delete),
    onClick = onDelete,
    variant = ButtonVariant.Destructive,
    tagKey = "delete"
)
```

### With an icon before the label

```kotlin
PantrixButton(
    text = stringResource(Res.string.new_folder),
    onClick = onNewFolder,
    variant = ButtonVariant.Outline,
    leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Folder, contentDescription = null) },
    tagKey = "new_folder"
)
```

## Örnekler

### Varyantlar

`variant` düğmenin rengini ve ne kadar öne çıktığını seçer. Bir ekranda tek bir `Solid` olur: göz önce ona gider. `Outline`, `Soft` ve `Subtle` ikincil işlerdir; `Text` bir yüzeyi olmayan üçüncül iştir, "Vazgeç" gibi. `Destructive` geri alınamayan işi söyler ve bir dialog'un tek düğmesi olmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    ButtonVariant.entries.forEach { variant ->
        PantrixButton(text = variant.name, onClick = {}, variant = variant, tagKey = "variant_${variant.name}")
    }
}
```

### Boyutlar

`size` beş yükseklikten birini seçer: 24, 32, 40, 48 ve 56 dp. Varsayılan `Medium`'dur. İki uç belirli yerler içindir: `ExtraSmall` sık bir tablo satırında ya da bir alanın yanında, `ExtraLarge` bir telefon ekranının etrafında kurulduğu tek işte.

Yükseklik düğmenin en az yüksekliğidir. Sistemin yazı boyutu büyütülünce etiket düğmeden uzun olursa düğme onunla birlikte uzar ve etiket kesilmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    ButtonSize.entries.forEach { size ->
        PantrixButton(
            text = size.name,
            onClick = {},
            variant = ButtonVariant.Outline,
            size = size,
            tagKey = "size_${size.name}"
        )
    }
}
```

### İkonlu düğmeler

`leadingIcon` etiketin önünde, `trailingIcon` arkasında durur. İkonun rengi verilmez: düğmenin içerik rengini kendiliğinden alır. Süs olduğu için `contentDescription`'ı null'dır; ekran okuyucu yalnızca etiketi okur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Yeni klasör",
        onClick = {},
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Folder, contentDescription = null) },
        tagKey = "new_folder"
    )
    PantrixButton(
        text = "Devam et",
        onClick = {},
        variant = ButtonVariant.Soft,
        trailingIcon = { PantrixIcon(imageVector = PantrixIcons.ArrowForward, contentDescription = null) },
        tagKey = "continue"
    )
    PantrixButton(
        text = "Yenile",
        onClick = {},
        variant = ButtonVariant.Outline,
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Refresh, contentDescription = null) },
        tagKey = "refresh"
    )
}
```

### Yükleniyor ve devre dışı

`loading` öndeki ikonun yerine bir spinner koyar ve iş bitene kadar basışları durdurur: aynı iş iki kez başlamaz. "Kaydet"e bas: iki saniye yükleniyor görünür, sonra uygulamanın snackbar'ı haber verir.

`enabled = false` düğmeyi soluk çizer ve düğme basış almaz. İkisi aynı şey değildir: yüklenen düğme bir işin sürdüğünü, devre dışı olan işin şu an yapılamayacağını söyler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

val snackbars = LocalPantrixSnackbars.current
var saving by remember { mutableStateOf(false) }
LaunchedEffect(saving) {
    if (saving) {
        delay(SAVE_MILLIS)
        saving = false
        snackbars?.show(message = "Kaydedildi")
    }
}
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Kaydet", onClick = { saving = true }, loading = saving, tagKey = "save")
    PantrixButton(text = "Yükleniyor", onClick = {}, variant = ButtonVariant.Outline, loading = true, tagKey = "loading_outline")
    PantrixButton(text = "Devre dışı", onClick = {}, enabled = false, tagKey = "disabled")
    PantrixButton(text = "Devre dışı", onClick = {}, variant = ButtonVariant.Outline, enabled = false, tagKey = "disabled_outline")
}

private const val SAVE_MILLIS = 2_000L
```

### Tam genişlik

`fullWidth` düğmeyi bulunduğu yerin genişliğine yayar: bir formun altındaki gönder düğmesi, bir sheet'in iki düğmesi. Burada sütun en fazla 360dp'dir, düğmeler onu doldurur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

Column(
    modifier = Modifier.widthIn(max = 360.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Siparişi tamamla", onClick = {}, size = ButtonSize.Large, fullWidth = true, tagKey = "complete_order")
    PantrixButton(text = "Alışverişe dön", onClick = {}, variant = ButtonVariant.Text, fullWidth = true, tagKey = "back_to_shop")
}
```

### Başka bir rolde ve kendi renginde

Bir varyantın renkleri temanın `primary` rolünden gelir, `Destructive`'inkiler `danger` rolünden. `PantrixColor.buttonColors(variant)` aynı varyantı başka bir rolde verir: üst satır `success` rolünde dört varyant.

Alt satırdaki düğmenin rengi temanın hiçbir rolünde yok: `ButtonColors` dolguyu, içeriğin rengini ve istenirse kenarı doğrudan alır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.foundation.theme.PantrixTheme

val success = PantrixTheme.colors.success
val own = ownColors()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    listOf(ButtonVariant.Solid, ButtonVariant.Soft, ButtonVariant.Outline, ButtonVariant.Text).forEach { variant ->
        PantrixButton(
            text = "Onayla",
            onClick = {},
            colors = success.buttonColors(variant),
            tagKey = "confirm_${variant.name.lowercase()}"
        )
    }
}
PantrixButton(
    text = "Kampanyaya katıl",
    onClick = {},
    colors = ButtonColors(container = own.color, content = own.onColor),
    tagKey = "own_colors"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Şekil ve stil

`shape` tek bir düğmenin köşelerini değiştirir: temanın şekillerinden biri ya da herhangi bir `Shape`. `style` ise düğmenin geometrisini değiştirir: burada `pressedScale` ile basılıyken küçülen bir düğme. Yalnızca verilen alanlar değişir, gerisi temanın ve platformun stilinden gelir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(text = "Köşeli", onClick = {}, shape = PantrixTheme.shapes.none, tagKey = "square")
    PantrixButton(text = "Az yuvarlak", onClick = {}, shape = PantrixTheme.shapes.sm, tagKey = "rounded")
    PantrixButton(text = "Tam yuvarlak", onClick = {}, shape = PantrixTheme.shapes.full, tagKey = "pill")
    PantrixButton(
        text = "Basınca küçülür",
        onClick = {},
        variant = ButtonVariant.Soft,
        style = ButtonStyle(pressedScale = 0.94f),
        tagKey = "press_scale"
    )
}
```

### Kendi içeriği

Etiket yerine içerik alan `PantrixButton`: içerik bir satırdır (`RowScope`) ve düğmenin içerik rengiyle çizilir. Burada etiketin yanında basıldıkça artan bir sayaç var.

Bu biçimde `contentDescription` zorunludur: düğmenin içinde ne olursa olsun ekran okuyucu tek bir cümle okur, "Beğen, 12 beğeni".

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var likes by rememberSaveable { mutableIntStateOf(12) }
PantrixButton(
    onClick = { likes += 1 },
    contentDescription = "Beğen, $likes beğeni",
    variant = ButtonVariant.Soft,
    tagKey = "like"
) {
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
    PantrixText(text = "Beğen")
    PantrixText(text = likes.toString(), style = PantrixTheme.typography.footnote)
}
```

### Bir formu gönderen düğme

`form` verilen düğme formun gönder düğmesidir. Basılınca önce form doğrulanır: alan boşken `onClick` çağrılmaz, alan hatasını gösterir ve odağı alır. Geçerliyse `form.submit` çalışır ve o sürerken düğme kendiliğinden yükleniyor görünür: `loading` ayrıca verilmez.

Alanı boş bırakıp "Davet et"e bas, sonra bir ad yazıp yeniden dene.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val form = rememberFormState()
Column(
    modifier = Modifier.widthIn(max = 360.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixTextField(
        field = form.field("name", initial = "", Rules.notBlank("Davet edilecek kişinin adını yazın")),
        modifier = Modifier.fillMaxWidth(),
        form = form,
        label = "Ad"
    )
    PantrixButton(
        text = "Davet et",
        onClick = {
            scope.launch {
                form.submit {
                    delay(SAVE_MILLIS)
                    snackbars?.show(message = "Davet gönderildi")
                }
            }
        },
        form = form,
        tagKey = "invite"
    )
}

private const val SAVE_MILLIS = 2_000L
```

## API

### PantrixButton

`import com.pantrixui.components.elements.button.PantrixButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Solid,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    loading: Boolean = false,
    fullWidth: Boolean = false,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    style: ButtonStyle? = null,
    shape: Shape = PantrixTheme.style(key = ButtonStyle, override = style).shape.toShape(),
    colors: ButtonColors = variant.colors(),
    contentDescription: String? = null,
    form: FormState? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Metin etiketli düğme: düğmelerin çoğu bu biçimdedir.

`variant` renkleri, `size` ise yüksekliği, iç boşluğu ve etiketin yazı stilini seçer. `style` temanın `ButtonStyle`'ını yalnızca bu düğme için ezer: şeklini, basılıyken ölçeğini ve her boyutun geometrisini. Yükseklik düğmenin en az yüksekliğidir: okuyanın büyüttüğü yazı etiketi bundan yüksek yaptığında düğme de etiketle birlikte uzar. Düğmenin üstündeki imleç onun üstüne içerik renginden hafif bir örtü serer, basış daha güçlüsünü: böylece fare bir tıklamanın neye basacağını gösterir.

`loading`, `leadingIcon`'ın yerine bir spinner gösterir ve basışları durdurur. Gönderilmekte olan bir `form` da aynısını yapar. `form` verilmişse basış önce formu doğrular: bir alan geçersizken `onClick` çağrılmaz, o alan odağı alır ve hata için dokunsal geri bildirim verilir.

`contentDescription`, `text`'in yerine okunur, ardından değil: yalnızca etiket tek başına düğmenin ne yaptığını söylemiyorsa verilir, bir "+" gibi.

Parametreler:

- `text: String`
- `onClick: () -> Unit`
- `modifier: Modifier`: düğmenin modifier'ı.
- `variant: ButtonVariant`
- `size: ButtonSize`
- `enabled: Boolean`: düğmeye basılıp basılamayacağı: basılamayan düğme devre dışı renklerle çizilir ve hiçbir şey yapmaz.
- `loading: Boolean`
- `fullWidth: Boolean`: true, düğmeyi verilen genişlik boyunca uzatır; içeriği ortada durur.
- `leadingIcon: (@Composable () -> Unit)?`
- `trailingIcon: (@Composable () -> Unit)?`: etiketin ardında duran: bir ok ya da bir sayı.
- `style: ButtonStyle?`
- `shape: Shape`: düğmenin köşeleri: varsayılanı çözülmüş stilinki. Burada verilirse `style`'ınkini ezer.
- `colors: ButtonColors`: bu çağrının kendi renkleri, `variant`'ınkilerin yerine.
- `contentDescription: String?`
- `form: FormState?`
- `tagKey: String?`: düğmenin otomasyon anahtarı: düğme `Button_<tagKey>`'dır, anahtar yoksa çağrıldığı yerden bir anahtar alır. Görünen metin hiçbir zaman anahtar olmaz.
- `interactionSource: MutableInteractionSource?`: düğmenin etkileşimleri, dışarı taşınmış: odağı, üstündeki işaretçi ve basışları. Bu null olduğunda kendi kaynağını tutar.

### PantrixButton

`import com.pantrixui.components.elements.button.PantrixButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixButton(
    onClick: () -> Unit,
    contentDescription: String,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Solid,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    loading: Boolean = false,
    fullWidth: Boolean = false,
    style: ButtonStyle? = null,
    shape: Shape = PantrixTheme.style(ButtonStyle, style).shape.toShape(),
    colors: ButtonColors = variant.colors(),
    form: FormState? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    content: @Composable RowScope.() -> Unit
)
```

Yuvalı biçim: bir metnin anlatamayacağı içerik için.

`contentDescription` burada isteğe bağlı değil, zorunludur: metin parametresi olmayınca ekran okuyucunun başvuracağı başka bir şey kalmaz. Ekran okuyucunun düğmeden duyduğu yalnızca odur: `content` içindeki çizilir, ama ardından okunmaz. `style`, metinli biçimin stilidir.

Parametreler:

- `onClick: () -> Unit`: bir basışın yaptığı. Bir `form` verilmişse form geçerli olunca çağrılır.
- `contentDescription: String`
- `modifier: Modifier`: düğmenin modifier'ı.
- `variant: ButtonVariant`: düğmenin öne çıkışı ve onunla gelen renkler.
- `size: ButtonSize`: düğmenin yüksekliği, iç boşluğu ve etiketinin yazı tipi.
- `enabled: Boolean`: düğmeye basılıp basılamayacağı: basılamayan düğme devre dışı renklerle çizilir ve hiçbir şey yapmaz.
- `loading: Boolean`: düğmenin, başlattığı iş sürerken basış almayıp almadığı; o sırada ekran okuyucuya yüklendiğini söyler. Bu arada `content`'in ne gösterdiği çağıranın işidir.
- `fullWidth: Boolean`: true, düğmeyi verilen genişlik boyunca uzatır; içeriği ortada durur.
- `style: ButtonStyle?`
- `shape: Shape`: düğmenin köşeleri: varsayılanı çözülmüş stilinki. Burada verilirse `style`'ınkini ezer.
- `colors: ButtonColors`: bu çağrının kendi renkleri, `variant`'ınkilerin yerine.
- `form: FormState?`: düğmenin gönderdiği form: bir basış önce onu doğrular, form gönderilirken düğme basış almaz.
- `tagKey: String?`: düğmenin otomasyon anahtarı: düğme `Button_<tagKey>`'dır, anahtar yoksa çağrıldığı yerden bir anahtar alır. Görünen metin hiçbir zaman anahtar olmaz.
- `interactionSource: MutableInteractionSource?`: düğmenin etkileşimleri, dışarı taşınmış: odağı, üstündeki işaretçi ve basışları. Bu null olduğunda kendi kaynağını tutar.
- `content: @Composable RowScope.() -> Unit`

### ButtonVariant

`import com.pantrixui.components.elements.button.ButtonVariant`, `com.pantrixui:components` içinden

```kotlin
enum class ButtonVariant
```

Bir düğmenin ne kadar öne çıktığı.

Dördü bir menü değil, bir merdivendir; her biri üstündekinden daha sakindir: `Solid` rolün renginde doludur, `Soft` rolün soluk container renginde, `Outline`'ın dolgusu yoktur ve bir kenarı vardır, `Text`'in ikisi de yoktur. Seçerken, bildirildikleri sıra olmayan bu sırayla okunur: düğme çevresindekilerle yarışmayı bırakana kadar aşağı inilir.

`Subtle`, `Soft` ile aynı basamakta durur: aynı soluk dolgu ve içerik renginde silik bir kenar. Bu kenar, dolgunun tek başına arka plandan zor ayrıldığı yerde düğmenin şeklini korur.

`Destructive` bir basamak değildir. Düğmenin ne *yaptığını* söyler. Renk rolünü değiştiren tek varyant olması da, en altta, merdivenin erişemediği yerde durması da bundandır.

Değerleri:

- `Solid`: Bir ekrandaki tek ana iş. Varsayılan.
- `Outline`: Kalabalık bir yüzeyde ikincil iş: dolu bir şeklin çevresiyle yarışacağı yerde.
- `Soft`: İkincil, ama yine açıkça bir düğme: rolün container renginde soluk bir dolgu.
- `Subtle`: Silik bir kenarı olan `Soft`: soluk dolgunun tek başına çevresine karışacağı yerde şekil yine görünür.
- `Text`: Üçüncül: araç çubuğu işleri, "Vazgeç". Hiç yüzeyi yoktur.
- `Destructive`: Yıkıcı ve geri alınamaz. Hiçbir zaman bir dialog'daki tek iş değildir.

### ButtonSize

`import com.pantrixui.components.elements.button.ButtonSize`, `com.pantrixui:components` içinden

```kotlin
enum class ButtonSize
```

Beş yükseklik: 24'ten 56'ya, 8dp'lik adımlarla.

`Medium` varsayılandır ve ilk başvurulacak olandır. İki uç genel bir ölçek duygusu vermek için değil, varsayılanın yanlış olacağı yerler içindir: `ExtraSmall` sık bir tablo satırının içinde ya da bir alanın yanında, `ExtraLarge` bir telefon ekranının çevresinde kurulduğu tek iş olarak.

Değerleri:

- `ExtraSmall`: 24dp yüksekliğinde: sık bir tablo satırının içinde ya da bir alanın yanında.
- `Small`: 32dp yüksekliğinde.
- `Medium`: 40dp yüksekliğinde: varsayılan ve uzanılması gereken.
- `Large`: 48dp yüksekliğinde.
- `ExtraLarge`: 56dp yüksekliğinde: bir telefon ekranının çevresinde kurulduğu tek eylem.

### ButtonColors

`import com.pantrixui.components.elements.button.ButtonColors`, `com.pantrixui:components` içinden

```kotlin
data class ButtonColors(
    public val container: Color,
    public val content: Color,
    public val border: Color = Color.Unspecified
)
```

Bir düğmenin boyandığı renkler. `ButtonVariant.colors` bir varyantın `primary` rolündeki renklerini, `PantrixColor.buttonColors` ise aynı öne çıkma derecelerini herhangi bir rolde verir.

Parametreler:

- `container: Color`: Dolgu. Çerçeveli düğmede ve metin düğmesinde saydamdır.
- `content: Color`: Etiketin ve ikonun rengi.
- `border: Color`: Kenarın rengi. Kenarı olmayan düğme için `Color.Unspecified`.

### ButtonVariant.colors

`import com.pantrixui.components.elements.button.colors`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun ButtonVariant.colors(): ButtonColors
```

Varyantın renkleri: temanın `primary` rolünden, `ButtonVariant.Destructive` için `danger` rolünden gelir. `PantrixButton`'ın varsayılan `colors`'ıdır. Çağıranın kendi `ButtonColors`'ı tek bir düğmede onu ezer.

`ButtonVariant.Outline` ve `ButtonVariant.Text`'in kendi dolgusu yoktur. Üstüne ne yazıldığını söyleyen bir dolguda, markanın renginde bir üst bar'da, temanın `primary`'si dolgudan zor ayırt edileceği için onlar da, kenarları da, oraya yazıldığı gibi yazılır. Temanın kendi zeminlerinde `primary`'yi korurlar.

### PantrixColor.buttonColors

`import com.pantrixui.components.elements.button.buttonColors`, `com.pantrixui:components` içinden

```kotlin
fun PantrixColor.buttonColors(variant: ButtonVariant = ButtonVariant.Solid): ButtonColors
```

Aynı öne çıkma dereceleri: `primary` yerine herhangi bir rolden alınır.

"Bu bir şeyi siler" demenin yolu `ButtonVariant.Destructive.colors()` olarak kalır ve o kendi anlamını korur: varyant düğmenin ne *olduğudur*. Bu ise yalnızca neyle *boyandığıdır* ve bir durum taşıyan düğme içindir: `success` rolünde "Ödendi olarak işaretle", `warning` rolünde "Yeniden dene". Bu yüzden `ButtonVariant.Destructive` burada kendisine verilen rolü sessizce yok saymaz, tıpkı `ButtonVariant.Solid` gibi boyar.

`ButtonVariant.Subtle` burada da kenarı olan `ButtonVariant.Soft`'tur ve ikisini ayıran yalnızca bu kenardır. Kenar rolün kendi rengiyle, tam güçte çizilir. Varsayılan ise `primary.onContainer` rengini %30 güçte çizer.

```kotlin
PantrixButton(
    text = stringResource(Res.string.mark_paid),
    onClick = onMarkPaid,
    colors = PantrixTheme.colors.success.buttonColors(),
    tagKey = "mark_paid"
)
```

Parametreler:

- `variant: ButtonVariant`: renklerin hangi öne çıkış için olduğu: başka bir şey söylenmedikçe `ButtonVariant.Solid`.

### ButtonStyle

`import com.pantrixui.components.elements.button.ButtonStyle`, `com.pantrixui:components` içinden

```kotlin
class ButtonStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val pressedScale: Float = Float.NaN,
    public val extraSmall: ButtonSizeStyle = ButtonSizeStyle(),
    public val small: ButtonSizeStyle = ButtonSizeStyle(),
    public val medium: ButtonSizeStyle = ButtonSizeStyle(),
    public val large: ButtonSizeStyle = ButtonSizeStyle(),
    public val extraLarge: ButtonSizeStyle = ButtonSizeStyle()
) : PantrixStyle<ButtonStyle>
```

`PantrixButton`'ın geometrisi: şekli, basış geri bildirimi ve her `ButtonSize` için bir yükseklik, bir iç boşluk ve bir ikon boyutu. `PantrixIconButton` yalnızca boyutları okur.

Boyutlar her platformda aynıdır, şekil ve basış ölçeği aynı değildir.

Parametreler:

- `shape: ShapeSpec`: Düğmenin şekli: Android'de, masaüstünde ve web'de `ShapeRole.Full`, iOS'ta `ShapeRole.Medium`.
- `pressedScale: Float`: Basılıyken ölçek. `1f` ölçekleme yok demektir: geri bildirimi durum katmanı taşır.
- `extraSmall: ButtonSizeStyle`: `ButtonSize.ExtraSmall`'ın geometrisi.
- `small: ButtonSizeStyle`: `ButtonSize.Small`'ın geometrisi.
- `medium: ButtonSizeStyle`: `ButtonSize.Medium`'un geometrisi.
- `large: ButtonSizeStyle`: `ButtonSize.Large`'ın geometrisi.
- `extraLarge: ButtonSizeStyle`: `ButtonSize.ExtraLarge`'ın geometrisi.

### ButtonSizeStyle

`import com.pantrixui.components.elements.button.ButtonSizeStyle`, `com.pantrixui:components` içinden

```kotlin
class ButtonSizeStyle(
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<ButtonSizeStyle>
```

Bir `ButtonSize`'ın yüksekliği, yatay iç boşluğu ve ikon boyutu.

Parametreler:

- `height: Dp`: Düğmenin yüksekliği.
- `horizontalPadding: Dp`: Düğmenin yanları ile içeriği arasındaki boşluk.
- `iconSize: Dp`: Bir ikon düğmesinin ikonunun, bir gruptaki düğmenin ikonunun, bir alert'i ya da bir sheet'i kapatan çarpının ve yüklenen bir düğmenin spinner'ının boyutu. Bir düğmenin kendi yuvasına konan ikon ise nasıl yapıldıysa o boyuttadır.

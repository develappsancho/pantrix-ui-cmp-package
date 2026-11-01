# Icon Button

Yalnızca bir ikondan oluşan düğme: kapat, yenile, ara. Karedir, aynı boyuttaki bir `PantrixButton` kadar yüksektir ve varsayılan olarak tam yuvarlaktır. Bir etiketi olmadığı için ne yaptığını `contentDescription` söyler.

- `PantrixIconButton` (`com.pantrixui.components.elements.iconbutton`, `com.pantrixui:components`): Yalnızca bir ikondan oluşan düğme, düğmenin türleri ve boyutlarıyla; içerik açıklaması, ekran okuyucuya eylemin adını söyler. Anahtar sözcükler: ikon düğmesi, simge düğmesi, kapat düğmesi, araç çubuğu düğmesi, ikonlu eylem.

## Özellikler

- **Altı varyant.** `variant` düğmenin renklerini seçer: `PantrixButton`'ın varyantlarıdır. Varsayılanı `ButtonVariant.Text`'tir: yüzeyi yoktur, bir araç çubuğundaki işler içindir.
- **Beş boyut.** `size` düğmenin kenarını ve ikonunun boyutunu birlikte seçer: düğme 24dp'den 56dp'ye, ikonu 16dp'den 32dp'ye.
- **Dokunma hedefi.** Düğmenin çevresinde platformun en küçük dokunma hedefi kadar yer ayrılır: küçük çizilen düğmeye de parmakla basılır.
- **Şekil.** Her platformda tam yuvarlaktır; `shape` temanın şekillerinden birini ya da herhangi bir `Shape`'i verir.
- **Açıklama.** `contentDescription` ekran okuyucunun okuduğu addır ve işi söyler, ikonu değil: "Kapat", "çarpı" değil.
- **Açıklamasız düğme.** Null yalnızca, ekran okuyucunun ve klavyenin zaten ulaştığı bir şeyin yaptığını yineleyen düğmeye verilir. Öyle bir düğme okuyucudan gizlenir ve klavyeyle üstünde durulmaz; fare ve parmak ona yine basar.
- **Kendi içeriği.** İkon yerine içerik alan ikinci bir `PantrixIconButton` vardır: rozetli bir ikon, hareketli bir ikon. Okuyucu yalnızca açıklamayı duyar.
- **Renkler.** `colors` varsayılan olarak varyantın `primary` rolündeki renkleridir, `Destructive`'te `danger` rolündeki; `PantrixColor.buttonColors(variant)` başka bir rolde, `ButtonColors` tamamen kendi renginde verir.
- **Devre dışı.** `enabled = false` düğmeyi soluk çizer ve düğme basış almaz. Dolgusu olmayan varyant devre dışıyken de dolgusuz kalır.

## Kullanım

### Close

```kotlin
PantrixIconButton(
    imageVector = PantrixIcons.Close,
    contentDescription = PantrixTheme.strings.close,
    onClick = onClose,
    tagKey = "close"
)
```

### Soft, in a toolbar

```kotlin
PantrixIconButton(
    imageVector = PantrixIcons.Check,
    contentDescription = stringResource(Res.string.confirm),
    onClick = onConfirm,
    variant = ButtonVariant.Soft,
    size = ButtonSize.Small,
    tagKey = "confirm"
)
```

## Örnekler

### En yalın hâli

En az yazılan hâli: bir ikon, ne yaptığını söyleyen bir açıklama ve basılınca olacak iş. Varyantı `Text`, boyutu `Medium`'dur: dolgusuz, 40dp'lik yuvarlak bir düğme.

Düğmeye bas: altındaki satır kaç kez basıldığını söyler. Dolgusu olmadığı için düğmenin yuvarlağı basılıyken ve klavye odağı üstündeyken görünür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var refreshed by rememberSaveable { mutableIntStateOf(0) }
PantrixIconButton(
    imageVector = PantrixIcons.Refresh,
    contentDescription = "Yenile",
    onClick = { refreshed += 1 },
    tagKey = "refresh"
)
PantrixText(
    text = "$refreshed kez yenilendi",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "refreshed"
)
```

### Varyantlar

`variant` düğmenin renklerini seçer; altısı da `PantrixButton`'ın varyantlarıdır. `Solid` ekrandaki ana iştir, `Outline`, `Soft` ve `Subtle` ikincil işlerdir, `Destructive` geri alınamayan işi söyler.

Varsayılan `Text`'tir: yüzeyi yoktur, yalnızca ikonu çizilir. Bir araç çubuğundaki işler içindir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    ButtonVariant.entries.forEach { variant ->
        PantrixIconButton(
            imageVector = PantrixIcons.Star,
            contentDescription = "${variant.name} varyantında düğme",
            onClick = {},
            variant = variant,
            tagKey = "variant_${variant.name}"
        )
    }
}
```

### Boyutlar

`size` beş boyuttan birini seçer: düğme 24, 32, 40, 48 ve 56 dp'lik bir karedir, ikonu 16, 20, 24, 28 ve 32 dp. Varsayılan `Medium`'dur. Aynı boyuttaki bir `PantrixButton` ile yan yana durduğunda ikisi aynı yüksekliktedir.

Küçük düğmelerin çevresindeki boşluk dokunma hedefidir: düğme küçük çizilir ama platformun en küçük dokunma hedefi kadar yer tutar. Bu yer Android'de 48dp, iOS'ta 44dp, fareyle kullanılan masaüstünde ve web'de 32dp'dir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    ButtonSize.entries.forEach { size ->
        PantrixIconButton(
            imageVector = PantrixIcons.Plus,
            contentDescription = "${size.name} boyutunda düğme",
            onClick = {},
            variant = ButtonVariant.Soft,
            size = size,
            tagKey = "size_${size.name}"
        )
    }
}
```

### Şekil ve stil

İkon düğmesi her platformda tam yuvarlaktır. `shape` onu değiştirir: ikinci düğme temanın orta yuvarlaklığında (`shapes.md`), üçüncüsü köşeli (`shapes.none`).

`style` düğmenin ölçülerini değiştirir: ikon düğmesi `ButtonStyle`'ın yalnızca boyutlarını okur. Son düğme yine `Medium`'dur, ama ikonu 24dp yerine 16dp çizildi. Yalnızca verilen alan değişir, gerisi temanın stilinden gelir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonSizeStyle
import com.pantrixui.components.elements.button.ButtonStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Tam yuvarlak düğme",
        onClick = {},
        variant = ButtonVariant.Soft,
        tagKey = "pill"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Az yuvarlak düğme",
        onClick = {},
        variant = ButtonVariant.Soft,
        shape = PantrixTheme.shapes.md,
        tagKey = "rounded"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Köşeli düğme",
        onClick = {},
        variant = ButtonVariant.Soft,
        shape = PantrixTheme.shapes.none,
        tagKey = "square"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Folder,
        contentDescription = "Küçük ikonlu düğme",
        onClick = {},
        variant = ButtonVariant.Soft,
        style = ButtonStyle(medium = ButtonSizeStyle(iconSize = 16.dp)),
        tagKey = "small_icon"
    )
}
```

### Devre dışı

`enabled = false` düğmeyi soluk çizer ve düğme basış almaz. Dolgusu olan varyant temanın devre dışı dolgusunu alır; dolgusu olmayan `Text` ve `Outline` devre dışıyken de dolgusuz kalır, gri bir şekle dönüşmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    listOf(ButtonVariant.Text, ButtonVariant.Outline, ButtonVariant.Soft, ButtonVariant.Solid).forEach { variant ->
        PantrixIconButton(
            imageVector = PantrixIcons.Calendar,
            contentDescription = "Takvime ekle",
            onClick = {},
            variant = variant,
            enabled = false,
            tagKey = "disabled_${variant.name}"
        )
    }
}
```

### Başka bir rolde ve kendi renginde

Bir varyantın renkleri temanın `primary` rolünden gelir, `Destructive`'inkiler `danger` rolünden. `PantrixColor.buttonColors(variant)` aynı varyantı başka bir rolde verir: ilk iki düğme `success` ve `danger` rolünde.

Son düğmenin rengi temanın hiçbir rolünde yok: `ButtonColors` dolguyu ve ikonun rengini doğrudan alır. İkon rengi ayrıca verilmez: düğmenin içerik rengini kendiliğinden alır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val own = ownColors()
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixIconButton(
        imageVector = PantrixIcons.Check,
        contentDescription = "Onayla",
        onClick = {},
        colors = colors.success.buttonColors(ButtonVariant.Soft),
        tagKey = "approve"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Close,
        contentDescription = "Reddet",
        onClick = {},
        colors = colors.danger.buttonColors(ButtonVariant.Outline),
        tagKey = "reject"
    )
    PantrixIconButton(
        imageVector = PantrixIcons.Star,
        contentDescription = "Koleksiyona ekle",
        onClick = {},
        colors = ButtonColors(container = own.color, content = own.onColor),
        tagKey = "own_colors"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi içeriği: rozetli ikon

İkon yerine içerik alan `PantrixIconButton`: burada köşesinde rozet olan bir ikon. İçerik düğmenin içerik rengiyle çizilir.

Düğmenin içindekiler, açıklamanın söylediği şeyin resmidir: ekran okuyucu yalnızca açıklamayı duyar. Bu yüzden rozetin sayısı açıklamaya yazılır, "Gelen kutusu, 3 okunmamış"; rozetin kendisi okunmaz. "Yeni mesaj" sayıyı artırır, ikon düğmesine basmak sıfırlar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var unread by rememberSaveable { mutableIntStateOf(3) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIconButton(
        contentDescription = if (unread > 0) "Gelen kutusu, $unread okunmamış" else "Gelen kutusu",
        onClick = { unread = 0 },
        tagKey = "inbox"
    ) {
        PantrixBadgedBox(badge = { if (unread > 0) PantrixBadge(count = unread) }) {
            PantrixIcon(imageVector = PantrixIcons.Inbox, contentDescription = null)
        }
    }
    PantrixButton(
        text = "Yeni mesaj",
        onClick = { unread += 1 },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "new_message"
    )
}
```

### Açıklaması olmayan düğme

`contentDescription = null` yalnızca, başka bir şeyin zaten yaptığını yineleyen düğmeye verilir. Burada kartın tamamı basılır ve siparişi açar; sonundaki ok aynı işi yapar ve yalnızca gözle görene bir işarettir.

Böyle bir düğme ekran okuyucudan gizlenir ve klavyeyle üstünde durulmaz: okuyucunun hiç okumayacağı bir yerde odağın durması, hiç durmamasından kötüdür. Fare ve parmak ona yine basar. Bir işe giden tek yol olan düğmenin her zaman bir açıklaması olur.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var opened by rememberSaveable { mutableIntStateOf(0) }
PantrixCard(
    modifier = Modifier.widthIn(max = 360.dp),
    variant = CardVariant.Outlined,
    onClick = { opened += 1 },
    tagKey = "order"
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = "Sipariş 8F2A-19C4", style = PantrixTheme.typography.callout)
            PantrixText(text = "Yarın teslim edilecek", color = PantrixTheme.colors.textSecondary)
        }
        PantrixIconButton(
            imageVector = PantrixIcons.ChevronForward,
            contentDescription = null,
            onClick = { opened += 1 },
            tagKey = "open_order"
        )
    }
}
PantrixText(
    text = "Sipariş $opened kez açıldı",
    color = PantrixTheme.colors.textSecondary,
    tagKey = "order_opened"
)
```

## API

### PantrixIconButton

`import com.pantrixui.components.elements.iconbutton.PantrixIconButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixIconButton(
    imageVector: ImageVector,
    contentDescription: String?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Text,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    shape: Shape = PantrixTheme.shapes.full,
    colors: ButtonColors = variant.colors(),
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    style: ButtonStyle? = null
)
```

Yalnızca bir ikon gösteren düğme: karedir, `size` boyutundaki bir düğme kadar yüksektir, varsayılan olarak yuvarlaktır ve çevresinde platformun en küçük dokunma hedefi kadar yer ayrılır. Renklerini `variant` seçer. Varsayılan olan `ButtonVariant.Text`'in, devre dışı olsun olmasın, dolgusu yoktur. `contentDescription` ekran okuyucu için işi adlandırır: "X" değil, "Kapat". Düğmenin üstündeki imleç onun üstüne ikonunun renginden hafif bir örtü serer, basış daha güçlüsünü.

Null yalnızca, ekran okuyucunun ve klavyenin zaten ulaştığı bir şeyin yaptığını yineleyen düğmeye verilir: tamamına basılan bir satırın sonundaki ok gibi. Böyle bir düğme ekran okuyucudan gizlenir ve klavye de üstünde durmaz, çünkü odak hiç duyurulmayan bir şeyin üstüne gelirdi. Fare ve parmak ona yine basar. Bir işe giden tek yol olan düğmenin her zaman bir açıklaması olur.

Parametreler:

- `imageVector: ImageVector`: düğmenin gösterdiği ikon.
- `contentDescription: String?`
- `onClick: () -> Unit`: bir basışın yaptığı.
- `modifier: Modifier`: düğmenin modifier'ı.
- `variant: ButtonVariant`
- `size: ButtonSize`
- `enabled: Boolean`: düğmeye basılıp basılamayacağı: basılamayan düğme devre dışı renklerle çizilir ve hiçbir şey yapmaz.
- `shape: Shape`: düğmenin köşeleri: başka bir şey söylenmedikçe tam yuvarlak.
- `colors: ButtonColors`: bu çağrının kendi renkleri, `variant`'ınkilerin yerine.
- `tagKey: String?`: düğmenin otomasyon anahtarı: düğme `IconButton_<tagKey>`'dır, anahtar yoksa çağrıldığı yerden bir anahtar alır. Görünen metin hiçbir zaman anahtar olmaz.
- `interactionSource: MutableInteractionSource?`: düğmenin etkileşimleri, dışarı taşınmış: odağı, üstündeki işaretçi ve basışları. Bu null olduğunda kendi kaynağını tutar.
- `style: ButtonStyle?`: bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar değişir.

### PantrixIconButton

`import com.pantrixui.components.elements.iconbutton.PantrixIconButton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixIconButton(
    contentDescription: String?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Text,
    size: ButtonSize = ButtonSize.Medium,
    enabled: Boolean = true,
    shape: Shape = PantrixTheme.shapes.full,
    colors: ButtonColors = variant.colors(),
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    style: ButtonStyle? = null,
    content: @Composable () -> Unit
)
```

Bir `ImageVector` yerine herhangi bir `content` alan `PantrixIconButton`: hareketli bir ikon ya da rozetli bir ikon.

İçerik, `contentDescription`'ın söylediği şeyin resmidir ve ekran okuyucu yalnızca açıklamayı duyar: bir rozetin sayısı rozete değil açıklamaya yazılır, "Gelen kutusu, 3 okunmamış".

Parametreler:

- `contentDescription: String?`
- `onClick: () -> Unit`: bir basışın yaptığı.
- `modifier: Modifier`: düğmenin modifier'ı.
- `variant: ButtonVariant`: düğmenin renkleri: başka bir şey söylenmedikçe kabı olmayan `ButtonVariant.Text`.
- `size: ButtonSize`: düğmenin boyutu: `size` boyundaki bir düğme ne kadar uzunsa o kadar uzun ve o kadar geniş.
- `enabled: Boolean`: düğmeye basılıp basılamayacağı: basılamayan düğme devre dışı renklerle çizilir ve hiçbir şey yapmaz.
- `shape: Shape`: düğmenin köşeleri: başka bir şey söylenmedikçe tam yuvarlak.
- `colors: ButtonColors`: bu çağrının kendi renkleri, `variant`'ınkilerin yerine.
- `tagKey: String?`: düğmenin otomasyon anahtarı: düğme `IconButton_<tagKey>`'dır, anahtar yoksa çağrıldığı yerden bir anahtar alır. Görünen metin hiçbir zaman anahtar olmaz.
- `interactionSource: MutableInteractionSource?`: düğmenin etkileşimleri, dışarı taşınmış: odağı, üstündeki işaretçi ve basışları. Bu null olduğunda kendi kaynağını tutar.
- `style: ButtonStyle?`: bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar değişir.
- `content: @Composable () -> Unit`

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

# Button Group

Aynı önemde birkaç eylem, tek bir kontrol gibi çizilmiş ya da aralarında aynı boşlukla yan yana: bir araç çubuğu, bir sayaç, bir dialog'un altındaki iki düğme.

Grup hiçbir şey seçmez ve hiçbir düğmesi seçili kalmaz. Birkaç seçenekten birinin seçili kaldığı yerde segment düğmesi kullanılır: hangisinin seçili olduğunu o söyler.

- `PantrixButtonGroup` (`com.pantrixui.components.elements.buttongroup`, `com.pantrixui:components`): Aynı önemde birkaç eylem tek bir kontrol olarak: bitişik, tek şekil ve tek kenarla, ya da ayrık, bir satırda ya da bir sütunda. Anahtar sözcükler: düğme grubu, araç çubuğu, bölünmüş düğme, sayaç, bitişik düğmeler, eylem grubu.

## Özellikler

- **Bitişik ya da ayrık.** `attached` açıkken, ki varsayılanı budur, düğmeler birbirine değer: grubun tek bir şekli, çevresinde tek bir kenarı ve düğmelerin arasında birer çizgisi vardır. Kapalıyken aynı düğmeler aralarında bir boşlukla, her biri kendi şekli ve kenarıyla durur.
- **Satır ya da sütun.** `orientation` düğmeleri yan yana ya da alt alta dizer. Sütunda hepsi en geniş olan kadar geniştir.
- **Genişlik.** Satırda her düğme söylediği kadar geniştir. Dar bir yerde kısa olanlar bütün kalır, uzun olanlar kalan yeri paylaşır; `equalWidth` ile hepsi grubun genişliğini eşit paylaşır.
- **Etiketli ya da yalnızca ikon.** `GroupButton`'ın iki kurucusu vardır: bir etiket, önünde bir ikonla ya da ikonsuz; ya da yalnızca bir ikon. Yalnızca ikon olan düğmede `contentDescription` zorunludur.
- **Her düğme bir düğmedir.** Tab her birinde durur, ekran okuyucu her birinin adını ve rolünü söyler, her biri kendi odak halkasını çizer ve kendi basışını bildirir.
- **Düğmenin kendi hâli.** `enabled`, `loading`, `variant` ve `colors` her `GroupButton`'da ayrı verilebilir. Grubun `variant`, `size`, `colors` ve `enabled` değerleri bütün düğmeler içindir.
- **Dokunma hedefi.** Bitişik grup platformun dokunma hedefini bir kez, kendi çevresinde ayırır; düğmelerinin her biri grup boyunca en az o kadar uzundur.
- **Otomasyon.** Düğmeler grubun test etiketi içinde adlandırılır: `ButtonGroup_clipboard.Button_copy`. Yalnızca ikon olan düğme `IconButton` olarak, anahtarı olmayan düğme sırasıyla etiketlenir.

## Kullanım

### Attached actions in a toolbar

```kotlin
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = stringResource(Res.string.copy), onClick = onCopy, tagKey = "copy"),
        GroupButton(text = stringResource(Res.string.paste), onClick = onPaste, tagKey = "paste"),
        GroupButton(
            icon = PantrixIcons.MoreHorizontal,
            contentDescription = stringResource(Res.string.more),
            onClick = onMore,
            tagKey = "more"
        )
    ),
    tagKey = "clipboard"
)
```

### The actions under a dialog, sharing its width

```kotlin
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = stringResource(Res.string.cancel), onClick = onDismiss, tagKey = "cancel"),
        GroupButton(
            text = stringResource(Res.string.delete),
            onClick = onDelete,
            loading = deleting,
            variant = ButtonVariant.Destructive,
            tagKey = "delete"
        )
    ),
    attached = false,
    equalWidth = true,
    tagKey = "footer"
)
```

### A column of actions, in a role's colours

```kotlin
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = stringResource(Res.string.approve), onClick = onApprove, tagKey = "approve"),
        GroupButton(text = stringResource(Res.string.approve_all), onClick = onApproveAll, tagKey = "approve_all")
    ),
    orientation = Orientation.Vertical,
    colors = PantrixTheme.colors.success.buttonColors(ButtonVariant.Outline),
    tagKey = "review"
)
```

## Örnekler

### Bitişik bir araç çubuğu

En az yazılan hâli: bir düğme listesi. Grup bitişiktir ve varyantı `Outline`'dır: çevresinde tek kenar, düğmelerin arasında birer çizgi vardır, köşeler yalnızca grubun iki ucundadır.

İlk düğmenin etiketinin önünde bir ikon var; sonuncusu yalnızca bir ikondur ve ne yaptığını `contentDescription` ile söyler. Her düğme kendi başına bir düğmedir: Tab her birinde durur, ekran okuyucu her birinin adını söyler. Bir düğmeye bas: alttaki satır son eylemi söyler.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var last by rememberSaveable { mutableStateOf<String?>(null) }
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Kopyala", onClick = { last = "Kopyala" }, icon = PantrixIcons.Copy, tagKey = "copy"),
        GroupButton(text = "Yapıştır", onClick = { last = "Yapıştır" }, tagKey = "paste"),
        GroupButton(
            icon = PantrixIcons.MoreHorizontal,
            contentDescription = "Diğer eylemler",
            onClick = { last = "Diğer eylemler" },
            tagKey = "more"
        )
    ),
    tagKey = "clipboard"
)
PantrixText(
    text = last?.let { "Son eylem: $it" } ?: "Henüz bir eyleme basılmadı",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "clipboard_result"
)
```

### Yalnızca ikonlardan bir sayaç

Yalnızca ikonlardan oluşan bir sayaç, `Soft` varyantında. Yalnızca ikon olan düğme `GroupButton`'ın ikinci kurucusuyla yazılır ve `contentDescription` orada zorunludur: bir düğme hiçbir zaman süs değildir.

`enabled` her düğmede ayrı verilir: alt sınırda eksi düğmesi basılamaz, artı basılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var count by rememberSaveable { mutableIntStateOf(1) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(
                icon = PantrixIcons.Minus,
                contentDescription = "Azalt",
                onClick = { count-- },
                enabled = count > 1,
                tagKey = "minus"
            ),
            GroupButton(
                icon = PantrixIcons.Plus,
                contentDescription = "Artır",
                onClick = { count++ },
                tagKey = "plus"
            )
        ),
        variant = ButtonVariant.Soft,
        tagKey = "stepper"
    )
    PantrixText(text = "$count adet", tagKey = "stepper_count")
}
```

### Açıklamasıyla okunan etiketler

Yazı boyutunu değiştiren iki düğme. Etiketleri "A-" ve "A+": görene yeter, ama ekran okuyucuda bir anlam taşımaz. Bu yüzden her birinin bir `contentDescription`'ı vardır ve okuyucu etiketi değil yalnızca açıklamayı okur: "Yazıyı küçült", "Yazıyı büyüt".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var percent by rememberSaveable { mutableIntStateOf(100) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(
                text = "A-",
                onClick = { percent -= 10 },
                enabled = percent > 80,
                contentDescription = "Yazıyı küçült",
                tagKey = "smaller"
            ),
            GroupButton(
                text = "A+",
                onClick = { percent += 10 },
                enabled = percent < 150,
                contentDescription = "Yazıyı büyüt",
                tagKey = "larger"
            )
        ),
        tagKey = "text_size"
    )
    PantrixText(text = "Yazı boyutu: %$percent", tagKey = "text_size_percent")
}
```

### Varyantlar

`variant` kendi varyantı olmayan her düğmenin varyantıdır; verilmezse `Outline`. Kenarı olan varyantlarda, `Outline` ve `Subtle`'da, grubun çevresinde tek bir kenar vardır ve aradaki çizgiler o renktedir. Kenarı olmayanlarda yalnızca düğmelerin arasındaki çizgiler çizilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

listOf(
    ButtonVariant.Outline,
    ButtonVariant.Subtle,
    ButtonVariant.Soft,
    ButtonVariant.Solid,
    ButtonVariant.Text
).forEach { variant ->
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(text = "Önceki", onClick = {}, tagKey = "previous"),
            GroupButton(text = "Sonraki", onClick = {}, tagKey = "next")
        ),
        variant = variant,
        tagKey = "variant_${variant.name}"
    )
}
```

### Boyutlar

`size` gruptaki bütün düğmelerin boyutudur, böylece hepsi aynı hizada durur: burada `Small`, `Medium` ve `Large`. Verilmezse `Medium`'dur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

listOf(ButtonSize.Small, ButtonSize.Medium, ButtonSize.Large).forEach { size ->
    PantrixButtonGroup(
        buttons = listOf(
            GroupButton(text = "Kes", onClick = {}, tagKey = "cut"),
            GroupButton(text = "Kopyala", onClick = {}, tagKey = "copy"),
            GroupButton(text = "Yapıştır", onClick = {}, tagKey = "paste")
        ),
        size = size,
        tagKey = "size_${size.name}"
    )
}
```

### Alt alta eylemler

`orientation = Orientation.Vertical` düğmeleri alt alta dizer: hepsi en geniş olan kadar geniştir. Bitişik bir sütunda köşeler grubun üstünde ve altındadır, çizgiler düğmelerin arasında yatay durur.

Silen eylem kendi varyantını taşır: `GroupButton`'ın `variant`'ı o düğmede grubunkinin yerine geçer.

```kotlin
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Yeniden adlandır", onClick = {}, tagKey = "rename"),
        GroupButton(text = "Çoğalt", onClick = {}, tagKey = "duplicate"),
        GroupButton(text = "Sil", onClick = {}, variant = ButtonVariant.Destructive, tagKey = "delete")
    ),
    orientation = Orientation.Vertical,
    tagKey = "record"
)
```

### Ayrık ve eşit genişlikte

Bir dialog'un altındaki iki eylem. `attached = false` ile ayrık dururlar: her biri kendi şekli ve kenarıyla, stilin boşluğu kadar arayla. `equalWidth = true` ile grubun genişliğini eşit paylaşırlar; grup burada en fazla 360dp genişliğindedir.

`loading` düğmenin kendi hâlidir: "Sil" basılınca kısa bir süre yükleniyor görünür ve o sırada basılamaz. "Vazgeç" yüklemeyi durdurur.

```kotlin
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import kotlinx.coroutines.delay

var deleting by remember { mutableStateOf(false) }
LaunchedEffect(deleting) {
    if (deleting) {
        delay(1500)
        deleting = false
    }
}
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Vazgeç", onClick = { deleting = false }, tagKey = "cancel"),
        GroupButton(
            text = "Sil",
            onClick = { deleting = true },
            loading = deleting,
            variant = ButtonVariant.Destructive,
            tagKey = "delete"
        )
    ),
    modifier = Modifier.widthIn(max = 360.dp),
    attached = false,
    equalWidth = true,
    tagKey = "footer"
)
```

### Dar bir yerde

Aynı üç düğme, 280dp'lik bir yerde iki kez. Satırda her düğme söylediği kadar geniştir; yer yetmeyince kısa olanlar bütün kalır ve uzun olan kalan yeri alır, etiketi üç noktayla kesilir.

İkinci grupta `equalWidth = true`: üç düğme genişliği eşit paylaşır, uzun etiket daha erken kesilir.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Kaydet", onClick = {}, tagKey = "save"),
        GroupButton(text = "Kaydetmeden çık ve taslağı sil", onClick = {}, tagKey = "discard"),
        GroupButton(text = "Vazgeç", onClick = {}, tagKey = "cancel")
    ),
    modifier = Modifier.width(280.dp),
    tagKey = "narrow"
)
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Kaydet", onClick = {}, tagKey = "save"),
        GroupButton(text = "Kaydetmeden çık ve taslağı sil", onClick = {}, tagKey = "discard"),
        GroupButton(text = "Vazgeç", onClick = {}, tagKey = "cancel")
    ),
    modifier = Modifier.width(280.dp),
    equalWidth = true,
    tagKey = "narrow_equal"
)
```

### Bir rolün renklerinde

`colors` grubun düğmelerini bir varyantın `primary` renkleri yerine verilen renklerle çizer. Burada `PantrixColor.buttonColors(ButtonVariant.Outline)` ile `success` rolünün çerçeveli düğme renkleri verildi. Bitişik grupta kenarın rengi grubun tek kenarının ve aradaki çizgilerin rengidir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.buttonColors
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Onayla", onClick = {}, icon = PantrixIcons.Check, tagKey = "approve"),
        GroupButton(text = "Tümünü onayla", onClick = {}, tagKey = "approve_all")
    ),
    colors = PantrixTheme.colors.success.buttonColors(ButtonVariant.Outline),
    tagKey = "review"
)
```

### Kendi renginde

İlk grubun rengi temanın hiçbir rolünde yok: `ButtonColors` dolguyu, içeriğin rengini ve kenarı doğrudan alır.

İkinci grupta yalnızca bir düğmenin kendi rengi var. `GroupButton`'ın `colors`'ı o düğmede grubun renklerinin ve kendi varyantının yerine geçer; düğme yine grubun kenarının içinde durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.foundation.icons.PantrixIcons

val own = ownColors()
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Koleksiyona ekle", onClick = {}, icon = PantrixIcons.Star, tagKey = "collect"),
        GroupButton(text = "Paylaş", onClick = {}, tagKey = "share")
    ),
    colors = ButtonColors(container = own.container, content = own.onContainer, border = own.color),
    tagKey = "own_colors"
)
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Düzenle", onClick = {}, tagKey = "edit"),
        GroupButton(
            text = "Öne çıkar",
            onClick = {},
            colors = ButtonColors(container = own.color, content = own.onColor),
            tagKey = "feature"
        )
    ),
    tagKey = "one_own_button"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Şekil ve stil

`shape` bitişik grupta grubun bütününün şeklidir: her düğme yalnızca kendi ucundaki köşeleri taşır. Ayrık grupta her düğmenin şeklidir. İlk grup temanın az yuvarlak şekliyle (`shapes.sm`) çizildi.

`style` grubun geometrisini değiştirir: ikinci grupta `ButtonGroupStyle(gap = 16.dp)` ayrık düğmelerin arasını açar. Düğmelerin boyutları grubun stilinden değil, düğmenin kendi stilinden gelir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.buttongroup.ButtonGroupStyle
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup
import com.pantrixui.foundation.theme.PantrixTheme

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Yazdır", onClick = {}, tagKey = "print"),
        GroupButton(text = "Dışa aktar", onClick = {}, tagKey = "export"),
        GroupButton(text = "Paylaş", onClick = {}, tagKey = "share")
    ),
    shape = PantrixTheme.shapes.sm,
    tagKey = "less_round"
)
PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Geri", onClick = {}, tagKey = "back"),
        GroupButton(text = "İleri", onClick = {}, tagKey = "forward")
    ),
    attached = false,
    style = ButtonGroupStyle(gap = 16.dp),
    tagKey = "wide_gap"
)
```

### Devre dışı grup

Grubun `enabled = false` değeri bütün düğmeleri devre dışı bırakır: hiçbiri basış almaz, etiketleri ve grubun kenarı soluk çizilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.buttongroup.GroupButton
import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup

PantrixButtonGroup(
    buttons = listOf(
        GroupButton(text = "Geri al", onClick = {}, tagKey = "undo"),
        GroupButton(text = "Yinele", onClick = {}, tagKey = "redo")
    ),
    enabled = false,
    tagKey = "locked"
)
```

## API

### PantrixButtonGroup

`import com.pantrixui.components.elements.buttongroup.PantrixButtonGroup`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixButtonGroup(
    buttons: List<GroupButton>,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Outline,
    size: ButtonSize = ButtonSize.Medium,
    orientation: Orientation = Orientation.Horizontal,
    attached: Boolean = true,
    equalWidth: Boolean = false,
    enabled: Boolean = true,
    style: ButtonGroupStyle? = null,
    shape: Shape = PantrixTheme.style(ButtonGroupStyle, style).shape.toShape(),
    colors: ButtonColors = variant.colors(),
    tagKey: String? = null
)
```

Bir düğme grubu: aynı önemde birkaç eylem, tek bir kontrol olarak çizilmiş ya da aralarında aynı boşlukla ayrı duran.

Bitişikken, ki aksi söylenmedikçe öyledir, düğmeler birbirine değer: grubun tek bir şekli vardır ve her düğme bu şeklin kendi ucundaki köşelerini taşır. Renklerinde kenar varsa grubun çevresinde tek bir kenar vardır. Her iki düğmenin arasında da bir çizgi durur. Ayrıkken aynı düğmeler aralarında bir boşlukla, her biri kendi şekli ve kenarıyla durur: bir dialog'un altındaki eylemler gibi.

Her düğme, herhangi bir düğme gibi bir düğmedir: Tab için bir duraktır, ekran okuyucuya kendi adını ve rolünü söyler, kendi odak halkasını gösterir ve kendi basışını bir `Button` ya da `IconButton` olayı olarak bildirir. Grup hiçbir şey bildirmez ve hiçbir şey seçmez: hiçbir düğme seçili kalmaz. Birkaç seçenekten birinin seçili kaldığı bir seçim için segment düğmesi kullanılır: hangisinin seçili olduğunu o söyler.

Satırda düğmeler söyledikleri kadar geniştir. Buna yetmeyecek kadar dar bir yerde kısa olanlar bütün kalır, uzun olanlar kalan yeri paylaşır. `equalWidth` ile hepsi gruba verilen genişliği paylaşır. Sütunda hepsi en geniş olan kadar geniştir.

Bitişik grup platformun dokunma hedefini kendi çevresinde ayırır ve düğmelerinin her biri grup boyunca en az o kadar uzundur: komşularının yanında bir düğmenin, kendisine ulaşılacak ayrı bir yeri yoktur.

Parametreler:

- `buttons: List<GroupButton>`: Düğmeler, sırasıyla. Boş liste hiçbir şey çizmez.
- `modifier: Modifier`: Grubun modifier'ı. Bitişik bir grubun ayırdığı dokunma hedefinin dışında kalır.
- `variant: ButtonVariant`: Kendi varyantı olmayan her düğmenin varyantı.
- `size: ButtonSize`: Bütün düğmelerin boyutu: böylece hepsi aynı hizada durur.
- `orientation: Orientation`: Bir satır için `Orientation.Horizontal`, eylemlerden bir sütun için `Orientation.Vertical`.
- `attached: Boolean`: Düğmeler true ile tek bir kontrol olarak çizilir, false ile stilin boşluğu kadar arayla durur.
- `equalWidth: Boolean`: Bir satırın her düğmesine true ile gruba verilen genişlikten eşit pay düşer. Sonu olmayan bir yerde her düğme en geniş olanın genişliğini alır. Bir sütunun düğmeleri, bu ne derse desin, birbiriyle aynı genişliktedir.
- `enabled: Boolean`: Bütün düğmeler false ile devre dışı kalır.
- `style: ButtonGroupStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir. Düğmeler boyutlarını yine düğmenin kendi stilinden alır.
- `shape: Shape`: Grubun şekli: bitişikken grubun bütününün, ayrıkken her düğmenin şekli.
- `colors: ButtonColors`: Düğmelerin boyandığı renkler: kendi renkleri de kendi varyantı da olmayan her düğme için. Bitişikken kenarın rengi, grubun tek kenarının ve düğmelerin arasındaki çizgilerin rengidir.
- `tagKey: String?`: Grubun otomasyon anahtarı: grup `ButtonGroup_<tagKey>` etiketini taşır ve düğmeleri onun içinde adlandırılır, `ButtonGroup_<tagKey>.Button_<key>`. Böylece aynı eylemleri taşıyan iki grup birbirinden ayırt edilir.

### GroupButton

`import com.pantrixui.components.elements.buttongroup.GroupButton`, `com.pantrixui:components` içinden

```kotlin
class GroupButton
```

`PantrixButtonGroup`'un bir düğmesi: ne söylediği, ne yaptığı ve otomasyon için bir anahtar.

Ya bir etikettir, önünde bir ikonla ya da ikonsuz, ya da yalnızca bir ikondur ve o zaman ne yaptığının ayrıca söylenmesi gerekir: her birinin kendi kurucusu vardır.

Başka bir kurucu:

```kotlin
constructor(
    text: String,
    onClick: () -> Unit,
    icon: ImageVector? = null,
    enabled: Boolean = true,
    loading: Boolean = false,
    variant: ButtonVariant? = null,
    colors: ButtonColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null
)
```

Parametreleri:

- `text: String`
- `onClick: () -> Unit`
- `icon: ImageVector?`
- `enabled: Boolean`
- `loading: Boolean`
- `variant: ButtonVariant?`
- `colors: ButtonColors?`
- `contentDescription: String?`
- `tagKey: String?`

Başka bir kurucu:

```kotlin
constructor(
    icon: ImageVector,
    contentDescription: String,
    onClick: () -> Unit,
    enabled: Boolean = true,
    variant: ButtonVariant? = null,
    colors: ButtonColors? = null,
    tagKey: String? = null
)
```

A button that is an icon alone. `contentDescription` says what it does: a button is never decoration.

Parametreleri:

- `icon: ImageVector`: the icon the button is.
- `contentDescription: String`
- `onClick: () -> Unit`: called when the button is pressed.
- `enabled: Boolean`: whether the button can be pressed.
- `variant: ButtonVariant?`: the button's own variant, in place of the group's: the one action of a group that deletes.
- `colors: ButtonColors?`: the button's own colours, in place of the group's and of its own variant's.
- `tagKey: String?`: the button's automation key, the same in every language: the button is `Button_<tagKey>` or `IconButton_<tagKey>`, or `Button_<index>` and `IconButton_<index>` without one, inside the tag of a group that has a key: `ButtonGroup_clipboard.Button_copy`.

Üyeleri:

- `text: String?`: Etiket. Yalnızca ikon olan düğme için null.
- `icon: ImageVector?`: Etiketin önünde, etiketin renginde durur ya da etiketsiz bir düğmenin tamamıdır. İkon yoksa null.
- `contentDescription: String?`: Ekran okuyucunun düğme için söylediği. Yalnızca ikon olan düğmede adıdır: ikonun neye benzediği değil, "Daha fazla". Etiketli düğmede, etiket düğmenin ne yaptığını söylemiyorsa, bir "+" gibi, etiketin yerine okunandır. Adını etiketinden alan düğme için null.
- `onClick: () -> Unit`: Düğmeye basılınca çağrılır.
- `enabled: Boolean`: Düğmeye basılıp basılamadığı.
- `loading: Boolean`: Düğmenin, başlattığı iş sürerken ikonunun yerine bir spinner gösterip göstermediği. Spinner gösterirken basış almaz. Yalnızca ikon olan düğmede spinner yoktur.
- `variant: ButtonVariant?`: Düğmenin, grubun varyantı yerine geçen kendi varyantı: bir grubun silen tek eylemi için.
- `colors: ButtonColors?`: Düğmenin kendi renkleri: grubun renklerinin ve kendi varyantının renklerinin yerine geçer.
- `tagKey: String?`: Düğmenin otomasyon anahtarı, her dilde aynıdır: düğme `Button_<tagKey>` ya da `IconButton_<tagKey>`, anahtar verilmezse `Button_<index>` ya da `IconButton_<index>` olur ve anahtarı olan bir grubun etiketinin içinde durur: `ButtonGroup_clipboard.Button_copy`.

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

### ButtonGroupStyle

`import com.pantrixui.components.elements.buttongroup.ButtonGroupStyle`, `com.pantrixui:components` içinden

```kotlin
class ButtonGroupStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val dividerWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<ButtonGroupStyle>
```

`PantrixButtonGroup`'un geometrisi: grubun şekli, bitişik iki düğmenin arasındaki çizgi ve bitişik olmayan iki düğmenin arasındaki boşluk.

Şekil her platformda düğmenin kendi şeklidir, böylece bir grupla yanındaki bir düğmenin köşeleri aynı olur: Android'de, masaüstünde ve web'de bir hap, iOS'ta yuvarlak köşeli bir dikdörtgen. Bitişikken bu, grubun bütününün şeklidir ve her düğme onun kendi ucundaki köşelerini taşır. Ayrıkken her düğme şeklin tamamını taşır.

Yoğunluğu yalnızca boşluk izler, çünkü o düğmelerin arasındaki yerdir. Çizgi ve şekil izlemez.

Parametreler:

- `shape: ShapeSpec`: Grubun şekli: markanın şekil ölçeğinin bir basamağı ya da sabit bir şekil.
- `dividerWidth: Dp`: Bitişik iki düğmenin arasındaki çizginin kalınlığı.
- `gap: Dp`: Bitişik olmayan iki düğmenin arasındaki boşluk.

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

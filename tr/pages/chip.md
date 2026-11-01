# Chip

Çip küçük bir eylemdir, açılıp kapanan bir süzgeçtir, ya da kullanıcının eklediği ve geri çıkarabildiği bir öğedir: bir alıcı, bir etiket, uygulanmış bir süzgeç.

İki `PantrixChip` vardır. `onClick` alan bir eylemdir ya da yalnızca bir değeri gösterir, ve bir çıkarma düğmesi taşıyabilir. `selected` ve `onSelectedChange` alan bir süzgeçtir: açıktır ya da kapalıdır.

- `PantrixChip` (`com.pantrixui.components.elements.chip`, `com.pantrixui:components`): Küçük bir eylem, açık ya da kapalı bir süzgeç, ya da kaldırma düğmeli bir öğe; her platformun kendi ölçüleriyle. Anahtar sözcükler: çip, hap, süzgeç, filtre, kaldırılabilir etiket, seçim çipi.

## Özellikler

- **Eylem.** `onClick` verilen çip bir düğmedir ve adı etiketidir. `leadingIcon` etiketin önüne bir ikon koyar.
- **Süzgeç.** Açık süzgeç dolgulu çizilir ve ikonun yerinde bir onay işareti taşır: açık olduğunu yalnızca renk söylemez. Ekran okuyucu seçili ya da değil bir onay kutusu duyar. Çip kendiliğinden değişmez: `selected` ne diyorsa odur.
- **Çıkarma düğmesi.** `onRemove` çipin sonuna bir çarpı koyar: kendi başına bir hedeftir ve ekran okuyucu onu etiketle birlikte okur, "Ayşe Yılmaz öğesini kaldır". Çip kendini kaldırmaz; bunu `onRemove` yapar.
- **Yalnızca gösteren çip.** `onClick = null` verilen çip bir değeri gösterir, `onSelectedChange = null` verilen süzgeç salt okunurdur: basış ve odak almazlar, ama ekran okuyucuya adlarını yine söylerler.
- **Uzun etiket.** Yerine sığmayan etiket üç noktayla biter; ikon ve çarpı bütün kalır.
- **Devre dışı.** `enabled = false` çipi ve çarpısını basılamaz yapar; çip temanın devre dışı renkleriyle çizilir.
- **Renkler ve stil.** `colors` yalnızca verdiği renkleri, `style` yalnızca verdiği ölçüleri değiştirir.
- **Platform.** Android'de 32dp yüksekliğindedir ve köşeleri orta yuvarlaktır; iOS'ta 32dp'lik, masaüstünde ve web'de 30dp'lik bir haptır. Çevresinde platformun dokunma hedefi kadar yer ayrılır.
- **Otomasyon.** `tagKey` verilen çip `Chip_<tagKey>`, çarpısı `ChipRemove_<tagKey>` etiketini taşır. Bir basış `Chip` olayı olarak bildirilir ve olay etiketin metnini hiçbir zaman taşımaz.

## Kullanım

### A filter

```kotlin
var inStock by rememberSaveable { mutableStateOf(false) }
PantrixChip(
    label = stringResource(Res.string.in_stock),
    selected = inStock,
    onSelectedChange = { inStock = it },
    tagKey = "in_stock"
)
```

### Removable recipients

```kotlin
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    recipients.forEach { recipient ->
        PantrixChip(
            label = recipient.name,
            onClick = null,
            onRemove = { onRemoveRecipient(recipient) },
            tagKey = "recipient_" + recipient.id
        )
    }
}
```

### An action with an icon

```kotlin
PantrixChip(
    label = stringResource(Res.string.add_to_calendar),
    onClick = onAddToCalendar,
    leadingIcon = PantrixIcons.Calendar,
    tagKey = "add_to_calendar"
)
```

### A filter that is on in colours of its own

```kotlin
val success = PantrixTheme.colors.success
PantrixChip(
    label = stringResource(Res.string.in_stock),
    selected = inStock,
    onSelectedChange = { inStock = it },
    colors = ChipColors(selectedContainer = success.container, selectedContent = success.onContainer),
    tagKey = "in_stock"
)
```

## Örnekler

### Eylem çipi

İlk biçim: `onClick` alan çip basılınca bir iş yapan bir düğmedir ve adı etiketidir. En az yazılan hâli ilk çiptir: bir etiket ve bir `onClick`. İkincisinde `leadingIcon` etiketin önünde durur. Üçüncüsü `enabled = false` ile devre dışıdır: soluk çizilir ve basış almaz.

Bir çipe bas: altındaki satır en son hangisine basıldığını söyler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var last by rememberSaveable { mutableStateOf<String?>(null) }
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixChip(label = "Paylaş", onClick = { last = "Paylaş" }, tagKey = "share")
    PantrixChip(
        label = "Takvime ekle",
        onClick = { last = "Takvime ekle" },
        leadingIcon = PantrixIcons.Calendar,
        tagKey = "calendar"
    )
    PantrixChip(label = "Arşivle", onClick = { last = "Arşivle" }, enabled = false, tagKey = "archive")
}
PantrixText(
    text = last?.let { "Son eylem: $it" } ?: "Henüz bir eyleme basılmadı",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "last_action"
)
```

### Seçilebilir çip: süzgeçler

İkinci biçim: `selected` ve `onSelectedChange` alan çip açılıp kapanan bir süzgeçtir. Çip kendiliğinden bir şey değiştirmez: `onSelectedChange` kullanıcının istediği değeri bildirir, açık süzgeçlerin anahtarlarını burada ekranın durumu saklar.

Açık olan dolgulu çizilir ve başında bir onay işareti taşır; açık olduğu yalnızca renkten anlaşılmaz. Simgesi olan süzgeçte, "Favoriler"de, işaret simgenin yerini alır ve çipin genişliği değişmez. Süzgeçler yana kayan bir satırdadır; altındaki satır kaçının açık olduğunu söyler.

```kotlin
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.rememberScrollState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var on by rememberSaveable { mutableStateOf(listOf("stock")) }
Row(
    modifier = Modifier.horizontalScroll(rememberScrollState()),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    FILTERS.forEach { filter ->
        PantrixChip(
            label = filter.label,
            selected = filter.key in on,
            onSelectedChange = { selected -> on = if (selected) on + filter.key else on - filter.key },
            leadingIcon = filter.icon,
            tagKey = "filter_${filter.key}"
        )
    }
}
PantrixText(
    text = if (on.isEmpty()) "Süzgeç yok" else "${on.size} süzgeç açık",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "filters_on"
)

private class ChipFilter(
    val key: String,
    val label: String,
    val icon: ImageVector? = null
)

private val FILTERS = listOf(
    ChipFilter("stock", "Stokta"),
    ChipFilter("sale", "İndirimde"),
    ChipFilter("starred", "Favoriler", PantrixIcons.Star),
    ChipFilter("shipping", "Ücretsiz kargo"),
    ChipFilter("new", "Yeni gelenler"),
    ChipFilter("pickup", "Mağazadan teslim")
)
```

### Çıkarılabilen çipler: alıcılar

`onRemove` çipin sonuna bir çarpı koyar. Çarpı kendi başına bir düğmedir: ekran okuyucu "Ayşe Yılmaz öğesini kaldır" der, yani bir satır çarpı birbirinden ayırt edilir. Çip kendini kaldırmaz; alıcıyı listeden çıkaran buradaki koddur.

Çipin kendisine basmak alıcıyı açar, çarpıya basmak açmaz. Alıcılar satıra sığmayınca alt satıra geçer. "Geri getir" hepsini geri koyar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var kept by rememberSaveable { mutableStateOf(PEOPLE.map { it.key }) }
var opened by rememberSaveable { mutableStateOf<String?>(null) }
FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PEOPLE.filter { it.key in kept }.forEach { person ->
        PantrixChip(
            label = person.name,
            onClick = { opened = person.name },
            leadingIcon = PantrixIcons.Person,
            onRemove = {
                kept = kept - person.key
                if (opened == person.name) opened = null
            },
            tagKey = "recipient_${person.key}"
        )
    }
}
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixText(
        text = opened?.let { "Açılan: $it" } ?: "${kept.size} alıcı",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = "recipients"
    )
    PantrixButton(
        text = "Geri getir",
        onClick = { kept = PEOPLE.map { it.key } },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        enabled = kept.size < PEOPLE.size,
        tagKey = "restore"
    )
}

private class ChipRecipient(
    val key: String,
    val name: String
)

private val PEOPLE = listOf(
    ChipRecipient("ayse", "Ayşe Yılmaz"),
    ChipRecipient("ibrahim", "İbrahim Öztürk"),
    ChipRecipient("ilker", "İlker Kaya"),
    ChipRecipient("selin", "Selin Çağlar")
)
```

### Yalnızca gösteren çipler

Basılamayan iki çip. "Yalnızca üyeler" bir süzgeçtir ve `onSelectedChange = null` verildi: salt okunurdur, basış ve odak almaz, ama adını ve açık olduğunu ekran okuyucuya yine söyler. "Taslak" `onClick = null` ile yalnızca bir değeri gösterir: ekran okuyucu için tek bir öğedir.

İkisi de devre dışı değildir: kendi renkleriyle çizilirler, yalnızca basılacak bir şeyleri yoktur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixChip(label = "Yalnızca üyeler", selected = true, onSelectedChange = null, tagKey = "locked")
    PantrixChip(label = "Taslak", onClick = null, tagKey = "draft")
}
```

### Uzun etiket ve geniş çip

Yerine sığmayan etiket üç noktayla biter. İkon ve çarpı yerlerini önce alır, etikete kalan verilir: uzun etiket kısalır, simgesiyle çarpısı bütün kalır. İlk çip basılamaz ama çıkarılabilir: `onClick = null` verilen çip `onRemove` verilince çarpısını yine taşır.

İkinci çip gereğinden geniştir, 220dp: simgesi ve etiketi bir düğmedeki gibi ortada, çarpısı sonda durur.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.icons.PantrixIcons

PantrixChip(
    label = "Üçüncü çeyreğin kurula gönderildiği hâliyle raporları ve bütün ekleri",
    onClick = null,
    leadingIcon = PantrixIcons.Folder,
    onRemove = {},
    tagKey = "long"
)
PantrixChip(
    label = "Kotlin",
    onClick = null,
    modifier = Modifier.width(220.dp),
    leadingIcon = PantrixIcons.Star,
    onRemove = {},
    tagKey = "wide"
)
```

### Devre dışı çipler

`enabled = false` çipi basılamaz yapar ve bunu ekran okuyucuya da söyler. Devre dışı çip temanın devre dışı renkleriyle çizilir: açık bir süzgeç devre dışı dolguyu alır; dolgusu olmayan çip dolgusuz kalır ve etiketi soluklaşır. Çarpı da çiple birlikte basılamaz olur.

Son çipe `colors` verildi, ama o da ötekiler gibi çizildi: devre dışı bir çip, bir üründe her yerde aynı görünsün diye, kendi renklerini değil temanınkileri kullanır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.chip.ChipColors
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixChip(label = "Stokta", selected = true, onSelectedChange = {}, enabled = false, tagKey = "disabled_on")
    PantrixChip(label = "İndirimde", selected = false, onSelectedChange = {}, enabled = false, tagKey = "disabled_off")
    PantrixChip(
        label = "Selin Çağlar",
        onClick = {},
        leadingIcon = PantrixIcons.Person,
        onRemove = {},
        enabled = false,
        tagKey = "disabled_recipient"
    )
    PantrixChip(
        label = "Koleksiyonum",
        selected = true,
        onSelectedChange = {},
        enabled = false,
        colors = ChipColors(selectedContainer = own.color, selectedContent = own.onColor),
        tagKey = "disabled_own_colors"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi renkleri

Renkleri dışarıdan verilen iki çip. İlki dolgulu bir eylemdir: dolgusu, etiketi ve simgesi verildi, kenarı `Color.Transparent` ile kaldırıldı. İkincisi bir süzgeçtir ve yalnızca açıkken çizildiği renkler verildi: kapalıyken temanınkilerle çizilir. Süzgece basıp kapat ve farkı gör.

`ChipColors` yalnızca verilen renkleri değiştirir; verilmeyeni temanın rolü belirler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.chip.ChipColors
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
var inCollection by rememberSaveable { mutableStateOf(true) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixChip(
        label = "Yeni sezon",
        onClick = {},
        leadingIcon = PantrixIcons.Star,
        colors = ChipColors(
            container = own.container,
            content = own.onContainer,
            icon = own.onContainer,
            border = Color.Transparent
        ),
        tagKey = "new_season"
    )
    PantrixChip(
        label = "Koleksiyonum",
        selected = inCollection,
        onSelectedChange = { inCollection = it },
        colors = ChipColors(selectedContainer = own.color, selectedContent = own.onColor),
        tagKey = "my_collection"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Şekil ve stil

`style` yalnızca bu çipin geometrisini değiştirir; verilmeyen alanlar temanın ve platformun stilinden gelir. İlk çip stilsizdir ve şekli platformunkidir: Android'de orta yuvarlak, ötekilerde tam yuvarlak. İkincisinin köşeleri `ShapeRole.Small` ile az yuvarlak, üçüncüsününki `ShapeRole.Full` ile tam yuvarlaktır. Sonuncusu 40dp yüksekliğindedir ve etiketinin iki yanında 20dp boşluk vardır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.chip.ChipStyle
import com.pantrixui.components.elements.chip.PantrixChip
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixChip(label = "Stilsiz", onClick = {}, tagKey = "plain")
    PantrixChip(label = "Az yuvarlak", onClick = {}, style = ChipStyle(shape = ShapeRole.Small), tagKey = "rounded")
    PantrixChip(label = "Tam yuvarlak", onClick = {}, style = ChipStyle(shape = ShapeRole.Full), tagKey = "pill")
    PantrixChip(
        label = "Yüksek",
        onClick = {},
        style = ChipStyle(height = 40.dp, horizontalPadding = 20.dp),
        tagKey = "tall"
    )
}
```

## API

### PantrixChip

`import com.pantrixui.components.elements.chip.PantrixChip`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixChip(
    label: String,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    leadingIcon: ImageVector? = null,
    onRemove: (() -> Unit)? = null,
    enabled: Boolean = true,
    style: ChipStyle? = null,
    colors: ChipColors? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir çip: küçük bir eylem, ya da kullanıcının eklediği ve geri çıkarabildiği bir öğe, örneğin bir alıcı, bir etiket ya da uygulanmış bir süzgeç.

Yüksekliği stilinin dediği kadardır, genişliği ikonunun, etiketinin ve çıkarma düğmesinin gerektirdiği kadar. Çevresinde platformun dokunma hedefi kadar yer ayrılır. Çipe verilen yere sığmayan etiket üç noktayla biter, yanındaki çıkarma düğmesi bütün kalır. Büyük bir yazı ölçeğinde çipten büyük yazılan etiket çipi yükseltir. Gereğinden geniş yapılan bir çipte ikon ve etiket bir düğmedeki gibi ortada, çıkarma düğmesi sonda durur.

`onClick` verilen çip bir düğmedir ve adı etiketidir. `onClick` olmadan yalnızca bir değeri gösterir: ekran okuyucu için tek bir öğedir, basış ve odak almaz, `onRemove` verilmişse çıkarma düğmesini korur.

`onRemove` çipin sonuna bir çıkarma düğmesi koyar: çip kadar yüksek, kendi başına bir hedeftir ve ekran okuyucu onu etiketle birlikte duyar, "Kotlin öğesini kaldır". Böylece bir satırdaki düğmeler birbirinden ayırt edilir. Çip kendini kaldırmaz: bunu geri çağrı yapar.

Parametreler:

- `label: String`: Çipin metni ve ekran okuyucu için adı.
- `onClick: (() -> Unit)?`: Çipe basılınca çağrılır. Null verilirse çip yalnızca bir değeri gösterir.
- `modifier: Modifier`: Çipin modifier'ı. Çipin ayırdığı dokunma hedefinin dışına uygulanır.
- `leadingIcon: ImageVector?`: Etiketin önündeki ikon. Stilin ikon boyutunda çizilir.
- `onRemove: (() -> Unit)?`: Çıkarma düğmesine basılınca çağrılır. Null verilirse düğme konmaz.
- `enabled: Boolean`: Çipe ve çıkarma düğmesine basılıp basılamayacağı. Basılamayan çip devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `style: ChipStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: ChipColors?`: Bu çipin kendi renkleri: verdiği renkler kullanılır, gerisi temanınkilerdir. Devre dışı bir çip temanın renklerinde kalır.
- `tagKey: String?`: Çipin otomasyon anahtarı: çip `Chip_<tagKey>`, çıkarma düğmesi `ChipRemove_<tagKey>`'dir. Bir basış `Chip` olayı olarak bildirilir: `click` ya da `remove`. Olay etiketin metnini hiçbir zaman taşımaz.
- `interactionSource: MutableInteractionSource?`: Çipin dışarı taşınan etkileşimleri. Null ise çip kendi kaynağını tutar. Çıkarma düğmesinin her zaman kendi kaynağı vardır.

### PantrixChip

`import com.pantrixui.components.elements.chip.PantrixChip`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixChip(
    label: String,
    selected: Boolean,
    onSelectedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    leadingIcon: ImageVector? = null,
    enabled: Boolean = true,
    style: ChipStyle? = null,
    colors: ChipColors? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null
)
```

Bir süzgeç: açık ya da kapalı olan bir çip.

Seçiliyken primary rolünün container rengiyle doldurulur ve `leadingIcon` yerine bir onay işareti gösterir. Açık olduğunu yalnızca dolgu değil, onay işareti de söyler: iki rengi ayırt edemeyenler için. Ekran okuyucu seçili ya da seçili olmayan bir onay kutusu duyar. Değişiklik, bir anahtardaki gibi, dokunsal geri bildirimle hissedilir.

`onSelectedChange` olmadan süzgeç salt okunurdur: basış ve odak almaz, adını ve açık olup olmadığını yine söyler.

Parametreler:

- `label: String`: Çipin metni ve ekran okuyucu için adı.
- `selected: Boolean`: Süzgecin açık olup olmadığı.
- `onSelectedChange: ((Boolean) -> Unit)?`: Kullanıcının istediği değerle, yani `selected`'ın tersiyle çağrılır. Çip kendiliğinden bir şey değiştirmez: `selected` ne diyorsa odur. Null verilirse çip salt okunur olur.
- `modifier: Modifier`: Çipin modifier'ı. Çipin ayırdığı dokunma hedefinin dışına uygulanır.
- `leadingIcon: ImageVector?`: Etiketin önündeki ikon. Stilin ikon boyutunda çizilir. Seçili bir çip onun yerinde bir onay işareti gösterir.
- `enabled: Boolean`: Çipe basılıp basılamayacağı. Basılamayan çip devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `style: ChipStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: ChipColors?`: Bu çipin kendi renkleri: verdiği renkler kullanılır, gerisi temanınkilerdir. Devre dışı bir çip temanın renklerinde kalır.
- `tagKey: String?`: Çipin otomasyon anahtarı: çip `Chip_<tagKey>`'dir. Bir değişiklik `Chip` olayı olarak bildirilir: `toggle`. Olay istenen değeri taşır, etiketin metnini hiçbir zaman taşımaz.
- `interactionSource: MutableInteractionSource?`: Çipin dışarı taşınan etkileşimleri. Null ise çip kendi kaynağını tutar.

### ChipStyle

`import com.pantrixui.components.elements.chip.ChipStyle`, `com.pantrixui:components` içinden

```kotlin
class ChipStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified
) : PantrixStyle<ChipStyle>
```

`PantrixChip`'in geometrisi.

İkon çipin kenarına metinden daha yakın durur: ikonu olan yanda kenara kadar olan boşluk `horizontalPadding` değil, `iconPadding`'dir. Bu Material 3'ün kuralıdır ve her platformda korunur.

Android'de ölçüler Material 3'ünkilerdir: 32dp yükseklik ve 8dp'lik köşeler, şekil ölçeğinin orta adımı. iOS'un kendi çipi yoktur. Orada çip küçük bir düğmenin yüksekliğini alır ki ikisi bir satırda hizalansın, şekli de Pantrix kontrollerindeki haptır. Masaüstü ve web, imleç için bir adım daha sıkıdır.

İkonun boyutu düğmelerinkine uyar: çipin küçük bir düğme kadar yüksek olduğu Android'de ve iOS'ta küçük düğmenin 20dp'si, masaüstünün ve web'in 30dp'lik çipinde 18dp. Her platformda bu, çipe sığan en büyük boyuttur: çıkarma düğmesinin odak halkası çarpının çevresine, çipin içine çizilir ve yüksek kontrastta çarpının 6dp dışına uzanır.

Yükseklik ve iki iç boşluk yoğunlukla ölçeklenir, çünkü bunlar etiketin çevresindeki yerdir. İkonun boyutu, kenarın kalınlığı ve şekil ölçeklenmez.

Parametreler:

- `shape: ShapeSpec`: Çipin şekli: markanın şekil ölçeğinin bir adımı ya da sabit bir şekil.
- `height: Dp`: Çipin yüksekliği. Büyük bir yazı ölçeğinde bu yüksekliğe sığmayan etiket çipi yükseltir.
- `horizontalPadding: Dp`: İkonu olmayan yanda, etiketle çipin kenarı arasındaki boşluk.
- `iconPadding: Dp`: İkonla çipin kenarı arasındaki ve ikonla etiket arasındaki boşluk.
- `iconSize: Dp`: Baştaki ikonun, seçili bir çipin onay işaretinin ve çıkarma düğmesindeki çarpının genişliği ve yüksekliği.
- `borderWidth: Dp`: Seçili olmayan bir çipin kenarının kalınlığı. Kenar çipin içine çizilir: çip kenarlıyken de kenarsızken de aynı boyuttadır.

### ChipColors

`import com.pantrixui.components.elements.chip.ChipColors`, `com.pantrixui:components` içinden

```kotlin
data class ChipColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir çip için `PantrixChip`'in boyandığı renkler: verilen renk kullanılır, verilmeyen temanın rolünde kalır. Bir ürün yalnızca değiştirdiği renkleri verir:

```kotlin
PantrixChip(
    label = stringResource(Res.string.in_stock),
    selected = inStock,
    onSelectedChange = { inStock = it },
    colors = ChipColors(selectedContainer = brand, selectedContent = onBrand)
)
```

Bunlar basılabilen bir çipin renkleridir. Devre dışı bir çip, burada ne verilirse verilsin, temanın devre dışı rolleriyle çizilir: devre dışı bir çip bir üründe her yerde aynı görünsün diye.

Burada verilen dolgu temanın kendi renklerinden biriyse, üstüne çizilenlerin rengi de ayrıca verilmediği sürece, temanın o dolguyla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Seçili olmayan çipin dolgusu. Varsayılan olarak yoktur: çip kenarından ve etiketinden ibarettir.
- `content: Color`: Seçili olmayan çipin etiketi. Temanın `textPrimary` rengi.
- `icon: Color`: Seçili olmayan çipte etiketin önündeki ikon ve çıkarma düğmesinin çarpısı. Temanın `textSecondary` rengi.
- `border: Color`: Seçili olmayan çipin kenarı. Temanın `border` rengi.
- `selectedContainer: Color`: Açık bir süzgecin dolgusu. Primary rolünün `container`'ı.
- `selectedContent: Color`: Açık bir süzgecin etiketi ve onay işareti: `selectedContainer`'ın üstünde okunan renk. Primary rolünün `onContainer`'ı.

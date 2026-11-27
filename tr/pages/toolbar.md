# Toolbar

Bir ekranın ya da bir bölümünün yapabildikleri bir satırda: sözcüklü düğmeler, simge düğmeleri, menü açan düğmeler ve gruplarının arasında çizgiler. Sığmayan, sonundaki "…" düğmesinin menüsüne düşer.

- `PantrixToolbar` (`com.pantrixui.components.container.toolbar`, `com.pantrixui:components`): Sözcüklü düğmelerden, simgelerden, menülerden ve gruplar arasındaki çizgilerden bir satır; yeri yetmeyince düğmelerini, önceliklerine göre birer birer, simgelerine indirir ve bir "…" menüsüne katlar. Anahtar sözcükler: toolbar, action bar, overflow menu, more actions, command bar, button row.

## Özellikler

- **Öğeler.** `ToolbarItem.Button` sözcüklü bir düğmedir, önünde bir simgesi ve bir `ButtonVariant`'ı olabilir; `ToolbarItem.IconButton` yalnızca simgedir; `ToolbarItem.Menu` bir seçimin menüsünü açar; `ToolbarItem.Divider` iki grubun arasındaki çizgidir.
- **Sığmayan.** Öğeler en düşük `priority`'den başlayarak, eşitlerden sondaki önce, birer birer yer açar: simgesi olan sözcüklü düğme simgesine iner, sözcükleri ipucu ve ekran okuyucunun adı olur; yine sığmazsa menüye düşer, bir sonraki ancak ondan sonra bir şey bırakır. Önceliği yüksek düğme, düşük olanın bırakacak yeri oldukça sözcüklerini korur.
- **Menü.** "…" menüsünde düşenler verildikleri sırayla, altlarında `menuItems`, menünün her zaman tuttuğu satırlar. Bir `ToolbarItem.Menu` orada tek satırdır; satırlarını menünün yerinde, geri dönen bir satırın altında açar. Düşen olmazsa ve menünün kendi satırı yoksa "…" düğmesi de yoktur.
- **Başı ve sonu.** `start` barın başında, `end` sonunda, "…" düğmesi en sonda. Bir çizgi yalnızca iki yanında bir şey varken çizilir.
- **Klavye.** Bar tek bir Tab durağıdır: oklar düğmeler arasında gezer, Home ve End uçlara gider; sağdan sola düzende oklar tersine.
- **Ekran okuyucu.** Bar, `contentDescription` adıyla tek bir gruptur.
- **Otomasyon.** `tagKey` ile bar `Toolbar_<tagKey>`, öğeleri barda da menüde de `Action_<key>`, "…" düğmesi `More_actions` olur.
- **Stil ve renk.** `ToolbarStyle` öğeler arasını ve çizginin boyunu, `ToolbarColors` çizginin rengini verir; `buttonSize` düğmelerin boyudur.

## Kullanım

### A document's actions, folding into the menu

```kotlin
PantrixToolbar(
    start = listOf(
        ToolbarItem.Button(
            key = "format",
            label = stringResource(Res.string.format),
            onClick = onFormat,
            variant = ButtonVariant.Solid,
            priority = 3
        ),
        ToolbarItem.Button(key = "minify", label = stringResource(Res.string.minify), onClick = onMinify),
        ToolbarItem.Divider(key = "made"),
        ToolbarItem.Button(
            key = "convert",
            label = stringResource(Res.string.convert),
            onClick = onConvert,
            icon = PantrixIcons.Code
        )
    ),
    end = listOf(
        ToolbarItem.IconButton(
            key = "copy",
            icon = PantrixIcons.Copy,
            label = stringResource(Res.string.copy),
            onClick = onCopy,
            priority = 5
        )
    ),
    contentDescription = stringResource(Res.string.document),
    tagKey = "document"
)
```

### A choice that opens a menu, and rows the menu always has

```kotlin
PantrixToolbar(
    start = listOf(
        ToolbarItem.Menu(
            key = "format",
            label = format.name,
            items = Format.entries.map { each ->
                ToolbarMenuItem(
                    key = each.key,
                    label = each.name,
                    onClick = { format = each },
                    selected = each == format
                )
            },
            priority = 2
        )
    ),
    menuItems = listOf(
        ToolbarMenuItem(
            key = "close",
            label = stringResource(Res.string.close_document),
            onClick = onClose,
            destructive = true
        )
    ),
    tagKey = "editor"
)
```

## Örnekler

### Bir belgenin eylemleri

Bir belgenin eylemleri, seçilen genişlikte: geniş barda hepsi sözcükleriyle; daraldıkça en düşük öncelikli düğme önce simgesine iner, sonra "…" menüsüne düşer, ardından bir sonraki. Kopyala düğmesi en yüksek öncelikte, en son düşer.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarItem
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var width by rememberSaveable { mutableStateOf(640) }
var pressed by rememberSaveable { mutableStateOf("") }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = 640, label = "640 dp", tagKey = "640"),
            SegmentOption(value = 360, label = "360 dp", tagKey = "360"),
            SegmentOption(value = 200, label = "200 dp", tagKey = "200")
        ),
        selected = width,
        onSelect = { width = it },
        tagKey = "width"
    )
    PantrixToolbar(
        start = listOf(
            ToolbarItem.Button(
                key = "format",
                label = "Biçimle",
                onClick = { pressed = "Biçimle" },
                variant = ButtonVariant.Solid,
                priority = 3
            ),
            ToolbarItem.Button(
                key = "minify",
                label = "Küçült",
                onClick = { pressed = "Küçült" },
                icon = PantrixIcons.Minus
            ),
            ToolbarItem.Divider(key = "made"),
            ToolbarItem.Button(
                key = "convert",
                label = "Dönüştür",
                onClick = { pressed = "Dönüştür" },
                icon = PantrixIcons.Code
            ),
            ToolbarItem.Button(
                key = "history",
                label = "Geçmiş",
                onClick = { pressed = "Geçmiş" },
                icon = PantrixIcons.History,
                priority = 1
            )
        ),
        end = listOf(
            ToolbarItem.IconButton(
                key = "copy",
                icon = PantrixIcons.Copy,
                label = "Kopyala",
                onClick = { pressed = "Kopyala" },
                priority = 5
            )
        ),
        modifier = Modifier.widthIn(max = width.dp).fillMaxWidth(),
        contentDescription = "Belge",
        tagKey = "document"
    )
    PantrixText(
        text = if (pressed.isEmpty()) "Henüz bir eyleme basılmadı." else "Son basılan: $pressed",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "pressed"
    )
}
```

### Bir seçimin menüsü ve menünün kendi satırları

Bir seçimin menüsü: belgenin biçimi, seçili olan işaretli. Menünün kendi satırları, belgeyi paylaşmak ve kapatmak, her genişlikte "…" düğmesinin arkasındadır; dar barda biçimin düğmesi de oraya düşer ve satırlarını menünün yerinde açar.

Biçimin düğmesi yalnızca seçili biçimi yazar, "JSON"; ekran okuyucu onu `contentDescription` ile "Belgenin biçimi" diye okur. "Doğrula" da öyle: barda da "…" menüsünde de "Belgeyi doğrula".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarItem
import com.pantrixui.components.container.toolbar.ToolbarMenuItem
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var format by rememberSaveable { mutableStateOf("json") }
var narrow by rememberSaveable { mutableStateOf(false) }
var said by rememberSaveable { mutableStateOf("") }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = false, label = "Geniş", tagKey = "wide"),
            SegmentOption(value = true, label = "Dar", tagKey = "narrow")
        ),
        selected = narrow,
        onSelect = { narrow = it },
        tagKey = "room"
    )
    PantrixToolbar(
        start = listOf(
            ToolbarItem.Menu(
                key = "format",
                label = FORMATS.getValue(format),
                items = FORMATS.map { (key, name) ->
                    ToolbarMenuItem(key = key, label = name, onClick = { format = key }, selected = key == format)
                },
                priority = 2,
                contentDescription = "Belgenin biçimi"
            ),
            ToolbarItem.Divider(key = "line"),
            ToolbarItem.Button(
                key = "validate",
                label = "Doğrula",
                onClick = { said = "Doğrulandı" },
                contentDescription = "Belgeyi doğrula"
            )
        ),
        menuItems = listOf(
            ToolbarMenuItem(
                key = "share",
                label = "Paylaş",
                onClick = { said = "Paylaşıldı" },
                icon = PantrixIcons.Share
            ),
            ToolbarMenuItem(
                key = "close",
                label = "Belgeyi kapat",
                onClick = { said = "Kapatıldı" },
                icon = PantrixIcons.Delete,
                destructive = true
            )
        ),
        modifier = Modifier.widthIn(max = if (narrow) 120.dp else 480.dp),
        tagKey = "editor"
    )
    PantrixText(
        text = "Biçim: ${FORMATS.getValue(format)}" + if (said.isEmpty()) "" else " · $said",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "format"
    )
}

private val FORMATS = linkedMapOf("json" to "JSON", "yaml" to "YAML", "toml" to "TOML")
```

### Gösterilen görünümün düğmesi

Belgenin görünümleri: her biri bir düğme, gösterilen `selected`. Seçili düğme varyantı ne olursa olsun Soft'un açık dolgusuyla çizilir ve ekran okuyucuya bir sekme gibi seçili olduğu söylenir; dar barda "…" menüsünde işaretli bir satırdır. Seçili olmayan bir düğme ötekiler gibi okunur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarItem

var view by rememberSaveable { mutableStateOf("tree") }
PantrixToolbar(
    start = VIEWS.map { (key, name) ->
        ToolbarItem.Button(key = key, label = name, onClick = { view = key }, selected = key == view)
    },
    tagKey = "views"
)

private val VIEWS = linkedMapOf("tree" to "Ağaç", "table" to "Tablo", "raw" to "Ham metin")
```

### Kendi stili ve rengi

Kendi stiliyle: küçük düğmeler, aralarında daha az yer, daha kısa ve uygulamanın renginde bir çizgi.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.toolbar.PantrixToolbar
import com.pantrixui.components.container.toolbar.ToolbarColors
import com.pantrixui.components.container.toolbar.ToolbarItem
import com.pantrixui.components.container.toolbar.ToolbarStyle
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

PantrixToolbar(
    start = listOf(
        ToolbarItem.IconButton(key = "undo", icon = PantrixIcons.ArrowBack, label = "Geri al", onClick = {}),
        ToolbarItem.IconButton(key = "redo", icon = PantrixIcons.ArrowForward, label = "Yinele", onClick = {}),
        ToolbarItem.Divider(key = "line"),
        ToolbarItem.Button(key = "settings", label = "Ayarlar", onClick = {}, icon = PantrixIcons.Settings)
    ),
    buttonSize = ButtonSize.Small,
    style = ToolbarStyle(gap = 2.dp, dividerHeight = 16.dp),
    colors = ToolbarColors(divider = PantrixTheme.colors.primary.color),
    tagKey = "own"
)
```

## API

### PantrixToolbar

`import com.pantrixui.components.container.toolbar.PantrixToolbar`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixToolbar(
    start: List<ToolbarItem>,
    modifier: Modifier = Modifier,
    end: List<ToolbarItem> = emptyList(),
    menuItems: List<ToolbarMenuItem> = emptyList(),
    buttonSize: ButtonSize = ButtonSize.Medium,
    contentDescription: String? = null,
    style: ToolbarStyle? = null,
    colors: ToolbarColors? = null,
    tagKey: String? = null
)
```

Bir ekranın ya da bir bölümünün, bir belgeninki gibi, yapabildiklerinden bir satır: sözcüklü düğmeler, simgeli düğmeler, menü açan düğmeler ve gruplarının arasındaki çizgiler; yeri olmayanı sonundaki bir "…" düğmesinin menüsünde tutar.

`start` barın başında, `end` sonunda durur, "…" düğmesi ondan sonra. Bar hepsine dar geldiğinde öğeler, en düşük `ToolbarItem.priority`'den başlayarak, eşitlerden sondaki önce, birer birer yer açar: sözcüklü ve simgeli bir düğme simgesiyle çizilir, sözcüklerini tooltip ve ekran okuyucu söyler; ona da yer yoksa, bir sonraki öğe bir şey bırakmadan önce menüye gider. Önceliği yüksek bir öğe böylece, düşük olanın bırakacak yeri oldukça sözcüklerini korur. Menüde her biri, öğelerin verildiği sırayla, sözcükleri ve simgesiyle bir satırdır; altlarında `menuItems`, menünün yer ne olursa olsun tuttuğu satırlar. Bir `ToolbarItem.Menu` orada tek satırdır ve kendi satırlarını menünün yerinde gösterir. Hiçbir şey katlanmadıysa ve menünün kendi satırı yoksa "…" düğmesi yoktur. İki grubun arasındaki çizgi yalnızca iki yanında bir şey durduğunda çizilir.

Bar tek bir Tab durağıdır: oklar düğmeleri arasında, "…" düğmesi de dahil, gezer; Home ve End ilkine ve sonuncusuna gider; Tab en son bırakılana döner. Ekran okuyucu onu `contentDescription` adıyla tek bir grup olarak duyar.

Barın kendi dolgusu yoktur, düğmeleri kadar uzundur: bir barın içinde ya da bir bölmenin üstünde durur, boyunu ve dolgusunu o verir. `end`'in öğeleri varsa olabildiği kadar geniştir; yoksa gösterdiği kadar.

```kotlin
PantrixToolbar(
    start = listOf(
        ToolbarItem.Button(key = "format", label = "Format", onClick = onFormat, variant = ButtonVariant.Solid,
            priority = 3),
        ToolbarItem.Button(key = "minify", label = "Minify", onClick = onMinify, icon = PantrixIcons.Minus),
        ToolbarItem.Divider(key = "made"),
        ToolbarItem.Button(key = "convert", label = "Convert", onClick = onConvert, icon = PantrixIcons.Code)
    ),
    end = listOf(
        ToolbarItem.IconButton(key = "copy", icon = PantrixIcons.Copy, label = "Copy", onClick = onCopy,
            priority = 5)
    ),
    menuItems = listOf(ToolbarMenuItem(key = "close", label = "Close the document", onClick = onClose)),
    contentDescription = "Document",
    tagKey = "document"
)
```

Parametreler:

- `start: List<ToolbarItem>`: barın başındaki öğeler, sırasıyla.
- `modifier: Modifier`: barın modifier'ı.
- `end: List<ToolbarItem>`: barın sonundaki, "…" düğmesinden önceki öğeler, sırasıyla.
- `menuItems: List<ToolbarMenuItem>`: "…" menüsünün yer ne olursa olsun tuttuğu satırlar, yeri olmayan öğelerin altında.
- `buttonSize: ButtonSize`: barın düğmelerinin boyu: varsayılanı `ButtonSize.Medium`.
- `contentDescription: String?`: ekran okuyucunun bara verdiği ad, ya da yalnızca düğmeleri duyulan bir bar için null.
- `style: ToolbarStyle?`: bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar, her platformda değişir.
- `colors: ToolbarColors?`: bu çağrının, temanınkiler olmadığı yerde kendi renkleri.
- `tagKey: String?`: barın otomasyon anahtarı: bar `Toolbar_<tagKey>` olur, öğeleri barda da menüde de onun içinde `Action_<key>`; "…" düğmesi `More_actions`.

### ToolbarItem

`import com.pantrixui.components.container.toolbar.ToolbarItem`, `com.pantrixui:components` içinden

```kotlin
sealed class ToolbarItem
```

Bir `PantrixToolbar`'ın tuttuğu bir şey: sözcüklü bir düğme, yalnızca simgeli bir düğme, menü açan bir düğme ya da iki grubun arasındaki bir çizgi.

Bar hepsine dar geldiğinde öğeler, en düşük `priority`'den başlayarak, eşitlerden sondaki önce, birer birer yer açar: sözcüklü ve simgeli bir düğme simgesiyle çizilir; ona da yer yoksa, bir sonraki öğe bir şey bırakmadan önce barın "…" düğmesinin arkasındaki menüye gider. Menüde aynı sözcükleri, simgesi ve etiketiyle bir satırdır.

Üyeleri:

- `key: String`: Öğeyi barda ve menüde adlandıran: her dilde aynı, bir barda bir tane.
- `priority: Int`: Yer daraldıkça öğenin barda ne kadar kaldığı: en düşüğü önce katlanır.
- `tagKey: String?`: Öğenin, `key`'den başka olacaksa, otomasyon anahtarı: öğe barda da menüde de, anahtarı olan bir barın etiketinin içinde `Action_<tagKey>` olur, `Toolbar_document.Action_format` gibi.

#### ToolbarItem.Button

```kotlin
class Button(
    override val key: String,
    public val label: String,
    public val onClick: () -> Unit,
    public val icon: ImageVector? = null,
    public val variant: ButtonVariant = ButtonVariant.Text,
    public val enabled: Boolean = true,
    override val priority: Int = 0,
    public val contentDescription: String? = null,
    public val selected: Boolean = false,
    override val tagKey: String? = null
) : ToolbarItem()
```

Sözcüklü bir düğme, varsa önünde bir `icon`: barda sözcüklere yer olmayınca yalnızca simge, sözcükleri tooltip ve ekran okuyucu için.

Parametreler:

- `key: String`: Öğeyi barda ve menüde adlandıran: her dilde aynı, bir barda bir tane.
- `label: String`: Düğmenin yaptığı: sözcükleri ve ekran okuyucu için adı.
- `onClick: () -> Unit`: Düğmeye barda ya da menüde basılınca çağrılır.
- `icon: ImageVector?`: Sözcüklerin önünde, sözcüklere yer olmayınca da düğmenin yerine duran; yalnızca yazılan bir düğme için null, sözcüklerine yer olmayınca menüye gider.
- `variant: ButtonVariant`: Düğmenin barda nasıl çizildiği: varsayılanı `ButtonVariant.Text`; `ButtonVariant.Destructive` olan menüde menünün yıkıcı renginde çizilir.
- `enabled: Boolean`: Düğmeye şimdi basılıp basılamayacağı.
- `priority: Int`: Yer daraldıkça öğenin barda ne kadar kaldığı: en düşüğü önce katlanır.
- `contentDescription: String?`: Ekran okuyucunun düğmeyi bar'da ve menünün bir satırı olarak ne diye çağırdığı, sözleri tek başına ne yaptığını söylemediği yerde; null, `label`'ı içindir.
- `selected: Boolean`: Düğmenin, her biri bir görünümü gösteren düğmeler arasında, bir sekme gibi, geçerli olan olup olmadığı: `variant`'ı ne olursa olsun `ButtonVariant.Soft`'un açık dolgusuyla çizilir, ekran okuyucuya seçili diye söylenir ve menünün bir satırı olarak işaretlidir. Seçili olmayan bir düğme öteki düğmeler gibi okunur.
- `tagKey: String?`: Öğenin, `key`'den başka olacaksa, otomasyon anahtarı: öğe barda da menüde de, anahtarı olan bir barın etiketinin içinde `Action_<tagKey>` olur, `Toolbar_document.Action_format` gibi.

#### ToolbarItem.IconButton

```kotlin
class IconButton(
    override val key: String,
    public val icon: ImageVector,
    public val label: String,
    public val onClick: () -> Unit,
    public val enabled: Boolean = true,
    override val priority: Int = 0,
    override val tagKey: String? = null
) : ToolbarItem()
```

Yalnızca simgeli bir düğme; `label`'ı tooltip ve ekran okuyucu için, menüde de satırın sözcükleri.

Parametreler:

- `key: String`: Öğeyi barda ve menüde adlandıran: her dilde aynı, bir barda bir tane.
- `icon: ImageVector`: Düğmenin yaptığının yerine duran.
- `label: String`: Düğmenin yaptığı, bir iki sözcükle.
- `onClick: () -> Unit`: Düğmeye barda ya da menüde basılınca çağrılır.
- `enabled: Boolean`: Düğmeye şimdi basılıp basılamayacağı.
- `priority: Int`: Yer daraldıkça öğenin barda ne kadar kaldığı: en düşüğü önce katlanır.
- `tagKey: String?`: Öğenin, `key`'den başka olacaksa, otomasyon anahtarı: öğe barda da menüde de, anahtarı olan bir barın etiketinin içinde `Action_<tagKey>` olur, `Toolbar_document.Action_format` gibi.

#### ToolbarItem.Menu

```kotlin
class Menu(
    override val key: String,
    public val label: String,
    public val items: List<ToolbarMenuItem>,
    public val icon: ImageVector? = null,
    public val variant: ButtonVariant = ButtonVariant.Text,
    public val enabled: Boolean = true,
    override val priority: Int = 0,
    public val contentDescription: String? = null,
    override val tagKey: String? = null
) : ToolbarItem()
```

`items`'tan bir menü açan düğme: birkaçı arasından bir seçim, bir belgenin biçimi gibi; sözcüklerinden sonra bir okla. Barın menüsünde tek satırdır; satırlarını menünün yerinde, geri dönen bir satırın altında gösterir.

Parametreler:

- `key: String`: Öğeyi barda ve menüde adlandıran: her dilde aynı, bir barda bir tane.
- `label: String`: Düğmenin söylediği: geçerli seçim ya da menünün ne için olduğu.
- `items: List<ToolbarMenuItem>`: Menüsünün satırları, sırasıyla.
- `icon: ImageVector?`: Sözcüklerine yer olmayınca düğmenin yerine duran; o zaman barın menüsüne giden bir düğme için null.
- `variant: ButtonVariant`: Düğmenin barda nasıl çizildiği: varsayılanı `ButtonVariant.Text`.
- `enabled: Boolean`: Düğmeye şimdi basılıp basılamayacağı.
- `priority: Int`: Yer daraldıkça öğenin barda ne kadar kaldığı: en düşüğü önce katlanır.
- `contentDescription: String?`: Ekran okuyucunun düğmeyi bar'da ve menünün bir satırı olarak ne diye çağırdığı: geçerli seçim ve basmanın neyi değiştirdiği, `Biçim: JSON. Biçimi değiştir`, sözleri yalnızca seçimi söylediği yerde; null, `label`'ı içindir.
- `tagKey: String?`: Öğenin, `key`'den başka olacaksa, otomasyon anahtarı: öğe barda da menüde de, anahtarı olan bir barın etiketinin içinde `Action_<tagKey>` olur, `Toolbar_document.Action_format` gibi.

#### ToolbarItem.Divider

```kotlin
class Divider(override val key: String) : ToolbarItem()
```

Bir barın iki grubunun arasındaki çizgi. Yalnızca iki yanında bir şey durduğunda çizilir ve hiç menüye gitmez.

Parametreler:

- `key: String`: Öğeyi barda ve menüde adlandıran: her dilde aynı, bir barda bir tane.

### ToolbarMenuItem

`import com.pantrixui.components.container.toolbar.ToolbarMenuItem`, `com.pantrixui:components` içinden

```kotlin
class ToolbarMenuItem(
    public val key: String,
    public val label: String,
    public val onClick: () -> Unit,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val selected: Boolean = false,
    public val destructive: Boolean = false,
    public val tagKey: String? = null
)
```

Bir `PantrixToolbar`'ın açtığı bir menünün satırı: bir `ToolbarItem.Menu`'nün ya da barın, yer ne olursa olsun onu tutan kendi "…" menüsünün.

Parametreler:

- `key: String`: Satırı adlandıran: her dilde aynı, bir menüde bir tane.
- `label: String`: Satırın yaptığı, bir iki sözcükle.
- `onClick: () -> Unit`: Satır seçilince, menüden kapanması istendikten sonra çağrılır.
- `icon: ImageVector?`: Sözcüklerin önünde duran.
- `enabled: Boolean`: Satırın şimdi seçilip seçilemeyeceği.
- `selected: Boolean`: Her biri bir şey seçen satırlar arasında satırın geçerli seçim olup olmadığı: sonunda bir onay işareti durur, ekran okuyucuya seçili olduğu söylenir.
- `destructive: Boolean`: Satırın geri alınamayan bir şeyi silip silmediği ya da bozup bozmadığı: menünün yıkıcı renginde çizilir.
- `tagKey: String?`: Satırın, `key`'den başka olacaksa, otomasyon anahtarı: satır menünün etiketinin içinde `MenuItem_<tagKey>` olur.

### ToolbarStyle

`import com.pantrixui.components.container.toolbar.ToolbarStyle`, `com.pantrixui:components` içinden

```kotlin
class ToolbarStyle(
    public val gap: Dp = Dp.Unspecified,
    public val dividerHeight: Dp = Dp.Unspecified
) : PantrixStyle<ToolbarStyle>
```

`PantrixToolbar`'ın geometrisi: iki öğesinin arasındaki yer ve iki grubun arasındaki çizginin boyu. Dokunarak kullanılan bir barda, platformun dokunma hedefini alan düğmelerin arasında daha az yer ve daha uzun çizgiler vardır.

Parametreler:

- `gap: Dp`: İki öğenin arasındaki, son öğeyle "…" düğmesinin arasındaki yer.
- `dividerHeight: Dp`: Bir `ToolbarItem.Divider`'ın çizildiği boy.

### ToolbarColors

`import com.pantrixui.components.container.toolbar.ToolbarColors`, `com.pantrixui:components` içinden

```kotlin
data class ToolbarColors(
    public val divider: Color = Color.Unspecified
)
```

Bir `PantrixToolbar`'ın temanınkiler olmadığı yerde kendi renkleri. Barın kendi dolgusu yoktur; düğmeleri varyantlarının renkleriyle çizilir.

Parametreler:

- `divider: Color`: İki grubun arasındaki çizgi: temanın `divider`'ı.

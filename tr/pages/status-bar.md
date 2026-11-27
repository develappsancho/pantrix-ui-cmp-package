# Status Bar

Bir pencerenin ya da bir bölmenin altında, işlerin nasıl durduğunu söyleyen kısa bar: başında bir belgenin geçerliliği ve boyutu, sonunda imlecin satırı ve sütunu, metnin kodlaması. Düğmeleri barın boyunda kalır ve barın dışından da basılır.

- `PantrixStatusBar` (`com.pantrixui.components.container.statusbar`, `com.pantrixui:components`): Bir pencerenin ya da bir bölmenin altında işlerin nasıl durduğunu sözcüklerle, düğmelerle ve uygulamanın kendi öğeleriyle söyleyen kısa bir bar; düğmeleri barın dışından da basılır, öğeleri bir menüye katlanır. Anahtar sözcükler: status bar, footer bar, editor status, caret position, dense bar, bottom bar.

## Özellikler

- **Öğeler.** `start` ve `end` bir `StatusBarScope`'un öğeleriyle yazılır: `text` sözcükler, `button` bir düğme, `item` uygulamanın kendi öğesi, menüdeki sözcüğüyle.
- **Basış.** Bar işaretçinin altında 28dp, telefonda ve tablette 32dp; düğmeleri 24dp. Dokunma hedefinden küçük bir düğme, çizdiğinin dışından, barın altından ve üstünden, yanlarındaki boşluğun yarısından da basılır. Bu yüzden barın üstündekinin birkaç dp'si düğmenindir.
- **Sığmayan.** En düşük `priority`'den başlayarak sondaki "…" düğmesinin menüsüne düşer, eşitlerden sondaki önce; menüde bir düğme basılan, sözcükler okunan bir satırdır.
- **Ekran okuyucu.** Bar tek bir gruptur, adı `contentDescription` ya da temanın "Durum" sözü. `live` verilen sözcükler her değiştiğinde söylenir; imlecin konumu gibi her tuşta değişene verilmez. Seçili bir düğme seçili olarak okunur.
- **Tanılama.** Tanılama, düğmenin basıldığı alanı ölçer; yanındakilerin hedefinden az yer bıraktığı bir düğmeyi `SmallTouchTarget` olarak bildirir.
- **Otomasyon.** `tagKey` ile bar `StatusBar_<tagKey>`, öğeleri barda da menüde de `Item_<key>`, "…" düğmesi `More_items` olur.
- **Stil ve renk.** `StatusBarStyle` yüksekliği, uçlardaki ve öğeler arasındaki yeri, `StatusBarColors` dolguyu, üstteki çizgiyi, sözcükleri ve seçili düğmenin rengini verir.

## Kullanım

### A document's status: its validity, its size and the caret

```kotlin
PantrixStatusBar(
    start = {
        item(key = "valid", label = stringResource(Res.string.valid)) {
            PantrixTag(text = stringResource(Res.string.valid), tone = TagTone.Success, tagKey = "valid")
        }
        button(
            key = "size",
            text = stringResource(Res.string.size, size),
            onClick = onSummary,
            selected = summaryShown,
            priority = 1
        )
    },
    end = {
        text(key = "caret", text = stringResource(Res.string.line_column, line, column), priority = 2)
        text(key = "layout", text = "UTF-8 · LF")
    },
    tagKey = "document"
)
```

### What a reader waits on, said when it changes

```kotlin
PantrixStatusBar(
    start = {
        text(key = "saved", text = stringResource(if (saved) Res.string.saved else Res.string.saving), live = true)
    },
    contentDescription = stringResource(Res.string.editor_status),
    tagKey = "editor"
)
```

## Örnekler

### Bir belgenin durumu

Bir belgenin durumu, seçilen genişlikte: geçerli olduğu bir etiketle, boyutu özetini açan bir düğmeyle; sonunda imlecin yeri ve metnin düzeni. Daraldıkça önce metnin düzeni, sonra imlecin yeri "…" menüsüne düşer.

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
import com.pantrixui.components.container.statusbar.PantrixStatusBar
import com.pantrixui.components.data.tag.PantrixTag
import com.pantrixui.components.data.tag.TagTone
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var width by rememberSaveable { mutableStateOf(640) }
var summary by rememberSaveable { mutableStateOf(false) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = 640, label = "640 dp", tagKey = "640"),
            SegmentOption(value = 320, label = "320 dp", tagKey = "320")
        ),
        selected = width,
        onSelect = { width = it },
        tagKey = "width"
    )
    PantrixText(
        text = if (summary) "Özet açık." else "Özet kapalı: boyuta bas.",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "summary"
    )
    PantrixStatusBar(
        start = {
            item(key = "valid", label = "Geçerli", priority = 3) {
                PantrixTag(text = "Geçerli", tone = TagTone.Success, tagKey = "valid")
            }
            button(
                key = "size",
                text = "41 satır · 742 B",
                onClick = { summary = !summary },
                selected = summary,
                contentDescription = if (summary) "Özeti kapat, 742 B" else "Özeti göster, 742 B",
                priority = 2
            )
        },
        end = {
            text(key = "caret", text = "Sat 12, Süt 4", priority = 1)
            text(key = "layout", text = "UTF-8 · LF · 2 boşluk")
        },
        modifier = Modifier.widthIn(max = width.dp).fillMaxWidth(),
        tagKey = "document"
    )
}
```

### Değişince söylenen bir durum

Okuyucunun beklediği bir durum: kaydedilirken "Kaydediliyor…", bitince "Kaydedildi". `live` verildiği için ekran okuyucu her değişikliği söyler. Barın adı burada "Düzenleyicinin durumu"dur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.statusbar.PantrixStatusBar
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

var saving by rememberSaveable { mutableStateOf(false) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(text = if (saving) "Bitir" else "Kaydet", onClick = { saving = !saving }, tagKey = "save")
    PantrixStatusBar(
        start = { text(key = "saved", text = if (saving) "Kaydediliyor…" else "Kaydedildi", live = true) },
        contentDescription = "Düzenleyicinin durumu",
        tagKey = "editor"
    )
}
```

### Kendi stili ve renkleri

Kendi stiliyle ve renkleriyle: daha alçak bir bar, uygulamanın dolgusu ve çizgisi, seçili düğmenin rengi.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.statusbar.PantrixStatusBar
import com.pantrixui.components.container.statusbar.StatusBarColors
import com.pantrixui.components.container.statusbar.StatusBarStyle
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixStatusBar(
    start = {
        button(key = "branch", text = "main", onClick = {}, selected = true)
        text(key = "changes", text = "3 değişiklik")
    },
    end = { text(key = "time", text = "14:32") },
    style = StatusBarStyle(height = 24.dp, gap = 12.dp),
    colors = StatusBarColors(
        container = colors.primary.container,
        line = colors.primary.color,
        content = colors.primary.onContainer,
        selected = colors.primary.onContainer
    ),
    tagKey = "own"
)
```

## API

### PantrixStatusBar

`import com.pantrixui.components.container.statusbar.PantrixStatusBar`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixStatusBar(
    start: StatusBarScope.() -> Unit,
    modifier: Modifier = Modifier,
    end: StatusBarScope.() -> Unit = {},
    contentDescription: String? = null,
    style: StatusBarStyle? = null,
    colors: StatusBarColors? = null,
    tagKey: String? = null
)
```

Bir pencerenin ya da bir bölmenin altında işlerin nasıl durduğunu söyleyen bar: başında bir belgenin geçerliliği ve boyutu, sonunda imlecin satırı ve sütunu, metnin kodlaması. Düğmeleri, kısa da olsa barın boyunda kalır ve barın dışından da basılır.

`start` barın başında, `end` sonunda durur; ikisi de bir `StatusBarScope`'un öğeleriyle, sırasıyla yazılır. Bar hepsine dar geldiğinde, önce en düşük öncelik, eşitlerden sondaki, sonundaki bir "…" düğmesinin arkasındaki menüye gider; menüde her biri bir satırdır, bir düğmeninki barda olduğu gibi basılır.

Bar işaretçinin altında 28dp, telefonda ve tablette 32dp; düğmeleri 24dp. Platformun dokunma hedefinden dar ya da kısa bir düğme, o hedefe kadar çizdiğinin dışından basılır: barın üstünde ve altında, iki yanındaki yerin yarısında. Basışı bu yüzden barın üstündekinin birkaç dp'sine taşar ve oradaki bir basış düğmeye gider; tanılama bu alanı ölçer ve komşuları hedeften az yer bırakan bir düğmeyi bildirir (PantrixCheck.SmallTouchTarget). Yalnızca bir simge olan "…" düğmesi dokunmada, iki yanındaki yerin yarısıyla hedefi dolduracak genişlikte çizilir: telefonda 32dp.

Ekran okuyucu barı, `contentDescription` ya da temanın durum barı sözüyle adlanan tek bir grup olarak, öğelerini de tek tek duyar; `live` verilen sözcükler her değiştiğinde yeniden söylenir.

```kotlin
PantrixStatusBar(
    start = {
        item(key = "valid", label = "Valid") { PantrixTag(text = "Valid", tone = TagTone.Success) }
        button(key = "size", text = "742 B", onClick = { showSummary() })
    },
    end = {
        text(key = "caret", text = "Ln 12, Col 4", priority = 2)
        text(key = "layout", text = "UTF-8 · LF")
    },
    tagKey = "document"
)
```

Parametreler:

- `start: StatusBarScope.() -> Unit`: barın başındaki öğeler.
- `modifier: Modifier`: barın modifier'ı. Bar olabildiği kadar geniştir.
- `end: StatusBarScope.() -> Unit`: barın sonundaki, "…" düğmesinden önceki öğeler.
- `contentDescription: String?`: ekran okuyucunun bara verdiği ad, ya da temanın durum barı sözü için null.
- `style: StatusBarStyle?`: bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar, her platformda değişir.
- `colors: StatusBarColors?`: bu çağrının, temanınkiler olmadığı yerde kendi renkleri.
- `tagKey: String?`: barın otomasyon anahtarı: bar `StatusBar_<tagKey>` olur, öğeleri onun içinde `Item_<key>`, "…" düğmesi `More_items`.

### StatusBarScope

`import com.pantrixui.components.container.statusbar.StatusBarScope`, `com.pantrixui:components` içinden

```kotlin
interface StatusBarScope
```

Bir `PantrixStatusBar`'ın bir ucunun tuttukları, öğe öğe, verildikleri sırayla: sözcükler, düğmeler ve uygulamanın kendi öğeleri. Her birinin her dilde aynı ve bir barda bir tane olan bir anahtarı ve bir önceliği vardır: bar dar geldiğinde önce en düşüğü, eşitlerden sondaki, barın "…" düğmesinin arkasındaki menüye gider.

Bir öğe barda da menüde de barın etiketinin içinde `Item_<tagKey>` olur; otomasyon anahtarı verilmezse `key`'i.

Üyeleri:

- `fun text(key: String, text: String, priority: Int = 0, live: Boolean = false, tagKey: String? = null)`: Bir şeyin nasıl durduğunu söyleyen sözcükler: imlecin satırı ve sütunu, bir metnin kodlaması. Menüde basılmayan, okunan bir satırdır.

  `key`: öğeyi adlandıran.

  `text`: sözcükleri.

  `priority`: yer daraldıkça barda ne kadar kaldığı.

  `live`: sözcüklerin her değiştiğinde ekran okuyucuya söylenip söylenmediği: okuyucunun beklediği bir şey için, her tuşta değişen imlecin konumu için değil.

  `tagKey`: `key`'den başka olacaksa otomasyon anahtarı.
- `fun button(key: String, text: String, onClick: () -> Unit, icon: ImageVector? = null, selected: Boolean = false, enabled: Boolean = true, contentDescription: String? = null, priority: Int = 0, tagKey: String? = null)`: Sözcüklü bir düğme, önünde bir `icon`: özetini gösteren bir belgenin boyutu gibi. Barın boyunda kalır ve platformun dokunma hedefine kadar barın dışından da basılır.

  `key`: öğeyi adlandıran.

  `text`: sözcükleri.

  `onClick`: barda ya da menüde basılınca çağrılır.

  `icon`: sözcüklerin önünde duran.

  `selected`: gösterdiğinin şimdi gösterilip gösterilmediği: sözcükleri seçili renktedir, ekran okuyucuya seçili olduğu söylenir.

  `enabled`: şimdi basılıp basılamayacağı.

  `contentDescription`: sözcükleri tek başına ne yaptığını söylemiyorsa ekran okuyucunun ona verdiği ad.

  `priority`: yer daraldıkça barda ne kadar kaldığı.

  `tagKey`: `key`'den başka olacaksa otomasyon anahtarı.
- `fun item(key: String, label: String, priority: Int = 0, tagKey: String? = null, content: @Composable () -> Unit)`: Uygulamanın kendi öğesi, bir belgenin geçerli olduğunu söyleyen bir etiket gibi. Menüde `label`'ıyla basılmayan, okunan bir satırdır.

  `key`: öğeyi adlandıran.

  `label`: menüye katlandığında sözcüklerle söylediği.

  `priority`: yer daraldıkça barda ne kadar kaldığı.

  `tagKey`: `key`'den başka olacaksa otomasyon anahtarı.

  `content`: barın çizdiği.

### StatusBarStyle

`import com.pantrixui.components.container.statusbar.StatusBarStyle`, `com.pantrixui:components` içinden

```kotlin
class StatusBarStyle(
    public val height: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<StatusBarStyle>
```

`PantrixStatusBar`'ın geometrisi: barın boyu, iki ucundaki yer ve iki öğenin arasındaki yer. Dokunarak kullanılan bir bar daha uzundur; düğmeleri uzatılmaz, platformun dokunma hedefine kadar barın dışından basılır.

Parametreler:

- `height: Dp`: Barın, çizgisinin altındaki boyu: işaretçinin altında 28, telefonda ve tablette 32.
- `horizontalPadding: Dp`: Barın başındaki ve sonundaki yer.
- `gap: Dp`: İki öğenin arasındaki yer. Dokunma hedefinden dar bir düğme, iki yanında bu yerin yarısında da basılır.

### StatusBarColors

`import com.pantrixui.components.container.statusbar.StatusBarColors`, `com.pantrixui:components` içinden

```kotlin
data class StatusBarColors(
    public val container: Color = Color.Unspecified,
    public val line: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selected: Color = Color.Unspecified
)
```

Bir `PantrixStatusBar`'ın temanınkiler olmadığı yerde kendi renkleri.

Parametreler:

- `container: Color`: Barın dolgusu: temanın `background`'u, üstündeki bölmelerin `surface`'inden bir adım ayrı.
- `line: Color`: Barın üstündeki çizgi: temanın `divider`'ı.
- `content: Color`: Sözcükleri, bir düğmeninkiler de: temanın `textSecondary`'si, bir bölmeninkinden sessiz.
- `selected: Color`: Seçili bir düğmenin sözcükleri, bir bölmeyi gösteren düğmenin bölme gösterilirkenki gibi: temanın `primary` rengi.

# Diff View

İki metnin satır satır karşılaştırması: ikincinin birinciden çıkardığı, eklediği ve başka yazdığı satırlar, geniş görünümde yan yana, dar görünümde tek sütunda. İki sütun birlikte kayar. Bir dosyanın iki sürümü, bir ayarın değişikliği, bir yanıtın önceki hâliyle farkı böyle okunur.

- `PantrixDiffView` (`com.pantrixui.components.data.diffview`, `com.pantrixui:components`): İki metnin satır satır karşılaştırması: çıkan, eklenen ve değişen satırlar yan yana ya da tek sütunda, değişen sözcükler işaretli, değişmeyen satırlar katlanmış, gidilecek değişiklikleriyle. Anahtar sözcükler: fark, karşılaştırma, yan yana, değişiklikler, metin karşılaştırma, birleştirme görünümü, sürüm geçmişi.

## Özellikler

- **Satırlar.** Çıkan satır danger rolünün yumuşak dolgusunda, önünde −; eklenen success rolününkinde, önünde +. Başka yazılan satır karşısındaki satırın hizasında durur; değişen sözcükleri aynı rolün daha koyu dolgusundadır. Bir metnin tek başına sahip olduğu satırın karşısı ince çizgilerle taranır.
- **Düzen.** `layout` görünümün kendi genişliğine göre, pencerenin eşikleriyle, Medium'dan genişte yan yana, daha darda tek sütun dizer (`DiffLayout.Adaptive`); `SideBySide` ve `Unified` her zaman öyle dizer. Tek sütunda bir değişikliğin önce çıkan satırları, altında eklenenleri durur.
- **Katlanan satırlar.** Her değişikliğin önünde ve ardında `context` kadar, varsayılan üç, değişmeyen satır kalır; gerisi kaç satır olduğunu söyleyen tek bir satıra katlanır, ona basmak açar. `context = null` hiçbir şeyi katlamaz.
- **Numaralar ve renkler.** Her satır kendi metnindeki numarasını taşır, tek sütunda iki numarayı birden. `highlighter` değişmeyen satırları bir kod düzenleyicisinin renkleriyle boyar; değişen satırlar dolgularının üstünde okunan tek renkle yazılır.
- **Uzun satırlar.** Sütununa sığmayan satır kendi altında sürer ve sıra uzun tarafın boyunu alır. `softWrap = false` iki sütunu yana birlikte kaydırır.
- **Değişiklikler.** `rememberDiffViewState` görünümün durumudur: `changes` değişiklikleri, her biri için iki metnin satırlarıyla verir; `scrollToChange(i)` bir değişikliği en kısa yoldan ekrana getirir ve başında birincil renkte bir çubukla gösterir (`shownChange`). Odak görünümdeyken Alt ve aşağı ok sonraki, Alt ve yukarı ok önceki değişikliğe gider; ekran okuyucuya hangisi olduğu söylenir.
- **Başlıklar.** `beforeTitle` ve `afterTitle` iki metnin adlarını sütunlarının üstüne yazar; satırın sonunda kaç satırın eklendiği ve çıktığı durur.
- **Hesap.** Fark `diffLines` ile, Myers'ın en kısa düzenlemesiyle bulunur: birkaç bin satırlık metinler hemen, daha uzunları ana iş parçacığının dışında. Uygulama kendi farkını, örneğin bir belgenin anlamının karşılaştırmasını, `DiffLine` listesi olarak verir. `ignoreWhitespace` yalnızca boşlukları değişen satırları aynı sayar.
- **Seçme.** Satırların yazısı seçilir ve sistemin yoluyla kopyalanır; numaralar ve işaretler seçilmez.
- **Ekran okuyucu.** Değişen satırın yazısından sonra hangi tarafı olduğu ve numarası söylenir: "Çıkan, satır 4". Değişmeyen satır bir kez okunur. Başlıkların özeti temanın sözleriyle okunur.
- **Otomasyon.** `tagKey` ile görünüm `DiffView_<tagKey>`, bir satır `Row_<sıra>`, tek sütunda bir değişen satırın iki tarafı `Row_<sıra>_before` ve `Row_<sıra>_after`, katlanan satır `Fold_<sıra>`, başlıklar `Header_titles` olur. Açılan katlanmış satır `expand`, tuşlarla gidilen değişiklik `change` olarak bildirilir.
- **Stil ve renk.** `DiffViewStyle` boşlukları, kenarı ve çubuğu, `DiffViewColors` dolguları, yazıları ve kod renklerini verir; verilmeyen temanınki kalır.

## Kullanım

### Two versions of a file

```kotlin
PantrixDiffView(before = saved, after = edited, beforeTitle = "saved.json", afterTitle = "edited.json", tagKey = "file")
```

### The screen's own list of the changes, each brought into view

```kotlin
val compare = rememberDiffViewState()
val scope = rememberCoroutineScope()
compare.changes.forEachIndexed { at, change ->
    PantrixButton(text = "${change.afterLines}", onClick = { scope.launch { compare.scrollToChange(at) } })
}
PantrixDiffView(
    before = saved,
    after = edited,
    modifier = Modifier.height(400.dp),
    state = compare,
    tagKey = "review"
)
```

## Örnekler

### Bir dosyanın iki sürümü

Bir ayar dosyasının iki sürümü, adlarıyla. `age` satırı başka yazılmış, `city` çıkmış, `team` eklenmiş; geri kalanı aynı. Değişmeyen satırlar demo'nun JSON boyayıcısıyla renklenir. Görünüm genişse yan yana, darsa tek sütundur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.PantrixDiffView

PantrixDiffView(
    before = SAVED,
    after = EDITED,
    highlighter = JsonHighlighter,
    beforeTitle = "saved.json",
    afterTitle = "edited.json",
    tagKey = "versions"
)

private val SAVED =
    """
    {
      "name": "Ada",
      "age": 36,
      "city": "London",
      "active": true
    }
    """.trimIndent()

private val EDITED =
    """
    {
      "name": "Ada",
      "age": 37,
      "active": true,
      "team": "engines"
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `JsonHighlighter`: Yorumlu JSON'un renklendirilecek parçaları, satır satır: iki noktadan önceki ad bir özellik, tırnak içi bir metin, `true`, `false` ve `null` dilin sözcükleri, sayılar sayı, satır ve blok yorumları yorumdur. `PantrixCodeEditor` dil bilmez: neyin ne olduğunu ona çağıranın okuyucusu söyler, bu uygulamada söyleyen de budur.

### Tek sütun

Aynı iki sürüm tek sütunda: bir değişikliğin önce çıkan satırları, altında eklenenler; her satırda iki metnin numarası birden.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.PantrixDiffView

PantrixDiffView(before = SAVED, after = EDITED, layout = DiffLayout.Unified, tagKey = "unified")

private val SAVED =
    """
    {
      "name": "Ada",
      "age": 36,
      "city": "London",
      "active": true
    }
    """.trimIndent()

private val EDITED =
    """
    {
      "name": "Ada",
      "age": 37,
      "active": true,
      "team": "engines"
    }
    """.trimIndent()
```

### Değişikliklere gitmek

Uzun bir metin, yüksekliği verilmiş bir yerde: altmış satırda üç değişiklik. Her değişikliğin önünde ve ardında üç satır kalır, arada kalanlar "Değişmeyen satır" satırına katlanır; birine bas, açılır.

Düğmeler durumun `changes` listesindendir: birine bas, görünüm o değişikliğe en kısa yoldan kayar ve onu başında bir çubukla gösterir. Odak görünümdeyken Alt ve aşağı ok da sonrakine gider.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.diffview.DiffChange
import com.pantrixui.components.data.diffview.PantrixDiffView
import com.pantrixui.components.data.diffview.rememberDiffViewState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val report = LocalExampleEvents.current
val compare = rememberDiffViewState()
val scope = rememberCoroutineScope()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        compare.changes.forEachIndexed { at, change: DiffChange ->
            PantrixButton(
                text = "Satır ${change.afterLines.first}",
                onClick = {
                    scope.launch { compare.scrollToChange(at) }
                    report("Değişiklik ${at + 1}: +${change.added} −${change.removed}")
                },
                variant = if (compare.shownChange == at) ButtonVariant.Solid else ButtonVariant.Outline,
                size = ButtonSize.Small,
                tagKey = "change_$at"
            )
        }
    }
    PantrixDiffView(
        before = LOG_BEFORE,
        after = LOG_AFTER,
        modifier = Modifier.height(320.dp),
        state = compare,
        tagKey = "log"
    )
}

private val LOG_BEFORE = List(60) { "12:${it.toString().padStart(2, '0')} job ${it + 1} done" }.joinToString("\n")

private val LOG_AFTER = LOG_BEFORE.lines().toMutableList().apply {
    set(9, "12:09 job 10 failed")
    removeAt(30)
    add(50, "12:50 job 51 retried")
}.joinToString("\n")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Uygulamanın kendi farkı

Uygulamanın kendi farkı: iki belgenin anlamını karşılaştıran bir uygulama, satırları `DiffLine` olarak verir. Burada anahtarların sırası fark sayılmamış; yalnızca `total`'ın değeri değişmiş ve `note` eklenmiş.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.DiffKind
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.DiffLine
import com.pantrixui.components.data.diffview.PantrixDiffView

val lines = remember {
    listOf(
        DiffLine(DiffKind.Unchanged, "\"id\": 4821,", "\"id\": 4821,", beforeNumber = 2, afterNumber = 3),
        DiffLine(DiffKind.Changed, "\"total\": 249.90,", "\"total\": 259.90,", beforeNumber = 3, afterNumber = 2),
        DiffLine(DiffKind.Added, before = null, after = "\"note\": \"gift\"", afterNumber = 4)
    )
}
PantrixDiffView(lines = lines, layout = DiffLayout.SideBySide, context = null, tagKey = "meaning")
```

### Boşluklar ve bölünmeyen satırlar

`ignoreWhitespace` açıkken yalnızca girintisi değişen satırlar aynı sayılır, ama yazıldıkları gibi gösterilir. `softWrap` kapalıyken uzun satırlar tek satırda kalır ve iki sütun yana birlikte kayar. `diffLines` aynı farkı görünümün dışında hesaplar: burada kaç değişiklik olduğunu söylemek için.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.diffview.DiffKind
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.PantrixDiffView
import com.pantrixui.components.data.diffview.diffLines
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var ignore by rememberSaveable { mutableStateOf(true) }
var wrap by rememberSaveable { mutableStateOf(false) }
val changed = remember(ignore) {
    diffLines(CODE_BEFORE, CODE_AFTER, ignoreWhitespace = ignore).count { it.kind != DiffKind.Unchanged }
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = ignore,
        onCheckedChange = { ignore = it },
        label = "Boşlukları yok say: $changed değişen satır",
        tagKey = "ignore"
    )
    PantrixSwitchButton(
        checked = wrap,
        onCheckedChange = { wrap = it },
        label = "Satırlar bölünsün",
        tagKey = "wrap"
    )
    PantrixDiffView(
        before = CODE_BEFORE,
        after = CODE_AFTER,
        layout = DiffLayout.SideBySide,
        ignoreWhitespace = ignore,
        softWrap = wrap,
        tagKey = "code"
    )
}

private val CODE_BEFORE =
    """
    fun total(items: List<Item>): Double {
        return items.sumOf { it.price * it.count }
    }
    """.trimIndent()

private val CODE_AFTER =
    """
    fun total(items: List<Item>): Double {
            return items.sumOf { it.price * it.count }
    }
    fun totalWithTax(items: List<Item>, rate: Double): Double = total(items) * (1 + rate)
    """.trimIndent()
```

### Kendi renkleri ve stili

Kendi renkleri ve stili: çıkan ve eklenen satırlar uygulamanın rengiyle, gösterilen değişikliğin çubuğu daha kalın, satır numaraları yok.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.diffview.DiffLayout
import com.pantrixui.components.data.diffview.DiffViewColors
import com.pantrixui.components.data.diffview.DiffViewStyle
import com.pantrixui.components.data.diffview.PantrixDiffView
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
PantrixDiffView(
    before = SAVED,
    after = EDITED,
    layout = DiffLayout.Unified,
    lineNumbers = false,
    style = DiffViewStyle(barWidth = 4.dp, gutterGap = 12.dp),
    colors = DiffViewColors(removed = colors.warning.container, added = colors.info.container),
    tagKey = "own"
)

private val SAVED =
    """
    {
      "name": "Ada",
      "age": 36,
      "city": "London",
      "active": true
    }
    """.trimIndent()

private val EDITED =
    """
    {
      "name": "Ada",
      "age": 37,
      "active": true,
      "team": "engines"
    }
    """.trimIndent()
```

## API

### PantrixDiffView

`import com.pantrixui.components.data.diffview.PantrixDiffView`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDiffView(
    before: String,
    after: String,
    modifier: Modifier = Modifier,
    layout: DiffLayout = DiffLayout.Adaptive,
    context: Int? = 3,
    ignoreWhitespace: Boolean = false,
    softWrap: Boolean = true,
    lineNumbers: Boolean = true,
    selectable: Boolean = true,
    highlighter: CodeHighlighter<*>? = null,
    beforeTitle: String? = null,
    afterTitle: String? = null,
    state: DiffViewState = rememberDiffViewState(),
    style: DiffViewStyle? = null,
    colors: DiffViewColors? = null,
    tagKey: String? = null
)
```

İki metnin satır satır karşılaştırması: ikincinin birinciden çıkardığı, eklediği ve başka yazdığı; geniş görünümde yan yana, dar görünümde tek sütunda; iki sütun birlikte kayar.

Sonraki metnin çıkardığı satır danger rolünün yumuşak dolgusunda, önünde bir − ile çizilir; eklediği satır success rolününkinde, bir + ile; başka yazdığı ve eskiden olduğu satırın karşısında duran satırın farklı sözcükleri her ikisinin daha güçlü bir payının üstüne konur. Yalnızca bir metnin sahip olduğu satırın karşısında öteki sütun ince çizgilerle taranır. Değişmeyen satırlar, bir kod bloğunun satırlarını çizdiği gibi, bir `highlighter`'ın belirteçlerine verdiği renklerle çizilir; değişen satırlar dolgularının üstünde okunan tek renkle yazılır.

Her değişiklikten `context` satırdan uzaktaki değişmeyen satırlar tek bir satıra katlanır; o satır kaç satır tuttuğunu söyler ve basınca açılır. Satırlar her metnin numaralandırdığı gibi numaralanır, tek sütunda iki numara birden; fazla uzun bir satır kendi altında sürer ve sıra uzun tarafı kadar yüksek olur; `softWrap` kapalıyken iki sütun yana birlikte kayar.

`state` değişiklikleri, okuyucuya gösterileni, başından inen bir çubukla, ve birini ekrana getirmenin yolunu tutar: `state.scrollToChange(index)`. Odak görünümdeyken Alt ve aşağı ok sonraki değişikliğe, Alt ve yukarı ok öncekine gider, ve ekran okuyucuya hangisi olduğu söylenir. Yükseklik verilen görünüm onun içinde kayar ve yalnızca ekrandaki satırları kurar; yükseklik verilmeyen görünüm, kayan bir sayfada, satırları kadar, en çok pencerenin yüksekliği kadar yüksektir.

Metinler `diffLines` ile karşılaştırılır: birkaç bin satırlık iki metin hemen, daha uzunları ana iş parçacığının dışında; yenisi hazır olana kadar öncekinin karşılaştırması, ilk seferde bir spinner gösterilir. Tek iş parçacığı olan bir tarayıcıda uzun bir karşılaştırma, yapılırken sayfayı tutar. Satırlarının değil de bir belgenin anlamının kendi karşılaştırmasını yapan bir ekran onu, onları alan biçime, `DiffLine`'lar olarak verir.

Kod satırları her dilde soldan dizilir.

```kotlin
PantrixDiffView(before = saved, after = edited, beforeTitle = "saved.json", afterTitle = "edited.json")
```

Parametreler:

- `before: String`: Önceki metin, her satır sonu bir satır.
- `after: String`: Sonraki metin.
- `modifier: Modifier`: Görünümün modifier'ı. Burada verilen yükseklik satırların içinde kaydığı yerdir.
- `layout: DiffLayout`: İki metnin nasıl dizildiği: görünümün genişliğine göre yan yana ya da tek sütunda, ya da hep bir türlü.
- `context: Int?`: Kalanı katlanmadan önce her değişikliğin önünde ve ardında kaç değişmeyen satır durduğu: varsayılan üç; null olduğu yerde hiçbiri katlanmaz.
- `ignoreWhitespace: Boolean`: Yalnızca boşluklarında ayrılan iki satırın aynı sayılıp sayılmadığı: her biri yazıldığı gibi gösterilir.
- `softWrap: Boolean`: Sütununa fazla uzun gelen satırın kendi altında sürüp sürmediği. False her satırı tek satırda tutar ve sütunlar yana birlikte kayar.
- `lineNumbers: Boolean`: Her satırın, işaretinden önce, kendi metnindeki numarasını taşıyıp taşımadığı.
- `selectable: Boolean`: Satırların yazdığının, bir imleçle üstünden sürüklenerek ya da parmakla basılı tutularak seçilip sistemin kendi yoluyla kopyalanıp kopyalanamadığı. Numaralar ve işaretler seçilmez.
- `highlighter: CodeHighlighter<*>?`: Değişmeyen satırların belirteçlerini ne boyadığı, bir kod düzenleyicisininki gibi: varsayılanı yok, satırlar metnin rengiyle yazılır.
- `beforeTitle: String?`: Önceki metnin adı, sütununun üstünde: bir dosyanın adı, bir sürüm. `afterTitle` ile satırların üstünde bir başlık satırı kurar, sonunda kaç satırın eklenip çıkarıldığıyla; ikisi de yoksa görünümün böyle bir satırı olmaz.
- `afterTitle: String?`: Sonraki metnin adı, sütununun üstünde.
- `state: DiffViewState`: Değişiklikler, gösterilen, ve satırların nereye kaydırıldığı.
- `style: DiffViewStyle?`: Bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar, her platformda, değişir.
- `colors: DiffViewColors?`: Bu görünümün, temanınkiler olmadığı yerdeki kendi renkleri: burada verilenler, gerisi için temanınkiler.
- `tagKey: String?`: Görünümün otomasyon anahtarı: görünüm `DiffView_<tagKey>`, içindeki bir satır satırı, karşılaştırmanın satırları arasındaki sırasıyla `DiffView_<tagKey>.Row_<line>`, tek sütunda değişen bir satırın iki tarafı `Row_<line>_before` ve `Row_<line>_after`, katlanan satırların satırı ilk satırının sırasıyla `DiffView_<tagKey>.Fold_<line>`, başlıkların satırı `DiffView_<tagKey>.Header_titles` olur. Açılan bir satır kaç satır tuttuğuyla `DiffView` olayı `expand`, tuşlarla gidilen bir değişiklik sırasıyla `change` olarak bildirilir. Metinlerden hiçbir şey bildirilmez.

### PantrixDiffView

`import com.pantrixui.components.data.diffview.PantrixDiffView`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDiffView(
    lines: List<DiffLine>,
    modifier: Modifier = Modifier,
    layout: DiffLayout = DiffLayout.Adaptive,
    context: Int? = 3,
    softWrap: Boolean = true,
    lineNumbers: Boolean = true,
    selectable: Boolean = true,
    highlighter: CodeHighlighter<*>? = null,
    beforeTitle: String? = null,
    afterTitle: String? = null,
    state: DiffViewState = rememberDiffViewState(),
    style: DiffViewStyle? = null,
    colors: DiffViewColors? = null,
    tagKey: String? = null
)
```

Çağıranının yaptığı bir karşılaştırma için `PantrixDiffView`: satırlarının değil bir belgenin anlamının karşılaştırması, ya da `diffLines`'ın ekranın dışında yapılmış satırları.

Parametreler:

- `lines: List<DiffLine>`: Karşılaştırmanın satırları, metinlerin onları tuttuğu sırayla; değişiklikler `DiffKind.Unchanged` olmayan satırların dizileridir.
- `modifier: Modifier`: Görünümün modifier'ı. Burada verilen yükseklik satırların içinde kaydığı yerdir.
- `layout: DiffLayout`: İki metnin nasıl dizildiği.
- `context: Int?`: Kalanı katlanmadan önce her değişikliğin önünde ve ardında kaç değişmeyen satır durduğu; null hiçbirini katlamaz.
- `softWrap: Boolean`: Sütununa fazla uzun gelen satırın kendi altında sürüp sürmediği.
- `lineNumbers: Boolean`: Her satırın kendi metnindeki numarasını taşıyıp taşımadığı.
- `selectable: Boolean`: Satırların yazdığının seçilip sistemin kendi yoluyla kopyalanıp kopyalanamadığı.
- `highlighter: CodeHighlighter<*>?`: Değişmeyen satırların belirteçlerini ne boyadığı; her metnin satırlarını sırayla okur.
- `beforeTitle: String?`: Önceki metnin adı, sütununun üstünde.
- `afterTitle: String?`: Sonraki metnin adı, sütununun üstünde.
- `state: DiffViewState`: Değişiklikler, gösterilen, ve satırların nereye kaydırıldığı.
- `style: DiffViewStyle?`: Bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında.
- `colors: DiffViewColors?`: Bu görünümün, temanınkiler olmadığı yerdeki kendi renkleri.
- `tagKey: String?`: Görünümün otomasyon anahtarı, öteki biçimdeki gibi.

### DiffLine

`import com.pantrixui.components.data.diffview.DiffLine`, `com.pantrixui:components` içinden

```kotlin
class DiffLine(
    public val kind: DiffKind,
    public val before: String?,
    public val after: String?,
    public val beforeNumber: Int? = null,
    public val afterNumber: Int? = null,
    public val beforeMarks: List<TextRange> = emptyList(),
    public val afterMarks: List<TextRange> = emptyList()
)
```

İki metnin karşılaştırmasının bir satırı, bir `PantrixDiffView`'in gösterdiği gibi: bir sırada önceki metnin satırı ve sonraki metinde onun yerini tutan satır, ya da yalnızca biri.

```kotlin
// What an app's own comparison found, as a view's lines.
DiffLine(DiffKind.Changed, before = "\"total\": 1", after = "\"total\": 2", beforeNumber = 4, afterNumber = 4)
```

Parametreler:

- `kind: DiffKind`: Satırın ne olduğu: iki metinde de var, çıkarılmış, eklenmiş ya da başka yazılmış.
- `before: String?`: Satır, önceki metnin yazdığı gibi, satır sonu olmadan: eklenmiş bir satır için null.
- `after: String?`: Satır, sonraki metnin yazdığı gibi: çıkarılmış bir satır için null.
- `beforeNumber: Int?`: Satırın önceki metindeki numarası, birden: `before`'un null olduğu yerde null.
- `afterNumber: Int?`: Satırın sonraki metindeki numarası: `after`'ın null olduğu yerde null.
- `beforeMarks: List<TextRange>`: `before`'un sonraki metinde olmayan parçaları, bir `DiffKind.Changed` satırın değişen sözcükleri: her biri başladığı ve bittiği karakterle. Varsayılanı yok.
- `afterMarks: List<TextRange>`: `after`'ın önceki metinde olmayan parçaları.

### DiffKind

`import com.pantrixui.components.data.diffview.DiffKind`, `com.pantrixui:components` içinden

```kotlin
enum class DiffKind
```

Bir `DiffLine`'ın iki metnin karşılaştırmasında ne olduğu.

Değerleri:

- `Unchanged`: Satır iki metinde de olduğu gibi var.
- `Removed`: Satır yalnızca önceki metinde var: sonraki onu çıkarmış.
- `Added`: Satır yalnızca sonraki metinde var: eklenmiş.
- `Changed`: Önceki metnin, sonrakinin başka yazdığı bir satırı: ikisi yan yana durur.

### DiffChange

`import com.pantrixui.components.data.diffview.DiffChange`, `com.pantrixui:components` içinden

```kotlin
class DiffChange(
    public val firstLine: Int,
    public val lineCount: Int,
    public val beforeLines: IntRange,
    public val afterLines: IntRange
)
```

Bir karşılaştırmanın bir değişikliği: iki değişmeyen satır dizisi arasında birlikte duran satırlar; bir `DiffViewState` ona kaydırır ve onu gösterir.

Parametreler:

- `firstLine: Int`: Değişikliğin ilk satırının karşılaştırmanın `DiffLine`'ları arasındaki sırası.
- `lineCount: Int`: Değişikliğin o satırlardan kaçını tuttuğu: iki metni yan yana gösteren bir görünümün her sırası için bir.
- `beforeLines: IntRange`: Değişikliğin çıkardığı ya da başka yazdığı önceki metin satırlarının numaraları, birden. Hiçbirini tutmadığı yerde, ardından geldiği satırdan başlayan boş bir aralık: dördüncüden sonra satır ekleyen bir değişiklik için `5..4`.
- `afterLines: IntRange`: Değişikliğin eklediği ya da başka yazdığı sonraki metin satırlarının numaraları; hiçbirini eklemediği yerde boş bir aralık.

Üyeleri:

- `removed: Int`: Değişikliğin önceki metinden kaç satır çıkardığı, başka yazdıkları da içinde.
- `added: Int`: Değişikliğin sonraki metne kaç satır eklediği, başka yazdıkları da içinde.

### diffLines

`import com.pantrixui.components.data.diffview.diffLines`, `com.pantrixui:components` içinden

```kotlin
fun diffLines(
    before: String,
    after: String,
    ignoreWhitespace: Boolean = false
): List<DiffLine>
```

`before` ve `after`'ın satırları birbiriyle karşılaştırılmış: birini ötekine çeviren en kısa düzenleme, satır satır, bir `PantrixDiffView`'in gösterdiği `DiffLine`'lar olarak.

İki değişmeyen satır dizisi arasında duran satırlar bir değişikliktir. Çıkardığı ve eklediği satırlardan en çok benzeyenleri, her birinde farklı sözcükler işaretli, `DiffKind.Changed` satırlar olarak yan yana durur; onların arasında kalanlar baştan başlayarak yan yana durur, bir tarafın fazlası tek başına durur: `DiffKind.Removed` ya da `DiffKind.Added`.

Düzenleme Myers'ınkidir. Süresi metinlerin uzunluğu çarpı ne kadar farklı oldukları kadar büyür: birkaç satırla ayrılan binlerce satırlık iki metin hemen karşılaştırılır, her satırında ayrılan ikisi daha uzun sürer. İki uzun metin verilen görünüm onları ana iş parçacığının dışında karşılaştırır; kendi yerinde, bir model olarak karşılaştıran bir ekran görünüme bunun döndürdüğünü verir.

```kotlin
val lines = withContext(Dispatchers.Default) { diffLines(saved, edited) }
```

Döndürdüğü: satırlar, metinlerin onları tuttuğu sırayla.

Parametreler:

- `before: String`: Önceki metin, her satır sonu bir satır; bir satır sonundan önceki satır başı satırın parçası değildir, metnin sonundaki satır sonu da ardından bir satır başlatmaz.
- `after: String`: Sonraki metin.
- `ignoreWhitespace: Boolean`: Yalnızca boşluklarında ayrılan iki satırın aynı olup olmadığı: uçlarında ve sözcükleri arasında kaç boşluğun birlikte durduğunda. Her biri yine yazıldığı gibi gösterilir, değişen bir satır hiçbir boşluğu işaretlemez.

### DiffLayout

`import com.pantrixui.components.data.diffview.DiffLayout`, `com.pantrixui:components` içinden

```kotlin
enum class DiffLayout
```

Bir `PantrixDiffView`'in iki metni nasıl dizdiği.

Değerleri:

- `Adaptive`: Görünüm en az pencerenin medium eşiği kadar genişse yan yana, altında tek sütunda.
- `SideBySide`: Önceki metin bir sütunda, sonraki yanında; her satır, onun yerini tutan satırın karşısında.
- `Unified`: Tek sütun: her değişikliğin önceki metindeki satırları, altlarında sonraki metindeki satırları.

### DiffViewState

`import com.pantrixui.components.data.diffview.DiffViewState`, `com.pantrixui:components` içinden

```kotlin
class DiffViewState(public val listState: LazyListState = LazyListState())
```

Bir `PantrixDiffView`'in bir kompozisyondan ötekine tuttuğu, onu okuyan ya da hareket ettiren bir ekran için: gösterdiği değişiklikler, okuyucusuna gösterilen, ve satırlarının nereye kaydırıldığı.

```kotlin
val compare = rememberDiffViewState()
PantrixDiffView(before = saved, after = edited, state = compare)
// The screen's own list of the changes, each a button that brings its change into view.
compare.changes.forEachIndexed { at, change ->
    PantrixButton(text = "Lines ${change.afterLines}", onClick = { scope.launch { compare.scrollToChange(at) } })
}
```

Bir durum tek bir görünümündür: aynı durum verilen iki görünüm birbirini kaydırır.

Parametreler:

- `listState: LazyListState`: Satırların içinde kaydığı listenin durumu: ne kadar kaydırıldıkları ve hangilerinin ekranda olduğu.

Üyeleri:

- `changes: List<DiffChange>`: Görünümün şimdi gösterdiklerinin değişiklikleri, sırayla: metinlerini karşılaştırmadan önce hiçbiri.
- `shownChange: Int?`: Okuyucuya gösterilen değişikliğin `changes` arasındaki sırası, başından inen bir çubukla çizilir, ya da hiçbiri için null. `scrollToChange` onu belirler, görünümdeki Alt ile aşağı ve yukarı oklar da; bir ekran görünümü kaydırmadan bir değişikliği işaretlemek için onu kendisi verir, işareti kaldırmak için null verir. Hiçbir değişikliğin olmadığı bir sıra hiçbir şeyi işaretlemez.
- `suspend fun scrollToChange(index: Int): Boolean`: `changes`'in `index`'teki değişikliğini gösterir ve ekrana getirir, kısa yoldan ve gerekenden öteye gitmeden: yukarıdaki değişiklik üste, aşağıdaki alta, görünümden uzun olan ilk satırı üstte gelir, ekrandaki yerinde kalır. Görünüm metinlerini karşılaştırıp yerleşmeden önce istenen bir değişiklik bunu bekler.

  Döndürdüğü: böyle bir değişikliğin olup olmadığı: `changes`'in tutmadığı bir sıra için false.

### rememberDiffViewState

`import com.pantrixui.components.data.diffview.rememberDiffViewState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberDiffViewState(listState: LazyListState = rememberLazyListState()): DiffViewState
```

Kaydedilen bir durumun korunduğu şeylerde, listesininki gibi, korunan bir `DiffViewState`: ekranın dönmesi, başka bir ekrana gidip dönmek. Hangi değişikliğin gösterildiği korunmaz: metinler o zamana başka olabilir.

Parametreler:

- `listState: LazyListState`: Satırların içinde kaydığı listenin durumu, onu kendisi tutan bir ekran için.

### DiffViewStyle

`import com.pantrixui.components.data.diffview.DiffViewStyle`, `com.pantrixui:components` içinden

```kotlin
class DiffViewStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val gutterGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val barWidth: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<DiffViewStyle>
```

`PantrixDiffView`'in geometrisi: satırlarının çevresindeki ve içindeki boşluk, numaralanan satırların önündeki yer, kenar, gösterilen değişikliğin çubuğu ve başlıkların satırı.

Satırlar, kod satırları gibi, sık durur: temanın kod yazısıyla bir satır 20dp'dir; Android sözcüklerinin üstünde ve altında 2dp, iOS 1dp, masaüstü ve web hiç boşluk bırakmaz. Katlanan satırların satırına basılır; parmakla basıldığı yerde platformun dokunma hedefi kadar yüksektir.

Parametreler:

- `shape: ShapeSpec`: Görünümün köşeleri: markanın şekil ölçeğinden bir adım ya da sabit bir şekil.
- `horizontalPadding: Dp`: Bir sütunun kenarlarıyla tuttuğu arasındaki boşluk; değişikliklerin dolguları onun üstünden, kenarlara kadar çizilir.
- `verticalPadding: Dp`: İlk satırın üstündeki ve son satırın altındaki boşluk, başlıkların üstündeki ve altındaki de.
- `linePadding: Dp`: Her satırın sözcüklerinin üstündeki ve altındaki boşluk.
- `gutterGap: Dp`: Bir satırın numarası, işareti ve sözcükleri arasındaki boşluk.
- `borderWidth: Dp`: Görünümün çevresindeki kenarın, iki sütunu arasındaki çizginin ve başlıklarının altındaki çizginin kalınlığı. Sıfır hiçbirini çizmez.
- `barWidth: Dp`: Gösterilen değişikliğin başından inen çubuğun kalınlığı. Sıfır çizmez.
- `iconSize: Dp`: Katlanan satırların satırındaki simgenin eni ve boyu.

### DiffViewColors

`import com.pantrixui.components.data.diffview.DiffViewColors`, `com.pantrixui:components` içinden

```kotlin
data class DiffViewColors(
    public val container: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val comment: Color = Color.Unspecified,
    public val keyword: Color = Color.Unspecified,
    public val type: Color = Color.Unspecified,
    public val string: Color = Color.Unspecified,
    public val number: Color = Color.Unspecified,
    public val punctuation: Color = Color.Unspecified,
    public val annotation: Color = Color.Unspecified,
    public val property: Color = Color.Unspecified,
    public val tag: Color = Color.Unspecified,
    public val lineNumber: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val removed: Color = Color.Unspecified,
    public val removedContent: Color = Color.Unspecified,
    public val removedWord: Color = Color.Unspecified,
    public val added: Color = Color.Unspecified,
    public val addedContent: Color = Color.Unspecified,
    public val addedWord: Color = Color.Unspecified,
    public val gap: Color = Color.Unspecified,
    public val fold: Color = Color.Unspecified,
    public val foldContent: Color = Color.Unspecified,
    public val shown: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir `PantrixDiffView`'in neyle boyandığı: verilen renk kullanılır, verilmeyen temanınki kalır.

Değişmeyen satırlar, bir kod bloğunun satırlarını çizdiği gibi çizilir: temanın zeminlerinde her tür belirtecin kendi rengi vardır. Çıkarılan ya da eklenen bir satır kendi rolünün yumuşak dolgusunda çizilir ve tamamı orada okunan tek renkle yazılır, bir kod bloğunun işaretli satırı gibi; değişen sözcükleri rolün daha güçlü bir payının üstündedir. Burada temanın rol renklerinden biri olarak verilen bir `removed` ya da `added`, `removedContent` ya da `addedContent` de verilmedikçe temanın onun üstüne yazdığını getirir.

Parametreler:

- `container: Color`: Satırların arkasındaki dolgu: temanın `surface`'ı.
- `text: Color`: Hiçbir belirtecin boyamadığı. Temanın `textPrimary`'si.
- `comment: Color`: Bir yorum; eğik de yazılır. Temanın `textSecondary`'si.
- `keyword: Color`: Dilin bir sözcüğü. Temanın primary rolü.
- `type: Color`: Bir türün adı. Temanın info rolü.
- `string: Color`: Bir metin değeri. Temanın success rolü.
- `number: Color`: Bir sayı. Temanın warning rolü.
- `punctuation: Color`: Parantezler, virgüller ve noktalı virgüller. Temanın `textSecondary`'si.
- `annotation: Color`: Ardından gelen hakkında bir şey söyleyen bir ad. Temanın danger rolü.
- `property: Color`: Bir üyenin ya da bir ayarın adı. Verilmediği yerde `type`'ın rengi.
- `tag: Color`: Bir işaretleme dilindeki bir öğenin adı. Verilmediği yerde `keyword`'ün rengi.
- `lineNumber: Color`: Satır numaraları ve değişmeyen satırların işaretleri, başlıkların özeti ve kaydırma çubukları. Temanın `textSecondary`'si.
- `border: Color`: Görünümün çevresindeki kenar, iki sütunu arasındaki çizgi ve başlıklarının altındaki çizgi. Temanın `divider`'ı.
- `removed: Color`: Sonraki metnin çıkardığı bir satırın dolgusu: danger rolünün `container`'ı.
- `removedContent: Color`: `removed`'ın üstüne yazılan: danger rolünün `onContainer`'ı.
- `removedWord: Color`: Değişen bir satırın çıkardığı sözcüklerin arkasına konan: danger rolünün daha güçlü bir payı; çağıranın kendi `removed`'ının üstünde ise orada yazılanın bir payı.
- `added: Color`: Sonraki metnin eklediği bir satırın dolgusu: success rolünün `container`'ı.
- `addedContent: Color`: `added`'ın üstüne yazılan: success rolünün `onContainer`'ı.
- `addedWord: Color`: Değişen bir satırın eklediği sözcüklerin arkasına konan: success rolünün daha güçlü bir payı; çağıranın kendi `added`'ının üstünde ise orada yazılanın bir payı.
- `gap: Color`: Bir satırın, yalnızca bir metnin satırı olduğu tarafının üstündeki çapraz çizgiler: temanın `divider`'ı.
- `fold: Color`: Katlanan satırların satırının dolgusu: temanın `background`'u, görünümün `surface`'ından bir adım.
- `foldContent: Color`: Katlanan satırların satırının söylediği ve simgesi: temanın `textSecondary`'si.
- `shown: Color`: Gösterilen değişikliğin başından inen çubuk: primary rolünün rengi.

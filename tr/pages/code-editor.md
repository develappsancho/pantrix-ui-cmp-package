# Code Editor

Yazılan ve değiştirilen kod: her uzunlukta bir metin, satır satır, her parçası ne olduğunun renginde, satırları numaralı. Bir ayar dosyası, bir sorgu kutusu, bir betik, bir JSON belgesi böyle düzenlenir.

Editör gösterdiği dili bilmez. Kodu renklendiren, çağıranın verdiği okuyucudur (`highlighter`): bir satırı, önceki satırın bittiği durumdan okur ve parçalarını söyler. Bu sayfada çoğu örneği uygulamanın kendi JSON okuyucusu renklendirir.

- `PantrixCodeEditor` (`com.pantrixui.components.data.codeeditor`, `com.pantrixui:components`): Yazılan ve değiştirilen kod: satır satır tutulan, her uzunlukta bir metin; uygulamanın kendi okuyucusuyla renklenir, satırları numaralıdır, bir editörün tuşları vardır ve sözcük sözcük geri alınır. Anahtar sözcükler: kod editörü, kod düzenleyici, kaynak kod, söz dizimi renklendirme, metin editörü, json editörü, eş aralıklı.

## Özellikler

- **Durum.** Metin, seçim ve geçmiş `CodeEditorState`'tedir; onu `rememberCodeEditorState` kurar. Metin satır satır tutulur: megabaytlarca bir metin hemen açılır ve kısa bir metin gibi yazılır. Durum metni (`text`), satır sayısını (`lineCount`), bir satırı (`line`), bir yerin satırını (`lineOf`) ve bir satırın başını (`lineStart`) söyler; `revision` her değişiklikte artar. `revealLines` satırları imleci taşımadan ekrana getirir.
- **Uygulamanın değişiklikleri.** `replace` bir yeri değiştirir, `setText` metnin tamamını, `edit` birkaç yeri tek adımda; hepsi geri alınır. `undo` ve `redo` bir sözcüklük yazıyı birden geri alır ve yineler; `canUndo` ve `canRedo` yapılacak bir şey olup olmadığını söyler.
- **Okuyucu.** `CodeHighlighter`, bir satırı ve önceki satırın bittiği durumu alır, satırın parçalarını ve bittiği durumu (`CodeHighlight`) verir. Editör satırları ana iş parçacığından uzakta okur; bir değişiklikten sonra yalnızca değişikliğin, sonraki satırın okunduğu durumu değiştirdiği yere kadar.
- **Sözdizimi.** `CodeSyntax` dilin parantezlerini, tırnaklarını ve yorumlarını söyler: yazılan parantez ve tırnak hemen kapanır (`closesPairs`), editörün koyduğu kapanış yazılınca üstünden geçilir; Ctrl+/ satırları yoruma alır.
- **Girinti.** `indent` bir girinti adımıdır: iki boşluk ya da bir sekme. Tab girer, Shift+Tab çıkar, bir seçimin satırları birlikte; satır besleme satırın girintisini taşır, açılan bir parantezden sonra bir adım fazlasını.
- **Satır tuşları.** Alt+Yukarı ve Alt+Aşağı satırları taşır, Shift ile kopyalar; Ctrl+Shift+K siler; Ctrl+Shift+\ eşleşen paranteze gider. Mac'te Ctrl'ün yerine Cmd.
- **İşaretler.** Bir satırın işareti (`lineMarks`) satırın arkasına tonunun dolgusunu, kenarına bir çubuk çizer; çubuğun kendi tonu (`bar`) olabilir ya da hiç çubuğu olmayabilir (`showBar`), numarasının önünde bir işareti (`gutter`) olabilir. İmleç işaretli bir satıra gelince satır kendi bandında kalır. Bir parçanın işareti (`CodeRangeMark`) altına dalgalı bir çizgi, satırının başına bir nokta koyar, ya da arkasını bir dolguyla boyar (`CodeRangeStyle`); mesajı imleç oradayken ya da fare üstündeyken görünür.
- **Bul ve değiştir.** Ctrl+F bul çubuğunu açar, Ctrl+H değiştirme satırıyla; büyük-küçük harf, tam sözcük ve düzenli ifade seçilir. Bütün eşleşmeler metinde ve kaydırma çubuğunda işaretlenir. Uygulama çubuğu `find` ile açar, aynı işleri çubuksuz `findNext`, `findAll`, `replaceNext` ve `replaceAll` ile yapar.
- **Telefonun tuş satırı.** Telefonda editör odaktayken altında bir tuş satırı durur: Tab, kod yazılan parantez ve işaretler, geri al, yinele ve oklar. Uygulama kendi satırını `keyRow` ile verir (`CodeKey`).
- **Uzun satırlar.** Sığmayan satır bölünmez: kod yana kayar, satır numaraları yerinde durur. `softWrap` ile satır editörün genişliğinde alttan devam eder, numarası ilk sırasının yanında durur. On bin karakterden uzun bir satır oraya kadar gösterilir, sonunda ne kadar kaldığını söyleyen bir işaretle; satır bütün olarak tutulur.
- **Renk ve stil.** `CodeEditorColors` ile verilen renk kullanılır, verilmeyen temanınki kalır; `CodeEditorStyle` köşeleri, boşlukları ve kenarın kalınlığını değiştirir.
- **Klavye.** Tab girinti ekler; Escape'ten sonra Tab odağı ileri, Shift+Tab geri taşır: klavye editörden her zaman çıkar.
- **Ekran okuyucu.** Editörün adı `contentDescription`'dır, verilmezse "Code editor". Klavyeyle yazılan bir platformda ekran okuyucuya Tab'ın ne yaptığı ve nasıl çıkılacağı da söylenir. Bir işaretin mesajı ve bul çubuğunun sayacı değiştikçe söylenir; satır numaraları okunmaz.
- **Otomasyon.** `tagKey` ile editörün alanı `CodeEditor_<tagKey>`, pencerenin dışındaki bir satır `CodeEditor_<tagKey>.Line_<number>`, bir işaretin mesajı `CodeEditor_<tagKey>.Note_<number>`, bul alanı `CodeEditor_<tagKey>.TextField_find` olur.

## Kullanım

### A file of settings, coloured by the app's own highlighter

```kotlin
val state = rememberCodeEditorState(initialText = settings)
PantrixCodeEditor(
    state = state,
    modifier = Modifier.height(320.dp),
    highlighter = IniHighlighter,
    tagKey = "settings"
)
```

### A query, run once the typing has paused

```kotlin
val query = rememberCodeEditorState("$.store.book[*].author")
LaunchedEffect(query) {
    snapshotFlow { query.revision }.collectLatest {
        delay(300)
        onQuery(query.text)
    }
}
PantrixCodeEditor(state = query, modifier = Modifier.height(96.dp), lineNumbers = false, tagKey = "query")
```

### A file to be read and copied, not changed

```kotlin
PantrixCodeEditor(
    state = rememberCodeEditorState(initialText = file.text),
    modifier = Modifier.height(480.dp),
    readOnly = true,
    tagKey = "file"
)
```

## Örnekler

### Bir JSON belgesi

Yorumlu bir JSON belgesi, uygulamanın kendi okuyucusuyla renklendirilmiş. Sözdizimi JSON'un parantezlerini, tek tırnağını ve satır yorumunu söyler: `{` yazınca `}` hemen gelir, Enter ikisinin arasına girintili bir satır açar, Ctrl+/ satırı yoruma alır.

Dördüncü satır bir uyarıyla işaretli, uygulamanın adı ise bir hatayla: imleci üstlerine getir ya da fareyle üstlerine gel, mesajları altlarında görünür.

Hatanın mesajının altında iki eylem var (`CodeMark.actions`, `CodeMarkAction`): "Adı kısalt" adı düzeltir ve hata kalkar, "Kuralı göster" kuralı söyler. Fare notun üstündeyken not yerinde kalır; imleç hatanın içindeyken Ctrl+. (Apple'ın sistemlerinde Cmd+.) odağı ilk eyleme götürür, Escape metne geri getirir.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeMarkAction
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeeditor.CodeRangeMark
import com.pantrixui.components.data.codeeditor.CodeSyntax
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState

val state = rememberCodeEditorState(initialText = SETTINGS)
val report = LocalExampleEvents.current
val name = remember(state.revision) { state.text.indexOf("\"Formatico\"") }
PantrixCodeEditor(
    state = state,
    modifier = Modifier.height(320.dp),
    highlighter = JsonHighlighter,
    syntax = CodeSyntax(quotes = "\"", lineComment = "//", blockCommentStart = "/*", blockCommentEnd = "*/"),
    lineMarks = mapOf(3 to CodeMark(CodeTone.Warning, message = "Bu sürüm artık desteklenmiyor.")),
    rangeMarks = if (name < 0) {
        emptyList()
    } else {
        val end = name + "\"Formatico\"".length
        listOf(
            CodeRangeMark(
                start = name,
                end = end,
                mark = CodeMark(
                    CodeTone.Danger,
                    message = "Ad en çok 8 harf olabilir.",
                    source = "şema",
                    actions = listOf(
                        CodeMarkAction("Adı kısalt") { state.replace(name, end, "\"Formati\"") },
                        CodeMarkAction("Kuralı göster") { report("Şema: name en çok 8 harf") }
                    )
                )
            )
        )
    },
    tagKey = "settings"
)

private val SETTINGS = """
{
  // What the app opens with.
  "name": "Formatico",
  "version": 3,
  /* The themes it offers,
     the first one by default. */
  "themes": ["light", "dark"],
  "fontSize": 14.5,
  "telemetry": false,
  "lastOpened": null
}
""".trimStart()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.
- `JsonHighlighter`: Yorumlu JSON'un renklendirilecek parçaları, satır satır: iki noktadan önceki ad bir özellik, tırnak içi bir metin, `true`, `false` ve `null` dilin sözcükleri, sayılar sayı, satır ve blok yorumları yorumdur. `PantrixCodeEditor` dil bilmez: neyin ne olduğunu ona çağıranın okuyucusu söyler, bu uygulamada söyleyen de budur.

### Uygulamanın düğmeleriyle bul ve değiştir

Bul çubuğunu uygulama da açar: "Bul" yalnızca arama alanını, "Değiştir" değiştirme satırıyla, aranacak `TODO` ve yerine yazılacak `DONE` hazır. Çubuk açıkken bütün eşleşmeler metinde ve kaydırma çubuğunda işaretlidir.

Aynı işleri durum çubuksuz da yapar: "Sonraki" bir sonraki eşleşmeyi seçer, "Bitir" seçili eşleşmeyi değiştirip sonrakini seçer, "Hepsini bitir" hepsini tek bir geri alınacak adımda değiştirir. Altındaki sayı `findAll`'ındır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.CodeSearch
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.findAll
import com.pantrixui.components.data.codeeditor.findNext
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.data.codeeditor.replaceAll
import com.pantrixui.components.data.codeeditor.replaceNext
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberCodeEditorState(initialText = TASKS)
val todo = CodeSearch("TODO", matchCase = true, wholeWord = true)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixButton(
            text = "Bul",
            onClick = { state.find.open() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "find"
        )
        PantrixButton(
            text = "Değiştir",
            onClick = {
                state.find.search = todo
                state.find.replacement = "DONE"
                state.find.open(replacing = true)
            },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "replace"
        )
        PantrixButton(
            text = "Kapat",
            onClick = { state.find.close() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            enabled = state.find.isOpen,
            tagKey = "close"
        )
        PantrixButton(
            text = "Sonraki",
            onClick = { state.findNext(todo) },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "next"
        )
        PantrixButton(
            text = "Bitir",
            onClick = { state.replaceNext(todo, "DONE") },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "done"
        )
        PantrixButton(
            text = "Hepsini bitir",
            onClick = { state.replaceAll(todo, "DONE") },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "doneAll"
        )
    }
    PantrixCodeEditor(state = state, modifier = Modifier.height(240.dp), tagKey = "tasks")
    PantrixText(text = "Kalan TODO: ${state.findAll(todo).size}", color = PantrixTheme.colors.textSecondary)
}

private val TASKS = """
# Before the release
TODO: write the changelog
TODO: record the screenshots again
DONE: raise the version
TODO: push the tag
""".trimStart()
```

### Kendi tuş satırıyla bir sorgu

Tek satırlık bir sorgu kutusu: satır numarası yok, sorgu yazı durduktan 300 ms sonra çalışır. Telefonda editör odaktayken altında sorgunun kendi tuşları durur: JSONPath'in işaretleri, iki ok ve geri al.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.CodeKey
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest

val query = rememberCodeEditorState("$.store.book[*].author")
var ran by remember { mutableStateOf(query.text) }
LaunchedEffect(query) {
    snapshotFlow { query.revision }.collectLatest {
        delay(300)
        ran = query.text
    }
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixCodeEditor(
        state = query,
        modifier = Modifier.height(96.dp),
        keyRow = PATH_KEYS,
        lineNumbers = false,
        contentDescription = "JSONPath sorgusu",
        tagKey = "query"
    )
    PantrixText(text = "Çalışan sorgu: $ran", color = PantrixTheme.colors.textSecondary)
}

private val PATH_KEYS: List<CodeKey> =
    listOf("$", ".", "[", "]", "*", "?", "@", "'").map { CodeKey.Text(it) } +
        listOf(CodeKey.Left, CodeKey.Right, CodeKey.Undo)
```

### Durum uygulamanın elinde

Durum uygulamanın elindedir. "Geri al" ve "Yinele" editörün geçmişini kullanır ve yapılacak bir şey yokken kapalıdır. "Ayıklama ekle" iki yeri tek adımda değiştirir (`edit`), "Başa yorum" bir yere yazar (`replace`), "Sıfırla" metnin tamamını değiştirir (`setText`); üçü de geri alınır.

Altındaki satır imlecin satırını, sütununu ve satırın kendisini söyler: durum bunları satır satır tuttuğu metinden hemen verir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberCodeEditorState(initialText = SETTINGS)
val caret = state.selection.end
val line = state.lineOf(caret)
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixButton(
            text = "Geri al",
            onClick = { state.undo() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            enabled = state.canUndo,
            tagKey = "undo"
        )
        PantrixButton(
            text = "Yinele",
            onClick = { state.redo() },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            enabled = state.canRedo,
            tagKey = "redo"
        )
        PantrixButton(
            text = "Ayıklama ekle",
            onClick = {
                val last = state.text.lastIndexOf("null") + "null".length
                val member = ",\n  \"debug\": true"
                val note = "  // Debugging is on.\n"
                state.edit {
                    // İki yer, tek bir geri alınacak adımda: önce sondaki, öndekinin yeri kaymasın diye.
                    replace(last, last, member)
                    replace(2, 2, note)
                    selection = TextRange(last + member.length + note.length)
                }
            },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "debug"
        )
        PantrixButton(
            text = "Başa yorum",
            onClick = { state.replace(0, 0, "// Formatico's settings.\n") },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "comment"
        )
        PantrixButton(
            text = "Sıfırla",
            onClick = { state.setText(SETTINGS) },
            variant = ButtonVariant.Soft,
            size = ButtonSize.Small,
            tagKey = "reset"
        )
    }
    PantrixCodeEditor(
        state = state,
        modifier = Modifier.height(280.dp),
        highlighter = JsonHighlighter,
        tagKey = "state"
    )
    PantrixText(
        text = "Satır ${line + 1} / ${state.lineCount}, sütun ${caret - state.lineStart(line) + 1}: " +
            state.line(line).trim(),
        color = PantrixTheme.colors.textSecondary
    )
}

private val SETTINGS = """
{
  // What the app opens with.
  "name": "Formatico",
  "version": 3,
  /* The themes it offers,
     the first one by default. */
  "themes": ["light", "dark"],
  "fontSize": 14.5,
  "telemetry": false,
  "lastOpened": null
}
""".trimStart()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `JsonHighlighter`: Yorumlu JSON'un renklendirilecek parçaları, satır satır: iki noktadan önceki ad bir özellik, tırnak içi bir metin, `true`, `false` ve `null` dilin sözcükleri, sayılar sayı, satır ve blok yorumları yorumdur. `PantrixCodeEditor` dil bilmez: neyin ne olduğunu ona çağıranın okuyucusu söyler, bu uygulamada söyleyen de budur.

### Salt okunur bir dosya

Okunan ve kopyalanan ama değiştirilmeyen bir dosya: seçilir, aranır (Ctrl+F), kopyalanır. Değiştirme satırı yoktur, telefonun tuş satırı da çıkmaz; Tab odağı taşır.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState

PantrixCodeEditor(
    state = rememberCodeEditorState(initialText = SETTINGS),
    modifier = Modifier.height(240.dp),
    highlighter = JsonHighlighter,
    readOnly = true,
    tagKey = "readOnly"
)

private val SETTINGS = """
{
  // What the app opens with.
  "name": "Formatico",
  "version": 3,
  /* The themes it offers,
     the first one by default. */
  "themes": ["light", "dark"],
  "fontSize": 14.5,
  "telemetry": false,
  "lastOpened": null
}
""".trimStart()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `JsonHighlighter`: Yorumlu JSON'un renklendirilecek parçaları, satır satır: iki noktadan önceki ad bir özellik, tırnak içi bir metin, `true`, `false` ve `null` dilin sözcükleri, sayılar sayı, satır ve blok yorumları yorumdur. `PantrixCodeEditor` dil bilmez: neyin ne olduğunu ona çağıranın okuyucusu söyler, bu uygulamada söyleyen de budur.

### İki sürümün farkı

Bir siparişin iki sürümünün farkı, tek metinde, okunmak için: değişen satır `Warning`, eklenen `Success`, çıkarılan `Danger` tonunda, oluğunda işaretiyle (`~`, `+`, `−`). Değişen değerin kendisi satırın içinde bir dolguyla durur (`CodeRangeStyle.Highlight`). Gösterilen farkın satırı kendi tonunda kalır, çubuğu birincil renktedir (`bar`); öteki farkların satırları yalnızca bantlarındadır (`showBar`).

"Sonraki fark" ve "Önceki fark" farkı gösterir: `revealLines` satırlarını ekrana getirir, imleci ve seçimi taşımadan. İmleç işaretli bir satıra gelince satır kendi bandında kalır. Gösterilen farkın değeri ayrıca bir çerçeveyle durur (`CodeRangeStyle.Current`).

Oluğun işaretini ekran okuyucu okumaz; her farkın satırı ona `CodeMark.description` ile söylenir: "durum değişti".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeeditor.CodeRangeMark
import com.pantrixui.components.data.codeeditor.CodeRangeStyle
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val state = rememberCodeEditorState(initialText = ORDER)
var shown by remember { mutableIntStateOf(0) }
val lineMarks = remember(shown) {
    ORDER_CHANGES.withIndex().associate { (index, change) ->
        // Gösterilen fark kendi bandında kalır, çubuğu birincil renkte; ötekilerin çubuğu yoktur.
        val now = index == shown
        change.line to CodeMark(
            change.tone,
            bar = CodeTone.Primary,
            gutter = change.sign,
            showBar = now,
            description = change.what
        )
    }
}
val values = remember(state, shown) {
    ORDER_CHANGES.withIndex().mapNotNull { (index, change) ->
        val value = change.value ?: return@mapNotNull null
        val start = state.lineStart(change.line) + state.line(change.line).indexOf(value)
        // Gösterilen farkın değeri çerçeveli, ötekiler yalnızca dolgulu.
        val style = if (index == shown) CodeRangeStyle.Current else CodeRangeStyle.Highlight
        CodeRangeMark(start, start + value.length, CodeMark(change.tone), style = style)
    }
}
LaunchedEffect(shown) {
    val line = ORDER_CHANGES[shown].line
    state.revealLines(line..line)
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)
    ) {
        PantrixButton(
            text = "Önceki fark",
            onClick = { shown = (shown + ORDER_CHANGES.size - 1) % ORDER_CHANGES.size },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "previousChange"
        )
        PantrixButton(
            text = "Sonraki fark",
            onClick = { shown = (shown + 1) % ORDER_CHANGES.size },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Small,
            tagKey = "nextChange"
        )
    }
    PantrixCodeEditor(
        state = state,
        modifier = Modifier.height(240.dp),
        highlighter = JsonHighlighter,
        lineMarks = lineMarks,
        rangeMarks = values,
        readOnly = true,
        tagKey = "compare"
    )
    PantrixText(
        text = "Fark ${shown + 1} / ${ORDER_CHANGES.size}: ${ORDER_CHANGES[shown].what}",
        color = PantrixTheme.colors.textSecondary
    )
}

private val ORDER = """
{
  "id": "ord_8842",
  "status": "delivered",
  "createdAt": "2026-10-28T14:32:00Z",
  "deliveredAt": "2026-11-01T10:05:00Z",
  "customer": {
    "name": "Deniz Kaya",
    "email": "deniz@example.com"
  },
  "shipping": {
    "method": "standard",
    "carrier": "Kargo Ekspres",
    "tracking": "KE-4471-0093",
    "address": {
      "street": "Moda Caddesi 12",
      "district": "Kadıköy",
      "city": "İstanbul",
      "postalCode": "34710",
      "country": "TR"
    }
  },
  "payment": {
    "method": "card",
    "installments": 1,
    "captured": true
  },
  "coupon": "AUTUMN10",
  "items": [
    { "sku": "TS-001", "name": "Tişört", "qty": 2, "price": 34.90 },
    { "sku": "MG-014", "name": "Kupa", "qty": 2, "price": 14.00 },
    { "sku": "ST-220", "name": "Çıkartma", "qty": 5, "price": 1.20 }
  ],
  "subtotal": 103.80,
  "shippingCost": 0.00,
  "total": 103.80,
  "notes": "Kapıya bırakılabilir."
}
""".trimStart()

private val ORDER_CHANGES = listOf(
    OrderChange(2, CodeTone.Warning, "~", "durum değişti", value = "\"delivered\""),
    OrderChange(4, CodeTone.Success, "+", "teslim tarihi eklendi"),
    OrderChange(12, CodeTone.Success, "+", "takip numarası eklendi"),
    OrderChange(26, CodeTone.Danger, "−", "kupon çıkarıldı"),
    OrderChange(29, CodeTone.Warning, "~", "kupanın fiyatı değişti", value = "14.00"),
    OrderChange(30, CodeTone.Success, "+", "bir ürün eklendi"),
    OrderChange(32, CodeTone.Warning, "~", "ara toplam değişti", value = "103.80"),
    OrderChange(34, CodeTone.Warning, "~", "toplam değişti", value = "103.80")
)

private class OrderChange(
    val line: Int,
    val tone: CodeTone,
    val sign: String,
    val what: String,
    val value: String? = null
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `JsonHighlighter`: Yorumlu JSON'un renklendirilecek parçaları, satır satır: iki noktadan önceki ad bir özellik, tırnak içi bir metin, `true`, `false` ve `null` dilin sözcükleri, sayılar sayı, satır ve blok yorumları yorumdur. `PantrixCodeEditor` dil bilmez: neyin ne olduğunu ona çağıranın okuyucusu söyler, bu uygulamada söyleyen de budur.

### Uzun satırlar alttan devam eder

Satırları uzun bir dosya: tek satırlık bir JSON ve uzun bir açıklama. Satır kaydırma kapalıyken kod yana kayar; açıkken (`softWrap`) uzun satır editörün genişliğinde alttan devam eder, devamı kodun başladığı yerden başlar ve oluğunda numara olmaz. Yukarı ve Aşağı okları imleci görünen sıra sıra taşır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.foundation.theme.PantrixTheme

var wraps by remember { mutableStateOf(true) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(
        checked = wraps,
        onCheckedChange = { wraps = it },
        label = "Uzun satırları kaydır",
        tagKey = "wrap"
    )
    PantrixCodeEditor(
        state = rememberCodeEditorState(initialText = LONG_LINES),
        modifier = Modifier.height(240.dp),
        highlighter = JsonHighlighter,
        readOnly = true,
        softWrap = wraps,
        tagKey = "softWrap"
    )
}

private val LONG_LINES = """
{
  "description": "Formatico reads JSON, YAML, TOML and XML, checks them against their schemas, and converts one into another without losing a comment or the order of the keys.",
  "settings": {"theme": "dark", "fontSize": 14.5, "wrapLongLines": true, "telemetry": false, "lastOpened": ["order.json", "order-v2.json", "settings.toml"]},
  "notes": "A line too long for the window goes on under itself when lines wrap, and the code scrolls sideways when they do not."
}
""".trimStart()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `JsonHighlighter`: Yorumlu JSON'un renklendirilecek parçaları, satır satır: iki noktadan önceki ad bir özellik, tırnak içi bir metin, `true`, `false` ve `null` dilin sözcükleri, sayılar sayı, satır ve blok yorumları yorumdur. `PantrixCodeEditor` dil bilmez: neyin ne olduğunu ona çağıranın okuyucusu söyler, bu uygulamada söyleyen de budur.

### Kendi sözdizimi, renkleri ve stiliyle

Kendi sözdizimiyle bir INI dosyası: köşeli parantez bölümün adını, `#` yorumu açar; okuyucusu örneğin kendisindedir. Girinti dört boşluktur, yazılan parantez kapanmaz. Telefonun tuş satırı Tab'ı, oklarla geri alı tutar ve `=` ekler.

Renkleri kendisinin: zemin temanın yumuşak `info` dolgusu, imlecin satırı daha belirgin. Stili köşesiz ve kalın kenarlıdır.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeToken
import com.pantrixui.components.data.codeblock.CodeTokenKind
import com.pantrixui.components.data.codeeditor.CodeEditorColors
import com.pantrixui.components.data.codeeditor.CodeEditorStyle
import com.pantrixui.components.data.codeeditor.CodeHighlight
import com.pantrixui.components.data.codeeditor.CodeHighlighter
import com.pantrixui.components.data.codeeditor.CodeKey
import com.pantrixui.components.data.codeeditor.CodeSyntax
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor
import com.pantrixui.components.data.codeeditor.rememberCodeEditorState
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeSpec

val colors = PantrixTheme.colors
PantrixCodeEditor(
    state = rememberCodeEditorState(initialText = INI),
    modifier = Modifier.height(220.dp),
    highlighter = IniHighlighter,
    syntax = CodeSyntax(brackets = "[]", quotes = "\"", lineComment = "#"),
    indent = "    ",
    closesPairs = false,
    keyRow = CodeKey.DefaultRow.filterNot { it is CodeKey.Text } + CodeKey.Text("="),
    style = CodeEditorStyle(shape = ShapeSpec.Fixed(RectangleShape), borderWidth = 2.dp),
    colors = CodeEditorColors(
        container = colors.info.container,
        currentLine = colors.info.color.copy(alpha = 0.15f)
    ),
    tagKey = "ini"
)

private object IniHighlighter : CodeHighlighter<Unit> {
    override val initialState = Unit

    override fun highlight(
        line: String,
        state: Unit
    ): CodeHighlight<Unit> {
        val code = line.trimStart()
        val start = line.length - code.length
        val equals = line.indexOf('=')
        val tokens = when {
            code.startsWith("#") -> {
                listOf(CodeToken(start, line.length, CodeTokenKind.Comment))
            }

            code.startsWith("[") -> {
                listOf(CodeToken(start, line.length, CodeTokenKind.Tag))
            }

            equals > 0 -> {
                listOf(
                    CodeToken(start, equals, CodeTokenKind.Property),
                    CodeToken(equals + 1, line.length, CodeTokenKind.StringLiteral)
                )
            }

            else -> {
                emptyList()
            }
        }
        return CodeHighlight(tokens, state)
    }
}

private val INI = """
# Formatico
[editor]
indent = 2
theme = "dark"

[files]
recent = 10
""".trimStart()
```

### Büyük bir belge

Elli bin satırlık bir belge: hemen açılır, kayar ve yazılır. Yalnızca ekrandaki satırlar kurulur; klavyenin yazdığı alan imlecin çevresindeki birkaç yüz satırı tutar, gerisini editör kendisi çizer. Okuyucu satırları arka planda, önce ekrandakileri okur.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeeditor.CodeEditorState
import com.pantrixui.components.data.codeeditor.PantrixCodeEditor

val state = remember { CodeEditorState(LARGE) }
PantrixCodeEditor(
    state = state,
    modifier = Modifier.height(420.dp),
    highlighter = JsonHighlighter,
    tagKey = "large"
)

private val LARGE: String = buildString {
    append("[\n")
    for (index in 0 until 50_000) {
        append("  {\"id\": ").append(index).append(", \"name\": \"item number ").append(index)
        append("\", \"active\": ").append(index % 3 == 0).append(", \"score\": ").append(index * 7 % 1000)
        append(if (index < 49_999) "},\n" else "}\n")
    }
    append("]")
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `JsonHighlighter`: Yorumlu JSON'un renklendirilecek parçaları, satır satır: iki noktadan önceki ad bir özellik, tırnak içi bir metin, `true`, `false` ve `null` dilin sözcükleri, sayılar sayı, satır ve blok yorumları yorumdur. `PantrixCodeEditor` dil bilmez: neyin ne olduğunu ona çağıranın okuyucusu söyler, bu uygulamada söyleyen de budur.

## API

### PantrixCodeEditor

`import com.pantrixui.components.data.codeeditor.PantrixCodeEditor`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCodeEditor(
    state: CodeEditorState,
    modifier: Modifier = Modifier,
    highlighter: CodeHighlighter<*>? = null,
    syntax: CodeSyntax = CodeSyntax(),
    lineMarks: Map<Int, CodeMark> = emptyMap(),
    rangeMarks: List<CodeRangeMark> = emptyList(),
    indent: String = "  ",
    closesPairs: Boolean = true,
    keyRow: List<CodeKey> = CodeKey.DefaultRow,
    lineNumbers: Boolean = true,
    readOnly: Boolean = false,
    enabled: Boolean = true,
    textStyle: TextStyle? = null,
    style: CodeEditorStyle? = null,
    colors: CodeEditorColors? = null,
    contentDescription: String? = null,
    softWrap: Boolean = false,
    tagKey: String? = null
)
```

Yazılan ve değiştirilen kod: her uzunlukta bir metin, her satır kendi satırında, her parçası ne olduğunun renginde, satırları numaralı ve imlecin bulunduğu satır, uygulamanın bir işareti yoksa işaretli.

Editör gösterdiği dili bilmez. Kodu renklendiren, çağıranın verdiği `highlighter`'dır; o, her satırı önceki satırın bittiği durumdan okur. Editör satırları ana iş parçacığının dışında okur; bir değişiklikten sonra da yalnızca değişikliğin, sonraki satırın okunduğu durumu değiştirdiği yere kadar.

Metin `state`'tedir ve satır satır tutulur: megabaytlarca bir metin hemen açılır ve kısa bir metin gibi yazılır. Yalnızca ekrandaki satırlar kurulur; klavyeyi alan metin alanı, imlecin çevresinde onunla birlikte kayan bir satır penceresi tutar, onun dışındaki satırları editör kendisi çizer. Bunlardan birine basmak imleci oraya koyar, Shift basılıyken basmak oraya kadar seçer, sürüklemek de işaretçinin gittiği yere kadar seçer.

Tuşlar bir editörünkilerdir: Tab bir `indent` adımı girinti ekler, Shift+Tab bir adım çıkarır; bir seçim varsa seçimin bütün satırlarında birden. Satır besleme satırın girintisini yeni satıra taşır; geri alma ve yineleme yazılanı sözcük sözcük geri alır ve yineler; Ctrl+Home ve Ctrl+End, Mac'te Cmd+Up ve Cmd+Down, metnin iki ucuna gider. Alt+Up ve Alt+Down seçimin satırlarını taşır, Shift ile birlikte kopyalar; Ctrl+Shift+K onları siler. Escape'ten sonra Tab odağı ileri, Shift+Tab geri taşır; böylece klavye editörden her zaman çıkabilir.

Editörün dil hakkında bildiği `syntax`'ıdır: yazılırken kapattığı ve eşleştirdiği parantezler ile tırnaklar, bir de Ctrl+/ ile eklenip kaldırılan yorumlar.

Ctrl+F (Mac'te Cmd+F) bul çubuğunu satırların üstünde, seçili olanı arayacak biçimde açar; Ctrl+H (Cmd+Option+F) onu değiştirme satırıyla açar. `CodeEditorState.find` onu uygulamanın kendi düğmesinden açar. Çubuk açıkken her eşleşme metinde ve kaydırma çubuğunda işaretlenir; F3 ve Ctrl+G, çubuktan da koddan da, sonraki eşleşmeye, Shift ile de bir öncekine gider. Durum aynı biçimde çubuk olmadan da bulur ve değiştirir: `findNext`, `replaceNext`, `replaceAll` ve `findAll`. Tarayıcıda bu tuşlar da editörün öteki tuşları da editöründür: Ctrl+F tarayıcının bul çubuğunu da açmaz (`keepFromBrowser`).

Telefonda, editör odaktayken dibinde bir tuş satırı durur; klavye editörün dibini örtüyorsa satır klavyenin üst kenarında durur: `keyRow`, kodun yazıldığı ve bir telefon klavyesinin bir iki sayfa öteye koyduğu şeyler. Tuşları klavye gibi, editörün yardımıyla yazar ve odağı hiçbir zaman koddan almaz. Kaydırılan bir sayfada imleç, altında satırın payı bırakılarak gösterilir.

Ekran okuyucu imlecin çevresindeki satırları metin alanının satırları olarak okur; bunların dışında kalan, bir kaydırmadan sonra ekrana gelen bir satırı ise basılabilecek bir satır olarak okur: ona basmak imleci satırın başına koyar. İmleç bir işaretin içine girince işaretin mesajını, bul çubuğu eşleşmeden eşleşmeye geçtikçe de kaç eşleşmeden kaçıncısının seçildiğini söyler; satır numaralarını okumaz.

Editöre sığmayan bir satır bölünmez: kod, yerinde duran satır numaralarının altından yana kayar. `softWrap` ile satır bunun yerine kodun başladığı yerden sıra sıra alttan devam eder, numarası ilk sırasının yanında durur: Yukarı ve Aşağı imleci o zaman bir sıra taşır, Home ve End sıranın uçlarına götürür. On bin karakterden uzun bir satır oraya kadar gösterilir ve bütün olarak tutulur.

Editör kendisine verilen genişliği doldurur ve verilen yüksekliğin içinde kayar. Yükseklik verilmezse, kayan bir sayfada, pencereden yüksek olmaz.

Kod her dilde soldan sağa yazılır, burada satırları da öyledir.

Bir uygulama satırları imleci taşımadan `CodeEditorState.revealLines` ile ekrana getirir: bir farktan ötekine geçen, farkları satırlarında işaretli bir karşılaştırma farkı orada gösterir ve seçimi olduğu gibi bırakır.

```kotlin
val state = rememberCodeEditorState(initialText = settings)
PantrixCodeEditor(state = state, modifier = Modifier.height(320.dp), tagKey = "settings")
```

Parametreler:

- `state: CodeEditorState`: Metin, seçim ve geçmiş. Onu `rememberCodeEditorState` ile oluştur.
- `modifier: Modifier`: Editörün modifier'ı. Burada verilen yükseklik, kodun içinde kaydığı yerdir.
- `highlighter: CodeHighlighter<*>?`: Kodu renklendiren: her satırın parçaları ve her birinin ne olduğu. Verilmezse yoktur ve kod tek renkle yazılır.
- `syntax: CodeSyntax`: Dilin parantezleri, tırnakları ve yorumları: verilmezse normal, köşeli ve süslü parantezler ile iki tırnak; yorum yoktur.
- `lineMarks: Map<Int, CodeMark>`: Bütün satırlar hakkında söylenen; satırın sıfırdan sayılan yeriyle: satırın arkasında işaretin tonunun yumuşak dolgusunda bir bant, sol kenarından inen bir çubuk, satırın numarasının önünde işaretin işareti ve temanın o dolguyla eşlediği tek renkle yazılan satır. İşaretin mesajı, imleç o satırdayken görünür. İşaretli bir satır imleç üstündeyken de kendi bandında kalır: imlecin satırının bandı, kendi işareti olmayan bir satıra ve yalnızca editör odaktayken, imleç çizilirken çizilir.
- `rangeMarks: List<CodeRangeMark>`: Metnin parçaları hakkında söylenen: `CodeRangeMark.style`'ın dediği gibi her birinin altında tonunun renginde dalgalı bir çizgi ve satırının önünde bir nokta, ya da arkasında bir dolgu, imlecin satırının bandının üstünde; ve imleç içindeyken ya da fare üstündeyken mesajı. İşaretler söylendikleri yere çizilir: metni her değişiklikten sonra denetleyen bir uygulama yeni metnin işaretlerini verir.
- `indent: String`: Bir girinti adımı: verilmezse iki boşluk; ya da kod kaç boşlukla girintiliyse o kadar boşluk, ya da bir sekme. Sekme, yazının onu çizdiği genişlikte çizilir.
- `closesPairs: Boolean`: Yazılan bir parantezin ya da tırnağın hemen kapatılıp kapatılmadığı ve editörün koyduğu kapanışın yazılınca üstünden geçilip geçilmediği.
- `keyRow: List<CodeKey>`: Dokunarak kullanılan bir platformda, editör odaktayken altında duran satırın tuşları: verilmezse Tab, kodun yazıldığı parantezler ve işaretler, geri al ve yinele, bir de oklar. Boş bir liste satır göstermez; metni değiştirilemeyen bir editör de göstermez.
- `lineNumbers: Boolean`: Her satırın, numarasını kodun önünde taşıyıp taşımadığı.
- `readOnly: Boolean`: Metnin yalnızca seçilip kopyalanabilir, değiştirilemez olup olmadığı.
- `enabled: Boolean`: Editörün odağı hiç alıp almadığı. Devre dışı bir editör, temanın kullanılamayan şeyler için verdiği renkle yazılır.
- `textStyle: TextStyle?`: Kodun yazıldığı stil: verilmezse temanın `code`'u.
- `style: CodeEditorStyle?`: Bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Her platformda yalnızca verdiği alanlar değişir.
- `colors: CodeEditorColors?`: Bu editörün, temadan gelmeyen kendi renkleri: burada verilenler kullanılır, gerisi temanınki kalır.
- `contentDescription: String?`: Ekran okuyucunun editöre verdiği ad: verilmezse temanın dilinde "Code editor". Kodun klavyeyle yazıldığı yerde ekran okuyucuya ayrıca Tab'ın girinti eklediği ve önce Escape'e, sonra Tab'a basınca editörden çıkıldığı söylenir.
- `softWrap: Boolean`: Editöre sığmayan bir satırın, kod yana kaymak yerine, sıra sıra alttan devam edip etmediği: dar bir ekran için, ya da sütunlarından çok okunan uzun satırlı bir metin için. Yerin bittiği yerde bölünen bir satır girintisinin söylediğini yitirir; sıraları kodun başladığı yerden başlar. Varsayılan olarak kapalı.
- `tagKey: String?`: Editörün otomasyon anahtarı: klavyeyi alan metin alanı `CodeEditor_<tagKey>`, pencerenin dışındaki bir satır `CodeEditor_<tagKey>.Line_<number>` olur. Tuş satırının kendi tuşları `CodeEditor_<tagKey>.IconButton_<name>` olur: `tab`, `undo`, `redo`, `left`, `up`, `down` ve `right`; bir metin tuşu ise satırdaki sıfırdan sayılan yeriyle `CodeEditor_<tagKey>.Button_text<place>` olur.

### CodeEditorState

`import com.pantrixui.components.data.codeeditor.CodeEditorState`, `com.pantrixui:components` içinden

```kotlin
class CodeEditorState(
    initialText: String = "",
    initialSelection: TextRange = TextRange.Zero
)
```

Bir kod editörünün tuttukları: metni, seçimi ve metnin geçtiği, geri alınacak ve yinelenecek adımlar.

Metin satır satır, satır öbekleri hâlinde tutulur; böylece megabaytlarca bir metinde bir tuş basışı metnin tamamına değil, bir öbeğin satırlarına mal olur. `text` metnin tamamıdır; istendiğinde kurulur ve bir sonraki değişikliğe kadar tutulur: uzun bir metnin her değişikliğinde onu okuyacak bir ekran bunun yerine `revision`'ı dinler ve `text`'i yazma durunca okur.

Metindeki bir yer, metnin karakterleri sıfırdan sayılarak verilir. Bir satır bir satır beslemede biter ve her satır besleme yeni bir satır başlatır: satır beslemeyle biten bir metnin ardında boş bir satır vardır. Tek başına ya da bir satır beslemenin önünde duran satır başı, durumun başladığı metinde de sonradan konan her metinde de satır besleme olarak tutulur.

Metnin her değişikliği geçmişinin bir adımıdır; `undo` onu geri alır, `redo` yineler. Yazılan sözcük sözcük geri alınır, tuş tuş silinen karakterler de öyle; `edit` istenen sayıda değişikliği tek bir adımda yapar.

Onu `rememberCodeEditorState` ile oluştur.

Parametreler:

- `initialText: String`: Editörün başladığı metin.
- `initialSelection: TextRange`: Seçimin başladığı yer: verilmezse imleç metnin başındadır.

Üyeleri:

- `revision: Int`: Durum kurulduğundan bu yana metnin kaç kez değiştiği: yazarak, `edit` ve onunla yapılan çağrılarla, `undo` ve `redo` ile. Yer değiştiren bir seçim sayılmaz. Her değişiklikten sonra bir şey yapan ekranın dinlediği budur; `text`'i de ancak o zaman okur.
- `lineCount: Int`: Metnin kaç satırı olduğu: boş bir metin için de en az bir.
- `length: Int`: Metnin, satır beslemeleri de içinde olmak üzere, kaç karakteri olduğu.
- `text: String`: Metnin tamamı; satırları satır beslemelerle birleştirilmiş.
- `selection: TextRange`: Seçim: başlatıldığı yer olan `TextRange.start`'tan imlecin bulunduğu `TextRange.end`'e kadar. Hiçbir şey seçili değilken ikisi aynı yerdir; geriye doğru yapılan bir seçimde başlangıç sondan sonradır. Metnin dışındaki bir yer, metnin en yakın ucu olarak ayarlanır.
- `canUndo: Boolean`: Metnin geri alınacak bir adımı olup olmadığı.
- `canRedo: Boolean`: Geri alınmış, yinelenecek bir adım olup olmadığı.
- `find: CodeFind`: Editörün bul çubuğu: açık olup olmadığı, neyi aradığı ve bir eşleşmenin yerine ne koyduğu.
- `fun revealLines(lines: IntRange)`: Bu durumu gösteren editörü, sıfırdan sayılan `lines` ekranında olacak kadar az kaydırır; satırlar ekranın aldığından fazlaysa ilki üstte durur. Boş bir aralık ilk yerindeki satırı gösterir: bir karşılaştırmanın farkının bir yanda satırı yoksa, önüne geleceği satırı. Metnin sonundan öteki satırlar metnin son satırıdır.

  İmleç ve seçim yerinde kalır: bir farktan ötekine geçen bir karşılaştırma her farkı satırlarında işaretli gösterir ve okuyanın hiçbir şeyini taşımaz.

  ```kotlin
  LaunchedEffect(state, shown) { state.revealLines(difference.lines) }
  ```

  Henüz yerleşmemiş bir editör satırları yerleşince getirir.
- `fun line(index: Int): String`: Sıfırdan sayılarak `index` sırasındaki satır; onu bitiren satır besleme olmadan.
- `fun lineStart(index: Int): Int`: Sıfırdan sayılarak `index` sırasındaki satırın ilk karakterinin yeri: `lineOf` ile birlikte, bir denetimin bildirdiği satırı ve sütunu metindeki bir yere, o yeri de yeniden satıra ve sütuna çevirmenin yolu.
- `fun lineOf(offset: Int): Int`: `offset`'in bulunduğu satırın sıfırdan sayılan yeri. Bir satırın sonundaki, satır beslemesinden önceki yer o satırdadır; satır beslemeden sonraki yer bir sonraki satırdadır.
- `fun replace(start: Int, end: Int, text: String)`: `start`'tan `end`'e kadarki karakterleri çıkarır ve yerlerine `text`'i koyar; geçmişin tek bir adımı olarak. Seçim, `CodeEditorBuffer.replace`'in kaydırdığı gibi, çevresindeki metinle birlikte kayar.
- `fun setText(text: String)`: Metnin tamamının yerine `text`'i koyar; geçmişin tek bir adımı olarak: bir biçimlendiricinin yaptığı gibi bundan üretilmiş bir metin, kullanıcının kendi değişiklikleri gibi geri alınır. İmleç bulunduğu yerde kalır; yeni metin daha kısaysa onun sonuna gider.
- `fun edit(block: CodeEditorBuffer.() -> Unit)`: `block`'un yaptığı değişiklikleri geçmişin tek bir adımı olarak yapar: birkaç yeri düzelten bir düzeltme tek seferde geri alınır.

  ```kotlin
  state.edit {
      replace(at, at + 4, "true")
      replace(end, end, ",")
  }
  ```

  Hiçbir şeyi değiştirmeyen bir blok adım oluşturmaz; yine de ayarladığı seçim durumun seçimi olur.
- `fun undo()`: Metnin son adımını geri alır ve seçimi o adımdan önceki yerine koyar.
- `fun redo()`: Geri alınan son adımı yineler ve seçimi o adımdan sonraki yerine koyar.

### rememberCodeEditorState

`import com.pantrixui.components.data.codeeditor.rememberCodeEditorState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberCodeEditorState(initialText: String = ""): CodeEditorState
```

Onu kuran ekran kadar yaşayan bir `CodeEditorState`.

Geri getirilen bir süreçte korunmaz: megabaytlarca bir metin, Android'in bir ekranın durumunu tuttuğu yere sığmaz. Metni sürecinden uzun yaşaması gereken bir ekran, bir dosyayı tuttuğu gibi metni kendisi tutar.

Parametreler:

- `initialText: String`: Editörün başladığı metin. Bir kez, durum kurulurken okunur.

### CodeEditorBuffer

`import com.pantrixui.components.data.codeeditor.CodeEditorBuffer`, `com.pantrixui:components` içinden

```kotlin
class CodeEditorBuffer
```

`CodeEditorState.edit` onu değiştirirken bir `CodeEditorState`'in metni: şimdiye kadar yapılan değişikliklerle şu an tuttuğu ve onu değiştiren çağrılar.

Bir çağrıya verilen her yer, metnin karakterlerini, ondan önceki değişikliklerin bıraktığı hâliyle sayar.

Üyeleri:

- `selection: TextRange`: Durumun bloktan sonra sahip olacağı seçim: olduğu gibi, her değişiklikle birlikte kaydırılmış. Onu ayarlamak nerede olacağını söyler; metnin dışındaki bir yer, metnin en yakın ucu olarak ayarlanır.
- `lineCount: Int`: Metnin şu an kaç satırı olduğu.
- `length: Int`: Metnin şu an, satır beslemeleri de içinde olmak üzere, kaç karakteri olduğu.
- `fun line(index: Int): String`: Metnin şu anki hâlinde `index` sırasındaki satır; satır beslemesi olmadan.
- `fun lineStart(index: Int): Int`: Metnin şu anki hâlinde `index` sırasındaki satırın ilk karakterinin yeri.
- `fun lineOf(offset: Int): Int`: Metnin şu anki hâlinde `offset`'in bulunduğu satırın yeri.
- `fun replace(start: Int, end: Int, text: String)`: `start`'tan `end`'e kadarki karakterleri çıkarır ve yerlerine `text`'i koyar. `text`'teki, tek başına ya da bir satır beslemenin önünde duran satır başı, satır besleme olarak girer.

  Seçim çevresindeki metinle birlikte kayar: `start`'tan önceki bir ucu yerinde kalır, `end`'de ya da ondan sonraki bir ucu metin ne kadar uzadıysa ya da kısaldıysa o kadar karakter kayar, çıkarılan karakterlerin içindeki bir ucu da konanın sonuna gider. Hiçbir şeyin çıkarılmadığı yerde `start`'taki bir imleç, aynı metin oraya yazıldığında olduğu gibi, konanın ardına geçer.

### CodeHighlighter

`import com.pantrixui.components.data.codeeditor.CodeHighlighter`, `com.pantrixui:components` içinden

```kotlin
interface CodeHighlighter<S : Any>
```

Bir dilin kodunu satır satır okur ve bir satırın her parçasının ne olduğunu söyler; bir kod editörü de kodu buna göre renklendirir.

Bir satır, ondan önceki satırın bittiği durumdan okunur: birkaç satırlık bir yorumun içinde, bir metin değerinin içinde, tabloları olan bir dosyanın bir tablosunda; dilin bir satırdan ötekine taşıdığı her neyse. İlk satır `initialState`'ten okunur. Editör her satırın bittiği durumu tutar ve bir satırı yalnızca satırın kendisi ya da ondan önceki durum değiştiyse yeniden okur: bir değişiklikten sonra, değişen satırdan başlayarak, bir satır önceden bittiği durumda bitene kadar okur ve ardından geleni olduğu gibi bırakır.

Durumlar `equals` ile ayırt edilir: bir durum bir değerdir, bir enum, bir object ya da bir data class; sonraki satırın aynı okunmasını sağlayan iki durum eşittir. Sonraki satırın gerektirdiğinden fazlasını, okunan satırların sayısını ya da satırın metnini tutan bir durum öncekine hiçbir zaman eşit olmaz; o zaman bir değişiklikten sonra metnin sonuna kadar okunur.

Editör satırları ana iş parçacığının dışında, ilk satırdan başlayarak birkaç binlik gruplar hâlinde okur; sırası gelmeden ekrana gelen bir satır, sırası gelene kadar `initialState`'ten okunur. `highlight` herhangi bir iş parçacığından çağrılır ve bir çağrıdan ötekine hiçbir şey tutmaz: bir satırın sonrakine verdiği, durumdadır.

```kotlin
object IniHighlighter : CodeHighlighter<Unit> {
    override val initialState = Unit
 
    override fun highlight(line: String, state: Unit): CodeHighlight<Unit> {
        val tokens = when {
            line.startsWith(";") -> listOf(CodeToken(0, line.length, CodeTokenKind.Comment))
            line.startsWith("[") -> listOf(CodeToken(0, line.length, CodeTokenKind.Type))
            else -> listOf(CodeToken(0, line.indexOf('=').coerceAtLeast(0), CodeTokenKind.Property))
        }
        return CodeHighlight(tokens, state)
    }
}
```

Üyeleri:

- `initialState: S`: İlk satırın okunduğu durum.
- `fun highlight(line: String, state: S): CodeHighlight<S>`: `line`'ın rengi olan parçaları ve satırın bittiği durum.

  `line`: Satır; onu bitiren satır besleme olmadan ve ne kadar uzun olursa olsun bütün olarak.

  `state`: Önceki satırın bittiği durum; ilk satır için `initialState`.

### CodeHighlight

`import com.pantrixui.components.data.codeeditor.CodeHighlight`, `com.pantrixui:components` içinden

```kotlin
data class CodeHighlight<S : Any>(
    public val tokens: List<CodeToken>,
    public val state: S
)
```

Bir `CodeHighlighter`'ın bir satırda okuduğu: rengi olan parçalar ve satırın bittiği durum.

Parametreler:

- `tokens: List<CodeToken>`: Satırın rengi olan parçaları; yerleri satırın kendi karakterleriyle sayılır. İki parça aynı karakterlerin üstündeyse sonra gelen boyar.
- `state: S`: Satırın sonrakine verdiği.

### CodeSyntax

`import com.pantrixui.components.data.codeeditor.CodeSyntax`, `com.pantrixui:components` içinden

```kotlin
data class CodeSyntax(
    public val brackets: String = "()[]{}",
    public val quotes: String = "\"'",
    public val lineComment: String? = null,
    public val blockCommentStart: String? = null,
    public val blockCommentEnd: String? = null
)
```

Bir `PantrixCodeEditor`'ın, kod yazılırken verdiği yardım için gösterdiği dil hakkında bildikleri: açılan ve kapanan parantezler, bir metin değerinin arasında durduğu tırnaklar ve bir yorumun nasıl yazıldığı.

Yazılan bir parantez ya da tırnak, imleçten sonra bir boşluk, satırın sonu ya da kapanan bir parantez geliyorsa hemen kapatılır; editörün koyduğu bir kapanışın da yazılınca üstünden geçilir. Bir seçimin üstüne yazılınca ikisi seçimi çevreler. Açılan bir parantezden sonra yazılan satır besleme yeni satırı, yazıldığı satırdan bir adım fazla girintiler ve imlecin ardından gelen kapanan parantezi kendi satırına koyar. Bir parantezin yanındaki imleç onun eşini işaretler; Ctrl+Shift+\ (Mac'te Cmd+Shift+\) oraya gider.

Ctrl+/ (Mac'te Cmd+/) seçimin satırlarını yoruma alır ya da yorumdan geri çıkarır: her birinin önüne `lineComment` koyarak ya da, dilde XML'deki gibi yalnızca kapanan yorumlar varsa, ilkinin önüne `blockCommentStart`, sonuncusunun ardına `blockCommentEnd` koyarak.

Editörün okuyucusunun okuduğu biçimiyle bir metin değerinin ya da bir yorumun içindeki parantez ya da tırnak kapatılmaz ve eşleştirilmez.

```kotlin
val jsonc = CodeSyntax(lineComment = "//")
val yaml = CodeSyntax(lineComment = "#")
val xml = CodeSyntax(brackets = "", blockCommentStart = "<!--", blockCommentEnd = "-->")
```

Parametreler:

- `brackets: String`: Dilin parantezleri; her açılanın ardından onu kapatan gelir: verilmezse normal, köşeli ve süslü parantezler.
- `quotes: String`: Bir metin değerinin arasında durduğu karakterler; her biri açtığını kapatır: verilmezse çift ve tek tırnak. Bir harften ya da rakamdan sonra, kesme işareti gibi yazılan tırnak kapatılmaz.
- `lineComment: String?`: Satırın sonuna kadar süren bir yorumu başlatan; dilde böyle bir yorum yoksa hiçbir şey.
- `blockCommentStart: String?`: Kapatılan bir yorumu açan ya da hiçbir şey: `blockCommentEnd` ile birlikte verilir.
- `blockCommentEnd: String?`: `blockCommentStart`'ın açtığı bir yorumu kapatan.

### CodeRangeMark

`import com.pantrixui.components.data.codeeditor.CodeRangeMark`, `com.pantrixui:components` içinden

```kotlin
data class CodeRangeMark(
    public val start: Int,
    public val end: Int,
    public val mark: CodeMark,
    public val style: CodeRangeStyle = CodeRangeStyle.Underline
)
```

Bir editörün metninin bir parçası hakkında söylenen: `style`'ının dediği gibi altında `mark`'ın tonunun renginde dalgalı bir çizgi ve satırının önünde bir nokta, ya da arkasında bir dolgu, ve imleç parçanın içindeyken ya da işaretçi üstündeyken gösterilen, işaretin mesajı.

```kotlin
// A finding of the app's own check, from where the text stopped being JSON to the line's end:
CodeRangeMark(start = fault.offset, end = state.lineStart(fault.line) + state.line(fault.line).length,
    mark = CodeMark(CodeTone.Danger, message = fault.message))
// The value a comparison found changed, on its line's band:
CodeRangeMark(value.start, value.end, CodeMark(CodeTone.Warning), style = CodeRangeStyle.Highlight)
```

Yerler, editörün gösterdiği metnin yerleridir. Bir işaret söylendiği yere çizilir ve bir değişiklik onu kaydırmaz: metni her değişiklikten sonra denetleyen bir uygulama yeni metnin işaretlerini verir.

Parametreler:

- `start: Int`: Parçanın ilk karakterinin yeri; sıfırdan sayılır.
- `end: Int`: Son karakterinden sonraki yer. Boş bir parça, bir şeyin eksik olduğu yerde, bir karakter genişliğinde işaretlenir.
- `mark: CodeMark`: Parça hakkında söylenen: tonu, mesajı ve bunu neyin söylediği.
- `style: CodeRangeStyle`: Parçanın nasıl işaretlendiği: varsayılan olarak altında dalgalı bir çizgi.

### CodeRangeStyle

`import com.pantrixui.components.data.codeeditor.CodeRangeStyle`, `com.pantrixui:components` içinden

```kotlin
enum class CodeRangeStyle
```

Bir `CodeRangeMark`'ın metindeki parçasını nasıl işaretlediği.

Değerleri:

- `Underline`: Parçanın altında işaretinin tonunun renginde dalgalı bir çizgi ve satırının önünde bir nokta: gözün uzun bir metinde bulacağı, bir denetimin bulduğu şey.
- `Highlight`: Parçanın arkasında, işaretinin tonunun renginin bir payıyla, köşeleri yuvarlak, kodun içinden okunduğu bir dolgu, nokta yok: bir satırın kastedilen parçası, bir karşılaştırmanın değişmiş bulduğu değer gibi.
- `Current`: `Highlight`'ın dolgusu, çevresinde işaretinin tonunun renginde bir çerçeveyle: aynı biçimde vurgulanan birkaç parçadan uygulamanın üstünde olduğu, bir aramanın gittiği eşleşme gibi.

### CodeMarkAction

`import com.pantrixui.components.data.codeblock.CodeMarkAction`, `com.pantrixui:components` içinden

```kotlin
class CodeMarkAction(
    public val label: String,
    public val onClick: () -> Unit
)
```

Bir `CodeMark`'ın söylediği için yapılabilecek olan: mesajının altında, `label` ile adlandırılan ve `onClick`'i çalıştıran bir düğme.

Parametreler:

- `label: String`: Eylemin ne yaptığı, birkaç sözcükle: `Virgülü ekle`.
- `onClick: () -> Unit`: Eylemin yaptığı. Düzenleyici ondan sonra odağı metnine geri verir.

### CodeSearch

`import com.pantrixui.components.data.codeeditor.CodeSearch`, `com.pantrixui:components` içinden

```kotlin
data class CodeSearch(
    public val text: String = "",
    public val matchCase: Boolean = false,
    public val wholeWord: Boolean = false,
    public val regex: Boolean = false
)
```

Bir kod editörünün metninde aranan: `text`; yazıldığı gibi ya da bir düzenli ifade olarak, bir satırın içinde.

Bir eşleşme hiçbir zaman bir satırın sonunu aşmaz; hiç karakteri olmayan bir eşleşme de atlanır.

```kotlin
val search = CodeSearch("\"name\":\\s*\"(\\w+)\"", regex = true)
state.findNext(search)
state.replaceAll(search, replacement = "\"name\": \"$1-copy\"")
```

Parametreler:

- `text: String`: Aranan. Boşsa hiçbir şey bulunmaz.
- `matchCase: Boolean`: Büyük harfin yalnızca büyük harfle, küçük harfin de yalnızca küçük harfle eşleşip eşleşmediği.
- `wholeWord: Boolean`: Bir eşleşmenin yalnızca yanında harf, rakam ya da alt çizgi olmayan yerde bulunup bulunmadığı.
- `regex: Boolean`: `text`'in, platformun düzenli ifadelerinin okuduğu gibi okunan bir düzenli ifade olup olmadığı.

Üyeleri:

- `isValid: Boolean`: `text`'in aranıp aranamayacağı: ya bir düzenli ifade değildir ya da okunabilen bir düzenli ifadedir.

### CodeEditorState.findNext

`import com.pantrixui.components.data.codeeditor.findNext`, `com.pantrixui:components` içinden

```kotlin
fun CodeEditorState.findNext(
    search: CodeSearch,
    backwards: Boolean = false
): TextRange?
```

`search`'ün seçimden sonraki ilk eşleşmesini, arama `backwards` gidiyorsa seçimden önceki son eşleşmesini seçer; orada yoksa metnin öbür ucundan sürdürür ve seçtiğini döndürür. Metinde eşleşme yoksa ya da `search` aranamıyorsa hiçbir şey seçilmez ve hiçbir şey döndürülmez.

Parametreler:

- `search: CodeSearch`
- `backwards: Boolean`

### CodeEditorState.findAll

`import com.pantrixui.components.data.codeeditor.findAll`, `com.pantrixui:components` içinden

```kotlin
fun CodeEditorState.findAll(
    search: CodeSearch,
    limit: Int = Int.MAX_VALUE
): List<TextRange>
```

`search`'ün metindeki eşleşmeleri; sırasıyla ve en çok `limit` kadar.

Parametreler:

- `search: CodeSearch`
- `limit: Int`

### CodeEditorState.replaceNext

`import com.pantrixui.components.data.codeeditor.replaceNext`, `com.pantrixui:components` içinden

```kotlin
fun CodeEditorState.replaceNext(
    search: CodeSearch,
    replacement: String
): TextRange?
```

Seçim `search`'ün bir eşleşmesiyse yerine `replacement`'ı koyar ve sonraki eşleşmeyi seçer; seçim bir eşleşme değilse yalnızca sonraki eşleşmeyi seçer. Seçilen eşleşmeyi döndürür; eşleşme yoksa hiçbir şey döndürmez.

Düzenli ifadeyle yapılan bir aramada `replacement` içinde `$1` ilk grubun eşleştiği metnin, `$0` eşleşmenin tamamının, `$$` de bir dolar işaretinin yerini tutar.

Parametreler:

- `search: CodeSearch`
- `replacement: String`

### CodeEditorState.replaceAll

`import com.pantrixui.components.data.codeeditor.replaceAll`, `com.pantrixui:components` içinden

```kotlin
fun CodeEditorState.replaceAll(
    search: CodeSearch,
    replacement: String
): Int
```

`search`'ün her eşleşmesinin yerine, geçmişin tek bir adımı olarak `replacement`'ı koyar ve kaç tanesinin değiştirildiğini döndürür. Düzenli ifadeyle yapılan bir aramada `replacement` içinde `$1`, `replaceNext`'te olduğu gibi, ilk grubun eşleştiği metnin yerini tutar.

Parametreler:

- `search: CodeSearch`
- `replacement: String`

### CodeFind

`import com.pantrixui.components.data.codeeditor.CodeFind`, `com.pantrixui:components` içinden

```kotlin
class CodeFind
```

Bir `CodeEditorState`'i gösteren editörün bul çubuğu: açık olup olmadığı, neyi aradığı ve bir eşleşmenin yerine ne koyduğu.

Ctrl+F onu açar, Ctrl+H değiştirme satırıyla açar; Mac'te Cmd+F ve Cmd+Option+F. Escape onu kapatır. Bir uygulama onu kendi düğmesinden de açar; klavyesinde Ctrl olmayan bir telefonda böyle açması gerekir:

```kotlin
PantrixIconButton(PantrixIcons.Search, contentDescription = strings.search, onClick = { state.find.open() })
```

Çubuk açıkken editör her eşleşmeyi metinde ve kaydırma çubuğunda işaretler; arama yazıldıkça da seçimden itibaren ilk eşleşmeyi seçer.

Üyeleri:

- `isOpen: Boolean`: Çubuğun açık olup olmadığı.
- `replacing: Boolean`: Çubuğun değiştirme satırını gösterip göstermediği: metni değiştirilemeyen bir editörde hiçbir zaman göstermez.
- `search: CodeSearch`: Çubuğun aradığı: arama alanının metni ve üç anahtarı. Onu ayarlamak bunları yazar.
- `replacement: String`: Çubuğun bir eşleşmenin yerine koyduğu: değiştirme alanının metni.
- `fun open(replacing: Boolean = false)`: Çubuğu, `replacing` doğruysa değiştirme satırıyla birlikte açar ve odağı arama alanına verir.
- `fun close()`: Çubuğu kapatır. Editör eşleşmeleri işaretlemeyi bırakır.

### CodeKey

`import com.pantrixui.components.data.codeeditor.CodeKey`, `com.pantrixui:components` içinden

```kotlin
sealed interface CodeKey
```

Bir kod editörünün odaktayken telefonda, altında ve klavyenin üstünde gösterdiği satırın bir tuşu: kodun yazıldığı ve bir telefon klavyesinin bir iki sayfa öteye koyduğu ya da hiç bulundurmadığı şeyler.

Bir `Text` tuşu metnini, klavyenin yazdığı gibi, editörün yardımıyla yazar: açılan bir parantez ya da tırnak kapatılır, editörün koyduğu bir kapanışın da yazılınca üstünden geçilir. Ötekiler editörün kendi tuşlarıdır: `Tab`, `Undo`, `Redo` ve basılı tutuldukça imleci taşımayı sürdüren dört ok. `DefaultRow`, çağrısı kendi satırını vermeyen bir editörün satırıdır.

```kotlin
val pathKeys = listOf(CodeKey.Text("$"), CodeKey.Text("."), CodeKey.Text("["), CodeKey.Text("]"), CodeKey.Left)
```

Tipin kendisinde:

- `CodeKey.DefaultRow: List<CodeKey>`: Çağrısı kendi satırını vermeyen bir editörün satırı: Tab; JSON'un, XML'in ve çoğu kodun yazıldığı parantezler, tırnak ve işaretler; geri al ve yinele; bir de oklar.

#### CodeKey.Text

```kotlin
data class Text(val text: String) : CodeKey
```

Klavyenin yapacağı gibi, seçimin yerine `text`'i yazan bir tuş.

Parametreler:

- `text: String`: Tuşun yazdığı ve üstünde yazan.

#### CodeKey.Tab

```kotlin
data object Tab : CodeKey
```

Klavyenin Tab'ı gibi bir adım girinti ekler; bir seçim varsa seçimin bütün satırlarına birden.

#### CodeKey.Undo

```kotlin
data object Undo : CodeKey
```

Son değişikliği geri alır.

#### CodeKey.Redo

```kotlin
data object Redo : CodeKey
```

Geri alınan bir değişikliği yineler.

#### CodeKey.Left

```kotlin
data object Left : CodeKey
```

İmleci bir karakter sola ya da seçimin başına taşır.

#### CodeKey.Right

```kotlin
data object Right : CodeKey
```

İmleci bir karakter sağa ya da seçimin sonuna taşır.

#### CodeKey.Up

```kotlin
data object Up : CodeKey
```

İmleci bir satır yukarı taşır; satır yeterince uzunsa önceki sütununda kalır. İlk satırdan metnin başına gider.

#### CodeKey.Down

```kotlin
data object Down : CodeKey
```

İmleci bir satır aşağı taşır; satır yeterince uzunsa önceki sütununda kalır. Son satırdan metnin sonuna gider.

### CodeEditorStyle

`import com.pantrixui.components.data.codeeditor.CodeEditorStyle`, `com.pantrixui:components` içinden

```kotlin
class CodeEditorStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val gutterGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val focusedBorderWidth: Dp = Dp.Unspecified,
    public val barWidth: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified
) : PantrixStyle<CodeEditorStyle>
```

`PantrixCodeEditor`'ın geometrisi: satırlarının çevresindeki boşluk, satırlar numaralıyken kodun önündeki yer ve kenar.

Satırlar, kod satırları gibi sık durur ve her satır ötekiler kadar yüksektir: temanın kod yazısıyla bir satır 20dp'dir, üstüne ve altına `linePadding`'in eklediği de gelir. Parmak imleci dokunduğu satıra koyar, alanın kendi tutamaçları da onu oradan taşır.

Köşeler, bir kod bloğununkiler gibi, her platformda kartın köşeleridir: Android'de orta, iOS'ta büyük, masaüstünde ve web'de küçük. Kenar bir alanın kenarıdır: editör odaktayken kalınlaşır.

İç boşluklar ve aralık yoğunlukla ölçeklenir, çünkü yazının çevresindeki boşluktur. Kenarın ve bir işaretin çubuğunun kalınlığı, ikonların boyutu ve şekil ölçeklenmez.

Parametreler:

- `shape: ShapeSpec`: Editörün köşeleri: markanın şekil ölçeğinden bir basamak ya da sabit bir şekil.
- `horizontalPadding: Dp`: Editörün yanları ile içindekiler arasındaki boşluk: başta satır numaraları, sonda en uzun satırın sonu.
- `verticalPadding: Dp`: İlk satırın üstündeki ve son satırın altındaki boşluk.
- `linePadding: Dp`: Her satırın yazısının üstündeki ve altındaki boşluk.
- `gutterGap: Dp`: Satır numaraları ile kod arasındaki aralık.
- `borderWidth: Dp`: Editörün çevresindeki kenarın kalınlığı. Sıfır verilirse çizilmez.
- `focusedBorderWidth: Dp`: Editör odaktayken kenarın kalınlığı: odağı gösteren kenardır.
- `barWidth: Dp`: İşaretli bir satırın sol kenarı boyunca taşıdığı çubuğun kalınlığı. Sıfır verilirse çizilmez.
- `iconSize: Dp`: Bir işaretin mesajının önündeki ikonun eni ve boyu.

### CodeEditorColors

`import com.pantrixui.components.data.codeeditor.CodeEditorColors`, `com.pantrixui:components` içinden

```kotlin
data class CodeEditorColors(
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
    public val focusedBorder: Color = Color.Unspecified,
    public val currentLine: Color = Color.Unspecified,
    public val cursor: Color = Color.Unspecified,
    public val selection: Color = Color.Unspecified,
    public val matchingBracket: Color = Color.Unspecified,
    public val match: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir editör için `PantrixCodeEditor`'ın renkleri: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// An app's own colours for its keys and its strings:
PantrixCodeEditor(state = state, colors = CodeEditorColors(property = brand.key, string = brand.string))
```

Kod, bir `CodeBlockColors`'ın renklendirdiği gibi ve aynı kurallarla renklendirilir: temanın kendi zeminlerinde her tür parçanın temanın rollerinden bir rengi vardır; başka renkte bir dolgunun üstünde ise kodun tamamı orada okunan tek renkle yazılır.

Parametreler:

- `container: Color`: Satırların arkasındaki dolgu: temanın `surface`'ı.
- `text: Color`: Hiçbir parçanın boyamadığı yazı. Temanın `textPrimary`'si.
- `comment: Color`: Yorum; ayrıca eğik yazılır. Temanın `textSecondary`'si.
- `keyword: Color`: Dilin bir sözcüğü. Temanın primary rolü.
- `type: Color`: Bir türün adı. Temanın info rolü.
- `string: Color`: Bir metin. Temanın success rolü.
- `number: Color`: Bir sayı. Temanın warning rolü.
- `punctuation: Color`: Parantezler, virgüller ve noktalı virgüller. Temanın `textSecondary`'si.
- `annotation: Color`: Ardından geleni niteleyen bir ad. Temanın danger rolü.
- `property: Color`: Bir üyenin ya da bir ayarın adı. Verilmediğinde `type`'ın rengi.
- `tag: Color`: Bir işaretleme dilinde bir öğenin adı. Verilmediğinde `keyword`'ün rengi.
- `lineNumber: Color`: Satır numaraları ve bütünü gösterilemeyecek kadar uzun bir satırın işareti. Temanın `textSecondary`'si.
- `border: Color`: Editörün çevresindeki kenar: bir alanınki gibi temanın `border`'ı; bir dolgunun üstünde ise orada yazılan rengin bir payı.
- `focusedBorder: Color`: Editör odaktayken kenar. Temanın primary rolü.
- `currentLine: Color`: Editör odaktayken imlecin bulunduğu satırın arkasındaki bant: yazı renginin, her dolgunun üstünde okunan bir payı.
- `cursor: Color`: İmleç; bir seçimin tutamaçları da bu rengi alır. Temanın primary rolü.
- `selection: Color`: Seçili olanın arkasındaki dolgu: imlecin rengi, temanın seçimi kadar soluk.
- `matchingBracket: Color`: İmlecin yanındaki parantezin ve onun eşinin çevresindeki kenar: yazı renginin, her dolgunun üstünde okunan bir payı.
- `match: Color`: Bul çubuğunun aramasının her eşleşmesinin arkasındaki dolgu ve, tam gücüyle, kaydırma çubuğunda eşleşmesi olan bir satırın çentiği: temanın warning rolünün bir payı.

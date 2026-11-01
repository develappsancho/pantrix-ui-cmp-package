# Multi Select

Bir listeden birden çok seçim: bir sayfanın daraltıldığı projeler, bir dükkânın açık olduğu günler. Bir Select'in kutusu ve listesidir; farkı satırlarındadır: her seçenek bir onay kutusudur, basmak işaretler ya da işareti kaldırır ve liste bir sonraki seçim için açık kalır. Dışına basmak, geri tuşu ve Escape listeyi kapatır.

Seçim bileşenin değil çağıranındır: `selected` kümesi verilir, `onSelectionChange` yeni kümenin tamamını ister.

- `PantrixMultiSelect` (`com.pantrixui.components.overlay.multiselect`, `com.pantrixui:components`): Kontrolün kendi altında açtığı bir listeden birden çok seçim, her seçenek bir onay kutusu, bir yazı alanının kutusunda; listede aranabilir, seçeneklerin ikonları olabilir ve tek tek devre dışı bırakılabilir; bir formun alanına bağlanır. Anahtar sözcükler: çoklu seçim, çok seçimli liste, onay kutulu liste, etiket girişi, süzgeç listesi.

## Özellikler

- **Kutudaki yazı.** Kutu, işaretlilerin etiketlerini seçeneklerin sırasıyla ve aralarında virgülle gösterir; sığmayanı tek satırda keser. Hiçbiri işaretli değilken `placeholder` görünür.
- **Özet.** `valueText` verilirse kutu, bir şey işaretliyken etiketlerin yerine onu yazar: bir sayı ya da hepsi için tek bir söz.
- **Arama.** `searchable` listeye, seçenekleri etiketine göre daraltan bir arama alanı koyar. Odak o alanda kalır: oklar eşleşen satırlar arasında gezer, klavyenin onay tuşu okların durduğu satırı işaretler ya da işaretini kaldırır.
- **Seçenekler.** Seçenekler Select'in `SelectOption`'ıdır: bir değer, bir etiket, istenirse bir ikon. `enabled = false` olan seçenek listede kalır ve okunur, ama işaretlenemez.
- **Klavye.** Select'inkidir: Enter ya da boşluk listeyi açar, oklar satırlar arasında gezer ve sondan başa döner, Home ve End ilk ve son satıra gider. Enter ve boşluk işaretler ya da işareti kaldırır.
- **Form.** `field` alan `PantrixMultiSelect` seçimlerini, hatasını ve adını formun alanından alır: alanın değeri işaretlilerin kümesidir.
- **Hata ve devre dışı.** `error` ve `enabled` Select'teki gibidir: hata kutunun kenarını, etiketini ve alttaki metni `danger` rolüne çevirir; devre dışı kutu odak almaz ve liste açılmaz.
- **Renkler ve stil.** Select'in stilini ve renklerini paylaşır: `SelectStyle` ve `SelectColors`, kutusu için `TextFieldStyle` ve `TextFieldColors`. Select'lerini yeniden biçimlendiren bir ürün bunları da biçimlendirmiş olur. Onay kutuları temanın renginde kalır.
- **Otomasyon.** `tagKey` kutuyu `MultiSelect_<tagKey>`, listesini `MultiSelectList_<tagKey>`, arama alanını `MultiSelectSearch_<tagKey>` diye etiketler. Seçenekler kutunun içinde adlandırılır: `MultiSelect_projects.MultiSelectOption_compose`.

## Kullanım

### The projects a list is narrowed to, all of them while none is ticked

```kotlin
var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
PantrixMultiSelect(
    options = projects.map {
        SelectOption(value = it.id, label = it.name, icon = PantrixIcons.Folder, tagKey = it.id)
    },
    selected = chosen,
    onSelectionChange = { chosen = it },
    placeholder = stringResource(Res.string.all_projects, projects.size),
    contentDescription = stringResource(Res.string.projects),
    tagKey = "projects"
)
```

### A count in the box, and a list that is searched

```kotlin
PantrixMultiSelect(
    options = languages.map { SelectOption(value = it.id, label = it.name, tagKey = it.id) },
    selected = spoken,
    onSelectionChange = { spoken = it },
    label = stringResource(Res.string.languages),
    valueText = pluralStringResource(Res.plurals.languages_chosen, spoken.size, spoken.size),
    searchable = true,
    tagKey = "languages"
)
```

### Bound to a form's field, where one at the least has to be chosen

```kotlin
val form = rememberFormState()
val days = form.field(
    "days",
    initial = emptySet<DayOfWeek>(),
    Rules.satisfies(stringResource(Res.string.choose_a_day)) { it.isNotEmpty() }
)
PantrixMultiSelect(
    field = days,
    options = DayOfWeek.entries.map { SelectOption(value = it, label = names.getValue(it), tagKey = it.name) },
    label = stringResource(Res.string.open_days)
)
```

## Örnekler

### Projeler

Bir listeyi projelere göre daraltan süzgeç. Her satır bir onay kutusudur: basmak işaretler ya da kaldırır ve liste açık kalır. Kutu, işaretlilerin etiketlerini seçeneklerin sırasıyla gösterir; hiçbiri işaretli değilken yer tutucuyu. Burada hiçbiri işaretli değilken bütün projeler gösterilir, kutu da bunu yer tutucusuyla söyler.

Etiketi yoktur; adını ekran okuyucuya `contentDescription` söyler. Kartın "Son olay" satırı `onSelectionChange`'in en son ne istediğini yazar; öteki örneklerin çoğunda da aynı satır vardır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.icons.PantrixIcons

var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = PROJECTS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report(if (it.isEmpty()) "Tüm projeler gösteriliyor" else "${it.size} proje işaretli")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    placeholder = "Tüm projeler (${PROJECTS.size})",
    contentDescription = "Projeler",
    tagKey = "projects"
)

private val PROJECTS = listOf(
    SelectOption(value = "compose", label = "Rorty Compose Android", icon = PantrixIcons.Folder, tagKey = "compose"),
    SelectOption(value = "android", label = "Rorty Android", icon = PantrixIcons.Folder, tagKey = "android"),
    SelectOption(value = "swiftui", label = "Rorty SwiftUI iOS", icon = PantrixIcons.Folder, tagKey = "swiftui"),
    SelectOption(value = "uikit", label = "Rorty UIKIT iOS", icon = PantrixIcons.Folder, tagKey = "uikit")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Özet metni

`valueText` verilince kutu, bir şey işaretliyken etiketlerin yerine onu yazar: burada "5 gün". Çok seçenek işaretlenince kutu taşmaz.

Hiçbiri işaretli değilken yine yer tutucu görünür: bütün günlerin işaretini kaldır, kutu "Kapalı" yazar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

var chosen by rememberSaveable { mutableStateOf(setOf("mon", "tue", "wed", "thu", "fri")) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = DAYS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("${it.size} gün işaretli")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Açık günler",
    placeholder = "Kapalı",
    valueText = "${chosen.size} gün",
    tagKey = "open_days"
)

private val DAYS = listOf(
    SelectOption(value = "mon", label = "Pazartesi", tagKey = "mon"),
    SelectOption(value = "tue", label = "Salı", tagKey = "tue"),
    SelectOption(value = "wed", label = "Çarşamba", tagKey = "wed"),
    SelectOption(value = "thu", label = "Perşembe", tagKey = "thu"),
    SelectOption(value = "fri", label = "Cuma", tagKey = "fri"),
    SelectOption(value = "sat", label = "Cumartesi", tagKey = "sat"),
    SelectOption(value = "sun", label = "Pazar", tagKey = "sun")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Aranabilir

`searchable = true` listeye bir arama alanı koyar: yazdıkça seçenekler daralır. Odak arama alanında kalır: oklar eşleşen satırlar arasında gezer, klavyenin onay tuşu okların durduğu satırı işaretler ya da işaretini kaldırır ve arama yerinde kalır.

Aramada görünmeyen seçenekler işaretini korur: birkaç dil işaretle, sonra başka bir şey ara. Kutudaki etiketler ve kartın "Son olay" satırındaki sayı değişmez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

var chosen by rememberSaveable { mutableStateOf(emptySet<String>()) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = SKILLS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("${it.size} dil işaretli")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Bildiğiniz diller",
    placeholder = "Dil seçin",
    searchable = true,
    searchPlaceholder = "Dil ara…",
    tagKey = "skills"
)

private val SKILLS = listOf(
    SelectOption(value = "Kotlin", label = "Kotlin", tagKey = "kotlin"),
    SelectOption(value = "Java", label = "Java", tagKey = "java"),
    SelectOption(value = "Swift", label = "Swift", tagKey = "swift"),
    SelectOption(value = "Dart", label = "Dart", tagKey = "dart"),
    SelectOption(value = "TypeScript", label = "TypeScript", tagKey = "typescript"),
    SelectOption(value = "JavaScript", label = "JavaScript", tagKey = "javascript"),
    SelectOption(value = "Python", label = "Python", tagKey = "python"),
    SelectOption(value = "Go", label = "Go", tagKey = "go"),
    SelectOption(value = "Rust", label = "Rust", tagKey = "rust"),
    SelectOption(value = "C#", label = "C#", tagKey = "csharp"),
    SelectOption(value = "Ruby", label = "Ruby", tagKey = "ruby")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Kısmi devre dışı

`SelectOption(enabled = false)` tek bir seçeneği kapatır: seçenek listede kalır ve okunur, ama basılmaz ve ok tuşları onu atlar. Onay kutusu da devre dışı renklerle çizilir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

var chosen by rememberSaveable { mutableStateOf(setOf("mail")) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = CHANNELS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("${it.size} bildirim kanalı işaretli")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Bildirim kanalları",
    placeholder = "Bildirim yok",
    supportingText = "SMS ve arama bu planda yok.",
    tagKey = "channels"
)

private val CHANNELS = listOf(
    SelectOption(value = "mail", label = "E-posta", tagKey = "mail"),
    SelectOption(value = "sms", label = "SMS", enabled = false, tagKey = "sms"),
    SelectOption(value = "push", label = "Anlık bildirim", tagKey = "push"),
    SelectOption(value = "call", label = "Telefon araması", enabled = false, tagKey = "call")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Form alanı

`field` alan `PantrixMultiSelect` bir formun alanına bağlıdır: alanın değeri işaretlilerin kümesidir, hatası yardım metninin yerini alır, kimliği otomasyon anahtarıdır (`MultiSelect_roles`). En az birinin işaretlenmesini `Rules.satisfies` ister.

Hiçbirini işaretlemeden "Davet et"e bas: kuralın mesajı yardım metninin yerine geçer ve odak buraya gelir. Sonra bir rol işaretle ve işaretini kaldır: son işaret kalkınca hata hemen görünür, çünkü alana artık dokunulmuştur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.form.Rules
import com.pantrixui.components.elements.form.field
import com.pantrixui.components.elements.form.rememberFormState
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val roles = form.field(
    "roles",
    initial = emptySet<String>(),
    Rules.satisfies("En az bir rol seçin") { it.isNotEmpty() }
)
val report = LocalExampleEvents.current
PantrixMultiSelect(
    field = roles,
    options = ROLES,
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Roller",
    placeholder = "Rol seçin",
    supportingText = "Bir kişinin birden çok rolü olabilir."
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Davet et",
        onClick = { scope.launch { form.submit { report("Davet gönderildi: ${roles.value.size} rol") } } },
        form = form,
        tagKey = "submit_roles"
    )
    PantrixButton(
        text = "Sıfırla",
        onClick = {
            form.reset()
            report("Form sıfırlandı")
        },
        variant = ButtonVariant.Text,
        tagKey = "reset_roles"
    )
}

private val ROLES = listOf(
    SelectOption(value = "admin", label = "Yönetici", tagKey = "admin"),
    SelectOption(value = "editor", label = "Düzenleyici", tagKey = "editor"),
    SelectOption(value = "viewer", label = "İzleyici", tagKey = "viewer")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Hata ve devre dışı

`error = true` ve `enabled = false` Select'teki gibidir. Hatalı kutunun kenarı, etiketi ve alttaki metni temanın `danger` rolündedir ve metin ekran okuyucuya hata olarak söylenir. Devre dışı kutu devre dışı renklerle çizilir, odak almaz ve listesi açılmaz; neyin işaretli olduğunu yine gösterir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption

PantrixMultiSelect(
    options = ROLES,
    selected = emptySet(),
    onSelectionChange = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Roller",
    placeholder = "Rol seçin",
    supportingText = "En az bir rol seçin",
    error = true,
    tagKey = "roles_in_error"
)
PantrixMultiSelect(
    options = ROLES,
    selected = setOf("editor", "viewer"),
    onSelectionChange = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    enabled = false,
    label = "Roller",
    supportingText = "Rolleri yalnızca yönetici değiştirebilir.",
    tagKey = "roles_disabled"
)

private val ROLES = listOf(
    SelectOption(value = "admin", label = "Yönetici", tagKey = "admin"),
    SelectOption(value = "editor", label = "Düzenleyici", tagKey = "editor"),
    SelectOption(value = "viewer", label = "İzleyici", tagKey = "viewer")
)
```

### Kendi renkleri

`colors = SelectColors(…)` listenin zeminini, yazısını ve kenarını; `fieldColors = TextFieldColors(…)` kutunun odaklı kenarını değiştirir. Burada liste uygulamanın kendi morunun yumuşak dolgusundadır.

Onay kutuları temanın renginde kalır. Seçili satırın dolgusu (`selectedContainer`) burada kullanılmaz: çok seçimli listede seçim onay kutusuyla gösterilir, satır doldurulmaz.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.TextFieldColors
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectColors
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.icons.PantrixIcons

val own = ownColors()
var chosen by rememberSaveable { mutableStateOf(setOf("compose")) }
val report = LocalExampleEvents.current
PantrixMultiSelect(
    options = PROJECTS,
    selected = chosen,
    onSelectionChange = {
        chosen = it
        report("${it.size} proje işaretli")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Projeler",
    placeholder = "Tüm projeler (${PROJECTS.size})",
    colors = SelectColors(container = own.container, content = own.onContainer, border = own.color),
    fieldColors = TextFieldColors(focusedBorder = own.color),
    tagKey = "own_projects"
)

private val PROJECTS = listOf(
    SelectOption(value = "compose", label = "Rorty Compose Android", icon = PantrixIcons.Folder, tagKey = "compose"),
    SelectOption(value = "android", label = "Rorty Android", icon = PantrixIcons.Folder, tagKey = "android"),
    SelectOption(value = "swiftui", label = "Rorty SwiftUI iOS", icon = PantrixIcons.Folder, tagKey = "swiftui"),
    SelectOption(value = "uikit", label = "Rorty UIKIT iOS", icon = PantrixIcons.Folder, tagKey = "uikit")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.
- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Stil

Stil de Select'inkidir: `style` listenin (`SelectStyle`), `fieldStyle` kutunun (`TextFieldStyle`) geometrisidir. Burada listenin satırları 56dp'dir (`itemHeight`), liste en çok 240dp olur ve sığmayan seçenekler içinde kayar (`maxHeight`). Kutunun köşeleri tam yuvarlaktır: `TextFieldStyle(shape = ShapeRole.Full)`.

Yalnızca verilen alanlar değişir; gerisi temanın ve platformun stilinden gelir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.inputs.textfield.TextFieldStyle
import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.components.overlay.select.SelectStyle
import com.pantrixui.foundation.token.shape.ShapeRole

var chosen by rememberSaveable { mutableStateOf(setOf("sat", "sun")) }
PantrixMultiSelect(
    options = DAYS,
    selected = chosen,
    onSelectionChange = { chosen = it },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Teslimat günleri",
    placeholder = "Gün seçin",
    style = SelectStyle(maxHeight = 240.dp, itemHeight = 56.dp),
    fieldStyle = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "styled_days"
)

private val DAYS = listOf(
    SelectOption(value = "mon", label = "Pazartesi", tagKey = "mon"),
    SelectOption(value = "tue", label = "Salı", tagKey = "tue"),
    SelectOption(value = "wed", label = "Çarşamba", tagKey = "wed"),
    SelectOption(value = "thu", label = "Perşembe", tagKey = "thu"),
    SelectOption(value = "fri", label = "Cuma", tagKey = "fri"),
    SelectOption(value = "sat", label = "Cumartesi", tagKey = "sat"),
    SelectOption(value = "sun", label = "Pazar", tagKey = "sun")
)
```

## API

### PantrixMultiSelect

`import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixMultiSelect(
    options: List<SelectOption<T>>,
    selected: Set<T>,
    onSelectionChange: (Set<T>) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
    valueText: String? = null,
    searchable: Boolean = false,
    searchPlaceholder: String? = null,
    style: SelectStyle? = null,
    fieldStyle: TextFieldStyle? = null,
    colors: SelectColors? = null,
    fieldColors: TextFieldColors? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    presentation: OverlayPresentation = OverlayPresentation.Popover
)
```

Kontrolün açtığı bir listeden birden çok seçim: bir sayfanın daraltıldığı projeler, bir dükkânın açık olduğu günler.

Listesi birden çok seçim alan bir `PantrixSelect`'tir. Kutusu bir metin alanının kutusudur: sonunda bir ok vardır, bir alanın etiketini, yer tutucusunu, hatasını ve yardım metnini taşır. Liste kutunun altında, kutuyla aynı genişlikte açılır. Her seçenek bir onay kutusudur: basmak işaretler ya da işareti kaldırır ve liste bir sonraki seçim için açık kalır. Listenin dışına basmak, Escape ve geri tuşu listeyi kapatır. Seçim kontrolün değil çağıranındır: kontrole `selected` verilir, kontrol de `onSelectionChange` ile yeni bir küme ister.

Kutu seçilenlerin etiketlerini seçeneklerin sırasıyla, aralarında virgülle ve tek satırda kesilmiş olarak gösterir. Çağıran bunu başka türlü söylemek isterse kutu `valueText`'i gösterir: bir sayı ya da hepsi için tek bir söz. Hiçbir şey seçili değilken yer tutucusunu gösterir. Ne kadar geniş olacağı sorulduğunda, `Modifier.width(IntrinsicSize.Max)`'in sorduğu gibi, bir `PantrixSelect` gibi cevap verir: ne seçili olursa olsun, en uzun seçeneğinin gerektirdiğiyle.

Klavyesi Select'inkidir. Klavyeyle açılınca liste odağı seçili ilk seçeneğe alır, seçili yoksa ilk seçeneğine. Ok tuşları seçenekler arasında gezer ve sondan başa döner, Home ve End ilk ve son seçeneğe gider, Enter ve boşluk işaretler ya da işareti kaldırır. `searchable` ile listede seçenekleri daraltan bir alan olur, kutuya en yakın kenarında: kutunun altında açılınca en üstte, kutunun üstünde açılınca en altta. Odak o alanda kalır ve klavyenin onay tuşu okların durduğu seçeneği işaretler ya da işaretini kaldırır.

Stili ve renkleri Select'inkilerdir, `SelectStyle` ve `SelectColors`, kutusununkiler de bir metin alanınınkilerdir: Select'lerini yeniden biçimlendiren bir ürün bunları da onlarla birlikte biçimlendirmiş olur.

Parametreler:

- `options: List<SelectOption<T>>`: Seçenekler, gösterildikleri sırayla. Hiç seçenek yoksa liste bunu söyler.
- `selected: Set<T>`: Şu an seçili olan değerler: değeri bunların arasında olan her seçenek işaretlidir.
- `onSelectionChange: (Set<T>) -> Unit`: Yeni bir küme istemek için kümenin tamamıyla çağrılır: basılan seçeneğin değeri eklenmiş ya da çıkarılmış önceki küme.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin.
- `enabled: Boolean`: Listenin açılıp açılamayacağı. Listesi açılamayan kontrol odak almaz, devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `label: String?`: Seçimin ne olduğu. Kutunun üstüne yazılır ve ekran okuyucu için alanın adıdır, listesi de bu adla duyurulur.
- `placeholder: String?`: Hiçbir şey seçili değilken kutuda gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Seçimin hatalı olup olmadığı: kenar, etiket ve yardım metni danger rolüne döner, ekran okuyucuya da söylenir.
- `valueText: String?`: Bir şey seçiliyken kutunun, seçili etiketlerin yerine gösterdiği metin.
- `searchable: Boolean`: Listede seçenekleri aramak için bir alan olup olmadığı.
- `searchPlaceholder: String?`: Arama alanının boşken gösterdiği metin ve alanın adı. Bu null ise temanın arama için kullandığı sözcüktür.
- `style: SelectStyle?`: Bu çağrının kendi `SelectStyle`'ı, listesinin çizildiği stil: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir, her platformda.
- `fieldStyle: TextFieldStyle?`: Bu çağrının kendi `TextFieldStyle`'ı, kutusunun çizildiği stil: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: SelectColors?`: Listesinin kendi renkleri, temanın rollerinin yerine: verdikleri kullanılır, gerisi temanın kalır. Onay kutuları temanın renklerindedir.
- `fieldColors: TextFieldColors?`: Kutusunun kendi renkleri, bir metin alanının aldığı gibi. Devre dışı kontrol, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label` verilmeyen alanın adıdır.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `MultiSelect_<tagKey>`, listesi `MultiSelectList_<tagKey>`, listenin arama alanı `MultiSelectSearch_<tagKey>` diye etiketlenir, seçenekleri de onun içinde adlandırılır: `MultiSelect_<tagKey>.MultiSelectOption_<option's key>`. Listesinin açıldığını ve bir seçeneğin işaretlendiğini ya da işaretinin kaldırıldığını bildirir: seçeneğin anahtarıyla, hiçbir zaman etiketiyle değil.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.
- `presentation: OverlayPresentation`: listenin nasıl gösterildiği: varsayılan alanın altında; pencerenin altından bir sheet olarak, başlığı alanın etiketi; ya da dar bir pencerede biri, daha geniş pencerede öteki. Liste açılırken seçilir, kapanana kadar kalır.

### PantrixMultiSelect

`import com.pantrixui.components.overlay.multiselect.PantrixMultiSelect`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixMultiSelect(
    field: FormField<Set<T>>,
    options: List<SelectOption<T>>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    valueText: String? = null,
    searchable: Boolean = false,
    searchPlaceholder: String? = null,
    style: SelectStyle? = null,
    fieldStyle: TextFieldStyle? = null,
    colors: SelectColors? = null,
    fieldColors: TextFieldColors? = null,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource? = null,
    presentation: OverlayPresentation = OverlayPresentation.Popover
)
```

Bir formun alanına bağlı MultiSelect: seçimleri, hatası ve adı `field`'dan gelir.

Bir işaretleme ya da bir işaretin kaldırılması alanı değiştirir ve dokunulmuş sayar. Bu yüzden bir kuralın mesajı bunların ilkinden sonra ya da form gönderildiğinde görünür, kimsenin dokunmadığı bir formda görünmez. Alan hatalıyken mesaj `supportingText`'in yanında durmaz, onun yerini alır. Alanın kimliği otomasyon anahtarıdır, `MultiSelect_<id>`, seçenekleri de onun içindedir. Form, bu alan hatalıyken gönderildiğinde odağı buraya yollayabilir.

Kontrollü biçimin bir parametresi değil, ayrı bir overload'dur: böylece bir küme ile bir alan birlikte verilemez.

Parametreler:

- `field: FormField<Set<T>>`: Kontrolün gösterdiği ve değiştirdiği alan: seçeneklerin değerlerinden oluşan bir küme.
- `options: List<SelectOption<T>>`: Seçenekler, gösterildikleri sırayla.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin.
- `enabled: Boolean`: Listenin açılıp açılamayacağı.
- `label: String?`: Seçimin ne olduğu. Kutunun üstüne yazılır ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Hiçbir şey seçili değilken kutuda gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `valueText: String?`: Bir şey seçiliyken kutunun, seçili etiketlerin yerine gösterdiği metin.
- `searchable: Boolean`: Listede seçenekleri aramak için bir alan olup olmadığı.
- `searchPlaceholder: String?`: Arama alanının boşken gösterdiği metin ve alanın adı.
- `style: SelectStyle?`: Bu çağrının kendi `SelectStyle`'ı, listesinin çizildiği stil.
- `fieldStyle: TextFieldStyle?`: Bu çağrının kendi `TextFieldStyle`'ı, kutusunun çizildiği stil.
- `colors: SelectColors?`: Listesinin kendi renkleri: verdikleri kullanılır, gerisi temanın kalır.
- `fieldColors: TextFieldColors?`: Kutusunun kendi renkleri, bir metin alanının aldığı gibi.
- `contentDescription: String?`: `label` verilmeyen alan için ekran okuyucunun söylediği.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri. Null verilirse alan kendi kaynağını tutar.
- `presentation: OverlayPresentation`: listenin nasıl gösterildiği: alanın altında, bir sheet olarak ya da pencerenin genişliğine göre.

### SelectOption

`import com.pantrixui.components.overlay.select.SelectOption`, `com.pantrixui:components` içinden

```kotlin
class SelectOption<out T>(
    public val value: T,
    public val label: String,
    public val icon: ImageVector? = null,
    public val enabled: Boolean = true,
    public val tagKey: String? = null
)
```

Bir `PantrixSelect`'in, aynı zamanda bir `PantrixMultiSelect`'in tek bir seçeneği: temsil ettiği değer, etiketi ve otomasyon için bir anahtar.

Parametreler:

- `value: T`: Seçenek seçilince select'in çağırana verdiği ve seçili olanla `==` ile karşılaştırdığı değer.
- `label: String`: Görünen metin, seçeneğin ekran okuyucudaki adı ve aramanın baktığı yer.
- `icon: ImageVector?`: Etiketin önüne, etiketin renginde çizilir. İkon olmayacaksa null verilir. Ekran okuyucu onu atlar.
- `enabled: Boolean`: Seçeneğin seçilip seçilemeyeceği. Seçilemeyen seçenek devre dışı renkle çizilir, basış almaz ve klavye onu atlar. Listede kalır: seçilemeyen şey yine de okunmak için oradadır.
- `tagKey: String?`: Seçeneğin her dilde aynı olan otomasyon anahtarı: seçenek `SelectOption_<tagKey>` olur, anahtar verilmezse `SelectOption_<index>`. Anahtarı olan bir select'in etiketinin içindedir: `Select_country.SelectOption_tr`. MultiSelect'te `MultiSelectOption_<tagKey>` olur, `MultiSelect_<the control's key>` içinde.

### SelectStyle

`import com.pantrixui.components.overlay.select.SelectStyle`, `com.pantrixui:components` içinden

```kotlin
class SelectStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxHeight: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val itemHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified
) : PantrixStyle<SelectStyle>
```

Bir `PantrixSelect`'in açtığı liste: çizildiği panel, bu panelin ait olduğu kutudan ve pencerenin kenarlarından ne kadar uzakta durduğu ve satırları.

Kutu bunun parçası değildir: bir select'in kutusu bir metin alanının kutusudur ve `TextFieldStyle` ile çizilir. Liste, bu stil ne derse desin kutu kadar geniştir ve bir ürün ona kendi köşelerini vermedikçe kutunun köşelerini taşır.

Hava yoğunlukla ölçeklenir: kutuya uzaklık, kenar boşluğu, ilk satırın üstündeki ve son satırın altındaki iç boşluk, bir satırın yüksekliği ile içindeki iç boşluk ve aralık. En çok yükseklik, köşeler, gölge ve ikon ölçeklenmez. Yoğunluk ne olursa olsun bir satır platformun dokunma hedefinden kısa olmaz. Bir listenin renkleri stilinin parçası değildir: temanındır, kendi renkleri olan bir çağrıda `SelectColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Panelin köşeleri: her platformda şekil ölçeğinin orta adımı, kutunun köşeleri gibi.
- `maxHeight: Dp`: Panelin en çok yüksekliği: sığmayan seçenekler kayar.
- `elevation: Dp`: Panelin uygulamanın üstünde ne kadar yüksekte durduğu, yani gölgesinin ne kadar büyük olduğu.
- `gap: Dp`: Kutu ile listesinin arası.
- `margin: Dp`: Panel ile pencerenin kenarları arasında, bir de pencereyi orada örten şeylerle arasında boş bırakılan yer: bir sistem çubuğu, bir ekran çentiği, klavye.
- `verticalPadding: Dp`: İlk satırın üstündeki ve son satırın altındaki boşluk.
- `itemHeight: Dp`: Platformun dokunma hedefi daha yüksek değilse bir satırın en az yüksekliği.
- `horizontalPadding: Dp`: Panelin kenarından bir satırın başındaki şeye ve satırın sonundaki şeyden öteki kenara kadar olan boşluk. Her preset metin alanının kendi değerini taşır: böylece bir seçeneğin etiketi kutudaki metnin başladığı yerde başlar.
- `iconSize: Dp`: Bir seçeneğin ikonu ve seçili olanın yanındaki onay işareti.
- `iconGap: Dp`: Bir satırın parçalarının arası: onay kutusu, ikonu, etiketi ve onay işareti.

### SelectColors

`import com.pantrixui.components.overlay.select.SelectColors`, `com.pantrixui:components` içinden

```kotlin
data class SelectColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val selectedContainer: Color = Color.Unspecified,
    public val selectedContent: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir çağrı için bir `PantrixSelect`'in listesinin boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır. Kutunun renkleri `TextFieldColors`'tır.

```kotlin
PantrixSelect(…, colors = SelectColors(selectedContainer = PantrixTheme.colors.success.container))
```

Burada verilen bir `container` ya da `selectedContainer` temanın rol renklerinden biriyse üstüne yazılanlar, onlara ayrıca renk verilmedikçe, temanın o renkle eşlediği rengi alır. Hiçbir rolde olmayan bir dolguda bu olmaz: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Panelin dolgusu. Temanın `surface`'ı.
- `content: Color`: Bir seçeneğin etiketi ve ikonu. Temanın `textPrimary`'si.
- `selectedContainer: Color`: Tek seçimli bir select'te seçili seçeneğin satırının dolgusu. `primary` rolünün container'ı. Çok seçimli bir select seçimlerini onay kutularıyla gösterir ve hiçbir satırı doldurmaz.
- `selectedContent: Color`: Tek seçimli bir select'te seçili seçeneğin etiketi, ikonu ve yanındaki onay işareti. `primary` rolünün `onContainer`'ı.
- `border: Color`: Panelin çevresindeki ince çizgi ve satırlar ile listenin arama alanı arasındaki çizgi. Çevredeki çizgi paneli, altında duran kendi rengindeki bir yüzeyden ayırır, gölgenin az göründüğü koyu temada olduğu gibi. Temanın kendi zeminlerinde temanın `divider`'ıdır. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, `content`'in bir payıdır: Subtle bir düğmenin kenarı gibi. Saydam bir renk verilirse çizgi çizilmez.

### TextFieldStyle

`import com.pantrixui.components.inputs.textfield.TextFieldStyle`, `com.pantrixui:components` içinden

```kotlin
class TextFieldStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val iconPadding: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val focusedBorderWidth: Dp = Dp.Unspecified,
    public val textRole: TypeRole? = null
) : PantrixStyle<TextFieldStyle>
```

`PantrixTextField`'ın kutusu: şekli, en az yüksekliği ve genişliği, metninin çevresindeki boşluk, ikonları ve kenarlığı.

`height` yalnızca kutunun yüksekliğidir. Etiket kutunun içinde değil üstünde durur, bu yüzden tek bir yükseklik hem etiketli hem etiketsiz alana uyar. Bu, en az yüksekliktir: birkaç satırlı bir alan ya da büyük bir yazı ölçeği kutuyu uzatır ve metni asla kesmez. Her preset'in `verticalPadding`'i, her yoğunlukta, yüksekliğinden geriye en az body rolünün bir satırını bırakır. Böylece tek satırlı bir alan tam stilinin söylediği yüksekliktedir.

İkon, kutunun kenarına yaslı, `iconSize + 2 × iconPadding` boyutunda bir yuvada durur. Yuvanın yanındaki metin ondan `horizontalPadding − iconPadding` uzakta başlar. Android'de bu, 44dp'lik bir yuvadır: ikon kenardan 10dp, metin 48dp uzaktadır.

Kutunun köşeleri her platformda şekil ölçeğinin orta adımıdır.

Parametreler:

- `shape: ShapeSpec`: Kutunun şekli. Tam yuvarlak bir şekil, `ShapeRole.Full`, yalnızca alan tek satır tutarken bir haptır: birkaç satırlı bir alan onun yerine `ShapeRole.Large` alır, çünkü bir kapsülün eğrisi metninin ilk satırına girer.
- `height: Dp`: Kutunun en az yüksekliği.
- `minWidth: Dp`: Kutunun en az genişliği: boş bir alanın, kullanıcı içine yazdıkça genişlemesini önler.
- `horizontalPadding: Dp`: İkon olmayan yerde, kutunun kenarı ile metni arasındaki boşluk.
- `verticalPadding: Dp`: Metnin ilk satırının üstündeki ve son satırının altındaki boşluk.
- `iconPadding: Dp`: Yuvasındaki bir ikonun çevresindeki boşluk.
- `iconSize: Dp`: Yuvadaki bir ikonun alması gereken boyut. Yuva, içine konanı boyutlandırmaz.
- `borderWidth: Dp`: Kutunun kenarlığının kalınlığı.
- `focusedBorderWidth: Dp`: Alan odaktayken kenarlığın kalınlığı: odağı gösteren kenarlıktır.
- `textRole: TypeRole?`: Metnin yazıldığı, yer tutucunun da yazıldığı yazı ölçeği rolü: Android'de ve iOS'ta body, 16sp, Material 3'ün ve iOS'un bir alana yazdığı gibi; masaüstünde ve web'de label, 14sp, işaretçiyle kullanılan bir sayfadaki gibi. Bir select'in kutusu ve bu stille kurulan alanlar da onu alır.

### TextFieldColors

`import com.pantrixui.components.inputs.textfield.TextFieldColors`, `com.pantrixui:components` içinden

```kotlin
data class TextFieldColors(
    public val container: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val hoveredBorder: Color = Color.Unspecified,
    public val focusedBorder: Color = Color.Unspecified,
    public val error: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val label: Color = Color.Unspecified,
    public val placeholder: Color = Color.Unspecified,
    public val supportingText: Color = Color.Unspecified,
    public val icon: Color = Color.Unspecified,
    public val cursor: Color = Color.Unspecified,
    public val scrollBar: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir alan için `PantrixTextField`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen temadaki rolünde kalır. Bir ürün yalnızca değiştirdiği renkleri verir, başkasını vermez:

```kotlin
PantrixTextField(
    state = state,
    label = stringResource(Res.string.email),
    colors = TextFieldColors(focusedBorder = brand, cursor = brand)
)
```

Bunlar, salt okunur olsun olmasın, etkin bir alanın renkleridir. Devre dışı bir alan, burada ne verilirse verilsin temanın devre dışı rolleriyle çizilir: devre dışı bir alan ürünün her yerinde aynı görünsün diye.

Parametreler:

- `container: Color`: Kutunun dolgusu. Temanın `surface` rengi.
- `border: Color`: Dinlenirken kutunun kenarlığı. Temanın `border` rengi.
- `hoveredBorder: Color`: Fare üstündeyken kenarlık. Temanın `borderHover` rengi: `border`'dan bir basamak güçlüsü.
- `focusedBorder: Color`: Alan odaktayken kenarlık. Temanın `primary` rengi.
- `error: Color`: Metnin yanlış olduğunu söyleyenler: kenarlık, etiket, kutunun altındaki mesaj, imleç ve sınırını aştığında sayaç. Temanın `danger` rengi.
- `text: Color`: Yazılan metin. Temanın `textPrimary` rengi.
- `label: Color`: Kutunun üstündeki etiket. Verilmezse, alanın durduğu yerde herhangi bir metin nasıl çiziliyorsa öyle çizilir, çünkü etiket kutunun dışında, alan neyin üstüne konmuşsa onun üstündedir: temanın kendi zemininde `textPrimary` ile, bir dolgunun üstünde o dolgunun içerik rengiyle.
- `placeholder: Color`: Yer tutucu. Temanın `textSecondary` rengi.
- `supportingText: Color`: Kutunun altındaki yardım metni ve sayaç. Temanın `textSecondary` rengi.
- `icon: Color`: Yuvadaki bir ikonun, kendi rengini vermedikçe çizildiği renk ve temizleme düğmesinin çarpısı. Temanın `textSecondary` rengi.
- `cursor: Color`: İmleç ve onunla birlikte bir seçimin tutamaçları ile zemini. Temanın `primary` rengi.
- `scrollBar: Color`: Birkaç satırlı bir kutunun metninin ne kadar kaydığını gösteren çubuk. Temanın `borderStrong`'u: metnin yanında bir işarettir ve kutunun yumuşak kenarı orada görünmezdi.

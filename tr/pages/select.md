# Select

Bir listeden tek bir seçim: bir ülke, bir para birimi, bir plan. Kutusu bir metin alanının kutusudur: etiketi üstünde, yardım ya da hata metni altında, sonunda bir ok. Kutuya basınca liste kutunun altında, kutuyla aynı genişlikte açılır.

Seçim bileşenin değil çağıranındır: `selected` verilir, `onSelect` yenisini ister. Bir seçeneğe basmak seçer ve listeyi kapatır; dışına basmak, geri tuşu ve Escape yalnızca kapatır.

Okunacak kadar kısa ya da aranmaya değer bir liste içindir. Hepsi birden görünmesi gereken iki üç seçenek için radyo grubu ya da segment düğmesi, işler için menü, birden çok değer için `PantrixMultiSelect` kullanılır.

- `PantrixSelect` (`com.pantrixui.components.overlay.select`, `com.pantrixui:components`): Kontrolün kendi altında açtığı bir listeden tek bir seçim, bir yazı alanının kutusunda; listede aranabilir, seçeneklerin ikonları olabilir ve tek tek devre dışı bırakılabilir; bir formun alanına bağlanır. Anahtar sözcükler: açılır liste, açılır menü, seçici, seçim kutusu, seçenekler, aranabilir liste.

## Özellikler

- **Bir alanın kutusu.** `label`, `placeholder`, `supportingText` ve `error` bir metin alanındaki gibidir. Liste açıkken kutu odaklı bir alan gibi çizilir.
- **Seçili satır.** Seçili seçenek, satırının dolgusu ve sonundaki onay işaretiyle belli olur: yalnızca bir renkle değil. Liste, seçili satır görünür hâlde açılır.
- **Listenin yeri.** Liste kutunun altında açılır ve orada kalır: altındaki yere sığmıyorsa o yer kadar kısalır ve içinde kayar. Altında üç satırına yer yoksa kutunun üstünde açılır. Açıldıktan sonra, klavye gelip yeri daraltsa da, bir satırına yer oldukça yerinde kalır.
- **Arama.** `searchable` listeye, seçenekleri etiketine göre daraltan bir arama alanı koyar; liste kalan satırlar kadar kısalır.
- **Seçenekler.** Bir `SelectOption` bir değer, bir etiket ve istenirse bir ikon taşır. `enabled = false` olan seçenek listede kalır ve okunur, ama seçilemez.
- **Klavye.** Enter ya da boşluk listeyi açar ve odak seçili satıra gelir. Oklar satırlar arasında gezer ve sondan başa döner, Home ve End ilk ve son satıra gider, Enter ve boşluk seçer. Liste kapanınca odak yine kutudadır.
- **Form.** `field` alan `PantrixSelect` seçimini, hatasını ve adını formun alanından alır.
- **Renkler ve stil.** Listenin renkleri `colors` (`SelectColors`), kutunun renkleri `fieldColors` (`TextFieldColors`) ile; listenin stili `style` (`SelectStyle`), kutunun stili `fieldStyle` (`TextFieldStyle`) ile verilir.
- **Ekran okuyucu.** Kutu, kapalı ya da açık bir açılır listedir; etiketi ve yardım metni onunla birlikte okunur. Etiketi olmayan bir select'in adını `contentDescription` verir.
- **Otomasyon.** `tagKey` kutuyu `Select_<tagKey>`, listesini `SelectList_<tagKey>`, arama alanını `SelectSearch_<tagKey>` diye etiketler. Seçenekler kutunun içinde adlandırılır: `Select_country.SelectOption_tr`.

## Kullanım

### A country, with nothing chosen at first

```kotlin
var country by rememberSaveable { mutableStateOf<String?>(null) }
PantrixSelect(
    options = countries.map { SelectOption(value = it.code, label = it.name, tagKey = it.code) },
    selected = country,
    onSelect = { country = it },
    label = stringResource(Res.string.country),
    placeholder = stringResource(Res.string.choose_a_country),
    tagKey = "country"
)
```

### Bound to a form's field, where a choice has to be made

```kotlin
val form = rememberFormState()
val plan = form.field<String?>("plan", initial = null, Rules.required(stringResource(Res.string.plan_required)))
PantrixSelect(
    field = plan,
    options = plans.map { SelectOption(value = it.id, label = it.name, tagKey = it.id) },
    label = stringResource(Res.string.plan)
)
```

### A list that is searched, with options that cannot be chosen

```kotlin
PantrixSelect(
    options = languages.map {
        SelectOption(value = it.id, label = it.name, enabled = it.supported, tagKey = it.id)
    },
    selected = language,
    onSelect = { language = it },
    label = stringResource(Res.string.language),
    searchable = true,
    searchPlaceholder = stringResource(Res.string.search_languages),
    tagKey = "language"
)
```

### As wide as its options need, in a toolbar

```kotlin
PantrixSelect(
    options = zooms.map { SelectOption(value = it.percent, label = it.label, tagKey = it.key) },
    selected = zoom,
    onSelect = { zoom = it },
    modifier = Modifier.width(IntrinsicSize.Max),
    contentDescription = stringResource(Res.string.zoom),
    tagKey = "zoom"
)
```

### Icons before the options, in colours of its own, with no label

```kotlin
val success = PantrixTheme.colors.success
PantrixSelect(
    options = folders.map {
        SelectOption(value = it.id, label = it.name, icon = PantrixIcons.Folder, tagKey = it.id)
    },
    selected = folder,
    onSelect = { folder = it },
    colors = SelectColors(selectedContainer = success.container),
    fieldColors = TextFieldColors(focusedBorder = success.color),
    contentDescription = stringResource(Res.string.folder),
    tagKey = "folder"
)
```

## Örnekler

### Tek seçim

En yalın hâli: seçenekler, `selected` ve `onSelect`. Kutu seçileni, hiçbir şey seçili değilken `placeholder`'ı gösterir; `label` kutunun üstünde, `supportingText` altındadır.

Kutuya bas: liste altında, kutuyla aynı genişlikte açılır ve kutu odaklı bir alan gibi çizilir. Bir seçeneğe basmak seçer ve kapatır; dışına basmak, geri tuşu ve Escape yalnızca kapatır. Kartın "Son olay" satırı `onSelect`'in en son ne istediğini yazar; öteki örneklerin çoğunda da aynı satır vardır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var country by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = COUNTRIES,
    selected = country,
    onSelect = { code ->
        country = code
        report("Ülke seçildi: ${COUNTRIES.first { it.value == code }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Ülke",
    placeholder = "Bir ülke seçin",
    supportingText = "Faturanız bu ülkenin vergisiyle kesilir.",
    tagKey = "country"
)

private val COUNTRIES = listOf(
    SelectOption(value = "tr", label = "Türkiye", tagKey = "tr"),
    SelectOption(value = "de", label = "Almanya", tagKey = "de"),
    SelectOption(value = "gb", label = "Birleşik Krallık", tagKey = "gb"),
    SelectOption(value = "jp", label = "Japonya", tagKey = "jp"),
    SelectOption(value = "us", label = "Amerika Birleşik Devletleri", tagKey = "us")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Aranabilir

`searchable = true` listeye bir arama alanı koyar: yazdıkça seçenekler, etiketinde yazılanı taşıyanlara daralır ve liste kalan satırlar kadar kısalır. `searchPlaceholder` alanın boşken gösterdiği yazıdır.

Odak arama alanında kalır: oklar eşleşen satırlar arasında bir işareti gezdirir, klavyenin onay tuşu işaretli satırı seçer. Bir şey yazılır yazılmaz işaret ilk eşleşendedir. Masaüstünde ve masaüstündeki bir tarayıcıda alan liste açılınca odağı alır; telefonda ve tablette dokunulmasını bekler. Klavye açılınca liste kutunun altında kalır ve kısalır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var language by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = LANGUAGES,
    selected = language,
    onSelect = { name ->
        language = name
        report("Dil seçildi: $name")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Dil seçiniz (Aranabilir)",
    placeholder = "Bir dil seçin",
    searchable = true,
    searchPlaceholder = "Dil ara…",
    tagKey = "language"
)

private val LANGUAGES = listOf(
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

`SelectOption(enabled = false)` tek bir seçeneği kapatır. Seçenek listede kalır ve okunur, ama devre dışı renkle yazılır, basılmaz ve klavye onu atlar: seçilemeyen şey de orada olduğu bilinsin diye listeden çıkarılmaz.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var option by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = PARTLY_DISABLED,
    selected = option,
    onSelect = { value ->
        option = value
        report("Seçildi: ${PARTLY_DISABLED.first { it.value == value }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Seçenek",
    placeholder = "Bir seçenek seçin",
    tagKey = "partly_disabled"
)

private val PARTLY_DISABLED = listOf(
    SelectOption(value = "active_1", label = "Aktif Seçenek 1", tagKey = "active_1"),
    SelectOption(value = "disabled_1", label = "Devre Dışı Seçenek", enabled = false, tagKey = "disabled_1"),
    SelectOption(value = "active_2", label = "Aktif Seçenek 2", tagKey = "active_2"),
    SelectOption(value = "disabled_2", label = "Devre Dışı Seçenek 2", enabled = false, tagKey = "disabled_2")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Simgeli seçenekler

`SelectOption(icon = …)` seçeneğin başına bir ikon koyar: ikon etiketin rengindedir ve ekran okuyucu onu atlar. Seçili satır dolgusuyla ve sonundaki onay işaretiyle belli olur. Kutu yalnızca seçilenin etiketini yazar.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.icons.PantrixIcons

var folder by rememberSaveable { mutableStateOf<String?>("documents") }
val report = LocalExampleEvents.current
PantrixSelect(
    options = FOLDERS,
    selected = folder,
    onSelect = { value ->
        folder = value
        report("Klasör seçildi: ${FOLDERS.first { it.value == value }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Klasör",
    tagKey = "folder"
)

private val FOLDERS = listOf(
    SelectOption(value = "documents", label = "Belgeler", icon = PantrixIcons.Folder, tagKey = "documents"),
    SelectOption(value = "favourites", label = "Sık kullanılanlar", icon = PantrixIcons.Star, tagKey = "favourites"),
    SelectOption(value = "inbox", label = "Gelen kutusu", icon = PantrixIcons.Inbox, tagKey = "inbox")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Çalışma alanı seçici

Bu bir `PantrixSelect` değil. `PantrixSelect`'in seçenekleri tek satırlık bir etiket ve bir ikondur; avatar, alt metin ve alttaki eylem satırı gerektiğinde seçici `PantrixPopover` ile kurulur ve bunlar popover'ın içeriği olarak yazılır: `PantrixTextField`, `PantrixAvatar` ve `PantrixDivider` ile.

Tetikleyici bir avatar, ad ve plan satırıdır. Açılan panelde bir arama alanı, bir başlık, avatarlı ve alt metinli satırlar, seçili satırın sonunda onay işareti ve en altta yeni bir çalışma alanı açan satır vardır. Bir satıra basmak onu seçer ve paneli kapatır; arama, panel her açıldığında boş başlar.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.popover.PantrixPopover
import com.pantrixui.components.overlay.popover.PopoverAlignment
import com.pantrixui.components.overlay.popover.PopoverStyle
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var currentId by rememberSaveable { mutableStateOf(WORKSPACES.first().id) }
val report = LocalExampleEvents.current
val query = rememberTextFieldState()
val current = WORKSPACES.first { it.id == currentId }
val typed = query.text.toString().trim()
val shown = WORKSPACES.filter { it.name.contains(typed, ignoreCase = true) }
PantrixPopover(
    visible = open,
    onDismissRequest = {
        open = false
        report("Çalışma alanı paneli kapatıldı")
    },
    anchor = {
        SelectWorkspaceTrigger(
            workspace = current,
            onClick = {
                // Arama panel açılırken boşalır, kapanırken değil: panel solarken içindeki liste yerinden oynamaz.
                query.clearText()
                open = true
            }
        )
    },
    alignment = PopoverAlignment.Start,
    style = PopoverStyle(minWidth = 280.dp, maxWidth = 280.dp),
    tagKey = "workspace"
) {
    PantrixTextField(
        state = query,
        modifier = Modifier.fillMaxWidth(),
        placeholder = "Çalışma alanı ara…",
        contentDescription = "Çalışma alanı ara",
        tagKey = "workspace_search"
    )
    PantrixText(
        text = "Çalışma alanları",
        style = PantrixTheme.typography.label,
        color = PantrixTheme.colors.textSecondary
    )
    if (shown.isEmpty()) {
        PantrixText(text = "Eşleşen çalışma alanı yok", color = PantrixTheme.colors.textSecondary)
    }
    shown.forEach { workspace ->
        SelectWorkspaceRow(workspace = workspace, selected = workspace.id == currentId) {
            currentId = workspace.id
            open = false
            report("Çalışma alanı: ${workspace.name}")
        }
    }
    PantrixDivider()
    SelectWorkspaceCreateRow {
        open = false
        report("Çalışma alanı oluştur'a basıldı")
    }
}

@Composable
private fun SelectWorkspaceTrigger(
    workspace: SelectWorkspace,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Row(
        modifier = Modifier
            .widthIn(max = 280.dp)
            .fillMaxWidth()
            .clip(PantrixTheme.shapes.md)
            .testTag("workspace_trigger")
            .clickable(role = Role.DropdownList, onClick = onClick)
            .padding(spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixAvatar(contentDescription = null, initials = workspace.initials, tone = AvatarTone.Primary)
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = workspace.name, style = PantrixTheme.typography.label, maxLines = 1)
            PantrixText(
                text = workspace.plan,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
        PantrixIcon(
            imageVector = PantrixIcons.ChevronDown,
            contentDescription = null,
            tint = PantrixTheme.colors.textSecondary
        )
    }
}

@Composable
private fun SelectWorkspaceRow(
    workspace: SelectWorkspace,
    selected: Boolean,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(PantrixTheme.shapes.md)
            .testTag("workspace_${workspace.id}")
            .selectable(selected = selected, role = Role.RadioButton, onClick = onClick)
            .padding(vertical = spacing.xs),
        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixAvatar(contentDescription = null, initials = workspace.initials, tone = AvatarTone.Primary)
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = workspace.name, style = PantrixTheme.typography.label, maxLines = 1)
            PantrixText(
                text = "${workspace.projects} proje",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
        if (selected) {
            PantrixIcon(
                imageVector = PantrixIcons.Check,
                contentDescription = null,
                tint = PantrixTheme.colors.primary.color
            )
        }
    }
}

@Composable
private fun SelectWorkspaceCreateRow(onClick: () -> Unit) {
    val spacing = PantrixTheme.spacing
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(PantrixTheme.shapes.md)
            .testTag("workspace_create")
            .clickable(role = Role.Button, onClick = onClick)
            .padding(vertical = spacing.sm),
        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Plus, contentDescription = null)
        PantrixText(text = "Çalışma alanı oluştur", style = PantrixTheme.typography.label)
    }
}

private class SelectWorkspace(
    val id: String,
    val name: String,
    val initials: String,
    val plan: String,
    val projects: Int
)

private val WORKSPACES = listOf(
    SelectWorkspace(id = "rorty_live", name = "Rorty LIVE", initials = "RL", plan = "ücretsiz", projects = 4),
    SelectWorkspace(id = "rorty_staging", name = "Rorty Staging", initials = "RS", plan = "ücretsiz", projects = 2),
    SelectWorkspace(id = "pantrix_labs", name = "Pantrix Labs", initials = "PL", plan = "pro", projects = 7)
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Form alanı

`field` alan `PantrixSelect` bir formun alanına bağlıdır: alanın değeri seçimdir, hatası yardım metninin yerini alır, kimliği otomasyon anahtarıdır (`Select_plan`). Yapılması zorunlu bir seçim, null ile başlayan bir alan ve `Rules.required` ile kurulur.

Bir şey seçmeden "Gönder"e bas: kuralın mesajı yardım metninin yerine geçer ve odak select'e gelir. Seçim alanı değiştirir ve "dokunuldu" sayar: bir plan seçilince mesaj kalkar. "Sıfırla" formu başa döndürür.

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
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val form = rememberFormState()
val scope = rememberCoroutineScope()
val plan = form.field<String?>("plan", initial = null, Rules.required("Devam etmek için bir plan seçin"))
val report = LocalExampleEvents.current
PantrixSelect(
    field = plan,
    options = PLANS,
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Plan",
    placeholder = "Bir plan seçin",
    supportingText = "Sonradan değiştirebilirsiniz."
)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Gönder",
        onClick = {
            scope.launch {
                form.submit { report("Form gönderildi: ${PLANS.first { it.value == plan.value }.label}") }
            }
        },
        form = form,
        tagKey = "submit_plan"
    )
    PantrixButton(
        text = "Sıfırla",
        onClick = {
            form.reset()
            report("Form sıfırlandı")
        },
        variant = ButtonVariant.Text,
        tagKey = "reset_plan"
    )
}

private val PLANS = listOf(
    SelectOption(value = "free", label = "Ücretsiz", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Takım", tagKey = "team")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Hata ve devre dışı

`error = true` kutunun kenarını, etiketini ve alttaki metni temanın `danger` rolüne çevirir; alttaki metin ekran okuyucuya hata olarak söylenir. `enabled = false` kutuyu devre dışı renklerle çizer: kutu odak almaz ve liste açılmaz.

İkisi de bir metin alanının o hâllerindeki gibi çizilir. Devre dışı select neyin seçili olduğunu yine gösterir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

PantrixSelect(
    options = PLANS,
    selected = null,
    onSelect = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Plan",
    placeholder = "Bir plan seçin",
    supportingText = "Devam etmek için bir plan seçin",
    error = true,
    tagKey = "plan_in_error"
)
PantrixSelect(
    options = PLANS,
    selected = "team",
    onSelect = {},
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    enabled = false,
    label = "Plan",
    supportingText = "Planı yalnızca yönetici değiştirebilir.",
    tagKey = "plan_disabled"
)

private val PLANS = listOf(
    SelectOption(value = "free", label = "Ücretsiz", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Takım", tagKey = "team")
)
```

### Uzun liste

Seçenekler listenin en çok yüksekliğini aşınca liste içinde kayar. Liste, seçili satır ortasına yakın görünecek biçimde açılır: burada altmış yılın otuz altıncısı seçilidir ve liste oraya kaymış olarak gelir.

Klavyeyle açıldığında odak seçili satırdadır. Dokunarak ya da tıklayarak açıldığında hiçbir satır odağı göstermez; ilk ok tuşu seçili satırdan devam eder.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var year by rememberSaveable { mutableStateOf<Int?>(1995) }
val report = LocalExampleEvents.current
PantrixSelect(
    options = YEARS,
    selected = year,
    onSelect = {
        year = it
        report("Yıl seçildi: $it")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Doğum yılı",
    tagKey = "year"
)

private val YEARS = (1960..2019).map { year ->
    SelectOption(value = year, label = year.toString(), tagKey = year.toString())
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Genişlik

Genişlik verilmeyen select bir metin alanının en az genişliğindedir: ilk kutu böyledir. Bir satırda `Modifier.weight(1f)` ile satırdaki payı kadar geniş olur: ortadaki iki kutu satırı paylaşır.

Alttaki kutuya `Modifier.width(IntrinsicSize.Max)` verildi: select'e ne kadar geniş olacağı sorulur ve select seçeneklerinin gerektirdiğini söyler. Kutu en uzun seçeneği kadar geniştir, daha fazla değil; hangisi seçilirse seçilsin aynı kalır. Bir araç çubuğundaki ya da bir tablonun ayağındaki select böyle kurulur: `PantrixPageSize`'ın select'i de budur. Başka bir para birimi seç: kutu yerinde durur.

Liste her zaman kutusu kadardır. Kutuya sığmayan etiket tek satırda kesilir; seçenekleri kadar geniş olan kutuda hiçbir seçenek kesilmez, listedeki satırında da.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme

var alone by rememberSaveable { mutableStateOf<String?>("usd") }
var from by rememberSaveable { mutableStateOf<String?>("try") }
var to by rememberSaveable { mutableStateOf<String?>("eur") }
var fitted by rememberSaveable { mutableStateOf<String?>("gbp") }
val report = LocalExampleEvents.current
PantrixSelect(
    options = CURRENCIES,
    selected = alone,
    onSelect = { code ->
        alone = code
        report("Para birimi: ${CURRENCIES.first { it.value == code }.label}")
    },
    label = "Para birimi",
    tagKey = "currency"
)
Row(
    modifier = Modifier.widthIn(max = 480.dp).fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixSelect(
        options = CURRENCIES,
        selected = from,
        onSelect = { code ->
            from = code
            report("Kaynak para birimi: ${CURRENCIES.first { it.value == code }.label}")
        },
        modifier = Modifier.weight(1f),
        label = "Kaynak",
        tagKey = "currency_from"
    )
    PantrixSelect(
        options = CURRENCIES,
        selected = to,
        onSelect = { code ->
            to = code
            report("Hedef para birimi: ${CURRENCIES.first { it.value == code }.label}")
        },
        modifier = Modifier.weight(1f),
        label = "Hedef",
        tagKey = "currency_to"
    )
}
PantrixSelect(
    options = CURRENCIES,
    selected = fitted,
    onSelect = { code ->
        fitted = code
        report("Seçenekleri kadar geniş kutuda: ${CURRENCIES.first { it.value == code }.label}")
    },
    modifier = Modifier.width(IntrinsicSize.Max),
    contentDescription = "Para birimi",
    tagKey = "currency_fitted"
)

private val CURRENCIES = listOf(
    SelectOption(value = "try", label = "Türk lirası", tagKey = "try"),
    SelectOption(value = "eur", label = "Euro", tagKey = "eur"),
    SelectOption(value = "usd", label = "Amerikan doları", tagKey = "usd"),
    SelectOption(value = "gbp", label = "İngiliz sterlini", tagKey = "gbp")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Etiketsiz

Bir araç çubuğundaki ya da bir listenin başındaki select'in etiketi olmaz. Adını ekran okuyucuya `contentDescription` söyler; açılan liste de o adla duyurulur.

Etiket verilmediğinde kutunun üstünde yer ayrılmaz: select yalnızca kutusu kadar yer tutar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var sort by rememberSaveable { mutableStateOf<String?>("newest") }
PantrixSelect(
    options = listOf(
        SelectOption(value = "newest", label = "En yeni", tagKey = "newest"),
        SelectOption(value = "cheapest", label = "En ucuz", tagKey = "cheapest"),
        SelectOption(value = "nearest", label = "En yakın", tagKey = "nearest")
    ),
    selected = sort,
    onSelect = { sort = it },
    contentDescription = "Sıralama",
    tagKey = "sort"
)
```

### Kendi renkleri

`colors` listenin, `fieldColors` kutunun renkleridir; ikisi de yalnızca verilen alanları değiştirir, verilmeyen temanın kalır. Burada seçili satırın dolgusu ve yazısı (`SelectColors`) ile kutunun odaklı kenarı (`TextFieldColors`) uygulamanın kendi rengindedir.

Listeyi aç: kutunun kenarı uygulamanın morundadır, seçili satır da o morun yumuşak dolgusunda. Devre dışı bir select, renk verilse de temanın devre dışı renkleriyle çizilir.

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
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectColors
import com.pantrixui.components.overlay.select.SelectOption

val own = ownColors()
var plan by rememberSaveable { mutableStateOf<String?>("pro") }
val report = LocalExampleEvents.current
PantrixSelect(
    options = PLANS,
    selected = plan,
    onSelect = { value ->
        plan = value
        report("Plan seçildi: ${PLANS.first { it.value == value }.label}")
    },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Plan",
    colors = SelectColors(selectedContainer = own.container, selectedContent = own.onContainer),
    fieldColors = TextFieldColors(focusedBorder = own.color),
    tagKey = "own_plan"
)

private val PLANS = listOf(
    SelectOption(value = "free", label = "Ücretsiz", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Takım", tagKey = "team")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.
- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Stil

`style` listenin, `fieldStyle` kutunun geometrisidir. Burada listenin satırları 56dp'dir (`itemHeight`), liste en çok 180dp olur ve sığmayan seçenekler içinde kayar (`maxHeight`), kutuyla arasında 12dp boşluk vardır (`gap`). Kutunun köşeleri tam yuvarlaktır: `TextFieldStyle(shape = ShapeRole.Full)`.

Yalnızca verilen alanlar değişir; gerisi temanın ve platformun stilinden gelir. Liste, stil ne derse desin kutusu kadar geniştir ve bir satır platformun dokunma hedefinden kısa olmaz.

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
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.components.overlay.select.SelectStyle
import com.pantrixui.foundation.token.shape.ShapeRole

var currency by rememberSaveable { mutableStateOf<String?>("try") }
PantrixSelect(
    options = CURRENCIES,
    selected = currency,
    onSelect = { currency = it },
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Para birimi",
    style = SelectStyle(maxHeight = 180.dp, gap = 12.dp, itemHeight = 56.dp),
    fieldStyle = TextFieldStyle(shape = ShapeRole.Full),
    tagKey = "styled_currency"
)

private val CURRENCIES = listOf(
    SelectOption(value = "try", label = "Türk lirası", tagKey = "try"),
    SelectOption(value = "eur", label = "Euro", tagKey = "eur"),
    SelectOption(value = "usd", label = "Amerikan doları", tagKey = "usd"),
    SelectOption(value = "gbp", label = "İngiliz sterlini", tagKey = "gbp")
)
```

### Dialog içinde

Bir dialog'un içindeki select: liste dialog'un üstünde açılır. Escape ve geri tuşu önce listeyi kapatır, dialog açık kalır; dialog ikinci basışta kapanır.

"Adresi düzenle"ye bas, listeyi aç ve Escape'e iki kez bas: önce liste, sonra dialog kapanır. Buradaki select aranabilirdir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.dialog.PantrixDialog
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var dialog by rememberSaveable { mutableStateOf(false) }
var country by rememberSaveable { mutableStateOf<String?>("tr") }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Adresi düzenle",
    onClick = { dialog = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_address_dialog"
)
PantrixDialog(
    visible = dialog,
    onDismissRequest = {
        dialog = false
        report("Adres penceresi kapatıldı")
    },
    title = "Teslimat adresi",
    message = "Siparişin gönderileceği ülkeyi seçin.",
    actions = {
        PantrixButton(
            text = "Tamam",
            onClick = {
                dialog = false
                report("Adres penceresi kapatıldı")
            },
            variant = ButtonVariant.Text,
            tagKey = "close_address_dialog"
        )
    },
    tagKey = "address_dialog"
) {
    PantrixSelect(
        options = COUNTRIES,
        selected = country,
        onSelect = { code ->
            country = code
            report("Teslimat ülkesi: ${COUNTRIES.first { it.value == code }.label}")
        },
        modifier = Modifier.fillMaxWidth(),
        label = "Ülke",
        searchable = true,
        searchPlaceholder = "Ülke ara…",
        tagKey = "delivery_country"
    )
}

private val COUNTRIES = listOf(
    SelectOption(value = "tr", label = "Türkiye", tagKey = "tr"),
    SelectOption(value = "de", label = "Almanya", tagKey = "de"),
    SelectOption(value = "gb", label = "Birleşik Krallık", tagKey = "gb"),
    SelectOption(value = "jp", label = "Japonya", tagKey = "jp"),
    SelectOption(value = "us", label = "Amerika Birleşik Devletleri", tagKey = "us")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Dar pencerede sheet

`presentation = OverlayPresentation.Adaptive`: dar bir pencerede liste alttan bir sheet'tir, başlığı alanın etiketi, satırları sheet kadar geniş; daha geniş pencerede kutunun altında. "Dar"ı seç ve alana bas. Varsayılan her pencerede kutunun altıdır; `PantrixMultiSelect` de aynı parametreyi alır.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.overlay.common.OverlayPresentation
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption

var city by rememberSaveable { mutableStateOf<String?>(null) }
// Kartın penceresi örnek kadar uzundur: dar bir pencerede açılan sheet'e yer kalsın diye örnek uzun tutulur.
Column(Modifier.fillMaxWidth().height(400.dp)) {
    PantrixSelect(
        options = listOf("İstanbul", "Ankara", "İzmir", "Bursa", "Antalya").map {
            SelectOption(value = it, label = it)
        },
        selected = city,
        onSelect = { city = it },
        modifier = Modifier.fillMaxWidth(),
        label = "Şehir",
        tagKey = "adaptive_city",
        presentation = OverlayPresentation.Adaptive
    )
}
```

### Başka temadaki bir bölümde

Liste, çağrıldığı temanın renklerindedir. Buradaki bölüm sayfanın tersi renkte ikinci bir temadır (`PantrixTheme(darkTheme = …)`): sayfa açıksa koyu, koyuysa açık. Select o temanın içinde çağrıldığı için kutusu da açılan listesi de onun renklerindedir.

Tema bir zemin çizmez: bölümün zemini, temanın içindeki `PantrixSurface`'tir. Bu, sayfanın son örneğidir: altında yer kalmayınca liste kutunun üstünde açılır.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.overlay.select.PantrixSelect
import com.pantrixui.components.overlay.select.SelectOption
import com.pantrixui.foundation.theme.PantrixTheme

var plan by rememberSaveable { mutableStateOf<String?>(null) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.widthIn(max = 392.dp).fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixSelect(
                options = PLANS,
                selected = plan,
                onSelect = { value ->
                    plan = value
                    report("Bölümde plan seçildi: ${PLANS.first { it.value == value }.label}")
                },
                modifier = Modifier.fillMaxWidth(),
                label = "Plan",
                placeholder = "Bir plan seçin",
                tagKey = "plan_in_part"
            )
        }
    }
}

private val PLANS = listOf(
    SelectOption(value = "free", label = "Ücretsiz", tagKey = "free"),
    SelectOption(value = "pro", label = "Pro", tagKey = "pro"),
    SelectOption(value = "team", label = "Takım", tagKey = "team")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

## API

### PantrixSelect

`import com.pantrixui.components.overlay.select.PantrixSelect`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixSelect(
    options: List<SelectOption<T>>,
    selected: T?,
    onSelect: (T) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
    error: Boolean = false,
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

Kontrolün açtığı bir listeden tek bir seçim: bir ülke, bir para birimi, bir plan.

Sonunda bir ok olan bir metin alanı kutusudur: bir alanın etiketini, yer tutucusunu, hatasını ve yardım metnini taşır. Listesi kutunun altında, kutuyla aynı genişlikte açılır. Seçim kontrolün değil çağıranındır: kontrole `selected` verilir, kontrol de `onSelect` ile yenisini ister. Alana basmak listeyi açar, odak alandayken Enter ve boşluk da açar. Bir seçeneği seçmek listeyi kapatır. Dışına basmak, Escape ve geri tuşu da kapatır, ama hiçbir şey seçmez. Liste açıkken kutu odaklı bir alan gibi çizilir.

Alan kendi başına bir metin alanı kadar geniştir ve kutusu ondan uzun bir seçimle büyür. Ne kadar geniş olacağı sorulduğunda en uzun seçeneğinin, kutuda ve listenin bir satırında, gerektirdiğiyle cevap verir; yer tutucusu ve etiketi de hesaba girer. `Modifier.width(IntrinsicSize.Max)` seçeneklerinden geniş olmayan ve hangisi seçilirse seçilsin aynı genişlikte kalan bir select kurar: bir araç çubuğundaki ya da bir tablonun ayağındaki gibi.

Liste kutunun altından sarkar ve alanın yardım metni varsa onu örter. Pencerenin kenarlarına, sistem çubuklarına ve klavyeye stilin kenar boşluğundan fazla yaklaşmaz. Orada, yer üç satırını ya da daha az satırı varsa hepsini alıyorsa açılır; en çok o yer kadar uzundur ve satırları kayar. Yer bundan azsa kutunun üstünde açılır, iki yanında da yer çok azsa kutuyu örter. Açıldıktan sonra, bir satırına yer kaldığı sürece kendi yanında kalır: liste kullanılırken gelen klavye onu olduğu yerde kısaltır. En çok yüksekliğine sığmayan seçenekler kayar ve liste seçili seçenek görünür hâlde açılır. O seçenek satırının dolgusuyla ve bir onay işaretiyle belli olur, yalnızca bir renkle değil.

Klavyeyle açılınca liste odağı seçili seçeneğe alır, seçili yoksa ilk seçeneğine. Ok tuşları seçenekler arasında gezer ve sondan başa döner, Home ve End ilk ve son seçeneğe gider, Enter ve boşluk seçer. Dokunarak ya da tıklayarak açılınca hiçbir seçenek odak göstermez ve ilk ok tuşu seçili olandan devam eder. Liste kapanınca odak yine alandadır.

`searchable` ile listede, seçenekleri etiketinde yazılanı taşıyanlara daraltan bir alan olur ve liste kalan seçenekler kadar kısalır. Alan listenin kutuya bakan kenarındadır: üst kenarında, liste kutunun üstündeyse alt kenarında. Böylece liste kısalırken alan yerinde kalır. Odak o alanda kalır: ok tuşları eşleşen seçenekler arasında bir işareti gezdirir, klavyenin onay tuşu işaretli olanı seçer. Bir şey yazılır yazılmaz işaret ilk eşleşendedir.

Okunacak kadar kısa ya da aranmaya değer bir liste içindir. Hepsi birden görünmesi gereken iki üç seçenek için radyo grubu ya da segment düğmesi, işler için menü, aynı anda birden çok değer için `PantrixMultiSelect` kullanılır.

Parametreler:

- `options: List<SelectOption<T>>`: Seçenekler, gösterildikleri sırayla. Hiç seçenek yoksa liste bunu söyler.
- `selected: T?`: Şu an seçili olan: değeri buna eşit olan ilk seçenek. Hiçbir seçenekte olmayan bir değer, hiçbir şeyin seçili olmadığı anlamına gelir. Onu temsil eden bir seçenek yoksa null da öyledir.
- `onSelect: (T) -> Unit`: Yeni bir seçim istemek için seçeneğin değeriyle çağrılır. Seçili olan yeniden seçilince de çağrılır.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin. `fillMaxWidth()` bir formun sütununu doldurur, `width(IntrinsicSize.Max)` seçeneklerin gerektirdiği kadar geniştir.
- `enabled: Boolean`: Listenin açılıp açılamayacağı. Listesi açılamayan select odak almaz, devre dışı renklerle çizilir ve devre dışı olduğunu söyler.
- `label: String?`: Seçimin ne olduğu. Kutunun üstüne yazılır ve ekran okuyucu için alanın adıdır, listesi de bu adla duyurulur.
- `placeholder: String?`: Hiçbir şey seçili değilken kutuda gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni. `error` ile birlikte neyin düzeltileceğini söyleyen mesajdır ve ekran okuyucu onu hata olarak duyurur.
- `error: Boolean`: Seçimin hatalı olup olmadığı: kenar, etiket ve yardım metni danger rolüne döner, ekran okuyucuya da söylenir.
- `searchable: Boolean`: Listede seçenekleri aramak için bir alan olup olmadığı.
- `searchPlaceholder: String?`: Arama alanının boşken gösterdiği metin ve alanın adı. Bu null ise temanın arama için kullandığı sözcüktür.
- `style: SelectStyle?`: Bu çağrının kendi stili, listesinin çizildiği stil: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir, her platformda.
- `fieldStyle: TextFieldStyle?`: Bu çağrının kendi `TextFieldStyle`'ı, kutusunun çizildiği stil: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir, her platformda.
- `colors: SelectColors?`: Listesinin kendi renkleri, temanın rollerinin yerine: verdikleri kullanılır, gerisi temanın kalır.
- `fieldColors: TextFieldColors?`: Kutusunun kendi renkleri, bir metin alanının aldığı gibi. Devre dışı bir select, ne verilirse verilsin temanın devre dışı renkleriyle çizilir.
- `contentDescription: String?`: Ekran okuyucunun alan için söylediği: `label`'ı yokken alanın adıdır, bir araç çubuğundaki select'te olduğu gibi.
- `tagKey: String?`: Alanın otomasyon anahtarı: alan `Select_<tagKey>`, listesi `SelectList_<tagKey>`, listenin arama alanı `SelectSearch_<tagKey>` diye etiketlenir, seçenekleri de onun içinde adlandırılır: `Select_<tagKey>.SelectOption_<option's key>`. Listesinin açıldığını ve bir seçeneğin seçildiğini bildirir: seçeneğin anahtarıyla, hiçbir zaman etiketiyle değil.
- `interactionSource: MutableInteractionSource?`: Alanın dışarı taşınan etkileşimleri: odağı, üstündeki fare ve basışları. Null verilirse alan kendi kaynağını tutar.
- `presentation: OverlayPresentation`: listenin nasıl gösterildiği: varsayılan alanın altında; pencerenin altından bir sheet olarak, başlığı alanın etiketi; ya da dar bir pencerede biri, daha geniş pencerede öteki. Liste açılırken seçilir, kapanana kadar kalır.

### PantrixSelect

`import com.pantrixui.components.overlay.select.PantrixSelect`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun <T> PantrixSelect(
    field: FormField<T>,
    options: List<SelectOption<T>>,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    label: String? = null,
    placeholder: String? = null,
    supportingText: String? = null,
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

Bir formun alanına bağlı select: seçimi, hatası ve adı `field`'dan gelir.

Bir seçim alanı değiştirir ve dokunulmuş sayar. Bu yüzden bir kuralın mesajı ilk seçimden sonra ya da form gönderildiğinde görünür, kimsenin dokunmadığı bir formda görünmez. Alan hatalıyken mesaj `supportingText`'in yanında durmaz, onun yerini alır. Alanın kimliği select'in otomasyon anahtarıdır, `Select_<id>`, seçenekleri de onun içindedir. Form, bu alan hatalıyken gönderildiğinde odağı buraya yollayabilir.

Yapılması zorunlu bir seçim, null olabilen bir değerin null ile başlayan alanı ve `Rules.required` ile kurulur. Seçenekleri değerin kendisinin seçenekleridir: bir `SelectOption<String>`, bir `FormField<String?>`'in seçeneğidir.

Kontrollü biçimin bir parametresi değil, ayrı bir overload'dur: böylece bir seçim ile bir alan birlikte verilemez.

Parametreler:

- `field: FormField<T>`: Select'in gösterdiği ve değiştirdiği alan.
- `options: List<SelectOption<T>>`: Seçenekler, gösterildikleri sırayla.
- `modifier: Modifier`: Alanın bütününün modifier'ı: etiketinin, kutusunun ve kutunun altındakilerin.
- `enabled: Boolean`: Listenin açılıp açılamayacağı.
- `label: String?`: Seçimin ne olduğu. Kutunun üstüne yazılır ve ekran okuyucu için alanın adıdır.
- `placeholder: String?`: Hiçbir şey seçili değilken kutuda gösterilir.
- `supportingText: String?`: Kutunun altındaki yardım metni: alanın orada gösterecek bir hatası olmadığı sürece.
- `searchable: Boolean`: Listede seçenekleri aramak için bir alan olup olmadığı.
- `searchPlaceholder: String?`: Arama alanının boşken gösterdiği metin ve alanın adı.
- `style: SelectStyle?`: Bu çağrının kendi stili, listesinin çizildiği stil: çevresindeki her stili ezer, yoğunluk ona da uygulanır.
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

# Sheet

O ekrana ait kısa bir iş için uygulamanın üstüne açılan panel: nasıl sıralanacağını seçmek, bir iki alan doldurmak, bir listeden seçmek, basılan şeyin ayrıntılarına bakmak. Alt kenardan açılır ve sürüklenir, ya da son kenardan bir yan sheet olarak açılır. İkisi de modaldır: arkasındaki hiçbir şeye basılamaz, Tab içinden çıkmaz.

Sheet kendini kapatmaz. Scrim'e basmak, geri tuşu, Escape, kenarına doğru sürüklemek ve yan sheet'in kapatma düğmesi `onDismissRequest`'i çağırır; kapatan, `visible`'ı false yapan çağıran koddur.

- `PantrixSheet` (`com.pantrixui.components.overlay.sheet`, `com.pantrixui:components`): Uygulamanın üstünde kısa bir iş için panel: alt kenar boyunca, bir sürüklemenin taşıdığı, ya da yan sheet olarak son kenar boyunca; kapanana kadar modal. Anahtar sözcükler: alt sheet, alt panel, yan panel, çekmece, eylem paneli, yarım panel.

## Özellikler

- **Alt kenarda.** Varsayılan kenar `SheetEdge.Bottom`'dır: sheet pencere kadar geniştir, stilin `maxWidth`'ine kadar, ve içeriği kadar yüksektir. Sürüklenir: aşağı sürüklemek kapatır.
- **Yan sheet.** `edge = SheetEdge.End` ile sheet son kenarda durur, sağdan sola yazılan dilde solda: pencere boyunca uzanır, stilin `sideWidth`'i kadar geniştir ve bir kapatma düğmesi vardır. Kenara doğru sürüklemek kapatır. `SheetEdge.Start` aynı sheet'i baş kenardan açar: dar bir pencerede uygulamanın menüsü.
- **Kenardan kenara içerik.** İçerik sheet'in genişliğine yayılır: bir listenin satırları kenarlara uzanır, bir form kendi yan boşluğunu verir. Sheet'e sığmayan içerik başlığın altında kayar.
- **Yarım açık.** `halfOpen` ile içeriği pencerenin yarısından uzun olan sheet önce yarım açılır, üstü pencerenin ortasında. Yukarı sürüklemek ya da odağın içine girmesi tam açar; yarım açıkken aşağı sürüklemek kapatır.
- **Tam ekran.** `fullScreen` ile tam açık sheet, içeriği kısa da olsa pencerenin durum çubuğunun altında kalan yeri kadar yüksektir. `coverStatusBar` onu durum çubuğunun altına da uzatır.
- **Kendi kayan liste.** Uzun bir liste `LazyColumn`'da, `scrollContent = false` ile durur. `overscrollMovesSheet = false` listenin yalnızca kaymasını sağlar: başına gelen liste sheet'i aşağı çekmez, tutamak ve başlık yine sürükler.
- **Kapatılamayan sheet.** `dismissible = false` ile sürüklemek, scrim, geri tuşu ve Escape bir şey yapmaz; yan sheet'in kapatma düğmesi, yarım açılmayan sheet'in tutamağı da yoktur. Çıkış içerikteki bir kontroldür.
- **Kapanırken ağaçta kalır.** Kapalı bir sheet hiçbir şey kurmaz: ağaçta `visible = false` ile durur ve temanın hareketiyle çıkar. Açıkken kompozisyondan çıkarılan sheet hareketsiz, bir anda gider.
- **Klavye ve ekran okuyucu.** Klavyeyle açılınca odak ilk kontrolde başlar; dokunarak açılınca yerinde kalır. `title` sheet açılınca duyurulur ve içindekilerin başlığıdır. Sürükleyemeyen ekran okuyucuya, yarım açık sheet'i tam açan ve geri getiren eylemler sunulur.
- **Renk ve stil.** `colors` zemini, başlığı, tutamağı, kapatma ikonunu ve scrim'i değiştirir; `style` uygulamaya bakan köşeleri, genişlikleri, scrim'e bırakılan payı, gölgeyi ve tutamağı. Köşeler Android'de ve iOS'ta büyük, masaüstünde ve web'de orta yuvarlaktır; iOS'ta gölge yoktur.

## Kullanım

### Choose how to sort

```kotlin
PantrixSheet(
    visible = sorting,
    onDismissRequest = { sorting = false },
    title = stringResource(Res.string.sort_by),
    tagKey = "sort_by"
) {
    PantrixRadioGroup(
        options = sortOptions,
        selected = sort,
        onSelect = {
            sort = it
            sorting = false
        },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        tagKey = "sort"
    )
}
```

### A form in a side sheet

```kotlin
PantrixSheet(
    visible = editing,
    onDismissRequest = { editing = false },
    title = stringResource(Res.string.edit_profile),
    edge = SheetEdge.End,
    tagKey = "edit_profile"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
    ) {
        PantrixTextField(state = name, label = stringResource(Res.string.name), tagKey = "name")
        PantrixButton(text = stringResource(Res.string.save), onClick = onSave, tagKey = "save")
    }
}
```

### A long list that opens half open and only scrolls

```kotlin
PantrixSheet(
    visible = choosingCountry,
    onDismissRequest = { choosingCountry = false },
    title = stringResource(Res.string.country),
    halfOpen = true,
    fullScreen = true,
    overscrollMovesSheet = false,
    scrollContent = false,
    tagKey = "country"
) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(bottom = PantrixTheme.spacing.lg)
    ) {
        items(countries, key = { it.code }) { country ->
            CountryRow(country = country, onClick = { onCountry(country) })
        }
    }
}
```

## Örnekler

### Sıralama

En yalın hâli: bir başlık ve içerik. Bir seçim işin tamamıdır: seçilince sheet kapanır, ayrıca bir "Tamam" düğmesi aranmaz.

Sheet kendini kapatmaz: aşağı sürüklemek, scrim'e basmak, geri tuşu ve Escape `onDismissRequest`'i çağırır; hepsinde kapatan `open = false` satırıdır. Kartın "Son olay" satırı en son ne olduğunu söyler.

```kotlin
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.radiobutton.PantrixRadioGroup
import com.pantrixui.components.elements.radiobutton.RadioOption
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
var sort by rememberSaveable { mutableStateOf("name") }
PantrixButton(
    text = "Sırala: ${SORTS.first { it.value == sort }.label}",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_sort"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Sıralama sheet'i kapatıldı")
    },
    title = "Sırala",
    tagKey = "sort_by"
) {
    PantrixRadioGroup(
        options = SORTS,
        selected = sort,
        onSelect = {
            sort = it
            open = false
            report("Sıralama: ${SORTS.first { option -> option.value == it }.label}")
        },
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        tagKey = "sort"
    )
}

private val SORTS = listOf(
    RadioOption(value = "name", label = "Ad", tagKey = "name"),
    RadioOption(value = "date", label = "Değiştirilme tarihi", tagKey = "date"),
    RadioOption(value = "size", label = "Boyut", tagKey = "size")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Form

Bir alan ve bir düğme. İçerik sheet'in kenarlarına kadar uzandığı için formun yan boşluğu kendisindendir: `Modifier.padding(horizontal = …)`. "Kaydet" not boşken kapalıdır.

Dokunarak açılınca odak alana geçmez. Alana basınca sheet klavyenin üstünde kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val note = rememberTextFieldState()
PantrixButton(
    text = "Not ekle…",
    onClick = {
        note.clearText()
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "open_note"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Not sheet'i kapatıldı")
    },
    title = "Not ekle",
    tagKey = "note"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
    ) {
        PantrixTextField(state = note, modifier = Modifier.fillMaxWidth(), label = "Not", tagKey = "note")
        PantrixButton(
            text = "Kaydet",
            onClick = {
                open = false
                report("Not: ${note.text}")
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = note.text.isNotBlank(),
            tagKey = "save_note"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Klavye açıkken

Sayfadaki bir alanda yazarken açılan sheet. Sayfada odak neredeyse orada kalır ve sheet kapanınca yine oradadır; neresi olduğu platforma göre değişir. Android'de ve iOS'ta düğmeye dokunmak odağı almaz: odak yazılan alanda kalır. Masaüstünde ve web'de düğmeye basmak odağı düğmeye taşır: sheet kapanınca odak düğmededir.

Sheet açıkken klavyeden yazılan sheet'e gider, alttaki alana değil; alan da o sürede durgun çizilir, imleci yoktur. Android'de ve iOS'ta ekran klavyesi sheet açılınca kapanır; sheet kapanınca imleç ve klavye alana döner.

Önce alana yaz, sonra düğmeye bas: alana yazılan her platformda yerinde durur.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val search = rememberTextFieldState()
PantrixTextField(
    state = search,
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    label = "Ara",
    tagKey = "page_search"
)
PantrixButton(
    text = "Süzgeçler…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_filters"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Süzgeç sheet'i kapatıldı")
    },
    title = "Süzgeçler",
    tagKey = "filters"
) {
    FILTERS.forEachIndexed { index, filter ->
        SheetRow(
            text = filter,
            tag = "Row_filter_$index",
            onClick = {
                open = false
                report("Süzgeç: $filter")
            }
        )
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val FILTERS = listOf("Yalnız paylaşılanlar", "Son 7 gün", "PDF dosyaları")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Yarım açık liste

Yarım açık başlayan uzun bir liste: başı çoğu zaman yeter. `halfOpen` ile sheet pencerenin ortasına kadar açılır; yukarı sürükleyince, ya da odak içine girince, tam açılır. `fullScreen` tam açık hâlini pencerenin durum çubuğunun altında kalan yeri kadar yüksek yapar.

Liste kendi kayar: bir `LazyColumn`'dadır ve `scrollContent = false` sheet'in kendi kaydırma alanını kapatır. Listeye `Modifier.fillMaxWidth()` verilir: yoksa satırlarının yanından sürüklemek onu kaydırmaz. `overscrollMovesSheet = false` ile başına gelen liste sheet'i aşağı çekmez; tutamak ve başlık yine sürükler.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Ülke seç…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_countries"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Ülke sheet'i kapatıldı")
    },
    title = "Ülke",
    halfOpen = true,
    fullScreen = true,
    overscrollMovesSheet = false,
    scrollContent = false,
    tagKey = "country"
) {
    LazyColumn(
        modifier = Modifier.fillMaxWidth().testTag("List_countries"),
        contentPadding = PaddingValues(bottom = PantrixTheme.spacing.lg)
    ) {
        itemsIndexed(COUNTRIES) { index, country ->
            SheetRow(
                text = country,
                tag = "Row_country_$index",
                onClick = {
                    open = false
                    report("Ülke: $country")
                }
            )
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val COUNTRIES = (
    "Almanya, Arjantin, Avustralya, Avusturya, Belçika, Brezilya, Bulgaristan, Çekya, Çin, Danimarka, Endonezya, " +
        "Estonya, Fas, Finlandiya, Fransa, Güney Afrika, Güney Kore, Hindistan, Hollanda, İngiltere, İrlanda, " +
        "İspanya, İsveç, İsviçre, İtalya, İzlanda, Japonya, Kanada, Kenya, Kolombiya, Letonya, Litvanya, " +
        "Macaristan, Malezya, Meksika, Mısır, Norveç, Peru, Polonya, Portekiz, Romanya, Şili, Singapur, Slovakya, " +
        "Tayland, Tunus, Türkiye, Ukrayna, Vietnam, Yeni Zelanda, Yunanistan"
).split(", ")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Tam ekran

Kendi başına bir ekran gibi: `fullScreen` ile tam açık sheet, içeriği kısa da olsa pencerenin durum çubuğunun altında kalan yeri kadar yüksektir. `coverStatusBar` ile durum çubuğunun altına da girer ve pencerenin tamamı kadar yüksek olur: üst köşeleri orada düzleşir, tutamağı ve başlığı çubuğun altında kalır.

Alana yazdıkça dosyalar süzülür; liste kısalsa da sheet'in yüksekliği değişmez. Arama her açılışta boş başlar.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.clearText
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val query = rememberTextFieldState()
PantrixButton(
    text = "Dosyalarda ara…",
    onClick = {
        query.clearText()
        open = true
    },
    variant = ButtonVariant.Outline,
    tagKey = "open_search"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Arama sheet'i kapatıldı")
    },
    title = "Dosyalarda ara",
    fullScreen = true,
    coverStatusBar = true,
    tagKey = "search"
) {
    PantrixTextField(
        state = query,
        modifier = Modifier.fillMaxWidth().padding(horizontal = PantrixTheme.spacing.lg),
        label = "Ara",
        tagKey = "query"
    )
    FILES.forEachIndexed { index, file ->
        if (query.text.isBlank() || file.contains(query.text, ignoreCase = true)) {
            SheetRow(
                text = file,
                tag = "Row_file_$index",
                onClick = {
                    open = false
                    report("Açılan dosya: $file")
                }
            )
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val FILES = listOf("Rapor.pdf", "Bütçe.xlsx", "Sunum.key", "Notlar.txt", "Sözleşme.pdf", "Logo.svg")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Seçmek zorunlu

`dismissible = false`: tutamak çizilmez; sürüklemek, scrim, geri tuşu ve Escape bir şey yapmaz, `onDismissRequest` çağrılmaz. Çıkış içindeki düğmelerdir; bu yüzden her çıkış için bir düğme bulunur. Yalnızca sheet'i içeriğindeki bir kontrolün kapatması gereken yerde kullanılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Bildirim izni",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_permission"
)
PantrixSheet(
    visible = open,
    onDismissRequest = { report("Bu çağrılmaz: sheet kapatılamaz") },
    title = "Bildirimlere izin ver",
    dismissible = false,
    tagKey = "permission"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = "Paylaşılan dosyalar değişince haber verelim mi?")
        PantrixButton(
            text = "İzin ver",
            onClick = {
                open = false
                report("Bildirimlere izin verildi")
            },
            modifier = Modifier.fillMaxWidth(),
            tagKey = "allow"
        )
        PantrixButton(
            text = "Şimdi değil",
            onClick = {
                open = false
                report("Bildirim izni ertelendi")
            },
            modifier = Modifier.fillMaxWidth(),
            variant = ButtonVariant.Text,
            tagKey = "not_now"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Yan sheet

`edge = SheetEdge.End`: sheet pencerenin son kenarından gelir, soldan sağa yazılan dilde sağdan, ve pencere boyunca uzanır. Basılan şeyin ayrıntıları içindir: liste yerinde kalır, ayrıntı yandan gelir.

Kapatma düğmesi, scrim, geri tuşu, Escape ve kenara doğru sürüklemek kapatır. Yan sheet yarım açılmaz ve tam ekran olmaz: o parametreler yalnızca alt kenardaki sheet içindir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
PantrixButton(
    text = "Rapor.pdf ayrıntıları",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_details"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Ayrıntı sheet'i kapatıldı")
    },
    title = "Rapor.pdf",
    edge = SheetEdge.End,
    tagKey = "details"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        DETAILS.forEach { (name, value) ->
            Column {
                PantrixText(
                    text = name,
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary
                )
                PantrixText(text = value)
            }
        }
    }
}

private val DETAILS = listOf(
    "Tür" to "PDF belgesi",
    "Boyut" to "2,4 MB",
    "Değiştirilme" to "3 Ekim 2026",
    "Sahibi" to "Ada Yılmaz",
    "Konum" to "Belgeler / Raporlar"
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Yan sheet'te form

Geniş pencerede bir formun yeri: sayfa arkada görünür kalır. Klavyeyle açılınca odak ilk alandadır; Tab sheet'in içinde döner. "Kaydet" ad boşken kapalıdır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val name = rememberTextFieldState(initialText = "Ada Yılmaz")
val title = rememberTextFieldState(initialText = "Tasarımcı")
PantrixButton(
    text = "Profili düzenle…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_profile"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Profil sheet'i kapatıldı")
    },
    title = "Profili düzenle",
    edge = SheetEdge.End,
    tagKey = "profile"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
    ) {
        PantrixTextField(state = name, modifier = Modifier.fillMaxWidth(), label = "Ad", tagKey = "name")
        PantrixTextField(state = title, modifier = Modifier.fillMaxWidth(), label = "Unvan", tagKey = "title")
        PantrixButton(
            text = "Kaydet",
            onClick = {
                open = false
                report("Profil: ${name.text}, ${title.text}")
            },
            enabled = name.text.isNotBlank(),
            tagKey = "save_profile"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Baş kenardan menü

`edge = SheetEdge.Start`: sheet pencerenin baş kenarından gelir, soldan sağa yazılan dilde soldan. Dar bir penceredeki uygulamanın menüsüdür: geniş pencerede yanda duran gezinme, telefonda bir düğmeyle açılır ve bir hedef seçilince kapanır.

Yan sheet'in ters yönüdür: pencere boyunca uzanır, kapatma düğmesi vardır, baş kenara doğru sürüklemek kapatır.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
var where by rememberSaveable { mutableStateOf(SECTIONS.first()) }
PantrixButton(
    text = "Menü",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_menu"
)
PantrixText(text = "Açık bölüm: $where", color = PantrixTheme.colors.textSecondary)
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Belgeler",
    edge = SheetEdge.Start,
    tagKey = "menu"
) {
    Column {
        SECTIONS.forEachIndexed { index, section ->
            SheetRow(text = section, tag = "menu_$index") {
                where = section
                open = false
            }
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val SECTIONS = listOf("Kurulum", "Tema", "Formlar", "Test etmek")
```

### Kendi renkleri

`colors` ile verilen renkler değişir, verilmeyen temanın kalır: burada zemin, başlık ve tutamak uygulamanın kendi morunda, scrim temanın.

Bu mor temanın hiçbir rolünde yok; bu yüzden üstünde okunan rengi de çağıran verir: başlığınki `colors` ile, içerikteki yazınınki kendi `color`'ı ile. Zemin temanın bir rol rengi olsaydı başlık, tutamak ve kapatma ikonu o rolle eşlenen rengi kendiliğinden alırdı.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetColors
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val own = ownColors()
PantrixButton(
    text = "Pro'nun getirdikleri",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_pro"
)
PantrixSheet(
    visible = open,
    onDismissRequest = {
        open = false
        report("Pro sheet'i kapatıldı")
    },
    title = "Pro'ya geç",
    colors = SheetColors(container = own.container, title = own.onContainer, handle = own.color),
    tagKey = "pro"
) {
    Column(
        modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixText(
            text = "Sınırsız proje, paylaşılan klasörler ve öncelikli destek.",
            color = own.onContainer
        )
        PantrixButton(
            text = "Yükselt",
            onClick = {
                open = false
                report("Plan yükseltildi")
            },
            tagKey = "upgrade_plan"
        )
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.
- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stili

`style` yalnızca bu çağrının geometrisini değiştirir: uygulamaya bakan köşeler temanın en küçük yuvarlaklığında (`ShapeRole.ExtraSmall`), sheet en fazla 420dp genişliğinde, tutamak 56dp'ye 6dp. Pencere 420dp'den genişse sheet alt kenarın ortasında durur. Verilmeyen alanlar platformun stilinden gelir.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

var open by rememberSaveable { mutableStateOf(false) }
PantrixButton(
    text = "Dışa aktar…",
    onClick = { open = true },
    variant = ButtonVariant.Outline,
    tagKey = "open_export"
)
PantrixSheet(
    visible = open,
    onDismissRequest = { open = false },
    title = "Dışa aktar",
    style = SheetStyle(
        shape = ShapeRole.ExtraSmall,
        maxWidth = 420.dp,
        handleWidth = 56.dp,
        handleHeight = 6.dp
    ),
    tagKey = "export"
) {
    EXPORT_FORMATS.forEachIndexed { index, format ->
        SheetRow(text = format, tag = "Row_export_$index", onClick = { open = false })
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val EXPORT_FORMATS = listOf("PDF belgesi", "Word belgesi", "Düz metin")
```

### Başka temadaki bir bölümde

Sayfanın tersi renkte bir bölüm ve içinden açılan bir sheet. Bölüm ikinci bir temadır (`PantrixTheme(darkTheme = …)`); sheet de o temanın içinde çağrıldığı için onun renklerindedir: bölüm koyuysa o da koyudur.

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.platform.testTag
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
val report = LocalExampleEvents.current
val pageIsDark = PantrixTheme.colors.background.luminance() < 0.5f
PantrixTheme(darkTheme = !pageIsDark) {
    PantrixSurface(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixButton(text = "Bu bölümden aç", onClick = { open = true }, tagKey = "open_sheet_in_part")
        }
    }
    PantrixSheet(
        visible = open,
        onDismissRequest = {
            open = false
            report("Bölümün sheet'i kapatıldı")
        },
        title = "Paylaş",
        tagKey = "share"
    ) {
        SHARE_TARGETS.forEachIndexed { index, target ->
            SheetRow(
                text = target,
                tag = "Row_share_$index",
                onClick = {
                    open = false
                    report("Paylaşıldı: $target")
                }
            )
        }
    }
}

@Composable
private fun SheetRow(
    text: String,
    tag: String,
    onClick: () -> Unit
) {
    val spacing = PantrixTheme.spacing
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(tag)
            .clickable(onClick = onClick)
            .padding(horizontal = spacing.lg, vertical = spacing.md)
    ) {
        PantrixText(text = text)
    }
}

private val SHARE_TARGETS = listOf("Bağlantıyı kopyala", "E-postayla gönder", "Ekibe aç")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Pencereye göre kenar

`edge = SheetEdge.Adaptive`: dar bir pencerede alttan tam ekran bir sheet, daha genişte yan sheet. Bir formun ya da basılanın ayrıntısının yeri: telefonda ekranı doldurur, tablette ve masaüstünde içeriğin yanında durur. "Dar" ile "Geniş" arasında geç; açıkken pencere değişirse sheet kenarını korur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.sheet.PantrixSheet
import com.pantrixui.components.overlay.sheet.SheetEdge
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(false) }
// Kartın penceresi örnek kadar uzundur: dar bir pencerede açılan sheet'e yer kalsın diye örnek uzun tutulur.
Column(Modifier.fillMaxWidth().height(280.dp)) {
    PantrixButton(text = "Sipariş 1042", onClick = { open = true }, tagKey = "open_adaptive_sheet")
    PantrixSheet(
        visible = open,
        onDismissRequest = { open = false },
        title = "Sipariş 1042",
        edge = SheetEdge.Adaptive,
        tagKey = "adaptive_sheet"
    ) {
        Column(
            modifier = Modifier.padding(horizontal = PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixText("Üç ürün, salı günü teslim edilecek.")
            PantrixText("Kargo ücreti alınmadı; fatura e-postayla geldi.")
            PantrixButton(text = "Kapat", onClick = { open = false }, tagKey = "adaptive_sheet_close")
        }
    }
}
```

## API

### PantrixSheet

`import com.pantrixui.components.overlay.sheet.PantrixSheet`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSheet(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    title: String? = null,
    modifier: Modifier = Modifier,
    edge: SheetEdge = SheetEdge.Bottom,
    dismissible: Boolean = true,
    halfOpen: Boolean = false,
    fullScreen: Boolean = false,
    coverStatusBar: Boolean = false,
    overscrollMovesSheet: Boolean = true,
    scrollContent: Boolean = true,
    style: SheetStyle? = null,
    colors: SheetColors? = null,
    tagKey: String? = null,
    content: @Composable ColumnScope.() -> Unit
)
```

O anki ekrana ait kısa bir iş için uygulamanın üstüne açılan panel: nasıl sıralanacağını, nerede paylaşılacağını seçmek, bir iki alan, içinden seçilecek bir liste, basılan şeyin ayrıntıları.

`edge` ile verilen kenar boyunca durur. Alt kenarda pencere kadar, en çok da stilin `maxWidth`'i kadar geniştir, içeriği kadar yüksektir ve sürüklenince hareket eder. Son kenarda bir yan sheet'tir: pencere kadar yüksek, stilin `sideWidth`'i kadar geniştir, bir kapatma düğmesi vardır ve kenara doğru sürüklemek onu kapatır. İkisinde de modaldır: arkasındaki hiçbir şeye basılamaz, Tab içinden çıkmaz, Android'de TalkBack de içinde kalır. `visible` true olduğu sürece gösterilir, temanın hareketiyle girer ve çıkar; kendini hiçbir zaman gizlemez. Geri tuşu, Escape, scrim'e basmak, kenarına doğru sürüklemek ve yan sheet'in kapatma düğmesi, `dismissible` false olmadıkça `onDismissRequest`'i çağırır. Scrim'i örtebilen tam ekran bir sheet'te ekran okuyucunun kapatma eylemi de onu çağırır.

İçerik sheet'in genişliğine yayılır, bu yüzden bir listenin satırları sheet'in kenarlarına kadar uzanır; bir forma ise yatay iç boşluğu ayrıca verilir. Sheet'e sığmayan içerik başlığın altında kayar. Uzun bir liste bir `LazyColumn`'a konur, `scrollContent` da false yapılır.

**Çıkışı görünsün diye kapatılır.** Kapanmış bir sheet hiçbir şey kurmaz: onu ağaçta `visible = false` ile bırakmak hiçbir şeye mal olmaz ve sheet temanın hareketiyle çıkar. Açıkken kompozisyondan çıkarılan sheet ise bu hareket olmadan gider, bütün bedeli de budur: penceresi çevresindeki pencerenin kökünde kurulduğu için, içeriğini ölçerken atan bir yerleşim hâlâ ölçülmekte olan bir katmanı kapatmış olmaz.

Parametreler:

- `visible: Boolean`: Sheet'in gösterilip gösterilmediği. Temanın hareketiyle girer ve çıkar.
- `onDismissRequest: () -> Unit`: `dismissible` true iken geri tuşu, Escape, scrim'e basmak, kenara doğru sürüklemek ve yan sheet'in kapatma düğmesi için çağrılır. Sheet, `visible` false olana kadar kalır.
- `title: String?`: Sheet'in ne için olduğu, kısa bir etiket olarak: "Sırala". Sheet açılınca duyurulur ve onun başlığıdır. Olmayacaksa null ya da boş: ona satır ayrılmaz, içerik tutamağın altından başlar ve sheet açılınca ekran okuyucu bir ad duyurmaz. Yan sheet'in kapatma düğmesi yine üstünde durur.
- `modifier: Modifier`: Sheet'in kendisine uygulanır. Yanında açık bırakılan scrim şeridi sheet'in parçası değildir.
- `edge: SheetEdge`: sheet'in pencerenin hangi kenarı boyunca durduğu: alt, son, baş ya da pencerenin genişliğine göre (`SheetEdge.Adaptive`), dar bir pencerede alttan tam ekran. `halfOpen`, `fullScreen`, `coverStatusBar` ve `overscrollMovesSheet` uyarlanır bir sheet'te alttan geldiğinde sayılır.
- `dismissible: Boolean`: Geri tuşunun, Escape'in, scrim'e basmanın, kenara doğru sürüklemenin, yan sheet'in kapatma düğmesinin ve ekran okuyucunun kapatma eyleminin kapanmayı isteyip istemediği. Yalnızca sheet'i `content` içindeki bir kontrolün kapatması gerektiğinde false yapılır.
- `halfOpen: Boolean`: İçeriği pencerenin yarısından uzun olan sheet'in önce yarım açılıp açılmadığı; yarım açıkken üstü pencerenin ortasındadır. Yukarı sürüklemek de odağın içine girmesi de onu tam açar, yarım açıkken aşağı sürüklemek ise kapatır. Yalnızca alt kenarda.
- `fullScreen: Boolean`: Tam açık sheet'in, içeriği ne kadar kısa olursa olsun, üstünde scrim kalmadan pencerenin durum çubuğunun altında kalan yeri kadar yüksek olup olmadığı. Alt kenardaki her sheet gibi pencerenin alt kenarına, sistemin gezinme çubuğunun altına kadar iner ve içindekileri o çubuğun üstünde tutar. Yalnızca alt kenarda.
- `coverStatusBar: Boolean`: `fullScreen` olan bir sheet'in durum çubuğunun altına da uzanıp uzanmadığı: o zaman tam açıkken pencerenin tamamı kadar yüksektir. Çubuğun altına girerken üst köşeleri düzleşir, tutamağı ve başlığı çubuğun altında kalır. Android'de, sheet'in pencere kadar geniş olduğu yerde çubuğun ikonları sheet'in üstünde okunacak renge döner. Yalnızca alt kenarda ve `fullScreen` ile.
- `overscrollMovesSheet: Boolean`: Zaten başında olan içeriği aşağı sürüklemenin, devam edip sheet'i de aşağı indirip indirmediği: önce yarım açık hâle, sonra kapalı hâle. Yalnızca kayması gereken bir liste için false yapılır; tutamak ve başlık sheet'i yine sürükler, içeriği yukarı sürüklemek de yarım açık sheet'i yine açar. Yalnızca alt kenarda.
- `scrollContent: Boolean`: Sheet'in `content`'i başlığın altında bir kaydırma alanına koyup koymadığı. Kendi kayan içerik için, örneğin bir kaydırma alanının içinde duramayan bir `LazyColumn` için false yapılır. O zaman `content` başlığın altında kalan yüksekliği alır; kayması yarım açık sheet'i yine açar, başına geldikten sonra da sheet'i aşağı indirir. Bir `LazyColumn`'a `Modifier.fillMaxWidth()` verilir: liste yalnızca ekrandaki satırları kadar geniştir ve satırların yanından sürüklemek onu kaydırmazdı.
- `style: SheetStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: SheetColors?`: Bu çağrının kendi renkleri. Yalnızca verdikleri değişir, gerisi temanınki kalır.
- `tagKey: String?`: Otomasyon için dilden bağımsız bir anahtar: sheet'in etiketi `Sheet_<tagKey>`'dir ve çizildiği hâliyle sheet'in üstünde durur, yan sheet'in kapatma düğmesininki `SheetClose_<tagKey>`'dir.
- `content: @Composable ColumnScope.() -> Unit`: Sheet'in, başlığın altındaki içeriği.

### SheetEdge

`import com.pantrixui.components.overlay.sheet.SheetEdge`, `com.pantrixui:components` içinden

```kotlin
enum class SheetEdge
```

Bir `PantrixSheet`'in boyunca durduğu pencere kenarı.

Değerleri:

- `Bottom`: Alt kenar. Sheet pencere kadar, en çok da stilin `maxWidth`'i kadar geniştir ve içeriği kadar yüksektir; aşağı sürüklemek onu kapatır.
- `End`: Son kenar, sağdan sola bir düzende soldaki. Sheet pencere kadar yüksek ve stilin `sideWidth`'i kadar geniştir, kenara doğru sürüklemek onu kapatır.
- `Start`: Baş kenar, sağdan sola bir düzende sağdaki: dar bir pencerenin içeriğinin yanında değil bir sheet'te tuttuğu, uygulamanın menüsü. Sheet pencere kadar yüksek ve stilin `sideWidth`'i kadar geniştir, kenara doğru sürüklemek onu kapatır.
- `Adaptive`: Dar bir pencerede, `Compact` genişlik sınıfında, tam ekran bir sheet olarak alt kenar; her daha geniş pencerede son kenar: bir form ya da basılanın ayrıntısı, telefonu doldurur ve tablette ya da masaüstünde içeriğin yanında durur. Pencere, sheet'in üstünde gösterildiği penceredir ve sheet açılırken sorulur: açık olan, pencere değişince olduğu gibi kalır.

### SheetStyle

`import com.pantrixui.components.overlay.sheet.SheetStyle`, `com.pantrixui:components` içinden

```kotlin
class SheetStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val sideWidth: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified,
    public val handleWidth: Dp = Dp.Unspecified,
    public val handleHeight: Dp = Dp.Unspecified,
    public val handlePadding: Dp = Dp.Unspecified
) : PantrixStyle<SheetStyle>
```

`PantrixSheet`'in geometrisi.

Tutamak, başlık ve içerik arasındaki boşluk temanın boşluklarından gelir, bu yüzden yoğunluğu izler; scrim'e bırakılan pay ve tutamağın çevresindeki boşluk da öyle. Genişlikler, köşeler, gölge ve tutamağın kendisi izlemez. Bir sheet'in renkleri stilinin parçası değildir: temanın renkleridir, bir çağrının kendi renkleri varsa `SheetColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Uygulamaya bakan köşeler: alt kenardaki bir sheet'in üstteki iki köşesi, son kenardaki bir sheet'in baştaki iki köşesi. Pencerenin kenarındaki köşeler düzdür. Android'de ve iOS'ta büyük, masaüstünde ve web'de orta.
- `maxWidth: Dp`: Alt kenardaki bir sheet'in en çok genişliği; daha geniş bir pencerede sheet kenarın ortasında durur.
- `sideWidth: Dp`: Son kenardaki bir sheet'in genişliği, pencere ona o kadar yer bırakıyorsa.
- `margin: Dp`: Sheet ile pencerenin karşı kenarı arasında açık bırakılan pay: böylece scrim orada görünmeye devam eder ve ona dokunmak sheet'i kapatır. Alt kenardaki yüksek bir sheet'in üstünde, dar bir pencerede son kenardaki bir sheet'in yanında kalır. Dokunulacak bir hedef olduğu için her platformun en küçük dokunma hedefi kadardır.
- `elevation: Dp`: Sheet'in, scrim'in üstünde ne kadar yüksekte durduğu, yani gölgesinin ne kadar büyük olduğu. iOS'ta yoktur.
- `handleWidth: Dp`: Tutamağın uzunluğu; tutamağı alt kenardaki bir sheet, sürüklenebildiği sürece çizer.
- `handleHeight: Dp`: Sürükleme tutamacının ne kadar kalın olduğu: ne kadar uzun olduğu `handleWidth`'tir.
- `handlePadding: Dp`: Tutamağın üstündeki ve altındaki boşluk.

### SheetColors

`import com.pantrixui.components.overlay.sheet.SheetColors`, `com.pantrixui:components` içinden

```kotlin
data class SheetColors(
    public val container: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val handle: Color = Color.Unspecified,
    public val closeIcon: Color = Color.Unspecified,
    public val scrim: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir çağrı için bir `PantrixSheet`'in boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

```kotlin
PantrixSheet(…, colors = SheetColors(container = PantrixTheme.colors.background))
```

Burada verilen `container` temanın rol renklerinden biriyse başlık, tutamak ve kapatma ikonu, kendilerine ayrıca renk verilmedikçe, temanın o renkle eşlediği rengi alır. Hiçbir rolde olmayan bir zeminde bu olmaz: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Sheet'in zemini. Temanın `surface` rengi.
- `title: Color`: Başlık. Temanın `textPrimary`'si.
- `handle: Color`: Alt kenardaki bir sheet'in tutamağı: çizildiği hâliyle, kendi alfasıyla birlikte. Temanın `textSecondary` renginin %40'ı: soluktur ve her yüzeyde görünür.
- `closeIcon: Color`: Son kenardaki bir sheet'in kapatma düğmesinin ikonu. Temanın `onSurface` rengi.
- `scrim: Color`: Sheet'in arkasında uygulamanın üstüne serilen scrim, kendi alfasıyla birlikte. Temanın `scrim` rengi.

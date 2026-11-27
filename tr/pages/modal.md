# Modal

Uygulamanın kendi modal katmanı: bütün pencerenin üstünde bir perde ve onun üstünde uygulamanın çizdiği içerik. Dialog'un ve komut paletinin üstünde durduğu katmandır; ikisinin de çizmediği bir katman için: kendi süzgeçleri olan bir arama, büyük gösterilen bir resim, telefonda bütün ekranı kaplayan bir düzenleyici.

- `PantrixModal` (`com.pantrixui.components.overlay.modal`, `com.pantrixui:components`): Uygulamanın kendi modal katmanı, bir scrim'in üstünde, pencerenin ortasında ya da üstüne yakın: geri, Escape ve scrim onu kapatır, odak içinde kalır ve bir katlanmanın tek yarısında durur. Anahtar sözcükler: modal, katman, scrim, ışık kutusu, özel dialog, odak tuzağı, tam ekran modal.

## Özellikler

- **Kendini kapatmaz.** Geri, Escape ve perdeye basmak `onDismissRequest`'i çağırır; `visible`'ı çağıran kapatır. İçerik temanın hareketiyle girer ve çıkar; kapandıktan sonra modalın hiçbir şeyi çizilmez.
- **Odak içinde kalır.** Klavyeyle açılınca odak içeriğin ilk denetimine geçer, Tab içeride döner ve altındaki uygulamaya gitmez; dokunarak açılınca odak olduğu yerde kalır, yazılım klavyesi istenmeden açılmaz. Kapanınca odak eski yerine döner.
- **Yeri.** `position` içeriği pencerenin ortasına ya da üstüne koyar: `Top`, alanı yerinde kalan bir arama için. `margin` içerikle pencerenin güvenli alanı arasında kalan boşluktur; perdenin parçasıdır.
- **Kendi sayfası.** Boşluksuz bir `margin`, kendini dolduran içerik ve temanın zemini olan bir `scrimColor` modalı telefonda bir sayfa yapar.
- **Ekran okuyucu.** `paneTitle` modal açılırken okunur; perde içerikten sonra tek bir "Kapat" eylemidir.
- **Katlanma.** Bir katlanma pencereyi ikiye bölünce içerik açıldığı yarıda kalır; bir pencere çiziminin içinde açılan modal o çizimi pencere sayar.

## Kullanım

### A search of the app's own, near the top

```kotlin
var searching by rememberSaveable { mutableStateOf(false) }
PantrixModal(
    visible = searching,
    onDismissRequest = { searching = false },
    position = ModalPosition.Top,
    paneTitle = stringResource(Res.string.search),
    tagKey = "search"
) {
    PantrixSurface(Modifier.widthIn(max = 640.dp), shape = PantrixTheme.shapes.lg, elevation = 8.dp) {
        SearchPanel(onOpen = { searching = false })
    }
}
```

### A page of its own on a phone

```kotlin
PantrixModal(
    visible = editing,
    onDismissRequest = { editing = false },
    margin = PaddingValues(),
    paneTitle = stringResource(Res.string.edit_note),
    scrimColor = PantrixTheme.colors.background,
    tagKey = "editor"
) {
    NoteEditor(Modifier.fillMaxSize(), onDone = { editing = false })
}
```

## Örnekler

### Üstte bir arama

Kendi aramanız, pencerenin üstünde: alan yerinde kalır, sonuçlar altında büyüyüp küçülür. Escape, geri ya da perdeye basmak kapatır; bir sonuca basmak da.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.listitem.PantrixListItem
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.components.overlay.modal.ModalPosition
import com.pantrixui.components.overlay.modal.PantrixModal
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var searching by remember { mutableStateOf(false) }
var query by remember { mutableStateOf("") }
PantrixButton(
    text = "Aramayı aç",
    onClick = { searching = true },
    variant = ButtonVariant.Outline,
    tagKey = "search"
)
PantrixModal(
    visible = searching,
    onDismissRequest = { searching = false },
    position = ModalPosition.Top,
    paneTitle = "Ara",
    tagKey = "search"
) {
    PantrixSurface(Modifier.widthIn(max = 560.dp), shape = PantrixTheme.shapes.lg, elevation = 8.dp) {
        Column(Modifier.padding(PantrixTheme.spacing.md)) {
            PantrixTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = "Bir sayfa ara",
                // Etiketi olmayan alanın ekran okuyucudaki adı.
                contentDescription = "Sayfa ara",
                tagKey = "search_query"
            )
            // Her sonucun anahtarı sözleri değil, listedeki yeridir.
            PAGES.withIndex().filter { it.value.contains(query, ignoreCase = true) }.forEach { (index, page) ->
                PantrixListItem(
                    headline = page,
                    leading = { PantrixIcon(PantrixIcons.File, contentDescription = null) },
                    onClick = { searching = false },
                    tagKey = "result_$index"
                )
            }
        }
    }
}

private val PAGES = listOf("Kurulum", "Temalar", "Bileşenler", "Rehberler", "Değişiklik günlüğü")
```

### Kendi sayfası

Telefonda bir sayfa: boşluksuz bir `margin`, temanın zemini olan perde ve kendini dolduran içerik. Pencerenin çubuklarının arkası da zeminin renginde kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textarea.PantrixTextArea
import com.pantrixui.components.overlay.modal.PantrixModal
import com.pantrixui.foundation.theme.PantrixTheme

var editing by remember { mutableStateOf(false) }
var note by remember { mutableStateOf("Pazartesi: tasarımı gözden geçir") }
PantrixButton(text = "Notu düzenle", onClick = { editing = true }, variant = ButtonVariant.Outline, tagKey = "edit")
PantrixModal(
    visible = editing,
    onDismissRequest = { editing = false },
    margin = PaddingValues(),
    paneTitle = "Not",
    scrimColor = PantrixTheme.colors.background,
    tagKey = "editor"
) {
    Column(
        Modifier.fillMaxSize().padding(PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            PantrixText(text = "Not", style = PantrixTheme.typography.title, modifier = Modifier.weight(1f))
            PantrixButton(text = "Bitti", onClick = { editing = false }, tagKey = "done")
        }
        PantrixTextArea(value = note, onValueChange = { note = it }, label = "Not", tagKey = "note")
    }
}
```

### Bir karar isteyen

Bir karar verilmeden kapanmayan bir modal: perdeye basmak da geri de bir şey yapmaz (`dismissOnScrimClick` ve `dismissOnBack` kapalı); içerikteki iki düğmeden biri seçilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.modal.PantrixModal
import com.pantrixui.foundation.theme.PantrixTheme

var asking by remember { mutableStateOf(false) }
var answer by remember { mutableStateOf("Henüz seçilmedi") }
PantrixButton(
    text = "Şartları göster",
    onClick = { asking = true },
    variant = ButtonVariant.Outline,
    tagKey = "terms"
)
PantrixText(text = answer, style = PantrixTheme.typography.footnote, tagKey = "answer")
PantrixModal(
    visible = asking,
    onDismissRequest = { asking = false },
    paneTitle = "Kullanım şartları",
    dismissOnScrimClick = false,
    dismissOnBack = false,
    tagKey = "decision"
) {
    PantrixSurface(Modifier.widthIn(max = 420.dp), shape = PantrixTheme.shapes.lg) {
        Column(
            Modifier.padding(PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
        ) {
            PantrixText(text = "Devam etmek için kullanım şartlarını kabul edin.")
            Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                PantrixButton(
                    text = "Kabul et",
                    onClick = {
                        answer = "Kabul edildi"
                        asking = false
                    },
                    tagKey = "accept"
                )
                PantrixButton(
                    text = "Reddet",
                    onClick = {
                        answer = "Reddedildi"
                        asking = false
                    },
                    variant = ButtonVariant.Outline,
                    tagKey = "decline"
                )
            }
        }
    }
}
```

## API

### PantrixModal

`import com.pantrixui.components.overlay.modal.PantrixModal`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixModal(
    visible: Boolean,
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    position: ModalPosition = ModalPosition.Center,
    margin: PaddingValues = PaddingValues(PantrixTheme.spacing.xl),
    paneTitle: String? = null,
    dismissOnScrimClick: Boolean = true,
    dismissOnBack: Boolean = true,
    scrimColor: Color = PantrixTheme.colors.scrim,
    tagKey: String? = null,
    content: @Composable () -> Unit
)
```

Uygulamanın kendi modal katmanı: bütün pencerenin üstünde bir perde ve onun üstünde, Pantrix'in bir modalının yaptığı her şeyle, uygulamanın çizdiği içerik. `PantrixDialog`'un ve `PantrixCommandPalette`'in üstünde durduğu katmandır; ikisinin de çizmediği bir katman için: kendi süzgeçleri olan bir arama, büyük gösterilen bir resim, bir telefonu dolduran bir düzenleyici.

```kotlin
var searching by rememberSaveable { mutableStateOf(false) }
PantrixModal(
    visible = searching,
    onDismissRequest = { searching = false },
    position = ModalPosition.Top,
    paneTitle = stringResource(Res.string.search)
) {
    PantrixSurface(Modifier.widthIn(max = 640.dp), shape = PantrixTheme.shapes.lg) { SearchPanel() }
}
```

Modal kendini hiç gizlemez. Geri, Escape ve perdeye basmak `onDismissRequest`'i çağırır, `visible`'ı çağıran false yapar; içerik temanın hareketiyle çıkar ve gittiğinde modalın hiçbir şeyi kurulmaz. Penceresi ilk kez çizildikten bir kare sonra girer, hareket görünsün diye.

Odak WAI-ARIA'nın dialog kalıbına uyar. Klavyeyle açılan modal odağı içeriğin ilk denetimine taşır, Tab da içeride döner ve altındaki uygulamaya hiç ulaşmaz; dokunarak açılınca odak olduğu yerde kalır, yazılım klavyesi istenmeden açılmasın diye. Modal kapandığında odak olduğu yerdedir. Modalın altında uygulama odak halkası çizmez. Ekran okuyucu modal belirirken `paneTitle`'ı, sonra içeriği ve en son, basılınca kapattığı yerde, temanın kapatma sözüyle adlanan tek bir eylem olarak perdeyi duyar.

Modal içeriğine dolgu, şekil ya da genişlik vermez: içerik kendini, kendi boyunda, `margin`'in bıraktığı yerde çizer. Bir katlanma pencereyi böldüğünde içerik açıldığı yarıda kalır; bir `PantrixWindowFrame`'in içinde açılan modal o çerçeveyi pencere sayar.

Parametreler:

- `visible: Boolean`: modalın gösterilip gösterilmediği. false yapılınca içerik hareketiyle çıkar ve sonra hiçbir şey kurulmaz.
- `onDismissRequest: () -> Unit`: kullanıcı modalı kapatmak istediğinde çağrılır: geri, Escape ya da perdeye basmak.
- `modifier: Modifier`: içeriğe, `margin`'in içinde uygulanır: etiketlediği düğüm içeriğin çizildiği hâlidir ve üstünde herhangi bir yere basmak içeriğindir, perdenin değil.
- `position: ModalPosition`: içeriğin durduğu yer: pencerenin ortası ya da üstüne yakın.
- `margin: PaddingValues`: içerikle pencerenin güvenli alanı arasında, kenar kenar bırakılan boşluk. Perdenin parçasıdır: içeriğin hemen yanında ona basmak, perdenin başka bir yerine basmak gibi kapatır. Hiç boşluk, kendisine verileni dolduran içerikle, içeriği bütün güvenli alan yapar, bir telefondaki düzenleyici gibi.
- `paneTitle: String?`: modal belirirken ekran okuyucunun duyurduğu: ne olduğu, bir iki sözle.
- `dismissOnScrimClick: Boolean`: perdeye basmanın kapatmayı isteyip istemediği. İstemiyorsa perde, ekran okuyucunun atladığı bir dolgudur.
- `dismissOnBack: Boolean`: geri ve Escape'in kapatmayı isteyip istemediği.
- `scrimColor: Color`: modal gösterilirken uygulamanın üstüne çizilen, içerikle birlikte solan: verilmezse temanın perdesi. Temanın zemini, pencerenin çubuklarıyla birlikte, modalı kendi başına bir sayfa yapar.
- `tagKey: String?`: modalın otomasyon anahtarı: içerik `Modal_<tagKey>`'dir. Bir kapatma, perdeden mi geriden mi geldiğini söyleyen bir `Modal` olayı, `dismiss`, olarak bildirilir.
- `content: @Composable () -> Unit`: modalın gösterdiği, uygulamanın çizdiği.

### ModalPosition

`import com.pantrixui.components.overlay.modal.ModalPosition`, `com.pantrixui:components` içinden

```kotlin
enum class ModalPosition
```

`PantrixModal`'ın içeriğinin pencerede durduğu yer; nasıl girip çıktığını da o söyler.

Değerleri:

- `Center`: Pencerenin güvenli alanının ortasında, bir dialog gibi belirerek ve büyüyerek girer.
- `Top`: Pencerenin güvenli alanının üstüne yakın, yatayda ortada, belirerek ve büyüyerek girer: altındakiler büyüyüp küçülürken alanı yerinde kalan bir arama ya da bir palet.

# Snackbar

Uygulamanın az önce yaptığı bir şeyi söyleyen kısa bir mesaj: "Konuşma arşivlendi", "Değişiklikler kaydedildi". En fazla bir eylemi vardır, odağı almaz ve uygulamayı durdurmaz.

Bir snackbar çizilmez, istenir: `PantrixSnackbarState.show` onu kuyruğa koyar, bir `PantrixSnackbarHost` da sırası gelince ekrana getirir. Sunucu çoğunlukla uygulamanın kökünde tek bir tanedir; kuyruğu verilen `PantrixScaffold` onu kendisi kurar ve kuyruğu içindeki her ekrana `LocalPantrixSnackbars` ile verir.

- `PantrixSnackbarHost` (`com.pantrixui.components.overlay.snackbar`, `com.pantrixui:components`): Uygulamanın az önce yaptığı şeyi söyleyen kısa bir mesaj, en fazla bir eylemle; teker teker gelir, kendiliğinden gider ve odağı hiç almaz. Anahtar sözcükler: bildirim, geri al, kısa mesaj, durum mesajı, anlık mesaj, uyarı mesajı.

## Özellikler

- **Sırayla, teker teker.** Ekranda tek bir snackbar olur; ötekiler istendikleri sırayla bekler. `show` askıda bekleyen bir fonksiyondur: snackbar gidince, nasıl gittiğini döndürür.
- **Bir eylem.** `actionLabel` snackbar'a tek bir eylem koyar: "Geri al". Sonuç, eyleme basıldıysa `SnackbarResult.ActionPerformed`, değilse `Dismissed` olur.
- **Süre.** Eylemsiz snackbar dört saniyede gider (`Short`); `Long` on saniyedir. Eylemli olan, eylem yapılana ya da kapatılana kadar kalır (`UntilDismissed`) ve bir kapatma düğmesi taşır. Fare üstündeyken ve odak içindeyken süre bekler, sonra baştan başlar.
- **Altı ton.** `tone` rengi, ikonu ve duyuruluşu birlikte seçer. Anlam taşıyan dört tonun (`Info`, `Success`, `Warning`, `Danger`) ikonu vardır; `Primary` ve varsayılan `Neutral` ikonsuzdur.
- **Gitmenin yolları.** Süresi dolar, eylemine ya da kapatma düğmesine basılır, yana kaydırılır, odak içindeyken Escape'e basılır, ekran okuyucunun kapatma eylemi kullanılır ya da uygulama onu kaldırır (`SnackbarData.dismiss`).
- **Yeri platforma göre.** Android'de alt kenarın ortasında, iOS'ta üstte, masaüstünde ve web'de alt son köşede çıkar: `SnackbarStyle.placement`. Pencerenin güvenli alanının içinde kalır.
- **Renk sunucunundur.** `SnackbarColors` snackbar'a değil sunucuya verilir ve o sunucunun her snackbar'ını boyar; ikon ve duyuruluş yine tondan gelir.
- **Ekran okuyucu.** Snackbar, okunanı kesmeden duyurulur; yalnızca `Danger` tonu araya girer.
- **Dialog ve sheet'in altında.** Snackbar uygulamanındır: sunucunun üstüne açılan bir dialog ya da sheet onu örter.

## Kullanım

### Undo an archive

```kotlin
val snackbars = rememberPantrixSnackbarState()
val scope = rememberCoroutineScope()
Box(Modifier.fillMaxSize()) {
    Inbox(
        onArchive = { conversation ->
            archive(conversation)
            scope.launch {
                val result = snackbars.show(
                    message = getString(Res.string.conversation_archived),
                    actionLabel = getString(Res.string.undo),
                    tagKey = "archived"
                )
                if (result == SnackbarResult.ActionPerformed) unarchive(conversation)
            }
        }
    )
    PantrixSnackbarHost(snackbars)
}
```

### Confirm that a change was saved

```kotlin
scope.launch {
    snackbars.show(message = getString(Res.string.settings_saved), tagKey = "settings_saved")
}
```

### Report a failure in the danger tone

```kotlin
scope.launch {
    val result = snackbars.show(
        message = getString(Res.string.upload_failed),
        actionLabel = getString(Res.string.retry),
        tone = SnackbarTone.Danger,
        tagKey = "upload_failed"
    )
    if (result == SnackbarResult.ActionPerformed) retryUpload()
}
```

### Every snackbar in colours of the app's own, under a scaffold

```kotlin
val primary = PantrixTheme.colors.primary
PantrixScaffold(
    snackbars = snackbars,
    snackbarHost = {
        PantrixSnackbarHost(snackbars, colors = SnackbarColors(container = primary.color, content = primary.onColor))
    }
) { padding ->
    Inbox(Modifier.padding(padding))
}
```

## Örnekler

### Bir mesaj

En az yazılan: bir mesaj. Kuyruk buraya parametreyle gelmez; scaffold onu `LocalPantrixSnackbars` ile içindeki her ekrana verir. `show` askıda bekleyen bir fonksiyondur, bu yüzden bir coroutine'in içinde çağrılır. Eylemsiz snackbar dört saniyede kendiliğinden gider.

Scope bu örneğindir (`rememberCoroutineScope`): sayfadan çıkılınca iptal olur ve ekrandaki snackbar'ı da götürür. Ekran değişse de kalması gereken bir snackbar, ekrandan uzun yaşayan bir scope'ta istenir. Scaffold'un dışında, kuyruğu veren kimse yokken, `LocalPantrixSnackbars.current` null'dır ve düğme bir şey yapmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = "Taslağı kaydet",
    onClick = { scope.launch { snackbars?.show(message = "Taslak kaydedildi", tagKey = "draft_saved") } },
    variant = ButtonVariant.Outline,
    tagKey = "save_draft"
)
```

### Tonlar

Snackbar'ın altı tonu: her düğme uygulamanın kuyruğundan o tonda bir snackbar ister. `tone` temanın bir rolünün rengini, anlam taşıyan dört tonda bir ikonu ve duyuruluşu seçer: `Danger` ekran okuyucunun o an okuduğunu keser, ötekiler kesmeden duyurulur. Snackbar her tonda dolu çizilir: rolün soluk `container`'ı ile değil, `color` ve `onColor`'ı ile.

Eylemli olanlar eylem yapılana ya da kapatılana kadar kalır, eylemsizler dört saniyede kendiliğinden gider. Art arda basılan düğmelerin snackbar'ları sırayla, teker teker gelir. Her birinin nasıl gittiği düğmelerin altına yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var lastResult by remember { mutableStateOf<String?>(null) }
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    SAMPLES.forEach { sample ->
        PantrixButton(
            text = sample.tone.name,
            onClick = {
                scope.launch {
                    val result = snackbars?.show(
                        message = sample.message,
                        actionLabel = sample.action,
                        tone = sample.tone,
                        tagKey = sample.tone.name.lowercase()
                    )
                    if (result != null) lastResult = "${sample.tone.name}: ${result.name}"
                }
            },
            variant = ButtonVariant.Outline,
            tagKey = "show_${sample.tone.name}"
        )
    }
}
lastResult?.let { result ->
    PantrixText(
        text = "Son snackbar → $result",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private class SnackbarSample(
    val tone: SnackbarTone,
    val message: String,
    val action: String?
)

private val SAMPLES = listOf(
    SnackbarSample(SnackbarTone.Neutral, "Konuşma arşivlendi", "Geri al"),
    SnackbarSample(SnackbarTone.Primary, "Yeni sürüm hazır", "Güncelle"),
    SnackbarSample(SnackbarTone.Info, "Mobil veride senkronizasyon duraklar", null),
    SnackbarSample(SnackbarTone.Success, "Değişiklikler kaydedildi", null),
    SnackbarSample(SnackbarTone.Warning, "Depolama alanı dolmak üzere", "Yönet"),
    SnackbarSample(SnackbarTone.Danger, "Yükleme başarısız oldu", "Tekrar dene")
)
```

### Eylem ve sonucu

`actionLabel` snackbar'a tek bir eylem koyar. `show`, snackbar gidince nasıl gittiğini döndürür: eyleme basıldıysa `SnackbarResult.ActionPerformed`; süresi dolduysa, kapatıldıysa ya da uygulama onu kaldırdıysa `Dismissed`. "Geri al"a basılınca konuşma gelen kutusuna döner.

Eylemli snackbar kendiliğinden gitmez: birkaç saniye, bazı kullanıcıların eyleme ulaşmasına yetmez. Varsayılan süresi bu yüzden `UntilDismissed`'dır ve bir kapatma düğmesi taşır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarResult
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
var inbox by rememberSaveable { mutableIntStateOf(5) }
PantrixButton(
    text = "Bir konuşmayı arşivle",
    onClick = {
        inbox -= 1
        scope.launch {
            val result = snackbars?.show(
                message = "Konuşma arşivlendi",
                actionLabel = "Geri al",
                tagKey = "archived"
            )
            if (result == SnackbarResult.ActionPerformed) inbox += 1
        }
    },
    enabled = inbox > 0,
    variant = ButtonVariant.Outline,
    tagKey = "archive"
)
PantrixText(text = "Gelen kutusu: $inbox konuşma", color = PantrixTheme.colors.textSecondary)
```

### Süre ve kapatma düğmesi

`duration`, kimse bir şey yapmadığında snackbar'ın ne kadar kalacağını söyler: `Short` dört, `Long` on saniye; `UntilDismissed` kapatılana kadar. Platform, daha çok zamana ihtiyacı olan kullanıcı için süreyi uzatabilir. Kapatılana kadar kalan snackbar bir kapatma düğmesi taşır; `closeButton = true` onu kısa bir snackbar'a da koyar.

Fareyi snackbar'ın üstünde tut: süre bekler, fare çekilince baştan başlar. Klavye odağı içindeyken de bekler. Snackbar'ı yana kaydırmak onu süresini beklemeden gönderir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarDuration
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Short",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "Bağlantı kopyalandı",
                    duration = SnackbarDuration.Short,
                    tagKey = "short"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_short"
    )
    PantrixButton(
        text = "Long",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "Dışa aktarma tamamlandı: dosya İndirilenler klasöründe",
                    duration = SnackbarDuration.Long,
                    tagKey = "long"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_long"
    )
    PantrixButton(
        text = "UntilDismissed",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "Güncelleme indirildi: yeniden başlatınca kurulacak",
                    duration = SnackbarDuration.UntilDismissed,
                    tagKey = "until_dismissed"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_until_dismissed"
    )
    PantrixButton(
        text = "Short, kapatma düğmesiyle",
        onClick = {
            scope.launch {
                snackbars?.show(message = "Dosya çöp kutusuna taşındı", closeButton = true, tagKey = "with_close")
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "show_with_close"
    )
}
```

### Sırayla gelen snackbar'lar

Üç snackbar art arda istenir; ekrana istendikleri sırayla, teker teker gelirler. `show` kendi sırası gelene kadar askıda bekler. Sırayı uygulamanın tek kuyruğu tutar: başka bir örneğin istediği snackbar da aynı sıraya girer.

"Kalanlardan vazgeç" bu örneğin coroutine'lerini iptal eder: `show`'u çağıran coroutine iptal edilince ekrandaki snackbar gider, sırası gelmemiş olanlar hiç gösterilmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.cancelChildren
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Üç dosya yükle",
        onClick = {
            listOf("Rapor.pdf", "Bütçe.xlsx", "Sunum.key").forEach { file ->
                scope.launch {
                    snackbars?.show(message = "$file yüklendi", tone = SnackbarTone.Success, tagKey = "uploaded")
                }
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "upload_three"
    )
    PantrixButton(
        text = "Kalanlardan vazgeç",
        onClick = { scope.coroutineContext.cancelChildren() },
        variant = ButtonVariant.Text,
        tagKey = "cancel_uploads"
    )
}
```

### Uygulamanın kaldırdığı snackbar

Kimi snackbar'ı kullanıcı değil uygulama kaldırır: bağlantı geri geldiğinde "Çevrimdışısın" demenin anlamı kalmaz. `PantrixSnackbarState.current` ekrandaki snackbar'dır, yoksa null; `dismiss()` onu götürür ve `show`, `SnackbarResult.Dismissed` döndürür. "Bağlantı geldi" yalnızca bu örneğin snackbar'ı ekrandayken açıktır.

Bu snackbar kapatılana kadar kalır ve kapatma düğmesi yoktur (`closeButton = false`); yana kaydırmak onu yine de gönderir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarDuration
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val onScreen = snackbars?.current
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    PantrixButton(
        text = "Bağlantıyı kes",
        onClick = {
            scope.launch {
                snackbars?.show(
                    message = "Çevrimdışısın: değişiklikler bağlantı gelince eşitlenecek",
                    duration = SnackbarDuration.UntilDismissed,
                    closeButton = false,
                    tone = SnackbarTone.Warning,
                    tagKey = "offline"
                )
            }
        },
        variant = ButtonVariant.Outline,
        tagKey = "go_offline"
    )
    PantrixButton(
        text = "Bağlantı geldi",
        onClick = { onScreen?.dismiss() },
        enabled = onScreen?.tagKey == "offline",
        variant = ButtonVariant.Outline,
        tagKey = "back_online"
    )
}
```

### Sunucuya verilen renk

Renk snackbar'a değil, onu gösteren sunucuya verilir: `PantrixSnackbarHost(state, colors = SnackbarColors(container = …, content = …))`. Uygulamanın sunucusu kökte durduğu için anahtarın durumu da oradadır, uygulamanın ayarlarında; sunucu ona bakar. Açıkken her snackbar aynı dolguyla çizilir; ikonu ve nasıl duyurulduğu yine tonundan gelir.

Anahtarı çevir, sonra buradan ya da "Tonlar"dan bir snackbar iste. Anahtar, snackbar'ın çıktığı kenardan uzak uçta durur: snackbar üstte çıkıyorsa (iOS) düğmenin altında, altta çıkıyorsa üstünde.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.components.overlay.snackbar.SnackbarPlacement
import com.pantrixui.components.overlay.snackbar.SnackbarStyle
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
val snackbarsAtTheTop = PantrixTheme.style(SnackbarStyle).placement == SnackbarPlacement.Top
if (!snackbarsAtTheTop) SnackbarOwnColorsSwitch()
PantrixButton(
    text = "Yedeklemeyi bitir",
    onClick = {
        scope.launch {
            snackbars?.show(message = "Yedekleme tamamlandı", tone = SnackbarTone.Success, tagKey = "backed_up")
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "back_up"
)
if (snackbarsAtTheTop) SnackbarOwnColorsSwitch()

@Composable
private fun SnackbarOwnColorsSwitch() {
    val settings = LocalDemoSettings.current
    PantrixSwitchButton(
        checked = settings.ownSnackbarColors,
        onCheckedChange = { settings.ownSnackbarColors = it },
        label = "Uygulamanın kendi renginde",
        supportingText = "Açıkken snackbar'lar tonlarının değil, sunucularına verilen rengin dolgusuyla çizilir",
        tagKey = "own_snackbar_colors"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalDemoSettings`: Uygulamanın ayarları, içindeki her ekrana: üst bar'daki düğmeler ve "Ayarlar" sayfası onları buradan okur ve değiştirir. Uygulamanın dışında, bir testte tek başına çizilen bir sayfada varsayılan ayarlardır.

### Kendi sunucusu: yer, stil ve renk

Sunucu çoğunlukla uygulamanın kökünde tek bir tanedir. Burada, parametrelerinin ne yaptığını göstermek için, bir kutunun içinde kendi kuyruğuyla ikinci bir sunucu var: `rememberPantrixSnackbarState` kuyruğu verir, `PantrixSnackbarHost` onu gösterir. Sunucu kutunun son çocuğudur: verilen yeri doldurur ve içeriğin üstünde durur.

`style` yeri ve geometriyi değiştirir: `placement` dört yerden birini seçer, `maxWidth` snackbar'ı 320dp'de tutar. Dar bir kutuda snackbar kutuyu doldurur; baş, orta ve son yalnızca geniş bir kutuda ayrılır. `colors` bu sunucunun her snackbar'ını boyar: dolgu uygulamanın kendi moru, ikon yine tonun.

Sunucu pencerenin güvenli alanının içinde kalır. Bu kutu pencerenin ortasında durduğu için o payları kendisi tüketir (`consumeWindowInsets`); kökteki bir sunucuda buna gerek yoktur.

Kuyruğun gösterdiği snackbar `current`'tır (`SnackbarData`): kutunun altındaki satır mesajını yazar ve "Kaldır" onu `dismiss()` ile kapatır, süresini beklemeden.

```kotlin
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.PantrixSnackbarHost
import com.pantrixui.components.overlay.snackbar.SnackbarColors
import com.pantrixui.components.overlay.snackbar.SnackbarData
import com.pantrixui.components.overlay.snackbar.SnackbarPlacement
import com.pantrixui.components.overlay.snackbar.SnackbarStyle
import com.pantrixui.components.overlay.snackbar.SnackbarTone
import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = rememberPantrixSnackbarState()
val scope = rememberCoroutineScope()
val own = ownColors()
var placement by rememberSaveable { mutableStateOf(SnackbarPlacement.BottomCenter) }
PantrixSegmentButton(
    options = PLACEMENTS,
    selected = placement,
    onSelect = { placement = it },
    tagKey = "placement"
)
PantrixSurface(
    modifier = Modifier
        .fillMaxWidth()
        .height(220.dp)
        .consumeWindowInsets(WindowInsets.safeDrawing),
    border = PantrixTheme.colors.divider
) {
    PantrixButton(
        text = "Bu kutuda göster",
        onClick = {
            scope.launch {
                snackbars.show(message = "Kutunun kendi snackbar'ı", tone = SnackbarTone.Success, tagKey = "boxed")
            }
        },
        modifier = Modifier.align(Alignment.Center),
        variant = ButtonVariant.Outline,
        tagKey = "show_boxed"
    )
    PantrixSnackbarHost(
        state = snackbars,
        style = SnackbarStyle(placement = placement, maxWidth = 320.dp),
        colors = SnackbarColors(container = own.color, content = own.onColor)
    )
}
val shown: SnackbarData? = snackbars.current
PantrixText(
    text = shown?.let { "Kutuda: ${it.message}" } ?: "Kutuda snackbar yok",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
if (shown != null) {
    PantrixButton(
        text = "Kaldır",
        onClick = shown::dismiss,
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "dismiss_boxed"
    )
}

private val PLACEMENTS = listOf(
    SegmentOption(value = SnackbarPlacement.Top, label = "Üst", tagKey = "top"),
    SegmentOption(value = SnackbarPlacement.BottomStart, label = "Alt baş", tagKey = "bottom_start"),
    SegmentOption(value = SnackbarPlacement.BottomCenter, label = "Alt orta", tagKey = "bottom_center"),
    SegmentOption(value = SnackbarPlacement.BottomEnd, label = "Alt son", tagKey = "bottom_end")
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixSnackbarHost

`import com.pantrixui.components.overlay.snackbar.PantrixSnackbarHost`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSnackbarHost(
    state: PantrixSnackbarState,
    modifier: Modifier = Modifier,
    style: SnackbarStyle? = null,
    colors: SnackbarColors? = null
)
```

`state`'in snackbar'larını ekrana teker teker getirir: uygulamanın az önce yaptığı şeyi söyleyen kısa mesajlar, her biri en fazla bir eylemle ve nötr, birincil ya da anlam taşıyan bir tonda.

Sunucu uygulamanın üstüne, pencereyi dolduran bir `Box`'ın son çocuğu olarak konur; böylece snackbar'lar içeriğin üstünde belirir. Durum verilen bir `PantrixScaffold` bunu kendisi yapar, bar'larının arasında. Sunucu kendisine verilen yeri doldurur ve her snackbar'ı pencerenin güvenli alanı içinde `SnackbarStyle.placement`'a göre yerleştirir: Android'de alt kenarın ortasına, iOS'ta üste, masaüstünde ve web'de alt son köşeye. Snackbar uygulamanındır, bir dialog'un ya da bir sheet'in değil: sunucunun üstüne açılan bir dialog ya da sheet onun snackbar'larını örter.

Dik bir kat yerinin yanında, kitap gibi tutulan bir katlanabilirde ya da iki ekran arasındaki bir menteşede, snackbar bir yarıda kalır ve kat yerinin üstüne hiç düşmez: alttaki son köşedeki son yarıda, öteki her biri başlangıç yarısında, yerleştirildiği gibi ortasında ya da köşesinde. Yoksa telefonun penceresi kadar geniş bir snackbar köşede de kat yerini aşardı.

Snackbar hiçbir zaman odağı almaz ve uygulamayı durdurmaz. Ekran okuyucu onu, okuduğunu kesmeden duyurur; `SnackbarTone.Danger` tonundakini ise araya girerek. Snackbar `SnackbarDuration`'ı dolunca gider: süre, fare üstündeyken, odak içindeyken ya da sürüklenirken bekler, sonra baştan başlar. Kullanıcı eylemine ya da kapatma düğmesine basınca, onu yana kaydırınca, odak içindeyken Escape'e basınca ya da ekran okuyucunun kapatma eylemini kullanınca da gider.

Parametreler:

- `state: PantrixSnackbarState`: Gösterilecek snackbar'lar; `PantrixSnackbarState.show` bir tane ister.
- `modifier: Modifier`: Sunucunun modifier'ı. Sunucu kendisine verilen yeri doldurur.
- `style: SnackbarStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: SnackbarColors?`: Bu sunucunun gösterdiği her snackbar'ın renkleri, tonlarınınki kullanılmayacaksa: burada verilenler kullanılır, gerisi tonun kalır.

### PantrixSnackbarState

`import com.pantrixui.components.overlay.snackbar.PantrixSnackbarState`, `com.pantrixui:components` içinden

```kotlin
class PantrixSnackbarState
```

Bir uygulamanın istediği snackbar'lar: ekranda bir seferde biri durur, ötekiler istendikleri sırayla sıralarını bekler.

Onları ekrana bir `PantrixSnackbarHost` getirir. Bir sunucunun kapsadığı uygulama parçası için, çoğunlukla da uygulamanın tamamı için, tek bir durum tutulur: böylece hangi ekrandan istenirse istensin snackbar'lar birbirinin arkasında sıraya girer.

Üyeleri:

- `current: SnackbarData?`: Ekrandaki snackbar, yoksa null.
- `suspend fun show(message: String, actionLabel: String? = null, duration: SnackbarDuration = if (actionLabel == null) { SnackbarDuration.Short } else { SnackbarDuration.UntilDismissed }, closeButton: Boolean = duration == SnackbarDuration.UntilDismissed, tone: SnackbarTone = SnackbarTone.Neutral, tagKey: String? = null): SnackbarResult`: Kendisinden önce istenen snackbar'lar gidince bir snackbar gösterir ve onun nasıl gittiğini döndürür.

  Onu çağıran coroutine iptal edilirse snackbar ekrandan kalkar; sırası gelmemişse hiç gösterilmez.

  `message`: ne olduğu, kısa bir cümleyle: "Konuşma arşivlendi".

  `actionLabel`: kullanıcının bu konuda yapabileceği tek şey için kısa bir fiil: "Geri al".

  `duration`: kimse bir şey yapmadığında snackbar'ın ne kadar kaldığı. Eylemi olan bir snackbar, kullanıcı ona bir şey yapana ya da onu kapatana dek kalır: birkaç saniye, bazıları için eyleme ulaşmaya yetmez.

  `closeButton`: snackbar'ın kapatma düğmesi var mı. Kapatılana dek kalan bir snackbar'ın vardır.

  `tone`: snackbar'ın kullanıcıya ne söylediği: renkleri, anlamlı bir ton için bir ikon, ve bir hata için araya giren bir duyuru.

  `tagKey`: snackbar'ın otomasyon anahtarı: snackbar `Snackbar_<tagKey>`, eylemi `SnackbarAction_<tagKey>` ve kapatma düğmesi `SnackbarClose_<tagKey>` olur.

### rememberPantrixSnackbarState

`import com.pantrixui.components.overlay.snackbar.rememberPantrixSnackbarState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberPantrixSnackbarState(): PantrixSnackbarState
```

Onu hatırlayan kompozisyon kadar yaşayan bir `PantrixSnackbarState`.

### LocalPantrixSnackbars

`import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars`, `com.pantrixui:components` içinden

```kotlin
val LocalPantrixSnackbars: ProvidableCompositionLocal<PantrixSnackbarState?>
```

Bu composable'ın çevresindeki düzenin snackbar'ları; onları veren bir şey yoksa null.

İçeriğinin üstüne bir `PantrixSnackbarHost` koyan düzen, sunucunun durumunu burada verir. Böylece içindeki bir ekran, durum kendisine geçirilmeden snackbar gösterir: bir coroutine içinde `LocalPantrixSnackbars.current?.show(...)`. `snackbars` verilen bir `PantrixScaffold` onları verir.

### SnackbarData

`import com.pantrixui.components.overlay.snackbar.SnackbarData`, `com.pantrixui:components` içinden

```kotlin
class SnackbarData
```

Ekrandaki ya da sırasını bekleyen bir snackbar: ne söylediği ve uygulamanın onu kaldırmasının yolu.

Parametreler:

- `message: String`: Snackbar'ın söylediği.
- `actionLabel: String?`: Eylemin etiketi; eylemsiz bir snackbar için null.
- `duration: SnackbarDuration`: Kimse bir şey yapmadığında ne kadar kaldığı.
- `closeButton: Boolean`: Kapatma düğmesinin olup olmadığı.
- `tone: SnackbarTone`: Kullanıcıya ne söylediği: renkleri, ikonu ve nasıl duyurulduğu.
- `tagKey: String?`: Otomasyon anahtarı: snackbar `Snackbar_<tagKey>`, eylemi `SnackbarAction_<tagKey>`, kapatma düğmesi `SnackbarClose_<tagKey>` diye etiketlenir.

Üyeleri:

- `fun dismiss(): Unit`: Snackbar'ı kaldırır ve `PantrixSnackbarState.show`, `SnackbarResult.Dismissed` döndürür. Snackbar gittikten sonra bir şey yapmaz.

### SnackbarTone

`import com.pantrixui.components.overlay.snackbar.SnackbarTone`, `com.pantrixui:components` içinden

```kotlin
enum class SnackbarTone
```

Bir snackbar'ın kullanıcıya ne söylediği: temanın renk rollerinden biri. İkonunu ve nasıl duyurulduğunu da o belirler.

Anlam taşıyan tonlar, `Info`, `Success`, `Warning` ve `Danger`, kullanıcıya hem renk hem ikon olarak ulaşır, çünkü tek başına renk, onu göremeyen kimseye ulaşmaz. `Primary` ve `Neutral` kendi başlarına bir anlam taşımaz ve ikonları yoktur.

Snackbar her tonda dolu çizilir: rolün soluk `container`'ı ile değil, `color` ve `onColor`'ı ile. Çünkü birkaç saniyeliğine uygulamanın kendi içeriğinin üstünde durur ve soluk bir bar sayfadaki bir kart daha gibi görünürdü. `Primary` markanın `primary` rolünü alır. `Neutral`, `neutral` rolünü alır: kendi renk tonu olmayan bu griyi Pantrix'in renkleri açık temada sayfadan koyu, koyu temada sayfadan açık tutar.

Değerleri:

- `Info`: Bilinmeye değer, ne iyi ne kötü bir şey.
- `Success`: Başarılı olan bir şey: kaydedildi, gönderildi, yüklendi.
- `Warning`: Soruna dönüşmeden önce bakılması gereken bir şey.
- `Danger`: Başarısız olan bir şey. Araya girerek duyurulan tek tondur: ekran okuyucunun o an söylediğini keser.
- `Primary`: Uygulamanın fark edilmesini istediği bir şey, markanın renginde ve ikonsuz: kurulmaya hazır yeni bir sürüm, denenecek bir özellik.
- `Neutral`: Uygulamanın yaptığı bir şey: gri, ikonsuz bir bar. Varsayılan budur.

### SnackbarDuration

`import com.pantrixui.components.overlay.snackbar.SnackbarDuration`, `com.pantrixui:components` içinden

```kotlin
enum class SnackbarDuration
```

Kullanıcı bir şey yapmadığında bir snackbar'ın ne kadar kaldığı.

Değerleri:

- `Short`: Dört saniye; platform kullanıcısı için daha fazla zaman öneriyorsa daha uzun.
- `Long`: On saniye; platform kullanıcısı için daha fazla zaman öneriyorsa daha uzun.
- `UntilDismissed`: Kullanıcı eylemine basana ya da onu kapatana, ya da uygulama onu kaldırana kadar.

### SnackbarResult

`import com.pantrixui.components.overlay.snackbar.SnackbarResult`, `com.pantrixui:components` içinden

```kotlin
enum class SnackbarResult
```

Bir snackbar'ın nasıl gittiği.

Değerleri:

- `ActionPerformed`: Kullanıcı eylemine bastı.
- `Dismissed`: Süresi doldu, kullanıcı onu kapattı ya da uygulama onu kaldırdı.

### SnackbarPlacement

`import com.pantrixui.components.overlay.snackbar.SnackbarPlacement`, `com.pantrixui:components` içinden

```kotlin
enum class SnackbarPlacement
```

Bir `PantrixSnackbarHost`'un snackbar'larını gösterdiği yer.

Değerleri:

- `Top`: Üst kenarda, ortada.
- `BottomStart`: Satırların başladığı alt köşede: sol altta, sağdan sola bir düzende sağ altta.
- `BottomCenter`: Alt kenarda, ortada.
- `BottomEnd`: Satırların bittiği alt köşede: sağ altta, sağdan sola bir düzende sol altta. Geniş bir pencerede baş kenardaki gezinmeden, örneğin bir sidebar'dan, uzak durur.

### SnackbarStyle

`import com.pantrixui.components.overlay.snackbar.SnackbarStyle`, `com.pantrixui:components` içinden

```kotlin
class SnackbarStyle(
    public val placement: SnackbarPlacement? = null,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val maxWidth: Dp = Dp.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val margin: Dp = Dp.Unspecified,
    public val elevation: Dp = Dp.Unspecified
) : PantrixStyle<SnackbarStyle>
```

`PantrixSnackbarHost`'un snackbar'larını gösterdiği yer ve o snackbar'ların geometrisi.

Snackbar'ın iç boşluğu temanın boşluklarından gelir; yüksekliği ve kenar payı da yoğunlukla ölçeklenir. Genişlik sınırı ve yükselti ölçeklenmez. Bir snackbar'ın renkleri stilinin parçası değildir: `SnackbarTone`'unun renk rolünden gelir, sunucunun kendi renkleri varsa `SnackbarColors`'tan.

Parametreler:

- `placement: SnackbarPlacement?`: Sunucunun snackbar'larını gösterdiği yer: Android'de alt kenarın ortasında, iOS'ta üstte, masaüstünde ve web'de alt son köşede.
- `shape: ShapeSpec`: Snackbar'ın köşeleri: Android'de, masaüstünde ve web'de en küçük, iOS'ta büyük.
- `maxWidth: Dp`: Bir snackbar'ın en çok genişliği. Daha dar bir sunucuda, kenar payı dışında sunucunun tamamına yayılır.
- `minHeight: Dp`: Mesajı tek satıra sığan bir snackbar'ın yüksekliği.
- `margin: Dp`: Snackbar ile sunucunun kenarları arasında, pencerenin güvenli alanının içinde açık bırakılan pay.
- `elevation: Dp`: Snackbar'ın, uygulamanın üstünde ne kadar yüksekte durduğu, yani gölgesinin ne kadar büyük olduğu.

### SnackbarColors

`import com.pantrixui.components.overlay.snackbar.SnackbarColors`, `com.pantrixui:components` içinden

```kotlin
data class SnackbarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

Tonlarının renklerini almayan bir sunucu için, bir `PantrixSnackbarHost`'un snackbar'larının boyandığı renkler: verilen renk sunucunun her snackbar'ında kullanılır, verilmeyen tonun kalır.

```kotlin
PantrixSnackbarHost(snackbars, colors = SnackbarColors(container = brand.color, content = brand.onColor))
```

Snackbar'a ikonunu ve nasıl duyurulacağını yine tonu verir: sunucunun olan yalnızca boyandığı renktir.

Burada verilen dolgu temanın kendi renklerinden biriyse, üstüne çizilenlerin rengi de ayrıca verilmediği sürece, temanın o dolguyla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Snackbar'ın dolgusu. Tonunun rolünün `color`'ı.
- `content: Color`: Mesaj, ikon, eylemin etiketi ve kapatma düğmesinin çarpısı: `container`'ın üstünde okunan renk. Tonunun rolünün `onColor`'ı.

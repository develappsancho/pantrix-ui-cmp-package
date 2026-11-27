# Diagnostics Inspector

Temanın tanılamasının bulduğu, uygulamanın üstünde: bulguların sayısını gösteren bir düğme, basınca bir liste; listeden seçilen bulgunun düğümü ekranda çerçevelenir. Bu uygulamanın kendisi de onun altındadır: sağ alttaki düğme, uygulamanın kendi bulgularınındır.

- `PantrixDiagnosticsInspector` (`com.pantrixui.components.overlay.inspector`, `com.pantrixui:components`): Bir temanın teşhislerinin bulduğu, uygulamanın üstünde gösterilir: sayılarını taşıyan bir düğme, bir listesi ve seçilenin düğümünün çevresinde bir çerçeve. Anahtar sözcükler: hata ayıklama katmanı, erişilebilirlik denetleyicisi, bulgular listesi, geliştirici araçları, denetim.

## Özellikler

- **Uygulamayı sarar.** `PantrixDiagnosticsInspector(findings) { App() }`: içerik onsuz nasılsa öyle yerleşir ve her basışı alır.
- **Bulgu yokken görünmez.** Düğme ilk bulguyla gelir, liste temizlenince gider.
- **Çerçeve.** Listeden seçilen bulgunun düğümü, ekrana bir sonraki basışa kadar çerçevelenir; düğümü olmayan bir bulgu ekranda olmadığını söyler.
- **Yeri.** `alignment` düğmenin köşesini seçer; varsayılan bitiş kenarının altı.

## Kullanım

### Over the screen of a debug build

```kotlin
val findings = remember { PantrixFindings(then = PantrixDiagnostics.Log) }
PantrixTheme(diagnostics = if (debug) findings else PantrixDiagnostics.Off) {
    if (debug) PantrixDiagnosticsInspector(findings) { App() } else App()
}
```

### Its button at the top, beside a bar's actions

```kotlin
PantrixDiagnosticsInspector(findings, alignment = Alignment.TopEnd, tagKey = "inspector") {
    Screen()
}
```

## Örnekler

### Bir ekranın üstünde

Bir ekran, iki bulgusuyla: soluk renkli bir düğme ve adı boş bir ikon düğmesi. Sağ alttaki düğmeye bas, listeden bir bulgu seç: düğümü çerçevelenir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.inspector.PantrixDiagnosticsInspector
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixDiagnosticsInspector(findings, modifier = Modifier.height(240.dp), tagKey = "orders") {
        Screen(tagKey = "orders")
    }
}

@Composable
private fun Screen(tagKey: String) {
    PantrixCard(modifier = Modifier.fillMaxSize(), variant = CardVariant.Outlined) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixText(text = "Siparişler", style = PantrixTheme.typography.headline)
            PantrixText(text = "Üç sipariş gönderilmeyi bekliyor.")
            PantrixButton(
                text = "Gönder",
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonColors(container = Color(0xFFFFE082), content = Color.White),
                tagKey = "${tagKey}_send"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "",
                onClick = {},
                tagKey = "${tagKey}_more"
            )
        }
    }
}
```

### Düğmesi üstte

Düğme üstte, bir bar'ın eylemlerinin yanında durabileceği yerde.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.inspector.PantrixDiagnosticsInspector
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixDiagnosticsInspector(
        findings,
        modifier = Modifier.height(240.dp),
        alignment = Alignment.TopEnd,
        tagKey = "orders_top"
    ) {
        Screen(tagKey = "orders_top")
    }
}

@Composable
private fun Screen(tagKey: String) {
    PantrixCard(modifier = Modifier.fillMaxSize(), variant = CardVariant.Outlined) {
        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
            PantrixText(text = "Siparişler", style = PantrixTheme.typography.headline)
            PantrixText(text = "Üç sipariş gönderilmeyi bekliyor.")
            PantrixButton(
                text = "Gönder",
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonColors(container = Color(0xFFFFE082), content = Color.White),
                tagKey = "${tagKey}_send"
            )
            PantrixIconButton(
                imageVector = PantrixIcons.MoreHorizontal,
                contentDescription = "",
                onClick = {},
                tagKey = "${tagKey}_more"
            )
        }
    }
}
```

## API

### PantrixDiagnosticsInspector

`import com.pantrixui.components.overlay.inspector.PantrixDiagnosticsInspector`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDiagnosticsInspector(
    findings: PantrixFindings,
    modifier: Modifier = Modifier,
    alignment: Alignment = Alignment.BottomEnd,
    tagKey: String? = null,
    content: @Composable () -> Unit
)
```

Bir uygulamanın üstünde, temasının tanılamasının bulduğunu gösterir: bulguların sayısıyla bir düğme ve basınca onları listeleyen bir sheet; her bulgu denetimiyle, bulunduğu yerle ve onu neyin düzelttiğiyle. Listede seçilen bir bulgu, ekrana bir sonraki basışa kadar düğümünün durduğu yerde çerçevelenir. Hiçbir şey bulunmamışken hiçbir şey gösterilmez.

Uygulamanın ekranını tutar: `content` onsuz nasıl yerleşecekse öyle yerleşir ve her basışı alır, bir çerçeveyi kaldıran basış da bunlardandır. Bir yayın sürümü, tanılamayı kapalı bıraktığı gibi onu da dışarıda bırakır.

Parametreler:

- `findings: PantrixFindings`: temanın tanılamasının bulduğu: `content`'in çevresindeki temanın `diagnostics`'i.
- `modifier: Modifier`: `content`'i ve üstündeki inspector'ı tutan kutuya uygulanır.
- `alignment: Alignment`: düğmenin `content`'in üstünde durduğu yer.
- `tagKey: String?`: dilden bağımsız bir otomasyon anahtarı: inspector'ın etiketi `DiagnosticsInspector_<tagKey>`'dir; düğmesininki, listesininki ve bulgularınınki bu anahtardan yapılır.
- `content: @Composable () -> Unit`: uygulamanın ekranı.

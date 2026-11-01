# Olaylar

Bileşenlerin olayları: bir basış, bir değişim, açılan bir menü. Olay kimliğiyle anlatılır, içeriğiyle değil: hangi bileşen, ne oldu, test etiketi, ekranın adı. Yazılan ya da okunan bir metin olaya girmez; seçilen bir şey, uygulamanın ona verdiği anahtarla girer.

## Özellikler

- **Olay.** `PantrixUiEvent`'in `component`'i, `action`'ı, `testTag`'i, `screen`'i ve isteğe bağlı `props`'u vardır.
- **Gittiği yer.** `PantrixTheme(analytics = PantrixAnalytics { event -> … })` olayları bir yere verir: uygulamanın analitik kitaplığına, bir günlüğe. Verilmezse olaylar atılır (`PantrixAnalytics.NoOp`).
- **Uygulamanın kendi olayı.** `LocalPantrixAnalytics.current` aynı yeri verir: uygulama kendi olayını da oraya gönderir.
- **Uygulamanın anahtarları.** Bir tablonun satırı, bir seçeneğin değeri, bir ağacın düğümü olaya anahtarıyla girer: anahtar kişisel veri olmamalı. Hangi bileşenin hangi anahtarı gönderdiği docs/guide/analytics/ANALYTICS_GUIDE.md'de.

## Örnekler

### Bileşenlerin olayları

Bileşenlerin olayları. İçteki tema olayları bir listeye verir: düğmeye bas ve anahtarı çevir, son olaylar altta yazar, en yenisi üstte. Olayda bileşenin adı, ne olduğu ve test etiketi vardır; düğmenin türü ve anahtarın açılıp açılmadığı gibi Pantrix'in kendi değerleri de.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.analytics.PantrixUiEvent
import com.pantrixui.foundation.theme.PantrixTheme

val events = remember { mutableStateListOf<PantrixUiEvent>() }
var notify by remember { mutableStateOf(true) }
val sink = remember { PantrixAnalytics { event -> events.add(0, event) } }
PantrixTheme(analytics = sink) {
    PantrixButton(text = "Kaydet", onClick = {}, tagKey = "save")
    PantrixSwitchButton(checked = notify, onCheckedChange = { notify = it }, label = "Bildirimler", tagKey = "notify")
}
EventLines(events)

@Composable
private fun EventLines(events: List<PantrixUiEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "Henüz olay yok", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val props = event.props.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = "${event.component} · ${event.action} · ${event.testTag ?: "-"}" +
                    (event.screen?.let { " · $it" }.orEmpty()) + (if (props.isEmpty()) "" else " · $props"),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### Uygulamanın kendi olayı

Uygulamanın kendi olayı. Paylaş düğmesi temanın olay yerini `LocalPantrixAnalytics.current` ile okur ve kendi olayını oraya gönderir: bileşeni, ne olduğu, ekranı ve bir de `props`. Bileşenlerin olaylarıyla aynı yere gider.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.LocalPantrixAnalytics
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.analytics.PantrixUiEvent
import com.pantrixui.foundation.theme.PantrixTheme

val events = remember { mutableStateListOf<PantrixUiEvent>() }
val sink = remember { PantrixAnalytics { event -> events.add(0, event) } }
PantrixTheme(analytics = sink) { ShareButton() }
EventLines(events)

@Composable
private fun ShareButton() {
    val analytics = LocalPantrixAnalytics.current
    PantrixButton(
        text = "Bağlantıyı paylaş",
        onClick = {
            analytics.track(
                PantrixUiEvent(
                    component = "ShareSheet",
                    action = "share",
                    testTag = null,
                    screen = "Product",
                    props = mapOf("channel" to "link")
                )
            )
        },
        variant = ButtonVariant.Outline,
        tagKey = "share"
    )
}

@Composable
private fun EventLines(events: List<PantrixUiEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "Henüz olay yok", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val props = event.props.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = "${event.component} · ${event.action} · ${event.testTag ?: "-"}" +
                    (event.screen?.let { " · $it" }.orEmpty()) + (if (props.isEmpty()) "" else " · $props"),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

## API

### PantrixAnalytics

`import com.pantrixui.foundation.analytics.PantrixAnalytics`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixAnalytics
```

`PantrixUiEvent`'lerin gittiği yer.

Varsayılanı hiçbir şey yapmaz. Böylece bileşenlerin olaylarını koşulsuz bildirmesinin maliyeti, boş bir gövdeye yapılan tek bir sanal çağrıdır. Ürünler kendi SDK'larını `PantrixTheme(analytics = ...)` ile bağlar. Pantrix'in kendisi hiçbir analitik sağlayıcısına bağımlı değildir.

Bir Pantrix kontrolünün üstüne kurulan bir bileşen, iki metin alanı üstüne kurulan bir tarih alanı gibi, o kontrolün olaylarını kendi olaylarının yanında duyar ve tek bir basış iki kez sayılır. Bileşen kontrole `LocalPantrixAnalytics` ile kendi alıcısını verir: bu alıcı bileşenin kendi bildirdiğini atar, kalanını bileşenin adıyla iletir. `PantrixPageSize`, üstüne kurulduğu select ile böyle yapar.

Üyeleri:

- `fun track(event: PantrixUiEvent)`: Bir bileşenin bildirdiği her `event` ile, bildirildiği anda ve UI thread'inde çağrılır. Olayların gittiği yer olayı iletir ve döner: zaman alan iş, en başta göndermek, bu thread'in dışında yapılır.

Tipin kendisinde:

- `PantrixAnalytics.NoOp: PantrixAnalytics`: Her olayı bırakan alıcı: kendisine bir alıcı verilmeyen bir temanın bildirdiği yer.

### PantrixUiEvent

`import com.pantrixui.foundation.analytics.PantrixUiEvent`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixUiEvent(
    public val component: String,
    public val action: String,
    public val testTag: String?,
    public val screen: String?,
    public val props: Map<String, String> = emptyMap()
)
```

Arayüzdeki bir etkileşim, içeriğiyle değil kimliğiyle tarif edilir: hangi bileşen olduğu, ne olduğu ve hangi ekranda olduğu.

**Kullanıcının yazdığı ya da okuduğu metin buraya asla girmez.** Bir alan odağı aldığını ya da temizlendiğini bildirir, içinde ne olduğunu asla; metin alan her bileşenin bir testi bunu tutar. Kapalı bir kümeden gelen bir değer girer: bir seçim, seçilenin anahtarıyla, bir sayfa numarasıyla bildirilir. `props`'un bir kısmı uygulamanın kendi anahtarlarıdır; anahtarları kişisel veri olan bir uygulama o veriyi onlarla gönderir: onları bildiren bileşenleri `docs/guide/analytics/ANALYTICS_GUIDE.md` sayar.

Parametreler:

- `component: String`: Bileşenin adı, örneğin `Button`.
- `action: String`: Ne olduğu, bileşenin kendi sözcüğüyle: `click`, `toggle`, `select`, `open`, `dismiss`, `focus`, `expand` ve rehberin bileşen bileşen saydığı ötekiler.
- `testTag: String?`: Bileşenin otomasyon etiketi, yani testlerin bağlandığı kimliğin aynısı, `TestTagPolicy` ne olursa olsun: `tagKey`'inden, yoksa çağrıldığı yerden kurulur; o yer de çevresindeki kodla değişir. Bir uygulamanın etiketsiz bildirdiği bir olayda null.
- `screen: String?`: Çevresindeki `TestScope` zinciri, örneğin `Checkout.PaymentForm`. Bir `TestScope`'un dışındaysa null.
- `props: Map<String, String>`: Olayın değerleri, üç türde: Pantrix'in kendi sözcükleri ve evet ya da hayır değerleri, `variant`, `via` ve `state` gibi; sayılar, `index`, `page` ve `count` gibi; uygulamanın bileşene verdiği anahtarlar, `row`, `option` ve `destination` gibi.

### LocalPantrixAnalytics

`import com.pantrixui.foundation.analytics.LocalPantrixAnalytics`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixAnalytics: ProvidableCompositionLocal<PantrixAnalytics>
```

Buradaki bileşenlerin olaylarını bildirdiği yer: `PantrixTheme(analytics = …)`. Uygulamanın kendi kodu da kendi olaylarını aynı yere bildirmek için onu okur.

# Analitik bağlayıcı

Bir uygulamanın Pantrix'in olaylarını analitik ürününe bağladığı sınıf: `PantrixTheme(analytics = …)`'ya verilen bağlayıcı. Olayların hangi adla gittiği, ne zaman gönderildiği, ağ yokken ne olduğu ve içlerinde neyin asla bulunmadığı onun kararlarıdır. Bu sayfadaki bağlayıcı, samples/pantrix-analytics örneğinin `ProductAnalytics`'idir.

## Özellikler

- **İzleme planı.** `TrackingPlan`, bir bileşenin etiketiyle ve eylemiyle anlatılan olaylara ürünün adlarını verir ve her birinin hangi değerleri taşıdığını söyler.
- **Genel olay.** Planın adlandırmadığı her olay tek bir `ui_interaction` olarak gider: bileşeni, eylemi, ekranı, anahtardan kurulmuş etiketi ve Pantrix'in kendi değerleriyle. Uygulamanın anahtarları ve çağrının yerinden kurulan etiketler girmez.
- **İzin.** Kullanıcı evet demeden hiçbir olay toplanmaz; izin geri alınınca bekleyenler atılır.
- **Gönderim.** `track` olayı kuyruğa koyar ve döner. Olaylar paket paket ve UI iş parçacığının dışında gider: paket dolunca, ilk olayı yeterince bekleyince ya da uygulama `flush()` deyince.
- **Ağ yokken.** Olaylar bekler; gönderim gittikçe uzayan aralıklarla yeniden denenir ve olaylar ürüne oldukları sırayla varır. Kuyruk dolunca en eskisi atılır.
- **Metin yok.** Yazılan bir metin hiçbir Pantrix olayına girmez, bağlayıcının gönderdiği hiçbir şeye de. Örneğin anlatımı samples/pantrix-analytics/README.md'de, olayların hepsi docs/guide/analytics/ANALYTICS_GUIDE.md'de.

## Örnekler

### İzleme planı

Planın adlandırdığı olaylar. Öde düğmesinin basışı `checkout_pay_tapped` olur ve yalnızca düğmenin türünü taşır. Kargo seçimi `shipping_chosen` olur ve seçilen kargonun anahtarını taşır: plan onun kişisel veri olmadığını söyler. Bir seçim yap ya da düğmeye bas: altta ürünün duyduğu olaylar yazar, en yenisi üstte.

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
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.testing.pantrixTestTagOf
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.PlannedEvent
import com.pantrixui.samples.analytics.ProductEvent
import com.pantrixui.samples.analytics.TrackingPlan
import kotlin.time.Clock

val plan = remember {
    TrackingPlan(
        listOf(
            PlannedEvent(
                tag = pantrixTestTagOf(component = "Button", tagKey = "pay", scope = "Checkout"),
                action = "click",
                name = "checkout_pay_tapped",
                keep = setOf("variant")
            ),
            PlannedEvent(
                tag = pantrixTestTagOf(component = "SegmentButton", tagKey = "shipping", scope = "Checkout"),
                action = "select",
                name = "shipping_chosen",
                notPersonal = setOf("segment")
            )
        )
    )
}
val heard = remember { mutableStateListOf<ProductEvent>() }
val analytics = remember {
    PantrixAnalytics { event -> heard.add(0, plan.productEventOf(event, Clock.System.now())) }
}
PantrixTheme(analytics = analytics) {
    TestScope("Checkout") {
        ShippingChoice(tagKey = "shipping")
        PantrixButton(text = "Öde", onClick = {}, tagKey = "pay")
    }
}
HeardEvents(heard)

@Composable
private fun ShippingChoice(tagKey: String) {
    var shipping by remember { mutableStateOf("standard") }
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = "standard", label = "Standart", tagKey = "standard"),
            SegmentOption(value = "express", label = "Hızlı", tagKey = "express")
        ),
        selected = shipping,
        onSelect = { shipping = it },
        tagKey = tagKey
    )
}

@Composable
private fun HeardEvents(events: List<ProductEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "Ürün henüz bir şey duymadı", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val properties = event.properties.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = if (properties.isEmpty()) event.name else "${event.name} · $properties",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### Genel olay

Planın adlandırmadığı her olay `ui_interaction` olarak gider: bileşeni, eylemi, ekranı, etiketi ve Pantrix'in kendi değerleriyle, anahtarın açık olup olmadığı gibi. Plan boş: kargo seçiminin anahtarı girmez, uygulamanın anahtarıdır ve kişisel veri olabilir. `tagKey`'i olmayan düğmenin etiketi de girmez: çağrının yerinden kurulmuştur, kod değişince değişir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.analytics.PantrixAnalytics
import com.pantrixui.foundation.testing.TestScope
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.ProductEvent
import com.pantrixui.samples.analytics.TrackingPlan
import kotlin.time.Clock

val plan = remember { TrackingPlan(emptyList()) }
val heard = remember { mutableStateListOf<ProductEvent>() }
val analytics = remember {
    PantrixAnalytics { event -> heard.add(0, plan.productEventOf(event, Clock.System.now())) }
}
var gift by remember { mutableStateOf(false) }
PantrixTheme(analytics = analytics) {
    TestScope("Cart") {
        ShippingChoice(tagKey = "shipping")
        PantrixSwitchButton(
            checked = gift,
            onCheckedChange = { gift = it },
            label = "Hediye paketi",
            tagKey = "gift"
        )
        @Suppress("UntaggedControl") // Bilerek tagKey'siz: örnek, etiketinin olaya girmediğini gösteriyor.
        PantrixButton(text = "Alışverişe dön", onClick = {}, variant = ButtonVariant.Outline)
    }
}
HeardEvents(heard)

@Composable
private fun ShippingChoice(tagKey: String) {
    var shipping by remember { mutableStateOf("standard") }
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(value = "standard", label = "Standart", tagKey = "standard"),
            SegmentOption(value = "express", label = "Hızlı", tagKey = "express")
        ),
        selected = shipping,
        onSelect = { shipping = it },
        tagKey = tagKey
    )
}

@Composable
private fun HeardEvents(events: List<ProductEvent>) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (events.isEmpty()) {
            PantrixText(text = "Ürün henüz bir şey duymadı", style = PantrixTheme.typography.footnote)
        }
        events.take(5).forEach { event ->
            val properties = event.properties.entries.joinToString { (key, value) -> "$key=$value" }
            PantrixText(
                text = if (properties.isEmpty()) event.name else "${event.name} · $properties",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
```

### İzin

Kullanıcı evet demeden bağlayıcı hiçbir olayı toplamaz. Evet deyince olaylar kuyrukta bekler ve beşi dolunca ya da "Şimdi gönder"le gider. İzin geri alınınca bekleyenler atılır. Altta bağlayıcının günlüğü, en yenisi üstte.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.Consent
import com.pantrixui.samples.analytics.Outcome
import com.pantrixui.samples.analytics.ProductAnalytics
import com.pantrixui.samples.analytics.SendPolicy
import com.pantrixui.samples.analytics.TrackingPlan
import com.pantrixui.samples.analytics.Transport
import kotlinx.coroutines.launch
import kotlin.time.Clock
import kotlin.time.Duration.Companion.minutes

val connector = rememberConnector(online = { true })
val scope = rememberCoroutineScope()
var consent by remember { mutableStateOf(connector.consent) }
PantrixSwitchButton(
    checked = consent == Consent.Granted,
    onCheckedChange = { yes ->
        consent = if (yes) Consent.Granted else Consent.Denied
        connector.consent = consent
    },
    label = "Analitiğe izin",
    tagKey = "consent"
)
PantrixTheme(analytics = connector) {
    PantrixButton(text = "Beğen", onClick = {}, tagKey = "like")
}
PantrixButton(
    text = "Şimdi gönder",
    onClick = { scope.launch { connector.flush() } },
    variant = ButtonVariant.Outline,
    tagKey = "send_now"
)
ConnectorLog(connector)

@Composable
private fun rememberConnector(
    online: () -> Boolean,
    policy: SendPolicy = SendPolicy(batch = 5, every = 1.minutes),
    consent: Consent = Consent.Unknown
): ProductAnalytics {
    val scope = rememberCoroutineScope()
    return remember(scope) {
        ProductAnalytics(
            plan = TrackingPlan(emptyList()),
            transport = Transport { online() },
            clock = Clock.System,
            scope = scope,
            policy = policy
        ).also { it.consent = consent }
    }
}

@Composable
private fun ConnectorLog(connector: ProductAnalytics) {
    val log by connector.log.collectAsState()
    val waiting by connector.waitingEvents.collectAsState()
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Bekleyen: $waiting", style = PantrixTheme.typography.footnote)
        log.asReversed().take(6).forEach { outcome ->
            PantrixText(
                text = outcome.line(),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

private fun Outcome.line(): String = when (this) {
    is Outcome.NotCollected -> "toplanmadı · ${event.component} ${event.action} · izin yok"
    is Outcome.Waiting -> "bekliyor · ${event.name}"
    is Outcome.Sent -> "gönderildi · ${batch.size} olay"
    is Outcome.Failed -> "gönderilemedi · $size olay · $retryIn sonra yeniden"
    is Outcome.Overflowed -> "atıldı · kuyruk dolu, en eskisi"
    is Outcome.Withdrawn -> "atıldı · $count olay · izin geri alındı"
}
```

### Ağ yokken

Ağı kapat ve düğmeye birkaç kez bas: üç olayda bir gönderim denenir, başaramaz ve bir, iki, dört saniye sonra yeniden denenir. Kuyruk altı olay tutar, dolunca en eskisi atılır. Ağı aç: bekleyenler bir sonraki denemede, oldukları sırayla gider.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.samples.analytics.Consent
import com.pantrixui.samples.analytics.Outcome
import com.pantrixui.samples.analytics.ProductAnalytics
import com.pantrixui.samples.analytics.SendPolicy
import com.pantrixui.samples.analytics.TrackingPlan
import com.pantrixui.samples.analytics.Transport
import kotlin.time.Clock
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Duration.Companion.seconds

var online by remember { mutableStateOf(false) }
val connector = rememberConnector(
    online = { online },
    policy = SendPolicy(batch = 3, every = 1.minutes, capacity = 6, longestRetry = 8.seconds),
    consent = Consent.Granted
)
PantrixSwitchButton(checked = online, onCheckedChange = { online = it }, label = "Ağ", tagKey = "network")
PantrixTheme(analytics = connector) {
    PantrixButton(text = "Paylaş", onClick = {}, tagKey = "share")
}
ConnectorLog(connector)

@Composable
private fun rememberConnector(
    online: () -> Boolean,
    policy: SendPolicy = SendPolicy(batch = 5, every = 1.minutes),
    consent: Consent = Consent.Unknown
): ProductAnalytics {
    val scope = rememberCoroutineScope()
    return remember(scope) {
        ProductAnalytics(
            plan = TrackingPlan(emptyList()),
            transport = Transport { online() },
            clock = Clock.System,
            scope = scope,
            policy = policy
        ).also { it.consent = consent }
    }
}

@Composable
private fun ConnectorLog(connector: ProductAnalytics) {
    val log by connector.log.collectAsState()
    val waiting by connector.waitingEvents.collectAsState()
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Bekleyen: $waiting", style = PantrixTheme.typography.footnote)
        log.asReversed().take(6).forEach { outcome ->
            PantrixText(
                text = outcome.line(),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

private fun Outcome.line(): String = when (this) {
    is Outcome.NotCollected -> "toplanmadı · ${event.component} ${event.action} · izin yok"
    is Outcome.Waiting -> "bekliyor · ${event.name}"
    is Outcome.Sent -> "gönderildi · ${batch.size} olay"
    is Outcome.Failed -> "gönderilemedi · $size olay · $retryIn sonra yeniden"
    is Outcome.Overflowed -> "atıldı · kuyruk dolu, en eskisi"
    is Outcome.Withdrawn -> "atıldı · $count olay · izin geri alındı"
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

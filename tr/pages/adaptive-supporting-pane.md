# Destek paneli

Ekranın asıl içeriği ve onu destekleyen bir panel: belge ve yorumları, grafik ve filtreleri, harita ve sonuçları. Yer varsa yan yana durur; yoksa destek paneli ana içeriğin üstünde bir sheet'te ya da onun yerinde açılır.

`PantrixSupportingPaneScaffold` kendi yerine bakar, pencereye değil. `Expanded`'dan itibaren, ana içerik stilin `minMainWidth`'inin altına inmeyecekse destek paneli sonda, 360dp genişliğinde durur; ana içerik kalanı alır. Daha dar bir yerde destek paneli kapalıdır, `show()` onu açar.

Ne gösterildiğini `SupportingPaneState` tutar: `rememberSupportingPaneState()` ile hatırlanır, döndürmede ve işlem yeniden başlatılınca da kaybolmaz. `show()` ve `hide()` paneli o anki yerine göre açar ve kapatır.

- `PantrixSupportingPaneScaffold` (`com.pantrixui.components.container.supportingpane`, `com.pantrixui:components`): Ana içerik ve onu destekleyen bir bölme: yer varsa yan yana, yoksa onun üstünde. Anahtar sözcükler: yan panel, destek bölmesi, ikincil bölme, denetçi paneli, yorumlar paneli, bölünmüş görünüm.

## Özellikler

- **Yanda.** Geniş bir yerde destek paneli baştan açıktır; `hide()` onu kaldırır, ana içerik bütün yeri alır. Geri uygulamanındır: iskele dokunmaz.
- **Dar yerde sheet.** `presentation` varsayılanı `Sheet`: destek paneli iskelenin kendi yerinde, ana içeriğin üstünde bir sheet'te açılır. Telefonda (`Compact`) alttan gelir ve tutamacından aşağı sürüklenince kapanır; daha geniş bir yerde sondan gelir. Başlığı `supportingTitle`, yanında bir kapatma düğmesi durur; scrim'e basmak, geri tuşu, Escape ve iOS'un kenardan kaydırması da kapatır. Klavyenin odağı sheet'e girer, kapanınca yerine döner.
- **Dar yerde panelin yerinde.** `SupportingPanePresentation.Pane` destek panelini ana içeriğin yerine, sondan kaydırarak getirir; geri ana içeriğe döndürür, kenardan kaydırırken panel parmakla gider.
- **Yer değişince.** Pencere daralınca sheet kendiliğinden açılmaz, ana içeriği örtmez. Üstte açık olan destek paneli pencere genişleyince yanda kalır.
- **Panellere söylenen.** Her panel `SupportingPaneScope` içinde kurulur: `supportingPlace` destek panelinin nerede olduğunu (`Beside`, `Sheet`, `InPlaceOfMain`), `isSupportingShown` görünüp görünmediğini söyler. Yanda panel kendi başlığını ve gizle düğmesini çizer; sheet'te başlık iskelenindir.
- **Genişliği değişebilir.** `resizable = true` panellerin arasına bir tutamaç koyar: sürüklenir, ok tuşlarıyla ayarlanır, ekran okuyucu değerini değiştirebilir. Genişlik `SupportingPaneState.supportingWidth`'te kalır.
- **Katlanan cihaz.** Kitap gibi tutulunca iki panel her genişlikte kat yerinde buluşur; masaya konunca ana içerik kat yerinin üstünde, destek paneli altında durur.
- **Her panel bir pencere.** Panelin içindeki her şey panelin genişliğini pencere olarak okur.
- **Durum korunur.** Destek paneli gizliyken ve bir yerden ötekine geçerken kompozisyonda kalır: yazılan yorum, seçilen filtre kaybolmaz.
- **Okuma yönü.** Sağdan sola bir dilde destek paneli soldadır.

## Kullanım

### A document and its comments

```kotlin
val comments = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = comments,
    main = { Document(onComments = { comments.show() }) },
    supporting = { Comments(showHeader = supportingPlace == SupportingPanePlace.Beside) },
    modifier = Modifier.fillMaxSize(),
    mainTitle = "Report",
    supportingTitle = "Comments"
)
```

### A map and its results, in its place on a phone

```kotlin
val results = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = results,
    main = { Map(onList = { results.show() }) },
    supporting = {
        Results(onBack = if (supportingPlace == SupportingPanePlace.InPlaceOfMain) ({ results.hide() }) else null)
    },
    modifier = Modifier.fillMaxSize(),
    presentation = SupportingPanePresentation.Pane,
    resizable = true
)
```

## Örnekler

### Belge ve yorumlar

Bir rapor ve yorumları. Geniş bir yerde yorumlar raporun yanında durur; üstündeki "Yorumları gizle" onları kaldırır, rapor bütün yeri alır.

Karttaki pencere seçicisinden "Dar"ı seç ve "Yorumlar"a bas: yorumlar alttan açılan bir sheet'te gelir. Tutamacından aşağı sürükle, scrim'e bas ya da kapatma düğmesine bas: kapanır. "Orta"da sheet sondan gelir.

Yorum alanına bir şey yaz ve pencereyi değiştir: yazdığın kalır. Destek paneli her yerde aynı kompozisyondur. Yanda dururken başlığını ve gizle düğmesini panel kendisi çizer (`supportingPlace == Beside`); sheet'te başlık ve kapatma düğmesi iskelenindir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPanePlace
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.inputs.textfield.PantrixTextField
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val comments = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = comments,
    main = {
        DocumentPane(
            commentsShown = isSupportingShown,
            onComments = { if (isSupportingShown) comments.hide() else comments.show() }
        )
    },
    supporting = {
        CommentsPane(
            // Yanda panel kendi başlığını çizer; sheet'te başlık ve kapatma düğmesi iskelenindir.
            onHide = if (supportingPlace == SupportingPanePlace.Beside) ({ comments.hide() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    mainTitle = "Çeyrek raporu",
    supportingTitle = "Yorumlar",
    tagKey = "document"
)

@Composable
private fun DocumentPane(
    commentsShown: Boolean,
    onComments: () -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Çeyrek raporu",
                actions = {
                    PantrixButton(
                        text = if (commentsShown) "Yorumları gizle" else "Yorumlar",
                        onClick = onComments,
                        variant = ButtonVariant.Text,
                        tagKey = "document_comments"
                    )
                },
                tagKey = "document"
            )
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
            ) {
                PARAGRAPHS.forEach { PantrixText(text = it, style = PantrixTheme.typography.body) }
            }
        }
    }
}

@Composable
private fun CommentsPane(onHide: (() -> Unit)?) {
    val draft = rememberTextFieldState()
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            if (onHide != null) HideBar(title = "Yorumlar", onHide = onHide, tagKey = "comments")
            Column(
                modifier = Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
            ) {
                COMMENTS.forEach { comment ->
                    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                        PantrixAvatar(contentDescription = null, initials = comment.initials)
                        Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
                            PantrixText(text = comment.author, style = PantrixTheme.typography.callout)
                            PantrixText(text = comment.text, style = PantrixTheme.typography.footnote)
                        }
                    }
                }
            }
            PantrixHorizontalDivider()
            PantrixTextField(
                state = draft,
                modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.md),
                label = "Yorum yaz",
                tagKey = "comments_draft"
            )
        }
    }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun HideBar(
    title: String,
    onHide: () -> Unit,
    tagKey: String
) {
    PantrixTopBar(
        title = title,
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Close,
                contentDescription = "$title gizle",
                onClick = onHide,
                tagKey = "${tagKey}_hide"
            )
        },
        tagKey = tagKey
    )
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private val PARAGRAPHS = listOf(
    "Üçüncü çeyrekte satışlar bir önceki çeyreğe göre yüzde on iki arttı. Artışın çoğu internetten geldi.",
    "Mağazalardaki satış yerinde saydı; iki yeni mağazanın açılışı ekime kaldı.",
    "Bayi kanalında yeni sözleşmeler yürürlüğe girdi. Etkisi dördüncü çeyrekte görülecek.",
    "Gelecek çeyrek için hedef, internet satışlarını korurken mağazalarda yüzde beş büyümek."
)

private val COMMENTS = listOf(
    DemoComment("Ayşe Yılmaz", "AY", "İnternet satışlarının kaynağını ayrıca gösterebilir miyiz?"),
    DemoComment("Mert Kaya", "MK", "Mağaza açılışlarının tarihi kesinleşti mi?"),
    DemoComment("Elif Demir", "ED", "Bayi sözleşmelerinin özeti ekte.")
)

private class DemoComment(
    val author: String,
    val initials: String,
    val text: String
)
```

### Grafik ve filtreler: genişliği sürüklenir

Bir grafik ve filtreleri. Filtrelerin değeri örnekte tutulur (`channels`, `stacked`): iki panel de onu okur, grafik filtre değişince kendini çizer.

`resizable = true`: geniş bir yerde panellerin arasındaki tutamacı sürükle ya da odaklayıp ok tuşlarıyla ayarla; sol ok filtreleri genişletir. Genişlik `supportingWidth`'te kalır, "Dar"a geçip dönünce de yerindedir. `style = SupportingPaneScaffoldStyle(minSupportingWidth = 240.dp)`: tutamaç filtreleri 240dp'den dar yapmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.bar.PantrixBarChart
import com.pantrixui.components.chart.cartesian.ChartValue
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPanePlace
import com.pantrixui.components.container.supportingpane.SupportingPaneScaffoldStyle
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val filters = rememberSupportingPaneState()
val channels = remember { mutableStateListOf(*CHANNELS.map { it.key }.toTypedArray()) }
var stacked by remember { mutableStateOf(false) }
PantrixSupportingPaneScaffold(
    state = filters,
    main = {
        ChartPane(
            channels = channels,
            stacked = stacked,
            filtersShown = isSupportingShown,
            onFilters = { if (isSupportingShown) filters.hide() else filters.show() }
        )
    },
    supporting = {
        FiltersPane(
            channels = channels,
            onChannel = { key, on -> if (on) channels.add(key) else channels.remove(key) },
            stacked = stacked,
            onStacked = { stacked = it },
            onHide = if (supportingPlace == SupportingPanePlace.Beside) ({ filters.hide() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    mainTitle = "Satışlar",
    supportingTitle = "Filtreler",
    resizable = true,
    style = SupportingPaneScaffoldStyle(minSupportingWidth = 240.dp),
    tagKey = "sales"
)

@Composable
private fun ChartPane(
    channels: List<String>,
    stacked: Boolean,
    filtersShown: Boolean,
    onFilters: () -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Satışlar",
                actions = {
                    PantrixButton(
                        text = if (filtersShown) "Filtreleri gizle" else "Filtreler",
                        onClick = onFilters,
                        variant = ButtonVariant.Text,
                        tagKey = "sales_filters"
                    )
                },
                tagKey = "sales"
            )
            PantrixBarChart(
                data = MONTHS,
                x = { it.month },
                values = CHANNELS.filter { it.key in channels }.map { channel ->
                    ChartValue<MonthSales>(channel.key, channel.name) { channel.of(it) }
                },
                modifier = Modifier.weight(1f).padding(PantrixTheme.spacing.md),
                stacked = stacked,
                description = "Seçilen kanalların aylara göre satışı",
                tagKey = "sales_chart"
            )
        }
    }
}

@Composable
private fun FiltersPane(
    channels: List<String>,
    onChannel: (key: String, on: Boolean) -> Unit,
    stacked: Boolean,
    onStacked: (Boolean) -> Unit,
    onHide: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            if (onHide != null) HideBar(title = "Filtreler", onHide = onHide, tagKey = "filters")
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
            ) {
                PantrixText(text = "Kanallar", style = PantrixTheme.typography.callout)
                CHANNELS.forEach { channel ->
                    PantrixCheckbox(
                        checked = channel.key in channels,
                        onCheckedChange = { onChannel(channel.key, it) },
                        label = channel.name,
                        tagKey = "filter_${channel.key}"
                    )
                }
                PantrixHorizontalDivider()
                PantrixSwitchButton(
                    checked = stacked,
                    onCheckedChange = onStacked,
                    label = "Üst üste göster",
                    tagKey = "filter_stacked"
                )
            }
        }
    }
}

private val CHANNELS = listOf(
    SalesChannel("online", "İnternet") { it.online },
    SalesChannel("stores", "Mağazalar") { it.stores },
    SalesChannel("partners", "Bayiler") { it.partners }
)

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun HideBar(
    title: String,
    onHide: () -> Unit,
    tagKey: String
) {
    PantrixTopBar(
        title = title,
        actions = {
            PantrixIconButton(
                imageVector = PantrixIcons.Close,
                contentDescription = "$title gizle",
                onClick = onHide,
                tagKey = "${tagKey}_hide"
            )
        },
        tagKey = tagKey
    )
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class SalesChannel(
    val key: String,
    val name: String,
    val of: (MonthSales) -> Double
)

private class MonthSales(
    val month: String,
    val online: Double,
    val stores: Double,
    val partners: Double
)

private val MONTHS = listOf(
    MonthSales("Tem", online = 42.0, stores = 30.0, partners = 12.0),
    MonthSales("Ağu", online = 48.0, stores = 29.0, partners = 14.0),
    MonthSales("Eyl", online = 55.0, stores = 31.0, partners = 18.0)
)
```

### Harita ve sonuçlar: dar yerde haritanın yerinde

Bir harita ve sonuçları, `presentation = SupportingPanePresentation.Pane` ile: dar bir yerde sonuçlar sheet'te değil, haritanın yerinde açılır. Başındaki geri düğmesi, Android'in geri tuşu, Escape ve iOS'un kenardan kaydırması haritaya döndürür; geri düğmesi yalnızca o zaman durur (`supportingPlace == InPlaceOfMain`).

Bir sonuca bas: haritadaki işareti büyür. Seçim örnekte tutulur, iki panel de onu okur.

```kotlin
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPanePlace
import com.pantrixui.components.container.supportingpane.SupportingPanePresentation
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val results = rememberSupportingPaneState()
var chosen by remember { mutableStateOf<String?>(null) }
PantrixSupportingPaneScaffold(
    state = results,
    main = {
        MapPane(
            chosen = chosen,
            // Yanda sonuçlar zaten görünür: düğme yalnızca dar yerde durur.
            onResults = if (supportingPlace == SupportingPanePlace.Beside) null else ({ results.show() })
        )
    },
    supporting = {
        ResultsPane(
            chosen = chosen,
            onChoose = { chosen = it },
            onBack = if (supportingPlace == SupportingPanePlace.InPlaceOfMain) ({ results.hide() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    mainTitle = "Harita",
    supportingTitle = "Sonuçlar",
    presentation = SupportingPanePresentation.Pane,
    tagKey = "places"
)

@Composable
private fun MapPane(
    chosen: String?,
    onResults: (() -> Unit)?
) {
    val colors = PantrixTheme.colors
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Harita",
                actions = if (onResults != null) {
                    {
                        PantrixButton(
                            text = "Sonuçlar",
                            onClick = onResults,
                            variant = ButtonVariant.Text,
                            tagKey = "places_results"
                        )
                    }
                } else {
                    null
                },
                tagKey = "places_map"
            )
            Canvas(modifier = Modifier.fillMaxWidth().weight(1f).background(colors.neutral.container)) {
                val step = 48.dp.toPx()
                var x = 0f
                while (x < size.width) {
                    drawLine(colors.border, Offset(x, 0f), Offset(x, size.height))
                    x += step
                }
                var y = 0f
                while (y < size.height) {
                    drawLine(colors.border, Offset(0f, y), Offset(size.width, y))
                    y += step
                }
                PLACES.forEach { place ->
                    val big = place.name == chosen
                    drawCircle(
                        color = if (big) colors.primary.color else colors.textSecondary,
                        radius = (if (big) 12.dp else 7.dp).toPx(),
                        center = Offset(place.x * size.width, place.y * size.height)
                    )
                }
            }
        }
    }
}

@Composable
private fun ResultsPane(
    chosen: String?,
    onChoose: (String) -> Unit,
    onBack: (() -> Unit)?
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = "Sonuçlar",
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "places_back") } },
                tagKey = "places_list"
            )
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                PLACES.forEachIndexed { index, place ->
                    if (index > 0) PantrixHorizontalDivider()
                    val selected = place.name == chosen
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .selectable(selected = selected, onClick = { onChoose(place.name) })
                            .background(if (selected) colors.primary.container else Color.Transparent)
                            .padding(spacing.md),
                        verticalArrangement = Arrangement.spacedBy(spacing.xs)
                    ) {
                        PantrixText(
                            text = place.name,
                            style = PantrixTheme.typography.callout,
                            color = if (selected) colors.primary.onContainer else Color.Unspecified,
                            tagKey = "place_$index"
                        )
                        PantrixText(
                            text = place.kind,
                            style = PantrixTheme.typography.footnote,
                            color = if (selected) colors.primary.onContainer else colors.textSecondary
                        )
                    }
                }
            }
        }
    }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private val PLACES = listOf(
    DemoPlace("Moda Sahili", "Park", 0.22f, 0.64f),
    DemoPlace("Kadıköy Çarşısı", "Pazar", 0.48f, 0.38f),
    DemoPlace("Haydarpaşa", "Gar", 0.36f, 0.18f),
    DemoPlace("Yeldeğirmeni", "Mahalle", 0.70f, 0.52f),
    DemoPlace("Fenerbahçe Parkı", "Park", 0.82f, 0.82f)
)

private class DemoPlace(
    val name: String,
    val kind: String,
    val x: Float,
    val y: Float
)
```

### Yanda gizlemek ve göstermek

Durumun iki yarısı: `isShownBeside` geniş bir yerde, `isOpenOver` dar bir yerde ne gösterildiğini tutar; `isShown` o anki yerinkini okur. İkisi ayrıdır: pencere daralınca sheet kendiliğinden açılmaz.

"Geniş"te "Gizle"ye bas, sonra "Dar"a geç ve "Göster"e bas: sheet açılır. "Geniş"e dön: destek paneli yanda durur, `isShownBeside` yeniden "evet" olur. `rememberSupportingPaneState(initiallyShownBeside = false)` geniş bir yerde de kapalı başlatır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.SupportingPaneScope
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val notes = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = notes,
    main = {
        PaneSurface {
            Column(
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
            ) {
                StateLines(this@PantrixSupportingPaneScaffold)
                Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
                    PantrixButton(text = "Göster", onClick = { notes.show() }, tagKey = "notes_show")
                    PantrixButton(
                        text = "Gizle",
                        onClick = { notes.hide() },
                        variant = ButtonVariant.Outline,
                        tagKey = "notes_hide"
                    )
                }
            }
        }
    },
    supporting = {
        PaneSurface {
            PantrixText(
                text = "Notlar",
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                style = PantrixTheme.typography.headline,
                tagKey = "notes_title"
            )
        }
    },
    modifier = Modifier.fillMaxWidth().height(SUPPORTING_EXAMPLE_HEIGHT),
    supportingTitle = "Notlar",
    tagKey = "notes"
)

@Composable
private fun StateLines(scope: SupportingPaneScope) {
    val state = scope.state
    listOf(
        "supportingPlace: ${scope.supportingPlace.name}",
        "isShown: ${yesNo(state.isShown)}",
        "isShownBeside: ${yesNo(state.isShownBeside)}",
        "isOpenOver: ${yesNo(state.isOpenOver)}"
    ).forEach { line ->
        PantrixText(text = line, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

private fun yesNo(value: Boolean): String = if (value) "evet" else "hayır"
```

### Katlanan cihazda: kat yerinde ayrılır

Katlanan bir cihazda iki panel kat yerinde ayrılır. Her panel kendi ölçüsünü ve pencere sınıfını yazar.

"Kitap"ı seç: pencere 951dp, kat yeri dikey; ana içerik ve destek paneli kat yerinin iki yanında, aradaki boşluk kat yerinin iki yanındaki 20'şer dp'lik şerittir. "Masa"yı seç: kat yeri yataydır, ana içerik üstte, destek paneli altta. 669dp'lik pencere düz bir telefonda tek panel olurdu; masaya konmuş bir katlanabilirde iki panel olur.

İskele kat yerini kendi yerinde arar. "Masa"da kat yeri 951dp'lik pencerenin ortasındadır: örnek orada pencere kadar uzundur ki kat yeri onu kessin. Bir ekranda iskele zaten `Modifier.fillMaxSize()` ile bütün pencereyi alır.

```kotlin
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold
import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val player = rememberSupportingPaneState()
val window = PantrixTheme.window
// Masaya konmuş bir katlanabilirde kat yeri pencerenin ortasındadır: örnek pencere kadar uzun olur.
val tall = if (window.posture.isTabletop) window.size.height else SUPPORTING_EXAMPLE_HEIGHT
PantrixSupportingPaneScaffold(
    state = player,
    main = { MeasuredPane(name = "Ana içerik", tagKey = "player_main_size") },
    supporting = { MeasuredPane(name = "Destek paneli", tagKey = "player_supporting_size") },
    modifier = Modifier.fillMaxWidth().height(tall),
    mainTitle = "Video",
    supportingTitle = "Denetimler",
    tagKey = "player"
)

@Composable
private fun MeasuredPane(
    name: String,
    tagKey: String
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PaneSurface(modifier = Modifier.onSizeChanged { size = it }) {
        // Ölçüler soldan sağa yazılır: sağdan sola bir paragrafta genişlik ile yükseklik yer değiştirmiş okunurdu.
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            PantrixText(
                // Panel kendi penceresidir: sınıfı panelin genişliğine göredir.
                text = "$name: $words dp · ${PantrixTheme.window.widthClass.name}",
                modifier = Modifier.align(Alignment.Center).padding(PantrixTheme.spacing.md),
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary,
                tagKey = tagKey
            )
        }
    }
}

private val SUPPORTING_EXAMPLE_HEIGHT = 460.dp

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}
```

## API

### PantrixSupportingPaneScaffold

`import com.pantrixui.components.container.supportingpane.PantrixSupportingPaneScaffold`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSupportingPaneScaffold(
    state: SupportingPaneState,
    main: @Composable SupportingPaneScope.() -> Unit,
    supporting: @Composable SupportingPaneScope.() -> Unit,
    modifier: Modifier = Modifier,
    mainTitle: String? = null,
    supportingTitle: String? = null,
    presentation: SupportingPanePresentation = SupportingPanePresentation.Sheet,
    resizable: Boolean = false,
    style: SupportingPaneScaffoldStyle? = null,
    tagKey: String? = null
)
```

Bir ekranın ana içeriği ve onu destekleyen bir panel: bir belge ve yorumları, bir grafik ve filtreleri, bir harita ve sonuçları. Yerde ikisine de yer varsa yan yana; yoksa ana içeriğin üstünde ya da yerinde.

- **Yanda.** İskele pencereninkini değil kendi yerini sayar: `Expanded`'dan itibaren ve ana içerik stilin `minMainWidth`'ini koruyorsa destek paneli sonda, stilin `supportingWidth`'i genişliğindedir; ana içerik boşluktan sonra kalanı alır ve geri uygulamanındır. Destek paneli orada baştan durur; `SupportingPaneState.hide` onu kaldırır, ana içerik bütün yeri alır.

- **Dar yer.** Yanında yer olmadığında destek paneli `SupportingPaneState.show`'a kadar kapalıdır. `SupportingPanePresentation.Sheet` ile iskelenin kendi yerinde çizilen bir sheet'te, basılınca kapanan bir scrim'in üstünde açılır: `Compact` bir yerde alttan gelir ve tutamacı sürüklenince kapanır, daha geniş bir yerde sondan gelir; `supportingTitle`'ın ve bir kapatma düğmesinin altında. Klavyenin odağı içine girer ve sheet kapanana kadar orada kalır. `SupportingPanePresentation.Pane` ile ana içeriğin yerine sondan kayarak gelir ve geri hareketi ilerledikçe parmakla gider. İkisinde de geri tuşu, Escape ve iOS'un kenardan kaydırması kapatır.

- **Yer değişince.** Daralan bir pencere destek panelini ana içeriğin üstünde açmaz; ana içeriğin üstünde açık olan destek paneli pencere genişleyince yanında görünür kalır.

- **Genişliği değişebilir.** `resizable` ile boşlukta bir tutamaç durur: sürüklemek, ok tuşları ve ekran okuyucunun ayarlaması destek panelini, stilin `minSupportingWidth`'i ile ana içeriğin `minMainWidth`'ten daha dar kalacağı yer arasında genişletip daraltır. Üstündeki imleç boyutlandırma imlecidir (`PantrixPointerIcons.ResizeHorizontal`). Genişlik `SupportingPaneState.supportingWidth`'te saklanır.

- **Kat yerleri.** Kitap gibi tutulan bir katlanabilir ikisini her genişlikte gösterir, kat yerinde buluşurlar; masaya konmuş olanı ana içeriği kat yerinin üstünde, destek panelini altında gösterir. Kat yeri panelleri kendisi yerleştirir; o zaman tutamaç yoktur.

- **Her panel bir pencere.** Bir panelin içindekine o panel pencere olarak söylenir: `PantrixTheme.window`, sınıfları ve `PantrixTheme.layout` panelin yerine göre cevap verir. Duruş pencerenin kalır.

- **Ekran okuyucu.** Her panel bir grup olarak okunur. `mainTitle` ve `supportingTitle` panelleri görünür olurken adlandırır; bunu Android'de TalkBack söyler, Compose bir panelin adını VoiceOver'a söylemez. Scrim okunmaz: sheet'i kapatma düğmesi kapatır.

- **Korunan durum.** Yer değişirken iki panel de kompozisyonda yerinde kalır, destek paneli gizliyken de: hatırladıkları korunur. Gösterilmeyen bir panel yerleştirilmez; klavye ve ekran okuyucu onu atlar.

- **Hareketi azalt.** Destek paneli bir anda gelir ve gider.

- **Okuma yönü.** Destek paneli sondadır, sağdan sola okunan bir dilde soldadır ve orada soldan kayarak gelir.

- **Otomasyon.** İskelenin etiketi `SupportingPaneScaffold_<tagKey>`, panellerinki `SupportingPaneMain_<tagKey>` ve `SupportingPaneSupporting_<tagKey>`, tutamacınki `SupportingPaneHandle_<tagKey>`, sheet'in scrim'i ve kapatma düğmesininki `SupportingPaneScrim_<tagKey>` ve `SupportingPaneClose_<tagKey>`'dir.

İskele kendisine verilen yeri alır; bu yer iki yönde de sınırlı olmalıdır: bir ekranda `Modifier.fillMaxSize()`.

Parametreler:

- `state: SupportingPaneState`: destek panelinin gösterilip gösterilmediği ve genişliği: `rememberSupportingPaneState` onu yapılandırma değişince de korur.
- `main: @Composable SupportingPaneScope.() -> Unit`: ekranın ana içeriği.
- `supporting: @Composable SupportingPaneScope.() -> Unit`: onu destekleyen.
- `modifier: Modifier`: panellerin yeri.
- `mainTitle: String?`: ana içeriğin adı; görünür olurken ekran okuyucu için: "Rapor".
- `supportingTitle: String?`: destek panelinin adı: gösterildiği sheet'in başlığı ve görünür olurken ekran okuyucu için: "Yorumlar".
- `presentation: SupportingPanePresentation`: ana içeriğin yanında yer olmadığında destek panelinin nasıl gösterildiği.
- `resizable: Boolean`: ana içerik ile destek paneli arasındaki bir tutamacın destek panelini genişletip daraltmadığı.
- `style: SupportingPaneScaffoldStyle?`: iskelenin genişlikleri, temanınkilerin üstüne.
- `tagKey: String?`: iskelenin otomasyon etiketlerinin anahtarı.

### SupportingPaneState

`import com.pantrixui.components.container.supportingpane.SupportingPaneState`, `com.pantrixui:components` içinden

```kotlin
class SupportingPaneState(initiallyShownBeside: Boolean = true)
```

Bir `PantrixSupportingPaneScaffold`'un gösterdiği: destek panelinin ana içeriğin yanında durup durmadığı, yanında yer yokken ana içeriğin üstünde açık olup olmadığı ve ne kadar genişletildiği. Uygulama onu okur, değiştirir, yapılandırma değişince ve işlem sonlanınca da saklar: `rememberSupportingPaneState` kaydeder.

```kotlin
val comments = rememberSupportingPaneState()
PantrixSupportingPaneScaffold(
    state = comments,
    main = { Document(onComments = { comments.show() }) },
    supporting = { Comments() }
)
```

İkisi ayrı tutulur. Yerde ikisine de yer varsa destek paneli baştan ana içeriğin yanında durur, `hide` onu kaldırana kadar. Yer yoksa destek paneli `show` onu açana kadar kapalıdır. Böylece daralan bir pencere ana içeriğin üstünde kendiliğinden bir sheet açmaz, ana içeriğin üstünde açık olan destek paneli de pencere genişleyince yanında görünür kalır.

Parametreler:

- `initiallyShownBeside: Boolean`: destek panelinin başta, ikisine de yer olduğunda ana içeriğin yanında durup durmadığı.

Üyeleri:

- `isShownBeside: Boolean`: Yerde ikisine de yer olduğunda destek panelinin ana içeriğin yanında durup durmadığı.
- `isOpenOver: Boolean`: Ana içeriğin yanında yer olmadığında destek panelinin açık olup olmadığı: iskelenin sunumunun dediği gibi, üstünde bir sheet'te ya da yerinde. Başta kapalıdır.
- `supportingWidth: Dp`: Destek panelinin ana içeriğin yanında tutamacıyla ne kadar genişletildiği, ya da iskelenin stilinin dediği genişlikteyken `Dp.Unspecified`. Durumun geri kalanıyla saklanır; okurun genişliğini kendisi hatırlayan bir uygulama da onu ayarlar.
- `isShown: Boolean`: İskelenin yeri neyse ona göre destek panelinin görünüp görünmediği: ana içeriğin yanında ya da üstünde. İskele yerini ölçmeden önce, yer onu nereye koyarsa orada görünüp görünmeyeceği.
- `fun show()`: Destek panelini gösterir: yer varsa ana içeriğin yanında, yoksa üstünde. İskele yerini ölçmeden önce çağrılırsa, bir ekranın başındaki gibi, paneli yer onu nereye koyarsa orada gösterir.
- `fun hide()`: Destek panelini gizler: yer varsa ana içeriğin yanında, yoksa ana içeriğin üstünde kapatır. Ana içeriğin üstünde açıkken geri tuşu, Escape ve iOS'un kenardan kaydırması da bunu yapar. İskele yerini ölçmeden önce çağrılırsa paneli yer onu nereye koyarsa orada gizler.

Tipin kendisinde:

- `SupportingPaneState.Saver: Saver<SupportingPaneState, *>`: `rememberSupportingPaneState`'in bir durumu kaydettiği.

### rememberSupportingPaneState

`import com.pantrixui.components.container.supportingpane.rememberSupportingPaneState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberSupportingPaneState(initiallyShownBeside: Boolean = true): SupportingPaneState
```

Hatırlanan ve kaydedilen bir `SupportingPaneState`: destek panelinin gösterilip gösterilmediği ve genişliği, yapılandırma değişince ve işlem sonlanınca geri gelir.

Parametreler:

- `initiallyShownBeside: Boolean`: destek panelinin başta, ikisine de yer olduğunda ana içeriğin yanında durup durmadığı.

### SupportingPaneScope

`import com.pantrixui.components.container.supportingpane.SupportingPaneScope`, `com.pantrixui:components` içinden

```kotlin
interface SupportingPaneScope
```

Bir `PantrixSupportingPaneScaffold`'un her paneline içinde durduğu iskele hakkında söylenen.

Üyeleri:

- `state: SupportingPaneState`: İskelenin durumu: bir panelin destek panelini gösterip gizlediği.
- `supportingPlace: SupportingPanePlace`: İskelenin yeri neyse ona göre destek panelinin nerede olduğu: ana içeriğin yanında, üstünde bir sheet'te ya da onun yerine.
- `isSupportingShown: Boolean`: Destek panelinin bulunduğu yerde görünür olup olmadığı: onu gösterip gizleyen bir düğmenin söylediği.

### SupportingPanePlace

`import com.pantrixui.components.container.supportingpane.SupportingPanePlace`, `com.pantrixui:components` içinden

```kotlin
enum class SupportingPanePlace
```

İskelenin yeri neyse ona göre bir `PantrixSupportingPaneScaffold`'un destek panelinin nerede olduğu.

Değerleri:

- `Beside`: Ana içeriğin yanında, ya da masaya konmuş bir katlanabilirin kat yerinde onun altında: uygulamanın kendi bir düğmesiyle gizleyip gösterdiği, kendine ait bir panel.
- `Sheet`: Ana içeriğin üstünde, iskelenin sheet'inde, başlığının ve kapatma düğmesinin altında: kendisi bir başlık çizmez.
- `InPlaceOfMain`: Ana içeriğin yerinde: kendi barında `SupportingPaneState.hide`'ı çağıran bir geri düğmesi durur.

### SupportingPanePresentation

`import com.pantrixui.components.container.supportingpane.SupportingPanePresentation`, `com.pantrixui:components` içinden

```kotlin
enum class SupportingPanePresentation
```

Bir `PantrixSupportingPaneScaffold`'un, ana içeriğin yanında yer olmadığında destek panelini nasıl gösterdiği.

Değerleri:

- `Sheet`: İskelenin ana içeriğin üstüne çizdiği bir sheet'te, destek panelinin başlığının ve bir kapatma düğmesinin altında: `Compact` bir yerde alttan gelir ve tutamacı sürüklenince kapanır, daha geniş bir yerde sondan gelir.
- `Pane`: Ana içeriğin yerinde, üstüne sondan kayarak: geri ana içeriği geri getirir; destek panelinin kendi barında `SupportingPaneState.hide`'ı çağıran bir geri düğmesi durur.

### SupportingPaneScaffoldStyle

`import com.pantrixui.components.container.supportingpane.SupportingPaneScaffoldStyle`, `com.pantrixui:components` içinden

```kotlin
class SupportingPaneScaffoldStyle(
    public val supportingWidth: Dp = Dp.Unspecified,
    public val minSupportingWidth: Dp = Dp.Unspecified,
    public val minMainWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val handleWidth: Dp = Dp.Unspecified,
    public val handleHeight: Dp = Dp.Unspecified,
    public val handleTarget: Dp = Dp.Unspecified
) : PantrixStyle<SupportingPaneScaffoldStyle>
```

`PantrixSupportingPaneScaffold`'un ölçüleri: destek panelinin ana içeriğin yanında ne kadar geniş olduğu, tutamacın sürüklenmesinin onu ve ana içeriği en çok ne kadar daraltabileceği ve tutamacın kendisi.

Paneller arasındaki boşluk, varsayılanı olan yerleşimin oluğu gibi yoğunluğa uyar; genişlikler ve tutamaç uymaz. Panellerin renkleri stilin parçası değildir: her paneli, içine koyduğunun üstünde uygulama çizer. Destek paneli bir sheet'te gösterildiğinde onu sheet'in kendi stili çizer.

Parametreler:

- `supportingWidth: Dp`: Destek panelinin, tutamacı sürüklenene kadar ana içeriğin yanında ve yanında yer yokken gösterildiği yan sheet'te ne kadar geniş olduğu: bir telefonun genişliği, 360dp.
- `minSupportingWidth: Dp`: Tutamacın sürüklenmesinin destek panelini en çok daraltabileceği genişlik.
- `minMainWidth: Dp`: Ana içeriğin destek panelinin yanında en çok ne kadar daralabileceği: tutamacın sürüklenmesi ana içerik daha dar kalacağı yerde durur, ikisinin en dar hâline de yetmeyen bir yer destek panelini ana içeriğin üstünde gösterir.
- `gap: Dp`: Paneller arasında. Ön ayarlarda belirtilmemiştir: pencereyle büyüyen yerleşim oluğu, `PantrixTheme.layout.gutter`. Panelleri kenar kenara birleşen, aralarında kendi çizgisi olan bir marka 0dp verir.
- `handleWidth: Dp`: Genişliği değişebilen bir destek panelinin tutamacının boşlukta çizdiği işaret: kısa, dik bir çubuk.
- `handleHeight: Dp`: Tutamacın dik çubuğunun ne kadar uzun olduğu: ne kadar kalın olduğu `handleWidth`'tir.
- `handleTarget: Dp`: Bir parmağın ya da işaretçinin tutamacı yakaladığı şeridin genişliği; boşluğun ortasında durur, boşluk daha darsa panellerin kenarlarının üstüne taşar: parmak altında her platformun en küçük dokunma alanı, işaretçi altında dar bir şerit.

# Pencere sınıfları

Temanın verdiği pencere: içeriğin çizildiği pencerenin genişlik ve yükseklik sınıfı, boyutu ve cihazının katlanma duruşu. Kurulumu yoktur: `PantrixTheme` onu sağlar, temanın içindeki her composable `PantrixTheme.window` ile okur.

Cihaz ya da ekran değil, penceredir: bölünmüş ekranın yarısındaki, boyutu değiştirilmiş bir masaüstü penceresindeki ya da bir tarayıcı sekmesindeki uygulama o kadar geniştir. Bir düzen boyuta değil sınıfa sorar. Bu sayfadaki örnekler pencerenin o anki cevabını yazar: telefonu çevirince, masaüstünde ve tarayıcıda pencereyi daraltıp genişletince değerler değişir. Çoğu örneğin kartındaki pencere seçicisi aynı cevapları pencereye dokunmadan gösterir: "Dar", "Orta", "Kısa" ve "Geniş" o örneğe sabit bir pencere verir, "Gerçek" uygulamanınkini. Dördü dört ayrı genişlik sınıfındadır: `Compact`, `Medium`, `Expanded` ve `Large`. Katlanmaya bakan örneklerin seçicisinde "Kitap" ile "Masa" da durur: yarı açık tutulan, katlanan bir telefonun iç ekranı; kat yeri birinde dikey, ötekinde yataydır.

## Özellikler

- **Beş genişlik sınıfı.** `widthClass`: `Compact` 600 dp'den dar, `Medium` 600, `Expanded` 840, `Large` 1200, `ExtraLarge` 1600 dp'den itibaren. Sınıflar sıralıdır: "şu genişlikten itibaren" bir karşılaştırmadır, `widthClass >= WindowWidthClass.Expanded`.
- **Üç yükseklik sınıfı.** `heightClass`: `Compact` 480 dp'den kısa, `Medium` 480, `Expanded` 900 dp'den itibaren. Düzen önce genişliğe bakar; yükseklik, üst üste dizecek yer kalmadığını söyler.
- **Evet ya da hayır.** `isNarrow` genişlik sınıfının, `isShort` yükseklik sınıfının `Compact` olduğunu söyler: dikey tutulan telefon dardır, yatay tutulan kısadır.
- **Sınıfa göre değer.** `byWidth`, `byHeight` ve `byPosture` pencerenin sınıfına ya da duruşuna göre bir değer seçer: sütun sayısı, boşluk, yazı stili. Verilmeyen sınıf bir küçüğünün değerini alır.
- **Kısa yazım.** `responsive(...)` temanın penceresinin `byWidth`'idir: pencerenin kendisi gerekmeyen composable'da tek sözcük.
- **Sayfanın ölçüleri.** `PantrixTheme.layout` sayfanın kenar boşluğunu (`margin`), sütun arasını (`gutter`), ızgarasının sütun sayısını (`columns`) ve içeriğin en fazla genişliğini (`maxContentWidth`) pencerenin sınıfına göre verir; temanın yoğunluğu boşlukları ölçekler, sütun sayısını ve en fazla genişliği değil.
- **Sütunlara yayılmak.** `layout.spanWidth(available, span)` birkaç sütunluk bir parçanın genişliğidir; `Modifier.maxContentWidth()` içeriği temanın en fazla genişliğinde tutar, başta ya da ortada.
- **Kendi eşiğin.** `rememberWindowIsAtLeast(width)` sınıfların başlamadığı bir genişliği sorar ve yalnızca pencere o genişliği geçerken yeniden kurar.
- **Yeniden kurulma.** Sınıfı okuyan yalnızca sınıf değişince yeniden kurulur; `size` okuyan her değişimde.
- **Katlanma duruşu.** `posture` cihazın nasıl katlandığını söyler: kitap gibi (`isBook`), masadaki bir dizüstü gibi (`isTabletop`) ya da düz. Android'de, bunu bildiren tarayıcılarda ve iOS 27.1'den itibaren katlanan bir iPhone'da sistemden okunur; masaüstü bir katlanma bildirmez, orada duruş düzdür.
- **Dikey bar.** `verticalBar`, sistemin pencerenin bir kenarı boyunca dik duran bar'lar için ayırdığı sütundur: iPhone Duo'nun dış ekranında, iOS 27.1'den itibaren. Başka her ekranda null'dır. `rememberVerticalBarInNode()` sütunu bir düğümün kendi koordinatlarında verir; `PantrixScaffold` gezinmeyi ve üst bar'ın düğmelerini oraya koyar.
- **Kendi sınırların.** Sınıfların başladığı yer `PantrixBreakpoints`'tir; varsayılanı Android'in pencere boyutu sınıflarıdır. Ürün kendi sınırlarını `rememberPantrixWindow(breakpoints = ...)` ile temaya verir.

## Örnekler

### Genişlik ve yükseklik sınıfı

`PantrixTheme.window` pencereyi verir; bir düzen onun sınıfına sorar. Dikey tutulan bir telefonda genişlik `Compact`'tır; yatay çevrilince çoğu telefonda genişlik `Expanded`, yükseklik `Compact` olur. Bir masaüstü penceresi 1200 dp'den itibaren `Large`, 1600 dp'den itibaren `ExtraLarge`'dır: kenarından tutup daraltınca sınıflar sırayla değişir. Karttaki pencere seçicisinde "Dar" `Compact`, "Orta" `Medium`, "Kısa" `Expanded`, "Geniş" `Large` genişlik yazar; yükseklik "Kısa"da `Compact`, "Orta"da `Expanded`, öteki ikisinde `Medium`'dur.

Sınıfı okuyan composable yalnızca sınıf değişince yeniden kurulur: pencere bir sınıfın içinde büyüyüp küçülürken bu örnek yerinde durur. Son satır yükseklik sınıfına bakar: `WindowHeightClass.Compact` bir pencerede altta bir bar için yer yoktur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowHeightClass
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
PantrixText(text = "Genişlik sınıfı: ${window.widthClass.name}", tagKey = "width_class")
PantrixText(text = "Yükseklik sınıfı: ${window.heightClass.name}", tagKey = "height_class")
val bars = if (window.heightClass == WindowHeightClass.Compact) "alta bar dizilmez" else "alta bar dizilir"
PantrixText(text = "Yüksekliğe göre: $bars", tagKey = "bars_by_height")
```

### Dar mı, kısa mı

`isNarrow` genişlik sınıfının `Compact` olduğunu söyler: dikey tutulan telefon böyledir, tek panelli ve gezinmesi altta olan düzenin sorusudur. `isShort` yükseklik sınıfının `Compact` olduğunu söyler: yatay tutulan telefon böyledir; çoğu zaman geniştir ama alta bar dizecek yüksekliği yoktur.

Dikey telefonda ilki evet, ikincisi hayır yazar; telefonu yatay çevirince çoğu telefonda tersi olur. Masaüstünde pencereyi 600 dp'den dar ya da 480 dp'den kısa yapınca cevap değişir. Karttaki pencere seçicisinde "Dar" ilkine, "Kısa" ikincisine evet yazar; "Orta" ve "Geniş" ikisine de hayır. "Şu genişlikten itibaren" için sınıf karşılaştırılır: `widthClass >= WindowWidthClass.Expanded`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
PantrixText(text = "isNarrow: ${if (window.isNarrow) "evet" else "hayır"}", tagKey = "is_narrow")
PantrixText(text = "isShort: ${if (window.isShort) "evet" else "hayır"}", tagKey = "is_short")
```

### Sınıfa göre sütun sayısı

`byWidth` pencerenin genişlik sınıfına göre bir değer seçer. Burada sütun sayısı: `byWidth(compact = 2, medium = 4)` ile dar pencerede kutular ikişer, 600 dp'den itibaren dördü yan yana durur. Verilmeyen sınıf bir küçüğünün değerini alır: `Expanded` ve sonrası da 4'tür. Karttaki pencere seçicisinden "Dar" ve "Geniş"i dene, telefonu çevir ya da pencereyi 600 dp'nin altına daralt: dizilim değişir.

Kutuların arası, yanlarda da altta da, temanın sütun arasıdır: `PantrixTheme.layout.gutter`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.theme.PantrixTheme

val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
val gutter = PantrixTheme.layout.gutter
Column(verticalArrangement = Arrangement.spacedBy(gutter)) {
    KPIS.withIndex().chunked(columns).forEach { row ->
        Row(horizontalArrangement = Arrangement.spacedBy(gutter)) {
            row.forEach { (index, kpi) ->
                val (name, count) = kpi
                PantrixCard(
                    modifier = Modifier.weight(1f),
                    variant = CardVariant.Filled,
                    contentPadding = PaddingValues(PantrixTheme.spacing.md),
                    tagKey = "kpi_$index"
                ) {
                    PantrixText(text = count, style = PantrixTheme.typography.title)
                    PantrixText(text = name, style = PantrixTheme.typography.footnote)
                }
            }
        }
    }
}

private val KPIS = listOf("Uygulama" to "12", "Build" to "48", "Testçi" to "310", "Davet" to "5")
```

### Yüksekliğe göre değer

`byHeight` aynı işi yükseklik sınıfıyla yapar: yüksekliğin kıt olduğu yerde bir değeri küçültür. Burada bir barın yüksekliği: kısa pencerede 44 dp, ötekilerde 56 dp. Karttaki pencere seçicisinden "Kısa"yı seçince, telefonu yatay çevirince ya da pencereyi 480 dp'den kısa yapınca bar alçalır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byHeight
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
PantrixSurface(
    modifier = Modifier.fillMaxWidth().height(barHeight),
    color = PantrixTheme.colors.primary.container
) {
    PantrixText(
        text = "byHeight: ${barHeight.value.roundToInt()} dp yüksekliğinde bar",
        modifier = Modifier.align(Alignment.CenterStart).padding(horizontal = PantrixTheme.spacing.md),
        tagKey = "by_height"
    )
}
```

### Kısa yazım: responsive

`responsive(...)`, temanın penceresinin `byWidth`'idir, tek sözcükle: pencerenin kendisi gerekmeyen, tek bir değer isteyen composable'da kullanılır. Burada bir formun sütun sayısı: `Compact`'ta 1, `Medium`'dan itibaren 2, `Large`'dan itibaren 3. `Expanded` verilmedi, `Medium`'un değerini alır; `ExtraLarge` da `Large`'ınkini. Karttaki pencere seçicisinde "Dar" 1, "Orta" ve "Kısa" 2, "Geniş" 3 sütun yazar.

Yalnızca genişliğe bakar ve yalnızca bir composable'ın içinde çağrılır; yükseklik için pencereye sorulur. Çağıran, sınıf değişince yeniden kurulur; pencere sınıfın içinde boyut değiştirirken kurulmaz.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.responsive

val formColumns = responsive(compact = 1, medium = 2, large = 3)
PantrixText(text = "responsive: $formColumns sütunlu form", tagKey = "responsive")
```

### Düzen ölçüleri

`PantrixTheme.layout` sayfanın ölçülerini bu pencerenin sınıfı için verir; elle seçilmez. `margin` sayfanın yanlardaki boşluğudur: telefonda 16, 600 dp'den itibaren 24, 1200 dp'den itibaren 32 dp. Bu uygulamanın her sayfası içeriğini onunla içeri alır; pencere büyüdükçe sayfanın kenarları açılır. `gutter` sütunların ve yan yana panellerin arasındaki boşluktur: 16, 840 dp'den itibaren 24 dp. `columns` ızgaranın sütun sayısıdır: 4, 600 dp'den itibaren 8, 840 dp'den itibaren 12. `maxContentWidth` içeriğin en fazla genişliğidir: 1200 dp'ye kadar sınırsız, sonra 1040 dp. Karttaki pencere seçicisinden "Dar" ve "Geniş"i dene: sayılar büyür.

Kenar boşluğu ile sütun arası boşluktur: temanın yoğunluğu onları boşluk ölçeğiyle birlikte ölçekler. Sütun sayısı bir sayı, en fazla genişlik içeriğin ölçüsüdür; yoğunluk onları değiştirmez. "Ayarlar"dan yoğunluğu değiştir: ilk iki sayı değişir. Okuyan, pencerenin sınıfı değişince yeniden kurulur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.Dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.PantrixLayout
import com.pantrixui.foundation.adaptive.maxContentWidth
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val layout: PantrixLayout = PantrixTheme.layout
PantrixText(
    text = "layout.margin: ${layout.margin.value.roundToInt()} dp sayfa kenar boşluğu",
    tagKey = "layout_margin"
)
PantrixText(
    text = "layout.gutter: ${layout.gutter.value.roundToInt()} dp sütun arası",
    tagKey = "layout_gutter"
)
PantrixText(text = "layout.columns: ${layout.columns} sütunluk ızgara", tagKey = "layout_columns")
PantrixText(
    text = "layout.maxContentWidth: " + if (layout.maxContentWidth == Dp.Infinity) {
        "sınırsız"
    } else {
        "${layout.maxContentWidth.value.roundToInt()} dp"
    },
    tagKey = "layout_max_content_width"
)
```

### Sütun ızgarası

Sayfanın ızgarası: her şerit bir sütun, aralarında temanın sütun arası. `layout.columns` telefonda 4, 600 dp'den itibaren 8, 840 dp'den itibaren 12'dir; sütunlar sayfanın kenar boşluğunun içindeki yeri paylaşır. Karttaki pencere seçicisinden "Dar", "Orta" ve "Geniş"i dene: şeritlerin sayısı değişir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val layout = PantrixTheme.layout
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    Row(
        modifier = Modifier.fillMaxWidth().height(96.dp),
        horizontalArrangement = Arrangement.spacedBy(layout.gutter)
    ) {
        repeat(layout.columns) { index ->
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(colors.primary.container, PantrixTheme.shapes.sm),
                contentAlignment = Alignment.Center
            ) {
                PantrixText(
                    text = "${index + 1}",
                    style = PantrixTheme.typography.caption,
                    color = colors.primary.onContainer
                )
            }
        }
    }
    PantrixText(
        text = "${PantrixTheme.window.widthClass.name}: ${layout.columns} sütun, aralarında " +
            "${layout.gutter.value.roundToInt()} dp",
        style = PantrixTheme.typography.footnote,
        color = colors.textSecondary,
        tagKey = "grid_columns"
    )
}
```

### Sütunlara yayılan parçalar

`layout.spanWidth(available, span)` birkaç sütunluk bir parçanın genişliğini verir: sütunları ve aralarındaki sütun aralarıyla birlikte. Burada bir makale ve yanındaki bağlantılar. Telefonda ikisi de 4 sütundur, alt alta durur; 600 dp'den itibaren 5 ve 3 sütun, 840 dp'den itibaren 8 ve 4 sütun yan yana. Yan yana iki parça ve aralarındaki sütun arası satırı tam doldurur. Hangi parçanın kaç sütun olduğunu `byWidth` seçer.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val layout = PantrixTheme.layout
val (article, links) = PantrixTheme.window.byWidth(compact = 4 to 4, medium = 5 to 3, expanded = 8 to 4)
BoxWithConstraints(modifier = Modifier.fillMaxWidth()) {
    val articleWidth = layout.spanWidth(maxWidth, span = article)
    val linksWidth = layout.spanWidth(maxWidth, span = links)
    if (article + links <= layout.columns) {
        Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
            SpannedPart(name = "Makale", span = article, width = articleWidth, tagKey = "span_article")
            SpannedPart(name = "Bağlantılar", span = links, width = linksWidth, tagKey = "span_links")
        }
    } else {
        Column(verticalArrangement = Arrangement.spacedBy(layout.gutter)) {
            SpannedPart(name = "Makale", span = article, width = articleWidth, tagKey = "span_article")
            SpannedPart(name = "Bağlantılar", span = links, width = linksWidth, tagKey = "span_links")
        }
    }
}

@Composable
private fun SpannedPart(
    name: String,
    span: Int,
    width: Dp,
    tagKey: String
) {
    PantrixCard(
        modifier = Modifier.width(width),
        variant = CardVariant.Filled,
        contentPadding = PaddingValues(PantrixTheme.spacing.md),
        tagKey = tagKey
    ) {
        PantrixText(text = name, style = PantrixTheme.typography.title)
        PantrixText(
            text = "$span sütun · ${width.value.roundToInt()} dp",
            style = PantrixTheme.typography.footnote,
            tagKey = "${tagKey}_width"
        )
    }
}
```

### İçeriğin en fazla genişliği

`Modifier.maxContentWidth()` içeriği temanın en fazla genişliğinde tutar: 1200 dp'den geniş bir pencerede 1040 dp, daha darında sınırsız. Masaüstü penceresi boyunca uzanan bir satır okunmaz; geri kalan yer içeriğin yanında boş kalır. İçerik başa ya da ortaya hizalanır: başta, başlığıyla aynı hizada; ortada, iki yanında eşit boşlukla. Karttaki pencere seçicisinden "Geniş"i seç: yazı 1040 dp'de durur, çerçeve onun ötesine uzanır. "Orta"da yazı çerçeve kadar geniştir.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.maxContentWidth
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

var centred by rememberSaveable { mutableStateOf(false) }
val colors = PantrixTheme.colors
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSegmentButton(
        options = listOf(
            SegmentOption(false, "Başta", tagKey = "content_start"),
            SegmentOption(true, "Ortada", tagKey = "content_centre")
        ),
        selected = centred,
        onSelect = { centred = it },
        fullWidth = false,
        tagKey = "content_alignment"
    )
    // Sayfanın yeri: içerik onun içinde en fazla genişliğe kadar uzanır.
    Box(modifier = Modifier.fillMaxWidth().border(1.dp, colors.border, PantrixTheme.shapes.sm)) {
        PantrixSurface(
            modifier = Modifier.maxContentWidth(if (centred) Alignment.CenterHorizontally else Alignment.Start),
            color = colors.primary.container
        ) {
            PantrixText(
                text = "Bir paragraf masaüstü penceresi boyunca uzanırsa göz satırın sonundan bir sonrakinin " +
                    "başına dönerken yolunu kaybeder. İçerik bir genişlikte durur, pencerenin geri kalanı " +
                    "yanında boş kalır.",
                modifier = Modifier.padding(PantrixTheme.spacing.md),
                color = colors.primary.onContainer,
                tagKey = "content_text"
            )
        }
    }
    val widest = PantrixTheme.layout.maxContentWidth
    PantrixText(
        text = "${PantrixTheme.window.widthClass.name}: en fazla " +
            if (widest == Dp.Infinity) "sınırsız" else "${widest.value.roundToInt()} dp",
        style = PantrixTheme.typography.footnote,
        color = colors.textSecondary,
        tagKey = "content_width"
    )
}
```

### Sınıflara uymayan bir eşik

`rememberWindowIsAtLeast(1000.dp)`: pencere en az 1000 dp geniş mi. 840'ta başlayan `Expanded`'ın da 1200'de başlayan `Large`'ın da karşılamadığı, bir ekrana özgü eşik içindir. Masaüstünde pencerenin kenarını 1000 dp'nin iki yanına sürükle: cevap orada değişir. Karttaki pencere seçicisinde "Dar", "Orta" ve "Kısa" hayır, "Geniş" evet yazar.

Bu composable yalnızca pencere 1000 dp'yi geçerken yeniden kurulur; aynı soruyu `window.size.width >= 1000.dp` diye sormak onu her boyutta yeniden kurardı.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.rememberWindowIsAtLeast

val threeColumns = rememberWindowIsAtLeast(1000.dp)
PantrixText(
    text = "rememberWindowIsAtLeast(1000.dp): ${if (threeColumns) "evet, üç sütun" else "hayır, iki sütun"}",
    tagKey = "at_least_1000"
)
```

### Pencerenin boyutu

`size` pencerenin boyutudur. Onu okuyan her değişimi izler: bir dönüşün her karesinde, sürüklenen pencere kenarının her pikselinde yeniden kurulur. Bu yüzden bir düzen kararı için okunmaz. Burada yalnızca gösterilir; bu örnek kendi composable'ında okuduğu için sayfanın gerisi pencere sürüklenirken yerinde durur.

`isSizeKnown`, platform boyutu söyleyene kadar false'tur. Android ve iOS boyutu baştan söyler; masaüstünde ve web'de içerik ilk kez, pencerenin boyutu gelmeden kurulur ve o an pencere iki yönde de `Compact` okunur. Bir kez verilip saklanan bir karar, bir başlangıç sayfası gibi, bunu bekler.

Karttaki pencere seçicisinin "Dar", "Orta", "Kısa" ve "Geniş" pencereleri sabit birer boyuttur: burada o boyut yazar ve baştan bilinir.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val window = PantrixTheme.window
val size = window.size
// Boyut bilinmeden yazılacak sayı sıfırdır; onun yerine bilinmediği yazılır.
val words = if (window.isSizeKnown) {
    "${size.width.value.roundToInt()} × ${size.height.value.roundToInt()} dp"
} else {
    "henüz bilinmiyor"
}
PantrixText(text = "Boyut: $words", tagKey = "size")
PantrixText(text = "isSizeKnown: ${if (window.isSizeKnown) "evet" else "hayır"}", tagKey = "is_size_known")
```

### Katlanma duruşu

`posture` cihazın nasıl katlandığını söyler. Düzen iki duruş için yazılır: `isBook` yarı açık ve kat yeri dikey (yan yana iki panel, kat yerinden bölünmüş), `isTabletop` yarı açık ve kat yeri yatay (bakılacaklar üstte, kontroller altta). Düz açılmış tek ekranlı bir katlanabilirde kat yeri vardır ama hiçbir şeyi ayırmaz; iki ekranlı bir cihazın menteşesi düz açıkken de pencereyi ayırır (`separatingFold`).

`byPosture` duruşa göre bir değer seçer; verilmeyen duruş `flat`'in değerini alır, yani katlanmayan cihazda hiçbir şey değişmez. Katlanmayan bir telefonda ve masaüstünde burada "Düz" ve "tek parça" yazar; ötekiler katlanabilir bir Android cihazda ya da emülatöründe, iOS 27.1'in iPhone Duo'sunda görülür. Karttaki pencere seçicisinden "Kitap" ile "Masa"yı seç: ikisi de yarı açık bir kat yeri olan sabit bir penceredir. Son satır yine gerçeği yazar: sistemin söylediği, örneğe verilen pencereden bağımsızdır.

Her kat yeri bir `WindowFold`'dur: yönü, yarı açık olup olmadığı, pencereyi ayırıp ayırmadığı, bir şeyi örtüp örtmediği. Temanın penceresi duruşu sistemden okur, `systemWindowPosture()`; son satır onu doğrudan sorar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowFold
import com.pantrixui.foundation.adaptive.WindowPosture
import com.pantrixui.foundation.adaptive.byPosture
import com.pantrixui.foundation.adaptive.systemWindowPosture
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
val posture: WindowPosture = window.posture
val named = when {
    posture.isBook -> "Kitap (yarı açık, kat yeri dikey)"
    posture.isTabletop -> "Masa (yarı açık, kat yeri yatay)"
    posture.separatingFold != null -> "Düz, iki ekran (menteşe pencereyi ayırıyor)"
    posture.folds.isNotEmpty() -> "Düz (kat yeri var, ekran tek parça)"
    else -> "Düz"
}
// İki yarının dizilişi duruşa göre: kitapta yan yana, masada alt alta, öteki her durumda tek parça.
val halves = window.byPosture(flat = "tek parça", book = "yan yana iki yarı", tabletop = "alt alta iki yarı")
PantrixText(text = "Duruş: $named", tagKey = "posture")
PantrixText(text = "byPosture: $halves", tagKey = "by_posture")
posture.folds.forEach { fold: WindowFold ->
    PantrixText(
        text = "Kat yeri: ${fold.orientation.name}, yarı açık: ${if (fold.isHalfOpened) "evet" else "hayır"}, " +
            "ayırıyor: ${if (fold.isSeparating) "evet" else "hayır"}, örtüyor: ${if (fold.isOccluding) "evet" else "hayır"}",
        style = PantrixTheme.typography.footnote
    )
}
PantrixText(
    text = "Sistemin söylediği kat yeri sayısı: ${systemWindowPosture().folds.size}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

### Sistemin dikey bar'ı

iPhone Duo'nun dış ekranında, iOS 27.1'den itibaren, sistem pencerenin bir kenarı boyunca dik duran bar'lar için bir sütun ayırır: tepesinde durum çubuğu, altında uygulamanın bar'ları. Pencere bunu `verticalBar` ile söyler, bir `WindowVerticalBar`: sütunun kendisi (`bounds`) ve bar'ların yeri (`barBounds`), pencerenin pikselleriyle. Başka her ekranda null'dır. Karttaki pencere seçicisinden "Kapak"ı seç.

Bir düzen sütunun kendine göre nerede olduğunu `rememberVerticalBarInNode()` ile sorar: düğümüne `modifier`'ını koyar, `verticalBar` o düğümün koordinatlarında gelir; düğüm sütuna uzanmıyorsa null'dır. Kutuda sütun soluk bir dolguyla, bar'ların yeri bir çerçeveyle çizilir. `PantrixScaffold` gezinmeyi ve üst bar'ın düğmelerini oraya böyle koyar.

Son satır sistemin söylediğini doğrudan sorar, `systemVerticalBar()`: örneğe verilen pencereden bağımsızdır ve yalnızca Duo'nun dış ekranında bir sütun söyler. Bir önizleme ya da test, sütunu olan bir ekranı `PantrixWindow(size, verticalBar = WindowVerticalBar(...))` ile kurar; karttaki "Kapak" böyle kurulmuştur.

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.VerticalBarInNode
import com.pantrixui.foundation.adaptive.WindowVerticalBar
import com.pantrixui.foundation.adaptive.rememberVerticalBarInNode
import com.pantrixui.foundation.adaptive.systemVerticalBar
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val density = LocalDensity.current
val bar: WindowVerticalBar? = PantrixTheme.window.verticalBar
val said = bar?.let {
    with(density) {
        "${it.bounds.width.toDp().value.roundToInt()} dp'lik bir sütun; bar'ların yeri " +
            "${it.barBounds.top.toDp().value.roundToInt()} ile ${it.barBounds.bottom.toDp().value.roundToInt()} dp arası"
    }
}
PantrixText(text = "Dikey bar: ${said ?: "yok"}", tagKey = "vertical_bar")
val inNode: VerticalBarInNode = rememberVerticalBarInNode()
val column = PantrixTheme.colors.textPrimary.copy(alpha = 0.08f)
val place = PantrixTheme.colors.primary.color
Box(
    modifier = Modifier
        .fillMaxWidth()
        .height(400.dp)
        .then(inNode.modifier)
        .border(1.dp, PantrixTheme.colors.divider)
        .clipToBounds()
        .drawBehind {
            inNode.verticalBar?.let { here ->
                drawRect(color = column, topLeft = here.bounds.topLeft, size = here.bounds.size)
                drawRect(
                    color = place,
                    topLeft = here.barBounds.topLeft,
                    size = here.barBounds.size,
                    style = Stroke(width = 1.dp.toPx())
                )
            }
        }
) {
    PantrixText(
        text = if (inNode.verticalBar == null) "Kutu sütuna uzanmıyor" else "Kutu sütuna uzanıyor",
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        tagKey = "bar_in_box"
    )
}
PantrixText(
    text = "Sistemin söylediği: ${if (systemVerticalBar() == null) "dikey bar yok" else "dikey bar var"}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary
)
```

### Bu pencerede bir düzenin seçeceği

Yardımcılar bir araya gelince: bir düzen bu pencerede neyi seçerdi. Gezinmenin yeri, panel sayısı ve ana eylemin yeri. Kurallar bu örneğin kodundadır ve bir ürünün düzeni için örnektir; kütüphanenin kuralı değildir.

Dikey telefonda altta sekme bar'ı, tek panel ve altta sabit bir eylem bar'ı yazar. Yatay çevrilince gezinme yana geçer ve eylem başlığa çıkar: kısa pencerede alta bar dizilmez. 840 dp'den itibaren liste ve detay yan yana gelir; 1200 dp'den itibaren gezinme bir sidebar, düzen bir web sayfasınınki olur. Karttaki pencere seçicisinden "Dar", "Orta", "Kısa" ve "Geniş"i dene: dördünde de başka bir düzen yazar. Kitap duruşunda iki panel tam kat yerinden ayrılır; iki ekranlı bir cihazın dikey menteşesi düz açıkken de panelleri orada ayırır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.FoldOrientation
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.byPosture
import com.pantrixui.foundation.adaptive.byWidth
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
// Masa duruşunda alt yarı kontrollerin yeridir. Kısa pencerede ray yanda kalır ama sekme bar'ının beş öğesini
// taşır: daha fazlası o yüksekliğe sığmaz.
val navigation = when {
    window.posture.isTabletop -> "Alt yarıda sekme bar'ı"
    window.isNarrow -> "Altta sekme bar'ı"
    window.isShort -> "Yanda ray, beş öğeyle (kısa pencere)"
    window.widthClass >= WindowWidthClass.Large -> "Sidebar ve üst bar"
    else -> "Yanda etiketli ray"
}
// Panel sayısı: önce duruşa, düz pencerede genişliğe göre. İki yardımcı iç içe: `byPosture`'ın `flat` değerini
// `byWidth` seçer.
val atTheHinge = "İki panel, kat yerinden bölünmüş"
val hingeBetweenScreens = window.posture.separatingFold?.orientation == FoldOrientation.Vertical
val byItsWidth = window.byWidth(
    compact = "Tek panel; detay üstüne açılır",
    medium = "Tek, geniş panel",
    expanded = "Liste (340 dp) ve detay yan yana",
    large = "Web sayfa düzeni"
)
val panes = window.byPosture(
    flat = if (hingeBetweenScreens) atTheHinge else byItsWidth,
    book = atTheHinge,
    tabletop = "Üst yarı bakılacaklar, alt yarı kontroller"
)
// Ana eylem yalnızca dikey telefonda altta sabit durur.
val mainAction = if (window.isNarrow && !window.isShort) "Altta sabit bar" else "Başlıktaki düğme"
PantrixText(text = "Gezinme: $navigation", tagKey = "navigation")
PantrixText(text = "Paneller: $panes", tagKey = "panes")
PantrixText(text = "Ana eylem: $mainAction", tagKey = "main_action")
```

### Kendi sınırlarıyla sınıflanan pencere

Sınıfların sınırları `PantrixBreakpoints`'tir. Varsayılanı Android'in pencere boyutu sınıflarıdır: genişlikte 600, 840, 1200 ve 1600 dp, yükseklikte 480 ve 900 dp. Düzenleri başka genişliklerde değişen bir ürün kendi sınırlarını temaya verir, `PantrixTheme(window = rememberPantrixWindow(breakpoints = ...))`, ve her yardımcı onlara uyar.

Burada aynı genişlik iki sınırla sınıflanır: temanın penceresininkilerle ve `Medium`'u 360 dp'de başlayan bir ürününkilerle. Dikey tutulan, en az 360 dp genişliğindeki bir telefon ilkinde `Compact`, ikincisinde `Medium`'dur; 600 dp'den itibaren ikisi aynı cevabı verir. Karttaki pencere seçicisinde "Dar" böyle bir telefondur; "Geniş"te iki satır da `Large` yazar.

```kotlin
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.PantrixBreakpoints
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
val own = PantrixBreakpoints(medium = 360.dp)
PantrixText(text = "Temanın sınırlarıyla: ${window.widthClass.name}", tagKey = "theme_breakpoints")
// Elle sınıflamak boyutu okur: bu örnek pencerenin her boyutunda yeniden kurulur. Bir ürün bunu yapmaz, sınırlarını
// temaya verir.
PantrixText(
    text = "Medium 360 dp'de başlarsa: ${own.widthClassOf(window.size.width).name}",
    tagKey = "own_breakpoints"
)
```

### Kendi sınırların ve düzen ölçülerin

Bir ürünün kendi sınırları ve kendi düzen ölçüleri, bir temada. İçteki temaya `rememberPantrixWindow(breakpoints = …)` ile `Medium`'u 360 dp'de başlayan bir pencere ve `PantrixLayouts(…)` ile kendi kenar boşlukları verildi: 360 dp'lik bir telefon orada `Medium`'dur ve sayfanın kenarı 28 dp'dir. Son satır kütüphanenin kendi ölçülerini (`rememberPantrixLayouts()`) ve temanın ölçülerini doğrudan (`LocalPantrixLayouts`) okur.

Bu örneğin kartında pencere seçicisi yoktur: içteki tema pencereyi kendisi, cihazdan okur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.LocalPantrixLayouts
import com.pantrixui.foundation.adaptive.PantrixBreakpoints
import com.pantrixui.foundation.adaptive.PantrixLayout
import com.pantrixui.foundation.adaptive.PantrixLayouts
import com.pantrixui.foundation.adaptive.rememberPantrixLayouts
import com.pantrixui.foundation.adaptive.rememberPantrixWindow
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val library = rememberPantrixLayouts()
val window = rememberPantrixWindow(breakpoints = PantrixBreakpoints(medium = 360.dp))
PantrixTheme(window = window, layouts = OWN_LAYOUTS) {
    PantrixText(text = "Genişlik sınıfı: ${PantrixTheme.window.widthClass.name}", tagKey = "own_width_class")
    PantrixText(text = "Sayfanın kenarı: ${PantrixTheme.layout.margin.value.roundToInt()} dp", tagKey = "own_margin")
    PantrixText(
        text = "Kütüphanenin Medium kenarı: ${library.medium.margin.value.roundToInt()} dp · bu temanın: " +
            "${LocalPantrixLayouts.current.medium.margin.value.roundToInt()} dp",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

private val OWN_LAYOUTS = PantrixLayouts(
    compact = PantrixLayout(margin = 20.dp, gutter = 12.dp),
    medium = PantrixLayout(margin = 28.dp, gutter = 16.dp),
    expanded = PantrixLayout(margin = 32.dp, gutter = 20.dp)
)
```

## API

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixWindow
```

İçeriğin çizildiği pencere, bir düzenin bilmesi gereken hâliyle: ne kadar geniş ve ne kadar yüksek olduğu, cihazının nasıl katlandığı. `PantrixTheme` onu sağlar, `PantrixTheme.window` okur: kurulumu yoktur.

Cihaz ya da ekran değil, penceredir: bölünmüş ekranın yarısındaki, boyutu değiştirilmiş bir masaüstü penceresindeki ya da bir tarayıcı sekmesindeki uygulama o kadar geniştir. Bir düzen boyuta değil sınıfa sorar:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

Tema durduğu sürece pencere tek bir nesnedir ve değerleri sorulduğunda okunur. `widthClass` ya da `heightClass` okuyan, sınıf değişince yeniden kurulur, daha önce değil. `size` okuyan her değişimi izler: bir dönüşün her karesini, sürüklenen pencere kenarının her pikselini.

Kendi başına bir panel olan bileşen, bir scaffold ya da bir sheet, pencereye sormaz, kendisine verilen yeri ölçer: dar bir panelin içinde pencere yine geniştir. `BoxWithPantrixWindow` bir bileşene o yeri bir pencere olarak söyler.

Masaüstünde ve web'de içerik ilk kez kurulurken pencerenin henüz boyutu yoktur ve o tek kompozisyon Compact bir pencere bulur. Android ve iOS boyutu baştan söyler. Sınıf kullanıldığı yerde okunur, başta ne olduğu saklanmaz.

Üyeleri:

- `size: DpSize`: Pencerenin boyutu. Android'de sistem çubuklarıyla birlikte penceredir, web'de uygulamanın çizildiği kutu. Platform söyleyene kadar sıfırdır ya da belirtilmemiştir: sınıflar o zamana kadar Compact'tır.
- `isSizeKnown: Boolean`: Platform pencerenin boyutunu söyledi mi: hem genişliğini hem yüksekliğini.

  Android'de ve iOS'ta ilk kompozisyondan itibaren true'dur. Masaüstünde ve web'de ilk kompozisyonda false'tur: içerik orada pencerenin boyutu gelmeden bir kez kurulur. Sonraki kompozisyondan itibaren true'dur. O zamana kadar pencere iki yönde de Compact okunur, bu yüzden bir kez verilip saklanan her karar, bir başlangıç sayfası ya da hatırlanan bir seçim, bunu bekler:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  Okuyan, cevap değişince yeniden kurulur; pencere boyut değiştirirken kurulmaz.
- `widthClass: WindowWidthClass`: Pencerenin genişlik sınıfı: düzen buna göre seçilir.
- `heightClass: WindowHeightClass`: Pencerenin yükseklik sınıfı: `WindowHeightClass.Compact` yatay tutulan bir telefondur.
- `posture: WindowPosture`: Pencerenin cihazının nasıl katlandığı. Kat yeri olmayan yerde `WindowPosture.Flat`'tir.
- `verticalBar: WindowVerticalBar?`: Sistemin pencerenin bir kenarı boyunca dik duran bar'lar için ayırdığı sütun, ya da ayırmadığı yerde null: iPhone Duo'nun dış ekranı dışında her ekranda olduğu gibi. Yerleri pencerenin koordinatlarındadır: bir düzen onun kendi yanında nerede durduğunu `rememberVerticalBarInNode` ile sorar.
- `breakpoints: PantrixBreakpoints`: Bu pencerenin sınıflarının başladığı yer: pencerenin sınıflandığı sınırlar. Elle sınıflanan bir boyut da aynı sınırlara uyar, `BoxWithPantrixWindow`'un bir bileşene verilen yeri sınıflaması gibi:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

Değerleri sabit bir pencere, gerçeğinin doğru cevabı vermediği yerler için: bir düzenin belli bir boyuttaki testi ya da önizlemesi ve native bir ekranın bir parçasına gömülen Compose. Orada yer o parçanındır.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

Pikselle verilen bir `verticalBar`, sistemin sütunu olan bir ekranın, iPhone Duo'nun dış ekranının nasıl göründüğünü, sütunun olmadığı yerde çizer.

Parametreler:

- `size: DpSize`: pencerenin boyutu; genişlik ve yükseklik sınıfları ondan gelir.
- `posture: WindowPosture`: pencerenin cihazının nasıl katlandığı: bir kat verilmedikçe düz, katı olmayan her cihaz gibi.
- `breakpoints: PantrixBreakpoints`: her sınıfın başladığı genişlikler ve yükseklikler: ürünün kendi sınırları yoksa Android'in pencere boyutu sınıfları.
- `verticalBar: WindowVerticalBar?`

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Pencere dar mı: genişlik sınıfı `WindowWidthClass.Compact` mı. Dikey tutulan telefon böyledir. Tek panelli ve gezinmesi altta olan düzenin sorusudur.

`widthClass == WindowWidthClass.Compact` için bir addır, kod uyduğu kural gibi okunsun diye: `if (window.isNarrow) BottomBar()`. "Şu genişlikten itibaren" için sınıf karşılaştırılır: `widthClass >= Expanded`.

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isShort: Boolean
```

Pencere kısa mı: yükseklik sınıfı `WindowHeightClass.Compact` mı. Yatay tutulan telefon böyledir. Böyle bir pencere çoğu zaman geniştir, genişliğine göre Medium ya da Expanded'dır, ama bar'ları üst üste dizecek yüksekliği yoktur: ana eylem alttaki bir bar'a değil başlığa gider ve alt kenardan hiçbir şey açılmaz.

`heightClass == WindowHeightClass.Compact` için bir addır:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

Bu pencerenin genişlik sınıfı için verilen değer. Verilmeyen sınıf bir küçüğünün değerini alır, bu yüzden bir düzen yalnızca değiştiği genişlikleri yazar:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parametreler:

- `compact: T`: Compact bir pencerede, en dar sınıfta değer.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede değer; verilmezse `medium`'unki.
- `large: T`: Large bir pencerede değer; verilmezse `expanded`'ınki.
- `extraLarge: T`: ExtraLarge bir pencerede, en geniş sınıfta değer; verilmezse `large`'ınki.

### PantrixWindow.byHeight

`import com.pantrixui.foundation.adaptive.byHeight`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byHeight(
    compact: T,
    medium: T = compact,
    expanded: T = medium
): T
```

Bu pencerenin yükseklik sınıfı için verilen değer. Verilmeyen sınıf bir küçüğünün değerini alır:

```kotlin
val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
```

Parametreler:

- `compact: T`: Compact bir pencerede, en kısa sınıfta değer: yan tutulan bir telefon.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede, en uzun sınıfta değer; verilmezse `medium`'unki.

### PantrixWindow.byPosture

`import com.pantrixui.foundation.adaptive.byPosture`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byPosture(
    flat: T,
    book: T = flat,
    tabletop: T = flat
): T
```

Bu pencerenin duruşu için verilen değer: cihaz kitap gibi yarı açık ve kat yeri dikey tutulurken `book`, masadaki bir dizüstü gibi kat yeri yatay tutulurken `tabletop`, geri kalan zamanda `flat`. Bu da kat yeri olmayan her cihaz ve düz açılmış bir katlanabilir demektir. Verilmeyen duruş `flat`'in değerini alır, bu yüzden bir düzen yalnızca değiştiği duruşları yazar:

```kotlin
// Two panes side by side in a book, one above the other on a table, and one pane otherwise.
val panes = PantrixTheme.window.byPosture(flat = Panes.One, book = Panes.SideBySide, tabletop = Panes.Stacked)
```

Aynı anda iki yönde de katlanmış bir cihaz kitap sayılır. `byWidth` ve `byHeight` ile aynı ailenin üçüncüsüdür.

Parametreler:

- `flat: T`
- `book: T`
- `tabletop: T`

### responsive

`import com.pantrixui.foundation.adaptive.responsive`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun <T> responsive(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

Geçerli pencerenin genişlik sınıfı için verilen değer: `PantrixTheme.window`'un `byWidth`'i, tek sözcükle. Pencereye değil bir değere ihtiyacı olan composable içindir. Verilmeyen sınıf bir küçüğünün değerini alır:

```kotlin
val columns = responsive(compact = 2, medium = 4)
val cardPadding = responsive(compact = 12.dp, medium = 16.dp, large = 20.dp)
```

Sayfanın kenar boşluğu ve sütun arası elle seçilmez: `PantrixTheme.layout` onları sınıfa göre verir. Çağıran, sınıf değişince yeniden kurulur; pencere sınıfın içinde boyut değiştirirken kurulmaz. Yalnızca genişliğe bakar. Yükseklik için ve bir composable'ın dışında pencereye sorulur: `byHeight`, `byWidth`.

Parametreler:

- `compact: T`: Compact bir pencerede, en dar sınıfta değer.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede değer; verilmezse `medium`'unki.
- `large: T`: Large bir pencerede değer; verilmezse `expanded`'ınki.
- `extraLarge: T`: ExtraLarge bir pencerede, en geniş sınıfta değer; verilmezse `large`'ınki.

### rememberWindowIsAtLeast

`import com.pantrixui.foundation.adaptive.rememberWindowIsAtLeast`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberWindowIsAtLeast(width: Dp): Boolean
```

Geçerli pencere en az `width` genişliğinde mi: hiçbir sınıfın başlamadığı bir genişlikte değişen düzen içindir.

```kotlin
// A third column from 1000dp on, which is neither Expanded's 840 nor Large's 1200.
val threeColumns = rememberWindowIsAtLeast(1000.dp)
```

Çağıran, pencere `width`'i hangi yönde olursa olsun geçerken yeniden kurulur; pencere onun bir yanında boyut değiştirirken kurulmaz. `PantrixTheme.window.size.width >= width` aynı şeyi sorar ve onu okuyan her boyutta yeniden kurulur: bir dönüşün her karesinde, sürüklenen pencere kenarının her pikselinde.

Pencerenin boyutu bilinmezken genişliği sıfır sayılır, yani cevap false'tur. Bir ürünün bütün düzenleri aynı genişliklerde değişiyorsa bunun yerine o genişlikler pencereye verilir: `PantrixBreakpoints`.

Parametreler:

- `width: Dp`

### rememberPantrixWindow

`import com.pantrixui.foundation.adaptive.rememberPantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixWindow(
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    posture: WindowPosture = systemWindowPosture(),
    verticalBar: WindowVerticalBar? = systemVerticalBar()
): PantrixWindow
```

Compose'un bildirdiği pencere; `breakpoints` ile sınıflanır, `posture`'ın dediği gibi katlanır ve sistemin `verticalBar`'ı vardır: `PantrixTheme`'in kendisine pencere verilmediğinde sağladığı.

Ürünün kendi sınırlarıyla sınıflamak ya da sistemin bildirmediği bir katlanmayı bildirmek için temaya verilir:

```kotlin
PantrixTheme(window = rememberPantrixWindow(breakpoints = PantrixBreakpoints(medium = 640.dp))) { … }
```

Pencere, `posture` ve `verticalBar` değişirken aynı nesne kalır; `breakpoints` değiştiğinde yenisi kurulur.

Parametreler:

- `breakpoints: PantrixBreakpoints`
- `posture: WindowPosture`
- `verticalBar: WindowVerticalBar?`

### systemWindowPosture

`import com.pantrixui.foundation.adaptive.systemWindowPosture`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemWindowPosture(): WindowPosture
```

Sistemin bu pencere için bildirdiği duruş. Cihaz katlandıkça, açıldıkça ve döndürüldükçe izlenir.

Android katlanmayı Jetpack WindowManager ile, tarayıcı Chromium'da bulunan Device Posture ve Viewport Segments API'leriyle, iOS ise 27.1'den itibaren UIKit'in menteşesi ve ayrılmış bölgeleriyle bildirir. Masaüstü bir katlanma bildirmez; 27.1'den önceki bir iOS ve 27.1'den önceki bir Xcode ile derlenmiş bir kütüphane de bildirmez: orada duruş `WindowPosture.Flat`'tir. Katlanmayı kendi yoluyla okuyan bir uygulama, duruşunu bunun yerine `rememberPantrixWindow`'a verir.

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowWidthClass
```

Bir pencerenin ne kadar geniş olduğu, beş sınıftan biri olarak. Bir düzen bu sınıfa göre seçer: gezinmesinin biçimini, panel sayısını, bir ızgaranın sütunlarını.

Sınıflar sıralıdır, bu yüzden bir genişlikten itibaren geçerli olan kural bir karşılaştırmadır: `widthClass >= WindowWidthClass.Expanded`. Her birinin nerede başladığını `PantrixBreakpoints` söyler.

Değerleri:

- `Compact`: 600dp'den dar: dikey tutulan bir telefon, bir katlanabilirin kapak ekranı, dar bir tarayıcı penceresi.
- `Medium`: 600dp'den itibaren: açık bir katlanabilir, dikey tutulan bir tablet, bölünmüş ekran.
- `Expanded`: 840dp'den itibaren: yatay tutulan bir tablet ve yatay tutulan çoğu telefon (bkz. `WindowHeightClass.Compact`).
- `Large`: 1200dp'den itibaren: bir masaüstü penceresi, bir tarayıcı, büyük bir tablet.
- `ExtraLarge`: 1600dp'den itibaren: geniş bir masaüstü penceresi, harici bir ekran.

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowHeightClass
```

Bir pencerenin ne kadar yüksek olduğu, üç sınıftan biri olarak.

Bir düzen önce genişliğe bakar. Yükseklik, üst üste dizecek yer kalmadığını söyler: `Compact` bir pencere yatay tutulan bir telefondur, bir tablet kadar geniştir ve yüksekliği onun yarısından azdır. Orada ekran boyunca uzanan her bar ekranın yedide birini alır.

Değerleri:

- `Compact`: 480dp'den kısa: yatay tutulan bir telefon.
- `Medium`: 480dp'den itibaren: dikey tutulan çoğu telefon, yatay tutulan bir tablet.
- `Expanded`: 900dp'den itibaren: dikey tutulan bir tablet, bir masaüstü penceresi ve dikey tutulan uzun bir telefon.

### FoldOrientation

`import com.pantrixui.foundation.adaptive.FoldOrientation`, `com.pantrixui:foundation` içinden

```kotlin
enum class FoldOrientation
```

Bir kat yerinin penceresini hangi yönde kestiği.

Değerleri:

- `Vertical`: Pencerenin üstünden altına: iki yarı yan yanadır.
- `Horizontal`: Pencerenin bir yanından ötekine: yarılardan biri ötekinin üstündedir.

### PantrixBreakpoints

`import com.pantrixui.foundation.adaptive.PantrixBreakpoints`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixBreakpoints(
    public val medium: Dp = 600.dp,
    public val expanded: Dp = 840.dp,
    public val large: Dp = 1200.dp,
    public val extraLarge: Dp = 1600.dp,
    public val heightMedium: Dp = 480.dp,
    public val heightExpanded: Dp = 900.dp
)
```

Her pencere sınıfının başladığı yer: Medium, Expanded, Large ve ExtraLarge bir pencerenin en küçük genişliği, Medium ve Expanded bir pencerenin en küçük yüksekliği. `medium`'dan dar bir pencere Compact'tır, `heightMedium`'dan kısa olan da öyle.

Varsayılanlar Android'in pencere boyutu sınıflarıdır. Düzenleri başka yerlerde değişen bir ürün kendi sınırlarını `rememberPantrixWindow`'a verir.

Parametreler:

- `medium: Dp`: `WindowWidthClass.Medium` bir pencerenin en küçük genişliği.
- `expanded: Dp`: `WindowWidthClass.Expanded` bir pencerenin en küçük genişliği.
- `large: Dp`: `WindowWidthClass.Large` bir pencerenin en küçük genişliği.
- `extraLarge: Dp`: `WindowWidthClass.ExtraLarge` bir pencerenin en küçük genişliği.
- `heightMedium: Dp`: `WindowHeightClass.Medium` bir pencerenin en küçük yüksekliği.
- `heightExpanded: Dp`: `WindowHeightClass.Expanded` bir pencerenin en küçük yüksekliği.

Üyeleri:

- `fun widthClassOf(width: Dp): WindowWidthClass`: `width` genişliğindeki bir pencerenin sınıfı: en küçük genişliğine ulaştığı en yüksek sınıf. Henüz bilinmeyen bir genişlik, sıfır ya da belirtilmemiş, Compact'tır.
- `fun heightClassOf(height: Dp): WindowHeightClass`: `height` yüksekliğindeki bir pencerenin sınıfı: en küçük yüksekliğine ulaştığı en yüksek sınıf. Henüz bilinmeyen bir yükseklik, sıfır ya da belirtilmemiş, Compact'tır.

Tipin kendisinde:

- `PantrixBreakpoints.Default: PantrixBreakpoints`: 600, 840, 1200 ve 1600dp genişlikte; 480 ve 900dp yükseklikte.

### PantrixLayout

`import com.pantrixui.foundation.adaptive.PantrixLayout`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixLayout(
    val margin: Dp,
    val gutter: Dp,
    val columns: Int = 4,
    val maxContentWidth: Dp = Dp.Infinity
)
```

Tek bir genişlik sınıfındaki pencerede bir sayfanın düzenlendiği ölçüler. `PantrixTheme.layout` geçerli pencerenin ölçülerini verir:

```kotlin
Column(Modifier.padding(horizontal = PantrixTheme.layout.margin).maxContentWidth()) { … }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout.gutter)) { … }
```

Kenar boşluğu ve sütun arası boşluktur: arayüz yoğunluğu onları boşluğu ölçeklediği gibi ölçekler. Sütunlar bir sayı, içeriğin en fazla genişliği içeriğin ölçüsüdür; yoğunluk ikisini de ölçeklemez.

Parametreler:

- `margin: Dp`: Pencerenin ya da bir panelin kenarı ile içerik arasındaki boşluk: bir sayfanın içeriğine yanlarında verdiği iç boşluk.
- `gutter: Dp`: Bir ızgaranın sütunları arasındaki ve yan yana duran paneller arasındaki boşluk.
- `columns: Int`: Bir sayfanın ızgarasının yerinde kaç sütun olduğu: sayfanın bir parçası bunlardan birkaçına yayılır, ne kadar geniş olduğunu `spanWidth` söyler. Telefonda 4, tablette 8, daha geniş bir pencerede 12.
- `maxContentWidth: Dp`: Bir sayfanın içeriğinin en fazla ne kadar genişlediği: ötesinde geniş bir pencerenin yeri içeriğin yanında boş kalır, çünkü bir masaüstü penceresi boyunca uzanan bir satır okunmaz. İçeriğin elindeki bütün yeri aldığı yerde `Dp.Infinity`. `Modifier.maxContentWidth()` içeriği ona göre tutar.

Üyeleri:

- `fun scaled(factor: Float): PantrixLayout`: Bir arayüz yoğunluğunda bu ölçüler: kenar boşluğu ve sütun arası `factor` ile çarpılır, sütunlar ve içeriğin en fazla genişliği olduğu gibi kalır.
- `fun spanWidth(available: Dp, span: Int): Dp`: `span` kadar `columns`'a yayılan bir parçanın `available` yerde ne kadar geniş olduğu: sütunları ve aralarındaki sütun araları. Sütunlar birbiri kadar geniştir, her ikisinin arasında bir sütun arası durur:

  ```kotlin
  BoxWithConstraints {
      val layout = PantrixTheme.layout
      Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
          Article(Modifier.width(layout.spanWidth(maxWidth, span = 8)))
          Related(Modifier.width(layout.spanWidth(maxWidth, span = 4)))
      }
  }
  ```

  Sütun aralarına dar gelen bir yer sütunlara genişlik bırakmaz: parça o zaman yayıldığı sütun araları kadar geniştir.

  `available`: sütunların paylaştığı yer, sayfanın içeriği kadar geniş: kenar boşluklarının içinde.

  `span`: parçanın kaç sütuna yayıldığı, 1'den `columns`'a kadar.

### PantrixLayouts

`import com.pantrixui.foundation.adaptive.PantrixLayouts`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixLayouts(
    val compact: PantrixLayout = PantrixLayout(margin = 16.dp, gutter = 16.dp, columns = 4),
    val medium: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 16.dp, columns = 8),
    val expanded: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 24.dp, columns = 12),
    val large: PantrixLayout = PantrixLayout(margin = 32.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1040.dp),
    val extraLarge: PantrixLayout = large
)
```

Bir pencerenin her genişlik sınıfı için düzen ölçüleri: `PantrixTheme.layout` bunların arasından seçer.

Telefonun verecek genişliği azdır, masaüstü penceresinin fazladır; bu yüzden kenar boşluğu ve sütun arası pencereyle büyür. Varsayılan kenar boşluğu 16dp, Medium'dan itibaren 24dp, Large'dan itibaren 32dp; sütun arası 16dp, Expanded'dan itibaren 24dp. Her biri boşluk ölçeğinin bir adımıdır. Izgara 4 sütundur, Medium'dan itibaren 8, Expanded'dan itibaren 12; içerik Large'a kadar sınırsız genişler, orada 1040dp'de durur.

Bir ürün, tasarladığı sınıflar için kendi ölçülerini temaya verir; gerisi olduğu gibi kalır:

```kotlin
PantrixTheme(layouts = PantrixLayouts(compact = PantrixLayout(margin = 20.dp, gutter = 12.dp))) { … }
```

Kendi ölçüleri verilen bir sınıfın sütunları ve en fazla içerik genişliği de verilendir: verilmezlerse bir telefonunkilerdir, 4 sütun ve sınırsız. Daha geniş bir sınıfa kendi ölçülerini veren bir ürün onları da verir:

```kotlin
PantrixLayouts(large = PantrixLayout(margin = 40.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1200.dp))
```

Parametreler:

- `compact: PantrixLayout`: 600dp'den dar bir pencerenin ölçüleri: dikey tutulan bir telefon.
- `medium: PantrixLayout`: 600dp'den itibaren ölçüler: dikey tutulan bir tablet, açık bir katlanabilir.
- `expanded: PantrixLayout`: 840dp'den itibaren ölçüler: yatay tutulan bir tablet.
- `large: PantrixLayout`: 1200dp'den itibaren ölçüler: bir masaüstü penceresi, bir tarayıcı.
- `extraLarge: PantrixLayout`: 1600dp'den itibaren ölçüler. Verilmezse `large`'ın ölçüleridir: o genişliği ayrıca tasarlayan ürün azdır.

Üyeleri:

- `fun forWidth(widthClass: WindowWidthClass): PantrixLayout`: Genişlik sınıfı `widthClass` olan bir pencerenin ölçüleri.
- `fun scaled(factor: Float): PantrixLayouts`: Yoğunluk her çağrı yerinde değil, burada uygulanır; böylece tek bir anahtar her sınıfın ölçülerini yeniden ölçekler.

  `factor`: arayüz yoğunluğunun ölçeği: her sınıfın kenar boşluğu ve sütun arası onunla çarpılır.

### Modifier.maxContentWidth

`import com.pantrixui.foundation.adaptive.maxContentWidth`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun Modifier.maxContentWidth(alignment: Alignment.Horizontal = Alignment.Start): Modifier
```

İçeriği `PantrixTheme.layout.maxContentWidth`'ten geniş tutmaz: bir masaüstü penceresinde sayfanın yazısı okunan bir genişlikte kalır, yerin geri kalanı yanında boş kalır. Onu sınırlayan sınıfın altında içerik verilen bütün yeri alır.

İçerik yerinden darsa bu yeri alır ve içeriği içine `alignment`'a göre koyar: başta, orada başlayan bir başlığın altında, ya da ortada.

```kotlin
Column(
    Modifier
        .verticalScroll(scroll)
        .padding(horizontal = PantrixTheme.layout.margin)
        .maxContentWidth()
) { … }
```

Sınır yürürlükteki pencereninkidir ya da pencere olarak aktarılan bir bileşen kutusununki; pencerenin sınıfı değiştikçe onu izler. Dolduracağı sınırlı bir genişlik yoksa içerik olduğu gibi ölçülür.

Parametreler:

- `alignment: Alignment.Horizontal`: içeriğin, olabileceğinden geniş bir yerde nerede durduğu: varsayılan başta.

### WindowPosture

`import com.pantrixui.foundation.adaptive.WindowPosture`, `com.pantrixui:foundation` içinden

```kotlin
data class WindowPosture(public val folds: List<WindowFold> = emptyList())
```

Pencerenin cihazının nasıl katlandığı: pencereyi kesen kat yerleri. Kat yeri olmayan cihazda hiçbiri yoktur.

Bir düzen iki duruş için yazılır: `isBook` ve `isTabletop`. Düz açılmış bir kat yeri `folds`'tadır ve hiçbir şeyi değiştirmez: ekran tek parçadır.

Parametreler:

- `folds: List<WindowFold>`: Pencereyi kesen kat yerleri.

Üyeleri:

- `isBook: Boolean`: Cihaz kitap gibi tutuluyor, yarı açık ve kat yeri dikey: yan yana iki panel, kat yerinden bölünmüş. Kat yerinin üstünden hiçbir şey geçmez.
- `isTabletop: Boolean`: Cihaz masadaki bir dizüstü gibi tutuluyor, yarı açık ve kat yeri yatay: bakılacaklar kat yerinin üstüne, kontroller, formlar ve gezinme altına gelir.
- `separatingFold: WindowFold?`: Pencereyi iki parçaya ayıran kat yeri, pencere tek parçaysa null. İçerik bu kat yerinden kaçınır.

Tipin kendisinde:

- `WindowPosture.Flat: WindowPosture`: Kat yeri yok: katlanmayan her telefon, tablet, masaüstü penceresi ve tarayıcı.

### WindowFold

`import com.pantrixui.foundation.adaptive.WindowFold`, `com.pantrixui:foundation` içinden

```kotlin
data class WindowFold(
    public val bounds: Rect,
    public val orientation: FoldOrientation,
    public val isHalfOpened: Boolean,
    public val isSeparating: Boolean,
    public val isOccluding: Boolean,
    public val clearance: Rect = bounds
)
```

Penceredeki bir kat yeri ya da menteşe.

Parametreler:

- `bounds: Rect`: Nerede olduğu, piksel cinsinden ve pencerenin koordinatlarında. Tek ekrandaki bir kat yerinin kalınlığı yoktur: sınırları sıfır genişliğinde bir çizgidir. İki ekran arasındaki bir menteşe aradaki boşluk kadar geniştir.
- `orientation: FoldOrientation`: Hangi yönde uzandığı.
- `isHalfOpened: Boolean`: Cihaz kısmen açık mı tutuluyor, iki yarı birbirine açılı mı. Düz açılmışsa değildir.
- `isSeparating: Boolean`: Pencere burada, üstüne hiçbir şey yerleştirilemeyecek biçimde iki parça mı: yarı açık tutulan bir kat yeri ya da hangi açıda olursa olsun iki ekran arasındaki bir menteşe böyledir. Düz açılmış bir kat yeri hiçbir şeyi ayırmaz.
- `isOccluding: Boolean`: Pencerenin bir şeridini gizliyor mu: iki ekran arasındaki bir menteşe gizler.
- `clearance: Rect`: Çevresinde dokunulanların boş bıraktığı şerit, piksel cinsinden ve pencerenin koordinatlarında: `bounds` ve sistemin iki yanında istediği pay. iOS bir pay ister, katlanan bir iPhone'un kat yerinin iki yanında 20pt; Android ve tarayıcılar istemez ve şerit `bounds`'un kendisidir. Kat yerinden bölünen iki panel aralarında bu şeridi bırakır.

### WindowVerticalBar

`import com.pantrixui.foundation.adaptive.WindowVerticalBar`, `com.pantrixui:foundation` içinden

```kotlin
data class WindowVerticalBar(
    public val bounds: Rect,
    public val barBounds: Rect
)
```

Sistemin pencerenin bir kenarı boyunca dik duran bar'lar için ayırdığı sütun: tepesinde durum çubuğu, altında bir uygulamanın araç düğmeleri ve sekmeleri. iPhone Duo'nun dış ekranında iOS 27.1'den itibaren bitiş kenarı boyunca bir tane vardır; UIKit bir sekme bar'ını ve bir gezinme bar'ının düğmelerini oraya koyar. Pencerenin güvenli alanı içeriği ondan uzak tutar.

Bir uygulamanın kendi bar'ları `barBounds`'ta durur: düğmeler tepesinde, durum çubuğunun altında; gezinme dibinde, ana ekran çizgisinin üstünde. `PantrixScaffold` gezinmesini ve bir üst bar'ın düğmelerini dik tutulan dış ekranda oraya kendisi koyar. İç ekranda ve yana çevrilen iki ekranda da bir sütun vardır; onu durum çubuğuna bırakır.

Parametreler:

- `bounds: Rect`: Sütun, pencerenin tepesinden dibine; pikselle ve pencerenin koordinatlarında.
- `barBounds: Rect`: Bir uygulamanın bar'larının sütunda durduğu yer: durum çubuğunun altında ve ana ekran çizgisinin üstünde, sütun kadar geniş. Ondan dar bir bar onun ortasında durur; burası sistemin kendi bar'larını koyduğu yerdir ve her zaman sütunun ortası değildir: ekranın yuvarlak köşesi sütunun dış yanından bir pay alır. Pikselle ve pencerenin koordinatlarında.

### systemVerticalBar

`import com.pantrixui.foundation.adaptive.systemVerticalBar`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemVerticalBar(): WindowVerticalBar?
```

Sistemin bu pencerede ayırdığı dikey bar, ya da ayırmadığı yerde null: iPhone Duo'nun dış ekranının iOS 27.1'den itibaren sütunu. Android'de, masaüstünde ve tarayıcılarda yoktur; iOS 27.1'den önce ve 27.1'den eski bir Xcode ile derlenen bir kütüphanede de yoktur. Cihaz çevrildikçe ve ekranları değiştikçe izlenir.

### VerticalBarInNode

`import com.pantrixui.foundation.adaptive.VerticalBarInNode`, `com.pantrixui:foundation` içinden

```kotlin
class VerticalBarInNode
```

Pencerenin bir düğümün yanındaki dikey bar'ı, düğümün kendi koordinatlarında ve pikselle: bar'larını sistemin sütununa koyan bir düzenin ölçtüğü şey. `modifier`'ı düğüme koy; `verticalBar` düğüm yer değiştirip boyu değiştikçe, pencere de bar'ı gelip gittikçe onu izler.

Bar pencerenindir: düğümün çizildiği çerçevenin söylediği, ya da en dıştaki `PantrixTheme`'in temsil ettiği pencereninki; bir panele kendi penceresi diye söylenen yerinki değil. Sütuna uzanmayan bir düğümün, o kenardan uzaktaki bir paneldekinin, sütunu yoktur. Düğüm ilk kez yerleşene kadar sütun, pencerenin köşesinden başlayan bir düğümün yanında olacağı yerdedir: pencereyi dolduran bir düğümünki gibi.

Üyeleri:

- `modifier: Modifier`: Dikey bar'ı sorulan düğüme konur. Düğümün penceredeki yerini izler.
- `verticalBar: WindowVerticalBar?`: Dikey bar, sütunu ve bar'larının yeri düğümün koordinatlarında: düğüm sütunun üstünden pencerenin kenarına uzandıkça; uzanmadığı yerde ve pencerede dikey bar olmadığında null.

### rememberVerticalBarInNode

`import com.pantrixui.foundation.adaptive.rememberVerticalBarInNode`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberVerticalBarInNode(): VerticalBarInNode
```

Pencerenin, `VerticalBarInNode.modifier`'ın konduğu düğümün yanındaki dikey bar'ı.

# Progress Circle

Bir iş ilerledikçe dolan bir halka: bir yüklemenin ne kadarının gittiği, bir kurulumun kaç adımının geride kaldığı, bir kotanın ne kadarının kullanıldığı. Sonu bilinen bir bütünün payını gösterir; sonu bilinmeyen iş için spinner vardır.

- `PantrixProgressCircle` (`com.pantrixui.components.chart.progresscircle`, `com.pantrixui:components`): Bilinen bir iş yapıldıkça saat yönünde dolan bir halka, ortasında payı ya da bir ikonu için yer; ekran okuyucu onu bir ilerleme çubuğu olarak okur. Anahtar sözcükler: dairesel ilerleme, ilerleme halkası, belirli ilerleme, tamamlanma, yüzde.

## Özellikler

- **Değer.** Halka saat on ikiden başlar ve saat yönünde, `value`'nun `max`'e oranı kadar dolar; bütünü soluk bir halka gösterir. Sıfırın altındaki değer sıfır, `max`'i aşan değer bütündür.
- **Ortası.** `content` halkanın ortasında durur: pay bir sayı olarak, bir ikon.
- **Renk.** Halka `color` ile, verilmezse durduğu yerin içerik rengiyle (dolu bir kartın üstünde olduğu gibi), o da yoksa birincil renkle çizilir; izi aynı rengin soluk bir payıdır (`trackColor` başka söylemedikçe).
- **Ölçüler.** `ProgressCircleStyle` halkanın boyunu ve kalınlığını verir; modifier'daki bir boyut da halkanındır.
- **Hareket.** Değer değişince halka yeni değere gider; sistem azaltılmış hareket istiyorsa gitmez, orada olur.
- **Ekran okuyucu.** Adı `contentDescription` olan ve ulaştığı payı söyleyen bir ilerleme çubuğudur. Ortasına yazılan sayı da okunur; payı zaten duyan ekran okuyucudan gizlenmesi iyidir.
- **Yön.** Halka sağdan sola okunan dilde de saat yönünde dolar.
- **Dışa aktarma.** `export` grafiğin üstüne bir düğme koyar: grafik ekrandaki hâliyle, gösterilen yer ve tooltip olmadan, PNG, SVG ya da PDF dosyası olarak üretilir ve uygulamaya verilir.
- **Otomasyon.** `ProgressCircle_<tagKey>`.

## Kullanım

### A share of a whole

```kotlin
PantrixProgressCircle(value = upload.sent, max = upload.size, contentDescription = stringResource(Res.string.uploading))
```

### With the share written in its middle

```kotlin
PantrixProgressCircle(
    value = done,
    max = steps,
    contentDescription = stringResource(Res.string.setup),
    style = ProgressCircleStyle(size = 72.dp, strokeWidth = 8.dp),
    tagKey = "setup"
) {
    PantrixText(text = "$done/$steps", modifier = Modifier.clearAndSetSemantics { })
}
```

## Örnekler

### Bir bütünün payı

En yalın hâli: yüzde yetmiş ikisi tamamlanmış bir iş. `max` verilmezse yüzdür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle

PantrixProgressCircle(value = 72, contentDescription = "Yüklenen", tagKey = "plain")
```

### Ortasında payıyla

Pay halkanın ortasına yazılı ve düğmelerle değişiyor: halka yeni değere gider. Ortadaki yazı ekran okuyucudan gizli (`clearAndSetSemantics`): payı halkanın kendisi söylüyor.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.chart.progresscircle.ProgressCircleStyle
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var done by remember { mutableStateOf(3) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixProgressCircle(
        value = done,
        max = 8,
        contentDescription = "Kurulum",
        style = ProgressCircleStyle(size = 72.dp, strokeWidth = 8.dp),
        tagKey = "share"
    ) {
        PantrixText(text = "$done/8", modifier = Modifier.clearAndSetSemantics { })
    }
    PantrixButton(
        text = "Geri",
        onClick = { done = (done - 1).coerceAtLeast(0) },
        variant = ButtonVariant.Outline,
        tagKey = "progress_back"
    )
    PantrixButton(text = "İleri", onClick = { done = (done + 1).coerceAtMost(8) }, tagKey = "progress_next")
}
```

### Boyutlar

Üç boy, `ProgressCircleStyle` ile: bir satırın içinde küçük, bir kartta orta, bir özetin başında büyük. Halkanın kalınlığı da boyuyla birlikte verilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.chart.progresscircle.ProgressCircleStyle
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixProgressCircle(
        value = 40,
        contentDescription = "Küçük",
        style = ProgressCircleStyle(size = 32.dp, strokeWidth = 4.dp),
        tagKey = "small"
    )
    PantrixProgressCircle(value = 40, contentDescription = "Orta", tagKey = "medium")
    PantrixProgressCircle(
        value = 40,
        contentDescription = "Büyük",
        style = ProgressCircleStyle(size = 96.dp, strokeWidth = 10.dp),
        tagKey = "large"
    )
}
```

### Renkler

Halkanın rengi neyi gösterdiğini söyleyebilir: az kalan kota uyarı renginde, dolan kota tehlike renginde. Dolu bir yüzeyin üstünde renk verilmeyen halka, yüzeyin içerik rengiyle çizilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixProgressCircle(value = 35, color = colors.success.color, contentDescription = "Kota", tagKey = "ok")
    PantrixProgressCircle(value = 80, color = colors.warning.color, contentDescription = "Kota", tagKey = "warn")
    PantrixProgressCircle(value = 97, color = colors.danger.color, contentDescription = "Kota", tagKey = "full")
    PantrixSurface(color = colors.primary.color) {
        PantrixProgressCircle(
            value = 60,
            modifier = Modifier.padding(PantrixTheme.spacing.md),
            contentDescription = "Yüklenen",
            tagKey = "on_fill"
        )
    }
}
```

### Dışa aktarma

`export = ChartExport(...)` grafiğin üstüne bir dışa aktarma düğmesi koyar: bas ve türü seç (PNG, SVG ya da PDF). Grafik dosyayı üretir ve `onExport`'a verir; altta adı ve boyu, PNG ise resmi görünür, "Dosyayı kaydet" onu platformun yoluyla verir.

Dosyada halka dolduğu kadarıyla çizilir; ortasına `content` ile konan dosyaya çıkmaz. `export` `content`'ten önce gelir: sondaki lambda yine ortadaki içeriktir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.chart.export.ChartExport
import com.pantrixui.components.chart.export.ChartExportFile
import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var file by remember { mutableStateOf<ChartExportFile?>(null) }
PantrixProgressCircle(
    value = 72,
    contentDescription = "Yüklenen",
    tagKey = "exported",
    export = ChartExport(fileName = "yuklenen") { file = it }
) {
    PantrixText(text = PantrixTheme.strings.percent(0.72), style = PantrixTheme.typography.caption)
}
ExportedFile(file, tagKey = "exported")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ExportedFile`: Bir grafiğin ürettiği dosyayı gösterir: adını, türünü ve boyunu; PNG ise resmin kendisini, en çok kendi boyunda; ve dosyayı platformun kaydetme penceresiyle veren "Dosyayı kaydet" düğmesini (kütüphanenin `rememberFileSaver`'ı). Henüz dosya yokken bunu söyler.

## API

### PantrixProgressCircle

`import com.pantrixui.components.chart.progresscircle.PantrixProgressCircle`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixProgressCircle(
    value: Number,
    modifier: Modifier = Modifier,
    max: Number = 100,
    color: Color = Color.Unspecified,
    trackColor: Color = Color.Unspecified,
    contentDescription: String? = null,
    style: ProgressCircleStyle? = null,
    tagKey: String? = null,
    export: ChartExport? = null,
    content: (@Composable () -> Unit)? = null
)
```

Bir iş yapıldıkça dolan bir halka: bir yüklemenin ne kadarının gittiği, bir kurulumun kaç adımının geride kaldığı, bir kotanın ne kadarının kullanıldığı. Bilinen bir bütünün payını gösterir; sonu bilinmeyen iş için spinner vardır.

Halka saat on ikiden başlayıp saat yönünde, `value`'nun `max`'e oranı kadar dolar; altında bütünü gösteren soluk bir halka durur. Sıfırın altındaki değer sıfırdır, `max`'in üstündeki bütün. `content` olarak verilen, halkanın ortasında durur: bir sayı olarak pay, bir ikon.

`color` ile çizilir; verilmezse durduğu yerin içerik rengiyle (dolu bir kartın üstünde olduğu gibi), o da yoksa birincil renkle. İzi, `trackColor` başka söylemedikçe, aynı rengin soluk bir payıdır. Değerdeki bir değişiklik halkayı ona götürür; sistem azaltılmış hareket istiyorsa götürmez.

**Ekran okuyucu için** adı `contentDescription` olan ve ulaştığı payı söyleyen bir ilerleme çubuğudur. Ortasında duran da, ne ise o olarak, okunur: oraya yazılan bir sayıyı, payı zaten bilen ekran okuyucudan gizlemek daha iyidir.

Halka sağdan okunan bir dilde de aynı yöne dolar, bir saatin kolunun gittiği gibi.

```kotlin
PantrixProgressCircle(value = 72, contentDescription = "Uploaded") {
    PantrixText(text = "72%", style = PantrixTheme.typography.caption)
}
```

Parametreler:

- `value: Number`: ne kadarının yapıldığı, sıfır ile `max` arasında. Sayı olmayan şey sıfır sayılır.
- `modifier: Modifier`: halkanın modifier'ı. Buradaki bir boyut halkanındır.
- `max: Number`: bütünün ne kadar olduğu: sıfırdan büyük.
- `color: Color`: halkanın rengi.
- `trackColor: Color`: halkanın izinin rengi: doldurduğu bütün.
- `contentDescription: String?`: neyin ilerlediği, bir iki sözcükle, ekran okuyucu için.
- `style: ProgressCircleStyle?`: bu halkanın kendi geometrisi: boyu ve halkasının kalınlığı.
- `tagKey: String?`: halkanın otomasyon anahtarı: halka `ProgressCircle_<tagKey>` olur.
- `export: ChartExport?`: halkayı uygulamanın dışına PNG, SVG ya da PDF olarak çıkarmayı sağlayan şey: üstündeki bir düğme onun o anki hâlinin dosyasını üretip verir (bkz. `ChartExport`). `null`, böyle bir düğme yoktur. Halkanın içinde duran, `content`, dosyada yoktur. `content`'ten önce gelir; o hep sonda kalır.
- `content: (@Composable () -> Unit)?`: halkanın ortasında duran. Halkanın içindeki yer onundur.

### ProgressCircleStyle

`import com.pantrixui.components.chart.progresscircle.ProgressCircleStyle`, `com.pantrixui:components` içinden

```kotlin
class ProgressCircleStyle(
    public val size: Dp = Dp.Unspecified,
    public val strokeWidth: Dp = Dp.Unspecified
) : PantrixStyle<ProgressCircleStyle>
```

`PantrixProgressCircle`'ın geometrisi.

Halka bir işarettir, şeylerin arasındaki boşluk değil: iki ölçüsü de yoğunlukla ölçeklenmez.

Parametreler:

- `size: Dp`: Halkanın genişliği ve yüksekliği: bir marka ya da bir tema başkasını vermedikçe her platformda 56dp.
- `strokeWidth: Dp`: Halkanın kalınlığı: 6dp. Bir halka, dairesinin dörtte birinden kalın olmaz.

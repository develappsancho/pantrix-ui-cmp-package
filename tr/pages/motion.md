# Hareket

Süreler ve eğriler: bir geçişin ne kadar sürdüğü ve nasıl hızlanıp yavaşladığı. Kütüphanenin her animasyonu süresini buradan alır; uygulamanın kendi animasyonu da alırsa sistemin "hareketi azalt" ayarına kendiliğinden uyar.

## Özellikler

- **Süreler.** `fast` 100, `normal` 200, `slow` 350 milisaniye. `PantrixTheme.motion` en yakın temanınkidir.
- **Eğriler.** `standardEasing` çoğu geçişin, `emphasizedEasing` fark edilmesi istenen bir geçişin eğrisidir. `PantrixEasing` üç eğriyi taşır: `Standard`, `Emphasized`, `Linear`; `curve` Compose'un `Easing`'idir.
- **Daha az hareket.** `reduceMotion` doğruyken `duration(ms)` sıfır verir: geçişler atlanır, bir spinner ya da bir iskelet durur. Tema onu sistemden okur (`rememberSystemMotion()`, `systemReduceMotion()`).

## Örnekler

### Süreler ve eğriler

Üç süre ve üç eğri. "Oynat"a bas: üstteki üç nokta aynı eğriyle `fast`, `normal` ve `slow` sürede, alttaki üçü aynı sürede üç eğriyle gider. Süre `duration(…)` ile alınır: sistem hareketi azaltmışsa noktalar beklemeden yerine geçer.

```kotlin
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.motion.PantrixEasing

var moved by remember { mutableStateOf(false) }
val motion = PantrixTheme.motion
Column(
    modifier = Modifier.widthIn(max = 320.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    MovingDot("fast · ${motion.fast} ms", moved, motion.duration(motion.fast), motion.standardEasing)
    MovingDot("normal · ${motion.normal} ms", moved, motion.duration(motion.normal), motion.standardEasing)
    MovingDot("slow · ${motion.slow} ms", moved, motion.duration(motion.slow), motion.standardEasing)
    PantrixEasing.entries.forEach { easing ->
        MovingDot("${easing.name} · slow", moved, motion.duration(motion.slow), easing)
    }
    PantrixButton(
        text = if (moved) "Geri getir" else "Oynat",
        onClick = { moved = !moved },
        variant = ButtonVariant.Outline,
        tagKey = "play"
    )
}

@Composable
private fun MovingDot(
    label: String,
    moved: Boolean,
    durationMillis: Int,
    easing: PantrixEasing
) {
    val offset by animateDpAsState(
        targetValue = if (moved) TRACK_WIDTH - DOT_SIZE else 0.dp,
        animationSpec = tween(durationMillis = durationMillis, easing = easing.curve),
        label = label
    )
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = label, style = PantrixTheme.typography.footnote)
        Box(
            modifier = Modifier
                .size(width = TRACK_WIDTH, height = DOT_SIZE)
                .background(PantrixTheme.colors.neutral.container, PantrixTheme.shapes.full),
            contentAlignment = Alignment.CenterStart
        ) {
            Box(
                Modifier
                    .offset(x = offset)
                    .size(DOT_SIZE)
                    .background(PantrixTheme.colors.primary.color, PantrixTheme.shapes.full)
            )
        }
    }
}

private val TRACK_WIDTH = 280.dp

private val DOT_SIZE = 16.dp
```

### Daha az hareket

Daha az hareket. Tema hareketini sistemden okur: `rememberSystemMotion()` sistemin "hareketi azalt" ayarını (`systemReduceMotion()`) `reduceMotion`'a koyar. Anahtar aynı şeyi içteki bir temaya elle verir, `PantrixMotion(reduceMotion = true)`: spinner ve iskelet durur, süreler sıfırlanır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.systemReduceMotion
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.motion.PantrixMotion
import com.pantrixui.foundation.token.motion.rememberSystemMotion

var reduce by remember { mutableStateOf(false) }
val system = rememberSystemMotion()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixText(
        text = "Sistem hareketi azaltıyor mu: ${if (systemReduceMotion()) "evet" else "hayır"}",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
    PantrixSwitchButton(
        checked = reduce,
        onCheckedChange = { reduce = it },
        label = "Bu bölümde hareketi azalt",
        tagKey = "reduce_motion"
    )
    PantrixTheme(motion = if (reduce) PantrixMotion(reduceMotion = true) else system) {
        val motion = PantrixTheme.motion
        PantrixText(
            text = "normal: ${motion.normal} ms, oynatılan: ${motion.duration(motion.normal)} ms",
            style = PantrixTheme.typography.footnote
        )
        PantrixSpinner()
        PantrixSkeleton(modifier = Modifier.fillMaxWidth().height(16.dp))
    }
}
```

## API

### PantrixMotion

`import com.pantrixui.foundation.token.motion.PantrixMotion`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixMotion(
    public val fast: Int = 100,
    public val normal: Int = 200,
    public val slow: Int = 350,
    public val standardEasing: PantrixEasing = PantrixEasing.Standard,
    public val emphasizedEasing: PantrixEasing = PantrixEasing.Emphasized,
    public val reduceMotion: Boolean = false
)
```

Süreler ve eğriler.

`EnterTransition`/`ExitTransition` bilerek yoktur: `@Immutable` sözleşmesinin eşitlik koşulunu karşılayamazlar ve onları buraya koymak kütüphanenin başka yerlerde uyguladığı kararlılık disiplinini bozardı.

Parametreler:

- `fast: Int`: Hızlı bir geçiş, milisaniyeyle: bir düğmenin basılışı.
- `normal: Int`: Olağan geçiş, milisaniyeyle.
- `slow: Int`: Uzun bir geçiş, milisaniyeyle.
- `standardEasing: PantrixEasing`: Çoğu geçişin izlediği eğri: bir düğmenin basılışı.
- `emphasizedEasing: PantrixEasing`: Fark edilmesi istenen bir geçişin eğrisi.
- `reduceMotion: Boolean`: Sistemin erişilebilirlik ayarının, `rememberSystemMotion`'ın okuduğu gibi, daha az hareket isteyip istemediği. O zaman `duration` 0'dır, bir spinner ya da bir iskelet durur.

Üyeleri:

- `fun duration(ms: Int): Int`: Kütüphanedeki her animasyon süresini buradan alır; böylece "hareketi azalt"a uymak, her bileşenin hatırlaması gereken bir kural değil tek bir dal olur.

  `ms`: bir animasyonun yazıldığı süre, milisaniye olarak.

### PantrixEasing

`import com.pantrixui.foundation.token.motion.PantrixEasing`, `com.pantrixui:foundation` içinden

```kotlin
enum class PantrixEasing(public val curve: Easing)
```

Compose'un `Easing`'i bir `fun interface`'tir; kararlı bir kimliği yoktur ve bir `@Immutable` veri sınıfında duramaz. Eğrileri bir enum'a bağlamak eşitliği geri getirir; çağıranlar `curve`'ü kullanır.

Parametreler:

- `curve: Easing`: Girdinin karşılığı olan Compose eğrisi.

Değerleri:

- `Standard`: Geçişlerin çoğunun izlediği eğri: başlarken çabuk, dururken yumuşak.
- `Emphasized`: Fark edilmesi istenen bir geçişin eğrisi.
- `Linear`: Baştan sona eşit bir hız: bir ilerleme çubuğu gibi başka bir şeyle birlikte ilerleyenler için.

### rememberSystemMotion

`import com.pantrixui.foundation.token.motion.rememberSystemMotion`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberSystemMotion(): PantrixMotion
```

Pantrix'in hareketi: sistem daha az hareket isterken her süre sıfıra iner.

### systemReduceMotion

`import com.pantrixui.foundation.platform.systemReduceMotion`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemReduceMotion(): Boolean
```

İşletim sisteminin "hareketi azalt" ayarı.

Her süreyi sıfıra indiren `PantrixMotion.reduceMotion`'ı besler. Bileşenler bunu hiçbir zaman kendileri denetlemez; `motion.duration(...)`'a sorarlar; böylece ayara uymak, her bileşenin hatırlaması gereken bir kural değil tek bir karardır.

### LocalPantrixMotion

`import com.pantrixui.foundation.token.motion.LocalPantrixMotion`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixMotion: ProvidableCompositionLocal<PantrixMotion>
```

Geçerli süreler ve yumuşatmalar; `PantrixTheme` sağlar ve `PantrixTheme.motion` bunları okur. Bir temanın dışında Pantrix'in kendileri.

# Carousel

Slides one beside another, one of them on screen: featured items, a picture gallery, a step-by-step introduction. A swipe turns the slide; the dots under it say where the carousel is.

Which slide is on screen is the screen's state: the carousel is given the slide's index (`currentPage`), and a swipe reports back where it ended (`onPageChange`). The buttons, the dots and the arrow keys turn nothing by themselves; they report the slide that is asked for.

- `PantrixCarousel` (`com.pantrixui.components.data.carousel`, `com.pantrixui:components`): Slides one beside another, turned by a swipe, by two buttons or by the arrow keys, round and round and by themselves where that is asked for, with dots that say where the carousel is. Keywords: slider, slideshow, gallery, pager, swipe, onboarding.

## Features

- **Indicators.** Dots under the slides, a count ("2 / 4") or nothing: `CarouselStyle.indicator`.
- **Previous and next buttons.** They show where the platform is not used by touch, on desktop and in a browser on a desk, and not in a phone's browser. What decides is the pointer the screen is used with, not whether the screen can be touched: they show on a laptop with a touch screen too. `CarouselStyle.controls` shows them everywhere or never.
- **Neighbouring slides.** With `peek` the edges of the slides at the two sides show: what a swipe will bring is already in sight.
- **Slides that go round.** With `loop` the first comes after the last.
- **Turning by itself.** With `autoAdvanceMillis` the carousel turns by itself; it waits while the reader holds a slide, while the mouse is over it and while the keyboard's focus is in it. The button beside the dots stops it and starts it again. Where the theme's motion is reduced it does not turn by itself.
- **Over the slide.** `CarouselPlacement.Overlaid` puts the buttons and the dots over the slide, on a fill of their own: in a gallery they take no room.
- **Height.** In a carousel given a height, the slides fill the room the dots leave. A carousel given none is as tall as the slide on screen, and its height changes without a jump on the way from one slide to another.
- **Keyboard.** The slides are one stop: the arrow keys turn them, and Home and End go to the first and the last.
- **Touch.** For a finger the dots are one target: its left half goes one slide back and its right half one slide forward; in a right-to-left layout the halves change places.
- **Screen reader.** It says where the carousel is at every change: "Slide 2 of 4". A carousel that turns by itself does not break in at every turn.

## Usage

### Featured products

```kotlin
var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = products.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(240.dp),
    contentDescription = stringResource(Res.string.featured),
    tagKey = "featured"
) { index ->
    ProductCard(products[index], modifier = Modifier.fillMaxSize())
}
```

### Cards whose neighbours show, counted instead of dotted

```kotlin
PantrixCarousel(
    pageCount = offers.size,
    currentPage = slide,
    onPageChange = { slide = it },
    style = CarouselStyle(peek = 24.dp, indicator = CarouselIndicator.Count),
    tagKey = "offers"
) { index ->
    OfferCard(offers[index])
}
```

### A gallery that goes round by itself, its dots and buttons over the pictures

```kotlin
PantrixCarousel(
    pageCount = pictures.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(240.dp),
    loop = true,
    autoAdvanceMillis = 6_000,
    style = CarouselStyle(placement = CarouselPlacement.Overlaid),
    tagKey = "gallery"
) { index ->
    Picture(pictures[index], modifier = Modifier.fillMaxSize())
}
```

## Examples

### Featured: with dots

Its plainest form: four slides with dots under them. The slide's index is the screen's state; the carousel takes it with `currentPage` and reports it back with `onPageChange` when a swipe ends. The line below reads the same state.

The height was given to the carousel (180dp): the slides fill the room the dots leave. On desktop and in a browser on a desk the previous and next buttons show at the two sides as well; on a phone, in its browser too, a swipe is enough.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(180.dp),
    contentDescription = "Featured",
    tagKey = "featured"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxSize())
}
PantrixText(text = "On screen: ${TITLES[slide]}", color = PantrixTheme.colors.textSecondary)

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4

private val TITLES = listOf("New arrivals", "Pick of the week", "On sale", "Last chance")
```

### Cards whose neighbours show, with a count and buttons

With `peek = 24.dp` a slide's neighbours show at its two sides: what a swipe will bring is already in sight. `indicator = CarouselIndicator.Count` writes a count in place of the dots; `controls = CarouselControls.Always` shows the buttons on a phone too.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselIndicator
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(1) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    contentDescription = "Offers",
    style = CarouselStyle(
        peek = 24.dp,
        indicator = CarouselIndicator.Count,
        controls = CarouselControls.Always
    ),
    tagKey = "offers"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxWidth().height(96.dp))
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

private val TITLES = listOf("New arrivals", "Pick of the week", "On sale", "Last chance")

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4
```

### An introduction that goes on by its own button

An introduction that cannot be swiped: `swipeEnabled = false`, with the indicator and the buttons off too. The steps go on only with "Continue". Which step it is on is the screen's own state; the button adds one to it, and the carousel turns there.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselIndicator
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var step by rememberSaveable { mutableIntStateOf(0) }
val last = STEPS.lastIndex
PantrixCarousel(
    pageCount = STEPS.size,
    currentPage = step,
    onPageChange = { step = it },
    swipeEnabled = false,
    contentDescription = "Introduction",
    style = CarouselStyle(indicator = CarouselIndicator.None, controls = CarouselControls.Never),
    tagKey = "introduction"
) { index ->
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        PantrixText(text = STEPS[index], modifier = Modifier.padding(PantrixTheme.spacing.lg))
    }
}
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButton(
        text = if (step == last) "Start over" else "Continue",
        onClick = { step = if (step == last) 0 else step + 1 },
        variant = ButtonVariant.Soft,
        size = ButtonSize.Small,
        tagKey = "introduction_next"
    )
    PantrixText(text = "Step ${step + 1} of ${STEPS.size}", color = PantrixTheme.colors.textSecondary)
}

private val STEPS = listOf(
    "Welcome to Pantrix. This introduction takes three steps.",
    "The components speak the same design language on every platform.",
    "You are ready: you can go back to the list of components and open one."
)
```

### On a fill

A carousel on a fill that is not one of the theme's grounds. No colour was given: the fill says what colour is written on it. The dot of the slide on screen and the buttons are in that colour, and the other dots in a share of it.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.color) {
    PantrixCarousel(
        pageCount = 3,
        currentPage = slide,
        onPageChange = { slide = it },
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        contentDescription = "On a fill",
        style = CarouselStyle(controls = CarouselControls.Always),
        tagKey = "filled"
    ) { index ->
        CarouselSlide(index, modifier = Modifier.fillMaxWidth().height(72.dp))
    }
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4

private val TITLES = listOf("New arrivals", "Pick of the week", "On sale", "Last chance")
```

### A gallery that goes round by itself

Like a picture gallery: with `loop` the slides go round, and with `autoAdvanceMillis` the carousel turns by itself every six seconds. `placement = CarouselPlacement.Overlaid` puts the buttons and the dots over the slide, on the carousel's own fill (dark in the light theme, light in the dark one); they take no room.

The button beside the dots stops the turning and starts it again. While a slide is held, while the mouse is over the carousel and while the keyboard's focus is in it, the carousel waits by itself.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselControls
import com.pantrixui.components.data.carousel.CarouselPlacement
import com.pantrixui.components.data.carousel.CarouselStyle
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(200.dp),
    contentDescription = "Gallery",
    loop = true,
    autoAdvanceMillis = GALLERY_MILLIS,
    style = CarouselStyle(controls = CarouselControls.Always, placement = CarouselPlacement.Overlaid),
    tagKey = "gallery"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxSize())
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

private val TITLES = listOf("New arrivals", "Pick of the week", "On sale", "Last chance")

private const val GALLERY_MILLIS = 6_000

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4
```

### Slides of different heights

The slides differ in height, and the carousel was given no height. The carousel is as tall as the slide on screen; on the way from one slide to another its height changes along with it, without a jump. The line below shows this: it moves down and up with the slide.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = NOTES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    contentDescription = "Notes",
    loop = true,
    tagKey = "notes"
) { index ->
    PantrixSurface(modifier = Modifier.fillMaxWidth(), border = PantrixTheme.colors.divider) {
        PantrixText(text = NOTES[index], modifier = Modifier.padding(PantrixTheme.spacing.lg))
    }
}
PantrixText(
    text = "This line moves with the height of the slides.",
    color = PantrixTheme.colors.textSecondary
)

private val NOTES = listOf(
    "A short note.",
    "A longer note: it runs to several lines, because it has more to say. As the carousel comes to this slide, " +
        "its height grows gradually too; the line below moves down.",
    "A medium-sized note: it takes about two lines and is shorter than the one before."
)
```

### In its own colours

In its own colours: `CarouselColors` paints the dots, the dots' track, the buttons and the scrim over the slide. Here the dots are in the colour of success, not the brand's; every colour not given is the theme's.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.data.carousel.CarouselColors
import com.pantrixui.components.data.carousel.PantrixCarousel
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.PantrixColor

var slide by rememberSaveable { mutableIntStateOf(0) }
PantrixCarousel(
    pageCount = TITLES.size,
    currentPage = slide,
    onPageChange = { slide = it },
    modifier = Modifier.height(160.dp),
    colors = CarouselColors(
        indicator = PantrixTheme.colors.success.color,
        indicatorTrack = PantrixTheme.colors.success.container,
        control = PantrixTheme.colors.success.color
    ),
    contentDescription = "Featured",
    tagKey = "green"
) { index ->
    CarouselSlide(index, modifier = Modifier.fillMaxSize())
}

@Composable
private fun CarouselSlide(
    index: Int,
    modifier: Modifier = Modifier
) {
    val role = roles()[index % ROLES]
    PantrixSurface(modifier = modifier, color = role.container, contentColor = role.onContainer) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixText(text = TITLES[index % TITLES.size], style = PantrixTheme.typography.title)
        }
    }
}

@Composable
private fun roles(): List<PantrixColor> {
    val colors = PantrixTheme.colors
    return listOf(colors.info, colors.success, colors.warning, colors.danger)
}

private const val ROLES = 4

private val TITLES = listOf("New arrivals", "Pick of the week", "On sale", "Last chance")
```

## API

### PantrixCarousel

`import com.pantrixui.components.data.carousel.PantrixCarousel`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixCarousel(
    pageCount: Int,
    currentPage: Int,
    onPageChange: (page: Int) -> Unit,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    swipeEnabled: Boolean = true,
    loop: Boolean = false,
    autoAdvanceMillis: Int = 0,
    style: CarouselStyle? = null,
    colors: CarouselColors? = null,
    tagKey: String? = null,
    page: @Composable (index: Int) -> Unit
)
```

Slides one beside another, one of them on screen: pictures, cards, the steps of an introduction. A swipe turns them; what is under them says where the carousel is, and turns them for a reader with no finger on the screen.

Which slide is on screen is the screen's state: the carousel shows `currentPage` and goes to another when that changes, turning there, or at once where the theme's motion is reduced. A swipe turns the slides by itself and tells `onPageChange` where it ended; a press on a button or a dot, and an arrow key, ask `onPageChange` for a slide and turn nothing by themselves. A caller that keeps a slide the reader swiped away from is asked once, and the carousel stays where the reader left it until `currentPage` changes. The carousel keeps no slide of its own beyond that: one that comes back to the screen is on `currentPage`.

Under the slides a dot stands for each of them; a style counts the slides instead, or shows nothing. With a pointer, a press on a dot asks for its slide. Under a finger a dot is too small a thing to touch, and the dots are one thing to press, as large as the platform's touch target: a press before their middle asks for the slide before, and one after it for the slide after. Where the reader has no touch, two buttons turn the slides back and on: a press while the carousel is turning goes on from the slide it is heading for, so two quick presses turn two slides. The slides take the keyboard's focus as one stop: the arrow keys turn them, mirrored where the reading runs from the right, and Home and End go to the first and the last. A button at the end it turns to cannot be pressed, and the focus it had goes to the slides; so does the focus of what is in a slide that an arrow turns away. Of what is in the slides, Tab stops at what is in the one on screen alone.

With `loop` the slides go round: the last goes on to the first and the first back to the last, by a swipe, a button or an arrow, and neither button is ever at an end.

With `autoAdvanceMillis` the carousel turns by itself: so long after it came to a slide, it asks `onPageChange` for the slide after, and for the first after the last. It waits while the reader holds a slide, while a pointer is over the carousel and while the keyboard's focus is in it. Beside the dots it has a button that stops it and lets it turn again, and that button is the reader's last word: stopped, the carousel turns only when it is turned, and let to turn again it does so with the focus on that button. Where the theme's motion is reduced the carousel does not turn by itself at all, and has no such button.

A screen reader is told the carousel's name, where it is given one, and where the carousel is whenever that changes, as "Slide 2 of 5" in the theme's language; a carousel that is turning by itself does not break in at every turn, and where it is can be read when the reader asks. On iOS the carousel is a group without a name: a screen reader there reads a group's own name after what the group holds.

The slides are as tall as the carousel is told to be, less what is under them, and a slide lower than that stands at their top. Told nothing, as on a page that scrolls, the carousel is as tall as the slide on screen, and on the way from a slide to a taller or a lower one as tall as the way between the two is far gone. A slide is as wide as the carousel, less the style's `peek` at each side. A style puts the dots and the buttons over the slides instead, as on a gallery of pictures, where they take no room of their own.

Parameters:

- `pageCount: Int`: how many slides there are.
- `currentPage: Int`: the slide on screen, counted from zero, as a pager's is. One past either end is the nearest slide. A `PantrixPagination` counts its pages from one, as it writes them: its page is this and one.
- `onPageChange: (page: Int) -> Unit`: told the slide a swipe ended on, and the slide a button, a dot or a key asks for, or the carousel itself when it turns by itself.
- `modifier: Modifier`: applied to the carousel: the slides and what is under them.
- `contentDescription: String?`: what the carousel holds, for a screen reader: "Featured products".
- `swipeEnabled: Boolean`: whether a swipe turns the slides. An introduction that goes on by its own button turns it off.
- `loop: Boolean`: whether the slides go round, the last on to the first. A carousel of one slide has nowhere to go.
- `autoAdvanceMillis: Int`: how long the carousel stays on a slide before it turns to the next by itself, or 0, the default, for a carousel that is turned by its reader alone. Long enough to read a slide in: five seconds or more.
- `style: CarouselStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `colors: CarouselColors?`: this call's own colours for what is under the slides. Only the ones it sets change.
- `tagKey: String?`: a locale-independent key for automation: the carousel's tag is `Carousel_<tagKey>`, and its parts are named inside it: `Carousel_<tagKey>.Slides_view`, which takes the keyboard's focus, `.Page_<index>`, `.Control_previous`, `.Control_next`, `.Control_pause` and `.Indicator_position`. Where the slides go round and a slide's neighbours show, a carousel of two slides has the same slide at both sides, twice under one tag.
- `page: @Composable (index: Int) -> Unit`: a slide, by its index.

### CarouselStyle

`import com.pantrixui.components.data.carousel.CarouselStyle`, from `com.pantrixui:components`

```kotlin
class CarouselStyle(
    public val pageSpacing: Dp = Dp.Unspecified,
    public val peek: Dp = Dp.Unspecified,
    public val indicatorSize: Dp = Dp.Unspecified,
    public val indicatorGap: Dp = Dp.Unspecified,
    public val indicatorSpacing: Dp = Dp.Unspecified,
    public val indicator: CarouselIndicator? = null,
    public val controls: CarouselControls? = null,
    public val placement: CarouselPlacement? = null
) : PantrixStyle<CarouselStyle>
```

`PantrixCarousel`'s geometry and what it shows under its slides. It is the same on every platform: the buttons come and go with the pointer the reader has, not with the platform. The rooms follow the density; a dot does not.

Parameters:

- `pageSpacing: Dp`: Between two slides, seen while one gives way to the next and beside a slide whose neighbours `peek`.
- `peek: Dp`: How much room is kept at each side of the current slide, in which its neighbours show.
- `indicatorSize: Dp`: A dot of the indicator.
- `indicatorGap: Dp`: Between two dots.
- `indicatorSpacing: Dp`: Between the slides and what is under them. Where that stands over the slides, between it and the slides' edges.
- `indicator: CarouselIndicator?`: What says where the carousel is.
- `controls: CarouselControls?`: Where the two buttons are shown.
- `placement: CarouselPlacement?`: Whether those stand under the slides or over them.

### CarouselIndicator

`import com.pantrixui.components.data.carousel.CarouselIndicator`, from `com.pantrixui:components`

```kotlin
enum class CarouselIndicator
```

What says where a carousel is, under its slides.

Entries:

- `Dots`: A dot for each slide, the current one in the brand's colour. A press on a dot asks for its slide. More slides than a row of dots tells at a glance, more than ten, are counted instead, as `Count` counts them.
- `Count`: The slide's number and how many there are, as `3 / 12`.
- `None`: Nothing. The slides say where they are themselves, or what the caller puts beside them does.

### CarouselControls

`import com.pantrixui.components.data.carousel.CarouselControls`, from `com.pantrixui:components`

```kotlin
enum class CarouselControls
```

Where a carousel shows its two buttons, which turn it back a slide and on a slide.

Entries:

- `Always`: On every platform.
- `WithoutTouch`: Where the platform is not used by touch, as `PantrixTheme.platform.isTouch` says: with a mouse, which has no swipe, the buttons are how the slides are turned. It goes by the pointer the screen is used with and not by what the screen can do: a laptop with a touch screen shows them.
- `Never`: Nowhere: the slides are turned by a swipe, by the arrow keys, and by what the caller puts beside them.

### CarouselPlacement

`import com.pantrixui.components.data.carousel.CarouselPlacement`, from `com.pantrixui:components`

```kotlin
enum class CarouselPlacement
```

Where what says where a carousel is, and its buttons, stand.

Entries:

- `Below`: Under the slides, in a row of their own.
- `Overlaid`: Over the slides, as on a gallery of pictures: the two buttons at the slides' sides, half way up, and what says where the carousel is at their foot. Each stands on a fill of the carousel's own, so that it reads on whatever the slide shows, and takes no room of its own: the carousel is as tall as its slides.

### CarouselColors

`import com.pantrixui.components.data.carousel.CarouselColors`, from `com.pantrixui:components`

```kotlin
data class CarouselColors(
    public val indicator: Color = Color.Unspecified,
    public val indicatorTrack: Color = Color.Unspecified,
    public val control: Color = Color.Unspecified,
    public val overlay: Color = Color.Unspecified
)
```

What a `PantrixCarousel` is painted with under its slides, for a carousel that does not take the theme's colours: a colour that is set is used, and one that is left out stays the theme's. The slides are the caller's own.

```kotlin
PantrixCarousel(…, colors = CarouselColors(indicator = PantrixTheme.colors.success.color))
```

A carousel has no fill of its own and stands on what is behind it. On a fill, which says what is written on it, the current dot and the buttons are written in that, and the other dots in a share of it: the brand's colour and the theme's border are colours for the theme's own grounds. So is the theme's disabled colour: a button at the end it would turn past is drawn in that on the theme's grounds, and in a share of the buttons' colour on a fill and where the buttons are given a colour.

Over the slides, where a style puts them, the dots and the buttons do have a fill of their own, `overlay`, and are written in what reads on it, as on any other fill.

Parameters:

- `indicator: Color`: The dot of the current slide. The primary role's `color`.
- `indicatorTrack: Color`: The dots of the other slides. The theme's `borderStrong`, which is told from a ground as a control's own mark is.
- `control: Color`: The buttons. The theme's `onSurface`, an icon's colour.
- `overlay: Color`: The fill behind the dots and behind each button where they stand over the slides. The theme's `onSurface`, the tone opposite the theme's grounds, thinned so that the slide shows through it. One of the theme's role colours given here brings the colour the theme pairs with it for what is written on it.

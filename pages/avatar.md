# Avatar

The picture of a person or a thing: a photograph, the initials of a name, or an icon standing for either. It stands beside the name in a list's row, at the start of a comment, at the top of a profile.

An avatar is drawn and not pressed. One that opens a profile goes inside what takes the press: a button, a list's row.

- `PantrixAvatar` (`com.pantrixui.components.elements.avatar`, `com.pantrixui:components`): The picture of a person or a thing: a photograph the app loads, over the initials of a name or an icon that stand in for it. Keywords: profile picture, user image, initials, user photo, account.

## Features

- **Initials, an icon or neither.** Where `initials` are given they are drawn; where they are not, the `icon` is; with neither, the avatar is a plain shape filled with its tone's colour.
- **Photograph.** Pantrix loads no pictures. `image` is a slot: the app puts the picture there with its own loader, from a resource, or as a drawing of its own. The picture is drawn over the initials: the letters show while it loads and when it cannot be loaded.
- **Six tones.** `tone` fills the avatar with the colour of one of the theme's roles; `colors` gives a colour that no role has. A tone says nothing by itself: a screen reader reads the description, not the colour.
- **Size.** `size` or `modifier` gives the avatar its size. The initials and the icon are a share of the avatar: they keep their proportion at every size. The style's size is 40dp on Android and iOS, and 32dp on desktop and the web.
- **Shape.** An avatar is a circle on every platform; `AvatarStyle(shape = ...)` changes its corners.
- **As written.** Initials are not put in upper case. The first two letters are kept, without the spaces between them.
- **Screen reader.** With a `contentDescription` the avatar is read as an image by that name. Given null, it is hidden: that is right for an avatar with its name written beside it. The initials are never read out.
- **Font scale.** The initials keep their share when the system's text size is made larger, too: an avatar does not grow with the text around it.

## Usage

### Initials beside a name that is already read

```kotlin
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixAvatar(contentDescription = null, initials = member.initials)
    PantrixText(text = member.name)
}
```

### A photograph the app loads, over initials that show until it is there

```kotlin
PantrixAvatar(contentDescription = member.name, initials = member.initials, tagKey = member.id) {
    AsyncImage(model = member.photoUrl, contentDescription = null, contentScale = ContentScale.Crop)
}
```

### An icon in the brand's colour, large, at the top of a profile

```kotlin
PantrixAvatar(
    contentDescription = stringResource(Res.string.your_account),
    icon = PantrixIcons.Person,
    tone = AvatarTone.Primary,
    size = 72.dp
)
```

### A team in its own colour

```kotlin
PantrixAvatar(
    contentDescription = team.name,
    initials = team.initials,
    colors = AvatarColors(container = team.color, content = team.onColor)
)
```

## Examples

### At its plainest

The least it takes: a description and initials. Its tone is `Neutral`, and its size the style's.

An avatar that stands alone takes its name from its description: a screen reader reads it as an image named "Ayşe Yılmaz". The letters "AY" are not read out; they are what the description shortens.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.PantrixAvatar

PantrixAvatar(contentDescription = "Ayşe Yılmaz", initials = "AY", tagKey = "ayse")
```

### Beside a name

An avatar that stands beside its name has no description: `contentDescription = null`. The name is written beside it; a screen reader does not read the same name twice, and the avatar is hidden from it.

Initials are drawn as they are written, and are not put in upper case: the "ik" in the last row stays in lower case.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

CONTACTS.forEachIndexed { index, contact -> ContactRow(contact = contact, key = "contact_$index") }

@Composable
private fun ContactRow(
    contact: AvatarContact,
    key: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixAvatar(contentDescription = null, initials = contact.initials, tone = contact.tone, tagKey = key)
        Column {
            PantrixText(text = contact.name, style = PantrixTheme.typography.label)
            PantrixText(
                text = contact.lastTransfer,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

private class AvatarContact(
    val name: String,
    val initials: String,
    val lastTransfer: String,
    val tone: AvatarTone = AvatarTone.Neutral
)

private val CONTACTS = listOf(
    AvatarContact(name = "Ayşe Yılmaz", initials = "AY", lastTransfer = "Sent yesterday: 250,00 TL"),
    AvatarContact(
        name = "İbrahim Öztürk",
        initials = "İÖ",
        lastTransfer = "Received on 3 September: 1.200,00 TL",
        tone = AvatarTone.Info
    ),
    // Initials are drawn as they are written: lower case stays lower case.
    AvatarContact(name = "ilker kaya", initials = "ik", lastTransfer = "No transactions yet", tone = AvatarTone.Success)
)
```

### Tones

`tone` fills the avatar with the colour of one of the theme's roles, and writes the letters in the colour that reads on it. The default is `Neutral`: a grey with no meaning at all.

In every tone the avatar is drawn in the role's solid colour, not in its pale `container`: a small circle of that colour is lost on a light page. A tone says nothing by itself; what a colour is to mean has to be in the words beside it.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    AvatarTone.entries.forEachIndexed { index, tone ->
        PantrixAvatar(
            contentDescription = "Avatar in the ${tone.name} tone",
            initials = TONE_INITIALS[index],
            tone = tone,
            tagKey = "tone_${tone.name}"
        )
    }
}

private val TONE_INITIALS = listOf("AL", "GH", "KJ", "MR", "ŞÖ", "WY")
```

### Sizes

`size` is the avatar's width and height: 24dp in a comment, 32dp in a dense row, 40dp in a row, 56dp on a card, 72dp on a profile. The size can be given by `modifier` too; it then takes the place of `size`.

The initials are four tenths of the avatar and the icon six tenths: the proportion stays the same whatever the size, and no second style is needed.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    listOf(24, 32, 40, 56, 72).forEach { size ->
        PantrixAvatar(
            contentDescription = null,
            initials = "DK",
            tone = AvatarTone.Primary,
            size = size.dp,
            tagKey = "size_$size"
        )
    }
}
```

### Initials

Initials are drawn as they are written. They are not put in upper case: `i` becomes `İ` in Turkish and `I` in other languages, and an avatar is not the place to get a name wrong. The first avatar was given "ik", and so it stayed.

The first two letters of what is given are kept, without the spaces between them: the avatar given "Ayşe Yılmaz" writes "Ay", and the one given "D K" writes "DK". How a name is shortened is the app's to say, not the avatar's: the app gives the letters to draw.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(contentDescription = "ilker kaya", initials = "ik", tagKey = "as_written")
    PantrixAvatar(contentDescription = "Ayşe Yılmaz", initials = "Ayşe Yılmaz", tagKey = "first_two")
    PantrixAvatar(contentDescription = "Deniz Kara", initials = "D K", tagKey = "without_spaces")
    PantrixAvatar(contentDescription = "Zeynep", initials = "Z", tagKey = "one_letter")
}
```

### A photograph that comes later

A profile whose photograph comes later. The avatar is given its `image` slot from the start, but the slot draws nothing until "Load photo" is pressed: until then the initials show. When the photograph comes it covers the letters. An image loader does the same while it loads, or when it fails.

The slot is as large as the avatar and is cut to its shape. The "photograph" here is a gradient with no size of its own; for a picture that is not square, ask for `ContentScale.Crop`. What the picture says of itself is not read: the avatar's description stands for both.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.painter.BrushPainter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loaded by rememberSaveable { mutableStateOf(false) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixAvatar(
        contentDescription = "Deniz Kara's profile photo",
        initials = "DK",
        tone = AvatarTone.Primary,
        size = 72.dp,
        tagKey = "profile"
    ) {
        if (loaded) Photo()
    }
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Deniz Kara", style = PantrixTheme.typography.callout)
        PantrixButton(
            text = if (loaded) "Remove photo" else "Load photo",
            onClick = { loaded = !loaded },
            variant = ButtonVariant.Outline,
            tagKey = "load_photo"
        )
    }
}

@Composable
private fun Photo() {
    val colors = PantrixTheme.colors
    val gradient = remember(colors) {
        BrushPainter(Brush.linearGradient(listOf(colors.warning.color, colors.danger.color, colors.primary.color)))
    }
    PantrixImage(painter = gradient, contentScale = ContentScale.Crop, contentDescription = null)
}
```

### An avatar with an icon, and an empty one

An avatar without initials draws its `icon`: a person, a group, a company. Like the letters, the icon is drawn in the colour that reads on the tone.

The second is given neither letters nor an icon: it is a plain circle filled with its tone's colour. Its description still says its name.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(contentDescription = "Shared account", icon = PantrixIcons.Person, tagKey = "shared")
    PantrixAvatar(contentDescription = "Unknown person", tagKey = "unknown")
}
```

### An avatar with corners

An avatar is a circle on every platform. `style` changes the style of this avatar alone: `AvatarStyle(shape = ...)` takes the corners to a step of the theme's shape scale. Here a folder's avatar and a company's are drawn with corners, by `ShapeRole.Medium`.

Only the field that is set changes: the size and the letters' share come from the theme's style.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarStyle
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val rounded = AvatarStyle(shape = ShapeRole.Medium)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(
        contentDescription = "Documents",
        icon = PantrixIcons.Folder,
        tone = AvatarTone.Info,
        style = rounded
    )
    PantrixAvatar(
        contentDescription = "Pantrix A.Ş.",
        initials = "PX",
        tone = AvatarTone.Primary,
        style = rounded,
        tagKey = "company"
    )
}
```

### A transparent logo

A picture that is transparent in places shows what is under it. Such a picture is given alone, without initials or an icon: behind this logo there is only the tone's colour.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixAvatar(contentDescription = "Compose Multiplatform", tone = AvatarTone.Primary, tagKey = "logo") {
    PantrixImage(painter = painterResource(Res.drawable.compose_multiplatform), contentDescription = null)
}
```

### A colour of its own

`colors` gives the avatar a fill of the given colour, not of a tone: a team's own colour, say, or a label's. The first avatar's colour is in none of the theme's roles; both its fill and the colour of its letters are given, because only whoever gives a fill the theme does not know can tell what reads on it.

The second is given a fill alone, and that fill is one of the theme's own colours, `success.container`. The letters take the colour the theme pairs with that fill, without it being given.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarColors
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(
        contentDescription = "Design team",
        initials = "DT",
        colors = AvatarColors(container = own.color, content = own.onColor),
        tagKey = "team"
    )
    PantrixAvatar(
        contentDescription = "Support team",
        initials = "ST",
        colors = AvatarColors(container = PantrixTheme.colors.success.container),
        tagKey = "support_team"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

## API

### PantrixAvatar

`import com.pantrixui.components.elements.avatar.PantrixAvatar`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixAvatar(
    contentDescription: String?,
    modifier: Modifier = Modifier,
    initials: String? = null,
    icon: ImageVector? = null,
    tone: AvatarTone = AvatarTone.Neutral,
    colors: AvatarColors? = null,
    style: AvatarStyle? = null,
    size: Dp = PantrixTheme.style(AvatarStyle, style).size,
    tagKey: String? = null,
    image: (@Composable () -> Unit)? = null
)
```

The picture of a person or a thing: a photograph, the initials of a name, or an icon standing for either.

The avatar draws its `initials`, or its `icon` where it has none, on its `tone`. With neither it is the plain shape in its tone. A picture is drawn over them, so the initials show while it loads and where it fails, and are covered once it is there. A picture with parts that can be seen through shows what is under them: give such a picture alone, without initials or an icon.

Pantrix loads no pictures. `image` is a slot, so an app draws one with whatever it already uses: an image loader, a `PantrixImage` of a resource, a canvas of its own. The slot is as large as the avatar and cut to its shape. A picture that is not square is fitted by its own rule, so ask for `ContentScale.Crop`.

Initials are drawn as they are written. They are not put in upper case: `i` becomes `İ` in Turkish and `I` everywhere else, and an avatar is not the place to get a name wrong. Pass what should be drawn. Two letters of it are kept, without the spaces between them. How a name is shortened is the app's to say, and its language's.

The initials and the icon are a share of the avatar, so one of any size keeps its proportions, whether the size is given as `size` or by `modifier`. The initials keep that share at every font scale: an avatar does not grow with the text around it, and letters that grew would leave it.

With a `contentDescription` the avatar is announced as an image by that name. Without one it is hidden from screen readers, which is right beside a name they already read. The initials are never read out: they are what the description shortens. An avatar is drawn and not pressed. One that opens a profile goes inside what takes the press, a button or a list's row.

Parameters:

- `contentDescription: String?`: what a screen reader says for the avatar, usually the name it stands for, or null to hide the avatar from it.
- `modifier: Modifier`: the avatar's modifier. A size given here goes over `size`.
- `initials: String?`: the letters to draw, usually one or two. More than two are cut, and none leaves the `icon`.
- `icon: ImageVector?`: what is drawn where there are no initials: a person, a group, a company.
- `tone: AvatarTone`: the colour under the initials or the icon, and theirs. A picture covers it.
- `colors: AvatarColors?`: this avatar's own colours, in place of its tone's: the ones it sets, with the tone's for the rest.
- `style: AvatarStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `size: Dp`: the avatar's width and height: the style's unless given.
- `tagKey: String?`: the avatar's automation key: it is `Avatar_<tagKey>`, and is tagged only when given one.
- `image: (@Composable () -> Unit)?`: a picture that fills the avatar, over the initials or the icon. What it says of itself is not read: the avatar's description stands for both.

### AvatarTone

`import com.pantrixui.components.elements.avatar.AvatarTone`, from `com.pantrixui:components`

```kotlin
enum class AvatarTone
```

How an avatar is coloured where no picture covers it: one of the theme's colour roles, so a brand changes every avatar at once.

An avatar is filled in every tone, from the role's `color` and `onColor`, as initials on a solid circle are drawn everywhere else. The role's pale `container` is chosen for an area as wide as the screen, and a circle of it 32dp across is lost on a white page.

A tone says nothing by itself: a screen reader hears the avatar's description and not its colour, so what a colour is to mean has to be in the words beside it.

Entries:

- `Primary`: The brand's colour: the person using the app.
- `Info`: A distinction with no judgement in it: a guest, a group, an account that is not a person.
- `Success`: Someone or something in good standing.
- `Warning`: Someone or something to look at.
- `Danger`: Someone or something that failed or is blocked.
- `Neutral`: No meaning at all: a grey for the initials to sit on. The default.

### AvatarStyle

`import com.pantrixui.components.elements.avatar.AvatarStyle`, from `com.pantrixui:components`

```kotlin
class AvatarStyle(
    public val size: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val initialsScale: Float = Float.NaN,
    public val iconScale: Float = Float.NaN
) : PantrixStyle<AvatarStyle>
```

`PantrixAvatar`'s geometry: how large it is, what its corners are, and how much of it the initials or the icon take.

An avatar is a circle on every platform, 40dp across on Android and iOS, as Material 3 has it beside a list's row, and 32dp on the desktop and the web, where a row is shorter. The initials are four tenths of it and the icon six: an icon fills its box less than a capital letter fills its line, and at these shares the two look alike.

The two shares are fractions of the avatar and not sizes of their own, so an avatar given a size, a large one at the top of a profile or a small one in a comment, keeps its proportions without a second style.

None of the four follows the density: an avatar is a row's identity, and a denser row does not make it smaller.

Parameters:

- `size: Dp`: The avatar's width and height.
- `shape: ShapeSpec`: The avatar's corners: the round end of the brand's shape scale, a circle, unless a brand or a theme asks for a step of it or a shape of its own.
- `initialsScale: Float`: The height the initials are set in, as a fraction of the avatar's shorter side.
- `iconScale: Float`: The icon's width and height, as a fraction of the avatar's shorter side.

### AvatarColors

`import com.pantrixui.components.elements.avatar.AvatarColors`, from `com.pantrixui:components`

```kotlin
data class AvatarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

What `PantrixAvatar` is painted with, for an avatar that does not take its tone's colours: a colour that is set is used, and one that is left out stays the tone's.

```kotlin
PantrixAvatar(
    contentDescription = team.name,
    initials = team.initials,
    colors = AvatarColors(container = team.color, content = team.onColor)
)
```

A fill given here that is one of the theme's own colours brings the colour the theme pairs with it for what is drawn on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The fill under the initials or the icon, which a picture covers. The `color` of the tone's role.
- `content: Color`: The initials or the icon: the colour that reads on `container`. The `onColor` of the tone's role.

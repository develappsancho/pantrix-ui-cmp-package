# Badge

A small mark that stands on something else: a count, or just a dot. It tells of unread messages, of notifications that are waiting, of whether a person is online. By itself it says nothing; it is read together with the icon or the avatar it sits on.

- `PantrixBadge` (`com.pantrixui.components.elements.badge`, `com.pantrixui:components`): A count or a status dot for another element, hidden from screen readers unless it is described. Keywords: count, notification dot, status dot, indicator, unread, counter.
- `PantrixBadgedBox` (`com.pantrixui.components.elements.badge`, `com.pantrixui:components`): Puts a badge on a corner of its content, on the box around it or on the circle in it, without changing the content's size. Keywords: badge on icon, notification badge, icon with count, corner badge, overlay badge.

## Features

- **A count or a dot.** With a `count` the badge is a pill that writes the number; without one, a dot. A number of one digit sits in a circle.
- **A count that overflows.** A number above `maxCount` is written "99+", and the pill stops growing there.
- **Zero is a count too.** Zero is drawn as "0": taking the badge away when there is nothing left to count is the caller's to do. A number below zero is drawn as "0" as well.
- **Six tones.** `tone` fills the badge from one of the theme's roles; `colors` gives a colour that no role has.
- **On the corner of something.** `PantrixBadgedBox` sets the badge on a corner of its content; on round content it sets it on the circle, not on the box (`BadgeOverlap.Circular`).
- **Screen reader.** Without a `contentDescription` the badge is hidden from screen readers: a lone "3" read out says nothing, and the number is said by the description of the element the badge sits on.
- **Font scale.** The number is set in the theme's `caption` style and grows with the system's text size, and the pill with it.

## Usage

### An unread count on an icon, which the icon says

```kotlin
PantrixBadgedBox(badge = { PantrixBadge(count = unread, tagKey = "unread") }) {
    PantrixIcon(
        imageVector = PantrixIcons.Inbox,
        contentDescription = pluralStringResource(Res.plurals.inbox_unread, unread, unread)
    )
}
```

### A status dot that says what it means

```kotlin
PantrixBadge(tone = BadgeTone.Success, contentDescription = stringResource(Res.string.online))
```

### In colours of its own

```kotlin
PantrixBadge(
    count = offers,
    colors = BadgeColors(container = campaign.color, content = campaign.onColor),
    contentDescription = stringResource(Res.string.new_offers, offers)
)
```

### A count on a tab's icon

```kotlin
PantrixBadgedBox(badge = { if (unread > 0) PantrixBadge(count = unread) }) {
    PantrixIcon(imageVector = PantrixIcons.Inbox, contentDescription = null)
}
```

### A status dot on a round avatar, at the bottom where lines end

```kotlin
PantrixBadgedBox(
    badge = { PantrixBadge(tone = BadgeTone.Success, contentDescription = stringResource(Res.string.online)) },
    alignment = Alignment.BottomEnd,
    overlap = BadgeOverlap.Circular
) {
    PantrixAvatar(contentDescription = member.name, initials = member.initials)
}
```

## Examples

### Dot and count

Without a `count` the badge is a dot; with one it is a pill that grows wider with its number. A number of one digit is a full circle, and the pill is never narrower than it is tall.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadge()
    PantrixBadge(count = 3)
    PantrixBadge(count = 12)
    PantrixBadge(count = 128)
}
```

### A count that overflows

A number above `maxCount` is not written; the limit and a plus are written in its place: the default limit is 99. The pill stops growing there, and does not cover the icon it sits on. The last badge's limit is 9.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadge(count = 99)
    PantrixBadge(count = 100)
    PantrixBadge(count = 2500)
    PantrixBadge(count = 12, maxCount = 9)
}
```

### Tones

`tone` fills the badge with the colour of one of the theme's roles, and writes the number in the colour that reads on it. The default tone is `Danger`: a badge mostly tells of something that needs looking at. The top row has a number in every tone, and the one under it a dot in every tone.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    BadgeTone.entries.forEachIndexed { index, tone ->
        PantrixBadge(count = TONE_COUNTS[index], tone = tone, tagKey = "tone_${tone.name}")
    }
}
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    BadgeTone.entries.forEach { tone -> PantrixBadge(tone = tone) }
}

private val TONE_COUNTS = listOf(1, 12, 5, 8, 120, 0)
```

### On the corner of an icon

`PantrixBadgedBox` sets the badge on a corner of its content: by default the top corner on the side where lines end.

The badge is hidden from screen readers; the icon's own description says the number ("Inbox, 5 unread"). When the number gets down to zero no badge is put there at all: it is the caller that does this, not the badge. Raise the number with the buttons: past 99 it reads "99+", and the pill grows away from the icon.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var unread by rememberSaveable { mutableIntStateOf(START_UNREAD) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadgedBox(badge = { if (unread > 0) PantrixBadge(count = unread, tagKey = "unread") }) {
        PantrixIcon(
            imageVector = PantrixIcons.Inbox,
            contentDescription = if (unread > 0) "Inbox, $unread unread" else "Inbox",
            tagKey = "inbox"
        )
    }
    PantrixButton(
        text = "+1",
        onClick = { unread += 1 },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "one_more"
    )
    PantrixButton(
        text = "+50",
        onClick = { unread += MANY },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "many_more"
    )
    PantrixButton(
        text = "Mark as read",
        onClick = { unread = 0 },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        tagKey = "read"
    )
}

private const val START_UNREAD = 5

private const val MANY = 50
```

### On avatars

On round content the badge stands on the circle, not on the corner of the box: `overlap = BadgeOverlap.Circular`. `alignment` says which corner; the status dot is at the bottom, on the side where lines end.

The status dots are made larger with `BadgeStyle(dotSize = 12.dp)`: large enough to be made out on an avatar. The avatar's description says what the dot means ("İbrahim Öztürk, online"); the dot is hidden from screen readers.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.badge.BadgeOverlap
import com.pantrixui.components.elements.badge.BadgeStyle
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val statusDot = BadgeStyle(dotSize = 12.dp)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixBadgedBox(
        badge = { PantrixBadge(count = 2, tagKey = "messages") },
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(contentDescription = "Ayşe Yılmaz, 2 new messages", initials = "AY", tagKey = "badged_ayse")
    }
    PantrixBadgedBox(
        badge = { PantrixBadge(tone = BadgeTone.Success, style = statusDot, tagKey = "online") },
        alignment = Alignment.BottomEnd,
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(
            contentDescription = "İbrahim Öztürk, online",
            initials = "İÖ",
            tone = AvatarTone.Info,
            tagKey = "badged_ibrahim"
        )
    }
    PantrixBadgedBox(
        badge = { PantrixBadge(tone = BadgeTone.Neutral, style = statusDot, tagKey = "offline") },
        alignment = Alignment.BottomEnd,
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(
            contentDescription = "ilker kaya, offline",
            initials = "ik",
            tone = AvatarTone.Success,
            tagKey = "badged_ilker"
        )
    }
    PantrixBadgedBox(
        badge = { PantrixBadge(count = MANY * 3, tagKey = "team") },
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(
            contentDescription = "Team, more than 99 new messages",
            icon = PantrixIcons.Person,
            tone = AvatarTone.Primary,
            tagKey = "badged_team"
        )
    }
}

private const val MANY = 50
```

### A colour and a description of its own

`colors` gives the badge a fill of the given colour, not of a tone: here the app's own purple, which is in none of the theme's roles. Only the fields that are set change; the tone still decides the rest.

These badges stand alone, not on an icon. So they say what they mean themselves: each is given a `contentDescription`, and a screen reader reads "4 new offers".

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.BadgeColors
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadge(count = 3, contentDescription = "3 new notifications", tagKey = "described")
    PantrixBadge(
        count = 4,
        colors = BadgeColors(container = own.color, content = own.onColor),
        contentDescription = "4 new offers",
        tagKey = "own_colors"
    )
}
```

What the code calls of the demo app itself, which an app writes for itself:

- `ownColors`: The "app's own colour" of the examples: a purple that is in none of the theme's roles. It is there to show what changes when a component is given `colors`; given one of the theme's roles, nobody could tell whether the colour came from the component's tone or from the parameter.

### Beside a text

A badge can stand on a text too. `PantrixBadgedBox` keeps the baseline of its content: with `alignByBaseline` the "new" label stands on the same line as the title beside it, and the dot on the label's corner.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(
        text = "Campaigns",
        modifier = Modifier.alignByBaseline(),
        style = PantrixTheme.typography.callout
    )
    PantrixBadgedBox(
        badge = { PantrixBadge(tone = BadgeTone.Primary, tagKey = "new") },
        modifier = Modifier.alignByBaseline()
    ) {
        PantrixText(text = "new", style = PantrixTheme.typography.footnote)
    }
}
```

## API

### PantrixBadge

`import com.pantrixui.components.elements.badge.PantrixBadge`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixBadge(
    modifier: Modifier = Modifier,
    count: Int? = null,
    maxCount: Int = 99,
    tone: BadgeTone = BadgeTone.Danger,
    colors: BadgeColors? = null,
    style: BadgeStyle? = null,
    contentDescription: String? = null,
    tagKey: String? = null
)
```

A count or a status dot, usually put on another element with `PantrixBadgedBox`.

Without a `count` the badge is a dot. With one it is a pill that grows with its number, and a circle around one digit. Above `maxCount` it reads that number and a plus, `99+` by default, and stops growing. Zero is drawn as `0`: taking a badge away when there is nothing to count is the caller's to do. A count below zero is drawn as `0` too: a number a server got wrong is no reason to bring an app down.

The number is set in the theme's caption type and grows with the font scale, and the pill with it. It is always at least as wide as it is tall.

Without a `contentDescription` the badge is hidden from screen readers. A lone "3" read out after an icon says nothing, so what the badge sits on should say it, "Inbox, 3 unread", and a badge says something of its own only where it stands alone. A badge is not pressed, and has no touch target.

Parameters:

- `modifier: Modifier`: the badge's modifier.
- `count: Int?`: the number to show, or null for a dot.
- `maxCount: Int`: the largest number that is written out. It has to be positive.
- `tone: BadgeTone`: the colour role the badge is filled from.
- `colors: BadgeColors?`: this badge's own colours, in place of its tone's: the ones it sets, with the tone's for the rest.
- `style: BadgeStyle?`: this call's own style: over every enclosing one and under the density. Only the fields it sets change, on every platform.
- `contentDescription: String?`: what a screen reader says for the badge, or null to hide the badge from it.
- `tagKey: String?`: the badge's automation key: it is `Badge_<tagKey>`, and is tagged only when given one.

### PantrixBadgedBox

`import com.pantrixui.components.elements.badge.PantrixBadgedBox`, from `com.pantrixui:components`

```kotlin
@Composable
fun PantrixBadgedBox(
    badge: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    alignment: Alignment = Alignment.TopEnd,
    overlap: BadgeOverlap = BadgeOverlap.Rectangular,
    content: @Composable () -> Unit
)
```

Puts `badge` on `content`, with its middle on a corner of it, and takes no room for it.

The box is as large as `content`. The badge hangs over its edge and pushes nothing aside, so a badge that comes and goes moves nothing around it. A parent that clips cuts what hangs over. The badge is as large as its number, whatever it sits on, and a baseline of `content` is the box's, so a badged label lines up with the text beside it. A badge wider than it is tall has its round end on the corner and grows away from the content, as the badge of a tab does on each platform: three digits cover no more of an icon than one.

`alignment` says which corner, or which edge: the top corner where lines end by default, which is the top left in a right-to-left layout. `overlap` says what the corners are corners of. Put the box around the icon itself: the corner of something larger, such as a button with its touch target, is far from what is drawn.

Parameters:

- `badge: @Composable () -> Unit`: what is put on the content: usually a `PantrixBadge`. Nothing, where there is nothing to show.
- `modifier: Modifier`: the box's modifier.
- `alignment: Alignment`: where on `content` the middle of the badge is.
- `overlap: BadgeOverlap`: whether that is on the box around `content`, or on the circle in it.
- `content: @Composable () -> Unit`: what the badge belongs to.

### BadgeTone

`import com.pantrixui.components.elements.badge.BadgeTone`, from `com.pantrixui:components`

```kotlin
enum class BadgeTone
```

How a badge is coloured: one of the theme's colour roles, so a brand changes every badge at once.

A badge is filled in every tone, from the role's `color` and `onColor`. It is a mark a few millimetres across with no room to be subtle: on the role's pale `container` a number reads as a stray digit and not as a badge, and a dot has nothing on it to hold a contrast with at all.

Entries:

- `Primary`: The brand's colour: a count that is good news, or one to notice without alarm.
- `Info`: Something worth knowing: a count of items, a new entry.
- `Success`: Something that worked or is well: a finished job, someone who is online.
- `Warning`: Something to look at before it becomes a problem.
- `Danger`: Something that needs attention: unread messages, failures. The default, as each platform's own badge is.
- `Neutral`: A count with no urgency at all.

### BadgeOverlap

`import com.pantrixui.components.elements.badge.BadgeOverlap`, from `com.pantrixui:components`

```kotlin
enum class BadgeOverlap
```

How a badge lies on what it is the badge of, in a `PantrixBadgedBox`.

Entries:

- `Rectangular`: On the box around it: its corner or its edge. For an icon, a label, a picture with corners. The default.
- `Circular`: On the circle inside that box. For a round avatar, whose own edge is well inside the corners of its box: a badge on the corner would hang beside it and not on it.

### BadgeStyle

`import com.pantrixui.components.elements.badge.BadgeStyle`, from `com.pantrixui:components`

```kotlin
class BadgeStyle(
    public val dotSize: Dp = Dp.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified
) : PantrixStyle<BadgeStyle>
```

`PantrixBadge`'s geometry: a dot where there is nothing to count, and otherwise a pill that grows with its number.

The pill is 16dp tall and the dot 6dp across, as Material 3 has its large and its small badge, and a little larger on iOS, after the badge of its tab bar. The pill is as wide as it is tall at the least on every platform, so one digit sits in a circle.

The pill's height, its least width and its padding follow the density, since they are the room around the number. The dot does not: it is a mark, and a mark that shrank with a denser screen would be harder to see where there is more to look at.

Parameters:

- `dotSize: Dp`: The dot's width and height.
- `height: Dp`: The pill's height. A number set larger than it has room for, at a large font scale, makes the pill taller.
- `minWidth: Dp`: The pill's least width. The pill is never narrower than it is tall, whatever this says.
- `horizontalPadding: Dp`: The room on each side of the number, which is what makes the pill wider than it is tall as the number grows.

### BadgeColors

`import com.pantrixui.components.elements.badge.BadgeColors`, from `com.pantrixui:components`

```kotlin
data class BadgeColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

What `PantrixBadge` is painted with, for a badge that does not take its tone's colours: a colour that is set is used, and one that is left out stays the tone's.

```kotlin
PantrixBadge(count = offers, colors = BadgeColors(container = brand, content = onBrand))
```

A fill given here that is one of the theme's own colours brings the colour the theme pairs with it for what is drawn on it, unless that is given too. A fill no role has does not: what reads on it is the caller's to give.

Parameters:

- `container: Color`: The badge's fill, and the whole of a dot. The `color` of the tone's role.
- `content: Color`: The number: the colour that reads on `container`. The `onColor` of the tone's role.

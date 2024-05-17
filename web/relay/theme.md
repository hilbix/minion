# `theme.js`

Everything is kept entirely in your local browser.  There are no dynamic pages needed.

> The relay **does not exist** today and is provided by some external URL.
> The idea behind this is that the user can save the preferred colors
> and/or automate the color selection or chose another color provider etc.

There is a [quickstart Copy&amp;Paste example](https://hilbix.github.io/minion/web/relay/theme-example.html).

You can save this somewhere else and try it out:

- This uses GitHub as CDN which probably is not what you want.
  - Also the URLs might change in future without prior notice.
  - So be sure to serve it from a location you are in control!
- `theme-example.css` uses the colors
  - Replace this with your "real" CSS file
- `theme-custom.css` sets the colors, when the selected theme is the Alien
  - (Double Click the switcher to get the Alien)
  - This file must contain the default for all colors
  - In future, the relay will allow the user to change these colors!
  - It will also allow to download a template of the next two files
- `theme-light.css` sets the colors, when the selected theme is the Sun
- `theme-dark.css` sets the colors, when the selected theme is the Moon
- `theme.css` contains the CSS for the theme switcher itself
- You do not need separate CSS files
  - At my side I have a script which generates these files for me
  - However this is probably completely unusable for others today


## Usage

In `<head>`:

```html
<link rel="stylesheet" type="text/css" href="theme-example.css">
<link rel="stylesheet" type="text/css" href="theme-custom.css">
<link rel="stylesheet" type="text/css" href="theme-light.css">
<link rel="stylesheet" type="text/css" href="theme-dark.css">
<link rel="stylesheet" type="text/css" href="theme.css">
```

In your `.css` files use:

- `var(--C000000)` instead of `black`
- `var(--Cffffff)` instead of `white`
- `var(--Caabbcc)` instead of `#abc` color
- `var(--Cabcdef)` instead of `#abcdef` color
- `var(--CRrGgBbA0)` instead of `rgba(r,g,b,0)` or `rgba(r,g,b,0%)`
- `var(--CRrGgBbA1)` instead of `rgba(r,g,b,1)` or `rgba(r,g,b,100%)`
- `var(--CRrGgBbA_a)` instead of `rgba(r,g,b,0.a)`

> Currently a shell based automatic conversion script for this is missing, sorry.

In `theme-light.css`, `theme-dark.css` and `theme-custom.css` define all the variables.

> See example files.

In `<body>`, probably at the top, add:

```
<div class="theme bottom0 right0"><label><input id="theme" type="checkbox" checked=""><div></div></label></div>
<script src="theme.js"></script>
```

`theme.js` must go after the `DIV` such that it does not need to wait for the DOM to load.

Doubleclick the displayed switcher to enable the Alien (custom theme loader)
which allows to edit all the color variables yourself.

> In future if things evolve perhaps even more can be edited via variables.

You can use my theme loader (via the [Relay Minion](https://valentin.hilbig.de/minion/relay.html),
write your own or perhaps use some of somebody else.

> Note that the theme loader is not yet written.


## Notes

- `--C0` to `--C9` and `--Ca` to `--Cf` is reserved for colors.
- `--CR` is reserved for `rgba()`
- Please keep the `--C` prefix clear for future standardization
  -  If you have some idea, please try to coordinate first, such that we can agree to a single standard somehow!
- All other `--?` where `?` is not `C` are free to use, regardles if `?` is lowercase or uppercase or something else

Note that `--C` stands for `Color` or rather `Choser` and the relay name is `theme`.


## Communication

Communication is done via `.postMessage` from the main page to the popup.

The popup can be either a relay (in my case) or directly the editor (which then must fully speak the protocol.

> The relay idea is for debugging ease, as you can watch broadcast messages easily.

The relay relays JSON which contain following entries:

- `.b` for "broadcast identifier"
- `.c` for "command"
- `.d` for "destination"
- `.e` for "extended data"

### How it works

`theme.js` is entirely passive.  All it does is to open the relay as a popup.

The `relay` then sends a `ping` to `theme.js`

- `.b` is a random UUID which identifies the relay to `theme.js`
- `.c` is `ping`
- `.d` is just a counter
- `.e` is some "secret" which must be 

This is answered with a `pong` and the wanted destination.

T.B.D. (this is future work for now)


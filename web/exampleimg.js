#!/bin/bash
':' /*/
# vim: ft=bash : This looks better with bash syntax highlighting.
#
# To generate the example images, do: bash exampleimg.js
# To load the list of example images into JS, do as usual: <script src="exampleimg.js"></script>
# To access the list of example images in JS, do as usual: $EXAMPLE_IMAGES[n]
#
#
# This bash initialization part is hidden inside a JavaScript comment.
# The first executed lineline must use some command, which opens a JavaScript comment and is silent in /bin/bash
# The bash functions ',' 'const' ']' allow bash to process the list of images
# Sadly, I found no simple way to add 'use strict', too
#
# You need `pango` and `figlet` installed.
# As it took less than a minute to find this trick, it is dedicated Public Domain.

,() { t="$(figlet "$1")" && pango-view --no-display -o "example-$1.png" --font='mono bold 30' <(echo "$t") && echo "generated $1"; }
const() { :; }	# ignore the const line
]() { exit; }	# end of script at the ] line

# The following ',' lines are executed by /bin/bash, too, so you need to stay with the line format as given!
# The next line ends the JavaScript comment.  By purpose, it looks like the line which openend the comment.
':' /*/

const $EXAMPLE_IMAGES = [ void 0	// add the list of example images to create below:
 , 'hello'
 , 'world'
 , 'test'
 , 'foobar'
]					// bash ends to execute here
.filter(_ => _).map(_ => `example-${_}.png`);

//console.log($EXAMPLE_IMAGES);


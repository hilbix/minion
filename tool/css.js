#!/usr/bin/env nodejs
// css.js < CSS.orig 2> CSS.gen | sort -u >CSS.colors
'use strict';

// Is there really no CSS parser out there, which is able to detect and handle all value properly, like embedded colors etc.?

const CleanCSS = require('clean-css');	// apt install node-clean-css
const fs = require('fs');

const colors =
{ inherit:0
, transparent:0
// generated with CSSCOLORS.sh:
, aliceblue:'#f0f8ff'
, antiquewhite:'#faebd7'
, aqua:'#00ffff'
, aquamarine:'#7fffd4'
, azure:'#f0ffff'
, beige:'#f5f5dc'
, bisque:'#ffe4c4'
, black:'#000000'
, blanchedalmond:'#ffebcd'
, blue:'#0000ff'
, blueviolet:'#8a2be2'
, brown:'#a52a2a'
, burlywood:'#deb887'
, cadetblue:'#5f9ea0'
, chartreuse:'#7fff00'
, chocolate:'#d2691e'
, coral:'#ff7f50'
, cornflowerblue:'#6495ed'
, cornsilk:'#fff8dc'
, crimson:'#dc143c'
, cyan:'#00ffff'
, darkblue:'#00008b'
, darkcyan:'#008b8b'
, darkgoldenrod:'#b8860b'
, darkgray:'#a9a9a9'
, darkgreen:'#006400'
, darkgrey:'#a9a9a9'
, darkkhaki:'#bdb76b'
, darkmagenta:'#8b008b'
, darkolivegreen:'#556b2f'
, darkorange:'#ff8c00'
, darkorchid:'#9932cc'
, darkred:'#8b0000'
, darksalmon:'#e9967a'
, darkseagreen:'#8fbc8f'
, darkslateblue:'#483d8b'
, darkslategray:'#2f4f4f'
, darkslategrey:'#2f4f4f'
, darkturquoise:'#00ced1'
, darkviolet:'#9400d3'
, deeppink:'#ff1493'
, deepskyblue:'#00bfff'
, dimgray:'#696969'
, dimgrey:'#696969'
, dodgerblue:'#1e90ff'
, firebrick:'#b22222'
, floralwhite:'#fffaf0'
, forestgreen:'#228b22'
, fuchsia:'#ff00ff'
, gainsboro:'#dcdcdc'
, ghostwhite:'#f8f8ff'
, gold:'#ffd700'
, goldenrod:'#daa520'
, gray:'#808080'
, green:'#008000'
, greenyellow:'#adff2f'
, grey:'#808080'
, honeydew:'#f0fff0'
, hotpink:'#ff69b4'
, indianred:'#cd5c5c'
, indigo:'#4b0082'
, ivory:'#fffff0'
, khaki:'#f0e68c'
, lavender:'#e6e6fa'
, lavenderblush:'#fff0f5'
, lawngreen:'#7cfc00'
, lemonchiffon:'#fffacd'
, lightblue:'#add8e6'
, lightcoral:'#f08080'
, lightcyan:'#e0ffff'
, lightgoldenrodyellow:'#fafad2'
, lightgray:'#d3d3d3'
, lightgreen:'#90ee90'
, lightgrey:'#d3d3d3'
, lightpink:'#ffb6c1'
, lightsalmon:'#ffa07a'
, lightseagreen:'#20b2aa'
, lightskyblue:'#87cefa'
, lightslategray:'#778899'
, lightslategrey:'#778899'
, lightsteelblue:'#b0c4de'
, lightyellow:'#ffffe0'
, lime:'#00ff00'
, limegreen:'#32cd32'
, linen:'#faf0e6'
, magenta:'#ff00ff'
, maroon:'#800000'
, mediumaquamarine:'#66cdaa'
, mediumblue:'#0000cd'
, mediumorchid:'#ba55d3'
, mediumpurple:'#9370db'
, mediumseagreen:'#3cb371'
, mediumslateblue:'#7b68ee'
, mediumspringgreen:'#00fa9a'
, mediumturquoise:'#48d1cc'
, mediumvioletred:'#c71585'
, midnightblue:'#191970'
, mintcream:'#f5fffa'
, mistyrose:'#ffe4e1'
, moccasin:'#ffe4b5'
, navajowhite:'#ffdead'
, navy:'#000080'
, oldlace:'#fdf5e6'
, olive:'#808000'
, olivedrab:'#6b8e23'
, orange:'#ffa500'
, orangered:'#ff4500'
, orchid:'#da70d6'
, palegoldenrod:'#eee8aa'
, palegreen:'#98fb98'
, paleturquoise:'#afeeee'
, palevioletred:'#db7093'
, papayawhip:'#ffefd5'
, peachpuff:'#ffdab9'
, peru:'#cd853f'
, pink:'#ffc0cb'
, plum:'#dda0dd'
, powderblue:'#b0e0e6'
, purple:'#800080'
, red:'#ff0000'
, rosybrown:'#bc8f8f'
, royalblue:'#4169e1'
, saddlebrown:'#8b4513'
, salmon:'#fa8072'
, sandybrown:'#f4a460'
, seagreen:'#2e8b57'
, seashell:'#fff5ee'
, sienna:'#a0522d'
, silver:'#c0c0c0'
, skyblue:'#87ceeb'
, slateblue:'#6a5acd'
, slategray:'#708090'
, slategrey:'#708090'
, snow:'#fffafa'
, springgreen:'#00ff7f'
, steelblue:'#4682b4'
, tan:'#d2b48c'
, teal:'#008080'
, thistle:'#d8bfd8'
, tomato:'#ff6347'
, turquoise:'#40e0d0'
, violet:'#ee82ee'
, wheat:'#f5deb3'
, white:'#ffffff'
, whitesmoke:'#f5f5f5'
, yellow:'#ffff00'
, yellowgreen:'#9acd32'
};

function write3(x) { fs.writeFileSync(2, x); }
function write4(x) { fs.writeFileSync(1, x); }

// As apparently nobody has written a reusable value parser
// I must re-invent the wheel here.  Yes, no reusable parser here, either.

function color(v)
{
  let n, r;

  if (v in colors) r=v=colors[v] || v;

  if (v.startsWith('#'))
    {
      v	= v.toLowerCase(v);
      if (v.length===4)
        v=`#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
      n	= v.replace(/#/g,'C');
    }
  if (v.startsWith('rgba('))
    n = v.replace(/rgba[(]/g,'CR').replace(/[)]/g,'').replace(',','G').replace(',','B').replace(',','A').replace(/[.]/g,'_');

  if (!n)
    return r;
  write4(`--${n}:${v};\n`);
  return `var(--${n})`;
}

// something which cannot contain '('
// (hence it does not contain ')' either
// split into `,` separated values
// colors can be only the first part of such splitted values
function subterm(x)
{
  const o = [];
  for (const t of x)
    {
      const s = t.split(' ');
      const c = color(s[0]);
      if (c) s[0]	= c;
      o.push(s.join(' '));
    }
  return o.join(',');	// can be ''
}

// something like rgba() or calc() or ..
function terms(x)
{
  const c = color(x);
  if (c)
    return [c];

  const t = x.split('(');		// $thing($term)$whatever
  const s = t.shift().split(',');	// $th..,$ing
  const l = s.pop();			// $ing
  const o = [subterm(s)];		// $th..
  if (s.length)
    o.push(',');

//  console.log({x,t,s,l,o});
  if (!t.length)			// just $thing
    {
      o.push(subterm([l]));		// process $ing
      return o;	// no ( in $term
    }

  // $ing($term)$whatever where $th.. is processed above

  const r = t.join('(').split(')');	// $term)$whatever
  const e = subterm(r.pop());		// process $whatever
  if (e === '')
    {
      // tail recursion, called from below
      o.push(subterm([l]));			// process $ing
      o.push('(');
      o.push(term(r.join(')')).join(''));	// process $term
      o.push(')');
      //o.push(e);				// ''
      return o;
    }
  o.push(term(`${l}(${r.join(')')})`).join(''));// process $ing($term)
  o.push(e);
  return o;
}

function parse_str(t, end)
{
  const o = [end];
  while (t.s.length)
    {
      const c = t.s.shift();
      o.push(c);
      if (c === end)
        return o.join('');
      if (c === '\\')
        {
          const n = t.s.shift();
          if (!n)
            break;
          o.push(n);
        }
    }
  return parse_error(t,o,'unexpected end of string ${end}');
}

function parse_term(t)
{
  const o = [];
  let l = [];

  function clr()
    {
      if (l.length)
        {
          const s = l.join('');
          const x = color(s);
          o.push(x ? x : s);
        }
      l	 = [];
    }
  while (t.s.length)
    {
      const c = t.s.shift();
      switch (c)
        {
        case ' ':
        case ',':
          clr();
          o.push(c);
          continue;

        case '"':
        case "'":
          clr();
          o.push(parse_str(t, c));
          continue;

        case ')':
          clr();
          t.s.unshift(c);
          return o.join('');

        case '(':
          l.push('(');
          l.push(parse_term(t));
          if (')' !== t.s[0])
            {
              clr();
              return parse_error(t,o, '")" expected');
            }
          t.s.shift();
          l.push(')');
          clr();
          continue;
        }
      l.push(c);
    }
  clr();
  return o.join('');
}

function parse_error(t,o,err)
{
  const s = t.s.join('');
  t.s	= s;
  console.log(`syntax error, ${err}:`, t);
  t.s	= [];
  o.push(s);
  return o.join('');
}

function term(o)
{
  const t = {o,s:Array.from(o)};
  const r = parse_term(t);
  return t.s.length ? parse_error(t,[r], '")" unexpected') : r;
}

const fix = { level1: { value: function (name, value, options)
  {
    const r = term(value);
//    if (r !== value) console.log({r,value});
    return r;
  }}};
const input = fs.readFileSync(process.stdin.fd, 'UTF-8');
const out = new CleanCSS({format:'beautify', inline:false, plugins:[fix]}).minify(input);

write3(out.styles);



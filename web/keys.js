'use strict';

function getRgbFromValue(e)
{
  const v = e.$value;	// #rrggbb

  const x = _ => parseInt(v.substr(_,2),16);
  return [ x(1), x(3), x(5) ];
}

function fixRgbValue(e)
{
  return fixIntValue(e,0,255);
}

function fixIntValue(e,lo,hi)
{
  const v = e.$value;
  let n = parseInt(v);
  if (!n) return 0;
  if (lo !== void 0 && n < lo)
    n	= lo;
  if (hi !== void 0 && n > hi)
    n	= hi;
  if (v !== `${n}`)
    e.$value	= n;
  return n;
}

function setIntValue(e, v)
{
  e.$value	= v;
  return v;
}

function hex(h)
{
  return `0${Number(h).toString(16)}`.substr(-2);
}

const pad = (p, v) => { const j = toJ(v); return p<0 ? j.padStart(-p) : j.padEnd(p) };

const PROPS =
  { key:	13
  , code:	15
  , location:	1
  , repeat:	5
  , isComposing:5
  , ctrlKey:	5
  , shiftKey:	5
  , altKey:	5
  , metaKey:	5
  , charCode:	-5
  , keyCode:	-5
  , which:	-5
  };

export class Main
  {
  constructor(_)
    {
      _.clr();
      this.div	= _.DIV.button('clear output', _ => this.clr()).button('COPY', _ => this.copy());
      this.out	= _.DIV;
    }
  async main(modules)
    {
      this.clr();

      window.addEventListener('keydown'	, _ => this.ev(0, _));
      window.addEventListener('keypress', _ => this.ev(1, _));
      window.addEventListener('keyup'	, _ => this.ev(2, _));

      const j = sessionStorage.getItem(document.title);
      if (j)
        fromJ(j).forEach(_ => this.add(_));
    }
  copy()
    {
      const drain = this.div.SPAN.text(copyTextToClip(this.out.$text));
      setTimeout(() => drain.rm(), 5000);
    }
  clr()
    {
      this.list	= [];
      this.c	= '[';
      this.now	= void 0;
      this.out.clr();
      this.out.text(`function send(el) { (async (json) =>
  { for (const [t,s,d] of json)
      {
        s && await new Promise(_ => setTimeout(_, s));
        d && el.dispatchEvent(new KeyboardEvent(['keydown','keypress','keyup'][t], d));
      }
  })(`);
      this.pre	= this.out.PRE;
      this.out.SPAN.text('])};');
    }
  ev(t,_)
    {
//      _.preventDefault();

      const now	= Date.now();
      const s	= now - (this.now ?? now);
      this.now	= now;
      this.add([t,s>1 ? s : 1, Object.fromEntries(Object.keys(PROPS).map(k => [k,_[k]]))]);
      sessionStorage.setItem(document.title, toJ(this.list));
    }
  add(x)
    {
      this.list.push(x);
      const [t,s,j] = x;
      this.pre.text('\n', this.c, '[',t,',',pad(-6,s));
      this.c	= ',';
      let c = ',{';
      for (const [k,v] of Object.entries(PROPS))
        {
          this.pre.text(c, k, ':', pad(v, j[k]));
          c = ',';
        }
      this.pre.text(c === ',' ? '}' : '', ']');
      this.pre.NEXT.show();
    }
  };


'use strict';

const CHAN = 'dots.chan';

const D = (...s) => console.warn(s);

const PREF =
  { dummy:0
  , grid: +20
  , gridcolor: [0,64,255,255]
  , background: [20,20,20,255]
  };

const RGB = ([r,g,b,a]) => `rgb(${r} ${g} ${b} / ${a})`;

const buttons =
  { main:	{type:'win'}
  , all:	{type:'win'}
  , box:	{type:'win'}
  , cmd:	{type:'win'}
  , disp:	{type:'win'}
  , log:	{type:'win'}
  , debug:	{type:'win'}
  };

class Reg
  {
    #reg = {}

    add(name,ob) { this.#reg[name] = new WeakRef(ob) };
    get find() { return name => this.#reg[name]?.deref() }
  };

class Dot
  {
  constructor(_)
    {
      this._	= _;
    }
  };

// Easy and clear option processing
// new Option('def', opts, def)	if opts is object, remembers opts else sets .def to opts.  alsoe .def set to def if undefined
// .i('opt', FROM, TO)		.opt set to FROM if undefined, else kept in the range of FROM to TO
// .c('col', defaultcolor)	.col set to defaultcolor if undefined
class Options
  {
  constructor(e,o,def)
    {
      this._	= isObject(o) ? Object.assign({}, o) : {[e]:o};
      if (this._[e] === void 0)
        this._[e] = def;
    }
  i(e,from,to)	// integer value in range from..to inclusive
    {
      let v	= this._[e] === void 0 ? from : this._[e]|0;
      from	= from|0;
      to	= to|0;
      if (v<from)
        v	= from;
      else if (v>to)
        v	= to;
      this._[e] = v;
      return this;
    }
  c(e,color)	// color value ([r,g,b,a] or single integer expanded to gray)
    {
      const v = [];
      const o = mkArr(this._[e]);
      const d = this._[e]|0;		// default filler is 0 or black or "missing color"

      for (let i = o.length > 4 ? 4 : o.length; --i>=0; )
        {
          let c = o[i];
          if (c === void 0) continue;
          c = c|0;
          v[i] = c<0 ? 0 : c>255 ? 255 : c;
        }
      while (v.length < 3)
        v.push(d);
      if (v.length < 4)
        v.push(255);

      this._[e]	= v;
    }
  };

// Types of cursors:
//
//  \ /
//   X      x: cursor position is at X (this is the default cursor)
//  / \
//
//   _
//  / \
// { . }    o: cursor position is middle dot
//  \_/
//
//
//   |
//   :      |: cursor position is in middle of :
//   |
//
//
//   .      .: cursor position is at the dot
//
// Options:
// m	Mode		'x' 'o' '|' '.' defaults to 'x' if unknown
// t	Thickness	1 to 3
// s	Size		3 to 6
// w	Width		0 to 1000, 0=Thickness + Size + Thickness + Thickness + Thickness + Size + Thickness
// h	Height		0 to 1000, 0=Width
// c	Color		white
// b	Background	Inverse of Color
//
// Cursor is drawn in a color
// Cursor is surrounded by the inverse color
// Everything else stays transparent
class Cursor extends Options
  {
  constructor(opt)
    {
      super('m', opt, 'x');		// m:mode
      this.i('s', 3,6);			// s:size
      this.i('t', 1,3);			// t:thickness
      this.i('w', 0,100);		// w:width, 0=default
      this.i('h', 0,100);		// h:height, 0=default
      this.c('c', [255,255,255,255]);	// c:color
      this.c('b', [255-this._.c[0], 255-this._.c[1], 255-this._.c[2], 255]);	// b:background-color
      this.mk();
    }
  mk()
    {
      const m	= this.c = E.CANVAS;
      const _	= m.$.getContext('2d');
      const w	= this._.w || 5*this._.t+ 2*this._.s;
      const h	= this._.h || w;
      _.clearRect(0,0,w,h);
      _.strokeStyle = RGB(this._.c || [255,255,255,255]);
      _.beginPath();
      switch (this._.m)
        {
        case 'o':
        case '|':
        case '.':
        default:
          break;
        }
//      o.c	= m;
//      return o.$;
    }
  }

class Button
  {
  static #reg = new Reg();
  static find = Button.#reg.find;

  msgreset() { const _ = this._msg; this._msg = []; return _ }
  msg(data) { this.msgreset().forEach(_ => _(data)) }
  send(cmd,msg) { msg = Object.assign({cmd,data:{cmd:'but',but:this.name}},msg); return new Promise(ok => { this._msg.push(ok); this._.send(this.w,msg) }) }

  constructor(klass, _, [k,v])
    {
//      console.log(Button.#reg, Button.find);
      Button.#reg.add(this.name=k, this);
      this._	= klass;
      this.v	= v;
      this.w	= v.what || k;
      this.t	= v.type;
      this.msgreset();

      _.text(k).on('click', () => this.click());
      this[`init_${this.t}`]();
    }
  click()
    {
      try {
        this._.inf(`button ${this.name} clicked`);
        this[`click_${this.t}`]();
      } catch (_) {
        this._.inf(`button ${this.name} click failed: ${_}`);
      }
    }

  async init_win()
    {
      this.known	= false;
      for (let delay=5000;; delay+=5000)
        {
          this.send('who').then(() => this.known=true);
          await SleeP(delay);
          if (this.known) break;
          await this._.infs(`click on '${this.name}' to open ${this.w} window`);
        }
    }
  click_win()
    {
      if (this.known) return this.send('focus');
      const u = new URL(window.location.href); 
      u.hash	= `#${this.w}`;
      this.known = window.open(u.href, `dots ${this.w}`, 'noopener');
    }
  };

export class Main
  {
  send(dst,data)
    {
      this.bc.postMessage(Object.assign({src:this.me,dst}, data));
    }
  msg(data)
    {
      const _	= data.data;
      if (this.msg_debug)
        this.msg_debug(_);

      if (_.dst !== this.me) return;

      let r	= {};
      switch (_.cmd)
        {
        default:	return this.inf(`unknown msg: ${toJ(_)}`);
        case 'who':	r	= _.data; break;
        case 'but':	return Button.find(_.but).msg(_);
        case 'focus':	return this.focus();
        }
      this.send(_.src, r);
    }
  focus()
    {
      // The problem is, that web site security does no more allow to focus to a window!
      // This is a PITA, as there should be a way to allow certain windows/URLs to focus themself!
      window.focus();
    }
  infn(reset)
    {
      if (!reset && this._infn) return;
      const kick = () => { const i = this._infn; this._infn = void 0; i && clearTimeout(i) };
      const trig = () => { kick(); this._infn = setTimeout(cycle, 3000) };
      const cycle = () =>
        {
          this._infn = void 0;
          if (!this._infs.length) return;
          if (this._i.$text === this._infs[0][1])
            this._infs.shift()[0]();
          this._i.$text	= this._infs[0]?.[1] || `DOTS ${this.me} (not ready yet)`;
          trig();
        };
      trig();
    }
  log(s)	{ this.send('log', s) }
  inf(s)	{ this.log(s); this._i.$text	= `${s}`; this.infn(1) }
  infs(s)	{ const p = new Promise(ok => this._infs.push([ok,s])); this.infn(0); return p }
  constructor(_)
    {
      this._infs= [];
      this.bc	= new BroadcastChannel(CHAN);
      this.bc.onmessage = _ => this.msg(_);

      this.me	= window.location.hash.split('#',2)[1]||'main';
      const b	= E('minionmenu').SPAN;
      this._i	= E('inf');		// info output area
      this._b	= Object.entries(buttons).map(_ => new Button(this, b.BUTTON, _));

      this.draw=single_run(() => this.draw_().catch(_ => this.inf(`draw failed: ${_}`)));

      this.inf(document.title = `DOTS ${this.me}`);
      this[`init_${this.me}`](_, b);
    }

  init_main(_, b)
    {
      // Main canvas
      const c = this.c	= window._c_ = _.clr().CANVAS.style({background:RGB(PREF.background)}).addclass('flexcol', 'hidecursor');
      c.on('mousemove', _ => this.move(_));
      c.on('resize', _ => this.draw());
      window.visualViewport.onresize = () => this.draw();

      // Mouse cursor
      const m = new Cursor('x');

      this.draw();
      console.log('C', c.$);
    }
  getxy(_)
    {
      const [x,y] = this.c.$xy;
      const g	= PREF.grid;
      const m	= !g ? 1 : g<0 ? -g : g;
      const n	= (m/2)|0;
      const a	= ((_.x - x)/m)|0;
      const b	= ((_.y - y)/m)|0;
      return [n+m*a,n+m*b,a,b];
    }
  move(_)
    {
      window._e_ = _;

      const [x,y,a,b] = this.getxy(_);
      this.inf(`${x} ${y} (${a} ${b} @ ${PREF.grid})`);
    }
   async draw_()
     {
       const wh		= this.c.$wh;
       const v		= window.visualViewport;
       const s		= v.scale || 1;
       this.inf(`draw ${wh} @ ${v.scale}`);
       const w		= Math.floor(wh[0] / s);
       const h		= Math.floor(wh[1] / s);
       const c		= this.c.$;
       if (c.width !== w || c.height !== h)
         {
           if (c.width>10 || c.height>10)
             {
               c.width	= 1;
               c.height	= 1;
               await SleeP(1);
               return this.draw_();		// allow DIV to shrink
             }
           c.width	= w;
           c.height	= h;
           await SleeP(1);
           return this.draw_();			// allow resize to work
         }
       const _		= c.getContext('2d');
       _.clearRect(0,0,w,h);

       const m = PREF.grid;
       if (m>0)
         {
           // fast dots
           const n		= (m/2) | 0;
           const i		= _.getImageData(0,0,w,h);
           const d		= i.data;
           const [r,g,b,a]	= PREF.gridcolor || [0,0,0,255];
           for (let x = n; x < w; x+= m)
             for (let y = n; y < h; y+= m)
               {
                 const p = 4 * ( x + y*w );
                 d[p]	= r;
                 d[p+1]	= g;
                 d[p+2]	= b;
                 d[p+3]	= a;
               }
           _.putImageData(i,0,0);
         }
       else if (m<0)
         {
           // lines
           const n		= (-m/2) | 0;		// 1=>0 2=>1 3=>1 4=>2 5=>2 usw.
           _.strokeStyle = RGB(PREF.gridcolor || [0,0,0,255]);
           _.beginPath();
           for (let x = n; x < w; x-= m)
             {
               _.moveTo(x,0);
               _.lineTo(x,h);
             }
           for (let y = n; y < h; y-= m)
             {
               _.moveTo(0,y);
               _.lineTo(w,y);
             }
           _.stroke();
         }
    }
  init_display()
    {
    }
  init_output()
    {
    }
  init_command()
    {
    }
  init_palette()
    {
    }
  init_log()
    {
    }
  init_debug(_, b)
    {
      console.log({_:_.$,b:b.$});
    }

  main()
    {
    }
  };


'use strict';

const CHAN = 'dots.chan';

const D = (...s) => console.warn(s);

const PREF =
  { dummy:0
  , grid: 8
  , gridcolor: [255,255,255,255]
  };

class Dot
  {
  constructor(_)
    {
      this._	= _;
    }
  };

const buttons =
  { all: {type:'win', what:'output'}
  , box: {type:'win', what:'palette'}
  , cmd: {type:'win', what:'command'}
  , disp: {type:'win', what:'display'}
  , log: {type:'win', what:'log'}
  };

class Reg
  {
    #reg = {}

    add(name,ob) { this.#reg[name] = new WeakRef(ob) };
    get find() { return name => this.#reg[name]?.deref() } };

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
      this.w	= v.what;
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
      console.log('msg', _);
      if (_.dst !== this.me) return;

      let r	= {};
      switch (_.cmd)
        {
        default:	this.inf(`unknown msg: ${toJ(_)}`); return;
        case 'who':	r	= _.data; break;
        case 'but':	return Button.find(_.but).msg(_);
        }
      this.send(_.src, r);
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
      const b	= E('menu').SPAN;
      this._i	= E('inf');		// info output area
      this._b	= Object.entries(buttons).map(_ => new Button(this, b.BUTTON, _));

      this.draw=single_run(() => this.draw_().catch(_ => this.inf(`draw failed: ${_}`)));

      this.inf(`DOTS ${this.me}`);
      this[`init_${this.me}`](_, b);
    }

  init_main(_, b)
    {
      const c = this.c	= _.clr()._MK('canvas').style({background:'#333'}).addclass('flexcol');
      c.on('mousemove', _ => { const xy = c.$xy; window.e = _; this.inf(`${_.x-xy[0]} ${_.y-xy[1]}`) });
      c.on('resize', _ => this.draw());
      window.visualViewport.onresize = () => this.draw();
      this.draw();

      window.c = c;
      console.log('C', c.$);
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
           const i		= _.getImageData(0,0,w,h);
           const d		= i.data;
           const [r,g,b,a]	= PREF.gridcolor || [0,0,0,255];
           for (let x = m-1; x < w; x+= m)
             for (let y = m-1; y < h; y+= m)
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
           const [r,g,b,a]	= PREF.gridcolor || [0,0,0,255];
           _.strokeStyle = 'rgb(${r} ${g} ${b} / ${a})';
           _.beginPath();
           for (let x = -m+1; x < w; x-= m)
             {
               _.moveTo(x,0);
               _.lineTo(x,h);
             }
           for (let y = -m+1; y < h; y-= m)
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

  main()
    {
    }
  };


'use strict';
// for a in hello world test foobar; do pango-view --no-display -o "cmp-$a.png" --font='mono bold 30' <(figlet "$a"); done

function draw(canvas, dx,dy, p1x,p1y,p2x,p2y,x,y,r)
{
  canvas.data('dx',dx).data('dy',dy);

  const c = canvas.$.getContext('2d');
  c.clearRect(0,0,c.canvas.width,c.canvas.height);
//  console.log(c.canvas.width, c.canvas.height);
//  console.log([dx,dy],{p1x,p1y,p2x,p2y,x,y,r,hit});

  c.beginPath();
  c.lineWidth = 2;
  c.strokeStyle = 'green';
  c.moveTo(dx+p1x, dy+p1y);
  c.lineTo(dx+p2x, dy+p2y);
  c.stroke();
  
  c.beginPath();
  c.strokeStyle = 'black';
  c.fillStyle = 'red';
  c.arc(dx+x, dy+y, r, 0, 2*Math.PI);
  //c.fill();
  c.stroke();
}

function mko(ent)
{
  if (typeof ent === 'string')	ent	= ent.split(' ');
  return function (o)
    {
      const r = {};
      for (const x of ent)
        r[x] = o[x];
      return r;
    }
}

const ev2o	= mko('type bubbles cancelable composed isTrusted timeStamp');
const dt2o	= mko('dropEffect effectAllowed files items types');
const f2o	= mko('lastModified lastModifiedDate name webkitRelativePath size type');
const e2o	= mko('type name message cause detail');

function dump(...a)
{
  const r = [];
  for (const x of a)
    {
      try {
        r.push(toJ(x));
      } catch (e) {
        r.push(`${x} error ${e}`);
      }
    }
  return r.join(' ');
}

// This should be implemented using Proxy()
// to be able to use .[]
class Value extends OnOff
  {
  constructor(name, ...a)
    {
      super();

      let n = a.length;
      let v = a;

      if (n===1 && a[0] === (a[0]|0))
        v	= new Array(a[0]);
      else if (!n)
        v	= [];

      this.name	= name;
      this.v	= v;
      this.e	= [];
    }
  get $()	{ this.v[0] }
  set $(v)	{ this.SET(0,v) }
  GET(n)
    {
      if ((n|0) !== n) throw `${n} nonnumeric`;
      if (n<0 || n>=this.v.length) throw `${n} out of bounds`;
      return this.v[n];
    }
  SET(n,v)
    {
      if ((n|0) !== n) throw `${n} nonnumeric`;
      if (n<0 || n>=this.v.length) throw `${n} out of bounds`;

      const old = this.v[n];
      if (old === v) return old;

      console.log('set', n, old, v);
      this.v[n]	= v;

      // update the edits
      const e = this.e[n];
      if (!e) return;
      for (let i=e.length; --i>=0; )
        {
          const r = e[i].deref();
          if (!r)
            e.splice(i,1);
          else
            r.value(v);
        }
      return old;
    }
  Set(n,v)
    {
      return this.SET(n,v) !== v;
    }
  set(n,v)
    {
      this.SET(n,v);
      return this;
    }
  mkref(n,e)
    {
      (this.e[n] || (this.e[n]=[])).push(new WeakRef(e));
      return e;
    }
  EDIT()
    {
      const r = [];

      r.push(this.t || this.name);
      this.v.forEach((v,k) => r.push(this.mkref(k, E().INPUT.value(v).on('change', (_,me)=>
        {
          this.SET(k,me.$value);
          this.trigger(me.$value);
        }))));
      return r;
    }
  edit(tr)
    {
      tr.td(...this.EDIT());
      return this;
    }
  };

class Main
  {
  constructor()
    {
      const x	= this.x	= {};
      const e	= this.e	= E('main').clr();

      // Parameter inputs
      const t	= this.t	= e.DIV;

      // Drawing area
      const d	= this.d	= e.DIV;
      d.style({position:'relative',overflow:'auto',maxWidth:'99vw',maxHeight:'99vh'});

      // Output area
      e.DIV.BUTTON.text('clear').on('click', () => o.clr());
      const o	= this.o	= e.DIV;
      this.ocnt	= 0;

      // Background drawing canvas
      // (this also fills the DIV as everything else is absolutely positioned)
      const c	= this.c	= d._MK('CANVAS');
      c.style({backgroundColor:'black',border:'3px solid red',margin:'0px'});


      // add the 4 images
      // 01
      // 23
      const i	= this.i	= [];
      for (const n of 'hello world test foobar'.split(' '))
        {
          const p = d.IMG;
          const src = `cmp-${n}.png`;
          p.on('load', () => {});
          p.on('error', _ => { this.dump(`img error ${src}`, e2o(_)); this.dump('perhaps disable adblocker?'); _.preventDefault() });
          p.style({top:0,left:0,position:'absolute',border:'6px solid blue',overflow:'hidden'});
          i.push(p);

          p.src(src);
//          p.Loaded();
        }

      this.handles(d);

//      const xy	= this.xy	= new Value('xy', 0,0);
      const wh	= this.wh	= new Value('wh', 600,400);
      const hh	= this.hh	= new Value('hand', 0,0);
      const ww	= this.ww	= new Value('size', 3,2);

//      xy.edit(t.TR).on(_ => this.run());
      wh.edit(t.TR).on(_ => this.run());
      hh.edit(t.TR).on(_ => this.handle());
      ww.edit(t.TR).on(_ => this.handle());

      for (const x of 'drag dragend dragenter dragleave dragover dragstart'.split(' '))
        window.addEventListener
          ( x
          , ev => { this.dump(x, ev); ev.stopPropagation(); ev.preventDefault(); ev.stopImmediatePropagation() }
          , {capture:true}
          );
      window.addEventListener('drop', ev =>
        {
          ev.stopPropagation(); ev.preventDefault(); ev.stopImmediatePropagation();
          this.dump('drop', dt2o(ev.dataTransfer), ev2o(ev));
          for (const f of ev.dataTransfer.files)
            {
              this.dump('file', f2o(f));
              this.show(E().IMG.src(URL.createObjectURL(f)));
            }
        });
    }
  handles(d)
    {
      let act, x, y;

      // Handles:
      //    0
      //    0
      // 1112111
      //    0
      //    0
      const h	= this.h	= [];

      let k;
      const cursors = ['col-resize','row-resize','move'];
      for (const n in cursors)
        {
          const a = (n|0)+1;
          k	=  d.DIV.style({top:0,left:0,width:0,height:0,position:'absolute',cursor:cursors[n]});
//          k.on('mouseup',   _ => {act=void 0});
          k.on('mousedown', (_,e) =>
            {
              _.preventDefault()

              const xy	= e.$XYWH;
              // remember the relative position of the click
              // plus the handle which was used
              act	= { n, x:_.pageX-xy.x, y:_.pageY-xy.y };
              console.error(act, xy, _.pageX, _.pageY);
            });
          h[n] = k;
        }

      // k now is the middle knob
      k.style({border:'7px solid green'});

      window.addEventListener('mousemove', _ =>
        {
          if (!act)
            return;
          if (!_.buttons)
            {
              act	= 0;
              console.error('off');
              return;
            }

          _.preventDefault();

          const xy = this.d.$XYWH;

          const move = {};
          if (act.n != 1)
            move.x = _.pageX-xy.x - act.x;
          if (act.n != 0)
            move.y = _.pageY-xy.y - act.y;
          this.handle(move);
        });
    }
  handle(xy)
    {
      let x = xy && 'x' in xy ? xy.x : this.hh.GET(0)|0;
      let y = xy && 'y' in xy ? xy.y : this.hh.GET(1)|0;
      const w = this.wh.GET(0)|0;
      const h = this.wh.GET(1)|0;
      const hw = this.ww.GET(0)|0;	// handle width (x2)
      const kw = this.ww.GET(1)|0;	// knob width (x2)
      if (x<0) x=0;
      if (x>w+hw+hw) x=w+hw+hw;
      if (y<0) y=0;
      if (y>h+hw+hw) y=h+hw+hw;
      let alt = 0;
      alt |= this.hh.Set(0,x);
      alt |= this.hh.Set(1,y);
      if (xy && !alt) return;

      const k = this.h;

      k[0].x(x).h(h+hw+hw).style({border:`${hw}px solid yellow`});
      k[1].y(y).w(w+hw+hw).style({border:`${hw}px solid yellow`});
      k[2].x(x-kw).y(y-kw).style({border:`${hw+kw}px solid green`});

      this.c.style({border:`${hw+hw}px solid red`});
      const img = (n, a,b,c,d) =>
        {
          const i = this.i[n];
          i.style({border:`${hw+hw}px solid blue`,clip:`rect(${b}px,${c}px,${d}px,${a}px)`});
        };

      img(0,   0,  0, x+hw,    y+hw);
      img(1, x+1,  0, w+hw+hw, y+hw);
      img(2,   0,y+1, x+hw,    h+hw+hw);
      img(3, x+1,y+1, w+hw+hw, h+hw+hw);

      this.dump('handle', x,y);
    }
  show(x)
    {
      this.o.prep(E().DIV.add(E(x)));
    }
  dump(x,...y)
    {
      this.show(E().text(`${++this.ocnt} ${x}${y.length ? ':' : ''} ${dump(...y)}`));
    }
  canvas(e, c)
    {
    }
  run(...a)
    {
      this.dump('run', this.wh.GET(0), this.wh.GET(1), ...a);
      this.c.attr({width:`${this.wh.GET(0)}px`, height:`${this.wh.GET(1)}px`});
      draw(this.c, 100,100, 100,100, 30,30, 20,20, 10,10);
      this.handle();
    }
  };

new Main().run();


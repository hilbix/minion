'use strict';

class Main
  {
  constructor()
    {
//      this.err	= E('err');
      const e	= E('main').clr();
      this.err	= e.PRE;
      this.ses	= this.setup(e, window.sessionStorage, 'Session store (per tab)');
      this.loc	= this.setup(e, window.localStorage,   'Local store (permanent)');
      window.onstorage = _ => this.ev(_);
    }
  ev(e)
    {
      CONSOLE('event', e);
      this.err.$text	= JSON.stringify({typ:e.type, url:e.url, key:e.key, new:e.newValue, old:e.oldValue}, void 0, 2);
      this.run();
    }
  run()
    {
      this.show(this.loc);
      this.show(this.ses);
    }
  setup(e,s,title)
    {
      const n = e.DIV.text(title, ': ').SPAN;
      const t = e.TABLE;
      const tr = t.THEAD.TR;
      const b = tr.TD;
      const k = tr.TD.INPUT;
      const v = tr.TD.INPUT;
      const r = {s,t:t.TBODY,n,k,v};
      b.BUTTON.text('-').on('click', _ => { this.del(r); return 1 });
      b.BUTTON.text('+').on('click', _ => { s.setItem(k.$value, v.$value); this.show(r); return 1 });
      b.BUTTON.text('*').on('click', _ => { this.select(r,k) });
      return r;
    }
  select(w)
    {
      for (let r=w.t.FIRST; r; r=r.NEXT)
        {
          if (r.FIRST.FIRST.$checked) continue;

        }
    }
  del(w)
    {
      for (let r=w.t.FIRST; r; r=r.NEXT)
        {
          if (!r.FIRST.FIRST.$checked) continue;
          const k = r.FIRST.NEXT.FIRST.NEXT.$text;
          CONSOLE('del', k);
          w.s.removeItem(k);
        }
      this.show(w);
    }
  edit(w,e)
    {
      e = e.FIRST.NEXT;
      w.k.$value = e.FIRST.NEXT.$text;
      w.v.$value = e.NEXT.FIRST.NEXT.$text;
    }
  show(w)
    {
      const copy = (e,_) => tooLong(copyButton(e,_).SPAN, _);
      const iter = Object.getOwnPropertyNames(w.s).sort();

      w.n.$text = `${w.s.length} entries`;
      const t	= w.t.clr();
      for (let i=0; i<w.s.length; i++)
        {
          const k = w.s.key(i);
          const tr = t.TR.onb('click', _ => this.edit(w,tr));
          tr.TD.CHECKBOX.$$.text(i);
          tr.TD.run(copy,k);
          tr.TD.run(copy,w.s.getItem(k));
        }
    }
  };

new Main().run();


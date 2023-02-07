'use strict';

// XXX TODO XXX
// - select() (button *)
// - hiding of unselected
// - asynchronous stores
// - get rid of FIRST.NEXT and similar
// - paging
// - things like CouchDB
// - search
// - sort
// - prefix
// - auto-fitting on text entry boxes
// - Keyboard navigation (cursor keys, enter, etc.)
// XXX TODO XXX

class Main
  {
  constructor()
    {
//      this.err	= E('err');
      const e	= E('main').clr();
      this.err	= e.PRE;
      this.ses	= this.setup(e, window.sessionStorage, 'Session store (per tab)');
      this.but	= this.buttons(e.DIV);	// actually this.but is undefined
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
  buttons(e)
    {
      e.text('width:');
      for (const w of [20,40,60,80,100,150,200,250,400,500,600,750,999])
        e.BUTTON.text(w).on('click', _ => { this.set(this.ses,'max',w) && this.show(this.loc) });
    }
  setup(e,s,title)
    {
      const n = e.DIV.text(title, ': ').SPAN;
      const t = e.TABLE;
      const tr = t.THEAD.TR;
      const b = tr.TD.addclass('pre');
      const k = tr.TD.INPUT.addclass('w100');
      const v = tr.TD.INPUT.addclass('w100');
      const r = {s,t:t.TBODY,n,k,v};
      b.BUTTON.text('-').on('click', _ => { this.del(r); return 1 });
      b.BUTTON.text('+').on('click', _ => { this.set(r, k.$value, v.$value); return 1 });
      b.BUTTON.text('?').on('click', _ => { this.select(r,k.$value, v.$value) });
      return r;
    }
  set(w,k,v)
    {
      const was = w.s.getItem(k);
      if (was !== v)
        {
          w.s.setItem(k,v);
          w.dirt = 1;
        }
      return w.dirt && this.show(w);
    }
  select(w,k,v)
    {
      for (let r=w.t.FIRST; r; r=r.NEXT)
        {
          if (r.FIRST.FIRST.$checked) continue;
          // XXX TODO XXX implement
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
          w.dirt = 1;
        }
      return w.dirt && this.show(w);
    }
  edit(w,k,v)
    {
      w.k.$value = k;
      w.v.$value = v;
    }
  show(w)
    {
      const iter = Object.getOwnPropertyNames(w.s).sort();

      const wasdirty = w.dirt;
      delete w.dirt;

      w.n.$text = `${w.s.length} entries`;
      const t	= w.t.clr();
      for (let i=0; i<w.s.length; i++)
        {
          const k = w.s.key(i);
	  const v = w.s.getItem(k);
          const tr = t.TR.onb('click', _ => this.edit(w,k,v));
          tr.TD.addclass('pre').CHECKBOX.$$.text(i);
          tooLongCopyTD(tr, k);
          tooLongCopyTD(tr, v);
        }

      return wasdirty;
    }
  };

new Main().run();


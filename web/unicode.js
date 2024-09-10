'use strict';

const uni = _ => _.toString(16).toUpperCase().padStart(6,'0');

export class Main
  {
  async main()
    {
      this.err	= E('err');
      const _	= E('main').clr();
      this.note	= E('minionmenu');
      const nav	= E('nav');
      this.tab	= _.DIV;
      this.width= 32;
      for (let i=0; i<=0x10; i++)
        nav.BUTTON.text(i.toString(16).toUpperCase().padStart(2,'0')).click(_ => this.table(_), i*256);
      this.table();
    }
  table(base=0)
    {
      if (this._next)
        clearTimeout(this._next);

      this.tab.clr();
      this.base	= base;
      this.n	= 0;
//      E(document).on('scroll', () => this.scroll());
      this.show(this._sema = {});
    }
  scroll()
    {
    }
  check(p)
    {
      try {
        return eval(`const xx={}, ${p}=xx; ${p}===xx`);
      } catch (e) {}
      return false;
    }
  stop()
    {
      this._sema	= void 0;
    }

  show(sema)
    {
      if (sema !== this._sema) return;

      const t = this.tab.hr.TABLE;
      const m = 256 / this.width;
      let s, S;

      for (let i=0; i<m; i++)
        {
          const r	= t.TR;
          r.TD.TT.text(uni(this.base * 256 + i * this.width));
          for (let j=0; j<this.width; j++)
            {
              const c = this.base * 256 + i*this.width + j;
//              r.TD.style({minWidth:'4px'}).addclass('noborder');
//              r.TD.TT.text(c.toString(16).toUpperCase().padStart(5,'0'));
              const p = String.fromCodePoint(c);
              const d = r.TD.style({minWidth:'1.1em',textAlign:'center'});
              d.TT.text(p);
              d.on('mouseover', () => { s.$text = p; S.$text = uni(c) });
              if (this.check(p))
                d.style({border:'2px solid green'});
              else
                d.style({border:'1px solid orange'});
            }
          if (!i)
            S = r.TD.attr({textAlign:'center',minWidth:'5em'}).TT;
          else if (i==1)
            s = r.TD.attr({rowspan:m,textAlign:'center'}).TT.style({border:'1px solid blue', zoom:'700%'});
        }
      t.TR;

      this.base++;
      this.n++;
      if (this.n<256)
        {
          this.note.$text = this.base;
          requestIdleCallback(() => setTimeout(() => this.show(sema), 250));
        }
      else
        this.note.clr();
    }
  };


'use strict';

class Main
  {
  constructor()
    {
      this.err	= E('err');
      this.main	= E('main').clr();
    }

  run()
    {
      this.show();
    }
  show()
    {
      const e = this.main.clr();
      const b = e.DIV;
      b.BUTTON.text('STORE').on('click', _ => this.copy(_));
      b.text('following does not work yet: ');
      b.BUTTON.text('STAR').on('click', _ => 0);
      b.BUTTON.text('DEL').on('click', _ => 0);
      const j = localStorage.getItem('clip');
      this.clips = j ? fromJ(j) : {};
      if (!this.clips.b) this.clips.b=[];
      if (!this.clips.c) this.clips.c=[];
      this.dump(this.star = e.DIV, this.clips.b);
      this.dump(this.clip = e.DIV, this.clips.c);
    }
  dump(e, l)
    {
      if (!l) return;
      for (const c of l)
        e.add(this.mk(c));
    }
  mk(c)
    {
      const e = E.SPAN;
      e
      .BUTTON
      .pre()
      .text(this.short(c))
      .on('click', () =>
        copyTextToClip(c)
        .then(_ =>
          setTimeout(_ => _.remove(), 1500, e.SPAN.text(_))
        )
      );
      return e;
    }
  async copy()
    {
      const t = await copyTextFromClip();
      this.clips.c.unshift(t);
      this.put();
      this.clip.prep(this.mk(t));
    }
  put()
    {
      localStorage.setItem('clip', JSON.stringify(this.clips));
    }
  short(s)
    {
      if (s.length<42) return s;
      s = s.trim();
      const l = s.length;
      if (l<42) return s;
      return `${s.substring(0,19)}...${s.substring(l-19)}`;
    }
  };

new Main().run();


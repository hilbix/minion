'use strict';

class Main
  {
  v='2';

  constructor()
    {
      this.main	= E('main').clr();
    }

  run()
    {
      this.show();
//      Promise.reject('test');
    }
  show()
    {
      const e = this.main.clr();
      e.DIV.text(` (version ${this.v}) `).A.href('broadcast.html').target().text('open other window(s) in the same browser to recv/send broadcast');
      const m = e.DIV.TEXTAREA.attr({placeholder:'Message',cols:80,rows:10}).onkey('keydown',
        { 'C_Enter C_NumpadEnter':_ => this.send(m.$value) && m.$.select()
        , 'Escape':_ => m.editval('\t')
        })
      const t = e.DIV.BUTTON.text('send').on('click', _ => { this.send(m.$value) }).$$.text(' (CTRL+Enter to send) (ESC key inserts a TAB)');
      e.HR;
      const x = e.DIV;
      x.text('Channel: ');
      const c = x.INPUT.attr({placeholder:'Broadcast Channel'}).onkey('keydown', { 'Enter NumpadEnter':_ => this.sub(c.$value,_) && m.focus() });
      const b = x.BUTTON.text('subscribe').on('click', _ => { this.sub(c.$value,_); m.focus() })
      x.text(' | ').BUTTON.text('(clear output below)').on('click', _ => { this.l.clr() })
      e.HR;
      this.l = e.DIV.addclass('border');
      this.i = e.TABLE;
      if (c.$text.trim()=='')
        c.focus();
      else
        {
          this.sub(c.$value);
          m.focus();
        }
    }
  sub(c)
    {
      CONSOLE('sub', c);
      if (this.c)
        {
          this.c.close();
          this.prep(`unsubscribed from: ${toJ(this.cn)}`);
        }
      this.c	= new BroadcastChannel(c);
      this.cn	= c;
      if (!this.c)
        return this.err(`failed to subscribe to: ${toJ(c)}`);
      this.c.onmessage = _ => this.recv(_);
      return this.prep(`subscribed to: ${toJ(c)}`);
    }
  send(m)
    {
      if (!this.c)
        return this.err('please subscribe to a channel first');
      CONSOLE('send', this.cn, m);
      return this.prep(`sent ${toJ(this.cn)}: ${toJ(m)}`, this.c.postMessage(m));
    }
  recv(m)
    {
      CONSOLE('recv', this.cn, m);
      const i = {};
      for (const x of 'data origin lastEventId source ports isTrusted eventPhase target timeStamp type'.split(' '))
        i[x] = m[x];
      return this.prep(`recv: ${toJ(m.data)}`, i);
    }
  err(t,m) { return this._prep(t,m,'bgred') }
  prep(t,m) { return this._prep(t,m) }
  _prep(t,m,c)
    {
      const lock = {};
      const e = E.DIV.text(t).if$(c,E.addclass,c);
      this.l.prep(e);
      this.info(m);
      if (m)
        e.on('mouseover', () => this.info(m, lock)).on('mouseout', () => this.info(void 0, lock));
      return this;
    }
  info(m, lock)
    {
      if (m === void 0)
        {
          if (this._l === lock)
            this._l = void 0;
          return this;
        }
      if (this._l && !lock)
         return this;
      this._l = lock;

      this.i.clr();

      this._info = m;
      if (m)
        for (const [k,v] of Object.entries(m))
          this.i.TR.td(k).td(toJ(v));
    }
  };

new Main().run();


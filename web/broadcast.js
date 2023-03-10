'use strict';

class Main
  {
  v='1';

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
      e.DIV.text(` (version ${this.v} `).A.href('broadcast.html').target().text('open other window(s) in the same browser to recv/send broadcast');
      const m = e.DIV.TEXTAREA.attr({placeholder:'Message',cols:80,rows:10}).onkey('keypress', { 'C_Enter C_NumpadEnter':_ => this.send(m.$value) && m.$.select() });
      const t = e.DIV.BUTTON.text('send').on('click', _ => { this.send(m.$value) }).$$.text(' (CTRL+Enter to send)');
      e.HR;
      const x = e.DIV;
      x.text('Channel: ');
      const c = x.INPUT.attr({placeholder:'Broadcast Channel'}).onkey('keypress', { 'Enter NumpadEnter':_ => this.sub(c.$value,_) && m.focus() });
      const b = x.BUTTON.text('subscribe').on('click', _ => { this.sub(c.$value,_); m.focus() })

      this.l = e.DIV;
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
        this.c.close();
      this.c	= new BroadcastChannel(c);
      this.cn	= c;
      if (!this.c)
        return this.err(`failed to subscribe to: ${toJ(HE(c))}`);
      this.c.onmessage = _ => this.recv(_);
      return this.prep(`subscribed to: ${toJ(HE(c))}`);
    }
  send(m)
    {
      if (!this.c)
        return this.err('please subscribe to a channel first');
      CONSOLE('send', this.cn, m);
      this.c.postMessage(m);
      return this.prep(`sent: ${toJ(HE(m))}`, m);
    }
  recv(m)
    {
      CONSOLE('recv', this.cn, m);
      return this.prep(`recv: ${toJ(HE(m.data))}`, m);
    }
  err(t,m) { return this._prep(t,m,'bgred') }
  prep(t,m) { return this._prep(t,m) }
  _prep(t,m,c)
    {
      const e = E.DIV.text(t).if$(c,E.addclass,c);
      this.l.prep(e);
      return this;
    }
  };

new Main().run();


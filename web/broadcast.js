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
      const e = this.main.clr().DIV;
      const t = e.BUTTON.text('send').on('click', _ => { this.send(m.$value) });
      e.text(` (version ${this.v}`);
      e.A.href('broadcast.html').target().text('open other window(s) in the same browser to recv/send broadcast');
      e.BR;
      const m = e.TEXTAREA.attr({placeholder:'Message'});
      e.HR;
      e.text('Channel:');
      const c = e.INPUT.attr({placeholder:'Broadcast Channel'});
      const b = e.BUTTON.text('subscribe').on('click', _ => { this.sub(c.$value,_) });
      this.l = e.SPAN;
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
        return this.l.clr().addclass('bgred').text(`failed to subscribe to: ${toJ(HE(c))}`);
      this.l.clr().rmclass('bgred').text(`subscribed to: ${toJ(HE(c))}`);
      this.c.onmessage = _ => this.recv(_);
    }
  send(m)
    {
      if (!this.c)
        return this.l.clr().addclass('bgred').text('please subscribe to a channel first');
      CONSOLE('send', this.cn, m);
      this.c.postMessage(m);
      this.l.prep(E.DIV.text(`sent: ${toJ(HE(m))}`));
    }
  recv(m)
    {
      CONSOLE('recv', this.cn, m);
      this.l.prep(E.DIV.text(`recv: ${toJ(HE(m.data))}`));
    }
  };

new Main().run();


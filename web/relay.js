'use strict';
// c:ping d:count e:sec1

const channel = 'minion.relay';

export
class Main
  {
  constructor()
    {
      this.err	= E('err');
      this.e	= E('main').clr();
      this.o	= window.opener;
      this.cnt	= (Math.random() * 1000000)|0;
      this.org	= location.hash?.substring(1) || '*';
      this.sec0	= location.hash?.substring(1) || crypto.randomUUID();
      this.sec1	= crypto.randomUUID();
      this.sec2	= crypto.randomUUID();	// this one should use asymmetric keys
      this.unk	= {};
      this._trg	= {c:'error',d:'error'};

      window.onmessage = _ => this.recv(_);
    }
  log(...s)
    {
      this.e.prep(E.DIV.text(...s));
      return this;
    }
  once(what, ...s)
    {
      if (!what) what=s[0];
      if (this.unk[what]) return this;
      this.unk[what] = 1;
      return this.log(s.map(_ => 'string' === typeof _ ? _ : toJ(_)).join(' '));
    }
  main()
    {
      this.e.DIV.text('Web Relay for ').a(`broadcast.html#${channel}`, `channel ${channel}`, channel);
      if (!this.o)
        return this.e.DIV.text('There is nothing to do as this here must be openend from another window');
      this.bc		= new BroadcastChannel(channel);
      this.bc.onmessage	= _ => this.bcin(_);
      return this.Ping().then(_ => this
        .trg(_)
        .bcout('reg', this._trg.d, this._trg.e)
        .log('Relaying messages for ', E.A.href(`trg-${this._trg.d}.html`).text(this._trg.d).target(this._trg.d), ' ', this._trg.e)
        );
      return this;
    }
  close()
    {
      return this.log('opening window was closed, ceasing function (you can close this window now)').bcout('bye', this._trg.d, this._trg.e);
    }
  trg(_)
    {
      if ('object' !== typeof _ || !_.d || !_.e)
        return this.once(void 0, 'got garbage as target', _);
      this._trg	= {d:_.d, e:_.e};
      return this;
    }
  Ping()
    {
      if (this.o.closed)
        {
          this.close();
          return;
        }
      const p = PO();
      this.pong	= p.ok;
      const d	= ++this.cnt;
      this.send('ping', d, this.sec1);
      return p.p;
    }
  send(c,d,e)
    {
      if (this.o.closed)
        return;
      this.o.postMessage({b:this.sec0,c,d,e}, this.org);
      return this;
    }
  recv(_)
    {
      if (_.source !== this.o) return;
      const {b,c,d,e} = _.data;
      if (b !== this.sec0)
        return this.once(void 0, 'parent secret mismatch', _.data);
      switch (c)
        {
        case 'pong':	if (e===this.sec1) { const fn = this.pong; this.pong = void 0; fn?.(d) }; return;
        case 'msg':	return this.bcout(c,d,e);
        }
      return this.once(`recv ${c}`, 'unknown message from parent', _.data);
    }
  bcout(c,d,e)
    {
      this.bc.postMessage({b:this.sec2,c,d,e});
      return this;
    }
  bcin(_)
    {
      console.log(_);
      const {b,c,d,e} = _;
      if (b !== this.sec2)
        return this.once(`relay ${b}`, 'ignore other relay relay', b);
      switch (c)
        {
        case 'reg':	return this;
        case 'bye':	return this;
        case 'msg':	return this.send(c,d,e);
        }
      return this.once(`bc ${c}`, 'unknown channel message', _);
    }
  };


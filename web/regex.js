'use strict';

class Main
  {
  constructor()
    {
      this.main	= E('main').clr();
      E('right').center();
      this.cnt=0;
    }

  run()
    {
      const getter = 
        [ _ => void 0
        , _ => _.$value
        , _ => _.$checked
        , _ => _.$checked
        ];
      const setter =
        [ ()    => void 0
        , (_,v) => E(_).$value = v
        , (_,v) => E(_).$checked = v
        , (_,v) => E(_).$checked = v
        ];
      const evt =
        [ ['click']
        , ['change','keyup']
        , ['change']
        , ['change']
        ];
      const all =
        { regex: 1
        , text: 1
	, match: 0
        , a: 2
        , d: 2
        , g: 2
        , i: 2
        , m: 2
        , s: 2
        , u: 2
	, full: 3
        };
      const call =
        [ _ => { const a=act[_]; if (a) { const e=E('text'); e.$value = a(e.$value); match() }}
	];
      const act =
        { fromJ
	, toJ
	, encodeURIComponent
	, decodeURIComponent
	, HE
	, decodeHTML
	};

      // this is too complex.  We need .keep('name', provider, ..) for this, where session is default provider
      const store = () => { for (const e in all) { const g = getter[all[e]](E(e)); if (g !== void 0) sessionStorage.setItem(e, toJ(g)) } };
      const match = once_per_cycle(() =>
        {
          E('cnt').$text = ++this.cnt;
          store();
          let flags	= '';
          for (const a in all)
            if (all[a]==2 && E(a).$checked)	// I am not happy with this
              flags += a;

          this.match(E('regex').$value, E('text').$value, flags);
        });

      const val=[];
      for (const x in Object.assign({},all,act))
        {
          const e = E(x);
          const n = all[x]|0;
	  const g = getter[n];
	  const c = call[n];
          for (const t of evt[n])
            {
              console.log('on', x, t);
              e.on(t, _ =>	// .on('a b') must be made possible in future!
	        {
		  if (c)
		    {
		      console.log(_);
		      return c(x);
		    }
		  const v=g(e);
		  if (val[x]!==v)
		    match();
		  val[x]=v
	        });
            }

          let v = sessionStorage.getItem(x);
          if (v === null) continue;

          if (n === 1 && getter[n](e) != '') continue;

          setter[n](x, JSON.parse(v));
        }

      match();
    }

  match(regex, text, flags)
    {
      let round = 0;
      const rrr = E('round').clr().text('0');

      const sem = {};
      this._sem = sem;

      const t = this.main.clr().TABLE;

      const positive = () =>
        {
	  // XXX TODO XXX look for more matches?
          console.log('positive');
        }
      const negative = () =>
        {
          let ret = false;
	  // XXX TODO XXX this loop may take too long and make the browser unresponsive
	  // Options:
	  // setTimeout here, too
	  // Worker
          for (let i=regex.length; --i>0; )
            {
              const part = regex.substring(0,i);
              const [ok,res] = this.getmatch(part, text, flags);
              if (ok)
                {
                  t.TR.td(`first ${i} work:`).td(toJ(part));
                  t.add(res);
                  regex = regex.substring(i);
                  ret = true;
                  break;
                }
            }
          for (let i=0; ++i<regex.length; )
            {
              const part = regex.substring(i);
              const [ok,res] = this.getmatch(part, text, flags)
              if (ok)
                {
                  t.TR.td(`last ${regex.length-i} work:`).td(toJ(part));
                  t.add(res);
                  regex = regex.substring(0,i);
                  ret = true;
                  break;
                }
            }
          if (ret)
            t.TR.td('remains').td(regex);
          return ret;
        }

      if (flags.startsWith('a'))
        {
          flags	= flags.substr(1);
          regex = `^${regex}$`;
        }

      console.log('matching', {regex,text,flags});

      rrr.$text = '(full match)';

      const	[ok,res,detail] = this.getmatch(regex, text, flags);
      t.add(ok ? res ? res :  (E.TR.TD.text(`${detail}`).attr({colspan:2}).$$) : res ? E.TR.td(`${res}`).td(`${detail}`) : (E.TR.TD.text(`${detail}`).attr({colspan:2}).$$));

      const part = t.TR.TD.text('(partial match search follows)').attr({colspan:2});
      const search = () =>
        {
          if (this._sem !== sem) return;
          if (ok ? positive() : negative())
            {
              console.log('loop', {regex, text, flags});
              rrr.$text = `(${++round})`;
              setTimeout(search,100);
            }
	  else
	    {
              part.$text = '(done)';
              rrr.$text = `(${round} rounds)`;
	    }
        }

      rrr.$text = '(partial match)';
      setTimeout(search);

//      t.TR.TD.text('remaining bits').attr({colspan:2});
//      t.TR.td('regex').td(regex);
//      t.TR.td('text').td(toJ(text));
   }
  getmatch(regex, text, flags)
    {
      let ret;

//      console.log('try', {regex,text,flags});
      try {
        const reg = new RegExp(regex, flags);
        ret = reg.exec(text);
      } catch (e) {
        return [false,'error',e];
      }

      if (ret === null)
        return [text === '' ? true : false, null, 'no match'];
      if (ret.length === 0)
        return [text === '' ? true : false, null, 'empty match'];

      const r = E();
      for (let a=0; a<ret.length; a++)
        r.TR.td(`${a}`).td(this.cp(ret[a]));
      if (ret.groups)
        for (const a in ret.groups)
          r.TR.td(a).td(this.cp(this.ret.groups[a]));

      return [true, r];
    }
  cp(o)
    {
      const s = this.abbrev(o);
      return [copyButton(E.SPAN,s), s];
    }
  abbrev(o)
    {
      const n = 200;
      const s = toJ(o);
      if (!o || E('full').$checked)
        return s;
      if (s.length>n)
        {
	  const n2 = (n/2)|0;
	  return [ s.substr(0,n2), E.BUTTON.text('...'), s.substr(s.length-n2) ];
	}
      return s;
    }
  };

new Main().run();


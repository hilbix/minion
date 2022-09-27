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
        ];
      const setter =
        [ ()    => void 0
        , (_,v) => E(_).$value = v
        , (_,v) => E(_).$checked = v
        ];
      const evt =
        [ ['click']
        , ['change','keyup']
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
        };

      // this is too complex.  We need .keep('name', provider, ..) for this, where session is default provider
      const store = () => { for (const e in all) { const g = getter[all[e]](E(e)); if (g !== void 0) sessionStorage.setItem(e, JSON.stringify(g)) } };
      const match = once_per_cycle(() =>
        {
          E('cnt').$text = ++this.cnt;
          store();
          let flags	= '';
          for (const a in all)
            if (all[a]==2 && E(a).$checked)
              flags += a;

          this.match(E('regex').$value, E('text').$value, flags);
        });

      for (const x in all)
        {
          const e = E(x);
          const n = all[x];
          for (const t of evt[n])
            {
              console.log('on', x, t);
              e.on(t, _ => { match() });	// .on('a b') must be made possible in future!
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
      const t = this.main.clr().TABLE;

      const positive = () =>
        {
          console.log('positive');
        }
      const negative = () =>
        {
          let ret = false;
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

      const	[ok,res] = this.getmatch(regex, text, flags);
      t.add(res);
      t.TR.TD.text('(partial match search follows)').attr({colspan:2});
      while (ok ? positive() : negative())
        console.log('loop', {regex, text, flags});

//      t.TR.TD.text('remaining bits').attr({colspan:2});
//      t.TR.td('regex').td(regex);
//      t.TR.td('text').td(toJ(text));
   }
  getmatch(regex, text, flags)
    {
      const r = E();
      let ret;

//      console.log('try', {regex,text,flags});
      try {
        const reg = new RegExp(regex, flags);
        ret = reg.exec(text);
      } catch (e) {
        return [false,r.TR.td('error:').td(`${e}`)];
      }

      if (ret === null)
        return [text === '' ? true : false, r.TR.TD.text('no match').attr({colspan:2}).$$];
      if (ret.length === 0)
        return [text === '' ? true : false, r.TR.TD.text('empty match').attr({colspan:2}).$$];

      for (let a=0; a<ret.length; a++)
        r.TR.td(`${a}`).td(JSON.stringify(ret[a]));
      if (ret.groups)
        for (const a in ret.groups)
          r.TR.td(a).td(JSON.stringify(ret.groups[a]));

      return [true, r];
    }
  };

new Main().run();


'use strict';

class Main
  {
  constructor()
    {
      this.err	= E('err');
      this.main	= E('main').clr();
      this.tok	= 'github-token';
//      this.load('https://cdn.skypack.dev/octokit');
      window.addEventListener('storage', _ => { console.log('STORAGE'); this.storagevent() });
      // WTF why are essential things missing in FF?
      // WTF why aren't they working as advertised?
      // WTF why aren't things documented properly?
      // BTW following does not work (as expected?)
      navigator.permissions.query({name:'clipboard-read'}).then(_ =>
        {
	  console.log('CLIP read', _);
	}, _ =>
	{
	  console.log('CLIP read', _);
	});
      navigator.permissions.query({name:'clipboard-write'}).then(_ =>
        {
	  console.log('CLIP write', _);
	}, _ =>
        {
	  console.log('CLIP write', _);
	});
    }

//  load(url)
//    {
//      this.main.$text = `loading ${url}`;
//      fetch(url)
//	.then(_ => _.text())
//	.then(_ => { this.main.$text=`loaded ${url}`; return _ })
//	.then(console.log)
//	.catch(_ => { this.main.$text=`${url} failed: ${_}`; throw _ })
//    }

  async run()
    {
      if (!window.octokit)
        return this.main.text(`Cannot access JavaScript on CDN`); 
      this.octokit = window.octokit.Octokit;
      this.octoapp = window.octokit.App;
      this.token = await localStorage.getItem(this.tok);
      if (this.token && this.setup())
        return;
      this.s = void 0;
      this.fn_token(this.main);
    }
  fn_token(e)
    {
      e.clr();
      e.A.href('https://github.com/settings/tokens').text('GitHub PAT');
      e.text(': ');
      const i = e.INPUT.attr({placeholder:'GitHub PAT', title:'GitHub PAT, no spaces'});
      const b = e.BUTTON.text('store in localStorage').on('click', _ => { localStorage.setItem(this.tok, i.$value); this.expire(); this.run() });
    }
  setup()
    {
      this.s	= {}
      const e	= this.main.clr().DIV;
      this.s.e	= this.main.HR.$$.DIV;
      this.gh	= new this.octokit({ auth:this.token });
      this.s.cnt= e.BUTTON.text('clear').on('click', _ => this.expire());
      this.storagevent();
      for (const fn of Object.getOwnPropertyNames(this.__proto__))
        if (fn.startsWith('fn_'))
	  e.BUTTON.text(fn.substring(3)).on('click', _ => { this.clr(); this[fn](this.s.e) });
      this.s.i	= e.SPAN;
      window.GH = this.gh;
      return 1;
    }
  storagevent()
    {
      if (!this.s) return;
      this.s.cnt.$text = `clear cache (${localStorage.length})`;
    }
  clr()
    {
      this.nr = 0;
    }
  async cache(name, req)
    {
      const tag = `cache-${name}`;
      const was = await localStorage.getItem(tag);
      if (was)
        {
	  this.s.i.clr().text('cached');
	  return JSON.parse(was);
	}
      this.s.i.clr().text(`${this.nr++} working: ${name}`);
      const ret = await req;
      localStorage.setItem(tag, JSON.stringify(ret));
      this.s.i.clr().text('fetched');
      return ret;
    }
  async get(req)
    {
      return this.cache(`get ${req}`, this.gh.request(`GET ${req}`));
    }
  async paginate(req)
    {
      return this.cache(`page ${req}`, this.gh.paginate(`GET ${req}`));
    }
  expire()
    {
      for (const k of Object.getOwnPropertyNames(localStorage))
        if (k.startsWith('cache-'))
	  localStorage.removeItem(k);
      this.storagevent();
    }
  td(r,s,max=80)
    {
      const e = copyButton(r.TD, s).SPAN;
      if (s === void 0 || s === null)
        return;
      tooLong();
      function tooLong()
        {
          e.clr()
           .text(s.substr(0,max-1))
           .if(s.length>=max, () =>
               e.A.text('...')
                .on('click', () =>
               e.clr()
                .text(s)
                .on('click', tooLong)
    	  )    );
        }
    }
  async fn_cache(e)
    {
      const t = e.clr().TABLE;
      for (const k of Object.getOwnPropertyNames(localStorage))
        {
	  const r = t.TR;
	  this.td(r, k);
	  this.td(r, localStorage[k]);
	}
    }
  async fn_repos(e)
    {
      const repos = await this.paginate('/user/repos');
      const t = e.clr().TABLE;
      for (const k of repos)
        {
	  const r = t.TR;
	  const x = r.TD;
	  if (k.fork)
	    {
	      const info = await this.get(`/repos/${k.full_name}`);
	      const src = info.data?.source?.html_url;
	      if (src)
	        x.A.href(info.data.source.html_url).text('F')
	      else
	        x.A.href(info.data?.parent?.html_url).text('?')
	    }
          copyButton(r.TD, k.full_name).A.href(`${k.html_url}`).text(k.full_name);
	  this.td(r, k.full_name);
//	  this.td(r, k.owner.login);
	  this.td(r, k.description, 60);
	  this.td(r, JSON.stringify(k), 40);
	}
    }
  async fn_keys(e)
    {
      const repos = await this.paginate('/user/repos');
      const t = e.clr().TABLE;
      const a = {};
      for (const k of repos)
        {
	  const u = k.keys_url.split('{',1)[0];
	  const d = await this.paginate(u);
	  for (const m of d)
	    {
	      const g = a[m.title] || (a[m.title]=[]);
	      g.push(k);
	    }
	}
     let tmp;
     for (const g in a)
       {
	  const r = t.TR;
	  this.td(r, g);
	  const d = r.TD;
	  for (const u of a[g])
	    {
              copyButton(d, u.full_name).A.href(`${u.html_url}/settings/keys`).text(u.full_name);
	      tmp = u;
	    }
       }
//      e.PRE.text(JSON.stringify(tmp, void 0, 2));
    }
  };

new Main().run();


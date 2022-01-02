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
      e.DIV.text("Notes:")
      e.DIV.text("This is tool to access GitHub API using OctoCat.  It needs a PAT to access your repos.  Be sure to limit access rights of that PAT (read-only is enough for now).");
      e.DIV.text("Caching in Browser's localStore is used, as GitHub limits the number of requests.  The cache is not refreshed automatically.  Clear the cache (with the 'clear cache' button) if needed, else you might see stale data.");
      e.DIV.text("Last tested 2022-01-02 with FF95, Chrome96, Edge96");
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
        s = '';
      tooLong();
      return e;
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
      e.DIV.text("Notes:")
      e.DIV.text("This shows the locally stored cache entries of this site.");
      e.DIV.text("Some may be from other pages on this site.");
    }
  async fn_repos(e)
    {
      const repos = await this.paginate('/user/repos');
      const t = e.clr().TABLE;
      t.TR
       .TH.text('F').attr({title:'Link to the original if forked'}).$$
       .TH.text('W').attr({title:'Link to the wiki'}).$$
       .TH.text('repo').$$
       .TH.text('title').$$
       .TH.text('json');
      for (const k of repos)
        {
	  const r = t.TR;
	  const x = r.TD;
	  if (k.fork)
	    {
	      const info = await this.get(`/repos/${k.full_name}`);
	      const src = info.data?.source?.html_url;
	      if (src)
	        x.A.href(info.data.source.html_url).text('x')
	      else
	        x.A.href(info.data?.parent?.html_url).text('?')
	    }
	  const w = r.TD;
	  if (k.has_wiki)
	    w.A.href(`${k.html_url}/wiki`).text('W');
          copyButton(r.TD, k.full_name).A.href(k.html_url).text(k.full_name);
//	  this.td(r, k.name);
//	  this.td(r, k.owner.login);
	  this.td(r, k.description);
	  this.td(r, JSON.stringify(k), 40);
	}
      e.DIV.text("Notes:")
      e.DIV.text("This is a quick table of all repositories of you, your organizations and repositories you contribute to.");
    }
  async fn_keys(e)
    {
      const repos = await this.paginate('/user/repos');
      const t = e.clr().TABLE;
      t.TR
       .TH.text('name').$$
       .TH.text('RW').attr({title:'read-write or read-only'}).$$
       .TH.text('V').attr({title:'Verification status (I have no idea what this means)'}).$$
       .TH.text('key-type').$$
       .TH.text('list of repositories');
      const a = {};
      for (const k of repos)
        {
	  const u = k.keys_url.split('{',1)[0];
	  const d = await this.paginate(u);
	  for (const m of d)
	    {
	      const w = `${m.title} ${m.read_only ? '0' : '1'}${m.verified ? '0' : '1'}${m.key.split(' ',1)[0]}`;
	      const g = a[w] || (a[w]=[]);
	      g.push(k);
//	      t.TR.TD.text(JSON.stringify(m));
	    }
	}
//     let tmp;
     for (const g in a)
       {
	  const r = t.TR;
	  const x = g.split(' ');
	  const f = x.pop();
	  this.td(r, x.join(' ')).$$.addclass('pre');
	  r.TD.text(f[0]=='0' ? '-'  : 'x');
	  r.TD.text(f[1]=='0' ? 'x'  : '-');
	  r.TD.text(f.substr(2)).addclass('pre');
	  const d = r.TD;
	  for (const u of a[g])
	    {
              copyButton(d, u.full_name).A.href(`${u.html_url}/settings/keys`).text(u.full_name);
//	      tmp = u;
	    }
       }
//      e.PRE.text(JSON.stringify(tmp, void 0, 2));
      e.DIV.text("Notes:")
      e.DIV.text("This is a list of all deployment keys you have configured on GitHub.");
      e.DIV.text("Grouped by the name you gave to the deployment key.");
    }
  };

new Main().run();


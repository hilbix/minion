'use strict';

//const TESTED='2022-03-25 Chrome99';
const TESTED='2023-02-07 Firefox109';

class Main
  {
  constructor(cache_prefix)
    {
      this.cache_prefix = cache_prefix || 'gh-cache-';
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
//      .then(_ => _.text())
//      .then(_ => { this.main.$text=`loaded ${url}`; return _ })
//      .then(console.log)
//      .catch(_ => { this.main.$text=`${url} failed: ${_}`; throw _ })
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
      e.A.href('https://github.com/settings/tokens').target().text('GitHub PAT');
      e.text(': ');
      const i = e.INPUT.attr({placeholder:'GitHub PAT', title:'GitHub PAT, no spaces', value:this.token || ''});
      e.BUTTON.text('store in localStorage').on('click', _ => { localStorage.setItem(this.tok, i.$value);                this.run() });
      e.BUTTON.text('.. and clear cache')   .on('click', _ => { localStorage.setItem(this.tok, i.$value); this.expire(); this.run() });
      e.DIV.text("Notes:")
      const x=e.UL;
      x.LI.text('This tool accesses the GitHub API using ').a('https://cdn.skypack.dev/octokit', 'OctoCat');
      x.LI.text('It needs a PAT to access your repos.  Be sure to limit access rights of that PAT.');
      const y=x.UL;
      y.LI.a('https://github.com/settings/tokens/new', 'Classic', '_blank').text(': under "repo" tick "').b('public_repo').text('" and under "admin:org" tick "').b('read:org').text('" to access organization repos.  Do not tick "repo" nor "admin:org"!');
      y.LI.a('https://github.com/settings/personal-access-tokens/new', 'Fine-grained', '_blank').text(': "All repositories", "Administration": "').b('Read-only').text('".  This can only access the user repos or the repos of one single organization, ')
          .a('https://github.com/settings/personal-access-tokens/new', 'see under "Resource Owner"', '_blank')
	  .br.text('(In future it might be possible to add more than one token to access all of your organizations in parallel.)');
      x.LI.text('As GitHub limits the number of requests, the Browser\'s localStorage is used for caching.');
      x.LI.text('The cache is not refreshed automatically.  Clear the cache (with the "clear cache" button) if needed, else you might see stale data.');
      e.DIV.text(`Last tested ${TESTED.split(' ').shift()} with ${TESTED.split(' ').pop()}`);
    }
  setup()
    {
      this.s	= {}
      const e	= this.main.clr().DIV;
      this.s.e	= this.main.hr.DIV;
      this.gh	= new this.octokit({ auth:this.token });
      this.s.cnt= e.BUTTON.text('clear').on('click', _ => this.clear_cache(this.s.e));
      this.storagevent();
      for (const fn of Object.getOwnPropertyNames(this.__proto__))
        if (fn.startsWith('fn_'))
          e.BUTTON.text(fn.substring(3)).on('click', _ => { this.clr(); this[fn](this.s.e, this.running={}) });
      this.s.i	= e.SPAN;
      this.s.p	= e.SPAN;
      window.GH = this.gh;
      return 1;
    }
  clear_cache(e)
    {
      e.clr();
      let n=0;
      for (const k of Object.keys(localStorage))
        if (k.startsWith(this.cache_prefix))
          n++;
      if (!n)
        {
          e.DIV.text('there are no cached entries');
          if (localStorage.length) e.DIV.text('The store contains more than just the cache (like the token)');
          return;
        }
      e.DIV.text(`really clear ${n} entries?  This cannot be undone!`);
      const d = e.DIV;
      e.BUTTON.text('really clear cache').on('click', () => { this.expire(); this.clear_cache(e) });
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
  info(s)
    {
      this.s.i.clr().text(s);
    }
  progress(s='')
    {
      this.s.p.clr().text(s);
    }
  async cache(name, req)
    {
      const tag = `${this.cache_prefix}${name}`;
      const was = await localStorage.getItem(tag);
      if (was)
        {
          this.s.i.clr().text('cached');
          return JSON.parse(was);
        }
      this.info(`${this.nr++} working: ${name}`);
      const ret = await req().catch(_ => this.info(`request failed: ${name}: ${_}`));
      if (!ret) return ret;
      localStorage.setItem(tag, JSON.stringify(ret));
      this.s.i.clr().text('fetched');
      this.storagevent();
      return ret;
    }
  async get(req)
    {
      return this.cache(`get ${req}`, () => this.gh.request(`GET ${req}`));
    }
  async paginate(req)
    {
      let n=0;
      return this.cache(`page ${req}`, () => this.gh.paginate(`GET ${req}`, r => { this.progress(` @${++n}`); return r.data }).finally(() => this.progress()));
    }
  expire()
    {
      for (const k of Object.keys(localStorage))
        if (k.startsWith(this.cache_prefix))
          localStorage.removeItem(k);
      this.storagevent();
    }
  td(r,s,max)
    {
      const e = copyButton(r.TD, s).SPAN;
      if (s === void 0 || s === null)
        s = '';
      tooLong(e, s, max);
      return e;
    }
  async fn_cache(e)
    {
      const t = e.clr().TABLE;
      for (const k of Object.getOwnPropertyNames(localStorage).sort())
        {
          const r = t.TR;
          this.td(r, k);
          this.td(r, localStorage.getItem(k));
        }
      e.DIV.text('Note: This shows the cached entries for this site.  All data is stored locally in your browser.  Some entries may be from other pages on this site.');
    }
  async fn_repos(e, running)
    {
      const repos = await this.paginate('/user/repos');
      const t = e.clr().TABLE;
      t.TR
       .TH.text('F').attr({title:'Link to the original if forked'}).$$
       .TH.text('W').attr({title:'Link to the wiki'}).$$
       .TH.text('repo').$$
       .TH.text('title').$$
       .TH.text('json');
      if (!repos)
        return t.TR.TD.attr({colspan:5}).text('no data due to error reading /user/repos');
      for (const k of repos)
        {
          if (this.running !== running) return t.TR.TD.attr({colspan:5}).text('(stopped)');

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
//          this.td(r, k.name);
//          this.td(r, k.owner.login);
          this.td(r, k.description);
          this.td(r, JSON.stringify(k), 30);
        }
      e.DIV.text("Notes:")
      e.DIV.text("This is a quick table of all repositories of you, your organizations and repositories you contribute to.");
    }
  async fn_keys(e, running)
    {
      const repos = await this.paginate('/user/repos');
      const t = e.clr().TABLE;
      if (!repos)
        return t.TR.TD.text(`no data due to error reading /user/repos`).br.text('perhaps PAT is missing the needed scope, see "token"');

      t.TR
       .TH.text('name').$$
       .TH.text('RW').attr({title:'read-write (x) or read-only (-)'}).$$
       .TH.text('V').attr({title:'Verification status (I have no idea what this means)'}).$$
       .TH.text('key-type').$$
       .TH.text('list of repositories');
      if (!repos)
        return t.TR.TD.attr({colspan:5}).text('no data due to error reading /user/repos');
      const a = {};
      const out = {};
      const update = g =>
        {
//          for (const g of Object.keys(a).sort())
            {
              const r = out[g] || (out[g] = t.TR);
              r.clr();
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
//                  tmp = u;
                }
            }
        }
      for (const k of repos)
        {
          if (this.running !== running) return t.TR.TD.attr({colspan:5}).text('(stopped)');

          const u = k.keys_url.split('{',1)[0];
          const d = await this.paginate(u);
          if (!d)
            {
              const w = `-0-ERROR`;
              const g = a[w] || (a[w]=[]);
              g.push(k);
              update(w);
              continue;
            }
          for (const m of d)
            {
              const w = `${m.title||'?'} ${m.read_only ? '0' : '1'}${m.verified ? '0' : '1'}${m.key.split(' ',1)[0]}`;
              const g = a[w] || (a[w]=[]);
              g.push(k);
              update(w);
//              t.TR.TD.text(JSON.stringify(m));
            }
        }
//     let tmp;
//          e.PRE.text(JSON.stringify(tmp, void 0, 2));
      e.DIV.text("Notes:")
      e.DIV.text("This is a list of all deployment keys you have configured on GitHub.");
//      e.DIV.text('The list is sorted by the name of the keys');
      e.DIV.text("Grouped by the name you gave to the deployment key.");
    }
  async fn_stop()
    {
      this.running	= false;
    }
  };

new Main().run();


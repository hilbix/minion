// This is wrong.
// It needs a checkbox and complex HTML code, but it should rather use Radio or Select by itself!
// Also all parameters should be autodetected (see at the end), so no need to pass anything.
'use strict';
// See also:
// https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8 */
// https://stackoverflow.com/questions/66407737/switch-between-light-dark-mode */
// https://codepen.io/PaulZi/pen/zBbVvV?editors=1100
// https://stackoverflow.com/a/57795495/490291

const theme = (_,light,dark,custom) =>
  {
    const defurl= 'https://valentin.hilbig.de/minion/relay.html';
    const auto	= 'auto';
    const el	= document.getElementById(_);			// our choser
    const style	= getComputedStyle(document.documentElement);	// live list
    const _get	= () => localStorage.getItem(_);
    const _data	= () => localStorage.getItem(`${_}_data`);
    const _url	= () => localStorage.getItem(`${_}_url`);
    const get	= () => { const t = _get(); return [light,dark,custom].includes(t) ? t : system || light }
    const put	= t => localStorage.setItem(_, t === system ? auto : t);
    const load	= () => { try { return JSON.parse(_data()) } catch (e) { return } };
    const save	= d => localStorage.setItem(`${_}_data`, JSON.stringify(d));
    const store	= url => localStorage.setItem(`${_}_url`, url);
    const setup	= t => { el.checked = t === dark; el.indeterminate = t === custom };
    let mode, system;

    // select theme-light.css, theme-dark.css or theme-custom.css
    const set	= () =>
      {
        mode = el.indeterminate ? custom : el.checked ? dark : light;
        document.documentElement.setAttribute(`data-${_}`, mode);
        put(mode);
      };
    // load custom theme entries
    const customize = () => { const ds = document.documentElement.style; Object.entries(load()||{}).forEach(([k,v]) => ds.setProperty(k,v)) }

    // load custom theme loader via relay
    // this only works after user interaction (clicks)
    let	win, winurl, ok;
    const request = url =>
      {
        if (!url)
          url	= prompt('Theme URL', _url() || defurl);
        if (url || url === '')
          store(url);
        if (!url) // includes url === ''
          return;

        ok	= void 0;
        win	= window.open(url, '_blank', 'popup,width=400,height=300');
        winurl	= url;
        win.onclose = () => ok=win=void 0;
      }

    // change a color
    let delay;
    const change = (d,e) =>
      {
        document.documentElement.style.setProperty(d,e);
        data[d] = e;
        if (delay)
          cancelTimeout(delay);
        // do not save while wobbling or right before rage quit
        delay = setTimeout(() => el.indeterminate && save(custom), 300);
      }

    // communication with theme loader
    const post = _ => win.postMessage(_, winurl);
    window.addEventListener('message', _ =>
      {
        if (_.source !== win) return;
        const {b,c,d,e} = _.data;
        switch (c)
          {
          case 'ping':	ok=1; return post({b, c:'pong',d:{d:'theme', e:window.location.href},e});
          case 'list':	return post({b, c:'colors', d:Array.from(style).filter(_ => _.startsWith('--'))});
          case 'get':	return post({b, c:'color', d, e:style.getPropertyValue(d)});
          case 'url':	return request(d);
          case 'set':	if (d.startsWith('--')) return change(d,e);
          }
        console.log('?msg?', _.data);
      });

    // tripple click: bring up load query
    // double click: enable custom
    // if setting missing, double click works as triple click
    el.onclick = ev =>
      {
        const n = ev.detail|0;
        if (n<2)
          return;
        if (!el.indeterminate)
          set(el.indeterminate = true);
        if (win && !win.closed)
          win.focus();
        else if (n>2 || !_url() || !Object.keys(_data()||{}).length)
          request();
      }

    // get system setting
    if (window.matchMedia)
      {
        const darktheme = window.matchMedia('(prefers-color-scheme: dark)');
        const getSystem = () => system = darktheme.match ? dark : light;
        darktheme.addListener(_ => { getSystem(); if (_get() === auto) set(setup(system)) });
        getSystem();
      }

    // Update our choser and set theme
    const t = get();
    setup(t);

    el.onchange = set;
    set();
    customize();

    console.log('theme', mode);
  }

// This currently needs something like following:
//
// <div class="theme bottom0 right0"><label><input id="theme" type="checkbox" checked=""><div></div></label></div>
// <script src="theme.js"></script>
//
// But this is wrong.  All parameters should be autodetectable with something like following:
//
// <div id="theme" class="theme bottom0 right0" data-mytheme="light dark custom"></div>
// <script data-theme="mytheme" src="theme.js"></script>
//
// This also should setup the choser by itself.
// And it also should be possible to place the <script> before the <div>
//
// In a special case it even should do everything on its own:
//
// <script data-theme=" light dark custom" data-class="theme bottom0 right0" src="theme.js"></script>
//                     ^
// this missing space -' is intended and tells that an unnamed element is created
//
// But leave all this to the future.  Also note this all here should stay small!
theme('theme', 'light', 'dark', 'custom');


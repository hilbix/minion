// Output a very simple menu line (behavior changed in 2024-08-23)
//
// All the   v----v   below are based on the basename of the script   v----v
// <div data-minion="menu">please enable JavaScript</div><script src="minion.js"></script>
// - event 'minionmenu' when the menu is loaded
// - 'SPAN#minionmenu' for your own menu part
// ../minion.back.txt: backwards menu contents
// minion.txt: the menu entries made of lines like:
//	(empty lines visually separate menu parts, in future overflow menus)
//	entry
//	URL	entry
// URL gets .html appended when no . and does not end in /

'use strict';

(_=>_())(()=>{

const c = E(document.currentScript);
const p = c.$.src.split('/').pop().split('.').slice(0,-1).join('.');	// ../minion.js => minion
if (c.PREV.Dataset(p)!=='menu')
  c.before(E.DIV);
const m = c.PREV.clr();	// remove optional please enable JavaScript
//console.log(m.$);

const e = m.SPAN.text('(menu loading)');
const detail = m.text(' ').SPAN.id(`${p}menu`).text(document.title);

const menu = cache => mkmenu(`${p}.txt`, cache).then(_ => e.clr().add(_));
async function mkmenu(url, cache, path)
  {
    const e = E();
    let tickets;

    const _ = await fetch(url, {cache});
//    console.log({_});
    if (!_.ok) throw `fetch(${cache}) failed: ${_.status} ${_.url}`;
    const menu = await _.text();
//    console.log(menu);
    const s = '[ ';
    const end = () => { if (f !== s) e.text(' ]'); f=s }
    let f = s;
    for (const m of menu.split('\n'))
      if (m)
        {
          const s = m.split(/\s+/);
          const s0 = s.shift();
          if (s0 === '#menu')
            {
              try {
                await mkmenu(s[0], cache, s[1]).then(_ => e.add(_));
              } catch (e) {
                console.error(e,m);
              }
              continue;
            }
          if (s0 === '#ticket')
            {
              tickets	= s[0];
              continue;
            }

//          console.log(s0, toJ(s), tickets);
          const tick	= tickets ? s.shift().split(',') : [];
          // tickets are not completely ready yet and ignored by now

          const u = !s0 || s0.split('/').pop().includes('.') || s0.endsWith('/') ? `${path||''}${s0}` : `${path||''}${s0}.html`;
          const url	= new URL(u, window.location.href).href;
          const isme	= window.location.href === url || window.location.href.split('#')[0] === url;

          e.text(f).if(!isme, _=>_.A.href(u)).text(s.length ? s.join(' ') : s0);
          f = ' | ';
        }
      else
        end();
    end();
    return e;
  }
let errs=0;
function err(_)
  {
    console.error('ERR', _);
    e.clr().SPAN.text(`(ERROR #${++errs}) ${_}`).on('click', ()=>menu('reload').catch(err))
  }

menu('force-cache')
.then(() => menu('no-cache'))
.catch(err)
.finally(() => window.dispatchEvent(new CustomEvent(`${p}menu`, { detail })));
});


// Output Minion menu line

'use strict';

(_=>_())(()=>{

const c = E(document.currentScript);
console.log(c.PREV.$id);
if (c.PREV.Dataset('minion')!=='menu')
  c.before(E.DIV);
const m = c.PREV.clr();
console.log(m.$);

const t = m.SPAN.text('[ ').a('..', 'Back').text(' ] ');
const e = m.SPAN.text('(menu loading)');
m.text(' ').SPAN.id('menu');

function menu(cache)
  {
    const p = c.$.src.split('.');
    p.pop();
    p.push('txt');
    return Promise.all(
      [ mkmenu(t, '../back.txt', cache, ' Back', '../')
      , mkmenu(e, p.join('.'), cache)
      ]);
  }
async function mkmenu(e, url, cache, def, path)
  {
    let tickets;

    const _ = await fetch(url, {cache});
//    console.log({_});
    if (!_.ok && !def) throw `fetch(${cache}) failed: ${_.status} ${_.url}`;
    const menu = _.ok ? await _.text() : def;
//    console.log(menu);
    e.clr();
    let f = '[ ';
    for (const m of menu.split('\n'))
      if (m)
        {
          const s = m.split(/\s+/);
          const s0 = s.shift();
          if (s0 === '#ticket')
            {
              tickets	= s[0];
              continue;
            }

//          console.log(s0, toJ(s), tickets);
          const tick	= tickets ? s.shift().split(',') : [];
          const u = !s0 || s0.includes('.') ? `${path||''}${s0}` : `${path||''}${s0}.html`;

          const url = new URL(u, window.location.href);
          const out = s.length ? s.join(' ') : s0;
          if (window.location.href === url.href)
            e.text(f, out);
          else
            e.text(f).A.href(u).text(out);
          f = ' | ';
        }
    e.text(' ]');
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
.finally(() => c.$.src.includes('minion') && e.text(' ').A.href('https://github.com/hilbix/minion/tree/master/web').text('source'))
});


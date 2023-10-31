// Output Minion menu line

'use strict';

(_=>_())(()=>{

const c = E(document.currentScript);
console.log(c.PREV.$id);
if (c.PREV.Dataset('minion')!=='menu')
  c.before(E.DIV);
const m = c.PREV.clr();
console.log(m.$);

m.SPAN.text('[ ').a('/', 'Home').text(' ] ');
const e = m.SPAN.text('(menu loading)');
m.text(' ').SPAN.id('menu');

async function menu(cache)
  {
    const _ = await fetch('minion.txt', {cache});
    if (!_.ok) throw `fetch(${cache}) failed: ${_.status} ${_.url}`;
    const menu = await _.text();
//    console.log(menu);
    e.clr();
    let f = '[ ';
    for (const m of menu.split('\n'))
      if (m)
        {
          const u = `${m}.html`;
          const url = new URL(u, window.location.href);
          if (window.location.href === url.href)
            e.text(f, m);
          else
            e.text(f).A.href(u).text(m);
          f = ' | ';
        }
    e.text(' ]');
  }
let errs=0;
function err(_)
  {
    e.clr().SPAN.text(`(ERROR #${++errs}) ${_}`).on('click', ()=>menu('reload').catch(err))
  }

menu('force-cache')
.then(() => menu('no-cache'))
.catch(err)
.finally(() => e.text(' ').A.href('https://github.com/hilbix/minion/tree/master/web').text('source'))
});


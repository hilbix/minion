// Output Minion menu line

'use strict';

(_=>_())(()=>{

const e = E.DIV.text('(menu loading)');
E(document.currentScript).after(e);

fetch('minion.txt ')
.then(_ => { if (_.ok) return _.text(); throw `fetch failed: ${_.status} ${_.url}` })
.then(menu =>
  {
    console.log(menu);
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
  })
.catch(err => e.$text = `(ERROR: ${err})`)
.finally(() => e.text(' ').A.href('https://github.com/hilbix/minion').text('Source on GitHub'));

});


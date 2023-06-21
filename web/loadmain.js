'use strict';

const _ = E('main').clr().text('initializing');
try {
  const { default:modules } = await import('./loadmodule')
  console.log(_.$text = 'loading');
  const main = await modules.main;
  console.log(_.$text = 'loaded');
  if (!main.Main) throw 'missing class Main';
  const run = new main.Main(_);
  if (!run.main) throw 'missing classfunction Main.main()';
  run.main();
} catch (e) {
  _.$text = `load failed: ${e}`;
  throw e;
}


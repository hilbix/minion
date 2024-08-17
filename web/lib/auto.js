'use strict';
// automate DOM things
//
// auto({functions}, {options})
//
// <div data-click="someFn">
//
// class
//   {
//   constructor()
//     {
//       auto(this);
//     }
//
//   auto_someFn(_, e, o)
//     {

const maps = {};

// available handlers
const types = {click:''};
const mutopt = {childList:true,subtree:true,attributeFilter:Object.keys(types).map(_ => `data-${_}`)};

// attaches the event listeners for types: k:v where v|k names the event handler
function attach(fns, opt)
{
  const	pfx	= opt.pfx;
  const e	= E(opt._);

  for (const [k,v] of Object.entries(types))
    {
      const m	= maps[k] ??= new WeakSet();
      const a	= `data-${k}`;
      for (const _ of e.ALL(`[${a}]`))
        {
          const x	= _.getAttribute(a);
          if (x === void 0) continue;	// should not happen
          if (m.has(_)) continue;
          m.add(_);

          const h	= `${pfx}${x}`;
          if (!fns[h])
            console.warn(`probably missing handler ${h} for data-${x}`, _.$);
          console.log('A:', pfx, x, _, fns[h]);
          _.addEventListener(v || k, _ => fns[h](E(_.target), _, e), true);
        }
    }
}

// auto({functions})
// auto({fns},E('id'))
// auto({fns},{_:E('id')})
// auto({fns},_ => ({_:E('id')}))
// ._		the element where to add the buttons
// .pfx		prefix for function names, defaults to 'auto_'
export function auto(fns, opt)
{
  if (typeof opt === 'function' && !(opt instanceof _E))			opt = opt(fns, opt);
  if (opt instanceof _E || opt instanceof Node || typeof opt === 'string')	opt = {_:E(opt)};
  if (typeof opt !== 'object') opt={};
  opt._		??= document;					// auto({fns}, {this}) is unexpected token, hence auto({fns},{_:this})
  opt.pfx	??= fns.constructor === Object ? '' : 'auto_';	// classes get a default prefix
  console.log('a:', opt, typeof fns, fns);

  let	flag;		// remember DOM changes

  const fire	= () =>
    {
      mut.takeRecords();
      if (!flag++)
        P(attach, fns, opt).finally(() => flag=0).catch(console.error);
    };

  const mut	= new MutationObserver(fire);
  mut.observe(opt._, mutopt);

  fire();
}


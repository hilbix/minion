// Standard menu class
//
// HTML head:
//
// <meta name="loadmodule" data-as="main" content="main.js"/>
// <meta name="loadmodule" content="lib/menu.js"/>
//
// HTML body:
//
// <div id="menu"></div>
// <script type="module" src="loadmain.js"></script></body>
//
// main.js:
//
// 'use strict';
// export class Main
//   {
//   menubuttons = ['button1','button2','etc.'];
//
//   menu_button1()	{ /* function */ }
//
//   async main(_)
//     {
//       _.lib_menu.then(_ => this.m = new _.Menu('menu', this));

'use strict';

// opt:
//	.menubuttons:	ButtonList
//	.menuprefix:	defaults to 'menu_' (name prefix of functions called on Options)
//
// ButtonList:
//	either array:	[Name, Name]
//	or object:	{Name:Function}
//
export class Menu
  {
  constructor(_, opt)
    {
      this._	= E(_);
      this.o	= opt || {};
      this.b	= {};
      this.buttons(this.o.menubuttons);
    }
  buttons(x)
    {
      if (!x) return;
      if (Array.isArray(x))
        x.forEach(_ => this.button(_, (...a) => this.o[`${this.o.menuprefix ?? 'menu_'}${_}`](...a) ));
      else
        Object.entries(x).forEach(this.button.bind(this));
    }
  button(b,f)
    {
      // TODO be more clever about
      // - b than expecting it is a string
      // - f than expecting it is a function
      this._.BUTTON.click(f).text(b);
    }
  };


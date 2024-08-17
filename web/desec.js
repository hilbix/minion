'use strict';

export class Main
  {
  menubuttons = ['desec','token','domain'];

  constructor(_)
    {
      this._m	= _.clr().SPAN;
      this.o	= _.DIV;
      this._c	= _.SPAN;

    }

  async main(_)
    {
      _.lib_auto.then(_ => _.auto(this));
      _.lib_menu.then(_ => this.m = new _.Menu(this._m, this));
      _.lib_clip.then(_ => this.c = new _.Clip(this._c));

      const s	= await _.lib_store;
      this.s	= new s.Store('desec');
      this.tok	= await this.s.Get('token', '');
      if (this.tok === '')
        this.menu_desec();
    }
  async auto_CopyIP(_, ev)
    {
      ev.preventDefault();
      _.$text = "requesting";
      try {
        const t = await fetch(_.$.href).then(_ => _.text());
        this.c.copy(_.$text = t);
      } catch (e) {
        _.$text = `failed ${e}`;
      }
    }
  menu_desec()
    {
      E('info').setclass({hide:false});
      const e = this.o.clr();

      const b = e.LABEL.text('Token: ').INPUT.attr({size:40, value:this.token});
      e.text(' ');
      e.BUTTON.text('store').click(() => this.store_token());
    }
  store_token()
    {
    }
  };


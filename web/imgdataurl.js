'use strict';


class Main
  {
  inf(...a)
    {
      const out = a.join(' ');
      if (out === this.last) return;
      this.last	= out;
      this._inf.prep(E.DIV.text(out));
    }
  paste_item(item)
    {
      return this.readAsArray(item, 'pasted data');
    }
  drop_item(item, ...str)
    {
      if (str.length)
        str = str[0];
      else if (item.kind === 'string')
        return item.getAsString(_ => this.drop_item(item, _));
      else
        str = '';
      switch (item.type)
        {
//	case 'text/uri-list':
//	case 'text/x-moz-url':
        case 'application/x-moz-file-promise-url':	return this.download(item.kind, item.type, str);
	}
      return this.inf('ignored:', item.kind, 'of type', item.type, str);
    }
  download(kind, type, str)
    {
      this.inf('trying to download', kind, 'of type', type, str);
      this.t.$value = str;
      fetch(str).then(_ => _.blob()).then(_ => this.readAsUrl(_, str)).catch(_ => this.inf('error downloading', `${str}: ${_}`));
    }
  drop_file(file)
    {
      return this.readAsUrl(file, file.name);
    }
  file(ev)
    {
      const file = ev.target.files[0];

      if (!file)
        return this.inf('no file selected');
      return this.readAsUrl(file, file.name);
    }
  reader(name)
    {
      const r = new FileReader();

      r.addEventListener('load',  _ => this.loaded(_, r, name));
      r.addEventListener('error', _ => this.inf('error loading',   _.total, 'from', name, 'after', _.loaded));
      r.addEventListener('abort', _ => this.inf('aborted loading', _.total, 'from', name, 'after', _.loaded));
      return r;
    }
  readAsUrl(x, name)
    {
      this.inf('loading', name);
      return this.reader(name).readAsDataURL(x);
    }
  readAsArray(x, name)
    {
      return this.reader(name).readAsArrayBuffer(x);
    }

  loaded(_, r, name)
    {
      const v = r.result;
      this.t.$value = v;
      this._desc.$text = name;
      this._img.src(v);
      this.inf('loaded', _.total, 'from', name);
    }
  async paste(_)
    {
      this. inf('paste not yet implemented');
      for (const x of _[0]?.clipboardData?.items)
        this.paste_item(x);
      return true;
    }
  reply(c)
    {
      this.rep.$text = c;
      clearTimeout(this._rep);
      this._rep = setTimeout(() => this.rep.$text = '', 5000);
    }
  constructor()
    {
      const FOCUS = (e,_) => { _.focus(); window.focus() };

      const e	= E('main').clr();
      this.t	= e.DIV.TEXTAREA.attr({rows:10, readonly:1,placeholder:'base64 encoding shown here'}).style({width:'100%', height:'10em'}).on('mouseenter', FOCUS);

      const d	= e.DIV;
      d.button('clear', () => { this.t.$value = ''; this._inf.clr() }).attr({disabled:1});
      d.text(' ');
      d.button('copy image dataURL', () => { copyTextToClip(this.t.$value).then(this.reply.bind(this)) }).attr({disabled:1});
      this.rep = d.TT.style({width:'2ex'});
      d.br.INPUT.attr({type:'file',accept:"image/*"}).on('change', this.file.bind(this));
      d.text(' -- ').INPUT.value('!!DOES-NOT-WORK!! Ctrl+V to paste Image here').on('mouseenter', FOCUS).on('paste', (..._) => this.paste(_));
      e.HR;
      this._inf	= e.DIV;
      e.HR;
      this._desc = e.DIV;
      this._img = e.IMG;
      e.HR;

      //for (const x of 'drag dragend dragenter dragleave dragover dragstart'.split(' '))
      for (const x of 'dragenter dragleave dragover'.split(' '))
        window.addEventListener
          ( x
          , ev =>
            {
              ev.stopPropagation();
              ev.preventDefault();
              ev.stopImmediatePropagation();
            }
          , {capture:true}
          );
      window.addEventListener('drop', _ =>
        {
          _.stopPropagation();
          _.preventDefault();
          _.stopImmediatePropagation();

          let have;
          for (const f of _.dataTransfer.files)
            {
              this.drop_file(f);
              have = 1;
            }
          if (!have)
            for (const i of _.dataTransfer.items)
              this.drop_item(i);
        }, {capture:true});
    }
  run(...a)
    {
    }
  };

new Main().run();


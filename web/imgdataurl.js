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
	default:
          return this.inf('ignored: drop', item.kind, 'of type', item.type, str);
//	case 'text/uri-list':
//	case 'text/x-moz-url':
        case 'application/x-moz-file-promise-url':
	  break;
	}
      this.inf('trying to download', item.kind, 'of type', item.type, str);
      fetch(str).then(_ => _.blob()).then(_ => this.read(_, str)).catch(_ => this.inf('error fetching', `${str}: ${_}`));
      this.t.$value = str;
    }
  drop_file(file)
    {
      return this.read(file, file.name);
    }
  file(ev)
    {
      const file = ev.target.files[0];

      if (!file)
        return this.inf('no file selected');
      return this.read(file, file.name);
    }
  read(x, name)
    {
      const r = new FileReader();
      this.inf('loading', name);
      r.addEventListener('load',  _ => this.loaded(_, r, name));
      r.addEventListener('error', _ => this.inf('error loading',   _.total, 'from', name, 'after', _.loaded));
      r.addEventListener('abort', _ => this.inf('aborted loading', _.total, 'from', name, 'after', _.loaded));
      r.readAsDataURL(x);
    }
  loaded(_, r, name)
    {
      const v = r.result;
      this.t.$value = v;
      this._desc.$text = name;
      this._img.src(v);
      this.inf('loaded', _.total, 'from', name);
    }
  reply(c)
    {
      this.rep.$text = c;
      clearTimeout(this._rep);
      this._rep = setTimeout(() => this.rep.$text = '', 5000);
    }
  constructor()
    {
      const e	= E('main').clr();
      this.t	= e.DIV.TEXTAREA.attr({rows:10, readonly:1,placeholder:'base64 encoding shown here'}).style({width:'100%', height:'10em'});

      const d	= e.DIV;
      d.button('clear', () => { this.t.$value = ''; this._inf.clr() }).attr({disabled:1});
      d.text(' ');
      d.button('copy image dataURL', () => { copyTextToClip(this.t.$value).then(this.reply.bind(this)) }).attr({disabled:1});
      this.rep = d.TT.style({width:'2ex'});
      d.br.INPUT.attr({type:'file',accept:"image/*"}).on('change', this.file.bind(this));
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


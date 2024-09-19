'use strict';
// Crypto tests

class Radios
  {
  constructor(_, tag)
    {
      const s	= `${tag}_`;
      const len	= s.length;

      for (const x of Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
        if (x.startsWith(s))
          {
            const v	= x.substr(len);
            _.radio(tag,v,v,_ => this[x]());
          }
    }
  };

class Field extends Radios
  {
  constructor(_, what, hint)
    {
      _	= _.DIV;
      const f	= _.FORM.text(`${what}:`);
      super(f, 'mode');
      this.f	= f;
//      f.LABEL.title(t).checkbox(t, ()=>{}).text('Function');
      this.v	= _.DIV.TEXTAREA.attr({cols:80,rows:5}).placeholder('text/string or body of: async function (_) { body; }');
    }
  get form() { return this.f }
  get text() { return this.v }
  mode_Text()
    {
    }
  mode_escape()
    {
    }
  mode_urlencoded()
    {
    }
  mode_Base64()
    {
    }
  mode_Hex()
    {
    }
  mode_JSON()
    {
    }
  mode_URL()
    {
    }
  mode_Function()
    {
    }
  };

export class Main extends Radios
  {
  constructor(_)
    {
      _ = E(_).clr();
      _.DIV.text('NOT READY YET');
      _.DIV.text('NOT READY YET');
      _.DIV.text('NOT READY YET');

      const f	= _.FORM;
      f.text(' Algorithm:');
      super(f, 'cry');

      _.HR;
      this.inp	= new Field(_, 'Input');
      this.key	= new Field(_, 'Key');
      _.HR;
      this.out	= new Field(_, 'Output');
      _.HR;
      this.inf	= _.DIV.button('Run').button('clear').text(' ').SPAN;
      this.log	= _.PRE;
    }
  async main(modules)
    {
    }
  async cry_plain()
    {
    }
  async cry_rot13()
    {
    }
  async cry_MD5()
    {
    }
  async cry_SHA1()
    {
    }
  async cry_SHA256()
    {
    }
  };


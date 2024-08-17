// Standard clipboard copy and paste

// new Clip('element');

export class Clip
  {
  constructor(_)
    {
      this._i	= E(_);

      navigator?.permissions?.query({name:'clipboard-read'}).then(_ =>
        {
          console.log('CLIP read', _);
        }, _ =>
        {
          console.log('you can safely ignore this on FF: CLIP read', _);
        });
      navigator?.permissions?.query({name:'clipboard-write'}).then(_ =>
        {
          console.log('CLIP write', _);
        }, _ =>
        {
          console.log('you can safely ignore this on FF: CLIP write', _);
        });
    }
  copy(t) { this.COPY(t); return this }
  COPY(t)
    {
      if (typeof navigator?.clipboard?.writeText !== 'function')
        THROW("clipboard not supported");
      const r	= navigator.clipboard.writeText(t);
      r.then(_ => this.inf('copied!', t)).catch(THROW);
      return r;
    }
  inf(text, title)
    {
      if (!this._i)
        return;
      const _ = this._i.SPAN.title(title).text(text);
      setTimeout(() => _.remove(), 20000);
      return this;
    }
  };


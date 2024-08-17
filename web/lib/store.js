'use strict';

// async to be able to plug something else
export class Store
  {
  constructor(prefix, local)
    {
      this.prefix	= prefix ?? '';
      this.store	= local ? window.sessionStorage : window.localStorage;
      this.now		= Date.now();
      window.addEventListener('storage', _ => { this.storagevent() });
    }
  storagevent(_)
    {
      if (_.storageArea !== this.store) return;
      if (!_.key.startsWith(this.prefix)) return;
      console('STORAGE', _);
      // do something clever?
      return this;
    }
  async Del(k)		{ return this.store.removeItem(`${this.prefix}${k}`) }
  async Set(k,v)	{ return this.store.setItem(`${this.prefix}${k}`, `${v}`) }
  async Get(k,init)
    {
      const	s = `${this.prefix}${k}`;
      const	v = this.store.getItem(s);
      if ('string' === typeof v)
        return v;
      if ('function' === typeof init)
        init	= await init(k, this);
      if ('string' === typeof init)
        {
          this.store.setItem(s, init);
          return init;
        }
      return void 0;
    }
  async* Keys()
    {
      const	p = this.prefix;
      const	s = this.store;
      const	i = s.length;
      for (let j=0; j<i; j++)
        {
          const	k = s.key(j);
          if (k.startsWith(p))
            yield k;
        }
    }
  async* Values()
    {
      const	s = this.store;
      for await (const k of this.Keys())
        yield s.getItem(k);
    }
  async* Entries()
    {
      const	s = this.store;
      for await (const k of this.Keys())
        yield [k,s.getItem(k)];
    }
  };


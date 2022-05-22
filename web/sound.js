'use strict';

class Select
  {
  constructor(m)
    {
      this.main	= E(m);
    }
  OPTIONS(...a)
    {
      for (const a in ArrayFlat(a))
        {
        }
    }
  };

class Main
  {
  run()
    {
//      this.start();		// does not work, browser requires interaction!
    }

  constructor()
    {
      this.err	= E('err');
      this.main	= E('main').clr();
//      const s = new Select(this.main.SELECT).
      this.main.BUTTON.text('play').on('click', () => this.start());
      this.main.BUTTON.text('stop').on('click', () => this.stop());
      this.base	= this.main.SPAN;
      this.pos	= this.main.SPAN;
      this.inf	= this.main.SPAN;
      this.l	= 10;
      this.cnt	= 0;
//        [ this.c.createBuffer(1, this.s.sampleRate * this.l)
      this.gen	= this.noise();
    }
  upd(next)
    {
      this.pos.$text	= ` ${next} ${next/this.rate} ${next/this.ctx.sampleRate} `;
    }
  stat()
    {
      this.inf.$text	= ` ${++this.cnt} ${this.ctx.currentTime} ${this.ctx.state} `;
    }

  stop()	{ this.running	= void 0 }
  start(bpm)
    {
      const lock	= this.running	= {};
      const ctx		= this.ctx	= new AudioContext();
      const samples	= ctx.sampleRate;
      const rate	= this.rate	= 0|(samples * 60 / ((bpm|0)||60));
      const g		= this.gen;
      let next		= 0;

      this.base.$text	= ` ${this.rate}@${this.ctx.sampleRate} `;

      const audioloop = () =>
        {
          if (this.running !== lock)
            {
              if (this.ctx === ctx)
                this.ctx = void 0;
              ctx.close();
              return;
            }

          const p = (1.0*next)/(1.0*samples);
          if (p <= ctx.currentTime + 0.1)
            {
              const	b = this.ctx.createBuffer(1, rate, this.ctx.sampleRate);
              const	d = b.getChannelData(0);
              for (let i=0; i<rate; i++)
                d[i] = g.next().value;
              const	s = this.ctx.createBufferSource();
              s.buffer	= b;
              s.connect(ctx.destination);
              s.start(p);
//              if (ctx.state === 'suspended') ctx.resume();
              this.upd(next);
              next	+= rate;
            }
          this.stat();
          setTimeout(audioloop, 25);
        }

      audioloop();
    }

  *noise()
    {
      for (;;)
        yield Math.random()*2-1;
    }

  next(rate)
    {
    }
  };

new Main().run();


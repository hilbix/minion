'use strict';
// This shall become a very simple image editor

const DEBUG = 0	//+1;

export class Main
  {
  constructor(_)
    {
      _.clr();
      this.c	= _.CANVAS.style({display:'block',background:'grey',margin:0,padding:0}).attr({contenteditable:true});
//      this.l	= E.DIV.style({border:'1px solid blue',minHeight:'1em'});
      this.o	= _.DIV.style({margin:0,padding:0,border:'0px solid blue',maxHeight:'40px', overflow:'auto'});
      this.o.style({whiteSpace:'pre',fontFamily:'monospace'})
      this.out('initializing');

      window.addEventListener('minionmenu', _ =>
        {
          this.m = _.detail;
          this.m.$$.style({border:'1px solid blue'});
        });

      E(document.body).style({overflow:'hidden'});	// prevent resize loops
      onResize(_ => this.resize(_));
//      E(document.body).style({margin:0});
    }
  out(...a)
    {
//      this.l.add(...this.o.CHILDREN);
      this.o.clr().DIV.text(a);
    }

  resize(_)	// {x,y,w,h} where x,y is usable height and w,h is full height
    {
      let adjust	= 2;
      let w, h;
      const oh = this.o.$h;
      for (;;)
        {
          const [cx,cy,cw,ch] = this.c.$xywh;
          w = _.x;
          h = _.h - cy - oh - adjust;
          if (w<100) { adjust=0; w=100 }
          if (h<100) { adjust=0; h=100 }
          if (ch !== h)
            this.c.h(h);
          if (cw !== w)
            this.c.w(w);
//          const bc = this.c.$.getBoundingClientRect();
          const bo = this.o.$.getBoundingClientRect();
          console.log('RESIZE', _, w, h, adjust, bo.bottom);
          if (!adjust || bo.bottom <= _.h)
            break;
          adjust	= Math.ceil(adjust + bo.bottom - _.h);
        }
      this.out(`resize ${w} ${h}`);
      return SleeP(250);
    }

  async main(modules)
    {
      const dlp = new (await modules.DLP).DLP();
      dlp.ON('*', _ => console.log(_.t, _.d));
/*
      for await (const drop in drop)
        {
          console.log("DROP", drop);
        }
*/
    }
  };


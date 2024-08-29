'use strict';
// Line from (p1x,p1y) to (p2x,p2y)
// Circle at (x,y) with radius r
// Returns true if the circle hits the line.

function rot(X,Y,A)
{
  return [ X * Math.cos(A) - Y * Math.sin(A) , X * Math.sin(A) + Y * Math.cos(A) ];
}

function draw(canvas, dx,dy, p1x,p1y,p2x,p2y,x,y,r, hit)
{
  canvas.data('dx',dx).data('dy',dy);

  const c = canvas.$.getContext('2d');
  c.clearRect(0,0,c.canvas.width,c.canvas.height);
//  console.log(c.canvas.width, c.canvas.height);
//  console.log([dx,dy],{p1x,p1y,p2x,p2y,x,y,r,hit});

  c.beginPath();
  c.lineWidth = 2;
  c.strokeStyle = 'green';
  c.moveTo(dx+p1x, dy+p1y);
  c.lineTo(dx+p2x, dy+p2y);
  c.stroke();
  
  c.beginPath();
  c.strokeStyle = 'black';
  c.fillStyle = 'red';
  c.arc(dx+x, dy+y, r, 0, 2*Math.PI);
  if (hit)
    c.fill();
  else
    c.stroke();
}

class Main
  {
  constructor()
    {
      const x = this.x = {}
      const e = this.e	= E('main').clr();
      const t = e.TABLE;

      this.row(t, 'P1', {p1x:100,	p1y:100});
      this.row(t, 'P2', {p2x:300,	p2y:300});
      this.row(t, 'C',  {x:100,	y:300});
      this.row(t, 'R',  {r:50});
//    this.row(t, 'P1', {p1x:0,	p1y:0});
//    this.row(t, 'P2', {p2x:0,	p2y:300});
//    this.row(t, 'C',  {x:0,	y:0});
//    this.row(t, 'R',  {r:50});

      this.c1	= this.canvas('white');
      this.c2	= this.canvas('yellow');
      this.c2.on('click', _ => this.click(this.c2, _));
    }
  canvas(c)
    {
      const e = this.e._MK('CANVAS').attr({width:'600px',height:'500px'}).style({backgroundColor:c});
      return e;
    }
  click(c,e)
    {
      const x = e.clientX - c.$x - c.$data.dx;
      const y = e.clientY - c.$y - c.$data.dy;
//      console.log(x,y, c.$xywh);
      this.x.x.value(x);
      this.x.y.value(y);
      this.run();
    }
  row(t, n, o)
    {
      const r = t.TR;
      r.TD.text(n);
      for (const a in o)
        this.x[a] = r.TD.NUMBER.data('v',a).value(o[a]).on('change', _=>this.run());
    }
  run()
    {
      const v = {};
      for (const x in this.x)
        {
          v[x] = parseInt(this.x[x].$value);
//          console.log(x, v[x]);
        }
      const hit = this.hit(v);

      draw(this.c2, 100,100, v.p1x, v.p1y, v.p2x, v.p2y, v.x, v.y, v.r, hit);

    }

  // Line from (p1x,p1y) to (p2x,p2y)
  // Circle at (x,y) with radius r
  // Returns true if the circle hits the line.
  hit(v)
    {
      const M = v.p2x - v.p1x;
      const N = v.p2y - v.p1y;
      const X = v.x   - v.p1x;
      const Y = v.y   - v.p1y;
      const r = v.r;

      const A = -Math.atan2(N,M);	// ACHTUNG! Y kommt zuerst!  Und Vorzeichen vom Winkel umkehren.
      const Z = Math.sqrt(M*M + N*N);
//      console.log(M,N,A*180/Math.PI, rot(M,N,A), [0,Z]);

      const [K,L] = rot(X,Y,A);
//      console.log(X,Y,A*180/Math.PI, rot(X,Y,A), [K,L]);

      const h1 = Math.sqrt( (K-0)*(K-0) + L*L ) <= r;
      const h2 = Math.sqrt( (K-Z)*(K-Z) + L*L ) <= r;
      const h3 = Z >= K && K >= 0 && r >= L && L >= -r;

//      console.log({h1,h2,h3});
      const hit = h1 || h2 || h3;

//      console.log(X,Y,A*180/Math.PI, rot(X,Y,A), [K,L]);
      draw(this.c1, this.c1.$.width/2, this.c1.$.height/2, 0,0, Z,0, K,L,r, hit);
      return hit;
    }
  };

new Main().run();


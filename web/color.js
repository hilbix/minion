'use strict';
// This shall become a very simple image editor

// This is a mix of
// https://de.wikipedia.org/wiki/Videoaufl%C3%B6sung
// https://de.wikipedia.org/wiki/Bildaufl%C3%B6sung
//

/*
QQVGA 		Quarter QVGA [2][3] 	160 	120
GB 		Game Boy[4] 		160 	144	GameBoy
Palm LoRes 	Palm Low Resolution 	160 	160
GBA 		Game Boy Advance [6] 	240 	160	GameBoy Advance

					480 	160
⅛VGA 		⅛ VGA 			240 	180
ZXS NDS		ZX Spectrum 		256 	192	ZX Spectrum	Nintendo DS
CGA 		Color Graphics Adapter 	320 	200

QVGA 		Quarter VGA[3] 		320 	240
					360 	240
					384 	240

Palm HiRes 	Palm High Resolution 	320 	320

3DS 		Nintendo 3DS  		400 	240
WQVGA 		Wide QVGA 		432 	240

		PSION Serie 5 		640 	240

PSP 		PlayStation Portable 	480 	272

QSVGA 		Quarter SVGA 		400 	300

HVGA 		Half VGA[2] 		480 	320
HGC 		Hercules G Card 	720 	348
EGA 		Enhanced G Adapter 	640 	350
MDA 		Monochrome D Adapter 	720 	350
					480 	360
QHD 		Quarter HD 		640 	360
		Apple Lisa 		720 	364
HSVGA 		Half SVGA 		600 	400
WVGA, WGA 	Wide VGA 		720 	400
VGA 		Video Graphics Array 	640 	480
					720 	480
WVGA, WGA 	Wide VGA 		800 	480
WVGA, WGA 	Wide VGA 		848 	480
WVGA, WGA 	Wide VGA 		852 	480
WVGA, WGA 	Wide VGA 		864 	480
WVGA, WGA 	Wide VGA 		858 	484
					720 	540
qHD, QHD 	Quarter HD 		960 	540
					960 	540
PS Vita 	PlayStation Vita 	964 	544
PAL-D 		PAL Digital[3] 		768 	576
WXGA 		Wide XGA 		1024 	576
SVGA 		Super VGA[3][2] 	800 	600
WSVGA 		Wide SVGA [3] 		1024 	600
WSVGA 		Wide SVGA 		1072 	600
HXGA 		Half Megapixel (Apple) 	832 	624
DVGA 		Double VGA 		960 	640
					960 	720
HD720, 720p 	HD ready 		1280 	720
XGA 		Extended Graphics Array	1024 	768
WXGA 		Wide XGA (Bright View) 	1280 	768
WXGA 		Wide XGA 		1360 	768
WXGA 		Wide XGA 		1366 	768
WXGA 		Wide XGA 		1376 	768
UWXGA 		Ultra Wide XGA 		1600 	768
DSVGA 		Double SVGA 		1200 	800
WXGA 		Wide XGA[3] 		1280 	800
XGA 		XGA+[3] 		1152 	864
OLPC 		One Laptop per Child 	1200 	900
WXGA+ 		WXGA Plus[3] 		1400 	900
WXGA+ 		WXGA Plus 		1440 	900
WSXGA 		Wide SXGA[3] 		1600 	900
SXVGA, QVGA 	Super Ext.VGA QuadVGA 	1280 	960
		(Apple) 		1440 	960
SXGA 		Super XGA[2][3] 	1280 	1024
WSXGA 		Wide SXGA[3] 		1600 	1024
SXGA+ 		SXGA Plus[3] 		1400 	1050
WSXGA+ 		Wide SXGA+[3] 		1680 	1050
FHD HD1080 1080p	HighDef Full HD	1920 	1080
2K-DCI 		2K - DigiCinemaInitiati	2048 	1080
FHD+ 		Full HD+ 		2160 	1080
FHD+ 		Full HD+ 		2340 	1080
UWFHD 		Ultra Wide FHD 		2560 	1080
DFHD 		Double Full HD 		3840 	1080
QWXGA 		Quad WXGA 		2048 	1152
UXGA 		Ultra XGA[2][3] 	1600 	1200
WUXGA 		Wide UXGA[3] 		1920 	1200
DWUXGA 		Double WUXGA 		3840 	1200
					1920 	1280
TXGA 		Tesselar XGA 		1920 	1400
					1920 	1440
WQHD, 1440p 	Wide QHD, „2K“ 		2560 	1440
2K+ 		Quad HD+ 		2880 	1440
2K+ 		Quad HD+ 		2960 	1440
UWQHD, 1440p 	Ultra Wide QHD (QHD) 	3440 	1440
QHD 1440p 	Quad High Definition 	3440 	1440
DQHD 		Double QHD 		5120 	1440
SUXGA 		Super UXGA 		2048 	1536
QXGA 		Quad XGA[2][3] 		2048 	1536
WQXGA 		Wide QXGA[3] 		2560 	1600
UWQXGA 		Ultra Wide QXGA 	3840 	1600
QHD+ 1600p UW4k	QuadHighDef+ UWide 4K 	3840 	1600
QHD+ 		Quad HighDef Plus 	3200 	1800
QSXGA 		Quad SXGA[3] 		2560 	2048
WQSXGA 		Wide QSXGA 		3200 	2048
QSXGA+ 		Quad SXGA+ 		2800 	2100
UHD 4K, 2160p 	Ultra HighDef „4K“ 	3840 	2160
4K-DCI, 4K2K 	4K - High Definition	4096 	2160
WUHD 		Wide UHD, „5K2K“[3] 	5120 	2160
		Apple iMac Retina 4K 	4096 	2304
QUXGA 		Quad UXGA[2] 		3200 	2400
HSVGA 		Hex SVGA 		3200 	2400
QWUXGA 		Quad WUXGA 		3840 	2400
WQUXGA 		Wide QUXGA 		3840 	2400
UHD+ 		Ultra HighDef Plus, 5K 	5120 	2880
HXGA 		Hex XGA 		4096 	3072
WHXGA 		Wide HXGA 		5120 	3200
		Apple Pro Display XDR 	6016 	3384
HSXGA 		Hex SXGA 		5120 	4096
WHSXGA 		Wide HSXGA 		6400 	4096
FUHD, 4320p 	Full UHD, 8K[3] 	7680 	4320
8K-DCI 		8K - DigitalCinemaIniti	8192 	4320
HUXGA 		Hex UXGA 		6400 	4800
WHUXGA 		Wide HUXGA 		7680 	4800
QUHD, 8640p 	Quad UHD, „16K“[3] 	15360 	8640
*/

const sizes = `
SQCIF		128	96
QSIF (NTSC)	176	120
QSIF (PAL)	176	144	QCIF
VHS		320	240
VCD (NTSC)	352	240	SIF (NTSC)
VCD (PAL)	352	288	SIF (PAL)	CIF
NTSC (CVD)	352	480
PAL (CVD)	352	576
qD1 (NTSC)	360	240
qD1 (PAL)	360	288
NTSC (SVCD)	480	480
PAL (SVCD)	480	576
S-VHS		533	400	Hi8
NTSC		544	480
PAL		544	576
SVCD (PAL)	576	480
VGA		640	480
2SIF (NTSC)	704	240
2SIF (PAL)	704	288	2CIF
DVD (NTSC)	704	480	4SIF (NTSC)	cD1 (NTSC)
DVD (PAL)	704	576	4SIF (PAL)	cD1 (PAL)	4CIF
DV (NTSC)	720	480	D1 (NTSC)
DV (PAL)	720	576	D1 (PAL)
DVB (PAL)	720	576
PAL (DVB)	768	576
PAL-opt		960	540
DV HD720	960	720
PAL-wide	1024	576
9SIF (NTSC)	1056	720
9SIF (PAL)	1056	864	9CIF
HDTV 720p	1280	720	HD720
16SIF (NTSC)	1408	960
16SIF (PAL)	1408	1152	16CIF
HD1080 (DV)	1440	1080
FullHD 1080p	1920	1080	HD1080
WUXGA		1920	1200
QWXGA		2048	1152	HD-MAC
2K		2048	1536
UHDV-1 2160p	3840	2160
4K		4096	3072
UHD 8K		7680	4320	UHDV-2
UHXGA		7680	4800
`;

const Sizes = `
nHD	640	360
VGA	640	480
SVGA	800	600
XGA	1024	768
WXGA	1280	720
WXGA	1280	800
SXGA	1280	1024
HD	1360	768
HD	1366	768
WXGA+	1440	900
N/A	1536	864
HD+	1600	900
UXGA	1600	1200
WSXGA+	1680	1050
FHD	1920	1080
WUXGA	1920	1200
QWXGA	2048	1152
QXGA	2048	1536
UWFHD	2560	1080
QHD	2560	1440
WQXGA	2560	1600
UWQHD	3440	1440
4K UHD	3840	2160
`;

function getRgbFromValue(e)
{
  const v = e.$value;	// #rrggbb

  const x = _ => parseInt(v.substr(_,2),16);
  return [ x(1), x(3), x(5) ];
}

function fixRgbValue(e)
{
  return fixIntValue(e,0,255);
}

function fixIntValue(e,lo,hi)
{
  const v = e.$value;
  let n = parseInt(v);
  if (!n) return 0;
  if (lo !== void 0 && n < lo)
    n	= lo;
  if (hi !== void 0 && n > hi)
    n	= hi;
  if (v !== `${n}`)
    e.$value	= n;
  return n;
}

function setIntValue(e, v)
{
  e.$value	= v;
  return v;
}

function hex(h)
{
  return `0${Number(h).toString(16)}`.substr(-2);
}

export class Main
  {
  constructor(_)
    {
      _.clr();
      const i = this.i = {};
      const t = _.TABLE;
      t.TR.td('width')
          .TD.INPUT.put(i, 'w').attr({type:'number',size:7}).value(50).$$.$$
          .TD.attr({rowspan:2}).LABEL.CHECKBOX.put(i, 's').$$.text(' sync');
      t.TR.td('height')
          .TD.INPUT.put(i, 'h').attr({type:'number',size:7}).value(50);
      t.TR.td('R')
          .TD.INPUT.put(i, 'r').attr({type:'number',size:7}).value(0).$$.$$
          .TD.put(i, 'X').attr({rowspan:3}).style({textAlign:'center'}).INPUT.put(i, 'c').attr({type:'color'}).$$
             .DIV.style({color:'#fff'}).text('Text ').b('Text').$$
             .DIV.style({color:'#000'}).text('Text ').b('Text');
      t.TR.td('G')
          .TD.INPUT.put(i, 'g').attr({type:'number',size:7}).value(0);
      t.TR.td('B')
          .TD.INPUT.put(i, 'b').attr({type:'number',size:7}).value(0);
      t.TR.td('download').TD.put(i, 'D').attr({colspan:2});

      this.D = _.DIV.text('DEBUG ').SPAN;
      this.NR= 0;
      this.I = _.DIV.IMG.style({border:'3px dashed #ff0',background:'#00f'});
    }
  async main(modules)
    {
      for (const [k,v] of Object.entries(this.i))
        if (k !== k.toUpperCase())
          v.on('input', () => this.upd(v));
      return this.upd();
    }
  upd(el)
    {
      const i = this.i;
      const colorSelect = el === i.c;

      const w = fixIntValue(i.w);
      if (!w) return;
      const h = (i.h.$disabled = i.s.$checked) ? setIntValue(i.h, w) : fixIntValue(i.h);
      const [r,g,b] = colorSelect ? getRgbFromValue(i.c) : [fixRgbValue(i.r), fixRgbValue(i.g), fixRgbValue(i.b)];

      const c = `#${hex(r)}${hex(g)}${hex(b)}`;
      i.X.$style.backgroundColor = c;
      if (colorSelect)
         {
           i.r.$value = r;
           i.g.$value = g;
           i.b.$value = b;
         }
      else
        i.c.$value = c;

      const p = E.CANVAS.attr({width:w, height:h});
      const d = p.$.getContext('2d');
      d.fillStyle = c;
      d.fillRect(0,0,w,h);

      const u = p.$.toDataURL();
      const t = `full-${w}x${h}-${c.substr(1)}.png`;

      i.D.clr().TT.A.attr({download:t, href:u}).text(t);
      this.I.$src = u;

      this.D.$text = `${++this.NR} ${el === i.c} ${w}x${h} ${hex(r)} ${hex(g)} ${hex(b)} (${u.length})`;
    }
  };


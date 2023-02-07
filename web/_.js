'use strict';

async function tooLong(e,s,max)
{
  if (!max)
    {
      max	= parseInt(await sessionStorage.getItem('max'));
      if (!max || max<1) max=80;
    }
  const short = () => { e.clr().text(s.substr(0,max-1)).if(s.length>=max, () => e.A.text('...').on('click', long)) };
  const long  = () => { e.clr().text(s).on('click', short) };
  short();
}

async function tooLongTD(td,s,max)
{
  const e = td.SPAN;
  if (!max)
    {
      max	= parseInt(await sessionStorage.getItem('max'));
      if (!max || max<1) max=80;
    }
  const short = () => { td.addclass('pre'); e.clr().text(s.substr(0,max-1)).if(s.length>=max, () => e.A.text('...').on('click', long)) }
  const long  = () => { td.rmclass('pre');  e.clr().text(s).on('click', short) };
  short();
}

function tooLongCopyTD(tr,s,max)
{
  const e	= tr.TD;
  copyButton(e,s);
  tooLongTD(e,s,max);
}


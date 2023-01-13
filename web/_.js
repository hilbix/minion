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


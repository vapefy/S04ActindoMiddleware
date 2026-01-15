import{d as m,f as p,a as u}from"./B35PcQGF.js";import{k as v,r as w,t as y}from"./BZjX7xHU.js";import{b as x,g,f as _}from"./DQl7avGA.js";import{p as a}from"./D9uJM2wH.js";var k=p("<button><!></button>");function N(o,e){let s=a(e,"variant",3,"primary"),d=a(e,"size",3,"default"),i=a(e,"disabled",3,!1),l=a(e,"type",3,"button"),n=a(e,"class",3,"");const h={primary:`
			bg-royal-600 text-white
			shadow-lg shadow-royal-600/30
			hover:translate-y-[-2px] hover:shadow-xl hover:shadow-royal-600/40
			active:translate-y-0
		`,ghost:`
			bg-transparent border border-white/20 text-white
			hover:bg-white/5 hover:border-white/30
		`,danger:`
			bg-red-500/20 border border-red-500/50 text-red-400
			shadow-lg shadow-red-500/20
			hover:bg-red-500/30 hover:shadow-xl hover:shadow-red-500/30
		`},b={default:"px-5 py-2.5 text-sm",small:"px-3 py-1.5 text-xs"};var t=k();t.__click=function(...f){var r;(r=e.onclick)==null||r.apply(this,f)};var c=v(t);x(c,()=>e.children),w(t),y(()=>{g(t,"type",l()),t.disabled=i(),_(t,1,`
		inline-flex items-center justify-center gap-2 font-semibold rounded-full
		transition-all duration-150 cursor-pointer
		disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
	 ${h[s()]??""} ${b[d()]??""} ${n()??""}`)}),u(o,t)}m(["click"]);export{N as B};

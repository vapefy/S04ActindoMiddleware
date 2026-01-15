import{c as C,a as v,f as b,d as $}from"./B35PcQGF.js";import{f as w,t as h,k as c,r as m,i as z}from"./BZjX7xHU.js";import{I as A,s as I,b as u,f as _}from"./DQl7avGA.js";import{l as M,s as P,p as n,i as X}from"./D9uJM2wH.js";import"./_G6KF_sA.js";function j(t,a){const s=M(a,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.460.1 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];A(t,P({name:"x"},()=>s,{get iconNode(){return o},children:(e,d)=>{var r=C(),i=w(r);I(i,a,"default",{}),v(e,r)},$$slots:{default:!0}}))}var q=b("<div><!></div>");function K(t,a){let s=n(a,"class",3,""),o=n(a,"hover",3,!1);var e=q(),d=c(e);u(d,()=>a.children),m(e),h(()=>_(e,1,`
		glass-card p-6
		${o()?"transition-transform duration-200 hover:-translate-y-1 hover:border-royal-700/50":""}
		${s()??""}
	`)),v(t,e)}var B=b('<button type="button" class="p-1 rounded-lg hover:bg-white/10 transition-colors"><!></button>'),D=b('<div role="alert"><div class="flex-1 text-sm"><!></div> <!></div>');function L(t,a){let s=n(a,"variant",3,"info"),o=n(a,"dismissible",3,!1),e=n(a,"class",3,"");const d={error:"bg-red-500/10 border-red-500/40 text-red-400",success:"bg-emerald-500/10 border-emerald-500/40 text-emerald-400",warning:"bg-amber-500/10 border-amber-500/40 text-amber-400",info:"bg-royal-500/10 border-royal-500/40 text-royal-300"};var r=D(),i=c(r),g=c(i);u(g,()=>a.children),m(i);var x=z(i,2);{var y=f=>{var l=B();l.__click=function(...N){var p;(p=a.ondismiss)==null||p.apply(this,N)};var k=c(l);j(k,{size:16}),m(l),v(f,l)};X(x,f=>{o()&&f(y)})}m(r),h(()=>_(r,1,`
		flex items-start gap-3 px-4 py-3 rounded-xl border
		animate-fade-in
		${d[s()]??""}
		${e()??""}
	`)),v(t,r)}$(["click"]);export{L as A,K as C,j as X};

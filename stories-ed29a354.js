import{i as e,c as r,L as t,a as n,s,S as l,m as a,t as i,F as o}from"./index.js";const c=i('<a target="_blank" rel="noreferrer"></a>',2),u=i('<span class="host"> (<!>)</span>',3),g=i('<span class="label"></span>',2),d=i('<li class="news-item"><span class="score"></span><span class="title"></span><br><span class="meta"></span></li>',9);function p(i){return(()=>{const o=d.cloneNode(!0),p=o.firstChild,h=p.nextSibling,y=h.nextSibling.nextSibling;return e(p,(()=>i.story.points)),e(h,r(l,{get when(){return i.story.url},get fallback(){return r(t,{get href(){return`item/${i.story.id}`},get children(){return i.story.title}})},get children(){return[(()=>{const r=c.cloneNode(!0);return e(r,(()=>i.story.title)),n((()=>s(r,"href",i.story.url))),r})(),(()=>{const r=u.cloneNode(!0),t=r.firstChild.nextSibling;return t.nextSibling,e(r,(()=>i.story.domain),t),r})()]}})),e(y,r(l,{get when(){return"job"!==i.story.type},get fallback(){return r(t,{get href(){return`stories/${i.story.id}`},get children(){return i.story.time_ago}})},get children(){return["by ",r(t,{get href(){return`users/${i.story.user}`},get children(){return i.story.user}})," ",a((()=>i.story.time_ago))," |"," ",r(t,{get href(){return`stories/${i.story.id}`},get children(){return i.story.comments_count?`${i.story.comments_count} comments`:"discuss"}})]}})),e(o,r(l,{get when(){return"link"!==i.story.type},get children(){return[" ",(()=>{const r=g.cloneNode(!0);return e(r,(()=>i.story.type)),r})()]}}),null),o})()}const h=i("<ul></ul>",2),y=i('<div class="news-view"><div class="news-list-nav"><span>page </span></div><main class="news-list"></main></div>',8),f=i('<span class="page-link disabled" aria-hidden="true">&lt; prev</span>',2),m=i('<span class="page-link" aria-hidden="true">more &gt;</span>',2);function b(n){return(()=>{const s=y.cloneNode(!0),a=s.firstChild,i=a.firstChild;i.firstChild;const c=a.nextSibling;return e(a,r(l,{get when(){return n.page>1},get fallback(){return f.cloneNode(!0)},get children(){return r(t,{class:"page-link",get href(){return`${n.type}?page=${n.page-1}`},"aria-label":"Previous Page",get children(){return["<"," prev"]}})}}),i),e(i,(()=>n.page),null),e(a,r(l,{get when(){var e;return 30===(null===(e=n.stories)||void 0===e?void 0:e.length)},get fallback(){return m.cloneNode(!0)},get children(){return r(t,{class:"page-link",get href(){return`${n.type}?page=${n.page+1}`},"aria-label":"Next Page",get children(){return["more ",">"]}})}}),null),e(c,r(l,{get when(){return n.stories},get children(){const t=h.cloneNode(!0);return e(t,r(o,{get each(){return n.stories},children:e=>r(p,{story:e})})),t}})),s})()}export default b;

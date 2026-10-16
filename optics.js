/* Distances in mm. Directions and normals are unit vectors. */
(function(root){
'use strict';
const glasses={
 'N-BK7':{B:[1.03961212,.231792344,1.01046945],C:[.00600069867,.0200179144,103.560653]},
 'N-F2':{B:[1.39757037,.159201403,1.2686543],C:[.00995906143,.0546931752,119.248346]}
};
const waves=[{nm:486.1,name:'Blue · F',color:'#3468ef'},{nm:546.1,name:'Green · e',color:'#16965c'},{nm:656.3,name:'Red · C',color:'#e34b51'}];
function index(glass,nm){const g=glasses[glass],l2=(nm/1000)**2;return Math.sqrt(1+g.B.reduce((a,b,i)=>a+b*l2/(l2-g.C[i]),0));}
function unit(v){const l=Math.hypot(...v);return v.map(x=>x/l);}
function refract(d,N,n1,n2){let c=-(d[0]*N[0]+d[1]*N[1]);if(c<0){N=N.map(x=>-x);c=-c;}const eta=n1/n2,k=1-eta*eta*(1-c*c);return k<0?null:unit(d.map((x,i)=>eta*x+(eta*c-Math.sqrt(k))*N[i]));}
function hit(p,d,c,R,branch){const ox=p[0]-c,b=ox*d[0]+p[1]*d[1],q=ox*ox+p[1]*p[1]-R*R,disc=b*b-q;if(disc<0)return null;for(const t of [-b-Math.sqrt(disc),-b+Math.sqrt(disc)]){if(t<1e-7)continue;const h=[p[0]+t*d[0],p[1]+t*d[1]];if(branch*(h[0]-c)>0)return h;}return null;}
function trace(h,nm,s){const {R,t,glass}=s,n=index(glass,nm),p=[-35,h],d=[1,0],a=hit(p,d,R,R,-1);if(!a)return null;const inside=refract(d,unit([a[0]-R,a[1]]),1,n),b=inside&&hit(a,inside,t-R,R,1);if(!b)return null;const out=refract(inside,unit([b[0]-(t-R),b[1]]),n,1);return out?{p,a,b,d:out,n}:null;}
function axis(ray){return ray.b[0]-ray.b[1]*ray.d[0]/ray.d[1];}
function at(ray,x){return ray.b[1]+(x-ray.b[0])*ray.d[1]/ray.d[0];}
function focus(nm,s){return axis(trace(.001,nm,s));}
function pupil(nm,s,count=700){const rays=[];for(let i=0;i<count;i++){const r=s.ap/2*Math.sqrt((i+.5)/count);const ray=trace(r,nm,s);if(ray)rays.push({ray,phi:i*2.399963229728653});}return rays;}
const api={glasses,waves,index,refract,trace,axis,at,focus,pupil};root.Optics=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

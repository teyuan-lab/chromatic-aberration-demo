/* Distances in mm. Directions and normals are unit vectors. */
(function(root){
'use strict';
const glasses={
 'N-BK7':{B:[1.03961212,.231792344,1.01046945],C:[.00600069867,.0200179144,103.560653]},
 'N-F2':{B:[1.39757037,.159201403,1.2686543],C:[.00995906143,.0546931752,119.248346]},
 'N-SF66':{B:[2.0245976,.470187196,2.59970433],C:[.014705323,.0692998276,161.817601]},
 'Silica':{B:[.6961663,.4079426,.8974794],C:[.0684043**2,.1162414**2,9.896161**2]},
 'Fluorite':{B:[.443749998,.444930066,.150133991,8.85319946],C:[.00178027854,.00788536061,.0124119491,2752.28175]},
 'Diamond':{B:[4.658],C:[.1125**2]},
 'Water':{B:[.5672526103,.1736581125,.02121531502,.1138493213],C:[.005085550461,.01814938654,.02617260739,10.73888649]},
 'ZnS':{A:8.393,P:[.14383,4430.99],C:[.2421**2,36.71**2]},
 'Zirconia':{B:[1.347091,2.117788,9.452943],C:[.062543**2,.166739**2,24.320570**2]}
};
const materialInfo={
 'N-BK7':{label:'N-BK7 · crown glass',group:'Optical glasses',note:'Common crown glass; reference material.',source:'https://media.schott.com/api/public/content/41e799d0bf874807a0bb8e702fbb75b5?v=54856406',ref:'SCHOTT N-BK7'},
 'N-F2':{label:'N-F2 · flint glass',group:'Optical glasses',note:'Flint glass with stronger dispersion than crown glass.',source:'https://media.schott.com/api/public/content/061f3156c83a44ed9220770b0f65a869?v=d69b35e0',ref:'SCHOTT N-F2'},
 'N-SF66':{label:'N-SF66 · very dispersive glass',group:'Optical glasses',note:'Dense flint glass with very strong visible dispersion. Absorption and reflection losses are omitted.',source:'https://media.schott.com/api/public/content/c2e0c3a77dcb4c94b349424ee621ee32?v=3320661c',ref:'SCHOTT N-SF66'},
 'Silica':{label:'Fused silica · SiO₂ glass',group:'Optical glasses',note:'Amorphous silica glass at 20 °C; distinct from birefringent crystalline quartz.',source:'https://doi.org/10.1364/JOSA.55.001205',ref:'Malitson (1965)'},
 'Fluorite':{label:'Fluorite · CaF₂',group:'Natural minerals & water',note:'Naturally occurring cubic mineral with low dispersion. Fit measured on synthetic optical CaF₂ at 20 °C.',source:'https://doi.org/10.1364/AO.41.005275',ref:'Daimon & Masumura (2002)'},
 'Diamond':{label:'Diamond · carbon',group:'Natural minerals & water',note:'Naturally occurring cubic mineral. Fit measured on CVD-grown type IIa diamond; index accuracy about ±0.002.',source:'https://commons.erau.edu/publication/666/',ref:'Turri et al. (2017)'},
 'Water':{label:'Water · H₂O (19 °C)',group:'Natural minerals & water',note:'Distilled water at 19 °C, shaped as an ideal lens. No container walls or gravity-driven shape changes are modeled.',source:'https://doi.org/10.1364/AO.46.003811',ref:'Daimon & Masumura (2007)'},
 'ZnS':{label:'Sphalerite · cubic ZnS · very dispersive',group:'Natural minerals & water',note:'Naturally occurring cubic mineral; optical-quality ZnS model at 20 °C. Real mineral color, inclusions, scattering and absorption are omitted.',source:'https://doi.org/10.1364/AO.25.001873',ref:'Debenham (1984); Klein (1986)'},
 'Zirconia':{label:'Cubic zirconia · ZrO₂ (YSZ)',group:'Synthetic crystals',note:'Zirconium dioxide stabilized with 12.0 mol% Y₂O₃ at 25 °C. Cubic phase; this model does not represent monoclinic zirconia or zircon (ZrSiO₄).',source:'https://doi.org/10.1364/AO.21.002978',ref:'Wood & Nassau (1982)'}
};
const waves=[{nm:486.1,name:'Blue · F',color:'#3468ef'},{nm:546.1,name:'Green · e',color:'#16965c'},{nm:656.3,name:'Red · C',color:'#e34b51'}];
function index(glass,nm){const g=glasses[glass],l2=(nm/1000)**2;return Math.sqrt(g.P?g.A+g.P.reduce((a,p,i)=>a+p/(l2-g.C[i]),0):1+g.B.reduce((a,b,i)=>a+b*l2/(l2-g.C[i]),0));}
// Standard Fraunhofer wavelengths for material comparison (not rounded display wavelengths).
function dispersion(glass){const nd=index(glass,587.5618),dn=index(glass,486.1327)-index(glass,656.2725);return {nd,dn,Vd:(nd-1)/dn};}
function unit(v){const l=Math.hypot(...v);return v.map(x=>x/l);}
function refract(d,N,n1,n2){let c=-(d[0]*N[0]+d[1]*N[1]);if(c<0){N=N.map(x=>-x);c=-c;}const eta=n1/n2,k=1-eta*eta*(1-c*c);return k<0?null:unit(d.map((x,i)=>eta*x+(eta*c-Math.sqrt(k))*N[i]));}
function hit(p,d,c,R,branch){const ox=p[0]-c,b=ox*d[0]+p[1]*d[1],q=ox*ox+p[1]*p[1]-R*R,disc=b*b-q;if(disc<0)return null;for(const t of [-b-Math.sqrt(disc),-b+Math.sqrt(disc)]){if(t<1e-7)continue;const h=[p[0]+t*d[0],p[1]+t*d[1]];if(branch*(h[0]-c)>0)return h;}return null;}
function trace(h,nm,s){const {R,t,glass}=s,n=index(glass,nm),p=[-35,h],d=[1,0],a=hit(p,d,R,R,-1);if(!a)return null;const inside=refract(d,unit([a[0]-R,a[1]]),1,n),b=inside&&hit(a,inside,t-R,R,1);if(!b)return null;const out=refract(inside,unit([b[0]-(t-R),b[1]]),n,1);return {p,a,b,d:out,n,tir:!out};}
function axis(ray){return ray.b[0]-ray.b[1]*ray.d[0]/ray.d[1];}
function at(ray,x){return ray.b[1]+(x-ray.b[0])*ray.d[1]/ray.d[0];}
function focus(nm,s){return axis(trace(.001,nm,s));}
function pupil(nm,s,count=700){const rays=[];for(let i=0;i<count;i++){const r=s.ap/2*Math.sqrt((i+.5)/count);const ray=trace(r,nm,s);if(ray&&!ray.tir)rays.push({ray,phi:i*2.399963229728653});}return rays;}
const api={glasses,materialInfo,waves,index,dispersion,refract,trace,axis,at,focus,pupil};root.Optics=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

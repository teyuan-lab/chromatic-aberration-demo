const assert=require('node:assert/strict');
const O=require('./optics.js');
let cases=0,tir=0;
for(const glass of Object.keys(O.glasses))for(const R of [35,50,100])for(const ap of [2,12,22]){
 const s={glass,R,ap,t:6};
 const f=O.waves.map(w=>O.focus(w.nm,s));assert(f[0]<f[1]&&f[1]<f[2]);
 for(const w of O.waves){
  const n=O.index(glass,w.nm),power=2*(n-1)/R-6*(n-1)**2/(n*R*R),bfl=(1-6*(n-1)/(n*R))/power;
  assert(Math.abs(O.focus(w.nm,s)-6-bfl)<1e-4,'Exact trace agrees with thick-lens paraxial BFL');
  for(const h of [.001,ap/4,ap/2]){
   const r=O.trace(h,w.nm,s),m=O.trace(-h,w.nm,s);assert(r&&m);
   assert(Math.abs(Math.hypot(r.a[0]-R,r.a[1])-R)<1e-8);
   assert(Math.abs(Math.hypot(r.b[0]-(6-R),r.b[1])-R)<1e-8);
   const di=[(r.b[0]-r.a[0]),r.b[1]-r.a[1]],len=Math.hypot(...di);di[0]/=len;di[1]/=len;
   const cross=(a,b)=>Math.abs(a[0]*b[1]-a[1]*b[0]);
   const normal1=[(r.a[0]-R)/R,r.a[1]/R],normal2=[(r.b[0]-(6-R))/R,r.b[1]/R];
   assert(Math.abs(cross([1,0],normal1)-n*cross(di,normal1))<1e-10);
   if(r.tir){assert(m.tir);assert(n*cross(di,normal2)>1);tir++;}
   else {assert(Math.abs(r.d[1]+m.d[1])<1e-10);assert(Math.abs(n*cross(di,normal2)-cross(r.d,normal2))<1e-10);}cases++;
  }
 }
}
assert(Math.abs(O.index('N-BK7',587.6)-1.51680)<.00001);
assert(Math.abs(O.index('N-F2',587.6)-1.62005)<.00001);
assert(Math.abs(O.dispersion('N-SF66').Vd-20.88)<.01);
assert(Math.abs(O.index('N-SF66',587.6)-1.92286)<.00001);
assert(Math.abs(O.index('Silica',632.8)-1.45702)<.00001);
assert(Math.abs(O.index('Fluorite',587.7246)-1.4338734)<.000001);
assert(Math.abs(O.index('Water',589.3)-1.3334341)<.00001);
assert(Math.abs(O.index('ZnS',632.8)-2.35)<.002);
assert(Math.abs(O.index('Zirconia',589.3)-2.15847)<.00005);
assert(Math.abs(O.dispersion('Zirconia').dn-.03455)<.00005);
assert(O.dispersion('ZnS').Vd<O.dispersion('N-SF66').Vd);
for(const glass of Object.keys(O.glasses)){let last=Infinity;for(let nm=450;nm<=700;nm+=2){const n=O.index(glass,nm);assert(Number.isFinite(n)&&n>1&&n<last,'Visible dispersion curve is finite and decreases');last=n;}}
for(const glass of Object.keys(O.glasses))for(const R of [35,100])for(const w of O.waves){const b=O.focus(w.nm,{glass,R,t:6})-6;assert(b>5&&b<180,'Screen range covers every paraxial focus');}
let doubletCases=0;
for(let R=35;R<=100;R++){
 const s={mode:'doublet',glass:'N-BK7',R,t:6,ap:22},surfaces=O.prescription(s),blue=O.focus(486.1,s),green=O.focus(546.1,s),red=O.focus(656.3,s),baseline=O.matchedSinglet(s);
 assert(Math.abs(blue-red)<1e-6,'Achromat brings F and C to the same paraxial back focal plane');
 assert(blue>green,'Secondary spectrum remains');
 assert(Math.abs(green-O.rear(s)-(O.focus(546.1,baseline)-O.rear(baseline)))<1e-5,'Baseline matches green BFL');
 assert(green-O.rear(s)>5&&red-O.rear(s)<250,'Screen covers doublet focus');
 for(const y of [0,6,12])for(let i=0;i<2;i++)assert(O.surfaceX(surfaces[i+1].z,surfaces[i+1].R,y)>O.surfaceX(surfaces[i].z,surfaces[i].R,y),'Doublet elements have positive thickness throughout clear aperture');
 for(const w of O.waves){assert(Math.abs(O.focus(w.nm,s)-8-O.paraxialBFL(surfaces,w.nm))<1e-5,'Doublet exact trace agrees with independent paraxial transfer');
 for(const h of [.001,5.5,11]){
  const ray=O.trace(h,w.nm,s),mirror=O.trace(-h,w.nm,s);assert(ray&&!ray.tir&&ray.interfaces.length===3);
  assert(Math.abs(ray.d[1]+mirror.d[1])<1e-9);
  for(const q of ray.interfaces){const cross=(a,b)=>Math.abs(a[0]*b[1]-a[1]*b[0]);assert(Math.abs(q.n1*cross(q.incoming,q.normal)-q.n2*cross(q.outgoing,q.normal))<1e-10,'Snell invariant at each of three interfaces');assert(Math.abs(Math.hypot(q.point[0]-q.surface.z-q.surface.R,q.point[1])-Math.abs(q.surface.R))<1e-7,'Point lies on assigned spherical surface');}doubletCases++;
 }}
}
console.log(`PASS: ${cases} ray cases (${tir} TIR); surface intersections, Snell invariants, symmetry, thick-lens BFL, reference indices, dispersion, focal order, and screen coverage.`);
console.log(`PASS: ${doubletCases} doublet ray cases across all 66 radius settings; three-surface refraction, positive thickness, F/C achromatization, residual secondary spectrum, matched baseline, and screen coverage.`);
console.log('Default BFL (mm):',O.waves.map(w=>({nm:w.nm,bfl:O.focus(w.nm,{glass:'N-BK7',R:50,t:6})-6})));

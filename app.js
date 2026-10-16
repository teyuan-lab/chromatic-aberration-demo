'use strict';
const $=id=>document.getElementById(id),O=Optics;
for(const group of [...new Set(Object.values(O.materialInfo).map(m=>m.group))]){const optgroup=document.createElement('optgroup');optgroup.label=group;for(const [id,info] of Object.entries(O.materialInfo)){if(info.group!==group)continue;const option=document.createElement('option');option.value=id;option.textContent=info.label;optgroup.appendChild(option);}$('glass').appendChild(optgroup);}
let state,focuses;
const actual=nm=>$('dispersion').checked?nm:546.1;
const line=(x1,y1,x2,y2,color,width=1,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
function render(){
 state={R:+$('R').value,t:6,ap:+$('ap').value,glass:$('glass').value};
 const s=state,z=6+(+$('screen').value);
 focuses=O.waves.map(w=>O.focus(actual(w.nm),s));
 const info=O.materialInfo[s.glass],disp=O.dispersion(s.glass);
 $('materialNote').innerHTML=`${info.note} <a href="${info.source}" target="_blank" rel="noopener">Data ↗</a>`;
 $('dispersionStats').textContent=`Vd = ${disp.Vd.toFixed(2)} · nF − nC = ${disp.dn.toFixed(5)}`;
 drawDispersion(s.glass);
 for(const id of ['R','ap','screen'])$(id+'v').textContent=(+$ (id).value).toFixed(id==='screen'?2:0)+' mm';
 ['blue','green','red'].forEach((id,i)=>$(id).textContent=(focuses[i]-6).toFixed(2)+' mm');
 $('spread').textContent=(focuses[2]-focuses[0]).toFixed(3)+' mm';
 const xmin=-35,xmax=Math.max(70,Math.max(...focuses,z)+14),scale=940/(xmax-xmin),X=x=>30+(x-xmin)*scale,Y=y=>132-y*scale;
 let svg=line(22,Y(0),980,Y(0),'#bdc9d7',1,'stroke-dasharray="5 5"');
 const edge=12;let pts=[];for(let j=0;j<=50;j++){const y=-edge+2*edge*j/50;pts.push([s.R-Math.sqrt(s.R*s.R-y*y),y]);}for(let j=50;j>=0;j--){const y=-edge+2*edge*j/50;pts.push([s.t-s.R+Math.sqrt(s.R*s.R-y*y),y]);}
 svg+=`<path d="M${pts.map(p=>`${X(p[0])},${Y(p[1])}`).join(' L')} Z" fill="#e7f1ff" stroke="#8caed6"/>`;
 // The physical clear aperture is 24 mm; input bundle diameter is controlled separately.
 O.waves.forEach(w=>{for(let i=-4;i<=4;i++){const h=i*s.ap/8,ray=O.trace(h,actual(w.nm),s);if(!ray)continue;const tail=ray.tir?'':` L ${X(xmax)} ${Y(O.at(ray,xmax))}`;svg+=`<path d="M ${X(ray.p[0])} ${Y(h)} L ${X(ray.a[0])} ${Y(ray.a[1])} L ${X(ray.b[0])} ${Y(ray.b[1])}${tail}" fill="none" stroke="${w.color}" stroke-width="1.25" opacity=".65"/>`;if(ray.tir)svg+=`<circle cx="${X(ray.b[0])}" cy="${Y(ray.b[1])}" r="3" fill="${w.color}"><title>Total internal reflection at rear surface</title></circle>`;}});
 svg+=line(X(z),25,X(z),225,'#203044',1.5,'stroke-dasharray="4 3"')+`<text x="${Math.min(915,X(z)+6)}" y="24">Screen</text><text x="${X(0)-12}" y="245">Lens</text><text x="32" y="24">Collimated light</text>`;
 focuses.forEach((f,i)=>{svg+=`<circle cx="${X(f)}" cy="${Y(0)}" r="3" fill="${O.waves[i].color}"/>`;});
 for(let x=0;x<xmax;x+=20)svg+=line(X(x),Y(0)-3,X(x),Y(0)+3,'#9dacbc')+`<text x="${X(x)}" y="${Y(0)+19}" text-anchor="middle">${x}</text>`;
 svg+='<text x="965" y="175" text-anchor="end">z (mm)</text>';$('rays').innerHTML=svg;
 const span=Math.max(.3,focuses[2]-focuses[0]),lo=focuses[0]-.3*span,hi=focuses[2]+.3*span,D=x=>30+390*(x-lo)/(hi-lo);
 let inset=line(20,45,435,45,'#c8d4e1');focuses.forEach((f,i)=>{const w=O.waves[i];inset+=line(D(f),30,D(f),60,w.color,2)+`<text x="${D(f)}" y="${i===1?16:80}" text-anchor="middle" style="fill:${w.color}">${w.nm} nm</text><text x="${D(f)}" y="${i===1?29:94}" text-anchor="middle">${(f-6).toFixed(2)} mm</text>`;});
 if(! $('dispersion').checked)inset=line(30,45,420,45,'#c8d4e1')+line(225,30,225,60,'#2465dc',3)+'<text x="225" y="20" text-anchor="middle">All wavelengths coincide</text><text x="225" y="84" text-anchor="middle">'+(focuses[1]-6).toFixed(2)+' mm from rear vertex</text>';
 $('detail').innerHTML=inset;$('explain').textContent=$('dispersion').checked?'Blue bends more strongly and focuses closer to the lens. The screen cannot bring all three colors to a point at once.':'With dispersion disabled, all three colors follow the same paths. Residual spot blur is spherical aberration.';
 const c=$('spot').getContext('2d');c.fillStyle='#0c1525';c.fillRect(0,0,360,360);c.strokeStyle='#293649';c.lineWidth=1;c.beginPath();c.moveTo(180,0);c.lineTo(180,360);c.moveTo(0,180);c.lineTo(360,180);c.stroke();let rows='',clip=0,total=0;
 O.waves.forEach(w=>{const rays=O.pupil(actual(w.nm),s);let r2=0;c.fillStyle=w.color;c.globalCompositeOperation='screen';c.globalAlpha=.5;for(const {ray,phi} of rays){const r=O.at(ray,z),x=r*Math.cos(phi),y=r*Math.sin(phi);r2+=r*r;total++;if(Math.abs(x)>1||Math.abs(y)>1)clip++;c.beginPath();c.arc(180+x*180,180-y*180,1.5,0,Math.PI*2);c.fill();}rows+=`<tr><td style="color:${w.color}">${w.nm}</td><td>${O.index(s.glass,actual(w.nm)).toFixed(5)}</td><td>${(1000*Math.sqrt(r2/rays.length)).toFixed(1)} µm</td></tr>`;});c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle='#aab8cd';c.font='20px system-ui';c.fillText('1 mm',285,345);$('metrics').innerHTML=rows;$('clipped').textContent=(clip?`${(100*clip/total).toFixed(1)}% of transmitted rays outside view.`:'All transmitted rays are within view.')+(total<2100?` ${((2100-total)/21).toFixed(1)}% of pupil samples undergo TIR; first-pass spot excludes them.`:'');
}
function drawDispersion(material){
 const blue=O.index(material,450),red=O.index(material,700),pad=(blue-red)*.12,lo=red-pad,hi=blue+pad;
 const X=nm=>76+(nm-450)/250*865,Y=n=>139-(n-lo)/(hi-lo)*113;
 let plot='';
 for(let j=0;j<=4;j++){const n=lo+(hi-lo)*j/4,y=Y(n);plot+=line(76,y,941,y,'#e6edf5')+`<text x="66" y="${y+4}" text-anchor="end">${n.toFixed(4)}</text>`;}
 for(let nm=450;nm<=700;nm+=50){const x=X(nm);plot+=line(x,26,x,139,'#e6edf5')+`<text x="${x}" y="157" text-anchor="middle">${nm}</text>`;}
 let points=[];for(let nm=450;nm<=700;nm+=2)points.push(`${X(nm)},${Y(O.index(material,nm))}`);
 plot+=`<polyline points="${points.join(' ')}" fill="none" stroke="#2465dc" stroke-width="2.5"/>`;
 O.waves.forEach(w=>{const n=O.index(material,w.nm),x=X(w.nm),y=Y(n);plot+=line(x,y,x,139,w.color,1,'stroke-dasharray="3 3"')+`<circle cx="${x}" cy="${y}" r="4" fill="${w.color}"/><text x="${x+8}" y="${y-9}" style="fill:${w.color}">${w.nm} nm · ${n.toFixed(5)}</text>`;});
 if(!$('dispersion').checked)plot+=line(76,Y(O.index(material,546.1)),941,Y(O.index(material,546.1)),'#253044',1.5,'stroke-dasharray="6 4"');
 plot+='<text x="17" y="16">n(λ)</text><text x="941" y="177" text-anchor="end">Wavelength λ (nm)</text>';
 $('dispersionPlot').innerHTML=plot;$('curveLabel').textContent=O.materialInfo[material].label;
 $('curveCaption').textContent=`n(450 nm) = ${blue.toFixed(5)} → n(700 nm) = ${red.toFixed(5)}. Vertical scale adjusts to the material; compare Vd and Δn for dispersion strength.`+(!$('dispersion').checked?' Dashed line: constant n(546.1 nm) currently used for ray tracing.':'');
}
for(const id of ['R','ap','screen','dispersion'])$(id).addEventListener('input',render);
$('glass').addEventListener('input',()=>{const s={R:+$('R').value,t:6,ap:+$('ap').value,glass:$('glass').value};$('screen').value=O.focus(546.1,s)-6;render();});
document.querySelectorAll('[data-focus]').forEach(b=>b.addEventListener('click',()=>{$('screen').value=O.focus(actual(+b.dataset.focus),state)-6;render();}));
$('reset').addEventListener('click',()=>{$('R').value=50;$('ap').value=12;$('glass').value='N-BK7';$('dispersion').checked=true;state={R:50,t:6,ap:12,glass:'N-BK7'};$('screen').value=O.focus(546.1,state)-6;render();});
$('reset').click();
const materials=Object.keys(O.glasses).sort((a,b)=>O.dispersion(b).Vd-O.dispersion(a).Vd);
$('catalogue').innerHTML=materials.map(id=>{const d=O.dispersion(id);return `<tr><td><a href="${O.materialInfo[id].source}" target="_blank" rel="noopener">${O.materialInfo[id].label}</a></td><td>${d.nd.toFixed(5)}</td><td>${d.dn.toFixed(5)}</td><td>${d.Vd.toFixed(2)}</td></tr>`;}).join('');

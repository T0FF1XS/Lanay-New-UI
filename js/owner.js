/* owner page: only the owner screens and actions live here */
const ROLE='owner';
const R={
 owner:{n:'Owner',d:'Menu, stock and reports',e:'store',pin:'4444',nav:[['reports','Reports','chart-line'],['menu','Menu','book-open'],['stock','Inventory','package'],['staff','Staff','users'],['deliv','Delivery','bike'],['cater','Catering','party-popper'],['fb','Feedback','star'],['log','Activity log','history'],['disc','Discount log','badge-percent'],['qr','Table QR','qr-code'],['set','Settings','settings']]}
};
const alerts=()=>T.stock.filter(s=>s[2]<s[3]).map(s=>`Low stock: ${s[0]}`);
const V={
'owner.reports':()=>{const w=[8200,9400,7800,11200,15600,12300,T.sales],d=w.map((v,i)=>(i?'L':'M')+i*100+' '+(185-v/115)).join(' ');
 const best=MENU.map(m=>[m,S.orders.reduce((a,o)=>a+o.it.reduce((b,[i,q])=>b+(i==m.id?q:0),0),0)+m.id*3%11+20]).sort((a,b)=>b[1]-a[1]).slice(0,5);
 return`<div class="grid stag">${stat('Sales today',Math.round(T.sales),'₱')}${stat('Orders',S.orders.length)}${stat('Bill to receipt','1:48')}${stat('Guest rating',(S.fb.reduce((a,f)=>a+f[1],0)/S.fb.length).toFixed(1))}</div>
<div class="two"><div class="card rise"><h3>Sales this week</h3><svg viewBox="0 0 600 200" style="width:100%"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ac)" stop-opacity=".35"/><stop offset="1" stop-color="var(--ac)" stop-opacity="0"/></linearGradient></defs><path d="${d} L600 200 L0 200Z" fill="url(#g)"/><path class="draw" d="${d}" fill="none" stroke="var(--ac)" stroke-width="4" stroke-linecap="round"/></svg><div class="row sp mut">${L(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],x=>`<span>${x}</span>`)}</div></div><div class="card col rise"><h3>Best sellers</h3>${L(best,([m,n])=>`<div><div class="row sp"><span>${ico(m.e)} ${m.n}</span><b>${n}</b></div><div class="bar"><i style="width:${n/best[0][1]*100}%"></i></div></div>`)}</div></div>`},
'owner.menu':()=>tbl(['Item','Category','Price','On sale'],MENU.map(m=>[ico(m.e)+' '+m.n,m.c,`<input style="width:100px" type="number" value="${m.p}" onchange="A.price(${m.id},this.value)">`,`<button class="sw ${m.on?'on':''}" data-a="tog" data-v="${m.id}"></button>`]))+`<div class="card row rise" style="flex-wrap:wrap"><input id="mn" placeholder="New item name" style="flex:2"><input id="mp" type="number" placeholder="Price" style="flex:1"><select id="mc" style="flex:1"><option>Sushi</option><option>Japanese</option><option>Drinks</option></select><button class="btn" data-a="addm">Add item</button></div>`,
'owner.stock':()=>`<div class="two"><div class="col stag">${L(T.stock,s=>`<div class="card"><div class="row sp"><b>${s[0]}</b>${s[2]<s[3]?chip('Low','bad'):chip('OK','ok')}</div><div class="mut">${s[2]} ${s[1]} in stock, minimum ${s[3]} ${s[1]}</div><div class="bar" style="margin-top:8px"><i style="width:${Math.min(100,s[2]/(s[3]*2)*100)}%"></i></div></div>`)}</div><div class="card col rise" style="align-self:start"><h3>Add stock</h3><select id="si">${L(T.stock,s=>`<option>${s[0]}</option>`)}</select><input id="sa" type="number" placeholder="Amount"><button class="btn" data-a="addst">Save to stock</button></div></div>`,
'owner.staff':()=>tbl(['Name','Role','Status'],T.staff.map(s=>[s[0],s[1],chip('Active','ok')]))+`<div class="card row rise" style="flex-wrap:wrap"><input id="sn" placeholder="Name" style="flex:2"><select id="sr" style="flex:1"><option>Waiter</option><option>Kitchen</option><option>Cashier</option></select><button class="btn" data-a="addstaff">Create account</button></div>`,
'owner.deliv':()=>tbl(['Order','Items','Status',''],T.deliv.map((d,i)=>[d[0],d[1],chip(d[2],d[2]=='Delivered'?'ok':'warn'),`<button class="btn g" data-a="dst" data-v="${i}">Update status</button>`])),
'owner.cater':()=>tbl(['Client','Event','Status'],T.cater.map(c=>[c[0],c[1],chip(c[2],'info')])),
'owner.fb':()=>`<div class="grid stag">${L(S.fb,f=>`<div class="card tint col"><div class="row sp"><b>${f[0]}</b><span class="gold">${L([1,2,3,4,5],k=>ico('star',k<=f[1]?'fill':''))}</span></div><div class="mut">${f[2]}</div></div>`)}</div>`,
'owner.log':()=>T.log.length?tbl(['Time','Who','What'],T.log):empty('history','No activity yet','Voids, price changes and sign-ins appear here.'),
'owner.disc':()=>T.disc.length?tbl(['Time','Order','Type','Name on ID','ID number'],T.disc):empty('badge-percent','No discounts yet','Senior and PWD discounts from the cashier show here.'),
'owner.qr':()=>`<div class="grid stag">${L(TB,n=>`<div class="card hov" style="text-align:center">${qr(n)}<b>Table ${n}</b><div class="mut">customer.html?table=${n}</div><a class="btn g w" style="margin-top:8px;display:block" href="customer.html?table=${n}" target="_blank" rel="noopener">Open customer page</a></div>`)}</div>`,
'owner.set':()=>`<div class="card col rise" style="max-width:520px">${L([['vat','Prices include VAT'],['sound','Sound when a new order arrives'],['backup','Daily backup'],['qr','Allow customers to order from QR']],([k,l])=>`<div class="row sp"><span>${l}</span><button class="sw ${S.set[k]?'on':''}" data-a="set" data-v="${k}"></button></div>`)}<button class="btn g" data-a="reset">Reset demo data</button></div>`,
};
const A={...A_COMMON,
 tog:id=>{const m=M(id);m.on^=1;lg(`${m.n} ${m.on?'back on the menu':'marked sold out'}`);render()},
 price:(id,v)=>{const m=M(id);m.p=+v;lg('Changed price of '+m.n);toast('Price saved')},
 addm:()=>{const n=$('#mn').value,p=+$('#mp').value;if(!n||!p)return toast('Enter a name and price');MENU.push({id:Math.max(...MENU.map(m=>m.id))+1,n,p,c:$('#mc').value,e:'utensils',on:1});lg('Added '+n);render()},
 addst:()=>{const a=+$('#sa').value;if(!a)return toast('Enter an amount');T.stock.find(s=>s[0]==$('#si').value)[2]+=a;lg('Added stock: '+$('#si').value);render();toast('Stock saved')},
 addstaff:()=>{if(!$('#sn').value)return toast('Enter a name');T.staff.push([$('#sn').value,$('#sr').value]);lg('Created account '+$('#sn').value);render()},
 dst:i=>{const s=['Preparing','Ready','Delivered'],d=T.deliv[i];d[2]=s[Math.min(2,s.indexOf(d[2])+1)];render()},
 set:k=>{S.set[k]^=1;render()},
 reset:()=>{API.reset();location.reload()}};
boot();

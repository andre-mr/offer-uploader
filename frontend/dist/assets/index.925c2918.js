const He=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerpolicy&&(a.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?a.credentials="include":s.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}};He();const F="https://api.cadastro.clubebaby.com",Te="https://images.clubebaby.com",pe="https://images.clubebaby.com/offers/backgrounds/",ce=document.getElementById("appContainer"),ue=document.getElementById("loginArea"),l=document.getElementById("loginText"),I=document.getElementById("inputLoginPassword"),Fe=document.getElementById("loginTrustedSwitch"),$e=document.getElementById("loginButton"),se=document.getElementById("modalDialog"),V=document.getElementById("modalOverlay"),Z=document.getElementById("modalRemoveConfirmation"),Q=document.getElementById("modalCloseBatchConfirmation"),he=document.getElementById("btnAddOffer"),Ae=document.getElementById("btnListOffers"),qe=document.getElementById("btnCloseBatch"),Me=document.getElementById("btnListClosedBatches"),Ne=document.getElementById("btnLogout"),K=document.getElementById("listTitle"),H=document.getElementById("tableOffers"),W=document.getElementById("tableBatches"),Pe=document.getElementById("formOffer"),Le=document.getElementById("formWarning"),B=document.getElementById("formFieldTitle"),h=document.getElementById("formFieldStore"),f=document.getElementById("formFieldDescription"),D=document.getElementById("formFieldBadge"),d=document.getElementById("formFieldCode"),c=document.getElementById("formFieldType"),k=document.getElementById("formFieldCategories"),C=document.getElementById("formFieldUrl"),T=document.getElementById("formFieldInputImageFile"),ve=document.getElementById("btnCancelOffer"),Re=document.getElementById("btnCancelOfferRemoving"),ae=document.getElementById("btnSaveOffer"),Ue=document.getElementById("btnConfirmOfferRemoving"),G=document.getElementById("btnCancelCloseBatch"),$=document.getElementById("btnConfirmCloseBatch"),b=document.getElementById("formFieldLabelImage"),U=document.getElementById("formHeaderTitle"),J=document.getElementById("btnScrap"),X=document.getElementById("btnChangeDescription"),j=document.getElementById("btnChangeImage"),oe=document.getElementById("btnChangeBackground"),N=document.getElementById("loadingIcon"),x=document.getElementById("backgroundImage"),v=document.getElementById("productImage"),m=document.getElementById("formFieldInputImage"),O=document.getElementById("checkImageFile"),A=document.getElementById("imageArea"),ie=document.getElementById("btnCopyOffer");let u,E,p,g={stores:null,categories:null,clipboards:null},y,i,S=0,P=0,R=0,z=pe+`background-${R.toString().padStart(2,"0")}.png`,ne=[];he.addEventListener("click",We);T.addEventListener("change",we);T.addEventListener("click",we);ae.addEventListener("click",Ie);ae.addEventListener("keypress",Ie);ve.addEventListener("click",te);ve.addEventListener("keypress",Ke);Ae.addEventListener("click",_);Re.addEventListener("click",re);Ue.addEventListener("click",et);qe.addEventListener("click",Ze);G.addEventListener("click",ee);$.addEventListener("click",Xe);Me.addEventListener("click",Be);c.addEventListener("change",ze);$e.addEventListener("click",be);I.addEventListener("keyup",be);Ne.addEventListener("click",M);J.addEventListener("click",ot);C.addEventListener("input",Se);X.addEventListener("click",at);j.addEventListener("click",Oe);oe.addEventListener("click",le);h.addEventListener("change",ke);m.addEventListener("input",Oe);O.addEventListener("change",rt);ie.addEventListener("click",lt);A.addEventListener("click",dt);function De(){p=localStorage.getItem("APIKEY"),p?_():L(!0),le()}async function ye(){if(!p){L(!0);return}fetch(`${F}/configs?apiKey=${p}`).then(function(e){return e.json()}).then(function(e){if(e.length>0&&e[0]=="password")return l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),I.value="",L(!0),!1;l.classList.remove("text-red-500"),L(!1),je(JSON.parse(e)),Ve()}).catch(function(e){l.innerHTML="Erro na solicita\xE7\xE3o.",l.classList.add("text-red-500"),console.log("Something went wrong!",e)})}function je(e){g.stores=e.stores,g.categories=e.categories,g.clipboards=e.clipboards,y=g.clipboards[0],h.innerHTML="<option hidden>Loja</option>";for(const t of g.stores){const n=document.createElement("option");n.value=t.description,n.textContent=t.description,h.appendChild(n)}k.innerHTML=null;for(const t of g.categories){const n=document.createElement("option");n.value=t.description,n.textContent=t.description,k.appendChild(n)}}function ze(e){e.target.selectedIndex!=1?(d.value=null,d.disabled=!0,d.classList.add("bg-gray-300")):(d.disabled=!1,d.classList.remove("bg-gray-300"))}function Ve(){for(const e of k.options)e.addEventListener("mousedown",t=>{})}function be(e){(e&&e.key&&(e.key=="Enter"||e.keyCode==13)&&I.value||e.target.id=="loginButton")&&(p=I.value,Fe.checked&&localStorage.setItem("APIKEY",`${p}`),_())}function M(){localStorage.removeItem("APIKEY"),window.location.reload()}function L(e){e?(ue.classList.remove("hidden"),ce.classList.add("hidden"),I.focus()):(ue.classList.add("hidden"),ce.classList.remove("hidden"))}function Ce(){V.classList.remove("hidden"),se.classList.remove("hidden"),se.focus()}function Ke(e){e&&e.key&&e.key!="Enter"&&e.keyCode!=13&&te()}function te(e){V.classList.add("hidden"),se.classList.add("hidden"),Ee(),u=null,E=null,Pe.reset(),b.classList.remove("font-bold"),b.textContent="Imagem",re(),ee(),ke("clear"),R=0,le(),A.classList.remove("cursor-pointer"),y=g.clipboards?g.clipboards[0]:null}function Je(){V.classList.remove("hidden"),Z.classList.remove("hidden"),Z.classList.add("flex")}function re(){V.classList.add("hidden"),Z.classList.add("hidden"),Z.classList.remove("flex")}function We(){c.selectedIndex=2,d.disabled=!0,d.classList.add("bg-gray-300"),U.classList.remove("text-orange-500"),U.classList.add("text-blue-500"),U.textContent="Nova oferta",v.src="",x.src=z,u=null,Ce()}function Y(){Le.classList.remove("hidden")}function Ee(){xe(),Le.classList.add("hidden")}function Ye(){const e="border-red-500";B.value||B.classList.add(e),!h.selectedIndex>0&&h.classList.add(e),f.value||f.classList.add(e),!c.selectedIndex>0&&c.classList.add(e),(c.options[c.selectedIndex].value=="code"&&!d.value||c.options[c.selectedIndex].value!="code"&&d.value)&&d.classList.add(e),!k.selectedOptions.length>0&&k.classList.add(e),C.value||C.classList.add(e),O.checked?u||T.classList.add(e):m.value||m.classList.add(e)}function xe(){const e="border-red-500";B.classList.remove(e),h.classList.remove(e),f.classList.remove(e),c.classList.remove(e),d.classList.remove(e),k.classList.remove(e),C.classList.remove(e),m.classList.remove(e),T.classList.remove(e)}function _e(){return!B.value||!h.selectedIndex>0||!f.value||!c.selectedIndex>0||c.options[c.selectedIndex].value=="code"&&!d.value||c.options[c.selectedIndex].value!="code"&&d.value||!C.value||O.checked&&!u||!O.checked&&!m.value?(xe(),Ye(),Y(),!1):(Ee(),!0)}function Ie(e){if(e&&e.key&&(e.key=="Enter"||e.keyCode==13)){e.preventDefault(),ae.click();return}if(!_e())return;let t={};t.id=E||null,t.title=B.value,t.description=f.value,t.badge=D.value?D.value:"Melhor Oferta",t.type=c.options[c.selectedIndex].value,t.code=d.value?d.value:null,t.store=h.options[h.selectedIndex].value,k.selectedOptions.length>0?t.categories='"'+Array.from(k.selectedOptions).map(r=>r.value)+'"':t.categories='"'+Ge()+'"',t.locations=null,t.url=C.value,t.valid_till=null,t.priority=0,t.notes=null,t.image_file=O.checked?u:null,t.imageBackground=O.checked?null:z,t.imageUrl=!O.checked&&i.imageUrls&&i.imageUrls.length>0?i.imageUrls[P]:null;const n=new Headers;n.append("Content-Type","application/json");const o=JSON.stringify(t),s=E?"update":"add";let a={method:E?"PUT":"POST",headers:n,body:o,redirect:"follow"};fetch(`${F}/${s}?apiKey=${p}`,a).then(function(r){if(r.length>0&&r[0]=="password")return l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),I.value="",M(),L(!0),!1;te(),_()}).catch(function(r){console.log("Something went wrong!",r),Y()})}function Ge(){const e=B.value.toLowerCase(),t={fralda:"Fraldas em Promo\xE7\xE3o",umedec:"Len\xE7os Umedecidos",lenco:"Len\xE7os Umedecidos",len\u00E7o:"Len\xE7os Umedecidos",brinquedo:"Brinquedos",mattel:"Brinquedos","fisher price":"Brinquedos",toys:"Brinquedos",leite:"Alimentos e Bebidas",formula:"Alimentos e Bebidas",f\u00F3rmula:"Alimentos e Bebidas",lacteo:"Alimentos e Bebidas",l\u00E1cteo:"Alimentos e Bebidas",chocolat:"Alimentos e Bebidas",cereal:"Alimentos e Bebidas",biscoito:"Alimentos e Bebidas",nestle:"Alimentos e Bebidas",aptamil:"Alimentos e Bebidas",mamadeira:"Acess\xF3rios",copo:"Acess\xF3rios",garrafa:"Acess\xF3rios",babador:"Acess\xF3rios",mordedor:"Acess\xF3rios",esterilizador:"Acess\xF3rios",travesseiro:"Acess\xF3rios",banheiro:"Acess\xF3rios",banheira:"Acess\xF3rios",cotonete:"Sa\xFAde Higiene e Cuidados Pessoais",sabonete:"Sa\xFAde Higiene e Cuidados Pessoais","creme preventivo":"Sa\xFAde Higiene e Cuidados Pessoais",shampoo:"Sa\xFAde Higiene e Cuidados Pessoais",xampu:"Sa\xFAde Higiene e Cuidados Pessoais",condicionador:"Sa\xFAde Higiene e Cuidados Pessoais",creme:"Sa\xFAde Higiene e Cuidados Pessoais",umidificador:"Sa\xFAde Higiene e Cuidados Pessoais",nebulizador:"Sa\xFAde Higiene e Cuidados Pessoais","escova de dente":"Sa\xFAde Higiene e Cuidados Pessoais",talco:"Sa\xFAde Higiene e Cuidados Pessoais",sabao:"Sa\xFAde Higiene e Cuidados Pessoais","protetor solar":"Sa\xFAde Higiene e Cuidados Pessoais","carrinho de bebe":"Carrinho de Beb\xEA","carrinho de beb\xEA":"Carrinho de Beb\xEA","carrinho para beb\xEA":"Carrinho de Beb\xEA",cadeirinha:"Cadeirinha para Autom\xF3vel",assento:"Cadeirinha para Autom\xF3vel",conjunto:"Roupinhas",conjuntinho:"Roupinhas",pijama:"Roupinhas",calca:"Roupinhas",cal\u00E7a:"Roupinhas",camiseta:"Roupinhas",body:"Roupinhas",moletom:"Roupinhas",blusa:"Roupinhas",macacao:"Roupinhas",macac\u00E3o:"Roupinhas",oculos:"Roupinhas",\u00F3culos:"Roupinhas",calcado:"Roupinhas",cal\u00E7ado:"Roupinhas"};let n="";for(const o in t)if(e.includes(o)){n=t[o];break}return n==""&&(n="Geral"),n}function _(){if(!p){L(!0);return}q("Ofertas adicionadas ao lote atual",!1),fetch(`${F}/active?apiKey=${p}`).then(function(e){return e.json()}).then(function(e){if(e.length>0&&e[0]=="password")return l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),I.value="",L(!0),!1;if(l.classList.remove("text-red-500"),L(!1),H.classList.remove("hidden"),W.classList.add("hidden"),e.length>0){q(`Ofertas adicionadas ao lote atual: ${e.length}`,!1),ne=[];for(const t of e)ne.push(t);tt(ne),te()}else st();(!g.stores||!g.categories||g.clipboards)&&ye()}).catch(function(e){q("Erro na consulta, tente mais tarde.",!0),l.innerHTML="Erro na solicita\xE7\xE3o.",l.classList.add("text-red-500"),console.log("Something went wrong!",e)})}function me(e){e.stopPropagation(),Je(),e.target.tagName=="svg"&&(E=e.target.parentElement.parentElement.querySelector('[title="id"]').textContent),e.target.tagName=="path"&&(E=e.target.parentElement.parentElement.parentElement.querySelector('[title="id"]').textContent)}function Ze(){H.querySelector("tbody").children.length>0&&H.querySelector("tbody").children[0].children[1]&&H.querySelector("tbody").children[0].children[1].title=="id"&&Qe()}function Qe(){V.classList.remove("hidden"),Q.classList.remove("hidden"),Q.classList.add("flex")}function ee(){V.classList.add("hidden"),Q.classList.add("hidden"),Q.classList.remove("flex")}function Xe(){const e=new Headers;e.append("Content-Type","application/json");const t="batch";let n={method:"POST",headers:e,redirect:"follow"};G.textContent="Fechar",$.disabled=!0,$.classList.add("hidden"),fetch(`${F}/${t}?apiKey=${p}`,n).then(function(o){if(o.length>0&&o[0]=="password")return l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),I.value="",M(),L(!0),!1;G.textContent="Cancelar",$.disabled=!1,$.classList.remove("hidden"),ee(),Be(),ye()}).catch(function(o){console.log("Something went wrong!",o),q("Erro no Processamento, tente mais tarde.",!0),G.textContent="Cancelar",$.disabled=!1,$.classList.remove("hidden"),ee(),Y()})}function q(e,t){t?K.classList.add("text-red-500"):K.classList.remove("text-red-500"),K.textContent=e}function Be(){H.classList.add("hidden"),W.classList.remove("hidden"),K.textContent="\xDAltimos arquivos de lote fechados",fetch(`${F}/uploaded?apiKey=${p}`).then(function(e){return e.json()}).then(function(e){if(e.length>0&&e[0]=="password")return l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),loginField.value="",M(),L(!0),!1;e.length>0?(e=e.match(new RegExp('(?<=name\\":\\").*?(?=\\".\\"type\\")',"g")),e?(e.sort(),e.reverse(),nt(e)):fe()):fe()}).catch(function(e){q("Erro no Processamento, tente mais tarde.",!0),console.log("Something went wrong!",e)})}function et(){let e={};e.id=E;const t=new Headers;t.append("Content-Type","application/json");const n=JSON.stringify(e),o="delete";let s={method:"DELETE",headers:t,body:n,redirect:"follow"};fetch(`${F}/${o}?apiKey=${p}`,s).then(function(a){if(a.length>0&&a[0]=="password")return l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),I.value="",M(),L(!0),!1;re(),_()}).catch(function(a){console.log("Something went wrong!",a),Y()})}function ge(e){e.stopPropagation(),U.classList.remove("text-blue-500"),U.classList.add("text-orange-500"),U.textContent="Editar oferta";let t;e.target.tagName=="svg"&&(t=e.target.parentElement.parentElement,E=e.target.parentElement.parentElement.querySelector('[title="id"]').textContent),e.target.tagName=="path"&&(t=e.target.parentElement.parentElement.parentElement,E=e.target.parentElement.parentElement.parentElement.querySelector('[title="id"]').textContent),B.value=t.querySelector('[title="title"]').textContent,h.value=t.querySelector('[title="store"]').textContent,f.value=t.querySelector('[title="description"]').textContent,D.value=t.querySelector('[title="badge"]').textContent,t.querySelector('[title="type"]').textContent=="C\xF3digo"?(c.selectedIndex=1,d.disabled=!1,d.classList.remove("bg-gray-300")):(c.selectedIndex=2,d.disabled=!0,d.classList.add("bg-gray-300")),d.value=t.querySelector('[title="code"]').textContent=="null"?"":t.querySelector('[title="code"]').textContent,C.value=t.querySelector('[title="url"]').textContent,Se();const n=t.querySelector('[title="categories"]').textContent.replace(/"/g,"").split(",");for(const o of k.options)for(const s of n)o.textContent==s&&(o.selected=!0);u=t.querySelector('[title="image_file"]').textContent,u?b.textContent="Imagem existente. Escolha outra se necess\xE1rio.":b.textContent="Imagem inexistente. Escolha uma.",b.classList.add("font-bold"),x.src=u,v.src="",Ce()}function tt(e){let t=H.querySelector("tbody");t.innerHTML=null,e.forEach(function(n){const o=document.createElement("tr");o.className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100";let s=document.createElement("td");s.className="text-sm flex justify-center text-gray-900 font-light px-6 py-4 whitespace-nowrap",s.innerHTML='<svg class="cursor-pointer h-5 fill-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z"/></svg>',o.appendChild(s),s.querySelector("svg").addEventListener("click",ge),s.querySelector("path").addEventListener("click",ge),Object.keys(n).forEach(function(r){var w=document.createElement("td");if(r!="title"&&r!="badge"&&r!="type"&&r!="store"&&r!="categories"&&(w.hidden=!0),w.title=r,w.className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap",r=="type"){let de;de=n[r]=="code"?"C\xF3digo":"Oferta",w.appendChild(document.createTextNode(de))}else w.appendChild(document.createTextNode(n[r]));o.appendChild(w)});let a=document.createElement("td");a.className="text-sm flex justify-center text-gray-900 font-light px-6 py-4 whitespace-nowrap",a.innerHTML='<svg class="cursor-pointer h-5 fill-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z"/></svg>',o.appendChild(a),a.querySelector("svg").addEventListener("click",me),a.querySelector("path").addEventListener("click",me),t.appendChild(o)}),H.appendChild(t)}async function nt(e){const t=W.querySelector("tbody");t.innerHTML=null;for(let n=0;n<e.length&&!(n>=100);n++){const o=document.createElement("tr");n==0?o.className="bg-green-300 border-b border-white font-bold transition duration-300 ease-in-out hover:bg-green-400":o.className="bg-green-100 border-b border-white transition duration-300 ease-in-out hover:bg-green-200";let s=document.createElement("td");n==0?s.className="text-center px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-800":s.className="text-center px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800";let a=document.createElement("a");if(a.href=`${Te}/offers/csv/${e[n]}`,a.textContent="CSV - "+e[n].substring(8,10)+"/"+e[n].substring(5,7)+"/"+e[n].substring(0,4)+" - "+e[n].substring(11,13)+":"+e[n].substring(14,16)+":"+e[n].substring(17,19),s.appendChild(a),o.appendChild(s),t.appendChild(o),n==0){const r=document.createElement("tr");r.className="bg-white border-b border-white";const w=document.createElement("td");w.className="py-2 whitespace-nowrap",r.appendChild(w),t.appendChild(r)}}W.appendChild(t)}function st(){K.textContent="Ofertas adicionadas ao lote atual";let e=H.querySelector("tbody");e.innerHTML=null;const t=document.createElement("tr");t.className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100";let n=document.createElement("td");n.className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800",n.innerHTML="N\xE3o h\xE1 resultados para exibir",n.colSpan="7",t.appendChild(n),e.appendChild(t)}function fe(){q("\xDAltimos arquivos de lote fechados",!1);let e=W.querySelector("tbody");e.innerHTML=null;const t=document.createElement("tr");t.className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100";let n=document.createElement("td");n.className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800",n.innerHTML="N\xE3o h\xE1 resultados para exibir",n.colSpan="6",t.appendChild(n),e.appendChild(t)}function we(e){if(e.type=="click")u=null,x.src="",v.src="",b.textContent="Imagem",b.classList.remove("font-bold");else if(u=null,x.src="",v.src="",b.textContent="Imagem",b.classList.remove("font-bold"),e.target.files.length>0){let t=e.target.files[0],n=new FileReader;n.onloadend=()=>{u=n.result,x.src=u,v.src=""},n.readAsDataURL(t)}}function Se(){return C.value.indexOf("https://")>=0||C.value.indexOf("http://")>=0?(J.classList.remove("hidden"),!0):(J.classList.contains("hidden")||J.classList.add("hidden"),!1)}function ot(e){e.preventDefault(),N.classList.contains("hidden")&&N.classList.remove("hidden"),fetch(`${F}/scrapproduct?apiKey=${p}&url=${C.value}`).then(function(t){return t.json()}).then(function(t){if(t.length>0&&t[0]=="password")return l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),loginField.value="",M(),L(!0),!1;t.length>0&&(i=JSON.parse(t),it(i.store)),N.classList.contains("hidden")||N.classList.add("hidden")}).catch(function(t){q("Erro no Processamento, tente mais tarde.",!0),console.log("Something went wrong!",t),N.classList.contains("hidden")||N.classList.add("hidden")})}async function it(e){for(let t=1;t<h.children.length;t++)if(h.children[t].value==e){h.selectedIndex=t;break}for(let t=0;t<g.clipboards.length;t++)g.clipboards[t].store==e&&(y=g.clipboards[t]);if(S=0,P=0,i&&i.descriptions&&i.descriptions.length>1?(X.classList.remove("hidden"),f.classList.remove("pr-2"),f.classList.add("pr-10")):(X.classList.add("hidden"),f.classList.remove("pr-10"),f.classList.add("pr-2")),i&&i.imageUrls&&i.imageUrls.length>1&&!O.checked?j.classList.remove("hidden"):j.classList.add("hidden"),B.value=i.title.substring(0,100),y.store=="Natura"){const t=Number.parseFloat(i.price.value).toLocaleString("pt-BR",{style:"decimal",minimumIntegerDigits:1,minimumFractionDigits:2});D.value="R$ "+t.slice(0,t.length-1)+"0"}else D.value="R$ "+Number.parseFloat(i.price.value).toLocaleString("pt-BR",{style:"decimal",minimumIntegerDigits:1,minimumFractionDigits:2});f.value=i.price.sns?`${y.text3}

${i.descriptions[S].substring(0,8500)}`:i.descriptions[S].substring(0,8500),m.value=i.imageUrls&&i.imageUrls.length>0&&!O.checked?i.imageUrls[0]:"",u=null,v.src=m.value,m.value&&(A.classList.contains("cursor-pointer")||A.classList.add("cursor-pointer"))}function at(e){e.preventDefault(),i&&i.descriptions&&i.descriptions.length>0&&(S>0?S=0:S=1,f.value=i.price.sns?`${y.text3}

${i.descriptions[S].substring(0,8500)}`:i.descriptions[S].substring(0,8500))}function Oe(e){e.type=="click"&&(e.preventDefault(),i&&i.imageUrls&&i.imageUrls.length>0&&(P>=i.imageUrls.length-1?P=0:P++,m.value=i.imageUrls[P])),x.src=z,v.src=m.value,b.textContent="Imagem",b.classList.remove("font-bold"),m.value?A.classList.contains("cursor-pointer")||A.classList.add("cursor-pointer"):A.classList.remove("cursor-pointer")}function le(e){e&&e.preventDefault(),R>=2?R=1:R++,z=pe+`background-${R.toString().padStart(2,"0")}.png`,x.src=z}function rt(e){e.target.checked?(oe.classList.add("hidden"),m.classList.add("hidden"),T.classList.remove("hidden"),j.classList.add("hidden"),x.src=u||"",v.src=""):(oe.classList.remove("hidden"),m.classList.remove("hidden"),T.classList.add("hidden"),i&&i.imageUrls&&j.classList.remove("hidden"),x.src=z,v.src=m.value)}function ke(e){(e.target&&e.target.options[e.target.selectedIndex].value!="Amazon"||e.target&&e.target.options[e.target.selectedIndex].value!="Natura"||e=="clear")&&(i=null,S=0,X.classList.add("hidden"),f.classList.remove("pr-10"),f.classList.add("pr-2"),J.classList.add("hidden"),j.classList.add("hidden")),m.classList.remove("hidden"),T.classList.contains("hidden")||T.classList.add("hidden")}async function lt(){he.classList.contains("animate-pulse")||ie.classList.add("animate-pulse"),setTimeout(()=>{ie.classList.remove("animate-pulse")},1e3);const e=y.text1?`${y.text1}

`:"",t=`*${B.value}*
>>>>>> ${D.value} <<<<<<

${C.value}
`,n=i&&i.price.sns?`
${y.text3}
`:"",o=y.text4?`
${y.text4}
`:"",s=`${e}${t}${n}${o}`;navigator.clipboard.writeText(s)}async function dt(e){e.stopPropagation();const t=document.getElementById("loadingIconDownloadImage");if(v.src.indexOf(".png")>=0||v.src.indexOf(".jpg")>=0){t.classList.contains("hidden")&&t.classList.remove("hidden");const n=document.createElement("a");n.href=await ct();const o=new Date;n.download=`${o.getFullYear().toString()}${(o.getMonth()+1).toString().padStart(2,"0")}${o.getDate().toString().padStart(2,"0")}-${o.getHours().toString().padStart(2,"0")}${o.getMinutes().toString().padStart(2,"0")}-${ut(B.value)}.png`,t.classList.contains("hidden")||t.classList.add("hidden"),n.click()}}function ct(){const e=new Headers;e.append("Content-Type","application/json");const t=JSON.stringify({background:x.src,foreground:v.src}),n="image";let o={method:"POST",headers:e,body:t,redirect:"follow"};return fetch(`${F}/${n}?apiKey=${p}`,o).then(async function(s){return s.length>0&&s[0]=="password"?(l.innerHTML="Senha inv\xE1lida!",l.classList.add("text-red-500"),I.value="",M(),L(!0),!1):await s.json()}).catch(function(s){console.log("Something went wrong!",s),Y()})}function ut(e){console.log("url"),console.log(e);let t=e||"";const n="\xC4\xC5\xC1\xC2\xC0\xC3\xE4\xE1\xE2\xE0\xE3\xC9\xCA\xCB\xC8\xE9\xEA\xEB\xE8\xCD\xCE\xCF\xCC\xED\xEE\xEF\xEC\xD6\xD3\xD4\xD2\xD5\xF6\xF3\xF4\xF2\xF5\xDC\xDA\xDB\xFC\xFA\xFB\xF9\xC7\xE7",o="AAAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUuuuuCc";for(let s=0;s<n.length;s++)t=t.replaceAll(n[s].toString(),o[s].toString());return t=t.replace(/[^a-zA-Z0-9 ]/g,"").replace(/ /g,"-").toLowerCase(),t}De();

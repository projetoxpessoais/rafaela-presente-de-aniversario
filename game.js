
(() => {
 "use strict";
 const $ = id => document.getElementById(id);
 const spots = [
  [170,577,"#f9a2d1"],[340,521,"#8fd4e7"],[497,378,"#b9a2ee"],
  [483,610,"#f6c15f"],[695,609,"#ed8dbb"],[832,605,"#b59cf2"],
  [939,548,"#98d9a8"],[1054,484,"#89c5f1"],[956,404,"#f1ad5d"],
  [1050,605,"#ab84e4"]
 ];
 const entries = [
  {title:"Um novo nível desbloqueado! 🎮",text:"Parabéns pelos seus 18 anos, Rafaela! Que esse novo nível da vida tenha aventuras bonitas, amizades sinceras e muitas conquistas."},
  {title:"Uma dose de alegria ☀️",text:"Que nunca faltem motivos para rir — inclusive daquelas situações tão absurdas que viram histórias para contar depois!"},
  {title:"O desejo da estrelinha ⭐",text:"Escolha um desejo em segredo. Não precisa contar para ninguém: algumas coisas bonitas começam assim, bem quietinhas."},
  {title:"Você merece coisas boas 🌷",text:"Espero que seu aniversário seja leve, divertido e cheio de pequenos momentos felizes. Feliz 18!"},
  {title:"Cantinho das fotos 📸",text:"Aqui vai uma foto engraçada. Ainda vamos escolher e colocar a imagem especial neste presente.",type:"photo"},
  {title:"Mais uma lembrança divertida 📷",text:"Espaço reservado para outra foto engraçada, acompanhada de uma legenda criada especialmente para você.",type:"photo"},
  {title:"Um vídeo surpresa 🎬",text:"Este presente vai guardar o primeiro vídeo especial. Ainda vamos adicionar o arquivo.",type:"video"},
  {title:"A segunda sessão de cinema 🍿",text:"Mais um vídeo divertido vai aparecer aqui. Ainda vamos escolher o arquivo.",type:"video"},
  {title:"Missão de aniversário! 🧩",text:"Desafio: pense em três coisas que você quer viver neste novo ano. Pronto! Você concluiu sua primeira missão da fase 18.",type:"game"},
  {title:"O último presente... 💌",text:"Surpresa! Este quartinho foi preparado para celebrar os seus 18 anos.\n\nQue seu novo ciclo traga boas histórias, descobertas e sorrisos. Feliz aniversário, Rafaela!\n\n[A mensagem final e a assinatura serão personalizadas depois.]",type:"last"}
 ];
 const storeKey="rafaela-presentes-2p5d-v1";
 let opened=new Set(),busy=false,audioCtx=null,musicTimer=null,musicOn=false;
 try{opened=new Set(JSON.parse(localStorage.getItem(storeKey)||"[]").filter(n=>Number.isInteger(n)&&n>=0&&n<10))}catch{}
 const save=()=>{try{localStorage.setItem(storeKey,JSON.stringify([...opened]))}catch{}};
 const unlocked=()=>Array.from({length:9},(_,i)=>i).every(i=>opened.has(i));
 const map=$("giftMap");
 const h=(s)=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
 const darker=color=>color;
 function createGift(i){
  const n=i+1,x=spots[i][0],y=spots[i][1],color=spots[i][2];
  const isOpen=opened.has(i),isLocked=i===9&&!unlocked();
  const g=document.createElementNS("http://www.w3.org/2000/svg","g");
  g.setAttribute("transform","translate("+x+" "+y+")");
  g.setAttribute("class","gift"+(isOpen?" opened":"")+(isLocked?" locked":"")+(i===9&&!isLocked?" unlocked":""));
  g.setAttribute("role","button");g.setAttribute("tabindex","0");
  g.setAttribute("aria-label",isLocked?"Presente 10, trancado até abrir os outros nove":"Abrir presente "+n);
  g.setAttribute("data-gift",i);
  g.innerHTML=
  '<rect x="-56" y="-70" width="112" height="113" fill="transparent"/>'+
  '<g class="gift-body">'+
  '<path d="M-30 -20 L9 -34 L37 -20 L-2 -5Z" fill="#fff1f6" stroke="#654466" stroke-width="3"/>'+
  '<path d="M-30 -20L-2 -5L-2 30L-30 15Z" fill="'+color+'" stroke="#654466" stroke-width="3"/>'+
  '<path d="M-2 -5L37 -20L37 16L-2 30Z" fill="'+darker(color)+'" stroke="#654466" stroke-width="3"/>'+
  '<path d="M-13 -13L-4 -7L-4 29L-13 24Z" fill="#ffe4a4"/>'+
  '<path d="M15 -29L24 -24L24 22L15 25Z" fill="#fff0bd"/>'+
  '<circle cx="5" cy="6" r="17" fill="#fff7ee" stroke="#a875ab" stroke-width="3"/>'+
  '<text x="5" y="14" class="gift-number">'+n+'</text>'+
  '</g>'+
  '<g class="gift-lid">'+
  '<path d="M-37 -26L8 -43L47 -27L0 -9Z" fill="'+color+'" stroke="#58375a" stroke-width="4"/>'+
  '<path d="M-37 -26L0 -9L0 -1L-37 -18Z" fill="#ffe2f3" stroke="#674466" stroke-width="3"/>'+
  '<path d="M0 -9L47 -27L47 -19L0 -1Z" fill="#f9d1f1" stroke="#674466" stroke-width="3"/>'+
  '<path d="M-20 -32L-10 -36L29 -16L20 -12Z" fill="#fff2bb"/>'+
  '<path d="M4 -42L15 -39L-15 -18L-26 -23Z" fill="#fff2bb"/>'+
  '<path d="M-4 -40Q-35 -73 -36 -46Q-36 -36 -4 -35Z" fill="#ffe5af" stroke="#a76a84" stroke-width="4"/>'+
  '<path d="M-4 -40Q20 -76 26 -47Q27 -36 -4 -35Z" fill="#ffe5af" stroke="#a76a84" stroke-width="4"/>'+
  '</g>'+
  '<g class="gift-sparkle" fill="#fff3a6"><path d="M-39 -57l5 14 14 5-14 5-5 14-5-14-14-5 14-5z"/><path d="M39 -67l4 11 11 4-11 4-4 11-4-11-11-4 11-4z"/></g>'+
  '<text class="gift-done" x="42" y="-47" font-size="23" fill="#ddffce" stroke="#40744e" stroke-width="1.2">✓</text>'+
  '<text class="lock-label" x="-2" y="-43" font-size="33" text-anchor="middle">🔒</text>';
  g.addEventListener("click",()=>openGift(i));
  g.addEventListener("keydown",e=>{
   if(e.key==="Enter"||e.key===" "){e.preventDefault();openGift(i)}
  });
  return g;
 }
 function render(){
  map.replaceChildren(...spots.map((_,i)=>createGift(i)));
  const count=Array.from(opened).filter(n=>n<9).length;
  $("progress").textContent=count+" / 9";
  $("fastGifts").replaceChildren(...spots.map((_,i)=>{
   const button=document.createElement("button");
   button.type="button";button.textContent=(opened.has(i)?"✓ ":"🎁 ")+(i+1);
   button.className=(opened.has(i)?"done ":"")+(i===9&&!unlocked()?"locked":"");
   button.setAttribute("aria-label","Abrir presente "+(i+1));
   button.onclick=()=>openGift(i);
   return button;
  }));
  $("secretStatus").textContent=unlocked()?"✨ O presente 10 foi desbloqueado!":"🔒 O presente 10 abre depois dos outros nove.";
 }
 const Ctx=window.AudioContext||window.webkitAudioContext;
 function tone(freq,duration=.16,volume=.025){
  if(!musicOn||!Ctx)return;
  try{
   if(!audioCtx)audioCtx=new Ctx();
   if(audioCtx.state==="suspended")audioCtx.resume();
   const now=audioCtx.currentTime,o=audioCtx.createOscillator(),gain=audioCtx.createGain();
   o.type="sine";o.frequency.value=freq;
   gain.gain.setValueAtTime(Math.max(.0001,volume),now);
   gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
   o.connect(gain);gain.connect(audioCtx.destination);
   o.start(now);o.stop(now+duration);
  }catch{}
 }
 const tune=[523,587,659,0,659,587,523,392,440,523,587,0,523,440,392,0];
 let noteIndex=0;
 function setAudio(on){
  musicOn=on;
  $("sound").textContent=on?"🔊":"🔇";
  $("sound").setAttribute("aria-label",on?"Desligar música":"Ligar música");
  if(musicTimer){clearInterval(musicTimer);musicTimer=null}
  if(on){
   tone(523,.14);
   musicTimer=setInterval(()=>{
    const f=tune[noteIndex++%tune.length];if(f)tone(f,.3,.011);
   },470);
  }
 }
 async function openGift(i){
  if(busy || $("welcome").hidden===false || !$("modal").hidden)return;
  if(i===9&&!unlocked()){
   $("toast").textContent="🔒 Primeiro abra os outros nove presentinhos!";
   $("toast").hidden=false;
   setTimeout(()=>$("toast").hidden=true,2200);
   tone(247,.17,.03);
   return;
  }
  const prevUnlock=unlocked();
  busy=true;const selected=map.querySelector('[data-gift="'+i+'"]');
  if(selected){selected.classList.remove("opened");selected.classList.add("opening")}
  tone(494,.15);
  await new Promise(resolve=>setTimeout(resolve,1150));
  opened.add(i);save();render();
  busy=false;showModal(i);
  if(i!==9&&!prevUnlock&&unlocked())$("secretStatus").textContent="✨ Você desbloqueou o presente 10!";
 }
 function showModal(i){
  const item=entries[i];$("modalTitle").textContent=item.title;
  $("modalText").textContent=item.text;
  const type=item.type;
  $("placeholder").hidden=!(type==="photo"||type==="video");
  $("placeholder").textContent=type==="photo"?"📸 Espaço para a foto":type==="video"?"🎬 Espaço para o vídeo":"";
  $("modal").hidden=false;
  $("closeModal").focus();
  tone(659,.19);setTimeout(()=>tone(784,.22),180);
 }
 function dismissModal(){
  $("modal").hidden=true;
  $("toast").hidden=true;
 }
 $("start").addEventListener("click",()=>{
  $("welcome").hidden=true;render();setAudio(true);
 });
 $("closeModal").addEventListener("click",dismissModal);
 $("modal").addEventListener("click",e=>{if(e.target===$("modal"))dismissModal()});
 $("sound").addEventListener("click",()=>setAudio(!musicOn));
 $("reset").addEventListener("click",()=>{
  if(confirm("Quer recomeçar e fechar todos os presentes?")){
   opened.clear();save();dismissModal();render();
  }
 });
 document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&!$("modal").hidden)dismissModal();
 });
 document.addEventListener("visibilitychange",()=>{
  if(document.hidden&&audioCtx&&audioCtx.state==="running")audioCtx.suspend();
  else if(!document.hidden&&musicOn&&audioCtx&&audioCtx.state==="suspended")audioCtx.resume();
 });
 render();
})();

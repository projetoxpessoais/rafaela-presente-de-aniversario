(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const room = document.querySelector('.room');
  if (window.RAFAELA_SCENE) room.src = window.RAFAELA_SCENE;
  const coords = [
    [244,29,269,160,0],
    [827,27,238,186,3],
    [1094,31,201,197,4],
    [241,225,224,157,2],
    [484,250,196,162,1],
    [708,254,246,179,5],
    [974,244,249,171,6]
  ];
  const titles = ['Foto em família', 'Aniversários', 'Rafaela', 'Carinho', 'Um sorriso especial', 'Uma lembrança divertida', 'Momentos em família'];
  const map = $('memoryMap');
  const shortcuts = $('memoryShortcuts');
  const modal = $('memoryModal');
  const photo = $('memoryPhoto');
  const video = $('memoryVideo');
  let active = false;
  const percent = (n,total) => (100*n/total)+'%';
  const available = () => $('welcome').hidden && $('modal').hidden;
  function openMemory(index){
    if(!available()) return;
    active = true;
    $('memoryTitle').textContent = index === 7 ? 'Nosso vídeo de lembranças 🎬' : (titles[index] + ' 🖼️');
    if(index===7){
      photo.hidden=true; photo.removeAttribute('src');
      video.hidden=false;
      if(window.RAFAELA_VIDEO) video.src=window.RAFAELA_VIDEO;
      video.load();
    }else{
      video.pause();video.removeAttribute('src');video.load();video.hidden=true;
      photo.src=window.RAFAELA_FOTOS[coords[index][4]].src;
      photo.alt=titles[index];photo.hidden=false;
    }
    modal.hidden=false;
    $('closeMemory').focus();
  }
  function closeMemory(){
    if(!active)return;
    active=false;modal.hidden=true;video.pause();video.removeAttribute('src');video.load();
  }
  // Fotos originais: quadros fotográficos de verdade, sem rostos gerados por IA.
  // As imagens foram fornecidas pelo usuário e já estão em fotos-familia.js.
  const photoPanels = [
    [254,37,252,149,0,"50% 50%"],
    [835,34,220,160,3,"50% 36%"],
    [1102,35,176,181,4,"50% 40%"],
    [253,234,196,139,2,"50% 43%"],
    [494,261,177,142,1,"50% 35%"],
    [717,263,227,146,5,"50% 50%"],
    [984,254,226,150,6,"50% 38%"]
  ];
  function putRealPhoto(x,y,w,h,index,position,classname=""){
    if(!window.RAFAELA_FOTOS?.[index]?.src) return;
    const img=document.createElement("img");
    img.className="frame-photo "+classname;
    img.src=window.RAFAELA_FOTOS[index].src;
    img.alt="";
    img.loading="lazy";
    img.decoding="async";
    img.draggable=false;
    Object.assign(img.style,{
      left:percent(x,1672),top:percent(y,941),
      width:percent(w,1672),height:percent(h,941),
      objectPosition:position
    });
    map.append(img);
  }
  coords.forEach(([x,y,w,h,index],i)=>{
    const frame=photoPanels[i];
    putRealPhoto(...frame);
    const btn=document.createElement('button');
    btn.type='button';btn.className='frame-spot';btn.setAttribute('aria-label','Ampliar quadro: '+titles[i]);
    btn.title='✨ '+titles[i];
    Object.assign(btn.style,{left:percent(x,1672),top:percent(y,941),width:percent(w,1672),height:percent(h,941)});
    btn.onclick=()=>openMemory(i);map.append(btn);
    const shortcut=document.createElement('button');shortcut.type='button';shortcut.textContent='🖼️ '+(i+1);
    shortcut.title=titles[i];shortcut.setAttribute('aria-label',titles[i]);shortcut.onclick=()=>openMemory(i);shortcuts.append(shortcut);
  });
  // Miniatura original também na televisão, no lugar da imagem recriada por IA.
  putRealPhoto(1353,290,256,207,5,"50% 50%","tv-photo");
  const tv=document.createElement('button');tv.type='button';tv.className='frame-spot tv-spot';
  tv.setAttribute('aria-label','Reproduzir vídeo na televisão');tv.title='▶ Assistir ao vídeo';
  Object.assign(tv.style,{left:percent(1332,1672),top:percent(269,941),width:percent(306,1672),height:percent(253,941)});
  tv.onclick=()=>openMemory(7);map.append(tv);
  const btnVideo=document.createElement('button');btnVideo.type='button';btnVideo.textContent='📺 Vídeo';
  btnVideo.onclick=()=>openMemory(7);shortcuts.append(btnVideo);
  $('closeMemory').onclick=closeMemory;
  $('backToRoom').onclick=closeMemory;
  modal.addEventListener('click',e=>{if(e.target===modal)closeMemory()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeMemory()});
})();

(() => {
  "use strict";
  // Anima só o rostinho do cenário já aprovado. Fotos reais continuam intactas.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const scene = document.getElementById("scene");
  const original = document.querySelector(".room");
  if (!scene || !original) return;
  const info = {x:451,y:370,w:400,h:360,worldW:1672,worldH:941};
  const display = document.createElement("canvas");
  display.width=info.w; display.height=info.h;
  display.className="avatar-animacao";
  display.setAttribute("aria-hidden","true");
  display.style.cssText="position:absolute;left:"+(100*info.x/info.worldW)+"%;top:"+(100*info.y/info.worldH)+"%;width:"+(100*info.w/info.worldW)+"%;height:"+(100*info.h/info.worldH)+"%;pointer-events:none;z-index:1";
  scene.insertBefore(display,document.getElementById("giftMap"));
  const dc=display.getContext("2d",{alpha:true});
  if (!dc) {display.remove();return;}
  function canvas() {
    const c=document.createElement("canvas"); c.width=info.w;c.height=info.h;return c;
  }
  const img=new Image();
  img.onload=()=>{
    if(!img.naturalWidth)return;
    const closed=canvas();
    closed.getContext("2d").drawImage(
      img, info.x*img.width/info.worldW, info.y*img.height/info.worldH,
      info.w*img.width/info.worldW,info.h*img.height/info.worldH,
      0,0,info.w,info.h
    );
    // Pequenos olhos de desenho aparecem entre as piscadas; não retoca o rosto.
    const open=canvas(),ey=open.getContext("2d");
    ey.drawImage(closed,0,0);
    for(const [x,y] of [[194,178],[271,155]]){
      ey.beginPath();ey.ellipse(x,y,4,5,0,0,Math.PI*2);
      ey.fillStyle="#42282c";ey.fill();
      ey.fillStyle="#fff6e5";ey.fillRect(x-2,y-3,2,2);
    }
    const frames={open:[],closed:[]};
    for(const [name,base] of [["open",open],["closed",closed]]){
      for(let n=0;n<5;n++){
        const f=canvas(),ctx=f.getContext("2d");
        const p=(n-2)/2;
        ctx.save();
        ctx.translate(200,180);
        ctx.rotate(p*.017);
        ctx.translate(-200,-180);
        ctx.drawImage(base,p*2.5,p*-1.3);
        ctx.restore();
        // Dissolve as bordas para que cabelo e cenário não fiquem recortados.
        ctx.globalCompositeOperation="destination-in";
        const glow=ctx.createRadialGradient(205,177,72,205,177,220);
        glow.addColorStop(0,"rgba(0,0,0,1)");
        glow.addColorStop(.68,"rgba(0,0,0,.96)");
        glow.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=glow;ctx.fillRect(0,0,info.w,info.h);
        ctx.globalCompositeOperation="source-over";
        frames[name].push(f);
      }
    }
    let previous="",raf=0;
    const draw=(t)=>{
      if(document.hidden){raf=requestAnimationFrame(draw);return;}
      const phase=Math.sin(t/2100);
      const step=Math.max(0,Math.min(4,Math.round(2+phase*2)));
      const cycle=t%5650;
      const blinking=(cycle<145)||(cycle>335&&cycle<430);
      const name=blinking?"closed":"open";
      const id=name+step;
      if(id!==previous){
        dc.clearRect(0,0,info.w,info.h);
        dc.drawImage(frames[name][step],0,0);
        previous=id;
      }
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    window.addEventListener("pagehide",()=>cancelAnimationFrame(raf),{once:true});
  };
  img.onerror=()=>display.remove();
  img.src=window.RAFAELA_SCENE || original.src;
})();

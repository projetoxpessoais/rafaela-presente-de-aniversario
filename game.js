(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const gift = $("singleGift");
  const welcome = $("welcome");
  const modal = $("modal");
  const message = "Feliz aniversário, Rafa!\n\n18 aninhos, hein? Agora é oficialmente adulta! Dizem que, quando a gente faz 18 anos, começa a entender melhor a vida. Mas, se você descobrir como funciona, depois me explica, porque até hoje ninguém me passou esse manual. KKKKK\n\nRafa, existem pessoas que são especiais não pelo que têm ou pelo que conquistam, mas simplesmente por serem quem são. E você é uma dessas pessoas.\n\nVocê é respeitosa, legal, fofa, responsável, habilidosa, divertida, engraçada, dedicada e inteligente. Aliás, inteligente é pouco! Bem mais que o alberto eisnteing, inclusive. KKKKK\n\nMas sabe o que realmente torna você especial? É que suas qualidades vão muito além dessas palavras.\n\nAdmiro sua força para enfrentar as dificuldades, sua dedicação quando quer alcançar alguma coisa e, principalmente, o jeito como você trata as pessoas. São atitudes que dizem muito sobre quem você é.\n\nE tem uma coisa que eu gostaria muito que você nunca esquecesse: não mude quem você é para tentar se encaixar onde quer que seja.\n\nNunca pense que precisa deixar de ser você mesma para conquistar a consideração ou a amizade de alguém. Seu valor não diminui porque alguém não consegue enxergá-lo. Você merece estar perto de pessoas que reconheçam suas qualidades, respeitem seu jeito e gostem de você exatamente como é.\n\nSer forte não significa que você precise acertar sempre, nem que todos os dias serão fáceis. Significa continuar seguindo em frente, aprendendo, crescendo e descobrindo tudo aquilo de que você é capaz.\n\nE eu espero que você nunca duvide dessa capacidade.\n\nQue seus 18 anos sejam o começo de uma fase maravilhosa, repleta de conquistas, sonhos realizados, muitas bênçãos, felicidade e muito, muito sucesso.\n\nQue Deus ilumine seus caminhos, proteja seus passos e coloque coisas boas em sua vida. Que você receba tudo de bom e de melhor que Ele possa oferecer, porque você merece viver coisas extraordinárias.\n\nQue não faltem motivos para sorrir, oportunidades para crescer, pessoas verdadeiras para compartilhar suas conquistas e coragem para correr atrás de tudo aquilo que deseja.\n\nE, acima de tudo, que você nunca perca essa essência tão especial que faz de você a Rafa.\n\nFeliz 18 anos! Que a vida seja generosa com você e que seu futuro seja ainda mais bonito do que todos os sonhos que você carrega.\n\nNunca se esqueça: você é muito mais especial do que imagina.";
  const key = "rafa-presente-unico-v1";
  let busy = false;
  let read = false;
  let audioCtx = null, musicTimer = null, musicOn = false, noteIndex = 0;
  try { read = localStorage.getItem(key) === "aberto"; } catch {}

  function render() {
    $("progress").textContent = read ? "1 / 1" : "0 / 1";
    gift.classList.toggle("opened", read);
    $("giftHint").textContent = read ? "Ler novamente" : "Clique para abrir";
  }
  const Audio = window.AudioContext || window.webkitAudioContext;
  function tone(freq, duration = .16, volume = .018) {
    if (!musicOn || !Audio) return;
    try {
      if (!audioCtx) audioCtx = new Audio();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(Math.max(.0001, volume), now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now); osc.stop(now + duration);
    } catch {}
  }
  const melody = [523,587,659,0,659,587,523,392,440,523,587,0,523,440,392,0];
  function music(on) {
    musicOn = on;
    $("sound").textContent = on ? "♪" : "♫";
    $("sound").setAttribute("aria-label", on ? "Desligar música" : "Ligar música");
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (on) {
      tone(523,.12);
      musicTimer = setInterval(() => {
        const f = melody[noteIndex++ % melody.length];
        if (f) tone(f,.27,.010);
      }, 470);
    }
  }
  function close() {
    modal.hidden = true;
    gift.focus();
  }
  function openGift() {
    if (busy || !welcome.hidden || !modal.hidden || !$("memoryModal").hidden) return;
    busy = true;
    gift.classList.add("opening");
    tone(659,.2);
    setTimeout(() => {
      gift.classList.remove("opening");
      read = true;
      try { localStorage.setItem(key, "aberto"); } catch {}
      render();
      $("modalTitle").textContent = "Uma mensagem para a Rafa";
      $("modalText").textContent = message;
      $("placeholder").hidden = true;
      modal.hidden = false;
      $("closeModal").focus();
      busy = false;
      tone(784,.25);
    }, 650);
  }
  gift.addEventListener("click", openGift);
  $("openGiftBtn").addEventListener("click", openGift);
  $("start").addEventListener("click", () => {
    welcome.hidden = true;
    music(true);
  });
  $("closeModal").addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  $("sound").addEventListener("click", () => music(!musicOn));
  $("reset").addEventListener("click", () => {
    if (!confirm("Quer fechar o presente e recomeçar a surpresa?")) return;
    read = false;
    try { localStorage.removeItem(key); } catch {}
    modal.hidden = true;
    render();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
  document.addEventListener("visibilitychange", () => {
    if (!audioCtx) return;
    if (document.hidden && audioCtx.state === "running") audioCtx.suspend();
    else if (!document.hidden && musicOn && audioCtx.state === "suspended") audioCtx.resume();
  });
  window.addEventListener("pagehide", () => {
    if (musicTimer) clearInterval(musicTimer);
  }, {once:true});
  render();
})();

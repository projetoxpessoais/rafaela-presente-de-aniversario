(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const gift = $("singleGift");
  const welcome = $("welcome");
  const modal = $("modal");
  const message = "Feliz aniversário, Rafa!\n\n18 aninhos, hein? Agora é oficialmente adulta! Dizem que, quando a gente faz 18 anos, começa a entender melhor a vida. Mas, se você descobrir como funciona, depois me explica, porque até hoje ninguém me passou esse manual. KKKKK\n\nRafa, existem pessoas que são especiais não pelo que têm ou pelo que conquistam, mas simplesmente por serem quem são. E você é uma dessas pessoas.\n\nVocê é respeitosa, legal, fofa, responsável, habilidosa, divertida, engraçada, dedicada e inteligente. Aliás, inteligente é pouco! Bem mais que o alberto eisnteing, inclusive. KKKKK\n\nMas sabe o que realmente torna você especial? É que suas qualidades vão muito além dessas palavras.\n\nAdmiro sua força para enfrentar as dificuldades, sua dedicação quando quer alcançar alguma coisa e, principalmente, o jeito como você trata as pessoas. São atitudes que dizem muito sobre quem você é.\n\nE tem uma coisa que eu gostaria muito que você nunca esquecesse: não mude quem você é para tentar se encaixar onde quer que seja.\n\nNunca pense que precisa deixar de ser você mesma para conquistar a consideração ou a amizade de alguém. Seu valor não diminui porque alguém não consegue enxergá-lo. Você merece estar perto de pessoas que reconheçam suas qualidades, respeitem seu jeito e gostem de você exatamente como é.\n\nSer forte não significa que você precise acertar sempre, nem que todos os dias serão fáceis. Significa continuar seguindo em frente, aprendendo, crescendo e descobrindo tudo aquilo de que você é capaz.\n\nE eu espero que você nunca duvide dessa capacidade.\n\nQue seus 18 anos sejam o começo de uma fase maravilhosa, repleta de conquistas, sonhos realizados, muitas bênçãos, felicidade e muito, muito sucesso.\n\nQue Deus ilumine seus caminhos, proteja seus passos e coloque coisas boas em sua vida. Que você receba tudo de bom e de melhor que Ele possa oferecer, porque você merece viver coisas extraordinárias.\n\nQue não faltem motivos para sorrir, oportunidades para crescer, pessoas verdadeiras para compartilhar suas conquistas e coragem para correr atrás de tudo aquilo que deseja.\n\nE, acima de tudo, que você nunca perca essa essência tão especial que faz de você a Rafa.\n\nFeliz 18 anos! Que a vida seja generosa com você e que seu futuro seja ainda mais bonito do que todos os sonhos que você carrega.\n\nNunca se esqueça: você é muito mais especial do que imagina.";
  const key = "rafa-presente-unico-v1";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const paper = $("modalText");
  const scroller = $("letterScroll");
  const letters = Array.from(message);
  let busy = false, openingTimer = null, typeTimer = null;
  let read = false, typeIndex = 0, writingPaused = false;
  let audioCtx = null, musicTimer = null, musicOn = false, noteIndex = 0;
  try { read = localStorage.getItem(key) === "aberto"; } catch {}

  function render() {
    $("progress").textContent = read ? "1 / 1" : "0 / 1";
    gift.classList.toggle("opened", read);
    $("giftHint").textContent = read ? "Abrir novamente" : "Toque para abrir";
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

  function stopWriting() {
    clearTimeout(typeTimer);
    typeTimer = null;
  }

  function writingDone() {
    stopWriting();
    writingPaused = true;
    paper.classList.remove("typing");
    $("typingStatus").textContent = "Cartinha completa. Leia no seu ritmo.";
    $("toggleTyping").hidden = true;
    $("showAll").hidden = true;
    $("restartTyping").hidden = false;
  }

  function writeNext() {
    if (writingPaused || modal.hidden) return;
    if (typeIndex >= letters.length) {
      writingDone();
      return;
    }
    const wasNearBottom = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop < 90;
    const character = letters[typeIndex++];
    paper.textContent += character;
    if (wasNearBottom) scroller.scrollTop = scroller.scrollHeight;
    let wait = 57;
    if (character === "\n") wait = 200;
    else if (/[.!?]/.test(character)) wait = 380;
    else if (/[,;:]/.test(character)) wait = 210;
    typeTimer = setTimeout(writeNext, wait);
  }

  function startWriting() {
    stopWriting();
    typeIndex = 0;
    paper.textContent = "";
    scroller.scrollTop = 0;
    $("restartTyping").hidden = true;
    if (reducedMotion.matches) {
      paper.textContent = message;
      typeIndex = letters.length;
      writingDone();
      return;
    }
    writingPaused = false;
    paper.classList.add("typing");
    $("typingStatus").textContent = "Escrevendo a cartinha, palavra por palavra...";
    $("toggleTyping").textContent = "Pausar escrita";
    $("toggleTyping").hidden = false;
    $("showAll").hidden = false;
    typeTimer = setTimeout(writeNext, 450);
  }

  function showAll() {
    stopWriting();
    typeIndex = letters.length;
    paper.textContent = message;
    writingDone();
  }

  function close() {
    stopWriting();
    writingPaused = true;
    clearTimeout(openingTimer);
    busy = false;
    gift.classList.remove("opening");
    modal.hidden = true;
    gift.focus();
  }

  function openGift() {
    if (busy || !welcome.hidden || !modal.hidden || !$("memoryModal").hidden) return;
    busy = true;
    gift.classList.remove("opening");
    // Reinicia a animação mesmo quando o presente já foi aberto.
    void gift.offsetWidth;
    gift.classList.add("opening");
    tone(659,.2);
    openingTimer = setTimeout(() => {
      gift.classList.remove("opening");
      read = true;
      try { localStorage.setItem(key, "aberto"); } catch {}
      render();
      $("modalTitle").textContent = "Uma cartinha para a Rafa";
      modal.hidden = false;
      busy = false;
      $("closeModal").focus();
      startWriting();
      tone(784,.25);
    }, reducedMotion.matches ? 0 : 1690);
  }

  gift.addEventListener("click", openGift);
  $("openGiftBtn").addEventListener("click", openGift);
  $("start").addEventListener("click", () => {
    welcome.hidden = true;
    music(true);
  });
  $("closeModal").addEventListener("click", close);
  $("continue").addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
  $("toggleTyping").addEventListener("click", () => {
    if (typeIndex >= letters.length) return;
    writingPaused = !writingPaused;
    $("toggleTyping").textContent = writingPaused ? "Continuar escrita" : "Pausar escrita";
    $("typingStatus").textContent = writingPaused ? "Escrita pausada. Pode ler com calma." : "Escrevendo a cartinha, palavra por palavra...";
    if (writingPaused) stopWriting();
    else writeNext();
  });
  $("showAll").addEventListener("click", showAll);
  $("restartTyping").addEventListener("click", startWriting);
  $("sound").addEventListener("click", () => music(!musicOn));
  $("reset").addEventListener("click", () => {
    if (!confirm("Quer fechar o presente e recomeçar a surpresa?")) return;
    close();
    read = false;
    try { localStorage.removeItem(key); } catch {}
    render();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
  document.addEventListener("visibilitychange", () => {
    if (audioCtx) {
      if (document.hidden && audioCtx.state === "running") audioCtx.suspend();
      else if (!document.hidden && musicOn && audioCtx.state === "suspended") audioCtx.resume();
    }
  });
  window.addEventListener("pagehide", () => {
    clearTimeout(typeTimer);
    clearTimeout(openingTimer);
    if (musicTimer) clearInterval(musicTimer);
  }, {once:true});
  render();
})();

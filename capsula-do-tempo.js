(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const photos = window.RAFAELA_CARTAS;
  const chest = $("timeCapsule");
  const modal = $("capsuleModal");
  const zoomModal = $("capsuleZoom");
  if (!Array.isArray(photos) || photos.length !== 2 || !chest || !modal || !zoomModal) return;

  const page = $("bookPage");
  const image = $("capsulePhoto");
  const fullImage = $("capsuleZoomPhoto");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pageIndex = 0;
  let opening = false, flipping = false, zoom = 1;
  let openingTimer = 0, flippingTimer = 0, swipeStartX = null;

  function otherWindowOpen() {
    return !$("welcome").hidden || !$("modal").hidden || !$("memoryModal").hidden;
  }

  function render() {
    const item = photos[pageIndex];
    image.src = item.src;
    image.alt = "Fotografia original da cartinha " + (pageIndex + 1) + " de 2";
    $("capsulePageCount").textContent = "Cartinha " + (pageIndex + 1) + " de 2";
    $("prevLetter").disabled = pageIndex === 0;
    $("nextLetter").disabled = pageIndex === photos.length - 1;
  }

  function openCapsule() {
    if (opening || !modal.hidden || !zoomModal.hidden || otherWindowOpen()) return;
    opening = true;
    chest.classList.remove("opening");
    // Reinicia a transição ao clicar novamente.
    void chest.offsetWidth;
    chest.classList.add("opening");
    openingTimer = setTimeout(() => {
      chest.classList.remove("opening");
      opening = false;
      pageIndex = 0;
      render();
      modal.hidden = false;
      $("closeCapsule").focus();
    }, reduced.matches ? 0 : 930);
  }

  function closeCapsule() {
    if (!zoomModal.hidden) closeZoom();
    clearTimeout(openingTimer);
    clearTimeout(flippingTimer);
    page.classList.remove("turning");
    flipping = false;
    opening = false;
    chest.classList.remove("opening");
    modal.hidden = true;
    chest.focus();
  }

  function turn(direction) {
    const target = pageIndex + direction;
    if (flipping || target < 0 || target >= photos.length || modal.hidden || !zoomModal.hidden) return;
    if (reduced.matches) {
      pageIndex = target;
      render();
      return;
    }
    flipping = true;
    page.classList.add("turning");
    flippingTimer = setTimeout(() => {
      pageIndex = target;
      render();
      page.classList.remove("turning");
      flippingTimer = setTimeout(() => { flipping = false; }, 350);
    }, 260);
  }

  function setZoom(value) {
    zoom = Math.max(1, Math.min(3.5, value));
    fullImage.style.width = Math.round(zoom * 100) + "%";
    $("zoomOut").disabled = zoom <= 1;
    $("zoomIn").disabled = zoom >= 3.5;
    $("zoomTitle").textContent = "Cartinha " + (pageIndex + 1) + " ampliada";
  }

  function openZoom() {
    if (modal.hidden) return;
    fullImage.src = photos[pageIndex].src;
    fullImage.alt = "Cartinha " + (pageIndex + 1) + " original, ampliada";
    zoomModal.hidden = false;
    setZoom(1.35);
    $("capsuleZoomScroll").scrollTop = 0;
    $("capsuleZoomScroll").scrollLeft = 0;
    $("closeCapsuleZoom").focus();
  }

  function closeZoom() {
    zoomModal.hidden = true;
    fullImage.removeAttribute("src");
    $("zoomLetter").focus();
  }

  chest.addEventListener("click", openCapsule);
  $("closeCapsule").addEventListener("click", closeCapsule);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeCapsule();
  });
  $("prevLetter").addEventListener("click", () => turn(-1));
  $("nextLetter").addEventListener("click", () => turn(1));
  $("zoomLetter").addEventListener("click", openZoom);
  $("closeCapsuleZoom").addEventListener("click", closeZoom);
  zoomModal.addEventListener("click", event => {
    if (event.target === zoomModal) closeZoom();
  });
  $("zoomIn").addEventListener("click", () => setZoom(zoom + .35));
  $("zoomOut").addEventListener("click", () => setZoom(zoom - .35));

  $("memoryBook").addEventListener("touchstart", event => {
    swipeStartX = event.changedTouches[0]?.clientX ?? null;
  }, {passive:true});
  $("memoryBook").addEventListener("touchend", event => {
    if (swipeStartX === null) return;
    const end = event.changedTouches[0]?.clientX;
    if (typeof end === "number" && Math.abs(end - swipeStartX) > 65) {
      turn(end < swipeStartX ? 1 : -1);
    }
    swipeStartX = null;
  }, {passive:true});

  document.addEventListener("keydown", event => {
    if (!zoomModal.hidden) {
      if (event.key === "Escape") { event.preventDefault(); closeZoom(); }
      return;
    }
    if (!modal.hidden) {
      if (event.key === "Escape") { event.preventDefault(); closeCapsule(); }
      if (event.key === "ArrowRight") { event.preventDefault(); turn(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); turn(-1); }
    }
  });
  window.addEventListener("pagehide", () => {
    clearTimeout(openingTimer);
    clearTimeout(flippingTimer);
  }, {once:true});
})();

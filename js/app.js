(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const steps = ["home", "letter", "memories", "pedia", "rose"];
  let nameClicks = 0;
  let installPrompt = null;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    renderContent();
    bindInteractions();
    setupInstall();
    BirthdayAnimations.createAmbientParticles();
    RoseExperience.init();
    updateJourneyUI();

    const state = ExperienceStorage.get();
    if (state.giftOpened) showSite(steps[Math.min(state.currentStep, steps.length - 1)] || "home");
    else $("#gift-button").focus();

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  function renderContent() {
    $("#intro-name").textContent = birthdayData.girlfriend.name.toUpperCase();
    $("#home-message").textContent = birthdayData.intro.homeMessage;
    $("#days-counter").textContent = relationshipDays();
    if (birthdayData.music?.source) $("#background-music").src = birthdayData.music.source;
    renderLetter();
    renderGallery();
    renderEncyclopedia();
  }

  function renderLetter() {
    const letter = birthdayData.letter;
    $("#letter-date").textContent = letter.date;
    $("#letter-greeting").textContent = letter.greeting;
    $("#letter-body").innerHTML = letter.paragraphs.map(item => `<p>${item}</p>`).join("");
    $("#letter-signoff").textContent = letter.signoff;
  }

  function renderGallery() {
    $("#memory-grid").innerHTML = birthdayData.gallery.map((photo, index) => `
      <figure class="memory-frame reveal" style="--frame-delay:${index * 90}ms">
        <div class="photo-mat">
          <img src="${photo.image}" alt="${photo.alt}" loading="lazy">
          <span class="frame-flower flower-top-left" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span>
          <span class="frame-flower flower-bottom-right" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></span>
          <span class="frame-leaf leaf-top" aria-hidden="true"></span>
          <span class="frame-leaf leaf-bottom" aria-hidden="true"></span>
        </div>
      </figure>`).join("");
  }

  function renderEncyclopedia() {
    $("#encyclopedia-grid").innerHTML = birthdayData.encyclopediaEntries.map((entry, index) => `
      <article class="encyclopedia-entry reveal">
        <div class="entry-index">${String(index + 1).padStart(2, "0")}</div>
        <div class="entry-heading">
          <span>${entry.category}</span>
          <h3>${entry.term}</h3>
          <em>${entry.scientificName}</em>
        </div>
        <p>${entry.description}</p>
        <div class="entry-finding"><strong>Temuan penting</strong><span>${entry.finding}</span></div>
      </article>`).join("");
  }

  function bindInteractions() {
    $("#gift-button").addEventListener("click", openGift);
    $("#start-journey").addEventListener("click", () => showSite("home"));
    document.addEventListener("click", event => {
      const next = event.target.closest("[data-next]");
      if (next) { goTo(next.dataset.next); return; }
      const back = event.target.closest("[data-back]");
      if (back) goTo(back.dataset.back);
    });
    $("#open-letter").addEventListener("click", () => {
      $("#envelope").classList.add("open");
      requestAnimationFrame(adjustEnvelopeHeight);
      $("#letter-after").hidden = false;
    });
    $("#music-toggle").addEventListener("click", toggleMusic);
    $("#settings-toggle").addEventListener("click", event => {
      event.stopPropagation();
      $("#settings-menu").hidden = !$("#settings-menu").hidden;
    });
    $("#settings-menu").addEventListener("click", event => event.stopPropagation());
    document.addEventListener("click", () => { $("#settings-menu").hidden = true; });
    $("#reset-experience").addEventListener("click", () => {
      if (confirm("Mulai kembali dari awal dan hapus progres kelopak?")) ExperienceStorage.reset();
    });
    $(".clickable-name").addEventListener("click", nameEasterEgg);
    $(".clickable-name").addEventListener("keydown", event => {
      if (["Enter", " "].includes(event.key)) { event.preventDefault(); nameEasterEgg(); }
    });
    $(".easter-heart").addEventListener("click", () => showToast("Hati rahasia ditemukan", "Ternyata kamu memang ahli menemukan hal-hal kecil yang penuh cinta. ♥"));
    $(".easter-heart").addEventListener("keydown", event => { if (event.key === "Enter") event.currentTarget.click(); });
    window.addEventListener("popstate", () => {
      const target = location.hash.slice(1);
      if (steps.includes(target)) goTo(target, false);
    });
    window.addEventListener("resize", adjustEnvelopeHeight);
  }

  function openGift() {
    const button = $("#gift-button");
    if (button.classList.contains("opening")) return;
    button.classList.add("opening");
    button.disabled = true;
    ExperienceStorage.set({ giftOpened: true });
    playMusic(false);
    setTimeout(BirthdayAnimations.giftBurst, 550);
    setTimeout(() => {
      $("#gift-screen").classList.add("is-hidden");
      $("#intro-screen").classList.remove("is-hidden");
      $("#intro-screen").classList.add("playing");
      setTimeout(() => BirthdayAnimations.typeText($("#intro-quote"), birthdayData.intro.quote, 28), 1400);
      setTimeout(() => $("#start-journey").focus(), 3000);
    }, BirthdayAnimations.reduceMotion ? 50 : 1650);
  }

  function showSite(target) {
    $("#gift-screen").classList.add("is-hidden");
    $("#intro-screen").classList.add("is-hidden");
    $("#site-shell").classList.remove("is-hidden");
    ExperienceStorage.set({ giftOpened: true });
    goTo(target, false);
  }

  function goTo(target, updateHistory = true) {
    const stepIndex = steps.indexOf(target);
    if (stepIndex < 0) return;
    document.querySelectorAll(".page-section").forEach(section => section.classList.toggle("active", section.id === target));
    ExperienceStorage.set({ currentStep: stepIndex });
    if (updateHistory && location.hash !== `#${target}`) history.pushState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: BirthdayAnimations.reduceMotion ? "auto" : "smooth" });
    BirthdayAnimations.observeReveals(document.getElementById(target));
    updateJourneyUI();
    if (target === "letter") requestAnimationFrame(adjustEnvelopeHeight);
  }

  function updateJourneyUI() {
    const index = Math.min(ExperienceStorage.get().currentStep, steps.length - 1);
    $("#current-step").textContent = String(index + 1);
    $("#total-steps").textContent = String(steps.length);
    $("#step-track-fill").style.width = `${((index + 1) / steps.length) * 100}%`;
  }

  function adjustEnvelopeHeight() {
    const envelope = $("#envelope"), paper = $(".letter-paper");
    if (!envelope?.classList.contains("open") || !paper) return;
    const paperHeight = paper.offsetHeight;
    if (paperHeight > 0) envelope.style.height = `${paperHeight + 70}px`;
  }

  async function playMusic(notifyMissing = true) {
    const audio = $("#background-music");
    if (!audio.getAttribute("src")) {
      if (notifyMissing) showToast("Musik belum ditambahkan", "Isi music.source di js/data.js setelah menaruh file lagu di assets/music.");
      return;
    }
    audio.volume = .18;
    try {
      await audio.play();
      $("#music-toggle").textContent = "🔊";
      $("#music-toggle").setAttribute("aria-label", "Matikan musik");
    } catch (_) { $("#music-toggle").textContent = "🔇"; }
  }

  function toggleMusic() {
    const audio = $("#background-music");
    if (audio.paused) playMusic(true);
    else {
      audio.pause();
      $("#music-toggle").textContent = "🔇";
      $("#music-toggle").setAttribute("aria-label", "Nyalakan musik");
    }
  }

  function setupInstall() {
    window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt = event; });
    $("#install-app").addEventListener("click", showInstallDialog);
    $("#install-dialog .modal-close").addEventListener("click", () => $("#install-dialog").close());
    $("#install-confirm").addEventListener("click", async () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      $("#install-dialog").close();
    });
  }

  function showInstallDialog() {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const copy = $("#install-copy"), confirmButton = $("#install-confirm");
    confirmButton.hidden = true;
    if (standalone) copy.innerHTML = "<p>Aplikasi ini sudah terpasang di layar utama ponselmu. ♥</p>";
    else if (installPrompt) {
      copy.innerHTML = "<p>Pasang sebagai aplikasi agar bisa dibuka langsung dari layar utama dan tetap terasa seperti hadiah pribadi.</p>";
      confirmButton.hidden = false;
    } else if (ios) {
      copy.innerHTML = "<p>Di iPhone atau iPad:</p><ol><li>Ketuk tombol <strong>Bagikan</strong> di Safari.</li><li>Pilih <strong>Tambahkan ke Layar Utama</strong>.</li><li>Ketuk <strong>Tambah</strong>.</li></ol>";
    } else {
      copy.innerHTML = "<p>Buka menu browser, lalu pilih <strong>Install app</strong> atau <strong>Tambahkan ke layar utama</strong>. Fitur pemasangan tersedia setelah situs dipublikasikan lewat HTTPS.</p>";
    }
    $("#install-dialog").showModal();
  }

  function nameEasterEgg() {
    nameClicks += 1;
    if (nameClicks === 5) {
      showToast("Ketahuan!", "Kamu suka sekali menekan namamu sendiri, ya? 😂");
      nameClicks = 0;
    }
  }

  function relationshipDays() {
    const raw = birthdayData.girlfriend.relationshipStart;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "∞";
    return Math.max(1, Math.floor((Date.now() - new Date(`${raw}T00:00:00`).getTime()) / 86400000)).toLocaleString("id-ID");
  }

  function showToast(title, message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<strong>${title}</strong><small>${message}</small>`;
    $("#toast-region").appendChild(toast);
    setTimeout(() => toast.remove(), 4300);
  }
})();

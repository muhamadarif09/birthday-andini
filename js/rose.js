const RoseExperience = (() => {
  const TOTAL_PETALS = 4;
  let currentPetal = 0;
  let animationLocked = false;
  let endingStarted = false;

  function init() {
    const roseButton = document.querySelector("#rose-button");
    if (!roseButton) return;
    roseButton.addEventListener("click", handleRoseTouch);
    restoreState();
  }

  function handleRoseTouch() {
    if (animationLocked || endingStarted || currentPetal >= TOTAL_PETALS) return;
    animationLocked = true;
    const roseButton = document.querySelector("#rose-button");
    const petalIndex = currentPetal;
    roseButton.classList.add("is-blooming");
    roseButton.setAttribute("aria-disabled", "true");

    removePetal(petalIndex);
    const messageDelay = BirthdayAnimations.reduceMotion ? 20 : 420;
    window.setTimeout(() => showLoveMessage(petalIndex), messageDelay);

    currentPetal = petalIndex + 1;
    updateProgress(currentPetal);
    ExperienceStorage.set({ roseProgress: currentPetal });

    if (currentPetal === TOTAL_PETALS) {
      window.setTimeout(startBubbleEnding, BirthdayAnimations.reduceMotion ? 80 : 3000);
      return;
    }

    window.setTimeout(() => {
      animationLocked = false;
      roseButton.classList.remove("is-blooming");
      roseButton.removeAttribute("aria-disabled");
      document.querySelector("#rose-prompt").textContent = "Sentuh sekali lagi untuk pesan berikutnya…";
    }, BirthdayAnimations.reduceMotion ? 80 : 1500);
  }

  function removePetal(index) {
    const sourcePetal = document.querySelectorAll("[data-removable]")[index];
    if (!sourcePetal) return;
    sourcePetal.classList.add("is-picked");

    const fallingPetal = document.createElement("span");
    fallingPetal.className = "falling-rose-petal";
    fallingPetal.style.setProperty("--petal-drift", `${index % 2 === 0 ? 52 + index * 9 : -58 - index * 7}px`);
    fallingPetal.style.setProperty("--petal-turn", `${index % 2 === 0 ? 210 : -230}deg`);
    document.querySelector("#petal-fall-layer").appendChild(fallingPetal);
    fallingPetal.addEventListener("animationend", () => fallingPetal.remove(), { once: true });
    if (BirthdayAnimations.reduceMotion) window.setTimeout(() => fallingPetal.remove(), 100);
  }

  function showLoveMessage(index) {
    const messageBox = document.querySelector("#rose-message");
    const number = messageBox.querySelector("span");
    const message = messageBox.querySelector("p");
    number.textContent = String(index + 1).padStart(2, "0");
    message.textContent = loveMessages[index];
    messageBox.classList.remove("message-visible");
    void messageBox.offsetWidth;
    messageBox.classList.add("message-visible");
  }

  function updateProgress(progress) {
    const dots = document.querySelectorAll("#petal-progress span");
    dots.forEach((dot, index) => dot.classList.toggle("complete", index < progress));
    document.querySelector("#petal-progress").setAttribute("aria-label", `${progress} dari ${TOTAL_PETALS} pesan terbuka`);
  }

  function startBubbleEnding(restored = false) {
    if (endingStarted) return;
    endingStarted = true;
    animationLocked = true;

    const roseStage = document.querySelector("#rose-stage");
    const roseButton = document.querySelector("#rose-button");
    const ending = document.querySelector("#bubble-ending");
    roseButton.disabled = true;
    roseButton.classList.remove("is-blooming");
    roseStage.classList.add("ending-active");
    document.querySelector("#rose-prompt").textContent = "Empat kelopak, satu kesimpulan…";
    document.querySelector("#rose-back").hidden = true;
    createDreamBubbles();
    ending.hidden = false;
    window.requestAnimationFrame(() => ending.focus({ preventScroll: true }));
    if (restored) ending.classList.add("ending-restored");
    ExperienceStorage.set({ roseProgress: TOTAL_PETALS, roseEndingComplete: true });
  }

  function createDreamBubbles() {
    const field = document.querySelector("#bubble-field");
    if (field.childElementCount) return;
    for (let index = 0; index < 20; index += 1) {
      const bubble = document.createElement("span");
      bubble.className = "dream-bubble";
      bubble.style.setProperty("--bubble-left", `${4 + Math.random() * 90}%`);
      bubble.style.setProperty("--bubble-size", `${18 + Math.random() * 58}px`);
      bubble.style.setProperty("--bubble-delay", `${Math.random() * 4.5}s`);
      bubble.style.setProperty("--bubble-duration", `${6 + Math.random() * 5}s`);
      bubble.style.setProperty("--bubble-drift", `${(Math.random() - .5) * 100}px`);
      field.appendChild(bubble);
    }
  }

  function restoreState() {
    const state = ExperienceStorage.get();
    currentPetal = Math.min(Number(state.roseProgress) || 0, TOTAL_PETALS);
    document.querySelectorAll("[data-removable]").forEach((petal, index) => petal.classList.toggle("is-picked", index < currentPetal));
    updateProgress(currentPetal);
    if (currentPetal > 0) showLoveMessage(currentPetal - 1);
    if (state.roseEndingComplete || currentPetal === TOTAL_PETALS) startBubbleEnding(true);
  }

  return { init };
})();

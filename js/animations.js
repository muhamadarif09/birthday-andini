const BirthdayAnimations = (() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function createAmbientParticles() {
    if (reduceMotion) return;
    const holder = document.querySelector("#ambient-particles");
    if (!holder || holder.childElementCount) return;

    for (let index = 0; index < 14; index += 1) {
      const particle = document.createElement("span");
      particle.textContent = index % 3 === 0 ? "♡" : index % 3 === 1 ? "✦" : "❀";
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animation = `ambientFloat ${13 + Math.random() * 12}s ${Math.random() * -20}s linear infinite`;
      holder.appendChild(particle);
    }
  }

  function observeReveals(root = document) {
    const items = root.querySelectorAll(".reveal:not(.visible)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .14 });

    items.forEach(item => observer.observe(item));
  }

  function giftBurst() {
    if (reduceMotion) return;
    const glyphs = ["♥", "✦", "♡", "❀"];

    for (let index = 0; index < 38; index += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = "gift-spark";
      sparkle.textContent = glyphs[index % glyphs.length];
      sparkle.style.left = "50vw";
      sparkle.style.top = "53vh";
      sparkle.style.setProperty("--x", `${(Math.random() - .5) * 95}vw`);
      sparkle.style.setProperty("--y", `${(Math.random() - .65) * 80}vh`);
      sparkle.style.animationDelay = `${Math.random() * .25}s`;
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1700);
    }
  }

  function typeText(element, text, speed = 30) {
    if (!element) return Promise.resolve();
    if (reduceMotion) {
      element.textContent = text;
      return Promise.resolve();
    }

    element.textContent = "";
    return new Promise(resolve => {
      let index = 0;
      const timer = setInterval(() => {
        element.textContent += text[index] || "";
        index += 1;
        if (index >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  return { reduceMotion, createAmbientParticles, observeReveals, giftBurst, typeText };
})();

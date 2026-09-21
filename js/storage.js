const ExperienceStorage = (() => {
  const KEY = "andiniBirthdayJourneyV4";
  const defaults = { giftOpened: false, currentStep: 0, roseProgress: 0, roseEndingComplete: false };

  function get() {
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
    catch (_) { return { ...defaults }; }
  }

  function set(patch) {
    const next = { ...get(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }

  function reset() {
    localStorage.removeItem(KEY);
    location.hash = "";
    location.reload();
  }

  return { get, set, reset };
})();

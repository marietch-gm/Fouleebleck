/* La Foulée Bleck — interactions */
(function () {
  "use strict";

  var cfg = window.FOULEE_CONFIG || {};
  var reg = cfg.registration || {};

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Données de l'édition ---------- */
  function applyConfig() {
    $$("[data-cfg]").forEach(function (el) {
      var key = el.getAttribute("data-cfg");
      var value = key === "deadlineLabel" ? reg.deadlineLabel : cfg[key];
      if (value !== undefined && value !== null) el.textContent = value;
    });

    $$("[data-cfg-unconfirmed]").forEach(function (el) {
      el.hidden = cfg.dateConfirmed !== false;
    });

    if (cfg.contactEmail) {
      $$("[data-cfg-mail]").forEach(function (el) {
        var subject = el.getAttribute("data-subject");
        el.href = "mailto:" + cfg.contactEmail + (subject ? "?subject=" + encodeURIComponent(subject) : "");
        if (!el.children.length && el.textContent.indexOf("@") !== -1) el.textContent = cfg.contactEmail;
      });
    }

    if (cfg.previousEdition) {
      $$("[data-cfg-prev]").forEach(function (el) { el.href = cfg.previousEdition.url; });
      $$("[data-cfg-prev-label]").forEach(function (el) { el.textContent = cfg.previousEdition.label; });
    }

    var year = $("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- Boutons d'inscription ---------- */
  function applyRegistration() {
    var status = reg.status || "open";
    var href, label, external = false;

    if (status === "open" && reg.url) {
      href = reg.url;
      external = true;
    } else if (status === "soon") {
      href = "mailto:" + (cfg.contactEmail || "") + "?subject=" +
        encodeURIComponent("Prévenez-moi de l’ouverture des inscriptions");
      label = "M’avertir de l’ouverture";
    } else {
      href = "#infos";
      label = "S’inscrire sur place";
    }

    $$("[data-reg]").forEach(function (el) {
      el.href = href;
      if (external) el.rel = "noopener";
      if (label) {
        var target = $("[data-reg-label]", el);
        if (target) target.textContent = label;
        else el.textContent = label;
      }
    });
  }

  /* ---------- Compte à rebours ---------- */
  function startCountdown() {
    var box = $("[data-countdown]");
    if (!box || !cfg.dateISO) return;
    var target = new Date(cfg.dateISO).getTime();
    if (isNaN(target)) return;

    var parts = {
      days: $("[data-cd='days']", box),
      hours: $("[data-cd='hours']", box),
      minutes: $("[data-cd='minutes']", box),
      seconds: $("[data-cd='seconds']", box)
    };
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };
    var timer;

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        box.hidden = true;
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      parts.days.textContent = Math.floor(s / 86400);
      parts.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      parts.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      parts.seconds.textContent = pad(s % 60);
      box.hidden = false;
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---------- En-tête & menu mobile ---------- */
  function initHeader() {
    var header = $("[data-header]");
    var toggle = $("[data-nav-toggle]");
    var nav = $("#main-nav");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      $("use", toggle).setAttribute("href", open ? "#i-close" : "#i-menu");
      $(".sr-only", toggle).textContent = open ? "Fermer le menu" : "Ouvrir le menu";
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Aide au choix du parcours ---------- */
  function initFinder() {
    var finder = $("[data-finder]");
    if (!finder) return;
    var result = $("[data-finder-result]", finder);
    var chips = $$(".chip", finder);
    var grids = $$(".courses-feature, .courses-compact");
    var courses = $$("[data-course]");

    function reset() {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      courses.forEach(function (c) { c.classList.remove("is-match"); });
      grids.forEach(function (g) { g.classList.remove("is-filtering"); });
      result.textContent = "";
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var wasActive = chip.getAttribute("aria-pressed") === "true";
        reset();
        if (wasActive) return;

        chip.setAttribute("aria-pressed", "true");
        var matches = chip.getAttribute("data-match").split(" ");
        courses.forEach(function (c) {
          c.classList.toggle("is-match", matches.indexOf(c.getAttribute("data-course")) !== -1);
        });
        grids.forEach(function (g) { g.classList.add("is-filtering"); });
        result.textContent = chip.getAttribute("data-msg");
      });
    });
  }

  /* ---------- Tarif Groupe Mutuel (−50 %) ---------- */
  function formatCHF(amount) {
    var str = amount % 1 === 0 ? String(amount) : amount.toFixed(2);
    return "CHF " + str;
  }

  function initDiscount() {
    var toggle = $("[data-gm-toggle]");
    if (!toggle) return;
    var prices = $$("[data-price]");

    function render() {
      var on = toggle.checked;
      prices.forEach(function (el) {
        var base = parseFloat(el.getAttribute("data-price"));
        var old = el.previousElementSibling;
        if (old && old.classList.contains("price-old")) old.remove();
        el.textContent = formatCHF(on ? base / 2 : base);
        if (on) {
          var s = document.createElement("s");
          s.className = "price-old";
          s.textContent = formatCHF(base);
          s.setAttribute("aria-label", "au lieu de " + formatCHF(base));
          el.parentNode.insertBefore(s, el);
        }
      });
    }

    toggle.addEventListener("change", render);
    render();
  }

  /* ---------- Carte (chargée au clic, respect de la vie privée) ---------- */
  function initMap() {
    var map = $("[data-map]");
    var btn = $("[data-map-load]");
    if (!map || !btn) return;
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.google.com/maps?q=" +
        encodeURIComponent("Place du Vieux Village, 1971 Grimisuat") + "&output=embed";
      iframe.title = "Carte : Place du Vieux Village, Grimisuat";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      map.innerHTML = "";
      map.appendChild(iframe);
    });
  }

  /* ---------- Barre d'inscription mobile ---------- */
  function initStickyCta() {
    var bar = $("[data-sticky-cta]");
    var hero = $(".hero");
    var finalCta = $(".final-cta");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;

    var heroVisible = true, finalVisible = false;
    var update = function () {
      var show = !heroVisible && !finalVisible;
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", String(!show));
      $$("a", bar).forEach(function (a) { a.tabIndex = show ? 0 : -1; });
    };

    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      update();
    }, { threshold: 0.05 }).observe(hero);

    if (finalCta) {
      new IntersectionObserver(function (entries) {
        finalVisible = entries[0].isIntersecting;
        update();
      }).observe(finalCta);
    }
  }

  /* ---------- Apparition au défilement ---------- */
  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.remove("reveal"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");
        io.unobserve(el);
        // Une fois affiché, on rend la main aux effets de survol.
        setTimeout(function () { el.classList.remove("reveal", "is-visible"); }, 700);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  applyConfig();
  applyRegistration();
  startCountdown();
  initHeader();
  initFinder();
  initDiscount();
  initMap();
  initStickyCta();
  initReveal();
})();

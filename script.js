// ── Panel navigation helper ─────────────────────────────
(function () {
  const items  = document.querySelectorAll('.sidebar .nav-item[data-panel]');
  const panels = document.querySelectorAll('.panel, .home-panel');
  const area   = document.querySelector('.content-area');
  const sidebar = document.querySelector('.sidebar');

  function navigateTo(panelId, scrollTargetId) {
    items.forEach(function (i) { i.classList.remove('active'); });
    const navItem = document.querySelector('.sidebar .nav-item[data-panel="' + panelId + '"]');
    if (navItem) navItem.classList.add('active');

    panels.forEach(function (p) { p.classList.remove('active'); });
    const target = document.getElementById('panel-' + panelId);
    if (target) target.classList.add('active');

    if (area) area.scrollTop = 0;
    sidebar.classList.remove('open');

    if (scrollTargetId) {
      requestAnimationFrame(function () {
        const section = document.getElementById(scrollTargetId);
        if (section && area) {
          const panelTop = area.getBoundingClientRect().top;
          const sectionTop = section.getBoundingClientRect().top;
          area.scrollBy({ top: sectionTop - panelTop - 24, behavior: 'smooth' });
        }
      });
    }
  }

  // Sidebar nav items
  items.forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (e.target.closest('.nav-arrow')) return; // handled by accordion
      navigateTo(this.getAttribute('data-panel'));
    });
  });

  // Home chapter cards + quick-access buttons
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.home-chapter-card[data-panel], .home-quick-btn[data-panel]');
    if (card) navigateTo(card.getAttribute('data-panel'));
  });

  // Expose for subitem use
  window._navigateTo = navigateTo;
})();

// ── Accordion sidebar ──────────────────────────────────
(function () {
  const area = document.querySelector('.content-area');

  document.querySelectorAll('.sidebar .nav-item[data-panel]').forEach(function (item) {
    const panelId = item.getAttribute('data-panel');
    const panel = document.getElementById('panel-' + panelId);
    if (!panel) return;

    const navBtns = panel.querySelectorAll('.urg-nav-btn[data-urg]');
    if (navBtns.length === 0) return;

    // Add arrow indicator
    item.classList.add('has-children');
    const arrow = document.createElement('span');
    arrow.className = 'nav-arrow';
    arrow.textContent = '›';
    item.appendChild(arrow);

    // Build submenu
    const subitems = document.createElement('div');
    subitems.className = 'nav-subitems';

    navBtns.forEach(function (btn) {
      const targetId = btn.getAttribute('data-urg');
      // Get text without SVG icon content
      const label = btn.textContent.trim();
      const sub = document.createElement('div');
      sub.className = 'nav-subitem';
      sub.textContent = label;
      sub.addEventListener('click', function (e) {
        e.stopPropagation();
        if (window._navigateTo) window._navigateTo(panelId, targetId);
      });
      subitems.appendChild(sub);
    });

    item.parentNode.insertBefore(subitems, item.nextSibling);

    // Arrow click → only toggle submenu, never navigate
    arrow.addEventListener('click', function (e) {
      e.stopPropagation();
      item.classList.toggle('expanded');
      subitems.classList.toggle('open');
    });
  });
})();

// ── Auto-inject contextual emojis to section headers ──
(function () {
  const emojiMap = [
    { words: ['analgés'],                  emoji: '💊' },
    { words: ['antibiótic'],               emoji: '🦠' },
    { words: ['anti-inflamat'],            emoji: '🔥' },
    { words: ['anestés'],                  emoji: '💉' },
    { words: ['dor de dente', 'pulpite'],  emoji: '💥' },
    { words: ['abscesso'],                 emoji: '🩺' },
    { words: ['hemorrag'],                 emoji: '🩸' },
    { words: ['trauma', 'avulsão', 'fratura dentária'], emoji: '🦷' },
    { words: ['laser', 'fotob'],           emoji: '💡' },
    { words: ['parestesia'],               emoji: '⚡' },
    { words: ['criança', 'pediát', 'decíduo'], emoji: '👶' },
    { words: ['siso', 'terceiro molar', 'pericoronarit'], emoji: '😬' },
    { words: ['sus', 'serviço único'],     emoji: '🏥' },
    { words: ['farmac', 'prescriç', 'medicaç', 'profilaxia'], emoji: '💊' },
    { words: ['resumo'],                   emoji: '✅' },
    { words: ['checklist'],                emoji: '📋' },
    { words: ['não fazer', 'erros comuns'], emoji: '⚠️' },
    { words: ['mentalidade', 'raciocín'],  emoji: '🧠' },
    { words: ['quando encaminhar'],        emoji: '🚑' },
    { words: ['reflexão'],                 emoji: '💬' },
    { words: ['conduta', 'como aplicar', 'como orientar'], emoji: '✅' },
    { words: ['pacientes especiais'],      emoji: '🛡️' },
    { words: ['diagnóst'],                 emoji: '🔍' },
    { words: ['relaxante', 'bruxismo'],    emoji: '😤' },
    { words: ['situações clínicas', 'adaptando'], emoji: '⚙️' },
    { words: ['orientar o paciente', 'comunicaç'], emoji: '💬' },
    { words: ['condição financeira'],      emoji: '💰' },
    { words: ['comparação', 'diferenças'], emoji: '⚖️' },
  ];

  document.querySelectorAll('.urg-block-header').forEach(function (header) {
    if (header.querySelector('.urg-block-emoji')) return;
    var titleEl = header.querySelector('.urg-title, .urg-block-title');
    if (!titleEl) return;
    var text = titleEl.textContent.toLowerCase();
    var emoji = '🔹';
    for (var i = 0; i < emojiMap.length; i++) {
      var rule = emojiMap[i];
      if (rule.words.some(function (w) { return text.includes(w.toLowerCase()); })) {
        emoji = rule.emoji;
        break;
      }
    }
    var span = document.createElement('span');
    span.className = 'urg-block-emoji';
    span.textContent = emoji;
    header.insertBefore(span, header.firstChild);
  });
})();

// Urgency nav, smooth scroll within content area
(function () {
  const area = document.querySelector('.content-area');

  document.addEventListener('click', function (e) {
    // Urgency nav buttons
    const btn = e.target.closest('.urg-nav-btn');
    if (btn) {
      const targetId = btn.getAttribute('data-urg');
      const target = document.getElementById(targetId);
      if (target && area) {
        const panelTop = area.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        area.scrollBy({ top: targetTop - panelTop - 24, behavior: 'smooth' });
      }
      return;
    }

    // Back to top buttons
    const backBtn = e.target.closest('.back-top-btn');
    if (backBtn) {
      const targetId = backBtn.getAttribute('data-back');
      const target = document.getElementById(targetId);
      if (target && area) {
        const panelTop = area.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        area.scrollBy({ top: targetTop - panelTop - 24, behavior: 'smooth' });
      }
    }
  });
})();

// ── Mobile: close sidebar on outside click ─────────────
(function () {
  const sidebarEl = document.querySelector('.sidebar');
  document.addEventListener('click', function (e) {
    if (
      sidebarEl.classList.contains('open') &&
      !sidebarEl.contains(e.target) &&
      !e.target.closest('.mobile-menu-btn')
    ) {
      sidebarEl.classList.remove('open');
    }
  });
})();

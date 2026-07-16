(() => {
  const inventory = Array.isArray(window.ALP_MED_INVENTORY) ? window.ALP_MED_INVENTORY : [];
  const grid = document.querySelector('#catalogue-grid');
  const searchInput = document.querySelector('#catalogue-search');
  const categoryFilter = document.querySelector('#category-filter');
  const countryFilter = document.querySelector('#country-filter');
  const resultCount = document.querySelector('#result-count');
  const emptyState = document.querySelector('#empty-state');
  const clearFilters = document.querySelector('#clear-filters');
  const equipmentDialog = document.querySelector('#equipment-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const sellDialog = document.querySelector('#sell-dialog');
  const toast = document.querySelector('#toast');
  const contactEmail = 'trade@alpmedtrade.com';

  const equipmentIcons = {
    MRI: '<svg viewBox="0 0 160 110" aria-hidden="true"><rect x="17" y="13" width="87" height="84" rx="8"/><circle cx="61" cy="55" r="26"/><circle cx="61" cy="55" r="15"/><path d="M104 45h34v44H93V73h45M28 97v8m65-8v8"/></svg>',
    CT: '<svg viewBox="0 0 160 110" aria-hidden="true"><rect x="17" y="13" width="87" height="84" rx="8"/><circle cx="61" cy="55" r="26"/><circle cx="61" cy="55" r="15"/><path d="M104 45h34v44H93V73h45M28 97v8m65-8v8"/></svg>',
    Ultrasound: '<svg viewBox="0 0 160 110" aria-hidden="true"><rect x="35" y="10" width="75" height="51" rx="3"/><path d="M43 18h59v35H43zM72 61v10m-20 0h40M50 72v28m45-28v28M46 100h54M114 22c14 8 13 20 3 27m-1-18 12 17"/><circle cx="50" cy="102" r="4"/><circle cx="96" cy="102" r="4"/></svg>',
    Endoscopy: '<svg viewBox="0 0 160 110" aria-hidden="true"><rect x="42" y="9" width="74" height="91" rx="3"/><path d="M50 18h58v30H50zM50 56h27v14H50zm35 0h23v14H85zM50 78h58M54 100v6m50-6v6M25 20c14 15 13 36 4 49-7 10-3 22 8 28"/></svg>',
    Anaesthesia: '<svg viewBox="0 0 160 110" aria-hidden="true"><rect x="30" y="10" width="87" height="92" rx="3"/><path d="M39 19h69v32H39zM39 59h27v17H39zm36 0h33v17H75zM39 84h69M45 102v5m58-5v5M125 35h18v46h-18zm5 8h8m-8 10h8"/></svg>',
    Laboratory: '<svg viewBox="0 0 160 110" aria-hidden="true"><rect x="23" y="17" width="112" height="78" rx="5"/><path d="M33 29h92v31H33zM36 70h23v14H36zm31 0h23v14H67zm31 0h23v14H98zM34 95v8m90-8v8M53 17V8h52v9"/></svg>'
  };

  function iconFor(category) {
    return equipmentIcons[category] || equipmentIcons.Laboratory;
  }

  function unique(values) {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }

  function populateFilters() {
    unique(inventory.map(item => item.category)).forEach(category => {
      categoryFilter.insertAdjacentHTML('beforeend', `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`);
    });
    unique(inventory.map(item => item.country)).forEach(country => {
      countryFilter.insertAdjacentHTML('beforeend', `<option value="${escapeHTML(country)}">${escapeHTML(country)}</option>`);
    });
  }

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function equipmentCard(item) {
    const statusClass = item.availability.toLowerCase() === 'reserved' ? 'reserved' : '';
    return `
      <article class="equipment-card">
        <div class="card-top">
          <span class="card-ref">${escapeHTML(item.id)}</span>
          <span class="availability ${statusClass}">${escapeHTML(item.availability)}</span>
        </div>
        <div class="equipment-visual">${iconFor(item.category)}</div>
        <span class="card-category">${escapeHTML(item.category)}</span>
        <h3>${escapeHTML(item.model)}</h3>
        <p class="card-manufacturer">${escapeHTML(item.manufacturer)}</p>
        <div class="card-meta">
          <div><span>Year</span><strong>${escapeHTML(item.year)}</strong></div>
          <div><span>Current location</span><strong>${escapeHTML(item.countryCode)} · ${escapeHTML(item.country)}</strong></div>
        </div>
        <button class="card-action" type="button" data-equipment-id="${escapeHTML(item.id)}">
          View details <span aria-hidden="true">↗</span>
        </button>
      </article>`;
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const country = countryFilter.value;
    const filtered = inventory.filter(item => {
      const haystack = `${item.id} ${item.category} ${item.manufacturer} ${item.model} ${item.country}`.toLowerCase();
      return (!query || haystack.includes(query)) &&
        (category === 'all' || item.category === category) &&
        (country === 'all' || item.country === country);
    });

    grid.innerHTML = filtered.map(equipmentCard).join('');
    resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'}`;
    emptyState.hidden = filtered.length > 0;
    grid.hidden = filtered.length === 0;
  }

  function openEquipment(item) {
    const statusClass = item.availability.toLowerCase() === 'reserved' ? 'reserved' : '';
    dialogContent.innerHTML = `
      <div class="dialog-hero">
        <div class="dialog-visual">${iconFor(item.category)}</div>
        <div class="dialog-title">
          <span class="availability ${statusClass}">${escapeHTML(item.availability)}</span>
          <h2>${escapeHTML(item.model)}</h2>
          <p>${escapeHTML(item.manufacturer)} · ${escapeHTML(item.id)}</p>
        </div>
      </div>
      <div class="dialog-body">
        <div class="dialog-stats">
          <div><span>Year</span><strong>${escapeHTML(item.year)}</strong></div>
          <div><span>Location</span><strong>${escapeHTML(item.country)}</strong></div>
          <div><span>Condition</span><strong>${escapeHTML(item.condition)}</strong></div>
        </div>
        <ul class="dialog-list">${item.configuration.map(value => `<li>${escapeHTML(value)}</li>`).join('')}</ul>
        <p><strong>Inspection:</strong> ${escapeHTML(item.inspection)}</p>
        <div class="dialog-note">${escapeHTML(item.note)}</div>
        <div class="dialog-actions">
          <button class="button button-primary" type="button" data-enquire-id="${escapeHTML(item.id)}">Enquire about this system</button>
          <button class="button button-secondary" type="button" data-copy-ref="${escapeHTML(item.id)}">Copy reference</button>
        </div>
      </div>`;
    equipmentDialog.showModal();
    document.body.classList.add('dialog-open');
  }

  function prepareMail(subject, fields) {
    const body = Object.entries(fields)
      .filter(([, value]) => String(value || '').trim())
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n');
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast('Your email application should open with the enquiry prepared.');
  }

  function formDataObject(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  populateFilters();
  render();

  const available = inventory.filter(item => item.availability === 'Available');
  document.querySelector('#available-count').textContent = available.length;
  document.querySelector('#country-count').textContent = `${unique(available.map(item => item.country)).length} countries`;
  document.querySelector('#current-year').textContent = new Date().getFullYear();

  [searchInput, categoryFilter, countryFilter].forEach(element => element.addEventListener('input', render));
  clearFilters.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = 'all';
    countryFilter.value = 'all';
    render();
    searchInput.focus();
  });

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-equipment-id]');
    if (!button) return;
    const item = inventory.find(entry => entry.id === button.dataset.equipmentId);
    if (item) openEquipment(item);
  });

  dialogContent.addEventListener('click', async event => {
    const enquireButton = event.target.closest('[data-enquire-id]');
    const copyButton = event.target.closest('[data-copy-ref]');
    if (enquireButton) {
      const item = inventory.find(entry => entry.id === enquireButton.dataset.enquireId);
      prepareMail(`Equipment enquiry — ${item.id} ${item.model}`, {
        'Reference': item.id,
        'Equipment': `${item.manufacturer} ${item.model}`,
        'Message': 'Please send the full specification, price and transaction details.'
      });
    }
    if (copyButton) {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copyRef);
        showToast(`Reference ${copyButton.dataset.copyRef} copied.`);
      } catch {
        showToast(`Reference: ${copyButton.dataset.copyRef}`);
      }
    }
  });

  document.querySelectorAll('.dialog-close').forEach(button => {
    button.addEventListener('click', () => {
      button.closest('dialog').close();
    });
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  });

  document.querySelectorAll('[data-open-form="sell"]').forEach(button => {
    button.addEventListener('click', () => {
      sellDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });

  document.querySelector('#request-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = formDataObject(event.currentTarget);
    prepareMail(`Equipment sourcing request — ${data.equipment}`, {
      'Equipment': data.equipment,
      'Preferred brand/model': data.model,
      'Destination': data.destination,
      'Name': data.name,
      'Email': data.email,
      'Details': data.details
    });
  });

  document.querySelector('#sell-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = formDataObject(event.currentTarget);
    prepareMail(`Equipment sale submission — ${data.equipment}`, {
      'Equipment': data.equipment,
      'Year': data.year,
      'Current country': data.country,
      'Name': data.name,
      'Email': data.email,
      'Condition / notes': data.details
    });
  });

  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('.primary-navigation');
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navigation.addEventListener('click', event => {
    if (event.target.matches('a')) {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
})();

(() => {
  'use strict';

  const CARD_SELECTOR = '[data-rich-preview]';
  const PREVIEW_TRIGGER_SELECTOR = '.service-media, .marketplace-asset-media, .service-body h3, .marketplace-asset-title h3';
  const HOVER_INTENT_MS = 620;
  const LEAVE_GRACE_MS = 260;
  const SCROLL_COOLDOWN_MS = 850;
  const portal = document.createElement('div');
  portal.className = 'rich-preview-portal';
  portal.innerHTML = '<button class="rich-preview-backdrop" type="button" aria-label="Close preview"></button><article class="rich-market-preview" role="dialog" aria-label="Listing preview"></article>';
  document.body.appendChild(portal);

  const backdrop = portal.querySelector('.rich-preview-backdrop');
  const preview = portal.querySelector('.rich-market-preview');
  const coarseQuery = window.matchMedia('(max-width: 760px), (hover: none), (pointer: coarse)');
  let activeCard = null;
  let hoverTimer = 0;
  let closeTimer = 0;
  let media = [];
  let mediaIndex = 0;
  let suppressFocusOpen = false;
  let hoverSuppressedUntil = 0;
  let hoverCandidateCard = null;
  let hoverCandidateTrigger = null;
  let cooldownTimer = 0;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const list = value => String(value || '').split('|').map(item => item.trim()).filter(Boolean);
  const money = value => value === '' || value == null ? '' : new Intl.NumberFormat('en-IN').format(Number(value));
  const isMobile = () => coarseQuery.matches;
  const clearTimers = () => {
    window.clearTimeout(hoverTimer);
    window.clearTimeout(closeTimer);
    hoverTimer = 0;
    closeTimer = 0;
  };

  function prepareCards(root = document) {
    root.querySelectorAll(CARD_SELECTOR).forEach(card => {
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      if (!card.hasAttribute('role')) card.setAttribute('role', 'link');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', `${card.dataset.previewTitle || 'Listing'}. Open details`);
    });
  }

  function avatarHTML(data) {
    if (data.previewAvatar) return `<span class="rich-preview-avatar"><img src="${esc(data.previewAvatar)}" alt="" loading="lazy"></span>`;
    return `<span class="rich-preview-avatar" aria-hidden="true">${esc((data.previewCreator || '?').charAt(0))}</span>`;
  }

  function creatorHTML(data) {
    const name = data.previewCreator || 'Creator';
    const nameMarkup = data.previewCreatorKey
      ? `<a href="#/creator/${esc(data.previewCreatorKey)}">${esc(name)}</a>`
      : `<b>${esc(name)}</b>`;
    const verified = data.previewVerified === 'true' ? '<span class="rich-preview-verified">✓ Verified</span>' : '';
    const trust = data.previewTrust ? `<span class="rich-preview-trust">Trust ${esc(data.previewTrust)}/100</span>` : '';
    return `${avatarHTML(data)}<span class="rich-preview-creator-copy"><span class="rich-preview-creator-line">${nameMarkup}</span>${verified || trust ? `<span class="rich-preview-signals">${verified}${trust}</span>` : ''}</span>`;
  }

  function mediaHTML(data) {
    const images = list(data.previewImages).map(src => ({type:'image', src}));
    media = data.previewVideo ? [...images, {type:'video', src:data.previewVideo}] : images;
    mediaIndex = 0;
    if (!media.length) return '';
    const arrows = media.length > 1
      ? '<button class="rich-preview-arrow prev" type="button" data-preview-prev aria-label="Previous media">‹</button><button class="rich-preview-arrow next" type="button" data-preview-next aria-label="Next media">›</button>'
      : '';
    const thumbs = media.length > 1
      ? `<div class="rich-preview-thumbs" aria-label="Preview media">${media.map((item,index) => `<button class="rich-preview-thumb ${item.type === 'video' ? 'video' : ''} ${index === 0 ? 'active' : ''}" type="button" data-preview-media-index="${index}" aria-label="Show ${item.type} ${index + 1}">${item.type === 'image' ? `<img src="${esc(item.src)}" alt="" loading="lazy">` : '▶'}</button>`).join('')}</div>`
      : '';
    return `<div class="rich-preview-gallery"><div class="rich-preview-stage" data-preview-stage>${arrows}</div>${thumbs}</div>`;
  }

  function statHTML(label, value) {
    return value === '' || value == null ? '' : `<span class="rich-preview-stat">${esc(label)} ${esc(value)}</span>`;
  }

  function bodyHTML(data) {
    const type = data.richPreview;
    const tags = list(data.previewTags);
    const stats = type === 'gig'
      ? [statHTML('★', data.previewRating), statHTML('Reviews', data.previewReviews), statHTML('Completed', data.previewOrders), data.previewResponse ? statHTML('Response', data.previewResponse) : '', data.previewDelivery ? statHTML('Delivery', `${data.previewDelivery}d`) : ''].join('')
      : [statHTML('★', data.previewRating), statHTML('Reviews', data.previewReviews), statHTML('Sales', data.previewSales)].join('');
    let details = '';
    if (type === 'gig' && data.previewPackages) {
      try {
        const packages = JSON.parse(data.previewPackages);
        details = `<div class="rich-preview-packages" aria-label="Packages">${packages.map(item => `<span class="rich-preview-package"><b>${esc(item.name)} · ₹${money(item.price)}</b><small>${esc(item.days)}d · ${esc(item.revisions)} revision${Number(item.revisions) === 1 ? '' : 's'}</small></span>`).join('')}</div>`;
      } catch (_) { details = ''; }
    }
    if (type === 'asset') {
      details = `<div class="rich-preview-specs">${data.previewEngine ? `<span class="rich-preview-spec">Engine · ${esc(data.previewEngine)}</span>` : ''}${data.previewFormats ? `<span class="rich-preview-spec">Formats · ${esc(data.previewFormats)}</span>` : ''}${data.previewLicense ? `<span class="rich-preview-spec">${esc(data.previewLicense)} licence</span>` : ''}</div>`;
    }
    return `<div class="rich-preview-body">
      ${data.previewCategory ? `<p class="rich-preview-kicker">${esc(type === 'gig' ? 'Gig' : 'Asset')} · ${esc(data.previewCategory)}</p>` : ''}
      <h2>${esc(data.previewTitle)}</h2>
      ${data.previewDescription ? `<p class="rich-preview-description">${esc(data.previewDescription)}</p>` : ''}
      ${tags.length ? `<div class="rich-preview-tags">${tags.map(tag => `<span>${esc(tag)}</span>`).join('')}</div>` : ''}
      ${stats ? `<div class="rich-preview-stats">${stats}</div>` : ''}
      ${details}
      <div class="rich-preview-foot"><span class="rich-preview-price"><small>${type === 'gig' ? 'Packages from' : 'Price'}</small><strong>₹${money(data.previewPrice)}</strong></span><a class="rich-preview-cta" href="${esc(data.previewRoute)}">View ${type === 'gig' ? 'Gig' : 'Asset'} →</a></div>
    </div>`;
  }

  function setMedia(index) {
    if (!media.length) return;
    mediaIndex = (index + media.length) % media.length;
    const stage = preview.querySelector('[data-preview-stage]');
    if (!stage) return;
    const oldVideo = stage.querySelector('video');
    if (oldVideo) oldVideo.pause();
    stage.querySelectorAll('img,video').forEach(node => node.remove());
    const item = media[mediaIndex];
    const node = document.createElement(item.type === 'video' ? 'video' : 'img');
    node.src = item.src;
    if (item.type === 'video') {
      node.controls = true;
      node.muted = true;
      node.playsInline = true;
      node.preload = 'metadata';
      node.addEventListener('loadeddata', () => node.classList.add('is-loaded'), {once:true});
    } else {
      node.alt = activeCard?.dataset.previewTitle ? `${activeCard.dataset.previewTitle} preview` : 'Listing preview';
      node.decoding = 'async';
      node.addEventListener('load', () => node.classList.add('is-loaded'), {once:true});
      if (node.complete) node.classList.add('is-loaded');
    }
    stage.prepend(node);
    preview.querySelectorAll('[data-preview-media-index]').forEach(button => {
      button.classList.toggle('active', Number(button.dataset.previewMediaIndex) === mediaIndex);
    });
  }

  function positionPreview(card) {
    if (isMobile()) return;
    const gap = 14;
    const margin = 12;
    const cardRect = card.getBoundingClientRect();
    const popupRect = preview.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const rightSpace = vw - cardRect.right;
    const leftSpace = cardRect.left;
    const belowSpace = vh - cardRect.bottom;
    const aboveSpace = cardRect.top;
    let left;
    let top;

    if (rightSpace >= popupRect.width + gap) {
      left = cardRect.right + gap;
      top = cardRect.top;
    } else if (leftSpace >= popupRect.width + gap) {
      left = cardRect.left - popupRect.width - gap;
      top = cardRect.top;
    } else if (belowSpace >= popupRect.height + gap || belowSpace >= aboveSpace) {
      left = cardRect.left + (cardRect.width - popupRect.width) / 2;
      top = cardRect.bottom + gap;
    } else {
      left = cardRect.left + (cardRect.width - popupRect.width) / 2;
      top = cardRect.top - popupRect.height - gap;
    }

    preview.style.left = `${Math.max(margin, Math.min(left, vw - popupRect.width - margin))}px`;
    preview.style.top = `${Math.max(margin, Math.min(top, vh - popupRect.height - margin))}px`;
  }

  function openPreview(card, focusClose = false) {
    clearTimers();
    if (!card || !document.contains(card)) return;
    if (activeCard && activeCard !== card) activeCard.setAttribute('aria-expanded', 'false');
    activeCard = card;
    card.setAttribute('aria-expanded', 'true');
    const data = card.dataset;
    preview.innerHTML = `<div class="rich-preview-head"><div class="rich-preview-creator">${creatorHTML(data)}</div><button class="rich-preview-close" type="button" aria-label="Close preview">×</button></div>${mediaHTML(data)}${bodyHTML(data)}`;
    preview.setAttribute('aria-label', `${data.previewTitle || 'Listing'} preview`);
    preview.setAttribute('aria-modal', isMobile() ? 'true' : 'false');
    preview.style.display = 'block';
    preview.style.visibility = 'hidden';
    preview.style.left = '0px';
    preview.style.top = '0px';
    portal.classList.toggle('mobile-open', isMobile());
    document.body.classList.toggle('rich-preview-lock', isMobile());
    setMedia(0);
    requestAnimationFrame(() => {
      positionPreview(card);
      preview.style.visibility = 'visible';
      requestAnimationFrame(() => preview.classList.add('is-open'));
      if (focusClose && isMobile()) preview.querySelector('.rich-preview-close')?.focus({preventScroll:true});
    });
  }

  function closePreview(restoreFocus = false) {
    clearTimers();
    const card = activeCard;
    activeCard = null;
    card?.setAttribute('aria-expanded', 'false');
    preview.querySelector('video')?.pause();
    preview.classList.remove('is-open');
    portal.classList.remove('mobile-open');
    document.body.classList.remove('rich-preview-lock');
    window.setTimeout(() => {
      if (!activeCard) {
        preview.style.display = 'none';
        preview.innerHTML = '';
        media = [];
      }
    }, 170);
    if (restoreFocus && card && document.contains(card)) {
      suppressFocusOpen = true;
      card.focus({preventScroll:true});
      window.setTimeout(() => { suppressFocusOpen = false; }, 0);
    }
  }

  function triggerIsStillHovered(trigger) {
    return !!(trigger && document.contains(trigger) && trigger.matches(':hover'));
  }

  function scheduleOpen(card, trigger, delay = HOVER_INTENT_MS) {
    window.clearTimeout(closeTimer);
    if (!card || !trigger || activeCard === card) return;
    if (hoverCandidateCard === card && hoverCandidateTrigger === trigger && hoverTimer) return;
    window.clearTimeout(hoverTimer);
    hoverCandidateCard = card;
    hoverCandidateTrigger = trigger;
    const cooldownRemaining = Math.max(0, hoverSuppressedUntil - Date.now());
    const wait = Math.max(delay, cooldownRemaining + HOVER_INTENT_MS);
    hoverTimer = window.setTimeout(() => {
      hoverTimer = 0;
      if (hoverCandidateCard !== card || hoverCandidateTrigger !== trigger || !triggerIsStillHovered(trigger)) return;
      if (Date.now() < hoverSuppressedUntil) {
        scheduleOpen(card, trigger, hoverSuppressedUntil - Date.now() + HOVER_INTENT_MS);
        return;
      }
      openPreview(card);
    }, wait);
  }

  function scheduleClose() {
    window.clearTimeout(hoverTimer);
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => closePreview(), LEAVE_GRACE_MS);
  }

  function suppressPreviewWhileBrowsing(event) {
    if (isMobile()) return;
    if (event?.target && preview.contains(event.target)) return;
    hoverSuppressedUntil = Date.now() + SCROLL_COOLDOWN_MS;
    window.clearTimeout(hoverTimer);
    hoverTimer = 0;
    window.clearTimeout(cooldownTimer);
    if (activeCard) closePreview();
    cooldownTimer = window.setTimeout(() => {
      const trigger = hoverCandidateTrigger;
      const card = hoverCandidateCard;
      if (card && triggerIsStillHovered(trigger)) scheduleOpen(card, trigger);
    }, SCROLL_COOLDOWN_MS + 20);
  }

  document.addEventListener('pointerover', event => {
    if (isMobile()) return;
    const trigger = event.target.closest?.(PREVIEW_TRIGGER_SELECTOR);
    if (!trigger || trigger.contains(event.relatedTarget)) return;
    const card = trigger.closest(CARD_SELECTOR);
    if (card) scheduleOpen(card, trigger);
  });
  document.addEventListener('pointerout', event => {
    if (isMobile()) return;
    const trigger = event.target.closest?.(PREVIEW_TRIGGER_SELECTOR);
    if (trigger && !trigger.contains(event.relatedTarget)) {
      if (hoverCandidateTrigger === trigger) {
        hoverCandidateCard = null;
        hoverCandidateTrigger = null;
        window.clearTimeout(hoverTimer);
        hoverTimer = 0;
      }
      if (activeCard === trigger.closest(CARD_SELECTOR)) scheduleClose();
    }
  });
  preview.addEventListener('pointerenter', () => window.clearTimeout(closeTimer));
  preview.addEventListener('pointerleave', scheduleClose);

  document.addEventListener('focusin', event => {
    if (suppressFocusOpen) return;
    const card = event.target.closest?.(CARD_SELECTOR);
    if (card) openPreview(card);
  });
  document.addEventListener('focusout', event => {
    const card = event.target.closest?.(CARD_SELECTOR);
    if (card && !card.contains(event.relatedTarget) && !preview.contains(event.relatedTarget)) scheduleClose();
  });

  document.addEventListener('click', event => {
    const card = event.target.closest?.(CARD_SELECTOR);
    if (!card || !isMobile()) return;
    if (event.target.closest('a,button,input,select,textarea')) {
      closePreview();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (activeCard !== card) openPreview(card, true);
  }, true);

  preview.addEventListener('click', event => {
    if (event.target.closest('.rich-preview-close')) return closePreview(true);
    if (event.target.closest('[data-preview-prev]')) return setMedia(mediaIndex - 1);
    if (event.target.closest('[data-preview-next]')) return setMedia(mediaIndex + 1);
    const thumb = event.target.closest('[data-preview-media-index]');
    if (thumb) setMedia(Number(thumb.dataset.previewMediaIndex));
  });
  preview.addEventListener('pointerover', event => {
    if (isMobile()) return;
    const thumb = event.target.closest('[data-preview-media-index]');
    if (thumb && !thumb.contains(event.relatedTarget)) setMedia(Number(thumb.dataset.previewMediaIndex));
  });
  backdrop.addEventListener('click', () => closePreview(true));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeCard) {
      event.preventDefault();
      closePreview(true);
      return;
    }
    const card = event.target.closest?.(CARD_SELECTOR);
    if (event.key === 'Enter' && card && event.target === card) {
      event.preventDefault();
      if (card.dataset.previewRoute) location.hash = card.dataset.previewRoute.slice(1);
    }
  });

  window.addEventListener('hashchange', () => closePreview());
  window.addEventListener('resize', () => activeCard && positionPreview(activeCard));
  window.addEventListener('wheel', suppressPreviewWhileBrowsing, {passive:true});
  document.addEventListener('scroll', suppressPreviewWhileBrowsing, {passive:true,capture:true});
  coarseQuery.addEventListener?.('change', () => activeCard && openPreview(activeCard));

  const observer = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      if (node.matches?.(CARD_SELECTOR)) prepareCards(node.parentElement || document);
      else if (node.querySelector?.(CARD_SELECTOR)) prepareCards(node);
    }));
  });
  observer.observe(document.getElementById('app') || document.body, {childList:true, subtree:true});
  prepareCards();
})();

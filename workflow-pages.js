(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => new Intl.NumberFormat('en-IN').format(Number(value || 0));
  const slug = value => String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const routePart = value => decodeURIComponent(String(value || '').split('?')[0]);
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const now = () => new Date().toLocaleString('en-IN', {day:'numeric', month:'short', hour:'numeric', minute:'2-digit'});

  const KEYS = {
    cart:'nexora_cart_v2', wishlist:'nexora_wishlist_v1', tickets:'nexora_tickets_v1',
    notices:'nexora_notices_v1', drafts:'nexora_project_drafts_v1', listings:'nexora_listings_v1',
    brief:'nexora_brief_v1', messages:'nexora_messages_v1', registrations:'nexora_registrations_v1',
    tutorial:'nexora_tutorial_progress_v1', ads:'nexora_ads_v1'
  };

  const catalog = {
    'pixel-forest': ['Pixel Forest Environment','2D Environments',699],
    'indie-ui-kit': ['Indie Game UI Kit','UI/UX',849],
    'sci-fi-mech': ['Sci-Fi Mech Props','3D Props',1599],
    'soundscape-vol1': ['Synthwave Soundscape Vol. 1','Music & Audio',499],
    'mobile-icons': ['Mobile Game Icon Pack','UI/UX',349],
    'monsoon-village': ['Monsoon Village Props','Environment Props',999],
    'rpg-inventory-system': ['Modular RPG Inventory System','Code & Systems',1899],
    'indian-city-kit': ['Indian City Street Kit','3D Environments',2299],
    'mocap-combat': ['Indie Combat Mocap Library','Animation & Mocap',1699],
    'adaptive-music': ['Adaptive Music Toolkit','Music & Audio',1299],
    'footstep-sfx': ['900+ Footsteps & Foley SFX','Sound Effects',799],
    'toon-water-shader': ['Stylized Water Shader Collection','Shaders',999],
    'dialogue-plugin': ['Branching Dialogue Editor','Plugins & Tools',1499],
    'quest-template': ['Open-World Quest Template','Templates',1999],
    'village-npc-pack': ['Village NPC Character Pack','Characters',1799],
    'lowpoly-vehicles': ['Low-Poly Vehicle Mega Pack','3D Props',1199],
    'localization-sheet': ['Game Localization Starter System','Localization',399],
    'accessibility-icons': ['Accessible Game UI Icon Set','UI/UX',549]
  };

  const projects = {
    aether:['Aether — A Hand-Drawn 2D Adventure','Ananya Das'],
    synthwave:['Synthwave Mumbai — Original Soundtrack','Rohan Mehta'],
    'hampi-vr':['VR Heritage Walk — Hampi in 3D','Vikram Rao'],
    'solar-sentinel':['Solar Sentinel — IoT Weather Station','Karthik Iyer'],
    'iron-monsoon':['Iron Monsoon — Co-op Survival','Priya Sharma'],
    'moonlit-auto':['Moonlit Auto — Night-Drive RPG','Rohan Mehta'],
    'tiny-tactics':['Tiny Tactics — Pocket Strategy','Karthik Iyer'],
    'hampi-builders':['Hampi Builders — Historical Sandbox','Vikram Rao']
  };

  const services = {
    'unity-game-development':['Unity Game Development — 2D & 3D','Ananya Das',1500],
    '3d-character-modeling':['3D Character Modeling & Rigging','Vikram Rao',2500],
    'trailer-editing':['Game Trailer Editing & Sound Design','Rohan Mehta',2000],
    'vr-prototype':['Interactive VR Prototype','Vikram Rao',4500],
    'unreal-blueprint-systems':['Unreal Blueprint Systems & Prototypes','Karthik Iyer',2200],
    'pixel-art-sprites':['Pixel Art Characters & Tilesets','Meera Nair',1200],
    'game-ui-ux':['Game UI/UX, HUDs & Menus','Priya Sharma',1800],
    'game-qa-testing':['Game QA, Playtesting & Bug Reports','Ananya Das',900],
    'indie-game-marketing':['Indie Game Launch & Marketing Kit','Rohan Mehta',2600],
    'procedural-vfx':['Stylized VFX & Shaders','Vikram Rao',3200],
    'narrative-design':['Game Narrative, Quests & Dialogue','Meera Nair',1400],
    'multiplayer-netcode-review':['Multiplayer Netcode Review','Karthik Iyer',4800]
  };

  const hubDetails = {
    jam: [
      ['monsoon-2026','Monsoon Game Jam 2026','Rebirth','Aug 24, 2026','214 builders','Ship a playable game around “Rebirth”, meet a team, use the starter kit, and enter the public showcase.'],
      ['one-button-sprint','48-Hour Indie Sprint','One Button','Sep 6–8, 2026','Registration open','Build one complete game loop around a single input over a focused weekend.'],
      ['accessible-play','Accessible Play Challenge','Access for all','Sep 18, 2026','86 builders','Design for readable UI, remapping, subtitles, contrast, and inclusive play.'],
      ['student-showcase','Student Game Showcase','Student work','Oct 4, 2026','College teams','Publish a student build, collect structured feedback, and meet verified studios.']
    ],
    job: [
      ['unreal-gameplay','Unreal Gameplay Programmer','Remote · Contract','₹65K–₹95K / month','Build combat and interaction systems for a funded vertical slice.'],
      ['technical-artist','Technical Artist — Unity','Bengaluru · Full-time','₹8L–₹12L / year','Own shaders, profiling, and production-pipeline tooling.'],
      ['pixel-artist-rpg','Pixel Artist for Narrative RPG','Remote · Freelance','₹35K fixed scope','Create characters, portraits, and two environment tilesets in six weeks.'],
      ['jam-sound-designer','Sound Designer Wanted','Jam team · Weekend','Credit + prize share','Join a three-person Monsoon Jam team with a working prototype.']
    ],
    'funding-tool': [
      ['goal-planner','Funding Goal Planner','Budget a goal that includes production, fulfilment, contingency, and the 8.5% Nexora platform fee.'],
      ['proof-checklist','Campaign Proof Checklist','Review the playable demo, team, ownership, timeline, and risk evidence backers need.'],
      ['reward-architect','Reward Architect','Design clear digital, physical, and experience tiers with realistic fulfilment.'],
      ['launch-calendar','Launch Calendar','Plan prelaunch, day one, weekly updates, and campaign follow-through.']
    ],
    devlog: [
      ['aether-controller','Aether controller & localization pass','Ananya Das','Controller remapping, Assamese dialogue review, and a new accessibility menu.'],
      ['coop-reconciliation','Co-op reconciliation bug solved','Karthik Iyer','A deep dive into the rounding error behind two weeks of netcode desync.'],
      ['monsoon-palette','Monsoon palette exploration','Meera Nair','Wet-surface values, roof shading, and a compact palette breakdown.'],
      ['midnight-radio','Adaptive midnight radio stems','Rohan Mehta','How the soundtrack moves between exploration and passenger dialogue.']
    ],
    event: [
      ['campaign-budgeting','How to budget an indie game campaign','Aug 18 · 7:00 PM IST','Online · Free','A practical breakdown of scope, contingencies, reward cost, and funding goals.'],
      ['monsoon-submission','Monsoon Game Jam submission night','Aug 24 · 9:00 PM IST','Online · Public stream','Final build checks, submission support, and the creator showcase.'],
      ['portfolio-review','Game art portfolio review','Aug 29','Bengaluru · 40 seats','Ten-minute review slots with verified art leads and indie founders.'],
      ['indie-sprint-kickoff','48-Hour Indie Sprint kickoff','Sep 6 · 6:00 PM IST','Online · Free','Theme reveal, team matching, and starter-resource walkthrough.']
    ],
    tutorial: [
      ['credible-campaign','Launch a credible funding campaign','6 lessons · Beginner','Goal, proof, rewards, risks, and a 30-day communication plan.'],
      ['unreal-blueprints','Production-ready Unreal Blueprints','9 lessons · Intermediate','Architecture, interfaces, debugging, and performance habits.'],
      ['sell-game-asset','Sell your first game asset','5 lessons · Beginner','Packaging, licences, previews, pricing, updates, and support.'],
      ['freelance-scope','Freelance without scope chaos','7 lessons · All levels','Discovery, packages, milestones, revisions, and handover.']
    ],
    leaderboard: [
      ['funding-velocity','Funding velocity','Campaigns gaining verified support fastest this week.'],
      ['creator-delivery','Creator delivery','Creators ranked by completed orders, ratings, and response quality.'],
      ['marketplace-sales','Marketplace sales','Fixed-price assets ranked by rolling 30-day sales and buyer ratings.'],
      ['community-mvps','Community MVPs','Helpful contributors ranked by accepted answers and healthy participation.']
    ],
    reward: [
      ['aether-player-pack','Aether early-player pack','Ready to claim','Digital game key · closed beta access'],
      ['hampi-founder-pack','Hampi Builders founder pack','Survey needed','Name credit · language preference'],
      ['moonlit-soundtrack','Moonlit Auto soundtrack bundle','In production','Game key · soundtrack · artbook'],
      ['iron-monsoon-world-builder','Iron Monsoon world builder','Saved tier','Design call · named survivor']
    ]
  };

  const editorial = {
    'scope-prototype':['How to scope a game prototype without killing the fun','Field Notes · 8 min','A prototype proves the heart of a game. Start with one loop, one feeling, and one question your build must answer.'],
    'funding-proof':['What backers need before they believe a roadmap','Funding · 6 min','Show the current build, explain what the funding unlocks, disclose risk, and make the next milestone measurable.'],
    'asset-packaging':['Package a game asset buyers can trust','Marketplace · 7 min','Good screenshots get attention. Clear files, licences, version support, and documentation earn repeat buyers.'],
    'community-feedback':['Turn community feedback into useful decisions','Community · 5 min','Ask focused questions, separate preference from defects, and close the loop by explaining what changed.']
  };

  const pressReleases = {
    'connected-platform':['Nexora connects the complete creator journey','Aug 2026','The platform brings discovery, funding, services, assets, communities, and account workflows into one coherent creator-first product.'],
    'trust-signals':['Nexora expands visible trust signals','Jul 2026','Identity context, delivery history, risk notes, and reporting routes become easier to review before transacting.'],
    'game-creator-hub':['Nexora opens its game creator hub','Jun 2026','New game-focused discovery, jams, tutorials, talent, and marketplace sections support teams from prototype to launch.']
  };

  const creatorStories = {
    'prototype-to-playable':['From prototype to playable','Ananya Das','A small team turns one hand-painted room into a vertical slice people can understand, play, and support.'],
    'solo-creator-workflow':['The solo creator workflow','Meera Nair','A practical rhythm for balancing production, audience building, client work, and rest.'],
    'right-collaborator':['Finding the right collaborator','Karthik Iyer','Why a clear brief, paid test, and compatible working style matter more than a huge follower count.'],
    'hardware-monsoon':['Hardware that survives a monsoon','Karthik Iyer','Field testing, repairable parts, and open documentation turn an idea into trustworthy hardware.']
  };

  const careerRoles = {
    'product-designer':['Product Designer','Remote / India','Shape creator, funding, marketplace, and trust workflows from research through polished interaction.'],
    'frontend-engineer':['Frontend Engineer','Remote / India','Build accessible, fast product surfaces and a maintainable design system for creator workflows.'],
    'trust-operations':['Trust & Safety Operations','Dehradun / Hybrid','Design clear case handling, evidence review, escalation, and user communication.']
  };

  const supportTopics = {
    account:['Account help','Sign-in, profile, KYC, security, and recovery guidance.'],
    marketplace:['Marketplace help','Asset compatibility, licences, carts, orders, downloads, and seller support.'],
    projects:['Project & funding help','Campaign drafts, backing, rewards, updates, and creator payouts.'],
    safety:['Safety help','Scams, impersonation, harassment, unsafe content, and urgent reporting routes.']
  };

  const routes = new Set(['cart','checkout','order','back','start-project','asset-manager','brief-builder','wishlist','messages','forgot-password','support-tickets','support-topic','notifications','payouts','withdraw','ads','drop','jam','job','funding-tool','devlog','event','tutorial','leaderboard','reward','blog-post','press-release','creator-story','career-role','discussion-new','creator-gigs']);

  function notify(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function footer() {
    return `<footer class="wf-footer"><div><b>NEXORA</b><span>Creator workflows · interactive prototype</span></div><nav><a href="#/support">Help</a><a href="#/trust-safety">Safety</a><a href="#/terms">Terms</a><a href="#/privacy">Privacy</a></nav></footer>`;
  }

  function shell(title, subtitle, eyebrow, body, options = {}) {
    const step = options.step ? `<div class="wf-stepper">${options.step.map((x,i)=>`<span class="${i < options.active ? 'done' : i === options.active ? 'active' : ''}"><i>${i < options.active ? '✓' : i+1}</i>${esc(x)}</span>`).join('')}</div>` : '';
    return `<div class="page-shell wf-page wf-${slug(eyebrow)}">
      <section class="wf-hero"><div><a class="wf-back" href="${options.back || '#/'}">← ${esc(options.backLabel || 'Back')}</a><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div><div class="wf-hero-mark"><span>NX</span><small>WORKFLOW</small></div></section>
      ${step}<main class="wf-main">${body}</main>${footer()}</div>`;
  }

  function empty(title, copy, href, label) {
    return `<section class="wf-empty wf-card"><span>◇</span><h2>${esc(title)}</h2><p>${esc(copy)}</p><a class="btn btn-primary" href="${href}">${esc(label)} →</a></section>`;
  }

  function addCart(id) {
    if (!catalog[id]) return false;
    const cart = read(KEYS.cart, []);
    const existing = cart.find(x => x.id === id);
    if (existing) existing.qty = Math.min(9, (existing.qty || 1) + 1);
    else cart.push({id, qty:1});
    write(KEYS.cart, cart);
    updateHeaderCounts();
    return true;
  }

  function addWishlist(id) {
    if (!catalog[id]) return false;
    const items = read(KEYS.wishlist, []);
    if (!items.includes(id)) items.push(id);
    write(KEYS.wishlist, items);
    return true;
  }

  function cartTotals() {
    const lines = read(KEYS.cart, []).filter(x => catalog[x.id]);
    const subtotal = lines.reduce((sum, x) => sum + catalog[x.id][2] * (x.qty || 1), 0);
    const gst = Math.round(subtotal * 0.18);
    return {lines, subtotal, gst, total:subtotal + gst};
  }

  function cartView() {
    const {lines, subtotal, gst, total} = cartTotals();
    const body = !lines.length ? empty('Your cart is ready for a first pick','Add a fixed-price asset from the marketplace. Your cart stays in this browser.','#/marketplace','Browse marketplace') : `<div class="wf-two-col"><section class="wf-stack"><div class="wf-section-head"><div><p class="eyebrow">${lines.length} ITEM${lines.length===1?'':'S'}</p><h2>Ready to review</h2></div><button class="wf-text-btn" data-clear-cart>Clear cart</button></div>${lines.map(line=>{const item=catalog[line.id];return `<article class="wf-card wf-cart-line"><div class="wf-thumb"><span>${item[0].slice(0,2).toUpperCase()}</span></div><div><small>${esc(item[1])}</small><h3>${esc(item[0])}</h3><a href="#/asset/${esc(line.id)}">View listing</a></div><label>Qty<select data-cart-qty="${esc(line.id)}">${[1,2,3,4,5].map(n=>`<option ${n===(line.qty||1)?'selected':''}>${n}</option>`).join('')}</select></label><b>₹${money(item[2]*(line.qty||1))}</b><button class="wf-remove" data-cart-remove="${esc(line.id)}" aria-label="Remove">×</button></article>`}).join('')}</section><aside class="wf-card wf-summary"><p class="eyebrow">ORDER SUMMARY</p><h2>₹${money(total)}</h2><dl><div><dt>Assets</dt><dd>₹${money(subtotal)}</dd></div><div><dt>GST (18%)</dt><dd>₹${money(gst)}</dd></div><div><dt>Delivery</dt><dd>Instant after payment</dd></div></dl><label>Promo code<div class="wf-inline"><input placeholder="NEXORA10"><button data-apply-code>Apply</button></div></label><a class="btn btn-primary" href="#/checkout">Secure checkout →</a><p class="wf-note">Fixed-price purchases only. No auctions or cash-convertible tokens.</p></aside></div>`;
    return shell('Your marketplace cart','Review licences, quantities, taxes, and the final payable amount before checkout.','Cart',body,{back:'#/marketplace',backLabel:'Marketplace'});
  }

  function checkoutView(mode) {
    const totals = cartTotals();
    if (!totals.lines.length && mode !== 'success') return shell('Checkout','Add something to your cart before opening checkout.','Checkout',empty('Nothing to check out','Your cart is empty.','#/marketplace','Browse assets'),{back:'#/cart',backLabel:'Cart'});
    if (mode === 'success') return shell('Purchase confirmed','Your prototype order is saved locally and ready in the account vault.','Order complete',`<section class="wf-success wf-card"><span>✓</span><p class="eyebrow">ORDER NX-${String(Date.now()).slice(-6)}</p><h2>Your files are ready</h2><p>A production build would verify payment, issue an invoice, grant licence entitlements, and secure the download.</p><div><a class="btn btn-primary" href="#/account">Open vault</a><a class="btn btn-secondary" href="#/marketplace">Keep browsing</a></div></section>`,{back:'#/marketplace',backLabel:'Marketplace'});
    if (mode === 'payment') return shell('Choose payment method','No real charge will be made in this prototype.','Checkout',`<form class="wf-two-col" data-checkout-payment><section class="wf-card wf-form-card"><p class="eyebrow">PAYMENT</p><h2>How would you like to pay?</h2><label class="wf-choice"><input type="radio" name="pay" value="upi" checked><span><b>UPI</b><small>Enter any demo UPI ID</small></span></label><div class="wf-reveal"><label>UPI ID<input required name="upi" placeholder="name@bank" pattern=".+@.+"></label></div><label class="wf-choice"><input type="radio" name="pay" value="card"><span><b>Card</b><small>Prototype card form</small></span></label><label class="wf-check"><input required type="checkbox"> I reviewed each asset licence and the final amount.</label><button class="btn btn-primary" type="submit">Confirm demo payment · ₹${money(totals.total)}</button></section><aside class="wf-card wf-summary"><p class="eyebrow">TOTAL</p><h2>₹${money(totals.total)}</h2><p>${totals.lines.length} fixed-price asset${totals.lines.length===1?'':'s'} · GST included</p><a href="#/cart">Edit cart</a></aside></form>`,{back:'#/checkout',backLabel:'Billing',step:['Details','Review','Payment'],active:2});
    return shell('Billing & order review','Add invoice information, then verify every listing and licence.','Checkout',`<form class="wf-two-col" data-checkout-details><section class="wf-card wf-form-card"><p class="eyebrow">BILLING DETAILS</p><h2>Who is buying?</h2><div class="wf-form-grid"><label>Full name<input required name="name" placeholder="Your legal name"></label><label>Email<input required type="email" name="email" placeholder="you@example.com"></label><label class="wide">Billing address<textarea required rows="3" name="address" placeholder="Street, city, state, PIN"></textarea></label><label>State<select name="state"><option>Karnataka</option><option>Maharashtra</option><option>Delhi</option><option>Assam</option><option>Other</option></select></label><label>GSTIN (optional)<input name="gstin" placeholder="Business purchases"></label></div><label class="wf-check"><input required type="checkbox"> Invoice information is accurate.</label><button class="btn btn-primary" type="submit">Continue to payment →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">REVIEW</p>${totals.lines.map(x=>`<div class="wf-mini-line"><span>${esc(catalog[x.id][0])} × ${x.qty||1}</span><b>₹${money(catalog[x.id][2]*(x.qty||1))}</b></div>`).join('')}<dl><div><dt>Subtotal</dt><dd>₹${money(totals.subtotal)}</dd></div><div><dt>GST</dt><dd>₹${money(totals.gst)}</dd></div></dl><h2>₹${money(totals.total)}</h2></aside></form>`,{back:'#/cart',backLabel:'Cart',step:['Details','Review','Payment'],active:0});
  }

  function orderView(serviceKey, stage) {
    const service = services[serviceKey];
    if (!service) return shell('Service not found','This order link does not match a published service.','Freelance order',empty('Unknown service','Return to the freelance marketplace to choose a live gig.','#/freelancers','Browse gigs'),{back:'#/freelancers',backLabel:'Freelance'});
    if (stage === 'success') return shell('Order request created','The creator can now review your brief before a production payment is authorized.','Freelance order',`<section class="wf-success wf-card"><span>✓</span><p class="eyebrow">REQUEST NXG-${String(Date.now()).slice(-5)}</p><h2>Brief sent to ${esc(service[1])}</h2><p>Your scope, files, schedule, and budget are saved in this browser. A real build would open the order thread and payment authorization after creator acceptance.</p><div><a class="btn btn-primary" href="#/messages">Open messages</a><a class="btn btn-secondary" href="#/freelancers">Browse more gigs</a></div></section>`,{back:'#/freelancers',backLabel:'Freelance'});
    const review = stage === 'review';
    const body = review ? `<div class="wf-two-col"><section class="wf-card wf-form-card"><p class="eyebrow">REVIEW BRIEF</p><h2>${esc(service[0])}</h2><dl class="wf-review-list"><div><dt>Creator</dt><dd>${esc(service[1])}</dd></div><div><dt>Scope</dt><dd>${esc(read('nexora_order_draft',{}).scope||'Prototype implementation and documented handover')}</dd></div><div><dt>Target date</dt><dd>${esc(read('nexora_order_draft',{}).date||'To be confirmed')}</dd></div><div><dt>Starting package</dt><dd>₹${money(service[2])}</dd></div></dl><label class="wf-check"><input required type="checkbox" form="orderReview"> I understand the creator must accept scope before work begins.</label><form id="orderReview" data-order-submit><input type="hidden" name="service" value="${esc(serviceKey)}"><button class="btn btn-primary">Send order request →</button></form></section><aside class="wf-card wf-summary"><p class="eyebrow">PAYMENT TIMING</p><h2>₹${money(service[2])}</h2><p>No charge is made now. Production should authorize payment only after scope acceptance and show dispute terms before confirmation.</p><a href="#/order/${esc(serviceKey)}/requirements">Edit requirements</a></aside></div>` : `<form class="wf-two-col" data-order-requirements><section class="wf-card wf-form-card"><p class="eyebrow">PROJECT REQUIREMENTS</p><h2>Give ${esc(service[1].split(' ')[0])} a clean starting point</h2><div class="wf-form-grid"><label class="wide">What do you need?<textarea required rows="6" name="scope" placeholder="Describe the outcome, platform, style, current state, and what is out of scope."></textarea></label><label>Target date<input required type="date" name="date"></label><label>Budget range<select name="budget"><option>Starting package · ₹${money(service[2])}</option><option>₹${money(service[2]*2)}–₹${money(service[2]*3)}</option><option>Custom quote</option></select></label><label class="wide">Reference links<input name="links" placeholder="Drive, Figma, build, or moodboard links"></label><label class="wide">Files<div class="wf-file-drop"><input type="file" multiple><span>Attach a brief, build, screenshots, or source sample</span></div></label></div><label class="wf-check"><input required type="checkbox"> I have removed passwords, keys, and private credentials.</label><button class="btn btn-primary">Review requirements →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">ORDERING SAFELY</p><ol><li>Keep the scope specific.</li><li>Agree on deliverables and revisions.</li><li>Use platform messages.</li><li>Review delivery before approval.</li></ol><a href="#/service/${esc(serviceKey)}">Back to gig</a></aside></form>`;
    return shell(review?'Review your request':'Send clear requirements',`Ordering ${service[0]} from ${service[1]}.`,'Freelance order',body,{back:`#/service/${serviceKey}`,backLabel:'Gig',step:['Requirements','Review','Creator acceptance'],active:review?1:0});
  }

  function backingView(projectKey, stage) {
    const project = projects[projectKey];
    if (!project) return shell('Project not found','This backing link does not match a published campaign.','Project backing',empty('Unknown campaign','Choose a current project to support.','#/projects','Browse projects'),{back:'#/projects',backLabel:'Projects'});
    if (stage === 'success') return shell('Thank you for backing','Your prototype pledge and reward selection are saved locally.','Backing complete',`<section class="wf-success wf-card"><span>♥</span><p class="eyebrow">PLEDGE NXB-${String(Date.now()).slice(-5)}</p><h2>You backed ${esc(project[0])}</h2><p>A real payment provider would now confirm the charge, receipt, cancellation terms, and reward entitlement.</p><div><a class="btn btn-primary" href="#/rewards">Track rewards</a><a class="btn btn-secondary" href="#/project/${esc(projectKey)}">Return to project</a></div></section>`,{back:'#/projects',backLabel:'Projects'});
    const tiers = [['Support only',299,'Updates · supporter badge'],['Early player',799,'Game key · closed beta'],['Founder pack',1999,'Game · soundtrack · artbook'],['World builder',7499,'Design call · named location']];
    if (stage === 'payment') return shell('Confirm your pledge',`Backing ${project[0]} by ${project[1]}.`,'Project backing',`<form class="wf-two-col" data-backing-payment><section class="wf-card wf-form-card"><p class="eyebrow">PAYMENT</p><h2>UPI or card</h2><label class="wf-choice"><input type="radio" name="method" value="upi" checked><span><b>UPI</b><small>Fast confirmation for Indian backers</small></span></label><label>Demo UPI ID<input required placeholder="name@bank" pattern=".+@.+"></label><label class="wf-choice"><input type="radio" name="method" value="card"><span><b>Card</b><small>Production provider checkout</small></span></label><label class="wf-check"><input required type="checkbox"> I understand crowdfunding has delivery risk and is not a guaranteed purchase.</label><button class="btn btn-primary">Confirm prototype pledge →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">PLEDGE</p><h2 id="backPaymentTotal">₹799</h2><p>${esc(project[0])}</p><p class="wf-note">The creator receives funds through compliant payout rails after applicable platform terms. Nexora’s platform fee is 8.5%.</p></aside></form>`,{back:`#/back/${projectKey}`,backLabel:'Reward',step:['Reward','Details','Payment'],active:2});
    return shell('Choose how to support',`Back ${project[0]} and review delivery expectations before payment.`,'Project backing',`<div class="wf-two-col"><section class="wf-stack"><div class="wf-section-head"><div><p class="eyebrow">REWARD TIERS</p><h2>Pick one clear promise</h2></div></div>${tiers.map((t,i)=>`<label class="wf-card wf-tier ${i===1?'selected':''}"><input type="radio" name="backTier" value="${i}" ${i===1?'checked':''}><span><small>PLEDGE ₹${money(t[1])}</small><b>${esc(t[0])}</b><p>${esc(t[2])}</p></span><i>→</i></label>`).join('')}</section><aside class="wf-card wf-summary"><p class="eyebrow">YOUR PLEDGE</p><h2 id="backTotal">₹799</h2><label>Email<input type="email" id="backEmail" placeholder="backer@example.com"></label><label class="wf-check"><input type="checkbox" id="anonymousBacker"> Back anonymously</label><button class="btn btn-primary" data-back-continue>Continue to payment →</button><a href="#/project/${esc(projectKey)}">Review campaign risks</a></aside></div>`,{back:`#/project/${projectKey}`,backLabel:'Project',step:['Reward','Details','Payment'],active:0});
  }

  function startProjectView() {
    const saved = read(KEYS.drafts, []);
    return shell('Build a credible project draft','Move through the essentials: idea, proof, funding, rewards, risk, and preview.','Creator launchpad',`<div class="wf-builder"><aside class="wf-card wf-builder-nav">${['Basics','Proof','Funding','Rewards','Risks','Preview'].map((x,i)=>`<button class="${i===0?'active':''}" data-builder-step="${i}"><i>${i+1}</i>${x}<span>›</span></button>`).join('')}<div><b>${saved.length}</b><span>saved draft${saved.length===1?'':'s'} in this browser</span></div></aside><form class="wf-card wf-form-card" data-project-builder><section data-builder-panel="0"><p class="eyebrow">01 · BASICS</p><h2>What are you making?</h2><div class="wf-form-grid"><label class="wide">Project title<input required name="title" placeholder="A specific, memorable title"></label><label>Category<select name="category"><option>Indie game</option><option>Game tool</option><option>Game audio</option><option>Interactive media</option></select></label><label>Team size<input type="number" min="1" value="1" name="team"></label><label class="wide">One-line promise<textarea required rows="3" name="pitch" placeholder="What will exist because this campaign succeeds?"></textarea></label></div></section><section data-builder-panel="1" hidden><p class="eyebrow">02 · PROOF</p><h2>Show what already exists</h2><label>Playable build or portfolio URL<input name="proof" placeholder="https://"></label><label>Current state<textarea rows="5" name="state" placeholder="What is complete, in progress, and still unproven?"></textarea></label><div class="wf-check-grid">${['Ownership confirmed','Team roles named','Prototype available','Timeline drafted'].map(x=>`<label class="wf-check"><input type="checkbox"> ${x}</label>`).join('')}</div></section><section data-builder-panel="2" hidden><p class="eyebrow">03 · FUNDING</p><h2>Build the goal transparently</h2><div class="wf-form-grid"><label>Production<input type="number" name="production" value="300000"></label><label>Rewards & fulfilment<input type="number" name="fulfilment" value="60000"></label><label>Contingency<input type="number" name="contingency" value="45000"></label><label>Platform fee<input disabled value="8.5% calculated at launch"></label></div><div class="wf-budget-total"><span>Suggested public goal</span><b data-goal-total>₹4,42,623</b><small>Includes the 8.5% Nexora platform fee; payment-provider charges and taxes may also apply.</small></div></section><section data-builder-panel="3" hidden><p class="eyebrow">04 · REWARDS</p><h2>Keep fulfilment realistic</h2><div id="rewardBuilder"><div class="wf-inline-row"><input value="Early player"><input type="number" value="799"><input value="Game key · beta access"></div></div><button type="button" class="btn btn-secondary" data-add-reward>+ Add tier</button></section><section data-builder-panel="4" hidden><p class="eyebrow">05 · RISKS</p><h2>Say what could change</h2><label>Schedule risk<textarea required rows="3" name="scheduleRisk" placeholder="What could delay the build?"></textarea></label><label>Delivery plan<textarea required rows="3" name="delivery" placeholder="How will you update backers and fulfil rewards?"></textarea></label></section><section data-builder-panel="5" hidden><p class="eyebrow">06 · PREVIEW</p><h2>Ready to save a draft</h2><div class="wf-preview-card"><span>CAMPAIGN DRAFT</span><h3 data-preview-title>Your project title</h3><p data-preview-pitch>Your one-line promise will appear here.</p><div><b data-preview-goal>₹4,42,623 goal</b><span>Draft · not published</span></div></div><label class="wf-check"><input required type="checkbox"> I understand publication requires identity, ownership, risk, and policy review.</label></section><div class="wf-builder-actions"><button type="button" class="btn btn-secondary" data-builder-prev disabled>← Previous</button><span data-builder-progress>Step 1 of 6</span><button type="button" class="btn btn-primary" data-builder-next>Next →</button><button type="submit" class="btn btn-primary" data-builder-save hidden>Save project draft</button></div></form></div>`,{back:'#/projects',backLabel:'Projects'});
  }

  function assetManagerView(mode, listingId) {
    const listings = read(KEYS.listings, [{id:'pixel-forest-pro',title:'Pixel Forest Pro',category:'2D Environments',price:899,status:'Published',sales:38,updated:'12 Aug'}]);
    const current = listings.find(x=>x.id===listingId);
    if (mode === 'new' || mode === 'edit') return shell(mode==='edit'?'Edit asset listing':'Create an asset listing','Describe exactly what buyers receive, under which licence, and for which tools.','Seller studio',`<form class="wf-two-col" data-listing-form><section class="wf-card wf-form-card"><input type="hidden" name="id" value="${esc(current?.id||'')}"><div class="wf-form-grid"><label class="wide">Listing title<input required name="title" value="${esc(current?.title||'')}" placeholder="Specific asset name"></label><label>Category<select name="category"><option>2D Environments</option><option>3D Props</option><option>Music & Audio</option><option>Code & Systems</option><option>UI/UX</option></select></label><label>Price (₹)<input required min="49" type="number" name="price" value="${current?.price||799}"></label><label class="wide">Description<textarea required rows="5" name="description" placeholder="Files, versions, limitations, and ideal use."></textarea></label><label>Engine support<input name="engine" placeholder="Unity 2022+, Unreal 5"></label><label>File formats<input name="formats" placeholder="PNG, PSD, FBX"></label><label>Licence<select name="license"><option>Commercial</option><option>Personal</option><option>Extended commercial</option></select></label><label>Support window<select name="support"><option>90 days</option><option>1 year</option><option>Version updates only</option></select></label><label class="wide">Preview files<div class="wf-file-drop"><input type="file" multiple accept="image/*,video/*"><span>Add 4–8 useful screenshots and an optional short video</span></div></label></div><label class="wf-check"><input required type="checkbox"> I own or have permission to sell every included file.</label><button class="btn btn-primary">Save listing →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">LISTING CHECK</p><ul><li>Readable cover at small size</li><li>Actual in-engine previews</li><li>Version compatibility</li><li>File inventory</li><li>Clear licence and support</li></ul><p class="wf-note">Nexora uses fixed prices only. Auction and bidding tools are not supported.</p></aside></form>`,{back:'#/asset-manager',backLabel:'Seller studio'});
    const body = `<div class="wf-dashboard-head wf-card"><div><p class="eyebrow">SELLER STUDIO</p><h2>Your asset catalogue</h2><p>Draft, publish, update, and support fixed-price listings.</p></div><a class="btn btn-primary" href="#/asset-manager/new">New listing +</a></div><section class="wf-metric-grid"><article class="wf-card"><span>ACTIVE LISTINGS</span><b>${listings.filter(x=>x.status==='Published').length}</b></article><article class="wf-card"><span>30-DAY SALES</span><b>${listings.reduce((s,x)=>s+(x.sales||0),0)}</b></article><article class="wf-card"><span>EARNINGS</span><b>₹28,420</b></article><article class="wf-card"><span>AVG. RATING</span><b>4.9 ★</b></article></section><section class="wf-card wf-table-card"><div class="wf-section-head"><div><p class="eyebrow">LISTINGS</p><h2>Manage inventory</h2></div><input data-table-search placeholder="Search listings…"></div><div class="wf-table"><div class="wf-tr head"><span>Asset</span><span>Status</span><span>Price</span><span>Sales</span><span>Action</span></div>${listings.map(x=>`<div class="wf-tr" data-listing-row><span><b>${esc(x.title)}</b><small>${esc(x.category)} · Updated ${esc(x.updated)}</small></span><span><i class="wf-status ${x.status.toLowerCase()}">${esc(x.status)}</i></span><span>₹${money(x.price)}</span><span>${x.sales||0}</span><span><a href="#/asset-manager/edit/${esc(x.id)}">Edit</a><button data-listing-toggle="${esc(x.id)}">${x.status==='Published'?'Unpublish':'Publish'}</button></span></div>`).join('')}</div></section>`;
    return shell('Asset listing manager','Everything a seller needs to prepare and maintain trustworthy fixed-price listings.','Seller studio',body,{back:'#/account',backLabel:'Account'});
  }

  function briefBuilderView() {
    const brief = read(KEYS.brief, {});
    return shell('Build a hiring brief','Turn an idea into scope a freelancer can quote without guessing.','Brief builder',`<div class="wf-two-col"><form class="wf-card wf-form-card" data-brief-form><div class="wf-form-grid"><label class="wide">Brief title<input required name="title" value="${esc(brief.title||'')}" placeholder="e.g. Combat prototype for a co-op demo"></label><label>Work type<select name="type"><option>Programming</option><option>2D art</option><option>3D art</option><option>Audio</option><option>QA</option><option>Marketing</option></select></label><label>Budget<select name="budget"><option>₹5K–₹15K</option><option>₹15K–₹50K</option><option>₹50K+</option><option>Need a quote</option></select></label><label class="wide">Success looks like<textarea required rows="4" name="outcome" placeholder="Describe the delivered result, not just the activity.">${esc(brief.outcome||'')}</textarea></label><label class="wide">Deliverables<textarea required rows="4" name="deliverables" placeholder="One item per line"></textarea></label><label>Start date<input type="date" name="start"></label><label>Target date<input type="date" name="end"></label><label class="wide">Out of scope<textarea rows="3" name="excluded" placeholder="What should the freelancer not include?"></textarea></label></div><button class="btn btn-primary">Save brief →</button></form><aside class="wf-card wf-live-brief"><p class="eyebrow">LIVE PREVIEW</p><h2 data-brief-title>${esc(brief.title||'Untitled brief')}</h2><p data-brief-outcome>${esc(brief.outcome||'Your success definition will appear here.')}</p><dl><div><dt>Scope quality</dt><dd><b data-brief-score>42%</b></dd></div><div><dt>Next step</dt><dd>Send to matching creators</dd></div></dl><a class="btn btn-secondary" href="#/freelancers">Find creators →</a></aside></div>`,{back:'#/freelancers',backLabel:'Freelance'});
  }

  function creatorGigsView(creatorKey) {
    const creators = {
      'ananya-das':['Ananya Das','2D Game Artist & Unity Developer','Guwahati, Assam','4.9','Usually replies in 2 hours'],
      'rohan-mehta':['Rohan Mehta','Music Producer & Sound Designer','Mumbai, Maharashtra','4.8','Usually replies in 3 hours'],
      'karthik-iyer':['Karthik Iyer','Game Systems & Embedded Developer','Coimbatore, Tamil Nadu','4.9','Usually replies in 1 hour'],
      'vikram-rao':['Vikram Rao','3D Artist & XR Developer','Bengaluru, Karnataka','5.0','Usually replies in 2 hours'],
      'priya-sharma':['Priya Sharma','Game UI/UX & App Developer','Pune, Maharashtra','4.8','Usually replies in 1 hour'],
      'meera-nair':['Meera Nair','Pixel Artist & Narrative Designer','Kochi, Kerala','4.9','Usually replies in 2 hours']
    };
    const creator = creators[creatorKey];
    if (!creator) return genericMissing('Creator gigs','#/explore');
    const gigs = Object.entries(services).filter(([,service]) => service[1] === creator[0]);
    const cards = gigs.length ? gigs.map(([key,gig],index)=>`<article class="wf-card wf-gig-card"><div class="wf-gig-art"><span>${String(index+1).padStart(2,'0')}</span><b>${esc(gig[0].split(' ').slice(0,2).join(' '))}</b></div><div class="wf-gig-copy"><p class="eyebrow">${esc(index%2?'SPECIALIST PACKAGE':'CREATOR SERVICE')}</p><h2>${esc(gig[0])}</h2><p>Defined deliverables, source-file expectations, delivery timing, revisions, and pre-order questions are visible before checkout.</p><div class="wf-gig-meta"><span>Starting at <b>₹${money(gig[2])}</b></span><span>★ ${esc(creator[3])}</span></div><div class="wf-gig-actions"><a class="btn btn-secondary" href="#/service/${esc(key)}">View packages</a><a class="btn btn-primary" href="#/order/${esc(key)}/requirements">Start order →</a></div></div></article>`).join('') : empty('No published gigs yet',`${creator[0]} has not published a fixed service package. You can still send a scoped production brief.`,'#/brief-builder','Create a brief');
    return shell(`${creator[0]}'s gigs`,`Compare every published service, package, delivery promise, and ordering route from this creator.`,'Creator storefront',`<section class="wf-card wf-creator-gig-head"><div class="wf-creator-avatar">${creator[0].split(' ').map(x=>x[0]).join('')}</div><div><p class="eyebrow">VERIFIED CREATOR</p><h2>${esc(creator[0])}</h2><p>${esc(creator[1])} · ${esc(creator[2])}</p><span>★ ${esc(creator[3])} creator rating · ${esc(creator[4])}</span></div><div><a class="btn btn-secondary" href="#/messages">Message creator</a><a class="btn btn-primary" href="#/brief-builder">Send custom brief →</a></div></section><div class="wf-gig-list">${cards}</div><section class="wf-card wf-gig-help"><div><p class="eyebrow">BEFORE ORDERING</p><h2>Need a package recommendation?</h2><p>Send the engine version, desired outcome, references, deadline, and what is outside the scope.</p></div><a class="btn btn-primary" href="#/brief-builder">Build a clear brief →</a></section>`,{back:`#/creator/${creatorKey}`,backLabel:'Creator profile'});
  }

  function wishlistView() {
    const ids = read(KEYS.wishlist, ['pixel-forest','adaptive-music','accessibility-icons']);
    const items = ids.filter(id=>catalog[id]);
    return shell('Saved for later','Keep useful assets and move any fixed-price listing into your cart when ready.','Wishlist',items.length?`<div class="wf-card-grid">${items.map(id=>`<article class="wf-card wf-saved-card"><div class="wf-art"><span>${catalog[id][0].slice(0,2).toUpperCase()}</span></div><small>${esc(catalog[id][1])}</small><h2>${esc(catalog[id][0])}</h2><b>₹${money(catalog[id][2])}</b><div><button class="btn btn-primary" data-wish-cart="${esc(id)}">Add to cart</button><button class="btn btn-secondary" data-wish-remove="${esc(id)}">Remove</button></div></article>`).join('')}</div>`:empty('No saved items','Use the heart action on an asset to keep it here.','#/marketplace','Browse marketplace'),{back:'#/marketplace',backLabel:'Marketplace'});
  }

  function messagesView() {
    const chats = read(KEYS.messages, {
      ananya:{name:'Ananya Das',context:'Unity game development',messages:[['them','Hi! Share the current build and the systems you want reviewed.','10:14'],['me','I need help scoping a controller and save-system pass.','10:22']]},
      vikram:{name:'Vikram Rao',context:'3D character modelling',messages:[['them','I can review the references before recommending a package.','Yesterday']]},
      support:{name:'Nexora Support',context:'Ticket NX-1042',messages:[['them','Your licence question is with the marketplace desk.','Mon']]}
    });
    const active = routePart(location.hash.split('?chat=')[1] || 'ananya');
    const chat = chats[active] || chats.ananya;
    return shell('Messages','Keep project context, scope changes, files, and decisions in one searchable thread.','Inbox',`<div class="wf-message-shell wf-card"><aside><div class="wf-message-search"><input placeholder="Search conversations…"></div>${Object.entries(chats).map(([id,c])=>`<a class="${id===active?'active':''}" href="#/messages?chat=${id}"><span>${c.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><div><b>${esc(c.name)}</b><small>${esc(c.context)}</small></div><i>${c.messages.length}</i></a>`).join('')}</aside><section><header><div><h2>${esc(chat.name)}</h2><span>● Online · ${esc(chat.context)}</span></div><button data-toast-local="Safety tools opened">•••</button></header><div class="wf-chat-log" id="wfChatLog">${chat.messages.map(m=>`<div class="${m[0]}"><p>${esc(m[1])}</p><small>${esc(m[2])}</small></div>`).join('')}</div><form data-message-form><input type="hidden" name="chat" value="${esc(active)}"><button type="button" data-toast-local="Attachment picker opened">＋</button><textarea rows="1" name="message" placeholder="Write a message…" required></textarea><button class="btn btn-primary">Send</button></form><p class="wf-chat-safety">Never share passwords, OTPs, private keys, or payment credentials.</p></section></div>`,{back:'#/account',backLabel:'Account'});
  }

  function forgotPasswordView(stage) {
    if (stage === 'sent') return shell('Check your inbox','If an account matches that address, a recovery link would be sent.','Account recovery',`<section class="wf-success wf-card"><span>✉</span><h2>Recovery instructions requested</h2><p>For privacy, Nexora does not confirm whether an email is registered. The prototype did not send real email.</p><a class="btn btn-primary" href="#/login">Return to sign in</a></section>`,{back:'#/login',backLabel:'Sign in'});
    return shell('Reset your password','Request a secure, time-limited recovery link.','Account recovery',`<form class="wf-card wf-narrow-form" data-reset-form><p class="eyebrow">RECOVERY EMAIL</p><label>Email address<input required type="email" placeholder="you@example.com"></label><button class="btn btn-primary">Send recovery link →</button><p>Remembered it? <a href="#/login">Return to sign in</a></p></form>`,{back:'#/login',backLabel:'Sign in'});
  }

  function ticketsView(mode, id) {
    const tickets = read(KEYS.tickets, [{id:'NX-1042',subject:'Asset licence clarification',desk:'Marketplace',status:'Waiting on Nexora',updated:'Today · 11:20',messages:2},{id:'NX-0988',subject:'KYC document review',desk:'Account',status:'Resolved',updated:'8 Aug',messages:5}]);
    if (mode === 'new') return shell('Open a support ticket','Route the issue with enough context for the right team to act.','Support desk',`<form class="wf-two-col" data-ticket-form><section class="wf-card wf-form-card"><div class="wf-form-grid"><label>Desk<select name="desk"><option>Account</option><option>Marketplace</option><option>Projects & funding</option><option>Safety</option><option>Payments</option></select></label><label>Priority<select name="priority"><option>Normal</option><option>Account blocked</option><option>Transaction issue</option><option>Urgent safety concern</option></select></label><label class="wide">Subject<input required name="subject" placeholder="Short, specific summary"></label><label class="wide">What happened?<textarea required rows="6" name="details" placeholder="Page, action, time, expected result, and what happened instead."></textarea></label><label class="wide">Reference<input name="reference" placeholder="Order, project, user, or transaction reference"></label><label class="wide">Evidence<div class="wf-file-drop"><input type="file" multiple><span>Add screenshots or safe supporting files</span></div></label></div><button class="btn btn-primary">Submit ticket →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">BEFORE YOU SEND</p><ul><li>Include dates and page names.</li><li>Preserve original evidence.</li><li>Never include passwords or OTPs.</li><li>Use Report Abuse for safety cases.</li></ul><a href="#/report-abuse">Open safety report →</a></aside></form>`,{back:'#/support-tickets',backLabel:'Tickets'});
    if (mode === 'detail') {
      const ticket=tickets.find(x=>x.id===id);
      if(!ticket) return shell('Ticket not found','Check the reference and try again.','Support desk',empty('Unknown ticket','Return to your support queue.','#/support-tickets','View tickets'),{back:'#/support-tickets',backLabel:'Tickets'});
      return shell(ticket.subject,`${ticket.id} · ${ticket.desk} desk · ${ticket.status}`,'Support ticket',`<div class="wf-two-col"><section class="wf-card wf-ticket-thread"><div class="wf-ticket-message"><b>You</b><small>Today · 10:42</small><p>I need clarification on whether this licence covers a commercial game and client work.</p></div><div class="wf-ticket-message staff"><b>Nexora Marketplace Desk</b><small>Today · 11:20</small><p>We are checking the listing’s published licence. Please do not rely on assumptions until the seller’s terms are confirmed.</p></div><form data-ticket-reply><textarea required rows="4" placeholder="Add a reply…"></textarea><button class="btn btn-primary">Send reply</button></form></section><aside class="wf-card wf-summary"><p class="eyebrow">CASE DETAILS</p><dl><div><dt>Status</dt><dd>${esc(ticket.status)}</dd></div><div><dt>Desk</dt><dd>${esc(ticket.desk)}</dd></div><div><dt>Updated</dt><dd>${esc(ticket.updated)}</dd></div></dl><button data-close-ticket>Close ticket</button></aside></div>`,{back:'#/support-tickets',backLabel:'Tickets'});
    }
    return shell('Support tickets','Track open cases, replies, and outcomes without losing the history.','Support desk',`<div class="wf-dashboard-head wf-card"><div><p class="eyebrow">MY CASES</p><h2>${tickets.filter(x=>x.status!=='Resolved').length} need attention</h2></div><a class="btn btn-primary" href="#/support-tickets/new">Open ticket +</a></div><section class="wf-card wf-table-card"><div class="wf-table"><div class="wf-tr head"><span>Reference</span><span>Subject</span><span>Desk</span><span>Status</span><span>Updated</span></div>${tickets.map(x=>`<a class="wf-tr" href="#/support-tickets/view/${esc(x.id)}"><span><b>${esc(x.id)}</b></span><span>${esc(x.subject)}</span><span>${esc(x.desk)}</span><span><i class="wf-status">${esc(x.status)}</i></span><span>${esc(x.updated)} →</span></a>`).join('')}</div></section>`,{back:'#/support',backLabel:'Help center'});
  }

  function notificationsView() {
    const items=read(KEYS.notices,[{id:1,type:'Project',title:'Aether posted a milestone update',time:'12 minutes ago',read:false,href:'#/project/aether'},{id:2,type:'Order',title:'Your Pixel Forest files are ready',time:'2 hours ago',read:false,href:'#/account'},{id:3,type:'Community',title:'Meera replied to your scope question',time:'Yesterday',read:true,href:'#/community'},{id:4,type:'Safety',title:'New sign-in from Bengaluru, India',time:'2 days ago',read:true,href:'#/account'}]);
    return shell('Notifications','Important account, order, project, and community activity in one place.','Activity',`<section class="wf-card wf-notice-list"><div class="wf-section-head"><div><p class="eyebrow">INBOX</p><h2>${items.filter(x=>!x.read).length} unread</h2></div><button class="wf-text-btn" data-read-all>Mark all read</button></div>${items.map(x=>`<a href="${x.href}" class="wf-notice ${x.read?'':'unread'}" data-notice-id="${x.id}"><span>${x.type.slice(0,1)}</span><div><small>${esc(x.type)}</small><h3>${esc(x.title)}</h3><p>${esc(x.time)}</p></div><i>${x.read?'':'●'}</i></a>`).join('')}</section>`,{back:'#/account',backLabel:'Account'});
  }

  function payoutsView() {
    return shell('Creator payouts','Track INR earnings, platform fees, available balance, and completed transfers.','Wallet',`<section class="wf-metric-grid"><article class="wf-card"><span>AVAILABLE</span><b>₹12,840</b><small>Eligible to withdraw</small></article><article class="wf-card"><span>PENDING</span><b>₹6,280</b><small>Delivery review period</small></article><article class="wf-card"><span>THIS MONTH</span><b>₹31,420</b><small>Gross creator earnings</small></article><article class="wf-card"><span>PLATFORM FEE</span><b>8.5%</b><small>Shown before confirmation</small></article></section><div class="wf-two-col"><section class="wf-card wf-table-card"><div class="wf-section-head"><div><p class="eyebrow">PAYOUT HISTORY</p><h2>Transfers</h2></div></div><div class="wf-table"><div class="wf-tr head"><span>Reference</span><span>Date</span><span>Method</span><span>Amount</span><span>Status</span></div><div class="wf-tr"><span>WD-0182</span><span>5 Aug</span><span>UPI</span><span>₹8,500</span><span><i class="wf-status published">Paid</i></span></div><div class="wf-tr"><span>WD-0164</span><span>18 Jul</span><span>Bank</span><span>₹5,200</span><span><i class="wf-status published">Paid</i></span></div></div></section><aside class="wf-card wf-summary"><p class="eyebrow">AVAILABLE BALANCE</p><h2>₹12,840</h2><a class="btn btn-primary" href="#/withdraw">Withdraw funds →</a><a href="#/gst-tax">Tax information</a><p class="wf-note">Nexora does not convert points, credits, or tokens into cash. Only eligible INR creator earnings can be paid out.</p></aside></div>`,{back:'#/account',backLabel:'Account'});
  }

  function withdrawView(stage) {
    if(stage==='success') return shell('Withdrawal requested','The transfer request is saved as a prototype confirmation.','Wallet',`<section class="wf-success wf-card"><span>✓</span><p class="eyebrow">WITHDRAWAL WD-${String(Date.now()).slice(-4)}</p><h2>₹8,500 to verified UPI</h2><p>A production system would run KYC, balance, risk, tax, and payout-provider checks before transfer.</p><a class="btn btn-primary" href="#/payouts">View payouts</a></section>`,{back:'#/payouts',backLabel:'Payouts'});
    return shell('Withdraw creator earnings','Choose a verified payout method and review the amount before requesting transfer.','Wallet',`<form class="wf-two-col" data-withdraw-form><section class="wf-card wf-form-card"><p class="eyebrow">PAYOUT METHOD</p><label class="wf-choice"><input type="radio" checked name="method" value="upi"><span><b>UPI · creator@bank</b><small>Verified · usually same business day</small></span></label><label class="wf-choice"><input type="radio" name="method" value="bank"><span><b>Bank · •••• 4182</b><small>Verified · 1–2 business days</small></span></label><label>Amount (₹)<input required type="number" min="500" max="12840" value="8500" name="amount"></label><label class="wf-check"><input required type="checkbox"> I confirm these are eligible creator earnings and my payout details are correct.</label><button class="btn btn-primary">Request withdrawal →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">BALANCE</p><h2>₹12,840</h2><dl><div><dt>Minimum</dt><dd>₹500</dd></div><div><dt>Payout fee</dt><dd>₹0 prototype</dd></div><div><dt>Tokens</dt><dd>Not cash-convertible</dd></div></dl></aside></form>`,{back:'#/payouts',backLabel:'Payouts'});
  }

  function adsView(mode) {
    const ads=read(KEYS.ads,[{id:'AD-14',name:'Pixel Forest launch',placement:'Marketplace discovery',budget:3000,spent:1840,status:'Active',clicks:326},{id:'AD-09',name:'Aether milestone',placement:'Project discovery',budget:5000,spent:5000,status:'Completed',clicks:912}]);
    if(mode==='new') return shell('Create a promotion','Choose a surface, audience, budget, and destination. Ads remain clearly labelled.','Promotion manager',`<form class="wf-two-col" data-ad-form><section class="wf-card wf-form-card"><div class="wf-form-grid"><label class="wide">Campaign name<input required name="name" placeholder="Internal campaign name"></label><label>Promote<select name="type"><option>Asset listing</option><option>Creator profile</option><option>Project</option><option>Service</option></select></label><label>Placement<select name="placement"><option>Marketplace discovery</option><option>Project discovery</option><option>Creator discovery</option></select></label><label class="wide">Destination URL<input required name="url" placeholder="#/asset/pixel-forest"></label><label>Total budget (₹)<input required min="500" type="number" name="budget" value="3000"></label><label>Daily cap (₹)<input required min="100" type="number" name="daily" value="500"></label><label>Start<input required type="date" name="start"></label><label>End<input required type="date" name="end"></label></div><label class="wf-check"><input required type="checkbox"> I understand promoted placements are labelled and do not improve organic ranking.</label><button class="btn btn-primary">Save campaign →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">POLICY CHECK</p><ul><li>Destination must be published.</li><li>No deceptive claims.</li><li>No hidden sponsorship.</li><li>Spend stops at the cap.</li></ul></aside></form>`,{back:'#/ads',backLabel:'Promotions'});
    return shell('Promotion manager','Run clearly labelled promotion campaigns with transparent spend and results.','Promotion manager',`<div class="wf-dashboard-head wf-card"><div><p class="eyebrow">PROMOTIONS</p><h2>Creator campaign manager</h2></div><a class="btn btn-primary" href="#/ads/new">New promotion +</a></div><section class="wf-metric-grid"><article class="wf-card"><span>ACTIVE</span><b>${ads.filter(x=>x.status==='Active').length}</b></article><article class="wf-card"><span>SPEND</span><b>₹${money(ads.reduce((s,x)=>s+x.spent,0))}</b></article><article class="wf-card"><span>CLICKS</span><b>${money(ads.reduce((s,x)=>s+x.clicks,0))}</b></article><article class="wf-card"><span>AVG. CPC</span><b>₹7.44</b></article></section><section class="wf-card wf-table-card"><div class="wf-table"><div class="wf-tr head"><span>Campaign</span><span>Placement</span><span>Budget</span><span>Results</span><span>Status</span></div>${ads.map(x=>`<div class="wf-tr"><span><b>${esc(x.name)}</b><small>${esc(x.id)}</small></span><span>${esc(x.placement)}</span><span>₹${money(x.spent)} / ₹${money(x.budget)}</span><span>${money(x.clicks)} clicks</span><span><i class="wf-status ${x.status==='Active'?'published':''}">${esc(x.status)}</i></span></div>`).join('')}</div></section>`,{back:'#/account',backLabel:'Account'});
  }

  function dropView(id) {
    const drops={
      'cyberpunk-city':['Cyberpunk City Master Pack','₹12,400','Limited source bundle','Environment files, editable source, commercial licence, and seller Q&A.'],
      'hampi-photogrammetry':['Hampi Photogrammetry Collection','₹28,500','Studio collection','Museum-quality scans, project files, and a limited studio licence.'],
      'coop-netcode':['Co-op Netcode Framework','₹19,800','Source release','Documented framework, profiling notes, and one handover session.'],
      'midnight-stems':['Mumbai Midnight Stem Library','₹8,600','Audio vault','Original multitrack stems, alternates, and trailer cut-downs.']
    };
    const d=drops[id];
    if(!d) return shell('Drop not found','This limited release is unavailable.','Marketplace drop',empty('Unknown release','Browse fixed-price marketplace inventory.','#/marketplace','Open marketplace'),{back:'#/marketplace',backLabel:'Marketplace'});
    return shell(d[0],`${d[2]} · fixed price ${d[1]}.`,'Marketplace drop',`<div class="wf-two-col"><section class="wf-card wf-drop-art"><span>LIMITED<br>RELEASE</span><small>NX / DROP</small></section><aside class="wf-card wf-summary"><p class="eyebrow">FIXED-PRICE RELEASE</p><h2>${d[1]}</h2><p>${esc(d[3])}</p><dl><div><dt>Sale type</dt><dd>Fixed price</dd></div><div><dt>Bidding</dt><dd>Not available</dd></div><div><dt>Licence</dt><dd>Shown before purchase</dd></div></dl><button class="btn btn-primary" data-toast-local="Release added to cart">Add release to cart</button><a href="#/marketplace">View standard assets</a></aside></div>`,{back:'#/auctions',backLabel:'Drops'});
  }

  function detailRecord(type,id) {
    const list=hubDetails[type]||[];
    return list.find(x=>x[0]===id);
  }

  function jamView(id) {
    const d=detailRecord('jam',id);
    if(!d) return genericMissing('Jam','#/jams');
    const regs=read(KEYS.registrations,[]), joined=regs.includes(`jam:${id}`);
    return shell(d[1],`${d[2]} · ${d[3]} · ${d[4]}`,'Game jam',`<div class="wf-two-col"><section class="wf-stack"><article class="wf-card wf-prose"><p class="eyebrow">THE CHALLENGE</p><h2>Build, submit, and learn in public</h2><p>${esc(d[5])}</p><h3>What to submit</h3><ul><li>A playable browser or downloadable build</li><li>Three screenshots and a short description</li><li>Credits for teammates and third-party assets</li><li>Accessibility and content notes</li></ul></article><article class="wf-card"><p class="eyebrow">TIMELINE</p><div class="wf-timeline"><span><i>1</i><b>Register</b><small>Free · no registration fee</small></span><span><i>2</i><b>Build</b><small>Use the jam theme and rules</small></span><span><i>3</i><b>Submit</b><small>Before ${esc(d[3])}</small></span><span><i>4</i><b>Showcase</b><small>Community feedback and judging</small></span></div></article></section><aside class="wf-card wf-summary"><p class="eyebrow">REGISTRATION</p><h2>${joined?'You are registered':'Free to join'}</h2><p>No registration fee. Teams keep ownership of their work and must credit assets.</p>${joined?`<button class="btn btn-secondary" data-toast-local="Submission workspace opened">Open submission workspace</button><button data-leave-registration="jam:${esc(id)}">Leave jam</button>`:`<button class="btn btn-primary" data-register="jam:${esc(id)}">Register free →</button>`}<a href="#/discussion-new">Find teammates</a></aside></div>`,{back:'#/jams',backLabel:'Game jams'});
  }

  function jobView(id) {
    const d=detailRecord('job',id); if(!d) return genericMissing('Role','#/jobs');
    return shell(d[1],`${d[2]} · ${d[3]}`,'Opportunity',`<div class="wf-two-col"><section class="wf-card wf-prose"><p class="eyebrow">THE ROLE</p><h2>Clear scope before outreach</h2><p>${esc(d[4])}</p><h3>What you will do</h3><ul><li>Own a defined production area and communicate trade-offs.</li><li>Work with a small cross-disciplinary game team.</li><li>Document decisions and leave maintainable work.</li></ul><h3>What to send</h3><ul><li>Two relevant work samples and your exact contribution</li><li>Availability, location, and expected compensation</li><li>A short note about a problem you solved</li></ul></section><aside class="wf-card wf-summary"><p class="eyebrow">OPPORTUNITY SUMMARY</p><h2>${esc(d[3])}</h2><dl><div><dt>Work mode</dt><dd>${esc(d[2])}</dd></div><div><dt>Verified poster</dt><dd>Yes</dd></div><div><dt>Posted</dt><dd>3 days ago</dd></div></dl><button class="btn btn-primary" data-open-application>Apply / send portfolio →</button><a href="#/brief-builder">Build a collaboration brief</a></aside></div><form class="wf-card wf-form-card wf-inline-form" data-application-form hidden><p class="eyebrow">APPLICATION</p><h2>Introduce your work</h2><label>Portfolio URL<input required type="url" placeholder="https://"></label><label>Short note<textarea required rows="4" placeholder="Relevant experience, availability, and why this fits."></textarea></label><button class="btn btn-primary">Send application →</button></form>`,{back:'#/jobs',backLabel:'Jobs'});
  }

  function fundingToolView(id) {
    const d=detailRecord('funding-tool',id); if(!d) return genericMissing('Funding tool','#/funding');
    if(id==='goal-planner') return shell(d[1],d[2],'Funding toolkit',`<div class="wf-two-col"><form class="wf-card wf-form-card" data-goal-planner><div class="wf-form-grid"><label>Production<input type="number" name="production" value="300000"></label><label>Fulfilment<input type="number" name="fulfilment" value="60000"></label><label>Contingency<input type="number" name="contingency" value="45000"></label><label>Other costs<input type="number" name="other" value="0"></label></div><label>Average pledge<input type="number" name="pledge" value="1499"></label></form><aside class="wf-card wf-summary"><p class="eyebrow">SUGGESTED GOAL</p><h2 data-planner-goal>₹4,42,623</h2><dl><div><dt>Nexora fee</dt><dd>8.5%</dd></div><div><dt>Estimated backers</dt><dd data-planner-backers>296</dd></div><div><dt>Launch-day target</dt><dd data-planner-launch>₹53,115</dd></div></dl><a class="btn btn-primary" href="#/start-project">Use in project draft →</a></aside></div>`,{back:'#/funding',backLabel:'Funding tools'});
    const checklist=id==='proof-checklist';
    return shell(d[1],d[2],'Funding toolkit',`<div class="wf-two-col"><section class="wf-card wf-form-card"><p class="eyebrow">${checklist?'READINESS CHECK':'WORKSHEET'}</p><h2>${checklist?'What can a backer verify?':'Build one practical plan'}</h2>${(checklist?['Playable proof linked','Team roles and ownership explained','Budget tied to milestones','Risks written plainly','Update schedule committed']:['Keep tiers easy to understand','Cost fulfilment before pricing','Limit physical rewards','Plan weekly updates','Name the prelaunch audience']).map(x=>`<label class="wf-check"><input type="checkbox" data-tool-check> ${x}</label>`).join('')}<button class="btn btn-primary" data-save-tool>Save progress</button></section><aside class="wf-card wf-summary"><p class="eyebrow">READINESS</p><h2 data-tool-score>0%</h2><p>Complete the worksheet before opening a campaign draft.</p><a href="#/start-project">Start a project →</a></aside></div>`,{back:'#/funding',backLabel:'Funding tools'});
  }

  function devlogView(id) {
    const d=detailRecord('devlog',id); if(!d) return genericMissing('Devlog','#/devlogs');
    return shell(d[1],`${d[2]} · Build note`,'Devlog',`<article class="wf-card wf-article"><div class="wf-article-cover"><span>BUILD<br>NOTE</span><small>0.7 / PUBLIC</small></div><p class="eyebrow">WHAT CHANGED</p><h2>${esc(d[3])}</h2><p>The change began with a narrow test, a reproducible problem, and a small success condition. The creator documented the before state, the trade-off, and the next unknown instead of presenting unfinished work as complete.</p><blockquote>Build notes are most useful when they show evidence, not just momentum.</blockquote><h3>Next test</h3><p>The next iteration will be shared with a smaller player group before it becomes part of the public milestone.</p><footer><button data-react>♡ 128 reactions</button><a href="#/messages?chat=ananya">Message creator</a></footer></article>`,{back:'#/devlogs',backLabel:'Devlogs'});
  }

  function eventView(id) {
    const d=detailRecord('event',id); if(!d) return genericMissing('Event','#/events');
    const regs=read(KEYS.registrations,[]), joined=regs.includes(`event:${id}`);
    return shell(d[1],`${d[2]} · ${d[3]}`,'Event',`<div class="wf-two-col"><section class="wf-card wf-prose"><p class="eyebrow">SESSION</p><h2>What you will leave with</h2><p>${esc(d[4])}</p><ul><li>A practical worksheet or review checklist</li><li>Live examples from current game projects</li><li>Time for focused questions</li><li>A recording when the session is online</li></ul><h3>Agenda</h3><div class="wf-agenda"><span><b>00:00</b> Welcome and context</span><span><b>00:15</b> Working session</span><span><b>00:55</b> Questions</span></div></section><aside class="wf-card wf-summary"><p class="eyebrow">RESERVATION</p><h2>${joined?'Seat reserved':'Reserve your place'}</h2><p>${esc(d[3])}</p>${joined?`<button class="btn btn-secondary" data-toast-local="Calendar reminder downloaded">Add to calendar</button><button data-leave-registration="event:${esc(id)}">Cancel reservation</button>`:`<button class="btn btn-primary" data-register="event:${esc(id)}">${d[3].includes('Free')?'Register free':'Reserve spot'} →</button>`}</aside></div>`,{back:'#/events',backLabel:'Events'});
  }

  function tutorialView(id) {
    const d=detailRecord('tutorial',id); if(!d) return genericMissing('Tutorial','#/tutorials');
    const progress=read(KEYS.tutorial,{})[id]||0;
    const lessons=['Define the outcome','Prepare the evidence','Build the working plan','Review risk and scope','Publish the next step'];
    return shell(d[1],`${d[2]} · ${d[3]}`,'Learning path',`<div class="wf-two-col"><section class="wf-card wf-course"><div class="wf-course-progress"><span>Progress</span><b>${progress}/${lessons.length} complete</b><i><em style="width:${progress/lessons.length*100}%"></em></i></div>${lessons.map((x,i)=>`<button class="${i<progress?'done':i===progress?'active':''}" data-lesson="${i}"><span>${i<progress?'✓':i+1}</span><div><small>LESSON ${i+1}</small><b>${x}</b></div><i>${i<progress?'Complete':i===progress?'Continue':'Locked'}</i></button>`).join('')}</section><aside class="wf-card wf-summary"><p class="eyebrow">PATH DETAILS</p><h2>${esc(d[2])}</h2><ul><li>Practical worksheet</li><li>Creator examples</li><li>Completion saved locally</li></ul><button class="btn btn-primary" data-continue-course="${esc(id)}">${progress?'Continue learning':'Start path'} →</button></aside></div>`,{back:'#/tutorials',backLabel:'Tutorials'});
  }

  function leaderboardView(id) {
    const d=detailRecord('leaderboard',id); if(!d) return genericMissing('Leaderboard','#/leaderboards');
    const entries={
      'funding-velocity':[['Iron Monsoon','₹6.84L · +18.4%'],['Hampi Builders','₹8.12L · +12.1%'],['Aether','₹2.45L · +9.8%']],
      'creator-delivery':[['Vikram Rao','5.0 ★ · 31 orders'],['Ananya Das','4.9 ★ · 38 orders'],['Karthik Iyer','4.9 ★ · 44 orders']],
      'marketplace-sales':[['Footstep SFX','1,140 sales · 4.9 ★'],['Accessible UI Icons','866 sales · 4.9 ★'],['RPG Inventory','780 sales · 4.9 ★']],
      'community-mvps':[['Meera Nair','128 accepted answers'],['Karthik Iyer','116 accepted answers'],['Ananya Das','94 accepted answers']]
    }[id];
    return shell(d[1],d[2],'Leaderboard',`<div class="wf-two-col"><section class="wf-card wf-ranking"><div class="wf-section-head"><div><p class="eyebrow">THIS MONTH</p><h2>Current ranking</h2></div><select><option>This month</option><option>This week</option><option>All time</option></select></div>${entries.map((x,i)=>`<article><span>#${String(i+1).padStart(2,'0')}</span><div><b>${esc(x[0])}</b><small>${esc(x[1])}</small></div><i>${i===0?'↑':i===1?'—':'↑'}</i></article>`).join('')}</section><aside class="wf-card wf-summary"><p class="eyebrow">METHODOLOGY</p><h2>Understandable signals</h2><p>Rankings use category-specific public signals. Paid promotion does not change organic position.</p><ul><li>Rolling window</li><li>Fraud and reversal checks</li><li>Minimum sample thresholds</li><li>Separate categories, not one opaque score</li></ul></aside></div>`,{back:'#/leaderboards',backLabel:'Leaderboards'});
  }

  function rewardView(id) {
    const d=detailRecord('reward',id); if(!d) return genericMissing('Reward','#/rewards');
    return shell(d[1],`${d[2]} · ${d[3]}`,'Backer reward',`<div class="wf-two-col"><section class="wf-card wf-prose"><p class="eyebrow">FULFILMENT TIMELINE</p><h2>What happens next</h2><div class="wf-timeline vertical"><span><i>✓</i><b>Pledge confirmed</b><small>Payment and tier recorded</small></span><span><i>✓</i><b>Campaign milestone</b><small>Creator posted the latest progress</small></span><span><i>3</i><b>${d[2]}</b><small>${d[3]}</small></span><span><i>4</i><b>Delivery confirmation</b><small>Entitlement and support details</small></span></div></section><aside class="wf-card wf-summary"><p class="eyebrow">REWARD STATUS</p><h2>${esc(d[2])}</h2><p>${esc(d[3])}</p>${d[2]==='Ready to claim'?'<button class="btn btn-primary" data-toast-local="Reward claimed in prototype">Claim reward →</button>':d[2]==='Survey needed'?'<button class="btn btn-primary" data-open-reward-survey>Complete survey →</button>':'<a class="btn btn-secondary" href="#/project/iron-monsoon">View project</a>'}</aside></div><form class="wf-card wf-form-card wf-inline-form" data-reward-survey hidden><h2>Fulfilment survey</h2><label>Display name for credits<input required></label><label>Language preference<select><option>English</option><option>Kannada</option><option>Hindi</option></select></label><button class="btn btn-primary">Save survey</button></form>`,{back:'#/rewards',backLabel:'Rewards'});
  }

  function editorialView(kind,id) {
    const maps={
      'blog-post':[editorial,'Blog article','#/blog'],
      'press-release':[pressReleases,'Press release','#/press'],
      'creator-story':[creatorStories,'Creator story','#/creator-stories'],
      'career-role':[careerRoles,'Career role','#/careers']
    };
    const [map,label,back]=maps[kind], d=map[id]; if(!d) return genericMissing(label,back);
    if(kind==='career-role') return shell(d[0],`${d[1]} · Nexora team`,'Careers',`<div class="wf-two-col"><article class="wf-card wf-prose"><h2>The opportunity</h2><p>${esc(d[2])}</p><h3>What matters here</h3><ul><li>Strong fundamentals and clear judgement</li><li>Comfort working across product boundaries</li><li>Ability to explain trade-offs without theatre</li><li>Respect for creator ownership and user safety</li></ul><h3>Hiring process</h3><p>Portfolio review, working conversation, practical discussion, and team meeting. No speculative unpaid work.</p></article><form class="wf-card wf-form-card" data-career-form><p class="eyebrow">APPLY</p><label>Full name<input required></label><label>Email<input required type="email"></label><label>Portfolio URL<input required type="url"></label><label>Why this role?<textarea required rows="5"></textarea></label><button class="btn btn-primary">Submit application →</button></form></div>`,{back,backLabel:'Careers'});
    const title=d[0], meta=d[1], copy=d[2];
    return shell(title,meta,label,`<article class="wf-card wf-article"><div class="wf-article-cover"><span>${kind==='press-release'?'PRESS':kind==='creator-story'?'CREATOR':'FIELD'}<br>NOTE</span><small>NEXORA / 2026</small></div><p class="eyebrow">${esc(meta)}</p><h2>${esc(copy)}</h2><p>Great creator platforms make the work legible. They show enough context for people to understand what exists, what is promised, what could change, and what the next action means.</p><blockquote>Make the work visible. Make the next step obvious.</blockquote><p>This page is a complete editorial route inside the prototype and can later be connected to a publishing CMS without changing its URL structure.</p><footer><button data-toast-local="Link copied">Share story</button><a href="${back}">More from Nexora →</a></footer></article>`,{back,backLabel:label.replace(/ article| release| story/,'')});
  }

  function supportTopicView(id) {
    const d=supportTopics[id]; if(!d) return genericMissing('Support topic','#/support');
    const questions={account:['I cannot sign in','How do I update KYC?','How do I secure my account?'],marketplace:['Where are my downloads?','What does a licence cover?','How do refunds work?'],projects:['How do I publish a draft?','When are backers charged?','How do creator payouts work?'],safety:['How do I report abuse?','What evidence should I keep?','How do disputes differ from safety reports?']}[id];
    return shell(d[0],d[1],'Help center',`<div class="wf-two-col"><section class="wf-card wf-faq-list"><p class="eyebrow">COMMON QUESTIONS</p>${questions.map((x,i)=>`<details ${i===0?'open':''}><summary>${esc(x)}<span>+</span></summary><p>Follow the visible account or transaction status first. Keep relevant references and screenshots, then open a ticket if the documented action does not resolve the problem.</p></details>`).join('')}</section><aside class="wf-card wf-summary"><p class="eyebrow">STILL NEED HELP?</p><h2>Open a routed case</h2><p>Include the page, action, time, and any safe order or project reference.</p><a class="btn btn-primary" href="#/support-tickets/new">Open ticket →</a>${id==='safety'?'<a href="#/report-abuse">Report abuse</a>':''}</aside></div>`,{back:'#/support',backLabel:'Help center'});
  }

  function discussionView() {
    return shell('Start a community discussion','Ask a focused question, find teammates, or share a useful build note.','Community',`<form class="wf-two-col" data-discussion-form><section class="wf-card wf-form-card"><label>Guild<select><option>Indie Devs Circle</option><option>Game Art India</option><option>Unity Builders</option><option>Audio for Games</option></select></label><label>Post type<select><option>Question</option><option>Team request</option><option>Showcase</option><option>Resource</option></select></label><label>Title<input required placeholder="A specific title people can answer"></label><label>Details<textarea required rows="7" placeholder="Context, what you tried, and the exact feedback you want."></textarea></label><label class="wf-check"><input required type="checkbox"> This post follows the community guidelines.</label><button class="btn btn-primary">Publish discussion →</button></section><aside class="wf-card wf-summary"><p class="eyebrow">GOOD POSTS</p><ul><li>Use a descriptive title.</li><li>Share enough context.</li><li>Credit other people’s work.</li><li>Do not post private data.</li></ul><a href="#/community-guidelines">Read community rules</a></aside></form>`,{back:'#/community',backLabel:'Community'});
  }

  function genericMissing(kind,href) {
    return shell(`${kind} not found`,`This URL does not match a current ${kind.toLowerCase()}.`,'Not found',empty(`Unknown ${kind.toLowerCase()}`,'The item may have moved or the link may be incomplete.',href,`Back to ${kind}s`),{back:href,backLabel:'Back'});
  }

  function render(parts) {
    const page=routePart(parts[0]), p1=routePart(parts[1]), p2=routePart(parts[2]);
    if(page==='cart') return cartView();
    if(page==='checkout') return checkoutView(p1);
    if(page==='order') return orderView(p1,p2||'requirements');
    if(page==='back') return backingView(p1,p2);
    if(page==='start-project') return startProjectView();
    if(page==='asset-manager') return assetManagerView(p1,p2);
    if(page==='brief-builder') return briefBuilderView();
    if(page==='creator-gigs') return creatorGigsView(p1);
    if(page==='wishlist') return wishlistView();
    if(page==='messages') return messagesView();
    if(page==='forgot-password') return forgotPasswordView(p1);
    if(page==='support-tickets') return ticketsView(p1,p2);
    if(page==='notifications') return notificationsView();
    if(page==='payouts') return payoutsView();
    if(page==='withdraw') return withdrawView(p1);
    if(page==='ads') return adsView(p1);
    if(page==='drop') return dropView(p1);
    if(page==='jam') return jamView(p1);
    if(page==='job') return jobView(p1);
    if(page==='funding-tool') return fundingToolView(p1);
    if(page==='devlog') return devlogView(p1);
    if(page==='event') return eventView(p1);
    if(page==='tutorial') return tutorialView(p1);
    if(page==='leaderboard') return leaderboardView(p1);
    if(page==='reward') return rewardView(p1);
    if(page==='support-topic') return supportTopicView(p1);
    if(page==='discussion-new') return discussionView();
    if(['blog-post','press-release','creator-story','career-role'].includes(page)) return editorialView(page,p1);
    return genericMissing('Page','#/');
  }

  function updateHeaderCounts() {
    const button=$('.header-cart-btn');
    if(!button) return;
    let badge=$('.wf-header-count',button);
    const count=read(KEYS.cart,[]).reduce((s,x)=>s+(x.qty||1),0);
    if(!badge){badge=document.createElement('span');badge.className='wf-header-count';button.appendChild(badge);}
    badge.textContent=count;
    badge.hidden=!count;
  }

  function go(hash){ location.hash=hash; }

  function bind(parts) {
    updateHeaderCounts();
    $$('[data-toast-local]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();notify(x.dataset.toastLocal);}));
    $$('[data-cart-remove]').forEach(x=>x.addEventListener('click',()=>{write(KEYS.cart,read(KEYS.cart,[]).filter(y=>y.id!==x.dataset.cartRemove));renderCurrent();}));
    $$('[data-cart-qty]').forEach(x=>x.addEventListener('change',()=>{const cart=read(KEYS.cart,[]);const item=cart.find(y=>y.id===x.dataset.cartQty);if(item)item.qty=Number(x.value);write(KEYS.cart,cart);renderCurrent();}));
    $('[data-clear-cart]')?.addEventListener('click',()=>{write(KEYS.cart,[]);renderCurrent();});
    $('[data-apply-code]')?.addEventListener('click',()=>notify('Promo code is ready for production rules'));
    $('[data-checkout-details]')?.addEventListener('submit',e=>{e.preventDefault();write('nexora_checkout_details',Object.fromEntries(new FormData(e.currentTarget)));go('#/checkout/payment');});
    $('[data-checkout-payment]')?.addEventListener('submit',e=>{e.preventDefault();write(KEYS.cart,[]);go('#/checkout/success');});
    $('[data-order-requirements]')?.addEventListener('submit',e=>{e.preventDefault();write('nexora_order_draft',Object.fromEntries(new FormData(e.currentTarget)));go(`#/order/${routePart(parts[1])}/review`);});
    $('[data-order-submit]')?.addEventListener('submit',e=>{e.preventDefault();go(`#/order/${routePart(parts[1])}/success`);});
    $$('[name="backTier"]').forEach(x=>x.addEventListener('change',()=>{$('#backTotal').textContent=`₹${money([299,799,1999,7499][Number(x.value)])}`;}));
    $('[data-back-continue]')?.addEventListener('click',()=>{const selected=$('[name="backTier"]:checked')?.value||1;write('nexora_back_draft',{project:routePart(parts[1]),tier:Number(selected)});go(`#/back/${routePart(parts[1])}/payment`);});
    $('[data-backing-payment]')?.addEventListener('submit',e=>{e.preventDefault();go(`#/back/${routePart(parts[1])}/success`);});

    let builderStep=0;
    const setBuilderStep=n=>{builderStep=Math.max(0,Math.min(5,n));$$('[data-builder-panel]').forEach((x,i)=>x.hidden=i!==builderStep);$$('[data-builder-step]').forEach((x,i)=>x.classList.toggle('active',i===builderStep));$('[data-builder-prev]').disabled=builderStep===0;$('[data-builder-next]').hidden=builderStep===5;$('[data-builder-save]').hidden=builderStep!==5;$('[data-builder-progress]').textContent=`Step ${builderStep+1} of 6`;};
    $$('[data-builder-step]').forEach((x,i)=>x.addEventListener('click',()=>setBuilderStep(i)));
    $('[data-builder-prev]')?.addEventListener('click',()=>setBuilderStep(builderStep-1));
    $('[data-builder-next]')?.addEventListener('click',()=>setBuilderStep(builderStep+1));
    const updateProjectBudget=()=>{const form=$('[data-project-builder]');if(!form)return;const fd=new FormData(form);const cost=['production','fulfilment','contingency'].reduce((s,k)=>s+Number(fd.get(k)||0),0);const goal=Math.ceil(cost/.915);$$('[data-goal-total],[data-preview-goal]').forEach(x=>x.textContent=`₹${money(goal)}${x.hasAttribute('data-preview-goal')?' goal':''}`);$('[data-preview-title]').textContent=fd.get('title')||'Your project title';$('[data-preview-pitch]').textContent=fd.get('pitch')||'Your one-line promise will appear here.';};
    $('[data-project-builder]')?.addEventListener('input',updateProjectBudget);
    $('[data-add-reward]')?.addEventListener('click',()=>{$('#rewardBuilder').insertAdjacentHTML('beforeend','<div class="wf-inline-row"><input placeholder="Tier name"><input type="number" value="1499"><input placeholder="Included reward"></div>');});
    $('[data-project-builder]')?.addEventListener('submit',e=>{e.preventDefault();const drafts=read(KEYS.drafts,[]);const data=Object.fromEntries(new FormData(e.currentTarget));drafts.push({id:slug(data.title)||`draft-${Date.now()}`,title:data.title||'Untitled project',updated:now(),status:'Draft'});write(KEYS.drafts,drafts);notify('Project draft saved');setTimeout(()=>go('#/account'),500);});

    $('[data-listing-form]')?.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));const list=read(KEYS.listings,[]);const id=data.id||slug(data.title)||`listing-${Date.now()}`;const existing=list.find(x=>x.id===id);const next={id,title:data.title,category:data.category,price:Number(data.price),status:existing?.status||'Draft',sales:existing?.sales||0,updated:'Now'};if(existing)Object.assign(existing,next);else list.push(next);write(KEYS.listings,list);notify('Listing saved');setTimeout(()=>go('#/asset-manager'),450);});
    $$('[data-listing-toggle]').forEach(x=>x.addEventListener('click',()=>{const list=read(KEYS.listings,[]);const item=list.find(y=>y.id===x.dataset.listingToggle);if(item)item.status=item.status==='Published'?'Draft':'Published';write(KEYS.listings,list);renderCurrent();}));
    $('[data-table-search]')?.addEventListener('input',e=>$$('[data-listing-row]').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(e.target.value.toLowerCase())));
    $('[data-brief-form]')?.addEventListener('input',e=>{const fd=new FormData(e.currentTarget);const title=fd.get('title')||'Untitled brief',outcome=fd.get('outcome')||'Your success definition will appear here.';$('[data-brief-title]').textContent=title;$('[data-brief-outcome]').textContent=outcome;const filled=[...fd.values()].filter(Boolean).length;$('[data-brief-score]').textContent=`${Math.min(100,35+filled*9)}%`;});
    $('[data-brief-form]')?.addEventListener('submit',e=>{e.preventDefault();write(KEYS.brief,Object.fromEntries(new FormData(e.currentTarget)));notify('Brief saved');});
    $$('[data-wish-cart]').forEach(x=>x.addEventListener('click',()=>{addCart(x.dataset.wishCart);notify('Moved to cart');}));
    $$('[data-wish-remove]').forEach(x=>x.addEventListener('click',()=>{write(KEYS.wishlist,read(KEYS.wishlist,[]).filter(y=>y!==x.dataset.wishRemove));renderCurrent();}));
    $('[data-message-form]')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget),messages=read(KEYS.messages,{}),chat=fd.get('chat');messages[chat] ||= {name:'Conversation',context:'Nexora',messages:[]};messages[chat].messages.push(['me',fd.get('message'),new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})]);write(KEYS.messages,messages);renderCurrent();});
    $('[data-reset-form]')?.addEventListener('submit',e=>{e.preventDefault();go('#/forgot-password/sent');});
    $('[data-ticket-form]')?.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget)),tickets=read(KEYS.tickets,[]),id=`NX-${Math.floor(1000+Math.random()*8999)}`;tickets.unshift({id,subject:data.subject,desk:data.desk,status:'Open',updated:'Now',messages:1});write(KEYS.tickets,tickets);notify(`Ticket ${id} opened`);setTimeout(()=>go('#/support-tickets'),500);});
    $('[data-ticket-reply]')?.addEventListener('submit',e=>{e.preventDefault();notify('Reply added to ticket');e.currentTarget.reset();});
    $('[data-close-ticket]')?.addEventListener('click',()=>notify('Ticket marked resolved'));
    $('[data-read-all]')?.addEventListener('click',()=>{const items=read(KEYS.notices,[]);items.forEach(x=>x.read=true);write(KEYS.notices,items);renderCurrent();});
    $('[data-withdraw-form]')?.addEventListener('submit',e=>{e.preventDefault();go('#/withdraw/success');});
    $('[data-ad-form]')?.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget)),ads=read(KEYS.ads,[]);ads.unshift({id:`AD-${Math.floor(Math.random()*90+10)}`,name:data.name,placement:data.placement,budget:Number(data.budget),spent:0,status:'Draft',clicks:0});write(KEYS.ads,ads);notify('Promotion draft saved');setTimeout(()=>go('#/ads'),450);});
    $$('[data-register]').forEach(x=>x.addEventListener('click',()=>{const regs=read(KEYS.registrations,[]);if(!regs.includes(x.dataset.register))regs.push(x.dataset.register);write(KEYS.registrations,regs);renderCurrent();notify('Registration saved');}));
    $$('[data-leave-registration]').forEach(x=>x.addEventListener('click',()=>{write(KEYS.registrations,read(KEYS.registrations,[]).filter(y=>y!==x.dataset.leaveRegistration));renderCurrent();}));
    $('[data-open-application]')?.addEventListener('click',()=>{$('[data-application-form]').hidden=false;$('[data-application-form]').scrollIntoView({behavior:'smooth'});});
    $('[data-application-form]')?.addEventListener('submit',e=>{e.preventDefault();notify('Application sent in prototype');e.currentTarget.reset();});
    const recalcPlanner=()=>{const form=$('[data-goal-planner]');if(!form)return;const fd=new FormData(form),cost=['production','fulfilment','contingency','other'].reduce((s,k)=>s+Number(fd.get(k)||0),0),goal=Math.ceil(cost/.915),pledge=Number(fd.get('pledge')||1499);$('[data-planner-goal]').textContent=`₹${money(goal)}`;$('[data-planner-backers]').textContent=money(Math.ceil(goal/pledge));$('[data-planner-launch]').textContent=`₹${money(Math.ceil(goal*.12))}`;};
    $('[data-goal-planner]')?.addEventListener('input',recalcPlanner);
    $$('[data-tool-check]').forEach(x=>x.addEventListener('change',()=>{const all=$$('[data-tool-check]'),done=all.filter(y=>y.checked).length;$('[data-tool-score]').textContent=`${Math.round(done/all.length*100)}%`;}));
    $('[data-save-tool]')?.addEventListener('click',()=>notify('Funding worksheet saved'));
    $('[data-react]')?.addEventListener('click',e=>{e.currentTarget.textContent='♥ 129 reactions';notify('Reaction saved');});
    $('[data-continue-course]')?.addEventListener('click',e=>{const id=e.currentTarget.dataset.continueCourse,progress=read(KEYS.tutorial,{});progress[id]=Math.min(5,(progress[id]||0)+1);write(KEYS.tutorial,progress);renderCurrent();});
    $('[data-open-reward-survey]')?.addEventListener('click',()=>{$('[data-reward-survey]').hidden=false;$('[data-reward-survey]').scrollIntoView({behavior:'smooth'});});
    $('[data-reward-survey]')?.addEventListener('submit',e=>{e.preventDefault();notify('Reward survey saved');});
    $('[data-career-form]')?.addEventListener('submit',e=>{e.preventDefault();notify('Application saved in prototype');e.currentTarget.reset();});
    $('[data-discussion-form]')?.addEventListener('submit',e=>{e.preventDefault();notify('Discussion published in prototype');setTimeout(()=>go('#/community'),500);});
  }

  function renderCurrent() {
    const app=$('#app');
    if(!app)return;
    const clean=(location.hash||'#/').replace(/^#\/?/,'').split('#')[0];
    const parts=clean.split('/').filter(Boolean);
    app.innerHTML=render(parts);
    bind(parts);
    scrollTo({top:0,behavior:'auto'});
  }

  window.NexoraWorkflowPages = {
    handles(parts){ return routes.has(routePart(parts[0])); },
    render,
    bind,
    addCart,
    addWishlist,
    updateHeaderCounts
  };
})();

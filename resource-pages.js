(function () {
  'use strict';

  const esc = (value) => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const icon = {
    arrow: '<span aria-hidden="true">↗</span>',
    check: '<span aria-hidden="true">✓</span>',
    spark: '<span aria-hidden="true">✦</span>'
  };

  function topbar(label, index) {
    return '<div class="resource-topbar"><a href="#/" class="resource-back">← Platform</a>' +
      '<span>' + esc(label) + '</span><b>' + esc(index) + ' / 19</b></div>';
  }

  function shell(key, label, index, title, intro, art, body, footer) {
    return '<div class="page-shell resource-v2 resource-' + key + '" data-resource-page="' + esc(key) + '">' +
      topbar(label, index) +
      '<section class="resource-hero resource-hero--' + key + '">' +
        '<div class="resource-hero-copy"><p class="resource-kicker">' + esc(label) + '</p><h1>' + esc(title) + '</h1><p>' + esc(intro) + '</p></div>' +
        '<div class="resource-hero-art">' + art + '</div>' +
      '</section>' + body +
      '<div class="resource-return"><a class="btn btn-primary" href="#/">Back to Nexora</a><a class="btn btn-secondary" href="#/contact">Contact support</a></div>' +
      footer + '</div>';
  }

  function blog(footer) {
    const body =
      '<section class="blog-feature"><div class="blog-feature-image"><img src="assets/gaming.jpg" alt="Colourful game development workspace"><span>FEATURED / PRODUCTION</span></div>' +
      '<div class="blog-feature-copy"><p class="resource-meta">By Nisha Rao · 12 Aug 2026 · 8 min read</p><h2>How to scope a game prototype without killing the fun</h2><p>A field guide to finding the smallest build that still proves the heart of your game.</p><a href="#/blog-post/scope-prototype" class="resource-link">Read the cover story ' + icon.arrow + '</a></div></section>' +
      '<section class="blog-toolbar"><label><span>Search the journal</span><input data-resource-search="blog" placeholder="Try funding, art, production…"></label><div class="resource-chips"><button data-resource-filter="ALL" class="active">All</button><button data-resource-filter="PRODUCTION">Production</button><button data-resource-filter="FUNDING">Funding</button><button data-resource-filter="FREELANCE">Freelance</button><button data-resource-filter="COMMUNITY">Community</button></div></section>' +
      '<section class="blog-grid" data-search-zone="blog">' +
      article('01','FUNDING','What makes a project worth backing?','Signals that separate a convincing pitch from a risky promise.','6 min','wide') +
      article('02','CRAFT','Building a visual language with a tiny art team','A practical system for consistency across characters, UI and worlds.','9 min','tall') +
      article('03','FREELANCE','From brief to handoff','Milestones, feedback and delivery without endless revisions.','7 min','') +
      article('04','COMMUNITY','Your first 100 real supporters','Small rituals that turn spectators into a healthy community.','5 min','') +
      '</section><section class="blog-trending"><div><p class="resource-kicker">TRENDING NOW</p><h2>Notes creators are saving</h2></div><ol><li><b>01</b> Pricing a game-art package in India <span>4 min</span></li><li><b>02</b> A better weekly devlog format <span>3 min</span></li><li><b>03</b> When to cut a feature <span>6 min</span></li></ol></section>' +
      '<section class="blog-creators"><header><p class="resource-kicker">FEATURED CREATORS</p><h2>Builders behind the field notes</h2></header><div><a href="#/creator/ananya-das"><img src="assets/ananya.jpg" alt="Ananya Das"><span><b>Ananya Das</b><small>2D art · Indie development</small></span></a><a href="#/creator/karthik-iyer"><img src="assets/karthik.jpg" alt="Karthik Iyer"><span><b>Karthik Iyer</b><small>Systems · Prototyping</small></span></a><a href="#/creator/rohan-mehta"><img src="assets/rohan.jpg" alt="Rohan Mehta"><span><b>Rohan Mehta</b><small>Audio · Production</small></span></a></div></section>';
    return shell('blog','Nexora Journal','01','Ideas, craft & the business of making games','Reporting and practical playbooks for people building the next thing worth playing.','<div class="magazine-cover"><small>ISSUE 08</small><b>MAKE<br>THE<br>THING.</b><span>AUG / 2026</span></div>',body,footer);
  }

  function article(n, tag, title, copy, time, cls) {
    var articleRoutes = {'01':'funding-proof','02':'scope-prototype','03':'asset-packaging','04':'community-feedback'};
    return '<article class="blog-card ' + cls + '" data-search-item data-resource-category="' + tag + '"><div class="blog-card-art"><b>' + n + '</b><span>' + tag + '</span></div><div><small>' + time + ' read</small><h3>' + title + '</h3><p>' + copy + '</p><a href="#/blog-post/' + articleRoutes[n] + '">Read article →</a></div></article>';
  }

  function press(footer) {
    const releases = [
      ['13 AUG 2026','Nexora opens creator resource centre','Nineteen focused guides now support creators, backers and marketplace users.'],
      ['01 AUG 2026','Trust and safety workflows expanded','Reporting, verification and dispute information receives a clearer home.'],
      ['18 JUL 2026','Community hub enters prototype testing','New spaces connect teams, game jams and development discussions.']
    ];
    const body = '<section class="press-lead"><div class="press-flash"><span>LATEST</span><h2>Nexora brings the complete creator journey into one connected platform.</h2><p>Company announcement · Dehradun, India</p></div><aside><b>PRESS CONTACT</b><p>Newsroom enquiries and interview requests</p><a href="#/contact">Open contact desk →</a></aside></section>' +
      '<section class="press-releases"><div class="press-section-head"><h2>Press releases</h2><span>2026 ARCHIVE</span></div>' +
      releases.map(function (r, i) { var links=['connected-platform','trust-signals','game-creator-hub']; return '<article><time><small>RELEASE_' + String(i + 1).padStart(3,'0') + '</small>' + r[0] + '</time><div><h3>' + r[1] + '</h3><p>' + r[2] + '</p></div><a href="#/press-release/' + links[i] + '">READ ↗</a></article>'; }).join('') + '</section>' +
      '<section class="press-kit"><div><span>01</span><h3>Media kit</h3><p>Approved marks, product imagery and usage notes.</p><button data-toast="Media kit download is ready for connection">Download kit</button></div><div><span>02</span><h3>Company facts</h3><p>Fast reference for journalists covering Nexora.</p><b>INDIA · CREATOR-FIRST · 2026</b></div><div><span>03</span><h3>Milestones</h3><p>Prototype, community, marketplace and resource launches.</p><a href="#/press">View timeline →</a></div></section>';
    return shell('press','Nexora Newsroom','02','Press, without the corporate fog','Announcements, company facts and brand resources in a newsroom built for fast scanning.','<div class="press-masthead"><small>NEXORA / PRESS / 2026</small><b>NEXORA<br>NEWS</b><span>VOL. 01 — INDIA</span></div>',body,footer);
  }

  function stories(footer) {
    const body = '<section class="story-cinema"><div class="story-image"><img src="assets/ananya.jpg" alt="Ananya Das, creator"><span>CASE STUDY 01</span></div><div class="story-quote"><blockquote>“The breakthrough was not a bigger team. It was a smaller, clearer promise.”</blockquote><p>Ananya Das · 2D artist & indie developer</p></div></section>' +
      '<section class="story-stats"><article><b>143</b><span>early backers</span></article><article><b>12</b><span>prototype weeks</span></article><article><b>03</b><span>major pivots</span></article><article><b>1</b><span>playable vertical slice</span></article></section>' +
      '<section class="story-journey"><header><p class="resource-kicker">DEVELOPMENT JOURNEY</p><h2>From sketchbook to a world people could play</h2></header><div class="journey-track"><article><span>WEEK 01</span><h3>Find the emotional hook</h3><p>A hand-painted folk world became the non-negotiable centre.</p></article><article><span>WEEK 04</span><h3>Cut the map in half</h3><p>The team chose one memorable route over four empty regions.</p></article><article><span>WEEK 08</span><h3>Show unfinished work</h3><p>Weekly clips brought specific, useful community feedback.</p></article><article><span>WEEK 12</span><h3>Ship the slice</h3><p>A focused build made the funding plan understandable.</p></article></div></section>' +
      '<section class="story-next"><img src="assets/karthik.jpg" alt="Karthik Iyer"><div><span>NEXT STORY</span><h3>Hardware that survives a monsoon</h3><p>Karthik Iyer on prototypes, field testing and open-source trust.</p></div><a href="#/creator-story/hardware-monsoon">Read next →</a></section>';
    return shell('creator-stories','Creator Stories','03','The work behind the work','Cinematic case studies about choices, setbacks and the unglamorous moments that made shipping possible.','<div class="story-poster"><img src="assets/pixel-island-crystals.png" alt=""><div><b>PLAYABLE</b><span>A CREATOR FILM / 04:26</span></div></div>',body,footer);
  }

  function howItWorks(footer) {
    const steps = [
      ['01','CREATE','Start with a profile, a project or a service.'],
      ['02','PUBLISH','Show scope, proof, pricing and risks clearly.'],
      ['03','CONNECT','Meet the community, collaborators and supporters.'],
      ['04','BUILD','Use funding, gigs and assets around the work.'],
      ['05','DELIVER','Share progress, finish milestones and build trust.']
    ];
    const body = '<section class="ecosystem-map"><div class="ecosystem-core">NEXORA<span>CREATOR ECOSYSTEM</span></div><div class="ecosystem-path">' +
      steps.map(function (s) { return '<details><summary><b>' + s[0] + '</b><span>' + s[1] + '</span><i>+</i></summary><p>' + s[2] + '</p></details>'; }).join('') +
      '</div></section><section class="flow-destinations"><article><span>FUNDING</span><h3>Build a reward-based campaign</h3><p>Set a goal, explain the plan and keep supporters updated.</p></article><article><span>GIGS</span><h3>Hire for a defined outcome</h3><p>Compare packages, deliverables, timelines and proof.</p></article><article><span>ASSETS</span><h3>Buy production-ready building blocks</h3><p>Review formats, licences and compatibility before checkout.</p></article></section>' +
      '<section class="flow-cta"><b>WHERE SHOULD I START?</b><div><a href="#/explore">I create →</a><a href="#/projects">I support →</a><a href="#/freelancers">I need talent →</a></div></section>';
    return shell('how-it-works','Platform Map','04','One ecosystem. Several ways to move an idea forward.','Open any step to see how discovery becomes collaboration, funding and delivery.','<div class="flow-mini"><span>CREATE</span><i>↓</i><span>CONNECT</span><i>↓</i><b>SHIP</b></div>',body,footer);
  }

  function handbook(footer) {
    const chapters = [
      ['01','PROFILE','Make the strongest work impossible to miss.'],
      ['02','LISTINGS','Define deliverables, files, timing and revisions.'],
      ['03','CLIENTS','Confirm changes in writing and protect the scope.'],
      ['04','DELIVERY','Package work cleanly and explain the handoff.']
    ];
    const body = '<section class="handbook-layout"><aside><p>TABLE OF CONTENTS</p>' + chapters.map(function (c) { return '<a href="#chapter-' + c[0] + '"><b>' + c[0] + '</b>' + c[1] + '</a>'; }).join('') + '<div class="handbook-score"><span>CREATOR SCORECARD</span><b>82 / 100</b><i style="--score:82%"></i><small>Strong proof · Scope needs work</small></div></aside><div class="handbook-pages">' +
      chapters.map(function (c, i) { return '<article id="chapter-' + c[0] + '"><header><b>' + c[0] + '</b><div><span>CHAPTER</span><h2>' + c[1] + '</h2></div></header><p>' + c[2] + '</p><ul><li>' + icon.check + ' Show one clear outcome per case study</li><li>' + icon.check + ' Name your tools, role and constraints</li><li>' + icon.check + ' State what is not included</li></ul><div class="sticky-note ' + (i % 2 ? 'pink' : 'yellow') + '"><b>' + (i % 2 ? 'WATCH OUT' : 'FIELD TIP') + '</b><p>' + (i % 2 ? 'Vague scope becomes expensive revision work.' : 'Specific proof beats a long list of software logos.') + '</p></div></article>'; }).join('') +
      '</div></section>';
    return shell('creator-handbook','Field Manual','05','The creator handbook you can actually use','Chapters, checklists and blunt notes for presenting work and delivering professionally.','<div class="handbook-cover"><span>NXR—01</span><b>THE<br>CREATOR<br>MANUAL</b><small>ANNOTATE / APPLY / SHIP</small></div>',body,footer);
  }

  function fundingGuide(footer) {
    const steps = ['Create','Pitch','Submit','Review','Funding','Development','Delivery'];
    const body = '<section class="funding-process"><div class="funding-process-line"></div>' + steps.map(function (s, i) { return '<details ' + (i === 0 ? 'open' : '') + '><summary><b>' + String(i + 1).padStart(2,'0') + '</b><span>' + s + '</span></summary><p>' + ['Define the project and the outcome supporters can understand.','Show the game, the team, the budget and the reason to care.','Run the checks before the campaign enters review.','Resolve clarity, safety and policy issues.','Collect reward-based support against a visible target.','Publish milestones and honest progress updates.','Complete rewards and document the final handoff.'][i] + '</p></details>'; }).join('') + '</section>' +
      '<section class="funding-dashboard"><div class="funding-example"><header><span>EXAMPLE CAMPAIGN</span><b>63% funded</b></header><h2>Aether — vertical slice</h2><div class="funding-meter"><i style="width:63%"></i></div><div class="funding-numbers"><p><b>₹3,15,000</b> raised</p><p><b>₹5,00,000</b> goal</p><p><b>143</b> supporters</p></div></div><div class="funding-tips"><h3>A fundable page answers:</h3><ol><li>What exists today?</li><li>What exactly will the money unlock?</li><li>What could delay delivery?</li><li>How often will supporters hear from you?</li></ol></div></section>' +
      '<section class="funding-mistakes"><h2>Common pitch mistakes</h2><div><article><b>TOO BIG</b><p>A dream with no testable first milestone.</p></article><article><b>TOO QUIET</b><p>No update rhythm after the campaign starts.</p></article><article><b>TOO VAGUE</b><p>A budget that hides where the money goes.</p></article></div></section>' +
      '<section class="funding-faq"><header><p class="resource-kicker">FUNDING FAQ</p><h2>Before you submit</h2></header><div><details><summary>Is support an investment?</summary><p>No. Nexora campaign support is reward-based or voluntary support, not public equity or a promised financial return.</p></details><details><summary>What should a budget explain?</summary><p>Show the production milestone, major cost groups, contingency and what happens if timing changes.</p></details><details><summary>How often should creators update?</summary><p>Set a realistic schedule before launch and publish material changes promptly.</p></details></div></section>';
    return shell('funding-guide','Funding Playbook','06','Turn belief into a plan people can inspect','A seven-step dashboard for reward-based campaigns, from first pitch to final delivery.','<div class="funding-art"><span>CAMPAIGN READINESS</span><b>07</b><i><em>Plan</em><em>Proof</em><em>Risk</em></i></div>',body,footer);
  }

  function verification(footer) {
    const steps = [
      ['01','Identity','A defined identity check for the account holder.'],
      ['02','Profile','Clear role, location and account context.'],
      ['03','Portfolio','Work samples reviewed for relevance and clarity.'],
      ['04','Review','Signals checked independently; no quality guarantee.'],
      ['05','Verified','The profile shows exactly what was checked.']
    ];
    const body = '<section class="verification-console"><div class="verification-status"><span>PROFILE SIGNAL</span><div class="verified-seal">✓</div><h2>4 of 4 checks complete</h2><p>Verification reduces identity uncertainty. It does not promise quality, delivery or financial safety.</p></div><div class="verification-steps">' +
      steps.map(function (s, i) { return '<details ' + (i === 4 ? 'open' : '') + '><summary><b>' + s[0] + '</b><span>' + s[1] + '</span><i>' + (i === 4 ? 'DONE' : '+') + '</i></summary><p>' + s[2] + '</p></details>'; }).join('') + '</div></section>' +
      '<section class="verification-meaning"><article><span>VERIFICATION MEANS</span><h3>A specific check was completed</h3><p>Hover or open the badge to see the signal and date.</p></article><article><span>IT DOES NOT MEAN</span><h3>Nexora guarantees the creator</h3><p>Always assess scope, reviews, work history and risk separately.</p></article></section>';
    return shell('verification-process','Verification Lab','07','Trust signals, explained one check at a time','Open each frosted step to see what the badge confirms—and what it never promises.','<div class="glass-id"><span>VERIFIED CREATOR</span><div><img src="assets/meera.jpg" alt=""><b>Meera Nair</b></div><small>IDENTITY · PROFILE · PORTFOLIO · PAYMENT</small></div>',body,footer);
  }

  function careers(footer) {
    const jobs = [
      ['PRODUCT','Frontend Engineer','Remote · India','Build fast, accessible creator and marketplace workflows.'],
      ['TRUST','Community & Safety Lead','Remote · India','Design moderation systems with empathy and operational clarity.'],
      ['DESIGN','Product Designer','Remote · India','Make complex creator journeys feel calm and obvious.']
    ];
    const body = '<section class="career-culture"><article><b>SMALL TEAMS</b><p>High ownership with short decision paths.</p></article><article><b>REMOTE FIRST</b><p>Deep work, written context and useful meetings.</p></article><article><b>CREATOR CLOSE</b><p>Build with people who use the product.</p></article><article><b>ROOM TO GROW</b><p>Learning budget and honest feedback.</p></article></section>' +
      '<section class="career-roles"><header><div><p class="resource-kicker">OPEN POSITIONS</p><h2>Find your place</h2></div><div class="resource-chips"><button>All</button><button>Product</button><button>Trust</button><button>Design</button></div></header><div>' +
      jobs.map(function (j, i) { var links=['frontend-engineer','trust-operations','product-designer']; return '<details data-role-category="' + j[0] + '"><summary><span>' + j[0] + '</span><div><h3>' + j[1] + '</h3><p>' + j[2] + '</p></div><b>VIEW ROLE +</b></summary><div class="role-expanded"><p>' + j[3] + '</p><a href="#/career-role/' + links[i] + '">Open role & apply →</a></div></details>'; }).join('') + '</div></section>' +
      '<section class="career-note"><span>NO PERFECT ROLE?</span><h2>Show us the part of Nexora you would improve.</h2><a href="#/contact">Introduce yourself →</a></section>';
    return shell('careers','Join Nexora','08','Build the platform creators wish existed','Soft surfaces, hard problems and a team that values evidence over hierarchy.','<div class="career-orbits"><span>PRODUCT</span><span>TRUST</span><span>DESIGN</span><b>YOU?</b></div>',body,footer);
  }

  function support(footer) {
    const cats = [['◌','Account','Sign-in, profiles and settings'],['₹','Payments','Charges, receipts and refunds'],['✦','Gigs','Orders, milestones and delivery'],['◇','Assets','Files, licences and compatibility'],['↗','Funding','Campaigns, rewards and updates'],['◎','Community','Groups, messages and conduct'],['⌁','Technical','Bugs, access and performance'],['⚑','Safety','Reports, disputes and urgent help']];
    const body = '<section class="support-search"><label><span>⌕</span><input data-resource-search="support" placeholder="Search account, payment, project…"><kbd>ENTER</kbd></label><p>Popular: refund status · creator verification · asset licence</p></section>' +
      '<section class="support-bento" data-search-zone="support">' + cats.map(function (c, i) { var links=['#/support-topic/account','#/support-topic/marketplace','#/support-topic/marketplace','#/support-topic/marketplace','#/support-topic/projects','#/discussion-new','#/support-tickets/new','#/support-topic/safety']; return '<a href="' + links[i] + '" class="' + (i === 0 || i === 5 ? 'large' : '') + '" data-search-item><i>' + c[0] + '</i><div><h3>' + c[1] + '</h3><p>' + c[2] + '</p></div><b>→</b></a>'; }).join('') + '</section>' +
      '<section class="support-popular"><div><p class="resource-kicker">POPULAR QUESTIONS</p><h2>Fast answers</h2></div><div><details><summary>What does a verification badge mean?</summary><p>It names a completed check. It is not a guarantee of quality or delivery.</p></details><details><summary>Where can I report suspicious behaviour?</summary><p>Use Report Abuse and include the account, page, date and relevant evidence.</p></details><details><summary>How do I start a dispute?</summary><p>Collect the scope, messages, files and transaction reference, then open Dispute Resolution.</p></details></div></section>';
    return shell('support','Help Centre','09','How can we help?','Search the knowledge base or choose the surface where the problem started.','<div class="support-bubbles"><span>ACCOUNT</span><span>PAYMENTS</span><span>SAFETY</span><b>?</b></div>',body,footer);
  }

  function contact(footer) {
    const body = '<section class="contact-editorial"><div class="contact-index"><p class="resource-kicker">CHOOSE A DESK</p><h2>The shortest route to the right team.</h2><article><b>01</b><div><h3>General support</h3><p>Accounts, projects, orders and product questions.</p><span>Typical reply: 1–2 business days</span></div></article><article><b>02</b><div><h3>Safety desk</h3><p>Impersonation, harassment, scams and urgent reports.</p><span>Priority reviewed</span></div></article><article><b>03</b><div><h3>Press desk</h3><p>Company information, interviews and brand assets.</p><span>Typical reply: 2 business days</span></div></article></div>' +
      '<form class="contact-form" data-demo-form><div class="contact-form-head"><span>NEW MESSAGE</span><b>REF / AUTO</b></div><label>Name<input required placeholder="Your name"></label><label>Email<input required type="email" placeholder="you@example.com"></label><label>Department<select><option>General support</option><option>Safety desk</option><option>Press desk</option></select></label><label>Message<textarea required rows="6" placeholder="Tell us what happened and include any relevant reference."></textarea></label><p>Never send passwords, OTPs, recovery codes or full payment credentials.</p><button class="btn btn-primary" type="submit">Send message →</button></form></section>' +
      '<section class="contact-faq"><h2>Before you write</h2><p>Include the page, action, time and order or project reference. Screenshots help when they do not expose sensitive information.</p><a href="#/support">Browse support first →</a></section>';
    return shell('contact','Contact Desk','10','Human help, routed properly','A minimal contact room with clear desks, response expectations and a safe message form.','<div class="contact-clock"><span>IST</span><b>20:14</b><small>SUPPORT DESK / ONLINE</small></div>',body,footer);
  }

  function trustSafety(footer) {
    const body = '<section class="safety-status"><header><div><i></i><span>SYSTEM STATUS</span></div><b>ALL SAFETY PATHS OPERATIONAL</b><time>UPDATED 20:10 IST</time></header><div class="safety-grid"><article><span>01 / VERIFY</span><h3>Identity signals</h3><p>Specific checks, visible context and no implied guarantees.</p><b>ONLINE</b></article><article><span>02 / MODERATE</span><h3>Community review</h3><p>Reports are triaged by harm, urgency and available evidence.</p><b>MONITORED</b></article><article><span>03 / DISPUTE</span><h3>Case handling</h3><p>Scope, messages, delivery records and payment evidence stay central.</p><b>AVAILABLE</b></article><article><span>04 / PROTECT</span><h3>Account safety</h3><p>No legitimate workflow asks for passwords, OTPs or recovery codes.</p><b>ENFORCED</b></article></div></section>' +
      '<section class="safety-principles"><div class="safety-radar"><span></span><i></i><b>NXR</b></div><div><p class="resource-kicker">SAFETY PRINCIPLES</p><h2>Reduce uncertainty. Show the signal. Keep the route visible.</h2><ul><li>Verification says exactly what was checked.</li><li>Reports reach a documented review path.</li><li>Users can preserve evidence and appeal outcomes.</li><li>High-risk behaviour receives faster triage.</li></ul></div></section>' +
      '<section class="safety-actions"><a href="#/report-abuse"><b>REPORT ABUSE</b><span>Start a safety report →</span></a><a href="#/dispute-resolution"><b>OPEN A DISPUTE</b><span>Review the case flow →</span></a><a href="#/community-guidelines"><b>READ THE RULES</b><span>Community expectations →</span></a></section>';
    return shell('trust-safety','Trust & Safety','11','Safety should feel like infrastructure','A dark system view of the checks, moderation paths and evidence-led workflows behind Nexora.','<div class="security-grid"><i></i><span class="pulse"></span><b>98.7%</b><small>SIGNAL COVERAGE</small></div>',body,footer);
  }

  function reportAbuse(footer) {
    const categories = [
      ['Harassment or abuse','Harassment / abuse'],
      ['Threats or violence','Threats / violence'],
      ['Hate or discrimination','Hate / discrimination'],
      ['Impersonation','Impersonation'],
      ['Scam or fraud','Scam / fraud'],
      ['Sexual or unsafe content','Sexual / unsafe content'],
      ['Copyright or IP violation','Copyright / IP'],
      ['Spam','Spam'],
      ['Other','Other']
    ];
    const categoryButtons = categories.map(function (category) {
      return '<button type="button" data-report-category="' + esc(category[0]) + '" aria-pressed="false"><span>' + esc(category[1]) + '</span></button>';
    }).join('');
    const categoryOptions = categories.map(function (category) {
      return '<option value="' + esc(category[0]) + '">' + esc(category[0]) + '</option>';
    }).join('');
    const body = '<section class="report-emergency" role="note"><div><span>Urgent safety notice</span><p>If anyone is in immediate physical danger, contact local emergency services first. Nexora handles reports about activity on this platform.</p></div><a href="#/trust-safety">View safety guidance →</a></section>' +
      '<section class="report-intake" aria-labelledby="report-form-title"><form class="report-v2-form" data-demo-form data-report-form><header class="report-form-head"><div><p class="resource-kicker">CONFIDENTIAL REPORT</p><h2 id="report-form-title">Tell us what happened</h2><p>Start with the closest issue type. You can add context and evidence below.</p></div><span>Required fields are marked *</span></header>' +
      '<fieldset class="report-category-fieldset"><legend>1. Choose the issue type <em>*</em></legend><p>Pick the option that best describes the main concern.</p><div class="report-categories" role="group" aria-label="Issue type">' + categoryButtons + '</div><label class="report-category-select">Issue type<select name="category" required><option value="" selected disabled>Select an issue type</option>' + categoryOptions + '</select></label><p class="report-category-status" data-report-category-status aria-live="polite">No issue type selected.</p></fieldset>' +
      '<div class="report-form-section"><div class="report-section-title"><b>2</b><div><h3>Identify the concern</h3><p>Give us the page or account and when the incident occurred.</p></div></div><div class="report-form-grid"><label>Profile, project, message or order <em>*</em><input name="subject-reference" required placeholder="Paste a URL, username or reference ID"></label><label>Date of incident<input name="incident-date" type="date"></label><label>Where did it happen? <em>*</em><select name="surface" required><option value="" selected disabled>Select a platform area</option><option>Direct messages</option><option>Community or comments</option><option>Creator profile</option><option>Project or campaign</option><option>Marketplace listing or order</option><option>Freelance gig or delivery</option><option>Other</option></select></label><label>Your email for case updates <em>*</em><input name="reporter-email" required type="email" autocomplete="email" placeholder="you@example.com"></label></div></div>' +
      '<div class="report-form-section"><div class="report-section-title"><b>3</b><div><h3>Describe what happened</h3><p>Use factual details such as words used, actions taken, dates and frequency.</p></div></div><label class="report-details">Incident details <em>*</em><textarea name="details" required rows="7" placeholder="Example: On 12 August, this account sent repeated threatening messages after I asked them to stop. The relevant message links are..."></textarea><span>Please avoid assumptions. Describe what you directly saw or received.</span></label></div>' +
      '<div class="report-form-section"><div class="report-section-title"><b>4</b><div><h3>Add supporting evidence</h3><p>Attach only material that is relevant to this report.</p></div></div><label class="evidence-drop"><input name="evidence" type="file" multiple accept="image/png,image/jpeg,application/pdf,.webp,.txt"><span class="evidence-icon" aria-hidden="true">＋</span><b>Choose screenshots or documents</b><span>PNG, JPG, WEBP, PDF or TXT · remove passwords, OTPs and full payment details</span></label></div>' +
      '<label class="report-declaration"><input name="declaration" type="checkbox" required><span>I confirm that this report is accurate to the best of my knowledge and I understand that intentionally false reports may violate platform rules.</span></label>' +
      '<footer class="report-submit-row"><div><b>Privacy</b><span>Your report is shared only with teams involved in review, safety and legal compliance where required.</span></div><button type="submit">Submit safety report <span>→</span></button></footer></form>' +
      '<aside class="report-guidance"><div class="report-guidance-head"><span>Before you submit</span><b>Case intake</b></div><ol><li><b>01</b><div><strong>Preserve evidence</strong><span>Keep original messages, files, usernames, dates and transaction references.</span></div></li><li><b>02</b><div><strong>Do not engage further</strong><span>If contact feels unsafe, stop responding and use account blocking controls.</span></div></li><li><b>03</b><div><strong>Expect a case review</strong><span>The safety team may ask for more context before deciding an outcome.</span></div></li></ol><div class="report-sensitive-note"><b>Never include</b><p>Passwords, OTPs, recovery codes, card numbers or unrelated private information.</p></div><div class="report-alternate-route"><span>Payment or delivery disagreement?</span><p>A normal order disagreement may belong in the Resolution Centre.</p><a href="#/dispute-resolution">Open dispute guidance →</a></div></aside></section>' +
      '<section class="report-after"><header><p class="resource-kicker">AFTER SUBMISSION</p><h2>What happens next</h2></header><div><article><b>01</b><h3>Intake</h3><p>Your report receives a case reference and completeness check.</p></article><article><b>02</b><h3>Risk review</h3><p>Urgency, reported harm and available evidence guide prioritisation.</p></article><article><b>03</b><h3>Decision</h3><p>Nexora may restrict content or accounts when platform rules are violated.</p></article><article><b>04</b><h3>Case update</h3><p>We share an update where privacy, security and applicable law allow it.</p></article></div></section>';
    return shell('report-abuse','Trust & Safety','12','Submit a safety report','Tell us what happened. Your report will be reviewed through a documented, confidential process.','<div class="report-case-art" aria-hidden="true"><span>TRUST &amp; SAFETY</span><svg viewBox="0 0 120 120" fill="none"><path d="M60 12 96 25v27c0 25-14 44-36 56C38 96 24 77 24 52V25l36-13Z"/><path d="m43 59 11 11 24-27"/></svg><b>CONFIDENTIAL INTAKE</b><small>CASE ROUTING · EVIDENCE · REVIEW</small></div>',body,footer);
  }

  function dispute(footer) {
    const stages = [['1','COMPLAINT','Scope and issue recorded'],['2','REVIEW','Case completeness checked'],['3','EVIDENCE','Files and messages compared'],['4','MEDIATION','Resolution options explored'],['5','RESOLUTION','Outcome recorded']];
    const body = '<section class="case-header"><div><span>CASE / DEMO-2048</span><h2>Delivery scope dispute</h2><p>Gig order · Opened 12 Aug 2026</p></div><b>IN REVIEW</b></section>' +
      '<section class="case-flow">' + stages.map(function (s, i) { return '<article class="' + (i < 2 ? 'done' : i === 2 ? 'active' : '') + '"><b>' + s[0] + '</b><div><span>' + s[1] + '</span><p>' + s[2] + '</p></div></article>'; }).join('') + '</section>' +
      '<section class="case-dashboard"><div class="case-evidence"><header><h3>Evidence checklist</h3><span>3 / 5 READY</span></header><label><input checked type="checkbox"> Original scope and package</label><label><input checked type="checkbox"> Platform messages</label><label><input checked type="checkbox"> Delivered files</label><label><input type="checkbox"> Revision request timeline</label><label><input type="checkbox"> Payment reference</label></div><div class="case-guidance"><span>MEDIATOR NOTE</span><blockquote>Focus on the written deliverables, not what either side assumed.</blockquote><a href="#/contact">Start a support case →</a></div></section>' +
      '<section class="case-outcomes"><article><span>A</span><h3>Complete delivery</h3><p>Finish the agreed scope by a revised date.</p></article><article><span>B</span><h3>Partial resolution</h3><p>Accept completed work with an agreed adjustment.</p></article><article><span>C</span><h3>Refund path</h3><p>Apply the relevant policy and payment workflow.</p></article></section>';
    return shell('dispute-resolution','Resolution Centre','13','Every dispute needs a clean case file','A case-management view that keeps scope, evidence, mediation and outcome in one visible flow.','<div class="case-ticket"><span>CASE STATUS</span><b>#2048</b><i>REVIEWING EVIDENCE</i></div>',body,footer);
  }

  function guidelines(footer) {
    const rules = [['01','RESPECT','No harassment, threats, hate or targeted abuse.'],['02','SAFETY','Never request passwords, OTPs or recovery codes.'],['03','NO FRAUD','No impersonation, deceptive listings or false proof.'],['04','NO SPAM','No mass promotion or engagement manipulation.'],['05','MARKETPLACE','Describe scope, files, licences and timing honestly.'],['06','COMMUNITY','Disagree with ideas without attacking people.']];
    const body = '<section class="rules-banner"><span>READ IT</span><b>USE IT</b><span>ENFORCE IT</span></section><section class="rules-list">' +
      rules.map(function (r, i) { return '<article><b>' + r[0] + '</b><div><h2>' + r[1] + '</h2><p>' + r[2] + '</p></div><span>' + (i % 2 ? 'KEEP IT CLEAN' : 'NON-NEGOTIABLE') + '</span></article>'; }).join('') + '</section>' +
      '<section class="rules-enforcement"><div><span>WHAT HAPPENS NEXT?</span><h2>Context matters. Patterns matter too.</h2></div><ol><li>Content warning or removal</li><li>Feature or messaging restriction</li><li>Temporary account suspension</li><li>Permanent removal for severe or repeated harm</li></ol><a href="#/report-abuse">Report a violation →</a></section>';
    return shell('community-guidelines','Rulebook','14','Good community is a product decision','Six loud, readable rules for keeping the platform useful, honest and safe.','<div class="rule-stamp"><span>NEXORA COMMUNITY</span><b>PLAY<br>FAIR.</b><small>EDITION / 2026</small></div>',body,footer);
  }

  function pricing(footer) {
    const body = '<section class="pricing-summary"><article><span>PLATFORM FEE</span><b>8.5%</b><p>Applied to successful marketplace and gig transactions, before applicable taxes.</p></article><article><span>GAME JAM REGISTRATION</span><b>₹0</b><p>No registration fee for Nexora game jams.</p></article><article><span>LISTING FEE</span><b>₹0</b><p>Create a standard listing without an upfront listing charge.</p></article></section>' +
      '<section class="earning-example"><div class="earning-card"><header><span>CREATOR EARNING EXAMPLE</span><b>INR</b></header><label>Customer payment <output>₹10,000</output></label><label>Platform fee · 8.5% <output>− ₹850</output></label><label>Subtotal before tax/payment charges <output>₹9,150</output></label><div><span>ILLUSTRATIVE NET</span><b>₹9,150</b></div><small>Taxes and payment-provider charges, if applicable, are shown before confirmation.</small></div><div class="fee-notes"><h2>Clear before checkout</h2><ul><li>Creators set the base price and included deliverables.</li><li>Asset listings show licence type and included files.</li><li>Tokens or credits cannot be converted into money.</li><li>Nexora does not use auction or bidding fees.</li></ul></div></section>' +
      '<section class="fee-table"><header><h2>Fee map</h2><span>PROTOTYPE PRICING</span></header><div><b>Transaction</b><b>Creator sets price</b><b>Nexora fee</b><b>Upfront charge</b></div><div><span>Gig order</span><span>Yes</span><span>8.5%</span><span>₹0</span></div><div><span>Digital asset</span><span>Yes</span><span>8.5%</span><span>₹0</span></div><div><span>Game jam</span><span>—</span><span>₹0 registration</span><span>₹0</span></div></section>' +
      '<section class="pricing-faq"><h2>Pricing questions</h2><details><summary>When is the fee shown?</summary><p>Before the transaction is confirmed and in the related order record.</p></details><details><summary>Can credits be cashed out?</summary><p>No. Any buyer-facing credits are not money and cannot be converted into cash.</p></details><details><summary>Are taxes included?</summary><p>Applicable taxes and provider charges should be itemised in the final checkout.</p></details></section>';
    return shell('pricing-fees','Pricing & Fees','15','Simple numbers. No mystery maths.','A soft financial dashboard showing what creators set, what Nexora charges and what stays free.','<div class="price-dial"><span>TRANSPARENT FEE</span><b>8.5%</b><i>ON SUCCESS</i></div>',body,footer);
  }

  const legalData = {
    terms: {
      index:'16', label:'Terms of Service', title:'Terms, organised for humans',
      intro:'A navigable overview of platform access, user duties, transactions and enforcement.',
      sections:[
        ['01','Using Nexora','Use Nexora lawfully. Do not disrupt, scrape, manipulate, bypass or misuse platform workflows.'],
        ['02','Accounts and verification','Keep account information accurate and protect access credentials. Verification describes completed checks; it is not a guarantee.'],
        ['03','Creator listings','Creators are responsible for listing accuracy, rights, licences, delivery promises and applicable taxes.'],
        ['04','Reward-based funding','Public support is reward-based or voluntary support, not public equity, investment or a promised financial return.'],
        ['05','Enforcement and disputes','Nexora may restrict content or accounts under applicable policies and provide review or dispute routes where relevant.']
      ]
    },
    privacy: {
      index:'17', label:'Privacy Policy', title:'Your data, mapped clearly',
      intro:'A restrained guide to data categories, purpose, sharing, retention and user choices.',
      sections:[
        ['01','Data you provide','Account details, profile information, content, messages, support requests and verification submissions.'],
        ['02','Transaction data','Payment status and transaction references may be processed with regulated payment partners; Nexora should not store full card credentials.'],
        ['03','How data is used','To operate accounts, transactions, safety, support, analytics, legal compliance and service improvement.'],
        ['04','Sharing and retention','Share only for defined services, legal duties and safety needs; retain information only as long as justified.'],
        ['05','Your choices','Applicable rights may include access, correction, deletion and grievance routes.']
      ]
    },
    'refund-policy': {
      index:'18', label:'Refund Policy', title:'Refund paths, without guesswork',
      intro:'A transaction-aware map of cancellation, non-delivery, disputes and payment reversals.',
      sections:[
        ['01','Before confirmation','Review scope, licence, delivery terms, cancellation conditions and the final amount.'],
        ['02','Digital assets','Downloaded or accessed digital products may have limited refund eligibility except for defects, misdescription or applicable legal rights.'],
        ['03','Gigs and milestones','Refund decisions should follow completed work, accepted milestones, agreed scope and dispute evidence.'],
        ['04','Reward-based campaigns','Campaign refunds depend on the campaign rules, success threshold, payment status and delivery circumstances.'],
        ['05','Processing time','Approved refunds return through the original payment route subject to provider and bank processing time.']
      ]
    },
    'gst-tax': {
      index:'19', label:'GST & Tax', title:'Tax information, separated from advice',
      intro:'A clean reference for invoices, creator records, GST treatment and professional review.',
      sections:[
        ['01','Creator responsibility','Creators determine their own registration, invoicing, GST and income-tax obligations.'],
        ['02','Platform fee records','Nexora should provide records for platform fees and applicable taxes charged by the platform.'],
        ['03','Customer invoices','The responsible supplier and invoice structure depend on the final transaction model and applicable law.'],
        ['04','Records to keep','Preserve invoices, order records, refunds, payout statements and relevant business documents.'],
        ['05','Get professional advice','Use a qualified CA or tax professional for registration thresholds, classification and filing.']
      ]
    }
  };

  function legalPage(key, footer) {
    const d = legalData[key];
    const body = '<section class="legal-search"><label><span>⌕</span><input data-resource-search="legal" placeholder="Search this document…"></label><p>Last reviewed: 13 August 2026 · Prototype policy overview</p></section>' +
      '<section class="legal-layout"><aside><b>CONTENTS</b>' + d.sections.map(function (s) { return '<a href="#legal-' + s[0] + '">' + s[0] + ' ' + s[1] + '</a>'; }).join('') + '<div><span>NEED HELP?</span><a href="#/contact">Contact support →</a></div></aside><main data-search-zone="legal">' +
      d.sections.map(function (s) { return '<article id="legal-' + s[0] + '" data-search-item><header><b>' + s[0] + '</b><h2>' + s[1] + '</h2><button aria-label="Copy section link" data-copy-section="' + s[0] + '">#</button></header><p>' + s[2] + '</p><details><summary>Read practical notes</summary><p>Final production wording must match the implemented workflow, contracts, payment provider and applicable Indian law.</p></details></article>'; }).join('') +
      '</main><nav><b>ON THIS PAGE</b><span>' + d.sections[0][1] + '</span><span>' + d.sections[1][1] + '</span><span>' + d.sections[2][1] + '</span><a href="#/contact">Questions? →</a></nav></section>';
    return shell(key,d.label,d.index,d.title,d.intro,'<div class="legal-file"><span>DOC / ' + d.index + '</span><b>§</b><small>NEXORA KNOWLEDGE BASE</small></div>',body,footer);
  }

  function render(key, footer) {
    const routes = {
      blog:blog, press:press, 'creator-stories':stories, 'how-it-works':howItWorks,
      'creator-handbook':handbook, 'funding-guide':fundingGuide,
      'verification-process':verification, careers:careers, support:support,
      contact:contact, 'trust-safety':trustSafety, 'report-abuse':reportAbuse,
      'dispute-resolution':dispute, 'community-guidelines':guidelines,
      'pricing-fees':pricing
    };
    if (legalData[key]) return legalPage(key, footer);
    return routes[key] ? routes[key](footer) : null;
  }

  document.addEventListener('input', function (event) {
    const input = event.target.closest('[data-resource-search]');
    if (!input) return;
    const zone = document.querySelector('[data-search-zone="' + input.dataset.resourceSearch + '"]');
    if (!zone) return;
    const query = input.value.trim().toLowerCase();
    const activeCategory = input.closest('.resource-blog')?.dataset.activeCategory || 'ALL';
    zone.querySelectorAll('[data-search-item]').forEach(function (item) {
      const missesSearch = query && !item.textContent.toLowerCase().includes(query);
      const missesCategory = activeCategory !== 'ALL' && item.dataset.resourceCategory !== activeCategory;
      item.hidden = !!(missesSearch || missesCategory);
    });
  });

  document.addEventListener('submit', function (event) {
    if (!event.target.matches('[data-demo-form]')) return;
    event.preventDefault();
    if (window.NexoraResourcePages.toast) window.NexoraResourcePages.toast('Submitted in demo mode');
    event.target.reset();
    if (event.target.matches('[data-report-form]')) {
      const root = event.target.closest('.resource-report-abuse');
      root?.querySelectorAll('[data-report-category]').forEach(function (button) {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      });
      const status = root?.querySelector('[data-report-category-status]');
      if (status) status.textContent = 'No issue type selected.';
    }
  });

  document.addEventListener('change', function (event) {
    if (!event.target.matches('.report-category-select select')) return;
    const root = event.target.closest('.resource-report-abuse');
    const value = event.target.value;
    root.querySelectorAll('[data-report-category]').forEach(function (button) {
      const selected = button.dataset.reportCategory === value;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const status = root.querySelector('[data-report-category-status]');
    if (status) status.textContent = value ? 'Selected: ' + value + '.' : 'No issue type selected.';
  });

  document.addEventListener('click', function (event) {
    const filter = event.target.closest('[data-resource-filter]');
    if (filter) {
      const root = filter.closest('.resource-blog');
      const category = filter.dataset.resourceFilter;
      const query = root.querySelector('[data-resource-search="blog"]')?.value.trim().toLowerCase() || '';
      root.dataset.activeCategory = category;
      root.querySelectorAll('[data-resource-filter]').forEach(function (button) { button.classList.toggle('active', button === filter); });
      root.querySelectorAll('[data-resource-category]').forEach(function (item) { item.hidden = (category !== 'ALL' && item.dataset.resourceCategory !== category) || (query && !item.textContent.toLowerCase().includes(query)); });
      return;
    }
    const roleFilter = event.target.closest('.resource-careers .resource-chips button');
    if (roleFilter) {
      const category = roleFilter.textContent.trim().toUpperCase();
      const root = roleFilter.closest('.resource-careers');
      root.querySelectorAll('.resource-chips button').forEach(function (button) { button.classList.toggle('active', button === roleFilter); });
      root.querySelectorAll('[data-role-category]').forEach(function (item) { item.hidden = category !== 'ALL' && item.dataset.roleCategory !== category; });
      return;
    }
    const reportCategory = event.target.closest('[data-report-category]');
    if (reportCategory) {
      const root = reportCategory.closest('.resource-report-abuse');
      const select = root.querySelector('.report-v2-form select');
      if (select) {
        if (![...select.options].some(function (option) { return option.value === reportCategory.dataset.reportCategory; })) select.add(new Option(reportCategory.dataset.reportCategory));
        select.value = reportCategory.dataset.reportCategory;
      }
      root.querySelectorAll('[data-report-category]').forEach(function (button) {
        const selected = button === reportCategory;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      const status = root.querySelector('[data-report-category-status]');
      if (status) status.textContent = 'Selected: ' + reportCategory.dataset.reportCategory + '.';
      return;
    }
    const copy = event.target.closest('[data-copy-section]');
    if (!copy) return;
    if (navigator.clipboard) navigator.clipboard.writeText(location.href.split('#')[0] + '#legal-' + copy.dataset.copySection);
    if (window.NexoraResourcePages.toast) window.NexoraResourcePages.toast('Section link copied');
  });

  function enhance() {
    const root = document.querySelector('[data-resource-page]');
    if (!root || root.dataset.enhanced === 'true') return;
    root.dataset.enhanced = 'true';
    const revealItems = root.querySelectorAll(':scope > section:not(.resource-hero), :scope > .resource-return');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (item) { item.classList.add('resource-reveal','is-visible'); });
    } else {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, {threshold:.08,rootMargin:'0px 0px -40px'});
      revealItems.forEach(function (item, index) {
        item.classList.add('resource-reveal');
        item.style.setProperty('--reveal-delay', Math.min(index,4) * 45 + 'ms');
        observer.observe(item);
      });
    }
    const legalArticles = root.querySelectorAll('.legal-layout main article');
    if (legalArticles.length && 'IntersectionObserver' in window) {
      const legalObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          root.querySelectorAll('.legal-layout aside a').forEach(function (link) { link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id); });
        });
      }, {rootMargin:'-25% 0px -60%'});
      legalArticles.forEach(function (article) { legalObserver.observe(article); });
    }
  }

  window.NexoraResourcePages = { render:function (key, footer) { const html = render(key, footer); setTimeout(enhance, 0); return html; }, enhance:enhance, toast:null };
}());

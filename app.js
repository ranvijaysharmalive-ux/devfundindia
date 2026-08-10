(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const icons = {
    sparkle: '<svg viewBox="0 0 24 24"><path d="M12 3l1.3 3.8L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.2L12 3Z"/><path d="m18.3 14 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.6-2.9 8.1-7 10-4.1-1.9-7-5.4-7-10V6l7-3Z"/><path d="m9 12 2 2 4-5"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/></svg>',
    rocket: '<svg viewBox="0 0 24 24"><path d="M14 5c2.8-2 5.3-2 6-2-.1.8-.3 3.4-2.3 6.1L13 14l-3-3 4-6Z"/><path d="M10 11 6 10l-3 3 5 2M13 14l1 4-3 3-2-5"/><path d="M15.5 7.5h.01"/></svg>',
    wallet: '<svg viewBox="0 0 24 24"><path d="M4 6h14a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2V6Z"/><path d="M4 7V5a2 2 0 0 1 2-2h11v3M15 11h5v4h-5a2 2 0 0 1 0-4Z"/></svg>',
    users: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    badge: '<svg viewBox="0 0 24 24"><path d="M12 3l2 2.2 3-.2.7 2.9 2.5 1.6-1.2 2.7 1.2 2.7-2.5 1.6-.7 2.9-3-.2L12 21l-2-2.2-3 .2-.7-2.9-2.5-1.6L5 11.8 3.8 9.1l2.5-1.6L7 4.6l3 .2L12 3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></svg>',
    message: '<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></svg>',
    award: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="5"/><path d="m9 13-1 8 4-2 4 2-1-8"/></svg>',
    controller: '<svg viewBox="0 0 24 24"><path d="M7 8h10l2.4 6.8a2.3 2.3 0 0 1-4.3 1.7L14 15h-4l-1.1 1.5a2.3 2.3 0 0 1-4.3-1.7L7 8Z"/><path d="M9 11v2.2M7.9 12.1h2.2M16.2 10.2h.01M18.1 12h.01"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="m9 15 6-6"/><path d="M11 6.5 12 5.4a4 4 0 0 1 5.7 5.7l-1.2 1.2M13 17.5l-1 1.1a4 4 0 0 1-5.7-5.7l1.2-1.2"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.2 6l-2.4 12"/></svg>',
    trendUp: '<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
    translate: '<svg viewBox="0 0 24 24"><path d="M4 5.5h7M7.5 3.3v2.2M4.3 9.3c1.4 3 3.9 5.3 6.9 6.3M11 5.5c-1 4.2-4 7.8-8.2 9.6"/><path d="M14 21l4-9 4 9M15.2 18h5.6"/></svg>',
    crown: '<svg viewBox="0 0 24 24"><path d="M3 9l3.5 3L12 5l5.5 7L21 9l-2 9H5L3 9Z" fill="#ffcf3f" stroke="#e0a300" stroke-width=".7" stroke-linejoin="round"/><circle cx="6.5" cy="9" r="1.3" fill="#fff4cf"/><circle cx="12" cy="6.4" r="1.3" fill="#fff4cf"/><circle cx="17.5" cy="9" r="1.3" fill="#fff4cf"/></svg>',
    gemDecor: '<svg viewBox="0 0 24 24"><path d="M4 9 8 4h8l4 5-9.5 11.5L4 9Z" fill="#ef5bb5" stroke="#c72e8b" stroke-width=".6" stroke-linejoin="round"/><path d="M4 9h16M9.5 9 12 4l2.5 5M12 4l-3 5 3 11.5 3-11.5-3-5Z" stroke="#ffdcf0" stroke-width=".5" opacity=".8"/></svg>',
    starDecor: '<svg viewBox="0 0 24 24"><path d="m12 2 2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2Z" fill="#f6b51f" stroke="#e0940a" stroke-width=".6"/></svg>',
    mushroomDecor: '<svg viewBox="0 0 24 24"><path d="M4 11c0-4.4 3.6-8 8-8s8 3.6 8 8H4Z" fill="#ef4b5f" stroke="#c22f42" stroke-width=".6"/><circle cx="8.5" cy="8.5" r="1.1" fill="#fff"/><circle cx="13.5" cy="6.5" r="1" fill="#fff"/><circle cx="16.5" cy="9.5" r=".9" fill="#fff"/><path d="M9 11h6l-.7 8a1.8 1.8 0 0 1-1.8 1.6h-1a1.8 1.8 0 0 1-1.8-1.6L9 11Z" fill="#fff4e6" stroke="#e3d3b8" stroke-width=".5"/></svg>',
    chestDecor: '<svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="9" rx="1.4" fill="#a9691f" stroke="#7a4a12" stroke-width=".6"/><path d="M3 10a9 5 0 0 1 18 0" fill="#c98330" stroke="#7a4a12" stroke-width=".6"/><rect x="10.4" y="9.6" width="3.2" height="3" rx=".6" fill="#ffd23f" stroke="#c79600" stroke-width=".5"/><path d="M3 13h18" stroke="#7a4a12" stroke-width=".6"/></svg>',
    sparkleDecor: '<svg viewBox="0 0 24 24"><path d="M12 2c.6 4 2.4 7.4 6 9-3.6 1.6-5.4 5-6 9-.6-4-2.4-7.4-6-9 3.6-1.6 5.4-5 6-9Z" fill="#9d62ff"/><circle cx="19" cy="5" r="1.6" fill="#ef5bb5"/></svg>',
    heartBubbleDecor: '<svg viewBox="0 0 24 24"><path d="M4 5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="#fff" stroke="#e3ddf5" stroke-width=".6"/><path d="M12 13.5s-4-2.2-4-5a2.3 2.3 0 0 1 4-1.5A2.3 2.3 0 0 1 16 8.5c0 2.8-4 5-4 5Z" fill="#ef5bb5"/></svg>',
    cloudDecor: '<svg viewBox="0 0 32 20"><g fill="#fff" stroke="#ded6f5" stroke-width=".6"><rect x="4" y="8" width="8" height="8"/><rect x="10" y="4" width="8" height="12"/><rect x="16" y="8" width="8" height="8"/><rect x="0" y="12" width="32" height="4"/></g></svg>',
    blockDecor: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="#ffcf3f" stroke="#c98a00" stroke-width="1.4"/><text x="12" y="17" font-family="monospace" font-weight="900" font-size="13" fill="#8a5c00" text-anchor="middle">?</text></svg>',
    coinDecor: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#ffd23f" stroke="#c79600" stroke-width="1.4"/><circle cx="12" cy="12" r="5.4" fill="none" stroke="#c79600" stroke-width="1.1"/></svg>',
    checkerDecor: '<svg viewBox="0 0 40 40"><g fill="#8b5cf6"><rect x="0" y="0" width="8" height="8"/><rect x="16" y="0" width="8" height="8"/><rect x="8" y="8" width="8" height="8"/><rect x="24" y="8" width="8" height="8"/><rect x="0" y="16" width="8" height="8"/><rect x="16" y="16" width="8" height="8"/><rect x="8" y="24" width="8" height="8"/><rect x="24" y="24" width="8" height="8"/></g></svg>',
    pixelGuyDecor: '<svg viewBox="0 0 24 32"><rect x="6" y="0" width="12" height="8" fill="#5a3b22"/><rect x="6" y="8" width="12" height="8" fill="#f4c299"/><rect x="4" y="16" width="16" height="12" fill="#3971f6"/><rect x="4" y="28" width="6" height="4" fill="#2a2a33"/><rect x="14" y="28" width="6" height="4" fill="#2a2a33"/></svg>'
  };

  const projects = [
    {
      id: 'aether', category: 'Indie Games', tone: 'purple', likes: 143,
      title: 'Aether — A Hand-Drawn 2D Adventure from Assam',
      desc: 'A story-driven puzzle-adventure about a girl restoring a fractured world.',
      story: 'A hand-painted 2D adventure blending Assamese folk art with puzzle-driven exploration.',
      quote: 'Every background in Aether is hand-painted first, then animated frame by frame. We wanted the world to feel like a living folk tale, not a generic pixel forest.',
      creator: 'Ananya Das', creatorKey: 'ananya-das', avatar: null,
      raised: 245000, goal: 500000, backers: 143, days: 24, image: 'assets/gaming.jpg',
      accountAge: 210, previousProjects: 3, deliveries: 3, lastUpdate: '2026-07-30'
    },
    {
      id: 'synthwave', category: 'Music', tone: 'pink', likes: 87,
      title: 'Synthwave Mumbai — An Original Soundtrack Album',
      desc: '12-track retro-futurist album blending synthwave with classical Indian textures.',
      story: 'A 12-track concept album recorded across three studios in Mumbai over eight months.',
      quote: 'I wanted synthwave that actually sounds like it grew up on a diet of Bollywood strings, not just another neon-city pastiche.',
      creator: 'Rohan Mehta', creatorKey: 'rohan-mehta', avatar: null,
      raised: 118000, goal: 150000, backers: 87, days: 16, image: null,
      accountAge: 150, previousProjects: 2, deliveries: 2, lastUpdate: '2026-08-01'
    },
    {
      id: 'hampi-vr', category: 'Animation', tone: 'pink', likes: 312,
      title: 'VR Heritage Walk — Hampi in 3D',
      desc: 'An immersive VR experience recreating the ruins of Hampi for students and travellers.',
      story: 'A VR experience reconstructing 15th-century Hampi using photogrammetry.',
      quote: 'Hampi deserves to be experienced by everyone, not just those who can travel. This VR build recreates the ruins in stunning 3D.',
      creator: 'Vikram Rao', creatorKey: 'vikram-rao', avatar: null,
      raised: 760000, goal: 1200000, backers: 312, days: 53, image: 'assets/office.jpg',
      accountAge: 380, previousProjects: 4, deliveries: 4, lastUpdate: '2026-08-08'
    },
    {
      id: 'solar-sentinel', category: 'Technology', tone: 'blue', likes: 261,
      title: 'Solar Sentinel — Open-Source IoT Weather Station',
      desc: 'Affordable, solar-powered weather stations designed for Indian farmers.',
      story: 'An open-hardware weather station built to survive monsoon fields at a fraction of import cost.',
      quote: 'Commercial weather stations cost more than most smallholder farmers earn in a season. Solar Sentinel is fully open-source, repairable, and built from parts available in any local hardware market.',
      creator: 'Karthik Iyer', creatorKey: 'karthik-iyer', avatar: null,
      raised: 534000, goal: 800000, backers: 261, days: 42, image: 'assets/solar.jpg',
      accountAge: 410, previousProjects: 5, deliveries: 5, lastUpdate: '2026-08-05'
    }
  ];

  const creators = [
    {key:'ananya-das', name:'Ananya Das', handle:'@ananyadas', role:'2D Game Artist & Indie Developer', location:'Guwahati, Assam', projects:2, followers:'4,820', avatar:null, rating:'4.9', orders:38},
    {key:'rohan-mehta', name:'Rohan Mehta', handle:'@rohansynth', role:'Music Producer · Synthwave & Classical', location:'Mumbai, Maharashtra', projects:1, followers:'3,100', avatar:null, rating:'4.8', orders:25},
    {key:'karthik-iyer', name:'Karthik Iyer', handle:'@karthikbuilds', role:'Hardware Hacker · IoT & Embedded', location:'Coimbatore, Tamil Nadu', projects:3, followers:'6,240', avatar:null, rating:'4.9', orders:44},
    {key:'vikram-rao', name:'Vikram Rao', handle:'@vikramvr', role:'3D Artist · VR & Photogrammetry', location:'Bengaluru, Karnataka', projects:2, followers:'5,460', avatar:null, rating:'5.0', orders:31},
    {key:'priya-sharma', name:'Priya Sharma', handle:'@priyabuilds', role:'Indie App Developer · EdTech', location:'Pune, Maharashtra', projects:4, followers:'3,780', avatar:null, rating:'4.8', orders:18},
    {key:'meera-nair', name:'Meera Nair', handle:'@meeradraws', role:'Illustrator · Watercolor & Comics', location:'Kochi, Kerala', projects:2, followers:'7,120', avatar:null, rating:'4.9', orders:29}
  ];

  const services = [
    {key:'unity-game-development', title:'Unity Game Development — 2D & 3D', creator:'Ananya Das', creatorKey:'ananya-das', avatar:null, image:'assets/service-game.jpg', price:1500, rating:'4.9', days:7, location:'Guwahati, Assam', category:'Programming', desc:'Full-stack Unity development for 2D and 3D games. C# scripting, level design, optimization and polish. Includes source code.', tags:['Unity','C#','2D Games','3D Games','Game Design']},
    {key:'3d-character-modeling', title:'3D Character Modeling & Rigging', creator:'Vikram Rao', creatorKey:'vikram-rao', avatar:null, image:null, price:2500, rating:'5.0', days:10, location:'Bengaluru, Karnataka', category:'3D & Animation', desc:'Production-ready stylized and realistic 3D characters with clean topology, UVs and rigging.', tags:['Blender','Rigging','Character Art','3D']},
    {key:'trailer-editing', title:'Game Trailer Editing & Sound Design', creator:'Rohan Mehta', creatorKey:'rohan-mehta', avatar:null, image:'assets/gaming.jpg', price:2000, rating:'4.8', days:5, location:'Mumbai, Maharashtra', category:'Video & Audio', desc:'Punchy trailers, gameplay edits, sound design and final mix for indie game launches.', tags:['Editing','Sound Design','Trailer','Mixing']},
    {key:'vr-prototype', title:'Interactive VR Prototype for Heritage & Education', creator:'Vikram Rao', creatorKey:'vikram-rao', avatar:null, image:'assets/office.jpg', price:4500, rating:'5.0', days:14, location:'Bengaluru, Karnataka', category:'XR', desc:'Rapid VR prototype development for culture, education and interactive exhibitions.', tags:['VR','Unity','3D','Prototype']}
  ];

  // ---------------------------------------------------------------------
  // PHASE 3 DEMO DATA — Freelance job board (client-posted work, separate
  // from the existing seller-style `services` listings) and per-project
  // funding structure (reward tiers, roadmap, updates, risks, team).
  // All labelled as prototype/demo content per the product spec.
  // ---------------------------------------------------------------------

  const freelanceJobs = [
    {id:'unity-programmer-rpg', title:'Unity Programmer for Turn-Based RPG', category:'Programming', budgetMin:15000, budgetMax:40000, type:'Remote', duration:'2 weeks', skills:['Unity','C#','Turn-Based Combat'], client:'Monsoon Tactics Studio', clientVerified:true, applicants:12, posted:'3 days ago', desc:'Looking for a Unity programmer to help implement a turn-based combat and initiative system for an indie strategy RPG. Existing architecture and design docs are ready to hand over.'},
    {id:'3d-environment-artist', title:'3D Environment Artist — Sci-Fi Corridor Set', category:'3D Art', budgetMin:20000, budgetMax:50000, type:'Remote', duration:'3 weeks', skills:['Blender','Substance Painter','Hard Surface'], client:'PixelForge Studio', clientVerified:true, applicants:8, posted:'1 day ago', desc:'Need a modular sci-fi corridor kit — walls, doors, props — built for a horror prototype. Unity URP, optimized for real-time.'},
    {id:'game-ui-designer', title:'Game UI Designer — Mobile Racing HUD', category:'UI/UX', budgetMin:10000, budgetMax:25000, type:'Remote', duration:'10 days', skills:['Figma','UI Design','Mobile'], client:'DevX Collective', clientVerified:true, applicants:19, posted:'5 days ago', desc:'Design a clean in-race HUD and results screen for a mobile racing game. Reference styles and brand colours will be shared.'},
    {id:'2d-character-animator', title:'2D Character Animator for Visual Novel', category:'Animation', budgetMin:12000, budgetMax:30000, type:'Remote', duration:'2 weeks', skills:['2D Animation','Character Design'], client:'Meera Nair', clientVerified:true, applicants:6, posted:'6 hours ago', desc:'Animate idle and expression states for six visual-novel characters from existing sprite sheets. Ren\'Py experience a plus.'},
    {id:'composer-boss-theme', title:'Composer for Boss Battle Theme', category:'Music & Audio', budgetMin:8000, budgetMax:18000, type:'Remote', duration:'1 week', skills:['Composition','Orchestral','Mixing'], client:'PixelForge Studio', clientVerified:true, applicants:15, posted:'2 days ago', desc:'Need a 2–3 minute looping boss-battle track — orchestral with an electronic edge. Stems required for adaptive mixing.'},
    {id:'narrative-writer-quests', title:'Narrative Writer for Side Quests', category:'Writing', budgetMin:9000, budgetMax:22000, type:'Remote', duration:'3 weeks', skills:['Game Writing','Dialogue','Worldbuilding'], client:'Aether Team', clientVerified:false, applicants:4, posted:'1 week ago', desc:'Write dialogue and branching text for 8–10 optional side quests set in the world of Aether. Style guide provided.'},
    {id:'qa-tester-mobile', title:'QA Tester — Mobile Racing Game', category:'QA', budgetMin:6000, budgetMax:15000, type:'Remote', duration:'1 week', skills:['QA Testing','Bug Reporting','Android'], client:'DevX Collective', clientVerified:true, applicants:22, posted:'4 days ago', desc:'Structured playtesting pass across mid-range Android devices ahead of a store submission. Bug tracker access provided.'},
    {id:'vfx-artist-spell-effects', title:'VFX Artist — Spell & Ability Effects', category:'VFX', budgetMin:14000, budgetMax:32000, type:'Remote', duration:'2 weeks', skills:['Unity Shader Graph','VFX Graph','Particles'], client:'Karthik Iyer', clientVerified:true, applicants:9, posted:'12 hours ago', desc:'Build a set of 6 spell/ability VFX (fire, ice, lightning, heal, buff, debuff) using Unity VFX Graph and Shader Graph.'},
    {id:'2d-background-artist', title:'2D Background Artist — Folk-Art Style', category:'2D Art', budgetMin:11000, budgetMax:26000, type:'Remote', duration:'2 weeks', skills:['Procreate','Background Art','Hand-painted'], client:'Ananya Das', clientVerified:true, applicants:7, posted:'8 hours ago', desc:'Paint 4 additional background scenes in the existing hand-painted folk-art style for a 2D adventure game.'}
  ];

  // Extends `projects` with full funding-page structure — reward tiers,
  // roadmap milestones, updates and disclosed risks. Demo data only.
  const projectExtras = {
    aether: {
      rewards: [
        {amount:500, title:'Backer', desc:'Your name in the credits and early devlog access.', delivery:'Dec 2026', claimed:62},
        {amount:1500, title:'Digital Deluxe', desc:'Full game on release, digital artbook and OST.', delivery:'Jan 2027', claimed:54},
        {amount:5000, title:'Founding Patron', desc:'Everything above, plus a custom in-game NPC named after you.', delivery:'Jan 2027', claimed:11}
      ],
      roadmap: [
        {title:'Prototype & core mechanics', date:'Completed · Mar 2026', done:true},
        {title:'Chapter 1 art & levels', date:'Completed · Jun 2026', done:true},
        {title:'Chapter 2–3 production', date:'In progress · Target Nov 2026', done:false},
        {title:'Full playtest & polish', date:'Target Jan 2027', done:false},
        {title:'Launch on PC & mobile', date:'Target Mar 2027', done:false}
      ],
      updates: [
        {title:'Chapter 2 backgrounds are done', date:'Jul 30, 2026', body:'All hand-painted backgrounds for Chapter 2 are locked. Moving into animation and lighting passes next.'},
        {title:'Hit 100 backers!', date:'Jul 12, 2026', body:'Thank you for getting Aether to 100 backers — a devlog with a full puzzle-design breakdown is coming next week.'}
      ],
      risks: 'Aether is being built by a single artist-developer alongside freelance commissions, so the production schedule can shift if paid work takes priority in a given month. The core engine and Chapter 1 are already complete and playable, which reduces technical risk. Remaining risk is mainly around animation and audio production time for Chapters 2–3.',
      team: [
        {name:'Ananya Das', role:'Art, design & programming'},
        {name:'Freelance sound designer', role:'Contracted for final mix'}
      ]
    },
    synthwave: {
      rewards: [
        {amount:300, title:'Digital Album', desc:'DRM-free download of all 12 tracks on release.', delivery:'Oct 2026', claimed:41},
        {amount:900, title:'Vinyl Pre-order', desc:'Limited-run vinyl pressing plus the digital album.', delivery:'Dec 2026', claimed:29},
        {amount:2500, title:'Studio Session', desc:'A recorded video call walking through how one track was made.', delivery:'Nov 2026', claimed:6}
      ],
      roadmap: [
        {title:'Writing & pre-production', date:'Completed · Feb 2026', done:true},
        {title:'Studio recording (8 of 12 tracks)', date:'In progress · Target Sep 2026', done:false},
        {title:'Mixing & mastering', date:'Target Oct 2026', done:false},
        {title:'Vinyl pressing & release', date:'Target Dec 2026', done:false}
      ],
      updates: [
        {title:'Track 7 recording wrapped', date:'Aug 1, 2026', body:'Strings for track 7 were recorded with a 6-piece ensemble in Mumbai this week — sounds huge.'},
        {title:'Vinyl pressing plant confirmed', date:'Jul 18, 2026', body:'Locked in a pressing slot for December. Backers who chose the vinyl tier will get tracking numbers closer to ship date.'}
      ],
      risks: 'Studio time is booked incrementally as funds come in, so the recording schedule for the remaining four tracks depends on continued backing. Vinyl pressing plants can also run behind their quoted timelines industry-wide, which may push the physical reward past the estimated delivery date. Digital rewards are not affected by pressing delays.',
      team: [
        {name:'Rohan Mehta', role:'Production, composition & mixing'},
        {name:'Session string ensemble', role:'Contracted, Mumbai'}
      ]
    },
    'hampi-vr': {
      rewards: [
        {amount:750, title:'Explorer', desc:'Early access build and your name on the in-experience credits wall.', delivery:'Sep 2026', claimed:118},
        {amount:2000, title:'Heritage Supporter', desc:'Everything above, plus a signed photogrammetry print of Hampi.', delivery:'Oct 2026', claimed:88},
        {amount:8000, title:'Education Partner', desc:'A free classroom license for one school of your choice.', delivery:'Nov 2026', claimed:22}
      ],
      roadmap: [
        {title:'Photogrammetry capture on-site', date:'Completed · Jan 2026', done:true},
        {title:'3D reconstruction & optimization', date:'Completed · May 2026', done:true},
        {title:'VR interaction & guided tour', date:'Completed · Jul 2026', done:true},
        {title:'School pilot rollout', date:'In progress · Target Sep 2026', done:false},
        {title:'Public release on VR platforms', date:'Target Nov 2026', done:false}
      ],
      updates: [
        {title:'Live in 3 schools now', date:'Aug 8, 2026', body:'The Hampi VR Walk is now being used in three schools across Karnataka as part of a heritage-education pilot.'},
        {title:'Guided tour mode added', date:'Jul 20, 2026', body:'Added a narrated guided-tour mode alongside free exploration, based on feedback from the first school pilot.'}
      ],
      risks: 'The core photogrammetry capture and reconstruction work — historically the highest-risk part of a project like this — is already complete and in active use by schools. Remaining risk is mostly around VR headset compatibility across devices and coordinating rollout logistics with individual schools, not core technical delivery.',
      team: [
        {name:'Vikram Rao', role:'3D reconstruction, XR development'},
        {name:'Heritage Trust Karnataka', role:'Site access & education partner'}
      ]
    },
    'solar-sentinel': {
      rewards: [
        {amount:1000, title:'Open Source Supporter', desc:'Your name in the hardware repo credits and build updates.', delivery:'Ongoing', claimed:96},
        {amount:6000, title:'DIY Kit', desc:'One full weather-station component kit shipped to you.', delivery:'Oct 2026', claimed:71},
        {amount:15000, title:'Farm Pilot Unit', desc:'One fully assembled unit installed and calibrated for your field.', delivery:'Nov 2026', claimed:19}
      ],
      roadmap: [
        {title:'Hardware design & schematics', date:'Completed · Jan 2026', done:true},
        {title:'Field pilot (12 units, AP)', date:'Completed · Jun 2026', done:true},
        {title:'Design revision after monsoon testing', date:'Completed · Aug 2026', done:true},
        {title:'Batch manufacturing for kits', date:'In progress · Target Oct 2026', done:false},
        {title:'Open-source documentation release', date:'Target Nov 2026', done:false}
      ],
      updates: [
        {title:'Survived the first monsoon', date:'Aug 5, 2026', body:'All 12 pilot units in Andhra Pradesh made it through peak monsoon without a single hardware failure.'},
        {title:'Design revision after field data', date:'Jul 22, 2026', body:'Updated the enclosure seal design based on field data — this revision ships in all kit rewards.'}
      ],
      risks: 'The pilot units have already been field-tested through a full monsoon season, which validates the core hardware design. Remaining risk is primarily around sourcing enough solar components at stable pricing for batch manufacturing, and shipping logistics to rural addresses, which can extend delivery timelines for the DIY Kit and Farm Pilot Unit rewards.',
      team: [
        {name:'Karthik Iyer', role:'Hardware design & firmware'},
        {name:'Farm Collective AP', role:'Field pilot & testing partner'}
      ]
    }
  };

  const stories = [
    {quote:'I raised ₹2.45L for my 2D adventure on DevFund India. The UPI flow meant my first backer paid in under a minute. Within a week I had 143 backers and the funds to finish my game.', creator:'Ananya Das', role:'Indie Game Developer · Guwahati', avatar:null},
    {quote:'I listed IoT weather stations as a project and freelancing as a service. The freelance orders funded my R&D while the campaign funded production. The reviews built my reputation fast.', creator:'Karthik Iyer', role:'Hardware Hacker · Coimbatore', avatar:null},
    {quote:'As a first-time creator, the Project Trust panel actually helped me. Backers could see I was new — and still chose to support my comic because the risks were honestly stated.', creator:'Meera Nair', role:'Illustrator · Kochi', avatar:null}
  ];

  const creatorExtras = {
    'ananya-das': {
      bio: 'Self-taught 2D artist and Unity developer from Guwahati. Ananya blends Assamese folk art with hand-painted worlds — every background is painted first, then animated frame by frame.',
      skills: ['Unity','C#','2D Animation','Photoshop','Game Design','Procreate'],
      social: [['Portfolio','#'],['Twitter / X','#'],['YouTube','#'],['Discord','#']]
    },
    'rohan-mehta': {
      bio: 'Music producer and sound designer based in Mumbai, recording original soundtracks that blend synthwave textures with classical Indian strings for games and film.',
      skills: ['Ableton Live','Sound Design','Mixing & Mastering','Foley','Trailer Scoring'],
      social: [['SoundCloud','#'],['Spotify','#'],['Instagram','#'],['Discord','#']]
    },
    'karthik-iyer': {
      bio: 'Hardware hacker and embedded-systems engineer in Coimbatore, building affordable open-source IoT devices for real-world problems like agriculture and climate monitoring.',
      skills: ['Embedded C','KiCad','IoT','Solar Electronics','3D Printing','Rust'],
      social: [['GitHub','#'],['Hackaday','#'],['LinkedIn','#'],['YouTube','#']]
    },
    'vikram-rao': {
      bio: '3D artist and XR developer in Bengaluru, reconstructing real-world heritage sites and characters using photogrammetry and real-time engines for immersive VR experiences.',
      skills: ['Unity','Blender','Photogrammetry','VR / XR','Rigging','Substance Painter'],
      social: [['ArtStation','#'],['LinkedIn','#'],['YouTube','#'],['Sketchfab','#']]
    },
    'priya-sharma': {
      bio: 'Indie app developer in Pune building playful EdTech tools for Indian classrooms — designed to run well even on low-end Android devices and patchy connections.',
      skills: ['Flutter','Kotlin','Firebase','UI/UX Design','EdTech'],
      social: [['GitHub','#'],['LinkedIn','#'],['Portfolio','#'],['Twitter / X','#']]
    },
    'meera-nair': {
      bio: "Illustrator and comic artist in Kochi, painting watercolor worlds and serialized comics inspired by Kerala's coastline, folklore and everyday life.",
      skills: ['Watercolor','Procreate','Comic Layout','Character Design','Storyboarding'],
      social: [['Instagram','#'],['ArtStation','#'],['Webtoon','#'],['Patreon','#']]
    }
  };

  const creatorTestimonials = {
    'ananya-das': [
      {name:'Aditya K.', role:'Backer', quote:'Backed Aether on day one — the art style alone was worth funding. Updates come regularly and this clearly is a labour of love.'},
      {name:'Priyanka R.', role:'Freelance client', quote:'Hired Ananya for a Unity job. Clean code, delivered early, and every decision was explained clearly.'}
    ],
    'rohan-mehta': [
      {name:'Sana W.', role:'Backer', quote:'The Mumbai synthwave album is unlike anything else funded here — genuinely original, not a generic neon-city knockoff.'},
      {name:'Studio Retro', role:'Freelance client', quote:'Rohan scored our launch trailer in five days flat. Mix quality was broadcast-ready on the first pass.'}
    ],
    'karthik-iyer': [
      {name:'Farm Collective AP', role:'Buyer', quote:'Ordered 12 Solar Sentinel units for a pilot. They survived the first monsoon without a single failure.'},
      {name:'Divya N.', role:'Backer', quote:'Open hardware, real documentation, real delivery. Exactly the kind of project worth funding.'}
    ],
    'vikram-rao': [
      {name:'Heritage Trust Karnataka', role:'Buyer', quote:'The Hampi VR walk is being used in three schools now. Students who can never visit can finally experience it.'},
      {name:'Nikhil J.', role:'Backer', quote:'Backed for the tech demo, stayed for how fast Vikram ships updates. Photogrammetry work is top tier.'}
    ],
    'priya-sharma': [
      {name:'Govt. School, Pune', role:'Buyer', quote:'The app works fine even on our oldest classroom tablets — that alone made it worth adopting.'},
      {name:'Rahul M.', role:'Freelance client', quote:'Priya turned our messy spec into a working prototype in under two weeks.'}
    ],
    'meera-nair': [
      {name:'Anjali S.', role:'Backer', quote:"Meera's watercolor comics feel like nothing else on the platform. Backed her Patreon the same day I found her page."},
      {name:'Coastal Press', role:'Freelance client', quote:'Delivered a full 12-page comic on schedule with zero revisions needed.'}
    ]
  };

  const faqs = [
    ['Is backing a project an investment?','No. DevFund India is designed around reward-based crowdfunding or voluntary support. Backers support creators and may receive stated rewards; backing is not equity or a guarantee of financial returns.'],
    ['How do payments work?','The production implementation should connect UPI, cards, net banking and wallets through a regulated payment provider. The interface is already designed to explain each transaction clearly.'],
    ['How does verification work?','Creators can earn separate Email, Phone, Identity and Payment Verified badges. The UI keeps each signal explicit so a single badge never implies more than was actually checked.'],
    ['What fees does DevFund India charge?','This prototype intentionally does not hard-code a commercial fee. Add your approved platform fee, payment-processing fee and tax treatment in the production pricing policy.'],
    ["What if a project doesn't deliver?",'Project risk is disclosed before backing. Production should include reporting, creator updates, dispute handling and refund rules aligned with the payment flow and your legal terms.'],
    ['Can I be both a creator and a backer?','Yes. The product is designed around a creator ecosystem where the same account can discover, support, hire and publish work.']
  ];

  // ---------------------------------------------------------------------
  // PHASE 1 DEMO DATA — Games, Creator Market, Talent categories,
  // Assets, Game Jams, Community activity. All labelled as prototype/demo
  // content per the product spec (no fabricated real social proof).
  // ---------------------------------------------------------------------

  const games = [
    {id:'project-nightfall', title:'Project Nightfall', dev:'PixelForge Studio', devKey:'ananya-das', genre:'Horror', engine:'Unity', platform:'PC', status:'Prototype', followers:412, image:'assets/gaming.jpg', tags:['Horror','Atmospheric','Unity']},
    {id:'aether', title:'Aether', dev:'Ananya Das', devKey:'ananya-das', genre:'Adventure', engine:'Unity', platform:'PC · Mobile', status:'In Development', followers:1840, image:'assets/gaming.jpg', tags:['2D','Puzzle','Hand-drawn']},
    {id:'solar-drift', title:'Solar Drift', dev:'Karthik Iyer', devKey:'karthik-iyer', genre:'Sim', engine:'Godot', platform:'PC', status:'Idea', followers:96, image:'assets/solar.jpg', tags:['Sim','Sci-fi']},
    {id:'hampi-walk', title:'Hampi VR Walk', dev:'Vikram Rao', devKey:'vikram-rao', genre:'Exploration', engine:'Unreal', platform:'VR', status:'Playable', followers:733, image:'assets/office.jpg', tags:['VR','Heritage','Photogrammetry']},
    {id:'synth-runner', title:'Synth Runner Mumbai', dev:'Rohan Mehta', devKey:'rohan-mehta', genre:'Rhythm', engine:'Unity', platform:'PC · Console', status:'Early Access', followers:255, image:null, tags:['Rhythm','Music','Arcade']},
    {id:'coastal-comics', title:'Coastal Comics: Origins', dev:'Meera Nair', devKey:'meera-nair', genre:'Visual Novel', engine:'Ren\'Py', platform:'PC · Mobile', status:'In Development', followers:188, image:null, tags:['Narrative','Art','Comics']},
    {id:'kochi-kart', title:'Kochi Kart Rush', dev:'DevX Collective', devKey:'priya-sharma', genre:'Racing', engine:'Unity', platform:'Mobile', status:'Released', followers:2100, image:null, tags:['Racing','Casual']},
    {id:'monsoon-tactics', title:'Monsoon Tactics', dev:'Priya Sharma', devKey:'priya-sharma', genre:'Strategy', engine:'Unity', platform:'PC', status:'Prototype', followers:340, image:null, tags:['Tactics','Turn-based']}
  ];

  const talentCategories = [
    ['Programmers', icons.code], ['3D Artists', icons.gemDecor], ['2D Artists', icons.sparkle],
    ['Animators', icons.controller], ['Music & Audio', icons.mail], ['Game Designers', icons.rocket],
    ['Writers', icons.message], ['VFX', icons.starDecor], ['UI/UX', icons.badge], ['QA', icons.shield]
  ];

  const marketplaceAssets = [
    {id:'medieval-village', title:'Medieval Village Pack', creator:'Vikram Rao', category:'Environments', engine:'Unity · URP', formats:'FBX · PNG', price:499, rating:'4.8', reviews:124, image:'assets/office.jpg'},
    {id:'cyberpunk-city', title:'Cyberpunk City Pack', creator:'Ananya Das', category:'Environments', engine:'Unreal', formats:'FBX · TGA', price:1299, rating:'4.9', reviews:88, image:'assets/gaming.jpg', auction:true, currentBid:1240, bids:14, timeLeft:'02:41:18'},
    {id:'stylized-characters', title:'Stylized Character Bundle', creator:'Meera Nair', category:'Characters', engine:'Unity · Blender', formats:'FBX · PSD', price:899, rating:'4.7', reviews:61, image:null},
    {id:'sfx-toolkit', title:'Indie SFX Toolkit Vol. 2', creator:'Rohan Mehta', category:'Audio', engine:'Engine-agnostic', formats:'WAV', price:349, rating:'4.9', reviews:203, image:null},
    {id:'procedural-shader-pack', title:'Procedural Terrain Shaders', creator:'Karthik Iyer', category:'Shaders', engine:'Unity · URP', formats:'ShaderGraph', price:599, rating:'4.6', reviews:37, image:null},
    {id:'ui-kit-neon', title:'Neon Arcade UI Kit', creator:'Priya Sharma', category:'UI', engine:'Engine-agnostic', formats:'Figma · PNG', price:299, rating:'4.8', reviews:95, image:null},
    {id:'prop-pack-scifi', title:'Sci-Fi Prop Pack', creator:'Vikram Rao', category:'Props', engine:'Unity · Unreal', formats:'FBX', price:749, rating:'4.7', reviews:52, image:null},
    {id:'combat-anim-pack', title:'Combat Animation Pack', creator:'Ananya Das', category:'Animation', engine:'Unity · Mixamo rig', formats:'FBX', price:649, rating:'4.8', reviews:70, image:null}
  ];

  const gameJams = [
    {id:'monsoon-jam-2026', name:'Monsoon Game Jam 2026', theme:'Rebirth', status:'Active', deadline:'Aug 24, 2026', participants:214, submissions:38},
    {id:'48hr-indie-sprint', name:'48-Hour Indie Sprint', theme:'One Button', status:'Upcoming', deadline:'Sep 6, 2026', participants:0, submissions:0},
    {id:'diwali-jam', name:'Diwali Lights Jam', theme:'Festival of Light', status:'Upcoming', deadline:'Oct 18, 2026', participants:0, submissions:0},
    {id:'summer-jam-2026', name:'Summer Prototype Jam', theme:'Small Worlds', status:'Completed', deadline:'Jun 30, 2026', participants:301, submissions:112}
  ];

  const communityActivity = [
    {actor:'ArjunDev', action:'published a new devlog for', target:'Project Nightfall', type:'Devlog', time:'2h ago'},
    {actor:'PixelForge', action:'uploaded a new asset:', target:'Medieval Village Pack', type:'Asset', time:'4h ago'},
    {actor:'Ananya Das', action:'joined the game jam', target:'Monsoon Game Jam 2026', type:'Game Jam', time:'6h ago'},
    {actor:'Rohan Mehta', action:'is looking for a', target:'Unity programmer', type:'Job', time:'9h ago'},
    {actor:'Meera Nair', action:'shared a showcase for', target:'Coastal Comics: Origins', type:'Showcase', time:'1d ago'},
    {actor:'Karthik Iyer', action:'hit a funding milestone on', target:'Solar Sentinel', type:'Funding', time:'1d ago'}
  ];

  // Extends `creators` with Creator Market fields — trust score, creator
  // index and a virtual (non-monetary) unit price + demo trend.
  const creatorMarket = [
    {key:'ananya-das', trust:94, index:82.4, unitPrice:142, change:18.4, spark:[40,52,48,60,55,70,66,80]},
    {key:'vikram-rao', trust:96, index:88.1, unitPrice:171, change:9.2, spark:[60,58,64,62,70,68,75,79]},
    {key:'karthik-iyer', trust:91, index:74.6, unitPrice:118, change:-2.1, spark:[70,66,68,60,62,58,55,57]},
    {key:'rohan-mehta', trust:89, index:69.3, unitPrice:97, change:7.2, spark:[45,48,44,50,55,52,58,60]},
    {key:'priya-sharma', trust:87, index:65.8, unitPrice:88, change:4.5, spark:[38,40,44,42,46,48,50,52]},
    {key:'meera-nair', trust:92, index:78.9, unitPrice:129, change:12.6, spark:[42,46,50,55,58,62,68,72]}
  ];
  const marketByKey = Object.fromEntries(creatorMarket.map(m => [m.key, m]));

  const fmt = value => new Intl.NumberFormat('en-IN').format(value);
  const percent = p => Math.min(100, Math.round((p.raised / p.goal) * 100));

  function avatarMarkup(src, name, cls='avatar-xs') {
    if (src) return `<img class="${cls}" src="${src}" alt="${name}" loading="lazy">`;
    return `<span class="${cls}" aria-hidden="true">${name.charAt(0)}</span>`;
  }

  function verificationBadges() {
    return `
      <span class="badge">${icons.mail} Email Verified</span>
      <span class="badge">${icons.phone} Phone Verified</span>
      <span class="badge">${icons.shield} Identity Verified</span>
      <span class="badge">${icons.badge} Payment Verified</span>`;
  }

  function projectCard(p) {
    const media = p.image
      ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
      : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `
      <article class="project-card glass-card glow-card" data-project="${p.id}">
        <div class="project-media ${p.image ? '' : 'placeholder'}">
          ${media}
          <span class="category-chip media-chip">${p.category}</span>
          <span class="like-chip">${icons.heart}${p.likes}</span>
        </div>
        <div class="project-body">
          <h3>${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="creator-mini">
            ${avatarMarkup(p.avatar,p.creator)}
            <span>${p.creator}</span><span class="verified">Verified</span>
          </div>
          <div class="money-row"><b>₹${fmt(p.raised)} raised</b><span>${percent(p)}% of ₹${fmt(p.goal)}</span></div>
          <div class="progress"><span style="width:${percent(p)}%"></span></div>
          <div class="card-foot"><strong>${p.backers} backers</strong><span>${p.days} days left</span></div>
        </div>
      </article>`;
  }

  function creatorCard(c) {
    return `
      <article class="creator-card glass-card glow-card" data-creator="${c.key}">
        <div class="avatar-lg-wrap">
          ${avatarMarkup(c.avatar,c.name,'avatar-lg')}
          <span class="verified-dot">✓</span>
        </div>
        <h3>${c.name}</h3>
        <div class="creator-handle">${c.handle}</div>
        <p class="creator-role">${c.role}</p>
        <div class="creator-location">⌾ &nbsp;${c.location}</div>
        <div class="creator-meta"><span><span class="star">★</span> ${c.projects} projects</span><span>${c.followers} followers</span></div>
        <div class="badges">${verificationBadges()}</div>
      </article>`;
  }

  function serviceCard(s) {
    const image = s.image ? `<img src="${s.image}" alt="${s.title}" loading="lazy">` : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `
      <article class="service-card glass-card glow-card" data-service="${s.key}">
        <div class="service-media ${s.image ? '' : 'project-media placeholder'}">${image}</div>
        <div class="service-body">
          <h3>${s.title}</h3>
          <div class="creator-mini">${avatarMarkup(s.avatar,s.creator)}<span>${s.creator}</span><span class="verified">Verified</span></div>
          <div class="service-meta"><span>★ ${s.rating}</span><span>◷ ${s.days}d</span><span>⌾ ${s.location}</span></div>
          <div class="price-row"><span>Starting at</span><strong>₹${fmt(s.price)}</strong></div>
        </div>
      </article>`;
  }

  const jobBudget = j => `₹${fmt(j.budgetMin)}–₹${fmt(j.budgetMax)}`;

  function jobCard(j) {
    return `
      <article class="job-card flat-card" data-job="${j.id}">
        <div class="job-card-top"><h3>${j.title}</h3><span class="job-budget">${jobBudget(j)}</span></div>
        <div class="meta-chips"><span class="meta-chip">${j.category}</span><span class="meta-chip tone-cyan">${j.type}</span><span class="meta-chip tone-amber">${j.duration}</span></div>
        <p class="job-desc">${j.desc}</p>
        <div class="job-skills">${j.skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div>
        <div class="job-foot">
          <span class="job-client">${j.client}${j.clientVerified ? ' <span class="verified">Verified</span>' : ''}</span>
          <span>${j.applicants} applicants · ${j.posted}</span>
        </div>
      </article>`;
  }

  const statusTone = { 'Idea':'', 'Prototype':'tone-amber', 'In Development':'tone-cyan', 'Playable':'tone-cyan', 'Early Access':'tone-green', 'Released':'tone-green' };

  function gameCard(g) {
    const media = g.image
      ? `<img src="${g.image}" alt="${g.title}" loading="lazy">`
      : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `
      <article class="game-card flat-card" data-game="${g.id}">
        <div class="game-media">
          ${media}
          <span class="meta-chip on-dark game-status-chip">${g.status}</span>
        </div>
        <div class="game-body">
          <h3>${g.title}</h3>
          <p class="game-dev">${g.dev}</p>
          <div class="meta-chips">
            <span class="meta-chip ${statusTone[g.status]||''}">${g.genre}</span>
            <span class="meta-chip tone-cyan">${g.engine}</span>
          </div>
          <div class="game-foot"><span>${g.platform}</span><span class="followers">${icons.users} ${fmt(g.followers)}</span></div>
        </div>
      </article>`;
  }

  function risingCreatorCard(c) {
    const m = marketByKey[c.key] || {trust:90, index:70};
    return `
      <article class="rc-card flat-card" data-creator="${c.key}">
        ${avatarMarkup(c.avatar, c.name, 'rc-avatar')}
        <div class="rc-body">
          <h3>${c.name}</h3>
          <p class="rc-role">${c.role}</p>
          <div class="rc-skills">${(creatorExtras[c.key]?.skills||[]).slice(0,3).map(s=>`<span class="rc-skill">${s}</span>`).join('')}</div>
          <div class="rc-stats"><span>Trust: <b>${m.trust}</b></span><span>Index: <b>${m.index}</b></span></div>
        </div>
      </article>`;
  }

  function talentCategoryChip(name, icon) {
    return `<a class="talent-chip flat-card" href="#/freelancers" data-talent="${name}"><span class="ti">${icon}</span><span>${name}</span></a>`;
  }

  function assetCard(a) {
    const media = a.image ? `<img src="${a.image}" alt="${a.title}" loading="lazy">` : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    const priceBlock = a.auction
      ? `<span class="asset-price">${fmt(a.currentBid)} CC</span><span class="muted" style="font-size:11px">${a.bids} bids</span>`
      : `<span class="asset-price">₹${fmt(a.price)}</span>`;
    return `
      <article class="asset-card flat-card" data-asset="${a.id}">
        <div class="asset-media">${media}${a.auction ? `<span class="meta-chip tone-amber" style="position:absolute;left:9px;top:9px">Auction</span>`:''}</div>
        <div class="asset-body">
          <h4>${a.title}</h4>
          <div class="asset-rating"><span>★ <b>${a.rating}</b></span><span>${a.reviews} reviews</span></div>
          <div class="meta-chips" style="margin-bottom:9px"><span class="meta-chip">${a.engine}</span></div>
          <div class="asset-price-row">${priceBlock}</div>
        </div>
      </article>`;
  }

  function activeProjectCard(p) {
    const media = p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `
      <article class="aproj-card flat-card" data-project="${p.id}">
        <div class="aproj-media">${media}</div>
        <div class="aproj-body">
          <h4>${p.title.split(' — ')[0]}</h4>
          <p class="aproj-dev">${p.creator} · ${p.category}</p>
          <div class="aproj-progress"><span style="width:${percent(p)}%"></span></div>
          <div class="aproj-meta-row"><b>${percent(p)}% funded</b><span>${p.days}d left</span></div>
        </div>
      </article>`;
  }

  function marketCardMini(c) {
    const m = marketByKey[c.key];
    if (!m) return '';
    const up = m.change >= 0;
    const max = Math.max(...m.spark);
    return `
      <article class="market-card" data-market="${c.key}">
        <div class="market-card-top">
          ${avatarMarkup(c.avatar, c.name, 'market-avatar')}
          <div><p class="market-name">${c.name}</p><p class="market-index">Creator Index: ${m.index}</p></div>
        </div>
        <div class="market-price-row">
          <span class="market-price">${m.unitPrice} CC</span>
          <span class="market-change ${up?'up':'down'}">${up?'+':''}${m.change}%</span>
        </div>
        <div class="market-spark" aria-hidden="true">${m.spark.map(v=>`<span style="height:${Math.round(v/max*100)}%"></span>`).join('')}</div>
      </article>`;
  }

  function jamCard(j) {
    const tone = j.status === 'Active' ? 'tone-green' : j.status === 'Upcoming' ? 'tone-cyan' : '';
    return `
      <article class="jam-card flat-card" data-jam="${j.id}">
        <div class="jam-status-row"><h4>${j.name}</h4><span class="meta-chip ${tone}">${j.status}</span></div>
        <p class="jam-theme">Theme: ${j.theme} · Deadline ${j.deadline}</p>
        <div class="jam-stats"><span><b>${j.participants}</b>Participants</span><span><b>${j.submissions}</b>Submissions</span></div>
      </article>`;
  }

  function activityFeedItem(a) {
    return `
      <div class="activity-item">
        <span class="activity-avatar" aria-hidden="true">${a.actor.charAt(0)}</span>
        <div class="activity-body">
          <p><b>${a.actor}</b> ${a.action} <b>${a.target}</b><span class="activity-type-tag">${a.type}</span></p>
          <span class="activity-time">${a.time}</span>
        </div>
      </div>`;
  }

  function sectionDecor(pos, size, icon) {
    return `<span class="section-decor ${pos} ${size}" aria-hidden="true">${icon}</span>`;
  }

  function pixelField() {
    const colors = ['#f6b51f','#ef5bb5','#9d62ff','#06b981','#3971f6','#ff8a5c'];
    const dots = [
      [3,6,10],[7,14,8],[93,10,9],[96,22,11],[2,30,7],[95,38,8],[4,46,9],[92,52,10],
      [6,60,8],[94,66,9],[3,74,10],[96,80,7],[5,88,9],[93,92,8],[8,20,6],[90,4,7]
    ];
    return `<div class="pixel-field" aria-hidden="true">${dots.map((d,i)=>`<span style="left:${d[0]}%;top:${d[1]}%;width:${d[2]}px;height:${d[2]}px;background:${colors[i%colors.length]};animation-delay:-${(i*0.4).toFixed(1)}s"></span>`).join('')}</div>`;
  }

  function sectionHead(title, subtitle, linkText = '', linkHref = '#/') {
    return `<div class="section-head"><div><h2>${title}</h2><p>${subtitle}</p></div>${linkText ? `<a class="text-link" href="${linkHref}">${linkText} <span>→</span></a>` : ''}</div>`;
  }

  function homeView() {
    return `
      <div class="page-shell">
        <section class="hero">
          <div class="hero-grid">
            <div class="hero-copy">
              <span class="pill">${icons.sparkle} India's indie game-dev hub · prototype</span>
              <h1>Build Games. <span class="gradient-text">Find Your People.</span></h1>
              <p class="hero-sub">India's indie game hub for developers, artists, freelancers, studios and creators.</p>
              <div class="hero-actions">
                <a class="btn btn-primary magnetic" href="#/explore">Explore Creators <span>→</span></a>
                <a class="btn btn-ghost magnetic" href="#/games">Showcase Your Game</a>
                <button class="btn btn-ghost magnetic" type="button" data-start-project>Start a Project</button>
              </div>
              <p class="demo-note">Demo data shown throughout — connect real accounts, projects and transactions in production.</p>
            </div>
            <div class="hero-visual">
              <div class="hero-feature">
                <img src="assets/gaming.jpg" alt="Indie game in development" fetchpriority="high">
                <div class="hero-feature-content">
                  <span class="category-chip">Indie Games</span>
                  <h3>Aether — A Hand-Drawn 2D Adventure</h3>
                  <p>by Ananya Das · Guwahati, Assam · Unity</p>
                  <div class="progress-row"><span>In Development</span><span>1,840 followers</span></div>
                </div>
              </div>
              <div class="floating-verify" aria-label="Identity verified">
                <span class="verify-icon">${icons.shield}</span>
                <span><b>Trust Score 94/100</b><small>Platform reputation, not a guarantee</small></span>
              </div>
            </div>
          </div>
        </section>

        <section class="section section-dark" id="trending-games">
          ${sectionHead('Trending games','Games gaining traction across the DevFund community right now','Browse all games','#/games')}
          <div class="game-grid">${games.slice(0,4).map(gameCard).join('')}</div>
        </section>

        <section class="section" id="rising-creators">
          ${sectionHead('Rising creators','Developers, artists and studios gaining activity','Explore creators','#/explore')}
          <div class="rc-grid">${creators.slice(0,3).map(risingCreatorCard).join('')}</div>
        </section>

        <section class="section" id="find-talent">
          ${sectionHead('Find talent','Hire verified programmers, artists, designers and more','Browse freelance','#/freelancers')}
          <div class="talent-grid">${talentCategories.map(([name,icon])=>talentCategoryChip(name,icon)).join('')}</div>
          <p style="margin-top:16px"><a class="text-link" href="#/jobs">Or browse open jobs posted by studios <span>→</span></a></p>
        </section>

        <section class="section" id="asset-marketplace">
          ${sectionHead('Asset marketplace','3D models, characters, environments, audio, shaders and tools','Browse marketplace','#/assets')}
          <div class="asset-grid">${marketplaceAssets.slice(0,4).map(assetCard).join('')}</div>
        </section>

        <section class="section" id="active-projects">
          ${sectionHead('Active projects','Games currently in development and raising legitimate funding','View all projects','#/projects')}
          <div class="aproj-grid">${projects.map(activeProjectCard).join('')}</div>
        </section>

        <section class="section section-dark" id="creator-market">
          ${sectionHead('Creator Market','A fun, virtual engagement layer — build a portfolio of Creator Units','Open Creator Market','#/market')}
          <div class="market-grid">${creators.slice(0,3).map(marketCardMini).join('')}</div>
          <p class="cc-note">Creator Credits (CC) are free, non-monetary, and cannot be bought, cashed out or converted to INR. The Creator Market is a virtual engagement feature — it is not a stock exchange and does not represent equity or investment.</p>
        </section>

        <section class="section" id="game-jams">
          ${sectionHead('Game jams','Join a themed sprint and ship something with the community','See all jams','#/jams')}
          <div class="jam-grid">${gameJams.slice(0,2).map(jamCard).join('')}</div>
        </section>

        <section class="section" id="community-activity">
          ${sectionHead('Community activity','What Indian indie developers are building right now','View community','#/community')}
          <div class="activity-feed">${communityActivity.map(activityFeedItem).join('')}</div>
        </section>

        <section class="section" id="trust">
          <div class="section-head center"><h2>Trust & verification</h2><p>Where hiring, funding and commerce happen, reputation has to be earned — not assumed</p></div>
          <div class="trust-grid">
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>Trust Score</h3><p>Every creator profile shows a transparent Trust Score built from verifiable activity — not a guarantee of outcomes.</p></div></article>
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>Verified identity, portfolio & history</h3><p>Identity, portfolio, skills, project history and client history can each be verified independently.</p></div></article>
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>Transparent Project Trust panel</h3><p>Every project shows creator account age, previous deliveries, funding progress, and risk disclosure.</p></div></article>
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>Moderated, not anonymous</h3><p>Projects and listings are reviewed. Reports, disputes and suspensions belong to a real moderation workflow.</p></div></article>
          </div>
          <div class="trust-badges">${verificationBadges()}<a class="badge" href="#/explore">Learn how verification works →</a></div>
        </section>

        ${ctaFooter()}
      </div>`;
  }

  function ctaFooter() {
    return `
      <section class="section-tight">
        <div class="cta-band">
          <h2>Find your next teammate.</h2>
          <p>Show what you're building, discover India's indie games, and support the creators making them — all in one place.</p>
          <div class="cta-actions"><a class="btn btn-white magnetic" href="#/explore">Explore Creators <span>→</span></a><button class="btn btn-outline-light magnetic" type="button" data-start-project>Start a Project</button></div>
        </div>
      </section>
      <footer class="site-footer">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="#/"><span class="brand-mark">${icons.sparkle}</span><span class="brand-word">DevFund <strong>India</strong></span></a>
            <p>India's home for indie game development — discovery, portfolios, freelancing, assets, funding and community in one ecosystem.</p>
            <p><strong>Made in India · UPI-first payments</strong></p>
          </div>
          <div class="footer-col"><h4>Ecosystem</h4><a href="#/games">Games</a><a href="#/explore">Creators</a><a href="#/freelancers">Freelance</a><a href="#/jobs">Jobs</a><a href="#/assets">Assets</a><a href="#/market">Creator Market</a></div>
          <div class="footer-col"><h4>Community</h4><a href="#/jams">Game Jams</a><a href="#/community">Community Feed</a><a href="#/devlogs">Devlogs</a><a href="#/leaderboards">Leaderboards</a><a href="#/rewards">Rewards</a></div>
          <div class="footer-col"><h4>Funding</h4><a href="#/projects">Browse Projects</a><a href="#/funding">How Funding Works</a></div>
          <div class="footer-col"><h4>Trust & Safety</h4><a href="#/#trust">Trust & Safety Center</a><a href="#/#trust">Verification Process</a><a href="#/#trust">Report Abuse</a><a href="#/#trust">Dispute Resolution</a><a href="#/#trust">Community Guidelines</a></div>
          <div class="footer-col"><h4>Company</h4><a href="#/">About DevFund India</a><a href="#/">Careers</a><a href="#/">Press</a><a href="#/">Blog</a><a href="#/">Contact Support</a></div>
        </div>
        <p class="footer-disclaimer"><strong>Disclaimer:</strong> DevFund India is a platform that connects creators, backers, buyers and freelancers. Funding on this platform is reward-based crowdfunding or voluntary support — it is <strong>not</strong> investment, equity, or a guarantee of financial returns. The Creator Market, Creator Credits (CC) and Creator Units are a free, non-monetary virtual engagement layer — they cannot be purchased with real money, cashed out, or converted to INR, and do not represent equity, ownership, revenue share or securities. Creators are responsible for delivering rewards and for their own tax, GST, and legal obligations. Payment processing, KYC, and escrow are provided through regulated third-party partners. Always review a project's or listing's risks before spending real money.</p>
        <div class="footer-bottom"><span>© 2026 DevFund India. All rights reserved.</span><div class="footer-links"><a href="#/">Terms of Service</a><a href="#/">Privacy Policy</a><a href="#/">Refund Policy</a><a href="#/">GST & Tax</a><a href="#/">Support</a></div></div>
      </footer>`;
  }

  function routeHero(title, subtitle, eyebrow='Discover DevFund India') {
    return `<section class="route-hero">
      <span class="section-decor sd-tr sd-lg" aria-hidden="true">${icons.crown}</span>
      <span class="section-decor sd-bl sd-md" aria-hidden="true">${icons.gemDecor}</span>
      <span class="section-decor sd-tl sd-sm" aria-hidden="true">${icons.sparkleDecor}</span>
      <span class="section-decor sd-tr sd-sm" aria-hidden="true">${icons.checkerDecor}</span>
      <span class="section-decor sd-bl sd-sm" aria-hidden="true">${icons.checkerDecor}</span>
      <div class="route-hero-inner glass-card"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${subtitle}</p></div>
    </section>`;
  }

  function projectsView() {
    return `<div class="page-shell">${pixelField()}${routeHero('Projects worth backing','Explore verified creator campaigns spanning games, technology, music and immersive media.','Crowdfunding')}
      <div class="filter-bar">${['All','Indie Games','Technology','Animation','Music'].map((x,i)=>`<button class="filter-chip ${i===0?'active':''}" data-project-filter="${x}">${x}</button>`).join('')}</div>
      <div class="cards-3" id="projectListing">${projects.map(projectCard).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function exploreView() {
    return `<div class="page-shell">${pixelField()}${routeHero('Explore creators','Meet verified artists, developers, musicians, makers and storytellers from across India.','Creator discovery')}
      <div class="creator-grid">${creators.map(creatorCard).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function freelancersView() {
    const cats = ['All', ...new Set(services.map(s => s.category))];
    return `<div class="page-shell">${pixelField()}${routeHero('Freelance marketplace','Hire verified creators for production-ready work — with clear pricing, delivery timelines and trust signals.','Services')}
      <div class="filter-bar">${cats.map((x,i)=>`<button class="filter-chip ${i===0?'active':''}" data-freelancer-filter="${x}">${x}</button>`).join('')}</div>
      <div class="cards-3" id="freelancerListing">${services.map(serviceCard).join('')}</div>
      <div class="section-head" style="margin-top:48px">
        <div><h2 style="font-size:26px">Looking for project-based work instead?</h2><p>Browse open jobs posted by studios and creators, with clear budgets, skills and deadlines.</p></div>
        <a class="text-link" href="#/jobs">Browse jobs <span>→</span></a>
      </div>
      ${ctaFooter()}
    </div>`;
  }

  function jobsView() {
    const cats = ['All', ...new Set(freelanceJobs.map(j => j.category))];
    return `<div class="page-shell">${pixelField()}${routeHero('Freelance jobs','Real project-based work posted by Indian indie studios and creators — apply directly, no scattered WhatsApp threads.','Jobs board')}
      <div class="filter-bar">${cats.map((x,i)=>`<button class="filter-chip ${i===0?'active':''}" data-job-filter="${x}">${x}</button>`).join('')}<button class="filter-chip" type="button" data-toast="Job posting form connects to your backend in a later phase.">+ Post a Job</button></div>
      <div class="job-grid" id="jobListing">${freelanceJobs.map(jobCard).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function jobView(id) {
    const j = freelanceJobs.find(x => x.id === id) || freelanceJobs[0];
    return `<div class="page-shell">
      <nav class="breadcrumb"><a href="#/jobs">Jobs</a><span>›</span><span>${j.category}</span></nav>
      <div class="service-layout">
        <div>
          <span class="pill">${j.category}</span>
          <h1 style="font-size:32px;letter-spacing:-.04em;margin:14px 0 10px">${j.title}</h1>
          <div class="meta-chips" style="margin-bottom:18px"><span class="meta-chip tone-cyan">${j.type}</span><span class="meta-chip tone-amber">${j.duration}</span><span class="meta-chip">${j.applicants} applicants</span></div>
          <p class="job-detail-desc">${j.desc}</p>
          <h2 class="steps-title">Skills required</h2>
          <div class="tag-list">${j.skills.map(s=>`<span class="tag">${s}</span>`).join('')}</div>
          <h2 class="steps-title">How applying works</h2><p class="steps-sub">Applications and messaging connect to your backend in production.</p>
          <div class="order-steps">${['Submit application','Client reviews profile','Interview / discussion','Terms agreed','Payment initiated (escrow)','Work begins','Delivery & payment released'].map((x,i)=>`<div class="order-step glass-card"><span class="step-num">${i+1}</span><span>${x}</span></div>`).join('')}</div>
          <p class="muted" style="font-size:11px;margin:18px 0 0">Prototype workflow. Production connects to a compliant escrow/payment provider.</p>
        </div>
        <aside class="side-stack">
          <article class="order-card glass-panel">
            <div class="muted" style="font-size:12px">Budget</div>
            <div class="order-price">${jobBudget(j)}</div>
            <div class="order-meta"><span>◷ ${j.duration}</span><span>${j.type}</span></div>
            <button class="btn btn-primary magnetic" data-toast="Application sent — connect this to your backend.">Apply Now</button>
            <button class="btn btn-ghost" data-toast="Contact request opened">${icons.message} Message Client</button>
          </article>
          <article class="seller-card glass-card">
            <div class="seller-head">${avatarMarkup(null, j.client, 'avatar-lg')}<div><b>${j.client}</b><span>${j.clientVerified ? 'Verified client' : 'Unverified client'}</span></div></div>
            <div class="seller-stats"><span>${j.applicants} applicants</span><span>Posted ${j.posted}</span></div>
            ${j.clientVerified ? `<div class="badges" style="justify-content:flex-start">${verificationBadges()}</div>` : `<p class="muted" style="font-size:12px;margin-top:10px">This client has not completed verification yet.</p>`}
          </article>
        </aside>
      </div>
      ${ctaFooter()}
    </div>`;
  }

  function fundingView() {
    return `<div class="page-shell">${routeHero('How funding works','Reward-based crowdfunding for legitimate game-dev, tech and creative projects — not investment, not equity.','Funding')}
      <div class="trust-grid">
        <article class="trust-card flat-card"><span class="verify-icon">${icons.wallet}</span><div><h3>Reward-based, not equity</h3><p>Backers receive stated rewards for their support. Backing a project is not an investment and does not create ownership or a right to returns.</p></div></article>
        <article class="trust-card flat-card"><span class="verify-icon">${icons.shield}</span><div><h3>Trust signals on every project</h3><p>Account age, delivery history and verification badges are shown alongside every campaign so you can judge risk before backing.</p></div></article>
        <article class="trust-card flat-card"><span class="verify-icon">${icons.badge}</span><div><h3>Clear reward tiers</h3><p>Every campaign lists concrete reward tiers with estimated delivery dates — no vague promises.</p></div></article>
        <article class="trust-card flat-card"><span class="verify-icon">${icons.clock}</span><div><h3>Ongoing updates</h3><p>Creators post progress updates so backers can track a project after it's funded, not just before.</p></div></article>
      </div>
      <div class="section-head" style="margin-top:48px"><div><h2 style="font-size:28px">Ready to explore?</h2><p>Browse live campaigns or start your own.</p></div></div>
      <div class="aproj-grid">${projects.map(activeProjectCard).join('')}</div>
      <p class="cc-note" style="margin:20px 0 0">Funding on DevFund India is reward-based crowdfunding or voluntary support — not investment, equity, or a guarantee of financial returns.</p>
      ${ctaFooter()}
    </div>`;
  }

  function cbTile({key, color, span='', icon, eyebrow, title, desc, extra='', creatorKey}) {
    return `
      <article class="cb-tile ${color} ${span}" data-bento-tile="${key}" data-bento-creator="${creatorKey}" tabindex="0">
        <span class="cb-decor" aria-hidden="true"></span>
        <div class="cb-head"><span class="cb-icon">${icon}</span><span class="cb-tap">Tap to view →</span></div>
        <div class="cb-content">
          <p class="cb-eyebrow">${eyebrow}</p>
          <h3>${title}</h3>
          <p class="cb-desc">${desc}</p>
          ${extra}
        </div>
      </article>`;
  }

  function creatorBentoGrid(c, ownProjects, ownServices) {
    const extra = creatorExtras[c.key] || { bio: 'This creator has not added a bio yet.', skills: [], social: [] };
    const testimonials = creatorTestimonials[c.key] || [];
    const raisedTotal = ownProjects.reduce((s, p) => s + p.raised, 0);
    const backersTotal = ownProjects.reduce((s, p) => s + p.backers, 0);
    const campaigns = ownProjects.length;
    const bioWords = extra.bio.split(' ');
    const bioTeaser = bioWords.slice(0, 16).join(' ') + (bioWords.length > 16 ? '…' : '');
    const topQuote = testimonials[0];

    const tiles = [
      cbTile({ key:'profile', color:'cb-purple', span:'cb-w2 cb-h2', icon:icons.sparkle, creatorKey:c.key,
        eyebrow:'Creator', title:c.name, desc:`${c.role} · ${c.location}`,
        extra:`${avatarMarkup(c.avatar,c.name,'cb-mini-avatar')}<div class="cb-taglist"><span>${c.followers} followers</span><span>${c.projects} projects</span><span>★ ${c.rating}</span></div>` }),
      cbTile({ key:'about', color:'cb-cream', span:'cb-w2', icon:icons.message, creatorKey:c.key,
        eyebrow:'About', title:'The story so far', desc:bioTeaser }),
      cbTile({ key:'achievements', color:'cb-dark', icon:icons.award, creatorKey:c.key,
        eyebrow:'Milestones', title:'Achievements', desc:'Verified track record, built order by order.' }),
      cbTile({ key:'skills', color:'cb-yellow', icon:icons.code, creatorKey:c.key,
        eyebrow:'Toolkit', title:'Skills & Stack', desc:(extra.skills.slice(0,2).join(' · ') || 'Not listed yet'),
        extra:`<div class="cb-taglist">${extra.skills.slice(0,3).map(s=>`<span>${s}</span>`).join('')}</div>` }),
      cbTile({ key:'projects', color:'cb-orange', span:'cb-w2', icon:icons.controller, creatorKey:c.key,
        eyebrow:'Campaigns & work',
        title: campaigns ? `${campaigns} live campaign${campaigns>1?'s':''}` : (ownServices.length ? `${ownServices.length} service${ownServices.length>1?'s':''} listed` : 'Open for commissions'),
        desc: campaigns ? ownProjects[0].title : 'Browse published work, or reach out to commission something new.' }),
      cbTile({ key:'reviews', color:'cb-pink', span:'cb-h2', icon:icons.star, creatorKey:c.key,
        eyebrow:'Backer & buyer reviews', title: topQuote ? topQuote.name : 'No reviews yet',
        desc: topQuote ? `"${topQuote.quote}"` : `Be the first to back or hire ${c.name.split(' ')[0]}.` }),
      cbTile({ key:'trust', color:'cb-green', icon:icons.shield, creatorKey:c.key,
        eyebrow:'Trust & safety', title:'98% completion rate', desc:'~2h avg. response · 4/4 verifications' }),
      cbTile({ key:'funding', color:'cb-blue', icon:icons.wallet, creatorKey:c.key,
        eyebrow:'Funding',
        title: campaigns ? `₹${fmt(raisedTotal)} raised` : 'Ready to launch',
        desc: campaigns ? `${fmt(backersTotal)} backers across ${campaigns} campaign${campaigns>1?'s':''}` : 'No campaigns live yet — check back soon.' }),
      cbTile({ key:'connect', color:'cb-lavender', icon:icons.link, creatorKey:c.key,
        eyebrow:'Get in touch', title:'Message or follow', desc:'Reach out directly or check social links.' })
    ];

    return `
      <div class="cb-head-row"><div><h2>${c.name.split(' ')[0]}'s Bento Portfolio</h2><p>Tap any card for the full picture — built for backers, buyers and hiring creators.</p></div></div>
      <div class="creator-bento">${tiles.join('')}</div>`;
  }

  function openBentoModal(tileKey, creatorKey) {
    const c = creators.find(x => x.key === creatorKey) || creators[0];
    const extra = creatorExtras[c.key] || { bio:'This creator has not added a bio yet.', skills:[], social:[] };
    const testimonials = creatorTestimonials[c.key] || [];
    const ownProjects = projects.filter(x => x.creatorKey === c.key);
    const ownServices = services.filter(x => x.creatorKey === c.key);
    const raisedTotal = ownProjects.reduce((s, p) => s + p.raised, 0);
    const backersTotal = ownProjects.reduce((s, p) => s + p.backers, 0);

    let eyebrow = 'Creator showcase', title = c.name, body = '';

    switch (tileKey) {
      case 'profile':
        eyebrow = 'Full profile'; title = c.name;
        body = `
          <div class="bmg">
            <div class="bm-tile cb-purple bm-wide" style="display:flex;gap:16px;align-items:center">
              ${avatarMarkup(c.avatar,c.name,'avatar-lg')}
              <div><b style="font-size:19px">${c.name}</b><span style="display:block">${c.handle} · ${c.role}</span><span>⌾ ${c.location}</span></div>
            </div>
            <div class="bm-tile cb-cream"><b>${c.followers}</b><span>Followers</span></div>
            <div class="bm-tile cb-cream"><b>${c.projects}</b><span>Projects</span></div>
            <div class="bm-tile cb-cream"><b>${c.rating}</b><span>Rating</span></div>
            <div class="bm-tile cb-cream"><b>${c.orders}</b><span>Completed orders</span></div>
          </div>
          <div class="badges" style="margin-top:14px">${verificationBadges()}</div>
          <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
            <button class="btn btn-primary magnetic" data-toast="Following ${c.name}">Follow</button>
            <button class="btn btn-ghost" data-toast="Message composer opened">${icons.message} Message</button>
            <a class="btn btn-ghost" href="#/creator/${c.key}" data-modal-close="bentoModal">Open full profile page →</a>
          </div>`;
        break;
      case 'about':
        eyebrow = 'About'; title = `About ${c.name.split(' ')[0]}`;
        body = `
          <div class="bm-quote cb-cream"><p>${extra.bio}</p></div>
          <div class="bmg">
            <div class="bm-tile cb-lavender"><b>${c.location.split(',')[0]}</b><span>Based in</span></div>
            <div class="bm-tile cb-lavender"><b>${c.projects}</b><span>Projects shipped</span></div>
          </div>`;
        break;
      case 'achievements': {
        eyebrow = 'Milestones'; title = 'Achievements';
        const achv = [
          { icon:icons.star, t: parseFloat(c.rating) >= 4.9 ? 'Top Rated Creator' : 'Rising Talent', d:`${c.rating}★ average across ${c.orders} orders` },
          { icon:icons.badge, t:'Fully Verified', d:'Email, phone, identity & payment verified' }
        ];
        if (ownProjects.length) achv.push({ icon:icons.rocket, t:`${ownProjects.length} Campaign${ownProjects.length>1?'s':''} Launched`, d:'Crowdfunding track record on DevFund India' });
        if (c.orders) achv.push({ icon:icons.briefcase, t:`${c.orders} Orders Delivered`, d:'Completed freelance work for verified buyers' });
        body = achv.map(a => `<div class="bm-achv"><span class="cb-icon">${a.icon}</span><div><b>${a.t}</b><span>${a.d}</span></div></div>`).join('');
        break;
      }
      case 'skills':
        eyebrow = 'Toolkit'; title = 'Skills & Stack';
        body = `<div class="cb-taglist" style="gap:8px">${(extra.skills.length ? extra.skills : ['Not listed yet']).map(s => `<span style="background:rgba(112,63,245,.1);color:var(--purple);padding:8px 14px;border-radius:999px;font-weight:800;font-size:12.5px">${s}</span>`).join('')}</div>`;
        break;
      case 'projects':
        eyebrow = 'Campaigns & work'; title = `${c.name.split(' ')[0]}'s work`;
        if (ownServices.length) body = `<div class="cards-3">${ownServices.map(serviceCard).join('')}</div>`;
        else if (ownProjects.length) body = `<div class="cards-3">${ownProjects.map(projectCard).join('')}</div>`;
        else body = `<div class="bm-quote cb-cream"><p>No published campaigns yet. This creator is available for freelance commissions — send a message to get started.</p></div>`;
        break;
      case 'reviews':
        eyebrow = 'Backer & buyer reviews'; title = 'What people say';
        body = testimonials.length
          ? testimonials.map(t => `<div class="bm-quote cb-pink"><p>"${t.quote}"</p><div class="bm-quote-person"><b>${t.name}</b>&nbsp;· ${t.role}</div></div>`).join('')
          : `<div class="bm-quote cb-cream"><p>No reviews yet — be the first to back or hire ${c.name}.</p></div>`;
        break;
      case 'trust':
        eyebrow = 'Trust & safety'; title = 'Trust & Verification';
        body = `
          <div class="badges" style="margin-bottom:14px">${verificationBadges()}</div>
          <div class="bmg">
            <div class="bm-tile cb-green"><b>98%</b><span>Completion rate</span></div>
            <div class="bm-tile cb-green"><b>~2h</b><span>Avg. response time</span></div>
          </div>`;
        break;
      case 'funding':
        eyebrow = 'Funding'; title = 'Funding raised';
        body = ownProjects.length ? `
          <div class="bmg">
            <div class="bm-tile cb-blue"><b>₹${fmt(raisedTotal)}</b><span>Total raised</span></div>
            <div class="bm-tile cb-blue"><b>${fmt(backersTotal)}</b><span>Total backers</span></div>
            <div class="bm-tile cb-blue bm-wide"><b>${ownProjects.length}</b><span>Campaign${ownProjects.length>1?'s':''} launched</span></div>
          </div>` : `<div class="bm-quote cb-cream"><p>${c.name} hasn't launched a crowdfunding campaign yet.</p></div>`;
        break;
      case 'connect':
      default:
        eyebrow = 'Get in touch'; title = 'Connect';
        body = `
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-primary magnetic" data-toast="Message composer opened">${icons.message} Message</button>
            <button class="btn btn-ghost" data-toast="Following ${c.name}">Follow</button>
            <button class="btn btn-ghost" data-toast="Profile link copied">${icons.share} Share</button>
          </div>
          <div class="cb-taglist" style="margin-top:16px;gap:8px">${(extra.social && extra.social.length ? extra.social : [['No social links yet','#']]).map(s => `<a href="${s[1]}" class="tag" data-toast="Link is a placeholder in this prototype" style="text-decoration:none;color:inherit">${s[0]}</a>`).join('')}</div>`;
        break;
    }

    $('#bentoModalEyebrow').textContent = eyebrow;
    $('#bentoModalTitle').textContent = title;
    $('#bentoModalBody').innerHTML = body;
    openModal('bentoModal');
    bindDynamicUI();
  }

  function profileBentoGrid(c) {
    return `
      <div class="profile-bento">
        <article class="pb-tile pb-profile cb-purple">
          <span class="cb-decor" aria-hidden="true"></span>
          <div class="pb-profile-row">
            ${avatarMarkup(c.avatar,c.name,'pb-avatar')}
            <div class="pb-icon-actions">
              <button class="icon-btn pb-icon-btn" type="button" data-toast="Profile link copied">${icons.share}</button>
              <button class="icon-btn pb-icon-btn" type="button" data-toast="Saved to favourites">${icons.heart}</button>
            </div>
          </div>
          <h1>${c.name}</h1>
          <p class="pb-role">${c.handle} · ${c.role}</p>
          <p class="pb-loc">${icons.pin} ${c.location}</p>
          <div class="pb-cta">
            <button class="btn btn-ghost pb-btn-ghost" type="button" data-toast="Message composer opened">${icons.message} Message</button>
            <button class="btn btn-primary magnetic" type="button" data-toast="Following ${c.name}">Follow</button>
          </div>
        </article>
        <article class="pb-tile pb-metric cb-cream"><span class="pb-metric-label">Followers</span><span class="pb-metric-value">${c.followers}</span></article>
        <article class="pb-tile pb-metric cb-lavender"><span class="pb-metric-label">Projects</span><span class="pb-metric-value">${c.projects}</span></article>
        <article class="pb-tile pb-metric cb-yellow"><span class="pb-metric-label">Rating</span><span class="pb-metric-value">★ ${c.rating}</span></article>
        <article class="pb-tile pb-metric cb-blue"><span class="pb-metric-label">Completed orders</span><span class="pb-metric-value">${c.orders}</span></article>
        <article class="pb-tile pb-verify cb-dark">
          <div class="pb-verify-copy"><h3>Verification status</h3><p>Badges are earned through real verification — never assumed.</p></div>
          <div class="badges">${verificationBadges()}</div>
        </article>
      </div>`;
  }

  function analyticsNeuGrid(c) {
    const m = marketByKey[c.key] || {trust:90, index:70};
    const bars = [['Communication',100,'5.0'],['Quality',100,'5.0'],['Timeliness',80,'4.0'],['Professionalism',100,'5.0']];
    return `
      <h2 class="analytics-title">Analytics, Trust & Experience</h2>
      <div class="neu-analytics">
        <div class="neu-col">
          <article class="neu-card neu-trust">
            <div class="neu-trust-head">
              <div><div class="muted neu-label">Trust Score</div><div class="score-big">${m.trust}<span>/100</span></div></div>
              <div class="stars">★★★★★ <span class="stars-num">${c.rating}</span></div>
            </div>
            <div class="neu-bars">
              ${bars.map(x=>`<div class="neu-bar"><label><span>${x[0]}</span><span>${x[2]}</span></label><div class="neu-bar-track"><span class="neu-bar-fill" data-pct="${x[1]}"></span></div></div>`).join('')}
            </div>
            <p class="muted neu-trust-foot">4/4 verifications · ${c.projects} delivered projects · Creator Index ${m.index}</p>
            <p class="muted trust-disclaimer" style="margin-top:8px">Trust Score reflects platform reputation only — it is not a guarantee of outcomes or financial success.</p>
          </article>
          <div class="neu-row-2">
            <article class="neu-card neu-small">
              <b>Completion rate</b>
              <div class="score-big neu-big-sm">98%</div>
              <div class="neu-bar-track neu-progress-track"><span class="neu-bar-fill neu-fill-green" data-pct="98"></span></div>
            </article>
            <article class="neu-card neu-small">
              <b>Avg. response</b>
              <div class="score-big neu-big-sm">~2h</div>
              <p class="muted">Across last 30 orders</p>
            </article>
          </div>
        </div>
        <div class="neu-col">
          <article class="neu-card neu-experience">
            <div class="muted neu-label">Experience & Track Record</div>
            <div class="neu-exp-cells">
              <div class="neu-exp-cell neu-inset">${icons.briefcase}<b>5y</b><small>Experience</small></div>
              <div class="neu-exp-cell neu-inset">${icons.award}<b>${c.projects}</b><small>Projects</small></div>
              <div class="neu-exp-cell neu-inset">${icons.clock}<b>${c.orders}</b><small>Orders</small></div>
            </div>
          </article>
          <article class="neu-card neu-trend">
            <div class="neu-trend-head"><span class="muted neu-label">Creator Index (8-mo trend)</span><span class="neu-trend-arrow">${icons.trendUp}</span></div>
            <div class="fake-chart"><svg viewBox="0 0 600 110" preserveAspectRatio="none"><defs><linearGradient id="areaTrend" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7b42f5" stop-opacity=".23"/><stop offset="1" stop-color="#7b42f5" stop-opacity="0"/></linearGradient></defs><path d="M0 86 C90 68 155 61 220 57 S330 61 410 48 S520 30 600 18 L600 110 L0 110 Z" fill="url(#areaTrend)"/><path d="M0 86 C90 68 155 61 220 57 S330 61 410 48 S520 30 600 18" fill="none" stroke="#743dff" stroke-width="3"/></svg></div>
          </article>
          <article class="neu-card neu-info">
            <div class="neu-info-row"><span class="neu-info-icon">${icons.pin}</span><span>${c.location}</span></div>
            <div class="neu-info-row"><span class="neu-info-icon">${icons.translate}</span><span class="neu-lang-pills"><span class="lang-pill">Hindi</span><span class="lang-pill">English</span></span></div>
            <div class="neu-info-row neu-verified-row"><span class="neu-info-icon neu-info-icon-green">${icons.shield}</span><span>Identity & payment verified for safe transactions</span></div>
          </article>
        </div>
      </div>`;
  }

  function creatorGamesSection(c) {
    const ownGames = games.filter(g => g.devKey === c.key);
    if (!ownGames.length) return '';
    return `<section class="section section-dark"><div class="section-head"><div><h2>Games</h2><p>Titles ${c.name.split(' ')[0]} is building or has shipped</p></div></div><div class="game-grid">${ownGames.map(gameCard).join('')}</div></section>`;
  }

  function creatorAssetsSection(c) {
    const ownAssets = marketplaceAssets.filter(a => a.creator === c.name);
    if (!ownAssets.length) return '';
    return `<section class="section"><div class="section-head"><div><h2>Assets</h2><p>Marketplace listings by ${c.name.split(' ')[0]}</p></div></div><div class="asset-grid">${ownAssets.map(assetCard).join('')}</div></section>`;
  }

  function creatorView(key) {
    const c = creators.find(x => x.key === key) || creators[0];
    const ownProjects = projects.filter(x => x.creatorKey === c.key);
    const ownServices = services.filter(x => x.creatorKey === c.key);
    return `<div class="page-shell">
      <section class="profile-cover"></section>
      <div class="profile-shell">
        ${profileBentoGrid(c)}
        ${creatorBentoGrid(c, ownProjects, ownServices)}
        ${analyticsNeuGrid(c)}
        ${creatorGamesSection(c)}
        ${creatorAssetsSection(c)}
        ${ownProjects.length || ownServices.length ? `<section class="section"><div class="section-head"><div><h2>${c.name}'s work</h2><p>Campaigns and freelance services on DevFund India</p></div></div>${ownServices.length ? `<div class="cards-3">${ownServices.map(serviceCard).join('')}</div>` : `<div class="cards-3">${ownProjects.map(projectCard).join('')}</div>`}</section>`:''}
      </div>
      ${ctaFooter()}
    </div>`;
  }

  const assetReviews = [
    {name:'Studio Retro', quote:'Dropped straight into our URP project with zero rework. Textures are clean and well organized.'},
    {name:'Nikhil J.', quote:'Great value for the price — used it across two prototypes already.'},
    {name:'Coastal Press', quote:'Exactly as described. Support from the creator was fast when I had a licensing question.'}
  ];

  function bidHistoryFor(a) {
    if (!a.currentBid) return [];
    const rows = [];
    let price = a.currentBid;
    for (let i = 0; i < Math.min(a.bids, 6); i++) {
      rows.push({ price, bidder: `Bidder${(a.bids - i) * 37 % 89 + 10}` });
      price = Math.round(price * 0.92);
    }
    return rows;
  }

  function auctionsView() {
    const auctionAssets = marketplaceAssets.filter(a => a.auction);
    return `<div class="page-shell">${routeHero('Asset auctions','Bid on eligible assets using Creator Credits (CC) — a free, non-monetary engagement layer. Real-money purchases stay separate.','Auctions')}
      <div class="asset-grid">${auctionAssets.map(assetCard).join('')}</div>
      <p class="cc-note" style="margin-top:24px">Creator Credits used for bidding are free and non-monetary. They cannot be purchased, cashed out, or converted to INR.</p>
      ${ctaFooter()}
    </div>`;
  }

  function serviceView(key) {
    const s = services.find(x => x.key === key) || services[0];
    const creator = creators.find(c => c.key === s.creatorKey) || creators[0];
    return `<div class="page-shell service-detail">
      <div class="service-layout">
        <div>
          <div class="service-main-image"><img src="${s.image || 'assets/service-game.jpg'}" alt="${s.title}"></div>
          <div class="service-title-row"><div><span class="pill">${s.category}</span><h1>${s.title}</h1><p class="hero-sub" style="font-size:16px">${s.desc}</p></div><div style="display:flex;gap:8px"><button class="icon-btn glass-card" data-toast="Saved to favourites">${icons.heart}</button><button class="icon-btn glass-card" data-toast="Service reported for review">⚑</button></div></div>
          <div class="tag-list">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <h2 class="steps-title">How ordering works</h2><p class="steps-sub">Payments are held in escrow and released only when you approve the delivery.</p>
          <div class="order-steps">${['Client sends request','Freelancer accepts','Payment initiated (escrow)','Work begins','Delivery submitted','Client reviews','Payment released'].map((x,i)=>`<div class="order-step glass-card"><span class="step-num">${i+1}</span><span>${x}</span></div>`).join('')}</div>
          <p class="muted" style="font-size:11px;margin:18px 0 0">Prototype workflow. Production connects to a compliant escrow/payment provider.</p>
          <h2 class="steps-title">Reviews (1)</h2>
          <article class="review-card glass-card"><div class="review-head"><b>Aditya K.</b><span style="color:#f5ac16">★ 5.0</span></div><p style="font-size:12px">Communication: 5/5 &nbsp;&nbsp; Quality: 5/5 &nbsp;&nbsp; Timeliness: 4/5 &nbsp;&nbsp; Professionalism: 5/5</p><p>${s.creator} delivered a polished prototype ahead of schedule. Great communication throughout.</p><span class="verified-order">✓ Verified completed order</span></article>
        </div>
        <aside class="side-stack">
          <article class="order-card glass-panel"><div class="muted" style="font-size:12px">Starting at</div><div class="order-price">₹${fmt(s.price)}</div><div class="order-meta"><span>◷ ${s.days} days</span><span>1 revision</span></div><button class="btn btn-primary magnetic" data-toast="Order request started">Place Order</button><button class="btn btn-ghost" data-toast="Contact request opened">${icons.message} Contact</button></article>
          <article class="seller-card glass-card"><div class="seller-head">${avatarMarkup(creator.avatar,creator.name,'avatar-lg')}<div><b>${creator.name}</b><span>${creator.handle}</span></div></div><div class="seller-stats"><span>★ ${creator.rating}</span><span>${creator.orders} orders</span><span>${creator.location}</span></div><div class="badges" style="justify-content:flex-start">${verificationBadges()}</div><a class="text-link" href="#/creator/${creator.key}" style="margin-top:17px">View creator profile →</a></article>
        </aside>
      </div>
      ${ctaFooter()}
    </div>`;
  }

  function projectView(key) {
    const p = projects.find(x => x.id === key) || projects[0];
    const creator = creators.find(c => c.key === p.creatorKey) || creators[0];
    const extra = projectExtras[p.id] || { rewards:[], roadmap:[], updates:[], risks:'Risk information for this project has not been added yet.', team:[{name:creator.name, role:'Creator'}] };
    const pct = percent(p);
    return `<div class="page-shell project-detail">
      <nav class="breadcrumb"><a href="#/projects">Projects</a><span>›</span><span>${p.category}</span></nav>
      <div class="project-layout">
        <div>
          <div class="project-hero-image"><img src="${p.image || 'assets/gaming.jpg'}" alt="${p.title}"></div>
          <div class="project-title-row">
            <div><span class="pill">${p.category}</span><h1>${p.title}</h1></div>
            <div style="display:flex;gap:8px"><button class="icon-btn glass-card" data-toast="Saved to favourites">${icons.heart}</button><button class="icon-btn glass-card" data-toast="Project link copied">${icons.share}</button><button class="icon-btn glass-card" data-toast="Project reported for review">⚑</button></div>
          </div>
          <div class="creator-strip glass-card">
            ${avatarMarkup(creator.avatar, creator.name, 'avatar-lg')}
            <div class="creator-strip-copy"><b>${creator.name}</b><span>${creator.location} · ${p.previousProjects} previous projects</span></div>
            <div class="badges creator-strip-badges">
              <span class="badge">${icons.mail} Email Verified</span>
              <span class="badge">${icons.shield} Identity Verified</span>
              <span class="badge">${icons.badge} Payment Verified</span>
            </div>
          </div>
          <div class="tabs" role="tablist">
            <button class="tab active" type="button" data-tab="story">Story</button>
            <button class="tab" type="button" data-tab="updates">Updates${extra.updates.length ? ` (${extra.updates.length})` : ''}</button>
            <button class="tab" type="button" data-tab="rewards">Rewards</button>
            <button class="tab" type="button" data-tab="roadmap">Roadmap</button>
            <button class="tab" type="button" data-tab="team">Team</button>
            <button class="tab" type="button" data-tab="risks">Risks</button>
          </div>

          <div class="tab-panel active" data-tab-panel="story">
            <div class="project-story">
              <p class="muted">${p.story}</p>
              <div class="story-quote glass-card"><p>${p.quote}</p></div>
            </div>
          </div>

          <div class="tab-panel" data-tab-panel="updates">
            ${extra.updates.length ? extra.updates.map(u=>`<article class="update-card flat-card"><div class="update-head"><b>${u.title}</b><span>${u.date}</span></div><p>${u.body}</p></article>`).join('') : `<p class="muted" style="margin-top:20px">No updates posted yet.</p>`}
          </div>

          <div class="tab-panel" data-tab-panel="rewards">
            <div class="reward-grid">${extra.rewards.map(r=>`
              <article class="reward-tier flat-card">
                <div class="reward-tier-amt">₹${fmt(r.amount)}</div>
                <h4>${r.title}</h4>
                <p>${r.desc}</p>
                <div class="reward-tier-foot"><span>${r.claimed} claimed</span><span>Est. ${r.delivery}</span></div>
                <button class="btn btn-ghost magnetic" style="width:100%;margin-top:4px" data-toast="Reward selection can be connected to your checkout flow">Select reward</button>
              </article>`).join('')}
            </div>
          </div>

          <div class="tab-panel" data-tab-panel="roadmap">
            <div class="roadmap-list">${extra.roadmap.map(r=>`<div class="roadmap-item"><span class="roadmap-dot ${r.done?'done':''}"></span><div class="roadmap-body"><b>${r.title}</b><span>${r.date}</span></div></div>`).join('')}</div>
          </div>

          <div class="tab-panel" data-tab-panel="team">
            <div class="team-mini-grid">${extra.team.map(t=>`<div class="team-mini flat-card">${avatarMarkup(null, t.name)}<div><b>${t.name}</b><span>${t.role}</span></div></div>`).join('')}</div>
          </div>

          <div class="tab-panel" data-tab-panel="risks">
            <div class="risk-list"><div class="risk-item flat-card"><svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg><p>${extra.risks}</p></div></div>
          </div>
        </div>
        <aside class="side-stack">
          <article class="funding-card glass-panel">
            <div class="funding-top"><b>₹${fmt(p.raised)} raised</b><span class="muted">${pct}% of ₹${fmt(p.goal)}</span></div>
            <div class="progress"><span style="width:${pct}%"></span></div>
            <div class="funding-stats">
              <div><b>₹${(p.raised/100000).toFixed(2)} L</b><small>raised</small></div>
              <div><b>${p.backers}</b><small>backers</small></div>
              <div><b>${p.days}</b><small>days left</small></div>
            </div>
            <button class="btn btn-primary magnetic" data-toast="Backing flow can be connected to your payment provider">Back This Project</button>
            <button class="text-link reward-link" type="button" data-goto-tab="rewards">Choose a reward</button>
          </article>
          <article class="trust-panel glass-card">
            <div class="trust-head">${icons.shield} <b>Project Trust</b></div>
            <div class="trust-bar-row"><div class="trust-bar"><span style="width:100%"></span></div><span class="trust-score-text">100/100</span></div>
            <div class="trust-row"><span>${icons.badge} Creator verified</span><b class="trust-good">Yes</b></div>
            <div class="trust-row"><span>${icons.clock} Account age</span><b class="trust-good">${p.accountAge} days</b></div>
            <div class="trust-row"><span>${icons.briefcase} Previous projects</span><b class="trust-good">${p.previousProjects}</b></div>
            <div class="trust-row"><span>${icons.badge} Successful deliveries</span><b class="trust-good">${p.deliveries}</b></div>
            <div class="trust-row"><span>${icons.users} Backers</span><b class="trust-good">${p.backers}</b></div>
            <div class="trust-row"><span>${icons.clock} Last update</span><b class="trust-good">${p.lastUpdate}</b></div>
            <p class="muted trust-disclaimer">This score is based on verifiable information only. It is not a guarantee and does not mean a project is "100% safe".</p>
          </article>
        </aside>
      </div>
      ${ctaFooter()}
    </div>`;
  }

  function discoverView() {
    return `<div class="page-shell">${routeHero('Discover the ecosystem','Trending games, rising creators, popular assets, active projects and what the community is building right now.','Discover')}
      <section class="section section-dark">${sectionHead('Trending games','','All games','#/games')}<div class="game-grid">${games.slice(0,4).map(gameCard).join('')}</div></section>
      <section class="section">${sectionHead('Rising creators','','All creators','#/explore')}<div class="rc-grid">${creators.slice(0,3).map(risingCreatorCard).join('')}</div></section>
      <section class="section">${sectionHead('Popular assets','','All assets','#/assets')}<div class="asset-grid">${marketplaceAssets.slice(0,4).map(assetCard).join('')}</div></section>
      <section class="section">${sectionHead('Active projects','','All projects','#/projects')}<div class="aproj-grid">${projects.map(activeProjectCard).join('')}</div></section>
      <section class="section">${sectionHead('Community activity','','View community','#/community')}<div class="activity-feed">${communityActivity.map(activityFeedItem).join('')}</div></section>
      ${ctaFooter()}
    </div>`;
  }

  function gamesView() {
    const statuses = ['All','Idea','Prototype','In Development','Playable','Early Access','Released'];
    return `<div class="page-shell">${routeHero('Games','Discover indie games being built across India, at every stage from idea to release.','Game discovery')}
      <div class="filter-bar">${statuses.map((x,i)=>`<button class="filter-chip ${i===0?'active':''}" data-game-filter="${x}">${x}</button>`).join('')}</div>
      <div class="game-grid" id="gameListing" style="grid-template-columns:repeat(4,1fr)">${games.map(gameCard).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function gameView(id) {
    const g = games.find(x => x.id === id) || games[0];
    const c = creators.find(x => x.key === g.devKey);
    return `<div class="page-shell">
      <section class="route-hero"><div class="route-hero-inner glass-card">
        <p class="eyebrow">${g.genre} · ${g.engine} · ${g.platform}</p>
        <h1>${g.title}</h1>
        <p>By ${g.dev} · <span class="meta-chip">${g.status}</span></p>
        <div class="hero-actions" style="margin-top:20px">
          <button class="btn btn-primary magnetic" data-toast="Follow saved to your dashboard">Follow</button>
          <button class="btn btn-ghost magnetic" data-toast="Added to wishlist">Wishlist</button>
          <a class="btn btn-ghost magnetic" href="#/projects">Support Project</a>
        </div>
      </div></section>
      <section class="section"><div class="game-grid" style="grid-template-columns:1fr"><div class="game-media" style="height:360px;border-radius:12px;overflow:hidden">${g.image?`<img src="${g.image}" alt="${g.title}">`:`<div class="placeholder-icon"></div>`}</div></div></section>
      <section class="section">
        <div class="section-head"><div><h2>About ${g.title}</h2><p>Demo description — connect real devlogs, roadmap and screenshots in production.</p></div></div>
        <div class="meta-chips" style="margin-bottom:20px">${g.tags.map(t=>`<span class="meta-chip">${t}</span>`).join('')}</div>
        ${c ? `<div class="rc-grid"><div class="rc-card flat-card" data-creator="${c.key}">${avatarMarkup(c.avatar,c.name,'rc-avatar')}<div class="rc-body"><h3>${c.name}</h3><p class="rc-role">${c.role}</p></div></div></div>` : ''}
      </section>
      ${ctaFooter()}
    </div>`;
  }

  function assetsView() {
    const cats = ['All','3D Models','Environments','Characters','Props','Animation','VFX','Audio','Music','UI','Shaders','Tools'];
    return `<div class="page-shell">${routeHero('Asset marketplace','Buy and sell game-development assets — 3D models, characters, environments, audio, shaders and more.','Marketplace')}
      <div class="filter-bar">${cats.slice(0,7).map((x,i)=>`<button class="filter-chip ${i===0?'active':''}" data-asset-filter="${x}">${x}</button>`).join('')}<a class="filter-chip" href="#/auctions">Auctions →</a></div>
      <div class="asset-grid" id="assetListing">${marketplaceAssets.map(assetCard).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function assetView(id) {
    const a = marketplaceAssets.find(x => x.id === id) || marketplaceAssets[0];
    const media = a.image ? `<img src="${a.image}" alt="${a.title}">` : `<div class="placeholder-icon"></div>`;
    const bids = bidHistoryFor(a);
    const nextMinBid = a.auction ? Math.round(a.currentBid * 1.05) : 0;
    return `<div class="page-shell">${routeHero(a.title, `By ${a.creator} · ${a.category}`, 'Asset detail')}
      <div class="detail-layout" style="display:grid;grid-template-columns:1.5fr 1fr;gap:28px;align-items:start">
        <div>
          <div class="asset-media" style="height:360px;border-radius:14px;overflow:hidden">${media}</div>
          <div class="meta-chips" style="margin-top:16px"><span class="meta-chip">${a.engine}</span><span class="meta-chip">${a.formats}</span><span class="meta-chip tone-green">Version 1.2</span></div>

          <section class="section-tight">
            <h2 style="font-size:20px;margin-bottom:10px">Description</h2>
            <p class="muted">A production-ready ${a.category.toLowerCase()} asset built for modern engines. Demo listing — connect real descriptions, changelogs and licensing terms in production.</p>
          </section>

          <section class="section-tight">
            <h2 style="font-size:20px;margin-bottom:10px">Features</h2>
            <ul class="muted" style="margin:0;padding-left:18px;line-height:1.9">
              <li>Optimized for real-time engines — clean topology and efficient materials</li>
              <li>Organized folder structure with demo scene included</li>
              <li>Documentation and setup guide included</li>
            </ul>
          </section>

          <section class="section-tight">
            <h2 style="font-size:20px;margin-bottom:10px">Requirements</h2>
            <div class="meta-chips"><span class="meta-chip">${a.engine}</span><span class="meta-chip tone-cyan">${a.formats}</span></div>
          </section>

          ${a.auction ? `
          <section class="section-tight">
            <h2 style="font-size:20px;margin-bottom:10px">Bid history</h2>
            <div class="activity-feed">${bids.map(b=>`<div class="activity-item"><span class="activity-avatar" aria-hidden="true">${b.bidder.charAt(0)}</span><div class="activity-body"><p><b>${b.bidder}</b> bid <b>${fmt(b.price)} CC</b></p></div></div>`).join('')}</div>
          </section>` : ''}

          <section class="section-tight">
            <h2 style="font-size:20px;margin-bottom:10px">Reviews</h2>
            <div class="stories-grid">${assetReviews.map(r=>`<article class="story-card flat-card" style="min-height:auto;padding:20px"><blockquote style="margin:0 0 14px;font-size:14px;line-height:1.55">"${r.quote}"</blockquote><div class="story-person" style="border:0;padding:0"><span class="avatar-xs" aria-hidden="true">${r.name.charAt(0)}</span><b>${r.name}</b></div></article>`).join('')}</div>
          </section>
        </div>
        <aside class="flat-card" style="padding:22px;border-radius:16px;position:sticky;top:100px">
          <div class="asset-rating" style="margin-bottom:14px">★ <b>${a.rating}</b> <span class="muted">(${a.reviews} reviews)</span></div>
          ${a.auction ? `
            <p class="eyebrow">Current bid</p>
            <div class="asset-price" style="font-size:26px">${fmt(a.currentBid)} CC</div>
            <p class="muted" style="margin:6px 0 4px">${a.bids} bids · ${a.timeLeft} left</p>
            <p class="muted" style="margin:0 0 16px;font-size:12px">Minimum next bid: ${fmt(nextMinBid)} CC</p>
            <button class="btn btn-primary magnetic" style="width:100%" data-toast="Bidding flow can be connected to your backend">Place Bid</button>
          ` : `
            <div class="asset-price" style="font-size:26px">₹${fmt(a.price)}</div>
            <button class="btn btn-primary magnetic" style="width:100%;margin-top:16px" data-toast="Checkout can be connected to your payment provider">Buy Now</button>
          `}
          <button class="btn btn-ghost magnetic" style="width:100%;margin-top:10px" data-toast="Added to wishlist">Add to Wishlist</button>
          <div class="badge" style="margin-top:16px;justify-content:center;width:100%;box-sizing:border-box">${icons.shield} License included</div>
        </aside>
      </div>
      ${ctaFooter()}
    </div>`;
  }

  function marketView() {
    return `<div class="page-shell">${routeHero('Creator Market','A fun, virtual engagement layer where the community follows creator momentum. Not a stock exchange — no real money involved.','Virtual · non-monetary')}
      <div class="market-grid" style="margin-bottom:8px">${creators.map(marketCardMini).join('')}</div>
      <p class="cc-note" style="margin-bottom:36px">Creator Credits (CC) are free and non-monetary. Creator Units represent no ownership or equity. Virtual portfolio values have no monetary value and cannot be cashed out or converted to INR.</p>
      ${ctaFooter()}
    </div>`;
  }

  function jamsView() {
    return `<div class="page-shell">${routeHero('Game jams','Join a themed sprint, team up, and ship something with the community.','Game jams')}
      <div class="jam-grid">${gameJams.map(jamCard).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function communityView() {
    return `<div class="page-shell">${routeHero('Community feed','Showcases, devlogs, collaboration requests and jobs from Indian indie developers.','Community')}
      <div class="activity-feed">${communityActivity.map(activityFeedItem).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function comingSoonView(title, desc) {
    return `<div class="page-shell">${routeHero(title, desc || 'This module is scoped in the product plan and will be built in an upcoming phase.', 'Coming soon')}
      <div class="empty-state glass-card"><span class="brand-mark">${icons.sparkle}</span><h2>Under construction</h2><p>This section is part of DevFund India's roadmap. Check back soon, or explore what's already live.</p><a class="btn btn-primary" href="#/discover">Back to Discover</a></div>
      ${ctaFooter()}
    </div>`;
  }

  function searchRouteView() {
    return `<div class="page-shell">${pixelField()}${routeHero('Search DevFund India','Use the search control to find projects, creators and services.','Search')}<div class="empty-state glass-card"><span class="brand-mark">${icons.sparkle}</span><h2>Everything in one search</h2><p>Search across crowdfunding projects, verified creators and freelance services.</p><button class="btn btn-primary magnetic" data-search-open>Open search</button></div>${ctaFooter()}</div>`;
  }

  const app = $('#app');

  function parseRoute() {
    const hash = location.hash || '#/';
    const clean = hash.replace(/^#\/?/, '');
    const [pathPart, anchor] = clean.split('#');
    const parts = pathPart.split('/').filter(Boolean);
    return {parts, anchor};
  }

  function renderRoute() {
    const {parts, anchor} = parseRoute();
    const page = parts[0] || '';
    if (!page) app.innerHTML = homeView();
    else if (page === 'projects') app.innerHTML = projectsView();
    else if (page === 'explore') app.innerHTML = exploreView();
    else if (page === 'freelancers') app.innerHTML = freelancersView();
    else if (page === 'creator') app.innerHTML = creatorView(parts[1]);
    else if (page === 'service') app.innerHTML = serviceView(parts[1]);
    else if (page === 'project') app.innerHTML = projectView(parts[1]);
    else if (page === 'search') app.innerHTML = searchRouteView();
    else if (page === 'discover') app.innerHTML = discoverView();
    else if (page === 'games') app.innerHTML = gamesView();
    else if (page === 'game') app.innerHTML = gameView(parts[1]);
    else if (page === 'assets') app.innerHTML = assetsView();
    else if (page === 'asset') app.innerHTML = assetView(parts[1]);
    else if (page === 'auctions') app.innerHTML = auctionsView();
    else if (page === 'market') app.innerHTML = marketView();
    else if (page === 'jams') app.innerHTML = jamsView();
    else if (page === 'community') app.innerHTML = communityView();
    else if (page === 'jobs') app.innerHTML = jobsView();
    else if (page === 'job') app.innerHTML = jobView(parts[1]);
    else if (page === 'funding') app.innerHTML = fundingView();
    else if (page === 'devlogs') app.innerHTML = comingSoonView('Devlogs', 'Follow development progress from creators across the platform.');
    else if (page === 'events') app.innerHTML = comingSoonView('Events', 'Meetups, workshops and showcases for the Indian game-dev community.');
    else if (page === 'tutorials') app.innerHTML = comingSoonView('Tutorials', 'Guides and tutorials from experienced Indian game developers.');
    else if (page === 'leaderboards') app.innerHTML = comingSoonView('Leaderboards', 'Top creators, traders, freelancers and games on the platform.');
    else if (page === 'rewards') app.innerHTML = comingSoonView('Rewards', 'Creator rewards, community rewards and marketplace coupons.');
    else if (page === 'dashboard') app.innerHTML = comingSoonView('Dashboard', 'Your profile, games, portfolio, orders, Creator Credits and more in one place.');
    else app.innerHTML = `<div class="page-shell"><div class="empty-state glass-card"><span class="brand-mark">${icons.sparkle}</span><h2>Page not found</h2><p>The page you requested does not exist in this prototype.</p><a class="btn btn-primary" href="#/">Go home</a></div>${ctaFooter()}</div>`;

    bindDynamicUI();
    initScrollReveal();
    initProgressBars();
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({behavior:'smooth'}));
    else window.scrollTo({top:0,behavior:'auto'});
    app.focus({preventScroll:true});
  }

  let revealObserver = null;
  const REVEAL_SELECTOR = '.project-card,.creator-card,.service-card,.bento-card,.cb-tile,.pb-tile,.trust-card,.story-card,.stat-card,.faq-item,.metric-card,.experience-cell,.detail-card,.trend-card,.neu-card,.order-step,.route-hero-inner,.section-head,.game-card,.rc-card,.talent-chip,.asset-card,.aproj-card,.market-card,.jam-card,.activity-item,.job-card,.reward-tier,.update-card,.team-mini';

  function initScrollReveal() {
    const els = $$(REVEAL_SELECTOR, app);

    // Stagger by position within each parent grid so cards cascade in
    // rather than popping together — capped so long lists don't feel laggy.
    const seen = new Map();
    els.forEach(el => {
      el.classList.add('reveal');
      const parent = el.parentElement;
      const idx = seen.get(parent) || 0;
      el.style.transitionDelay = `${Math.min(idx, 7) * 65}ms`;
      seen.set(parent, idx + 1);
    });

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in-view'));
      return;
    }

    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('in-view');
          revealObserver.unobserve(el);
          // Once the entrance settles, drop the reveal machinery entirely so
          // it can never fight with the card's own :hover transform later.
          const cleanup = (ev) => {
            if (ev.target !== el || ev.propertyName !== 'transform') return;
            el.classList.remove('reveal', 'in-view');
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', cleanup);
          };
          el.addEventListener('transitionend', cleanup);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(el => revealObserver.observe(el));
  }

  let progressObserver = null;

  function initProgressBars() {
    const bars = $$('.neu-bar-fill[data-pct]', app);
    if (!bars.length) return;

    bars.forEach(el => el.style.setProperty('--pct', `${el.dataset.pct}%`));

    if (!('IntersectionObserver' in window)) {
      bars.forEach(el => el.classList.add('filled'));
      return;
    }

    if (progressObserver) progressObserver.disconnect();
    let i = 0;
    progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
          i += 1;
          el.classList.add('filled');
          progressObserver.unobserve(el);
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -6% 0px' });

    bars.forEach(el => progressObserver.observe(el));
  }

  function bindDynamicUI() {
    $$('.faq-q').forEach(btn => btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = $('.faq-a', item);
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true':'false');
      answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
    }));

    $$('[data-project]').forEach(card => card.addEventListener('click', () => {
      location.hash = `#/project/${card.dataset.project}`;
    }));

    $$('[data-creator]').forEach(card => card.addEventListener('click', () => { location.hash = `#/creator/${card.dataset.creator}`; }));
    $$('[data-service]').forEach(card => card.addEventListener('click', () => { location.hash = `#/service/${card.dataset.service}`; }));
    $$('[data-game]').forEach(card => card.addEventListener('click', () => { location.hash = `#/game/${card.dataset.game}`; }));
    $$('[data-asset]').forEach(card => card.addEventListener('click', () => { location.hash = `#/asset/${card.dataset.asset}`; }));
    $$('[data-market]').forEach(card => card.addEventListener('click', (e) => { e.stopPropagation(); location.hash = `#/creator/${card.dataset.market}`; }));
    $$('[data-jam]').forEach(card => card.addEventListener('click', () => showToast('Jam detail pages connect to your backend in a later phase.')));
    $$('[data-job]').forEach(card => card.addEventListener('click', () => { location.hash = `#/job/${card.dataset.job}`; }));

    $$('[data-freelancer-filter]').forEach(btn => btn.addEventListener('click', () => {
      $$('[data-freelancer-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.freelancerFilter;
      $('#freelancerListing').innerHTML = services.filter(s => val === 'All' || s.category === val).map(serviceCard).join('');
      bindDynamicUI();
    }));

    $$('[data-job-filter]').forEach(btn => btn.addEventListener('click', () => {
      $$('[data-job-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.jobFilter;
      $('#jobListing').innerHTML = freelanceJobs.filter(j => val === 'All' || j.category === val).map(jobCard).join('');
      bindDynamicUI();
    }));

    $$('.tabs .tab[data-tab]').forEach(btn => btn.addEventListener('click', () => {
      const wrap = btn.closest('.project-detail') || app;
      $$('.tab[data-tab]', wrap).forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.tab;
      $$('[data-tab-panel]', wrap).forEach(pnl => pnl.classList.toggle('active', pnl.dataset.tabPanel === key));
    }));

    $$('[data-goto-tab]').forEach(el => el.addEventListener('click', () => {
      const key = el.dataset.gotoTab;
      const tabBtn = $(`.tab[data-tab="${key}"]`, app);
      if (tabBtn) { tabBtn.click(); tabBtn.scrollIntoView({behavior:'smooth', block:'center'}); }
    }));

    $$('[data-game-filter]').forEach(btn => btn.addEventListener('click', () => {
      $$('[data-game-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.gameFilter;
      $('#gameListing').innerHTML = games.filter(g => val === 'All' || g.status === val).map(gameCard).join('');
      bindDynamicUI();
    }));

    $$('[data-asset-filter]').forEach(btn => btn.addEventListener('click', () => {
      $$('[data-asset-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.assetFilter;
      $('#assetListing').innerHTML = marketplaceAssets.filter(a => val === 'All' || a.category === val).map(assetCard).join('');
      bindDynamicUI();
    }));

    $$('[data-bento-tile]').forEach(tile => {
      if (tile.dataset.bentoBound) return;
      tile.dataset.bentoBound = '1';
      const open = () => openBentoModal(tile.dataset.bentoTile, tile.dataset.bentoCreator);
      tile.addEventListener('click', open);
      tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    $$('[data-project-filter]').forEach(btn => btn.addEventListener('click', () => {
      $$('[data-project-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.projectFilter;
      $('#projectListing').innerHTML = projects.filter(p => val === 'All' || p.category === val).map(projectCard).join('');
      bindDynamicUI();
    }));

    $$('[data-toast]').forEach(el => el.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation(); showToast(el.dataset.toast);
    }));

    $$('[data-start-project]').forEach(el => el.addEventListener('click', () => openModal('projectModal')));
    $$('[data-search-open]').forEach(el => el.addEventListener('click', () => openSearch()));
    bindMagnetic();
  }

  function bindMagnetic() {
    if (matchMedia('(pointer: coarse)').matches || document.documentElement.dataset.magneticReady) return;
    document.documentElement.dataset.magneticReady = '1';

    const reset = (el) => {
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
      el.style.setProperty('--mag-scale', '1');
      el.style.setProperty('--mag-rot', '0deg');
    };
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    document.addEventListener('pointermove', (e) => {
      $$('.magnetic').forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        // Measure distance from the button's outer edge, not its centre —
        // this creates a wide, soft attraction field around the control
        // instead of only reacting once the cursor is already on top of it.
        const edgeX = Math.max(Math.abs(dx) - r.width / 2, 0);
        const edgeY = Math.max(Math.abs(dy) - r.height / 2, 0);
        const distance = Math.hypot(edgeX, edgeY);
        const radius = 130;

        if (distance >= radius) {
          reset(el);
          return;
        }

        const strength = Math.pow(1 - distance / radius, 1.7);
        const x = clamp(dx * 0.34 * strength, -22, 22);
        const y = clamp(dy * 0.38 * strength, -18, 18);
        const scale = 1 + (0.07 * strength);
        const rot = clamp((dx / r.width) * 6 * strength, -6, 6);

        el.style.setProperty('--mag-x', `${x.toFixed(2)}px`);
        el.style.setProperty('--mag-y', `${y.toFixed(2)}px`);
        el.style.setProperty('--mag-scale', scale.toFixed(4));
        el.style.setProperty('--mag-rot', `${rot.toFixed(2)}deg`);
      });
    }, { passive: true });

    document.addEventListener('pointerdown', (e) => {
      const el = e.target.closest('.magnetic');
      if (el) el.style.setProperty('--mag-scale', '.94');
    });
    document.addEventListener('pointerup', (e) => {
      const el = e.target.closest('.magnetic');
      if (el) el.style.setProperty('--mag-scale', '1.07');
    });
    window.addEventListener('blur', () => $$('.magnetic').forEach(reset));
    document.documentElement.addEventListener('mouseleave', () => $$('.magnetic').forEach(reset));
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => $('input,textarea,select,button', modal)?.focus());
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }
  function openSearch() {
    openModal('searchModal');
    const input = $('#globalSearchInput');
    input.value='';
    renderSearchResults('');
    setTimeout(()=>input.focus(),10);
  }

  function renderSearchResults(q) {
    const query = q.trim().toLowerCase();
    let pool = [
      ...projects.map(x=>({type:'Project',title:x.title,sub:x.creator,href:x.id==='aether'?'#/service/unity-game-development':'#/projects'})),
      ...creators.map(x=>({type:'Creator',title:x.name,sub:x.role,href:`#/creator/${x.key}`})),
      ...services.map(x=>({type:'Service',title:x.title,sub:`Starting at ₹${fmt(x.price)}`,href:`#/service/${x.key}`}))
    ];
    if (query) pool = pool.filter(x => `${x.title} ${x.sub} ${x.type}`.toLowerCase().includes(query));
    pool = pool.slice(0,8);
    $('#searchResults').innerHTML = pool.length ? pool.map(x=>`<a class="search-result" href="${x.href}" data-search-result><span><span class="result-type">${x.type}</span><br><b>${x.title}</b><br><small>${x.sub}</small></span><span>→</span></a>`).join('') : `<div class="empty-state" style="padding:24px"><p>No results found. Try another keyword.</p></div>`;
    $$('[data-search-result]').forEach(a=>a.addEventListener('click',()=>closeModal('searchModal')));
  }

  let toastTimer;
  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>t.classList.remove('show'),2400);
  }

  document.addEventListener('click', e => {
    const close = e.target.closest('[data-modal-close]');
    if (close) closeModal(close.dataset.modalClose);
    if (e.target.classList.contains('modal-backdrop')) closeModal(e.target.id);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal('searchModal'); closeModal('projectModal');
      const menu = $('#mobileMenu'); if (!menu.hidden) toggleMobileMenu(false);
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  });

  $('#globalSearchInput').addEventListener('input', e => renderSearchResults(e.target.value));
  $('#projectForm').addEventListener('submit', e => {
    e.preventDefault();
    closeModal('projectModal');
    showToast('Draft created — connect this form to your backend to save it.');
    e.target.reset();
  });

  function toggleMobileMenu(force) {
    const menu = $('#mobileMenu');
    const btn = $('#mobileMenuBtn');
    const next = typeof force === 'boolean' ? force : menu.hidden;
    menu.hidden = !next;
    btn.setAttribute('aria-expanded', next ? 'true':'false');
  }
  $('#mobileMenuBtn').addEventListener('click', () => toggleMobileMenu());
  $('#mobileMenu').addEventListener('click', e => { if (e.target.closest('a,button')) toggleMobileMenu(false); });

  function toggleNavMore(force) {
    const panel = $('#navMorePanel');
    const btn = $('#navMoreBtn');
    if (!panel || !btn) return;
    const next = typeof force === 'boolean' ? force : panel.hidden;
    panel.hidden = !next;
    btn.setAttribute('aria-expanded', next ? 'true' : 'false');
  }
  $('#navMoreBtn')?.addEventListener('click', (e) => { e.stopPropagation(); toggleNavMore(); });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-more')) toggleNavMore(false);
  });
  $('#navMorePanel')?.addEventListener('click', () => toggleNavMore(false));

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      $('#siteHeader').classList.toggle('scrolled', scrollY > 20);
      scrollTicking = false;
    });
  }, {passive:true});
  window.addEventListener('hashchange', () => { closeModal('bentoModal'); renderRoute(); });

  renderRoute();
  bindMagnetic();
})();
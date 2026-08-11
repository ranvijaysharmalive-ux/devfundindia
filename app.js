(() => {
  'use strict';

  // --- AUTOMATIC CSS FIXES ---
  const fixStyles = document.createElement('style');
  fixStyles.innerHTML = `
    /* --- SINGLE DOCUMENT SCROLLER / NO PHANTOM BOTTOM SPACE --- */
    html {
      overflow-x: clip !important;
      overflow-y: auto !important;
      height: auto !important;
      min-height: 100% !important;
      overscroll-behavior-y: none;
    }
    body {
      margin: 0 !important;
      overflow-x: clip !important;
      overflow-y: visible !important;
      height: auto !important;
      min-height: 100vh !important;
      overscroll-behavior-y: none;
    }

    /*
      IMPORTANT:
      Decorative mesh / scatter / GSAP elements are absolute and may visually
      move outside the content. overflow: visible on #app made that visual
      overflow part of the document scrollable overflow, creating a fake
      "extra screen" after the footer.
      Clip ONLY at the outer app boundary. Hero overlays still work because
      they are not clipped by .hero-feature anymore.
    */
    #app {
      position: relative;
      overflow: clip !important;
    }

    .page-shell {
      position: relative;
      padding-bottom: 0 !important;
    }

    /* Footer is the real visual/document end */
    .site-footer {
      padding-bottom: 12px !important;
      margin-bottom: 0 !important;
    }

    /* Fixed terrain is decorative only */
    .pixel-terrain { display: none !important; }
  `;
  document.head.appendChild(fixStyles);

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

  function sectionDecor(pos, size, icon) {
    return `<span class="section-decor ${pos} ${size}" aria-hidden="true">${icon}</span>`;
  }

  function sectionMesh() { return ''; }

  function pixelField() {
    const colors = ['#f6b51f','#ef5bb5','#9d62ff','#06b981','#3971f6','#ff8a5c'];
    const dots = [
      [3,6,10],[7,14,8],[93,10,9],[96,22,11],[2,30,7],[95,38,8],[4,46,9],[92,52,10],
      [6,60,8],[94,66,9],[3,74,10],[96,80,7],[5,88,9],[93,92,8],[8,20,6],[90,4,7]
    ];
    return `<div class="pixel-field" aria-hidden="true">${dots.map((d,i)=>`<span style="left:${d[0]}%;top:${d[1]}%;width:${d[2]}px;height:${d[2]}px;background:${colors[i%colors.length]};animation-delay:-${(i*0.4).toFixed(1)}s"></span>`).join('')}</div>`;
  }

  // FIXED: Moved entirely outside of .page-shell so images can bleed off screen
  function scatteredArt() {
    const arts = [
      icons.chestDecor, icons.mushroomDecor, icons.gemDecor,
      icons.starDecor, icons.sparkleDecor, icons.heartBubbleDecor,
      icons.coinDecor, icons.blockDecor
    ];
  
    let html = '<div style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none; overflow:visible;">';
  
    for (let i = 0; i < 30; i++) {
      const icon = arts[i % arts.length];
      const top = 10 + (Math.random() * 85);
      const left = 2 + (Math.random() * 90);
      const size = 25 + (Math.random() * 30);
      const rot = Math.random() * 90 - 45;
  
      html += `<span class="scatter-icon" style="position:absolute; top:${top}%; left:${left}%; width:${size}px; height:${size}px; transform:rotate(${rot}deg); opacity:0.6; filter:drop-shadow(0 8px 16px rgba(60,40,110,0.12));">${icon}</span>`;
    }
  
    html += '</div>';
    return html;
  }

  // FIXED: Wrapped in a full-width absolute container entirely OUTSIDE .page-shell
  // This completely stops the straight-line cutoff caused by container bounds.
  // The left/right values are set exactly to let the images hug the screen edge 
  // like the crosshair you drew.
  function largeBackgroundScenery() {
    return `
    <div style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none; overflow:visible;">
      
      <!-- Island 1: Gun (Near Top Left) -->
      <img class="custom-pixel-art" src="assets/pixel-island-gun.png" alt="Pixel Art Gun Island" 
           style="position:absolute; top:20%; left:-5vw; width:clamp(250px, 30vw, 450px); transform:rotate(8deg); opacity:0.85; filter:drop-shadow(0 20px 30px rgba(60,40,110,0.15)); image-rendering: pixelated;">

      <!-- Island 2: Mech Character (Middle Right) -->
      <img class="custom-pixel-art" src="assets/pixel-island-mech.png" alt="Pixel Art Mech Character" 
           style="position:absolute; top:50%; right:-5vw; width:clamp(300px, 35vw, 500px); transform:rotate(-6deg); opacity:0.9; filter:drop-shadow(0 20px 30px rgba(60,40,110,0.15)); image-rendering: pixelated;">

      <!-- Island 3: Magic Crystals (Near Bottom Left) -->
      <img class="custom-pixel-art" src="assets/pixel-island-crystals.png" alt="Pixel Art Crystals" 
           style="position:absolute; top:80%; left:-3vw; width:clamp(200px, 25vw, 400px); transform:rotate(12deg); opacity:0.85; filter:drop-shadow(0 20px 30px rgba(60,40,110,0.15)); image-rendering: pixelated;">

    </div>`;
  }

  function sectionHead(title, subtitle, linkText = '', linkHref = '#/') {
    // Automatically wraps the very last word of the title in the gradient class
    const words = title.split(' ');
    const lastWord = words.pop();
    const formattedTitle = words.length > 0 
      ? `${words.join(' ')} <span class="gradient-text">${lastWord}</span>` 
      : `<span class="gradient-text">${lastWord}</span>`;

    return `<div class="section-head">
      <!-- IF THIS LINE IS MISSING, THE ROTATED BORDER WILL NOT WORK -->
      <div class="sh-rotated-border"></div> 
      
      <div><h2>${formattedTitle}</h2><p class="muted">${subtitle}</p></div>
      ${linkText ? `<a class="text-link" href="${linkHref}">${linkText} <span>→</span></a>` : ''}
    </div>`;
  }
  // ==========================================
  // PASTE YOUR MISSING DATA & FUNCTIONS HERE
  // ==========================================
  // --- MISSING DATA ARRAYS ---
  const talentCategories = [
    ['Programmers', icons.code], ['3D Artists', icons.gemDecor], ['2D Artists', icons.sparkle],
    ['Animators', icons.controller], ['Music & Audio', icons.mail], ['Game Designers', icons.rocket],
    ['Writers', icons.message], ['VFX', icons.starDecor], ['UI/UX', icons.badge], ['QA', icons.shield]
  ];

  const marketplaceAssets = [
    {id:'medieval-village', title:'Medieval Village Pack', creator:'Vikram Rao', category:'Environments', engine:'Unity · URP', formats:'FBX · PNG', price:499, rating:'4.8', reviews:124, image:'assets/office.jpg'},
    {id:'cyberpunk-city', title:'Cyberpunk City Pack', creator:'Ananya Das', category:'Environments', engine:'Unreal', formats:'FBX · TGA', price:1299, rating:'4.9', reviews:88, image:'assets/gaming.jpg', auction:true, currentBid:1240, bids:14, timeLeft:'02:41:18'}
  ];

  const gameJams = [
    {id:'monsoon-jam-2026', name:'Monsoon Game Jam 2026', theme:'Rebirth', status:'Active', deadline:'Aug 24, 2026', participants:214, submissions:38},
    {id:'48hr-indie-sprint', name:'48-Hour Indie Sprint', theme:'One Button', status:'Upcoming', deadline:'Sep 6, 2026', participants:0, submissions:0}
  ];

  const communityActivity = [
    {actor:'ArjunDev', action:'published a new devlog for', target:'Project Nightfall', type:'Devlog', time:'2h ago'},
    {actor:'PixelForge', action:'uploaded a new asset:', target:'Medieval Village Pack', type:'Asset', time:'4h ago'}
  ];

  const creatorMarket = [
    {key:'ananya-das', trust:94, index:82.4, unitPrice:142, change:18.4, spark:[40,52,48,60,55,70,66,80]},
    {key:'vikram-rao', trust:96, index:88.1, unitPrice:171, change:9.2, spark:[60,58,64,62,70,68,75,79]},
    {key:'karthik-iyer', trust:91, index:74.6, unitPrice:118, change:-2.1, spark:[70,66,68,60,62,58,55,57]}
  ];
  const marketByKey = Object.fromEntries(creatorMarket.map(m => [m.key, m]));

  // ==========================================
  // COMMUNITY — "THE GUILD HALL"
  // A distinct, game-hub styled community space:
  // guilds (not generic "groups") you can found or join,
  // a live feed you can post/react/comment on, all client-side/in-memory.
  // ==========================================
  const escapeHtml = (str) => String(str).replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);

  const guildIconChoices = ['🎮','🎨','🎵','💻','🛠️','📷','✍️','🐉','⚡','🌙','🧩','🎬'];

  let guilds = [
    { key:'indie-devs', name:'Indie Devs Circle', icon:'🎮', color:'purple', members:1240, online:86, tag:'Game Dev', desc:'Ship devlogs, swap feedback, find your next collaborator.', joined:true },
    { key:'pixel-art', name:'Pixel & Paint', icon:'🎨', color:'pink', members:860, online:41, tag:'Art', desc:'Sprite critiques, palette swaps, tileset jams.', joined:false },
    { key:'ost-lounge', name:'OST Lounge', icon:'🎵', color:'blue', members:512, online:19, tag:'Music', desc:'Share loops, stems and soundtrack works-in-progress.', joined:true },
    { key:'code-cave', name:'The Code Cave', icon:'💻', color:'green', members:980, online:63, tag:'Engineering', desc:'Shader tricks, netcode war stories, code review swaps.', joined:false },
    { key:'founders-table', name:'Founders\u2019 Table', icon:'\uD83D\uDEE0\uFE0F', color:'orange', members:340, online:12, tag:'Business', desc:'Funding strategy, GST doubts, launch playbooks.', joined:false },
    { key:'vr-immersive', name:'VR & Immersive', icon:'\uD83E\uDD7D', color:'cyan', members:275, online:14, tag:'XR', desc:'Photogrammetry, comfort settings, headset debugging.', joined:false }
  ];

  let communityPosts = [
    { id:'p1', guildKey:'indie-devs', author:'Ananya Das', avatar:null, time:'18m ago', pinned:true,
      text:'Devlog #14 — added parallax to the folk-art backgrounds in Aether. Frame-by-frame animation is brutal but worth every hour.',
      reactions:{fire:42, heart:18, rocket:9},
      comments:[{author:'Rohan Mehta', text:'This looks incredible, the color grading alone \uD83D\uDE0D'},{author:'Vikram Rao', text:'What are you painting the frames in?'}] },
    { id:'p2', guildKey:'code-cave', author:'Karthik Iyer', avatar:null, time:'42m ago', pinned:false,
      text:'Finally squashed the netcode desync bug that\u2019s been haunting our co-op build for two weeks. It was a rounding error in the tick reconciliation, of course.',
      reactions:{fire:21, heart:6, rocket:14},
      comments:[{author:'Ananya Das', text:'The classic "it was always the rounding" ending \uD83D\uDE05'}] },
    { id:'p3', guildKey:'ost-lounge', author:'Rohan Mehta', avatar:null, time:'1h ago', pinned:false,
      text:'Dropped a rough mix of track 7 from Synthwave Mumbai — layering a sitar sample under the arpeggios. Feedback welcome before mastering.',
      reactions:{fire:16, heart:11, rocket:3}, comments:[] },
    { id:'p4', guildKey:'pixel-art', author:'PixelForge', avatar:null, time:'3h ago', pinned:false,
      text:'New tileset drop: Medieval Village Pack now has autumn and monsoon palette variants. Would love critiques on the roof shading.',
      reactions:{fire:33, heart:9, rocket:5}, comments:[{author:'Vikram Rao', text:'The monsoon puddles are such a nice touch.'}] },
    { id:'p5', guildKey:'vr-immersive', author:'Vikram Rao', avatar:null, time:'5h ago', pinned:false,
      text:'Hit a stable 90fps on the Hampi VR walk after baking lightmaps instead of real-time GI. Comfort mode testers, I need you this weekend.',
      reactions:{fire:19, heart:4, rocket:8}, comments:[] }
  ];

  let ghActiveGuildFilter = null;
  let ghActiveTab = 'all';
  const ghReactedKeys = new Set();

  function ghGuildByKey(key){ return guilds.find(g => g.key === key); }

  function ghGuildChip(g){
    return `<div class="gh-guild-chip gh-c-${g.color} ${g.joined ? 'is-joined' : ''} ${ghActiveGuildFilter === g.key ? 'is-active' : ''}" data-guild-select="${g.key}" data-guild-name="${escapeHtml(g.name)} ${escapeHtml(g.tag)}" tabindex="0">
      <span class="gh-chip-icon">${g.icon}</span>
      <span class="gh-chip-body"><b>${escapeHtml(g.name)}</b><small>${fmt(g.members)} members \u00b7 ${g.online} online</small></span>
      <button type="button" class="gh-join-btn ${g.joined ? 'joined' : ''}" data-join="${g.key}" aria-label="${g.joined ? 'Leave' : 'Join'} ${escapeHtml(g.name)}">${g.joined ? '\u2713 In' : '+ Join'}</button>
    </div>`;
  }

  function ghCommentRow(c){
    return `<div class="gh-comment">${avatarMarkup(null, c.author, 'avatar-xs')}<div><b>${escapeHtml(c.author)}</b><span>${escapeHtml(c.text)}</span></div></div>`;
  }

  function ghPostCard(p){
    const g = ghGuildByKey(p.guildKey);
    return `<article class="gh-post ${p.pinned ? 'gh-pinned' : ''}" data-post="${p.id}">
      ${p.pinned ? '<span class="gh-pin-tag">\uD83D\uDCCC Pinned by guild</span>' : ''}
      <div class="gh-post-head">
        ${avatarMarkup(p.avatar, p.author, 'avatar-xs')}
        <div class="gh-post-who"><b>${escapeHtml(p.author)}</b><span class="gh-post-meta">${g ? `${g.icon} ${escapeHtml(g.name)}` : ''} \u00b7 ${p.time}</span></div>
      </div>
      <p class="gh-post-text">${escapeHtml(p.text)}</p>
      <div class="gh-post-actions">
        <button type="button" class="gh-react ${ghReactedKeys.has(p.id+':fire') ? 'reacted' : ''}" data-react="fire" data-post="${p.id}">\uD83D\uDD25 <span>${p.reactions.fire}</span></button>
        <button type="button" class="gh-react ${ghReactedKeys.has(p.id+':heart') ? 'reacted' : ''}" data-react="heart" data-post="${p.id}">\u2764\uFE0F <span>${p.reactions.heart}</span></button>
        <button type="button" class="gh-react ${ghReactedKeys.has(p.id+':rocket') ? 'reacted' : ''}" data-react="rocket" data-post="${p.id}">\uD83D\uDE80 <span>${p.reactions.rocket}</span></button>
        <button type="button" class="gh-comment-toggle" data-toggle-comments="${p.id}">\uD83D\uDCAC <span>${p.comments.length}</span> comments</button>
      </div>
      <div class="gh-comments" id="comments-${p.id}" hidden>
        ${p.comments.map(ghCommentRow).join('')}
        <form class="gh-comment-form" data-comment-form="${p.id}">
          <input type="text" placeholder="Add a comment\u2026" required maxlength="240" />
          <button type="submit" class="gh-comment-send" aria-label="Send comment">\u2192</button>
        </form>
      </div>
    </article>`;
  }

  function ghFilteredPosts(){
    let list = communityPosts.slice();
    if (ghActiveGuildFilter) list = list.filter(p => p.guildKey === ghActiveGuildFilter);
    if (ghActiveTab === 'following') {
      const joinedKeys = new Set(guilds.filter(g => g.joined).map(g => g.key));
      list = list.filter(p => joinedKeys.has(p.guildKey));
    } else if (ghActiveTab === 'trending') {
      list = list.slice().sort((a,b) => {
        const scoreA = a.reactions.fire + a.reactions.heart + a.reactions.rocket;
        const scoreB = b.reactions.fire + b.reactions.heart + b.reactions.rocket;
        return scoreB - scoreA;
      });
    }
    list = list.slice().sort((a,b) => (b.pinned === a.pinned) ? 0 : (b.pinned ? 1 : -1));
    return list;
  }

  function ghFeedHtml(){
    const list = ghFilteredPosts();
    if (!list.length) return `<div class="gh-empty-feed"><span>${icons.sparkle}</span><p>No posts here yet. Be the first to share something with this guild.</p></div>`;
    return list.map(ghPostCard).join('');
  }

  function ghJoinedCount(){ return guilds.filter(g => g.joined).length; }
  function ghOnlineTotal(){ return guilds.reduce((s,g) => s + g.online, 0); }

  function guildHallInner(){
    return `
      <div class="gh-hud">
        <div class="gh-hud-left">
          <span class="gh-hud-avatar">Y</span>
          <div>
            <p class="gh-hud-name">You \u00b7 Level 4 Builder</p>
            <div class="gh-xp-bar"><span style="width:62%"></span></div>
          </div>
        </div>
        <div class="gh-hud-stats">
          <span><b>${guilds.length}</b> guilds</span>
          <span><b id="ghJoinedCount">${ghJoinedCount()}</b> joined</span>
          <span><b>${ghOnlineTotal()}</b> online now</span>
        </div>
      </div>

      <div class="gh-layout">
        <aside class="gh-sidebar">
          <label class="gh-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.6"/><path d="m16 16 4 4"/></svg><input id="guildSearchInput" placeholder="Find a guild\u2026" autocomplete="off" /></label>
          <div class="gh-guild-list" id="guildList">${guilds.map(ghGuildChip).join('')}</div>
          <button type="button" class="gh-create-btn" id="openCreateGuild">+ Found a new guild</button>
          <div class="gh-create-panel" id="createGuildPanel" hidden>
            <form id="createGuildForm">
              <input name="name" placeholder="Guild name" required maxlength="40" />
              <div class="gh-icon-pick">${guildIconChoices.map((ic,i)=>`<button type="button" class="gh-icon-opt ${i===0?'picked':''}" data-icon="${ic}">${ic}</button>`).join('')}</div>
              <input name="tag" placeholder="Category \u2014 e.g. Art, Music, Engineering" maxlength="24" />
              <textarea name="desc" rows="2" placeholder="What's this guild about?" maxlength="140"></textarea>
              <button class="btn btn-primary" type="submit">Create guild <span>\u2192</span></button>
            </form>
          </div>
        </aside>

        <div class="gh-feed">
          <div class="gh-feed-tabs">
            <button type="button" class="gh-tab ${ghActiveTab==='all'?'active':''}" data-feed-tab="all">All activity</button>
            <button type="button" class="gh-tab ${ghActiveTab==='following'?'active':''}" data-feed-tab="following">My guilds</button>
            <button type="button" class="gh-tab ${ghActiveTab==='trending'?'active':''}" data-feed-tab="trending">\uD83D\uDD25 Trending</button>
          </div>
          <div class="gh-composer">
            ${avatarMarkup(null, 'You', 'avatar-xs')}
            <input id="composerInput" type="text" maxlength="280" placeholder="Share a devlog, ask for feedback, post progress\u2026" />
            <select id="composerGuild">${guilds.map(g=>`<option value="${g.key}">${g.icon} ${escapeHtml(g.name)}</option>`).join('')}</select>
            <button type="button" class="btn btn-primary" id="composerPost">Post</button>
          </div>
          <div class="gh-posts" id="guildFeed">${ghFeedHtml()}</div>
        </div>

        <aside class="gh-right">
          <div class="gh-panel gh-live">
            <h4>Live now</h4>
            <div class="gh-live-avatars">${['A','R','V','K','P','+'].map(l=>`<span class="gh-live-dot">${l}</span>`).join('')}</div>
            <p class="muted">${ghOnlineTotal()} creators online across all guilds right now.</p>
          </div>
          <div class="gh-panel gh-tags">
            <h4>Trending tags</h4>
            <div class="gh-tag-cloud">${['#devlog','#pixelart','#gamejam','#netcode','#soundtrack','#vr','#shaders','#feedback'].map(t=>`<span class="gh-tag-chip">${t}</span>`).join('')}</div>
          </div>
          <div class="gh-panel gh-guidelines">
            <h4>Guild etiquette</h4>
            <ul>
              <li>Credit collaborators & assets</li>
              <li>Critique the work, not the creator</li>
              <li>No spam, no unsolicited DMs</li>
            </ul>
          </div>
        </aside>
      </div>`;
  }

  function communityView(){
    return `<div class="page-shell gh-page">${pixelField()}
      <section class="gh-wrap" id="ghRoot">${guildHallInner()}</section>
      ${ctaFooter()}
    </div>`;
  }

  function ghRefreshHud(){
    const jc = $('#ghJoinedCount');
    if (jc) jc.textContent = ghJoinedCount();
  }

  function ghBindGuildChip(chip){
    if (!chip || chip.dataset.ghBound) return;
    chip.dataset.ghBound = '1';
    chip.addEventListener('click', (e) => {
      if (e.target.closest('[data-join]')) return;
      const key = chip.dataset.guildSelect;
      ghActiveGuildFilter = (ghActiveGuildFilter === key) ? null : key;
      $$('.gh-guild-chip', chip.parentElement).forEach(c => c.classList.toggle('is-active', c.dataset.guildSelect === ghActiveGuildFilter));
      ghRerenderFeed();
    });
    chip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); } });
    const joinBtn = $('[data-join]', chip);
    joinBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const g = ghGuildByKey(joinBtn.dataset.join);
      if (!g) return;
      g.joined = !g.joined;
      g.members += g.joined ? 1 : -1;
      chip.classList.toggle('is-joined', g.joined);
      joinBtn.classList.toggle('joined', g.joined);
      joinBtn.textContent = g.joined ? '\u2713 In' : '+ Join';
      $('small', chip).textContent = `${fmt(g.members)} members \u00b7 ${g.online} online`;
      ghRefreshHud();
      showToast(g.joined ? `Joined ${g.name} \u2014 welcome aboard!` : `You left ${g.name}.`);
    });
  }

  function ghBindPost(el){
    if (!el || el.dataset.ghBound) return;
    el.dataset.ghBound = '1';
    const postId = el.dataset.post;

    $$('[data-react]', el).forEach(btn => btn.addEventListener('click', () => {
      const post = communityPosts.find(p => p.id === postId);
      const type = btn.dataset.react;
      if (!post) return;
      const rk = postId + ':' + type;
      const span = $('span', btn);
      if (ghReactedKeys.has(rk)) { ghReactedKeys.delete(rk); post.reactions[type]--; btn.classList.remove('reacted'); }
      else { ghReactedKeys.add(rk); post.reactions[type]++; btn.classList.add('reacted'); }
      span.textContent = post.reactions[type];
    }));

    const toggleBtn = $('[data-toggle-comments]', el);
    const panel = $('.gh-comments', el);
    toggleBtn?.addEventListener('click', () => { panel.hidden = !panel.hidden; });

    const form = $('[data-comment-form]', el);
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('input', form);
      const text = input.value.trim();
      if (!text) return;
      const post = communityPosts.find(p => p.id === postId);
      post.comments.push({ author: 'You', text });
      form.insertAdjacentHTML('beforebegin', ghCommentRow({ author: 'You', text }));
      input.value = '';
      panel.hidden = false;
      $('span', toggleBtn).textContent = post.comments.length;
    });
  }

  function ghRerenderFeed(){
    const feed = $('#guildFeed');
    if (!feed) return;
    feed.innerHTML = ghFeedHtml();
    $$('.gh-post', feed).forEach(ghBindPost);
  }

  function bindCommunityUI(){
    const root = $('#ghRoot');
    if (!root) return;

    $$('.gh-guild-chip', root).forEach(ghBindGuildChip);
    $$('.gh-post', root).forEach(ghBindPost);

    $$('[data-feed-tab]', root).forEach(btn => btn.addEventListener('click', () => {
      ghActiveTab = btn.dataset.feedTab;
      $$('[data-feed-tab]', root).forEach(b => b.classList.toggle('active', b === btn));
      ghRerenderFeed();
    }));

    $('#guildSearchInput', root)?.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      $$('.gh-guild-chip', root).forEach(chip => {
        const hay = chip.dataset.guildName.toLowerCase();
        chip.style.display = (!q || hay.includes(q)) ? '' : 'none';
      });
    });

    const createBtn = $('#openCreateGuild', root);
    const createPanel = $('#createGuildPanel', root);
    createBtn?.addEventListener('click', () => { createPanel.hidden = !createPanel.hidden; });

    let ghPickedIcon = guildIconChoices[0];
    $$('.gh-icon-opt', root).forEach(b => b.addEventListener('click', () => {
      $$('.gh-icon-opt', root).forEach(x => x.classList.remove('picked'));
      b.classList.add('picked');
      ghPickedIcon = b.dataset.icon;
    }));

    $('#createGuildForm', root)?.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const name = (fd.get('name') || '').trim();
      if (!name) return;
      let key = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!key || ghGuildByKey(key)) key = `guild-${Date.now()}`;
      const palette = ['purple','pink','blue','green','orange','cyan'];
      const g = { key, name, icon: ghPickedIcon, color: palette[guilds.length % palette.length],
        members: 1, online: 1, tag: (fd.get('tag') || 'Community').trim(),
        desc: (fd.get('desc') || 'A brand-new guild \u2014 be the first to post.').trim(), joined: true };
      guilds.unshift(g);
      ghActiveGuildFilter = key;
      $('#guildList', root).insertAdjacentHTML('afterbegin', ghGuildChip(g));
      ghBindGuildChip($('[data-guild-select="'+key+'"]', root));
      $$('.gh-guild-chip', root).forEach(c => c.classList.toggle('is-active', c.dataset.guildSelect === ghActiveGuildFilter));
      $('#composerGuild', root).insertAdjacentHTML('afterbegin', `<option value="${key}">${g.icon} ${escapeHtml(g.name)}</option>`);
      $('#composerGuild', root).value = key;
      e.target.reset();
      ghPickedIcon = guildIconChoices[0];
      $$('.gh-icon-opt', root).forEach((x,i) => x.classList.toggle('picked', i===0));
      createPanel.hidden = true;
      ghRefreshHud();
      ghRerenderFeed();
      showToast(`${name} is live! Connect this form to your backend to persist it.`);
    });

    const composerPost = $('#composerPost', root);
    composerPost?.addEventListener('click', () => {
      const input = $('#composerInput', root);
      const guildSel = $('#composerGuild', root);
      const text = input.value.trim();
      if (!text) { input.focus(); return; }
      communityPosts.unshift({
        id: 'p' + Date.now(), guildKey: guildSel.value, author: 'You', avatar: null, time: 'Just now',
        pinned: false, text, reactions: { fire: 0, heart: 0, rocket: 0 }, comments: []
      });
      input.value = '';
      ghRerenderFeed();
      showToast('Posted to the guild feed \u2014 connect this to your backend to save it.');
    });
  }

  // --- MISSING RENDER FUNCTIONS ---
  function risingCreatorCard(c) {
    const m = marketByKey[c.key] || {trust:90, index:70};
    return `<article class="rc-card flat-card" data-creator="${c.key}">${avatarMarkup(c.avatar, c.name, 'rc-avatar')}<div class="rc-body"><h3>${c.name}</h3><p class="rc-role">${c.role}</p><div class="rc-stats"><span>Trust: <b>${m.trust}</b></span><span>Index: <b>${m.index}</b></span></div></div></article>`;
  }

  function talentCategoryChip(name, icon) {
    return `<a class="talent-chip flat-card" href="#/freelancers" data-talent="${name}"><span class="ti">${icon}</span><span>${name}</span></a>`;
  }

  function assetCard(a) {
    const media = a.image ? `<img src="${a.image}" alt="${a.title}" loading="lazy">` : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    const priceBlock = a.auction ? `<span class="asset-price">₹${fmt(a.currentBid)}</span>` : `<span class="asset-price">₹${fmt(a.price)}</span>`;
    return `<article class="asset-card flat-card" data-asset="${a.id}"><div class="asset-media">${media}</div><div class="asset-body"><h4>${a.title}</h4><div class="asset-price-row">${priceBlock}</div></div></article>`;
  }

  function activeProjectCard(p) {
    const media = p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `<article class="aproj-card flat-card" data-project="${p.id}"><div class="aproj-media">${media}</div><div class="aproj-body"><h4>${p.title.split(' — ')[0]}</h4><p class="aproj-dev">${p.creator} · ${p.category}</p></div></article>`;
  }

  function marketCardMini(c) {
    const m = marketByKey[c.key];
    if (!m) return '';
    const up = m.change >= 0;
    return `<article class="market-card" data-market="${c.key}"><div class="market-card-top">${avatarMarkup(c.avatar, c.name, 'market-avatar')}<div><p class="market-name">${c.name}</p></div></div><div class="market-price-row"><span class="market-price">${m.unitPrice} CC</span></div></article>`;
  }

  function jamCard(j) {
    return `<article class="jam-card flat-card" data-jam="${j.id}"><div class="jam-status-row"><h4>${j.name}</h4><span class="meta-chip">${j.status}</span></div><p class="jam-theme">Theme: ${j.theme} · Deadline ${j.deadline}</p></article>`;
  }

 function activityFeedItem(a) {
    return `<div class="activity-item"><span class="activity-avatar" aria-hidden="true">${a.actor.charAt(0)}</span><div class="activity-body"><p><b>${a.actor}</b> ${a.action} <b>${a.target}</b></p></div></div>`;
  }

  // ==========================================
  // PASTE YOUR TWO BACKGROUND FUNCTIONS HERE
  // ==========================================
  function scatteredArt() {
    const arts = [
      icons.chestDecor, icons.mushroomDecor, icons.gemDecor,
      icons.starDecor, icons.sparkleDecor, icons.heartBubbleDecor,
      icons.coinDecor, icons.blockDecor
    ];
  
    let html = '<div style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none; overflow:visible;">';
  
    for (let i = 0; i < 30; i++) {
      const icon = arts[i % arts.length];
      const top = 10 + (Math.random() * 85);
      const left = 2 + (Math.random() * 90);
      const size = 25 + (Math.random() * 30);
      const rot = Math.random() * 90 - 45;
  
      html += `<span class="scatter-icon" style="position:absolute; top:${top}%; left:${left}%; width:${size}px; height:${size}px; transform:rotate(${rot}deg); opacity:0.6; filter:drop-shadow(0 8px 16px rgba(60,40,110,0.12));">${icon}</span>`;
    }
  
    html += '</div>';
    return html;
  }

  function largeBackgroundScenery() {
    return `
    <div style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:-1; pointer-events:none; overflow:visible;">
      <img class="custom-pixel-art" src="assets/pixel-island-gun.png" alt="Pixel Art Gun Island" 
           style="position:absolute; top:20%; left:-5vw; width:clamp(250px, 30vw, 450px); transform:rotate(8deg); opacity:0.85; filter:drop-shadow(0 20px 30px rgba(60,40,110,0.15)); image-rendering: pixelated;">
      <img class="custom-pixel-art" src="assets/pixel-island-mech.png" alt="Pixel Art Mech Character" 
           style="position:absolute; top:50%; right:-5vw; width:clamp(300px, 35vw, 500px); transform:rotate(-6deg); opacity:0.9; filter:drop-shadow(0 20px 30px rgba(60,40,110,0.15)); image-rendering: pixelated;">
      <img class="custom-pixel-art" src="assets/pixel-island-crystals.png" alt="Pixel Art Crystals" 
           style="position:absolute; top:80%; left:-3vw; width:clamp(200px, 25vw, 400px); transform:rotate(12deg); opacity:0.85; filter:drop-shadow(0 20px 30px rgba(60,40,110,0.15)); image-rendering: pixelated;">
    </div>`;
  }
  // ==========================================

 function homeView() {
    return `
      ${largeBackgroundScenery()} <!-- Placed outside page-shell to prevent clipping -->
      ${scatteredArt()}           <!-- Placed outside page-shell to prevent clipping -->
      <div class="page-shell">
        ${pixelField()}
        <section class="hero">
          <div class="hero-grid">
            <div class="hero-copy">
              <span class="pill">${icons.sparkle} Built for Indian creators · UPI-first</span>
              <h1>India's platform to <span class="gradient-text">Build, Fund & Create.</span></h1>
              <p class="hero-sub">Turn your ideas into real projects. Raise funding, showcase your work, and find opportunities — all in one place.</p>
              <div class="hero-actions">
                <button class="btn btn-primary magnetic" data-start-project>Start a Project <span>→</span></button>
                <a class="btn btn-ghost magnetic" href="#/explore">Explore Creators</a>
              </div>
              <div class="stats-grid">
                <div class="stat-card neu-card"><div class="stat-value">₹4.2 Cr+</div><div class="stat-label">Funds raised on DevFund India</div></div>
                <div class="stat-card neu-card"><div class="stat-value">12,400+</div><div class="stat-label">Creators building</div></div>
                <div class="stat-card neu-card"><div class="stat-value">860+</div><div class="stat-label">Projects funded</div></div>
                <div class="stat-card neu-card"><div class="stat-value">3,100+</div><div class="stat-label">Freelance jobs completed</div></div>
              </div>
            </div>
            <div class="hero-visual">
              <div class="hero-feature">
                <img src="assets/gaming.jpg" alt="Creator developing a game" fetchpriority="high">
                <div class="hero-feature-content">
                  <span class="category-chip">Indie Games</span>
                  <h3>Aether — A Hand-Drawn 2D Adventure</h3>
                  <p>by Ananya Das · Guwahati, Assam</p>
                  <div class="progress-row"><span>₹2,45,000 raised</span><span>49% of ₹5,00,000</span></div>
                  <div class="progress"><span style="width:49%"></span></div>
                </div>
              </div>
              <div class="floating-verify" aria-label="Identity verified">
                <span class="verify-icon">${icons.shield}</span>
                <span><b>Identity Verified</b><small>Real KYC, real trust</small></span>
              </div>
              <span class="hero-decor hero-decor-crown" aria-hidden="true">${icons.crown}</span>
              <span class="hero-decor hero-decor-star" aria-hidden="true">${icons.starDecor}</span>
              <span class="hero-decor hero-decor-gem" aria-hidden="true">${icons.gemDecor}</span>
              <span class="hero-decor hero-decor-mushroom" aria-hidden="true">${icons.mushroomDecor}</span>
              <span class="hero-decor hero-decor-chest" aria-hidden="true">${icons.chestDecor}</span>
              <span class="hero-decor hero-decor-checker-tl" aria-hidden="true">${icons.checkerDecor}</span>
              <span class="hero-decor hero-decor-checker-tr" aria-hidden="true">${icons.checkerDecor}</span>
            </div>
          </div>
        </section>

        <section class="section" id="featured-projects">
          ${sectionDecor('sd-tr','sd-md',icons.starDecor)}
          ${sectionDecor('sd-tl','sd-sm',icons.checkerDecor)}
          ${sectionHead('Featured projects','Hand-picked campaigns building something real in India','Browse all projects','#/projects')}
          <div class="cards-3">${projects.slice(0,3).map(projectCard).join('')}</div>
        </section>

        <section class="section" id="recently-funded">
          ${sectionDecor('sd-bl','sd-sm',icons.coinDecor)}
          ${sectionDecor('sd-tr','sd-sm',icons.checkerDecor)}
          ${sectionHead('Recently funded','Campaigns gaining momentum right now','See more','#/projects')}
          <div class="cards-3">${[projects[2],projects[3],projects[0]].map(projectCard).join('')}</div>
        </section>

        <section class="section" id="creators">
          ${sectionDecor('sd-tr','sd-md',icons.gemDecor)}
          ${sectionDecor('sd-bl','sd-sm',icons.sparkleDecor)}
          ${sectionDecor('sd-br','sd-sm',icons.pixelGuyDecor)}
          ${sectionHead('Trending creators','Discover artists, developers, and makers across India','Explore creators','#/explore')}
          <div class="creator-grid">${creators.slice(0,6).map(creatorCard).join('')}</div>
        </section>

        <section class="section" id="services">
          ${sectionDecor('sd-tl','sd-md',icons.mushroomDecor)}
          ${sectionDecor('sd-tr','sd-sm',icons.checkerDecor)}
          ${sectionHead('Popular freelance services','Hire verified creators — from game dev to 3D art','Browse marketplace','#/freelancers')}
          <div class="cards-3">${services.slice(0,3).map(serviceCard).join('')}</div>
        </section>

        <section class="section" id="how-it-works">
          ${sectionDecor('sd-tr','sd-lg',icons.crown)}
          ${sectionDecor('sd-bl','sd-md',icons.cloudDecor)}
          ${sectionDecor('sd-tl','sd-sm',icons.checkerDecor)}
          
          <div class="section-head center">
            <div class="sh-rotated-border"></div>
            <div>
              <h2>How it <span class="gradient-text">works</span></h2>
              <p class="muted">The complete ecosystem for Indian creators</p>
            </div>
          </div>
          
          <div class="bento-grid">
            <article class="bento-card feature glass-card glow-card">
              <span class="bento-icon">${icons.rocket}</span><span class="bento-number">1</span>
              <h3>Create your profile</h3><p>Sign up, verify your email and phone, and build a professional creator profile with your portfolio.</p>
            </article>
            <article class="bento-card glass-card glow-card">
              <span class="bento-icon">${icons.wallet}</span><span class="bento-number">2</span>
              <h3>Launch a project</h3><p>Set a funding goal in ₹, add reward tiers, and tell your story. Your project goes live after a quick review.</p>
            </article>
            <article class="bento-card glass-card glow-card">
              <span class="bento-icon">${icons.users}</span><span class="bento-number">3</span>
              <h3>Get discovered & backed</h3><p>Backers discover your work and contribute via UPI. Track progress from your dashboard.</p>
            </article>
            <article class="bento-card glass-card glow-card">
              <span class="bento-icon">${icons.badge}</span><span class="bento-number">4</span>
              <h3>Deliver & build reputation</h3><p>Ship rewards or freelance work. Earn verified reviews that make your next project easier to fund.</p>
            </article>
          </div>
        </section>

        <section class="section" id="trust">
          ${sectionDecor('sd-tl','sd-md',icons.chestDecor)}
          ${sectionDecor('sd-br','sd-sm',icons.blockDecor)}
          ${sectionDecor('sd-bl','sd-sm',icons.pixelGuyDecor)}
          
          <div class="section-head center">
            <div class="sh-rotated-border"></div>
            <div>
              <h2>Trust & <span class="gradient-text">Safety</span></h2>
              <p class="muted">Where money and professional work are involved, trust isn't optional</p>
            </div>
          </div>
          
          <div class="trust-grid">
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>Verification badges you can trust</h3><p>Creators earn Email, Phone, Identity, and Payment Verified badges through real verification steps.</p></div></article>
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>Transparent Project Trust panel</h3><p>Every project shows creator account age, previous deliveries, funding progress, and risk disclosure.</p></div></article>
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>UPI-first Indian payments</h3><p>Designed for how India actually pays. Connect UPI, cards, net banking and wallets through regulated gateways.</p></div></article>
            <article class="trust-card glass-card glow-card"><span class="verify-icon">${icons.shield}</span><div><h3>Moderated, not anonymous</h3><p>Projects are reviewed before going live. Reports, disputes, and suspensions belong to a real moderation workflow.</p></div></article>
          </div>
          <div class="trust-badges">${verificationBadges()}<a class="badge" href="#/explore">Learn how verification works →</a></div>
        </section>

        <section class="section" id="stories">
          ${sectionDecor('sd-tr','sd-md',icons.heartBubbleDecor)}
          ${sectionDecor('sd-bl','sd-sm',icons.starDecor)}
          ${sectionDecor('sd-tl','sd-sm',icons.checkerDecor)}
          
          <div class="section-head center">
            <div class="sh-rotated-border"></div>
            <div>
              <h2>Indian creator <span class="gradient-text">stories</span></h2>
              <p class="muted">Real journeys from the DevFund India community</p>
            </div>
          </div>
          
          <div class="stories-grid">${stories.map(s => `
            <article class="story-card glass-card glow-card"><div class="quote-mark">”</div><blockquote>${s.quote}</blockquote><div class="story-person">${avatarMarkup(s.avatar,s.creator,'avatar-xs story-avatar')}<span><b>${s.creator}</b><span>${s.role}</span></span></div></article>`).join('')}</div>
        </section>

        <section class="section" id="faq">
          ${sectionDecor('sd-tl','sd-sm',icons.coinDecor)}
          ${sectionDecor('sd-br','sd-md',icons.gemDecor)}
          ${sectionDecor('sd-tr','sd-sm',icons.checkerDecor)}
          ${sectionDecor('sd-bl','sd-sm',icons.chestDecor)}
          
          <div class="section-head center">
            <div class="sh-rotated-border"></div>
            <div>
              <h2>Frequently asked <span class="gradient-text">questions</span></h2>
            </div>
          </div>
          
          <div class="faq-wrap">${faqs.map((f,i)=>`<article class="faq-item glass-card"><button class="faq-q" type="button" aria-expanded="false"><span>${f[0]}</span><svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"/></svg></button><div class="faq-a"><div>${f[1]}</div></div></article>`).join('')}</div>
        </section>

        ${ctaFooter()}
      </div>`;
  }

  function ctaFooter() {
    return `
      <section class="section-tight">
        <div class="cta-band">
          <h2>Ready to build something real?</h2>
          <p>Join thousands of Indian creators funding their work, getting discovered, and building reputation — one project at a time.</p>
          <div class="cta-actions"><button class="btn btn-white magnetic" data-start-project>Start a Project <span>→</span></button><a class="btn btn-outline-light magnetic" href="#/freelancers">Hire a Creator</a></div>
        </div>
      </section>
      <footer class="site-footer">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="#/"><span class="brand-mark">${icons.sparkle}</span><span class="brand-word">DevFund <strong>India</strong></span></a>
            <p>India's platform to build, fund & create. Raise funding, showcase your work, and find opportunities — all in one place.</p>
            <p><strong>Made in India 🇮🇳 · UPI-first payments</strong></p>
          </div>
          <div class="footer-col"><h4>Platform</h4><a href="#/explore">Explore Creators</a><a href="#/projects">Browse Projects</a><a href="#/freelancers">Freelance Marketplace</a><a href="#/#how-it-works">How it Works</a><a href="#/projects">Start a Project</a></div>
          <div class="footer-col"><h4>Creators</h4><a href="#/explore">Creator Handbook</a><a href="#/projects">Funding Guide</a><a href="#/freelancers">Pricing & Fees</a><a href="#/#trust">Verification</a><a href="#/#stories">Creator Stories</a></div>
          <div class="footer-col"><h4>Trust & Safety</h4><a href="#/#trust">Trust & Safety Center</a><a href="#/#trust">Verification Process</a><a href="#/#trust">Report Abuse</a><a href="#/#trust">Dispute Resolution</a><a href="#/#trust">Community Guidelines</a></div>
          <div class="footer-col"><h4>Company</h4><a href="#/">About DevFund India</a><a href="#/">Careers</a><a href="#/">Press</a><a href="#/">Blog</a><a href="#/">Contact Support</a></div>
        </div>
        <p class="footer-disclaimer"><strong>Disclaimer:</strong> DevFund India is a platform that connects creators and backers. Funding on this platform is reward-based crowdfunding or voluntary support — it is <strong>not</strong> investment, equity, or a guarantee of financial returns. Creators are responsible for delivering rewards and for their own tax, GST, and legal obligations. Payment processing, KYC, and escrow are provided through regulated third-party partners. Always review a project's risks before backing.</p>
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
    return `<div class="page-shell">${pixelField()}${routeHero('Freelance marketplace','Hire verified creators for production-ready work — with clear pricing, delivery timelines and trust signals.','Services')}
      <div class="cards-3">${services.map(serviceCard).join('')}</div>
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
    const bars = [['Communication',100,'5.0'],['Quality',100,'5.0'],['Timeliness',80,'4.0'],['Professionalism',100,'5.0']];
    return `
      <h2 class="analytics-title">Analytics, Trust & Experience</h2>
      <div class="neu-analytics">
        <div class="neu-col">
          <article class="neu-card neu-trust">
            <div class="neu-trust-head">
              <div><div class="muted neu-label">Trust Rating</div><div class="score-big">91<span>/100</span></div></div>
              <div class="stars">★★★★★ <span class="stars-num">5.0</span></div>
            </div>
            <div class="neu-bars">
              ${bars.map(x=>`<div class="neu-bar"><label><span>${x[0]}</span><span>${x[2]}</span></label><div class="neu-bar-track"><span class="neu-bar-fill" data-pct="${x[1]}"></span></div></div>`).join('')}
            </div>
            <p class="muted neu-trust-foot">4/4 verifications · ${c.projects} delivered projects</p>
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
            <div class="neu-trend-head"><span class="muted neu-label">Funding raised (8-mo trend)</span><span class="neu-trend-arrow">${icons.trendUp}</span></div>
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

  function creatorView(key) {
    const c = creators.find(x => x.key === key) || creators[0];
    const ownProjects = projects.filter(x => x.creatorKey === c.key);
    const ownServices = services.filter(x => x.creatorKey === c.key);
    return `<div class="page-shell">${pixelField()}
      <section class="profile-cover"></section>
      <div class="profile-shell">
        ${profileBentoGrid(c)}
        ${creatorBentoGrid(c, ownProjects, ownServices)}
        ${analyticsNeuGrid(c)}
        ${ownProjects.length || ownServices.length ? `<section class="section"><div class="section-head"><div><h2>${c.name}'s work</h2><p>Campaigns and freelance services on DevFund India</p></div></div>${ownServices.length ? `<div class="cards-3">${ownServices.map(serviceCard).join('')}</div>` : `<div class="cards-3">${ownProjects.map(projectCard).join('')}</div>`}</section>`:''}
      </div>
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
          <div class="tabs"><button class="tab active">Story</button><button class="tab">Updates</button><button class="tab">Rewards</button><button class="tab">Reviews</button><button class="tab">Risks</button></div>
          <div class="project-story">
            <p class="muted">${p.story}</p>
            <div class="story-quote glass-card"><p>${p.quote}</p></div>
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
            <a class="text-link reward-link" href="#" data-toast="Reward tiers coming soon">Choose a reward</a>
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

  function initGSAPParallax() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
  
    ScrollTrigger.getAll().forEach(t => t.kill());
  
    // 1. Animate scattered tiny icons
    const floaters = document.querySelectorAll('.decor-icon, .section-decor, .scatter-icon');
    floaters.forEach((icon) => {
      const speed = 150 + Math.random() * 600; 
      const rot = Math.random() * 100 - 50; 
  
      gsap.to(icon, {
        y: -speed,
        rotation: `+=${rot}`, 
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        }
      });
    });

    // 2. Animate the 3 custom external images at calculated slow speeds!
    const windowHeight = window.innerHeight;
    const cornerArts = document.querySelectorAll('.custom-pixel-art');
    const distances = [windowHeight + 400, windowHeight + 600, windowHeight + 800]; 

    cornerArts.forEach((art, index) => {
      gsap.to(art, {
        y: -distances[index], 
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 1 
        }
      });
    });
  }

  function renderRoute() {
    const {parts, anchor} = parseRoute();
    const page = parts[0] || '';
    document.body.classList.toggle('is-community-page', page === 'community');
    if (!page) app.innerHTML = homeView();
    else if (page === 'projects') app.innerHTML = projectsView();
    else if (page === 'explore') app.innerHTML = exploreView();
    else if (page === 'freelancers') app.innerHTML = freelancersView();
    else if (page === 'creator') app.innerHTML = creatorView(parts[1]);
    else if (page === 'service') app.innerHTML = serviceView(parts[1]);
    else if (page === 'project') app.innerHTML = projectView(parts[1]);
    else if (page === 'search') app.innerHTML = searchRouteView();
    else if (page === 'community') app.innerHTML = communityView();
    else app.innerHTML = `<div class="page-shell">${pixelField()}<div class="empty-state glass-card"><span class="brand-mark">${icons.sparkle}</span><h2>Page not found</h2><p>The page you requested does not exist in this prototype.</p><a class="btn btn-primary" href="#/">Go home</a></div>${ctaFooter()}</div>`;

    bindDynamicUI();
    if (page === 'community') bindCommunityUI();
    initScrollReveal();
    initProgressBars();
    initGSAPParallax();
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({behavior:'smooth'}));
    else window.scrollTo({top:0,behavior:'auto'});
    app.focus({preventScroll:true});
  }

  let revealObserver = null;
  const REVEAL_SELECTOR = '.project-card,.creator-card,.service-card,.bento-card,.cb-tile,.pb-tile,.trust-card,.story-card,.stat-card,.faq-item,.metric-card,.experience-cell,.detail-card,.trend-card,.neu-card,.order-step,.route-hero-inner,.section-head';

  function initScrollReveal() {
    const els = $$(REVEAL_SELECTOR, app);

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
          const cleanup = (ev) => {
            if (ev.target !== el || ev.propertyName !== 'transform') return;
            el.classList.remove('reveal', 'in-view');
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', cleanup);
          };
          el.addEventListener('transitionend', cleanup);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 15% 0px' });

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
      ...services.map(x=>({type:'Service',title:x.title,sub:`Starting at ₹${fmt(x.price)}`,href:`#/service/${x.key}`})),
      ...guilds.map(x=>({type:'Guild',title:x.name,sub:`${x.tag} · ${fmt(x.members)} members`,href:'#/community'}))
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

  // --- FORCE MOBILE MENU UPDATE ---
const fixMenu = $('#mobileMenu');
if (fixMenu) {
  // Fix the boxy corners
  fixMenu.style.borderRadius = '24px';
  
  // Inject the missing categories
  fixMenu.innerHTML = `
    <a href="#/discover">Discover</a>
    <a href="#/games">Games</a>
    <a href="#/explore">Creators</a>
    <a href="#/freelancers">Freelance</a>
    <a href="#/assets">Assets</a>
    <a href="#/projects">Projects</a>
    <a href="#/market">Market</a>
    <a href="#/community">Community</a>
    <button type="button" data-search-open>Search</button>
    <button class="btn btn-primary" type="button" data-start-project>Start a Project</button>
  `;
}

  function toggleMobileMenu(force) {
    const menu = $('#mobileMenu');
    const backdrop = $('#mobileMenuBackdrop');
    const btn = $('#mobileMenuBtn');
    const next = typeof force === 'boolean' ? force : menu.hidden;
    menu.hidden = !next;
    if (backdrop) {
      backdrop.hidden = !next;
      requestAnimationFrame(() => backdrop.classList.toggle('show', next));
    }
    btn.setAttribute('aria-expanded', next ? 'true':'false');
    document.body.style.overflow = next ? 'hidden' : '';
    document.documentElement.style.overflow = next ? 'hidden' : '';
  }
  $('#mobileMenuBtn').addEventListener('click', () => toggleMobileMenu());
  $('#mobileMenu').addEventListener('click', e => { if (e.target.closest('a,button')) toggleMobileMenu(false); });
  $('#mobileMenuBackdrop')?.addEventListener('click', () => toggleMobileMenu(false));

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

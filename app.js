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

  const NEXORA_MARK = '<svg viewBox="0 0 32 32" fill="none"><path d="M7 24V8h6l12 16V8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 24 25 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".45"/></svg>';

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
      title: 'Aether \u2014 A Hand-Drawn 2D Adventure from Assam',
      desc: 'A story-driven puzzle-adventure about a girl restoring a fractured world.',
      story: 'A hand-painted 2D adventure blending Assamese folk art with puzzle-driven exploration.',
      quote: 'Every background in Aether is hand-painted first, then animated frame by frame. We wanted the world to feel like a living folk tale, not a generic pixel forest.',
      creator: 'Ananya Das', creatorKey: 'ananya-das', avatar: null,
      raised: 245000, goal: 500000, backers: 143, days: 24, image: 'assets/gaming.jpg',
      accountAge: 210, previousProjects: 3, deliveries: 3, lastUpdate: '2026-07-30'
    },
    {
      id: 'synthwave', category: 'Music', tone: 'pink', likes: 87,
      title: 'Synthwave Mumbai \u2014 An Original Soundtrack Album',
      desc: '12-track retro-futurist album blending synthwave with classical Indian textures.',
      story: 'A 12-track concept album recorded across three studios in Mumbai over eight months.',
      quote: 'I wanted synthwave that actually sounds like it grew up on a diet of Bollywood strings, not just another neon-city pastiche.',
      creator: 'Rohan Mehta', creatorKey: 'rohan-mehta', avatar: null,
      raised: 118000, goal: 150000, backers: 87, days: 16, image: null,
      accountAge: 150, previousProjects: 2, deliveries: 2, lastUpdate: '2026-08-01'
    },
    {
      id: 'hampi-vr', category: 'Animation', tone: 'pink', likes: 312,
      title: 'VR Heritage Walk \u2014 Hampi in 3D',
      desc: 'An immersive VR experience recreating the ruins of Hampi for students and travellers.',
      story: 'A VR experience reconstructing 15th-century Hampi using photogrammetry.',
      quote: 'Hampi deserves to be experienced by everyone, not just those who can travel. This VR build recreates the ruins in stunning 3D.',
      creator: 'Vikram Rao', creatorKey: 'vikram-rao', avatar: null,
      raised: 760000, goal: 1200000, backers: 312, days: 53, image: 'assets/office.jpg',
      accountAge: 380, previousProjects: 4, deliveries: 4, lastUpdate: '2026-08-08'
    },
    {
      id: 'solar-sentinel', category: 'Technology', tone: 'blue', likes: 261,
      title: 'Solar Sentinel \u2014 Open-Source IoT Weather Station',
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
    {key:'rohan-mehta', name:'Rohan Mehta', handle:'@rohansynth', role:'Music Producer \u00B7 Synthwave & Classical', location:'Mumbai, Maharashtra', projects:1, followers:'3,100', avatar:null, rating:'4.8', orders:25},
    {key:'karthik-iyer', name:'Karthik Iyer', handle:'@karthikbuilds', role:'Hardware Hacker \u00B7 IoT & Embedded', location:'Coimbatore, Tamil Nadu', projects:3, followers:'6,240', avatar:null, rating:'4.9', orders:44},
    {key:'vikram-rao', name:'Vikram Rao', handle:'@vikramvr', role:'3D Artist \u00B7 VR & Photogrammetry', location:'Bengaluru, Karnataka', projects:2, followers:'5,460', avatar:null, rating:'5.0', orders:31},
    {key:'priya-sharma', name:'Priya Sharma', handle:'@priyabuilds', role:'Indie App Developer \u00B7 EdTech', location:'Pune, Maharashtra', projects:4, followers:'3,780', avatar:null, rating:'4.8', orders:18},
    {key:'meera-nair', name:'Meera Nair', handle:'@meeradraws', role:'Illustrator \u00B7 Watercolor & Comics', location:'Kochi, Kerala', projects:2, followers:'7,120', avatar:null, rating:'4.9', orders:29}
  ];

  const services = [
    {key:'unity-game-development', title:'Unity Game Development \u2014 2D & 3D', creator:'Ananya Das', creatorKey:'ananya-das', avatar:null, image:'assets/service-game.jpg', price:1500, rating:'4.9', days:7, location:'Guwahati, Assam', category:'Programming', desc:'Full-stack Unity development for 2D and 3D games. C# scripting, level design, optimization and polish. Includes source code.', tags:['Unity','C#','2D Games','3D Games','Game Design']},
    {key:'3d-character-modeling', title:'3D Character Modeling & Rigging', creator:'Vikram Rao', creatorKey:'vikram-rao', avatar:null, image:null, price:2500, rating:'5.0', days:10, location:'Bengaluru, Karnataka', category:'3D & Animation', desc:'Production-ready stylized and realistic 3D characters with clean topology, UVs and rigging.', tags:['Blender','Rigging','Character Art','3D']},
    {key:'trailer-editing', title:'Game Trailer Editing & Sound Design', creator:'Rohan Mehta', creatorKey:'rohan-mehta', avatar:null, image:'assets/gaming.jpg', price:2000, rating:'4.8', days:5, location:'Mumbai, Maharashtra', category:'Video & Audio', desc:'Punchy trailers, gameplay edits, sound design and final mix for indie game launches.', tags:['Editing','Sound Design','Trailer','Mixing']},
    {key:'vr-prototype', title:'Interactive VR Prototype for Heritage & Education', creator:'Vikram Rao', creatorKey:'vikram-rao', avatar:null, image:'assets/office.jpg', price:4500, rating:'5.0', days:14, location:'Bengaluru, Karnataka', category:'XR', desc:'Rapid VR prototype development for culture, education and interactive exhibitions.', tags:['VR','Unity','3D','Prototype']}
  ];

  const stories = [
    {quote:'I raised \u20B92.45L for my 2D adventure on Nexora. The UPI flow meant my first backer paid in under a minute. Within a week I had 143 backers and the funds to finish my game.', creator:'Ananya Das', role:'Indie Game Developer \u00B7 Guwahati', avatar:null},
    {quote:'I listed IoT weather stations as a project and freelancing as a service. The freelance orders funded my R&D while the campaign funded production. The reviews built my reputation fast.', creator:'Karthik Iyer', role:'Hardware Hacker \u00B7 Coimbatore', avatar:null},
    {quote:'As a first-time creator, the Project Trust panel actually helped me. Backers could see I was new \u2014 and still chose to support my comic because the risks were honestly stated.', creator:'Meera Nair', role:'Illustrator \u00B7 Kochi', avatar:null}
  ];

  const creatorExtras = {
    'ananya-das': {
      bio: 'Self-taught 2D artist and Unity developer from Guwahati. Ananya blends Assamese folk art with hand-painted worlds \u2014 every background is painted first, then animated frame by frame.',
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
      bio: 'Indie app developer in Pune building playful EdTech tools for Indian classrooms \u2014 designed to run well even on low-end Android devices and patchy connections.',
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
      {name:'Aditya K.', role:'Backer', quote:'Backed Aether on day one \u2014 the art style alone was worth funding. Updates come regularly and this clearly is a labour of love.'},
      {name:'Priyanka R.', role:'Freelance client', quote:'Hired Ananya for a Unity job. Clean code, delivered early, and every decision was explained clearly.'}
    ],
    'rohan-mehta': [
      {name:'Sana W.', role:'Backer', quote:'The Mumbai synthwave album is unlike anything else funded here \u2014 genuinely original, not a generic neon-city knockoff.'},
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
      {name:'Govt. School, Pune', role:'Buyer', quote:'The app works fine even on our oldest classroom tablets \u2014 that alone made it worth adopting.'},
      {name:'Rahul M.', role:'Freelance client', quote:'Priya turned our messy spec into a working prototype in under two weeks.'}
    ],
    'meera-nair': [
      {name:'Anjali S.', role:'Backer', quote:"Meera's watercolor comics feel like nothing else on the platform. Backed her Patreon the same day I found her page."},
      {name:'Coastal Press', role:'Freelance client', quote:'Delivered a full 12-page comic on schedule with zero revisions needed.'}
    ]
  };

  const faqs = [
    ['Is backing a project an investment?','No. Nexora is designed around reward-based crowdfunding or voluntary support. Backers support creators and may receive stated rewards; backing is not equity or a guarantee of financial returns.'],
    ['How do payments work?','The production implementation should connect UPI, cards, net banking and wallets through a regulated payment provider. The interface is already designed to explain each transaction clearly.'],
    ['How does verification work?','Creators can earn separate Email, Phone, Identity and Payment Verified badges. The UI keeps each signal explicit so a single badge never implies more than was actually checked.'],
    ['What fees does Nexora charge?','Nexora applies an 8.5% platform fee to successful marketplace and gig transactions. Applicable taxes and payment-provider charges are shown before confirmation.'],
    ["What if a project doesn't deliver?",'Project risk is disclosed before backing. Production should include reporting, creator updates, dispute handling and refund rules aligned with the payment flow and your legal terms.'],
    ['Can I be both a creator and a backer?','Yes. The product is designed around a creator ecosystem where the same account can discover, support, hire and publish work.']
  ];

  const fmt = value => new Intl.NumberFormat('en-IN').format(value);
  const percent = p => Math.min(100, Math.round((p.raised / p.goal) * 100));

  function avatarMarkup(src, name, cls='avatar-xs') {
    if (src) return `<img class="${cls}" src="${src}" alt="${name}" loading="lazy">`;
    return `<span class="${cls}" aria-hidden="true">${name.charAt(0)}</span>`;
  }

  function creatorFromRef(ref) {
    if (!ref) return null;
    if (typeof ref === 'object') return ref;
    return creators.find(c => c.key === ref || c.name === ref) || null;
  }

  function creatorTrustScore(ref) {
    const c = creatorFromRef(ref);
    if (!c) return 91;
    const rating = Number(c.rating || 4.7);
    const orders = Number(c.orders || 0);
    const projectsDone = Number(c.projects || 0);
    return Math.max(82, Math.min(99, Math.round(78 + rating * 3 + Math.min(orders, 60) * .08 + Math.min(projectsDone, 8) * .5)));
  }

  function trustScoreBadge(ref, compact=false) {
    const score = creatorTrustScore(ref);
    return `<span class="trust-score-badge ${compact ? 'compact' : ''}" title="Prototype trust score based on visible delivery and verification signals">Trust ${score}/100</span>`;
  }

  function kycStatusBadge(ref, compact=false) {
    return `<span class="kyc-verified-badge ${compact ? 'compact' : ''}">${icons.shield} KYC verified</span>${trustScoreBadge(ref, compact)}`;
  }

  function verificationBadges(ref) {
    return `
      <span class="badge">${icons.mail} Email Verified</span>
      <span class="badge">${icons.phone} Phone Verified</span>
      <span class="badge">${icons.shield} Identity Verified</span>
      <span class="badge">${icons.badge} Payment Verified</span>
      ${trustScoreBadge(ref)}`;
  }

  function projectCard(p) {
    const media = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy">`
      : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `
      <article class="project-card glass-card glow-card" data-project="${p.id}">
        <div class="project-media ${p.image ? '' : 'placeholder'}">
          ${media}
          <span class="category-chip media-chip">${escapeHtml(p.category)}</span>
          <span class="like-chip">${icons.heart}${p.likes}</span>
        </div>
        <div class="project-body">
          <h3>${escapeHtml(p.title)}</h3>
          <p class="project-desc">${escapeHtml(p.desc)}</p>
          <div class="creator-mini creator-trust-mini">
            ${avatarMarkup(p.avatar,p.creator)}
            <span>${escapeHtml(p.creator)}</span><span class="verified">Verified</span>${trustScoreBadge(p.creatorKey || p.creator, true)}
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
        <div class="creator-card-identity"><div class="creator-status-line">${kycStatusBadge(c, true)}<span class="creator-live-status"><i></i> Available</span></div></div>
        <div class="avatar-lg-wrap">
          ${avatarMarkup(c.avatar,c.name,'avatar-lg')}
          <span class="verified-dot">✓</span>
        </div>
        <h3>${escapeHtml(c.name)}</h3>
        <div class="creator-handle">${escapeHtml(c.handle)}</div>
        <p class="creator-role">${escapeHtml(c.role)}</p>
        <div class="creator-location">⌾ &nbsp;${escapeHtml(c.location)}</div>
        <div class="creator-meta"><span><span class="star">★</span> ${c.projects} projects</span><span>${c.followers} followers</span></div>
        <div class="badges">${verificationBadges(c)}</div>
      </article>`;
  }

  function serviceCard(s) {
    return enhancedServiceCard(s);
    const image = s.image ? `<img src="${s.image}" alt="${escapeHtml(s.title)}" loading="lazy">` : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `
      <article class="service-card glass-card glow-card" data-service="${s.key}">
        <div class="service-body service-identity-first"><div class="creator-mini creator-trust-mini">${avatarMarkup(s.avatar,s.creator)}<span>${escapeHtml(s.creator)}</span><span class="verified">Verified</span>${trustScoreBadge(s.creatorKey || s.creator, true)}</div></div>
        <div class="service-media ${s.image ? '' : 'project-media placeholder'}">${image}</div>
        <div class="service-body">
          <h3>${escapeHtml(s.title)}</h3>
          <div class="service-meta"><span>★ ${s.rating}</span><span>◷ ${s.days}d</span><span>⌾ ${escapeHtml(s.location)}</span></div>
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
      ${linkText ? `<a class="text-link" href="${linkHref}">${linkText} <span>\u2192</span></a>` : ''}
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
    {id:'medieval-village', title:'Medieval Village Pack', creator:'Vikram Rao', category:'Environments', engine:'Unity \u00B7 URP', formats:'FBX \u00B7 PNG', price:499, rating:'4.8', reviews:124, image:'assets/office.jpg'},
    {id:'cyberpunk-city', title:'Cyberpunk City Pack', creator:'Ananya Das', category:'Environments', engine:'Unreal', formats:'FBX \u00B7 TGA', price:1299, rating:'4.9', reviews:88, image:'assets/gaming.jpg', fixedDrop:true}
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
  // COMMUNITY \u2014 "THE GUILD HALL"
  // A distinct, game-hub styled community space:
  // guilds (not generic "groups") you can found or join,
  // a live feed you can post/react/comment on, all client-side/in-memory.
  // ==========================================
  const escapeHtml = (str) => String(str).replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);

  const guildIconChoices = ['\uD83C\uDFAE','\uD83C\uDFA8','\uD83C\uDFB5','\uD83D\uDCBB','\uD83D\uDEE0\uFE0F','\uD83D\uDCF7','\u270D\uFE0F','\uD83D\uDC09','\u26A1','\uD83C\uDF19','\uD83E\uDDE9','\uD83C\uDFAC'];

  let guilds = [
    { key:'indie-devs', name:'Indie Devs Circle', icon:'\uD83C\uDFAE', color:'purple', members:1240, online:86, tag:'Game Dev', desc:'Ship devlogs, swap feedback, find your next collaborator.', joined:true },
    { key:'pixel-art', name:'Pixel & Paint', icon:'\uD83C\uDFA8', color:'pink', members:860, online:41, tag:'Art', desc:'Sprite critiques, palette swaps, tileset jams.', joined:false },
    { key:'ost-lounge', name:'OST Lounge', icon:'\uD83C\uDFB5', color:'blue', members:512, online:19, tag:'Music', desc:'Share loops, stems and soundtrack works-in-progress.', joined:true },
    { key:'code-cave', name:'The Code Cave', icon:'\uD83D\uDCBB', color:'green', members:980, online:63, tag:'Engineering', desc:'Shader tricks, netcode war stories, code review swaps.', joined:false },
    { key:'founders-table', name:'Founders\u2019 Table', icon:'\uD83D\uDEE0\uFE0F', color:'orange', members:340, online:12, tag:'Business', desc:'Funding strategy, GST doubts, launch playbooks.', joined:false },
    { key:'vr-immersive', name:'VR & Immersive', icon:'\uD83E\uDD7D', color:'cyan', members:275, online:14, tag:'XR', desc:'Photogrammetry, comfort settings, headset debugging.', joined:false }
  ];

  let communityPosts = [
    { id:'p1', guildKey:'indie-devs', author:'Ananya Das', avatar:null, time:'18m ago', pinned:true,
      text:'Devlog #14 \u2014 added parallax to the folk-art backgrounds in Aether. Frame-by-frame animation is brutal but worth every hour.',
      reactions:{fire:42, heart:18, rocket:9},
      comments:[{author:'Rohan Mehta', text:'This looks incredible, the color grading alone \uD83D\uDE0D'},{author:'Vikram Rao', text:'What are you painting the frames in?'}] },
    { id:'p2', guildKey:'code-cave', author:'Karthik Iyer', avatar:null, time:'42m ago', pinned:false,
      text:'Finally squashed the netcode desync bug that\u2019s been haunting our co-op build for two weeks. It was a rounding error in the tick reconciliation, of course.',
      reactions:{fire:21, heart:6, rocket:14},
      comments:[{author:'Ananya Das', text:'The classic "it was always the rounding" ending \uD83D\uDE05'}] },
    { id:'p3', guildKey:'ost-lounge', author:'Rohan Mehta', avatar:null, time:'1h ago', pinned:false,
      text:'Dropped a rough mix of track 7 from Synthwave Mumbai \u2014 layering a sitar sample under the arpeggios. Feedback welcome before mastering.',
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

  // COMMUNITY CHAT \u2014 persistent desktop rail + mobile slide-out drawer.
  // Client-side demo state; wire these actions to a realtime backend later.
  let ghChatActive = 'Ananya Das';
  const ghChats = {
    'Ananya Das': {
      avatar: null,
      status: 'Online \u00B7 Indie Devs Circle',
      messages: [
        {from:'them', text:'Hey! Saw your latest post \u2014 the lighting pass looks great.'},
        {from:'me', text:'Thanks! I am testing a warmer palette tonight.'},
        {from:'them', text:'Nice. Send me the build when you want another pair of eyes.'}
      ]
    },
    'Rohan Mehta': {
      avatar: null,
      status: 'Online \u00B7 OST Lounge',
      messages: [
        {from:'them', text:'I can give the soundtrack mix a listen tomorrow.'},
        {from:'me', text:'Perfect, especially the low-end balance.'}
      ]
    },
    'Karthik Iyer': {
      avatar: null,
      status: 'Online \u00B7 The Code Cave',
      messages: [
        {from:'them', text:'I pushed the networking fix to the test branch.'},
        {from:'me', text:'Awesome. I will test it with the new build.'}
      ]
    }
  };

  function ghChatHtml(mode='desktop'){
    const chat = ghChats[ghChatActive] || ghChats['Ananya Das'];
    const contacts = Object.keys(ghChats);
    return `<section class="gh-chat ${mode === 'mobile' ? 'gh-chat-mobile' : ''}" aria-label="Community chat">
      <div class="gh-chat-head">
        <div><span class="gh-chat-kicker">COMMUNITY CHAT</span><strong>Messages</strong></div>
        ${mode === 'mobile' ? '<button type="button" class="gh-chat-close" data-chat-close aria-label="Close chat">\u00D7</button>' : '<span class="gh-chat-status-dot" title="Chat online"></span>'}
      </div>
      <div class="gh-chat-contacts">
        ${contacts.map(name => `<button type="button" class="gh-chat-contact ${name===ghChatActive?'active':''}" data-chat-contact="${escapeHtml(name)}">
          ${avatarMarkup(ghChats[name].avatar, name, 'avatar-xs')}<span><b>${escapeHtml(name)} <em>Trust ${creatorTrustScore(name)}</em></b><small>✓ KYC · ${escapeHtml(ghChats[name].status)}</small></span><i></i>
        </button>`).join('')}
      </div>
      <div class="gh-chat-thread" id="ghChatThread">
        <div class="gh-chat-thread-title">${avatarMarkup(chat.avatar, ghChatActive, 'avatar-xs')}<div><b>${escapeHtml(ghChatActive)}</b><small>${escapeHtml(chat.status)}</small></div></div>
        <div class="gh-chat-messages">
          ${chat.messages.map(m => `<div class="gh-chat-bubble ${m.from==='me'?'me':''}">${escapeHtml(m.text)}</div>`).join('')}
        </div>
        <form class="gh-chat-form" id="ghChatForm">
          <input id="ghChatInput" type="text" maxlength="240" placeholder="Message ${escapeHtml(ghChatActive)}\u2026" autocomplete="off" />
          <button type="submit" aria-label="Send message">\u2192</button>
        </form>
      </div>
    </section>`;
  }

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
        <div class="gh-post-who"><div class="gh-author-line"><b>${escapeHtml(p.author)}</b>${kycStatusBadge(p.author,true)}<span class="creator-live-status"><i></i> Active</span></div><span class="gh-post-meta">${g ? `${g.icon} ${escapeHtml(g.name)}` : ''} \u00b7 ${p.time}</span></div>
      </div>
      <p class="gh-post-text">${escapeHtml(p.text)}</p>
      <div class="gh-post-actions">
        <button type="button" class="gh-react ${ghReactedKeys.has(p.id+':fire') ? 'reacted' : ''}" data-react="fire" data-post="${p.id}">\uD83D\uDD25 <span>${p.reactions.fire}</span></button>
        <button type="button" class="gh-react ${ghReactedKeys.has(p.id+':heart') ? 'reacted' : ''}" data-react="heart" data-post="${p.id}">\u2764\uFE0F <span>${p.reactions.heart}</span></button>
        <button type="button" class="gh-react ${ghReactedKeys.has(p.id+':rocket') ? 'reacted' : ''}" data-react="rocket" data-post="${p.id}">\uD83D\uDE80 <span>${p.reactions.rocket}</span></button>
        <button type="button" class="gh-share-action" data-toast="Post link copied">${icons.share}<span>Share</span></button>
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
          ${ghChatHtml('desktop')}
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
      </div>

      <button type="button" class="gh-mobile-chat-launch" id="ghMobileChatLaunch" aria-label="Open community chat">
        <span>\uD83D\uDCAC</span><b>Chat</b><em>3</em>
      </button>
      <div class="gh-mobile-chat-drawer" id="ghMobileChatDrawer" hidden>
        ${ghChatHtml('mobile')}
      </div>
    `;
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

  function ghBindChat(root){
    if (!root) return;
    const rerenderChat = () => {
      const desktop = $('.gh-right .gh-chat', root);
      if (desktop) desktop.outerHTML = ghChatHtml('desktop');
      const mobile = $('.gh-mobile-chat-drawer .gh-chat', root);
      if (mobile) mobile.outerHTML = ghChatHtml('mobile');
      wireChatEvents();
    };

    const wireChatEvents = () => {
      $$('[data-chat-contact]', root).forEach(btn => {
        if (btn.dataset.chatBound) return;
        btn.dataset.chatBound = '1';
        btn.addEventListener('click', () => {
          ghChatActive = btn.dataset.chatContact;
          rerenderChat();
        });
      });
      $$('[data-chat-close]', root).forEach(btn => {
        if (btn.dataset.chatBound) return;
        btn.dataset.chatBound = '1';
        btn.addEventListener('click', () => { $('#ghMobileChatDrawer', root).hidden = true; });
      });
      $$('.gh-chat-form', root).forEach(form => {
        if (form.dataset.chatBound) return;
        form.dataset.chatBound = '1';
        form.addEventListener('submit', e => {
          e.preventDefault();
          const input = $('#ghChatInput', form);
          const text = input?.value.trim();
          if (!text) return;
          ghChats[ghChatActive].messages.push({from:'me', text});
          rerenderChat();
          requestAnimationFrame(() => {
            const thread = $('#ghChatThread', root);
            if (thread) { const msgs = $('.gh-chat-messages', thread); if (msgs) msgs.scrollTop = msgs.scrollHeight; }
          });
        });
      });
    };
    wireChatEvents();
    $('#ghMobileChatLaunch', root)?.addEventListener('click', () => {
      const drawer = $('#ghMobileChatDrawer', root);
      if (drawer) { drawer.hidden = false; drawer.classList.remove('is-opening'); requestAnimationFrame(()=>drawer.classList.add('is-opening')); }
    });
  }

  function bindCommunityUI(){
    const root = $('#ghRoot');
    if (!root) return;

    ghBindChat(root);
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
    const priceBlock = a.auction ? `<span class="asset-price">\u20B9${fmt(a.currentBid)}</span>` : `<span class="asset-price">\u20B9${fmt(a.price)}</span>`;
    return `<article class="asset-card flat-card" data-asset="${a.id}"><div class="asset-media">${media}</div><div class="asset-body"><h4>${a.title}</h4><div class="asset-price-row">${priceBlock}</div></div></article>`;
  }

  function activeProjectCard(p) {
    const media = p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<div class="placeholder-icon" aria-hidden="true"></div>`;
    return `<article class="aproj-card flat-card" data-project="${p.id}"><div class="aproj-media">${media}</div><div class="aproj-body"><h4>${p.title.split(' \u2014 ')[0]}</h4><p class="aproj-dev">${p.creator} \u00B7 ${p.category}</p></div></article>`;
  }

  function marketCardMini(c) {
    const m = marketByKey[c.key];
    if (!m) return '';
    const up = m.change >= 0;
    return `<article class="market-card" data-market="${c.key}"><div class="market-card-top">${avatarMarkup(c.avatar, c.name, 'market-avatar')}<div><p class="market-name">${c.name}</p></div></div><div class="market-price-row"><span class="market-price">${m.unitPrice} CC</span></div></article>`;
  }

  function jamCard(j) {
    return `<article class="jam-card flat-card" data-jam="${j.id}"><div class="jam-status-row"><h4>${j.name}</h4><span class="meta-chip">${j.status}</span></div><p class="jam-theme">Theme: ${j.theme} \u00B7 Deadline ${j.deadline}</p></article>`;
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
              <span class="pill">${icons.sparkle} Built for Indian creators \u00B7 UPI-first</span>
              <h1>India's platform to <span class="gradient-text">Build, Fund & Create.</span></h1>
              <p class="hero-sub">Turn your ideas into real projects. Raise funding, showcase your work, and find opportunities \u2014 all in one place.</p>
              <div class="hero-actions">
                <button class="btn btn-primary magnetic" data-start-project>Start a Project <span>\u2192</span></button>
                <a class="btn btn-ghost magnetic" href="#/explore">Explore Creators</a>
              </div>
              <div class="stats-grid">
                <div class="stat-card neu-card"><div class="stat-value">\u20B94.2 Cr+</div><div class="stat-label">Funds raised on Nexora</div></div>
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
                  <h3>Aether \u2014 A Hand-Drawn 2D Adventure</h3>
                  <p>by Ananya Das \u00B7 Guwahati, Assam</p>
                  <div class="progress-row"><span>\u20B92,45,000 raised</span><span>49% of \u20B95,00,000</span></div>
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
          ${sectionHead('Popular freelance services','Hire verified creators \u2014 from game dev to 3D art','Browse marketplace','#/freelancers')}
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
              <h3>Launch a project</h3><p>Set a funding goal in \u20B9, add reward tiers, and tell your story. Your project goes live after a quick review.</p>
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
          <div class="trust-badges">${verificationBadges()}<a class="badge" href="#/explore">Learn how verification works \u2192</a></div>
        </section>

        <section class="section" id="stories">
          ${sectionDecor('sd-tr','sd-md',icons.heartBubbleDecor)}
          ${sectionDecor('sd-bl','sd-sm',icons.starDecor)}
          ${sectionDecor('sd-tl','sd-sm',icons.checkerDecor)}
          
          <div class="section-head center">
            <div class="sh-rotated-border"></div>
            <div>
              <h2>Indian creator <span class="gradient-text">stories</span></h2>
              <p class="muted">Real journeys from the Nexora community</p>
            </div>
          </div>
          
          <div class="stories-grid">${stories.map(s => `
            <article class="story-card glass-card glow-card"><div class="quote-mark">\u201D</div><blockquote>${s.quote}</blockquote><div class="story-person">${avatarMarkup(s.avatar,s.creator,'avatar-xs story-avatar')}<span><b>${s.creator}</b><span>${s.role}</span></span></div></article>`).join('')}</div>
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
          <p>Join thousands of Indian creators funding their work, getting discovered, and building reputation \u2014 one project at a time.</p>
          <div class="cta-actions"><button class="btn btn-white magnetic" data-start-project>Start a Project <span>\u2192</span></button><a class="btn btn-outline-light magnetic" href="#/freelancers">Hire a Creator</a></div>
        </div>
      </section>
      <footer class="site-footer" id="resources">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="#/"><span class="brand-mark brand-mark-nexora">${NEXORA_MARK}</span><span class="brand-word">NEXORA</span></a>
            <p>India's platform to build, fund & create. Raise funding, showcase your work, and find opportunities \u2014 all in one place.</p>
            <p><strong>Made in India \uD83C\uDDEE\uD83C\uDDF3 \u00B7 UPI-first payments</strong></p>
          </div>
          <div class="footer-col"><h4>Explore</h4><a href="#/blog">Blog</a><a href="#/press">Press</a><a href="#/creator-stories">Creator Stories</a><a href="#/how-it-works">How It Works</a></div>
          <div class="footer-col"><h4>Creators</h4><a href="#/creator-handbook">Creator Handbook</a><a href="#/funding-guide">Funding Guide</a><a href="#/verification-process">Verification</a><a href="#/careers">Careers</a></div>
          <div class="footer-col"><h4>Support</h4><a href="#/support">Support</a><a href="#/contact">Contact</a><a href="#/trust-safety">Trust & Safety</a><a href="#/report-abuse">Report Abuse</a><a href="#/dispute-resolution">Dispute Resolution</a></div>
          <div class="footer-col"><h4>Information</h4><a href="#/pricing-fees">Pricing & Fees</a><a href="#/community-guidelines">Community Guidelines</a><a href="#/terms">Terms</a><a href="#/privacy">Privacy</a><a href="#/refund-policy">Refund Policy</a><a href="#/gst-tax">GST & Tax</a></div>
        </div>
        <p class="footer-disclaimer"><strong>Disclaimer:</strong> Nexora is a platform that connects creators and backers. Funding on this platform is reward-based crowdfunding or voluntary support \u2014 it is <strong>not</strong> investment, equity, or a guarantee of financial returns. Creators are responsible for delivering rewards and for their own tax, GST, and legal obligations. Payment processing, KYC, and escrow are provided through regulated third-party partners. Always review a project's risks before backing.</p>
        <div class="footer-bottom"><span>\u00A9 2026 Nexora. All rights reserved.</span><div class="footer-links"><a href="#/terms">Terms of Service</a><a href="#/privacy">Privacy Policy</a><a href="#/refund-policy">Refund Policy</a><a href="#/gst-tax">GST & Tax</a><a href="#/support">Support</a></div></div>
      </footer>`;
  }

  function routeHero(title, subtitle, eyebrow='Discover Nexora') {
    return `<section class="route-hero">
      <span class="section-decor sd-tr sd-lg" aria-hidden="true">${icons.crown}</span>
      <span class="section-decor sd-bl sd-md" aria-hidden="true">${icons.gemDecor}</span>
      <span class="section-decor sd-tl sd-sm" aria-hidden="true">${icons.sparkleDecor}</span>
      <span class="section-decor sd-tr sd-sm" aria-hidden="true">${icons.checkerDecor}</span>
      <span class="section-decor sd-bl sd-sm" aria-hidden="true">${icons.checkerDecor}</span>
      <div class="route-hero-inner glass-card"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${subtitle}</p></div>
    </section>`;
  }

  function missingDetailView(kind, backHref, backLabel) {
    return `<div class="page-shell">${pixelField()}<div class="empty-state glass-card"><span class="brand-mark">${icons.sparkle}</span><h2>${escapeHtml(kind)} not found</h2><p>This link does not match a published ${escapeHtml(kind.toLowerCase())}. It may have been removed or the URL may be incomplete.</p><a class="btn btn-primary" href="${backHref}">Back to ${escapeHtml(backLabel)}</a></div>${ctaFooter()}</div>`;
  }

  function projectsView() {
    return `<div class="page-shell projects-page project-brutal-listing">${pixelField()}${routeHero('Projects worth backing','Explore verified creator campaigns spanning games, technology, music and immersive media.','Crowdfunding')}
      <div class="filter-bar project-brutal-filters neo-brutal-card">${['All','Indie Games','Technology','Animation','Music'].map((x,i)=>`<button class="filter-chip ${i===0?'active':''}" data-project-filter="${x}">${x}</button>`).join('')}</div>
      <div class="cards-3" id="projectListing">${projects.map(projectCard).join('')}</div>
      <section class="brutal-faq project-listing-faq"><div class="neo-brutal-header"><div><p class="eyebrow">Backing FAQ</p><h2>Know the project before you back it</h2></div></div>${[['Why are KYC and trust shown together?','KYC tells you identity checks were completed; the trust score adds visible delivery, rating and account signals. Neither should be treated as a guarantee.'],['Where are rewards?','Open any project and Rewards is the first tab, before Story, Updates, Reviews and Risks.'],['What should I check before backing?','Read the reward scope, creator history, updates, risk register, delivery timing and payment terms together.'],['Can project terms change?','Material changes should be posted clearly and communicated to affected backers before fulfilment.']].map(x=>`<details class="neo-brutal-card"><summary>${x[0]}<span>+</span></summary><p>${x[1]}</p></details>`).join('')}</section>
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
    return `<div class="page-shell">${pixelField()}${routeHero('Freelance marketplace','Hire verified creators for production-ready work \u2014 with clear pricing, delivery timelines and trust signals.','Services')}
      <div class="cards-3">${services.map(serviceCard).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function cbTile({key, color, span='', icon, eyebrow, title, desc, extra='', creatorKey}) {
    return `
      <article class="cb-tile ${color} ${span}" data-bento-tile="${key}" data-bento-creator="${creatorKey}" tabindex="0">
        <span class="cb-decor" aria-hidden="true"></span>
        <div class="cb-head"><span class="cb-icon">${icon}</span><span class="cb-tap">Tap to view \u2192</span></div>
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
    const bioTeaser = bioWords.slice(0, 16).join(' ') + (bioWords.length > 16 ? '\u2026' : '');
    const topQuote = testimonials[0];

    const tiles = [
      cbTile({ key:'profile', color:'cb-purple', span:'cb-w2 cb-h2', icon:icons.sparkle, creatorKey:c.key,
        eyebrow:'Creator', title:c.name, desc:`${c.role} \u00B7 ${c.location}`,
        extra:`${avatarMarkup(c.avatar,c.name,'cb-mini-avatar')}<div class="cb-taglist"><span>${c.followers} followers</span><span>${c.projects} projects</span><span>\u2605 ${c.rating}</span></div>` }),
      cbTile({ key:'about', color:'cb-cream', span:'cb-w2', icon:icons.message, creatorKey:c.key,
        eyebrow:'About', title:'The story so far', desc:bioTeaser }),
      cbTile({ key:'achievements', color:'cb-dark', icon:icons.award, creatorKey:c.key,
        eyebrow:'Milestones', title:'Achievements', desc:'Verified track record, built order by order.' }),
      cbTile({ key:'skills', color:'cb-yellow', icon:icons.code, creatorKey:c.key,
        eyebrow:'Toolkit', title:'Skills & Stack', desc:(extra.skills.slice(0,2).join(' \u00B7 ') || 'Not listed yet'),
        extra:`<div class="cb-taglist">${extra.skills.slice(0,3).map(s=>`<span>${s}</span>`).join('')}</div>` }),
      cbTile({ key:'projects', color:'cb-orange', span:'cb-w2', icon:icons.controller, creatorKey:c.key,
        eyebrow:'Campaigns & work',
        title: campaigns ? `${campaigns} live campaign${campaigns>1?'s':''}` : (ownServices.length ? `${ownServices.length} service${ownServices.length>1?'s':''} listed` : 'Open for commissions'),
        desc: campaigns ? ownProjects[0].title : 'Browse published work, or reach out to commission something new.' }),
      cbTile({ key:'reviews', color:'cb-pink', span:'cb-h2', icon:icons.star, creatorKey:c.key,
        eyebrow:'Backer & buyer reviews', title: topQuote ? topQuote.name : 'No reviews yet',
        desc: topQuote ? `"${topQuote.quote}"` : `Be the first to back or hire ${c.name.split(' ')[0]}.` }),
      cbTile({ key:'trust', color:'cb-green', icon:icons.shield, creatorKey:c.key,
        eyebrow:'Trust & safety', title:'98% completion rate', desc:'~2h avg. response \u00B7 4/4 verifications' }),
      cbTile({ key:'funding', color:'cb-blue', icon:icons.wallet, creatorKey:c.key,
        eyebrow:'Funding',
        title: campaigns ? `\u20B9${fmt(raisedTotal)} raised` : 'Ready to launch',
        desc: campaigns ? `${fmt(backersTotal)} backers across ${campaigns} campaign${campaigns>1?'s':''}` : 'No campaigns live yet \u2014 check back soon.' }),
      cbTile({ key:'connect', color:'cb-lavender', icon:icons.link, creatorKey:c.key,
        eyebrow:'Get in touch', title:'Message or follow', desc:'Reach out directly or check social links.' })
    ];

    return `
      <div class="cb-head-row"><div><h2>${c.name.split(' ')[0]}'s Bento Portfolio</h2><p>Tap any card for the full picture \u2014 built for backers, buyers and hiring creators.</p></div></div>
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
              <div><b style="font-size:19px">${c.name}</b><span style="display:block">${c.handle} \u00B7 ${c.role}</span><span>\u233E ${c.location}</span></div>
            </div>
            <div class="bm-tile cb-cream"><b>${c.followers}</b><span>Followers</span></div>
            <div class="bm-tile cb-cream"><b>${c.projects}</b><span>Projects</span></div>
            <div class="bm-tile cb-cream"><b>${c.rating}</b><span>Rating</span></div>
            <div class="bm-tile cb-cream"><b>${c.orders}</b><span>Completed orders</span></div>
          </div>
          <div class="badges" style="margin-top:14px">${verificationBadges(c)}</div>
          <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
            <button class="btn btn-primary magnetic" data-toast="Following ${c.name}">Follow</button>
            <a class="btn btn-ghost" href="#/messages">${icons.message} Message</a>
            <a class="btn btn-ghost" href="#/creator/${c.key}" data-modal-close="bentoModal">Open full profile page \u2192</a>
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
          { icon:icons.star, t: parseFloat(c.rating) >= 4.9 ? 'Top Rated Creator' : 'Rising Talent', d:`${c.rating}\u2605 average across ${c.orders} orders` },
          { icon:icons.badge, t:`Fully Verified · Trust ${creatorTrustScore(c)}/100`, d:'Email, phone, identity & payment verified' }
        ];
        if (ownProjects.length) achv.push({ icon:icons.rocket, t:`${ownProjects.length} Campaign${ownProjects.length>1?'s':''} Launched`, d:'Crowdfunding track record on Nexora' });
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
        else body = `<div class="bm-quote cb-cream"><p>No published campaigns yet. This creator is available for freelance commissions \u2014 send a message to get started.</p></div>`;
        break;
      case 'reviews':
        eyebrow = 'Backer & buyer reviews'; title = 'What people say';
        body = testimonials.length
          ? testimonials.map(t => `<div class="bm-quote cb-pink"><p>"${t.quote}"</p><div class="bm-quote-person"><b>${t.name}</b>&nbsp;\u00B7 ${t.role}</div></div>`).join('')
          : `<div class="bm-quote cb-cream"><p>No reviews yet \u2014 be the first to back or hire ${c.name}.</p></div>`;
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
            <div class="bm-tile cb-blue"><b>\u20B9${fmt(raisedTotal)}</b><span>Total raised</span></div>
            <div class="bm-tile cb-blue"><b>${fmt(backersTotal)}</b><span>Total backers</span></div>
            <div class="bm-tile cb-blue bm-wide"><b>${ownProjects.length}</b><span>Campaign${ownProjects.length>1?'s':''} launched</span></div>
          </div>` : `<div class="bm-quote cb-cream"><p>${c.name} hasn't launched a crowdfunding campaign yet.</p></div>`;
        break;
      case 'connect':
      default:
        eyebrow = 'Get in touch'; title = 'Connect';
        body = `
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <a class="btn btn-primary magnetic" href="#/messages">${icons.message} Message</a>
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
          <p class="pb-role">${c.handle} \u00B7 ${c.role}</p>
          <p class="pb-loc">${icons.pin} ${c.location}</p>
          <div class="pb-cta">
            <a class="btn btn-ghost pb-btn-ghost" href="#/messages">${icons.message} Message</a>
            <button class="btn btn-primary magnetic" type="button" data-toast="Following ${c.name}">Follow</button>
          </div>
        </article>
        <article class="pb-tile pb-metric cb-cream"><span class="pb-metric-label">Followers</span><span class="pb-metric-value">${c.followers}</span></article>
        <article class="pb-tile pb-metric cb-lavender"><span class="pb-metric-label">Projects</span><span class="pb-metric-value">${c.projects}</span></article>
        <article class="pb-tile pb-metric cb-yellow"><span class="pb-metric-label">Rating</span><span class="pb-metric-value">\u2605 ${c.rating}</span></article>
        <article class="pb-tile pb-metric cb-blue"><span class="pb-metric-label">Completed orders</span><span class="pb-metric-value">${c.orders}</span></article>
        <article class="pb-tile pb-verify cb-dark">
          <div class="pb-verify-copy"><h3>Verification status</h3><p>Badges are earned through real verification \u2014 never assumed.</p></div>
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
              <div class="stars">\u2605\u2605\u2605\u2605\u2605 <span class="stars-num">5.0</span></div>
            </div>
            <div class="neu-bars">
              ${bars.map(x=>`<div class="neu-bar"><label><span>${x[0]}</span><span>${x[2]}</span></label><div class="neu-bar-track"><span class="neu-bar-fill" data-pct="${x[1]}"></span></div></div>`).join('')}
            </div>
            <p class="muted neu-trust-foot">4/4 verifications \u00B7 ${c.projects} delivered projects</p>
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
      <!-- Add the profileBentoGrid call here -->
      ${profileBentoGrid(c)} 
      
      ${creatorBentoGrid(c, ownProjects, ownServices)}
      ${analyticsNeuGrid(c)}
      ${ownProjects.length || ownServices.length ? `<section class="section"><div class="section-head"><div><h2>${c.name}'s work</h2><p>Campaigns and freelance services on Nexora</p></div></div>${ownServices.length ? `<div class="cards-3">${ownServices.map(serviceCard).join('')}</div>` : `<div class="cards-3">${ownProjects.map(projectCard).join('')}</div>`}</section>`:''}
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
          <div class="service-title-row"><div><span class="pill">${s.category}</span><h1>${s.title}</h1><p class="hero-sub" style="font-size:16px">${s.desc}</p></div><div style="display:flex;gap:8px"><button class="icon-btn glass-card" data-toast="Saved to favourites">${icons.heart}</button><button class="icon-btn glass-card" data-toast="Service reported for review">\u2691</button></div></div>
          <div class="tag-list">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          <h2 class="steps-title">How ordering works</h2><p class="steps-sub">Payments are held in escrow and released only when you approve the delivery.</p>
          <div class="order-steps">${['Client sends request','Freelancer accepts','Payment initiated (escrow)','Work begins','Delivery submitted','Client reviews','Payment released'].map((x,i)=>`<div class="order-step glass-card"><span class="step-num">${i+1}</span><span>${x}</span></div>`).join('')}</div>
          <p class="muted" style="font-size:11px;margin:18px 0 0">Prototype workflow. Production connects to a compliant escrow/payment provider.</p>
          <h2 class="steps-title">Reviews (1)</h2>
          <article class="review-card glass-card"><div class="review-head"><b>Aditya K.</b><span style="color:#f5ac16">\u2605 5.0</span></div><p style="font-size:12px">Communication: 5/5 &nbsp;&nbsp; Quality: 5/5 &nbsp;&nbsp; Timeliness: 4/5 &nbsp;&nbsp; Professionalism: 5/5</p><p>${s.creator} delivered a polished prototype ahead of schedule. Great communication throughout.</p><span class="verified-order">\u2713 Verified completed order</span></article>
        </div>
        <aside class="side-stack">
          <article class="order-card glass-panel"><div class="muted" style="font-size:12px">Starting at</div><div class="order-price">\u20B9${fmt(s.price)}</div><div class="order-meta"><span>\u25F7 ${s.days} days</span><span>1 revision</span></div><button class="btn btn-primary magnetic" data-toast="Order request started">Place Order</button><button class="btn btn-ghost" data-toast="Contact request opened">${icons.message} Contact</button></article>
          <article class="seller-card glass-card"><div class="seller-head">${avatarMarkup(creator.avatar,creator.name,'avatar-lg')}<div><b>${creator.name}</b><span>${creator.handle}</span></div></div><div class="seller-stats"><span>\u2605 ${creator.rating}</span><span>${creator.orders} orders</span><span>${creator.location}</span></div><div class="badges" style="justify-content:flex-start">${verificationBadges(creator)}</div><a class="text-link" href="#/creator/${creator.key}" style="margin-top:17px">View creator profile \u2192</a></article>
        </aside>
      </div>
      ${ctaFooter()}
    </div>`;
  }

  function projectView(key) {
    const p = projects.find(x => x.id === key);
    if (!p) return missingDetailView('Project', '#/projects', 'projects');
    const creator = creators.find(c => c.key === p.creatorKey) || creators[0];
    const pct = percent(p);
    const rewards=[['₹299','Supporter','Backer updates · digital credits'],['₹799','Early player','Game key · closed beta access'],['₹1,999','Founder pack','Game · soundtrack · digital artbook'],['₹7,499','World builder','Design call · named character or location']];
    return `<div class="page-shell project-detail project-detail-brutal">
      <nav class="breadcrumb"><a href="#/projects">Projects</a><span>›</span><span>${escapeHtml(p.category)}</span></nav>
      <div class="project-layout">
        <div>
          <div class="project-person-top neo-brutal-card">
            <div class="project-person-main">${avatarMarkup(creator.avatar, creator.name, 'avatar-lg')}<div><small>Project creator</small><b>${escapeHtml(creator.name)}</b><span>${escapeHtml(creator.location)} · ${p.previousProjects} previous projects</span></div></div>
            <div class="project-person-signals">${kycStatusBadge(creator)}<span class="creator-live-status"><i></i> Active creator</span></div>
          </div>
          <div class="project-hero-image"><img src="${p.image || 'assets/gaming.jpg'}" alt="${escapeHtml(p.title)}"></div>
          <div class="project-title-row">
            <div><span class="pill">${escapeHtml(p.category)}</span><h1>${escapeHtml(p.title)}</h1></div>
            <div class="project-social-actions"><button class="icon-btn glass-card" data-toast="Saved to favourites" aria-label="Like project">${icons.heart}</button><button class="icon-btn glass-card" data-toast="Project link copied" aria-label="Share project">${icons.share}</button><button class="icon-btn glass-card project-report" data-toast="Project reported for review" aria-label="Report project">⚑</button></div>
          </div>
          <div class="tabs project-tabs neo-brutal-rail"><button class="tab active" data-project-tab="rewards">Rewards</button><button class="tab" data-project-tab="story">Story</button><button class="tab" data-project-tab="updates">Updates</button><button class="tab" data-project-tab="reviews">Reviews</button><button class="tab" data-project-tab="risks">Risks</button></div>
          <div class="project-panel" data-project-panel="rewards">
            <div class="project-front-callout neo-brutal-header"><div><p class="eyebrow">Backer rewards first</p><h2>Choose what you want to unlock</h2><p>Reward scope, expected delivery and creator trust remain visible before you back.</p></div><span class="neo-brutal-btn">${rewards.length} tiers</span></div>
            <div class="project-reward-grid project-reward-brutal">
              ${rewards.map((r,i)=>`<article class="neo-brutal-card ${i===1?'featured-reward':''}"><span>${r[0]}</span><h3>${r[1]}</h3><p>${r[2]}</p><div class="reward-meta"><small>Estimated delivery</small><b>${i<2?'Oct 2026':'Dec 2026'}</b></div><a class="btn ${i===1?'btn-primary':'btn-secondary'}" href="#/back/${escapeHtml(p.id)}?tier=${i}">Choose reward</a></article>`).join('')}
            </div>
          </div>
          <div class="project-story project-panel" data-project-panel="story" hidden>
            <article class="neo-brutal-card"><p>${escapeHtml(p.story)}</p></article>
            <div class="story-quote neo-brutal-card"><p>${escapeHtml(p.quote)}</p></div>
          </div>
          <div class="project-panel" data-project-panel="updates" hidden>
            <div class="project-update-list">
              <article class="neo-brutal-card"><span>BUILD UPDATE · 2 days ago</span><h3>Milestone progress shared with backers</h3><p>The team published a development changelog, current blockers and the next playable milestone.</p><button data-toast="Creator update followed">Follow this project</button></article>
              <article class="neo-brutal-card"><span>COMMUNITY · 7 days ago</span><h3>Backer questions answered</h3><p>Creator response covers delivery timing, scope changes and how reward fulfilment will be reported.</p><button data-toast="Update discussion opened">Open discussion</button></article>
            </div>
          </div>
          <div class="project-panel" data-project-panel="reviews" hidden>
            <div class="project-review-summary neo-brutal-card"><div><b>4.9</b><span>creator delivery rating</span></div><div><b>${p.deliveries}</b><span>successful deliveries</span></div><div><b>96%</b><span>backers recommend</span></div></div>
            <article class="review-card neo-brutal-card"><div class="review-head"><b>Verified backer</b><span>★ 5.0</span></div><p>The roadmap is easy to understand and the creator shares honest progress instead of only promotional posts.</p><span class="verified-order">✓ Verified backing activity</span></article>
          </div>
          <div class="project-panel" data-project-panel="risks" hidden>
            <div class="risk-register">
              ${[['Scope & schedule','Game-development milestones can move as testing reveals new work.','Medium'],['Team capacity','A small creator team has limited parallel production capacity.','Medium'],['Platform certification','Store or device approval can require changes before launch.','Low'],['Reward delivery','Digital and physical rewards may ship on different timelines.','Medium']].map(x=>`<article class="neo-brutal-card"><div><h3>${x[0]}</h3><span>${x[2]}</span></div><p>${x[1]}</p></article>`).join('')}
            </div>
          </div>
        </div>
        <aside class="side-stack">
          <article class="funding-card neo-brutal-card">
            <div class="funding-top"><b>₹${fmt(p.raised)} raised</b><span class="muted">${pct}% of ₹${fmt(p.goal)}</span></div>
            <div class="progress"><span style="width:${pct}%"></span></div>
            <div class="funding-stats"><div><b>₹${(p.raised/100000).toFixed(2)} L</b><small>raised</small></div><div><b>${p.backers}</b><small>backers</small></div><div><b>${p.days}</b><small>days left</small></div></div>
            <a class="btn btn-primary magnetic" href="#/back/${escapeHtml(p.id)}">Back This Project</a>
            <button class="btn btn-ghost" type="button" data-project-tab-jump="rewards">Choose a reward</button>
          </article>
          <article class="trust-panel neo-brutal-card">
            <div class="trust-head">${icons.shield} <b>Project Trust</b></div>
            <div class="trust-bar-row"><div class="trust-bar"><span style="width:${creatorTrustScore(creator)}%"></span></div><span class="trust-score-text">${creatorTrustScore(creator)}/100</span></div>
            <div class="trust-row"><span>${icons.badge} KYC / identity</span><b class="trust-good">Verified · Trust ${creatorTrustScore(creator)}/100</b></div>
            <div class="trust-row"><span>${icons.clock} Account age</span><b class="trust-good">${p.accountAge} days</b></div>
            <div class="trust-row"><span>${icons.briefcase} Previous projects</span><b class="trust-good">${p.previousProjects}</b></div>
            <div class="trust-row"><span>${icons.badge} Successful deliveries</span><b class="trust-good">${p.deliveries}</b></div>
            <div class="trust-row"><span>${icons.users} Backers</span><b class="trust-good">${p.backers}</b></div>
            <div class="trust-row"><span>${icons.clock} Last update</span><b class="trust-good">${p.lastUpdate}</b></div>
            <p class="muted trust-disclaimer">This score summarizes visible verification and delivery signals. It is not a guarantee of delivery or safety.</p>
          </article>
        </aside>
      </div>
      <section class="brutal-faq project-faq"><div class="neo-brutal-header"><div><p class="eyebrow">Project FAQ</p><h2>Questions before backing</h2></div></div>${[['When am I charged?','The production flow should show the exact payment timing before confirmation and use a compliant payment provider.'],['What happens if a reward changes?','Material scope or fulfilment changes should be posted as a creator update and clearly communicated to affected backers.'],['Can I back without selecting a reward?','Yes. A support-only contribution can be offered when the production payment policy allows it.'],['How should I judge risk?','Review KYC status, trust score, previous deliveries, update history, scope, timeline and the project risk register together.']].map(x=>`<details class="neo-brutal-card"><summary>${x[0]}<span>+</span></summary><p>${x[1]}</p></details>`).join('')}</section>
      ${ctaFooter()}
    </div>`;
  }


  // ============================================================
  // UPDATES / NEWS
  // ============================================================
  const nexoraUpdates = [
    {tag:'Platform', date:'Aug 11, 2026', title:'Nexora expands its creator hub', summary:'New discovery, creator, marketplace and community surfaces are rolling into the hub so creators can build an audience as well as raise funding.', image:'assets/gaming.jpg', accent:'purple'},
    {tag:'Funding', date:'Aug 10, 2026', title:'Aether crosses 49% funding', summary:'The hand-drawn 2D adventure from Guwahati is getting closer to its funding target after a strong week of backer activity.', image:'assets/gaming.jpg', accent:'blue'},
    {tag:'Marketplace', date:'Aug 9, 2026', title:'New environment packs arrive for Unity creators', summary:'Fresh environment and prop collections are now available for indie teams looking to speed up production.', image:'assets/office.jpg', accent:'yellow'},
    {tag:'Community', date:'Aug 8, 2026', title:'Monsoon Game Jam 2026 opens submissions', summary:'Build around the theme \u201CRebirth\u201D and ship something playable before the August 24 deadline.', image:'assets/pixel-island-crystals.png', accent:'pink'},
    {tag:'Creator', date:'Aug 7, 2026', title:'Creator verification gets clearer trust signals', summary:'Profiles now surface account age, successful deliveries, activity and other useful context before you collaborate or back.', image:'assets/vikram.jpg', accent:'green'},
    {tag:'India', date:'Aug 5, 2026', title:'UPI-first creator funding continues to grow', summary:'Nexora is being designed around familiar Indian payment habits while keeping project information transparent for backers.', image:'assets/solar.jpg', accent:'orange'},
    {tag:'Events', date:'Aug 3, 2026', title:'48-Hour Indie Sprint announced', summary:'A short-form game jam for teams that want to prototype fast, learn fast and ship before the weekend is over.', image:'assets/service-game.jpg', accent:'purple'},
    {tag:'Safety', date:'Aug 1, 2026', title:'Trust & safety guidelines updated', summary:'New guidance covers creator verification, project disclosures, community etiquette and responsible marketplace activity.', image:'assets/office.jpg', accent:'green'}
  ];

  function updatesView(){
    return `<div class="page-shell updates-page">${pixelField()}
      <section class="updates-hero">
        <div>
          <p class="eyebrow">Nexora Newsroom</p>
          <h1>What's happening <span class="gradient-text">inside Nexora.</span></h1>
          <p>News, platform updates, creator stories, funding milestones and community headlines in one place.</p>
        </div>
        <div class="updates-hero-badge"><span>${icons.sparkle}</span><b>8 fresh stories</b><small>Updated Aug 11, 2026</small></div>
      </section>
      <section class="updates-grid">
        ${nexoraUpdates.map((n,i)=>`
          <article class="update-card bento-card ${i===0?'update-featured':''} update-${n.accent}">
            <div class="update-media"><img src="${n.image}" alt=""><span>${escapeHtml(n.tag)}</span></div>
            <div class="update-body">
              <small>${escapeHtml(n.date)}</small>
              <h2>${escapeHtml(n.title)}</h2>
              <p>${escapeHtml(n.summary)}</p>
              <a href="#/updates/${i}" class="text-link">Read update <span>\u2192</span></a>
            </div>
          </article>`).join('')}
      </section>
      <section class="updates-ticker bento-card">
        <span class="ticker-label">TRENDING</span>
        <div class="ticker-track">${nexoraUpdates.slice(0,5).map(n=>`<span>${escapeHtml(n.title)} <b>\u2022</b></span>`).join('')}</div>
      </section>
      ${ctaFooter()}
    </div>`;
  }

  function updateDetailView(index){
    const numericIndex=Number(index);
    const n=Number.isInteger(numericIndex) ? nexoraUpdates[numericIndex] : null;
    if(!n) return missingDetailView('Update', '#/updates', 'updates');
    return `<div class="page-shell update-detail-page">${pixelField()}
      <a class="back-link" href="#/updates">\u2190 Back to Updates</a>
      <article class="update-detail bento-card">
        <div class="update-detail-media"><img src="${n.image}" alt=""></div>
        <div class="update-detail-copy">
          <p class="eyebrow">${escapeHtml(n.tag)} \u00B7 ${escapeHtml(n.date)}</p>
          <h1>${escapeHtml(n.title)}</h1>
          <p>${escapeHtml(n.summary)}</p>
          <p>Nexora is building a creator-first ecosystem where projects, talent, funding, assets and communities can live together. This story is part of the platform's running newsroom and can later be connected to a real CMS or editorial backend.</p>
        </div>
      </article>
      ${ctaFooter()}
    </div>`;
  }

  // ============================================================
  // MARKETPLACE \u2014 ASSETS + SMALL FORUMS PANEL
  // ============================================================
  const marketplaceCatalog = [
    ...marketplaceAssets,
    {id:'pixel-forest',title:'Pixel Forest Environment',creator:'Karthik Iyer',category:'2D Environments',engine:'Unity \u00B7 URP',formats:'PNG \u00B7 PSD',price:699,rating:'4.9',reviews:63,image:'assets/pixel-island-crystals.png'},
    {id:'indie-ui-kit',title:'Indie Game UI Kit',creator:'Meera Shah',category:'UI/UX',engine:'Unity \u00B7 Figma',formats:'PNG \u00B7 SVG',price:849,rating:'4.7',reviews:41,image:'assets/service-game.jpg'},
    {id:'sci-fi-mech',title:'Sci-Fi Mech Props',creator:'Ananya Das',category:'3D Props',engine:'Unity \u00B7 Unreal',formats:'FBX \u00B7 GLB',price:1599,rating:'4.8',reviews:92,image:'assets/pixel-island-mech.png'},
    {id:'soundscape-vol1',title:'Synthwave Soundscape Vol. 1',creator:'Rohan Mehta',category:'Music & Audio',engine:'Universal',formats:'WAV \u00B7 MP3',price:499,rating:'4.9',reviews:117,image:'assets/gaming.jpg'},
    {id:'mobile-icons',title:'Mobile Game Icon Pack',creator:'Meera Shah',category:'UI/UX',engine:'Universal',formats:'PNG \u00B7 SVG',price:349,rating:'4.6',reviews:36,image:'assets/pixel-island-crystals.png'},
    {id:'monsoon-village',title:'Monsoon Village Props',creator:'Vikram Rao',category:'Environment Props',engine:'Unity \u00B7 URP',formats:'FBX \u00B7 PNG',price:999,rating:'4.8',reviews:54,image:'assets/office.jpg'},
    {id:'vfx-burst',title:'Stylized VFX Burst Pack',creator:'Karthik Iyer',category:'VFX',engine:'Unity',formats:'VFX Graph \u00B7 PNG',price:749,rating:'4.7',reviews:28,image:'assets/pixel-island-gun.png'},
    {id:'forest-music',title:'Forest Exploration OST',creator:'Rohan Mehta',category:'Music & Audio',engine:'Universal',formats:'WAV \u00B7 MP3',price:899,rating:'5.0',reviews:71,image:'assets/gaming.jpg'}
  ];

  const marketplaceForums = [
    {title:'Best Unity URP asset workflow?',replies:18,time:'24m',tag:'Unity'},
    {title:'Looking for a pixel artist for a jam',replies:11,time:'1h',tag:'Hiring'},
    {title:'Share your favourite free dev tools',replies:27,time:'2h',tag:'Tools'},
    {title:'How are you pricing your first asset?',replies:9,time:'4h',tag:'Marketplace'}
  ];

  function marketplaceAssetCard(a){
    return deepAssetCard(a);
    return `<article class="marketplace-asset-card bento-card glass-card glow-card">
      <div class="marketplace-asset-media"><img src="${a.image}" alt="${escapeHtml(a.title)}"><span>${escapeHtml(a.category)}</span></div>
      <div class="marketplace-asset-body">
        <div class="marketplace-asset-title"><h3>${escapeHtml(a.title)}</h3><span class="asset-rating">\u2605 ${escapeHtml(a.rating)}</span></div>
        <p>by ${escapeHtml(a.creator)} \u00B7 ${escapeHtml(a.engine)}</p>
        <div class="marketplace-asset-meta"><span>${escapeHtml(a.formats)}</span><b>\u20B9${fmt(a.price)}</b></div>
        <button class="btn btn-ghost market-buy" type="button" data-toast="Asset checkout can be connected to your payment gateway">View asset \u2192</button>
      </div>
    </article>`;
  }

  function marketplaceView(){
    return `<div class="page-shell marketplace-page">${pixelField()}
      <section class="marketplace-hero">
        <div>
          <p class="eyebrow">Nexora Marketplace</p>
          <h1>Build faster. <span class="gradient-text">Buy better.</span></h1>
          <p>Game-ready assets, audio, UI kits, environments, VFX and creator-made tools \u2014 with the community right beside them.</p>
        </div>
        <div class="marketplace-controls">
          <button class="market-filter active">All assets</button>
          <button class="market-filter">Unity</button>
          <button class="market-filter">3D</button>
          <button class="market-filter">Audio</button>
          <button class="market-filter">UI/UX</button>
        </div>
      </section>
      <div class="marketplace-layout">
        <section class="marketplace-assets">
          <div class="marketplace-section-head"><div><p class="eyebrow">Asset library</p><h2>Featured marketplace</h2></div><span>${marketplaceCatalog.length} assets</span></div>
          <div class="marketplace-asset-grid">${marketplaceCatalog.map(marketplaceAssetCard).join('')}</div>
        </section>
        
        <!-- Added glass-card here to fix the floating forum text -->
        <aside class="marketplace-forums bento-card glass-card">
          <div class="forums-head"><div><p class="eyebrow">Community</p><h2>Forums</h2></div><a href="#/community">Open \u2192</a></div>
          <p class="muted">Quick discussions from creators shopping and building here.</p>
          <div class="forum-list">${marketplaceForums.map(f=>`<a href="#/community" class="forum-row"><span class="forum-tag">${escapeHtml(f.tag)}</span><strong>${escapeHtml(f.title)}</strong><small>${f.replies} replies \u00B7 ${f.time}</small></a>`).join('')}</div>
          <a class="btn btn-primary forum-cta" href="#/community">Visit Communities</a>
        </aside>
      </div>
      ${ctaFooter()}
    </div>`;
  }
  // ============================================================
  // KYC DOCUMENT UPLOAD \u2014 local prototype UI
  // ============================================================
  const KYC_KEY='nexora_kyc_v1';
  const kycDocs=[
    {id:'pan',title:'PAN Card',desc:'Identity + tax verification',required:true,accept:'.jpg,.jpeg,.png,.pdf'},
    {id:'aadhaar',title:'Aadhaar / government ID',desc:'Identity and address verification',required:true,accept:'.jpg,.jpeg,.png,.pdf'},
    {id:'address',title:'Address proof',desc:'Recent utility bill, passport or accepted address document',required:true,accept:'.jpg,.jpeg,.png,.pdf'},
    {id:'bank',title:'Bank proof',desc:'Cancelled cheque or bank statement for payouts',required:true,accept:'.jpg,.jpeg,.png,.pdf'},
    {id:'business',title:'Business / GST document',desc:'Optional \u2014 useful for registered creators or businesses',required:false,accept:'.jpg,.jpeg,.png,.pdf'}
  ];

  function loadKyc(){
    try{return JSON.parse(localStorage.getItem(KYC_KEY)||'{}')}catch(e){return {}}
  }
  function saveKyc(x){localStorage.setItem(KYC_KEY,JSON.stringify(x))}
  function kycStatus(doc, data){
    const x=data[doc.id];
    if(!x) return `<span class="kyc-status missing">Not uploaded</span>`;
    return `<span class="kyc-status uploaded">\u2713 Selected \u00B7 ${escapeHtml(x.name)}</span>`;
  }
  function kycView(){
    const a=currentAccount(); if(!a) return loginView();
    const data=loadKyc();
    const required=kycDocs.filter(d=>d.required);
    const done=required.filter(d=>data[d.id]).length;
    return `<div class="page-shell kyc-page">${pixelField()}
      <section class="kyc-hero bento-card">
        <div><p class="eyebrow">Account verification</p><h1>Identity & KYC</h1><p>Upload the essential documents required to verify your identity and, when applicable, enable funding or payout features.</p></div>
        <div class="kyc-progress"><strong>${done}/${required.length}</strong><span>required documents selected</span><div><i style="width:${Math.round(done/required.length*100)}%"></i></div></div>
      </section>
      <div class="kyc-layout">
        <section class="kyc-docs">
          ${kycDocs.map(d=>`<article class="kyc-doc bento-card ${data[d.id]?'is-uploaded':''}">
            <div class="kyc-doc-icon">${d.required?icons.shield:icons.briefcase}</div>
            <div class="kyc-doc-copy"><div class="kyc-title-row"><h2>${escapeHtml(d.title)}</h2><span>${d.required?'Required':'Optional'}</span></div><p>${escapeHtml(d.desc)}</p>${kycStatus(d,data)}</div>
            <label class="kyc-upload-btn"><input type="file" data-kyc-file="${d.id}" accept="${d.accept}" hidden><span>${data[d.id]?'Replace document':'Choose file'} \u2192</span></label>
          </article>`).join('')}
        </section>
        <aside class="kyc-side bento-card">
          <p class="eyebrow">Before you upload</p><h2>Keep it secure.</h2>
          <ul><li>Use clear, readable scans or photos.</li><li>Make sure your name matches your Nexora profile.</li><li>Do not upload passwords, OTPs or card PINs.</li><li>Only upload documents needed for verification.</li></ul>
          <div class="kyc-warning">Prototype storage: selected filenames are saved locally in this browser. Files are <b>not securely uploaded to a server yet.</b></div>
          <a class="btn btn-secondary" href="#/account">\u2190 Back to account</a>
        </aside>
      </div>
    </div>`;
  }

  const routeLandingMeta = {
    discover: {
      eyebrow: 'Discovery',
      title: 'Discover what creators are building',
      subtitle: 'Browse standout projects, verified creators and marketplace picks from across Nexora.',
      cards: [
        ['Featured Projects', 'Back promising campaigns from games, technology, music and immersive media.', '#/projects'],
        ['Creator Directory', 'Meet artists, developers, musicians, makers and storytellers across India.', '#/explore'],
        ['Marketplace Picks', 'Find game-ready assets, services and creator-made tools.', '#/marketplace']
      ]
    },
    games: {
      eyebrow: 'Games',
      title: 'Indie games, assets and services',
      subtitle: 'Fund games, hire game creators, join jams and pick up production-ready assets.',
      cards: [
        ['Game Campaigns', 'Explore playable worlds, prototypes and game funding milestones.', '#/projects'],
        ['Game Services', 'Hire verified Unity, art, audio and trailer specialists.', '#/freelancers'],
        ['Game Assets', 'Browse UI kits, environments, VFX and sound packs.', '#/marketplace']
      ]
    },
    auctions: {
      eyebrow: 'Marketplace',
      title: 'Fixed-price creator drops',
      subtitle: 'Limited marketplace inventory with transparent prices, licences and delivery terms.',
      cards: [
        ['Current Drops', 'Browse limited asset listings and rare creator releases.', '#/drop/cyberpunk-city'],
        ['Marketplace Rules', 'Review fixed-price purchase, licence and delivery terms.', '#/pricing-fees'],
        ['Seller Tools', 'List limited packs and premium releases without bidding.', '#/asset-manager']
      ]
    },
    jams: {
      eyebrow: 'Game Jams',
      title: 'Build fast with the community',
      subtitle: 'Jam announcements, team finding, submissions and showcase pages can branch from this hub.',
      cards: [
        ['Monsoon Game Jam', 'Track the current theme, deadline and submissions.', '#/updates/3'],
        ['Find Teammates', 'Meet developers, artists, musicians and testers.', '#/community'],
        ['Jam Assets', 'Grab starter packs and templates from the marketplace.', '#/marketplace']
      ]
    },
    jobs: {
      eyebrow: 'Jobs',
      title: 'Creator-friendly opportunities',
      subtitle: 'Freelance gigs, studio roles and collaboration calls can be collected here.',
      cards: [
        ['Hire Talent', 'Start with verified freelancers and service listings.', '#/freelancers'],
        ['Creator Profiles', 'Review portfolios and trust signals before outreach.', '#/explore'],
        ['Community Calls', 'Post lightweight collaboration requests.', '#/community']
      ]
    },
    funding: {
      eyebrow: 'Funding',
      title: 'Funding tools for creator projects',
      subtitle: 'Campaigns, backer trust, milestones and payout flows come together here.',
      cards: [
        ['Live Campaigns', 'Review active projects and funding progress.', '#/projects'],
        ['Trust Signals', 'Show backers verification, delivery and risk context.', '#/#trust'],
        ['Start a Project', 'Open the prototype project draft form.', '#/projects']
      ]
    },
    devlogs: {
      eyebrow: 'Devlogs',
      title: 'Follow creator progress',
      subtitle: 'Updates, work-in-progress posts and production notes can grow from this page.',
      cards: [
        ['Latest Updates', 'Read platform and creator news from the newsroom.', '#/updates'],
        ['Creator Stories', 'Jump into founder and backer stories.', '#/#stories'],
        ['Community Posts', 'Discuss work in progress with other creators.', '#/community']
      ]
    },
    events: {
      eyebrow: 'Events',
      title: 'Creator events and launches',
      subtitle: 'Feature upcoming jams, launches, workshops and sprint calendars.',
      cards: [
        ['48-Hour Indie Sprint', 'See the latest event announcement.', '#/updates/6'],
        ['Community Hub', 'Coordinate teams and event discussions.', '#/community'],
        ['Creator Directory', 'Find speakers, mentors and collaborators.', '#/explore']
      ]
    },
    tutorials: {
      eyebrow: 'Tutorials',
      title: 'Learn, ship and fund better',
      subtitle: 'Tutorial collections can guide creators through production, funding and marketplace setup.',
      cards: [
        ['Funding Guide', 'Start with project pages and trust panels.', '#/projects'],
        ['Marketplace Setup', 'Study asset listings and pricing examples.', '#/marketplace'],
        ['Profile Basics', 'Review creator pages and portfolio structure.', '#/explore']
      ]
    },
    leaderboards: {
      eyebrow: 'Leaderboards',
      title: 'Top creators and projects',
      subtitle: 'Rank active campaigns, creators, backers and marketplace drops from one hub.',
      cards: [
        ['Trending Projects', 'Compare funding and backer momentum.', '#/projects'],
        ['Top Creators', 'Browse ratings, followers and delivery counts.', '#/explore'],
        ['Marketplace Leaders', 'Surface highly rated asset makers.', '#/marketplace']
      ]
    },
    rewards: {
      eyebrow: 'Rewards',
      title: 'Backer rewards and creator perks',
      subtitle: 'Reward tiers, credits, perks and unlocks can be organized here.',
      cards: [
        ['Back Campaigns', 'Find projects with rewards and milestones.', '#/projects'],
        ['Account Credits', 'Review credits, orders and funded activity.', '#/account'],
        ['Creator Offers', 'Explore service and marketplace perks.', '#/freelancers']
      ]
    }
  };

  function routeLandingView(page) {
    const meta = routeLandingMeta[page];
    if (!meta) return '';
    return `<div class="page-shell">${pixelField()}${routeHero(meta.title, meta.subtitle, meta.eyebrow)}
      <div class="bento-route-grid brutal-grid">${meta.cards.map(([title, desc, href]) => `<article class="bento-card glass-card route-card neo-brutal-card"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(desc)}</p><a class="text-link" href="${href}">Open <span>\u2192</span></a></article>`).join('')}</div>
      ${ctaFooter()}
    </div>`;
  }

  function searchRouteView() {
    return `<div class="page-shell">${pixelField()}${routeHero('Search Nexora','Use the search control to find projects, creators and services.','Search')}<div class="empty-state glass-card"><span class="brand-mark">${icons.sparkle}</span><h2>Everything in one search</h2><p>Search across crowdfunding projects, verified creators and freelance services.</p><button class="btn btn-primary magnetic" data-search-open>Open search</button></div>${ctaFooter()}</div>`;
  }

  // ============================================================
  // NEXORA PRODUCT EXPANSION
  // Deep discovery, game funding, gig commerce and asset trading.
  // All demo actions remain front-end only until a production API is wired.
  // ============================================================

  projects.push(
    {
      id:'iron-monsoon', category:'Indie Games', tone:'blue', likes:286,
      title:'Iron Monsoon \u2014 Co-op Survival from Pune',
      desc:'A four-player monsoon survival game with base building and dynamic weather.',
      story:'A co-op survival game built around Indian monsoon conditions, local legends and systems-driven teamwork.',
      quote:'We are funding a public vertical slice first, then moving into a milestone-based production roadmap with monthly playable builds.',
      creator:'Priya Sharma', creatorKey:'priya-sharma', avatar:null,
      raised:684000, goal:900000, backers:421, days:12, image:'assets/pixel-island-gun.png',
      accountAge:296, previousProjects:4, deliveries:4, lastUpdate:'2026-08-11'
    },
    {
      id:'moonlit-auto', category:'Indie Games', tone:'pink', likes:198,
      title:'Moonlit Auto \u2014 A Bengaluru Night-Drive RPG',
      desc:'Build friendships, take late-night fares and discover a city after dark.',
      story:'A narrative driving RPG about work, friendship and the stories of a city after midnight.',
      quote:'Every backer build adds one more neighbourhood, passenger story and original radio track.',
      creator:'Rohan Mehta', creatorKey:'rohan-mehta', avatar:null,
      raised:392000, goal:650000, backers:276, days:31, image:'assets/gaming.jpg',
      accountAge:184, previousProjects:2, deliveries:2, lastUpdate:'2026-08-10'
    },
    {
      id:'tiny-tactics', category:'Indie Games', tone:'purple', likes:174,
      title:'Tiny Tactics \u2014 Pocket Strategy for Mobile',
      desc:'Fast tactical battles designed for low-end Android devices and short sessions.',
      story:'A compact strategy game engineered to run smoothly on affordable phones and unstable networks.',
      quote:'The campaign funds device testing, accessibility passes and a fair launch without pay-to-win systems.',
      creator:'Karthik Iyer', creatorKey:'karthik-iyer', avatar:null,
      raised:226000, goal:400000, backers:318, days:19, image:'assets/service-game.jpg',
      accountAge:410, previousProjects:5, deliveries:5, lastUpdate:'2026-08-09'
    },
    {
      id:'hampi-builders', category:'Indie Games', tone:'green', likes:151,
      title:'Hampi Builders \u2014 Historical City Sandbox',
      desc:'Rebuild a living city through researched architecture and resource systems.',
      story:'A respectful historical sandbox developed with researchers, artists and Kannada localization contributors.',
      quote:'Funding unlocks the next monument set, school mode and a fully voiced Kannada language pack.',
      creator:'Vikram Rao', creatorKey:'vikram-rao', avatar:null,
      raised:812000, goal:1400000, backers:509, days:46, image:'assets/office.jpg',
      accountAge:380, previousProjects:4, deliveries:4, lastUpdate:'2026-08-12'
    }
  );

  services.push(
    {key:'unreal-blueprint-systems',title:'Unreal Engine Blueprint Systems & Prototypes',creator:'Karthik Iyer',creatorKey:'karthik-iyer',avatar:null,image:'assets/pixel-island-gun.png',price:2200,rating:'4.9',days:5,location:'Coimbatore, Tamil Nadu',category:'Game Programming',desc:'Production-minded Blueprint systems, interaction prototypes, inventory, AI and gameplay debugging.',tags:['Unreal Engine','Blueprints','Gameplay','Optimization'],orders:52,response:'1 hour'},
    {key:'pixel-art-sprites',title:'Pixel Art Characters, Tilesets & Animation',creator:'Meera Nair',creatorKey:'meera-nair',avatar:null,image:'assets/pixel-island-crystals.png',price:1200,rating:'4.9',days:4,location:'Kochi, Kerala',category:'2D Game Art',desc:'Expressive game-ready sprites, tilesets, portraits and frame-by-frame animation in a consistent palette.',tags:['Pixel Art','Sprites','Tilesets','Animation'],orders:67,response:'2 hours'},
    {key:'game-ui-ux',title:'Game UI/UX, HUDs & Menu Design',creator:'Priya Sharma',creatorKey:'priya-sharma',avatar:null,image:'assets/service-game.jpg',price:1800,rating:'4.8',days:6,location:'Pune, Maharashtra',category:'Game UI/UX',desc:'Readable HUDs, menus, onboarding and controller-friendly game interfaces with Figma source.',tags:['Figma','HUD','UX','Mobile UI'],orders:34,response:'1 hour'},
    {key:'game-qa-testing',title:'Game QA, Playtesting & Bug Reports',creator:'Ananya Das',creatorKey:'ananya-das',avatar:null,image:'assets/gaming.jpg',price:900,rating:'4.9',days:3,location:'Guwahati, Assam',category:'QA & Testing',desc:'Structured playtests with reproduction steps, severity labels, video evidence and player-experience notes.',tags:['QA','Playtesting','Bug Reports','Accessibility'],orders:81,response:'30 minutes'},
    {key:'indie-game-marketing',title:'Indie Game Launch Page & Marketing Kit',creator:'Rohan Mehta',creatorKey:'rohan-mehta',avatar:null,image:'assets/office.jpg',price:2600,rating:'4.8',days:7,location:'Mumbai, Maharashtra',category:'Marketing',desc:'Store copy, trailer beats, launch calendar, screenshots and a practical creator outreach kit.',tags:['Steam','Trailer','Copywriting','Launch'],orders:29,response:'3 hours'},
    {key:'procedural-vfx',title:'Stylized VFX, Shaders & Particle Systems',creator:'Vikram Rao',creatorKey:'vikram-rao',avatar:null,image:'assets/pixel-island-mech.png',price:3200,rating:'5.0',days:8,location:'Bengaluru, Karnataka',category:'VFX & Shaders',desc:'Optimized stylized effects for Unity and Unreal, including source graphs and integration notes.',tags:['VFX Graph','Niagara','Shaders','Particles'],orders:43,response:'2 hours'},
    {key:'narrative-design',title:'Game Narrative, Quests & Dialogue Design',creator:'Meera Nair',creatorKey:'meera-nair',avatar:null,image:'assets/pixel-island-crystals.png',price:1400,rating:'4.9',days:5,location:'Kochi, Kerala',category:'Writing',desc:'Branching dialogue, quest structure, character bibles and implementation-ready narrative sheets.',tags:['Narrative','Dialogue','Quests','Worldbuilding'],orders:38,response:'2 hours'},
    {key:'multiplayer-netcode-review',title:'Multiplayer Netcode Review & Optimization',creator:'Karthik Iyer',creatorKey:'karthik-iyer',avatar:null,image:'assets/pixel-island-gun.png',price:4800,rating:'5.0',days:10,location:'Coimbatore, Tamil Nadu',category:'Game Programming',desc:'Architecture review, replication debugging, profiling and a prioritized multiplayer stability report.',tags:['Netcode','Replication','Profiling','Co-op'],orders:22,response:'4 hours'}
  );

  marketplaceCatalog.push(
    {id:'rpg-inventory-system',title:'Modular RPG Inventory System',creator:'Karthik Iyer',category:'Code & Systems',engine:'Unity \u00B7 Unreal',formats:'C# \u00B7 Blueprints',price:1899,rating:'4.9',reviews:146,image:'assets/pixel-island-gun.png',license:'Commercial',sales:780},
    {id:'indian-city-kit',title:'Indian City Street Kit',creator:'Vikram Rao',category:'3D Environments',engine:'Unity \u00B7 Unreal',formats:'FBX \u00B7 GLB \u00B7 4K',price:2299,rating:'4.9',reviews:82,image:'assets/office.jpg',license:'Commercial',sales:412},
    {id:'mocap-combat',title:'Indie Combat Mocap Library',creator:'MotionMint',category:'Animation & Mocap',engine:'Universal',formats:'FBX \u00B7 BVH',price:1699,rating:'4.8',reviews:104,image:'assets/pixel-island-mech.png',license:'Commercial',sales:637},
    {id:'adaptive-music',title:'Adaptive Music Toolkit',creator:'Rohan Mehta',category:'Music & Audio',engine:'Unity \u00B7 Unreal',formats:'WAV \u00B7 Stems \u00B7 MIDI',price:1299,rating:'5.0',reviews:95,image:'assets/gaming.jpg',license:'Commercial',sales:529},
    {id:'footstep-sfx',title:'900+ Footsteps & Foley SFX',creator:'Rohan Mehta',category:'Sound Effects',engine:'Universal',formats:'WAV \u00B7 24-bit',price:799,rating:'4.9',reviews:163,image:'assets/gaming.jpg',license:'Commercial',sales:1140},
    {id:'toon-water-shader',title:'Stylized Water Shader Collection',creator:'Vikram Rao',category:'Shaders & Materials',engine:'Unity \u00B7 Unreal',formats:'Shader Graph \u00B7 Material',price:999,rating:'4.8',reviews:77,image:'assets/pixel-island-crystals.png',license:'Commercial',sales:604},
    {id:'dialogue-plugin',title:'Branching Dialogue Editor',creator:'Karthik Iyer',category:'Plugins & Tools',engine:'Unity',formats:'C# \u00B7 Editor Tool',price:1499,rating:'4.9',reviews:121,image:'assets/service-game.jpg',license:'Commercial',sales:692},
    {id:'quest-template',title:'Open-World Quest Template',creator:'Ananya Das',category:'Templates',engine:'Unreal',formats:'Blueprints \u00B7 Docs',price:1999,rating:'4.7',reviews:58,image:'assets/pixel-island-gun.png',license:'Commercial',sales:301},
    {id:'village-npc-pack',title:'Village NPC Character Pack',creator:'Meera Nair',category:'Characters',engine:'Unity \u00B7 Unreal',formats:'FBX \u00B7 Textures',price:1799,rating:'4.8',reviews:88,image:'assets/pixel-island-mech.png',license:'Commercial',sales:455},
    {id:'lowpoly-vehicles',title:'Low-Poly Vehicle Mega Pack',creator:'Vikram Rao',category:'3D Props',engine:'Universal',formats:'FBX \u00B7 GLB',price:1199,rating:'4.7',reviews:69,image:'assets/office.jpg',license:'Commercial',sales:738},
    {id:'localization-sheet',title:'Game Localization Starter System',creator:'Priya Sharma',category:'Localization',engine:'Universal',formats:'CSV \u00B7 JSON \u00B7 Docs',price:399,rating:'4.8',reviews:44,image:'assets/service-game.jpg',license:'Commercial',sales:244},
    {id:'accessibility-icons',title:'Accessible Game UI Icon Set',creator:'Meera Nair',category:'UI/UX',engine:'Universal',formats:'SVG \u00B7 PNG \u00B7 Figma',price:549,rating:'4.9',reviews:75,image:'assets/pixel-island-crystals.png',license:'Commercial',sales:866},
    {id:'mobile-optimization',title:'Mobile Optimization Toolkit',creator:'Priya Sharma',category:'Plugins & Tools',engine:'Unity',formats:'C# \u00B7 Profiler Presets',price:1299,rating:'4.8',reviews:67,image:'assets/service-game.jpg',license:'Commercial',sales:388},
    {id:'procedural-dungeons',title:'Procedural Dungeon Generator',creator:'Karthik Iyer',category:'Code & Systems',engine:'Unreal',formats:'Blueprints \u00B7 C++',price:2499,rating:'5.0',reviews:109,image:'assets/pixel-island-gun.png',license:'Commercial',sales:574},
    {id:'handpainted-textures',title:'Hand-Painted Fantasy Textures',creator:'Ananya Das',category:'Textures',engine:'Universal',formats:'PNG \u00B7 PSD \u00B7 2K',price:899,rating:'4.9',reviews:137,image:'assets/pixel-island-crystals.png',license:'Commercial',sales:1028},
    {id:'trailer-template',title:'Indie Game Trailer Motion Kit',creator:'Rohan Mehta',category:'Video & Marketing',engine:'Universal',formats:'AE \u00B7 Premiere \u00B7 SFX',price:1099,rating:'4.7',reviews:51,image:'assets/gaming.jpg',license:'Commercial',sales:346}
  );

  nexoraUpdates.push(
    {tag:'Creator Update',date:'Aug 12, 2026',title:'Iron Monsoon ships its public weather-system demo',summary:'Priya Sharma shared a playable milestone, a detailed changelog and the next three funding unlocks for the co-op survival project.',image:'assets/pixel-island-gun.png',accent:'blue'},
    {tag:'Studio News',date:'Aug 12, 2026',title:'Four creator teams open roles for jam collaborators',summary:'Programming, pixel art, QA and sound-design opportunities are open across this month\u2019s active game jams.',image:'assets/service-game.jpg',accent:'pink'}
  );

  const creatorPulse = [
    {creator:'Ananya Das',badge:'BUILD 0.7',text:'Aether now has controller remapping and a new Assamese-language dialogue pass.',time:'18m',icon:'A'},
    {creator:'Vikram Rao',badge:'MILESTONE',text:'Hampi Builders completed monument blockout 04 and opened a public art review.',time:'41m',icon:'V'},
    {creator:'Rohan Mehta',badge:'AUDIO DROP',text:'Moonlit Auto backers can now preview the midnight radio EP.',time:'1h',icon:'R'},
    {creator:'Priya Sharma',badge:'HIRING',text:'Iron Monsoon is looking for two weekend playtest groups.',time:'2h',icon:'P'}
  ];

  const marketCategoryMap = {
    '3D':'3D', '2D':'2D', 'Animation':'Animation', 'Audio':'Audio',
    'Code':'Code', 'Tools':'Tools', 'UI/UX':'UI/UX', 'VFX':'VFX',
    'Templates':'Templates', 'All':''
  };

  function servicePackages(s){
    const base=s.price;
    return [
      {key:'basic',name:'Basic',price:base,days:s.days,revisions:1,desc:'A focused starter delivery for one clearly defined task.',items:['One scoped deliverable','Commercial-use files','Progress update','1 revision']},
      {key:'standard',name:'Standard',price:Math.round(base*2.15/50)*50,days:s.days+3,revisions:3,desc:'A production-ready package with integration help and source files.',items:['Expanded deliverable','Editable source files','Integration notes','3 revisions']},
      {key:'premium',name:'Premium',price:Math.round(base*3.7/50)*50,days:s.days+6,revisions:5,desc:'End-to-end delivery for a larger feature, system or content set.',items:['Complete production scope','Priority communication','Implementation support','5 revisions']}
    ];
  }

  function enhancedServiceCard(s){
    const creator=creatorFromRef(s.creatorKey || s.creator);
    const previews=[s.image,...(s.images||[])].filter((src,index,list)=>src && list.indexOf(src)===index);
    const media=previews[0]?`<img src="${previews[0]}" alt="${escapeHtml(s.title)}" loading="lazy">`:'';
    const completedOrders=s.orders ?? null;
    const packages=servicePackages(s).map(p=>({name:p.name,price:p.price,days:p.days,revisions:p.revisions}));
    const creatorName=creator
      ? `<a class="creator-card-link" href="#/creator/${escapeHtml(creator.key)}">${escapeHtml(s.creator)}</a>`
      : `<b>${escapeHtml(s.creator)}</b>`;
    const creatorLocation=s.location || creator?.location || '';
    return `<article class="service-card enhanced-service-card glass-card glow-card" data-service="${s.key}" data-service-category="${escapeHtml(s.category)}" data-service-search="${escapeHtml((s.title+' '+s.category+' '+s.creator+' '+s.tags.join(' ')).toLowerCase())}" data-rich-preview="gig" data-preview-route="#/service/${escapeHtml(s.key)}" data-preview-title="${escapeHtml(s.title)}" data-preview-description="${escapeHtml(s.desc||'')}" data-preview-category="${escapeHtml(s.category||'')}" data-preview-tags="${escapeHtml((s.tags||[]).join('|'))}" data-preview-images="${escapeHtml(previews.join('|'))}" data-preview-video="${escapeHtml(s.video||'')}" data-preview-creator="${escapeHtml(s.creator)}" data-preview-creator-key="${escapeHtml(creator?.key||'')}" data-preview-avatar="${escapeHtml(s.avatar||creator?.avatar||'')}" data-preview-verified="${creator?'true':'false'}" data-preview-trust="${creator?creatorTrustScore(creator):''}" data-preview-rating="${escapeHtml(s.rating||'')}" data-preview-reviews="${escapeHtml(s.reviews??'')}" data-preview-orders="${escapeHtml(completedOrders??'')}" data-preview-response="${escapeHtml(s.response||'')}" data-preview-delivery="${escapeHtml(s.days??'')}" data-preview-packages="${escapeHtml(JSON.stringify(packages))}" data-preview-price="${escapeHtml(s.price??'')}">
      <div class="gig-identity-top">
        <div class="gig-identity-person">${avatarMarkup(s.avatar||creator?.avatar,s.creator)}<span>${creatorName}${creatorLocation?`<small>${escapeHtml(creatorLocation)}</small>`:''}</span></div>
        <div class="gig-identity-signals">${creator?kycStatusBadge(creator,true):''}${s.response?`<span class="creator-live-status"><i></i> Active · ${escapeHtml(s.response)}</span>`:''}</div>
      </div>
      <div class="service-media media-fallback">${media}${completedOrders!==null?`<span class="gig-level">${fmt(completedOrders)} orders</span>`:''}<button type="button" class="gig-save" data-toast="Gig saved to your shortlist" aria-label="Save gig">♡</button></div>
      <div class="service-body">
        <h3>${escapeHtml(s.title)}</h3>
        <div class="gig-tags">${s.tags.slice(0,3).map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div>
        <div class="service-meta"><span>★ ${s.rating}</span><span>◷ From ${s.days}d</span></div>
        <div class="price-row"><span>Packages from</span><strong>₹${fmt(s.price)}</strong></div>
      </div>
    </article>`;
  }

  function assetPreviewImages(a){
    return [a.image,...(a.images||[])].filter((x,i,arr)=>x && arr.indexOf(x)===i);
  }

  function assetCreatorRef(a){ return creatorFromRef(a.creator); }

  function deepAssetCard(a){
    const license=a.license||'Commercial';
    const sales=a.sales ?? null;
    const previews=assetPreviewImages(a);
    const creatorRef=assetCreatorRef(a);
    const creatorName=creatorRef
      ? `<a class="creator-card-link" href="#/creator/${escapeHtml(creatorRef.key)}">${escapeHtml(a.creator)}</a>`
      : `<b>${escapeHtml(a.creator)}</b>`;
    return `<article class="marketplace-asset-card bento-card glass-card glow-card" data-market-item data-market-id="${escapeHtml(a.id)}" data-category="${escapeHtml(a.category)}" data-engine="${escapeHtml(a.engine)}" data-title="${escapeHtml((a.title+' '+a.creator+' '+a.category+' '+a.engine+' '+a.formats).toLowerCase())}" data-price="${a.price}" data-rating="${a.rating}" data-sales="${sales??0}" data-rich-preview="asset" data-preview-route="#/asset/${escapeHtml(a.id)}" data-preview-title="${escapeHtml(a.title)}" data-preview-description="${escapeHtml(a.desc||'')}" data-preview-category="${escapeHtml(a.category||'')}" data-preview-tags="${escapeHtml((a.tags||[]).join('|'))}" data-preview-images="${escapeHtml(previews.join('|'))}" data-preview-video="${escapeHtml(a.video||'')}" data-preview-creator="${escapeHtml(a.creator)}" data-preview-creator-key="${escapeHtml(creatorRef?.key||'')}" data-preview-avatar="${escapeHtml(creatorRef?.avatar||'')}" data-preview-verified="${creatorRef?'true':'false'}" data-preview-trust="${creatorRef?creatorTrustScore(creatorRef):''}" data-preview-rating="${escapeHtml(a.rating??'')}" data-preview-reviews="${escapeHtml(a.reviews??'')}" data-preview-sales="${escapeHtml(sales??'')}" data-preview-engine="${escapeHtml(a.engine||'')}" data-preview-formats="${escapeHtml(a.formats||'')}" data-preview-license="${escapeHtml(license)}" data-preview-price="${escapeHtml(a.price??'')}">
      <div class="gig-identity-top asset-identity-top">
        <div class="gig-identity-person">${avatarMarkup(creatorRef?.avatar,a.creator)}<span>${creatorName}</span></div>
        <div class="gig-identity-signals">${creatorRef?kycStatusBadge(creatorRef,true):''}</div>
      </div>
      <div class="marketplace-asset-media media-fallback asset-media-cycle" data-preview-images="${escapeHtml(previews.join('|'))}">
        ${previews[0]?`<img class="asset-preview-frame asset-preview-current" src="${previews[0]}" alt="${escapeHtml(a.title)}" loading="lazy">`:''}
        ${previews[1]?`<img class="asset-preview-frame asset-preview-next" src="${previews[1]}" alt="" aria-hidden="true">`:''}
        <span>${escapeHtml(a.category)}</span>
        ${previews.length||a.video?`<div class="asset-media-count">${previews.length?`${previews.length} image${previews.length===1?'':'s'}`:''}${previews.length&&a.video?' + ':''}${a.video?'video':''}</div>`:''}
        <button class="asset-wish" type="button" data-wishlist-add="${escapeHtml(a.id)}" aria-label="Add asset to wishlist">♡</button>
      </div>
      <div class="marketplace-asset-body">
        <div class="marketplace-asset-title"><h3>${escapeHtml(a.title)}</h3><span class="asset-rating">★ ${escapeHtml(a.rating)}</span></div>
        <p>${escapeHtml(a.engine)}</p>
        <div class="asset-license-row"><span>${escapeHtml(license)} licence</span>${sales!==null?`<span>${fmt(sales)} sales</span>`:''}</div>
        <div class="marketplace-asset-meta"><span>${escapeHtml(a.formats)}</span><b>₹${fmt(a.price)}</b></div>
        <div class="asset-actions"><a class="btn btn-ghost market-buy" href="#/asset/${escapeHtml(a.id)}">Preview</a><button class="btn btn-primary market-buy" type="button" data-cart-add="${escapeHtml(a.id)}">Add to cart</button></div>
      </div>
    </article>`;
  }

  function assetViewDeep(id){
    const a=marketplaceCatalog.find(x=>x.id===id);
    if(!a) return missingDetailView('Asset', '#/marketplace', 'marketplace');
    const previews=assetPreviewImages(a);
    const creatorRef=assetCreatorRef(a);
    const license=a.license||'Commercial';
    const mediaThumbs=previews.map((src,i)=>`<button class="asset-gallery-thumb ${i===0?'active':''}" type="button" data-asset-gallery-src="${src}"><img src="${src}" alt="Preview ${i+1}"></button>`).join('');
    const videoThumb=a.video?`<button class="asset-gallery-thumb video-thumb" type="button" data-asset-gallery-video="${escapeHtml(a.video)}">▶<span>Video</span></button>`:'';
    return `<div class="page-shell asset-detail-page">${pixelField()}
      <nav class="breadcrumb"><a href="#/marketplace">Marketplace</a><span>›</span><span>${escapeHtml(a.category)}</span></nav>
      <section class="asset-detail-head neo-brutal-header"><div><p class="eyebrow">${escapeHtml(a.category)} · ${escapeHtml(a.engine)}</p><h1>${escapeHtml(a.title)}</h1><div class="asset-detail-seller"><b>${escapeHtml(a.creator)}</b>${creatorRef?kycStatusBadge(creatorRef,true):''}<span>★ ${a.rating} · ${a.reviews} reviews</span></div></div><button class="neo-brutal-btn" type="button" data-cart-add="${escapeHtml(a.id)}">Add to cart · ₹${fmt(a.price)}</button></section>
      <div class="asset-detail-layout">
        <main>
          <div class="asset-gallery neo-brutal-card">
            <div class="asset-gallery-stage" id="assetGalleryStage"><img id="assetGalleryImage" data-asset-stage-image src="${previews[0]}" alt="${escapeHtml(a.title)} preview"><video id="assetGalleryVideo" data-asset-stage-video controls preload="metadata" hidden></video></div>
            <div class="asset-gallery-thumbs">${mediaThumbs}${videoThumb}</div>
          </div>
          <section class="asset-detail-copy neo-brutal-card"><p class="eyebrow">What you get</p><h2>Production-ready files and licence details</h2><p>This listing supports multiple preview images and an optional video preview. Media stays inside one stable gallery so switching does not reflow the page.</p><div class="asset-spec-grid"><div><b>Formats</b><span>${escapeHtml(a.formats)}</span></div><div><b>Engine</b><span>${escapeHtml(a.engine)}</span></div><div><b>Licence</b><span>${escapeHtml(license)}</span></div><div><b>Sales</b><span>${fmt(a.sales||a.reviews*6)}</span></div></div></section>
          <section class="brutal-faq"><div class="neo-brutal-header"><div><p class="eyebrow">Marketplace FAQ</p><h2>Before you buy</h2></div></div>${[['Can I use this commercially?','Yes, according to the licence shown on this listing. Review any extended-studio limits before shipping.'],['Are multiple images supported?','Yes. Sellers can attach several screenshots or renders; buyers can switch through them without leaving the listing.'],['Can a seller add video?','Yes. When a listing includes a video URL or uploaded video, the same gallery switches into a video player.'],['What if the asset is incompatible?','Check the engine and format labels first, then use the community or seller discussion before purchasing.']].map(x=>`<details class="neo-brutal-card"><summary>${x[0]}<span>+</span></summary><p>${x[1]}</p></details>`).join('')}</section>
        </main>
        <aside class="asset-buy-panel neo-brutal-card"><p class="eyebrow">Purchase</p><strong class="asset-detail-price">₹${fmt(a.price)}</strong><span>${escapeHtml(license)} licence</span><button class="btn btn-primary magnetic" type="button" data-cart-add="${escapeHtml(a.id)}">Add to cart</button><a class="btn btn-ghost" href="#/community">Ask community</a>${creatorRef?`<div class="asset-buy-trust">${kycStatusBadge(creatorRef)}<small>Seller identity and visible trust signals are shown before checkout.</small></div>`:''}</aside>
      </div>${ctaFooter()}
    </div>`;
  }

  function discoveryRankRow(p,index){
    return `<a class="discovery-rank-row" href="#/project/${p.id}"><span class="rank-number">${String(index+1).padStart(2,'0')}</span><span class="rank-avatar">${p.creator.charAt(0)}</span><span class="rank-copy"><b>${escapeHtml(p.title)}</b><small>${escapeHtml(p.creator)} \u00B7 ${p.backers} backers</small></span><span class="rank-money"><b>\u20B9${fmt(p.raised)}</b><small>${percent(p)}% funded</small></span><span class="rank-up">\u2197</span></a>`;
  }

  function discoverViewDeep(){
    const ranked=projects.slice().sort((a,b)=>(b.backers+b.likes)-(a.backers+a.likes));
    const assets=marketplaceCatalog.slice().sort((a,b)=>(b.sales||b.reviews*6)-(a.sales||a.reviews*6)).slice(0,4);
    const people=creators.slice().sort((a,b)=>parseInt(b.followers.replace(',',''))-parseInt(a.followers.replace(',',''))).slice(0,4);
    return `<div class="page-shell discover-page">${pixelField()}
      <section class="experience-hero discover-experience bento-card glass-card">
        <div>
          <p class="eyebrow">Live discovery engine</p>
          <h1>Find what is <span class="gradient-text">moving now.</span></h1>
          <p>Funding momentum, breakout creators, best-selling game assets, fresh builds and community signals \u2014 ranked in one place.</p>
          <div class="discover-search"><span>\u2315</span><input id="discoverSearch" placeholder="Search projects, people, assets, engines or skills\u2026"><button type="button">Search all</button></div>
        </div>
        <div class="signal-orbit">
          <span class="orbit-core">LIVE<br><b>482</b></span>
          <span class="orbit-pill o1">\uD83D\uDD25 6 rising</span><span class="orbit-pill o2">\u20B99.1L today</span><span class="orbit-pill o3">42 new assets</span><span class="orbit-pill o4">187 online</span>
        </div>
      </section>

      <!-- APPLIED NEO-BRUTALISM TO JUMPBAR -->
      <nav class="discovery-jumpbar neo-brutal-card" style="padding: 12px;" aria-label="Discover categories">
        ${[['Funding','projects','\uD83D\uDE80'],['Game assets','marketplace','\uD83E\uDDF0'],['Top talent','freelancers','\u26A1'],['Creators','explore','\u2726'],['Game jams','jams','\uD83C\uDFAE'],['Community','community','\uD83D\uDCAC']].map(x=>`<a href="#/${x[1]}"><span>${x[2]}</span><b>${x[0]}</b></a>`).join('')}
      </nav>

      <section class="discover-lead-grid">
        <article class="discovery-feature bento-card glass-card">
          <div class="discover-feature-art media-fallback"><img src="${ranked[0].image}" alt=""><span class="live-chip">#1 TRENDING TODAY</span></div>
          <div class="discover-feature-copy"><p class="eyebrow">Fastest funding velocity</p><h2>${escapeHtml(ranked[0].title)}</h2><p>${escapeHtml(ranked[0].desc)}</p><div class="money-row"><b>\u20B9${fmt(ranked[0].raised)} raised</b><span>${percent(ranked[0])}% of goal</span></div><div class="progress"><span style="width:${percent(ranked[0])}%"></span></div><a class="btn btn-primary" href="#/project/${ranked[0].id}">View campaign \u2192</a></div>
        </article>
        <article class="discovery-board bento-card glass-card">
          <div class="board-head"><div><p class="eyebrow">Momentum board</p><h2>Most backed</h2></div><div class="mini-tabs"><button class="active" data-period>Today</button><button data-period>Week</button><button data-period>Month</button></div></div>
          <div class="discovery-ranks">${ranked.slice(0,5).map(discoveryRankRow).join('')}</div>
        </article>
      </section>

      <section class="section compact-section">${sectionHead('Popular assets right now','Best-selling tools and production packs across game development','Explore all assets','#/marketplace')}<div class="marketplace-asset-grid discover-assets">${assets.map(deepAssetCard).join('')}</div></section>

      <section class="discover-two-col">
        <div>
          <div class="section-head neo-brutal-header">
            <div>
              <p class="eyebrow">People to know</p>
              <h2>Popular creators</h2>
              <p style="font-weight: 600;">Verified builders earning attention through delivery, updates and community activity.</p>
            </div>
            <a class="text-link neo-brutal-btn" href="#/explore">All creators \u2192</a>
          </div>
          <div class="creator-grid discovery-creators">${people.map(creatorCard).join('')}</div>
        </div>
        
        <aside class="discovery-signals neo-brutal-card">
          <p class="eyebrow">Today on Nexora</p>
          <h2>Live signals</h2>
          <div class="neo-brutal-list">
            ${[['Aether received 38 new backers','Funding','7m'],['Indian City Street Kit crossed 400 sales','Marketplace','21m'],['Monsoon Jam has 26 new teams','Game Jam','44m'],['Pixel & Paint reached 900 members','Community','1h'],['12 verified creators opened availability','Freelance','2h']].map(x=>`<a href="#/discover" class="neo-brutal-item"><span class="neo-brutal-dot"></span><span><b>${x[0]}</b><br><small>${x[1]}</small></span><time>${x[2]}</time></a>`).join('')}
          </div>
        </aside>
      </section>

      <section class="skill-demand bento-card glass-card"><div><p class="eyebrow">Hiring intelligence</p><h2>Skills in demand this week</h2></div><div class="demand-cloud">${[['Unreal Blueprints','+28%'],['Pixel art','+22%'],['Unity optimization','+19%'],['Game trailers','+17%'],['QA testing','+15%'],['Niagara VFX','+13%'],['Sound design','+11%'],['Narrative design','+9%']].map(x=>`<a href="#/freelancers"><b>${x[0]}</b><span>${x[1]}</span></a>`).join('')}</div></section>
      ${ctaFooter()}
    </div>`;
  }
  function gameCampaignMini(p){
    return `<article class="game-campaign-card bento-card glass-card glow-card" data-project="${p.id}">
      <div class="game-campaign-art media-fallback"><img src="${p.image}" alt="${escapeHtml(p.title)}"><span>${p.days} days left</span></div>
      <div class="game-campaign-copy"><p class="eyebrow">${p.category} \u00B7 ${escapeHtml(p.creator)}</p><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.desc)}</p><div class="money-row"><b>\u20B9${fmt(p.raised)}</b><span>${percent(p)}%</span></div><div class="progress"><span style="width:${percent(p)}%"></span></div><div class="game-card-foot"><span>${p.backers} backers</span><span>\u2764 ${p.likes}</span></div></div>
    </article>`;
  }

  function gamesViewDeep(){
    const games=projects.filter(p=>p.category==='Indie Games');
    const gameServices=services.filter(s=>/game|unreal|unity|pixel|vfx|qa|narrative/i.test(s.title+' '+s.category)).slice(0,4);
    const gameAssets=marketplaceCatalog.filter(a=>/Unity|Unreal/i.test(a.engine)).slice(-4);
    return `<div class="page-shell games-page">${pixelField()}
      <section class="experience-hero games-experience">
        <div><p class="eyebrow">India's game-funding command center</p><h1>Fund the game.<br><span class="gradient-text">Build the studio.</span></h1><p>Campaigns, playable milestones, rewards, collaborators, assets, testing and launch support \u2014 connected around game creators.</p><div class="hero-actions"><button class="btn btn-primary" data-start-project>Launch a game campaign \u2192</button><a class="btn btn-secondary" href="#/projects">Back a game</a></div></div>
        <div class="game-radar bento-card glass-card"><div class="radar-top"><span>LIVE GAME FUNDING</span><b>\u25CF ONLINE</b></div><div class="radar-value">\u20B924.8L</div><p>currently raised across 27 campaigns</p><div class="radar-bars">${[78,64,92,47,71,56,84,68,95,74,61,88].map((n,i)=>`<i style="height:${n}%"></i>`).join('')}</div><div class="radar-foot"><span>+18.4% this week</span><span>1,842 backers</span></div></div>
      </section>

      <section class="game-metrics">${[['27','Live campaigns','\uD83D\uDE80'],['\u20B96.8L','Raised this week','\u20B9'],['8','Playable demos','\u25B6'],['214','Jam builders','\uD83C\uDFAE'],['42','Studios hiring','\u26A1']].map(x=>`<article class="bento-card glass-card"><span>${x[2]}</span><b>${x[0]}</b><small>${x[1]}</small></article>`).join('')}</section>

      <section class="game-pipeline bento-card neu-card"><div class="pipeline-head"><div><p class="eyebrow">Milestone-based trust</p><h2>From idea to launch</h2></div><a href="#/funding">Open funding guide \u2192</a></div><div class="pipeline-track">${[['01','Concept','Pitch + team'],['02','Prototype','Playable proof'],['03','Funding','Rewards + goal'],['04','Production','Monthly builds'],['05','Testing','QA + community'],['06','Launch','Delivery + support']].map((x,i)=>`<div class="pipeline-step ${i<3?'complete':''}"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}</div></section>

      <section class="section compact-section">${sectionHead('Games gaining momentum','Playable ideas ranked by funding velocity and backer growth','View all campaigns','#/projects')}<div class="game-campaign-grid">${games.slice(0,4).map(gameCampaignMini).join('')}</div></section>

      <section class="game-funding-grid">
        <article class="reward-builder bento-card glass-card"><p class="eyebrow">Backer rewards</p><h2>Rewards people understand</h2><div class="reward-tier-list">
          ${[['\u20B9299','Supporter','Name in credits \u00B7 dev updates'],['\u20B9799','Early player','Game key \u00B7 closed beta'],['\u20B91,999','Founder pack','Artbook \u00B7 soundtrack \u00B7 key'],['\u20B97,499','World builder','Design call \u00B7 named NPC']].map((x,i)=>`<button class="reward-tier ${i===1?'popular':''}" data-toast="Reward preview opened"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></button>`).join('')}</div></article>
        <article class="funding-calculator bento-card glass-card"><p class="eyebrow">Funding planner</p><h2>Estimate your backer mix</h2><label>Campaign goal <b id="goalValue">\u20B98,00,000</b><input id="goalRange" type="range" min="100000" max="3000000" value="800000" step="50000"></label><div class="calc-grid"><div><b id="backerEstimate">534</b><span>estimated backers</span></div><div><b id="pledgeEstimate">\u20B91,499</b><span>average pledge</span></div><div><b>4\u20136</b><span>reward tiers</span></div><div><b>12%</b><span>launch-day target</span></div></div><p>Planning estimate only. Real performance depends on audience, proof, rewards and communication.</p></article>
        <article class="game-safety bento-card glass-card"><p class="eyebrow">Backer protection signals</p><h2>Proof before promises.</h2><ul><li>Playable demo or prototype status</li><li>Creator identity and payout verification</li><li>Milestone roadmap with update cadence</li><li>Transparent risks and team ownership</li><li>Report, dispute and moderation paths</li></ul><a class="btn btn-secondary" href="#/trust-safety">How project trust works</a></article>
      </section>

      <section class="game-hub-links bento-card glass-card">${[['\uD83C\uDFAE','Game jams','Find a team and ship fast','#/jams'],['\uD83E\uDDD1\u200D\uD83D\uDCBB','Hire specialists','Programming, art, audio and QA','#/freelancers'],['\uD83E\uDDF0','Production assets','Systems, environments and tools','#/marketplace'],['\uD83D\uDCAC','Game guilds','Devlogs, feedback and collaborators','#/community'],['\uD83D\uDCE3','Jobs & roles','Studio work and collaboration calls','#/jobs'],['\uD83D\uDCDA','Funding playbooks','Goals, rewards and campaign trust','#/tutorials']].map(x=>`<a href="${x[3]}"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small><i>\u2192</i></a>`).join('')}</section>

      <section class="section compact-section">${sectionHead('Specialists for game production','Verified gigs with packages, delivery times and direct chat','Browse every service','#/freelancers')}<div class="cards-4">${gameServices.map(enhancedServiceCard).join('')}</div></section>
      <section class="section compact-section">${sectionHead('Game-ready marketplace picks','Commercial-use assets for Unity, Unreal and universal pipelines','Open marketplace','#/marketplace')}<div class="marketplace-asset-grid">${gameAssets.map(deepAssetCard).join('')}</div></section>
      ${ctaFooter()}
    </div>`;
  }

  function updatesViewDeep(){
    nexoraUpdates.forEach(n=>{if(!n.kind)n.kind=/creator|studio/i.test(n.tag)?'creator':/fund/i.test(n.tag)?'funding':/market/i.test(n.tag)?'marketplace':/community|event/i.test(n.tag)?'community':'news';});
    return `<div class="page-shell updates-page updates-deep">${pixelField()}
      <section class="updates-hero updates-command">
        <div><p class="eyebrow">Nexora Pulse \u00B7 live newsroom</p><h1>Updates worth <span class="gradient-text">coming back for.</span></h1><p>Creator build logs, funding milestones, platform news, community headlines and clearly labelled promotion.</p></div>
        <div class="update-command-actions"><a class="btn btn-primary" href="#/discussion-new">+ Post creator update</a><a class="btn btn-secondary" href="#/ads/new">Create an ad</a></div>
      </section>

      <!-- 1. SOFT BRUTALISM: Top Stats Strip -->
      <section class="pulse-strip neo-brutal-card" style="padding: 16px 24px; margin-bottom: 24px;">
        <span class="pulse-live">\u25CF LIVE</span>
        <div><b>482 creators active</b><small>63 updates today</small></div>
        <div><b>\u20B91.7L backed today</b><small>across 18 projects</small></div>
        <div><b>26 fresh assets</b><small>8 verified sellers</small></div>
        <div><b>7 opportunities</b><small>jobs and collaborators</small></div>
      </section>

      <!-- 2. SOFT BRUTALISM: Bottom Filter Nav Rail -->
      <nav class="updates-filterbar neo-brutal-rail" style="padding: 12px !important; margin-bottom: 24px; gap: 8px;" aria-label="Filter updates">
        ${[['all','For you'],['creator','Creator updates'],['funding','Funding wins'],['marketplace','Marketplace'],['community','Community'],['news','Platform news'],['sponsored','Sponsored']].map((x,i)=>`<button class="update-filter neo-filter-btn ${i===0?'active':''}" data-update-filter="${x[0]}">${x[1]}</button>`).join('')}
      </nav>

      <section class="updates-layout-deep">
        <div>
          
          <!-- APPLIED SOFT BRUTALISM HEADER HERE -->
          <div class="updates-list-head neo-brutal-header" style="margin-bottom: 20px;">
            <div>
              <p class="eyebrow">Latest</p>
              <h2 style="margin: 4px 0 0;">News & build updates</h2>
            </div>
            <span id="updatesVisibleCount" class="neo-brutal-btn" style="pointer-events: none; background: #f1ecff !important; color: #6f3ff5 !important; border: 2px solid transparent !important; box-shadow: none !important;">${nexoraUpdates.length} stories</span>
          </div>

          <section class="updates-grid deep-update-grid" id="deepUpdatesGrid">
          ${nexoraUpdates.map((n,i)=>`<article class="update-card bento-card glass-card ${i===0?'update-featured':''} update-${n.accent}" data-update-kind="${n.kind}">
            <div class="update-media media-fallback"><img src="${n.image}" alt=""><span>${escapeHtml(n.tag)}</span></div><div class="update-body"><small>${escapeHtml(n.date)}</small><h2>${escapeHtml(n.title)}</h2><p>${escapeHtml(n.summary)}</p><div class="update-card-foot"><a href="#/updates/${i}" class="text-link">Read update \u2192</a><button class="btn btn-ghost" style="padding: 6px 12px; font-size: 10px; min-height: auto;" data-toast="Topic followed">+ Follow topic</button></div></div>
          </article>`).join('')}
        </section></div>
        <aside class="updates-rail">
          <article class="sponsored-card bento-card glass-card" data-update-kind="sponsored"><span class="sponsored-label">SPONSORED \u00B7 WHY AM I SEEING THIS?</span><div class="sponsor-art">DF</div><p class="eyebrow">Creator spotlight</p><h2>Launch your asset pack to game teams across India.</h2><p>Promote a verified marketplace listing with a daily budget, category targeting and transparent performance.</p><div class="sponsor-stats"><span><b>12.4K</b> reach</span><span><b>3.8%</b> clicks</span></div><a class="btn btn-primary" href="#/ads">Preview creator ads</a><small>Ads are always labelled. Targeting and reporting controls belong in the production ad manager.</small></article>
          <article class="news-briefs bento-card glass-card"><p class="eyebrow">News check</p><h2>Quick briefs</h2>${[['Payments','Payout dashboard status page added'],['Safety','New scam-report checklist published'],['Jobs','Three studios verified this week'],['Jams','Monsoon Jam enters final 12 days'],['Assets','Commercial licence labels improved']].map(x=>`<a href="#/updates"><span>${x[0]}</span><b>${x[1]}</b><i>\u2192</i></a>`).join('')}</article>
        </aside>
      </section>
      ${ctaFooter()}
    </div>`;
  }

  function freelancersViewDeep(){
    const categories=['All','Game Programming','2D Game Art','3D & Animation','Game UI/UX','VFX & Shaders','Video & Audio','QA & Testing','Writing','Marketing','XR'];
    return `<div class="page-shell freelancers-deep">${pixelField()}
      <section class="freelance-hero experience-hero bento-card"><div><p class="eyebrow">Nexora Freelance</p><h1>Hire the team your <span class="gradient-text">game needs.</span></h1><p>Compare clear gig packages, verified delivery history, response time, reviews and creator portfolios before you order.</p><div class="freelance-search"><span>\u2315</span><input id="freelanceSearch" placeholder="Try \u201CUnreal Blueprint\u201D, \u201Cpixel art\u201D or \u201Cgame trailer\u201D\u2026"><button>Search gigs</button></div><div class="popular-searches">Popular: <button data-service-query="Unreal">Unreal</button><button data-service-query="Pixel">Pixel art</button><button data-service-query="QA">QA</button><button data-service-query="Trailer">Trailers</button></div></div><div class="talent-scorecard"><p class="eyebrow">Talent network</p><div><b>340+</b><span>verified creators</span></div><div><b>4.88</b><span>average rating</span></div><div><b>2.1h</b><span>median response</span></div><div><b>94%</b><span>on-time delivery</span></div><a href="#/explore">Explore people \u2192</a></div></section>

      <section class="freelance-trust-row neo-brutal-card" style="padding: 16px 24px; margin-bottom: 24px; margin-top: 24px;">${[['\u2713','Identity-verified sellers'],['\u25F7','Delivery dates before checkout'],['\u25A3','Basic, Standard & Premium packages'],['\uD83D\uDCAC','Direct pre-order chat'],['\u2605','Verified-order reviews']].map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</section>

      <!-- Reduced bottom margin to pull the header closer -->
      <nav class="freelance-categories neo-brutal-rail" style="margin-bottom: 12px; padding: 12px !important; gap: 8px;">${categories.map((c,i)=>`<button class="service-filter neo-filter-btn ${i===0?'active':''}" data-service-filter="${c}">${c}</button>`).join('')}</nav>

      <!-- GAP FIXED & HEADER STYLED: Removed the default .compact-section padding and applied the Soft Brutalism header -->
      <section style="padding-top: 8px; padding-bottom: 32px;">
        <div class="section-head neo-brutal-header" style="margin-bottom: 20px;">
          <div>
            <p class="eyebrow">Recommended for game teams</p>
            <h2 style="margin: 4px 0 0;">Explore specialist gigs</h2>
          </div>
          <!-- Styled the gig count to look like a neat little matching pill -->
          <span id="serviceResultCount" class="neo-brutal-btn" style="pointer-events: none; background: #f1ecff !important; color: #6f3ff5 !important; border: 2px solid transparent !important; box-shadow: none !important;">${services.length} gigs</span>
        </div>
        
        <div class="cards-4 freelance-service-grid" id="freelanceGrid">${services.map(enhancedServiceCard).join('')}</div>
      </section>

      <section class="freelance-brief neo-brutal-card"><div><p class="eyebrow">Not sure who to hire?</p><h2>Post one production brief.</h2><p>Describe the engine, scope, budget and deadline. Matching creators can respond with a package and questions.</p></div><div class="brief-fields"><span>Engine <b>Unity / Unreal / Other</b></span><span>Budget <b>₹1,000 – ₹1,00,000+</b></span><span>Need <b>Programming, art, audio, QA…</b></span></div><a class="btn btn-primary" href="#/brief-builder">Create a brief →</a></section>
      <section class="brutal-faq freelance-list-faq"><div class="neo-brutal-header"><div><p class="eyebrow">Hiring FAQ</p><h2>What to check before choosing a freelancer</h2></div></div>${[['What does KYC verified mean?','It means the identity-verification step is marked complete in this prototype. It does not guarantee skill, delivery or outcome.'],['What is the trust score?','A separate visible score summarizing verification, rating, completed orders and delivery history. It should never replace checking the actual portfolio and scope.'],['Should I message before ordering?','For anything beyond a simple fixed package, yes. Confirm engine version, deliverables, source files, deadline and acceptance criteria first.'],['How should revisions work?','A revision should adjust the agreed deliverable, not silently expand the original scope. Extra scope should be quoted separately.']].map(x=>`<details class="neo-brutal-card"><summary>${x[0]}<span>+</span></summary><p>${x[1]}</p></details>`).join('')}</section>
      ${ctaFooter()}
    </div>`;
  }

  function creatorCommerceView(key){
    const c=creators.find(x=>x.key===key);
    if(!c) return missingDetailView('Creator', '#/explore', 'creators');
    const ownProjects=projects.filter(x=>x.creatorKey===c.key);
    const ownServices=services.filter(x=>x.creatorKey===c.key);
    const visibleServices=ownServices.length?ownServices:services.slice(0,3);
    
    return `<div class="page-shell creator-commerce-page">${pixelField()}<section class="profile-cover"></section><div class="profile-shell">
      ${profileBentoGrid(c)}
      <section class="creator-commerce-bar bento-card glass-card"><div><span class="availability-dot"></span><div><b>Available for new work</b><small>Usually responds in under 2 hours \u00B7 India Standard Time</small></div></div><div><button class="btn btn-secondary" data-gig-chat-open><span class="gig-message-icon" aria-hidden="true">${icons.message}</span> Message ${escapeHtml(c.name.split(' ')[0])}</button><a class="btn btn-primary" href="#/creator-gigs/${escapeHtml(c.key)}">View gigs \u2192</a></div></section>
      
      <!-- MOVED BENTO & ANALYTICS ABOVE THE STOREFRONT -->
      ${creatorBentoGrid(c,ownProjects,ownServices)}
      ${analyticsNeuGrid(c)}

      <!-- MOVED STOREFRONT BELOW -->
      <section class="creator-shop-grid">
        <div><div class="section-head simple-head"><div><p class="eyebrow">Creator storefront</p><h2>Gigs & packages</h2><p>Choose a defined service or send a custom production brief.</p></div></div><div class="cards-3" id="creator-gigs">${visibleServices.map(enhancedServiceCard).join('')}</div></div>
        <aside class="creator-brief-card bento-card glass-card"><p class="eyebrow">Custom request</p><h2>Send a production brief</h2><label>What do you need?<textarea rows="4" placeholder="Engine, feature, art style, deliverables\u2026"></textarea></label><div class="brief-mini-row"><label>Budget<select><option>\u20B91,000\u2013\u20B95,000</option><option>\u20B95,000\u2013\u20B915,000</option><option>\u20B915,000+</option></select></label><label>Timeline<select><option>Under 1 week</option><option>1\u20133 weeks</option><option>Flexible</option></select></label></div><button class="btn btn-primary" data-toast="Brief saved \u2014 sign in to send it">Request a quote</button><small>No payment is made until a package and scope are accepted.</small></aside>
      </section>

    </div>${gigChatPanel(c.name)}${ctaFooter()}</div>`;
  }
  function gigChatPanel(name){
    return `<div class="gig-chat-backdrop" id="gigChatPanel" hidden><section class="gig-chat-window"><header><div><span class="availability-dot"></span><div><b>${escapeHtml(name)}</b><small>Online \u00B7 typically replies in 2h</small></div></div><button type="button" data-gig-chat-close aria-label="Close chat">\u00D7</button></header><div class="gig-chat-context"><span>Pre-order conversation</span><small>Do not share passwords, OTPs or payment details in chat.</small></div><div class="gig-chat-messages" id="gigChatMessages"><p>Hi! Share your engine, scope and deadline. I can recommend the right package.</p></div><form id="gigChatForm"><button type="button" data-toast="Attachment chooser opened">\uFF0B</button><input id="gigChatInput" required maxlength="500" placeholder="Ask about the gig\u2026"><button type="submit">Send</button></form></section></div>`;
  }

  function serviceViewDeep(key){
    const s=services.find(x=>x.key===key);
    if(!s) return missingDetailView('Service', '#/freelancers', 'freelance services');
    const creator=creators.find(c=>c.key===s.creatorKey)||creators[0];
    const packs=servicePackages(s);
    const p=packs[1];
    const procedure=[
      ['01','Pick a package','Compare Basic, Standard and Premium deliverables. Confirm source files, delivery time and included revisions before moving on.'],
      ['02','Send structured requirements','Share engine/version, references, dimensions, acceptance criteria, files, deadline and anything the creator must not change.'],
      ['03','Creator confirms scope','The creator reviews your brief, asks questions, flags missing inputs and explicitly accepts the delivery date and package scope.'],
      ['04','Protected checkout','Review the final amount, extras and terms. Production should use a compliant payment flow and show when funds are authorized or captured.'],
      ['05','Work + milestone updates','The creator works against the agreed scope and posts progress checkpoints. Major scope changes require both sides to agree before the deadline changes.'],
      ['06','Delivery and revision window','Files are submitted in the agreed format. You check them against the acceptance criteria and use only the revisions included in your package.'],
      ['07','Approval, release and review','Approve the delivery, complete the payment-release step in the production flow, then leave a verified-order review tied to the completed transaction.']
    ];
    return `<div class="page-shell service-detail gig-detail-page">${pixelField()}
      <nav class="breadcrumb"><a href="#/freelancers">Freelance</a><span>›</span><span>${escapeHtml(s.category)}</span></nav>
      <section class="gig-person-top neo-brutal-card"><div class="gig-person-id">${avatarMarkup(creator.avatar,creator.name,'avatar-lg')}<div><small>Freelancer</small><b>${escapeHtml(creator.name)}</b><span>${escapeHtml(creator.handle)} · ${escapeHtml(creator.location)}</span></div></div><div class="gig-person-signals">${kycStatusBadge(creator)}<span class="creator-live-status"><i></i> Available · replies in ${escapeHtml(s.response||'2 hours')}</span></div></section>
      <section class="gig-detail-head"><div><span class="pill">${escapeHtml(s.category)}</span><h1>${escapeHtml(s.title)}</h1><div class="gig-title-seller"><span>★ ${s.rating} (${s.orders||creator.orders})</span><span>${creator.orders} completed orders</span><span>Trust ${creatorTrustScore(creator)}/100</span></div></div><div class="gig-head-actions"><button class="icon-btn glass-card" data-toast="Gig saved" aria-label="Like gig">♡</button><button class="icon-btn glass-card" data-toast="Gig link copied" aria-label="Share gig">${icons.share}</button></div></section>
      <div class="service-layout gig-service-layout">
        <main>
          <div class="service-main-image media-fallback"><img src="${s.image||'assets/service-game.jpg'}" alt="${escapeHtml(s.title)}"><div class="gig-image-overlay"><span>PORTFOLIO PREVIEW</span><b>Game-ready delivery with editable source</b></div></div>
          <section class="gig-about"><h2>About this gig</h2><p>${escapeHtml(s.desc)}</p><div class="tag-list">${s.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div><div class="gig-proof-grid">${[[String(s.orders||creator.orders),'Completed orders'],[s.rating+'/5','Client rating'],['94%','On-time delivery'],[s.response||'2 hours','Average response']].map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></section>
          <section class="package-comparison"><div class="section-head neo-brutal-header"><div><p class="eyebrow">Compare packages</p><h2>Choose the right scope</h2></div></div><div class="package-table">${packs.map(x=>`<button class="package-column neo-brutal-card ${x.key==='standard'?'selected':''}" data-package="${x.key}" data-package-price="${x.price}" data-package-days="${x.days}"><strong>${x.name}</strong><em>₹${fmt(x.price)}</em><p>${x.desc}</p><span>${x.days} days</span><span>${x.revisions} revisions</span><ul>${x.items.map(i=>`<li>✓ ${i}</li>`).join('')}</ul><b>Select ${x.name}</b></button>`).join('')}</div></section>
          <section class="gig-process detailed-gig-process"><div class="neo-brutal-header"><div><p class="eyebrow">Detailed procedure</p><h2>Exactly how the order should move</h2><p>No vague seven-word timeline: each step shows what the buyer and freelancer are expected to do.</p></div></div><div class="order-procedure-grid">${procedure.map(x=>`<article class="order-procedure-card neo-brutal-card"><span>${x[0]}</span><div><h3>${x[1]}</h3><p>${x[2]}</p></div></article>`).join('')}</div></section>
          <section class="gig-faq brutal-faq"><div class="neo-brutal-header"><div><p class="eyebrow">Freelance FAQ</p><h2>Before you place an order</h2></div></div>${[['Can I request a custom scope?','Yes. Message the creator or send a structured brief before ordering. The final scope should be written down before checkout.'],['Will I receive source files?','Source files are included when the selected package says so. Confirm formats and editable-source requirements in the brief.'],['What if my requirements change?','Treat it as a scope change. The freelancer should quote the impact on price, delivery and revisions before continuing.'],['Can the delivery date change?','Only after both sides agree to a revised scope or timeline. The change should be visible in the order history.'],['How are reviews verified?','Only completed platform orders should create verified-order reviews, and the trust score should remain separate from any single review.'],['What should I never send in chat?','Do not send passwords, OTPs, card details or private credentials. Use secure project/file access with the minimum permissions needed.']].map(x=>`<details class="neo-brutal-card"><summary>${x[0]}<span>+</span></summary><p>${x[1]}</p></details>`).join('')}</section>
        </main>
        <aside class="side-stack gig-order-stack">
          <article class="order-card neo-brutal-card gig-order-card">
            <div class="gig-package-tabs">${packs.map(x=>`<button data-package="${x.key}" data-package-price="${x.price}" data-package-days="${x.days}" class="${x.key==='standard'?'active':''}">${x.name}</button>`).join('')}</div>
            <div class="order-selected"><span id="selectedPackageName">Standard package</span><b id="selectedPackagePrice">₹${fmt(p.price)}</b></div><p id="selectedPackageDesc">${p.desc}</p><ul id="selectedPackageItems">${p.items.map(i=>`<li>✓ ${i}</li>`).join('')}</ul><div class="order-meta"><span id="selectedPackageDays">◷ ${p.days} days</span><span id="selectedPackageRevisions">↻ ${p.revisions} revisions</span></div>
            <div class="gig-extras"><p>Add extras</p><label><input type="checkbox" data-gig-extra="Fast delivery" data-extra-price="${Math.round(s.price*.45)}"> 48-hour priority <b>+₹${fmt(Math.round(s.price*.45))}</b></label><label><input type="checkbox" data-gig-extra="Consultation" data-extra-price="499"> 30-minute planning call <b>+₹499</b></label><label><input type="checkbox" data-gig-extra="Support" data-extra-price="799"> 14-day post-delivery support <b>+₹799</b></label></div>
            <div class="gig-total"><span>Estimated total</span><b id="gigOrderTotal">₹${fmt(p.price)}</b></div><a class="btn btn-primary magnetic" data-place-gig-order href="#/order/${escapeHtml(s.key)}/requirements">Continue to requirements</a><button class="btn btn-ghost" data-gig-chat-open><span class="gig-message-icon" aria-hidden="true">${icons.message}</span> Chat with ${escapeHtml(creator.name.split(' ')[0])}</button><small>Prototype checkout. Connect identity, contracts, payment, dispute and delivery services before production use.</small>
          </article>
          <article class="seller-card neo-brutal-card"><div class="seller-head">${avatarMarkup(creator.avatar,creator.name,'avatar-lg')}<div><b>${escapeHtml(creator.name)}</b><span>${escapeHtml(creator.handle)}</span></div></div><p>${escapeHtml((creatorExtras[creator.key]||{}).bio||creator.role)}</p><div class="seller-stats"><span>★ ${creator.rating}</span><span>${creator.orders} orders</span><span>${escapeHtml(creator.location)}</span></div><div class="badges">${verificationBadges(creator)}</div><a class="text-link" href="#/creator/${creator.key}">Open full profile →</a></article>
        </aside>
      </div>${gigChatPanel(creator.name)}${ctaFooter()}
    </div>`;
  }

  let marketFilterState={category:'All',query:'',sort:'popular'};
  function marketplaceViewDeep(){
    const categoryGroups=['All','3D','2D','Animation','Audio','Code','Tools','UI/UX','VFX','Templates'];
    return `<div class="page-shell marketplace-page marketplace-deep">${pixelField()}
      <section class="marketplace-hero market-command"><div><p class="eyebrow">Nexora Marketplace \u00B7 ${marketplaceCatalog.length}+ curated listings</p><h1>Everything a game team <span class="gradient-text">builds with.</span></h1><p>Characters, environments, code systems, plugins, audio, animation, VFX, UI, textures, templates, localization and production tools.</p><div class="market-main-search"><span>\u2315</span><input id="marketSearch" placeholder="Search assets, engines, formats or creators\u2026"><button>Search</button></div></div><div class="market-command-card bento-card glass-card"><p class="eyebrow">Creator commerce</p><b>Sell once. Reach every stage of production.</b><span>Commercial licences \u00B7 version notes \u00B7 reviews \u00B7 updates \u00B7 fixed-price drops \u00B7 bundles</span><a class="btn btn-primary" href="#/asset-manager/new">List an asset \u2192</a></div></section>
      <section class="market-stat-strip bento-card glass-card">${[['24','Asset categories'],['4.9/5','Average verified rating'],['12.8K','Monthly downloads'],['\u20B94.6L','Creator sales this month'],['92%','Assets with commercial licence']].map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</section>
      <nav class="market-category-rail glass-card">${categoryGroups.map((c,i)=>`<button class="market-filter ${i===0?'active':''}" data-market-filter="${c}">${c}</button>`).join('')}</nav>
      <div class="marketplace-layout deep-market-layout">
        <aside class="market-facets bento-card glass-card">
          <div><p class="eyebrow">Refine</p><h2>Filters</h2></div>
          <fieldset><legend>Engine</legend>${['Any engine','Unity','Unreal','Universal'].map((x,i)=>`<label><input type="radio" name="market-engine" value="${i?x:'All'}" ${i===0?'checked':''}> ${x}</label>`).join('')}</fieldset>
          <fieldset><legend>Asset type</legend>${['3D & environments','2D & textures','Code & systems','Audio & music','UI & icons','Animation & mocap','Shaders & VFX','Tools & templates'].map(x=>`<label><input type="checkbox" data-toast="Use the category chips above to filter this prototype"> ${x}</label>`).join('')}</fieldset>
          <fieldset><legend>Licence</legend><label><input type="checkbox" checked> Commercial use</label><label><input type="checkbox"> Extended studio</label><label><input type="checkbox"> Free / open licence</label></fieldset>
          <fieldset><legend>Price</legend><label><input type="radio" name="market-price" checked> Any price</label><label><input type="radio" name="market-price"> Under \u20B9500</label><label><input type="radio" name="market-price"> \u20B9500\u2013\u20B91,500</label><label><input type="radio" name="market-price"> \u20B91,500+</label></fieldset>
          <button class="btn btn-secondary" data-market-reset>Reset filters</button>
        </aside>
        <section class="marketplace-assets"><div class="marketplace-section-head"><div><p class="eyebrow">Asset library</p><h2>Game-development marketplace</h2></div><div class="market-results-tools"><span id="marketResultCount">${marketplaceCatalog.length} assets</span><select id="marketSort" aria-label="Sort assets"><option value="popular">Most popular</option><option value="rating">Top rated</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div></div><div class="marketplace-asset-grid deep-market-grid" id="marketDeepGrid">${marketplaceCatalog.map(deepAssetCard).join('')}</div></section>
        <aside class="marketplace-forums bento-card glass-card"><div class="forums-head"><div><p class="eyebrow">Builder forum</p><h2>Ask before you buy</h2></div><a href="#/community">Open \u2192</a></div><p>Compatibility checks, workflow advice, team requests and seller discussions.</p><div class="forum-list">${marketplaceForums.map(f=>`<a href="#/community" class="forum-row"><span class="forum-tag">${escapeHtml(f.tag)}</span><strong>${escapeHtml(f.title)}</strong><small>${f.replies} replies \u00B7 ${f.time}</small></a>`).join('')}</div><a class="btn btn-primary forum-cta" href="#/community">Visit builder guilds</a></aside>
      </div>
      <section class="brutal-faq marketplace-listing-faq"><div class="neo-brutal-header"><div><p class="eyebrow">Marketplace FAQ</p><h2>Preview, compatibility and purchase basics</h2></div></div>${[['How do I open an asset?','Click the card or its Preview button. Each listing now has its own detail route instead of a dead card.'],['Can listings have several images?','Yes. The Quick view control opens a stable gallery without relying on a hover delay.'],['Is video supported?','Yes. Add a video URL to the listing data and the detail gallery exposes a video preview alongside the images.'],['Why are seller KYC and trust visible?','They make identity verification and the separate trust score visible before you open checkout or contact the seller.']].map(x=>`<details class="neo-brutal-card"><summary>${x[0]}<span>+</span></summary><p>${x[1]}</p></details>`).join('')}</section>
      ${ctaFooter()}
    </div>`;
  }

  const ecosystemHubs={
    auctions:{
      eyebrow:'Limited creator drops',title:'Fixed-price asset drops',subtitle:'Rare packs, source libraries, premium licences and limited creator releases at transparent fixed prices \u2014 no bidding or auction mechanics.',
      primary:'Browse releases',secondary:'Marketplace rules',stats:[['14','Live drops'],['\u20B92.8L','Release value'],['94','Watching now'],['4','New this week']],
      filters:['All drops','New releases','3D assets','Source code','Audio','Extended licence'],
      items:[
        ['LIMITED RELEASE','Cyberpunk City Master Pack','Fixed price \u20B912,400','Includes editable source, commercial licence and seller Q&A.','View release'],
        ['RARE DROP','Hampi Photogrammetry Collection','Fixed price \u20B928,500','Museum-quality scans with project files and a limited studio licence.','View release'],
        ['SOURCE RELEASE','Co-op Netcode Framework','Fixed price \u20B919,800','Documented source framework, profiling notes and handover session.','View release'],
        ['AUDIO VAULT','Mumbai Midnight Stem Library','Fixed price \u20B98,600','Original multitrack stems, alternates and trailer cut-downs.','View release']
      ]
    },
    jams:{
      eyebrow:'Build with the community',title:'Game jams & sprints',subtitle:'Discover themes, find teammates, submit playable builds and follow judging \u2014 all connected to creator profiles and production resources.',
      primary:'Join a jam',secondary:'Find teammates',stats:[['3','Active jams'],['214','Builders'],['38','Submissions'],['12 days','Next deadline']],
      filters:['Active','Upcoming','Beginner-friendly','48 hour','Online','India-wide'],
      items:[
        ['ACTIVE \u00B7 REBIRTH','Monsoon Game Jam 2026','214 participants \u00B7 Aug 24 deadline','Build around \u201CRebirth\u201D with dedicated guilds, starter assets and public voting.','View jam'],
        ['UPCOMING \u00B7 ONE BUTTON','48-Hour Indie Sprint','Starts Sep 6 \u00B7 0 submissions','Prototype a complete game loop using one input in a focused weekend.','Set reminder'],
        ['OPEN \u00B7 ACCESS FOR ALL','Accessible Play Challenge','86 participants \u00B7 Sep 18 deadline','Design around readable UI, remapping, subtitles and inclusive mechanics.','Join challenge'],
        ['SHOWCASE','Student Game Showcase','College teams \u00B7 Oct 4 deadline','Publish student work, collect feedback and meet verified studios.','View showcase']
      ]
    },
    jobs:{
      eyebrow:'Work in games',title:'Jobs, gigs & collaboration calls',subtitle:'Verified studio roles, contract work, rev-share experiments and jam-team openings with clear scope, location and compensation labels.',
      primary:'Post an opportunity',secondary:'Browse talent',stats:[['42','Open roles'],['18','Verified studios'],['11','Remote-first'],['7','New this week']],
      filters:['All roles','Full-time','Contract','Freelance','Remote','Jam team'],
      items:[
        ['REMOTE \u00B7 CONTRACT','Unreal Gameplay Programmer','\u20B965K\u2013\u20B995K / month \u00B7 4 months','Build combat and interaction systems for a funded vertical slice.','View role'],
        ['BENGALURU \u00B7 FULL-TIME','Technical Artist \u2014 Unity','\u20B98L\u2013\u20B912L / year','Shaders, performance profiling and content-pipeline tooling.','View role'],
        ['REMOTE \u00B7 FREELANCE','Pixel Artist for Narrative RPG','\u20B935K fixed scope \u00B7 6 weeks','Characters, portraits and two environment tilesets.','Send portfolio'],
        ['JAM TEAM \u00B7 WEEKEND','Sound designer wanted','Credit + prize share \u00B7 Monsoon Jam','Join a three-person team with a working gameplay prototype.','Join team']
      ]
    },
    funding:{
      eyebrow:'Creator funding toolkit',title:'Plan a campaign people can trust',subtitle:'Set a credible goal, show proof, design rewards, communicate risk and organize milestone updates before you ask the community to back.',
      primary:'Start funding plan',secondary:'Explore campaigns',stats:[['\u20B94.2Cr+','Platform funding'],['860+','Projects funded'],['\u20B91,499','Typical pledge'],['12%','Launch-day target']],
      filters:['Campaign basics','Goal planning','Rewards','Proof & trust','Launch plan','Updates'],
      items:[
        ['STEP 01','Funding goal planner','Budget \u00B7 fees \u00B7 contingency \u00B7 reward cost','Turn production costs into a transparent, achievable public goal.','Open planner'],
        ['STEP 02','Proof checklist','Demo \u00B7 team \u00B7 ownership \u00B7 timeline','Show enough evidence for backers to judge the idea and execution risk.','Review proof'],
        ['STEP 03','Reward architect','Digital \u00B7 physical \u00B7 experience tiers','Build simple tiers whose fulfilment cost will not consume the campaign.','Design rewards'],
        ['STEP 04','Launch calendar','Prelaunch \u00B7 day one \u00B7 weekly updates','Prepare audience outreach and a responsible communication rhythm.','Build calendar']
      ]
    },
    devlogs:{
      eyebrow:'Build in public',title:'Creator devlogs',subtitle:'Follow playable progress, art passes, engineering lessons, funding milestones and honest production notes from across the platform.',
      primary:'Post a devlog',secondary:'Follow creators',stats:[['63','Posts today'],['482','Active creators'],['146','Playable builds'],['8.4K','Weekly reactions']],
      filters:['For you','Games','Art','Programming','Audio','Funding milestones'],
      items:[
        ['BUILD 0.7 \u00B7 18M','Aether controller & localization pass','Ananya Das \u00B7 128 reactions','Controller remapping, Assamese dialogue review and a new accessibility menu.','Read devlog'],
        ['PERFORMANCE \u00B7 42M','Co-op reconciliation bug solved','Karthik Iyer \u00B7 94 reactions','A deep dive into the rounding error behind two weeks of netcode desync.','Read devlog'],
        ['ART PASS \u00B7 1H','Monsoon palette exploration','Meera Nair \u00B7 77 reactions','Wet-surface values, roof shading and a compact palette breakdown.','Read devlog'],
        ['AUDIO DROP \u00B7 2H','Adaptive midnight radio stems','Rohan Mehta \u00B7 68 reactions','How the soundtrack moves between exploration and passenger dialogue.','Listen & read']
      ]
    },
    events:{
      eyebrow:'Calendar for builders',title:'Events, launches & workshops',subtitle:'Game jams, creator sessions, portfolio reviews, launch streams and practical workshops in one schedule.',
      primary:'View calendar',secondary:'Host an event',stats:[['9','This month'],['4','Online'],['3','Free workshops'],['1,280','Registered']],
      filters:['All events','This week','Online','Workshops','Launches','Meetups'],
      items:[
        ['AUG 18 \u00B7 ONLINE','How to budget an indie game campaign','Free \u00B7 7:00 PM IST','A practical breakdown of scope, contingencies, reward cost and funding goals.','Register'],
        ['AUG 24 \u00B7 ONLINE','Monsoon Game Jam submission night','Public stream \u00B7 9:00 PM IST','Final build check, submission support and creator showcase.','View event'],
        ['AUG 29 \u00B7 BENGALURU','Game art portfolio review','40 seats \u00B7 Indiranagar','Ten-minute review slots with verified art leads and indie founders.','Reserve spot'],
        ['SEP 06 \u00B7 ONLINE','48-Hour Indie Sprint kickoff','Free \u00B7 6:00 PM IST','Theme reveal, team matching and starter resource walkthrough.','Set reminder']
      ]
    },
    tutorials:{
      eyebrow:'Learn by shipping',title:'Creator playbooks & tutorials',subtitle:'Practical learning paths for production, game funding, marketplaces, freelance delivery, community building and launch.',
      primary:'Start learning',secondary:'Browse mentors',stats:[['86','Tutorials'],['14','Learning paths'],['32','Creator mentors'],['4.9/5','Learner rating']],
      filters:['Funding','Unity','Unreal','Game art','Freelancing','Marketing'],
      items:[
        ['6 LESSONS \u00B7 BEGINNER','Launch a credible funding campaign','Goal, proof, rewards, risks and a 30-day communication plan.','Includes templates and checklist.','Start path'],
        ['9 LESSONS \u00B7 INTERMEDIATE','Production-ready Unreal Blueprints','Architecture, interfaces, debugging and performance habits.','Includes sample project.','Start path'],
        ['5 LESSONS \u00B7 BEGINNER','Sell your first game asset','Packaging, licences, previews, pricing, updates and support.','Includes listing template.','Start path'],
        ['7 LESSONS \u00B7 ALL LEVELS','Freelance without scope chaos','Discovery calls, packages, milestones, revisions and handover.','Includes contract checklist.','Start path']
      ]
    },
    leaderboards:{
      eyebrow:'Transparent momentum',title:'Leaderboards',subtitle:'Discover creators, campaigns, assets and community contributors through separate, understandable ranking signals \u2014 not one opaque score.',
      primary:'View methodology',secondary:'Explore creators',stats:[['#1','Iron Monsoon'],['#1','Vikram Rao'],['#1','Footstep SFX'],['#1','Indie Devs Circle']],
      filters:['Funding velocity','Most backed','Top sellers','Rising creators','Community MVPs','This month'],
      items:[
        ['#01 \u00B7 +18.4%','Iron Monsoon \u2014 Co-op Survival','\u20B96.84L raised \u00B7 421 backers','Funding velocity leaderboard \u00B7 updated hourly.','View campaign'],
        ['#02 \u00B7 5.0 \u2605','Vikram Rao','31 orders \u00B7 4 delivered projects','Verified delivery and client rating leaderboard.','View creator'],
        ['#03 \u00B7 1,140 SALES','900+ Footsteps & Foley SFX','4.9 \u2605 \u00B7 commercial licence','Marketplace sales leaderboard \u00B7 rolling 30 days.','View asset'],
        ['#04 \u00B7 1,240 MEMBERS','Indie Devs Circle','86 online \u00B7 312 weekly posts','Community contribution and healthy activity signals.','Open guild']
      ]
    },
    rewards:{
      eyebrow:'Backer collection',title:'Rewards, unlocks & fulfilment',subtitle:'Track the projects you backed, digital entitlements, delivery updates, surveys and fulfilment status from one organized home.',
      primary:'Open my rewards',secondary:'Discover projects',stats:[['6','Active rewards'],['2','Ready to claim'],['3','In production'],['1','Survey needed']],
      filters:['All rewards','Action needed','Digital','Physical','Delivered','Saved tiers'],
      items:[
        ['READY TO CLAIM','Aether early-player pack','Digital game key \u00B7 closed beta','Creator has unlocked the beta entitlement for eligible backers.','Claim reward'],
        ['SURVEY NEEDED','Hampi Builders founder pack','Name credit \u00B7 language preference','Submit fulfilment details before the survey closes.','Complete survey'],
        ['IN PRODUCTION','Moonlit Auto soundtrack bundle','Game key \u00B7 soundtrack \u00B7 artbook','Audio master complete; game build remains in production.','View timeline'],
        ['SAVED TIER','Iron Monsoon world builder','Design call \u00B7 named survivor','Saved for later; campaign has 12 days remaining.','Back this tier']
      ]
    }
  };

  const ecosystemRouteMap={
    auctions:['#/drop/cyberpunk-city','#/drop/hampi-photogrammetry','#/drop/coop-netcode','#/drop/midnight-stems'],
    jams:['#/jam/monsoon-2026','#/jam/one-button-sprint','#/jam/accessible-play','#/jam/student-showcase'],
    jobs:['#/job/unreal-gameplay','#/job/technical-artist','#/job/pixel-artist-rpg','#/job/jam-sound-designer'],
    funding:['#/funding-tool/goal-planner','#/funding-tool/proof-checklist','#/funding-tool/reward-architect','#/funding-tool/launch-calendar'],
    devlogs:['#/devlog/aether-controller','#/devlog/coop-reconciliation','#/devlog/monsoon-palette','#/devlog/midnight-radio'],
    events:['#/event/campaign-budgeting','#/event/monsoon-submission','#/event/portfolio-review','#/event/indie-sprint-kickoff'],
    tutorials:['#/tutorial/credible-campaign','#/tutorial/unreal-blueprints','#/tutorial/sell-game-asset','#/tutorial/freelance-scope'],
    leaderboards:['#/leaderboard/funding-velocity','#/leaderboard/creator-delivery','#/leaderboard/marketplace-sales','#/leaderboard/community-mvps'],
    rewards:['#/reward/aether-player-pack','#/reward/hampi-founder-pack','#/reward/moonlit-soundtrack','#/reward/iron-monsoon-world-builder']
  };
  const ecosystemHeroRoutes={
    auctions:['#/marketplace','#/pricing-fees'],jams:['#/jam/monsoon-2026','#/discussion-new'],jobs:['#/discussion-new','#/explore'],funding:['#/start-project','#/projects'],devlogs:['#/discussion-new','#/explore'],events:['#/event/campaign-budgeting','#/discussion-new'],tutorials:['#/tutorial/credible-campaign','#/explore'],leaderboards:['#/leaderboard/funding-velocity','#/explore'],rewards:['#/reward/aether-player-pack','#/projects']
  };

  function ecosystemHubView(page){
    const h=ecosystemHubs[page];
    const itemRoutes=ecosystemRouteMap[page]||[];
    const heroRoutes=ecosystemHeroRoutes[page]||['#/','#/'];
    return `<div class="page-shell ecosystem-page ecosystem-${page}">${pixelField()}
      <section class="ecosystem-hero experience-hero"><div><p class="eyebrow">${h.eyebrow}</p><h1>${h.title}</h1><p>${h.subtitle}</p><div class="hero-actions"><a class="btn btn-primary" href="${heroRoutes[0]}">${h.primary} \u2192</a><a class="btn btn-secondary" href="${heroRoutes[1]}">${h.secondary}</a></div></div><div class="ecosystem-stats bento-card">${h.stats.map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></section>
      <nav class="ecosystem-filters bento-card">${h.filters.map((x,i)=>`<button class="ecosystem-filter ${i===0?'active':''}" data-ecosystem-filter="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join('')}<label><span>\u2315</span><input id="ecosystemSearch" placeholder="Search this hub\u2026"></label></nav>
      <section class="ecosystem-layout"><div><div class="marketplace-section-head"><div><p class="eyebrow">Explore ${page}</p><h2>Current highlights</h2></div><span id="ecosystemCount">${h.items.length} results</span></div><div class="ecosystem-card-grid" id="ecosystemGrid">${h.items.map((x,i)=>`<article class="ecosystem-card bento-card" data-ecosystem-item data-ecosystem-search="${escapeHtml(x.join(' ').toLowerCase())}"><div class="ecosystem-card-art art-${i%4}"><span>${String(i+1).padStart(2,'0')}</span><i>${['\u2726','\u26A1','\u25C6','\u25CF'][i%4]}</i></div><div><p class="eyebrow">${escapeHtml(x[0])}</p><h3>${escapeHtml(x[1])}</h3><b>${escapeHtml(x[2])}</b><p>${escapeHtml(x[3])}</p><a class="btn btn-secondary" href="${itemRoutes[i]||'#/'+page}">${escapeHtml(x[4])} \u2192</a></div></article>`).join('')}</div></div><aside class="ecosystem-rail"><article class="bento-card"><p class="eyebrow">Live activity</p><h2>Happening now</h2>${communityActivity.concat([{actor:'Nexora',action:'verified a new opportunity in',target:h.title,type:'Live',time:'8m ago'}]).map(x=>`<div class="eco-activity"><span>${x.actor.charAt(0)}</span><p><b>${x.actor}</b> ${x.action} <strong>${x.target}</strong><small>${x.time}</small></p></div>`).join('')}</article><article class="bento-card eco-help"><span>?</span><h3>Need help here?</h3><p>Every hub keeps rules, trust signals and reporting paths close to the action.</p><a href="#/support-topic/${page==='rewards'?'projects':'marketplace'}">Open help centre \u2192</a></article></aside></section>
      ${ctaFooter()}
    </div>`;
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

    // 3. NEW: Dynamic Mesh Background Speed
    const meshBg = document.querySelector('body:not(.is-community-page) .mesh-bg');
    if (meshBg) {
      // Create the base slow animation (35 seconds)
      const meshAnim = gsap.to(meshBg, {
        backgroundPosition: "100% 100%",
        duration: 35,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });

      let scrollTimeout;
      
      // Use ScrollTrigger to detect when the page is actively scrolling
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => {
          // While scrolling, smoothly boost the animation speed to 10x
          gsap.to(meshAnim, { timeScale: 10, duration: 0.3, overwrite: true });
          
          clearTimeout(scrollTimeout);
          
          // When scrolling stops, ease back down to 1x (normal slow speed) over 1.5 seconds
          scrollTimeout = setTimeout(() => {
            gsap.to(meshAnim, { timeScale: 1, duration: 1.5, ease: "power2.out", overwrite: true });
          }, 100);
        }
      });
    }
  }


  // ============================================================
  // NEXORA ACCOUNT SYSTEM \u2014 prototype/local persistence layer
  // ============================================================
  const ACCOUNT_KEY = 'nexora_accounts_v1';
  const SESSION_KEY = 'nexora_session_v1';

  const defaultAccount = {
    id:'demo-user',
    name:'Nexora Creator',
    username:'@nexoracreator',
    email:'creator@gmail.com',
    avatar:'',
    provider:'email',
    credits:2450,
    projectsBacked:18,
    donated:42500,
    projectsCreated:4,
    followers:1240,
    following:186,
    popularity:87,
    joined:'August 2026',
    joinedDate:'August 10, 2026',
    lastActive:'Today, 8:42 PM',
    bio:'Indie game creator, backer and game-dev community member.',
    chart:[54,61,58,66,72,68,76,87],
    activity:[
      {title:'Backed Aether',meta:'\u20B92,500 \u00B7 2 days ago'},
      {title:'Bought Pixel Forest Pack',meta:'850 credits \u00B7 5 days ago'},
      {title:'Published a project',meta:'1 week ago'},
      {title:'Earned Community Supporter badge',meta:'2 weeks ago'}
    ],
    backed:[
      {title:'Aether \u2014 A Hand-Drawn 2D Adventure',category:'Indie Games',amount:'\u20B92,500',status:'Funding'},
      {title:'Project Monsoon',category:'Action Adventure',amount:'\u20B95,000',status:'Funded'},
      {title:'Pixel Forest Pack',category:'Assets',amount:'850 credits',status:'Purchased'}
    ],
    fundingHistory:[
      {month:'Mar',amount:4500,label:'Aether'},
      {month:'Apr',amount:6200,label:'Project Monsoon'},
      {month:'May',amount:7800,label:'Indie Game Jam'},
      {month:'Jun',amount:5400,label:'Solar Sentinel'},
      {month:'Jul',amount:9800,label:'Creator campaigns'},
      {month:'Aug',amount:8800,label:'Current funding'}
    ],
    orderHistory:[
      {id:'DF-24081',item:'Pixel Forest Pack',type:'Marketplace asset',date:'Aug 7, 2026',amount:'850 credits',status:'Completed'},
      {id:'DF-24052',item:'Synthwave UI & SFX Pack',type:'Marketplace asset',date:'Aug 2, 2026',amount:'1,450 credits',status:'Completed'},
      {id:'DF-24011',item:'3D Character Kit',type:'Creator service',date:'Jul 24, 2026',amount:'\u20B92,200',status:'Delivered'},
      {id:'DF-23974',item:'Indie Sound Bundle',type:'Marketplace asset',date:'Jul 15, 2026',amount:'1,100 credits',status:'Completed'}
    ],
    assets:[
      {name:'Pixel Forest Pack',creator:'Ananya Das',type:'Environment pack',updated:'Aug 7, 2026',status:'Installed'},
      {name:'Synthwave UI & SFX Pack',creator:'Rohan Mehta',type:'UI + audio',updated:'Aug 2, 2026',status:'Installed'},
      {name:'Indie Sound Bundle',creator:'Rohan Mehta',type:'Audio assets',updated:'Jul 15, 2026',status:'Available'}
    ],
    withdrawals:[
      {id:'WD-0182',date:'Aug 5, 2026',amount:'\u20B98,500',method:'UPI',status:'Paid'},
      {id:'WD-0164',date:'Jul 18, 2026',amount:'\u20B95,200',method:'Bank transfer',status:'Paid'}
    ],
    withdrawable:12840,
    protection:{email:true,phone:true,twoFactor:false,identity:true,loginAlerts:true}
  };

  function loadAccounts(){
    try {
      const raw=localStorage.getItem(ACCOUNT_KEY);
      const accounts=raw?JSON.parse(raw):{};
      if(!accounts['demo-user']) accounts['demo-user']=defaultAccount;
      return accounts;
    } catch(e){ return {'demo-user':defaultAccount}; }
  }
  function saveAccounts(accounts){ localStorage.setItem(ACCOUNT_KEY,JSON.stringify(accounts)); }
  function currentAccount(){
    try {
      const id=localStorage.getItem(SESSION_KEY);
      if(!id) return null;
      return loadAccounts()[id] || null;
    } catch(e){return null;}
  }
  function setSession(id){ localStorage.setItem(SESSION_KEY,id); updateAccountNav(); }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); updateAccountNav(); }
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function accountAvatarMarkup(a,size='md'){
    const initials=esc((a?.name||'User').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase());
    return a?.avatar ? `<img src="${esc(a.avatar)}" alt="" class="account-avatar ${size}">` : `<span class="account-avatar ${size} initials">${initials}</span>`;
  }
  function accountNavMarkup(a){
    if(!a) return `<a class="account-nav-btn magnetic" href="#/login" id="accountNavBtn">Account</a>`;
    return `<a class="account-nav-user magnetic" href="#/account" id="accountNavBtn">${accountAvatarMarkup(a,'sm')}<span>Account</span></a>`;
  }
  function updateAccountNav(){
    const a=currentAccount();
    const desktop=$('#accountNavBtn');
    if(desktop) desktop.outerHTML=accountNavMarkup(a);
    const mobile=$('#mobileAccountLink');
    if(mobile){
      mobile.outerHTML=a
        ? `<a href="#/account" id="mobileAccountLink">My account</a>`
        : `<a href="#/login" id="mobileAccountLink">Sign in</a>`;
    }
  }

  function fundingChart(a){
    const rows=(a.fundingHistory&&a.fundingHistory.length?a.fundingHistory:[
      {month:'Mar',amount:4500,label:'Aether'},
      {month:'Apr',amount:6200,label:'Project Monsoon'},
      {month:'May',amount:7800,label:'Indie Game Jam'},
      {month:'Jun',amount:5400,label:'Solar Sentinel'},
      {month:'Jul',amount:9800,label:'Creator campaigns'},
      {month:'Aug',amount:8800,label:'Current funding'}
    ]);
    const max=Math.max(...rows.map(x=>x.amount),1);
    const total=rows.reduce((sum,x)=>sum+x.amount,0);
    const barW=25, gap=7, baseY=126, chartH=92;
    const bars=rows.map((r,i)=>{
      const h=Math.max(7,(r.amount/max)*chartH);
      const x=10+i*(barW+gap);
      const y=baseY-h;
      return `<g><title>${esc(r.label)} \u2014 \u20B9${fmt(r.amount)}</title><rect x="${x}" y="${y.toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" rx="7" fill="#7650ef" opacity=".88"/><text x="${x+barW/2}" y="143" text-anchor="middle" font-size="8" fill="currentColor" opacity=".7">${esc(r.month)}</text></g>`;
    }).join('');
    return `<div class="funding-chart" aria-label="Funding activity chart"><svg viewBox="0 0 200 150" preserveAspectRatio="none"><line x1="8" y1="126" x2="192" y2="126" stroke="currentColor" opacity=".12"/>${bars}</svg><div class="chart-summary"><span><b>\u20B9${fmt(total)}</b> funded in the shown period</span><span>Monthly backing activity</span></div></div>`;
  }

  function accountView(){
    const a=currentAccount();
    if(!a) return loginView();
    const kyc=loadKyc();
    const required=kycDocs.filter(d=>d.required);
    const kycDone=required.filter(d=>kyc[d.id]).length;
    const orders=a.orderHistory||defaultAccount.orderHistory;
    const assets=a.assets||defaultAccount.assets;
    const funding=a.fundingHistory||defaultAccount.fundingHistory;
    const withdrawals=a.withdrawals||defaultAccount.withdrawals;
    const protection=a.protection||defaultAccount.protection;
    const protectedCount=Object.values(protection).filter(Boolean).length;
    const activity=a.activity&&a.activity.length?a.activity:defaultAccount.activity;
    const chartData=a.chart&&a.chart.length?a.chart:defaultAccount.chart;

    // Derived, prototype-only figures for the dashboard chrome
    const level=Math.max(1,Math.floor(a.popularity/15)+1);
    const xpIntoLevel=(a.popularity%15)*80;
    const xpForLevel=15*80;
    const servicesActive=Math.max(1,orders.filter(o=>/service/i.test(o.type)).length||assets.length);
    const communitiesJoined=Math.max(1,Math.round(a.followers/420));

    // Tiny inline sparkline generator, tinted per stat card
    const sparkline=(data,color,seed=0)=>{
      const pts=data.map((v,i)=>[i,(v+seed*3)%(Math.max(...data)+8)]);
      const w=120,h=34,max=Math.max(...pts.map(p=>p[1]))||1,min=Math.min(...pts.map(p=>p[1]));
      const range=Math.max(max-min,1);
      const step=w/(pts.length-1);
      const path=pts.map((p,i)=>`${i===0?'M':'L'}${(i*step).toFixed(1)},${(h-4-((p[1]-min)/range)*(h-8)).toFixed(1)}`).join(' ');
      return `<svg class="dv-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${path}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    };

    const statCards=[
      {label:'Amount Funded',value:`\u20B9${fmt(a.donated)}`,trend:`\u2191 ${(a.donated%23)+8}.${a.donated%9}% this month`,icon:icons.rocket,tint:'purple'},
      {label:'Projects Backed',value:fmt(a.projectsBacked),trend:`+${Math.max(1,Math.round(a.projectsBacked*0.11))} this month`,icon:icons.briefcase,tint:'green'},
      {label:'Projects Created',value:fmt(a.projectsCreated),trend:a.projectsCreated?'+1 this month':'No change',icon:icons.award,tint:'orange'},
      {label:'Followers',value:fmt(a.followers),trend:`+${Math.max(1,Math.round(a.followers*0.018))} this month`,icon:icons.users,tint:'blue'},
      {label:'Reputation Score',value:`${a.popularity} / 100`,trend:`Top ${Math.max(5,100-a.popularity-15)}% creators`,icon:icons.star,tint:'lavender'}
    ];

    const activityIcons=[icons.rocket,icons.briefcase,icons.message,icons.award,icons.shield,icons.sparkle];

    const mkModal = (id, title, eyebrow, content) => `
      <div class="modal-backdrop" id="${id}" hidden>
        <section class="modal glass-panel" role="dialog" style="max-width: 650px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 24px 60px rgba(40,30,80,0.2);">
          <div class="modal-head">
            <div><p class="eyebrow">${eyebrow}</p><h2 style="font-size:28px; margin:0;">${title}</h2></div>
            <button class="icon-btn" type="button" data-modal-close="${id}">
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div style="margin-top:24px;">${content}</div>
        </section>
      </div>
    `;

    const navItem=(icon,label,href,opts={})=>`<a class="dv-nav-item${opts.active?' active':''}" ${opts.tab?`data-acc-tab="${opts.tab}"` : (opts.modal?`data-open-modal="${opts.modal}"`:`href="${href||'#'}"`)} ${opts.toast?`data-toast="${opts.toast}"`:''}>${icon}<span>${label}</span>${opts.badge?`<b class="dv-nav-badge">${opts.badge}</b>`:''}</a>`;

    return `
    <style>
      /* Dashboard is sized compactly so a typical screen doesn't need to scroll,
         but rows are never forced into a fixed box \u2014 content always wins over
         a strict height cap, so nothing can be squeezed down to zero height. */
      .dv-page{max-width:1500px;margin:0 auto;box-sizing:border-box;
        min-height:calc(100vh - var(--header-h));
        padding:12px clamp(14px,2vw,28px) 24px;}
      .dv-shell{display:grid;grid-template-columns:220px 1fr;gap:16px;align-items:start;}

      /* Sidebar */
      .dv-sidebar{position:sticky;top:calc(var(--header-h) + 12px);display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.86);backdrop-filter:blur(20px) saturate(160%);border:1px solid rgba(255,255,255,.8);border-radius:20px;padding:10px;box-shadow:var(--shadow-soft);max-height:calc(100vh - var(--header-h) - 24px);overflow-y:auto;}
      .dv-nav-item{display:flex;align-items:center;gap:10px;padding:8px 11px;border-radius:12px;font-weight:750;font-size:13px;color:#5c5b68;cursor:pointer;transition:.18s ease;position:relative;flex-shrink:0;}
      .dv-nav-item svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
      .dv-nav-item:hover{background:rgba(111,63,245,.08);color:var(--ink);}
      .dv-nav-item.active{background:linear-gradient(135deg,#7d3df7,#4d45e9);color:#fff;box-shadow:0 10px 22px rgba(89,61,230,.32);}
      .dv-nav-badge{margin-left:auto;background:var(--danger);color:#fff;font-size:10px;font-weight:900;padding:2px 7px;border-radius:999px;}
      .dv-nav-item.active .dv-nav-badge{background:rgba(255,255,255,.28);}
      .dv-sidebar-gap{height:6px;flex-shrink:0;}
      .dv-user-card{margin-top:8px;border-radius:16px;padding:12px;background:linear-gradient(160deg,#2a1a52,#4a2e8f);color:#fff;flex-shrink:0;}
      .dv-user-row{display:flex;align-items:center;gap:9px;margin-bottom:10px;}
      .dv-user-avatar{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.16);display:grid;place-items:center;font-weight:900;font-size:12.5px;flex-shrink:0;overflow:hidden;}
      .dv-user-avatar img{width:100%;height:100%;object-fit:cover;}
      .dv-user-name{font-weight:800;font-size:13px;line-height:1.2;}
      .dv-user-handle{font-size:11px;opacity:.7;}
      .dv-xp-label{display:flex;justify-content:space-between;font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.75;margin-bottom:5px;}
      .dv-xp-track{height:6px;border-radius:999px;background:rgba(255,255,255,.16);overflow:hidden;margin-bottom:5px;}
      .dv-xp-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#ffd23f,#ff9553);}
      .dv-xp-text{font-size:10px;font-weight:700;opacity:.75;}
      .dv-help-card{margin-top:6px;border-radius:14px;padding:10px;background:#f3eefe;color:#3a1f70;display:flex;align-items:center;gap:9px;flex-shrink:0;}
      .dv-help-card svg{width:16px;height:16px;flex-shrink:0;}
      .dv-help-card b{display:block;font-size:11.5px;}
      .dv-help-card small{font-size:10px;opacity:.75;}

      /* Main column \u2014 five stacked rows, each sized to its own content */
      .dv-main{display:flex;flex-direction:column;gap:10px;min-width:0;}

      .dv-kyc{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;background:linear-gradient(120deg,#fdecef,#fbe4e8);border:1px solid rgba(229,76,104,.18);border-radius:16px;padding:10px 16px;}
      .dv-kyc-left{display:flex;align-items:center;gap:12px;min-width:0;}
      .dv-kyc-icon{width:32px;height:32px;border-radius:10px;background:rgba(229,76,104,.14);color:var(--danger);display:grid;place-items:center;flex-shrink:0;}
      .dv-kyc-icon svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;}
      .dv-kyc-title{margin:0;font-size:13px;font-weight:800;color:#8f2438;}
      .dv-kyc-sub{margin:1px 0 0;font-size:11.5px;color:#9a4e5c;}
      .dv-kyc-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
      .dv-kyc-upload{background:var(--danger);color:#fff;font-weight:800;font-size:12px;padding:8px 14px;border-radius:11px;white-space:nowrap;box-shadow:0 10px 20px rgba(229,76,104,.28);}
      .dv-kyc-learn{font-weight:800;font-size:12px;color:#8f2438;white-space:nowrap;}
      .dv-kyc-close{width:26px;height:26px;border-radius:9px;display:grid;place-items:center;color:#9a4e5c;flex-shrink:0;}
      .dv-kyc-close svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2;}

      .dv-stats-row{flex:0 0 auto;display:grid;grid-template-columns:repeat(5,1fr);gap:12px;}
      .dv-stat-card{background:#fff;border:1px solid rgba(64,47,120,.07);border-radius:16px;padding:12px 14px 10px;box-shadow:var(--shadow-soft);}
      .dv-stat-top{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
      .dv-stat-icon{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;flex-shrink:0;}
      .dv-stat-icon svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;}
      .dv-stat-icon.purple{background:#efe6ff;color:#7d3df7;}
      .dv-stat-icon.green{background:#e2f8ee;color:#0aa06e;}
      .dv-stat-icon.orange{background:#fff0e0;color:#ff8a3d;}
      .dv-stat-icon.blue{background:#e6eeff;color:#3971f6;}
      .dv-stat-icon.lavender{background:#f1e9ff;color:#8a4bf0;}
      .dv-stat-label{font-size:11px;font-weight:700;color:var(--muted);}
      .dv-stat-value{font-size:18px;font-weight:900;letter-spacing:-.02em;margin:0 0 2px;}
      .dv-stat-trend{font-size:10.5px;font-weight:700;color:#0aa06e;margin:0 0 4px;}
      .dv-spark{width:100%;height:20px;display:block;opacity:.8;}

      .dv-row-2{display:grid;grid-template-columns:1.7fr 1fr;gap:14px;align-items:stretch;}
      .dv-card{background:#fff;border:1px solid rgba(64,47,120,.07);border-radius:18px;padding:16px 18px;box-shadow:var(--shadow-soft);display:flex;flex-direction:column;}
      .dv-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:10px;}
      .dv-card-title{font-size:15px;font-weight:800;margin:0 0 2px;}
      .dv-card-sub{font-size:11.5px;color:var(--muted);margin:0;}
      .dv-card-link{font-size:12px;font-weight:800;color:#6f3ff5;white-space:nowrap;}
      .dv-select{font-size:11.5px;font-weight:700;border:1px solid var(--line);background:#fff;border-radius:10px;padding:5px 9px;color:var(--ink);}

      .dv-chart-legend{display:flex;gap:14px;margin-bottom:8px;font-size:10.5px;font-weight:800;color:#5c5c68;}
      .dv-chart-legend span{display:flex;align-items:center;gap:6px;}
      .dv-chart-legend i{width:12px;height:9px;border-radius:3px;display:inline-block;}
      .dv-chart-body{width:100%;height:190px;position:relative;}
      .dv-chart-body svg{width:100%;height:100%;overflow:visible;}

      .dv-activity-list{display:flex;flex-direction:column;gap:2px;}
      .dv-activity-row{display:flex;align-items:center;gap:10px;padding:7px 6px;border-radius:12px;transition:.18s ease;}
      .dv-activity-row:hover{background:rgba(111,63,245,.06);}
      .dv-activity-icon{width:28px;height:28px;border-radius:9px;background:#f1eeff;color:#6f3ff5;display:grid;place-items:center;flex-shrink:0;}
      .dv-activity-icon svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2;}
      .dv-activity-title{font-size:12.5px;font-weight:700;margin:0;}
      .dv-activity-meta{font-size:11px;color:var(--muted);margin:1px 0 0;}

      .dv-mini-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); 
  gap: 10px;
}
      .dv-mini-tile{border:1px solid var(--line);border-radius:14px;padding:10px 12px;cursor:pointer;transition:.18s ease;background:#fbfaff;display:flex;flex-direction:column;justify-content:center;}
      .dv-mini-tile:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(64,47,120,.1);}
      .dv-mini-icon{width:24px;height:24px;border-radius:8px;background:#efe6ff;color:#7d3df7;display:grid;place-items:center;margin-bottom:6px;}
      .dv-mini-icon svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;}
      .dv-mini-title{font-size:12px;font-weight:800;margin:0 0 1px;}
      .dv-mini-sub{font-size:10.5px;color:var(--muted);margin:0 0 5px;}
      .dv-mini-cta{font-size:10.5px;font-weight:800;color:#6f3ff5;}

      .dv-quickbar{flex:0 0 auto;display:flex;align-items:center;gap:14px;background:linear-gradient(120deg,#3a2a86,#5b3fd9);border-radius:16px;padding:10px 18px;color:#fff;flex-wrap:wrap;}
      .dv-quickbar-label{display:flex;align-items:center;gap:8px;font-weight:800;font-size:12.5px;flex-shrink:0;}
      .dv-quickbar-label svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;}
      .dv-quick-actions{display:flex;gap:10px;flex:1;flex-wrap:wrap;}
      .dv-quick-btn{display:flex;align-items:center;gap:9px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:7px 12px;flex:1;min-width:160px;transition:.18s ease;}
      .dv-quick-btn:hover{background:rgba(255,255,255,.18);}
      .dv-quick-btn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2;flex-shrink:0;}
      .dv-quick-btn strong{display:block;font-size:12px;}
      .dv-quick-btn small{display:block;font-size:10px;opacity:.7;}
      .dv-quick-arrow{width:32px;height:32px;border-radius:50%;background:#fff;color:#5b3fd9;display:grid;place-items:center;flex-shrink:0;}
      .dv-quick-arrow svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.4;}

      @media (max-width:1100px){
        .dv-page{padding:20px clamp(16px,2.4vw,32px) 60px;}
        .dv-shell{grid-template-columns:1fr;}
        .dv-main{gap:18px;}
        .dv-sidebar{position:static;max-height:none;flex-direction:row;flex-wrap:wrap;overflow:visible;}
        .dv-user-card,.dv-help-card{display:none;}
        .dv-stats-row{grid-template-columns:repeat(3,1fr);}
        .dv-row-2{grid-template-columns:1fr;}
        .dv-card{padding:18px 20px;}
        .dv-chart-body{height:220px;}
      }
      @media (max-width:640px){
        .dv-stats-row{grid-template-columns:repeat(2,1fr);}
        .dv-mini-grid{grid-template-columns:1fr;}
        .dv-kyc{flex-direction:column;align-items:flex-start;}
        .dv-kyc-actions{width:100%;}
      }
    </style>

    <div class="account-page dv-page">
      ${pixelField()}

      <div class="dv-shell">
        <!-- SIDEBAR -->
        <nav class="dv-sidebar" aria-label="Account navigation">
          ${navItem(icons.trendUp,'Overview','#',{active:true, tab:'overview'})}
          ${navItem(icons.clock,'Activity',null,{modal:'modal-recent'})}
          ${navItem(icons.briefcase,'Projects','#',{tab:'projects'})}
          
          <!-- Route these three to the new Marketplace tab -->
          ${navItem(icons.link,'Marketplace','#',{tab:'marketplace'})}
          ${navItem(icons.code,'Vault','#',{tab:'marketplace'})}
          ${navItem(icons.controller,'Services','#',{tab:'marketplace'})}
          
          <!-- Route this to the new Community tab -->
          ${navItem(icons.users,'Communities','#',{tab:'community'})}
          
          ${navItem(icons.message,'Messages','#/messages')}
          ${navItem(icons.badge,'Notifications','#/notifications')}
          ${navItem(icons.wallet,'Wallet','#/payouts')}
          ${navItem(icons.share,'Settings','#/account/edit')}

          <div class="dv-user-card">
            <div class="dv-user-row">
              <span class="dv-user-avatar">${a.avatar?`<img src="${esc(a.avatar)}" alt="">`:esc((a.name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase())}</span>
              <div>
                <p class="dv-user-name">${esc(a.name)}</p>
                <p class="dv-user-handle">${esc(a.username)}</p>
              </div>
            </div>
            <p class="dv-xp-label"><span>Creator Level</span><span>Level ${level}</span></p>
            <div class="dv-xp-track"><div class="dv-xp-fill" style="width:${Math.round((xpIntoLevel/xpForLevel)*100)}%"></div></div>
            <p class="dv-xp-text">${xpIntoLevel} / ${xpForLevel} XP</p>
          </div>
          <a class="dv-help-card" href="#/support-tickets">
            ${icons.message}
            <span><b>Need Help?</b><small>Visit our support center</small></span>
          </a>
        </nav>

        <!-- MAIN -->
        <div class="dv-main">

          <!-- 1. OVERVIEW TAB -->
          <div id="tab-overview" class="dv-tab-content">
            
            <!-- KYC Box (Top) -->
            <div class="dv-kyc">
              <div class="dv-kyc-left">
                <span class="dv-kyc-icon">${icons.shield}</span>
                <div>
                  <p class="dv-kyc-title">Action Required: Complete Your KYC</p>
                  <p class="dv-kyc-sub">${kycDone}/${required.length} documents uploaded. Complete verification to unlock all features.</p>
                </div>
              </div>
              <div class="dv-kyc-actions">
                <a class="dv-kyc-upload" href="#/account/kyc">Upload Documents</a>
                <a class="dv-kyc-learn" href="#/account/kyc">Learn more \u2192</a>
                <button class="dv-kyc-close" type="button" data-dismiss-kyc aria-label="Dismiss"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
              </div>
            </div>

            <!-- Quick Actions (Moved directly under KYC) -->
            <div class="dv-quickbar">
              <span class="dv-quickbar-label">${icons.sparkle} Quick Actions</span>
              <div class="dv-quick-actions">
                <button class="dv-quick-btn" type="button" data-start-project>${icons.rocket}<span><strong>Create Project</strong><small>Start a new campaign</small></span></button>
                <a class="dv-quick-btn" href="#/projects">${icons.controller}<span><strong>Explore Games</strong><small>Discover amazing games</small></span></a>
                <a class="dv-quick-btn" href="#/explore">${icons.users}<span><strong>Find Creators</strong><small>Connect &amp; collaborate</small></span></a>
                <a class="dv-quick-btn" href="#/freelancers">${icons.briefcase}<span><strong>Browse Services</strong><small>Find expert help</small></span></a>
              </div>
              <span class="dv-quick-arrow"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </div>

            <!-- Stat Cards -->
            <div class="dv-stats-row">
              ${statCards.map((s,i)=>`
                <div class="dv-stat-card">
                  <div class="dv-stat-top"><span class="dv-stat-icon ${s.tint}">${s.icon}</span></div>
                  <p class="dv-stat-label">${s.label}</p>
                  <p class="dv-stat-value">${s.value}</p>
                  <p class="dv-stat-trend">${s.trend}</p>
                  ${sparkline(chartData,{purple:'#7d3df7',green:'#0aa06e',orange:'#ff8a3d',blue:'#3971f6',lavender:'#8a4bf0'}[s.tint],i)}
                </div>
              `).join('')}
            </div>

            <!-- Your Ecosystem & Account Security (Moved above Platform Activity) -->
            <div class="dv-row-2" style="grid-template-columns:1fr 1fr;">
              <article class="dv-card">
                <div class="dv-card-head">
                  <div><p class="dv-card-title">Your Ecosystem</p><p class="dv-card-sub">Manage your content, assets and account</p></div>
                </div>
                <div class="dv-mini-grid">
                  <div class="dv-mini-tile" data-open-modal="modal-assets">
                    <span class="dv-mini-icon">${icons.wallet}</span>
                    <p class="dv-mini-title">Vault</p>
                    <p class="dv-mini-sub">${assets.length} assets</p>
                    <span class="dv-mini-cta">View \u2192</span>
                  </div>
                  <div class="dv-mini-tile" data-open-modal="modal-orders">
                    <span class="dv-mini-icon">${icons.briefcase}</span>
                    <p class="dv-mini-title">Purchases</p>
                    <p class="dv-mini-sub">${orders.length} orders</p>
                    <span class="dv-mini-cta">View \u2192</span>
                  </div>
                  <div class="dv-mini-tile" data-href="#/marketplace">
                    <span class="dv-mini-icon">${icons.code}</span>
                    <p class="dv-mini-title">Services</p>
                    <p class="dv-mini-sub">${servicesActive} Active</p>
                    <span class="dv-mini-cta">View \u2192</span>
                  </div>
                  <div class="dv-mini-tile" data-href="#/community">
                    <span class="dv-mini-icon">${icons.users}</span>
                    <p class="dv-mini-title">Communities</p>
                    <p class="dv-mini-sub">${communitiesJoined} Joined</p>
                    <span class="dv-mini-cta">View \u2192</span>
                  </div>
                </div>
              </article>

              <article class="dv-card">
                <div class="dv-card-head">
                  <div><p class="dv-card-title">Account &amp; Security</p><p class="dv-card-sub">Manage your account security and preferences</p></div>
                </div>
                <div class="dv-mini-grid">
                  <div class="dv-mini-tile" data-open-modal="modal-security">
                    <span class="dv-mini-icon">${icons.shield}</span>
                    <p class="dv-mini-title">Account Protection</p>
                    <p class="dv-mini-sub">${protectedCount}/${Object.keys(protection).length} Active</p>
                    <span class="dv-mini-cta">Manage \u2192</span>
                  </div>
                  <div class="dv-mini-tile" data-switch-account>
                    <span class="dv-mini-icon">${icons.users}</span>
                    <p class="dv-mini-title">Switch Account</p>
                    <p class="dv-mini-sub">Change User</p>
                    <span class="dv-mini-cta">Switch \u2192</span>
                  </div>
                  <div class="dv-mini-tile" style="cursor:default;">
                    <span class="dv-mini-icon">${icons.clock}</span>
                    <p class="dv-mini-title">Last Active</p>
                    <p class="dv-mini-sub">Today</p>
                    <span class="dv-mini-cta">Details \u2192</span>
                  </div>
                  <div class="dv-mini-tile" style="cursor:default;">
                    <span class="dv-mini-icon">${icons.award}</span>
                    <p class="dv-mini-title">Member Since</p>
                    <p class="dv-mini-sub">${esc(a.joined)}</p>
                    <span class="dv-mini-cta">Details \u2192</span>
                  </div>
                </div>
              </article>
            </div>

            <!-- Platform Activity & Recent Activity (Moved to bottom) -->
            <div class="dv-row-2">
              <article class="dv-card">
                <div class="dv-card-head">
                  <div>
                    <p class="dv-card-title">Platform Activity</p>
                    <p class="dv-card-sub">Track your growth across the platform</p>
                  </div>
                  <select class="dv-select" data-toast="Range switching is a prototype control">
                    <option>Last 6 Months</option>
                    <option>Last 12 Months</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div class="dv-chart-legend">
                  <span><i style="background:#8b5cf6"></i> Contributions</span>
                  <span><i style="background:#0aa06e"></i> Earnings</span>
                  <span><i style="background:#f6b51f"></i> Profile Views</span>
                </div>
                <div class="dv-chart-body">
                  <svg viewBox="0 0 700 230" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="yellowArea" x1="0" y1="0" x2="0" y2="1">
                        <stop stop-color="#f6b51f" stop-opacity="0.28"/>
                        <stop offset="1" stop-color="#f6b51f" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M50 30 h 620 M50 90 h 620 M50 150 h 620 M50 200 h 620" stroke="#eceef4" stroke-width="1.5" fill="none"/>
                    <text x="42" y="34" text-anchor="end" font-size="11" font-weight="700" fill="#9a99a6">\u20B915K</text>
                    <text x="42" y="94" text-anchor="end" font-size="11" font-weight="700" fill="#9a99a6">\u20B910K</text>
                    <text x="42" y="154" text-anchor="end" font-size="11" font-weight="700" fill="#9a99a6">\u20B95K</text>
                    <text x="42" y="204" text-anchor="end" font-size="11" font-weight="700" fill="#9a99a6">0</text>
                    <text x="100" y="222" text-anchor="middle" font-size="11" font-weight="800" fill="#8f8e9b">MAR</text>
                    <text x="210" y="222" text-anchor="middle" font-size="11" font-weight="800" fill="#8f8e9b">APR</text>
                    <text x="320" y="222" text-anchor="middle" font-size="11" font-weight="800" fill="#8f8e9b">MAY</text>
                    <text x="430" y="222" text-anchor="middle" font-size="11" font-weight="800" fill="#8f8e9b">JUN</text>
                    <text x="540" y="222" text-anchor="middle" font-size="11" font-weight="800" fill="#8f8e9b">JUL</text>
                    <text x="650" y="222" text-anchor="middle" font-size="11" font-weight="800" fill="#8f8e9b">AUG</text>
                    <path d="M 50 170 C 150 155, 250 180, 350 115 S 540 80, 650 55 L 650 200 L 50 200 Z" fill="url(#yellowArea)"/>
                    <path d="M 50 170 C 150 155, 250 180, 350 115 S 540 80, 650 55" fill="none" stroke="#f6b51f" stroke-width="2.2" stroke-dasharray="6 6"/>
                    <path d="M 50 185 C 150 178, 200 118, 350 135 S 540 110, 650 75" fill="none" stroke="#0aa06e" stroke-width="3"/>
                    <path d="M 50 135 C 150 108, 250 92, 350 96 S 540 55, 650 35" fill="none" stroke="#8b5cf6" stroke-width="4"/>
                    <circle cx="150" cy="120" r="5.5" fill="#fff" stroke="#8b5cf6" stroke-width="3"/>
                    <circle cx="320" cy="96" r="5.5" fill="#fff" stroke="#8b5cf6" stroke-width="3"/>
                    <circle cx="540" cy="57" r="5.5" fill="#fff" stroke="#8b5cf6" stroke-width="3"/>
                    <circle cx="650" cy="35" r="5.5" fill="#fff" stroke="#8b5cf6" stroke-width="3"/>
                  </svg>
                </div>
              </article>

              <article class="dv-card">
                <div class="dv-card-head">
                  <p class="dv-card-title">Recent Activity</p>
                  <a class="dv-card-link" data-open-modal="modal-recent">View All \u2192</a>
                </div>
                <div class="dv-activity-list">
                  ${activity.slice(0,5).map((x,i)=>`
                    <div class="dv-activity-row">
                      <span class="dv-activity-icon">${activityIcons[i%activityIcons.length]}</span>
                      <div><p class="dv-activity-title">${esc(x.title)}</p><p class="dv-activity-meta">${esc(x.meta)}</p></div>
                    </div>
                  `).join('')}
                </div>
              </article>
            </div>

          </div> <!-- END OVERVIEW TAB -->


          <!-- 2. PROJECTS TAB (Hidden by default) -->
          <div id="tab-projects" class="dv-tab-content" hidden>
            <article class="dv-card" style="margin-bottom: 14px;">
              <div class="dv-card-head">
                <div><p class="dv-card-title">My Projects</p><p class="dv-card-sub">Campaigns you have invested in or uploaded</p></div>
              </div>

              <p class="eyebrow" style="margin-top:10px;">Backed & Invested Projects</p>
              <div class="funding-list" style="margin-bottom: 24px;">
                ${funding.map(x=>`
                  <div class="funding-row" style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--line);">
                    <span>${esc(x.month)}</span>
                    <div style="flex:1;"><strong>${esc(x.label)}</strong><small>Backed project funding</small></div>
                    <b>\u20B9${fmt(x.amount)}</b>
                  </div>
                `).join('')}
              </div>

              <p class="eyebrow" style="border-top:1px solid var(--line); padding-top:16px;">Uploaded Projects</p>
              <div class="account-table-list">
                ${a.projectsCreated > 0 
                  ? `<div class="account-table-row"><div><strong>Your Active Campaign</strong><small>Currently live and receiving funding</small></div><span class="status-pill completed">Active</span></div>` 
                  : `<p class="muted" style="font-size:12px; margin-top:10px;">You haven't uploaded or launched any projects yet.</p>`
                }
              </div>
            </article>
          </div> <!-- END PROJECTS TAB -->
          <!-- 3. MARKETPLACE TAB (Hidden by default) -->
          <div id="tab-marketplace" class="dv-tab-content" hidden>
            <article class="dv-card" style="margin-bottom: 14px;">
              <div class="dv-card-head">
                <div><p class="dv-card-title">Marketplace & Vault</p><p class="dv-card-sub">Manage your purchased assets and active listings</p></div>
              </div>

              <p class="eyebrow" style="margin-top:10px;">Purchased Assets (Vault)</p>
              <div class="asset-manage-list" style="margin-bottom: 24px;">
                ${assets.map(x=>`
                  <div class="asset-manage-row" style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--line); display:flex; align-items:center;">
                    <div style="flex:1;"><strong>${esc(x.name)}</strong><small>${esc(x.creator)} \u00B7 ${esc(x.type)}</small></div>
                    <span style="margin-right:12px;" class="status-pill completed">${esc(x.status)}</span>
                    <button class="btn btn-ghost" style="min-height:30px; padding:0 12px; font-size:11px;">Download</button>
                  </div>
                `).join('')}
              </div>

              <p class="eyebrow" style="border-top:1px solid var(--line); padding-top:16px;">Active Listings (Selling)</p>
              <div class="account-table-list">
                 <div class="account-table-row" style="padding-bottom:12px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between;">
                   <div style="flex:1;"><strong>3D Character Rigging</strong><small>Service \u00B7 Starting at \u20B92,200</small></div>
                   <div style="display:flex; align-items:center; gap:12px;">
                     <span class="status-pill completed">Active</span>
                     <button class="btn btn-ghost" style="min-height:30px; padding:0 12px; font-size:11px;">Edit Listing</button>
                   </div>
                 </div>
              </div>
            </article>
          </div> <!-- END MARKETPLACE TAB -->


          <!-- 4. COMMUNITY TAB (Hidden by default) -->
          <div id="tab-community" class="dv-tab-content" hidden>
            <article class="dv-card" style="margin-bottom: 14px;">
              <div class="dv-card-head">
                <div><p class="dv-card-title">Community & Friends</p><p class="dv-card-sub">Manage your network, friends, and community interactions</p></div>
              </div>

              <p class="eyebrow" style="margin-top:10px;">Friends & Connections</p>
              <div class="asset-manage-list" style="margin-bottom: 24px;">
                ${['Vikram Rao', 'Meera Nair'].map((name, i)=>`
                  <div class="asset-manage-row" style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--line); display:flex; align-items:center;">
                    <span class="dv-user-avatar" style="width:34px; height:34px; margin-right:10px; font-size:12px; background:#efe6ff; color:#7d3df7;">${name.charAt(0)}</span>
                    <div style="flex:1;"><strong>${name}</strong><small>${i===0 ? '3D Artist' : 'Illustrator'} \u00B7 Online</small></div>
                    <div style="display:flex; gap:6px;">
                      <a href="#/creator/${i===0 ? 'vikram-rao' : 'meera-nair'}" class="btn btn-ghost" style="min-height:28px; padding:0 10px; font-size:10px; text-decoration:none;">Profile</a>
                      <button class="btn btn-ghost" style="min-height:28px; padding:0 10px; font-size:10px; color:#9a4e5c;" data-toast="User restricted">Restrict</button>
                      <button class="btn btn-ghost" style="min-height:28px; padding:0 10px; font-size:10px; color:var(--danger); border-color:rgba(229,76,104,.3);" data-toast="User blocked">Block</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <p class="eyebrow" style="border-top:1px solid var(--line); padding-top:16px;">Top Comments & Interactions</p>
              <div class="account-table-list">
                 <div class="account-table-row" style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--line); display:flex; align-items:center;">
                   <div style="flex:1;"><strong>"The lighting pass on this looks incredible! \uD83D\uDE0D"</strong><small>Commented on <i>Aether Devlog #14</i></small></div>
                   <div style="display:flex; align-items:center; gap:6px; font-size:12px; font-weight:800; color:var(--ink);"><span style="color:#e54c68; font-size:14px;">\u2764\uFE0F</span> 42 Likes</div>
                 </div>
                 <div class="account-table-row" style="display:flex; align-items:center;">
                   <div style="flex:1;"><strong>"Squashed the netcode desync bug finally."</strong><small>Posted in <i>The Code Cave</i></small></div>
                   <div style="display:flex; align-items:center; gap:6px; font-size:12px; font-weight:800; color:var(--ink);"><span style="color:#f6b51f; font-size:14px;">\uD83D\uDD25</span> 21 Reactions</div>
                 </div>
              </div>
            </article>
          </div> <!-- END COMMUNITY TAB -->

        </div>
      </div>

      <!-- MODALS -->
      ${mkModal('modal-recent', 'Recently viewed', 'PERSONAL ACTIVITY', `
        <div class="recent-viewed-list">
          ${[
            ['Aether \u2014 A Hand-Drawn 2D Adventure','Project \u00B7 Indie Games','Viewed 18 min ago','#/project/aether'],
            ['Pixel Forest Pack','Asset \u00B7 Marketplace','Viewed yesterday','#/asset/pixel-forest'],
            ['Rohan Mehta','Creator \u00B7 Music Producer','Viewed 2 days ago','#/creator/rohan-mehta'],
            ['Project Monsoon','Campaign \u00B7 Action Adventure','Viewed 4 days ago','#/project/iron-monsoon']
          ].map(x=>`<a class="recent-viewed-row" href="${x[3]}"><span class="recent-thumb">${icons.sparkle}</span><span><strong>${esc(x[0])}</strong><small>${esc(x[1])} \u00B7 ${esc(x[2])}</small></span><b style="color:#7650ef;">\u2192</b></a>`).join('')}
        </div>
      `)}

      ${mkModal('modal-orders', 'Order history', 'PURCHASES', `
        <div class="account-table-list">
          ${orders.map(o=>`<div class="account-table-row" style="margin-bottom:12px;"><div><strong>${esc(o.item)}</strong><small>${esc(o.id)} \u00B7 ${esc(o.type)} \u00B7 ${esc(o.date)}</small></div><span class="status-pill ${o.status.toLowerCase().replace(/\s+/g,'-')}">${esc(o.status)}</span><b style="margin-left:12px;">${esc(o.amount)}</b></div>`).join('')}
        </div>
      `)}

      ${mkModal('modal-assets', 'Asset management', 'LIBRARY', `
        <div class="asset-manage-list">
          ${assets.map(x=>`<div class="asset-manage-row" style="margin-bottom:12px;"><div><strong>${esc(x.name)}</strong><small>${esc(x.creator)} \u00B7 ${esc(x.type)}</small></div><span style="margin-right:12px;">${esc(x.status)}</span><a class="btn btn-ghost" href="#/asset-manager">Manage</a></div>`).join('')}
        </div>
      `)}

      ${mkModal('modal-funding', 'Funding history', 'CONTRIBUTIONS', `
        <div class="funding-list">
          ${funding.map(x=>`<div class="funding-row" style="margin-bottom:12px;"><span>${esc(x.month)}</span><div style="flex:1;"><strong>${esc(x.label)}</strong><small>Backed project funding</small></div><b>\u20B9${fmt(x.amount)}</b></div>`).join('')}
        </div>
      `)}

      ${mkModal('modal-wallet', 'Withdraw funds', 'CREATOR WALLET', `
        <div class="withdraw-top"><div><h2>Balance: \u20B9${fmt(a.withdrawable||0)}</h2><p>Available to withdraw after completed creator transactions.</p></div></div>
        <div class="withdraw-actions" style="margin-top:16px; margin-bottom:24px;"><a class="btn btn-primary" href="#/withdraw">Withdraw funds</a><a class="btn btn-secondary" href="#/payouts">Manage payout method</a></div>
        <p class="eyebrow" style="border-top:1px solid var(--line); padding-top:16px;">Withdrawal History</p>
        <div class="withdraw-history">
          ${withdrawals.map(x=>`<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);"><span>${esc(x.date)} \u00B7 ${esc(x.method)}</span><div style="text-align:right;"><b>${esc(x.amount)}</b><br><small style="color:#168a62; font-weight:bold;">${esc(x.status)}</small></div></div>`).join('')}
        </div>
      `)}

      ${mkModal('modal-security', 'Account protection', 'SECURITY', `
        <div class="protection-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          ${[['email','Email verified'],['phone','Phone verified'],['twoFactor','Two-factor auth'],['identity','Identity verified'],['loginAlerts','Login alerts']].map(x=>`<div class="protection-item ${protection[x[0]]?'ok':'warn'}" style="padding:16px; border-radius:16px; background:rgba(255,255,255,0.6); border:1px solid rgba(0,0,0,0.05);"><span>${protection[x[0]]?'\u2713':'!'}</span><strong>${x[1]}</strong><small>${protection[x[0]]?'Protected':'Action recommended'}</small></div>`).join('')}
        </div>
        <a class="btn btn-secondary" style="margin-top:16px; width:100%; text-align:center;" href="#/account/kyc">Review security settings \u2192</a>
      `)}

    </div>`;
  }

  function loginView(mode='login'){
    const signup=mode==='signup';
    return `<div class="auth-page"><div class="auth-card bento-card">
      <a class="auth-brand" href="#/"><span class="brand-mark brand-mark-nexora">${NEXORA_MARK}</span><span>NEXORA</span></a>
      <p class="eyebrow">${signup?'Join Nexora':'Welcome back'}</p>
      <h1>${signup?'Create your account.':'Sign in to Nexora.'}</h1>
      <p class="auth-desc">${signup?'Build, fund and collaborate with India\u2019s game-development community.':'Access your credits, backed projects, donations and creator stats.'}</p>
      <div class="auth-socials">
        <button class="auth-provider" type="button" data-oauth="google"><b class="provider-google">G</b> Continue with Google</button>
      </div>
      <div class="auth-divider"><span>or use email</span></div>
      <form class="auth-form" id="authForm">
        ${signup?`<label>Username<input name="username" required placeholder="@yourusername"></label>`:''}
        ${signup?`<label>Display name<input name="name" required placeholder="Your name"></label>`:''}
        <label>Gmail / email<input name="email" type="email" required placeholder="you@gmail.com"></label>
        <label>Password<input name="password" type="password" required minlength="6" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"></label>
        ${!signup?`<div class="auth-row"><label class="auth-check"><input type="checkbox"> Remember me</label><a href="#/forgot-password">Forgot password?</a></div>`:''}
        <button class="btn btn-primary auth-submit" type="submit">${signup?'Create account':'Login'} <span>\u2192</span></button>
      </form>
      <p class="auth-switch">${signup?'Already have an account?':'New to Nexora?'} <a href="#/${signup?'login':'signup'}">${signup?'Sign in':'Create account'}</a></p>
      <p class="auth-note">Google is OAuth-ready UI. Email/password accounts are stored locally in this prototype until a real auth backend is connected.</p>
    </div></div>`;
  }

  function editAccountView(){
    const a=currentAccount();
    if(!a) return loginView();
    return `<div class="page-shell account-edit-page"><section class="bento-card edit-card"><p class="eyebrow">Profile settings</p><h1>Edit profile</h1><form id="editAccountForm" class="auth-form">
      <label>Display name<input name="name" required value="${esc(a.name)}"></label>
      <label>Username<input name="username" required value="${esc(a.username)}"></label>
      <label>Email<input name="email" type="email" required value="${esc(a.email)}"></label>
      <label>Bio<textarea name="bio" rows="4">${esc(a.bio)}</textarea></label>
      <div class="account-edit-actions"><a class="btn btn-secondary" href="#/account">Cancel</a><button class="btn btn-primary">Save changes</button></div>
    </form></section></div>`;
  }

  function bindAccountUI(){
    $$('[data-open-modal]').forEach(b=>b.onclick=()=>openModal(b.dataset.openModal));
    $$('[data-dismiss-kyc]').forEach(b=>b.onclick=()=>{b.closest('.dv-kyc')?.remove();});
    $$('.dv-mini-tile[data-href]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.href;});
    $$('[data-signout]').forEach(b=>b.onclick=()=>{clearSession();showToast('Signed out');location.hash='#/login';});
    $$('[data-switch-account]').forEach(b=>b.onclick=()=>{
      const accounts=Object.values(loadAccounts());
      const current=currentAccount();
      const next=accounts.find(x=>x.id!==current?.id);
      if(next){setSession(next.id);showToast(`Switched to ${next.name}`);renderRoute();}
      else showToast('No other saved account. Create another account first.');
    });
    // --- IN-PAGE TAB SWITCHING LOGIC ---
    $$('[data-acc-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 1. Highlight the correct sidebar link
        $$('[data-acc-tab]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 2. Hide all tab content sections on the right
        $$('.dv-tab-content').forEach(tc => tc.hidden = true);

        // 3. Show the target content section based on what was clicked
        const targetId = `tab-${btn.dataset.accTab}`;
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.hidden = false;
      });
    });
    $$('[data-oauth]').forEach(b=>b.onclick=()=>{
      const provider=b.dataset.oauth;
      if(provider!=='google'){showToast('Only Google sign-in is enabled.');return;}
      const accounts=loadAccounts();
      const id='google-demo';
      if(!accounts[id]) accounts[id]={...defaultAccount,id,name:'Google Creator',username:'@googlecreator',email:'google@demo.dev',provider:'google',avatar:'',credits:1200,projectsBacked:6,donated:12500,projectsCreated:1,followers:340,following:91,popularity:71,joined:'August 2026',
        joinedDate:'August 10, 2026',lastActive:'Today, 8:42 PM',bio:'Signed in with Google.',chart:[42,48,51,57,55,62,66,71],activity:defaultAccount.activity.slice(0,3),backed:defaultAccount.backed.slice(0,2)};
      saveAccounts(accounts);setSession(id);showToast('Google sign-in prototype');location.hash='#/account';
    });
    $('#authForm')?.addEventListener('submit',e=>{
      e.preventDefault();
      const data=new FormData(e.target), signup=location.hash.startsWith('#/signup');
      const accounts=loadAccounts();
      const email=String(data.get('email')).trim().toLowerCase();
      let account=Object.values(accounts).find(x=>x.email===email);
      if(signup){
        if(account){showToast('An account with that email already exists.');return;}
        const name=String(data.get('name')).trim(), username=String(data.get('username')).trim()||'@creator';
        const id='email-'+Date.now();
        account={...defaultAccount,id,name,username,email,provider:'email',credits:500,projectsBacked:0,donated:0,projectsCreated:0,followers:0,following:0,popularity:25,activity:[],backed:[],fundingHistory:[],orderHistory:[],assets:[],withdrawals:[],withdrawable:0,protection:{email:true,phone:false,twoFactor:false,identity:false,loginAlerts:true}};
        accounts[id]=account;saveAccounts(accounts);setSession(id);showToast('Account created');location.hash='#/account';
      } else {
        if(!account){showToast('No account found. Create an account first.');return;}
        setSession(account.id);showToast('Logged in');location.hash='#/account';
      }
    });
    $('#editAccountForm')?.addEventListener('submit',e=>{
      e.preventDefault();
      const a=currentAccount(); if(!a)return;
      const d=new FormData(e.target), accounts=loadAccounts();
      a.name=String(d.get('name')).trim(); a.username=String(d.get('username')).trim(); a.email=String(d.get('email')).trim().toLowerCase(); a.bio=String(d.get('bio')).trim();
      accounts[a.id]=a;saveAccounts(accounts);updateAccountNav();showToast('Profile updated');location.hash='#/account';
    });
  }


    $$('[data-kyc-file]').forEach(input=>{
      input.addEventListener('change',()=>{
        const file=input.files?.[0];
        if(!file) return;
        const max=10*1024*1024;
        if(file.size>max){showToast('Please choose a file under 10 MB.');input.value='';return;}
        const id=input.dataset.kycFile;
        const data=loadKyc();
        data[id]={name:file.name,size:file.size,type:file.type,selectedAt:new Date().toISOString()};
        saveKyc(data);
        showToast(`${file.name} selected for KYC.`);
        renderRoute();
      });
    });

  function bindImageFallbacks(root=app){
    $$('img',root).forEach(img=>{
      const mark=()=>{
        img.dataset.failed='true';
        img.closest('.media-fallback,.service-main-image,.project-hero-image,.hero-feature')?.classList.add('image-missing');
      };
      if(img.complete && img.naturalWidth===0) mark();
      else img.addEventListener('error',mark,{once:true});
    });
  }

  function wireEnhancedCardNavigation(root=app){
    $$('[data-service]',root).forEach(card=>{
      if(card.dataset.enhancedBound)return;
      card.dataset.enhancedBound='1';
      card.addEventListener('click',e=>{
        if(e.target.closest('button,a,input,select,label'))return;
        location.hash=`#/service/${card.dataset.service}`;
      });
    });
    $$('[data-project]',root).forEach(card=>{
      if(card.dataset.enhancedBound)return;
      card.dataset.enhancedBound='1';
      card.addEventListener('click',e=>{
        if(e.target.closest('button,a,input,select,label'))return;
        location.hash=`#/project/${card.dataset.project}`;
      });
    });
  }

  function bindEnhancedUI(){
    bindImageFallbacks();
    wireEnhancedCardNavigation();

    $$('[data-project-tab]').forEach(btn=>btn.addEventListener('click',()=>{
      const tab=btn.dataset.projectTab;
      $$('[data-project-tab]').forEach(x=>x.classList.toggle('active',x===btn));
      $$('[data-project-panel]').forEach(panel=>panel.hidden=panel.dataset.projectPanel!==tab);
    }));

    const discoverInput=$('#discoverSearch');
    if(discoverInput){
      const sendDiscoverQuery=()=>{
        const query=discoverInput.value.trim();
        openSearch();
        const globalInput=$('#globalSearchInput');
        if(globalInput){globalInput.value=query;renderSearchResults(query);}
      };
      discoverInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();sendDiscoverQuery();}});
      discoverInput.closest('.discover-search')?.querySelector('button')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();sendDiscoverQuery();});
    }

    function filterEcosystem(query){
      const q=String(query||'').trim().toLowerCase();
      let count=0;
      $$('[data-ecosystem-item]').forEach(card=>{
        const visible=!q||(card.dataset.ecosystemSearch||'').includes(q);
        card.hidden=!visible;
        if(visible)count++;
      });
      const counter=$('#ecosystemCount');
      if(counter)counter.textContent=`${count} ${count===1?'result':'results'}`;
      return count;
    }
    $('#ecosystemSearch')?.addEventListener('input',e=>filterEcosystem(e.target.value));
    $$('[data-ecosystem-filter]').forEach((btn,index)=>btn.addEventListener('click',()=>{
      $$('[data-ecosystem-filter]').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      if(index===0){if($('#ecosystemSearch'))$('#ecosystemSearch').value='';filterEcosystem('');return;}
      const words=btn.dataset.ecosystemFilter.toLowerCase().split(/\s+/).filter(x=>x.length>3&&!['this','with','most','under','online'].includes(x));
      let matched=0;
      for(const word of words){matched=filterEcosystem(word);if(matched){if($('#ecosystemSearch'))$('#ecosystemSearch').value=word;break;}}
      if(!matched){filterEcosystem('');if($('#ecosystemSearch'))$('#ecosystemSearch').value='';showToast(`${btn.dataset.ecosystemFilter} filter is ready for production data`);}
    }));

    $$('[data-period]').forEach(btn=>btn.addEventListener('click',()=>{
      $$('[data-period]').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Momentum ranking changed to ${btn.textContent.trim().toLowerCase()}`);
    }));

    const goalRange=$('#goalRange');
    if(goalRange)goalRange.addEventListener('input',()=>{
      const goal=Number(goalRange.value);
      $('#goalValue').textContent=`\u20B9${fmt(goal)}`;
      $('#backerEstimate').textContent=fmt(Math.ceil(goal/1499));
    });

    $$('[data-update-filter]').forEach(btn=>btn.addEventListener('click',()=>{
      $$('[data-update-filter]').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      const kind=btn.dataset.updateFilter;
      let count=0;
      $$('[data-update-kind]').forEach(card=>{
        const visible=kind==='all'||card.dataset.updateKind===kind;
        card.hidden=!visible;
        if(visible)count++;
      });
      const counter=$('#updatesVisibleCount');
      if(counter)counter.textContent=`${count} ${count===1?'story':'stories'}`;
    }));

    function applyServiceFilters(){
      const filter=$('.service-filter.active')?.dataset.serviceFilter||'All';
      const query=($('#freelanceSearch')?.value||'').trim().toLowerCase();
      let count=0;
      $$('#freelanceGrid .enhanced-service-card').forEach(card=>{
        const category=card.dataset.serviceCategory||'';
        const visible=(filter==='All'||category===filter)&&(query===''||(card.dataset.serviceSearch||'').includes(query));
        card.hidden=!visible;
        if(visible)count++;
      });
      const label=$('#serviceResultCount');
      if(label)label.textContent=`${count} ${count===1?'gig':'gigs'}`;
    }

    $$('[data-service-filter]').forEach(btn=>btn.addEventListener('click',()=>{
      $$('[data-service-filter]').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      applyServiceFilters();
    }));
    $('#freelanceSearch')?.addEventListener('input',applyServiceFilters);
    $$('.popular-searches [data-service-query]').forEach(btn=>btn.addEventListener('click',()=>{
      const input=$('#freelanceSearch');
      if(input){input.value=btn.dataset.serviceQuery;applyServiceFilters();}
    }));

    function renderMarketResults(){
      let list=marketplaceCatalog.slice();
      const categoryNeedle=marketCategoryMap[marketFilterState.category]||'';
      if(categoryNeedle)list=list.filter(a=>(a.category+' '+a.formats).toLowerCase().includes(categoryNeedle.toLowerCase()));
      if(marketFilterState.query)list=list.filter(a=>(a.title+' '+a.creator+' '+a.category+' '+a.engine+' '+a.formats).toLowerCase().includes(marketFilterState.query));
      const engine=document.querySelector('input[name="market-engine"]:checked')?.value||'All';
      if(engine!=='All')list=list.filter(a=>a.engine.toLowerCase().includes(engine.toLowerCase()));
      if(marketFilterState.sort==='rating')list.sort((a,b)=>Number(b.rating)-Number(a.rating));
      else if(marketFilterState.sort==='low')list.sort((a,b)=>a.price-b.price);
      else if(marketFilterState.sort==='high')list.sort((a,b)=>b.price-a.price);
      else if(marketFilterState.sort==='new')list.reverse();
      else list.sort((a,b)=>(b.sales||b.reviews*6)-(a.sales||a.reviews*6));
      const grid=$('#marketDeepGrid');
      if(grid)grid.innerHTML=list.length?list.map(deepAssetCard).join(''):`<div class="market-empty bento-card"><span>\u2315</span><h3>No exact asset match</h3><p>Try a broader category, engine or keyword.</p><button class="btn btn-secondary" data-market-reset>Reset filters</button></div>`;
      const counter=$('#marketResultCount');
      if(counter)counter.textContent=`${list.length} ${list.length===1?'asset':'assets'}`;
      bindImageFallbacks(grid||app);
      bindAssetPreviewCycles(grid||app);
      $$('[data-market-id]',grid||app).forEach(card=>{
        card.addEventListener('click',e=>{
          if(e.target.closest('button,a,input,select,label,video'))return;
          location.hash=`#/asset/${card.dataset.marketId}`;
        });
      });
      $$('[data-cart-add]',grid||app).forEach(btn=>{
        btn.addEventListener('click',e=>{
          e.preventDefault();e.stopPropagation();window.NexoraWorkflowPages?.addCart(btn.dataset.cartAdd);showToast('Added to cart');
        });
      });
      $$('[data-wishlist-add]',grid||app).forEach(btn=>{
        btn.addEventListener('click',e=>{
          e.preventDefault();e.stopPropagation();window.NexoraWorkflowPages?.addWishlist(btn.dataset.wishlistAdd);showToast('Asset added to wishlist');
        });
      });
      $$('[data-toast]',grid||app).forEach(el=>{
        if(el.dataset.toastBound)return;
        el.dataset.toastBound='1';
        el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();showToast(el.dataset.toast);});
      });
      $('#marketDeepGrid [data-market-reset]')?.addEventListener('click',resetMarket);
    }
    function resetMarket(){
      marketFilterState={category:'All',query:'',sort:'popular'};
      $$('.market-filter').forEach((x,i)=>x.classList.toggle('active',i===0));
      const search=$('#marketSearch');if(search)search.value='';
      const any=document.querySelector('input[name="market-engine"][value="All"]');if(any)any.checked=true;
      const sort=$('#marketSort');if(sort)sort.value='popular';
      renderMarketResults();
    }
    $$('[data-market-filter]').forEach(btn=>btn.addEventListener('click',()=>{
      $$('[data-market-filter]').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      marketFilterState.category=btn.dataset.marketFilter;
      renderMarketResults();
    }));
    $('#marketSearch')?.addEventListener('input',e=>{marketFilterState.query=e.target.value.trim().toLowerCase();renderMarketResults();});
    $('#marketSort')?.addEventListener('change',e=>{marketFilterState.sort=e.target.value;renderMarketResults();});
    $$('input[name="market-engine"]').forEach(x=>x.addEventListener('change',renderMarketResults));
    $$('[data-market-reset]').forEach(x=>x.addEventListener('click',resetMarket));

    let selectedBase=Number($('.gig-package-tabs button.active')?.dataset.packagePrice||0);
    function updateGigTotal(){
      let total=selectedBase;
      $$('[data-gig-extra]:checked').forEach(x=>total+=Number(x.dataset.extraPrice||0));
      const out=$('#gigOrderTotal');if(out)out.textContent=`\u20B9${fmt(total)}`;
    }
    function selectPackage(key){
      const service=services.find(x=>x.key===parseRoute().parts[1])||services[0];
      const pack=servicePackages(service).find(x=>x.key===key)||servicePackages(service)[0];
      selectedBase=pack.price;
      $$('[data-package]').forEach(x=>{
        x.classList.toggle('active',x.dataset.package===key);
        x.classList.toggle('selected',x.dataset.package===key);
      });
      if($('#selectedPackageName'))$('#selectedPackageName').textContent=`${pack.name} package`;
      if($('#selectedPackagePrice'))$('#selectedPackagePrice').textContent=`\u20B9${fmt(pack.price)}`;
      if($('#selectedPackageDesc'))$('#selectedPackageDesc').textContent=pack.desc;
      if($('#selectedPackageItems'))$('#selectedPackageItems').innerHTML=pack.items.map(i=>`<li>\u2713 ${escapeHtml(i)}</li>`).join('');
      if($('#selectedPackageDays'))$('#selectedPackageDays').textContent=`\u25F7 ${pack.days} days`;
      if($('#selectedPackageRevisions'))$('#selectedPackageRevisions').textContent=`\u21BB ${pack.revisions} revisions`;
      updateGigTotal();
    }
    $$('[data-package]').forEach(btn=>btn.addEventListener('click',()=>selectPackage(btn.dataset.package)));
    $$('[data-gig-extra]').forEach(input=>input.addEventListener('change',updateGigTotal));
    $('[data-place-gig-order]')?.addEventListener('click',()=>showToast('Requirements step opened \u2014 connect checkout to activate payment.'));

    $$('[data-gig-chat-open]').forEach(btn=>btn.addEventListener('click',()=>{
      const panel=$('#gigChatPanel');if(panel){
        panel.hidden=false;
        panel.classList.remove('is-opening');
        requestAnimationFrame(()=>panel.classList.add('is-opening'));
        document.body.style.overflow='hidden';
        setTimeout(()=>$('#gigChatInput')?.focus(),220);
      }
    }));
    $$('[data-gig-chat-close]').forEach(btn=>btn.addEventListener('click',()=>{
      const panel=$('#gigChatPanel');if(panel)panel.hidden=true;document.body.style.overflow='';
    }));
    $('#gigChatPanel')?.addEventListener('click',e=>{
      if(e.target.id==='gigChatPanel'){e.currentTarget.hidden=true;document.body.style.overflow='';}
    });
    $('#gigChatForm')?.addEventListener('submit',e=>{
      e.preventDefault();
      const input=$('#gigChatInput');const text=input?.value.trim();
      if(!text)return;
      const msg=document.createElement('p');msg.className='mine';msg.textContent=text;
      $('#gigChatMessages')?.appendChild(msg);input.value='';
      showToast('Message added to this demo conversation');
    });
  }
  

  
  const infoPages = {
    'about': ['About Nexora','A creator-first platform for discovering projects, funding ideas and hiring game-development talent across India.','Company'],
    'careers': ['Careers','Build the tools that help independent creators turn prototypes into real projects. Open roles and hiring information will live here.','Company'],
    'press': ['Press','Nexora press resources, company announcements, product milestones and approved media information.','Company'],
    'blog': ['Nexora Blog','Practical writing on game development, creator funding, production, freelancing and building sustainable creative businesses.','Resources'],
    'contact': ['Contact Support','Need help with an account, project, order or report? Use the support channels shown here. Never share passwords, OTPs or one-time codes.','Support'],
    'creator-handbook': ['Creator Handbook','A practical guide to building a strong profile, presenting work, communicating with clients and delivering projects professionally.','Creators'],
    'funding-guide': ['Funding Guide','Understand project pages, reward-based support, milestones, risk disclosure and what backers should review before supporting a campaign.','Creators'],
    'pricing-fees': ['Pricing & Fees','A clear overview of creator pricing, platform fees and transaction-related charges. Final production pricing is shown before confirmation.','Creators'],
    'creator-stories': ['Creator Stories','Profiles and case studies highlighting how creators build audiences, ship work and find collaborators through Nexora.','Creators'],
    'trust-safety': ['Trust & Safety Center','Safety resources for creators and backers, including verification, reporting, disputes and community standards.','Trust & Safety'],
    'verification-process': ['Verification Process','How identity, profile and trust signals are presented so users can make better-informed decisions without treating verification as a guarantee.','Trust & Safety'],
    'report-abuse': ['Report Abuse','Report suspicious behaviour, impersonation, spam, harassment or unsafe content. Provide enough context for the moderation team to investigate.','Trust & Safety'],
    'dispute-resolution': ['Dispute Resolution','Guidance for handling order, delivery and project disputes, including the information users should keep and the steps for escalation.','Trust & Safety'],
    'community-guidelines': ['Community Guidelines','Keep Nexora useful: respect other creators, avoid spam and harassment, do not impersonate others, and never request passwords, OTPs or sensitive payment credentials.','Trust & Safety'],
    'how-it-works': ['How Nexora Works','Discover creators and projects, review the available information, choose how you want to participate, and keep communication and delivery inside clear platform workflows.','Platform'],
    'terms': ['Terms of Service','The terms governing use of the Nexora prototype and its platform workflows. Production deployment should replace this prototype copy with reviewed legal terms.','Legal'],
    'privacy': ['Privacy Policy','An overview page for privacy practices, data handling and user rights. Production deployment should use a reviewed privacy policy tailored to the actual data infrastructure.','Legal'],
    'refund-policy': ['Refund Policy','Information about cancellation, refunds and order-specific terms. Actual production rules should be reviewed and connected to the payment provider workflow.','Legal'],
    'gst-tax': ['GST & Tax','General information for creators about their own tax and GST responsibilities. This page is informational and is not tax advice.','Legal'],
    'support': ['Support','Find account, payment, marketplace, project and safety support information. Production support channels should be connected here.','Support']
  };

  const richInfoData = {
    blog:{
      eyebrow:'NEXORA JOURNAL',title:'Ideas, craft & the business of making games',desc:'Practical articles for creators, studios, freelancers and people backing ambitious game projects.',
      featured:[['Production','How to scope a game prototype without killing the fun','A practical framework for turning a big idea into a testable vertical slice.','8 min read'],['Funding','What makes a creator project worth backing?','The signals to check before you commit money, time or attention.','6 min read'],['Freelance','From brief to delivery: a better client workflow','Scope, milestones, feedback and handoff without endless revisions.','7 min read']],
      sections:[['Featured stories','Long-form guides and deep dives built around the real problems creators face.'],['Creator playbook','Portfolio strategy, pricing, production planning and client communication.'],['Industry notes','Trends, platform updates and lessons from the wider game-development ecosystem.']]
    },
    press:{
      eyebrow:'NEWSROOM',title:'Nexora Press',desc:'Company news, product milestones, media resources and approved information for journalists and creators covering Nexora.',
      announcements:[['AUG 2026','Nexora prototype expands its creator marketplace','New discovery, project and service workflows bring more of the creator journey into one place.'],['JUL 2026','Community hub enters public prototype testing','The community experience adds project discussion, activity and creator discovery surfaces.'],['JUN 2026','Nexora introduces creator-first project discovery','A new project presentation system focuses on scope, milestones and trust signals.']],
      sections:[['Media kit','Logos, product screenshots, company facts and approved brand assets can be maintained here.'],['Company facts','A concise reference for journalists covering Nexora, its audience and its product direction.'],['Press contact','For prototype enquiries, use Contact Support. A dedicated newsroom inbox can replace this before production launch.']]
    },
    careers:{
      eyebrow:'CAREERS',title:'Build the platform creators wish existed',desc:'Small teams, high ownership and a product that sits at the intersection of games, marketplaces and creative communities.',
      jobs:[['Frontend Engineer','Product · Remote','Build polished discovery, marketplace and creator workflows.'],['Community & Trust Lead','Community · Remote','Design moderation, safety and community programs for a creator-first network.'],['Product Designer','Design · Remote','Turn complex creator workflows into simple, high-signal experiences.']],
      sections:[['How we work','We value ownership, direct communication, thoughtful shipping and evidence over hierarchy.'],['What we look for','Strong fundamentals, curiosity, good judgement and the ability to explain why a product decision matters.'],['No open role for you?','Send a concise portfolio and tell us what part of Nexora you would improve.']]
    },
    about:{
      eyebrow:'ABOUT NEXORA',title:'A home for people who make games',desc:'Nexora connects game creators, projects, services, assets and communities in one creator-first ecosystem.',
      stats:[['01','Discover','Find projects, creators, services and production-ready assets.'],['02','Collaborate','Hire, fund, build and communicate through clearer workflows.'],['03','Grow','Build reputation, publish work and find the next opportunity.']],
      sections:[['The idea','Great game projects often fail to find the right people, funding or visibility. Nexora is designed to reduce that friction.'],['What we care about','Creator ownership, transparent information, useful communities and workflows that respect peoples time.'],['Prototype status','This is a functional product prototype. Payments, KYC, moderation infrastructure and production legal policies still require real backend implementation.']]
    },
    contact:{
      eyebrow:'SUPPORT CENTER',title:'How can we help?',desc:'Choose the path that matches your problem so support requests can reach the right workflow.',
      tiles:[['Account','Login, profile, verification and account settings.','Account help'],['Orders & payments','Marketplace purchases, gigs, order status and transaction issues.','Order help'],['Safety & abuse','Scams, impersonation, harassment or suspicious activity.','Report abuse'],['Projects & funding','Questions about project pages, updates and creator campaigns.','Project help']],
      sections:[['Before contacting support','Include the page, action and relevant order/project reference. Never send passwords, OTPs, recovery codes or full payment credentials.'],['Prototype limitation','Some support buttons currently demonstrate the intended workflow and are not connected to a production ticketing backend.']]
    },
    'creator-handbook':{eyebrow:'CREATOR HANDBOOK',title:'A practical operating manual for creators',desc:'Build a profile people trust, scope work clearly and deliver like a professional.',chapters:[['Profile','Show your strongest work first. Explain exactly what you did and avoid inflated claims.'],['Listings','Define scope, deliverables, revisions, formats and delivery time before publishing.'],['Client work','Use milestones and written requirements. Confirm important changes instead of relying on vague chat messages.'],['Delivery','Package files cleanly, document what changed and leave the client with clear next steps.']]},
    'funding-guide':{eyebrow:'FUNDING GUIDE',title:'How to present a project worth supporting',desc:'A clear project page helps people understand what they are supporting and what could go wrong.',chapters:[['Tell the story','Explain the problem, the game, the current build and why the project matters.'],['Show the plan','Break the target into concrete milestones and explain what each milestone unlocks.'],['Disclose risk','Be honest about dependencies, delays, team capacity and anything that could change delivery.'],['Keep updating','Backers should not have to guess what happened after a campaign gets funded.']]},
    'pricing-fees':{eyebrow:'PRICING & FEES',title:'Know what a transaction costs before you confirm it',desc:'Pricing should be visible, understandable and tied to the actual scope of the work or product.',pricing:[['Creator services','Creators set package pricing and included deliverables.'],['Marketplace assets','Listings should show the price, licence and what files are included.'],['Platform fees','Any applicable platform or transaction fee should appear before confirmation.']]},
    'creator-stories':{eyebrow:'CREATOR STORIES',title:'People building things worth playing',desc:'Case studies can turn creator profiles into useful stories about process, setbacks and outcomes.',stories:[['From prototype to playable','A small team turns a rough concept into a focused vertical slice.'],['The solo creator workflow','How one creator balances production, marketing and client work.'],['Finding the right collaborator','A practical look at matching skills, scope and working style.']]},
    'trust-safety':{eyebrow:'TRUST & SAFETY',title:'Trust should be visible, not assumed',desc:'Safety tools, reporting paths and clear expectations help users make better decisions.',safety:[['Verification','A verification signal tells you what was checked; it is never a guarantee of quality or delivery.'],['Reporting','Use the report flow for scams, impersonation, harassment, spam or unsafe content.'],['Disputes','Keep project scope, messages, delivery evidence and transaction records when resolving problems.']]},
    'verification-process':{eyebrow:'VERIFICATION',title:'What verification means',desc:'Understand the signals attached to profiles and what they can—and cannot—tell you.',steps:[['01','Identity signal','A verification step can confirm a defined identity or account attribute.'],['02','Profile context','Review work history, portfolio, ratings and project evidence separately.'],['03','Your judgement','Verification reduces one type of uncertainty; it does not remove the need to evaluate the deal.']]},
    'report-abuse':{eyebrow:'SAFETY',title:'Report something that feels wrong',desc:'Give moderators enough context to investigate suspicious or harmful behaviour.',form:true},
    'dispute-resolution':{eyebrow:'RESOLUTION CENTER',title:'Resolve problems with evidence, not guesswork',desc:'Start with the agreed scope and keep a clean record of what happened.',steps:[['01','Compare scope','Check the original deliverables, milestones, deadline and revision terms.'],['02','Collect evidence','Keep messages, files, order information and delivery records.'],['03','Escalate','A production implementation should provide a documented mediation and escalation workflow.']]},
    'community-guidelines':{eyebrow:'COMMUNITY',title:'Keep the community useful',desc:'The rules are simple: respect people, contribute honestly and keep accounts secure.',rules:[['Respect people','No harassment, threats, targeted abuse, impersonation or hate.'],['No spam','Avoid deceptive promotions, unsolicited mass messages and engagement manipulation.'],['Protect accounts','Never ask another user for passwords, OTPs, recovery codes or sensitive credentials.'],['Report problems','Use the reporting path instead of escalating conflicts publicly.']]},
    'how-it-works':{eyebrow:'HOW NEXORA WORKS',title:'From discovery to delivery',desc:'Every major workflow follows the same principle: give users enough information to make a good decision.',steps:[['01','Discover','Browse creators, projects, services and assets.'],['02','Evaluate','Review scope, pricing, trust signals, risks and delivery information.'],['03','Participate','Back, hire, buy or collaborate through the relevant workflow.'],['04','Track','Follow updates, messages and order/project information.']]},
    terms:{eyebrow:'LEGAL',title:'Terms of Service',desc:'The prototype rules governing use of Nexora.',legal:[['Using Nexora','Use the platform lawfully and do not abuse, disrupt or circumvent its workflows.'],['Creator responsibility','Creators are responsible for listing accuracy and their own legal, tax and fulfilment obligations.'],['Prototype notice','Production deployment requires reviewed terms matched to the final services and jurisdiction.']]},
    privacy:{eyebrow:'LEGAL',title:'Privacy Policy',desc:'A structured overview of the privacy topics a production Nexora implementation should document.',legal:[['Data collected','Document account, payment, KYC, analytics and messaging data actually collected.'],['How it is used','Explain purposes, legal bases where applicable, sharing and retention.'],['Your choices','Document access, correction, deletion and other applicable user rights.']]},
    'refund-policy':{eyebrow:'LEGAL',title:'Refund Policy',desc:'Understand the areas that should be covered before a production refund workflow goes live.',legal:[['Before purchase','Review product scope, delivery terms and cancellation conditions.'],['After purchase','Keep order records and contact support promptly about transaction or delivery issues.'],['Production policy','Final refund rules must match the payment provider and applicable law.']]},
    'gst-tax':{eyebrow:'TAX INFORMATION',title:'GST & Tax',desc:'General information for creators. This page is not individual tax advice.',legal:[['Your obligations','Creators should determine their own applicable GST and income-tax responsibilities.'],['Records','Keep invoices, transaction records and relevant business documentation.'],['Professional advice','Use a qualified tax professional for situation-specific guidance.']]},
    support:{eyebrow:'HELP CENTER',title:'Find the right help',desc:'Quick routes for account, marketplace, project and safety issues.',tiles:[['Account','Sign-in, profiles and account settings.','Account'],['Marketplace','Orders, assets, gigs and creator services.','Marketplace'],['Projects','Project pages, updates and funding workflows.','Projects'],['Safety','Suspicious behaviour and reports.','Safety']]}
  };

  function infoPageView(key){
    const d=richInfoData[key] || {eyebrow:'NEXORA',title:infoPages[key]?.[0]||'Nexora',desc:infoPages[key]?.[1]||'',sections:[]};
    let body='';
    if(d.featured) body=`<section class="rich-section brutal-section"><div class="section-heading"><div><p class="eyebrow">LATEST</p><h2>Read the latest</h2></div><a href="#/blog" class="text-link">View all articles →</a></div><div class="article-grid info-bento-grid">${d.featured.map((x,i)=>`<article class="article-card ${i===0?'featured':''}"><div class="article-art art-${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${escapeHtml(x[0])}</b></div><div class="article-content"><span class="article-meta">${escapeHtml(x[3])}</span><h3>${escapeHtml(x[1])}</h3><p>${escapeHtml(x[2])}</p><a href="#/blog" class="text-link">Read story →</a></div></article>`).join('')}</div></section><section class="feature-strip info-bento-grid">${d.sections.map(x=>`<article><span class="feature-number">✦</span><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[1])}</p></article>`).join('')}</section>`;
    else if(d.announcements) body=`<section class="rich-section brutal-section"><div class="section-heading"><div><p class="eyebrow">NEWSROOM</p><h2>Announcements</h2></div></div><div class="press-list info-bento-grid">${d.announcements.map(x=>`<article class="press-item"><span class="press-date">${x[0]}</span><div><h3>${escapeHtml(x[1])}</h3><p>${escapeHtml(x[2])}</p><a href="#/press" class="text-link">Read release →</a></div></article>`).join('')}</div></section><section class="feature-strip info-bento-grid">${d.sections.map(x=>`<article><span class="feature-number">✦</span><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[1])}</p></article>`).join('')}</section>`;
    else if(d.jobs) body=`<section class="rich-section brutal-section"><div class="section-heading"><div><p class="eyebrow">OPEN ROLES</p><h2>Find your place</h2></div></div><div class="job-list info-bento-grid">${d.jobs.map(x=>`<article class="job-card"><div><span class="article-meta">${escapeHtml(x[1])}</span><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[2])}</p></div><a href="#/contact" class="btn btn-secondary">View role →</a></article>`).join('')}</div></section><section class="feature-strip info-bento-grid">${d.sections.map(x=>`<article><span class="feature-number">✦</span><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[1])}</p></article>`).join('')}</section>`;
    else if(d.tiles) body=`<section class="rich-section"><div class="support-grid info-bento-grid">${d.tiles.map(x=>`<a class="support-tile" href="#/${x[2].toLowerCase().replace(/ /g,'-')}"><span class="tile-icon">↗</span><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[1])}</p><b>Open ${escapeHtml(x[2])} →</b></a>`).join('')}</div></section>`;
    else if(d.form) body=`<section class="rich-section report-layout"><div class="report-copy"><p class="eyebrow">REPORT FORM</p><h2>Tell us what happened</h2><p>Keep the report factual. Include the relevant profile, project or gig and what you observed.</p><ul><li>Do not include passwords or OTPs.</li><li>Add screenshots or links where useful.</li><li>Explain when and where the behaviour occurred.</li></ul></div><form class="report-form glass-card" onsubmit="event.preventDefault();showToast('Report submitted in demo mode')"><label>What are you reporting?<select><option>Suspicious behaviour</option><option>Impersonation</option><option>Harassment</option><option>Spam</option><option>Unsafe content</option></select></label><label>Details<textarea rows="7" placeholder="Describe the issue..."></textarea></label><button class="btn btn-primary" type="submit">Submit report</button></form></section>`;
    else if(d.stats) body=`<section class="rich-section"><div class="number-grid info-bento-grid">${d.stats.map(x=>`<article><strong>${x[0]}</strong><h3>${escapeHtml(x[1])}</h3><p>${escapeHtml(x[2])}</p></article>`).join('')}</div></section><section class="feature-strip info-bento-grid">${d.sections.map(x=>`<article><span class="feature-number">✦</span><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[1])}</p></article>`).join('')}</section>`;
    else if(d.chapters || d.safety || d.steps || d.rules || d.legal || d.pricing || d.stories) {
      const items=d.chapters||d.safety||d.steps||d.rules||d.legal||d.pricing||d.stories;
      body=`<section class="rich-section"><div class="content-list info-bento-list">${items.map((x,i)=>`<article><div class="content-index">${x.length>2?escapeHtml(x[0]):String(i+1).padStart(2,'0')}</div><div><h3>${escapeHtml(x.length>2?x[1]:x[0])}</h3><p>${escapeHtml(x.length>2?x[2]:x[1])}</p></div></article>`).join('')}</div></section>`;
    } else body=`<section class="rich-section"><div class="feature-strip">${(d.sections||[]).map(x=>`<article><span class="feature-number">✦</span><h3>${escapeHtml(x[0])}</h3><p>${escapeHtml(x[1])}</p></article>`).join('')}</div></section>`;
    const pageClass = `info-${key.replace(/[^a-z0-9]+/gi,'-')}`;
    const visualKicker = ({about:'01 / THE PLATFORM', careers:'OPEN / POSITIONS', press:'DISPATCH / 2026', blog:'JOURNAL / FIELD NOTES', contact:'HELP / ROUTES', 'creator-handbook':'PLAYBOOK / 01', 'funding-guide':'MONEY / MILESTONES', 'pricing-fees':'PRICING / TRANSPARENT', 'creator-stories':'PEOPLE / STORIES', 'trust-safety':'SAFETY / SIGNALS', 'verification-process':'CHECK / VERIFY', 'report-abuse':'ALERT / MODERATION', 'dispute-resolution':'CASE / RESOLUTION', 'community-guidelines':'RULES / COMMUNITY', 'how-it-works':'FLOW / START HERE', terms:'LEGAL / TERMS', privacy:'DATA / PRIVACY', 'refund-policy':'POLICY / REFUNDS', 'gst-tax':'TAX / INDIA', support:'HELP / CENTER'})[key] || 'NEXORA / RESOURCE';
    const navDots = ['01','02','03','04'].map((n,i)=>`<span class="layout-dot ${i===0?'active':''}">${n}</span>`).join('');
    return `<div class="page-shell rich-info-page ${pageClass}" data-info-page="${escapeHtml(key)}">${pixelField()}<div class="page-pattern"></div><section class="rich-hero brutal-hero"><div class="hero-copy"><div class="hero-meta-row"><span class="hero-kicker">${visualKicker}</span><span class="hero-index">${navDots}</span></div><p class="eyebrow">${escapeHtml(d.eyebrow)}</p><h1>${escapeHtml(d.title)}</h1><p>${escapeHtml(d.desc)}</p><div class="hero-actions"><a class="btn btn-primary" href="#/contact">Talk to Nexora <span>↗</span></a><a class="btn btn-secondary" href="#/">Explore platform</a></div></div><div class="hero-art"><div class="hero-orb"><span>NX</span></div><div class="hero-stamp">${escapeHtml(key.toUpperCase())}<br><b>EST. 2026</b></div></div></section>${body}<section class="page-extras"><div class="extra-marquee"><span>BUILT FOR CREATORS</span><span>BUILT FOR CREATORS</span><span>BUILT FOR CREATORS</span></div><div class="extra-grid"><article class="extra-note"><span>NX / NOTE</span><h3>Designed as a working prototype</h3><p>Every workflow shown here is intentionally structured like a real product surface. Production services, legal policies and payment infrastructure still need to be connected before launch.</p></article><article class="extra-stat"><b>2026</b><span>Prototype year</span></article><article class="extra-stat"><b>∞</b><span>Ideas to ship</span></article><article class="extra-quote"><span>“</span><p>Make the work visible. Make the next step obvious.</p></article></div></section><div class="info-page-actions"><a class="btn btn-primary" href="#/">Back to home</a><a class="btn btn-secondary" href="#/contact">Contact support</a></div>${ctaFooter()}</div>`;
  }

function renderRoute() {
    const {parts, anchor} = parseRoute();
    const page = parts[0] || '';
    document.body.classList.toggle('is-community-page', page === 'community');
    if (!page) app.innerHTML = homeView();
    else if (page === 'projects') app.innerHTML = projectsView();
    else if (page === 'explore') app.innerHTML = exploreView();
    else if (page === 'discover') app.innerHTML = discoverViewDeep();
    else if (page === 'games') app.innerHTML = gamesViewDeep();
    else if (page === 'freelancers') app.innerHTML = freelancersViewDeep();
    else if (page === 'creator') app.innerHTML = creatorCommerceView(parts[1]);
    else if (page === 'service') app.innerHTML = serviceViewDeep(parts[1]);
    else if (page === 'project') app.innerHTML = projectView(parts[1]);
    else if (page === 'search') app.innerHTML = searchRouteView();
    else if (page === 'updates') app.innerHTML = parts[1] ? updateDetailView(parts[1]) : updatesViewDeep();
    else if (page === 'marketplace') app.innerHTML = marketplaceViewDeep();
    else if (page === 'asset') app.innerHTML = assetViewDeep(parts[1]);
    else if (page === 'account') app.innerHTML = parts[1] === 'kyc' ? kycView() : (parts[1] === 'edit' ? editAccountView() : accountView());
    else if (page === 'login') app.innerHTML = loginView('login');
    else if (page === 'signup') app.innerHTML = loginView('signup');
    else if (page === 'edit-account') app.innerHTML = editAccountView();
    else if (page === 'community') app.innerHTML = communityView();
    else if (infoPages[page]) {
      if (window.NexoraResourcePages) window.NexoraResourcePages.toast = showToast;
      app.innerHTML = window.NexoraResourcePages?.render(page, ctaFooter()) || infoPageView(page);
    }
    else if (ecosystemHubs[page]) app.innerHTML = ecosystemHubView(page);
    else if (window.NexoraWorkflowPages?.handles(parts)) app.innerHTML = window.NexoraWorkflowPages.render(parts, location.hash);
    else if (routeLandingMeta[page]) app.innerHTML = routeLandingView(page);
    else app.innerHTML = `<div class="page-shell">${pixelField()}<div class="empty-state glass-card"><span class="brand-mark">${icons.sparkle}</span><h2>Page not found</h2><p>The page you requested does not exist in this prototype.</p><a class="btn btn-primary" href="#/">Go home</a></div>${ctaFooter()}</div>`;

    bindDynamicUI();
    bindEnhancedUI();
    bindAccountUI();
    window.NexoraWorkflowPages?.bind(parts);
    updateAccountNav();
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

    $$('[data-project]').forEach(card => card.addEventListener('click', (e) => {
      if (e.target.closest('button,a,input,select,label,video')) return;
      location.hash = `#/project/${card.dataset.project}`;
    }));

    $$('[data-creator]').forEach(card => card.addEventListener('click', (e) => {
      if (e.target.closest('button,a,input,select,label,video')) return;
      location.hash = `#/creator/${card.dataset.creator}`;
    }));
    $$('[data-service]').forEach(card => card.addEventListener('click', (e) => {
      if (e.target.closest('button,a,input,select,label,video')) return;
      location.hash = `#/service/${card.dataset.service}`;
    }));

    $$('[data-market-id]').forEach(card => {
      if (card.dataset.marketBound) return;
      card.dataset.marketBound = '1';
      card.addEventListener('click', (e) => {
        if (e.target.closest('button,a,input,select,label,video')) return;
        location.hash = `#/asset/${card.dataset.marketId}`;
      });
    });

    $$('[data-cart-add]').forEach(btn => {
      if (btn.dataset.cartBound) return;
      btn.dataset.cartBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.NexoraWorkflowPages?.addCart(btn.dataset.cartAdd);
        showToast('Added to cart');
      });
    });

    $$('[data-wishlist-add]').forEach(btn => {
      if (btn.dataset.wishlistBound) return;
      btn.dataset.wishlistBound = '1';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.NexoraWorkflowPages?.addWishlist(btn.dataset.wishlistAdd);
        showToast('Asset added to wishlist');
      });
    });

    $$('[data-project-tab-jump]').forEach(btn => {
      if (btn.dataset.projectJumpBound) return;
      btn.dataset.projectJumpBound = '1';
      btn.addEventListener('click', () => {
        const target = $(`[data-project-tab="${btn.dataset.projectTabJump}"]`);
        target?.click();
        target?.scrollIntoView({behavior:'smooth', block:'center'});
      });
    });

    $$('[data-asset-gallery-src]').forEach(btn => {
      if (btn.dataset.galleryBound) return;
      btn.dataset.galleryBound = '1';
      btn.addEventListener('click', () => {
        const stage = btn.closest('.asset-gallery')?.querySelector('.asset-gallery-stage');
        const image = stage?.querySelector('[data-asset-stage-image]');
        const video = stage?.querySelector('[data-asset-stage-video]');
        if (!stage || !image) return;
        if (video) { video.pause(); video.hidden = true; }
        image.src = btn.dataset.assetGallerySrc;
        image.hidden = false;
        $$('.asset-gallery-thumb', btn.closest('.asset-gallery')).forEach(x=>x.classList.toggle('active', x===btn));
      });
    });

    $$('[data-asset-gallery-video]').forEach(btn => {
      if (btn.dataset.galleryBound) return;
      btn.dataset.galleryBound = '1';
      btn.addEventListener('click', () => {
        const stage = btn.closest('.asset-gallery')?.querySelector('.asset-gallery-stage');
        const image = stage?.querySelector('[data-asset-stage-image]');
        const video = stage?.querySelector('[data-asset-stage-video]');
        if (!stage || !video) return;
        if (image) image.hidden = true;
        if (video.src !== btn.dataset.assetGalleryVideo) video.src = btn.dataset.assetGalleryVideo;
        video.hidden = false;
        video.load();
        $$('.asset-gallery-thumb', btn.closest('.asset-gallery')).forEach(x=>x.classList.toggle('active', x===btn));
      });
    });

    bindAssetPreviewCycles(app);

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

    $$('[data-start-project]').forEach(el => el.addEventListener('click', () => { location.hash = '#/start-project'; }));
    $$('[data-search-open]').forEach(el => el.addEventListener('click', () => openSearch()));
    bindMagnetic();
  }

  function bindAssetPreviewCycles(root=app) {
    $$('.asset-media-cycle', root || document).forEach(box => {
      if (box.dataset.previewBound) return;
      box.dataset.previewBound = '1';
      const sources = (box.dataset.previewImages || '').split('|').filter(Boolean);
      if (sources.length < 2) return;

      sources.forEach(src => { const preload = new Image(); preload.src = src; });
      const current = $('.asset-preview-current', box);
      const next = $('.asset-preview-next', box);
      if (!current || !next) return;

      let index = 0;
      let timer = null;
      let busy = false;
      let queuedIndex = null;

      const swapTo = (newIndex) => {
        if (busy) { queuedIndex = newIndex; return; }
        busy = true;
        const src = sources[newIndex];
        const reveal = () => {
          next.classList.add('is-visible');
          window.setTimeout(() => {
            current.src = src;
            next.classList.remove('is-visible');
            busy = false;
            if (queuedIndex !== null) {
              const q = queuedIndex;
              queuedIndex = null;
              if (current.src !== new URL(sources[q], location.href).href) swapTo(q);
            }
          }, 240);
        };
        next.onload = reveal;
        next.onerror = () => { busy = false; };
        if (next.src === new URL(src, location.href).href && next.complete) reveal();
        else next.src = src;
      };

      box.addEventListener('mouseenter', () => {
        if (timer) return;
        timer = window.setInterval(() => {
          index = (index + 1) % sources.length;
          swapTo(index);
        }, 900);
      });

      box.addEventListener('mouseleave', () => {
        window.clearInterval(timer);
        timer = null;
        index = 0;
        if (current.src !== new URL(sources[0], location.href).href) swapTo(0);
      });
    });
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
      const magneticEls = $$('.magnetic');
      magneticEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        const edgeX = Math.max(Math.abs(dx) - r.width / 2, 0);
        const edgeY = Math.max(Math.abs(dy) - r.height / 2, 0);
        const distance = Math.hypot(edgeX, edgeY);
        let nearest = Infinity;
        magneticEls.forEach(other => {
          if (other === el) return;
          const or = other.getBoundingClientRect();
          const ocx = or.left + or.width / 2;
          const ocy = or.top + or.height / 2;
          nearest = Math.min(nearest, Math.hypot(ocx - cx, ocy - cy));
        });
        const clustered = nearest < Math.max(150, r.width * 1.8);
        const radius = clustered ? 82 : 130;

        if (distance >= radius) {
          reset(el);
          return;
        }

        const strength = Math.pow(1 - distance / radius, 1.7) * (clustered ? .42 : 1);
        const x = clamp(dx * 0.34 * strength, clustered ? -9 : -22, clustered ? 9 : 22);
        const y = clamp(dy * 0.38 * strength, clustered ? -7 : -18, clustered ? 7 : 18);
        const scale = 1 + ((clustered ? 0.025 : 0.07) * strength);
        const rot = clamp((dx / r.width) * (clustered ? 2 : 6) * strength,
          clustered ? -2 : -6, clustered ? 2 : 6);

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
      ...projects.map(x=>({type:'Project',title:x.title,sub:x.creator,href:`#/project/${x.id}`})),
      ...creators.map(x=>({type:'Creator',title:x.name,sub:x.role,href:`#/creator/${x.key}`})),
      ...services.map(x=>({type:'Service',title:x.title,sub:`Starting at \u20B9${fmt(x.price)}`,href:`#/service/${x.key}`})),
      ...marketplaceCatalog.map(x=>({type:'Asset',title:x.title,sub:`\u20B9${fmt(x.price)} \u00B7 ${x.engine}`,href:`#/asset/${x.id}`})),
      ...guilds.map(x=>({type:'Guild',title:x.name,sub:`${x.tag} \u00B7 ${fmt(x.members)} members`,href:'#/community'}))
    ];
    if (query) pool = pool.filter(x => `${x.title} ${x.sub} ${x.type}`.toLowerCase().includes(query));
    pool = pool.slice(0,8);
    $('#searchResults').innerHTML = pool.length ? pool.map(x=>`<a class="search-result" href="${x.href}" data-search-result><span><span class="result-type">${x.type}</span><br><b>${x.title}</b><br><small>${x.sub}</small></span><span>\u2192</span></a>`).join('') : `<div class="empty-state" style="padding:24px"><p>No results found. Try another keyword.</p></div>`;
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
    showToast('Draft created \u2014 connect this form to your backend to save it.');
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
    <a href="#/updates">Updates</a>
    <a href="#/projects">Projects</a>
    <a href="#/marketplace">Marketplace</a>
    <a href="#/community">Communities</a>
    <button type="button" data-search-open>Search</button>
    <a href="#/account" id="mobileAccountLink">My account</a>
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

  $('#navMoreBtn')?.addEventListener('click', () => {
    const resources = $('#resources') || $('.site-footer');
    if (resources) resources.scrollIntoView({behavior:'smooth', block:'start'});
  });

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

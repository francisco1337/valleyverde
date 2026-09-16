/**
 * Single source of truth for everything the marketing site says.
 * Copy is lifted from the legacy WordPress site so the client recognises it,
 * then tightened. Editing this file updates every page.
 */

export const company = {
  name: "Valley Verde Landscaping",
  legalName: "Valley Verde Commercial Landscaping",
  phoneDisplay: "(623) 551-8156",
  phoneHref: "tel:+16235518156",
  // Separate line from the office phone — carried over from the old site's
  // click-to-chat widget, which pointed at 1 602 349 0081.
  whatsappDisplay: "+1 (602) 349-0081",
  whatsappHref: "https://wa.me/16023490081",
  // Official Google Maps URL scheme — no API key, opens the native app on a
  // phone. Swap the query for the real street address once we have it.
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Valley+Verde+Landscaping+North+Phoenix+AZ",
  city: "North Phoenix, Arizona",
  yearsInBusiness: 20,
  longestClientYears: 15,
  tagline: "Commercial landscape maintenance across the Valley of the Sun",
} as const;

/** Copy for the public chat widget (`ChatWidget`). */
export const chatWidget = {
  welcome: `Hi! I'm ${company.name}'s virtual assistant. Ask me about our services — for pricing or scheduling, I'll point you to the contact form or WhatsApp.`,
  placeholder: "Ask about our services…",
  label: "Chat with us",
  turnLimitMessage:
    "We've covered a lot here — for anything more specific, please use the contact form or WhatsApp so a real person can help.",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Our Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** The crew-and-office operations app. Its own entry in the navbar. */
export const portal = {
  label: "Staff Login",
  href: "/app/login",
} as const;

export type ServiceIconName =
  "leaf" | "trees" | "sparkles" | "shovel" | "droplets";

export type ServiceSection = {
  heading: string;
  body: string;
  /** Optional checklist rendered under the paragraph. */
  points?: string[];
};

export type Service = {
  slug: string;
  title: string;
  /** Short label for breadcrumbs and cards. */
  shortTitle: string;
  blurb: string;
  bullets: string[];
  image: string;
  icon: ServiceIconName;
  /** Page-level copy. */
  metaTitle: string;
  metaDescription: string;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
  sections: ServiceSection[];
  faq: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "landscape-maintenance",
    title: "Landscape Maintenance",
    shortTitle: "Maintenance",
    blurb:
      "Scheduled crews that keep retail centers, HOAs, schools and office parks looking sharp week after week — with a written plan built around your property, not a generic route.",
    bullets: [
      "Weekly, bi-weekly or monthly schedules",
      "Turf, shrub and desert-plant care",
      "One point of contact for every property",
    ],
    image: "/images/svc-maintenance.webp",
    icon: "leaf",
    metaTitle: "Commercial Landscape Maintenance in Phoenix, AZ",
    metaDescription:
      "Scheduled commercial landscape maintenance for retail centers, HOAs, schools and office parks across Phoenix, Scottsdale, Paradise Valley and Tempe.",
    heroKicker: "Landscape",
    heroTitle: "Maintenance",
    heroBody:
      "We make your Arizona property stand out with beautifully manicured landscapes that make a statement — combining our love of the desert with the expertise to keep it looking that way in July.",
    sections: [
      {
        heading: "We make your maintenance plan easy from start to finish",
        body: "Beautifying your place of business, your commercial residences or your retail centers should never be a painful experience. We collaborate with you on your vision and put together a maintenance plan built specifically for your properties. You will always know you are getting the best return on your landscape services budget, because we communicate at every step — you keep complete control over the services you receive, the timeline and the cost.",
      },
      {
        heading: "We customize our services to the property, not a route sheet",
        body: "Two shopping centers a mile apart can need completely different things. Our representative meets you on site, reviews the full property, learns about your business and your clientele, listens to your ideas, and shares what has worked on similar properties in the Valley.",
        points: [
          "Turf mowing, edging and fertilization",
          "Shrub, hedge and ornamental pruning",
          "Desert and xeriscape plant care",
          "Weed removal and pre-emergent control",
          "Debris removal and blowing on every visit",
          "Irrigation checks as part of the route",
        ],
      },
      {
        heading: "A written plan before we touch a single plant",
        body: "A short time after the on-site review, our team sends a Landscape Maintenance Plan that lets you picture the service and decide whether we are on the right track. We review it together, make any revisions you want, and make sure the pricing fits your team's budget — on site, in your office or over Zoom.",
      },
    ],
    faq: [
      {
        q: "How often do crews come out?",
        a: "Weekly, bi-weekly or monthly, depending on the property and the season. Most commercial properties in the Valley land on weekly during the growing season and drop back in winter. We put the schedule in writing so there is no ambiguity.",
      },
      {
        q: "Do you work with management companies?",
        a: "Yes — much of our current client list is management companies for shopping and retail centers, HOA communities, apartment complexes and schools, along with private building owners. We are used to working with off-site and out-of-state managers.",
      },
      {
        q: "Are you licensed and insured?",
        a: "We are licensed by the State of Arizona and insured for both Workers' Compensation and liability protection. That protects you and your business, not just us.",
      },
    ],
  },
  {
    slug: "tree-trimming",
    title: "Tree & Palm Trimming",
    shortTitle: "Tree Trimming",
    blurb:
      "Certified crews shape canopies, remove hazards before monsoon season and keep you compliant with city codes. Palm skinning and clean-up included.",
    bullets: [
      "Monsoon hazard reduction",
      "Palm skinning and trimming",
      "City code and ordinance compliance",
    ],
    image: "/images/svc-tree-trimming.webp",
    icon: "trees",
    metaTitle: "Commercial Tree & Palm Trimming in Phoenix, AZ",
    metaDescription:
      "Tree and palm trimming for commercial properties across the Valley of the Sun. Monsoon hazard reduction, palm skinning, branch removal and custom pruning plans.",
    heroKicker: "Tree & Palm",
    heroTitle: "Trimming",
    heroBody:
      "A comprehensive menu of tree care, available on its own as a one-time or emergency service, or folded into your regular maintenance agreement.",
    sections: [
      {
        heading: "Why prune the trees on your property?",
        body: "Tree trimming enhances and restores the beauty of your trees, and it is a necessary part of proper landscape maintenance. Regular pruning also protects your trees against storm damage — which in the Valley is not a hypothetical.",
        points: [
          "Shape and thin the canopy of mature trees",
          "Provide clearance for new growth",
          "Remove diseased or dying growth that weakens the tree",
          "Eliminate structural defects that inhibit growth",
          "Reduce hazards caused by monsoon season winds",
          "Increase air flow and light across the property",
          "Comply with city codes and ordinances",
        ],
      },
      {
        heading: "We are palm specialists too",
        body: "Palm tree clean-up, skinning, trimming, new tree planting and branch removal. Palms need a different hand than shade trees, and a bad palm trim is visible from the street for a year.",
      },
      {
        heading: "Choose a knowledgeable professional",
        body: "Tree trimming looks straightforward and is not. Done well it adds years to a tree's life span; done badly it causes weakened limbs, insect infestation and disease, and it can kill a mature tree outright. We inspect the trees on your property and build a custom pruning plan before any cuts are made. Give us a call and one of our experts will come evaluate — we promise a fair and reasonable estimate, plus recommendations that reduce your future costs.",
      },
    ],
    faq: [
      {
        q: "When should trees be trimmed in Phoenix?",
        a: "The most important window is before monsoon season, so that weak and overgrown limbs come down on your schedule rather than onto a parked car. Beyond that, it depends on the species — we will tell you what each tree on your property actually needs.",
      },
      {
        q: "Can you handle emergency storm damage?",
        a: "Yes. We offer tree service as a one-time seasonal or emergency call, not just as part of a maintenance agreement.",
      },
      {
        q: "Do you haul away the debris?",
        a: "Always. Branches, fronds and trimmings are cleared as part of the job — the property is left clean.",
      },
    ],
  },
  {
    slug: "clean-up",
    title: "Property Clean Up",
    shortTitle: "Clean Up",
    blurb:
      "Debris, storm damage and overgrowth cleared from lawns, parking lots, beds and walkways — as a one-time service or on a recurring agreement.",
    bullets: [
      "One-time or recurring agreements",
      "Storm and erosion damage recovery",
      "Weed removal and control",
    ],
    image: "/images/svc-cleanup.webp",
    icon: "sparkles",
    metaTitle: "Commercial Property Clean Up in Phoenix, AZ",
    metaDescription:
      "Large commercial clean up services in the Phoenix area. Debris removal, storm damage recovery, weed control and recurring property clean up agreements.",
    heroKicker: "Property",
    heroTitle: "Clean Up",
    heroBody:
      "Branches, leaves, twigs and debris cleared from your lawn, parking lot, flower beds and walkways — so you never have to think about how the outside of your business looks.",
    sections: [
      {
        heading: "Stay in compliance without thinking about it",
        body: "We specialize in large clean up services for properties of all types, and we have an excellent reputation with companies, property owners and management companies both in state and out of state. Keeping your property in compliance with city ordinances is part of the job, not an upsell.",
      },
      {
        heading: "One-time clean up",
        body: "If your property has been damaged recently, sat unattended for a while, or simply needs sprucing up, a one-time clean up resets it. We clear broken limbs, raise up or remove trees and bushes, pick up trash and debris, trim foliage, remove and control weeds, and revitalize landscapes damaged by the weather.",
        points: [
          "Broken limb and storm debris removal",
          "Tree and bush removal or raising",
          "Trash and debris pick-up",
          "Weed removal and control",
          "Erosion damage repair",
        ],
      },
      {
        heading: "Or put it on a schedule",
        body: "If you would rather not call every time, we will talk through a recurring property clean up agreement — weekly, bi-weekly or monthly — or fold it into general landscape maintenance. No matter how big or how small the job, we work with management or the owner directly to build the plan that fits the property.",
      },
    ],
    faq: [
      {
        q: "Do you handle unusual clean up situations?",
        a: "Generally yes. Tell us what the property looks like now and what you need it to look like, and we will tell you honestly whether it is something we do.",
      },
      {
        q: "One-time or recurring — which is cheaper?",
        a: "A recurring agreement almost always costs less per visit and prevents the big, expensive reset jobs. But if you only need the reset, we are happy to just do the reset.",
      },
    ],
  },
  {
    slug: "landscape-improvements",
    title: "Landscape Improvements",
    shortTitle: "Improvements",
    blurb:
      "Renovations and installs that make a tired property look new again. We design around the Sonoran desert, so it still looks good in July.",
    bullets: [
      "Design, install and renovation",
      "Xeriscape and desert planting",
      "Budget mapped out before we start",
    ],
    image: "/images/svc-improvements.webp",
    icon: "shovel",
    metaTitle: "Commercial Landscape Improvements in Phoenix, AZ",
    metaDescription:
      "Landscape renovation and installation for commercial properties in Phoenix, Scottsdale and Tempe. Desert design, xeriscape and full property updates.",
    heroKicker: "Landscape",
    heroTitle: "Improvements",
    heroBody:
      "We make your Arizona property stand out from the crowd with beautifully updated landscaping that makes a statement — and keeps the property in excellent condition.",
    sections: [
      {
        heading: "Your landscape is one of your first forms of advertising",
        body: "You run a successful business and you are dressed to kill. Is your business dressed to kill as well? Your landscape design presents your business before anyone has stepped inside. A renovation or installation puts that first impression back where it should be.",
      },
      {
        heading: "Easy from start to finish",
        body: "Updating a property should never be an unpleasant experience. We collaborate on your vision and put together the design and the plan, so you feel confident step by step. You will always know you are getting the best return on your landscape budget, and you keep complete control over the services, the timeline, the scope and the cost.",
        points: [
          "Full design and installation",
          "Xeriscape and desert-adapted planting",
          "Boulder, granite and hardscape features",
          "Turf renovation and replacement",
          "Erosion damage repair and regrading",
        ],
      },
      {
        heading: "We combine our ideas and experience with yours",
        body: "We have spent over two decades working with the Phoenix-area desert, and that experience shows up as concrete suggestions during the on-site review — what thrives here, what will look tired in three years, and what your neighbours have already tried.",
      },
    ],
    faq: [
      {
        q: "Do you do the design, or do I need a separate designer?",
        a: "We design and install. For most commercial properties, a separate designer is an extra cost that does not buy you much — we build the plan around your budget from the first conversation.",
      },
      {
        q: "How long does a renovation take?",
        a: "It depends entirely on scope. What we commit to is a start date and a written schedule in the final proposal, so you can plan around it.",
      },
    ],
  },
  {
    slug: "irrigation-system",
    title: "Irrigation Systems",
    shortTitle: "Irrigation",
    blurb:
      "Design, installation, diagnostics and emergency repair. We specialise in drip systems that hit roughly 90% water-use efficiency versus about 75% for sprinklers.",
    bullets: [
      "Drip system design and install",
      "Leak inspection and emergency repair",
      "Timer, valve and sprinkler head service",
    ],
    image: "/images/svc-irrigation.webp",
    icon: "droplets",
    metaTitle: "Commercial Irrigation Systems & Repair in Phoenix, AZ",
    metaDescription:
      "Drip irrigation design, installation, diagnostics and emergency repair for commercial properties across the Phoenix metro area.",
    heroKicker: "Irrigation",
    heroTitle: "Systems",
    heroBody:
      "Your business has mission-critical work to focus on, and watching the irrigation turn on and off should not be on that list. Hand it to us and your landscape stays healthy without your attention.",
    sections: [
      {
        heading: "What an excellent system actually requires",
        body: "Your irrigation system is the lifeline of your outdoor landscape. Don't wait until the little problems become major ones — a missed leak in Phoenix shows up on the water bill long before it shows up on the plants.",
        points: [
          "Identifying your needs and designing the most effective system",
          "Installing the system",
          "Routine checks and diagnostics to confirm full capacity",
          "Repairing the system when issues occur",
        ],
      },
      {
        heading: "Arizona's drip irrigation specialists",
        body: "Water is scarce in Phoenix, Scottsdale, Tempe and the surrounding communities, and many people conclude that an abundance of plants is not sustainable here. It is — with the right system. The average sprinkler system runs at around 75% water-use efficiency. A properly designed drip system reaches as high as 90%. That difference is what makes real planting viable on your property while lowering your water bill.",
      },
      {
        heading: "Repairs across the Phoenix area",
        body: "Our service keeps trees, lawns, plants, succulents and cactus receiving the right amount of water to stay healthy and look right. Repairs also stop leaks before they get out of hand, which saves a considerable amount on the water bill.",
        points: [
          "Water leak repair",
          "Leak inspection",
          "Emergency repairs",
          "Drip irrigation repair",
          "Sprinkler head replacement",
          "Pump relay repair",
          "Timer repair",
        ],
      },
    ],
    faq: [
      {
        q: "Is drip really better than sprinklers here?",
        a: "For most Arizona commercial planting, yes — roughly 90% water-use efficiency versus about 75%. Turf is the exception; grass still wants sprinklers. Most properties end up with both, zoned correctly.",
      },
      {
        q: "Do you offer emergency repair?",
        a: "Yes. Leaks and valve failures do not wait for the next scheduled visit, and neither do we.",
      },
      {
        q: "Can you maintain a system you did not install?",
        a: "Absolutely. A lot of our irrigation work is diagnosing and fixing systems somebody else put in.",
      },
    ],
  },
];

export const serviceSlugs = services.map((service) => service.slug);

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const stats = [
  { value: 20, suffix: "+", label: "Years serving the Valley" },
  { value: 15, suffix: "+", label: "Years with our longest clients" },
  { value: 195, suffix: "", label: "Acres maintained on a single site" },
  { value: 100, suffix: "%", label: "Of our work, guaranteed" },
] as const;

export const differentiators = [
  {
    icon: "shield" as const,
    title: "Licensed and insured",
    body: "Licensed by the State of Arizona and carrying both Workers' Compensation and liability coverage — so a claim on your property never becomes your problem.",
  },
  {
    icon: "clock" as const,
    title: "We keep the appointments we give you",
    body: "Crews arrive when we said they would and finish when we said they would. You should not have to chase your landscaper for a status update.",
  },
  {
    icon: "users" as const,
    title: "Small enough to care, large enough to cover you",
    body: "A family-owned company out of North Phoenix, staffed by long-term crews who have years of experience in landscaping and irrigation — not seasonal hires.",
  },
  {
    icon: "message" as const,
    title: "You stay in control of the budget",
    body: "We walk your property with you, write an easy-to-understand proposal, and communicate at every step. No surprise line items at the end of the month.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Tell us what you are looking for",
    body: "Call us or send the form. We schedule a short conversation about your properties and what is not working today.",
  },
  {
    step: "02",
    title: "On-site landscape review",
    body: "We walk the property with you, learn your business and your clientele, share what has worked on similar sites, and talk budget openly.",
  },
  {
    step: "03",
    title: "Your personalised maintenance plan",
    body: "A written plan that lets you picture the service — scope, schedule and pricing — so you can judge whether we are on the right track.",
  },
  {
    step: "04",
    title: "Plan review meeting",
    body: "On-site, in your office or over Zoom. We answer questions, make revisions and make sure the pricing fits your team's budget.",
  },
  {
    step: "05",
    title: "Finalise and sign",
    body: "A final proposal outlining the comprehensive services, the start schedule and the specifics. No ambiguity about what you are buying.",
  },
  {
    step: "06",
    title: "We handle the rest",
    body: "Crews start on the agreed date. We reach out frequently, and you can reach us at any time.",
  },
];

export const testimonials = [
  {
    quote:
      "Valley Verde Landscaping gives me comfort in knowing that whatever issue may present itself, they will handle it with ease and professionalism, while keeping an eye on the budget.",
    name: "Rayna Small",
    role: "Property Manager",
    avatar: "/images/avatars/a1.webp",
  },
  {
    quote:
      "Valley Verde takes care of 195 acres of landscape areas on this property, which includes over 700,000 square feet of grass. The crews are considerate and teachable, and they keep a neat appearance.",
    name: "Sean Rosenberg",
    role: "Project Manager",
    avatar: "/images/avatars/a2.webp",
  },
  {
    quote:
      "I have been working with Aurelio and Valley Verde for about 5 years now, and continue to be impressed with the way they handle any situation regarding our commercial landscape maintenance.",
    name: "Azar Meszaros",
    role: "Property Manager",
    avatar: "/images/avatars/a3.webp",
  },
  {
    quote:
      "We have learned that Valley Verde is quite experienced in restoring landscaping that has deteriorated and bringing it back to life. We heartily recommend them to other commercial property owners and managers.",
    name: "Bruce D. Milton",
    role: "Field Supervisor",
    avatar: "/images/avatars/a4.webp",
  },
  {
    quote:
      "We have dealt with many landscape contractors over the years and Valley Verde Landscaping is certainly one of the best. They certainly warrant your consideration.",
    name: "Joseph F. Ladrigan",
    role: "Partner",
    avatar: "/images/avatars/a5.webp",
  },
];

export const gallery = [
  {
    src: "/images/gallery/g1.webp",
    alt: "Desert landscaping with saguaro and ocotillo along a commercial walkway",
    caption: "Retail frontage · Scottsdale",
  },
  {
    src: "/images/gallery/g2.webp",
    alt: "Maintained desert bed with barrel cactus and decomposed granite",
    caption: "Common area · North Phoenix",
  },
  {
    src: "/images/gallery/g3.webp",
    alt: "Agave and cactus planting bed beside a commercial driveway",
    caption: "Entry drive · Paradise Valley",
  },
  {
    src: "/images/gallery/g4.webp",
    alt: "Native desert plantings framing a curved commercial pathway",
    caption: "Campus pathway · Tempe",
  },
  {
    src: "/images/gallery/g5.webp",
    alt: "Boulder feature and desert planting at a commercial property entrance",
    caption: "Property entrance · Phoenix",
  },
  {
    src: "/images/gallery/g6.webp",
    alt: "Flowering beds and palms on a maintained commercial campus",
    caption: "HOA grounds · Sun City",
  },
  {
    src: "/images/gallery/g7.webp",
    alt: "Rock and cactus bed bordering a commercial parking area",
    caption: "Parking perimeter · Glendale",
  },
  {
    src: "/images/gallery/g8.webp",
    alt: "Valley Verde crew member mowing turf on a commercial property",
    caption: "Weekly service · Mesa",
  },
];

export const communities = [
  "Phoenix",
  "Scottsdale",
  "Paradise Valley",
  "Tempe",
  "Mesa",
  "Chandler",
  "Gilbert",
  "Peoria",
  "Glendale",
  "Ahwatukee",
  "Avondale",
  "Anthem",
  "Pinnacle Peak",
  "Surprise",
  "Laveen",
  "Fountain Hills",
  "Apache Junction",
  "Queen Creek",
  "Desert Ridge",
  "Goodyear",
  "Sun City",
  "Carefree",
  "Cave Creek",
];

export const clientTypes = [
  "Shopping & retail centers",
  "HOA communities",
  "Apartment complexes",
  "Schools",
  "Private building owners",
  "Management companies",
];

/** About page copy. */
export const about = {
  heroKicker: "Our",
  heroTitle: "Company",
  heroBody:
    "A family-owned commercial landscape maintenance company based in North Phoenix, proudly serving the Valley of the Sun for over 20 years.",
  story: [
    "Valley Verde Landscaping has been providing professional, top quality landscape maintenance to commercial properties of all types in the Phoenix area for more than two decades. Our exceptional service, our communication, and our knowledge of desert landscape maintenance have helped us develop long-term working relationships with our clients. Many of those clients have been using our consistently reliable services for over 15 years.",
    "Our current client list includes management companies for shopping and retail centers, private building owners, schools, HOA communities and apartment complexes. We are licensed by the State of Arizona and insured for both Workers' Compensation and liability protection — which protects you and your business, not just us. Our long-term maintenance personnel are fully trained and have years of experience in landscaping and irrigation systems.",
    "We are small enough to care and large enough to cover all of your commercial landscape maintenance needs. Give us a call for a consultation: we will walk your property with you to become familiar with your requirements, write up an easy-to-understand proposal, guarantee you a reasonable price, and put your property into our schedule.",
  ],
  pullQuote: "It's our job to make you look good.",
  values: [
    {
      title: "We add value to your property",
      body: "Our service, communication and knowledge of Arizona's desert landscape have helped us build relationships that outlast the contracts they started as.",
    },
    {
      title: "We keep the appointments we give you",
      body: "You keep busy enough running your business. When you schedule us for maintenance or renovation, we are there and we finish on time.",
    },
    {
      title: "We take pride in our work and it shows",
      body: "We are staffed by talented landscaping professionals who see every project as a chance to create spaces people actually enjoy being in.",
    },
  ],
};

/**
 * Todo lo público del negocio en un solo bloque de texto, para inyectarlo tal
 * cual en el system prompt de los dos chats (público e interno) — el corpus
 * es chico (unas páginas), así que no hace falta RAG/embeddings: cabe
 * completo en el contexto del modelo.
 *
 * No incluye precios (el sitio nunca los publica) ni datos de clientes reales
 * — esos siguen viviendo solo en las herramientas del asistente interno.
 */
export const businessKnowledge = `COMPANY: ${company.name} (legal name: ${company.legalName})
Tagline: ${company.tagline}
Based in / serving: ${company.city}
Phone: ${company.phoneDisplay}
WhatsApp: ${company.whatsappDisplay}
Map / directions link: ${company.mapsHref}
Years in business: ${company.yearsInBusiness}+ (longest-running client relationship: ${company.longestClientYears}+ years)
No public storefront address is published — the company works on-site across its service area, not from a walk-in office.

SERVICE AREA (communities served): ${communities.join(", ")}

TYPICAL CLIENTS: ${clientTypes.join(", ")}

WHY CLIENTS CHOOSE US:
${differentiators.map((d) => `- ${d.title}: ${d.body}`).join("\n")}

SERVICES OFFERED:
${services
  .map(
    (s, i) => `${i + 1}. ${s.title} (slug: ${s.slug})
   ${s.blurb}
   Highlights: ${s.bullets.join("; ")}
   FAQ:
${s.faq.map((f) => `   - Q: ${f.q}\n     A: ${f.a}`).join("\n")}`,
  )
  .join("\n\n")}

ABOUT / COMPANY STORY:
${about.story.join("\n\n")}
Pull quote: "${about.pullQuote}"`;

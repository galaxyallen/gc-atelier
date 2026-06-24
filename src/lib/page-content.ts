export type HomeHeroContent = {
  line1: string;
  line2: string;
  subtitle: string;
  cta: string;
};

export type HomeIntroContent = {
  label: string;
  heading: string;
  body: string;
  statsDisciplines: number;
  statsYears: number;
  statsProjects: number;
  statsDisciplinesLabel: string;
  statsYearsLabel: string;
  statsProjectsLabel: string;
};

export type HomeSectionHead = {
  label: string;
  heading: string;
  linkText: string;
};

export type HomeProjectCard = {
  name: string;
  category: string;
  image: string;
};

export type HomeProductCard = {
  name: string;
  category: string;
  price: number;
  image: string;
};

export type HomeProjectsSection = HomeSectionHead & {
  cards?: HomeProjectCard[];
};

export type HomeProductsSection = HomeSectionHead & {
  cards?: HomeProductCard[];
  addToCartText?: string;
  addedText?: string;
};

export type HomeProcessStep = {
  num: string;
  title: string;
  desc: string;
};

export type HomeStudioContent = {
  label: string;
  heading: string;
  name: string;
  role: string;
  bio1: string;
  bio2: string;
  principlesLabel: string;
  principles: string[];
  linkText: string;
};

export type HomeCapabilityItem = {
  icon: string;
  name: string;
  desc: string;
  linkText: string;
};

export type HomeCapabilityContent = {
  label: string;
  heading: string;
  linkText: string;
  residentialTitle: string;
  residentialDesc: string;
  productTitle: string;
  productDesc: string;
  residentialItems: HomeCapabilityItem[];
  productItems: HomeCapabilityItem[];
};

export type HomeContactContent = {
  label: string;
  heading: string;
  description: string;
  linkText: string;
  email?: string;
  phone?: string;
  wechat?: string;
  address?: string;
};

export type HomeContent = {
  hero: HomeHeroContent;
  intro: HomeIntroContent;
  projects: HomeProjectsSection;
  capability: HomeCapabilityContent;
  products: HomeProductsSection;
  process: HomeSectionHead & { steps: HomeProcessStep[] };
  studio: HomeStudioContent;
  contact: HomeContactContent;
};

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    line1: "From living spaces",
    line2: "everyday objects.",
    subtitle:
      "A Guangzhou-based design atelier bridging residential environments and consumer product development — from concept to production.",
    cta: "Explore projects",
  },
  intro: {
    label: "About the atelier",
    heading: "We design the environments people live in — and the objects they live with.",
    body: "GC Atelier is a multi-disciplinary design practice based in Guangzhou, working across interiors, villas, landscape, and consumer products. We bring the same spatial sensibility to a hillside residence as we do to an aroma diffuser on your desk.",
    statsDisciplines: 6,
    statsYears: 12,
    statsProjects: 50,
    statsDisciplinesLabel: "Design disciplines",
    statsYearsLabel: "Years of experience",
    statsProjectsLabel: "Projects delivered",
  },
  projects: {
    label: "Portfolio",
    heading: "Selected projects",
    linkText: "View all →",
  },
  capability: {
    label: "What we do",
    heading: "Two disciplines. One atelier.",
    linkText: "View all services →",
    residentialTitle: "Residential environment design",
    residentialDesc: "Shaping spaces where life unfolds.",
    productTitle: "Product design",
    productDesc: "Crafting objects that carry intention.",
    residentialItems: [
      { icon: "⌂", name: "Interior", desc: "Residential and hospitality interiors with considered materiality and spatial logic.", linkText: "View projects →" },
      { icon: "▣", name: "Villa", desc: "Full architectural vision — structure, facade, and courtyard as one integrated expression.", linkText: "View projects →" },
      { icon: "◊", name: "Landscape", desc: "Private gardens and outdoor environments that extend the living space into nature.", linkText: "View projects →" },
    ],
    productItems: [
      { icon: "◎", name: "Diffuser", desc: "Aroma diffusers merging sculptural form with functional precision and sensory experience.", linkText: "View projects →" },
      { icon: "⬡", name: "Backpack", desc: "Performance bags designed for material integrity, ergonomic comfort, and daily utility.", linkText: "View projects →" },
      { icon: "◉", name: "Speaker", desc: "Audio products where acoustic engineering meets sculptural visual identity.", linkText: "View projects →" },
    ],
  },
  products: {
    label: "Shop",
    heading: "Featured products",
    linkText: "View all →",
    addToCartText: "Add to cart",
    addedText: "Added ✓",
  },
  process: {
    label: "How we work",
    heading: "From first conversation to final delivery.",
    linkText: "Learn more about our process →",
    steps: [
      { num: "01", title: "Inquiry", desc: "Share your vision. We listen, assess scope, and align on direction." },
      { num: "02", title: "Concept", desc: "Initial design concepts with mood boards, references, and spatial studies." },
      { num: "03", title: "Design", desc: "Detailed development with 3D modelling, material selection, and refinement." },
      { num: "04", title: "Production", desc: "Manufacturing management, sourcing, and quality control through our network." },
      { num: "05", title: "Delivery", desc: "Final inspection, logistics coordination, and complete project handover." },
    ],
  },
  studio: {
    label: "The studio",
    heading: "Where every project begins.",
    name: "GC Atelier",
    role: "Design atelier · Guangzhou",
    bio1:
      "Founded on the belief that good design bridges the gap between space and object, GC Atelier operates at the intersection of architectural thinking and product craft.",
    bio2:
      "With deep roots in both design practice and manufacturing networks across Asia, we offer something rare — an atelier that can take an idea from sketch to shelf, from blueprint to built reality.",
    principlesLabel: "Design principles",
    principles: [
      "Material honesty — let every surface speak its truth.",
      "Spatial clarity — remove until only the essential remains.",
      "Quiet refinement — the details you feel before you see.",
    ],
    linkText: "Explore the studio →",
  },
  contact: {
    label: "Get in touch",
    heading: "Let's start with a conversation.",
    description:
      "Whether you have a project in mind or simply want to explore possibilities, we'd like to hear from you.",
    linkText: "View full contact details →",
  },
};

export function mergeHomeContent(stored: Partial<HomeContent> | null | undefined): HomeContent {
  const s = stored ?? {};
  return {
    hero: { ...DEFAULT_HOME_CONTENT.hero, ...s.hero },
    intro: { ...DEFAULT_HOME_CONTENT.intro, ...s.intro },
    projects: { ...DEFAULT_HOME_CONTENT.projects, ...s.projects },
    capability: {
      ...DEFAULT_HOME_CONTENT.capability,
      ...s.capability,
      residentialItems: s.capability?.residentialItems?.length
        ? s.capability.residentialItems
        : DEFAULT_HOME_CONTENT.capability.residentialItems,
      productItems: s.capability?.productItems?.length
        ? s.capability.productItems
        : DEFAULT_HOME_CONTENT.capability.productItems,
    },
    products: { ...DEFAULT_HOME_CONTENT.products, ...s.products },
    process: {
      ...DEFAULT_HOME_CONTENT.process,
      ...s.process,
      steps: s.process?.steps?.length ? s.process.steps : DEFAULT_HOME_CONTENT.process.steps,
    },
    studio: {
      ...DEFAULT_HOME_CONTENT.studio,
      ...s.studio,
      principles: s.studio?.principles?.length
        ? s.studio.principles
        : DEFAULT_HOME_CONTENT.studio.principles,
    },
    contact: { ...DEFAULT_HOME_CONTENT.contact, ...s.contact },
  };
}

// ─── Studio page ───────────────────────────────────────────────

export type ManifestoLine = { text: string; italic: boolean };

export type StudioContent = {
  hero: { mark: string; title: string; subtitle: string };
  manifesto: ManifestoLine[];
  origin: { label: string; heading: string; paragraphs: string[]; signature: string };
  philo: { label: string; heading: string; cards: { num: string; title: string; desc: string }[] };
  capabilities: {
    label: string;
    heading: string;
    cards: { icon: string; name: string; desc: string; tags: string[] }[];
  };
  network: {
    label: string;
    heading: string;
    stats: { num: number; suffix: string; label: string }[];
    regions: { name: string; categories: string }[];
  };
  milestones: { label: string; heading: string; items: { year: string; label: string }[] };
  cta: { heading: string; buttonText: string; buttonLink: string };
};

export const DEFAULT_STUDIO_CONTENT: StudioContent = {
  hero: {
    mark: "GC ATELIER",
    title: "The Studio",
    subtitle: "Guangzhou · Design · Manufacturing",
  },
  manifesto: [
    { text: "We believe design should cross boundaries —", italic: false },
    { text: "between the rooms you inhabit", italic: true },
    { text: "and the objects you hold.", italic: true },
    { text: "Between imagination and manufacturing.", italic: false },
    { text: "Between East and everywhere.", italic: false },
  ],
  origin: {
    label: "How it began",
    heading: "A studio born at the intersection of design and making.",
    paragraphs: [
      "GC Atelier started with a simple observation: the best designs often fail at the point of production. Beautiful concepts diluted by factories that don't understand the designer's intent.",
      "Having spent years on both sides — designing spaces and products, while building relationships with manufacturers across China's production heartland — we saw an opportunity to bridge that gap.",
      "Today, GC Atelier operates from Guangzhou, at the centre of the world's most sophisticated manufacturing ecosystem.",
    ],
    signature: "— GC, Founder",
  },
  philo: {
    label: "Design philosophy",
    heading: "Three principles that guide every decision.",
    cards: [
      {
        num: "01",
        title: "Material honesty",
        desc: "Let every surface speak its truth. We choose materials for what they are, not what they imitate.",
      },
      {
        num: "02",
        title: "Spatial clarity",
        desc: "Remove until only the essential remains. Clarity is not minimalism — it's precision.",
      },
      {
        num: "03",
        title: "Quiet refinement",
        desc: "The details you feel before you see. The work lives in details that don't announce themselves.",
      },
    ],
  },
  capabilities: {
    label: "How we bring ideas to life",
    heading: "Tools and technology.",
    cards: [
      {
        icon: "◎",
        name: "3D visualization",
        desc: "From initial spatial modelling to photorealistic client presentations.",
        tags: ["SketchUp", "UE5", "V-Ray"],
      },
      {
        icon: "◇",
        name: "Concept development",
        desc: "AI-assisted ideation accelerates the exploration phase.",
        tags: ["Midjourney", "Lovart.ai", "ComfyUI"],
      },
      {
        icon: "⬡",
        name: "Production management",
        desc: "Direct factory relationships and on-site quality control.",
        tags: ["OEM network", "Sourcing", "QC"],
      },
      {
        icon: "▣",
        name: "Presentation",
        desc: "Cinematic walkthroughs and high-fidelity renders.",
        tags: ["UE5 cinematic", "OBS", "Video"],
      },
    ],
  },
  network: {
    label: "Manufacturing network",
    heading: "Design with production in mind.",
    stats: [
      { num: 20, suffix: "+", label: "Factory partners" },
      { num: 6, suffix: "", label: "Product categories" },
      { num: 15, suffix: "+", label: "Countries served" },
      { num: 100, suffix: "%", label: "QC pass rate" },
    ],
    regions: [
      { name: "Pearl River Delta", categories: "Electronics, speakers, lighting" },
      { name: "Yangtze River Delta", categories: "Textiles, bags, soft goods" },
      { name: "Foshan · Zhongshan", categories: "Furniture, ceramics, hardware" },
      { name: "Chaozhou · Dehua", categories: "Ceramic diffusers, porcelain" },
      { name: "Dongguan · Huizhou", categories: "Backpacks, cases, packaging" },
    ],
  },
  milestones: {
    label: "Our journey",
    heading: "Milestones along the way.",
    items: [
      { year: "2014", label: "Studio founded\nin Guangzhou" },
      { year: "2017", label: "First international\ndesign client" },
      { year: "2020", label: "Product design\nline launched" },
      { year: "2023", label: "Factory network\nexpanded to 20+" },
      { year: "2025", label: "AI-integrated\nworkflow adopted" },
    ],
  },
  cta: {
    heading: "Every project begins with\na conversation.",
    buttonText: "Get in touch",
    buttonLink: "/#sec-contact",
  },
};

export function mergeStudioContent(stored: Partial<StudioContent> | null | undefined): StudioContent {
  const s = stored ?? {};
  return {
    hero: { ...DEFAULT_STUDIO_CONTENT.hero, ...s.hero },
    manifesto: s.manifesto?.length ? s.manifesto : DEFAULT_STUDIO_CONTENT.manifesto,
    origin: {
      ...DEFAULT_STUDIO_CONTENT.origin,
      ...s.origin,
      paragraphs: s.origin?.paragraphs?.length
        ? s.origin.paragraphs
        : DEFAULT_STUDIO_CONTENT.origin.paragraphs,
    },
    philo: {
      ...DEFAULT_STUDIO_CONTENT.philo,
      ...s.philo,
      cards: s.philo?.cards?.length ? s.philo.cards : DEFAULT_STUDIO_CONTENT.philo.cards,
    },
    capabilities: {
      ...DEFAULT_STUDIO_CONTENT.capabilities,
      ...s.capabilities,
      cards: s.capabilities?.cards?.length
        ? s.capabilities.cards
        : DEFAULT_STUDIO_CONTENT.capabilities.cards,
    },
    network: {
      ...DEFAULT_STUDIO_CONTENT.network,
      ...s.network,
      stats: s.network?.stats?.length ? s.network.stats : DEFAULT_STUDIO_CONTENT.network.stats,
      regions: s.network?.regions?.length
        ? s.network.regions
        : DEFAULT_STUDIO_CONTENT.network.regions,
    },
    milestones: {
      ...DEFAULT_STUDIO_CONTENT.milestones,
      ...s.milestones,
      items: s.milestones?.items?.length
        ? s.milestones.items
        : DEFAULT_STUDIO_CONTENT.milestones.items,
    },
    cta: { ...DEFAULT_STUDIO_CONTENT.cta, ...s.cta },
  };
}

// ─── Services page ─────────────────────────────────────────────

export type ServiceModuleContent = {
  id: string;
  icon: string;
  title: string;
  oneliner: string;
  scopes: string[];
  feat: string;
  steps: string[];
};

export type ServicesContent = {
  hero: { title: string; subtitle: string; labelLeft: string; labelRight: string };
  panels: {
    label: string;
    heading: string;
    left: { title: string; subtitle: string; services: { name: string; desc: string }[] };
    right: { title: string; subtitle: string; services: { name: string; desc: string }[] };
  };
  modules: ServiceModuleContent[];
  d2p: { heading: string; stages: { num: string; name: string; desc: string }[] };
  engagement: {
    label: string;
    heading: string;
    cards: { icon: string; name: string; desc: string; included: string[]; cta: string }[];
  };
  faq: { question: string; answer: string }[];
  cta: {
    heading: string;
    button1Text: string;
    button1Link: string;
    button2Text: string;
    button2Link: string;
  };
};

const DEFAULT_SERVICE_MODULES: ServiceModuleContent[] = [
  {
    id: "svcInterior",
    icon: "⌂",
    title: "Interior",
    oneliner: "Residential and hospitality spaces designed for how you actually live.",
    scopes: ["Space planning", "Material specification", "3D visualization", "On-site coordination"],
    feat: "Courtyard residence",
    steps: ["Brief and site visit", "Space planning and concept", "3D design development", "Material sourcing and build"],
  },
  {
    id: "svcVilla",
    icon: "▣",
    title: "Villa",
    oneliner: "Complete architectural vision — structure, facade, and courtyard as one integrated expression.",
    scopes: ["Site analysis", "Concept massing", "Detail design", "Construction support"],
    feat: "Shenzhen hilltop villa",
    steps: ["Site survey and analysis", "Architectural concept", "Documentation and permits", "Construction coordination"],
  },
  {
    id: "svcLandscape",
    icon: "◊",
    title: "Landscape",
    oneliner: "Private gardens and outdoor environments that extend the living space into nature.",
    scopes: ["Terrain design", "Planting plan", "Hardscape detailing", "Lighting design"],
    feat: "Lakeside garden retreat",
    steps: ["Site and climate study", "Landscape concept", "Species and material selection", "Installation and planting"],
  },
  {
    id: "svcDiffuser",
    icon: "◎",
    title: "Diffuser",
    oneliner: "Aroma diffusers merging sculptural form with functional precision.",
    scopes: ["Form exploration", "CMF design", "Prototype development", "Production management"],
    feat: "Stone mist diffuser",
    steps: ["Brief and form sketches", "3D model and rendering", "Factory prototype", "Production sampling"],
  },
  {
    id: "svcBackpack",
    icon: "⬡",
    title: "Backpack",
    oneliner: "Performance bags designed for material integrity, ergonomic comfort, and daily utility.",
    scopes: ["Industrial design", "Pattern development", "Material testing", "Factory production"],
    feat: "Commuter daypack",
    steps: ["Brief and concept sketch", "Pattern and material R&D", "Sample and wear testing", "Bulk production + QC"],
  },
  {
    id: "svcSpeaker",
    icon: "◉",
    title: "Speaker",
    oneliner: "Audio products where acoustic engineering meets sculptural visual identity.",
    scopes: ["Acoustic design", "Housing design", "Electronics integration", "Production + assembly"],
    feat: "Walnut desk speaker",
    steps: ["Brief and acoustic spec", "Housing form development", "Working prototype", "Tooling and mass production"],
  },
];

export const DEFAULT_SERVICES_CONTENT: ServicesContent = {
  hero: {
    title: "Design + Manufacturing.\nEnd to end.",
    subtitle: "We don't just design — we make.",
    labelLeft: "Spaces",
    labelRight: "Objects",
  },
  panels: {
    label: "Our expertise",
    heading: "Two disciplines. One atelier.",
    left: {
      title: "Residential environment design",
      subtitle: "Shaping spaces where life unfolds.",
      services: [
        { name: "Interior", desc: "Residential and hospitality environments." },
        { name: "Villa", desc: "Complete architectural vision." },
        { name: "Landscape", desc: "Private gardens and outdoor spaces." },
      ],
    },
    right: {
      title: "Product design",
      subtitle: "Crafting objects that carry intention.",
      services: [
        { name: "Diffuser", desc: "Objects merging form and function." },
        { name: "Backpack", desc: "Performance bags for daily utility." },
        { name: "Speaker", desc: "Audio products with sculptural identity." },
      ],
    },
  },
  modules: DEFAULT_SERVICE_MODULES,
  d2p: {
    heading: "From design to production.",
    stages: [
      { num: "01", name: "Concept", desc: "Ideation, sketches, and design direction." },
      { num: "02", name: "Development", desc: "3D modelling, prototyping, and refinement." },
      { num: "03", name: "Sampling", desc: "Factory samples and material validation." },
      { num: "04", name: "Production", desc: "Tooling, manufacturing, and QC." },
      { num: "05", name: "Delivery", desc: "Logistics, inspection, and handover." },
    ],
  },
  engagement: {
    label: "Engagement models",
    heading: "How we work with you.",
    cards: [
      {
        icon: "◎",
        name: "Design only",
        desc: "Concept through detailed design deliverables.",
        included: ["Concept development", "3D visualisation", "Material specification"],
        cta: "Start a project",
      },
      {
        icon: "⬡",
        name: "Design + production",
        desc: "End-to-end from brief to delivered product.",
        included: ["Full design scope", "Factory sourcing", "QC and logistics"],
        cta: "Discuss your project",
      },
      {
        icon: "▣",
        name: "OEM / ODM",
        desc: "Manufacturing partnership for existing designs.",
        included: ["Factory matching", "Sampling", "Bulk production"],
        cta: "Get a quote",
      },
    ],
  },
  faq: [
    {
      question: "What is the minimum order quantity for product production?",
      answer:
        "It depends on the product category. For ceramic diffusers, MOQ is typically 200-500 units. For backpacks, 300-500 units. For speakers, 500-1000 units.",
    },
    {
      question: "How long does a typical project take from brief to delivery?",
      answer:
        "Design-only projects typically take 4-8 weeks. Full-service projects range from 12-20 weeks depending on product complexity and order volume.",
    },
    {
      question: "How do you protect our intellectual property?",
      answer:
        "We sign NDA agreements before any project begins. Our factory partners are contractually bound to IP protection.",
    },
    {
      question: "Can we visit the factories before committing?",
      answer:
        "Absolutely. We encourage factory visits and will arrange guided tours with our production partners.",
    },
    {
      question: "What are your payment terms?",
      answer:
        "Design services: 50% upfront, 50% on completion. Manufacturing: 30% deposit, 70% before shipment (T/T).",
    },
    {
      question: "Do you handle shipping and logistics?",
      answer: "Yes. We coordinate with trusted freight forwarders for both sea and air shipment.",
    },
  ],
  cta: {
    heading: "Ready to start?",
    button1Text: "View projects",
    button1Link: "/projects",
    button2Text: "Get in touch",
    button2Link: "/contact",
  },
};

export function mergeServicesContent(
  stored: Partial<ServicesContent> | null | undefined
): ServicesContent {
  const s = stored ?? {};
  return {
    hero: { ...DEFAULT_SERVICES_CONTENT.hero, ...s.hero },
    panels: {
      ...DEFAULT_SERVICES_CONTENT.panels,
      ...s.panels,
      left: { ...DEFAULT_SERVICES_CONTENT.panels.left, ...s.panels?.left },
      right: { ...DEFAULT_SERVICES_CONTENT.panels.right, ...s.panels?.right },
    },
    modules: s.modules?.length ? s.modules : DEFAULT_SERVICES_CONTENT.modules,
    d2p: {
      ...DEFAULT_SERVICES_CONTENT.d2p,
      ...s.d2p,
      stages: s.d2p?.stages?.length ? s.d2p.stages : DEFAULT_SERVICES_CONTENT.d2p.stages,
    },
    engagement: {
      ...DEFAULT_SERVICES_CONTENT.engagement,
      ...s.engagement,
      cards: s.engagement?.cards?.length
        ? s.engagement.cards
        : DEFAULT_SERVICES_CONTENT.engagement.cards,
    },
    faq: s.faq?.length ? s.faq : DEFAULT_SERVICES_CONTENT.faq,
    cta: { ...DEFAULT_SERVICES_CONTENT.cta, ...s.cta },
  };
}

// ─── Contact page ──────────────────────────────────────────────

export type ContactContent = {
  hero: { title: string; subtitle: string };
  channels: {
    intro: string;
    email: string;
    whatsapp: string;
    wechat: string;
    phone: string;
    address: string;
  };
  form: {
    title: string;
    projectTypes: string[];
    budgets: string[];
    submitText: string;
    sendingText: string;
    successTitle: string;
    successDesc: string;
    nameLabel: string;
    companyLabel: string;
    emailLabel: string;
    projectTypeLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    companyPlaceholder: string;
    emailPlaceholder: string;
    projectTypePlaceholder: string;
    messagePlaceholder: string;
  };
  availability: {
    label: string;
    heading: string;
    cards: { icon: string; title: string; detail: string; note: string }[];
  };
};

export const DEFAULT_CONTACT_CONTENT: ContactContent = {
  hero: {
    title: "Let's start with\na conversation.",
    subtitle:
      "Whether you have a project in mind or want to explore possibilities, we'd like to hear from you.",
  },
  channels: {
    intro:
      "We respond to every inquiry within 24 hours. For urgent matters, reach us directly via WhatsApp or phone.",
    email: "hello@gcatelier.com",
    whatsapp: "+86 xxx xxxx xxxx",
    wechat: "gc_atelier",
    phone: "+86 xxx xxxx xxxx",
    address: "Tianhe District, Guangzhou\nGuangdong, China 510000",
  },
  form: {
    title: "Send us a message",
    projectTypes: [
      "Interior design",
      "Villa design",
      "Landscape design",
      "Product design — Diffuser",
      "Product design — Backpack",
      "Product design — Speaker",
      "OEM / ODM production",
      "Other",
    ],
    budgets: ["Under $10K", "$10K — 50K", "$50K — 150K", "$150K+", "Not sure yet"],
    submitText: "Send inquiry",
    sendingText: "Sending...",
    successTitle: "Message sent.",
    successDesc: "We'll get back to you within 24 hours.",
    nameLabel: "Name",
    companyLabel: "Company",
    emailLabel: "Email",
    projectTypeLabel: "Project type",
    messageLabel: "Message",
    namePlaceholder: "Your name",
    companyPlaceholder: "Company name",
    emailPlaceholder: "your@email.com",
    projectTypePlaceholder: "Select a category",
    messagePlaceholder: "Tell us about your project",
  },
  availability: {
    label: "Availability",
    heading: "When we're available.",
    cards: [
      {
        icon: "◎",
        title: "Response time",
        detail: "Within 24 hours",
        note: "Monday — Friday",
      },
      {
        icon: "◇",
        title: "Consultation",
        detail: "By appointment",
        note: "In-person or video call",
      },
      {
        icon: "▣",
        title: "Studio visits",
        detail: "Guangzhou HQ",
        note: "Book ahead",
      },
    ],
  },
};

export function mergeContactContent(
  stored: Partial<ContactContent> | null | undefined
): ContactContent {
  const s = stored ?? {};
  return {
    hero: { ...DEFAULT_CONTACT_CONTENT.hero, ...s.hero },
    channels: { ...DEFAULT_CONTACT_CONTENT.channels, ...s.channels },
    form: {
      ...DEFAULT_CONTACT_CONTENT.form,
      ...s.form,
      projectTypes: s.form?.projectTypes?.length
        ? s.form.projectTypes
        : DEFAULT_CONTACT_CONTENT.form.projectTypes,
      budgets: s.form?.budgets?.length ? s.form.budgets : DEFAULT_CONTACT_CONTENT.form.budgets,
    },
    availability: {
      ...DEFAULT_CONTACT_CONTENT.availability,
      ...s.availability,
      cards: s.availability?.cards?.length
        ? s.availability.cards
        : DEFAULT_CONTACT_CONTENT.availability.cards,
    },
  };
}

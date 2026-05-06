import React, { createContext, useContext, useState, useCallback } from "react";

export type Lang = "en" | "es";

const T = {
  en: {
    header: {
      login: "Log In",
      join: "Join IFA",
    },
    layout: {
      dashboard: "My Dashboard",
      profile: "My Profile",
      admin: "Admin",
      applications: "Applications",
      signOut: "Sign out",
    },
    hero: {
      badge: "International Fighters Association",
      headline: "Fighters are not alone anymore.",
      subheadline: "Join the International Fighters Association and access protection, career support, fight opportunities and sponsor connections.",
      joinBtn: "Join IFA",
      applyBtn: "Apply Now",
    },
    fighters: {
      label: "Who We Represent",
      heading: "The Fighters",
      description: "The IFA represents professional boxers, MMA fighters, and kickboxers at every level — from rising prospects to world champions.",
      types: [
        { name: "Boxers", flag: "🥊", desc: "Pro boxing athletes seeking global bouts, sanctioned fights, and career management support." },
        { name: "MMA Fighters", flag: "🥋", desc: "Mixed martial artists competing across promotions worldwide with full IFA protection." },
        { name: "Kickboxers", flag: "🦵", desc: "K-1, Glory, and Muay Thai competitors backed by IFA's international promoter network." },
      ],
    },
    promoters: {
      label: "For Event Organizers",
      heading: "Promoters",
      description: "Access a verified roster of professional fighters from around the world. IFA vets every athlete — you get fighters who show up, perform, and elevate your event.",
      bullets: [
        "Verified fighter records and credentials",
        "Direct contact with fighter management",
        "Fast turnaround on bout agreements",
        "IFA-backed contracts and dispute resolution",
      ],
      cardTitle: "Partner with IFA",
      cardDesc: "Whether you're running a local card or an international event, IFA connects you with the right fighters at the right time.",
      cardBtn: "Apply as Fighter",
    },
    sponsors: {
      label: "Brand Visibility",
      heading: "Sponsors",
      description: "Align your brand with the world's most passionate sports fanbase. IFA sponsorship puts you ringside with fighters and fans across the globe.",
      tiers: [
        { tier: "Gold", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5", desc: "Exclusive title sponsorship with full broadcast placement, ring placement, and fighter branding rights." },
        { tier: "Silver", color: "text-zinc-300 border-zinc-300/30 bg-zinc-300/5", desc: "Co-sponsor packages with banner placement, social media features, and event program listing." },
        { tier: "Bronze", color: "text-amber-700 border-amber-700/30 bg-amber-700/5", desc: "Entry-level brand exposure through fighter kit branding, digital promotions, and newsletter placement." },
      ],
    },
    benefits: {
      label: "What You Get",
      heading: "Member Benefits",
      items: [
        { label: "Legal Protection", desc: "IFA-backed legal support for contract disputes, promoter issues, and fighter rights violations." },
        { label: "Contract Review", desc: "Every fight contract reviewed by IFA's legal team before you sign. No more bad deals." },
        { label: "Global Network", desc: "Access to promoters, gyms, and opportunities in over 40 countries through the IFA network." },
        { label: "Fighter Insurance", desc: "Comprehensive health and event insurance for every sanctioned fight under the IFA banner." },
        { label: "Media Exposure", desc: "Fighter profiles distributed to media partners, streaming platforms, and boxing journalists worldwide." },
        { label: "Community", desc: "Join a brotherhood and sisterhood of professional fighters who have your back inside and outside the ring." },
      ],
    },
    opportunities: {
      label: "Members Get First Access",
      heading: "Opportunities",
      description: "Fight bookings, brand sponsorships, and international events posted exclusively to IFA members before going public.",
      items: [
        { label: "Fight Bookings", icon: "🥊", desc: "International bouts matched to your weight class and record. Apply with one click." },
        { label: "Sponsorship Deals", icon: "💼", desc: "Brands looking to back fighters — gear deals, appearance fees, social content partnerships." },
        { label: "Live Events", icon: "🎤", desc: "Feature on major cards and IFA-sanctioned shows across Europe, the Americas, and beyond." },
      ],
      applyBtn: "Apply Now",
    },
    membership: {
      label: "Invest in Your Career",
      heading: "IFA Membership",
      subheading: "No hidden fees. Cancel anytime.",
      badge: "Full Access",
      cardTitle: "IFA Membership",
      perMonth: "/month",
      desc: "Full access to IFA membership including fighter profile, fight opportunities, sponsor opportunities and career support.",
      features: [
        "Fighter profile & IFA member card",
        "Access to fight opportunities",
        "Sponsor opportunity listings",
        "Career support & legal guidance",
        "International event access",
        "Priority support",
      ],
      applyBtn: "Apply Now",
      applyNote: "Apply first — payment is activated after IFA approval.",
      howTitle: "How It Works",
      steps: [
        { step: "01", text: "Submit your application at /apply" },
        { step: "02", text: "IFA reviews your profile (within 48h)" },
        { step: "03", text: "If approved, you receive your payment link to activate membership" },
      ],
    },
    testimonials: {
      label: "Fighter Voices",
      heading: "What Members Say",
      items: [
        { quote: "Before IFA, I was signing contracts I didn't understand. Now I have people in my corner who actually fight for me outside the ring.", name: "Marco R.", record: "18-3-0", country: "Italy 🇮🇹" },
        { quote: "IFA got me three international bouts in one year. My record went from local to world-ranked. This is the real deal.", name: "Aisha K.", record: "12-1-0", country: "Nigeria 🇳🇬" },
        { quote: "The sponsorship connections alone paid for my membership ten times over. Every serious fighter should be IFA registered.", name: "Tomás V.", record: "22-4-1", country: "Mexico 🇲🇽" },
      ],
    },
    contact: {
      label: "Get in Touch",
      heading: "Contact IFA",
      description: "Our team is available to help fighters, promoters, and sponsors worldwide.",
    },
    footer: {
      apply: "Apply",
      login: "Log In",
      copyright: `© ${new Date().getFullYear()} IFA – International Fighters Association`,
    },
    apply: {
      alreadyMember: "Already a member? Log In",
      heroTitle: "Apply as Fighter",
      heroDesc: "Join the International Fighters Association. Tell us about yourself and we'll be in touch within 48 hours.",
      sectionPersonal: "Personal Information",
      nameLabel: "Full Name / Ring Name",
      namePlaceholder: "Your name or fight name",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      countryLabel: "Country",
      countryPlaceholder: "Country of residence",
      sectionAthletic: "Athletic Profile",
      disciplineLabel: "Discipline",
      disciplinePlaceholder: "Select discipline",
      weightClassLabel: "Weight Class",
      weightClassPlaceholder: "Select weight class",
      recordLabel: "Professional Record",
      recordPlaceholder: "W-L-D (e.g. 12-2-0)",
      boxrecLabel: "BoxRec Profile Link",
      boxrecPlaceholder: "https://boxrec.com/en/proboxer/...",
      boxrecOptional: "(optional)",
      boxrecError: "Please enter a valid BoxRec profile link.",
      sectionBio: "About You",
      bioLabel: "Short Bio",
      bioPlaceholder: "Tell us about your career, goals, and why you want to join the IFA...",
      termsText: "I agree to the IFA terms and conditions. I confirm that the information provided is accurate and that I am a licensed professional or amateur combat sports athlete.",
      submitBtn: "Submit Application",
      submittingBtn: "Submitting...",
      successTitle: "Application Received",
      successMsg: "Your application has been received. IFA will review your profile and contact you if selected.",
      successNote: "In the meantime, follow us on Instagram @fighters_room for the latest news and opportunities.",
      backBtn: "Back to IFA",
    },
    dashboard: {
      heading: "IFA Member Dashboard",
      subtitle: "Manage your career and apply for IFA opportunities.",
      pendingTitle: "Profile Pending Approval",
      pendingDesc: "Your IFA profile is currently under review by our team. You can still browse opportunities, but applications may be restricted until approved.",
      paymentBanner: "Your membership is not active. Complete your €20/month membership to unlock full access.",
      completeMembership: "Complete Membership",
      tabs: {
        fights: "Fight Opportunities",
        sponsors: "Sponsorships",
        events: "Events",
        applications: "My Applications",
      },
      stats: {
        opportunities: "IFA Opportunities",
        events: "Upcoming Events",
        myApplications: "My Applications",
        approvedFights: "Approved Fights",
      },
      applyFight: "Apply for Fight",
      applySponsorship: "Apply for Sponsorship",
      applyEvent: "Apply to Fight on Card",
      applied: "Applied",
      closed: "Closed",
      noApps: "You haven't applied to anything yet.",
      paywallBtn: "Unlock full access with IFA Membership (€20/month)",
      paywallPurse: "Unlock to see purse",
      upcomingOpps: "Upcoming Opportunities",
      pastOpps: "Past Opportunities",
      noUpcoming: "No upcoming opportunities at this time. Check back soon.",
      noPast: "No past opportunities to display.",
      filters: {
        all: "All",
        sport: "Sport",
        country: "Country",
        weightClass: "Weight Class",
        status: "Status",
        purse: "Purse",
        clearFilters: "Clear filters",
      },
      status: {
        open: "Open",
        scouting: "Scouting",
        recruiting: "Recruiting",
        expected: "Expected",
        completed: "Completed",
        closed: "Closed",
        active: "Active",
      },
      details: {
        purse: "Purse",
        travel: "Travel",
        accommodation: "Accommodation",
        included: "Included",
        notIncluded: "Not included",
        level: "Level",
      },
    },
  },
  es: {
    header: {
      login: "Iniciar Sesión",
      join: "Unirme a IFA",
    },
    layout: {
      dashboard: "Mi Panel",
      profile: "Mi Perfil",
      admin: "Admin",
      applications: "Solicitudes",
      signOut: "Cerrar sesión",
    },
    hero: {
      badge: "Asociación Internacional de Fighters",
      headline: "Los luchadores ya no están solos.",
      subheadline: "Únete a la International Fighters Association y accede a protección, apoyo profesional, oportunidades de pelea y sponsors.",
      joinBtn: "Unirme a IFA",
      applyBtn: "Aplicar Ahora",
    },
    fighters: {
      label: "A Quién Representamos",
      heading: "Los Luchadores",
      description: "La IFA representa a boxeadores profesionales, luchadores de MMA y kickboxers de todos los niveles — desde promesas hasta campeones del mundo.",
      types: [
        { name: "Boxeadores", flag: "🥊", desc: "Atletas de boxeo profesional que buscan combates internacionales, peleas sancionadas y apoyo en gestión de carrera." },
        { name: "Luchadores de MMA", flag: "🥋", desc: "Luchadores de artes marciales mixtas que compiten en promociones de todo el mundo con la protección completa de IFA." },
        { name: "Kickboxers", flag: "🦵", desc: "Competidores de K-1, Glory y Muay Thai respaldados por la red internacional de promotores de IFA." },
      ],
    },
    promoters: {
      label: "Para Organizadores de Eventos",
      heading: "Promotores",
      description: "Accede a un roster verificado de luchadores profesionales de todo el mundo. IFA evalúa a cada atleta — obtienes luchadores que se presentan, rinden y elevan tu evento.",
      bullets: [
        "Récords y credenciales de luchadores verificados",
        "Contacto directo con la gestión del luchador",
        "Respuesta rápida en acuerdos de combate",
        "Contratos respaldados por IFA y resolución de disputas",
      ],
      cardTitle: "Asóciate con IFA",
      cardDesc: "Ya sea que organices una velada local o un evento internacional, IFA te conecta con los luchadores adecuados en el momento justo.",
      cardBtn: "Aplicar como Luchador",
    },
    sponsors: {
      label: "Visibilidad de Marca",
      heading: "Patrocinadores",
      description: "Alinea tu marca con la afición deportiva más apasionada del mundo. El patrocinio de IFA te coloca en primera fila con luchadores y fans de todo el planeta.",
      tiers: [
        { tier: "Oro", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5", desc: "Patrocinio titular exclusivo con presencia total en transmisiones, ring y derechos de marca del luchador." },
        { tier: "Plata", color: "text-zinc-300 border-zinc-300/30 bg-zinc-300/5", desc: "Paquetes de co-patrocinador con banners, menciones en redes sociales y listing en el programa del evento." },
        { tier: "Bronce", color: "text-amber-700 border-amber-700/30 bg-amber-700/5", desc: "Exposición de marca básica a través de indumentaria del luchador, promociones digitales y newsletter." },
      ],
    },
    benefits: {
      label: "Lo Que Obtienes",
      heading: "Beneficios de Membresía",
      items: [
        { label: "Protección Legal", desc: "Apoyo legal respaldado por IFA para disputas contractuales, problemas con promotores y violaciones de derechos del luchador." },
        { label: "Revisión de Contratos", desc: "Cada contrato de pelea revisado por el equipo legal de IFA antes de que firmes. Sin más malos acuerdos." },
        { label: "Red Global", desc: "Acceso a promotores, gimnasios y oportunidades en más de 40 países a través de la red IFA." },
        { label: "Seguro del Luchador", desc: "Seguro integral de salud y eventos para cada pelea sancionada bajo el estandarte de IFA." },
        { label: "Exposición en Medios", desc: "Perfiles de luchadores distribuidos a medios asociados, plataformas de streaming y periodistas de boxeo en todo el mundo." },
        { label: "Comunidad", desc: "Únete a una hermandad de deportistas de combate profesionales que te respaldan dentro y fuera del ring." },
      ],
    },
    opportunities: {
      label: "Los Miembros Tienen Acceso Prioritario",
      heading: "Oportunidades",
      description: "Reservas de peleas, patrocinios de marca y eventos internacionales publicados exclusivamente para miembros de IFA antes de hacerse públicos.",
      items: [
        { label: "Reservas de Peleas", icon: "🥊", desc: "Combates internacionales adaptados a tu categoría de peso y récord. Aplica con un clic." },
        { label: "Acuerdos de Patrocinio", icon: "💼", desc: "Marcas que buscan respaldar luchadores — acuerdos de material, cachés por aparición, colaboraciones de contenido." },
        { label: "Eventos en Vivo", icon: "🎤", desc: "Participa en veladas importantes y shows sancionados por IFA en Europa, América y más allá." },
      ],
      applyBtn: "Aplicar",
    },
    membership: {
      label: "Invierte en Tu Carrera",
      heading: "Membresía IFA",
      subheading: "Sin costes ocultos. Cancela cuando quieras.",
      badge: "Acceso Completo",
      cardTitle: "Membresía IFA",
      perMonth: "/mes",
      desc: "Acceso completo a la membresía IFA incluyendo perfil de luchador, oportunidades de pelea, oportunidades con sponsors y apoyo profesional.",
      features: [
        "Perfil de luchador y carnet de miembro IFA",
        "Acceso a oportunidades de pelea",
        "Listados de oportunidades con patrocinadores",
        "Apoyo profesional y orientación legal",
        "Acceso a eventos internacionales",
        "Soporte prioritario",
      ],
      applyBtn: "Aplicar Ahora",
      applyNote: "Aplica primero — el pago se activa tras la aprobación de IFA.",
      howTitle: "Cómo Funciona",
      steps: [
        { step: "01", text: "Envía tu solicitud en /apply" },
        { step: "02", text: "IFA revisa tu perfil (máx. 48h)" },
        { step: "03", text: "Si eres seleccionado, recibes tu enlace de pago para activar la membresía" },
      ],
    },
    testimonials: {
      label: "Voces de Luchadores",
      heading: "Lo Que Dicen los Miembros",
      items: [
        { quote: "Antes de IFA, firmaba contratos que no entendía. Ahora tengo personas en mi esquina que realmente luchan por mí fuera del ring.", name: "Marco R.", record: "18-3-0", country: "Italia 🇮🇹" },
        { quote: "IFA me consiguió tres combates internacionales en un año. Mi récord pasó de local a clasificado mundial. Esto es lo real.", name: "Aisha K.", record: "12-1-0", country: "Nigeria 🇳🇬" },
        { quote: "Las conexiones con patrocinadores solas pagaron mi membresía diez veces. Todo luchador serio debería estar registrado en IFA.", name: "Tomás V.", record: "22-4-1", country: "Mexico 🇲🇽" },
      ],
    },
    contact: {
      label: "Contáctanos",
      heading: "Contacta con IFA",
      description: "Nuestro equipo está disponible para ayudar a luchadores, promotores y patrocinadores de todo el mundo.",
    },
    footer: {
      apply: "Aplicar",
      login: "Iniciar Sesión",
      copyright: `© ${new Date().getFullYear()} IFA – International Fighters Association`,
    },
    apply: {
      alreadyMember: "¿Ya eres miembro? Iniciar Sesión",
      heroTitle: "Aplica como Luchador",
      heroDesc: "Únete a la International Fighters Association. Cuéntanos sobre ti y nos pondremos en contacto en menos de 48 horas.",
      sectionPersonal: "Información Personal",
      nameLabel: "Nombre Completo / Nombre de Pelea",
      namePlaceholder: "Tu nombre o nombre de pelea",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      countryLabel: "País",
      countryPlaceholder: "País de residencia",
      sectionAthletic: "Perfil Atlético",
      disciplineLabel: "Disciplina",
      disciplinePlaceholder: "Selecciona disciplina",
      weightClassLabel: "Categoría de Peso",
      weightClassPlaceholder: "Selecciona categoría",
      recordLabel: "Récord Profesional",
      recordPlaceholder: "V-D-E (ej. 12-2-0)",
      boxrecLabel: "Enlace Perfil BoxRec",
      boxrecPlaceholder: "https://boxrec.com/en/proboxer/...",
      boxrecOptional: "(opcional)",
      boxrecError: "Por favor introduce un enlace válido de BoxRec.",
      sectionBio: "Sobre Ti",
      bioLabel: "Breve Biografía",
      bioPlaceholder: "Cuéntanos sobre tu carrera, objetivos y por qué quieres unirte a IFA...",
      termsText: "Acepto los términos y condiciones de IFA. Confirmo que la información proporcionada es verídica y que soy un atleta profesional o amateur de deportes de combate con licencia.",
      submitBtn: "Enviar Solicitud",
      submittingBtn: "Enviando...",
      successTitle: "Solicitud Recibida",
      successMsg: "Hemos recibido tu solicitud. IFA revisará tu perfil y te contactará si eres seleccionado.",
      successNote: "Mientras tanto, síguenos en Instagram @fighters_room para las últimas noticias y oportunidades.",
      backBtn: "Volver a IFA",
    },
    dashboard: {
      heading: "Panel de Miembro IFA",
      subtitle: "Gestiona tu carrera y aplica a oportunidades de IFA.",
      pendingTitle: "Perfil Pendiente de Aprobación",
      pendingDesc: "Tu perfil de IFA está siendo revisado por nuestro equipo. Puedes explorar oportunidades, pero las solicitudes pueden estar restringidas hasta ser aprobado.",
      paymentBanner: "Tu membresía no está activa. Completa tu membresía de €20/mes para desbloquear acceso completo.",
      completeMembership: "Completar Membresía",
      tabs: {
        fights: "Oportunidades de Pelea",
        sponsors: "Patrocinios",
        events: "Eventos",
        applications: "Mis Solicitudes",
      },
      stats: {
        opportunities: "Oportunidades IFA",
        events: "Próximos Eventos",
        myApplications: "Mis Solicitudes",
        approvedFights: "Peleas Aprobadas",
      },
      applyFight: "Aplicar a Pelea",
      applySponsorship: "Aplicar a Patrocinio",
      applyEvent: "Aplicar para Combatir",
      applied: "Aplicado",
      closed: "Cerrado",
      noApps: "Aún no has aplicado a nada.",
      paywallBtn: "Desbloquea acceso completo con Membresía IFA (€20/mes)",
      paywallPurse: "Desbloquea para ver la bolsa",
      upcomingOpps: "Próximas Oportunidades",
      pastOpps: "Oportunidades Anteriores",
      noUpcoming: "No hay próximas oportunidades en este momento. Vuelve pronto.",
      noPast: "No hay oportunidades anteriores para mostrar.",
      filters: {
        all: "Todas",
        sport: "Deporte",
        country: "País",
        weightClass: "Categoría de Peso",
        status: "Estado",
        purse: "Bolsa",
        clearFilters: "Limpiar filtros",
      },
      status: {
        open: "Abierta",
        scouting: "Scouting",
        recruiting: "Buscando luchadores",
        expected: "Prevista",
        completed: "Completada",
        closed: "Cerrada",
        active: "Activa",
      },
      details: {
        purse: "Bolsa",
        travel: "Viaje",
        accommodation: "Alojamiento",
        included: "Incluido",
        notIncluded: "No incluido",
        level: "Nivel",
      },
    },
  },
};

export type Translations = typeof T.en;

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({
  lang: "en",
  setLang: () => {},
  t: T.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("ifa-lang");
      return saved === "es" ? "es" : "en";
    } catch {
      return "en";
    }
  });

  const setLang = useCallback((l: Lang) => {
    try { localStorage.setItem("ifa-lang", l); } catch {}
    setLangState(l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className={`flex items-center gap-1 font-heading font-bold text-xs uppercase tracking-wider ${className}`}>
      <button
        onClick={() => setLang("en")}
        className={`transition-colors ${lang === "en" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-muted-foreground/40 select-none">|</span>
      <button
        onClick={() => setLang("es")}
        className={`transition-colors ${lang === "es" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  );
}

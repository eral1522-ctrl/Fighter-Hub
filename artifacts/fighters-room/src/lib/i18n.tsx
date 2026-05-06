import React, { createContext, useContext, useState, useCallback } from "react";

export type Lang = "en" | "es";

const T = {
  en: {
    header: {
      login: "Log In",
      join: "Join IFA",
      association: "Association",
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
      subheadline: "IFA gives fighters structure, visibility and access. Join the International Fighters Association to unlock fight opportunities, sponsors, career support and a global combat sports network.",
      joinBtn: "Apply to Join IFA",
      viewBenefitsBtn: "View Member Benefits",
    },
    whyJoin: {
      label: "Why Join IFA?",
      heading: "Why Join IFA?",
      benefits: [
        "Access international fight opportunities",
        "Unlock sponsor and brand opportunities",
        "Build a professional fighter profile",
        "Receive career support and guidance",
        "Improve contract awareness",
        "Gain visibility with promoters and matchmakers",
        "Join a global fighter network",
        "Protect your professional position",
      ],
    },
    builtFor: {
      label: "Built for the Modern Fighter",
      heading: "Built for the modern fighter",
      text: "The new generation of combat sports is not only about fighting. It is about protection, visibility, sponsors, media, contracts and international opportunities. IFA is built for fighters who want to manage their careers with a professional structure.",
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
        { step: "03", text: "If approved, activate your €20/month membership" },
      ],
    },
    testimonials: {
      label: "What fighters need today",
      heading: "What fighters need today",
      items: [
        { quote: "Fighters need more than fights. They need structure, protection and access." },
        { quote: "Visibility, sponsors and career guidance can change the direction of a fighter's career." },
        { quote: "The right opportunity at the right time can define everything." },
      ],
    },
    liveOpps: {
      label: "Member Opportunities",
      heading: "Member Opportunities",
      subheading: "A selection of active fight opportunities available to IFA members. Join IFA to unlock full access.",
      ctaApply: "Unlock full access with IFA Membership",
      ctaUnlock: "Activate Membership to Access Opportunities",
      ctaDashboard: "View All Opportunities",
      statusOpen: "Open",
      statusScouting: "Scouting",
      statusRecruiting: "Recruiting",
      statusExpected: "Expected",
      statusActive: "Active",
      sport: "Sport",
      weightClass: "Weight Class",
      country: "Country",
      city: "City",
      purseHidden: "Members only",
      noOpps: "Opportunities loading…",
    },
    contact: {
      label: "Get in Touch",
      heading: "Contact IFA",
      description: "Our team is available to help fighters, promoters, and sponsors worldwide.",
    },
    footer: {
      apply: "Apply",
      login: "Log In",
      association: "Association",
      statutes: "Statutes",
      presidentMessage: "President Message",
      contact: "Contact",
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
      successMsg: "Your registration has been received and your profile has been accepted into the IFA onboarding process.",
      successMsg2: "To become an official IFA member and unlock full access to fight opportunities, sponsor opportunities, career support and member services, you must activate your €20/month membership.",
      successMsg3: "Our team will contact you with the next steps.",
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
      appSuccess: "Application submitted successfully.",
      appFailed: "Application failed",
      noProfile: "Please complete your fighter profile before applying.",
      notPaidApply: "Activate your IFA Membership to apply for opportunities.",
      alreadyApplied: "You have already applied to this opportunity.",
      appErrorFallback: "An unexpected error occurred. Please try again.",
    },
    statutes: {
      label: "Official Documents",
      title: "IFA Statutes",
      note: "These statutes are a working framework and may be updated as the association develops.",
      sections: [
        {
          title: "1. Name and Purpose",
          text: "The International Fighters Association (IFA) is a global independent membership association dedicated to representing and supporting professional and amateur combat sports athletes worldwide. IFA operates as a neutral body serving fighters across boxing, MMA, kickboxing, Muay Thai, and all related disciplines.",
        },
        {
          title: "2. Mission",
          text: "IFA's mission is to provide combat sports athletes with the structure, visibility, and resources they need to build sustainable and protected professional careers. We believe every fighter deserves access to legitimate opportunities, fair contracts, career guidance, and an international network that works in their interest.",
        },
        {
          title: "3. Membership",
          text: "IFA membership is open to any licensed or active professional or amateur combat sports athlete. Members must apply through the official IFA registration process and maintain an active membership subscription to access the full range of association services and opportunities.",
        },
        {
          title: "4. Rights and Responsibilities",
          text: "All IFA members have the right to access fight opportunities, sponsor connections, career support, and guidance provided by the association. Members are responsible for maintaining accurate profile information, conducting themselves professionally, and complying with IFA's code of conduct and ethical standards.",
        },
        {
          title: "5. Governance",
          text: "IFA is led by its President and a working council responsible for strategic direction, member services, and operational management. All governance decisions are made with the long-term welfare and interests of IFA members as the primary consideration.",
        },
        {
          title: "6. Ethics and Integrity",
          text: "IFA members are expected to maintain the highest standards of professionalism and integrity. IFA does not tolerate dishonest conduct, discrimination, or behavior that harms fellow members or the reputation of the association. Any breach of ethical standards may result in suspension or removal of membership.",
        },
        {
          title: "7. Fighter Protection",
          text: "IFA is committed to protecting the rights of all members. This includes fair representation in contract discussions, support in disputes with promoters or management, access to legal guidance, and advocacy for safe and fair working conditions across professional combat sports.",
        },
        {
          title: "8. Opportunities and Services",
          text: "IFA provides members with access to fight opportunities, sponsorship listings, event participation, professional profiles distributed to the combat sports industry, career support, and guidance on contracts and career management.",
        },
        {
          title: "9. Amendments",
          text: "These statutes represent the current working framework of IFA and may be revised as the association grows. Members will be informed of significant changes through official association communications.",
        },
      ],
    },
    association: {
      label: "About IFA",
      title: "What IFA Does",
      intro: "IFA was built to solve a real problem: fighters have always been the most important people in combat sports, but also the most underrepresented. IFA exists to change that.",
      sections: [
        {
          title: "Fighter Protection",
          text: "IFA works to ensure every member has access to legal guidance and fair representation. We stand with fighters in contract disputes, promoter negotiations, and any situation where their professional rights are at stake. No fighter should face these challenges alone.",
        },
        {
          title: "Access to Opportunities",
          text: "IFA connects members with fight opportunities, international bouts, and competitive events across the world. Members receive priority access to listings before they go public, ensuring IFA fighters are always first in line for the best opportunities.",
        },
        {
          title: "Sponsor Visibility",
          text: "IFA promotes members to a network of brands and sponsors looking to partner with combat sports athletes. From gear deals to appearance fees and social content partnerships, IFA opens sponsorship doors that fighters could not access on their own.",
        },
        {
          title: "Career Support",
          text: "IFA provides career guidance, milestone advice, and direct support to members navigating the professional combat sports landscape. Our team helps fighters make informed decisions at every stage of their career.",
        },
        {
          title: "Contract Awareness",
          text: "Understanding contracts is critical for any professional fighter. IFA educates members on standard terms, red flags, and best practices so they can approach every agreement with confidence and protect their interests.",
        },
        {
          title: "International Network",
          text: "IFA connects fighters with promoters, gyms, managers, and fellow athletes across the world. Being part of IFA means being part of a global community that opens international doors and creates real career opportunities.",
        },
        {
          title: "Professional Profile",
          text: "Every IFA member receives a professional digital profile shared with the combat sports industry — promoters, matchmakers, sponsors, and media. Your profile is your calling card and your visibility tool.",
        },
        {
          title: "Member Services",
          text: "IFA members receive priority support, access to the member portal, fight and sponsor opportunity listings, event participation rights, and a direct line to IFA's operations team whenever they need it.",
        },
      ],
      cta: "Apply to Join IFA",
    },
    presidentMessage: {
      label: "Leadership",
      title: "Message from the President",
      name: "Erik Alonso",
      role: "President, International Fighters Association",
      photoLabel: "Photo of Erik Alonso",
      photoPlaceholder: "Photo coming soon",
      placeholder: "Message from Erik Alonso, President of IFA, coming soon.",
      signaturePlaceholder: "Signature coming soon",
    },
  },
  es: {
    header: {
      login: "Iniciar Sesión",
      join: "Unirme a IFA",
      association: "Asociación",
    },
    layout: {
      dashboard: "Mi Panel",
      profile: "Mi Perfil",
      admin: "Admin",
      applications: "Solicitudes",
      signOut: "Cerrar sesión",
    },
    hero: {
      badge: "Asociación Internacional de Luchadores",
      headline: "Los luchadores ya no están solos.",
      subheadline: "IFA da estructura, visibilidad y acceso a los luchadores. Únete a la International Fighters Association para desbloquear oportunidades de pelea, sponsors, apoyo profesional y una red global de deportes de combate.",
      joinBtn: "Aplicar para unirme a IFA",
      viewBenefitsBtn: "Ver beneficios",
    },
    whyJoin: {
      label: "¿Por qué unirte a IFA?",
      heading: "¿Por qué unirte a IFA?",
      benefits: [
        "Accede a oportunidades internacionales de pelea",
        "Desbloquea oportunidades con sponsors y marcas",
        "Crea un perfil profesional de luchador",
        "Recibe apoyo y orientación profesional",
        "Mejora tu conocimiento contractual",
        "Gana visibilidad ante promotores y matchmakers",
        "Únete a una red global de luchadores",
        "Protege tu posición profesional",
      ],
    },
    builtFor: {
      label: "Creada para el Luchador Moderno",
      heading: "Creada para el luchador moderno",
      text: "La nueva generación de los deportes de combate no trata solo de pelear. Trata de protección, visibilidad, sponsors, medios, contratos y oportunidades internacionales. IFA está creada para luchadores que quieren gestionar su carrera con una estructura profesional.",
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
        { step: "03", text: "Si eres seleccionado, activa tu membresía de €20/mes" },
      ],
    },
    testimonials: {
      label: "Lo que necesitan los luchadores hoy",
      heading: "Lo que necesitan los luchadores hoy",
      items: [
        { quote: "Los luchadores necesitan más que peleas. Necesitan estructura, protección y acceso." },
        { quote: "La visibilidad, los sponsors y la orientación profesional pueden cambiar la dirección de la carrera de un luchador." },
        { quote: "La oportunidad correcta en el momento correcto puede definirlo todo." },
      ],
    },
    liveOpps: {
      label: "Oportunidades para Miembros",
      heading: "Oportunidades para miembros",
      subheading: "Una selección de oportunidades activas disponibles para miembros de IFA. Únete para desbloquear acceso completo.",
      ctaApply: "Desbloquea acceso completo con la Membresía IFA",
      ctaUnlock: "Activa tu Membresía para Acceder a Oportunidades",
      ctaDashboard: "Ver Todas las Oportunidades",
      statusOpen: "Abierta",
      statusScouting: "Scouting",
      statusRecruiting: "Buscando luchadores",
      statusExpected: "Prevista",
      statusActive: "Activa",
      sport: "Deporte",
      weightClass: "Categoría de Peso",
      country: "País",
      city: "Ciudad",
      purseHidden: "Solo miembros",
      noOpps: "Cargando oportunidades…",
    },
    contact: {
      label: "Contáctanos",
      heading: "Contacta con IFA",
      description: "Nuestro equipo está disponible para ayudar a luchadores, promotores y patrocinadores de todo el mundo.",
    },
    footer: {
      apply: "Aplicar",
      login: "Iniciar Sesión",
      association: "Asociación",
      statutes: "Estatutos",
      presidentMessage: "Mensaje del Presidente",
      contact: "Contacto",
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
      successMsg: "Hemos recibido tu registro y tu perfil ha sido aceptado dentro del proceso de incorporación de IFA.",
      successMsg2: "Para convertirte en miembro oficial de IFA y desbloquear acceso completo a oportunidades de pelea, sponsors, apoyo profesional y servicios para miembros, debes activar tu membresía de €20/mes.",
      successMsg3: "Nuestro equipo te contactará con los próximos pasos.",
      successNote: "Mientras tanto, síguenos en Instagram @fighters_room para ver las últimas noticias y oportunidades.",
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
      appSuccess: "Solicitud enviada correctamente.",
      appFailed: "Solicitud fallida",
      noProfile: "Completa tu perfil de luchador antes de aplicar.",
      notPaidApply: "Activa tu Membresía IFA para aplicar a oportunidades.",
      alreadyApplied: "Ya has aplicado a esta oportunidad.",
      appErrorFallback: "Ocurrió un error inesperado. Por favor inténtalo de nuevo.",
    },
    statutes: {
      label: "Documentos Oficiales",
      title: "Estatutos de IFA",
      note: "Estos estatutos son un marco de trabajo y podrán actualizarse a medida que la asociación se desarrolle.",
      sections: [
        {
          title: "1. Nombre y finalidad",
          text: "La International Fighters Association (IFA) es una asociación de membresía global e independiente dedicada a representar y apoyar a atletas profesionales y amateur de deportes de combate en todo el mundo. IFA opera como un organismo neutral al servicio de luchadores en boxeo, MMA, kickboxing, Muay Thai y todas las disciplinas relacionadas.",
        },
        {
          title: "2. Misión",
          text: "La misión de IFA es proporcionar a los atletas de deportes de combate la estructura, visibilidad y recursos que necesitan para construir carreras profesionales sostenibles y protegidas. Creemos que todo luchador merece acceso a oportunidades legítimas, contratos justos, orientación profesional y una red internacional que trabaje en su interés.",
        },
        {
          title: "3. Membresía",
          text: "La membresía de IFA está abierta a cualquier atleta de deportes de combate profesional o amateur con licencia activa. Los miembros deben solicitar el ingreso a través del proceso oficial de registro de IFA y mantener una suscripción de membresía activa para acceder a todos los servicios y oportunidades de la asociación.",
        },
        {
          title: "4. Derechos y responsabilidades",
          text: "Todos los miembros de IFA tienen derecho a acceder a oportunidades de pelea, conexiones con sponsors, apoyo profesional y orientación proporcionada por la asociación. Los miembros son responsables de mantener información de perfil precisa, conducirse profesionalmente y cumplir con el código de conducta y los estándares éticos de IFA.",
        },
        {
          title: "5. Gobierno",
          text: "IFA está liderada por su Presidente y un consejo de trabajo responsable de la dirección estratégica, los servicios a miembros y la gestión operativa. Todas las decisiones de gobierno se toman teniendo como prioridad el bienestar e intereses a largo plazo de los miembros de IFA.",
        },
        {
          title: "6. Ética e integridad",
          text: "Se espera que los miembros de IFA mantengan los más altos estándares de profesionalismo e integridad. IFA no tolera conductas deshonestas, discriminación ni comportamientos que dañen a otros miembros o la reputación de la asociación. Cualquier incumplimiento de los estándares éticos puede resultar en la suspensión o eliminación de la membresía.",
        },
        {
          title: "7. Protección del luchador",
          text: "IFA está comprometida con la protección de los derechos de todos sus miembros. Esto incluye representación justa en negociaciones contractuales, apoyo en disputas con promotores o agentes, acceso a orientación legal y defensa de condiciones de trabajo seguras y justas en los deportes de combate profesionales.",
        },
        {
          title: "8. Oportunidades y servicios",
          text: "IFA proporciona a sus miembros acceso a oportunidades de pelea, listados de patrocinio, participación en eventos, perfiles profesionales distribuidos en la industria de los deportes de combate, apoyo profesional y orientación sobre contratos y gestión de carrera.",
        },
        {
          title: "9. Modificaciones",
          text: "Estos estatutos representan el marco de trabajo actual de IFA y podrán revisarse a medida que la asociación crezca. Los miembros serán informados de cambios significativos a través de las comunicaciones oficiales de la asociación.",
        },
      ],
    },
    association: {
      label: "Sobre IFA",
      title: "Qué hace IFA",
      intro: "IFA fue creada para resolver un problema real: los luchadores siempre han sido las personas más importantes en los deportes de combate, pero también las más infrarrepresentadas. IFA existe para cambiar eso.",
      sections: [
        {
          title: "Protección del luchador",
          text: "IFA trabaja para garantizar que cada miembro tenga acceso a orientación legal y representación justa. Apoyamos a los luchadores en disputas contractuales, negociaciones con promotores y cualquier situación en la que sus derechos profesionales estén en juego. Ningún luchador debería enfrentar estos desafíos solo.",
        },
        {
          title: "Acceso a oportunidades",
          text: "IFA conecta a los miembros con oportunidades de pelea, combates internacionales y eventos competitivos en todo el mundo. Los miembros reciben acceso prioritario a los listados antes de que sean públicos, asegurando que los luchadores de IFA siempre estén en primera fila para las mejores oportunidades.",
        },
        {
          title: "Visibilidad ante sponsors",
          text: "IFA promociona a sus miembros ante una red de marcas y sponsors que buscan asociarse con atletas de deportes de combate. Desde acuerdos de material hasta cachés por aparición y colaboraciones de contenido en redes sociales, IFA abre puertas de patrocinio que los luchadores no podrían acceder por sí solos.",
        },
        {
          title: "Apoyo profesional",
          text: "IFA proporciona orientación profesional, consejos en momentos clave y apoyo directo a los miembros que navegan el panorama profesional de los deportes de combate. Nuestro equipo ayuda a los luchadores a tomar decisiones informadas en cada etapa de su carrera.",
        },
        {
          title: "Conocimiento contractual",
          text: "Entender los contratos es fundamental para cualquier luchador profesional. IFA educa a sus miembros sobre términos estándar, señales de alerta y mejores prácticas para que puedan abordar cada acuerdo con confianza y proteger sus intereses.",
        },
        {
          title: "Red internacional",
          text: "IFA conecta a los luchadores con promotores, gimnasios, agentes y compañeros atletas de todo el mundo. Ser parte de IFA significa ser parte de una comunidad global que abre puertas internacionales y crea oportunidades reales de carrera.",
        },
        {
          title: "Perfil profesional",
          text: "Cada miembro de IFA recibe un perfil digital profesional compartido con la industria de los deportes de combate — promotores, matchmakers, sponsors y medios de comunicación. Tu perfil es tu tarjeta de presentación y tu herramienta de visibilidad.",
        },
        {
          title: "Servicios para miembros",
          text: "Los miembros de IFA reciben soporte prioritario, acceso al portal de miembros, listados de oportunidades de pelea y patrocinio, derechos de participación en eventos y una línea directa con el equipo de operaciones de IFA cuando lo necesiten.",
        },
      ],
      cta: "Aplicar para unirme a IFA",
    },
    presidentMessage: {
      label: "Liderazgo",
      title: "Mensaje del Presidente",
      name: "Erik Alonso",
      role: "Presidente, International Fighters Association",
      photoLabel: "Foto de Erik Alonso",
      photoPlaceholder: "Foto próximamente",
      placeholder: "Mensaje de Erik Alonso, Presidente de IFA, próximamente.",
      signaturePlaceholder: "Firma próximamente",
    },
  },
};

export type TranslationShape = typeof T.en;

const LanguageContext = createContext<{
  lang: Lang;
  t: TranslationShape;
  setLang: (l: Lang) => void;
}>({ lang: "en", t: T.en, setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = T[lang] as TranslationShape;
  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LangSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 text-xs font-heading uppercase tracking-widest">
      <button
        onClick={() => setLang("en")}
        className={lang === "en" ? "text-primary font-bold" : "text-muted-foreground hover:text-white transition-colors"}
      >
        EN
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => setLang("es")}
        className={lang === "es" ? "text-primary font-bold" : "text-muted-foreground hover:text-white transition-colors"}
      >
        ES
      </button>
    </div>
  );
}

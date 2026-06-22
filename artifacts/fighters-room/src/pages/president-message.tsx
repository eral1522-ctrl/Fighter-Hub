import { PublicPageLayout } from "@/components/public-page-layout";
import { useLanguage } from "@/lib/i18n";

const PHOTO_URL = "https://raw.githubusercontent.com/eral1522-ctrl/Fighter-Hub/main/attached_assets/president-erik-alonso.jpg";

const MESSAGE = {
  en: [
    "Combat sports have always been about more than what happens inside the ring or the cage. They are about sacrifice, discipline, dedication — and above all, the relentless pursuit of excellence. Yet for too long, the fighters who embody these values have operated without the professional structure, protection and visibility they deserve.",
    "That is why IFA exists. We created the International Fighters Association to give professional combat sports athletes a global home — a place where their careers are supported, their rights are protected, and their talent is connected to the opportunities it deserves on an international stage.",
    "Since our founding, we have built an association rooted in transparency and accountability. We work directly with fighters, promoters, gyms and governing bodies to ensure that every IFA member has access to the tools, networks and platforms that can genuinely move their career forward.",
    "Whether you are a seasoned professional seeking new horizons or an emerging talent ready to make your mark, IFA is here to help you build the career you have earned. Join us, and let's shape the future of combat sports together.",
  ],
  es: [
    "Los deportes de combate siempre han sido mucho más que lo que ocurre dentro del ring o la jaula. Son sacrificio, disciplina, dedicación — y, sobre todo, la búsqueda incansable de la excelencia. Sin embargo, durante demasiado tiempo, los luchadores que encarnan estos valores han operado sin la estructura profesional, la protección y la visibilidad que merecen.",
    "Por eso existe IFA. Creamos la Asociación Internacional de Luchadores para dar a los atletas profesionales de los deportes de combate un hogar global — un lugar donde sus carreras cuentan con apoyo, sus derechos están protegidos y su talento está conectado con las oportunidades que merece en el escenario internacional.",
    "Desde nuestra fundación, hemos construido una asociación basada en la transparencia y la responsabilidad. Trabajamos directamente con luchadores, promotores, gimnasios y organismos rectores para garantizar que cada miembro de IFA tenga acceso a las herramientas, redes y plataformas que pueden impulsar genuinamente su carrera.",
    "Seas un profesional experimentado que busca nuevos horizontes o un talento emergente listo para dejar tu huella, IFA está aquí para ayudarte a construir la carrera que te has ganado. Únete a nosotros y construyamos juntos el futuro de los deportes de combate.",
  ],
};

export default function PresidentMessagePage() {
  const { t, lang } = useLanguage();
  const p = t.presidentMessage;
  const paragraphs = MESSAGE[lang];

  return (
    <PublicPageLayout>
      {/* Page Hero */}
      <section className="py-20 md:py-32 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 max-w-4xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3 font-heading">{p.label}</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{p.title}</h1>
          <div className="h-1 w-20 bg-primary" />
        </div>
      </section>

      {/* President profile + message */}
      <section className="py-16 md:py-28 border-b border-border">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

            {/* Photo + ID */}
            <div className="flex flex-col items-center md:items-start gap-6">
              {/* Photo */}
              <div className="w-48 h-48 md:w-full md:h-72 rounded-md overflow-hidden border border-border">
                <img
                  src={PHOTO_URL}
                  alt={p.photoLabel}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Name + Role */}
              <div className="text-center md:text-left">
                <div className="font-heading text-2xl uppercase tracking-wide text-foreground mb-1">{p.name}</div>
                <div className="text-xs text-primary uppercase tracking-widest font-heading">{p.role}</div>
              </div>

              {/* Signature */}
              <div className="w-full bg-zinc-950 border border-border/50 rounded-md px-5 py-4">
                <span className="font-heading text-xl text-foreground/80 italic tracking-wide">Erik Alonso</span>
              </div>
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <div className="relative bg-zinc-950 border border-border rounded-md p-8 md:p-10">
                <div className="absolute top-6 left-8">
                  <div className="font-heading text-7xl text-primary/10 leading-none select-none">"</div>
                </div>
                <div className="pt-8 space-y-5">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-muted-foreground text-base leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <div className="font-heading text-base uppercase tracking-wide">{p.name}</div>
                    <div className="text-xs text-primary uppercase tracking-widest font-heading mt-1">{p.role}</div>
                  </div>
                  <div className="text-xs text-muted-foreground/40 uppercase tracking-widest font-heading">IFA</div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-6 bg-primary/5 border border-primary/10 rounded-md px-5 py-3">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-heading">
                  International Fighters Association — {new Date().getFullYear()}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

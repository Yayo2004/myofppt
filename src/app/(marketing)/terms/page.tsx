import { FileText, CheckCircle, AlertCircle, Globe, BookOpen, Ban, Copyright, ShieldAlert, RefreshCw, Mail } from "lucide-react";

export const metadata = {
  title: "Conditions Générales d'Utilisation — CGU myofppt",
  description: "Consultez les conditions générales d'utilisation de myofppt : acceptation, accès, contenus, propriété intellectuelle, limitation de responsabilité.",
};

const sections = [
  {
    number: "1",
    icon: FileText,
    title: "Objet",
    gradient: "from-purple-500 to-purple-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Le présent site, myofppt, est une initiative indépendante ayant pour objectif de faciliter l&apos;accès des stagiaires de l&apos;OFPPT à des ressources pédagogiques (cours, exercices, EFF, EFM, examens de fin de formation, etc.) afin de les accompagner dans leur parcours de formation. Ce site n&apos;est pas un site officiel de l&apos;OFPPT et n&apos;a aucun lien institutionnel avec cet organisme.
      </p>
    ),
  },
  {
    number: "2",
    icon: CheckCircle,
    title: "Acceptation des conditions",
    gradient: "from-emerald-500 to-emerald-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        En accédant et en utilisant ce site, l&apos;utilisateur reconnaît avoir lu, compris et accepté sans réserve les présentes conditions générales d&apos;utilisation. Si l&apos;utilisateur n&apos;accepte pas ces conditions, il doit cesser d&apos;utiliser le site.
      </p>
    ),
  },
  {
    number: "3",
    icon: Globe,
    title: "Accès au site",
    gradient: "from-blue-500 to-blue-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Le site est accessible gratuitement à tout utilisateur disposant d&apos;un accès Internet. Tous les frais liés à l&apos;accès (matériel, connexion, etc.) sont à la charge de l&apos;utilisateur. myofppt s&apos;efforce d&apos;assurer un accès continu au site, mais ne garantit pas une disponibilité ininterrompue et décline toute responsabilité en cas d&apos;interruption, de maintenance ou de panne technique.
      </p>
    ),
  },
  {
    number: "4",
    icon: BookOpen,
    title: "Nature des contenus proposés",
    gradient: "from-pink-500 to-pink-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Les documents mis à disposition sur ce site (cours, fiches, sujets d&apos;examens, EFF, EFM, etc.) sont partagés à titre informatif et pédagogique, dans un but d&apos;entraide entre stagiaires. myofppt n&apos;est pas l&apos;auteur de ces documents et ne revendique aucun droit de propriété intellectuelle sur leur contenu. Les droits d&apos;auteur restent la propriété de leurs auteurs respectifs (OFPPT, formateurs, établissements, etc.).
      </p>
    ),
  },
  {
    number: "5",
    icon: AlertCircle,
    title: "Signalement de contenu",
    gradient: "from-orange-500 to-orange-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Toute personne ou entité estimant que des droits d&apos;auteur ou de propriété intellectuelle sont violés par un contenu présent sur le site peut contacter{" "}
        <a href="mailto:myofppt.contact@gmail.com" className="font-medium text-purple-600 underline hover:text-purple-700">myofppt.contact@gmail.com</a>{" "}
        afin d&apos;en demander le retrait. La demande sera traitée dans les meilleurs délais.
      </p>
    ),
  },
  {
    number: "6",
    icon: Ban,
    title: "Utilisation autorisée",
    gradient: "from-red-500 to-red-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        L&apos;utilisateur s&apos;engage à utiliser les documents disponibles uniquement à des fins personnelles et pédagogiques, et non à des fins commerciales. Toute reproduction, diffusion ou revente des contenus à des fins commerciales est interdite.
      </p>
    ),
  },
  {
    number: "7",
    icon: ShieldAlert,
    title: "Comportement de l'utilisateur",
    gradient: "from-purple-600 to-pink-600",
    content: (
      <div className="text-gray-600 leading-relaxed">
        <p className="mb-3">L&apos;utilisateur s&apos;engage à ne pas :</p>
        <ul className="space-y-2">
          {[
            "publier ou partager de contenu illégal, diffamatoire, ou portant atteinte aux droits d'un tiers",
            "utiliser le site à des fins frauduleuses ou nuisibles",
            "tenter de nuire au bon fonctionnement technique du site",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    number: "8",
    icon: Copyright,
    title: "Propriété intellectuelle du site",
    gradient: "from-purple-500 to-purple-700",
    content: (
      <p className="text-gray-600 leading-relaxed">
        La structure, le design, les textes originaux, les logos et éléments graphiques du site myofppt sont la propriété de son fondateur, sauf mention contraire. Toute reproduction de ces éléments sans autorisation est interdite.
      </p>
    ),
  },
  {
    number: "9",
    icon: AlertCircle,
    title: "Limitation de responsabilité",
    gradient: "from-amber-500 to-amber-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        myofppt ne saurait être tenu responsable de l&apos;exactitude, de l&apos;exhaustivité ou de l&apos;actualité des documents partagés, ni des conséquences directes ou indirectes liées à leur utilisation par l&apos;utilisateur.
      </p>
    ),
  },
  {
    number: "10",
    icon: RefreshCw,
    title: "Modification des CGU",
    gradient: "from-pink-500 to-purple-500",
    content: (
      <p className="text-gray-600 leading-relaxed">
        myofppt se réserve le droit de modifier à tout moment les présentes conditions. Les utilisateurs seront invités à consulter régulièrement cette page.
      </p>
    ),
  },
  {
    number: "11",
    icon: Mail,
    title: "Contact",
    gradient: "from-purple-500 to-pink-500",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l&apos;adresse suivante :{" "}
        <a href="mailto:myofppt.contact@gmail.com" className="font-medium text-purple-600 underline hover:text-purple-700">myofppt.contact@gmail.com</a>
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-sm text-gray-500">Dernière mise à jour : 28 juillet 2026</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.number}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:p-8"
            >
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${section.gradient} opacity-[0.06] transition-all duration-300 group-hover:scale-150 group-hover:opacity-[0.12]`} />

              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${section.gradient} shadow-md`}>
                  <section.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-3 text-lg font-bold text-gray-900">
                    <span className="text-purple-500">{section.number}.</span> {section.title}
                  </h2>
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

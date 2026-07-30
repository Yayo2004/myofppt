import { Shield, Cookie, Share2, Lock, Mail, FileText, Eye, RefreshCw, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Politique de confidentialité — Protection des données myofppt",
  description: "Politique de confidentialité de myofppt : collecte des données, cookies, Google AdSense, droits des utilisateurs et contact.",
};

const sections = [
  {
    number: "1",
    icon: FileText,
    title: "Collecte des données",
    gradient: "from-purple-500 to-purple-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Nous collectons uniquement les données nécessaires au bon fonctionnement du service, notamment : l&apos;adresse IP, le type de navigateur utilisé, les pages visitées et la durée de visite. Nous utilisons Google Analytics et Google AdSense, qui peuvent placer des cookies sur votre appareil.
      </p>
    ),
  },
  {
    number: "2",
    icon: Eye,
    title: "Utilisation des données",
    gradient: "from-pink-500 to-pink-600",
    content: (
      <div className="text-gray-600 leading-relaxed">
        <p className="mb-3">Les données collectées servent à :</p>
        <ul className="space-y-2">
          {[
            "améliorer le fonctionnement et le contenu de notre plateforme",
            "analyser la fréquentation du site",
            "afficher des publicités pertinentes via Google AdSense",
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
    number: "3",
    icon: Cookie,
    title: "Cookies",
    gradient: "from-purple-500 to-pink-500",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Nous utilisons des cookies pour améliorer votre expérience de navigation. Un cookie est un petit fichier texte stocké sur votre appareil. Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur, sachant que cela peut affecter certaines fonctionnalités du site.
      </p>
    ),
  },
  {
    number: "4",
    icon: AlertTriangle,
    title: "Publicité et cookies tiers (Google AdSense)",
    gradient: "from-pink-500 to-purple-500",
    content: (
      <div className="text-gray-600 leading-relaxed space-y-3">
        <p>
          Google, en tant que fournisseur tiers, utilise des cookies pour diffuser des annonces sur ce site. L&apos;utilisation par Google de cookies publicitaires lui permet de diffuser des annonces à nos utilisateurs en fonction de leur visite sur notre site et sur d&apos;autres sites Internet. Vous pouvez désactiver l&apos;utilisation des cookies publicitaires personnalisés en consultant les règles de confidentialité de Google concernant les technologies publicitaires à l&apos;adresse suivante :{" "}
          <a href="https://policies.google.com/technologies/ads" className="text-purple-600 underline hover:text-purple-700">https://policies.google.com/technologies/ads</a>
        </p>
        <p>
          Vous pouvez également gérer vos préférences publicitaires directement via :{" "}
          <a href="https://adssettings.google.com" className="text-purple-600 underline hover:text-purple-700">https://adssettings.google.com</a>
        </p>
      </div>
    ),
  },
  {
    number: "5",
    icon: Share2,
    title: "Partage des données",
    gradient: "from-emerald-500 to-emerald-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Nous ne vendons ni ne louons vos données personnelles à des tiers. Les données peuvent être partagées uniquement avec des prestataires techniques (comme Google) dans le cadre du fonctionnement normal du site (analyse de trafic, affichage publicitaire).
      </p>
    ),
  },
  {
    number: "6",
    icon: Shield,
    title: "Droits des utilisateurs",
    gradient: "from-blue-500 to-blue-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Conformément à la législation applicable en matière de protection des données, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, contactez-nous à l&apos;adresse indiquée ci-dessous.
      </p>
    ),
  },
  {
    number: "7",
    icon: Lock,
    title: "Sécurité",
    gradient: "from-purple-600 to-purple-700",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Nous mettons en œuvre des mesures raisonnables pour protéger vos données contre tout accès non autorisé, altération ou divulgation.
      </p>
    ),
  },
  {
    number: "8",
    icon: RefreshCw,
    title: "Modifications de cette politique",
    gradient: "from-pink-600 to-purple-600",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Cette politique de confidentialité peut être mise à jour périodiquement. Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
      </p>
    ),
  },
  {
    number: "9",
    icon: Mail,
    title: "Contact",
    gradient: "from-purple-500 to-pink-500",
    content: (
      <p className="text-gray-600 leading-relaxed">
        Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à l&apos;adresse suivante :{" "}
        <a href="mailto:myofppt.contact@gmail.com" className="font-medium text-purple-600 underline hover:text-purple-700">myofppt.contact@gmail.com</a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-pink-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">Politique de confidentialité</h1>
          <p className="text-sm text-gray-500">Dernière mise à jour : 28 juillet 2026</p>
        </div>

        <p className="mb-10 text-center text-gray-600 leading-relaxed max-w-2xl mx-auto">
          myofppt s&apos;engage à protéger la vie privée de ses utilisateurs. Cette politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez notre site.
        </p>

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


// Dati tradotti per il banner dei cookie
const cookieTranslations = {
  it: {
    title: "Questo sito web utilizza i cookie",
    description: "Utilizziamo i cookie per personalizzare contenuti ed annunci, per fornire funzionalità dei social media e per analizzare il nostro traffico. Condividiamo inoltre informazioni sul modo in cui utilizza il nostro sito con i nostri partner che si occupano di analisi dei dati web, pubblicità e social media, i quali potrebbero combinarle con altre informazioni che ha fornito loro o che hanno raccolto dal suo utilizzo dei loro servizi.",
    acceptAllBtn: "Accetta tutti",
    acceptNecessaryBtn: "Rifiuta",
    showPreferencesBtn: "Gestisci preferenze",
    footer: `<a href="/it/privacy.html">Privacy Policy</a>`
  },
  de: {
    title: "Diese Website verwendet Cookies",
    description: "Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren, Funktionen für soziale Medien anbieten zu können und die Zugriffe auf unsere Website zu analysieren. Außerdem geben wir Informationen zu Ihrer Verwendung unserer Website an unsere Partner für soziale Medien, Werbung und Analysen weiter. Unsere Partner führen diese Informationen möglicherweise mit weiteren Daten zusammen, die Sie ihnen bereitgestellt haben oder die sie im Rahmen Ihrer Nutzung der Dienste gesammelt haben.",
    acceptAllBtn: "Alle akzeptieren",
    acceptNecessaryBtn: "Ablehnen",
    showPreferencesBtn: "Einstellungen verwalten",
    footer: `<a href="/de/privacy.html">Datenschutzrichtlinie</a>`
  },
  en: {
    title: "This website uses cookies",
    description: "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of their services.",
    acceptAllBtn: "Accept all",
    acceptNecessaryBtn: "Decline",
    showPreferencesBtn: "Manage preferences",
    footer: `<a href="/en/privacy.html">Privacy Policy</a>`
  },
  fr: {
    title: "Ce site web utilise des cookies",
    description: "Nous utilisons des cookies pour personnaliser le contenu et les publicités, pour fournir des fonctionnalités de médias sociaux et pour analyser notre trafic. Nous partageons également des informations sur votre utilisation de notre site avec nos partenaires de médias sociaux, de publicité et d'analyse, qui peuvent les combiner avec d'autres informations que vous leur avez fournies ou qu'ils ont collectées lors de votre utilisation de leurs services.",
    acceptAllBtn: "Tout accepter",
    acceptNecessaryBtn: "Refuser",
    showPreferencesBtn: "Gérer les préférences",
    footer: `<a href="/fr/privacy.html">Politique de confidentialité</a>`
  }
};

// Funzione per ottenere la lingua corrente dal percorso URL
function getCurrentLanguage() {
  const path = window.location.pathname;
  if (path.startsWith('/de/')) return 'de';
  if (path.startsWith('/en/')) return 'en';
  if (path.startsWith('/fr/')) return 'fr';
  // Impostazione predefinita su IT per la radice e /it/
  return 'it';
}

// Inizializza CookieConsent
document.addEventListener('DOMContentLoaded', function () {
  const lang = getCurrentLanguage();
  const translations = cookieTranslations[lang];
  const params = new URLSearchParams(window.location.search);
  const contactPageByLanguage = {
    it: 'contatti.html',
    de: 'kontakt.html',
    en: 'contact.html',
    fr: 'contact.html'
  };

  if (params.has('reset-consent') && window.CookieConsent && typeof window.CookieConsent.reset === 'function') {
    window.CookieConsent.reset(true);
  }

  CookieConsent.run({
    revision: 1,
    autoShow: true,
    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom left",
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: "box",
        position: "right",
        equalWeightButtons: true,
        flipButtons: false
      }
    },
    categories: {
      necessary: {
        readOnly: true
      },
      analytics: {}
    },
    language: {
      default: lang,
      translations: {
        [lang]: {
          consentModal: {
            title: translations.title,
            description: translations.description,
            acceptAllBtn: translations.acceptAllBtn,
            acceptNecessaryBtn: translations.acceptNecessaryBtn,
            showPreferencesBtn: translations.showPreferencesBtn,
            footer: translations.footer
          },
          preferencesModal: {
            title: "Preferenze Consenso",
            acceptAllBtn: "Accetta tutti",
            acceptNecessaryBtn: "Rifiuta",
            savePreferencesBtn: "Salva preferenze",
            closeIconLabel: "Chiudi modale",
            serviceCounterLabel: "Servizi",
            sections: [
              {
                title: "Utilizzo dei Cookie",
                description: "I cookie sono piccoli file di testo che possono essere utilizzati dai siti web per rendere più efficiente l'esperienza per l'utente. La legge afferma che possiamo memorizzare i cookie sul suo dispositivo se sono strettamente necessari per il funzionamento di questo sito. Per tutti gli altri tipi di cookie abbiamo bisogno del suo permesso."
              },
              {
                title: "Cookie Strettamente Necessari <span class=\"pm__badge\">Sempre Abilitati</span>",
                description: "Questi cookie sono essenziali per il corretto funzionamento del sito web e non possono essere disattivati. Solitamente vengono impostati solo in risposta ad azioni da te effettuate che costituiscono una richiesta di servizi, come l'impostazione delle preferenze sulla privacy.",
                linkedCategory: "necessary"
              },
              {
                title: "Cookie Analitici",
                description: "Questi cookie ci permettono di contare le visite e le fonti di traffico per poter misurare e migliorare le prestazioni del nostro sito. Ci aiutano a sapere quali sono le pagine più e meno popolari e vedere come i visitatori si muovono intorno al sito.",
                linkedCategory: "analytics"
              },
              {
                title: "Maggiori informazioni",
                description: `Per qualsiasi domanda in relazione alla nostra politica sui cookie e alle tue scelte, per favore <a class="cc__link" href="/${lang}/${contactPageByLanguage[lang]}">contattaci</a>.`
              }
            ]
          }
        }
      }
    }
  });
});

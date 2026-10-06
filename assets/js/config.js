/*
 * La Foulée Bleck — données de l'édition
 * ---------------------------------------------------------------
 * C'est le seul fichier à modifier d'une édition à l'autre.
 * Les textes marqués data-cfg / data-reg dans index.html sont mis
 * à jour automatiquement à partir de ces valeurs.
 * Pensez aussi à mettre à jour le bloc JSON-LD (SEO) dans index.html.
 */
window.FOULEE_CONFIG = {
  edition: 11,

  // Date de la course (heure d'ouverture du site de course, heure suisse).
  // Sert au compte à rebours.
  dateISO: "2027-09-18T08:00:00+02:00",
  dateLabel: "Samedi 18 septembre 2027",

  // false = affiche la mention « date provisoire » à côté de la date.
  dateConfirmed: false,

  registration: {
    // "open"   : inscriptions ouvertes, les boutons pointent vers `url`
    // "soon"   : inscriptions pas encore ouvertes (boutons vers l'e-mail de contact)
    // "closed" : inscriptions en ligne closes, inscription sur place uniquement
    status: "open",
    // Lien d'inscription Datasport (à remplacer par celui de la nouvelle édition)
    url: "https://datasport.com/fr/course/la-foulee-bleck-grimisuat-2026/",
    // Fin des inscriptions en ligne : le vendredi à minuit précédant la course
    deadlineLabel: "vendredi 17 septembre 2027 à minuit",
  },

  previousEdition: {
    label: "Édition 2026 sur Datasport",
    url: "https://results.datasport.com/fr/course/la-foulee-bleck-grimisuat-2026/startlist",
  },

  contactEmail: "info@lafouleebleck.ch",
};

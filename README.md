# La Foulée Bleck — site web

Site vitrine de **La Foulée Bleck**, la course populaire de Grimisuat (VS), pensé pour **maximiser les inscriptions** :

- un bouton « Je m’inscris » toujours à portée de main (en-tête, hero, chaque parcours, tarifs, bandeau final et barre fixe sur mobile) ;
- les **6 formats** mis en avant (Junior mini 1 km, Junior 2,3 km, Populaire 6 km, Élite 12 km, Nordic Walking 6 km, relais à trois), avec étapes du tracé, dénivelé et prix ;
- une **aide au choix** (« Qui prend le départ ? ») qui recommande le bon parcours ;
- un **interrupteur Groupe Mutuel** qui affiche les tarifs à −50 % ;
- un **compte à rebours**, le programme, les infos pratiques, une FAQ et la carte d’accès (chargée seulement au clic, par respect de la vie privée).

Le site est 100 % statique (HTML/CSS/JS, sans dépendance ni outil de build) : il se publie tel quel sur n’importe quel hébergement (Infomaniak, GitHub Pages, Netlify…).

## Structure

```
index.html              Page unique (toutes les sections)
assets/css/styles.css   Styles (couleurs et typographie dans :root)
assets/js/config.js     Données de l'édition ← à modifier chaque année
assets/js/main.js       Interactions (compte à rebours, aide au choix, tarifs, menu…)
assets/img/             Logo et favicon
```

## Préparer une nouvelle édition

1. Ouvrir `assets/js/config.js` et mettre à jour :
   - `edition`, `dateISO`, `dateLabel` ;
   - `dateConfirmed: true` dès que la date est officielle (retire la mention « Date provisoire ») ;
   - `registration.url` avec le lien Datasport de la nouvelle édition, et `registration.deadlineLabel` ;
   - `registration.status` : `"open"` (inscriptions ouvertes), `"soon"` (boutons « M’avertir de l’ouverture » vers l’e-mail de contact) ou `"closed"` (inscription sur place uniquement).
2. Mettre à jour le bloc **JSON-LD** dans le `<head>` de `index.html` (nom, date, liens) : il permet à Google d’afficher la course dans ses résultats d’événements.
3. Si les tarifs changent : modifier les montants dans `index.html` (attributs `data-price`, utilisés aussi pour le calcul −50 %).

## À valider avant mise en ligne

Le site d’origine n’était pas accessible depuis l’environnement de création ; le contenu a été repris des informations publiques de la course. Merci de vérifier :

- **Identité visuelle** : remplacer `assets/img/logo-mark.svg` par le logo officiel et ajuster les couleurs dans `:root` (`assets/css/styles.css`) si besoin.
- **Date 2027** : le 18 septembre 2027 est une date provisoire (samedi précédant le Jeûne fédéral, comme les éditions précédentes).
- **Lien d’inscription** : il pointe pour l’instant vers la page Datasport 2026.
- **Horaires de départ par catégorie** : à ajouter dans la section « Programme » dès qu’ils sont connus.
- **Correspondance catégories ↔ parcours** et longueur du relais (3 × 1,65 km).
- **Partenaires** : compléter la liste (et ajouter les logos).
- **Photos** : ajouter de vraies photos de la course (hero, parcours) renforcera encore l’envie de s’inscrire.

## Aperçu en local

Ouvrir `index.html` dans un navigateur, ou lancer un petit serveur :

```bash
npx serve .
```

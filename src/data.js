/* ============ CONTENUS DE MADAME VOYANCE ============
   Tous les textes sont ici : modifiez-les librement. */

/* --- Arcanes majeurs : [nom, mots-clés, message, conseil] --- */
const MAJORS = [
  ["Le Mat","Liberté · Élan · Inconnu","Un chemin s'ouvre sans plan ni boussole. Avancez le cœur léger : l'aventure commence quand on accepte de ne pas tout savoir.","Accueillez un imprévu avec curiosité."],
  ["Le Bateleur","Initiative · Talent · Commencement","Tous les outils sont posés sur la table. Vous avez déjà ce qu'il faut pour lancer le projet qui vous tient à cœur.","Commencez petit, mais commencez aujourd'hui."],
  ["La Papesse","Intuition · Secret · Patience","La réponse ne viendra pas du bruit extérieur. Elle mûrit en silence, dans ce que vous savez déjà au fond de vous.","Accordez-vous un moment de calme avant de décider."],
  ["L'Impératrice","Créativité · Abondance · Expression","Une énergie fertile vous entoure. Ce que vous semez maintenant, idées comme relations, a toutes les chances de fleurir.","Exprimez ce que vous ressentez, sans vous censurer."],
  ["L'Empereur","Structure · Stabilité · Autorité","Le moment est venu de poser des fondations solides. Un cadre clair vous libérera plus qu'il ne vous enfermera.","Fixez-vous une règle simple et tenez-la."],
  ["Le Pape","Transmission · Conseil · Sagesse","Une personne d'expérience peut éclairer votre route. Écoutez, puis gardez ce qui résonne avec vos propres valeurs.","Demandez l'avis de quelqu'un que vous respectez."],
  ["L'Amoureux","Choix · Union · Harmonie","Deux voies se présentent. Choisir avec le cœur ne veut pas dire choisir sans réfléchir : écoutez les deux.","Alignez votre décision sur vos valeurs."],
  ["Le Chariot","Victoire · Volonté · Mouvement","Vous tenez les rênes. En gardant le cap malgré les forces contraires, vous avancez plus vite que prévu.","Concentrez votre énergie sur un seul objectif."],
  ["La Force","Courage · Douceur · Maîtrise","Votre vraie force est tranquille. C'est par la douceur, et non par la lutte, que vous apprivoiserez la situation.","Répondez avec calme à ce qui vous agace."],
  ["L'Ermite","Introspection · Recherche · Recul","Une petite lanterne suffit pour avancer dans la nuit. Prenez du recul : la clarté viendra du dedans.","Offrez-vous un moment de solitude, loin des écrans."],
  ["La Roue de Fortune","Cycle · Chance · Changement","La roue tourne et le vent change. Ce qui semblait bloqué peut se débloquer d'un coup : restez disponible.","Saisissez l'occasion qui passe."],
  ["La Justice","Équilibre · Vérité · Responsabilité","Chaque action porte ses fruits. L'heure est à la lucidité : regardez les faits, puis décidez avec justesse.","Soyez honnête, avec les autres comme avec vous-même."],
  ["Le Pendu","Lâcher-prise · Pause · Autre regard","Rien ne sert de forcer. En changeant d'angle, vous verrez ce qui vous échappait jusqu'ici.","Acceptez d'attendre un peu."],
  ["L'Arcane sans nom","Transformation · Fin · Renouveau","Un chapitre se ferme pour en laisser naître un autre. Ce n'est pas une perte, c'est une place qui se libère.","Laissez partir ce qui ne vous sert plus."],
  ["La Tempérance","Harmonie · Mesure · Guérison","Le juste milieu est votre allié. Mélangez patience et action, et tout retrouve sa fluidité.","Ralentissez le rythme, juste un peu."],
  ["Le Diable","Désir · Attachement · Tentation","Une envie ou une habitude prend trop de place. La reconnaître, c'est déjà commencer à s'en libérer.","Repérez ce qui vous retient, sans vous juger."],
  ["La Maison Dieu","Bouleversement · Révélation · Libération","Une vérité éclate et secoue l'ordre établi. Ce qui tombe n'était pas solide : vous rebâtirez mieux.","Accueillez le changement plutôt que de le retenir."],
  ["L'Étoile","Espoir · Inspiration · Sérénité","Après l'orage, le ciel s'éclaircit. Une lumière douce vous guide : faites confiance à l'avenir.","Formulez un vœu ce soir, en regardant le ciel."],
  ["La Lune","Rêves · Illusion · Intuition","Tout n'est pas encore clair, et c'est normal. Écoutez vos rêves et vos ressentis, mais vérifiez avant de conclure.","Notez vos rêves au réveil."],
  ["Le Soleil","Joie · Réussite · Vitalité","Une belle énergie illumine votre journée. Partagez votre chaleur : elle vous reviendra multipliée.","Faites une chose qui vous met simplement en joie."],
  ["Le Jugement","Éveil · Appel · Renaissance","Un appel intérieur se fait entendre. C'est le moment de répondre à ce que vous repoussez depuis longtemps.","Pardonnez-vous une ancienne erreur."],
  ["Le Monde","Accomplissement · Plénitude · Voyage","Un cycle s'achève en beauté. Savourez ce que vous avez accompli avant de partir vers le prochain horizon.","Célébrez une réussite, même petite."]
];
const ROMAN = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];

/* --- Arcanes mineurs : 4 couleurs × 14 cartes : [mots-clés, message] --- */
const SUITS = {
  w: { name:"Bâtons", dom:"L'action, la passion et les projets", tip:"Passez à l'action, même modestement.", cards:[
    ["Inspiration · Énergie · Création","Une étincelle jaillit : une idée, une passion, un élan à saisir sans attendre."],
    ["Projets · Vision · Décision","Le monde est entre vos mains. Où voulez-vous aller ? Dessinez le plan."],
    ["Expansion · Anticipation · Horizons","Vos navires prennent la mer. Les premiers résultats de vos efforts arrivent bientôt."],
    ["Célébration · Foyer · Étape franchie","Un moment de joie à fêter. Une étape franchie mérite d'être célébrée."],
    ["Rivalité · Compétition · Tensions","Les avis s'opposent et ça bouillonne. Faites de cette énergie un défi stimulant."],
    ["Victoire · Reconnaissance · Succès","Votre mérite est reconnu. Recevez les compliments sans fausse modestie."],
    ["Défense · Conviction · Persévérance","Vous tenez votre position face aux obstacles. Votre conviction est votre meilleur atout."],
    ["Rapidité · Nouvelles · Mouvement","Les choses s'accélèrent et des nouvelles arrivent vite. Gardez votre agenda ouvert."],
    ["Résilience · Prudence · Dernier effort","La fatigue se fait sentir, mais vous êtes tout près du but. Tenez bon."],
    ["Surcharge · Responsabilités · Fardeau","Vous portez trop de choses à la fois. Déléguez, ou posez un fardeau en chemin."],
    ["Enthousiasme · Exploration · Message","Une envie d'aventure ou une nouvelle enthousiasmante vous met en mouvement."],
    ["Passion · Audace · Voyage","L'énergie est vive, presque impatiente. Osez, mais gardez une direction."],
    ["Charisme · Confiance · Chaleur","Votre rayonnement attire les regards. Vous inspirez les autres simplement en étant vous-même."],
    ["Leadership · Vision · Entreprise","Vous avez l'étoffe d'un guide. Menez votre projet avec vision et générosité."]
  ]},
  c: { name:"Coupes", dom:"Le cœur, l'amour et les émotions", tip:"Écoutez ce que vous ressentez.", cards:[
    ["Amour · Émotion · Nouveau sentiment","Une source d'émotion neuve jaillit : une rencontre, une réconciliation ou simplement un cœur qui s'ouvre."],
    ["Union · Partage · Attirance","Un lien se tisse à égalité. Ce que vous donnez vous est rendu avec la même sincérité."],
    ["Amitié · Fête · Célébration","Le bonheur se partage mieux à plusieurs. Entourez-vous des personnes qui vous font rire."],
    ["Lassitude · Repli · Occasion manquée","Vous boudez un peu ce qui vous est offert. Levez les yeux : une coupe vous est tendue."],
    ["Regret · Déception · Deuil","Vous regardez ce qui s'est renversé. Pourtant, deux coupes restent debout derrière vous."],
    ["Nostalgie · Enfance · Douceur","Un souvenir tendre refait surface. Il vous rappelle une joie simple que vous pouvez retrouver."],
    ["Rêverie · Illusions · Choix multiples","Les possibilités brillent de mille feux, mais toutes ne sont pas réelles. Choisissez ce qui est concret."],
    ["Départ · Quête · Détachement","Il est temps de quitter ce qui ne vous nourrit plus pour chercher quelque chose de plus profond."],
    ["Satisfaction · Vœu exaucé · Plaisir","C'est la carte du vœu. Un désir cher à votre cœur est en bonne voie."],
    ["Harmonie familiale · Bonheur · Paix","La paix intérieure et la chaleur d'un foyer vous entourent. Savourez ce bonheur simple."],
    ["Message · Sensibilité · Créativité","Une nouvelle douce ou une idée créative arrive par surprise. Laissez-vous toucher."],
    ["Romantisme · Proposition · Charme","Une invitation ou une déclaration se profile. Suivez votre cœur avec élégance."],
    ["Empathie · Intuition · Bienveillance","Votre sensibilité est un don. Écoutez les autres, sans oublier de vous écouter aussi."],
    ["Sagesse émotionnelle · Calme · Diplomatie","Vous savez garder la tête froide et le cœur chaud. Votre calme apaise ceux qui vous entourent."]
  ]},
  s: { name:"Épées", dom:"La pensée, les décisions et les conflits", tip:"Réfléchissez avant de parler.", cards:[
    ["Clarté · Vérité · Décision","Une idée tranchante dissipe le brouillard. Vous voyez enfin clair."],
    ["Indécision · Trêve · Équilibre fragile","Vous hésitez entre deux options. Regarder la situation en face vous aidera à trancher."],
    ["Chagrin · Séparation · Vérité douloureuse","Une peine demande à être reconnue. S'autoriser à la ressentir, c'est déjà commencer à guérir."],
    ["Repos · Récupération · Méditation","Votre esprit réclame une pause. Le repos n'est pas de la paresse, c'est une préparation."],
    ["Conflit · Ego · Victoire amère","Gagner une dispute ne vaut pas toujours ce qu'elle coûte. Choisissez vos combats."],
    ["Transition · Apaisement · Voyage","Vous laissez les eaux agitées derrière vous. Des rives plus calmes approchent."],
    ["Ruse · Stratégie · Discrétion","Avancez avec finesse, mais restez honnête. Ce qui est caché finit toujours par se savoir."],
    ["Blocage · Peur · Limites mentales","Les liens qui vous retiennent sont plus lâches qu'il n'y paraît. Vous pouvez en sortir."],
    ["Inquiétude · Nuits agitées · Ruminations","Vos pensées tournent en boucle. Au matin, les soucis paraissent souvent plus petits : parlez-en."],
    ["Fin · Épuisement · Aube","Le plus dur est passé. À l'horizon, le ciel commence déjà à s'éclaircir."],
    ["Vigilance · Curiosité · Idées neuves","Votre esprit est en éveil. Observez, posez des questions, informez-vous."],
    ["Rapidité · Ambition · Impulsivité","L'énergie vous pousse à foncer. Allez vite, mais regardez où vous mettez les pieds."],
    ["Lucidité · Indépendance · Franchise","Votre parole est claire et juste. Dites les choses avec franchise et bienveillance."],
    ["Logique · Autorité · Justice","La raison guide vos choix aujourd'hui. Une décision réfléchie sera la bonne."]
  ]},
  p: { name:"Deniers", dom:"Le travail, l'argent et le corps", tip:"Misez sur le concret.", cards:[
    ["Opportunité · Prospérité · Concret","Une graine de réussite matérielle vous est offerte : un projet, une offre, une idée qui rapporte."],
    ["Équilibre · Adaptation · Jonglage","Vous jonglez avec plusieurs obligations. Gardez de la souplesse, et tout tiendra."],
    ["Travail d'équipe · Savoir-faire · Reconnaissance","Votre compétence est remarquée. À plusieurs, le projet prend une belle forme."],
    ["Sécurité · Épargne · Contrôle","Vous protégez ce que vous avez. Une prudence utile, tant qu'elle ne devient pas crispation."],
    ["Difficulté · Manque · Entraide","Une période plus serrée. N'hésitez pas à demander de l'aide : une porte éclairée est tout près."],
    ["Générosité · Partage · Équité","Donner et recevoir trouvent leur équilibre. Un geste généreux circule aujourd'hui."],
    ["Patience · Évaluation · Croissance lente","Vos efforts poussent lentement mais sûrement. Prenez le temps d'apprécier le chemin parcouru."],
    ["Application · Apprentissage · Maîtrise","Le travail soigné porte ses fruits. Chaque geste répété vous rapproche de la maîtrise."],
    ["Autonomie · Confort · Raffinement","Vous récoltez le fruit de vos efforts. Offrez-vous un plaisir mérité."],
    ["Héritage · Stabilité · Famille","Une base solide et durable se construit, pour vous et pour ceux que vous aimez."],
    ["Étude · Projet · Curiosité","Une envie d'apprendre ou un petit projet concret prend forme. Plantez la graine."],
    ["Persévérance · Fiabilité · Méthode","Lentement mais sûrement. Votre régularité est votre meilleure alliée."],
    ["Bien-être · Générosité · Sens pratique","Prenez soin de votre corps et de votre maison : votre confort nourrit tout le reste."],
    ["Réussite · Abondance · Sécurité","Vous avez le sens des affaires et de la stabilité. Vos décisions concrètes portent leurs fruits."]
  ]}
};
const RANKS = ["As","Deux","Trois","Quatre","Cinq","Six","Sept","Huit","Neuf","Dix","Valet","Cavalier","Reine","Roi"];

const SPREADS = {
  1:  { label:"Carte du jour", pts:15, pos:["Votre carte du jour"] },
  3:  { label:"Passé · Présent · Futur", pts:20, pos:["Passé","Présent","Futur"] },
  10: { label:"Croix celtique", pts:30, pos:["La situation","L'obstacle","Les racines","Le passé récent","Le possible","L'avenir proche","Vous-même","L'entourage","Espoirs et craintes","L'issue"] }
};

/* --- Zodiaque --- */
const ZODIAC = [
  {n:"Bélier",g:"♈",d:"21 mars – 19 avril",el:"Feu",pl:"Mars",t:"Audacieux, spontané, toujours prêt à ouvrir la voie."},
  {n:"Taureau",g:"♉",d:"20 avril – 20 mai",el:"Terre",pl:"Vénus",t:"Patient, sensuel, attaché à la beauté et à la stabilité."},
  {n:"Gémeaux",g:"♊",d:"21 mai – 20 juin",el:"Air",pl:"Mercure",t:"Curieux, vif, passionné par les idées et les échanges."},
  {n:"Cancer",g:"♋",d:"21 juin – 22 juillet",el:"Eau",pl:"la Lune",t:"Sensible, protecteur, profondément lié à son foyer."},
  {n:"Lion",g:"♌",d:"23 juillet – 22 août",el:"Feu",pl:"le Soleil",t:"Rayonnant, généreux, fait pour briller et inspirer."},
  {n:"Vierge",g:"♍",d:"23 août – 22 septembre",el:"Terre",pl:"Mercure",t:"Précis, attentionné, cherche le geste juste."},
  {n:"Balance",g:"♎",d:"23 septembre – 22 octobre",el:"Air",pl:"Vénus",t:"Élégant, diplomate, en quête d'harmonie."},
  {n:"Scorpion",g:"♏",d:"23 octobre – 21 novembre",el:"Eau",pl:"Pluton",t:"Intense, magnétique, capable de grandes transformations."},
  {n:"Sagittaire",g:"♐",d:"22 novembre – 21 décembre",el:"Feu",pl:"Jupiter",t:"Optimiste, aventurier, attiré par les horizons lointains."},
  {n:"Capricorne",g:"♑",d:"22 décembre – 19 janvier",el:"Terre",pl:"Saturne",t:"Ambitieux, persévérant, bâtit pour durer."},
  {n:"Verseau",g:"♒",d:"20 janvier – 18 février",el:"Air",pl:"Uranus",t:"Original, libre, tourné vers l'avenir."},
  {n:"Poissons",g:"♓",d:"19 février – 20 mars",el:"Eau",pl:"Neptune",t:"Rêveur, intuitif, d'une grande empathie."}
];
/* Constellations stylisées (repère 100 × 60) : p = étoiles, e = traits, b = étoiles brillantes */
const ZODIAC_DE = ["du Bélier","du Taureau","des Gémeaux","du Cancer","du Lion","de la Vierge","de la Balance","du Scorpion","du Sagittaire","du Capricorne","du Verseau","des Poissons"];
const CONSTEL = [
  {p:[[14,34],[42,22],[54,26],[86,42]], e:[[0,1],[1,2],[2,3]], b:[1]},
  {p:[[52,46],[40,36],[14,12],[64,36],[84,12],[92,54]], e:[[0,1],[1,2],[0,3],[3,4]], b:[1]},
  {p:[[28,8],[46,8],[24,28],[48,26],[18,52],[52,52],[10,40],[62,42]], e:[[0,2],[2,4],[1,3],[3,5],[2,3],[2,6],[3,7]], b:[0,1]},
  {p:[[50,28],[50,6],[28,54],[74,48],[40,12]], e:[[0,1],[0,2],[0,3],[1,4]], b:[]},
  {p:[[20,46],[24,32],[34,24],[42,14],[34,6],[24,8],[62,24],[60,40],[88,38]], e:[[0,1],[1,2],[2,3],[3,4],[4,5],[2,6],[0,7],[7,8],[8,6],[6,7]], b:[0]},
  {p:[[10,18],[26,22],[40,20],[48,32],[64,28],[82,22],[58,52],[74,44]], e:[[0,1],[1,2],[2,3],[3,4],[4,5],[3,6],[4,7]], b:[6]},
  {p:[[50,8],[28,28],[72,26],[22,52],[78,50]], e:[[0,1],[0,2],[1,2],[1,3],[2,4]], b:[0]},
  {p:[[18,14],[10,6],[24,6],[26,22],[36,28],[44,34],[50,42],[58,50],[70,54],[82,50],[88,40],[82,32]], e:[[1,0],[2,0],[0,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11]], b:[4]},
  {p:[[22,40],[40,42],[42,26],[30,20],[52,12],[60,28],[72,22],[68,42],[56,50]], e:[[0,1],[1,2],[2,3],[3,0],[2,4],[4,5],[2,5],[5,6],[6,7],[7,8],[8,1],[5,7]], b:[5]},
  {p:[[12,16],[22,24],[36,44],[52,50],[70,40],[86,22],[80,14],[60,26],[40,28]], e:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,1]], b:[5]},
  {p:[[14,22],[28,14],[42,20],[54,14],[62,28],[54,42],[66,52],[80,46],[90,54]], e:[[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[6,7],[7,8]], b:[2]},
  {p:[[10,14],[18,6],[26,12],[20,20],[44,30],[62,40],[80,52],[78,36],[84,24],[92,30],[86,40]], e:[[0,1],[1,2],[2,3],[3,0],[2,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,7]], b:[6]}
];
const HORO = {
  open: [
    "{P} vous accompagne et donne le ton de la journée.",
    "Sous l'influence de {p}, votre énergie trouve un nouveau souffle.",
    "{P} veille sur vous et adoucit les angles.",
    "Porté par {p}, le ciel du jour favorise les initiatives réfléchies.",
    "{P} vous invite à écouter votre petite voix intérieure.",
    "Avec {p} en soutien, vous voyez plus loin que d'habitude.",
    "{P} éclaire vos relations d'une lumière nouvelle.",
    "Aujourd'hui, {p} vous souffle d'avancer à votre rythme."
  ],
  amour: [
    "Un mot tendre aura plus d'effet qu'un long discours.",
    "Une conversation sincère dissipe un malentendu.",
    "Les cœurs libres pourraient croiser un regard qui ne laisse pas indifférent.",
    "En couple, une petite attention surprise ravive la complicité.",
    "Votre charme opère sans effort : laissez-vous approcher.",
    "Un souvenir partagé rapproche les cœurs ce soir.",
    "Prenez le temps d'écouter : l'autre a quelque chose d'important à vous dire.",
    "Une amitié pourrait prendre une couleur plus tendre.",
    "Évitez de tout analyser : en amour, l'instinct voit juste aujourd'hui.",
    "Un message inattendu vous fait sourire.",
    "Montrez votre vulnérabilité : c'est là que naît la vraie intimité.",
    "Ne cherchez pas à convaincre, cherchez à comprendre.",
    "Une soirée simple à deux vaudra toutes les sorties.",
    "Votre douceur désarme les tensions du moment."
  ],
  travail: [
    "Une idée que vous gardiez de côté trouve enfin sa place.",
    "Une tâche ennuyeuse se règle plus vite que prévu.",
    "Un échange avec un collègue débloque la situation.",
    "Votre rigueur est remarquée, même si personne ne le dit encore.",
    "Priorisez : trois choses bien faites valent mieux que dix commencées.",
    "C'est une bonne journée pour demander ce qui vous revient.",
    "Un imprévu bouscule l'agenda, mais vous savez rebondir.",
    "Votre créativité fait la différence sur un dossier délicat.",
    "Évitez les décisions hâtives côté argent : dormez dessus.",
    "Une proposition mérite d'être étudiée de près.",
    "Fermez un dossier en suspens : le soulagement sera immédiat.",
    "Votre sens de l'organisation vous fait gagner un temps précieux.",
    "Partagez vos idées : elles sont meilleures que vous ne le pensez.",
    "Une petite victoire professionnelle mérite d'être célébrée."
  ],
  energie: [
    "Une marche au grand air recharge vos batteries.",
    "Accordez-vous une vraie pause à midi, loin des écrans.",
    "Votre énergie monte en fin de journée : gardez le meilleur pour la fin.",
    "Buvez de l'eau, respirez profondément : le corps vous remerciera.",
    "Une nuit réparatrice vous attend si vous vous couchez tôt.",
    "Quelques étirements suffisent à libérer les tensions.",
    "Votre esprit fourmille d'idées : notez-les pour ne pas vous disperser.",
    "Écoutez votre fatigue au lieu de la combattre.",
    "Une musique douce apaisera votre soirée.",
    "La lumière du jour, même timide, sera votre meilleure alliée.",
    "Relâchez vos épaules : vous portez plus de tension que vous ne le croyez.",
    "Cuisinez quelque chose de bon : nourrir le corps, c'est nourrir l'âme."
  ],
  conseil: [
    "Faites confiance au temps.",
    "Un pas après l'autre.",
    "Dites non sans culpabilité.",
    "Souriez à un inconnu.",
    "Rangez un tiroir, vous rangerez vos idées.",
    "Appelez quelqu'un qui vous manque.",
    "Osez la question qui vous brûle les lèvres.",
    "Gardez une heure rien que pour vous.",
    "Remerciez quelqu'un sincèrement.",
    "Notez trois petits bonheurs de la journée.",
    "Laissez une porte ouverte à l'imprévu.",
    "La patience est votre super-pouvoir aujourd'hui."
  ]
};

/* --- Astrologie chinoise --- */
const CHINESE = [
  {n:"Rat",h:"鼠",q:"Malin · Charmeur · Débrouillard",t:"Vif d'esprit, le Rat sait saisir les occasions et trouve toujours une solution."},
  {n:"Bœuf",h:"牛",q:"Patient · Fiable · Travailleur",t:"Solide et constant, le Bœuf avance sans se presser et va toujours au bout."},
  {n:"Tigre",h:"虎",q:"Courageux · Passionné · Indépendant",t:"Fougueux et magnétique, le Tigre aime les défis et défend ceux qu'il aime."},
  {n:"Lapin",h:"兔",q:"Doux · Diplomate · Raffiné",t:"Délicat et attentif, le Lapin cultive l'harmonie et le goût des belles choses."},
  {n:"Dragon",h:"龍",q:"Charismatique · Ambitieux · Lumineux",t:"Plein de vitalité, le Dragon inspire et voit grand."},
  {n:"Serpent",h:"蛇",q:"Intuitif · Sage · Mystérieux",t:"Profond et réfléchi, le Serpent perçoit ce que les autres ne voient pas."},
  {n:"Cheval",h:"馬",q:"Libre · Enthousiaste · Énergique",t:"Toujours en mouvement, le Cheval a besoin d'espace et d'aventure."},
  {n:"Chèvre",h:"羊",q:"Créative · Sensible · Bienveillante",t:"Artiste dans l'âme, la Chèvre apporte douceur et imagination."},
  {n:"Singe",h:"猴",q:"Inventif · Drôle · Curieux",t:"Ingénieux et joueur, le Singe transforme chaque obstacle en jeu."},
  {n:"Coq",h:"雞",q:"Franc · Organisé · Fier",t:"Précis et courageux, le Coq dit ce qu'il pense et fait ce qu'il dit."},
  {n:"Chien",h:"狗",q:"Loyal · Juste · Protecteur",t:"Fidèle et sincère, le Chien veille sur les siens avec un grand sens de la justice."},
  {n:"Cochon",h:"豬",q:"Généreux · Jovial · Sincère",t:"Bon vivant et chaleureux, le Cochon partage sans compter."}
];
const CH_ELEMENTS = ["Métal","Métal","Eau","Eau","Bois","Bois","Feu","Feu","Terre","Terre"];
const CH_TRINES = [[0,4,8],[1,5,9],[2,6,10],[3,7,11]];
const CH_DAILY = [
  "Le {a} en vous a envie de bouger : une initiative sera bien accueillie.",
  "Journée calme pour le {a} : prenez le temps de souffler.",
  "Votre nature de {a} attire la chance dans les échanges du jour.",
  "Le {a} sait attendre son heure. Aujourd'hui, observez avant d'agir.",
  "Une rencontre favorable pour le {a} pourrait éclairer un projet.",
  "Votre élément vous soutient : faites confiance à votre instinct de {a}.",
  "Le {a} trouve aujourd'hui l'équilibre entre travail et plaisir.",
  "Un petit défi réveille le courage du {a}. Relevez-le.",
  "Journée douce : le {a} gagne à s'entourer de ses proches.",
  "Le vent tourne en faveur du {a}. Osez demander."
];

/* --- Lune --- */
const MOON_PHASES = [
  {n:"Nouvelle lune",c:"Le ciel est noir, tout est possible. Posez une intention claire pour le mois qui commence.",r:"Écrivez un souhait sur un papier et gardez-le près de vous."},
  {n:"Premier croissant",c:"Une énergie neuve se lève. Faites le premier petit pas vers votre intention.",r:"Allumez une bougie et visualisez votre projet en train de grandir."},
  {n:"Premier quartier",c:"Les premiers obstacles apparaissent : ils testent votre détermination.",r:"Choisissez une action concrète et faites-la avant ce soir."},
  {n:"Lune gibbeuse croissante",c:"Presque pleine, la lune vous invite à ajuster et peaufiner.",r:"Relisez vos objectifs et corrigez ce qui doit l'être."},
  {n:"Pleine lune",c:"Tout est illuminé, émotions comprises. Un temps de récolte et de révélations.",r:"Remerciez pour ce que vous avez reçu ce mois-ci."},
  {n:"Lune gibbeuse décroissante",c:"Le temps est au partage : transmettez ce que vous avez appris.",r:"Offrez un conseil ou un service à quelqu'un."},
  {n:"Dernier quartier",c:"Faites le tri : gardez l'essentiel, laissez partir le reste.",r:"Désencombrez un petit coin de votre maison."},
  {n:"Dernier croissant",c:"Le cycle s'achève. Reposez-vous et préparez le prochain renouveau.",r:"Couchez-vous tôt et laissez vos rêves vous parler."}
];

/* --- Numérologie --- */
const NUMEROLOGY = {
  1:{t:"L'Initiative",d:"Vous êtes fait pour ouvrir des chemins. Indépendance, volonté et créativité vous poussent à entreprendre plutôt qu'à suivre."},
  2:{t:"L'Harmonie",d:"Votre force est l'écoute. Sensible et diplomate, vous savez réunir les gens et créer des liens solides."},
  3:{t:"L'Expression",d:"Communication, joie et créativité : vous avez le don de rendre la vie plus légère et d'enchanter par les mots."},
  4:{t:"La Construction",d:"Vous bâtissez pas à pas. Fiable et organisé, vous transformez les idées en réalisations durables."},
  5:{t:"La Liberté",d:"Le mouvement est votre élément. Curieux et adaptable, vous apprenez en vivant mille expériences."},
  6:{t:"L'Amour",d:"Vous êtes un pilier pour les autres. Responsable et chaleureux, vous cherchez l'harmonie au foyer et dans le cœur."},
  7:{t:"La Sagesse",d:"Esprit profond, vous cherchez le sens caché des choses. L'intuition et la réflexion sont vos guides."},
  8:{t:"La Puissance",d:"Ambition et sens des réalités : vous avez l'étoffe pour réussir et pour gérer de grandes responsabilités."},
  9:{t:"L'Universel",d:"Généreux et idéaliste, vous êtes tourné vers les autres et le monde. Votre chemin est celui du don."},
  11:{t:"L'Inspiration",d:"Nombre maître. Votre intuition est remarquable ; vous êtes porteur d'une lumière qui éclaire les autres."},
  22:{t:"Le Grand Bâtisseur",d:"Nombre maître. Vous unissez vision et sens pratique pour réaliser de grandes œuvres."},
  33:{t:"Le Guide",d:"Nombre maître. Compassion et dévouement : votre chemin est d'élever et de soigner les cœurs."}
};
const PERSONAL_DAY = [null,
  "Journée de départ : lancez quelque chose de neuf.",
  "Journée de coopération : écoutez, négociez, partagez.",
  "Journée d'expression : parlez, créez, riez.",
  "Journée de travail : organisez, rangez, construisez.",
  "Journée de changement : sortez de la routine.",
  "Journée du cœur : prenez soin des vôtres.",
  "Journée intérieure : réfléchissez, lisez, méditez.",
  "Journée d'efficacité : décisions, argent, ambitions.",
  "Journée de bilan : terminez, pardonnez, lâchez prise."
];

/* --- Runes (futhark ancien) : [glyphe, nom, mots-clés, message] --- */
const RUNES = [
  ["ᚠ","Fehu","Abondance · Richesse","Une richesse circule vers vous, matérielle ou intérieure. Partagez-la pour qu'elle grandisse."],
  ["ᚢ","Uruz","Force · Vitalité","Une force brute vous habite. Mettez-la au service d'un changement que vous désirez."],
  ["ᚦ","Thurisaz","Protection · Seuil","Avant de franchir le seuil, réfléchissez. Une porte s'ouvre, mais pas à n'importe quel prix."],
  ["ᚨ","Ansuz","Parole · Message","Les mots ont un pouvoir particulier aujourd'hui. Un conseil, un signe ou un message vous attend."],
  ["ᚱ","Raidho","Voyage · Chemin","Vous êtes en route. Le voyage, intérieur ou réel, compte autant que la destination."],
  ["ᚲ","Kenaz","Lumière · Savoir","Une flamme éclaire ce qui était obscur. Une compréhension nouvelle illumine votre esprit."],
  ["ᚷ","Gebo","Don · Échange","Un cadeau, un partage, un lien équilibré. Ce que vous offrez revient vers vous."],
  ["ᚹ","Wunjo","Joie · Harmonie","La joie s'installe. Savourez ce moment de bien-être et d'accord avec les autres."],
  ["ᚺ","Hagalaz","Bouleversement · Nettoyage","Un orage passe et nettoie le terrain. Après lui, tout pourra repousser."],
  ["ᚾ","Nauthiz","Besoin · Patience","Une contrainte vous enseigne quelque chose. Patience : la nécessité rend inventif."],
  ["ᛁ","Isa","Immobilité · Pause","La glace fige le mouvement. Ce n'est pas le moment de forcer, mais d'attendre le dégel."],
  ["ᛃ","Jera","Récolte · Cycle","Ce que vous avez semé arrive à maturité. La récolte vient à son heure."],
  ["ᛇ","Eihwaz","Endurance · Transformation","Comme l'if, vous traversez les saisons. Votre persévérance vous transforme."],
  ["ᛈ","Perthro","Mystère · Destin","Le dé roule encore. Laissez une part au mystère : tout ne se contrôle pas."],
  ["ᛉ","Algiz","Protection · Guidance","Une protection veille sur vous. Suivez votre instinct, il vous garde du danger."],
  ["ᛊ","Sowilo","Soleil · Succès","La lumière triomphe. Une réussite ou une belle énergie solaire vous porte."],
  ["ᛏ","Tiwaz","Justice · Courage","Défendez ce qui est juste. Votre courage tranquille fera la différence."],
  ["ᛒ","Berkano","Naissance · Renouveau","Quelque chose de neuf germe en douceur. Prenez-en soin comme d'une jeune pousse."],
  ["ᛖ","Ehwaz","Mouvement · Confiance","Un partenariat ou un élan commun vous fait avancer. Faites confiance à votre allié."],
  ["ᛗ","Mannaz","Soi · Humanité","Regardez-vous avec bienveillance. Vous faites partie d'un tout : les autres sont aussi des miroirs."],
  ["ᛚ","Laguz","Eau · Intuition","Laissez-vous porter par le courant de vos émotions. Votre intuition est fine aujourd'hui."],
  ["ᛜ","Ingwaz","Gestation · Achèvement","Un projet mûrit en secret ; il sortira au grand jour quand il sera prêt."],
  ["ᛞ","Dagaz","Aube · Éveil","La nuit se termine. Une prise de conscience ouvre une journée nouvelle."],
  ["ᛟ","Othala","Héritage · Racines","Revenez à vos racines. Ce qui vous a été transmis est une force."]
];

/* --- Pierres et couleurs --- */
const STONES = [
  {n:"Améthyste",c:"#9a66d4",v:"Apaise l'esprit et affine l'intuition."},
  {n:"Quartz rose",c:"#f2b4c6",v:"Ouvre le cœur et invite à la douceur envers soi."},
  {n:"Citrine",c:"#e8b53d",v:"Attire la joie, la confiance et l'abondance."},
  {n:"Œil de tigre",c:"#b8852f",v:"Protège et renforce l'assurance."},
  {n:"Labradorite",c:"#5d8a9e",v:"Bouclier contre les énergies lourdes, éveille la magie."},
  {n:"Lapis-lazuli",c:"#2f52b0",v:"Favorise la vérité et la communication."},
  {n:"Pierre de lune",c:"#dde0ee",v:"Accompagne les cycles et la sensibilité."},
  {n:"Cornaline",c:"#cf5730",v:"Stimule le courage et la créativité."},
  {n:"Aventurine",c:"#4fa56f",v:"Porte-bonheur, elle attire les occasions favorables."},
  {n:"Obsidienne",c:"#3a3346",v:"Ancre dans le présent et éloigne le négatif."},
  {n:"Cristal de roche",c:"#eaf2f6",v:"Amplifie la clarté et les intentions."},
  {n:"Malachite",c:"#1f8a5c",v:"Soutient les grandes transformations."},
  {n:"Amazonite",c:"#6fcbbd",v:"Calme les émotions et aide à s'exprimer."},
  {n:"Grenat",c:"#8e2436",v:"Ravive la passion et l'énergie vitale."},
  {n:"Turquoise",c:"#3fb8b0",v:"Protège les voyageurs et apporte la sérénité."},
  {n:"Sodalite",c:"#3557a0",v:"Apaise le mental et aide à prendre du recul."}
];
const COLORS = [
  {n:"Bleu nuit",c:"#1e2a5a",v:"Profondeur et concentration."},
  {n:"Or",c:"#e2bb62",v:"Rayonnement et confiance."},
  {n:"Violet",c:"#8a5bd6",v:"Intuition et spiritualité."},
  {n:"Vert sauge",c:"#8faa8b",v:"Calme et renouveau."},
  {n:"Rose poudré",c:"#e7b7bf",v:"Tendresse et bienveillance."},
  {n:"Blanc nacré",c:"#f1ece4",v:"Clarté et nouveau départ."},
  {n:"Rouge grenat",c:"#9c2435",v:"Passion et courage."},
  {n:"Turquoise",c:"#3cb6b0",v:"Expression et légèreté."},
  {n:"Orange ambré",c:"#d9822b",v:"Créativité et chaleur."},
  {n:"Argent",c:"#bfc4cf",v:"Intuition lunaire et élégance."},
  {n:"Indigo",c:"#3b3f9e",v:"Sagesse et introspection."},
  {n:"Vert émeraude",c:"#1d8f63",v:"Chance et équilibre."}
];

/* --- Pendule --- */
const PENDULUM = [
  {a:"Oui",d:"Les étoiles sont favorables."},
  {a:"Oui",d:"Mais prenez votre temps."},
  {a:"Oui",d:"Votre cœur le savait déjà."},
  {a:"Non",d:"Pas pour l'instant."},
  {a:"Non",d:"Une autre voie vous attend."},
  {a:"Non",d:"Laissez cette question mûrir."},
  {a:"Peut-être",d:"La réponse dépend de votre prochain choix."},
  {a:"Peut-être",d:"Les astres hésitent : reformulez demain."}
];

/* --- Compatibilité des éléments --- */
const COMPAT = {
  "Feu|Feu":[84,"Deux flammes qui se reconnaissent : passion et élan garantis. Veillez seulement à ne pas vous brûler l'un l'autre."],
  "Terre|Terre":[83,"Deux âmes de terre : fidélité, patience et projets solides. Pensez à ajouter un peu de fantaisie."],
  "Air|Air":[80,"Deux esprits d'air : des conversations sans fin et une grande liberté. Ancrez parfois vos idées dans le concret."],
  "Eau|Eau":[85,"Deux âmes d'eau : vous vous comprenez sans un mot. Attention à ne pas vous noyer dans les émotions."],
  "Air|Feu":[89,"Le vent attise la flamme : une relation vive, stimulante, pleine d'idées et de projets."],
  "Eau|Terre":[88,"L'eau nourrit la terre : une union douce, fidèle et protectrice."],
  "Feu|Terre":[66,"Le feu bouscule, la terre rassure : vous vous complétez si chacun respecte le rythme de l'autre."],
  "Air|Eau":[70,"La pensée rencontre l'émotion : une belle complémentarité, à condition de vraiment s'écouter."],
  "Eau|Feu":[60,"Vapeur et passion : des émotions intenses qui demandent beaucoup de dialogue."],
  "Air|Terre":[63,"Les idées rencontrent le concret : vous pouvez bâtir de grandes choses en acceptant vos différences."]
};

/* --- Niveaux et dos de cartes --- */
const LEVELS = [
  {p:0,t:"Âme curieuse"},
  {p:100,t:"Novice des étoiles"},
  {p:300,t:"Apprentie lunaire"},
  {p:700,t:"Lectrice d'arcanes"},
  {p:1500,t:"Gardienne des runes"},
  {p:3000,t:"Voyante"},
  {p:6000,t:"Grande Prêtresse"},
  {p:12000,t:"Oracle"}
];
const BACKS = [
  {id:"nuit",n:"Nuit étoilée",lvl:0},
  {id:"lune",n:"Lune d'or",lvl:2},
  {id:"soleil",n:"Soleil levant",lvl:4},
  {id:"astres",n:"Constellations",lvl:6}
];

/* --- Pensées du jour (une par jour, en rotation) --- */
const THOUGHTS = [
  "Le calme n'est pas l'absence de tempête. C'est le cœur qui reste tranquille au milieu.",
  "Ce que vous arrosez grandit. Choisissez bien vos pensées.",
  "Chaque matin est une page blanche. Écrivez-y une phrase douce.",
  "On ne voit les étoiles que lorsqu'il fait nuit. Vos moments sombres ont aussi leur lumière.",
  "Ralentir n'est pas reculer.",
  "La lune ne se compare pas au soleil. Elle brille à sa manière.",
  "Un petit pas fait aujourd'hui vaut mieux qu'un grand pas rêvé pour demain.",
  "Respirez. Ce moment-ci est le seul qui existe vraiment.",
  "Parlez-vous avec la tendresse que vous offrez aux autres.",
  "Les graines ne poussent pas plus vite parce qu'on tire sur la tige.",
  "Il y a de la magie dans les choses ordinaires faites avec attention.",
  "Votre intuition chuchote. Faites un peu de silence pour l'entendre.",
  "Laisser partir, c'est faire de la place pour ce qui arrive.",
  "Le ciel n'est jamais le même deux soirs de suite. Vous non plus, et c'est très bien ainsi.",
  "Ce qui vous est destiné trouvera son chemin jusqu'à vous.",
  "Le bonheur ne se cherche pas, il se remarque.",
  "Une bougie ne perd rien de sa lumière en allumant une autre bougie.",
  "Vous n'avez pas à tout comprendre aujourd'hui.",
  "Les rivières contournent les rochers sans jamais renoncer à la mer.",
  "La gratitude transforme ce que l'on a en assez.",
  "Accordez de la douceur à vos commencements.",
  "Même la plus longue nuit finit par l'aube.",
  "Ce n'est pas la destination qui change une vie, c'est la manière de marcher.",
  "Le silence est aussi une réponse.",
  "Ce que vous cherchez vous cherche peut-être aussi.",
  "La beauté se cache dans les détails que l'on oublie de regarder.",
  "Votre valeur ne se mesure pas à ce que vous produisez.",
  "Chaque étoile a mis des siècles à vous envoyer sa lumière. Prenez le temps de la regarder.",
  "Les saisons ne se pressent pas, et pourtant tout fleurit.",
  "Faites de la place à l'imprévu : c'est là que se glisse la magie.",
  "On ne peut pas verser d'une coupe vide. Prenez soin de vous d'abord.",
  "Votre chemin n'a pas à ressembler à celui des autres.",
  "Une pensée bienveillante est un cadeau qui ne coûte rien.",
  "Lâcher prise n'est pas abandonner, c'est faire confiance.",
  "Rien n'est perdu tant qu'on peut encore apprendre.",
  "Le vent ne se voit pas, mais il fait danser les arbres. Vos efforts aussi agissent en silence.",
  "Aujourd'hui, choisissez la légèreté.",
  "Attendre peut aussi être une façon d'avancer.",
  "Ce qui est fait avec le cœur ne se perd jamais.",
  "Il suffit d'une étincelle pour rallumer un feu.",
  "Regardez tout le chemin que vous avez déjà parcouru.",
  "Les plus belles choses prennent racine en silence.",
  "Un sourire offert revient toujours, parfois par un autre chemin.",
  "Votre sensibilité n'est pas une faiblesse, c'est une boussole.",
  "La mer se retire pour mieux revenir.",
  "Prenez soin de vos rêves : ils dessinent votre avenir.",
  "Une journée imparfaite reste une journée précieuse.",
  "Ce que vous craignez est souvent plus petit que l'ombre qu'il projette.",
  "Vous avez le droit de changer d'avis, de cap et de saison.",
  "La lumière que vous cherchez dehors brille déjà en vous.",
  "Écoutez le monde, mais écrivez votre propre histoire.",
  "Le temps consacré à soi n'est jamais du temps perdu.",
  "Une porte qui se ferme en éclaire souvent une autre.",
  "Le présent se déballe à chaque respiration.",
  "Vos racines vous tiennent, vos ailes vous portent.",
  "Les cailloux du chemin deviennent parfois des pierres précieuses.",
  "Faites confiance au rythme lent des choses vraies.",
  "Le cœur sait souvent avant la tête.",
  "On ne force pas une fleur à éclore. On lui offre du soleil.",
  "Ce soir, levez les yeux vers le ciel. Il est là pour vous aussi."
];

/* --- Rituels quotidiens et points --- */
const RITUALS = [
  {id:"pensee",  n:"Pensée du jour",   pts:5,  g:"❋", go:["accueil"]},
  {id:"tarot1",  n:"Carte du jour",    pts:15, g:"I", go:["tarot",1]},
  {id:"tarot3",  n:"Trois cartes",     pts:20, g:"III", go:["tarot",3]},
  {id:"tarot10", n:"Croix celtique",   pts:30, g:"X", go:["tarot",10]},
  {id:"horo",    n:"Horoscope",        pts:10, g:"✶", go:["astres","zodiaque"]},
  {id:"chinois", n:"Signe chinois",    pts:5,  g:"☯", go:["astres","chinois"]},
  {id:"lune",    n:"Lune du jour",     pts:5,  g:"☾", go:["astres","lune"]},
  {id:"numero",  n:"Numérologie",      pts:10, g:"9", go:["oracles","numero"]},
  {id:"rune",    n:"Rune du jour",     pts:10, g:"ᚱ", go:["oracles","rune"]},
  {id:"pierre",  n:"Pierre & couleur", pts:5,  g:"◆", go:["oracles","pierre"]},
  {id:"pendule", n:"Pendule",          pts:5,  g:"▾", go:["oracles","pendule"]},
  {id:"compat",  n:"Compatibilité",    pts:10, g:"♡", go:["oracles","compat"]}
];
/* Rituel du jour mis en avant sur l'accueil ; les autres options rapportent des points sans être des tâches. */
const DAILY = ['tarot1', 'horo'];
const VISIT_PTS = 10, DAILY_BONUS = 20;
const STREAK_BONUS = {3:15, 7:50, 14:100, 30:200, 60:300, 100:500, 365:1000};
/* --- Mentions légales : complétez ces trois champs avant de publier --- */
const LEGAL = {
  editeur: "Aurélien Marck",              /* Personne ou société qui publie le site */
  contact: "aurelien.marck@gmail.com",    /* Adresse e-mail de contact */
  directeur: "Aurélien Marck",            /* Directeur de la publication */
  developpement: "Aurélien Marck, avec l'aide de Claude (Anthropic)",
  annee: "2026"
};
/* ============ JEUX D'ILLUSTRATIONS ============
   Chaque jeu est un dossier d'images aux mêmes noms : m00 à m21 pour les arcanes majeurs ;
   w = Bâtons, c = Coupes, s = Épées, p = Deniers, 01 à 14. Pour ajouter un jeu : un dossier + une ligne ici. */
const DECK_ARTS = [
  {id:'rws', n:'Classique', d:'Rider-Waite-Smith, 1909', dir:'cards',
   credit:'Tarot Rider-Waite-Smith, dessiné par Pamela Colman Smith (1909). Domaine public.'},
  {id:'marseille', n:'Marseille', d:'Jean Dodal, Lyon, vers 1701', dir:'decks/marseille',
   credit:'Tarot de Marseille de Jean Dodal (Lyon, vers 1701), exemplaire de la Bibliothèque nationale de France, via Wikimedia Commons. Domaine public.'},
  {id:'8bits', n:'8 bits', d:'Pixel art aux règles de la NES', dir:'decks/8bits',
   credit:'Pixel art généré pour Madame Voyance à partir du Rider-Waite-Smith, aux contraintes de la NES : 96×160 pixels, couleurs de la palette NES sans les gris, un fond commun et 4 palettes de 3 couleurs, une palette par bloc de 16×16.'},
  {id:'encre', n:'Encre', d:'Hachures aux stylos de couleur', dir:'decks/encre',
   credit:'Version en hachures de stylos de couleur sur papier crème, générée pour Madame Voyance à partir du Rider-Waite-Smith.'}
];
let ART = 'rws';
const artOf = id => DECK_ARTS.find(a => a.id === id) || DECK_ARTS[0];
const cardImg = (id, art) => artOf(art || ART).dir + '/' + id + '.webp';


/* ============ ANIMAL TOTEM ============
   Six traits, de -2 à +2 :
   lien (solitaire − / entouré +), elan (réflexion − / action +), audace (prudence − / audace +),
   nuit (jour − / nuit +), liberte (ancrage − / liberté +), intensite (douceur − / intensité +).
   Chaque animal a un profil sur ces traits ; le quiz construit le vôtre, l'élément du signe solaire ajoute un léger penchant.
   mv : façon de se déplacer sur la barre (walk, hop, fly, swim, crawl). c : couleur du sprite. */
const TOTEM_AXES = ['lien', 'elan', 'audace', 'nuit', 'liberte', 'intensite'];
const TOTEM_EL_BONUS = .12;
const TOTEMS = [
  // ---- Feu ----
  {id:'lion', n:'Lion', el:'Feu', v:[1,1,2,-1,-1,2], c:'#e0a53a', mv:'walk', k:'Courage · Rayonnement · Protection',
   d:"Le Lion règne par sa présence plus que par sa force. Il protège les siens et assume la place qu'on lui donne.",
   f:"Vous savez prendre les choses en main quand tout le monde hésite.", o:"Votre fierté peut vous empêcher de demander de l'aide.",
   m:"Rugir n'est utile que si l'on sait aussi se reposer au soleil."},
  {id:'tigre', n:'Tigre', el:'Feu', v:[-2,1,2,1,0,2], c:'#e2782c', mv:'walk', k:'Puissance · Indépendance · Passion',
   d:"Le Tigre avance seul, sûr de sa force. Il garde son énergie pour le moment décisif, puis s'y engage entièrement.",
   f:"Votre détermination ne recule devant rien.", o:"Vous oubliez parfois de laisser entrer les autres.",
   m:"Votre feu intérieur est un trésor : choisissez bien ce qu'il éclaire."},
  {id:'panthere', n:'Panthère', el:'Feu', v:[-1,0,1,2,1,1], c:'#3b3350', mv:'walk', k:'Mystère · Élégance · Instinct',
   d:"La Panthère se fond dans l'ombre et n'en sort qu'à son heure. Elle voit ce que les autres ne remarquent pas.",
   f:"Votre instinct vous guide sans jamais vous tromper.", o:"Le secret peut devenir une armure trop lourde.",
   m:"Ce qui est caché n'est pas perdu : votre heure viendra."},
  {id:'renard', n:'Renard', el:'Feu', v:[-1,0,1,1,1,-1], c:'#e06a2a', mv:'walk', k:'Ruse · Adaptation · Malice',
   d:"Le Renard trouve toujours un passage. Curieux et joueur, il transforme les obstacles en énigmes amusantes.",
   f:"Vous vous adaptez à tout avec esprit.", o:"À force de détours, on peut perdre de vue le chemin direct.",
   m:"La solution la plus simple est peut-être juste sous votre nez."},
  {id:'cheval', n:'Cheval', el:'Feu', v:[1,2,1,-1,2,1], c:'#9a5a34', mv:'walk', k:'Liberté · Élan · Loyauté',
   d:"Le Cheval a besoin d'espace et de vent. Généreux, il porte les autres aussi loin qu'il le peut.",
   f:"Votre énergie entraîne tout le monde avec vous.", o:"Vous supportez mal les barrières, même celles qui protègent.",
   m:"Galopez, mais revenez boire à la source."},
  {id:'colibri', n:'Colibri', el:'Feu', v:[0,2,0,-2,2,-2], c:'#2fb88a', mv:'fly', k:'Joie · Légèreté · Énergie',
   d:"Le Colibri butine la vie fleur après fleur. Minuscule, il rappelle que la joie se trouve dans les petites choses.",
   f:"Votre enthousiasme rend les journées plus lumineuses.", o:"À trop voleter, on s'épuise : pensez à vous poser.",
   m:"Une seule goutte de nectar suffit à illuminer la journée."},
  {id:'salamandre', n:'Salamandre', el:'Feu', v:[-1,-1,1,1,-1,1], c:'#e8b020', mv:'crawl', k:'Transformation · Résilience · Secret',
   d:"La Salamandre traverse le feu sans se brûler, disait la légende. Elle renaît de ce qui aurait pu la détruire.",
   f:"Les épreuves vous rendent plus fort·e.", o:"Vous gardez vos blessures pour vous plus que nécessaire.",
   m:"Ce qui vous a brûlé hier vous éclaire aujourd'hui."},
  {id:'lynx', n:'Lynx', el:'Feu', v:[-2,-1,0,1,1,0], c:'#c79a62', mv:'walk', k:'Clairvoyance · Discrétion · Patience',
   d:"Le Lynx observe sans être vu. On dit qu'il perçoit les secrets à travers les murs.",
   f:"Vous comprenez les gens avant qu'ils ne parlent.", o:"Observer sans jamais s'impliquer peut isoler.",
   m:"Partagez un peu de ce que vous voyez si bien."},
  {id:'coq', n:'Coq', el:'Feu', v:[1,2,1,-2,-1,1], c:'#d8402e', mv:'walk', k:'Vigilance · Fierté · Éveil',
   d:"Le Coq annonce le jour avant tout le monde. Fier et franc, il réveille ce qui dormait.",
   f:"Vous dites les choses avec un courage rare.", o:"Votre franchise peut froisser sans que vous le vouliez.",
   m:"Chaque matin est une nouvelle chance de chanter juste."},
  {id:'bouquetin', n:'Bouquetin', el:'Feu', v:[0,1,2,-2,0,0], c:'#a8865e', mv:'hop', k:'Persévérance · Équilibre · Ambition',
   d:"Le Bouquetin grimpe là où personne n'ose aller. Il avance pas à pas, sûr de chaque appui.",
   f:"Rien n'est trop haut pour vous si vous le décidez.", o:"Vous pouvez oublier de regarder le paysage en grimpant.",
   m:"Le sommet est beau, le chemin aussi."},
  // ---- Terre ----
  {id:'ours', n:'Ours', el:'Terre', v:[-1,-1,0,0,-2,1], c:'#7a4e30', mv:'walk', k:'Force tranquille · Introspection · Foyer',
   d:"L'Ours connaît le temps de l'action et celui du repos. Il se retire pour mieux revenir, plus fort.",
   f:"Votre calme rassure tout le monde.", o:"Vous pouvez hiberner trop longtemps dans vos pensées.",
   m:"Le repos n'est pas une faiblesse : c'est une préparation."},
  {id:'loup', n:'Loup', el:'Terre', v:[2,1,1,1,1,1], c:'#8a8fa8', mv:'walk', k:'Loyauté · Instinct · Meute',
   d:"Le Loup vit pour sa meute et par son instinct. Il sait quand guider et quand suivre.",
   f:"On peut compter sur vous en toutes circonstances.", o:"Vous vous oubliez parfois au service du groupe.",
   m:"Votre instinct connaît déjà la route : faites-lui confiance."},
  {id:'cerf', n:'Cerf', el:'Terre', v:[0,-1,-1,-1,0,-2], c:'#a8693a', mv:'walk', k:'Douceur · Noblesse · Renouveau',
   d:"Le Cerf traverse la forêt avec grâce. Ses bois tombent et repoussent, symbole d'un renouveau sans fin.",
   f:"Votre douceur désarme toutes les tensions.", o:"Votre sensibilité vous fait fuir certains conflits utiles.",
   m:"La douceur est une force qui ne fait pas de bruit."},
  {id:'blaireau', n:'Blaireau', el:'Terre', v:[-1,1,1,1,-2,1], c:'#6b6670', mv:'walk', k:'Ténacité · Enracinement · Franchise',
   d:"Le Blaireau creuse et défend son terrier avec acharnement. Il ne lâche jamais ce qui compte.",
   f:"Votre ténacité vient à bout de tout.", o:"Vous pouvez vous montrer piquant·e quand on vous dérange.",
   m:"Creusez encore un peu : la réponse est plus profonde."},
  {id:'tortue', n:'Tortue', el:'Terre', v:[-1,-2,-2,0,-2,-2], c:'#5e8a4a', mv:'crawl', k:'Patience · Sagesse · Longévité',
   d:"La Tortue porte sa maison sur son dos et n'est jamais pressée. Elle arrive toujours, à son rythme.",
   f:"Votre patience vous mène plus loin que la vitesse des autres.", o:"Vous rentrer dans votre carapace peut vous priver du monde.",
   m:"Lentement mais sûrement : vous êtes sur le bon chemin."},
  {id:'castor', n:'Castor', el:'Terre', v:[2,2,-1,0,-2,0], c:'#8a5a32', mv:'walk', k:'Construction · Travail · Famille',
   d:"Le Castor bâtit pour les siens, brindille après brindille. Son œuvre transforme tout le paysage.",
   f:"Vous transformez les idées en réalisations solides.", o:"Vous avez du mal à vous arrêter tant que tout n'est pas fini.",
   m:"Ce que vous construisez aujourd'hui abritera demain."},
  {id:'herisson', n:'Hérisson', el:'Terre', v:[-1,-1,-2,1,-1,-1], c:'#9a7a5a', mv:'walk', k:'Protection · Sensibilité · Humilité',
   d:"Le Hérisson cache un cœur tendre sous ses piquants. Il sort à la nuit tombée, discret et curieux.",
   f:"Vous savez vous protéger sans attaquer.", o:"Vous vous mettez en boule avant même que le danger n'arrive.",
   m:"Montrez votre côté doux : il est en sécurité ici."},
  {id:'sanglier', n:'Sanglier', el:'Terre', v:[1,1,2,1,-1,1], c:'#5a4436', mv:'walk', k:'Bravoure · Famille · Vitalité',
   d:"Le Sanglier fonce sans détour pour défendre les siens. Sa vitalité est celle de la forêt elle-même.",
   f:"Votre courage protège ceux que vous aimez.", o:"Foncer tête baissée vous fait parfois manquer l'essentiel.",
   m:"La force la plus belle est celle qui défend."},
  {id:'elephant', n:'Éléphant', el:'Terre', v:[2,-1,0,-1,-1,0], c:'#8e8aa0', mv:'walk', k:'Mémoire · Sagesse · Bienveillance',
   d:"L'Éléphant n'oublie rien de ceux qu'il aime. Il guide le troupeau avec une sagesse ancienne.",
   f:"Votre mémoire du cœur fait de vous un pilier.", o:"Vous gardez aussi en mémoire les blessures anciennes.",
   m:"Souvenez-vous de vos forces autant que de vos peines."},
  {id:'ecureuil', n:'Écureuil', el:'Terre', v:[0,2,-1,-2,0,-1], c:'#c4602a', mv:'hop', k:'Prévoyance · Vivacité · Curiosité',
   d:"L'Écureuil prépare l'hiver en plein été. Vif et curieux, il explore chaque branche.",
   f:"Vous anticipez ce que les autres ne voient pas venir.", o:"À trop prévoir, on peut oublier de profiter.",
   m:"Gardez une noisette pour aujourd'hui."},
  // ---- Air ----
  {id:'hibou', n:'Hibou', el:'Air', v:[-1,-2,0,2,0,0], c:'#9a7448', mv:'hop', k:'Sagesse · Clairvoyance · Nuit',
   d:"Le Hibou voit dans l'obscurité ce que le jour cache. Il écoute plus qu'il ne parle.",
   f:"Votre lucidité éclaire les situations les plus troubles.", o:"Vous pouvez rester trop longtemps dans vos pensées nocturnes.",
   m:"Les réponses viennent souvent quand tout est silencieux."},
  {id:'corbeau', n:'Corbeau', el:'Air', v:[0,-1,1,1,1,0], c:'#3a3f6a', mv:'hop', k:'Intelligence · Magie · Messages',
   d:"Le Corbeau est le messager entre les mondes. Malin et curieux, il comprend les signes.",
   f:"Votre esprit vif résout les énigmes.", o:"On vous croit parfois plus sombre que vous ne l'êtes.",
   m:"Un signe vous attend aujourd'hui : ouvrez l'œil."},
  {id:'colombe', n:'Colombe', el:'Air', v:[2,-1,-2,-1,0,-2], c:'#e8e4f0', mv:'walk', k:'Paix · Douceur · Espoir',
   d:"La Colombe apporte la paix là où elle se pose. Elle relie les cœurs avec une grande douceur.",
   f:"Vous apaisez les conflits par votre seule présence.", o:"Vous évitez parfois de dire ce qui fâche.",
   m:"La paix commence par celle que vous vous accordez."},
  {id:'faucon', n:'Faucon', el:'Air', v:[-1,2,2,-1,1,1], c:'#7a6a5a', mv:'fly', k:'Vision · Précision · Rapidité',
   d:"Le Faucon voit loin et frappe juste. Il sait exactement ce qu'il veut et quand agir.",
   f:"Votre précision fait mouche à chaque fois.", o:"Votre impatience peut vous faire plonger trop tôt.",
   m:"Visez juste, puis laissez le vent vous porter."},
  {id:'aigle', n:'Aigle', el:'Air', v:[-1,1,1,-2,2,2], c:'#6a4a30', mv:'hop', k:'Hauteur · Liberté · Vision',
   d:"L'Aigle vole au-dessus des nuages. De là-haut, il voit le dessin d'ensemble.",
   f:"Vous savez prendre de la hauteur dans les moments difficiles.", o:"Vu de si haut, on peut oublier les détails qui comptent.",
   m:"Prenez de la hauteur : la vue est meilleure."},
  {id:'papillon', n:'Papillon', el:'Air', v:[1,0,0,-1,2,-2], c:'#e86aa8', mv:'fly', k:'Métamorphose · Légèreté · Beauté',
   d:"Le Papillon sait que tout change, et il en fait sa beauté. Il est la preuve que la transformation est possible.",
   f:"Vous vous réinventez avec grâce.", o:"Vous papillonnez parfois au lieu de choisir.",
   m:"Votre prochaine métamorphose est déjà en route."},
  {id:'libellule', n:'Libellule', el:'Air', v:[-1,1,0,-1,1,-1], c:'#3ab0d0', mv:'fly', k:'Illusion · Agilité · Lumière',
   d:"La Libellule danse entre l'eau et l'air, jouant avec les reflets. Elle voit au-delà des apparences.",
   f:"Vous percevez la vérité derrière les illusions.", o:"Vous changez de cap si vite que les autres ont du mal à suivre.",
   m:"Regardez au-delà du reflet."},
  {id:'chauvesouris', n:'Chauve-souris', el:'Air', v:[1,0,1,2,0,0], c:'#4a3a5a', mv:'fly', k:'Intuition · Renaissance · Communauté',
   d:"La Chauve-souris se guide dans le noir par l'écoute. Elle vit en colonie et renaît chaque soir.",
   f:"Vous trouvez votre chemin là où d'autres sont perdus.", o:"On vous comprend mal au premier abord.",
   m:"Fiez-vous à ce que vous sentez, pas seulement à ce que vous voyez."},
  {id:'abeille', n:'Abeille', el:'Air', v:[2,2,0,-2,-1,-1], c:'#e8b830', mv:'fly', k:'Coopération · Travail · Douceur',
   d:"L'Abeille travaille pour la ruche et transforme le pollen en miel. Ensemble, tout devient possible.",
   f:"Vous rendez chaque équipe meilleure.", o:"Vous pouvez vous perdre dans le travail des autres.",
   m:"Ce que vous donnez revient en miel."},
  {id:'chat', n:'Chat', el:'Air', v:[-2,-1,0,2,2,0], c:'#3c3446', mv:'walk', k:'Indépendance · Mystère · Intuition',
   d:"Le Chat va où il veut, quand il veut. Gardien des seuils, il sent ce qui se trame.",
   f:"Vous restez libre en toutes circonstances.", o:"Votre indépendance peut passer pour de l'indifférence.",
   m:"Faites comme le chat : choisissez vos moments."},
  // ---- Eau ----
  {id:'dauphin', n:'Dauphin', el:'Eau', v:[2,1,0,-1,1,-1], c:'#5a8ac8', mv:'swim', k:'Joie · Communication · Jeu',
   d:"Le Dauphin joue avec les vagues et parle à tous. Il apporte la bonne humeur partout où il nage.",
   f:"Vous créez du lien avec une facilité rare.", o:"Vous fuyez parfois la profondeur dans le jeu.",
   m:"Le rire est un pont : traversez-le aujourd'hui."},
  {id:'baleine', n:'Baleine', el:'Eau', v:[1,-2,-1,0,1,0], c:'#3a5a8a', mv:'swim', k:'Profondeur · Mémoire · Chant',
   d:"La Baleine porte la mémoire des océans. Son chant voyage sur des milliers de kilomètres.",
   f:"Votre profondeur apaise ceux qui vous écoutent.", o:"Vous plongez parfois trop loin en vous-même.",
   m:"Votre voix porte plus loin que vous ne le croyez."},
  {id:'loutre', n:'Loutre', el:'Eau', v:[1,1,0,1,0,-2], c:'#7a5038', mv:'swim', k:'Jeu · Curiosité · Tendresse',
   d:"La Loutre fait de chaque rivière un terrain de jeu. Elle tient la main des siens pour ne pas dériver.",
   f:"Votre légèreté rend la vie plus douce.", o:"Le sérieux vous ennuie, même quand il est nécessaire.",
   m:"Jouer est aussi une façon d'apprendre."},
  {id:'cygne', n:'Cygne', el:'Eau', v:[1,-1,-1,-1,-2,-1], c:'#f4f2f8', mv:'swim', k:'Grâce · Fidélité · Amour',
   d:"Le Cygne glisse avec grâce et reste fidèle toute sa vie. Il est le symbole de l'amour sincère.",
   f:"Votre fidélité est un cadeau précieux.", o:"Vous cachez vos efforts sous une apparence calme.",
   m:"Votre beauté vient de ce que vous êtes, pas de ce que vous montrez."},
  {id:'grenouille', n:'Grenouille', el:'Eau', v:[0,1,-1,1,1,-1], c:'#4ab04a', mv:'hop', k:'Purification · Passage · Renouveau',
   d:"La Grenouille passe de l'eau à la terre. Elle annonce la pluie qui lave et fait tout repousser.",
   f:"Vous traversez les transitions avec souplesse.", o:"Vous sautez d'une idée à l'autre sans toujours finir.",
   m:"Laissez la pluie laver ce qui doit partir."},
  {id:'heron', n:'Héron', el:'Eau', v:[-2,-2,-1,-1,0,-1], c:'#8aa0b8', mv:'walk', k:'Patience · Solitude · Calme',
   d:"Le Héron attend, immobile, le moment parfait. Il sait que la patience est une forme d'action.",
   f:"Votre calme vous fait saisir les bonnes occasions.", o:"Attendre trop longtemps peut vous faire manquer le moment.",
   m:"L'immobilité aussi est un mouvement."},
  {id:'saumon', n:'Saumon', el:'Eau', v:[0,2,2,0,-1,2], c:'#e07a6a', mv:'swim', k:'Détermination · Retour aux sources · Courage',
   d:"Le Saumon remonte le courant pour retrouver sa rivière natale. Rien ne l'arrête.",
   f:"Votre volonté remonte tous les courants.", o:"Lutter contre tout peut épuiser.",
   m:"Retournez à la source : elle vous attend."},
  {id:'pieuvre', n:'Pieuvre', el:'Eau', v:[-2,0,0,2,1,1], c:'#c05a8a', mv:'swim', k:'Ingéniosité · Adaptation · Mystère',
   d:"La Pieuvre change de couleur et de forme à volonté. Son intelligence étonne même les savants.",
   f:"Vous trouvez des solutions à tout.", o:"À trop vous adapter, vous pouvez vous perdre.",
   m:"Vous avez plus de bras que vous ne le pensez."},
  {id:'phoque', n:'Phoque', el:'Eau', v:[1,-1,-1,1,0,-1], c:'#7a8090', mv:'crawl', k:'Imagination · Rêve · Sensibilité',
   d:"Le Phoque est à l'aise entre deux mondes. Les légendes en font un être qui change de peau.",
   f:"Votre imagination ouvre des portes secrètes.", o:"Vous fuyez parfois dans vos rêves.",
   m:"Vos rêves ont quelque chose à vous dire."},
  {id:'serpent', n:'Serpent', el:'Eau', v:[-2,-1,1,2,0,2], c:'#4a8a4a', mv:'crawl', k:'Transformation · Intuition · Guérison',
   d:"Le Serpent mue et renaît. Il est depuis toujours le symbole de la guérison et du savoir caché.",
   f:"Vous savez laisser derrière vous ce qui ne vous sert plus.", o:"On vous craint parfois sans vous connaître.",
   m:"Une vieille peau tombe : accueillez la nouvelle."}
];
const TOTEM_QUIZ = [
  {q:"Un samedi idéal ?", a:[["Une grande tablée avec des amis",{lien:2}],["Une longue marche seul·e dans la nature",{lien:-2,liberte:1}],["Un projet à terminer de mes mains",{elan:2,liberte:-1}],["Un livre, une couverture, et rien d'autre",{elan:-2}]]},
  {q:"Face à un problème, vous…", a:[["Foncez, vous réfléchirez après",{elan:2,audace:1}],["Observez longtemps avant d'agir",{elan:-2}],["Demandez conseil autour de vous",{lien:2}],["Cherchez la solution que personne n'a vue",{liberte:1,nuit:1}]]},
  {q:"Votre moment préféré de la journée ?", a:[["L'aube",{nuit:-2}],["Le plein midi",{nuit:-1,intensite:1}],["Le crépuscule",{nuit:1}],["Le cœur de la nuit",{nuit:2}]]},
  {q:"On vous propose de partir demain à l'autre bout du monde :", a:[["J'y vais, sans hésiter",{audace:2,liberte:2}],["J'y vais si je pars bien accompagné·e",{lien:1,audace:1}],["Je demande le temps de m'organiser",{audace:-1,liberte:-1}],["Non merci, je suis bien chez moi",{liberte:-2}]]},
  {q:"Dans un groupe, vous êtes plutôt…", a:[["Celle ou celui qui mène",{intensite:1,audace:1,lien:1}],["Celle ou celui qui écoute",{lien:1,intensite:-2}],["Celle ou celui qui fait rire",{lien:2,intensite:-1}],["Un peu en retrait, mais attentif·ve",{lien:-2}]]},
  {q:"Une émotion forte vous traverse :", a:[["Elle explose, puis elle passe",{intensite:2,elan:1}],["Je la garde pour moi et je la digère",{intensite:1,lien:-1,elan:-1}],["J'en parle tout de suite",{lien:2}],["Je l'écris, je la dessine, je la transforme",{nuit:1,elan:-1}]]},
  {q:"Le paysage qui vous ressemble :", a:[["Une forêt profonde",{liberte:-1,nuit:1}],["Un sommet battu par le vent",{audace:1,liberte:1,intensite:1}],["Un océan à perte de vue",{liberte:2}],["Une prairie au soleil",{nuit:-2,intensite:-1}]]},
  {q:"Ce qu'on admire le plus chez vous :", a:[["Votre courage",{audace:2}],["Votre douceur",{intensite:-2}],["Votre loyauté",{lien:2,liberte:-1}],["Votre intuition",{nuit:2}]]},
  {q:"Votre rapport au risque :", a:[["Il me fait vibrer",{audace:2,intensite:1}],["Je le calcule",{audace:-1,elan:-1}],["Je l'évite quand je peux",{audace:-2}],["Je le prends pour les autres, pas pour moi",{lien:1,audace:1}]]},
  {q:"Votre maison idéale :", a:[["Une cabane cachée loin de tout",{lien:-2,liberte:1}],["Une maison pleine de monde et de bruit",{lien:2}],["Un nid douillet que je quitte rarement",{liberte:-2,intensite:-1}],["Un van aménagé, toujours sur la route",{liberte:2,elan:1}]]},
  {q:"Quand quelqu'un vous blesse :", a:[["Je le lui dis, droit dans les yeux",{audace:2,intensite:1}],["Je prends mes distances, en silence",{lien:-2}],["Je pardonne vite",{intensite:-2,lien:1}],["Je n'oublie jamais",{intensite:2,elan:-1}]]},
  {q:"Votre façon d'apprendre :", a:[["En faisant, quitte à me tromper",{elan:2}],["En lisant, en étudiant",{elan:-2}],["En observant ceux que j'admire",{lien:1}],["Par intuition, sans savoir comment",{nuit:2}]]},
  {q:"La saison qui vous parle :", a:[["Le printemps",{nuit:-1,elan:1}],["L'été",{intensite:2,nuit:-1}],["L'automne",{nuit:1,intensite:-1}],["L'hiver",{lien:-1,elan:-1,nuit:1}]]},
  {q:"Le compliment qui vous touche le plus :", a:[["« Tu es libre »",{liberte:2}],["« On peut compter sur toi »",{liberte:-2,lien:1}],["« Tu es fascinant·e »",{nuit:1,intensite:1}],["« Tu me fais du bien »",{intensite:-2,lien:1}]]},
  {q:"Votre rythme de vie :", a:[["Rapide, j'enchaîne",{elan:2}],["Lent et régulier",{elan:-2,liberte:-1}],["Par vagues : intense, puis calme",{intensite:1}],["Imprévisible, au gré des envies",{liberte:2}]]},
  {q:"On vous confie un secret :", a:[["Il est enterré avec moi",{lien:-1,nuit:1}],["Je cherche comment aider",{lien:2,elan:1}],["J'écoute sans juger",{intensite:-2}],["Je devine aussi ce qui n'est pas dit",{nuit:2}]]},
  {q:"L'élément qui vous attire :", a:[["Le feu",{intensite:2}],["La terre",{liberte:-2}],["L'air",{liberte:2}],["L'eau",{intensite:-1,nuit:1}]]},
  {q:"Devant une porte fermée :", a:[["Je l'ouvre",{audace:2}],["Je frappe et j'attends",{audace:-1,lien:1}],["Je cherche une autre entrée",{liberte:1,elan:1}],["Je me demande pourquoi elle est fermée",{elan:-2}]]},
  {q:"Ce qui vous ressource :", a:[["Le silence",{lien:-2,elan:-1}],["Les éclats de rire",{lien:2}],["Le mouvement, le sport",{elan:2}],["Les rêves, la nuit",{nuit:2}]]},
  {q:"Si vous aviez un pouvoir :", a:[["Voler",{liberte:2}],["Lire dans les pensées",{nuit:2}],["Être invincible",{audace:2,intensite:1}],["Guérir les autres",{intensite:-2,lien:1}]]}
];

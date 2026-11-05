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
  {id:'8bits', n:'8 bits', d:'Pixel art, palette façon NES', dir:'decks/8bits',
   credit:'Pixel art généré pour Madame Voyance à partir du Rider-Waite-Smith : 48×82 pixels, 13 couleurs de la palette NES.'},
  {id:'16bits', n:'16 bits', d:'Pixel art, couleurs façon Mega Drive', dir:'decks/16bits',
   credit:'Pixel art généré pour Madame Voyance à partir du Rider-Waite-Smith : 70×120 pixels, 32 couleurs en 9 bits comme la Mega Drive.'}
];
let ART = 'rws';
const artOf = id => DECK_ARTS.find(a => a.id === id) || DECK_ARTS[0];
const cardImg = (id, art) => artOf(art || ART).dir + '/' + id + '.webp';


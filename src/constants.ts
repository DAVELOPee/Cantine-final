import { Cantina } from './types';

export const CANTINE_DATA: Cantina[] = [
  {
    id: 1,
    name: "Cantina del Pesce",
    locationName: "Via Cavour",
    mapLink: "https://maps.app.goo.gl/M7o1mQVgsoy5NzYRA",
    coordinates: "42.366408, 10.900465",
    imageUrl: "/images/cantina-pesce.jpeg",
    description: "Immergetevi nei sapori autentici del nostro mare. La Cantina del Pesce vi delizia con il pescato freschissimo dell'Isola del Giglio, preparato secondo le antiche ricette dei pescatori locali. Dalle fritture dorate ai piatti più prelibati, ogni assaggio è un tuffo nella tradizione e nella passione per il mare.",
    hours: "18:00 - 24:00"
  },
  {
    id: 2,
    name: "Cantina delle Melanzane",
    locationName: "Piazza della Cisterna",
    mapLink: "https://maps.app.goo.gl/pBqvXnVi19xmCWfE9",
    coordinates: "42.365877, 10.899972",
    imageUrl: "/images/cantina-melanzane.jpeg",
    description: "Scoprite la versatilità e il gusto ricco della melanzana, regina della nostra cucina. Alla Cantina delle Melanzane, questo ortaggio si trasforma in capolavori di sapore: parmigiana, polpette, e altre creazioni uniche che celebrano i prodotti genuini della nostra terra. Un'esplosione di gusto mediterraneo che vi conquisterà.",
    hours: "18:00 - 24:00"
  },
  {
    id: 3,
    name: "Cantina del Pesce Arrosto",
    locationName: "Piazza dei Lombi",
    mapLink: "https://maps.app.goo.gl/dAEMxamjNzjeLt4CA",
    coordinates: "42.367190, 10.900417",
    imageUrl: "/images/cantina-pesce-arrosto.jpeg",
    description: "Il profumo irresistibile del pesce fresco che sfrigola sulla griglia vi guiderà fino alla nostra cantina. Qui, il sapore del mare viene esaltato dalla cottura semplice e genuina sulla brace. Orate, spigole e gamberoni freschissimi, per un'esperienza che sa di estate e di tradizione marinara.",
    hours: "18:00 - 24:00"
  },
  {
    id: 4,
    name: "Cantina dei Cavatelli",
    locationName: "Via Fanfulla",
    mapLink: "https://maps.app.goo.gl/VWAvPwnpNErsXRfbA",
    coordinates: "42.365722, 10.900660",
    imageUrl: "/images/cantina-cavatelli.jpeg",
    description: "Lasciatevi tentare dalla pasta fresca fatta a mano come una volta. I nostri cavatelli, preparati con amore, sono conditi con sughi ricchi e saporiti che raccontano la storia della cucina gigliese. Un piatto che scalda il cuore e soddisfa il palato, perfetto da gustare in compagnia.",
    hours: "18:00 - 24:00"
  },
  {
    id: 5,
    name: "Cantina dei Dolci",
    locationName: "Piazza dei Lombi",
    mapLink: "https://maps.app.goo.gl/eeb5zowD4JwvFzhE8",
    coordinates: "42.367116, 10.900555",
    imageUrl: "/images/cantina-dolci.jpeg",
    description: "Concludete il vostro percorso gastronomico con una nota di dolcezza. La Cantina dei Dolci è un paradiso per i golosi, dove troverete torte fatte in casa, crostate di frutta di stagione e dolci tipici dell'isola. Ogni boccone è una coccola, il finale perfetto per una serata indimenticabile.",
    hours: "18:00 - 24:00"
  },
  {
    id: 6,
    name: "Zona Degustazione Vini",
    locationName: "Piazzetta della Volta",
    mapLink: "https://maps.app.goo.gl/t5ZC7BrnYmQdpYVv8",
    coordinates: "42.366903, 10.899539",
    imageUrl: "/images/cantina-vini.jpeg",
    description: "L'Isola del Giglio non è solo mare, ma anche terra generosa di vigneti eroici. Nella nostra Zona Degustazione, potrete assaporare i vini unici prodotti sull'isola, dall'Ansonaco secco e minerale ai passiti ambrati. Un viaggio sensoriale alla scoperta di un tesoro enologico nascosto.",
    hours: "18:00 - 24:00"
  },
  {
    id: 7,
    name: "Cantina della Gratella della Carne",
    locationName: "Piazza Gloriosa",
    mapLink: "https://maps.app.goo.gl/5AD1yhnQndUM3Cjn7",
    coordinates: "42.365375, 10.901853",
    imageUrl: "/images/cantina-carne.jpg",
    description: "Per gli amanti dei sapori decisi e della carne di prima scelta, la nostra gratella è sempre accesa. Salsicce, costine e bistecche selezionate, cotte alla perfezione sulla brace per esaltarne tutto il gusto. Un'esperienza rustica e conviviale, all'insegna della migliore tradizione toscana.",
    hours: "18:00 - 24:00"
  },
  {
    id: 8,
    name: "Cantina Birra & Porchetta",
    locationName: "Via del Saraceno",
    mapLink: "https://maps.app.goo.gl/gPgtUaMr5PCEAH4P9",
    coordinates: "42.366935, 10.900563",
    imageUrl: "/images/cantina-birra.jpeg",
    description: "L'abbinamento perfetto per una serata di festa: una birra artigianale ghiacciata e un panino con la porchetta croccante e saporita. Nella nostra cantina troverete una selezione di birre per tutti i gusti e la porchetta più succulenta dell'isola. Un classico intramontabile che mette tutti d'accordo.",
    hours: "18:00 - 24:00"
  }
];

export const ENTRY_POINTS = [
  {
    id: 'e1',
    name: 'Ingresso / Uscita Castello',
    coordinates: '42.3657637, 10.9016193',
  },
  {
    id: 'e2',
    name: 'Ingresso / Uscita Castello',
    coordinates: '42.3671529, 10.8999851',
  },
  {
    id: 'e3',
    name: 'Ingresso / Uscita Castello',
    coordinates: '42.3666765, 10.8990816',
  },
  {
    id: 'e4',
    name: 'Ingresso / Uscita Castello',
    coordinates: '42.3657084, 10.9002520',
  },
];

export const CENTRAL_WAYPOINT = '42.3663,10.9005';
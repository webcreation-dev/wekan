/**
 * ─── Services Configuration ────────────────────────────────────────────────
 * Source unique de vérité pour tous les services.
 * Chaque service contient ses options de travaux.
 * Prêt pour intégration API : remplacer par un fetch /api/services
 */

export interface WorkOption {
  id:          string
  title:       string
  description: string
  image:       string
  priceFrom:   number   // FCFA
}

export interface ServiceConfig {
  id:          string
  name:        string
  icon:        string
  image:       string
  description: string
  category:    string
  basePrice:   number
  selectionMode: 'single' | 'multiple'  // radio vs checkboxes
  options:     WorkOption[]
}

export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    id: 'plomberie',
    name: 'Plomberie',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop',
    description: 'Réparation et installation plomberie',
    category: 'Technique',
    basePrice: 5000,
    selectionMode: 'single',
    options: [
      { id: 'fuite',      title: 'Détection de fuite',       description: 'Localisation et réparation de fuites visibles ou cachées',                  image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop', priceFrom: 15000 },
      { id: 'robinet',    title: 'Réparation de robinet',    description: 'Remplacement joint, cartouche ou robinet complet',                          image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=200&fit=crop', priceFrom: 8000 },
      { id: 'debouchage', title: 'Débouchage canalisation',  description: 'Débouchage WC, évier, douche et canalisations principales',                 image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 25000 },
      { id: 'chauffeeau', title: 'Installation chauffe-eau', description: 'Pose ou remplacement de chauffe-eau électrique ou solaire',                  image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', priceFrom: 45000 },
      { id: 'joint',      title: 'Remplacement de joint',    description: 'Joints d\'étanchéité salle de bain, cuisine, tuyauterie',                    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=200&fit=crop', priceFrom: 5000 },
    ],
  },
  {
    id: 'electricite',
    name: 'Électricité',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
    description: 'Installation et réparation électrique',
    category: 'Technique',
    basePrice: 3000,
    selectionMode: 'multiple',
    options: [
      { id: 'ampoule',   title: 'Remplacement ampoule',     description: 'Ampoule LED, néon, spot encastré ou plafonnier',                            image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=300&h=200&fit=crop', priceFrom: 3000 },
      { id: 'interrupteur', title: 'Réparation interrupteur', description: 'Interrupteur simple, va-et-vient, variateur',                              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 5000 },
      { id: 'prise',     title: 'Réparation prise',         description: 'Prise murale, multiprise, prise de sol',                                    image: 'https://images.unsplash.com/photo-1558618047-f4c3f8c9c93e?w=300&h=200&fit=crop', priceFrom: 8000 },
      { id: 'tableau',   title: 'Mise à niveau tableau',    description: 'Remplacement disjoncteur, mise aux normes tableau électrique',               image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop', priceFrom: 45000 },
    ],
  },
  {
    id: 'climatisation',
    name: 'Climatisation',
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1631567091596-a1c0c8c4c0f3?w=600&h=400&fit=crop',
    description: 'Installation et entretien climatisation',
    category: 'Technique',
    basePrice: 8000,
    selectionMode: 'single',
    options: [
      { id: 'installation', title: 'Installation climatiseur',  description: 'Pose complète unité intérieure et extérieure (split)',                   image: 'https://images.unsplash.com/photo-1631567091596-a1c0c8c4c0f3?w=300&h=200&fit=crop', priceFrom: 85000 },
      { id: 'entretien',    title: 'Entretien climatiseur',     description: 'Nettoyage filtres, vérification gaz, révision annuelle',                image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', priceFrom: 15000 },
      { id: 'recharge',     title: 'Recharge gaz',             description: 'Appoint fluide frigorigène R32, R410A',                                  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 12000 },
      { id: 'depannage',    title: 'Dépannage',                description: 'Diagnostic panne et réparation rapide',                                   image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop', priceFrom: 10000 },
    ],
  },
  {
    id: 'maconnerie',
    name: 'Maçonnerie',
    icon: '🧱',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
    description: 'Travaux de maçonnerie et construction',
    category: 'Construction',
    basePrice: 20000,
    selectionMode: 'multiple',
    options: [
      { id: 'mur',       title: 'Construction de mur',      description: 'Briques, parpaings ou pierres de taille',                                   image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop', priceFrom: 45000 },
      { id: 'fissures',  title: 'Réparation de fissures',   description: 'Traitement structurel intérieur ou extérieur',                              image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=200&fit=crop', priceFrom: 20000 },
      { id: 'chape',     title: 'Chape de sol',             description: 'Nivellement de surface et lissage avant carrelage',                        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 35000 },
    ],
  },
  {
    id: 'menuiserie',
    name: 'Menuiserie',
    icon: '🪵',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600&h=400&fit=crop',
    description: 'Fabrication et pose de menuiserie',
    category: 'Construction',
    basePrice: 10000,
    selectionMode: 'multiple',
    options: [
      { id: 'meuble',    title: 'Réparation de meuble',     description: 'Chaises, tables, armoires abîmées ou cassées',                              image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop', priceFrom: 10000 },
      { id: 'porte',     title: 'Pose de porte',            description: 'Portes intérieures et extérieures, encadrement inclus',                    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 25000 },
      { id: 'rabotage',  title: 'Rabotage',                 description: 'Ajustement et lissage des surfaces en bois',                               image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop', priceFrom: 15000 },
    ],
  },
  {
    id: 'peinture',
    name: 'Peinture',
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop',
    description: 'Peinture intérieure et extérieure',
    category: 'Décoration',
    basePrice: 15000,
    selectionMode: 'multiple',
    options: [
      { id: 'murale',    title: 'Peinture murale',          description: 'Peinture intérieure murs et plinthes, toutes couleurs',                     image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&h=200&fit=crop', priceFrom: 15000 },
      { id: 'plafond',   title: 'Peinture plafond',         description: 'Blanc ou couleur, enduit de lissage inclus si nécessaire',                 image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 12000 },
      { id: 'retouches', title: 'Retouches',                description: 'Réparation taches, impacts, fissures superficielles',                      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', priceFrom: 8000 },
      { id: 'facade',    title: 'Ravalement de façade',     description: 'Nettoyage et peinture extérieure, protection durée',                       image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&h=200&fit=crop', priceFrom: 60000 },
    ],
  },
  {
    id: 'nettoyage',
    name: 'Nettoyage',
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
    description: 'Nettoyage professionnel à domicile',
    category: 'Entretien',
    basePrice: 10000,
    selectionMode: 'single',
    options: [
      { id: 'complet',   title: 'Nettoyage complet',        description: 'Entretien approfondi de tout le domicile, toutes pièces',                  image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop', priceFrom: 25000 },
      { id: 'travaux',   title: 'Nettoyage après travaux',  description: 'Remise en état après chantier ou rénovation complète',                    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 35000 },
      { id: 'vitres',    title: 'Lavage vitres',            description: 'Nettoyage professionnel des surfaces vitrées intérieur/extérieur',        image: 'https://images.unsplash.com/photo-1527515637462-cff94edd652e?w=300&h=200&fit=crop', priceFrom: 15000 },
    ],
  },
  {
    id: 'mecanique',
    name: 'Mécanique',
    icon: '🔩',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop',
    description: 'Réparation et entretien automobile',
    category: 'Automobile',
    basePrice: 10000,
    selectionMode: 'multiple',
    options: [
      { id: 'vidange',      title: 'Vidange',               description: 'Huile moteur & filtre inclus, toutes marques',                             image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=300&h=200&fit=crop', priceFrom: 15000 },
      { id: 'diagnostic',   title: 'Diagnostic moteur',     description: 'Analyse complète des capteurs et systèmes électroniques',                 image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', priceFrom: 10000 },
      { id: 'freins',       title: 'Changement de freins',  description: 'Plaquettes avant ou arrière, disques si nécessaire',                      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 20000 },
    ],
  },
  {
    id: 'metallerie',
    name: 'Métallerie',
    icon: '⚙️',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop',
    description: 'Travaux de métallerie et ferronnerie',
    category: 'Construction',
    basePrice: 25000,
    selectionMode: 'multiple',
    options: [
      { id: 'grille',    title: 'Grilles de sécurité',      description: 'Pose grilles fenêtres, portes et accès extérieurs',                       image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=200&fit=crop', priceFrom: 35000 },
      { id: 'portail',   title: 'Portail',                  description: 'Fabrication portail coulissant ou battant sur mesure',                    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 80000 },
      { id: 'garde',     title: 'Garde-corps / Rampe',      description: 'Rampe escalier, balcon, inox ou fer forgé',                              image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', priceFrom: 45000 },
    ],
  },
  {
    id: 'informatique',
    name: 'Informatique',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    description: 'Dépannage et assistance informatique',
    category: 'Tech',
    basePrice: 5000,
    selectionMode: 'single',
    options: [
      { id: 'depannage',     title: 'Dépannage PC/Mac',     description: 'Diagnostic et résolution de pannes matérielles et logicielles',          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop', priceFrom: 10000 },
      { id: 'reseau',        title: 'Installation réseau',  description: 'Configuration box, routeur Wi-Fi, répéteur, câblage réseau',             image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', priceFrom: 15000 },
      { id: 'recuperation',  title: 'Récupération données', description: 'Fichiers perdus, disque endommagé, formatage accidentel',               image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', priceFrom: 25000 },
      { id: 'antivirus',     title: 'Antivirus/Malware',    description: 'Suppression virus, nettoyage complet, protection installée',            image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&h=200&fit=crop', priceFrom: 8000 },
      { id: 'logiciels',     title: 'Installation logiciels',description: 'Windows, Office, drivers, configuration complète',                      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=200&fit=crop', priceFrom: 5000 },
    ],
  },
]

export function getServiceConfig(id: string): ServiceConfig | undefined {
  return SERVICES_CONFIG.find(s => s.id === id)
}

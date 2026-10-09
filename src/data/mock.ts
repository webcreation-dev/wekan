import { Service, Provider, Message, ServiceOption, Appointment, Invoice, PromoBanner, Notification, Testimonial, Realisation, Conversation } from '@/types'

export const MOCK_SERVICES: Service[] = [
  { id: 'maconnerie',    name: 'Maçonnerie',    icon: '🧱', image: '/maconnerie.jpeg', description: 'Travaux de maçonnerie et construction', category: 'Construction', basePrice: 45000 },
  { id: 'menuiserie',    name: 'Menuiserie',    icon: '🪵', image: '/meuniserie.jpeg', description: 'Fabrication et pose de menuiserie', category: 'Construction', basePrice: 15000 },
  { id: 'peinture',      name: 'Peinture',      icon: '🎨', image: '/peinture.jpeg', description: 'Peinture intérieure et extérieure', category: 'Décoration', basePrice: 67500 },
  { id: 'electricite',   name: 'Électricité',   icon: '⚡', image: '/electricite.jpeg', description: 'Installation et réparation électrique', category: 'Technique', basePrice: 45000 },
  { id: 'plomberie',     name: 'Plomberie',     icon: '🔧', image: '/plomberie.jpeg', description: 'Installation et réparation plomberie', category: 'Technique', basePrice: 15000 },
  { id: 'climatisation', name: 'Climatisation', icon: '❄️', image: '/clim.jpeg', description: 'Installation et entretien climatisation', category: 'Technique', basePrice: 15000 },
  { id: 'nettoyage',     name: 'Nettoyage',     icon: '🧹', image: '/nettoyage.jpeg', description: 'Nettoyage professionnel à domicile', category: 'Entretien', basePrice: 25000 },
  { id: 'metallerie',    name: 'Métallerie',    icon: '⚙️', image: '/metallerie.jpeg', description: 'Travaux de métallerie et ferronnerie', category: 'Construction', basePrice: 35000 },
  { id: 'mecanique',     name: 'Mécanique',     icon: '🔩', image: '/mecanique.jpeg', description: 'Réparation et entretien automobile', category: 'Automobile', basePrice: 25000 },
  { id: 'informatique',  name: 'Informatique',  icon: '💻', image: '/informatique.jpeg', description: 'Dépannage et assistance informatique', category: 'Tech', basePrice: 10000 },
]

export const MOCK_BANNERS: PromoBanner[] = [
  { id: 'promo-clim', badge: 'PROMO', badgeColor: 'bg-blue-500', title: '-20% sur la Climatisation', subtitle: 'Offre spéciale saison chaude', image: 'https://images.unsplash.com/photo-1631567091596-a1c0c8c4c0f3?w=800&h=400&fit=crop', serviceId: 'climatisation' },
  { id: 'promo-verified', badge: 'VÉRIFIÉ', badgeColor: 'bg-green-500', title: 'Experts certifiés', subtitle: 'Les meilleurs pros du Bénin', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop' },
  { id: 'promo-plomberie', badge: 'NOUVEAU', badgeColor: 'bg-purple-500', title: 'Plomberie express', subtitle: 'Intervention en moins de 2h à Cotonou', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=400&fit=crop', serviceId: 'plomberie' },
]

export const MOCK_NETTOYAGE_OPTIONS: ServiceOption[] = [
  { id: 'complet', title: 'Nettoyage complet', description: 'Entretien approfondi de tout le domicile', price: 25000 },
  { id: 'travaux', title: 'Nettoyage après travaux', description: 'Remise en état après chantier ou rénovation', price: 35000 },
  { id: 'vitres',  title: 'Lavage vitres', description: 'Nettoyage professionnel des surfaces vitrées', price: 15000 },
]

export const MOCK_PROVIDER: Provider = {
  id: 'marcus', name: 'Marcus Johnson', role: 'Électricien Certifié',
  avatar: '/elec1.jpeg',
  rating: 4.9, reviewCount: 128, verified: true, eta: '14:25', price: '85 000 FCFA',
  distance: '2.4 km', service: 'Remplacement tableau',
  lat: 6.3654, lng: 2.4183,
}

export const MOCK_CHAT_PROVIDER: Provider = {
  id: 'marc', name: 'Marc Lefebvre', role: 'Électricien',
  avatar: '/elec1.jpeg',
  rating: 4.8, reviewCount: 97, verified: true, online: true,
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'conv-1', providerName: 'Marc Ahossi', providerRole: 'Électricien', providerAvatar: '/elec2.jpeg', online: true, lastMessage: 'Est-ce que cela a sauté après avoir allumé un appareil ?', lastTime: '14:05', unread: 2, serviceType: 'Électricité' },
  { id: 'conv-2', providerName: 'Alex Migan', providerRole: 'Plombier', providerAvatar: '/plom1.jpeg', online: false, lastMessage: 'Je serai là demain à 10h.', lastTime: 'Hier', unread: 0, serviceType: 'Plomberie' },
  { id: 'conv-3', providerName: 'Sophie Adjovi', providerRole: 'Agent de nettoyage', providerAvatar: '/nettoy1.jpeg', online: false, lastMessage: 'Merci pour votre confiance !', lastTime: 'Lun', unread: 0, serviceType: 'Nettoyage' },
]

export const MOCK_MESSAGES: Message[] = [
  { id: '1', text: "Bonjour Marc, j'ai un souci avec mon tableau électrique. Ça a disjoncté d'un coup dans le salon.", sender: 'user', time: '14:02' },
  { id: '2', text: '', sender: 'user', time: '14:02', image: '/tableau.jpeg' },
  { id: '3', text: 'Voici une photo du disjoncteur qui a sauté.', sender: 'user', time: '14:03', read: true },
  { id: '4', text: "Bonjour ! Je vois bien le souci sur la photo. C'est le circuit des prises du salon.", sender: 'provider', time: '14:05' },
  { id: '5', text: "Est-ce que cela a sauté juste après avoir allumé un appareil en particulier ? (Four, radiateur, etc.)", sender: 'provider', time: '14:05' },
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'success', title: 'Prestataire assigné !', body: 'Marc Ahossi prendra en charge votre demande d\'électricité. Il sera là le 23 Mar à 14h25.', time: "À l'instant", read: false, serviceId: 'electricite' },
  { id: 'n2', type: 'info', title: 'Demande reçue', body: 'Votre demande de plomberie a bien été reçue. Nous recherchons un expert dans votre zone à Cotonou.', time: 'Il y a 2h', read: false },
  { id: 'n3', type: 'promo', title: '🎉 Offre spéciale', body: '-20% sur tous les services de climatisation cette semaine. Profitez-en avant le 31 Mars !', time: 'Hier', read: true, serviceId: 'climatisation' },
  { id: 'n4', type: 'success', title: 'Service terminé ✓', body: 'Votre service de nettoyage a été complété avec succès. Notez votre prestataire Sophie Martin.', time: 'Lun', read: true },
  { id: 'n5', type: 'warning', title: 'Rappel RDV', body: 'N\'oubliez pas votre rendez-vous plomberie demain à 10h00 - 45 Avenue du Commerce, Cotonou.', time: 'Dim', read: true },
]

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Ama Koffi', avatar: '/p1.jpeg', rating: 5, comment: 'Service impeccable ! Le plombier est venu en moins de 2h. Très professionnel.', service: 'Plomberie', date: 'Mar 2025' },
  { id: 't2', name: 'Yao Agbessi', avatar: '/p2.jpeg', rating: 5, comment: 'Excellent travail de peinture. Résultat parfait, je recommande vivement HomeFix.', service: 'Peinture', date: 'Fév 2025' },
  { id: 't3', name: 'Fatou Diallo', avatar: '/p3.jpeg', rating: 4, comment: 'Très bon service de nettoyage. Mon appartement est comme neuf. Prix raisonnable.', service: 'Nettoyage', date: 'Fév 2025' },
]

export const MOCK_REALISATIONS: Realisation[] = [
  { id: 'r1', title: 'Rénovation électrique complète', serviceId: 'electricite', serviceName: 'Électricité', image: '/real1.jpg', location: 'Cotonou, Plateau' },
  { id: 'r2', title: 'Installation climatisation bureau', serviceId: 'climatisation', serviceName: 'Climatisation', image: '/real2.jpg', location: 'Cotonou, Fidjrossè' },
  { id: 'r3', title: 'Peinture villa 5 pièces', serviceId: 'peinture', serviceName: 'Peinture', image: '/real3.jpg', location: 'Abomey-Calavi' },
]

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', service: 'Électricité – Remplacement tableau', serviceId: 'electricite', providerName: 'Marc Ahossi', providerRole: 'Électricien Certifié', providerAvatar: '/elec1.jpeg', date: "Aujourd'hui", time: '14:25', status: 'confirmed', price: '85 000 FCFA', address: '123 Rue des Jardins, Akpakpa, Cotonou' },
  { id: '2', service: 'Plomberie – Détection de fuite', serviceId: 'plomberie', providerName: 'Alex Migan', providerRole: 'Plombier Certifié', providerAvatar: '/plom1.jpeg', date: 'Demain', time: '10:00', status: 'pending', price: '15 000 FCFA', address: '45 Avenue Steinmetz, Cotonou' },
  { id: '3', service: 'Nettoyage – Nettoyage complet', serviceId: 'nettoyage', providerName: 'Sophie Adjovi', providerRole: 'Agent de nettoyage', providerAvatar: '/nettoy1.jpeg', date: '18 Mar 2025', time: '09:00', status: 'completed', price: '25 000 FCFA', address: '12 Rue Zogbo, Cotonou' },
]

export const MOCK_INVOICE: Invoice = {
  id: 'inv-10293', reference: 'FAC-10293', providerName: 'Marc Ahossi', providerRole: 'Électricien Certifié',
  providerAvatar: '/elec1.jpeg',
  missionNumber: '8821', date: '24 Oct, 2023', paymentMethod: 'Mobile Money',
  laborLines: [
    { label: "Main d'œuvre (2.5 h)", amount: 75000 },
    { label: 'Frais de Réservation', amount: 5000 },
    { label: "Déplacement d'urgence", amount: 10000 },
  ],
  materialLines: [
    { label: 'Câble Cuivre (10m)', sublabel: '1 250 FCFA / mètre', amount: 12500 },
    { label: 'Disjoncteur 20A', sublabel: 'Remplacement standard', amount: 8500 },
  ],
  subtotalLabor: 90000, subtotalMaterials: 21000, taxRate: 0.18, total: 130980,
}

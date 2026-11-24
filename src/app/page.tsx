'use client'

import { useState } from 'react'
import { Screen } from '@/types'
import MobileWrapper from '@/components/layout/MobileWrapper'
import SplashScreen from '@/components/screens/SplashScreen'
import LoginScreen from '@/components/screens/LoginScreen'
import RegisterScreen from '@/components/screens/RegisterScreen'
import HomeScreen from '@/components/screens/HomeScreen'
import AllServicesScreen from '@/components/screens/AllServicesScreen'
import RequestFlowScreen from '@/components/screens/RequestFlowScreen'
import type { BookingDetails } from '@/components/screens/ServiceScreen'
import ServicePage from '@/components/screens/ServicePage'
import PaymentScreen from '@/components/screens/PaymentScreen'
import ProviderTrackingScreen from '@/components/screens/ProviderTrackingScreen'
import ConversationsScreen from '@/components/screens/ConversationsScreen'
import ChatScreen from '@/components/screens/ChatScreen'
import InvoiceScreen from '@/components/screens/InvoiceScreen'
import RdvScreen from '@/components/screens/RdvScreen'
import ProfilScreen from '@/components/screens/ProfilScreen'
import NotificationsScreen from '@/components/screens/NotificationsScreen'
import AddressesScreen from '@/components/screens/AddressesScreen'
import { AideScreen, ConfidentialiteScreen, ParametresNotifScreen, PhoneScreen, CGUScreen } from '@/components/screens/SubPages'
import { appointmentsApi } from '@/services/api'
import { getServiceConfig } from '@/data/services-config'
import { useAuthStore } from '@/store/authStore'
import { useRequestsStore } from '@/store/requestsStore'

type AnyScreen = Screen | 'service-page' | 'phone' | 'cgu'

export default function Page() {
  const [screen, setScreen]               = useState<AnyScreen>('splash')
  const [selectedService, setSelectedService] = useState('nettoyage')
  const [servicePageId, setServicePageId]     = useState('plomberie')
  const [rdvTracking, setRdvTracking] = useState<{ requestId?: string; date: string; time: string } | null>(null)
  const [booking, setBooking] = useState<BookingDetails | null>(null)

  // Écran à ouvrir une fois connecté (l'inscription n'est demandée qu'au moment d'agir)
  const [afterAuth, setAfterAuth] = useState<AnyScreen>('home')
  const [authReturn, setAuthReturn] = useState<AnyScreen>('home')

  const PROTECTED: AnyScreen[] = ['service-detail', 'profil']

  const navigate = (target: AnyScreen, serviceId?: string) => {
    if (serviceId) setSelectedService(serviceId)
    if (PROTECTED.includes(target) && !useAuthStore.getState().isAuthenticated) {
      setAfterAuth(target)
      setAuthReturn(screen === 'login' || screen === 'register' ? authReturn : screen)
      setScreen('login')
      return
    }
    setScreen(target)
  }

  // Conversation ouverte (une demande = une conversation) et écran de retour
  const [chatRequestId, setChatRequestId] = useState<string | null>(null)
  const [chatReturn, setChatReturn] = useState<AnyScreen>('conversations')
  const openChat = (requestId: string) => {
    setChatRequestId(requestId)
    setChatReturn(screen)
    setScreen('chat')
  }

  const finishAuth = () => setScreen(afterAuth)
  const cancelAuth = () => setScreen(authReturn)

  const openServicePage = (id: string) => {
    setServicePageId(id)
    setScreen('service-page')
  }

  const confirmBooking = async () => {
    if (booking) {
      const service = getServiceConfig(booking.serviceId)
      const selectedOptions = service?.options
        .filter(option => booking.optionIds.includes(option.id))
        .map(option => option.title) ?? []

      await appointmentsApi.create({
        service: `${service?.name ?? 'Service'}${selectedOptions.length ? ` – ${selectedOptions.join(', ')}` : ''}`,
        serviceId: booking.serviceId,
        providerName: 'Marc Ahossi',
        providerRole: 'Prestataire certifié',
        providerAvatar: '/elec1.jpeg',
        date: booking.date,
        time: booking.time,
        status: 'confirmed',
        price: `${booking.totalPrice.toLocaleString('fr-FR')} FCFA`,
        address: booking.address,
      })
      setRdvTracking({ date: booking.date, time: booking.time })
    }
    navigate('provider-tracking')
  }

  return (
    <MobileWrapper>
      {screen === 'splash'            && <SplashScreen onFinish={() => navigate('home')} />}
      {screen === 'login'             && <LoginScreen onLogin={finishAuth} onGoRegister={() => navigate('register')} onClose={cancelAuth} />}
      {screen === 'register'          && <RegisterScreen onBack={() => navigate('login')} onSuccess={finishAuth} />}
      {screen === 'home'              && <HomeScreen onSelectService={id => navigate('service-detail', id)} onNavigate={s => navigate(s as AnyScreen)} />}
      {screen === 'all-services'      && <AllServicesScreen onBack={() => navigate('home')} onSelectService={id => navigate('service-detail', id)} />}
      {screen === 'service-page'      && <ServicePage serviceId={servicePageId} onBack={() => navigate('notifications')} onBook={() => navigate('service-detail', servicePageId)} />}
      {screen === 'service-detail'    && (
        <RequestFlowScreen
          key={selectedService}
          serviceId={selectedService}
          onBack={() => navigate('home')}
          onSeeRequests={() => navigate('rdv')}
          onHome={() => navigate('home')}
        />
      )}
      {screen === 'payment'           && (
        <PaymentScreen
          booking={booking}
          onBack={() => navigate('service-detail')}
          onConfirm={confirmBooking}
        />
      )}
      {screen === 'provider-tracking' && (
        <ProviderTrackingScreen
          onBack={() => navigate(rdvTracking?.requestId ? 'rdv' : 'home')}
          onMessage={() => {
            // Conversation de la demande suivie (sinon, la première demande planifiée)
            const requests = useRequestsStore.getState().requests
            const target = requests.find(r => r.id === rdvTracking?.requestId) ?? requests.find(r => r.status === 'scheduled')
            if (target) openChat(target.id)
            else navigate('conversations')
          }}
          appointmentDate={rdvTracking?.date ?? "Aujourd'hui"}
          appointmentTime={rdvTracking?.time ?? '14:25'}
        />
      )}
      {screen === 'conversations'     && <ConversationsScreen onNavigate={s => navigate(s as AnyScreen)} onOpenChat={openChat} />}
      {screen === 'chat'              && <ChatScreen requestId={chatRequestId} onBack={() => navigate(chatReturn)} />}
      {screen === 'invoice'           && <InvoiceScreen onBack={() => navigate('rdv')} />}
      {screen === 'rdv'               && (
        <RdvScreen
          onNavigate={s => navigate(s as AnyScreen)}
          onViewTracking={appt => { setRdvTracking(appt); navigate('provider-tracking') }}
          onViewInvoice={() => navigate('invoice')}
          onOpenChat={openChat}
        />
      )}
      {screen === 'notifications'     && <NotificationsScreen onNavigate={s => navigate(s as AnyScreen)} onViewServicePage={openServicePage} />}
      {screen === 'profil'            && <ProfilScreen onNavigate={s => navigate(s as AnyScreen)} onLogout={() => { useAuthStore.getState().logout(); navigate('home') }} />}
      {screen === 'adresses'          && <AddressesScreen onBack={() => navigate('profil')} />}
      {screen === 'aide'              && <AideScreen onBack={() => navigate('profil')} />}
      {screen === 'confidentialite'   && <ConfidentialiteScreen onBack={() => navigate('profil')} />}
      {screen === 'parametres-notif'  && <ParametresNotifScreen onBack={() => navigate('profil')} />}
      {screen === 'phone'             && <PhoneScreen onBack={() => navigate('profil')} />}
      {screen === 'cgu'               && <CGUScreen onBack={() => navigate('profil')} />}
    </MobileWrapper>
  )
}

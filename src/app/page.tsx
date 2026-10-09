'use client'

import { useState } from 'react'
import { Screen } from '@/types'
import MobileWrapper from '@/components/layout/MobileWrapper'
import SplashScreen from '@/components/screens/SplashScreen'
import LoginScreen from '@/components/screens/LoginScreen'
import RegisterScreen from '@/components/screens/RegisterScreen'
import HomeScreen from '@/components/screens/HomeScreen'
import AllServicesScreen from '@/components/screens/AllServicesScreen'
import ServiceScreen from '@/components/screens/ServiceScreen'
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

type AnyScreen = Screen | 'service-page' | 'phone' | 'cgu'

export default function Page() {
  const [screen, setScreen]               = useState<AnyScreen>('splash')
  const [selectedService, setSelectedService] = useState('nettoyage')
  const [servicePageId, setServicePageId]     = useState('plomberie')
  const [rdvTracking, setRdvTracking] = useState<{ date: string; time: string } | null>(null)
  const [booking, setBooking] = useState<BookingDetails | null>(null)

  const navigate = (target: AnyScreen, serviceId?: string) => {
    if (serviceId) setSelectedService(serviceId)
    setScreen(target)
  }

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
      {screen === 'splash'            && <SplashScreen onFinish={() => navigate('login')} />}
      {screen === 'login'             && <LoginScreen onLogin={() => navigate('home')} onGoRegister={() => navigate('register')} />}
      {screen === 'register'          && <RegisterScreen onBack={() => navigate('login')} onSuccess={() => navigate('home')} />}
      {screen === 'home'              && <HomeScreen onSelectService={id => navigate('service-detail', id)} onNavigate={s => navigate(s as AnyScreen)} />}
      {screen === 'all-services'      && <AllServicesScreen onBack={() => navigate('home')} onSelectService={id => navigate('service-detail', id)} />}
      {screen === 'service-page'      && <ServicePage serviceId={servicePageId} onBack={() => navigate('notifications')} onBook={() => navigate('service-detail', servicePageId)} />}
      {screen === 'service-detail'    && (
        <ServiceScreen
          serviceId={selectedService}
          onBack={() => navigate('home')}
          onProceed={details => {
            setBooking(details)
            navigate('payment')
          }}
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
          onBack={() => navigate('home')}
          onMessage={() => navigate('chat')}
          appointmentDate={rdvTracking?.date ?? "Aujourd'hui"}
          appointmentTime={rdvTracking?.time ?? '14:25'}
        />
      )}
      {screen === 'conversations'     && <ConversationsScreen onNavigate={s => navigate(s as AnyScreen)} onOpenChat={() => navigate('chat')} />}
      {screen === 'chat'              && <ChatScreen onBack={() => navigate('conversations')} />}
      {screen === 'invoice'           && <InvoiceScreen onBack={() => navigate('rdv')} />}
      {screen === 'rdv'               && (
        <RdvScreen
          onNavigate={s => navigate(s as AnyScreen)}
          onViewTracking={appt => { setRdvTracking(appt); navigate('provider-tracking') }}
          onViewInvoice={() => navigate('invoice')}
        />
      )}
      {screen === 'notifications'     && <NotificationsScreen onNavigate={s => navigate(s as AnyScreen)} onViewServicePage={openServicePage} />}
      {screen === 'profil'            && <ProfilScreen onNavigate={s => navigate(s as AnyScreen)} onLogout={() => navigate('login')} />}
      {screen === 'adresses'          && <AddressesScreen onBack={() => navigate('profil')} />}
      {screen === 'aide'              && <AideScreen onBack={() => navigate('profil')} />}
      {screen === 'confidentialite'   && <ConfidentialiteScreen onBack={() => navigate('profil')} />}
      {screen === 'parametres-notif'  && <ParametresNotifScreen onBack={() => navigate('profil')} />}
      {screen === 'phone'             && <PhoneScreen onBack={() => navigate('profil')} />}
      {screen === 'cgu'               && <CGUScreen onBack={() => navigate('profil')} />}
    </MobileWrapper>
  )
}

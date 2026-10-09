'use client'

/**
 * ServiceDetailScreen — Router vers ServiceScreen unifié
 * Plus d'écrans individuels par service, tout passe par ServiceScreen
 */
import ServiceScreen from './ServiceScreen'
import type { BookingDetails } from './ServiceScreen'

interface ServiceDetailScreenProps {
  serviceId: string
  onBack:    () => void
  onProceed: (booking?: BookingDetails) => void
}

export default function ServiceDetailScreen({ serviceId, onBack, onProceed }: ServiceDetailScreenProps) {
  return (
    <ServiceScreen
      serviceId={serviceId}
      onBack={onBack}
      onProceed={(booking) => onProceed(booking)}
    />
  )
}

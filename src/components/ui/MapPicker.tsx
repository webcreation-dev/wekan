'use client'

import { useEffect, useRef, useCallback } from 'react'

interface MapPickerProps {
  lat: number
  lng: number
  onLocationChange?: (lat: number, lng: number) => void
  readonly?: boolean
  height?: number
  zoom?: number
  markerLabel?: string
}

export default function MapPicker({
  lat, lng, onLocationChange, readonly = false, height = 200, zoom = 14, markerLabel
}: MapPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const initializedRef = useRef(false)

  const initMap = useCallback(async () => {
    if (initializedRef.current || !containerRef.current) return
    initializedRef.current = true

    // Load leaflet CSS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      // Wait a tick for CSS to register
      await new Promise(r => setTimeout(r, 50))
    }

    const L = (await import('leaflet')).default

    // Fix default marker icons (webpack breaks the paths)
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    const map = L.map(containerRef.current!, {
      center: [lat, lng],
      zoom,
      zoomControl: true,
      scrollWheelZoom: !readonly,
      dragging: !readonly,
      doubleClickZoom: !readonly,
      touchZoom: !readonly,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Custom blue pin icon
    const blueIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          position:relative;
          width:32px;height:42px;
        ">
          <div style="
            width:32px;height:32px;
            border-radius:50% 50% 50% 0;
            background:#2d7ff9;
            border:3px solid white;
            transform:rotate(-45deg);
            box-shadow:0 3px 12px rgba(45,127,249,0.5);
          "></div>
          <div style="
            position:absolute;top:6px;left:6px;
            width:12px;height:12px;
            border-radius:50%;
            background:white;
            transform:rotate(45deg);
          "></div>
        </div>`,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    })

    const marker = L.marker([lat, lng], {
      icon: blueIcon,
      draggable: !readonly,
    }).addTo(map)

    if (markerLabel) {
      marker.bindPopup(markerLabel, { closeButton: false })
      if (!readonly) marker.openPopup()
    }

    markerRef.current = marker
    mapRef.current = map

    if (!readonly && onLocationChange) {
      marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng()
        onLocationChange(pos.lat, pos.lng)
      })
      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng)
        onLocationChange(e.latlng.lat, e.latlng.lng)
        if (markerLabel) marker.openPopup()
      })
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    initMap()
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
        initializedRef.current = false
      }
    }
  }, []) // eslint-disable-line

  // Update marker + view when lat/lng change (provider moving)
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return
    markerRef.current.setLatLng([lat, lng])
    mapRef.current.panTo([lat, lng], { animate: true, duration: 0.5 })
  }, [lat, lng])

  return (
    <div
      ref={containerRef}
      style={{
        height: height === 9999 ? '100%' : height,
        width: '100%',
        minHeight: height === 9999 ? 200 : height,
        borderRadius: '0',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0,
        background: '#e8f4e8',
      }}
    />
  )
}

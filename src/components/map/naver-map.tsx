"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { MapPin } from "lucide-react"

export interface MapMarker {
  id: string
  lat: number
  lng: number
  title: string
  price: string
  category: "real_estate" | "ma"
  slug?: string
}

interface NaverMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: MapMarker[]
  onMarkerClick?: (id: string) => void
  selectedMarkerId?: string | null
}

declare global {
  interface Window {
    naver: typeof naver
  }
}

/* eslint-disable @typescript-eslint/no-namespace */
declare namespace naver {
  namespace maps {
    class Map {
      constructor(el: HTMLElement, options: MapOptions)
      setCenter(latlng: LatLng): void
      panTo(latlng: LatLng, options?: unknown): void
    }
    class LatLng {
      constructor(lat: number, lng: number)
    }
    class Marker {
      constructor(options: MarkerOptions)
      setMap(map: Map | null): void
      getPosition(): LatLng
    }
    class InfoWindow {
      constructor(options: InfoWindowOptions)
      open(map: Map, marker: Marker): void
      close(): void
    }
    interface MapOptions {
      center: LatLng
      zoom: number
      minZoom?: number
      zoomControl?: boolean
      zoomControlOptions?: { position: unknown }
    }
    interface MarkerOptions {
      position: LatLng
      map: Map
      icon?: {
        content: string
        size?: Size
        anchor?: Point
      }
    }
    interface InfoWindowOptions {
      content: string
      borderWidth?: number
      backgroundColor?: string
      borderColor?: string
      anchorSize?: Size
      anchorSkew?: boolean
      pixelOffset?: Point
    }
    class Size {
      constructor(w: number, h: number)
    }
    class Point {
      constructor(x: number, y: number)
    }
    namespace Event {
      function addListener(target: unknown, type: string, listener: () => void): void
    }
    const Position: {
      TOP_RIGHT: unknown
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export function NaverMap({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 11,
  markers = [],
  onMarkerClick,
  selectedMarkerId,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<naver.maps.Map | null>(null)
  const markersRef = useRef<naver.maps.Marker[]>([])
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [noApiKey, setNoApiKey] = useState(false)

  const getMarkerColor = (category: string) =>
    category === "real_estate" ? "#3b82f6" : "#8b5cf6"

  const createMarkerIcon = (price: string, category: string, isSelected: boolean) => {
    const color = getMarkerColor(category)
    const scale = isSelected ? 1.15 : 1
    return {
      content: `
        <div style="transform: scale(${scale}); transition: transform 0.2s; cursor: pointer;">
          <div style="
            background: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: ${isSelected ? "2px solid white" : "1px solid rgba(255,255,255,0.3)"};
          ">${price}</div>
          <div style="
            width: 0; height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid ${color};
            margin: 0 auto;
          "></div>
        </div>
      `,
      anchor: new window.naver.maps.Point(30, 40),
    }
  }

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.naver) return

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom,
      minZoom: 7,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    })

    mapInstanceRef.current = map

    // Create markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    markers.forEach((markerData) => {
      const isSelected = selectedMarkerId === markerData.id
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(markerData.lat, markerData.lng),
        map,
        icon: createMarkerIcon(markerData.price, markerData.category, isSelected),
      })

      const categoryLabel = markerData.category === "real_estate" ? "부동산" : "M&A"
      const categoryColor = markerData.category === "real_estate" ? "#3b82f6" : "#8b5cf6"

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="
            padding: 12px 16px;
            min-width: 200px;
            background: #111827;
            color: #e2e8f0;
            border-radius: 8px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 6px;">${markerData.title}</div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="
                background: ${categoryColor}33;
                color: ${categoryColor};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
              ">${categoryLabel}</span>
              <span style="color: ${categoryColor}; font-weight: 700; font-size: 14px;">${markerData.price}</span>
            </div>
            ${markerData.slug ? `<a href="/deals/${markerData.slug}" style="
              color: #3b82f6;
              font-size: 12px;
              text-decoration: none;
            ">상세보기 &rarr;</a>` : ""}
          </div>
        `,
        borderWidth: 0,
        backgroundColor: "transparent",
        borderColor: "transparent",
        anchorSize: new window.naver.maps.Size(0, 0),
        anchorSkew: false,
      })

      window.naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close()
        }
        infoWindow.open(map, marker)
        infoWindowRef.current = infoWindow
        onMarkerClick?.(markerData.id)
      })

      markersRef.current.push(marker)
    })

    setLoaded(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, zoom, markers, selectedMarkerId, onMarkerClick])

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
    if (!clientId) {
      setNoApiKey(true)
      return
    }

    // Check if already loaded
    if (window.naver?.maps) {
      initMap()
      return
    }

    const script = document.createElement("script")
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`
    script.async = true
    script.onload = () => initMap()
    document.head.appendChild(script)

    return () => {
      markersRef.current.forEach((m) => m.setMap(null))
    }
  }, [initMap])

  // Pan to selected marker
  useEffect(() => {
    if (!selectedMarkerId || !mapInstanceRef.current) return
    const idx = markers.findIndex((m) => m.id === selectedMarkerId)
    if (idx >= 0) {
      const m = markers[idx]
      mapInstanceRef.current.panTo(new window.naver.maps.LatLng(m.lat, m.lng))
    }
  }, [selectedMarkerId, markers])

  if (noApiKey) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-border bg-card md:h-[500px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <MapPin className="size-10 opacity-30" />
          <p className="text-sm">네이버 지도 API 키를 설정하면 지도가 표시됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="h-[400px] w-full rounded-xl md:h-[500px]"
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm">지도 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  )
}

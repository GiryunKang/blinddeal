"use client"

import { useState } from "react"
import { Camera, Video, Eye } from "lucide-react"
import { ImageGallery } from "./image-gallery"

interface MediaSectionProps {
  images: string[]
  title: string
  virtualTourUrl?: string
  videoUrl?: string
}

export function MediaSection({
  images,
  title,
  virtualTourUrl,
  videoUrl,
}: MediaSectionProps) {
  const hasTabs = !!virtualTourUrl || !!videoUrl
  const [activeTab, setActiveTab] = useState<"photos" | "tour" | "video">(
    "photos"
  )

  // If only images and no other media, just show the gallery
  if (!hasTabs) {
    return <ImageGallery images={images} title={title} />
  }

  const tabs = [
    { key: "photos" as const, label: "사진", icon: Camera },
    ...(virtualTourUrl
      ? [{ key: "tour" as const, label: "가상 투어", icon: Eye }]
      : []),
    ...(videoUrl
      ? [{ key: "video" as const, label: "영상", icon: Video }]
      : []),
  ]

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex rounded-lg border border-border bg-card">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              } ${tab.key === tabs[0].key ? "rounded-l-lg" : ""} ${
                tab.key === tabs[tabs.length - 1].key ? "rounded-r-lg" : ""
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === "photos" && (
        <ImageGallery images={images} title={title} />
      )}

      {activeTab === "tour" && (
        <div className="overflow-hidden rounded-xl border border-border">
          {virtualTourUrl ? (
            <iframe
              src={virtualTourUrl}
              className="aspect-[16/9] w-full"
              allowFullScreen
              title="가상 투어"
            />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-card">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Eye className="size-10 opacity-30" />
                <p className="text-sm">가상 투어 준비 중</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "video" && (
        <div className="overflow-hidden rounded-xl border border-border">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              className="aspect-[16/9] w-full"
              allowFullScreen
              title="영상"
            />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center bg-card">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Video className="size-10 opacity-30" />
                <p className="text-sm">영상 준비 중</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import VenipakTracker from "@/components/tracking/VenipakTracker"

export const metadata = {
  title: "Track Your Package - Gyvagaudziaspastai",
  description: "Track your Venipak package delivery status and location",
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <VenipakTracker />
    </div>
  )
}
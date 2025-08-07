import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Heading, Text } from "@radix-ui/themes"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Heading size="6" className="text-gray-900 mb-2">
            Mokėjimas sėkmingas!
          </Heading>
          <Text size="4" color="gray">
            Jūsų užsakymas buvo sėkmingai apmokėtas per Paysera sistemą.
          </Text>
        </div>
        
        <div className="space-y-4">
          <a 
            href="/orders" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Peržiūrėti užsakymus
          </a>
          <a 
            href="/" 
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors inline-block"
          >
            Grįžti į parduotuvę
          </a>
        </div>
      </div>
    </div>
  )
}
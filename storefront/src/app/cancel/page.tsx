import { Suspense } from "react"
import { Heading, Text } from "@radix-ui/themes"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <Heading size="6" className="text-gray-900 mb-2">
            Mokėjimas atšauktas
          </Heading>
          <Text size="4" color="gray">
            Jūsų mokėjimas buvo atšauktas arba nepavyko jo apdoroti.
          </Text>
        </div>
        
        <div className="space-y-4">
          <a 
            href="/checkout" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Bandyti dar kartą
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
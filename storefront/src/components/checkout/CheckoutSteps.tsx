import { Flex, Text, Box } from "@radix-ui/themes"
import { Check, MapPin, Truck, CreditCard, Eye } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

interface Step {
  id: string
  label: string
  number: number
  icon: any
  description?: string
}

interface CheckoutStepsProps {
  currentStep: number
  onStepClick?: (index: number) => void
}

export default function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  const { t } = useTranslation();
  
  const steps: Step[] = [
    { id: 'shipping', label: t('checkout.steps.shipping'), number: 1, icon: MapPin, description: 'Pristatymo adresas' },
    { id: 'shippingMethod', label: t('checkout.steps.shippingMethod'), number: 2, icon: Truck, description: 'Pristatymo būdas' },
    { id: 'payment', label: t('checkout.steps.payment'), number: 3, icon: CreditCard, description: 'Mokėjimo būdas' },
    { id: 'review', label: t('checkout.steps.review'), number: 4, icon: Eye, description: 'Užsakymo peržiūra' },
  ];
  return (
    <Box className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
      {/* Mobile view - current step only */}
      <Box className="block lg:hidden">
        {steps.map((step, index) => {
          if (index + 1 !== currentStep) return null;
          const Icon = step.icon;
          
          return (
            <Flex key={step.id} align="center" gap="4">
              <div className="rounded-full p-3 bg-blue-600 text-white">
                <Icon size={18} />
              </div>
              <Box>
                <Text size="3" weight="bold" color="blue">
                  {step.label}
                </Text>
                <Text size="1" color="gray">
                  Žingsnis {currentStep} iš {steps.length} • {step.description}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </Box>
      
      {/* Desktop view - all steps */}
      <Box className="hidden lg:block">
        <Flex justify="between" className="relative">
          {/* Enhanced Progress Line */}
          <div className="absolute left-0 top-6 h-1 w-full bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Enhanced Steps */}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep;
            
            return (
              <div 
                key={step.id} 
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => onStepClick && index + 1 <= currentStep && onStepClick(index + 1)}
              >
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-medium
                    transition-all duration-300 transform group-hover:scale-105
                    ${
                      isCompleted
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                        : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200'
                          : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : isCurrent ? (
                    <Icon size={20} />
                  ) : (
                    <Icon size={18} className="opacity-60" />
                  )}
                </div>
                
                <Box className="mt-3 text-center max-w-24">
                  <Text 
                    size="2" 
                    weight={isCurrent ? "bold" : "medium"}
                    className={`block mb-1 ${
                      isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </Text>
                  <Text 
                    size="1" 
                    className={`${
                      isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </Text>
                </Box>
              </div>
            );
          })}
        </Flex>
      </Box>
    </Box>
  )
}
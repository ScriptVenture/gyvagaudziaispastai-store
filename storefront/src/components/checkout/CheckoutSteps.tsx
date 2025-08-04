import { Flex, Text } from "@radix-ui/themes"
import { Check } from "lucide-react"

interface Step {
  id: string
  label: string
  number: number
}

interface CheckoutStepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
}

export default function CheckoutSteps({ steps, currentStep, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="w-full">
      <Flex justify="between" className="relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-5 h-0.5 w-full bg-gray-200">
          <div 
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="relative z-10 flex flex-col items-center cursor-pointer"
            onClick={() => onStepClick && index <= currentStep && onStepClick(index)}
          >
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium
                transition-all duration-300
                ${index < currentStep 
                  ? 'bg-green-600 text-white' 
                  : index === currentStep 
                    ? 'bg-green-600 text-white ring-4 ring-green-100'
                    : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {index < currentStep ? (
                <Check size={20} />
              ) : (
                step.number
              )}
            </div>
            <Text 
              size="1" 
              className={`mt-2 text-center ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step.label}
            </Text>
          </div>
        ))}
      </Flex>
    </div>
  )
}
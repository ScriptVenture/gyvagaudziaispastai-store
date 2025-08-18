"use client"

import { useState } from 'react'
import { Heading, Text, Button, Card, Badge, Tabs, Container } from '@radix-ui/themes'
import { Play, CheckCircle, AlertTriangle, Shield, Clock, MapPin, Phone, Download, ArrowRight } from 'lucide-react'
import { brandColors } from '@/utils/colors'

const guideSteps = [
  {
    id: 1,
    title: "Vietos parinkimas",
    description: "Išsirinkite tinkamą vietą spąstui pastatyti",
    icon: MapPin,
    tips: [
      "Raskite gyvūno pėdsakus ar ekskrementus",
      "Pastatykite spąstą gyvūno kelyje",
      "Vengkite triukšmingų vietų",
      "Užtikrinkite, kad vieta būtų saugi"
    ]
  },
  {
    id: 2,
    title: "Spąsto paruošimas",
    description: "Tinkamai paruoškite spąstą naudojimui",
    icon: Shield,
    tips: [
      "Patikrinkite spąsto mechanizmą",
      "Išvalykite spąstą nuo pašalinių kvapų",
      "Užtikrinkite, kad durys laisvai atsidaro ir užsidaro",
      "Paruoškite tinkamą masalą"
    ]
  },
  {
    id: 3,
    title: "Masalo pasirinkimas",
    description: "Išsirinkite tinkamą masalą gyvūnui privilioti",
    icon: Play,
    tips: [
      "Katėms ir šunims - mėsos produktai",
      "Graužikams - riešutai, sėklos",
      "Laukiniams gyvūnams - vaisiai ar daržovės",
      "Vengkite per stiprių kvapų"
    ]
  },
  {
    id: 4,
    title: "Spąsto pastatymas",
    description: "Saugiai ir efektyviai pastatykite spąstą",
    icon: CheckCircle,
    tips: [
      "Pastatykite spąstą ant lygaus paviršiaus",
      "Užtikrinkite spąsto stabilumą",
      "Masalą padėkite spąsto gale",
      "Patikrinkite durų mechanizmą"
    ]
  },
  {
    id: 5,
    title: "Stebėjimas",
    description: "Reguliariai tikrinkite spąstą",
    icon: Clock,
    tips: [
      "Tikrinkite spąstą kas 2-4 valandas",
      "Būkite atsargūs artėdami prie spąsto",
      "Pasirūpinkite vandens šaltiniu šiltą dieną",
      "Dokumentuokite rezultatus"
    ]
  },
  {
    id: 6,
    title: "Saugus išleidimas",
    description: "Saugiai išleiskite sugautą gyvūną",
    icon: ArrowRight,
    tips: [
      "Dėvėkite apsaugines pirštines",
      "Išleidimo vieta turi būti toli nuo namų",
      "Atidarykite duris ir atsitraukite",
      "Stebėkite gyvūno elgesį"
    ]
  }
]

const animalGuides = {
  cats: {
    title: "Katės ir kačiukai",
    icon: "🐱",
    color: "#F59E0B",
    tips: [
      "Naudokite mėsos kvapą turintį masalą",
      "Pastatykite spąstą ramiam mieste",
      "Tikrinkite kas 1-2 valandas",
      "Būkite kantrūs - katės atsargios"
    ]
  },
  dogs: {
    title: "Šunys ir šuniukai",
    icon: "🐕",
    color: "#3B82F6",
    tips: [
      "Naudokite šunų maistą ar skanėstus",
      "Spąstas turi būti pakankamai didelis",
      "Šunys greitai reaguoja į masalą",
      "Po sugavimo raminamai kalbėkite"
    ]
  },
  rodents: {
    title: "Graužikai",
    icon: "🐁",
    color: "#10B981",
    tips: [
      "Sėklos, riešutai ar duona puikiai tinka",
      "Maži spąstai efektyvesni",
      "Pastatykite prie sienų ar kampų",
      "Tikrinkite dažnai - graužikai greitai sugaunami"
    ]
  },
  wildlife: {
    title: "Laukiniai gyvūnai",
    icon: "🦝",
    color: "#EF4444",
    tips: [
      "Vaisiai ar daržovės kaip masalas",
      "Pastatykite toliau nuo namų",
      "Būkite ypač atsargūs",
      "Gali prireikti profesionalų pagalbos"
    ]
  }
}

export default function GuidePage() {
  const [activeAnimalTab, setActiveAnimalTab] = useState('cats')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 lg:py-6">
        
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Heading 
            size="4" 
            className="mb-2 sm:mb-3 md:mb-4 !text-lg sm:!text-xl md:!text-2xl lg:!text-3xl leading-tight px-1" 
            style={{ color: brandColors.primary }}
          >
            Kaip naudoti gyvūnų spąstus
          </Heading>
          <Text 
            size="1" 
            color="gray" 
            className="mb-3 sm:mb-4 mx-auto leading-relaxed !text-xs sm:!text-sm md:!text-base px-2"
          >
            Išsamus vadovas, kaip saugiai ir efektyviai naudoti humaniškus gyvūnų spąstus. 
            Sekite šiuos žingsnius optimaliam rezultatui.
          </Text>
          
          <div className="flex flex-wrap justify-center gap-1 px-2">
            <Badge size="1" className="bg-green-100 text-green-800 !px-1.5 !py-0.5 !text-xs">
              100% Humaniška
            </Badge>
            <Badge size="1" className="bg-blue-100 text-blue-800 !px-1.5 !py-0.5 !text-xs">
              Profesionalūs patarimai
            </Badge>
            <Badge size="1" className="bg-purple-100 text-purple-800 !px-1.5 !py-0.5 !text-xs">
              Saugus metodas
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8">
          {[
            { number: "6", label: "Žingsniai", color: brandColors.primary },
            { number: "98%", label: "Sėkmės rodiklis", color: "#10B981" },
            { number: "2-4h", label: "Tikrinimo dažnis", color: "#F59E0B" },
            { number: "0", label: "Žala gyvūnui", color: "#EF4444" }
          ].map((stat, index) => (
            <Card key={index} className="text-center !p-1.5 sm:!p-2 md:!p-3 bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <Text 
                size="3" 
                weight="bold" 
                className="block mb-0.5 !text-base sm:!text-lg md:!text-xl" 
                style={{ color: stat.color }}
              >
                {stat.number}
              </Text>
              <Text size="1" color="gray" className="leading-tight !text-xs">
                {stat.label}
              </Text>
            </Card>
          ))}
        </div>

        {/* Step by Step Guide */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heading 
            size="3" 
            className="mb-3 sm:mb-4 !text-base sm:!text-lg md:!text-xl text-center sm:text-left px-1" 
            style={{ color: brandColors.primary }}
          >
            6 žingsnių vadovas
          </Heading>
          
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {guideSteps.map((step) => {
              const IconComponent = step.icon
              return (
                <Card key={step.id} className="!p-2 sm:!p-3 md:!p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                    {/* Step Number and Icon */}
                    <div className="flex-shrink-0 text-center sm:text-left">
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold mb-1 sm:mb-2 mx-auto sm:mx-0 text-xs sm:text-sm"
                        style={{ backgroundColor: brandColors.primary }}
                      >
                        {step.id}
                      </div>
                      <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mx-auto sm:mx-0" style={{ color: brandColors.primary }} />
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 min-w-0 px-1">
                      <Heading 
                        size="2" 
                        className="mb-1 sm:mb-2 !text-sm sm:!text-base md:!text-lg text-center sm:text-left" 
                        style={{ color: brandColors.primary }}
                      >
                        {step.title}
                      </Heading>
                      <Text 
                        size="1" 
                        color="gray" 
                        className="mb-2 sm:mb-3 leading-relaxed !text-xs sm:!text-sm text-center sm:text-left"
                      >
                        {step.description}
                      </Text>
                      
                      <div className="space-y-1 sm:space-y-2">
                        {step.tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-1.5 sm:gap-2">
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500 flex-shrink-0 mt-1" />
                            <Text size="1" color="gray" className="leading-relaxed !text-xs">
                              {tip}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Animal-Specific Guides */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Heading 
            size="3" 
            className="mb-3 sm:mb-4 !text-base sm:!text-lg md:!text-xl text-center sm:text-left px-1" 
            style={{ color: brandColors.primary }}
          >
            Spąstų tipai pagal gyvūną
          </Heading>

          <Tabs.Root value={activeAnimalTab} onValueChange={setActiveAnimalTab}>
            {/* Tab Navigation */}
            <Tabs.List className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-1.5 mb-3 sm:mb-4 !bg-transparent !p-0">
              {Object.entries(animalGuides).map(([key, guide]) => (
                <Tabs.Trigger 
                  key={key} 
                  value={key} 
                  className={`text-center border-2 rounded-lg hover:shadow-sm transition-all duration-300 !p-1.5 sm:!p-2 md:!p-3 bg-white hover:bg-gray-50 ${
                    activeAnimalTab === key ? 'shadow-md scale-105' : ''
                  }`}
                  style={{ 
                    borderColor: activeAnimalTab === key ? guide.color : '#e5e7eb'
                  }}
                >
                  <div className="text-lg sm:text-xl md:text-2xl mb-1">{guide.icon}</div>
                  <Text 
                    size="1" 
                    weight="medium" 
                    className="leading-tight !text-xs"
                    style={{ color: guide.color }}
                  >
                    {guide.title}
                  </Text>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* Tab Content */}
            {Object.entries(animalGuides).map(([key, guide]) => (
              <Tabs.Content key={key} value={key}>
                <Card className="!p-2 sm:!p-3 md:!p-4 bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="text-xl sm:text-2xl md:text-3xl">{guide.icon}</div>
                    <div className="text-center sm:text-left px-1">
                      <Heading 
                        size="2" 
                        className="mb-1 !text-sm sm:!text-base md:!text-lg" 
                        style={{ color: guide.color }}
                      >
                        {guide.title}
                      </Heading>
                      <Text size="1" color="gray" className="!text-xs sm:!text-sm">
                        Specialūs patarimai šiai gyvūnų grupei
                      </Text>
                    </div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    {guide.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-1.5 sm:gap-2 px-1">
                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 mt-1" style={{ color: guide.color }} />
                        <Text size="1" className="leading-relaxed !text-xs">
                          {tip}
                        </Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>

        {/* Safety Warnings */}
        <Card className="!p-2 sm:!p-3 md:!p-4 mb-4 sm:mb-6 md:mb-8 bg-amber-50 border-2 border-amber-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-3 sm:mb-4">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
            <Heading size="2" className="text-amber-800 !text-sm sm:!text-base md:!text-lg text-center sm:text-left px-1">
              Saugos nurodymai
            </Heading>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="px-1">
              <Text size="1" weight="medium" className="text-amber-800 mb-2 !text-xs sm:!text-sm">
                Prieš naudojimą:
              </Text>
              <div className="space-y-1 sm:space-y-2">
                {[
                  "Patikrinkite vietinės įstatymų",
                  "Įsitikinkite, kad spąstas tinkamas",
                  "Paruoškite apsaugos priemones",
                  "Suplanuokite gyvūno išleidimą"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <Text size="1" className="text-amber-700 !text-xs">
                      {item}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-1">
              <Text size="1" weight="medium" className="text-amber-800 mb-2 !text-xs sm:!text-sm">
                Naudojimo metu:
              </Text>
              <div className="space-y-1 sm:space-y-2">
                {[
                  "Niekada nepalikite spąsto be priežiūros ilgam",
                  "Dėvėkite apsaugines pirštines",
                  "Būkite atsargūs su laukiniais gyvūnais",
                  "Esant problemoms, kreipkitės į specialistus"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    <Text size="1" className="text-amber-700 !text-xs">
                      {item}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="!p-2 sm:!p-3 md:!p-4 text-center bg-blue-50 border-2 border-blue-200 shadow-sm">
          <Heading 
            size="2" 
            className="mb-2 !text-sm sm:!text-base md:!text-lg px-1" 
            style={{ color: brandColors.primary }}
          >
            Reikia pagalbos?
          </Heading>
          <Text 
            size="1" 
            color="gray" 
            className="mb-3 sm:mb-4 leading-relaxed mx-auto !text-xs sm:!text-sm px-2"
          >
            Susisiekite su mūsų ekspertais dėl individualių konsultacijų
          </Text>
          
          <div className="flex flex-col sm:flex-row justify-center gap-1.5 sm:gap-2">
            <Button 
              size="1" 
              className="w-full sm:w-auto !px-2 sm:!px-3 !py-1.5 !text-xs" 
              style={{ backgroundColor: brandColors.primary }}
            >
              <Phone className="w-3 h-3 mr-1" />
              Skambinti ekspertams
            </Button>
            <Button 
              variant="outline" 
              size="1" 
              className="w-full sm:w-auto !px-2 sm:!px-3 !py-1.5 !text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Atsisiųsti PDF vadovą
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

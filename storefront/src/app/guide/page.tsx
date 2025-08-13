"use client"

import { useState } from 'react'
import { Heading, Text, Button, Card, Flex, Badge, Tabs, Box, Container } from '@radix-ui/themes'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Container size="4" className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <Heading size={{ initial: "6", sm: "7", lg: "8" }} className="mb-3 sm:mb-4" style={{ color: brandColors.primary }}>
            Kaip naudoti gyvūnų spąstus
          </Heading>
          <Text size={{ initial: "3", sm: "4" }} color="gray" className="mb-4 sm:mb-6 max-w-none sm:max-w-3xl mx-auto leading-relaxed">
            Išsamus vadovas, kaip saugiai ir efektyviai naudoti humaniškus gyvūnų spąstus. 
            Sekite šiuos žingsnius optimaliam rezultatui.
          </Text>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Badge size={{ initial: "1", sm: "2" }} className="bg-green-100 text-green-800 px-2 py-1">
              100% Humaniška
            </Badge>
            <Badge size={{ initial: "1", sm: "2" }} className="bg-blue-100 text-blue-800 px-2 py-1">
              Profesionalūs patarimai
            </Badge>
            <Badge size={{ initial: "1", sm: "2" }} className="bg-purple-100 text-purple-800 px-2 py-1">
              Saugus metodas
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          {[
            { number: "6", label: "Žingsniai", color: brandColors.primary },
            { number: "98%", label: "Sėkmės rodiklis", color: "#10B981" },
            { number: "2-4h", label: "Tikrinimo dažnis", color: "#F59E0B" },
            { number: "0", label: "Žala gyvūnui", color: "#EF4444" }
          ].map((stat, index) => (
            <Card key={index} className="text-center p-3 sm:p-4 lg:p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
              <Text size={{ initial: "5", sm: "6", lg: "7" }} weight="bold" className="block mb-1 sm:mb-2" style={{ color: stat.color }}>
                {stat.number}
              </Text>
              <Text size={{ initial: "1", sm: "2" }} color="gray" className="leading-tight">
                {stat.label}
              </Text>
            </Card>
          ))}
        </div>

        {/* Step by Step Guide */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <Heading size={{ initial: "5", sm: "6" }} className="mb-4 sm:mb-6" style={{ color: brandColors.primary }}>
            6 žingsnių vadovas
          </Heading>
          
          <div className="space-y-4 sm:space-y-6">
            {guideSteps.map((step) => (
              <Card key={step.id} className="p-4 sm:p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="flex gap-4 sm:gap-6">
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0 text-center">
                    <div 
                      className="rounded-full flex items-center justify-center text-white font-bold mb-2 sm:mb-3 mx-auto"
                      style={{ 
                        backgroundColor: brandColors.primary,
                        width: '40px',
                        height: '40px',
                        fontSize: '16px'
                      }}
                    >
                      {step.id}
                    </div>
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" style={{ color: brandColors.primary }} />
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <Heading size={{ initial: "3", sm: "4" }} className="mb-2 sm:mb-3" style={{ color: brandColors.primary }}>
                      {step.title}
                    </Heading>
                    <Text size={{ initial: "2", sm: "3" }} color="gray" className="mb-3 sm:mb-4 leading-relaxed">
                      {step.description}
                    </Text>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3">
                      {step.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <Text size={{ initial: "1", sm: "2" }} color="gray" className="leading-relaxed">
                            {tip}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Animal-Specific Guides */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <Heading size={{ initial: "5", sm: "6" }} className="mb-4 sm:mb-6" style={{ color: brandColors.primary }}>
            Spąstų tipai pagal gyvūną
          </Heading>

          <Tabs.Root value={activeAnimalTab} onValueChange={setActiveAnimalTab}>
            <Tabs.List className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
              {Object.entries(animalGuides).map(([key, guide]) => (
                <Tabs.Trigger 
                  key={key} 
                  value={key} 
                  className="text-center border-2 rounded-xl hover:shadow-md transition-all p-3 sm:p-4 lg:p-6 bg-white hover:bg-gray-50 data-[state=active]:border-current data-[state=active]:shadow-lg"
                  style={{ borderColor: activeAnimalTab === key ? guide.color : '#e5e7eb' }}
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{guide.icon}</div>
                  <Text size={{ initial: "1", sm: "2" }} weight="medium" style={{ color: guide.color }} className="leading-tight">
                    {guide.title}
                  </Text>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {Object.entries(animalGuides).map(([key, guide]) => (
              <Tabs.Content key={key} value={key}>
                <Card className="p-4 sm:p-6 bg-white shadow-md">
                  <div className="flex items-center gap-4 mb-4 sm:mb-6">
                    <div className="text-3xl sm:text-4xl lg:text-5xl">{guide.icon}</div>
                    <div>
                      <Heading size={{ initial: "4", sm: "5" }} style={{ color: guide.color }} className="mb-1">
                        {guide.title}
                      </Heading>
                      <Text size={{ initial: "2", sm: "3" }} color="gray">
                        Specialūs patarimai šiai gyvūnų grupei
                      </Text>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {guide.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: guide.color }} />
                        <Text size={{ initial: "1", sm: "2" }} className="leading-relaxed">
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
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8 lg:mb-12 bg-amber-50 border-amber-200 shadow-md">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 flex-shrink-0" />
            <Heading size={{ initial: "4", sm: "5" }} className="text-amber-800">
              Saugos nurodymai
            </Heading>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Text size={{ initial: "2", sm: "3" }} weight="medium" className="text-amber-800 mb-3 sm:mb-4">
                Prieš naudojimą:
              </Text>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Patikrinkite vietinės įstatymų
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Įsitikinkite, kad spąstas tinkamas
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Paruoškite apsaugos priemones
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Suplanuokite gyvūno išleidimą
                  </Text>
                </div>
              </div>
            </div>
            <div>
              <Text size={{ initial: "2", sm: "3" }} weight="medium" className="text-amber-800 mb-3 sm:mb-4">
                Naudojimo metu:
              </Text>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Niekada nepalikite spąsto be priežiūros ilgam
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Dėvėkite apsaugines pirštines
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Būkite atsargūs su laukiniais gyvūnais
                  </Text>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <Text size={{ initial: "1", sm: "2" }} className="text-amber-700">
                    Esant problemoms, kreipkitės į specialistus
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="p-4 sm:p-6 text-center bg-blue-50 border-blue-200 shadow-md">
          <Heading size={{ initial: "4", sm: "5" }} className="mb-2 sm:mb-3" style={{ color: brandColors.primary }}>
            Reikia pagalbos?
          </Heading>
          <Text size={{ initial: "2", sm: "3" }} color="gray" className="mb-4 sm:mb-6 leading-relaxed">
            Susisiekite su mūsų ekspertais dėl individualių konsultacijų
          </Text>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button size={{ initial: "2", sm: "3" }} style={{ backgroundColor: brandColors.primary }} className="w-full sm:w-auto">
              <Phone className="w-4 h-4 mr-2" />
              Skambinti ekspertams
            </Button>
            <Button variant="outline" size={{ initial: "2", sm: "3" }} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Atsisiųsti PDF vadovą
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}
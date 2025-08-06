"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Heading, Text, Button, Card, Flex, Badge, Tabs } from '@radix-ui/themes'
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <Heading size="8" className="mb-4" style={{ color: brandColors.primary }}>
          Kaip naudoti gyvūnų spąstus
        </Heading>
        <Text size="4" color="gray" className="mb-6 max-w-3xl mx-auto">
          Išsamus vadovas, kaip saugiai ir efektyviai naudoti humaniškus gyvūnų spąstus. 
          Sekite šiuos žingsnius optimaliam rezultatui.
        </Text>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Badge size="2" className="bg-green-100 text-green-800">
            100% Humaniška
          </Badge>
          <Badge size="2" className="bg-blue-100 text-blue-800">
            Profesionalūs patarimai
          </Badge>
          <Badge size="2" className="bg-purple-100 text-purple-800">
            Saugus metodas
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { number: "6", label: "Žingsniai", color: brandColors.primary },
          { number: "98%", label: "Sėkmės rodiklis", color: "#10B981" },
          { number: "2-4h", label: "Tikrinimo dažnis", color: "#F59E0B" },
          { number: "0", label: "Žala gyvūnui", color: "#EF4444" }
        ].map((stat, index) => (
          <Card key={index} className="text-center p-4">
            <Text size="6" weight="bold" style={{ color: stat.color }}>
              {stat.number}
            </Text>
            <Text size="2" color="gray">
              {stat.label}
            </Text>
          </Card>
        ))}
      </div>

      {/* Step by Step Guide */}
      <div className="mb-12">
        <Heading size="6" className="mb-6" style={{ color: brandColors.primary }}>
          6 žingsnių vadovas
        </Heading>
        
        <div className="space-y-6">
          {guideSteps.map((step) => (
            <Card key={step.id} className="p-6">
              <Flex gap="4">
                {/* Step Number and Icon */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    {step.id}
                  </div>
                  <div className="flex justify-center">
                    <step.icon className="w-6 h-6" style={{ color: brandColors.primary }} />
                  </div>
                </div>
                
                {/* Step Content */}
                <div className="flex-1">
                  <Heading size="4" className="mb-2" style={{ color: brandColors.primary }}>
                    {step.title}
                  </Heading>
                  <Text size="3" color="gray" className="mb-4">
                    {step.description}
                  </Text>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.tips.map((tip, index) => (
                      <Flex key={index} align="center" gap="2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <Text size="2" color="gray">{tip}</Text>
                      </Flex>
                    ))}
                  </div>
                </div>
              </Flex>
            </Card>
          ))}
        </div>
      </div>

      {/* Animal-Specific Guides */}
      <div className="mb-12">
        <Heading size="6" className="mb-6" style={{ color: brandColors.primary }}>
          Patarimai pagal gyvūno tipą
        </Heading>

        <Tabs.Root value={activeAnimalTab} onValueChange={setActiveAnimalTab}>
          <Tabs.List className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {Object.entries(animalGuides).map(([key, guide]) => (
              <Tabs.Trigger key={key} value={key} className="p-4 text-center border rounded-lg hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{guide.icon}</div>
                <Text size="2" weight="medium" style={{ color: guide.color }}>
                  {guide.title}
                </Text>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {Object.entries(animalGuides).map(([key, guide]) => (
            <Tabs.Content key={key} value={key}>
              <Card className="p-6">
                <Flex align="center" gap="4" className="mb-4">
                  <div className="text-4xl">{guide.icon}</div>
                  <div>
                    <Heading size="5" style={{ color: guide.color }}>
                      {guide.title}
                    </Heading>
                    <Text size="3" color="gray">
                      Specialūs patarimai šiai gyvūnų grupei
                    </Text>
                  </div>
                </Flex>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guide.tips.map((tip, index) => (
                    <Flex key={index} align="center" gap="2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: guide.color }} />
                      <Text size="2">{tip}</Text>
                    </Flex>
                  ))}
                </div>
              </Card>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>

      {/* Safety Warnings */}
      <Card className="p-6 mb-12" style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}>
        <Flex align="center" gap="3" className="mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <Heading size="5" className="text-amber-800">
            Saugos nurodymai
          </Heading>
        </Flex>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Text size="3" weight="medium" className="text-amber-800 mb-2">
              Prieš naudojimą:
            </Text>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• Patikrinkite vietinės įstatymų</li>
              <li>• Įsitikinkite, kad spąstas tinkamas</li>
              <li>• Paruoškite apsaugos priemones</li>
              <li>• Suplanuokite gyvūno išleidimą</li>
            </ul>
          </div>
          <div>
            <Text size="3" weight="medium" className="text-amber-800 mb-2">
              Naudojimo metu:
            </Text>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• Niekada nepalikite spąsto be priežiūros ilgam</li>
              <li>• Dėvėkite apsaugines pirštines</li>
              <li>• Būkite atsargūs su laukiniais gyvūnais</li>
              <li>• Esant problemoms, kreipkitės į specialistus</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Contact Support */}
      <Card className="p-6 text-center" style={{ backgroundColor: "#F0F9FF", borderColor: brandColors.primary }}>
        <Heading size="5" className="mb-2" style={{ color: brandColors.primary }}>
          Reikia pagalbos?
        </Heading>
        <Text size="3" color="gray" className="mb-4">
          Mūsų ekspertai visada pasirengę padėti jums saugiai ir efektyviai naudoti gyvūnų spąstus.
        </Text>
        
        <Flex justify="center" gap="3">
          <Button size="3" style={{ backgroundColor: brandColors.primary }}>
            <Phone className="w-4 h-4" />
            Skambinti ekspertams
          </Button>
          <Button variant="outline" size="3">
            <Download className="w-4 h-4" />
            Atsisiųsti PDF vadovą
          </Button>
        </Flex>
      </Card>
    </div>
  )
}
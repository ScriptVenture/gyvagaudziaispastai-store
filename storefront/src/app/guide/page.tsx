"use client"

import { useState } from 'react'
import Image from 'next/image'
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
    <Container size="4" className="py-8">
      {/* Header */}
      <Box className="text-center mb-8">
        <Heading size="8" className="mb-4" style={{ color: brandColors.primary }}>
          Kaip naudoti gyvūnų spąstus
        </Heading>
        <Text size="4" color="gray" className="mb-6 max-w-3xl mx-auto">
          Išsamus vadovas, kaip saugiai ir efektyviai naudoti humaniškus gyvūnų spąstus. 
          Sekite šiuos žingsnius optimaliam rezultatui.
        </Text>
        
        <Flex justify="center" wrap="wrap" gap="2">
          <Badge size="2" className="bg-green-100 text-green-800">
            100% Humaniška
          </Badge>
          <Badge size="2" className="bg-blue-100 text-blue-800">
            Profesionalūs patarimai
          </Badge>
          <Badge size="2" className="bg-purple-100 text-purple-800">
            Saugus metodas
          </Badge>
        </Flex>
      </Box>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { number: "6", label: "Žingsniai", color: brandColors.primary },
            { number: "98%", label: "Sėkmės rodiklis", color: "#10B981" },
            { number: "2-4h", label: "Tikrinimo dažnis", color: "#F59E0B" },
            { number: "0", label: "Žala gyvūnui", color: "#EF4444" }
          ].map((stat, index) => (
            <Card key={index} className="text-center p-2 sm:p-3 md:p-4 bg-white min-h-[60px] sm:min-h-[80px]">
              <Text size="4" weight="bold" className="text-lg sm:text-xl md:text-2xl" style={{ color: stat.color }}>
                {stat.number}
              </Text>
              <Text size="1" color="gray" className="text-xs sm:text-sm mobile-text-wrap">
                {stat.label}
              </Text>
            </Card>
          ))}
        </div>

      {/* Step by Step Guide */}
      <Box className="mb-8 md:mb-12">
        <Heading size="6" className="mb-4 md:mb-6" style={{ color: brandColors.primary }}>
          6 žingsnių vadovas
        </Heading>
        
        <Box style={{ gap: '16px 0' }}>
          {guideSteps.map((step) => (
            <Card key={step.id} className="p-4 md:p-6 mb-4 md:mb-6">
              <Flex gap="4">
                {/* Step Number and Icon */}
                <Box className="flex-shrink-0">
                  <Box 
                    className="rounded-full flex items-center justify-center text-white font-bold"
                    style={{ 
                      backgroundColor: brandColors.primary,
                      width: '32px',
                      height: '32px',
                      fontSize: '14px'
                    }}
                    mb="2"
                  >
                    {step.id}
                  </Box>
                  <Flex justify="center">
                    <step.icon className="w-4 h-4 md:w-6 md:h-6" style={{ color: brandColors.primary }} />
                  </Flex>
                </Box>
                
                {/* Step Content */}
                <Box className="flex-1">
                  <Heading size="4" className="mb-1 md:mb-2" style={{ color: brandColors.primary }}>
                    {step.title}
                  </Heading>
                  <Text size="3" color="gray" className="mb-3 md:mb-4">
                    {step.description}
                  </Text>
                  
                  <Box className="grid grid-cols-1 lg:grid-cols-2 gap-1 md:gap-2">
                    {step.tips.map((tip, index) => (
                      <Flex key={index} align="center" gap="2">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                        <Text size={{ initial: "1", md: "2" }} color="gray">{tip}</Text>
                      </Flex>
                    ))}
                  </Box>
                </Box>
              </Flex>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Animal-Specific Guides */}
            <Box className="mb-8 md:mb-12">
        <Heading size="6" className="mb-4 md:mb-6" style={{ color: brandColors.primary }}>
          Spąstų tipai pagal gyvūną
        </Heading>

        <Tabs.Root value={activeAnimalTab} onValueChange={setActiveAnimalTab}>
          <Tabs.List className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '8px', marginBottom: '24px' }}>
            {Object.entries(animalGuides).map(([key, guide]) => (
              <Tabs.Trigger key={key} value={key} className="text-center border rounded-lg hover:shadow-md transition-all p-2 md:p-4">
                <Box className="mb-1 md:mb-2" style={{ fontSize: '20px' }}>{guide.icon}</Box>
                <Text size={{ initial: "1", md: "2" }} weight="medium" style={{ color: guide.color }}>
                  {guide.title}
                </Text>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {Object.entries(animalGuides).map(([key, guide]) => (
            <Tabs.Content key={key} value={key}>
              <Card className="p-4 md:p-6">
                <Flex align="center" gap="4" className="mb-3 md:mb-4">
                  <Box style={{ fontSize: '32px' }}>{guide.icon}</Box>
                  <Box>
                    <Heading size={{ initial: "3", md: "4" }} style={{ color: guide.color }}>
                      {guide.title}
                    </Heading>
                    <Text size={{ initial: "2", md: "3" }} color="gray">
                      Specialūs patarimai šiai gyvūnų grupei
                    </Text>
                  </Box>
                </Flex>
                
                <Box className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
                  {guide.tips.map((tip, index) => (
                    <Flex key={index} align="center" gap="2">
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" style={{ color: guide.color }} />
                      <Text size={{ initial: "1", md: "2" }}>{tip}</Text>
                    </Flex>
                  ))}
                </Box>
              </Card>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Box>

      {/* Safety Warnings */}
      <Card className="p-4 md:p-6 mb-8 md:mb-12" style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}>
        <Flex align="center" gap="3" className="mb-3 md:mb-4">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
          <Heading size={{ initial: "4", md: "5" }} className="text-amber-800">
            Saugos nurodymai
          </Heading>
        </Flex>
        
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Box>
            <Text size={{ initial: "2", md: "3" }} weight="medium" className="text-amber-800" mb="2">
              Prieš naudojimą:
            </Text>
            <Box className="space-y-1 text-sm text-amber-700">
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Patikrinkite vietinės įstatymų</Text>
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Įsitikinkite, kad spąstas tinkamas</Text>
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Paruoškite apsaugos priemones</Text>
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Suplanuokite gyvūno išleidimą</Text>
            </Box>
          </Box>
          <Box>
            <Text size={{ initial: "2", md: "3" }} weight="medium" className="text-amber-800" mb="2">
              Naudojimo metu:
            </Text>
            <Box className="space-y-1">
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Niekada nepalikite spąsto be priežiūros ilgam</Text>
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Dėvėkite apsaugines pirštines</Text>
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Būkite atsargūs su laukiniais gyvūnais</Text>
              <Text size={{ initial: "1", md: "2" }} className="text-amber-700">• Esant problemoms, kreipkitės į specialistus</Text>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Contact Support */}
      <Card className="p-4 md:p-6 text-center" style={{ backgroundColor: "#F0F9FF", borderColor: brandColors.primary }}>
        <Heading size="4" className="mb-1 md:mb-2" style={{ color: brandColors.primary }}>
          Reikia pagalbos?
        </Heading>
        <Text size="3" color="gray" className="mb-3 md:mb-4">
          Susisiekite su mūsų ekspertais dėl individualių konsultacijų
        </Text>
        
        <Flex justify="center" gap="3" direction={{ initial: "column", sm: "row" }}>
          <Button size={{ initial: "2", md: "3" }} style={{ backgroundColor: brandColors.primary }}>
            <Phone className="w-3 h-3 md:w-4 md:h-4" />
            Skambinti ekspertams
          </Button>
          <Button variant="outline" size={{ initial: "2", md: "3" }}>
            <Download className="w-3 h-3 md:w-4 md:h-4" />
            Atsisiųsti PDF vadovą
          </Button>
        </Flex>
      </Card>
    </Container>
  );
}
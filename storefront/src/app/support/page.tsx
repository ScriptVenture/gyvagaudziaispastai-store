"use client"

import { useState } from 'react'
import { Heading, Text, Button, Card, Flex, Badge, TextField, TextArea, Select } from '@radix-ui/themes'
import { Phone, Mail, Clock, MessageCircle, FileText, HelpCircle, Truck, Shield, Award, ChevronRight, Send } from 'lucide-react'
import { brandColors } from '@/utils/colors'

const supportCategories = [
  {
    title: "Produktų informacija",
    icon: HelpCircle,
    color: "#10B981",
    description: "Klausimai apie spąstų savybes ir specifikacijas"
  },
  {
    title: "Pristatymas",
    icon: Truck,
    color: "#3B82F6", 
    description: "Pristatymo būdai, terminai ir kainos"
  },
  {
    title: "Garantijos",
    icon: Shield,
    color: "#F59E0B",
    description: "Garantijų sąlygos ir prekių grąžinimas"
  },
  {
    title: "Naudojimo patarimai",
    icon: Award,
    color: "#EF4444",
    description: "Kaip tinkamai naudoti gyvūnų spąstus"
  }
]

const faqs = [
  {
    question: "Ar spąstai tikrai humaniški?",
    answer: "Taip, visi mūsų spąstai yra sukurti taip, kad negražintų gyvūno. Jie uždengia gyvūną, bet netraumoja jo. Svarbu tik reguliariai tikrinti spąstus ir greitai išleisti sugautą gyvūną."
  },
  {
    question: "Kiek laiko galima laikyti gyvūną spąste?",
    answer: "Rekomenduojama tikrinti spąstus kas 2-4 valandas. Gyvūnas neturėtų būti laikomas spąste ilgiau nei 8 valandas. Karštą dieną reikia užtikrinti vandens šaltinį."
  },
  {
    question: "Kokie masalai efektyviausi?",
    answer: "Priklauso nuo gyvūno: katėms ir šunims - mėsos produktai, graužikams - riešutai ir sėklos, laukiniams gyvūnams - vaisiai ar daržovės. Vengkite per stiprių kvapų."
  },
  {
    question: "Ar reikia leidimo naudoti spąstus?",
    answer: "Lietuvoje gyvūnų spąstai leidžiami naudoti privačioje teritorijoje. Viešose vietose gali prireikti savivaldybės leidimo. Visada patikrinkite vietinius įstatymus."
  },
  {
    question: "Kiek kainuoja pristatymas?",
    answer: "Pristatymas nemokamas užsakymams nuo 75€. Mažesniems užsakymams pristatymo kaina 4.99€ Lietuvos teritorijoje."
  },
  {
    question: "Kaip grąžinti prekę?",
    answer: "Turite 30 dienų grąžinti nepažeistą prekę. Užpildykite grąžinimo formą mūsų svetainėje arba susisiekite su mumis telefonu."
  }
]

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Support form submitted:', contactForm)
    // Here you would typically send the form data to your backend
    alert('Jūsų žinutė išsiųsta! Atsakysime per 24 valandas.')
    setContactForm({ name: '', email: '', category: '', message: '' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <Heading size="8" className="mb-4" style={{ color: brandColors.primary }}>
          Pagalba ir palaikymas
        </Heading>
        <Text size="4" color="gray" className="mb-6 max-w-3xl mx-auto">
          Esame pasirengę padėti jums su bet kokiais klausimais apie gyvūnų spąstus. 
          Mūsų ekspertų komanda dirba 7 dienas per savaitę.
        </Text>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Badge size="2" className="bg-green-100 text-green-800 px-3 py-1">
            24/7 Palaikymas
          </Badge>
          <Badge size="2" className="bg-blue-100 text-blue-800 px-3 py-1">
            Ekspertų komanda
          </Badge>
          <Badge size="2" className="bg-purple-100 text-purple-800 px-3 py-1">
            Greitas atsakymas
          </Badge>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.primary}20` }}>
            <Phone className="w-8 h-8" style={{ color: brandColors.primary }} />
          </div>
          <Heading size="4" className="mb-2" style={{ color: brandColors.primary }}>
            Skambinkite
          </Heading>
          <Text size="3" color="gray" className="mb-4">
            Kalbėkite su mūsų ekspertais tiesiogiai
          </Text>
          <Text size="3" weight="bold" className="mb-2">
            +370 600 12345
          </Text>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Pr-Sk 8:00-20:00</span>
          </div>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.secondary}20` }}>
            <Mail className="w-8 h-8" style={{ color: brandColors.secondary }} />
          </div>
          <Heading size="4" className="mb-2" style={{ color: brandColors.primary }}>
            El. paštas
          </Heading>
          <Text size="3" color="gray" className="mb-4">
            Rašykite mums bet kuriuo metu
          </Text>
          <Text size="3" weight="bold" className="mb-2">
            info@spastai.lt
          </Text>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Atsakymas per 2h</span>
          </div>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `#10B98120` }}>
            <MessageCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <Heading size="4" className="mb-2" style={{ color: brandColors.primary }}>
            Gyvasis pokalbis
          </Heading>
          <Text size="3" color="gray" className="mb-4">
            Momentinis palaikymas internete
          </Text>
          <Button size="2" style={{ backgroundColor: '#10B981', color: 'white' }}>
            Pradėti pokalbį
          </Button>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Prisijungę dabar</span>
          </div>
        </Card>
      </div>

      {/* Support Categories */}
      <div className="mb-12">
        <Heading size="6" className="mb-6" style={{ color: brandColors.primary }}>
          Pagalbos kategorijos
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportCategories.map((category, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <Flex align="center" gap="3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                  <category.icon className="w-6 h-6" style={{ color: category.color }} />
                </div>
                <div className="flex-1">
                  <Heading size="3" className="mb-1" style={{ color: brandColors.primary }}>
                    {category.title}
                  </Heading>
                  <Text size="2" color="gray">
                    {category.description}
                  </Text>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Flex>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Heading size="6" className="mb-6" style={{ color: brandColors.primary }}>
            Susisiekite su mumis
          </Heading>
          
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                  Vardas *
                </Text>
                <TextField.Root
                  placeholder="Įveskite savo vardą"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                  El. paštas *
                </Text>
                <TextField.Root
                  type="email"
                  placeholder="jusu.el.pastas@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                  Kategorija *
                </Text>
                <Select.Root 
                  value={contactForm.category} 
                  onValueChange={(value) => setContactForm({...contactForm, category: value})}
                  required
                >
                  <Select.Trigger placeholder="Pasirinkite kategoriją" />
                  <Select.Content>
                    {supportCategories.map((category, index) => (
                      <Select.Item key={index} value={category.title}>
                        {category.title}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              
              <div>
                <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                  Žinutė *
                </Text>
                <TextArea
                  placeholder="Aprašykite savo klausimą ar problemą..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              
              <Button 
                size="3" 
                type="submit"
                className="w-full flex items-center justify-center gap-2 font-medium"
                style={{ 
                  backgroundColor: brandColors.primary,
                  color: 'white'
                }}
              >
                <Send className="w-4 h-4" />
                Siųsti žinutę
              </Button>
            </form>
          </Card>
        </div>

        {/* FAQ Section */}
        <div>
          <Heading size="6" className="mb-6" style={{ color: brandColors.primary }}>
            Dažni klausimai
          </Heading>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-4">
                <div className="mb-2">
                  <Flex align="center" gap="2">
                    <HelpCircle className="w-5 h-5 flex-shrink-0" style={{ color: brandColors.secondary }} />
                    <Heading size="3" style={{ color: brandColors.primary }}>
                      {faq.question}
                    </Heading>
                  </Flex>
                </div>
                <Text size="3" color="gray" className="leading-relaxed">
                  {faq.answer}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="p-6 mt-12 text-center" style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}>
        <Flex align="center" justify="center" gap="3" className="mb-4">
          <Phone className="w-6 h-6 text-amber-600" />
          <Heading size="5" className="text-amber-800">
            Skubus klausimas?
          </Heading>
        </Flex>
        <Text size="3" className="text-amber-700 mb-4">
          Jei turite skubų klausimą apie gyvūno sugavimą ar saugumą, skambinkite dabar:
        </Text>
        <Text size="5" weight="bold" className="text-amber-800 mb-4">
          +370 600 54321
        </Text>
        <Text size="2" className="text-amber-600">
          Disponuojame 24/7 skubiai pagalbai
        </Text>
      </Card>
    </div>
  )
}
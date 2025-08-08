"use client"

import { Container, Heading, Text, Box, Separator, Button, Switch } from "@radix-ui/themes"
import { Cookie, Check, X, Settings } from "lucide-react"

export default function CookiePolicyPage() {
  return (
    <Container size="3" className="py-8">
      <Heading size="8" className="mb-6">Slapukų (cookies) politika</Heading>
      
      <Box className="prose max-w-none">
        <Text size="3" className="mb-6 block">
          Paskutinį kartą atnaujinta: {new Date().toLocaleDateString('lt-LT')}
        </Text>

        <Separator size="4" className="my-6" />

        <Box className="space-y-6">
          <Box>
            <Heading size="5" className="mb-3">Kas yra slapukai?</Heading>
            <Text className="block mb-4">
              Slapukai (cookies) yra maži tekstiniai failai, kuriuos svetainės išsaugo Jūsų 
              kompiuteryje, planšetėje ar telefone. Jie padeda svetainei "atsiminti" informaciją 
              apie Jūsų apsilankymą, pavyzdžiui, kalbos pasirinkimą ar prekių krepšelio turinį.
            </Text>
            <Text className="block">
              Mūsų internetinė parduotuvė naudoja slapukus, kad suteiktų Jums geriausią 
              apsipirkimo patirtį ir užtikrintų svetainės funkcionalumą.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Kodėl naudojame slapukus?</Heading>
            <Text className="block mb-4">
              Slapukai padeda mums:
            </Text>
            <Box className="ml-4 space-y-2">
              <Text className="block">🛒 <strong>Išsaugoti krepšelio turinį</strong> - Jūsų pasirinktos prekės išlieka krepšelyje</Text>
              <Text className="block">🔐 <strong>Palaikyti sesiją</strong> - galite naršyti svetainę be pakartotinio prisijungimo</Text>
              <Text className="block">🌐 <strong>Atsiminti kalbą</strong> - pasirinkta kalba išlieka visuose puslapiuose</Text>
              <Text className="block">⚙️ <strong>Išsaugoti nustatymus</strong> - Jūsų preferences ir pasirinkimai</Text>
              <Text className="block">📊 <strong>Analizuoti svetainės naudojimą</strong> - suprasti, kaip pagerinti paslaugas</Text>
              <Text className="block">🛡️ <strong>Užtikrinti saugumą</strong> - apsisaugoti nuo internetinių grėsmių</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Slapukų tipai</Heading>
            
            <Box className="space-y-4">
              <Box className="p-4 border border-green-500 rounded-lg bg-green-50">
                <Box className="flex items-center gap-3 mb-3">
                  <Check className="text-green-600" size={20} />
                  <Heading size="4" className="text-green-800">Būtiniai slapukai</Heading>
                  <Text size="1" className="px-2 py-1 bg-green-200 text-green-800 rounded">BŪTINI</Text>
                </Box>
                <Text className="block mb-3 text-green-800">
                  Šie slapukai yra reikalingi svetainės veikimui ir negali būti išjungti.
                </Text>
                <Box className="space-y-2">
                  <Text className="block text-sm"><strong>session_id:</strong> Sesijos identifikatorius (30 min.)</Text>
                  <Text className="block text-sm"><strong>cart_token:</strong> Krepšelio duomenys (7 dienos)</Text>
                  <Text className="block text-sm"><strong>csrf_token:</strong> Saugumo apsauga (sesija)</Text>
                  <Text className="block text-sm"><strong>language:</strong> Kalbos pasirinkimas (1 metai)</Text>
                </Box>
              </Box>

              <Box className="p-4 border border-blue-500 rounded-lg bg-blue-50">
                <Box className="flex items-center gap-3 mb-3">
                  <Settings className="text-blue-600" size={20} />
                  <Heading size="4" className="text-blue-800">Funkciniai slapukai</Heading>
                  <Box className="flex items-center gap-2">
                    <Text size="1">Įjungti</Text>
                    <Switch size="1" defaultChecked />
                  </Box>
                </Box>
                <Text className="block mb-3 text-blue-800">
                  Pagerina Jūsų naudojimosi patirtį išsaugodami preferences.
                </Text>
                <Box className="space-y-2">
                  <Text className="block text-sm"><strong>user_preferences:</strong> Jūsų nustatymai (1 metai)</Text>
                  <Text className="block text-sm"><strong>viewed_products:</strong> Peržiūrėtos prekės (30 dienų)</Text>
                  <Text className="block text-sm"><strong>currency:</strong> Pasirinkta valiuta (1 metai)</Text>
                  <Text className="block text-sm"><strong>region:</strong> Geografinė sritis (6 mėn.)</Text>
                </Box>
              </Box>

              <Box className="p-4 border border-orange-500 rounded-lg bg-orange-50">
                <Box className="flex items-center gap-3 mb-3">
                  <Cookie className="text-orange-600" size={20} />
                  <Heading size="4" className="text-orange-800">Analitikos slapukai</Heading>
                  <Box className="flex items-center gap-2">
                    <Text size="1">Įjungti</Text>
                    <Switch size="1" defaultChecked />
                  </Box>
                </Box>
                <Text className="block mb-3 text-orange-800">
                  Padeda mums suprasti, kaip naudojate svetainę ir ją pagerinti.
                </Text>
                <Box className="space-y-2">
                  <Text className="block text-sm"><strong>_ga:</strong> Google Analytics identifikatorius (2 metai)</Text>
                  <Text className="block text-sm"><strong>_ga_*:</strong> Google Analytics sesijos duomenys (2 metai)</Text>
                  <Text className="block text-sm"><strong>page_views:</strong> Puslapių peržiūros (1 mėn.)</Text>
                  <Text className="block text-sm"><strong>user_journey:</strong> Naudotojo kelio analizė (7 dienos)</Text>
                </Box>
              </Box>

              <Box className="p-4 border border-red-500 rounded-lg bg-red-50">
                <Box className="flex items-center gap-3 mb-3">
                  <X className="text-red-600" size={20} />
                  <Heading size="4" className="text-red-800">Rinkodaros slapukai</Heading>
                  <Text size="1" className="px-2 py-1 bg-red-200 text-red-800 rounded">NENAUDOJAME</Text>
                </Box>
                <Text className="block text-red-800">
                  Šiuo metu nenaudojame rinkodaros ar reklamos slapukų. Jei ateityje tai pasikeistų, 
                  visada paprašytume Jūsų sutikimo.
                </Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Slapukų valdymas</Heading>
            <Text className="block mb-4">
              Jūs galite valdyti slapukų nustatymus keliais būdais:
            </Text>

            <Box className="space-y-4">
              <Box className="p-4 bg-blue-50 border border-blue-200 rounded">
                <Heading size="4" className="mb-2">🍪 Mūsų slapukų centre</Heading>
                <Text className="block mb-3 text-sm">
                  Galite keisti nebūtinų slapukų nustatymus tiesiogiai mūsų svetainėje:
                </Text>
                <Box className="flex gap-3">
                  <Button size="2" variant="solid">
                    <Settings size={16} />
                    Valdyti slapukų nustatymus
                  </Button>
                  <Button size="2" variant="outline">
                    Atšaukti visus nebūtinius
                  </Button>
                </Box>
              </Box>

              <Box className="p-4 bg-gray-50 border border-gray-200 rounded">
                <Heading size="4" className="mb-2">🌐 Naršyklės nustatymuose</Heading>
                <Text className="block mb-3 text-sm">
                  Visi šiuolaikinės naršyklės leidžia valdyti slapukus:
                </Text>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <Box>
                    <Text className="block font-semibold mb-1">Chrome:</Text>
                    <Text className="block">Nustatymai → Privatumas ir saugumas → Slapukai</Text>
                  </Box>
                  <Box>
                    <Text className="block font-semibold mb-1">Firefox:</Text>
                    <Text className="block">Nustatymai → Privatumas ir saugumas</Text>
                  </Box>
                  <Box>
                    <Text className="block font-semibold mb-1">Safari:</Text>
                    <Text className="block">Preferencijos → Privatumas</Text>
                  </Box>
                  <Box>
                    <Text className="block font-semibold mb-1">Edge:</Text>
                    <Text className="block">Nustatymai → Slapukai ir svetainės leidimai</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Trečiųjų šalių slapukai</Heading>
            <Text className="block mb-4">
              Kai kurie slapukai nustatomi trečiųjų šalių paslaugų, kurias naudojame:
            </Text>

            <Box className="space-y-3">
              <Box className="p-3 border rounded">
                <Text className="block font-semibold mb-1">💳 Paysera (mokėjimai)</Text>
                <Text className="block text-sm mb-2">
                  <strong>Paskirtis:</strong> Saugūs mokėjimai ir kortelių duomenų apdorojimas
                </Text>
                <Text className="block text-sm mb-2">
                  <strong>Slapukai:</strong> paysera_session, payment_token
                </Text>
                <Text className="block text-sm text-blue-600">
                  <a href="https://www.paysera.com/privacy" target="_blank">→ Paysera privatumo politika</a>
                </Text>
              </Box>

              <Box className="p-3 border rounded">
                <Text className="block font-semibold mb-1">📊 Google Analytics (statistika)</Text>
                <Text className="block text-sm mb-2">
                  <strong>Paskirtis:</strong> Svetainės naudojimo statistika (anoniminė)
                </Text>
                <Text className="block text-sm mb-2">
                  <strong>Slapukai:</strong> _ga, _gid, _ga_*
                </Text>
                <Text className="block text-sm text-blue-600">
                  <a href="https://policies.google.com/privacy" target="_blank">→ Google privatumo politika</a>
                </Text>
              </Box>

              <Box className="p-3 border rounded">
                <Text className="block font-semibold mb-1">🚚 Venipak (pristatymas)</Text>
                <Text className="block text-sm mb-2">
                  <strong>Paskirtis:</strong> Atsiėmimo punktų žemėlapiai ir pristatymo informacija
                </Text>
                <Text className="block text-sm mb-2">
                  <strong>Slapukai:</strong> venipak_location, map_preferences
                </Text>
                <Text className="block text-sm text-blue-600">
                  <a href="https://www.venipak.com/privacy-policy" target="_blank">→ Venipak privatumo politika</a>
                </Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Slapukų gyvavimo laikas</Heading>
            <Text className="block mb-4">
              Skirtingi slapukai saugomi skirtingą laiką:
            </Text>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box className="space-y-3">
                <Heading size="4">⏱️ Sesijos slapukai</Heading>
                <Text className="block text-sm">
                  Ištrinama uždarė naršyklę ar atėjumą
                </Text>
                <Box className="text-xs space-y-1">
                  <Text className="block">• Prisijungimo sesija</Text>
                  <Text className="block">• Krepšelio būsena</Text>
                  <Text className="block">• Saugumo ženklai</Text>
                </Box>
              </Box>

              <Box className="space-y-3">
                <Heading size="4">📅 Nuolatiniai slapukai</Heading>
                <Text className="block text-sm">
                  Išsaugomi nurodytą laiką
                </Text>
                <Box className="text-xs space-y-1">
                  <Text className="block">• Kalbos pasirinkimas: 1 metai</Text>
                  <Text className="block">• Analitikos duomenys: 2 metai</Text>
                  <Text className="block">• Preferences: 1 metai</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Slapukų pašalinimas</Heading>
            <Text className="block mb-4">
              Jūs bet kada galite ištrinti slapukus:
            </Text>

            <Box className="space-y-3">
              <Box className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <Text className="block font-semibold mb-2">⚠️ Įspėjimas apie slapukų ištrynimą:</Text>
                <Box className="text-sm space-y-1">
                  <Text className="block">• Krepšelio turinys gali būti prarastas</Text>
                  <Text className="block">• Teks iš naujo prisijungti</Text>
                  <Text className="block">• Prasite kalbos ir kitų nustatymų</Text>
                  <Text className="block">• Svetainės funkcionalumas gali būti apribotas</Text>
                </Box>
              </Box>

              <Box className="p-3 bg-blue-50 border border-blue-200 rounded">
                <Text className="block font-semibold mb-2">💡 Rekomenduojamas būdas:</Text>
                <Text className="block text-sm">
                  Vietoj visų slapukų ištrynimo, geriau išjunkite nebūtinius slapukus 
                  mūsų slapukų valdymo centre.
                </Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Slapukų politikos keitimai</Heading>
            <Text className="block mb-4">
              Kai pakeičiame slapukų politiką:
            </Text>

            <Box className="ml-4 space-y-2">
              <Text className="block">📅 <strong>Informuojame iš anksto</strong> - prieš 30 dienų</Text>
              <Text className="block">📧 <strong>Siunčiame el. laišką</strong> - registruotiems naudotojams</Text>
              <Text className="block">🚨 <strong>Rodome pranešimą</strong> - svetainėje</Text>
              <Text className="block">🔄 <strong>Prašome naujo sutikimo</strong> - jei reikia</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Dažniausiai užduodami klausimai</Heading>
            
            <Box className="space-y-4">
              <Box className="p-3 border rounded">
                <Text className="block font-semibold mb-2">K: Ar slapukai gali pakenkti mano kompiuteriui?</Text>
                <Text className="block text-sm">
                  A: Ne, slapukai yra tik tekstiniai failai ir negali vykdyti programų ar perduoti virusų.
                </Text>
              </Box>

              <Box className="p-3 border rounded">
                <Text className="block font-semibold mb-2">K: Ar galiu naudoti svetainę be slapukų?</Text>
                <Text className="block text-sm">
                  A: Dalinis naudojimas galimas, bet kai kurios funkcijos (pvz., krepšelis) neveiks tinkamai.
                </Text>
              </Box>

              <Box className="p-3 border rounded">
                <Text className="block font-semibold mb-2">K: Ar duodate slapukų duomenis tretiesiems asmenims?</Text>
                <Text className="block text-sm">
                  A: Ne, mes neparduodame ir neduodame slapukų duomenų tretiesiems asmenims reklamai.
                </Text>
              </Box>

              <Box className="p-3 border rounded">
                <Text className="block font-semibold mb-2">K: Kaip dažnai atsinaujinami slapukų nustatymai?</Text>
                <Text className="block text-sm">
                  A: Jūsų nustatymai išsaugomi 1 metus. Po to prašysime atnaujinti preferences.
                </Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Kontaktai</Heading>
            <Text className="block mb-4">
              Klausimais apie slapukų naudojimą kreipkitės:
            </Text>
            
            <Box className="p-4 bg-green-50 border border-green-200 rounded">
              <Box className="space-y-2">
                <Text className="block">
                  📧 <strong>El. paštas:</strong> cookies@gyvagaudziaispastai.lt
                </Text>
                <Text className="block">
                  📞 <strong>Telefonas:</strong> [Telefono numeris]
                </Text>
                <Text className="block">
                  🕐 <strong>Darbo laikas:</strong> I-V 9:00-17:00
                </Text>
                <Text className="block">
                  💬 <strong>Atsakymo laikas:</strong> Per 24 valandas
                </Text>
              </Box>
            </Box>
          </Box>

          <Box className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <Box className="flex items-center gap-3 mb-4">
              <Cookie className="text-blue-600" size={24} />
              <Heading size="4" className="text-blue-800">Jūsų pasirinkimas</Heading>
            </Box>
            <Text className="block text-blue-800 mb-4">
              Mes gerbiame Jūsų privatumo pasirinkimus. Galite bet kada pakeisti slapukų nustatymus 
              arba atšaukti sutikimą nebūtiniems slapukams.
            </Text>
            <Box className="flex gap-3">
              <Button size="2" variant="solid">
                Valdyti nustatymus
              </Button>
              <Button size="2" variant="outline">
                Priimti tik būtinius
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
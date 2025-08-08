"use client"

import { Container, Heading, Text, Box, Separator, Button } from "@radix-ui/themes"
import { Shield, Download, Trash2, Edit, Eye } from "lucide-react"

export default function GDPRCompliancePage() {
  return (
    <Container size="3" className="py-8">
      <Heading size="8" className="mb-6">BDAR atitiktis ir duomenų valdymas</Heading>
      
      <Box className="prose max-w-none">
        <Text size="3" className="mb-6 block">
          Bendrasis duomenų apsaugos reglamentas (BDAR) | GDPR Compliance
        </Text>

        <Separator size="4" className="my-6" />

        <Box className="space-y-6">
          <Box>
            <Heading size="5" className="mb-3">Jūsų duomenų apsaugos teisės</Heading>
            <Text className="block mb-4">
              Pagal Bendrąjį duomenų apsaugos reglamentą (BDAR) Jūs turite šias teises dėl savo asmens duomenų:
            </Text>
            
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box className="p-4 border rounded-lg">
                <Box className="flex items-center gap-3 mb-3">
                  <Eye className="text-blue-600" size={24} />
                  <Heading size="4">Teisė žinoti</Heading>
                </Box>
                <Text size="2">
                  Teisė gauti informaciją apie tai, kaip tvarkome Jūsų asmens duomenis, 
                  kodėl juos renkame ir kiek laiko saugome.
                </Text>
              </Box>

              <Box className="p-4 border rounded-lg">
                <Box className="flex items-center gap-3 mb-3">
                  <Download className="text-green-600" size={24} />
                  <Heading size="4">Teisė gauti duomenis</Heading>
                </Box>
                <Text size="2">
                  Teisė gauti visų apie Jus saugomų asmens duomenų kopiją 
                  struktūrizuotu, įprastu ir kompiuterio skaitomu formatu.
                </Text>
              </Box>

              <Box className="p-4 border rounded-lg">
                <Box className="flex items-center gap-3 mb-3">
                  <Edit className="text-orange-600" size={24} />
                  <Heading size="4">Teisė taisyti</Heading>
                </Box>
                <Text size="2">
                  Teisė reikalauti ištaisyti neteisingus ar nepilnus asmens duomenis 
                  be nepateisinto delsos.
                </Text>
              </Box>

              <Box className="p-4 border rounded-lg">
                <Box className="flex items-center gap-3 mb-3">
                  <Trash2 className="text-red-600" size={24} />
                  <Heading size="4">Teisė ištrinti</Heading>
                </Box>
                <Text size="2">
                  Teisė būti pamirštam - reikalauti ištrinti Jūsų asmens duomenis 
                  tam tikromis aplinkybėmis.
                </Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Kaip pasinaudoti savo teisėmis</Heading>
            <Text className="block mb-4">
              Norėdami pasinaudoti bet kuria iš savo teisių, susisiekite su mumis:
            </Text>
            
            <Box className="p-4 bg-blue-50 rounded-lg mb-4">
              <Text className="block font-semibold mb-2">Duomenų apsaugos pareigūnas:</Text>
              <Text className="block">📧 El. paštas: privacy@gyvagaudziaspastai.lt</Text>
              <Text className="block">📞 Telefonas: [Telefono numeris]</Text>
              <Text className="block">📍 Adresas: [Įmonės adresas]</Text>
            </Box>

            <Text className="block mb-4">
              <strong>Atsakymo terminas:</strong> Atsakysime į Jūsų užklausą per 30 kalendorinių dienų. 
              Sudėtingais atvejais šis terminas gali būti pratęstas iki 60 dienų.
            </Text>

            <Text className="block">
              <strong>Tapatybės patvirtinimas:</strong> Norėdami apsaugoti Jūsų duomenis, 
              galime paprašyti patvirtinti Jūsų tapatybę prieš suteikdami prieigą prie asmens duomenų.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Kokius duomenis renkame ir kodėl</Heading>
            
            <Box className="space-y-4">
              <Box className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <Heading size="4" className="mb-2">Užsakymo duomenys</Heading>
                <Text className="block mb-2"><strong>Kas:</strong> Vardas, pavardė, el. paštas, telefonas, adresas</Text>
                <Text className="block mb-2"><strong>Kodėl:</strong> Užsakymų vykdymas ir pristatymas</Text>
                <Text className="block"><strong>Kiek laiko:</strong> 10 metų (apskaitos reikalavimai)</Text>
              </Box>

              <Box className="p-4 border-l-4 border-green-500 bg-green-50">
                <Heading size="4" className="mb-2">Techniniai duomenys</Heading>
                <Text className="block mb-2"><strong>Kas:</strong> IP adresas, naršyklės informacija, slapukai</Text>
                <Text className="block mb-2"><strong>Kodėl:</strong> Svetainės veikimas ir saugumas</Text>
                <Text className="block"><strong>Kiek laiko:</strong> 12 mėnesių</Text>
              </Box>

              <Box className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <Heading size="4" className="mb-2">Komunikacijos duomenys</Heading>
                <Text className="block mb-2"><strong>Kas:</strong> El. laiškai, žinutės, skambučių įrašai</Text>
                <Text className="block mb-2"><strong>Kodėl:</strong> Klientų aptarnavimas ir pagalba</Text>
                <Text className="block"><strong>Kiek laiko:</strong> 3 metai</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Duomenų saugumas</Heading>
            <Text className="block mb-4">
              Mes imamės visų reikalingų techninių ir organizacinių priemonių, 
              kad apsaugotume Jūsų asmens duomenis:
            </Text>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box className="space-y-3">
                <Text className="block font-semibold">🔐 Techninės priemonės:</Text>
                <Box className="ml-4 space-y-1">
                  <Text className="block text-sm">• SSL/TLS šifravimas</Text>
                  <Text className="block text-sm">• Saugūs serveriai</Text>
                  <Text className="block text-sm">• Briedfire apsauga</Text>
                  <Text className="block text-sm">• Reguliarus duomenų atsarginis kopijavimas</Text>
                  <Text className="block text-sm">• Prieigos kontrolė</Text>
                </Box>
              </Box>

              <Box className="space-y-3">
                <Text className="block font-semibold">👥 Organizacinės priemonės:</Text>
                <Box className="ml-4 space-y-1">
                  <Text className="block text-sm">• Darbuotojų apmokymas</Text>
                  <Text className="block text-sm">• Konfidencialumo sutartys</Text>
                  <Text className="block text-sm">• Duomenų valdymo politikos</Text>
                  <Text className="block text-sm">• Reguliarus saugumo vertinimas</Text>
                  <Text className="block text-sm">• Incidentų valdymas</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Duomenų perdavimas</Heading>
            <Text className="block mb-4">
              Jūsų asmens duomenis galime perduoti šioms kategorioms gavėjų:
            </Text>

            <Box className="space-y-3">
              <Box className="p-3 bg-gray-50 rounded">
                <Text className="block font-semibold mb-1">🚚 Pristatymo paslaugos:</Text>
                <Text className="block text-sm">Venipak, DPD, LP Express - prekių pristatymo organizavimas</Text>
              </Box>

              <Box className="p-3 bg-gray-50 rounded">
                <Text className="block font-semibold mb-1">💳 Mokėjimų tvarkymas:</Text>
                <Text className="block text-sm">Paysera, bankai - mokėjimų apdorojimas ir saugumas</Text>
              </Box>

              <Box className="p-3 bg-gray-50 rounded">
                <Text className="block font-semibold mb-1">💻 IT paslaugos:</Text>
                <Text className="block text-sm">Svetainės talpinimas, duomenų saugojimas, techninė priežiūra</Text>
              </Box>

              <Box className="p-3 bg-gray-50 rounded">
                <Text className="block font-semibold mb-1">🏛️ Valstybės institucijos:</Text>
                <Text className="block text-sm">Mokesčių inspekcija, teisėsauga - tik teisės aktų reikalavimų atveju</Text>
              </Box>
            </Box>

            <Text className="block mt-4">
              <strong>Tarptautinis duomenų perdavimas:</strong> Jūsų duomenys tvarkomi Europos Sąjungos teritorijoje. 
              Jei būtina perduoti duomenis į trečiąsias šalis, užtikrinama tinkama apsaugos lygis.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Slapukų (cookies) valdymas</Heading>
            <Text className="block mb-4">
              Mūsų svetainė naudoja slapukus patogumui ir funkcionalumui užtikrinti:
            </Text>

            <Box className="space-y-3 mb-4">
              <Box className="p-3 border rounded">
                <Text className="block font-semibold text-green-700 mb-1">✅ Būtiniai slapukai</Text>
                <Text className="block text-sm">Reikalingi svetainės veikimui (krepšelis, sesija). Negali būti išjungti.</Text>
              </Box>

              <Box className="p-3 border rounded">
                <Text className="block font-semibold text-blue-700 mb-1">⚙️ Funkciniai slapukai</Text>
                <Text className="block text-sm">Kalbos pasirinkimas, nustatymai. Galite išjungti bet kada.</Text>
              </Box>

              <Box className="p-3 border rounded">
                <Text className="block font-semibold text-orange-700 mb-1">📊 Analitikos slapukai</Text>
                <Text className="block text-sm">Svetainės naudojimo statistika. Visada prašome sutikimo.</Text>
              </Box>
            </Box>

            <Box className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <Text className="block font-semibold mb-2">🍪 Slapukų nustatymai</Text>
              <Text className="block text-sm mb-3">
                Galite valdyti slapukų nustatymus savo naršyklėje arba susisiekti su mumis dėl jų išjungimo.
              </Text>
              <Button size="2" variant="outline">
                Valdyti slapukus
              </Button>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Duomenų pažeidimų pranešimas</Heading>
            <Text className="block mb-4">
              Jei įvyktų duomenų saugumo pažeidimas, kuris gali kelti riziką Jūsų teisėms:
            </Text>

            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Informuosime kontrolės instituciją per 72 valandas</Text>
              <Text className="block">• Informuosime paveiktus asmenis be nepateisinto delsos</Text>
              <Text className="block">• Eutaksime visas priemones pažeidimui pašalinti</Text>
              <Text className="block">• Ištirtėme incidentą ir patobulinsime saugumą</Text>
            </Box>

            <Text className="block">
              Jei manote, kad Jūsų duomenys buvo pažeisti, nedelsiant susisiekite su mumis.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Vaikai ir duomenų apsauga</Heading>
            <Text className="block mb-4">
              Mūsų paslaugos neskirtos asmenims jauneyksems nei 16 metų:
            </Text>

            <Box className="ml-4 space-y-2">
              <Text className="block">• Sąmoningai nerenkame vaikų asmens duomenų</Text>
              <Text className="block">• Jei sužinotume apie vaikų duomenis, tuoj pat juos ištrintume</Text>
              <Text className="block">• Tėvai gali susisiekti dėl savo vaiko duomenų ištrynimo</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Automatinis sprendimų priėmimas</Heading>
            <Text className="block mb-4">
              Informuojame apie automatinį sprendimų priėmimą:
            </Text>

            <Box className="p-4 bg-blue-50 border border-blue-200 rounded">
              <Text className="block font-semibold mb-2">🤖 Automatiniai procesai mūsų svetainėje:</Text>
              <Box className="ml-4 space-y-2">
                <Text className="block text-sm">• <strong>Kainos skaičiavimas:</strong> Automatinis pristatymo kainų skaičiavimas</Text>
                <Text className="block text-sm">• <strong>Prieinamumas:</strong> Prekių prieinamumo tikrinimas</Text>
                <Text className="block text-sm">• <strong>Saugumas:</strong> Abejotinų operacijų blokavimas</Text>
              </Box>
              <Text className="block text-sm mt-3">
                <strong>Jūsų teisės:</strong> Galite reikalauti žmogaus išmindimo bet kuriuo automatiniu sprendimu.
              </Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Skundų pateikimas</Heading>
            <Text className="block mb-4">
              Jei manote, kad pažeidžiame Jūsų duomenų apsaugos teises:
            </Text>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box className="p-4 bg-gray-50 rounded">
                <Text className="block font-semibold mb-2">1️⃣ Pirma - kreipkitės į mus:</Text>
                <Text className="block text-sm mb-2">privacy@gyvagaudziaispastai.lt</Text>
                <Text className="block text-sm">Patarysime išspręsti problemą tiesiogiai ir greitai.</Text>
              </Box>

              <Box className="p-4 bg-red-50 rounded">
                <Text className="block font-semibold mb-2">2️⃣ Skundas kontrolės institucijai:</Text>
                <Text className="block text-sm mb-1"><strong>Valstybės duomenų apsaugos inspekcija</strong></Text>
                <Text className="block text-sm mb-1">A. Juozapavičiaus g. 6, Vilnius</Text>
                <Text className="block text-sm mb-1">El. paštas: ada@ada.lt</Text>
                <Text className="block text-sm">Tel.: +370 5 279 14 45</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">Naudingos nuorodos</Heading>
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box className="space-y-2">
                <Text className="block font-semibold">📖 Mūsų politikos:</Text>
                <Box className="ml-4 space-y-1">
                  <Text className="block text-sm text-blue-600 hover:underline cursor-pointer">→ Privatumo politika</Text>
                  <Text className="block text-sm text-blue-600 hover:underline cursor-pointer">→ Slapukų politika</Text>
                  <Text className="block text-sm text-blue-600 hover:underline cursor-pointer">→ Pardavimo sąlygos</Text>
                </Box>
              </Box>

              <Box className="space-y-2">
                <Text className="block font-semibold">🔗 Išorinės nuorodos:</Text>
                <Box className="ml-4 space-y-1">
                  <Text className="block text-sm text-blue-600 hover:underline cursor-pointer">→ BDAR tekstas (eur-lex.europa.eu)</Text>
                  <Text className="block text-sm text-blue-600 hover:underline cursor-pointer">→ VDAI (ada.lt)</Text>
                  <Text className="block text-sm text-blue-600 hover:underline cursor-pointer">→ Jūsų teisės (ec.europa.eu)</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <Box className="flex items-center gap-3 mb-3">
              <Shield className="text-green-600" size={24} />
              <Heading size="4" className="text-green-800">Mūsų įsipareigojimas</Heading>
            </Box>
            <Text className="block text-green-800">
              UAB „Gyvagaudziaspastai" įsipareigoja laikytis aukščiausių duomenų apsaugos standartų, 
              gerbti Jūsų privatumą ir užtikrinti skaidrų duomenų tvarkymą. Jūsų pasitikėjimas mums 
              yra svarbiausias.
            </Text>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
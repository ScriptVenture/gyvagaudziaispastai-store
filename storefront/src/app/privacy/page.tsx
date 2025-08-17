"use client"

import { Container, Heading, Text, Box, Separator } from "@radix-ui/themes"

export default function PrivacyPolicyPage() {
  return (
    <Container size="3" className="py-8">
      <Heading size="8" className="mb-6">Privatumo politika</Heading>
      
      <Box className="prose max-w-none">
        <Text size="3" className="mb-6 block">
          Paskutinį kartą atnaujinta: {new Date().toLocaleDateString('lt-LT')}
        </Text>

        <Separator size="4" className="my-6" />

        <Box className="space-y-6">
          <Box>
            <Heading size="5" className="mb-3">1. Bendrosios nuostatos</Heading>
            <Text className="block mb-4">
              UAB DIGIMAKSAS (toliau - mes, mūsų, Įmonė) gerbia Jūsų privatumą ir įsipareigoja apsaugoti Jūsų asmens duomenis. 
              Ši privatumo politika aprašo, kaip mes renkame, naudojame ir saugome Jūsų asmens duomenis, kai naudojatės mūsų internetinės parduotuvės paslaugomis.
            </Text>
            <Text className="block">
              Ši privatumo politika taikoma mūsų internetinei parduotuvei ir su ja susijusioms paslaugoms. 
              Naudodamiesi mūsų paslaugomis, Jūs sutinkate su šioje politikoje aprašytais asmens duomenų tvarkymo principais.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">2. Duomenų valdytojas</Heading>
            <Text className="block mb-2">
              <strong>UAB DIGIMAKSAS</strong>
            </Text>
            <Text className="block mb-2">Adresas: Savanorių pr. 214, LT-50194 Kaunas, Lithuania</Text>
            <Text className="block mb-2">El. paštas: prekyba@dmax.lt</Text>
            <Text className="block mb-2">Telefonas: +37060988861</Text>
            <Text className="block">Svetainė: www.gyvagaudziaispastai.lt</Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">3. Renkami asmens duomenys</Heading>
            <Text className="block mb-3">Mes renkame šiuos Jūsų asmens duomenis:</Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block"><strong>Užsakymo duomenys:</strong></Text>
              <Text className="block ml-4">• Vardas ir pavardė</Text>
              <Text className="block ml-4">• El. pašto adresas</Text>
              <Text className="block ml-4">• Telefono numeris</Text>
              <Text className="block ml-4">• Pristatymo adresas</Text>
              <Text className="block ml-4">• Sąskaitos adresas (jei skiriasi)</Text>
              
              <Text className="block mt-4"><strong>Techniniai duomenys:</strong></Text>
              <Text className="block ml-4">• IP adresas</Text>
              <Text className="block ml-4">• Naršyklės tipas ir versija</Text>
              <Text className="block ml-4">• Operacinės sistemos informacija</Text>
              <Text className="block ml-4">• Prisijungimo data ir laikas</Text>
              <Text className="block ml-4">• Aplankytų puslapių informacija</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">4. Duomenų naudojimo tikslai</Heading>
            <Text className="block mb-3">Jūsų asmens duomenis naudojame šiais tikslais:</Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">• Užsakymų apdorojimas ir vykdymas</Text>
              <Text className="block">• Prekių pristatymas ir pristatymo organizavimas</Text>
              <Text className="block">• Klientų aptarnavimas ir pagalba</Text>
              <Text className="block">• Sąskaitų išrašymas ir apskaita</Text>
              <Text className="block">• Komunikacija apie užsakymus</Text>
              <Text className="block">• Internetinės parduotuvės funkcionalumo užtikrinimas</Text>
              <Text className="block">• Teisės aktų reikalavimų laikymasis</Text>
              <Text className="block">• Statistikos rengimas (anoniminiai duomenys)</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">5. Duomenų teisiniai pagrindai</Heading>
            <Text className="block mb-3">Jūsų asmens duomenis tvarkome remiantis:</Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">• <strong>Sutartimi:</strong> užsakymų vykdymas ir pristatymas</Text>
              <Text className="block">• <strong>Teisėtu interesu:</strong> klientų aptarnavimas, svetainės veikimas</Text>
              <Text className="block">• <strong>Teisiniu įpareigojimu:</strong> apskaitos ir mokesčių reikalavimai</Text>
              <Text className="block">• <strong>Jūsų sutikimu:</strong> rinkodaros komunikacija (jei sutinkate)</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">6. Duomenų saugojimo laikotarpis</Heading>
            <Text className="block mb-3">Jūsų asmens duomenis saugome:</Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">• <strong>Užsakymo duomenys:</strong> 10 metų (apskaitos reikalavimai)</Text>
              <Text className="block">• <strong>Techniniai duomenys:</strong> 12 mėnesių</Text>
              <Text className="block">• <strong>Rinkodaros duomenys:</strong> iki sutikimo atšaukimo</Text>
              <Text className="block">• <strong>Klientų aptarnavimo duomenys:</strong> 3 metai</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">7. Duomenų perdavimas tretiesiems asmenims</Heading>
            <Text className="block mb-3">
              Jūsų asmens duomenis galime perduoti šioms trečiosioms šalims:
            </Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">• <strong>Pristatymo paslaugų teikėjai:</strong> Venipak, DPD, LP Express</Text>
              <Text className="block">• <strong>Mokėjimų teikėjai:</strong> Paysera, bankai</Text>
              <Text className="block">• <strong>IT paslaugų teikėjai:</strong> svetainės talpinimas, duomenų apdorojimas</Text>
              <Text className="block">• <strong>Apskaitos paslaugos:</strong> buhalterinės apskaitos tvarkymas</Text>
              <Text className="block">• <strong>Valstybės institucijos:</strong> teisės aktų reikalavimų laikymasis</Text>
            </Box>
            
            <Text className="block mt-3">
              Visi trečieji asmenys įsipareigoja laikytis duomenų apsaugos reikalavimų.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">8. Jūsų teisės</Heading>
            <Text className="block mb-3">Pagal BDAR turite šias teises:</Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">• <strong>Teisė žinoti:</strong> gauti informaciją apie duomenų tvarkymą</Text>
              <Text className="block">• <strong>Teisė susipažinti:</strong> gauti savo asmens duomenų kopiją</Text>
              <Text className="block">• <strong>Teisė taisyti:</strong> ištaisyti neteisingus duomenis</Text>
              <Text className="block">• <strong>Teisė ištrinti:</strong> ištrinti duomenis ("teisė būti pamirštam")</Text>
              <Text className="block">• <strong>Teisė apriboti:</strong> apriboti duomenų tvarkymą</Text>
              <Text className="block">• <strong>Teisė perkelti:</strong> gauti duomenis struktūrizuotu formatu</Text>
              <Text className="block">• <strong>Teisė nesutikti:</strong> nesutikti su duomenų tvarkymu</Text>
              <Text className="block">• <strong>Teisė pateikti skundą:</strong> kreiptis į VDAI</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">9. Slapukai (Cookies)</Heading>
            <Text className="block mb-3">
              Mūsų svetainė naudoja slapukus funkcionalumui užtikrinti:
            </Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">• <strong>Būtini slapukai:</strong> krepšelio veikimas, sesijos palaikymas</Text>
              <Text className="block">• <strong>Funkciniai slapukai:</strong> kalbos pasirinkimas, nustatymai</Text>
              <Text className="block">• <strong>Analitikos slapukai:</strong> svetainės naudojimo statistika</Text>
            </Box>
            
            <Text className="block mt-3">
              Galite valdyti slapukų nustatymus savo naršyklėje.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">10. Duomenų saugumas</Heading>
            <Text className="block mb-3">
              Taikome techninius ir organizacinius duomenų apsaugos priemonės:
            </Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">• SSL sertifikatai duomenų šifravimui</Text>
              <Text className="block">• Saugūs serveriai ir duomenų centrais</Text>
              <Text className="block">• Prieigos kontrolės ir autentifikavimas</Text>
              <Text className="block">• Reguliarios duomenų atsarginės kopijos</Text>
              <Text className="block">• Darbuotojų apmokymas duomenų apsaugos klausimais</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">11. Kontaktai</Heading>
            <Text className="block mb-3">
              Klausimais dėl asmens duomenų tvarkymo kreipkitės:
            </Text>
            
            <Box className="ml-4 space-y-2">
              <Text className="block">El. paštas: prekyba@dmax.lt</Text>
              <Text className="block">Telefonas: +37060988861</Text>
              <Text className="block">Adresas: Savanorių pr. 214, LT-50194 Kaunas, Lithuania</Text>
            </Box>
            
            <Text className="block mt-3">
              Jei manote, kad Jūsų duomenų apsaugos teisės pažeidžiamos, galite kreiptis į:
            </Text>
            <Text className="block">
              <strong>Valstybės duomenų apsaugos inspekcija</strong><br />
              Adresas: A. Juozapavičiaus g. 6, Vilnius<br />
              El. paštas: ada@ada.lt<br />
              Telefonas: +370 5 279 14 45
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">12. Privatumo politikos keitimai</Heading>
            <Text className="block">
              Pasiliekame teisę keisti šią privatumo politiką. Apie reikšmingus pakeitimus informuosime 
              el. paštu arba paskelbdami pranešimą svetainėje. Rekomenduojame reguliariai peržiūrėti 
              šią politiką, kad būtumėte informuoti apie tai, kaip saugome ir naudojame Jūsų duomenis.
            </Text>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

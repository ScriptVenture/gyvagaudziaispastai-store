"use client"

import { Container, Heading, Text, Box, Separator } from "@radix-ui/themes"

export default function TermsOfServicePage() {
  return (
    <Container size="3" className="py-8">
      <Heading size="8" className="mb-6">Pardavimo sąlygos</Heading>
      
      <Box className="prose max-w-none">
        <Text size="3" className="mb-6 block">
          Paskutinį kartą atnaujinta: {new Date().toLocaleDateString('lt-LT')}
        </Text>

        <Separator size="4" className="my-6" />

        <Box className="space-y-6">
          <Box>
            <Heading size="5" className="mb-3">1. Bendrosios nuostatos</Heading>
            <Text className="block mb-4">
              Šios pardavimo sąlygos (toliau - Sąlygos) nustato UAB „Gyvagaudziaspastai" (toliau - Pardavėjas) 
              ir pirkėjo (toliau - Pirkėjas) teises, pareigas ir atsakomybę, įsigyjant prekes internetinėje parduotuvėje 
              gyvagaudziaspastai.lt.
            </Text>
            <Text className="block mb-4">
              Pateikdamas užsakymą, Pirkėjas patvirtina, kad sutinka su šiomis pardavimo sąlygomis ir įsipareigoja 
              jų laikytis.
            </Text>
            <Text className="block">
              Pardavėjas pasilieka teisę keisti šias sąlygas bet kuriuo metu. Pakeitimai įsigalioja nuo jų 
              paskelbimo internetinėje parduotuvėje momento.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">2. Pardavėjo informacija</Heading>
            <Text className="block mb-2">
              <strong>Įmonės pavadinimas:</strong> UAB „Gyvagaudziaspastai"
            </Text>
            <Text className="block mb-2">
              <strong>Įmonės kodas:</strong> [Įrašykite įmonės kodą]
            </Text>
            <Text className="block mb-2">
              <strong>PVM mokėtojo kodas:</strong> [Įrašykite PVM kodą]
            </Text>
            <Text className="block mb-2">
              <strong>Registracijos adresas:</strong> [Įrašykite įmonės adresą]
            </Text>
            <Text className="block mb-2">
              <strong>Telefonas:</strong> [Įrašykite telefono numerį]
            </Text>
            <Text className="block mb-2">
              <strong>El. paštas:</strong> info@gyvagaudziaspastai.lt
            </Text>
            <Text className="block">
              <strong>Internetinės parduotuvės adresas:</strong> gyvagaudziaspastai.lt
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">3. Prekės ir kainos</Heading>
            <Text className="block mb-4">
              3.1. Internetinėje parduotuvėje parduodami humaniškai gyvūnų spąstai ir su tuo susijusi įranga.
            </Text>
            <Text className="block mb-4">
              3.2. Visos kainos nurodomos eurais (€) ir yra galutinės (įskaitant PVM).
            </Text>
            <Text className="block mb-4">
              3.3. Pardavėjas pasilieka teisę keisti prekių kainas. Kaina yra fiksuojama užsakymo pateikimo metu.
            </Text>
            <Text className="block mb-4">
              3.4. Prekių aprašymai, nuotraukos ir techniniai duomenys nurodyti informacijos tikslais. 
              Realūs prekių parametrai gali nežymiai skirtis nuo nurodytų.
            </Text>
            <Text className="block">
              3.5. Pardavėjas negarantuoja, kad visos svetainėje rodomos prekės yra sandėlyje ir prieinamos užsakymui.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">4. Užsakymo pateikimas ir patvirtinimas</Heading>
            <Text className="block mb-4">
              4.1. Užsakymas pateikiamas užpildant užsakymo formą internetinėje parduotuvėje.
            </Text>
            <Text className="block mb-4">
              4.2. Pateikdamas užsakymą, Pirkėjas turi nurodyti teisingus kontaktinius duomenis ir pristatymo adresą.
            </Text>
            <Text className="block mb-4">
              4.3. Pardavėjas patvirtina užsakymą el. paštu per 24 valandas nuo užsakymo pateikimo.
            </Text>
            <Text className="block mb-4">
              4.4. Jei prekės nėra sandėlyje, Pardavėjas informuoja Pirkėją apie pristatymo terminus arba 
              pasiūlo alternatyvias prekes.
            </Text>
            <Text className="block">
              4.5. Pardavėjas pasilieka teisę atsisakyti vykdyti užsakymą, jei Pirkėjas pateikė neteisingą informaciją 
              arba dėl kitų svarbių priežasčių.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">5. Mokėjimo sąlygos</Heading>
            <Text className="block mb-4">
              5.1. Galimi mokėjimo būdai:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Mokėjimas banko kortele internetu (Paysera sistema)</Text>
              <Text className="block">• Banko pavedimas</Text>
              <Text className="block">• Mokėjimas gavus prekę (papildomu susitarimu)</Text>
            </Box>
            <Text className="block mb-4">
              5.2. Mokėjimas turi būti atliktas iki prekės išsiuntimo.
            </Text>
            <Text className="block mb-4">
              5.3. Už atsiskaitymą banko kortele gali būti taikomas papildomas banko mokestis.
            </Text>
            <Text className="block">
              5.4. PVM sąskaita faktūra išrašoma ir siunčiama el. paštu po mokėjimo patvirtinimo.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">6. Pristatymas</Heading>
            <Text className="block mb-4">
              6.1. Prekės pristatomos į Lietuvą, Latviją ir Estiją.
            </Text>
            <Text className="block mb-4">
              6.2. Pristatymo būdai:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Kurjerių pristatymas iki durų</Text>
              <Text className="block">• Pristatymas į paštomatus</Text>
              <Text className="block">• Atsiėmimas iš atsiėmimo punktų</Text>
              <Text className="block">• POST pašto skyrių pristatymas</Text>
            </Box>
            <Text className="block mb-4">
              6.3. Standartinis pristatymo laikas: 2-5 darbo dienos nuo apmokėjimo patvirtinimo.
            </Text>
            <Text className="block mb-4">
              6.4. Pristatymo kaina apskaičiuojama pagal prekių svorį, dydį ir pristatymo vietą.
            </Text>
            <Text className="block mb-4">
              6.5. Pardavėjas nėra atsakingas už vėluojantį pristatymą dėl kurjerių tarnybos ar kitų nuo jo nepriklausančių aplinkybių.
            </Text>
            <Text className="block">
              6.6. Gavęs prekes, Pirkėjas turi nedelsiant patikrinti jų kokybę ir kiekį.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">7. Prekių grąžinimas ir keitimas</Heading>
            <Text className="block mb-4">
              7.1. Pirkėjas turi teisę per 14 kalendorinių dienų nuo prekės gavimo atsisakyti pirkimo sutarties 
              ir grąžinti prekę be priežasties nurodymo.
            </Text>
            <Text className="block mb-4">
              7.2. Grąžinamos prekės turi būti:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Nenaudotos ir nepažeistos</Text>
              <Text className="block">• Originalioje pakuotėje</Text>
              <Text className="block">• Su visais komplektuojančiais elementais</Text>
              <Text className="block">• Su pirkimo dokumentais</Text>
            </Box>
            <Text className="block mb-4">
              7.3. Grąžinimo procedūra:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Susisiekite su mumis el. paštu arba telefonu</Text>
              <Text className="block">• Išsiųskite prekę mūsų nurodytu adresu</Text>
              <Text className="block">• Po prekės gavimo ir patikrinimo grąžinsime sumokėtą kainą</Text>
            </Box>
            <Text className="block mb-4">
              7.4. Pinigai grąžinami per 14 dienų nuo grąžinimo pareiškimo gavimo.
            </Text>
            <Text className="block">
              7.5. Prekės grąžinimo išlaidas apmoka Pirkėjas, išskyrus atvejus, kai prekė yra defektuota ar buvo pristatyta neteisinga prekė.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">8. Garantijos</Heading>
            <Text className="block mb-4">
              8.1. Visos prekės turi gamintojo garantiją pagal gamintojas nustatytus terminus.
            </Text>
            <Text className="block mb-4">
              8.2. Garantija netaikoma:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Mechaniniams pažeidimams dėl netinkamo naudojimo</Text>
              <Text className="block">• Natūraliam susidėvėjimui</Text>
              <Text className="block">• Pažeidimams dėl nepakankamos priežiūros</Text>
              <Text className="block">• Pažeidimams dėl gamtinių veiksnių poveikio</Text>
            </Box>
            <Text className="block">
              8.3. Garantijos atveju Pardavėjas įsipareigoja suremontuoti, pakeisti prekę arba grąžinti sumokėtą sumą.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">9. Atsakomybė</Heading>
            <Text className="block mb-4">
              9.1. Pardavėjas neatsako už:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Netinkamą prekių naudojimą</Text>
              <Text className="block">• Žalą, atsiradusią dėl instrukcijų nevykdymo</Text>
              <Text className="block">• Netiesioginį nuostolį</Text>
              <Text className="block">• Trečiųjų asmenų veiksmų padarinius</Text>
            </Box>
            <Text className="block mb-4">
              9.2. Pirkėjas naudoja prekes savo atsakomybe ir rizika.
            </Text>
            <Text className="block">
              9.3. Pardavėjo atsakomybė apribojama prekės verte.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">10. Ginčų sprendimas</Heading>
            <Text className="block mb-4">
              10.1. Ginčai sprendžiami derybų keliu.
            </Text>
            <Text className="block mb-4">
              10.2. Nepavykus susitarti, ginčai sprendžiami Lietuvos Respublikos teismuose.
            </Text>
            <Text className="block">
              10.3. Pirkėjas turi teisę kreiptis į Valstybinę vartotojų teisių apsaugos tarnybą arba 
              Europos vartotojų ginčų sprendimo internetu platformą: ec.europa.eu/odr.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">11. Taikomi teisės aktai</Heading>
            <Text className="block mb-4">
              11.1. Šios sąlygos reglamentuojamos Lietuvos Respublikos įstatymais.
            </Text>
            <Text className="block mb-4">
              11.2. Taikomos nuostatos:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Lietuvos Respublikos Civilinis kodeksas</Text>
              <Text className="block">• Vartotojų teisių apsaugos įstatymas</Text>
              <Text className="block">• Elektroninės prekybos įstatymas</Text>
              <Text className="block">• Asmens duomenų teisinės apsaugos įstatymas</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">12. Kontaktai</Heading>
            <Text className="block mb-3">
              Klausimais dėl užsakymų ir prekių kreipkitės:
            </Text>
            <Box className="ml-4 space-y-2">
              <Text className="block">
                <strong>El. paštas:</strong> info@gyvagaudziaspastai.lt
              </Text>
              <Text className="block">
                <strong>Telefonas:</strong> [Įrašykite telefono numerį]
              </Text>
              <Text className="block">
                <strong>Darbo laikas:</strong> I-V 9:00-17:00, VI-VII poilsis
              </Text>
              <Text className="block">
                <strong>Adresas:</strong> [Įrašykite įmonės adresą]
              </Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">13. Baigiamosios nuostatos</Heading>
            <Text className="block mb-4">
              13.1. Šios sąlygos įsigalioja nuo 2024 m. [mėnesio] [dienos] d.
            </Text>
            <Text className="block">
              13.2. Jei kurios nors šių sąlygų nuostatos pripažįstamos negaliomis, kitos nuostatos lieka galioti.
            </Text>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
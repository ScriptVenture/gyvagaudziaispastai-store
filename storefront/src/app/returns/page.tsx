"use client"

import { Container, Heading, Text, Box, Separator } from "@radix-ui/themes"

export default function ReturnPolicyPage() {
  return (
    <Container size="3" className="py-8">
      <Heading size="8" className="mb-6">Grąžinimo ir keitimo politika</Heading>
      
      <Box className="prose max-w-none">
        <Text size="3" className="mb-6 block">
          Paskutinį kartą atnaujinta: {new Date().toLocaleDateString('lt-LT')}
        </Text>

        <Separator size="4" className="my-6" />

        <Box className="space-y-6">
          <Box>
            <Heading size="5" className="mb-3">1. Bendrosios nuostatos</Heading>
            <Text className="block mb-4">
              UAB DIGIMAKSAS supranta, kad kartais prekė gali neatitikti Jūsų lūkesčių. 
              Todėl mes siūlome paprastą ir patogų prekių grąžinimo bei keitimo procesą, 
              laikydamiesi Lietuvos Respublikos ir Europos Sąjungos teisės aktų reikalavimų.
            </Text>
            <Text className="block">
              Ši politika taikoma visoms prekėms, įsigytos mūsų internetinėje parduotuvėje www.gyvagaudziaispastai.lt.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">2. 14 dienų grąžinimo terminas</Heading>
            <Text className="block mb-4">
              <strong>Jūs turite teisę grąžinti prekes per 14 kalendorinių dienų</strong> nuo prekės gavimo dienos, 
              nenurodydami grąžinimo priežasties.
            </Text>
            <Text className="block mb-4">
              Grąžinimo terminas skaičiuojamas nuo tos dienos, kurią:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Jūs ar Jūsų nurodytas trečiasis asmuo gavote prekę</Text>
              <Text className="block">• Paskutinę prekę (jei užsakėte keletą prekių)</Text>
              <Text className="block">• Paskutinę prekės dalį arba komponentą (jei prekė sudaryta iš kelių dalių)</Text>
            </Box>
            <Text className="block">
              Norėdami pasinaudoti grąžinimo teise, turite informuoti mus apie savo sprendimą 
              iki 14 dienų termino pabaigos.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">3. Grąžinimo sąlygos</Heading>
            <Text className="block mb-4">
              Prekė gali būti grąžinta, jei:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">✅ <strong>Prekė nepažeista</strong> - nėra mechaninių pažeidimų</Text>
              <Text className="block">✅ <strong>Prekė nenaudota</strong> - išsaugotas prekinis vaizdas</Text>
              <Text className="block">✅ <strong>Originali pakuotė</strong> - prekė originalioje pakuotėje</Text>
              <Text className="block">✅ <strong>Komplektacija</strong> - visi priedai ir dokumentai</Text>
              <Text className="block">✅ <strong>Etikečių išsaugojimas</strong> - nepažeistos etiketės ir brėžiniai</Text>
              <Text className="block">✅ <strong>Higienos reikalavimai</strong> - laikomasi higienos normatyvų</Text>
            </Box>
            
            <Text className="block mb-4">
              <strong>Prekės, kurios negali būti grąžintos:</strong>
            </Text>
            <Box className="ml-4 space-y-2">
              <Text className="block">❌ Individuali užsakymu pagamintos prekės</Text>
              <Text className="block">❌ Prekės, kurios dėl savo pobūdžio gali greitai supisti ar senėti</Text>
              <Text className="block">❌ Prekės, kurios po pristatymo buvo atidaromos ar naudotos higienos tikslais</Text>
              <Text className="block">❌ Prekės su pažeistomis apsauginėmis plombomis ar etiketėmis</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">4. Grąžinimo procedūra</Heading>
            
            <Box className="mb-4">
              <Heading size="4" className="mb-2">4.1. Pranešimas apie grąžinimą</Heading>
              <Text className="block mb-3">Susisiekite su mumis bet kuriuo būdu:</Text>
              <Box className="ml-4 space-y-2">
                <Text className="block">📧 <strong>El. paštas:</strong> prekyba@dmax.lt</Text>
                <Text className="block">📞 <strong>Telefonas:</strong> +37060988861</Text>
                <Text className="block">💬 <strong>Kontaktų forma:</strong> svetainėje</Text>
              </Box>
            </Box>

            <Box className="mb-4">
              <Heading size="4" className="mb-2">4.2. Informacija pranešime</Heading>
              <Box className="ml-4 space-y-2">
                <Text className="block">• Užsakymo numeris</Text>
                <Text className="block">• Prekių, kurias norite grąžinti, sąrašas</Text>
                <Text className="block">• Grąžinimo priežastis (nebūtina, bet padeda mums tobulėti)</Text>
                <Text className="block">• Jūsų kontaktiniai duomenys</Text>
                <Text className="block">• Pageidaujamas sprendimas (pinigų grąžinimas / keitimas)</Text>
              </Box>
            </Box>

            <Box className="mb-4">
              <Heading size="4" className="mb-2">4.3. Prekės išsiuntimas</Heading>
              <Text className="block mb-3">Po Jūsų pranešimo gavimo:</Text>
              <Box className="ml-4 space-y-2">
                <Text className="block">1. Išsiųsime Jums grąžinimo instrukcijas el. paštu</Text>
                <Text className="block">2. Pateikime grąžinimo adresą ir rekomenduojamas pristatymo tarnybas</Text>
                <Text className="block">3. Sudarysime grąžinimo numerį sekimui</Text>
                <Text className="block">4. Patarsime, kaip saugiai supakuoti prekę</Text>
              </Box>
            </Box>

            <Box>
              <Heading size="4" className="mb-2">4.4. Grąžinimo adresas</Heading>
              <Box className="p-4 bg-gray-50 rounded-lg">
                <Text className="block font-semibold">UAB DIGIMAKSAS</Text>
                <Text className="block">Grąžinimo departamentas</Text>
                <Text className="block">Savanorių pr. 214</Text>
                <Text className="block">LT-50194 Kaunas</Text>
                <Text className="block">Lietuva</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">5. Pinigų grąžinimas</Heading>
            <Text className="block mb-4">
              <strong>Terminas:</strong> Pinigus grąžinsime per 14 kalendorinių dienų nuo tos dienos, 
              kai gavome Jūsų pranešimą apie atsikratymą sutartimi.
            </Text>
            <Text className="block mb-4">
              <strong>Grąžinimo būdas:</strong> Pinigai grąžinami tuo pačiu būdu, kuriuo buvo sumokėta:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Banko kortele - grąžinimas į tą pačią kortelę</Text>
              <Text className="block">• Banko pavedimas - į tą patį sąskaitą</Text>
              <Text className="block">• Kitu būdu - susitarę individualiai</Text>
            </Box>
            <Text className="block mb-4">
              <strong>Grąžinama suma:</strong> Grąžinkime pilną prekės kainą, įskaitant PVM.
            </Text>
            <Text className="block">
              <strong>Pristatymo išlaidos:</strong> Pradinės pristatymo išlaidos grąžinamos tik tuo atveju, 
              jei grąžinate visas užsakymo prekes. Grąžinimo išlaidas apmokate Jūs, 
              išskyrus atvejus, kai prekė buvo defektuota ar pristatėme neteisingą prekę.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">6. Prekių keitimas</Heading>
            <Text className="block mb-4">
              Jūs galite keisti prekę į:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Tokią pačią prekę kitu dydžiu ar spalva</Text>
              <Text className="block">• Kitą prekę už tokią pačią kainą</Text>
              <Text className="block">• Kitą prekę už didesnę kainą (su dopriemoku)</Text>
              <Text className="block">• Kitą prekę už mažesnę kainą (su piniginū grąžinimu)</Text>
            </Box>
            
            <Text className="block mb-4">
              <strong>Keitimo procesas:</strong>
            </Text>
            <Box className="ml-4 space-y-2">
              <Text className="block">1. Susisiekite su mumis ir nurodyikite pageidaujamą prekę</Text>
              <Text className="block">2. Patikrinkite, ar pageidaujama prekė yra sandėlyje</Text>
              <Text className="block">3. Išsiųskite originalią prekę</Text>
              <Text className="block">4. Po gavimo ir patikrinimo išsiųsime naują prekę</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">7. Defektų garantija</Heading>
            <Text className="block mb-4">
              Jei prekėje rasite defektą ar ji buvo pažeista transportavimo metu:
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Nedelsiant susisiekite su mumis</Text>
              <Text className="block">• Nufotografuokite defektą ar pažeidimą</Text>
              <Text className="block">• Mes kompensuosime grąžinimo išlaidas</Text>
              <Text className="block">• Pasiūlysime prekės keitimą arba pilną pinigų grąžinimą</Text>
            </Box>
            
            <Text className="block">
              <strong>Garantinis laikotarpis:</strong> 2 metai nuo prekės pirkimo datos 
              (pagal gamintojo garantijos sąlygas).
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">8. Grąžinimo išlaidos</Heading>
            <Text className="block mb-4">
              <strong>Pirkėjo išlaidos:</strong>
            </Text>
            <Box className="ml-4 space-y-2 mb-4">
              <Text className="block">• Prekės grąžinimas be priežasties - pirkėjas apmoka grąžinimo išlaidas</Text>
              <Text className="block">• Rekomenduojame naudoti sekimą ir apdraudimą</Text>
              <Text className="block">• Išlaidos paprastai sudaro 3-7 eurus</Text>
            </Box>
            
            <Text className="block mb-4">
              <strong>Pardavėjo išlaidos:</strong>
            </Text>
            <Box className="ml-4 space-y-2">
              <Text className="block">• Defektuota prekė - kompensuojame grąžinimo išlaidas</Text>
              <Text className="block">• Neteisinga prekė - kompensuojame grąžinimo išlaidas</Text>
              <Text className="block">• Mūsų klaida - visas išlaidas kompensuojame</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">9. Patarimai saugiam grąžinimui</Heading>
            <Box className="ml-4 space-y-2">
              <Text className="block">📦 <strong>Pakavimas:</strong> Naudokite originalią pakuotę ar tinkamą dėžę</Text>
              <Text className="block">🔒 <strong>Apsauga:</strong> Apsaugokite prekę nuo pažeidimų transportavimo metu</Text>
              <Text className="block">📄 <strong>Dokumentai:</strong> Įdėkite prekės pirkimo dokumentų kopijas</Text>
              <Text className="block">📋 <strong>Aprašymas:</strong> Pritvirtinkite grąžinimo priežasčių aprašymą</Text>
              <Text className="block">📬 <strong>Sekimas:</strong> Naudokite sekimo numerį siuntai</Text>
              <Text className="block">💰 <strong>Apdraudimas:</strong> Apsdrausite vertingų prekių siuntas</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">10. Dažniausiai užduodami klausimai</Heading>
            
            <Box className="mb-4">
              <Text className="block font-semibold mb-2">K: Ar galiu grąžinti prekę, jei ją išbandžiau?</Text>
              <Text className="block ml-4">A: Taip, galite išbandyti prekę namuose, tačiau ji turi išlikti nepažeista ir tinkama tolimesniam pardavimui.</Text>
            </Box>
            
            <Box className="mb-4">
              <Text className="block font-semibold mb-2">K: Kiek kainuoja prekės grąžinimas?</Text>
              <Text className="block ml-4">A: Paprastai 3-7 eurus, priklausomai nuo prekės dydžio ir pristatymo būdo.</Text>
            </Box>
            
            <Box className="mb-4">
              <Text className="block font-semibold mb-2">K: Ar galiu grąžinti tik dalį užsakymo?</Text>
              <Text className="block ml-4">A: Taip, galite grąžinti tik tas prekes, kurios Jums netinka.</Text>
            </Box>
            
            <Box>
              <Text className="block font-semibold mb-2">K: Kada gausiu pinigus atgal?</Text>
              <Text className="block ml-4">A: Per 14 dienų nuo grąžinimo pranešimo gavimo, paprastai per 3-7 darbo dienas po prekės gavimo.</Text>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-3">11. Kontaktai grąžinimo klausimais</Heading>
            <Text className="block mb-3">
              Bet kokiais grąžinimo klausimais kreipkitės:
            </Text>
            <Box className="ml-4 space-y-2">
              <Text className="block">
                📧 <strong>El. paštas:</strong> prekyba@dmax.lt
              </Text>
              <Text className="block">
                📞 <strong>Telefonas:</strong> +37060988861
              </Text>
              <Text className="block">
                🕒 <strong>Darbo laikas:</strong> I-V 9:00-17:00, VI-VII poilsis
              </Text>
              <Text className="block">
                💬 <strong>Greitas atsakymas:</strong> Paprastai atsakome per 2-4 valandas darbo metu
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

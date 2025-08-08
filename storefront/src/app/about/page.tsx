"use client"

import { Container, Heading, Text, Box, Separator, Card } from "@radix-ui/themes"
import { Shield, Truck, Award, Users, MapPin, Clock, Phone, Mail } from "lucide-react"

export default function AboutUsPage() {
  return (
    <Container size="3" className="py-8">
      <Heading size="8" className="mb-6">Apie mus</Heading>
      
      <Box className="prose max-w-none">
        <Separator size="4" className="my-6" />

        <Box className="space-y-8">
          <Box>
            <Heading size="6" className="mb-4">UAB „Gyvagaudziaispastai"</Heading>
            <Text className="block mb-4 text-lg">
              Mes esame patikimas humaniškai gyvūnų spąstų ir su tuo susijusios įrangos tiekėjas Baltijos šalyse. 
              Jau daugiau nei 10 metų padedame žmonėms spręsti gyvūnų kontrolės problemas etišku ir humaniškų būdu.
            </Text>
            <Text className="block">
              Mūsų misija - teikti aukštos kokybės, saugias ir veiksmingus gyvūnų spąstus, kurie leidžia 
              sugauti gyvūnus nepakenkiant jų sveikatai ir gerovei.
            </Text>
          </Box>

          <Box>
            <Heading size="5" className="mb-4">Mūsų vertybės</Heading>
            
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <Box className="flex items-center gap-3 mb-3">
                  <Shield className="text-green-600" size={24} />
                  <Heading size="4">Humaniškas poartingavimas</Heading>
                </Box>
                <Text className="text-sm">
                  Visi mūsų spąstai sukurti taip, kad gyvūnai būtų sugauti saugiai, 
                  be sužalojimų ir streso. Remiame etišką gyvūnų kontrolės požiūrį.
                </Text>
              </Card>

              <Card className="p-4">
                <Box className="flex items-center gap-3 mb-3">
                  <Award className="text-blue-600" size={24} />
                  <Heading size="4">Kokybė ir patikimumas</Heading>
                </Box>
                <Text className="text-sm">
                  Siūlome tik išbandytas ir patvirtintas prekės, kurios atitinka aukščiausius 
                  kokybės standartus ir Europos saugos reikalavimus.
                </Text>
              </Card>

              <Card className="p-4">
                <Box className="flex items-center gap-3 mb-3">
                  <Users className="text-purple-600" size={24} />
                  <Heading size="4">Klientų aptarnavimas</Heading>
                </Box>
                <Text className="text-sm">
                  Mūsų komanda visuomet pasirengusi patarti, padėti parity tinkamiausią sprendimą 
                  ir suteikti profesionalų pokančios paramą.
                </Text>
              </Card>

              <Card className="p-4">
                <Box className="flex items-center gap-3 mb-3">
                  <Truck className="text-orange-600" size={24} />
                  <Heading size="4">Greitas pristatymas</Heading>
                </Box>
                <Text className="text-sm">
                  Bendradarbiaujame su patikimais pristatymo partneriais, kad Jūsų užsakymas 
                  pasiektų saugiai ir laiku visoje Baltijos regione.
                </Text>
              </Card>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-4">Mūsų produktų asortimentas</Heading>
            
            <Box className="space-y-4">
              <Box className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <Heading size="4" className="mb-2 text-green-800">🐿️ Mažų gyvūnų spąstai</Heading>
                <Text className="text-sm text-green-700 mb-2">
                  Skirti pelėms, žiurkėms, voveėms, žiurkėnams ir panašaus dydžio gyvūnams.
                </Text>
                <Text className="text-xs text-green-600">
                  Dydžiai: 16", 24", 32" | Tinkamas namų ūkiams ir mažoms patalpoms
                </Text>
              </Box>

              <Box className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Heading size="4" className="mb-2 text-blue-800">🐱 Vidutinių gyvūnų spąstai</Heading>
                <Text className="text-sm text-blue-700 mb-2">
                  Skirti katėms, šeškataupiams, triušiams, ungurūų, šeškatamadams ir panašiems gyvūnams.
                </Text>
                <Text className="text-xs text-blue-600">
                  Dydžiai: 32", 36", 42" | Populiariausi modeliai universaliam naudojimui
                </Text>
              </Box>

              <Box className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <Heading size="4" className="mb-2 text-orange-800">🦝 Didelių gyvūnų spąstai</Heading>
                <Text className="text-sm text-orange-700 mb-2">
                  Skirti meškėnams, audomatiems, dideltųms šunims, enoto šunims ir kitms stambiems gyvūnams.
                </Text>
                <Text className="text-xs text-orange-600">
                  Dydžiai: 48", 54", 64" | Stiprios konstrukcijos profesionaliam naudojimui
                </Text>
              </Box>

              <Box className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <Heading size="4" className="mb-2 text-purple-800">🔧 Priedai ir įranga</Heading>
                <Text className="text-sm text-purple-700 mb-2">
                  Apsauginės pirštinės, vešnės, transportavimo dėžės, spąstų dangasiai ir kita įranga.
                </Text>
                <Text className="text-xs text-purple-600">
                  Viskas, kas reikia saugiam ir efektyviam darbui su gyvūnų spąstais
                </Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-4">Kodėl rinktis mus?</Heading>
            
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box className="space-y-3">
                <Text className="block">✅ <strong>10+ metų patirtis</strong> gyvūnų kontrolės srityje</Text>
                <Text className="block">✅ <strong>Sertifikuoti produktai</strong> su CE ženklu</Text>
                <Text className="block">✅ <strong>2 metų garantija</strong> visoms prekėms</Text>
                <Text className="block">✅ <strong>Nemokamas pristatymas</strong> nuo 50€ (Lietuva)</Text>
                <Text className="block">✅ <strong>14 dienų grąžinimo</strong> garantija</Text>
              </Box>
              
              <Box className="space-y-3">
                <Text className="block">✅ <strong>Profesionalūs patarimai</strong> specialistų komandos</Text>
                <Text className="block">✅ <strong>Greitas pristatymas</strong> 2-5 darbo dienų</Text>
                <Text className="block">✅ <strong>Saugūs mokėjimai</strong> Paysera sistema</Text>
                <Text className="block">✅ <strong>Lithuanian aptarnavimas</strong> gimtąja kalba</Text>
                <Text className="block">✅ <strong>Ekologiškas pakavimas</strong> - rūpinamės gamta</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-4">Veiklos sritys</Heading>
            <Text className="block mb-4">
              Mūsų klientai - tai platus ratų žmonių, kuriems reikia spręsti gyvūnų kontrolės klausimus:
            </Text>
            
            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Box className="text-center p-4 bg-gray-50 rounded-lg">
                <Text className="block font-semibold mb-2">🏠 Namų ūkiai</Text>
                <Text className="text-sm">Privatūs asmenys, kuriems reikia apsisaugoti nuo kenksmingų gyvūnų</Text>
              </Box>
              
              <Box className="text-center p-4 bg-gray-50 rounded-lg">
                <Text className="block font-semibold mb-2">🏢 Įmonės</Text>
                <Text className="text-sm">Restoranai, viešbučiai, sandėliai ir kitos verslo įmonės</Text>
              </Box>
              
              <Box className="text-center p-4 bg-gray-50 rounded-lg">
                <Text className="block font-semibold mb-2">🏛️ Institucijos</Text>
                <Text className="text-sm">Savivaldybės, švietimo įstaigos, sveikatos centrai</Text>
              </Box>
              
              <Box className="text-center p-4 bg-gray-50 rounded-lg">
                <Text className="block font-semibold mb-2">🌾 Ūkininkai</Text>
                <Text className="text-sm">Žemės ūkio bendrovės ir privatūs ūkininkai</Text>
              </Box>
              
              <Box className="text-center p-4 bg-gray-50 rounded-lg">
                <Text className="block font-semibold mb-2">🎣 Medžiotojai</Text>
                <Text className="text-sm">Medžiotojų klubai ir privatūs medžiotojai</Text>
              </Box>
              
              <Box className="text-center p-4 bg-gray-50 rounded-lg">
                <Text className="block font-semibold mb-2">🐕 Gyvūnų globos</Text>
                <Text className="text-sm">Gyvūnų prieglaudos, veterinarijos klinikos</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-4">Mūsų komanda</Heading>
            <Text className="block mb-4">
              UAB „Gyvagaudziaispastai" komandą sudaro patyrę specialistai, kurie puikiai išmano 
              gyvūnų elgseną ir spąstų veikimo principus. Mes nuolat tobulėjame ir sekame 
              naujausias technologijas bei metodus humaniškai gyvūnų kontrolės srityje.
            </Text>
            
            <Box className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Text className="block font-semibold mb-2">💡 Mūsų ekspertai padės:</Text>
              <Box className="ml-4 space-y-1 text-sm">
                <Text className="block">• Pasirinkti tinkamiausią spąstų tipą ir dydį</Text>
                <Text className="block">• Nustatyti geriausia spąstų išdėstymo vietas</Text>
                <Text className="block">• Parinkti tinkamus priekešus gyvūnų tip</Text>
                <Text className="block">• Pasiruošti saugų gyvūnų paleisdojan</Text>
                <Text className="block">• Išspręsti sudėțingas gyvūnų kontrolės situacijas</Text>
              </Box>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-4">Kontaktai ir darbo laikas</Heading>
            
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <Heading size="4" className="mb-3">📞 Susisiekite su mumis</Heading>
                
                <Box className="space-y-3">
                  <Box className="flex items-center gap-3">
                    <Phone className="text-blue-600" size={18} />
                    <Text className="text-sm">
                      <strong>Telefonas:</strong> [Įrašykite telefono numerį]
                    </Text>
                  </Box>
                  
                  <Box className="flex items-center gap-3">
                    <Mail className="text-green-600" size={18} />
                    <Text className="text-sm">
                      <strong>El. paštas:</strong> info@gyvagaudziaispastai.lt
                    </Text>
                  </Box>
                  
                  <Box className="flex items-center gap-3">
                    <MapPin className="text-red-600" size={18} />
                    <Text className="text-sm">
                      <strong>Adresas:</strong> [Įrašykite įmonės adresą]
                    </Text>
                  </Box>
                  
                  <Box className="flex items-center gap-3">
                    <Clock className="text-purple-600" size={18} />
                    <Text className="text-sm">
                      <strong>Darbo laikas:</strong><br />
                      I-V: 9:00-17:00<br />
                      VI-VII: Poilsis
                    </Text>
                  </Box>
                </Box>
              </Card>

              <Card className="p-4">
                <Heading size="4" className="mb-3">🏢 Įmonės rekvizitai</Heading>
                
                <Box className="space-y-2 text-sm">
                  <Text className="block">
                    <strong>Pavadinimas:</strong> UAB „Gyvagaudziaispastai"
                  </Text>
                  <Text className="block">
                    <strong>Įmonės kodas:</strong> [Įrašykite įmonės kodą]
                  </Text>
                  <Text className="block">
                    <strong>PVM kodas:</strong> [Įrašykite PVM kodą]
                  </Text>
                  <Text className="block">
                    <strong>Banko sąskaita:</strong> [Įrašykite sąskaitų numerį]
                  </Text>
                  <Text className="block">
                    <strong>Bankas:</strong> [Įrašykite banko pavadinimą]
                  </Text>
                  <Text className="block">
                    <strong>SWIFT kodas:</strong> [Įrašykite SWIFT kodą]
                  </Text>
                </Box>
              </Card>
            </Box>
          </Box>

          <Box>
            <Heading size="5" className="mb-4">Aplinkosaugos įsipareigojimas</Heading>
            <Text className="block mb-4">
              Mes rūpinamės ne tik gyvūnų gerove, bet ir aplinkos apsauga:
            </Text>
            
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box className="space-y-2">
                <Text className="block">🌱 <strong>Ekologiškas pakavimas</strong> - naudojame perdirbamą medžiagą</Text>
                <Text className="block">♻️ <strong>Atliekų mažinimas</strong> - optimalus pristatymo maršrutas</Text>
                <Text className="block">🌍 <strong>Žaliasis pristatymas</strong> - bendradarbiaujame su ekologiškais kurjeriais</Text>
              </Box>
              
              <Box className="space-y-2">
                <Text className="block">💡 <strong>Energijos taupymas</strong> - naudojame atsinaujinančius išteklius</Text>
                <Text className="block">🔄 <strong>Produktų perdirbimas</strong> - priimame senus spąstus utilizavimui</Text>
                <Text className="block">📚 <strong>Edukacijos veikla</strong> - skelbiame informacija apie humanišką gyvūnų kontrolę</Text>
              </Box>
            </Box>
          </Box>

          <Box className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <Box className="text-center">
              <Heading size="4" className="mb-3 text-green-800">
                Dėkojame, kad pasirinkote mus!
              </Heading>
              <Text className="block text-green-700 mb-4">
                Jūsų pasitikėjimas mūsų darbu motyvuoja mus nuolat tobulėti ir teikti 
                aukščiausios kokybės produktus bei paslaugas. Kartu kuriame saugesnę 
                ir harmoniškesnę aplinką žmonėms ir gyvūnams.
              </Text>
              <Text className="block font-semibold text-green-800">
                UAB „Gyvagaudziaispastai" - jūsų patikimas partneris humaniškai gyvūnų kontrolės srityje.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
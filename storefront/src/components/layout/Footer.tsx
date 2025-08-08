import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart, Shield, Award, Truck } from 'lucide-react'
import TrapLogo from '@/components/ui/TrapLogo'
import { Button, Text, Heading, Flex, Grid, Section, Container } from '@radix-ui/themes'
import { brandColors, componentStyles } from '@/utils/colors'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ 
      background: `linear-gradient(135deg, ${brandColors.primary} 0%, #0A3D2E 50%, ${brandColors.tertiary} 100%)`,
      color: brandColors.white 
    }}>
      {/* Subtle lighting effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Trust indicators bar */}
      <div className="border-b border-white/10 py-6 sm:py-8">
        <Container size="4">
          <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap={{ initial: "4", sm: "6" }}>
            <Flex align="center" gap="3" className="text-center sm:text-left" justify={{ initial: "center", sm: "start" }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <Text size={{ initial: "2", sm: "3" }} weight="bold" className="block">30 dienų garantija</Text>
                <Text size={{ initial: "1", sm: "2" }} className="opacity-80">Saugus grąžinimas</Text>
              </div>
            </Flex>
            
            <Flex align="center" gap="3" className="text-center sm:text-left" justify={{ initial: "center", sm: "start" }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <Text size={{ initial: "2", sm: "3" }} weight="bold" className="block">Nemokamas pristatymas</Text>
                <Text size={{ initial: "1", sm: "2" }} className="opacity-80">Užsakymams nuo €75</Text>
              </div>
            </Flex>
            
            <Flex align="center" gap="3" className="text-center sm:text-left" justify={{ initial: "center", sm: "start" }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <Text size={{ initial: "2", sm: "3" }} weight="bold" className="block">Ekspertų pagalba</Text>
                <Text size={{ initial: "1", sm: "2" }} className="opacity-80">Profesionalūs patarimai</Text>
              </div>
            </Flex>
            
            <Flex align="center" gap="3" className="text-center sm:text-left" justify={{ initial: "center", sm: "start" }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <TrapLogo className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <Text size={{ initial: "2", sm: "3" }} weight="bold" className="block">Humaniški sprendimai</Text>
                <Text size={{ initial: "1", sm: "2" }} className="opacity-80">Draugiški gyvūnams</Text>
              </div>
            </Flex>
          </Grid>
        </Container>
      </div>

      {/* Main footer content */}
      <Section size="3">
        <Container size="4">
          <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap={{ initial: "6", sm: "8" }}>
            {/* Company Info */}
            <div className="text-center sm:text-left">
              <Flex align="center" gap="3" className="mb-4 sm:mb-6" justify={{ initial: "center", sm: "start" }}>
                <div className="relative">
                  <div 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ 
                      background: componentStyles.gradients.accent,
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <TrapLogo className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full" />
                </div>
                <div>
                  <Heading size={{ initial: "3", sm: "4" }} className="font-bold">Gyvagaudziaispastai</Heading>
                  <Text size="1" className="opacity-80">Humaniški gyvūnų spąstai</Text>
                </div>
              </Flex>
              
              <Text size={{ initial: "1", sm: "2" }} className="mb-4 sm:mb-6 opacity-90 leading-relaxed">
                Patikimi profesionalų ir namų savininkų visame pasaulyje dėl efektyvių,
                humaniškų gyvūnų spąstų. Saugus pagavimas ir perkėlimas.
              </Text>
              
              <Flex gap="2 sm:gap-3" justify={{ initial: "center", sm: "start" }}>
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <Link key={index} href="#" className="group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-amber-300 transition-colors" />
                    </div>
                  </Link>
                ))}
              </Flex>
            </div>

            {/* Products & Solutions */}
            <div className="text-center sm:text-left">
              <Heading size={{ initial: "3", sm: "4" }} className="mb-3 sm:mb-4 font-semibold">Gyvūnų spąstai</Heading>
              <Flex direction="column" gap="1.5 sm:gap-2">
                {[
                  'Mažų gyvūnų spąstai',
                  'Vidutinių gyvūnų spąstai', 
                  'Didelių gyvūnų spąstai',
                  '1 durų spąstai',
                  '2 durų spąstai',
                  'Profesionalūs spąstai'
                ].map((item) => (
                  <Link key={item} href="/traps" className="text-white/80 hover:text-amber-300 transition-colors text-xs sm:text-sm">
                    {item}
                  </Link>
                ))}
              </Flex>
            </div>

            {/* Support & Resources */}
            <div className="text-center sm:text-left">
              <Heading size={{ initial: "3", sm: "4" }} className="mb-3 sm:mb-4 font-semibold">Pagalba ir ištekliai</Heading>
              <Flex direction="column" gap="1.5 sm:gap-2">
                {[
                  'Spąstų įrengimo gidas',
                  'Gyvūnų identifikavimas',
                  'Masalo rekomendacijos',
                  'Saugos instrukcijos',
                  'Garantija ir grąžinimai',
                  'Sekti užsakymą'
                ].map((item) => (
                  <Link key={item} href="/support" className="text-white/80 hover:text-amber-300 transition-colors text-xs sm:text-sm">
                    {item}
                  </Link>
                ))}
              </Flex>
            </div>

            {/* Contact & Newsletter */}
            <div className="text-center sm:text-left">
              <Heading size={{ initial: "3", sm: "4" }} className="mb-3 sm:mb-4 font-semibold">Susisiekite</Heading>
              
              {/* Contact Info */}
              <Flex direction="column" gap="2 sm:gap-3" className="mb-4 sm:mb-6">
                <Flex align="center" gap="2 sm:gap-3" justify={{ initial: "center", sm: "start" }}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                  <Text size={{ initial: "1", sm: "2" }} className="opacity-90">+370 5 123 4567</Text>
                </Flex>
                
                <Flex align="center" gap="2 sm:gap-3" justify={{ initial: "center", sm: "start" }}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                  <Text size={{ initial: "1", sm: "2" }} className="opacity-90 break-all sm:break-normal">info@gyvagaudziaispastai.lt</Text>
                </Flex>
                
                <Flex align="start" gap="2 sm:gap-3" justify={{ initial: "center", sm: "start" }}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                  <Text size={{ initial: "1", sm: "2" }} className="opacity-90 leading-relaxed">
                    Profesionalūs gyvūnų kontrolės<br />
                    sprendimai Lietuvoje
                  </Text>
                </Flex>
              </Flex>

              {/* Newsletter */}
              <div>
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                    Gaukite patarimus ir pasiūlymus
                  </h3>
                  <p className="text-xs sm:text-sm opacity-80 text-white">
                    Ekspertų patarimai ir išskirtiniai pasiūlymai kas savaitę
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Įveskite savo el. pašto adresą"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-white/60"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: brandColors.white,
                        focusRingColor: brandColors.secondary
                      }}
                    />
                  </div>
                  
                  <button 
                    className="w-full py-2 sm:py-3 text-sm font-medium rounded-lg transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${brandColors.secondary} 0%, ${brandColors.warning} 100%)`,
                      color: brandColors.white,
                      focusRingColor: brandColors.secondary
                    }}
                  >
                    Prenumeruoti nemokamus patarimus
                  </button>
                  
                  <p className="text-xs text-white/60 text-center">
                    Jokio šlamšto. Atsisakyti galima bet kada.
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Bottom footer with enhanced lighting */}
      <div className="border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        <Container size="4">
          <Flex 
            direction={{ initial: "column", md: "row" }} 
            justify="between" 
            align="center" 
            gap="4"
            className="py-6"
          >
            <Flex align="center" gap="4">
              <Text size="2" className="opacity-80">
                © 2024 Gyvagaudziaispastai. Visos teisės saugomos.
              </Text>
            </Flex>
            
            <Flex align="center" gap="6" className="relative z-10">
              {[
                { label: 'Privatumo politika', href: '/privacy' },
                { label: 'Sąlygos', href: '/terms' },
                { label: 'Grąžinimai', href: '/returns' },
                { label: 'BDAR', href: '/gdpr' },
                { label: 'Slapukai', href: '/cookies' },
                { label: 'Apie mus', href: '/about' }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className="text-white/70 hover:text-amber-300 transition-colors text-sm relative z-10 cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Container>
      </div>
      
      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent pointer-events-none" />
    </footer>
  )
}
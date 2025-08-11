import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart, Shield, Award, Truck } from 'lucide-react'
import TrapLogo from '@/components/ui/TrapLogo'
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-bold">30 dienų garantija</div>
                <div className="text-xs sm:text-sm opacity-80">Saugus grąžinimas</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-bold">Nemokamas pristatymas</div>
                <div className="text-xs sm:text-sm opacity-80">Užsakymams nuo €75</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-bold">Ekspertų pagalba</div>
                <div className="text-xs sm:text-sm opacity-80">Profesionalūs patarimai</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-center sm:text-left justify-center sm:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <TrapLogo className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-base font-bold">Humaniški sprendimai</div>
                <div className="text-xs sm:text-sm opacity-80">Draugiški gyvūnams</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="text-center md:text-left col-span-1 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 justify-center md:justify-start">
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
                  <h3 className="text-lg sm:text-xl font-bold">Gyvagaudziaispastai</h3>
                  <div className="text-xs opacity-80">Humaniški gyvūnų spąstai</div>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm mb-4 sm:mb-6 opacity-90 leading-relaxed">
                Patikimi profesionalų ir namų savininkų visame pasaulyje dėl efektyvių,
                humaniškų gyvūnų spąstų. Saugus pagavimas ir perkėlimas.
              </p>
              
              <div className="flex gap-2 sm:gap-3 justify-center md:justify-start">
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
              </div>
            </div>

            {/* Products & Solutions */}
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4 font-semibold">Gyvūnų spąstai</h3>
              <div className="flex flex-col gap-1.5 sm:gap-2">
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
              </div>
            </div>

            {/* Support & Resources */}
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4 font-semibold">Pagalba ir ištekliai</h3>
              <div className="flex flex-col gap-1.5 sm:gap-2">
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
              </div>
            </div>

            {/* Contact & Newsletter */}
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl mb-3 sm:mb-4 font-semibold">Susisiekite</h3>
              
              {/* Contact Info */}
              <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                  <div className="text-xs sm:text-sm opacity-90">+370 5 123 4567</div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                  <div className="text-xs sm:text-sm opacity-90 break-words">info@gyvagaudziaispastai.lt</div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3 justify-center md:justify-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300" />
                  </div>
                  <div className="text-xs sm:text-sm opacity-90 leading-relaxed">
                    Profesionalūs gyvūnų kontrolės<br />
                    sprendimai Lietuvoje
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <div className="mb-3 sm:mb-4">
                  <h4 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">
                    Gaukite patarimus ir pasiūlymus
                  </h4>
                  <p className="text-xs opacity-80 text-white">
                    Ekspertų patarimai ir išskirtiniai pasiūlymai kas savaitę
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Įveskite savo el. pašto adresą"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-white/60"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: brandColors.white,
                        outline: `2px solid ${brandColors.secondary}`,
                        outlineOffset: '2px'
                      }}
                    />
                  </div>
                  
                  <button 
                    className="w-full py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${brandColors.secondary} 0%, ${brandColors.warning} 100%)`,
                      color: brandColors.white,
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
          </div>
        </div>
      </div>

      {/* Bottom footer with enhanced lighting */}
      <div className="border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 py-6">
            {/* Copyright */}
            <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
              <div className="text-sm opacity-80 text-center md:text-left">
                © 2024 Gyvagaudziaispastai. Visos teisės saugomos.
              </div>
            </div>
            
            {/* Policy Links */}
            <div className="w-full md:w-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-3 sm:gap-4 md:gap-6 relative z-10">
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
                    className="text-white/70 hover:text-amber-300 transition-colors text-xs sm:text-sm relative z-10 cursor-pointer text-center md:text-left"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent pointer-events-none" />
    </footer>
  )
}
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart, Shield, Award, Truck } from 'lucide-react'
import { Button, Text, Heading, Flex, Grid, Section, Container, Separator } from '@radix-ui/themes'
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
      <div className="border-b border-white/10 py-8">
        <Container size="4">
          <Grid columns={{ initial: "2", md: "4" }} gap="6">
            <Flex align="center" gap="3" className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <Text size="3" weight="bold" className="block">30-Day Guarantee</Text>
                <Text size="2" className="opacity-80">Risk-free returns</Text>
              </div>
            </Flex>
            
            <Flex align="center" gap="3" className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <Text size="3" weight="bold" className="block">Free Shipping</Text>
                <Text size="2" className="opacity-80">Orders over $75</Text>
              </div>
            </Flex>
            
            <Flex align="center" gap="3" className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <Text size="3" weight="bold" className="block">Expert Support</Text>
                <Text size="2" className="opacity-80">Professional advice</Text>
              </div>
            </Flex>
            
            <Flex align="center" gap="3" className="text-center md:text-left">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <Text size="3" weight="bold" className="block">Humane Solutions</Text>
                <Text size="2" className="opacity-80">Wildlife friendly</Text>
              </div>
            </Flex>
          </Grid>
        </Container>
      </div>

      {/* Main footer content */}
      <Section size="3">
        <Container size="4">
          <Grid columns={{ initial: "1", md: "2", lg: "4" }} gap="8">
            {/* Company Info */}
            <div>
              <Flex align="center" gap="3" className="mb-6">
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ 
                      background: componentStyles.gradients.accent,
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
                </div>
                <div>
                  <Heading size="4" className="font-bold">WildControl</Heading>
                  <Text size="1" className="opacity-80">Professional Solutions</Text>
                </div>
              </Flex>
              
              <Text size="2" className="mb-6 opacity-90 leading-relaxed">
                Trusted by professionals and homeowners worldwide for effective, 
                humane wildlife control solutions since 1940.
              </Text>
              
              <Flex gap="3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <Link key={index} href="#" className="group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Icon className="w-5 h-5 group-hover:text-amber-300 transition-colors" />
                    </div>
                  </Link>
                ))}
              </Flex>
            </div>

            {/* Products & Solutions */}
            <div>
              <Heading size="4" className="mb-4 font-semibold">Products & Solutions</Heading>
              <Flex direction="column" gap="2">
                {[
                  'Animal Traps',
                  'Repellent Systems', 
                  'Exclusion Products',
                  'Monitoring Tools',
                  'Professional Solutions',
                  'Humane Devices'
                ].map((item) => (
                  <Link key={item} href="/products" className="text-white/80 hover:text-amber-300 transition-colors text-sm">
                    {item}
                  </Link>
                ))}
              </Flex>
            </div>

            {/* Support & Resources */}
            <div>
              <Heading size="4" className="mb-4 font-semibold">Support & Resources</Heading>
              <Flex direction="column" gap="2">
                {[
                  'Help Center',
                  'Installation Guides',
                  'Video Tutorials',
                  'Expert Consultation',
                  'Warranty & Returns',
                  'Track Your Order'
                ].map((item) => (
                  <Link key={item} href="/support" className="text-white/80 hover:text-amber-300 transition-colors text-sm">
                    {item}
                  </Link>
                ))}
              </Flex>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <Heading size="4" className="mb-4 font-semibold">Stay Connected</Heading>
              
              {/* Contact Info */}
              <Flex direction="column" gap="3" className="mb-6">
                <Flex align="center" gap="3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Phone className="w-4 h-4 text-amber-300" />
                  </div>
                  <Text size="2" className="opacity-90">1-800-WILDCONTROL</Text>
                </Flex>
                
                <Flex align="center" gap="3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Mail className="w-4 h-4 text-amber-300" />
                  </div>
                  <Text size="2" className="opacity-90">support@wildcontrol.com</Text>
                </Flex>
                
                <Flex align="start" gap="3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <MapPin className="w-4 h-4 text-amber-300" />
                  </div>
                  <Text size="2" className="opacity-90 leading-relaxed">
                    Professional Wildlife Control<br />
                    Solutions Worldwide
                  </Text>
                </Flex>
              </Flex>

              {/* Newsletter */}
              <div>
                <Text size="3" weight="medium" className="block mb-3">Get Expert Tips</Text>
                <Flex gap="0" className="overflow-hidden rounded-lg">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      color: brandColors.white,
                      placeholder: { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                  />
                  <Button 
                    size="2"
                    className="font-medium"
                    style={{ 
                      background: brandColors.secondary,
                      color: brandColors.white,
                      borderRadius: '0'
                    }}
                  >
                    Subscribe
                  </Button>
                </Flex>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Bottom footer with enhanced lighting */}
      <div className="border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
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
                © 2024 WildControl. All rights reserved.
              </Text>
              <div className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
              <Text size="2" className="opacity-80">
                Trusted wildlife solutions since 1940
              </Text>
            </Flex>
            
            <Flex align="center" gap="6">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Accessibility', href: '/accessibility' }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className="text-white/70 hover:text-amber-300 transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </Flex>
          </Flex>
        </Container>
      </div>
      
      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
    </footer>
  )
}
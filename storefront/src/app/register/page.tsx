"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Heading, Text, Button, Card, TextField, Separator } from '@radix-ui/themes'
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Shield, CheckCircle } from 'lucide-react'
import { brandColors } from '@/utils/colors'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Slaptažodžiai nesutampa')
      return
    }
    
    if (!formData.acceptTerms) {
      alert('Prašome sutikti su naudojimo sąlygomis')
      return
    }
    
    console.log('Register form submitted:', formData)
    // Here you would typically handle the registration logic
    alert('Registracija dar neįgyvendinta. Tai demo versija.')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${brandColors.primary}20` }}>
            <User className="h-8 w-8" style={{ color: brandColors.primary }} />
          </div>
          <Heading size="7" className="mb-2" style={{ color: brandColors.primary }}>
            Sukurti paskyrą
          </Heading>
          <Text size="3" color="gray">
            Prisijunkite prie mūsų bendruomenės ir gaukite geriausia patyrimą
          </Text>
        </div>

        {/* Registration Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                  Vardas
                </Text>
                <TextField.Root
                  placeholder="Vardas"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                  size="3"
                />
              </div>
              <div>
                <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                  Pavardė
                </Text>
                <TextField.Root
                  placeholder="Pavardė"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                  size="3"
                />
              </div>
            </div>

            <div>
              <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                El. pašto adresas
              </Text>
              <TextField.Root
                type="email"
                placeholder="jusu.el.pastas@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                size="3"
              >
                <TextField.Slot>
                  <Mail className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                </TextField.Slot>
              </TextField.Root>
            </div>

            <div>
              <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                Telefono numeris <Text size="2" color="gray">(neprivaloma)</Text>
              </Text>
              <TextField.Root
                type="tel"
                placeholder="+370 600 12345"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                size="3"
              >
                <TextField.Slot>
                  <Phone className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                </TextField.Slot>
              </TextField.Root>
            </div>

            <div>
              <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                Slaptažodis
              </Text>
              <TextField.Root
                type={showPassword ? "text" : "password"}
                placeholder="Mažiausiai 8 simboliai"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={8}
                size="3"
              >
                <TextField.Slot>
                  <Lock className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                </TextField.Slot>
                <TextField.Slot>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                    ) : (
                      <Eye className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                    )}
                  </button>
                </TextField.Slot>
              </TextField.Root>
            </div>

            <div>
              <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                Pakartoti slaptažodį
              </Text>
              <TextField.Root
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Pakartokite slaptažodį"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                size="3"
              >
                <TextField.Slot>
                  <Lock className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                </TextField.Slot>
                <TextField.Slot>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                    ) : (
                      <Eye className="h-4 w-4" style={{ color: brandColors.textTertiary }} />
                    )}
                  </button>
                </TextField.Slot>
              </TextField.Root>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                  className="h-4 w-4 rounded mt-1"
                  style={{ accentColor: brandColors.primary }}
                  required
                />
                <label htmlFor="accept-terms" className="ml-2 text-sm text-gray-900">
                  Sutinku su{' '}
                  <Link href="/terms" className="font-medium hover:underline" style={{ color: brandColors.primary }}>
                    naudojimo sąlygomis
                  </Link>
                  {' '}ir{' '}
                  <Link href="/privacy" className="font-medium hover:underline" style={{ color: brandColors.primary }}>
                    privatumo politika
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({...formData, newsletter: e.target.checked})}
                  className="h-4 w-4 rounded mt-1"
                  style={{ accentColor: brandColors.primary }}
                />
                <label htmlFor="newsletter" className="ml-2 text-sm text-gray-900">
                  Noriu gauti naujienlaišką su pasiūlymais ir patarimais
                </label>
              </div>
            </div>

            <Button
              type="submit"
              size="3"
              className="w-full flex items-center justify-center gap-2 font-medium"
              style={{ 
                backgroundColor: brandColors.primary,
                color: 'white'
              }}
            >
              Sukurti paskyrą
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="text-center">
            <Text size="3" color="gray">
              Jau turite paskyrą?{' '}
              <Link 
                href="/login" 
                className="font-medium hover:underline transition-colors"
                style={{ color: brandColors.primary }}
              >
                Prisijunkite čia
              </Link>
            </Text>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-6" style={{ backgroundColor: `${brandColors.primary}10`, borderColor: brandColors.primary }}>
          <div className="text-center mb-4">
            <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: brandColors.primary }} />
            <Heading size="4" style={{ color: brandColors.primary }}>
              Jūsų privalumai
            </Heading>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brandColors.primary }} />
              <Text size="2" color="gray">
                10% nuolaida pirkiem pirkimui
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brandColors.primary }} />
              <Text size="2" color="gray">
                Nemokamas pristatymas bet kuriam užsakymui
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brandColors.primary }} />
              <Text size="2" color="gray">
                Prioritetinė klientų pagalba
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: brandColors.primary }} />
              <Text size="2" color="gray">
                Ekskluzyvūs pasiūlymai
              </Text>
            </div>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm font-medium hover:underline transition-colors"
            style={{ color: brandColors.textSecondary }}
          >
            ← Grįžti į pradžią
          </Link>
        </div>
      </div>
    </div>
  )
}
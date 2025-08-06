"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Heading, Text, Button, Card, TextField, Separator } from '@radix-ui/themes'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, User } from 'lucide-react'
import { brandColors } from '@/utils/colors'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login form submitted:', formData)
    // Here you would typically handle the login logic
    alert('Prisijungimas dar neįgyvendintas. Tai demo versija.')
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
            Prisijunkite
          </Heading>
          <Text size="3" color="gray">
            Prisijunkite prie savo paskyros ir tvarkyti užsakymus
          </Text>
        </div>

        {/* Login Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                El. pašto adresas
              </Text>
              <div className="relative">
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
            </div>

            <div>
              <Text size="3" weight="medium" className="mb-2" style={{ color: brandColors.primary }}>
                Slaptažodis
              </Text>
              <div className="relative">
                <TextField.Root
                  type={showPassword ? "text" : "password"}
                  placeholder="Įveskite slaptažodį"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  style={{ accentColor: brandColors.primary }}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                  Prisiminti mane
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/reset-password" 
                  className="font-medium hover:underline transition-colors"
                  style={{ color: brandColors.primary }}
                >
                  Pamiršote slaptažodį?
                </Link>
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
              Prisijungti
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <Separator className="my-6" />

          <div className="text-center">
            <Text size="3" color="gray">
              Neturite paskyros?{' '}
              <Link 
                href="/register" 
                className="font-medium hover:underline transition-colors"
                style={{ color: brandColors.primary }}
              >
                Registruokitės čia
              </Link>
            </Text>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-6" style={{ backgroundColor: `${brandColors.primary}10`, borderColor: brandColors.primary }}>
          <div className="text-center mb-4">
            <Shield className="w-8 h-8 mx-auto mb-2" style={{ color: brandColors.primary }} />
            <Heading size="4" style={{ color: brandColors.primary }}>
              Kodėl verta susikurti paskyrą?
            </Heading>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors.primary }}></div>
              <Text size="2" color="gray">
                Greitas užsakymų pateikimas
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors.primary }}></div>
              <Text size="2" color="gray">
                Užsakymų istorijos sekimas
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors.primary }}></div>
              <Text size="2" color="gray">
                Specialūs pasiūlymai ir nuolaidos
              </Text>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors.primary }}></div>
              <Text size="2" color="gray">
                Ekspertų konsultacijos
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
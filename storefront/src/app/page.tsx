"use client"

import Link from "next/link";
import Image from "next/image";
import { Search, Squirrel, Star, Heart, Shield, Award, BookOpen, Play, Users, ArrowRight, Cat, Check, ShoppingCart } from "lucide-react";
import { Card, Flex, Text, Heading, Grid, Section, Container } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import BestsellingProducts from "@/components/sections/BestsellingProducts";
import MoreProfessionalTraps from "@/components/sections/MoreProfessionalTraps";

export default function Home() {
  // Best quality hero image and content
  const heroContent = {
    mainImage: "/imagen5.jpg",
    title: "Profesionalūs gyvūnų spąstai",
    subtitle: "Patikimi gyvūnų kontrolės ekspertų visame pasaulyje",
    description: "Saugūs, efektyvūs ir visiškai humaniški gyvūnų gaudymo sprendimai profesionaliai gyvūnų kontrolei ir namų savininkų ramybei."
  };

  return (
    <div>
      {/* Modern Split-Screen Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br from-green-50/30 via-white to-blue-50/20 overflow-hidden" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'}}>
        
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-amber-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Floating particles for premium feel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-300/30 rounded-full animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px]">
            
            {/* Content Side */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-3 bg-green-50/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-green-200/60">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-800">
                  Patikimi gyvūnų kontrolės ekspertai visame pasaulyje
                </span>
                <Shield className="w-4 h-4 text-green-600" />
              </div>

              {/* Enhanced Main Heading with better typography */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                    <span className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                      Humaniški
                    </span>
                    <br />
                    <span className="text-gray-800 relative">
                      Gyvūnų Spąstai
                      <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"></div>
                    </span>
                  </h1>
                  
                  {/* Enhanced subtitle with better spacing */}
                  <div className="pt-4">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                      Profesionalūs sprendimai gyvūnų kontrolei
                    </p>
                  </div>
                </div>
                
                <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Patikimi ekspertų visame pasaulyje. Saugūs, efektyvūs ir visiškai humaniški gyvūnų gaudymo spąstai su 30 dienų garantija.
                </p>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                {[
                  { icon: Shield, text: "100% Humaniškas", color: "text-green-600" },
                  { icon: Award, text: "Ekspertų patvirtinta", color: "text-blue-600" },
                  { icon: Check, text: "Įrodyta kokybė", color: "text-amber-600" }
                ].map((feature, index) => (
                  <div key={index} className="flex flex-col items-center lg:items-start gap-2">
                    <div className={`w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center ${feature.color}`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Enhanced CTA Buttons with modern styling */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/traps" className="group">
                  <Button 
                    variant="default"
                    size="lg"
                    className="px-10 py-5 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5" />
                      Peržiūrėti spąstus
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                
                <Link href="/guide" className="group">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-10 py-5 text-lg font-semibold border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5" />
                      Montavimo gidai
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-6 border-t border-gray-200">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-gray-900">15,000+</div>
                  <div className="text-sm text-gray-600">Gyvūnų perkelta</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                  <div className="text-sm text-gray-600">Ekspertų įvertinimas</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Humaniški metodai</div>
                </div>
              </div>
            </div>

            {/* Image Grid Side */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                
                {/* Main Featured Image - Best Quality */}
                <div className="col-span-2 relative group">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                    <div className="aspect-[4/3] w-full">
                      <Image
                        src={heroContent.mainImage} 
                        alt="Professional Live Animal Trap - Premium Quality"
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105 select-none"
                        priority
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"></div>
                    
                    {/* Enhanced Content Overlay with Better Contrast */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <div className="bg-gradient-to-t from-black/90 via-black/70 to-black/40 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-white/20 shadow-2xl">
                        <h3 className="text-white font-bold text-lg sm:text-xl mb-2 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {heroContent.title}
                        </h3>
                        <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {heroContent.description}
                        </p>
                        
                        {/* Premium Badge */}
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 bg-green-600/90 px-3 py-1.5 rounded-full border border-green-400/60 shadow-lg">
                            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse shadow-sm"></div>
                            <span className="text-white text-sm font-bold drop-shadow-sm">Premium kokybė</span>
                          </div>
                          
                          <Button variant="secondary" size="sm" className="bg-white/95 hover:bg-white text-gray-900 hover:text-black">
                            Peržiūrėti
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Supporting Images */}
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <div className="aspect-[4/3] w-full relative">
                    <Image 
                      src="/imagen1.jpg" 
                      alt="Professional Trap Setup & Installation"
                      fill
                      className="object-cover object-center hover:scale-105 transition-transform duration-500 select-none"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-300"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="bg-gradient-to-t from-black/90 to-black/60 backdrop-blur-lg rounded-lg p-2.5 border border-white/20">
                      <span className="text-white text-sm font-bold block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Montavimo gidas</span>
                      <span className="text-white/90 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Profesionalus įdiegimas</span>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <div className="aspect-[4/3] w-full relative">
                    <Image 
                      src="/imagen3.jpg" 
                      alt="Expert Wildlife Control Techniques"
                      fill
                      className="object-cover object-center hover:scale-105 transition-transform duration-500 select-none"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-300"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="bg-gradient-to-t from-black/90 to-black/60 backdrop-blur-lg rounded-lg p-2.5 border border-white/20">
                      <span className="text-white text-sm font-bold block drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Eksperto patarimai</span>
                      <span className="text-white/90 text-xs drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Profesionalūs metodai</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-green-100 animate-bounce">
                <span className="text-2xl">🦝</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-100 animate-pulse">
                <span className="text-xl">🐿️</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products - Dynamic from Medusa Backend */}
      <BestsellingProducts />

      {/* Quick Trust Signals - Mini Testimonials */}
      <section className="py-6 sm:py-8 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              {
                text: "Saugiai pagavome šeimyną meškėnų per 2 naktis. Geriausia investicija mano gyvūnų kontrolės verslui!",
                name: "Mykolas T.",
                title: "Licencijuotas gyvūnų kontrolės specialistas",
                rating: 5,
                verified: true
              },
              {
                text: "M24 modelis išsprendė mūsų laukinių kačių problemą. Pagavome 8 kates per 2 savaites TNR programai.",
                name: "Lina R.",
                title: "Gyvūnų kontrolės pareigūnė", 
                rating: 5,
                verified: true
              },
              {
                text: "Perkėlėme 30+ voverių be sužeidimų. Kompaktiškas dizainas idealiai tinka siauriems erdvėms.",
                name: "Dainius P.",
                title: "Parko priežiūros vadovas",
                rating: 5,
                verified: true
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-green-100">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  {testimonial.verified && (
                    <div className="ml-auto flex items-center gap-1 text-xs text-green-600">
                      <Shield className="w-3 h-3" />
                      <span>Patvirtinta</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-3 italic">&quot;{testimonial.text}&quot;</p>
                <div className="text-xs">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Solutions Navigation */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <div className="text-center w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 mobile-text-wrap text-green-700">
                Parduotuvė pagal gyvūno tipą
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-1 sm:px-2 mobile-text-wrap">
                Raskite tobulą spąstą, specialiai sukurtą jūsų tiksliniam gyvūnui. Ekspertų išbandyti sprendimai.
              </p>
            </div>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {[
                {
                  icon: Squirrel,
                  title: "Maži gyvūnai",
                  description: "Gyvūnų spąstai voverėms, burundukami, žiurkėms ir kitiems smulkiems gyvūnams",
                  href: "/size",
                  color: "#0F4C3A"
                },
                {
                  icon: Cat,
                  title: "Vidutiniai gyvūnai",
                  description: "Humaniški spąstai katėms, triušiams, skunksams ir vidutinio dydžio gyvūnams",
                  href: "/size",
                  color: "#D97706"
                },
                {
                  icon: Search,
                  title: "Dideli gyvūnai",
                  description: "Stiprūs spąstai meškėnams, opossumams ir dideliems gyvūnams",
                  href: "/size",
                  color: "#8B5CF6"
                },
                {
                  icon: Heart,
                  title: "Humaniški sprendimai",
                  description: "Visi mūsų spąstai užtikrina saugų pagavimą ir lengvą gyvūno paleidimą",
                  href: "/traps",
                  color: "#10B981"
                }
              ].map((item, index) => (
                <Link key={index} href={item.href} className="group block">
                  <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 h-full min-h-[200px] sm:min-h-[220px]">
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="relative mb-3 sm:mb-4">
                        <div 
                          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`,
                            boxShadow: `0 4px 16px ${item.color}20`
                          }}
                        >
                          <item.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 text-center px-1 text-gray-800">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed text-center px-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* More Professional Traps - Dynamic from Medusa Backend */}
      <MoreProfessionalTraps />

      {/* Animal Size Guide Quick Reference */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 mobile-text-wrap text-green-700">
              Greitasis dydžio gidas
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mobile-text-wrap">
              Pasirinkite tinkamą spąsto dydį jūsų tiksliniui gyvūnui
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
            {[
              {
                size: "Mažas (46 cm)",
                animals: "Voverės, Žiurkės, Burundukai",
                dimensions: "46×13×15 cm",
                model: "Modelis S18",
                color: "#10B981",
                examples: "🐿️ Voverės • 🐭 Žiurkės • 🐿️ Burundukai"
              },
              {
                size: "Vidutinis (61 cm)",
                animals: "Katės, Triušiai, Skunksai",
                dimensions: "61×18×20 cm", 
                model: "Modelis M24",
                color: "#F59E0B",
                examples: "🐱 Katės • 🐰 Triušiai • 🦨 Skunksai"
              },
              {
                size: "Didelis (81+ cm)",
                animals: "Meškėnai, Oposssumai",
                dimensions: "81×25×30 cm",
                model: "Modelis XL32",
                color: "#D97706",
                examples: "🦝 Meškėnai • 🐾 Opossumai • 🐱 Didelės katės"
              }
            ].map((guide, index) => (
              <div key={index} className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                <div className="text-center">
                  <div 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                    style={{ backgroundColor: `${guide.color}15`, border: `2px solid ${guide.color}` }}
                  >
                    <span className="text-lg sm:text-xl font-bold" style={{ color: guide.color }}>
                      {index + 1}
                    </span>
                  </div>
                  
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2 text-gray-800">
                    {guide.size}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    {guide.dimensions}
                  </p>
                  
                  <div className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: guide.color }}>
                    {guide.examples}
                  </div>
                  
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium" style={{ 
                    backgroundColor: `${guide.color}15`,
                    color: guide.color 
                  }}>
                    {guide.model}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Learning Center */}
      <Section size="3" className="bg-white">
        <Container size="4">
          <Flex direction="column" align="center" gap="6" className="px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-4xl">
              <Flex align="center" justify="center" gap="3" className="mb-4" direction={{ initial: "column", sm: "row" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Heading size={{ initial: "6", sm: "7" }} className="text-center text-green-700">
                  Išmokite gyvūnų gaudymą
                </Heading>
              </Flex>
              <Text size={{ initial: "3", sm: "4" }} color="gray" className="max-w-2xl mx-auto">
                Profesionalaus mokymo ištekliai ir ekspertų metodai efektyviam, humaniškam gyvūnų pagavimui ir perkėlimui
              </Text>
            </div>
            
            {/* Learning Resources Grid */}
            <Grid columns={{ initial: "1", md: "3" }} gap={{ initial: "4", md: "6" }} width="100%" className="max-w-6xl items-stretch">
              {[
                {
                  title: "Spąstų įrengimo ir išdėstymo gidai",
                  description: "Profesionalūs metodai gyvūnų spąstų pozicionavimui, tinkamo masalo pasirinkimui ir pagavimo sėkmės rodiklių maksimizavimui skirtingoms rūšims.",
                  image: "/imagen1.jpg",
                  icon: BookOpen,
                  href: "/trap-guides",
                  stats: "45+ Spąstų gidai",
                  color: "#0F4C3A"
                },
                {
                  title: "Spąstų demonstracijos video",
                  description: "Pakopų mokymo video pamokos, rodantys tinkamą spąstų surinkimo, masalo metodus ir saugias gyvūno paleidimo procedūras kiekvienam modeliui.",
                  image: "/imagen2.jpg",
                  icon: Play,
                  href: "/video-tutorials",
                  stats: "35+ Video pamokos",
                  color: "#D97706"
                },
                {
                  title: "Tikslinių gyvūnų enciklopedija",
                  description: "Pilni elgsenos profiliai meškėnams, voverėms, katėms, triušiams ir kitiems - įskaitant mitybos įpročius, guolio pageidavimus ir optimalius gaudymo sezonus.",
                  image: "/imagen3.jpg",
                  icon: Users,
                  href: "/animal-profiles",
                  stats: "25+ Gyvūnų profiliai",
                  color: "#10B981"
                }
              ].map((resource, index) => (
                <Link key={index} href={resource.href} className="group">
                  <Card className="border-0 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Image with Overlay */}
                    <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0">
                      <Image 
                        src={resource.image} 
                        alt={resource.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Floating Icon */}
                      <div className="absolute top-4 right-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${resource.color} 0%, ${resource.color}cc 100%)`,
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <resource.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Stats Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="px-3 py-1 rounded-full text-white text-sm font-medium bg-white/20 backdrop-blur-lg">
                          {resource.stats}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <Flex direction="column" gap="3" className="h-full">
                        <Flex align="center" justify="between">
                          <Heading size={{ initial: "4", sm: "5" }} className="text-gray-800">
                            {resource.title}
                          </Heading>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </Flex>
                        
                        <Text size={{ initial: "2", sm: "3" }} color="gray" className="flex-1">
                          {resource.description}
                        </Text>
                        
                        <div className="mt-auto pt-4">
                          <Button variant="outline" size="sm" className="w-full">
                            Sužinoti daugiau
                          </Button>
                        </div>
                      </Flex>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Section>
    </div>
  );
}

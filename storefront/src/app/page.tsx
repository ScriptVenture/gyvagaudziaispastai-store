import Link from "next/link";
import { Search, Building, MapPin, Star, Heart, Quote, ChevronLeft, ChevronRight, Shield, Award, BookOpen, Play, Users, ArrowRight } from "lucide-react";
import { Button, Card, Flex, Text, Heading, Badge, Grid, Section, Container, Avatar } from "@radix-ui/themes";
import { brandColors } from "@/utils/colors";

export default function Home() {
  return (
    <div>
      {/* Hero Section - Matching Havahart's garden background style */}
      <section className="relative h-[500px] bg-cover bg-center" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=500&q=80&fit=crop')`
      }}>
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Caring Control Since 1940
            </h1>
            <p className="text-xl text-white mb-8 leading-relaxed">
              Professional wildlife control solutions for effective and humane animal management. 
              Trusted by homeowners and professionals worldwide.
            </p>
            <Button asChild size="4" style={{ backgroundColor: brandColors.secondary }}>
              <Link href="/products">
                Shop Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Professional Solutions Navigation */}
      <Section size="3" className="bg-white">
        <Container size="4">
          <Flex direction="column" align="center" gap="8">
            <div className="text-center">
              <Heading size="7" className="mb-3" style={{ color: brandColors.primary }}>
                Find Your Perfect Solution
              </Heading>
              <Text size="4" color="gray" className="max-w-2xl">
                Our expert-curated tools help you choose the right wildlife control method for your specific situation
              </Text>
            </div>
            
            <Grid columns={{ initial: "2", md: "4" }} gap="6" width="100%">
              {[
                {
                  icon: Search,
                  title: "Solution Finder",
                  description: "Smart recommendations based on your specific wildlife control needs",
                  href: "/solution-finder",
                  color: brandColors.primary
                },
                {
                  icon: Building,
                  title: "Professional Tools",
                  description: "Commercial-grade equipment and systems for professionals",
                  href: "/professional",
                  color: brandColors.secondary
                },
                {
                  icon: MapPin,
                  title: "Local Experts",
                  description: "Find certified wildlife control professionals in your area",
                  href: "/experts",
                  color: brandColors.accent
                },
                {
                  icon: Heart,
                  title: "Humane Methods",
                  description: "Effective and wildlife-friendly control solutions available",
                  href: "/humane",
                  color: brandColors.success
                }
              ].map((item, index) => (
                <Link key={index} href={item.href} className="group">
                  <Card className="p-6 border-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <Flex direction="column" align="center" justify="center" className="h-full text-center">
                      <div className="relative mb-4">
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`,
                            boxShadow: `0 8px 32px ${item.color}20`
                          }}
                        >
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      <Heading size="4" className="mb-2 group-hover:text-opacity-80 transition-colors text-center" style={{ color: brandColors.textPrimary }}>
                        {item.title}
                      </Heading>
                      
                      <Text size="2" color="gray" className="leading-relaxed text-center">
                        {item.description}
                      </Text>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* Modern Customer Testimonials */}
      <Section size="3" style={{ backgroundColor: brandColors.backgroundSecondary }}>
        <Container size="4">
          <Flex direction="column" align="center" gap="8">
            {/* Section Header */}
            <div className="text-center">
              <Flex align="center" justify="center" gap="3" className="mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                  background: `linear-gradient(135deg, ${brandColors.success} 0%, ${brandColors.primary} 100%)`,
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
                }}>
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <Heading size="7" style={{ color: brandColors.primary }}>
                  Trusted by Wildlife Professionals
                </Heading>
              </Flex>
              <Text size="4" color="gray" className="max-w-2xl">
                Thousands of satisfied customers trust our solutions for effective wildlife control
              </Text>
            </div>
            
            {/* Testimonials Grid */}
            <Grid columns={{ initial: "1", md: "3" }} gap="6" width="100%" className="max-w-6xl">
              {[
                {
                  name: "Sarah Mitchell",
                  title: "Homeowner",
                  location: "Portland, OR",
                  rating: 5,
                  text: "The humane trap worked perfectly for our raccoon problem. Easy to set up and the animal was safely relocated without harm.",
                  avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3ee?w=150&h=150&q=80&fit=crop&crop=face",
                  verified: true
                },
                {
                  name: "Marcus Rodriguez",
                  title: "Property Manager",
                  location: "Austin, TX",
                  rating: 5,
                  text: "Professional-grade equipment that actually works. Our squirrel issues were resolved within days of installation.",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&q=80&fit=crop&crop=face",
                  verified: true
                },
                {
                  name: "Jennifer Chen",
                  title: "Wildlife Control Pro",
                  location: "Denver, CO", 
                  rating: 5,
                  text: "As a professional, I recommend WildControl to all my clients. Quality products with excellent customer support.",
                  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&q=80&fit=crop&crop=face",
                  verified: true
                }
              ].map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="p-6 border-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  style={{ 
                    background: brandColors.white,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <Flex direction="column" gap="4">
                    {/* Rating */}
                    <Flex align="center" justify="between">
                      <Flex align="center" gap="1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </Flex>
                      {testimonial.verified && (
                        <Flex align="center" gap="1" className="px-2 py-1 rounded-full" style={{ 
                          backgroundColor: brandColors.primaryLight 
                        }}>
                          <Shield className="w-3 h-3" style={{ color: brandColors.primary }} />
                          <Text size="1" style={{ color: brandColors.primary }} className="font-medium">
                            Verified
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                    
                    {/* Testimonial Text */}
                    <Text size="3" className="leading-relaxed" style={{ color: brandColors.textSecondary }}>
                      "{testimonial.text}"
                    </Text>
                    
                    {/* Customer Info */}
                    <Flex align="center" gap="3" className="pt-3 border-t" style={{ borderColor: brandColors.gray200 }}>
                      <Avatar 
                        size="3"
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fallback={testimonial.name.split(' ').map(n => n[0]).join('')}
                        className="ring-2 ring-white shadow-md"
                      />
                      <div className="flex-1">
                        <Text size="3" weight="medium" style={{ color: brandColors.textPrimary }}>
                          {testimonial.name}
                        </Text>
                        <Text size="2" color="gray">
                          {testimonial.title} • {testimonial.location}
                        </Text>
                      </div>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Grid>
            
            {/* Trust Badges */}
            <Flex align="center" justify="center" gap="8" className="pt-8">
              <Flex align="center" gap="2" className="opacity-70">
                <Award className="w-5 h-5" style={{ color: brandColors.warning }} />
                <Text size="2" weight="medium" style={{ color: brandColors.textSecondary }}>
                  4.9/5 Customer Rating
                </Text>
              </Flex>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: brandColors.gray300 }} />
              <Flex align="center" gap="2" className="opacity-70">
                <Shield className="w-5 h-5" style={{ color: brandColors.primary }} />
                <Text size="2" weight="medium" style={{ color: brandColors.textSecondary }}>
                  10,000+ Happy Customers
                </Text>
              </Flex>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: brandColors.gray300 }} />
              <Flex align="center" gap="2" className="opacity-70">
                <Heart className="w-5 h-5" style={{ color: brandColors.secondary }} />
                <Text size="2" weight="medium" style={{ color: brandColors.textSecondary }}>
                  Humane & Effective
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Products Section - Matching Havahart "We've Got Just the Thing" */}
      <Section size="3">
        <Container size="4">
          <Flex direction="column" align="center" gap="6">
            <Heading size="8" align="center" style={{ color: brandColors.primary }}>
              We've Got Just the Thing
            </Heading>
            
            <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4" width="100%">
            {[
              {
                name: "Gyvagaudziaispastai® Easy Set® Large 1-Door Animal Trap",
                price: "$42.99",
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=250&h=200&q=80&fit=crop"
              },
              {
                name: "Gyvagaudziaispastai® Easy Set® Small 1-Door Animal Trap", 
                price: "$45.69",
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=250&h=200&q=80&fit=crop"
              },
              {
                name: "Critter Ridder® Motion-Activated Animal Repellent & Sprinkler",
                price: "$59.89",
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=250&h=200&q=80&fit=crop"
              },
              {
                name: "Gyvagaudziaispastai® Medium 1-Door Animal Trap",
                price: "$38.49",
                originalPrice: "$42.99",
                image: "https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=250&h=200&q=80&fit=crop"
              }
            ].map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="rounded-t-lg h-40 w-full object-cover"
                />
                
                <Flex direction="column" gap="3" p="4">
                  <Text size="2" weight="medium" className="leading-tight">
                    {product.name}
                  </Text>
                  
                  <Flex align="center" gap="2">
                    <Text size="4" weight="bold" style={{ color: brandColors.primary }}>
                      {product.price}
                    </Text>
                    {product.originalPrice && (
                      <Text size="2" color="gray" className="line-through">
                        {product.originalPrice}
                      </Text>
                    )}
                  </Flex>
                  
                  <Button size="3" style={{ backgroundColor: brandColors.secondary }}>
                    SHOP NOW
                  </Button>
                </Flex>
              </Card>
            ))}
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* Expert Learning Center */}
      <Section size="3" className="bg-white">
        <Container size="4">
          <Flex direction="column" align="center" gap="8">
            {/* Section Header */}
            <div className="text-center">
              <Flex align="center" justify="center" gap="3" className="mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ 
                  background: `linear-gradient(135deg, ${brandColors.info} 0%, ${brandColors.accent} 100%)`,
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
                }}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Heading size="7" style={{ color: brandColors.primary }}>
                  Learn From Wildlife Experts
                </Heading>
              </Flex>
              <Text size="4" color="gray" className="max-w-2xl">
                Access professional knowledge and proven techniques from certified wildlife control specialists
              </Text>
            </div>
            
            {/* Learning Resources Grid */}
            <Grid columns={{ initial: "1", md: "3" }} gap="6" width="100%" className="max-w-6xl">
              {[
                {
                  title: "Expert Articles & Guides",
                  description: "In-depth articles written by certified wildlife professionals covering identification, prevention, and humane control methods.",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&q=80&fit=crop",
                  icon: BookOpen,
                  href: "/articles",
                  stats: "150+ Articles",
                  color: brandColors.primary
                },
                {
                  title: "Video Tutorials",
                  description: "Step-by-step video demonstrations showing proper installation, setup, and usage of wildlife control equipment.",
                  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&q=80&fit=crop",
                  icon: Play,
                  href: "/videos",
                  stats: "75+ Videos",
                  color: brandColors.secondary
                },
                {
                  title: "Animal Behavior Library",
                  description: "Comprehensive database of wildlife behavior patterns, habits, and seasonal activities to help you choose the right solution.",
                  image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=250&q=80&fit=crop",
                  icon: Users,
                  href: "/animals",
                  stats: "50+ Species",
                  color: brandColors.success
                }
              ].map((resource, index) => (
                <Link key={index} href={resource.href} className="group">
                  <Card className="border-0 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Image with Overlay */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                        <div className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ 
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)'
                        }}>
                          {resource.stats}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <Flex direction="column" gap="3">
                        <Flex align="center" justify="between">
                          <Heading size="5" className="group-hover:text-opacity-80 transition-colors" style={{ color: brandColors.textPrimary }}>
                            {resource.title}
                          </Heading>
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" style={{ color: resource.color }} />
                        </Flex>
                        
                        <Text size="2" className="leading-relaxed" style={{ color: brandColors.textSecondary }}>
                          {resource.description}
                        </Text>
                        
                        {/* CTA */}
                        <div className="pt-2">
                          <Text size="2" weight="medium" className="flex items-center gap-2 group-hover:gap-3 transition-all" style={{ color: resource.color }}>
                            Explore Resources
                            <ArrowRight className="w-4 h-4" />
                          </Text>
                        </div>
                      </Flex>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
            
            {/* Bottom CTA Section */}
            <div className="w-full max-w-4xl mx-auto mt-8">
              <Card className="p-8 border-0 text-center" style={{ 
                background: `linear-gradient(135deg, ${brandColors.primaryLight} 0%, ${brandColors.backgroundSecondary} 100%)`,
                border: `1px solid ${brandColors.gray200}`
              }}>
                <Flex direction="column" align="center" gap="4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ 
                    background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryHover} 100%)`,
                    boxShadow: '0 8px 32px rgba(15, 76, 58, 0.3)'
                  }}>
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <Heading size="6" className="mb-2" style={{ color: brandColors.primary }}>
                      Need Personal Expert Advice?
                    </Heading>
                    <Text size="3" color="gray" className="mb-6 max-w-2xl">
                      Connect with our certified wildlife control specialists for personalized recommendations and professional guidance tailored to your specific situation.
                    </Text>
                  </div>
                  
                  <Flex align="center" gap="3">
                    <Button 
                      size="4"
                      className="font-medium"
                      style={{ 
                        background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.primaryHover} 100%)`,
                        color: brandColors.white,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(15, 76, 58, 0.2)'
                      }}
                    >
                      <Users className="w-4 h-4" />
                      Talk to Expert
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="4"
                      className="font-medium"
                      style={{ 
                        borderColor: brandColors.primary,
                        color: brandColors.primary,
                        borderRadius: '8px'
                      }}
                    >
                      Browse All Resources
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            </div>
          </Flex>
        </Container>
      </Section>
    </div>
  );
}
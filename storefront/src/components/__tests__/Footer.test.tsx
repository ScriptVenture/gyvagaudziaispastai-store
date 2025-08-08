import { render, screen } from '@testing-library/react'
import Footer from '../layout/Footer'

// Mock the TrapLogo component
jest.mock('../ui/TrapLogo', () => {
  return function MockTrapLogo() {
    return <div data-testid="trap-logo">Logo</div>
  }
})

describe('Footer Component', () => {
  it('renders footer with company information', () => {
    render(<Footer />)
    
    expect(screen.getByText('Gyvagaudziaispastai')).toBeInTheDocument()
    expect(screen.getByText('Humaniški gyvūnų spąstai')).toBeInTheDocument()
  })

  it('renders trust indicators', () => {
    render(<Footer />)
    
    expect(screen.getByText('30 dienų garantija')).toBeInTheDocument()
    expect(screen.getByText('Nemokamas pristatymas')).toBeInTheDocument()
    expect(screen.getByText('Ekspertų pagalba')).toBeInTheDocument()
    expect(screen.getByText('Humaniški sprendimai')).toBeInTheDocument()
  })

  it('renders compliance page links', () => {
    render(<Footer />)
    
    expect(screen.getByRole('link', { name: 'Privatumo politika' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Sąlygos' })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: 'Grąžinimai' })).toHaveAttribute('href', '/returns')
    expect(screen.getByRole('link', { name: 'BDAR' })).toHaveAttribute('href', '/gdpr')
    expect(screen.getByRole('link', { name: 'Slapukai' })).toHaveAttribute('href', '/cookies')
    expect(screen.getByRole('link', { name: 'Apie mus' })).toHaveAttribute('href', '/about')
  })

  it('renders contact information', () => {
    render(<Footer />)
    
    expect(screen.getByText('+370 5 123 4567')).toBeInTheDocument()
    expect(screen.getByText('info@gyvagaudziaispastai.lt')).toBeInTheDocument()
  })

  it('renders newsletter signup form', () => {
    render(<Footer />)
    
    expect(screen.getByPlaceholderText('Įveskite savo el. pašto adresą')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Prenumeruoti nemokamus patarimus' })).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    
    // Check that social media links exist (they all use # as href in the component)
    const socialLinks = screen.getAllByRole('link').filter(link => 
      link.getAttribute('href') === '#'
    )
    expect(socialLinks.length).toBeGreaterThan(0)
  })

  it('renders product category links', () => {
    render(<Footer />)
    
    expect(screen.getByRole('link', { name: 'Mažų gyvūnų spąstai' })).toHaveAttribute('href', '/traps')
    expect(screen.getByRole('link', { name: 'Profesionalūs spąstai' })).toHaveAttribute('href', '/traps')
  })

  it('renders support links', () => {
    render(<Footer />)
    
    expect(screen.getByRole('link', { name: 'Spąstų įrengimo gidas' })).toHaveAttribute('href', '/support')
    expect(screen.getByRole('link', { name: 'Garantija ir grąžinimai' })).toHaveAttribute('href', '/support')
  })

  it('renders copyright information', () => {
    render(<Footer />)
    
    expect(screen.getByText(/© 2024 Gyvagaudziaispastai/)).toBeInTheDocument()
  })
})
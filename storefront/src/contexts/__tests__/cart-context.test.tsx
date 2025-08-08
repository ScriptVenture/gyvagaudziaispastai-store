import { render, screen, act, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '../cart-context'

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

// Test component to access cart context
function TestComponent() {
  const { cart, addItem, removeItem, updateQuantity, cartTotal, isLoading, error } = useCart()
  
  return (
    <div>
      <div data-testid="cart-total">{cartTotal}</div>
      <div data-testid="cart-items-count">{cart?.items?.length || 0}</div>
      <div data-testid="is-loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      
      <button 
        data-testid="add-item" 
        onClick={() => addItem('product_1', 'variant_1', 2)}
      >
        Add Item
      </button>
      
      <button 
        data-testid="remove-item" 
        onClick={() => removeItem('line_item_1')}
      >
        Remove Item
      </button>
      
      <button 
        data-testid="update-quantity" 
        onClick={() => updateQuantity('line_item_1', 3)}
      >
        Update Quantity
      </button>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockReset()
  })

  it('provides cart context with initial loading state', () => {
    // Mock initial cart fetch to be pending
    mockFetch.mockImplementation(() => new Promise(() => {}))
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )
    
    expect(screen.getByTestId('is-loading')).toHaveTextContent('loading')
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
  })

  it('loads cart data successfully', async () => {
    const mockCartData = {
      id: 'cart_1',
      items: [
        {
          id: 'line_item_1',
          product_id: 'product_1',
          variant_id: 'variant_1',
          quantity: 2,
          unit_price: 1000
        }
      ],
      subtotal: 2000,
      tax_total: 400,
      total: 2400
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cart: mockCartData })
    } as Response)

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('not-loading')
    })
    
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('2400')
    expect(screen.getByTestId('error')).toHaveTextContent('no-error')
  })

  it('handles cart loading error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load cart')
    })
    
    expect(screen.getByTestId('is-loading')).toHaveTextContent('not-loading')
  })

  it('adds item to cart successfully', async () => {
    // Mock initial empty cart
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cart: { id: 'cart_1', items: [], total: 0 } })
    } as Response)

    // Mock add item response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        cart: {
          id: 'cart_1',
          items: [{
            id: 'line_item_1',
            product_id: 'product_1',
            variant_id: 'variant_1',
            quantity: 2,
            unit_price: 1000
          }],
          total: 2000
        }
      })
    } as Response)

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('not-loading')
    })

    act(() => {
      screen.getByTestId('add-item').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: 'product_1',
        variant_id: 'variant_1',
        quantity: 2
      })
    })
  })

  it('handles add item error', async () => {
    // Mock initial cart load
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cart: { id: 'cart_1', items: [], total: 0 } })
    } as Response)

    // Mock add item error
    mockFetch.mockRejectedValueOnce(new Error('Add item failed'))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('is-loading')).toHaveTextContent('not-loading')
    })

    act(() => {
      screen.getByTestId('add-item').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to add item to cart')
    })
  })

  it('removes item from cart successfully', async () => {
    const initialCart = {
      id: 'cart_1',
      items: [{
        id: 'line_item_1',
        product_id: 'product_1',
        variant_id: 'variant_1',
        quantity: 2,
        unit_price: 1000
      }],
      total: 2000
    }

    // Mock initial cart with item
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cart: initialCart })
    } as Response)

    // Mock remove item response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        cart: { id: 'cart_1', items: [], total: 0 }
      })
    } as Response)

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
    })

    act(() => {
      screen.getByTestId('remove-item').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/cart/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line_item_id: 'line_item_1' })
    })
  })

  it('updates item quantity successfully', async () => {
    const initialCart = {
      id: 'cart_1',
      items: [{
        id: 'line_item_1',
        product_id: 'product_1',
        variant_id: 'variant_1',
        quantity: 2,
        unit_price: 1000
      }],
      total: 2000
    }

    // Mock initial cart
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ cart: initialCart })
    } as Response)

    // Mock update quantity response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        cart: {
          ...initialCart,
          items: [{
            ...initialCart.items[0],
            quantity: 3
          }],
          total: 3000
        }
      })
    } as Response)

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('cart-total')).toHaveTextContent('2000')
    })

    act(() => {
      screen.getByTestId('update-quantity').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('cart-total')).toHaveTextContent('3000')
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/cart/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        line_item_id: 'line_item_1',
        quantity: 3
      })
    })
  })
})
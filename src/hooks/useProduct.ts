/**
 * hooks/useProducts.ts
 * Hook para cargar productos con estado de carga y error integrados
 */
import { useCallback, useEffect, useState } from 'react'
import type { Product, AsyncState } from '@/types'
import { productService } from '@/services/productService'
import { extractErrorMessage } from '@/lib/utils'

// ─── useProducts: lista completa ──────────────────────────────────────────────
export function useProducts() {
  const [state, setState] = useState<AsyncState<Product[]>>({
    data: null,
    status: 'idle',
    error: null,
  })

  const fetchProducts = useCallback(async () => {
    setState({ data: null, status: 'loading', error: null })
    try {
      const data = await productService.getAll()
      setState({ data, status: 'success', error: null })
    } catch (error) {
      setState({ data: null, status: 'error', error: extractErrorMessage(error) })
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { ...state, refetch: fetchProducts }
}

// ─── useFeaturedProducts: destacados para Home ────────────────────────────────
export function useFeaturedProducts() {
  const [state, setState] = useState<AsyncState<Product[]>>({
    data: null,
    status: 'idle',
    error: null,
  })

  useEffect(() => {
    setState({ data: null, status: 'loading', error: null })
    productService
      .getFeatured()
      .then((data) => setState({ data, status: 'success', error: null }))
      .catch((err) =>
        setState({ data: null, status: 'error', error: extractErrorMessage(err) })
      )
  }, [])

  return state
}

// ─── useProduct: detalle de un producto ──────────────────────────────────────
export function useProduct(id: string) {
  const [state, setState] = useState<AsyncState<Product>>({
    data: null,
    status: 'idle',
    error: null,
  })

  useEffect(() => {
    if (!id) return
    setState({ data: null, status: 'loading', error: null })
    productService
      .getById(id)
      .then((data) => setState({ data, status: 'success', error: null }))
      .catch((err) =>
        setState({ data: null, status: 'error', error: extractErrorMessage(err) })
      )
  }, [id])

  return state
}

// ─── useProductSearch: búsqueda con debounce ──────────────────────────────────
export function useProductSearch(query: string, debounceMs = 400) {
  const [state, setState] = useState<AsyncState<Product[]>>({
    data: null,
    status: 'idle',
    error: null,
  })

  useEffect(() => {
    if (!query.trim()) {
      setState({ data: null, status: 'idle', error: null })
      return
    }

    setState((prev) => ({ ...prev, status: 'loading' }))
    const timer = setTimeout(async () => {
      try {
        const data = await productService.search(query)
        setState({ data, status: 'success', error: null })
      } catch (error) {
        setState({ data: null, status: 'error', error: extractErrorMessage(error) })
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  return state
}
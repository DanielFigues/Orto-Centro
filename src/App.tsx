import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { AdminPage } from './pages/AdminPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CategoryPage } from './pages/CategoryPage'
import { CatalogProvider } from './context/CatalogContext'

function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const target = hash.slice(1)
    let cancelled = false
    let attempts = 0

    const scrollToTarget = () => {
      if (cancelled) return

      const element = document.getElementById(target)
      if (element) {
        element.scrollIntoView({ block: 'start' })
        return
      }

      attempts += 1
      if (attempts < 40) {
        window.setTimeout(scrollToTarget, 50)
      } else {
        window.scrollTo(0, 0)
      }
    }

    scrollToTarget()

    return () => {
      cancelled = true
    }
  }, [key, pathname, hash])

  return null
}

function HomeLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <HomePage />
    </div>
  )
}

function ProductLayout() {
  const { id } = useParams()
  const productId = parseInt(id ?? '', 10)

  if (isNaN(productId)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <ProductDetailPage productId={productId} />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <CatalogProvider>
      <ScrollManager />
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/produto/:id" element={<ProductLayout />} />
        <Route path="/categoria/:categoryName" element={<CategoryPage />} />
        <Route path="*" element={<HomeLayout />} />
      </Routes>
    </CatalogProvider>
  )
}

export default App

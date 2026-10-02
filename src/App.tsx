import { Header } from './components/layout/Header'
import { Hero } from './components/layout/Hero'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'
import { ProductDetailPage } from './pages/ProductDetailPage'

function getPath(): string {
  if (typeof window === 'undefined') return '/'
  return window.location.pathname
}

function App() {
  const path = getPath().replace(/\/+$/, '') || '/'

  if (path === '/admin') {
    return <AdminPage />
  }

  if (path.startsWith('/produto/')) {
    const idStr = path.split('/').pop()
    const productId = parseInt(idStr || '', 10)
    if (!isNaN(productId)) {
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
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <Hero />
      <main className="flex-1 px-4 py-8 sm:px-6">
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

export default App

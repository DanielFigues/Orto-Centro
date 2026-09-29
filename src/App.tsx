import { Header } from './components/layout/Header'
import { Hero } from './components/layout/Hero'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { AdminPage } from './pages/AdminPage'

const isAdminRoute =
  typeof window !== 'undefined' &&
  window.location.pathname.replace(/\/+$/, '') === '/admin'

function App() {
  if (isAdminRoute) {
    return <AdminPage />
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

import { Header } from './components/layout/Header'
import { Hero } from './components/layout/Hero'
import { Sidebar } from './components/layout/Sidebar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <Hero />
      <div className="flex flex-1 gap-8 px-4 py-8 sm:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <HomePage />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App

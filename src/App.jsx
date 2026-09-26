import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Republic from './pages/Republic.jsx'
import Maratha from './pages/Maratha.jsx'

// HashRouter keeps deep links working on GitHub Pages, which has no SPA fallback.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level/republic" element={<Republic />} />
        <Route path="/level/maratha" element={<Maratha />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}

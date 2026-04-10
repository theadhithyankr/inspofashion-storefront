import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { CollectionPage } from './pages/CollectionPage'
import { SearchPage } from './pages/SearchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collections/:collectionName" element={<CollectionPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  )
}

export default App

import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Thesis from './components/Thesis/Thesis';
import Focus from './components/Focus/Focus';
import Team from './components/Team/Team';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import LendingDashboard from './components/LendingDashboard/LendingDashboard';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="app">
      <Navbar currentView={view} onViewChange={setView} />
      {view === 'lending' ? (
        <LendingDashboard />
      ) : (
        <>
          <Hero />
          <About />
          <Thesis />
          <Focus />
          <Team />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;

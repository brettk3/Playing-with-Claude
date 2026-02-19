import './App.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Thesis from './components/Thesis/Thesis';
import Focus from './components/Focus/Focus';
import Team from './components/Team/Team';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <Thesis />
      <Focus />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;

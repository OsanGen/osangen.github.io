import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import AgentWork from './pages/AgentWork';
import Resume from './pages/Resume';

function App() {
    return (
        <Router>
            <div className="bg-background min-h-screen text-foreground font-sans selection:bg-brand-accent/30">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/agent-work" element={<AgentWork />} />
                        <Route path="/resume" element={<Resume />} />
                        {/* Fallback for contact to home or about for now */}
                        <Route path="/contact" element={<About />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

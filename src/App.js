import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Auth from './components/auth';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/authentication" element={<Auth />} />
            </Routes>
        </div>
    );
}

export default App;
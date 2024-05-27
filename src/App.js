import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Auth from './components/authentication';
import Journey from './components/journey';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function App() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAGLJbA1RetjGC3_w0QRCrA9YuZJ0SBzeE',
        libraries,
    });

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading Maps</div>;
    }
    return (
        <div className="full-height">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/authentication" element={<Auth />} />
                <Route path="/journey" element={<Journey />} />
            </Routes>
        </div>
    );
}

export default App;

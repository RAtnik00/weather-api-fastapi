import { useEffect } from 'react'
import { weatherApi } from './services/weatherApi'

function App() {
    useEffect(() => {
        weatherApi.current("Warsaw")
            .then(console.log)
            .catch(console.error)
    }, [])

    return (
        <div>
            Weather
        </div>
    )
}

export default App
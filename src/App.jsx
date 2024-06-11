import { Box, Container, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_APpI_KEY
}&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      console.log(`Fetching weather data for ${city}...`);
      const res = await fetch(API_WEATHER + city);
      console.log(`Response status: ${res.status}`);
      
      if (!res.ok) {
        throw { message: `Error: ${res.statusText}` };
      }

      const data = await res.json();

      if (data.error) {
        throw { message: data.error.message };
      }

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon,
      });

      await fetch('http://localhost:3001/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: data.location.name,
          country: data.location.country,
          temperature: data.current.temp_c,
          condition: data.current.condition.code,
          conditionText: data.current.condition.text,
          icon: data.current.condition.icon,
        }),
      });
    } catch (error) {
      console.log(error);
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" color="white" gutterBottom>
       Tiempo
      </Typography>
      <Box sx={{ display: "grid", gap: 2 }} component="form" autoComplete="off" onSubmit={onSubmit} class="cotain" >
        <div class="formu">
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
          InputLabelProps={{
            sx: {
              color: 'blue',  
              fontSize: '1.2rem',  
              '&.Mui-focused': {
                color: 'white',  
              },
              '&.Mui-error': {
                color: 'red', 
              },
              
          }}
        }

        />
        </div>
        <button>
          <span>Buscar </span>
        </button>
    </Box>

      {weather.city && (
        <Box sx={{ mt: 2, display: "grid", gap: 2, textAlign: "center" }} class="cotain">
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>
          <Box component="img" alt={weather.conditionText} src={weather.icon} sx={{ margin: "0 auto" }} />
          <Typography variant="h5" component="h3">
            {weather.temperature} °C
          </Typography>
          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}
    </Container>
  );
}

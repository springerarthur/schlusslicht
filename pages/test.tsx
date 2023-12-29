// Importe
import { useState, useEffect } from 'react';

// Typen
interface Data {
  // Hier die Typen für deine Daten definieren
  // Beispiel: 
  id: number;
  name: string;
}

// Deine Funktionskomponente
const YourPage = () => {
  // State für die geladenen Daten
  const [data, setData] = useState<Data[]>([]);

  // State, um den Ladezustand zu verfolgen
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect für das Nachladen der Daten
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Daten laden, z.B. von einer API
        const response = await fetch('api/activities');
        const result = await response.json();

        // Daten setzen und Ladezustand aktualisieren
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        setLoading(false);
      }
    };

    // Funktion für das Nachladen aufrufen
    fetchData();
  }, []); // Leeres Abhängigkeitsarray bedeutet, dass der Effekt nur einmal nach dem Rendern aufgerufen wird

  return (
    <div>
      {loading ? (
        // Anzeige während des Ladens
        <p>Lade Daten...</p>
      ) : (
        // Anzeige nach dem Laden
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YourPage;

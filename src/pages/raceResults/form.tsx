import { useState } from "react";
import { useRouter } from "next/router";

export default function RaceResultForm() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("event", event);
    formData.append("sport", sport);
    formData.append("date", date);
    if (file) {
      formData.append("certificate", file);
    }

    try {
      const response = await fetch("/api/raceResults/save", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      router.push("/raceResults");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="event" className="form-label">
            Eventname:
          </label>
          <input
            id="event"
            type="text"
            className="form-control"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sport" className="form-label">
            Sportart:
          </label>
          <select
            id="sport"
            className="form-select"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
          >
            <option value="">Wähle eine Sportart...</option>
            <option value="Lauf">Lauf</option>
            <option value="Triathlon">Triathlon</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Datum:
          </label>
          <input
            id="date"
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="certificate" className="form-label">
            Urkunde:
          </label>
          <input
            id="certificate"
            type="file"
            className="form-control"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Speichern
        </button>
      </form>
    </div>
  );
}

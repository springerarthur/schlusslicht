async function logToServer(message: string) {
  try {
    const response = await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      console.error("Log to server failed", await response.text());
    }
  } catch (error) {
    console.error("Failed to log to server", error);
  }
}

export default logToServer;

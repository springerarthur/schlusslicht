// Verbindungs-URL und Datenbankname
const url = 'mongodb+srv://arthurspringer:y7NMGuTuCbdrHclR@<YOUR-CLUSTER-URL>/<DATABASE-NAME>?retryWrites=true&w=majority';
const dbName = '<DATABASE-NAME>';

// Daten, die gespeichert werden sollen
const dataToInsert = { key1: '1', key2: 'value2' };

// Verbindung zur MongoDB herstellen
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    if (err) {
        console.error('Fehler beim Verbinden mit der Datenbank:', err);
        return;
    }

    console.log('Verbunden mit der Datenbank');
    
    const db = client.db(dbName);
    const collection = db.collection('<DEINE-COLLECTION-NAME>');

    // Daten speichern
    collection.insertOne(dataToInsert, function(err, result) {
        if (err) {
            console.error('Fehler beim Speichern der Daten:', err);
        } else {
            console.log('Daten erfolgreich gespeichert:', result.insertedId);
        }

        // Verbindung schließen
        client.close();
        console.log('Verbindung geschlossen');
    });
});
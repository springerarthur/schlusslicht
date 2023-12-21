// // Verbindungs-URL und Datenbankname
// const url = 'mongodb+srv://arthurspringer:y7NMGuTuCbdrHclR@<YOUR-CLUSTER-URL>/<DATABASE-NAME>?retryWrites=true&w=majority';
// const dbName = '<DATABASE-NAME>';

// // Daten, die gespeichert werden sollen
// const dataToInsert = { key1: '1', key2: 'value2' };

// // Verbindung zur MongoDB herstellen
// MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
//     if (err) {
//         console.error('Fehler beim Verbinden mit der Datenbank:', err);
//         return;
//     }

//     console.log('Verbunden mit der Datenbank');

//     const db = client.db(dbName);
//     const collection = db.collection('<DEINE-COLLECTION-NAME>');

//     // Daten speichern
//     collection.insertOne(dataToInsert, function(err, result) {
//         if (err) {
//             console.error('Fehler beim Speichern der Daten:', err);
//         } else {
//             console.log('Daten erfolgreich gespeichert:', result.insertedId);
//         }

//         // Verbindung schließen
//         client.close();
//         console.log('Verbindung geschlossen');
//     });
// });

function setData() {
    setPoints();
    setProgress();
}

function setProgress() {
    var swimLeft = 4.0;
    var swimRight = 13.7;
    updateProgressBar('#progress-bar-swim', swimLeft, swimRight)

    var bikeLeft = 410.98;
    var bikeRight = 399.78;
    updateProgressBar('#progress-bar-bike', bikeLeft, bikeRight)
    
    var runLeft = 60;
    var runRight = 40;
    updateProgressBar('#progress-bar-run', runLeft, runRight)
}

function updateProgressBar(selector, leftValue, rightValue) {
    var sum = leftValue + rightValue;
    var percent = leftValue / sum * 100;
    document.querySelector(selector + ' .text1').innerText = leftValue + ' km';
    document.querySelector(selector + ' .text3').innerText = rightValue + ' km';    
    document.querySelector(selector).style.width = percent + '%';
}

function setPoints() {
    var pointsLeft = 2;
    var pointsRight = 1;

    document.querySelector('#points-left').innerText = pointsLeft;
    document.querySelector('#points-right').innerText = pointsRight;

    if(pointsLeft > pointsRight) 
    {
        document.querySelector('#pokal-left').classList.add('pokal-winner');
        document.querySelector('#pokal-right').classList.remove('pokal-winner');
    }

    if(pointsLeft < pointsRight) 
    {
        document.querySelector('#pokal-left').classList.remove('pokal-winner');
        document.querySelector('#pokal-right').classList.add('pokal-winner');
    }
}
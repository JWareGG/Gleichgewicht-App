if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(reg => console.log("✅ Service Worker registriert:", reg))
    .catch(error => console.log("❌ Fehler beim Service Worker:", error));
}
document.addEventListener("DOMContentLoaded", function() {
    requestNotificationPermission(); // Benutzer um Erlaubnis für Push-Benachrichtigungen bitten
    loadReminders(); // Erinnerungen beim Laden abrufen
    checkReminders(); // Sofort prüfen, ob eine Erinnerung fällig ist
    setInterval(checkReminders, 60000); // Jede Minute Erinnerungen prüfen
});

document.getElementById('addReminder').addEventListener('click', function() {
    let reminderInput = document.getElementById('reminder');
    let timeInput = document.getElementById('time');
    let soundCheckbox = document.getElementById('sound');

    let reminderText = reminderInput.value.trim();
    let reminderTime = timeInput.value;
    let soundEnabled = soundCheckbox.checked;

    if (reminderText !== "" && reminderTime !== "") {
        addReminder(reminderText, reminderTime, soundEnabled, true);
        reminderInput.value = "";
        timeInput.value = "";
        soundCheckbox.checked = false;
    }
});

function addReminder(text, time, sound) {
    const reminder = { text, time, sound }; // Speichert Erinnerung mit Zeit und Soundoption
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders.push(reminder);
    localStorage.setItem("reminders", JSON.stringify(reminders));

    updateReminderList();
}
    // Uhrzeit mit "Uhr" hinzufügen
    const formattedTime = time ? time + " Uhr" : "";

    // Spaltenstruktur
    const reminderText = document.createElement('span');
    reminderText.className = "reminder-text";
    reminderText.textContent = text + " - " + formattedTime;

    // Glocken-Icon, falls aktiviert
    let soundIcon = document.createElement('span');
    soundIcon.className = "reminder-sound";
    if (sound) {
        soundIcon.innerHTML = "🔔";
    }

    // Platzhalter für Leerraum
    const spacer = document.createElement('span');

    // Mülleimer-Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M9 3v1H4v2h1v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5V3H9zm0 2h6v1H9V5zm-2 3h10v10H7V8zm2 2v6h2v-6H9zm4 0v6h2v-6h-2z"></path>
        </svg>
    `;
    deleteBtn.addEventListener('click', function() {
        li.remove();
        removeReminder(text, time); // Aus Speicher entfernen
    });

    // Elemente ins <li> einfügen (4-Spalten-Aufbau)
    li.appendChild(reminderText);
    li.appendChild(soundIcon);
    li.appendChild(spacer);
    li.appendChild(deleteBtn);

    document.getElementById('reminderList').appendChild(li);

    // Nur speichern, wenn die Funktion durch den Button ausgelöst wurde
    if (save) {
        saveReminder(text, time, sound);
    }
}

// Erinnerung in LocalStorage speichern
function saveReminder(text, time, sound) {
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders.push({ text, time, sound });
    localStorage.setItem("reminders", JSON.stringify(reminders));
}

// Erinnerungen aus LocalStorage laden
function loadReminders() {
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders.forEach(reminder => {
        addReminder(reminder.text, reminder.time, reminder.sound, false);
    });
}

// Erinnerung aus LocalStorage löschen
function removeReminder(text, time) {
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders = reminders.filter(reminder => reminder.text !== text || reminder.time !== time);
    localStorage.setItem("reminders", JSON.stringify(reminders));
}

// Benutzer um Erlaubnis für Benachrichtigungen bitten
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            console.log("Benachrichtigungserlaubnis:", permission);
        });
    }
}

// Erinnerungen prüfen und Benachrichtigung senden
function checkReminders() {
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    let now = new Date();
    let currentHour = now.getHours().toString().padStart(2, "0");
    let currentMinute = now.getMinutes().toString().padStart(2, "0");
    let currentTime = currentHour + ":" + currentMinute;

    reminders.forEach(reminder => {
        if (reminder.time === currentTime) {
            sendNotification(reminder.text, reminder.sound);
        }
    });
}

// Benachrichtigung senden
function sendNotification(text, sound) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Erinnerung", { body: text, icon: "icon-192x192.png" });
    }

    // Ton abspielen, wenn Glocke aktiviert war
    if (sound) {
        let audio = new Audio("alarm.mp3");
        audio.play();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    if (Notification.permission === "granted") {
        new Notification("Test", { body: "Diese Nachricht kommt direkt von script.js!", icon: "icon-192x192.png" });
    }
});

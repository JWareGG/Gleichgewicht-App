// Service Worker registrieren
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(reg => console.log("✅ Service Worker registriert:", reg))
    .catch(error => console.log("❌ Fehler beim Service Worker:", error));
}

// Warten, bis DOM geladen ist
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ DOM ist geladen, versuche Button zu verbinden...");
    let button = document.getElementById("addReminder");

    if (button) {
        console.log("✅ Button gefunden, Event wird registriert!");
        button.addEventListener("click", addReminder);
    } else {
        console.log("❌ Button nicht gefunden!");
    }

    loadReminders(); // Erinnerungen aus LocalStorage laden
});

// Funktion: Erinnerung hinzufügen
function addReminder() {
    let reminderInput = document.getElementById("reminder");
    let timeInput = document.getElementById("time");
    let soundInput = document.getElementById("sound");

    let reminderText = reminderInput.value.trim();
    let reminderTime = timeInput.value;
    let soundEnabled = soundInput.checked;

    if (reminderText === "" || reminderTime === "") {
        alert("Bitte Erinnerungstext und Zeit eingeben!");
        return;
    }

    const reminder = { text: reminderText, time: reminderTime, sound: soundEnabled };

    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders.push(reminder);
    localStorage.setItem("reminders", JSON.stringify(reminders));

    reminderInput.value = "";
    timeInput.value = "";
    soundInput.checked = false;

    createReminderElement(reminderText, reminderTime, soundEnabled);
}

// Funktion: Erinnerungen aus `localStorage` laden
function loadReminders() {
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    document.getElementById('reminderList').innerHTML = ""; // Liste leeren, um doppelte Einträge zu vermeiden

    reminders.forEach(reminder => {
        createReminderElement(reminder.text, reminder.time, reminder.sound);
    });
}

// Funktion: Erinnerung im UI anzeigen
function createReminderElement(text, time, sound) {
    const li = document.createElement('li');

    // Uhrzeit formatieren
    const formattedTime = time ? time + " Uhr" : "";

    // Text-Spalte
    const reminderText = document.createElement('span');
    reminderText.className = "reminder-text";
    reminderText.textContent = text + " - " + formattedTime;

    // Glocke-Icon falls Sound aktiv
    let soundIcon = document.createElement('span');
    soundIcon.className = "reminder-sound";
    if (sound) {
        soundIcon.innerHTML = "🔔";
    }

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
        removeReminder(text, time);
    });

    // Spalten-Struktur erstellen
    li.appendChild(reminderText);
    li.appendChild(soundIcon);
    li.appendChild(deleteBtn);

    document.getElementById('reminderList').appendChild(li);
}

// Funktion: Erinnerung aus `localStorage` entfernen
function removeReminder(text, time) {
    let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    reminders = reminders.filter(reminder => reminder.text !== text || reminder.time !== time);
    localStorage.setItem("reminders", JSON.stringify(reminders));
}

// Funktion: Benutzer um Benachrichtigungs-Erlaubnis bitten
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            console.log("Benachrichtigungserlaubnis:", permission);
        });
    }
}

// Funktion: Erinnerungen prüfen und Benachrichtigung senden
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

// Funktion: Benachrichtigung senden
function sendNotification(text, sound) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Erinnerung", { body: text, icon: "icon-192x192.png" });
    }

    // Falls Ton aktiviert ist, abspielen
    if (sound) {
        let audio = new Audio("notification-sound.mp3");
        audio.play();
    }
}

// Erinnerungen jede Minute prüfen
setInterval(checkReminders, 60000);

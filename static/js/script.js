/* ==========================
   Fade Animation
========================== */

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll("section, .glass-card").forEach((el) => {
    el.classList.add("hidden");
    observer.observe(el);
});


/* ==========================
   Navbar Scroll Effect
========================== */

const navbar = document.querySelector(".custom-navbar");

window.addEventListener("scroll", () => {

    if (navbar) {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }

});


/* ==========================
   Chatbot Open / Close
========================== */

const chatIcon = document.getElementById("chat-icon");
const chatBox = document.getElementById("chat-box");

if (chatIcon && chatBox) {

    chatIcon.addEventListener("click", () => {

        if (chatBox.style.display === "block") {
            chatBox.style.display = "none";
        } else {
            chatBox.style.display = "block";
        }

    });

}


/* ==========================
   Chatbot Messages
========================== */

const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chat-messages");

if (sendBtn && userInput && chatMessages) {

    sendBtn.addEventListener("click", sendMessage);

    userInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            sendMessage();
        }

    });

}


function sendMessage() {

    const text = userInput.value.trim();

    if (text === "") return;

    // User Message

    chatMessages.innerHTML += `
        <div style="text-align:right;margin:10px 0;">
            <span style="
                background:#2563eb;
                color:white;
                padding:10px 15px;
                border-radius:15px;
                display:inline-block;
                max-width:80%;">
                ${text}
            </span>
        </div>
    `;

    const msg = text.toLowerCase();

    let reply = "❓ Sorry, I didn't understand that. Please ask about diabetes, symptoms, glucose, BMI, diet or exercise.";

    if (msg.includes("hi") || msg.includes("hello")) {

        reply = "👋 Hello! Welcome to AI Diabetes Assistant. How can I help you?";

    }

    else if (msg.includes("diabetes")) {

        reply = "🩺 Diabetes is a disease where blood sugar levels become too high because the body cannot use insulin properly.";

    }

    else if (msg.includes("symptom")) {

        reply = "⚠ Common symptoms include increased thirst, frequent urination, fatigue, blurred vision and slow wound healing.";

    }

    else if (msg.includes("glucose")) {

        reply = "🩸 Normal fasting glucose is generally below 100 mg/dL. Please consult a healthcare professional for personal advice.";

    }

    else if (msg.includes("diet")) {

        reply = "🥗 Eat vegetables, whole grains, lean protein and reduce sugary foods and drinks.";

    }

    else if (msg.includes("exercise")) {

        reply = "🏃 Exercise at least 30 minutes a day, 5 days a week.";

    }

    else if (msg.includes("bmi")) {

        reply = "⚖ A healthy BMI is generally between 18.5 and 24.9.";

    }

    else if (msg.includes("thank")) {

        reply = "😊 You're welcome! Stay healthy.";

    }

    else if (msg.includes("bye")) {

        reply = "👋 Take care! Have a great day.";

    }

    setTimeout(() => {

        chatMessages.innerHTML += `
            <div class="bot-message">
                ${reply}
            </div>
        `;

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }, 500);

    userInput.value = "";

}
/* ==========================
   Voice Prediction
========================== */

function speakPrediction() {

    const result = document.querySelector(".result-card h2");

    if (!result) {
        alert("Please make a prediction first.");
        return;
    }

    let text = result.innerText;

    const speech = new SpeechSynthesisUtterance();

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    if (text.includes("No Diabetes")) {

        speech.text =
            "Prediction completed. Good news! No diabetes was detected. Please continue a healthy lifestyle, exercise regularly, and eat a balanced diet.";

    } else {

        speech.text =
            "Prediction completed. Diabetes may be detected. Please consult a doctor for proper medical evaluation and follow a healthy lifestyle.";

    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);

}
/* ==========================
   Loader
========================== */

window.addEventListener("load", function () {

    const loader = document.getElementById("loader");

    setTimeout(function () {

        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.6s ease";

        setTimeout(function () {
            loader.style.display = "none";
        }, 600);

    }, 2000);

});
/* ==========================
   Welcome User Voice
========================== */

window.addEventListener("load", function () {

    const user = document.getElementById("welcomeUser");

    if (!user) return;

    const username = user.dataset.username;

    setTimeout(() => {

        const speech = new SpeechSynthesisUtterance();
        const voices = window.speechSynthesis.getVoices();

const femaleVoice = voices.find(voice =>
    voice.name.includes("Zira") ||
    voice.name.includes("Susan") ||
    voice.name.includes("Female")
);

if (femaleVoice) {
    speech.voice = femaleVoice;
}

        speech.lang = "en-US";
        speech.rate = 0.9;
        speech.pitch = 1;

        speech.text =
            "Welcome " + username +
            ". Welcome to AI Diabetes Prediction System. Have a wonderful day.";

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);

    }, 1000);

});
window.speechSynthesis.onvoiceschanged = () => {
    console.log(window.speechSynthesis.getVoices());
};
const height = document.getElementById("height");
const weight = document.getElementById("weight");
const bmi = document.getElementById("bmi");

function calculateBMI() {
    const h = parseFloat(height.value) / 100;
    const w = parseFloat(weight.value);

    if (h > 0 && w > 0) {
        bmi.value = (w / (h * h)).toFixed(1);
    }
}

height.addEventListener("input", calculateBMI);
weight.addEventListener("input", calculateBMI);
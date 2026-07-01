from flask import Flask, render_template, request, send_file, redirect, url_for, session
import sqlite3
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
import joblib
import numpy as np

app = Flask(__name__)
app.secret_key = "ai_diabetes_secret_key"

# Load AI Model
model = joblib.load("diabetes_model.pkl")
scaler = joblib.load("scaler.pkl")


# ==========================
# HOME PAGE
# ==========================
@app.route("/")
def home():
    return redirect(url_for("signup"))


# ==========================
# SIGNUP PAGE
# ==========================
@app.route("/signup", methods=["GET", "POST"])
def signup():

    if request.method == "POST":

        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]

        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        try:
            cursor.execute(
                "INSERT INTO users(name,email,password) VALUES(?,?,?)",
                (name, email, password)
            )
            conn.commit()

        except sqlite3.IntegrityError:
            conn.close()
            return "Email already exists. Please use another email."

        conn.close()

        return redirect(url_for("login"))

    return render_template("signup.html")
@app.route("/home")
def home_page():

    if "user" not in session:
        return redirect(url_for("login"))

    return render_template(
        "index.html",
        username=session["user"]
    )
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM users WHERE email=? AND password=?",
            (email, password)
        )

        user = cursor.fetchone()

        conn.close()

        if user:

         session["user"] = user[1]

        return redirect(url_for("home_page"))

    else:

        return render_template(
        "login.html",
        error="Account not found! Please sign up first."
    )
@app.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("login"))


# ==========================
# AI PREDICTION
# ==========================
@app.route("/predict", methods=["POST"])
def predict():

    data = [
        float(request.form["Pregnancies"]),
        float(request.form["Glucose"]),
        float(request.form["BloodPressure"]),
        float(request.form["SkinThickness"]),
        float(request.form["Insulin"]),
        float(request.form["BMI"]),
        float(request.form["DPF"]),
        float(request.form["Age"])
    ]

    data = np.array(data).reshape(1, -1)
    data = scaler.transform(data)

    prediction = model.predict(data)
    probability = model.predict_proba(data)

    confidence = round(max(probability[0]) * 100, 2)

    if prediction[0] == 1:
        result = "⚠️ Diabetes Detected"
    else:
        result = "✅ No Diabetes"

    return render_template(
        "index.html",
        prediction=result,
        confidence=confidence
    )


# ==========================
# PDF REPORT
# ==========================
@app.route("/download_report")
def download_report():

    prediction = request.args.get("prediction", "No Result")
    confidence = request.args.get("confidence", "0")

    prediction = prediction.replace("✅", "").replace("⚠️", "").strip()

    buffer = BytesIO()

    pdf = canvas.Canvas(buffer)

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(150, 800, "AI Diabetes Prediction Report")

    pdf.setFont("Helvetica", 12)

    pdf.drawString(50, 760, "Date : " + datetime.now().strftime("%d-%m-%Y"))
    pdf.drawString(50, 740, "Time : " + datetime.now().strftime("%I:%M %p"))

    pdf.drawString(50, 700, "Prediction : " + prediction)
    pdf.drawString(50, 680, "Confidence : " + str(confidence) + "%")

    pdf.drawString(50, 640, "Recommendations:")

    if "No" in prediction:
        pdf.drawString(70, 620, "- Continue healthy diet")
        pdf.drawString(70, 600, "- Exercise daily")
        pdf.drawString(70, 580, "- Drink plenty of water")
    else:
        pdf.drawString(70, 620, "- Consult a doctor")
        pdf.drawString(70, 600, "- Reduce sugar intake")
        pdf.drawString(70, 580, "- Monitor blood glucose regularly")

    pdf.drawString(50, 520, "Developed by Mohamed Bahir")

    pdf.save()

    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="Diabetes_Report.pdf",
        mimetype="application/pdf"
    )


# ==========================
# RUN APP
# ==========================
if __name__ == "__main__":
    app.run(debug=True)
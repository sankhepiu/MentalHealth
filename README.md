# MentalHealth
# MindWell 🧠💚

MindWell is a full-stack mental health web application designed to help users assess their emotional well-being and interact with an AI-powered companion for support.

The platform combines a scientifically backed questionnaire (DASS-21) with a conversational AI chatbot to provide users with insights, guidance, and a safe space to express their thoughts.

---

## 🌟 Features

* 🧠 **Mental Health Assessment (DASS-21)**

  * Evaluates Depression, Anxiety, and Stress levels
  * Provides severity classification and recommendations

* 💬 **AI Chatbot (Groq LLM)**

  * Real-time conversational support
  * Context-aware responses based on user assessment

* 📊 **Results Dashboard**

  * Visual representation of scores
  * Personalized suggestions

* 🎨 **Modern UI**

  * Clean chat interface
  * Responsive design

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* TypeScript

### Backend

* Node.js
* Express.js

### AI Integration

* Groq API (LLaMA 3.3 70B model)

### Cloud & Deployment

* AWS S3
* AWS CloudFront
* AWS Elastic Beanstalk

---

## ☁️ AWS Services Used & Benefits

### 1. AWS S3 (Simple Storage Service)

**Used for:** Hosting frontend (static website)

**Benefits:**

* Highly scalable and reliable storage
* Easy deployment of static files (HTML, CSS, JS)
* Cost-effective hosting solution
* High availability

---

### 2. AWS CloudFront

**Used for:** Content Delivery Network (CDN) for frontend & backend

**Benefits:**

* Faster loading via global edge locations
* HTTPS support (secure communication)
* Reduced latency for users worldwide
* Improved performance of API calls

---

### 3. AWS Elastic Beanstalk

**Used for:** Deploying backend (Node.js server)

**Benefits:**

* Easy deployment without managing infrastructure
* Auto scaling and load balancing
* Handles server configuration automatically
* Integrated with other AWS services

---

## ⚙️ How It Works

1. User completes the DASS-21 questionnaire
2. Scores are calculated for:

   * Depression
   * Anxiety
   * Stress
3. Results are displayed with severity levels
4. User can interact with AI chatbot
5. Chatbot provides supportive responses using Groq API

---

## 🚀 Deployment Architecture

Frontend (React) → AWS S3 → CloudFront
Backend (Node.js) → Elastic Beanstalk → CloudFront
AI → Groq API

---

## 📦 Installation (Local Setup)

### 1. Clone the repo

```bash
git clone <your-repo-link>
cd mentalhealth
```

### 2. Install dependencies

```bash
npm install
cd frontend && npm install
```

### 3. Setup environment variables

Create `.env` in backend:

```env
GROQ_API_KEY=your_api_key_here
```

### 4. Run project

```bash
# backend
node server.js

# frontend
npm run dev
```

---

## 📌 Future Enhancements

* 📈 Mood Tracker with graphs
* 🔐 User authentication system
* 💾 Chat history storage
* 🌙 Dark mode UI
* 📱 Mobile optimization

---

## ⚠️ Disclaimer

This application is intended for educational and informational purposes only.
It is **not a substitute for professional medical advice, diagnosis, or treatment**.

---

## 👨‍💻 Author

Developed by Piu 💚


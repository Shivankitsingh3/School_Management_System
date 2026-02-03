# School Management System

A full-stack School Management System built with Django, Django REST Framework, PostgreSQL, and React.

This project is API-first and supports role-based access for Students, Teachers, and Principals.

---

## Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication
- AI-assisted assignment feedback (LLM integration)

### Frontend
- React (Vite)
- Tailwind CSS

---

## Core Features

- Custom email-based authentication
- Role-based access (Student / Teacher / Principal)
- Classroom & Subject management
- Assignment creation, submission, evaluation
- Attendance system (Present / Absent / Leave)
- Notifications using Django signals
- JWT login with email activation & password reset
- API-first backend architecture



## AI Integration

Student assignment submissions are processed using GenAI service to generate automated feedback.
This helps teachers review work faster and provides students with instant improvement suggestions.

AI is used only for feedback assistance — final evaluation remains with teachers.


---

## Project Structure

School_Management_System/
│
├── backend/
│   ├── account/
│   ├── student/
│   ├── teacher/
│   ├── principal/
│   ├── classroom/
│   ├── subject/
│   ├── assignment/
│   ├── attendance/
│   └── notifications/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── student/
│   │   │   ├── teacher/
│   │   │   └── principal/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── api/
│   │   └── utils/
│   │
│   │
│   └── App.jsx
│   │
│   └── main.jsx
│
├── .gitignore
└── README.md



---

## Setup Instructions

### Backend

```bash
# from project root
python -m venv .venv_sms
source .venv_sms/Scripts/activate

pip install -r backend/requirements.txt

cd backend
python manage.py migrate
python manage.py runserver



Frontend

cd frontend
npm install
npm run dev

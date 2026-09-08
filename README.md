# PRODIGY_WD_01_02
# Employee Management System

A full-stack **Employee Management System** developed as part of my **Full-Stack Web Development Internship at Prodigy InfoTech**.

The application allows administrators to manage employee records using complete **CRUD (Create, Read, Update, Delete)** operations with authentication and validation.

## 🚀 Features

### 🔐 Admin Authentication

* Admin login
* Authentication-based access
* Protected Employee Management page
* Logout functionality

### 👨‍💼 Employee Management

* **Create** – Add new employee records
* **Read** – View employee records and employee details
* **Update** – Edit existing employee information
* **Delete** – Remove employee records
* Search and manage employee information

### ✅ Validation

* Required field validation
* Email format validation
* Phone number validation
* Salary validation
* Employee data validation
* Duplicate email prevention

## 🛠️ Technologies Used

### Frontend

* Next.js
* React.js
* Tailwind CSS
* JavaScript / TypeScript

### Backend

* Java
* Spring Boot
* REST API

### Database

* MongoDB

### Tools

* Git
* GitHub
* Postman
* VS Code

## 📂 Project Structure

```text
Employee-Management-System/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   └── pom.xml
│
└── README.md
```

## 🔗 REST API Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| POST   | `/employees`      | Create employee    |
| GET    | `/employees`      | Get all employees  |
| GET    | `/employees/{id}` | Get employee by ID |
| PUT    | `/employees/{id}` | Update employee    |
| DELETE | `/employees/{id}` | Delete employee    |

## ▶️ How to Run the Project

### Backend

Open the backend folder:

```bash
cd ems
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will run on:

```text
http://localhost:8081
```

### Frontend

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

## 🧪 API Testing

The APIs can be tested using **Postman**.

Example Create Employee request:

```json
{
  "firstName": "Priya",
  "lastName": "Patel",
  "email": "priya.patel@gmail.com",
  "phone": "9876543210",
  "department": "IT",
  "position": "Java Developer",
  "salary": 35000,
  "joiningDate": "2026-09-08",
  "status": "Active"
}
```

## 🎯 Project Objective

The objective of this project is to develop a web application that allows administrators to perform CRUD operations on employee records while implementing proper **validation and authentication mechanisms** to protect sensitive employee information.

## 📸 Project Demo

A project demonstration video is included to show:

1. Admin Login
2. Dashboard
3. Employee Management
4. Add Employee
5. View Employee
6. Edit Employee
7. Delete Employee
8. Logout

## 👩‍💻 Internship

**Internship:** Full-Stack Web Development Internship
**Organization:** Prodigy InfoTech
**Project:** Employee Management System

This project helped me gain practical experience in frontend development, backend development, REST APIs, database integration, authentication, validation, and CRUD operations.

## ⭐ Future Improvements

* Role-based access control
* Employee profile pictures
* Pagination
* Advanced search and filtering
* Attendance management
* Leave management
* Employee reports

## 📄 License

This project was developed for educational and internship purposes.

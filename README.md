# SmartQueue

Το SmartQueue είναι μια διαδικτυακή εφαρμογή διαχείρισης ουρών αναμονής. Επιτρέπει στους πελάτες να εκδίδουν ηλεκτρονικά εισιτήρια και στους υπαλλήλους να καλούν και να ολοκληρώνουν την εξυπηρέτηση των εισιτηρίων.

## Βασικές λειτουργίες

### Πελάτης

* Προβολή ενεργών υπηρεσιών
* Επιλογή υπηρεσίας
* Έκδοση ηλεκτρονικού εισιτηρίου
* Προβολή αριθμού εισιτηρίου
* Προβολή ατόμων που προηγούνται
* Υπολογισμός εκτιμώμενου χρόνου αναμονής

### Υπάλληλος

* Επιλογή υπηρεσίας
* Καταχώριση αριθμού γκισέ
* Κλήση του επόμενου εισιτηρίου
* Προβολή του εισιτηρίου που εξυπηρετείται
* Ολοκλήρωση εξυπηρέτησης

## Τεχνολογική στοίβα

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express
* PostgreSQL
* REST API
* Jest και Supertest

### DevOps

* Git και GitHub
* Feature branches και Pull Requests
* GitHub Actions
* Docker
* Docker Compose
* Nginx

## Αρχιτεκτονική

Η εφαρμογή ακολουθεί αρχιτεκτονική τριών επιπέδων:

1. Το React frontend παρέχει τις οθόνες πελάτη και υπαλλήλου.
2. Το Express backend υλοποιεί το REST API και την επιχειρησιακή λογική.
3. Η PostgreSQL αποθηκεύει υπηρεσίες, γκισέ και εισιτήρια ουράς.

Η επικοινωνία μεταξύ frontend και backend γίνεται με HTTP αιτήματα και JSON δεδομένα.

Περισσότερες πληροφορίες:

* [Ανάλυση συστήματος](docs/system-analysis.md)
* [Απαιτήσεις χρηστών](docs/user-requirements.md)
* [Αρχιτεκτονική](docs/architecture.md)

## Δομή έργου

```text
SmartQueue/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── services/
│   │   └── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── StaffDashboard.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init.sql
├── docs/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── AGENTS.md
├── PLANNING.md
└── TASKS.md
```

## REST API

| Μέθοδος | Διαδρομή                                | Περιγραφή                   |
| ------- | --------------------------------------- | --------------------------- |
| GET     | `/api/health`                           | Έλεγχος λειτουργίας API     |
| GET     | `/api/health/database`                  | Έλεγχος σύνδεσης βάσης      |
| GET     | `/api/services`                         | Επιστροφή ενεργών υπηρεσιών |
| POST    | `/api/tickets`                          | Έκδοση νέου εισιτηρίου      |
| POST    | `/api/queue/call-next`                  | Κλήση επόμενου εισιτηρίου   |
| PATCH   | `/api/queue/tickets/:ticketId/complete` | Ολοκλήρωση εισιτηρίου       |

## Τοπική εκτέλεση με Docker

Απαιτούνται:

* Docker Desktop
* Docker Compose

Δημιουργείται αρχείο `.env` στον κεντρικό φάκελο με τις μεταβλητές:

```env
POSTGRES_DB=smartqueue
POSTGRES_USER=smartqueue
POSTGRES_PASSWORD=smartqueue_password
POSTGRES_PORT=5432
```

Η εφαρμογή ξεκινά με:

```bash
docker compose up --build -d
```

Έλεγχος των containers:

```bash
docker compose ps
```

Τερματισμός:

```bash
docker compose down
```

## Τοπική εκτέλεση για ανάπτυξη

### Backend

```bash
cd backend
npm install
npm start
```

Το backend είναι διαθέσιμο στη διεύθυνση:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Οθόνη πελάτη:

```text
http://localhost:5173
```

Οθόνη υπαλλήλου:

```text
http://localhost:5173/?page=staff
```

## Αυτοματοποιημένοι έλεγχοι

Εκτέλεση backend tests:

```bash
cd backend
npm test
```

Το backend διαθέτει 15 αυτοματοποιημένους ελέγχους για:

* Health endpoints
* Υπηρεσίες
* Έκδοση εισιτηρίων
* Κλήση επόμενου εισιτηρίου
* Ολοκλήρωση εξυπηρέτησης
* Validation και περιπτώσεις σφαλμάτων

Έλεγχος production build του frontend:

```bash
cd frontend
npm run build
```

## Continuous Integration

Το GitHub Actions workflow εκτελεί αυτόματα σε κάθε push και pull request προς το `main`:

1. Backend Tests
2. Frontend Build
3. Backend Docker Build
4. Frontend Docker Build

Οι αλλαγές συγχωνεύονται στο `main` μόνο όταν οι αυτοματοποιημένοι έλεγχοι ολοκληρωθούν επιτυχώς.

## Στρατηγική Git

Χρησιμοποιήθηκε feature-branch workflow:

1. Δημιουργία ξεχωριστού branch για κάθε λειτουργία.
2. Υλοποίηση και τοπικός έλεγχος.
3. Commit με περιγραφικό μήνυμα.
4. Push στο GitHub.
5. Δημιουργία Pull Request.
6. Εκτέλεση GitHub Actions.
7. Merge μετά την επιτυχία όλων των checks.

Ενδεικτικά branches:

* `feature/backend-setup`
* `feature/database-setup`
* `feature/services-api`
* `feature/ticket-api`
* `feature/queue-management`
* `feature/customer-frontend`
* `feature/docker-packaging`
* `feature/staff-dashboard`

## Χρήση Coding Agents

Coding Agents χρησιμοποιήθηκαν για:

* Ανάλυση απαιτήσεων
* Κατάρτιση πλάνου ανάπτυξης
* Σχεδιασμό αρχιτεκτονικής
* Δημιουργία και έλεγχο κώδικα
* Διάγνωση σφαλμάτων
* Σχεδιασμό αυτοματοποιημένων tests
* Διαμόρφωση Docker και GitHub Actions
* Τεκμηρίωση του έργου

Για τη σωστή καθοδήγηση των agents χρησιμοποιήθηκαν:

* `AGENTS.md` για κανόνες και τεχνικές οδηγίες
* `PLANNING.md` για το πλάνο ανάπτυξης
* `TASKS.md` για την παρακολούθηση των εργασιών
* Μικρά, ελεγχόμενα βήματα ανάπτυξης
* Έλεγχος κάθε αλλαγής πριν από commit και merge

## Κατάσταση έργου

Η εφαρμογή υποστηρίζει ολοκληρωμένη ροή:

1. Ο πελάτης επιλέγει υπηρεσία.
2. Εκδίδεται νέο εισιτήριο.
3. Υπολογίζεται η θέση και η αναμονή.
4. Ο υπάλληλος καλεί το επόμενο εισιτήριο.
5. Το εισιτήριο συνδέεται με συγκεκριμένο γκισέ.
6. Ο υπάλληλος ολοκληρώνει την εξυπηρέτηση.
7. Η κατάσταση ενημερώνεται στην PostgreSQL.


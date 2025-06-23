# egzaminas

## How to start the application

### 1. Backend

```sh
cd egzaminas/Backend
npm install
npm start
```
The backend will run on [http://localhost:3000](http://localhost:3000) by default.

### 2. Frontend

```sh
cd egzaminas/FrontEnd
npm install
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## Test logins

### Admin account
- **Email:** dziugas@mail.lt
- **Password:** admin

### User account
- **Email:** naudotojas@mail.lt
- **Password:** Naudotojas

---

## Notes

- Make sure your PostgreSQL database is running and matches the credentials in `Backend/.env`.
- If you have issues logging in, check that you are using the correct email **case** (all lowercase).
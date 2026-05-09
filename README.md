# Real-Time Expert Session Booking System

A full-stack web app where users can browse experts, check their available slots, book a session, and track booking status from one place.

This project was built with React, Tailwind CSS, Node.js, Express, and MongoDB Atlas. It also uses polling on the frontend so booked slots update automatically without refreshing the page.

## 1. Project Overview

The idea behind this project was to build a simple but useful booking system for expert sessions. A user can search for an expert, filter by category, open the expert details page, choose a slot, and book it. After booking, the slot becomes unavailable for other users.

The app also includes a My Bookings page where booking status can be updated from Pending to Confirmed or Completed.

## 2. Features

- Expert listing page
- Search experts by name
- Filter experts by category
- Expert detail page with available slots
- Session booking form
- Booking validation on frontend and backend
- Prevent double booking
- Real-time slot update using polling
- Booking status management
  - Pending
  - Confirmed
  - Completed
- My bookings page
- Responsive design for mobile and desktop
- Loading states
- Error handling

## 3. Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## 4. Folder Structure

```text
project-root/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 5. Installation Steps

### Prerequisites

Make sure you have these installed:

- Node.js
- npm
- MongoDB

### Clone and open the project

```bash
git clone <your-repo-link>
cd "Real-Time Expert Session Booking System"
```

## 6. Backend Setup

Go to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and add your MongoDB Atlas connection string.

Run the seed script once to load sample experts:

```bash
npm run seed
```

Start the backend server:

```bash
npm start
```

For development, you can also use:

```bash
npm run dev
```

The backend usually runs on:

```bash
http://localhost:5000
```

## 7. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder and add the backend URL if you want to override the default.

Start the frontend app:

```bash
npm run dev
```

The frontend usually runs on:

```bash
http://localhost:5173
```

## 8. Environment Variables

### backend/.env example

```env
PORT=5000
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/expert-booking?retryWrites=true&w=majority&appName=real-time-expert-booking-system
NODE_ENV=development
CORS_ORIGIN=*
```

### frontend/.env example

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production on Vercel, set:

```env
VITE_API_BASE_URL=https://real-time-expert-booking-system-655d.onrender.com/api
```

## 9. API Endpoints

### Experts

- `GET /api/experts` - Get all experts
- `GET /api/experts/:id` - Get one expert by ID

### Bookings

- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings
- `PATCH /api/bookings/:id/status` - Update booking status

## 10. Screenshots

Add screenshots here later.

- Home page
- Expert detail page
- Booking form
- My bookings page

## 11. How Real-Time Slot Update Works

The frontend checks the expert details API every 5 seconds using polling.

That means:

- If a slot gets booked by another user, the page updates automatically.
- Already booked slots get disabled in the UI.
- Users do not need to refresh the page manually.

This approach is simple and fits the project well since I wanted to avoid using Socket.io.

## 12. Future Improvements

- Add login and user accounts
- Add booking cancellation
- Add email notifications after booking
- Add admin dashboard
- Add calendar view for bookings
- Add pagination or search on My Bookings page

## 13. Challenges Faced

- Handling double booking was the main challenge because two users can try the same slot at the same time.
- Keeping the UI in sync without refreshing the page took some planning, so I used polling instead of a real-time socket setup.
- Making the layout work well on mobile and desktop needed a few rounds of Tailwind spacing and grid fixes.
- I also had to make sure backend validation and frontend validation matched, so the app does not accept bad data.

## 14. Learning Outcomes

- Learned how to build a full-stack app with React, Express, and MongoDB
- Understood how to connect frontend API calls using Axios
- Practiced form validation on both frontend and backend
- Learned how to prevent duplicate booking using server-side checks
- Got better at responsive UI design with Tailwind CSS
- Understood how polling can be used for simple live updates

## 15. Author

**Name:** YASHRAJ SINGH RATHORE
**Course:** B.Tech IT
**Project:** Real-Time Expert Session Booking System
**Role:** Full-stack development and UI implementation

## 16. License

This project is licensed under the MIT License.

---
## API Note

For better backend structure and scalability, all API routes are prefixed with `/api`.

Examples:
- `/api/experts`
- `/api/bookings`
If you want to use this project, feel free to reuse the code with proper credit and the MIT license terms.

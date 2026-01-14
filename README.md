# SEPLUS - Sepsis Early Detection & Management System

SEPLUS is a comprehensive healthcare platform designed for the early detection and management of Sepsis. It provides a real-time qSOFA scoring system for patients and a robust management portal for hospitals.

## Features

- **qSOFA Scoring:** Simple bedside tool to identify patients at risk of death from sepsis.
- **Patient Dashboard:** Real-time monitoring of vitals (Respiratory Rate, Blood Pressure, Mental Status).
- **Hospital Portal:** Secure management of patient screenings and ward assignments.
- **Find a Doctor:** Directory of specialized critical care physicians and infectious disease experts.
- **Resource Center:** Educational articles and news about sepsis awareness.

## Technology Stack

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Security:** Helmet, Express-Rate-Limit, Mongo-Sanitize, Compression

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- MongoDB Atlas Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/seplus.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (create a `.env` file):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=1500
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:1500,https://your-domain.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

To run in production mode:
```bash
npm run production
```

## License

ISC License - Copyright (c) 2026 SEPLUS
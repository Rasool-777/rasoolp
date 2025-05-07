# Excel Analytics Platform

A MERN stack application for uploading Excel files, analyzing data, and generating interactive 2D and 3D charts.

## Features

- User & Admin Authentication (JWT based)
- Excel File Upload and Parsing
- Data Mapping (dynamic X and Y axes selection)
- Graph Generation (2D/3D charts)
- Downloadable Charts (PNG/PDF)
- Dashboard with upload history
- Admin features for user management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### Clone the repository

\`\`\`bash
git clone <repository-url>
cd excel-analytics-platform
\`\`\`

### Backend Setup

\`\`\`bash
cd backend
npm install

# Create a .env file with the following variables:
# NODE_ENV=development
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRE=30d
# FRONTEND_URL=http://localhost:3000

# Create an admin user
npm run seed:admin

# Create a sample Excel file (optional)
npm run create:sample

# Start the backend server
npm run server
\`\`\`

### Frontend Setup

\`\`\`bash
cd frontend
npm install

# Create a .env file with the following variable:
# REACT_APP_API_URL=http://localhost:5000

# Start the frontend development server
npm start
\`\`\`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account or login with the admin credentials:
   - Email: admin@example.com
   - Password: admin123
3. Upload an Excel file from the Upload page
4. Analyze the data and create charts
5. Download charts as PNG or PDF
6. View your upload and chart history

## Admin Features

Admin users have access to:
- User management
- System statistics
- Storage usage monitoring

## Deployment

### Backend Deployment

The backend can be deployed to platforms like:
- Vercel
- Render
- Heroku
- Railway

### Frontend Deployment

The frontend can be deployed to platforms like:
- Vercel
- Netlify
- GitHub Pages

## License

MIT

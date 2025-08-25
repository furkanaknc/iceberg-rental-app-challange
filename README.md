# Real Estate Management System

A full-stack real estate management application built with NestJS, Vue.js 3, and PostgreSQL. The system supports property management, appointment scheduling, and role-based access control for real estate agencies.

## 🏗️ Architecture

- **Backend**: NestJS with TypeScript, Prisma ORM, PostgreSQL
- **Frontend**: Vue.js 3 (Composition API), Pinia state management, Tailwind CSS
- **Database**: PostgreSQL with Docker
- **Monorepo**: Nx workspace for managing multiple applications

## 🚀 Features

### 🏠 Property Management

- Create, read, update, delete properties
- Property search and filtering
- Location-based distance calculations using OpenRouteService API
- Coordinate-based property mapping

### 📅 Appointment Scheduling

- Schedule property viewings
- Automatic travel time calculations
- Agent and customer availability checking
- Real-time conflict detection
- Appointment status management (SCHEDULED, COMPLETED, CANCELLED)

### 👥 User Management & Authentication

- JWT-based authentication
- Role-based access control (ADMIN, AGENT)
- User registration and profile management
- Secure password hashing

### 🔐 Role-Based Permissions

- **Agents**: Can create properties, manage their own appointments
- **Admins**: Full system access, can manage all properties and appointments
- **Smart UI**: Role-based button visibility and functionality

### 📱 Modern UI/UX

- Responsive design for mobile and desktop
- Custom notification system
- Confirmation dialogs
- Real-time form validation
- Loading states and error handling

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd real-estate-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env` file in `apps/backend/`:

   ```env
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/real_estate_db"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"

   # External APIs
   POSTCODE_API_URL="https://api.postcodes.io"
   OPENROUTESERVICE_API_KEY="your-openrouteservice-api-key"
   OPENROUTESERVICE_API_URL="https://api.openrouteservice.org/v2/directions/driving-car"

   # Application Settings
   APPOINTMENT_DURATION_MINUTES=60
   ```

## 🐳 Database Setup

1. **Start PostgreSQL with Docker Compose**

   ```bash
   docker-compose up -d
   ```

2. **Generate Prisma client**

   ```bash
   cd apps/backend
   npx prisma generate
   ```

3. **Run database migrations**

   ```bash
   npx prisma db push
   ```

4. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend**

   ```bash
   npx nx serve backend
   ```

   Backend will run on http://localhost:3000

2. **Start the frontend**
   ```bash
   npx nx serve frontend
   ```
   Frontend will run on http://localhost:4200

### Production Build

1. **Build backend**

   ```bash
   npx nx build backend
   ```

2. **Build frontend**
   ```bash
   npx nx build frontend
   ```

## 📊 Database Schema

### Core Tables

- **Users**: Agent and admin accounts
- **Customers**: Property viewing customers
- **Properties**: Real estate listings with coordinates
- **Offices**: Agency office locations
- **Appointments**: Scheduled property viewings

### Key Relationships

- Users (agents) belong to offices
- Appointments link agents, customers, and properties
- Distance calculations between offices and properties

## 🔧 API Endpoints

### Authentication

```
POST /auth/login       - User login
POST /auth/register    - Agent registration
```

### Properties

```
GET    /properties           - List properties (with search)
POST   /properties           - Create property (ADMIN/AGENT)
PATCH  /properties/:id       - Update property
DELETE /properties/:id       - Delete property (ADMIN/AGENT)
```

### Appointments

```
GET    /appointments/schedule    - Get agent's appointments
POST   /appointments             - Create appointment
PATCH  /appointments/:id         - Update appointment
DELETE /appointments/:id         - Delete appointment
```

### Admin Endpoints

```
GET    /admin/appointments        - List all appointments
PATCH  /admin/appointments/:id    - Update any appointment
DELETE /admin/appointments/:id    - Delete any appointment
DELETE /admin/force-delete-property/:id - Force delete property
```

## 🎯 Key Features in Detail

### Distance Calculation System

- **Primary**: OpenRouteService API for accurate driving routes
- **Fallback**: Haversine formula for basic distance calculation
- **Auto-calculation**: Travel times, departure times, and availability windows

### Appointment Conflict Prevention

- **Agent availability**: Prevents double-booking agents
- **Customer availability**: Prevents customer conflicts
- **Travel time consideration**: Accounts for travel between appointments

### Smart UI Components

- **PropertyList**: Role-based action buttons
- **AppointmentCard**: Interactive dropdown menus
- **NotificationSystem**: Custom success/error messages
- **ConfirmationDialogs**: Replace native browser alerts

## 🧪 Development Commands

```bash
# View project structure
npx nx graph

# Run linting
npx nx lint backend
npx nx lint frontend

# Run tests
npx nx test backend
npx nx test frontend

# Database commands
cd apps/backend
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create new migration
npx prisma db push         # Push schema changes
npx prisma generate        # Regenerate Prisma client
```

## 🔍 Environment Variables

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENROUTESERVICE_API_KEY`: API key for route calculations

### Optional Variables

- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `APPOINTMENT_DURATION_MINUTES`: Default appointment length (default: 60)

## 📱 Mobile Responsiveness

The application is fully responsive with:

- Mobile-first design approach
- Touch-friendly interface elements
- Adaptive layouts for different screen sizes
- Optimized forms for mobile input

## 🛡️ Security Features

- **Password hashing**: Bcrypt for secure password storage
- **JWT authentication**: Stateless authentication tokens
- **Role-based access**: Granular permission system
- **Input validation**: Zod schema validation on backend
- **CORS protection**: Configured for secure cross-origin requests

## 🚨 Error Handling

- **Custom error classes**: Structured error responses
- **Global exception filter**: Centralized error handling
- **Validation errors**: User-friendly error messages
- **Frontend notifications**: Real-time error feedback

## 📈 Performance Optimizations

- **Database indexing**: Optimized queries for appointments and properties
- **Lazy loading**: Vue.js route-based code splitting
- **Caching**: Efficient state management with Pinia
- **Distance caching**: Avoid redundant API calls

## 🎨 UI/UX Features

- **Dark/Light mode ready**: CSS custom properties
- **Loading states**: Skeleton loaders and spinners
- **Form validation**: Real-time validation feedback
- **Accessibility**: ARIA labels and keyboard navigation
- **Custom components**: Reusable Vue.js components

## 🔄 State Management

### Frontend State (Pinia)

- **AuthStore**: User authentication and permissions
- **PropertiesStore**: Property CRUD operations
- **AppointmentsStore**: Appointment management
- **NotificationsStore**: Toast notifications
- **ConfirmationStore**: Modal confirmations

## 🐛 Troubleshooting

### Common Issues

1. **Database connection issues**

   ```bash
   # Restart Docker containers
   docker-compose down && docker-compose up -d
   ```

2. **Prisma client out of sync**

   ```bash
   cd apps/backend
   npx prisma generate
   ```

3. **Port already in use**
   ```bash
   # Kill processes on ports 3000 or 4200
   lsof -ti:3000 | xargs kill -9
   lsof -ti:4200 | xargs kill -9
   ```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


# Just todo it

**Just todo it** is a simple todo web application that allows users to easily keep track of their daily tasks. The app features a clean and minimalistic UI, with a simple and intuitive user experience. Users can create, read, update, and delete (CRUD) tasks, as well as share tasks with others, fostering collaboration and teamwork. Additionally, the app includes user authentication and authorization, ensuring that users can only view and share their own tasks with authorized individuals. The app is designed to be as simple as possible, with no extraneous features or distractions, making it perfect for users who want a straightforward,easy-to-use todo list app.

## Documentation

## Table of Contents

- [Getting Started](#getting-started)
- [Setup](#setup)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (>= 20.x)
- npm (>= 10.x)

### Cloning the Repository

```bash
git clone https://github.com/Junk-debug/next-todo-app
cd next-todo-app
```

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory by copying the provided `.env.example` file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file to match the structure provided in `.env.example`.

#### How to Obtain the Auth Secret

One option is to generate a secret using the following command:

```
openssl rand -base64 32
```

#### How to Obtain the Database URL

One option is to use [Vercel’s free storage](https://vercel.com/docs/storage/vercel-postgres) to create a PostgreSQL database.

#### How to Obtain the SMTP Key

You can obtain it by registering at [Brevo](https://www.brevo.com/) and retrieving the SMTP key.
Next, create a link following the structure provided in `.env.example`.

### 3. Installing Dependencies

After editing the `.env` file, run:

```bash
npm install
```

### 4. Run Database Migrations

To set up your database, run the following setup script:

```bash
npm run setup
```

This command will:

- Generate Prisma client files.
- Apply database migrations using `npx prisma migrate deploy`.

### 5. Seed the Database (Optional)

If you want to populate your database with mock data, run:

```bash
npm run seed
```

### 6. Start the Development Server

```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000).

### 7. Login

To test this app, you will need to log in. You have the option to create an account (note that we do not have roles like Admin), but it's not mandatory. Below is an example user you can use to log in:

- **Email:** johndoe@example.com
- **Password:** password

Make sure to populate your database with mock data by running:

```bash
npm run seed
```

---

## Scripts

The project includes several npm scripts to streamline development:

| Script               | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`        | Start the development server                                                   |
| `npm run build`      | Build the project for production                                               |
| `npm run start`      | Start the production server                                                    |
| `npm run lint`       | Check for linting errors                                                       |
| `npm run format`     | Format all source files                                                        |
| `npm run setup`      | Generate Prisma client and deploy database migrations                          |
| `npm run build:seed` | Compile the seed script                                                        |
| `npm run seed`       | Seed the database with mock data (optional)                                    |
| `npm run admin`      | Open the Prisma Studio (database GUI with all schema and models) - admin panel |

## Technologies Used

The project is built using the following technologies:

### Frontend

- [**Next.js (v15.0.1)**](https://nextjs.org/): React framework for server-side rendering and static site generation.
- [**React (v19.0.0)**](https://react.dev/): Core library for building user interfaces.
- [**Tailwind CSS**](https://tailwindcss.com/): Utility-first CSS framework for styling.
- [**shadcn/ui**](https://ui.shadcn.com/): Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
- [**Lucide Icons**](https://lucide.dev/): Icon library for SVG icons.
- [**Framer Motion**](https://www.framer.com/motion/): A production-ready motion library for React, used for creating animations and transitions.

### Backend

- [**NextAuth.js (v5.0.0-beta.25)**](https://next-auth.js.org/): Authentication library for Next.js.
- [**Prisma**](https://www.prisma.io/): ORM for database management and migrations.
- [**PostgreSQL**](https://www.postgresql.org/): Database used for storing application data.
- [**bcryptjs**](https://github.com/dcodeIO/bcrypt.js): Library for hashing and comparing passwords.

### State Management

- [**TanStack React Query**](https://tanstack.com/query): For managing server state and data fetching.

### Validation

- [**Zod**](https://zod.dev/): Type-safe schema validation.

### Development Tools

- [**TypeScript**](https://www.typescriptlang.org/): Static type checking.
- [**ESLint**](https://eslint.org/): Code linting tool.
- [**Prettier**](https://prettier.io/): Code formatting tool.
- [**Turbopack**](https://turbo.build/pack): High-performance bundler for Next.js.

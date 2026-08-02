# StackOverflow Clone with Appwrite & Next.js

A modern, full-stack Question & Answer platform inspired by StackOverflow. Built with [Next.js](https://nextjs.org/), [Appwrite](https://appwrite.io/), and [Tailwind CSS](https://tailwindcss.com/).

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Backend as a Service:** [Appwrite](https://appwrite.io/) (Auth, Databases)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons:** [Lucide React](https://lucide.dev/) & [Tabler Icons](https://tabler.io/icons)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## ✨ Features

- **Authentication:** Secure user login and registration powered by Appwrite Auth.
- **Q&A System:** Ask questions, post answers, and engage with the community.
- **Markdown Support:** Rich text editing for questions and answers using `@uiw/react-markdown-editor`.
- **Modern UI:** Responsive, highly interactive design with animations and particle effects.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- An [Appwrite](https://appwrite.io/) project (Cloud or Self-hosted)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd stackoverflow-appwrite
   ```

2. Install dependencies:
   ```bash
   npm install
   # or yarn install, pnpm install, bun install
   ```

3. Set up environment variables:
   Create a `.env.local` or `.env` file in the root directory and add your Appwrite configuration variables (check `.env` or `.env.example` if available in the repository for the required keys).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Runs the built app in production mode.
- `npm run lint`: Lints the code using ESLint.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

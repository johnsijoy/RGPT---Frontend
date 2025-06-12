# RGPT ERP AI - Admin Panel FE
A modern React-based admin panel for managing projects, leads, contacts, and activities with AI-powered features.

## Features

### Project Management
- Add, update, and modify project details
- Track project releases and timelines
- Categorize and filter projects

### Lead & Contact Management
- Centralized contact database
- Lead tracking and conversion
- Activity logging for all interactions

### Admin Dashboard
- Comprehensive analytics
- User management
- Role-based access control

### AI Integration
- Smart suggestions for project updates
- Automated activity logging
- Predictive lead scoring

## Technologies Used

### Frontend
- React 19
- Material-UI (MUI) v7
- Emotion for styling
- Formik + Yup for forms
- React Router v7

### Backend Connectivity
- Axios for API calls

### Testing
- React Testing Library
- Jest

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher) or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rgpt-erp-ai.git
   ```

2. **Navigate to project directory**
   ```bash
   cd rgpt-erp-ai
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   ```

5. **Configure environment variables**
   ```bash
   nano .env  # or use any text editor
   ```
   
   Add the following configuration:
   ```env
   REACT_APP_API_BASE_URL=https://api.yourdomain.com
   REACT_APP_AI_SERVICE_KEY=your_ai_key_here
   ```

6. **Start development server**
   ```bash
   npm start
   ```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm eject` - Ejects from create-react-app (advanced)

## Configuration

The admin panel can be configured through:

- Environment variables (`.env` file)
- `src/config.js` for frontend-specific settings
- MUI theme customization in `src/styles/theme.js`

## Project Structure

```
rgpt-erp-ai/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   └── config.js
├── .env.example
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@rgpt-erp.com or join our Slack channel.
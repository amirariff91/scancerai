# ScancerAI

![ScancerAI](https://img.shields.io/badge/ScancerAI-Medical%20Imaging%20Analysis-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Nixpacks](https://img.shields.io/badge/Nixpacks-Ready-blueviolet)

ScancerAI is an AI-powered medical imaging analysis application that helps radiologists and clinicians diagnose faster and more accurately.

## 🚀 Features

ScancerAI delivers powerful tools to enhance medical imaging workflows and improve diagnostic accuracy:

- **Advanced DICOM Viewer**: Browser-based visualization of medical images with tools for zooming, panning, and measurements
- **AI Analysis**: Automated detection of abnormalities with bounding boxes and confidence scores
- **Structured Reporting**: AI-assisted report generation with findings that can be approved or rejected
- **Team Collaboration**: Share studies and findings with colleagues directly on the platform
- **Multi-modality Support**: Compatible with X-ray, CT scan, MRI, and other imaging modalities

## 🏥 Key Components

- **Dashboard**: View statistics, analytics, and access recent studies
- **DICOM Viewer**: Visualize and analyze medical images with specialized tools
- **Study Analysis**: AI-driven insights and automated findings detection
- **Upload Interface**: Easy DICOM file upload and management with demo options

## 🔧 Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **UI**: Tailwind CSS with Shadcn UI and Radix UI components
- **State Management**: React Hooks and Context API, nuqs for URL state
- **DICOM Processing**: Cornerstone libraries for medical imaging visualization
- **Styling**: Mobile-first responsive design with Tailwind
- **Deployment**: Nixpacks for simplified, reproducible builds and deployments

## 🖥️ DICOM Viewer Implementation

The application features a dual-implementation approach for DICOM viewing:

### Legacy Cornerstone Integration
- Provides stable visualization of medical images
- Includes fallback mechanisms for browser compatibility issues
- Implements custom canvas rendering when standard methods fail

### Modern Cornerstone3D Viewer (Beta)
- Next-generation 3D-capable viewer built on Cornerstone3D toolkit
- Enhanced performance and capabilities
- Users can switch between viewers using the toggle in the interface

## 🚦 Getting Started

### Development Setup

First, run the development server:

```bash
# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Deployment with Nixpacks

This project is configured for deployment using [Nixpacks](https://nixpacks.com/). Nixpacks automatically detects the project type, builds an optimized container image, and runs the application.

- **Prerequisites**: Ensure your deployment platform supports Nixpacks (e.g., Railway, Fly.io) or you have Nixpacks CLI installed locally.
- **Configuration**: A `nixpacks.toml` file is included to specify the start command: `yarn start -p $PORT`. Nixpacks will use the port provided by the `$PORT` environment variable.
- **Build & Deploy**:
  - If your hosting provider has native Nixpacks support, deployment is usually as simple as connecting your Git repository.
  - For local builds or other platforms, you can use the Nixpacks CLI:
    ```bash
    nixpacks build . --name scancerai-app
    docker run -d --name scancerai-app -p 3000:$PORT -e PORT=3000 scancerai-app
    ```
    (Adjust port mapping and environment variables as needed for your setup.)

Nixpacks handles the build process, including installing dependencies specified in `package.json` and running the `build` script.

## 📁 Project Structure

```
scancerai/
├── app/                    # Next.js App Router directory
│   ├── components/         # Reusable UI components
│   │   ├── dicom-viewer/   # DICOM visualization components
│   │   ├── layout/         # Layout components (header, etc.)
│   │   └── ui/             # Shadcn UI components
│   ├── dashboard/          # Dashboard page
│   ├── studies/            # Studies viewing and management
│   ├── upload/             # DICOM file upload interface
│   └── page.tsx            # Home page
├── lib/                    # Utility functions
├── public/                 # Static assets
├── next.config.mjs         # Next.js configuration (ESM)
├── eslint.config.mjs       # ESLint configuration (ESM)
├── nixpacks.toml           # Nixpacks configuration
└── README.md               # Project documentation
```

## 📱 User Interface

ScancerAI features a modern, responsive interface built with Shadcn UI and Tailwind CSS:

- **Dashboard**: Analytics, recent studies, and quick access to tools
- **Studies View**: DICOM viewer with AI analysis and reporting tools
- **Upload Interface**: File upload with drag-and-drop and demo options
- **Mobile Support**: Responsive design with optimized mobile viewing

## 🔄 Contributing

Contributions to ScancerAI are welcome! Please feel free to submit a Pull Request.

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Nixpacks Documentation](https://nixpacks.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Cornerstone Libraries](https://cornerstonejs.org)

## 🚀 General Deployment Advice

Beyond Nixpacks, you can also consider:

1.  **Vercel**: The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.
2.  **Other Node.js Hosting**: Deploy to any platform that supports Node.js applications by building the app (`yarn build`) and running the start command (`yarn start -p $PORT`).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on various deployment strategies.

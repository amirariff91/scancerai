# ScancerAI

![ScancerAI](https://img.shields.io/badge/ScancerAI-Medical%20Imaging%20Analysis-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

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

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **UI**: Tailwind CSS with Shadcn UI and Radix UI components
- **State Management**: React Hooks and Context API
- **DICOM Processing**: Cornerstone libraries for medical imaging visualization
- **Styling**: Mobile-first responsive design with Tailwind
- **Deployment**: Docker containerization for easy deployment

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

### Docker Deployment

ScancerAI can be deployed using Docker for production environments:

#### Option 1: Using Docker Compose (Recommended)

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

#### Option 2: Using the Deployment Script

```bash
# Make the script executable
chmod +x docker-deploy.sh

# Run the deployment script
./docker-deploy.sh
```

#### Option 3: Manual Docker Commands

```bash
# Build the Docker image
docker build -t scancerai:latest .

# Run the container
docker run -d --name scancerai-app -p 3000:3000 scancerai:latest
```

For detailed deployment instructions, see [DOCKER-DEPLOYMENT.md](DOCKER-DEPLOYMENT.md)

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
├── next.config.js          # Next.js configuration
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
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
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Cornerstone Libraries](https://cornerstonejs.org)
- [Docker Documentation](https://docs.docker.com)

## 🚀 Deployment

The application can be deployed in multiple ways:

1. **Docker**: Using the provided Dockerfile and docker-compose.yml (see above)
2. **Vercel**: The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js
3. **Custom Hosting**: Deploy to any platform that supports Node.js applications

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

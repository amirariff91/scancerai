This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## ScancerAI Features

ScancerAI is an AI-powered medical imaging analysis application that helps radiologists and clinicians diagnose faster and more accurately.

### Key components:

- **Dashboard**: View statistics and recent studies
- **DICOM Viewer**: Visualize and analyze medical images
- **Study Analysis**: AI-driven insights and findings
- **Upload Interface**: Easy DICOM file upload and management

## DICOM Viewer Migration

The application is currently undergoing a migration from legacy Cornerstone libraries to the modern Cornerstone3D toolkit.

### Migration Strategy

We're using a gradual approach to migrate:

1. **Dual Implementation**: Both legacy and modern components exist simultaneously
2. **User Toggle**: Users can switch between viewers to compare functionality
3. **Gradual Adoption**: We're collecting feedback before fully migrating
4. **Modern Architecture**: The new viewer uses React hooks, modern tooling, and better error handling

### Testing the New Viewer

When viewing a study, look for the "Try Cornerstone3D (Beta)" toggle to experience the new viewer.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

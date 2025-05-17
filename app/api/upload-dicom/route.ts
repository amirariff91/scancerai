import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises'; // For file system operations
import path from 'path'; // For path manipulation

// Ensure the uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadsDirExists() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch (error) {
    // Directory does not exist, create it
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    console.log(`Created uploads directory: ${UPLOADS_DIR}`);
  }
}

export async function POST(request: NextRequest) {
  await ensureUploadsDirExists(); // Ensure directory exists before attempting to write

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[]; // Assuming input name is 'files'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files were uploaded.' }, { status: 400 });
    }

    const studyId = uuidv4();
    const uploadedFilePaths: string[] = [];

    console.log(`Received ${files.length} file(s) for new study ID: ${studyId}`);

    for (const file of files) {
      console.log(`Processing file: ${file.name}, Size: ${file.size}, Type: ${file.type}`);
      
      // Sanitize filename (basic example)
      const safeFilename = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = path.join(UPLOADS_DIR, studyId, safeFilename);
      const studyDir = path.join(UPLOADS_DIR, studyId);

      // Ensure study-specific directory exists
      try {
        await fs.access(studyDir);
      } catch {
        await fs.mkdir(studyDir, { recursive: true });
      }

      // Convert File to Buffer and write to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);
      console.log(`File saved to: ${filePath}`);
      uploadedFilePaths.push(`/uploads/${studyId}/${safeFilename}`); // Store relative path for client access
    }

    // Here you would typically save metadata (studyId, filePaths, etc.) to a database
    // For now, we just return the studyId and the paths
    return NextResponse.json({ 
      message: 'Files uploaded successfully!', 
      studyId,
      filePaths: uploadedFilePaths 
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing file upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Error processing request.', details: errorMessage }, { status: 500 });
  }
} 
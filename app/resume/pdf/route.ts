import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // Read the PDF file from the public directory
    const pdfPath = join(process.cwd(), 'public', 'Will_Whitehead_Resume.pdf');
    const pdfBuffer = await readFile(pdfPath);

    // Return the PDF with appropriate headers for download
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Will_Whitehead_Resume.pdf"',
      },
    });
  } catch (error) {
    console.error('Error serving PDF:', error);
    return new NextResponse('PDF not found', { status: 404 });
  }
}


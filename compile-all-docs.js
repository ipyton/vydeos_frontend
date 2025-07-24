const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function mergePDFs() {
  // Paths to input PDFs
  const docsDir = path.join(__dirname, 'docs');
  const outputPath = path.join(docsDir, 'complete-documentation.pdf');
  
  const pdfFiles = [
    path.join(docsDir, 'project-overview.pdf'),
    path.join(docsDir, 'api-documentation.pdf'),
    path.join(docsDir, 'user-guide.pdf'),
    path.join(docsDir, 'component-documentation.pdf'),
    path.join(docsDir, 'deployment-guide.pdf'),
    path.join(docsDir, 'development-guide.pdf'),
    path.join(docsDir, 'architecture-documentation.pdf')
  ];

  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();
  
  console.log('Starting PDF merge...');

  // Add each PDF to the new document
  for (const pdfPath of pdfFiles) {
    if (!fs.existsSync(pdfPath)) {
      console.error(`File not found: ${pdfPath}`);
      continue;
    }
    
    try {
      console.log(`Processing: ${path.basename(pdfPath)}`);
      
      // Read the PDF file
      const pdfBytes = fs.readFileSync(pdfPath);
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Get all pages from the document
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      
      // Add each page to the new document
      pages.forEach(page => {
        mergedPdf.addPage(page);
      });
      
      console.log(`Added ${pages.length} pages from ${path.basename(pdfPath)}`);
    } catch (error) {
      console.error(`Error processing ${pdfPath}: ${error.message}`);
    }
  }

  // Save the merged PDF
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedPdfBytes);

  console.log(`Merged PDF saved to ${outputPath}`);
}

// Execute the merge function
mergePDFs().catch(error => {
  console.error('Error merging PDFs:', error);
}); 
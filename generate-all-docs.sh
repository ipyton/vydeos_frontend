#!/bin/bash

# Generate documentation script
echo "Starting documentation generation process..."

# Generate diagrams
echo "Generating architecture diagrams..."
node architecture-diagram.js

# Generate individual PDF documents
echo "Generating individual PDF documentation files..."
node docs-generator.js

# Compile all PDFs into a single document
echo "Compiling all documentation into a single PDF file..."
node compile-all-docs.js

echo "Documentation generation complete!"
echo "All documentation files are available in the docs/ directory."
echo "Complete documentation is available at docs/complete-documentation.pdf" 
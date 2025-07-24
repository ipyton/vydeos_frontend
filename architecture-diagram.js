const fs = require('fs');
const path = require('path');

// Create a directory for diagrams if it doesn't exist
const diagramsDir = path.join(__dirname, 'docs', 'diagrams');
if (!fs.existsSync(diagramsDir)) {
  fs.mkdirSync(diagramsDir, { recursive: true });
}

// Architecture diagram content in SVG format
const architectureDiagram = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gradient definitions -->
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6c8ebf;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4572c4;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#d4e1f5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b1c5e7;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f8cecc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ea6b66;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#d5e8d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#97d077;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="600" fill="#ffffff" />
  
  <!-- Title -->
  <text x="400" y="40" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">
    React Web Application Architecture
  </text>
  
  <!-- Client-Side Components -->
  <rect x="100" y="80" width="600" height="400" rx="10" ry="10" fill="#f5f5f5" stroke="#666666" stroke-width="2" />
  <text x="400" y="100" font-family="Arial" font-size="16" text-anchor="middle" font-weight="bold">
    Frontend Application
  </text>
  
  <!-- UI Components -->
  <rect x="130" y="120" width="260" height="140" rx="5" ry="5" fill="url(#grad2)" stroke="#666666" stroke-width="1" />
  <text x="260" y="140" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">
    UI Components
  </text>
  <rect x="150" y="150" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="200" y="170" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Auth Components
  </text>
  <rect x="270" y="150" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="320" y="170" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Content Components
  </text>
  <rect x="150" y="190" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="200" y="210" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Header/Footer
  </text>
  <rect x="270" y="190" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="320" y="210" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Animation Components
  </text>
  
  <!-- State Management -->
  <rect x="410" y="120" width="260" height="140" rx="5" ry="5" fill="url(#grad2)" stroke="#666666" stroke-width="1" />
  <text x="540" y="140" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">
    State Management
  </text>
  <rect x="430" y="150" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="480" y="170" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Redux Store
  </text>
  <rect x="550" y="150" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="600" y="170" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Context API
  </text>
  <rect x="430" y="190" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="480" y="210" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Auth Slice
  </text>
  <rect x="550" y="190" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="600" y="210" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Chat Session
  </text>
  
  <!-- Utilities -->
  <rect x="130" y="270" width="260" height="100" rx="5" ry="5" fill="url(#grad2)" stroke="#666666" stroke-width="1" />
  <text x="260" y="290" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">
    Utilities
  </text>
  <rect x="150" y="300" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="200" y="320" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    API Client
  </text>
  <rect x="270" y="300" width="100" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="320" y="320" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Auth Utils
  </text>
  
  <!-- Routing -->
  <rect x="410" y="270" width="260" height="100" rx="5" ry="5" fill="url(#grad2)" stroke="#666666" stroke-width="1" />
  <text x="540" y="290" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">
    Routing
  </text>
  <rect x="430" y="300" width="220" height="30" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="540" y="320" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    React Router
  </text>
  
  <!-- External Services -->
  <rect x="130" y="380" width="540" height="80" rx="5" ry="5" fill="url(#grad4)" stroke="#666666" stroke-width="1" />
  <text x="400" y="400" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">
    External Services
  </text>
  <rect x="150" y="410" width="100" height="30" rx="5" ry="5" fill="url(#grad3)" stroke="#666666" stroke-width="1" />
  <text x="200" y="430" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    REST API
  </text>
  <rect x="270" y="410" width="100" height="30" rx="5" ry="5" fill="url(#grad3)" stroke="#666666" stroke-width="1" />
  <text x="320" y="430" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    WebSockets
  </text>
  <rect x="390" y="410" width="100" height="30" rx="5" ry="5" fill="url(#grad3)" stroke="#666666" stroke-width="1" />
  <text x="440" y="430" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Auth Services
  </text>
  <rect x="510" y="410" width="140" height="30" rx="5" ry="5" fill="url(#grad3)" stroke="#666666" stroke-width="1" />
  <text x="580" y="430" font-family="Arial" font-size="12" text-anchor="middle" fill="white">
    Storage Services
  </text>
  
  <!-- Legend -->
  <rect x="280" y="500" width="240" height="80" rx="5" ry="5" fill="#f5f5f5" stroke="#666666" stroke-width="1" />
  <text x="400" y="520" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">
    Legend
  </text>
  
  <!-- Legend Items -->
  <rect x="300" y="530" width="20" height="15" fill="url(#grad2)" stroke="#666666" stroke-width="1" />
  <text x="330" y="542" font-family="Arial" font-size="12" text-anchor="start">Component Group</text>
  
  <rect x="300" y="550" width="20" height="15" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="330" y="562" font-family="Arial" font-size="12" text-anchor="start">Individual Component</text>
  
  <rect x="440" y="530" width="20" height="15" fill="url(#grad4)" stroke="#666666" stroke-width="1" />
  <text x="470" y="542" font-family="Arial" font-size="12" text-anchor="start">Integration Layer</text>
  
  <rect x="440" y="550" width="20" height="15" fill="url(#grad3)" stroke="#666666" stroke-width="1" />
  <text x="470" y="562" font-family="Arial" font-size="12" text-anchor="start">External Service</text>
</svg>
`;

// Write the SVG diagram to a file
fs.writeFileSync(path.join(diagramsDir, 'architecture-diagram.svg'), architectureDiagram);
console.log('Architecture diagram generated successfully!');

// Generate component hierarchy diagram
const componentHierarchyDiagram = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6c8ebf;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4572c4;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="#ffffff" />
  
  <!-- Title -->
  <text x="400" y="40" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">
    Component Hierarchy
  </text>

  <!-- Root Component: App -->
  <rect x="350" y="70" width="100" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="2" />
  <text x="400" y="95" font-family="Arial" font-size="14" text-anchor="middle" fill="white">App</text>
  
  <!-- First level components -->
  <rect x="150" y="150" width="140" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="220" y="175" font-family="Arial" font-size="14" text-anchor="middle" fill="white">AccountIssue</text>

  <rect x="350" y="150" width="100" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="400" y="175" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Contents</text>
  
  <rect x="510" y="150" width="140" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="580" y="175" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Error Components</text>
  
  <!-- Connect App to first level -->
  <line x1="400" y1="110" x2="220" y2="150" stroke="#666666" stroke-width="1" />
  <line x1="400" y1="110" x2="400" y2="150" stroke="#666666" stroke-width="1" />
  <line x1="400" y1="110" x2="580" y2="150" stroke="#666666" stroke-width="1" />
  
  <!-- Second level components for AccountIssue -->
  <rect x="100" y="230" width="80" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="140" y="255" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Login</text>
  
  <rect x="190" y="230" width="80" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="230" y="255" font-family="Arial" font-size="14" text-anchor="middle" fill="white">SignUp</text>
  
  <rect x="280" y="230" width="80" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="320" y="255" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Forget</text>
  
  <!-- Connect AccountIssue to second level -->
  <line x1="220" y1="190" x2="140" y2="230" stroke="#666666" stroke-width="1" />
  <line x1="220" y1="190" x2="230" y2="230" stroke="#666666" stroke-width="1" />
  <line x1="220" y1="190" x2="320" y2="230" stroke="#666666" stroke-width="1" />
  
  <!-- Second level components for Contents -->
  <rect x="370" y="230" width="80" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="410" y="255" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Header</text>
  
  <rect x="460" y="230" width="80" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="500" y="255" font-family="Arial" font-size="14" text-anchor="middle" fill="white">Videos</text>
  
  <!-- Connect Contents to second level -->
  <line x1="400" y1="190" x2="410" y2="230" stroke="#666666" stroke-width="1" />
  <line x1="400" y1="190" x2="500" y2="230" stroke="#666666" stroke-width="1" />
  
  <!-- Second level components for Error Components -->
  <rect x="550" y="230" width="120" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="610" y="255" font-family="Arial" font-size="14" text-anchor="middle" fill="white">NetworkError</text>
  
  <!-- Connect Error Components to second level -->
  <line x1="580" y1="190" x2="610" y2="230" stroke="#666666" stroke-width="1" />
  
  <!-- Third level components for Header -->
  <rect x="330" y="310" width="160" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="410" y="335" font-family="Arial" font-size="14" text-anchor="middle" fill="white">SearchAndSuggestion</text>
  
  <!-- Connect Header to third level -->
  <line x1="410" y1="270" x2="410" y2="310" stroke="#666666" stroke-width="1" />
  
  <!-- Third level components for Videos -->
  <rect x="500" y="310" width="80" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="540" y="335" font-family="Arial" font-size="14" text-anchor="middle" fill="white">VideoList</text>
  
  <!-- Connect Videos to third level -->
  <line x1="500" y1="270" x2="540" y2="310" stroke="#666666" stroke-width="1" />
  
  <!-- Fourth level components for SearchAndSuggestion -->
  <rect x="300" y="390" width="100" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="350" y="415" font-family="Arial" font-size="12" text-anchor="middle" fill="white">SuggestionItem</text>
  
  <rect x="410" y="390" width="140" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="480" y="415" font-family="Arial" font-size="12" text-anchor="middle" fill="white">SuggestionCategories</text>
  
  <!-- Connect SearchAndSuggestion to fourth level -->
  <line x1="410" y1="350" x2="350" y2="390" stroke="#666666" stroke-width="1" />
  <line x1="410" y1="350" x2="480" y2="390" stroke="#666666" stroke-width="1" />
  
  <!-- Fourth level components for VideoList -->
  <rect x="560" y="390" width="120" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="620" y="415" font-family="Arial" font-size="12" text-anchor="middle" fill="white">VideoCardRow</text>
  
  <!-- Connect VideoList to fourth level -->
  <line x1="540" y1="350" x2="620" y2="390" stroke="#666666" stroke-width="1" />
  
  <!-- Fifth level components for VideoCardRow -->
  <rect x="580" y="470" width="80" height="40" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="620" y="495" font-family="Arial" font-size="12" text-anchor="middle" fill="white">VideoCard</text>
  
  <!-- Connect VideoCardRow to fifth level -->
  <line x1="620" y1="430" x2="620" y2="470" stroke="#666666" stroke-width="1" />
  
  <!-- Legend -->
  <rect x="50" y="510" width="200" height="70" rx="5" ry="5" fill="#f5f5f5" stroke="#666666" stroke-width="1" />
  <text x="150" y="530" font-family="Arial" font-size="14" text-anchor="middle" font-weight="bold">Component Legend</text>
  <rect x="70" y="540" width="20" height="15" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="100" y="552" font-family="Arial" font-size="12" text-anchor="start" dominant-baseline="middle">React Component</text>
  <line x1="70" y1="570" x2="90" y2="570" stroke="#666666" stroke-width="1" />
  <text x="100" y="570" font-family="Arial" font-size="12" text-anchor="start" dominant-baseline="middle">Component Relationship</text>
</svg>
`;

// Write the component hierarchy diagram to a file
fs.writeFileSync(path.join(diagramsDir, 'component-hierarchy.svg'), componentHierarchyDiagram);
console.log('Component hierarchy diagram generated successfully!');

// Generate data flow diagram
const dataFlowDiagram = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6c8ebf;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4572c4;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f8cecc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ea6b66;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#d5e8d4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#97d077;stop-opacity:1" />
    </linearGradient>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#666" />
    </marker>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="#ffffff" />
  
  <!-- Title -->
  <text x="400" y="40" font-family="Arial" font-size="24" text-anchor="middle" font-weight="bold">
    Application Data Flow
  </text>

  <!-- User Interaction -->
  <rect x="300" y="80" width="200" height="60" rx="5" ry="5" fill="#f5f5f5" stroke="#666666" stroke-width="2" />
  <text x="400" y="120" font-family="Arial" font-size="16" text-anchor="middle">User Interaction</text>
  
  <!-- Components -->
  <rect x="100" y="200" width="200" height="60" rx="5" ry="5" fill="url(#grad1)" stroke="#666666" stroke-width="1" />
  <text x="200" y="240" font-family="Arial" font-size="16" text-anchor="middle" fill="white">React Components</text>
  
  <!-- Actions -->
  <rect x="500" y="200" width="200" height="60" rx="5" ry="5" fill="url(#grad2)" stroke="#666666" stroke-width="1" />
  <text x="600" y="240" font-family="Arial" font-size="16" text-anchor="middle" fill="white">Actions</text>
  
  <!-- Reducers -->
  <rect x="500" y="320" width="200" height="60" rx="5" ry="5" fill="url(#grad3)" stroke="#666666" stroke-width="1" />
  <text x="600" y="360" font-family="Arial" font-size="16" text-anchor="middle" fill="white">Reducers</text>
  
  <!-- Redux Store -->
  <rect x="300" y="320" width="160" height="60" rx="5" ry="5" fill="#d4e1f5" stroke="#666666" stroke-width="1" />
  <text x="380" y="360" font-family="Arial" font-size="16" text-anchor="middle">Redux Store</text>
  
  <!-- API Client -->
  <rect x="100" y="440" width="200" height="60" rx="5" ry="5" fill="#ffcc99" stroke="#666666" stroke-width="1" />
  <text x="200" y="480" font-family="Arial" font-size="16" text-anchor="middle">API Client</text>
  
  <!-- Backend Services -->
  <rect x="500" y="440" width="200" height="60" rx="5" ry="5" fill="#ffe6cc" stroke="#666666" stroke-width="1" />
  <text x="600" y="480" font-family="Arial" font-size="16" text-anchor="middle">Backend Services</text>
  
  <!-- Connect the boxes with arrows -->
  <!-- User -> Components -->
  <line x1="400" y1="140" x2="200" y2="200" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="270" y="180" font-family="Arial" font-size="12" text-anchor="middle">Events</text>
  
  <!-- Components -> Actions -->
  <line x1="300" y1="230" x2="500" y2="230" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="400" y="220" font-family="Arial" font-size="12" text-anchor="middle">Dispatch</text>
  
  <!-- Actions -> Reducers -->
  <line x1="600" y1="260" x2="600" y2="320" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="620" y="290" font-family="Arial" font-size="12" text-anchor="middle">Process</text>
  
  <!-- Reducers -> Store -->
  <line x1="500" y1="350" x2="460" y2="350" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="480" y="370" font-family="Arial" font-size="12" text-anchor="middle">Update</text>
  
  <!-- Store -> Components -->
  <line x1="300" y1="350" x2="200" y2="260" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="220" y="320" font-family="Arial" font-size="12" text-anchor="middle">Subscribe</text>
  
  <!-- Components -> API Client -->
  <line x1="200" y1="260" x2="200" y2="440" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="220" y="350" font-family="Arial" font-size="12" text-anchor="middle">Call</text>
  
  <!-- API Client -> Backend -->
  <line x1="300" y1="470" x2="500" y2="470" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="400" y="490" font-family="Arial" font-size="12" text-anchor="middle">HTTP Request</text>
  
  <!-- Backend -> API Client -->
  <line x1="500" y1="450" x2="300" y2="450" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" />
  <text x="400" y="430" font-family="Arial" font-size="12" text-anchor="middle">HTTP Response</text>
  
  <!-- API Client -> Actions -->
  <line x1="250" y1="440" x2="550" y2="260" stroke="#666666" stroke-width="1.5" marker-end="url(#arrow)" stroke-dasharray="5,5" />
  <text x="400" y="350" font-family="Arial" font-size="12" text-anchor="middle">Dispatch result actions</text>
</svg>
`;

// Write the data flow diagram to a file
fs.writeFileSync(path.join(diagramsDir, 'data-flow-diagram.svg'), dataFlowDiagram);
console.log('Data flow diagram generated successfully!'); 
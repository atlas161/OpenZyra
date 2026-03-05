const fs = require('fs');
const path = require('path');

const OVH_BASE_PATH = path.join(__dirname, '..', 'OVHdownload', 'Mes_Releves_Telephonie');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'ovh-manifest.json');

function generateManifest() {
  const groups = [];
  
  try {
    const entries = fs.readdirSync(OVH_BASE_PATH, { withFileTypes: true });
    const directories = entries.filter(e => e.isDirectory());
    
    for (const dir of directories) {
      const groupPath = path.join(OVH_BASE_PATH, dir.name);
      const files = fs.readdirSync(groupPath);
      
      // Find inventory file
      const inventoryFile = files.find(f => f.startsWith('inventory_') && f.endsWith('.json'));
      
      // Read inventory to extract line info
      let linesSip = [];
      let linesNdi = [];
      let linesFax = [];
      
      if (inventoryFile) {
        try {
          const inventoryPath = path.join(groupPath, inventoryFile);
          const inventoryContent = fs.readFileSync(inventoryPath, 'utf-8');
          const inventory = JSON.parse(inventoryContent);
          
          linesSip = (inventory.lines_sip || []).map((l) => ({
            serviceName: l.serviceName,
            description: l.description,
            type: 'SIP'
          }));
          
          linesNdi = (inventory.lines_ndi || []).map((l) => ({
            serviceName: l.serviceName,
            description: l.description,
            type: 'NDI'
          }));
          
          linesFax = (inventory.lines_fax || []).map((l) => ({
            serviceName: l.serviceName,
            description: l.description,
            type: 'FAX'
          }));
        } catch (e) {
          console.error(`Error reading inventory for ${dir.name}:`, e.message);
        }
      }
      
      // Find all CSV files and extract months
      const csvFiles = files.filter(f => f.endsWith('.received.csv'));
      const months = csvFiles.map(fileName => {
        const match = fileName.match(/(\d{4})-(\d{2})-\d{2}\.received\.csv$/);
        if (match) {
          return {
            year: parseInt(match[1]),
            month: parseInt(match[2]),
            label: new Date(parseInt(match[1]), parseInt(match[2]) - 1).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
            fileName: fileName,
            filePath: path.join(groupPath, fileName).replace(/\\/g, '/')
          };
        }
        return null;
      }).filter(Boolean).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
      
      groups.push({
        name: dir.name,
        path: groupPath.replace(/\\/g, '/'),
        inventoryPath: inventoryFile ? path.join(groupPath, inventoryFile).replace(/\\/g, '/') : null,
        linesSip,
        linesNdi,
        linesFax,
        months,
        totalFiles: csvFiles.length
      });
    }
    
    // Sort groups by name
    groups.sort((a, b) => a.name.localeCompare(b.name));
    
    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write manifest
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ groups, generatedAt: new Date().toISOString() }, null, 2));
    
    console.log(`✅ Generated OVH manifest with ${groups.length} groups`);
    console.log(`📁 Output: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error generating manifest:', error.message);
    process.exit(1);
  }
}

generateManifest();

import { parse } from 'react-docgen-typescript';
import { ensureDirSync, writeJSONSync } from 'fs-extra';
import { join } from 'path';

// Read file names
const sourcePath = join(__dirname, '../components');

// Parse files for docgen info
const propTypes = parse(join(sourcePath, 'props-simulations.tsx'), { savePropValueAsString: true });

// Write docgen info into a JSON file
const targetPath = join(__dirname, '../.docgen');
ensureDirSync(targetPath);
writeJSONSync(join(targetPath, 'docgen.json'), propTypes, { spaces: 2 });

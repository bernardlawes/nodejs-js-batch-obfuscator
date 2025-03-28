const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const sourceDir = './assets/js-unlocked/';      // Directory with original files
const outputDir = './assets/js';                // Directory for obfuscated files
const fileExtensions = ['.js'];                 // File extensions to obfuscate
const filePrefix= 'dist-';               // Prefixto add before extension

// Obfuscation options
const obfuscationOptions = {
    /*
    'compact': true,
    'control-flow-flattening': true,
    'control-flow-flattening-threshold': 0.4,
    'dead-code-injection': true,
    'dead-code-injection-threshold': 0.2,
    'debug-protection': true,
    'debug-protection-interval': 4000,
    'disable-console-output': true,
    'identifier-names-generator': 'hexadecimal',
    'log': false,
    'rename-globals': false,
    'self-defending': true,
    'split-strings': true,
    'split-strings-chunk-length': 10,
    'string-array': true,
    'string-array-encoding': 'base64',
    'string-array-threshold': 0.5,
    'string-array-rotate': true,
    'string-array-shuffle': true,
    'transform-object-keys': true,
    'unicode-escape-sequence': false
    */
    "compact": true,
    "control-flow-flattening": true,
    "control-flow-flattening-threshold": 0.1,
    "dead-code-injection": true,
    "dead-code-injection-threshold": 0.1,
    "debug-protection": true,
    'debug-protection-interval': 4000,
    "disable-console-output": true,
    "identifier-names-generator": "hexadecimal",
    "log": false,
    "rename-globals": false,
    "self-defending": true,
    "split-strings": true,
    "split-strings-chunk-length": 20,
    "string-array": true,
    "string-array-encoding": "base64",
    "string-array-threshold": 0.1,
    "string-array-rotate": true,
    "string-array-shuffle": true,
    "transform-object-keys": true,
    "unicode-escape-sequence": false
};

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Convert options object to command line arguments
function buildOptionsString(options) {
    return Object.entries(options)
        .map(([key, value]) => {
            // Handle array values
            if (Array.isArray(value)) {
                return `--${key} ${JSON.stringify(value)}`;
            }
            // Handle boolean and other values
            return `--${key} ${value}`;
        })
        .join(' ');
}

// Process a single file
function obfuscateFile(filePath) {
    const relativePath = path.relative(sourceDir, filePath);
    
    // Add prefix to filename before extension
    const parsedPath = path.parse(relativePath);
    const newFilename = filePrefix + parsedPath.name + parsedPath.ext;
    const relativePathWithPrefix= path.join(parsedPath.dir, newFilename);
    
    const outputPath = path.join(outputDir, relativePathWithPrefix);
    const outputDirName = path.dirname(outputPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDirName)) {
        fs.mkdirSync(outputDirName, { recursive: true });
    }
    
    // Build the command with options
    const optionsString = buildOptionsString(obfuscationOptions);
    const command = `javascript-obfuscator "${filePath}" --output "${outputPath}" ${optionsString}`;
    
    // Execute the command
    try {
        execSync(command, { stdio: 'pipe' });
        console.log(`Obfuscated: ${filePath} -> ${outputPath}`);
    } catch (error) {
        console.error(`Error obfuscating ${filePath}: ${error.message}`);
        if (error.stdout) console.error(`stdout: ${error.stdout.toString()}`);
        if (error.stderr) console.error(`stderr: ${error.stderr.toString()}`);
    }
}

// Process directory recursively
function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
            processDirectory(filePath);
        } else if (stats.isFile() && fileExtensions.includes(path.extname(filePath).toLowerCase())) {
            obfuscateFile(filePath);
        }
    }
}

// Start processing
console.log('Starting batch obfuscation...');
processDirectory(sourceDir);
console.log('Batch obfuscation completed!');
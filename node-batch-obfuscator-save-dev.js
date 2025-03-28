/* I would use this if I had installed javascript-obfuscator just as a dependency for my project 
   using : npm install javascript-obfuscator --save-dev (installs it as a project dependency in your local project folder)

   However, I used: npm install javascript-obfuscator -g installs the package globally, making the CLI command available system-wide

   */


const fs = require('fs');
const path = require('path');

// For local project dependent installed package
const JavaScriptObfuscator = require('javascript-obfuscator');

// Configuration
const sourceDir = './src';             // Directory with original files
const outputDir = './dist';            // Directory for obfuscated files
const fileExtensions = ['.js'];        // File extensions to obfuscate

// Obfuscation options
const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.7,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    shuffleStringArray: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.8,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Process a single file
function obfuscateFile(filePath) {
    const relativePath = path.relative(sourceDir, filePath);
    const outputPath = path.join(outputDir, relativePath);
    const outputDirName = path.dirname(outputPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDirName)) {
        fs.mkdirSync(outputDirName, { recursive: true });
    }
    
    // Read file content
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Obfuscate
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
    
    // Write obfuscated code to output file
    fs.writeFileSync(outputPath, obfuscationResult.getObfuscatedCode());
    
    console.log(`Obfuscated: ${filePath} -> ${outputPath}`);
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
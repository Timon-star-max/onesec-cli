#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { execSync, exec } = require('child_process');

const program = new Command();

program
  .version('1.0.0')
  .description('OneSec CLI for building and deploying Next.js apps')
  .command('build')
  .description('Build and process Next.js output')
  .action(() => {
    buildNextApp();
  });

program.parse(process.argv);

function buildNextApp() {
  try {
    // Run the Next.js build command
    execSync('npm run build', { stdio: 'inherit' });
    
    // Process the .next directory
    const nextDir = path.join(process.cwd(), '.next');
    const outputDir = path.join(process.cwd(), 'onesec');

    // Ensure the output directory exists
    fs.ensureDirSync(outputDir);

    // Copy static files
    fs.copySync(path.join(nextDir, 'static'), path.join(outputDir, 'frontend/static'));

    // Copy the backend files
    fs.copySync(path.join(nextDir, 'server'), path.join(outputDir, 'backend/server'));
    fs.copySync(path.join(nextDir, 'build-manifest.json'), path.join(outputDir, 'backend/build-manifest.json'));
    fs.copySync(path.join(nextDir, 'prerender-manifest.json'), path.join(outputDir, 'backend/prerender-manifest.json'));
    fs.copySync(path.join(nextDir, 'routes-manifest.json'), path.join(outputDir, 'backend/routes-manifest.json'));
    fs.copySync(path.join(nextDir, 'react-loadable-manifest.json'), path.join(outputDir, 'backend/react-loadable-manifest.json'));

    console.log('Build and processing complete. Output is in the onesec directory.');
  } catch (error) {
    console.error('Error during build:', error.message);
    if (error.stdout) {
      console.error('Build stdout:', error.stdout.toString());
    }
    if (error.stderr) {
      console.error('Build stderr:', error.stderr.toString());
    }
  }
}

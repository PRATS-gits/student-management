const ghpages = require('gh-pages');
const path = require('path');

// Define the build output directory
const buildDir = path.resolve(__dirname, 'dist/student-management-angular/browser');

// Configuration for the deployment
const options = {
  branch: 'gh-pages',       // Branch to deploy to
  repo: 'https://github.com/PRATS-gits/student-management.git',  // Updated repo URL
  message: 'Auto-generated commit [ci skip]',
  dotfiles: true,           // Include dotfiles
  silent: false,            // Show output
  add: false,               // Replace all content on the branch
  // Using git directly rather than NodeGit to avoid errors
  git: 'git',
  // Increase the maximum buffer size to avoid E2BIG error
  // This uses smaller commits with fewer files at once
  batchSize: 10
};

console.log('Starting deployment to GitHub Pages...');
console.log(`Deploying from: ${buildDir}`);

// Deploy the site
ghpages.publish(buildDir, options, function(err) {
  if (err) {
    console.error('Deployment error:', err);
    process.exit(1);
  } else {
    console.log('Deployment successful!');
    console.log('Your site should be available at: https://prats-gits.github.io/student-management/');
  }
});

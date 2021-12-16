/*jslint node */
/*globals */

// var { shelljs } = require('shelljs'); // for unix commands, not needed yet
var requirements = require('./requirements.js'); // defines the files this project requires
var options = require('./options.js').options; // options for argv
var spawn = require('cross-spawn'); // for spawning child processes like Jekyll across platforms
var helpers = require('./_helpers');

// Parse arguments when calling this script
var argv = require('yargs')(process.argv.slice(2))
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .options(options)
    .commandDir('./')
    .showHelpOnFail(true)
    .wrap(100)
    .argv;


// // Assembles epub in _site/epub
// function epubAssemble() {
//     'use strict';
//     console.log('Assembling epub...');
// }

// // Copies epub files into a compressed zip package correctly
// function epubPackage() {
//     'use strict';
//     console.log('Packaging epub...');
// }

// // Attempts to run the epub through epubcheck
// function epubValidate(path) {
//     'use strict';
//     console.log('Validating epub...');
// }

// // Exit
// function exit() {
//     'use strict';
//     console.log('Exiting...');
// }

// // Converts .html files to .docx with pandoc
// function exportWord() {
//     'use strict';
//     console.log('Exporting to Word...');
// }

// Kills child processes
// function killProcesses() {
//     'use strict';
//     console.log('Killing processes...');
// }

// // Starting place when -t output -f app
// function outputApp() {
//     'use strict';
//     console.log('Creating app...');
// }

// // Starting place when -t output -f epub
// function outputEpub() {
//     'use strict';
//     console.log('Creating epub...');
// }

// // Serve a website
// function outputWeb() {
//     'use strict';
//     console.log('Building website...');
// }

// // Export content
// function taskExport(sourceFormat, exportFormat) {
//     'use strict';
//     console.log('Exporting content...');
// }

// // Refresh the search index
// function taskIndex(format) {
//     'use strict';
//     console.log('Generating search index...');
// }

// Processes images with gulp if -t images
function taskImages(book, subdir) {
    'use strict';

    var gulpProcess = spawn(
        'gulp',
        ['--book', book, '--language', subdir]
    );
    helpers.logProcess(gulpProcess, 'gulp');
}

// Install Ruby and Node dependencies.
// To do: add checks for other Electric Book dependencies.
function taskInstall() {
    'use strict';

    console.log(
        'Running Bundler to install Ruby gem dependencies...\n' +
        'If you get errors, check that Bundler is installed (https://bundler.io).'
    );
    var bundleProcess = spawn(
        'bundle',
        ['install']
    );
    helpers.logProcess(bundleProcess, 'Bundler');

    console.log(
        'Running npm to install Node modules...\n' +
        'If you get errors, check that Node.js is installed (https://nodejs.org).'
    );
    var npmProcess = spawn(
        'npm',
        ['install']
    );
    logProcess(npmProcess, 'npm');
}

// Execution
// ---------

// TO DO: Move these to their own command files
// as already done with output.js.
// "check", "images", "index", "install", "export"

// Check that the project contains required files
if (argv.task === 'check') {
    requirements.check(argv.book);
}

// Process images
if (argv.task === 'images') {
    taskImages(argv.book, argv.subdir);
}

// Install dependencies
if (argv.task === 'install') {
    taskInstall();
}
// Lint with JS Standard

// Import Node modules
const cheerio = require('gulp-cheerio')
const debug = require('gulp-debug')
const del = require('del')
const gulp = require('gulp')
const iconv = require('iconv-lite')
const rename = require('gulp-rename')

// Local helpers
const { book } = require('../helpers/args.js')
const { paths } = require('../helpers/paths.js')

// Convert all file names in internal links from .html to .xhtml.
// This is required for epub output to avoid EPUBCheck warnings.
function epubXhtmlLinks (done) {
  'use strict'

  gulp.src([paths.epub.src,
    '_site/' + book + '/package.opf',
    '_site/' + book + '/toc.ncx'],
  { base: './' })
    .pipe(cheerio({
      run: function ($) {
        let target, asciiTarget, newTarget
        $('[href*=".html"], [src*=".html"], [id], [href^="#"]').each(function () {
          if ($(this).attr('href')) {
            target = $(this).attr('href')
          } else if ($(this).attr('src')) {
            target = $(this).attr('src')
          } else if ($(this).attr('id')) {
            target = $(this).attr('id')
          } else {
            return
          }

          // remove all non-ascii characters using iconv-lite
          // by converting the target from utf-8 to ascii.
          const iconvLiteBuffer = iconv.encode(target, 'utf-8')
          asciiTarget = iconv.decode(iconvLiteBuffer, 'ascii')
          // Note that this doesn't remove illegal characters,
          // which must then be replaced.
          // (See https://github.com/ashtuchkin/iconv-lite/issues/81)
          asciiTarget = asciiTarget.replace(/[�?]/g, '')

          if (!asciiTarget.includes('http')) {
            newTarget = asciiTarget.replace('.html', '.xhtml')
            if ($(this).attr('href')) {
              $(this).attr('href', newTarget)
            } else if ($(this).attr('src')) {
              $(this).attr('src', newTarget)
            } else if ($(this).attr('id')) {
              $(this).attr('id', newTarget)
            }
          }
        })
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(debug({ title: 'Converting internal links to .xhtml in ' }))
    .pipe(gulp.dest('./'))
  done()
}

// Rename epub .html files to .xhtml.
// Creates a copy of the file that must then be cleaned out
// with the subsequent gulp task `epubCleanHtmlFiles``
function epubXhtmlFiles (done) {
  'use strict'

  console.log('Renaming *.html to *.xhtml in ' + paths.epub.src)
  gulp.src(paths.epub.src)
    .pipe(debug({ title: 'Renaming ' }))
    .pipe(rename({
      extname: '.xhtml'
    }))
    .pipe(gulp.dest(paths.epub.dest))
  done()
}

// Clean out renamed .html files
function epubCleanHtmlFiles () {
  'use strict'
  console.log('Removing old *.html files in ' + paths.epub.src)
  return del(paths.epub.src)
}

exports.epubXhtmlLinks = epubXhtmlLinks
exports.epubXhtmlFiles = epubXhtmlFiles
exports.epubCleanHtmlFiles = epubCleanHtmlFiles
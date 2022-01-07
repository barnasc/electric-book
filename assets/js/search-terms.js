/*jslint browser, for */
/*globals window, locales, pageLanguage, Mark, settings */

// get query search term from GET query string
function getQueryVariable(variable) {
    'use strict';
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    var i, pair;
    for (i = 0; i < vars.length; i += 1) {
        pair = vars[i].split('=');

        if (pair[0] === variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
        }
    }
}

// Get some elements
var searchTerm = getQueryVariable('query'),
    searchBox = document.querySelectorAll('.search-box');

    // Fill the search boxes with the current search term
function fillSearchBox() {
    'use strict';
    if (searchTerm && searchBox) {
        // show the just-searched-term
        var j;
        for (j = 0; j < searchBox.length; j += 1) {
            searchBox[j].setAttribute("value", searchTerm);
        }
    }
}

// Check whether this is a search-page
function isSearchPage() {
    'use strict';
    var searchPageCheck = document.body.classList.contains('search-page');
    if (searchPageCheck) {
        return true;
    } else {
        return false;
    }
}

// Show a summary of search terms and jump-to-first link on destination page
function jumpToSearchResult() {
    'use strict';

    // add a summary before the first section
    var searchTerms = document.querySelectorAll('[data-markjs]');
    var numberOfSearchTerms = searchTerms.length;
    if (!!numberOfSearchTerms) {

        // console.log('Page contains searched terms');

        // make the summary paragraph
        var searchResultsSummary = document.createElement('div');
        searchResultsSummary.classList.add('search-results-summary');
        if (numberOfSearchTerms === 1) {
            searchResultsSummary.innerHTML = numberOfSearchTerms
                    + ' '
                    + locales[pageLanguage].search['results-for-singular']
                    + ' '
                    + '"<mark>'
                    + searchTerm
                    + '</mark>".';
        } else {
            searchResultsSummary.innerHTML = numberOfSearchTerms
                    + ' '
                    + locales[pageLanguage].search['results-for-plural']
                    + ' '
                    + '"<mark>'
                    + searchTerm
                    + '</mark>".';
        }

        // add it after the first heading
        var mainHeading = document.querySelector('#content h1, #content h2, #content h3, #content h4, #content h5, #content h6');
        var contentDiv = document.querySelector('#content');

        if (settings[settings.site.output].search.jumpBoxLocation
                && settings[settings.site.output].search.jumpBoxLocation !== 'mainheading'
                && document.querySelector(settings[settings.site.output].search.jumpBoxLocation)) {
            var insertJumpBoxAfter = document.querySelector(settings[settings.site.output].search.jumpBoxLocation);
            contentDiv.insertBefore(searchResultsSummary, insertJumpBoxAfter);
        } else if (mainHeading) {
            contentDiv.insertBefore(searchResultsSummary, mainHeading.nextSibling);
        } else {
            contentDiv.insertBefore(searchResultsSummary, contentDiv.firstChild);
        }

        // add a link to the first result
        searchTerms[0].id = 'first-search-result';
        searchResultsSummary.innerHTML += ' <a href="#first-search-result"> '
                + locales[pageLanguage].search['jump-to-first'] + '</a>.';

        return;
    }
}

// Ask mark.js to mark all the search terms.
// We mark both the searchTerm and the search-query stem
var markInstance = new Mark(document.querySelector("#wrapper"));
if (searchTerm || getQueryVariable('search_stem')) {

    // Create an array containing the search term
    // and the search stem to pass to mark.js
    var arrayToMark = [];

    // Add them to the array if they exist
    if (searchTerm) {
        arrayToMark.push(searchTerm);
    }
    if (getQueryVariable('search_stem')) {
        arrayToMark.push(getQueryVariable('search_stem'));
    }

    // Mark their instances on the page
    markInstance.unmark().mark(arrayToMark);
}

if (isSearchPage() === false) {
    jumpToSearchResult();
} else {
    fillSearchBox();
}

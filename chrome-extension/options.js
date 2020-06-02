'use strict';

let page = document.getElementById('page');

function print_tabs() {
  chrome.tabs.query({}, function(tabs) {
    chrome.storage.sync.set({tabs: tabs});
    let tabnames = [];
    tabs.forEach(tab => {
      tabnames.push(`<b>${tab.title}</b><br><a href="${tab.url}">${tab.url}</a>`);
    });
    let p = document.createElement('p');
    p.innerHTML = tabnames.join('<hr>');
    page.appendChild(p);
  })
}

print_tabs();
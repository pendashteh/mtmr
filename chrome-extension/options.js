'use strict';

function get_tabs(callback) {
  chrome.tabs.query({}, function(tabs) {
    // chrome.storage.sync.set({tabs: JSON.stringify(tabs)});
    callback(tabs)
  })
}

class output {
  constructor(html) {
    this.p = document.createElement('p');
  }
  add(html) {
    this.p.innerHTML += (html||'') + "\n";
  }
  done() {
    this.p.innerHTML = `<xmp>${this.p.innerHTML}</xmp>`;
    document.getElementById('page').appendChild(this.p);
  }
}

function format_json(tabs) {
    let o = new output();
    o.add(JSON.stringify(tabs, function(key, value) {
      return value
    }, 4));
    o.done();
    return
}

function format_md(tabs) {
  let o = new output();
  let urls=[];
  let currentWindowId=0;
  o.add(`Time: ${new Date().toLocaleString()}`);
  for (let tab of tabs) {
    if (currentWindowId != tab.windowId) {
      o.add()
      o.add(`Window #${tab.windowId}:`);
      currentWindowId = tab.windowId;
    }
    o.add(`- ${tab.title} [tab-${tab.id}][#${tab.id}]`);
    if (tab.openerTabId) {
      o.add(`-- opened by [tab-${tab.openerTabId}][#${tab.openerTabId}]`);
    }
  }
  o.add();
  o.add('---');
  o.add();
  for (let tab of tabs) {
    o.add(`[#${tab.id}]: ${tab.url}`);
  }
  o.done();
}

get_tabs(format_md);
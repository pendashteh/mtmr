'use strict';

function get_tabs(callback) {
  chrome.tabs.query({}, function(tabs) {
    // chrome.storage.sync.set({tabs: JSON.stringify(tabs)});
    callback(tabs)
  })
}

class output {
  constructor(clear=true) {
    this.p = document.createElement('p');
    this.body = document.getElementById('page');
    if (clear) {
      this.clear()
    }
  }
  clear() {
    this.body.innerHTML = '';
  }
  add(html) {
    this.p.innerHTML += (html||'') + "\n";
  }
  done() {
    this.p.innerHTML = `<xmp>${this.p.innerHTML}</xmp>`;
    this.body.appendChild(this.p);
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


function format_groups(tabs) {
  let o = new output();
  let urls=[];
  let currentWindowId=0;
  o.add(`Time: ${new Date().toLocaleString()}`);
  for (let tab of tabs) {
    if (currentWindowId != tab.windowId) {
      o.add()
      o.add(`Window #${tab.windowId}:`);
      currentWindowId = tab.windowId;
      o.add()
    }
    o.add(`[${tab.title}][#${tab.id}]`);
    o.add(`[#${tab.id}]: ${tab.url}`);
    // o.add(`${tab.title}`);
    // o.add(`${tab.url}`);
    o.add()
  }
  o.done();
}

function page_call(page) {
  switch (page) {
    case 'main':
      // @TODO populate windows in select
    break;
    case 'groups':
      get_tabs(format_groups);
    break;
    case 'export':
      get_tabs(format_md);
    break;
    case 'json':
      get_tabs(format_json);
    break;
    default:
  }
}


var anchor_click = function () {
  document.getElementById('menu').style.display='none';
  let page = this.getAttribute('data-page');
  page_call(page)
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('menu').style.display='block';
  var items = document.getElementsByTagName("a");
  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('click', anchor_click);
  }
});

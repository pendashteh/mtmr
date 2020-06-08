'use strict';

function get_tabs(callback) {
  chrome.tabs.query({}, function(tabs) {
    // chrome.storage.sync.set({tabs: JSON.stringify(tabs)});
    let tabsinfo = {};
    tabs.forEach(tab => {
      tabsinfo[tab.windowId] = tabsinfo[tab.windowId] || {tabs:[]};
      tabsinfo[tab.windowId].tabs.push(tab)
    });
    callback(tabsinfo)
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

function format_json(tabsinfo) {
    let o = new output();
    o.add(JSON.stringify(tabsinfo));
    o.done();
    return
}

function format_html(tabsinfo) {
  let o = new output();
  for (let winId in tabsinfo) {
    o.add('# Window #' + winId);
    for (let tab of tabsinfo[winId].tabs) {
      let status = [];
      let search_states = ['highlighted', 'active', 'pinned', 'audible', 'discarded'];
      for (let state of search_states) {
        tab[state] && status.push(state);
      }
      tab.openerTabId && status.push(`opened by #${tab.openerTabId}`);
      console.log(status)
      o.add(`## ${tab.index+1}. Tab #${tab.id} -- ${status.join(',')}`);
      o.add(`${tab.title}`);
      o.add(`${tab.url}`);
      for (let key of ['sessionId']) {
        o.add(tab[key]);
      }
      o.add(JSON.stringify(tab, function(key, value) {
        if (search_states.includes(key)) {
          return undefined;
        }
        if (key == 'url') {
          return undefined;
        }
        return value
      }));
      o.add();

    }
  }
  o.done()
}

get_tabs(format_html);
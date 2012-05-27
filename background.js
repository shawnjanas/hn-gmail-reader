gmailTabs = {}

chrome.tabs.getAllInWindow(null, function(tabs) {
  tabs.forEach(function(tab) {
    if(isGmailPage(tab.url)) {
      gmailTabs[tab.id] = gmailTabs[tab.id] || tab;
      console.log(gmailTabs);
      update(tab);
    }
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.status == "loading" && isGmailPage(tab.url)) {
    // Gmail page is loading. Store it.
    if(!gmailTabs[tabId]) {
      gmailTabs[tabId] = tab;
      update(tab);
    }
  }
});

chrome.extension.onRequest.addListener(function(req, sender, res) {
  if(req.type == 'loadHN') {
    loadHN(req.page || '', function(data) {
      res(data);
    });
  }
});

function update(tab) {
  chrome.tabs.executeScript(tab.id, {"file": "js/jquery.min.js"} );
  chrome.tabs.executeScript(tab.id, {"file": "hn-gmail.js"} );
}

function loadHN(page, callback) {
  if(page != '')
    page = '/'+page

  $.getJSON('http://api.ihackernews.com/page?format=jsonp&callback=?', callback);
}

function isGmailPage(url) {
  return url.match(/^https\:\/\/mail\.google\.com/);
}

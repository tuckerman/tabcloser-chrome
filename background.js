chrome.runtime.onInstalled.addListener(() => {
  const contextMenus = [
    { id: "closeOtherTabs", title: "Close Other Tabs" },
    { id: "closeOtherTabsSameWindow", title: "Close Other Tabs in Same Window" },
    { id: "closeOtherWindows", title: "Close Other Windows" },
    { id: "closeEverything", title: "Close Everything" }
  ];

  contextMenus.forEach(menu => {
    chrome.contextMenus.create({
      id: menu.id,
      title: menu.title,
      contexts: ["all"]
    });
  });
});


function isTabProtected(tab, callback) {
  chrome.storage.sync.get(["protectedUrls", "protectPinnedTabs"], (result) => {
    const protectedUrls = result.protectedUrls
      ? result.protectedUrls.split(",").map(url => url.trim())
      : [];
    const urlProtected = tab.url ? protectedUrls.some(protectedUrl => tab.url.includes(protectedUrl)) : false;
    const pinnedProtected = result.protectPinnedTabs && tab.pinned;
    callback(urlProtected || pinnedProtected);
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) return;
  if (info.menuItemId === "closeOtherTabs") {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(t => {
        if (t.id !== tab.id) {
          isTabProtected(t, (protected) => {
            if (!protected) {
              chrome.tabs.remove(t.id);
            }
          });
        }
      });
    });
  } else if (info.menuItemId === "closeOtherTabsSameWindow") {
    chrome.tabs.query({ windowId: tab.windowId }, (tabs) => {
      tabs.forEach(t => {
        if (t.id !== tab.id) {
          isTabProtected(t, (protected) => {
            if (!protected) {
              chrome.tabs.remove(t.id);
            }
          });
        }
      });
    });
  } else if (info.menuItemId === "closeOtherWindows") {
    chrome.windows.getAll({}, (windows) => {
      windows.forEach(w => {
        if (w.id !== tab.windowId) {
          chrome.windows.remove(w.id);
        }
      });
    });
  } else if (info.menuItemId === "closeEverything") {
    chrome.windows.getAll({}, (windows) => {
      windows.forEach(w => {
        chrome.windows.remove(w.id);
      });
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab) return;
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(t => {
      if (t.id !== tab.id) {
        isTabProtected(t, (protected) => {
          if (!protected) {
            chrome.tabs.remove(t.id);
          }
        });
      }
    });
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "closeOtherTabs") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        const activeTab = tabs[0];
        chrome.tabs.query({}, (allTabs) => {
          allTabs.forEach(t => {
            if (t.id !== activeTab.id) {
              isTabProtected(t, (protected) => {
                if (!protected) {
                  chrome.tabs.remove(t.id);
                }
              });
            }
          });
        });
      }
    });
  }
});

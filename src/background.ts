// Create context menus on extension installation
chrome.runtime.onInstalled.addListener(() => {
  const contextMenus: Array<{ id: string; title: string }> = [
    { id: "closeOtherTabs", title: "Close Other Tabs" },
    { id: "closeOtherTabsSameWindow", title: "Close Other Tabs (Same Window)" },
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

// Helper function: determines whether a tab should be protected
function isTabProtected(
  tab: chrome.tabs.Tab,
  callback: (isProtected: boolean) => void
): void {
  chrome.storage.sync.get(["protectedUrls", "protectPinnedTabs"], (result) => {
    const protectedUrls: string[] = result.protectedUrls
      ? result.protectedUrls.split(",").map((url: string) => url.trim())
      : [];
    const urlProtected = tab.url ? protectedUrls.some(pUrl => tab.url!.includes(pUrl)) : false;
    const pinnedProtected = result.protectPinnedTabs && tab.pinned;
    callback(urlProtected || pinnedProtected);
  });
}

// Context menu click handler
chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (!tab) return;

    if (info.menuItemId === "closeOtherTabs") {
      chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        tabs.forEach(t => {
          if (t.id !== tab.id) {
            isTabProtected(t, (isProtected) => {
              if (!isProtected && t.id !== undefined) {
                chrome.tabs.remove(t.id);
              }
            });
          }
        });
      });
    } else if (info.menuItemId === "closeOtherTabsSameWindow") {
      chrome.tabs.query({ windowId: tab.windowId }, (tabs: chrome.tabs.Tab[]) => {
        tabs.forEach(t => {
          if (t.id !== tab.id) {
            isTabProtected(t, (isProtected) => {
              if (!isProtected && t.id !== undefined) {
                chrome.tabs.remove(t.id);
              }
            });
          }
        });
      });
    } else if (info.menuItemId === "closeOtherWindows") {
      chrome.windows.getAll({}, (windows: chrome.windows.Window[]) => {
        windows.forEach(w => {
          if (w.id !== tab.windowId && w.id !== undefined) {
            chrome.windows.remove(w.id);
          }
        });
      });
    } else if (info.menuItemId === "closeEverything") {
      chrome.windows.getAll({}, (windows: chrome.windows.Window[]) => {
        windows.forEach(w => {
          if (w.id !== undefined) {
            chrome.windows.remove(w.id);
          }
        });
      });
    }
  }
);

// Action (toolbar icon) click handler
chrome.action.onClicked.addListener((tab?: chrome.tabs.Tab) => {
  if (!tab) return;
  chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
    tabs.forEach(t => {
      if (t.id !== tab.id) {
        isTabProtected(t, (isProtected) => {
          if (!isProtected && t.id !== undefined) {
            chrome.tabs.remove(t.id);
          }
        });
      }
    });
  });
});

// Command (keyboard shortcut) handler
chrome.commands.onCommand.addListener((command: string) => {
  if (command === "closeOtherTabs") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      if (tabs && tabs[0]) {
        const activeTab = tabs[0];
        chrome.tabs.query({}, (allTabs: chrome.tabs.Tab[]) => {
          allTabs.forEach(t => {
            if (t.id !== activeTab.id) {
              isTabProtected(t, (isProtected) => {
                if (!isProtected && t.id !== undefined) {
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

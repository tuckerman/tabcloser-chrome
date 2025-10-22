// background.ts
import { getOptions } from "./common.js";
import { minimatch } from "minimatch";

async function isTabProtected(tab: chrome.tabs.Tab): Promise<boolean> {
  const { protectedUrls, protectPinnedTabs, protectApps } = await getOptions();

  if (protectPinnedTabs && tab.pinned) {
    return true;
  }

  if (tab.url && protectedUrls.some(p => minimatch(tab.url!, p))) {
    return true;
  }

  if (protectApps && tab.windowId != null) {
    try {
      const win = await chrome.windows.get(tab.windowId);
      if (win.type === "app") return true;
    } catch {
      // ignored
    }
  }

  return false;
}

async function closeOtherTabs(active: chrome.tabs.Tab): Promise<void> {
  const all = await chrome.tabs.query({});
  for (const t of all) {
    if (!t.id || t.id === active.id) continue;
    if (!(await isTabProtected(t))) await chrome.tabs.remove(t.id);
  }
}

async function handleCloseOtherTabs(): Promise<void> {
  const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!active) return;
  await closeOtherTabs(active);
}

chrome.action.onClicked.addListener(handleCloseOtherTabs);
chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd === "closeOtherTabs") await handleCloseOtherTabs();
});

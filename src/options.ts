function loadOptions(): void {
  chrome.storage.sync.get(["protectedUrls", "protectPinnedTabs"], (result: { [key: string]: any }) => {
    const protectedUrls: string = result.protectedUrls || "";
    const protectPinnedTabs: boolean = result.protectPinnedTabs || false;

    const protectedUrlsElement = document.getElementById("protectedUrls") as HTMLTextAreaElement;
    const protectPinnedTabsElement = document.getElementById("protectPinnedTabs") as HTMLInputElement;

    if (protectedUrlsElement) protectedUrlsElement.value = protectedUrls;
    if (protectPinnedTabsElement) protectPinnedTabsElement.checked = protectPinnedTabs;
  });
}

function saveOptions(): void {
  const protectedUrlsElement = document.getElementById("protectedUrls") as HTMLTextAreaElement;
  const protectPinnedTabsElement = document.getElementById("protectPinnedTabs") as HTMLInputElement;

  const protectedUrls = protectedUrlsElement?.value || "";
  const protectPinnedTabs = protectPinnedTabsElement?.checked || false;

  chrome.storage.sync.set({ protectedUrls, protectPinnedTabs }, () => {
    alert("Options saved!");
  });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.getElementById("save")?.addEventListener("click", saveOptions);

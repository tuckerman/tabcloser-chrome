function loadOptions() {
  chrome.storage.sync.get(["protectedUrls", "protectPinnedTabs"], function(result) {
    document.getElementById("protectedUrls").value = result.protectedUrls || "";
    document.getElementById("protectPinnedTabs").checked = result.protectPinnedTabs || false;
  });
}

function saveOptions() {
  const protectedUrls = document.getElementById("protectedUrls").value;
  const protectPinnedTabs = document.getElementById("protectPinnedTabs").checked;
  chrome.storage.sync.set({ protectedUrls, protectPinnedTabs }, function() {
    alert("Options saved!");
  });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.getElementById("save").addEventListener("click", saveOptions);

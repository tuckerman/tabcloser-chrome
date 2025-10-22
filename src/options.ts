import { type Options, getOptions } from "./common.js";

function safeSplitUrls(urls: string): string[] {
  return String(urls ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector<HTMLFormElement>("#options")!;
  const opts = await getOptions();

  (form.elements.namedItem("protectedUrls") as HTMLTextAreaElement).value = opts.protectedUrls.join("\n");
  (form.elements.namedItem("protectPinnedTabs") as HTMLInputElement).checked = opts.protectPinnedTabs;
  (form.elements.namedItem("protectApps") as HTMLInputElement).checked = opts.protectApps;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const toSave: Options = {
      protectedUrls: safeSplitUrls(fd.get("protectedUrls") as string),
      protectPinnedTabs: fd.get("protectPinnedTabs") === "on",
      protectApps: fd.get("protectApps") === "on",
    };

    await chrome.storage.sync.set(toSave);

    const status = document.querySelector("#status")!;
    status.textContent = "Saved";
    setTimeout(() => (status.textContent = ""), 800);
  });
});

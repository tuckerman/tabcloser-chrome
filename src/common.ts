type Options = {
  protectedUrls: string[];
  protectPinnedTabs: boolean;
  protectApps: boolean;
}

const DEFAULTS: Options = {
  protectedUrls: [],
  protectPinnedTabs: false,
  protectApps: false,
}


async function getOptions(): Promise<Options> {
  return (await chrome.storage.sync.get(DEFAULTS)) as Options;
}

export { Options, DEFAULTS, getOptions };

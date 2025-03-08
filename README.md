# tabcloser-chrome

Easily manage having too many tabs.

## Using tabcloser

Clicking on the extension icon will close all other tabs across all windows. You can right click for different options.

Under the right click menu there is also an options pane you can select to protect certain urls or pinned tabs. That's it!

### Keyboard Shortcuts

You can navigate to chrome://extensions/shortcuts to change/activate/deactive keyboard shortcuts for the extension.

## Installing/building tabcloser

You can install from the latest release https://github.com/tuckerman/tabcloser-chrome/releases or build yourself

### Building

```bash
$ bun install  # Pulls in types for chrome, otherwise there are no dependencies.
$ bun run build  # Transpiles typescript to javascript because why not?
```

You can then load the unpacked extension by visiting chrome://extensions

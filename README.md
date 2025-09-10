# ForgeAutoReload

## Installing the given builds.

### Safari
- Dowload the .app version of the extension
- Drag the .app anywhere you want (eg the Applications folder)
- Launch it once
- Done, it should now appear in your Safari extension list

### Chromium
#### Using the unpacked extension
- Download the .zip (chromium) version of the extension and extract it somewhere (!the extracted folder must not be deleted if you want to keep the extension so extract it in eg your documents!)
- Go to chrome://extensions
- Enable developer mode (top right)
- Click "Load unpacked"
- Select the folder you just extracted
#### Using the CRX (usually blocked for security reasons)
- Download the .crx and open it in your browser

### Firefox
For now use a better browser. There's no way to install it permanently (only until you restart the browser) because I can't sign it.



## Building, packaging & signing

### Chrome/Chromium-based browsers
- Go to chrome://extensions
- Click "Pack extension"
- Select the src folder for the extension root dir (leave the private key input blank)

### Safari
- Install XCode
- Run `xcrun safari-web-extension-converter --bundle-identifier "me.nixuge.ForgeAutoReload" "SRC_FOLDER"` (Replace SRC_FOLDER with the path for the src/ folder), it should open an XCode window
- Click on the root of the project in the file browser (the thing with the App Store icon)
- On the top, go to "Signing & Capabilities"
- For each target on the left, select it and set its team to whathever your team is (if you don't have any go look it up. You don't need a paid dev account, you can use a personal team.)
- Make sure you've selected the right target on the top bar (the bar that has "ForgeAutoReload (macOS/iOS)")
- Product>Build
- Once that's done Product>Show Build Folder in Finder
- You've got your .app, move it anywhere you want (eg Applications folder) and run it once and you should be able to enable it in Safari

### Firefox
- [Install web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)
#### Build only
- Run `web-ext sign --source-dir "SRC_FOLDER"`
#### Build and sign
I unfortunately could not sign the extension because Mozilla for some reason does not send the required confirmation email. Please switch to a good browser, eg Safari or Brave.
- Create an [addons.mozilla.org](https://addons.mozilla.org/developers/addon/api/key/) account if you haven't got one
- Go to [addons.mozilla.org/developers/addon/api/key](https://addons.mozilla.org/developers/addon/api/key/) and get your api key
- ...
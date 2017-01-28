# Kindle Highlights Chrome Extension

A simple extension for Google Chrome that allows you to download your Kindle highlights as either JSON or Markdown.

There is no public API for Kindle highlights. This is a Chrome extension rather than a command line tool because Amazon does a decent job at stopping logins through scripts (by using captcha) and your Amazon account will probably have 2FA enabled.

This work was made much easier because of the great work at [Create Chrome Extension.](https://github.com/schovi/create-chrome-extension)

This is a little rough around the edges at the moment. If you think this is useful and please go ahead and submit a pull request.

## Installation

To run this extension it is easiest to run it unpacked:

1. Clone this repository
2. Install all dependencies

            yarn install

3. Compile the extension using

            yarn run build

4. Open [chrome://extensions](chrome://extensions)
5. Choose "Load unpacked extensions"
6. Select `dist/source`

## Development

1. Install all dependencies

            yarn install

2. Start the webpack dev server

            yarn run build-dev
      
4. Open [chrome://extensions](chrome://extensions)
5. Choose "Load unpacked extensions"
6. Select `dist`

import * as fs from 'fs';
import * as path from 'path';
import { browser } from 'protractor';

const OUTPUT_DIR = '../source/e2e/testresults/screenshots';
const HEIGHT = 768;
const WIDTH = 1024;

let currentJasmineSpecName = '';
let browserName = '';
let browserVersion = '';

/**  Adds a custom jasmine reporter that simply keeps track of the current test name. */
function initializeEnvironment(jasmine: any) {
  browser
    .manage()
    .window()
    .setSize(WIDTH, HEIGHT);
  const reporter = new jasmine.JsApiReporter({});
  reporter.specStarted = function(result: any) {
    currentJasmineSpecName = result.fullName;
  };
  jasmine.getEnv().addReporter(reporter);
}

initializeEnvironment(jasmine);

export class Screenshot {
  id: string;

  /** The filename used to store the screenshot. */
  get filename(): string {
    return (
      this.id.trim() +
      '.png'
    );
  }

  /** The full path to the screenshot */
  get fullPath(): string {
    return path.resolve(OUTPUT_DIR, this.filename);
  }
  constructor(id?: string) {
 const capsPromise = browser.getCapabilities();

 capsPromise.then(function (caps) {
   browserName = caps.get('browserName');
   browserVersion = caps.get('version');

   id = id ? `${browserName}' ${currentJasmineSpecName} ${id}` : browserName +
     '-' + browserVersion + '-' + currentJasmineSpecName;


   browser.takeScreenshot().then(png => {
     const imageName = `${id.trim()}.png`;
     const fullPath = path.resolve(OUTPUT_DIR, imageName);
     storeScreenshot(png, fullPath);
   });

});

  }
}

/** Replaces the existing screenshot with the newly generated one. */
function storeScreenshot(png: any, fullPath: string) {

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, '744');
  }

  if (fs.existsSync(OUTPUT_DIR)) {
    fs.writeFileSync(fullPath, png, { encoding: 'base64' });
  }
}

export function screenshot(id?: string) {
  return new Screenshot(id);
}

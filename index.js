const WEBPAGE = "https://chatbotsqa.s3.amazonaws.com/botqa2.html";
const IFRAME =
  "https://chatbot-front-qa.herokuapp.com/bot?id=111&token=MMTLFMHOXBXXWJVH&clientPathName=/botqa2.html&clientHostName=chatbotsqa.s3.amazonaws.com";

const CURRENT_BOTS = 10;

const MESSAGES = [
  "jaja",
  "que dia es hoy",
  "como estas",
  "hola",
  "quien te creo",
];

const INTERVAL_BETWEEN_MESSAGE = 4 * 1000;
const SECONDS_TO_NEW_BOT = 3 * 1000;

async function start() {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  await page.goto(WEBPAGE);

  await page.setViewport({ width: 3440, height: 1297 });

  await navigationPromise;

  await page.waitForSelector("iframe");

  const elementHandle = await page.$('iframe[src="' + IFRAME + '"]');
  await elementHandle.click();
  const frame = await elementHandle.contentFrame();

  console.log("filling form in iframe");
  console.log("empezando a escribir");
  setInterval(async () => {
    await frame.waitForSelector(".from-Agent");
    await frame.type("#textInput", MESSAGES[random(0, MESSAGES.length)], {
      delay: 100,
    });
    await frame.click(".btn_icon.btn_send");
  }, INTERVAL_BETWEEN_MESSAGE);
}

function timeout(millis) {
  return new Promise((resolve, reject) => setTimeout(resolve, millis));
}

function random(min, max) {
  let newMin = Math.ceil(min);
  let newMax = Math.floor(max);
  return Math.floor(Math.random() * (newMax - newMin + 1)) + min;
}

(async () => {
  for (let i = 0; i < CURRENT_BOTS; i++) {
    await timeout(SECONDS_TO_NEW_BOT);
    console.log("iniciado nuevo...");
    start();
  }
})();

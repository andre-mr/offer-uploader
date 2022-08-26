const offerDb = require("../database/offer-db.js");
const ftp = require("basic-ftp")
const { Readable } = require('stream');
const sharp = require("sharp");
const unshorter = require('unshorter');

async function getUploadedOfferList() {
  const client = new ftp.Client()
  let fileList;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    await client.ensureDir("csv");
    fileList = await client.list();
  } catch (error) {
    client.close();
    return false;
    // throw new Error(error.message);
  }
  client.close();
  return JSON.stringify(fileList);
}

async function getActiveOfferList() {
  try {
    return await offerDb.getActiveOfferList();
  } catch (error) {
    return false;
    // throw new Error(error.message);
  }
}

async function addOffer(offer) {
  try {
    return await offerDb.addOffer(offer);
  } catch (error) {
    return false;
    throw new Error(error.message);
  }
}

async function addOffer(offer) {
  try {
    return await offerDb.addOffer(offer);
  } catch (error) {
    return false;
    throw new Error(error.message);
  }
}

function extraDescription(description) {
  return description + "\n\nClube Baby os melhores preços em Fraldas e Lenços";
}

async function closeBatch() {
  let activeOffers = await offerDb.getActiveOfferList();
  if (!activeOffers || activeOffers.length == 0) {
    return false;
  }
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
  const directoryPath = `${todayFormatted.substring(0, 4)}/${todayFormatted.substring(5, 7)}`;

  let uploadPackage = [];
  for (const offer of activeOffers) {
    offer.description = extraDescription(offer.description);
    let fileToPackage = {};
    offer.start_date = todayFormatted;
    offer.verified_on = todayFormatted;
    const fileName = formatFileName(offer);
    offer.image_url = `${process.env.FTP_IMAGE_URL}/${todayFormatted.substring(0, 4)}/${todayFormatted.substring(5, 7)}/${fileName}`;
    const base64Image = offer.image_file.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    if (offer.image_file.indexOf('image/png') != -1
      // || offer.image_file.indexOf('image/jpeg') != -1
    ) {
      const sharpedData = await sharp(imageBuffer)
        .jpeg({ quality: 65 })
        .toBuffer();
      fileToPackage.file = sharpedData;
    } else {
      fileToPackage.file = imageBuffer;
    }
    offer.url = await changeStoreTag(offer.url);
    fileToPackage.name = fileName;
    uploadPackage.push(fileToPackage);
  }

  let uploadResult = await upload(uploadPackage, directoryPath);

  if (!uploadResult) {
    return false;
  }
  result = await offerDb.updateActiveOffers(activeOffers);
  if (!result) return false;
  return await generateCSV(activeOffers, today);
  return false;
}

async function upload(uploadPackage, directoryPath) {
  const client = new ftp.Client()
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    await client.ensureDir(`${directoryPath}`);
    for (const fileFromPackage of uploadPackage) {
      fileFromPackage.file = Readable.from(fileFromPackage.file);
      await client.uploadFrom(fileFromPackage.file, fileFromPackage.name);
    }
  }
  catch (err) {
    console.log(err);
    client.close();
    return false;
  }
  client.close();
  return true;
}

async function generateCSV(activeOffers, today) {
  let csv = "";
  for (const key in activeOffers[0]) {
    if (key != "image_file") {
      csv += key + ",";
    }
  }
  csv = csv.slice(0, -1);
  csv += "\r\n";
  for (const offer of activeOffers) {
    for (const key in offer) {
      if (key == "image_file") continue;
      if ((offer[key] && key != "id") || key == "priority") {
        offer[key] = offer[key].toString().replace(/“/g, '\"');
        offer[key] = offer[key].toString().replace(/”/g, '\"');
        offer[key] = (key == "categories") ? offer[key] : offer[key].toString().replace(/"/g, '""');
      } else {
        offer[key] = "";
      }
      csv += (key == "categories") ? offer[key] + "," : "\"" + offer[key] + "\",";
    }
    csv = csv.slice(0, -1);
    csv += "\r\n";
  }
  csv = csv.slice(0, -2);

  const directoryPath = "csv";

  const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}_${today.getHours()
      .toString()
      .padStart(2, "0")}-${today.getMinutes()
        .toString()
        .padStart(2, "0")}-${today.getSeconds()
          .toString()
          .padStart(2, "0")}`;

  const filename = todayFormatted + ".csv";
  const fileBuffer = Buffer.from(csv, 'utf-8');
  const uploadPackage = [{ file: fileBuffer, name: filename }]
  return await upload(uploadPackage, directoryPath);
}

function formatFileName(offer) {
  const fileName = `${offer.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}_${process.env.IMAGE_NAME_TM}_${offer.id}.jpg`;
  return fileName;
}

async function changeStoreTag(shortUrl) {
  if (!shortUrl.match('amzn.to')) return shortUrl;

  const longUrl = await unshorter(shortUrl);

  if (longUrl.indexOf("http") >= 0) {
    if (longUrl.match(/tag=(.*?)(?=&)/)) {
      return longUrl.replace(/tag=(.*?)(?=&)/, `tag=${process.env.STORE_TAG}`);
    } else {
      return longUrl.replace(/tag=(.*)/, `tag=${process.env.STORE_TAG}`);
    }
  }

  return shortUrl;
}

async function updateOffer(offer) {
  try {
    return await offerDb.updateOffer(offer);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function deleteOffer(offer) {
  try {
    return await offerDb.deleteOffer(offer);
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getUploadedOfferList,
  getActiveOfferList,
  addOffer,
  updateOffer,
  deleteOffer,
  closeBatch,
};

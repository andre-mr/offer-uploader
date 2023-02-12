const unshorter = require("unshorter");
const offerService = require("../services/offer-service.js");
const scrapAmazon = require("../services/scrap-amazon.js");
const scrapNatura = require("../services/scrap-natura.js");

async function fuseImage(req, res) {
  let result = await offerService.fuseImage(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }

  process.kill(process.pid); // clear cpanel node multiple NPROC usage
}

async function getStoreProduct(req, res) {
  let url = req.query.url;
  let result;
  if (url.indexOf("amzn.to") >= 0 || url.indexOf("amazon.com") >= 0) {
    result = await scrapAmazon.scrapAmazonProduct(url);
  } else {
    if (url.indexOf("bit.ly")) {
      url = (await unshorter(url)).replace(/ /g,"%20");
    }
    if (url.indexOf("natura.com.br") >= 0) {
      result = await scrapNatura.scrapNaturaProduct(url);
    }
  }
  if (result) {
    sendResponse(JSON.stringify(result), res);
  } else {
    sendResponse(null, res);
  }

  process.kill(process.pid); // clear cpanel node multiple NPROC usage
}

async function getConfigs(req, res) {
  let result = await offerService.getConfigs();
  if (result) {
    sendResponse(JSON.stringify(result), res);
  } else {
    sendResponse(null, res);
  }
}

async function updateSignature(req, res) {
  let result = await offerService.updateSignature(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function updateClipboard(req, res) {
  let result = await offerService.updateClipboard(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function deleteSignature(req, res) {
  let result = await offerService.deleteSignature(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function deleteCategory(req, res) {
  let result = await offerService.deleteCategory(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function deleteStore(req, res) {
  let result = await offerService.deleteStore(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function deleteClipboard(req, res) {
  let result = await offerService.deleteClipboard(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function addSignature(req, res) {
  let result = await offerService.addSignature(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function addCategory(req, res) {
  let result = await offerService.addCategory(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function addStore(req, res) {
  let result = await offerService.addStore(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function addClipboard(req, res) {
  let result = await offerService.addClipboard(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function getSignatures(req, res) {
  let result = await offerService.getSignatures();
  if (result) {
    sendResponse(JSON.stringify(result), res);
  } else {
    sendResponse(null, res);
  }
}

async function getCategories(req, res) {
  let result = await offerService.getCategories();
  if (result) {
    sendResponse(JSON.stringify(result), res);
  } else {
    sendResponse(null, res);
  }
}

async function getStores(req, res) {
  let result = await offerService.getStores();
  if (result) {
    sendResponse(JSON.stringify(result), res);
  } else {
    sendResponse(null, res);
  }
}

async function getInactiveOfferList(req, res) {
  let result = await offerService.getInactiveOfferList();
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }

  // process.kill(process.pid); // clear cpanel node multiple NPROC usage
}

async function getUploadedOfferList(req, res) {
  let result = await offerService.getUploadedOfferList();
  if (result) {
    sendResponse(JSON.stringify(JSON.parse(result)), res);
  } else {
    sendResponse(null, res);
  }

  process.kill(process.pid); // clear cpanel node multiple NPROC usage
}

async function getActiveOfferList(req, res) {
  let result = await offerService.getActiveOfferList();
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function getClipboard(req, res) {
  let result = await offerService.getClipboard();
  if (result) {
    sendResponse(JSON.stringify(result), res);
  } else {
    sendResponse(null, res);
  }
}

async function addOffer(req, res) {
  let result = await offerService.addOffer(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function updateOffer(req, res) {
  let result = await offerService.updateOffer(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function deleteOffer(req, res) {
  let result = await offerService.deleteOffer(req.body);
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

async function closeBatch(req, res) {
  let result = await offerService.closeBatch();
  if (result) {
    sendResponse(result, res);
  } else {
    sendResponse(null, res);
  }
}

function sendResponse(result, res) {
  if (result) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.write(JSON.stringify(result));
    res.send();
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Erro na consulta.");
    res.send();
  }
}

module.exports = {
  getUploadedOfferList,
  getActiveOfferList,
  addOffer,
  updateOffer,
  deleteOffer,
  closeBatch,
  getStores,
  getCategories,
  getSignatures,
  addStore,
  deleteStore,
  addCategory,
  deleteCategory,
  addSignature,
  deleteSignature,
  getConfigs,
  getInactiveOfferList,
  updateSignature,
  getClipboard,
  addClipboard,
  updateClipboard,
  deleteClipboard,
  fuseImage,
  getStoreProduct,
};

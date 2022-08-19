const offerService = require("../services/offer-service.js");

async function getUploadedOfferList(req, res) {
  let result = await offerService.getUploadedOfferList();
  if (result) {
    sendResponse(JSON.stringify(JSON.parse(result)), res);
  } else {
    sendResponse(null, res);
  }
}

async function getActiveOfferList(req, res) {
  let result = await offerService.getActiveOfferList();
  if (result) {
    sendResponse(result, res);
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
};

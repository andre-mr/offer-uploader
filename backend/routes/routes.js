const offerController = require("../controllers/offer-controller.js");

function setupRoutes(app) {
  app.get("/", function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Utilize a aplicação web apropriada. :)");
    res.send();
  });

  app.use(function (req, res, next) {
    if (
      (req.query.apiKey && req.query.apiKey == process.env.API_KEY) ||
      (req.query.apiKeyConfig &&
        req.query.apiKeyConfig == process.env.API_KEY_CONFIG)
    ) {
      next();
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(JSON.stringify(["password"]));
      res.send();
    }
  });

  app.get("/inactive", offerController.getInactiveOfferList);

  app.get("/uploaded", offerController.getUploadedOfferList);

  app.get("/active", offerController.getActiveOfferList);

  app.post("/add", offerController.addOffer);

  app.put("/update", offerController.updateOffer);

  app.delete("/delete", offerController.deleteOffer);

  app.post("/batch", offerController.closeBatch);

  app.get("/stores", offerController.getStores);
  app.post("/stores/add", offerController.addStore);
  app.delete("/stores/delete", offerController.deleteStore);

  app.get("/categories", offerController.getCategories);
  app.post("/categories/add", offerController.addCategory);
  app.delete("/categories/delete", offerController.deleteCategory);

  app.get("/signatures", offerController.getSignatures);
  app.post("/signatures/add", offerController.addSignature);
  app.delete("/signatures/delete", offerController.deleteSignature);
  app.put("/signatures/update", offerController.updateSignature);

  app.get("/clipboard", offerController.getClipboard);
  app.post("/clipboard/add", offerController.addClipboard);
  app.delete("/clipboard/delete", offerController.deleteClipboard);
  app.put("/clipboard/update", offerController.updateClipboard);

  app.get("/configs", offerController.getConfigs);

  app.get("/amazonproduct", offerController.getAmazonProduct);

  app.get("/amazonproduct", offerController.getAmazonProduct);

  app.post("/image", offerController.fuseImage);
  
  app.get("*", function (req, res) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Caminho não encontrado.");
    res.send();
  });
}

module.exports = {
  setupRoutes,
};

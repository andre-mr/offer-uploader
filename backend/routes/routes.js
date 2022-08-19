const offerController = require("../controllers/offer-controller.js");

function setupRoutes(app) {
  app.get("/", function (req, res) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Utilize a aplicação web apropriada. :)");
    res.send();
  });

  app.use(function (req, res, next) {
    if (req.query.apiKey && req.query.apiKey == process.env.API_KEY) {
      next();
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.write(JSON.stringify(["password"]));
      res.send();
    }
  });

  app.get("/uploaded", offerController.getUploadedOfferList);

  app.get("/active", offerController.getActiveOfferList);

  app.post("/add", offerController.addOffer);

  app.put("/update", offerController.updateOffer);

  app.delete("/delete", offerController.deleteOffer);

  app.post("/batch", offerController.closeBatch);

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

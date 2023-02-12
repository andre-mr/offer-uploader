const fetch = require("node-fetch");
// const fs = require("fs");

async function scrapNaturaProduct(offerUrl) {
  const skuID = offerUrl.match(/(?<=\/)([0-9].*(?=\?))/s)[0];

  const result = await fetch(
    "https://apigw.natura.com.br/ecommerce/search/v1/products_br_nt_prd/_search",
    {
      headers: {
        accept: "application/json",
        access_token: `${process.env.NATURA_ACCESS_TOKEN}`,
        client_id: `${process.env.NATURA_CLIENT_ID}`,
        "content-type": "application/json",
      },
      body: `{"query":{"term":{"skus.sku_id":"${skuID}"}}}`,
      method: "POST",
    }
  );
  const resultJSON = await result.json();
  // fs.writeFile("result.json", JSON.stringify(resultJSON), () => {});

  let imageUrlsCollected = [];
  imageUrlsCollected.push(
    "https:" + resultJSON.hits.hits[0]._source.skus[0].backgroundMobileImage
  );
  for (const imageUrl of resultJSON.hits.hits[0]._source.skus[0].imageUrls) {
    imageUrlsCollected.push("https:" + imageUrl);
  }
  const product = {
    store: "Natura",
    title: resultJSON.hits.hits[0]._source.friendly_name[0],
    descriptions: [
      resultJSON.hits.hits[0]._source.long_description[0].replace(
        /(<p>|<\/p>|<strong>|<\/strong>|&nbsp;|\n)/g,
        ""
      ),
      resultJSON.hits.hits[0]._source.description[0].replace(
        /(<p>|<\/p>|<strong>|<\/strong>|&nbsp;)/g,
        ""
      ),
    ],
    price: {
      value: Number.parseInt(
        Number.parseFloat(resultJSON.hits.hits[0]._source.skus[0].sale_price) *
          Number.parseFloat(process.env.NATURA_DISCOUNT)
      ),
    },
    imageUrls: imageUrlsCollected,
  };

  return product;
}

module.exports = { scrapNaturaProduct };

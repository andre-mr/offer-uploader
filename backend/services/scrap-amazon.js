const fetch = require("node-fetch");
// const fs = require("fs");

async function scrapAmazonProduct(amazonUrl) {
  const isAmzn =
    amazonUrl.indexOf("/amzn.") >= 0 || amazonUrl.indexOf("amazon.com") >= 0;

  if (isAmzn) {
    const result = await fetch(amazonUrl, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language":
          "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,la;q=0.6,es;q=0.5",
        "cache-control": "max-age=0",
        "device-memory": "8",
        downlink: "10",
        dpr: "1.25",
        ect: "4g",
        rtt: "50",
        "sec-ch-device-memory": "8",
        "sec-ch-dpr": "1.25",
        "sec-ch-ua":
          '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-ch-ua-platform-version": '"10.0.0"',
        "sec-ch-viewport-width": "1229",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "viewport-width": "1229",
        // cookie: '',
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
    });
    const resultText = await result.text();
    const title = await getTitle(resultText);
    const descriptions = await getDescriptions(resultText);
    const price = await getPrice(resultText);
    // const oldPrice = await getOldPrice(resultText);
    // const imageUrls = await getImages(resultText);

    // fs.writeFile("page.html", resultText, (err) => {}); // used to analyze html to define scraping method

    return {
      title: title,
      descriptions: descriptions,
      price: price,
      // oldPrice: oldPrice,
      // imageUrls: imageUrls,
    };
  } else {
    return null;
  }
}

async function getTitle(page) {
  const desc1 = page.match(/(?<=id="productTitle" )(.*?)(?=\s*<\/span)/s);
  const desc2 = desc1 ? desc1[0].match(/(?<=">)(.*)/) : null;
  let title = desc2 ? desc2[0].replace(/(^\s+)/, "") : null;
  title = title ? title.replace("&#34;", '"') : null; // encoding issue

  return title;
}

async function getPrice(page) {
  let bestPrice = 0;
  let snsPrice = false;

  const corePrice1 = page.match(
    /(?<=id="corePrice_feature_div")(.*?)(?=no Pix)/s
  );
  const corePrice2 = corePrice1
    ? corePrice1[0].match(/(?<=R\$)(.*)(,)([0-9]{2})/)
    : null;
  if (corePrice2) {
    bestPrice = Number.parseFloat(
      corePrice2[0].replace(".", "").replace(",", ".")
    );
  }

  if (bestPrice <= 0) {
    const price = page.match(/(?<=price-data">)(.*?)(?=<\/div>)/);
    const priceOBJ = price ? JSON.parse(price[0]) : null;
    if (priceOBJ) {
      for (let i = 0; i < priceOBJ.length; i++) {
        if (priceOBJ[i].buyingOptionType == "NEW") {
          snsPrice = false;
          bestPrice = priceOBJ[i].priceAmount;
        }
        if (priceOBJ[i].buyingOptionType == "SNS") {
          snsPrice = true;
          bestPrice = priceOBJ[i].priceAmount;
          break;
        }
      }
    }
  }

  const priceDouble = Number.parseFloat(bestPrice.toString());

  return { value: priceDouble, sns: snsPrice };
}

async function getDescriptions(page) {
  // fs.writeFile("page.html", page, (err) => {}); // to analyse html in order to update scraping rules
  const descriptions = [];

  const desc1 = page.match(/(?<=id="productDescription" )(.*)(?=<\/span)/s);
  const desc2 = desc1 ? desc1[0].match(/(?<=<span>)(.*)(?=<\/span)/) : null;
  let description = desc2 ? desc2[0] : null;
  if (!description) {
    const desc3 = page.match(/(?<=collapse-content"> <span>)(.*?)(?=<\/span>)/);
    description = desc3 ? desc3[0] : null;
  }
  if (description) {
    description = description?.replace(/(<\/(.*?)>)/g, " ");
    description = description?.replace(/(<(.*?)>)/g, "");
    descriptions.push(description);
  }

  let about;
  const about1 = page.match(
    /(?<=<ul class="a-unordered-list a-vertical a-spacing-mini">)(.*?)(?=<\/ul>)/s
  );
  const about2 = about1
    ? about1[0].match(/(?<=<span class="a-list-item"> )(.*?)(?=  <\/span>)/g)
    : null;
  if (about2) {
    about = "";
    for (const item of about2) {
      about += `${item}
`;
    }
    about = about?.replace(/【/g, "");
    about = about?.replace(/】/g, " ");
    descriptions.push(about);
  }
  return descriptions;
}

module.exports = { scrapAmazonProduct };

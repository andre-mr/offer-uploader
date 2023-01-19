const fetch = require("node-fetch");
const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");
const imageSize = require("image-size");
const sharp = require("sharp");

let foregroundHeight = 0,
  foregroundWidth = 0;

async function getImageFromURL(imageURL) {
  const response = await fetch(imageURL);
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

async function imageConvert(imageBuffer) {
  const dimensions = imageSize(imageBuffer);
  const maxHeight = 295 * 0.9;
  const maxWidth = 500 * 0.75;

  if (dimensions.height > maxHeight) {
    foregroundHeight = maxHeight;
    foregroundWidth = dimensions.width * (maxHeight / dimensions.height);
  }
  if (foregroundWidth > maxWidth) {
    foregroundWidth = maxWidth;
    foregroundHeight = dimensions.height * (maxWidth / dimensions.width);
  }

  if (Number.parseInt(foregroundHeight) > 0) {
    return await sharp(imageBuffer)
      .png({ quality: 100 })
      .resize({ height: Number.parseInt(foregroundHeight) })
      .toBuffer();
  } else {
    return await sharp(imageBuffer).png({ quality: 100 }).toBuffer();
  }
}

async function generateImage(backgroundImageURL, foregroundImageURL) {
  const backgroundImage = await getImageFromURL(backgroundImageURL);
  const foregroundImage = await getImageFromURL(foregroundImageURL);
  const foregroundImageConverted = await imageConvert(foregroundImage);

  const finalImage = await mergeImages(
    [
      backgroundImage,
      {
        src: foregroundImageConverted,
        x: (500 - foregroundWidth) / 2,
        y: (295 - 10 - foregroundHeight) / 2,
      },
    ],
    {
      Canvas: Canvas,
      Image: Image,
    }
  );
  return finalImage;
}

module.exports = { generateImage };

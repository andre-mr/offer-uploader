const mysql = require("mysql2/promise.js");

async function getUploadedOfferList() {
  // return sqlSelect(
  //   `SELECT id, title, description, badge, type, code, store, categories, locations, url, image_url, start_date, valid_till, verified_on, priority, notes, image_file
  //   DATE_FORMAT(CONVERT_TZ(offer.valid_till, '+00:00', '${process.env.TIME_ZONE}'), '%Y/%m/%d') AS valid_till, 
  //   DATE_FORMAT(CONVERT_TZ(offer.valid_till, '+00:00', '${process.env.TIME_ZONE}'), '%Y/%m/%d') AS valid_till, 
  //   DATE_FORMAT(CONVERT_TZ(offer.valid_till, '+00:00', '${process.env.TIME_ZONE}'), '%Y/%m/%d') AS valid_till, 
  //   FROM offer WHERE verified_on IS NOT NULL;`
  // );
  return sqlSelect(
    `SELECT id, title, description, badge, type, code, store, categories, locations, url, image_url, DATE_FORMAT(start_date, "%Y-%m-%d") as start_date, DATE_FORMAT(valid_till, "%Y-%m-%d") as valid_till, DATE_FORMAT(verified_on, "%Y-%m-%d") as verified_on, priority, notes, image_file 
    FROM offer WHERE verified_on IS NOT NULL;`
  );
}

async function getActiveOfferList() {
  return sqlSelect(
    `SELECT id, title, description, badge, type, code, store, categories, locations, url, image_url, start_date, DATE_FORMAT(valid_till, "%Y-%m-%d") AS valid_till, verified_on, priority, notes, image_file 
    FROM offer WHERE verified_on IS NULL 
    ORDER BY id DESC;`
  );
}

async function addOffer(offer) {
  return await sqlInsert(
    `INSERT INTO offer (title, description, badge, type, code, store, categories, locations, url, image_url, start_date, valid_till, verified_on, priority, notes, image_file) VALUES (?) `,
    [
      offer.title,
      offer.description,
      offer.badge,
      offer.type,
      offer.code,
      offer.store,
      offer.categories,
      offer.locations,
      offer.url,
      offer.image_url,
      offer.start_date,
      offer.valid_till,
      offer.verified_on,
      offer.priority,
      offer.notes,
      offer.image_file
    ]
  );
}

async function updateOffer(offer) {
  let sql = `UPDATE offer SET title=?, description=?, badge=?, type=?, code=?, store=?, categories=?, locations=?, url=?, image_url=?, start_date=?, valid_till=?, verified_on=?, priority=?, notes=?, image_file=? WHERE id=? `;
  let values = [
    offer.title,
    offer.description,
    offer.badge,
    offer.type,
    offer.code,
    offer.store,
    offer.categories,
    offer.locations,
    offer.url,
    offer.image_url,
    offer.start_date,
    offer.valid_till,
    offer.verified_on,
    offer.priority,
    offer.notes,
    offer.image_file,
    offer.id
  ];
  return await sqlUpdateOrDelete(sql, values);
}

async function updateActiveOffers(activeOffers) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  for (const offer of activeOffers) {
    sql = `UPDATE offer SET image_url=?, start_date=?, verified_on=?, image_file=null WHERE id=? `;
    let values = [
      offer.image_url,
      offer.start_date,
      offer.verified_on,
      offer.id
    ];

    await connection.query(sql, values, function (err) {
      if (err) {
        connection.end();
        return false;
        // throw err;
      }
    });
  }
  connection.end();
  return true;
}

async function deleteOffer(offer) {
  let sql = `DELETE FROM offer WHERE id=? `;
  let values = [offer.id];
  return await sqlUpdateOrDelete(sql, values);
}

async function sqlSelect(selectStatement) {
  let queryResult;
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    [queryResult] = await connection.execute(selectStatement);
    connection.end();
  } catch (error) {
    [queryResult] = [];
  }
  return queryResult;
}

async function sqlInsert(insertStatement, values) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  await connection.query(insertStatement, [values], (err) => {
    if (err) throw err;
    connection.end();
    return false;
  }
  );
  connection.end();
  return true;
}

async function sqlUpdateOrDelete(updateStatement, values) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  await connection.query(updateStatement, values, function (err) {
    if (err) {
      connection.end();
      throw err;
    }
  });
  connection.end();
  return true;
}

module.exports = {
  getUploadedOfferList,
  getActiveOfferList,
  addOffer,
  updateOffer,
  deleteOffer,
  updateActiveOffers,
};

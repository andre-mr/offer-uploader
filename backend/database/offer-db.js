const mysql = require("mysql2/promise.js");

async function deleteSignature(signature) {
  let sql = `DELETE FROM signature WHERE id=? `;
  let values = [signature.id];
  return await sqlUpdateOrDelete(sql, values);
}

async function deleteCategory(category) {
  let sql = `DELETE FROM category WHERE id=? `;
  let values = [category.id];
  return await sqlUpdateOrDelete(sql, values);
}

async function deleteStore(store) {
  let sql = `DELETE FROM store WHERE id=? `;
  let values = [store.id];
  return await sqlUpdateOrDelete(sql, values);
}

async function deactivateSignatures() {
  let sql = `UPDATE signature SET active=0 WHERE id>? `;
  let values = [
    0
  ];
  return await sqlUpdateOrDelete(sql, values);
}

async function addSignature(signature) {
  return await sqlInsert(
    `INSERT INTO signature (description, active) VALUES (?) `,
    [
      signature.description,
      signature.active
    ]
  );
}

async function addCategory(category) {
  return await sqlInsert(
    `INSERT INTO category (description) VALUES (?) `,
    [
      category.description,
    ]
  );
}

async function addStore(store) {
  return await sqlInsert(
    `INSERT INTO store (description) VALUES (?) `,
    [
      store.description,
    ]
  );
}

async function getActiveSignature() {
  return sqlSelect(
    `SELECT *
    FROM signature 
    WHERE active=1;`
  );
}

async function getSignatures() {
  return sqlSelect(
    `SELECT *
    FROM signature 
    ORDER BY description ASC;`
  );
}

async function getCategories() {
  return sqlSelect(
    `SELECT *
    FROM category 
    ORDER BY description ASC;`
  );
}

async function getStores() {
  return sqlSelect(
    `SELECT * 
    FROM store 
    ORDER BY description ASC;`
  )
}

async function getInactiveOfferList() {
  return sqlSelect(
    `SELECT id, title, description, badge, type, code, store, categories, locations, url, image_url, start_date, DATE_FORMAT(valid_till, "%Y-%m-%d") AS valid_till, verified_on, priority, notes, image_file 
    FROM offer WHERE verified_on IS NOT NULL 
    ORDER BY id DESC;`
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
  getActiveOfferList,
  addOffer,
  updateOffer,
  deleteOffer,
  updateActiveOffers,
  getStores,
  getCategories,
  getSignatures,
  addStore,
  deleteStore,
  addCategory,
  deleteCategory,
  addSignature,
  deactivateSignatures,
  deleteSignature,
  getActiveSignature,
  getInactiveOfferList,
};

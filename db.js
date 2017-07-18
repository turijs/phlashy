const pg = require('pg');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  max: 7, // max number of clients in the pool
  idleTimeoutMillis: 30000,
}

const pool = new pg.Pool(config);

module.exports = {
  /*
   * Create all tables if they don't already exist
   */
  setupTablesIfNecessary() {
    let t1 = pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        ID SERIAL PRIMARY KEY,
        nickname varchar(50),
        email varchar(100) UNIQUE,
        password char(60)
      )
    `);
    let t2 = pool.query(`
      CREATE TABLE IF NOT EXISTS decks (
        ID SERIAL PRIMARY KEY,
        userID integer REFERENCES users (ID) ON DELETE CASCADE,
        name varchar(100),
        dateCreated timestamp
      )
    `);
    let t3 = pool.query(`
      CREATE TABLE IF NOT EXISTS cards (
        ID SERIAL PRIMARY KEY,
        userID integer REFERENCES users (ID) ON DELETE CASCADE,
        deckID integer REFERENCES decks (ID) ON DELETE CASCADE,
        term text,
        defn text,
        dateCreated timestamp,
      )
    `);

    return Promise.all([t1, t2, t3]);
  },

  ////////////////////
  // User functions //
  ////////////////////

  createUser(nickname, email, pw) {
    return bcrypt.hash(pw, SALT_ROUNDS).then(hash => {
      return pool.query(
        `INSERT INTO users (nickname, email, password)
         VALUES ($1, $2, $3) RETURNING ID`,
        [nickname, email, hash]
      )
        .then(res => {
          return res.rows[0].id;
        })
    });
  },
  authUser(userID, pw) {
    return pool.query(`SELECT password FROM users WHERE ID = $1`, [userID])
      .then(throwIfEmpty)
      .then(res => {
        return bcrypt.compare(pw, res.rows[0].password);
      });
  },
  updateNickname(userID, newNickname) {
    return pool.query(`UPDATE users SET nickname = $1 WHERE ID = $2`, [newNickname, userID]);
  },
  updateEmail(userID, newEmail) {
    return pool.query(`UPDATE users SET email = $1 WHERE ID = $2`, [newEmail, userID]);
  },
  updatePassword(userID, newPw) {
    return bcrypt.hash(pw, SALT_ROUNDS).then(hash => {
      return pool.query(`UPDATE users SET password = $1 WHERE ID = $2`, [hash, userID]);
    });
  },
  deleteUser(userID, pw) {
    return this.authUser(userID, pw).then(allowed => {
      if(!allowed)
        throw "Failed to delete user; incorrect password supplied";

      return pool.query(`DELETE FROM users WHERE ID = $1`, [userID]);
    })
  },

  ////////////////////
  // Deck functions //
  ////////////////////

  createDeck(userID, deckName) {
    return pool.query(
      `INSERT INTO decks (userID, name, dateCreated)
       VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING ID`,
      [userID, deckName]
    ).then(res => {
      return res.rows[0].id;
    });
  },
  updateDeck(userID, deckID, newDeckName) {
    return pool.query(
      `UPDATE decks SET name = $1 WHERE ID = $2 AND userID = $3 RETURNING ID`,
      [newDeckName, deckID, userID]
    ).then(throwIfEmpty);
  },
  deleteDeck(userID, deckID) {
    pool.query(
      `DELETE FROM decks WHERE ID = $1 AND userID = $2 RETURNING ID`,
      [deckID, userID]
    ).then(throwIfEmpty);
  },
  getDecks(userID) {
    return pool.query(`SELECT * FROM decks WHERE userID = $1`, [userID]).then(res => {
      return res.rows;
    });
  },

  /////////////////////
  // Card functions  //
  /////////////////////

  createCard(userID, deckID, term, defn) {
    return pool.query(
      `INSERT INTO cards (userID, deckID, term, defn, dateCreated)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING ID`,
      [userID, deckID, term, defn]
    ).then(res => {
      return res.rows[0].id;
    });
  },
  updateCard(userID, cardID, newTerm, newDefn) {
    return pool.query(
      `UPDATE cards SET
        term = COALESCE($1, term),
        defn = COALESCE($2, defn)
       WHERE ID = $3 AND userID = $4 RETURNING ID`,
      [newTerm, newDefn, cardID, userID]
    ).then(throwIfEmpty);
  },
  deleteCard(userID, cardID) {
    pool.query(
      `DELETE FROM cards WHERE ID = $1 AND userID = $2 RETURNING ID`,
      [cardID, userID]
    ).then(throwIfEmpty);
  },
  getCards(userID, cardID) {
    return pool.query(
      `SELECT * FROM decks WHERE ID = $1 AND userID = $2`,
      [cardID, userID]
    ).then(res => {
      return res.rows;
    });
  }
}

function throwIfEmpty(res) {
  if (res.rows.length < 1)
    throw "No matching items found";
  return res;
}

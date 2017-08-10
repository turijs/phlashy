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
  idleTimeoutMillis: 3000,
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
        description text,
        dateCreated timestamptz,
        dateModified timestamptz
      );
    `);
    let t3 = pool.query(`
      CREATE TABLE IF NOT EXISTS cards (
        ID SERIAL PRIMARY KEY,
        userID integer REFERENCES users (ID) ON DELETE CASCADE,
        deckID integer REFERENCES decks (ID) ON DELETE CASCADE,
        term text,
        defn text,
        dateCreated timestamptz,
        dateModified timestamptz
      );
    `);
    let t4 = pool.query(`
      CREATE OR REPLACE FUNCTION toJS(t timestamptz) RETURNS double precision
        AS 'select round(extract(epoch from $1) * 1000);'
        LANGUAGE SQL;
    `);

    return Promise.all([t1, t2, t3, t4]);
  },

  ////////////////////
  // User functions //
  ////////////////////

  createUser(nickname, email, pw) {
    return bcrypt.hash(pw, SALT_ROUNDS).then(hash => {
      return pool.query(
        `INSERT INTO users (nickname, email, password)
         VALUES ($1, $2, $3) RETURNING ID, nickname, email`,
        [nickname, email, hash]
      )
        .then(res => res.rows[0])
    });
  },
  /*
   * Accepts either userID or email. Returns User object
   */
  authUser(emailOrID, pw) {
    let idColumn = (typeof emailOrID === 'number') ? 'ID' : 'email';

    return pool.query(`SELECT * FROM users WHERE ${idColumn} = $1`, [emailOrID])
      .then(throwIfEmpty)
      .then(res => {
        let user = res.rows[0];
        return bcrypt.compare(pw, user.password)
          .then(match => match ? (delete user.password, user) : false);
      });
  },
  getUser(userID) {
    return pool.query(`SELECT ID, nickname, email FROM users WHERE ID = $1`, [userID])
      .then(throwIfEmpty)
      .then(res => res.rows[0]);
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
    return this.authUser(userID, pw).then(user => {
      if(!user)
        throw "Failed to delete user; incorrect password supplied";

      return pool.query(`DELETE FROM users WHERE ID = $1`, [userID]);
    })
  },

  ////////////////////
  // Deck functions //
  ////////////////////

  createDeck(userID, deckName, desc) {
    return pool.query(`
      INSERT INTO decks (userID, name, desc, dateCreated, dateModified)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING
        ID,
        name,
        desc,
        toJS(dateCreated) AS created,
        toJS(dateModified) AS modified`,
      [userID, deckName, desc]
    ).then(res => {
      return res.rows[0].id;
    });
  },
  updateDeck(userID, deckID, newName, newDescription) {
    return pool.query(`
      UPDATE decks SET
        name = $1,
        description = $2,
        dateModified = CURRENT_TIMESTAMP
      WHERE ID = $3 AND userID = $4 RETURNING ID`,
      [newName, newDescription, deckID, userID]
    ).then(throwIfEmpty);
  },
  deleteDeck(userID, deckID) {
    pool.query(
      `DELETE FROM decks WHERE ID = $1 AND userID = $2 RETURNING ID`,
      [deckID, userID]
    ).then(throwIfEmpty);
  },
  getDecks(userID) {
    return pool.query(`
      SELECT
        decks.ID,
        decks.name,
        decks.desc,
        toJS(decks.dateCreated) AS created,
        toJS(decks.dateModified) AS modified,
        array_agg(cards.ID) as cards
      FROM decks, cards
      WHERE decks.ID = cards.deckID AND decks.userID = $1
      GROUP BY decks.ID`,
      [userID]
    ).then(res => {
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
    return pool.query(`
      UPDATE cards SET
        term = COALESCE($1, term),
        defn = COALESCE($2, defn),
        dateModified = CURRENT_TIMESTAMP
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
    throw "not found";
  return res;
}

// CREATE OR REPLACE VIEW decks_v AS
//   SELECT
//     ID,
//     userID,
//     name,
//     desc,
//     round(extract(epoch from dateCreated) * 1000) AS dateCreated,
//     round(extract(epoch from dateModified) * 1000) AS dateModified,
//   FROM decks;

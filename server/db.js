const pg = require('pg');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 7, // max number of clients in the pool
  idleTimeoutMillis: 3000,
});


module.exports = {
  /*
   * Create all tables if they don't already exist
   */
  setupTablesIfNecessary() {
    return pool.query(`
      CREATE SEQUENCE IF NOT EXISTS id_seq;

      CREATE TABLE IF NOT EXISTS users (
        ID integer DEFAULT nextval('id_seq') PRIMARY KEY,
        nickname varchar(50),
        email varchar(100) UNIQUE,
        password char(60)
      );

      CREATE TABLE IF NOT EXISTS decks (
        ID integer DEFAULT nextval('id_seq') PRIMARY KEY,
        userID integer REFERENCES users (ID) ON DELETE CASCADE,
        name varchar(100),
        description text,
        created timestamptz,
        modified timestamptz
      );

      CREATE TABLE IF NOT EXISTS cards (
        ID integer DEFAULT nextval('id_seq') PRIMARY KEY,
        userID integer REFERENCES users (ID) ON DELETE CASCADE,
        deckID integer REFERENCES decks (ID) ON DELETE CASCADE,
        front text,
        back text,
        created timestamptz,
        modified timestamptz
      );
    `);
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
    return bcrypt.hash(newPw, SALT_ROUNDS).then(hash => {
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

  createDeck(userID, name = '', description = '', created = new Date()) {
    return pool.query(`
      INSERT INTO decks (userID, name, description, created, modified)
      VALUES ($1, $2, $3, $4, $4)
      RETURNING ID, name, description, created, modified`,
      [userID, name, description, created]
    ).then(res => res.rows[0]);
  },
  updateDeck(userID, deckID, newName='', newDescription='', modified = new Date()) {
    return pool.query(`
      UPDATE decks SET
        name = $3,
        description = $4,
        modified = $5
      WHERE ID = $2 AND userID = $1
      RETURNING ID, name, description, created, modified`,
      [userID, deckID, newName, newDescription, modified]
    )
      .then(throwIfEmpty)
      .then(res => res.rows[0])
  },
  deleteDeck(userID, deckID) {
    return pool.query(
      `DELETE FROM decks WHERE ID = $1 AND userID = $2 RETURNING ID`,
      [deckID, userID]
    ).then(throwIfEmpty);
  },
  getDecks(userID) {
    return pool.query(`
      SELECT
        decks.ID,
        decks.name,
        decks.description,
        decks.created,
        decks.modified,
        array_remove(array_agg(cards.ID), NULL) as cards
      FROM decks LEFT OUTER JOIN cards ON decks.ID = cards.deckID
      WHERE decks.userID = $1
      GROUP BY decks.ID`,
      [userID]
    ).then(res => {
      return res.rows;
    });
  },
  getDeckBasic(userID, deckID) {
    return pool.query(`
      SELECT ID, name, description
      FROM decks
      WHERE userID = $1 AND ID = $2`,
      [userID, deckID]
    )
      .then(throwIfEmpty)
      .then(res => Object.assign({cards: []}, res.rows[0]));
  },

  /////////////////////
  // Card functions  //
  /////////////////////

  createCard(userID, deckID, front='', back='', created = new Date()) {
    return transaction(async (query, commit) => {
      await checkDeckWithUser(deckID, userID, query);

      let {rows:[card]} = await query(
        `INSERT INTO cards (userID, deckID, front, back, created, modified)
         VALUES ($1, $2, $3, $4, $5, $5)
         RETURNING ID, front, back, created, modified`,
        [userID, deckID, front, back, created]
      );
      await query(
        `UPDATE decks SET modified = $3 WHERE ID = $2 AND userID = $1`,
        [userID, deckID, created]
      );
      await commit();
      return card;
    });
  },
  updateCard(userID, cardID, newFront='', newBack='', modified = new Date()) {
    return transaction(async (query, commit) => {
      let {rows:[card]} = await query(`
        UPDATE cards SET
          front = COALESCE($3, front),
          back = COALESCE($4, back),
          modified = $5
        WHERE ID = $2 AND userID = $1
        RETURNING ID, deckID, front, back, created, modified`,
        [userID, cardID, newFront, newBack, modified]
      ).then(throwIfEmpty);
      await query(
        `UPDATE decks SET modified = $3 WHERE ID = $2 AND userID = $1`,
        [userID, card.deckid, modified]
      );
      await commit();
      delete card.deckid;
      return card;
    });
  },
  deleteCard(userID, cardID, when = new Date()) {
    return transaction(async (query, commit) => {
      let res = await query(
        `DELETE FROM cards WHERE ID = $2 AND userID = $1
         RETURNING ID`,
        [userID, cardID]
      ).then(throwIfEmpty);

      await query(
        `UPDATE decks SET modified = $3 WHERE ID = $2 AND userID = $1`,
        [userID, res.rows[0].deckid, when]
      );

      await commit();
      return res.rowCount;
    });
  },
  moveCards(userID, toDeckID, cardIDs, when = new Date()) {
    return transaction(async (query, commit) => {
      await checkDeckWithUser(deckID, userID, query);

      let {rows: cards} = query(`
        SELECT deckID FROM cards WHERE ID = ANY ($2) AND userID = $1`,
        [userID, cardIDs]
      );

      if(cards.length != cardIDs.length) throw 'NOT_FOUND';
      
      await query(`
        UPDATE cards SET
          deckID = $2,
          modified = $4
        WHERE ID = ANY ($3) AND userID = $1
        RETURNING ID`,
        [userID, toDeckID, cardID, when]
      );

      // assemble a list of all affected decks
      let deckIDs = cards.map(card => card.deckid);
      deckIDs.push(toDeckID);
      let deckIDsUnique = Array.from(new Set(deckIDs));

      // mark them modified
      await query(
        `UPDATE decks SET modified = $3 WHERE ID = $2 AND userID = $1`,
        [userID, deckIDsUnique, when]
      );
      await commit();
      return res.rowCount;
    });
  },
  getCards(userID) {
    return pool.query(
      `SELECT ID, front, back, created, modified
       FROM cards WHERE userID = $1`,
      [userID]
    ).then(res => res.rows);
  }
}

/*===== Helper Functions =====*/

function throwIfEmpty(res) {
  if (res.rowCount < 1)
    throw 'NOT_FOUND';
  return res;
}

async function transaction(execute) {
  let client = await pool.connect();
  let query = client.query.bind(client);
  let commit = () => query('COMMIT');
  let rollback = () => query('ROLLBACK');
  try {
    await query('BEGIN');
    return await execute(query, commit, rollback);
  } catch(e) {
    await rollback();
    throw e;
  } finally { client.release() }
}

// check to see if there is in fact a deck with the given ID
// associated with the given user
function checkDeckWithUser(deckID, userID, query) {
  return query(
    'SELECT 1 from decks WHERE userID = $1 AND ID = $2',
    [userID, deckID]
  ).then(throwIfEmpty);
}

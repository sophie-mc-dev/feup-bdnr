const { connectToCouchbase } = require("../db/connection");
const uuid = require('uuid');

async function getPurchasesByUserId(req, res) {
  const user_id = req.params.user_id;
  const query = `
        SELECT t.*, ARRAY_SUM(ARRAY item.quantity * item.ticket_price FOR item IN t.items END) AS total_price
        FROM transactions AS t
        WHERE user_id = $1 AND t.transaction_status = $2
    `;
  const options = { parameters: [user_id, "purchased"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getShoppingCartByUserId(req, res) {
  const user_id = req.params.user_id;
  const query =
    "SELECT RAW items FROM transactions WHERE user_id = $1 AND transaction_status = $2";
  const options = { parameters: [user_id, "shopping_cart"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function addItemToCart(req, res) {
  const { user_id, item } = req.body;
  item.quantity = 1;

  // Check if user has a shoppingCart
  const checkQuery = `
      SELECT RAW transactions FROM transactions WHERE user_id = $1 AND transaction_status = $2
  `;
  const checkOptions = { parameters: [user_id, "shopping_cart"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(checkQuery, checkOptions);

    if (result.rows.length === 0) { // create new cart for the user
      const id = uuid.v4();
      const shopping_cart_doc = {
        transaction_id: id,
        transaction_date: new Date().toISOString().slice(0, 19),
        transaction_status: "shopping_cart",
        user_id: user_id,
        items: [item],
      };

      const transactionsCollection = bucket.scope('_default').collection('transactions');
      await transactionsCollection.upsert(id, shopping_cart_doc);
    }
    else {
      // verify if items has the new item
      const cart = result.rows[0];
      const items = cart.items;
      const itemIndex = items.findIndex((i) => i.event_id === item.event_id && i.ticket_type === item.ticket_type);

      if (itemIndex === -1) {
        items.push(item);
      } else {
        items[itemIndex].quantity += 1;
      }
      const updateQuery = `UPDATE transactions SET items = $1 WHERE transaction_id = $2`;
      await bucket.defaultScope().query(updateQuery, {parameters: [items, cart.transaction_id]});
    }
    return res.json({message: "Added item"});

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteItemFromCart(req, res) {
  const { user_id, item_index } = req.params;

  const query = `
    UPDATE transactions 
    SET items = ARRAY_REMOVE(items, items[${item_index}]) 
    WHERE user_id = $1 AND transaction_status = $2 
    RETURNING items
  `;

  const options = { parameters: [user_id, "shopping_cart"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateCartItemQuantity(req, res) {
  const { user_id, item_index } = req.params;
  const { quantity } = req.body;

  const query = `
    UPDATE transactions 
    SET items[${item_index}].quantity = $1 
    WHERE user_id = $2 AND transaction_status = $3 
    RETURNING items
  `;
  const options = { parameters: [quantity, user_id, "shopping_cart"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteShoppingCart(req, res) {
  const { user_id } = req.params;

  const query = `
    UPDATE transactions 
    SET items = [] 
    WHERE user_id = $1 AND transaction_status = $2 
    RETURNING items
    `;
  const options = { parameters: [user_id, "shopping_cart"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getUpcomingTicketsByUserId(req, res) {
  const user_id = req.params.user_id;
  const query = `
      SELECT i.event_id, i.event_name, i.event_date, i.ticket_type, SUM(i.quantity) AS quantity
      FROM transactions AS t 
      UNNEST items AS i
      WHERE t.user_id=$1 AND t.transaction_status=$2 AND MILLIS(i.event_date) >= NOW_MILLIS()
      GROUP BY i.event_id, i.ticket_type, i.event_name, i.event_date
      ORDER BY i.event_date, i.event_name
    `;
  const options = { parameters: [user_id, "purchased"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getPastTicketsByUserId(req, res) {
  const user_id = req.params.user_id;
  const query = `
      SELECT i.event_id, i.event_name, i.event_date, i.ticket_type, SUM(i.quantity) AS quantity
      FROM transactions AS t 
      UNNEST items AS i
      WHERE t.user_id=$1 AND t.transaction_status=$2 AND MILLIS(i.event_date) < NOW_MILLIS()
      GROUP BY i.event_id, i.ticket_type, i.event_name, i.event_date
      ORDER BY i.event_date DESC, i.event_name ASC
    `;
  const options = { parameters: [user_id, "purchased"] };

  try {
    const { bucket } = await connectToCouchbase();
    const result = await bucket.defaultScope().query(query, options);
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getPurchasesByUserId,
  getShoppingCartByUserId,
  deleteItemFromCart,
  updateCartItemQuantity,
  deleteShoppingCart,
  getUpcomingTicketsByUserId,
  getPastTicketsByUserId,
  addItemToCart
};

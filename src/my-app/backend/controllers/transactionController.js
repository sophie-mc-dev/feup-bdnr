const { connectToCouchbase } = require('../db/connection');

async function getPurchasesByUserId(req, res) {
    const user_id = req.params.user_id;
    const query = `
        SELECT t.*, ARRAY_SUM(ARRAY item.quantity * item.ticket_price FOR item IN t.items END) AS total_price
        FROM transactions AS t
        WHERE user_id = $1 AND t.transaction_status = $2
    `
    ;

    const options = {parameters: [user_id, 'purchased']}

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.defaultScope().query(query, options);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}


async function getShoppingCartByUserId(req, res) {
    const user_id = req.params.user_id;
    const query = 'SELECT * FROM transactions WHERE user_id = $1 AND transaction_status = $2';
    const options = {parameters: [user_id, 'shopping_cart']}

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.defaultScope().query(query, options);
        res.json(result.rows.map(row => row.transactions));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getTicketsByUserId(req, res) {
    const user_id = req.params.user_id;
    const query = `
      SELECT i.event_id, i.event_name, i.ticket_type, SUM(i.quantity) AS quantity
      FROM transactions AS t 
      UNNEST items AS i
      WHERE t.user_id=$1 AND t.transaction_status=$2
      GROUP BY i.event_id, i.ticket_type, i.event_name
      ORDER BY i.event_name, i.ticket_type
    `;
    const options = {parameters: [user_id, 'purchased']}
  
    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.defaultScope().query(query, options);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
  
module.exports = {
    getPurchasesByUserId,
    getShoppingCartByUserId,
    getTicketsByUserId
};
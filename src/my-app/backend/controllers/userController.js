const { connectToCouchbase } = require('../db/connection');
const uuid = require('uuid');

async function getAnalytics(result, userId, startDate, endDate) {
    //get the total income of the organization
    const query2 = `
        SELECT SUM(item.ticket_price * item.quantity) AS total_income
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
    `
    const options = { parameters: [userId] };
    const { cluster } = await connectToCouchbase();
    const revenue = await cluster.query(query2, options);
    result.rows[0].total_income = revenue.rows[0].total_income;

    //get the best selling event
    const query3 = `
        SELECT event.event_name, SUM(item.quantity) AS total_tickets_sold
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        GROUP BY event.event_name
        ORDER BY total_tickets_sold DESC
        LIMIT 1    
    `
    const best_selling_event = await cluster.query(query3, options);
    result.rows[0].best_selling_event = best_selling_event.rows[0];

    // get total number of tickets sold and total number of events hosted
    const query4 = `
        SELECT COUNT(DISTINCT event.event_id) AS total_events_hosted, SUM(item.quantity) AS total_tickets_sold
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
    `
    const total_tickets = await cluster.query(query4, options);
    result.rows[0].total_events_hosted = total_tickets.rows[0].total_events_hosted;
    result.rows[0].total_tickets_sold = total_tickets.rows[0].total_tickets_sold;

    //get the total number of tickets sold by ticket type
    const query5 = `
        SELECT item.ticket_type, SUM(item.quantity) AS quantity
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        GROUP BY item.ticket_type
        ORDER BY quantity DESC
    `
    const tickets_sold_by_ticket_type = await cluster.query(query5, options);
    result.rows[0].tickets_sold_by_ticket_type = tickets_sold_by_ticket_type.rows;

    //get the total revenue by ticket type
    const query6 = `
        SELECT item.ticket_type, SUM(item.ticket_price * item.quantity) AS total_income
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        GROUP BY item.ticket_type
        ORDER BY total_income DESC
    `
    const revenue_by_ticket_type = await cluster.query(query6, options);
    result.rows[0].revenue_by_ticket_type = revenue_by_ticket_type.rows;



    // income from date range but append a "Z"
    const query7 = `
        SELECT SUM(item.ticket_price * item.quantity) AS total_income
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND STR_TO_MILLIS(CONCAT(txn.transaction_date, 'Z')) BETWEEN STR_TO_MILLIS(CONCAT($2, 'Z')) AND STR_TO_MILLIS(CONCAT($3, 'Z'))
        
    `
    console.log("startDate", startDate)
    console.log("endDate", endDate)
    const date = new Date();

    const options2 = { parameters: [userId, startDate, endDate] };
    const income_from_date_range = await cluster.query(query7, options2);
    result.rows[0].income_from_date_range = income_from_date_range.rows[0].total_income;

    // get the total number of tickets sold by date range
    const query8 = `
        SELECT COUNT(*) AS total_tickets_sold
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND STR_TO_MILLIS(CONCAT(txn.transaction_date, 'Z')) BETWEEN STR_TO_MILLIS(CONCAT($2 , 'Z')) AND STR_TO_MILLIS(CONCAT($3 , 'Z'))
    `
    const tickets_sold_by_date_range = await cluster.query(query8, options2);
    result.rows[0].tickets_sold_by_date_range = tickets_sold_by_date_range.rows[0].total_tickets_sold;

    return result;
}

// login user
async function loginUser(req, res) {
    const query = 'SELECT user_id,  is_organization, username, name FROM users WHERE (username = $1 AND `password` = $2) OR (email = $1 AND `password` = $2)';
    const params = {parameters: [req.body.username.toLowerCase(), req.body.password]};

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query, params);
        if (!result.rows.length) {
            res.json({ "error": "Invalid username or password" });
        }
        else {
            res.json(result.rows[0]);
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// register user
async function registerUser(req, res) {
    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        return res.json({ "error": "Invalid email format" });
    }

    // verify if username or email already exists
    const query = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    let params = [req.body.username.toLowerCase(), req.body.email.toLowerCase()];
    
    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query, {
            parameters: params
        });
        if (result.rows.length) {
            return res.json({ "error":  "Username or email already exists" })
        }

        const id = uuid.v4()
        const user = {
            "user_id": id,
            "name": req.body.name,
            "username": req.body.username.toLowerCase(),
            "email": req.body.email.toLowerCase(),
            "password": req.body.password,
            "is_organization": req.body.is_organization || false,
            "liked_events": [],
            "comments": []
        }

        const usersCollection = bucket.scope('_default').collection('users');
        await usersCollection.upsert(id , user);
        res.json({user_id: id, is_organization: user.is_organization, username: user.username,
            name: user.name
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// update user
async function updateUser(req, res) {
    const { user_id, name, username, email, password } = req.body;

    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.json({ "error": "Invalid email format" });
    }

    const query1 = 'SELECT * FROM users WHERE (username = $1 OR email = $2) AND user_id != $3';
    const params1 = [username.toLowerCase(), email.toLowerCase(), user_id];

    try {
        const { bucket } = await connectToCouchbase();
        const result = await bucket.scope('_default').query(query1, {
            parameters: params1
        });
        if (result.rows.length) {
            return res.json({ "error":  "Username or email already exists" })
        }

        let query_update = 'UPDATE users SET name = $1, username = $2, email = $3';
        let params = [name, username.toLowerCase(), email.toLowerCase()];

        if (password !== '') {
            params.push(password);
            query_update += ', password = $' + params.length;
        }

        params.push(user_id);
        query_update += ' WHERE user_id = $' + params.length;

        await bucket.scope('_default').query(query_update, {
            parameters: params
        });
        res.json({ "message": "User updated successfully" });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// get user profile
async function getUserById(req, res) {
    let userId = req.params.user_id;
    const query = 'SELECT name, username, is_organization, email FROM users WHERE user_id = $1';
    const params = {parameters: [userId]};

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query, params);
        if (!result) {
            res.status(404).send('User not found');
        } else {
            // check if user is organization
            if (result.rows[0].is_organization){
                // if the start and end date are provided, get the analytics
                const startDate = req.query.startDate;
                const endDate = req.query.endDate;
                result = await getAnalytics(result, userId, startDate, endDate);
            }
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    loginUser,
    registerUser,
    getUserById, 
    updateUser
};
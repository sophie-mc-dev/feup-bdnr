const { connectToCouchbase } = require('../db/connection');
const uuid = require('uuid');

async function getTotalIncome(req, res) {
    const userId = req.params.user_id;

    const query2 = `
        SELECT SUM(item.ticket_price * item.quantity) AS total_income
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND txn.transaction_status = "purchased"
    `;
    const options = { parameters: [userId] };

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query2, options);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getBestSellingEventByOrganizationId(req, res) {
    const userId = req.params.user_id;

    const query2 = `
        SELECT event.event_name, SUM(item.quantity) AS total_tickets_sold
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND txn.transaction_status = "purchased"
        GROUP BY event.event_name
        ORDER BY total_tickets_sold DESC
        LIMIT 1 
    `;
    const options = { parameters: [userId] };

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query2, options);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getTotalEventsHostedByOrganizationId (req, res) {
    const userId = req.params.user_id;

    const query2 = `
        SELECT COUNT(DISTINCT event.event_id) AS total_events_hosted, SUM(item.quantity) AS total_tickets_sold
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND txn.transaction_status = "purchased"
    `;
    const options = { parameters: [userId] };

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query2, options);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getTotalTicketsPerTypePerOrganizationId (req, res) {
    const userId = req.params.user_id;

    const query2 = `
        SELECT item.ticket_type, SUM(item.quantity) AS quantity
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND txn.transaction_status = "purchased"
        GROUP BY item.ticket_type
        ORDER BY quantity DESC
    `;
    const options = { parameters: [userId] };

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query2, options);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getTotalRevenueByTicketType(req, res) {
    const userId = req.params.user_id;

    const query2 = `
        SELECT item.ticket_type, SUM(item.ticket_price * item.quantity) AS total_income
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND txn.transaction_status = "purchased"
        GROUP BY item.ticket_type
        ORDER BY total_income DESC
    `;
    const options = { parameters: [userId] };

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query2, options);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getIncomeFromRangeDate(req, res) {
    const userId = req.params.user_id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const query2 = `
        SELECT SUM(item.ticket_price * item.quantity) AS total_income
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND txn.transaction_status = "purchased"
        AND txn.transaction_date BETWEEN $2 AND $3 
    `;
    const options = { parameters: [userId, startDate, endDate] };

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query2, options);
        res.json(result.rows[0].total_income);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getTicketsSoldFromRangeDate(req, res) {
    const userId = req.params.user_id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const query2 = `
        SELECT COUNT(DISTINCT event.event_id) AS total_events_hosted, SUM(item.quantity) AS total_tickets_sold
        FROM event_shop._default.transactions AS txn
        UNNEST txn.items AS item
        JOIN event_shop._default.events AS event ON item.event_id = event.event_id
        WHERE event.organization_id = $1
        AND txn.transaction_status = "purchased"
        AND txn.transaction_date BETWEEN $2 AND $3 
    `;
    const options = { parameters: [userId, startDate, endDate] };

    try {
        const { bucket } = await connectToCouchbase();
        let result = await bucket.scope('_default').query(query2, options);
        res.json(result.rows[0].total_tickets_sold);
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// login user
async function loginUser(req, res) {
    const query = 'SELECT user_id,  is_organization, liked_events FROM users WHERE (username = $1 AND `password` = $2) OR (email = $1 AND `password` = $2)';
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
        res.json({user_id: id, is_organization: user.is_organization, liked_events: user.liked_events
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
            query_update += ', `password` = $' + params.length;
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
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

// delete user by id
async function deleteUser(req, res) {
    let user_id = req.body.user_id;
    const query_delete_user = 'DELETE FROM users WHERE user_id = $1'; 
    const query_delete_transactions = 'DELETE FROM transactions WHERE user_id = $1';
    const params = {parameters: [user_id]};

    try {
        const { bucket } = await connectToCouchbase();
        const result1 = await bucket.scope('_default').query(query_delete_transactions, params);
        const result2 = await bucket.scope('_default').query(query_delete_user, params);
        res.json({ "message": "User deleted successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function likeEvent(req, res) {
    const { user_id, event_id } = req.body;

    const query_user = 'UPDATE users SET liked_events = ARRAY_CONCAT([$1], liked_events) WHERE user_id = $2 RETURNING RAW liked_events';
    const query_user_options = {parameters: [event_id, user_id]};

    const query_event = 'UPDATE events SET num_likes = num_likes + 1 WHERE event_id = $1';
    const query_event_options = {parameters: [event_id]};

    try {
        const { bucket } = await connectToCouchbase();
        const response = await bucket.scope('_default').query(query_user, query_user_options);
        await bucket.scope('_default').query(query_event, query_event_options);
        res.json(response.rows[0]);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function dislikeEvent(req, res) {
    const { user_id, event_id } = req.body;

    const query_user = 'UPDATE users SET liked_events = ARRAY_REMOVE(liked_events, $1) WHERE user_id = $2 RETURNING RAW liked_events';
    const query_user_options = {parameters: [event_id, user_id]};

    const query_event = 'UPDATE events SET num_likes = num_likes - 1 WHERE event_id = $1';
    const query_event_options = {parameters: [event_id]};

    try {
        const { bucket } = await connectToCouchbase();
        const response = await bucket.scope('_default').query(query_user, query_user_options);
        await bucket.scope('_default').query(query_event, query_event_options);
        res.json(response.rows[0]);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
} 

module.exports = {
    loginUser,
    registerUser,
    getUserById, 
    updateUser, 
    deleteUser,
    likeEvent,
    dislikeEvent,
    getTotalIncome,
    getBestSellingEventByOrganizationId,
    getTotalEventsHostedByOrganizationId,
    getTotalTicketsPerTypePerOrganizationId,
    getTotalRevenueByTicketType,
    getIncomeFromRangeDate,
    getTicketsSoldFromRangeDate
};
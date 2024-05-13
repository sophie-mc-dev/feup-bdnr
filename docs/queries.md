# Queries
This document contains a set of N1QL queries organized into sections that correspond to a specific collection within the database, such as 'categories', 'locations', 'artists', 'users', 'events' and 'transactions'.

## Categories Collection Queries

- Get all category names
```n1ql
SELECT category_name 
FROM `categories` 
ORDER BY category_name
```


## Locations Collection Queries
- Get all location names
```n1ql
SELECT city_name 
FROM `locations` 
ORDER BY city_name
```


## Artists Collection Queries

- Get information of all artists (*name*, *top5_musics* and *biography*)
```n1ql
SELECT * 
FROM `artists` 
ORDER BY artist_name ASC
```

- Get the names of all artists
```n1ql
SELECT artist_name 
FROM `artists` 
ORDER BY artist_name ASC
```


## Users Collection Queries

- **Authenticate** user using username/email and password
```n1ql
SELECT user_id,  is_organization, username, name 
FROM users 
WHERE (username = "john_doe" AND `password` = "password") OR (email = "john_doe" AND `password` = "password")
```

- Before creating a new user account, verify if there is any user with the provided username or email
```n1ql
SELECT * 
FROM users 
WHERE username = LOWER("John_Doe") OR email = LOWER("John_Doe@example.com")
```

- **Register** a new user
```n1ql
INSERT INTO users (KEY, VALUE)
VALUES ("new_user_id", { 
    "user_id": "new_user_id",
    "name": "John Doe",
    "username": "john_doe",
    "email": "john_doe@example.com",
    "password": "my_password",
    "is_organization": false,
    "liked_events": [],
    "comments": []
})
```

- Before updating the information of a specific user, verify if there is any user with the provided username or email
```n1ql
SELECT * FROM users 
WHERE (username = "john_doe" OR email = "john_doe@gmail.com") AND user_id != "123"
```

- **Update** an existing user profile by providing *user_id*
```n1ql
UPDATE users 
SET name = "Mary Jane", username = "mary_jane", email = "mary_jane@example.com", `password` = "123456"
WHERE user_id = "123";
```

- Get **user information** by providing *user_id*
```n1ql
SELECT name, username, email 
FROM users 
WHERE user_id = "123"
```

- Get **user comments** by providing *user_id*
```n1ql
SELECT raw comments as c 
FROM users 
WHERE user_id = "123" 
ORDER BY MILLIS(c.date) DESC
```

- **Delete user** by providing *user_id*
```n1ql
DELETE FROM users 
WHERE user_id = "123"
```

- **Like an event** by providing the *user_id* and *event_id* 
```n1ql
UPDATE users 
SET liked_events = ARRAY_CONCAT(["1"], liked_events) 
WHERE user_id = "123" 
RETURNING RAW liked_events
```

- **Dislike an event** by providing the *user_id* and *event_id* 
```n1ql
UPDATE users 
SET liked_events = ARRAY_REMOVE(liked_events, "1") 
WHERE user_id = "123" 
RETURNING RAW liked_events
```

- Get **event comments** by providing *event_id*
```n1ql
SELECT u.name as user_name, u.user_id, c.*
FROM users AS u
UNNEST u.comments AS c
WHERE c.event_id = "1"
ORDER BY MILLIS(c.date) DESC
```

- Add **new comment** to a specific event
```n1ql
UPDATE users 
SET comments = ARRAY_APPEND(comments, { 
    "comment_id": "new_comment_id",
    "date": "2024-05-12",
    "text": "New comment text",
    "event_id": "1",
    "event_name": "Event Name"
})
WHERE user_id = "123";
```

- **Delete comment** by providing comment_index and user_id
```n1ql
UPDATE users 
SET comments = ARRAY_REMOVE(comments, comments[0]) 
WHERE user_id = "123"
```

- **Edit a comment** by providing comment_index and user_id
```n1ql
UPDATE users 
SET comments[1].text = "This is the new comment text"
WHERE user_id = "123"
RETURNING comments
```


## Events Collection Queries

- Get **upcoming events** 
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM events
WHERE MILLIS(date) >= NOW_MILLIS()
ORDER BY MILLIS(date)
LIMIT 8
OFFSET 0
```

- Get **event information** by providing *event_id*
```n1ql
SELECT * 
FROM events
WHERE event_id = "1"
```

### Filter Events

**Note**: in these queries, there is a condition searching for *event_id*. This happens because we are getting the ID's from a previously obtained array of results. Here is how we get this array, which can be seen in the **eventController.js** file:
```js
async function ftsMatchWord(term) {
  const { cluster, couchbase } = await connectToCouchbase()

  const result = await cluster.searchQuery('event_shop._default.eventSearch', 
                                            couchbase.SearchQuery.match(term));

  return result

}
```
This uses the FTS (Full-Text Search) index we created, a feature made accessible on Couchbase, and returns the results which match the searched term. Then, we iterate over the different elements of the result and iterate over the obtained *event_id*'s.

- **Filter events** according to location, category, date, search word and sort them by date
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM event_shop._default.events 
WHERE DATE_FORMAT_STR(date, '1111-11-11') = "2024-02-15" 
AND "Music" IN categories
AND location = "Porto"
AND (event_id=1 OR event_id=2 OR event_id=3)
ORDER BY MILLIS(date) ASC
```

- **Filter events** according to location, category, date, search word and sort them by popularity
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM event_shop._default.events 
WHERE DATE_FORMAT_STR(date, '1111-11-11') = "2024-02-15" 
AND "Music" IN categories
AND location = "Porto"
AND (event_id=1 OR event_id=2 OR event_id=3)
ORDER BY num_likes DESC, date ASC, event_name ASC
```

- **Filter events** according to location, category, date, search word and sort them by price (ascending)
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM event_shop._default.events 
WHERE DATE_FORMAT_STR(date, '1111-11-11') = "2024-02-15" 
AND "Music" IN categories
AND location = "Porto"
AND (event_id=1 OR event_id=2 OR event_id=3)
ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) ASC, date ASC, event_name ASC
```

- **Filter events** according to location, category, date, search word and sort them by price (descending)
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM event_shop._default.events 
WHERE DATE_FORMAT_STR(date, '1111-11-11') = "2024-02-15" 
AND "Music" IN categories
AND location = "Porto"
AND (event_id=1 OR event_id=2 OR event_id=3)
ORDER BY ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) DESC, date ASC, event_name ASC
```

- Get a user's favorite events by providing the *user_id*
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM events
WHERE ARRAY_CONTAINS (
    (SELECT RAW event_id 
    FROM users as u
    UNNEST liked_events AS event_id
    WHERE u.user_id = "123"), 
    event_id    
)
```

-  Get past events associated with a specific *organization_id*
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM events
WHERE organization_id="124" AND MILLIS(date) < NOW_MILLIS()
ORDER BY MILLIS(date) DESC
```

-  Get upcoming events associated with a specific *organization_id*
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM events
WHERE organization_id="124" AND MILLIS(date) >= NOW_MILLIS()
ORDER BY MILLIS(date) ASC
```

- Get events associated with a specific artist by providing their *artist_id*
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM events
WHERE ARRAY_CONTAINS (
    (SELECT RAW event_id 
    FROM artists as a
    UNNEST a.event_ids AS event_id
    WHERE a.artist_id = "1"), 
    event_id    
)
ORDER BY MILLIS(date) ASC
```

- Increase the number of likes of an event when a user likes it
```n1ql
UPDATE events 
SET num_likes = num_likes + 1 
WHERE event_id = "1"
```

- Decrease the number of likes of an event when a user dislikes it
```n1ql
UPDATE events 
SET num_likes = num_likes - 1 
WHERE event_id = "1"
```

## Transactions Collection Queries
- Get purchases of a user by providing the *user_id*
```n1ql
SELECT t.*, ARRAY_SUM(ARRAY item.quantity * item.ticket_price FOR item IN t.items END) AS total_price
FROM transactions AS t
WHERE user_id = "123" AND t.transaction_status = "purchased"
```

- Purchase tickets on the shopping cart by providing the *user_id*
```n1ql
UPDATE transactions 
SET transaction_status = "purchased", transaction_date = "2024-05-12T12:50:00"
WHERE user_id = "123" AND transaction_status = "shopping_cart"
```

- Get items on the shopping cart of a user by providing the *user_id*
```n1ql
SELECT RAW items 
FROM transactions 
WHERE user_id = "123" AND transaction_status = "shopping_cart"
```

- Add item to the shopping cart by providing the *user_id*
```n1ql
UPDATE transactions 
SET items = ARRAY_APPEND(items, { 
    "event_id": "91",
    "event_name": "Whimsical Technology Seminar",
    "event_date": "2024-10-06T18:00:00",
    "ticket_type": "Regular Ticket",
    "ticket_price": 50,
    "quantity": 1
})
WHERE user_id = "123" and transaction_status="shopping_cart";
```

- Delete item from the shopping cart by providing the item index and *user_id*
```n1ql
UPDATE transactions 
SET items = ARRAY_REMOVE(items, items[0]) 
WHERE user_id = "123" AND transaction_status = "shopping_cart"
RETURNING items
```

- Update cart item quantity by providing the *user_id*, quantity and item index
```n1ql
UPDATE transactions 
SET items[0].quantity = 3 
WHERE user_id = "123" AND transaction_status = "shopping_cart"
RETURNING items
```

- Empty shopping cart of a specific user by providing the *user_id*
```n1ql
UPDATE transactions 
SET items = [] 
WHERE user_id = "123" AND transaction_status = "shopping_cart" 
RETURNING items
```

- Get tickets for upcoming events by providing the *user_id*
```n1ql
SELECT i.event_id, i.event_name, i.event_date, i.ticket_type, SUM(i.quantity) AS quantity
FROM transactions AS t 
UNNEST items AS i
WHERE t.user_id="123" AND t.transaction_status="purchased" AND MILLIS(i.event_date) >= NOW_MILLIS()
GROUP BY i.event_id, i.ticket_type, i.event_name, i.event_date
ORDER BY i.event_date, i.event_name
```

- Get tickets for past events by providing the *user_id*
```n1ql
SELECT i.event_id, i.event_name, i.event_date, i.ticket_type, SUM(i.quantity) AS quantity
FROM transactions AS t 
UNNEST items AS i
WHERE t.user_id="123" AND t.transaction_status="purchased" AND MILLIS(i.event_date) < NOW_MILLIS()
GROUP BY i.event_id, i.ticket_type, i.event_name, i.event_date
ORDER BY i.event_date DESC, i.event_name ASC
```

- Delete transactions of a specific user by providing the *user_id*
```n1ql
DELETE FROM transactions 
WHERE user_id = "123"
```

## Organization Analytics Queries
- Get the total income of the organization by providing the *organization_id*
```n1ql
SELECT SUM(item.ticket_price * item.quantity) AS total_income
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.organization_id = $1
AND txn.transaction_status = "purchased"
```

- Get the best selling event of the organization by providing the *organization_id*
```n1ql
SELECT event.event_name, SUM(item.quantity) AS total_tickets_sold
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.organization_id = $1
AND txn.transaction_status = "purchased"
GROUP BY event.event_name
ORDER BY total_tickets_sold DESC
LIMIT 1
```

- Get the total number of sold tickets, as well as the total number of events hosted by providing the *organization_id*
```n1ql
SELECT COUNT(DISTINCT event.event_id) AS total_events_hosted, SUM(item.quantity) AS total_tickets_sold
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.organization_id = $1
AND txn.transaction_status = "purchased"
```

- Get the total number of sold tickets by ticket type by providing the *organization_id*
```n1ql
SELECT item.ticket_type, SUM(item.quantity) AS quantity
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.organization_id = $1
AND txn.transaction_status = "purchased"
GROUP BY item.ticket_type
ORDER BY quantity DESC
```

- Get the total income by ticket type by providing the *organization_id*
```n1ql
SELECT item.ticket_type, SUM(item.ticket_price * item.quantity) AS total_income
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.organization_id = $1
AND txn.transaction_status = "purchased"
GROUP BY item.ticket_type
ORDER BY total_income DESC
```

- Get the total income in an interval of time by providing a *startDate*, *endDate* and the *organization_id*
```n1ql
SELECT SUM(item.ticket_price * item.quantity) AS total_income
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.organization_id = $1
AND txn.transaction_status = "purchased"
AND txn.transaction_date BETWEEN $2 AND $3
```

## Organized Events Queries
- Get the total income from the event by providing the *event_id*
```n1ql
SELECT event.event_id, event.event_name, SUM(item.ticket_price * item.quantity) AS total_income
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.event_id = $1
AND txn.transaction_status = "purchased"
GROUP BY event.event_id, event.event_name
```

- Get the total income from the event by ticket type by providing the *event_id*
```n1ql
SELECT item.ticket_type, SUM(item.ticket_price * item.quantity) AS revenue
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.event_id = $1
AND txn.transaction_status = "purchased"
GROUP BY item.ticket_type
```

- Get the total number of sold tickets by providing the *event_id*
```n1ql
SELECT SUM(item.quantity) AS totalTicketsSold
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
AND txn.transaction_status = "purchased"
WHERE event.event_id = $1
```

- Get the total number of sold tickets by ticket type by providing the *event_id*
```n1ql
SELECT item.ticket_type, SUM(item.quantity) AS quantity
FROM event_shop._default.transactions AS txn
UNNEST txn.items AS item
JOIN event_shop._default.events AS event ON item.event_id = event.event_id
WHERE event.event_id = $1
AND txn.transaction_status = "purchased"
GROUP BY item.ticket_type
ORDER BY quantity DESC
```
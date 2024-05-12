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

```

- Before updating the information of a specific user, verify if there is any user with the provided username or email
```n1ql
SELECT * FROM users 
WHERE (username = "john_doe" OR email = "john_doe@gmail.com") AND user_id != "123"
```

- **Update** an existing user profile by providing *user_id*
```n1ql
UPDATE users 
SET name = "Mary Jane", username = "mary_jane", email = "mary_jane@example.com", password = "123456"
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
```

- Delete comment by providing comment_index and user_id
```n1ql
UPDATE users 
SET comments = ARRAY_REMOVE(comments, comments[0]) 
WHERE user_id = "123"
```

- Edit a comment by providing comment_index and user_id
```n1ql
UPDATE users 
SET comments[1].text = "This is the new comment text"
WHERE user_id = "123"
RETURNING comments
```


## Events Collection Queries

- Get upcoming events to display on Home page
```n1ql
SELECT event_id, event_name, date, location, categories, num_likes, ARRAY_MIN(ARRAY ticket.price FOR ticket IN ticket_types END) AS min_price
FROM events
WHERE MILLIS(date) >= NOW_MILLIS()
ORDER BY MILLIS(date)
LIMIT 8
OFFSET 0
```

- Get event information by providing *event_id*
```n1ql
SELECT * 
FROM events
WHERE event_id = "1"
```

- Filter events according to location, category, date, search word and sort them by date
```n1ql
```

- Filter events according to location, category, date, search word and sort them by popularity
```n1ql
```

- Filter events according to location, category, date, search word and sort them by price (ascending)
```n1ql
```

- Filter events according to location, category, date, search word and sort them by price (descending)
```n1ql
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



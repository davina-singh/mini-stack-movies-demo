import Database from "better-sqlite3";
// hook up databae.db to get methods (functions attached to objects)
const db = new Database("database.db");
// .exec executes some sql query
// you must use backticks - UPPERCASE USED FOR COMMANDS, values in lowercase (preference for reading)
db.exec(`CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    movie TEXT,
    year INTEGER,
    imgURL TEXT
)`);

// PRIMARY KEY flags the id as the records unique identifier
// AUTOINCREMENT - starts at 1 and then adds one to each new record after that

db.exec(`
    INSERT into movies (movie, year, imgURL)
    VALUES
    ('Black Narcissus', 1947, 'https://posters.movieposterdb.com/07_11/1947/39192/l_39192_20b67beb.jpg'),
    ('Ran', 1985, 'https://posters.movieposterdb.com/23_04/1985/89881/s_ran-movie-poster_0c1ca44d.jpg'),
    ('Day of Wrath', 1943, 'https://posters.movieposterdb.com/06_06/2006/0353357/s_117556_0353357_cc44db9e.jpg')
`);

import express from "express"
import cors from "cors"
import Database from "better-sqlite3"
const PORT = '8080'
// instantiate the database (create a new instance of an object)
const db = new Database('database.db')
// intitlaise the app by invoking express 
const app = express() 
app.use(express.json()) // parses incoming json request
app.use(cors()) // tell the server to accept requests 
// root route
app.get('/', (req, res) => {
    res.send('This is my root route')
    // send json back 
    // res.json({spooked: true})
    // send a status code back
    // res.status(200)
})
// this is post which matches the endpoint that was sent from the client's request
app.post('/movies', (req, res) => {
    try {
        const movie = req.body.movie // we can do this notation because the json was parsed with app.use(express.json)
        const year = req.body.year
        const imgUrl = req.body.imgURL
        // run the sql statement
        const newMovie = db.prepare(`INSERT INTO movies (movie, year, imgURL) VALUES (?, ?, ?)`). run(movie, year, imgUrl) // these are the columsn in the table that happen to have the same names as those on the input form
        res.status(200).json(newMovie)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

app.get('/movies', (req, res) => {
try { 
    // find a record by its id
    if(req.query.id) {
        let movie = db.prepare(`SELECT * FROM movies WHERE id = ?`).all(req.query.id)
        res.status(200).json(movie)
        // return early so that it does not run the code below
        return
    }
    // .prepare will take the sql statement for later (optimisation stuff) and runs when you call .all() 
    let movies = db.prepare(`SELECT * FROM movies`).all()
    res.status(200).json(movies)
} catch(err) {
    res.status(500).json(err)
}})

// DELETE ROUTE
app.delete('/movies/:id', (req, res) => {
    try {
        const id = req.params.id
        const deletedMovie = db.prepare('DELETE FROM movies WHERE id= ?').run(id)
        res.status(200).json({recordDeleted: deletedMovie})
    } catch (err) {
        res.status(500).json({error: err})
    }
}) // the colon means a different value will be passed each time which in this case is called the id

// UPDATE
app.put('/movies/:id', (req, res) => {
    try {
        const id = req.params.id
        const movie = req.body.movie
        const year = req.body.year
        const imgUrl = req.body.imgURL
        const updateMovies = db.prepare('UPDATE movies SET movie = ?, year = ?, imgURL = ? WHERE id = ?'). run(movie, year, imgUrl, id)
        res.status(200).json({messaged : updateMovies})
    } catch(err) {
        res.status(500).json({error: err})
    }
})

// the server do be listening 
app.listen('8080', () => {
    console.log('The server is working on PORT 8080')
})
const express = require("express")
const sqlite3 = require("sqlite3")

const app = express()
app.use(express.json())

const db = new sqlite3.Database("./todo.db")

app.get("/tasks", (req, res) => {
    db.serialize(() => {
        db.all("SELECT * FROM tasks;", (err, rows) => {
            if (err !== null) {
                console.log(err)
                res.statusCode = 500
                res.json(err)
            } else {
                const tasks = rows.map(row => {
                    return {
                        id: row.id,
                        content: row.content
                    }
                })
                res.json(tasks)
            }
        })
    })
})

app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params["id"])
    db.serialize(() => {
        db.get("SELECT * FROM tasks WHERE id = ?", id, (err, row) => {
            if (err !== null) {
                console.log(err)
                res.statusCode = 500
                res.json(err)
            } else if (row === undefined) {
                res.statusCode = 404
                res.end()
            } else {
                const task = {
                    id: row.id,
                    content: row.content
                }
                res.json(task)
            }
        })
    })
})

app.post("/tasks", (req, res) => {
    db.serialize(() => {
        const task = req.body
        db.run("INSERT INTO tasks (content) VALUES (?)", task.content, () => {
            res.end()
        })
    })
})

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params["id"])
    db.serialize(() => {
        db.run("DELETE FROM tasks WHERE id = ?", id, () => {
            res.end()
        })
    })
})

app.listen(3000, () => {
    console.log("server start")
})

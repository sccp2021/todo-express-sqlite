const express = require("express")
const sqlite3 = require("sqlite3")

const app = express()
app.use(express.json()) // 今回はTodoのデータをJsonでやりとりするため

const db = new sqlite3.Database("./todo.db") // sqlite3コマンドで作成したDBの名前を指定する

// タスク一覧の取得
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

// タスクの取得
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

// タスクの追加
app.post("/tasks", (req, res) => {
    db.serialize(() => {
        const task = req.body
        db.run("INSERT INTO tasks (content) VALUES (?)", task.content, (err) => {
            if (err !== null) {
                console.log(err)
                res.statusCode = 500
                res.json(err)
            } else {
                res.end()
            }
        })
    })
})

// タスクの削除
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params["id"])
    db.serialize(() => {
        db.run("DELETE FROM tasks WHERE id = ?", id, (err) => {
            if (err !== null) {
                console.log(err)
                res.statusCode = 500
                res.json(err)
            } else {
                res.end()
            }
        })
    })
})

app.listen(3000, () => {
    console.log("server start")
})

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "password",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items;

app.get("/", async (req, res) => {
  try {
    let result = await db.query("SELECT * FROM items");
    items = result.rows;
  } catch (err) {
    console.log(err);
  }

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query('INSERT INTO items (title) VALUES ($1)', [item]);
    res.redirect("/"); 
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  let id = req.body.updatedItemId;
  let newTitle = req.body.updatedItemTitle;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [newTitle, id]);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
let id = req.body.deleteItemId;
try {
  await db.query("DELETE FROM items WHERE id = ($1)", [id]);
} catch (err) {
  console.log(err);
}
res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

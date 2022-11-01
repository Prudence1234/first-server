const express = require("express")
var fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let json_data;

const app = express()

app.use(express.json())

// READ
//get
app.get("/api/contact/:id", (req, res) => {
    let id = req.params.id;
    let found = json_data.contact.filter(e => e.id == id)
    res.send(found)
})

// READ ALL

app.get("/api/contact", (req, res) => {
    res.send(json_data)
})

// CREATE
//post
app.post("/api/contact", (req, res) => {
    if (!req.body.contact || !req.body.name) {
        res.send("Please input all fields");
    } else {
        let new_contact = {
            id: uuidv4(),
            contact: req.body.contact,
            name: req.body.name
        }

        let contacts = json_data.contact;
        contacts.push(new_contact)
        json_data.contact = contacts;
        let new_json = JSON.stringify(json_data);
        fs.writeFile('database.json', new_json, 'utf8', () => {
            res.send("Contact added");
        });
    }
})

// UPDATE
// put
app.put("/api/contact", (req, res) => {
    if (!req.body.id || !req.body.contact || !req.body.name) {
        res.send("Please input all fields");
    }
    let update_id = req.body.id;
    let index_to_update = findIndex(update_id)

    let contacts = json_data.contact;
    contacts[index_to_update].contact = req.body.contact;
    contacts[index_to_update].name = req.body.name;
    json_data.contact = contacts;
    let new_json = JSON.stringify(json_data);
    fs.writeFile('database.json', new_json, 'utf8', () => {
        res.send("Contact Updated");
    });
})

// DELETE/SLICE
// delete
app.delete("/api/contact/:id", (req, res) => {

    let delete_id = req.params.id;
    let delete_index = findIndex(delete_id);
    let contacts = json_data.contact;
    contacts.splice(delete_index, 1)
    json_data.contact = contacts;
    let new_json = JSON.stringify(json_data);
    fs.writeFile('database.json', new_json, 'utf8', () => {
        res.send("Contact Deleted");
    });
})

function findIndex(id) {
    return json_data.contact.findIndex(e => e.id == id)
}
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    fs.readFile('./database.json', 'utf8', function (err, data) {
        if (err) throw err;
        json_data = JSON.parse(data);
    });
})
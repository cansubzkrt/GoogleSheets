const express = require('express');
const app = express();
const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.render("app");
});

app.post("/", async (req, res) => {

    const { request, name, surname } = req.body;

    const auth = new google.auth.GoogleAuth({

        keyFile: "credentials.json",

        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    // crate client instance for auth
    const client = await auth.getClient();

    // instance of Google Sheets API
    const googleSheets = google.sheets({version: "v4", auth: client });

    const spreadsheetId = "1lEgBUTASYfxkceM0nCnBd1661EcDFblr48e_5wYOu8o";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });



    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({

        auth,
        spreadsheetId,
        range: "Sayfa1!A:A"
    })


    // Write row(s) to spreadsheet
    await googleSheets.spreadsheets.values.append({

        auth,
        spreadsheetId,
        range: "Sayfa1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                [request, name, surname],
            ]
        }
    })


    res.send("Successfully submitted! Thank you!");
})

app.listen(3000,(req, res) =>{
    console.log("running on server");
})
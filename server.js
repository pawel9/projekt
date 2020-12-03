//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var zalogowany = false;
let users = [
    { id: 1, log: "AAA", pass: "PASS1", wiek: 10, uczen: "checked", plec: "M" },
    { id: 2, log: "BBB", pass: "PASS2", wiek: 11, uczen: "", plec: "K" },
    { id: 3, log: "CCC", pass: "PASS3", wiek: 14, uczen: "checked", plec: "K" }
]

//funkcje na serwerze obsługujace konkretne adresy w przeglądarce
var path = require("path")
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"));
})
app.get("/main", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/main.html"));
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/register.html"));
})

app.get("/admin", function (req, res) {
    if (zalogowany === true) {
        res.sendFile(path.join(__dirname + "/static/admin.html"));
    } else {
        res.sendFile(path.join(__dirname + "/static/admin1.html"));
    }
})

app.get("/handleRegister", function (req, res) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].log == req.query.log) {
            res.send("taki login jest juz w bazie danych");
            return;
        } else if (req.query.pass == "") {
            res.send("Nie podano hasła");
            //}else if(req.query.plec !== "K" || req.query.plec !== "M"){
            //       res.send("Nie zaznaczono płci");
        } else {
            var newID = users.length + 1;
            users.push({ id: newID, log: req.query.log, pass: req.query.pass, wiek: req.query.wiek, uczen: req.query.uczen, plec: req.query.plec });
            res.send("Witaj " + req.query.log + ", jesteś zarejestrowany")
            return;
        }
    }

})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/login.html"));
})

app.get("/handleLogin", function (req, res) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].log == req.query.log && users[i].pass == req.query.pass) {
            zalogowany = true;
            res.redirect("/admin");
            return;
        }
    }
    res.send("Wprowadzono złe dane");
})

app.get("/sort", function (req, res) {
    if (zalogowany == true) {
        var sorted = Array.from(users);
        var form = ``;
        if (req.query.sort == "rosnaco") {
            sorted.sort(function (a, b) {
                return parseFloat(a.wiek) - parseFloat(b.wiek);
            });
            form = `<form onchange="submit()"><input type="radio" name="sort" value="rosnaco" checked>rosnąco<input type="radio" name="sort" value="malejaco">malejąco</form>`;
        } else if (req.query.sort == "malejaco") {
            sorted.sort(function (a, b) {
                return parseFloat(b.wiek) - parseFloat(a.wiek);
            });
            form = `<form onchange="submit()"><input type="radio" name="sort" value="rosnaco" checked>rosnąco<input type="radio" name="sort" value="malejaco" checked>malejąco</form>`;
        } else {
            form = `<form onchange="submit()"><input type="radio" name="sort" value="rosnaco" >rosnąco<input type="radio" name="sort" value="malejaco">malejąco</form>`;
        }

        var href = `<div style="width:100%;height:60px;"><br><a style="padding:20px;font-size:20px;color:white;" href="sort"> sort </a> <a style="padding:20px;font-size:20px;color:white;" href="gender">gender </a> <a style="padding:20px;font-size:20px;color:white;" href="show">show </a><br><br></div>`;
        var result = "";
        var id = "";
        var wiek = "";
        for (var i = 0; i < sorted.length; i++) {
            id = sorted[i].id.toString();
            wiek = sorted[i].wiek.toString();
            var tr = `<tr><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">id:` + id + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">user: ` + sorted[i].log + " - " + sorted[i].pass + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">uczen: ` + sorted[i].uczen + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">wiek: ` + wiek + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">plec: ` + sorted[i].plec + `</td</tr>`;
            result += tr;
        }
        var table = `<table style="width:100%;">` + result + `</table>`;
        res.send(`<div style="width:100%;height:100%;background-color:#282828;font-size:20px;color:white;">` + href + form + table + `</div>`);
    } else {
        res.redirect("/admin");
    }
})

app.get("/show", function (req, res) {
    if (zalogowany == true) {
        var href = `<div style="width:100%;height:60px;"><br><a style="padding:20px;font-size:20px;color:white;" href="sort"> sort </a> <a style="padding:20px;font-size:20px;color:white;" href="gender">gender </a> <a style="padding:20px;font-size:20px;color:white;" href="show">show </a><br><br></div>`;
        var result = "";
        var id = "";
        var wiek = "";
        for (var i = 0; i < users.length; i++) {
            id = users[i].id.toString();
            wiek = users[i].wiek.toString();
            var tr = `<tr><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">id:` + id + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">user: ` + users[i].log + " - " + users[i].pass + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">uczen: ` + users[i].uczen + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">wiek: ` + wiek + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">plec: ` + users[i].plec + `</td</tr>`;
            result += tr;
        }
        var table = `<table style="width:100%;">` + result + `</table>`;
        res.send(`<div style="width:100%;height:100%;background-color:#282828;color:white;">` + href + table + `</div>`);
    } else {
        res.redirect("/admin");
    }
})

app.get("/gender", function (req, res) {
    if (zalogowany == true) {
        var href = `<div style="width:100%;height:60px;"><br><a style="padding:20px;font-size:20px;color:white;" href="sort"> sort </a> <a style="padding:20px;font-size:20px;color:white;" href="gender">gender </a> <a style="padding:20px;font-size:20px;color:white;" href="show">show </a><br><br></div>`;
        var resM = "";
        var resK = "";
        var id = "";
        for (var i = 0; i < users.length; i++) {
            id = users[i].id.toString();
            if (users[i].plec == "K") {
                var tr1 = `<tr><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">id:` + id + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">plec: ` + users[i].plec + `</td></tr>`;
                resK += tr1;
            } else {
                var tr2 = `<tr><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">id:` + id + `</td><td style="border:1px solid yellow;padding:8px;color:white;font-size:20px;">plec: ` + users[i].plec + `</td></tr>`;
                resM += tr2;
            }
        }
        var tableK = `<table style="width:100%;">` + resK + `</table>`;
        var tableM = `<table style="width:100%;">` + resM + `</table>`;

        res.send(`<div style="width:100%;height:100%;background-color:#282828;color:white;">` + href + tableK + "<br><br>" + tableM + `</div>`);
    } else {
        res.redirect("/admin");
    }
})

app.get("/logout", function (req, res) {
    zalogowany = false;
    res.redirect("/");
})

app.use(express.static('static'))

//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
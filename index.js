const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/ras_assignments_db')
const app = express()

app.use(express.json())
app.use(require('morgan')('dev'));
app.post('/api/rasUnits', async (req, res, next) => { });
app.get('/api/rasUnits', async (req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM rasUnits ORDER BY rasID');
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});
app.get('/api/rasAdmins', async (req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM rasAdmins ORDER BY name');
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});
app.get('/api/investigators', async (req, res, next) => {
    try {
        const response = await client.query('SELECT * FROM investigators ORDER BY name');
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});
app.put('/api/rasUnits/:id', async (req, res, next) => { });
app.delete('/api/rasUnits/:id', async (req, res, next) => { });


const init = async () => {
    await client.connect()
    console.log('connected to database');
    let SQL = `
        DROP TABLE IF EXISTS rasUnits;
        CREATE TABLE rasUnits (
            rasID SERIAL PRIMARY KEY,
            rasName VARCHAR(25) NOT NULL,
            rasDirector NAME NOT NULL,
            rasEmail EMAIL NOT NULL,
            rasWebsite WEBSITE NOT NULL,
        );
        DROP TABLE IF EXISTS rasAdmins;
        CREATE TABLE rasAdmins (
            adminID INTEGER PRIMARY KEY,
            rasID VARCHAR(25) NOT NULL,
            name NAME NOT NULL,
            position VARCHAR(25) NOT NULL,
            levelID INTEGER NOT NULL,
            email EMAIL NOT NULL,
            phone PHONE NOT NULL,
        );
        DROP TABLE IF EXISTS adminLevels;
        CREATE TABLE adminLevels (
            levelID INTEGER PRIMARY KEY,
            levelName VARCHAR(25) NOT NULL,
        );
        DROP TABLE IF EXISTS departments;
        CREATE TABLE departments (
            deptID INTEGER PRIMARY KEY,
            deptName VARCHAR(25) NOT NULL,
            rasID VARCHAR(25) NOT NULL,
            schoolID VARCHAR(25) NOT NULL,
            deptAdminName NAME NOT NULL,
            deptAdminEmail EMAIL NOT NULL,
            deptChairName NAME NOT NULL,
            deptChairEmail EMAIL NOT NULL,
        );
        DROP TABLE IF EXISTS Investigators;
        CREATE TABLE Investigators (
            invID INTEGER PRIMARY KEY,
            name NAME NOT NULL,
            email EMAIL NOT NULL,
            phone PHONE NOT NULL,
            cell PHONE NOT NULL,
            deptID INTEGER NOT NULL,            
            position VARCHAR(25) NOT NULL,
            commonsID VARCHAR(25) NOT NULL,
            vaAppt BOOLEAN NOT NULL,
            epcAppt BOOLEAN NOT NULL,
            TotalFTEappt INTEGER NOT NULL,
            Notes TEXT,
        );
        DROP TABLE IF EXISTS adminAssignments;
        CREATE TABLE adminAssignments (
            adminID INTEGER PRIMARY KEY,
            deptID INTEGER,
            invID INTEGER,
        );
        INSERT INTO rasUnits (rasName, rasDirector, rasEmail, rasWebsite) VALUES ('eagleRAS', 'Fran Davis', 'eagleras@emory.edu', 'eagleras.emory.edu', 'https://ras.emory.edu/faculty-research/hss/index.html'); );
        `;
    await client.query(SQL);
    console.log('tables created');
    SQL = ` `;
    await client.query(SQL);
    console.log('data seeded');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
};

init();
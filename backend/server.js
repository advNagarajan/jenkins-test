require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ================= HOME =================

app.get("/", (req, res) => {

res.send("🦇 BATCOM Backend Online — Gotham Protected");

});


// ================= ADD LOG =================

async function addLog(action, details){

await pool.query(

`INSERT INTO crime_logs
(timestamp,action,details)

VALUES(NOW(),$1,$2)`,

[action,details]

);

}


// ================= GET CRIMINALS =================

app.get("/criminals", async(req,res)=>{

try{

const result = await pool.query(

`SELECT *
FROM criminals
ORDER BY

CASE threat_level
WHEN 'high' THEN 3
WHEN 'medium' THEN 2
ELSE 1
END DESC`

);

res.json(result.rows);

}catch(err){

res.status(500).json({error:err.message});

}

});


// ================= GET LOGS =================

app.get("/logs", async(req,res)=>{

try{

const result=await pool.query(

`SELECT *
FROM crime_logs
ORDER BY timestamp DESC
LIMIT 50`

);

res.json(result.rows);

}catch(err){

res.status(500).json({error:err.message});

}

});


// ================= ADD CRIMINAL =================

app.post("/criminals", async(req,res)=>{

try{

const {

name,
alias,
crimeDescription,
threatLevel

}=req.body;


const result = await pool.query(

`INSERT INTO criminals
(name,alias,crime_description,
threat_level,case_status,
captured,terminated)

VALUES($1,$2,$3,$4,'open',false,false)

RETURNING *`,

[name,alias,crimeDescription,threatLevel]

);

await addLog(

"ADD",

`${name}${alias ? ` (${alias})`:""} added to surveillance`

);

res.json({

message:"Criminal Added",

criminal:result.rows[0]

});

}catch(err){

res.status(500).json({error:err.message});

}

});


// ================= TOGGLE CAPTURE =================

app.put("/criminals/:id", async(req,res)=>{

try{

const id=req.params.id;

const result=await pool.query(

`UPDATE criminals

SET captured = NOT captured

WHERE id=$1

RETURNING *`,

[id]

);

if(result.rows.length===0)

return res.status(404).json({

message:"Criminal not found"

});

const criminal=result.rows[0];

await addLog(

"STATUS",

`${criminal.name}
${criminal.captured?"captured":"released"}`

);

res.json({

message:"Status Updated"

});

}catch(err){

res.status(500).json({

error:err.message

});

}

});


// ================= TERMINATE =================

app.put("/criminals/:id/terminate",

async(req,res)=>{

try{

const id=req.params.id;

const result=await pool.query(

`UPDATE criminals

SET terminated=true,
case_status='closed'

WHERE id=$1

RETURNING *`,

[id]

);

if(result.rows.length===0)

return res.status(404).json({

message:"Criminal not found"

});

await addLog(

"TERMINATE",

`${result.rows[0].name}
eliminated`

);

res.json({

message:"Threat Eliminated - Case Closed"

});

}catch(err){

res.status(500).json({

error:err.message

});

}

});


// ================= ADD SIGHTING =================

app.post(

"/criminals/:id/sightings",

async(req,res)=>{

try{

const id=req.params.id;

const {

location,
note,
date

}=req.body;

await pool.query(

`INSERT INTO sightings

(criminal_id,location,date,note)

VALUES($1,$2,$3,$4)`,

[
id,
location,
date || new Date(),
note || ""
]

);

await addLog(

"SIGHTING",

`Criminal spotted at ${location}`

);

res.json({

message:"Sighting added"

});

}catch(err){

res.status(500).json({

error:err.message

});

}

});


// ================= GET SIGHTINGS =================

app.get(

"/criminals/:id/sightings",

async(req,res)=>{

try{

const id=req.params.id;

const result=await pool.query(

`SELECT *

FROM sightings

WHERE criminal_id=$1

ORDER BY date DESC`,

[id]

);

res.json(result.rows);

}catch(err){

res.status(500).json({

error:err.message

});

}

});


// ================= UPDATE THREAT =================

app.put(

"/criminals/:id/threat",

async(req,res)=>{

try{

const id=req.params.id;

const { threatLevel } = req.body;

const result=await pool.query(

`UPDATE criminals

SET threat_level=$1

WHERE id=$2

RETURNING *`,

[threatLevel,id]

);

if(result.rows.length===0)

return res.status(404).json({

message:"Criminal not found"

});

await addLog(

"THREAT",

`${result.rows[0].name}
threat level changed to
${threatLevel}`

);

res.json({

message:"Threat level updated"

});

}catch(err){

res.status(500).json({

error:err.message

});

}

});


// ================= MANUAL LOG =================

app.post("/logs",

async(req,res)=>{

try{

const { action,details }=req.body;

await addLog(

action || "CUSTOM",

details || "Manual log entry"

);

res.json({

message:"Log entry added"

});

}catch(err){

res.status(500).json({

error:err.message

});

}

});


// ================= START SERVER =================



app.listen(8000,"0.0.0.0",()=>{

console.log(

"🦇 Gotham Server Running on port 8000"

);

});
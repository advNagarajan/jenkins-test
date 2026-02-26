const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let criminals = [];
let crimeLog = [];

// Initialize with static data
const initializeData = () => {
    const locations = [
        "Arkham Asylum", "Ace Chemicals", "Wayne Tower", "Gotham Bank", "Monarch Theater",
        "Blackgate Prison", "Iceberg Lounge", "Crime Alley", "GCPD Headquarters", "Gotham Docks",
        "East End", "Diamond District", "Burnley", "Otisburg", "Robinson Park",
        "Sionis Steel Mill", "Amusement Mile", "Park Row", "The Bowery", "Coventry",
        "Gotham General Hospital", "Courthouse", "Clock Tower", "Haly's Circus", "S.T.A.R. Labs"
    ];

    const criminalData = [
        { name: "Joker", alias: "The Clown Prince", desc: "Armed robbery, chemical weapons, mass murder", threat: "high" },
        { name: "Harley Quinn", alias: "Puddin'", desc: "Accomplice to Joker, assault, property damage", threat: "medium" },
        { name: "Penguin", alias: "Oswald Cobblepot", desc: "Arms dealing, racketeering, underground trade", threat: "medium" },
        { name: "Riddler", alias: "Edward Nygma", desc: "Extortion, elaborate heists, cyber terrorism", threat: "medium" },
        { name: "Two-Face", alias: "Harvey Dent", desc: "Organized crime, gambling racket, murders", threat: "medium" },
        { name: "Bane", alias: "The Man Who Broke the Bat", desc: "Terrorism, drug trafficking, mercenary work", threat: "high" },
        { name: "Scarecrow", alias: "Jonathan Crane", desc: "Fear toxin attacks, psychological torture", threat: "high" },
        { name: "Poison Ivy", alias: "Pamela Isley", desc: "Eco-terrorism, plant-based bio-weapons", threat: "medium" },
        { name: "Mr. Freeze", alias: "Victor Fries", desc: "Cryogenic theft, kidnapping for research", threat: "medium" },
        { name: "Catwoman", alias: "Selina Kyle", desc: "High-end burglary, jewel theft", threat: "low" },
        { name: "Killer Croc", alias: "Waylon Jones", desc: "Cannibalism, sewer attacks, mutilation", threat: "medium" },
        { name: "Mad Hatter", alias: "Jervis Tetch", desc: "Mind control, kidnapping, obsession crimes", threat: "medium" },
        { name: "Hush", alias: "Tommy Elliot", desc: "Serial murder, surgical mutilation", threat: "high" },
        { name: "Black Mask", alias: "Roman Sionis", desc: "Drug empire, torture, mask making from victims", threat: "high" },
        { name: "Deadshot", alias: "Floyd Lawton", desc: "Professional assassinations, contract killing", threat: "medium" },
        { name: "Firefly", alias: "Garfield Lynns", desc: "Arson, pyromania, fire-based terrorism", threat: "medium" },
        { name: "Clayface", alias: "Basil Karlo", desc: "Identity theft, impersonation murders", threat: "medium" },
        { name: "Man-Bat", alias: "Kirk Langstrom", desc: "Uncontrolled transformations, laboratory theft", threat: "low" },
        { name: "Solomon Grundy", alias: "Cyrus Gold", desc: "Zombie-like attacks, resurrection crimes", threat: "medium" },
        { name: "Ra's al Ghul", alias: "The Demon's Head", desc: "Global terrorism, Lazarus Pit experiments", threat: "high" },
        { name: "Talia al Ghul", alias: "Daughter of the Demon", desc: "League of Assassins operations", threat: "medium" },
        { name: "Deathstroke", alias: "Slade Wilson", desc: "Mercenary work, tactical assassinations", threat: "high" },
        { name: "Victor Zsasz", alias: "Mr. Zsasz", desc: "Serial killer, tally mark victims", threat: "high" },
        { name: "Calendar Man", alias: "Julian Day", desc: "Holiday-themed murders", threat: "low" },
        { name: "Killer Moth", alias: "Drury Walker", desc: "Protection racket, failed heists", threat: "low" },
        { name: "Ventriloquist", alias: "Arnold Wesker", desc: "Organized crime through dummy", threat: "low" },
        { name: "Scarface", alias: "The Puppet", desc: "Dummy-controlled crime operations", threat: "low" },
        { name: "Electrocutioner", alias: "Lester Buchinsky", desc: "Electricity-based attacks", threat: "low" },
        { name: "Copperhead", alias: "Larissa Diaz", desc: "Contortionist assassin, poison expert", threat: "medium" },
        { name: "Anarky", alias: "Lonnie Machin", desc: "Political terrorism, anti-establishment violence", threat: "medium" },
        { name: "Professor Pyg", alias: "Lazlo Valentin", desc: "Surgical mutilation, dollotrons", threat: "high" },
        { name: "Carmine Falcone", alias: "The Roman", desc: "Organized crime boss, family syndicate", threat: "medium" },
        { name: "Sal Maroni", alias: "Boss Maroni", desc: "Rival crime family leader", threat: "medium" },
        { name: "Zsasz", alias: "Serial Killer", desc: "Random street murders", threat: "high" },
        { name: "Ratcatcher", alias: "Otis Flannegan", desc: "Rat-based attacks, sewer crimes", threat: "low" },
        { name: "Clock King", alias: "Temple Fugate", desc: "Time-based crimes, precision theft", threat: "low" },
        { name: "Toyman", alias: "Winslow Schott", desc: "Toy-based weapons, child endangerment", threat: "medium" },
        { name: "Maxie Zeus", alias: "Maximilian Zeus", desc: "Delusional god complex crimes", threat: "low" },
        { name: "Kite Man", alias: "Charles Brown", desc: "Kite-based burglaries", threat: "low" },
        { name: "Polka-Dot Man", alias: "Abner Krill", desc: "Polka-dot weapon crimes", threat: "low" },
        { name: "Ten-Eyed Man", alias: "Philip Reardon", desc: "Blind fighting style crimes", threat: "low" },
        { name: "Crazy Quilt", alias: "Paul Dekker", desc: "Color-based crimes, art theft", threat: "low" },
        { name: "Egghead", alias: "Edgar Heed", desc: "Egg-themed crimes", threat: "low" },
        { name: "Bookworm", alias: "Unknown", desc: "Literature-based crimes", threat: "low" },
        { name: "Shame", alias: "Unknown", desc: "Western-themed crimes", threat: "low" },
        { name: "Marsha, Queen of Diamonds", alias: "Unknown", desc: "Diamond theft", threat: "low" },
        { name: "Louie the Lilac", alias: "Unknown", desc: "Flower-based crimes", threat: "low" },
        { name: "Lord Ffogg", alias: "Unknown", desc: "British aristocrat crimes", threat: "low" },
        { name: "Lady Penelope Peasoup", alias: "Unknown", desc: "Poison crimes", threat: "low" },
        { name: "Siren", alias: "Lorelei Circe", desc: "Hypnotic voice crimes", threat: "medium" },
        { name: "Nora Fries", alias: "Lazara", desc: "Resurrection, cryo-crimes", threat: "medium" },
        { name: "Nyssa Raatko", alias: "Nyssa al Ghul", desc: "League of Assassins leader", threat: "high" }
    ];

    // Create criminals
    criminalData.forEach((c, idx) => {
        const id = Date.now() + idx;
        const sightings = [];

        // Add 1-3 sightings per criminal
        const numSightings = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numSightings; i++) {
            sightings.push({
                location: locations[Math.floor(Math.random() * locations.length)],
                date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
                note: ["Acting suspicious", "Meeting accomplices", "Scouting location", "Armed and dangerous", "Attempting heist"][Math.floor(Math.random() * 5)]
            });
        }

        criminals.push({
            id: id,
            name: c.name,
            alias: c.alias,
            crimeDescription: c.desc,
            threatLevel: c.threat,
            caseStatus: Math.random() > 0.8 ? "closed" : "open",
            captured: Math.random() > 0.9,
            terminated: Math.random() > 0.95,
            sightings: sightings
        });
    });

    // Add initial crime logs
    const logEntries = [
        { action: "ADD", details: "System initialized - Gotham Threat Monitor online" },
        { action: "ADD", details: "Joker added to surveillance - High threat level" },
        { action: "ADD", details: "Penguin spotted at Iceberg Lounge with weapon shipment" },
        { action: "THREAT", details: "Riddler threat level elevated to HIGH after bank heist" },
        { action: "STATUS", details: "Harley Quinn captured at Amusement Mile" },
        { action: "SIGHTING", details: "Two-Face seen at Courthouse attempting jury tampering" },
        { action: "ADD", details: "Bane escaped from Blackgate Prison" },
        { action: "TERMINATE", details: "Black Mask neutralized during warehouse raid" },
        { action: "SIGHTING", details: "Scarecrow distributing fear toxin at Robinson Park" },
        { action: "THREAT", details: "Poison Ivy threat level increased - eco-terrorism activity" },
        { action: "STATUS", details: "Catwoman released from custody - cooperative witness" },
        { action: "SIGHTING", details: "Mr. Freeze attempting cryo-lab break-in at S.T.A.R. Labs" },
        { action: "ADD", details: "Deathstroke spotted in Gotham - possible contract active" },
        { action: "THREAT", details: "Hush identified as serial killer - urgent priority" },
        { action: "STATUS", details: "Killer Croc sedated and returned to Arkham" }
    ];

    logEntries.forEach((log, idx) => {
        crimeLog.push({
            timestamp: new Date(Date.now() - (idx * 2 * 60 * 60 * 1000)).toISOString(),
            action: log.action,
            details: log.details,
            id: Date.now() + idx
        });
    });
};

// Initialize data on startup
initializeData();

// Helper to add log entry
const addLog = (action, details) => {
    const entry = {
        timestamp: new Date().toISOString(),
        action,
        details,
        id: Date.now()
    };
    crimeLog.unshift(entry);
    // Keep only last 50 entries
    if (crimeLog.length > 50) crimeLog = crimeLog.slice(0, 50);
    return entry;
};

app.get("/", (req, res) => {
    res.send("🦇 BATCOM Backend Online — Gotham Protected");
});

// Get criminals - sorted by threat level
app.get("/criminals", (req, res) => {
    const sorted = [...criminals].sort((a, b) => {
        const threatOrder = { high: 3, medium: 2, low: 1 };
        return threatOrder[b.threatLevel] - threatOrder[a.threatLevel];
    });
    res.json(sorted);
});

// Get crime log
app.get("/logs", (req, res) => {
    res.json(crimeLog);
});

// Add criminal with all details
app.post("/criminals", (req, res) => {
    const criminal = {
        id: Date.now(),
        name: req.body.name,
        alias: req.body.alias || "",
        crimeDescription: req.body.crimeDescription || "",
        threatLevel: req.body.threatLevel || "low",
        caseStatus: "open",
        captured: false,
        terminated: false,
        sightings: []
    };
    criminals.push(criminal);

    addLog("ADD", `${criminal.name}${criminal.alias ? ` (${criminal.alias})` : ""} added to surveillance`);

    res.json({ message: "Criminal Added", criminal });
});

// Toggle captured
app.put("/criminals/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = criminals.findIndex(c => c.id === id);
    if (index >= 0) {
        criminals[index].captured = !criminals[index].captured;
        const status = criminals[index].captured ? "captured" : "released";
        addLog("STATUS", `${criminals[index].name} ${status}`);
        res.json({ message: "Status Updated" });
    } else {
        res.status(404).json({ message: "Criminal not found" });
    }
});

// Terminate - marks as terminated and auto-closes case
app.put("/criminals/:id/terminate", (req, res) => {
    const id = parseInt(req.params.id);
    const index = criminals.findIndex(c => c.id === id);
    if (index >= 0) {
        criminals[index].terminated = true;
        criminals[index].caseStatus = "closed";
        addLog("TERMINATE", `${criminals[index].name} eliminated`);
        res.json({ message: "Threat Eliminated - Case Closed" });
    } else {
        res.status(404).json({ message: "Criminal not found" });
    }
});

// Add sighting
app.post("/criminals/:id/sightings", (req, res) => {
    const id = parseInt(req.params.id);
    const index = criminals.findIndex(c => c.id === id);
    if (index >= 0) {
        const sighting = {
            location: req.body.location,
            date: req.body.date || new Date().toISOString(),
            note: req.body.note || ""
        };
        criminals[index].sightings.unshift(sighting);
        addLog("SIGHTING", `${criminals[index].name} spotted at ${sighting.location}`);
        res.json({ message: "Sighting added", sighting });
    } else {
        res.status(404).json({ message: "Criminal not found" });
    }
});

// Get sightings for a criminal
app.get("/criminals/:id/sightings", (req, res) => {
    const id = parseInt(req.params.id);
    const criminal = criminals.find(c => c.id === id);
    if (criminal) {
        res.json(criminal.sightings);
    } else {
        res.status(404).json({ message: "Criminal not found" });
    }
});

// Update threat level
app.put("/criminals/:id/threat", (req, res) => {
    const id = parseInt(req.params.id);
    const index = criminals.findIndex(c => c.id === id);
    if (index >= 0) {
        const oldLevel = criminals[index].threatLevel;
        criminals[index].threatLevel = req.body.threatLevel;
        addLog("THREAT", `${criminals[index].name} threat level changed from ${oldLevel} to ${req.body.threatLevel}`);
        res.json({ message: "Threat level updated" });
    } else {
        res.status(404).json({ message: "Criminal not found" });
    }
});

// Add manual log entry
app.post("/logs", (req, res) => {
    const { action, details } = req.body;
    const entry = addLog(action || "CUSTOM", details || "Manual log entry");
    res.json({ message: "Log entry added", entry });
});

app.listen(5000, () => {
    console.log("🦇 Gotham Server Running in port 5000");
});

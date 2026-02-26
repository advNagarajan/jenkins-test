import axios from "axios";

const API = "http://localhost:5000";

const inputStyle = {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box"
};

const buttonStyle = {
    padding: "12px 25px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    fontFamily: "inherit"
};

const cardStyle = {
    background: "linear-gradient(135deg, #1a1a1a 0%, #151515 100%)",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #333",
    marginBottom: "20px"
};

function formatTime(iso) {
    return new Date(iso).toLocaleString();
}

function isSameDay(date1, date2) {
    const d1 = new Date(date1).toISOString().split('T')[0];
    const d2 = new Date(date2).toISOString().split('T')[0];
    return d1 === d2;
}

function Surveillance({ criminals, searchQuery, setSearchQuery, sightingDateFilter, setSightingDateFilter, load, loadLogs }) {
    const filteredCriminals = criminals.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.alias && c.alias.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const addSighting = async (id, location, note, date) => {
        if (!location) return;
        await axios.post(API + "/criminals/" + id + "/sightings", { location, note, date });
        load(); loadLogs();
    };

    return (
        <div>
            <h2 style={{ color: "#FFD700", marginBottom: "25px", borderBottom: "2px solid #FFD700", paddingBottom: "10px" }}>
                Surveillance Log
            </h2>
            {/* Search and Filter Bar */}
            <div style={{ ...cardStyle, marginBottom: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px" }}>
                    <input
                        placeholder="Search by name or alias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        type="date"
                        value={sightingDateFilter}
                        onChange={(e) => setSightingDateFilter(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                {(searchQuery || sightingDateFilter) && (
                    <div style={{ marginTop: "10px", color: "#888", fontSize: "13px" }}>
                        Showing results for: {searchQuery && `Search: "${searchQuery}"`} {sightingDateFilter && `| Date: ${sightingDateFilter}`}
                        <button onClick={() => { setSearchQuery(""); setSightingDateFilter(""); }} style={{ marginLeft: "15px", background: "none", border: "none", color: "#FFD700", cursor: "pointer", textDecoration: "underline" }}>Clear Filters</button>
                    </div>
                )}
            </div>
            {filteredCriminals.length === 0 ? (
                <div style={{ color: "#555", textAlign: "center", padding: "40px" }}>No criminals match your search</div>
            ) : (
                filteredCriminals.map((c) => {
                    const filteredSightings = sightingDateFilter && c.sightings
                        ? c.sightings.filter(s => isSameDay(s.date, sightingDateFilter))
                        : c.sightings;

                    return (
                        <SurveillanceCard
                            key={c.id}
                            criminal={c}
                            sightings={filteredSightings}
                            sightingDateFilter={sightingDateFilter}
                            onAddSighting={(loc, note, date) => addSighting(c.id, loc, note, date)}
                        />
                    );
                })
            )}
        </div>
    );
}

function SurveillanceCard({ criminal, sightings, sightingDateFilter, onAddSighting }) {
    const [showForm, setShowForm] = useState(false);
    const [location, setLocation] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = () => {
        onAddSighting(location, note, date || new Date().toISOString());
        setLocation(""); setNote(""); setDate(""); setShowForm(false);
    };

    return (
        <div style={cardStyle}>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#FFD700", marginBottom: "15px" }}>{criminal.name}</div>
            {sightings && sightings.length > 0 ? (
                <div>
                    {sightings.map((s, idx) => (
                        <div key={idx} style={{ padding: "12px", marginBottom: "10px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", borderLeft: "3px solid #FFD700" }}>
                            <div style={{ color: "#888", fontSize: "12px", marginBottom: "5px" }}>{formatTime(s.date)}</div>
                            <div style={{ color: "#DAA520" }}>{s.location}</div>
                            {s.note && <div style={{ color: "#666", fontSize: "13px", marginTop: "5px" }}>{s.note}</div>}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ color: "#555", textAlign: "center", padding: "20px" }}>
                    {sightingDateFilter ? "No sightings on selected date" : "No sightings recorded"}
                </div>
            )}
            {!criminal.terminated && (
                <div style={{ marginTop: "15px" }}>
                    <button onClick={() => setShowForm(!showForm)} style={{ ...buttonStyle, background: "#222", color: "#FFD700", border: "1px solid #FFD700" }}>
                        {showForm ? "Cancel" : "Log Sighting"}
                    </button>
                    {showForm && (
                        <div style={{ marginTop: "15px", padding: "15px", background: "rgba(0,0,0,0.5)", borderRadius: "8px" }}>
                            <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} style={{ ...inputStyle, marginBottom: "10px" }} />
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ ...inputStyle, marginBottom: "10px" }} />
                            <textarea placeholder="Notes..." value={note} onChange={(e) => setNote(e.target.value)} rows={2} style={{ ...inputStyle, marginBottom: "10px", resize: "vertical" }} />
                            <button onClick={handleSubmit} style={{ ...buttonStyle, background: "#FFD700", color: "#000" }}>Report Sighting</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

import { useState } from "react";

export default Surveillance;

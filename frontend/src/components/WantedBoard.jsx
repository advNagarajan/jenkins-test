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

function getThreatColor(level) {
    if (level === "high") return "#FFD700";
    if (level === "medium") return "#DAA520";
    return "#B8860B";
}

function WantedBoard({ criminals, searchQuery, setSearchQuery, load, loadLogs }) {
    const filteredCriminals = criminals.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.alias && c.alias.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const capture = async (id) => {
        await axios.put(API + "/criminals/" + id);
        load(); loadLogs();
    };

    const eliminate = async (id) => {
        await axios.put(API + "/criminals/" + id + "/terminate");
        load(); loadLogs();
    };

    const updateThreat = async (id, level) => {
        await axios.put(API + "/criminals/" + id + "/threat", { threatLevel: level });
        load(); loadLogs();
    };

    return (
        <div>
            <h2 style={{ color: "#FFD700", marginBottom: "25px", borderBottom: "2px solid #FFD700", paddingBottom: "10px" }}>
                Wanted Board
            </h2>
            {/* Search Bar */}
            <div style={{ ...cardStyle, marginBottom: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "15px", alignItems: "center" }}>
                    <input
                        placeholder="Search by name or alias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={inputStyle}
                    />
                    <div style={{ color: "#888", fontSize: "14px", whiteSpace: "nowrap" }}>
                        Showing {filteredCriminals.length} of {criminals.length}
                    </div>
                </div>
                {searchQuery && (
                    <div style={{ marginTop: "10px", color: "#888", fontSize: "13px" }}>
                        Searching for: &quot;{searchQuery}&quot;
                        <button onClick={() => setSearchQuery("")} style={{ marginLeft: "15px", background: "none", border: "none", color: "#FFD700", cursor: "pointer", textDecoration: "underline" }}>Clear Search</button>
                    </div>
                )}
            </div>
            {filteredCriminals.length === 0 ? (
                <div style={{ color: "#555", textAlign: "center", padding: "40px" }}>No criminals match your search</div>
            ) : (
                filteredCriminals.map((c) => {
                    const borderColor = getThreatColor(c.threatLevel);
                    return (
                        <div key={c.id} style={{ ...cardStyle, border: "2px solid " + (c.terminated ? "#444" : borderColor), opacity: c.terminated ? 0.6 : 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <div style={{ fontSize: "24px", fontWeight: "bold", color: c.terminated ? "#666" : "#fff", textDecoration: (c.captured || c.terminated) ? "line-through" : "none" }}>
                                        {c.name}
                                    </div>
                                    {c.alias && <div style={{ color: "#DAA520", fontSize: "16px" }}>aka &quot;{c.alias}&quot;</div>}
                                </div>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <span style={{ padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: c.threatLevel === "high" ? "rgba(255,0,0,0.3)" : c.threatLevel === "medium" ? "rgba(255,165,0,0.3)" : "rgba(255,215,0,0.2)", color: c.threatLevel === "high" ? "#ff6666" : c.threatLevel === "medium" ? "#ffaa00" : "#FFD700", border: "1px solid " + (c.threatLevel === "high" ? "#ff6666" : c.threatLevel === "medium" ? "#ffaa00" : "#FFD700") }}>
                                        {c.threatLevel.toUpperCase()} THREAT
                                    </span>
                                    {!c.terminated && (
                                        <select value={c.threatLevel} onChange={(e) => updateThreat(c.id, e.target.value)} style={{ ...inputStyle, width: "120px" }}>
                                            <option value="high">HIGH</option>
                                            <option value="medium">MEDIUM</option>
                                            <option value="low">LOW</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                            <div style={{ margin: "15px 0", padding: "12px", background: "rgba(0,0,0,0.5)", borderRadius: "8px" }}>
                                <strong style={{ color: "#FFD700" }}>CASE DETAILS:</strong>
                                <div style={{ marginTop: "8px", color: c.crimeDescription ? "#ccc" : "#666", fontStyle: c.crimeDescription ? "normal" : "italic" }}>
                                    {c.crimeDescription || "Case details pending investigation..."}
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                                <div style={{ padding: "10px", background: "rgba(255,215,0,0.1)", borderRadius: "8px", border: "1px solid rgba(255,215,0,0.3)" }}>
                                    <span style={{ color: "#888", fontSize: "12px" }}>Sightings:</span>
                                    <span style={{ color: "#FFD700", fontWeight: "bold", marginLeft: "8px" }}>{c.sightings ? c.sightings.length : 0}</span>
                                </div>
                                <div style={{ padding: "10px", background: "rgba(255,215,0,0.1)", borderRadius: "8px", border: "1px solid rgba(255,215,0,0.3)" }}>
                                    <span style={{ color: "#888", fontSize: "12px" }}>Last Seen:</span>
                                    <span style={{ color: "#DAA520", marginLeft: "8px" }}>{c.sightings && c.sightings.length > 0 ? c.sightings[0].location : "Unknown"}</span>
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <span style={{ padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: c.caseStatus === "open" ? "rgba(255,215,0,0.2)" : "rgba(100,100,100,0.2)", color: c.caseStatus === "open" ? "#FFD700" : "#888", border: "1px solid " + (c.caseStatus === "open" ? "#FFD700" : "#666") }}>
                                        {c.caseStatus === "open" ? "OPEN CASE" : "CASE CLOSED"}
                                    </span>
                                    {c.terminated && <span style={{ padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: "rgba(100,100,100,0.3)", color: "#888", border: "1px solid #555" }}>TERMINATED</span>}
                                    {c.captured && !c.terminated && <span style={{ padding: "5px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: "rgba(255,215,0,0.15)", color: "#DAA520", border: "1px solid #DAA520" }}>CAPTURED</span>}
                                </div>
                                {!c.terminated && (
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button onClick={() => capture(c.id)} style={{ ...buttonStyle, background: c.captured ? "#333" : "#DAA520", color: c.captured ? "#888" : "#000" }}>{c.captured ? "Release" : "Capture"}</button>
                                        <button onClick={() => eliminate(c.id)} style={{ ...buttonStyle, background: "#222", color: "#FFD700", border: "1px solid #FFD700" }}>Terminate</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default WantedBoard;

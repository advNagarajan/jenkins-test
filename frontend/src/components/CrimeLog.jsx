import { useState } from "react";
import axios from "axios";

const API = "http://13.232.211.135:8000";

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

function CrimeLog({ crimeLog, logDateFilter, setLogDateFilter, logActionFilter, loadLogs }) {
    const [showLogForm, setShowLogForm] = useState(false);
    const [logAction, setLogAction] = useState("CUSTOM");
    const [logDetails, setLogDetails] = useState("");

    const filteredLogs = crimeLog.filter(log => {
        const matchesDate = !logDateFilter || isSameDay(log.timestamp, logDateFilter);
        const matchesAction = logActionFilter === "all" || log.action === logActionFilter;
        return matchesDate && matchesAction;
    });

    const addManualLog = async () => {
        if (!logDetails) return;
        await axios.post(API + "/logs", { action: logAction, details: logDetails });
        setLogDetails(""); setLogAction("CUSTOM"); setShowLogForm(false);
        loadLogs();
    };

    return (
        <div>
            <h2 style={{ color: "#FFD700", marginBottom: "25px", borderBottom: "2px solid #FFD700", paddingBottom: "10px" }}>
                Gotham Crime Log
            </h2>
            {/* Add Log Button */}
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => setShowLogForm(!showLogForm)}
                    style={{ ...buttonStyle, background: "linear-gradient(135deg, #FFD700 0%, #DAA520 100%)", color: "#000" }}
                >
                    {showLogForm ? "Cancel" : "+ Add New Log Entry"}
                </button>
            </div>
            {/* Add Log Form */}
            {showLogForm && (
                <div style={{ ...cardStyle, marginBottom: "20px", border: "2px solid #FFD700" }}>
                    <h3 style={{ color: "#FFD700", marginTop: 0 }}>New Log Entry</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "15px", marginBottom: "15px" }}>
                        <select
                            value={logAction}
                            onChange={(e) => setLogAction(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="CUSTOM">Custom</option>
                            <option value="ADD">Add</option>
                            <option value="STATUS">Status</option>
                            <option value="THREAT">Threat</option>
                            <option value="SIGHTING">Sighting</option>
                            <option value="TERMINATE">Terminate</option>
                            <option value="INTEL">Intel</option>
                            <option value="ALERT">Alert</option>
                        </select>
                        <input
                            placeholder="Log details..."
                            value={logDetails}
                            onChange={(e) => setLogDetails(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <button
                        onClick={addManualLog}
                        disabled={!logDetails}
                        style={{ ...buttonStyle, background: logDetails ? "#FFD700" : "#444", color: logDetails ? "#000" : "#888", cursor: logDetails ? "pointer" : "not-allowed" }}
                    >
                        Submit Log Entry
                    </button>
                </div>
            )}
            {/* Filter Bar */}
            <div style={{ ...cardStyle, marginBottom: "20px" }}>
                <input
                    type="date"
                    value={logDateFilter}
                    onChange={(e) => setLogDateFilter(e.target.value)}
                    style={inputStyle}
                />
                {logDateFilter && (
                    <div style={{ marginTop: "10px", color: "#888", fontSize: "13px" }}>
                        Filter: Date: {logDateFilter}
                        <button onClick={() => setLogDateFilter("")} style={{ marginLeft: "15px", background: "none", border: "none", color: "#FFD700", cursor: "pointer", textDecoration: "underline" }}>Clear Filter</button>
                    </div>
                )}
            </div>
            <div style={cardStyle}>
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                    <div key={log.id} style={{ padding: "15px", marginBottom: "10px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", borderLeft: "3px solid #FFD700" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                            <div style={{ color: "#666", fontSize: "12px" }}>{formatTime(log.timestamp)}</div>
                            <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", backgroundColor: log.action === "TERMINATE" ? "rgba(255,0,0,0.2)" : log.action === "ADD" ? "rgba(0,255,0,0.2)" : log.action === "CUSTOM" || log.action === "INTEL" || log.action === "ALERT" ? "rgba(100,150,255,0.2)" : "rgba(255,215,0,0.2)", color: log.action === "TERMINATE" ? "#ff6666" : log.action === "ADD" ? "#66ff66" : log.action === "CUSTOM" || log.action === "INTEL" || log.action === "ALERT" ? "#66aaff" : "#FFD700", border: "1px solid " + (log.action === "TERMINATE" ? "#ff6666" : log.action === "ADD" ? "#66ff66" : log.action === "CUSTOM" || log.action === "INTEL" || log.action === "ALERT" ? "#66aaff" : "#FFD700") }}>
                                {log.action}
                            </span>
                        </div>
                        <div style={{ color: "#aaa" }}>{log.details}</div>
                    </div>
                )) : (
                    <div style={{ color: "#555", textAlign: "center", padding: "40px" }}>No logs match your filters</div>
                )}
            </div>
        </div>
    );
}

export default CrimeLog;

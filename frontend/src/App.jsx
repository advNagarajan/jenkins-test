import { useEffect, useState } from "react";
import axios from "axios";
import Statistics from "./components/Statistics";
import WantedBoard from "./components/WantedBoard";
import Surveillance from "./components/Surveillance";
import CrimeLog from "./components/CrimeLog";
import System from "./components/System";

function App() {
    const API = "http://localhost:5000";
    const [activePage, setActivePage] = useState("add");

    // Form states for Add Target
    const [name, setName] = useState("");
    const [alias, setAlias] = useState("");
    const [crimeDescription, setCrimeDescription] = useState("");
    const [threatLevel, setThreatLevel] = useState("low");

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [sightingDateFilter, setSightingDateFilter] = useState("");
    const [logDateFilter, setLogDateFilter] = useState("");
    const [logActionFilter, setLogActionFilter] = useState("all");

    // Data states
    const [criminals, setCriminals] = useState([]);
    const [crimeLog, setCrimeLog] = useState([]);

    const load = async () => {
        const res = await axios.get(API + "/criminals");
        setCriminals(res.data);
    };

    const loadLogs = async () => {
        const res = await axios.get(API + "/logs");
        setCrimeLog(res.data);
    };

    useEffect(() => {
        load();
        loadLogs();
        const interval = setInterval(() => {
            load();
            loadLogs();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const addCriminal = async () => {
        if (!name) return;
        await axios.post(API + "/criminals", { name, alias, crimeDescription, threatLevel });
        setName(""); setAlias(""); setCrimeDescription(""); setThreatLevel("low");
        load(); loadLogs();
    };

    // Styles
    const sidebarBtn = (page) => ({
        width: "100%",
        padding: "15px 20px",
        marginBottom: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        background: activePage === page ? "#FFD700" : "#222",
        color: activePage === page ? "#000" : "#888",
        transition: "all 0.3s ease",
        textAlign: "left"
    });

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

    // Render content based on active page
    const renderContent = () => {
        if (activePage === "add") {
            return (
                <div>
                    <h2 style={{ color: "#FFD700", marginBottom: "25px", borderBottom: "2px solid #FFD700", paddingBottom: "10px" }}>
                        Add New Target
                    </h2>
                    <div style={cardStyle}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                            <input placeholder="Real Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                            <input placeholder="Alias (e.g., The Joker)" value={alias} onChange={(e) => setAlias(e.target.value)} style={inputStyle} />
                            <select value={threatLevel} onChange={(e) => setThreatLevel(e.target.value)} style={inputStyle}>
                                <option value="low">Low Threat</option>
                                <option value="medium">Medium Threat</option>
                                <option value="high">High Threat</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="Crime Description / Case Details..."
                            value={crimeDescription}
                            onChange={(e) => setCrimeDescription(e.target.value)}
                            rows={4}
                            style={{ ...inputStyle, marginBottom: "15px", resize: "vertical" }}
                        />
                        <button
                            onClick={addCriminal}
                            style={{ ...buttonStyle, background: "linear-gradient(135deg, #FFD700 0%, #DAA520 100%)", color: "#000" }}
                        >
                            Add to Surveillance
                        </button>
                    </div>
                </div>
            );
        }

        if (activePage === "stats") {
            return <Statistics criminals={criminals} />;
        }

        if (activePage === "wanted") {
            return (
                <WantedBoard
                    criminals={criminals}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    load={load}
                    loadLogs={loadLogs}
                />
            );
        }

        if (activePage === "sightings") {
            return (
                <Surveillance
                    criminals={criminals}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sightingDateFilter={sightingDateFilter}
                    setSightingDateFilter={setSightingDateFilter}
                    load={load}
                    loadLogs={loadLogs}
                />
            );
        }

        if (activePage === "log") {
            return (
                <CrimeLog
                    crimeLog={crimeLog}
                    logDateFilter={logDateFilter}
                    setLogDateFilter={setLogDateFilter}
                    logActionFilter={logActionFilter}
                    loadLogs={loadLogs}
                />
            );
        }

        if (activePage === "system") {
            return <System criminals={criminals} crimeLog={crimeLog} />;
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", width: "100vw", background: "#000", overflow: "hidden" }}>
            {/* SIDEBAR */}
            <div style={{
                width: "250px",
                background: "linear-gradient(180deg, #111 0%, #1a1a1a 100%)",
                padding: "20px",
                borderRight: "2px solid #FFD700",
                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ textAlign: "center", marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #333" }}>
                    <h1 style={{ fontSize: "28px", margin: "0", color: "#FFD700" }}>🦇</h1>
                    <div style={{ color: "#FFD700", fontSize: "12px", letterSpacing: "2px" }}>BATCOM</div>
                </div>

                <button style={sidebarBtn("add")} onClick={() => setActivePage("add")}>Add Target</button>
                <button style={sidebarBtn("stats")} onClick={() => setActivePage("stats")}>Statistics</button>
                <button style={sidebarBtn("wanted")} onClick={() => setActivePage("wanted")}>Wanted Board</button>
                <button style={sidebarBtn("sightings")} onClick={() => setActivePage("sightings")}>Surveillance</button>
                <button style={sidebarBtn("log")} onClick={() => setActivePage("log")}>Crime Log</button>
                <button style={sidebarBtn("system")} onClick={() => setActivePage("system")}>System</button>

                <div style={{ marginTop: "auto", padding: "15px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", border: "1px solid #333" }}>
                    <div style={{ color: "#666", fontSize: "12px" }}>Targets: <strong style={{ color: "#FFD700" }}>{criminals.length}</strong></div>
                    <div style={{ color: "#666", fontSize: "12px", marginTop: "5px" }}>Active: <strong style={{ color: "#DAA520" }}>{criminals.filter(c => !c.terminated).length}</strong></div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, overflow: "auto", padding: "30px" }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default App;

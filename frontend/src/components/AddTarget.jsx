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

function AddTarget({
    name, setName,
    alias, setAlias,
    crimeDescription, setCrimeDescription,
    threatLevel, setThreatLevel,
    load, loadLogs
}) {
    const addCriminal = async () => {
        if (!name) return;
        await axios.post(API + "/criminals", { name, alias, crimeDescription, threatLevel });
        setName(""); setAlias(""); setCrimeDescription(""); setThreatLevel("low");
        load(); loadLogs();
    };

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

export default AddTarget;

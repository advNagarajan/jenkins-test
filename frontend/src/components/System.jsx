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

function System({ criminals, crimeLog }) {
    return (
        <div>
            <h2 style={{ color: "#FFD700", marginBottom: "25px", borderBottom: "2px solid #FFD700", paddingBottom: "10px" }}>
                System Status
            </h2>
            <div style={cardStyle}>
                <h3 style={{ color: "#DAA520", marginTop: 0 }}>BATCOM Status</h3>
                <div style={{ padding: "15px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                        <span style={{ color: "#FFD700", fontSize: "24px" }}>●</span>
                        <span style={{ color: "#aaa" }}>BAT-SIGNAL: <strong style={{ color: "#FFD700" }}>ACTIVE</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                        <span style={{ color: "#DAA520", fontSize: "24px" }}>●</span>
                        <span style={{ color: "#aaa" }}>DATABASE: <strong style={{ color: "#DAA520" }}>ONLINE</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <span style={{ color: "#B8860B", fontSize: "24px" }}>●</span>
                        <span style={{ color: "#aaa" }}>ARKHAM: <strong style={{ color: "#B8860B" }}>MONITORING</strong></span>
                    </div>
                </div>
                <h3 style={{ color: "#DAA520" }}>Recent Activity</h3>
                <div style={{ padding: "15px", background: "rgba(0,0,0,0.5)", borderRadius: "8px" }}>
                    <div style={{ color: "#666" }}>Last update: {formatTime(new Date().toISOString())}</div>
                    <div style={{ color: "#888", marginTop: "10px" }}>Total log entries: {crimeLog.length}</div>
                    <div style={{ color: "#888" }}>Criminals monitored: {criminals.length}</div>
                </div>
            </div>
        </div>
    );
}

export default System;

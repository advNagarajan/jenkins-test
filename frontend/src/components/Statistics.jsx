const cardStyle = {
    background: "linear-gradient(135deg, #1a1a1a 0%, #151515 100%)",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #333",
    marginBottom: "20px"
};

function Statistics({ criminals }) {
    return (
        <div>
            <h2 style={{ color: "#FFD700", marginBottom: "25px", borderBottom: "2px solid #FFD700", paddingBottom: "10px" }}>
                Threat Statistics
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px" }}>
                <div style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: "48px", fontWeight: "bold", color: "#FFD700" }}>{criminals.length}</div>
                    <div style={{ color: "#888", fontSize: "14px" }}>Total Targets</div>
                </div>
                <div style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: "48px", fontWeight: "bold", color: "#FFD700" }}>{criminals.filter(c => c.threatLevel === "high").length}</div>
                    <div style={{ color: "#888", fontSize: "14px" }}>High Threat</div>
                </div>
                <div style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: "48px", fontWeight: "bold", color: "#DAA520" }}>{criminals.filter(c => c.threatLevel === "medium").length}</div>
                    <div style={{ color: "#888", fontSize: "14px" }}>Medium Threat</div>
                </div>
                <div style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: "48px", fontWeight: "bold", color: "#B8860B" }}>{criminals.filter(c => c.threatLevel === "low").length}</div>
                    <div style={{ color: "#888", fontSize: "14px" }}>Low Threat</div>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                <div style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: "48px", fontWeight: "bold", color: "#DAA520" }}>{criminals.filter(c => c.captured).length}</div>
                    <div style={{ color: "#888", fontSize: "14px" }}>Captured</div>
                </div>
                <div style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: "48px", fontWeight: "bold", color: "#666" }}>{criminals.filter(c => c.terminated).length}</div>
                    <div style={{ color: "#888", fontSize: "14px" }}>Terminated</div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReportDashboard = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/report_gen/extracted_data.json")
      .then(response => response.json())
      .then(data => setReports(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Search filter function
  const filteredReports = reports.filter(report =>
    Object.values(report).some(value =>
      value && value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica"); // Consistent font to avoid issues with special characters
    doc.text("Insurance Query Reports", 14, 10);
  
    const tableColumn = ["Caller Name", "Policy Number", "Claim Number", "Due Date", "Query", "Response"];
    const tableRows = [];
  
    filteredReports.forEach((report) => {
      const rowData = [
        (report["Caller Name"] || "N/A").toString().trim(),
        (report["Policy Number"] || "N/A").toString().trim(),
        (report["Claim Number"] || "N/A").toString().trim(),
        (report["Due Date"] || "N/A").toString().trim(),
        (report["Query"] || "N/A")
          .replace(/₹/g, "Rs.") // Replaced ₹ with Rs.
          .replace(/[^\x00-\x7F]/g, ""), // Removed non-ASCII characters
        (report["Response"] || "N/A")
          .replace(/₹/g, "Rs.")
          .replace(/[^\x00-\x7F]/g, ""), 
      ];
      tableRows.push(rowData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 2 },
    });
  
    doc.save(`Insurance_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };
  
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>Insurance Query Reports</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Name, Policy Number, or Query..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "8px", width: "300px" }}
      />

      {/* Export PDF Button */}
      <button onClick={exportToPDF} style={{ marginLeft: "10px", padding: "8px 16px", cursor: "pointer" }}>
        Export as PDF
      </button>

      <table border="1" width="100%" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Caller Name</th>
            <th>Policy Number</th>
            <th>Claim Number</th>
            <th>Due Date</th>
            <th>Query</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => (
              <tr key={index}>
                <td>{report["Caller Name"] || "N/A"}</td>
                <td>{report["Policy Number"] || "N/A"}</td>
                <td>{report["Claim Number"] || "N/A"}</td>
                <td>{report["Due Date"] || "N/A"}</td>
                <td>{report["Query"] || "N/A"}</td>
                <td>{report["Response"] || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportDashboard;

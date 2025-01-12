import React, { useState, useEffect } from "react";

const ReportDashboard = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/report_gen/extracted_data.json") // Adjust path based on where JSON is stored
      .then(response => response.json())
      .then(data => setReports(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Search filter function
  const filteredReports = reports.filter(report =>
    Object.values(report).some(value =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Insurance Query Reports</h1>
      <input
        type="text"
        placeholder="Search by Name, Policy Number, or Query..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", padding: "8px", width: "300px" }}
      />
      <table border="1" width="100%">
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
                <td>{report["Caller Name"]}</td>
                <td>{report["Policy Number"]}</td>
                <td>{report["Claim Number"]}</td>
                <td>{report["Due Date"]}</td>
                <td>{report["Query"]}</td>
                <td>{report["Response"]}</td>
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

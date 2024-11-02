import React from "react";
import DataTable from "react-data-table-component";

const Home = () => {
  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Age", selector: (row) => row.age, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
  ];

  const data = [
    { id: 1, name: "John Doe", age: 28, email: "john@example.com" },
    { id: 2, name: "Jane Doe", age: 22, email: "jane@example.com" },
    // Data lainnya
  ];

  return (
    <div>
      <h2>Data Table</h2>
      <DataTable columns={columns} data={data} pagination />
    </div>
  );
};

export default Home;

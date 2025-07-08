import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdicionarProduto from './AdminController';
import AdminLogs from './AdminLogs'; // Importa o componente correto

function Navbar() {
  return (
    <nav className="bg-[#591E65] text-gray-200 px-6 py-4 flex justify-center gap-10">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/logs" className="hover:underline">Logs</Link>
    </nav>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<AdicionarProduto />} />
          <Route path="/logs" element={<AdminLogs />} /> {/* Aqui! */}
        </Routes>
      </div>
    </>
  );
}

export default App;

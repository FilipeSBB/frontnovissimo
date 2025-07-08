import React, { useEffect, useState } from 'react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('https://lojasiegasbackend.onrender.com/logs');
        if (response.ok) {
          const data = await response.json();
          console.log('Logs:', data); // para você verificar os dados
          setLogs(data);
        } else {
          console.error('Erro ao buscar logs');
        }
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#320143] mb-4">Logs de Atividades</h1>

      {loading ? (
        <p>Carregando logs...</p>
      ) : logs.length === 0 ? (
        <p>Nenhum log encontrado.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-purple-100 text-left text-sm font-semibold text-[#320143]">
                <th className="p-3 border">Data</th>
                <th className="p-3 border">Tipo</th>
                <th className="p-3 border">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-purple-50">
                  <td className="p-3 border">{new Date(log.dataHora).toLocaleString()}</td>
                  <td className="p-3 border capitalize">{log.tipo}</td>
                  <td className="p-3 border">{log.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;

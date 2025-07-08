import React, { useState, useEffect } from 'react';
import { FaPlus, FaStar, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminHome() {
  const [produtos, setProdutos] = useState([]);
  const [showModalAdicionar, setShowModalAdicionar] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);

  const [novoProduto, setNovoProduto] = useState({
    produto: '',
    preco: '',
    categorias: '',
    imagem: '',
    descricao: '',
  });

  const [produtoEditando, setProdutoEditando] = useState(null);

  useEffect(() => {
    fetch('https://lojasiegasbackend.onrender.com/listarprodutos')
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => console.error('Erro ao carregar produtos:', err));
  }, []);

  const abrirModalAdicionar = () => {
    setNovoProduto({
      produto: '',
      preco: '',
      categorias: '',
      imagem: '',
      descricao: '',
    });
    setShowModalAdicionar(true);
  };

  const fecharModalAdicionar = () => {
    setShowModalAdicionar(false);
  };

  const abrirModalEditar = (produto) => {
    setProdutoEditando(produto);
    setShowModalEditar(true);
  };

  const fecharModalEditar = () => {
    setShowModalEditar(false);
    setProdutoEditando(null);
  };

  const handleChangeAdicionar = (e) => {
    const { name, value } = e.target;
    setNovoProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEditar = (e) => {
    const { name, value } = e.target;
    setProdutoEditando((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarProduto = () => {
    const { produto, preco, categorias, imagem, descricao } = novoProduto;

    if (!produto || !preco || !categorias || !imagem || !descricao) {
      alert('Preencha todos os campos para adicionar.');
      return;
    }

    const novoProdutoComArray = {
      produto,
      preco,
      categorias,
      imagem: imagem.split(',').map((url) => url.trim()),
      descricao,
    };

    fetch('https://lojasiegasbackend.onrender.com/adicionarproduto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProdutoComArray),
    })
      .then((res) => res.json())
      .then((produtoCriado) => {
        setProdutos((prev) => [...prev, produtoCriado]);
        fecharModalAdicionar();
      })
      .catch((err) => console.error('Erro ao adicionar produto:', err));
  };

  const salvarAlteracao = () => {
    const { produto, preco, categorias, imagem, descricao, id } = produtoEditando;

    if (!produto || !preco || !categorias || !imagem || !descricao) {
      alert('Preencha todos os campos para alterar.');
      return;
    }

    const imagemArray = Array.isArray(imagem)
      ? imagem
      : imagem.split(',').map((url) => url.trim());

    const produtoAlterado = { produto, preco, categorias, imagem: imagemArray, descricao };

    fetch(`https://lojasiegasbackend.onrender.com/alterar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoAlterado),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao alterar produto');
        return res.json();
      })
      .then(() => {
        setProdutos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...produtoAlterado } : p))
        );
        fecharModalEditar();
      })
      .catch((err) => console.error('Erro ao alterar produto:', err));
  };

  const excluirProduto = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    fetch(`https://lojasiegasbackend.onrender.com/produto/destroy/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao excluir produto');
        setProdutos((prev) => prev.filter((produto) => produto.id !== id));
      })
      .catch((err) => console.error('Erro ao excluir produto:', err));
  };

  const toggleDestaque = (id) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, destaque: !p.destaque } : p))
    );

    fetch(`https://lojasiegasbackend.onrender.com/siegaDestaca/${id}`, {
      method: 'POST',
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erro ao alterar destaque: ${res.status} - ${errorText}`);
        }
        return res.json();
      })
      .then((produtoAtualizado) => {
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === produtoAtualizado.id
              ? { ...p, destaque: produtoAtualizado.destaque }
              : p
          )
        );
      })
      .catch((err) => {
        console.error('Erro ao alternar destaque:', err);
        alert('Erro ao alterar destaque do produto.');
        setProdutos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, destaque: !p.destaque } : p))
        );
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Lista de Produtos</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lista de Produtos</h2>
          <button
            onClick={abrirModalAdicionar}
            className="flex items-center gap-2 bg-[#591E65] hover:bg-[#3f154b] text-white px-4 py-2 rounded"
          >
            ADICIONAR PRODUTO <FaPlus />
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Produto</th>
              <th className="py-2 px-4">Preço</th>
              <th className="py-2 px-4">Categoria</th>
              <th className="py-2 px-4">Descrição</th>
              <th className="py-2 px-0 text-left">Destaque</th>
              <th className="py-2 px-4">Imagem</th>
              <th className="py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ) : (
              produtos.map((produto) => (
                <tr key={produto.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{produto.produto}</td>
                  <td className="py-2 px-4">{produto.preco}</td>
                  <td className="py-2 px-4">{produto.categorias}</td>
                  <td className="py-2 px-4">{produto.descricao}</td>
                  <td
                    className="py-2 px-4 text-center cursor-pointer"
                    onClick={() => toggleDestaque(produto.id)}
                    title={produto.destaque ? 'Remover destaque' : 'Destacar produto'}
                  >
                    <FaStar size={20} color={produto.destaque ? 'gold' : 'lightgray'} />
                  </td>
                  <td className="py-2 px-4">
                    <img
                      src={Array.isArray(produto.imagem) ? produto.imagem[0] : produto.imagem}
                      alt={produto.produto}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => abrirModalEditar(produto)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => excluirProduto(produto.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal Adicionar */}
        {showModalAdicionar && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Adicionar Produto</h2>
              <div className="flex flex-col gap-3">
                <input type="text" name="produto" placeholder="Nome do produto" value={novoProduto.produto} onChange={handleChangeAdicionar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="preco" placeholder="Preço" value={novoProduto.preco} onChange={handleChangeAdicionar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="categorias" placeholder="Categoria" value={novoProduto.categorias} onChange={handleChangeAdicionar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="imagem" placeholder="URLs separadas por vírgula" value={novoProduto.imagem} onChange={handleChangeAdicionar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="descricao" placeholder="Descrição" value={novoProduto.descricao} onChange={handleChangeAdicionar} className="border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={fecharModalAdicionar} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
                <button onClick={adicionarProduto} className="px-4 py-2 rounded bg-[#591E65] text-white hover:bg-[#3f154b]">Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {showModalEditar && produtoEditando && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Alterar Produto</h2>
              <div className="flex flex-col gap-3">
                <input type="text" name="produto" placeholder="Nome do produto" value={produtoEditando.produto} onChange={handleChangeEditar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="preco" placeholder="Preço" value={produtoEditando.preco} onChange={handleChangeEditar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="categorias" placeholder="Categoria" value={produtoEditando.categorias} onChange={handleChangeEditar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="imagem" placeholder="URLs separadas por vírgula" value={produtoEditando.imagem} onChange={handleChangeEditar} className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" name="descricao" placeholder="Descrição" value={produtoEditando.descricao} onChange={handleChangeEditar} className="border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={fecharModalEditar} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
                <button onClick={salvarAlteracao} className="px-4 py-2 rounded bg-[#591E65] text-white hover:bg-[#3f154b]">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
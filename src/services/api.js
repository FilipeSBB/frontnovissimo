import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:55000', // Altere para a URL do seu backend
});

export const loginUser = async (email, senha) => {
    try {
        const response = await api.post('/login', { email, senha });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
};

export const registerUser = async (nome, email, senha) => {
    try {
        const response = await api.post('/clientes', { nome, email, senha });
        return response.data; // Mensagem de sucesso ou dados do usuário
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erro ao registrar usuário');
    }

   
};
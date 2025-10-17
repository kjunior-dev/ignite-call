// Importa a biblioteca Axios para fazer requisições HTTP
import axios from "axios";

// Cria uma instância do Axios com uma URL base definida
// Isso permite usar `api.get('/users')` em vez de escrever toda a URL completa
export const api = axios.create({
    baseURL: '/api', // Define o endpoint base das requisições
});

const Time = require('../models/Time');

/**
 * Gera um código único de 6 caracteres para times
 * Formato: 3 letras + 3 números (ex: ABC123)
 */
const gerarCodigoUnico = async () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    
    let codigo;
    let tentativas = 0;
    const maxTentativas = 100;
    
    do {
        // Gerar 3 letras aleatórias
        const letrasAleatorias = Array.from({ length: 3 }, () => 
            letras.charAt(Math.floor(Math.random() * letras.length))
        ).join('');
        
        // Gerar 3 números aleatórios
        const numerosAleatorios = Array.from({ length: 3 }, () => 
            numeros.charAt(Math.floor(Math.random() * numeros.length))
        ).join('');
        
        // Combinar letras e números
        codigo = letrasAleatorias + numerosAleatorios;
        
        // Verificar se o código já existe
        const codigoExiste = await Time.findOne({ codigoUnico: codigo });
        
        if (!codigoExiste) {
            return codigo;
        }
        
        tentativas++;
        
    } while (tentativas < maxTentativas);
    
    // Se chegou aqui, houve muitas tentativas
    throw new Error('Não foi possível gerar um código único após várias tentativas');
};

/**
 * Valida se um código tem o formato correto
 * @param {string} codigo - Código a ser validado
 * @returns {boolean} - True se válido, false caso contrário
 */
const validarFormatoCodigo = (codigo) => {
    if (!codigo || typeof codigo !== 'string') {
        return false;
    }
    
    // Deve ter exatamente 6 caracteres
    if (codigo.length !== 6) {
        return false;
    }
    
    // Primeiros 3 caracteres devem ser letras
    const letras = codigo.substring(0, 3);
    if (!/^[A-Z]{3}$/.test(letras)) {
        return false;
    }
    
    // Últimos 3 caracteres devem ser números
    const numeros = codigo.substring(3, 6);
    if (!/^[0-9]{3}$/.test(numeros)) {
        return false;
    }
    
    return true;
};

/**
 * Formata um código para o padrão correto (maiúsculo)
 * @param {string} codigo - Código a ser formatado
 * @returns {string} - Código formatado
 */
const formatarCodigo = (codigo) => {
    if (!codigo) return '';
    return codigo.toUpperCase().trim();
};

module.exports = {
    gerarCodigoUnico,
    validarFormatoCodigo,
    formatarCodigo
};

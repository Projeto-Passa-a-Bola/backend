// Debug das rotas
const app = require('./app.js');

console.log('🔍 Verificando rotas registradas...');

// Função para listar todas as rotas
function listarRotas(router, prefix = '') {
    if (router.stack) {
        router.stack.forEach((middleware, index) => {
            if (middleware.route) {
                const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
                console.log(`  ${methods} ${prefix}${middleware.route.path}`);
            } else if (middleware.name === 'router') {
                const subPrefix = prefix + (middleware.regexp.source.replace(/\\\//g, '/').replace(/\^|\$|\?/g, ''));
                listarRotas(middleware.handle, subPrefix);
            }
        });
    }
}

// Listar rotas do app
console.log('\n📋 Rotas registradas no app:');
listarRotas(app._router, '/');

console.log('\n✅ Debug concluído');

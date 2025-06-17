const bcrypt = require('bcryptjs');

async function testPassword() {
  const senha = 'admin123';
  
  // Gerar um novo hash
  const novoHash = await bcrypt.hash(senha, 10);
  console.log('Novo hash gerado:', novoHash);
  
  // Verificar se o hash funciona
  const senhaValida = await bcrypt.compare(senha, novoHash);
  console.log('Senha válida:', senhaValida);
}

testPassword(); 
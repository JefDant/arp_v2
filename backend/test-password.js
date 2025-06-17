const bcrypt = require('bcryptjs');

async function testPassword() {
  const senha = 'admin123';
  const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

  const senhaValida = await bcrypt.compare(senha, hash);
  console.log('Senha válida:', senhaValida);

  // Gerar um novo hash para comparação
  const novoHash = await bcrypt.hash(senha, 10);
  console.log('Novo hash gerado:', novoHash);
  console.log('Comparação com novo hash:', await bcrypt.compare(senha, novoHash));
}

testPassword(); 
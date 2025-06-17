-- Criação das tabelas
CREATE TABLE IF NOT EXISTS entidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('ADMIN', 'MASTER', 'USER') NOT NULL,
    entidade_id INT NOT NULL,
    tentativas_login INT DEFAULT 0,
    bloqueado_ate DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (entidade_id) REFERENCES entidades(id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    usuario_id INT NOT NULL,
    expira_em DATETIME NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS setores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    entidade_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (entidade_id) REFERENCES entidades(id)
);

CREATE TABLE IF NOT EXISTS modalidades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    entidade_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (entidade_id) REFERENCES entidades(id)
);

CREATE TABLE IF NOT EXISTS fornecedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    entidade_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (entidade_id) REFERENCES entidades(id)
);

CREATE TABLE IF NOT EXISTS atas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(50) NOT NULL,
    modalidade_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    setor_id INT NOT NULL,
    valor_inicial DECIMAL(15,2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    entidade_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (modalidade_id) REFERENCES modalidades(id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (setor_id) REFERENCES setores(id),
    FOREIGN KEY (entidade_id) REFERENCES entidades(id)
);

CREATE TABLE IF NOT EXISTS aditivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ata_id INT NOT NULL,
    numero VARCHAR(50) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    nova_vigencia DATE,
    data DATE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ata_id) REFERENCES atas(id)
);

CREATE TABLE IF NOT EXISTS empenhos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ata_id INT NOT NULL,
    numero VARCHAR(50) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    data DATE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ata_id) REFERENCES atas(id)
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empenho_id INT NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    data DATE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empenho_id) REFERENCES empenhos(id)
);

-- View para cálculo de saldos
CREATE OR REPLACE VIEW vw_saldos_atas AS
SELECT 
    a.id,
    a.numero,
    m.nome as modalidade,
    f.nome as fornecedor,
    GREATEST(a.data_fim, COALESCE(MAX(ad.nova_vigencia), a.data_fim)) as vigencia_atual,
    a.valor_inicial + COALESCE(SUM(ad.valor), 0) as valor_total,
    COALESCE(SUM(e.valor), 0) as valor_empenhado,
    COALESCE(SUM(p.valor), 0) as valor_pago,
    (a.valor_inicial + COALESCE(SUM(ad.valor), 0)) - COALESCE(SUM(e.valor), 0) as saldo_disponivel
FROM atas a
LEFT JOIN modalidades m ON a.modalidade_id = m.id
LEFT JOIN fornecedores f ON a.fornecedor_id = f.id
LEFT JOIN aditivos ad ON a.id = ad.ata_id AND ad.status = TRUE
LEFT JOIN empenhos e ON a.id = e.ata_id AND e.status = TRUE
LEFT JOIN pagamentos p ON e.id = p.empenho_id AND p.status = TRUE
WHERE a.status = TRUE
GROUP BY a.id, a.numero, m.nome, f.nome, a.data_fim, a.valor_inicial;

-- Inserir usuário admin inicial
INSERT INTO entidades (nome, cnpj, cidade, estado)
VALUES ('Administração Central', '00000000000000', 'Brasília', 'DF');

INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, entidade_id)
VALUES (
    'Administrador',
    'admin@sistema.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- senha: admin123
    'ADMIN',
    1
); 
const Joi = require('joi');

const schemas = {
    // Validação de login
    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Email inválido',
            'any.required': 'Email é obrigatório'
        }),
        senha: Joi.string().min(6).required().messages({
            'string.min': 'Senha deve ter no mínimo 6 caracteres',
            'any.required': 'Senha é obrigatória'
        })
    }),

    // Validação de usuário
    usuario: Joi.object({
        nome: Joi.string().min(3).required().messages({
            'string.min': 'Nome deve ter no mínimo 3 caracteres',
            'any.required': 'Nome é obrigatório'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Email inválido',
            'any.required': 'Email é obrigatório'
        }),
        senha: Joi.string().min(6).required().messages({
            'string.min': 'Senha deve ter no mínimo 6 caracteres',
            'any.required': 'Senha é obrigatória'
        }),
        nivel_acesso: Joi.string().valid('admin', 'gestor', 'usuario').default('usuario')
    }),

    // Validação de ata
    ata: Joi.object({
        numero: Joi.string().required().messages({
            'any.required': 'Número da ata é obrigatório'
        }),
        modalidade: Joi.string().required().messages({
            'any.required': 'Modalidade é obrigatória'
        }),
        fornecedor: Joi.string().required().messages({
            'any.required': 'Fornecedor é obrigatório'
        }),
        data: Joi.date().required().messages({
            'date.base': 'Data inválida',
            'any.required': 'Data é obrigatória'
        }),
        valor: Joi.number().positive().required().messages({
            'number.base': 'Valor deve ser um número',
            'number.positive': 'Valor deve ser positivo',
            'any.required': 'Valor é obrigatório'
        }),
        status: Joi.string().valid('Pendente', 'Aprovada', 'Cancelada').default('Pendente'),
        observacoes: Joi.string().allow('', null)
    }),

    // Ata
    ata: Joi.object({
        numero: Joi.string().required(),
        modalidade_id: Joi.number().integer().required(),
        fornecedor_id: Joi.number().integer().required(),
        setor_id: Joi.number().integer().required(),
        valor_inicial: Joi.number().positive().required(),
        data_inicio: Joi.date().required(),
        data_fim: Joi.date().min(Joi.ref('data_inicio')).required(),
        status: Joi.boolean()
    }),

    // Aditivo
    aditivo: Joi.object({
        ata_id: Joi.number().integer().required(),
        numero: Joi.string().required(),
        valor: Joi.number().positive().required(),
        nova_vigencia: Joi.date().min(Joi.ref('data')).required(),
        data: Joi.date().required(),
        status: Joi.boolean()
    }),

    // Empenho
    empenho: Joi.object({
        ata_id: Joi.number().integer().required(),
        numero: Joi.string().required(),
        valor: Joi.number().positive().required(),
        data: Joi.date().required(),
        status: Joi.boolean()
    }),

    // Pagamento
    pagamento: Joi.object({
        empenho_id: Joi.number().integer().required(),
        valor: Joi.number().positive().required(),
        data: Joi.date().required(),
        status: Joi.boolean()
    })
};

module.exports = schemas; 
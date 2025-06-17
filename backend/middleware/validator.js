const schemas = require('../validations/schemas');
const logger = require('../config/logger');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],
                message: detail.message
            }));

            logger.warn('Erro de validação:', { errors, body: req.body });
            return res.status(400).json({
                message: 'Dados inválidos',
                errors
            });
        }

        next();
    };
};

exports.validateLogin = validate(schemas.login);
exports.validateUsuario = validate(schemas.usuario);
exports.validateAta = validate(schemas.ata);
exports.validateAditivo = validate(schemas.aditivo);
exports.validateEmpenho = validate(schemas.empenho);
exports.validatePagamento = validate(schemas.pagamento); 
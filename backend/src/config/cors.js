const corsOptions = {
  origin: ['http://31.97.18.235:8080', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas
};

module.exports = corsOptions; 
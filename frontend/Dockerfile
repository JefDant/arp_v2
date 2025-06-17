FROM node:18-alpine as builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Fazer o build
RUN npm run build

# Imagem de produção
FROM nginx:alpine

# Copiar a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos do build da etapa anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Ajustar permissões
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"] 
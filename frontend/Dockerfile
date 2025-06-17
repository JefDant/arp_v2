FROM nginx:alpine

# Copiar a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar diretório para os arquivos estáticos
RUN mkdir -p /usr/share/nginx/html

# Copiar os arquivos do build
COPY build/ /usr/share/nginx/html/

# Ajustar permissões
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"] 
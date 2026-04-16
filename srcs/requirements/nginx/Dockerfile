FROM debian:bookworm

RUN apt update && apt install -y nginx openssl

# Remove default config
RUN rm -rf /etc/nginx/sites-enabled/default

COPY conf/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/ssl

RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=MA/ST=Casablanca/L=Casa/O=42/OU=1337/CN=localhost"

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

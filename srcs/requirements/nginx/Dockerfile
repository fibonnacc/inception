FROM debian:bookworm

RUN apt update && apt install -y nginx openssl

# Remove default config of nginx to make sure the confilct can't happen

RUN rm -rf /etc/nginx/sites-enabled/default

COPY conf/default.conf /etc/nginx/conf.d/default.conf


RUN mkdir -p /etc/nginx/ssl

# openssl ---> is a cryptographic library used to encrypt data , req ---> stand for request to create HTTPS certificate 
# -x509 ---> Standard flow (without -x509): You generate a CSR to send to a provider like DigiCert or Let's Encrypt.

# Self-signed flow (with -x509): You act as your own authority.
# This creates a .crt file that is technically valid for encryption but will trigger "Not Secure" warnings in web browsers because a known authority didn't vouch for it.

# -days 365 ---> stand for make the certificate that are generated useful for one year.

RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=MA/ST=Casablanca/L=Casa/O=42/OU=1337/CN=localhost"

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

FROM debian:bookworm

RUN apt update && apt install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-mysql \
    php8.2-redis \
    curl \
    mariadb-client \
    && apt clean && rm -rf /var/lib/apt/lists/*

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

WORKDIR /var/www/html

# ensure PHP-FPM runs in foreground safely
COPY tools/setup.sh /setup.sh

RUN chmod +x /setup.sh

EXPOSE 9000

CMD ["/setup.sh"]

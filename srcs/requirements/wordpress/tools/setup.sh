#!/bin/bash

# Ensure /run/php exists for the PID file
mkdir -p /run/php

# Wait for MariaDB to be ready
while ! mariadb-admin ping -h"mariadb" --silent; do
    echo "Waiting for MariaDB..."
    sleep 2
done

cd /var/www/html

if [ ! -f "wp-config.php" ]; then
    echo "Configuring WordPress..."
    
    wp core download --allow-root

    wp config create --allow-root \
        --dbname=$MYSQL_DATABASE \
        --dbuser=$MYSQL_USER \
        --dbpass=$MYSQL_PASSWORD \
        --dbhost=mariadb:3306

    wp core install --allow-root \
        --url=$DOMAIN_NAME \
        --title="Inception" \
        --admin_user=$WP_ADMIN_USER \
        --admin_password=$WP_ADMIN_PASSWORD \
        --admin_email=$WP_ADMIN_EMAIL

    wp user create --allow-root \
        $WP_USER $WP_USER_EMAIL \
        --role=author \
        --user_pass=$WP_USER_PASSWORD

    chown -R www-data:www-data /var/www/html
    chmod -R 755 /var/www/html
fi

# Configure PHP-FPM to listen on 9000
sed -i "s/listen = .*/listen = 9000/" /etc/php/8.2/fpm/pool.d/www.conf

echo "Starting PHP-FPM..."
exec php-fpm8.2 -F

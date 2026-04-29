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

    # Redis configuration
    wp config set WP_REDIS_HOST redis --allow-root
    wp config set WP_REDIS_PORT 6379 --raw --allow-root
    wp config set WP_CACHE true --raw --allow-root

    wp plugin install redis-cache --activate --allow-root
    wp redis enable --allow-root

    chown -R www-data:www-data /var/www/html
    chmod -R 755 /var/www/html
fi

# Ensure Redis is configured and plugin is active (outside the initial install block)
if ! wp config get WP_REDIS_HOST --allow-root > /dev/null 2>&1; then
    echo "Adding Redis configuration to wp-config.php..."
    wp config set WP_REDIS_HOST redis --allow-root
    wp config set WP_REDIS_PORT 6379 --raw --allow-root
    wp config set WP_CACHE true --raw --allow-root
fi

if ! wp plugin is-active redis-cache --allow-root; then
    echo "Activating Redis Cache plugin..."
    wp plugin install redis-cache --activate --allow-root
    wp redis enable --allow-root
fi

# Configure PHP-FPM to listen on 9000
sed -i "s/listen = .*/listen = 9000/" /etc/php/8.2/fpm/pool.d/www.conf

echo "Starting PHP-FPM..."
exec php-fpm8.2 -F

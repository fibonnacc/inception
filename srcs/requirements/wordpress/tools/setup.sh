#!/bin/bash

sed -i "s/listen = .*/listen = 9000/" /etc/php/*/fpm/pool.d/www.conf

exec php-fpm7.4 -F

#!/bin/bash

# Check if required variables are set
if [ -z "$FTP_USER" ] || [ -z "$FTP_PASSWORD" ]; then
    echo "FTP_USER or FTP_PASSWORD not set. Exiting."
    exit 1
fi

# Create FTP user if it doesn't exist
if ! id -u "$FTP_USER" >/dev/null 2>&1; then
    echo "Creating FTP user: $FTP_USER"
    useradd -m "$FTP_USER"
    echo "$FTP_USER:$FTP_PASSWORD" | chpasswd
    
    # Ensure the user can write to the wordpress directory
    # The wordpress data is mounted at /var/www/html
    usermod -d /var/www/html "$FTP_USER"
    chown "$FTP_USER:$FTP_USER" /var/www/html
fi

# Ensure vsftpd run directory exists
mkdir -p /var/run/vsftpd/empty

echo "Starting vsftpd..."
exec vsftpd /etc/vsftpd.conf

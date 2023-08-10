# Utiliser l'image PHP-FPM officielle avec PHP 8.1
FROM php:8.1.0-fpm
# Install system dependencies
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libpq-dev \
    git \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-configure intl && \
    docker-php-ext-install intl pdo pdo_mysql

# Set the working directory
WORKDIR /var/www/html

# Copy the project files to the working directory
COPY . /var/www/html

# Install Composer and project dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && COMPOSER_ALLOW_SUPERUSER=1 composer install --no-interaction --optimize-autoloader

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Run PHP-FPM
CMD ["php-fpm"]

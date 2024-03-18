# Use the official PHP image
FROM php:8.0-fpm

# Set working directory
WORKDIR /var/www/html

# Install PHP dependencies and extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql zip \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy composer.json and composer.lock
COPY flycsvBackend/composer.json flycsvBackend/composer.lock ./

# Install dependencies
RUN composer install --no-scripts --no-autoloader

# Copy the rest of the application
COPY flycsvBackend .

# Install Composer dependencies with autoloader optimization
RUN composer install --optimize-autoloader --no-dev

# Expose port 9000
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
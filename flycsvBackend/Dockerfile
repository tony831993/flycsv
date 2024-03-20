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

RUN curl -sS https://get.symfony.com/cli/installer | bash
# RUN export PATH="$HOME/.symfony5/bin:$PATH"
RUN cp $HOME/.symfony5/bin/symfony /usr/bin/symfony-cmd
RUN chmod +x /usr/bin/symfony-cmd

COPY . .

# Install dependencies
RUN composer install -vvvvvv

# Expose port 8000
EXPOSE 8000

# Start PHP-FPM
ENTRYPOINT [ "/usr/bin/symfony-cmd", "server:start", "--allow-http"]
# CMD ["/usr/bin/symfony-cmd", "server:start", "--allow-http"]
# CMD ["symfony", "server:start", "--allow-http"]



# # Use the official PHP image
# FROM php:8.0-fpm

# # Set working directory
# WORKDIR /var/www/html

# # Install PHP dependencies and extensions
# RUN apt-get update && apt-get install -y \
#     git \
#     unzip \
#     libzip-dev \
#     && docker-php-ext-install pdo_mysql zip \
#     && pecl install xdebug \
#     && docker-php-ext-enable xdebug

# # Install Composer
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# RUN curl -sS https://get.symfony.com/cli/installer | bash
# # RUN export PATH="$HOME/.symfony5/bin:$PATH"
# RUN cp $HOME/.symfony5/bin/symfony /usr/bin/symfony-cmd
# RUN chmod +x /usr/bin/symfony-cmd

# COPY . .

# # Install dependencies
# RUN composer install -vvvvvv

# # Expose port 8000
# EXPOSE 8000

# # Start PHP-FPM
# ENTRYPOINT [ "/usr/bin/symfony-cmd", "server:start"]
# Use official PHP 8.2 with Composer
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-configure gd \
    && docker-php-ext-install gd pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install dependencies
RUN composer install

# Set permissions for Laravel storage and cache
RUN chmod -R 777 storage bootstrap/cache

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]

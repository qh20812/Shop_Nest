FROM php:8.2-fpm

# Cài đặt các package hệ thống và extension PHP cần thiết
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Cài redis và xdebug nếu cần
RUN pecl install redis xdebug \
    && docker-php-ext-enable redis xdebug

# Cài composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install

# Phân quyền cho storage và bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["composer", "run", "dev"]
FROM redis
MAINTAINER adeel_zammit

# Placing application in there
WORKDIR /redis-data

COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
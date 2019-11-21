FROM postgres:alpine
ADD postgres.sql /docker-entrypoint-initdb.d/postgres.sql
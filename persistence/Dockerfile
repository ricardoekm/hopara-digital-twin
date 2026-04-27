FROM postgis/postgis:15-3.4-alpine

COPY sql/tenant/*.sql /docker-entrypoint-initdb.d/
COPY sql/hopara/*.sql /docker-entrypoint-initdb.d/
COPY sql/template/*.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=hopara
ENV POSTGRES_PASSWORD=hopara

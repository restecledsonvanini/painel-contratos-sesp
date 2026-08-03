FROM postgres:15-alpine

# Default credentials for local development — override with env or compose
ENV POSTGRES_USER=painel
ENV POSTGRES_PASSWORD=pass
ENV POSTGRES_DB=painel_db

VOLUME ["/var/lib/postgresql/data"]

EXPOSE 5432

# The official image's default CMD is sufficient
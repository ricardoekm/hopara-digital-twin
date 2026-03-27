# syntax=docker/dockerfile:1.7
FROM hopara/resource-base:latest
ARG MAMBA_DOCKERFILE_ACTIVATE=1
ENV MAMBA_NO_BANNER=1

ENV PYTHONPATH=. \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

ENV MAMBA_NO_PROGRESS_BARS=1 \
    MAMBA_SAT_SOLVER_THREADS=1 \
    MAMBA_DOWNLOAD_THREADS=2 \
    MAMBA_EXTRACT_THREADS=1

# Copia os arquivos do projeto (usar menos camadas)
WORKDIR /
COPY common ./common
COPY consumer ./consumer

COPY consumer/requirements-conda.txt /tmp/consumer-requirements-conda.txt
COPY consumer/requirements.txt /tmp/consumer-requirements.txt
COPY env /tmp/env

RUN --mount=type=cache,target=/opt/conda/pkgs \
    set -eux; \
    inkscape --version; \
    micromamba run -n hopara python ./consumer/set_inkscape_config.py

RUN --mount=type=cache,target=/opt/conda/pkgs \
    set -eux; \
    micromamba install -y -n hopara -f /tmp/env/hopara-explicit-consumer.txt; \
    micromamba clean --all -y || true

RUN --mount=type=cache,target=/opt/conda/pkgs \
    set -eux; \
    micromamba run -n hopara pip install -r /tmp/consumer-requirements.txt -v --root-user-action=ignore; \
    micromamba clean --all -y || true; \
    rm -rf /root/.cache || true; \
    find /opt/conda/envs/hopara -type d -name "__pycache__" -prune -exec rm -rf {} + || true; \
    find /opt/conda/envs/hopara -type f -name "*.py[co]" -delete || true; \
    find /opt/conda/envs/hopara -type d -path "*/site-packages/*/tests" -prune -exec rm -rf {} + || true

# Pre-cache numba JIT compilations for pymatting (avoids ~300s startup penalty)
ENV NUMBA_CACHE_DIR=/opt/numba_cache
RUN --mount=type=cache,target=/opt/conda/pkgs \
    set -eux; \
    mkdir -p /opt/numba_cache; \
    micromamba run -n hopara python -c "import pymatting"; \
    chmod -R a+r /opt/numba_cache

# Define o comando padrão
CMD ["/opt/conda/envs/hopara/bin/python", "-u", "./consumer"]
EXPOSE 2023

# syntax=docker/dockerfile:1.7

########## STAGE 1: builder (micromamba) ##########
FROM mambaorg/micromamba:1.5.8 AS builder

# Enable automatic activation for RUN lines that need the env
ARG MAMBA_DOCKERFILE_ACTIVATE=1
ENV MAMBA_DEFAULT_CHANNELS=conda-forge \
    CONDA_CHANNEL_PRIORITY=strict \
    MAMBA_NO_BANNER=1 \
    PYTHONDONTWRITEBYTECODE=1

# OS deps required for building/using some Python packages at build time only
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        file \
        ca-certificates \
        libmagic1 \
        wget && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only manifests first to leverage cache better
COPY api/requirements-conda.txt /app/api/requirements-conda.txt
COPY api/requirements.txt       /app/api/requirements.txt
COPY setup.py                   /app/setup.py

# Create env and install requirements
COPY env/ /tmp/env/
RUN micromamba config append channels conda-forge; \
    micromamba config set channel_priority strict
RUN micromamba create -y -n hopara -f /tmp/env/hopara-explicit-api.txt; \
    micromamba install -y -n hopara -f /app/api/requirements-conda.txt -c conda-forge --strict-channel-priority; \
    micromamba run -n hopara pip install --no-cache-dir --force-reinstall --ignore-installed -r /app/api/requirements.txt -v

# Now copy the rest of the source (so editable install links to /app)
COPY common /app/common
COPY api    /app/api

# Editable install (kept as in your original to preserve behavior)
RUN micromamba run -n hopara pip install -e /app

# Clean conda/pip caches and prune unneeded files to shrink the env
RUN micromamba clean --all -y && \
    rm -rf /opt/conda/pkgs /root/.cache && \
    find /opt/conda/envs/hopara -type d -name "__pycache__" -prune -exec rm -rf {} + && \
    find /opt/conda/envs/hopara -type f -name "*.pyc" -delete && \
    find /opt/conda/envs/hopara -type f -name "*.pyo" -delete && \
    find /opt/conda/envs/hopara -type f -name "*.a"   -delete && \
    find /opt/conda/envs/hopara -type d -path "*/site-packages/*/tests" -prune -exec rm -rf {} + || true


########## STAGE 2: runtime (slim) ##########
FROM debian:12-slim

# Minimal runtime libs (no dev headers); keep only what app actually needs
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        mailcap \
        file \
        libmagic1 \
        wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy entrypoint and source (editable install expects /app to exist)
COPY common ./common
COPY api ./api
COPY resources ./resources

COPY setup.py ./setup.py

# Bring in the prebuilt conda env from builder stage
COPY --from=builder /opt/conda/envs/hopara /opt/conda/envs/hopara

# Expose env binaries
ENV PATH="/opt/conda/envs/hopara/bin:${PATH}" \
    PYTHONDONTWRITEBYTECODE=1

# If you still need editable behavior at runtime, the egg-link created during builder stage will work
# because we kept the same /app path and copied sources.

CMD ["/opt/conda/envs/hopara/bin/python", "-u", "./api"]

EXPOSE 2022

# Use official Airflow image with constraints for production
FROM apache/airflow:2.10.4-python3.12

# Set build arguments for potential customization
ARG AIRFLOW_HOME=/opt/airflow

# Install system dependencies and create airflow user
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Create virtual environment for better dependency isolation
RUN python -m venv ${AIRFLOW_HOME}/venv && \
    ${AIRFLOW_HOME}/venv/bin/pip install --no-cache-dir --upgrade pip

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN ${AIRFLOW_HOME}/venv/bin/pip install --no-cache-dir \
    -r requirements.txt \
    --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.10.4/constraints-3.12.txt"

# Copy application code
COPY . ${AIRFLOW_HOME}/dags/

# Set proper ownership and switch to non-root user
RUN chown -R airflow:0 ${AIRFLOW_HOME} && \
    chmod -R g=u ${AIRFLOW_HOME}
USER airflow

# Activate virtual environment in PATH
ENV PATH="${AIRFLOW_HOME}/venv/bin:$PATH"
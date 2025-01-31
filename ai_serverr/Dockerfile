# Use a common base image
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# First stage creates a virtual environment and installs packages.
FROM base AS build

# Install OS packages
RUN apt-get update \
 && apt-get install -y git # build-essential libfoo-dev libbar-dev

# Create and populate the virtual environment
RUN python -m venv /venv \
 && /venv/bin/pip install --upgrade pip
COPY requirements.txt ./
RUN /venv/bin/pip install -r requirements.txt

# Final stage is the image you'll actually run
FROM base
# RUN apt-get update \
#  && apt-get install -y libfoo1 libbar2
COPY --from=build /venv/ /venv/
ENV PATH=/venv/bin:$PATH

# Run the application
COPY . .
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
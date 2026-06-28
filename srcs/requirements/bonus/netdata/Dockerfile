FROM debian:bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    curl \
    wget \
    bash \
    ca-certificates \
    procps \
    iproute2 \
    lm-sensors \
    netcat-openbsd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Download and run the official kickstart script in non-interactive mode
# --dont-start-it prevents the script from starting the daemon during image building
RUN wget -O /tmp/kickstart.sh https://get.netdata.cloud/kickstart.sh && \
    chmod +x /tmp/kickstart.sh && \
    /tmp/kickstart.sh --non-interactive --dont-start-it --stable-channel --disable-telemetry && \
    rm -f /tmp/kickstart.sh

# Expose default Netdata port
EXPOSE 19999

# Run the Netdata daemon in the foreground as entrypoint
ENTRYPOINT ["/usr/sbin/netdata", "-D"]

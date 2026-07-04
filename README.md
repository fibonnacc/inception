*This project has been created as part of the 42 curriculum by helfatih.*

# Inception

## Description

**Inception** is a system administration project in the 42 curriculum. The goal of this project is to set up a small infrastructure of multi-container services using **Docker Compose** on a virtual machine (or local environment). Every service runs in its own dedicated container, built from scratch using custom `Dockerfiles` based on the Debian Linux distribution (`debian:bookworm`), without relying on ready-made pre-packaged images.

### Project Goals and Overview
The primary goal is to gain hands-on experience with virtualization, system isolation, network configuration, and service orchestration. The project requires configuring:
1. An **NGINX** web server serving as a reverse proxy, listening on port 443 with TLSv1.2 or TLSv1.3 protocols.
2. A **WordPress** application server running PHP-FPM (FastCGI) to handle dynamic web content.
3. A **MariaDB** database server containing the WordPress database.
4. Several **Bonus** services including:
   - **Redis**: An in-memory cache to optimize WordPress performance.
   - **FTP Server (vsftpd)**: Enabling secure file transfer directly to the WordPress installation folder.
   - **Adminer**: A lightweight, web-based database management interface.
   - **Static Website**: A basic HTML/CSS site served on an independent port.
   - **Netdata**: A real-time system monitoring tool with host access.

---

### Use of Docker & Sources Included
Docker is utilized to guarantee environment consistency, rapid deployment, and isolated resources across different services. The repository structure is organized as follows:
- **`Makefile`**: Automation script at the root of the project to manage building, running, and destroying the application.
- **`srcs/`**: Main sources directory.
  - **`docker-compose.yml`**: Coordinates container orchestration, storage, networks, and environment setups.
  - **`requirements/nginx/`**: Dockerfile, configurations, and certificate setup for the NGINX web server.
  - **`requirements/wordpress/`**: Dockerfile and initialization script (using WP-CLI) for WordPress.
  - **`requirements/mariadb/`**: Dockerfile and database initialization script for MariaDB.
  - **`requirements/bonus/`**: Subdirectories for Redis, FTP, Adminer, Static Website, and Netdata containers.
- **`secrets/`**: Temporary directory storing credentials for sensitive variables (such as database root password).

---

### Main Design Choices
1. **Debian Bookworm (`debian:bookworm`)**: Chosen as the uniform base image for all services to guarantee library consistency and security updates.
2. **PHP-FPM**: Configured WordPress to communicate via PHP-FPM over TCP port 9000 instead of UNIX sockets or Apache modules, ensuring clean separation from NGINX.
3. **Bridge Networking**: Orchestrated a single custom bridge network (`inception_network`) where only NGINX, FTP, Adminer, Static Website, and Netdata expose ports to the external host, keeping the database and cache internal and secure.
4. **Host-Bound Local Volumes**: Set up persistent storage mapping directories inside the container to local host paths (`/home/hicham/data/wordpress` and `/home/hicham/data/mariadb`) to ensure data remains persistent if containers are deleted.

---

### Technical Comparisons

#### 1. Virtual Machines vs. Docker
| Feature | Virtual Machines (VMs) | Docker (Containers) |
| :--- | :--- | :--- |
| **Architecture** | Hypervisor runs guest OS kernel + binaries/libraries on top of host OS. | Containers run directly on host OS kernel using namespaces and cgroups. |
| **Resource Efficiency** | High overhead. Pre-allocates memory and CPU cores which remain reserved even when idle. | Low overhead. Shares CPU, RAM, and storage dynamically with the host system. |
| **Storage Footprint** | Large (GBs per VM) due to complete guest OS filesystem. | Very small (MBs) as only the app and direct dependencies are packaged. |
| **Startup Speed** | Slow (minutes) to boot the guest operating system. | Instant (seconds/milliseconds) as it just runs host-isolated processes. |
| **Isolation** | Hard isolation at the hardware level (extremely secure). | Process-level isolation at the OS level (secure but shares host kernel). |

#### 2. Secrets vs. Environment Variables
| Feature | Secrets | Environment Variables |
| :--- | :--- | :--- |
| **Security** | Highly secure. Encrypted at rest, managed in-memory, and not exposed in logs or inspect commands. | Moderate-to-low security. Exposed in `docker inspect`, process tables, and logs. |
| **Storage** | Mounted temporarily in-memory inside the container (typically under `/run/secrets/`). | Injected directly into the container processes' environment variables. |
| **Lifecycle** | Best for sensitive keys, SSL certificates, passwords, and tokens. | Best for non-sensitive configurations (domain names, URLs, port numbers, debug flags). |
| **Revocation** | Can be rotated or revoked dynamically on orchestrators. | Requires container restart or rebuild to apply changes. |

#### 3. Docker Network vs. Host Network
| Feature | Docker Network (Bridge) | Host Network (`network_mode: host`) |
| :--- | :--- | :--- |
| **Isolation** | Isolated from host network. Containers run on a virtual network interface. | Shares the host network interface directly. Container is not isolated from host ports. |
| **Port Exposure** | Ports must be explicitly forwarded/exposed (`ports:` list) to the host. | Ports bound inside the container are instantly exposed on the host's actual ports. |
| **DNS Resolution** | Built-in DNS server allows services to contact each other by container name (e.g. `mariadb`). | Relies strictly on host's routing and hostname settings (no automatic DNS resolution). |
| **Overhead** | Minimal performance overhead due to virtual bridge routing and NAT translations. | Zero networking overhead; performance matches native host throughput. |
| **Port Conflicts** | No host conflicts; multiple containers can use the same internal port. | High risk of conflict if a host service is already listening on the same port. |

#### 4. Docker Volumes vs. Bind Mounts
| Feature | Docker Volumes | Bind Mounts |
| :--- | :--- | :--- |
| **Management** | Managed entirely by Docker. Files are stored in a Docker-isolated area (`/var/lib/docker/volumes/`). | Managed by the host OS. Maps any arbitrary file/folder on the host filesystem. |
| **Host Dependency** | Highly portable. Does not depend on host directory hierarchies or file structures. | Low portability. Depends on host path existence, configuration, and host file structure. |
| **Permissions** | Docker handles user permissions and storage ownership automatically. | Relies on the host's UID/GID permissions, which can lead to access conflicts. |
| **Interactions** | Safely modified only via Docker CLI/API. Host users cannot accidentally delete files. | Directly modifiable by any host process or user with access to the path. |
| **Use Case** | Production databases, persistent backups, and dynamic container data. | Live source code reloading during development, sharing socket files (like `/var/run/docker.sock`). |

---

## Instructions

### Prerequisites
- Operating System: **Linux** (Debian/Ubuntu recommended)
- **Docker** and **Docker Compose** installed
- Domain host resolution capability (`sudo` permissions required to edit hosts)

### Installation & Execution

#### 1. Setup the Host Domain
Ensure that the domain name `hicham.42.fr` points to your local machine.
Open `/etc/hosts` in your editor of choice:
```bash
sudo nano /etc/hosts
```
Add the following line and save the file:
```text
127.0.0.1 hicham.42.fr
```

#### 2. Create Persistent Volume Directories
Create the directories on the host system to store WordPress files and database data:
```bash
sudo mkdir -p /home/hicham/data/wordpress
sudo mkdir -p /home/hicham/data/mariadb
```

#### 3. Build and Run the Services
Use the provided `Makefile` at the root of the project to manage the infrastructure:
- **Build and Start containers**:
  ```bash
  make
  ```
  *(This will build the Docker images and start the services in detached mode).*

- **Stop containers**:
  ```bash
  make down
  ```

- **Rebuild and restart**:
  ```bash
  make re
  ```

- **Clean Docker volumes & unused configurations**:
  ```bash
  make clean
  ```

#### 4. Testing the Setup
- Access WordPress via HTTPS at [https://hicham.42.fr](https://hicham.42.fr) (Nginx exposes 443).
- Access Adminer at [http://hicham.42.fr:8080](http://hicham.42.fr:8080) (Adminer listens on 8080).
- Access the static website at [http://hicham.42.fr:8081](http://hicham.42.fr:8081) (Static Website listens on 8081).
- Monitor the containers in real-time with Netdata at [http://hicham.42.fr:19999](http://hicham.42.fr:19999).

---

## Resources

### Classic References
- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Specification](https://docs.docker.com/compose/)
- [WordPress CLI (WP-CLI) Handbook](https://make.wordpress.org/cli/handbook/)
- [NGINX Server Configuration and SSL Setup](https://nginx.org/en/docs/)
- [MariaDB Knowledge Base](https://mariadb.com/kb/en/)

### AI Usage Disclosure
Artificial Intelligence (AI) was utilized in the development and documentation of this project for the following tasks:
1. **Docker-Compose Network Architecture**: Assisted in constructing the isolated bridge network configuration, mapping container-to-container routing.
2. **Setup Script Logic**: Helped write resilient startup scripts (`setup.sh` and `init.sh`) to block wordpress configuration until MariaDB server is fully online and responsive.
3. **OpenSSL Configuration**: Assisted in formatting the self-signed certificate generation commands inside Nginx Dockerfile.
4. **Documentation and Comparisons**: Generated comparison tables between VMs/Docker, Secrets/Env, Bridge/Host networks, and Volumes/Bind mounts to fulfill documentation constraints.
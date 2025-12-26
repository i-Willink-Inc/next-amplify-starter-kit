# Devcontainer Usage Guide

[日本語 (Japanese)](devcontainer-guide.ja.md)

> **Last Updated**: 2025-12-16
> **Status**: Approved

## Overview

This project uses VS Code Dev Containers to provide a unified development environment.
You can use either Docker Desktop or Rancher Desktop.

---

## Using Docker Desktop

### Preparation

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Start Docker Desktop and wait until the whale icon appears in the system tray

### Docker Context Setup

```bash
docker context use desktop-linux
docker ps
```

### Start Devcontainer

1. Open project in VS Code
2. Ctrl+Shift+P → **"Dev Containers: Reopen in Container"**

---

## Using Rancher Desktop

### Preparation

1. Install [Rancher Desktop](https://rancherdesktop.io/)
2. Start Rancher Desktop
3. **Preferences** → **Container Engine** → Select **`dockerd (moby)`**

### Docker Context Setup

```bash
docker context use default
docker ps
```

### Start Devcontainer

1. Open project in VS Code
2. Ctrl+Shift+P → **"Dev Containers: Reopen in Container"**

---

## Switching Between Docker Desktop and Rancher Desktop

```bash
# Check available contexts
docker context ls

# Use Docker Desktop
docker context use desktop-linux

# Use Rancher Desktop
docker context use default
```

> [!IMPORTANT]
> It is recommended to quit the unused application before switching.

---

## Troubleshooting

### `failed to connect to the docker API`

- Check if Docker Desktop / Rancher Desktop is running
- Switch to the correct Docker context

### `context "rancher-desktop" not found`

- Use `docker context use default`

### pnpm install fails inside container

- Check network connection
- Rebuild using **"Dev Containers: Rebuild Container"**

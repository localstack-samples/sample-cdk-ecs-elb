# 🚀 Project Quick Start Guide

This project provides a simple `node.js` server sample, designed to offer a straightforward starting point and reference for building, deploying, and running a `node.js` application within a Docker container, facilitated by automated tasks in a `Makefile`.

## 📂 Structure

```
src
├── Dockerfile
├── Makefile
└── app
    ├── package.json
    └── server.js
```

### 📜 Files:
- **Dockerfile**: Instructions to build Docker image.
- **Makefile**: Automates build and run tasks.
- **app/server.js**: Entry point to Node.js app containing sample server.
- **app/package.json**: Manages project metadata & dependencies.

## 🚀 Getting Started

### 🛠 Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### 🛠 Setup & Run
1. **Build & Run with Docker**
   ```shell
   make build
   make run
   ```
   Or **Run with Node.js**
   ```shell
   cd app
   npm install
   npm start
   ```
2. **Access App**
   ```
   http://localhost:3000
   ```

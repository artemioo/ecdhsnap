# ECDH Master 
ECDH Master is a MetaMask Snap that allow you to send encrypted messages without revealing any personal data.

This repository hosts a demo site and the Snap, powered by ECDH protocol.


## Getting Started

Prerequisites
- Install Node.js v19
- Install MetaMask(or MetaMask Flask) extension

You need install all dependencies:
```shell
yarn install
```

Then run:

```shell
yarn start
```

If didn't work try this:
```shell
yarn workspaces foreach --parallel --interlaced --verbose --all run start

```

## Main Folders&Files


```
|-- packages/
|   |-- site/
│   │   │   ├── src/
│   │   |       ├── assets/
│   │   |       └── components/
│   │   |       └── config/
│   │   |       └── hooks/
│   │   |       └── pages/
│   │   |       └── types/
│   │   |       └── utils/
|   |-- snap/
│   │   │   ├── src/
``````
- **site** files contain mostly demo-site methods, logic etc.

- **snap** files contain RpcHandler and methods, logic it works with.
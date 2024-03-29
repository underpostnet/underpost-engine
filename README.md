## NodeJS/VanillaJS CLI/API/GUI Engine

[![Node.js CI](https://github.com/underpostnet/underpost-engine/actions/workflows/docker-image.yml/badge.svg?branch=master)](https://github.com/underpostnet/underpost-engine/actions/workflows/docker-image.yml) [![Test](https://github.com/underpostnet/underpost-engine/actions/workflows/dev.test.yml/badge.svg?branch=master)](https://github.com/underpostnet/underpost-engine/actions/workflows/dev.test.yml) [![Coverage Status](https://coveralls.io/repos/github/underpostnet/underpost-engine/badge.svg?branch=master)](https://coveralls.io/github/underpostnet/underpost-engine?branch=master)

Engine for developing and deployment web clients graphical user interface and APIs RESTful.

Modular and stand-alone components client architecture with virtual URL navigation and reload consistency.

#### Install

Run terminal with administrator privileges

- `npm install`

- `npm run install-underpost`

- `npm run install-test` (optional for test)

- `npm run install-ipfs` (optional for ipfs)

<!--

--reporter=cobertura --reporter=text-lcov --reporter=text --reporter=html

"mocha": "_mocha -b -R spec",
"coverage": "nyc npm run test && nyc report --reporter=text-lcov --reporter=lcov | node ./node_modules/coveralls/bin/coveralls.js --verbose",

`npm install -g yarn`
`npm install -g nyc`

 -->

#### Usage

- run gui/api dev server `npm run dev`

- run gui/api prod server `npm start`

- generate www dev client build `npm run build-dev <optional-single-client-id-module>`

- generate www prod client build `npm run build-prod <optional-single-client-id-module>`

- run network CLI `npm run cli`

- run unit test `npm run test-dev`

#### Docker Usage

- build dev docker image `docker build . -t underpost-engine` or production `docker build -t underpost-engine -f Dockerfile.production`

- create volume `docker volume create underpost-engine-vol` and `docker volume create underpost-engine-vol0`

- run dev image `docker run --name live-underpost-engine -p 41061:22 -p 41062:80 -p 41063:5500 -p 41064:5501 -d -v underpost-engine-vol:/www -v underpost-engine-vol0:/data underpost-engine` (-v :/opt/lampp/htdocs :/usr/src/app/data)

- ssh connection (default SSH password is 'root') `ssh root@localhost -p 41061`, verify /.ssh/known_hosts

- get a shell terminal inside your container `docker exec -ti live-underpost-engine bash`

#### Development K8s Usage

- create cluster `kind create cluster` or `kind create cluster --config=<cluster-config-file>.yaml`

- view clusters `kind get clusters` or `kubectl get all`

- load docker image `kind load docker-image underpost-engine:latest`

- get docker-images that are loaded `docker exec -it kind-control-plane crictl images`

- run pod `kubectl apply -f pod.yaml`

- status pod `kubectl describe pod underpost-engine` or `kubectl get pod underpost-engine`

- view logs `kubectl logs underpost-engine`

- get a shell terminal inside k8s container `kubectl exec --stdin --tty underpost-engine -- /bin/bash`

#### Web Client/GUI Features

- jwt auth

- asymmetric keys management

- session management

- markdown editor

- wysiwyg editor

- javascript live demo

- socket.io/peer audio-video media stream (WebRTC)

- cloud folder/files management

- audio player

- youtube mp3 downloader

- youtube api integration (video management and player)

- SEO

- Microdata

- Pixi.js RPG Game

#### Virtual Machine HTTP/WS API Server Features

- jwt auth API

- asymmetric keys API

- cloud folder/files API

- Rich-Content/Markdown API CRUD RESTful

- Ajv JSON schema validator

- CORS validators

- socket.io/peer server audio-video media stream (WebRTC)

- Server Side Rendering (SSR)

- IPFS integration

- CLI for keys management, wallet, and blockchain miner

- Debian/nodejs/xampp runtime environment docker image

- SSH container server

- Swagger API RESTful docs module

#### Current productions projects

- [dogmadual.com](https://www.dogmadual.com)

- [underpost.net](https://underpost.net)

- [cryptokoyn.net](https://www.cryptokoyn.net)

- [nexodev.org](https://www.nexodev.org)

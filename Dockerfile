# Образ ноды и эмит дист сделать свежими, иначе легаси
FROM node:14
# Создание папки app
WORKDIR /app
# tsc не будет, подумать как лучше сделать
RUN tsc
COPY /dist /app
RUN node /dist/main.js
COPY . .
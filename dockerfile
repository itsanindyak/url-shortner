# <----Builder Stage---->
FROM node:slim AS builder

# working directory
WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY src ./src

FROM node:slim AS runtime

WORKDIR /app

COPY --from=builder /app /app


EXPOSE 8400

CMD [ "node","src/index.js" ]
FROM    node:18.12.1

WORKDIR /usr/src/app
COPY    . .
RUN     npm install -d

EXPOSE  3000

ENTRYPOINT ["npm","run","dev"]

FROM    node:18.12.1

WORKDIR /usr/src/app
COPY    . .
RUN     npm install -g @angular/cli
RUN     npm install -d

EXPOSE  4200

ENTRYPOINT ["ng","serve"]

FROM agna/tsc-node

ENV APIPORT 6100
ENV DBTYPE mongo
ENV DBURL mongo
ENV DBPORT 27017
ENV DBNAME api
ENV REDIS redis 
ENV REDIS_PORT 6379

RUN mkdir -p /<%= htmlComponentName %>

WORKDIR /<%= htmlComponentName %>
COPY . .

CMD pm2 start dist/index.js --name <%= htmlComponentName %> -x -- \
        --apiPort $APIPORT \
        --dbType $DBTYPE \
        --redis $REDIS \ 
        --redis-port $REDIS_PORT \ 
        --mongoUrl $DBURL \ 
        --mongoPort $DBPORT \ 
        --mongoCollection $DBNAME && \ 
    pm2 logs <%= htmlComponentName %>

EXPOSE $APIPORT
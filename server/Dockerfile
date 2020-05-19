FROM node:12.16.3
MAINTAINER BILL "base_cloud@corp.netease.com"

RUN mkdir -p /home/project
COPY ./server /home/project
WORKDIR /home/project
CMD ["npm", "run", "start:docker"]

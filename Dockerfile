FROM node:erbium-alpine

WORKDIR /app
COPY ./api /app/api
COPY ./package.json /app/package.json
ENV NODE_ENV=production
RUN npm install --only=production
EXPOSE 3000

CMD ["npm", "start"]

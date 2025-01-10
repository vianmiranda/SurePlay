FROM golang:1.23-alpine AS build
RUN mkdir -p /home/server
WORKDIR /home/server
COPY . .
RUN go build -tags lambda.norpc -o arbitrage_server main.go

# I wanted to play around with reducing image size (537MB -> 27.1MB)
FROM alpine:3.21
EXPOSE 8081
WORKDIR /home/server
COPY --from=build /home/server/arbitrage_server .
CMD ["./arbitrage_server"]
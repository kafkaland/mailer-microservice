# Mailer microservice

A simple microservice that contains project specific business logic

## Input
Subscribes to the following topics:
1. `user.registration` - if a new user has been registered
1. `cart.creation` - if a new cart has been created

## Control
Creates an appropriate email based on incoming event

## Output
Publishes the email to the `email` topic for the upstream service e.g. kafka2smpt

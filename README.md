# Mailer microservice

A simple microservice that contains project specific business logic.

## Input

Subscribes to the following topics:

| topic name         | message example                                  |
|--------------------|--------------------------------------------------|
| `user.registration`  | `{email: 'one@localhost', name: 'Old MacDonald'}`|
| `cart.creation`      | `{email: 'two@localhost', amount: 10}`           |

## Control
Creates an appropriate email based on incoming event

## Output
Publishes the email to the `email` topic for the upstream service e.g. kafka2smpt

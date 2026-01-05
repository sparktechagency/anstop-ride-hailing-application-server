# Socket Event and their responsibilities

## Middleware:

- It handle the authentication part. Middleware will make sure that the clien send token during initial handshake

- It will add payload to socket

    ```
    type TPayload {
        userId: string,
        role: "Driver" | "User"
    }
    socket.payload:TPayload;
    ```

- And add each socket of specific user on in memory Map

## Events

#### connect-event

- mark user as online
- join room [userId as room id]

#### disconnect-event

- mark user as ofline
- remove his socket from in memory Map
- leave from room

## Ride Request

- user request for an ride -- Search for drivers
- if no driver found.

    ```
    emit [ride:no-available-drivers] event
    ```

- Notify available driver

    ```
    emit [ride:offer] event
    ```

- if the driver didn't response within 15s

    ```
    emit [ride:timeout] event
    ```

- if no driver respond for that ride reques

    ```
    emit [ride:no-available-drivers] event
    ```

- if driver accept the ride request

    ```
    emit [ride:accepted] event
    ```

- join both of them in a room

    ```
    roomId: [ride:${requestId}]
    ```

- notify user that a driver assigned for him

    ```
    emit [ride:driver-assigned] event
    ```

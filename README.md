# Hookrelay


A webhook relay that reliably delivers events from producers to consumer endpoints. Delivery is at-least-once, so duplicates can occur (e.g., when a success response is lost); every delivery carries a stable ID, so consumers can skip already-processed IDs. It provides queues, rate limits and circuit breakers per endpoint, and an attempts log records every try, timestamp, and response, so we can prove what was sent where and what the receiver answered.
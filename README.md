# Hookrelay


A webhook relay that reliably delivers events from producers to consumer endpoints. the connection is guaranteed to be delivered at least once using multiple retries, using the ID for events the consumer can achieve the idempotency so even if the consumer never reports a successful delivery no event is handled twice. it provides queues, rate limits and circuit breakers per endpoint, and an attempts log records every try, timestamp, and response, so we can prove what was sent where and what the receiver answered.
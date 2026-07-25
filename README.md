# Hookrelay


A webhook relay that provides reliable connecttino between a producer and a consumer. the connection is guaranteed to be delivered at least once using multipe retries, using the ID for events the consumer can achieve the idompentcy so even if the consumer never reports a successful delivery no event is handled twice. it provied queues, rate limits and ciriut breakers per endpoint, and an attempts log records every try, timestamp, and response, so we can prove what was sent where and what the receiver answered.
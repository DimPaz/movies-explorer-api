const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 900000, // 15 минут
  max: 100, // Ограничьте каждый IP-адрес 100 запросами на "окно" за 15 минут
  standardHeaders: true, // Возвращает информацию об ограничении скорости в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
});

module.exports = limiter;

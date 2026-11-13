/**
 * Simulates backend failures so loading/error/retry UI can be demonstrated.
 *
 *   /api/tasks?_simulate=error  → always responds 500
 *   /api/tasks?_simulate=flaky  → fails twice with 503, then succeeds (tests retry logic)
 */
const failureCounts = new Map();

module.exports = (req, res, next) => {
  const mode = req.query._simulate;

  if (mode === 'error') {
    return res.status(500).json({ message: 'Simulated server error' });
  }

  if (mode === 'flaky') {
    const key = `${req.method} ${req.path}`;
    const failures = failureCounts.get(key) ?? 0;

    if (failures < 2) {
      failureCounts.set(key, failures + 1);
      return res.status(503).json({ message: 'Simulated temporary failure' });
    }
    failureCounts.delete(key);
  }

  // json-server would treat unknown query params as filters, so remove ours
  delete req.query._simulate;
  next();
};

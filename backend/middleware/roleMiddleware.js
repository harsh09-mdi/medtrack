function requireRole(role) {
  return (req, res, next) => {
    if (req.role !== role) {
      return res.status(403).json({ message: `This action is only available to ${role}s.` });
    }
    next();
  };
}

module.exports = requireRole;

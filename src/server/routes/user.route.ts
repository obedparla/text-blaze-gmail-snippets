import express from "express";

const router = express.Router();

router.post("/user_data", async (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.send({
      name: req.user._json?.given_name,
      loggedIn: true,
    });

    return;
  }

  res.send({
    name: null,
    loggedIn: false,
  });
});

export { router as UserRoutes };

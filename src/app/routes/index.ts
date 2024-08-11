import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../user/user.route";
import { songRoutes } from "../modules/song/song.route";


const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/songs",
    route: songRoutes,
  },
 
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../user/user.route";
import { songRoutes } from "../modules/song/song.route";
import { albumRoutes } from "../modules/album/album.route";


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
  {
    path: "/albums",
    route: albumRoutes,
  },
 
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../user/user.route";
import { songRoutes } from "../modules/song/song.route";
import { albumRoutes } from "../modules/album/album.route";
import { categoryRoutes } from "../modules/category/category.route";
import { blogRoutes } from "../modules/blog/blog.route";
import { artistRoutes } from "../modules/artist/artist.route";
import { favoriteRoute } from "../modules/favList/favourite.route";

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
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/blogs",
    route: blogRoutes,
  },
  {
    path: "/artist",
    route: artistRoutes,
  },
  {
    path: "/favourite",
    route: favoriteRoute,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

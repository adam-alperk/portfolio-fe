import HomeClient from "@/src/components/HomeClient";
import { getProjects } from "@/src/lib/strapi";

export default async function Home() {
  const projects = await getProjects();

  return <HomeClient />;
}

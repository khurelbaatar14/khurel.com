import type { MDXComponents } from "mdx/types";
import { Benefit, CardGrid, Photo, PhotoGrid, Stat, YouTube } from "@/components/article/media";

const components: MDXComponents = {
  Benefit,
  CardGrid,
  Photo,
  PhotoGrid,
  Stat,
  YouTube,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

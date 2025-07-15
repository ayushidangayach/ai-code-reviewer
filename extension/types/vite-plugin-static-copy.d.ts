declare module "vite-plugin-static-copy" {
  import { Plugin } from "vite";

  interface StaticCopyOptions {
    targets: Array<{
      src: string | string[];
      dest: string;
    }>;
  }

  export function viteStaticCopy(options: StaticCopyOptions): Plugin;
}

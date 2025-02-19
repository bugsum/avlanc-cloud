import { Comfortaa, Inter, Ubuntu } from "next/font/google";
import localFont from "next/font/local";

/* -------------------------------------------------------------------------- */
/*                                Google Fonts                                */
/* -------------------------------------------------------------------------- */

export const comfortaa = Comfortaa({ weight: "400", subsets: ["latin"] });
export const inter = Inter({ weight: "400", subsets: ["latin"] });
export const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

/* -------------------------------------------------------------------------- */
/*                                 Local Fonts                                */
/* -------------------------------------------------------------------------- */

export const burbankbigcondensed = localFont({
  src: "../public/fonts/burbankbigcondensed_black.otf",
});

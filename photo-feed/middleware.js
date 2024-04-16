import { NextResponse } from "next/server";

const { match } = require("@formatjs/intl-localematcher");
const Negotiator = require("negotiator");

let defaultLocal = "en";
let locales = ["bn", "en"];

// get the preferred locals

function getLocals(request) {
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  let headers = { "accept-language": acceptedLanguage };
  let language = new Negotiator({ headers }).languages();

  return match(language, locales, defaultLocal);
}

export function middleware(request) {
  // check if there is any supported local in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
  if (pathnameIsMissingLocale) {
    const locale = getLocals(request);

    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, assets, api)
    "/((?!api|assets|.*\\..*|_next).*)",
    // Optional: only run on root (/) URL
    // '/
  ],
};

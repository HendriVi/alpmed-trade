import broker, { authorized } from "../brokerage/src/index.js";
import home from "../brokerage/private/home.html?raw";
import admin from "../brokerage/private/admin.html?raw";
import privacy from "../brokerage/private/privacy.html?raw";
import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

export default {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    const path = new URL(request.url).pathname;
    const secureHeaders = { 'content-type':'text/html; charset=utf-8', 'cache-control':'no-store', 'x-content-type-options':'nosniff', 'referrer-policy':'strict-origin-when-cross-origin', 'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com" };
    if(path.startsWith('/api/')) return broker.fetch(request, env);
    if(path === '/admin' || path === '/admin.html') {
      if(!request.headers.get('oai-authenticated-user-id')) return Response.redirect(new URL('/signin-with-chatgpt?return_to=%2Fadmin',request.url),302);
      if(!authorized(request,env)) return new Response('Owner access only.',{status:403,headers:secureHeaders});
      return new Response(admin,{headers:secureHeaders});
    }
    if(path === '/' || path === '/index.html') return new Response(home,{headers:secureHeaders});
    if(path === '/privacy' || path === '/privacy.html') return new Response(privacy,{headers:secureHeaders});
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
};

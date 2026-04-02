import fp from "fastify-plugin";
async function clerkPlugin(app, _opts) {
    app.decorateRequest("userId", "");
    app.decorateRequest("orgId", "");
}
export default fp(clerkPlugin, {
    name: "clerk",
});

import { Router } from "express";
import setupResponses from "../middlewares/setupResponses.mid.js";
import setupPolicies from "../middlewares/setupPolicies.mid.js";

class RouterHepler {
    constructor() {
        this.router = Router();
        this.use(setupResponses);
    };
    getRouter = () => this.router;
    applyMiddlewares = (middlewares) => middlewares.map((mid) => async (req, res, next) => {
        try {
            await mid(req, res, next);
        } catch (error) {
            next(error);
        }
    });
    applyMiddlewaresRender = (middlewaresRender) => middlewaresRender.map(midRender => async (req, res, next) => {
        try {
            await midRender(req, res, next);
        } catch (error) {
            next(error);
        }
    });
    applyPoliciesIfNeeded = (policies, middlewares) => {
        const hasRequiredPermission = middlewares.some(mid => mid.name === "requirePermission");
        if(policies && policies.length > 0 && !hasRequiredPermission) return setupPolicies(policies);
        return (req, res, next) => next();
    };
    create = (path, policies, ...middlewares) => this.router.post(path, this.applyPoliciesIfNeeded(policies, middlewares), this.applyMiddlewares(middlewares));
    read = (path, policies, ...middlewares) => this.router.get(path, this.applyPoliciesIfNeeded(policies, middlewares), this.applyMiddlewares(middlewares));
    update = (path, policies, ...middlewares) => this.router.put(path, this.applyPoliciesIfNeeded(policies, middlewares), this.applyMiddlewares(middlewares));
    destroy = (path, policies, ...middlewares) => this.router.delete(path, this.applyPoliciesIfNeeded(policies, middlewares), this.applyMiddlewares(middlewares));
    use = (path, ...middlewares) => this.router.use(path, this.applyMiddlewaresRender(middlewares));
    render = (path, policies, ...middlewares) => this.router.get(path, this.applyPoliciesIfNeeded(policies, middlewares), this.applyMiddlewaresRender(middlewares));
};

export default RouterHepler;
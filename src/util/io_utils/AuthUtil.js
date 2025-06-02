import { apiClient } from "./ApiClient";

export default class AuthUtil {

    static getPaths() {
        return apiClient.get("/auth/getNavPaths");
    }

    static deletePath(path, roleId) {
        return apiClient.post("/auth/deletePath", {
            roleId: roleId, 
            allowedPaths: [path]
        });
    }

    static getAllPathsByRoleId(roleId) {
        return apiClient.get("/auth/getPathsByRoleId", {
            params: { roleId: roleId }
        });
    }
}
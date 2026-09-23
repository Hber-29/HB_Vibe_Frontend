// src/utils/tokenUtils.js

export const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Lỗi giải mã JWT:", e);
        return null;
    }
};

export const getUserRoles = () => {
    // CHÚ Ý: Hãy đảm bảo bạn lưu token đúng bằng key 'access_token' lúc đăng nhập
    const token = localStorage.getItem('access_token');
    
    console.log("Bước 1: Token trong máy ->", token ? "Đã lấy được" : "NULL (Chưa đăng nhập hoặc sai tên key)");
    
    if (!token) return [];
    
    const decoded = parseJwt(token);
    if (!decoded) return [];

    let privileges = [];

    // Trích xuất Roles từ realm_access (Khớp với cấu trúc token của bạn)
    if (decoded.realm_access && Array.isArray(decoded.realm_access.roles)) {
        privileges = [...privileges, ...decoded.realm_access.roles];
    }

    console.log("Bước 2: Danh sách Quyền ->", privileges);
    return privileges;
};

export const hasAnyRole = (requiredRoles) => {
    const userPrivileges = getUserRoles();
    return requiredRoles.some(role => userPrivileges.includes(role));
};

export const isBrandUser = () => {
    // Các quyền tương ứng với nhóm Brand
    const brandPrivileges = [
        'brand_write', 
        'brand_member_write', 
        'brand_member_delete', 
        'product_write', 
        'product_delete'
    ];
    
    const result = hasAnyRole(brandPrivileges);
    console.log("Bước 3: Cho phép vào Brand Portal? ->", result);
    return result;
};

export const getBrandIdFromToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    const decoded = parseJwt(token);
    if (!decoded) return null;

    // IN RA CONSOLE ĐỂ TÌM TÊN BIẾN UUID
    console.log("CHI TIẾT TOKEN TỪ KEYCLOAK:", decoded);

    // Lấy trường brandId (hoặc cấu hình lại tên biến cho đúng với console.log)
    return decoded.brandId || decoded.brand_id || null;
};
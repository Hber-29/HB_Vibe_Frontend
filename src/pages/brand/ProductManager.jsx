import React, { useState, useEffect } from 'react';
import { hasAnyRole } from '../../utils/tokenUtils';

const ProductManager = () => {
    // 1. KIỂM TRA QUYỀN (RBAC)
    const canWrite = hasAnyRole(['product_write']);
    const canDelete = hasAnyRole(['product_delete']);

    // 2. STATE KHỞI TẠO (Lấy Brand ID từ Backend)
    const [brandId, setBrandId] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [initError, setInitError] = useState(null);

    // 3. STATE DANH SÁCH & PHÂN TRANG
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // 4. STATE FORM THÊM SẢN PHẨM
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        quantity: '',
        categoryId: ''
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // --- BƯỚC KHỞI TẠO: LẤY THÔNG TIN BRAND ---
    const fetchMyBrand = async () => {
        try {
            // LƯU Ý: Điều chỉnh lại URL này nếu Base Path Controller của bạn khác
            const response = await fetch('http://localhost:8000/brand/api/v1/my-brand', {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                // Giả định ApiResponse trả về: data.result.id (Mã UUID của Brand)
                if (data.result && data.result.id) {
                    setBrandId(data.result.id);
                } else {
                    setInitError("Tài khoản của bạn chưa được liên kết với Thương hiệu nào.");
                }
            } else {
                setInitError(`Lỗi xác thực tài khoản thương hiệu (Mã lỗi: ${response.status})`);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin Brand:", error);
            setInitError("Không thể kết nối đến máy chủ Brand Service.");
        } finally {
            setIsInitializing(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8000/product/api/v1/tree');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.result || data); 
            }
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    };

    const fetchProducts = async () => {
        if (!brandId) return; 
        
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/product/api/v1/brands/${brandId}?page=${page}&size=${pageSize}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // --- ĐÃ SỬA LẠI THÀNH items THEO ĐÚNG API CỦA BẠN ---
                setProducts(data.result?.items || []);
                setTotalPages(data.result?.totalPages || 1);
                // ----------------------------------------------------

            } else {
                console.error(`Lỗi tải sản phẩm: Backend trả về status ${response.status}`);
            }
        } catch (error) {
            console.error("Lỗi kết nối khi tải danh sách sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    // 5. GỌI API THEO THỨ TỰ
    // Lần 1: Chạy ngay khi vào trang để lấy Brand ID và Danh mục
    useEffect(() => {
        fetchMyBrand();
        fetchCategories();
    }, []);

    // Lần 2: Chỉ chạy khi đã lấy được brandId thành công, hoặc khi chuyển trang
    useEffect(() => {
        if (brandId) {
            fetchProducts();
        }
    }, [brandId, page]);

    // --- XỬ LÝ FORM THÊM SẢN PHẨM ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        if (!brandId) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8000/product/api/v1/brands/${brandId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: newProduct.name,
                    price: parseFloat(newProduct.price),
                    quantity: parseInt(newProduct.quantity),
                    categoryId: newProduct.categoryId
                })
            });

            if (response.ok) {
                setIsAddModalOpen(false);
                setNewProduct({ name: '', price: '', quantity: '', categoryId: '' });
                fetchProducts(); 
                alert("Thêm sản phẩm thành công!");
            } else {
                if (response.status === 401 || response.status === 403) {
                    alert(`Thất bại: Lỗi phân quyền (${response.status}). Backend đang từ chối Token này.`);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    alert(`Thêm thất bại: ${errorData.message || 'Dữ liệu không hợp lệ'}`);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            alert("Không thể kết nối đến máy chủ Backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- XỬ LÝ XÓA SẢN PHẨM ---
    const handleDelete = async (productId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
        try {
            const response = await fetch(`http://localhost:8000/product/api/v1/${productId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (response.ok) {
                fetchProducts();
            } else {
                alert(`Xóa thất bại (Lỗi ${response.status})`);
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
        }
    };

    // --- RENDER GIAO DIỆN KHỞI TẠO HOẶC LỖI ---
    if (isInitializing) {
        return (
            <div className="bg-white border border-[#E5E5E5] p-10 min-h-full flex flex-col items-center justify-center">
                <span className="text-[12px] uppercase tracking-widest text-[#666666]">Đang tải dữ liệu doanh nghiệp...</span>
            </div>
        );
    }

    if (initError) {
        return (
            <div className="bg-white border border-red-500 p-10 min-h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-red-600 font-serif text-2xl mb-4">Lỗi Truy Cập</h2>
                <p className="text-[13px] text-[#111111] max-w-md">{initError}</p>
            </div>
        );
    }

    // --- RENDER GIAO DIỆN CHÍNH (Đã có brandId) ---
    return (
        <div className="bg-white border border-[#E5E5E5] p-10 min-h-full flex flex-col relative">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5]">
                <h1 className="font-serif text-[28px] text-[#111111]">Sản phẩm</h1>
                
                {canWrite && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#111111] text-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-[#333333] transition-colors rounded-none"
                    >
                        + Thêm sản phẩm
                    </button>
                )}
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="w-full overflow-x-auto flex-1">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="text-[12px] uppercase tracking-widest text-[#666666]">Đang tải danh sách...</span>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#E5E5E5]">
                                <th className="py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#666666]">Mã SP</th>
                                <th className="py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#666666]">Tên sản phẩm</th>
                                <th className="py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#666666]">Giá</th>
                                <th className="py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#666666]">Tồn kho</th>
                                {(canWrite || canDelete) && (
                                    <th className="py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#666666] text-right">Hành động</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-[13px] text-[#666666]">Chưa có sản phẩm nào.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b border-[#E5E5E5] hover:bg-[#F9F9F8] transition-colors">
                                        <td className="py-4 text-[13px] text-[#111111] font-semibold">{product.id}</td>
                                        <td className="py-4 text-[13px] text-[#111111]">{product.name}</td>
                                        <td className="py-4 text-[13px] text-[#111111]">{product.price?.toLocaleString()}đ</td>
                                        <td className="py-4 text-[13px]">
                                            <span className={product.quantity > 0 ? "text-[#111111]" : "text-red-500 font-semibold"}>
                                                {product.quantity > 0 ? product.quantity : 'Hết hàng'}
                                            </span>
                                        </td>
                                        
                                        {(canWrite || canDelete) && (
                                            <td className="py-4 text-right space-x-4">
                                                {canWrite && (
                                                    <button className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:text-[#666666]">
                                                        Sửa
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button 
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-[11px] font-semibold uppercase tracking-[0.15em] text-red-600 hover:text-red-400"
                                                    >
                                                        Xóa
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PHÂN TRANG */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-end items-center space-x-2 mt-8 pt-4">
                    <button 
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                        className={`px-3 py-1 border text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${page === 0 ? 'text-[#CCCCCC] border-[#E5E5E5] cursor-not-allowed' : 'text-[#111111] border-[#E5E5E5] hover:border-[#111111]'}`}
                    >
                        Trang trước
                    </button>
                    <span className="text-[12px] font-semibold px-4">{page + 1} / {totalPages}</span>
                    <button 
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(page + 1)}
                        className={`px-3 py-1 border text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${page >= totalPages - 1 ? 'text-[#CCCCCC] border-[#E5E5E5] cursor-not-allowed' : 'text-[#111111] border-[#E5E5E5] hover:border-[#111111]'}`}
                    >
                        Trang sau
                    </button>
                </div>
            )}

            {/* MODAL THÊM SẢN PHẨM */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white border border-[#E5E5E5] p-10 w-[500px] shadow-2xl">
                        <h2 className="font-serif text-[24px] text-[#111111] mb-8">Thêm sản phẩm mới</h2>
                        
                        <form onSubmit={handleCreateProduct} className="flex flex-col space-y-6">
                            <div className="flex flex-col space-y-2">
                                <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]">Tên sản phẩm *</label>
                                <input 
                                    type="text" name="name" required
                                    value={newProduct.name} onChange={handleInputChange}
                                    className="border border-[#E5E5E5] px-4 py-3 text-[13px] text-[#111111] outline-none focus:border-[#111111] transition-colors rounded-none"
                                    placeholder="Nhập tên sản phẩm"
                                />
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex flex-col space-y-2 w-1/2">
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]">Giá (VNĐ) *</label>
                                    <input 
                                        type="number" name="price" required min="0"
                                        value={newProduct.price} onChange={handleInputChange}
                                        className="border border-[#E5E5E5] px-4 py-3 text-[13px] text-[#111111] outline-none focus:border-[#111111] transition-colors rounded-none"
                                        placeholder="Ví dụ: 250000"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2 w-1/2">
                                    <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]">Số lượng *</label>
                                    <input 
                                        type="number" name="quantity" required min="1"
                                        value={newProduct.quantity} onChange={handleInputChange}
                                        className="border border-[#E5E5E5] px-4 py-3 text-[13px] text-[#111111] outline-none focus:border-[#111111] transition-colors rounded-none"
                                        placeholder="Ví dụ: 100"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111]">Danh mục *</label>
                                <select 
                                    name="categoryId" required
                                    value={newProduct.categoryId} onChange={handleInputChange}
                                    className="border border-[#E5E5E5] px-4 py-3 text-[13px] text-[#111111] outline-none focus:border-[#111111] transition-colors rounded-none bg-white"
                                >
                                    <option value="" disabled>-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-[#E5E5E5] mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] border border-[#E5E5E5] hover:border-[#111111] transition-colors"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] bg-[#111111] text-white hover:bg-[#333333] transition-colors disabled:bg-[#CCCCCC]"
                                >
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
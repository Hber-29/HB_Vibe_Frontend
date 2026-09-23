import React, { useState, useEffect } from 'react';
import { isBrandUser } from '../utils/tokenUtils';
import { useParams, useNavigate } from 'react-router-dom';

// --- COMPONENT: PRODUCT CARD (Dùng cho phần You May Also Like) ---
const ProductCard = ({ product }) => (
  <div className="cursor-pointer group">
    <div className="relative overflow-hidden w-full aspect-[3/4] bg-[#F9F9F8] mb-4 border border-transparent group-hover:border-[#E5E5E5] transition-colors">
      <img 
        src={product.imageUrl || "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop"} 
        alt={product.name} 
        className="object-cover w-full h-full duration-500 ease-out transition-transform group-hover:scale-[1.03]" 
      />
    </div>
    <div className="flex items-start justify-between">
      <h3 className="text-[15px] font-medium leading-[1.6] text-[#111111] max-w-[70%] line-clamp-2">{product.name}</h3>
      <span className="text-[15px] text-[#666666]">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
      </span>
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // States cho Header
  const [categories, setCategories] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // States cho Product Detail
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // Lấy dữ liệu API
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const resCat = await fetch(`http://localhost:8000/product/api/v1/tree`);
        const dataCat = await resCat.json();
        if (dataCat.code === 1000 && dataCat.result) setCategories(dataCat.result);
      } catch (error) { console.error("Lỗi fetch danh mục:", error); }
    };

    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/product/api/v1/${slug}`);
        const data = await response.json();
        if (data.code === 1000 && data.result) {
          setProduct(data.result);
          // Gán ảnh chính mặc định
          if (data.result.images && data.result.images.length > 0) {
            setSelectedImage(data.result.images[0]);
          } else {
            setSelectedImage(data.result.imageUrl); 
          }
        }
      } catch (error) {
        console.error("Lỗi fetch chi tiết SP:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
    if (slug) fetchProductDetail();
  }, [slug]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  // Mock data dự phòng nếu API chưa có phần "You May Also Like"
  const mockRelated = [
    { id: 'r1', name: 'Tailored Wool Blazer', price: 1890000, imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop' },
    { id: 'r2', name: 'Structured Leather Tote', price: 1200000, imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop' },
    { id: 'r3', name: 'Silk Wide-Leg Trousers', price: 950000, imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop' },
    { id: 'r4', name: 'Minimalist Leather Sandals', price: 850000, imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center font-sans text-[12px] uppercase tracking-widest">Đang tải...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-sans">Sản phẩm không tồn tại.</div>;

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans">
      
      {/* HEADER (Tương tự Home.jsx) */}
      {isDrawerOpen && <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>}
      <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] transform transition-transform duration-300 ease-in-out border-r border-[#E5E5E5] ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#E5E5E5] flex justify-between items-center">
          <span className="font-serif text-xl font-bold tracking-widest uppercase">MENU</span>
          <button onClick={() => setIsDrawerOpen(false)} className="hover:text-[#666666]"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>
        <div className="flex flex-col p-6 space-y-6 text-[12px] uppercase tracking-[0.15em] font-semibold">
          <a href="/brands" className="hover:text-[#666666]">Brands</a>
          <a href="/journal" className="hover:text-[#666666]">Journal</a>
          <a href="/support" className="hover:text-[#666666]">Support</a>
        </div>
      </div>

      <header className="sticky top-0 z-50 flex flex-col w-full bg-white border-b border-[#E5E5E5]">
        <div className="flex items-center justify-between h-[80px] px-6 lg:px-[80px]">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsDrawerOpen(true)} className="hover:text-[#666666]"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
            <div onClick={() => navigate('/')} className="font-serif text-2xl font-bold tracking-widest uppercase cursor-pointer">HB VIBE</div>
          </div>
          
          <nav className="hidden lg:flex items-center h-full space-x-10">
            {categories.slice(0, 5).map((category) => (
              <div key={category.id} className="relative h-full group flex items-center">
                <a href={`/category/${category.id}`} className="text-[11px] font-semibold uppercase tracking-[0.15em] hover:text-[#666666] flex items-center gap-1">
                  {category.name}
                  {category.children?.length > 0 && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>}
                </a>
                {category.children?.length > 0 && (
                  <div className="absolute top-[80px] left-0 hidden group-hover:flex flex-col bg-white border border-t-0 border-[#E5E5E5] w-[220px] shadow-sm z-50">
                    {category.children.map((child) => (
                      <a key={child.id} href={`/category/${child.id}`} className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-[#F9F9F8] border-b border-[#E5E5E5] last:border-b-0">{child.name}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center space-x-6">
            <div className="relative flex items-center">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="hover:text-[#666666] focus:outline-none"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></button>
              {isUserMenuOpen && (
                <div className="absolute top-[35px] right-0 flex flex-col bg-white border border-[#E5E5E5] w-[200px] shadow-sm z-50">
                  <a href="/profile" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:bg-[#F9F9F8] hover:text-[#666666] transition-colors border-b border-[#E5E5E5]">
                    Hồ sơ cá nhân
                  </a>
                  
                  {/* --- HIỂN THỊ ĐỘNG THEO QUYỀN --- */}
                  {isBrandUser() && (
                    <a href="/brand-dashboard" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:bg-[#F9F9F8] hover:text-[#666666] transition-colors border-b border-[#E5E5E5]">
                      Quản lý Thương hiệu
                    </a>
                  )}
                  {/* ------------------------------- */}

                  <button onClick={handleLogout} className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:bg-[#F9F9F8] hover:text-[#666666] transition-colors">
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
            <button className="hover:text-[#666666]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></button>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="px-6 py-6 lg:px-[80px] text-[11px] text-[#666666] uppercase tracking-[0.15em] bg-white">
        <span className="cursor-pointer hover:text-[#111111]" onClick={() => navigate('/')}>Home</span>
        <span className="mx-2">/</span>
        <span className="cursor-pointer hover:text-[#111111]">Shop</span>
        <span className="mx-2">/</span>
        <span className="text-[#111111]">{product.name}</span>
      </div>

      {/* PRODUCT DETAIL SECTION */}
      <section className="px-6 pb-20 lg:px-[80px] flex flex-col lg:flex-row gap-16">
        
        {/* Cột Trái: Gallery Ảnh */}
        <div className="w-full lg:w-3/5 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] bg-[#F9F9F8]">
            <img src={selectedImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {/* Thumbnails (Giả định API trả về mảng images) */}
          <div className="grid grid-cols-4 gap-4">
            {(product.images || [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl]).slice(0,4).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`cursor-pointer aspect-[3/4] bg-[#F9F9F8] border ${selectedImage === img ? 'border-[#111111]' : 'border-transparent'}`}
              >
                <img src={img || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"} alt="thumb" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Cột Phải: Thông tin chi tiết */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#666666] mb-2">{product.categoryName || 'DRESSES'}</span>
          <h1 className="font-serif text-[40px] leading-[1.1] mb-4">{product.name}</h1>
          <p className="text-[18px] mb-8">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}</p>
          
          <p className="text-[#666666] text-[14px] leading-relaxed mb-10">
            {product.description || "A fluid silhouette crafted from heavyweight mulberry silk. Features a bias cut drape and architectural neckline."}
          </p>

          {/* Color Selection */}
          <div className="mb-8">
            <span className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-4 block">Color: <span className="text-[#666666] font-normal">{selectedColor || 'Select'}</span></span>
            <div className="flex gap-3">
              {/* Giả định màu sắc tĩnh, nếu API có variants thì map ra đây */}
              {['bg-[#111111]', 'bg-[#FFFFFF]', 'bg-[#E5E5E5]', 'bg-[#A8644A]'].map((colorClass, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedColor(`Color ${idx+1}`)}
                  className={`w-8 h-8 rounded-full border ${selectedColor === `Color ${idx+1}` ? 'border-[#111111] p-1' : 'border-[#E5E5E5]'} transition-all`}
                >
                  <div className={`w-full h-full rounded-full ${colorClass} border border-[#E5E5E5]`}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] uppercase tracking-[0.15em] font-semibold">Size: <span className="text-[#666666] font-normal">{selectedSize || 'Select'}</span></span>
              <a href="#" className="text-[10px] uppercase tracking-[0.1em] underline text-[#666666]">Size Guide</a>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-[11px] uppercase tracking-widest border transition-colors ${selectedSize === size ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5] text-[#111111] hover:border-[#111111]'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mb-12">
            <button className="w-full bg-[#111111] text-white py-4 text-[12px] uppercase tracking-[0.15em] font-semibold hover:bg-[#333333] transition-colors">
              Add to Bag
            </button>
            <button className="w-full bg-white text-[#111111] border border-[#E5E5E5] py-4 text-[12px] uppercase tracking-[0.15em] font-semibold hover:border-[#111111] transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              Save to Wishlist
            </button>
          </div>

          {/* Accordion Details */}
          <div className="border-t border-[#E5E5E5]">
            {['Product Details', 'Care Instructions', 'Shipping & Returns'].map((item, idx) => (
              <details key={idx} className="group border-b border-[#E5E5E5]">
                <summary className="flex justify-between items-center py-5 cursor-pointer list-none text-[11px] uppercase tracking-[0.15em] font-semibold">
                  {item}
                  <span className="transition group-open:rotate-180">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                  </span>
                </summary>
                <div className="text-[#666666] text-[13px] leading-relaxed pb-5">
                  Here you can place dynamic description or static policies. Perfectly aligned with the editorial aesthetic.
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="px-6 pt-10 pb-[120px] lg:px-[80px] border-t border-[#E5E5E5]">
        <h2 className="font-serif text-[28px] text-center mb-12">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {mockRelated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FOOTER BẢN THU GỌN */}
      <footer className="px-6 py-10 border-t lg:px-[80px] border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-[0.15em] text-[#666666]">
        <span className="text-[#111111] font-serif font-bold text-lg mb-4 md:mb-0">HB VIBE</span>
        <span>© 2026 HB VIBE. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default ProductDetail;
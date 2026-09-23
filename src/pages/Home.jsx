import React, { useState, useEffect } from 'react';
import { isBrandUser } from '../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

const mockTopSelling = [
  { id: 'ts1', slug: 'ts1', name: 'Minimalist Leather Jacket', price: 1250000, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop' },
  { id: 'ts2', slug: 'ts2', name: 'Urban Cargo Pants', price: 850000, imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop' },
  { id: 'ts3', slug: 'ts3', name: 'Classic Chelsea Boots', price: 1500000, imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop' },
  { id: 'ts4', slug: 'ts4', name: 'Oversized Cotton Hoodie', price: 650000, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop' },
];

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/product/${product.slug || product.id}`)} 
      className="cursor-pointer group"
    >
      <div className="relative overflow-hidden w-full aspect-[3/4] bg-[#F9F9F8] mb-4 border border-transparent group-hover:border-[#E5E5E5] transition-colors">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop"} 
          alt={product.name} 
          className="object-cover w-full h-full duration-500 ease-out transition-transform group-hover:scale-[1.03]" 
        />
      </div>
      <div className="flex items-start justify-between">
        <h3 className="text-[15px] font-medium leading-[1.6] text-[#111111] max-w-[70%] line-clamp-2">
          {product.name}
        </h3>
        <span className="text-[15px] text-[#666666]">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
        </span>
      </div>
    </div>
  );
};

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch Sản phẩm mới
    const fetchNewProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch(`http://localhost:8000/product/api/v1?page=0&size=4`);
        const data = await response.json();
        if (data.code === 1000 && data.result) {
          setNewProducts(data.result.items || []);
        }
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    // 2. Fetch Danh mục
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:8000/product/api/v1/tree`);
        const data = await response.json();
        if (data.code === 1000 && data.result) {
          setCategories(data.result);
        }
      } catch (error) {
        console.error("Lỗi khi fetch danh mục:", error);
      }
    };

    // 3. Fetch Banner Động
    const fetchBanners = async () => {
      try {
        const response = await fetch(`http://localhost:8000/banner/api/v1?position=HOME_SLIDER&limit=3`);
        const data = await response.json();
        if (data.code === 1000 && data.result) {
          const bannerData = Array.isArray(data.result) ? data.result : (data.result.items || []);
          setBanners(bannerData);
        }
      } catch (error) {
        console.error("Lỗi khi fetch banner:", error);
      }
    };

    fetchNewProducts();
    fetchCategories();
    fetchBanners();
  }, []);

  // Logic tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans">
      {/* DRAWER MENU */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] transform transition-transform duration-300 ease-in-out border-r border-[#E5E5E5] ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[#E5E5E5] flex justify-between items-center">
          <span className="font-serif text-xl font-bold tracking-widest uppercase">MENU</span>
          <button onClick={() => setIsDrawerOpen(false)} className="text-[#111111] hover:text-[#666666]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-6 text-[12px] uppercase tracking-[0.15em] font-semibold">
          <a href="/brands" className="hover:text-[#666666] transition-colors">Brands</a>
          <a href="/journal" className="hover:text-[#666666] transition-colors">Journal</a>
          <a href="/support" className="hover:text-[#666666] transition-colors">Support</a>
          <a href="/contact" className="hover:text-[#666666] transition-colors">Contact</a>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 flex flex-col w-full bg-white border-b border-[#E5E5E5]">
        <div className="flex items-center justify-between h-[80px] px-6 lg:px-[80px]">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsDrawerOpen(true)} className="hover:text-[#666666] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div className="font-serif text-2xl font-bold tracking-widest uppercase cursor-pointer">HB VIBE</div>
          </div>
          
          <nav className="hidden lg:flex items-center h-full space-x-10">
            {categories.slice(0, 5).map((category) => (
              <div key={category.id} className="relative h-full group flex items-center">
                <a href={`/category/${category.id}`} className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] group-hover:text-[#666666] transition-colors flex items-center gap-1">
                  {category.name}
                  {category.children && category.children.length > 0 && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  )}
                </a>
                {category.children && category.children.length > 0 && (
                  <div className="absolute top-[80px] left-0 hidden group-hover:flex flex-col bg-white border border-t-0 border-[#E5E5E5] w-[220px] shadow-sm z-50">
                    {category.children.map((child) => (
                      <a key={child.id} href={`/category/${child.id}`} className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:bg-[#F9F9F8] hover:text-[#666666] transition-colors border-b border-[#E5E5E5] last:border-b-0">
                        {child.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <div className="flex items-center space-x-6">
             <button aria-label="Search" className="hover:text-[#666666] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            
            <div className="relative flex items-center">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} aria-label="User" className="hover:text-[#666666] transition-colors focus:outline-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-[35px] right-0 flex flex-col bg-white border border-[#E5E5E5] w-[200px] shadow-sm z-50">
                  <button 
                    onClick={() => navigate('/profile')}
                    className="text-left w-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:bg-[#F9F9F8] hover:text-[#666666] transition-colors border-b border-[#E5E5E5]"
                  >
                    Hồ sơ cá nhân
                  </button>
                  
                  {isBrandUser() && (
                    <button 
                      onClick={() => navigate('/brand-dashboard')}
                      className="text-left w-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:bg-[#F9F9F8] hover:text-[#666666] transition-colors border-b border-[#E5E5E5]"
                    >
                      Quản lý Thương hiệu
                    </button>
                  )}

                  <button 
                    onClick={handleLogout} 
                    className="text-left w-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:bg-[#F9F9F8] hover:text-[#666666] transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            <button aria-label="Cart" className="hover:text-[#666666] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </button>
            <button className="hidden md:block bg-[#111111] text-white uppercase text-[11px] font-semibold tracking-[0.15em] px-8 py-3 rounded-none hover:bg-[#333333] transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC HERO BANNER SECTION */}
      <section className="relative w-full h-[75vh] min-h-[600px] flex items-center justify-center bg-[#F9F9F8] overflow-hidden">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <img 
              key={banner.id || index}
              src={banner.imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"} 
              alt={banner.title || "Fashion Model"} 
              className={`absolute inset-0 object-cover object-top w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
            />
          ))
        ) : (
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" alt="Fashion Model" className="absolute inset-0 object-cover object-top w-full h-full" />
        )}
        
        <div className="relative z-10 flex flex-col items-center text-center px-10 py-16 max-w-2xl bg-white/70 backdrop-blur-md border border-[#E5E5E5]/50 shadow-sm">
          <h1 className="font-serif text-[60px] md:text-[80px] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-4">
            DEFINE YOUR<br/>VIBE.
          </h1>
          <p className="text-[16px] text-[#111111] mb-8 font-medium">Contemporary essentials for your everyday statement.</p>
          <button className="bg-[#111111] text-white uppercase text-[12px] font-semibold tracking-[0.15em] px-10 py-4 rounded-none hover:bg-[#333333] transition-colors">
            Shop Collection
          </button>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-10 z-10 flex space-x-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-[2px] transition-all duration-300 ${index === currentSlide ? 'w-10 bg-[#111111]' : 'w-4 bg-[#111111]/30 hover:bg-[#111111]/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        )}
      </section>

      {/* NEW PRODUCT */}
      <section className="px-6 pt-[120px] pb-[60px] lg:px-[80px]">
        <div className="flex items-end justify-between pb-6 mb-12 border-b border-[#E5E5E5]">
          <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2] text-[#111111]">New Product</h2>
          <a href="/shop" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:text-[#666666] transition-colors pb-2">View All</a>
        </div>
        {loadingProducts ? (
          <div className="flex justify-center w-full py-10">
            <span className="text-[12px] uppercase tracking-widest text-[#666666]">Đang tải...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* TOP SELLING */}
      <section className="px-6 pt-[60px] pb-[120px] lg:px-[80px]">
        <div className="flex items-end justify-between pb-6 mb-12 border-b border-[#E5E5E5]">
          <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.2] text-[#111111]">Top Selling</h2>
          <a href="/shop?sort=top_selling" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#111111] hover:text-[#666666] transition-colors pb-2">View All</a>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {mockTopSelling.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col items-start justify-between px-6 py-20 border-t md:flex-row lg:px-[80px] border-[#E5E5E5] bg-white">
        <div className="mb-10 md:mb-0">
          <div className="font-serif text-2xl font-bold tracking-widest mb-4 text-[#111111]">HB VIBE</div>
          <p className="text-[12px] text-[#666666]">© 2026 HB VIBE. All rights reserved.</p>
        </div>
        <div className="flex space-x-24">
          <div className="flex flex-col space-y-4 text-[12px] uppercase tracking-[0.15em] font-semibold text-[#111111]">
            <span className="mb-2 text-[#666666]">Explore</span>
            <a href="/shop" className="hover:text-[#666666] transition-colors">Shop</a>
            <a href="/brands" className="hover:text-[#666666] transition-colors">Brands</a>
          </div>
          <div className="flex flex-col space-y-4 text-[12px] uppercase tracking-[0.15em] font-semibold text-[#111111]">
            <span className="mb-2 text-[#666666]">Help</span>
            <a href="/support" className="hover:text-[#666666] transition-colors">Support</a>
            <a href="/contact" className="hover:text-[#666666] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { SiSpotify } from "react-icons/si";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MobileSidebar from "./MobileSidebar";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* ✅ Mobile Header */}
      <div className="md:hidden flex flex-col bg-black text-white p-4 border-b border-neutral-800 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-3 relative">
          <div className="flex items-center gap-3">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <SiSpotify className="text-green-500 text-2xl" />
              <span className="text-lg font-semibold tracking-wide">Spotify</span>
            </div>
          </div>

          {user ? (
            <div className="relative">
              <img
                src={user.photoURL || "/images/profile.jpg"}
                alt="User"
                className="w-8 h-8 rounded-full border cursor-pointer"
                onClick={() => setDropdownOpen((prev) => !prev)}
              />

              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-40 bg-neutral-800 rounded-md shadow-lg z-[999]">
                  <ul className="text-sm text-white divide-y divide-neutral-700">
                    <li
                      className="px-4 py-3 hover:bg-neutral-700 cursor-pointer"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/profile");
                      }}
                    >
                      Profile
                    </li>
                    <li
                      className="px-4 py-3 hover:bg-neutral-700 cursor-pointer"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/settings");
                      }}
                    >
                      Settings
                    </li>
                    <li
                      className="px-4 py-3 hover:bg-neutral-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-sm border px-3 py-1 rounded-full"
            >
              Log in
            </button>
          )}
        </div>

        {/* ✅ Mobile Search */}
        <div className="flex items-center bg-white rounded-full px-4 py-2">
          <FaSearch className="text-gray-700 text-sm mr-3" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums "

            className="bg-transparent outline-none text-sm text-black placeholder-gray-500 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* ✅ Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="absolute top-0 left-0 w-72 h-full bg-neutral-900 shadow-xl animate-slide-in">
            <MobileSidebar closeDrawer={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* ✅ Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 bg-neutral-900 sticky top-0 z-30 shadow-md">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="bg-black p-2 rounded-full hover:bg-neutral-800"
          >
            <FaChevronLeft className="text-white text-base" />
          </button>
          <button
            onClick={() => router.forward()}
            className="bg-black p-2 rounded-full hover:bg-neutral-800"
          >
            <FaChevronRight className="text-white text-base" />
          </button>
        </div>

        {/* Desktop Search */}
        <div className="flex items-center bg-white bg-opacity-10 rounded-full px-4 py-2 flex-1 mx-4 max-w-2xl">
          <FaSearch className="text-gray-300 text-sm mr-3" />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums"
            className="bg-transparent outline-none text-sm text-black placeholder-gray-400 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Auth / Profile Area */}
        <div className="flex items-center gap-4 relative">
          {!user ? (
            <>
              <button
                onClick={() => router.push("/login")}
                className="text-white text-sm font-medium border border-white border-opacity-40 px-4 py-1 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="text-white text-sm font-medium border border-white border-opacity-40 px-4 py-1 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Sign up
              </button>
            </>
          ) : (
            <div className="relative">
              <div
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full overflow-hidden border border-white border-opacity-30 cursor-pointer"
              >
                <img
                  src={user.photoURL || "/images/profile.jpg"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-40 bg-neutral-800 rounded-md shadow-lg z-[999]">
                  <ul className="text-sm text-white divide-y divide-neutral-700">
                    <li
                      className="px-4 py-3 hover:bg-neutral-700 cursor-pointer"
                      onClick={() => {
                        setDropdownOpen(false);
                        if (router.pathname !== "/profile") {
  router.push("/profile");
}

                      }}
                    >
                      Profile
                    </li>
                    <li
                      className="px-4 py-3 hover:bg-neutral-700 cursor-pointer"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/settings");
                      }}
                    >
                      Settings
                    </li>
                    <li
                      className="px-4 py-3 hover:bg-neutral-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}

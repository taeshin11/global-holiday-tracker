// ads.js - Ad injection for Adsterra and AdSense
const Ads = {
  init() {
    this.injectAdSlots();
  },

  injectAdSlots() {
    // Top banner
    const topBanner = document.getElementById('ad-top-banner');
    if (topBanner) {
      topBanner.innerHTML = `
        <div class="ad-placeholder bg-stone-100 border border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-sm h-[90px] md:h-[90px]" data-adsterra-key="top-banner">
          <span>Advertisement</span>
        </div>`;
    }

    // Mid content ad
    const midAd = document.getElementById('ad-mid-content');
    if (midAd) {
      midAd.innerHTML = `
        <div class="ad-placeholder bg-stone-100 border border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-sm h-[90px]" data-adsterra-key="mid-content">
          <span>Advertisement</span>
        </div>`;
    }

    // Sidebar ad
    const sidebarAd = document.getElementById('ad-sidebar');
    if (sidebarAd) {
      sidebarAd.innerHTML = `
        <div class="ad-placeholder bg-stone-100 border border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-sm h-[250px] w-[300px]" data-adsterra-key="sidebar">
          <span>Advertisement</span>
        </div>`;
    }

    // Footer banner
    const footerAd = document.getElementById('ad-footer-banner');
    if (footerAd) {
      footerAd.innerHTML = `
        <div class="ad-placeholder bg-stone-100 border border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-sm h-[90px]" data-adsterra-key="footer-banner">
          <span>Advertisement</span>
        </div>`;
    }

    // AdSense manual slot
    const adsenseSlot = document.getElementById('ad-adsense-slot');
    if (adsenseSlot) {
      adsenseSlot.innerHTML = `
        <div class="ad-placeholder bg-stone-100 border border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-sm h-[250px]" data-adsense="true">
          <span>Google AdSense</span>
        </div>`;
    }
  }
};

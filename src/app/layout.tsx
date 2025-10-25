import "./globals.css";
import "./fonts.css";
import React, { Suspense } from "react";
import { Metadata } from "next/types";
import { Manrope, Poppins, Plus_Jakarta_Sans, Inter, Merriweather } from "next/font/google";
import { Partytown } from '@builder.io/partytown/react';

// Dinamik bileşenleri sadece ihtiyaç duyulduğunda yükleyelim
const ScrollIndicator = React.lazy(() => import("../components/AgricultureLanding/ScrollIndicator"));

// CDN URL'sini ve hero1.webp için doğru yolu tanımlayalım
const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const hero1ImagePath = "/hero1.webp"; // Düzeltildi: görsel ana dizinde

// Preload için kullanılacak nihai URL
const hero1PreloadHref = NEXT_PUBLIC_CDN_URL 
  ? `${NEXT_PUBLIC_CDN_URL}${hero1ImagePath}` 
  : hero1ImagePath;

// Görselin CDN üzerinden mi sunulduğunu belirleyelim
const hero1IsCdn = !!NEXT_PUBLIC_CDN_URL;

// Kritik fontları daha hızlı yükleyelim, diğerlerini geciktirelim
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"], // Sadece gerekli ağırlıkları kullan
  variable: "--font-manrope",
  display: "optional", // font yüklenemezse sistem fontlarını kullan
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'sans-serif'],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], // Sadece gerekli ağırlıkları kullan
  variable: "--font-poppins",
  display: "optional", // font yüklenemezse sistem fontlarını kullan
  preload: true,
  fallback: ['Arial', 'sans-serif'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700"], // Sadece gerekli ağırlıkları kullan
  variable: "--font-jakarta",
  display: "optional", // font yüklenemezse sistem fontlarını kullan
  preload: false,
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"], // Sadece gerekli ağırlıkları kullan
  variable: "--font-inter",
  display: "optional", // font yüklenemezse sistem fontlarını kullan
  preload: false,
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

const merryweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"], // Sadece gerekli ağırlıkları kullan
  style: ["normal"],
  variable: "--font-merryweather",
  display: "optional", // font yüklenemezse sistem fontlarını kullan
  preload: false,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const metadata: Metadata = {
  title: {
    template: "%s | UCS Agriculture",
    default: "UCS Agriculture",
  },
  description: "UCS Agriculture - Sustainable farming solutions",
  icons: {
    icon: "/icon.svg",
  },
  // themeColor removed from here and kept only in viewport export
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4D7C0F',
};

// TBT'yi azaltmak için ana iş parçacığını hafifletecek fonksiyon
const inlineScript = `
  // Partytown'ı aktifleştir
  window.partytown = true;

  // Performans ölçümlerini başlat
  performance.mark('custom-load-start');

  // Yüksek öncelikli görselleri hemen yükle, diğerlerini ertele
  function optimizeResourceLoading() {
    // Öncelik olmayan görsellerin ertelenmiş yüklenmesi
    function lazyLoadNonCriticalImages() {
      if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.removeAttribute('data-src');
                imageObserver.unobserve(lazyImage);
              }
            }
          });
        });
        
        lazyImages.forEach(function(lazyImage) {
          imageObserver.observe(lazyImage);
        });
      }
    }

    // Ana iş parçacığının aşırı yüklenmesini önlemek için setTimeout kullanımı
    setTimeout(lazyLoadNonCriticalImages, 2000);
  }

  // requestIdleCallback mevcut ise, tarayıcı boşta olduğunda çalıştırılacak
  if ('requestIdleCallback' in window) {
    requestIdleCallback(optimizeResourceLoading);
  } else {
    // Yoksa, kullanıcı deneyimini bozmayacak bir gecikme ile çalıştır
    setTimeout(optimizeResourceLoading, 1000);
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${poppins.variable} ${inter.variable} ${jakarta.variable} ${merryweather.variable}`}>
      <head>
        {/* HTTP/2 Server Push etkinleştirmek için kritik kaynaklara öncelik verelim */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://066e9a4f-a.b-cdn.net" crossOrigin="anonymous" />
        

        {/* LCP (Largest Contentful Paint) görselini yüksek öncelikle preload edelim */}
        <link
          rel="preload"
          href={hero1PreloadHref}
          as="image"
          type="image/webp"
          fetchPriority="high"
          {...(hero1IsCdn ? { crossOrigin: "anonymous" } : {})}
        />

        {/* Kritik olmayan görselleri daha düşük öncelikle preload edelim */}
          <link rel="preload" as="image" href="/logo.webp" fetchPriority="auto" />
        <link rel="preload" as="image" href="/icon.svg" fetchPriority="auto" />

        {/* CSS font tanımlarını inline olarak ekleyerek FOUT (Flash of Unstyled Text) önleyelim */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Sistem fontlarından başlayarak kademeli font kullanımı */
          @font-face {
            font-family: 'LocalFallbackFont';
            src: local('Arial'), local('Helvetica'), local('sans-serif');
            font-display: swap;
          }
          
          body {
            font-family: var(--font-manrope), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 'LocalFallbackFont', sans-serif;
          }
        `}} />

        {/* Partytown konfigürasyonu - script'leri web worker'larda çalıştırır */}
        <Partytown
          debug={process.env.NODE_ENV === 'development'}
          forward={['dataLayer.push']} // Google Analytics için
          lib="/~partytown/" // Partytown dosyalarının yolu
        />

        {/* Ana iş parçacığını bloke etmeyen (TBT'yi azaltan) script */}
        <script
          dangerouslySetInnerHTML={{ __html: inlineScript }}
          type="module"
        />
      </head>
      <body className="font-manrope">
        <Suspense fallback={<div className="h-[3px] bg-gray-200"></div>}>
          <ScrollIndicator />
        </Suspense>
        {children}
        
        {/* Örnek: Google Analytics'i Partytown ile yükleyelim - Bu ana iş parçacığını bloke etmez */}
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'YOUR-GOOGLE-ANALYTICS-ID');
            `
          }}
        />
        
        {/* Sayfa sonunda defer ile yüklenen non-blocking script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Sayfanın yüklenmesi tamamlandıktan sonra kritik olmayan işlevler
              document.addEventListener('DOMContentLoaded', function() {
                // Kritik olmayan kaynakları gecikmeli olarak yükleme
                function loadNonCriticalResources() {
                  // Sayfa önceden yüklenmiş durumda, ek işlemler yapılabilir
                  performance.mark('custom-load-end');
                  performance.measure('custom-load-time', 'custom-load-start', 'custom-load-end');
                }
                
                // Ana işlemci iş parçacığı boşken çalıştır
                if ('requestIdleCallback' in window) {
                  requestIdleCallback(loadNonCriticalResources, { timeout: 2000 });
                } else {
                  setTimeout(loadNonCriticalResources, 2000);
                }
              });
            `,
          }}
          defer
          async
        />
      </body>
    </html>
  );
}
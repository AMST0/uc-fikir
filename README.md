# UC FIKIR - Digital Menu Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Tech](https://img.shields.io/badge/tech-Next.js%2014%20%7C%20TypeScript%20%7C%20Postgres-black)

**UC FIKIR**, restoranlar ve kafeler için geliştirilmiş modern, QR tabanlı bir dijital menü platformudur. **Cemil Pub** için özel olarak tasarlanan bu demo, dinamik arayüzü, gelişmiş yönetim paneli ve hızlı performansı ile öne çıkar.

## 🚀 Özellikler

### 📱 Dijital Menü
- **Dinamik Faz Sistemi:** Günün saatine göre (Sabah, Öğle, Akşam) otomatik değişen tema ve öne çıkan ürünler.
- **Hızlı Filtreleme:** Kategori bazlı gezinme ve anlık ürün arama.
- **Akıllı Sepet:** Sepete ürün ekleme, not düşme ve masa numarası ile sipariş verme.
- **Görsel Şölen:** Yüksek kaliteli ürün görselleri ve akıcı (Framer Motion) animasyonlar.
- **Happy Hour:** Belirli saatlerde otomatik açılan kampanya bildirimleri.

### 🛡️ Yönetim Paneli (Admin)
- **Dashboard:** Günlük ciro, masa doluluk oranları ve en çok satılan ürünler.
- **Ürün Yönetimi:** Ürün ekleme, düzenleme, fiyat güncelleme ve stok durumu (Var/Yok) kontrolü.
- **Sipariş Takibi:** Gelen siparişleri anlık görüntüleme, durum değiştirme (Hazırlanıyor, Tamamlandı).
- **Analitik:** Hangi ürünlerin ve kategorilerin daha çok görüntülendiğini izleme.

## 🛠️ Teknolojiler

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons
- **Animasyon:** Framer Motion
- **Database:** Vercel Postgres (@vercel/postgres)
- **State Management:** React Context API

## 🏁 Kurulum (Local Development)

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Gereksinimler
- Node.js 18+
- NPM veya Yarn

### 2. Kurulum

```bash
# Bağımlılıkları yükleyin
npm install
```

### 3. Çevresel Değişkenler (.env)

Kök dizinde `.env` dosyası oluşturun ve Vercel Postgres bilgilerinizi ekleyin:

```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```

### 4. Çalıştırma

```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

### 5. Veritabanı (Opsiyonel)

Veritabanını sıfırlamak veya demo verileriyle doldurmak için Admin panelindeki "Ayarlar" sayfasını kullanabilirsiniz veya API'yi doğrudan çağırabilirsiniz:

- **POST** `/api/seed`

## 🤝 Katkıda Bulunma

1. Bu projeyi fork'layın.
2. Yeni bir branch oluşturun (`git checkout -b feature/YeniOzellik`).
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`).
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`).
5. Pull Request açın.

---
**Powered by UC FIKIR**

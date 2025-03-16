
# İnfoLine - Məktəb Məlumatları Toplama Sistemi
## Tətbiq Tələbləri Sənədi

## 1. LAYİHƏ XÜLASƏSİ

İnfoLine tətbiqi, Azərbaycanda məktəblərdən statistik məlumatların toplanması, analizi və hesabatlandırılması üçün nəzərdə tutulmuş mərkəzləşdirilmiş veb platformadır. Bu tətbiq SuperAdmin, Region adminləri, Sektor adminləri və Məktəb adminləri kimi 4 əsas rol üçün fərdiləşdirilmiş interfeyslər təmin edir.

**Ölçək**: 600+ məktəbi əhatə edəcək.
**Dil dəstəyi**: Azərbaycan, Rus, Türk, İngilis.

## 2. İSTİFADƏÇİ ROLLARI

### 2.1. SuperAdmin
SuperAdmin bütün sistemin idarəsini həyata keçirir:
- Regionları və Region adminlərini yaratma, silmə, redaktə etmə
- Sektorları və Sektor adminlərini yaratma, silmə, redaktə etmə
- Məktəbləri və Məktəb adminlərini yaratma, silmə, redaktə etmə
- Kateqoriyaları və sütunları yaratma, redaktə etmə, silmə
- Sistemin ümumi konfiqurasiyası
- Bütün istifadəçilərin səlahiyyətlərini idarə etmə
- Məlumatların sıfırlanması
- Toplu məlumat idxalı və ixracı

### 2.2. Region Admini
Region Admini öz regionu daxilində SuperAdmin-ə bənzər səlahiyyətlərə malikdir:
- Regiona aid sektorları və Sektor adminlərini idarə etmə
- Regiona aid məktəbləri və Məktəb adminlərini idarə etmə
- Region daxilində kateqoriyaları və sütunları idarə etmə
- Region məlumatlarının analizi və hesabatlandırılması
- Region daxilində məlumatları sıfırlama
- Toplu məlumat idxalı və ixracı (region daxilində)

### 2.3. Sektor Admini
Sektor Admini öz sektoru daxilində məlumatları idarə edir:
- Sektora aid məktəbləri və Məktəb adminlərini idarə etmə
- Məktəb adminləri tərəfindən daxil edilən məlumatları təsdiqləmə
- Sektor daxilində məlumatların analizi və ixracı
- Məlumat daxil etməyən məktəblərə bildirişlər göndərmə

### 2.4. Məktəb Admini
Məktəb Admini məlumatların ilkin daxil edilməsini həyata keçirir:
- Kateqoriyalara uyğun məlumatları daxil etmə
- Məlumatları redaktə etmə (təsdiqlənənə qədər)
- Excel vasitəsilə məlumatları toplu şəkildə yükləmə

## 3. SİSTEM FUNKSİONALLIĞI

### 3.1. Authentication və Authorization
- Çoxsəviyyəli, rol-əsaslı giriş sistemi
- Güclü parol siyasəti
- Şifrə bərpa mexanizmi
- Sessiya müddəti konfiqurasiyası
- Aktivlik tarixçəsinin izlənməsi

### 3.2. Təşkilati Struktur İdarəetməsi
- Region -> Sektor -> Məktəb iyerarxiyasının idarə edilməsi
- Excel vasitəsilə toplu məktəb və admin yükləmə imkanı
- İstifadəçi rollarının və səlahiyyətlərinin təyin edilməsi

### 3.3. Məlumat Strukturu İdarəetməsi
- Dinamik kateqoriya və sütun yaratma
- Kateqoriyaların təyinatının seçilməsi ("All" və "Sectors")
- Sütun tiplərinin konfiqurasiyası (mətn, rəqəm, tarix, seçim)
- Data limitləri və validasiya qaydalarının müəyyən edilməsi
- Məcburi sahələrin təyin edilməsi
- Son tarix konfiqurasiyası

### 3.4. Məlumat Daxil etmə və idarəetmə
- Microsoft Forms üslubunda interfeys (məktəb adminləri üçün)
- Excel şablonlarının yaradılması və istifadəsi
- Toplu məlumat idxalı və ixracı
- Məlumatların validasiyası
- Təsdiq və redaktə prosesi
- Dəyişikliklərin tarixçəsinin izlənməsi

### 3.5. Bildiriş Sistemi
- Daxili bildirişlər və email bildirişləri
- Son tarix xəbərdarlıqları
- Məlumat daxil etmə xatırlatmaları
- Təsdiq və redaktə bildirişləri
- Bildiriş parametrlərinin konfiqurasiyası

### 3.6. Hesabat və Analitika
- Fərdiləşdirilmiş dashboardlar hər rol üçün
- Filtirləmə və axtarış funksiyaları
- Excel formatında hesabat ixracı
- Vizual analizlər və qrafiklər
- Hesabat şablonlarının yaradılması və saxlanması

### 3.7. Arxivləşdirmə və Versiya Nəzarəti
- Məlumat dəyişikliklərinin tarixçəsi
- Silinmiş elementlərin arxivləşdirilməsi
- 30 günlük saxlama müddəti
- Versiya bərpası funksiyası

## 4. İNTERFEYS TƏLƏBLƏRİ

### 4.1. Ümumi Tələblər
- Responsive dizayn (desktop və mobil uyğunluq)
- Çoxdilli interfeys (Azərbaycan, Rus, Türk, İngilis)
- İntuisiyalı naviqasiya və istifadəçi dostu təcrübə
- Rol-əsaslı görünüş adaptasiyası
- Accessibility standartlarına uyğunluq

### 4.2. SuperAdmin Dashboard
- Sistem statistikası və ümumi məlumatlar
- Region, sektor və məktəb idarəetmə paneli
- Kateqoriya və sütun yaratma interfeysi
- İstifadəçi idarəetmə paneli
- Sistem konfiqurasiyası ayarları

### 4.3. Region Admini Dashboard
- Region statistikası və məlumatları
- Sektor və məktəblərin idarəetmə paneli
- Region kateqoriyaları və sütunları
- Region məlumatlarının analizi və hesabatları

### 4.4. Sektor Admini Dashboard
- Sektor statistikası
- Məktəb məlumatlarının izlənməsi
- Doldurulma faizi göstəriciləri
- Təsdiq gözləyən məlumatlar paneli
- Məlumatların analizi və hesabatları

### 4.5. Məktəb Admini Dashboard
- Doldurulması tələb olunan məlumatlar siyahısı
- Son tarixlər və vaxt göstəriciləri
- Microsoft Forms üslubunda məlumat daxil etmə interfeysi
- Təsdiq statuslarının izlənməsi
- Bildirişlər paneli

## 5. TEXNİKİ TƏLƏBLƏR

### 5.1. Performans
- 1 saniyədən az səhifə yüklənmə vaxtı
- Eyni anda 100+ istifadəçi ilə işləmə qabiliyyəti
- 10,000+ sətirlik Excel idxalı/ixracı dəstəyi
- Son müddət günlərində yüksək yüklənmə zamanı stabil işləmə

### 5.2. Təhlükəsizlik
- HTTPS protokolu
- Güclü şifrələmə və token-əsaslı autentifikasiya
- SQL injection və XSS müdafiəsi
- CSRF müdafiəsi
- Təhlükəsizlik auditi və izləmə

### 5.3. Verilənlər Bazası
- Relational verilənlər bazası strukturu
- İndexləmə və performans optimallaşdırması
- Transactional əməliyyatlar
- Backup və recovery prosedurları

### 5.4. Keşləmə və Optimallaşdırma
- Server-side və client-side keşləmə
- CDN inteqrasiyası
- Statik resursların optimallaşdırılması
- API çağırışlarının optimallaşdırılması

## İnkişaf Statusu

| Funksionallıq | Status | Qeydlər |
|---------------|--------|---------|
| Autentifikasiya | ✅ | Əsas autentifikasiya prosesi yaradılıb, bəzi xəta idarəetməsi təkmilləşdirilməlidir |
| Rol idarəetməsi | ✅ | Rol sistemi implementasiya edilib |
| Region idarəetməsi | ✅ | Əsas funksionallıq işləyir |
| Sektor idarəetməsi | ✅ | Əsas funksionallıq işləyir |
| Məktəb idarəetməsi | ✅ | Əsas funksionallıq işləyir |
| İstifadəçi idarəetməsi | ✅ | Əsas funksionallıq işləyir |
| Kateqoriya idarəetməsi | ✅ | Əsas funksionallıq işləyir |
| Sütun idarəetməsi | ✅ | Əsas funksionallıq işləyir |
| Məlumat daxil etmə | 🔄 | İnkişaf mərhələsində |
| Bildiriş sistemi | 🔄 | Əsas komponentlər var, tam inteqrasiya edilməyib |
| Excel Import/Export | 🔄 | Əsas funksionallıq var, sütun tipi əsaslı validasiya əlavə edilməlidir |
| Çoxdilli dəstək | ❌ | Hələ implementasiya edilməyib |
| Təsdiq mexanizmi | 🔄 | İnkişaf mərhələsində |
| Hesabatlar | 🔄 | Əsas komponentlər var, tam funksionallıq əlavə edilməlidir |
| Arxivləşdirmə | ❌ | Hələ implementasiya edilməyib |
| Versiya nəzarəti | ❌ | Hələ implementasiya edilməyib |
| Sistem ayarları | 🔄 | Əsas interfeys yaradılıb, tam funksionallıq əlavə edilməlidir |

## Tamamlanacaq işlər

1. **Autentifikasiya və Authorization təkmilləşdirmələri**
   - Token yeniləmə xətalarının həlli
   - Sessiya müddəti konfiqurasiyası
   - Aktivlik izləmə

2. **Məlumat daxil etmə və idarəetmə**
   - Microsoft Forms üslubunda tam interfeys
   - Excel şablonlarının yaradılması 
   - Toplu məlumat idxalı və validasiyası

3. **Bildiriş sistemi**
   - Real-time bildirişlər
   - Email bildirişləri
   - Son tarix xəbərdarlıqları

4. **Hesabat və Analitika**
   - Daha ətraflı statistik məlumatlar
   - Excel formatında hesabat ixracı 
   - Vizual analizlər və qrafiklər

5. **Çoxdilli dəstək**
   - Azərbaycan, Rus, Türk, İngilis dilləri üçün interfeys
   - Dil ayarları və dəyişdirmə funksionallığı

6. **Arxivləşdirmə və Versiya Nəzarəti**
   - Məlumat dəyişikliklərinin tarixçəsi
   - Silinmiş elementlərin arxivləşdirilməsi
   - Versiya bərpası funksiyası

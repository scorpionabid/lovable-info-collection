# Məktəb Məlumatları Toplama Sistemi - Verilənlər Bazası Sənədləşdirməsi

## 1. Verilənlər Bazası Ümumi Strukturu

Sistem InfoLine tətbiqi üçün mərkəzləşdirilmiş verilənlər bazası əsasında qurulmuşdur. Verilənlər bazası 37 cədvəl, 96 indeks, 12 trigger və 5 RLS (Row-Level Security) qaydası ehtiva edir. Verilənlər bazası PostgreSQL üzərində Supabase platforması vasitəsilə idarə olunur.

## 2. Cədvəllər və Funksional Qruplar

Verilənlər bazasındakı cədvəlləri funksional kateqoriyalara bölünür:

### 2.1. Əsas Məlumat Cədvəlləri

- **regions**: Regional bölgələri təmsil edir (id, name, description, code, created_at, updated_at)
- **sectors**: Regionlara aid sektorlar (id, name, description, region_id, created_at, updated_at)
- **schools**: Təhsil müəssisələri (id, name, region_id, sector_id, type_id, address, director, contact_email, contact_phone, student_count, teacher_count, created_at, updated_at)
- **school_types**: Məktəb növləri (id, name, description, is_active, created_at, updated_at)
- **categories**: Məlumat kateqoriyaları (id, name, region_id, sector_id, school_id, school_type_id, description, created_at, updated_at, created_by, assignment, status, priority)
- **columns**: Kateqoriyalara aid məlumat sahələri (id, name, type, category_id, required, options, description, created_at, updated_at)
- **data**: Faktiki məlumatlar JSON formatında (id, category_id, school_id, data, status, submitted_at, approved_at, approved_by, created_at, updated_at, created_by)

### 2.2. İstifadəçi İdarəetmə Cədvəlləri

- **users**: Sistemdəki istifadəçilər (id, email, first_name, last_name, role_id, created_at, updated_at, utis_code)
- **roles**: İstifadəçi rolları (id, name, description, created_at, updated_at)
- **profiles**: İstifadəçi profilləri (id, user_id, region_id, sector_id, school_id, created_at, updated_at)

### 2.3. Audit və Tarixçə Cədvəlləri

- **audit_logs**: Sistem əməliyyatlarının qeydiyyatı (id, action, table_name, record_id, old_data, new_data, user_id, created_at)
- **data_history**: Məlumat dəyişikliklərinin tarixçəsi (id, data_id, data, status, changed_at, changed_by)
- **table_versions**: Cədvəl versiyalarının idarəsi
- **form_entry_versions**: Form daxiletmə versiyaları

### 2.4. Bildiriş Sistemi

- **notifications**: İstifadəçilərə göndərilən bildirişlər
- **notification_templates**: Bildiriş şablonları
- **notification_groups**: Bildiriş qrupları
- **notification_channels**: Bildiriş kanalları
- **email_queue**: Email göndərmə növbəsi
- **push_notification_queue**: Push bildiriş növbəsi
- **reminder_recipients**: Xatırlatma bildirişlərinin alıcıları
- **reminders**: Bildiriş xatırlatmaları

### 2.5. Validasiya və Konfiqurasiya

- **validation_rules**: Məlumatların validasiyası üçün qaydalar
- **schema_definitions**: Dinamik sxem tərifləri
- **calculated_columns**: Hesablanmış sütunlar

### 2.6. Monitorinq və Performans

- **api_metrics**: API performans göstəriciləri
- **monitoring_metrics**: Sistem monitorinq göstəriciləri
- **performance_metrics**: Performans göstəriciləri
- **error_logs**: Xəta qeydləri

## 3. Əsas Əlaqələr

- **Region → Sektor → Məktəb**: Təşkilati iyerarxiya
- **İstifadəçi → Rol**: İstifadəçi rolları təyinatı
- **İstifadəçi → Profil**: İstifadəçi profil məlumatları
- **Kateqoriya → Sütun**: Sütunların kateqoriyalara təyinatı
- **Məktəb & Kateqoriya → Məlumat**: Daxil edilən məlumatlar

## 4. Triggerlər

1. **audit_categories_trigger**: Categories cədvəlindəki INSERT, UPDATE, DELETE əməliyyatlarını izləyir
2. **audit_columns_trigger**: Columns cədvəlindəki INSERT, UPDATE, DELETE əməliyyatlarını izləyir
3. **audit_data_trigger**: Data cədvəlindəki INSERT, UPDATE, DELETE əməliyyatlarını izləyir
4. **data_history_trigger**: Data cədvəlindəki dəyişiklikləri data_history cədvəlində saxlayır
5. **update_regions_updated_at**: Regions cədvəlində yeniləmə tarixini avtomatik yeniləyir

## 5. Funksiyalar

1. **İstifadəçi Rol Funksiyaları**:
   - `get_user_role()`: Cari istifadəçinin rolunu qaytarır
   - `is_super_admin()`, `is_region_admin()`, `is_sector_admin()`, `is_school_admin()`: Rol yoxlamaları

2. **Təşkilati Funksiyalar**:
   - `get_user_region_id()`, `get_user_sector_id()`, `get_user_school_id()`: İstifadəçiyə aid təşkilati vahidləri qaytarır

3. **Bildiriş Funksiyaları**:
   - `send_notification()`: İstifadəçiyə bildiriş göndərir
   - `mark_notification_read()`, `mark_all_notifications_read()`: Bildiriş statuslarını idarə edir

4. **Audit Funksiyaları**:
   - `audit_trigger_function()`: Audit məlumatlarını qeyd edir
   - `data_history_trigger_function()`: Məlumat dəyişiklik tarixçəsini saxlayır
   - `update_updated_at_column()`: Yeniləmə tarixini avtomatik yeniləyir

## 6. RLS (Row-Level Security) Qaydaları

İstifadəçilər cədvəlində tətbiq edilmiş təhlükəsizlik qaydaları:

1. **"Region admins can manage users in their region"**: Region adminləri yalnız öz regionlarındakı istifadəçiləri idarə edə bilərlər
2. **"School admins can manage users in their school"**: Məktəb adminləri yalnız öz məktəblərindəki istifadəçiləri idarə edə bilərlər
3. **"Sector admins can manage users in their sector"**: Sektor adminləri yalnız öz sektorlarındakı istifadəçiləri idarə edə bilərlər
4. **"Super admins can manage all users"**: Super adminlər bütün istifadəçiləri idarə edə bilərlər
5. **"Users can view their own profile"**: İstifadəçilər yalnız öz profillərini görə bilərlər

Bu qaydalar tələblər sənədində təsvir edilmiş rol-əsaslı giriş sisteminə tam uyğundur.

## 7. Verilənlər İdarəetməsi

- **JSONB Formatı**: Data cədvəlində məlumatlar JSONB formatında saxlanılır, bu da çevik məlumat strukturu yaratmağa imkan verir.
- **Audit və Tarixçə**: Məlumat dəyişiklikləri data_history və audit_logs cədvəllərində saxlanılır.
- **Validasiya**: validation_rules cədvəli vasitəsilə məlumatların doğruluğu təmin edilir.

## 8. İndekslər

Verilənlər bazasında 96 indeks mövcuddur və bunlar əsasən aşağıdakı növlərə bölünür:

1. **İlkin Açar İndeksləri**: Hər cədvəldə unikal identifikatorlar üçün
2. **Xarici Açar İndeksləri**: Cədvəllər arası əlaqələr üçün
3. **Performans İndeksləri**: Tez-tez istifadə edilən sorğuları sürətləndirmək üçün

## 9. Təhlükəsizlik Modeli

Verilənlər bazası SuperAdmin → Region Admin → Sektor Admin → Məktəb Admin iyerarxiyasına əsaslanan bir təhlükəsizlik modeli tətbiq edir. Hər bir rol səviyyəsi yalnız özünə aid olan və alt səviyyələrdəki məlumatlara giriş əldə edə bilər. Bu model RLS qaydaları vasitəsilə tətbiq edilir və tələblər sənədinə tam uyğundur.

## 10. Bildiriş Sistemi

Sistem avtomatik bildirişlər göndərir:
- Son tarix xəbərdarlıqları
- Təsdiq və rədd bildirişləri
- Məlumat daxil edilməsi xatırlatmaları

Bu bildirişlər notification_templates cədvəlindəki şablonlara əsaslanır və email_queue və push_notification_queue cədvəlləri vasitəsilə göndərilir.

## 11. Hesabat və Analitika

Sistemdə hesabatlar üçün materiallaşdırılmış görüntülər əvəzinə sorğular istifadə edilir. Hesabatlar məktəb, sektor və region səviyyəsində məlumatların doldurulma dərəcəsini, vaxtında təqdimatını və digər statistikaları əhatə edir.

Bu sənəd sistemin verilənlər bazasının ətraflı təsvirini təqdim edir və gələcək inkişafı üçün əsas təşkil edir.